// What each piece of work has running: the commands it sent to the background and a long one it waits on, each as a job on its
// card's tree with what kind it is (a server, a download, a script), what it is in its own words, and the latest line it wrote
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
// The processes on this Mac, looked at less often than the outputs; and how many looks in a row found no shell for a command
var jobProcs = [];
var jobProcsAt = 0;
var JOB_PS = 15000;
// How long past its time limit a watch is still waited for to say it ended, before it counts as ended anyway
var WATCH_GRACE = 2 * 60000;
var shellMissed = new Map();
// Where the engine writes this chat's background output, once found; and when it was last looked for in vain
var tasksDir = '';
var tasksOf = '';
var tasksMissedAt = 0;
// The output a command held open writes while it runs, by its row's id: the engine writes it to a file of its own in the tasks
// folder and names it only once the command ends or goes to the background, so it is found as the file its shell writes to
var callFiles = new Map();
// The file each row's output was last read from, by its id, so a press on the row can show it whole
var jobFiles = new Map();
// A command held open is a row of its own once it has run this long, so no command runs past ten seconds without a line that
// says how it goes (it was two minutes, and on 16 Nov commands ran for minutes with nothing on their card)
var ROW_SHOWN = 10000;
// A job as its row shows it, from its command and words: a command that only waits is a wait, with what it waits for
var jobOf = function (id, what, cmd, at, isWatch, theirs) {
    var _a, _b, _c;
    if (isWatch === void 0) { isWatch = false; }
    var seen = (_a = jobLog.get(id)) !== null && _a !== void 0 ? _a : theirs;
    var wait = isWatch ? undefined : waitOf(cmd);
    var said = describedOf(what);
    var kind = isWatch ? 'watch' : ((_b = said.kind) !== null && _b !== void 0 ? _b : (wait ? 'wait' : jobKindOf(cmd, what)));
    var label = labelOf(said.text || cmd, cmd);
    return __assign(__assign(__assign(__assign({ id: id, label: label, isNamed: Boolean(what) && label !== labelOf('', cmd), cmd: cmd, kind: kind, at: at }, (said.expect ? { expect: said.expect, expectText: said.expectText } : {})), (seen !== null && seen !== void 0 ? seen : {})), (wait ? __assign({ waitsFor: wait.what }, (wait.file ? { waitFile: wait.file } : {})) : {})), { port: (_c = portOf(cmd)) !== null && _c !== void 0 ? _c : seen === null || seen === void 0 ? void 0 : seen.port });
};
// The jobs a card has running: what it sent to the background, and a command it has waited on a while; jobs alike are one
var jobsOf = function (one, at) {
    var _a, _b, _c, _d;
    return foldJobs(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { var _a, _b; return jobOf(b.id, b.what, (_a = b.cmd) !== null && _a !== void 0 ? _a : b.what, b.at, b.isWatch, (_b = one.seenJobs) === null || _b === void 0 ? void 0 : _b[b.id]); }), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []).map(function (d) { var _a, _b; return jobOf(d.id, d.from && ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return b.id === d.from; })) ? "What \u201C".concat(runWords(d.what, d.cmd), "\u201D started") : d.what, d.cmd, d.at, false, (_b = one.seenJobs) === null || _b === void 0 ? void 0 : _b[d.id]); }), true), (one.status === 'working' && ((_c = one.running) === null || _c === void 0 ? void 0 : _c.cmd) && at - one.running.at >= ROW_SHOWN
        ? [jobOf("call-".concat(one.id), (_d = one.running.label) !== null && _d !== void 0 ? _d : '', one.running.cmd, one.running.at)]
        : []), true), heldJobs(one), true));
};
// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for; a wait's own "Wait" is not said
// twice
var jobHead = function (job) {
    var _a;
    if (job.id.startsWith('more-'))
        return job.label;
    // What a command left going is said in that command's own words alone, as the person reads what it is doing first; how many
    // programs it is goes on the line under it (17 Nov "Command · 12 programs · Test whe…" cut the words that said what it was)
    if (leftCommandOf(job.id) && job.count && job.count > 1)
        return job.label;
    var many = job.count && job.count > 1 ? " \u00D7".concat(job.count) : '';
    var kind = "".concat(JOB_HEAD[job.kind]).concat(job.kind === 'server' && job.port ? " :".concat(job.port) : '').concat(many);
    // Its own words alone when they say its kind already (Download the CT scans, Wait for the deploy)
    if (job.isNamed && isKindSaid(job.label))
        return "".concat(job.label).concat(job.kind === 'server' && job.port && !job.label.includes(job.port) ? " :".concat(job.port) : '').concat(many);
    // A wait leads with what it waits for, its own words after
    var label = job.kind === 'wait' ? ((_a = job.waitsFor) !== null && _a !== void 0 ? _a : job.label.replace(/^wait(s|ing)?\s+/i, '')) : job.label;
    return "".concat(kind, " \u00B7 ").concat(label);
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
// A command the work started detached is kept by its card with the log it writes and its process; a leading `cd`, or else the
// work's own folder, is where a log named without a folder is
var keepDetached = function ($, agent, call, result) { return __awaiter(_this, void 0, void 0, function () {
    var command, found, here, base, logFile, _a, pid, what, now, id;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (call.tool !== 'Bash')
                    return [2 /*return*/];
                command = String((_b = call.command) !== null && _b !== void 0 ? _b : '');
                found = detachedOf(command);
                if (!found)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.cwd()];
            case 1:
                here = _f.sent();
                base = found.cd ? (found.cd.startsWith('/') ? found.cd : "".concat(here, "/").concat(found.cd)) : here;
                logFile = found.log.startsWith('/') || found.log.startsWith('~/') ? found.log : "".concat(base, "/").concat(found.log);
                _a = !found.cd && !found.log.startsWith('/') && !found.log.startsWith('~/');
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, $.fs.exists(logFile).catch(function () { return false; })];
            case 2:
                _a = !(_f.sent());
                _f.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/];
                pid = /\$!/.test(command) ? pidOf(String((_c = result === null || result === void 0 ? void 0 : result.stdout) !== null && _c !== void 0 ? _c : '')) : undefined;
                if (!pid)
                    return [2 /*return*/];
                what = oneLine(String((_d = call.description) !== null && _d !== void 0 ? _d : '') || found.core).slice(0, 160);
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _f.sent();
                id = "detached-".concat(String((_e = call.tool_use_id) !== null && _e !== void 0 ? _e : now));
                return [4 /*yield*/, changeTodos($, function (list) {
                        return list.map(function (one) { var _a; return (one.id === agent ? __assign(__assign({}, one), { detached: __spreadArray(__spreadArray([], ((_a = one.detached) !== null && _a !== void 0 ? _a : []), true), [{ id: id, what: what, at: now, cmd: oneLine(command).slice(0, 400), log: logFile, pid: pid }], false).slice(-BG_KEPT) }) : one); });
                    })];
            case 5:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// Looked at as the list is followed: the end of each background job's output, read in one go. A card whose job wrote something
// new has news, so a long server or download that keeps writing does not read as stuck
var lookJobs = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, held, _loop_1, _i, callFiles_1, _a, id, was, owned, _loop_2, _b, _c, id, _loop_3, _d, _e, owner, _loop_4, _f, _g, id, unfound, pids_1, fd, _loop_5, _h, _j, line, sid, asked, files, waits, targets, isPs, pids, mtime, home, script, r, _k, _l, body, _m, tail, _o, _p, aliveText, psText, _q, _r, alive, changed, gone, runsOf_1, taken_2, fresh, _loop_6, _s, taken_1, _t, id, ended_2, _u, gone_1, id, bgs, shells, states, _v, shells_1, _w, id, pid, _x, owned_1, o, ended, endedAs, _y, list_1, one, _z, _0, b, targetOf, parts, isChanged, moved, _loop_7, n, _1, owned_2, o, was, next, _2, ended_1, id, _3, _4, _5, _6, _7, moved_1, owner;
    var _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
    return __generator(this, function (_23) {
        switch (_23.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _23.sent();
                if (now - jobsLookedAt < JOB_LOOK)
                    return [2 /*return*/];
                jobsLookedAt = now;
                return [4 /*yield*/, read($, todos)
                    // Held open: a command a card has waited on long enough to be a row of its own
                ];
            case 2:
                list = _23.sent();
                held = list.flatMap(function (one) { var _a; return (one.status === 'working' && ((_a = one.running) === null || _a === void 0 ? void 0 : _a.cmd) && now - one.running.at >= ROW_SHOWN ? [{ owner: one.id, id: "call-".concat(one.id), cmd: one.running.cmd, at: one.running.at }] : []); });
                _loop_1 = function (id, was) {
                    if (!held.some(function (h) { return h.id === id && h.at === was.at; }))
                        (callFiles.delete(id), jobLog.delete(id), silentTold.delete(id));
                };
                // A row's command that changed (another held call of the same card ran longest) starts afresh
                for (_i = 0, callFiles_1 = callFiles; _i < callFiles_1.length; _i++) {
                    _a = callFiles_1[_i], id = _a[0], was = _a[1];
                    _loop_1(id, was);
                }
                owned = __spreadArray(__spreadArray(__spreadArray([], list.flatMap(function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { return ({ owner: one.id, id: b.id, file: '', pid: undefined }); }); }), true), list.flatMap(function (one) { var _a; return ((_a = one.detached) !== null && _a !== void 0 ? _a : []).map(function (d) { return ({ owner: one.id, id: d.id, file: d.log, pid: d.pid, isUntold: Boolean(d.isLeft && !d.log) }); }); }), true), held.flatMap(function (h) { var _a, _b; return (callFiles.get(h.id) ? [{ owner: h.owner, id: h.id, file: (_b = (_a = callFiles.get(h.id)) === null || _a === void 0 ? void 0 : _a.file) !== null && _b !== void 0 ? _b : '', pid: undefined }] : []); }), true);
                _loop_2 = function (id) {
                    if (!owned.some(function (o) { return o.id === id; }) && !held.some(function (h) { return h.id === id; }))
                        jobLog.delete(id);
                };
                for (_b = 0, _c = jobLog.keys(); _b < _c.length; _b++) {
                    id = _c[_b];
                    _loop_2(id);
                }
                _loop_3 = function (owner) {
                    if (!owned.some(function (o) { return o.owner === owner; }))
                        jobNews.delete(owner);
                };
                for (_d = 0, _e = jobNews.keys(); _d < _e.length; _d++) {
                    owner = _e[_d];
                    _loop_3(owner);
                }
                _loop_4 = function (id) {
                    if (!owned.some(function (o) { return o.id === id; }))
                        shellMissed.delete(id);
                };
                for (_f = 0, _g = shellMissed.keys(); _f < _g.length; _f++) {
                    id = _g[_f];
                    _loop_4(id);
                }
                unfound = held.filter(function (h) { return !callFiles.has(h.id); });
                if (!(unfound.length && jobProcs.length)) return [3 /*break*/, 4];
                pids_1 = unfound.flatMap(function (h) {
                    var pid = heldShellOf(jobProcs, h.cmd, h.at);
                    return pid ? [{ id: h.id, pid: pid, at: h.at }] : [];
                });
                if (!pids_1.length) return [3 /*break*/, 4];
                return [4 /*yield*/, $.process
                        .run(__spreadArray(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh'], pids_1.map(function (p) { return p.pid; }), true), { timeoutMs: 5000 })
                        .catch(function () { return undefined; })];
            case 3:
                fd = _23.sent();
                _loop_5 = function (line) {
                    var _24 = line.split(' '), _25 = _24[0], pid = _25 === void 0 ? '' : _25, path = _24.slice(1);
                    var file = path.join(' ').trim();
                    var one = pids_1.find(function (p) { return p.pid === pid; });
                    if (one && /\/tasks\/[\w-]+\.output$/.test(file))
                        callFiles.set(one.id, { file: file, at: one.at });
                };
                for (_h = 0, _j = (_8 = fd === null || fd === void 0 ? void 0 : fd.stdout.split('\n')) !== null && _8 !== void 0 ? _8 : []; _h < _j.length; _h++) {
                    line = _j[_h];
                    _loop_5(line);
                }
                _23.label = 4;
            case 4: return [4 /*yield*/, pruneSpans($, now)];
            case 5:
                _23.sent();
                if (!owned.length && !unfound.length && !spans.length && !openCalls.size)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 6:
                sid = _23.sent();
                if (sid !== tasksOf)
                    ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0));
                if (!(owned.some(function (o) { return !o.file; }) && !tasksDir && now - tasksMissedAt >= JOB_NEWS)) return [3 /*break*/, 8];
                return [4 /*yield*/, findTasks($)];
            case 7:
                tasksDir = _23.sent();
                if (!tasksDir)
                    tasksMissedAt = now;
                _23.label = 8;
            case 8:
                asked = owned.filter(function (o) { return !('isUntold' in o && o.isUntold) && (o.file || tasksDir); });
                files = asked.map(function (o) { return o.file || "".concat(tasksDir, "/").concat(o.id, ".output"); });
                jobFiles.clear();
                asked.forEach(function (o, n) { var _a; return jobFiles.set(o.id, (_a = files[n]) !== null && _a !== void 0 ? _a : ''); });
                waits = list.flatMap(function (one) {
                    var _a, _b;
                    return __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; }), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []), true).flatMap(function (j) {
                        var _a;
                        var wait = waitOf((_a = j.cmd) !== null && _a !== void 0 ? _a : '');
                        return wait ? [{ id: j.id, wait: wait }] : [];
                    });
                });
                targets = waits.flatMap(function (w) { return (w.wait.file ? [w.wait.file] : []); });
                isPs = now - jobProcsAt >= JOB_PS || (unfound.length > 0 && now - jobProcsAt >= JOB_LOOK);
                pids = owned.flatMap(function (o) { return (o.pid && isPid(o.pid) ? [o.pid] : []); });
                mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)';
                home = 'case $f in "~/"*) f="$HOME/${f#\\~/}";; esac';
                script = "n=$1; shift; i=0; for f; do i=$((i+1)); o=$f; ".concat(home, "; ").concat(mtime, "; if [ $i -le $n ]; then printf '\\n@@JOB@@ %s %s\\n' \"$m\" \"$f\"; tail -c ").concat(JOB_TAIL, " \"$f\" 2>/dev/null; else printf '\\n@@AT@@ %s %s' \"$m\" \"$o\"; fi; done; printf '\\n@@ALIVE@@'; for p in ").concat(pids.map(function (p) { return p.replace(/\D/g, ''); }).join(' '), "; do kill -0 \"$p\" 2>/dev/null && printf ' %s' \"$p\"; done; printf '\\n'").concat(isPs ? "; printf '@@PS@@\\n'; ps -axww -o ".concat(PS_COLUMNS) : '');
                return [4 /*yield*/, $.process.run(__spreadArray(__spreadArray(['sh', '-c', script, 'sh', String(files.length)], files, true), targets, true), { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 9:
                r = _23.sent();
                if (!r)
                    return [2 /*return*/];
                _k = r.stdout.split('\n@@ALIVE@@'), _l = _k[0], body = _l === void 0 ? '' : _l, _m = _k[1], tail = _m === void 0 ? '' : _m;
                _o = tail.split('@@PS@@\n'), _p = _o[0], aliveText = _p === void 0 ? '' : _p, psText = _o[1];
                if (!(psText !== undefined)) return [3 /*break*/, 11];
                _q = procsOf;
                _r = [psText];
                return [4 /*yield*/, $.clock.now()];
            case 10:
                ((jobProcs = _q.apply(void 0, _r.concat([_23.sent()]))), (jobProcsAt = now), seeGroups(jobProcs));
                _23.label = 11;
            case 11:
                if (!(psText !== undefined && spans.length)) return [3 /*break*/, 13];
                return [4 /*yield*/, adoptLeft($, jobProcs, now).catch(function (err) { return log($, "left runs not followed: ".concat(String(err))); })];
            case 12:
                _23.sent();
                _23.label = 13;
            case 13:
                alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean));
                changed = new Map(__spreadArray([], body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g), true).map(function (m) { var _a; return [(_a = m[2]) !== null && _a !== void 0 ? _a : '', Number(m[1]) * 1000]; }));
                gone = owned.filter(function (o) { return o.pid && !alive.has(o.pid) && !stoppingJobs.has(o.id); }).map(function (o) { return o.id; });
                if (!(gone.length && /@@ALIVE@@/.test(r.stdout))) return [3 /*break*/, 16];
                runsOf_1 = function (one) { var _a; return ((_a = one.detached) !== null && _a !== void 0 ? _a : []).filter(function (d) { return gone.includes(d.id); }).map(function (d) { return ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'ended' }); }); };
                taken_2 = new Map();
                return [4 /*yield*/, changeTodos($, function (cards) {
                        return cards.map(function (one) {
                            var _a, _b;
                            var ended = ((_a = one.detached) !== null && _a !== void 0 ? _a : []).filter(function (d) { return gone.includes(d.id); });
                            if (!ended.length)
                                return one;
                            var left = ((_b = one.detached) !== null && _b !== void 0 ? _b : []).filter(function (d) { return !gone.includes(d.id); });
                            // (one being stopped now is told by its stop, read here as the run leaves its card; what one command left going is told
                            // once its last program has ended, never while others of it still work)
                            var isRest = function (d) { return leftCommandOf(d.id) !== '' && left.some(function (l) { return leftCommandOf(l.id) === leftCommandOf(d.id); }); };
                            taken_2.set(one.id, ended.filter(function (d) { return !stoppingJobs.has(d.id) && !isRest(d); }));
                            return __assign(__assign(__assign({}, one), { detached: left.length ? left : undefined }), keepEnded(one, runsOf_1(one)));
                        });
                    })];
            case 14:
                _23.sent();
                void drawFresh($);
                return [4 /*yield*/, read($, todos)];
            case 15:
                fresh = _23.sent();
                _loop_6 = function (id, ended_2) {
                    var runs_1 = ended_2.filter(function (d) { return !stoppingJobs.has(d.id) && !killedByWork.has(d.id) && !SERVER_CMD.test(d.cmd) && describedOf(d.what).kind !== 'server'; });
                    if (runs_1.length)
                        void wakeForRun($, fresh.find(function (one) { return one.id === id; }), runs_1).catch(function (err) { return log($, "work ".concat(id, " not woken as its run ended: ").concat(String(err))); });
                };
                for (_s = 0, taken_1 = taken_2; _s < taken_1.length; _s++) {
                    _t = taken_1[_s], id = _t[0], ended_2 = _t[1];
                    _loop_6(id, ended_2);
                }
                for (_u = 0, gone_1 = gone; _u < gone_1.length; _u++) {
                    id = gone_1[_u];
                    killedByWork.delete(id);
                }
                _23.label = 16;
            case 16:
                bgs = list.flatMap(function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; }).map(function (b) { var _a; return ({ id: b.id, cmd: (_a = b.cmd) !== null && _a !== void 0 ? _a : '', at: b.at }); }); });
                shells = jobProcs.length ? shellsOf(jobProcs, bgs) : new Map();
                states = new Map();
                for (_v = 0, shells_1 = shells; _v < shells_1.length; _v++) {
                    _w = shells_1[_v], id = _w[0], pid = _w[1];
                    if (typeof pid === 'string')
                        states.set(id, treeOf(jobProcs, pid).some(isPausedProc));
                    if (pid)
                        shellMissed.delete(id);
                    else if (psText !== undefined && __spreadArray([], shells.values(), true).some(Boolean))
                        shellMissed.set(id, ((_9 = shellMissed.get(id)) !== null && _9 !== void 0 ? _9 : 0) + 1);
                }
                for (_x = 0, owned_1 = owned; _x < owned_1.length; _x++) {
                    o = owned_1[_x];
                    if (o.pid)
                        states.set(o.id, treeOf(jobProcs, o.pid).some(isPausedProc));
                }
                ended = bgs.filter(function (b) { var _a; return ((_a = shellMissed.get(b.id)) !== null && _a !== void 0 ? _a : 0) >= 2 && now - b.at >= 60000; }).map(function (b) { return b.id; });
                endedAs = {};
                // A watch well past the time limit the engine set it has ended, whether or not its last line was read
                for (_y = 0, list_1 = list; _y < list_1.length; _y++) {
                    one = list_1[_y];
                    for (_z = 0, _0 = (_10 = one.bg) !== null && _10 !== void 0 ? _10 : []; _z < _0.length; _z++) {
                        b = _0[_z];
                        if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE && !ended.includes(b.id))
                            (ended.push(b.id), (endedAs[b.id] = 'timed out'));
                    }
                }
                targetOf = function (wait) {
                    var runs = wait.pattern
                        ? jobProcs.filter(function (p) { var _a; return isLike(p.command, (_a = wait.pattern) !== null && _a !== void 0 ? _a : '') && !/shell-snapshots\/snapshot-/.test(p.command) && !/^(\S*\/)?pgrep\s/.test(p.command); })
                        : wait.pid
                            ? jobProcs.filter(function (p) { return p.pid === wait.pid; })
                            : undefined;
                    if (runs && jobProcs.length) {
                        if (!runs.length)
                            return wait.isStart ? '' : 'What it waits for ended';
                        if (runs.some(function (p) { return treeOf(jobProcs, p.pid).some(isPausedProc); }))
                            return 'What it waits for is paused';
                    }
                    var at = wait.file ? changed.get(wait.file) : undefined;
                    return at && now - at >= JOB_QUIET ? "What it waits for hasn't changed for ".concat(shortAgo(now - at)) : '';
                };
                parts = body.split(/\n@@JOB@@ ([^\n]*)\n/);
                isChanged = false;
                moved = new Set();
                _loop_7 = function (n) {
                    // The outputs come back in the order they were asked for, each after when it last changed
                    var job = asked[(n - 1) / 2];
                    var id = (_11 = job === null || job === void 0 ? void 0 : job.id) !== null && _11 !== void 0 ? _11 : '';
                    var text = (_13 = ((_12 = parts[n + 1]) !== null && _12 !== void 0 ? _12 : '').split('\n@@AT@@ ')[0]) !== null && _13 !== void 0 ? _13 : '';
                    var m = Number((_15 = (_14 = parts[n]) === null || _14 === void 0 ? void 0 : _14.split(' ')[0]) !== null && _15 !== void 0 ? _15 : 0) * 1000;
                    // One that ended, by the engine's last line on its output, and when: as that output last changed
                    var end = (job === null || job === void 0 ? void 0 : job.pid) ? undefined : runEndOf(text);
                    if (end)
                        (ended.includes(id) || ended.push(id), (endedAs[id] = __assign(__assign({}, end), (m ? { at: m } : {}))));
                    // A task's background command that failed is read as one held open is: an error in its last lines naming a file another running
                    // task changed lately in the same checkout tells that task, and the task whose command it was (crossing.tsx)
                    var failedCmd = (end === null || end === void 0 ? void 0 : end.how) === 'failed' && (job === null || job === void 0 ? void 0 : job.owner) ? ((_19 = (_18 = (_17 = (_16 = list.find(function (one) { return one.id === job.owner; })) === null || _16 === void 0 ? void 0 : _16.bg) === null || _17 === void 0 ? void 0 : _17.find(function (b) { return b.id === id; })) === null || _18 === void 0 ? void 0 : _18.cmd) !== null && _19 !== void 0 ? _19 : '') : '';
                    if (failedCmd && (job === null || job === void 0 ? void 0 : job.owner)) {
                        var owner_1 = job.owner;
                        void crossEnded($, { tool: 'Bash', agentId: owner_1, command: failedCmd }, {}, text, true)
                            .then(function (line) { return (line ? tell($, owner_1, line) : undefined); })
                            .catch(function (err) { return log($, "a failed background command not read for crossing: ".concat(String(err))); });
                    }
                    // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote (on
                    // 15 Nov such rows read "updated 9m ago" for runs that sent all they printed elsewhere)
                    var seen = __assign(__assign({}, latestOf(text)), (m && !text.trim() ? { isEmpty: true } : {}));
                    var was = jobLog.get(id);
                    var wait = waits.find(function (w) { return w.id === id; });
                    // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
                    var kept = !seen.pct && !seen.done && (was === null || was === void 0 ? void 0 : was.isOwn) ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {};
                    var next = __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, seen), memSeen(job === null || job === void 0 ? void 0 : job.pid)), { tail: tailOf(text) }), kept), (m ? { wroteAt: m } : {})), (states.has(id) ? { isPaused: states.get(id) } : (was === null || was === void 0 ? void 0 : was.isPaused) ? { isPaused: true } : {})), (wait ? { target: targetOf(wait.wait) } : {}));
                    var isSame = (was === null || was === void 0 ? void 0 : was.latest) === next.latest && (was === null || was === void 0 ? void 0 : was.words) === next.words && (was === null || was === void 0 ? void 0 : was.pct) === next.pct && (was === null || was === void 0 ? void 0 : was.done) === next.done && (was === null || was === void 0 ? void 0 : was.total) === next.total && (was === null || was === void 0 ? void 0 : was.rate) === next.rate && (was === null || was === void 0 ? void 0 : was.left) === next.left && (was === null || was === void 0 ? void 0 : was.isEmpty) === next.isEmpty && (was === null || was === void 0 ? void 0 : was.isEarlier) === next.isEarlier && (was === null || was === void 0 ? void 0 : was.wroteAt) === next.wroteAt && (was === null || was === void 0 ? void 0 : was.isPaused) === next.isPaused && (was === null || was === void 0 ? void 0 : was.target) === next.target && ((_20 = was === null || was === void 0 ? void 0 : was.tail) === null || _20 === void 0 ? void 0 : _20.join('\n')) === ((_21 = next.tail) === null || _21 === void 0 ? void 0 : _21.join('\n'));
                    // Memory alone moving (a MB or so at each look) is kept for the next drawing, never a reason to draw the panel afresh under the pointer
                    if (isSame) {
                        if ((was === null || was === void 0 ? void 0 : was.mem) !== next.mem)
                            jobLog.set(id, next);
                        return "continue";
                    }
                    jobLog.set(id, next);
                    isChanged = true;
                    var owner = job === null || job === void 0 ? void 0 : job.owner;
                    if (seen.latest && owner && was && was.latest !== seen.latest && now - ((_22 = jobNews.get(owner)) !== null && _22 !== void 0 ? _22 : 0) >= JOB_NEWS)
                        moved.add(owner);
                };
                for (n = 1; n + 1 < parts.length; n += 2) {
                    _loop_7(n);
                }
                // A left run whose output goes nowhere it can be read runs with no progress given, with its memory
                for (_1 = 0, owned_2 = owned; _1 < owned_2.length; _1++) {
                    o = owned_2[_1];
                    if (!('isUntold' in o && o.isUntold) || gone.includes(o.id))
                        continue;
                    was = jobLog.get(o.id);
                    next = __assign(__assign({ latest: '', isUntold: true }, memSeen(o.pid)), (states.has(o.id) ? { isPaused: states.get(o.id) } : {}));
                    if ((was === null || was === void 0 ? void 0 : was.isUntold) && was.isPaused === next.isPaused) {
                        if (was.mem !== next.mem)
                            jobLog.set(o.id, next);
                        continue;
                    }
                    jobLog.set(o.id, next);
                    isChanged = true;
                }
                if (!ended.length) return [3 /*break*/, 18];
                return [4 /*yield*/, dropBackground($, ended, endedAs)];
            case 17:
                _23.sent();
                for (_2 = 0, ended_1 = ended; _2 < ended_1.length; _2++) {
                    id = ended_1[_2];
                    (jobLog.delete(id), shellMissed.delete(id));
                }
                isChanged = true;
                _23.label = 18;
            case 18:
                // (not waited for: a work's chat may take its time to take a line, and the look goes on meanwhile)
                void tellSilent($, list, now).catch(function (err) { return log($, "silent runs not told: ".concat(String(err))); });
                _3 = endWatchers;
                _4 = [$];
                return [4 /*yield*/, read($, todos)];
            case 19:
                void _3.apply(void 0, _4.concat([_23.sent(), now])).catch(function (err) { return log($, "watchers not stopped: ".concat(String(err))); });
                if (!(psText !== undefined)) return [3 /*break*/, 21];
                _5 = endWaiters;
                _6 = [$];
                return [4 /*yield*/, read($, todos)];
            case 20:
                void _5.apply(void 0, _6.concat([_23.sent(), now])).catch(function (err) { return log($, "waits not stopped: ".concat(String(err))); });
                _23.label = 21;
            case 21:
                for (_7 = 0, moved_1 = moved; _7 < moved_1.length; _7++) {
                    owner = moved_1[_7];
                    jobNews.set(owner, now);
                }
                if (!moved.size) return [3 /*break*/, 23];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (moved.has(one.id) ? __assign(__assign({}, one), { newAt: now }) : one); }); })
                    // A command that ended leaves its row at once; new output alone waits for the panel's next calm drawing (calmLook, every CALM while
                    // work runs): drawn afresh at each output, seven tasks' commands drew the panel without a pause and no click held (16 Nov)
                ];
            case 22:
                _23.sent();
                _23.label = 23;
            case 23:
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
// The memory a followed process and all it started hold, as the processes were last listed
var memSeen = function (pid) {
    var tree = pid && jobProcs.length ? treeOf(jobProcs, pid) : [];
    var mem = memOf(tree);
    // (and in KB, so the programs of one command are added up exactly)
    return mem ? { mem: mem, memKb: tree.reduce(function (sum, p) { var _a; return sum + ((_a = p.rss) !== null && _a !== void 0 ? _a : 0); }, 0) } : {};
};
var spans = [];
var SPANS_KEPT = 300;
var SPAN_KEPT_FOR = 2 * 60000;
// The commands of work still running, by their call, and every process already made a run, so none is added twice
var openCalls = new Map();
var adopted = new Set();
// The groups each command still running is seen to hold, as the processes are listed: its own shell's and those of all under it, so
// what it leaves is tied to it by its group and to no other command (leftoversOf). A shell is one command's only
var isOpenSpan = function (s) { return Boolean(s.bgId) && s.until === undefined; };
var seeGroups = function (procs) {
    var _a;
    var shells = function () { return new Set(__spreadArray(__spreadArray([], openCalls.values(), true), spans, true).flatMap(function (one) { var _a; return (((_a = one.groups) === null || _a === void 0 ? void 0 : _a[0]) ? [one.groups[0]] : []); })); };
    for (var _i = 0, _b = openCalls.values(); _i < _b.length; _i++) {
        var call = _b[_i];
        var groups = call.cmd ? groupsOf(procs, { cmd: call.cmd, at: call.at, from: call.from, groups: call.groups }, call.groups ? undefined : shells()) : undefined;
        if (groups)
            call.groups = groups;
    }
    var _loop_8 = function (span) {
        var groups = groupsOf(procs, span, span.groups ? undefined : shells());
        if (groups && groups.length !== ((_a = span.groups) === null || _a === void 0 ? void 0 : _a.length))
            spans = spans.map(function (s) { return (s.id === span.id ? __assign(__assign({}, s), { groups: groups }) : s); });
    };
    for (var _c = 0, _d = spans.filter(isOpenSpan); _c < _d.length; _c++) {
        var span = _d[_c];
        _loop_8(span);
    }
};
// A command's shell is looked for as it starts, and again a little later each time until it is seen or the command has ended: a
// short command's shell is gone long before the processes are next listed for the panel (after two minutes unseen it is left to
// the panel's own looks)
var SHELL_LOOKS = __spreadArray([0, 60, 200, 600, 2000, 5000], Array.from({ length: 8 }, function () { return JOB_PS; }), true);
var isOpenCall = function (id) { return openCalls.has(id) || spans.some(function (s) { return s.id === id && isOpenSpan(s); }); };
var groupsSeen = function (id) { var _a, _b, _c; return (_b = (_a = openCalls.get(id)) === null || _a === void 0 ? void 0 : _a.groups) !== null && _b !== void 0 ? _b : (_c = spans.find(function (s) { return s.id === id; })) === null || _c === void 0 ? void 0 : _c.groups; };
var seeShell = function ($, id, n) {
    var _a;
    if (n === void 0) { n = 0; }
    var look = function () { return __awaiter(_this, void 0, void 0, function () {
        var r, _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!isOpenCall(id) || groupsSeen(id))
                        return [2 /*return*/];
                    return [4 /*yield*/, $.process.run(['sh', '-c', "printf '@@SHELLS@@\\n'; ps -axww -o ".concat(PS_COLUMNS)], { timeoutMs: 5000 }).catch(function () { return undefined; })];
                case 1:
                    r = _e.sent();
                    if (!((r === null || r === void 0 ? void 0 : r.exitCode) === 0 && r.stdout.includes('@@SHELLS@@'))) return [3 /*break*/, 3];
                    _a = seeGroups;
                    _b = procsOf;
                    _c = [(_d = r.stdout.split('@@SHELLS@@\n')[1]) !== null && _d !== void 0 ? _d : ''];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, _c.concat([_e.sent()]))]);
                    _e.label = 3;
                case 3:
                    if (isOpenCall(id) && !groupsSeen(id) && n + 1 < SHELL_LOOKS.length)
                        seeShell($, id, n + 1);
                    return [2 /*return*/];
            }
        });
    }); };
    var go = function () {
        var call = openCalls.get(id);
        var looking = look().catch(function (err) { return log($, "a command's shell not looked for: ".concat(String(err))); });
        // (a command that ends meanwhile waits for this look, so what it saw is kept with the command)
        if (call)
            call.looking = looking;
    };
    var wait = (_a = SHELL_LOOKS[n]) !== null && _a !== void 0 ? _a : 0;
    if (wait)
        $.clock.after(wait, go);
    else
        go();
};
var pruneSpans = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var list, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!spans.some(function (s) { return s.bgId && s.until === undefined; })) return [3 /*break*/, 2];
                return [4 /*yield*/, read($, todos)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = [];
                _b.label = 3;
            case 3:
                list = _a;
                spans = spans.map(function (s) { return (s.bgId && s.until === undefined && !list.some(function (one) { var _a; return (_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return b.id === s.bgId; }); }) ? __assign(__assign({}, s), { until: now }) : s); });
                if (spans.some(function (s) { return s.until !== undefined && now - s.until > SPAN_KEPT_FOR; }))
                    spans = spans.filter(function (s) { return s.until === undefined || now - s.until <= SPAN_KEPT_FOR; });
                return [2 /*return*/];
        }
    });
}); };
// The newest process number on this Mac, as a shell started now is handed it; 0 where it cannot be told
var pidNow = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r, n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['sh', '-c', 'echo $$ # pid now'], { timeoutMs: 3000 }).catch(function () { return undefined; })];
            case 1:
                r = _a.sent();
                n = Number(r === null || r === void 0 ? void 0 : r.stdout.trim());
                return [2 /*return*/, Number.isInteger(n) && n > 1 ? n : 0];
        }
    });
}); };
// A piece of work's Bash call has ended (or gone to the background): kept by the numbers handed out while it ran, and what a
// command that has ended left going is followed at once
var keepSpan = function ($, agent, call, from, at, result, held) { return __awaiter(_this, void 0, void 0, function () {
    var to, now, command, bgId, isBackground, span, rest, open, r, procs;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (call.tool !== 'Bash' || !from)
                    return [2 /*return*/];
                return [4 /*yield*/, pidNow($)];
            case 1:
                to = _f.sent();
                openCalls.delete(String((_a = call.tool_use_id) !== null && _a !== void 0 ? _a : ''));
                return [4 /*yield*/, (held === null || held === void 0 ? void 0 : held.looking)];
            case 2:
                _f.sent();
                if (!to)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _f.sent();
                command = String((_b = call.command) !== null && _b !== void 0 ? _b : '');
                // Started on another Mac over ssh, what it leaves runs there
                if (/^\s*(\S*\/)?ssh\b/.test(command))
                    return [2 /*return*/];
                bgId = result === null || result === void 0 ? void 0 : result.backgroundTaskId;
                isBackground = Boolean(call.run_in_background) && typeof bgId === 'string';
                span = __assign(__assign({ id: String((_c = call.tool_use_id) !== null && _c !== void 0 ? _c : now), agent: agent, what: oneLine(String((_d = call.description) !== null && _d !== void 0 ? _d : '')).slice(0, 160), cmd: oneLine(command).slice(0, 4000), from: from, to: to, at: at, endAt: now }, ((held === null || held === void 0 ? void 0 : held.groups) ? { groups: held.groups } : {})), (isBackground ? { bgId: String(bgId) } : { until: now }));
                rest = __spreadArray(__spreadArray([], spans.filter(function (s) { return s.id !== span.id; }), true), [span], false);
                open = rest.filter(function (s) { return s.bgId && s.until === undefined; });
                spans = __spreadArray(__spreadArray([], open, true), rest.filter(function (s) { return !(s.bgId && s.until === undefined); }).slice(-Math.max(0, SPANS_KEPT - open.length)), true).sort(function (a, b) { return a.at - b.at; });
                if (call.run_in_background)
                    return [2 /*return*/];
                return [4 /*yield*/, $.process.run(['sh', '-c', "printf '@@LEFT@@\\n'; ps -axww -o ".concat(PS_COLUMNS)], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 4:
                r = _f.sent();
                if (!r || r.exitCode !== 0 || !r.stdout.includes('@@LEFT@@'))
                    return [2 /*return*/];
                procs = procsOf((_e = r.stdout.split('@@LEFT@@\n')[1]) !== null && _e !== void 0 ? _e : '', now);
                // Among every command kept, so a run held back while another ran goes to its own
                return [4 /*yield*/, adoptLeft($, procs, now)];
            case 5:
                // Among every command kept, so a run held back while another ran goes to its own
                _f.sent();
                return [2 /*return*/];
        }
    });
}); };
// Whose each process is, by its environment: `mine` where it carries this chat's session (every command the engine runs for this
// chat does, and all it starts), `other` where its environment is there without it, `hidden` where it cannot be read
var ownersOf = function ($, pids) { return __awaiter(_this, void 0, void 0, function () {
    var sid, out, script, r, _i, _a, line, _b, _c, pid, _d, who_1;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 1:
                sid = _f.sent();
                out = new Map();
                if (!sid || !pids.length)
                    return [2 /*return*/, out];
                script = "sid=$1; shift; for p; do if [ -r \"/proc/$p/environ\" ]; then e=$(tr '\\0' '\\n' < \"/proc/$p/environ\" 2>/dev/null); else e=$(ps -E -ww -o command= -p \"$p\" 2>/dev/null | tr ' ' '\\n'); fi; if printf '%s\\n' \"$e\" | grep -qxF \"CLAUDE_CODE_SESSION_ID=$sid\"; then echo \"$p mine\"; elif printf '%s\\n' \"$e\" | grep -qE '^(HOME|PATH|USER)='; then echo \"$p other\"; else echo \"$p hidden\"; fi; done # whose runs";
                return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', script, 'sh', sid], pids.filter(isPid), true), { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 2:
                r = _f.sent();
                for (_i = 0, _a = (_e = r === null || r === void 0 ? void 0 : r.stdout.split('\n')) !== null && _e !== void 0 ? _e : []; _i < _a.length; _i++) {
                    line = _a[_i];
                    _b = line.trim().split(' '), _c = _b[0], pid = _c === void 0 ? '' : _c, _d = _b[1], who_1 = _d === void 0 ? '' : _d;
                    if (who_1 === 'mine' || who_1 === 'other' || who_1 === 'hidden')
                        out.set(pid, who_1);
                }
                return [2 /*return*/, out];
        }
    });
}); };
// What commands left going becomes runs on their cards: each topmost process, in its command's words; its log where its output
// goes to a file, so its progress line is read as any other
var adoptLeft = function ($, procs, now, only) { return __awaiter(_this, void 0, void 0, function () {
    var list, _loop_9, _i, adopted_1, pid, known, found, whose, spanOfLeft, isTheirs, left, _a, found_1, l, fd, logs, added, _loop_10, _b, left_1, one, _c, added_1, _d, agent, runs_2;
    var _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, read($, todos)
                // A process number gone from the list may be handed out again: it no longer stands for a run made already
            ];
            case 1:
                list = _j.sent();
                _loop_9 = function (pid) {
                    if (!procs.some(function (p) { return p.pid === pid; }))
                        adopted.delete(pid);
                };
                // A process number gone from the list may be handed out again: it no longer stands for a run made already
                for (_i = 0, adopted_1 = adopted; _i < adopted_1.length; _i++) {
                    pid = adopted_1[_i];
                    _loop_9(pid);
                }
                known = new Set(__spreadArray(__spreadArray([], adopted, true), list.flatMap(function (one) { var _a; return ((_a = one.detached) !== null && _a !== void 0 ? _a : []).flatMap(function (d) { return (d.pid ? [d.pid] : []); }); }), true));
                found = leftoversOf(procs, only !== null && only !== void 0 ? only : spans, known, __spreadArray([], openCalls.values(), true));
                if (!found.length)
                    return [2 /*return*/];
                return [4 /*yield*/, ownersOf($, found.map(function (l) { return l.top.pid; }))];
            case 2:
                whose = _j.sent();
                spanOfLeft = function (l) { var _a; return (_a = spans.find(function (s) { return s.id === l.span; })) !== null && _a !== void 0 ? _a : only === null || only === void 0 ? void 0 : only.find(function (s) { return s.id === l.span; }); };
                isTheirs = function (l) { var _a, _b; return whose.get(l.top.pid) === 'other' || (whose.get(l.top.pid) === 'hidden' && !isNamedBy(l.top.command, (_b = (_a = spanOfLeft(l)) === null || _a === void 0 ? void 0 : _a.cmd) !== null && _b !== void 0 ? _b : '')); };
                left = found.filter(function (l) { return !isTheirs(l); });
                for (_a = 0, found_1 = found; _a < found_1.length; _a++) {
                    l = found_1[_a];
                    if (isTheirs(l))
                        adopted.add(l.top.pid);
                }
                if (!left.length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.process
                        .run(__spreadArray(['sh', '-c', 'for p; do f=$(readlink "/proc/$p/fd/1" 2>/dev/null || lsof -a -p "$p" -d 1 -Fn 2>/dev/null | sed -n "s/^n//p" | head -1); printf "%s %s\\n" "$p" "$f"; done', 'sh'], left.map(function (l) { return l.top.pid; }), true), { timeoutMs: 5000 })
                        .catch(function () { return undefined; })];
            case 3:
                fd = _j.sent();
                logs = new Map(((_e = fd === null || fd === void 0 ? void 0 : fd.stdout.split('\n')) !== null && _e !== void 0 ? _e : []).map(function (line) { var _a; return [(_a = line.split(' ')[0]) !== null && _a !== void 0 ? _a : '', line.split(' ').slice(1).join(' ').trim()]; }));
                added = new Map();
                _loop_10 = function (one) {
                    var span = (_f = spans.find(function (s) { return s.id === one.span; })) !== null && _f !== void 0 ? _f : only === null || only === void 0 ? void 0 : only.find(function (s) { return s.id === one.span; });
                    if (!span || !list.some(function (card) { return card.id === span.agent; }))
                        return "continue";
                    var file = (_g = logs.get(one.top.pid)) !== null && _g !== void 0 ? _g : '';
                    var log_1 = file.startsWith('/') && !file.startsWith('/dev/') ? file : '';
                    // Named by the command that left it, in the words the work gave it, never by the program it runs: the person reads what it is
                    // doing, not "Run Google Chrome" or "Run torch_shm_manager"; what one command left is one row (foldJobs)
                    var what = span.what || labelOf('', span.cmd);
                    adopted.add(one.top.pid);
                    added.set(span.agent, __spreadArray(__spreadArray([], ((_h = added.get(span.agent)) !== null && _h !== void 0 ? _h : []), true), [__assign({ id: "left-".concat(one.top.pid, "-").concat(span.id), what: what, at: Math.min(now, Math.max(span.at, one.top.startAt)), cmd: oneLine(one.top.command).slice(0, 400), log: log_1, pid: one.top.pid, isLeft: true }, (span.bgId ? { from: span.bgId } : {}))], false));
                };
                for (_b = 0, left_1 = left; _b < left_1.length; _b++) {
                    one = left_1[_b];
                    _loop_10(one);
                }
                if (!added.size)
                    return [2 /*return*/];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { var _a, _b; return (added.has(one.id) ? __assign(__assign({}, one), { detached: __spreadArray(__spreadArray([], ((_a = one.detached) !== null && _a !== void 0 ? _a : []).filter(function (d) { var _a; return !((_a = added.get(one.id)) === null || _a === void 0 ? void 0 : _a.some(function (a) { return a.id === d.id; })); }), true), ((_b = added.get(one.id)) !== null && _b !== void 0 ? _b : []), true).slice(-BG_KEPT) }) : one); }); })];
            case 4:
                _j.sent();
                _c = 0, added_1 = added;
                _j.label = 5;
            case 5:
                if (!(_c < added_1.length)) return [3 /*break*/, 8];
                _d = added_1[_c], agent = _d[0], runs_2 = _d[1];
                return [4 /*yield*/, log($, "work ".concat(agent, " left ").concat(runs_2.length, " run(s) going: ").concat(runs_2.map(function (r) { return r.what; }).join(' / ').slice(0, 160)))];
            case 6:
                _j.sent();
                _j.label = 7;
            case 7:
                _c++;
                return [3 /*break*/, 5];
            case 8:
                jobsLookedAt = 0;
                void drawFresh($);
                return [2 /*return*/];
        }
    });
}); };
// A short time since, for a row's side: seconds, minutes, or hours and minutes
var shortAgo = function (ms) {
    var all = Math.max(0, Math.floor(ms / 1000));
    return all < 60 ? "".concat(all, "s") : all < 3600 ? "".concat(Math.floor(all / 60), "m") : "".concat(Math.floor(all / 3600), "h ").concat(String(Math.floor(all / 60) % 60).padStart(2, '0'), "m");
};
// A process's command against a pattern as pgrep -f reads it: a regular expression, or the words themselves when it is none
var isLike = function (command, pattern) {
    try {
        return new RegExp(pattern).test(command);
    }
    catch (_a) {
        return command.includes(pattern);
    }
};
// A press on Stop on a run's row ends it: a command sent to the background is stopped as the engine stops one, a command started
// detached or left going has its process and all it started ended, a command held open has its shell's processes ended (the work's
// call then comes back with it ended). The work is told in its own chat that the person stopped it as stuck, and what to do next.
// On this Mac only, as the processes are this Mac's
var canStopJob = function (job) { return !isRunFromAfar && !job.id.startsWith('more-') && !job.id.startsWith('held-'); };
var stoppingJobs = new Set();
var RUN_STOPPED = function (what, silent) {
    return silent
        ? "".concat(who(true), " stopped your command \"").concat(what, "\" from the panel because it looked stuck: it had printed nothing for ").concat(silent, ". A command must never be stuck or silent. Don't start it again as it was: find out why it stalled, make it print a plain `progress:` line at least every 10 seconds, and start it again only if it is still needed.")
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
// A run that only watches (a tail or grep left going) outlives what it watches once no run of its work, the work above it or the
// helpers under that one still goes, or once its work has ended: it is stopped then, and its work told while it is at work
var WATCHER_STOPPED = function (what) { return "Claudopus stopped your command \"".concat(what, "\": it only watched commands that have all ended. Don't start a command that only watches another; you are woken the moment a command of yours ends."); };
var watchersTried = new Set();
var endWatchers = function ($, list, now) { return __awaiter(_this, void 0, void 0, function () {
    var runsOf, _loop_11, _i, list_2, one;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                runsOf = function (one) { var _a, _b; return __spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; }).map(function (b) { var _a; return ({ id: b.id, cmd: (_a = b.cmd) !== null && _a !== void 0 ? _a : '' }); }), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []).map(function (d) { return ({ id: d.id, cmd: d.cmd }); }), true); };
                _loop_11 = function (one) {
                    var watchers, top_1, tree, isWatched_1, _loop_12, _e, watchers_1, run;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
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
                                _loop_12 = function (run) {
                                    var job;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0:
                                                job = (_a = jobsOf(one, now).find(function (j) { return j.id === run.id; })) !== null && _a !== void 0 ? _a : jobsOf(__assign(__assign({}, one), { bg: (_b = one.bg) === null || _b === void 0 ? void 0 : _b.filter(function (b) { return b.id === run.id; }), detached: (_c = one.detached) === null || _c === void 0 ? void 0 : _c.filter(function (d) { return d.id === run.id; }), running: undefined }), now)[0];
                                                if (!job || now - job.at < 60000)
                                                    return [2 /*return*/, "continue"];
                                                // (tried once: one that cannot be stopped is left to its row's Stop run)
                                                watchersTried.add(job.id);
                                                stoppingJobs.add(job.id);
                                                _g.label = 1;
                                            case 1:
                                                _g.trys.push([1, , 3, 4]);
                                                return [4 /*yield*/, stopping($, one.id, job, one.status === 'working' ? WATCHER_STOPPED(job.label) : '')];
                                            case 2:
                                                _g.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                stoppingJobs.delete(job.id);
                                                return [7 /*endfinally*/];
                                            case 4: return [4 /*yield*/, log($, "run ".concat(job.id, " of work ").concat(one.id, " stopped: it only watched runs that have ended"))];
                                            case 5:
                                                _g.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _e = 0, watchers_1 = watchers;
                                _f.label = 1;
                            case 1:
                                if (!(_e < watchers_1.length)) return [3 /*break*/, 4];
                                run = watchers_1[_e];
                                return [5 /*yield**/, _loop_12(run)];
                            case 2:
                                _f.sent();
                                _f.label = 3;
                            case 3:
                                _e++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, list_2 = list;
                _d.label = 1;
            case 1:
                if (!(_i < list_2.length)) return [3 /*break*/, 4];
                one = list_2[_i];
                return [5 /*yield**/, _loop_11(one)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// A command of a work's or a helper's whose processes, at two looks in a row, do nothing but pass time or follow something (only a
// sleep, a log followed, a tool made to wait at the end of its tree), however its words were written: it only waits, so it is
// stopped and its work told what wakes it instead. What the words let through is caught here as it runs (a function, a nested
// shell, a sleep given by a variable). Not a Monitor watch, whose lines the work is told, nor a server
var WAITER_STOPPED = function (what) {
    return "Claudopus stopped your command \"".concat(what, "\": all it did was wait, and nothing you start may only wait. Your own commands wake you the moment they end, and each helper's result comes to you as a message: carry on, or end your step. For a file, a page or a time that nothing of yours makes, a task calls `wake_me`; a helper hands back what it waits for.");
};
// What each run's processes have shown at the looks: since when they only waited, the sleeps seen, and whether they ever did work.
// A run that ever did work is never stopped (a script that sleeps between its steps, a retry, a deploy that waits for a service);
// one is stopped only when, at every look over a minute, it did nothing but pass time, by sleeps that came and went (a loop) or one
// that has run two minutes
var waiterSeen = new Map();
var workSeen = new Set();
var WAITER_FOR = 60000;
var WAITER_LONE = 120000;
var endWaiters = function ($, list, now) { return __awaiter(_this, void 0, void 0, function () {
    var allBgs, shells, runs, _loop_13, _i, _a, id, _loop_14, _b, workSeen_1, id, _loop_15, _c, runs_3, run;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                allBgs = list.flatMap(function (one) { var _a; return (one.chat || one.status !== 'working' ? [] : ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { var _a; return !b.isWatch && !SERVER_CMD.test((_a = b.cmd) !== null && _a !== void 0 ? _a : '') && describedOf(b.what).kind !== 'server'; })); });
                shells = allBgs.length ? shellsOf(jobProcs, allBgs.map(function (b) { var _a; return ({ id: b.id, cmd: (_a = b.cmd) !== null && _a !== void 0 ? _a : '', at: b.at }); })) : new Map();
                runs = list.flatMap(function (one) {
                    var _a, _b;
                    if (one.chat || one.status !== 'working')
                        return [];
                    var bgs = allBgs.filter(function (b) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).includes(b); });
                    return __spreadArray(__spreadArray(__spreadArray([], bgs.flatMap(function (b) { return (typeof shells.get(b.id) === 'string' ? [{ owner: one, id: b.id, pid: shells.get(b.id) }] : []); }), true), ((_a = one.detached) !== null && _a !== void 0 ? _a : []).filter(function (d) { return d.pid && !SERVER_CMD.test(d.cmd) && describedOf(d.what).kind !== 'server'; }).map(function (d) { var _a; return ({ owner: one, id: d.id, pid: (_a = d.pid) !== null && _a !== void 0 ? _a : '' }); }), true), (((_b = one.running) === null || _b === void 0 ? void 0 : _b.cmd) && now - one.running.at >= ROW_SHOWN ? ((function (pid) { return (pid ? [{ owner: one, id: "call-".concat(one.id), pid: pid }] : []); })(heldShellOf(jobProcs, one.running.cmd, one.running.at))) : []), true);
                });
                _loop_13 = function (id) {
                    if (!runs.some(function (run) { return run.id === id; }))
                        waiterSeen.delete(id);
                };
                for (_i = 0, _a = waiterSeen.keys(); _i < _a.length; _i++) {
                    id = _a[_i];
                    _loop_13(id);
                }
                _loop_14 = function (id) {
                    if (!runs.some(function (run) { return run.id === id; }))
                        workSeen.delete(id);
                };
                for (_b = 0, workSeen_1 = workSeen; _b < workSeen_1.length; _b++) {
                    id = workSeen_1[_b];
                    _loop_14(id);
                }
                _loop_15 = function (run) {
                    var leaves, seen, _j, leaves_1, leaf, isLoop, job;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                if (workSeen.has(run.id))
                                    return [2 /*return*/, "continue"];
                                leaves = waiterLeavesOf(jobProcs, run.pid);
                                if (!leaves) {
                                    // (a shell with nothing under it shows nothing of what it does: neither work nor a wait)
                                    if (treeOf(jobProcs, run.pid).length > 1)
                                        (workSeen.add(run.id), waiterSeen.delete(run.id));
                                    return [2 /*return*/, "continue"];
                                }
                                seen = (_d = waiterSeen.get(run.id)) !== null && _d !== void 0 ? _d : { since: now, looks: 0, sleepers: new Set(), longest: 0 };
                                seen.looks += 1;
                                for (_j = 0, leaves_1 = leaves; _j < leaves_1.length; _j++) {
                                    leaf = leaves_1[_j];
                                    (seen.sleepers.add(leaf.pid), (seen.longest = Math.max(seen.longest, now - leaf.startAt)));
                                }
                                waiterSeen.set(run.id, seen);
                                isLoop = seen.sleepers.size >= 3 && seen.looks >= 3 && now - seen.since >= WAITER_FOR;
                                if ((!isLoop && seen.longest < WAITER_LONE) || stoppingJobs.has(run.id))
                                    return [2 /*return*/, "continue"];
                                job = (_e = jobsOf(run.owner, now).find(function (j) { return j.id === run.id; })) !== null && _e !== void 0 ? _e : jobsOf(__assign(__assign({}, run.owner), { bg: (_f = run.owner.bg) === null || _f === void 0 ? void 0 : _f.filter(function (b) { return b.id === run.id; }), detached: (_g = run.owner.detached) === null || _g === void 0 ? void 0 : _g.filter(function (d) { return d.id === run.id; }) }), now).find(function (j) { return j.id === run.id; });
                                if (!job)
                                    return [2 /*return*/, "continue"];
                                waiterSeen.delete(run.id);
                                stoppingJobs.add(job.id);
                                _k.label = 1;
                            case 1:
                                _k.trys.push([1, , 3, 4]);
                                return [4 /*yield*/, stopping($, run.owner.id, job, WAITER_STOPPED(job.label))];
                            case 2:
                                _k.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                stoppingJobs.delete(job.id);
                                return [7 /*endfinally*/];
                            case 4: return [4 /*yield*/, log($, "run ".concat(job.id, " of ").concat(run.owner.parentId ? 'helper' : 'work', " ").concat(run.owner.id, " stopped: all it did was wait"))];
                            case 5:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _c = 0, runs_3 = runs;
                _h.label = 1;
            case 1:
                if (!(_c < runs_3.length)) return [3 /*break*/, 4];
                run = runs_3[_c];
                return [5 /*yield**/, _loop_15(run)];
            case 2:
                _h.sent();
                _h.label = 3;
            case 3:
                _c++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// (`said`: what the work is told instead of the person's stop, nothing when empty)
var stopping = function ($, owner, job, said) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, card, bg, detached, alike, marked, _i, marked_1, id, _a, marked_2, id;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _e.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _e.sent();
                card = list.find(function (one) { return one.id === owner; });
                bg = (_b = card === null || card === void 0 ? void 0 : card.bg) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.id === job.id; });
                detached = (_c = card === null || card === void 0 ? void 0 : card.detached) === null || _c === void 0 ? void 0 : _c.find(function (d) { return d.id === job.id; });
                alike = detached ? ((_d = card === null || card === void 0 ? void 0 : card.detached) !== null && _d !== void 0 ? _d : []).filter(function (d) { return d.id === detached.id || (said === undefined && leftCommandOf(d.id) !== '' && leftCommandOf(d.id) === leftCommandOf(detached.id) && d.what === detached.what); }) : [];
                marked = alike.filter(function (d) { return !stoppingJobs.has(d.id); }).map(function (d) { return d.id; });
                for (_i = 0, marked_1 = marked; _i < marked_1.length; _i++) {
                    id = marked_1[_i];
                    stoppingJobs.add(id);
                }
                _e.label = 3;
            case 3:
                _e.trys.push([3, , 5, 6]);
                return [4 /*yield*/, stoppingNow($, owner, job, said, now, card, bg, detached, alike)];
            case 4:
                _e.sent();
                return [3 /*break*/, 6];
            case 5:
                for (_a = 0, marked_2 = marked; _a < marked_2.length; _a++) {
                    id = marked_2[_a];
                    stoppingJobs.delete(id);
                }
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
var stoppingNow = function ($, owner, job, said, now, card, bg, detached, alike) { return __awaiter(_this, void 0, void 0, function () {
    var procs, _a, _b, bgShell, tops, pids, isStopped, r, r, isAlike_1, silent;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!jobProcs.length) return [3 /*break*/, 1];
                _a = jobProcs;
                return [3 /*break*/, 3];
            case 1:
                _b = procsOf;
                return [4 /*yield*/, $.process.run(['ps', '-axww', '-o', PS_COLUMNS], { timeoutMs: 5000 }).catch(function () { return ({ stdout: '' }); })];
            case 2:
                _a = _b.apply(void 0, [(_g.sent()).stdout, now]);
                _g.label = 3;
            case 3:
                procs = _a;
                bgShell = bg && !bg.isWatch && procs.length ? shellsOf(procs, [{ id: bg.id, cmd: (_c = bg.cmd) !== null && _c !== void 0 ? _c : '', at: bg.at }]).get(bg.id) : undefined;
                tops = detached ? alike.flatMap(function (d) { return (d.pid ? [d.pid] : []); }) : [(_d = (typeof bgShell === 'string' ? bgShell : undefined)) !== null && _d !== void 0 ? _d : (job.id.startsWith('call-') && ((_e = card === null || card === void 0 ? void 0 : card.running) === null || _e === void 0 ? void 0 : _e.cmd) ? heldShellOf(procs, card.running.cmd, card.running.at) : undefined)].flatMap(function (p) { return (p ? [p] : []); });
                pids = __spreadArray([], new Set(tops.flatMap(function (top) { return __spreadArray([top], treeOf(procs, top).map(function (p) { return p.pid; }), true); })), true).filter(isPid);
                isStopped = false;
                if (!bg) return [3 /*break*/, 7];
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: bg.id }).catch(function (err) { return ({ deny: String(err) }); })];
            case 4:
                r = _g.sent();
                if (!r.deny) return [3 /*break*/, 6];
                return [4 /*yield*/, log($, "run ".concat(bg.id, " not stopped by the engine: ").concat(String(r.deny)))];
            case 5:
                _g.sent();
                return [3 /*break*/, 7];
            case 6:
                isStopped = true;
                _g.label = 7;
            case 7:
                if (!pids.length) return [3 /*break*/, 11];
                return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', 'kill -TERM "$@" 2>/dev/null; sleep 2; for p; do kill -0 "$p" 2>/dev/null && kill -KILL "$p" 2>/dev/null; done; for p; do kill -0 "$p" 2>/dev/null && exit 1; done; exit 0', 'sh'], pids, true), { timeoutMs: 10000 }).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 8:
                r = _g.sent();
                if (!(r.exitCode === 0)) return [3 /*break*/, 9];
                isStopped = true;
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, log($, "run ".concat(job.id, " not wholly stopped: ").concat(String((_f = r.stderr) !== null && _f !== void 0 ? _f : '').trim().slice(0, 160)))];
            case 10:
                _g.sent();
                _g.label = 11;
            case 11:
                if (!!isStopped) return [3 /*break*/, 13];
                return [4 /*yield*/, log($, "run ".concat(job.id, " of work ").concat(owner, " could not be stopped: nothing of it was found"))];
            case 12: return [2 /*return*/, void (_g.sent())];
            case 13:
                if (!bg) return [3 /*break*/, 15];
                return [4 /*yield*/, dropBackground($, [bg.id], 'stopped')];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15:
                if (!detached) return [3 /*break*/, 17];
                isAlike_1 = function (d) { return alike.some(function (a) { return a.id === d.id; }); };
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { var _a; return (one.id === owner && ((_a = one.detached) === null || _a === void 0 ? void 0 : _a.some(isAlike_1)) ? __assign(__assign(__assign({}, one), { detached: one.detached.filter(function (d) { return !isAlike_1(d); }).length ? one.detached.filter(function (d) { return !isAlike_1(d); }) : undefined }), keepEnded(one, alike.map(function (d) { return ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'stopped' }); }))) : one); }); })];
            case 16:
                _g.sent();
                _g.label = 17;
            case 17:
                silent = job.wroteAt && !job.isEmpty ? now - job.wroteAt : now - job.at;
                if (said === undefined)
                    void tell($, owner, RUN_STOPPED(job.label, silent >= SILENT_WARN ? shortAgo(silent) : ''));
                else if (said)
                    void tell($, owner, said);
                jobLog.delete(job.id);
                silentTold.delete(job.id);
                if (said !== undefined)
                    return [2 /*return*/];
                return [4 /*yield*/, log($, "the person stopped run ".concat(job.id, " of work ").concat(owner).concat(pids.length ? " (".concat(pids.length, " processes)") : ''))];
            case 18:
                _g.sent();
                jobLog.delete(job.id);
                silentTold.delete(job.id);
                return [2 /*return*/];
        }
    });
}); };
// A run of a piece of work that has given no word for a minute is named to that work once, in its own chat: a run is never to be
// stuck or silent, so it stops it or makes it report. Not a server or a watch, which speak only when there is something to say
var RUN_ENDED = function (what, log) {
    return "Your command \"".concat(what, "\" has ended. Look at how it ended").concat(log ? " in its log, ".concat(log, ",") : '', " and carry on with the next step now.");
};
var RUNS_ENDED = function (whats) { return "Your commands ".concat(whats.map(function (what) { return "\"".concat(what, "\""); }).join(', '), " have ended. Look at how each ended in its log and carry on with the next step now."); };
var RUN_SILENT_TOLD = 60000;
var silentTold = new Set();
var RUN_SILENT = function (what, silent) {
    return "Your command \"".concat(what, "\" has printed nothing for ").concat(silent, ". Look at it now: if it is stuck, stop it (TaskStop for a background command, kill for a detached one) and find out why; if it is still working, let it finish, and make what you run next print a plain `progress:` line at least every 10 seconds.");
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
                if (one.status !== 'working')
                    return [3 /*break*/, 5];
                _a = 0, _b = jobsOf(one, now);
                _g.label = 2;
            case 2:
                if (!(_a < _b.length)) return [3 /*break*/, 5];
                job = _b[_a];
                // (not one paused, one whose output cannot be read, or the mod's own runners, which say how they go themselves)
                if (job.kind === 'server' || job.kind === 'watch' || job.id.startsWith('more-') || silentTold.has(job.id) || job.isPaused || job.isUntold || /\bbin\/(?:helpers|admin|secret|release|keyring)\b/.test(job.cmd))
                    return [3 /*break*/, 4];
                if (!job.wroteAt)
                    return [3 /*break*/, 4];
                silent = job.isEmpty ? now - job.at : now - job.wroteAt;
                if (silent < RUN_SILENT_TOLD)
                    return [3 /*break*/, 4];
                silentTold.add(job.id);
                void tell($, one.id, RUN_SILENT(job.label, shortAgo(silent)));
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
// The detached runs a piece of work stopped itself with a kill naming its process: their end wakes no one
var killedByWork = new Set();
var noteKills = function (one, command) {
    var _a;
    for (var _i = 0, _b = (_a = one === null || one === void 0 ? void 0 : one.detached) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
        var d = _b[_i];
        if (d.pid && new RegExp("\\b(?:kill|pkill)\\b(?![^;&|]*-0\\b)[^;&|]*\\b".concat(d.pid, "\\b")).test(command))
            killedByWork.add(d.id);
    }
};
// A work whose run left detached has ended: told in its chat while it is at a step, and started again with a message once its step
// has ended (its turn over, its card finished or waiting on the engine), as an answer of the person's starts it
var wakeForRun = function ($, one, runs) { return __awaiter(_this, void 0, void 0, function () {
    var first, words, isAlone, text, isAtStep, _a, r, _b;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                first = runs[0];
                if (!one || !first || isHeld(one) || one.status === 'stopped' || one.status === 'failed' || (one.status === 'done' && (one.handedBackAt !== undefined || endedByHandback.has(one.id) || one.endedAt < first.at)))
                    return [2 /*return*/];
                words = __spreadArray([], new Set(runs.map(function (d) { return runWords(d.what, d.cmd); })), true);
                isAlone = runs.length === 1 && (!leftCommandOf(first.id) || ((_e = (_d = (_c = one.endedRuns) === null || _c === void 0 ? void 0 : _c.find(function (r) { return leftCommandOf(r.id) === leftCommandOf(first.id); })) === null || _d === void 0 ? void 0 : _d.count) !== null && _e !== void 0 ? _e : 1) === 1);
                text = words.length === 1 ? RUN_ENDED((_f = words[0]) !== null && _f !== void 0 ? _f : '', isAlone ? first.log : '') : RUNS_ENDED(words);
                _a = one.status === 'working' && !one.waitsSince;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 1:
                _a = ((_g = (_h.sent()).find(function (agent) { return agent.id === one.id; })) === null || _g === void 0 ? void 0 : _g.status) === 'running';
                _h.label = 2;
            case 2:
                isAtStep = _a;
                if (!isAtStep) return [3 /*break*/, 5];
                return [4 /*yield*/, tell($, one.id, text)];
            case 3:
                _h.sent();
                return [4 /*yield*/, log($, "work ".concat(one.id, " told ").concat(runs.length, " run(s) of it ended"))];
            case 4: return [2 /*return*/, void (_h.sent())];
            case 5: return [4 /*yield*/, isReplaced($)];
            case 6:
                if (!(_h.sent())) return [3 /*break*/, 7];
                _b = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, sendOwn($, { to: { agentId: one.id }, text: text }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
            case 8:
                _b = _h.sent();
                _h.label = 9;
            case 9:
                r = _b;
                if (!!r.isDelivered) return [3 /*break*/, 11];
                return [4 /*yield*/, log($, "work ".concat(one.id, " not started again as its runs ended: ").concat(r.reason))];
            case 10: return [2 /*return*/, void (_h.sent())];
            case 11: return [4 /*yield*/, wakeCard($, one.id)];
            case 12:
                _h.sent();
                return [4 /*yield*/, log($, "work ".concat(one.id, " started again as ").concat(runs.length, " run(s) of it ended"))];
            case 13:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); };
// A run in its own words, without the time it was given when it began
var runWords = function (what, cmd) {
    if (cmd === void 0) { cmd = ''; }
    return labelOf(what, cmd).replace(/\s*\((?:about|under|over|around|up to|~)?\s*[\d.,\-– ]+\s*(?:s|sec|seconds?|m|mins?|minutes?|h|hours?)\)\s*$/i, '').trim();
};
// A press on a run's row opens a Terminal window that shows its output as it is, from its start (the last thousand lines) and as
// it goes on; on this Mac only, as the window is this Mac's
var canOpenJob = function (job) { return Boolean(jobFiles.get(job.id)) && !isRunFromAfar && !isLinux; };
var openJobOutput = function ($, job) { return __awaiter(_this, void 0, void 0, function () {
    var file, at, base, home, path, script, ready, r, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                file = jobFiles.get(job.id);
                // A press moves the buttons' keys, so the panel does not keep pulling back to this row
                presses += 1;
                drawAgain($);
                if (!file || !canOpenJob(job))
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
