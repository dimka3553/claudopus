// Updates as the person asks for them. A look only reads the version page on claudopus.ai, on its own as often as Config says or
// only at Config's Check now, and the panel's header then says a newer version is out, quietly, in one small box. Each step is a
// press: Download fetches the release and checks it is what the release published, Install puts it in place (Claude Code's own
// steps for an installed copy). A chat run from a folder of the code has one press, Update, for both: the fetch, its check, then a
// fast-forward only once the check holds. Then the header says, beside the version, to type /reload-plugins, which switches the
// chat. Not now and Skip this version keep it quiet.
// The pure parts are in hooks/update.ts
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
// ---- One at a time, under a lock the other chats see ----
// A look and each step run one at a time, under a lock the other chats see; the look keeps what it saw in update-seen.json (a
// version number only), the steps where they stand in update-steps.json
var isUpdating = false;
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-step is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
var UPDATE_BUSY = 'busy';
var LOCK_SKEW = 60000;
var underUpdateLock = function ($, act) { return __awaiter(_this, void 0, void 0, function () {
    var lock, token, _a, take, now, at, _b, _c, seen, aside;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                lock = "".concat(dir, "/update.lock");
                _a = "".concat;
                return [4 /*yield*/, $.clock.now()];
            case 1:
                token = _a.apply("", [_e.sent(), " "]).concat(Math.random().toString(36).slice(2)).concat(Math.random().toString(36).slice(2));
                take = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(function () { return ({ exitCode: 1 }); })];
                        case 1: return [2 /*return*/, (_a.sent()).exitCode === 0];
                    }
                }); }); };
                return [4 /*yield*/, take()];
            case 2:
                if (!!(_e.sent())) return [3 /*break*/, 14];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _e.sent();
                _c = Number;
                return [4 /*yield*/, readOr($, lock)];
            case 4:
                _b = _c.apply(void 0, [(_e.sent()).split(' ')[0]]);
                if (_b) return [3 /*break*/, 6];
                return [4 /*yield*/, $.fs.stat(lock).catch(function () { return undefined; })];
            case 5:
                _b = ((_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.mtimeMs);
                _e.label = 6;
            case 6:
                at = _b || now;
                // A lock dated ahead of this Mac's clock, past what two chats' clocks can differ by, was never taken by a chat here: it is stale
                if (now - at < UPDATE_LOOK && at - now <= LOCK_SKEW)
                    return [2 /*return*/, UPDATE_BUSY];
                return [4 /*yield*/, readOr($, lock)];
            case 7:
                seen = _e.sent();
                aside = "".concat(lock, ".").concat(token.split(' ')[1]);
                return [4 /*yield*/, $.process.run(['mv', lock, aside]).catch(function () { return ({ exitCode: 1 }); })];
            case 8:
                if ((_e.sent()).exitCode !== 0)
                    return [2 /*return*/, UPDATE_BUSY
                        // Another chat took the stale lock over in between: what was moved is its fresh lock, put back where it was
                    ];
                return [4 /*yield*/, readOr($, aside)];
            case 9:
                if (!((_e.sent()) !== seen)) return [3 /*break*/, 11];
                return [4 /*yield*/, $.process.run(['mv', '-n', aside, lock]).catch(function () { return undefined; })];
            case 10: return [2 /*return*/, ((_e.sent()), UPDATE_BUSY)];
            case 11: return [4 /*yield*/, $.process.run(['rm', '-f', aside]).catch(function () { return undefined; })];
            case 12:
                _e.sent();
                return [4 /*yield*/, take()];
            case 13:
                if (!(_e.sent()))
                    return [2 /*return*/, UPDATE_BUSY];
                _e.label = 14;
            case 14:
                _e.trys.push([14, , 16, 20]);
                return [4 /*yield*/, act()];
            case 15: return [2 /*return*/, _e.sent()];
            case 16: return [4 /*yield*/, readOr($, lock)];
            case 17:
                if (!((_e.sent()) === token)) return [3 /*break*/, 19];
                return [4 /*yield*/, $.process.run(['rm', '-f', lock]).catch(function () { return undefined; })];
            case 18:
                _e.sent();
                _e.label = 19;
            case 19: return [7 /*endfinally*/];
            case 20: return [2 /*return*/];
        }
    });
}); };
// The Mac, as one step needs it
var lookIo = function ($) { return ({
    read: function (path) { return readOr($, path); },
    write: function (path, text) { return $.fs.write(path, text); },
    run: function (argv, timeoutMs) { return $.process.run(argv, { timeoutMs: timeoutMs }); },
    page: function () {
        return Promise.race([
            $.http.fetch(VERSION_PAGE).catch(function (err) { return ({ ok: false, status: 0, text: String(err) }); }),
            new Promise(function (done) { return void $.clock.after(VERSION_WAIT, function () { return done({ ok: false, status: 0, text: 'no answer' }); }); }),
        ]);
    },
    now: function () { return $.clock.now(); },
    log: function (text) { return log($, text); },
    wait: function (ms) { return new Promise(function (done) { return void $.clock.after(ms, done); }); },
}); };
// Claude Code's own program: the one the app names, else the first on the PATH, else where its installer puts it, as a terminal started without a login shell
// (seen on Linux, in tmux started over ssh) has no ~/.local/bin on its PATH, else claude on the PATH
var engineOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var named, onPath, _i, _a, _b, _c, one, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, $.env.get('CLAUDE_CODE_EXECPATH')];
            case 1:
                named = _g.sent();
                if (named)
                    return [2 /*return*/, named
                        // The PATH first, as the shell would find it, so an install by npm or another copy earlier on it is still the one used
                    ];
                return [4 /*yield*/, $.env.get('PATH')];
            case 2:
                onPath = ((_e = (_g.sent())) !== null && _e !== void 0 ? _e : '').split(':').filter(function (one) { return one.startsWith('/'); }).map(function (one) { return "".concat(one.replace(/\/+$/, ''), "/claude"); });
                _i = 0;
                _b = [__spreadArray([], onPath, true)];
                _c = "".concat;
                return [4 /*yield*/, $.env.get('HOME')];
            case 3:
                _a = __spreadArray.apply(void 0, _b.concat([[_c.apply("", [(_f = (_g.sent())) !== null && _f !== void 0 ? _f : '', "/.local/bin/claude"]), '/opt/homebrew/bin/claude', '/usr/local/bin/claude', '/usr/bin/claude'], false]));
                _g.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                one = _a[_i];
                _d = one.startsWith('/');
                if (!_d) return [3 /*break*/, 6];
                return [4 /*yield*/, $.fs.exists(one).catch(function () { return false; })];
            case 5:
                _d = (_g.sent());
                _g.label = 6;
            case 6:
                if (_d)
                    return [2 /*return*/, one];
                _g.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8: return [2 /*return*/, 'claude'];
        }
    });
}); };
// ---- Looking: the version page only ----
// What the last look saw, a version number and when, shared by every chat; and the page itself as this chat last read it, kept in
// this chat only, as the lines of what is new are shown from it and never from a file any program could write
var lookedPath = function () { return "".concat(dir, "/update-seen.json"); };
var pageRead;
var PAGE_AGAIN = 10 * 60000;
var pageAsked = 0;
// One read of the page; a page with no fingerprint is no release a download can be checked against, and is read as none
var readPage = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var answer, page;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, lookIo($).page()];
            case 1:
                answer = _b.sent();
                page = answer.ok ? publishedOf(answer.text) : undefined;
                if (!page) return [3 /*break*/, 3];
                _a = { page: page };
                return [4 /*yield*/, $.clock.now()];
            case 2:
                pageRead = (_a.at = _b.sent(), _a);
                _b.label = 3;
            case 3: return [2 /*return*/, { page: page, why: page ? '' : answer.ok ? (versionOnPage(answer.text) ? FAILS.unchecked : 'claudopus.ai named no version') : answer.status ? "claudopus.ai answered ".concat(answer.status) : 'claudopus.ai did not answer' }];
        }
    });
}); };
// The page, read now under the lock, its version kept for every chat
var lookOnly = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, before, _a, _b, page, why;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _e.sent();
                _a = stampOf;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 2:
                before = _a.apply(void 0, [_e.sent()]);
                return [4 /*yield*/, readPage($)];
            case 3:
                _b = _e.sent(), page = _b.page, why = _b.why;
                return [4 /*yield*/, $.fs.write(lookedPath(), JSON.stringify({ at: now, version: (_d = (_c = page === null || page === void 0 ? void 0 : page.version) !== null && _c !== void 0 ? _c : before === null || before === void 0 ? void 0 : before.version) !== null && _d !== void 0 ? _d : '', result: page ? 'seen' : "version page not read: ".concat(why) }))];
            case 4:
                _e.sent();
                if (page)
                    redraw($);
                return [2 /*return*/, { page: page, why: why }];
        }
    });
}); };
// The look on its own, as often as Config says; Only when I ask reads nothing
var lookForNew = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var config, every, _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (isUpdating || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, readConfig($, dir)];
            case 1:
                config = _d.sent();
                if (config.updates === false)
                    return [2 /*return*/];
                every = lookEveryOf(config.updateEvery);
                _a = isUpdateDue;
                _b = stampOf;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 2:
                _c = [_b.apply(void 0, [_d.sent()])];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                if (!_a.apply(void 0, _c.concat([_d.sent(), every])))
                    return [2 /*return*/];
                isUpdating = true;
                _d.label = 4;
            case 4:
                _d.trys.push([4, , 6, 7]);
                return [4 /*yield*/, underUpdateLock($, function () { return __awaiter(_this, void 0, void 0, function () {
                        var again, _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, readConfig($, dir)];
                                case 1:
                                    again = _d.sent();
                                    _a = isUpdateDue;
                                    _b = stampOf;
                                    return [4 /*yield*/, readOr($, lookedPath())];
                                case 2:
                                    _c = [_b.apply(void 0, [_d.sent()])];
                                    return [4 /*yield*/, $.clock.now()];
                                case 3:
                                    if (!_a.apply(void 0, _c.concat([_d.sent(), lookEveryOf(again.updateEvery)])) || again.updates === false)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, lookOnly($)];
                                case 4:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 5:
                _d.sent();
                return [3 /*break*/, 7];
            case 6:
                isUpdating = false;
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Config's Check now: the page read now, whatever the setting; it only looks, and the panel offers what it found
var checkNow = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, tries, got;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, { text: "Couldn't check: Claudopus has no memory folder in this chat.", isError: true }];
                return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_c.sent()).version;
                tries = 0;
                _c.label = 2;
            case 2:
                if (!(tries < 20)) return [3 /*break*/, 12];
                if (!!isUpdating) return [3 /*break*/, 9];
                isUpdating = true;
                _c.label = 3;
            case 3:
                _c.trys.push([3, , 8, 9]);
                return [4 /*yield*/, underUpdateLock($, function () { return lookOnly($); })];
            case 4:
                got = _c.sent();
                if (!(got !== UPDATE_BUSY)) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "Claudopus looked for a new version from Config: ".concat((_b = (_a = got.page) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : got.why))];
            case 5:
                _c.sent();
                if (!got.page)
                    return [2 /*return*/, { text: "Couldn't check: ".concat(got.why, ". Try again later."), isError: true }];
                return [4 /*yield*/, knowSource($, true)];
            case 6:
                _c.sent();
                return [2 /*return*/, loaded && isNewer(got.page.version, loaded) ? { text: "v".concat(got.page.version, " is out. You can update from the panel."), isError: false } : { text: "You're on the newest version (v".concat(got.page.version, ")."), isError: false }];
            case 7: return [3 /*break*/, 9];
            case 8:
                isUpdating = false;
                return [7 /*endfinally*/];
            case 9: return [4 /*yield*/, new Promise(function (done) { return void $.clock.after(3000, done); })];
            case 10:
                _c.sent();
                _c.label = 11;
            case 11:
                tries++;
                return [3 /*break*/, 2];
            case 12: return [2 /*return*/, { text: "Couldn't check: another chat's update did not finish. Try again later.", isError: true }];
        }
    });
}); };
// A chat whose panel shows a newer version than any page it has read reads the page itself once, for that version's lines, at most
// every PAGE_AGAIN; never while the look is set to only when asked, when only a press reads it
var pageFor = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var now, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (pageRead && !isNewer(version, pageRead.page.version))
                    return [2 /*return*/, pageRead.page];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _b.sent();
                _a = now - pageAsked < PAGE_AGAIN;
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, readConfig($, dir)];
            case 2:
                _a = (_b.sent()).updates === false;
                _b.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/, pageRead === null || pageRead === void 0 ? void 0 : pageRead.page];
                pageAsked = now;
                void readPage($).then(function (_a) {
                    var page = _a.page;
                    return page && redraw($);
                }).catch(function () { return undefined; });
                return [2 /*return*/, pageRead === null || pageRead === void 0 ? void 0 : pageRead.page];
        }
    });
}); };
// ---- Where this chat's copy comes from ----
// Known once a load and again at each look and step: where this chat's copy comes from, and, for a set-up a release never reaches,
// what it is and why
var sourceKnown;
var knowSource = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, isAgain) {
        var root, from, io, plugins, known, entryOf, installed, done, entry, scope_1, record, repo, ready_1, location_1, isGit, _a, subOf, path, _b, top, ready, _c, marketplace, scopes, scope, sub;
        var _this = this;
        var _d, _e, _f, _g, _h;
        if (isAgain === void 0) { isAgain = false; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (sourceKnown && !isAgain)
                        return [2 /*return*/, sourceKnown];
                    root = $.plugin.root.replace(/\/+$/, '');
                    from = installedFrom(root);
                    io = lookIo($);
                    plugins = (_d = from === null || from === void 0 ? void 0 : from.plugins) !== null && _d !== void 0 ? _d : dir.replace(/\/claudopus$/, '/plugins');
                    return [4 /*yield*/, readOr($, "".concat(plugins, "/known_marketplaces.json"))];
                case 1:
                    known = _j.sent();
                    entryOf = function (name) {
                        var _a;
                        try {
                            return (_a = JSON.parse(known)) === null || _a === void 0 ? void 0 : _a[name];
                        }
                        catch (_b) {
                            return undefined;
                        }
                    };
                    return [4 /*yield*/, readOr($, "".concat(plugins, "/installed_plugins.json"))];
                case 2:
                    installed = _j.sent();
                    done = function (one) { return (sourceKnown = one); };
                    if (!from) return [3 /*break*/, 10];
                    entry = entryOf(from.marketplace);
                    scope_1 = (_e = scopeOf(installed, "".concat(from.plugin, "@").concat(from.marketplace), root)) !== null && _e !== void 0 ? _e : scopeOf(installed, "".concat(from.plugin, "@").concat(from.marketplace), (_g = (_f = copyOf(installed, "".concat(from.plugin, "@").concat(from.marketplace), root, cwd)) === null || _f === void 0 ? void 0 : _f.installPath) !== null && _g !== void 0 ? _g : root);
                    record = { plugins: from.plugins, marketplace: from.marketplace, plugin: from.plugin, scope: scope_1 };
                    if (!(((_h = entry === null || entry === void 0 ? void 0 : entry.source) === null || _h === void 0 ? void 0 : _h.source) === 'directory' && typeof entry.source.path === 'string')) return [3 /*break*/, 4];
                    repo = entry.source.path.replace(/\/+$/, '');
                    return [4 /*yield*/, folderReady(io, repo)];
                case 3:
                    ready_1 = _j.sent();
                    return [2 /*return*/, done({
                            src: { kind: 'folder', repo: repo, sub: 'mods/claudopus', runs: 'copy', record: record },
                            cannot: ready_1.ok ? undefined : { what: "Claude Code's copy is made from ".concat(ready_1.what), why: ready_1.why },
                            where: ready_1.ok ? "Claude Code's installed copy, made from Claudopus's released code on this Mac" : "Claude Code's installed copy, made from ".concat(ready_1.what),
                        })];
                case 4:
                    location_1 = typeof (entry === null || entry === void 0 ? void 0 : entry.installLocation) === 'string' ? entry.installLocation.replace(/\/+$/, '') : '';
                    _a = location_1;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, $.fs.exists("".concat(location_1, "/.git")).catch(function () { return false; })];
                case 5:
                    _a = (_j.sent());
                    _j.label = 6;
                case 6:
                    isGit = _a;
                    subOf = function () { return __awaiter(_this, void 0, void 0, function () {
                        var market, _a, _b, source, _c;
                        var _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _f.trys.push([0, 2, , 3]);
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, readOr($, "".concat(location_1, "/.claude-plugin/marketplace.json"))];
                                case 1:
                                    market = _b.apply(_a, [_f.sent()]);
                                    source = (_e = (_d = market.plugins) === null || _d === void 0 ? void 0 : _d.find(function (one) { return one.name === from.plugin; })) === null || _e === void 0 ? void 0 : _e.source;
                                    return [2 /*return*/, typeof source === 'string' && /^\.\/[\w./-]+$/.test(source) && !source.includes('..') ? source.slice(2).replace(/\/+$/, '') : ''];
                                case 2:
                                    _c = _f.sent();
                                    return [2 /*return*/, ''];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!isGit) return [3 /*break*/, 8];
                    return [4 /*yield*/, subOf()];
                case 7:
                    _b = _j.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = '';
                    _j.label = 9;
                case 9:
                    path = _b;
                    if (isGit && path)
                        return [2 /*return*/, done({ src: __assign({ kind: 'clone', repo: location_1, sub: path }, record), where: "Claude Code's installed copy" })];
                    return [2 /*return*/, done({ src: { kind: 'none', why: 'its marketplace is not one Claudopus can check a download in' }, cannot: { what: 'This chat runs a copy of Claudopus installed another way', why: 'update it with /plugin in Claude Code' }, where: "Claude Code's installed copy" })];
                case 10: return [4 /*yield*/, io.run(['git', '-C', root, 'rev-parse', '--show-toplevel'], 20000).catch(function () { return ({ exitCode: 1, stdout: '', stderr: '' }); })];
                case 11:
                    top = (_j.sent()).stdout.trim();
                    if (!top) return [3 /*break*/, 13];
                    return [4 /*yield*/, folderReady(io, top)];
                case 12:
                    _c = _j.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _c = { ok: false, what: "Claudopus code that Update can't change", why: "it isn't Claudopus's released code" };
                    _j.label = 14;
                case 14:
                    ready = _c;
                    marketplace = folderMarketplace(known, root);
                    scopes = (function () {
                        var _a, _b, _c;
                        try {
                            return ((_c = (_b = (_a = JSON.parse(installed)) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b["claudopus@".concat(marketplace)]) !== null && _c !== void 0 ? _c : []).map(function (one) { return one === null || one === void 0 ? void 0 : one.scope; });
                        }
                        catch (_d) {
                            return [];
                        }
                    })();
                    scope = scopes.includes('user') ? 'user' : scopes.find(function (one) { return typeof one === 'string' && /^(user|project|local)$/.test(one); });
                    sub = top && root.startsWith("".concat(top, "/")) ? root.slice(top.length + 1) : 'mods/claudopus';
                    return [2 /*return*/, done({
                            src: __assign({ kind: 'folder', repo: top || root, sub: sub, runs: 'folder' }, (marketplace && scope ? { record: { plugins: plugins, marketplace: marketplace, plugin: 'claudopus', scope: scope } } : {})),
                            cannot: ready.ok ? undefined : { what: "This chat runs ".concat(ready.what), why: ready.why },
                            where: ready.ok ? "Claudopus's released code on this Mac" : ready.what,
                        })];
            }
        });
    });
};
// ---- The steps ----
var stepsPath = function () { return "".concat(dir, "/update-steps.json"); };
var laterPath = function () { return "".concat(dir, "/update-later.json"); };
// Not now keeps a version quiet for this long
var LATER_FOR = 24 * 3600000;
var writeSteps = function ($, steps) { return $.fs.write(stepsPath(), JSON.stringify(steps)); };
// What the last step in this chat said beyond its kind of failure, kept in this chat only
var stepSaid = { version: '', detail: '', dirty: false };
var isStepping = false;
// The press found another chat at a step: said for a moment in this chat
var busyAt = 0;
var atStep = function ($, act) { return __awaiter(_this, void 0, void 0, function () {
    var got, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isStepping || isUpdating || !dir)
                    return [2 /*return*/];
                isStepping = true;
                isUpdating = true;
                redraw($);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, 7, 8]);
                return [4 /*yield*/, underUpdateLock($, act)];
            case 2:
                got = _a.sent();
                if (!(got === UPDATE_BUSY)) return [3 /*break*/, 4];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                busyAt = _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 8];
            case 5:
                err_1 = _a.sent();
                return [4 /*yield*/, log($, "update step failed: ".concat(String(err_1)))];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                isStepping = false;
                isUpdating = false;
                redraw($);
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// A chat run from Claudopus's own checkout: Download and Install are one press, Update (the fetch, its check against the release,
// then the fast-forward, under the one lock); an installed copy keeps them as two
var isOnePress = function (src) { return src.kind === 'folder' && src.runs === 'folder'; };
// The page read again at each press: a step is checked only against what claudopus.ai says now, never against a kept file
var freshPage = function ($, version, step, now) { return __awaiter(_this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readPage($)];
            case 1:
                page = (_a.sent()).page;
                if (!!page) return [3 /*break*/, 3];
                return [4 /*yield*/, writeSteps($, { version: version, stage: 'failed', fail: 'page', step: step, at: now })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, page];
        }
    });
}); };
// Download, pressed for the version the notice showed: the newest the page names now is what is fetched
var downloadProgress;
// What the download's last drawing showed, and when
var progressDrawn = { shown: '', phase: '', at: 0 };
// Update's press, from its fetch to the end of its move: the panel says Updating throughout, and offers no press in between
var isUpdatePress = false;
// A press while only a look runs (the timed one, or Config's Check now) waits for the look to end, then acts: before, it did nothing
var afterLook = function ($, act) {
    return void (function () { return __awaiter(_this, void 0, void 0, function () {
        var end, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, $.clock.now()];
                case 1:
                    end = (_b.sent()) + 30000;
                    _b.label = 2;
                case 2:
                    _a = isUpdating && !isStepping;
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, $.clock.now()];
                case 3:
                    _a = (_b.sent()) < end;
                    _b.label = 4;
                case 4:
                    if (!_a) return [3 /*break*/, 7];
                    return [4 /*yield*/, new Promise(function (done) { return void $.clock.after(250, done); })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 2];
                case 7:
                    if (!isUpdating && !isStepping)
                        act();
                    return [2 /*return*/];
            }
        });
    }); })();
};
var downloadPress = function ($, version) {
    if (isUpdating && !isStepping)
        return afterLook($, function () { return downloadPress($, version); });
    presses += 1;
    // A press while a step runs does nothing, as atStep would, and leaves the flag to the press that set it
    if (isStepping || isUpdating)
        return;
    // Update's move, once its fetch was checked: each half takes the lock on its own, as two presses did, so neither holds it longer
    var next;
    isUpdatePress = true;
    void atStep($, function () { return __awaiter(_this, void 0, void 0, function () {
        var now, src, page, loaded, wrote, got, at;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.clock.now()];
                case 1:
                    now = _a.sent();
                    return [4 /*yield*/, knowSource($, true)];
                case 2:
                    src = (_a.sent()).src;
                    if (src.kind === 'none')
                        return [2 /*return*/];
                    return [4 /*yield*/, freshPage($, version, 'download', now)];
                case 3:
                    page = _a.sent();
                    if (!page)
                        return [2 /*return*/];
                    return [4 /*yield*/, versionsOf($)];
                case 4:
                    loaded = (_a.sent()).version;
                    if (!(!loaded || !isNewer(page.version, loaded))) return [3 /*break*/, 6];
                    return [4 /*yield*/, $.fs.write(lookedPath(), JSON.stringify({ at: now, version: page.version, result: 'seen' }))];
                case 5: return [2 /*return*/, void (_a.sent())];
                case 6:
                    Object.assign(stepSaid, { version: page.version, detail: '', dirty: false });
                    return [4 /*yield*/, writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at: now, from: loaded })];
                case 7:
                    _a.sent();
                    wrote = 0;
                    return [4 /*yield*/, download(lookIo($), src, page, "".concat(dir, "/update-progress.txt"), function (p) { return __awaiter(_this, void 0, void 0, function () {
                            var at, shown, isPhase;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        downloadProgress = __assign({ version: page.version }, p);
                                        return [4 /*yield*/, $.clock.now()];
                                    case 1:
                                        at = _a.sent();
                                        if (!(at - wrote >= 1000)) return [3 /*break*/, 3];
                                        (wrote = at);
                                        return [4 /*yield*/, writeSteps($, { version: page.version, stage: 'downloading', step: 'download', at: at, pct: p.pct, got: p.got, from: loaded })];
                                    case 2:
                                        (_a.sent());
                                        _a.label = 3;
                                    case 3:
                                        shown = "".concat(Math.round(p.pct), "|").concat(p.got ? sizeText(p.got) : '', "|").concat(p.phase);
                                        isPhase = p.phase !== progressDrawn.phase;
                                        if (shown !== progressDrawn.shown && (isPhase || (at - progressDrawn.at >= 2000 && at - engagedAt >= ENGAGED))) {
                                            Object.assign(progressDrawn, { shown: shown, phase: p.phase, at: at });
                                            redraw($);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    got = _a.sent();
                    downloadProgress = undefined;
                    return [4 /*yield*/, $.clock.now()];
                case 9:
                    at = _a.sent();
                    heldChecked.clear();
                    if (!got.ok) return [3 /*break*/, 11];
                    return [4 /*yield*/, writeSteps($, { version: page.version, stage: 'downloaded', step: 'download', commit: got.commit, tree: page.tree, at: at, from: loaded })
                        // Update's second half: the fetch was checked against the release, and the move reads the page and checks it again
                    ];
                case 10:
                    _a.sent();
                    // Update's second half: the fetch was checked against the release, and the move reads the page and checks it again
                    if (isOnePress(src))
                        next = { version: page.version, commit: got.commit };
                    return [3 /*break*/, 15];
                case 11:
                    if (!got.detail) return [3 /*break*/, 13];
                    return [4 /*yield*/, log($, "Claudopus ".concat(page.version, " download failed (").concat(got.fail, "): ").concat(got.detail))];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [4 /*yield*/, writeSteps($, { version: page.version, stage: 'failed', step: 'download', fail: got.fail, at: at, from: loaded })];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15: return [2 /*return*/];
            }
        });
    }); })
        .then(function () { return (next ? atStep($, function () { return installStep($, next.version, next.commit); }) : undefined); })
        .finally(function () { return ((isUpdatePress = false), redraw($)); });
};
// Install, pressed for the download the notice showed: checked against the page read now, then put in place
var installPress = function ($, version, commit) {
    if (isUpdating && !isStepping)
        return afterLook($, function () { return installPress($, version, commit); });
    presses += 1;
    void atStep($, function () { return installStep($, version, commit); });
};
// Install itself, run under the lock: at Install's press, or as Update's second half
var installStep = function ($, version, commit) { return __awaiter(_this, void 0, void 0, function () {
    var now, src, page, loaded, isOn, beat, got, _a, _b, at;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _c.sent();
                return [4 /*yield*/, knowSource($, true)];
            case 2:
                src = (_c.sent()).src;
                if (src.kind === 'none')
                    return [2 /*return*/];
                return [4 /*yield*/, freshPage($, version, 'install', now)];
            case 3:
                page = _c.sent();
                if (!page)
                    return [2 /*return*/];
                return [4 /*yield*/, versionsOf($)];
            case 4:
                loaded = (_c.sent()).version;
                if (!(page.version !== version)) return [3 /*break*/, 6];
                return [4 /*yield*/, writeSteps($, { version: version, stage: 'failed', step: 'install', fail: 'newer-out', at: now, from: loaded })];
            case 5: return [2 /*return*/, void (_c.sent())];
            case 6: return [4 /*yield*/, writeSteps($, { version: version, stage: 'installing', step: 'install', commit: commit, tree: page.tree, at: now, from: loaded })
                // A long install keeps its step alive for the other chats
            ];
            case 7:
                _c.sent();
                isOn = true;
                beat = function () {
                    return $.clock.after(20000, function () { return void (isOn && $.clock.now().then(function (at) { return writeSteps($, { version: version, stage: 'installing', step: 'install', commit: commit, tree: page.tree, at: at, from: loaded }); }).then(function () { return isOn && beat(); })); });
                };
                beat();
                _a = install;
                _b = [lookIo($), src, page, commit];
                return [4 /*yield*/, engineOf($)];
            case 8: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()])).finally(function () { return (isOn = false); })];
            case 9:
                got = _c.sent();
                return [4 /*yield*/, $.clock.now()];
            case 10:
                at = _c.sent();
                Object.assign(stepSaid, { version: version, detail: '', dirty: got.ok && got.dirty });
                if (!(!got.ok && got.detail)) return [3 /*break*/, 12];
                return [4 /*yield*/, log($, "Claudopus ".concat(version, " install failed (").concat(got.fail, "): ").concat(got.detail))];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12: return [4 /*yield*/, writeSteps($, got.ok ? { version: version, stage: 'installed', step: 'install', commit: commit, tree: page.tree, at: at, from: loaded } : { version: version, stage: 'failed', step: 'install', fail: got.fail, commit: commit, at: at, from: loaded })];
            case 13:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// Not now: quiet for a day, for this version; Skip this version: quiet until a newer one, kept as the person's own setting
var laterPress = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                presses += 1;
                _b = (_a = $.fs).write;
                _c = [laterPath()];
                _e = (_d = JSON).stringify;
                _f = { version: version };
                return [4 /*yield*/, $.clock.now()];
            case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_e.apply(_d, [(_f.until = (_g.sent()) + LATER_FOR, _f)])]))];
            case 2:
                _g.sent();
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
var skipPress = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                return [4 /*yield*/, setConfig($, dir, 'skipVersion', version)
                    // What Check now said last is about the version just skipped
                ];
            case 1:
                _a.sent();
                // What Check now said last is about the version just skipped
                Object.assign(updateCheck, { said: '', isError: false });
                return [4 /*yield*/, loadSettings($)];
            case 2:
                _a.sent();
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// ---- The notice ----
// What this chat found of each download it was told of, by commit and tree, so the check runs once
var heldChecked = new Map();
var isDownloadHeld = function ($, src, steps) { return __awaiter(_this, void 0, void 0, function () {
    var page, _a, key, known, git, held, tree, _b, isHeld;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (src.kind === 'none' || !steps.commit || !steps.tree)
                    return [2 /*return*/, false
                        // Checked against what this chat read on the page itself, never only against what the file says the tree is
                    ];
                if (!((_c = pageRead === null || pageRead === void 0 ? void 0 : pageRead.page) !== null && _c !== void 0)) return [3 /*break*/, 1];
                _a = _c;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, pageFor($, steps.version)];
            case 2:
                _a = (_d.sent());
                _d.label = 3;
            case 3:
                page = _a;
                if (!page || page.version !== steps.version || page.tree !== steps.tree)
                    return [2 /*return*/, false];
                key = "".concat(src.repo, "|").concat(steps.commit, "|").concat(steps.tree);
                known = heldChecked.get(key);
                if (known !== undefined)
                    return [2 /*return*/, known];
                git = function (args) { return $.process.run(__spreadArray(['env', 'GIT_TERMINAL_PROMPT=0', 'git', '-C', src.repo], args, true), { timeoutMs: 20000 }).catch(function () { return ({ exitCode: 1, stdout: '' }); }); };
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', 'refs/claudopus/update^{commit}'])];
            case 4:
                held = (_d.sent()).stdout.trim();
                if (!(held === steps.commit)) return [3 /*break*/, 6];
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', "".concat(steps.commit, ":").concat(src.sub)])];
            case 5:
                _b = (_d.sent()).stdout.trim();
                return [3 /*break*/, 7];
            case 6:
                _b = '';
                _d.label = 7;
            case 7:
                tree = _b;
                isHeld = tree === steps.tree;
                heldChecked.set(key, isHeld);
                return [2 /*return*/, isHeld];
        }
    });
}); };
// Where updating stands for this chat, from what is true now
var noticeNow = function ($, loaded, installed) { return __awaiter(_this, void 0, void 0, function () {
    var config, seen, _a, laterText, later, known, steps, _b, _c, _d;
    var _e;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir || !loaded)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, readConfig($, dir)];
            case 1:
                config = _h.sent();
                _a = stampOf;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 2:
                seen = (_g = (_f = _a.apply(void 0, [_h.sent()])) === null || _f === void 0 ? void 0 : _f.version) !== null && _g !== void 0 ? _g : '';
                return [4 /*yield*/, readOr($, laterPath())];
            case 3:
                laterText = _h.sent();
                later = function () {
                    try {
                        var v = JSON.parse(laterText);
                        return isVersion(v === null || v === void 0 ? void 0 : v.version) && typeof v.until === 'number' ? { version: v.version, until: v.until } : undefined;
                    }
                    catch (_a) {
                        return undefined;
                    }
                };
                return [4 /*yield*/, knowSource($)];
            case 4:
                known = _h.sent();
                _b = stepsOf;
                return [4 /*yield*/, readOr($, stepsPath())];
            case 5:
                steps = _b.apply(void 0, [_h.sent()]);
                _c = noticeOf;
                _e = {
                    loaded: loaded,
                    installed: installed,
                    seen: isVersion(seen) ? seen : ''
                };
                _d = (steps === null || steps === void 0 ? void 0 : steps.stage) === 'downloaded';
                if (!_d) return [3 /*break*/, 7];
                return [4 /*yield*/, isDownloadHeld($, known.src, steps)];
            case 6:
                _d = !(_h.sent());
                _h.label = 7;
            case 7:
                // A download is said to be checked only once this chat has seen it so: its repo's download ref holds that commit, whose mod folder
                // is the tree the steps name, and the page this chat read names it too
                _e.steps = _d ? undefined : steps,
                    _e.page = pageRead === null || pageRead === void 0 ? void 0 : pageRead.page,
                    _e.skipped = isVersion(config.skipVersion) ? config.skipVersion : undefined,
                    _e.later = later(),
                    _e.cannot = known.cannot;
                return [4 /*yield*/, $.clock.now()];
            case 8: return [2 /*return*/, _c.apply(void 0, [(_e.now = _h.sent(),
                        _e)])];
        }
    });
}); };
// Where updating stands, as far as the panel's drawing changes with it: a step, a look, a press put off or skipped, what the Mac has,
// the seen record of the note after a move, and this chat's own progress and presses, so a held drawing is never shown past it
var updateShape = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!dir) return [3 /*break*/, 7];
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 1:
                _d = [
                    _g.sent()
                ];
                return [4 /*yield*/, readOr($, stepsPath())];
            case 2:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, readOr($, laterPath())];
            case 3:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, readOr($, "".concat(dir, "/seen.json"))];
            case 4:
                _d = _d.concat([
                    _g.sent()
                ]);
                return [4 /*yield*/, readConfig($, dir)];
            case 5:
                _d = _d.concat([
                    (_e = (_g.sent()).skipVersion) !== null && _e !== void 0 ? _e : ''
                ]);
                return [4 /*yield*/, installedNow($).catch(function () { return ''; })];
            case 6:
                _a = _c.apply(_b, [_d.concat([
                        _g.sent(),
                        (_f = pageRead === null || pageRead === void 0 ? void 0 : pageRead.page.version) !== null && _f !== void 0 ? _f : '',
                        downloadProgress ? Math.round(downloadProgress.pct) : -1,
                        isStepping,
                        busyAt
                    ])]);
                return [3 /*break*/, 8];
            case 7:
                _a = '';
                _g.label = 8;
            case 8: return [2 /*return*/, _a];
        }
    });
}); };
// The notice: a small grey outlined box in the header, under the version this chat runs, never a demand as the amber boxes are.
// What is out and, in a line, what is new; the steps and where they stand; the one press that comes next, Not now and Skip. A chat
// run from Claudopus's own checkout has one, Update, and is told nothing of where it loads from (Config says)
var NOTICE_EDGE = '#80808070';
// The last step, switching this chat, is no press: the header says to type /reload-plugins
var STEPS = ['Download', 'Install'];
// Why Update could not update this chat, where Update's own words differ from FAILS'
var ONE_PRESS_FAILS = {
    'newer-out': 'a newer version came out while Claudopus was updating',
    gone: 'the new version is no longer there',
};
var noticeCard = function ($, ui, n, loaded) { return __awaiter(_this, void 0, void 0, function () {
    var now, busy, known, src, isOne, track, quiet, box, title, line, v, page, missed, newest_1, more, count, what, head, live, pct, got, said_1, replaces, detail, which, why, kept;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                busy = now - busyAt < 10000 ? <ui.Text key="update-busy" dimColor wrap="wrap">Another chat is updating Claudopus. Try again in a moment.</ui.Text> : null;
                if (!n)
                    return [2 /*return*/, null];
                return [4 /*yield*/, knowSource($)];
            case 2:
                known = _d.sent();
                src = known.src;
                isOne = isOnePress(src);
                track = function (at) {
                    return isOne ? null : (<ui.Text key="update-track" dimColor wrap="truncate-end">
      {STEPS.map(function (one, i) { return "".concat(i < at ? '✓' : i === at ? '●' : '○', " ").concat(one); }).join('   ')}
    </ui.Text>);
                };
                quiet = function (key, version, withSkip) {
                    if (withSkip === void 0) { withSkip = true; }
                    return [
                        <ui.Button key={"update-later-".concat(key, "-").concat(presses)} label="Not now" plain dimColor onPress={function () { return void laterPress($, version).catch(function (err) { return log($, "update not put off: ".concat(String(err))); }); }}/>,
                        withSkip ? <ui.Button key={"update-skip-".concat(key, "-").concat(presses)} label="Skip this version" plain dimColor onPress={function () { return void skipPress($, version).catch(function (err) { return log($, "version not skipped: ".concat(String(err))); }); }}/> : null,
                    ];
                };
                box = function (key, lines, buttons) { return (<ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      {lines.filter(Boolean)}
      {buttons.some(Boolean) ? (<ui.Box key={"update-".concat(key, "-buttons")} flexDirection="row" flexWrap="wrap" columnGap={2} alignItems="center">
          {buttons.filter(Boolean)}
        </ui.Box>) : null}
      {busy}
    </ui.Box>); };
                title = function (text, side) {
                    if (side === void 0) { side = ''; }
                    return (<ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
      <ui.Box flexShrink={0}>
        <ui.Text>{text}</ui.Text>
      </ui.Box>
      {side ? <ui.Text dimColor wrap="truncate-end">{side}</ui.Text> : null}
    </ui.Box>);
                };
                line = function (key, text, color) { return (<ui.Text key={"update-".concat(key)} dimColor={!color} color={color} wrap="wrap">
      {text}
    </ui.Text>); };
                v = n.version;
                // Update's press between its fetch and its move: still updating
                if (isOne && (n.kind === 'installing' || (n.kind === 'downloaded' && (isStepping || isUpdatePress))))
                    return [2 /*return*/, box('installing', [title("Updating Claudopus ".concat(v, "\u2026")), track(0)], [])
                        // A fetch checked earlier, left by a copy before Update was one press, is offered as any version out: its Update moves it forward,
                        // after checking it once more
                    ];
                if (!(n.kind === 'available' || n.kind === 'cannot' || (isOne && n.kind === 'downloaded'))) return [3 /*break*/, 4];
                return [4 /*yield*/, pageFor($, v)];
            case 3:
                page = _d.sent();
                missed = page && page.version === v ? missedOn(page, loaded) : [];
                newest_1 = missed[0];
                more = missed.reduce(function (sum, one) { return sum + 1 + one.more; }, 0) - 1;
                count = n.kind === 'available' ? n.count : missed.length || 1;
                what = (newest_1 === null || newest_1 === void 0 ? void 0 : newest_1.line) ? "".concat(newest_1.line).concat(more > 0 ? " \u00B7 and ".concat(more, " more ").concat(more === 1 ? 'change' : 'changes') : '') : '';
                head = title("Claudopus ".concat(v, " is out"), count > 1 ? "\u00B7 ".concat(count, " versions since v").concat(loaded) : '');
                if (n.kind === 'cannot')
                    return [2 /*return*/, box('cannot', [head, line('why', "".concat(n.what, ": ").concat(n.why, "."))], quiet('cannot', v))];
                return [2 /*return*/, box('available', [head, what ? line('what', what) : null], __spreadArray([
                        n.kind === 'downloaded' ? (<ui.Button key={"update-install-".concat(presses)} label="Update" onPress={function () { return installPress($, v, n.commit); }}/>) : (<ui.Button key={"update-download-".concat(presses)} label={isOne ? 'Update' : (page === null || page === void 0 ? void 0 : page.size) ? "Download \u00B7 ".concat(sizeText(page.size)) : 'Download'} onPress={function () { return downloadPress($, v); }}/>)
                    ], quiet(n.kind, v), true))];
            case 4:
                if (n.kind === 'downloading') {
                    live = (downloadProgress === null || downloadProgress === void 0 ? void 0 : downloadProgress.version) === v ? downloadProgress : undefined;
                    pct = (_a = live === null || live === void 0 ? void 0 : live.pct) !== null && _a !== void 0 ? _a : n.pct;
                    got = (_b = live === null || live === void 0 ? void 0 : live.got) !== null && _b !== void 0 ? _b : n.got;
                    said_1 = (live === null || live === void 0 ? void 0 : live.phase) === 'checking' ? 'checking it against what the release published' : [pct !== undefined ? "".concat(Math.round(pct), "%") : '', got ? sizeText(got) : '', (live === null || live === void 0 ? void 0 : live.phase) === 'resolving' ? 'unpacking' : ''].filter(Boolean).join(' · ');
                    return [2 /*return*/, box('downloading', [title("".concat(isOne ? 'Updating' : 'Downloading', " Claudopus ").concat(v, "\u2026"), said_1 ? "\u00B7 ".concat(said_1) : ''), track(0)], [])];
                }
                if (n.kind === 'downloaded') {
                    replaces = "Claudopus checked it against the release. Install replaces v".concat(loaded, ", and new chats start on v").concat(v, ".");
                    return [2 /*return*/, box('downloaded', [title("Claudopus ".concat(v, " downloaded")), line('replaces', replaces), track(1)], __spreadArray([<ui.Button key={"update-install-".concat(presses)} label="Install" onPress={function () { return installPress($, v, n.commit); }}/>], quiet('downloaded', v, false), true))];
                }
                if (n.kind === 'installing')
                    return [2 /*return*/, box('installing', [title("Installing Claudopus ".concat(v, "\u2026")), track(1)], [])
                        // The Mac has it and this chat still runs the older one: the header says so beside the version, and to type /reload-plugins
                    ];
                // The Mac has it and this chat still runs the older one: the header says so beside the version, and to type /reload-plugins
                if (n.kind === 'reload')
                    return [2 /*return*/, null
                        // A step that failed: what failed, and that what this chat runs is as it was
                    ];
                detail = '';
                which = isOne ? 'update' : n.step === 'download' ? 'download' : 'install';
                why = (_c = (isOne ? ONE_PRESS_FAILS[n.fail] : undefined)) !== null && _c !== void 0 ? _c : FAILS[n.fail];
                kept = n.fail === 'installed-mismatch'
                    ? "New chats keep v".concat(loaded, ".")
                    : n.fail === 'kept-copy'
                        ? "This chat still runs v".concat(loaded, ".")
                        : "Nothing changed: this chat still runs v".concat(loaded, ".");
                return [2 /*return*/, box('failed', [title("Couldn't ".concat(which, " Claudopus ").concat(v)), line('why', "".concat(why.replace(/^./, function (c) { return c.toUpperCase(); })).concat(detail, ". ").concat(kept))], __spreadArray([<ui.Button key={"update-again-".concat(presses)} label="Try again" onPress={function () { return downloadPress($, v); }}/>], quiet('failed', v), true))];
        }
    });
}); };
// ---- Moving an open chat to the version installed ----
// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; for a copy
// run from a folder of its code, the version that folder has now, which a reload loads
var installedNow = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, installedCopy($)];
        case 1: return [2 /*return*/, (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : ''];
    }
}); }); };
var installedCopy = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var from, root, version, _a, installed, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                from = installedFrom($.plugin.root);
                if (!!from) return [3 /*break*/, 3];
                root = $.plugin.root.replace(/\/+$/, '');
                return [4 /*yield*/, readOr($, "".concat(root, "/../../.git/HEAD"))];
            case 1:
                if (!(_b.sent()).trim())
                    return [2 /*return*/, undefined];
                _a = versionOnPage;
                return [4 /*yield*/, readOr($, "".concat(root, "/.claude-plugin/plugin.json"))];
            case 2:
                version = _a.apply(void 0, [_b.sent()]);
                return [2 /*return*/, version ? { version: version, installPath: root } : undefined];
            case 3: return [4 /*yield*/, readOr($, "".concat(from.plugins, "/installed_plugins.json"))];
            case 4:
                installed = _b.sent();
                id = "".concat(from.plugin, "@").concat(from.marketplace);
                return [2 /*return*/, copyOf(installed, id, $.plugin.root, cwd)];
        }
    });
}); };
// A /reload-plugins run from afar loads the new copy but leaves the old one's timers running in the same chat, and copies before
// 0.2.56 send it whatever the connection, each a refused line. They all wait while reloads/<chat>.json names the installed version from under RELOAD_AGAIN ago, so
// in a chat run from afar this copy keeps that mark naming it, looked at every HOLD_EVERY, which is far below their RELOAD_EVERY.
// A copy that a newer load in this chat has replaced (the version this chat ran last is not its own) does nothing, so the holds of
// copies left behind by typed reloads do not pile up
var HOLD_EVERY = 1000;
var holdOldCopies = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, _a, copy, mark, _b, _c, before, now, at;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_d.sent()).version;
                _a = !loaded;
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, read($, ranVersion)];
            case 2:
                _a = (_d.sent()) !== loaded;
                _d.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/];
                return [4 /*yield*/, installedCopy($)];
            case 4:
                copy = _d.sent();
                if (!(copy === null || copy === void 0 ? void 0 : copy.version))
                    return [2 /*return*/];
                _c = (_b = "".concat(dir, "/reloads/")).concat;
                return [4 /*yield*/, $.session.id()];
            case 5:
                mark = _c.apply(_b, [_d.sent(), ".json"]);
                return [4 /*yield*/, readOr($, mark).then(function (text) {
                        try {
                            return JSON.parse(text);
                        }
                        catch (_a) {
                            return undefined;
                        }
                    })];
            case 6:
                before = _d.sent();
                return [4 /*yield*/, $.clock.now()];
            case 7:
                now = _d.sent();
                at = typeof (before === null || before === void 0 ? void 0 : before.at) === 'number' ? before.at : 0;
                if ((before === null || before === void 0 ? void 0 : before.version) === copy.version && now >= at && now - at < RELOAD_AGAIN / 2)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))];
            case 8:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
// ---- The moment a chat moves to a newer version ----
// The version this chat loaded last, kept through a reload of this code, so the load after it knows what it moved from
var ranVersion = atom({ plugin: 'claudopus', key: 'ran' }, '', { shape: 'ran-1' });
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing once
// the load has started whole (isReady), or UPDATED_READY after the load if its start never finishes: in a chat run over ssh the
// start took 6 s, and drawings asked for meanwhile can be dropped as each new change is announced, so a moment begun then could be
// over before one of its drawings arrived. Until then the header is as before, so the octopus's jump and the words keep time
var UPDATED_READY = 15000;
var updatedMoment;
var noteLoaded = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, ran, mark, _a, _b, _c, _d, now, from, moment;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                updatedMoment = undefined;
                return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_e.sent()).version;
                if (!loaded)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, ranVersion)];
            case 2:
                ran = _e.sent();
                _a = readOr;
                _b = [$];
                _d = (_c = "".concat(dir, "/reloads/")).concat;
                return [4 /*yield*/, $.session.id()];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.apply(_c, [_e.sent(), ".json"])])).then(function (text) {
                    try {
                        return JSON.parse(text);
                    }
                    catch (_a) {
                        return undefined;
                    }
                })];
            case 4:
                mark = _e.sent();
                return [4 /*yield*/, $.clock.now()];
            case 5:
                now = _e.sent();
                from = updatedFrom(loaded, ran, mark, now);
                return [4 /*yield*/, update($, ranVersion, function () { return loaded; })];
            case 6:
                _e.sent();
                if (!from)
                    return [2 /*return*/];
                updatedMoment = { from: from, to: loaded, loadedAt: now, startedAt: 0, isReady: false };
                // A panel drawn while this load was still reading has no moment yet: it is drawn again now
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 7:
                // A panel drawn while this load was still reading has no moment yet: it is drawn again now
                _e.sent();
                moment = updatedMoment;
                $.clock.after(UPDATED_READY, function () { return void (updatedMoment === moment && readyUpdated($)); });
                return [4 /*yield*/, log($, "Claudopus moved from ".concat(from, " to ").concat(loaded, " in this chat: the header's octopus turns blue and says so"))];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); };
// The load has started whole: the moment begins at the next drawing, asked for now
var readyUpdated = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!updatedMoment || updatedMoment.isReady)
                    return [2 /*return*/];
                updatedMoment.isReady = true;
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The sound of the moment, a file of the mod's: three bright rising notes, 0.9 s, made by mockups/claudopus-sound/updated.py
var UPDATED_SOUND = 'sounds/updated.wav';
// The sound plays once for each version on this Mac, however many chats move to it: the first to begin its moment makes the file
// updated/<version> (made only where none is, the shell's noclobber) and plays it; config.json's sound off keeps it silent
var playUpdated = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var config, _a, _b, _c, played, made;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!dir || !/^[0-9A-Za-z.+-]{1,40}$/.test(version))
                    return [2 /*return*/];
                config = {};
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/config.json"))];
            case 2:
                config = _b.apply(_a, [(_d.sent()) || '{}']);
                return [3 /*break*/, 4];
            case 3:
                _c = _d.sent();
                return [3 /*break*/, 4];
            case 4:
                if (config.sound === false)
                    return [2 /*return*/];
                played = "".concat(dir, "/updated/").concat(version);
                return [4 /*yield*/, $.process
                        .run(['sh', '-c', 'mkdir -p "$(dirname "$1")" && set -C && : > "$1"', 'sh', played])
                        .catch(function () { return ({ exitCode: 1 }); })];
            case 5:
                made = _d.sent();
                if (made.exitCode !== 0)
                    return [2 /*return*/];
                // A sound that could not play leaves the version free for the next chat that moves to it
                return [4 /*yield*/, $.audio.play({ asset: UPDATED_SOUND }).catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.process.run(['rm', '-f', played]).catch(function () { return undefined; })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, log($, "updated sound not played: ".concat(String(err)))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                // A sound that could not play leaves the version free for the next chat that moves to it
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
// The moment as it stands now, while it lasts: the name line's pieces in Claudopus's workflow blue, the panel drawing the blue
// octopus beside them. The panel is drawn again only where the look changes, at UPDATED_SAYS and at its end (see UPDATED_SAYS)
var updatedPieces = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var moment, now, _i, _a, at, look;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                moment = updatedMoment;
                if (!moment || moment.to !== version)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, $.clock.now()
                    // Drawn while the load is still starting: nothing of it yet
                ];
            case 1:
                now = _b.sent();
                // Drawn while the load is still starting: nothing of it yet
                if (!moment.isReady)
                    return [2 /*return*/, undefined];
                if (!moment.startedAt) {
                    if (now - moment.loadedAt > UPDATED_LATE)
                        return [2 /*return*/, void (updatedMoment = undefined)];
                    moment.startedAt = now;
                    void playUpdated($, moment.to);
                    for (_i = 0, _a = [UPDATED_SAYS, UPDATED_FOR]; _i < _a.length; _i++) {
                        at = _a[_i];
                        $.clock.after(at + 20, function () { return void (updatedMoment === moment && update($, tick, function (n) { return n + 1; })); });
                    }
                }
                look = updatedLook(moment.to, now - moment.startedAt);
                if (!look && updatedMoment === moment)
                    updatedMoment = undefined;
                return [2 /*return*/, look];
        }
    });
}); };
var nameLine = function (ui, pieces) { return (
// "Claudopus" first, then the word or version beside it
<ui.Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
    {pieces.map(function (piece, i) { return (<ui.Box key={"head-name-".concat(i)} flexDirection="row" flexShrink={i ? 1 : 0} minWidth={0}>
        <ui.Text key={"head-name-".concat(i, "-0")} wrap="truncate-end" color={FLOW} bold>
          {piece.text}
        </ui.Text>
      </ui.Box>); })}
  </ui.Box>); };
