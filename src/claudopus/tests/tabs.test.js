// The Stats and About tabs, and the bar of buttons
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
var _this = this;
test('Stats opens in front from its button beside Results, and adds up this chat\'s work from its records: tokens, work, time saved, cost', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, opened, tabs, M, now, chat, subs, _i, _b, _c, id, from, to, output, pane, _d, stats, _e, _f, _g, _h, _j, _k, _l, value, _m, _o, _p, _q, _r, _s, _t, _u;
    var _this = this;
    var _v, _w, _x, _y, _z;
    return __generator(this, function (_0) {
        switch (_0.label) {
            case 0:
                _a = world(on), files = _a.files, opened = _a.opened, tabs = _a.tabs;
                M = 60000;
                now = 1700000000000;
                chat = "".concat(HOME, "/.claude/projects/-repo");
                subs = "".concat(chat, "/engine-id/subagents");
                files.set("".concat(chat, "/engine-id.jsonl"), '{}');
                files.set("".concat(chat, "/engine-id.jsonl.sum"), JSON.stringify({ s: [[now - 30 * M, now]], u: [], d: [], turns: [[now - 30 * M, now - 30 * M + 20000]] }));
                // Two pieces of work that ran side by side for ten minutes
                for (_i = 0, _b = [['w1', now - 30 * M, now - 10 * M, 1000000], ['w2', now - 20 * M, now - 10 * M, 500000]]; _i < _b.length; _i++) {
                    _c = _b[_i], id = _c[0], from = _c[1], to = _c[2], output = _c[3];
                    files.set("".concat(subs, "/agent-").concat(id, ".jsonl"), '{}');
                    files.set("".concat(subs, "/agent-").concat(id, ".meta.json"), JSON.stringify({ description: "Work ".concat(id), spawnDepth: 1, finished: true }));
                    files.set("".concat(subs, "/agent-").concat(id, ".jsonl.sum"), JSON.stringify({ s: [[from, to]], u: [["m-".concat(id), 'claude-opus-5-5', from + M, 0, 0, 0, 0, 0, 0, output]], d: [[from + M, 'Do it', 'done', '']] }));
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _0.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                pane = _0.sent();
                _d = expect;
                return [4 /*yield*/, keyed(pane, 'stats-open')];
            case 3:
                _d.apply(void 0, [(_v = (_0.sent())) === null || _v === void 0 ? void 0 : _v.props.label]).toBe('Stats');
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 4:
                _0.sent();
                expect(opened).toContain('stats');
                expect(tabs).toContain('stats: Stats');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'stats', props: __assign(__assign({}, LIST.props), { title: 'Stats', bodyColumns: 80 }), surface: 'desktop' }))
                    // At the top, what is counted: this chat, today, each chosen one filled and bold
                ];
            case 5:
                stats = _0.sent();
                // At the top, what is counted: this chat, today, each chosen one filled and bold
                _e = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: /^This chat$/ })];
            case 6:
                // At the top, what is counted: this chat, today, each chosen one filled and bold
                _e.apply(void 0, [(_w = (_0.sent())) === null || _w === void 0 ? void 0 : _w.props.bold]).toBe(true);
                _f = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: 'Today' })];
            case 7:
                _f.apply(void 0, [(_x = (_0.sent())) === null || _x === void 0 ? void 0 : _x.props.bold]).toBe(true);
                _g = expect;
                return [4 /*yield*/, keyed(stats, 'scope-All chats')];
            case 8:
                _g.apply(void 0, [(_y = (_0.sent())) === null || _y === void 0 ? void 0 : _y.props.label]).toBe('All chats');
                // Once read: 1.5M output tokens on Opus 5.5 at $20 a million, two pieces finished, two to-dos, 30 minutes of work in 20
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, stats.find({ type: 'Text', text: 'Saved by running side by side' })];
                    }); }); })];
            case 9:
                // Once read: 1.5M output tokens on Opus 5.5 at $20 a million, two pieces finished, two to-dos, 30 minutes of work in 20
                _h.apply(void 0, [_0.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: 'Opus 5.5' })];
            case 10:
                _j.apply(void 0, [_0.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: '1.5M' })];
            case 11:
                _k.apply(void 0, [_0.sent()]).toBeDefined();
                _l = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: '$30.00' })];
            case 12:
                _l.apply(void 0, [_0.sent()]).toBeDefined();
                value = function (name) { return __awaiter(_this, void 0, void 0, function () {
                    var rows;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stats.findAll({ type: 'Text' })];
                            case 1:
                                rows = (_a.sent()).map(function (one) { return one.text; });
                                return [2 /*return*/, rows[rows.indexOf(name) + 1]];
                        }
                    });
                }); };
                // The headline: time saved, cost, work done
                _m = expect;
                return [4 /*yield*/, value('10m')];
            case 13:
                // The headline: time saved, cost, work done
                _m.apply(void 0, [_0.sent()]).toBe('time saved');
                _o = expect;
                return [4 /*yield*/, value('Pieces of work done')];
            case 14:
                _o.apply(void 0, [_0.sent()]).toBe('2');
                _p = expect;
                return [4 /*yield*/, value('To-dos done')];
            case 15:
                _p.apply(void 0, [_0.sent()]).toBe('2');
                _q = expect;
                return [4 /*yield*/, value('Work added up')];
            case 16:
                _q.apply(void 0, [_0.sent()]).toBe('30m');
                _r = expect;
                return [4 /*yield*/, value('On the clock')];
            case 17:
                _r.apply(void 0, [_0.sent()]).toBe('20m');
                _s = expect;
                return [4 /*yield*/, value('Saved by running side by side')];
            case 18:
                _s.apply(void 0, [_0.sent()]).toBe('10m');
                // From the person's message to the chat's last response or tool result before the next message: 20 seconds here
                _t = expect;
                return [4 /*yield*/, value('From your message to the chat’s last step, on average')];
            case 19:
                // From the person's message to the chat's last response or tool result before the next message: 20 seconds here
                _t.apply(void 0, [_0.sent()]).toBe('20s');
                _u = expect;
                return [4 /*yield*/, stats.find({ type: 'Text', text: /^Each of your messages is timed from when the chat takes it up/ })];
            case 20:
                _u.apply(void 0, [_0.sent()]).toBeDefined();
                // The sums are kept, so the transcripts are read again only when they change
                expect(JSON.parse((_z = files.get("".concat(MEMORY, "/stats/engine-id.json"))) !== null && _z !== void 0 ? _z : '{}').folder).toBe(chat);
                return [2 /*return*/];
        }
    });
}); });
test('the bar keeps its buttons whole on a row of their own under the header, wrapping in a narrow pane', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var pane, row, term, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 30 }), surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 3:
                row = (_e.sent()).find(function (one) { return one.key === 'head-buttons'; });
                expect(row === null || row === void 0 ? void 0 : row.props.flexWrap).toBe('wrap');
                // Wrapped rows are as far apart as the buttons beside each other, so they never touch
                expect(row === null || row === void 0 ? void 0 : row.props.columnGap).toBe(1);
                expect(row === null || row === void 0 ? void 0 : row.props.rowGap).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 30 }), surface: 'terminal' }))];
            case 4:
                term = _e.sent();
                _a = expect;
                return [4 /*yield*/, term.findAll({ type: 'Box' })];
            case 5:
                _a.apply(void 0, [(_d = (_e.sent()).find(function (one) { return one.key === 'head-buttons'; })) === null || _d === void 0 ? void 0 : _d.props.rowGap]).toBe(0);
                _b = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 6:
                _b.apply(void 0, [(_e.sent()).map(function (b) { return b.props.label; })]).toEqual(['Stats', 'Memory', 'Keys', 'Config', 'About']);
                // The chat's size is no longer squeezed beside the buttons
                _c = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^This chat:/ })];
            case 7:
                // The chat's size is no longer squeezed beside the buttons
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('the header names the version this chat loaded beside Claudopus, and a newer one the Mac has installed, on the same line', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, version, pane, name, shown, _a, later, _b, narrow, whole, _c, same, _d;
    var _this = this;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                version = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /^v\d/.test((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 2:
                pane = _g.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Box' })];
            case 3:
                name = (_g.sent()).find(function (one) { return one.key === 'head-name'; });
                expect(name === null || name === void 0 ? void 0 : name.props.flexDirection).toBe('row');
                return [4 /*yield*/, version(pane)];
            case 4:
                shown = _g.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.text).toBe('v0.1.0');
                expect(shown === null || shown === void 0 ? void 0 : shown.props.dimColor).toBe(true);
                // The header keeps its three lines: the name, what runs, this chat's size
                _a = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /^This chat:/ })];
            case 5:
                // The header keeps its three lines: the name, what runs, this chat's size
                _a.apply(void 0, [_g.sent()]).toBeDefined();
                // The installed version is Claude Code's own record, not the last look's: a copy run from a folder of its code has none, so a
                // newer version in update.json names nothing (an installed copy's is read from installed_plugins.json, tested in update.test)
                return [4 /*yield*/, pane.unmount()];
            case 6:
                // The installed version is Claude Code's own record, not the last look's: a copy run from a folder of its code has none, so a
                // newer version in update.json names nothing (an installed copy's is read from installed_plugins.json, tested in update.test)
                _g.sent();
                files.set("".concat(MEMORY, "/update.json"), JSON.stringify({ at: 1, version: '0.1.1', result: 'updated' }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 7:
                later = _g.sent();
                _b = expect;
                return [4 /*yield*/, version(later)];
            case 8:
                _b.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('v0.1.0');
                return [4 /*yield*/, later.unmount()
                    // In a narrow pane the name stays whole; only the version shortens
                ];
            case 9:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 24 }), surface: 'desktop' }))];
            case 10:
                narrow = _g.sent();
                return [4 /*yield*/, narrow.findAll({ type: 'Box' })];
            case 11:
                whole = (_g.sent()).find(function (one) { return one.key === 'head-name'; });
                expect(whole === null || whole === void 0 ? void 0 : whole.props.minWidth).toBe(0);
                _c = expect;
                return [4 /*yield*/, narrow.find({ type: 'Text', text: 'Claudopus' })];
            case 12:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, narrow.unmount()];
            case 13:
                _g.sent();
                files.set("".concat(MEMORY, "/update.json"), JSON.stringify({ at: 2, version: '0.1.0', result: 'none' }));
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 14:
                same = _g.sent();
                _d = expect;
                return [4 /*yield*/, version(same)];
            case 15:
                _d.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('v0.1.0');
                return [2 /*return*/];
        }
    });
}); });
test('About says what Claudopus is, its version and the app\'s, and links the site, the code and its licence', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var tabs, list, _a, about, _b, _c, _d, links, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                tabs = world(on).tabs;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                list = _f.sent();
                return [4 /*yield*/, pressed(list, 'about-open')];
            case 3:
                _f.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'about: About'; })];
                    }); }); })];
            case 4:
                _a.apply(void 0, [_f.sent()]).toBe('about: About');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'about', props: __assign(__assign({}, LIST.props), { title: 'About', bodyColumns: 60 }), surface: 'desktop' }))];
            case 5:
                about = _f.sent();
                _b = expect;
                return [4 /*yield*/, about.find({ type: 'Text', text: 'Version 0.1.0 · Claude Code 2.1.321' })];
            case 6:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, about.find({ type: 'Text', text: 'What it does' })];
            case 7:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                // The principles are not shown there
                _d = expect;
                return [4 /*yield*/, about.find({ type: 'Text', text: 'My words are the spec.' })];
            case 8:
                // The principles are not shown there
                _d.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, about.findAll({ type: 'Link' })];
            case 9:
                links = (_f.sent()).map(function (one) { return one.props.href; });
                expect(links).toEqual(['https://claudopus.ai', 'https://github.com/dimka3553/claudopus', 'https://github.com/dimka3553/claudopus/blob/main/LICENSE']);
                _e = expect;
                return [4 /*yield*/, about.find({ type: 'Text', text: /a star on GitHub/ })];
            case 10:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
// ---- The changelog and the update screen ----
var CHANGELOG = [
    '# Changelog',
    '',
    '## 0.1.0 · 13 November 2026',
    '- The panel shows what changed.',
    '- A second change.',
    '',
    '## 0.0.9 · 12 November 2026',
    '- Pictures open large.',
    '',
    '## 0.0.8 · 11 November 2026',
    '- An old change.',
    '',
].join('\n');
test('About opens the changelog in a tab of its own, every version newest first, the one this chat runs marked', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var tabs, about, _a, _b, log, texts;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                tabs = world(on, { changelog: CHANGELOG }).tabs;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'about', props: __assign(__assign({}, LIST.props), { title: 'About', bodyColumns: 60 }), surface: 'desktop' }))];
            case 2:
                about = _d.sent();
                _a = expect;
                return [4 /*yield*/, keyed(about, 'about-changelog')];
            case 3:
                _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.props.label]).toBe('Changelog');
                return [4 /*yield*/, pressed(about, 'about-changelog')];
            case 4:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'changelog: Changelog'; })];
                    }); }); })];
            case 5:
                _b.apply(void 0, [_d.sent()]).toBe('changelog: Changelog');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'changelog', props: __assign(__assign({}, LIST.props), { title: 'Changelog', bodyColumns: 60 }), surface: 'desktop' }))];
            case 6:
                log = _d.sent();
                return [4 /*yield*/, log.findAll({ type: 'Text' })];
            case 7:
                texts = (_d.sent()).map(function (one) { return one.text; });
                expect(texts.filter(function (one) { return /^v0\./.test(one); })).toEqual(['v0.1.0', 'v0.0.9', 'v0.0.8']);
                expect(texts).toContain('13 November 2026 · this chat');
                expect(texts).toContain('Pictures open large.');
                return [2 /*return*/];
        }
    });
}); });
test('a chat that moved to a newer version than the one whose changes were seen says so in one quiet note in the header, with What\'s new, until closed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, pane, _a, _b, _c, _d, again, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                files = world(on, { changelog: CHANGELOG }).files;
                files.set("".concat(MEMORY, "/seen.json"), JSON.stringify({ version: '0.0.8' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 2:
                pane = _h.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ type: 'Text', text: 'Updated to Claudopus 0.1.0' })];
                    }); }); })];
            case 3:
                _a.apply(void 0, [_h.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: '· from v0.0.8, 2 versions' })];
            case 4:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                // The panel stays whole beneath it: its header buttons are there
                _c = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 5:
                // The panel stays whole beneath it: its header buttons are there
                _c.apply(void 0, [(_h.sent()).map(function (b) { return b.props.label; })]).toContain('Stats');
                return [4 /*yield*/, pressed(pane, 'update-close')];
            case 6:
                _h.sent();
                expect(JSON.parse((_g = files.get("".concat(MEMORY, "/seen.json"))) !== null && _g !== void 0 ? _g : '{}').version).toBe('0.1.0');
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: 'Updated to Claudopus 0.1.0' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 7:
                _d.apply(void 0, [_h.sent()]).toBe(true);
                // A load of the same version again shows nothing
                return [4 /*yield*/, pane.unmount()];
            case 8:
                // A load of the same version again shows nothing
                _h.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 9:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 10:
                again = _h.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, again.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Stats'; })];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_h.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, again.find({ type: 'Text', text: 'Updated to Claudopus 0.1.0' })];
            case 12:
                _f.apply(void 0, [_h.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('a first install starts the record of changes seen at its own version, and shows no update screen', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, pane, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                files = world(on, { changelog: CHANGELOG }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                expect(JSON.parse((_c = files.get("".concat(MEMORY, "/seen.json"))) !== null && _c !== void 0 ? _c : '{}').version).toBe('0.1.0');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 60 }), surface: 'desktop' }))];
            case 2:
                pane = _d.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Stats'; })];
                        }
                    }); }); })];
            case 3:
                _a.apply(void 0, [_d.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Updated to Claudopus 0.1.0' })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
// "Nothing to show yet": the app asks a tab for its drawing as it shows it, and asks again only when told something changed; one
// empty answer (the chat out of reach that moment) left Stats, About or a result empty for good, as none of them reads anything that
// changes. A tab open and never asked for since is drawn again until it is
test('a tab opened but not asked for its drawing is drawn again within seconds, and one asked for costs nothing more', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, clock, redraws, pane, before, asked;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }];
                clock = world(on, { live: live }).clock;
                redraws = 0;
                on('ui.invalidate', function () { return ((redraws += 1), { value: undefined }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                pane = _a.sent();
                return [4 /*yield*/, pressed(pane, 'about-open')];
            case 3:
                _a.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 4:
                _a.sent();
                before = redraws;
                // The app's ask for About never came: two seconds on, the mod draws again, and asks the app to
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                // The app's ask for About never came: two seconds on, the mod draws again, and asks the app to
                _a.sent();
                expect(redraws).toBeGreaterThan(before);
                // Opened again and asked for at once: no redraw of its own follows
                return [4 /*yield*/, pressed(pane, 'about-open')];
            case 6:
                // Opened again and asked for at once: no redraw of its own follows
                _a.sent();
                return [4 /*yield*/, clock.advance(100)];
            case 7:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'about', props: __assign(__assign({}, LIST.props), { title: 'About', bodyColumns: 80 }), surface: 'desktop' }))];
            case 8:
                _a.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 9:
                _a.sent();
                asked = redraws;
                return [4 /*yield*/, clock.advance(20000)];
            case 10:
                _a.sent();
                expect(redraws).toBe(asked);
                return [2 /*return*/];
        }
    });
}); });
test('a tab left open as the mod loads, after an update or a reload, is drawn again if the app does not ask for it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, clock, redraws, before;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: false, isPlaced: false }, { id: 'stats', isShown: false, isPlaced: false }];
                clock = world(on, { live: live }).clock;
                redraws = 0;
                on('ui.invalidate', function () { return ((redraws += 1), { value: undefined }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, clock.advance(500)];
            case 2:
                _a.sent();
                before = redraws;
                return [4 /*yield*/, clock.advance(2000)];
            case 3:
                _a.sent();
                expect(redraws).toBeGreaterThan(before);
                // Four times at most, while nothing asks for it: a tab behind the others is never asked for
                return [4 /*yield*/, clock.advance(60000)];
            case 4:
                // Four times at most, while nothing asks for it: a tab behind the others is never asked for
                _a.sent();
                expect(redraws - before).toBeLessThanOrEqual(4);
                return [2 /*return*/];
        }
    });
}); });
