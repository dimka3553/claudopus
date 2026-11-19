// Config: the person's own texts, settings, and models
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
test('a copy of the principles in the memory folder is the person\'s own: every conversation carries it in place of the shipped ones', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, MINE, told;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = world(on).files;
                on('prompt.context', function (_, e) { return ({ blocks: e.blocks, instructionFiles: e.instructionFiles }); });
                MINE = '# Mine\n\n## Core truths\n\n- Mine come first.\n\n## Checking\n\n1. Look at it.\n';
                files.set("".concat(MEMORY, "/rules/CLAUDE.md"), MINE);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [{ path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' }] })];
            case 2:
                told = _c.sent();
                expect((_a = told.instructionFiles) === null || _a === void 0 ? void 0 : _a.find(function (one) { return one.kind === 'user'; })).toEqual({ path: "".concat(MEMORY, "/rules/CLAUDE.md"), kind: 'user', content: MINE });
                expect((_b = told.instructionFiles) === null || _b === void 0 ? void 0 : _b.some(function (one) { return one.content === PRINCIPLES; })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
// The two lines that were the author's own and no longer ship, as a person may keep them in their own copy
var DELIBERATE = 'My decisions are deliberate.';
var DONE_MEANS = 'Done means';
test('a new install with no copy of its own carries the shipped principles, which leave out the author\'s "decisions are deliberate" and "done means" lines', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, told, ours;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                files = world(on, { isNew: true, shipped: true }).files;
                on('prompt.context', function (_, e) { return ({ blocks: e.blocks, instructionFiles: e.instructionFiles }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                expect(files.has("".concat(MEMORY, "/rules/CLAUDE.md"))).toBe(false);
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [] })];
            case 2:
                told = _d.sent();
                ours = (_c = (_b = (_a = told.instructionFiles) === null || _a === void 0 ? void 0 : _a.find(function (one) { return one.kind === 'user'; })) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : '';
                expect(ours).toBe(SHIPPED_PRINCIPLES);
                expect(ours).toContain('# How I work with Claude');
                expect(ours).toContain('My words are the spec.');
                expect(ours).not.toContain(DELIBERATE);
                expect(ours).not.toContain(DONE_MEANS);
                expect(ours).not.toContain('A concern is raised');
                return [2 /*return*/];
        }
    });
}); });
test('a person\'s own copy that keeps both lines carries both, in their words, in place of the shipped principles', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, MINE, told, ours;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                files = world(on, { shipped: true }).files;
                on('prompt.context', function (_, e) { return ({ blocks: e.blocks, instructionFiles: e.instructionFiles }); });
                MINE = '# How I work with Claude\n\n## Principles\n\n1. My decisions are deliberate. No risk, legal or ethics commentary unless it blocks the task; then one line, once.\n2. Done means committed and pushed, or deployed.\n';
                files.set("".concat(MEMORY, "/rules/CLAUDE.md"), MINE);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [] })];
            case 2:
                told = _e.sent();
                ours = (_c = (_b = (_a = told.instructionFiles) === null || _a === void 0 ? void 0 : _a.find(function (one) { return one.kind === 'user'; })) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : '';
                expect(ours).toBe(MINE);
                expect(ours).toContain(DELIBERATE);
                expect(ours).toContain(DONE_MEANS);
                expect((_d = told.instructionFiles) === null || _d === void 0 ? void 0 : _d.some(function (one) { return one.content === SHIPPED_PRINCIPLES; })).toBe(false);
                // Nothing the mod does writes over it
                expect(files.get("".concat(MEMORY, "/rules/CLAUDE.md"))).toBe(MINE);
                return [2 /*return*/];
        }
    });
}); });
test('Config lists each thing a person can set with what is in force, edits a text as their own copy, changes a setting and puts each back', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, shown, tabs, list, _b, config, _c, _d, _i, _e, name_1, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var _this = this;
    var _r, _s, _t, _u, _v, _w, _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                _a = world(on), files = _a.files, shown = _a.shown, tabs = _a.tabs;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam', other: 1 }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _y.sent();
                return [4 /*yield*/, pressed(list, 'config-open')];
            case 3:
                _y.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_y.sent()]).toBe('config: Config');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))
                    // What is rarely changed is under More, closed until pressed
                ];
            case 5:
                config = _y.sent();
                // What is rarely changed is under More, closed until pressed
                _c = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Chat rules' })];
            case 6:
                // What is rarely changed is under More, closed until pressed
                _c.apply(void 0, [_y.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, moreShown(config)];
            case 7:
                _d.apply(void 0, [_y.sent()]).toBe(true);
                _i = 0, _e = ['Your principles', 'Chat rules', 'Task rules', 'Your name', 'Background tasks', 'When a task ends', 'Most tasks', 'Simple tasks', 'Heavy tasks', 'Busy Mac', 'Admin commands', 'Update checks'];
                _y.label = 8;
            case 8:
                if (!(_i < _e.length)) return [3 /*break*/, 11];
                name_1 = _e[_i];
                _f = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: name_1 })];
            case 9:
                _f.apply(void 0, [_y.sent()]).toBeDefined();
                _y.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                // Only what differs from what shipped has a Reset: here the name
                _g = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 12:
                // Only what differs from what shipped has a Reset: here the name
                _g.apply(void 0, [(_y.sent()).filter(function (one) { return one.props.label === 'Reset'; }).length]).toBe(1);
                // Open file, beside Cancel while editing, makes the person's own copy from the shipped text and opens it in their editor
                return [4 /*yield*/, pressed(config, 'config-text-principles-edit')];
            case 13:
                // Open file, beside Cancel while editing, makes the person's own copy from the shipped text and opens it in their editor
                _y.sent();
                return [4 /*yield*/, pressed(config, 'config-text-principles-open')];
            case 14:
                _y.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, config.find({ type: 'Input', key: 'config-text-principles-input' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 15:
                _h.apply(void 0, [_y.sent()]).toBe(true);
                expect(files.get("".concat(MEMORY, "/rules/CLAUDE.md"))).toBe(PRINCIPLES);
                expect(shown.at(-1)).toEqual(['open', '-t', "".concat(MEMORY, "/rules/CLAUDE.md")]);
                // A copy still the same as what shipped is no change of theirs
                _j = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /You changed it/ })];
            case 16:
                // A copy still the same as what shipped is no change of theirs
                _j.apply(void 0, [_y.sent()]).toBeUndefined();
                // Edit opens the text in the tab; Save makes it the person's own
                return [4 /*yield*/, pressed(config, 'config-text-work-edit')];
            case 17:
                // Edit opens the text in the tab; Save makes it the person's own
                _y.sent();
                return [4 /*yield*/, config.input({ key: 'config-text-work-input', text: 'MY WORK RULES' })];
            case 18:
                _y.sent();
                expect(files.get("".concat(MEMORY, "/roles/work.md"))).toBe('MY WORK RULES\n');
                _k = expect;
                return [4 /*yield*/, config.find({ type: 'Input', key: 'config-text-work-input' })];
            case 19:
                _k.apply(void 0, [_y.sent()]).toBeUndefined();
                // Without the places the shipped rules fill, it is said to lack what an update added
                _l = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /You changed it, and an update since added new parts/ })];
            case 20:
                // Without the places the shipped rules fill, it is said to lack what an update added
                _l.apply(void 0, [_y.sent()]).toBeDefined();
                // Reset moves it aside, and the shipped text is in force again
                return [4 /*yield*/, pressed(config, 'config-text-work-back')];
            case 21:
                // Reset moves it aside, and the shipped text is in force again
                _y.sent();
                expect(files.has("".concat(MEMORY, "/roles/work.md"))).toBe(false);
                expect((_r = __spreadArray([], files.entries(), true).find(function (_a) {
                    var path = _a[0];
                    return /\/roles\/work\.md\.\d{8}-\d{6}\.old$/.test(path);
                })) === null || _r === void 0 ? void 0 : _r[1]).toBe('MY WORK RULES\n');
                _m = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /You changed it/ })];
            case 22:
                _m.apply(void 0, [_y.sent()]).toBeUndefined();
                // A setting is written to config.json, every other key kept; Reset takes the key out. When a task ends is the two keys
                return [4 /*yield*/, config.select({ key: 'config-alerts-pick', value: 'notice' })];
            case 23:
                // A setting is written to config.json, every other key kept; Reset takes the key out. When a task ends is the two keys
                _y.sent();
                expect(JSON.parse((_s = files.get("".concat(MEMORY, "/config.json"))) !== null && _s !== void 0 ? _s : '{}')).toEqual({ name: 'Sam', other: 1, sound: false });
                return [4 /*yield*/, config.select({ key: 'config-alerts-pick', value: 'none' })];
            case 24:
                _y.sent();
                expect(JSON.parse((_t = files.get("".concat(MEMORY, "/config.json"))) !== null && _t !== void 0 ? _t : '{}')).toEqual({ name: 'Sam', other: 1, sound: false, notifications: false });
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, config.find({ type: 'Select', key: 'config-alerts-pick' })];
                    }); }); })];
            case 25:
                _o.apply(void 0, [(_u = (_y.sent())) === null || _u === void 0 ? void 0 : _u.props.value]).toBe('none');
                return [4 /*yield*/, pressed(config, 'config-alerts-back')];
            case 26:
                _y.sent();
                expect(JSON.parse((_v = files.get("".concat(MEMORY, "/config.json"))) !== null && _v !== void 0 ? _v : '{}')).toEqual({ name: 'Sam', other: 1 });
                // Nothing in Config turns on updates that install by themselves, nor keeps an admin password
                _p = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Automatic updates' })];
            case 27:
                // Nothing in Config turns on updates that install by themselves, nor keeps an admin password
                _p.apply(void 0, [_y.sent()]).toBeUndefined();
                _q = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin password' })];
            case 28:
                _q.apply(void 0, [_y.sent()]).toBeUndefined();
                return [4 /*yield*/, config.input({ key: 'config-name-input', text: 'Alex' })];
            case 29:
                _y.sent();
                expect(JSON.parse((_w = files.get("".concat(MEMORY, "/config.json"))) !== null && _w !== void 0 ? _w : '{}').name).toBe('Alex');
                return [4 /*yield*/, pressed(config, 'config-name-back')];
            case 30:
                _y.sent();
                expect(JSON.parse((_x = files.get("".concat(MEMORY, "/config.json"))) !== null && _x !== void 0 ? _x : '{}').name).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('the model each kind of work runs on comes from Config, and the chat\'s and work\'s rules name it: a chat keeps the models it was first told, and a new chat is told the new ones', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, config, _a, told, _b, _c, _d;
    var _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                files = world(on, { chatRole: 'CHAT ROLE\n- {models}' }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _l.sent();
                return [4 /*yield*/, config.select({ key: 'config-model-legwork-pick', value: 'opus' })];
            case 3:
                _l.sent();
                expect(JSON.parse((_e = files.get("".concat(MEMORY, "/config.json"))) !== null && _e !== void 0 ? _e : '{}')).toEqual({ models: { legwork: 'opus' } });
                _a = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Changes reach new chats and new tasks. Reset puts one back to the default.' })];
            case 4:
                _a.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })];
            case 5:
                told = (_l.sent());
                expect(((_f = told.context) !== null && _f !== void 0 ? _f : []).join('\n')).toContain('A clearly stated job, and long legwork such as indexing, runs on Opus 5.5, `model: "opus"`.');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'index the photos' }))];
            case 6:
                _l.sent();
                expect(prompts[0]).not.toContain('{helpers}');
                expect(prompts[0]).not.toContain('{checker}');
                // Picking what shipped takes the key out again
                return [4 /*yield*/, config.select({ key: 'config-model-legwork-pick', value: 'sonnet' })];
            case 7:
                // Picking what shipped takes the key out again
                _l.sent();
                expect(JSON.parse((_g = files.get("".concat(MEMORY, "/config.json"))) !== null && _g !== void 0 ? _g : '{}')).toEqual({});
                // The open chat is told nothing of the change, at its next message or when its rules go out again after a compaction
                _b = expect;
                return [4 /*yield*/, $.prompt.submit({ text: 'and the videos', wait: false, origin: composer })];
            case 8:
                // The open chat is told nothing of the change, at its next message or when its rules go out again after a compaction
                _b.apply(void 0, [(_h = (_l.sent()).context) === null || _h === void 0 ? void 0 : _h.join('\n')]).not.toContain('legwork');
                return [4 /*yield*/, $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'one', toolUses: [] }] })];
            case 9:
                _l.sent();
                _c = expect;
                return [4 /*yield*/, $.prompt.submit({ text: 'and the songs', wait: false, origin: composer })];
            case 10:
                _c.apply(void 0, [(_j = (_l.sent()).context) === null || _j === void 0 ? void 0 : _j.join('\n')]).toContain('long legwork such as indexing, runs on Opus 5.5');
                // A new chat is told the models as they are now
                files.set('session:id', 'chat-2');
                return [4 /*yield*/, $.session.start(start)];
            case 11:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })];
            case 12:
                _d.apply(void 0, [(_k = (_l.sent()).context) === null || _k === void 0 ? void 0 : _k.join('\n')]).toContain('long legwork such as indexing, runs on Sonnet 5.5');
                return [2 /*return*/];
        }
    });
}); });
test("Config's Tasks band shows the second check with its shipped choice, written as lean in config.json, and when Fable runs as the Heavy tasks model; the choices of how work is handed out and of who does a short request are gone, and a saved one goes at the next save", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, config, settings, _i, _a, _b, key, name_2, _c, _d, _e, _f, _loop_1, _g, settings_1, _h, key, name_3, shipped, other, heavy, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                files = world(on).files;
                // (a choice of 0.2.201 to 0.2.205's, still in the file)
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ lean: { chat: 'itself' } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _v.sent();
                settings = [
                    ['second', 'Second check', 'asked', 'every'],
                ];
                _i = 0, _a = [['fable', 'Fable 5.2 tasks'], ['chat', 'Short requests'], ['small', 'Small jobs'], ['quick', 'Quick task model'], ['start', 'What a task starts with'], ['checker', 'Checker model'], ['readers', 'Helpers that only read']];
                _v.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], key = _b[0], name_2 = _b[1];
                _c = expect;
                _d = [name_2];
                _e = Boolean;
                return [4 /*yield*/, config.find({ type: 'Text', text: name_2 })];
            case 4:
                _d = _d.concat([_e.apply(void 0, [_v.sent()])]);
                _f = Boolean;
                return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
            case 5:
                _c.apply(void 0, [_d.concat([_f.apply(void 0, [_v.sent()])])]).toEqual([name_2, false, false]);
                _v.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7:
                _loop_1 = function (key, name_3, shipped, other) {
                    var _w, _x, _y, _z, _0, _1, _2;
                    var _3;
                    return __generator(this, function (_4) {
                        switch (_4.label) {
                            case 0:
                                _w = expect;
                                _x = [name_3];
                                _y = Boolean;
                                return [4 /*yield*/, config.find({ type: 'Text', text: name_3 })];
                            case 1:
                                _w.apply(void 0, [_x.concat([_y.apply(void 0, [_4.sent()])])]).toEqual([name_3, true]);
                                _z = expect;
                                _0 = [key];
                                return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
                            case 2:
                                _z.apply(void 0, [_0.concat([(_m = (_4.sent())) === null || _m === void 0 ? void 0 : _m.props.value])]).toEqual([key, shipped]);
                                return [4 /*yield*/, config.select({ key: "config-lean-".concat(key, "-pick"), value: other })];
                            case 3:
                                _4.sent();
                                expect(JSON.parse((_o = files.get("".concat(MEMORY, "/config.json"))) !== null && _o !== void 0 ? _o : '{}')).toEqual({ lean: (_3 = {}, _3[key] = other, _3) });
                                _1 = expect;
                                _2 = [key];
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
                                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.value) === other ? other : undefined)];
                                        }
                                    }); }); })];
                            case 4:
                                _1.apply(void 0, [_2.concat([(_4.sent())])]).toEqual([key, other]);
                                // Picking what shipped takes the key out again
                                return [4 /*yield*/, config.select({ key: "config-lean-".concat(key, "-pick"), value: shipped })];
                            case 5:
                                // Picking what shipped takes the key out again
                                _4.sent();
                                expect(JSON.parse((_p = files.get("".concat(MEMORY, "/config.json"))) !== null && _p !== void 0 ? _p : '{}')).toEqual({});
                                return [2 /*return*/];
                        }
                    });
                };
                _g = 0, settings_1 = settings;
                _v.label = 8;
            case 8:
                if (!(_g < settings_1.length)) return [3 /*break*/, 11];
                _h = settings_1[_g], key = _h[0], name_3 = _h[1], shipped = _h[2], other = _h[3];
                return [5 /*yield**/, _loop_1(key, name_3, shipped, other)];
            case 9:
                _v.sent();
                _v.label = 10;
            case 10:
                _g++;
                return [3 /*break*/, 8];
            case 11:
                heavy = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, config.find({ type: 'Select', key: 'config-model-heavy-pick' })];
                                }); }); })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.value];
                        }
                    });
                }); };
                _j = expect;
                return [4 /*yield*/, heavy()];
            case 12:
                _j.apply(void 0, [_v.sent()]).toBe('fable');
                return [4 /*yield*/, config.select({ key: 'config-model-heavy-pick', value: 'same' })];
            case 13:
                _v.sent();
                expect(JSON.parse((_q = files.get("".concat(MEMORY, "/config.json"))) !== null && _q !== void 0 ? _q : '{}')).toEqual({ lean: { fable: 'named' } });
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, heavy()];
                            case 1: return [2 /*return*/, ((_a.sent()) === 'same' ? 'same' : undefined)];
                        }
                    }); }); })];
            case 14:
                _k.apply(void 0, [_v.sent()]).toBe('same');
                return [4 /*yield*/, config.select({ key: 'config-model-heavy-pick', value: 'opus' })];
            case 15:
                _v.sent();
                expect(JSON.parse((_r = files.get("".concat(MEMORY, "/config.json"))) !== null && _r !== void 0 ? _r : '{}')).toEqual({ models: { heavy: 'opus' } });
                return [4 /*yield*/, pressed(config, 'config-model-heavy-back')];
            case 16:
                _v.sent();
                expect(JSON.parse((_s = files.get("".concat(MEMORY, "/config.json"))) !== null && _s !== void 0 ? _s : '{}')).toEqual({});
                // Fable for every task, which only an older Config wrote, shows as Most tasks on Fable, and stays so when another model is picked
                ownSet(files, 'config.json', JSON.stringify({ lean: { fable: 'all' } }));
                return [4 /*yield*/, config.redraw()];
            case 17:
                _v.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, config.find({ type: 'Select', key: 'config-model-work-pick' })];
                    }); }); })];
            case 18:
                _l.apply(void 0, [(_t = (_v.sent())) === null || _t === void 0 ? void 0 : _t.props.value]).toBe('fable');
                return [4 /*yield*/, config.select({ key: 'config-model-legwork-pick', value: 'opus' })];
            case 19:
                _v.sent();
                expect(JSON.parse((_u = files.get("".concat(MEMORY, "/config.json"))) !== null && _u !== void 0 ? _u : '{}')).toEqual({ models: { work: 'fable', legwork: 'opus' } });
                return [2 /*return*/];
        }
    });
}); });
test('Check now in Config only looks: it shows it is checking, then what it found, and a second press meanwhile starts no second look; nothing is fetched or moved until Update, pressed right there in Config', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, gitRan, clock, page, answer, fetches, release, config, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, failed, _u, _v;
    var _w;
    var _this = this;
    var _x, _y, _z, _0;
    return __generator(this, function (_1) {
        switch (_1.label) {
            case 0:
                _a = world(on, { release: { version: '0.1.2', commit: 'c'.repeat(40), tree: 'a'.repeat(40) } }), files = _a.files, gitRan = _a.gitRan, clock = _a.clock;
                page = JSON.stringify({ version: '0.1.0', tree: 'a'.repeat(40) });
                fetches = 0;
                on('http.fetch', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                fetches += 1;
                                return [4 /*yield*/, new Promise(function (done) { return (answer = done); })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, { value: { status: 200, ok: true, headers: {}, text: page } }];
                        }
                    });
                }); });
                release = function () {
                    var one = answer;
                    answer = undefined;
                    one === null || one === void 0 ? void 0 : one();
                };
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _1.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _1.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: 'This chat runs v0.1.0' }); })];
            case 3:
                _b.apply(void 0, [_1.sent()]).toBeDefined();
                // Where it loads from, said as it is
                _c = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^It runs from the released code on this Mac\. Claudopus looks every hour\.$/ }); })];
            case 4:
                // Where it loads from, said as it is
                _c.apply(void 0, [_1.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Not checked yet' })];
            case 5:
                _d.apply(void 0, [_1.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 6:
                _1.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: 'Checking…' }); })];
            case 7:
                _e.apply(void 0, [_1.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 8:
                _f.apply(void 0, [(_1.sent()).some(function (one) { return one.props.label === 'Check now'; })]).toBe(false);
                release();
                _g = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^You have the newest version, v0\.1\.0\./ }); })];
            case 9:
                _g.apply(void 0, [_1.sent()]).toBeDefined();
                expect(fetches).toBe(1);
                // A newer release, one that Not now in the panel had put off: Check now offers it right here, in the panel's own box with its
                // Update, and sends the person nowhere else; nothing was fetched, moved or installed
                page = JSON.stringify({ version: '0.1.2', tree: 'a'.repeat(40) });
                _j = (_h = files).set;
                _k = ["".concat(MEMORY, "/update-later.json")];
                _m = (_l = JSON).stringify;
                _w = { version: '0.1.2' };
                return [4 /*yield*/, clock.now()];
            case 10:
                _j.apply(_h, _k.concat([_m.apply(_l, [(_w.until = (_1.sent()) + 3600000, _w)])]));
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 11:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer];
                    }); }); })];
            case 12:
                _1.sent();
                release();
                _o = expect;
                return [4 /*yield*/, until(function () { return keyed(config, 'update-download'); })];
            case 13:
                _o.apply(void 0, [(_x = (_1.sent())) === null || _x === void 0 ? void 0 : _x.props.label]).toBe('Update');
                _p = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Claudopus v0.1.2 is out' })];
            case 14:
                _p.apply(void 0, [_1.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /from the panel/ })];
            case 15:
                _q.apply(void 0, [_1.sent()]).toBeUndefined();
                _r = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'v0.1.2 is out.' })];
            case 16:
                _r.apply(void 0, [_1.sent()]).toBeUndefined();
                // Not now pressed there puts the box away and leaves no line saying it is out with nothing to press
                return [4 /*yield*/, pressed(config, 'update-later-available')];
            case 17:
                // Not now pressed there puts the box away and leaves no line saying it is out with nothing to press
                _1.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, keyed(config, 'update-download')];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 18:
                _s.apply(void 0, [_1.sent()]).toBe(true);
                _t = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /0\.1\.2 is out/ })];
            case 19:
                _t.apply(void 0, [_1.sent()]).toBeUndefined();
                expect(gitRan.filter(function (one) { return /^(fetch|merge)/.test(one) || one.includes('fetch --progress'); })).toEqual([]);
                expect(files.get('manifest')).toBeUndefined();
                // An older page with no fingerprint is no release: said as a failure, in the error colour
                page = '{"version":"0.1.3"}';
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 20:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer];
                    }); }); })];
            case 21:
                _1.sent();
                release();
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^Couldn't check: the version page doesn't say how to check the download/ }); })];
            case 22:
                failed = _1.sent();
                expect(failed === null || failed === void 0 ? void 0 : failed.props.color).toBe('error');
                // How often, under More: one choice, written as the two keys; Only when I ask is updates false
                _u = expect;
                return [4 /*yield*/, moreShown(config)];
            case 23:
                // How often, under More: one choice, written as the two keys; Only when I ask is updates false
                _u.apply(void 0, [_1.sent()]).toBe(true);
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '24' })];
            case 24:
                _1.sent();
                expect(JSON.parse((_y = files.get("".concat(MEMORY, "/config.json"))) !== null && _y !== void 0 ? _y : '{}')).toMatchObject({ updateEvery: 24 });
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '0' })];
            case 25:
                _1.sent();
                expect(JSON.parse((_z = files.get("".concat(MEMORY, "/config.json"))) !== null && _z !== void 0 ? _z : '{}')).toMatchObject({ updates: false });
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '1' })];
            case 26:
                _1.sent();
                expect(JSON.parse((_0 = files.get("".concat(MEMORY, "/config.json"))) !== null && _0 !== void 0 ? _0 : '{}')).toEqual({});
                // Update pressed in Config updates, and Config says what is left: type /reload-plugins
                page = JSON.stringify({ version: '0.1.2', tree: 'a'.repeat(40) });
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 27:
                _1.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer];
                    }); }); })];
            case 28:
                _1.sent();
                release();
                return [4 /*yield*/, until(function () { return keyed(config, 'update-download'); })];
            case 29:
                _1.sent();
                return [4 /*yield*/, pressed(config, 'update-download')];
            case 30:
                _1.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (release(), config.find({ type: 'Text', text: 'Claudopus v0.1.2 is ready: type /reload-plugins to use it.' }))];
                    }); }); })];
            case 31:
                _v.apply(void 0, [_1.sent()]).toBeDefined();
                expect(gitRan.some(function (one) { return /^merge\b/.test(one); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
