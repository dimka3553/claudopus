// F-019 and F-020 of the security review, and the update's steps: a look only reads the version page and the panel says a newer
// version is out; nothing is fetched, moved or reloaded until a press (a chat run from Claudopus's own checkout has two, Update and
// Reload); a download that is not what the release published is thrown away and never moves anything; uncommitted work is never
// overwritten; each step stands through a reload; a lock dated ahead holds nothing
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
test('F-019 · the look only reads the version page: the panel says a newer version is out, with Update, and nothing is fetched, installed or reloaded, whatever config.json says', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, fetches, _b, panel, _c, _d, _f, aged, _g, before;
    var _this = this;
    var _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                fetches = pageOn(on, function () { return pageText(); });
                // Keys an earlier version or a planted file might use to ask for installing by itself: none of them is read
                ownSet(files, 'config.json', JSON.stringify({ updates: true, updateEvery: 1, autoInstall: true, autoUpdate: true, install: 'always' }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _j.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fetches() || undefined];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_j.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 4:
                panel = _j.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 5:
                _j.sent();
                _c = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: '· 2 versions since v0.1.0' })];
            case 6:
                _c.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, shownIn(panel, 'The bar shows the battery · and 3 more changes')];
            case 7:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, keyed(panel, 'update-download')];
            case 8:
                _d.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.props.label]).toBe('Update');
                _f = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 9:
                _f.apply(void 0, [_j.sent()]).toBeUndefined();
                aged = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b, _c, _d, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                _b = (_a = files).set;
                                _c = ["".concat(MEMORY, "/update-seen.json")];
                                _f = (_d = JSON).stringify;
                                _g = {};
                                return [4 /*yield*/, clock.now()];
                            case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_f.apply(_d, [(_g.at = (_h.sent()) - 2 * 3600000, _g.version = '0.1.2', _g.result = 'seen', _g)])]))];
                        }
                    });
                }); };
                return [4 /*yield*/, aged()];
            case 10:
                _j.sent();
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 11:
                _j.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (fetches() > 1 ? true : undefined)];
                    }); }); })];
            case 12:
                _g.apply(void 0, [_j.sent()]).toBe(true);
                expect(changing(gitRan)).toEqual([]);
                expect(files.get('manifest')).toBeUndefined();
                expect(reloads).toEqual([]);
                expect(files.get("".concat(MEMORY, "/update-steps.json"))).toBeUndefined();
                // Only when I ask: the look reads nothing more
                ownSet(files, 'config.json', JSON.stringify({ updates: false }));
                before = fetches();
                return [4 /*yield*/, aged()];
            case 13:
                _j.sent();
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 14:
                _j.sent();
                expect(fetches()).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
test('Update fetches the release and checks it against what the release published: one that does not match is thrown away and moves nothing', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, panel, _b, _c, _d, _f, _g, _h, again, _j;
    var _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on, { release: __assign(__assign({}, RELEASE), { got: 'b'.repeat(40) }) }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                pageOn(on, function () { return pageText(); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _l.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _l.sent();
                return [4 /*yield*/, pressed(panel, 'update-download')];
            case 5:
                _l.sent();
                return [4 /*yield*/, shownIn(panel, "Couldn't update Claudopus 0.1.2")];
            case 6:
                _l.sent();
                return [4 /*yield*/, shownIn(panel, "What was downloaded isn't what the release published, so it was thrown away. Nothing changed: this chat still runs v0.1.0.")];
            case 7:
                _l.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 8:
                _b.apply(void 0, [_l.sent()]).toBeUndefined();
                expect(gitRan).toContain('update-ref -d refs/claudopus/update');
                // A steps file that says it was downloaded, planted or left from before: the panel checks the download it names, finds it is not
                // the release's tree, and offers no Install (Install itself checks again, in update.test.tsx)
                _d = (_c = files).set;
                _f = ["".concat(MEMORY, "/update-steps.json")];
                _h = (_g = JSON).stringify;
                _k = { version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE };
                return [4 /*yield*/, clock.now()];
            case 9:
                // A steps file that says it was downloaded, planted or left from before: the panel checks the download it names, finds it is not
                // the release's tree, and offers no Install (Install itself checks again, in update.test.tsx)
                _d.apply(_c, _f.concat([_h.apply(_g, [(_k.at = _l.sent(), _k)])]));
                files.set('git:ref', COMMIT);
                return [4 /*yield*/, panel.unmount()];
            case 10:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 11:
                again = _l.sent();
                return [4 /*yield*/, shownIn(again, 'Claudopus 0.1.2 is out')];
            case 12:
                _l.sent();
                _j = expect;
                return [4 /*yield*/, keyed(again, 'update-install')];
            case 13:
                _j.apply(void 0, [_l.sent()]).toBeUndefined();
                expect(gitRan.some(function (one) { return one.startsWith('merge '); })).toBe(false);
                expect(files.get('manifest')).toBeUndefined();
                expect(reloads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('Update is one press for a chat run from its checkout: the fetch, its check, then a fast-forward; then the header says, beside the version, to type /reload-plugins, and nothing reloads the chat', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, panel, fetched, checked, merged, _b, _c, _d, _f;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                pageOn(on, function () { return pageText(); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _j.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _j.sent();
                expect(changing(gitRan)).toEqual([]);
                return [4 /*yield*/, pressed(panel, 'update-download')];
            case 5:
                _j.sent();
                return [4 /*yield*/, shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')
                    // One press: fetched, checked against the release's tree, and only then moved forward, fast-forward only
                ];
            case 6:
                _j.sent();
                fetched = gitRan.findIndex(function (one) { return one.includes('fetch'); });
                checked = gitRan.findIndex(function (one) { return one.includes("".concat(COMMIT, ":mods/claudopus")); });
                merged = gitRan.indexOf("merge --ff-only --quiet ".concat(COMMIT));
                expect(fetched >= 0 && checked > fetched && merged > checked).toBe(true);
                expect(gitRan.some(function (one) { return /^(reset|checkout|pull)\b/.test(one); })).toBe(false);
                expect(JSON.parse((_g = files.get('manifest')) !== null && _g !== void 0 ? _g : '{}').version).toBe('0.1.2');
                expect(JSON.parse((_h = files.get("".concat(MEMORY, "/update-steps.json"))) !== null && _h !== void 0 ? _h : '{}')).toMatchObject({ version: '0.1.2', stage: 'installed', commit: COMMIT, tree: TREE });
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 7:
                _b.apply(void 0, [_j.sent()]).toBeUndefined();
                _c = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: UPDATE_JARGON })];
            case 8:
                _c.apply(void 0, [_j.sent()]).toBeUndefined();
                // No box and no press is left: only the line beside the version, and the chat is never reloaded for the person
                _d = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: /^Claudopus 0\.1\.2/ })];
            case 9:
                // No box and no press is left: only the line beside the version, and the chat is never reloaded for the person
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, panel.findAll({ type: 'Button' })];
            case 10:
                _f.apply(void 0, [(_j.sent()).some(function (one) { var _a; return /^update-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toBe(false);
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 11:
                _j.sent();
                expect(reloads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('Update pressed while a look reads the version page waits for the look to end, then updates: before, the press did nothing', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, slow, isReading, panel, _b, _c, _d, _f, _g, s;
    var _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock;
                slow = false;
                isReading = false;
                on('http.fetch', function (engine, _e) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!slow) return [3 /*break*/, 2];
                                (slow = false), (isReading = true);
                                return [4 /*yield*/, new Promise(function (done) { return void engine.clock.after(20000, function () { return ((isReading = false), done()); }); })];
                            case 1:
                                (_a.sent());
                                _a.label = 2;
                            case 2: return [2 /*return*/, { value: { status: 200, ok: true, headers: {}, text: pageText() } }];
                        }
                    });
                }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _j.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _j.sent();
                slow = true;
                _c = (_b = files).set;
                _d = ["".concat(MEMORY, "/update-seen.json")];
                _g = (_f = JSON).stringify;
                _h = {};
                return [4 /*yield*/, clock.now()];
            case 5:
                _c.apply(_b, _d.concat([_g.apply(_f, [(_h.at = (_j.sent()) - 2 * 3600000, _h.version = '0.1.2', _h.result = 'seen', _h)])]));
                s = 0;
                _j.label = 6;
            case 6:
                if (!(s < 20 * 60 && !isReading)) return [3 /*break*/, 9];
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _j.sent();
                _j.label = 8;
            case 8:
                s++;
                return [3 /*break*/, 6];
            case 9:
                expect(isReading).toBe(true);
                return [4 /*yield*/, pressed(panel, 'update-download')];
            case 10:
                _j.sent();
                expect(isReading).toBe(true);
                return [4 /*yield*/, clock.advance(30000)];
            case 11:
                _j.sent();
                return [4 /*yield*/, shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')];
            case 12:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
// What updating says speaks only of versions, Update and /reload-plugins: never of where the code sits or how git moves it
var UPDATE_JARGON = /folder|checkout|fetch|forward|detached|brought|commit|\bmain\b|branch|worktree|\bgit\b|fingerprint|marketplace|~\/|\/Users\//i;
// Update never overwrites uncommitted work nor moves a main with commits of its own: it says why it could not move forward, and nothing moves
var STAYS = [
    { name: 'uncommitted changes the move would overwrite', release: __assign(__assign({}, RELEASE), { overwrite: true }), said: 'Your copy of Claudopus has changes of its own in files this version changes, so updating would lose them: ask a chat to set them aside, then press Try again. Nothing changed: this chat still runs v0.1.0.' },
    { name: 'a newer version out between its fetch and its move', release: RELEASE, isNewerAfterFetch: true, title: 'Claudopus 0.1.3 is out', said: 'The bar shows the battery · and 3 more changes' },
    { name: 'a main with commits of its own', release: __assign(__assign({}, RELEASE), { ownCommits: true }), said: "Your copy of Claudopus has changes of its own that this version doesn't have, so Update leaves it as it is. Nothing changed: this chat still runs v0.1.0." },
];
var _loop_1 = function (one) {
    test("Update with ".concat(one.name, ": it says why it could not move forward, and nothing is overwritten or moved"), SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
        var _a, files, clock, gitRan, reloads, panel, _b, _c, _d;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = world(on, { release: one.release }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                    reloads = reloadsOf(on);
                    // The move reads the version page again: one naming a newer version by then moves nothing
                    pageOn(on, function () { return (one.isNewerAfterFetch && gitRan.some(function (ran) { return ran.includes('fetch'); }) ? pageText('0.1.3') : pageText()); });
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, clock.advance(3 * 60000)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, $.ui.mount(listAt())];
                case 3:
                    panel = _g.sent();
                    return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, pressed(panel, 'update-download')
                        // Said why, or the newer version offered in its place
                    ];
                case 5:
                    _g.sent();
                    // Said why, or the newer version offered in its place
                    return [4 /*yield*/, shownIn(panel, (_f = one.title) !== null && _f !== void 0 ? _f : "Couldn't update Claudopus 0.1.2")];
                case 6:
                    // Said why, or the newer version offered in its place
                    _g.sent();
                    return [4 /*yield*/, shownIn(panel, one.said)];
                case 7:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, panel.find({ type: 'Text', text: UPDATE_JARGON })];
                case 8:
                    _b.apply(void 0, [_g.sent()]).toBeUndefined();
                    // A merge is tried only where git itself refuses to overwrite: a fast-forward that stops before touching a changed file
                    expect(gitRan.some(function (ran) { return ran.startsWith('merge '); })).toBe(Boolean(one.release.overwrite));
                    expect(gitRan.some(function (ran) { return /^(reset|checkout|pull|stash)\b/.test(ran) || ran.includes('--force') || ran.includes('--hard'); })).toBe(false);
                    expect(files.get('manifest')).toBeUndefined();
                    _c = expect;
                    return [4 /*yield*/, keyed(panel, 'update-reload')];
                case 9:
                    _c.apply(void 0, [_g.sent()]).toBeUndefined();
                    _d = expect;
                    return [4 /*yield*/, keyed(panel, one.title ? 'update-download' : 'update-again')];
                case 10:
                    _d.apply(void 0, [_g.sent()]).toBeDefined();
                    expect(reloads).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var _i = 0, STAYS_1 = STAYS; _i < STAYS_1.length; _i++) {
    var one = STAYS_1[_i];
    _loop_1(one);
}
test('each step stands through a reload: a chat that loads finds the download waiting for Update, a step cut short said as stopped, and a copy newer than it runs told to type /reload-plugins', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, panel, _b, stopped, _c, behind;
    var _d;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                pageOn(on, function () { return pageText(); });
                files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }));
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: COMMIT, tree: TREE, at: UPD_NOW - 5 * 3600000 }));
                files.set('git:ref', COMMIT);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(listAt())
                    // Fetched by a copy before Update was one press, or planted: offered as any version out, with what is new, and nothing moves until
                    // its Update is pressed
                ];
            case 2:
                panel = _f.sent();
                // Fetched by a copy before Update was one press, or planted: offered as any version out, with what is new, and nothing moves until
                // its Update is pressed
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 3:
                // Fetched by a copy before Update was one press, or planted: offered as any version out, with what is new, and nothing moves until
                // its Update is pressed
                _f.sent();
                return [4 /*yield*/, shownIn(panel, 'The bar shows the battery · and 3 more changes')];
            case 4:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 5:
                _b.apply(void 0, [(_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.props.label]).toBe('Update');
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 6:
                _f.sent();
                expect(gitRan.some(function (one) { return one.startsWith('merge '); })).toBe(false);
                expect(files.get('manifest')).toBeUndefined();
                // A download whose chat closed mid-way
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloading', at: UPD_NOW - 10 * 60000, pct: 40 }));
                return [4 /*yield*/, panel.unmount()];
            case 7:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 8:
                stopped = _f.sent();
                return [4 /*yield*/, shownIn(stopped, 'It stopped before it finished, when its chat closed or reloaded.')];
            case 9:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, keyed(stopped, 'update-again')];
            case 10:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                // The folder already has the newer version: what is left is this chat's reload
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: '0.1.2' }));
                return [4 /*yield*/, stopped.unmount()];
            case 11:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 12:
                behind = _f.sent();
                return [4 /*yield*/, shownIn(behind, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')];
            case 13:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a steps file that says a download was checked, with no such download in the repo, is not believed: the panel offers the download again', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, panel, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on, { release: RELEASE }).files;
                pageOn(on, function () { return pageText(); });
                files.set("".concat(MEMORY, "/update-seen.json"), JSON.stringify({ at: UPD_NOW, version: '0.1.2', result: 'seen' }));
                files.set("".concat(MEMORY, "/update-steps.json"), JSON.stringify({ version: '0.1.2', stage: 'downloaded', commit: 'f'.repeat(40), tree: TREE, at: UPD_NOW }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 2:
                panel = _b.sent();
                return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
            case 3:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 4:
                _a.apply(void 0, [_b.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('Not now keeps a version quiet for a day, Skip this version until a newer one; the terminal shows the same notice', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, version, panel, _b, put, _c, _d, _f, _g, _h, _j, _k, day, _l, _m, _o, _p, _q, _r, term;
    var _s, _t;
    var _this = this;
    var _u, _v, _w, _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                _a = world(on, { release: RELEASE }), files = _a.files, clock = _a.clock;
                version = '0.1.2';
                pageOn(on, function () { return pageText(version); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _y.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 3:
                panel = _y.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _y.sent();
                return [4 /*yield*/, pressed(panel, 'update-later-available')];
            case 5:
                _y.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 6:
                _b.apply(void 0, [_y.sent()]).toBe(true);
                put = JSON.parse((_u = files.get("".concat(MEMORY, "/update-later.json"))) !== null && _u !== void 0 ? _u : '{}');
                expect(put.version).toBe('0.1.2');
                _c = expect;
                _d = ((_v = put.until) !== null && _v !== void 0 ? _v : 0);
                return [4 /*yield*/, clock.now()];
            case 7:
                _c.apply(void 0, [_d - (_y.sent())]).toBe(24 * 3600000);
                // A day on, it shows again
                _g = (_f = files).set;
                _h = ["".concat(MEMORY, "/update-later.json")];
                _k = (_j = JSON).stringify;
                _s = { version: '0.1.2' };
                return [4 /*yield*/, clock.now()];
            case 8:
                // A day on, it shows again
                _g.apply(_f, _h.concat([_k.apply(_j, [(_s.until = (_y.sent()) - 1, _s)])]));
                return [4 /*yield*/, panel.unmount()];
            case 9:
                _y.sent();
                return [4 /*yield*/, $.ui.mount(listAt())];
            case 10:
                day = _y.sent();
                return [4 /*yield*/, shownIn(day, 'Claudopus 0.1.2 is out')];
            case 11:
                _y.sent();
                return [4 /*yield*/, pressed(day, 'update-skip-available')];
            case 12:
                _y.sent();
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, day.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 13:
                _l.apply(void 0, [_y.sent()]).toBe(true);
                expect(JSON.parse((_w = files.get("".concat(MEMORY, "/config.json"))) !== null && _w !== void 0 ? _w : '{}').skipVersion).toBe('0.1.2');
                version = '0.1.3';
                _o = (_m = files).set;
                _p = ["".concat(MEMORY, "/update-seen.json")];
                _r = (_q = JSON).stringify;
                _t = {};
                return [4 /*yield*/, clock.now()];
            case 14:
                _o.apply(_m, _p.concat([_r.apply(_q, [(_t.at = (_y.sent()) - 2 * 3600000, _t.version = '0.1.2', _t.result = 'seen', _t)])]));
                return [4 /*yield*/, later(clock, 16 * 60000)];
            case 15:
                _y.sent();
                expect(JSON.parse((_x = files.get("".concat(MEMORY, "/update-seen.json"))) !== null && _x !== void 0 ? _x : '{}').version).toBe('0.1.3');
                return [4 /*yield*/, $.ui.mount(listAt('terminal'))];
            case 16:
                term = _y.sent();
                return [4 /*yield*/, shownIn(term, 'Claudopus 0.1.3 is out')];
            case 17:
                _y.sent();
                return [2 /*return*/];
        }
    });
}); });
// A chat whose code Update must leave alone is told so in plain words, and offered no download
var LEFT_ALONE = [
    { name: 'a build a piece of work is changing', release: __assign(__assign({}, RELEASE), { worktree: true }), said: 'This chat runs a build of Claudopus that a task is changing: Update leaves it alone; it gets the newest version when that task merges it in.' },
    { name: 'a test build', release: __assign(__assign({}, RELEASE), { noBranch: true }), said: 'This chat runs a test build of Claudopus: Update leaves it alone.' },
];
var _loop_2 = function (one) {
    test("a chat run from ".concat(one.name, " is told Update leaves it alone, and offered no download"), SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
        var _a, clock, gitRan, panel, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = world(on, { release: one.release }), clock = _a.clock, gitRan = _a.gitRan;
                    pageOn(on, function () { return pageText(); });
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, clock.advance(3 * 60000)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, $.ui.mount(listAt())];
                case 3:
                    panel = _d.sent();
                    return [4 /*yield*/, shownIn(panel, 'Claudopus 0.1.2 is out')];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, shownIn(panel, one.said)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, panel.find({ type: 'Text', text: UPDATE_JARGON })];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBeUndefined();
                    _c = expect;
                    return [4 /*yield*/, keyed(panel, 'update-download')];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBeUndefined();
                    expect(changing(gitRan)).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var _a = 0, LEFT_ALONE_1 = LEFT_ALONE; _a < LEFT_ALONE_1.length; _a++) {
    var one = LEFT_ALONE_1[_a];
    _loop_2(one);
}
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
                return [4 /*yield*/, shownIn(panel, 'v0.1.0 · v0.1.2 ready, type /reload-plugins')];
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
