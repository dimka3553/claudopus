"use strict";
// ---- The same results on every Mac: a Mac that reaches another over ssh (config.json `macs`) brings over the results that Mac has
// and this one lacks, hands it those this one has and it lacks, and carries what the person did to a result both have (put away,
// brought back, answered) both ways. A result is never rewritten, deleted or kept twice: only what is missing is copied, by its
// folder's name, and only the marks beside it change. Paths inside it name that Mac's home, so they are moved onto the other's ----
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.markThere = exports.broughtBackBy = exports.PUSH_THERE = exports.PLACE = exports.PUSH = exports.pullThere = exports.PULL = exports.parsedMeta = exports.merged = exports.marksOf = exports.rehome = exports.resultsOf = exports.RESULTS_LOOK = exports.isHome = exports.isResultId = exports.RESULTS_A_TRIP = exports.RESULTS_EVERY = void 0;
// How often, at most, by whichever chat on this Mac comes first
exports.RESULTS_EVERY = 120000;
// The most results one trip brings over each way, so a long gap is closed over a few trips
exports.RESULTS_A_TRIP = 30;
// A folder under reports/ another Mac may be asked for or handed: no slash, no dot first, nothing the shell reads
var isResultId = function (one) { return typeof one === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/.test(one); };
exports.isResultId = isResultId;
// A home a Mac names: /Users/<name>, or another plain absolute path
var isHome = function (one) { return /^\/[A-Za-z0-9._/-]{1,200}$/.test(one) && !one.endsWith('/') && !one.includes('..'); };
exports.isHome = isHome;
var RESULT_MARK = '---claudopus-result---';
// What one look there answers: its home, then each result as its folder's name, its meta.json's checksum and its meta.json on one line
exports.RESULTS_LOOK = "sh -c 'echo $HOME; R=$HOME/.claude/claudopus/reports; [ -d \"$R\" ] || exit 0; cd \"$R\" && for d in *; do [ -f \"$d/meta.json\" ] || continue; echo ".concat(RESULT_MARK, "; echo \"$d\"; cksum < \"$d/meta.json\"; tr -d \"\\n\" < \"$d/meta.json\"; echo; done'");
var resultsOf = function (out) {
    var _a, _b;
    var _c = out.split("".concat(RESULT_MARK, "\n")), _d = _c[0], head = _d === void 0 ? '' : _d, parts = _c.slice(1);
    // Its home is the last line before the first result, past any login banner
    var home = (_b = (_a = head.trim().split('\n').pop()) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
    if (!(0, exports.isHome)(home))
        return undefined;
    var results = new Map();
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        var _e = part.split('\n'), _f = _e[0], id = _f === void 0 ? '' : _f, _g = _e[1], sum = _g === void 0 ? '' : _g, _h = _e[2], text = _h === void 0 ? '' : _h;
        if ((0, exports.isResultId)(id) && /^\d+ \d+$/.test(sum.trim()) && text.trim().startsWith('{'))
            results.set(id, { sum: sum.trim(), text: text });
    }
    return { home: home, results: results };
};
exports.resultsOf = resultsOf;
// A path under one home, moved onto the other: only that home whole, never a longer name it begins (/Users/dima in /Users/dimas)
var escaped = function (text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
var rehome = function (text, from, to) { return (from === to ? text : text.replace(new RegExp("".concat(escaped(from), "(?![A-Za-z0-9_-]|\\.[A-Za-z0-9_-])"), 'g'), function () { return to; })); };
exports.rehome = rehome;
var at = function (one) { return (typeof one === 'number' && Number.isFinite(one) && one > 0 ? one : 0); };
var waitsIn = function (one) { return (Array.isArray(one) ? one.filter(function (w) { return Boolean(w) && typeof w.text === 'string'; }) : undefined); };
// One answer for one thing it waits on: a Yes or No over a Not now, else the first
var answerOf = function (a, b) { return (!a ? b : !b ? a : a === 'Not now' && b !== 'Not now' ? b : a); };
// The marks of both, together: put away or not by whichever came last, put away or brought back; an answer given on either Mac kept
var marksOf = function (mine, theirs) {
    var archived = Math.max(at(mine.archived), at(theirs.archived));
    var back = Math.max(at(mine.broughtBack), at(theirs.broughtBack));
    var _a = [waitsIn(mine.waiting), waitsIn(theirs.waiting)], a = _a[0], b = _a[1];
    // Each thing it waits on is matched by its text; one only one side has is kept as that side has it
    var waiting = (a === null || a === void 0 ? void 0 : a.length) && (b === null || b === void 0 ? void 0 : b.length)
        ? a.map(function (one) {
            var _a;
            var answer = answerOf(one.answer, (_a = b.find(function (other) { return other.text === one.text; })) === null || _a === void 0 ? void 0 : _a.answer);
            return answer ? __assign(__assign({}, one), { answer: answer }) : one;
        })
        : (a === null || a === void 0 ? void 0 : a.length) ? a : (b !== null && b !== void 0 ? b : a);
    var answer = answerOf(typeof mine.answer === 'string' ? mine.answer : undefined, typeof theirs.answer === 'string' ? theirs.answer : undefined);
    return { archived: archived > back ? archived : undefined, broughtBack: back || undefined, waiting: waiting, answer: answer };
};
exports.marksOf = marksOf;
// A meta.json with the marks of both, as it is written: undefined when it would not change
// (with what its archive was when last made the same, so a bring back by an older version on either side counts as one)
var merged = function (text, theirs, wasArchived) {
    if (wasArchived === void 0) { wasArchived = 0; }
    try {
        var mine = JSON.parse(text);
        var marks = (0, exports.marksOf)((0, exports.broughtBackBy)(mine, wasArchived), (0, exports.broughtBackBy)(theirs, wasArchived));
        var next = __assign({}, mine);
        for (var _i = 0, _a = Object.entries(marks); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === undefined)
                delete next[key];
            else
                next[key] = value;
        }
        var same = function (one) { return JSON.stringify(['archived', 'broughtBack', 'waiting', 'answer'].map(function (key) { var _a; return (_a = one[key]) !== null && _a !== void 0 ? _a : null; })); };
        return same(next) === same(mine) ? undefined : "".concat(JSON.stringify(next, null, 2), "\n");
    }
    catch (_c) {
        return undefined;
    }
};
exports.merged = merged;
var parsedMeta = function (text) {
    try {
        var one = JSON.parse(text);
        return one && typeof one === 'object' ? one : {};
    }
    catch (_a) {
        return {};
    }
};
exports.parsedMeta = parsedMeta;
// Run here by bash, with a folder here, the Mac and the command there: brings results from there into the folder as one tar stream,
// or hands that Mac the results in the folder here. Either fails when ssh or tar on either end does, so a stream cut short is
// never taken as whole
exports.PULL = 'set -o pipefail; S=$1; M=$2; C=$3; ssh -o BatchMode=yes -o ConnectTimeout=5 -- "$M" "$C" | tar xf - -C "$S"';
// It ends with an empty _end, kept in _sync there; no -- before the names, which isResultId keeps from starting with a dash
var pullThere = function (ids) { return "cd ~/.claude/claudopus/reports && mkdir -p _sync && : > _sync/_end && COPYFILE_DISABLE=1 tar cf - ".concat(ids.filter(exports.isResultId).join(' '), " -C _sync _end"); };
exports.pullThere = pullThere;
// The stream ends with an empty _end, so the other end knows it got all of it even where a cut falls between two files
exports.PUSH = 'set -o pipefail; S=$1; M=$2; C=$3; shift 3; cd "$S" && : > _end && COPYFILE_DISABLE=1 tar cf - -- "$@" _end | ssh -o BatchMode=yes -o ConnectTimeout=5 -- "$M" "$C"';
// A folder goes in place only when no folder has its name, under a claim only one chat can take at a time (mkdir), so two chats
// never put one inside the other: run by sh with the folder, where it goes and the claim
exports.PLACE = 'mkdir "$3" 2>/dev/null || exit 4; if [ -e "$2" ]; then s=6; else mv "$1" "$2"; s=$?; fi; rmdir "$3"; exit $s';
// There, the same for each folder handed over with its meta.json, once the whole stream is in, _end and all; what was handed and not put
// in place goes with its own folder, and what a cut-off sync left there over an hour ago goes first, as here
exports.PUSH_THERE = "sh -c 'R=$HOME/.claude/claudopus/reports; mkdir -p \"$R/_sync\" && find \"$R/_sync\" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; T=$R/_sync/in.$$; mkdir -p \"$T\" && tar xf - -C \"$T\" && [ -f \"$T/_end\" ] || { rm -rf \"$T\"; exit 5; }; rm -f \"$T/_end\"; for d in \"$T\"/*; do [ -f \"$d/meta.json\" ] || continue; n=$(basename \"$d\"); C=$R/_sync/claim-$n; mkdir \"$C\" 2>/dev/null || continue; [ -e \"$R/$n\" ] || mv \"$d\" \"$R/$n\"; rmdir \"$C\"; done; rm -rf \"$T\"'";
// What a result's archive was on both Macs when last made the same, and what a side now says: a side that had it put away then and
// has it no longer, with no bring back as late, was brought back there by a version that keeps no time for it: just after that archive,
// so a later put away on the other Mac still wins
var broughtBackBy = function (one, wasArchived) {
    return wasArchived && !at(one.archived) && at(one.broughtBack) < wasArchived ? __assign(__assign({}, one), { broughtBack: wasArchived + 1 }) : one;
};
exports.broughtBackBy = broughtBackBy;
// Writes a result's marks there only when its meta.json is still what was read, so a press there since is never undone
var markThere = function (id, sum) {
    return "sh -c 'f=$HOME/.claude/claudopus/reports/".concat(id, "/meta.json; [ \"$(cksum < \"$f\")\" = \"").concat(sum, "\" ] || exit 3; cat > \"$f.part\" && mv -f \"$f.part\" \"$f\"'");
};
exports.markThere = markThere;
