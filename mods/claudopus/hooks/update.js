"use strict";
// Claudopus keeps itself up to date: Claude Code leaves a marketplace that is not Anthropic's alone unless each person turns its
// auto-update on, and the desktop app runs its engine with DISABLE_AUTOUPDATER=1, which turns that pass off anyway. So every few
// hours one chat on the Mac asks Claude Code itself to refresh this mod's marketplace and update the mod, the two steps a person
// would type. It runs those steps only when the version page on claudopus.ai names a version other than the one installed, so a
// look is one small fetch, with no model or agent in it. Chats that start after an update load the new version; chats already open
// keep the one they loaded.
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
exports.stampOf = exports.isNewer = exports.isUpdateDue = exports.updatedTo = exports.updateSteps = exports.updatedLook = exports.updatedFrom = exports.UPDATED_LATE = exports.UPDATED_STEP = exports.UPDATED_FOR = exports.isReloadDue = exports.RELOAD_AGAIN = exports.RELOAD_EVERY = exports.copyOf = exports.installedVersionOf = exports.versionOnPage = exports.scopeOf = exports.installedFrom = exports.UPDATE_AFTER = exports.UPDATE_LOOK = exports.UPDATE_EVERY = exports.VERSION_WAIT = exports.VERSION_PAGE = void 0;
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
// The moment a chat moves to a newer version: the header's version rolls to the new number and says "Updated" in blue for
// UPDATED_FOR, drawn again each UPDATED_STEP, then settles to the plain number. A panel first drawn later than UPDATED_LATE after
// the load shows nothing of it
exports.UPDATED_FOR = 8000;
exports.UPDATED_STEP = 150;
exports.UPDATED_LATE = 10 * 60 * 1000;
var UPDATED_ROLL = 1500;
var UPDATED_SETTLE = 7000;
var UPDATED_WORD = 'Updated';
// The version this chat ran before this load, when the load moved it to a newer one: the version the chat last loaded (kept
// through a reload), else, for a chat whose last copy kept none, the reload it asked for (reloads/<chat>.json) to this very
// version, if recent
var updatedFrom = function (loaded, ran, mark, now) {
    var asked = (mark === null || mark === void 0 ? void 0 : mark.version) === loaded && typeof mark.from === 'string' && typeof mark.at === 'number' && now >= mark.at && now - mark.at < exports.UPDATED_LATE ? mark.from : '';
    var before = ran || asked;
    return loaded && before && (0, exports.isNewer)(loaded, before) ? before : '';
};
exports.updatedFrom = updatedFrom;
var updatedLook = function (from, to, t) {
    if (!(t >= 0 && t < exports.UPDATED_FOR) || !to)
        return undefined;
    var target = "v".concat(to);
    if (t < UPDATED_ROLL) {
        var old = "v".concat(from);
        var same = 0;
        while (same < target.length && target[same] === old[same])
            same += 1;
        var changing = __spreadArray([], target.slice(same), true);
        var landed_1 = Math.floor((t / UPDATED_ROLL) * (changing.length + 1));
        var frame_1 = Math.floor(t / exports.UPDATED_STEP);
        var rolled = changing.map(function (ch, i) { return (i < landed_1 || !/\d/.test(ch) ? ch : String((Number(ch) + frame_1 + i * 3 + 1) % 10)); }).join('');
        return __spreadArray(__spreadArray([], (same ? [{ text: target.slice(0, same), tone: 'dim' }] : []), true), [{ text: rolled, tone: 'blue' }], false);
    }
    if (t >= UPDATED_SETTLE)
        return [{ text: "".concat(target, " \u00B7 ").concat(UPDATED_WORD), tone: 'dim' }];
    // The glint crosses the word, rests a little, and crosses again
    var at = Math.floor((t - UPDATED_ROLL) / exports.UPDATED_STEP) % (UPDATED_WORD.length + 5);
    var word = at < UPDATED_WORD.length
        ? [
            { text: UPDATED_WORD.slice(0, at), tone: 'blue' },
            { text: UPDATED_WORD.charAt(at), tone: 'glint' },
            { text: UPDATED_WORD.slice(at + 1), tone: 'blue' },
        ]
        : [{ text: UPDATED_WORD, tone: 'blue' }];
    var pieces = __spreadArray([{ text: target, tone: 'blue' }, { text: ' · ', tone: 'dim' }], word, true);
    return pieces.filter(function (piece) { return piece.text; });
};
exports.updatedLook = updatedLook;
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
