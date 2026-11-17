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
    var _a, files, shown, tabs, list, _b, config, _i, _c, name_1, _d, _e, _f, _g, _h, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                _a = world(on), files = _a.files, shown = _a.shown, tabs = _a.tabs;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam', other: 1 }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _s.sent();
                return [4 /*yield*/, pressed(list, 'config-open')];
            case 3:
                _s.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_s.sent()]).toBe('config: Config');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 5:
                config = _s.sent();
                _i = 0, _c = ['Principles', "The chat's rules", 'Task rules', 'Your name', 'Background tasks', 'Sound', 'Notifications', 'Most tasks', 'Clear jobs, searching and reading', 'Heavy tasks'];
                _s.label = 6;
            case 6:
                if (!(_i < _c.length)) return [3 /*break*/, 9];
                name_1 = _c[_i];
                _d = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: name_1 })];
            case 7:
                _d.apply(void 0, [_s.sent()]).toBeDefined();
                _s.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                // Only what differs from what shipped has a Reset: here the name
                _e = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 10:
                // Only what differs from what shipped has a Reset: here the name
                _e.apply(void 0, [(_s.sent()).filter(function (one) { return one.props.label === 'Reset'; }).length]).toBe(1);
                // Open file makes the person's own copy from the shipped text and opens it in their editor
                return [4 /*yield*/, pressed(config, 'config-text-principles-open')];
            case 11:
                // Open file makes the person's own copy from the shipped text and opens it in their editor
                _s.sent();
                expect(files.get("".concat(MEMORY, "/rules/CLAUDE.md"))).toBe(PRINCIPLES);
                expect(shown.at(-1)).toEqual(['open', '-t', "".concat(MEMORY, "/rules/CLAUDE.md")]);
                // A copy still the same as what shipped is no change of theirs
                _f = expect;
                return [4 /*yield*/, config.findAll({ type: 'Text', text: /As shipped\.$/ })];
            case 12:
                // A copy still the same as what shipped is no change of theirs
                _f.apply(void 0, [(_s.sent()).length]).toBe(3);
                // Edit opens the text in the tab; Save makes it the person's own
                return [4 /*yield*/, pressed(config, 'config-text-work-edit')];
            case 13:
                // Edit opens the text in the tab; Save makes it the person's own
                _s.sent();
                return [4 /*yield*/, config.input({ key: 'config-text-work-input', text: 'MY WORK RULES' })];
            case 14:
                _s.sent();
                expect(files.get("".concat(MEMORY, "/roles/work.md"))).toBe('MY WORK RULES\n');
                _g = expect;
                return [4 /*yield*/, config.find({ type: 'Input', key: 'config-text-work-input' })];
            case 15:
                _g.apply(void 0, [_s.sent()]).toBeUndefined();
                // Without the places the shipped rules fill, it is said to lack what an update added
                _h = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /Edited by you, before an update added parts yours lacks/ })];
            case 16:
                // Without the places the shipped rules fill, it is said to lack what an update added
                _h.apply(void 0, [_s.sent()]).toBeDefined();
                // Reset moves it aside, and the shipped text is in force again
                return [4 /*yield*/, pressed(config, 'config-text-work-back')];
            case 17:
                // Reset moves it aside, and the shipped text is in force again
                _s.sent();
                expect(files.has("".concat(MEMORY, "/roles/work.md"))).toBe(false);
                expect((_m = __spreadArray([], files.entries(), true).find(function (_a) {
                    var path = _a[0];
                    return /\/roles\/work\.md\.\d{8}-\d{6}\.old$/.test(path);
                })) === null || _m === void 0 ? void 0 : _m[1]).toBe('MY WORK RULES\n');
                _j = expect;
                return [4 /*yield*/, config.findAll({ type: 'Text', text: /As shipped\.$/ })];
            case 18:
                _j.apply(void 0, [(_s.sent()).length]).toBe(3);
                // A setting is written to config.json, every other key kept; Reset takes the key out
                return [4 /*yield*/, pressed(config, 'config-sound-off')];
            case 19:
                // A setting is written to config.json, every other key kept; Reset takes the key out
                _s.sent();
                expect(JSON.parse((_o = files.get("".concat(MEMORY, "/config.json"))) !== null && _o !== void 0 ? _o : '{}')).toEqual({ name: 'Sam', other: 1, sound: false });
                return [4 /*yield*/, pressed(config, 'config-sound-back')];
            case 20:
                _s.sent();
                expect(JSON.parse((_p = files.get("".concat(MEMORY, "/config.json"))) !== null && _p !== void 0 ? _p : '{}')).toEqual({ name: 'Sam', other: 1 });
                // Nothing in Config turns on updates that install by themselves, nor keeps an admin password
                _k = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Automatic updates' })];
            case 21:
                // Nothing in Config turns on updates that install by themselves, nor keeps an admin password
                _k.apply(void 0, [_s.sent()]).toBeUndefined();
                _l = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin password' })];
            case 22:
                _l.apply(void 0, [_s.sent()]).toBeUndefined();
                return [4 /*yield*/, config.input({ key: 'config-name-input', text: 'Alex' })];
            case 23:
                _s.sent();
                expect(JSON.parse((_q = files.get("".concat(MEMORY, "/config.json"))) !== null && _q !== void 0 ? _q : '{}').name).toBe('Alex');
                return [4 /*yield*/, pressed(config, 'config-name-back')];
            case 24:
                _s.sent();
                expect(JSON.parse((_r = files.get("".concat(MEMORY, "/config.json"))) !== null && _r !== void 0 ? _r : '{}').name).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('the model each kind of work runs on comes from Config, and the chat\'s and work\'s rules name it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, config, told;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                files = world(on, { chatRole: 'CHAT ROLE\n- {models}' }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _d.sent();
                return [4 /*yield*/, config.select({ key: 'config-model-legwork-pick', value: 'opus' })];
            case 3:
                _d.sent();
                expect(JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}')).toEqual({ models: { legwork: 'opus' } });
                return [4 /*yield*/, $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })];
            case 4:
                told = (_d.sent());
                expect(((_b = told.context) !== null && _b !== void 0 ? _b : []).join('\n')).toContain('A clearly stated job, and long legwork such as indexing, runs on Opus 5.5, `model: "opus"`.');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'index the photos' }))];
            case 5:
                _d.sent();
                expect(prompts[0]).not.toContain('{helpers}');
                expect(prompts[0]).not.toContain('{checker}');
                // Picking what shipped takes the key out again
                return [4 /*yield*/, config.select({ key: 'config-model-legwork-pick', value: 'sonnet' })];
            case 6:
                // Picking what shipped takes the key out again
                _d.sent();
                expect(JSON.parse((_c = files.get("".concat(MEMORY, "/config.json"))) !== null && _c !== void 0 ? _c : '{}')).toEqual({});
                return [2 /*return*/];
        }
    });
}); });
test("Config's Tasks band shows only when Fable runs and when a second agent checks, each with its shipped choice, and a choice is written as lean in config.json; the choices of how work is handed out are gone", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, config, settings, _i, _a, _b, key, name_2, _c, _d, _e, _f, _loop_1, _g, settings_1, _h, key, name_3, shipped, other;
    var _this = this;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _m.sent();
                settings = [
                    ['fable', 'When to use Fable 5.2', 'heavy', 'named'],
                    ['second', 'Second check', 'beyond', 'every'],
                ];
                _i = 0, _a = [['small', 'Small jobs'], ['quick', 'Quick task model'], ['start', 'What a task starts with'], ['checker', 'Checker model'], ['readers', 'Helpers that only read']];
                _m.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], key = _b[0], name_2 = _b[1];
                _c = expect;
                _d = [name_2];
                _e = Boolean;
                return [4 /*yield*/, config.find({ type: 'Text', text: name_2 })];
            case 4:
                _d = _d.concat([_e.apply(void 0, [_m.sent()])]);
                _f = Boolean;
                return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
            case 5:
                _c.apply(void 0, [_d.concat([_f.apply(void 0, [_m.sent()])])]).toEqual([name_2, false, false]);
                _m.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7:
                _loop_1 = function (key, name_3, shipped, other) {
                    var _o, _p, _q, _r, _s, _t, _u;
                    var _v;
                    return __generator(this, function (_w) {
                        switch (_w.label) {
                            case 0:
                                _o = expect;
                                _p = [name_3];
                                _q = Boolean;
                                return [4 /*yield*/, config.find({ type: 'Text', text: name_3 })];
                            case 1:
                                _o.apply(void 0, [_p.concat([_q.apply(void 0, [_w.sent()])])]).toEqual([name_3, true]);
                                _r = expect;
                                _s = [key];
                                return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
                            case 2:
                                _r.apply(void 0, [_s.concat([(_j = (_w.sent())) === null || _j === void 0 ? void 0 : _j.props.value])]).toEqual([key, shipped]);
                                return [4 /*yield*/, config.select({ key: "config-lean-".concat(key, "-pick"), value: other })];
                            case 3:
                                _w.sent();
                                expect(JSON.parse((_k = files.get("".concat(MEMORY, "/config.json"))) !== null && _k !== void 0 ? _k : '{}')).toEqual({ lean: (_v = {}, _v[key] = other, _v) });
                                _t = expect;
                                _u = [key];
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, config.find({ type: 'Select', key: "config-lean-".concat(key, "-pick") })];
                                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.props.value) === other ? other : undefined)];
                                        }
                                    }); }); })];
                            case 4:
                                _t.apply(void 0, [_u.concat([(_w.sent())])]).toEqual([key, other]);
                                // Picking what shipped takes the key out again
                                return [4 /*yield*/, config.select({ key: "config-lean-".concat(key, "-pick"), value: shipped })];
                            case 5:
                                // Picking what shipped takes the key out again
                                _w.sent();
                                expect(JSON.parse((_l = files.get("".concat(MEMORY, "/config.json"))) !== null && _l !== void 0 ? _l : '{}')).toEqual({});
                                return [2 /*return*/];
                        }
                    });
                };
                _g = 0, settings_1 = settings;
                _m.label = 8;
            case 8:
                if (!(_g < settings_1.length)) return [3 /*break*/, 11];
                _h = settings_1[_g], key = _h[0], name_3 = _h[1], shipped = _h[2], other = _h[3];
                return [5 /*yield**/, _loop_1(key, name_3, shipped, other)];
            case 9:
                _m.sent();
                _m.label = 10;
            case 10:
                _g++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/];
        }
    });
}); });
test('Check now in Config only looks: it shows it is checking, then what it found, and a second press meanwhile starts no second look; nothing is fetched or moved', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, gitRan, page, answer, fetches, release, config, _b, _c, _d, _e, _f, _g, failed;
    var _this = this;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on, { release: { version: '0.1.2', commit: 'c'.repeat(40), tree: 'a'.repeat(40) } }), files = _a.files, gitRan = _a.gitRan;
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
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: 'This chat runs v0.1.0' }); })];
            case 3:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                // Where it loads from, said as it is
                _c = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^It loads from Claudopus's released code on this Mac\. Not looked yet\.$/ }); })];
            case 4:
                // Where it loads from, said as it is
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 5:
                _l.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: 'Checking…' }); })];
            case 6:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, config.findAll({ type: 'Button' })];
            case 7:
                _e.apply(void 0, [(_l.sent()).some(function (one) { return one.props.label === 'Check now'; })]).toBe(false);
                release();
                _f = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^You're on the newest version \(v0\.1\.0\)/ }); })];
            case 8:
                _f.apply(void 0, [_l.sent()]).toBeDefined();
                expect(fetches).toBe(1);
                // A newer release: Check now says so and the panel offers it; nothing was fetched, moved or installed
                page = JSON.stringify({ version: '0.1.2', tree: 'a'.repeat(40) });
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 9:
                _l.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer];
                    }); }); })];
            case 10:
                _l.sent();
                release();
                _g = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: 'v0.1.2 is out. You can update from the panel.' }); })];
            case 11:
                _g.apply(void 0, [_l.sent()]).toBeDefined();
                expect(gitRan.filter(function (one) { return /^(fetch|merge)/.test(one) || one.includes('fetch --progress'); })).toEqual([]);
                expect(files.get('manifest')).toBeUndefined();
                // An older page with no fingerprint is no release: said as a failure, in the error colour
                page = '{"version":"0.1.3"}';
                return [4 /*yield*/, pressed(config, 'config-check')];
            case 12:
                _l.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer];
                    }); }); })];
            case 13:
                _l.sent();
                release();
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /^Couldn't check: the version page has nothing to check the new version against/ }); })];
            case 14:
                failed = _l.sent();
                expect(failed === null || failed === void 0 ? void 0 : failed.props.color).toBe('error');
                // How often: one choice, written as the two keys; Only when I ask is updates false
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '24' })];
            case 15:
                // How often: one choice, written as the two keys; Only when I ask is updates false
                _l.sent();
                expect(JSON.parse((_h = files.get("".concat(MEMORY, "/config.json"))) !== null && _h !== void 0 ? _h : '{}')).toMatchObject({ updateEvery: 24 });
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '0' })];
            case 16:
                _l.sent();
                expect(JSON.parse((_j = files.get("".concat(MEMORY, "/config.json"))) !== null && _j !== void 0 ? _j : '{}')).toMatchObject({ updates: false });
                return [4 /*yield*/, config.select({ key: 'config-look-pick', value: '1' })];
            case 17:
                _l.sent();
                expect(JSON.parse((_k = files.get("".concat(MEMORY, "/config.json"))) !== null && _k !== void 0 ? _k : '{}')).toEqual({});
                return [2 /*return*/];
        }
    });
}); });
