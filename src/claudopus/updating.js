// Updates as the person asks for them: every hour one chat only reads the version page on claudopus.ai, and the panel says when it names a newer version, with Install. Install, like Config's Check for updates, runs Claude Code's own update steps for it, or, for a copy run from a folder of its code, brings that folder up to date (the pure parts are in hooks/update.ts)
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
// ---- Keeping itself up to date (the pure parts are in ./update) ----
// A look and an install run one at a time, under a lock the other chats see; what an install learnt is kept in update.json, what
// the hourly look saw on the page in update-seen.json
var isUpdating = false;
// The lock is one file made only where none is (the shell's noclobber), holding when it was taken and by whom; a lock left by a
// chat that closed mid-look is moved aside by exactly one chat once it is old (by what it says, else by when it was written).
// Taken, the act runs and only this chat's own lock is removed after it; held by another chat, nothing runs and 'busy' comes back
var UPDATE_BUSY = 'busy';
var LOCK_SKEW = 60000;
var underUpdateLock = function ($, act) { return __awaiter(_this, void 0, void 0, function () {
    var lock, token, _a, take, now, at, _b, _c, aside;
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
                if (!!(_e.sent())) return [3 /*break*/, 10];
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
                aside = "".concat(lock, ".").concat(token.split(' ')[1]);
                return [4 /*yield*/, $.process.run(['mv', lock, aside]).catch(function () { return ({ exitCode: 1 }); })];
            case 7:
                if ((_e.sent()).exitCode !== 0)
                    return [2 /*return*/, UPDATE_BUSY];
                return [4 /*yield*/, $.process.run(['rm', '-f', aside]).catch(function () { return undefined; })];
            case 8:
                _e.sent();
                return [4 /*yield*/, take()];
            case 9:
                if (!(_e.sent()))
                    return [2 /*return*/, UPDATE_BUSY];
                _e.label = 10;
            case 10:
                _e.trys.push([10, , 12, 16]);
                return [4 /*yield*/, act()];
            case 11: return [2 /*return*/, _e.sent()];
            case 12: return [4 /*yield*/, readOr($, lock)];
            case 13:
                if (!((_e.sent()) === token)) return [3 /*break*/, 15];
                return [4 /*yield*/, $.process.run(['rm', '-f', lock]).catch(function () { return undefined; })];
            case 14:
                _e.sent();
                _e.label = 15;
            case 15: return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); };
// The Mac, as one look needs it
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
}); };
// One look: an installed copy runs Claude Code's own update steps, a copy run from a folder of its code brings that folder up to date
// A folder's looks keep their own stamp, so they never stand in for an installed copy's hourly look on the same Mac
var stampFor = function (from) { return "".concat(dir, "/").concat(from ? 'update' : 'update-folder', ".json"); };
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
var lookAt = function ($, from) { return __awaiter(_this, void 0, void 0, function () {
    var engine, stampPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, engineOf($)];
            case 1:
                engine = _a.sent();
                stampPath = stampFor(from);
                if (!from)
                    return [2 /*return*/, folderLook(lookIo($), { root: $.plugin.root, plugins: dir.replace(/\/claudopus$/, '/plugins'), engine: engine, stampPath: stampPath })];
                return [2 /*return*/, lookOnce(lookIo($), { from: from, root: $.plugin.root, cwd: cwd, engine: engine, stampPath: stampPath })];
        }
    });
}); };
// Claudopus never installs an update by itself: Claude Code leaves automatic updates off for a marketplace other than Anthropic's
// own, and what an update installs carries no signature the mod could check. Every hour one chat only reads the version page (one
// small fetch: nothing is downloaded or run), and when it names a newer version the panel says so, with Install. A new version
// comes only from a press: Install, or Config's Check for updates (Claude Code's own update steps, as /plugin update runs them)
var lookedPath = function () { return "".concat(dir, "/update-seen.json"); };
var lookForNew = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (isUpdating || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, readConfig($, dir)];
            case 1:
                // The hourly look turned off in Config reads nothing
                if ((_d.sent()).updates === false)
                    return [2 /*return*/];
                _a = isUpdateDue;
                _b = stampOf;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 2:
                _c = [_b.apply(void 0, [_d.sent()])];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                if (!_a.apply(void 0, _c.concat([_d.sent()])))
                    return [2 /*return*/];
                isUpdating = true;
                _d.label = 4;
            case 4:
                _d.trys.push([4, , 6, 7]);
                return [4 /*yield*/, underUpdateLock($, function () { return __awaiter(_this, void 0, void 0, function () {
                        var before, _a, now, _b, page, version;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = stampOf;
                                    return [4 /*yield*/, readOr($, lookedPath())];
                                case 1:
                                    before = _a.apply(void 0, [_d.sent()]);
                                    return [4 /*yield*/, $.clock.now()];
                                case 2:
                                    now = _d.sent();
                                    _b = !isUpdateDue(before, now);
                                    if (_b) return [3 /*break*/, 4];
                                    return [4 /*yield*/, readConfig($, dir)];
                                case 3:
                                    _b = (_d.sent()).updates === false;
                                    _d.label = 4;
                                case 4:
                                    if (_b)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, lookIo($).page()];
                                case 5:
                                    page = _d.sent();
                                    version = page.ok ? versionOnPage(page.text) : undefined;
                                    return [4 /*yield*/, $.fs.write(lookedPath(), JSON.stringify({ at: now, version: (_c = version !== null && version !== void 0 ? version : before === null || before === void 0 ? void 0 : before.version) !== null && _c !== void 0 ? _c : '', result: version ? 'seen' : "version page not read: ".concat(page.status || page.text.slice(0, 120)) }))];
                                case 6:
                                    _d.sent();
                                    if (version)
                                        redraw($);
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
// The newer version the hourly look saw, while neither this chat nor the Mac has it yet, and the look is on
var newOut = function ($, loaded, installed) { return __awaiter(_this, void 0, void 0, function () {
    var said, _a, seen;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!dir || !loaded)
                    return [2 /*return*/, ''];
                _a = stampOf;
                return [4 /*yield*/, readOr($, lookedPath())];
            case 1:
                said = (_c = (_b = _a.apply(void 0, [_d.sent()])) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
                seen = /^\d{1,4}(?:\.\d{1,6}){1,3}$/.test(said) ? said : '';
                if (!seen || !isNewer(seen, loaded) || (installed && !isNewer(seen, installed)) || installPress.done === seen)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, readConfig($, dir)];
            case 2: return [2 /*return*/, (_d.sent()).updates === false ? '' : seen];
        }
    });
}); };
// One look now, under the lock: a look already under way here, or another chat's, is waited for (CHECK_STEP at a time, up to
// UPDATE_LOOK, after which a stale lock is taken over), then this one runs, so two never run at once; it is cheap when the other one
// already downloaded the newest version. A Look, or why there was none
var CHECK_STEP = 3000;
var lookNow = function ($, by) { return __awaiter(_this, void 0, void 0, function () {
    var from, until, look;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                from = installedFrom($.plugin.root);
                if (!dir)
                    return [2 /*return*/, "Couldn't check: Claudopus has no memory folder in this chat."];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                until = (_a.sent()) + UPDATE_LOOK + CHECK_STEP;
                _a.label = 2;
            case 2:
                if (!!isUpdating) return [3 /*break*/, 8];
                isUpdating = true;
                _a.label = 3;
            case 3:
                _a.trys.push([3, , 7, 8]);
                return [4 /*yield*/, underUpdateLock($, function () { return lookAt($, from); })];
            case 4:
                look = _a.sent();
                if (!(look !== UPDATE_BUSY)) return [3 /*break*/, 6];
                return [4 /*yield*/, log($, "Claudopus checked for updates from ".concat(by, ": ").concat(look.kind).concat('version' in look && look.version ? " ".concat(look.version) : ''))];
            case 5:
                _a.sent();
                return [2 /*return*/, look];
            case 6: return [3 /*break*/, 8];
            case 7:
                isUpdating = false;
                return [7 /*endfinally*/];
            case 8: return [4 /*yield*/, $.clock.now()];
            case 9:
                if ((_a.sent()) > until)
                    return [2 /*return*/, "Couldn't check: another chat's check did not finish. Try again later."];
                return [4 /*yield*/, new Promise(function (done) { return void $.clock.after(CHECK_STEP, done); })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: return [3 /*break*/, 2];
            case 12: return [2 /*return*/];
        }
    });
}); };
// Config's Check for updates: the look, now, whatever the hour says; a chat switches to what it got when /reload-plugins is typed
var checkForUpdates = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, look;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_a.sent()).version;
                return [4 /*yield*/, lookNow($, 'Config')];
            case 2:
                look = _a.sent();
                return [2 /*return*/, typeof look === 'string' ? { text: look, isError: true } : checkSaid(look, loaded, true, !installedFrom($.plugin.root))];
        }
    });
}); };
// The panel's Install, pressed for the version it showed: the same look as Check for updates, then this chat alone reloads to what it
// got, with Claude Code's own /reload-plugins. Other open chats keep theirs, and their header says to type /reload-plugins. A chat run
// from another Mac is never sent one (the engine refuses it there), nor one whose reload the engine refused: it says to type it
var installPress = { version: '', isBusy: false, said: '', isError: false, done: '' };
var isReloadRefused = false;
var installNew = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, from, look, said_1, _a, _b, _c, _d, _e, _f, _g, said_2, err_1;
    var _h;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                if (installPress.isBusy)
                    return [2 /*return*/];
                Object.assign(installPress, { version: version, isBusy: true, said: '', isError: false });
                redraw($);
                return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_k.sent()).version;
                from = installedFrom($.plugin.root);
                _k.label = 2;
            case 2:
                _k.trys.push([2, 11, 12, 13]);
                return [4 /*yield*/, lookNow($, 'the panel\'s Install')];
            case 3:
                look = _k.sent();
                if (typeof look === 'string' || look.kind === 'failed' || !loaded || !isNewer(look.version, loaded)) {
                    said_1 = typeof look === 'string' ? { text: look, isError: true } : checkSaid(look, loaded, true, !from);
                    return [2 /*return*/, void Object.assign(installPress, { said: said_1.text, isError: said_1.isError })];
                }
                installPress.done = version;
                if (isRunFromAfar || isReloadRefused)
                    return [2 /*return*/, void Object.assign(installPress, { said: checkSaid(look, loaded, true, !from).text })
                        // The mark lets the next load know what it moved from, so the header shows the moment
                    ];
                _b = (_a = $.fs).write;
                _d = (_c = "".concat(dir, "/reloads/")).concat;
                return [4 /*yield*/, $.session.id()];
            case 4:
                _e = [_d.apply(_c, [_k.sent(), ".json"])];
                _g = (_f = JSON).stringify;
                _h = { version: look.version, from: loaded };
                return [4 /*yield*/, $.clock.now()];
            case 5: 
            // The mark lets the next load know what it moved from, so the header shows the moment
            return [4 /*yield*/, _b.apply(_a, _e.concat([_g.apply(_f, [(_h.at = _k.sent(), _h)])]))];
            case 6:
                // The mark lets the next load know what it moved from, so the header shows the moment
                _k.sent();
                return [4 /*yield*/, log($, "Claudopus ".concat(look.version, " installed from the panel's Install, and this chat runs ").concat(loaded, ": reloading it"))];
            case 7:
                _k.sent();
                return [4 /*yield*/, $.command.run({ command: 'reload-plugins' })];
            case 8:
                said_2 = _k.sent();
                if (!/isn't available/i.test(String((_j = said_2 === null || said_2 === void 0 ? void 0 : said_2.text) !== null && _j !== void 0 ? _j : ''))) return [3 /*break*/, 10];
                isReloadRefused = true;
                Object.assign(installPress, { said: checkSaid(look, loaded, true, !from).text });
                return [4 /*yield*/, log($, "Claudopus not reloaded to ".concat(look.version, ": the engine refused it; the panel says to type /reload-plugins"))];
            case 9:
                _k.sent();
                _k.label = 10;
            case 10: return [3 /*break*/, 13];
            case 11:
                err_1 = _k.sent();
                Object.assign(installPress, { said: "Couldn't install: ".concat(String(err_1 instanceof Error ? err_1.message : err_1).slice(0, 160)), isError: true });
                return [3 /*break*/, 13];
            case 12:
                installPress.isBusy = false;
                redraw($);
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}); };
// The panel's card for a newer version out: what it is and Install; while it installs, that; after, what came of it
var newOutCard = function ($, ui, version) {
    // After a press, what came of it stays once the card's version is installed
    var shown = !version || installPress.version === version ? installPress : undefined;
    if (!version && !(shown === null || shown === void 0 ? void 0 : shown.said))
        return null;
    return (<ui.Box key="update-out" flexDirection="column" flexShrink={0}>
      {version ? <ui.Text key="update-out-title" bold wrap="wrap">{"Claudopus ".concat(version, " is out")}</ui.Text> : null}
      {version ? <ui.Text key="update-out-what" dimColor wrap="wrap">Nothing is downloaded until you press Install, which gets it through Claude Code's own update steps and reloads this chat.</ui.Text> : null}
      {(shown === null || shown === void 0 ? void 0 : shown.isBusy) ? (<ui.Text key="update-out-busy" dimColor>Installing…</ui.Text>) : version ? (<ui.Box key="update-out-buttons" flexDirection="row">
          <ui.Button key={"update-install-".concat(presses)} label="Install" onPress={function () { return void ((presses += 1), installNew($, version)); }}/>
        </ui.Box>) : null}
      {(shown === null || shown === void 0 ? void 0 : shown.said) ? <ui.Text key="update-out-said" color={shown.isError ? 'error' : undefined} wrap="wrap">{shown.said}</ui.Text> : null}
    </ui.Box>);
};
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
