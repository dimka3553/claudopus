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
test('a small card shows where the work is and a count of its to-dos; pressed, it lists every to-do; ended work stays among the cards until it is dismissed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, logged, clock, files, opened, call, doing, early, _b, _c, pane, _d, _e, _f, _g, _h, _j, edgeOf, _k, flat, _l, _m, _o, _p, _q, _r, listed, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _i, _2, n, tab, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, plain, _19, _20, _21, helperTab, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, item, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, buttons, _47, _48, _49, _50, ended, _51, _52, band, _53;
    var _this = this;
    var _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97;
    return __generator(this, function (_98) {
        switch (_98.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { agents: agents, kinds: kinds }), logged = _a.logged, clock = _a.clock, files = _a.files, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _98.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _98.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _98.sent();
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again' })];
            case 4:
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Try the other model' })
                    // Only one to-do is being done at a time
                ];
            case 5:
                _98.sent();
                // Only one to-do is being done at a time
                return [4 /*yield*/, call('todo', { item: 'Try the other model', state: 'doing' })];
            case 6:
                // Only one to-do is being done at a time
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again', state: 'doing' })];
            case 7:
                doing = _98.sent();
                expect(String(doing.result)).toBe('[doing] Fit the nostril again\n[ ] Try the other model');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 8:
                early = _98.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'r0', agentId: 'a1', file_path: '/repo/nose.obj' })];
            case 9:
                _98.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, early.find({ type: 'Text', text: /^(Reading files|Thinking)$/ })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [_98.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, early.find({ type: 'Text', text: 'Starting' })];
            case 11:
                _c.apply(void 0, [_98.sent()]).toBeUndefined();
                return [4 /*yield*/, early.unmount()];
            case 12:
                _98.sent();
                return [4 /*yield*/, call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })];
            case 13:
                _98.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                    // as the edge's lighter part, the rest only counted
                ];
            case 14:
                pane = _98.sent();
                // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                // as the edge's lighter part, the rest only counted
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 15:
                // Three moving dots beside the line the work last wrote and nowhere else; of its to-dos only the one being done is named, numbered
                // as the edge's lighter part, the rest only counted
                _d.apply(void 0, [_98.sent()]).toHaveLength(1);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Now:$/ })];
            case 16:
                _e.apply(void 0, [_98.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^To-do / })];
            case 17:
                _f.apply(void 0, [(_54 = (_98.sent())) === null || _54 === void 0 ? void 0 : _54.text]).toBe('To-do 1 of 2 ·');
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Fit the/ })];
            case 18:
                _g.apply(void 0, [(_55 = (_98.sent())) === null || _55 === void 0 ? void 0 : _55.props.dimColor]).toBe(false);
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Try the/ })];
            case 19:
                _h.apply(void 0, [_98.sent()]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ to-dos done/ })];
            case 20:
                _j.apply(void 0, [(_56 = (_98.sent())) === null || _56 === void 0 ? void 0 : _56.text]).toMatch(/(^| · )0 of 2 to-dos done · \d+s$/);
                edgeOf = function (of) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.backgroundColor); }).filter(function (colour) { return colour.startsWith('#8A63F0'); })];
                    }
                }); }); };
                _k = expect;
                return [4 /*yield*/, edgeOf(pane)];
            case 21:
                _k.apply(void 0, [_98.sent()]).toEqual(['#8A63F0AD', '#8A63F05C']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 22:
                flat = _98.sent();
                _l = expect;
                return [4 /*yield*/, flat.findAll({ type: 'Box' })];
            case 23:
                _l.apply(void 0, [(_98.sent()).map(function (b) { return String(b.props.backgroundColor); }).filter(function (colour) { return colour === '#6E3CFF'; })]).toEqual(['#6E3CFF']);
                return [4 /*yield*/, flat.unmount()
                    // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                ];
            case 24:
                _98.sent();
                // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                _m = expect;
                return [4 /*yield*/, keyed(pane, 'go-a1')];
            case 25:
                // The title opens its Details, with no mark beside it, and Stop is plain text on the same row: the card has no filled button
                _m.apply(void 0, [_98.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, keyed(pane, 'open-a1')];
            case 26:
                _o.apply(void 0, [(_57 = (_98.sent())) === null || _57 === void 0 ? void 0 : _57.props.plain]).toBe(true);
                _p = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 27:
                _p.apply(void 0, [(_58 = (_98.sent())) === null || _58 === void 0 ? void 0 : _58.props]).toMatchObject({ label: 'Stop', plain: true });
                // A line too long for its two rows is cut at the end of a word
                return [4 /*yield*/, call('note', { text: "I am ".concat('fitting the nostril again and again '.repeat(5), "today.") })];
            case 28:
                // A line too long for its two rows is cut at the end of a word
                _98.sent();
                _q = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 29:
                _q.apply(void 0, [(_59 = (_98.sent())) === null || _59 === void 0 ? void 0 : _59.text]).toBe('I am fitting the nostril again and again fitting the nostril again and …');
                return [4 /*yield*/, call('note', { text: 'I am fitting the nostril again, because the first fit left it open.' })];
            case 30:
                _98.sent();
                _r = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 31:
                _r.apply(void 0, [(_60 = (_98.sent())) === null || _60 === void 0 ? void 0 : _60.text]).toBe('I am fitting the nostril again, because the first fit left it open.');
                return [4 /*yield*/, call('note', { text: 'The nostril is closed; I am comparing the head with your scan.' })];
            case 32:
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Fit the nostril again', state: 'done' })];
            case 33:
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Try the other model', state: 'dropped' })];
            case 34:
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Compare the head with your scan', was: 'compare with scan' })];
            case 35:
                listed = _98.sent();
                expect(String(listed.result)).toBe('[x] Fit the nostril again\n[dropped] Try the other model\n[ ] Compare the head with your scan');
                // A chat's own thread has no to-do of its own
                _s = expect;
                _t = String;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', text: 'x' })];
            case 36:
                // A chat's own thread has no to-do of its own
                _s.apply(void 0, [_t.apply(void 0, [(_98.sent()).result])]).toContain('Only a background task');
                // The newer line replaced the older; a dropped to-do is not counted
                _u = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am fitting/ })];
            case 37:
                // The newer line replaced the older; a dropped to-do is not counted
                _u.apply(void 0, [_98.sent()]).toBeUndefined();
                _v = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^The nostril is closed/ })];
            case 38:
                _v.apply(void 0, [(_61 = (_98.sent())) === null || _61 === void 0 ? void 0 : _61.text]).toBe('The nostril is closed; I am comparing the head with your scan.');
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ to-dos done/ })];
            case 39:
                _w.apply(void 0, [(_62 = (_98.sent())) === null || _62 === void 0 ? void 0 : _62.text]).toContain('1 of 2 to-dos done');
                // The done to-do's part of the edge is bright, and with none being done the other is dim; with none marked doing the card names
                // no to-do: no "Next to-do 2 of 2" beside "1 of 2 to-dos done" (18 Nov)
                _x = expect;
                return [4 /*yield*/, edgeOf(pane)];
            case 40:
                // The done to-do's part of the edge is bright, and with none being done the other is dim; with none marked doing the card names
                // no to-do: no "Next to-do 2 of 2" beside "1 of 2 to-dos done" (18 Nov)
                _x.apply(void 0, [_98.sent()]).toEqual(['#8A63F0', '#8A63F05C']);
                _y = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /to-do \d+ of \d+/i })];
            case 41:
                _y.apply(void 0, [_98.sent()]).toBeUndefined();
                _z = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Compare the head/ })];
            case 42:
                _z.apply(void 0, [_98.sent()]).toBeUndefined();
                _0 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 43:
                _0.apply(void 0, [_98.sent()]).toHaveLength(1);
                _1 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^To do/ })];
            case 44:
                _1.apply(void 0, [_98.sent()]).toBeUndefined();
                // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
                // done or dropped is one quiet count that opens on a press
                return [4 /*yield*/, call('todo', { item: 'Compare the head with your scan', state: 'doing' })];
            case 45:
                // Pressed: separate parts with headings; the one being done stands out with the dots and where the work is under it; what is
                // done or dropped is one quiet count that opens on a press
                _98.sent();
                return [4 /*yield*/, call('todo', { item: 'Check the left ear' })];
            case 46:
                _98.sent();
                _i = 0, _2 = [1, 2, 3, 4];
                _98.label = 47;
            case 47:
                if (!(_i < _2.length)) return [3 /*break*/, 50];
                n = _2[_i];
                return [4 /*yield*/, call('todo', { item: "Later step ".concat(n) })];
            case 48:
                _98.sent();
                _98.label = 49;
            case 49:
                _i++;
                return [3 /*break*/, 47];
            case 50: return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 51:
                _98.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 52:
                tab = _98.sent();
                _3 = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 53:
                _3.apply(void 0, [_98.sent()]).toHaveLength(1);
                _4 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^To-dos$/ })];
            case 54:
                _4.apply(void 0, [(_63 = (_98.sent())) === null || _63 === void 0 ? void 0 : _63.props.bold]).toBe(true);
                _5 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Conversation$/ })];
            case 55:
                _5.apply(void 0, [(_64 = (_98.sent())) === null || _64 === void 0 ? void 0 : _64.props.bold]).toBe(true);
                _6 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /of \d+ done$/ })];
            case 56:
                _6.apply(void 0, [(_65 = (_98.sent())) === null || _65 === void 0 ? void 0 : _65.text]).toBe('1 of 7 done');
                _7 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Compare/ })];
            case 57:
                _7.apply(void 0, [(_66 = (_98.sent())) === null || _66 === void 0 ? void 0 : _66.props.dimColor]).toBe(false);
                _8 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Check the left ear/ })];
            case 58:
                _8.apply(void 0, [(_67 = (_98.sent())) === null || _67 === void 0 ? void 0 : _67.props.dimColor]).toBe(true);
                _9 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^The nostril is closed/ })];
            case 59:
                _9.apply(void 0, [(_68 = (_98.sent())) === null || _68 === void 0 ? void 0 : _68.props.dimColor]).toBe(true);
                _10 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Now:$/ })];
            case 60:
                _10.apply(void 0, [_98.sent()]).toBeUndefined();
                // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
                _11 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Later step 4$/ })];
            case 61:
                // Every to-do is listed in the order the work listed them: done ticked, dropped struck through, the rest dim
                _11.apply(void 0, [_98.sent()]).toBeDefined();
                _12 = expect;
                return [4 /*yield*/, keyed(tab, 'fold--1000003')];
            case 62:
                _12.apply(void 0, [_98.sent()]).toBeUndefined();
                _13 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Fit the/ })];
            case 63:
                _13.apply(void 0, [(_69 = (_98.sent())) === null || _69 === void 0 ? void 0 : _69.props.dimColor]).toBe(true);
                _14 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Try the/ })];
            case 64:
                _14.apply(void 0, [(_70 = (_98.sent())) === null || _70 === void 0 ? void 0 : _70.props.strikethrough]).toBe(true);
                // The list behind it is as it was
                _15 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ to-dos done/ })];
            case 65:
                // The list behind it is as it was
                _15.apply(void 0, [(_71 = (_98.sent())) === null || _71 === void 0 ? void 0 : _71.text]).toContain('1 of 7 to-dos done');
                // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'h1', agentId: 'a1', prompt: 'search', description: 'Search the docs' })];
            case 66:
                // A helper this work starts writes into the same card, and is no card of its own, even where the engine does not name its parent
                _98.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { fork: false, subagentType: 'general-purpose', description: 'Search the docs', prompt: 'search', tool_use_id: 'h1' }))];
            case 67:
                _98.sent();
                expect(prompts.at(-1)).toBe('search');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 't', agentId: 'a2', text: 'I am reading how the other model draws outlines.' })];
            case 68:
                _98.sent();
                _16 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^I am reading/ })];
            case 69:
                _16.apply(void 0, [(_72 = (_98.sent())) === null || _72 === void 0 ? void 0 : _72.text]).toBe('I am reading how the other model draws outlines.');
                // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
                _17 = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a2')];
            case 70:
                // It hangs inside that card as one slim row of its own: its name, which opens it, joined to the card by a line that ends in a purple dot while it works
                _17.apply(void 0, [(_73 = (_98.sent())) === null || _73 === void 0 ? void 0 : _73.props.label]).toBe('Search the docs');
                _18 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 71:
                _18.apply(void 0, [(_98.sent()).filter(function (svg) { return String(svg.props.source).includes('M9 0V5Q9 10 14 10H22') && String(svg.props.source).includes('fill="#8A63F0"') && svg.props.alt === 'Working' && svg.props.isInteractive === true; })]).toHaveLength(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 72:
                plain = _98.sent();
                _19 = expect;
                return [4 /*yield*/, plain.find({ type: 'Text', text: /^└─/ })];
            case 73:
                _19.apply(void 0, [(_74 = (_98.sent())) === null || _74 === void 0 ? void 0 : _74.text]).toBe('└───');
                return [4 /*yield*/, plain.unmount()];
            case 74:
                _98.sent();
                _20 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 75:
                _20.apply(void 0, [(_98.sent()).map(function (b) { return b.props.label; }).filter(function (label) { return label === 'Stop'; })]).toHaveLength(1);
                // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
                return [4 /*yield*/, pressed(pane, 'open-list-a2')];
            case 76:
                // Pressed, the helper's own Details opens as a tab of its own, which names the work it helps and leads to it
                _98.sent();
                _21 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a2') || undefined];
                    }); }); })];
            case 77:
                _21.apply(void 0, [_98.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', surface: 'desktop' }))];
            case 78:
                helperTab = _98.sent();
                _22 = expect;
                return [4 /*yield*/, helperTab.find({ type: 'Text', text: /Search the docs/ })];
            case 79:
                _22.apply(void 0, [(_75 = (_98.sent())) === null || _75 === void 0 ? void 0 : _75.props.bold]).toBe(true);
                _23 = expect;
                return [4 /*yield*/, keyed(helperTab, 'open-parent-a2')];
            case 80:
                _23.apply(void 0, [(_76 = (_98.sent())) === null || _76 === void 0 ? void 0 : _76.props.label]).toBe('↑ A helper of: Fix the nose');
                return [4 /*yield*/, helperTab.unmount()
                    // and the work's own Details lists it under Helpers
                ];
            case 81:
                _98.sent();
                // and the work's own Details lists it under Helpers
                _24 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Helpers$/ })];
            case 82:
                // and the work's own Details lists it under Helpers
                _24.apply(void 0, [(_77 = (_98.sent())) === null || _77 === void 0 ? void 0 : _77.props.bold]).toBe(true);
                _25 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /helper working$/ })];
            case 83:
                _25.apply(void 0, [(_78 = (_98.sent())) === null || _78 === void 0 ? void 0 : _78.text]).toBe('1 helper working');
                // Work that ends its turn while its helper works goes on working, though its own run is over as Claude Code lists it: a
                // turn's end is only a pause, its clock runs on and it keeps its Stop
                return [4 /*yield*/, clock.advance(120000)];
            case 84:
                // Work that ends its turn while its helper works goes on working, though its own run is over as Claude Code lists it: a
                // turn's end is only a pause, its clock runs on and it keeps its Stop
                _98.sent();
                agents.a1 = 'completed';
                kinds.a1 = kinds.a2 = 'general-purpose';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 85:
                _98.sent();
                _26 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^2m/ })];
            case 86:
                _26.apply(void 0, [(_79 = (_98.sent())) === null || _79 === void 0 ? void 0 : _79.text]).toBe('2m 00s');
                _27 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 87:
                _27.apply(void 0, [_98.sent()]).toBeUndefined();
                _28 = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 88:
                _28.apply(void 0, [_98.sent()]).toBeDefined();
                _29 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 89:
                _29.apply(void 0, [(_98.sent()).some(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); })]).toBe(true);
                agents.a1 = 'running';
                agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Found.', durationMs: 1, isAborted: false, turnId: 'turn-3', reason: 'answer', agentId: 'a2' })
                    // Work that has ended stays in the list until it is dismissed; its Details tab keeps up: it says it finished, with no Stop
                ];
            case 90:
                _98.sent();
                // Work that has ended stays in the list until it is dismissed; its Details tab keeps up: it says it finished, with no Stop
                _30 = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', key: 'stop-a1' })];
            case 91:
                // Work that has ended stays in the list until it is dismissed; its Details tab keeps up: it says it finished, with no Stop
                _30.apply(void 0, [_98.sent()]).toBeDefined();
                _31 = 0, _32 = ['Compare the head with your scan', 'Check the left ear', 'Later step 1', 'Later step 2', 'Later step 3', 'Later step 4'];
                _98.label = 92;
            case 92:
                if (!(_31 < _32.length)) return [3 /*break*/, 95];
                item = _32[_31];
                return [4 /*yield*/, call('todo', { item: item, state: 'done' })];
            case 93:
                _98.sent();
                _98.label = 94;
            case 94:
                _31++;
                return [3 /*break*/, 92];
            case 95:
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'The nostril is **closed**.', durationMs: 1, isAborted: false, turnId: 'turn-4', reason: 'answer', agentId: 'a1' })];
            case 96:
                _98.sent();
                _33 = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Delivered · \d+m/ })];
            case 97:
                _33.apply(void 0, [(_80 = (_98.sent())) === null || _80 === void 0 ? void 0 : _80.text]).toBe('Delivered · 2m 00s');
                _34 = expect;
                return [4 /*yield*/, tab.find({ type: 'Button', key: 'stop-a1' })];
            case 98:
                _34.apply(void 0, [_98.sent()]).toBeUndefined();
                return [4 /*yield*/, tab.unmount()
                    // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                ];
            case 99:
                _98.sent();
                // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                _35 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 100:
                // First it stays in its place for two seconds, green, saying it finished; the header counts it as no longer running at once and says it just finished
                _35.apply(void 0, [(_81 = (_98.sent())) === null || _81 === void 0 ? void 0 : _81.props.bold]).toBe(true);
                _36 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 101:
                _36.apply(void 0, [(_82 = (_98.sent())) === null || _82 === void 0 ? void 0 : _82.props.color]).toBe('#4C9AFF');
                _37 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 102:
                _37.apply(void 0, [(_98.sent()).filter(function (b) { var _a; return !((_a = b.key) === null || _a === void 0 ? void 0 : _a.startsWith('outline-')) && b.props.backgroundColor === '#4C9AFF'; }).length]).toBe(1);
                _38 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /delivered$/ })];
            case 103:
                _38.apply(void 0, [(_83 = (_98.sent())) === null || _83 === void 0 ? void 0 : _83.props.color]).toBe('#4C9AFF');
                _39 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /delivered$/ })];
            case 104:
                _39.apply(void 0, [(_84 = (_98.sent())) === null || _84 === void 0 ? void 0 : _84.text]).toBe('1 delivered');
                // Its helper, ended in the same moment, stays in its card for the same pause
                _40 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 105:
                // Its helper, ended in the same moment, stays in its card for the same pause
                _40.apply(void 0, [(_98.sent()).map(function (b) { return b.props.label; })]).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', 'Search the docs', 'Mark as done']);
                return [4 /*yield*/, clock.advance(1000)];
            case 106:
                _98.sent();
                _41 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 107:
                _41.apply(void 0, [_98.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(1100)
                    // After them it is still among the cards, green, its line the last written into it (its helper's), and nothing is under Finished:
                    // only Dismiss puts it there
                ];
            case 108:
                _98.sent();
                // After them it is still among the cards, green, its line the last written into it (its helper's), and nothing is under Finished:
                // only Dismiss puts it there
                _42 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 109:
                // After them it is still among the cards, green, its line the last written into it (its helper's), and nothing is under Finished:
                // only Dismiss puts it there
                _42.apply(void 0, [(_85 = (_98.sent())) === null || _85 === void 0 ? void 0 : _85.props.bold]).toBe(true);
                _43 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 110:
                _43.apply(void 0, [(_86 = (_98.sent())) === null || _86 === void 0 ? void 0 : _86.props.color]).toBe('#4C9AFF');
                _44 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^ · I am reading/ })];
            case 111:
                _44.apply(void 0, [(_87 = (_98.sent())) === null || _87 === void 0 ? void 0 : _87.text]).toBe(' · I am reading how the other model draws outlines.');
                _45 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /delivered$/ })];
            case 112:
                _45.apply(void 0, [(_88 = (_98.sent())) === null || _88 === void 0 ? void 0 : _88.text]).toBe('1 delivered');
                _46 = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 113:
                _46.apply(void 0, [(_98.sent()).map(function (b) { return b.props.label; })]).toEqual(['Stats', 'Memory', 'Config', 'About', 'Fix the nose', '1 helper ended', 'Mark as done']);
                return [4 /*yield*/, pressed(pane, 'dismiss-a1')];
            case 114:
                _98.sent();
                return [4 /*yield*/, clock.advance(2100)
                    // Dismissed, it is one folded row, "Finished", under the running cards; unfolded, a card as running work has, with Details and no Stop
                ];
            case 115:
                _98.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (b) { return b.props.label === '▸ Finished 1'; }) ? pane.findAll({ type: 'Button' }) : undefined)];
                        }
                    }); }); })];
            case 116:
                buttons = (_89 = (_98.sent())) !== null && _89 !== void 0 ? _89 : [];
                expect(buttons.map(function (b) { return b.props.label; })).toEqual(['Stats', 'Memory', 'Config', 'About', '▸ Finished 1']);
                return [4 /*yield*/, pane.press({ key: String((_90 = buttons.find(function (b) { return b.props.label === '▸ Finished 1'; })) === null || _90 === void 0 ? void 0 : _90.key) })];
            case 117:
                _98.sent();
                _47 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Fix the nose/ })];
            case 118:
                _47.apply(void 0, [(_91 = (_98.sent())) === null || _91 === void 0 ? void 0 : _91.props.wrap]).toBe('truncate-end');
                // its top row only its facts, the line under it how it ended
                _48 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /to-dos done ·/ })];
            case 119:
                // its top row only its facts, the line under it how it ended
                _48.apply(void 0, [(_92 = (_98.sent())) === null || _92 === void 0 ? void 0 : _92.text]).toBe('7 of 7 to-dos done · 2m 00s');
                _49 = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '✓ Done' })];
            case 120:
                _49.apply(void 0, [(_93 = (_98.sent())) === null || _93 === void 0 ? void 0 : _93.props.color]).toBe('success');
                _50 = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 121:
                _50.apply(void 0, [_98.sent()]).toBeUndefined();
                // Finished work's Details opens as a tab of its own too
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 122:
                // Finished work's Details opens as a tab of its own too
                _98.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 123:
                ended = _98.sent();
                _51 = expect;
                return [4 /*yield*/, ended.find({ type: 'Text', text: /^Done · \d+m/ })];
            case 124:
                _51.apply(void 0, [(_94 = (_98.sent())) === null || _94 === void 0 ? void 0 : _94.text]).toBe('Done · 2m 00s');
                _52 = expect;
                return [4 /*yield*/, ended.find({ type: 'Text', text: /^Conversation$/ })];
            case 125:
                _52.apply(void 0, [(_95 = (_98.sent())) === null || _95 === void 0 ? void 0 : _95.props.bold]).toBe(true);
                return [4 /*yield*/, ended.unmount()];
            case 126:
                _98.sent();
                return [4 /*yield*/, clock.advance(20000)
                    // kept with its helper, so its Details still lists it after a reload
                ];
            case 127:
                _98.sent();
                // kept with its helper, so its Details still lists it after a reload
                expect(JSON.parse((_96 = files.get("".concat(MEMORY, "/finished/engine-id.json"))) !== null && _96 !== void 0 ? _96 : '[]').map(function (one) { return one.id; })).toEqual(['a1', 'a2']);
                return [4 /*yield*/, pane.unmount()];
            case 128:
                _98.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 129:
                band = _98.sent();
                _53 = expect;
                return [4 /*yield*/, band.find({ type: 'Text' })];
            case 130:
                _53.apply(void 0, [(_97 = (_98.sent())) === null || _97 === void 0 ? void 0 : _97.text]).toBe("the engine's own");
                return [4 /*yield*/, band.unmount()];
            case 131:
                _98.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
// A long work resumed with new rounds: 16 to-dos, 12 done and one being done, more than the edge has parts for
test('past the parts the edge has, it is one bar in three shades, and the step being done is named with the same number', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var call, n, n, pane, edge, _a, _b, _c, _d, after, _e, _f, n, _g, _h;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'add the depth model to the video fit', wait: false, origin: composer })];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'add the depth model to the video fit' }))];
            case 3:
                _m.sent();
                call = function (tool, input) { return $.tool.call(__assign({ tool: "mcp__claudopus__".concat(tool), tool_use_id: 't', agentId: 'a1' }, input)); };
                n = 1;
                _m.label = 4;
            case 4:
                if (!(n <= 16)) return [3 /*break*/, 7];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n) })];
            case 5:
                _m.sent();
                _m.label = 6;
            case 6:
                n += 1;
                return [3 /*break*/, 4];
            case 7:
                n = 1;
                _m.label = 8;
            case 8:
                if (!(n <= 12)) return [3 /*break*/, 11];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n), state: 'done' })];
            case 9:
                _m.sent();
                _m.label = 10;
            case 10:
                n += 1;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, call('todo', { item: 'Round step 13', state: 'doing' })];
            case 12:
                _m.sent();
                return [4 /*yield*/, call('note', { text: 'New round on the nose only.' })];
            case 13:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 14:
                pane = _m.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 15:
                edge = (_m.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); });
                expect(edge.map(function (b) { return [b.props.backgroundColor, b.props.flexGrow]; })).toEqual([['#8A63F0', 12], ['#8A63F0AD', 1], ['#8A63F05C', 3]]);
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ to-dos done/ })];
            case 16:
                _a.apply(void 0, [(_j = (_m.sent())) === null || _j === void 0 ? void 0 : _j.text]).toContain('12 of 16 to-dos done');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^To-do / })];
            case 17:
                _b.apply(void 0, [(_k = (_m.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('To-do 13 of 16 ·');
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Round step 13$/ })];
            case 18:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Round step 14$/ })];
            case 19:
                _d.apply(void 0, [_m.sent()]).toBeUndefined();
                // With nothing being done, the bar has no lighter part and no to-do is named, nor once every one is ticked: the facts row counts them
                return [4 /*yield*/, call('todo', { item: 'Round step 13', state: 'done' })];
            case 20:
                // With nothing being done, the bar has no lighter part and no to-do is named, nor once every one is ticked: the facts row counts them
                _m.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 21:
                after = (_m.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); });
                expect(after.map(function (b) { return [b.props.backgroundColor, b.props.flexGrow]; })).toEqual([['#8A63F0', 13], ['#8A63F05C', 3]]);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /to-do \d+ of \d+/i })];
            case 22:
                _e.apply(void 0, [_m.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Round step 14$/ })];
            case 23:
                _f.apply(void 0, [_m.sent()]).toBeUndefined();
                n = 14;
                _m.label = 24;
            case 24:
                if (!(n <= 16)) return [3 /*break*/, 27];
                return [4 /*yield*/, call('todo', { item: "Round step ".concat(n), state: 'done' })];
            case 25:
                _m.sent();
                _m.label = 26;
            case 26:
                n += 1;
                return [3 /*break*/, 24];
            case 27:
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^All \d+ to-dos done$/ })];
            case 28:
                _g.apply(void 0, [_m.sent()]).toBeUndefined();
                _h = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /of \d+ to-dos done/ })];
            case 29:
                _h.apply(void 0, [(_l = (_m.sent())) === null || _l === void 0 ? void 0 : _l.text]).toContain('16 of 16 to-dos done');
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
                _h.apply(void 0, [(_u = (_0.sent())) === null || _u === void 0 ? void 0 : _u.props.label]).toBe('▸ Used 1 other tool');
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
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Done: / })];
            case 28:
                _o.apply(void 0, [(_z = (_0.sent())) === null || _z === void 0 ? void 0 : _z.text]).toBe('Done: Fit the nostril again');
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 29:
                texts = (_0.sent()).map(function (one) { return one.text; });
                expect(texts.indexOf('You')).toBe(texts.indexOf('search: nose') + 1);
                expect(texts.indexOf('Done: Fit the nostril again')).toBeGreaterThan(texts.indexOf('You'));
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
    var agents, _a, sent, appended, submitted, clock, step, noted, n;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, kinds: { a1: 'general-purpose' } }), sent = _a.sent, appended = _a.appended, submitted = _a.submitted, clock = _a.clock;
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
                // 17 Nov: a task handed back the person's "upload the second video like the first one" though it held the accounts to do it, and
                // parts of a message the chat had already seen to elsewhere: what the chat sends is done here, and only an unrelated request goes back
                expect(appended[0]).toContain('do it here, as the chat sent it to you to be done');
                expect(appended[0]).toContain('only a request this task has nothing to do with');
                expect(appended[0]).toContain("Do only what the chat's message asks of you: the chat has seen to the rest of what the person said.");
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
                // (a run that is over is listed so by Claude Code; never pressed for a hand-back, its last words are its result)
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 15:
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
                _a = world(on, { agents: { a1: 'completed' }, kinds: { a1: 'general-purpose' } }), appended = _a.appended, sent = _a.sent;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))
                    // (its run is over, as Claude Code lists it, and it was never pressed for a hand-back: its last words are its result)
                ];
            case 3:
                _b.sent();
                // (its run is over, as Claude Code lists it, and it was never pressed for a hand-back: its last words are its result)
                return [4 /*yield*/, $.turn.complete({ answer: 'The nose is fixed. Shall I build it into the app? '.repeat(20), durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer', agentId: 'a1' })];
            case 4:
                // (its run is over, as Claude Code lists it, and it was never pressed for a hand-back: its last words are its result)
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'Yes, build the nose into the app', wait: false, origin: composer })];
            case 5:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'From Sam, as they said it: "Yes, build the nose into the app"' })];
            case 6:
                _b.sent();
                all = __spreadArray(__spreadArray([], appended, true), sent, true).join('\n');
                expect(all).toContain('The message you just received carries the person\'s words "Yes, build the nose into the app", typed by them in the chat. Only those words are the person\'s');
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
test('work that takes many steps without touching its to-dos is reminded to bring them up to date, and work whose card has said nothing of its own for minutes is asked to say what it does now', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, appended, clock, step, n, n, n;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), appended = _a.appended, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _b.sent();
                step = function (tool, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: 't', agentId: 'a1' }, input));
                };
                n = 0;
                _b.label = 3;
            case 3:
                if (!(n < 11)) return [3 /*break*/, 6];
                return [4 /*yield*/, step('Bash')];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                n += 1;
                return [3 /*break*/, 3];
            case 6:
                expect(appended).toEqual([]);
                return [4 /*yield*/, step('Read')];
            case 7:
                _b.sent();
                expect(appended).toHaveLength(1);
                expect(appended[0]).toContain('a1: You have taken 12 steps since you last touched your to-dos');
                n = 0;
                _b.label = 8;
            case 8:
                if (!(n < 11)) return [3 /*break*/, 11];
                return [4 /*yield*/, step('Bash')];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10:
                n += 1;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, step('mcp__claudopus__todo', { item: 'Fit the nostril again', state: 'doing' })];
            case 12:
                _b.sent();
                n = 0;
                _b.label = 13;
            case 13:
                if (!(n < 11)) return [3 /*break*/, 16];
                return [4 /*yield*/, step('Bash')];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15:
                n += 1;
                return [3 /*break*/, 13];
            case 16:
                expect(appended).toHaveLength(1);
                return [4 /*yield*/, step('Bash')];
            case 17:
                _b.sent();
                expect(appended).toHaveLength(2);
                // Its card's line gone stale by the clock, however it keeps its to-dos, it is asked at its next step, once, for a note of what it
                // does now (19 Nov: the line still said what it did minutes before)
                return [4 /*yield*/, step('mcp__claudopus__note', { text: 'Fitting the nostril' })];
            case 18:
                // Its card's line gone stale by the clock, however it keeps its to-dos, it is asked at its next step, once, for a note of what it
                // does now (19 Nov: the line still said what it did minutes before)
                _b.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 19:
                _b.sent();
                return [4 /*yield*/, step('mcp__claudopus__todo', { item: 'Fit the nostril again', state: 'doing' })];
            case 20:
                _b.sent();
                expect(appended).toHaveLength(2);
                return [4 /*yield*/, step('Bash')];
            case 21:
                _b.sent();
                expect(appended).toHaveLength(3);
                expect(appended[2]).toContain('a1: Your card has said "Fitting the nostril" for 3m');
                expect(appended[2]).toContain('send a `note` saying in one plain line what you are doing now');
                return [4 /*yield*/, step('Bash')];
            case 22:
                _b.sent();
                expect(appended).toHaveLength(3);
                return [2 /*return*/];
        }
    });
}); });
test('work that ends in an error is kept as failed, saying why; a run that is over with nothing of its own running is failed too, "Ended without its result", with Start again, where Claude Code pressed it for a hand-back that never came, and done with its last words where it never did; time lying ended is not counted, and work under way is never forgotten; past 40 tasks, work that ended before cards stayed up and a dismissed card are forgotten before an ended card never dismissed', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, talk, _a, clock, submitted, files, folder, pane, fold, _b, tab, _c, _d, PRESS, stands, _loop_1, _i, _e, _f, title, isPressed, hasCommand, ends, other, newest, n, again, _g, cards, before, _h, _j, _k, _l, _m;
    var _this = this;
    var _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                agents = {};
                kinds = {};
                talk = [];
                _a = world(on, { agents: agents, kinds: kinds, talk: talk }), clock = _a.clock, submitted = _a.submitted, files = _a.files;
                on('classic.SubagentStop', function () { return ({ value: {} }); });
                folder = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents");
                files.set("".concat(folder, "/agent-r1.meta.json"), JSON.stringify({ description: 'Old work', spawnDepth: 1, finished: true }));
                files.set("".concat(folder, "/agent-r1.jsonl"), JSON.stringify({ timestamp: '2026-11-11T10:00:00Z', type: 'user', message: { content: 'go' } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                pane = _s.sent();
                fold = function (of) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label];
                    }
                }); }); };
                _b = expect;
                return [4 /*yield*/, until(function () { return fold(pane); })];
            case 4:
                _b.apply(void 0, [_s.sent()]).toBe('▸ Finished 1');
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                tab = _s.sent();
                return [4 /*yield*/, clock.advance(120000)];
            case 7:
                _s.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'error', agentId: 'a1' })];
            case 8:
                _s.sent();
                _c = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Failed ·/ })];
            case 9:
                _c.apply(void 0, [(_o = (_s.sent())) === null || _o === void 0 ? void 0 : _o.text]).toBe('Failed · Ended with an error · 2m 00s');
                // An hour later it is sent a message and works again: the hour is not counted
                return [4 /*yield*/, clock.advance(3600000)];
            case 10:
                // An hour later it is sent a message and works again: the hour is not counted
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'try again', resume: { agentId: 'a1' } }))];
            case 11:
                _s.sent();
                _d = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^2m/ })];
            case 12:
                _d.apply(void 0, [(_p = (_s.sent())) === null || _p === void 0 ? void 0 : _p.text]).toBe('2m 00s');
                return [4 /*yield*/, tab.unmount()
                    // A run that is over, as Claude Code lists it, ends its card by whether its result was received: pressed for a hand-back after
                    // its last words, those reached no one and it failed; never pressed, they were taken as its result and it is done. While a
                    // command of its own runs, the end of its turn is only a pause: it is at work, and ends once the command has
                ];
            case 13:
                _s.sent();
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                stands = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var details, text;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: "work-".concat(id), surface: 'desktop' }))];
                            case 1:
                                details = _b.sent();
                                return [4 /*yield*/, details.find({ type: 'Text', text: /^(Delivered|Done|Failed|Stopped) · / })];
                            case 2:
                                text = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text;
                                return [4 /*yield*/, details.unmount()];
                            case 3:
                                _b.sent();
                                return [2 /*return*/, text === null || text === void 0 ? void 0 : text.replace(/ · [^·]*$/, '')];
                        }
                    });
                }); };
                _loop_1 = function (title, isPressed, hasCommand, ends) {
                    var _t, id, _u, _v, _w, _x, _y, _z, again_1, _0;
                    return __generator(this, function (_1) {
                        switch (_1.label) {
                            case 0: return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: title, prompt: 'go' }))];
                            case 1:
                                _t = (_1.sent()).agentId, id = _t === void 0 ? '' : _t;
                                kinds[id] = 'general-purpose';
                                if (!hasCommand) return [3 /*break*/, 3];
                                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "b-".concat(id), agentId: id, command: 'python3 fit.py', description: 'Run the fit', run_in_background: true })];
                            case 2:
                                _1.sent();
                                _1.label = 3;
                            case 3:
                                talk.splice.apply(talk, __spreadArray([0, talk.length, { role: 'assistant', content: [{ type: 'text', text: 'The fit is under way.' }] }], (isPressed ? [PRESS] : []), false));
                                agents[id] = 'completed';
                                return [4 /*yield*/, $.turn.complete({ answer: 'The fit is under way.', durationMs: 1, isAborted: false, turnId: "t-".concat(id), reason: 'answer', agentId: id })];
                            case 4:
                                _1.sent();
                                if (!hasCommand) return [3 /*break*/, 10];
                                return [4 /*yield*/, clock.advance(60000)];
                            case 5:
                                _1.sent();
                                _u = expect;
                                _v = [title];
                                return [4 /*yield*/, stands(id)];
                            case 6:
                                _v = _v.concat([_1.sent()]);
                                _w = Boolean;
                                return [4 /*yield*/, pane.find({ type: 'Button', key: "stop-".concat(id) })];
                            case 7:
                                _u.apply(void 0, [_v.concat([_w.apply(void 0, [_1.sent()])])]).toEqual([title, undefined, true]);
                                // (its command ends, as Claude Code says when the run stops: nothing of its own is in flight)
                                return [4 /*yield*/, $.classic.SubagentStop({ agent_id: id, agent_type: 'general-purpose', agent_transcript_path: '', stop_hook_active: false, background_tasks: [] })];
                            case 8:
                                // (its command ends, as Claude Code says when the run stops: nothing of its own is in flight)
                                _1.sent();
                                return [4 /*yield*/, clock.advance(60000)];
                            case 9:
                                _1.sent();
                                _1.label = 10;
                            case 10:
                                _x = expect;
                                _y = [title];
                                return [4 /*yield*/, until(function () { return stands(id); })];
                            case 11:
                                _x.apply(void 0, [_y.concat([_1.sent()])]).toEqual([title, ends]);
                                // Failed, its card stays up in red, saying why, with Start again: their press asks the chat in their name to send it a message
                                if (!isPressed)
                                    return [2 /*return*/, "continue"];
                                _z = expect;
                                return [4 /*yield*/, pane.findAll({ type: 'Text', text: '✕ Failed · Ended without its result' })];
                            case 12:
                                _z.apply(void 0, [(_1.sent()).every(function (one) { return one.props.color === 'error'; })]).toBe(true);
                                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 13:
                                again_1 = (_1.sent()).find(function (b) { return b.props.label === 'Start again' && String(b.key).startsWith("again-small-".concat(id, "-")); });
                                return [4 /*yield*/, pane.press({ key: (_q = again_1 === null || again_1 === void 0 ? void 0 : again_1.key) !== null && _q !== void 0 ? _q : '' })];
                            case 14:
                                _1.sent();
                                _0 = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, submitted.find(function (text) { return text.includes("pressed \"Start again\" on \"".concat(title, "\" (").concat(id, "), which had failed (ended without its result)")); })];
                                    }); }); })];
                            case 15:
                                _0.apply(void 0, [_1.sent()]).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _e = [
                    ['Pressed for a hand-back', true, false, 'Failed · Ended without its result'],
                    ['Never pressed', false, false, 'Delivered'],
                    ['Pressed, its command running', true, true, 'Failed · Ended without its result'],
                    ['Never pressed, its command running', false, true, 'Delivered'],
                ];
                _s.label = 14;
            case 14:
                if (!(_i < _e.length)) return [3 /*break*/, 17];
                _f = _e[_i], title = _f[0], isPressed = _f[1], hasCommand = _f[2], ends = _f[3];
                return [5 /*yield**/, _loop_1(title, isPressed, hasCommand, ends)];
            case 15:
                _s.sent();
                _s.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 14];
            case 17:
                talk.splice(0, talk.length);
                // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
                return [4 /*yield*/, pane.unmount()];
            case 18:
                // Fifty more pieces of work start and end, with no panel drawing each step: the first is still listed
                _s.sent();
                other = function (n) { return __awaiter(_this, void 0, void 0, function () {
                    var r;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Other ".concat(n), prompt: 'x' }))];
                            case 1:
                                r = _a.sent();
                                agents[String(r.agentId)] = 'completed';
                                kinds[String(r.agentId)] = 'general-purpose';
                                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: "t-".concat(n), reason: 'answer', agentId: r.agentId })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, String(r.agentId)];
                        }
                    });
                }); };
                newest = '';
                n = 0;
                _s.label = 19;
            case 19:
                if (!(n < 50)) return [3 /*break*/, 22];
                return [4 /*yield*/, other(n)];
            case 20:
                newest = _s.sent();
                _s.label = 21;
            case 21:
                n += 1;
                return [3 /*break*/, 19];
            case 22: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 23:
                again = _s.sent();
                _g = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: /Fix the nose/ })];
            case 24:
                _g.apply(void 0, [(_r = (_s.sent())) === null || _r === void 0 ? void 0 : _r.text]).toBe('Fix the nose');
                cards = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, again.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.bold && /^(Other \d+|Fix the nose|Pressed.*|Never pressed.*)$/.test(one.text); }).map(function (one) { return one.text; }).sort()];
                    }
                }); }); };
                return [4 /*yield*/, cards()];
            case 25:
                before = _s.sent();
                _h = expect;
                _j = [before.length];
                return [4 /*yield*/, fold(again)];
            case 26:
                _h.apply(void 0, [_j.concat([_s.sent()])]).toEqual([40, undefined]);
                // A dismissed card goes before any of them: the newest is dismissed, and as one more task ends it is the one forgotten, while
                // every card still up, the oldest too, is kept
                return [4 /*yield*/, pressed(again, "dismiss-".concat(newest))];
            case 27:
                // A dismissed card goes before any of them: the newest is dismissed, and as one more task ends it is the one forgotten, while
                // every card still up, the oldest too, is kept
                _s.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 28:
                _s.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return fold(again); })];
            case 29:
                _k.apply(void 0, [_s.sent()]).toBe('▸ Finished 1');
                return [4 /*yield*/, other(50)];
            case 30:
                _s.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fold(again)];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 31:
                _l.apply(void 0, [_s.sent()]).toBe(true);
                _m = expect;
                return [4 /*yield*/, cards()];
            case 32:
                _m.apply(void 0, [_s.sent()]).toEqual(__spreadArray(__spreadArray([], before.filter(function (title) { return title !== 'Other 49'; }), true), ['Other 50'], false).sort());
                return [4 /*yield*/, again.unmount()];
            case 33:
                _s.sent();
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
    var agents, pane, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                agents = { a1: 'completed' };
                world(on, { agents: agents, kinds: { a1: 'general-purpose' } });
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
                agents.a1 = 'running';
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
                _d.apply(void 0, [(_x = (_3.sent())) === null || _x === void 0 ? void 0 : _x.text]).toBe('This chat is 22% full');
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'model-a1')];
            case 19:
                _e.apply(void 0, [(_y = (_3.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('Opus 5.5');
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^ · \d+% full/ })];
            case 20:
                _f.apply(void 0, [(_z = (_3.sent())) === null || _z === void 0 ? void 0 : _z.text]).toBe(' · 61% full · 0s');
                // Work with no to-dos has a whole purple edge
                _g = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 21:
                // Work with no to-dos has a whole purple edge
                _g.apply(void 0, [(_3.sent()).filter(function (b) { return String(b.props.backgroundColor).startsWith('#8A63F0'); }).map(function (b) { return b.props.backgroundColor; })]).toEqual(['#8A63F0']);
                // A helper's row says its model and its time, in that order, never a count of tokens
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' })];
            case 22:
                // A helper's row says its model and its time, in that order, never a count of tokens
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
                _m.apply(void 0, [(_0 = (_3.sent())) === null || _0 === void 0 ? void 0 : _0.text]).toBe('Opus 5.5 · 0s');
                return [4 /*yield*/, wide.unmount()
                    // The narrowest panel drops the model too, so the helper's name keeps its room
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
test("a card's title, its line of facts and every line under them start at one left edge, on a desktop and in a terminal, at work, asking (the question's outline at that edge) and finished", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, clock, _a, _b, _c, chunk, e_3_1, call, insetOf, edges, expectOneEdge;
    var _this = this;
    var _d, e_3, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                agents = {};
                clock = world(on, { model: 'claude-opus-5-5-20261001', agents: agents, kinds: { a1: 'general-purpose', a2: 'general-purpose' } }).clock;
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
                    return type === 'Box' ? __spreadArray(__spreadArray([], own, true), insetOf(children.find(function (one) { var _a; return one && typeof one === 'object' && !/^outline-(top|left|right|bottom)$/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); }), surface), true) : own;
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
                expectOneEdge = function (lines_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([lines_1], args_1, true), void 0, function (lines, block) {
                        var _a, _b;
                        if (block === void 0) { block = -1; }
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge.
                                    // What waits for the person is an outlined block: its outline starts at that edge, and its words one cell inside the outline
                                    _a = expect;
                                    return [4 /*yield*/, edges('desktop')];
                                case 1:
                                    // A desktop moves every line in by the step a plain Button pads its label with; a terminal draws each at the card's edge.
                                    // What waits for the person is an outlined block: its outline starts at that edge, and its words one cell inside the outline
                                    _a.apply(void 0, [_c.sent()]).toEqual(Array.from({ length: lines }, function (_, n) { return 'xs'; }));
                                    _b = expect;
                                    return [4 /*yield*/, edges('terminal')];
                                case 2:
                                    _b.apply(void 0, [_c.sent()]).toEqual(Array.from({ length: lines }, function (_, n) { return ''; }));
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
                return [4 /*yield*/, expectOneEdge(5)
                    // Asking: the question's block takes the place of the line it wrote, between the step and the helper tree
                ];
            case 19:
                // At work: the title, the model's name that opens the choice of models, the step it is on, the line beside the dots, the helper tree
                _g.sent();
                // Asking: the question's block takes the place of the line it wrote, between the step and the helper tree
                return [4 /*yield*/, call('ask', { text: 'May I replace the nose?', choices: ['Approve', 'Refuse'] })];
            case 20:
                // Asking: the question's block takes the place of the line it wrote, between the step and the helper tree
                _g.sent();
                return [4 /*yield*/, expectOneEdge(5, 3)];
            case 21:
                _g.sent();
                return [4 /*yield*/, call('ask', { text: '' })
                    // Finished, in its pause: the facts are plain text, the line says it finished
                ];
            case 22:
                _g.sent();
                // Finished, in its pause: the facts are plain text, the line says it finished
                agents.a1 = agents.a2 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a2' })];
            case 23:
                _g.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Fixed.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 24:
                _g.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 25:
                _g.sent();
                return [4 /*yield*/, expectOneEdge(5)];
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
                _c.apply(void 0, [_j.sent()]).toContain("a safety check stopped it, so it doesn't continue on Opus 4.8");
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
                _e.apply(void 0, [(_k.sent()).map(function (one) { var _a, _b; return String((_b = (_a = one.props.children) !== null && _a !== void 0 ? _a : one.text) !== null && _b !== void 0 ? _b : ''); }).join('\n')]).toContain("Tasks don't run on this model");
                return [2 /*return*/];
        }
    });
}); });
test('the model a running work is on is pressed and another chosen: its next step runs on it, its card says so at once, and its chat and the work are told', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var talk, answered, agents, _a, appended, stepped, logged, step, pane, _b, offered, _c, _d, _e, _f, tab, _g, _h, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                talk = [{ role: 'user', text: 'Fix the nose on head A.', toolUses: [] }];
                answered = {};
                agents = {};
                _a = world(on, { model: 'claude-opus-5-5', talk: talk, answered: answered, agents: agents, kinds: { a1: 'general-purpose' } }), appended = _a.appended, stepped = _a.stepped, logged = _a.logged;
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
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-2', reason: 'answer', agentId: 'a1' })];
            case 26:
                _v.sent();
                _k = expect;
                return [4 /*yield*/, keyed(tab, 'model-a1')];
            case 27:
                _k.apply(void 0, [_v.sent()]).toBeUndefined();
                _l = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Delivered/ })];
            case 28:
                _l.apply(void 0, [(_u = (_v.sent())) === null || _u === void 0 ? void 0 : _u.text]).toMatch(/^Delivered · Fable 5\.2 · /);
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
// The gate at the hand-back: a task's result is its last word, so it is taken only once nothing of the task is left open or running
test('a result is handed in only with every to-do ticked or dropped, no helper of its own at work and no command of its own but a server running: it is refused each time, saying which and what to do; once through, the card is done with that result', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, files, call, result, hand, pane, TODOS, steps, _i, steps_1, _b, refusal, then, _c, _d, _, _e, _f, _g, _h, through, _j, _k, kept;
    var _this = this;
    var _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, kinds: { a1: 'general-purpose', a2: 'general-purpose' }, parents: { a2: 'a1' } }), clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _o.sent();
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                result = "The nose is fixed, and the site runs at http://localhost:3000. ".concat('The nostril is closed on both sides and the bridge matches the scan. '.repeat(8)).trim();
                hand = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, call('SubagentHandback', 'h', { message: result })];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Everything that holds a result back, at once: two to-dos, a helper at work, a command that ends by itself, and a server
                ];
            case 4:
                pane = _o.sent();
                // Everything that holds a result back, at once: two to-dos, a helper at work, a command that ends by itself, and a server
                return [4 /*yield*/, call('mcp__claudopus__todo', 't1', { item: 'Fit the nostril', state: 'doing' })];
            case 5:
                // Everything that holds a result back, at once: two to-dos, a helper at work, a command that ends by itself, and a server
                _o.sent();
                return [4 /*yield*/, call('mcp__claudopus__todo', 't2', { item: 'Compare the head with the scan' })];
            case 6:
                _o.sent();
                return [4 /*yield*/, call('Bash', 'fit', { command: 'python3 fit.py', description: 'Fit the nostril again', run_in_background: true })];
            case 7:
                _o.sent();
                return [4 /*yield*/, call('Bash', 'site', { command: 'npm run dev', description: 'Serve the site', run_in_background: true })];
            case 8:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the nose', prompt: 'go', parentAgentId: 'a1' })];
            case 9:
                _o.sent();
                TODOS = function (open) { return "Not handed in: ".concat(open, ". Tick it, drop it, or ask: tick each one that is done, drop each one that will not be done and say why in your result, and put what only the person can do or decide to them with the `ask` tool before you finish."); };
                steps = [
                    [TODOS('2 to-dos are still open: "Fit the nostril"; "Compare the head with the scan"'), function () { return call('mcp__claudopus__todo', 't3', { item: 'Fit the nostril', state: 'done' }); }],
                    [TODOS('a to-do is still open: "Compare the head with the scan"'), function () { return call('mcp__claudopus__todo', 't4', { item: 'Compare the head with the scan', state: 'dropped' }); }],
                    [
                        'Not handed in: a helper of yours is still at work: "Measure the nose". Its result comes to you as it ends: carry on with what needs nothing from it, or end your step until then. One you no longer need: tell it with SendMessage to hand in what it has now.',
                        function () { return ((agents.a2 = 'completed'), $.turn.complete({ answer: 'It is 41 mm.', durationMs: 1, isAborted: false, turnId: 'th', reason: 'answer', agentId: 'a2' })); },
                    ],
                    [
                        'Not handed in: a command of yours still runs: "Fit the nostril again". Hand in your result once it has ended, or stop it with TaskStop; only a server the person uses may stay, started with a description that begins with Serve and named in your result.',
                        function () { return call('TaskStop', 'k1', { task_id: 'bg-fit' }); },
                    ],
                ];
                _i = 0, steps_1 = steps;
                _o.label = 10;
            case 10:
                if (!(_i < steps_1.length)) return [3 /*break*/, 19];
                _b = steps_1[_i], refusal = _b[0], then = _b[1];
                _c = 0, _d = [1, 2];
                _o.label = 11;
            case 11:
                if (!(_c < _d.length)) return [3 /*break*/, 14];
                _ = _d[_c];
                _e = expect;
                return [4 /*yield*/, hand()];
            case 12:
                _e.apply(void 0, [(_o.sent()).deny]).toBe(refusal);
                _o.label = 13;
            case 13:
                _c++;
                return [3 /*break*/, 11];
            case 14:
                _f = expect;
                _g = [refusal.slice(0, 40)];
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 15:
                _g = _g.concat([_o.sent()]);
                _h = Boolean;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 16:
                _f.apply(void 0, [_g.concat([_h.apply(void 0, [_o.sent()])])]).toEqual([refusal.slice(0, 40), undefined, true]);
                return [4 /*yield*/, then()];
            case 17:
                _o.sent();
                _o.label = 18;
            case 18:
                _i++;
                return [3 /*break*/, 10];
            case 19: return [4 /*yield*/, hand()];
            case 20:
                through = _o.sent();
                expect([through.deny, (_l = through.result) === null || _l === void 0 ? void 0 : _l.success]).toEqual([undefined, true]);
                _j = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '◐ Delivered' })];
            case 21:
                _j.apply(void 0, [(_m = (_o.sent())) === null || _m === void 0 ? void 0 : _m.props.color]).toBe('#4C9AFF');
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 22:
                _k.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(10)];
            case 23:
                _o.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray([], files.keys(), true).find(function (key) { return /\/reports\/[^/]+\/report\.md$/.test(key); })];
                    }); }); })];
            case 24:
                kept = _o.sent();
                expect([kept === null || kept === void 0 ? void 0 : kept.replace(/^.*\/reports\/[^/]*?-(?=[a-z])/, ''), files.get(kept !== null && kept !== void 0 ? kept : '')]).toEqual(['fix-the-nose/report.md', "".concat(result, "\n")]);
                return [4 /*yield*/, pane.unmount()];
            case 25:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a card's edge and the line it ends with say its stage: purple at work, through a turn's end while a command or a helper of its own runs; amber only while something of its own waits for the person; green and ◐ Delivered with its result; no colour and Stopped; red and ✕ Failed with why; ended, it stays so among the cards, stopped and failed with Start again and Dismiss, until it is dismissed", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, titles, _i, titles_1, description, _a, _b, id, pane, under, textOf, AMBER, card, head, AT_WORK, _c, _d, id, _e, _f, _g, _h, id, _j, _k, _l, _m, _o, _p, id, _q, _r, _s, _t, _u, _v, _w, _x, offered, fold, _y, _z, ms, _0, _1, _2, _3, _4, _5, _6;
    var _this = this;
    var _7;
    return __generator(this, function (_8) {
        switch (_8.label) {
            case 0:
                agents = {};
                kinds = {};
                clock = world(on, { agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _8.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'four things', wait: false, origin: composer })];
            case 2:
                _8.sent();
                titles = ['Fit the nose', 'Check the ears', 'Draw the eyes', 'Draw the chin'];
                _i = 0, titles_1 = titles;
                _8.label = 3;
            case 3:
                if (!(_i < titles_1.length)) return [3 /*break*/, 6];
                description = titles_1[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: description, prompt: 'go' }))];
            case 4:
                _8.sent();
                _8.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                for (_a = 0, _b = ['a1', 'a2', 'a3', 'a4']; _a < _b.length; _a++) {
                    id = _b[_a];
                    kinds[id] = 'general-purpose';
                }
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                pane = _8.sent();
                under = function (node) { var _a; return (node && typeof node === 'object' ? __spreadArray([node], ((_a = node.children) !== null && _a !== void 0 ? _a : []).flatMap(under), true) : []); };
                textOf = function (node) { var _a; return ((_a = node.children) !== null && _a !== void 0 ? _a : []).filter(function (part) { return typeof part === 'string'; }).join(''); };
                AMBER = '#E5A50A';
                card = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var nodes, _a, edge, line, isAmber;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = under;
                                return [4 /*yield*/, pane.find({ type: 'Box', key: "todo-".concat(id) })];
                            case 1:
                                nodes = _a.apply(void 0, [_d.sent()]);
                                edge = nodes.find(function (one) { var _a; return one.type === 'Box' && ((_a = one.props) === null || _a === void 0 ? void 0 : _a.width) === 1; });
                                line = nodes.find(function (one) { return one.type === 'Text' && /^(◐ Delivered|✕ Failed|Stopped)/.test(textOf(one)); });
                                isAmber = nodes.some(function (one) { var _a, _b, _c; return [(_a = one.props) === null || _a === void 0 ? void 0 : _a.color, (_b = one.props) === null || _b === void 0 ? void 0 : _b.backgroundColor, (_c = one.props) === null || _c === void 0 ? void 0 : _c.borderColor].includes(AMBER); });
                                return [2 /*return*/, [(_b = edge === null || edge === void 0 ? void 0 : edge.props) === null || _b === void 0 ? void 0 : _b.backgroundColor, line ? textOf(line) : undefined, (_c = line === null || line === void 0 ? void 0 : line.props) === null || _c === void 0 ? void 0 : _c.color, isAmber]];
                        }
                    });
                }); };
                head = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: /working|waiting for you|^Nothing|^Just/ })];
                        case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text];
                    }
                }); }); };
                AT_WORK = ['#8A63F0', undefined, undefined, false];
                _c = 0, _d = ['a1', 'a2', 'a3', 'a4'];
                _8.label = 8;
            case 8:
                if (!(_c < _d.length)) return [3 /*break*/, 11];
                id = _d[_c];
                _e = expect;
                _f = [[id]];
                return [4 /*yield*/, card(id)];
            case 9:
                _e.apply(void 0, [__spreadArray.apply(void 0, _f.concat([(_8.sent()), true]))]).toEqual(__spreadArray([id], AT_WORK, true));
                _8.label = 10;
            case 10:
                _c++;
                return [3 /*break*/, 8];
            case 11: 
            // A turn's end is only a pause while a command of its own runs, or a helper of its own works, though Claude Code lists its run
            // as over: still purple, never amber
            return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: 'python3 fit.py', description: 'Run the fit', run_in_background: true })];
            case 12:
                // A turn's end is only a pause while a command of its own runs, or a helper of its own works, though Claude Code lists its run
                // as over: still purple, never amber
                _8.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Measure the ears', prompt: 'go', parentAgentId: 'a2' })];
            case 13:
                _8.sent();
                _g = 0, _h = ['a1', 'a2'];
                _8.label = 14;
            case 14:
                if (!(_g < _h.length)) return [3 /*break*/, 18];
                id = _h[_g];
                agents[id] = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting.', durationMs: 1, isAborted: false, turnId: "t-".concat(id), reason: 'answer', agentId: id })];
            case 15:
                _8.sent();
                _j = expect;
                _k = [[id]];
                return [4 /*yield*/, card(id)];
            case 16:
                _j.apply(void 0, [__spreadArray.apply(void 0, _k.concat([(_8.sent()), true]))]).toEqual(__spreadArray([id], AT_WORK, true));
                _8.label = 17;
            case 17:
                _g++;
                return [3 /*break*/, 14];
            case 18:
                _l = expect;
                return [4 /*yield*/, head()];
            case 19:
                _l.apply(void 0, [_8.sent()]).toBe('4 working');
                // Waiting for the person, with its question on its card: amber, and no other card is; answered, it is purple again
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a3', text: 'May I redraw the left eye?', choices: ['Approve', 'Not now'] })];
            case 20:
                // Waiting for the person, with its question on its card: amber, and no other card is; answered, it is purple again
                _8.sent();
                _m = expect;
                return [4 /*yield*/, card('a3')];
            case 21:
                _m.apply(void 0, [(_8.sent()).filter(function (_, n) { return n !== 1 && n !== 2; })]).toEqual([AMBER, true]);
                _o = 0, _p = ['a1', 'a2', 'a4'];
                _8.label = 22;
            case 22:
                if (!(_o < _p.length)) return [3 /*break*/, 25];
                id = _p[_o];
                _q = expect;
                _r = [[id]];
                return [4 /*yield*/, card(id)];
            case 23:
                _q.apply(void 0, [__spreadArray.apply(void 0, _r.concat([(_8.sent()), true]))]).toEqual(__spreadArray([id], AT_WORK, true));
                _8.label = 24;
            case 24:
                _o++;
                return [3 /*break*/, 22];
            case 25:
                _s = expect;
                return [4 /*yield*/, head()];
            case 26:
                _s.apply(void 0, [_8.sent()]).toBe('1 waiting for you · 3 working');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a3', text: '' })];
            case 27:
                _8.sent();
                _t = expect;
                return [4 /*yield*/, card('a3')];
            case 28:
                _t.apply(void 0, [_8.sent()]).toEqual(AT_WORK);
                // Done, by handing in its result: green
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h3', agentId: 'a3', message: 'Both eyes are drawn.' })];
            case 29:
                // Done, by handing in its result: green
                _8.sent();
                _u = expect;
                return [4 /*yield*/, card('a3')];
            case 30:
                _u.apply(void 0, [_8.sent()]).toEqual(['#4C9AFF', '◐ Delivered', '#4C9AFF', false]);
                // Stopped by the person: no colour on its edge, its line dim
                return [4 /*yield*/, pane.press({ key: 'stop-a2' })];
            case 31:
                // Stopped by the person: no colour on its edge, its line dim
                _8.sent();
                _v = expect;
                return [4 /*yield*/, card('a2')];
            case 32:
                _v.apply(void 0, [_8.sent()]).toEqual([undefined, 'Stopped', undefined, false]);
                _w = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 33:
                _w.apply(void 0, [(_7 = (_8.sent())) === null || _7 === void 0 ? void 0 : _7.props.dimColor]).toBe(true);
                // Failed: red, saying why
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't-a4', reason: 'error', agentId: 'a4' })];
            case 34:
                // Failed: red, saying why
                _8.sent();
                _x = expect;
                return [4 /*yield*/, card('a4')];
            case 35:
                _x.apply(void 0, [_8.sent()]).toEqual(['error', '✕ Failed · Ended with an error', 'error', false]);
                offered = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return new RegExp("^(stop|change|again-small|dismiss)-".concat(id, "(-\\d+)?$")).test(String(b.key)); }).map(function (b) { return b.props.label; })];
                    }
                }); }); };
                fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label];
                    }
                }); }); };
                _y = 0, _z = [2100, 3600000];
                _8.label = 36;
            case 36:
                if (!(_y < _z.length)) return [3 /*break*/, 45];
                ms = _z[_y];
                return [4 /*yield*/, clock.advance(ms)];
            case 37:
                _8.sent();
                _0 = expect;
                _1 = [ms];
                return [4 /*yield*/, card('a3')];
            case 38:
                _1 = _1.concat([_8.sent()]);
                return [4 /*yield*/, card('a2')];
            case 39:
                _1 = _1.concat([_8.sent()]);
                return [4 /*yield*/, card('a4')];
            case 40:
                _1 = _1.concat([_8.sent()]);
                return [4 /*yield*/, fold()];
            case 41:
                _0.apply(void 0, [_1.concat([_8.sent()])]).toEqual([ms, ['#4C9AFF', '◐ Delivered', '#4C9AFF', false], [undefined, 'Stopped', undefined, false], ['error', '✕ Failed · Ended with an error', 'error', false], undefined]);
                _2 = expect;
                _3 = [ms];
                return [4 /*yield*/, offered('a2')];
            case 42:
                _3 = _3.concat([_8.sent()]);
                return [4 /*yield*/, offered('a4')];
            case 43:
                _2.apply(void 0, [_3.concat([_8.sent()])]).toEqual([ms, ['Start again', 'Dismiss'], ['Start again', 'Dismiss']]);
                _8.label = 44;
            case 44:
                _y++;
                return [3 /*break*/, 36];
            case 45: 
            // Dismissed, each is under Finished and stays there, and the one not dismissed stays up
            return [4 /*yield*/, pressed(pane, 'dismiss-a4')];
            case 46:
                // Dismissed, each is under Finished and stays there, and the one not dismissed stays up
                _8.sent();
                return [4 /*yield*/, pressed(pane, 'dismiss-a2')];
            case 47:
                _8.sent();
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fold()];
                            case 1: return [2 /*return*/, ((_a.sent()) === '▸ Finished 2' ? true : undefined)];
                        }
                    }); }); })];
            case 48:
                _4.apply(void 0, [_8.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(3600000)];
            case 49:
                _8.sent();
                _5 = expect;
                return [4 /*yield*/, fold()];
            case 50:
                _6 = [_8.sent()];
                return [4 /*yield*/, card('a2')];
            case 51:
                _6 = _6.concat([(_8.sent())[1]]);
                return [4 /*yield*/, card('a4')];
            case 52:
                _6 = _6.concat([(_8.sent())[1]]);
                return [4 /*yield*/, card('a3')];
            case 53:
                _5.apply(void 0, [_6.concat([_8.sent()])]).toEqual(['▸ Finished 2', undefined, undefined, ['#4C9AFF', '◐ Delivered', '#4C9AFF', false]]);
                return [4 /*yield*/, pane.unmount()];
            case 54:
                _8.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the stop button of a to-do stops its work, and its card stays among the cards, plain, saying Stopped, with Start again and Dismiss, until it is dismissed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, stopped, clock, pane, titles, _b, _c, _d, _e, _f, offered, _g, fold, _h, _j, _k, _l;
    var _this = this;
    var _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                _a = world(on), stopped = _a.stopped, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _p.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })];
            case 5:
                _p.sent();
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
                _b.apply(void 0, [_p.sent()]).toEqual(['Fix the nose', 'Check the ears']);
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 7:
                _c.apply(void 0, [(_m = (_p.sent())) === null || _m === void 0 ? void 0 : _m.props.dimColor]).toBe(true);
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
            case 8:
                _d.apply(void 0, [_p.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(2100)];
            case 9:
                _p.sent();
                return [4 /*yield*/, clock.advance(3600000)];
            case 10:
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h2', agentId: 'a2', message: 'The ears match.' })];
            case 11:
                _p.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 12:
                _p.sent();
                _e = expect;
                return [4 /*yield*/, titles()];
            case 13:
                _e.apply(void 0, [_p.sent()]).toEqual(['Check the ears', 'Fix the nose']);
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Stopped' })];
            case 14:
                _f.apply(void 0, [(_o = (_p.sent())) === null || _o === void 0 ? void 0 : _o.props.dimColor]).toBe(true);
                offered = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return new RegExp("^(stop|change|again-small|dismiss)-".concat(id, "(-\\d+)?$")).test(String(b.key)); }).map(function (b) { return b.props.label; })];
                    }
                }); }); };
                _g = expect;
                return [4 /*yield*/, offered('a1')];
            case 15:
                _g.apply(void 0, [_p.sent()]).toEqual(['Start again', 'Dismiss']);
                // Dismissed, it is under Finished, and stays there
                return [4 /*yield*/, pressed(pane, 'dismiss-a1')];
            case 16:
                // Dismissed, it is under Finished, and stays there
                _p.sent();
                fold = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label];
                    }
                }); }); };
                _h = expect;
                return [4 /*yield*/, until(fold)];
            case 17:
                _h.apply(void 0, [_p.sent()]).toBe('▸ Finished 1');
                _j = expect;
                return [4 /*yield*/, titles()];
            case 18:
                _j.apply(void 0, [_p.sent()]).toEqual(['Check the ears']);
                return [4 /*yield*/, clock.advance(3600000)];
            case 19:
                _p.sent();
                _k = expect;
                return [4 /*yield*/, fold()];
            case 20:
                _l = [_p.sent()];
                return [4 /*yield*/, titles()];
            case 21:
                _k.apply(void 0, [_l.concat([_p.sent()])]).toEqual(['▸ Finished 1', ['Check the ears']]);
                return [4 /*yield*/, pane.unmount()];
            case 22:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test("work that finishes comes to the top, outlined for two seconds, and stays there over what works, the newest first, blue and Delivered, until the person marks it done: two at once, through an hour and another task's end, one ended while the panel was closed; delivered, its only presses are at its bottom, Give feedback and Mark as done; marked done, it is green where it stood for two seconds from the first drawing that shows it, with the happy octopus and the sound, its shape and presses kept, then under Finished; a message to it makes the same card work again, and delivered again when it hands in, what its last note left open listed on it with Reply", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, _a, clock, played, slowUntil, band, end, titles, fold, dones, offered, head, pane, _b, _c, _d, _e, _i, _f, ms, _g, _h, again, _j, _k, _l, _m, _o, _p, id, _q, _r, _s, _t, before, sounds, _u, greens, isHappyNow, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
    var _this = this;
    var _16, _17;
    return __generator(this, function (_18) {
        switch (_18.label) {
            case 0:
                agents = {};
                kinds = {};
                _a = world(on, { agents: agents, kinds: kinds, art: true }), clock = _a.clock, played = _a.played;
                slowUntil = 0;
                on('session.model', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(clock.now() < slowUntil)) return [3 /*break*/, 2];
                                return [4 /*yield*/, clock.advance(slowUntil - clock.now())];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, { value: 'claude-opus-5-5' }];
                        }
                    });
                }); });
                return [4 /*yield*/, $.session.start(start)
                    // (the bar above the prompt is drawn, which takes the box Message opens)
                ];
            case 1:
                _18.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 2:
                band = _18.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _18.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _18.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))];
            case 5:
                _18.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n0', agentId: 'a1', text: 'The nostril is closed on both sides.' })
                    // Its run over, as Claude Code lists it, and never pressed for a hand-back: its last words are its result, and it is done
                ];
            case 6:
                _18.sent();
                end = function (agentId, turnId) { return ((agents[agentId] = 'completed'), (kinds[agentId] = 'general-purpose'), $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: turnId, reason: 'answer', agentId: agentId })); };
                titles = function (of) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.bold && /nose|ears|eyes/.test(one.text); }).map(function (one) { return one.text; })];
                    }
                }); }); };
                fold = function (of) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return /Finished/.test(String(b.props.label)); })) === null || _a === void 0 ? void 0 : _a.props.label
                            // The cards drawn done: each line's colour, and each green edge
                        ];
                    }
                }); }); };
                dones = function (of) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Text', text: '◐ Delivered' })];
                        case 1:
                            _a = [(_b.sent()).map(function (one) { return one.props.color; })];
                            return [4 /*yield*/, of.findAll({ type: 'Box' })];
                        case 2: return [2 /*return*/, _a.concat([(_b.sent()).filter(function (b) { return b.props.width === 1 && b.props.backgroundColor === '#4C9AFF'; }).length])];
                    }
                }); }); };
                offered = function (of, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (b) { return new RegExp("^(stop|change|again-small|dismiss)-".concat(id, "(-\\d+)?$")).test(String(b.key)); }).map(function (b) { return b.props.label; })];
                    }
                }); }); };
                head = function (of) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, of.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return /working|waiting for you|^Nothing|^Just|delivered$/.test(one.text); }).map(function (one) { return one.text; }).join('')];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Two that end together both go to the top, blue, the newer first, over the one still working; neither is under Finished
                ];
            case 7:
                pane = _18.sent();
                // Two that end together both go to the top, blue, the newer first, over the one still working; neither is under Finished
                return [4 /*yield*/, clock.advance(400)];
            case 8:
                // Two that end together both go to the top, blue, the newer first, over the one still working; neither is under Finished
                _18.sent();
                return [4 /*yield*/, end('a1', 't1')];
            case 9:
                _18.sent();
                return [4 /*yield*/, clock.advance(100)];
            case 10:
                _18.sent();
                return [4 /*yield*/, end('a3', 't3')];
            case 11:
                _18.sent();
                _b = expect;
                return [4 /*yield*/, titles(pane)];
            case 12:
                _b.apply(void 0, [_18.sent()]).toEqual(['Draw the eyes', 'Fix the nose', 'Check the ears']);
                _c = expect;
                return [4 /*yield*/, dones(pane)];
            case 13:
                _c.apply(void 0, [_18.sent()]).toEqual([['#4C9AFF', '#4C9AFF'], 2]);
                _d = expect;
                return [4 /*yield*/, head(pane)];
            case 14:
                _d.apply(void 0, [_18.sent()]).toBe('1 working · 2 delivered');
                _e = expect;
                return [4 /*yield*/, fold(pane)];
            case 15:
                _e.apply(void 0, [_18.sent()]).toBeUndefined();
                _i = 0, _f = [2100, 3600000];
                _18.label = 16;
            case 16:
                if (!(_i < _f.length)) return [3 /*break*/, 22];
                ms = _f[_i];
                return [4 /*yield*/, clock.advance(ms)];
            case 17:
                _18.sent();
                _g = expect;
                _h = [ms];
                return [4 /*yield*/, titles(pane)];
            case 18:
                _h = _h.concat([_18.sent()]);
                return [4 /*yield*/, dones(pane)];
            case 19:
                _h = _h.concat([_18.sent()]);
                return [4 /*yield*/, fold(pane)];
            case 20:
                _g.apply(void 0, [_h.concat([_18.sent()])]).toEqual([ms, ['Draw the eyes', 'Fix the nose', 'Check the ears'], [['#4C9AFF', '#4C9AFF'], 2], undefined]);
                _18.label = 21;
            case 21:
                _i++;
                return [3 /*break*/, 16];
            case 22: 
            // Nor does another task's end, and work that ends while the panel is closed is up among the cards, green, when it opens
            return [4 /*yield*/, pane.unmount()];
            case 23:
                // Nor does another task's end, and work that ends while the panel is closed is up among the cards, green, when it opens
                _18.sent();
                return [4 /*yield*/, end('a2', 't2')];
            case 24:
                _18.sent();
                return [4 /*yield*/, clock.advance(2500)];
            case 25:
                _18.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 26:
                again = _18.sent();
                _j = expect;
                return [4 /*yield*/, titles(again)];
            case 27:
                _k = [_18.sent()];
                return [4 /*yield*/, dones(again)];
            case 28:
                _k = _k.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 29:
                _j.apply(void 0, [_k.concat([_18.sent()])]).toEqual([['Check the ears', 'Draw the eyes', 'Fix the nose'], [['#4C9AFF', '#4C9AFF', '#4C9AFF'], 3], undefined]);
                _l = expect;
                return [4 /*yield*/, head(again)];
            case 30:
                _l.apply(void 0, [_18.sent()]).toBe('3 delivered');
                // A delivered card's line is the last it wrote; its presses are Give feedback and Mark as done, at its bottom, and nothing
                // else: no Stop, no Start again, no Message or Dismiss beside its title
                _m = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: /^ · The nostril/ })];
            case 31:
                // A delivered card's line is the last it wrote; its presses are Give feedback and Mark as done, at its bottom, and nothing
                // else: no Stop, no Start again, no Message or Dismiss beside its title
                _m.apply(void 0, [(_16 = (_18.sent())) === null || _16 === void 0 ? void 0 : _16.text]).toBe(' · The nostril is closed on both sides.');
                _o = 0, _p = ['a1', 'a2', 'a3'];
                _18.label = 32;
            case 32:
                if (!(_o < _p.length)) return [3 /*break*/, 35];
                id = _p[_o];
                _q = expect;
                _r = [id];
                return [4 /*yield*/, offered(again, id)];
            case 33:
                _q.apply(void 0, [_r.concat([_18.sent()])]).toEqual([id, ['Give feedback', 'Mark as done']]);
                _18.label = 34;
            case 34:
                _o++;
                return [3 /*break*/, 32];
            case 35:
                _s = expect;
                return [4 /*yield*/, again.findAll({ type: 'Button' })];
            case 36:
                _s.apply(void 0, [(_18.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return label === 'Message' || label === 'Dismiss'; })]).toEqual([]);
                _t = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: /^Result ready/ })];
            case 37:
                _t.apply(void 0, [_18.sent()]).toBeUndefined();
                return [4 /*yield*/, titles(again)];
            case 38:
                before = _18.sent();
                sounds = played.length;
                return [4 /*yield*/, band.unmount()];
            case 39:
                _18.sent();
                slowUntil = clock.now() + 2100;
                return [4 /*yield*/, pressed(again, 'dismiss-a1')];
            case 40:
                _18.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (clock.now() >= slowUntil ? true : undefined)];
                    }); }); })];
            case 41:
                _u.apply(void 0, [_18.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 42:
                band = _18.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 43:
                _18.sent();
                return [4 /*yield*/, again.redraw()];
            case 44:
                _18.sent();
                greens = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, again.findAll({ type: 'Text', text: '✓ Done' })];
                        case 1:
                            _a = [(_b.sent()).map(function (one) { return one.props.color; })];
                            return [4 /*yield*/, again.findAll({ type: 'Box' })];
                        case 2: return [2 /*return*/, _a.concat([(_b.sent()).filter(function (b) { return b.key === 'outline-top' && b.props.backgroundColor === 'success'; }).length])];
                    }
                }); }); };
                isHappyNow = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, again.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (one) { return /<title>happy<\/title>/.test(String(one.props.source)); })
                            // Through its moment it keeps its delivered shape, its line one row and the row of its presses, but the presses themselves are gone
                            // at once, the choice made, so nothing moves under the pointer and a second click lands on nothing (19 Nov, the person: "As soon
                            // as I click a button, the buttons should immediately disappear")
                        ];
                    }
                }); }); };
                // Through its moment it keeps its delivered shape, its line one row and the row of its presses, but the presses themselves are gone
                // at once, the choice made, so nothing moves under the pointer and a second click lands on nothing (19 Nov, the person: "As soon
                // as I click a button, the buttons should immediately disappear")
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, greens()];
                            case 1: return [2 /*return*/, ((_a.sent())[1] ? titles(again) : undefined)];
                        }
                    }); }); })];
            case 45:
                _w = [_18.sent()];
                return [4 /*yield*/, greens()];
            case 46:
                _w = _w.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 47:
                _w = _w.concat([_18.sent()]);
                return [4 /*yield*/, offered(again, 'a1')];
            case 48:
                _w = _w.concat([_18.sent()]);
                return [4 /*yield*/, isHappyNow()];
            case 49:
                // Through its moment it keeps its delivered shape, its line one row and the row of its presses, but the presses themselves are gone
                // at once, the choice made, so nothing moves under the pointer and a second click lands on nothing (19 Nov, the person: "As soon
                // as I click a button, the buttons should immediately disappear")
                _v.apply(void 0, [_w.concat([_18.sent(), played.slice(sounds)])]).toEqual([before, [['success'], 1], undefined, [], true, ['sounds/ready.wav']]);
                _x = expect;
                return [4 /*yield*/, again.findAll({ type: 'Box' })];
            case 50:
                _x.apply(void 0, [(_18.sent()).filter(function (b) { return b.key === 'delivered-a1'; }).map(function (b) { return b.props.height; })]).toEqual([1]);
                return [4 /*yield*/, clock.advance(900)];
            case 51:
                _18.sent();
                _y = expect;
                return [4 /*yield*/, titles(again)];
            case 52:
                _z = [_18.sent()];
                return [4 /*yield*/, greens()];
            case 53:
                _z = _z.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 54:
                _z = _z.concat([_18.sent()]);
                return [4 /*yield*/, offered(again, 'a1')];
            case 55:
                _z = _z.concat([_18.sent()]);
                return [4 /*yield*/, band.find({ type: 'Text', text: /^↳ / })];
            case 56:
                _y.apply(void 0, [_z.concat([_18.sent(), played.slice(sounds)])]).toEqual([before, [['success'], 1], undefined, [], undefined, ['sounds/ready.wav']]);
                return [4 /*yield*/, clock.advance(200)];
            case 57:
                _18.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return fold(again); })];
            case 58:
                _0.apply(void 0, [_18.sent()]).toBe('▸ Finished 1');
                _1 = expect;
                return [4 /*yield*/, titles(again)];
            case 59:
                _1.apply(void 0, [_18.sent()]).toEqual(['Check the ears', 'Draw the eyes']);
                // (marked done, it is green there, with Message, and the header no longer counts it)
                _2 = expect;
                return [4 /*yield*/, head(again)];
            case 60:
                // (marked done, it is green there, with Message, and the header no longer counts it)
                _2.apply(void 0, [_18.sent()]).toBe('2 delivered');
                return [4 /*yield*/, pressed(again, 'finished-fold')];
            case 61:
                _18.sent();
                _3 = expect;
                return [4 /*yield*/, again.findAll({ type: 'Text', text: '✓ Done' })];
            case 62:
                _3.apply(void 0, [(_18.sent()).map(function (one) { return one.props.color; })]).toEqual(['success']);
                _4 = expect;
                return [4 /*yield*/, offered(again, 'a1')];
            case 63:
                _4.apply(void 0, [_18.sent()]).toEqual(['Message']);
                return [4 /*yield*/, pressed(again, 'finished-fold')];
            case 64:
                _18.sent();
                return [4 /*yield*/, clock.advance(3600000)];
            case 65:
                _18.sent();
                _5 = expect;
                return [4 /*yield*/, fold(again)];
            case 66:
                _6 = [_18.sent()];
                return [4 /*yield*/, titles(again)];
            case 67:
                _6 = _6.concat([_18.sent()]);
                return [4 /*yield*/, dones(again)];
            case 68:
                _5.apply(void 0, [_6.concat([_18.sent()])]).toEqual(['▸ Finished 1', ['Check the ears', 'Draw the eyes'], [['#4C9AFF', '#4C9AFF'], 2]]);
                // A message to a done task makes the same card work again, purple with its Stop and Message, and no second card; started again by
                // Claude Code under its id, it is still that one card
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a3', message: 'Shade the eyes too.' })];
            case 69:
                // A message to a done task makes the same card work again, purple with its Stop and Message, and no second card; started again by
                // Claude Code under its id, it is still that one card
                _18.sent();
                agents.a3 = 'running';
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'Shade the eyes too.', resume: { agentId: 'a3' } }))];
            case 70:
                _18.sent();
                _7 = expect;
                return [4 /*yield*/, titles(again)];
            case 71:
                _8 = [_18.sent()];
                return [4 /*yield*/, offered(again, 'a3')];
            case 72:
                _8 = _8.concat([_18.sent()]);
                return [4 /*yield*/, dones(again)];
            case 73:
                _8 = _8.concat([_18.sent()]);
                return [4 /*yield*/, head(again)];
            case 74:
                _8 = _8.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 75:
                _7.apply(void 0, [_8.concat([_18.sent()])]).toEqual([['Check the ears', 'Draw the eyes'], ['Stop', 'Message'], [['#4C9AFF'], 1], '1 working · 1 delivered', '▸ Finished 1']);
                // When it hands in it is done again: at the top for its two seconds, then among the cards as before, the dismissed one still
                // under Finished
                // (its last note lists what the result leaves open: numbered on the card with no press of their own, and the first press reads Reply)
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n3', agentId: 'a3', text: 'The eyes are shaded.', questions: ['Should the lashes be longer?', 'Which eye colour?'] })];
            case 76:
                // When it hands in it is done again: at the top for its two seconds, then among the cards as before, the dismissed one still
                // under Finished
                // (its last note lists what the result leaves open: numbered on the card with no press of their own, and the first press reads Reply)
                _18.sent();
                _9 = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: 'It asks 2 things' })];
            case 77:
                _9.apply(void 0, [_18.sent()]).toBeUndefined();
                agents.a3 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h3', agentId: 'a3', message: 'The eyes are shaded.' })];
            case 78:
                _18.sent();
                _10 = expect;
                return [4 /*yield*/, titles(again)];
            case 79:
                _11 = [_18.sent()];
                return [4 /*yield*/, offered(again, 'a3')];
            case 80:
                _11 = _11.concat([_18.sent()]);
                return [4 /*yield*/, dones(again)];
            case 81:
                _11 = _11.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 82:
                _10.apply(void 0, [_11.concat([_18.sent()])]).toEqual([['Draw the eyes', 'Check the ears'], ['Reply', 'Mark as done'], [['#4C9AFF', '#4C9AFF'], 2], '▸ Finished 1']);
                _12 = expect;
                return [4 /*yield*/, again.findAll({ type: 'Text' })];
            case 83:
                _12.apply(void 0, [(_18.sent()).map(function (one) { return one.text; }).filter(function (text) { return /^It asks|^\d\.$|\?$/.test(text); })]).toEqual(['It asks 2 things', '1.', 'Should the lashes be longer?', '2.', 'Which eye colour?']);
                // Reply opens the box above the chat, headed as a reply; a message sent puts it back to work with nothing left listed
                return [4 /*yield*/, pressed(again, 'change-a3')];
            case 84:
                // Reply opens the box above the chat, headed as a reply; a message sent puts it back to work with nothing left listed
                _18.sent();
                _13 = expect;
                return [4 /*yield*/, until(function () { return band.find({ type: 'Text', text: /^↳ / }); })];
            case 85:
                _13.apply(void 0, [(_17 = (_18.sent())) === null || _17 === void 0 ? void 0 : _17.text]).toBe('↳ Reply to “Draw the eyes”');
                return [4 /*yield*/, pressed(again, 'change-a3')];
            case 86:
                _18.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 87:
                _18.sent();
                _14 = expect;
                return [4 /*yield*/, titles(again)];
            case 88:
                _15 = [_18.sent()];
                return [4 /*yield*/, dones(again)];
            case 89:
                _15 = _15.concat([_18.sent()]);
                return [4 /*yield*/, fold(again)];
            case 90:
                _14.apply(void 0, [_15.concat([_18.sent()])]).toEqual([['Draw the eyes', 'Check the ears'], [['#4C9AFF', '#4C9AFF'], 2], '▸ Finished 1']);
                return [4 /*yield*/, again.unmount()];
            case 91:
                _18.sent();
                return [4 /*yield*/, band.unmount()];
            case 92:
                _18.sent();
                return [2 /*return*/];
        }
    });
}); });
// The world's `unresumable`: nothing sent to that agent is delivered, as for a run Claude Code no longer has
test('a message to a done task whose run is gone starts nothing and adds no card: once the list of what runs is read again its card is Done as before', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, resumed, pane, stands, _b, _i, _c, ms, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on, { agents: { a1: 'completed' }, kinds: { a1: 'general-purpose' }, unresumable: new Set(['a1']) }), clock = _a.clock, resumed = _a.resumed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h1', agentId: 'a1', message: 'The nose is fixed.' })];
            case 4:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                pane = _f.sent();
                return [4 /*yield*/, clock.advance(2100)
                    // How the list stands: its cards, the done ones, and whether the task has a Stop
                ];
            case 6:
                _f.sent();
                stands = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1:
                            _a = [(_c.sent()).filter(function (one) { return one.props.bold && /nose/.test(one.text); }).map(function (one) { return one.text; })];
                            return [4 /*yield*/, pane.findAll({ type: 'Text', text: '◐ Delivered' })];
                        case 2:
                            _a = _a.concat([(_c.sent()).map(function (one) { return one.props.color; })]);
                            _b = Boolean;
                            return [4 /*yield*/, pane.find({ type: 'Button', key: 'stop-a1' })];
                        case 3: return [2 /*return*/, _a.concat([_b.apply(void 0, [_c.sent()])])];
                    }
                }); }); };
                _b = expect;
                return [4 /*yield*/, stands()];
            case 7:
                _b.apply(void 0, [_f.sent()]).toEqual([['Fix the nose'], ['#4C9AFF'], false]);
                return [4 /*yield*/, $.prompt.submit({ text: 'Also close the left nostril.', wait: false, origin: composer })];
            case 8:
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 's1', to: 'a1', message: 'Sam: “Also close the left nostril.”' })
                    // At once, and once the list of what runs has been looked at again
                    // (the call itself went through, so until the list of what runs is next read the card is drawn at work; from then, and
                    // ten minutes on, it is Done as before)
                ];
            case 9:
                _f.sent();
                _i = 0, _c = [90000, 600000];
                _f.label = 10;
            case 10:
                if (!(_i < _c.length)) return [3 /*break*/, 14];
                ms = _c[_i];
                return [4 /*yield*/, clock.advance(ms)];
            case 11:
                _f.sent();
                _d = expect;
                _e = [[ms]];
                return [4 /*yield*/, stands()];
            case 12:
                _d.apply(void 0, [__spreadArray.apply(void 0, _e.concat([(_f.sent()), true]))]).toEqual([ms, ['Fix the nose'], ['#4C9AFF'], false]);
                _f.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 10];
            case 14:
                expect(resumed).toEqual([]);
                return [4 /*yield*/, pane.unmount()];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work the engine runs is listed even when the mod never saw it start, and work it lists as failed is failed on its card, in red, saying why', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, clock, pane, _a, _b, _c, failed, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                agents = { a7: 'running' };
                kinds = {};
                clock = world(on, { agents: agents, kinds: kinds }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _g.sent();
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Listed/ })];
            case 3:
                _a.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Listed by the engine');
                // A helper the mod never saw start is no to-do
                agents.h9 = 'running';
                kinds.h9 = 'general-purpose';
                return [4 /*yield*/, clock.advance(20000)];
            case 4:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /Listed/ })];
            case 5:
                _b.apply(void 0, [_g.sent()]).toHaveLength(1);
                // (a run only the list shows as over is given half a minute, as Claude Code may be about to start its next step)
                agents.a7 = 'failed';
                return [4 /*yield*/, clock.advance(20000)];
            case 6:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^✕ Failed/ })];
            case 7:
                _c.apply(void 0, [_g.sent()]).toBeUndefined();
                return [4 /*yield*/, clock.advance(40000)];
            case 8:
                _g.sent();
                return [4 /*yield*/, until(function () { return pane.find({ type: 'Text', text: /^✕ Failed/ }); })];
            case 9:
                failed = _g.sent();
                expect([failed === null || failed === void 0 ? void 0 : failed.text, failed === null || failed === void 0 ? void 0 : failed.props.color]).toEqual(['✕ Failed · Ended with an error', 'error']);
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^Nothing/ })];
            case 10:
                _d.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('Nothing waits for you');
                return [4 /*yield*/, pane.unmount()];
            case 11:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a helper and tasks that ended while the mod was out are ended on their cards from their saved record: the helper done with its words while its task works on, started again by nothing of Claudopus; a task done with the result its record says it handed in, or with its last words where Claude Code never pressed it for one, and failed, "Ended without its result", where it did; never drawn at work or warned about as stuck (16 Nov a second look that ended unheard was drawn at work for 47 minutes)', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, clock, files, resumed, appended, pane, _b, folder, row, handback, words, PRESS, over, saved, _c, _d, failed, _e, _f, _g;
    var _this = this;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents }), clock = _a.clock, files = _a.files, resumed = _a.resumed, appended = _a.appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Second look', prompt: 'go', parentAgentId: 'a1' })];
            case 3:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the eyes', prompt: 'draw the eyes' }))
                    // The work ends its step while its helper works: it is still at work
                ];
            case 5:
                _l.sent();
                // The work ends its step while its helper works: it is still at work
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on the second look.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 6:
                // The work ends its step while its helper works: it is still at work
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                pane = _l.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^3 working/ })];
            case 8:
                _b.apply(void 0, [(_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.text]).toBe('3 working');
                folder = "".concat(HOME, "/.claude/projects/-repo/engine-id/subagents");
                row = function (type, content) { return JSON.stringify({ timestamp: '2026-11-16T13:25:13Z', type: type, message: { role: type, content: content } }); };
                handback = function (text) { return row('assistant', [{ type: 'tool_use', name: 'SubagentHandback', input: { message: text } }]); };
                words = function (text) { return row('assistant', [{ type: 'text', text: text }]); };
                PRESS = row('user', '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.');
                over = function (id, description, spawnDepth) {
                    var rows = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        rows[_i - 3] = arguments[_i];
                    }
                    files.set("".concat(folder, "/agent-").concat(id, ".meta.json"), JSON.stringify(__assign({ description: description, spawnDepth: spawnDepth, finished: true }, (spawnDepth > 1 ? { parentAgentId: 'a1' } : {}))));
                    files.set("".concat(folder, "/agent-").concat(id, ".jsonl"), rows.join('\n'));
                };
                saved = function () {
                    var _a, _b, _c, _d;
                    var kept = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}');
                    return __spreadArray(__spreadArray(__spreadArray([], ((_b = kept.cards) !== null && _b !== void 0 ? _b : []), true), ((_c = kept.helpers) !== null && _c !== void 0 ? _c : []), true), ((_d = kept.ended) !== null && _d !== void 0 ? _d : []), true);
                };
                // The helper hands in its report while the mod is out: no end is heard, and the engine no longer lists it. It ends on its card
                // with its report
                over('a2', 'Second look', 2, handback('Nothing wrong found.'));
                return [4 /*yield*/, clock.advance(70000)];
            case 9:
                _l.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, saved().find(function (one) { return one.id === 'a2' && one.status === 'done'; })];
                    }); }); })];
            case 10:
                _c.apply(void 0, [_l.sent()]).toMatchObject({ answer: 'Nothing wrong found.' });
                // Its task works on: Claude Code gives it its helper's result itself, and nothing of Claudopus starts it again or tells it
                return [4 /*yield*/, clock.advance(2 * 60000)];
            case 11:
                // Its task works on: Claude Code gives it its helper's result itself, and nothing of Claudopus starts it again or tells it
                _l.sent();
                expect((_j = saved().find(function (one) { return one.id === 'a1'; })) === null || _j === void 0 ? void 0 : _j.status).toBe('working');
                expect(__spreadArray(__spreadArray([], resumed, true), appended, true).filter(function (line) { return line.startsWith('a1: '); })).toEqual([]);
                // Each task's own end while the mod is out, by what its record says: its result handed in; its last words, never pressed for a
                // hand-back; its last words, then Claude Code's press for a hand-back that never came
                over('a1', 'Fix the nose', 1, words('Checking the fix.'), handback('The fix is released.'));
                over('a3', 'Check the ears', 1, words('The ears match the scan.'));
                over('a4', 'Draw the eyes', 1, words('I have drawn the left eye so far.'), PRESS);
                return [4 /*yield*/, clock.advance(13 * 60000)];
            case 12:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (saved().some(function (one) { return one.status === 'working'; }) ? undefined : true)];
                    }); }); })];
            case 13:
                _d.apply(void 0, [_l.sent()]).toBe(true);
                expect(['a1', 'a3', 'a4'].map(function (id) { return saved().find(function (one) { return one.id === id; }); }).map(function (one) { return [one === null || one === void 0 ? void 0 : one.status, one === null || one === void 0 ? void 0 : one.answer, one === null || one === void 0 ? void 0 : one.why]; })).toEqual([
                    ['done', 'The fix is released.', undefined],
                    ['done', 'The ears match the scan.', undefined],
                    ['failed', 'I have drawn the left eye so far.', 'Ended without its result'],
                ]);
                return [4 /*yield*/, until(function () { return pane.find({ type: 'Text', text: /^✕ Failed/ }); })];
            case 14:
                failed = _l.sent();
                expect([failed === null || failed === void 0 ? void 0 : failed.text, failed === null || failed === void 0 ? void 0 : failed.props.color]).toEqual(['✕ Failed · Ended without its result', 'error']);
                _e = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 15:
                _e.apply(void 0, [(_l.sent()).filter(function (b) { return b.props.label === 'Start again'; }).map(function (b) { return String(b.key).replace(/-\d+$/, ''); })]).toEqual(['again-small-a4']);
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /delivered$/ })];
            case 16:
                _f.apply(void 0, [(_k = (_l.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('2 delivered');
                _g = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /No progress|quiet|Nothing new/ })];
            case 17:
                _g.apply(void 0, [_l.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 18:
                _l.sent();
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
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^1 working/ })];
            case 4:
                _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('1 working');
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
                _a.apply(void 0, [(_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe(' · The old line');
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /to-dos done ·/ })];
            case 6:
                _b.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Opus 5.5 · 1 of 1 to-dos done · 5m 00s');
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
    var agents, _a, clock, opened, helper, pane, lines, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, drawn, svgs, _p, narrow, _q, rails, _r, _s, inDetails, tab, _t, _u, _v, _w, _x;
    var _this = this;
    var _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                agents = {};
                _a = world(on, { agents: agents, kinds: { a3: 'general-purpose', a5: 'general-purpose' }, parents: { a3: 'a2', a5: 'a1' }, jobs: { output: function (file) { return (/m1/.test(file) ? 'bridge 12 mm\nnostril 9 mm\n' : ''); }, wroteAt: function () { return 1700000000000; } } }), clock = _a.clock, opened = _a.opened;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _9.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _9.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _9.sent();
                helper = function (description, parentAgentId) { return $.agent.spawn({ subagentType: 'general-purpose', background: true, description: description, prompt: 'go', parentAgentId: parentAgentId }); };
                return [4 /*yield*/, helper('Measure the nose', 'a1')];
            case 4:
                _9.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _9.sent();
                return [4 /*yield*/, helper('Read the manual', 'a2')];
            case 6:
                _9.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _9.sent();
                return [4 /*yield*/, helper('Read the appendix', 'a2')];
            case 8:
                _9.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _9.sent();
                return [4 /*yield*/, helper('Measure the ears', 'a1')];
            case 10:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'terminal' }))];
            case 11:
                pane = _9.sent();
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
                _b.apply(void 0, [_9.sent()]).toEqual(['├─┬─', '│ ├───', '│ └───', '└───']);
                // Only what the chat started is a card
                _c = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 13:
                // Only what the chat started is a card
                _c.apply(void 0, [(_9.sent()).filter(function (one) { return one.props.bold && /nose|ears|manual|appendix/.test(one.text); }).map(function (one) { return one.text; })]).toEqual(['Fix the nose']);
                // Each says its time beside its name, after its model and context once those are known, and has no dots
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text', text: /^\ds$/ })];
            case 14:
                // Each says its time beside its name, after its model and context once those are known, and has no dots
                _d.apply(void 0, [(_9.sent()).map(function (one) { return one.text; })]).toEqual(['3s', '3s', '2s', '1s', '0s']);
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a2')];
            case 15:
                _e.apply(void 0, [(_y = (_9.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('Measure the nose');
                // Each opens its own Details by its name, with no mark at its end
                _f = expect;
                return [4 /*yield*/, keyed(pane, 'go-list-a2')];
            case 16:
                // Each opens its own Details by its name, with no mark at its end
                _f.apply(void 0, [_9.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(pane, 'open-list-a4')];
            case 17:
                _9.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a4') || undefined];
                    }); }); })];
            case 18:
                _g.apply(void 0, [_9.sent()]).toBe(true);
                // A helper that ended leaves the tree after its pause; one that still has a helper at work stays to hold it
                agents.a3 = agents.a5 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Read.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a3' })];
            case 19:
                _9.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Measured.', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a5' })];
            case 20:
                _9.sent();
                return [4 /*yield*/, clock.advance(2100)];
            case 21:
                _9.sent();
                _h = expect;
                return [4 /*yield*/, lines()];
            case 22:
                _h.apply(void 0, [_9.sent()]).toEqual(['├─┬─', '│ └───', '└───']);
                _j = expect;
                return [4 /*yield*/, keyed(pane, 'open-rest-a1')];
            case 23:
                _j.apply(void 0, [(_z = (_9.sent())) === null || _z === void 0 ? void 0 : _z.props.label]).toBe('2 helpers ended');
                _k = expect;
                return [4 /*yield*/, keyed(pane, 'go-rest-a1')];
            case 24:
                _k.apply(void 0, [_9.sent()]).toBeUndefined();
                return [4 /*yield*/, pressed(pane, 'open-rest-a1')];
            case 25:
                _9.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 26:
                _l.apply(void 0, [_9.sent()]).toBe(true);
                _m = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a3')];
            case 27:
                _m.apply(void 0, [_9.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, keyed(pane, 'open-list-a5')];
            case 28:
                _o.apply(void 0, [_9.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()
                    // Where the surface draws, each row's lines end in a dot in the colour of how it stands, and rows meet: a helper with its own
                    // has a line down from its dot, its last one turns to it in a curve past the line of the level above, and the closing row has a ring
                ];
            case 29:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 30:
                drawn = _9.sent();
                return [4 /*yield*/, drawn.findAll({ type: 'Svg' })];
            case 31:
                svgs = (_9.sent()).map(function (svg) { return ({ source: String(svg.props.source), alt: svg.props.alt }); }).filter(function (svg) { return svg.source.includes('stroke-opacity'); });
                expect(svgs.map(function (svg) { return svg.alt; })).toEqual(['Working', 'Working', 'Ended']);
                expect((_0 = svgs[0]) === null || _0 === void 0 ? void 0 : _0.source).toContain('d="M9 0V20M9 10H22M27 15V20"');
                expect((_1 = svgs[1]) === null || _1 === void 0 ? void 0 : _1.source).toContain('d="M9 0V20M27 0V5Q27 10 32 10H40"');
                expect((_2 = svgs[1]) === null || _2 === void 0 ? void 0 : _2.source).toContain('<circle cx="45" cy="10" r="3.5" fill="#8A63F0"/>');
                // A row at work has its slow ring round the dot; the closing row of those that ended is still
                expect((_3 = svgs[1]) === null || _3 === void 0 ? void 0 : _3.source).toContain('<animate attributeName="r" values="3.5;8" dur="2.4s" repeatCount="indefinite"/>');
                expect((_4 = svgs[2]) === null || _4 === void 0 ? void 0 : _4.source).not.toContain('<animate');
                expect((_5 = svgs[2]) === null || _5 === void 0 ? void 0 : _5.source).toContain('d="M9 0V5Q9 10 14 10H22"');
                expect((_6 = svgs[2]) === null || _6 === void 0 ? void 0 : _6.source).toContain('fill="none" stroke="#808080" stroke-width="1.5"/></svg>');
                // No row names a model, and none has the three dots: only the card itself does
                _p = expect;
                return [4 /*yield*/, drawn.findAll({ type: 'Svg' })];
            case 32:
                // No row names a model, and none has the three dots: only the card itself does
                _p.apply(void 0, [(_9.sent()).filter(function (svg) { return svg.props.alt === 'Working now'; })]).toHaveLength(1);
                return [4 /*yield*/, drawn.unmount()
                    // In the narrowest pane a name keeps the room a mark at the row's end once took, so this one is still whole
                ];
            case 33:
                _9.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 20 }), surface: 'desktop' }))];
            case 34:
                narrow = _9.sent();
                _q = expect;
                return [4 /*yield*/, keyed(narrow, 'open-list-a2')];
            case 35:
                _q.apply(void 0, [(_7 = (_9.sent())) === null || _7 === void 0 ? void 0 : _7.props.label]).toBe('Measure the nose');
                return [4 /*yield*/, narrow.unmount()
                    // A helper with helpers of its own and a line of what it does under its name: the line from its dot down to them runs on beside
                    // that line, as the line of the level above does (17 Nov it stopped there, so its rows hung from nothing), drawn and as text
                ];
            case 36:
                _9.sent();
                // A helper with helpers of its own and a line of what it does under its name: the line from its dot down to them runs on beside
                // that line, as the line of the level above does (17 Nov it stopped there, so its rows hung from nothing), drawn and as text
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'm1', agentId: 'a2', command: 'python3 measure.py', description: 'Size the bridge', run_in_background: true })
                    // (its output is read on the calm redraw)
                ];
            case 37:
                // A helper with helpers of its own and a line of what it does under its name: the line from its dot down to them runs on beside
                // that line, as the line of the level above does (17 Nov it stopped there, so its rows hung from nothing), drawn and as text
                _9.sent();
                // (its output is read on the calm redraw)
                return [4 /*yield*/, clock.advance(30000)];
            case 38:
                // (its output is read on the calm redraw)
                _9.sent();
                return [4 /*yield*/, clock.advance(30000)];
            case 39:
                _9.sent();
                rails = function (surface, requestId) { return __awaiter(_this, void 0, void 0, function () {
                    var view, boxes, inside, found;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign(__assign({}, LIST), (requestId ? { requestId: requestId } : {})), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: surface }))];
                            case 1:
                                view = _a.sent();
                                return [4 /*yield*/, view.findAll({ type: 'Box' })];
                            case 2:
                                boxes = _a.sent();
                                inside = function (node, type) { var _a; return (node.type === type ? node : ((_a = node.children) !== null && _a !== void 0 ? _a : []).map(function (kid) { return inside(kid, type); }).find(Boolean)); };
                                found = boxes
                                    .filter(function (box) { return /^(twig-rails-(list|details)-a2|tail-.+-\d+-rails)$/.test(String(box.key)); })
                                    .map(function (box) { var _a, _b, _c; return (surface === 'desktop' ? String((_a = inside(box, 'Svg')) === null || _a === void 0 ? void 0 : _a.props.source) : ((_c = (_b = inside(box, 'Text')) === null || _b === void 0 ? void 0 : _b.children) !== null && _c !== void 0 ? _c : []).join('')); });
                                return [4 /*yield*/, view.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, found];
                        }
                    });
                }); };
                _r = expect;
                return [4 /*yield*/, rails('desktop')];
            case 40:
                _r.apply(void 0, [(_9.sent()).map(function (svg) { var _a; return (_a = svg.match(/d="([^"]*)"/)) === null || _a === void 0 ? void 0 : _a[1]; })]).toEqual(['M9 0V20M27 0V20']);
                _s = expect;
                return [4 /*yield*/, rails('terminal')];
            case 41:
                _s.apply(void 0, [_9.sent()]).toEqual(['│ │  ']);
                return [4 /*yield*/, rails('desktop', 'work-a1')];
            case 42:
                inDetails = _9.sent();
                expect(inDetails.length).toBe(1);
                expect(inDetails.map(function (svg) { var _a; return (_a = svg.match(/d="([^"]*)"/)) === null || _a === void 0 ? void 0 : _a[1]; })).toEqual(inDetails.map(function () { return 'M9 0V20M27 0V20'; }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'terminal' }))];
            case 43:
                tab = _9.sent();
                _t = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: / helpers? working$/ })];
            case 44:
                _t.apply(void 0, [(_8 = (_9.sent())) === null || _8 === void 0 ? void 0 : _8.text]).toBe('1 command running · 2 of 4 helpers working');
                _u = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 45:
                _u.apply(void 0, [(_9.sent()).map(function (one) { return String(one.props.label); }).filter(function (text) { return /manual|appendix|Measure/.test(text); })]).toEqual(['Measure the nose', 'Read the manual', 'Read the appendix', 'Measure the ears']);
                // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
                _v = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Raster' })];
            case 46:
                // One at work has a dot at the end of its line, a ring growing out of it (cells the terminal repaints), one that finished a tick
                _v.apply(void 0, [(_9.sent()).filter(function (one) { return String(one.key).endsWith('-ring'); }).length]).toBe(2);
                _w = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Text', text: '✓' })];
            case 47:
                _w.apply(void 0, [(_9.sent()).length]).toBe(2);
                _x = expect;
                return [4 /*yield*/, keyed(tab, 'open-details-a3')];
            case 48:
                _x.apply(void 0, [_9.sent()]).toBeDefined();
                return [4 /*yield*/, tab.unmount()];
            case 49:
                _9.sent();
                return [2 /*return*/];
        }
    });
}); });
test('what a piece of work and its helpers have running is in its Details too, every job under the one that started it, and in a helper\'s own Details', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var tabs, call, _i, _a, n, texts, tab, rows, picked, shown, _b, list, _c, _d, helperTab, its, _e, after, buttons, ended, afterTexts, group, _f, _g, _h, _j, _k;
    var _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                tabs = world(on).tabs;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _u.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'run the site', wait: false, origin: composer })];
            case 2:
                _u.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'run the site' }))];
            case 3:
                _u.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Fetch the weights', prompt: 'go', parentAgentId: 'a1' })];
            case 4:
                _u.sent();
                call = function (agentId, id, command, description) {
                    return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: command, description: description, run_in_background: true });
                };
                return [4 /*yield*/, call('a1', 'b1', 'npm run dev', 'Serve the site')];
            case 5:
                _u.sent();
                _i = 0, _a = [1, 2, 3, 4, 5];
                _u.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                n = _a[_i];
                return [4 /*yield*/, call('a2', "d".concat(n), "curl -o w".concat(n, ".bin https://example.com/w").concat(n, ".bin"), "Download weights ".concat(n))
                    // (a run's name is a button, as a press opens its output)
                ];
            case 7:
                _u.sent();
                _u.label = 8;
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
                tab = _u.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 11:
                rows = (_u.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, texts(tab)];
            case 12:
                picked = (_u.sent()).filter(function (text) { return /^Serve the site|^Download weights/.test(text); });
                // the server on the work's own line, the helper's downloads a level under it
                expect(rows.filter(function (text) { return /^ *[├└]───$/.test(text); }).slice(0, 1)).toEqual(['├───']);
                expect(picked.sort()).toEqual(__spreadArray(__spreadArray([], [1, 2, 3, 4, 5].map(function (n) { return "Download weights ".concat(n); }), true), ['Serve the site'], false));
                return [4 /*yield*/, texts(tab)];
            case 13:
                shown = _u.sent();
                expect(shown.some(function (text) { return /more (running|jobs)/.test(text); })).toBe(false);
                _b = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Helpers and commands$/ })];
            case 14:
                _b.apply(void 0, [(_m = (_u.sent())) === null || _m === void 0 ? void 0 : _m.props.bold]).toBe(true);
                expect(shown).toContain('6 commands running · 1 helper working');
                return [4 /*yield*/, tab.unmount()
                    // The card on the list still folds the helper's jobs past JOBS_SHOWN into one row
                ];
            case 15:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 16:
                list = _u.sent();
                _c = expect;
                return [4 /*yield*/, texts(list)];
            case 17:
                _c.apply(void 0, [(_u.sent()).filter(function (text) { return /Download weights/.test(text); })]).toHaveLength(3);
                _d = expect;
                return [4 /*yield*/, texts(list)];
            case 18:
                _d.apply(void 0, [(_u.sent()).some(function (text) { return /^2 more commands/.test(text); })]).toBe(true);
                return [4 /*yield*/, list.unmount()
                    // The helper's own Details, with no helpers of its own, shows what it has running
                ];
            case 19:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 20:
                helperTab = _u.sent();
                return [4 /*yield*/, texts(helperTab)];
            case 21:
                its = _u.sent();
                _e = expect;
                return [4 /*yield*/, helperTab.find({ type: 'Text', text: /^Commands$/ })];
            case 22:
                _e.apply(void 0, [(_o = (_u.sent())) === null || _o === void 0 ? void 0 : _o.props.bold]).toBe(true);
                expect(its).toContain('5 commands running');
                expect(its.filter(function (text) { return /Download weights/.test(text); })).toHaveLength(5);
                expect(its.some(function (text) { return /Serve the site/.test(text); })).toBe(false);
                return [4 /*yield*/, helperTab.unmount()
                    // A command of the helper's that ends is a row under that helper, after what it still has running, named as it was while it ran
                    // and never by its shell line, with how it ended; a press opens its log in a tab of the panel (19 Nov: ended commands stood in
                    // a flat list under the task, some named "cd /Users/…; S=/private/tmp/…")
                ];
            case 23:
                _u.sent();
                // A command of the helper's that ends is a row under that helper, after what it still has running, named as it was while it ran
                // and never by its shell line, with how it ended; a press opens its log in a tab of the panel (19 Nov: ended commands stood in
                // a flat list under the task, some named "cd /Users/…; S=/private/tmp/…")
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'x1', agentId: 'a2', command: 'cd /repo/fits; S=/tmp/out python3 fit.py --all', run_in_background: true })];
            case 24:
                // A command of the helper's that ends is a row under that helper, after what it still has running, named as it was while it ran
                // and never by its shell line, with how it ended; a press opens its log in a tab of the panel (19 Nov: ended commands stood in
                // a flat list under the task, some named "cd /Users/…; S=/private/tmp/…")
                _u.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 'k1', agentId: 'a2', task_id: 'bg-x1' })];
            case 25:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 26:
                after = _u.sent();
                return [4 /*yield*/, after.findAll({ type: 'Button' })];
            case 27:
                buttons = (_u.sent()).map(function (one) { var _a; return ({ key: String((_a = one.key) !== null && _a !== void 0 ? _a : ''), label: String(one.props.label) }); });
                ended = buttons.findIndex(function (b) { return b.key.startsWith('ended-open-'); });
                expect((_p = buttons[ended]) === null || _p === void 0 ? void 0 : _p.label).toMatch(/^python3? fit\.py$/);
                expect(buttons.findIndex(function (b) { return b.label === 'Fetch the weights'; })).toBeLessThan(ended);
                expect(buttons.map(function (b) { return b.label; }).lastIndexOf('Download weights 5')).toBeLessThan(ended);
                expect(buttons.findIndex(function (b) { return b.label === 'Serve the site'; })).toBeLessThan(buttons.findIndex(function (b) { return b.label === 'Fetch the weights'; }));
                return [4 /*yield*/, texts(after)];
            case 28:
                afterTexts = _u.sent();
                expect(afterTexts.some(function (text) { return /^Stopped after \d+s$/.test(text); })).toBe(true);
                expect(afterTexts).toContain('6 commands running · 1 helper working');
                expect(afterTexts).not.toContain('Commands ended');
                group = buttons.find(function (b) { return b.label === '1 command ended'; });
                expect(group).toBeDefined();
                expect(buttons.indexOf(group)).toBe(ended - 1);
                return [4 /*yield*/, after.press({ key: (_r = (_q = buttons[ended]) === null || _q === void 0 ? void 0 : _q.key) !== null && _r !== void 0 ? _r : '' })];
            case 29:
                _u.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (one) { return /^log-bg-x1: python3? fit\.py$/.test(one); })];
                    }); }); })];
            case 30:
                _f.apply(void 0, [_u.sent()]).toBeDefined();
                _h = (_g = after).press;
                _l = {};
                return [4 /*yield*/, after.findAll({ type: 'Button' })];
            case 31: 
            // A press on that row folds them away, and it then says it can show them
            return [4 /*yield*/, _h.apply(_g, [(_l.key = (_t = (_s = (_u.sent()).find(function (b) { return b.props.label === '1 command ended'; })) === null || _s === void 0 ? void 0 : _s.key) !== null && _t !== void 0 ? _t : '', _l)])];
            case 32:
                // A press on that row folds them away, and it then says it can show them
                _u.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, after.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === '1 command ended · show'; })];
                        }
                    }); }); })];
            case 33:
                _j.apply(void 0, [_u.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, after.findAll({ type: 'Button' })];
            case 34:
                _k.apply(void 0, [(_u.sent()).some(function (b) { var _a; return String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('ended-open-'); })]).toBe(false);
                return [4 /*yield*/, after.unmount()];
            case 35:
                _u.sent();
                return [2 /*return*/];
        }
    });
}); });
test('long work keeps only its newest ended helpers, and none of work that was forgotten', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, kinds, parents, clock, n, tab, _a, names;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                agents = {};
                kinds = {};
                parents = {};
                clock = world(on, { agents: agents, kinds: kinds, parents: parents }).clock;
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
                return [4 /*yield*/, clock.advance(10)
                    // (each run over, as Claude Code lists it)
                ];
            case 6:
                _c.sent();
                // (each run over, as Claude Code lists it)
                if (n <= 105)
                    ((agents["a".concat(n)] = 'completed'), (kinds["a".concat(n)] = 'general-purpose'), (parents["a".concat(n)] = 'a1'));
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
    var output, wroteAt, _a, clock, stopped, appended, now, advance, texts, _b, shown, _c, _d, _e, plain, _f, _g, _h, _j, _k, _l, _m, list, stop, _o, _p, _q;
    var _this = this;
    var _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                output = '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n\r  5 1024M    5 51.2M    0     0  10.2M      0  0:01:40  0:00:05  0:01:35 10.5M\r 45 1024M   45  460M    0     0  10.2M      0  0:01:40  0:00:45  0:00:55 10.5M';
                wroteAt = 0;
                _a = world(on, { jobs: { output: function () { return output; }, wroteAt: function () { return wroteAt; } } }), clock = _a.clock, stopped = _a.stopped, appended = _a.appended;
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
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fetch the scans', wait: false, origin: composer })];
            case 2:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fetch the scans', prompt: 'fetch the scans' }))];
            case 3:
                _s.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true })];
            case 4:
                _s.sent();
                wroteAt = now;
                return [4 /*yield*/, advance(20000)
                    // (written a second before the end of the step, whenever in it the panel looks)
                ];
            case 5:
                _s.sent();
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 6:
                _s.sent();
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
                _b.apply(void 0, [_s.sent()]).toBe(true);
                return [4 /*yield*/, texts()];
            case 8:
                shown = _s.sent();
                expect(shown).toContain('45%');
                expect(shown).toContain(' · 10.5 MB/s · 55s left');
                // While it gives word nothing is said of when
                expect(shown.some(function (text) { return /active|ago/.test(text); })).toBe(false);
                // In a narrower panel its speed gives way first
                _c = expect;
                return [4 /*yield*/, texts(100)];
            case 9:
                // In a narrower panel its speed gives way first
                _c.apply(void 0, [(_s.sent()).some(function (text) { return /^460 MB(\/| of )1 GB · $/.test(text); })]).toBe(true);
                // The work's own line, as its scripts are told to print it
                output = 'loading\nprogress: 3/6 steps fitting\nframe 12 done\n';
                wroteAt = now;
                return [4 /*yield*/, advance(20000)];
            case 10:
                _s.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text.startsWith('3 of 6 steps · '); }) || undefined)];
                        }
                    }); }); })];
            case 11:
                _d.apply(void 0, [_s.sent()]).toBe(true);
                // Quiet for long, in words
                wroteAt = now - 15 * 60000;
                return [4 /*yield*/, advance(20000)];
            case 12:
                _s.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /^Last: .* · nothing new for 1[5-9]m/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 13:
                _e.apply(void 0, [_s.sent()]).toBe(true);
                // A raw line in plain words, with its log time and state code left out, then its sign of life; 16 Nov the row read
                // "35 MB · [run 11:27:50] waiting for the machine to start (Running)"
                output = 'starting\n[run 11:27:50] waiting for the machine to start (Running)\n';
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 14:
                _s.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /(^| · )waiting for the machine to start$/.test(text); })];
                        }
                    }); }); })];
            case 15:
                plain = _s.sent();
                expect(plain).toBeDefined();
                _f = expect;
                return [4 /*yield*/, texts()];
            case 16:
                _f.apply(void 0, [(_s.sent()).some(function (text) { return /\[run|Running\)|\d MB ·/.test(text); })]).toBe(false);
                // A count that is full while the command still runs never reads 100%, as done: it says it is still running, and nothing more
                // (19 Nov "7 of 7 heads · 100% · started, finishing", from a script that counted the heads it had started)
                output = 'progress: 7/7 heads started, finishing\n';
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 17:
                _s.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 of 7 heads · still running$/.test(text); })];
                        }
                    }); }); })];
            case 18:
                _g.apply(void 0, [_s.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, texts()];
            case 19:
                _h.apply(void 0, [(_s.sent()).some(function (text) { return /100%/.test(text); })]).toBe(false);
                // A wait's count of tries is how far it is, its words that say its name again are left out, and when it last tried changes
                output = 'progress: 6 tries waiting for the CT scans\nprogress: 7 tries waiting for the CT scans\n';
                // (written a second before the end of the step, whenever in it the panel looks)
                wroteAt = now + 19000;
                return [4 /*yield*/, advance(20000)];
            case 20:
                _s.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 tries$/.test(text); })];
                        }
                    }); }); })];
            case 21:
                _j.apply(void 0, [_s.sent()]).toBeDefined();
                // Quiet for a minute or two it says nothing of it: tests, builds and installs go that quiet and are fine
                wroteAt = now - 100000;
                return [4 /*yield*/, advance(20000)];
            case 22:
                _s.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^7 tries$/.test(text); })];
                        }
                    }); }); })];
            case 23:
                _k.apply(void 0, [_s.sent()]).toBeDefined();
                _l = expect;
                return [4 /*yield*/, texts()];
            case 24:
                _l.apply(void 0, [(_s.sent()).some(function (text) { return /nothing new/.test(text); })]).toBe(false);
                // Silent for three minutes it says so, plainly, and Stop on its row stops it as Claude Code tracks it and tells the work it was stuck
                wroteAt = now - 185000;
                return [4 /*yield*/, advance(20000)];
            case 25:
                _s.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^Last: 7 tries · nothing new for 3m [1-3]0s( · Claude was told to check it)?$/.test(text); })];
                        }
                    }); }); })];
            case 26:
                _m.apply(void 0, [_s.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 27:
                list = _s.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 28:
                stop = (_s.sent()).find(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); });
                expect(stop).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_r = stop === null || stop === void 0 ? void 0 : stop.key) !== null && _r !== void 0 ? _r : '' })];
            case 29:
                _s.sent();
                return [4 /*yield*/, list.unmount()];
            case 30:
                _s.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, stopped.includes('bg-n1') || undefined];
                    }); }); })];
            case 31:
                _o.apply(void 0, [_s.sent()]).toBe(true);
                // (quiet three minutes, it is told it looked stuck)
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (line) { return /^a1: .*stopped your command "Fetch the CT scans" from the panel because it looked stuck: it had printed nothing for 3m/.test(line); })];
                    }); }); })];
            case 32:
                // (quiet three minutes, it is told it looked stuck)
                _p.apply(void 0, [_s.sent()]).toBeDefined();
                return [4 /*yield*/, advance(5000)
                    // (its row goes)
                ];
            case 33:
                _s.sent();
                // (its row goes)
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).every(function (text) { return !/^Fetch the CT scans/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 34:
                // (its row goes)
                _q.apply(void 0, [_s.sent()]).toBe(true);
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
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true })];
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
                expect(quiet.some(function (text) { return /nothing new|No output/.test(text); })).toBe(false);
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
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'a1', command: 'curl -L -o scans.zip https://example.com/scans.zip', description: 'Fetch the CT scans', run_in_background: true })];
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
                expect(shown.some(function (text) { return /^No output yet · started \d+m ago( · Claude was told to check it)?$/.test(text); })).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('nothing a task or its helper starts may only wait held open, pass time or wait for helpers anywhere, detach what it starts or only follow a log: each is refused in one sentence; a wait for something far away sent to the background is a watch, a row on its card; and as a command of its own ends, its card\'s line stays the work\'s own words, never a line of commands that ended (16 Nov an upload read 100% beside "about 40% done"; 18 Nov "Run: …: ended" stood in place of the task\'s note; a helper polled for a file its own script wrote)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var TASKS, isEnded, _a, clock, appended, resumed, stopped, run, _b, HELD, TIME, HELPERS, DETACH, FOLLOW, O, POLL, cases, told, _i, cases_1, _c, agentId, tool, command, isBackground, refusal, id, deny, line, rows, n, _d, _e, _f, _g, _h, _j, _k, n, _l, _m, _o, _p;
    var _this = this;
    var _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                TASKS = '/tmp/claude-501/x/s1/tasks';
                isEnded = false;
                _a = world(on, { agents: { a1: 'running' }, jobs: { output: function (file) { return (file === "".concat(TASKS, "/bg-u1.output") ? "progress: 8/8 GB uploading\n".concat(isEnded ? '\n[exited with code 0]\n' : '') : ''); }, wroteAt: function () { return 1700000000000; } } }), clock = _a.clock, appended = _a.appended, resumed = _a.resumed, stopped = _a.stopped;
                on('session.cwd', function () { return ({ value: '/repo' }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'upload the zips', wait: false, origin: composer })];
            case 2:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Upload the zips', prompt: 'upload the zips' }))];
            case 3:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Loaders for every open head set', prompt: 'load', parentAgentId: 'a1' }))];
            case 4:
                _r.sent();
                run = function (agentId_1, id_1, tool_1, command_1, description_1) {
                    var args_1 = [];
                    for (var _i = 5; _i < arguments.length; _i++) {
                        args_1[_i - 5] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([agentId_1, id_1, tool_1, command_1, description_1], args_1, true), void 0, function (agentId, id, tool, command, description, isBackground) {
                        if (isBackground === void 0) { isBackground = false; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: agentId, command: command, description: description }, (isBackground ? { run_in_background: true } : {})))];
                                case 1: return [2 /*return*/, (_a.sent()).deny
                                    // (a bracketed time in a description, as descriptions once carried, is never shown)
                                ];
                            }
                        });
                    });
                };
                // (a bracketed time in a description, as descriptions once carried, is never shown)
                _b = expect;
                return [4 /*yield*/, run('a1', 'u1', 'Bash', 'curl -T zips.zip https://example.com/up', 'Upload both zips to the folder (about 15 min)', true)];
            case 5:
                // (a bracketed time in a description, as descriptions once carried, is never shown)
                _b.apply(void 0, [_r.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'The upload is about 40% done; it should finish in about 15 minutes.' })];
            case 6:
                _r.sent();
                return [4 /*yield*/, clock.advance(20000)];
            case 7:
                _r.sent();
                HELD = 'Not run: this command only waits, and held open it keeps you from everything else. Send the same call again with `run_in_background: true`';
                TIME = 'Not run: this command only passes time, and nothing you start may wait by the clock.';
                HELPERS = "Not run: this command only waits for your helpers. Each helper's result comes to you as a message, even after you end your step";
                DETACH = 'Not run: this command detaches what it starts (nohup, setsid, disown or a trailing &), so nothing would show it on your card or tell you when it ends. Send the command itself, without those, with `run_in_background: true`.';
                FOLLOW = 'Not run: this only follows a log and would never end';
                O = '/private/tmp/claude-501/x/tasks';
                POLL = 'for i in $(seq 1 55); do kill -0 48213 2>/dev/null || break; echo "progress: $i/55 tries waiting for the upload"; sleep 10; done; grep -E "ERROR|Copied" /w/upload.log | tail -5';
                cases = [
                    // held open, a wait keeps the task from everything else, whatever it waits for and whatever shape its loop takes
                    ['a1', 'Bash', POLL, false, HELD],
                    ['a1', 'Bash', "until ! pgrep -f 'curl -T zips.zip' >/dev/null; do echo \"progress: 1 tries\"; sleep 10; done", false, HELD],
                    ['a2', 'Bash', "n=0; until grep -q \"Counter\" ".concat(O, "/b1it4kmrm.output; do n=$((n+1)); echo \"progress: $n tries waiting for fit timing\"; sleep 8; [ $n -gt 60 ] && break; done; cat ").concat(O, "/b1it4kmrm.output | tail -12"), false, HELD],
                    ['a2', 'Bash', 'until curl -s localhost:3000 >/dev/null; do echo "progress: 1 tries"; sleep 2; done', false, HELD],
                    // by the clock, or for its helpers, nothing waits, in the background either
                    ['a1', 'Bash', 'sleep 300; cat out.log', false, TIME],
                    ['a2', 'Bash', 'sleep 300; cat out.log', true, TIME],
                    ['a1', 'Bash', "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", false, HELPERS],
                    ['a1', 'Bash', "'/x/mods/claudopus/bin/helpers' '/x/helpers/a1.txt'", true, HELPERS],
                    // nothing is detached from Claude Code's sight: under nohup, or sent off with a trailing &
                    ['a1', 'Bash', 'cd /w && nohup curl -T rest.zip https://example.com/up > rest.log 2>&1 & echo $!', false, DETACH],
                    ['a2', 'Bash', 'python3 sets.py > sets.log 2>&1 &', false, DETACH],
                    // a tail that follows a log never ends and tells the work nothing
                    ['a1', 'Bash', 'tail -f /w/upload.log | grep --line-buffered ERROR', true, FOLLOW],
                    // a look once, a sifter beside the upload, and a helper's real work run
                    ['a1', 'Bash', 'tail -5 /w/upload.log', false, ''],
                    ['a1', 'Bash', 'ugrep --line-buffered wrote', true, ''],
                    ['a2', 'Bash', 'cd /w && python sets.py', false, ''],
                    // and a wait for something far away is a watch: the same command in the background, or a Monitor
                    ['a1', 'Bash', 'until curl -sf https://example.com/up/done >/dev/null; do echo "progress: 1 tries"; sleep 20; done', true, ''],
                    ['a1', 'Monitor', 'until az batch job show --job-id fit --query state -o tsv | grep -q completed; do sleep 30; done', false, ''],
                ];
                told = [];
                _i = 0, cases_1 = cases;
                _r.label = 8;
            case 8:
                if (!(_i < cases_1.length)) return [3 /*break*/, 11];
                _c = cases_1[_i], agentId = _c[0], tool = _c[1], command = _c[2], isBackground = _c[3], refusal = _c[4];
                id = tool === 'Monitor' ? 'm1' : command.startsWith('ugrep') ? 'g1' : command.startsWith('until curl -sf') ? 'w1' : 'x';
                return [4 /*yield*/, run(agentId, id, tool, command, tool === 'Monitor' ? 'Watch the Azure fit' : command.startsWith('until curl -sf') ? 'Watch for the upload to be listed' : 'Run it', isBackground)];
            case 9:
                deny = (_q = (_r.sent())) !== null && _q !== void 0 ? _q : '';
                told.push([command, deny.slice(0, refusal.length || 40)]);
                _r.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                expect(told).toEqual(cases.map(function (_a) {
                    var command = _a[2], refusal = _a[4];
                    return [command, refusal];
                }));
                line = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, texts, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
                            case 1:
                                list = _c.sent();
                                _a = [[]];
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 3:
                                texts = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                return [4 /*yield*/, list.unmount()];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, texts];
                        }
                    });
                }); };
                return [4 /*yield*/, line()];
            case 12:
                rows = _r.sent();
                expect(rows.filter(function (text) { return /^Watch\b/.test(text); }).sort()).toEqual(['Watch for the upload to be listed', 'Watch the Azure fit']);
                expect(rows.some(function (text) { return /\(about|of about|\bover$/.test(text); })).toBe(false);
                expect(rows.some(function (text) { return /about 40% done/.test(text); })).toBe(true);
                // The upload ends, by the engine's last line on its output: its row goes at once, and the card keeps the work's own words,
                // never "…: ended". Nothing of Claudopus starts the task again or tells it so: Claude Code starts its next step itself
                isEnded = true;
                n = 0;
                _r.label = 13;
            case 13:
                if (!(n < 3)) return [3 /*break*/, 16];
                return [4 /*yield*/, clock.advance(20000)];
            case 14:
                _r.sent();
                _r.label = 15;
            case 15:
                n++;
                return [3 /*break*/, 13];
            case 16:
                _d = expect;
                _e = ['its row goes'];
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, line()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /^Upload both zips/.test(text); }) ? undefined : true)];
                        }
                    }); }); })];
            case 17:
                _d.apply(void 0, [_e.concat([_r.sent()])]).toEqual(['its row goes', true]);
                _f = expect;
                return [4 /*yield*/, line()];
            case 18:
                _f.apply(void 0, [(_r.sent()).some(function (text) { return /: ended$/.test(text !== null && text !== void 0 ? text : ''); })]).toBe(false);
                _g = expect;
                return [4 /*yield*/, line()];
            case 19:
                _g.apply(void 0, [(_r.sent()).some(function (text) { return /about 40% done/.test(text); })]).toBe(true);
                expect(__spreadArray(__spreadArray([], appended, true), resumed, true).filter(function (one) { return /has ended/.test(one); })).toEqual([]);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n2', agentId: 'a1', text: 'Both zips are in the folder; I am checking them.' })];
            case 20:
                _r.sent();
                _h = expect;
                _j = ['its new line'];
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, line()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text === 'Both zips are in the folder; I am checking them.'; }) || undefined)];
                        }
                    }); }); })];
            case 21:
                _h.apply(void 0, [_j.concat([_r.sent()])]).toEqual(['its new line', true]);
                _k = expect;
                return [4 /*yield*/, line()];
            case 22:
                _k.apply(void 0, [(_r.sent()).some(function (text) { return /about 40% done/.test(text !== null && text !== void 0 ? text : ''); })]).toBe(false);
                // The sifter outlived what it read, once the helper has ended too: stopped a minute on, and the work told why, once. The
                // watches, which look for something far away, are left
                return [4 /*yield*/, $.turn.complete({ answer: 'The loaders are written.', durationMs: 1, isAborted: false, turnId: 'th', reason: 'answer', agentId: 'a2' })];
            case 23:
                // The sifter outlived what it read, once the helper has ended too: stopped a minute on, and the work told why, once. The
                // watches, which look for something far away, are left
                _r.sent();
                n = 0;
                _r.label = 24;
            case 24:
                if (!(n < 3)) return [3 /*break*/, 27];
                return [4 /*yield*/, clock.advance(20000)];
            case 25:
                _r.sent();
                _r.label = 26;
            case 26:
                n++;
                return [3 /*break*/, 24];
            case 27:
                _l = expect;
                _m = ['the sifter is stopped'];
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, stopped.includes('bg-g1') || undefined];
                    }); }); })];
            case 28:
                _l.apply(void 0, [_m.concat([_r.sent()])]).toEqual(['the sifter is stopped', true]);
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return /^a1: Your command ".*" was stopped: it only read the output of commands that have all ended\./.test(one); })];
                    }); }); })];
            case 29:
                _o.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(60000)];
            case 30:
                _r.sent();
                expect(appended.filter(function (one) { return /it only read the output of commands/.test(one); })).toHaveLength(1);
                expect(stopped).toEqual(['bg-g1']);
                _p = expect;
                return [4 /*yield*/, line()];
            case 31:
                _p.apply(void 0, [(_r.sent()).filter(function (text) { return /^Watch\b/.test(text); })]).toHaveLength(2);
                return [2 /*return*/];
        }
    });
}); });
test('every run under a card says how it stands: a command that printed nothing says so, a watch its last event, silent, whether it is still busy or idle, and a press on its name opens its log in a tab of the panel; 15 Nov rows said only "updated 9m ago"', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, TASKS, outputs, wrote, use, _a, clock, opened, tabs, advance, n, texts, shown, _b, _c, list, before, _d, logTab, logTexts, _e, after;
    var _f, _g;
    var _this = this;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                now = 1700000000000;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                outputs = (_f = {}, _f["".concat(TASKS, "/bg-r1.output")] = function () { return ''; }, _f["".concat(TASKS, "/mon-m1.output")] = function () { return 'series arrived\nwrote vsd-02.png\n'; }, _f);
                wrote = (_g = {}, _g["".concat(TASKS, "/bg-r1.output")] = function () { return 1700000000000; }, _g["".concat(TASKS, "/mon-m1.output")] = function () { return now - 30000; }, _g);
                _a = world(on, { jobs: { output: function (file) { var _a, _b; return (_b = (_a = outputs[file]) === null || _a === void 0 ? void 0 : _a.call(outputs)) !== null && _b !== void 0 ? _b : ''; }, wroteAt: function (file) { var _a, _b; return (_b = (_a = wrote[file]) === null || _a === void 0 ? void 0 : _a.call(wrote)) !== null && _b !== void 0 ? _b : 0; }, live: function (file) { return (file.endsWith('bg-r1.output') ? use : undefined); } } }), clock = _a.clock, opened = _a.shown, tabs = _a.tabs;
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
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw and fetch', wait: false, origin: composer })];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw and fetch', prompt: 'go' }))
                    // A script that sends all it prints to files of its own, and a watch, the work's own words for each
                ];
            case 3:
                _l.sent();
                // A script that sends all it prints to files of its own, and a watch, the work's own words for each
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r1', agentId: 'a1', command: 'bash /s/round3b_figs.sh', description: 'Redraw all pictures (about 1 min)', run_in_background: true })];
            case 4:
                // A script that sends all it prints to files of its own, and a watch, the work's own words for each
                _l.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', tool_use_id: 'm1', agentId: 'a1', command: 'tail -n0 -F sheet.log', description: 'Azure jobs finishing' })];
            case 5:
                _l.sent();
                n = 0;
                _l.label = 6;
            case 6:
                if (!(n < 15)) return [3 /*break*/, 9];
                return [4 /*yield*/, advance(20000)];
            case 7:
                _l.sent();
                _l.label = 8;
            case 8:
                n++;
                return [3 /*break*/, 6];
            case 9:
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
                                    return [2 /*return*/, all.some(function (text) { return /^No output yet/.test(text); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 10:
                shown = (_h = (_l.sent())) !== null && _h !== void 0 ? _h : [];
                // The script that printed nothing says so and for how long, never that it was updated; its row has how long it has run, and
                // nothing of the time its description gave, well past it
                expect(shown.some(function (text) { return /^Command · Redraw all pictures$/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /^No output yet · started \d+m ago( · Claude was told to check it)?$/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /updated/.test(text); })).toBe(false);
                expect(shown.filter(function (text) { return text === '5m 00s'; }).length).toBeGreaterThan(1);
                expect(shown.some(function (text) { return /\(about|of about|\bover$/.test(text); })).toBe(false);
                // The watch, its last event and when it came
                expect(shown.some(function (text) { return /^Watch · Azure jobs finishing/.test(text); })).toBe(true);
                expect(shown.some(function (text) { return /^Watching( · last: |$)/.test(text); })).toBe(true);
                // its event's file name is never shown
                expect(shown.some(function (text) { return /vsd-02/.test(text); })).toBe(false);
                // Silent, its row says whether the programs that hold its log open still use the processor: still busy, quietly, or idle, in amber
                use = 40;
                return [4 /*yield*/, advance(25000)];
            case 11:
                _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^No output yet · started \d+m ago · still busy$/.test(text); })];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                use = 0;
                return [4 /*yield*/, advance(25000)];
            case 13:
                _l.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return /^No output yet · started \d+m ago · idle$/.test(text); })];
                        }
                    }); }); })];
            case 14:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                // A press on a run's name opens its log in a tab of the panel, named after it: what it is, how it stands, and the end of what
                // it wrote as it wrote it, without colour codes (19 Nov: the log opened in the Terminal app, outside the panel)
                outputs["".concat(TASKS, "/bg-r1.output")] = function () { return 'stage: drawing figure 3\n\x1b[32mprogress: 3/9 figures drawing\x1b[0m\n'; };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))];
            case 15:
                list = _l.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 16:
                before = (_k = (_j = (_l.sent()).find(function (b) { return b.props.label === 'Command · Redraw all pictures'; })) === null || _j === void 0 ? void 0 : _j.key) !== null && _k !== void 0 ? _k : '';
                return [4 /*yield*/, list.press({ key: before })];
            case 17:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (one) { return one === 'log-bg-r1: Redraw all pictures'; })];
                    }); }); })];
            case 18:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                expect(opened.some(function (one) { return String(one[1]).endsWith('/output.command'); })).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'log-bg-r1', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'desktop' }))];
            case 19:
                logTab = _l.sent();
                return [4 /*yield*/, logTab.findAll({ type: 'Text' })];
            case 20:
                logTexts = (_l.sent()).map(function (one) { return one.text; });
                expect(logTexts).toContain('Redraw all pictures');
                expect(logTexts.some(function (text) { return /^Running · \d+m \d\ds · of the task “Redraw and fetch”$/.test(text); })).toBe(true);
                expect(logTexts).toContain('stage: drawing figure 3');
                expect(logTexts).toContain('progress: 3/9 figures drawing');
                _e = expect;
                return [4 /*yield*/, logTab.findAll({ type: 'Button' })];
            case 21:
                _e.apply(void 0, [(_l.sent()).map(function (one) { return String(one.props.label); })]).toEqual(['Stop', 'Details', 'Open in Terminal']);
                return [4 /*yield*/, logTab.unmount()
                    // and moves the buttons' keys, so the panel is not pulled back to the row it pressed
                ];
            case 22:
                _l.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (b) { return b.props.label === 'Command · Redraw all pictures' && b.key !== before; })) === null || _a === void 0 ? void 0 : _a.key];
                        }
                    }); }); })];
            case 23:
                after = _l.sent();
                expect(after).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 24:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a command is named in plain words by a small model, asked in the background: its kind and title lead its row, what it does now is its second line, and why it failed is under its row in Details and in its log; the same command run again is named with no call, and no key in its log is sent; 19 Nov rows read "Run: score" and "Running"', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, born, TASKS, MIN, outputs, NAMES, _a, clock, completed, advance, bg, CLOUD, texts, shown, naming, n, _b, n, details, log, logTexts, asked, n, _c;
    var _d;
    var _this = this;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                now = 1700000000000;
                born = now;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                MIN = 60000;
                outputs = (_d = {},
                    _d["".concat(TASKS, "/bg-c1.output")] = function () { return (now - born >= 2 * MIN ? 'job v13-films3 submitted with key sk-ant-api03-abcdefghijklmnop\nwaiting for the machine\n' : ''); },
                    _d["".concat(TASKS, "/bg-c2.output")] = function () { return ''; },
                    _d["".concat(TASKS, "/bg-s1.output")] = function () { return (now - born >= 3 * MIN ? 'loading 47 films\nTraceback (most recent call last):\nRuntimeError: CUDA out of memory\n\n[exited with code 1]\n' : 'loading 47 films\n'); },
                    _d);
                NAMES = 'You name commands';
                _a = world(on, {
                    jobs: { output: function (file) { var _a, _b; return (_b = (_a = outputs[file]) === null || _a === void 0 ? void 0 : _a.call(outputs)) !== null && _b !== void 0 ? _b : ''; }, wroteAt: function () { return now - 2000; } },
                    complete: function (e) {
                        var _a;
                        if (!((_a = e.system) === null || _a === void 0 ? void 0 : _a.includes(NAMES)))
                            return undefined;
                        if (e.prompt.includes('score.py'))
                            return JSON.stringify({ title: 'Score smoothed heads against the 47 test films', kind: 'test', now: '', why: e.prompt.includes('State: failed') ? 'Ran out of graphics memory while loading the films' : '' });
                        if (e.prompt.includes('v13-films3'))
                            return JSON.stringify({ title: 'Smooth the last quarter of the films', kind: 'cloud job', now: e.prompt.includes('waiting for the machine') ? 'Waiting for the cloud machine to start' : '' });
                        return undefined;
                    },
                }), clock = _a.clock, completed = _a.completed;
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
                _g.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'smooth the heads', wait: false, origin: composer })];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Smooth the skin of the 3D heads', prompt: 'go' }))];
            case 3:
                _g.sent();
                bg = function (id, command, description) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: command, description: description, run_in_background: true }); };
                CLOUD = 'cd /repo/video-free && ../azure-jobs/run --name v13-films3 -- "bash batch.sh v13_3.txt v13" 2>&1 | grep --line-buffered run';
                return [4 /*yield*/, bg('c1', CLOUD, 'Run: films, last quarter, with the finished lump step')];
            case 4:
                _g.sent();
                return [4 /*yield*/, bg('s1', 'python3 score.py --films 47', 'Run: score')];
            case 5:
                _g.sent();
                texts = function () {
                    var args_1 = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args_1[_i] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (requestId) {
                        var pane, all, _a, _b;
                        if (requestId === void 0) { requestId = 'claudopus'; }
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: requestId, props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))];
                                case 1:
                                    pane = _c.sent();
                                    _a = [[]];
                                    return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                                case 2:
                                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                                    return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                                case 3:
                                    all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                                    return [4 /*yield*/, pane.unmount()];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/, all];
                            }
                        });
                    });
                };
                // Each row leads with its kind in words and its title, as the model said them, in place of the task's own label
                return [4 /*yield*/, advance(20000)];
            case 6:
                // Each row leads with its kind in words and its title, as the model said them, in place of the task's own label
                _g.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, texts()];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.includes('Cloud job · Smooth the last quarter of the films') && all.includes('Test · Score smoothed heads against the 47 test films') ? all : undefined];
                            }
                        });
                    }); })];
            case 7:
                shown = (_e = (_g.sent())) !== null && _e !== void 0 ? _e : [];
                expect(shown.some(function (text) { return /^Run: (score|films)/.test(text); })).toBe(false);
                naming = function () { return completed.filter(function (e) { var _a; return (_a = e.system) === null || _a === void 0 ? void 0 : _a.includes(NAMES); }); };
                expect(naming().length).toBeGreaterThan(0);
                expect(naming().every(function (e) { return e.model === 'claude-haiku-5-5'; })).toBe(true);
                n = 0;
                _g.label = 8;
            case 8:
                if (!(n < 6)) return [3 /*break*/, 11];
                return [4 /*yield*/, advance(20000)];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                n++;
                return [3 /*break*/, 8];
            case 11:
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return text === 'Waiting for the cloud machine to start'; })];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                // and the key its log named was never sent
                expect(naming().some(function (e) { return e.prompt.includes('sk-ant-api03'); })).toBe(false);
                expect(naming().some(function (e) { return e.prompt.includes('waiting for the machine'); })).toBe(true);
                n = 0;
                _g.label = 13;
            case 13:
                if (!(n < 4)) return [3 /*break*/, 16];
                return [4 /*yield*/, advance(20000)];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15:
                n++;
                return [3 /*break*/, 13];
            case 16: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                    var all;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts('work-a1')];
                            case 1:
                                all = _a.sent();
                                return [2 /*return*/, all.includes('Ran out of graphics memory while loading the films') ? all : undefined];
                        }
                    });
                }); })];
            case 17:
                details = (_f = (_g.sent())) !== null && _f !== void 0 ? _f : [];
                expect(details).toContain('Score smoothed heads against the 47 test films');
                expect(details.some(function (text) { return /^Failed after \dm \d\ds$/.test(text); })).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'log-bg-s1', props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'desktop' }))];
            case 18:
                log = _g.sent();
                return [4 /*yield*/, log.findAll({ type: 'Text' })];
            case 19:
                logTexts = (_g.sent()).map(function (one) { return one.text; });
                return [4 /*yield*/, log.unmount()];
            case 20:
                _g.sent();
                expect(logTexts).toContain('Score smoothed heads against the 47 test films');
                expect(logTexts.some(function (text) { return /^Failed after \dm \d\ds · \d+s ago · Ran out of graphics memory while loading the films$/.test(text); })).toBe(true);
                asked = naming().length;
                return [4 /*yield*/, bg('c2', CLOUD, 'Run: films, last quarter, with the finished lump step')];
            case 21:
                _g.sent();
                n = 0;
                _g.label = 22;
            case 22:
                if (!(n < 3)) return [3 /*break*/, 25];
                return [4 /*yield*/, advance(20000)
                    // (the two alike are one row, which says so)
                ];
            case 23:
                _g.sent();
                _g.label = 24;
            case 24:
                n++;
                return [3 /*break*/, 22];
            case 25:
                // (the two alike are one row, which says so)
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return text === 'Cloud job · Smooth the last quarter of the films ×2'; })];
                        }
                    }); }); })];
            case 26:
                // (the two alike are one row, which says so)
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                expect(naming().length).toBe(asked);
                return [2 /*return*/];
        }
    });
}); });
test('where the small model gives no answer, a command keeps the name its task gave it, and the model is not asked again for a while', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, _a, clock, completed, advance, texts, naming, _b, _c, n, _d, n, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                now = 1700000000000;
                _a = world(on, { jobs: { output: function () { return ''; }, wroteAt: function () { return now - 2000; } }, complete: function (e) { var _a; return (((_a = e.system) === null || _a === void 0 ? void 0 : _a.includes('You name commands')) ? null : undefined); } }), clock = _a.clock, completed = _a.completed;
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
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'redraw', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Redraw', prompt: 'go' }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r1', agentId: 'a1', command: 'bash /s/round3b_figs.sh', description: 'Redraw all pictures', run_in_background: true })];
            case 4:
                _f.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () {
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
                                return [2 /*return*/, all];
                        }
                    });
                }); };
                naming = function () { return completed.filter(function (e) { var _a; return (_a = e.system) === null || _a === void 0 ? void 0 : _a.includes('You name commands'); }); };
                return [4 /*yield*/, advance(20000)];
            case 5:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (naming().length ? true : undefined)];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (text) { return text === 'Command · Redraw all pictures'; })];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                // A second command within minutes of the model's error is not asked about
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'r2', agentId: 'a1', command: 'bash /s/fetch.sh', description: 'Download the scans', run_in_background: true })];
            case 8:
                // A second command within minutes of the model's error is not asked about
                _f.sent();
                n = 0;
                _f.label = 9;
            case 9:
                if (!(n < 6)) return [3 /*break*/, 12];
                return [4 /*yield*/, advance(20000)];
            case 10:
                _f.sent();
                _f.label = 11;
            case 11:
                n++;
                return [3 /*break*/, 9];
            case 12:
                expect(naming()).toHaveLength(1);
                _d = expect;
                return [4 /*yield*/, texts()];
            case 13:
                _d.apply(void 0, [(_f.sent()).some(function (text) { return /^Download the scans$/.test(text); })]).toBe(true);
                n = 0;
                _f.label = 14;
            case 14:
                if (!(n < 12)) return [3 /*break*/, 17];
                return [4 /*yield*/, advance(20000)];
            case 15:
                _f.sent();
                _f.label = 16;
            case 16:
                n++;
                return [3 /*break*/, 14];
            case 17:
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (naming().length > 1 ? true : undefined)];
                    }); }); })];
            case 18:
                _e.apply(void 0, [_f.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('only runs really running are listed: a watch the engine killed at its time limit, a command that failed and one that finished leave at once, counted on the closing row and told apart in Details; 15 Nov three "[killed]" watches stayed with their clocks running', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, born, TASKS, MIN, outputs, clock, advance, watch, bg, texts, n, _a, n, shown, pane, details, _b, _c, n, later;
    var _d;
    var _this = this;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                now = 1700000000000;
                born = now;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                MIN = 60000;
                outputs = (_d = {},
                    _d["".concat(TASKS, "/mon-m1.output")] = function () { return (now - born >= 30 * MIN ? '\n[killed]\n' : ''); },
                    _d["".concat(TASKS, "/mon-m2.output")] = function () { return (now - born >= 30 * MIN ? '\n[killed]\n' : ''); },
                    _d["".concat(TASKS, "/bg-w1.output")] = function () { return ''; },
                    _d["".concat(TASKS, "/bg-f1.output")] = function () { return (now - born >= 3 * MIN ? 'Traceback: boom\n\n[exited with code 1]\n' : ''); },
                    _d["".concat(TASKS, "/bg-k1.output")] = function () { return (now - born >= 2 * MIN ? 'all good\n\n[exited with code 0]\n' : ''); },
                    // one past the time its description gave that prints how long it has left, and one that does not
                    _d["".concat(TASKS, "/bg-p1.output")] = function () { return 'progress: 3/6 steps fitting eta 4m\n'; },
                    _d["".concat(TASKS, "/bg-p2.output")] = function () { return 'drawing frames\n'; },
                    _d);
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
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'save the videos', wait: false, origin: composer })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Save the videos', prompt: 'go' }))];
            case 3:
                _f.sent();
                watch = function (id) { return $.tool.call({ tool: 'Monitor', tool_use_id: id, agentId: 'a1', command: 'tail -f /s/screen.log | grep --line-buffered "pass 1 done"', description: 'Wait for first screening pass (about 35 min)', timeout_ms: 3000000, persistent: false }); };
                return [4 /*yield*/, watch('m1')];
            case 4:
                _f.sent();
                return [4 /*yield*/, watch('m2')];
            case 5:
                _f.sent();
                bg = function (id, command, description) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: command, description: description, run_in_background: true }); };
                return [4 /*yield*/, bg('w1', 'python3 screen.py --details', 'Wait for the details screening to finish (about 55 min)')];
            case 6:
                _f.sent();
                return [4 /*yield*/, bg('f1', 'python3 fetch.py', 'Run the fetch of the list')];
            case 7:
                _f.sent();
                return [4 /*yield*/, bg('k1', 'python3 tidy.py', 'Run the tidy up')];
            case 8:
                _f.sent();
                return [4 /*yield*/, bg('p1', 'python3 fit.py', 'Run the fit (about 20 min)')];
            case 9:
                _f.sent();
                return [4 /*yield*/, bg('p2', 'python3 frames.py', 'Run the drawing of frames (about 20 min)')];
            case 10:
                _f.sent();
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
                _f.label = 11;
            case 11:
                if (!(n < 10)) return [3 /*break*/, 14];
                return [4 /*yield*/, advance(MIN)
                    // Before the limit both watches run, as one row of two
                ];
            case 12:
                _f.sent();
                _f.label = 13;
            case 13:
                n++;
                return [3 /*break*/, 11];
            case 14:
                // Before the limit both watches run, as one row of two
                _a = expect;
                return [4 /*yield*/, texts()];
            case 15:
                // Before the limit both watches run, as one row of two
                _a.apply(void 0, [(_f.sent()).some(function (text) { return /^Wait for first screening pass ×2$/.test(text); })]).toBe(true);
                n = 0;
                _f.label = 16;
            case 16:
                if (!(n < 39)) return [3 /*break*/, 19];
                return [4 /*yield*/, advance(MIN)];
            case 17:
                _f.sent();
                _f.label = 18;
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
                shown = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : [];
                // The watches the engine killed at their limit, the failed and the finished command are gone from the tree, and no clock runs for them
                expect(shown.some(function (text) { return /\[killed\]/.test(text); })).toBe(false);
                expect(shown.some(function (text) { return /^(Wait for first screening pass ×2|Run the tidy up)$/.test(text); })).toBe(false);
                // The one that failed has no row of its own among what still runs and is not named: the closing row counts it, and which one
                // is in Details (19 Nov: a row for it lingered long after it failed)
                expect(shown).not.toContain('Run the fetch of the list');
                expect(shown.some(function (text) { return /^Failed after /.test(text); })).toBe(false);
                expect(shown).not.toContain('Traceback: boom');
                // (the card's own line never names the commands that ended: how each ended is in Details, 18 Nov)
                expect(shown.some(function (text) { return /^Run the (tidy up|fetch of the list): (done|failed)/.test(text); })).toBe(false);
                // The closing row counts them and says, in words, how many did not finish well
                // (counts only: which one is in Details)
                expect(shown).toContain('4 commands ended · 1 failed, 2 ran out of time');
                // The wait still running stays, and the two fits: each row with how long it has run and nothing of the time its description
                // gave, within it or long past it
                expect(shown).toContain('Wait for the details screening to finish');
                expect(shown.filter(function (text) { return text === '49m 00s'; })).toHaveLength(4);
                expect(shown.some(function (text) { return /of about|\bover$|\(about|\d+ min\b/.test(text); })).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 160 }), surface: 'terminal' }))
                    // (an ended command's name is a button where what it wrote is still there: a press opens it, as a running one's does)
                ];
            case 21:
                pane = _f.sent();
                _b = [[]];
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 22:
                _c = [__spreadArray.apply(void 0, _b.concat([(_f.sent()).map(function (one) { return one.text; }), true]))];
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 23:
                details = __spreadArray.apply(void 0, _c.concat([(_f.sent()).filter(function (one) { var _a; return String((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('ended-open-'); }).map(function (one) { return String(one.props.label); }), true]));
                return [4 /*yield*/, pane.unmount()
                    // (each a row of the tree under Commands, with what still runs: no list of its own)
                ];
            case 24:
                _f.sent();
                // (each a row of the tree under Commands, with what still runs: no list of its own)
                expect(details).not.toContain('Commands ended');
                expect(details).toContain('3 commands running · 1 failed');
                expect(details.filter(function (text) { return text === 'Wait for first screening pass'; }).length).toBe(2);
                expect(details.filter(function (text) { return /^Ran out of time after (29|30)m \d\ds$/.test(text); }).length).toBe(2);
                expect(details.some(function (text) { return /^Failed after \dm \d\ds$/.test(text); })).toBe(true);
                // (why it failed is on its card's row and in its log, not said again here)
                expect(details).not.toContain('Traceback: boom');
                // (one that finished says only how long it ran)
                expect(details.some(function (text) { return /^\dm \d\ds$/.test(text); })).toBe(true);
                expect(details.some(function (text) { return /^Done in /.test(text); })).toBe(false);
                n = 0;
                _f.label = 25;
            case 25:
                if (!(n < 8)) return [3 /*break*/, 28];
                return [4 /*yield*/, advance(MIN)];
            case 26:
                _f.sent();
                _f.label = 27;
            case 27:
                n++;
                return [3 /*break*/, 25];
            case 28: return [4 /*yield*/, texts()];
            case 29:
                later = _f.sent();
                expect(later).toContain('57m 00s');
                expect(later.some(function (text) { return /of about|\bover$/.test(text); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test("a run's second line starts under its name, with the tree's lines carried down beside it: not the last, the last, a run under a helper, a narrow panel, on a desktop and in a terminal; 15 Nov the app dropped the lines and the line started left of the tree", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var now, TASKS, outputs, clock, advance, sent, n, kids, all, textOf, rows, _i, _a, columns, runs, seen, drawn, _b, _c, svg, _d, _e, _f, head, stand, lines, rails, pane, shown, narrow, tight;
    var _g;
    var _this = this;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                now = 1700000000000;
                TASKS = '/tmp/claude-501/x/s1/tasks';
                outputs = (_g = {}, _g["".concat(TASKS, "/bg-n1.output")] = 'loading\nprogress: 3/6 steps fitting\n', _g["".concat(TASKS, "/bg-n2.output")] = 'progress: 2/3 files uploading eta 4m\n', _g["".concat(TASKS, "/bg-n3.output")] = 'progress: 10/40 pictures drawing\n', _g);
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
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fit and upload', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fit and upload', prompt: 'go' }))];
            case 3:
                _k.sent();
                sent = function (agentId, id, script, description) {
                    return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: "cd /w && python ".concat(script), description: description, run_in_background: true });
                };
                return [4 /*yield*/, sent('a1', 'n1', 'fit.py', 'Run the fit of every head')];
            case 4:
                _k.sent();
                return [4 /*yield*/, sent('a1', 'n2', 'up.py', 'Upload the cleaned A, B, C over the old ones')];
            case 5:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Draw the pictures', prompt: 'go', parentAgentId: 'a1' })];
            case 6:
                _k.sent();
                return [4 /*yield*/, sent('a2', 'n3', 'pics.py', 'Run the drawing of every picture')];
            case 7:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn({ subagentType: 'general-purpose', background: true, description: 'Check the drawing', prompt: 'go', parentAgentId: 'a1' })];
            case 8:
                _k.sent();
                n = 0;
                _k.label = 9;
            case 9:
                if (!(n < 6)) return [3 /*break*/, 12];
                return [4 /*yield*/, advance(20000)];
            case 10:
                _k.sent();
                _k.label = 11;
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
                _k.label = 13;
            case 13:
                if (!(_i < _a.length)) return [3 /*break*/, 17];
                columns = _a[_i];
                return [4 /*yield*/, rows('terminal', columns)];
            case 14:
                runs = (_k.sent()).runs;
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
                drawn = _k.sent();
                for (_b = 0, _c = drawn.svgs; _b < _c.length; _b++) {
                    svg = _c[_b];
                    expect(String((_h = svg.props.alt) !== null && _h !== void 0 ? _h : '').trim()).not.toBe('');
                    expect(Number(svg.props.width)).toBeGreaterThan(0);
                }
                for (_d = 0, _e = drawn.runs; _d < _e.length; _d++) {
                    _f = _e[_d], head = _f.head, stand = _f.stand;
                    lines = all(head).filter(function (one) { return one.type === 'Svg'; })[0];
                    rails = all(kids(stand)[0]).filter(function (one) { return one.type === 'Svg'; })[0];
                    expect(rails === null || rails === void 0 ? void 0 : rails.props.width).toBe(lines === null || lines === void 0 ? void 0 : lines.props.width);
                    // and the words move in by the step the name's own button pads it with
                    expect((_j = kids(stand)[1]) === null || _j === void 0 ? void 0 : _j.props.paddingLeft).toBe('xs');
                    expect(String(rails === null || rails === void 0 ? void 0 : rails.props.source)).toContain('<path');
                }
                _k.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 13];
            case 17: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 100 }), surface: 'terminal' }))];
            case 18:
                pane = _k.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 19:
                shown = (_k.sent()).map(function (one) { return one.text; }).join('\n');
                return [4 /*yield*/, pane.unmount()];
            case 20:
                _k.sent();
                expect(shown).toContain('4m left');
                expect(shown).not.toMatch(/about \d+m? ?\d*s? left/);
                expect(shown).not.toMatch(/printed/);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 40 }), surface: 'terminal' }))];
            case 21:
                narrow = _k.sent();
                return [4 /*yield*/, narrow.findAll({ type: 'Text' })];
            case 22:
                tight = (_k.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(tight.filter(function (text) { return /\d+[ms] left/.test(text); }).every(function (text) { return text.includes('4m left'); })).toBe(true);
                expect(tight.some(function (text) { return /3 of 6|3\/6/.test(text); })).toBe(true);
                // and one under a helper, with less room, keeps its count
                expect(tight.some(function (text) { return text.includes('10/40'); })).toBe(true);
                return [4 /*yield*/, narrow.unmount()];
            case 23:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
