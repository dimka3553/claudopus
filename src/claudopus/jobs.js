// What each piece of work has running: the commands, watches and servers it sent to the background, as Claude Code tracks them,
// each a row on its card's tree with what kind it is, what it is in its own words, how long it has run and how far it is
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
var jobLog = new Map();
// When each card was last told that one of its jobs wrote something new
var jobNews = new Map();
var jobsLookedAt = 0;
// How long past its time limit a watch is still waited for to say it ended, before it counts as ended anyway
var WATCH_GRACE = 2 * 60000;
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
var tasksDir = '';
var tasksOf = '';
var tasksMissedAt = 0;
// The file each row's output was last read from, by its id, so a press on the row can show it whole
var jobFiles = new Map();
// A job as its row shows it, from its command and words: a watch is what waits for something far away and ends when it is there
// (with its title and kind in plain words where the small model gave them, and what it does now)
var jobOf = function (id, what, cmd, at, isWatch, theirs, named) {
    var _a, _b, _c;
    if (isWatch === void 0) { isWatch = false; }
    var seen = (_a = jobLog.get(id)) !== null && _a !== void 0 ? _a : theirs;
    var said = describedOf(what);
    // (one the small model says is a cloud job runs on another computer, whatever its line looks like)
    var told = isWatch ? 'watch' : jobKindOf(cmd, what);
    var kind = told === 'script' && (named === null || named === void 0 ? void 0 : named.kind) === 'cloud job' ? 'remote' : told;
    var label = labelOf(said.text || cmd, cmd);
    var now = (_b = namedNow.get(id)) !== null && _b !== void 0 ? _b : theirs === null || theirs === void 0 ? void 0 : theirs.now;
    return __assign(__assign(__assign(__assign({ id: id, label: label, isNamed: Boolean(what) && label !== labelOf('', cmd), cmd: cmd, kind: kind, at: at }, (seen !== null && seen !== void 0 ? seen : {})), { port: (_c = portOf(cmd)) !== null && _c !== void 0 ? _c : seen === null || seen === void 0 ? void 0 : seen.port }), ((named === null || named === void 0 ? void 0 : named.title) ? __assign({ title: named.title }, (named.kind ? { namedKind: named.kind } : {})) : {})), (now ? { now: now } : {}));
};
// The rows a card has: what it sent to the background and Claude Code still tracks, and nothing else; jobs alike are one
var jobsOf = function (one) { var _a; return foldJobs(((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { var _a, _b; return jobOf(b.id, b.what, (_a = b.cmd) !== null && _a !== void 0 ? _a : b.what, b.at, b.isWatch, (_b = one.seenJobs) === null || _b === void 0 ? void 0 : _b[b.id], b.named); })); };
// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for
var jobHead = function (job) {
    if (job.id.startsWith('more-'))
        return job.label;
    var many = job.count && job.count > 1 ? " \u00D7".concat(job.count) : '';
    // Named by the small model: its kind in its words, then its title
    if (job.title)
        return "".concat(namedHead({ title: job.title, kind: job.namedKind })).concat(job.kind === 'server' && job.port && !job.title.includes(job.port) ? " :".concat(job.port) : '').concat(many);
    var kind = "".concat(JOB_HEAD[job.kind]).concat(job.kind === 'server' && job.port ? " :".concat(job.port) : '').concat(many);
    // Its own words alone when they say its kind already (Download the CT scans, Watch the cloud jobs)
    // (only when they say the kind it is: a watch named Check that… still leads with Watch)
    var said = describedOf(job.label).kind;
    if (job.isNamed && isKindSaid(job.label) && (said === job.kind || (said === 'script' && job.kind === 'remote')))
        return "".concat(job.label).concat(job.kind === 'server' && job.port && !job.label.includes(job.port) ? " :".concat(job.port) : '').concat(many);
    return "".concat(kind, " \u00B7 ").concat(job.label);
};
// Where this chat's background output is written: the engine's tasks folder under its own temporary folder, named by the chat
var findTasks = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var sid, r;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 1:
                sid = _b.sent();
                if (!sid)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, $.process
                        .run(['sh', '-c', 'for d in /private/tmp/claude-*/*/"$1"/tasks /tmp/claude-*/*/"$1"/tasks "${TMPDIR%/}"/claude-*/*/"$1"/tasks; do [ -d "$d" ] && { echo "$d"; exit 0; }; done; exit 1', 'sh', sid], { timeoutMs: 5000 })
                        .catch(function () { return undefined; })];
            case 2:
                r = _b.sent();
                return [2 /*return*/, (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? (_a = r.stdout.trim().split('\n')[0]) !== null && _a !== void 0 ? _a : '' : ''];
        }
    });
}); };
// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news
var lookJobs = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, owned, _loop_1, _i, _a, id, _loop_2, _b, _c, owner, sid, asked, files, ended, endedAs, texts, _d, list_1, one, _e, _f, b, isChanged, moved, mtime, script, r, parts, _loop_3, n, quiet, _g, asked_1, o, r, _loop_4, _h, _j, m, _k, ended_1, id, _l, _m, _o, moved_1, owner;
    var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _3.sent();
                if (now - jobsLookedAt < JOB_LOOK)
                    return [2 /*return*/];
                jobsLookedAt = now;
                return [4 /*yield*/, read($, todos)
                    // A watch's output is its events, read as any other
                ];
            case 2:
                list = _3.sent();
                owned = list.flatMap(function (one) { var _a; return (one.chat ? [] : ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { return ({ owner: one.id, id: b.id }); })); });
                _loop_1 = function (id) {
                    if (!owned.some(function (o) { return o.id === id; }))
                        jobLog.delete(id);
                };
                for (_i = 0, _a = jobLog.keys(); _i < _a.length; _i++) {
                    id = _a[_i];
                    _loop_1(id);
                }
                _loop_2 = function (owner) {
                    if (!owned.some(function (o) { return o.owner === owner; }))
                        jobNews.delete(owner);
                };
                for (_b = 0, _c = jobNews.keys(); _b < _c.length; _b++) {
                    owner = _c[_b];
                    _loop_2(owner);
                }
                if (!owned.length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 3:
                sid = _3.sent();
                if (sid !== tasksOf)
                    ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0));
                if (!(!tasksDir && now - tasksMissedAt >= JOB_NEWS)) return [3 /*break*/, 5];
                return [4 /*yield*/, findTasks($)];
            case 4:
                tasksDir = _3.sent();
                if (!tasksDir)
                    tasksMissedAt = now;
                _3.label = 5;
            case 5:
                asked = tasksDir ? owned : [];
                files = asked.map(function (o) { return "".concat(tasksDir, "/").concat(o.id, ".output"); });
                jobFiles.clear();
                asked.forEach(function (o, n) { var _a; return jobFiles.set(o.id, (_a = files[n]) !== null && _a !== void 0 ? _a : ''); });
                ended = [];
                endedAs = {};
                texts = {};
                // A watch well past the time limit the engine set it has ended, whether or not its last line was read
                for (_d = 0, list_1 = list; _d < list_1.length; _d++) {
                    one = list_1[_d];
                    for (_e = 0, _f = (_p = one.bg) !== null && _p !== void 0 ? _p : []; _e < _f.length; _e++) {
                        b = _f[_e];
                        if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE)
                            (ended.push(b.id), (endedAs[b.id] = 'timed out'));
                    }
                }
                isChanged = false;
                moved = new Set();
                if (!files.length) return [3 /*break*/, 7];
                mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)';
                script = "for f; do ".concat(mtime, "; printf '\\n@@JOB@@ %s %s\\n' \"$m\" \"$f\"; tail -c ").concat(JOB_TAIL, " \"$f\" 2>/dev/null; done");
                return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', script, 'sh'], files, true), { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 6:
                r = _3.sent();
                if (!r)
                    return [2 /*return*/];
                parts = r.stdout.split(/\n@@JOB@@ ([^\n]*)\n/);
                _loop_3 = function (n) {
                    // The outputs come back in the order they were asked for, each after when it last changed
                    var job = asked[(n - 1) / 2];
                    var id = (_q = job === null || job === void 0 ? void 0 : job.id) !== null && _q !== void 0 ? _q : '';
                    var text = (_r = parts[n + 1]) !== null && _r !== void 0 ? _r : '';
                    texts[id] = text;
                    var m = Number((_t = (_s = parts[n]) === null || _s === void 0 ? void 0 : _s.split(' ')[0]) !== null && _t !== void 0 ? _t : 0) * 1000;
                    // One that ended, by the engine's last line on its output, and when: as that output last changed
                    var end = runEndOf(text);
                    // (one that failed with why, read from the end of what it wrote)
                    var why = (end === null || end === void 0 ? void 0 : end.how) === 'failed' ? whyOf(text) : '';
                    if (end)
                        (ended.includes(id) || ended.push(id), (endedAs[id] = __assign(__assign(__assign({}, end), (m ? { at: m } : {})), (why ? { why: why } : {}))));
                    // A task's background command that failed is read as one held open is: an error in its last lines naming a file another running
                    // task changed lately in the same checkout tells that task, and the task whose command it was (crossing.tsx)
                    var failedCmd = (end === null || end === void 0 ? void 0 : end.how) === 'failed' && (job === null || job === void 0 ? void 0 : job.owner) ? ((_x = (_w = (_v = (_u = list.find(function (one) { return one.id === job.owner; })) === null || _u === void 0 ? void 0 : _u.bg) === null || _v === void 0 ? void 0 : _v.find(function (b) { return b.id === id; })) === null || _w === void 0 ? void 0 : _w.cmd) !== null && _x !== void 0 ? _x : '') : '';
                    if (failedCmd && (job === null || job === void 0 ? void 0 : job.owner)) {
                        var owner_1 = job.owner;
                        void crossEnded($, { tool: 'Bash', agentId: owner_1, command: failedCmd }, {}, text, true)
                            .then(function (line) { return (line ? tell($, owner_1, line) : undefined); })
                            .catch(function (err) { return log($, "a failed background command not read for crossing: ".concat(String(err))); });
                    }
                    // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote
                    var seen = __assign(__assign({}, latestOf(text)), (m && !text.trim() ? { isEmpty: true } : {}));
                    var was = jobLog.get(id);
                    // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
                    var kept = !seen.pct && !seen.done && (was === null || was === void 0 ? void 0 : was.isOwn) ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {};
                    var next = __assign(__assign(__assign(__assign({}, seen), { tail: tailOf(text) }), kept), (m ? { wroteAt: m } : {}));
                    var isSame = (was === null || was === void 0 ? void 0 : was.latest) === next.latest && (was === null || was === void 0 ? void 0 : was.words) === next.words && (was === null || was === void 0 ? void 0 : was.pct) === next.pct && (was === null || was === void 0 ? void 0 : was.done) === next.done && (was === null || was === void 0 ? void 0 : was.total) === next.total && (was === null || was === void 0 ? void 0 : was.rate) === next.rate && (was === null || was === void 0 ? void 0 : was.left) === next.left && (was === null || was === void 0 ? void 0 : was.isEmpty) === next.isEmpty && (was === null || was === void 0 ? void 0 : was.isEarlier) === next.isEarlier && (was === null || was === void 0 ? void 0 : was.wroteAt) === next.wroteAt && ((_y = was === null || was === void 0 ? void 0 : was.tail) === null || _y === void 0 ? void 0 : _y.join('\n')) === ((_z = next.tail) === null || _z === void 0 ? void 0 : _z.join('\n'));
                    if (isSame)
                        return "continue";
                    jobLog.set(id, next);
                    isChanged = true;
                    var owner = job === null || job === void 0 ? void 0 : job.owner;
                    if (seen.latest && owner && was && was.latest !== seen.latest && now - ((_0 = jobNews.get(owner)) !== null && _0 !== void 0 ? _0 : 0) >= JOB_NEWS)
                        moved.add(owner);
                };
                for (n = 1; n + 1 < parts.length; n += 2) {
                    _loop_3(n);
                }
                _3.label = 7;
            case 7:
                quiet = asked.filter(function (o) {
                    var _a, _b;
                    if (ended.includes(o.id))
                        return false;
                    var b = (_b = (_a = list.find(function (one) { return one.id === o.owner; })) === null || _a === void 0 ? void 0 : _a.bg) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.id === o.id; });
                    var seen = jobLog.get(o.id);
                    if (!b || b.isWatch || !seen)
                        return false;
                    return now - (seen.wroteAt && !seen.isEmpty ? seen.wroteAt : b.at) >= SILENT_WARN;
                });
                for (_g = 0, asked_1 = asked; _g < asked_1.length; _g++) {
                    o = asked_1[_g];
                    if (!quiet.includes(o) && ((_1 = jobLog.get(o.id)) === null || _1 === void 0 ? void 0 : _1.live))
                        (jobLog.set(o.id, __assign(__assign({}, jobLog.get(o.id)), { live: undefined })), (isChanged = true));
                }
                if (!(quiet.length && now - liveLookedAt >= LIVE_LOOK)) return [3 /*break*/, 9];
                liveLookedAt = now;
                return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', LIVE_SCRIPT, 'sh'], quiet.map(function (o) { return "".concat(tasksDir, "/").concat(o.id, ".output"); }), true), { timeoutMs: 8000 }).catch(function () { return undefined; })];
            case 8:
                r = _3.sent();
                _loop_4 = function (m) {
                    var o = quiet.find(function (o) { return "".concat(tasksDir, "/").concat(o.id, ".output") === m[2]; });
                    var seen = o ? jobLog.get(o.id) : undefined;
                    var live = Number(m[1]) >= LIVE_BUSY ? 'busy' : 'idle';
                    if (o && seen && seen.live !== live)
                        (jobLog.set(o.id, __assign(__assign({}, seen), { live: live })), (isChanged = true));
                };
                for (_h = 0, _j = ((_2 = r === null || r === void 0 ? void 0 : r.stdout) !== null && _2 !== void 0 ? _2 : '').matchAll(/^@@LIVE@@ (\d+) (.*)$/gm); _h < _j.length; _h++) {
                    m = _j[_h];
                    _loop_4(m);
                }
                _3.label = 9;
            case 9:
                // Each command that needs it is named afresh in plain words, in the background: never waited for here
                void nameJobs($, list, texts, endedAs).catch(function (err) { return log($, "commands not named: ".concat(String(err))); });
                if (!ended.length) return [3 /*break*/, 11];
                return [4 /*yield*/, dropBackground($, ended, endedAs)];
            case 10:
                _3.sent();
                for (_k = 0, ended_1 = ended; _k < ended_1.length; _k++) {
                    id = ended_1[_k];
                    jobLog.delete(id);
                }
                isChanged = true;
                _3.label = 11;
            case 11:
                // (not waited for: a work's chat may take its time to take a line, and the look goes on meanwhile)
                void tellSilent($, list, now).catch(function (err) { return log($, "silent runs not told: ".concat(String(err))); });
                _l = endWatchers;
                _m = [$];
                return [4 /*yield*/, read($, todos)];
            case 12:
                void _l.apply(void 0, _m.concat([_3.sent(), now])).catch(function (err) { return log($, "watchers not stopped: ".concat(String(err))); });
                for (_o = 0, moved_1 = moved; _o < moved_1.length; _o++) {
                    owner = moved_1[_o];
                    jobNews.set(owner, now);
                }
                if (!moved.size) return [3 /*break*/, 14];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (moved.has(one.id) ? __assign(__assign({}, one), { newAt: now }) : one); }); })
                    // A command that ended leaves its row at once; new output alone waits for the panel's next calm drawing (calmLook, every CALM while
                    // work runs): drawn afresh at each output, seven tasks' commands drew the panel without a pause and no click held (16 Nov)
                ];
            case 13:
                _3.sent();
                _3.label = 14;
            case 14:
                // A command that ended leaves its row at once; new output alone waits for the panel's next calm drawing (calmLook, every CALM while
                // work runs): drawn afresh at each output, seven tasks' commands drew the panel without a pause and no click held (16 Nov)
                if (ended.length)
                    void drawFresh($);
                else if (isChanged)
                    outputMoved = true;
                return [2 /*return*/];
        }
    });
}); };
var outputMoved = false;
// How often a silent command's programs are looked at, how much of a processor counts as busy (percent, all of them together),
// and the look itself: who holds each log open, and what they use
var LIVE_LOOK = 20000;
var LIVE_BUSY = 3;
var liveLookedAt = 0;
var LIVE_SCRIPT = "command -v lsof >/dev/null 2>&1 || exit 0; for f; do p=$(lsof -t \"$f\" 2>/dev/null | tr '\\n' ',' | sed 's/,$//'); [ -n \"$p\" ] || continue; c=$(ps -o pcpu= -p \"$p\" 2>/dev/null | awk '{s+=$1} END{printf \"%d\", s+0.5}'); echo \"@@LIVE@@ $c $f\"; done";
// A short time since, for a row's side: seconds, minutes, or hours and minutes
var shortAgo = function (ms) {
    var all = Math.max(0, Math.floor(ms / 1000));
    return all < 60 ? "".concat(all, "s") : all < 3600 ? "".concat(Math.floor(all / 60), "m") : "".concat(Math.floor(all / 3600), "h ").concat(String(Math.floor(all / 60) % 60).padStart(2, '0'), "m");
};
// A press on Stop on a row ends its command as the engine stops one (TaskStop). The task is told in its own chat that the person
// stopped it, and what to do next. On this Mac only
var canStopJob = function (job) { return !isRunFromAfar && !job.id.startsWith('more-'); };
var stoppingJobs = new Set();
var RUN_STOPPED = function (what, silent) {
    return silent
        ? "".concat(who(true), " stopped your command \"").concat(what, "\" from the panel because it looked stuck: it had printed nothing for ").concat(silent, ". Don't start it again as it was: find out why it stalled, make it print a plain `progress:` line as it goes, and start it again only if it is still needed.")
        : "".concat(who(true), " stopped your command \"").concat(what, "\" from the panel. Don't start it again unless ").concat(who(), " asks for it. Continue without it, or ask them if you need it.");
};
var stopJob = function ($, owner, job) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!canStopJob(job) || stoppingJobs.has(job.id))
                    return [2 /*return*/];
                stoppingJobs.add(job.id);
                presses += 1;
                drawAgain($);
                _a.label = 1;
            case 1:
                _a.trys.push([1, , 3, 4]);
                return [4 /*yield*/, stopping($, owner, job)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                stoppingJobs.delete(job.id);
                presses += 1;
                jobsLookedAt = 0;
                void drawFresh($);
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// A command that only reads another's output (a tail or grep left going) outlives what it watches once no command of its task, the
// task above it or the helpers under that one still goes, or once its task has ended: it is stopped then, and its task told while
// it is at work. Never a watch that looks for something far away, which ends by itself when that is there
var WATCHER_STOPPED = function (what) { return "Your command \"".concat(what, "\" was stopped: it only read the output of commands that have all ended. Don't start a command that only reads another's output: the end of a command of yours starts your next step by itself."); };
var watchersTried = new Set();
var endWatchers = function ($, list, now) { return __awaiter(_this, void 0, void 0, function () {
    var runsOf, _loop_5, _i, list_2, one;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                runsOf = function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; }).map(function (b) { var _a; return ({ id: b.id, cmd: (_a = b.cmd) !== null && _a !== void 0 ? _a : '' }); }); };
                _loop_5 = function (one) {
                    var watchers, top_1, tree, isWatched_1, _loop_6, _d, watchers_1, run;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (one.chat)
                                    return [2 /*return*/, "continue"];
                                watchers = runsOf(one).filter(function (run) { return watcherOf(run.cmd) && !stoppingJobs.has(run.id) && !watchersTried.has(run.id); });
                                if (!watchers.length)
                                    return [2 /*return*/, "continue"];
                                top_1 = topOf(list, one.id);
                                tree = __spreadArray([list.find(function (card) { return card.id === top_1; })], underOf(list, top_1), true).filter(function (card) { return Boolean(card); });
                                isWatched_1 = tree.some(function (card) { var _a; return card.status === 'working' && (runsOf(card).some(function (run) { return !watcherOf(run.cmd); }) || (((_a = card.running) === null || _a === void 0 ? void 0 : _a.cmd) !== undefined && !watcherOf(card.running.cmd)) || (card.id !== one.id && card.parentId !== undefined)); });
                                if (one.status === 'working' && isWatched_1)
                                    return [2 /*return*/, "continue"];
                                _loop_6 = function (run) {
                                    var job;
                                    return __generator(this, function (_f) {
                                        switch (_f.label) {
                                            case 0:
                                                job = (_a = jobsOf(one).find(function (j) { return j.id === run.id; })) !== null && _a !== void 0 ? _a : jobsOf(__assign(__assign({}, one), { bg: (_b = one.bg) === null || _b === void 0 ? void 0 : _b.filter(function (b) { return b.id === run.id; }) }))[0];
                                                if (!job || now - job.at < 60000)
                                                    return [2 /*return*/, "continue"];
                                                // (tried once: one that cannot be stopped is left to its row's Stop)
                                                watchersTried.add(job.id);
                                                stoppingJobs.add(job.id);
                                                _f.label = 1;
                                            case 1:
                                                _f.trys.push([1, , 3, 4]);
                                                return [4 /*yield*/, stopping($, one.id, job, one.status === 'working' ? WATCHER_STOPPED(job.label) : '')];
                                            case 2:
                                                _f.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                stoppingJobs.delete(job.id);
                                                return [7 /*endfinally*/];
                                            case 4: return [4 /*yield*/, log($, "run ".concat(job.id, " of work ").concat(one.id, " stopped: it only read the output of runs that have ended"))];
                                            case 5:
                                                _f.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _d = 0, watchers_1 = watchers;
                                _e.label = 1;
                            case 1:
                                if (!(_d < watchers_1.length)) return [3 /*break*/, 4];
                                run = watchers_1[_d];
                                return [5 /*yield**/, _loop_6(run)];
                            case 2:
                                _e.sent();
                                _e.label = 3;
                            case 3:
                                _d++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, list_2 = list;
                _c.label = 1;
            case 1:
                if (!(_i < list_2.length)) return [3 /*break*/, 4];
                one = list_2[_i];
                return [5 /*yield**/, _loop_5(one)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// (`said`: what the work is told instead of the person's stop, nothing when empty)
var stopping = function ($, owner, job, said) { return __awaiter(_this, void 0, void 0, function () {
    var now, card, bg, r, silent;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _b.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                card = (_b.sent()).find(function (one) { return one.id === owner; });
                bg = (_a = card === null || card === void 0 ? void 0 : card.bg) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.id === job.id; });
                if (!!bg) return [3 /*break*/, 4];
                return [4 /*yield*/, log($, "run ".concat(job.id, " of work ").concat(owner, " could not be stopped: its card no longer has it"))];
            case 3: return [2 /*return*/, void (_b.sent())];
            case 4: return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: bg.id }).catch(function (err) { return ({ deny: String(err) }); })
                // Not stopped: nothing is said to have stopped, and the row stays as it is
            ];
            case 5:
                r = _b.sent();
                if (!r.deny) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "run ".concat(bg.id, " not stopped by the engine: ").concat(String(r.deny)))];
            case 6: return [2 /*return*/, void (_b.sent())];
            case 7: return [4 /*yield*/, dropBackground($, [bg.id], 'stopped')];
            case 8:
                _b.sent();
                silent = job.wroteAt && !job.isEmpty ? now - job.wroteAt : now - job.at;
                // (a task that has finished is told nothing: the server it left for the person is the person's to stop)
                if ((card === null || card === void 0 ? void 0 : card.status) === 'working') {
                    if (said === undefined)
                        void tell($, owner, RUN_STOPPED(job.label, job.kind !== 'server' && job.kind !== 'watch' && silent >= SILENT_WARN ? shortAgo(silent) : ''));
                    else if (said)
                        void tell($, owner, said);
                }
                jobLog.delete(job.id);
                silentTold.delete(job.id);
                if (!(said === undefined)) return [3 /*break*/, 10];
                return [4 /*yield*/, log($, "the person stopped run ".concat(job.id, " of work ").concat(owner))];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
// A command of a task at work that has printed nothing for a minute is named to that task once, in its own chat, which it reads at
// its next step. Not a server or a watch, which speak only when there is something to say
var RUN_SILENT_TOLD = 60000;
var silentTold = new Set();
var RUN_SILENT = function (what, silent, live) {
    return "Your command \"".concat(what, "\" has printed nothing for ").concat(silent).concat(live === 'busy' ? ', and its programs are still using the processor, so it is likely still working' : live === 'idle' ? ', and its programs are not using the processor: it is stuck, or waits on something far away' : '', ". Look at it now: if it is stuck, stop it with TaskStop and find out why; if it is still working, let it finish, and make what you run next print a plain `progress:` line as it goes.");
};
// A cloud job that sends nothing back cannot be followed from its card: its task is told to bring the job's own output back
var CLOUD_SILENT = function (what, silent) {
    return "Your cloud job \"".concat(what, "\" has sent nothing back for ").concat(silent, ", so its card and its log show nothing of what the cloud machine does, and ").concat(who(), " cannot tell whether it works. Look at it now. If it is stuck, stop it with TaskStop and find out why. If it works, make its own output come back while it runs: from a command of yours sent to the background, follow the job's log from its first line until the job ends (`ssh <machine> 'tail -n +1 -f <its log>'`, `az ml job stream`, `kubectl logs -f`), never a call that answers only at the end; print `state: queued`, `state: starting`, `state: running` as it changes, have the job print a `progress:` line as it goes, and about once a minute one line of how busy its machine is, such as `machine: GPU 87% \u00B7 14 of 24 GB`. Never print a key, a token or a signed link.");
};
var tellSilent = function ($, list, now) { return __awaiter(_this, void 0, void 0, function () {
    var _i, list_3, one, _a, _b, job, silent, _c, silentTold_1, id;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _i = 0, list_3 = list;
                _g.label = 1;
            case 1:
                if (!(_i < list_3.length)) return [3 /*break*/, 6];
                one = list_3[_i];
                if (one.status !== 'working' || one.chat)
                    return [3 /*break*/, 5];
                _a = 0, _b = jobsOf(one);
                _g.label = 2;
            case 2:
                if (!(_a < _b.length)) return [3 /*break*/, 5];
                job = _b[_a];
                // (not the mod's own runners, which say how they go themselves)
                if (job.kind === 'server' || job.kind === 'watch' || job.id.startsWith('more-') || silentTold.has(job.id) || /\bbin\/(?:admin|secret|release|keyring)\b/.test(job.cmd))
                    return [3 /*break*/, 4];
                if (!job.wroteAt)
                    return [3 /*break*/, 4];
                silent = job.isEmpty ? now - job.at : now - job.wroteAt;
                if (silent < RUN_SILENT_TOLD)
                    return [3 /*break*/, 4];
                silentTold.add(job.id);
                void tell($, one.id, job.kind === 'remote' ? CLOUD_SILENT(job.title || job.label, shortAgo(silent)) : RUN_SILENT(job.label, shortAgo(silent), job.live));
                return [4 /*yield*/, log($, "work ".concat(one.id, " told its run ").concat(job.id, " has been silent ").concat(shortAgo(silent)))];
            case 3:
                _g.sent();
                _g.label = 4;
            case 4:
                _a++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                // (a run that speaks again may be named again when it next goes silent)
                for (_c = 0, silentTold_1 = silentTold; _c < silentTold_1.length; _c++) {
                    id = silentTold_1[_c];
                    if (((_d = jobLog.get(id)) === null || _d === void 0 ? void 0 : _d.wroteAt) && now - ((_f = (_e = jobLog.get(id)) === null || _e === void 0 ? void 0 : _e.wroteAt) !== null && _f !== void 0 ? _f : 0) < RUN_SILENT_TOLD)
                        silentTold.delete(id);
                }
                return [2 /*return*/];
        }
    });
}); };
// A run in its own words
var runWords = function (what, cmd) {
    if (cmd === void 0) { cmd = ''; }
    return labelOf(describedOf(what).text, cmd);
};
// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
// A command that has ended keeps the file it wrote to, so its output opens the same way from where its end is said
var canOpenFile = function (file) { return Boolean(file) && !isRunFromAfar; };
var canOpenJob = function (job) { return canOpenFile(jobFiles.get(job.id)); };
var openJobOutput = function ($, job, written) { return __awaiter(_this, void 0, void 0, function () {
    var file, at, base, home, path, script, ready, r, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                file = written !== null && written !== void 0 ? written : jobFiles.get(job.id);
                // A press moves the buttons' keys, so the panel does not keep pulling back to this row
                presses += 1;
                drawAgain($);
                if (!file || !canOpenFile(file) || isLinux)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _b.sent();
                base = "".concat(dir, "/terminal");
                home = "".concat(base, "/output-").concat(slug(job.id) || 'job', "-").concat(at);
                path = file.startsWith('~/') ? "\"$HOME\"/".concat(zshQuoted(file.slice(2))) : zshQuoted(file);
                script = ['#!/bin/zsh', "print -r -- $'\\e[2m'".concat(zshQuoted("".concat(job.label, " \u00B7 ").concat(file)), "$'\\e[0m'"), "[[ -e ".concat(path, " ]] || print -r -- 'No output yet. It shows here as soon as the command writes something.'"), "exec tail -n 1000 -F ".concat(path), ''].join('\n');
                return [4 /*yield*/, $.fs.write("".concat(home, "/output.command"), script)];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, "".concat(home, "/output.command")]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 3:
                ready = _b.sent();
                if (!(ready.exitCode === 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, $.process.run(['open', "".concat(home, "/output.command")]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 4:
                _a = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = ready;
                _b.label = 6;
            case 6:
                r = _a;
                if (r.exitCode !== 0)
                    void log($, "output not opened: ".concat(r.stderr.trim().slice(0, 160)));
                return [2 /*return*/];
        }
    });
}); };
// A command's log is a tab of the panel, named after the command: what it is and how it stands, then the end of what it wrote,
// drawn again as it writes; the same for one that has ended, from the file it left. A press on a command's name opens it
// The tasks and helpers whose ended commands are folded away in Details
var endedFolded = new Set();
// and those opened again by a press in a Details tab drawn with less in it, where they start folded (drawingFits)
var endedOpened = new Set();
var LOG_PANE = 'log-';
var LOG_LINES = 300;
var logPaneOf = function (id) { return "".concat(LOG_PANE).concat(id.replace(/[^A-Za-z0-9_-]/g, '-')).slice(0, 64); };
var openLog = function ($, id, label) {
    presses += 1;
    void comingTab((function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, front($, logPaneOf(id), cut(label || 'Log', 30))];
                case 1:
                    _a.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })()).catch(function (err) { return log($, "log of ".concat(id, " not opened: ").concat(String(err))); });
};
// The command a log tab is of, running or ended, with its task and the file it writes to
var logOf = function ($, paneId) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, one, b, run, where, _b, _c;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _i = 0;
                return [4 /*yield*/, read($, todos)];
            case 1:
                _a = _h.sent();
                _h.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                one = _a[_i];
                b = (_d = one.bg) === null || _d === void 0 ? void 0 : _d.find(function (b) { return logPaneOf(b.id) === paneId; });
                if (b)
                    return [2 /*return*/, { one: one, job: jobOf(b.id, b.what, (_e = b.cmd) !== null && _e !== void 0 ? _e : b.what, b.at, b.isWatch, (_f = one.seenJobs) === null || _f === void 0 ? void 0 : _f[b.id], b.named), run: undefined, file: jobFiles.get(b.id) || (tasksDir ? "".concat(tasksDir, "/").concat(b.id, ".output") : '') }];
                run = (_g = one.endedRuns) === null || _g === void 0 ? void 0 : _g.find(function (r) { return logPaneOf(r.id) === paneId; });
                if (!run) return [3 /*break*/, 7];
                if (!(run.file || one.chat)) return [3 /*break*/, 3];
                _b = '';
                return [3 /*break*/, 6];
            case 3:
                _c = tasksDir;
                if (_c) return [3 /*break*/, 5];
                return [4 /*yield*/, findTasks($)];
            case 4:
                _c = (tasksDir = _h.sent());
                _h.label = 5;
            case 5:
                _b = _c;
                _h.label = 6;
            case 6:
                where = _b;
                return [2 /*return*/, { one: one, job: undefined, run: run, file: run.file || (where ? "".concat(where, "/").concat(run.id, ".output") : '') }];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/, undefined];
        }
    });
}); };
var logView = function ($, ui, paneId) { return __awaiter(_this, void 0, void 0, function () {
    var Box, Button, Text, found, one, job, run, file, now, label, why, kind, state, r, _a, all, lines, isFailed;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                Box = ui.Box, Button = ui.Button, Text = ui.Text;
                return [4 /*yield*/, logOf($, paneId)];
            case 1:
                found = _g.sent();
                if (!found)
                    return [2 /*return*/, <Text dimColor>This log is no longer available.</Text>];
                one = found.one, job = found.job, run = found.run, file = found.file;
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _g.sent();
                label = job ? ((_b = job.title) !== null && _b !== void 0 ? _b : job.label) : run ? runLabel(run) : 'A command';
                why = (run === null || run === void 0 ? void 0 : run.how) === 'failed' ? (_c = run.named) === null || _c === void 0 ? void 0 : _c.why : undefined;
                kind = (_e = (_d = job === null || job === void 0 ? void 0 : job.kind) !== null && _d !== void 0 ? _d : run === null || run === void 0 ? void 0 : run.kind) !== null && _e !== void 0 ? _e : 'script';
                state = job ? "".concat(JOB_NOW[kind], " \u00B7 ").concat(took(now - job.at)) : run ? "".concat(endedLine(run, took(run.endedAt - run.at)), " \u00B7 ").concat(shortAgo(now - run.endedAt), " ago") : '';
                if (!(file && canOpenFile(file))) return [3 /*break*/, 4];
                return [4 /*yield*/, $.process.run(['sh', '-c', 'tail -n "$2" "$1" 2>/dev/null # the log tab', 'sh', file, String(LOG_LINES + 1)], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 3:
                _a = _g.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = undefined;
                _g.label = 5;
            case 5:
                r = _a;
                all = logLines((_f = r === null || r === void 0 ? void 0 : r.stdout) !== null && _f !== void 0 ? _f : '');
                lines = all.slice(-LOG_LINES);
                isFailed = (run === null || run === void 0 ? void 0 : run.how) === 'failed';
                return [2 /*return*/, (<Box key="log" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="log-head" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" gap={1}>
          <Box flexShrink={0}>
            <Text color={isFailed ? 'error' : job ? JOB_COLOR[kind] : undefined} dimColor={!job && !isFailed}>{JOB_GLYPH[kind]}</Text>
          </Box>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold wrap="wrap">{label}</Text>
          </Box>
        </Box>
        {isFailed ? <Text color="error" wrap="wrap">{why ? "".concat(state, " \u00B7 ").concat(why) : state}</Text> : null}
        <Text dimColor wrap="wrap">{[isFailed ? '' : state, "of the task \u201C".concat(cut(titleOf(one), 40), "\u201D")].filter(Boolean).join(' · ')}</Text>
        <Box flexDirection="row" gap={2} flexShrink={0}>
          {job && canStopJob(job) ? <Button key={"log-stop-".concat(presses)} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain onPress={function () { return void stopJob($, one.id, job).catch(function (err) { return log($, "run not stopped: ".concat(String(err))); }); }}/> : null}
          <Button key={"log-details-".concat(presses)} label="Details" plain onPress={function () { return openWork($, one.id); }}/>
          {file && canOpenFile(file) && !isLinux ? <Button key={"log-terminal-".concat(presses)} label="Open in Terminal" plain onPress={function () { var _a, _b; return void openJobOutput($, { id: (_b = (_a = job === null || job === void 0 ? void 0 : job.id) !== null && _a !== void 0 ? _a : run === null || run === void 0 ? void 0 : run.id) !== null && _b !== void 0 ? _b : '', label: label }, file).catch(function (err) { return log($, "output not opened: ".concat(String(err))); }); }}/> : null}
        </Box>
      </Box>
      <Box key="log-lines" flexDirection="column" backgroundColor={OUTPUT_FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {all.length > lines.length ? <Text dimColor>{"The last ".concat(LOG_LINES, " lines")}</Text> : null}
        {lines.length ? (lines.map(function (line, n) { return (<Text key={"log-line-".concat(n)} wrap="wrap">{line || ' '}</Text>); })) : (<Text dimColor wrap="wrap">{!file || !canOpenFile(file) ? "This log isn't on this Mac." : job ? (kind === 'remote' ? 'Nothing has come back from the cloud machine yet. The command that started the job still waits for it, and its task has been told to bring the job\'s own output here as it runs.' : 'No output yet. It shows here as soon as the command writes something.') : 'It wrote nothing.'}</Text>)}
      </Box>
    </Box>)];
        }
    });
}); };
