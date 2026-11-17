// Cards: work becoming a card, its to-dos, its own chat, steers, context and model, Details, stops, its pause, work the engine reports
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
test('what I ask for becomes a box in the panel, the panel opens once, and the chat shows only that work is running', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, logged, r, _i, _b, surface, band, _c, _d, _e, _f, surface, pane, _g, _h, _j, _k, _l, tab, _m, _o, _p, _q, _r, _s;
    var _this = this;
    var _t, _u, _v, _w, _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                _a = world(on), opened = _a.opened, logged = _a.logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'The nose on head A is flawed, can you fix it?', wait: false, origin: composer })];
            case 2:
                _y.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'The nose on head A is flawed, can you fix it?' }))];
            case 3:
                r = _y.sent();
                expect(r.agentId).toBe('a1');
                // The work is told to keep its to-do true
                expect(prompts[0]).toContain('mcp__claudopus__todo');
                expect(prompts[0]).toContain('mcp__claudopus__note');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _y.sent();
                expect(opened).toEqual(['claudopus']);
                _i = 0, _b = ['terminal', 'desktop'];
                _y.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 11];
                surface = _b[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))
                    // One short line, and never what a piece of work is doing: that is on its card
                ];
            case 6:
                band = _y.sent();
                // One short line, and never what a piece of work is doing: that is on its card
                _c = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /more$|Check the ears|Fix the nose/ })];
            case 7:
                // One short line, and never what a piece of work is doing: that is on its card
                _c.apply(void 0, [_y.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, band.findAll({ type: 'Button' })];
            case 8:
                _d.apply(void 0, [_y.sent()]).toHaveLength(0);
                return [4 /*yield*/, band.unmount()];
            case 9:
                _y.sent();
                _y.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 5];
            case 11:
                _e = 0, _f = ['terminal', 'desktop', 'vscode', 'mobile'];
                _y.label = 12;
            case 12:
                if (!(_e < _f.length)) return [3 /*break*/, 30];
                surface = _f[_e];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))
                    // A small card says its to-do in a few words and where it stands, each on one line that is cut at the edge
                ];
            case 13:
                pane = _y.sent();
                // A small card says its to-do in a few words and where it stands, each on one line that is cut at the edge
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 14:
                // A small card says its to-do in a few words and where it stands, each on one line that is cut at the edge
                _g.apply(void 0, [(_t = (_y.sent())) === null || _t === void 0 ? void 0 : _t.props.wrap]).toBe('truncate-end');
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Check the ears/ })];
            case 15:
                _h.apply(void 0, [(_u = (_y.sent())) === null || _u === void 0 ? void 0 : _u.text]).toBe('Check the ears');
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /^0s$/ })];
            case 16:
                _j.apply(void 0, [_y.sent()]).toHaveLength(2);
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /flawed/ })];
            case 17:
                _k.apply(void 0, [_y.sent()]).toBeUndefined();
                // Pressed, its Details opens as a tab of its own, named after the work, and gives what it started from in my words
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 18:
                // Pressed, its Details opens as a tab of its own, named after the work, and gives what it started from in my words
                _y.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 19:
                _l.apply(void 0, [_y.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: surface }))];
            case 20:
                tab = _y.sent();
                _m = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Started from$/ })];
            case 21:
                _m.apply(void 0, [(_v = (_y.sent())) === null || _v === void 0 ? void 0 : _v.props.bold]).toBe(true);
                _o = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /flawed/ })];
            case 22:
                _o.apply(void 0, [(_w = (_y.sent())) === null || _w === void 0 ? void 0 : _w.text]).toBe('“The nose on head A is flawed, can you fix it?”');
                _p = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /Check the ears/ })];
            case 23:
                _p.apply(void 0, [_y.sent()]).toBeUndefined();
                // and has nothing that leads back: the list stays as it was in its own tab
                _q = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', key: 'back' })];
            case 24:
                // and has nothing that leads back: the list stays as it was in its own tab
                _q.apply(void 0, [_y.sent()]).toBeUndefined();
                return [4 /*yield*/, tab.unmount()];
            case 25:
                _y.sent();
                _r = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Check the ears/ })];
            case 26:
                _r.apply(void 0, [(_x = (_y.sent())) === null || _x === void 0 ? void 0 : _x.text]).toBe('Check the ears');
                _s = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Started from$/ })];
            case 27:
                _s.apply(void 0, [_y.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 28:
                _y.sent();
                _y.label = 29;
            case 29:
                _e++;
                return [3 /*break*/, 12];
            case 30:
                // Nothing about the work is written into the chat
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('a small card shows where the work is and a count of its to-dos; pressed, it lists every to-do; ended work leaves the panel', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, logged, clock, files, opened, call, doing, pane, _b, _c, _d, _e, _f, _g, edgeOf, _h, flat, _j, _k, _l, _m, _o, _p, listed, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _i, _0, n, tab, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, plain, _17, _18, _19, helperTab, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, buttons, _37, _38, _39, ended, _40, _41, band, _42;
    var _this = this;
    var _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83;
    return __generator(this, function (_84) {
        switch (_84.label) {
            case 0:
                _a = world(on), logged = _a.logged, clock = _a.clock, files = _a.files, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _84.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _84.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _84.sent();
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again' })];
            case 4:
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Try the other model' })
                    // Only one to-do is being done at a time
                ];
            case 5:
                _84.sent();
                // Only one to-do is being done at a time
                return [4 /*yield*/, call('todo', { item: 'Try the other model', state: 'doing' })];
            case 6:
                // Only one to-do is being done at a time
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again', state: 'doing' })];
            case 7:
                doing = _84.sent();
                expect(String(doing.result)).toBe('[doing] Fit the nostril again\n[ ] Try the other model');
                return [4 /*yield*/, call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })];
            case 8:
                _84.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                    // as the edge's lighter part, the rest only counted
                ];
            case 9:
                pane = _84.sent();
                // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                // as the edge's lighter part, the rest only counted
                _b = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 10:
                // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                // as the edge's lighter part, the rest only counted
                _b.apply(void 0, [_84.sent()]).toHaveLength(1);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Now:$/ })];
            case 11:
                _c.apply(void 0, [_84.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Step / })];
            case 12:
                _d.apply(void 0, [(_43 = (_84.sent())) === null || _43 === void 0 ? void 0 : _43.text]).toBe('Step 1 of 2 ·');
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Fit the/ })];
            case 13:
                _e.apply(void 0, [(_44 = (_84.sent())) === null || _44 === void 0 ? void 0 : _44.props.dimColor]).toBe(false);
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Try the/ })];
            case 14:
                _f.apply(void 0, [_84.sent()]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ done/ })];
            case 15:
                _g.apply(void 0, [(_45 = (_84.sent())) === null || _45 === void 0 ? void 0 : _45.text]).toMatch(/(^| · )0 of 2 done · \d+s$/);
                edgeOf = function (of) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.backgroundColor); }).filter(function (colour) { return colour.startsWith('#8A63F0'); })];
                    }
                }); }); };
                _h = expect;
                return [4 /*yield*/, edgeOf(pane)];
            case 16:
                _h.apply(void 0, [_84.sent()]).toEqual(['#8A63F0AD', '#8A63F05C']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 17:
                flat = _84.sent();
                _j = expect;
                return [4 /*yield*/, flat.findAll({ type: 'Box' })];
            case 18:
                _j.apply(void 0, [(_84.sent()).map(function (b) { return String(b.props.backgroundColor); }).filter(function (colour) { return colour === '#6E3CFF'; })]).toEqual(['#6E3CFF']);
                return [4 /*yield*/, flat.unmount()
                    // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                ];
            case 19:
                _84.sent();
                // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                _k = expect;
                return [4 /*yield*/, keyed(pane, 'go-a1')];
            case 20:
                // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                _k.apply(void 0, [_84.sent()]).toBeUndefined();
                _l = expect;
                return [4 /*yield*/, keyed(pane, 'open-a1')];
            case 21:
                _l.apply(void 0, [(_46 = (_84.sent())) === null || _46 === void 0 ? void 0 : _46.props.plain]).toBe(true);
                _m = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 22:
                _m.apply(void 0, [(_47 = (_84.sent())) === null || _47 === void 0 ? void 0 : _47.props]).toMatchObject({ label: 'Stop', plain: true });
                // A line too long for its two rows is cut at the end of a word
                return [4 /*yield*/, call('note', { text: "I am ".concat('fitting the nostril again and again '.repeat(5), "today.") })];
            case 23:
                // A line too long for its two rows is cut at the end of a word
                _84.sent();
                _o = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 24:
                _o.apply(void 0, [(_48 = (_84.sent())) === null || _48 === void 0 ? void 0 : _48.text]).toBe('I am fitting the nostril again and again fitting the nostril again and …');
                return [4 /*yield*/, call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })];
            case 25:
                _84.sent();
                _p = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 26:
                _p.apply(void 0, [(_49 = (_84.sent())) === null || _49 === void 0 ? void 0 : _49.text]).toBe('I am fitting the nostril again, because the first fit left it open.');
                return [4 /*yield*/, call('note', { text: 'The nostril is closed; I am comparing the head with your scan.' })];
            case 27:
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again', state: 'done' })];
            case 28:
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Try the other model', state: 'dropped' })];
            case 29:
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Compare the head with your scan', was: 'compare with scan' })];
            case 30:
                listed = _84.sent();
                expect(String(listed.result)).toBe('[x] Fit the nostril again\n[dropped] Try the other model\n[ ] Compare the head with your scan');
                // A chat's own thread has no to-do of its own
                _q = expect;
                _r = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' })];
            case 31:
                // A chat's own thread has no to-do of its own
                _q.apply(void 0, [_r.apply(void 0, [(_84.sent()).result])]).toContain('Only a background task');
                // The newer line replaced the older; a dropped to-do is not counted
                _s = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 32:
                // The newer line replaced the older; a dropped to-do is not counted
                _s.apply(void 0, [_84.sent()]).toBeUndefined();
                _t = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^The nostril is closed/ })];
            case 33:
                _t.apply(void 0, [(_50 = (_84.sent())) === null || _50 === void 0 ? void 0 : _50.text]).toBe('The nostril is closed; I am comparing the head with your scan.');
                _u = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ done/ })];
            case 34:
                _u.apply(void 0, [(_51 = (_84.sent())) === null || _51 === void 0 ? void 0 : _51.text]).toContain('1 of 2 done');
                // The done to-do's part of the edge is bright, and with none being done the other is dim, named dim as the next
                _v = expect;
                return [4 /*yield*/, edgeOf(pane)];
            case 35:
                // The done to-do's part of the edge is bright, and with none being done the other is dim, named dim as the next
                _v.apply(void 0, [_84.sent()]).toEqual(['#8A63F0', '#8A63F05C']);
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Next, step / })];
            case 36:
                _w.apply(void 0, [(_52 = (_84.sent())) === null || _52 === void 0 ? void 0 : _52.text]).toBe('Next, step 2 of 2 ·');
                _x = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Compare the head/ })];
            case 37:
                _x.apply(void 0, [(_53 = (_84.sent())) === null || _53 === void 0 ? void 0 : _53.props.dimColor]).toBe(true);
                _y = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 38:
                _y.apply(void 0, [_84.sent()]).toHaveLength(1);
                _z = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^To do/ })];
            case 39:
                _z.apply(void 0, [_84.sent()]).toBeUndefined();
                // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
                // done or dropped is one quiet count that opens on a press
                return [4 /*yield*/, call('todo', { item: 'Compare the head with your scan', state: 'doing' })];
            case 40:
                // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
                // done or dropped is one quiet count that opens on a press
                _84.sent();
                return [4 /*yield*/, call('todo', { item: 'Check the left ear' })];
            case 41:
                _84.sent();
                _i = 0, _0 = [1, 2, 3, 4];
                _84.label = 42;
            case 42:
                if (!(_i < _0.length)) return [3 /*break*/, 45];
                n = _0[_i];
                return [4 /*yield*/, call('todo', { item: "Later step ".concat(n) })];
            case 43:
                _84.sent();
                _84.label = 44;
            case 44:
                _i++;
                return [3 /*break*/, 42];
            case 45: return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 46:
                _84.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 47:
                tab = _84.sent();
                _1 = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 48:
                _1.apply(void 0, [_84.sent()]).toHaveLength(1);
                _2 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^To-dos$/ })];
            case 49:
                _2.apply(void 0, [(_54 = (_84.sent())) === null || _54 === void 0 ? void 0 : _54.props.bold]).toBe(true);
                _3 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Conversation$/ })];
            case 50:
                _3.apply(void 0, [(_55 = (_84.sent())) === null || _55 === void 0 ? void 0 : _55.props.bold]).toBe(true);
                _4 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /of \d+ done$/ })];
            case 51:
                _4.apply(void 0, [(_56 = (_84.sent())) === null || _56 === void 0 ? void 0 : _56.text]).toBe('1 of 7 done');
                _5 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Compare/ })];
            case 52:
                _5.apply(void 0, [(_57 = (_84.sent())) === null || _57 === void 0 ? void 0 : _57.props.dimColor]).toBe(false);
                _6 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Check the left ear/ })];
            case 53:
                _6.apply(void 0, [(_58 = (_84.sent())) === null || _58 === void 0 ? void 0 : _58.props.dimColor]).toBe(true);
                _7 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^The nostril is closed/ })];
            case 54:
                _7.apply(void 0, [(_59 = (_84.sent())) === null || _59 === void 0 ? void 0 : _59.props.dimColor]).toBe(true);
                _8 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Now:$/ })];
            case 55:
                _8.apply(void 0, [_84.sent()]).toBeUndefined();
                // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
                _9 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Later step 4$/ })];
            case 56:
                // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
                _9.apply(void 0, [_84.sent()]).toBeDefined();
                _10 = expect;
                return [4 /*yield*/, keyed(tab, 'fold--1000003')];
            case 57:
                _10.apply(void 0, [_84.sent()]).toBeUndefined();
                _11 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Fit the/ })];
            case 58:
                _11.apply(void 0, [(_60 = (_84.sent())) === null || _60 === void 0 ? void 0 : _60.props.dimColor]).toBe(true);
                _12 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Try the/ })];
            case 59:
                _12.apply(void 0, [(_61 = (_84.sent())) === null || _61 === void 0 ? void 0 : _61.props.strikethrough]).toBe(true);
                // The list behind it is as it was
                _13 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ done/ })];
            case 60:
                // The list behind it is as it was
                _13.apply(void 0, [(_62 = (_84.sent())) === null || _62 === void 0 ? void 0 : _62.text]).toContain('1 of 7 done');
                // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' })];
            case 61:
                // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
                _84.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' }))];
            case 62:
                _84.sent();
                expect(prompts.at(-1)).toBe('search');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' })];
            case 63:
                _84.sent();
                _14 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am reading/ })];
            case 64:
                _14.apply(void 0, [(_63 = (_84.sent())) === null || _63 === void 0 ? void 0 : _63.text]).toBe('I am reading how the other model draws outlines.');
                // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
                _15 = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a2')];
            case 65:
                // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
                _15.apply(void 0, [(_64 = (_84.sent())) === null || _64 === void 0 ? void 0 : _64.props.label]).toBe('Search the docs');
                _16 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 66:
                _16.apply(void 0, [(_84.sent()).filter(function (svg) { return String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'Working' && svg.props.isInteractive === true; })]).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 67:
                plain = _84.sent();
                _17 = expect;
                return [4 /*yield*/, plain.find({ type: 'Text', text: /^└─/ })];
            case 68:
                _17.apply(void 0, [(_65 = (_84.sent())) === null || _65 === void 0 ? void 0 : _65.text]).toBe('└───');
                return [4 /*yield*/, plain.unmount()];
            case 69:
                _84.sent();
                _18 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 70:
                _18.apply(void 0, [(_84.sent()).map(function (b) { return b.props.label; }).filter(function (label) { return label === 'Stop'; })]).toHaveLength(1);
                // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
                return [4 /*yield*/, pressed(pane, 'open-list-a2')];
            case 71:
                // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
                _84.sent();
                _19 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a2') || undefined];
                    }); }); })];
            case 72:
                _19.apply(void 0, [_84.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', surface: 'desktop' }))];
            case 73:
                helperTab = _84.sent();
                _20 = expect;
                return [4 /*yield*/, helperTab.find({ type: 'Text', text: /Search the docs/ })];
            case 74:
                _20.apply(void 0, [(_66 = (_84.sent())) === null || _66 === void 0 ? void 0 : _66.props.bold]).toBe(true);
                _21 = expect;
                return [4 /*yield*/, keyed(helperTab, 'open-parent-a2')];
            case 75:
                _21.apply(void 0, [(_67 = (_84.sent())) === null || _67 === void 0 ? void 0 : _67.props.label]).toBe('↑ A helper of: Fix the nose');
                return [4 /*yield*/, helperTab.unmount()
                    // and the work's own Details lists it under Helpers
                ];
            case 76:
                _84.sent();
                // and the work's own Details lists it under Helpers
                _22 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Helpers$/ })];
            case 77:
                // and the work's own Details lists it under Helpers
                _22.apply(void 0, [(_68 = (_84.sent())) === null || _68 === void 0 ? void 0 : _68.props.bold]).toBe(true);
                _23 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /helper working$/ })];
            case 78:
                _23.apply(void 0, [(_69 = (_84.sent())) === null || _69 === void 0 ? void 0 : _69.text]).toBe('1 helper working');
                // Work that ends its turn to wait for its helper goes on working
                return [4 /*yield*/, clock.advance(120000)];
            case 79:
                // Work that ends its turn to wait for its helper goes on working
                _84.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 80:
                _84.sent();
                _24 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^2m/ })];
            case 81:
                _24.apply(void 0, [(_70 = (_84.sent())) === null || _70 === void 0 ? void 0 : _70.text]).toBe('2m 00s');
                return [4 /*yield*/, $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' })
                    // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
                ];
            case 82:
                _84.sent();
                // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
                _25 = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', key: 'stop-a1' })];
            case 83:
                // Work that has ended leaves the list by itself; its Details tab stays and keeps up: it says it finished, with no Stop
                _25.apply(void 0, [_84.sent()]).toBeDefined();
                return [4 /*yield*/, $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' })];
            case 84:
                _84.sent();
                _26 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Finished · \d+m/ })];
            case 85:
                _26.apply(void 0, [(_71 = (_84.sent())) === null || _71 === void 0 ? void 0 : _71.text]).toBe('Finished · 2m 00s');
                _27 = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', key: 'stop-a1' })];
            case 86:
                _27.apply(void 0, [_84.sent()]).toBeUndefined();
                return [4 /*yield*/, tab.unmount()
                    // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                ];
            case 87:
                _84.sent();
                // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                _28 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 88:
                // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                _28.apply(void 0, [(_72 = (_84.sent())) === null || _72 === void 0 ? void 0 : _72.props.bold]).toBe(true);
                _29 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 89:
                _29.apply(void 0, [(_73 = (_84.sent())) === null || _73 === void 0 ? void 0 : _73.props.color]).toBe('success');
                _30 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 90:
                _30.apply(void 0, [(_84.sent()).filter(function (b) { return b.props.backgroundColor === 'success'; }).length]).toBe(1);
                _31 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Just finished$/ })];
            case 91:
                _31.apply(void 0, [(_74 = (_84.sent())) === null || _74 === void 0 ? void 0 : _74.text]).toBe('Just finished');
                // Its helper, ended in the same moment, stays in its card for the same pause
                _32 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 92:
                // Its helper, ended in the same moment, stays in its card for the same pause
                _32.apply(void 0, [(_84.sent()).map(function (b) { return b.props.label; })]).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Search the docs']);
                return [4 /*yield*/, clock.advance(1000)];
            case 93:
                _84.sent();
                _33 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 94:
                _33.apply(void 0, [_84.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(1100)];
            case 95:
                _84.sent();
                _34 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 96:
                _34.apply(void 0, [_84.sent()]).toBeUndefined();
                _35 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Finished' })];
            case 97:
                _35.apply(void 0, [_84.sent()]).toBeUndefined();
                _36 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing/ })];
            case 98:
                _36.apply(void 0, [(_75 = (_84.sent())) === null || _75 === void 0 ? void 0 : _75.text]).toBe('Nothing is running');
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 99:
                buttons = _84.sent();
                expect(buttons.map(function (b) { return b.props.label; })).toEqual(['Stats', 'Memory', 'Config', 'About', '▸ Finished 1']);
                return [4 /*yield*/, pane.press({ key: String((_76 = buttons.find(function (b) { return b.props.label === '▸ Finished 1'; })) === null || _76 === void 0 ? void 0 : _76.key) })];
            case 100:
                _84.sent();
                _37 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 101:
                _37.apply(void 0, [(_77 = (_84.sent())) === null || _77 === void 0 ? void 0 : _77.props.wrap]).toBe('truncate-end');
                _38 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Finished ·/ })];
            case 102:
                _38.apply(void 0, [(_78 = (_84.sent())) === null || _78 === void 0 ? void 0 : _78.text]).toBe('Finished · 1 of 7 done · 2m 00s');
                _39 = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 103:
                _39.apply(void 0, [_84.sent()]).toBeUndefined();
                // Finished work's Details opens as a tab of its own too
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 104:
                // Finished work's Details opens as a tab of its own too
                _84.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 105:
                ended = _84.sent();
                _40 = expect;
                return [4 /*yield*/, ended.find({ type: 'Text', text: /^Finished · \d+m/ })];
            case 106:
                _40.apply(void 0, [(_79 = (_84.sent())) === null || _79 === void 0 ? void 0 : _79.text]).toBe('Finished · 2m 00s');
                _41 = expect;
                return [4 /*yield*/, ended.find({ type: 'Text', text: /^Conversation$/ })];
            case 107:
                _41.apply(void 0, [(_80 = (_84.sent())) === null || _80 === void 0 ? void 0 : _80.props.bold]).toBe(true);
                return [4 /*yield*/, ended.unmount()];
            case 108:
                _84.sent();
                expect((_81 = files.get("".concat(MEMORY, "/finished/engine-id.json"))) !== null && _81 !== void 0 ? _81 : '').toBe('');
                return [4 /*yield*/, clock.advance(20000)
                    // kept with its helper, so its Details still lists it after a reload
                ];
            case 109:
                _84.sent();
                // kept with its helper, so its Details still lists it after a reload
                expect(JSON.parse((_82 = files.get("".concat(MEMORY, "/finished/engine-id.json"))) !== null && _82 !== void 0 ? _82 : '[]').map(function (one) { return one.id; })).toEqual(['a1', 'a2']);
                return [4 /*yield*/, pane.unmount()];
            case 110:
                _84.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 111:
                band = _84.sent();
                _42 = expect;
                return [4 /*yield*/, band.find({ type: 'Text' })];
            case 112:
                _42.apply(void 0, [(_83 = (_84.sent())) === null || _83 === void 0 ? void 0 : _83.text]).toBe("the engine's own");
                return [4 /*yield*/, band.unmount()];
            case 113:
                _84.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
// A long work resumed with new rounds: 16 to-dos, 12 done and one being done, more than the edge has parts for
test('past the parts the edge has, it is one bar in three shades, and the step being done is named with the same number', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var call, n, n, pane, edge, _a, _b, _c, _d, after, _e, n, _f;
    var _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'add the depth model to the video fit', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'add the depth model to the video fit' }))];
            case 3:
                _l.sent();
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                n = 1;
                _l.label = 4;
            case 4:
                if (!(n <= 16)) return [3 /*break*/, 7];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n) })];
            case 5:
                _l.sent();
                _l.label = 6;
            case 6:
                n += 1;
                return [3 /*break*/, 4];
            case 7:
                n = 1;
                _l.label = 8;
            case 8:
                if (!(n <= 12)) return [3 /*break*/, 11];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n), state: 'done' })];
            case 9:
                _l.sent();
                _l.label = 10;
            case 10:
                n += 1;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, call('todo', { item: 'Round step 13', state: 'doing' })];
            case 12:
                _l.sent();
                return [4 /*yield*/, call('note', { text: 'New round on the nose only.' })];
            case 13:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 14:
                pane = _l.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 15:
                edge = (_l.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); });
                expect(edge.map(function (b) { return [b.props.backgroundColor, b.props.flexGrow]; })).toEqual([['#8A63F0', 12], ['#8A63F0AD', 1], ['#8A63F05C', 3]]);
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ done/ })];
            case 16:
                _a.apply(void 0, [(_g = (_l.sent())) === null || _g === void 0 ? void 0 : _g.text]).toContain('12 of 16 done');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Step / })];
            case 17:
                _b.apply(void 0, [(_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.text]).toBe('Step 13 of 16 ·');
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Round step 13$/ })];
            case 18:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Round step 14$/ })];
            case 19:
                _d.apply(void 0, [_l.sent()]).toBeUndefined();
                // With nothing being done, the bar has no lighter part and the next is named dim
                return [4 /*yield*/, call('todo', { item: 'Round step 13', state: 'done' })];
            case 20:
                // With nothing being done, the bar has no lighter part and the next is named dim
                _l.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 21:
                after = (_l.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); });
                expect(after.map(function (b) { return [b.props.backgroundColor, b.props.flexGrow]; })).toEqual([['#8A63F0', 13], ['#8A63F05C', 3]]);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Next, step / })];
            case 22:
                _e.apply(void 0, [(_j = (_l.sent())) === null || _j === void 0 ? void 0 : _j.text]).toBe('Next, step 14 of 16 ·');
                n = 14;
                _l.label = 23;
            case 23:
                if (!(n <= 16)) return [3 /*break*/, 26];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n), state: 'done' })];
            case 24:
                _l.sent();
                _l.label = 25;
            case 25:
                n += 1;
                return [3 /*break*/, 23];
            case 26:
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^All \d+ steps done$/ })];
            case 27:
                _f.apply(void 0, [(_k = (_l.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('All 16 steps done');
                return [2 /*return*/];
        }
    });
}); });
test("a pressed card shows the work's own chat: what it was told, what it wrote, and each tool step in order", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var talk, logged, _i, _a, use, _b, _c, surface, pane, tab, said, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, texts, _p, _q;
    var _r, _s, _t, _u, _v, _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                talk = [
                    { role: 'user', text: '', toolUses: [] },
                    {
                        role: 'assistant',
                        text: 'The nostril is open on the left side.',
                        toolUses: [
                            { tool_use_id: 'u1', tool: 'Read', input: { file_path: '/repo/heads/nose.py' } },
                            { tool_use_id: 'u2', tool: 'Bash', input: { command: 'python fit.py --head A', description: 'Fit the nostril again' }, isError: true },
                            { tool_use_id: 'u3', tool: 'mcp__claudopus__note', input: { text: 'I am fitting the nostril again.' } },
                            { tool_use_id: 'u4', tool: 'mcp__notes__search', input: { query: 'nose' } },
                            { tool_use_id: 'u6', tool: 'mcp__claudopus__todo', input: { item: 'Fit the nostril again', state: 'done' } },
                        ],
                    },
                    { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'u1', text: 'def nose(): ...', isError: false }] },
                    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u7', tool: 'mcp__claudopus__note', input: { text: 'Now  the left one.' } }] },
                    { role: 'assistant', text: '', toolUses: [{ tool_use_id: 'u5', tool: 'SubagentHandback', input: { message: 'The nostril is **closed**.' } }] },
                ];
                logged = world(on, { talk: talk }).logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _0.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _0.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose on head A.' }))
                    // It was told the prompt as the mod left it, the panel rule included, and what the app adds for the model alone
                ];
            case 3:
                _0.sent();
                // It was told the prompt as the mod left it, the panel rule included, and what the app adds for the model alone
                expect(prompts[0]).toContain('mcp__claudopus__todo');
                talk[0] = { role: 'user', text: "".concat(prompts[0], "<system-reminder>For the model alone.</system-reminder>"), toolUses: [] };
                _i = 0, _a = (_s = (_r = talk[1]) === null || _r === void 0 ? void 0 : _r.toolUses) !== null && _s !== void 0 ? _s : [];
                _0.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                use = _a[_i];
                return [4 /*yield*/, $.tool.call(__assign({ tool: use.tool, tool_use_id: use.tool_use_id, agentId: 'a1' }, use.input))];
            case 5:
                _0.sent();
                _0.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, $.prompt.submit({ text: 'No, the left one.', wait: false, origin: composer })];
            case 8:
                _0.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “No, the left one.”' })];
            case 9:
                _0.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a1', text: 'Now  the left one.' })];
            case 10:
                _0.sent();
                _b = 0, _c = ['terminal', 'desktop', 'vscode', 'mobile'];
                _0.label = 11;
            case 11:
                if (!(_b < _c.length)) return [3 /*break*/, 36];
                surface = _c[_b];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
            case 12:
                pane = _0.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 13:
                _0.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: surface }))
                    // The panel rule and what the app adds for the model alone are left out of what it was told
                ];
            case 14:
                tab = _0.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Markdown' })];
            case 15:
                said = (_0.sent()).map(function (one) { return one.props.text; });
                expect(said).toEqual(['Fix the nose on head A.', 'The nostril is open on the left side.', 'I am fitting the nostril again.', 'No, the left one.', 'Now  the left one.', 'The nostril is **closed**.']);
                // There is no "Latest" button
                _d = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', text: /^Latest$/ })];
            case 16:
                // There is no "Latest" button
                _d.apply(void 0, [_0.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, keyed(tab, 'latest')];
            case 17:
                _e.apply(void 0, [_0.sent()]).toBeUndefined();
                // A tool step is one line: what it was for, or what it was pointed at; one that failed says so
                // A run of tool steps is one quiet row saying what was done; pressed, it opens
                _f = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Read/ })];
            case 18:
                // A tool step is one line: what it was for, or what it was pointed at; one that failed says so
                // A run of tool steps is one quiet row saying what was done; pressed, it opens
                _f.apply(void 0, [_0.sent()]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, keyed(tab, 'run-1')];
            case 19:
                _g.apply(void 0, [(_t = (_0.sent())) === null || _t === void 0 ? void 0 : _t.props.label]).toBe('▸ Ran 1 command, read 1 file, 1 failed');
                _h = expect;
                return [4 /*yield*/, keyed(tab, 'run-4')];
            case 20:
                _h.apply(void 0, [(_u = (_0.sent())) === null || _u === void 0 ? void 0 : _u.props.label]).toBe('▸ Took 1 other step');
                _j = expect;
                return [4 /*yield*/, keyed(tab, 'run-5')];
            case 21:
                _j.apply(void 0, [(_v = (_0.sent())) === null || _v === void 0 ? void 0 : _v.props.label]).toBe('▸ Updated its to-dos');
                return [4 /*yield*/, pressed(tab, 'run-1')];
            case 22:
                _0.sent();
                return [4 /*yield*/, pressed(tab, 'run-4')];
            case 23:
                _0.sent();
                return [4 /*yield*/, pressed(tab, 'run-5')];
            case 24:
                _0.sent();
                _k = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Read/ })];
            case 25:
                _k.apply(void 0, [(_w = (_0.sent())) === null || _w === void 0 ? void 0 : _w.text]).toBe('Read nose.py');
                _l = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Fit the nostril again \(/ })];
            case 26:
                _l.apply(void 0, [(_x = (_0.sent())) === null || _x === void 0 ? void 0 : _x.text]).toBe('Fit the nostril again (failed)');
                _m = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^search/ })];
            case 27:
                _m.apply(void 0, [(_y = (_0.sent())) === null || _y === void 0 ? void 0 : _y.text]).toBe('search: nose');
                _o = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Ticked/ })];
            case 28:
                _o.apply(void 0, [(_z = (_0.sent())) === null || _z === void 0 ? void 0 : _z.text]).toBe('Ticked: Fit the nostril again');
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 29:
                texts = (_0.sent()).map(function (one) { return one.text; });
                expect(texts.indexOf('You')).toBe(texts.indexOf('search: nose') + 1);
                expect(texts.indexOf('Ticked: Fit the nostril again')).toBeGreaterThan(texts.indexOf('You'));
                // Pressed again, a run folds
                return [4 /*yield*/, pressed(tab, 'run-1')];
            case 30:
                // Pressed again, a run folds
                _0.sent();
                _p = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Read/ })];
            case 31:
                _p.apply(void 0, [_0.sent()]).toBeUndefined();
                // A tool's result is no line of the chat
                _q = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /def nose/ })];
            case 32:
                // A tool's result is no line of the chat
                _q.apply(void 0, [_0.sent()]).toBeUndefined();
                return [4 /*yield*/, tab.unmount()];
            case 33:
                _0.sent();
                return [4 /*yield*/, pane.unmount()];
            case 34:
                _0.sent();
                _0.label = 35;
            case 35:
                _b++;
                return [3 /*break*/, 11];
            case 36:
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('a steer is sent as written and the work is told it is one, the work is reminded until it says what it decided, and a new task goes back to the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, sent, appended, submitted, clock, step, noted, n;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), sent = _a.sent, appended = _a.appended, submitted = _a.submitted, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _b.sent();
                step = function (tool, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: 't', agentId: 'a1' }, input));
                };
                return [4 /*yield*/, $.prompt.submit({ text: 'Also make me a chart of the ears.', wait: false, origin: composer })];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: “Also make me a chart of the ears.”' })
                    // The chat's call goes on as it was made; the work is told in its own chat what a steer asks of it
                ];
            case 5:
                _b.sent();
                // The chat's call goes on as it was made; the work is told in its own chat what a steer asks of it
                expect(sent[0]).toBe('Sam: “Also make me a chart of the ears.”');
                expect(appended).toHaveLength(1);
                // The chat put a name before their words: only the words quoted are told as theirs
                expect(appended[0]).toContain('a1: The message sent to you just now carries the person\'s words "Also make me a chart of the ears.", typed by them in the chat. Only those words are the person\'s');
                expect(appended[0]).toContain('Decide which of three it is');
                expect(appended[0]).toContain('added it to your to-do list');
                expect(appended.join('\n')).not.toMatch(/steer/i);
                // The work goes on without saying what it decided: after two steps it is told so, once
                return [4 /*yield*/, step('Bash')];
            case 6:
                // The work goes on without saying what it decided: after two steps it is told so, once
                _b.sent();
                expect(appended).toHaveLength(1);
                return [4 /*yield*/, step('Bash')];
            case 7:
                _b.sent();
                return [4 /*yield*/, step('Bash')];
            case 8:
                _b.sent();
                expect(appended).toHaveLength(2);
                expect(appended[1]).toContain('a1: A message from the person is waiting for your decision');
                return [4 /*yield*/, step('mcp__claudopus__note', { text: 'Your chart of the ears is a new task; I go on with the nose.', task: 'Make a chart of the ears' })
                    // The work hands it to the chat itself, as its own message: the mod submits nothing that would show as the person's
                ];
            case 9:
                noted = _b.sent();
                // The work hands it to the chat itself, as its own message: the mod submits nothing that would show as the person's
                expect(String(noted.result)).toContain('call SendMessage (load it with ToolSearch if needed) with to "main"');
                expect(String(noted.result)).toContain('Start it as its own background task: Make a chart of the ears');
                expect(String(noted.result)).toContain('Also make me a chart of the ears.');
                expect(String(noted.result)).toContain("don't do that new one here");
                return [4 /*yield*/, clock.advance(10)];
            case 10:
                _b.sent();
                expect(submitted).toHaveLength(0);
                n = 0;
                _b.label = 11;
            case 11:
                if (!(n < 5)) return [3 /*break*/, 14];
                return [4 /*yield*/, step('Bash')];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13:
                n += 1;
                return [3 /*break*/, 11];
            case 14:
                expect(appended).toHaveLength(2);
                // Work that has ended is sent a message, not a steer
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 15:
                // Work that has ended is sent a message, not a steer
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't2', to: 'a1', message: 'Sam: thanks' })];
            case 16:
                _b.sent();
                expect(sent[1]).toBe('Sam: thanks');
                expect(appended).toHaveLength(2);
                return [2 /*return*/];
        }
    });
}); });
test("only the person's words sent on by the chat are their steer: a helper's reply, work to work and the chat's own note are told as their sender's", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var appended, steps;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appended = world(on).appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: false, description: 'Count nostrils', prompt: 'count', parentAgentId: 'a1' })];
            case 5:
                _a.sent();
                steps = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = 0;
                                _a.label = 1;
                            case 1:
                                if (!(n < 3)) return [3 /*break*/, 4];
                                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b', agentId: id })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                n += 1;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                // A helper replies to the work that started it, and that work writes to its helper
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'There are two nostrils.', agentId: 'a3' })];
            case 6:
                // A helper replies to the work that started it, and that work writes to its helper
                _a.sent();
                expect(appended.at(-1)).toBe('a1: The message sent to you just now that begins "There are two nostrils." is from your helper "Count nostrils", not from the person: that one is not theirs. Take it as your helper "Count nostrils"\'s and continue; a message that carries the person\'s own words stays theirs.');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a3', message: 'Count them again.', agentId: 'a1' })];
            case 7:
                _a.sent();
                expect(appended.at(-1)).toContain('a3: The message sent to you just now that begins "Count them again." is from the task that started you, not from the person');
                // One piece of work writes to another
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's3', to: 'a2', message: 'The nose is done, check the ears against it.', agentId: 'a1' })];
            case 8:
                // One piece of work writes to another
                _a.sent();
                expect(appended.at(-1)).toContain('is from the task "Fix the nose", not from the person');
                // The chat's own note, which carries none of the person's words, is the chat's
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's4', to: 'a1', message: 'A fault seen from the chat: the card shows the wrong model.' })];
            case 9:
                // The chat's own note, which carries none of the person's words, is the chat's
                _a.sent();
                expect(appended.at(-1)).toContain('is from the chat, not from the person');
                expect(appended.join('\n')).not.toContain('from the person, in their own words');
                // Nothing is owed for them: going on, the work is not reminded of a steer
                return [4 /*yield*/, steps('a1')];
            case 10:
                // Nothing is owed for them: going on, the work is not reminded of a steer
                _a.sent();
                expect(appended.join('\n')).not.toContain('waiting for your decision');
                // A short message of theirs counts as whole words only: "yes" is not in "eyes"
                return [4 /*yield*/, $.prompt.submit({ text: 'yes', wait: false, origin: composer })];
            case 11:
                // A short message of theirs counts as whole words only: "yes" is not in "eyes"
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's8', to: 'a1', message: 'Check the eyes again.' })];
            case 12:
                _a.sent();
                expect(appended.at(-1)).toContain('is from the chat, not from the person');
                // The person's words, sent on by the chat, are their steer, and the card keeps them
                return [4 /*yield*/, $.prompt.submit({ text: 'Make the left nostril a little wider than the right one.', wait: false, origin: composer })];
            case 13:
                // The person's words, sent on by the chat, are their steer, and the card keeps them
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's5', to: 'a1', message: 'Sam on the nose, in their words: “Make the left nostril — a little wider than the right one”' })];
            case 14:
                _a.sent();
                expect(appended.at(-1)).toContain('carries the person\'s words "Make the left nostril a little wider than the right one.", typed by them in the chat. Only those words are the person\'s');
                return [4 /*yield*/, steps('a1')];
            case 15:
                _a.sent();
                expect(appended.at(-1)).toContain('a1: A message from the person is waiting for your decision');
                // The same words sent by a piece of work are still not the person's steer
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's6', to: 'a2', message: 'Make the left nostril a little wider than the right one.', agentId: 'a1' })];
            case 16:
                // The same words sent by a piece of work are still not the person's steer
                _a.sent();
                expect(appended.at(-1)).toContain('is from the task "Fix the nose"');
                // Once the chat's turn is over, a message from it is its own again
                return [4 /*yield*/, $.turn.complete({ answer: 'Sent.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer' })];
            case 17:
                // Once the chat's turn is over, a message from it is its own again
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's7', to: 'a2', message: 'Make the left nostril a little wider than the right one.' })];
            case 18:
                _a.sent();
                expect(appended.at(-1)).toContain('is from the chat, not from the person');
                return [2 /*return*/];
        }
    });
}); });
test("the person's words sent to work that has ended are theirs, and the chat's own note sent after them is labelled by its own start", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, sent, all;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), appended = _a.appended, sent = _a.sent;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The nose is fixed. Shall I build it into the app? '.repeat(20), durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'Yes, build the nose into the app', wait: false, origin: composer })];
            case 5:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'From Sam, as they said it: "Yes, build the nose into the app"' })];
            case 6:
                _b.sent();
                all = __spreadArray(__spreadArray([], appended, true), sent, true).join('\n');
                expect(all).toContain('The message that started you again carries the person\'s words "Yes, build the nose into the app", typed by them in the chat. Only those words are the person\'s');
                expect(all).not.toContain('not from the person');
                // The work, started again, is working when the chat's own note follows: that line names the note, not their words
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1' })];
            case 7:
                // The work, started again, is working when the chat's own note follows: that line names the note, not their words
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's2', to: 'a1', message: 'From the chat, not Sam: release through the release command.' })];
            case 8:
                _b.sent();
                expect(appended.at(-1)).toContain('that begins "From the chat, not Sam: release through the release command." is from the chat, not from the person: that one is not theirs');
                return [2 /*return*/];
        }
    });
}); });
test('work that takes many steps without touching its to-dos is reminded to bring them up to date', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var appended, step, n, n, n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appended = world(on).appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _a.sent();
                step = function (tool, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: 't', agentId: 'a1' }, input));
                };
                n = 0;
                _a.label = 3;
            case 3:
                if (!(n < 11)) return [3 /*break*/, 6];
                return [4 /*yield*/, step('Bash')];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                n += 1;
                return [3 /*break*/, 3];
            case 6:
                expect(appended).toEqual([]);
                return [4 /*yield*/, step('Read')];
            case 7:
                _a.sent();
                expect(appended).toHaveLength(1);
                expect(appended[0]).toContain('a1: You have taken 12 steps since you last touched your to-dos');
                n = 0;
                _a.label = 8;
            case 8:
                if (!(n < 11)) return [3 /*break*/, 11];
                return [4 /*yield*/, step('Bash')];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                n += 1;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, step('mcp__claudopus__todo', { item: 'Fit the nostril again', state: 'doing' })];
            case 12:
                _a.sent();
                n = 0;
                _a.label = 13;
            case 13:
                if (!(n < 11)) return [3 /*break*/, 16];
                return [4 /*yield*/, step('Bash')];
            case 14:
                _a.sent();
                _a.label = 15;
            case 15:
                n += 1;
                return [3 /*break*/, 13];
            case 16:
                expect(appended).toHaveLength(1);
                return [4 /*yield*/, step('Bash')];
            case 17:
                _a.sent();
                expect(appended).toHaveLength(2);
                return [2 /*return*/];
        }
    });
}); });
test('work that ends in an error is kept as failed, time lying ended is not counted, and work under way is never forgotten', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, pane, tab, _a, _b, n, r, again, _c;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                pane = _g.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 4:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 5:
                tab = _g.sent();
                return [4 /*yield*/, clock.advance(120000)];
            case 6:
                _g.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'error', agentId: 'a1' })];
            case 7:
                _g.sent();
                _a = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Failed with/ })];
            case 8:
                _a.apply(void 0, [(_d = (_g.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('Failed with an error · 2m 00s');
                // An hour later it is sent a message and works again: the hour is not counted
                return [4 /*yield*/, clock.advance(3600000)];
            case 9:
                // An hour later it is sent a message and works again: the hour is not counted
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'try again', resume: { agentId: 'a1' } }))];
            case 10:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^2m/ })];
            case 11:
                _b.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('2m 00s');
                return [4 /*yield*/, tab.unmount()
                    // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
                ];
            case 12:
                _g.sent();
                // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
                return [4 /*yield*/, pane.unmount()];
            case 13:
                // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
                _g.sent();
                n = 0;
                _g.label = 14;
            case 14:
                if (!(n < 50)) return [3 /*break*/, 18];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Other ".concat(n), prompt: 'x' }))];
            case 15:
                r = _g.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: "t-".concat(n), reason: 'answer', agentId: r.agentId })];
            case 16:
                _g.sent();
                _g.label = 17;
            case 17:
                n += 1;
                return [3 /*break*/, 14];
            case 18: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 19:
                again = _g.sent();
                _c = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: /Fix the nose/ })];
            case 20:
                _c.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('Fix the nose');
                return [4 /*yield*/, again.unmount()];
            case 21:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a chat the app has not kept is said so, with the answer the work gave', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var pane, tab, _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                world(on, { talk: { deny: 'no transcript for a1' } });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                pane = _e.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 4:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 5:
                tab = _e.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 6:
                _e.sent();
                _a = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /save this task/ })];
            case 7:
                _a.apply(void 0, [(_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.text]).toBe("The app didn't save this task's conversation.");
                _b = expect;
                return [4 /*yield*/, tab.find({ type: 'Markdown' })];
            case 8:
                _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.props.text]).toBe('The nostril is closed.');
                return [4 /*yield*/, tab.unmount()];
            case 9:
                _e.sent();
                return [4 /*yield*/, pane.unmount()];
            case 10:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a message of mine passed on to work already listed opens its to-do again, and that work is not told the panel rule twice', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var pane, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'The nostril is closed.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 5:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'No, the left nostril, not the right one.', wait: false, origin: composer })];
            case 6:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 't1', to: 'a1', message: 'Sam: the left nostril' })];
            case 7:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'the left nostril', resume: { agentId: 'a1' } }))];
            case 8:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 9:
                pane = _c.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^\d+s$/ })];
            case 10:
                _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.text]).toBe('0s');
                expect(prompts.at(-1)).toBe('the left nostril');
                return [4 /*yield*/, pane.unmount()];
            case 11:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the panel shows how full the context of this chat and of each piece of work is, and the model the work runs on', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var kinds, _a, _b, _c, chunk, e_1_1, pane, _d, _e, _f, _g, _h, _j, _k, chunk, e_2_1, n, _l, wide, _m, narrow, _o, slim, _p, _q;
    var _r, e_1, _s, _t, _u, e_2, _v, _w;
    var _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0:
                world(on, { model: 'claude-opus-5-5-20261001' });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _3.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })
                    // A copy of the chat, as work began before every piece started from a brief, has the chat's window
                ];
            case 2:
                _3.sent();
                // A copy of the chat, as work began before every piece started from a brief, has the chat's window
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { subagentType: 'fork', fork: true, prompt: 'fix the nose' }))];
            case 3:
                // A copy of the chat, as work began before every piece started from a brief, has the chat's window
                _3.sent();
                return [4 /*yield*/, $.session.measure({ context: { tokens: 110900, window: 500000, percent: 22 }, rateLimits: [], changed: ['context'] })
                    // A response of the work ends: the stream passes through whole and its size is kept
                ];
            case 4:
                _3.sent();
                kinds = [];
                _3.label = 5;
            case 5:
                _3.trys.push([5, 10, 11, 16]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' }));
                _3.label = 6;
            case 6: return [4 /*yield*/, _b.next()];
            case 7:
                if (!(_c = _3.sent(), _r = _c.done, !_r)) return [3 /*break*/, 9];
                _t = _c.value;
                _a = false;
                chunk = _t;
                kinds.push(chunk.kind);
                _3.label = 8;
            case 8:
                _a = true;
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_1_1 = _3.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 16];
            case 11:
                _3.trys.push([11, , 14, 15]);
                if (!(!_a && !_r && (_s = _b.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _s.call(_b)];
            case 12:
                _3.sent();
                _3.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16:
                expect(kinds).toEqual(['text']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 17:
                pane = _3.sent();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /This chat/ })];
            case 18:
                _d.apply(void 0, [(_x = (_3.sent())) === null || _x === void 0 ? void 0 : _x.text]).toBe('This chat: 22% · 111k of 500k');
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 19:
                _e.apply(void 0, [(_y = (_3.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('Opus 5.5');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /context/ })];
            case 20:
                _f.apply(void 0, [(_z = (_3.sent())) === null || _z === void 0 ? void 0 : _z.text]).toBe(' · context 61% (305k) · 0s');
                // Work with no to-dos has a whole purple edge
                _g = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 21:
                // Work with no to-dos has a whole purple edge
                _g.apply(void 0, [(_3.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); }).map(function (b) { return b.props.backgroundColor; })]).toEqual(['#8A63F0']);
                // A helper's row says its model, how much context it holds and its time, in that order
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' })];
            case 22:
                // A helper's row says its model, how much context it holds and its time, in that order
                _3.sent();
                _3.label = 23;
            case 23:
                _3.trys.push([23, 28, 29, 34]);
                _h = true, _j = __asyncValues($.turn.step({ turnId: 'turn-3', index: 0, model: 'm', messageCount: 2, agentId: 'a2' }));
                _3.label = 24;
            case 24: return [4 /*yield*/, _j.next()];
            case 25:
                if (!(_k = _3.sent(), _u = _k.done, !_u)) return [3 /*break*/, 27];
                _w = _k.value;
                _h = false;
                chunk = _w;
                kinds.push(chunk.kind);
                _3.label = 26;
            case 26:
                _h = true;
                return [3 /*break*/, 24];
            case 27: return [3 /*break*/, 34];
            case 28:
                e_2_1 = _3.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 34];
            case 29:
                _3.trys.push([29, , 32, 33]);
                if (!(!_h && !_u && (_v = _j.return))) return [3 /*break*/, 31];
                return [4 /*yield*/, _v.call(_j)];
            case 30:
                _3.sent();
                _3.label = 31;
            case 31: return [3 /*break*/, 33];
            case 32:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 33: return [7 /*endfinally*/];
            case 34:
                n = 0;
                _3.label = 35;
            case 35:
                if (!(n < 16)) return [3 /*break*/, 38];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: "e".concat(n), agentId: 'a1', item: "Part ".concat(n), state: n < 3 ? 'done' : 'open' })];
            case 36:
                _3.sent();
                _3.label = 37;
            case 37:
                n++;
                return [3 /*break*/, 35];
            case 38:
                _l = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 39:
                _l.apply(void 0, [(_3.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); }).map(function (b) { return [b.props.backgroundColor, b.props.flexGrow]; })]).toEqual([['#8A63F0', 3], ['#8A63F05C', 13]]);
                return [4 /*yield*/, pane.unmount()];
            case 40:
                _3.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 41:
                wide = _3.sent();
                _m = expect;
                return [4 /*yield*/, wide.find({ type: 'Text', text: /^Opus 5\.5 · / })];
            case 42:
                _m.apply(void 0, [(_0 = (_3.sent())) === null || _0 === void 0 ? void 0 : _0.text]).toBe('Opus 5.5 · 305k · 0s');
                return [4 /*yield*/, wide.unmount()
                    // A narrower panel drops the context, and the narrowest the model too, so the helper's name keeps its room
                ];
            case 43:
                _3.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 44:
                narrow = _3.sent();
                _o = expect;
                return [4 /*yield*/, narrow.find({ type: 'Text', text: /^Opus 5\.5 · / })];
            case 45:
                _o.apply(void 0, [(_1 = (_3.sent())) === null || _1 === void 0 ? void 0 : _1.text]).toBe('Opus 5.5 · 0s');
                return [4 /*yield*/, narrow.unmount()];
            case 46:
                _3.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 28 }), surface: 'desktop' }))];
            case 47:
                slim = _3.sent();
                _p = expect;
                return [4 /*yield*/, slim.find({ type: 'Text', text: /^Opus 5\.5 · / })];
            case 48:
                _p.apply(void 0, [_3.sent()]).toBeUndefined();
                _q = expect;
                return [4 /*yield*/, slim.find({ type: 'Text', text: /^\d+s$/ })];
            case 49:
                _q.apply(void 0, [(_2 = (_3.sent())) === null || _2 === void 0 ? void 0 : _2.text]).toBe('0s');
                return [4 /*yield*/, slim.unmount()];
            case 50:
                _3.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a card's title, its line of facts and every line under them start at one left edge, on a desktop and in a terminal, at work, asking and finished", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, _b, _c, chunk, e_3_1, call, insetOf, edges, expectOneEdge;
    var _this = this;
    var _d, e_3, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                clock = world(on, { model: 'claude-opus-5-5-20261001' }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { subagentType: 'fork', fork: true, prompt: 'fix the nose' }))];
            case 3:
                _g.sent();
                _g.label = 4;
            case 4:
                _g.trys.push([4, 9, 10, 15]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'm', messageCount: 2, agentId: 'a1' }));
                _g.label = 5;
            case 5: return [4 /*yield*/, _b.next()];
            case 6:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 8];
                _f = _c.value;
                _a = false;
                chunk = _f;
                void chunk;
                _g.label = 7;
            case 7:
                _a = true;
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_3_1 = _g.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 15];
            case 10:
                _g.trys.push([10, , 13, 14]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _e.call(_b)];
            case 11:
                _g.sent();
                _g.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15:
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril', state: 'doing' })];
            case 16:
                _g.sent();
                return [4 /*yield*/, call('note', { text: 'I am fitting the nostril.' })];
            case 17:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' })
                    // How far in a line's first letter is: the padding on the way down its first parts, and a desktop's own around a plain Button
                ];
            case 18:
                _g.sent();
                insetOf = function (node, surface) {
                    var _a, _b;
                    if (!node || typeof node !== 'object')
                        return [];
                    var _c = node, type = _c.type, _d = _c.props, props = _d === void 0 ? {} : _d, _e = _c.children, children = _e === void 0 ? [] : _e;
                    var own = [(_b = (_a = props.paddingLeft) !== null && _a !== void 0 ? _a : props.paddingX) !== null && _b !== void 0 ? _b : props.padding].filter(function (step) { return step !== undefined && step !== 0; }).map(String);
                    if (type === 'Button')
                        return __spreadArray(__spreadArray([], own, true), (props.plain && surface !== 'terminal' ? ['xs'] : []), true);
                    return type === 'Box' ? __spreadArray(__spreadArray([], own, true), insetOf(children.find(function (one) { return one && typeof one === 'object'; }), surface), true) : own;
                };
                edges = function (surface) { return __awaiter(_this, void 0, void 0, function () {
                    var pane, card, column, _a, head, rest;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
                            case 1:
                                pane = _e.sent();
                                return [4 /*yield*/, pane.find({ type: 'Box', key: 'todo-a1' })];
                            case 2:
                                card = (_e.sent());
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _e.sent();
                                column = ((_b = card === null || card === void 0 ? void 0 : card.children) !== null && _b !== void 0 ? _b : []).filter(function (one) { return one && typeof one === 'object'; }).at(-1);
                                _a = ((_c = column.children) !== null && _c !== void 0 ? _c : []).filter(function (one) { return one && typeof one === 'object'; }), head = _a[0], rest = _a.slice(1);
                                return [2 /*return*/, __spreadArray(__spreadArray([], ((_d = head === null || head === void 0 ? void 0 : head.children) !== null && _d !== void 0 ? _d : []), true), rest, true).filter(function (one) { return one && typeof one === 'object'; }).map(function (line) { return insetOf(line, surface).join('+'); })];
                        }
                    });
                }); };
                expectOneEdge = function (lines) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge
                                _a = expect;
                                return [4 /*yield*/, edges('desktop')];
                            case 1:
                                // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge
                                _a.apply(void 0, [_c.sent()]).toEqual(Array(lines).fill('xs'));
                                _b = expect;
                                return [4 /*yield*/, edges('terminal')];
                            case 2:
                                _b.apply(void 0, [_c.sent()]).toEqual(Array(lines).fill(''));
                                return [2 /*return*/];
                        }
                    });
                }); };
                // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
                return [4 /*yield*/, expectOneEdge(5)
                    // Asking: the ask comes between the step and the line it wrote
                ];
            case 19:
                // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
                _g.sent();
                // Asking: the ask comes between the step and the line it wrote
                return [4 /*yield*/, call('ask', { text: 'May I replace the nose?', choices: ['Approve', 'Not now'] })];
            case 20:
                // Asking: the ask comes between the step and the line it wrote
                _g.sent();
                return [4 /*yield*/, expectOneEdge(6)];
            case 21:
                _g.sent();
                return [4 /*yield*/, call('ask', { text: '' })
                    // Finished, in its pause: the facts are plain text, the line says it finished
                ];
            case 22:
                _g.sent();
                // Finished, in its pause: the facts are plain text, the line says it finished
                return [4 /*yield*/, $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })];
            case 23:
                // Finished, in its pause: the facts are plain text, the line says it finished
                _g.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Fixed.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 24:
                _g.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 25:
                _g.sent();
                return [4 /*yield*/, expectOneEdge(4)];
            case 26:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work a safety flag would move to an older model is ended with a report that says so, never run there; an agent whose own kind starts it on an older model or Haiku runs on the newest', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, stepped, files, step, pane, line, _b, flagged, _c, again;
    var _this = this;
    var _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { model: 'claude-fable-5-2', startedOn: { 'Look it up': 'claude-haiku-5-5', 'Old kind': 'claude-opus-4-1' } }), stepped = _a.stepped, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose on head A.' }))];
            case 3:
                _j.sent();
                step = function (index_1, model_1) {
                    var args_1 = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args_1[_i - 2] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([index_1, model_1], args_1, true), void 0, function (index, model, agentId) {
                        var chunks, _a, _b, _c, c, e_4_1;
                        var _d, e_4, _e, _f;
                        if (agentId === void 0) { agentId = 'a1'; }
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    chunks = [];
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 6, 7, 12]);
                                    _a = true, _b = __asyncValues($.turn.step(__assign({ turnId: 'turn-2', index: index, model: model, messageCount: 2 }, (agentId ? { agentId: agentId } : {}))));
                                    _g.label = 2;
                                case 2: return [4 /*yield*/, _b.next()];
                                case 3:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                    _f = _c.value;
                                    _a = false;
                                    c = _f;
                                    chunks.push(c);
                                    _g.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_4_1 = _g.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _g.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 8:
                                    _g.sent();
                                    _g.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [2 /*return*/, chunks];
                            }
                        });
                    });
                };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _j.sent();
                line = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a, _b; return String((_b = (_a = one.props.children) !== null && _a !== void 0 ? _a : one.text) !== null && _b !== void 0 ? _b : ''); }).join('\n')
                            // On the model it was started on, nothing is changed and the card says nothing more
                        ];
                    }
                }); }); };
                // On the model it was started on, nothing is changed and the card says nothing more
                return [4 /*yield*/, step(0, 'claude-opus-5-5')];
            case 5:
                // On the model it was started on, nothing is changed and the card says nothing more
                _j.sent();
                expect(stepped).toEqual(['claude-opus-5-5']);
                _b = expect;
                return [4 /*yield*/, line()];
            case 6:
                _b.apply(void 0, [_j.sent()]).not.toContain('safety flag');
                return [4 /*yield*/, step(1, 'claude-opus-4-8')];
            case 7:
                flagged = _j.sent();
                expect(stepped).toEqual(['claude-opus-5-5']);
                expect((_d = flagged.find(function (c) { return c.kind === 'tool'; })) === null || _d === void 0 ? void 0 : _d.name).toBe('SubagentHandback');
                expect(JSON.parse((_f = (_e = flagged.find(function (c) { return c.kind === 'input'; })) === null || _e === void 0 ? void 0 : _e.json) !== null && _f !== void 0 ? _f : '{}').message).toContain('Start what is left again on the current model, leaving out what was flagged');
                _c = expect;
                return [4 /*yield*/, line()];
            case 8:
                _c.apply(void 0, [_j.sent()]).toContain("ended after a safety flag, so it doesn't continue on Opus 4.8");
                return [4 /*yield*/, step(2, 'claude-opus-4-8')];
            case 9:
                again = _j.sent();
                expect(stepped).toEqual(['claude-opus-5-5']);
                expect((_g = again.find(function (c) { return c.kind === 'text'; })) === null || _g === void 0 ? void 0 : _g.text).toContain("an older model Claudopus doesn't run tasks on");
                expect(((_h = files.get("".concat(MEMORY, "/log.md"))) !== null && _h !== void 0 ? _h : '').split('work a1 was flagged and the app would send it to Opus 4.8').length).toBe(2);
                // A helper of an agent type that starts on Haiku runs on Sonnet 5.5; an older Sonnet the app moves it to is not run either
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look it up', prompt: 'look it up', parentAgentId: 'a1' }))];
            case 10:
                // A helper of an agent type that starts on Haiku runs on Sonnet 5.5; an older Sonnet the app moves it to is not run either
                _j.sent();
                return [4 /*yield*/, step(0, 'claude-haiku-5-5', 'a2')];
            case 11:
                _j.sent();
                expect(stepped.at(-1)).toBe('claude-sonnet-5-5');
                return [4 /*yield*/, step(1, 'claude-sonnet-5', 'a2')];
            case 12:
                _j.sent();
                expect(stepped.at(-1)).toBe('claude-sonnet-5-5');
                expect(stepped.length).toBe(2);
                // An agent whose own kind names an older Opus runs on the newest Opus, step after step
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Old kind', prompt: 'look again', parentAgentId: 'a1' }))];
            case 13:
                // An agent whose own kind names an older Opus runs on the newest Opus, step after step
                _j.sent();
                return [4 /*yield*/, step(0, 'claude-opus-4-1', 'a3')];
            case 14:
                _j.sent();
                return [4 /*yield*/, step(1, 'claude-opus-4-1', 'a3')];
            case 15:
                _j.sent();
                expect(stepped.slice(-2)).toEqual(['claude-opus-5-5', 'claude-opus-5-5']);
                // The chat's own thread runs on the model the person picked for it, whichever that is
                return [4 /*yield*/, step(0, 'claude-opus-4-8', '')];
            case 16:
                // The chat's own thread runs on the model the person picked for it, whichever that is
                _j.sent();
                expect(stepped.at(-1)).toBe('claude-opus-4-8');
                // An agent whose start the mod did not see (a workflow's, before this copy loaded) is left where the app sent it, Haiku too
                return [4 /*yield*/, step(0, 'claude-haiku-5-5', 'w1')];
            case 17:
                // An agent whose start the mod did not see (a workflow's, before this copy loaded) is left where the app sent it, Haiku too
                _j.sent();
                expect(stepped.at(-1)).toBe('claude-haiku-5-5');
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('work w1 was sent to Haiku 5.5 by the app: its steps stay there');
                return [2 /*return*/];
        }
    });
}); });
test('work the person moved to a model of their own is ended too when a safety flag would move it to an older model', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var stepped, pane, _a, _b, _c, _, e_5_1, _d, _e, _f, _, e_6_1;
    var _g, e_5, _h, _j, _k, e_6, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                stepped = world(on, { model: 'claude-opus-5-5' }).stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose on head A.' }))];
            case 3:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _o.sent();
                return [4 /*yield*/, pressed(pane, 'model-a1')];
            case 5:
                _o.sent();
                return [4 /*yield*/, pressed(pane, 'pick-a1-claude-sonnet-5-5')];
            case 6:
                _o.sent();
                _o.label = 7;
            case 7:
                _o.trys.push([7, 12, 13, 18]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 't', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _o.label = 8;
            case 8: return [4 /*yield*/, _b.next()];
            case 9:
                if (!(_c = _o.sent(), _g = _c.done, !_g)) return [3 /*break*/, 11];
                _j = _c.value;
                _a = false;
                _ = _j;
                void _;
                _o.label = 10;
            case 10:
                _a = true;
                return [3 /*break*/, 8];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_5_1 = _o.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 18];
            case 13:
                _o.trys.push([13, , 16, 17]);
                if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _h.call(_b)];
            case 14:
                _o.sent();
                _o.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_5) throw e_5.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18:
                expect(stepped).toEqual(['claude-sonnet-5-5']);
                _o.label = 19;
            case 19:
                _o.trys.push([19, 24, 25, 30]);
                _d = true, _e = __asyncValues($.turn.step({ turnId: 't', index: 1, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' }));
                _o.label = 20;
            case 20: return [4 /*yield*/, _e.next()];
            case 21:
                if (!(_f = _o.sent(), _k = _f.done, !_k)) return [3 /*break*/, 23];
                _m = _f.value;
                _d = false;
                _ = _m;
                void _;
                _o.label = 22;
            case 22:
                _d = true;
                return [3 /*break*/, 20];
            case 23: return [3 /*break*/, 30];
            case 24:
                e_6_1 = _o.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 30];
            case 25:
                _o.trys.push([25, , 28, 29]);
                if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 27];
                return [4 /*yield*/, _l.call(_e)];
            case 26:
                _o.sent();
                _o.label = 27;
            case 27: return [3 /*break*/, 29];
            case 28:
                if (e_6) throw e_6.error;
                return [7 /*endfinally*/];
            case 29: return [7 /*endfinally*/];
            case 30:
                expect(stepped).toEqual(['claude-sonnet-5-5']);
                return [2 /*return*/];
        }
    });
}); });
test('work that answers from an older model all the same says so on its card', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var answered, _a, _b, _c, _, e_7_1, pane, _d, _e;
    var _f, e_7, _g, _h;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                answered = { by: 'claude-opus-4-8' };
                world(on, { model: 'claude-fable-5-2', answered: answered });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose on head A.' }))];
            case 3:
                _k.sent();
                _k.label = 4;
            case 4:
                _k.trys.push([4, 9, 10, 15]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _k.label = 5;
            case 5: return [4 /*yield*/, _b.next()];
            case 6:
                if (!(_c = _k.sent(), _f = _c.done, !_f)) return [3 /*break*/, 8];
                _h = _c.value;
                _a = false;
                _ = _h;
                void _;
                _k.label = 7;
            case 7:
                _a = true;
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_7_1 = _k.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 15];
            case 10:
                _k.trys.push([10, , 13, 14]);
                if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _g.call(_b)];
            case 11:
                _k.sent();
                _k.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_7) throw e_7.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 16:
                pane = _k.sent();
                _d = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 17:
                _d.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.props.label]).toBe('Opus 4.8');
                _e = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 18:
                _e.apply(void 0, [(_k.sent()).map(function (one) { var _a, _b; return String((_b = (_a = one.props.children) !== null && _a !== void 0 ? _a : one.text) !== null && _b !== void 0 ? _b : ''); }).join('\n')]).toContain("Claudopus doesn't run tasks on this model");
                return [2 /*return*/];
        }
    });
}); });
test('the model a running work is on is pressed and another chosen: its next step runs on it, its card says so at once, and its chat and the work are told', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var talk, answered, _a, appended, stepped, logged, step, pane, _b, offered, _c, _d, _e, _f, tab, _g, _h, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                talk = [{ role: 'user', text: 'Fix the nose on head A.', toolUses: [] }];
                answered = {};
                _a = world(on, { model: 'claude-opus-5-5', talk: talk, answered: answered }), appended = _a.appended, stepped = _a.stepped, logged = _a.logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _v.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose on head A.' }))];
            case 3:
                _v.sent();
                step = function (index_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([index_1], args_1, true), void 0, function (index, model) {
                        var _a, _b, _c, _, e_8_1;
                        var _d, e_8, _e, _f;
                        if (model === void 0) { model = 'claude-opus-5-5'; }
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 5, 6, 11]);
                                    _a = true, _b = __asyncValues($.turn.step({ turnId: 'turn-2', index: index, model: model, messageCount: 2, agentId: 'a1' }));
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                                    _f = _c.value;
                                    _a = false;
                                    _ = _f;
                                    void _;
                                    _g.label = 3;
                                case 3:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 11];
                                case 5:
                                    e_8_1 = _g.sent();
                                    e_8 = { error: e_8_1 };
                                    return [3 /*break*/, 11];
                                case 6:
                                    _g.trys.push([6, , 9, 10]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 7:
                                    _g.sent();
                                    _g.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    if (e_8) throw e_8.error;
                                    return [7 /*endfinally*/];
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    });
                };
                return [4 /*yield*/, step(0)];
            case 4:
                _v.sent();
                expect(stepped).toEqual(['claude-opus-5-5']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // The model's name is a control that underlines under the pointer; pressed, the three models are offered, the one in use ticked
                ];
            case 5:
                pane = _v.sent();
                // The model's name is a control that underlines under the pointer; pressed, the three models are offered, the one in use ticked
                _b = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 6:
                // The model's name is a control that underlines under the pointer; pressed, the three models are offered, the one in use ticked
                _b.apply(void 0, [(_m = (_v.sent())) === null || _m === void 0 ? void 0 : _m.props.plain]).toBe(true);
                return [4 /*yield*/, pressed(pane, 'model-a1')];
            case 7:
                _v.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 8:
                offered = (_v.sent()).filter(function (one) { var _a; return /^pick-a1-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); }).map(function (one) { return one.props.label; });
                expect(offered).toEqual(['✓ Opus 5.5', 'Sonnet 5.5', 'Fable 5.2']);
                expect(offered.join(' ')).not.toMatch(/Haiku/);
                return [4 /*yield*/, pressed(pane, 'pick-a1-claude-sonnet-5-5')
                    // The card names the new model at once, and the choice is closed
                ];
            case 9:
                _v.sent();
                // The card names the new model at once, and the choice is closed
                _c = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 10:
                // The card names the new model at once, and the choice is closed
                _c.apply(void 0, [(_o = (_v.sent())) === null || _o === void 0 ? void 0 : _o.props.label]).toBe('Sonnet 5.5');
                _d = expect;
                return [4 /*yield*/, keyed(pane, 'pick-a1-claude-opus-5-5')];
            case 11:
                _d.apply(void 0, [_v.sent()]).toBeUndefined();
                // The work is told in its own chat, with the time
                expect(appended).toHaveLength(1);
                expect(appended[0]).toMatch(/^a1: Model changed to Sonnet 5\.5 at \d\d:\d\d\. The person chose it in the panel: your next steps run on Sonnet 5\.5\.$/);
                // A response under way when the choice was made, answered by the old model, leaves the card on the new one
                answered.by = 'claude-opus-5-5';
                return [4 /*yield*/, step(1)];
            case 12:
                _v.sent();
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 13:
                _e.apply(void 0, [(_p = (_v.sent())) === null || _p === void 0 ? void 0 : _p.props.label]).toBe('Sonnet 5.5');
                delete answered.by;
                stepped.pop();
                // Its next step goes to the new model, though the engine would have sent it to the old one, and the card keeps it
                return [4 /*yield*/, step(1)];
            case 14:
                // Its next step goes to the new model, though the engine would have sent it to the old one, and the card keeps it
                _v.sent();
                expect(stepped).toEqual(['claude-opus-5-5', 'claude-sonnet-5-5']);
                _f = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 15:
                _f.apply(void 0, [(_q = (_v.sent())) === null || _q === void 0 ? void 0 : _q.props.label]).toBe('Sonnet 5.5');
                // In Details the header's model is the same control, and the change is a line of its own in its chat where it happened
                talk.push({ role: 'user', text: ((_r = appended[0]) !== null && _r !== void 0 ? _r : '').slice('a1: '.length), toolUses: [] });
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 16:
                _v.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 17:
                tab = _v.sent();
                _g = expect;
                return [4 /*yield*/, keyed(tab, 'model-a1')];
            case 18:
                _g.apply(void 0, [(_s = (_v.sent())) === null || _s === void 0 ? void 0 : _s.props.label]).toBe('Sonnet 5.5');
                _h = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Model changed/ })];
            case 19:
                _h.apply(void 0, [(_t = (_v.sent())) === null || _t === void 0 ? void 0 : _t.text]).toMatch(/^Model changed to Sonnet 5\.5 · \d\d:\d\d$/);
                _j = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Markdown' })];
            case 20:
                _j.apply(void 0, [(_v.sent()).map(function (one) { return one.props.text; })]).toEqual(['Fix the nose on head A.']);
                // Choosing again moves it again; the model it is on already changes nothing
                return [4 /*yield*/, pressed(tab, 'model-a1')];
            case 21:
                // Choosing again moves it again; the model it is on already changes nothing
                _v.sent();
                return [4 /*yield*/, pressed(tab, 'pick-a1-claude-sonnet-5-5')];
            case 22:
                _v.sent();
                expect(appended).toHaveLength(1);
                return [4 /*yield*/, pressed(tab, 'model-a1')];
            case 23:
                _v.sent();
                return [4 /*yield*/, pressed(tab, 'pick-a1-claude-fable-5-2')];
            case 24:
                _v.sent();
                expect(appended[1]).toContain('a1: Model changed to Fable 5.2 at');
                return [4 /*yield*/, step(2)];
            case 25:
                _v.sent();
                expect(stepped.at(-1)).toBe('claude-fable-5-2');
                // Work that has ended names its model as plain text
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 26:
                // Work that has ended names its model as plain text
                _v.sent();
                _k = expect;
                return [4 /*yield*/, keyed(tab, 'model-a1')];
            case 27:
                _k.apply(void 0, [_v.sent()]).toBeUndefined();
                _l = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Finished/ })];
            case 28:
                _l.apply(void 0, [(_u = (_v.sent())) === null || _u === void 0 ? void 0 : _u.text]).toMatch(/^Finished · Fable 5\.2 · /);
                expect(logged).toEqual([]);
                return [4 /*yield*/, tab.unmount()];
            case 29:
                _v.sent();
                return [4 /*yield*/, pane.unmount()];
            case 30:
                _v.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Details opens as a tab of its own, named after the work, in front; pressed again it brings that tab forward and keeps what was unfolded", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, tabs, closed, _i, _b, n, pane, _c, _d, tab, _e, _f, _g, _h, _j, gone, _k;
    var _this = this;
    var _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _a = world(on, { panes: ['claudopus', 'work-a1'] }), opened = _a.opened, tabs = _a.tabs, closed = _a.closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _p.sent();
                _i = 0, _b = [1, 2, 3, 4, 5];
                _p.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                n = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__todo', tool_use_id: 't', agentId: 'a1', item: "Step ".concat(n) })];
            case 5:
                _p.sent();
                _p.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 8:
                pane = _p.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 9:
                _p.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.includes('work-a1: Fix the nose') || undefined];
                    }); }); })];
            case 10:
                _c.apply(void 0, [_p.sent()]).toBe(true);
                // The pressed button comes back under a new key, so the list is not held where it was
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'open-a1-0' })];
            case 11:
                // The pressed button comes back under a new key, so the list is not held where it was
                _d.apply(void 0, [_p.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 12:
                tab = _p.sent();
                _e = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Step 5$/ })];
            case 13:
                _e.apply(void 0, [_p.sent()]).toBeDefined();
                // Pressed again with its tab open: the same tab comes forward, nothing is closed, and it stays unfolded
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 14:
                // Pressed again with its tab open: the same tab comes forward, nothing is closed, and it stays unfolded
                _p.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (opened.filter(function (id) { return id === 'work-a1'; }).length === 2 ? true : undefined)];
                    }); }); })];
            case 15:
                _f.apply(void 0, [_p.sent()]).toBe(true);
                expect(closed).not.toContain('claudopus');
                _g = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Step 5$/ })];
            case 16:
                _g.apply(void 0, [_p.sent()]).toBeDefined();
                // The list is still the list: its header and the card
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Claudopus$/ })];
            case 17:
                // The list is still the list: its header and the card
                _h.apply(void 0, [(_l = (_p.sent())) === null || _l === void 0 ? void 0 : _l.props.bold]).toBe(true);
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 18:
                _j.apply(void 0, [(_m = (_p.sent())) === null || _m === void 0 ? void 0 : _m.props.wrap]).toBe('truncate-end');
                return [4 /*yield*/, tab.unmount()
                    // A tab for work no longer kept says so
                ];
            case 19:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-zz', surface: 'desktop' }))];
            case 20:
                gone = _p.sent();
                _k = expect;
                return [4 /*yield*/, gone.find({ type: 'Text' })];
            case 21:
                _k.apply(void 0, [(_o = (_p.sent())) === null || _o === void 0 ? void 0 : _o.text]).toBe('This task is no longer available.');
                return [4 /*yield*/, gone.unmount()];
            case 22:
                _p.sent();
                return [4 /*yield*/, pane.unmount()];
            case 23:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a Details tab draws at once, before a long chat is read, and fills in once it is", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var give, given, tab, _a, _b, _c, _d;
    var _this = this;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                give = function () { return undefined; };
                given = new Promise(function (resolve) { return (give = resolve); });
                world(on, { talk: given.then(function () { return [{ role: 'assistant', text: 'The nostril is closed.', toolUses: [] }]; }) });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 4:
                tab = _g.sent();
                _a = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Fix the nose$/ })];
            case 5:
                _a.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.props.bold]).toBe(true);
                _b = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Reading the conversation/ })];
            case 6:
                _b.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('Reading the conversation…');
                give();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tab.find({ type: 'Markdown' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.text];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [(_g.sent())]).toBe('The nostril is closed.');
                _d = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Reading the conversation/ })];
            case 8:
                _d.apply(void 0, [_g.sent()]).toBeUndefined();
                return [4 /*yield*/, tab.unmount()];
            case 9:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the stop button of a to-do stops its work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, stopped, clock, pane, titles, _b, _c, _d, _e, _f, _g;
    var _this = this;
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), stopped = _a.stopped, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _j.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })];
            case 5:
                _j.sent();
                expect(stopped).toEqual(['a1']);
                titles = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; }).filter(function (text) { return /nose|ears/.test(text); })];
                    }
                }); }); };
                _b = expect;
                return [4 /*yield*/, titles()];
            case 6:
                _b.apply(void 0, [_j.sent()]).toEqual(['Fix the nose', 'Check the ears']);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 7:
                _c.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.props.dimColor]).toBe(true);
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 8:
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 9:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 10:
                _e.apply(void 0, [_j.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 11:
                _f.apply(void 0, [_j.sent()]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /^\d+s$/ })];
            case 12:
                _g.apply(void 0, [_j.sent()]).toHaveLength(1);
                return [4 /*yield*/, pane.unmount()];
            case 13:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that finishes comes to the top for two seconds: two at once, one ended while the panel was closed, one that reports twice', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, end, pane, titles, fold, _a, _b, _c, _d, _e, _f, again, _g, _h, _j, _k, _l, _m, _o;
    var _this = this;
    var _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _t.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _t.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _t.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 4:
                _t.sent();
                end = function (agentId, turnId) { return $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: agentId }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                pane = _t.sent();
                titles = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.bold && /nose|ears|eyes/.test(one.text); }).map(function (one) { return one.text; })];
                    }
                }); }); };
                fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label
                            // Two that end together both go to the top, green, the newer first, over the one still working; neither is under Finished yet
                        ];
                    }
                }); }); };
                // Two that end together both go to the top, green, the newer first, over the one still working; neither is under Finished yet
                return [4 /*yield*/, clock.advance(400)];
            case 6:
                // Two that end together both go to the top, green, the newer first, over the one still working; neither is under Finished yet
                _t.sent();
                return [4 /*yield*/, end('a1', 't1')];
            case 7:
                _t.sent();
                return [4 /*yield*/, clock.advance(100)];
            case 8:
                _t.sent();
                return [4 /*yield*/, end('a3', 't3')];
            case 9:
                _t.sent();
                _a = expect;
                return [4 /*yield*/, titles()];
            case 10:
                _a.apply(void 0, [_t.sent()]).toEqual(['Draw the eyes', 'Fix the nose', 'Check the ears']);
                _b = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: '✓ Finished' })];
            case 11:
                _b.apply(void 0, [_t.sent()]).toHaveLength(2);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Working on/ })];
            case 12:
                _c.apply(void 0, [(_p = (_t.sent())) === null || _p === void 0 ? void 0 : _p.text]).toBe('Working on 1 thing');
                _d = expect;
                return [4 /*yield*/, fold()];
            case 13:
                _d.apply(void 0, [_t.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 14:
                _t.sent();
                _e = expect;
                return [4 /*yield*/, titles()];
            case 15:
                _e.apply(void 0, [_t.sent()]).toEqual(['Check the ears']);
                _f = expect;
                return [4 /*yield*/, fold()];
            case 16:
                _f.apply(void 0, [_t.sent()]).toBe('▸ Finished 2');
                // Work that ends while the panel is closed is already under Finished when it opens two seconds on: no card is left green
                return [4 /*yield*/, pane.unmount()];
            case 17:
                // Work that ends while the panel is closed is already under Finished when it opens two seconds on: no card is left green
                _t.sent();
                return [4 /*yield*/, end('a2', 't2')];
            case 18:
                _t.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 19:
                _t.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 20:
                again = _t.sent();
                _g = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: '✓ Finished' })];
            case 21:
                _g.apply(void 0, [_t.sent()]).toBeUndefined();
                _h = expect;
                return [4 /*yield*/, again.findAll({ type: 'Button' })];
            case 22:
                _h.apply(void 0, [(_q = (_t.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _q === void 0 ? void 0 : _q.props.label]).toBe('▸ Finished 3');
                // Work sent on again is back among the running cards; when it ends again it pauses again, then goes back to Finished
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am looking at the nose again.' })];
            case 23:
                // Work sent on again is back among the running cards; when it ends again it pauses again, then goes back to Finished
                _t.sent();
                _j = expect;
                return [4 /*yield*/, again.find({ type: 'Button', key: 'stop-a1' })];
            case 24:
                _j.apply(void 0, [_t.sent()]).toBeDefined();
                return [4 /*yield*/, end('a1', 't4')];
            case 25:
                _t.sent();
                _k = expect;
                return [4 /*yield*/, again.findAll({ type: 'Text', text: '✓ Finished' })];
            case 26:
                _k.apply(void 0, [_t.sent()]).toHaveLength(1);
                _l = expect;
                return [4 /*yield*/, again.findAll({ type: 'Button' })];
            case 27:
                _l.apply(void 0, [(_r = (_t.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _r === void 0 ? void 0 : _r.props.label]).toBe('▸ Finished 2');
                return [4 /*yield*/, clock.advance(2100)];
            case 28:
                _t.sent();
                _m = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: '✓ Finished' })];
            case 29:
                _m.apply(void 0, [_t.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, again.findAll({ type: 'Button' })];
            case 30:
                _o.apply(void 0, [(_s = (_t.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _s === void 0 ? void 0 : _s.props.label]).toBe('▸ Finished 3');
                return [4 /*yield*/, again.unmount()];
            case 31:
                _t.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work the engine runs is listed even when the mod never saw it start, and work it reports as failed leaves the panel', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, pane, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                agents = { a7: 'running' };
                kinds = {};
                clock = world(on, { agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _f.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Listed/ })];
            case 3:
                _a.apply(void 0, [(_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('Listed by the engine');
                // A helper the mod never saw start is no to-do
                agents.h9 = 'running';
                kinds.h9 = 'general-purpose';
                return [4 /*yield*/, clock.advance(20000)];
            case 4:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /Listed/ })];
            case 5:
                _b.apply(void 0, [_f.sent()]).toHaveLength(1);
                agents.a7 = 'failed';
                return [4 /*yield*/, clock.advance(20000)];
            case 6:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return pane.find({ type: 'Text', text: /^Nothing/ }); })];
            case 7:
                _c.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Nothing is running');
                return [4 /*yield*/, pane.unmount()];
            case 8:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a helper, and the work waiting on it, that ended while the mod was out are ended on their cards from their saved record, the work passed its result first, never drawn at work or warned about as stuck (16 Nov a second look that ended unheard was drawn at work for 47 minutes)', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, files, resumed, appended, pane, _b, folder, handback, saved, _c, _d, _e, _f;
    var _this = this;
    var _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), clock = _a.clock, files = _a.files, resumed = _a.resumed, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Second look', prompt: 'go', parentAgentId: 'a1' })];
            case 3:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Picture', prompt: 'go', parentAgentId: 'a1' })
                    // The work ends its step to wait on its helper: it is still at work
                ];
            case 4:
                _m.sent();
                // The work ends its step to wait on its helper: it is still at work
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on the second look.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 5:
                // The work ends its step to wait on its helper: it is still at work
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 6:
                pane = _m.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Working on/ })];
            case 7:
                _b.apply(void 0, [(_g = (_m.sent())) === null || _g === void 0 ? void 0 : _g.text]).toBe('Working on 1 thing');
                folder = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents");
                handback = function (text) { return JSON.stringify({ timestamp: '2026-11-16T13:25:13Z', type: 'assistant', message: { content: [{ type: 'tool_use', name: 'SubagentHandback', input: { message: text } }] } }); };
                files.set("".concat(folder, "/agent-a2.meta.json"), JSON.stringify({ description: 'Second look', spawnDepth: 2, parentAgentId: 'a1', finished: true }));
                files.set("".concat(folder, "/agent-a2.jsonl"), handback('Nothing wrong found.'));
                files.set("".concat(folder, "/agent-a1.meta.json"), JSON.stringify({ description: 'Fix the nose', spawnDepth: 1, finished: true }));
                saved = function () {
                    var _a, _b, _c, _d;
                    var kept = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}');
                    return __spreadArray(__spreadArray(__spreadArray([], ((_b = kept.cards) !== null && _b !== void 0 ? _b : []), true), ((_c = kept.helpers) !== null && _c !== void 0 ? _c : []), true), ((_d = kept.ended) !== null && _d !== void 0 ? _d : []), true);
                };
                // The helper ends on its card with its report, and the work that waited on it is passed that report and started again, not ended
                return [4 /*yield*/, clock.advance(70000)];
            case 8:
                // The helper ends on its card with its report, and the work that waited on it is passed that report and started again, not ended
                _m.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one.startsWith('a1: From Claudopus: your helper "Second look" has finished') && one.endsWith('Nothing wrong found.'); })];
                    }); }); })];
            case 9:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                expect(saved().find(function (one) { return one.id === 'a2'; })).toMatchObject({ status: 'done', answer: 'Nothing wrong found.' });
                expect((_h = saved().find(function (one) { return one.id === 'a1'; })) === null || _h === void 0 ? void 0 : _h.status).toBe('working');
                // Started again, it runs (its record no longer says finished); its other helper's unheard end reaches it at its next step
                agents.a1 = 'running';
                files.set("".concat(folder, "/agent-a1.meta.json"), JSON.stringify({ description: 'Fix the nose', spawnDepth: 1 }));
                files.set("".concat(folder, "/agent-a3.meta.json"), JSON.stringify({ description: 'Picture', spawnDepth: 2, parentAgentId: 'a1', finished: true }));
                files.set("".concat(folder, "/agent-a3.jsonl"), handback('The picture is drawn.'));
                return [4 /*yield*/, clock.advance(2 * 60000)];
            case 10:
                _m.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: From Claudopus: your helper "Picture" has finished') && one.endsWith('The picture is drawn.'); })];
                    }); }); })];
            case 11:
                _d.apply(void 0, [_m.sent()]).toBeDefined();
                // then hands back its own report while the mod is out once more: its card ends with that report
                expect((_j = saved().find(function (one) { return one.id === 'a1'; })) === null || _j === void 0 ? void 0 : _j.status).toBe('working');
                delete agents.a1;
                files.set("".concat(folder, "/agent-a1.meta.json"), JSON.stringify({ description: 'Fix the nose', spawnDepth: 1, finished: true }));
                files.set("".concat(folder, "/agent-a1.jsonl"), handback('The fix is released.'));
                return [4 /*yield*/, clock.advance(31 * 60000)];
            case 12:
                _m.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return pane.find({ type: 'Text', text: /^Nothing/ }); })];
            case 13:
                _e.apply(void 0, [(_k = (_m.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('Nothing is running');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /No progress|quiet/ })];
            case 14:
                _f.apply(void 0, [_m.sent()]).toBeUndefined();
                expect(saved().filter(function (one) { return one.status === 'working'; }).map(function (one) { return one.id; })).toEqual([]);
                expect((_l = saved().find(function (one) { return one.id === 'a1'; })) === null || _l === void 0 ? void 0 : _l.answer).toBe('The fix is released.');
                return [4 /*yield*/, pane.unmount()];
            case 15:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work the chat started that was running before the mod loaded, as after a rename, is a card of its own, not a helper', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, talk, pane, _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                agents = { w5: 'running' };
                kinds = { w5: 'general-purpose' };
                talk = [{ role: 'assistant', text: '', toolUses: [{ tool_use_id: 'x1', tool: 'Agent', input: { description: 'Listed by the engine' } }] }];
                world(on, { agents: agents, kinds: kinds, talk: talk });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Listed/ })];
            case 3:
                _a.apply(void 0, [(_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.text]).toBe('Listed by the engine');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Working on/ })];
            case 4:
                _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('Working on 1 thing');
                return [4 /*yield*/, pane.unmount()];
            case 5:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work that ended before the mod kept it is read back from the chat\'s own records, its thinking never', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, folder, rows, pane, fold, _a, _b, _c;
    var _this = this;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                files = world(on).files;
                folder = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents");
                files.set("".concat(folder, "/agent-r1.meta.json"), JSON.stringify({ description: 'Old work', spawnDepth: 1, finished: true }));
                files.set("".concat(folder, "/agent-h1.meta.json"), JSON.stringify({ description: 'A helper of it', spawnDepth: 2, finished: true }));
                files.set("".concat(folder, "/agent-h1.jsonl"), JSON.stringify({ timestamp: '2026-11-11T10:00:00Z', type: 'user', message: {} }));
                rows = [
                    { timestamp: '2026-11-11T10:00:00Z', type: 'user', message: { content: 'go' } },
                    {
                        timestamp: '2026-11-11T10:05:00Z',
                        type: 'assistant',
                        message: {
                            model: 'claude-opus-5-5',
                            usage: { input_tokens: 10, cache_read_input_tokens: 1000, output_tokens: 5 },
                            content: [
                                { type: 'thinking', thinking: 'a secret thought' },
                                { type: 'tool_use', name: 'mcp__progress__todo', input: { item: 'Step one', state: 'done' } },
                                { type: 'tool_use', name: 'mcp__other__note', input: { text: 'not ours' } },
                                { type: 'tool_use', name: 'mcp__progress__note', input: { text: 'The old line' } },
                            ],
                        },
                    },
                    'not json',
                ];
                files.set("".concat(folder, "/agent-r1.jsonl"), rows.map(function (row) { return (typeof row === 'string' ? row : JSON.stringify(row)); }).join('\n'));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })];
                        }
                    }); }); })];
            case 3:
                fold = _f.sent();
                expect(fold === null || fold === void 0 ? void 0 : fold.props.label).toBe('▸ Finished 1');
                return [4 /*yield*/, pane.press({ key: String(fold === null || fold === void 0 ? void 0 : fold.key) })];
            case 4:
                _f.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /The old line/ })];
            case 5:
                _a.apply(void 0, [(_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('The old line');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Finished ·/ })];
            case 6:
                _b.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Finished · Opus 5.5 · context 1.0k · 1 of 1 done · 5m 00s');
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /secret|not ours|helper/ })];
            case 7:
                _c.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 8:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('helpers hang inside their work\'s card as a tree, one slim row each that opens its Details; ended ones fold into one row laid out the same, and Details lists every one', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, opened, helper, pane, lines, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, drawn, svgs, _p, narrow, _q, tab, _r, _s, _t, _u, _v;
    var _this = this;
    var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    return __generator(this, function (_7) {
        switch (_7.label) {
            case 0:
                _a = world(on), clock = _a.clock, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _7.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _7.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _7.sent();
                helper = function (description, parentAgentId) { return $.agent.spawn({ subagentType: 'general-purpose', background: true, description: description, prompt: 'go', parentAgentId: parentAgentId }); };
                return [4 /*yield*/, helper('Measure the nose', 'a1')];
            case 4:
                _7.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _7.sent();
                return [4 /*yield*/, helper('Read the manual', 'a2')];
            case 6:
                _7.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _7.sent();
                return [4 /*yield*/, helper('Read the appendix', 'a2')];
            case 8:
                _7.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _7.sent();
                return [4 /*yield*/, helper('Measure the ears', 'a1')];
            case 10:
                _7.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'terminal' }))];
            case 11:
                pane = _7.sent();
                lines = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).filter(function (text) { return /^[│├└┬─ ]{4,}$/.test(text); })
                            // Each helper is one row, joined to the row above it
                        ];
                    }
                }); }); };
                // Each helper is one row, joined to the row above it
                _b = expect;
                return [4 /*yield*/, lines()];
            case 12:
                // Each helper is one row, joined to the row above it
                _b.apply(void 0, [_7.sent()]).toEqual(['├─┬─', '│ ├───', '│ └───', '└───']);
                // Only what the chat started is a card
                _c = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 13:
                // Only what the chat started is a card
                _c.apply(void 0, [(_7.sent()).filter(function (one) { return one.props.bold && /nose|ears|manual|appendix/.test(one.text); }).map(function (one) { return one.text; })]).toEqual(['Fix the nose']);
                // Each says its time beside its name, after its model and context once those are known, and has no dots
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /^\ds$/ })];
            case 14:
                // Each says its time beside its name, after its model and context once those are known, and has no dots
                _d.apply(void 0, [(_7.sent()).map(function (one) { return one.text; })]).toEqual(['3s', '3s', '2s', '1s', '0s']);
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a2')];
            case 15:
                _e.apply(void 0, [(_w = (_7.sent())) === null || _w === void 0 ? void 0 : _w.props.label]).toBe('Measure the nose');
                // Each opens its own Details by its name, with no mark at its end
                _f = expect;
                return [4 /*yield*/, keyed(pane, 'go-list-a2')];
            case 16:
                // Each opens its own Details by its name, with no mark at its end
                _f.apply(void 0, [_7.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(pane, 'open-list-a4')];
            case 17:
                _7.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a4') || undefined];
                    }); }); })];
            case 18:
                _g.apply(void 0, [_7.sent()]).toBe(true);
                // A helper that ended leaves the tree after its pause; one that still has a helper at work stays to hold it
                return [4 /*yield*/, $.turn.complete({ answer: 'Read.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' })];
            case 19:
                // A helper that ended leaves the tree after its pause; one that still has a helper at work stays to hold it
                _7.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a5' })];
            case 20:
                _7.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 21:
                _7.sent();
                _h = expect;
                return [4 /*yield*/, lines()];
            case 22:
                _h.apply(void 0, [_7.sent()]).toEqual(['├─┬─', '│ └───', '└───']);
                _j = expect;
                return [4 /*yield*/, keyed(pane, 'open-rest-a1')];
            case 23:
                _j.apply(void 0, [(_x = (_7.sent())) === null || _x === void 0 ? void 0 : _x.props.label]).toBe('2 helpers ended');
                _k = expect;
                return [4 /*yield*/, keyed(pane, 'go-rest-a1')];
            case 24:
                _k.apply(void 0, [_7.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(pane, 'open-rest-a1')];
            case 25:
                _7.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 26:
                _l.apply(void 0, [_7.sent()]).toBe(true);
                _m = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a3')];
            case 27:
                _m.apply(void 0, [_7.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a5')];
            case 28:
                _o.apply(void 0, [_7.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()
                    // Where the surface draws, each row's lines end in a dot in the colour of how it stands, and rows meet: a helper with its own
                    // has a line down from its dot, its last one turns to it in a curve past the line of the level above, and the closing row has a ring
                ];
            case 29:
                _7.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 30:
                drawn = _7.sent();
                return [4 /*yield*/, drawn.findAll({ type: 'Svg' })];
            case 31:
                svgs = (_7.sent()).map(function (svg) { return ({ source: String(svg.props.source), alt: svg.props.alt }); }).filter(function (svg) { return svg.source.includes('stroke-opacity'); });
                expect(svgs.map(function (svg) { return svg.alt; })).toEqual(['Working', 'Working', 'Ended']);
                expect((_y = svgs[0]) === null || _y === void 0 ? void 0 : _y.source).toContain('d="M9 0V20M9 10H22M27 15V20"');
                expect((_z = svgs[1]) === null || _z === void 0 ? void 0 : _z.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"');
                expect((_0 = svgs[1]) === null || _0 === void 0 ? void 0 : _0.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>');
                // A row at work has its slow ring round the dot; the closing row of those that ended is still
                expect((_1 = svgs[1]) === null || _1 === void 0 ? void 0 : _1.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>');
                expect((_2 = svgs[2]) === null || _2 === void 0 ? void 0 : _2.source).not.toContain('<animate');
                expect((_3 = svgs[2]) === null || _3 === void 0 ? void 0 : _3.source).toContain('d="M9 0V5Q9 10 14 10H22"');
                expect((_4 = svgs[2]) === null || _4 === void 0 ? void 0 : _4.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>');
                // No row names a model, and none has the three dots: only the card itself does
                _p = expect;
                return [4 /*yield*/, drawn.findAll({ type: 'Svg' })];
            case 32:
                // No row names a model, and none has the three dots: only the card itself does
                _p.apply(void 0, [(_7.sent()).filter(function (svg) { return svg.props.alt === 'Working now'; })]).toHaveLength(1);
                return [4 /*yield*/, drawn.unmount()
                    // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
                ];
            case 33:
                _7.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 20 }), surface: 'desktop' }))];
            case 34:
                narrow = _7.sent();
                _q = expect;
                return [4 /*yield*/, keyed(narrow, 'open-list-a2')];
            case 35:
                _q.apply(void 0, [(_5 = (_7.sent())) === null || _5 === void 0 ? void 0 : _5.props.label]).toBe('Measure the nose');
                return [4 /*yield*/, narrow.unmount()
                    // The work's Details lists every helper, ended or not, as the same tree
                ];
            case 36:
                _7.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'terminal' }))];
            case 37:
                tab = _7.sent();
                _r = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: / helpers? working$/ })];
            case 38:
                _r.apply(void 0, [(_6 = (_7.sent())) === null || _6 === void 0 ? void 0 : _6.text]).toBe('2 of 4 helpers working');
                _s = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 39:
                _s.apply(void 0, [(_7.sent()).map(function (one) { return String(one.props.label); }).filter(function (text) { return /manual|appendix|Measure/.test(text); })]).toEqual(['Measure the nose', 'Read the manual', 'Read the appendix', 'Measure the ears']);
                // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
                _t = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Raster' })];
            case 40:
                // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
                _t.apply(void 0, [(_7.sent()).filter(function (one) { return String(one.key).endsWith('-ring'); }).length]).toBe(2);
                _u = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Text', text: '✓' })];
            case 41:
                _u.apply(void 0, [(_7.sent()).length]).toBe(2);
                _v = expect;
                return [4 /*yield*/, keyed(tab, 'open-details-a3')];
            case 42:
                _v.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, tab.unmount()];
            case 43:
                _7.sent();
                return [2 /*return*/];
        }
    });
}); });
test('what a piece of work and its helpers have running is in its Details too, every job under the one that started it, and in a helper\'s own Details', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var call, _i, _a, n, texts, tab, rows, picked, shown, _b, list, _c, _d, helperTab, its, _e;
    var _this = this;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site', wait: false, origin: composer })];
            case 2:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'run the site' }))];
            case 3:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Fetch the weights', prompt: 'go', parentAgentId: 'a1' })];
            case 4:
                _h.sent();
                call = function (agentId, id, command, description) {
                    return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: command, description: description, run_in_background: true });
                };
                return [4 /*yield*/, call('a1', 'b1', 'npm run dev', 'Serve the site')];
            case 5:
                _h.sent();
                _i = 0, _a = [1, 2, 3, 4, 5];
                _h.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                n = _a[_i];
                return [4 /*yield*/, call('a2', "d".concat(n), "curl -o w".concat(n, ".bin https://example.com/w").concat(n, ".bin"), "Download weights ".concat(n))
                    // (a run's name is a button, as a press opens its output)
                ];
            case 7:
                _h.sent();
                _h.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                texts = function (view) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = [[]];
                            return [4 /*yield*/, view.findAll({ type: 'Text' })];
                        case 1:
                            _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                            return [4 /*yield*/, view.findAll({ type: 'Button' })];
                        case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]))];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))
                    // In drawing order, with the tree's lines: the server on the work's own line, the helper, its downloads one level under it
                ];
            case 10:
                tab = _h.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 11:
                rows = (_h.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, texts(tab)];
            case 12:
                picked = (_h.sent()).filter(function (text) { return /^Serve the site|^Download weights/.test(text); });
                // the server on the work's own line, the helper's downloads a level under it
                expect(rows.filter(function (text) { return /^ *[├└]───$/.test(text); }).slice(0, 1)).toEqual(['├───']);
                expect(picked.sort()).toEqual(__spreadArray(__spreadArray([], [1, 2, 3, 4, 5].map(function (n) { return "Download weights ".concat(n); }), true), ['Serve the site'], false));
                return [4 /*yield*/, texts(tab)];
            case 13:
                shown = _h.sent();
                expect(shown.some(function (text) { return /more (running|jobs)/.test(text); })).toBe(false);
                _b = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Helpers and commands$/ })];
            case 14:
                _b.apply(void 0, [(_f = (_h.sent())) === null || _f === void 0 ? void 0 : _f.props.bold]).toBe(true);
                expect(shown).toContain('6 commands running · 1 helper working');
                return [4 /*yield*/, tab.unmount()
                    // The card on the list still folds the helper's jobs past JOBS_SHOWN into one row
                ];
            case 15:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 16:
                list = _h.sent();
                _c = expect;
                return [4 /*yield*/, texts(list)];
            case 17:
                _c.apply(void 0, [(_h.sent()).filter(function (text) { return /Download weights/.test(text); })]).toHaveLength(3);
                _d = expect;
                return [4 /*yield*/, texts(list)];
            case 18:
                _d.apply(void 0, [(_h.sent()).some(function (text) { return /^2 more commands/.test(text); })]).toBe(true);
                return [4 /*yield*/, list.unmount()
                    // The helper's own Details, with no helpers of its own, shows what it has running
                ];
            case 19:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 20:
                helperTab = _h.sent();
                return [4 /*yield*/, texts(helperTab)];
            case 21:
                its = _h.sent();
                _e = expect;
                return [4 /*yield*/, helperTab.find({ type: 'Text', text: /^Running$/ })];
            case 22:
                _e.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.bold]).toBe(true);
                expect(its).toContain('5 commands running');
                expect(its.filter(function (text) { return /Download weights/.test(text); })).toHaveLength(5);
                expect(its.some(function (text) { return /Serve the site/.test(text); })).toBe(false);
                return [4 /*yield*/, helperTab.unmount()];
            case 23:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
test('long work keeps only its newest ended helpers, and none of work that was forgotten', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, n, tab, _a, names;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _c.sent();
                n = 2;
                _c.label = 4;
            case 4:
                if (!(n <= 106)) return [3 /*break*/, 9];
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: "Measure ".concat(n), prompt: 'go', parentAgentId: 'a1' })];
            case 5:
                _c.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 6:
                _c.sent();
                if (!(n <= 105)) return [3 /*break*/, 8];
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: "t".concat(n), reason: 'answer', agentId: "a".concat(n) })];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                n += 1;
                return [3 /*break*/, 4];
            case 9: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'terminal' }))
                // 104 ended, the oldest four forgotten; the one at work is never forgotten
            ];
            case 10:
                tab = _c.sent();
                // 104 ended, the oldest four forgotten; the one at work is never forgotten
                _a = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: / helpers? working$/ })];
            case 11:
                // 104 ended, the oldest four forgotten; the one at work is never forgotten
                _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.text]).toBe('1 of 101 helpers working');
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 12:
                names = (_c.sent()).map(function (one) { return String(one.props.label); });
                expect(names.includes('Measure 5')).toBe(false);
                expect(names.includes('Measure 6')).toBe(true);
                return [4 /*yield*/, tab.unmount()];
            case 13:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a long run shows how far it is from what it prints: how much of how much, its percent and speed, and whether output still comes', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var output, wroteAt, isAlive, _a, clock, killed, appended, now, advance, texts, _b, shown, _c, _d, _e, plain, _f, _g, _h, _j, _k, list, stop, _l, _m, _o;
    var _this = this;
    var _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                output = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r  5 1024M    5 51.2M    0     0  10.2M      0  0:01:40  0:00:05  0:01:35 10.5M\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M';
                wroteAt = 0;
                isAlive = true;
                _a = world(on, { jobs: { output: function () { return output; }, wroteAt: function () { return wroteAt; }, alive: function () { return isAlive; } } }), clock = _a.clock, killed = _a.killed, appended = _a.appended;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                now = 1700000000000;
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (now += ms);
                            return [4 /*yield*/, clock.advance(ms)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _q.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })];
            case 2:
                _q.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fetch the scans', prompt: 'fetch the scans' }))];
            case 3:
                _q.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' })];
            case 4:
                _q.sent();
                wroteAt = now;
                return [4 /*yield*/, advance(20000)
                    // (written a second before the end of the step, whenever in it the panel looks)
                ];
            case 5:
                _q.sent();
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 6:
                _q.sent();
                texts = function () {
                    var args_1 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args_1[_i] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (columns) {
                        var list, all, _a, _b;
                        if (columns === void 0) { columns = 140; }
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: columns }), surface: 'terminal' }))
                                    // (a run's name is a button, as a press opens its output)
                                ];
                                case 1:
                                    list = _c.sent();
                                    _a = [[]];
                                    return [4 /*yield*/, list.findAll({ type: 'Text' })];
                                case 2:
                                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                    return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                case 3:
                                    all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                    return [4 /*yield*/, list.unmount()];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/, all];
                            }
                        });
                    });
                };
                // How much of how much leads the side, its percent in blue, its speed and the time left curl gives, and never when it printed
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('460 MB of 1 GB · ') || undefined)];
                        }
                    }); }); })];
            case 7:
                // How much of how much leads the side, its percent in blue, its speed and the time left curl gives, and never when it printed
                _b.apply(void 0, [_q.sent()]).toBe(true);
                return [4 /*yield*/, texts()];
            case 8:
                shown = _q.sent();
                expect(shown).toContain('45%');
                expect(shown).toContain(' · 10.5 MB/s · 55s left');
                // While it gives word nothing is said of when
                expect(shown.some(function (text) { return /active|ago/.test(text); })).toBe(false);
                // In a narrower panel its speed gives way first
                _c = expect;
                return [4 /*yield*/, texts(100)];
            case 9:
                // In a narrower panel its speed gives way first
                _c.apply(void 0, [(_q.sent()).some(function (text) { return /^460 MB(\/| of )1 GB · $/.test(text); })]).toBe(true);
                // The work's own line, as its scripts are told to print it
                output = 'loading\nprogress: 3/6 steps fitting\nframe 12 done\n';
                wroteAt = now;
                return [4 /*yield*/, advance(20000)];
            case 10:
                _q.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text.startsWith('3 of 6 steps · '); }) || undefined)];
                        }
                    }); }); })];
            case 11:
                _d.apply(void 0, [_q.sent()]).toBe(true);
                // Quiet for long, in words
                wroteAt = now - 15 * 60000;
                return [4 /*yield*/, advance(20000)];
            case 12:
                _q.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return / · nothing printed for 1[5-9]m/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 13:
                _e.apply(void 0, [_q.sent()]).toBe(true);
                // A raw line in plain words, with its log time and state code left out, then its sign of life; 16 Nov the row read
                // "35 MB · [run 11:27:50] waiting for the machine to start (Running)"
                output = 'starting\n[run 11:27:50] waiting for the machine to start (Running)\n';
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 14:
                _q.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /(^| · )waiting for the machine to start$/.test(text); })];
                        }
                    }); }); })];
            case 15:
                plain = _q.sent();
                expect(plain).toBeDefined();
                _f = expect;
                return [4 /*yield*/, texts()];
            case 16:
                _f.apply(void 0, [(_q.sent()).some(function (text) { return /\[run|Running\)|\d MB ·/.test(text); })]).toBe(false);
                // A wait's count of tries is how far it is, its words that say its name again are left out, and when it last tried changes
                output = 'progress: 6 tries waiting for the CT scans\nprogress: 7 tries waiting for the CT scans\n';
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 17:
                _q.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 tries$/.test(text); })];
                        }
                    }); }); })];
            case 18:
                _g.apply(void 0, [_q.sent()]).toBeDefined();
                // Quiet for a minute or two it says nothing of it: tests, builds and installs go that quiet and are fine
                wroteAt = now - 100000;
                return [4 /*yield*/, advance(20000)];
            case 19:
                _q.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 tries$/.test(text); })];
                        }
                    }); }); })];
            case 20:
                _h.apply(void 0, [_q.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, texts()];
            case 21:
                _j.apply(void 0, [(_q.sent()).some(function (text) { return /nothing printed/.test(text); })]).toBe(false);
                // Silent for three minutes it says so, plainly, and Stop on its row ends its process and tells the work it was stuck
                wroteAt = now - 185000;
                return [4 /*yield*/, advance(20000)];
            case 22:
                _q.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 tries · nothing printed for 3m [1-3]0s$/.test(text); })];
                        }
                    }); }); })];
            case 23:
                _k.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 24:
                list = _q.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 25:
                stop = (_q.sent()).find(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); });
                expect(stop).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_p = stop === null || stop === void 0 ? void 0 : stop.key) !== null && _p !== void 0 ? _p : '' })];
            case 26:
                _q.sent();
                return [4 /*yield*/, list.unmount()];
            case 27:
                _q.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, killed.includes('48213') || undefined];
                    }); }); })];
            case 28:
                _l.apply(void 0, [_q.sent()]).toBe(true);
                isAlive = false;
                // (quiet three minutes, it is told it looked stuck)
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return /^a1: .*stopped your command "Fetch the CT scans" from the panel because it looked stuck: it had printed nothing for 3m/.test(line); })];
                    }); }); })];
            case 29:
                // (quiet three minutes, it is told it looked stuck)
                _m.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, advance(5000)
                    // (its row goes; the card's own line says it was stopped until the work writes again)
                ];
            case 30:
                _q.sent();
                // (its row goes; the card's own line says it was stopped until the work writes again)
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).every(function (text) { return !/^Fetch the CT scans/.test(text) || text === 'Fetch the CT scans was stopped'; }) || undefined)];
                        }
                    }); }); })];
            case 31:
                // (its row goes; the card's own line says it was stopped until the work writes again)
                _o.apply(void 0, [_q.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a percent moves up on its row within seconds of being printed, and a quiet of under three minutes says nothing (16 Nov: "nothing printed for 5 seconds, 10 seconds", while the percent sat still)', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var meter, output, now, wroteAt, clock, advance, texts, _a, _b, quiet;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                meter = function (pct) { return "  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r ".concat(pct, " 1024M   ").concat(pct, "  ").concat(pct * 10, "M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M"); };
                output = meter(45);
                now = 1700000000000;
                wroteAt = now;
                clock = world(on, { jobs: { output: function () { return output; }, wroteAt: function () { return wroteAt; } } }).clock;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () {
                    var left;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                left = ms;
                                _a.label = 1;
                            case 1:
                                if (!(left > 0)) return [3 /*break*/, 4];
                                now += Math.min(3000, left);
                                return [4 /*yield*/, clock.advance(Math.min(3000, left))];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                left -= 3000;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                texts = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, all;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
                            case 1:
                                list = _a.sent();
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                all = (_a.sent()).map(function (one) { return one.text; });
                                return [4 /*yield*/, list.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, all];
                        }
                    });
                }); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fetch the scans', prompt: 'fetch the scans' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, advance(21000)];
            case 5:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('45%') || undefined)];
                        }
                    }); }); })];
            case 6:
                _a.apply(void 0, [_c.sent()]).toBe(true);
                // curl rewrites its meter: the row has the new percent before the list is next followed
                output = meter(52);
                wroteAt = now;
                return [4 /*yield*/, advance(15000)];
            case 7:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, texts()];
            case 8:
                _b.apply(void 0, [_c.sent()]).toContain('52%');
                // quiet for half a minute after, its percent stands with nothing said of the quiet
                return [4 /*yield*/, advance(30000)];
            case 9:
                // quiet for half a minute after, its percent stands with nothing said of the quiet
                _c.sent();
                return [4 /*yield*/, texts()];
            case 10:
                quiet = _c.sent();
                expect(quiet).toContain('52%');
                expect(quiet.some(function (text) { return /nothing printed/.test(text); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a run whose output cannot be found says so after three minutes, so a blank row is never taken for one that moves', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, shown, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                clock = world(on).clock;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fetch the scans', prompt: 'fetch the scans' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'cd /w && nohup curl -L -o scans.zip https://example.com/scans.zip > fetch.log 2>&1 & echo $!', description: 'Fetch the CT scans' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, clock.advance(190000)];
            case 5:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 6:
                list = _c.sent();
                _a = [[]];
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                shown = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                // Its name, its kind already said in the work's own words
                expect(shown.some(function (text) { return /^Fetch the CT scans/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /^nothing printed for 3m [01]0s$/.test(text); })).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a run of a work\'s own wakes it the moment it ends: any command that only waits, the work\'s or its helper\'s, is refused in one sentence, the work is told it ended, and its card no longer says how far it was (16 Nov an upload read 100% beside "about 40% done"; a helper polled for a file its own script wrote)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var isAlive, talk, _a, clock, appended, resumed, stopped, stepped, _i, _b, command, r, _c, _d, _e, _f, _g, line, _h, _j, _k, _l, _m, _o, _p, PRESS, press, _q, _r, _s, O, _t, _u, command, deny, _v, _w;
    var _this = this;
    var _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                isAlive = true;
                talk = [];
                _a = world(on, { talk: talk, jobs: { output: function () { return 'progress: 8/8 GB uploading\n'; }, wroteAt: function () { return 1700000000000; }, alive: function () { return isAlive; } } }), clock = _a.clock, appended = _a.appended, resumed = _a.resumed, stopped = _a.stopped, stepped = _a.stepped;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'upload the zips', wait: false, origin: composer })];
            case 2:
                _y.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Upload the zips', prompt: 'upload the zips' }))];
            case 3:
                _y.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'u1', agentId: 'a1', command: 'cd /w && nohup curl -T zips.zip https://example.com/up > upload.log 2>&1 & echo $!', description: 'Upload both zips to the folder (about 15 min)' })];
            case 4:
                _y.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'The upload is about 40% done; it should finish in about 15 minutes.' })];
            case 5:
                _y.sent();
                return [4 /*yield*/, clock.advance(20000)
                    // A wait on it, by its process or its log, does not run
                ];
            case 6:
                _y.sent();
                _i = 0, _b = ['for i in $(seq 1 55); do kill -0 48213 2>/dev/null || break; echo "progress: $i/55 tries waiting for the upload"; sleep 10; done; grep -E "ERROR|Copied" /w/upload.log | tail -5', "until ! pgrep -f 'curl -T zips.zip' >/dev/null; do echo \"progress: 1 tries\"; sleep 10; done"];
                _y.label = 7;
            case 7:
                if (!(_i < _b.length)) return [3 /*break*/, 10];
                command = _b[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w1', agentId: 'a1', command: command, description: 'Wait for the upload to finish (about 9 min)', run_in_background: true })];
            case 8:
                r = (_y.sent());
                expect(r.deny).toMatch(/^Not run: this command only waits, and nothing you start may only wait\. Your own commands, in the background or detached, wake you the moment they end/);
                _y.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                // A Monitor that only waits for it to end is refused the same
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'while kill -0 48213; do sleep 10; done', description: 'Wait for the upload' })];
            case 11:
                // A Monitor that only waits for it to end is refused the same
                _c.apply(void 0, [(_y.sent()).deny]).toMatch(/^Not run: this command only waits/);
                // A sifter left going beside it, which ends with nothing: let through while the upload goes
                _d = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'g1', agentId: 'a1', command: 'ugrep --line-buffered wrote', description: 'Run a look for written files', run_in_background: true })];
            case 12:
                // A sifter left going beside it, which ends with nothing: let through while the upload goes
                _d.apply(void 0, [(_y.sent()).deny]).toBeUndefined();
                // A tail that waits for one line is a wait for that line
                _e = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w4', agentId: 'a1', command: 'tail -f /w/upload.log | grep -m1 Copied', description: 'Wait for the first file copied', run_in_background: true })];
            case 13:
                // A tail that waits for one line is a wait for that line
                _e.apply(void 0, [(_y.sent()).deny]).toMatch(/^Not run: this command only waits/);
                // A tail that follows its log never ends and tells the work nothing
                _f = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w3', agentId: 'a1', command: 'tail -f /w/upload.log | grep --line-buffered ERROR', description: 'Watch the upload for errors', run_in_background: true })];
            case 14:
                // A tail that follows its log never ends and tells the work nothing
                _f.apply(void 0, [(_y.sent()).deny]).toMatch(/^Not run: this only follows a log and would never end/);
                // A wait for a line in its log, or a look once, still runs
                _g = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'a1', command: 'tail -5 /w/upload.log', description: 'Run a look at the upload' })];
            case 15:
                // A wait for a line in its log, or a look once, still runs
                _g.apply(void 0, [(_y.sent()).deny]).toBeUndefined();
                line = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, texts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
                            case 1:
                                list = _a.sent();
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                texts = (_a.sent()).map(function (one) { return one.text; });
                                return [4 /*yield*/, list.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, texts];
                        }
                    });
                }); };
                _h = expect;
                return [4 /*yield*/, line()];
            case 16:
                _h.apply(void 0, [(_y.sent()).some(function (text) { return /about 40% done/.test(text); })]).toBe(true);
                // It ends: the work is told at once, and the card says so in place of the line written while it ran
                isAlive = false;
                return [4 /*yield*/, clock.advance(20000)];
            case 17:
                _y.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one === 'a1: Your command "Upload both zips to the folder" has ended. Look at how it ended in its log, /w/upload.log, and carry on with the next step now.'; })];
                    }); }); })];
            case 18:
                _j.apply(void 0, [_y.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, line()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text === 'Upload both zips to the folder has ended'; }) || undefined)];
                        }
                    }); }); })];
            case 19:
                _k.apply(void 0, [_y.sent()]).toBe(true);
                _l = expect;
                return [4 /*yield*/, line()];
            case 20:
                _l.apply(void 0, [(_y.sent()).some(function (text) { return /about 40% done/.test(text); })]).toBe(false);
                // The sifter outlived what it watched: stopped a minute on, and the work told why
                return [4 /*yield*/, clock.advance(60000)];
            case 21:
                // The sifter outlived what it watched: stopped a minute on, and the work told why
                _y.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, stopped.includes('bg-g1') || undefined];
                    }); }); })];
            case 22:
                _m.apply(void 0, [_y.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return /^a1: Claudopus stopped your command ".*": it only watched commands that have all ended\./.test(one); })];
                    }); }); })];
            case 23:
                _o.apply(void 0, [_y.sent()]).toBeDefined();
                // Told once, and a new line of the work's own stands again
                return [4 /*yield*/, clock.advance(20000)];
            case 24:
                // Told once, and a new line of the work's own stands again
                _y.sent();
                expect(appended.filter(function (one) { return /has ended\. Look at how it ended/.test(one); })).toHaveLength(1);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'The upload is done; I am checking the files.' })];
            case 25:
                _y.sent();
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, line()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /I am checking the files/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 26:
                _p.apply(void 0, [_y.sent()]).toBe(true);
                // Work that ended its step with a run still going is started again the moment it ends, with a message
                isAlive = true;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'u2', agentId: 'a1', command: 'cd /w && nohup curl -T rest.zip https://example.com/up > rest.log 2>&1 & echo $!', description: 'Upload the rest (about 10 min)' })
                    // The engine, which cannot see that run, presses it for its report as it ends its step: the press is answered with no model, and
                    // its step ends (16 Nov: 30 presses in 25 minutes ended a task early). A report in words before the press still goes on to it
                ];
            case 27:
                _y.sent();
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                press = function (said) { return __awaiter(_this, void 0, void 0, function () {
                    var before, texts, _a, _b, _c, chunk, e_9_1;
                    var _d, e_9, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: said }] }, PRESS);
                                before = stepped.length;
                                texts = [];
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 12]);
                                _a = true, _b = __asyncValues($.turn.step({ turnId: 't1', index: 1, model: 'm', messageCount: 2, agentId: 'a1' }));
                                _g.label = 2;
                            case 2: return [4 /*yield*/, _b.next()];
                            case 3:
                                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                _f = _c.value;
                                _a = false;
                                chunk = _f;
                                if (chunk.kind === 'text')
                                    texts.push(chunk.text);
                                _g.label = 4;
                            case 4:
                                _a = true;
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 12];
                            case 6:
                                e_9_1 = _g.sent();
                                e_9 = { error: e_9_1 };
                                return [3 /*break*/, 12];
                            case 7:
                                _g.trys.push([7, , 10, 11]);
                                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                return [4 /*yield*/, _e.call(_b)];
                            case 8:
                                _g.sent();
                                _g.label = 9;
                            case 9: return [3 /*break*/, 11];
                            case 10:
                                if (e_9) throw e_9.error;
                                return [7 /*endfinally*/];
                            case 11: return [7 /*endfinally*/];
                            case 12: return [2 /*return*/, [stepped.length - before, texts]];
                        }
                    });
                }); };
                _q = expect;
                return [4 /*yield*/, press('The rest uploads; I am woken when it ends.')];
            case 28:
                _q.apply(void 0, [_y.sent()]).toEqual([0, ['My own work is still going; I am started again when it is done, and give my report then.']]);
                _r = expect;
                return [4 /*yield*/, press("Both uploads are done. ".concat('Every file arrived whole. '.repeat(30)))];
            case 29:
                _r.apply(void 0, [_y.sent()]).toEqual([1, ['Looking at the nose.']]);
                return [4 /*yield*/, $.turn.complete({ answer: 'The rest uploads; I am woken when it ends.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 30:
                _y.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 31:
                _y.sent();
                expect(resumed.some(function (one) { return one.startsWith('a1: '); })).toBe(false);
                isAlive = false;
                return [4 /*yield*/, clock.advance(20000)];
            case 32:
                _y.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one === 'a1: Your command "Upload the rest" has ended. Look at how it ended in its log, /w/rest.log, and carry on with the next step now.'; })];
                    }); }); })];
            case 33:
                _s.apply(void 0, [_y.sent()]).toBeDefined();
                // So is a helper's, whatever it waits for: the 16 Nov helper's waits on its own script's output and process, a page, a time
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Loaders for every open head set', prompt: 'load', parentAgentId: 'a1' }))];
            case 34:
                // So is a helper's, whatever it waits for: the 16 Nov helper's waits on its own script's output and process, a page, a time
                _y.sent();
                O = '/private/tmp/claude-501/x/tasks';
                _t = 0, _u = [
                    "n=0; until grep -q \"Counter\" ".concat(O, "/b1it4kmrm.output; do n=$((n+1)); echo \"progress: $n tries waiting for fit timing\"; sleep 8; [ $n -gt 60 ] && break; done; cat ").concat(O, "/b1it4kmrm.output | tail -12"),
                    "n=0; while pgrep -f \"sets.py\" >/dev/null; do n=$((n+1)); echo \"progress: $n tries waiting for sheets\"; sleep 8; [ $n -gt 60 ] && break; done; ls -la ~/sets | head; cat ".concat(O, "/bg253ddbk.output"),
                    'until curl -s localhost:3000 >/dev/null; do echo "progress: 1 tries"; sleep 2; done',
                    'sleep 300; cat out.log',
                ];
                _y.label = 35;
            case 35:
                if (!(_t < _u.length)) return [3 /*break*/, 38];
                command = _u[_t];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'h1', agentId: 'a2', command: command, description: 'Wait for the sheets', run_in_background: true })];
            case 36:
                deny = (_x = (_y.sent()).deny) !== null && _x !== void 0 ? _x : '';
                expect([command, deny.slice(0, 32)]).toEqual([command, 'Not run: this command only waits']);
                // a helper, which is not started again, is told to hand back what it waits for, never to call wake_me (a reader and a check have no such tool)
                if (command.startsWith('sleep'))
                    expect([deny.includes('hand back what you found and what you wait for'), deny.includes('wake_me')]).toEqual([true, false]);
                _y.label = 37;
            case 37:
                _t++;
                return [3 /*break*/, 35];
            case 38:
                // and the wait the old rules gave for helpers, said for what it waits on
                _v = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'h2', agentId: 'a1', command: "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", description: 'Wait for the three builders' })];
            case 39:
                // and the wait the old rules gave for helpers, said for what it waits on
                _v.apply(void 0, [(_y.sent()).deny]).toMatch(/^Not run: this command only waits for your helpers, .*even after you end your step/);
                // A helper's real work runs
                _w = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'h3', agentId: 'a2', command: 'cd /w && python sets.py', description: 'Run the sheets' })];
            case 40:
                // A helper's real work runs
                _w.apply(void 0, [(_y.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('every run under a card says how it stands: a command held open shows its progress, one that printed nothing says so, a watch its last event; 15 Nov rows said only "updated 9m ago"', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, heldAt, TASKS, meter, outputs, wrote, etime, _a, clock, held, opened, files, advance, call, _b, n, early, n, texts, shown, list, before, argv, after;
    var _c, _d;
    var _this = this;
    var _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                now = 1700000000000;
                heldAt = 0;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                meter = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M';
                outputs = (_c = {}, _c["".concat(TASKS, "/bg-r1.output")] = function () { return ''; }, _c["".concat(TASKS, "/mon-m1.output")] = function () { return 'series arrived\nwrote vsd-02.png\n'; }, _c["".concat(TASKS, "/bheld.output")] = function () { return meter; }, _c);
                wrote = (_d = {}, _d["".concat(TASKS, "/bg-r1.output")] = function () { return 1700000000000; }, _d["".concat(TASKS, "/mon-m1.output")] = function () { return now - 30000; }, _d["".concat(TASKS, "/bheld.output")] = function () { return now - 2000; }, _d);
                etime = function () {
                    var s = Math.max(1, Math.floor((now - heldAt) / 1000));
                    return "".concat(String(Math.floor(s / 60)).padStart(2, '0'), ":").concat(String(s % 60).padStart(2, '0'));
                };
                _a = world(on, {
                    jobs: {
                        output: function (file) { var _a, _b; return (_b = (_a = outputs[file]) === null || _a === void 0 ? void 0 : _a.call(outputs)) !== null && _b !== void 0 ? _b : ''; },
                        wroteAt: function (file) { var _a, _b; return (_b = (_a = wrote[file]) === null || _a === void 0 ? void 0 : _a.call(wrote)) !== null && _b !== void 0 ? _b : 0; },
                        ps: function () { return (heldAt ? "  4242   900 S    ".concat(etime(), " /bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'curl -L -o scans.zip https://example.com/scans.zip # hold dl' < /dev/null && pwd -P >| /tmp/claude-1-cwd") : ''); },
                        fd: function () { return "4242 ".concat(TASKS, "/bheld.output\n"); },
                    },
                }), clock = _a.clock, held = _a.held, opened = _a.shown, files = _a.files;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (now += ms);
                            return [4 /*yield*/, clock.advance(ms)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw and fetch', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw and fetch', prompt: 'go' }))
                    // A script that sends all it prints to files of its own, a watch, and a download held open, the work's own words for each
                ];
            case 3:
                _j.sent();
                // A script that sends all it prints to files of its own, a watch, and a download held open, the work's own words for each
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r1', agentId: 'a1', command: 'bash /s/round3b_figs.sh', description: 'Redraw all pictures', run_in_background: true })];
            case 4:
                // A script that sends all it prints to files of its own, a watch, and a download held open, the work's own words for each
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'tail -n0 -F sheet.log', description: 'Azure jobs finishing' })];
            case 5:
                _j.sent();
                heldAt = now;
                call = $.tool.call({ tool: 'Bash', tool_use_id: 'h1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip # hold dl', description: 'Download the CT scans (about 3 min)' });
                // The mod takes as the command held open only a shell started within 20 s of when the call began, as its hook saw it: the clock
                // moves only once the call is running, else on a slow machine (GitHub's) the hook ran a few steps late and no shell matched
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, held.has('dl') || undefined];
                    }); }); })];
            case 6:
                // The mod takes as the command held open only a shell started within 20 s of when the call began, as its hook saw it: the clock
                // moves only once the call is running, else on a slow machine (GitHub's) the hook ran a few steps late and no shell matched
                _b.apply(void 0, [_j.sent()]).toBe(true);
                n = 0;
                _j.label = 7;
            case 7:
                if (!(n < 3)) return [3 /*break*/, 10];
                return [4 /*yield*/, advance(5000)];
            case 8:
                _j.sent();
                _j.label = 9;
            case 9:
                n++;
                return [3 /*break*/, 7];
            case 10: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, all, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))];
                            case 1:
                                list = _c.sent();
                                _a = [[]];
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 3:
                                all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                return [4 /*yield*/, list.unmount()];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, all.includes('Download the CT scans') && all.some(function (text) { return /^460 MB of 1 GB|^working$/.test(text); }) ? all : undefined];
                        }
                    });
                }); })];
            case 11:
                early = _j.sent();
                expect(early).toBeDefined();
                n = 0;
                _j.label = 12;
            case 12:
                if (!(n < 57)) return [3 /*break*/, 15];
                return [4 /*yield*/, advance(5000)];
            case 13:
                _j.sent();
                _j.label = 14;
            case 14:
                n++;
                return [3 /*break*/, 12];
            case 15:
                texts = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, all, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))
                                // (a run's name is a button, as a press opens its output)
                            ];
                            case 1:
                                list = _c.sent();
                                _a = [[]];
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 3:
                                all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                return [4 /*yield*/, list.unmount()];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, all];
                        }
                    });
                }); };
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, texts()];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.includes('460 MB of 1 GB · ') ? all : undefined];
                            }
                        });
                    }); })];
            case 16:
                shown = (_e = (_j.sent())) !== null && _e !== void 0 ? _e : [];
                // The download held open: how much of how much, its percent, speed and time left, as curl printed them, and nothing of when
                // Named in the work's own form: its kind already said, how long it should take beside its time, in amber well past it
                expect(shown).toContain('Download the CT scans');
                // past it, the run's own time left makes a fresh expectation, never the old figure as if it held
                expect(shown).toContain('5m 00s of ~5m 53s');
                expect(shown.some(function (text) { return /of ~3m/.test(text); })).toBe(false);
                expect(shown).toContain(' · 10.5 MB/s · 55s left');
                // The script that printed nothing says so and for how long, never that it was updated
                expect(shown.some(function (text) { return /^Command · Redraw all pictures/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /^nothing printed for 5m 00s$/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /updated/.test(text); })).toBe(false);
                // The watch, its last event and when it came
                expect(shown.some(function (text) { return /^Watch · Azure jobs finishing/.test(text); })).toBe(true);
                expect(shown).toContain('watching');
                // its event's file name is never shown
                expect(shown.some(function (text) { return /vsd-02/.test(text); })).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))];
            case 17:
                list = _j.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18:
                before = (_g = (_f = (_j.sent()).find(function (b) { return b.props.label === 'Command · Redraw all pictures'; })) === null || _f === void 0 ? void 0 : _f.key) !== null && _g !== void 0 ? _g : '';
                return [4 /*yield*/, list.press({ key: before })];
            case 19:
                _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.find(function (one) { return String(one[1]).endsWith('/output.command'); })];
                    }); }); })];
            case 20:
                argv = _j.sent();
                expect(files.get(String(argv === null || argv === void 0 ? void 0 : argv[1]))).toContain("exec tail -n 1000 -F '".concat(TASKS, "/bg-r1.output'"));
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return b.props.label === 'Command · Redraw all pictures' && b.key !== before; })) === null || _a === void 0 ? void 0 : _a.key];
                        }
                    }); }); })];
            case 21:
                after = _j.sent();
                expect(after).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 22:
                _j.sent();
                (_h = held.get('dl')) === null || _h === void 0 ? void 0 : _h('');
                return [4 /*yield*/, call];
            case 23:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('only runs really running are listed: a watch the engine killed at its time limit, a command that failed and one that finished leave at once, counted on the closing row and told apart in Details; 15 Nov three "[killed]" watches stayed with their clocks running', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, born, TASKS, MIN, outputs, clock, advance, watch, bg, texts, n, _a, n, shown, pane, details, n, _b;
    var _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                now = 1700000000000;
                born = now;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                MIN = 60000;
                outputs = (_c = {},
                    _c["".concat(TASKS, "/mon-m1.output")] = function () { return (now - born >= 30 * MIN ? '\n[killed]\n' : ''); },
                    _c["".concat(TASKS, "/mon-m2.output")] = function () { return (now - born >= 30 * MIN ? '\n[killed]\n' : ''); },
                    _c["".concat(TASKS, "/bg-w1.output")] = function () { return ''; },
                    _c["".concat(TASKS, "/bg-f1.output")] = function () { return (now - born >= 3 * MIN ? 'Traceback: boom\n\n[exited with code 1]\n' : ''); },
                    _c["".concat(TASKS, "/bg-k1.output")] = function () { return (now - born >= 2 * MIN ? 'all good\n\n[exited with code 0]\n' : ''); },
                    // one past its time that prints how long it has left, and one past its time that does not
                    _c["".concat(TASKS, "/bg-p1.output")] = function () { return 'progress: 3/6 steps fitting eta 4m\n'; },
                    _c["".concat(TASKS, "/bg-p2.output")] = function () { return 'drawing frames\n'; },
                    _c);
                clock = world(on, { jobs: { output: function (file) { var _a, _b; return (_b = (_a = outputs[file]) === null || _a === void 0 ? void 0 : _a.call(outputs)) !== null && _b !== void 0 ? _b : ''; }, wroteAt: function () { return now - 2000; } } }).clock;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (now += ms);
                            return [4 /*yield*/, clock.advance(ms)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'save the videos', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save the videos', prompt: 'go' }))];
            case 3:
                _e.sent();
                watch = function (id) { return $.tool.call({ tool: 'Monitor', tool_use_id: id, agentId: 'a1', command: 'tail -f /s/screen.log | grep --line-buffered "pass 1 done"', description: 'Wait for first screening pass (about 35 min)', timeout_ms: 3000000, persistent: false }); };
                return [4 /*yield*/, watch('m1')];
            case 4:
                _e.sent();
                return [4 /*yield*/, watch('m2')];
            case 5:
                _e.sent();
                bg = function (id, command, description) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: command, description: description, run_in_background: true }); };
                return [4 /*yield*/, bg('w1', 'python3 screen.py --details', 'Wait for the details screening to finish (about 55 min)')];
            case 6:
                _e.sent();
                return [4 /*yield*/, bg('f1', 'python3 fetch.py', 'Run the fetch of the list')];
            case 7:
                _e.sent();
                return [4 /*yield*/, bg('k1', 'python3 tidy.py', 'Run the tidy up')];
            case 8:
                _e.sent();
                return [4 /*yield*/, bg('p1', 'python3 fit.py', 'Run the fit (about 20 min)')];
            case 9:
                _e.sent();
                return [4 /*yield*/, bg('p2', 'python3 frames.py', 'Run the drawing of frames (about 20 min)')];
            case 10:
                _e.sent();
                texts = function () {
                    var args_1 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args_1[_i] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (surface) {
                        var list, all, _a, _b;
                        if (surface === void 0) { surface = 'terminal'; }
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: surface }))];
                                case 1:
                                    list = _c.sent();
                                    _a = [[]];
                                    return [4 /*yield*/, list.findAll({ type: 'Text' })];
                                case 2:
                                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                    return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                case 3:
                                    all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                    return [4 /*yield*/, list.unmount()];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/, all];
                            }
                        });
                    });
                };
                n = 0;
                _e.label = 11;
            case 11:
                if (!(n < 10)) return [3 /*break*/, 14];
                return [4 /*yield*/, advance(MIN)
                    // Before the limit both watches run, as one row of two
                ];
            case 12:
                _e.sent();
                _e.label = 13;
            case 13:
                n++;
                return [3 /*break*/, 11];
            case 14:
                // Before the limit both watches run, as one row of two
                _a = expect;
                return [4 /*yield*/, texts()];
            case 15:
                // Before the limit both watches run, as one row of two
                _a.apply(void 0, [(_e.sent()).some(function (text) { return /^Wait for first screening pass ×2$/.test(text); })]).toBe(true);
                n = 0;
                _e.label = 16;
            case 16:
                if (!(n < 39)) return [3 /*break*/, 19];
                return [4 /*yield*/, advance(MIN)];
            case 17:
                _e.sent();
                _e.label = 18;
            case 18:
                n++;
                return [3 /*break*/, 16];
            case 19: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                    var all;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1:
                                all = _a.sent();
                                return [2 /*return*/, all.some(function (text) { return /^4 commands ended/.test(text); }) ? all : undefined];
                        }
                    });
                }); })];
            case 20:
                shown = (_d = (_e.sent())) !== null && _d !== void 0 ? _d : [];
                // The watches the engine killed at their limit, the failed and the finished command are gone from the tree, and no clock runs for them
                expect(shown.some(function (text) { return /\[killed\]/.test(text); })).toBe(false);
                expect(shown.some(function (text) { return /^(Wait for first screening pass ×2|Run the fetch of the list|Run the tidy up)\b(?! (failed|has finished))/.test(text); })).toBe(false);
                // (the card's own line names the two that ended since its last line, with how each ended)
                expect(shown).toContain('Run the tidy up has finished and Run the fetch of the list failed');
                // The closing row counts them and says, in words, how many did not finish well
                expect(shown).toContain('4 commands ended · 1 failed, 2 timed out');
                // The wait still running stays, within its time
                expect(shown).toContain('Wait for the details screening to finish');
                expect(shown).toContain('49m 00s of ~55m');
                // Past its time: a fresh expectation from the time left it prints; or else plainly past it, never the old figure as if it held
                expect(shown).toContain('49m 00s of ~53m');
                expect(shown).toContain('49m 00s · past ~20m');
                expect(shown.some(function (text) { return /of ~20m/.test(text); })).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))];
            case 21:
                pane = _e.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 22:
                details = (_e.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, pane.unmount()];
            case 23:
                _e.sent();
                expect(details).toContain('Commands ended');
                expect(details.filter(function (text) { return text === 'Wait for first screening pass'; }).length).toBe(2);
                expect(details.filter(function (text) { return /^timed out after (29|30)m \d\ds · /.test(text); }).length).toBe(2);
                expect(details.some(function (text) { return /^failed \(exit code 1\) after \dm \d\ds · /.test(text); })).toBe(true);
                expect(details.some(function (text) { return /^finished after \dm \d\ds · /.test(text); })).toBe(true);
                n = 0;
                _e.label = 24;
            case 24:
                if (!(n < 8)) return [3 /*break*/, 27];
                return [4 /*yield*/, advance(MIN)];
            case 25:
                _e.sent();
                _e.label = 26;
            case 26:
                n++;
                return [3 /*break*/, 24];
            case 27:
                _b = expect;
                return [4 /*yield*/, texts()];
            case 28:
                _b.apply(void 0, [(_e.sent()).some(function (text) { return /^57m 00s · past ~55m$/.test(text); })]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test("a run's second line starts under its name, with the tree's lines carried down beside it: not the last, the last, a run under a helper, a narrow panel, on a desktop and in a terminal; 15 Nov the app dropped the lines and the line started left of the tree", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, outputs, clock, advance, detach, n, kids, all, textOf, rows, _i, _a, columns, runs, seen, drawn, _b, _c, svg, _d, _e, _f, head, stand, lines, rails, pane, shown, narrow, tight;
    var _this = this;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                now = 1700000000000;
                outputs = { '/w/fit.log': 'loading\nprogress: 3/6 steps fitting\n', '/w/up.log': 'progress: 2/3 files uploading eta 4m\n', '/w/pics.log': 'progress: 10/40 pictures drawing\n' };
                clock = world(on, { jobs: { output: function (file) { var _a; return (_a = outputs[file]) !== null && _a !== void 0 ? _a : ''; }, wroteAt: function () { return now - 2000; } } }).clock;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (now += ms);
                            return [4 /*yield*/, clock.advance(ms)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fit and upload', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fit and upload', prompt: 'go' }))];
            case 3:
                _j.sent();
                detach = function (agentId, id, log, description) {
                    return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: "cd /w && nohup python run.py > ".concat(log, " 2>&1 & echo $!"), description: description });
                };
                return [4 /*yield*/, detach('a1', 'n1', 'fit.log', 'Run the fit of every head')];
            case 4:
                _j.sent();
                return [4 /*yield*/, detach('a1', 'n2', 'up.log', 'Upload the cleaned A, B, C over the old ones')];
            case 5:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Draw the pictures', prompt: 'go', parentAgentId: 'a1' })];
            case 6:
                _j.sent();
                return [4 /*yield*/, detach('a2', 'n3', 'pics.log', 'Run the drawing of every picture')];
            case 7:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Check the drawing', prompt: 'go', parentAgentId: 'a1' })];
            case 8:
                _j.sent();
                n = 0;
                _j.label = 9;
            case 9:
                if (!(n < 6)) return [3 /*break*/, 12];
                return [4 /*yield*/, advance(20000)];
            case 10:
                _j.sent();
                _j.label = 11;
            case 11:
                n++;
                return [3 /*break*/, 9];
            case 12:
                kids = function (node) { var _a; return ((_a = node.children) !== null && _a !== void 0 ? _a : []).filter(function (one) { return one && typeof one === 'object'; }); };
                all = function (node) { return __spreadArray([node], kids(node).flatMap(all), true); };
                textOf = function (node) { return all(node).filter(function (one) { return one.type === 'Text'; }).flatMap(function (one) { var _a; return ((_a = one.children) !== null && _a !== void 0 ? _a : []).filter(function (part) { return typeof part === 'string'; }); }).join(''); };
                rows = function (surface, columns) { return __awaiter(_this, void 0, void 0, function () {
                    var pane, found, svgs;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: columns }), surface: surface }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var boxes, runs;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, pane.findAll({ type: 'Box' })];
                                                case 1:
                                                    boxes = (_a.sent());
                                                    runs = boxes.filter(function (one) { var _a; return /^job-list-job-/.test(String((_a = one.key) !== null && _a !== void 0 ? _a : '')) && kids(one).length === 2; });
                                                    return [2 /*return*/, runs.length === 3 ? runs : undefined];
                                            }
                                        });
                                    }); })];
                            case 2:
                                found = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
                            case 3:
                                svgs = (_a.sent());
                                return [4 /*yield*/, pane.unmount()];
                            case 4:
                                _a.sent();
                                return [2 /*return*/, { runs: (found !== null && found !== void 0 ? found : []).map(function (one) { return ({ head: kids(kids(one)[0])[0], stand: kids(one)[1] }); }), svgs: svgs }];
                        }
                    });
                }); };
                _i = 0, _a = [72, 40];
                _j.label = 13;
            case 13:
                if (!(_i < _a.length)) return [3 /*break*/, 17];
                columns = _a[_i];
                return [4 /*yield*/, rows('terminal', columns)];
            case 14:
                runs = (_j.sent()).runs;
                expect(runs).toHaveLength(3);
                seen = runs.map(function (_a) {
                    var head = _a.head, stand = _a.stand;
                    var lines = textOf(head);
                    var rails = textOf(kids(stand)[0]);
                    expect(rails.length).toBe(lines.length);
                    expect(__spreadArray([], rails, true).map(function (ch, n) { var _a; return (ch === '│') === /[│├]/.test((_a = lines[n]) !== null && _a !== void 0 ? _a : ''); })).toEqual(__spreadArray([], rails, true).map(function () { return true; }));
                    expect(stand.props.height).toBe(1);
                    return lines;
                });
                // every case is here: a run that is not the last, the last, and one under a helper with the work's own line going on beside it
                expect(seen.some(function (lines) { return lines.startsWith('├'); })).toBe(true);
                expect(seen.some(function (lines) { return lines.startsWith('└') || /^│ └/.test(lines); })).toBe(true);
                expect(seen.some(function (lines) { return /^│ [├└]/.test(lines); })).toBe(true);
                return [4 /*yield*/, rows('desktop', columns)];
            case 15:
                drawn = _j.sent();
                for (_b = 0, _c = drawn.svgs; _b < _c.length; _b++) {
                    svg = _c[_b];
                    expect(String((_g = svg.props.alt) !== null && _g !== void 0 ? _g : '').trim()).not.toBe('');
                    expect(Number(svg.props.width)).toBeGreaterThan(0);
                }
                for (_d = 0, _e = drawn.runs; _d < _e.length; _d++) {
                    _f = _e[_d], head = _f.head, stand = _f.stand;
                    lines = all(head).filter(function (one) { return one.type === 'Svg'; })[0];
                    rails = all(kids(stand)[0]).filter(function (one) { return one.type === 'Svg'; })[0];
                    expect(rails === null || rails === void 0 ? void 0 : rails.props.width).toBe(lines === null || lines === void 0 ? void 0 : lines.props.width);
                    // and the words move in by the step the name's own button pads it with
                    expect((_h = kids(stand)[1]) === null || _h === void 0 ? void 0 : _h.props.paddingLeft).toBe('xs');
                    expect(String(rails === null || rails === void 0 ? void 0 : rails.props.source)).toContain('<path');
                }
                _j.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 13];
            case 17: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 18:
                pane = _j.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 19:
                shown = (_j.sent()).map(function (one) { return one.text; }).join('\n');
                return [4 /*yield*/, pane.unmount()];
            case 20:
                _j.sent();
                expect(shown).toContain('4m left');
                expect(shown).toMatch(/~2m left/);
                expect(shown).not.toMatch(/printed/);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 40 }), surface: 'terminal' }))];
            case 21:
                narrow = _j.sent();
                return [4 /*yield*/, narrow.findAll({ type: 'Text' })];
            case 22:
                tight = (_j.sent()).map(function (one) { return one.text; });
                expect(tight).toContain('3/6 steps · ~2m left');
                // and one under a helper, with less room, keeps its count beside it
                expect(tight).toContain('10/40 · ~6m left');
                return [4 /*yield*/, narrow.unmount()];
            case 23:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
