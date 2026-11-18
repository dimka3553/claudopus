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
var GITHUB_BOX = "Claudopus needs GITHUB_TOKEN. Claudopus saves it only in this Mac's keychain. Claude uses it by name, and Claudopus hides it in anything a command shows.";
var NPM_BOX = "Claudopus needs NPM_TOKEN. Claudopus saves it only in this Mac's keychain. Claude uses it by name, and Claudopus hides it in anything a command shows.";
var ADMIN_BOX = "Claudopus needs the admin password of this Mac to run the command below. It goes only to that command and isn't saved, so the next one asks again.";
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
                expect(notified).toContain('Check the ears has a question for you | Paste this code on the GitHub page that opened.');
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
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Waiting for you' })];
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
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Waiting for you' })];
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
                expect(box === null || box === void 0 ? void 0 : box.props.placeholder).toBe('Or answer in words');
                return [4 /*yield*/, list.input({ key: (_25 = box === null || box === void 0 ? void 0 : box.key) !== null && _25 !== void 0 ? _25 : '', text: 'Where do I do that?' })];
            case 26:
                _40.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('Where do I do that?'); })];
                    }); }); })];
            case 27:
                toWork = (_26 = (_40.sent())) !== null && _26 !== void 0 ? _26 : '';
                expect(toWork).toContain('Submit it to the plugin directory.');
                expect(toWork).toContain('does not settle your question by itself');
                // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
                // and no buttons, box or send, on the small card and in Details
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Submit it to the plugin directory.' })];
            case 28:
                // At work on the reply, the ask is drawn in the work's purple, not as waiting on the person: its question with the reply under it,
                // and no buttons, box or send, on the small card and in Details
                _m.apply(void 0, [(_27 = (_40.sent())) === null || _27 === void 0 ? void 0 : _27.props.color]).toBe('#8A63F0');
                _o = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Waiting for you' })];
            case 29:
                _o.apply(void 0, [_40.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, ears.find({ type: 'Text', text: 'Claude is working on your reply' })];
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
                waiting = '✓ You answered “Where do I do that?” · Claude reads it next';
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
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Where do I do that?” · Claude is working on it' })];
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
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Done” · Claude reads it next' })];
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
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “claudopus” · Claude reads it next' })];
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
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '✓ Typed into Terminal, not run yet'; })];
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
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main” · Claude reads it next' })];
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
                        return [2 /*return*/, ears.find({ type: 'Text', text: '✓ You answered “main” · Claude reads it next' })];
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
test('while drawings of the panel are slow, as under seven tasks and their commands, one drawn afresh moments ago is given again as it was, buttons and all, until the gap is over, so a click amid a stream of changes names a button still there; a quick drawing and a press are drawn at once', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, slow, list, _a, _b, keys, before, _i, _c, n, _d, _e, _f, _g, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                clock = world(on).clock;
                slow = { isOn: false, n: 0 };
                on('session.model', function () {
                    slow.n += 1;
                    var until = Date.now() + (slow.isOn ? 300 : 0);
                    while (Date.now() < until)
                        ;
                    return { value: 'claude-opus-5-5' };
                });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'ears' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _j.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // Quick drawings: every change is drawn at once
                ];
            case 5:
                _j.sent();
                // Quick drawings: every change is drawn at once
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'q0', agentId: 'a2', text: 'Quick step of the ears.' })];
            case 6:
                // Quick drawings: every change is drawn at once
                _j.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Quick step of the ears.' })];
                    }); }); })];
            case 7:
                _a.apply(void 0, [_j.sent()]).toBeDefined();
                slow.isOn = true;
                return [4 /*yield*/, clock.advance(2000)];
            case 8:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f0', agentId: 'a2', text: 'Step 0 of the ears.' })];
            case 9:
                _j.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Step 0 of the ears.' })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [_j.sent()]).toBeDefined();
                keys = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return b.key; }).join(' ')];
                    }
                }); }); };
                return [4 /*yield*/, keys()
                    // Work writing faster than a drawing reaches the app: each ask for the panel within the gap gets the drawing on screen
                ];
            case 11:
                before = _j.sent();
                _i = 0, _c = [1, 2];
                _j.label = 12;
            case 12:
                if (!(_i < _c.length)) return [3 /*break*/, 17];
                n = _c[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "f".concat(n), agentId: 'a2', text: "Step ".concat(n, " of the ears.") })];
            case 13:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Step 0 of the ears.' })];
            case 14:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, keys()];
            case 15:
                _e.apply(void 0, [_j.sent()]).toBe(before);
                _j.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 12];
            case 17: 
            // The gap over, it is drawn afresh by itself, with the newest line
            return [4 /*yield*/, clock.advance(1500)];
            case 18:
                // The gap over, it is drawn afresh by itself, with the newest line
                _j.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Step 2 of the ears.' })];
                    }); }); })];
            case 19:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                // A press of the person's is drawn at once, whatever the gap
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'f3', agentId: 'a2', text: 'Step 3 of the ears.' })];
            case 20:
                // A press of the person's is drawn at once, whatever the gap
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Find more scans', prompt: 'more' }))];
            case 21:
                _j.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Find more scans' })];
            case 22:
                _g.apply(void 0, [_j.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(list, 'stats-open')];
            case 23:
                _j.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Find more scans' })];
                    }); }); })];
            case 24:
                _h.apply(void 0, [_j.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('two asks for the panel or the bar that come together, as from two windows of a chat or the engine\'s push beside the mod\'s, ask for it again only for a drawing made afresh that the engine dropped, and that ask is given it as made: they never overtake each other without end, each drawing a new pane under the pointer whose hover goes out', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, list, bar, recorded, redraws, before, _b, _c, _d, from, after, bars;
    var _this = this;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _f.sent();
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 4:
                bar = _f.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 5:
                _f.sent();
                recorded = function () { return __awaiter(_this, void 0, void 0, function () {
                    var path;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, clock.advance(2100)];
                            case 1:
                                _b.sent();
                                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                                return [2 /*return*/, ((_a = files.get(path !== null && path !== void 0 ? path : '')) !== null && _a !== void 0 ? _a : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); })];
                        }
                    });
                }); };
                redraws = function (lines) { return lines.filter(function (one) { return one.ev === 'redraw-all'; }).length; };
                // Nothing new since the last drawing: both asks are given the panel as it was, and nothing asks for it again
                return [4 /*yield*/, list.redraw()];
            case 6:
                // Nothing new since the last drawing: both asks are given the panel as it was, and nothing asks for it again
                _f.sent();
                _b = redraws;
                return [4 /*yield*/, recorded()];
            case 7:
                before = _b.apply(void 0, [_f.sent()]);
                return [4 /*yield*/, Promise.all([list.redraw(), list.redraw()])];
            case 8:
                _f.sent();
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(function () { return done(); }, 300); })];
            case 9:
                _f.sent();
                _c = expect;
                _d = redraws;
                return [4 /*yield*/, recorded()];
            case 10:
                _c.apply(void 0, [_d.apply(void 0, [_f.sent()])]).toBe(before);
                return [4 /*yield*/, recorded()];
            case 11:
                from = (_f.sent()).length;
                return [4 /*yield*/, Promise.all([bar.redraw(), bar.redraw()])];
            case 12:
                _f.sent();
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(function () { return done(); }, 300); })];
            case 13:
                _f.sent();
                return [4 /*yield*/, recorded()];
            case 14:
                after = (_f.sent()).slice(from);
                bars = after.filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; });
                expect(bars.filter(function (one) { return !one.held; }).length).toBe(1);
                expect((_e = bars.at(-1)) === null || _e === void 0 ? void 0 : _e.held).toBe(true);
                expect(redraws(after)).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('the bar above the prompt on the desktop, drawn as often as the panel under load, is given again as it was for a second after each drawing made afresh, and a tab of the mod\'s through a click on its buttons, so a click names one still there; both are then drawn afresh by themselves', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, slow, list, bar, _i, _b, _, path, renders, looked, config, says, _c, reset, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                slow = { isOn: false };
                on('session.model', function () {
                    var until = Date.now() + (slow.isOn ? 300 : 0);
                    while (Date.now() < until)
                        ;
                    return { value: 'claude-opus-5-5' };
                });
                // (written before the chat starts, as the person's own settings: one written after is not believed)
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 2:
                _h.sent();
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 4:
                bar = _h.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 5:
                _h.sent();
                slow.isOn = true;
                return [4 /*yield*/, list.redraw()];
            case 6:
                _h.sent();
                slow.isOn = false;
                return [4 /*yield*/, bar.redraw()
                    // Asked for again and again within the second: the drawing on screen each time
                ];
            case 7:
                _h.sent();
                _i = 0, _b = [1, 2, 3];
                _h.label = 8;
            case 8:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                _ = _b[_i];
                return [4 /*yield*/, bar.redraw()];
            case 9:
                _h.sent();
                _h.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, clock.advance(1500)];
            case 12:
                _h.sent();
                return [4 /*yield*/, bar.redraw()];
            case 13:
                _h.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 14:
                _h.sent();
                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                renders = ((_g = files.get(path !== null && path !== void 0 ? path : '')) !== null && _g !== void 0 ? _g : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); }).filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; });
                expect(renders.filter(function (one) { return one.held; }).length).toBeGreaterThanOrEqual(3);
                // and once the second is over, drawn afresh
                expect(renders.some(function (one, n) { var _a; return n > 0 && ((_a = renders[n - 1]) === null || _a === void 0 ? void 0 : _a.held) && !one.held; })).toBe(true);
                return [4 /*yield*/, bar.unmount()
                    // So is a tab of the mod's, Settings here, which every drawing of the panel draws again too (16 Nov: its Reset pressed, never
                    // reaching the mod). What it shows of the last look for an update tells a drawing made afresh from one given again
                ];
            case 15:
                _h.sent();
                looked = function (min) { return files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: clock.now() - min * 60000, version: '0.0.1', result: 'seen' })); };
                looked(5);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 16:
                config = _h.sent();
                says = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, config.redraw()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, config.findAll({ type: 'Text' })];
                            case 2: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; }).map(function (text) { var _a; return (_a = /Last checked (\d+m) ago/.exec(text)) === null || _a === void 0 ? void 0 : _a[1]; }).find(Boolean)];
                        }
                    });
                }); };
                _c = expect;
                return [4 /*yield*/, says()];
            case 17:
                _c.apply(void 0, [_h.sent()]).toBe('5m');
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 18:
                reset = (_h.sent()).find(function (one) { return one.props.label === 'Reset'; });
                expect(reset).toBeDefined();
                return [4 /*yield*/, $.ui.focus({ component: 'Pane', requestId: 'config', plugin: 'claudopus', element: reset === null || reset === void 0 ? void 0 : reset.key, isHeld: true, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 19:
                _h.sent();
                looked(20);
                return [4 /*yield*/, clock.advance(1200)];
            case 20:
                _h.sent();
                _d = expect;
                return [4 /*yield*/, says()];
            case 21:
                _d.apply(void 0, [_h.sent()]).toBe('5m');
                _e = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 22:
                _e.apply(void 0, [(_h.sent()).some(function (one) { return one.key === (reset === null || reset === void 0 ? void 0 : reset.key); })]).toBe(true);
                // and once the click is over, drawn afresh
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                // and once the click is over, drawn afresh
                _h.sent();
                _f = expect;
                return [4 /*yield*/, says()];
            case 24:
                _f.apply(void 0, [_h.sent()]).toBe('20m');
                return [4 /*yield*/, config.unmount()];
            case 25:
                _h.sent();
                return [4 /*yield*/, list.unmount()];
            case 26:
                _h.sent();
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
test('a button the panel draws again with the same key and the same look keeps the number the engine gave it, though the panel was drawn anew around it, so a click on the drawing still on screen names a button the engine still holds', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var list, numbers, first, bar, _a, second, _b, third, kept;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // Each drawn button's number, by its key: the number a click names, which the engine drops with the drawing it was made in
                ];
            case 2:
                list = _c.sent();
                numbers = function () { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                found = new Map();
                                walk = function (node) {
                                    var _a, _b;
                                    if (Array.isArray(node))
                                        return void node.forEach(walk);
                                    if (!node || typeof node !== 'object')
                                        return;
                                    var one = node;
                                    if (one.type === 'Button' && ((_a = one.props) === null || _a === void 0 ? void 0 : _a.key) && ((_b = one.press) === null || _b === void 0 ? void 0 : _b.handle) !== undefined)
                                        found.set(one.props.key, one.press.handle);
                                    walk(one.children);
                                };
                                _a = walk;
                                return [4 /*yield*/, list.drawn()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                return [4 /*yield*/, numbers()];
            case 3:
                first = _c.sent();
                bar = __spreadArray([], first.keys(), true).filter(function (key) { return /^(stats|config|about|memory)-open-\d+$/.test(key); });
                expect(bar.length).toBe(4);
                // A task starts: its card is drawn, so the whole panel is made anew, every button in it handed to the engine again
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the nose', prompt: 'fix' }))];
            case 4:
                // A task starts: its card is drawn, so the whole panel is made anew, every button in it handed to the engine again
                _c.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Fix the nose' })];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, numbers()];
            case 6:
                second = _c.sent();
                expect(__spreadArray([], second.keys(), true).some(function (key) { return /^open-a1-\d+$/.test(key); })).toBe(true);
                // The bar's buttons look as they did: each has the number it had, so a click on the drawing before still lands
                expect(bar.map(function (key) { return [key, second.get(key)]; })).toEqual(bar.map(function (key) { return [key, first.get(key)]; }));
                // and again as the task writes a line, its card's own buttons too
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the nose.' })];
            case 7:
                // and again as the task writes a line, its card's own buttons too
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Looking at the nose.' })];
                    }); }); })];
            case 8:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, numbers()];
            case 9:
                third = _c.sent();
                kept = __spreadArray([], second.keys(), true).filter(function (key) { return third.has(key); });
                expect(kept.length).toBeGreaterThanOrEqual(bar.length + 1);
                expect(kept.map(function (key) { return [key, third.get(key)]; })).toEqual(kept.map(function (key) { return [key, second.get(key)]; }));
                return [4 /*yield*/, list.unmount()];
            case 10:
                _c.sent();
                return [2 /*return*/];
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
test('an ask outlives the work that made it: amber after the work ends, with or without buttons of its own, until the person answers', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
test('a go-ahead to finish on ended work does its last step without waking it: a release in a repo with .release is held on the card for the allow, any other step goes to a small fresh task; a reply in words or the other choice still goes to the work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, resumed, appended, clock, wake, asked, written, cards, _i, _b, description, list, ask, press, _c, _d, deny, _e, _f, _g, quick, box, _h, _j, _k, description, working, gate5, _l, _m, _o, _p, _q, _r, _s, _t, beforeStop, _u, _v, _w, _x, _y;
    var _z;
    var _this = this;
    var _0, _1, _2, _3, _4;
    return __generator(this, function (_5) {
        switch (_5.label) {
            case 0:
                _a = world(on), files = _a.files, resumed = _a.resumed, appended = _a.appended, clock = _a.clock, wake = _a.wake, asked = _a.asked;
                on('state.set', function (_, e, next) { return ((e.key === 'todos' && (written = e.value)), next(e)); });
                cards = function () { var _a; return ((_a = written === null || written === void 0 ? void 0 : written.value) !== null && _a !== void 0 ? _a : []); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _5.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'four fixes', wait: false, origin: composer })];
            case 2:
                _5.sent();
                _i = 0, _b = ['Fix the nose', 'Fix the ear', 'Fix the chin', 'Fix the brow'];
                _5.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                description = _b[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', description: description, prompt: description }))];
            case 4:
                _5.sent();
                _5.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                // The worktrees: one released by its runner, one with no .release
            ];
            case 7:
                list = _5.sent();
                // The worktrees: one released by its runner, one with no .release
                files.set('/repo/wt/.release', 'mods/claudopus/bin/release');
                files.set('/repo/plain/README.md', '# plain');
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-nose');
                ask = function (id, last_step, folder) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(id), agentId: id, text: "Release ".concat(id, "?"), choices: ['Release it', 'Not now'], last_step: last_step, folder: folder })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: "turn-".concat(id), reason: 'answer', agentId: id })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                press = function (id, label) { return __awaiter(_this, void 0, void 0, function () {
                    var key;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { var _a; return b.props.label === label && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("ask-".concat(id, "-")); })) === null || _a === void 0 ? void 0 : _a.key];
                                    }
                                }); }); })];
                            case 1:
                                key = _a.sent();
                                return [4 /*yield*/, list.press({ key: key !== null && key !== void 0 ? key : '' })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, ask('a1', 'release', '/repo/wt')];
            case 8:
                _5.sent();
                return [4 /*yield*/, ask('a2', 'Merge the PR and look at the build', '/repo/plain')];
            case 9:
                _5.sent();
                return [4 /*yield*/, ask('a3', 'release', '/repo/wt')];
            case 10:
                _5.sent();
                return [4 /*yield*/, ask('a4', 'release', '/repo/wt')];
            case 11:
                _5.sent();
                return [4 /*yield*/, clock.advance(60000)
                    // Release it: the card holds the release's allow box for the branch, and the work is not started again
                ];
            case 12:
                _5.sent();
                // Release it: the card holds the release's allow box for the branch, and the work is not started again
                return [4 /*yield*/, press('a1', 'Release it')];
            case 13:
                // Release it: the card holds the release's allow box for the branch, and the work is not started again
                _5.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return /^gate-step-a1-.*once/.test(String((_a = b.key) !== null && _a !== void 0 ? _a : '')); })];
                        }
                    }); }); })];
            case 14:
                _c.apply(void 0, [_5.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Branch fix-nose' })];
            case 15:
                _d.apply(void 0, [_5.sent()]).toBeDefined();
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('last step of a1 on');
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 16:
                deny = (_5.sent()).find(function (b) { var _a; return /^gate-step-a1-.*deny/.test(String((_a = b.key) !== null && _a !== void 0 ? _a : '')); });
                return [4 /*yield*/, list.press({ key: (_0 = deny === null || deny === void 0 ? void 0 : deny.key) !== null && _0 !== void 0 ? _0 : '' })];
            case 17:
                _5.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (wake(), ((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').includes('release of wt: denied') ? true : undefined)];
                    }); }); })];
            case 18:
                _e.apply(void 0, [_5.sent()]).toBe(true);
                // Another last step: a small fresh task in the folder does it, started from the next hook of the mod (here the next press), and the
                // work is not started again
                return [4 /*yield*/, press('a2', 'Release it')];
            case 19:
                // Another last step: a small fresh task in the folder does it, started from the next hook of the mod (here the next press), and the
                // work is not started again
                _5.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').includes('last step of a2 on') ? 'step' : undefined)];
                    }); }); })];
            case 20:
                _f.apply(void 0, [_5.sent()]).toBe('step');
                // The other choice still goes to the work
                return [4 /*yield*/, press('a3', 'Not now')];
            case 21:
                // The other choice still goes to the work
                _5.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a3: ') && line.includes('pressed "Not now"'); })];
                    }); }); })];
            case 22:
                _g.apply(void 0, [_5.sent()]).toBeDefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, prompts.find(function (one) { return one.startsWith('Do the last step of the task "Fix the ear"'); })];
                    }); }); })];
            case 23:
                quick = _5.sent();
                expect(quick).toContain('Merge the PR and look at the build');
                expect(quick).toContain('Work in /repo/plain, on its branch fix-nose');
                // on Sonnet, the cheapest and fastest measured for a step stated this clearly
                expect(asked.at(-1)).toBe('sonnet');
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('does the last step of a2');
                expect(resumed.filter(function (line) { return line.startsWith('a1: ') || line.startsWith('a2: '); })).toEqual([]);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : '') && String(one.key).includes('a4'); })];
                        }
                    }); }); })];
            case 24:
                box = _5.sent();
                return [4 /*yield*/, list.input({ key: (_1 = box === null || box === void 0 ? void 0 : box.key) !== null && _1 !== void 0 ? _1 : '', text: 'Release it after lunch' })];
            case 25:
                _5.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a4: ') && line.includes('Release it after lunch'); })];
                    }); }); })];
            case 26:
                _h.apply(void 0, [_5.sent()]).toBeDefined();
                _j = 0, _k = ['Fix the jaw', 'Fix the cheek', 'Fix the lip', 'Fix the neck', 'Fix the mouth'];
                _5.label = 27;
            case 27:
                if (!(_j < _k.length)) return [3 /*break*/, 30];
                description = _k[_j];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', description: description, prompt: description }))];
            case 28:
                _5.sent();
                _5.label = 29;
            case 29:
                _j++;
                return [3 /*break*/, 27];
            case 30:
                working = function (id, last_step, folder) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(id), agentId: id, text: "Release ".concat(id, "?"), choices: ['Release it', 'Not now'], last_step: last_step, folder: folder })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, press(id, 'Release it')];
                            case 2:
                                _b.sent();
                                _a = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, appended.find(function (line) { return line.startsWith("".concat(id, ": ")) && line.includes('pressed "Release it"'); })];
                                    }); }); })];
                            case 3:
                                _a.apply(void 0, [_b.sent()]).toContain('do not do it or start it yourself');
                                return [2 /*return*/];
                        }
                    });
                }); };
                gate5 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return /^gate-step-a5-.*once/.test(String((_a = b.key) !== null && _a !== void 0 ? _a : '')); })];
                    }
                }); }); };
                return [4 /*yield*/, working('a5', 'release', '/repo/wt')];
            case 31:
                _5.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You pressed “Release it” · Claudopus does it when Claude is done' })];
                    }); }); })];
            case 32:
                _l.apply(void 0, [_5.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(60000)];
            case 33:
                _5.sent();
                _m = expect;
                return [4 /*yield*/, gate5()];
            case 34:
                _m.apply(void 0, [_5.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a5', agentId: 'a5', message: 'Claudopus releases it.' })];
            case 35:
                _5.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Claudopus releases it.', durationMs: 1, isAborted: false, turnId: 'turn-a5', reason: 'answer', agentId: 'a5' })];
            case 36:
                _5.sent();
                _o = expect;
                return [4 /*yield*/, until(gate5)];
            case 37:
                _o.apply(void 0, [_5.sent()]).toBeDefined();
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('last step of a5 on');
                _q = (_p = list).press;
                _z = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 38: 
            // (denied, as the kit's held box looks again at once and would hold the file open)
            return [4 /*yield*/, _q.apply(_p, [(_z.key = (_3 = (_2 = (_5.sent()).find(function (b) { var _a; return /^gate-step-a5-.*deny/.test(String((_a = b.key) !== null && _a !== void 0 ? _a : '')); })) === null || _2 === void 0 ? void 0 : _2.key) !== null && _3 !== void 0 ? _3 : '', _z)])];
            case 39:
                // (denied, as the kit's held box looks again at once and would hold the file open)
                _5.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        return [2 /*return*/, (wake(), ((_b = ((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').match(/release of wt: denied/g)) === null || _b === void 0 ? void 0 : _b.length) === 2 ? true : undefined)];
                    }); }); })];
            case 40:
                _r.apply(void 0, [_5.sent()]).toBe(true);
                return [4 /*yield*/, working('a6', 'Merge the PR and look at the build', '/repo/plain')];
            case 41:
                _5.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Claudopus merges it.', durationMs: 1, isAborted: false, turnId: 'turn-a6', reason: 'answer', agentId: 'a6' })
                    // (found by its question: the small task a2's step started took the next number)
                ];
            case 42:
                _5.sent();
                // (found by its question: the small task a2's step started took the next number)
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, prompts.find(function (one) { return one.startsWith('Do the last step of the task') && one.includes('(to: Release a6?)'); })];
                    }); }); })];
            case 43:
                // (found by its question: the small task a2's step started took the next number)
                _s.apply(void 0, [_5.sent()]).toContain('Merge the PR and look at the build');
                return [4 /*yield*/, working('a7', 'release', '/repo/wt')
                    // (Claude Code refused a call of its in that turn: the question back takes that notice's place, in the chat too)
                ];
            case 44:
                _5.sent();
                // (Claude Code refused a call of its in that turn: the question back takes that notice's place, in the chat too)
                files.set('auto-refuse', 'Edit');
                return [4 /*yield*/, $.tool.call({ tool: 'Edit', tool_use_id: 'e-a7', agentId: 'a7', file_path: '/repo/wt/notes.md', old_string: 'old', new_string: 'new' })];
            case 45:
                _5.sent();
                files.delete('auto-refuse');
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.includes('Claude Code blocked this task'); })];
                    }); }); })];
            case 46:
                _t.apply(void 0, [_5.sent()]).toBeDefined();
                beforeStop = appended.length;
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 'turn-a7', reason: 'answer', agentId: 'a7' })];
            case 47:
                _5.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return b.props.label === 'Release it' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('ask-a7-'); })];
                        }
                    }); }); })];
            case 48:
                _u.apply(void 0, [_5.sent()]).toBeDefined();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.slice(beforeStop).find(function (line) { return line.includes('Release a7?'); })];
                    }); }); })];
            case 49:
                _v.apply(void 0, [_5.sent()]).toBeDefined();
                expect(appended.slice(beforeStop).filter(function (line) { return line.includes('Claude took back its question in'); })).toHaveLength(1);
                expect(files.get("".concat(MEMORY, "/log.md"))).not.toContain('last step of a7 on');
                // nor when it asks something else before its turn ends; what it recorded as waiting for the go-ahead, as its card's question, is
                // then open again in its result, not answered by a Release it that did nothing
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__waits', tool_use_id: 'w-a8', agentId: 'a8', items: [{ text: 'Release a8 with the neck fix?', asked: true }] })];
            case 50:
                // nor when it asks something else before its turn ends; what it recorded as waiting for the go-ahead, as its card's question, is
                // then open again in its result, not answered by a Release it that did nothing
                _5.sent();
                return [4 /*yield*/, working('a8', 'release', '/repo/wt')];
            case 51:
                _5.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k-a8b', agentId: 'a8', text: 'A check failed: may I fix it first?', choices: ['Fix it', 'Not now'] })];
            case 52:
                _5.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'May I fix it first?', durationMs: 1, isAborted: false, turnId: 'turn-a8', reason: 'answer', agentId: 'a8' })];
            case 53:
                _5.sent();
                _w = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "Claudopus didn't do “Release it” · Claude asked something else first" })];
                    }); }); })];
            case 54:
                _w.apply(void 0, [_5.sent()]).toBeDefined();
                expect(files.get("".concat(MEMORY, "/log.md"))).not.toContain('last step of a8 on');
                expect((_4 = cards().find(function (one) { return one.id === 'a8'; })) === null || _4 === void 0 ? void 0 : _4.waits).toEqual([{ text: 'Release a8 with the neck fix?', ask: expect.any(Number) }]);
                // A call Claude Code refused in that turn is Claudopus's notice on the card, not another question: the step is still done
                return [4 /*yield*/, working('a9', 'Merge the PR and look at the build', '/repo/plain')];
            case 55:
                // A call Claude Code refused in that turn is Claudopus's notice on the card, not another question: the step is still done
                _5.sent();
                files.set('auto-refuse', 'Edit');
                return [4 /*yield*/, $.tool.call({ tool: 'Edit', tool_use_id: 'e-a9', agentId: 'a9', file_path: '/repo/plain/notes.md', old_string: 'old', new_string: 'new' })];
            case 56:
                _5.sent();
                files.delete('auto-refuse');
                _x = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Claude Code blocked this task: Change the file notes.md.' })];
                    }); }); })];
            case 57:
                _x.apply(void 0, [_5.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'Claudopus merges it.', durationMs: 1, isAborted: false, turnId: 'turn-a9', reason: 'answer', agentId: 'a9' })];
            case 58:
                _5.sent();
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').includes('last step of a9 on') ? true : undefined)];
                    }); }); })];
            case 59:
                _y.apply(void 0, [_5.sent()]).toBe(true);
                expect(resumed.filter(function (line) { return /^a[56789]: /.test(line); })).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 60:
                _5.sent();
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
                expect(told).toContain('does not settle your question by itself');
                expect(told).toContain('this answer starts you again');
                // The card stays among the running cards, at work, with its question and the reply under it, and no buttons, box or send;
                // nothing is under Finished
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Show me images first.” · Claude reads it next' })];
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
    var _a, appended, logged, clock, list, ASK, DETAILS, inputs, labels, relays, _b, _c, box, _d, _e, _f, _g, _h, _j, toChat, _k, _l, again, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
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
                relays = function () { return appended.filter(function (line) { return line.startsWith('undefined: In the background task') && line.includes(ASK); }).length; };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, relays() || undefined];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_9.sent()]).toBe(1);
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
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You answered “I would say maybe stop it/ })];
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
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ✓ The person replied to "Why the M4 is stuck"'); })];
                    }); }); })];
            case 16:
                toChat = (_5 = (_9.sent())) !== null && _5 !== void 0 ? _5 : '';
                expect(toChat).toContain('will ask again if it still needs the person');
                expect(toChat).not.toContain('It still asks');
                expect(logged.filter(function (line) { return line.startsWith('✓'); })).toEqual([]);
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
                return [4 /*yield*/, list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 22:
                _m.apply(void 0, [_9.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (relays() === 2 ? true : undefined)];
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
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Stop it” · Claude reads it next' })];
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
                        return [2 /*return*/, (relays() === 3 ? true : undefined)];
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
                        return [2 /*return*/, (relays() === 4 ? true : undefined)];
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
test('a button answer pressed by mistake is taken back from its card while the card says it: the question comes back with its buttons, the work is told not to act on it, and the next press answers; gone once the work asks again: the 16 Nov "Not now" pressed while reaching for the picture', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, clock, list, ASK, labels, press, _b, _c, _d, _e, _f, _g, _h, _j, _k, stale, _l, _m, _o;
    var _this = this;
    var _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _a = world(on), appended = _a.appended, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Make the banner', prompt: 'banner' }))];
            case 2:
                _r.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _r.sent();
                ASK = 'Use banner 5 on your page?';
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); })];
                    }
                }); }); };
                press = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = list).press;
                                _c = {};
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent()).find(function (b) { return String(b.props.label) === label; })) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: ASK, choices: ['Use it', 'Not now'] })];
            case 4:
                _r.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Not now') ? true : undefined)];
                        }
                    }); }); })];
            case 5:
                _b.apply(void 0, [_r.sent()]).toBe(true);
                return [4 /*yield*/, press('Not now')];
            case 6:
                _r.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Not now"'); })];
                    }); }); })];
            case 7:
                _c.apply(void 0, [_r.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('↶ Take back “Not now”') ? true : undefined)];
                        }
                    }); }); })];
            case 8:
                _d.apply(void 0, [_r.sent()]).toBe(true);
                return [4 /*yield*/, press('↶ Take back “Not now”')];
            case 9:
                _r.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('took back their answer "Not now"'); })];
                    }); }); })];
            case 10:
                _e.apply(void 0, [_r.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Use it') ? true : undefined)];
                        }
                    }); }); })];
            case 11:
                _f.apply(void 0, [_r.sent()]).toBe(true);
                _g = expect;
                return [4 /*yield*/, labels()];
            case 12:
                _g.apply(void 0, [_r.sent()]).not.toContain('↶ Take back “Not now”');
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ASK })];
            case 13:
                _h.apply(void 0, [_r.sent()]).toBeDefined();
                // Answered again, it goes as any answer
                return [4 /*yield*/, press('Use it')];
            case 14:
                // Answered again, it goes as any answer
                _r.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Use it"'); })];
                    }); }); })];
            case 15:
                _j.apply(void 0, [_r.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('↶ Take back “Use it”') ? true : undefined)];
                        }
                    }); }); })];
            case 16:
                _k.apply(void 0, [_r.sent()]).toBe(true);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 17:
                stale = (_q = (_p = (_r.sent()).find(function (b) { return String(b.props.label) === '↶ Take back “Use it”'; })) === null || _p === void 0 ? void 0 : _p.key) !== null && _q !== void 0 ? _q : '';
                return [4 /*yield*/, clock.advance(1000)];
            case 18:
                _r.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Upload it now?', choices: ['Upload', 'Not now'] })];
            case 19:
                _r.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Upload') ? true : undefined)];
                        }
                    }); }); })];
            case 20:
                _l.apply(void 0, [_r.sent()]).toBe(true);
                _m = expect;
                return [4 /*yield*/, labels()];
            case 21:
                _m.apply(void 0, [_r.sent()]).not.toContain('↶ Take back “Use it”');
                return [4 /*yield*/, list.press({ key: stale }).catch(function () { return undefined; })];
            case 22:
                _r.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                _r.sent();
                expect(appended.some(function (line) { return line.includes('took back their answer "Use it"'); })).toBe(false);
                _o = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Upload it now?' })];
            case 24:
                _o.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 25:
                _r.sent();
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
                                return [4 /*yield*/, details.find({ type: 'Text', text: 'Waiting for you' })];
                            case 9:
                                if (!(_e.sent())) return [3 /*break*/, 10];
                                _b = 'needs';
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, details.find({ type: 'Text', text: 'Claude is working on your reply' })];
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
                return [4 /*yield*/, desk.find({ type: 'Text', text: '1 task working' })];
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
                return [4 /*yield*/, desk.find({ type: 'Text', text: '1 question waiting for you' })];
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
    var _a, appended, submitted, logged, files, clock, list, asked, relay, _b, _c, _d, _e, _f, _g, _h, _j;
    var _k;
    var _this = this;
    var _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _a = world(on), appended = _a.appended, submitted = _a.submitted, logged = _a.logged, files = _a.files, clock = _a.clock;
                files.set('/w/shots/a.png', 'png');
                files.set('/w/shots/b.png', 'png');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw the logo', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw the logo', prompt: 'redraw the logo' }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which logo do you want?', choices: ['A', 'B'], pictures: ['/w/shots/a.png', '/w/shots/b.png', '/w/shots/gone.png', 'rel.png'] })];
            case 5:
                asked = _p.sent();
                expect(String(asked.result)).toContain('shown in the chat as a notice from the panel');
                expect(String(asked.result)).toContain('Its 2 pictures are drawn small on the card');
                expect(String(asked.result)).toContain('2 of the pictures given are no picture file found here');
                // The chat shows nothing of the ask, which is on its card, and never a prompt in the person's place (18 Nov: a line in the chat
                // for every ask was among "these fucking shits within the chat"); its model reads the ask, and how to pass an answer on, in a row
                // the person does not see
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                // The chat shows nothing of the ask, which is on its card, and never a prompt in the person's place (18 Nov: a line in the chat
                // for every ask was among "these fucking shits within the chat"); its model reads the ask, and how to pass an answer on, in a row
                // the person does not see
                _p.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: In the background task "Redraw the logo", Claude asked the person'); })];
                    }); }); })];
            case 7:
                relay = (_l = (_p.sent())) !== null && _l !== void 0 ? _l : '';
                expect(submitted.some(function (line) { return line.includes('Which logo do you want?'); })).toBe(false);
                expect(logged.some(function (line) { return line.includes('Which logo do you want?'); })).toBe(false);
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
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 9:
                _p.sent();
                expect(appended.filter(function (line) { return line.includes('Claude asked the person') && line.includes('Which logo do you want?'); })).toHaveLength(1);
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                return [4 /*yield*/, $.prompt.submit({ text: 'B, but make it bluer', wait: false, origin: composer })];
            case 10:
                // The person answers in the chat, which passes their words on: the card stops asking, the work is told it is the answer
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Their answer: “B, but make it bluer”' })];
            case 11:
                _p.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Which logo do you want?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_p.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes("the person's own reply, typed by them in the chat, to your question: \"Which logo do you want?\""); })];
                    }); }); })];
            case 13:
                _c.apply(void 0, [_p.sent()]).toBeDefined();
                expect(appended.some(function (line) { return line.includes('Decide which of three it is'); })).toBe(false);
                // A press on the card no longer counts for that ask
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 14:
                // A press on the card no longer counts for that ask
                _d.apply(void 0, [(_p.sent()).find(function (b) { return b.props.label === 'B'; })]).toBeUndefined();
                // An ask answered on the card, or withdrawn by the work, is told to the chat's model alone: the card shows it
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'May I push it?', choices: ['Push', 'Not now'] })];
            case 15:
                // An ask answered on the card, or withdrawn by the work, is told to the chat's model alone: the card shows it
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 16:
                _p.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.some(function (line) { return line.includes('Claude asked the person') && line.includes('May I push it?'); }) || undefined];
                    }); }); })];
            case 17:
                _e.apply(void 0, [_p.sent()]).toBe(true);
                _g = (_f = list).press;
                _k = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18: return [4 /*yield*/, _g.apply(_f, [(_k.key = (_o = (_m = (_p.sent()).find(function (b) { return b.props.label === 'Push'; })) === null || _m === void 0 ? void 0 : _m.key) !== null && _o !== void 0 ? _o : '', _k)])];
            case 19:
                _p.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ✓ The person answered "Redraw the logo" on its card: “Push”'); })];
                    }); }); })];
            case 20:
                _h.apply(void 0, [_p.sent()]).toBeDefined();
                expect(logged.some(function (line) { return line.startsWith('✓'); })).toBe(false);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Sign in to Vercel.' })];
            case 21:
                _p.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 22:
                _p.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.some(function (line) { return line.includes('Claude asked the person') && line.includes('Sign in to Vercel.'); }) || undefined];
                    }); }); })];
            case 23:
                _j.apply(void 0, [_p.sent()]).toBe(true);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a1', text: '' })];
            case 24:
                _p.sent();
                expect(appended.some(function (line) { return line === 'undefined: Claude took back its question in "Redraw the logo". You don\'t need to answer it.'; })).toBe(true);
                expect(logged.some(function (line) { return line.startsWith('Claude took back its question'); })).toBe(false);
                expect(submitted).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 25:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test('an ask carries what it is about, whole, on the small card, in Details and in the chat: the 13 Nov "Release PR 54, with the exact differences as explained in the chat?" asked before its explanation arrived', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, logged, clock, notified, list, away, _b, _i, _c, text, _d, _e, _f, _g, text, _h, _j, bare, differences, asked, _k, big, _l, band, _m, relay, _o, _p, _q, _r, long, cutShort, _s, question, many, _t, _u, longRelay;
    var _v;
    var _this = this;
    var _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                _a = world(on), appended = _a.appended, logged = _a.logged, clock = _a.clock, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _0.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the wallet', wait: false, origin: composer })];
            case 2:
                _0.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the wallet', prompt: 'fix the wallet' }))];
            case 3:
                _0.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // What happened: the ask pointed at an explanation that reached the person only with the report, after the work ended. Now it is
                    // not shown at all: no card, no sound, no notice
                ];
            case 4:
                list = _0.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release PR 54 to production, with the exact differences as explained in the chat?', choices: ['Release it', 'Not now'] })];
            case 5:
                away = _0.sent();
                expect(String(away.result)).toContain('Not shown: the question points at an explanation');
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /Release PR 54/ })];
            case 6:
                _b.apply(void 0, [_0.sent()]).toBeUndefined();
                expect(notified.some(function (line) { return line.includes('Release PR 54'); })).toBe(false);
                _i = 0, _c = ['Release it, as I explained?', 'Release it with the differences above?', 'Release it (see above)?', 'Release it, as described in my report?', 'Release it as agreed?', 'Release it, see above?'];
                _0.label = 7;
            case 7:
                if (!(_i < _c.length)) return [3 /*break*/, 10];
                text = _c[_i];
                _d = expect;
                _e = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text, choices: ['Release it', 'Not now'] })];
            case 8:
                _d.apply(void 0, [_e.apply(void 0, [(_0.sent()).result])]).toContain('Not shown');
                _0.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                _f = 0, _g = ['Paste the code shown in your terminal.', 'Pick the logo shown in the pictures.', 'Should I post the summary in the chat?', 'Move the summary above the chart?', 'Add these numbers in the report?'];
                _0.label = 11;
            case 11:
                if (!(_f < _g.length)) return [3 /*break*/, 14];
                text = _g[_f];
                _h = expect;
                _j = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k-".concat(text), agentId: 'a1', text: text })];
            case 12:
                _h.apply(void 0, [_j.apply(void 0, [(_0.sent()).result])]).toContain('Shown on your card');
                _0.label = 13;
            case 13:
                _f++;
                return [3 /*break*/, 11];
            case 14: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1b', agentId: 'a1', text: 'Release the demo change?', choices: ['Release it', 'Not now'] })];
            case 15:
                bare = _0.sent();
                expect(String(bare.result)).toContain('It carries no details');
                differences = '**Refunds**\n\n- Today: a refund blocks every payout.\n- After: it is taken off the balance.\n\n**Screens**\n\n- "Compensation credits" becomes "Referral earnings".';
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: 'Release PR 54 to production?', details: differences, choices: ['Release it', 'Not now'] })];
            case 16:
                asked = _0.sent();
                expect(String(asked.result)).toContain('what it is about under it');
                expect(String(asked.result)).not.toContain('carries no details');
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 17:
                _k.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 18:
                big = _0.sent();
                _l = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: differences })];
            case 19:
                _l.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 20:
                band = _0.sent();
                _m = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '    The details are on its card' })];
            case 21:
                _m.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()
                    // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                ];
            case 22:
                _0.sent();
                // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                return [4 /*yield*/, clock.advance(10)];
            case 23:
                // The chat shows nothing of it, as the card carries it; the row the chat's model reads carries it whole
                _0.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], appended, true).reverse().find(function (line) { return line.startsWith('undefined: In the background task "Fix the wallet", Claude asked the person') && line.includes('Release PR 54 to production?'); })];
                    }); }); })];
            case 24:
                relay = (_w = (_0.sent())) !== null && _w !== void 0 ? _w : '';
                expect(logged.some(function (line) { return line.includes('Release PR 54 to production?'); })).toBe(false);
                expect(relay).toContain("what it is about, which the person sees in full with it on the card: ".concat(differences));
                // The chat is told not to say it again: the person has just read it
                expect(relay).toContain('do not repeat what it is about');
                _p = (_o = list).press;
                _v = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 25: 
            // A pressed answer still matches the ask that carries details
            return [4 /*yield*/, _p.apply(_o, [(_v.key = (_y = (_x = (_0.sent()).find(function (b) { return b.props.label === 'Release it'; })) === null || _x === void 0 ? void 0 : _x.key) !== null && _y !== void 0 ? _y : '', _v)])];
            case 26:
                // A pressed answer still matches the ask that carries details
                _0.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('"Release it"') && line.includes('Release PR 54 to production?'); })];
                    }); }); })];
            case 27:
                _q.apply(void 0, [_0.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: differences })];
            case 28:
                _r.apply(void 0, [_0.sent()]).toBeUndefined();
                long = "Release it? ".concat('The refund rule changes how a paid commission is taken back from the balance. '.repeat(6)).trim();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: long, choices: ['Release it', 'Not now'] })];
            case 29:
                cutShort = _0.sent();
                expect(String(cutShort.result)).toContain('whole at the top of its details');
                _s = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: long })];
            case 30:
                _s.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, big.findAll({ type: 'Text' })];
            case 31:
                question = (_0.sent()).find(function (one) { return one.props.bold && String(one.text).startsWith('Release it? The refund rule'); });
                expect(question).toBeDefined();
                expect(String(question === null || question === void 0 ? void 0 : question.text).length).toBeLessThanOrEqual(302);
                expect(String(question === null || question === void 0 ? void 0 : question.text)).toMatch(/[a-z.] …$/);
                many = Array.from({ length: 120 }, function (_, n) { return "- Line ".concat(n + 1, " of what changes on the payout screens."); }).join('\n');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a1', text: 'Release the payout screens?', details: many, choices: ['Release it', 'Not now'] })];
            case 32:
                _0.sent();
                _t = expect;
                return [4 /*yield*/, big.find({ type: 'Markdown', text: many })];
            case 33:
                _t.apply(void 0, [_0.sent()]).toBeDefined();
                _u = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: /The rest is in its Details\.$/ })];
            case 34:
                _u.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(10)];
            case 35:
                _0.sent();
                expect(logged.some(function (line) { return line.includes('Line 120 of what changes') || line.includes('Release the payout screens?'); })).toBe(false);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], appended, true).reverse().find(function (line) { return line.includes('Release the payout screens?') && line.includes('asked the person'); })];
                    }); }); })];
            case 36:
                longRelay = (_z = (_0.sent())) !== null && _z !== void 0 ? _z : '';
                expect(longRelay).toContain('(the rest is on the card)');
                expect(longRelay).not.toContain('Line 120 of what changes');
                return [4 /*yield*/, big.unmount()];
            case 37:
                _0.sent();
                return [4 /*yield*/, list.unmount()];
            case 38:
                _0.sent();
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
                        return [2 /*return*/, logged.find(function (line) { return line.includes('You answered "Red or blue?" from "Pick a colour" on its card after it was done'); })];
                    }); }); })];
            case 9:
                _d.apply(void 0, [_j.sent()]).toContain('after it was done: Blue.');
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('undefined: ') && line.includes("couldn't start that task again"); })];
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
test('in a chat the app runs on another Mac over ssh, a password or key the runners need is typed in the panel and goes only into the keychain', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                _b.apply(void 0, [_r.sent()]).toContain('its box in the Claudopus panel');
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
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('That has a line break, a curly quote'); })];
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
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You cancelled it. Nothing was saved, and the command that asked stops without it.' })];
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
test("where the bar above the prompt takes a box, a key box has no field in the panel, whose window the app drags to a field that holds the cursor: Paste the key or Give a response instead opens its field in the bar; the key goes only to the keychain, a response only to the command that asked, and one that looks like the key itself is held until the person says which", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, files, logged, keychain, clock, list, bar, fieldsIn, labelled, press, ask, key, _b, order, _c, _d, _e, _f, pasted, _g, _h, _j, _k, said, words, kept, _l, _m, _o, _p, slip, slipped, _q, _r, admin, _s;
    var _this = this;
    var _t, _u, _v;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), keep = _a.keep, settle = _a.settle, files = _a.files, logged = _a.logged, keychain = _a.keychain, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _w.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })];
            case 2:
                _w.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Deploy the site', prompt: 'deploy it' }))];
            case 3:
                _w.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                // Another task's runner, begun later, for another key: the box for GITHUB_TOKEN is still the first task's
                return [4 /*yield*/, clock.advance(500)];
            case 4:
                // Another task's runner, begun later, for another key: the box for GITHUB_TOKEN is still the first task's
                _w.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sign the build', prompt: 'sign it' }))];
            case 5:
                _w.sent();
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-2', agentId: 'a2', command: 'hold /plug/claudopus/bin/secret SIGNING_KEY here sign' }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 6:
                list = _w.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 7:
                bar = _w.sent();
                fieldsIn = function (site, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').includes(id); })];
                    }
                }); }); };
                labelled = function (site, label) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.props.label === label; })];
                    }
                }); }); };
                press = function (site, label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _this = this;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = site).press;
                                _c = {};
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, labelled(site, label)];
                                            case 1: return [2 /*return*/, (_a.sent())[0]];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                ask = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: 1700000000000 }));
                            return [4 /*yield*/, clock.advance(1000)];
                        case 1: return [2 /*return*/, (_a.sent())
                            // The key: no field in the panel, two buttons and Cancel; Paste the key opens the field in the bar, and the box says where it is
                        ];
                    }
                }); }); };
                key = '0a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(key)];
            case 8:
                _w.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: GITHUB_BOX })];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_w.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                order = (_w.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(order.indexOf('Deploy the site')).toBeGreaterThan(-1);
                expect(order.indexOf('Deploy the site')).toBeLessThan(order.indexOf(GITHUB_BOX));
                expect(order.indexOf(GITHUB_BOX)).toBeLessThan(order.indexOf('Sign the build'));
                expect(order.find(function (one) { return /needs? you|waiting for you/.test(one); })).toMatch(/^1 /);
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 11:
                _c.apply(void 0, [(_w.sent()).some(function (one) { return one.props.width === 1 && one.props.backgroundColor === '#E5A50A'; })]).toBe(true);
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, 'Answer in words')];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 12:
                _d.apply(void 0, [_w.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, fieldsIn(list, key)];
            case 13:
                _e.apply(void 0, [_w.sent()]).toEqual([]);
                _f = expect;
                return [4 /*yield*/, labelled(list, 'Cancel')];
            case 14:
                _f.apply(void 0, [(_w.sent()).length]).toBe(1);
                return [4 /*yield*/, press(list, 'Paste the key')];
            case 15:
                _w.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, key)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 16:
                pasted = _w.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: '✎ Type it in the box above the chat' })];
            case 17:
                _g.apply(void 0, [_w.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, fieldsIn(list, key)];
            case 18:
                _h.apply(void 0, [_w.sent()]).toEqual([]);
                return [4 /*yield*/, bar.input({ key: (_t = pasted === null || pasted === void 0 ? void 0 : pasted.key) !== null && _t !== void 0 ? _t : '', text: 'ghp_kept0nlyInKeychain' })];
            case 19:
                _w.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(key); })];
                    }); }); })];
            case 20:
                _j.apply(void 0, [_w.sent()]).toContain('-w "ghp_kept0nlyInKeychain"');
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, key)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 21:
                _k.apply(void 0, [_w.sent()]).toBe(true);
                expect(files.has("".concat(MEMORY, "/boxes/").concat(key, ".reply"))).toBe(false);
                said = '1a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(said)];
            case 22:
                _w.sent();
                return [4 /*yield*/, press(list, 'Answer in words')];
            case 23:
                _w.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, said)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })
                    // A key is one line; a response a box of four lines, as the reply box is, and neither has the small send button the app draws
                    // for a submitLabel
                ];
            case 24:
                words = _w.sent();
                // A key is one line; a response a box of four lines, as the reply box is, and neither has the small send button the app draws
                // for a submitLabel
                expect(pasted === null || pasted === void 0 ? void 0 : pasted.props.rows).toBeUndefined();
                expect(words === null || words === void 0 ? void 0 : words.props.rows).toBe(4);
                expect([pasted, words].some(function (one) { var _a; return 'submitLabel' in ((_a = one === null || one === void 0 ? void 0 : one.props) !== null && _a !== void 0 ? _a : {}); })).toBe(false);
                kept = keychain.length;
                // Sent with the row's Send, the big button first, Close the small one after it
                _l = expect;
                return [4 /*yield*/, bar.findAll({ type: 'Button' })];
            case 25:
                // Sent with the row's Send, the big button first, Close the small one after it
                _l.apply(void 0, [(_w.sent()).filter(function (b) { return ['Send', 'Close'].includes(String(b.props.label)); }).map(function (b) { var _a, _b; return [b.props.label, (_a = b.props.variant) !== null && _a !== void 0 ? _a : null, (_b = b.props.plain) !== null && _b !== void 0 ? _b : null]; })]).toEqual([['Send', 'primary', null], ['Close', null, true]]);
                return [4 /*yield*/, bar.input({ key: (_u = words === null || words === void 0 ? void 0 : words.key) !== null && _u !== void 0 ? _u : '', text: 'It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too', kind: 'change' })];
            case 26:
                _w.sent();
                return [4 /*yield*/, press(bar, 'Send')];
            case 27:
                _w.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get("".concat(MEMORY, "/boxes/").concat(said, ".reply"))];
                    }); }); })];
            case 28:
                _m.apply(void 0, [_w.sent()]).toBe('The person answered in the Claudopus panel instead of giving GITHUB_TOKEN, in their own words: It is already in /Users/sam/Documents/GitHub/3d-sandbox/.env.local as AI_GATEWAY_API_KEY, in the faceiq-labs branch too\n');
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (files.has("".concat(MEMORY, "/boxes/").concat(said, ".json")) ? undefined : true)];
                    }); }); })];
            case 29:
                _o.apply(void 0, [_w.sent()]).toBe(true);
                expect(keychain.length).toBe(kept);
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You answered in words. Your answer went to the command that asked, and nothing was saved.' })];
                    }); }); })];
            case 30:
                _p.apply(void 0, [_w.sent()]).toBeDefined();
                slip = '2a1e2d3c-4b5a-4987-a654-3210fedcba98';
                return [4 /*yield*/, ask(slip)];
            case 31:
                _w.sent();
                return [4 /*yield*/, press(list, 'Answer in words')];
            case 32:
                _w.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(bar, slip)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 33:
                slipped = _w.sent();
                return [4 /*yield*/, bar.input({ key: (_v = slipped === null || slipped === void 0 ? void 0 : slipped.key) !== null && _v !== void 0 ? _v : '', text: 'here: ghp_A1b2C3d4E5f6G7h8I9j0' })];
            case 34:
                _w.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bar.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('That looks like the key itself'); })];
                        }
                    }); }); })];
            case 35:
                _q.apply(void 0, [_w.sent()]).toBeDefined();
                expect(files.has("".concat(MEMORY, "/boxes/").concat(slip, ".reply"))).toBe(false);
                expect(logged.some(function (line) { return line.includes('A1b2C3'); })).toBe(false);
                return [4 /*yield*/, press(bar, 'Save as the key')];
            case 36:
                _w.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keychain.find(function (one) { return one.includes(slip); })];
                    }); }); })];
            case 37:
                _r.apply(void 0, [_w.sent()]).toContain('-w "ghp_A1b2C3d4E5f6G7h8I9j0"');
                expect(files.has("".concat(MEMORY, "/boxes/").concat(slip, ".reply"))).toBe(false);
                admin = '3a1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(admin, ".json"), JSON.stringify({ id: admin, kind: 'admin', host: 'here', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, clock.advance(1000)];
            case 38:
                _w.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fieldsIn(list, admin)];
                            case 1: return [2 /*return*/, (_a.sent())[0]];
                        }
                    }); }); })];
            case 39:
                _s.apply(void 0, [_w.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 40:
                _w.sent();
                return [4 /*yield*/, bar.unmount()];
            case 41:
                _w.sent();
                return [4 /*yield*/, settle()];
            case 42:
                _w.sent();
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
                _b.apply(void 0, [_e.sent()]).toContain('its box in the Claudopus panel');
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Command that asked: hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' })];
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
                expect(logged.find(function (line) { return line.includes('admin password of this Mac'); })).toContain('its box in the Claudopus panel');
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
                expect(all).toContain("That password was wrong. Claudopus needs the admin password of dima@m4.local to run the command below. It goes only to that command and isn't saved, so the next one asks again.");
                expect(all).toContain("That was shorter than 4 characters. ".concat(NPM_BOX));
                // A reason it does not know is left out
                expect(all).toContain("Claudopus needs OPENAI_KEY. Claudopus saves it only in this Mac's keychain. Claude uses it by name, and Claudopus hides it in anything a command shows.");
                expect(all === null || all === void 0 ? void 0 : all.join('\n')).not.toContain('Apple');
                expect(all).toContain('Name of the key to save, such as GITHUB_TOKEN. Claude uses it by this name.');
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
                answers = function () { return w.appended.filter(function (line) { return line.startsWith('a1: ') && line.includes('in answer to your question'); }); };
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
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Sending to Claude…' })];
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
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Claude reads it next' })];
                    }); }); })];
            case 8:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('an answer that could not be written says so on the card and puts its buttons back; pressed again it goes', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var s, order, _a, release, _b, _c, _d, again, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, askScene($, on)
                // Another work asks after it: newer, it goes under
            ];
            case 1:
                s = _g.sent();
                // Another work asks after it: newer, it goes under
                return [4 /*yield*/, s.clock.advance(1000)];
            case 2:
                // Another work asks after it: newer, it goes under
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the logo', prompt: 'draw it' }))];
            case 3:
                _g.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which logo?', choices: ['Round', 'Square'] })];
            case 4:
                _g.sent();
                order = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, s.list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).filter(function (text) { return text === 'Which logo?' || text === 'Release the branch?'; })];
                    }
                }); }); };
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 2 ? order() : undefined)];
                        }
                    }); }); })];
            case 5:
                _a.apply(void 0, [_g.sent()]).toEqual(['Release the branch?', 'Which logo?']);
                return [4 /*yield*/, s.key('Release it')];
            case 6:
                release = _g.sent();
                return [4 /*yield*/, s.clock.advance(1000)];
            case 7:
                _g.sent();
                s.failWrites(1000);
                return [4 /*yield*/, s.list.press({ key: release }).catch(function () { return undefined; })];
            case 8:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: "Couldn't send “Release it” to Claude · press it again" })];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, s.list.find({ type: 'Text', text: /^✓ You answered/ })];
            case 10:
                _c.apply(void 0, [_g.sent()]).toBeUndefined();
                expect(s.answers()).toEqual([]);
                // Its ask back, the card keeps its ask's place above the newer one: a failed press never moves it
                _d = expect;
                return [4 /*yield*/, order()];
            case 11:
                // Its ask back, the card keeps its ask's place above the newer one: a failed press never moves it
                _d.apply(void 0, [_g.sent()]).toEqual(['Release the branch?', 'Which logo?']);
                // Its buttons are back, and a press now answers it
                s.failWrites(0);
                return [4 /*yield*/, s.key('Release it')];
            case 12:
                again = _g.sent();
                expect(again).not.toBe('');
                return [4 /*yield*/, s.list.press({ key: again })];
            case 13:
                _g.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (s.answers().length ? s.answers() : undefined)];
                    }); }); })];
            case 14:
                _e.apply(void 0, [_g.sent()]).toHaveLength(1);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, s.list.find({ type: 'Text', text: '✓ You answered “Release it” · Claude reads it next' })];
                    }); }); })];
            case 15:
                _f.apply(void 0, [_g.sent()]).toBeDefined();
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
    var clock, _a, writes, counting, list, title, tall, still, _b, _c, i, _d, _e, _f, _g, _h, asked, _j, _k, _l, _m, _o, _p, _q;
    var _this = this;
    var _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                clock = world(on).clock;
                _a = watchWrites(on), writes = _a.writes, counting = _a.counting;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two pieces of work', wait: false, origin: composer })];
            case 2:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the nose', prompt: 'nose' }))
                    // (scrolled down: at the top only the running times stand still)
                ];
            case 4:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 20, bodyRows: 50 } }), surface: 'desktop' }))
                    // The list was 140 rows long a moment ago, as the app said on a scroll then
                ];
            case 5:
                list = _s.sent();
                // The list was 140 rows long a moment ago, as the app said on a scroll then
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 1, bodyRows: 50, contentRows: 140, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 6:
                // The list was 140 rows long a moment ago, as the app said on a scroll then
                _s.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 7:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })
                    // A press in the panel: drawn once for what it did, then still while the person is at it
                ];
            case 8:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 9:
                title = (_s.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('open-'); });
                expect(title).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_r = title === null || title === void 0 ? void 0 : title.key) !== null && _r !== void 0 ? _r : '' })];
            case 10:
                _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Text' })
                    // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                    // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                    // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                ];
            case 11:
                _s.sent();
                // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 20, by: 20, bodyRows: 50, contentRows: 90, origin: { kind: 'person' } }).catch(function () { return undefined; })];
            case 12:
                // Scrolled down by the person, who sees rows 20 to 70 of a list the app says is 90 rows tall: drawn at least as tall as the bottom
                // of what they see while they use it, so a card that shrinks never snaps the view up under them; and never taller, whatever the
                // list once was or the app says (16 Nov: held at its longest moment, it left blank space under three cards)
                _s.sent();
                tall = function () { return __awaiter(_this, void 0, void 0, function () { var _a; var _b, _c; return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = Number;
                            return [4 /*yield*/, list.find({ type: 'Box' })];
                        case 1: return [2 /*return*/, _a.apply(void 0, [(_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.props.minHeight) !== null && _c !== void 0 ? _c : 0])];
                    }
                }); }); };
                counting.isOn = true;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 13:
                still = _c.apply(_b, [(_s.sent()).map(function (one) { return one.text; })]);
                // Work writes a line and new work starts while the person is at it: nothing above the pointer moves (16 Nov, the button under it
                // moved by up to 184 px as cards grew and shrank)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Halfway through the ears.' })];
            case 14:
                // Work writes a line and new work starts while the person is at it: nothing above the pointer moves (16 Nov, the button under it
                // moved by up to 184 px as cards grew and shrank)
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the chin', prompt: 'chin' }))];
            case 15:
                _s.sent();
                i = 0;
                _s.label = 16;
            case 16:
                if (!(i < 13)) return [3 /*break*/, 20];
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _s.sent();
                _d = expect;
                _f = (_e = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 18:
                (_d.apply(void 0, [_f.apply(_e, [(_s.sent()).map(function (one) { return one.text; })])]).toBe(still));
                _s.label = 19;
            case 19:
                i++;
                return [3 /*break*/, 16];
            case 20: 
            // An ask comes: shown at once all the same
            return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a2', text: 'May I go on?', choices: ['Approve', 'Not now'] })];
            case 21:
                // An ask comes: shown at once all the same
                _s.sent();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'May I go on?' })];
            case 22:
                _g.apply(void 0, [_s.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, tall()];
            case 23:
                _h.apply(void 0, [_s.sent()]).toBe(70);
                _k = (_j = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 24:
                asked = _k.apply(_j, [(_s.sent()).map(function (one) { return one.text; })]);
                return [4 /*yield*/, clock.advance(30000)];
            case 25:
                _s.sent();
                _l = expect;
                _o = (_m = JSON).stringify;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 26:
                _l.apply(void 0, [_o.apply(_m, [(_s.sent()).map(function (one) { return one.text; })])]).not.toBe(asked);
                // with what came meanwhile, and its own height again
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Check the chin' })];
                    }); }); })];
            case 27:
                // with what came meanwhile, and its own height again
                _p.apply(void 0, [_s.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, tall()];
            case 28:
                _q.apply(void 0, [_s.sent()]).toBe(50);
                return [4 /*yield*/, list.unmount()];
            case 29:
                _s.sent();
                return [2 /*return*/];
        }
    });
}); });
test('folding Finished while scrolled down draws one card and the fold at their own height, even after the list was long', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _i, _a, what, _b, _c, n, list, fold, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var _p, _q;
    var _this = this;
    var _r, _s, _t, _u, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _x.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'five pieces of work', wait: false, origin: composer })];
            case 2:
                _x.sent();
                _i = 0, _a = ['ears', 'nose', 'chin', 'eyes', 'mouth'];
                _x.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                what = _a[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Check the ".concat(what), prompt: what }))];
            case 4:
                _x.sent();
                _x.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                _b = 0, _c = [2, 3, 4, 5];
                _x.label = 7;
            case 7:
                if (!(_b < _c.length)) return [3 /*break*/, 10];
                n = _c[_b];
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: "t".concat(n), reason: 'answer', agentId: "a".concat(n) })];
            case 8:
                _x.sent();
                _x.label = 9;
            case 9:
                _b++;
                return [3 /*break*/, 7];
            case 10: return [4 /*yield*/, clock.advance(2100)
                // The person opened Finished, the list ran to 300 rows as the app said, and they scrolled down to its fold, 200 rows in
            ];
            case 11:
                _x.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 200, bodyRows: 50 } }), surface: 'desktop' }))];
            case 12:
                list = _x.sent();
                fold = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished 4$/.test(String(b.props.label)); })];
                    }
                }); }); };
                _e = (_d = list).press;
                _p = {};
                _f = String;
                return [4 /*yield*/, fold()];
            case 13: return [4 /*yield*/, _e.apply(_d, [(_p.key = _f.apply(void 0, [(_r = (_x.sent())) === null || _r === void 0 ? void 0 : _r.key]), _p)])];
            case 14:
                _x.sent();
                _g = expect;
                return [4 /*yield*/, fold()];
            case 15:
                _g.apply(void 0, [(_s = (_x.sent())) === null || _s === void 0 ? void 0 : _s.props.label]).toBe('▾ Finished 4');
                return [4 /*yield*/, $.ui.scroll({ component: 'Pane', requestId: LIST.requestId, offset: 200, by: 20, bodyRows: 50, contentRows: 300, origin: { kind: 'person' } }).catch(function () { return undefined; })
                    // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
                    // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
                    // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
                ];
            case 16:
                _x.sent();
                _j = (_h = list).press;
                _q = {};
                _k = String;
                return [4 /*yield*/, fold()];
            case 17: 
            // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
            // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
            // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
            return [4 /*yield*/, _j.apply(_h, [(_q.key = _k.apply(void 0, [(_t = (_x.sent())) === null || _t === void 0 ? void 0 : _t.key]), _q)])];
            case 18:
                // They fold it: one card and the fold are left, drawn at the pane's own height, so the view comes back to them and no blank runs
                // under them to scroll through (17 Nov, Dima's screenshot: one card, the fold at the bottom and blank down to it. Held at the
                // list's longest moment on 0.2.170, and with the hold at the bottom of the view alone, blank down to where the fold was pressed)
                _x.sent();
                _l = expect;
                return [4 /*yield*/, fold()];
            case 19:
                _l.apply(void 0, [(_u = (_x.sent())) === null || _u === void 0 ? void 0 : _u.props.label]).toBe('▸ Finished 4');
                _m = expect;
                _o = Number;
                return [4 /*yield*/, list.find({ type: 'Box' })];
            case 20:
                _m.apply(void 0, [_o.apply(void 0, [(_w = (_v = (_x.sent())) === null || _v === void 0 ? void 0 : _v.props.minHeight) !== null && _w !== void 0 ? _w : 0])]).toBe(50);
                return [4 /*yield*/, list.unmount()];
            case 21:
                _x.sent();
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
test("the panel's recorder writes nothing unless switched on, and switched on writes the drawings, focus and typing as counts, never a letter typed, and switches itself off", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, files, list, box, recorded, _b, _c, _d, _e, _i, _f, text_1, _g, _h, path, text, events, _j, _k, typed, bar, barBox, open, _l, _m, _o, typed, _p, _q, second, barEvents, _r, _s, typed;
    var _t, _u, _v, _w;
    var _this = this;
    var _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                _a = world(on), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _9.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _9.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?' })];
            case 4:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _9.sent();
                box = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                recorded = function () { return __spreadArray([], files.keys(), true).filter(function (path) { return path.includes('/panel-record/'); }); };
                return [4 /*yield*/, clock.advance(3000)];
            case 6:
                _9.sent();
                _c = (_b = list).input;
                _t = {};
                return [4 /*yield*/, box()];
            case 7: return [4 /*yield*/, _c.apply(_b, [(_t.key = (_y = (_x = (_9.sent())) === null || _x === void 0 ? void 0 : _x.key) !== null && _y !== void 0 ? _y : '', _t.text = 'Zebra quartz 7731', _t.kind = 'change', _t)])];
            case 8:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 9:
                _9.sent();
                expect(recorded()).toEqual([]);
                // A switch left from long ago starts nothing, and goes
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                return [4 /*yield*/, clock.advance(3000)];
            case 10:
                _9.sent();
                _e = (_d = list).input;
                _u = {};
                return [4 /*yield*/, box()];
            case 11: return [4 /*yield*/, _e.apply(_d, [(_u.key = (_0 = (_z = (_9.sent())) === null || _z === void 0 ? void 0 : _z.key) !== null && _0 !== void 0 ? _0 : '', _u.text = 'Zebra quartz 7731 more', _u.kind = 'change', _u)])];
            case 12:
                _9.sent();
                return [4 /*yield*/, clock.advance(7000)];
            case 13:
                _9.sent();
                expect(recorded()).toEqual([]);
                expect(files.has("".concat(MEMORY, "/record-panel.on"))).toBe(false);
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(1700000016000));
                return [4 /*yield*/, clock.advance(3000)];
            case 14:
                _9.sent();
                return [4 /*yield*/, box()];
            case 15:
                _9.sent();
                _i = 0, _f = ['Q', 'Qu', 'Quiet lynx 4419'];
                _9.label = 16;
            case 16:
                if (!(_i < _f.length)) return [3 /*break*/, 20];
                text_1 = _f[_i];
                _h = (_g = list).input;
                _v = {};
                return [4 /*yield*/, box()];
            case 17: return [4 /*yield*/, _h.apply(_g, [(_v.key = (_2 = (_1 = (_9.sent())) === null || _1 === void 0 ? void 0 : _1.key) !== null && _2 !== void 0 ? _2 : '', _v.text = text_1, _v.kind = 'change', _v)])];
            case 18:
                _9.sent();
                _9.label = 19;
            case 19:
                _i++;
                return [3 /*break*/, 16];
            case 20: return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear.' })];
            case 21:
                _9.sent();
                return [4 /*yield*/, clock.advance(200000)];
            case 22:
                _9.sent();
                return [4 /*yield*/, box()];
            case 23:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 24:
                _9.sent();
                path = recorded()[0];
                text = (_3 = files.get(path !== null && path !== void 0 ? path : '')) !== null && _3 !== void 0 ? _3 : '';
                events = text.trim().split('\n').map(function (line) { return JSON.parse(line); });
                expect(events.some(function (one) { return one.ev === 'render'; })).toBe(true);
                // The reply box is found in the drawing, by its key and where it sits among the drawing's elements
                expect(events.some(function (one) { var _a; return (_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /-reply-/.test(input.key); }); })).toBe(true);
                expect(events.filter(function (one) { return one.ev === 'input'; }).map(function (one) { return one.count; })).toEqual([1, 2, 3]);
                for (_j = 0, _k = ['Quiet', 'lynx', '4419', 'Zebra', 'quartz', '7731', 'Qu"']; _j < _k.length; _j++) {
                    typed = _k[_j];
                    expect(text.includes(typed)).toBe(false);
                }
                expect(files.has("".concat(MEMORY, "/record-panel.on"))).toBe(false);
                // The bar above the prompt, where the desktop's reply box is drawn, is recorded the same way: its drawings with the box in them,
                // typing there as counts, and the panel's drawings beside it, which hold no reply box
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 25:
                bar = _9.sent();
                barBox = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bar.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, clock.advance(3000)];
            case 26:
                _9.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Answer in words'; })];
                        }
                    }); }); })];
            case 27:
                open = _9.sent();
                return [4 /*yield*/, list.press({ key: (_4 = open === null || open === void 0 ? void 0 : open.key) !== null && _4 !== void 0 ? _4 : '' })];
            case 28:
                _9.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, barBox()];
                    }); }); })];
            case 29:
                _l.apply(void 0, [_9.sent()]).toBeDefined();
                return [4 /*yield*/, box()];
            case 30:
                _9.sent();
                _m = 0, _o = ['M', 'Mo', 'Mossy heron 2203'];
                _9.label = 31;
            case 31:
                if (!(_m < _o.length)) return [3 /*break*/, 35];
                typed = _o[_m];
                _q = (_p = bar).input;
                _w = {};
                return [4 /*yield*/, barBox()];
            case 32: return [4 /*yield*/, _q.apply(_p, [(_w.key = (_6 = (_5 = (_9.sent())) === null || _5 === void 0 ? void 0 : _5.key) !== null && _6 !== void 0 ? _6 : '', _w.text = typed, _w.kind = 'change', _w)])];
            case 33:
                _9.sent();
                _9.label = 34;
            case 34:
                _m++;
                return [3 /*break*/, 31];
            case 35: return [4 /*yield*/, clock.advance(200000)];
            case 36:
                _9.sent();
                return [4 /*yield*/, barBox()];
            case 37:
                _9.sent();
                return [4 /*yield*/, clock.advance(3000)];
            case 38:
                _9.sent();
                second = (_8 = files.get((_7 = recorded().find(function (one) { return one !== path; })) !== null && _7 !== void 0 ? _7 : '')) !== null && _8 !== void 0 ? _8 : '';
                barEvents = second.trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); });
                expect(barEvents.some(function (one) { var _a; return one.ev === 'render' && one.component === 'AbovePrompt' && ((_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /^band-.*-reply-/.test(input.key); })); })).toBe(true);
                expect(barEvents.filter(function (one) { return one.ev === 'input' && one.site === 'bar'; }).map(function (one) { return one.count; })).toEqual([1, 2, 3]);
                expect(barEvents.some(function (one) { var _a; return one.ev === 'render' && one.component === 'Pane' && ((_a = one.inputs) === null || _a === void 0 ? void 0 : _a.some(function (input) { return /-reply-/.test(input.key); })); })).toBe(false);
                for (_r = 0, _s = ['Mossy', 'heron', '2203']; _r < _s.length; _r++) {
                    typed = _s[_r];
                    expect(second.includes(typed)).toBe(false);
                }
                return [4 /*yield*/, bar.unmount()];
            case 39:
                _9.sent();
                return [4 /*yield*/, list.unmount()];
            case 40:
                _9.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a reply never waits behind a long command: one that may run for minutes is refused with the same call to send in the background, a wait for the person is refused, and a short one held open is named on the card while the reply waits', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, keep, settle, clock, held, list, _i, _b, _c, n, description, r, _d, _e, _f, n, description, wait, _loop_2, _g, _h, _j, id, more, _k, _l, _m, id, more, r, launched, box, _o, _p, _q, _r, _, e_2_1, _s;
    var _this = this;
    var _t, e_2, _u, _v;
    var _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                _a = world(on), keep = _a.keep, settle = _a.settle, clock = _a.clock, held = _a.held;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _0.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'try the reply box', wait: false, origin: composer })];
            case 2:
                _0.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Reply box that never drags the panel', prompt: 'try the reply box' }))];
            case 3:
                _0.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _0.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Try the new reply box and tell me how it feels.', choices: ['It feels right', 'Still wrong'] })
                    // Waits that only mention the person, or come with no question open, are no waits for them
                ];
            case 5:
                _0.sent();
                _i = 0, _b = ['Wait for the preview to come up, then open it for you (30 s)', 'Wait until the page has loaded for you to see', 'Wait for your answer key upload to finish', 'Poll your decision tree training (about 1 min)', 'Wait for your CT scans to download'].entries();
                _0.label = 6;
            case 6:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                _c = _b[_i], n = _c[0], description = _c[1];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "ok".concat(n), agentId: 'a1', command: 'true', description: description })];
            case 7:
                r = (_0.sent());
                expect(r.deny).toBeUndefined();
                _0.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                _d = 0, _e = ['Wait for you to try the panel (up to 9 min)', 'Wait for your reply (up to 9 min)', 'Waiting on your answer to the release'].entries();
                _0.label = 10;
            case 10:
                if (!(_d < _e.length)) return [3 /*break*/, 13];
                _f = _e[_d], n = _f[0], description = _f[1];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "w".concat(n), agentId: 'a1', command: 'hold record', description: description, timeout: 600000 })];
            case 11:
                wait = (_0.sent());
                expect(wait.deny).toContain('End your step now');
                _0.label = 12;
            case 12:
                _d++;
                return [3 /*break*/, 10];
            case 13:
                expect(held.has('record')).toBe(false);
                _loop_2 = function (id, more) {
                    var r, sent;
                    return __generator(this, function (_1) {
                        switch (_1.label) {
                            case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: 'a1' }, more))];
                            case 1:
                                r = (_1.sent());
                                expect([id, r.deny]).toEqual([id, expect.stringContaining('Send the same call again with `run_in_background: true` and nothing else changed')]);
                                expect(r.deny).toContain('replies reach you while it runs');
                                expect(__spreadArray([], held.keys(), true).some(function (key) { return key.startsWith(id); })).toBe(false);
                                return [4 /*yield*/, $.tool.call(__assign(__assign({ tool: 'Bash', tool_use_id: "".concat(id, "b"), agentId: 'a1' }, more), { run_in_background: true }))];
                            case 2:
                                sent = (_1.sent());
                                expect([id, sent.deny, (_w = sent.result) === null || _w === void 0 ? void 0 : _w.backgroundTaskId]).toEqual([id, undefined, "bg-".concat(id, "b")]);
                                return [2 /*return*/];
                        }
                    });
                };
                _g = 0, _h = [['s1', { timeout: 600000, command: 'npm run build', description: 'Run the build' }], ['s2', { command: 'hold s2', description: 'Waiting for the CQ500 results (about 5 min)' }], ['s4', { timeout: 600000, description: 'Run the tests (about 6 min)', command: 'hold s4 &>test.log' }], ['s5', { timeout: 600000, command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Get the scans' }]];
                _0.label = 14;
            case 14:
                if (!(_g < _h.length)) return [3 /*break*/, 17];
                _j = _h[_g], id = _j[0], more = _j[1];
                return [5 /*yield**/, _loop_2(id, more)];
            case 15:
                _0.sent();
                _0.label = 16;
            case 16:
                _g++;
                return [3 /*break*/, 14];
            case 17:
                _k = 0, _l = [['q1', { timeout: 600000, command: 'git push', description: 'Push the branch' }], ['q2', { timeout: 300000, command: 'npm test', description: 'Run the tests' }], ['q3', { timeout: 600000, command: 'rg -n nose /repo', description: 'Look for the nose' }]];
                _0.label = 18;
            case 18:
                if (!(_k < _l.length)) return [3 /*break*/, 21];
                _m = _l[_k], id = _m[0], more = _m[1];
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: 'a1' }, more))];
            case 19:
                r = (_0.sent());
                expect([id, r.deny, (_x = r.result) === null || _x === void 0 ? void 0 : _x.backgroundTaskId]).toEqual([id, undefined, undefined]);
                _0.label = 20;
            case 20:
                _k++;
                return [3 /*break*/, 18];
            case 21: return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's3', agentId: 'a1', command: 'nohup python run.py > run.log 2>&1 & echo $!', description: 'Wait for the head check to start on every set (about 20 min)', timeout: 600000 })];
            case 22:
                launched = (_0.sent());
                expect(launched.deny).toBeUndefined();
                // A short one is held open as asked; a reply given meanwhile is received at once and names what it waits behind
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'hold build', description: 'Run the build' }));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.get('build')];
                    }); }); })];
            case 23:
                _0.sent();
                return [4 /*yield*/, clock.advance(70000)];
            case 24:
                _0.sent();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 25:
                box = (_0.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_y = box === null || box === void 0 ? void 0 : box.key) !== null && _y !== void 0 ? _y : '', text: 'Yep, looks good' })];
            case 26:
                _0.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.text.startsWith('✓ You answered “Yep, looks good” · Claude reads it when “Run the build” ends · running 1'); })];
                        }
                    }); }); })];
            case 27:
                _o.apply(void 0, [_0.sent()]).toBeDefined();
                (_z = held.get('build')) === null || _z === void 0 ? void 0 : _z('built');
                _0.label = 28;
            case 28:
                _0.trys.push([28, 33, 34, 39]);
                _p = true, _q = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _0.label = 29;
            case 29: return [4 /*yield*/, _q.next()];
            case 30:
                if (!(_r = _0.sent(), _t = _r.done, !_t)) return [3 /*break*/, 32];
                _v = _r.value;
                _p = false;
                _ = _v;
                void _;
                _0.label = 31;
            case 31:
                _p = true;
                return [3 /*break*/, 29];
            case 32: return [3 /*break*/, 39];
            case 33:
                e_2_1 = _0.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 39];
            case 34:
                _0.trys.push([34, , 37, 38]);
                if (!(!_p && !_t && (_u = _q.return))) return [3 /*break*/, 36];
                return [4 /*yield*/, _u.call(_q)];
            case 35:
                _0.sent();
                _0.label = 36;
            case 36: return [3 /*break*/, 38];
            case 37:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 38: return [7 /*endfinally*/];
            case 39:
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: '✓ You answered “Yep, looks good” · Claude is working on it' })];
                    }); }); })];
            case 40:
                _s.apply(void 0, [_0.sent()]).toBeDefined();
                return [4 /*yield*/, settle()];
            case 41:
                _0.sent();
                return [2 /*return*/];
        }
    });
}); });
test("where the bar above the prompt takes a box, a card's answers end with Reply in your own words, which opens the reply box in that bar and never in the panel or its Details, whose window the app drags to a box that holds the cursor (15 Nov); Close takes it away with what was typed kept; one box at a time; Change something on a Done card opens the same box, and what is sent from it starts that task again", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, clock, files, keep, resumed, submitted, list, details, boxesIn, says, labelled, OPEN, CLOSE, _b, _c, bar, _d, _e, _f, _g, term, _h, _j, _k, _l, _m, _o, shape, _p, _q, _r, _s, boxNumber, numbered, _t, _u, _v, _w, _x, _y, MARK, isShow, scrolled, _z, _0, _1, _2, barDrawings, growing, drawnBefore, typed, _i, _3, _4, n, line, _5, _6, _7, drawnAfter, _8, _9, n, _10, keyBox, _11, _12, first, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, folded, _55, _56, _57, _58, _59, _60, _61, _62, unfolded, _63, _64, _65, _66, _67, surveyed, _68, again, _69, _70, _71, _72, typedIn, _73, _74, _75, _76, _77, _78, _79, _80, _81, second, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, shut, five, _103, _104, _105, n, text, _106, _107, _108, _109, _110, _111, _112, key, _113, _114, top, _115, _116, _117, changeBox, changes, toldOfChange, wasSubmitted, _118, _119, _120, opened, _121, _122, _123, _124, _125, _126, _127, _128, _129, again2, sentAt, _130, _131, _132, _133;
    var _134, _135, _136, _137, _138, _139, _140, _141, _142, _143, _144, _145, _146, _147, _148, _149, _150, _151, _152, _153, _154, _155, _156, _157;
    var _this = this;
    var _158, _159, _160, _161, _162, _163, _164, _165, _166, _167, _168, _169, _170, _171, _172, _173, _174, _175, _176, _177, _178, _179, _180, _181, _182, _183, _184, _185, _186, _187, _188, _189, _190, _191, _192, _193, _194, _195, _196, _197, _198, _199, _200, _201, _202, _203, _204, _205, _206, _207, _208, _209, _210, _211, _212, _213, _214, _215, _216, _217, _218, _219, _220, _221, _222, _223, _224, _225, _226, _227, _228, _229, _230, _231, _232;
    return __generator(this, function (_233) {
        switch (_233.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), appended = _a.appended, clock = _a.clock, files = _a.files, keep = _a.keep, resumed = _a.resumed, submitted = _a.submitted;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _233.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'check the ears', wait: false, origin: composer })];
            case 2:
                _233.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which ear first?', choices: ['Left', 'Right'] })];
            case 4:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                list = _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                details = _233.sent();
                boxesIn = function (site) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                says = function (site, text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (one) { var _a; return text.test((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                labelled = function (site, label) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, site.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return b.props.label === label; })];
                    }
                }); }); };
                OPEN = 'Answer in words';
                CLOSE = 'Close';
                // A surface whose bar was never drawn keeps the card's own box: a reply in words can always be typed somewhere
                _b = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 7:
                // A surface whose bar was never drawn keeps the card's own box: a reply in words can always be typed somewhere
                _b.apply(void 0, [(_233.sent()).length]).toBe(1);
                _c = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 8:
                _c.apply(void 0, [(_233.sent()).length]).toBe(0);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 9:
                bar = _233.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1:
                                _a = (_b.sent()).length === 0;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(details)];
                            case 2:
                                _a = (_b.sent()).length === 0;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 10:
                _d.apply(void 0, [_233.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 11:
                _e.apply(void 0, [(_233.sent()).length]).toBe(0);
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 12:
                _f.apply(void 0, [(_233.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return ['Left', 'Right', OPEN].includes(label); })]).toEqual(['Left', 'Right', OPEN]);
                _g = expect;
                return [4 /*yield*/, labelled(details, OPEN)];
            case 13:
                _g.apply(void 0, [(_233.sent()).length]).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 14:
                term = _233.sent();
                _h = expect;
                return [4 /*yield*/, boxesIn(term)];
            case 15:
                _h.apply(void 0, [(_233.sent()).length]).toBe(1);
                _j = expect;
                return [4 /*yield*/, labelled(term, OPEN)];
            case 16:
                _j.apply(void 0, [(_233.sent()).length]).toBe(0);
                return [4 /*yield*/, term.unmount()
                    // Pressed: one box, in the bar, beside the name of the work it goes to and a Close; the card says where it is and offers to close it
                ];
            case 17:
                _233.sent();
                _l = (_k = list).press;
                _134 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 18: 
            // Pressed: one box, in the bar, beside the name of the work it goes to and a Close; the card says where it is and offers to close it
            return [4 /*yield*/, _l.apply(_k, [(_134.key = (_159 = (_158 = (_233.sent())[0]) === null || _158 === void 0 ? void 0 : _158.key) !== null && _159 !== void 0 ? _159 : '', _134)])];
            case 19:
                // Pressed: one box, in the bar, beside the name of the work it goes to and a Close; the card says where it is and offers to close it
                _233.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 20:
                _m.apply(void 0, [_233.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, says(bar, /^↳ Your answer to “Check the ears”$/)];
            case 21:
                _o.apply(void 0, [_233.sent()]).toBe(true);
                shape = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bar.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return ['Send', 'Close'].includes(String(b.props.label)); }).map(function (b) { var _a, _b; return [b.props.label, (_a = b.props.variant) !== null && _a !== void 0 ? _a : null, (_b = b.props.plain) !== null && _b !== void 0 ? _b : null]; })];
                    }
                }); }); };
                _p = expect;
                return [4 /*yield*/, shape()];
            case 22:
                _p.apply(void 0, [_233.sent()]).toEqual([['Send', 'primary', null], ['Close', null, true]]);
                // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
                // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
                _q = expect;
                _r = 'submitLabel';
                return [4 /*yield*/, boxesIn(bar)];
            case 23:
                // and Send is the only send: a submitLabel on the box is drawn by the desktop app as a second, small send button beside it
                // (17 Nov, the person: "there are two send buttons. Can you remove the small send button and just keep the big one?")
                _q.apply(void 0, [_r in ((_161 = (_160 = (_233.sent())[0]) === null || _160 === void 0 ? void 0 : _160.props) !== null && _161 !== void 0 ? _161 : {})]).toBe(false);
                // Four lines tall (17 Nov, the person: "the text box is usually very small")
                _s = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 24:
                // Four lines tall (17 Nov, the person: "the text box is usually very small")
                _s.apply(void 0, [(_162 = (_233.sent())[0]) === null || _162 === void 0 ? void 0 : _162.props.rows]).toBe(4);
                boxNumber = function () { return __awaiter(_this, void 0, void 0, function () {
                    var found, walk, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                walk = function (node) {
                                    var _a, _b, _c;
                                    if (Array.isArray(node))
                                        return void node.forEach(walk);
                                    if (!node || typeof node !== 'object')
                                        return;
                                    var one = node;
                                    if (one.type === 'Input' && /-reply-/.test((_b = (_a = one.props) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : ''))
                                        found = (_c = one.press) === null || _c === void 0 ? void 0 : _c.handle;
                                    walk(one.children);
                                };
                                _a = walk;
                                return [4 /*yield*/, bar.drawn()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                return [4 /*yield*/, boxNumber()];
            case 25:
                numbered = _233.sent();
                expect(numbered).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'Looking at the left ear now' })];
            case 26:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 'n2', agentId: 'a1', item: 'Look at the left ear', state: 'doing' })];
            case 27:
                _233.sent();
                return [4 /*yield*/, clock.advance(1500)];
            case 28:
                _233.sent();
                _t = expect;
                return [4 /*yield*/, boxNumber()];
            case 29:
                _t.apply(void 0, [_233.sent()]).toBe(numbered);
                _u = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 30:
                _v = (_233.sent()).length;
                return [4 /*yield*/, boxesIn(details)];
            case 31:
                _u.apply(void 0, [_v + (_233.sent()).length]).toBe(0);
                _w = expect;
                return [4 /*yield*/, says(list, /^✎ Type it in the box above the chat$/)];
            case 32:
                _w.apply(void 0, [_233.sent()]).toBe(true);
                _x = expect;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 33:
                _x.apply(void 0, [(_233.sent()).length]).toBe(1);
                _y = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 34:
                _y.apply(void 0, [(_233.sent()).length]).toBe(0);
                MARK = /^● 1 question waiting for you · first: /;
                isShow = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, labelled(bar, 'Show')];
                        case 1: return [2 /*return*/, (_a.sent()).length > 0];
                    }
                }); }); };
                scrolled = function (offset) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.unmount()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: offset, bodyRows: 20 } }), surface: 'desktop' }))];
                        case 2: return [2 /*return*/, ((list = _a.sent()))];
                    }
                }); }); };
                return [4 /*yield*/, scrolled(40)];
            case 35:
                _233.sent();
                _z = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 36:
                _z.apply(void 0, [_233.sent()]).toBe(true);
                _0 = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: MARK })];
            case 37:
                _0.apply(void 0, [_233.sent()]).toBeDefined();
                return [4 /*yield*/, scrolled(0)];
            case 38:
                _233.sent();
                _1 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 39:
                _1.apply(void 0, [_233.sent()]).toBe(true);
                _2 = expect;
                return [4 /*yield*/, bar.find({ type: 'Text', text: MARK })];
            case 40:
                _2.apply(void 0, [_233.sent()]).toBeDefined();
                // Typed in, line after line, while work runs: the bar is never asked for again until the typing stops. The app builds every
                // drawing it is given anew, the box under the cursor too, whose blue ring then fades in again, so a bar drawn again as the box
                // grew a line, or given again as it was for each redraw that work writing its cards asked for, flashed as the person typed (17 Nov,
                // the person: "it starts jittering and flashing blue, not blue, blue, not blue"). The box stays four lines, its text scrolling
                // within, and the same box
                files.set("".concat(MEMORY, "/record-panel.on"), '');
                files.set("mtime:".concat(MEMORY, "/record-panel.on"), String(clock.now()));
                return [4 /*yield*/, clock.advance(2100)];
            case 41:
                _233.sent();
                barDrawings = function () { return __awaiter(_this, void 0, void 0, function () {
                    var path;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, clock.advance(2100)];
                            case 1:
                                _b.sent();
                                path = __spreadArray([], files.keys(), true).find(function (one) { return one.includes('/panel-record/'); });
                                return [2 /*return*/, ((_a = files.get(path !== null && path !== void 0 ? path : '')) !== null && _a !== void 0 ? _a : '').trim().split('\n').filter(Boolean).map(function (line) { return JSON.parse(line); }).filter(function (one) { return one.ev === 'render' && one.component === 'AbovePrompt'; }).length];
                        }
                    });
                }); };
                return [4 /*yield*/, boxesIn(bar)];
            case 42:
                growing = (_233.sent())[0];
                return [4 /*yield*/, bar.input({ key: (_163 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _163 !== void 0 ? _163 : '', text: 'The left.', kind: 'change' })];
            case 43:
                _233.sent();
                return [4 /*yield*/, barDrawings()];
            case 44:
                drawnBefore = _233.sent();
                typed = 'The left.';
                _i = 0, _3 = ['Then the right.', 'Then both, side by side.', 'a long line that wraps '.repeat(30), 'And the scans.', 'Thanks.'].entries();
                _233.label = 45;
            case 45:
                if (!(_i < _3.length)) return [3 /*break*/, 51];
                _4 = _3[_i], n = _4[0], line = _4[1];
                typed = "".concat(typed, "\n").concat(line);
                return [4 /*yield*/, bar.input({ key: (_164 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _164 !== void 0 ? _164 : '', text: typed, kind: 'change' })];
            case 46:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "t".concat(n), agentId: 'a1', text: "Step ".concat(n, " of the ears") })];
            case 47:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: "u".concat(n), agentId: 'a1', item: "Look at scan ".concat(n), state: 'doing' })];
            case 48:
                _233.sent();
                return [4 /*yield*/, clock.advance(700)];
            case 49:
                _233.sent();
                _233.label = 50;
            case 50:
                _i++;
                return [3 /*break*/, 45];
            case 51:
                _5 = expect;
                return [4 /*yield*/, barDrawings()];
            case 52:
                _5.apply(void 0, [_233.sent()]).toBe(drawnBefore);
                _6 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 53:
                _6.apply(void 0, [(_165 = (_233.sent())[0]) === null || _165 === void 0 ? void 0 : _165.props.rows]).toBe(4);
                _7 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 54:
                _7.apply(void 0, [(_166 = (_233.sent())[0]) === null || _166 === void 0 ? void 0 : _166.key]).toBe(growing === null || growing === void 0 ? void 0 : growing.key);
                // Half a minute after the last letter the hold ends by itself, as the app may say nothing when the cursor leaves: what was put
                // off is drawn then, once. A letter typed holds it again at once
                return [4 /*yield*/, clock.advance(31000)];
            case 55:
                // Half a minute after the last letter the hold ends by itself, as the app may say nothing when the cursor leaves: what was put
                // off is drawn then, once. A letter typed holds it again at once
                _233.sent();
                return [4 /*yield*/, barDrawings()];
            case 56:
                drawnAfter = _233.sent();
                expect(drawnAfter).toBeGreaterThan(drawnBefore);
                return [4 /*yield*/, bar.input({ key: (_167 = growing === null || growing === void 0 ? void 0 : growing.key) !== null && _167 !== void 0 ? _167 : '', text: "".concat(typed, " More."), kind: 'change' })];
            case 57:
                _233.sent();
                _8 = 0, _9 = [1, 2, 3];
                _233.label = 58;
            case 58:
                if (!(_8 < _9.length)) return [3 /*break*/, 62];
                n = _9[_8];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: "s".concat(n), agentId: 'a1', text: "Later step ".concat(n) })];
            case 59:
                _233.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 60:
                _233.sent();
                _233.label = 61;
            case 61:
                _8++;
                return [3 /*break*/, 58];
            case 62:
                _10 = expect;
                return [4 /*yield*/, barDrawings()];
            case 63:
                _10.apply(void 0, [_233.sent()]).toBe(drawnAfter);
                // What newly waits on the person still shows at once: a key box asked for meanwhile is in the panel within a second or two
                void keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-k', agentId: 'a1', command: 'hold /plug/claudopus/bin/secret GITHUB_TOKEN here deploy' }));
                keyBox = '7c1e2d3c-4b5a-4987-a654-3210fedcba98';
                files.set("".concat(MEMORY, "/boxes/").concat(keyBox, ".json"), JSON.stringify({ id: keyBox, kind: 'secret', name: 'GITHUB_TOKEN', chat: 'engine-id', at: clock.now() }));
                return [4 /*yield*/, clock.advance(2000)];
            case 64:
                _233.sent();
                _11 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: GITHUB_BOX })];
                    }); }); })];
            case 65:
                _11.apply(void 0, [_233.sent()]).toBeDefined();
                files.delete("".concat(MEMORY, "/boxes/").concat(keyBox, ".json"));
                return [4 /*yield*/, clock.advance(2000)];
            case 66:
                _233.sent();
                _12 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: GITHUB_BOX })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 67:
                _12.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(bar)];
            case 68:
                first = (_233.sent())[0];
                return [4 /*yield*/, bar.input({ key: (_168 = first === null || first === void 0 ? void 0 : first.key) !== null && _168 !== void 0 ? _168 : '', text: 'The left, but ke', kind: 'change' })];
            case 69:
                _233.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 70:
                _233.sent();
                _13 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 71:
                _13.apply(void 0, [(_169 = (_233.sent())[0]) === null || _169 === void 0 ? void 0 : _169.key]).toBe(first === null || first === void 0 ? void 0 : first.key);
                _14 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 72:
                _14.apply(void 0, [(_171 = (_170 = (_233.sent())[0]) === null || _170 === void 0 ? void 0 : _170.props.value) !== null && _171 !== void 0 ? _171 : '']).toBe('');
                // A letter typed holds the bar as drawn for as long as the box may hold the cursor, past the half minute typing holds the
                // panel: the panel scrolled meanwhile draws nothing new under the cursor. Five minutes after the last letter it is drawn again
                return [4 /*yield*/, scrolled(40)];
            case 73:
                // A letter typed holds the bar as drawn for as long as the box may hold the cursor, past the half minute typing holds the
                // panel: the panel scrolled meanwhile draws nothing new under the cursor. Five minutes after the last letter it is drawn again
                _233.sent();
                return [4 /*yield*/, clock.advance(31000)];
            case 74:
                _233.sent();
                _15 = expect;
                return [4 /*yield*/, isShow()];
            case 75:
                _15.apply(void 0, [_233.sent()]).toBe(false);
                _16 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 76:
                _16.apply(void 0, [(_172 = (_233.sent())[0]) === null || _172 === void 0 ? void 0 : _172.key]).toBe(first === null || first === void 0 ? void 0 : first.key);
                return [4 /*yield*/, clock.advance(270000)];
            case 77:
                _233.sent();
                return [4 /*yield*/, scrolled(0)];
            case 78:
                _233.sent();
                return [4 /*yield*/, scrolled(40)];
            case 79:
                _233.sent();
                _17 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, isShow()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 80:
                _17.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, scrolled(0)
                    // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
                ];
            case 81:
                _233.sent();
                _19 = (_18 = bar).press;
                _135 = {};
                return [4 /*yield*/, labelled(bar, 'Close')];
            case 82: 
            // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
            return [4 /*yield*/, _19.apply(_18, [(_135.key = (_174 = (_173 = (_233.sent())[0]) === null || _173 === void 0 ? void 0 : _173.key) !== null && _174 !== void 0 ? _174 : '', _135)])];
            case 83:
                // Closed from the bar: the box is gone and the card offers it again; opened again, what was typed is back
                _233.sent();
                _20 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 84:
                _20.apply(void 0, [_233.sent()]).toBe(true);
                _21 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 85:
                _21.apply(void 0, [_233.sent()]).toBe(true);
                _22 = expect;
                return [4 /*yield*/, says(list, /Type it in the box above/)];
            case 86:
                _22.apply(void 0, [_233.sent()]).toBe(false);
                _24 = (_23 = list).press;
                _136 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 87: return [4 /*yield*/, _24.apply(_23, [(_136.key = (_176 = (_175 = (_233.sent())[0]) === null || _175 === void 0 ? void 0 : _175.key) !== null && _176 !== void 0 ? _176 : '', _136)])];
            case 88:
                _233.sent();
                _25 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'The left, but ke' ? true : undefined)];
                        }
                    }); }); })];
            case 89:
                _25.apply(void 0, [_233.sent()]).toBe(true);
                _27 = (_26 = list).press;
                _137 = {};
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 90: 
            // Closed from the card, the same
            return [4 /*yield*/, _27.apply(_26, [(_137.key = (_178 = (_177 = (_233.sent())[0]) === null || _177 === void 0 ? void 0 : _177.key) !== null && _178 !== void 0 ? _178 : '', _137)])];
            case 91:
                // Closed from the card, the same
                _233.sent();
                _28 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 92:
                _28.apply(void 0, [_233.sent()]).toBe(true);
                _30 = (_29 = list).press;
                _138 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 93: return [4 /*yield*/, _30.apply(_29, [(_138.key = (_180 = (_179 = (_233.sent())[0]) === null || _179 === void 0 ? void 0 : _179.key) !== null && _180 !== void 0 ? _180 : '', _138)])];
            case 94:
                _233.sent();
                _31 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 95:
                _31.apply(void 0, [_233.sent()]).toBe(true);
                // A second piece of work asks while the box is open: the box stays the first card's, and the newer card offers its own
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Sort the invoices', prompt: 'sort the invoices' }))];
            case 96:
                // A second piece of work asks while the box is open: the box stays the first card's, and the newer card offers its own
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which month?', choices: ['October', 'November'] })];
            case 97:
                _233.sent();
                _32 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1:
                                _a = (_b.sent()).length === 1;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, labelled(list, CLOSE)];
                            case 2:
                                _a = (_b.sent()).length === 1;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 98:
                _32.apply(void 0, [_233.sent()]).toBe(true);
                _33 = expect;
                return [4 /*yield*/, says(bar, /^↳ Your answer to “Check the ears”$/)];
            case 99:
                _33.apply(void 0, [_233.sent()]).toBe(true);
                _35 = (_34 = list).press;
                _139 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 100: 
            // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
            return [4 /*yield*/, _35.apply(_34, [(_139.key = (_182 = (_181 = (_233.sent())[0]) === null || _181 === void 0 ? void 0 : _181.key) !== null && _182 !== void 0 ? _182 : '', _139)])];
            case 101:
                // Opened on the newer card it is that card's, empty; opened on the first again, its half-typed reply is back
                _233.sent();
                _36 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, says(bar, /^↳ Your answer to “Sort the invoices”$/)];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 102:
                _36.apply(void 0, [_233.sent()]).toBe(true);
                _37 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 103:
                _37.apply(void 0, [(_233.sent()).length]).toBe(1);
                _38 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 104:
                _38.apply(void 0, [(_184 = (_183 = (_233.sent())[0]) === null || _183 === void 0 ? void 0 : _183.props.value) !== null && _184 !== void 0 ? _184 : '']).toBe('');
                _40 = (_39 = list).press;
                _140 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 105: return [4 /*yield*/, _40.apply(_39, [(_140.key = (_186 = (_185 = (_233.sent())[0]) === null || _185 === void 0 ? void 0 : _185.key) !== null && _186 !== void 0 ? _186 : '', _140)])];
            case 106:
                _233.sent();
                _41 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, says(bar, /^↳ Your answer to “Check the ears”$/)];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 107:
                _41.apply(void 0, [_233.sent()]).toBe(true);
                _42 = expect;
                return [4 /*yield*/, boxesIn(bar)];
            case 108:
                _42.apply(void 0, [(_187 = (_233.sent())[0]) === null || _187 === void 0 ? void 0 : _187.props.value]).toBe('The left, but ke');
                _44 = (_43 = bar).input;
                _141 = {};
                return [4 /*yield*/, boxesIn(bar)];
            case 109: 
            // Sent from the bar with its Send button: it reaches the work in the person's own words, and the box goes with the ask, on to no
            // other card
            return [4 /*yield*/, _44.apply(_43, [(_141.key = (_189 = (_188 = (_233.sent())[0]) === null || _188 === void 0 ? void 0 : _188.key) !== null && _189 !== void 0 ? _189 : '', _141.text = 'The left, but keep the scan', _141.kind = 'change', _141)])];
            case 110:
                // Sent from the bar with its Send button: it reaches the work in the person's own words, and the box goes with the ask, on to no
                // other card
                _233.sent();
                _46 = (_45 = bar).press;
                _142 = {};
                return [4 /*yield*/, labelled(bar, 'Send')];
            case 111: return [4 /*yield*/, _46.apply(_45, [(_142.key = (_191 = (_190 = (_233.sent())[0]) === null || _190 === void 0 ? void 0 : _190.key) !== null && _191 !== void 0 ? _191 : '', _142)])];
            case 112:
                _233.sent();
                _47 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a1: ') && line.includes('in their own words: The left, but keep the scan'); })];
                    }); }); })];
            case 113:
                _47.apply(void 0, [_233.sent()]).toBeDefined();
                _48 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 114:
                _48.apply(void 0, [_233.sent()]).toBe(true);
                _49 = expect;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 115:
                _49.apply(void 0, [(_233.sent()).length]).toBe(1);
                _51 = (_50 = list).press;
                _143 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 116: 
            // The bar folded by the person with a reply half typed in it: nothing of the bar is on screen, so the card has its own box
            // again, with what was typed, and offers no box elsewhere
            return [4 /*yield*/, _51.apply(_50, [(_143.key = (_193 = (_192 = (_233.sent())[0]) === null || _192 === void 0 ? void 0 : _192.key) !== null && _193 !== void 0 ? _193 : '', _143)])];
            case 117:
                // The bar folded by the person with a reply half typed in it: nothing of the bar is on screen, so the card has its own box
                // again, with what was typed, and offers no box elsewhere
                _233.sent();
                _52 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(bar)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 118:
                _52.apply(void 0, [_233.sent()]).toBe(true);
                _54 = (_53 = bar).input;
                _144 = {};
                return [4 /*yield*/, boxesIn(bar)];
            case 119: return [4 /*yield*/, _54.apply(_53, [(_144.key = (_195 = (_194 = (_233.sent())[0]) === null || _194 === void 0 ? void 0 : _194.key) !== null && _195 !== void 0 ? _195 : '', _144.text = 'Nov', _144.kind = 'change', _144)])];
            case 120:
                _233.sent();
                return [4 /*yield*/, bar.unmount()];
            case 121:
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 122:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { isCollapsed: true }), surface: 'desktop' }))];
            case 123:
                folded = _233.sent();
                _55 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 124:
                _55.apply(void 0, [_233.sent()]).toBe(true);
                // The card's own box is a box of lines too, with Send under it and no small send button beside it
                _56 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 125:
                // The card's own box is a box of lines too, with Send under it and no small send button beside it
                _56.apply(void 0, [(_196 = (_233.sent())[0]) === null || _196 === void 0 ? void 0 : _196.props.rows]).toBe(4);
                _57 = expect;
                _58 = 'submitLabel';
                return [4 /*yield*/, boxesIn(list)];
            case 126:
                _57.apply(void 0, [_58 in ((_198 = (_197 = (_233.sent())[0]) === null || _197 === void 0 ? void 0 : _197.props) !== null && _198 !== void 0 ? _198 : {})]).toBe(false);
                _59 = expect;
                return [4 /*yield*/, labelled(list, 'Send')];
            case 127:
                _59.apply(void 0, [(_233.sent()).length]).toBe(1);
                _60 = expect;
                return [4 /*yield*/, boxesIn(folded)];
            case 128:
                _61 = (_233.sent()).length;
                return [4 /*yield*/, labelled(list, OPEN)];
            case 129:
                _62 = _61 + (_233.sent()).length;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 130:
                _60.apply(void 0, [_62 + (_233.sent()).length]).toBe(0);
                // Unfolded: the box does not open by itself; the card offers it again
                return [4 /*yield*/, folded.unmount()];
            case 131:
                // Unfolded: the box does not open by itself; the card offers it again
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 132:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 133:
                unfolded = _233.sent();
                _63 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1:
                                _a = (_b.sent()).length === 1;
                                if (!_a) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(list)];
                            case 2:
                                _a = (_b.sent()).length === 0;
                                _b.label = 3;
                            case 3: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 134:
                _63.apply(void 0, [_233.sent()]).toBe(true);
                _64 = expect;
                return [4 /*yield*/, boxesIn(unfolded)];
            case 135:
                _64.apply(void 0, [(_233.sent()).length]).toBe(0);
                _66 = (_65 = list).press;
                _145 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 136: 
            // One of the app's surveys in the bar while the box is open: the box has no place there, and the card has its own again, with
            // what was typed
            return [4 /*yield*/, _66.apply(_65, [(_145.key = (_200 = (_199 = (_233.sent())[0]) === null || _199 === void 0 ? void 0 : _199.key) !== null && _200 !== void 0 ? _200 : '', _145)])];
            case 137:
                // One of the app's surveys in the bar while the box is open: the box has no place there, and the card has its own again, with
                // what was typed
                _233.sent();
                _67 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(unfolded)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 138:
                _67.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, unfolded.unmount()];
            case 139:
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 140:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { hasSurvey: true }), surface: 'desktop' }))];
            case 141:
                surveyed = _233.sent();
                _68 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 142:
                _68.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, surveyed.unmount()];
            case 143:
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)
                    // The bar back and the box opened, a reply half typed: a new question from the same work leaves the box as it is, the same box
                    // with what was typed. Only the person closes or moves it (16 Nov)
                ];
            case 144:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 145:
                again = _233.sent();
                _69 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 146:
                _69.apply(void 0, [_233.sent()]).toBe(true);
                _71 = (_70 = list).press;
                _146 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 147: return [4 /*yield*/, _71.apply(_70, [(_146.key = (_202 = (_201 = (_233.sent())[0]) === null || _201 === void 0 ? void 0 : _201.key) !== null && _202 !== void 0 ? _202 : '', _146)])];
            case 148:
                _233.sent();
                _72 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov' ? true : undefined)];
                        }
                    }); }); })];
            case 149:
                _72.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(again)];
            case 150:
                typedIn = (_233.sent())[0];
                return [4 /*yield*/, again.input({ key: (_203 = typedIn === null || typedIn === void 0 ? void 0 : typedIn.key) !== null && _203 !== void 0 ? _203 : '', text: 'Nov 20', kind: 'change' })];
            case 151:
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 152:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a2', text: 'Which year?', choices: ['2025', '2026'] })];
            case 153:
                _233.sent();
                _73 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which year?' })];
                    }); }); })];
            case 154:
                _73.apply(void 0, [_233.sent()]).toBeDefined();
                _74 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 155:
                _74.apply(void 0, [(_233.sent()).map(function (one) { return one.key; })]).toEqual([typedIn === null || typedIn === void 0 ? void 0 : typedIn.key]);
                _75 = expect;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 156:
                _75.apply(void 0, [(_233.sent()).length]).toBe(1);
                _77 = (_76 = list).press;
                _147 = {};
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 157: 
            // Closed and opened again under the new question, what was typed is still there
            return [4 /*yield*/, _77.apply(_76, [(_147.key = (_205 = (_204 = (_233.sent())[0]) === null || _204 === void 0 ? void 0 : _204.key) !== null && _205 !== void 0 ? _205 : '', _147)])];
            case 158:
                // Closed and opened again under the new question, what was typed is still there
                _233.sent();
                _78 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 159:
                _78.apply(void 0, [_233.sent()]).toBe(true);
                _80 = (_79 = list).press;
                _148 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 160: return [4 /*yield*/, _80.apply(_79, [(_148.key = (_207 = (_206 = (_233.sent())[0]) === null || _206 === void 0 ? void 0 : _206.key) !== null && _207 !== void 0 ? _207 : '', _148)])];
            case 161:
                _233.sent();
                _81 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.props.value) === 'Nov 20' ? true : undefined)];
                        }
                    }); }); })];
            case 162:
                _81.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, boxesIn(again)];
            case 163:
                second = (_233.sent())[0];
                return [4 /*yield*/, again.input({ key: (_208 = second === null || second === void 0 ? void 0 : second.key) !== null && _208 !== void 0 ? _208 : '', text: 'Nov 202', kind: 'change' })];
            case 164:
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 165:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3b', agentId: 'a2', text: 'Which decade?', choices: ['2010s', '2020s'] })];
            case 166:
                _233.sent();
                _82 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which decade?' })];
                    }); }); })];
            case 167:
                _82.apply(void 0, [_233.sent()]).toBeDefined();
                _83 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 168:
                _83.apply(void 0, [(_233.sent()).map(function (one) { return one.key; })]).toEqual([second === null || second === void 0 ? void 0 : second.key]);
                return [4 /*yield*/, again.input({ key: (_209 = second === null || second === void 0 ? void 0 : second.key) !== null && _209 !== void 0 ? _209 : '', text: 'November 2026' })];
            case 169:
                _233.sent();
                _84 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: November 2026'); })];
                    }); }); })];
            case 170:
                _84.apply(void 0, [_233.sent()]).toBeDefined();
                _85 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 171:
                _85.apply(void 0, [_233.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(2000)];
            case 172:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a2', text: 'Which day?', choices: ['Monday', 'Friday'] })];
            case 173:
                _233.sent();
                _86 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 174:
                _86.apply(void 0, [_233.sent()]).toBe(true);
                _87 = expect;
                return [4 /*yield*/, boxesIn(again)];
            case 175:
                _88 = (_233.sent()).length;
                return [4 /*yield*/, labelled(list, CLOSE)];
            case 176:
                _87.apply(void 0, [_88 + (_233.sent()).length]).toBe(0);
                _90 = (_89 = list).press;
                _149 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 177: 
            // A button pressed on the card with the box open answers it, and the box leaves the bar with the ask
            return [4 /*yield*/, _90.apply(_89, [(_149.key = (_211 = (_210 = (_233.sent())[0]) === null || _210 === void 0 ? void 0 : _210.key) !== null && _211 !== void 0 ? _211 : '', _149)])];
            case 178:
                // A button pressed on the card with the box open answers it, and the box leaves the bar with the ask
                _233.sent();
                _91 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 179:
                _91.apply(void 0, [_233.sent()]).toBe(true);
                _93 = (_92 = list).press;
                _150 = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 180: return [4 /*yield*/, _93.apply(_92, [(_150.key = (_213 = (_212 = (_233.sent()).find(function (b) { return b.props.label === 'Monday'; })) === null || _212 === void 0 ? void 0 : _212.key) !== null && _213 !== void 0 ? _213 : '', _150)])];
            case 181:
                _233.sent();
                _94 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('"Monday"'); })];
                    }); }); })];
            case 182:
                _94.apply(void 0, [_233.sent()]).toBeDefined();
                _95 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 183:
                _95.apply(void 0, [_233.sent()]).toBe(true);
                // The work taking its question back while the box is open and typed in: the box leaves the bar within a second or so, as the bar
                // held for the box is looked at once a second (the same as a card stopped or answered elsewhere)
                return [4 /*yield*/, clock.advance(2000)];
            case 184:
                // The work taking its question back while the box is open and typed in: the box leaves the bar within a second or so, as the bar
                // held for the box is looked at once a second (the same as a card stopped or answered elsewhere)
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k5', agentId: 'a2', text: 'Which hour?', choices: ['9', '10'] })];
            case 185:
                _233.sent();
                _96 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labelled(list, OPEN)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 186:
                _96.apply(void 0, [_233.sent()]).toBe(true);
                _98 = (_97 = list).press;
                _151 = {};
                return [4 /*yield*/, labelled(list, OPEN)];
            case 187: return [4 /*yield*/, _98.apply(_97, [(_151.key = (_215 = (_214 = (_233.sent())[0]) === null || _214 === void 0 ? void 0 : _214.key) !== null && _215 !== void 0 ? _215 : '', _151)])];
            case 188:
                _233.sent();
                _99 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 1 ? true : undefined)];
                        }
                    }); }); })];
            case 189:
                _99.apply(void 0, [_233.sent()]).toBe(true);
                _101 = (_100 = again).input;
                _152 = {};
                return [4 /*yield*/, boxesIn(again)];
            case 190: return [4 /*yield*/, _101.apply(_100, [(_152.key = (_217 = (_216 = (_233.sent())[0]) === null || _216 === void 0 ? void 0 : _216.key) !== null && _217 !== void 0 ? _217 : '', _152.text = 'Nine', _152.kind = 'change', _152)])];
            case 191:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k6', agentId: 'a2', text: '' })];
            case 192:
                _233.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 193:
                _233.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 194:
                _233.sent();
                _102 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boxesIn(again)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 0 ? true : undefined)];
                        }
                    }); }); })];
            case 195:
                _102.apply(void 0, [_233.sent()]).toBe(true);
                // The card's own box, the bar folded, stays four lines as it is typed in, and is a new empty one once a reply was sent and the
                // work asks anew
                return [4 /*yield*/, again.unmount()];
            case 196:
                // The card's own box, the bar folded, stays four lines as it is typed in, and is a new empty one once a reply was sent and the
                // work asks anew
                _233.sent();
                return [4 /*yield*/, clock.advance(2000)];
            case 197:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { isCollapsed: true }), surface: 'desktop' }))];
            case 198:
                shut = _233.sent();
                five = 'one\ntwo\nthree\nfour\nfive';
                _103 = 0, _104 = [[7, 'Which minute?'], [8, 'Which second?']];
                _233.label = 199;
            case 199:
                if (!(_103 < _104.length)) return [3 /*break*/, 211];
                _105 = _104[_103], n = _105[0], text = _105[1];
                return [4 /*yield*/, clock.advance(2000)];
            case 200:
                _233.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k".concat(n), agentId: 'a2', text: text, choices: ['Now', 'Later'] })];
            case 201:
                _233.sent();
                _106 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c, _d; return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, boxesIn(list)];
                            case 1:
                                _b = (_e.sent()).length === 1;
                                if (!_b) return [3 /*break*/, 3];
                                return [4 /*yield*/, boxesIn(list)];
                            case 2:
                                _b = ((_c = (_e.sent())[0]) === null || _c === void 0 ? void 0 : _c.props.rows) === 4;
                                _e.label = 3;
                            case 3:
                                _a = _b;
                                if (!_a) return [3 /*break*/, 5];
                                return [4 /*yield*/, boxesIn(list)];
                            case 4:
                                _a = !((_d = (_e.sent())[0]) === null || _d === void 0 ? void 0 : _d.props.value);
                                _e.label = 5;
                            case 5: return [2 /*return*/, (_a ? true : undefined)];
                        }
                    }); }); })];
            case 202:
                _106.apply(void 0, [_233.sent()]).toBe(true);
                _108 = (_107 = list).input;
                _153 = {};
                return [4 /*yield*/, boxesIn(list)];
            case 203: return [4 /*yield*/, _108.apply(_107, [(_153.key = (_219 = (_218 = (_233.sent())[0]) === null || _218 === void 0 ? void 0 : _218.key) !== null && _219 !== void 0 ? _219 : '', _153.text = five, _153.kind = 'change', _153)])];
            case 204:
                _233.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 205:
                _233.sent();
                _109 = expect;
                return [4 /*yield*/, boxesIn(list)];
            case 206:
                _109.apply(void 0, [(_220 = (_233.sent())[0]) === null || _220 === void 0 ? void 0 : _220.props.rows]).toBe(4);
                _111 = (_110 = list).press;
                _154 = {};
                return [4 /*yield*/, labelled(list, 'Send')];
            case 207: return [4 /*yield*/, _111.apply(_110, [(_154.key = (_222 = (_221 = (_233.sent())[0]) === null || _221 === void 0 ? void 0 : _221.key) !== null && _222 !== void 0 ? _222 : '', _154)])];
            case 208:
                _233.sent();
                _112 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return line.startsWith('a2: ') && line.includes('in their own words: one\ntwo'); })];
                    }); }); })];
            case 209:
                _112.apply(void 0, [_233.sent()]).toBeDefined();
                _233.label = 210;
            case 210:
                _103++;
                return [3 /*break*/, 199];
            case 211:
                key = function (base) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (b) { var _a; return new RegExp("^".concat(base, "-\\d+$")).test((_a = b.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Trim the tail', prompt: 'trim the tail' }))];
            case 212:
                _233.sent();
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The tail is trimmed.', durationMs: 1, isAborted: false, turnId: 'c1', reason: 'answer' })];
            case 213:
                _233.sent();
                _113 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('dismiss-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 214:
                _113.apply(void 0, [_233.sent()]).toBeDefined();
                _114 = expect;
                return [4 /*yield*/, key('change-a3')];
            case 215:
                _114.apply(void 0, [_233.sent()]).toBeUndefined();
                return [4 /*yield*/, shut.unmount()];
            case 216:
                _233.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 217:
                top = _233.sent();
                _115 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 218:
                _115.apply(void 0, [(_223 = (_233.sent())) === null || _223 === void 0 ? void 0 : _223.props.label]).toBe('Change something');
                _116 = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 219:
                _116.apply(void 0, [(_233.sent()).map(function (b) { return String(b.key); }).filter(function (one) { return /^(change|dismiss)-a3-/.test(one); }).map(function (one) { return one.split('-')[0]; })]).toEqual(['change', 'dismiss']);
                _117 = expect;
                return [4 /*yield*/, key('change-a2')];
            case 220:
                _117.apply(void 0, [_233.sent()]).toBeUndefined();
                changeBox = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, top.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-change-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                changes = function () { return resumed.filter(function (line) { return line.includes('pressed "Change something"'); }); };
                toldOfChange = function () { return appended.filter(function (line) { return line.includes('to change something'); }); };
                wasSubmitted = submitted.length;
                _118 = expect;
                return [4 /*yield*/, changeBox()];
            case 221:
                _118.apply(void 0, [_233.sent()]).toBeUndefined();
                _120 = (_119 = list).press;
                _155 = {};
                return [4 /*yield*/, key('change-a3')];
            case 222: return [4 /*yield*/, _120.apply(_119, [(_155.key = (_225 = (_224 = (_233.sent())) === null || _224 === void 0 ? void 0 : _224.key) !== null && _225 !== void 0 ? _225 : '', _155)])];
            case 223:
                _233.sent();
                return [4 /*yield*/, until(changeBox)];
            case 224:
                opened = _233.sent();
                expect(opened).toBeDefined();
                _121 = expect;
                return [4 /*yield*/, says(top, /^Trim the tail · what should it change\?$/)];
            case 225:
                _121.apply(void 0, [_233.sent()]).toBe(true);
                _122 = expect;
                return [4 /*yield*/, top.findAll({ type: 'Button' })];
            case 226:
                _122.apply(void 0, [(_233.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return ['Send', 'Cancel', CLOSE].includes(label); })]).toEqual(['Send', 'Cancel']);
                // Cancel closes it and sends nothing: the card is Done as it was, and the box opened again is empty
                return [4 /*yield*/, top.input({ key: (_226 = opened === null || opened === void 0 ? void 0 : opened.key) !== null && _226 !== void 0 ? _226 : '', text: 'Never mind this', kind: 'change' })];
            case 227:
                // Cancel closes it and sends nothing: the card is Done as it was, and the box opened again is empty
                _233.sent();
                _124 = (_123 = top).press;
                _156 = {};
                return [4 /*yield*/, labelled(top, 'Cancel')];
            case 228: return [4 /*yield*/, _124.apply(_123, [(_156.key = (_228 = (_227 = (_233.sent())[0]) === null || _227 === void 0 ? void 0 : _227.key) !== null && _228 !== void 0 ? _228 : '', _156)])];
            case 229:
                _233.sent();
                _125 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, changeBox()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 230:
                _125.apply(void 0, [_233.sent()]).toBe(true);
                expect(changes()).toHaveLength(0);
                expect(toldOfChange()).toHaveLength(0);
                _126 = expect;
                return [4 /*yield*/, key('stop-a3')];
            case 231:
                if (!((_229 = _233.sent()) !== null && _229 !== void 0)) return [3 /*break*/, 232];
                _127 = _229;
                return [3 /*break*/, 234];
            case 232: return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
            case 233:
                _127 = (_233.sent());
                _233.label = 234;
            case 234:
                _126.apply(void 0, [_127]).toBeUndefined();
                _129 = (_128 = list).press;
                _157 = {};
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 235: return [4 /*yield*/, _129.apply(_128, [(_157.key = (_231 = (_230 = (_233.sent())) === null || _230 === void 0 ? void 0 : _230.key) !== null && _231 !== void 0 ? _231 : '', _157)])];
            case 236:
                _233.sent();
                return [4 /*yield*/, until(changeBox)];
            case 237:
                again2 = _233.sent();
                expect(again2 === null || again2 === void 0 ? void 0 : again2.props.value).toBe('');
                sentAt = clock.now();
                return [4 /*yield*/, top.input({ key: (_232 = again2 === null || again2 === void 0 ? void 0 : again2.key) !== null && _232 !== void 0 ? _232 : '', text: 'Leave the tip longer' })];
            case 238:
                _233.sent();
                expect(clock.now()).toBe(sentAt);
                expect(changes()).toEqual(['a3: The person pressed "Change something" on the card of your finished task and wrote, in their own words, what to change in your finished work: Leave the tip longer\nYou had finished; this starts you again. Carry on with their words: tick or add to-dos for what they ask, do it, then hand back again with only what is new.']);
                expect(submitted).toHaveLength(wasSubmitted);
                expect(toldOfChange()).toEqual([expect.stringContaining('asked the finished task "Trim the tail" on its card to change something: “Leave the tip longer”. The task has their words and carries on with them itself: start nothing for it.')]);
                _130 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Button', key: 'stop-a3' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 239:
                _130.apply(void 0, [_233.sent()]).toBeDefined();
                _131 = expect;
                return [4 /*yield*/, key('change-a3')];
            case 240:
                _131.apply(void 0, [_233.sent()]).toBeUndefined();
                _132 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, changeBox()];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 241:
                _132.apply(void 0, [_233.sent()]).toBe(true);
                // It finishes again, and can be asked for a change again
                return [4 /*yield*/, $.turn.complete({ agentId: 'a3', answer: 'The tip is longer now.', durationMs: 1, isAborted: false, turnId: 'c2', reason: 'answer' })];
            case 242:
                // It finishes again, and can be asked for a change again
                _233.sent();
                _133 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, key('change-a3')];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 243:
                _133.apply(void 0, [_233.sent()]).toBeDefined();
                return [4 /*yield*/, Promise.all([list.unmount(), details.unmount(), top.unmount()])];
            case 244:
                _233.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a question nobody answers on its card is said again at 15 minutes and an hour, once each, and no more once answered; with each message of the person the chat reads what every card shows and is asked to name the question once an hour', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, notified, clock, reminders, minutes, said, first, _b, _c, list, box;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), notified = _a.notified, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'push the fix', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Push the fix', prompt: 'push it' }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't1', agentId: 'a1', item: 'Fix the scroll', state: 'done' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't2', agentId: 'a1', item: 'Push it', state: 'doing' })];
            case 5:
                _e.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Sign in to GitHub in the browser pane.' })];
            case 6:
                _e.sent();
                reminders = function () { return notified.filter(function (line) { return line.startsWith('Push the fix still waits for you | Waiting '); }); };
                minutes = function (n) { return __awaiter(_this, void 0, void 0, function () {
                    var at;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                at = 0;
                                _a.label = 1;
                            case 1:
                                if (!(at < n)) return [3 /*break*/, 4];
                                return [4 /*yield*/, clock.advance(60000)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                at += 1;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // 17 Nov: a sign-in sat unseen for hours, as only the first notification ever went
                return [4 /*yield*/, minutes(14)];
            case 7:
                // 17 Nov: a sign-in sat unseen for hours, as only the first notification ever went
                _e.sent();
                expect(reminders()).toEqual([]);
                return [4 /*yield*/, minutes(2)];
            case 8:
                _e.sent();
                expect(reminders()).toHaveLength(1);
                expect(reminders()[0]).toMatch(/^Push the fix still waits for you \| Waiting 1[56]m · Sign in to GitHub in the browser pane\.$/);
                return [4 /*yield*/, minutes(30)];
            case 9:
                _e.sent();
                expect(reminders()).toHaveLength(1);
                said = function (text) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, $.prompt.submit({ text: text, wait: false, origin: composer })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).context) === null || _a === void 0 ? void 0 : _a.join('\n')) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                return [4 /*yield*/, said('how is it going?')];
            case 10:
                first = _e.sent();
                expect(first).toContain('What the latest task cards show now, for when the person asks how things stand');
                expect(first).toMatch(/- "Push the fix" \(a1\): waiting for the person for 4\dm: Sign in to GitHub in the browser pane\./);
                expect(first).toContain('Waiting on the person on a card, unanswered: "Push the fix". Unless your reply is about it, end it with one short line');
                // Within the hour, with nothing on the cards changed, the chat is not told again
                _b = expect;
                return [4 /*yield*/, said('and the other one?')];
            case 11:
                // Within the hour, with nothing on the cards changed, the chat is not told again
                _b.apply(void 0, [_e.sent()]).not.toContain('What the latest task cards show');
                return [4 /*yield*/, minutes(16)];
            case 12:
                _e.sent();
                expect(reminders()).toHaveLength(2);
                // Answered, it is said no more, and the card reads as at work with its to-dos
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })];
            case 13:
                // Answered, it is said no more, and the card reads as at work with its to-dos
                _e.sent();
                _c = expect;
                return [4 /*yield*/, said('ok')];
            case 14:
                _c.apply(void 0, [_e.sent()]).toMatch(/- "Push the fix" \(a1\): working, 1 of 2 to-dos done, doing "Push it"/);
                return [4 /*yield*/, minutes(200)];
            case 15:
                _e.sent();
                expect(reminders()).toHaveLength(2);
                // A reply in words that does not settle a new question starts its wait afresh: no reminder of the time before the reply
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k3', agentId: 'a1', text: 'Push to main or to a branch?', choices: ['Main', 'A branch'] })];
            case 16:
                // A reply in words that does not settle a new question starts its wait afresh: no reminder of the time before the reply
                _e.sent();
                return [4 /*yield*/, minutes(10)];
            case 17:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 18:
                list = _e.sent();
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 19:
                box = (_e.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); });
                return [4 /*yield*/, list.input({ key: (_d = box === null || box === void 0 ? void 0 : box.key) !== null && _d !== void 0 ? _d : '', text: 'What is the difference?' })];
            case 20:
                _e.sent();
                return [4 /*yield*/, list.unmount()];
            case 21:
                _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Asked again.', durationMs: 1, isAborted: false, turnId: 'r1', reason: 'answer', agentId: 'a1' })];
            case 22:
                _e.sent();
                return [4 /*yield*/, minutes(8)];
            case 23:
                _e.sent();
                expect(notified.filter(function (line) { return line.includes('Push to main or to a branch?') && line.includes('still waits'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
