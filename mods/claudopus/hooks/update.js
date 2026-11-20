"use strict";
// Updating Claudopus, the pure parts: it never installs by itself. A look only reads the version page on claudopus.ai (one small
// fetch, with no model or agent in it), and the panel says when it names a newer version. Then three steps, each a press: Download
// fetches the release and checks it is what the release published, Install puts it in place (Claude Code's own steps for an
// installed copy, a fast-forward for a folder of the code), Reload switches a chat to it.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stampOf = exports.isNewer = exports.isUpdateDue = exports.lookEveryOf = exports.LOOK_EVERY_HOURS = exports.noticeOf = exports.folderMarketplace = exports.install = exports.download = exports.DOWNLOAD_REF = exports.treeOfFolder = exports.TREE_OF_FOLDER = exports.fetchProgress = exports.STEP_STALE = exports.stepsOf = exports.FAILS = exports.folderReady = exports.MID_WAY = exports.sizeText = exports.missedOn = exports.publishedOf = exports.isTree = exports.isVersion = exports.updateSteps = exports.updatedArt = exports.updatedLook = exports.updatedFrom = exports.UPDATED_LATE = exports.UPDATED_SAYS = exports.UPDATED_FOR = exports.isReloadDue = exports.RELOAD_AGAIN = exports.RELOAD_EVERY = exports.copyOf = exports.installedVersionOf = exports.versionOnPage = exports.scopeOf = exports.installedFrom = exports.UPDATE_AFTER = exports.UPDATE_LOOK = exports.UPDATE_EVERY = exports.VERSION_WAIT = exports.VERSION_PAGE = void 0;
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
    return plugins && /^\w[\w.-]*$/.test(marketplace) && /^\w[\w.-]*$/.test(plugin) ? { plugins: plugins, marketplace: marketplace, plugin: plugin } : undefined;
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
// Claude Code's two steps for an installed copy, in order: refresh the marketplace's copy, then update the mod from it, at the scope
// it was installed at
var updateSteps = function (engine, from, scope) { return [
    [engine, 'plugin', 'marketplace', 'update', from.marketplace],
    __spreadArray([engine, 'plugin', 'update', "".concat(from.plugin, "@").concat(from.marketplace)], (scope ? ['--scope', scope] : []), true),
]; };
exports.updateSteps = updateSteps;
var VERSION_RE = /^\d{1,4}(?:\.\d{1,6}){1,3}$/;
var isVersion = function (text) { return typeof text === 'string' && VERSION_RE.test(text); };
exports.isVersion = isVersion;
var isTree = function (text) { return typeof text === 'string' && /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(text); };
exports.isTree = isTree;
var plainLine = function (text, most) {
    if (most === void 0) { most = 140; }
    return typeof text === 'string'
        ? text
            .replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, most)
        : '';
};
var publishedOf = function (text) {
    try {
        var page = JSON.parse(text);
        if (!(0, exports.isVersion)(page === null || page === void 0 ? void 0 : page.version) || !(0, exports.isTree)(page.tree))
            return undefined;
        var versions = (Array.isArray(page.versions) ? page.versions : [])
            .slice(0, 60)
            .filter(function (one) { return (0, exports.isVersion)(one === null || one === void 0 ? void 0 : one.version); })
            .map(function (one) { return ({ version: one.version, line: plainLine(one.line), more: Math.max(0, Math.min(99, Math.floor(Number(one.more) || 0))) }); });
        var size = Number(page.size);
        return { version: page.version, tree: page.tree, size: Number.isFinite(size) && size > 0 ? Math.floor(size) : 0, versions: versions };
    }
    catch (_a) {
        return undefined;
    }
};
exports.publishedOf = publishedOf;
// The versions a chat running `loaded` has not had, newest first, as the page lists them (the page's own version always among them)
var missedOn = function (page, loaded) {
    var listed = page.versions.filter(function (one) { return (0, exports.isNewer)(one.version, loaded); });
    return listed.some(function (one) { return one.version === page.version; }) || !(0, exports.isNewer)(page.version, loaded) ? listed : __spreadArray([{ version: page.version, line: '', more: 0 }], listed, true);
};
exports.missedOn = missedOn;
// A size as people read it
var sizeText = function (bytes) { return (bytes >= 1e6 ? "".concat((bytes / 1e6).toFixed(1), " MB") : bytes >= 1e3 ? "".concat(Math.round(bytes / 1e3), " KB") : "".concat(bytes, " bytes")); };
exports.sizeText = sizeText;
var gitIn = function (io, folder) { return function (args, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 20000; }
    return io
        .run(__spreadArray(['env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', folder], args, true), timeoutMs)
        .catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); });
}; };
var lastLine = function (out) { var _a, _b; return (_b = (_a = "".concat(out.stderr || out.stdout).trim().split(/[\r\n]/).at(-1)) === null || _a === void 0 ? void 0 : _a.trim().replace(/^(fatal|error): /, '').slice(0, 140)) !== null && _b !== void 0 ? _b : ''; };
// Says clear when the git folder it is handed holds no bisect or rebase under way
exports.MID_WAY = 'for f in BISECT_LOG rebase-merge rebase-apply; do [ -e "$1/$f" ] && exit 0; done; echo clear';
var folderReady = function (io, folder) { return __awaiter(void 0, void 0, void 0, function () {
    var git, _a, _b, gitDir, _c, commonDir, named, branch, _d, upstream_1, _e, clear, isMidWay, isReleased, _f, _g, upstream, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                git = gitIn(io, folder);
                return [4 /*yield*/, git(['rev-parse', '--show-toplevel'])];
            case 1:
                if ((_j.sent()).exitCode !== 0)
                    return [2 /*return*/, { ok: false, what: "Claudopus code that Update can't change", why: "it isn't Claudopus's released code" }];
                return [4 /*yield*/, git(['ls-files', '--error-unmatch', ':/mods/claudopus/.claude-plugin/plugin.json'])];
            case 2:
                if ((_j.sent()).exitCode !== 0)
                    return [2 /*return*/, { ok: false, what: "Claudopus code that Update can't change", why: "it is part of another project's code" }];
                return [4 /*yield*/, git(['rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir'])];
            case 3:
                _a = (_j.sent()).stdout.trim().split('\n'), _b = _a[0], gitDir = _b === void 0 ? '' : _b, _c = _a[1], commonDir = _c === void 0 ? '' : _c;
                named = function (text) { return text.replace(/[^\w./-]/g, '').slice(0, 40); };
                _d = named;
                return [4 /*yield*/, git(['symbolic-ref', '-q', '--short', 'HEAD'])];
            case 4:
                branch = _d.apply(void 0, [(_j.sent()).stdout.trim()]);
                if (gitDir.trim() !== commonDir.trim())
                    return [2 /*return*/, { ok: false, what: 'a copy of Claudopus that a task is changing', why: 'Update leaves it alone. It gets the newest version when that task is merged' }];
                if (!!branch) return [3 /*break*/, 11];
                _e = named;
                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', 'main@{u}'])];
            case 5:
                upstream_1 = _e.apply(void 0, [(_j.sent()).stdout.trim()]);
                return [4 /*yield*/, io.run(['sh', '-c', exports.MID_WAY, 'sh', gitDir.trim()], 20000).catch(function () { return ({ exitCode: 1, stdout: '', stderr: '' }); })];
            case 6:
                clear = _j.sent();
                isMidWay = clear.stdout.trim() !== 'clear';
                _g = !isMidWay &&
                    /^[^/]+\/main$/.test(upstream_1);
                if (!_g) return [3 /*break*/, 8];
                return [4 /*yield*/, git(['merge-base', '--is-ancestor', 'HEAD', upstream_1])];
            case 7:
                _g = (_j.sent()).exitCode === 0;
                _j.label = 8;
            case 8:
                _f = _g;
                if (!_f) return [3 /*break*/, 10];
                return [4 /*yield*/, git(['merge-base', '--is-ancestor', 'refs/heads/main', upstream_1])];
            case 9:
                _f = (_j.sent()).exitCode === 0;
                _j.label = 10;
            case 10:
                isReleased = _f;
                return [2 /*return*/, isReleased ? { ok: true, branch: 'main', upstream: upstream_1, detached: true } : { ok: false, what: 'a test copy of Claudopus', why: 'Update leaves it alone' }];
            case 11:
                _h = named;
                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])];
            case 12:
                upstream = _h.apply(void 0, [(_j.sent()).stdout.trim()]);
                if (branch !== 'main' || !/^[^/]+\/main$/.test(upstream))
                    return [2 /*return*/, { ok: false, what: 'a test copy of Claudopus', why: 'Update leaves it alone' }];
                return [2 /*return*/, { ok: true, branch: branch, upstream: upstream }];
        }
    });
}); };
exports.folderReady = folderReady;
exports.FAILS = {
    page: "Claudopus couldn't read the version page on claudopus.ai",
    unchecked: "the version page doesn't say how to check the download",
    fetch: "the release couldn't be downloaded from GitHub",
    mismatch: "the download didn't match the release, so Claudopus deleted it",
    'own-commits': "your copy of Claudopus has changes this version doesn't have, so Update leaves it alone",
    overwrite: 'your copy of Claudopus has changes in files this version changes. Ask a chat to set them aside, then press Try again',
    moved: "Claudopus couldn't put the new version in place",
    install: "Claude Code couldn't install it",
    'installed-mismatch': "Claude Code's copy didn't match the release, so Claudopus put the old one back",
    'newer-out': 'a newer version came out since this one was downloaded',
    stopped: 'the update stopped when its chat closed or reloaded',
    busy: 'another chat is updating Claudopus right now',
    gone: 'the download is no longer there',
    'kept-copy': "your own changes kept Claude Code's copy on the old version. Ask a chat to set them aside, then press Try again",
};
var stepsOf = function (text) {
    try {
        var v = JSON.parse(text);
        var stages = ['downloading', 'downloaded', 'installing', 'installed', 'failed'];
        if (!(0, exports.isVersion)(v === null || v === void 0 ? void 0 : v.version) || !stages.includes(v.stage) || typeof v.at !== 'number')
            return undefined;
        var commit = typeof v.commit === 'string' && /^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(v.commit) ? v.commit : undefined;
        var fail = typeof v.fail === 'string' && v.fail in exports.FAILS ? v.fail : undefined;
        var num = function (n, most) { return (typeof n === 'number' && Number.isFinite(n) ? Math.max(0, Math.min(most, n)) : undefined); };
        return __assign(__assign(__assign(__assign(__assign(__assign(__assign({ version: v.version, stage: v.stage, at: v.at }, (commit ? { commit: commit } : {})), ((0, exports.isTree)(v.tree) ? { tree: v.tree } : {})), (fail ? { fail: fail } : {})), (v.step === 'download' || v.step === 'install' ? { step: v.step } : {})), (num(v.pct, 100) !== undefined ? { pct: num(v.pct, 100) } : {})), (num(v.got, 1e10) !== undefined ? { got: num(v.got, 1e10) } : {})), ((0, exports.isVersion)(v.from) ? { from: v.from } : {}));
    }
    catch (_a) {
        return undefined;
    }
};
exports.stepsOf = stepsOf;
// A step under way that has said nothing for this long has stopped: its chat closed or reloaded mid-way
exports.STEP_STALE = 90000;
// git's own progress as a download comes: the percent of what it receives and how much so far, then of resolving what came
var fetchProgress = function (said) {
    var _a, _b, _c;
    var lines = said.split(/[\r\n]+/).filter(Boolean);
    for (var _i = 0, _d = lines.reverse(); _i < _d.length; _i++) {
        var line = _d[_i];
        var got = /Receiving objects:\s+(\d{1,3})%[^,]*(?:,\s+([\d.]+)\s+(KiB|MiB|GiB|bytes))?/.exec(line);
        if (got) {
            var n = Number((_a = got[2]) !== null && _a !== void 0 ? _a : 0);
            var unit = (_c = { bytes: 1, KiB: 1024, MiB: Math.pow(1024, 2), GiB: Math.pow(1024, 3) }[((_b = got[3]) !== null && _b !== void 0 ? _b : 'bytes')]) !== null && _c !== void 0 ? _c : 1;
            return { pct: Math.min(100, Number(got[1])), got: Math.round(n * unit), phase: 'receiving' };
        }
        var resolving = /Resolving deltas:\s+(\d{1,3})%/.exec(line);
        if (resolving)
            return { pct: Math.min(100, Number(resolving[1])), got: 0, phase: 'resolving' };
    }
    return undefined;
};
exports.fetchProgress = fetchProgress;
// git's fingerprint of a folder as it is on disk, every file counted, whatever ignore files in it say (a folder that ignores itself
// would otherwise hide what it holds), but for what the engine itself makes in each copy it keeps: its `.in_use` and
// `.orphaned_at` marks and the types it writes in `.claude-plugin/types`. So a copy Claude Code installed is compared with the
// release's `tree` file for file
exports.TREE_OF_FOLDER = 'd=$(mktemp -d) || exit 1; trap \'rm -rf "$d"\' EXIT; git init -q --bare "$d/g" || exit 1; ' +
    'GIT_DIR="$d/g" GIT_INDEX_FILE="$d/i" GIT_WORK_TREE="$1" git -C "$1" -c core.excludesFile=/dev/null add -A -f -- . ":(exclude).in_use" ":(exclude).orphaned_at" ":(exclude).claude-plugin/types" >/dev/null 2>&1 || exit 1; ' +
    'GIT_DIR="$d/g" GIT_INDEX_FILE="$d/i" GIT_WORK_TREE="$1" git -C "$1" write-tree';
var treeOfFolder = function (io, folder) { return __awaiter(void 0, void 0, void 0, function () {
    var out, tree;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, io.run(['sh', '-c', exports.TREE_OF_FOLDER, 'sh', folder], 60000).catch(function () { return ({ exitCode: 1, stdout: '', stderr: '' }); })];
            case 1:
                out = _a.sent();
                tree = out.exitCode === 0 ? out.stdout.trim() : '';
                return [2 /*return*/, (0, exports.isTree)(tree) ? tree : ''];
        }
    });
}); };
exports.treeOfFolder = treeOfFolder;
// The ref a download is kept under in the repo's git, apart from its branches and tags, so nothing the person has is touched
exports.DOWNLOAD_REF = 'refs/claudopus/update';
var download = function (io, src, page, progressFile, onProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var git, tag, fetching, isDone, p, _a, fetched, said, commit, tree, _b, manifest, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                git = gitIn(io, src.repo);
                tag = "v".concat(page.version);
                fetching = io
                    .run(['sh', '-c', '"$@" 2>"$0"', progressFile, 'env', 'GIT_TERMINAL_PROMPT=0', 'GIT_ASKPASS=true', 'GIT_SSH_COMMAND=ssh -o BatchMode=yes', 'git', '-C', src.repo, 'fetch', '--progress', '--no-tags', '--no-write-fetch-head', 'origin', "+refs/tags/".concat(tag, ":").concat(exports.DOWNLOAD_REF)], 600000)
                    .catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); });
                isDone = false;
                void fetching.then(function () { return (isDone = true); });
                _g.label = 1;
            case 1:
                if (!(!isDone && io.wait)) return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.race([fetching, io.wait(700)])];
            case 2:
                _g.sent();
                _a = exports.fetchProgress;
                return [4 /*yield*/, io.read(progressFile).catch(function () { return ''; })];
            case 3:
                p = _a.apply(void 0, [_g.sent()]);
                if (!(p && !isDone)) return [3 /*break*/, 5];
                return [4 /*yield*/, (onProgress === null || onProgress === void 0 ? void 0 : onProgress(p))];
            case 4:
                _g.sent();
                _g.label = 5;
            case 5: return [3 /*break*/, 1];
            case 6: return [4 /*yield*/, fetching];
            case 7:
                fetched = _g.sent();
                return [4 /*yield*/, io.read(progressFile).catch(function () { return ''; })];
            case 8:
                said = _g.sent();
                if (fetched.exitCode !== 0)
                    return [2 /*return*/, { ok: false, fail: 'fetch', detail: lastLine({ stdout: '', stderr: said || fetched.stderr }) }];
                return [4 /*yield*/, (onProgress === null || onProgress === void 0 ? void 0 : onProgress({ pct: 100, got: (_f = (_e = (0, exports.fetchProgress)(said)) === null || _e === void 0 ? void 0 : _e.got) !== null && _f !== void 0 ? _f : 0, phase: 'checking' }))];
            case 9:
                _g.sent();
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', "".concat(exports.DOWNLOAD_REF, "^{commit}")])];
            case 10:
                commit = (_g.sent()).stdout.trim();
                if (!commit) return [3 /*break*/, 12];
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', "".concat(commit, ":").concat(src.sub)])];
            case 11:
                _b = (_g.sent()).stdout.trim();
                return [3 /*break*/, 13];
            case 12:
                _b = '';
                _g.label = 13;
            case 13:
                tree = _b;
                if (!commit) return [3 /*break*/, 15];
                return [4 /*yield*/, git(['show', "".concat(commit, ":").concat(src.sub, "/.claude-plugin/plugin.json")])];
            case 14:
                _c = (_g.sent()).stdout;
                return [3 /*break*/, 16];
            case 15:
                _c = '';
                _g.label = 16;
            case 16:
                manifest = _c;
                if (!(!commit || tree !== page.tree || versionIn(manifest) !== page.version)) return [3 /*break*/, 19];
                return [4 /*yield*/, git(['update-ref', '-d', exports.DOWNLOAD_REF])];
            case 17:
                _g.sent();
                return [4 /*yield*/, io.log("Claudopus ".concat(page.version, " download thrown away: its folder is ").concat(tree || 'missing', ", the release published ").concat(page.tree))];
            case 18:
                _g.sent();
                return [2 /*return*/, { ok: false, fail: 'mismatch', detail: '' }];
            case 19:
                _d = src.kind === 'folder';
                if (!_d) return [3 /*break*/, 21];
                return [4 /*yield*/, git(['merge-base', '--is-ancestor', 'HEAD', commit])];
            case 20:
                _d = (_g.sent()).exitCode !== 0;
                _g.label = 21;
            case 21:
                if (_d)
                    return [2 /*return*/, { ok: false, fail: 'own-commits', detail: '' }];
                return [4 /*yield*/, io.log("Claudopus ".concat(page.version, " downloaded into ").concat(src.repo, " and checked: it is the tree the release published (").concat(page.tree, ")"))];
            case 22:
                _g.sent();
                return [2 /*return*/, { ok: true, commit: commit }];
        }
    });
}); };
exports.download = download;
var install = function (io, src, page, commit, engine) { return __awaiter(void 0, void 0, void 0, function () {
    var git, held, tree, tagged, tagCommit, record, viaClaudeCode, online, failed, ready, main, _a, _b, _c, merged, said_1, moved, back, _d, status, dirty, failed;
    var _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                git = gitIn(io, src.repo);
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', "".concat(exports.DOWNLOAD_REF, "^{commit}")])];
            case 1:
                held = (_j.sent()).stdout.trim();
                if (!held || held !== commit)
                    return [2 /*return*/, { ok: false, fail: 'gone', detail: '' }];
                return [4 /*yield*/, git(['rev-parse', '--verify', '-q', "".concat(commit, ":").concat(src.sub)])];
            case 2:
                tree = (_j.sent()).stdout.trim();
                if (!tree)
                    return [2 /*return*/, { ok: false, fail: 'gone', detail: '' }];
                if (tree !== page.tree)
                    return [2 /*return*/, { ok: false, fail: 'mismatch', detail: '' }];
                return [4 /*yield*/, git(['ls-remote', 'origin', "refs/tags/v".concat(page.version, "^{}"), "refs/tags/v".concat(page.version)], 60000)];
            case 3:
                tagged = (_j.sent()).stdout;
                tagCommit = (_g = ((_f = (_e = tagged.split('\n').find(function (one) { return one.endsWith('^{}'); })) !== null && _e !== void 0 ? _e : tagged.split('\n')[0]) !== null && _f !== void 0 ? _f : '').split(/\s/)[0]) !== null && _g !== void 0 ? _g : '';
                if (!tagCommit)
                    return [2 /*return*/, { ok: false, fail: 'fetch', detail: 'GitHub did not answer' }];
                if (tagCommit !== commit)
                    return [2 /*return*/, { ok: false, fail: 'mismatch', detail: '' }];
                record = src.kind === 'clone' ? src : src.record;
                viaClaudeCode = function (rec) { return __awaiter(void 0, void 0, void 0, function () {
                    var path, before, id, _i, _a, step, out, text, copy, installPath, got, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                path = "".concat(rec.plugins, "/installed_plugins.json");
                                return [4 /*yield*/, io.read(path).catch(function () { return ''; })];
                            case 1:
                                before = _c.sent();
                                id = "".concat(rec.plugin, "@").concat(rec.marketplace);
                                _i = 0, _a = (0, exports.updateSteps)(engine, rec, rec.scope);
                                _c.label = 2;
                            case 2:
                                if (!(_i < _a.length)) return [3 /*break*/, 5];
                                step = _a[_i];
                                return [4 /*yield*/, io.run(step, 300000).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); })];
                            case 3:
                                out = _c.sent();
                                if (out.exitCode !== 0)
                                    return [2 /*return*/, { ok: false, fail: 'install', detail: lastLine(out) }];
                                _c.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5: return [4 /*yield*/, io.read(path).catch(function () { return ''; })];
                            case 6:
                                text = _c.sent();
                                copy = (function () {
                                    var _a, _b, _c;
                                    try {
                                        var entries = ((_c = (_b = (_a = JSON.parse(text)) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b[id]) !== null && _c !== void 0 ? _c : []);
                                        return entries.find(function (one) { var _a, _b; return ((_a = one === null || one === void 0 ? void 0 : one.scope) !== null && _a !== void 0 ? _a : 'user') === ((_b = rec.scope) !== null && _b !== void 0 ? _b : 'user'); });
                                    }
                                    catch (_d) {
                                        return undefined;
                                    }
                                })();
                                installPath = typeof (copy === null || copy === void 0 ? void 0 : copy.installPath) === 'string' && copy.version === page.version ? copy.installPath : '';
                                if (!installPath) return [3 /*break*/, 8];
                                return [4 /*yield*/, (0, exports.treeOfFolder)(io, installPath)];
                            case 7:
                                _b = _c.sent();
                                return [3 /*break*/, 9];
                            case 8:
                                _b = '';
                                _c.label = 9;
                            case 9:
                                got = _b;
                                if (got === page.tree)
                                    return [2 /*return*/, undefined];
                                if (!before) return [3 /*break*/, 11];
                                return [4 /*yield*/, io.write(path, before)];
                            case 10:
                                _c.sent();
                                _c.label = 11;
                            case 11: return [4 /*yield*/, io.log("Claudopus ".concat(page.version, ": the copy Claude Code installed (").concat(installPath || 'none', ") is ").concat(got || 'unreadable', ", not the release's ").concat(page.tree, "; its record was put back"))];
                            case 12:
                                _c.sent();
                                return [2 /*return*/, { ok: false, fail: 'installed-mismatch', detail: '' }];
                        }
                    });
                }); };
                if (!(src.kind === 'clone')) return [3 /*break*/, 6];
                return [4 /*yield*/, git(['ls-remote', 'origin', 'HEAD'], 60000)];
            case 4:
                online = (_h = (_j.sent()).stdout.trim().split(/\s/)[0]) !== null && _h !== void 0 ? _h : '';
                if (!online)
                    return [2 /*return*/, { ok: false, fail: 'fetch', detail: 'GitHub did not answer' }];
                if (online !== commit)
                    return [2 /*return*/, { ok: false, fail: 'newer-out', detail: '' }];
                return [4 /*yield*/, viaClaudeCode(src)];
            case 5:
                failed = _j.sent();
                return [2 /*return*/, failed !== null && failed !== void 0 ? failed : { ok: true, version: page.version, dirty: false }];
            case 6: return [4 /*yield*/, (0, exports.folderReady)(io, src.repo)];
            case 7:
                ready = _j.sent();
                if (!ready.ok)
                    return [2 /*return*/, { ok: false, fail: 'moved', detail: ready.why }];
                return [4 /*yield*/, git(['merge-base', '--is-ancestor', 'HEAD', commit])];
            case 8:
                if ((_j.sent()).exitCode !== 0)
                    return [2 /*return*/, { ok: false, fail: 'own-commits', detail: '' }
                        // Left on a released commit: main must reach the release by a fast-forward too, and is moved there only from the very commit read
                    ];
                if (!ready.detached) return [3 /*break*/, 10];
                return [4 /*yield*/, git(['rev-parse', '-q', '--verify', 'refs/heads/main'])];
            case 9:
                _a = (_j.sent()).stdout.trim();
                return [3 /*break*/, 11];
            case 10:
                _a = '';
                _j.label = 11;
            case 11:
                main = _a;
                _b = ready.detached;
                if (!_b) return [3 /*break*/, 14];
                _c = !main;
                if (_c) return [3 /*break*/, 13];
                return [4 /*yield*/, git(['merge-base', '--is-ancestor', main, commit])];
            case 12:
                _c = (_j.sent()).exitCode !== 0;
                _j.label = 13;
            case 13:
                _b = (_c);
                _j.label = 14;
            case 14:
                if (_b)
                    return [2 /*return*/, { ok: false, fail: 'own-commits', detail: '' }];
                return [4 /*yield*/, git(['merge', '--ff-only', '--quiet', commit], 120000)];
            case 15:
                merged = _j.sent();
                if (merged.exitCode !== 0) {
                    said_1 = "".concat(merged.stderr, "\n").concat(merged.stdout);
                    return [2 /*return*/, /would be overwritten/.test(said_1) ? { ok: false, fail: 'overwrite', detail: '' } : { ok: false, fail: 'moved', detail: lastLine(merged) }];
                }
                if (!ready.detached) return [3 /*break*/, 20];
                return [4 /*yield*/, git(['update-ref', '-m', "Claudopus ".concat(page.version), 'refs/heads/main', commit, main])];
            case 16:
                moved = _j.sent();
                if (!(moved.exitCode === 0)) return [3 /*break*/, 18];
                return [4 /*yield*/, git(['symbolic-ref', 'HEAD', 'refs/heads/main'])];
            case 17:
                _d = _j.sent();
                return [3 /*break*/, 19];
            case 18:
                _d = moved;
                _j.label = 19;
            case 19:
                back = _d;
                if (back.exitCode !== 0)
                    return [2 /*return*/, { ok: false, fail: 'moved', detail: lastLine(back) }];
                _j.label = 20;
            case 20: return [4 /*yield*/, git(['status', '--porcelain', '--untracked-files=no', '--', src.sub])];
            case 21:
                status = _j.sent();
                dirty = status.exitCode !== 0 || Boolean(status.stdout.trim());
                if (!(src.runs === 'copy' && dirty)) return [3 /*break*/, 23];
                return [4 /*yield*/, io.log("Claudopus updated to ".concat(page.version, ", but changes of your own kept Claude Code's copy as it was"))];
            case 22:
                _j.sent();
                return [2 /*return*/, { ok: false, fail: 'kept-copy', detail: '' }];
            case 23: return [4 /*yield*/, io.log("Claudopus updated to ".concat(page.version).concat(dirty ? ', with changes of your own kept' : ''))
                // Claude Code's record of the folder follows it, only from a folder with nothing uncommitted, as it copies the folder as it is
            ];
            case 24:
                _j.sent();
                if (!(src.record && !dirty)) return [3 /*break*/, 26];
                return [4 /*yield*/, viaClaudeCode(src.record)];
            case 25:
                failed = _j.sent();
                if (failed)
                    return [2 /*return*/, failed];
                _j.label = 26;
            case 26: return [2 /*return*/, { ok: true, version: page.version, dirty: dirty }];
        }
    });
}); };
exports.install = install;
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
var noticeOf = function (at) {
    var _a, _b, _c;
    var loaded = at.loaded, installed = at.installed, steps = at.steps, now = at.now;
    if (!(0, exports.isVersion)(loaded))
        return undefined;
    var isPut = function (version) { return Boolean(at.later && at.later.version === version && now < at.later.until); };
    // The Mac has a newer copy than this chat runs: what is left is this chat's reload
    if ((0, exports.isVersion)(installed) && (0, exports.isNewer)(installed, loaded))
        return isPut(installed) ? undefined : { kind: 'reload', version: installed };
    var out = (_b = [at.seen, (_a = at.page) === null || _a === void 0 ? void 0 : _a.version].filter(exports.isVersion).sort(function (a, b) { return ((0, exports.isNewer)(a, b) ? -1 : 1); })[0]) !== null && _b !== void 0 ? _b : '';
    var isOut = function (version) { return (0, exports.isNewer)(version, loaded) && !((0, exports.isVersion)(at.skipped) && !(0, exports.isNewer)(version, at.skipped)) && !isPut(version); };
    // A step on this Mac, for a version still newer than this chat's and no older than the newest out
    if (steps && (0, exports.isNewer)(steps.version, loaded) && !(out && (0, exports.isNewer)(out, steps.version))) {
        var isLive = now - steps.at < exports.STEP_STALE && now >= steps.at;
        if (steps.stage === 'downloading' || steps.stage === 'installing')
            return isLive
                ? steps.stage === 'downloading'
                    ? { kind: 'downloading', version: steps.version, pct: steps.pct, got: steps.got }
                    : { kind: 'installing', version: steps.version }
                : isPut(steps.version) ? undefined : { kind: 'failed', version: steps.version, fail: 'stopped', step: steps.stage === 'downloading' ? 'download' : 'install' };
        if (isPut(steps.version))
            return undefined;
        if (steps.stage === 'downloaded' && steps.commit)
            return { kind: 'downloaded', version: steps.version, commit: steps.commit };
        if (steps.stage === 'failed' && steps.fail)
            return { kind: 'failed', version: steps.version, fail: steps.fail, step: (_c = steps.step) !== null && _c !== void 0 ? _c : 'download' };
    }
    if (!out || !isOut(out))
        return undefined;
    if (at.cannot)
        return __assign({ kind: 'cannot', version: out }, at.cannot);
    var count = at.page && at.page.version === out ? (0, exports.missedOn)(at.page, loaded).length : 1;
    return { kind: 'available', version: out, count: Math.max(1, count) };
};
exports.noticeOf = noticeOf;
// How often the look may run, as Config offers it, in hours; anything else is the hour as shipped
exports.LOOK_EVERY_HOURS = [1, 6, 24, 168];
var lookEveryOf = function (hours) { return (exports.LOOK_EVERY_HOURS.includes(Number(hours)) ? Number(hours) : 1) * 3600000; };
exports.lookEveryOf = lookEveryOf;
// Whether a look is due: none yet, or the last one is older than `every` (a clock moved back counts as due)
var isUpdateDue = function (stamp, now, every) {
    if (every === void 0) { every = exports.UPDATE_EVERY; }
    return !stamp || now - stamp.at >= every || now < stamp.at;
};
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
