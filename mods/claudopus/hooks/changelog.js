"use strict";
// The changelog, CHANGELOG.md beside the mod: what changed for the person in each version, newest first. The About tab opens it
// whole, and the update screen shows the versions a person did not have yet. The site's changelog page is made from the same file
Object.defineProperty(exports, "__esModule", { value: true });
exports.previousOf = exports.isScreenDue = exports.seenIn = exports.missedOf = exports.fitted = exports.TAB_BUDGET = exports.SCREEN_BUDGET = exports.changelogOf = void 0;
// Its versions, newest first as written: a heading "## x.y.z · date" each, then its changes, a "- " line each
var changelogOf = function (text) {
    var _a;
    var versions = [];
    for (var _i = 0, _b = text.split('\n'); _i < _b.length; _i++) {
        var line = _b[_i];
        var head = /^## (\d+\.\d+\.\d+)(?:\s+·\s+(.+))?\s*$/.exec(line);
        if (head)
            versions.push({ version: head[1], date: ((_a = head[2]) !== null && _a !== void 0 ? _a : '').trim(), changes: [] });
        else if (versions.length && /^- \S/.test(line))
            versions[versions.length - 1].changes.push(line.slice(2).trim());
    }
    return versions;
};
exports.changelogOf = changelogOf;
// Whether version a is newer than b, by its dotted numbers
var newer = function (a, b) {
    var _a, _b, _c, _d;
    var pa = a.split('.').map(function (n) { return parseInt(n, 10) || 0; });
    var pb = b.split('.').map(function (n) { return parseInt(n, 10) || 0; });
    for (var i = 0; i < Math.max(pa.length, pb.length); i++)
        if (((_a = pa[i]) !== null && _a !== void 0 ? _a : 0) !== ((_b = pb[i]) !== null && _b !== void 0 ? _b : 0))
            return ((_c = pa[i]) !== null && _c !== void 0 ? _c : 0) > ((_d = pb[i]) !== null && _d !== void 0 ? _d : 0);
    return false;
};
// The app draws no tab holding more than about 262,000 characters, every element counted with its text. What one version costs
// there: its words, and a share for each element that holds them
var ELEMENT = 220;
var costOf = function (v) { return v.version.length + v.date.length + 4 * ELEMENT + v.changes.reduce(function (n, one) { return n + one.length + 2 * ELEMENT; }, 0); };
// What a tab of versions may hold, well under the app's limit: the update screen and the changelog tab
exports.SCREEN_BUDGET = 60000;
exports.TAB_BUDGET = 150000;
// The versions newest first that fit `budget`, always the newest one; and how many older ones were left out
var fitted = function (versions, budget) {
    var shown = [];
    var used = 0;
    for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
        var v = versions_1[_i];
        used += costOf(v);
        if (shown.length && used > budget)
            break;
        shown.push(v);
    }
    return { shown: shown, left: versions.length - shown.length };
};
exports.fitted = fitted;
// What the update screen shows for a move from `from` to `to`: every version after `from` up to `to`, newest first, as many as
// fit, and how many older ones it leaves to the changelog
var missedOf = function (versions, from, to, budget) {
    if (budget === void 0) { budget = exports.SCREEN_BUDGET; }
    return (0, exports.fitted)(versions.filter(function (v) { return newer(v.version, from) && !newer(v.version, to); }), budget);
};
exports.missedOf = missedOf;
// The record of the newest version whose changes the person has seen on this Mac, seen.json: dismissing the screen writes it
var seenIn = function (text) {
    var _a;
    try {
        var v = (_a = JSON.parse(text)) === null || _a === void 0 ? void 0 : _a.version;
        return typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v) ? v : '';
    }
    catch (_b) {
        return '';
    }
};
exports.seenIn = seenIn;
// Whether the update screen shows in a chat running `loaded`: a version newer than the one whose changes were seen last
var isScreenDue = function (loaded, seen) { return Boolean(loaded && seen && newer(loaded, seen)); };
exports.isScreenDue = isScreenDue;
// The version a Mac ran before `loaded`: the newest of the mod's other installed copies (Claude Code keeps each version's folder)
// older than it; nothing on a first install
var previousOf = function (names, loaded) {
    return names.filter(function (name) { return /^\d+\.\d+\.\d+$/.test(name) && newer(loaded, name); }).reduce(function (best, name) { return (!best || newer(name, best) ? name : best); }, '');
};
exports.previousOf = previousOf;
