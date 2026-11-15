"use strict";
// Claudopus keeps itself up to date: Claude Code leaves a marketplace that is not Anthropic's alone unless each person turns its
// auto-update on, and the desktop app runs its engine with DISABLE_AUTOUPDATER=1, which turns that pass off anyway. So every few
// hours one chat on the Mac asks Claude Code itself to refresh this mod's marketplace and update the mod, the two steps a person
// would type. It runs those steps only when the version page on claudopus.ai names a version other than the one installed, so a
// look is one small fetch, with no model or agent in it. Chats that start after an update load the new version; chats already open
// keep the one they loaded.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stampOf = exports.isNewer = exports.isUpdateDue = exports.folderLook = exports.folderMarketplace = exports.pullFolder = exports.checkSaid = exports.lookOnce = exports.updatedTo = exports.updateSteps = exports.updatedArt = exports.updatedLook = exports.updatedFrom = exports.UPDATED_LATE = exports.UPDATED_SAYS = exports.UPDATED_FOR = exports.isReloadDue = exports.RELOAD_AGAIN = exports.RELOAD_EVERY = exports.copyOf = exports.installedVersionOf = exports.versionOnPage = exports.scopeOf = exports.installedFrom = exports.UPDATE_AFTER = exports.UPDATE_LOOK = exports.UPDATE_EVERY = exports.VERSION_WAIT = exports.VERSION_PAGE = void 0;
// The page that says which version is current: site/version.json, made by build.mjs from plugin.json and served from main
exports.VERSION_PAGE = 'https://www.claudopus.ai/version.json';
// How long the page may take to answer before the look counts it as not read
exports.VERSION_WAIT = 30000;
// How often the Mac looks at the version page, and how long a look may hold the lock before another chat takes over
exports.UPDATE_EVERY = 60 * 60 * 1000;
exports.UPDATE_LOOK = 15 * 60 * 1000;
// How long after a chat loads before it looks, so a chat's start is never held up
exports.UPDATE_AFTER = 2 * 60 * 1000;
// The marketplace and plugin a copy was installed from, read off its folder: Claude Code keeps an installed copy at
// <plugins>/cache/<marketplace>/<plugin>/<version>. A copy loaded from anywhere else (a folder of its code, as its maker runs it)
// is left alone: nothing was installed there to update
var installedFrom = function (root) {
    var _a;
    var _b = (_a = /^(.*\/plugins)\/cache\/([^/]+)\/([^/]+)\/[^/]+\/?$/.exec(root)) !== null && _a !== void 0 ? _a : [], _c = _b[1], plugins = _c === void 0 ? '' : _c, _d = _b[2], marketplace = _d === void 0 ? '' : _d, _e = _b[3], plugin = _e === void 0 ? '' : _e;
    return plugins && /^[\w.-]+$/.test(marketplace) && /^[\w.-]+$/.test(plugin) ? { plugins: plugins, marketplace: marketplace, plugin: plugin } : undefined;
};
exports.installedFrom = installedFrom;
// The scope this copy was installed at, read from installed_plugins.json by its folder; absent, `plugin update` takes the user's
var scopeOf = function (installed, id, root) {
    var _a, _b, _c, _d;
    try {
        var entries = (_c = (_b = (_a = JSON.parse(installed)) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b[id]) !== null && _c !== void 0 ? _c : [];
        var scope = (_d = entries.find(function (one) { var _a; return ((_a = one.installPath) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) === root.replace(/\/$/, ''); })) === null || _d === void 0 ? void 0 : _d.scope;
        return scope && /^(user|project|local)$/.test(scope) ? scope : undefined;
    }
    catch (_e) {
        return undefined;
    }
};
exports.scopeOf = scopeOf;
// The version the page names, or undefined for anything that is not one
var versionOnPage = function (text) {
    var _a;
    try {
        var version = (_a = JSON.parse(text)) === null || _a === void 0 ? void 0 : _a.version;
        return typeof version === 'string' && /^\d+(\.\d+){1,3}([-+][\w.]+)?$/.test(version) ? version : undefined;
    }
    catch (_b) {
        return undefined;
    }
};
exports.versionOnPage = versionOnPage;
// The version installed at the scope this copy was installed at, from installed_plugins.json (a chat that started before an update
// runs the old folder, but the Mac has the new one); without an entry, the version folder this copy runs from
var installedVersionOf = function (installed, id, root, scope) {
    var _a, _b, _c, _d, _e;
    var folder = (_a = root.replace(/\/$/, '').split('/').at(-1)) !== null && _a !== void 0 ? _a : '';
    try {
        var entries = ((_d = (_c = (_b = JSON.parse(installed)) === null || _b === void 0 ? void 0 : _b.plugins) === null || _c === void 0 ? void 0 : _c[id]) !== null && _d !== void 0 ? _d : []).filter(function (one) { return typeof (one === null || one === void 0 ? void 0 : one.version) === 'string' && one.version; });
        // This very folder's entry first, then one at the scope it was installed at, then the user's
        var own = entries.find(function (one) { var _a; return ((_a = one.installPath) === null || _a === void 0 ? void 0 : _a.replace(/\/$/, '')) === root.replace(/\/$/, ''); });
        return ((_e = (own !== null && own !== void 0 ? own : entries.find(function (one) { return one.scope === (scope !== null && scope !== void 0 ? scope : 'user'); }))) === null || _e === void 0 ? void 0 : _e.version) || folder;
    }
    catch (_f) {
        return folder;
    }
};
exports.installedVersionOf = installedVersionOf;
// The installed copy this chat would load if it started now, with the folder Claude Code put it in: this very folder's entry, else the
// project or local install of the folder the chat runs in (the nearest one), else the user's
var copyOf = function (installed, id, root, cwd) {
    var _a, _b, _c, _d;
    if (cwd === void 0) { cwd = ''; }
    try {
        var entries = ((_c = (_b = (_a = JSON.parse(installed)) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b[id]) !== null && _c !== void 0 ? _c : []).filter(function (one) { return typeof (one === null || one === void 0 ? void 0 : one.version) === 'string' && one.version; });
        var trim_1 = function (path) {
            if (path === void 0) { path = ''; }
            return path.replace(/\/$/, '');
        };
        var own = entries.find(function (one) { return trim_1(one.installPath) === trim_1(root); });
        var inFolder = entries
            .filter(function (one) { return one.scope !== 'user' && one.projectPath && (trim_1(cwd) === trim_1(one.projectPath) || trim_1(cwd).startsWith("".concat(trim_1(one.projectPath), "/"))); })
            .sort(function (x, y) { return trim_1(y.projectPath).length - trim_1(x.projectPath).length; })[0];
        var one = (_d = own !== null && own !== void 0 ? own : inFolder) !== null && _d !== void 0 ? _d : entries.find(function (one) { return one.scope === 'user'; });
        return (one === null || one === void 0 ? void 0 : one.version) ? { version: one.version, installPath: one.installPath ? trim_1(one.installPath) : undefined } : undefined;
    }
    catch (_e) {
        return undefined;
    }
};
exports.copyOf = copyOf;
// How often an open chat looks whether a newer copy is installed, and how long before a chat asks again for a reload to the same
// version (one that brought back the old copy, or was refused)
exports.RELOAD_EVERY = 20000;
exports.RELOAD_AGAIN = 10 * 60 * 1000;
// Whether a chat running `loaded` reloads to the installed copy: a newer one, whole on disk (its manifest names that version), and
// not already asked for in this chat within RELOAD_AGAIN
var isReloadDue = function (loaded, copy, manifest, before, now) {
    if (!loaded || !(copy === null || copy === void 0 ? void 0 : copy.version) || !(0, exports.isNewer)(copy.version, loaded))
        return false;
    if (copy.installPath && versionIn(manifest) !== copy.version)
        return false;
    var at = typeof (before === null || before === void 0 ? void 0 : before.at) === 'number' && Number.isFinite(before.at) ? before.at : undefined;
    return !(at !== undefined && (before === null || before === void 0 ? void 0 : before.version) === copy.version && now >= at && now - at < exports.RELOAD_AGAIN);
};
exports.isReloadDue = isReloadDue;
// The moment a chat moves to a newer version, UPDATED_FOR long: the octopus turns blue and jumps (its own animation, played by the
// surface), the name line says "Claudopus updated" in blue and, from UPDATED_SAYS, the new version; a sound plays once; then all is
// as before. The look changes only at UPDATED_SAYS and UPDATED_FOR, so the moment adds no drawings of its own between them: the
// desktop app drops a drawing it asked for once the next change is announced, so a moment redrawn each 150 ms never reached a chat
// run over ssh, whose drawings take longer than that to come back. Its drawings then have as long as the panel's own beat allows. A panel first drawn later than UPDATED_LATE after the load shows nothing of it
exports.UPDATED_FOR = 5000;
exports.UPDATED_SAYS = 2500;
exports.UPDATED_LATE = 10 * 60 * 1000;
// The version this chat ran before this load, when the load moved it to a newer one: the version the chat last loaded (kept
// through a reload), else, for a chat whose last copy kept none, the reload it asked for (reloads/<chat>.json) to this very
// version, if recent
var updatedFrom = function (loaded, ran, mark, now) {
    var asked = (mark === null || mark === void 0 ? void 0 : mark.version) === loaded && typeof mark.from === 'string' && typeof mark.at === 'number' && now >= mark.at && now - mark.at < exports.UPDATED_LATE ? mark.from : '';
    var before = ran || asked;
    return loaded && before && (0, exports.isNewer)(loaded, before) ? before : '';
};
exports.updatedFrom = updatedFrom;
var updatedLook = function (to, t) {
    if (!(t >= 0 && t < exports.UPDATED_FOR) || !to)
        return undefined;
    return [{ text: 'Claudopus' }, { text: t >= exports.UPDATED_SAYS ? "v".concat(to) : 'updated' }];
};
exports.updatedLook = updatedLook;
// The octopus of the moment: the happy one in the workflow blue, its jump played over the whole moment, resting on its last picture,
// and drawn closer, so it is as big as the octopus at rest (the happy drawing leaves room round it for its arms and sparkles)
var updatedArt = function (happy, blue) {
    return happy.replace('viewBox="0 0 24 24"', 'viewBox="1 -1 22 22"').replaceAll('#4EBA65', blue).replaceAll('dur="2s"', "dur=\"".concat(exports.UPDATED_FOR / 4000, "s\" repeatCount=\"4\""));
};
exports.updatedArt = updatedArt;
var nameIn = function (manifest) {
    var _a;
    try {
        var name_1 = (_a = JSON.parse(manifest)) === null || _a === void 0 ? void 0 : _a.name;
        return typeof name_1 === 'string' && /^[\w.-]+$/.test(name_1) ? name_1 : '';
    }
    catch (_b) {
        return '';
    }
};
var versionIn = function (manifest) {
    var _a, _b;
    try {
        return String((_b = (_a = JSON.parse(manifest)) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : '');
    }
    catch (_c) {
        return '';
    }
};
// The two commands, in order: refresh the marketplace's copy (`plugin update` alone does not, and reports the old version as the
// latest), then update the mod from it, at the scope it was installed at
var updateSteps = function (engine, from, scope) { return [
    [engine, 'plugin', 'marketplace', 'update', from.marketplace],
    __spreadArray([engine, 'plugin', 'update', "".concat(from.plugin, "@").concat(from.marketplace)], (scope ? ['--scope', scope] : []), true),
]; };
exports.updateSteps = updateSteps;
// The version `plugin update` says it moved to, or the one it says is already the latest
var updatedTo = function (out) {
    var moved = /updated from \S+ to (\S+?)\.?(?:\s|$)/.exec(out);
    if (moved === null || moved === void 0 ? void 0 : moved[1])
        return { version: moved[1], isNew: true };
    var same = /already at the latest version \(([^)]+)\)/.exec(out);
    return (same === null || same === void 0 ? void 0 : same[1]) ? { version: same[1], isNew: false } : undefined;
};
exports.updatedTo = updatedTo;
// One look, run by whoever holds the update lock: it reads the version page, runs the two update steps only when the page names a
// version other than the one installed, and keeps what it learnt in update.json
var lookOnce = function (io, at) { return __awaiter(void 0, void 0, void 0, function () {
    var from, engine, stampPath, before, _a, now, installed, id, root, scope, have, page, current, result_1, known, source, pulled, _b, _c, refresh, update, run, refreshed, updated, _d, to, why, result, said;
    var _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                from = at.from, engine = at.engine, stampPath = at.stampPath;
                _a = exports.stampOf;
                return [4 /*yield*/, io.read(stampPath).catch(function () { return ''; })];
            case 1:
                before = _a.apply(void 0, [_l.sent()]);
                return [4 /*yield*/, io.now()];
            case 2:
                now = _l.sent();
                return [4 /*yield*/, io.read("".concat(from.plugins, "/installed_plugins.json")).catch(function () { return ''; })];
            case 3:
                installed = _l.sent();
                id = "".concat(from.plugin, "@").concat(from.marketplace);
                root = (0, exports.scopeOf)(installed, id, at.root) ? at.root : ((_f = (_e = (0, exports.copyOf)(installed, id, at.root, at.cwd)) === null || _e === void 0 ? void 0 : _e.installPath) !== null && _f !== void 0 ? _f : at.root);
                scope = (0, exports.scopeOf)(installed, id, root);
                have = (0, exports.installedVersionOf)(installed, id, root, scope);
                return [4 /*yield*/, io.page()];
            case 4:
                page = _l.sent();
                current = page.ok ? (0, exports.versionOnPage)(page.text) : undefined;
                if (!!current) return [3 /*break*/, 7];
                result_1 = "version page not read: ".concat(page.ok ? 'no version on it' : page.status || page.text.slice(0, 120));
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: (before === null || before === void 0 ? void 0 : before.version) || have, result: result_1 }))];
            case 5:
                _l.sent();
                return [4 /*yield*/, io.log("Claudopus ".concat(result_1))];
            case 6:
                _l.sent();
                return [2 /*return*/, { kind: 'failed', why: page.ok ? 'claudopus.ai named no version' : page.status ? "claudopus.ai answered ".concat(page.status) : 'claudopus.ai did not answer' }];
            case 7:
                if (!(current === have)) return [3 /*break*/, 9];
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))];
            case 8:
                _l.sent();
                return [2 /*return*/, { kind: 'latest', version: have }];
            case 9: return [4 /*yield*/, io.log("Claudopus ".concat(current, " is on the version page and ").concat(have, " is installed: updating"))
                // A marketplace that is a folder of the code (a git checkout) is brought up to date first, so the refresh finds the new version
            ];
            case 10:
                _l.sent();
                return [4 /*yield*/, io.read("".concat(from.plugins, "/known_marketplaces.json")).catch(function () { return ''; })];
            case 11:
                known = _l.sent();
                source = (function () {
                    var _a, _b;
                    try {
                        var one = (_b = (_a = JSON.parse(known)) === null || _a === void 0 ? void 0 : _a[from.marketplace]) === null || _b === void 0 ? void 0 : _b.source;
                        return (one === null || one === void 0 ? void 0 : one.source) === 'directory' && typeof one.path === 'string' ? one.path : '';
                    }
                    catch (_c) {
                        return '';
                    }
                })();
                if (!source) return [3 /*break*/, 13];
                return [4 /*yield*/, (0, exports.pullFolder)(io, source)];
            case 12:
                _b = _l.sent();
                return [3 /*break*/, 14];
            case 13:
                _b = undefined;
                _l.label = 14;
            case 14:
                pulled = _b;
                if (!((pulled === null || pulled === void 0 ? void 0 : pulled.kind) === 'refused')) return [3 /*break*/, 16];
                return [4 /*yield*/, io.log("Claudopus marketplace folder not updated: ".concat(pulled.why))];
            case 15:
                _l.sent();
                _l.label = 16;
            case 16:
                _c = (0, exports.updateSteps)(engine, from, scope), refresh = _c[0], update = _c[1];
                run = function (argv, timeoutMs) { return io.run(argv, timeoutMs).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); }); };
                return [4 /*yield*/, run(refresh, 180000)];
            case 17:
                refreshed = _l.sent();
                if (!(refreshed.exitCode === 0)) return [3 /*break*/, 19];
                return [4 /*yield*/, run(update, 300000)];
            case 18:
                _d = _l.sent();
                return [3 /*break*/, 20];
            case 19:
                _d = refreshed;
                _l.label = 20;
            case 20:
                updated = _d;
                to = refreshed.exitCode === 0 ? (0, exports.updatedTo)("".concat(updated.stdout, "\n").concat(updated.stderr)) : undefined;
                why = "".concat(updated.stderr || updated.stdout).trim().slice(-200);
                result = to ? (to.isNew ? 'updated' : 'latest') : "".concat(refreshed.exitCode === 0 ? 'not updated' : 'marketplace not refreshed', ": ").concat(why);
                // A look that learnt nothing keeps the version the last one found, so About still says what is installed
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: (_h = (_g = to === null || to === void 0 ? void 0 : to.version) !== null && _g !== void 0 ? _g : before === null || before === void 0 ? void 0 : before.version) !== null && _h !== void 0 ? _h : '', result: result }))];
            case 21:
                // A look that learnt nothing keeps the version the last one found, so About still says what is installed
                _l.sent();
                if (!(to === null || to === void 0 ? void 0 : to.isNew)) return [3 /*break*/, 23];
                return [4 /*yield*/, io.log("Claudopus updated to ".concat(to.version, ": chats that start from now on load it"))];
            case 22:
                _l.sent();
                return [3 /*break*/, 25];
            case 23:
                if (!!to) return [3 /*break*/, 25];
                return [4 /*yield*/, io.log("Claudopus ".concat(result))
                    // Both steps ran, yet where Claude Code installs it from still has an older version than the page (a folder of its code not brought
                    // up to date): the newest is not here, and that is said rather than "newest"
                ];
            case 24:
                _l.sent();
                _l.label = 25;
            case 25:
                // Both steps ran, yet where Claude Code installs it from still has an older version than the page (a folder of its code not brought
                // up to date): the newest is not here, and that is said rather than "newest"
                if (to && (0, exports.isNewer)(current, to.version))
                    return [2 /*return*/, (pulled === null || pulled === void 0 ? void 0 : pulled.kind) === 'refused'
                            ? { kind: 'failed', version: current, why: "where Claude Code installs it from still has v".concat(to.version, ": ").concat(pulled.why), next: 'Nothing in it was changed.' }
                            : { kind: 'failed', version: current, why: "where Claude Code installs it from still has v".concat(to.version), next: 'Bring that up to date, then check again.' }];
                if (to)
                    return [2 /*return*/, { kind: to.isNew ? 'updated' : 'latest', version: to.version }];
                said = (_k = (_j = why.split('\n').at(-1)) === null || _j === void 0 ? void 0 : _j.trim()) !== null && _k !== void 0 ? _k : '';
                return [2 /*return*/, { kind: 'failed', version: current, why: "".concat(refreshed.exitCode === 0 ? 'Claude Code did not update it' : 'Claude Code could not refresh where it comes from').concat(said ? " (".concat(said.slice(0, 120), ")") : '') }];
        }
    });
}); };
exports.lookOnce = lookOnce;
// What Config's Check for updates says once its look is over, for a chat running `loaded`: newest, downloaded and waiting for
// /reload-plugins in this chat, or why not. A chat on this Mac also switches by itself once it is idle; one run from another Mac
// cannot (the engine refuses a reload it was not typed in there), so there it is only typed
var checkSaid = function (look, loaded, isTypedOnly, isFolder) {
    var _a;
    if (isTypedOnly === void 0) { isTypedOnly = false; }
    if (isFolder === void 0) { isFolder = false; }
    if (look.kind === 'failed')
        return { text: "Couldn't ".concat(look.version ? "".concat(isFolder ? 'update to' : 'download', " v").concat(look.version) : 'check', ": ").concat(look.why, ". ").concat((_a = look.next) !== null && _a !== void 0 ? _a : 'Try again later.'), isError: true };
    if (loaded && (0, exports.isNewer)(look.version, loaded))
        return { text: "v".concat(look.version, " ").concat(isFolder ? 'is in its folder now' : 'downloaded', ". Type /reload-plugins to switch this chat to it").concat(isTypedOnly ? '.' : ', or it switches by itself in a moment.'), isError: false };
    return { text: "You're on the newest version (v".concat(look.version, ")."), isError: false };
};
exports.checkSaid = checkSaid;
var pullFolder = function (io, folder) { return __awaiter(void 0, void 0, void 0, function () {
    var git, last, _a, _b, gitDir, _c, commonDir, branch, upstream, fetched, _d, head, theirs, _e, isClean, merged, said;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                git = function (args, timeoutMs) {
                    if (timeoutMs === void 0) { timeoutMs = 20000; }
                    return io
                        .run(__spreadArray(['env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', folder], args, true), timeoutMs)
                        .catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); });
                };
                last = function (out) { var _a, _b; return (_b = (_a = "".concat(out.stderr || out.stdout).trim().split('\n').at(-1)) === null || _a === void 0 ? void 0 : _a.trim().replace(/^(fatal|error): /, '').slice(0, 140)) !== null && _b !== void 0 ? _b : ''; };
                return [4 /*yield*/, git(['rev-parse', '--show-toplevel'])];
            case 1:
                if ((_h.sent()).exitCode !== 0)
                    return [2 /*return*/, { kind: 'refused', why: 'its folder is not a git checkout' }];
                return [4 /*yield*/, git(['ls-files', '--error-unmatch', ':/mods/claudopus/.claude-plugin/plugin.json'])];
            case 2:
                if ((_h.sent()).exitCode !== 0)
                    return [2 /*return*/, { kind: 'refused', why: "its folder is in a git checkout that isn't Claudopus's" }];
                return [4 /*yield*/, git(['rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir'])];
            case 3:
                _a = (_h.sent()).stdout.trim().split('\n'), _b = _a[0], gitDir = _b === void 0 ? '' : _b, _c = _a[1], commonDir = _c === void 0 ? '' : _c;
                if (gitDir.trim() !== commonDir.trim())
                    return [2 /*return*/, { kind: 'refused', why: 'its folder is a git worktree, not the main checkout' }];
                return [4 /*yield*/, git(['symbolic-ref', '-q', '--short', 'HEAD'])];
            case 4:
                branch = (_h.sent()).stdout.trim();
                if (!branch)
                    return [2 /*return*/, { kind: 'refused', why: 'its folder is on no branch' }];
                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])];
            case 5:
                upstream = (_h.sent()).stdout.trim();
                if (branch !== 'main' || !/^[^/]+\/main$/.test(upstream))
                    return [2 /*return*/, { kind: 'refused', why: "its folder is on ".concat(upstream ? "".concat(branch, ", following ").concat(upstream) : branch, ", and releases come out on main") }];
                return [4 /*yield*/, git(['fetch', '--quiet'], 120000)];
            case 6:
                fetched = _h.sent();
                if (fetched.exitCode !== 0)
                    return [2 /*return*/, { kind: 'refused', why: "its folder could not fetch ".concat(upstream, " (").concat(last(fetched), ")") }];
                return [4 /*yield*/, git(['rev-parse', 'HEAD'])];
            case 7:
                _e = [(_h.sent()).stdout.trim()];
                return [4 /*yield*/, git(['rev-parse', '@{u}'])];
            case 8:
                _d = _e.concat([(_h.sent()).stdout.trim()]), head = _d[0], theirs = _d[1];
                if (!head || !theirs)
                    return [2 /*return*/, { kind: 'refused', why: "git did not say where ".concat(upstream, " is") }];
                isClean = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var status;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, git(['status', '--porcelain', '--untracked-files=no'])];
                            case 1:
                                status = _a.sent();
                                return [2 /*return*/, status.exitCode === 0 && !status.stdout.trim()];
                        }
                    });
                }); };
                if (!(head === theirs)) return [3 /*break*/, 10];
                _f = { kind: 'same' };
                return [4 /*yield*/, isClean()];
            case 9: return [2 /*return*/, (_f.isClean = _h.sent(), _f)];
            case 10: return [4 /*yield*/, git(['merge-base', '--is-ancestor', 'HEAD', '@{u}'])];
            case 11:
                if ((_h.sent()).exitCode !== 0)
                    return [2 /*return*/, { kind: 'refused', why: "its folder's main has commits of its own that ".concat(upstream, " does not have") }];
                return [4 /*yield*/, git(['merge', '--ff-only', '--quiet', '@{u}'], 120000)];
            case 12:
                merged = _h.sent();
                if (!(merged.exitCode === 0)) return [3 /*break*/, 14];
                _g = { kind: 'pulled' };
                return [4 /*yield*/, isClean()];
            case 13: return [2 /*return*/, (_g.isClean = _h.sent(), _g)];
            case 14:
                said = "".concat(merged.stderr, "\n").concat(merged.stdout);
                if (/would be overwritten/.test(said))
                    return [2 /*return*/, { kind: 'refused', why: "changes in its folder that aren't committed touch files the update changes" }];
                return [2 /*return*/, { kind: 'refused', why: "git would not update its folder (".concat(last(merged), ")") }];
        }
    });
}); };
exports.pullFolder = pullFolder;
// The marketplace a copy run from a folder belongs to, when Claude Code knows that folder as a directory marketplace: its record
// then follows the folder too, so /plugin and new installs agree with it
var folderMarketplace = function (known, root) {
    var _a;
    try {
        var trim_2 = function (path) {
            if (path === void 0) { path = ''; }
            return path.replace(/\/+$/, '');
        };
        var entries = Object.entries((_a = JSON.parse(known)) !== null && _a !== void 0 ? _a : {});
        var found = entries.find(function (_a) {
            var _b;
            var name = _a[0], one = _a[1];
            return /^[\w.-]+$/.test(name) && ((_b = one === null || one === void 0 ? void 0 : one.source) === null || _b === void 0 ? void 0 : _b.source) === 'directory' && one.source.path && (trim_2(root) === trim_2(one.source.path) || trim_2(root) === "".concat(trim_2(one.source.path), "/mods/claudopus"));
        });
        return found === null || found === void 0 ? void 0 : found[0];
    }
    catch (_b) {
        return undefined;
    }
};
exports.folderMarketplace = folderMarketplace;
// One look for a copy run from a folder of its code: the version page, then, when it names a newer version than the folder has,
// the folder brought up to date; Claude Code's record of a directory marketplace in that folder is refreshed after it
var folderLook = function (io, at) { return __awaiter(void 0, void 0, void 0, function () {
    var root, stampPath, now, manifest, have, page, current, result, pulled, to, marketplace_1, _a, plugin_1, _b, installed_1, scopes, scope, _i, _c, step, out;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                root = at.root, stampPath = at.stampPath;
                return [4 /*yield*/, io.now()];
            case 1:
                now = _d.sent();
                manifest = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = versionIn;
                            return [4 /*yield*/, io.read("".concat(root, "/.claude-plugin/plugin.json")).catch(function () { return ''; })];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                }); }); };
                return [4 /*yield*/, manifest()];
            case 2:
                have = _d.sent();
                return [4 /*yield*/, io.page()];
            case 3:
                page = _d.sent();
                current = page.ok ? (0, exports.versionOnPage)(page.text) : undefined;
                if (!!current) return [3 /*break*/, 6];
                result = "version page not read: ".concat(page.ok ? 'no version on it' : page.status || page.text.slice(0, 120));
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: have, result: result }))];
            case 4:
                _d.sent();
                return [4 /*yield*/, io.log("Claudopus ".concat(result))];
            case 5:
                _d.sent();
                return [2 /*return*/, { kind: 'failed', why: page.ok ? 'claudopus.ai named no version' : page.status ? "claudopus.ai answered ".concat(page.status) : 'claudopus.ai did not answer' }];
            case 6:
                if (!(have && !(0, exports.isNewer)(current, have))) return [3 /*break*/, 8];
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: have, result: 'latest' }))];
            case 7:
                _d.sent();
                return [2 /*return*/, { kind: 'latest', version: have }];
            case 8: return [4 /*yield*/, io.log("Claudopus ".concat(current, " is on the version page and its folder ").concat(root, " has ").concat(have || 'no version', ": bringing the folder up to date"))];
            case 9:
                _d.sent();
                return [4 /*yield*/, (0, exports.pullFolder)(io, root)];
            case 10:
                pulled = _d.sent();
                return [4 /*yield*/, manifest()];
            case 11:
                to = _d.sent();
                if (!(pulled.kind === 'refused')) return [3 /*break*/, 14];
                return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: to, result: "folder not updated: ".concat(pulled.why) }))];
            case 12:
                _d.sent();
                return [4 /*yield*/, io.log("Claudopus folder not updated: ".concat(pulled.why))];
            case 13:
                _d.sent();
                return [2 /*return*/, { kind: 'failed', version: current, why: pulled.why, next: 'Nothing in it was changed.' }];
            case 14:
                if (!(pulled.kind === 'pulled')) return [3 /*break*/, 23];
                return [4 /*yield*/, io.log("Claudopus folder updated from ".concat(have, " to ").concat(to, ": chats that reload or start from now on load it"))
                    // Claude Code's own record of the folder follows it, when it knows the folder as a marketplace; what it says is only logged
                ];
            case 15:
                _d.sent();
                _a = exports.folderMarketplace;
                return [4 /*yield*/, io.read("".concat(at.plugins, "/known_marketplaces.json")).catch(function () { return ''; })];
            case 16:
                marketplace_1 = _a.apply(void 0, [_d.sent(), root]);
                _b = nameIn;
                return [4 /*yield*/, io.read("".concat(root, "/.claude-plugin/plugin.json")).catch(function () { return ''; })];
            case 17:
                plugin_1 = _b.apply(void 0, [_d.sent()]);
                return [4 /*yield*/, io.read("".concat(at.plugins, "/installed_plugins.json")).catch(function () { return ''; })];
            case 18:
                installed_1 = _d.sent();
                scopes = (function () {
                    var _a, _b, _c;
                    try {
                        return ((_c = (_b = (_a = JSON.parse(installed_1)) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b["".concat(plugin_1, "@").concat(marketplace_1)]) !== null && _c !== void 0 ? _c : []).map(function (one) { return one === null || one === void 0 ? void 0 : one.scope; });
                    }
                    catch (_d) {
                        return [];
                    }
                })();
                scope = scopes.includes('user') ? 'user' : scopes.find(function (one) { return typeof one === 'string' && /^(user|project|local)$/.test(one); });
                if (!(marketplace_1 && plugin_1 && scope && pulled.isClean)) return [3 /*break*/, 23];
                _i = 0, _c = (0, exports.updateSteps)(at.engine, { marketplace: marketplace_1, plugin: plugin_1 }, scope);
                _d.label = 19;
            case 19:
                if (!(_i < _c.length)) return [3 /*break*/, 23];
                step = _c[_i];
                return [4 /*yield*/, io.run(step, 180000).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); })];
            case 20:
                out = _d.sent();
                if (out.exitCode === 0)
                    return [3 /*break*/, 22];
                return [4 /*yield*/, io.log("Claudopus record of ".concat(plugin_1, "@").concat(marketplace_1, " not refreshed: ").concat("".concat(out.stderr || out.stdout).trim().slice(-160)))];
            case 21:
                _d.sent();
                return [3 /*break*/, 23];
            case 22:
                _i++;
                return [3 /*break*/, 19];
            case 23: return [4 /*yield*/, io.write(stampPath, JSON.stringify({ at: now, version: to, result: pulled.kind === 'pulled' ? 'updated' : 'latest' }))];
            case 24:
                _d.sent();
                if (to && (0, exports.isNewer)(current, to))
                    return [2 /*return*/, { kind: 'failed', version: current, why: "its folder's main online still has v".concat(to), next: 'Check again in a few minutes.' }];
                return [2 /*return*/, { kind: pulled.kind === 'pulled' ? 'updated' : 'latest', version: to || current }];
        }
    });
}); };
exports.folderLook = folderLook;
// Whether a look is due: none yet, or the last one is older than UPDATE_EVERY (a clock moved back counts as due)
var isUpdateDue = function (stamp, now) { return !stamp || now - stamp.at >= exports.UPDATE_EVERY || now < stamp.at; };
exports.isUpdateDue = isUpdateDue;
// Whether version a is newer than b, by its dotted numbers
var isNewer = function (a, b) {
    var _a, _b, _c, _d;
    var pa = a.split(/[.-]/).map(function (n) { return parseInt(n, 10) || 0; });
    var pb = b.split(/[.-]/).map(function (n) { return parseInt(n, 10) || 0; });
    for (var i = 0; i < Math.max(pa.length, pb.length); i++)
        if (((_a = pa[i]) !== null && _a !== void 0 ? _a : 0) !== ((_b = pb[i]) !== null && _b !== void 0 ? _b : 0))
            return ((_c = pa[i]) !== null && _c !== void 0 ? _c : 0) > ((_d = pb[i]) !== null && _d !== void 0 ? _d : 0);
    return false;
};
exports.isNewer = isNewer;
var stampOf = function (text) {
    var _a, _b;
    try {
        var v = JSON.parse(text);
        return typeof (v === null || v === void 0 ? void 0 : v.at) === 'number' ? { at: v.at, version: String((_a = v.version) !== null && _a !== void 0 ? _a : ''), result: String((_b = v.result) !== null && _b !== void 0 ? _b : '') } : undefined;
    }
    catch (_c) {
        return undefined;
    }
};
exports.stampOf = stampOf;
