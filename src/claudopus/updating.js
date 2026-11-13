// Claudopus keeps itself up to date: every hour one chat reads the version page on claudopus.ai, and when it names a version other than the one installed runs Claude Code's own update steps for it (the pure parts are in hooks/update.ts)
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
// ---- Keeping itself up to date (the pure parts are in ./update) ----
// Every hour one chat on this Mac reads the version page and, when it differs from the installed version, runs Claude Code's own two
// update steps for the mod, under a lock the other chats see, and
// keeps what it learnt in update.json; a copy not installed from a marketplace (its maker's folder) is never updated
var isUpdating = false;
var selfUpdate = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var from, stampPath, _a, _b, _c, lock, token, _d, take, now, at, _e, _f, aside, before, _g, now, _h, installed, id, scope, have, page, current, result_1, engine, _j, refresh_1, update_1, run, refreshed, updated, _k, to, why, result;
    var _this = this;
    var _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                from = installedFrom($.plugin.root);
                if (!from || isUpdating || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, readConfig($, dir)];
            case 1:
                // Automatic updates turned off in Config leave the installed version alone
                if ((_p.sent()).updates === false)
                    return [2 /*return*/];
                stampPath = "".concat(dir, "/update.json");
                _a = isUpdateDue;
                _b = stampOf;
                return [4 /*yield*/, readOr($, stampPath)];
            case 2:
                _c = [_b.apply(void 0, [_p.sent()])];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                if (!_a.apply(void 0, _c.concat([_p.sent()])))
                    return [2 /*return*/];
                isUpdating = true;
                lock = "".concat(dir, "/update.lock");
                _d = "".concat;
                return [4 /*yield*/, $.clock.now()];
            case 4:
                token = _d.apply("", [_p.sent(), " "]).concat(Math.random().toString(36).slice(2)).concat(Math.random().toString(36).slice(2));
                take = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.process.run(['sh', '-c', 'set -C; printf %s "$2" > "$1"', 'sh', lock, token]).catch(function () { return ({ exitCode: 1 }); })];
                        case 1: return [2 /*return*/, (_a.sent()).exitCode === 0];
                    }
                }); }); };
                _p.label = 5;
            case 5:
                _p.trys.push([5, , 42, 43]);
                return [4 /*yield*/, take()];
            case 6:
                if (!!(_p.sent())) return [3 /*break*/, 14];
                return [4 /*yield*/, $.clock.now()];
            case 7:
                now = _p.sent();
                _f = Number;
                return [4 /*yield*/, readOr($, lock)];
            case 8:
                _e = _f.apply(void 0, [(_p.sent()).split(' ')[0]]);
                if (_e) return [3 /*break*/, 10];
                return [4 /*yield*/, $.fs.stat(lock).catch(function () { return undefined; })];
            case 9:
                _e = ((_l = (_p.sent())) === null || _l === void 0 ? void 0 : _l.mtimeMs);
                _p.label = 10;
            case 10:
                at = _e || now;
                if (now - at < UPDATE_LOOK)
                    return [2 /*return*/];
                aside = "".concat(lock, ".").concat(token.split(' ')[1]);
                return [4 /*yield*/, $.process.run(['mv', lock, aside]).catch(function () { return ({ exitCode: 1 }); })];
            case 11:
                if ((_p.sent()).exitCode !== 0)
                    return [2 /*return*/];
                return [4 /*yield*/, $.process.run(['rm', '-f', aside]).catch(function () { return undefined; })];
            case 12:
                _p.sent();
                return [4 /*yield*/, take()];
            case 13:
                if (!(_p.sent()))
                    return [2 /*return*/];
                _p.label = 14;
            case 14:
                _p.trys.push([14, , 37, 41]);
                _g = stampOf;
                return [4 /*yield*/, readOr($, stampPath)];
            case 15:
                before = _g.apply(void 0, [_p.sent()]);
                return [4 /*yield*/, $.clock.now()
                    // and the person may have turned automatic updates off while this chat waited for it
                ];
            case 16:
                now = _p.sent();
                _h = !isUpdateDue(before, now);
                if (_h) return [3 /*break*/, 18];
                return [4 /*yield*/, readConfig($, dir)];
            case 17:
                _h = (_p.sent()).updates === false;
                _p.label = 18;
            case 18:
                // and the person may have turned automatic updates off while this chat waited for it
                if (_h)
                    return [2 /*return*/];
                return [4 /*yield*/, readOr($, "".concat(from.plugins, "/installed_plugins.json"))];
            case 19:
                installed = _p.sent();
                id = "".concat(from.plugin, "@").concat(from.marketplace);
                scope = scopeOf(installed, id, $.plugin.root);
                have = installedVersionOf(installed, id, $.plugin.root, scope);
                return [4 /*yield*/, Promise.race([
                        $.http.fetch(VERSION_PAGE).catch(function (err) { return ({ ok: false, status: 0, text: String(err) }); }),
                        new Promise(function (done) { return void $.clock.after(VERSION_WAIT, function () { return done({ ok: false, status: 0, text: 'no answer' }); }); }),
                    ])];
            case 20:
                page = _p.sent();
                current = page.ok ? versionOnPage(page.text) : undefined;
                if (!!current) return [3 /*break*/, 23];
                result_1 = "version page not read: ".concat(page.ok ? 'no version on it' : page.status || page.text.slice(0, 120));
                return [4 /*yield*/, $.fs.write(stampPath, JSON.stringify({ at: now, version: (before === null || before === void 0 ? void 0 : before.version) || have, result: result_1 }))];
            case 21:
                _p.sent();
                return [4 /*yield*/, log($, "Claudopus ".concat(result_1))];
            case 22:
                _p.sent();
                return [2 /*return*/];
            case 23:
                if (!(current === have)) return [3 /*break*/, 25];
                return [4 /*yield*/, $.fs.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))];
            case 24:
                _p.sent();
                return [2 /*return*/];
            case 25: return [4 /*yield*/, log($, "Claudopus ".concat(current, " is on the version page and ").concat(have, " is installed: updating"))];
            case 26:
                _p.sent();
                return [4 /*yield*/, $.env.get('CLAUDE_CODE_EXECPATH')];
            case 27:
                engine = (_p.sent()) || 'claude';
                _j = updateSteps(engine, from, scope), refresh_1 = _j[0], update_1 = _j[1];
                run = function (argv, timeoutMs) { return $.process.run(argv, { timeoutMs: timeoutMs }).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); }); };
                return [4 /*yield*/, run(refresh_1, 180000)];
            case 28:
                refreshed = _p.sent();
                if (!(refreshed.exitCode === 0)) return [3 /*break*/, 30];
                return [4 /*yield*/, run(update_1, 300000)];
            case 29:
                _k = _p.sent();
                return [3 /*break*/, 31];
            case 30:
                _k = refreshed;
                _p.label = 31;
            case 31:
                updated = _k;
                to = refreshed.exitCode === 0 ? updatedTo("".concat(updated.stdout, "\n").concat(updated.stderr)) : undefined;
                why = "".concat(updated.stderr || updated.stdout).trim().slice(-200);
                result = to ? (to.isNew ? 'updated' : 'latest') : "".concat(refreshed.exitCode === 0 ? 'not updated' : 'marketplace not refreshed', ": ").concat(why);
                // A look that learnt nothing keeps the version the last one found, so About still says what is installed
                return [4 /*yield*/, $.fs.write(stampPath, JSON.stringify({ at: now, version: (_o = (_m = to === null || to === void 0 ? void 0 : to.version) !== null && _m !== void 0 ? _m : before === null || before === void 0 ? void 0 : before.version) !== null && _o !== void 0 ? _o : '', result: result }))];
            case 32:
                // A look that learnt nothing keeps the version the last one found, so About still says what is installed
                _p.sent();
                if (!(to === null || to === void 0 ? void 0 : to.isNew)) return [3 /*break*/, 34];
                return [4 /*yield*/, log($, "Claudopus updated to ".concat(to.version, ": chats that start from now on load it"))];
            case 33:
                _p.sent();
                return [3 /*break*/, 36];
            case 34:
                if (!!to) return [3 /*break*/, 36];
                return [4 /*yield*/, log($, "Claudopus ".concat(result))];
            case 35:
                _p.sent();
                _p.label = 36;
            case 36: return [3 /*break*/, 41];
            case 37: return [4 /*yield*/, readOr($, lock)];
            case 38:
                if (!((_p.sent()) === token)) return [3 /*break*/, 40];
                return [4 /*yield*/, $.process.run(['rm', '-f', lock]).catch(function () { return undefined; })];
            case 39:
                _p.sent();
                _p.label = 40;
            case 40: return [7 /*endfinally*/];
            case 41: return [3 /*break*/, 43];
            case 42:
                isUpdating = false;
                return [7 /*endfinally*/];
            case 43: return [2 /*return*/];
        }
    });
}); };
// ---- Moving an open chat to the version installed ----
// The version the Mac has installed now, from Claude Code's own record (installed_plugins.json), with the folder it is in; nothing
// for a copy run from a folder of its code, which has nothing installed to move to
var installedNow = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, installedCopy($)];
        case 1: return [2 /*return*/, (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : ''];
    }
}); }); };
var installedCopy = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var from, installed, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                from = installedFrom($.plugin.root);
                if (!from)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, readOr($, "".concat(from.plugins, "/installed_plugins.json"))];
            case 1:
                installed = _a.sent();
                id = "".concat(from.plugin, "@").concat(from.marketplace);
                return [2 /*return*/, copyOf(installed, id, $.plugin.root, cwd)];
        }
    });
}); };
// A chat whose copy is older than the one installed loads the new one itself, with Claude Code's own /reload-plugins: the run waits
// until the chat is idle (no turn of its own running), and background work carries on through it. The reload starts this code
// afresh; each ask is kept in reloads/<chat>.json, so a reload that brought back the old copy, or was refused, is not asked again
// for the same version for RELOAD_AGAIN, and a chat never reloads over and over
var reloadAsked = '';
var reloadToInstalled = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, copy, manifest, _a, mark, _b, _c, before, now, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!dir || reloadAsked)
                    return [2 /*return*/];
                return [4 /*yield*/, versionsOf($)];
            case 1:
                loaded = (_d.sent()).version;
                return [4 /*yield*/, installedCopy($)];
            case 2:
                copy = _d.sent();
                if (!loaded || !(copy === null || copy === void 0 ? void 0 : copy.version) || !isNewer(copy.version, loaded))
                    return [2 /*return*/];
                if (!copy.installPath) return [3 /*break*/, 4];
                return [4 /*yield*/, readOr($, "".concat(copy.installPath, "/.claude-plugin/plugin.json"))];
            case 3:
                _a = _d.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = '';
                _d.label = 5;
            case 5:
                manifest = _a;
                _c = (_b = "".concat(dir, "/reloads/")).concat;
                return [4 /*yield*/, $.session.id()];
            case 6:
                mark = _c.apply(_b, [_d.sent(), ".json"]);
                return [4 /*yield*/, readOr($, mark).then(function (text) {
                        try {
                            return JSON.parse(text);
                        }
                        catch (_a) {
                            return undefined;
                        }
                    })];
            case 7:
                before = _d.sent();
                return [4 /*yield*/, $.clock.now()];
            case 8:
                now = _d.sent();
                if (!isReloadDue(loaded, copy, manifest, before, now))
                    return [2 /*return*/];
                reloadAsked = copy.version;
                _d.label = 9;
            case 9:
                _d.trys.push([9, 13, 15, 16]);
                return [4 /*yield*/, $.fs.write(mark, JSON.stringify({ version: copy.version, from: loaded, at: now }))];
            case 10:
                _d.sent();
                return [4 /*yield*/, log($, "Claudopus ".concat(copy.version, " is installed and this chat runs ").concat(loaded, ": reloading it"))];
            case 11:
                _d.sent();
                return [4 /*yield*/, $.command.run({ command: 'reload-plugins' })];
            case 12:
                _d.sent();
                return [3 /*break*/, 16];
            case 13:
                err_1 = _d.sent();
                return [4 /*yield*/, log($, "Claudopus not reloaded to ".concat(copy.version, ": ").concat(String(err_1)))];
            case 14:
                _d.sent();
                return [3 /*break*/, 16];
            case 15:
                // Settled without this code being replaced (refused, or the old copy came back): the mark decides when to ask again
                reloadAsked = '';
                return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); };
// ---- The moment a chat moves to a newer version ----
// The version this chat loaded last, kept through a reload of this code, so the load after it knows what it moved from
var ranVersion = atom({ plugin: 'claudopus', key: 'ran' }, '', { shape: 'ran-1' });
// A move to a newer version this load made, from the version it ran before; its moment begins at the panel's first drawing
var updatedMoment;
var noteLoaded = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var loaded, ran, mark, _a, _b, _c, _d, now, from;
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
                updatedMoment = { from: from, to: loaded, loadedAt: now, startedAt: 0 };
                // A panel drawn while this load was still reading has no moment yet: it is drawn again now
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 7:
                // A panel drawn while this load was still reading has no moment yet: it is drawn again now
                _e.sent();
                return [4 /*yield*/, log($, "Claudopus moved from ".concat(from, " to ").concat(loaded, " in this chat: the header says Updated"))];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); };
// The header's version as it stands now (blue in Claudopus's workflow blue, the glint in the text's own bright colour): the moment's pieces while it lasts, drawn again each UPDATED_STEP until it is over
var updatedPieces = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var moment, now, left_1, step_1, look;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                moment = updatedMoment;
                if (!moment || moment.to !== version)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                if (!moment.startedAt) {
                    if (now - moment.loadedAt > UPDATED_LATE)
                        return [2 /*return*/, void (updatedMoment = undefined)];
                    moment.startedAt = now;
                    left_1 = Math.ceil(UPDATED_FOR / UPDATED_STEP) + 2;
                    step_1 = function () {
                        return void $.clock.after(UPDATED_STEP, function () {
                            void update($, tick, function (n) { return n + 1; });
                            if ((left_1 -= 1) > 0 && updatedMoment === moment)
                                step_1();
                        });
                    };
                    step_1();
                }
                look = updatedLook(moment.from, moment.to, now - moment.startedAt);
                if (!look && updatedMoment === moment)
                    updatedMoment = undefined;
                return [2 /*return*/, look];
        }
    });
}); };
var versionLine = function (ui, pieces) { return (<ui.Box key="head-version" flexDirection="row" flexShrink={1} minWidth={0}>
    {(pieces !== null && pieces !== void 0 ? pieces : []).map(function (piece, i) { return (<ui.Text key={"head-version-".concat(i)} wrap="truncate-end" dimColor={piece.tone === 'dim'} color={piece.tone === 'blue' ? FLOW : undefined} bold={piece.tone !== 'dim'}>
        {piece.text}
      </ui.Text>); })}
  </ui.Box>); };
