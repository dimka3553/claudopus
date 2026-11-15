// F-019 and F-020 of the security review, and the update's three steps: a look only reads the version page and the panel says a
// newer version is out; nothing is fetched, installed or reloaded until a press, each step its own; a download that is not what the
// release published is thrown away and can never be installed; each step stands through a reload; a lock dated ahead holds nothing
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
var UPD_NOW = 1700000000000;
var TREE = 'a'.repeat(40);
var COMMIT = 'c'.repeat(40);
var RELEASE = { version: '0.1.2', commit: COMMIT, tree: TREE };
var pageText = function (version, tree) {
    if (version === void 0) { version = '0.1.2'; }
    if (tree === void 0) { tree = TREE; }
    return JSON.stringify({ version: version, tree: tree, size: 4200000, versions: [{ version: version, line: 'The bar shows the battery', more: 2 }, { version: '0.1.1', line: 'Runs show time left', more: 0 }, { version: '0.1.0', line: 'First', more: 0 }] });
};
var reloadsOf = function (on) {
    var reloads = [];
    on('command.run', { command: 'reload-plugins' }, function () { return (reloads.push('reload-plugins'), { value: { text: 'Reloaded' } }); });
    return reloads;
};
var pageOn = function (on, text) {
    var fetches = 0;
    on('http.fetch', function () { return ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: text() } }); });
    return function () { return fetches; };
};
var listAt = function (surface) {
    if (surface === void 0) { surface = 'desktop'; }
    return (__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 70 }), surface: surface }));
};
// The text shown, or a failure that lists what is shown instead
var shownIn = function (pane, text) { return __awaiter(_this, void 0, void 0, function () {
    var found, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, until(function () { return pane.find({ type: 'Text', text: text }); })];
            case 1:
                found = _d.sent();
                if (!!found) return [3 /*break*/, 3];
                _a = Error.bind;
                _c = (_b = "not shown: ".concat(String(text), "; shown: ")).concat;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [(_d.sent()).map(function (one) { return String(one.text); }).join(' | ').slice(0, 1200)])]))();
            case 3: return [2 /*return*/, found];
        }
    });
}); };
// Time on, in steps the kit's clock can take with the panel's one-second beat running
var later = function (clock, ms) { return __awaiter(_this, void 0, void 0, function () {
    var left;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                left = ms;
                _a.label = 1;
            case 1:
                if (!(left > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, clock.advance(Math.min(left, 20 * 60000))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                left -= 20 * 60000;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var changing = function (ran) { return ran.filter(function (one) { return /^(fetch|merge|reset|checkout|pull|update-ref)\b/.test(one) || one.includes('fetch --progress'); }); };
test('F-019 · the look only reads the version page: the panel says a newer version is out, with Download, and nothing is fetched, installed or reloaded, whatever config.json says', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, fetches, _b, panel, _c, _d, _e, aged, _f, before;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                fetches = pageOn(on, function () { return pageText(); });
                // Keys an earlier version or a planted file might use to ask for installing by itself: none of them is read
                ownSet(files, 'config.json', JSON.stringify({ updates: true, updateEvery: 1, autoInstall: true, autoUpdate: true, install: 'always' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fetches() || undefined];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_g.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 4:
                panel = _g.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 5:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: '· 2 versions since v0.1.0' })];
            case 6:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, shownIn(panel, 'The bar shows the battery · and 3 more changes')];
            case 7:
                _g.sent();
                _d = expect;
                return [4 /*yield*/, keyed(panel, 'update-download')];
            case 8:
                _d.apply(void 0, [_g.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 9:
                _e.apply(void 0, [_g.sent()]).toBeUndefined();
                aged = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                _b = (_a = files).set;
                                _c = ["".concat(MEMORY, "/update-seen.json")];
                                _e = (_d = JSON).stringify;
                                _f = {};
                                return [4 /*yield*/, clock.now()];
                            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_e.apply(_d, [(_f.at = (_g.sent()) - 2 * 3600000, _f.version = '0.1.2', _f.result = 'seen', _f)])]))];
                        }
                    });
                }); };
                return [4 /*yield*/, aged()];
            case 10:
                _g.sent();
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 11:
                _g.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (fetches() > 1 ? true : undefined)];
                    }); }); })];
            case 12:
                _f.apply(void 0, [_g.sent()]).toBe(true);
                expect(changing(gitRan)).toEqual([]);
                expect(files.get('manifest')).toBeUndefined();
                expect(reloads).toEqual([]);
                expect(files.get("".concat(MEMORY, "/update-steps.json"))).toBeUndefined();
                // Only when I ask: the look reads nothing more
                ownSet(files, 'config.json', JSON.stringify({ updates: false }));
                before = fetches();
                return [4 /*yield*/, aged()];
            case 13:
                _g.sent();
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 14:
                _g.sent();
                expect(fetches()).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
test('Download fetches the release and checks it against what the release published: one that does not match is thrown away and cannot be installed', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, panel, _b, _c, _d, _e, _f, _g, again, _h;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on, { release: __assign(__assign({}, RELEASE), { got: 'b'.repeat(40) }) }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                pageOn(on, function () { return pageText(); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _k.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _k.sent();
                return [4 /*yield*/, pressed(panel, 'update-download')];
            case 5:
                _k.sent();
                return [4 /*yield*/, shownIn(panel, "Couldn't fetch Claudopus 0.1.2")];
            case 6:
                _k.sent();
                return [4 /*yield*/, shownIn(panel, "What came down isn't what the release published, so it was thrown away. Nothing was changed: this chat still runs v0.1.0.")];
            case 7:
                _k.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 8:
                _b.apply(void 0, [_k.sent()]).toBeUndefined();
                expect(gitRan).toContain('update-ref -d refs/claudopus/update');
                // A steps file that says it was downloaded, planted or left from before: the panel checks the download it names, finds it is not
                // the release's tree, and offers no Install (Install itself checks again, in update.test.tsx)
                _d = (_c = files).set;
                _e = ["".concat(MEMORY, "/update-steps.json")];
                _g = (_f = JSON).stringify;
                _j = { version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE };
                return [4 /*yield*/, clock.now()];
            case 9:
                // A steps file that says it was downloaded, planted or left from before: the panel checks the download it names, finds it is not
                // the release's tree, and offers no Install (Install itself checks again, in update.test.tsx)
                _d.apply(_c, _e.concat([_g.apply(_f, [(_j.at = _k.sent(), _j)])]));
                files.set('git:ref', COMMIT);
                return [4 /*yield*/, panel.unmount()];
            case 10:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 11:
                again = _k.sent();
                return [4 /*yield*/, shownIn(again, 'Claudopus 0.1.2 is out')];
            case 12:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, keyed(again, 'update-install')];
            case 13:
                _h.apply(void 0, [_k.sent()]).toBeUndefined();
                expect(gitRan.some(function (one) { return one.startsWith('merge '); })).toBe(false);
                expect(files.get('manifest')).toBeUndefined();
                expect(reloads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('Download, Install and Reload are each their own press: the folder moves only at Install, the chat reloads only at Reload', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, panel, _b, _c, _d, _e, _f, _g, mark;
    var _h;
    var _this = this;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                pageOn(on, function () { return pageText(); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _m.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _m.sent();
                return [4 /*yield*/, pressed(panel, 'update-download')];
            case 5:
                _m.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 fetched')];
            case 6:
                _m.sent();
                return [4 /*yield*/, shownIn(panel, /^Checked against the release\. Move forward takes .* from v0\.1\.0 to v0\.1\.2, fast-forward only\.$/)];
            case 7:
                _m.sent();
                expect(JSON.parse((_j = files.get("".concat(MEMORY, "/update-steps.json"))) !== null && _j !== void 0 ? _j : '{}')).toMatchObject({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE });
                // Downloaded, nothing the chat runs has moved
                expect(gitRan.some(function (one) { return one.startsWith('merge '); })).toBe(false);
                expect(files.get('manifest')).toBeUndefined();
                _c = (_b = files).set;
                _d = ["".concat(MEMORY, "/update-seen.json")];
                _f = (_e = JSON).stringify;
                _h = {};
                return [4 /*yield*/, clock.now()];
            case 8:
                _c.apply(_b, _d.concat([_f.apply(_e, [(_h.at = (_m.sent()) - 2 * 3600000, _h.version = '0.1.2', _h.result = 'seen', _h)])]));
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 9:
                _m.sent();
                expect(gitRan.some(function (one) { return one.startsWith('merge '); })).toBe(false);
                return [4 /*yield*/, pressed(panel, 'update-install')];
            case 10:
                _m.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is in the folder')];
            case 11:
                _m.sent();
                expect(gitRan).toContain("merge --ff-only --quiet ".concat(COMMIT));
                expect(JSON.parse((_k = files.get('manifest')) !== null && _k !== void 0 ? _k : '{}').version).toBe('0.1.2');
                return [4 /*yield*/, shownIn(panel, /^This chat still runs v0\.1\.0\. Every chat run from/)];
            case 12:
                _m.sent();
                expect(reloads).toEqual([]);
                return [4 /*yield*/, pressed(panel, 'update-reload')];
            case 13:
                _m.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, reloads.length || undefined];
                    }); }); })];
            case 14:
                _g.apply(void 0, [_m.sent()]).toBe(1);
                mark = (_l = __spreadArray([], files.entries(), true).find(function (_a) {
                    var path = _a[0];
                    return path.startsWith("".concat(MEMORY, "/reloads/"));
                })) === null || _l === void 0 ? void 0 : _l[1];
                expect(JSON.parse(mark !== null && mark !== void 0 ? mark : '{}')).toMatchObject({ version: '0.1.2', from: '0.1.0' });
                return [2 /*return*/];
        }
    });
}); });
test('each step stands through a reload: a chat that loads finds the download waiting for Install, a step cut short said as stopped, and a copy newer than it runs offered its Reload', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, panel, _b, stopped, _c, behind, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock;
                pageOn(on, function () { return pageText(); });
                files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }));
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: UPD_NOW - 5 * 3600000 }));
                files.set('git:ref', COMMIT);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 2:
                panel = _e.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 fetched')];
            case 3:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                // A download whose chat closed mid-way
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloading', at: UPD_NOW - 10 * 60000, pct: 40 }));
                return [4 /*yield*/, panel.unmount()];
            case 5:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 6:
                stopped = _e.sent();
                return [4 /*yield*/, shownIn(stopped, 'It stopped before it finished, when its chat closed or reloaded.')];
            case 7:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, keyed(stopped, 'update-again')];
            case 8:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                // The folder already has the newer version: what is left is this chat's reload
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.2' }));
                return [4 /*yield*/, stopped.unmount()];
            case 9:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 10:
                behind = _e.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return keyed(behind, 'update-reload'); })];
            case 11:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('a steps file that says a download was checked, with no such download in the repo, is not believed: the panel offers the download again', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, panel, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = world(on, { release: RELEASE }).files;
                pageOn(on, function () { return pageText(); });
                files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }));
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: 'f'.repeat(40), tree: TREE, at: UPD_NOW }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 2:
                panel = _c.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 3:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: 'Claudopus 0.1.2 fetched' })];
            case 4:
                _a.apply(void 0, [_c.sent()]).toBeUndefined();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('Not now keeps a version quiet for a day, Skip this version until a newer one; the terminal shows the same notice', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, version, panel, _b, put, _c, _d, _e, _f, _g, _h, _j, day, _k, _l, _m, _o, _p, _q, term;
    var _r, _s;
    var _this = this;
    var _t, _u, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock;
                version = '0.1.2';
                pageOn(on, function () { return pageText(version); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _x.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _x.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _x.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _x.sent();
                return [4 /*yield*/, pressed(panel, 'update-later-available')];
            case 5:
                _x.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 6:
                _b.apply(void 0, [_x.sent()]).toBe(true);
                put = JSON.parse((_t = files.get("".concat(MEMORY, "/update-later.json"))) !== null && _t !== void 0 ? _t : '{}');
                expect(put.version).toBe('0.1.2');
                _c = expect;
                _d = ((_u = put.until) !== null && _u !== void 0 ? _u : 0);
                return [4 /*yield*/, clock.now()];
            case 7:
                _c.apply(void 0, [_d - (_x.sent())]).toBe(24 * 3600000);
                // A day on, it shows again
                _f = (_e = files).set;
                _g = ["".concat(MEMORY, "/update-later.json")];
                _j = (_h = JSON).stringify;
                _r = { version: '0.1.2' };
                return [4 /*yield*/, clock.now()];
            case 8:
                // A day on, it shows again
                _f.apply(_e, _g.concat([_j.apply(_h, [(_r.until = (_x.sent()) - 1, _r)])]));
                return [4 /*yield*/, panel.unmount()];
            case 9:
                _x.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 10:
                day = _x.sent();
                return [4 /*yield*/, shownIn(day, 'Claudopus 0.1.2 is out')];
            case 11:
                _x.sent();
                return [4 /*yield*/, pressed(day, 'update-skip-available')];
            case 12:
                _x.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, day.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 13:
                _k.apply(void 0, [_x.sent()]).toBe(true);
                expect(JSON.parse((_v = files.get("".concat(MEMORY, "/config.json"))) !== null && _v !== void 0 ? _v : '{}').skipVersion).toBe('0.1.2');
                version = '0.1.3';
                _m = (_l = files).set;
                _o = ["".concat(MEMORY, "/update-seen.json")];
                _q = (_p = JSON).stringify;
                _s = {};
                return [4 /*yield*/, clock.now()];
            case 14:
                _m.apply(_l, _o.concat([_q.apply(_p, [(_s.at = (_x.sent()) - 2 * 3600000, _s.version = '0.1.2', _s.result = 'seen', _s)])]));
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 15:
                _x.sent();
                expect(JSON.parse((_w = files.get("".concat(MEMORY, "/update-seen.json"))) !== null && _w !== void 0 ? _w : '{}').version).toBe('0.1.3');
                return [4 /*yield*/, $.ui.mount(listAt('terminal'))];
            case 16:
                term = _x.sent();
                return [4 /*yield*/, shownIn(term, 'Claudopus 0.1.3 is out')];
            case 17:
                _x.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a chat run from a worktree of the code is told a release never reaches it, and offered no download', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, gitRan, panel, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { release: __assign(__assign({}, RELEASE), { worktree: true }) }), clock = _a.clock, gitRan = _a.gitRan;
                pageOn(on, function () { return pageText(); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _c.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 4:
                _c.sent();
                return [4 /*yield*/, shownIn(panel, 'This chat runs from a worktree of the code, on branch fix-bar: it gets a release only when main is merged into it.')];
            case 5:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-download')];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                expect(changing(gitRan)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('F-019 · a chat run from another Mac moves at Install but is not sent a reload: it says to type /reload-plugins', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, reloads, panel, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { release: RELEASE, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock;
                reloads = reloadsOf(on);
                pageOn(on, function () { return pageText(); });
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.0' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _c.sent();
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.2' }));
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _c.sent();
                return [4 /*yield*/, shownIn(panel, 'This chat still runs v0.1.0. Type /reload-plugins in this chat to switch it.')];
            case 4:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-reload')];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                expect(reloads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('F-020 · a lock on the update dated ahead of this clock holds nothing: the look reads the page all the same', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, fetches, _b, panel, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                fetches = pageOn(on, function () { return pageText('0.1.0'); });
                files.set("".concat(MEMORY, "/update.lock"), "".concat(UPD_NOW + 365 * 24 * 3600000, " planted"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fetches() || undefined];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_d.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 4:
                panel = _d.sent();
                _c = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: /is out$/ })];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
