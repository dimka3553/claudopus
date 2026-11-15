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
    return foldJobs(__spreadArray(__spreadArray(__spreadArray([], ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { var _a, _b; return jobOf(b.id, b.what, (_a = b.cmd) !== null && _a !== void 0 ? _a : b.what, b.at, b.isWatch, (_b = one.seenJobs) === null || _b === void 0 ? void 0 : _b[b.id]); }), true), ((_b = one.detached) !== null && _b !== void 0 ? _b : []).map(function (d) { var _a; return jobOf(d.id, d.what, d.cmd, d.at, false, (_a = one.seenJobs) === null || _a === void 0 ? void 0 : _a[d.id]); }), true), (one.status === 'working' && ((_c = one.running) === null || _c === void 0 ? void 0 : _c.cmd) && !isWaitOnly(one.running.cmd) && at - one.running.at >= RUNNING_SHOWN
        ? [jobOf("call-".concat(one.id), (_d = one.running.label) !== null && _d !== void 0 ? _d : '', one.running.cmd, one.running.at)]
        : []), true));
};
// A job's name on its row: what kind, a server's port, and its own words
// Its kind leads in words, so it is never taken for a helper, then how many alike it stands for; a wait's own "Wait" is not said
// twice
var jobHead = function (job) {
    var _a;
    if (job.id.startsWith('more-'))
        return job.label;
    var kind = "".concat(JOB_HEAD[job.kind]).concat(job.kind === 'server' && job.port ? " :".concat(job.port) : '').concat(job.count && job.count > 1 ? " \u00D7".concat(job.count) : '');
    // Its own words alone when they say its kind already (Download the CT scans, Wait for the deploy)
    if (job.isNamed && isKindSaid(job.label))
        return "".concat(job.label).concat(job.kind === 'server' && job.port && !job.label.includes(job.port) ? " :".concat(job.port) : '').concat(job.count && job.count > 1 ? " \u00D7".concat(job.count) : '');
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
    var now, list, held, _loop_1, _i, callFiles_1, _a, id, was, owned, _loop_2, _b, _c, id, _loop_3, _d, _e, owner, _loop_4, _f, _g, id, unfound, pids_1, fd, _loop_5, _h, _j, line, sid, asked, files, waits, targets, isPs, pids, mtime, home, script, r, _k, _l, body, _m, tail, _o, _p, aliveText, psText, _q, _r, alive, changed, gone, runsOf_1, bgs, shells, states, _s, shells_1, _t, id, pid, _u, owned_1, o, ended, endedAs, _v, list_1, one, _w, _x, b, targetOf, parts, isChanged, moved, _loop_6, n, _y, ended_1, id, _z, moved_1, owner;
    var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
    return __generator(this, function (_11) {
        switch (_11.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _11.sent();
                if (now - jobsLookedAt < JOB_LOOK)
                    return [2 /*return*/];
                jobsLookedAt = now;
                return [4 /*yield*/, read($, todos)
                    // Held open: a command a card has waited on long enough to be a row of its own
                ];
            case 2:
                list = _11.sent();
                held = list.flatMap(function (one) { var _a; return (one.status === 'working' && ((_a = one.running) === null || _a === void 0 ? void 0 : _a.cmd) && now - one.running.at >= RUNNING_SHOWN ? [{ owner: one.id, id: "call-".concat(one.id), cmd: one.running.cmd, at: one.running.at }] : []); });
                _loop_1 = function (id, was) {
                    if (!held.some(function (h) { return h.id === id && h.at === was.at; }))
                        (callFiles.delete(id), jobLog.delete(id));
                };
                // A row's command that changed (another held call of the same card ran longest) starts afresh
                for (_i = 0, callFiles_1 = callFiles; _i < callFiles_1.length; _i++) {
                    _a = callFiles_1[_i], id = _a[0], was = _a[1];
                    _loop_1(id, was);
                }
                owned = __spreadArray(__spreadArray(__spreadArray([], list.flatMap(function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).map(function (b) { return ({ owner: one.id, id: b.id, file: '', pid: undefined }); }); }), true), list.flatMap(function (one) { var _a; return ((_a = one.detached) !== null && _a !== void 0 ? _a : []).map(function (d) { return ({ owner: one.id, id: d.id, file: d.log, pid: d.pid }); }); }), true), held.flatMap(function (h) { var _a, _b; return (callFiles.get(h.id) ? [{ owner: h.owner, id: h.id, file: (_b = (_a = callFiles.get(h.id)) === null || _a === void 0 ? void 0 : _a.file) !== null && _b !== void 0 ? _b : '', pid: undefined }] : []); }), true);
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
                fd = _11.sent();
                _loop_5 = function (line) {
                    var _12 = line.split(' '), _13 = _12[0], pid = _13 === void 0 ? '' : _13, path = _12.slice(1);
                    var file = path.join(' ').trim();
                    var one = pids_1.find(function (p) { return p.pid === pid; });
                    if (one && /\/tasks\/[\w-]+\.output$/.test(file))
                        callFiles.set(one.id, { file: file, at: one.at });
                };
                for (_h = 0, _j = (_0 = fd === null || fd === void 0 ? void 0 : fd.stdout.split('\n')) !== null && _0 !== void 0 ? _0 : []; _h < _j.length; _h++) {
                    line = _j[_h];
                    _loop_5(line);
                }
                _11.label = 4;
            case 4:
                if (!owned.length && !unfound.length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 5:
                sid = _11.sent();
                if (sid !== tasksOf)
                    ((tasksOf = sid), (tasksDir = ''), (tasksMissedAt = 0));
                if (!(owned.some(function (o) { return !o.file; }) && !tasksDir && now - tasksMissedAt >= JOB_NEWS)) return [3 /*break*/, 7];
                return [4 /*yield*/, findTasks($)];
            case 6:
                tasksDir = _11.sent();
                if (!tasksDir)
                    tasksMissedAt = now;
                _11.label = 7;
            case 7:
                asked = owned.filter(function (o) { return o.file || tasksDir; });
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
                isPs = now - jobProcsAt >= JOB_PS;
                pids = owned.flatMap(function (o) { return (o.pid && isPid(o.pid) ? [o.pid] : []); });
                mtime = 'm=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo 0)';
                home = 'case $f in "~/"*) f="$HOME/${f#\\~/}";; esac';
                script = "n=$1; shift; i=0; for f; do i=$((i+1)); o=$f; ".concat(home, "; ").concat(mtime, "; if [ $i -le $n ]; then printf '\\n@@JOB@@ %s %s\\n' \"$m\" \"$f\"; tail -c ").concat(JOB_TAIL, " \"$f\" 2>/dev/null; else printf '\\n@@AT@@ %s %s' \"$m\" \"$o\"; fi; done; printf '\\n@@ALIVE@@'; for p in ").concat(pids.map(function (p) { return p.replace(/\D/g, ''); }).join(' '), "; do kill -0 \"$p\" 2>/dev/null && printf ' %s' \"$p\"; done; printf '\\n'").concat(isPs ? "; printf '@@PS@@\\n'; ps -axww -o pid=,ppid=,stat=,etime=,command=" : '');
                return [4 /*yield*/, $.process.run(__spreadArray(__spreadArray(['sh', '-c', script, 'sh', String(files.length)], files, true), targets, true), { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 8:
                r = _11.sent();
                if (!r)
                    return [2 /*return*/];
                _k = r.stdout.split('\n@@ALIVE@@'), _l = _k[0], body = _l === void 0 ? '' : _l, _m = _k[1], tail = _m === void 0 ? '' : _m;
                _o = tail.split('@@PS@@\n'), _p = _o[0], aliveText = _p === void 0 ? '' : _p, psText = _o[1];
                if (!(psText !== undefined)) return [3 /*break*/, 10];
                _q = procsOf;
                _r = [psText];
                return [4 /*yield*/, $.clock.now()];
            case 9:
                ((jobProcs = _q.apply(void 0, _r.concat([_11.sent()]))), (jobProcsAt = now));
                _11.label = 10;
            case 10:
                alive = new Set(aliveText.trim().split(/\s+/).filter(Boolean));
                changed = new Map(__spreadArray([], body.matchAll(/\n@@AT@@ (\d+) ([^\n]*)/g), true).map(function (m) { var _a; return [(_a = m[2]) !== null && _a !== void 0 ? _a : '', Number(m[1]) * 1000]; }));
                gone = owned.filter(function (o) { return o.pid && !alive.has(o.pid); }).map(function (o) { return o.id; });
                if (!(gone.length && /@@ALIVE@@/.test(r.stdout))) return [3 /*break*/, 12];
                runsOf_1 = function (one) { var _a; return ((_a = one.detached) !== null && _a !== void 0 ? _a : []).filter(function (d) { return gone.includes(d.id); }).map(function (d) { return ({ id: d.id, what: d.what, at: d.at, endedAt: now, how: 'ended' }); }); };
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { var _a; return (((_a = one.detached) === null || _a === void 0 ? void 0 : _a.some(function (d) { return gone.includes(d.id); })) ? __assign(__assign(__assign({}, one), { detached: one.detached.filter(function (d) { return !gone.includes(d.id); }).length ? one.detached.filter(function (d) { return !gone.includes(d.id); }) : undefined }), keepEnded(one, runsOf_1(one))) : one); }); })];
            case 11:
                _11.sent();
                void drawFresh($);
                _11.label = 12;
            case 12:
                bgs = list.flatMap(function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !b.isWatch; }).map(function (b) { var _a; return ({ id: b.id, cmd: (_a = b.cmd) !== null && _a !== void 0 ? _a : '', at: b.at }); }); });
                shells = jobProcs.length ? shellsOf(jobProcs, bgs) : new Map();
                states = new Map();
                for (_s = 0, shells_1 = shells; _s < shells_1.length; _s++) {
                    _t = shells_1[_s], id = _t[0], pid = _t[1];
                    if (typeof pid === 'string')
                        states.set(id, treeOf(jobProcs, pid).some(isPausedProc));
                    if (pid)
                        shellMissed.delete(id);
                    else if (psText !== undefined && __spreadArray([], shells.values(), true).some(Boolean))
                        shellMissed.set(id, ((_1 = shellMissed.get(id)) !== null && _1 !== void 0 ? _1 : 0) + 1);
                }
                for (_u = 0, owned_1 = owned; _u < owned_1.length; _u++) {
                    o = owned_1[_u];
                    if (o.pid)
                        states.set(o.id, treeOf(jobProcs, o.pid).some(isPausedProc));
                }
                ended = bgs.filter(function (b) { var _a; return ((_a = shellMissed.get(b.id)) !== null && _a !== void 0 ? _a : 0) >= 2 && now - b.at >= 60000; }).map(function (b) { return b.id; });
                endedAs = {};
                // A watch well past the time limit the engine set it has ended, whether or not its last line was read
                for (_v = 0, list_1 = list; _v < list_1.length; _v++) {
                    one = list_1[_v];
                    for (_w = 0, _x = (_2 = one.bg) !== null && _2 !== void 0 ? _2 : []; _w < _x.length; _w++) {
                        b = _x[_w];
                        if (b.isWatch && b.expiresAt && now - b.expiresAt >= WATCH_GRACE && !ended.includes(b.id))
                            (ended.push(b.id), (endedAs[b.id] = 'timed out'));
                    }
                }
                targetOf = function (wait) {
                    var _a;
                    var runs = wait.pattern
                        ? jobProcs.filter(function (p) { var _a; return isLike(p.command, (_a = wait.pattern) !== null && _a !== void 0 ? _a : '') && !/shell-snapshots\/snapshot-/.test(p.command) && !/^(\S*\/)?pgrep\s/.test(p.command); })
                        : wait.pid
                            ? jobProcs.filter(function (p) { return p.pid === wait.pid; })
                            : undefined;
                    if (runs && jobProcs.length) {
                        if (!runs.length)
                            return wait.isStart ? '' : 'what it waits for has ended';
                        if (runs.some(function (p) { return treeOf(jobProcs, p.pid).some(isPausedProc); }))
                            return 'what it waits for is paused';
                    }
                    var at = wait.file ? changed.get(wait.file) : undefined;
                    return at && now - at >= JOB_QUIET ? "".concat((_a = wait.file) === null || _a === void 0 ? void 0 : _a.split('/').at(-1), " unchanged ").concat(shortAgo(now - at)) : '';
                };
                parts = body.split(/\n@@JOB@@ ([^\n]*)\n/);
                isChanged = false;
                moved = new Set();
                _loop_6 = function (n) {
                    // The outputs come back in the order they were asked for, each after when it last changed
                    var job = asked[(n - 1) / 2];
                    var id = (_3 = job === null || job === void 0 ? void 0 : job.id) !== null && _3 !== void 0 ? _3 : '';
                    var text = (_5 = ((_4 = parts[n + 1]) !== null && _4 !== void 0 ? _4 : '').split('\n@@AT@@ ')[0]) !== null && _5 !== void 0 ? _5 : '';
                    var m = Number((_7 = (_6 = parts[n]) === null || _6 === void 0 ? void 0 : _6.split(' ')[0]) !== null && _7 !== void 0 ? _7 : 0) * 1000;
                    // One that ended, by the engine's last line on its output, and when: as that output last changed
                    var end = (job === null || job === void 0 ? void 0 : job.pid) ? undefined : runEndOf(text);
                    if (end)
                        (ended.includes(id) || ended.push(id), (endedAs[id] = __assign(__assign({}, end), (m ? { at: m } : {}))));
                    // An output that is there but holds nothing has printed nothing yet: its time is when it was made, not when it last wrote (on
                    // 15 Nov such rows read "updated 9m ago" for runs that sent all they printed elsewhere)
                    var seen = __assign(__assign({}, latestOf(text)), (m && !text.trim() ? { isEmpty: true } : {}));
                    var was = jobLog.get(id);
                    var wait = waits.find(function (w) { return w.id === id; });
                    // The work's own progress line, once seen, stands until a newer one or other progress comes, however much it writes between
                    var kept = !seen.pct && !seen.done && (was === null || was === void 0 ? void 0 : was.isOwn) ? { pct: was.pct, done: was.done, total: was.total, isOwn: true, isEarlier: true } : {};
                    var next = __assign(__assign(__assign(__assign(__assign(__assign({}, seen), { tail: tailOf(text) }), kept), (m ? { wroteAt: m } : {})), (states.has(id) ? { isPaused: states.get(id) } : (was === null || was === void 0 ? void 0 : was.isPaused) ? { isPaused: true } : {})), (wait ? { target: targetOf(wait.wait) } : {}));
                    var isSame = (was === null || was === void 0 ? void 0 : was.latest) === next.latest && (was === null || was === void 0 ? void 0 : was.pct) === next.pct && (was === null || was === void 0 ? void 0 : was.done) === next.done && (was === null || was === void 0 ? void 0 : was.total) === next.total && (was === null || was === void 0 ? void 0 : was.rate) === next.rate && (was === null || was === void 0 ? void 0 : was.left) === next.left && (was === null || was === void 0 ? void 0 : was.isEmpty) === next.isEmpty && (was === null || was === void 0 ? void 0 : was.isEarlier) === next.isEarlier && (was === null || was === void 0 ? void 0 : was.wroteAt) === next.wroteAt && (was === null || was === void 0 ? void 0 : was.isPaused) === next.isPaused && (was === null || was === void 0 ? void 0 : was.target) === next.target && ((_8 = was === null || was === void 0 ? void 0 : was.tail) === null || _8 === void 0 ? void 0 : _8.join('\n')) === ((_9 = next.tail) === null || _9 === void 0 ? void 0 : _9.join('\n'));
                    if (isSame)
                        return "continue";
                    jobLog.set(id, next);
                    isChanged = true;
                    var owner = job === null || job === void 0 ? void 0 : job.owner;
                    if (seen.latest && owner && was && was.latest !== seen.latest && now - ((_10 = jobNews.get(owner)) !== null && _10 !== void 0 ? _10 : 0) >= JOB_NEWS)
                        moved.add(owner);
                };
                for (n = 1; n + 1 < parts.length; n += 2) {
                    _loop_6(n);
                }
                if (!ended.length) return [3 /*break*/, 14];
                return [4 /*yield*/, dropBackground($, ended, endedAs)];
            case 13:
                _11.sent();
                for (_y = 0, ended_1 = ended; _y < ended_1.length; _y++) {
                    id = ended_1[_y];
                    (jobLog.delete(id), shellMissed.delete(id));
                }
                isChanged = true;
                _11.label = 14;
            case 14:
                for (_z = 0, moved_1 = moved; _z < moved_1.length; _z++) {
                    owner = moved_1[_z];
                    jobNews.set(owner, now);
                }
                if (!moved.size) return [3 /*break*/, 16];
                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (one) { return (moved.has(one.id) ? __assign(__assign({}, one), { newAt: now }) : one); }); })];
            case 15:
                _11.sent();
                _11.label = 16;
            case 16:
                if (isChanged)
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
                script = ['#!/bin/zsh', "print -r -- $'\\e[2m'".concat(zshQuoted("".concat(job.label, " \u00B7 ").concat(file)), "$'\\e[0m'"), "[[ -e ".concat(path, " ]] || print -r -- 'Its output is not there (yet): this window shows it once it is written.'"), "exec tail -n 1000 -F ".concat(path), ''].join('\n');
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
