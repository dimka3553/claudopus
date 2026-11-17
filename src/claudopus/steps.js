// Steps that could have gone out together: after each step of work, a line in its next request when the step shows a pattern that
// costs time (a helper started alone, a run of single lookups, long runs of one kind one after another, a step of only to-dos, a
// commit with no second look started), and a regular look at the helpers a piece of work has running
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
// The calls that keep the card and the memory: they ride along with a work call and are never a step's work
var BOOK = ['todo', 'note', 'update', 'waits', 'recall', 'ask'];
var isBook = function (tool) { return BOOK.some(function (name) { return isTool(tool, name); }) || tool === 'ToolSearch' || tool === 'TodoWrite'; };
// A lookup: a read of one file or one search, which a step can send several of at once
var LOOKUP_TOOLS = ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];
var LOOKUP_COMMAND = /^\s*(?:cd \S+ && )?(?:cat|head|tail|less|wc|ls|rg|grep|find|sed -n|jq|git (?:-C \S+ )?(?:log|show|diff|status|blame|grep))\b/;
var isLookup = function (tool, input) { var _a; return LOOKUP_TOOLS.includes(tool) || (tool === 'Bash' && !(input === null || input === void 0 ? void 0 : input.run_in_background) && LOOKUP_COMMAND.test(String((_a = input === null || input === void 0 ? void 0 : input.command) !== null && _a !== void 0 ? _a : ''))); };
// The wait for helpers, which is no run of its own
var WAIT_RUN = /\/bin\/helpers['"]? /;
// A commit: what a second look, pictures and docs can start from
var COMMIT = /\bgit (?:-C \S+ )?commit\b/;
// A helper that looks for what is wrong: a second look
var CHECKER = /\b(check|checks|review|second look|look for what|what is wrong|verify|audit)\b/i;
// Single lookups in a row before a line says to send them together
var LOOKUPS_IN_A_ROW = 3;
// A run this long is a long one; two of one kind in a row, each alone in its step, could have run side by side
var LONG_RUN = 60000;
// The most lines of each kind one agent is told
var LINES_EACH = 2;
// What a step sends back, in the words the work reads
var HELPER_ALONE = 'That step started one helper and nothing else. The helper runs in the background and its result comes to you when it ends, so continue now with what needs nothing from it. Next time, send in the same step every call that needs nothing from the helper: other helpers, your own part, the second look, notes.';
var LOOKUP_RUN = function (n) {
    return "The last ".concat(n, " steps each held one lookup. Send the lookups you already know you need together in one step. When you need only the conclusion of reading or searching across many files, send that to a helper, which keeps your context small. Read a single file you know yourself.");
};
var SERIAL_RUNS = function (what) {
    return "Two long commands of one kind (".concat(what, ") ran one after the other, each alone in its step. When they don't depend on each other, run them side by side: each in its own throwaway chat, worktree, terminal session or background command, or each as a helper, all started in one step.");
};
var BOOK_ALONE = 'That step held only to-do and note calls. They cost a turn of their own: send them in the same step as your next working call.';
var LOOK_NOW = 'You committed. The second look, the pictures and the docs need nothing more than this: start them now, as helpers in the same step as your next calls, not after the rest is done.';
// Per agent: its single lookups in a row, the last long run's kind, and how many of each line it was told
var stepsSeen = new Map();
// When each call began, by call id, to tell a long run
var callStarts = new Map();
var STEPS_KEPT = 400;
var callStarted = function (id, at) {
    var _a;
    callStarts.set(id, at);
    if (callStarts.size > 2000)
        callStarts.delete((_a = callStarts.keys().next().value) !== null && _a !== void 0 ? _a : '');
};
// The kind of a long command: its first two words, a test run or a capture alike
var kindOf = function (command) { return oneLine(command.replace(/^\s*cd \S+ && /, '')).split(' ').slice(0, 2).join(' '); };
// What one step of an agent tells it, in the order the patterns are looked at; at most LINES_EACH of each kind per agent
var stepLines = function (agent, calls, isTop) {
    var _a, _b, _c, _d;
    if (isTop === void 0) { isTop = true; }
    var seen = (_a = stepsSeen.get(agent)) !== null && _a !== void 0 ? _a : { lookups: 0, told: {}, steps: 0, singles: 0 };
    if (!stepsSeen.has(agent) && stepsSeen.size >= STEPS_KEPT)
        stepsSeen.delete((_b = stepsSeen.keys().next().value) !== null && _b !== void 0 ? _b : '');
    stepsSeen.set(agent, seen);
    var lines = [];
    var say = function (kind, line) {
        var _a, _b;
        if (((_a = seen.told[kind]) !== null && _a !== void 0 ? _a : 0) >= LINES_EACH)
            return;
        seen.told[kind] = ((_b = seen.told[kind]) !== null && _b !== void 0 ? _b : 0) + 1;
        lines.push(line);
    };
    var work = calls.filter(function (one) { return !isBook(one.tool); });
    seen.steps += 1;
    if (work.length === 1)
        seen.singles += 1;
    if (!work.length) {
        if (calls.every(function (one) { return isTool(one.tool, 'todo') || isTool(one.tool, 'note') || one.tool === 'TodoWrite'; }))
            say('book', BOOK_ALONE);
        return lines;
    }
    var helpers = work.filter(function (one) { return one.tool === 'Agent'; });
    if (helpers.some(function (one) { var _a, _b; return CHECKER.test(String((_b = (_a = one.input) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : '')); }))
        seen.checkerAt = seen.steps;
    if (work.length === 1 && helpers.length === 1)
        say('alone', HELPER_ALONE);
    if (helpers.length && !seen.told.started)
        say('started', HELPERS_STARTED);
    // Single lookups in a row
    seen.lookups = work.length === 1 && isLookup(work[0].tool, work[0].input) ? seen.lookups + 1 : 0;
    if (seen.lookups >= LOOKUPS_IN_A_ROW) {
        say('lookups', LOOKUP_RUN(seen.lookups));
        seen.lookups = 0;
    }
    // Long runs of one kind, each alone in its step
    var one = work.length === 1 ? work[0] : undefined;
    var command = (one === null || one === void 0 ? void 0 : one.tool) === 'Bash' ? String((_d = (_c = one.input) === null || _c === void 0 ? void 0 : _c.command) !== null && _d !== void 0 ? _d : '') : '';
    var kind = one && command && one.tookMs >= LONG_RUN && !isLookup(one.tool, one.input) && !WAIT_RUN.test(command) ? kindOf(command) : '';
    if (kind && seen.lastRun === kind)
        say('serial', SERIAL_RUNS(kind));
    seen.lastRun = kind || (one ? undefined : seen.lastRun);
    // A commit with no second look started
    if (isTop && seen.checkerAt === undefined && work.some(function (call) { var _a, _b; return call.tool === 'Bash' && COMMIT.test(String((_b = (_a = call.input) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '')); }))
        say('look', LOOK_NOW);
    return lines;
};
// ---- Looking in on running helpers ----
// How often a piece of work with helpers running is looked at, and how long a helper may show nothing new before it is named
var LOOK_IN_EVERY = 60000;
var HELPER_QUIET = 5 * 60000;
// What Claude is told of a helper that has shown nothing new
var QUIET_HELPER = function (title, id, mins, running) {
    return "Your helper \"".concat(title, "\" (").concat(id, ") has shown nothing new for ").concat(mins, " minutes").concat(running ? "; ".concat(running) : '', ". Look at what it is doing now: send it a short question with SendMessage, which it sees after its current step; if it is stuck, tell it the same way to hand back what it has now (Claude Code does not let you stop it yourself) and start a narrower one in its place. If it does one at a time what could be split up, start helpers for the other parts beside it.");
};
// What it is told of a helper that keeps taking single steps in order
var SERIAL_HELPER = function (title, id, steps) {
    return "Your helper \"".concat(title, "\" (").concat(id, ") has taken ").concat(steps, " steps, nearly all of one call each: it does one at a time what could be split up. If its parts don't depend on each other, start helpers for the rest beside it, or tell it with SendMessage to send its calls together.");
};
// A helper this many steps in, with this share of single-call steps, is working in order
var SERIAL_STEPS = 20;
var SERIAL_SHARE = 0.85;
// Looked at every LOOK_IN_EVERY while work runs: each running helper that has shown nothing new for HELPER_QUIET, and each that
// works in order, is named to the work that started it, once each stretch, and its card says when it was looked at and what of
var lookInOnHelpers = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, told, looked, _loop_1, _i, list_1, helper, _loop_2, _a, told_1, one;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _d.sent();
                told = [];
                looked = new Map();
                _loop_1 = function (helper) {
                    var parent_1, sum, last, isQuiet, running_1, seen;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!helper.parentId || helper.status !== 'working' || helper.chat)
                                    return [2 /*return*/, "continue"];
                                parent_1 = list.find(function (one) { return one.id === helper.parentId; });
                                if (!parent_1 || parent_1.status !== 'working')
                                    return [2 /*return*/, "continue"];
                                sum = (_b = looked.get(parent_1.id)) !== null && _b !== void 0 ? _b : { at: now, running: 0, quiet: 0 };
                                sum.running += 1;
                                last = Math.max(helper.startedAt, (_c = helper.newAt) !== null && _c !== void 0 ? _c : 0);
                                isQuiet = now - last >= HELPER_QUIET;
                                if (isQuiet)
                                    sum.quiet += 1;
                                looked.set(parent_1.id, sum);
                                if (!(isQuiet && helper.quietTold !== last)) return [3 /*break*/, 2];
                                running_1 = helper.running ? "".concat(helper.running.what, " for ").concat(took(now - helper.running.at)) : '';
                                told.push({ to: parent_1.id, line: QUIET_HELPER(titleOf(helper), helper.id, Math.round((now - last) / 60000), running_1) });
                                return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (one) { return (one.id === helper.id ? __assign(__assign({}, one), { quietTold: last }) : one); }); })];
                            case 1:
                                _e.sent();
                                _e.label = 2;
                            case 2:
                                seen = stepsSeen.get(helper.id);
                                if (!(seen && seen.steps >= SERIAL_STEPS && seen.singles / seen.steps >= SERIAL_SHARE && !helper.serialTold)) return [3 /*break*/, 4];
                                told.push({ to: parent_1.id, line: SERIAL_HELPER(titleOf(helper), helper.id, seen.steps) });
                                return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (one) { return (one.id === helper.id ? __assign(__assign({}, one), { serialTold: true }) : one); }); })];
                            case 3:
                                _e.sent();
                                _e.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, list_1 = list;
                _d.label = 3;
            case 3:
                if (!(_i < list_1.length)) return [3 /*break*/, 6];
                helper = list_1[_i];
                return [5 /*yield**/, _loop_1(helper)];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: 
            // Each card with helpers running keeps when they were last looked at and how many were quiet; one with none running keeps nothing
            return [4 /*yield*/, changeTodos($, function (all) {
                    var changed = all.some(function (one) { var _a, _b, _c, _d, _e, _f, _g, _h; return ((_b = (_a = looked.get(one.id)) === null || _a === void 0 ? void 0 : _a.quiet) !== null && _b !== void 0 ? _b : -1) !== ((_d = (_c = one.lookedIn) === null || _c === void 0 ? void 0 : _c.quiet) !== null && _d !== void 0 ? _d : -1) || ((_f = (_e = looked.get(one.id)) === null || _e === void 0 ? void 0 : _e.running) !== null && _f !== void 0 ? _f : -1) !== ((_h = (_g = one.lookedIn) === null || _g === void 0 ? void 0 : _g.running) !== null && _h !== void 0 ? _h : -1); });
                    return changed || looked.size ? all.map(function (one) { var _a; return (__assign(__assign({}, one), { lookedIn: (_a = looked.get(one.id)) !== null && _a !== void 0 ? _a : (one.lookedIn && one.status === 'working' ? undefined : one.lookedIn) })); }) : all;
                })];
            case 7:
                // Each card with helpers running keeps when they were last looked at and how many were quiet; one with none running keeps nothing
                _d.sent();
                _loop_2 = function (one) {
                    var parent_2;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                parent_2 = list.find(function (todo) { return todo.id === one.to; });
                                if (!(parent_2 === null || parent_2 === void 0 ? void 0 : parent_2.waitsSince)) return [3 /*break*/, 2];
                                return [4 /*yield*/, sendOwn($, { to: { agentId: one.to }, text: one.line }).catch(function (err) { return log($, "work ".concat(one.to, " not told of its helper: ").concat(String(err))); })];
                            case 1:
                                _f.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, tell($, one.to, one.line)];
                            case 3:
                                _f.sent();
                                _f.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _a = 0, told_1 = told;
                _d.label = 8;
            case 8:
                if (!(_a < told_1.length)) return [3 /*break*/, 11];
                one = told_1[_a];
                return [5 /*yield**/, _loop_2(one)];
            case 9:
                _d.sent();
                _d.label = 10;
            case 10:
                _a++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/];
        }
    });
}); };
// The list is followed every FOLLOW_EVERY; helpers are looked in on every LOOK_IN_EVERY of it
var lookedInAt = 0;
var lookInDue = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                if (now - lookedInAt < LOOK_IN_EVERY)
                    return [2 /*return*/];
                lookedInAt = now;
                return [4 /*yield*/, lookInOnHelpers($)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// ---- What a piece of work or a helper waits for that nothing of its own makes: Claudopus looks, and starts it again ----
// How long Claudopus looks for what was asked when no time is given, and at most; and how often it looks
var WAKE_LONGEST = 60;
var WAKE_MOST = 360;
var WAKE_LOOK = 15000;
var wakesLookedAt = 0;
var wakeTries = new Map();
// Whether a page answers without an error, following where it sends: looked at side by side, each in at most 5 s
var pageAnswers = function ($, url) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c, _d; return __generator(this, function (_e) {
    switch (_e.label) {
        case 0:
            _b = (_a = /^2\d\d$/).test;
            return [4 /*yield*/, $.process.run(['curl', '-s', '-L', '-o', '/dev/null', '-m', '5', '-w', '%{http_code}', url], { timeoutMs: 8000 }).catch(function () { return undefined; })];
        case 1: return [2 /*return*/, _b.apply(_a, [((_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.stdout) !== null && _d !== void 0 ? _d : '').trim()])];
    }
}); }); };
var WAKE_FOUND = function (what) { return "From Claudopus: what you asked to be started again for is there: ".concat(what, ". Carry on from it."); };
var WAKE_TIME = function (what) { return "From Claudopus: the time you asked for has come: ".concat(what, ". Carry on."); };
var WAKE_MISSED = function (what, minutes) { return "From Claudopus: ".concat(what, " was still not there after ").concat(minutes, " min of looking. Find out why before you look again."); };
// Looked at as the list is followed: each file, line or page asked for, at most every WAKE_LOOK; the work is started again (or told,
// while at a step of its own) the moment it is there, when its time comes, or when the longest look has run out
var lookWakes = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, due, isChanged, _loop_3, _i, due_1, one;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!dir || isOff)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _f.sent();
                if (now - wakesLookedAt < WAKE_LOOK)
                    return [2 /*return*/];
                wakesLookedAt = now;
                return [4 /*yield*/, read($, todos)];
            case 2:
                due = (_f.sent()).filter(function (one) { return one.wakeWhen && (one.status === 'working' || one.status === 'done') && one.handedBackAt === undefined && !endedByHandback.has(one.id) && !isHeld(one); });
                // (nothing asked for, nothing drawn: the panel stays still under the pointer)
                if (!due.length)
                    return [2 /*return*/];
                isChanged = false;
                _loop_3 = function (one) {
                    var w, isTimeOnly, path, found, _g, _h, _j, isMissed, text, isAtStep, r, _k, _l, tries;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0:
                                w = one.wakeWhen;
                                if (!w)
                                    return [2 /*return*/, "continue"];
                                isTimeOnly = !w.file && !w.url;
                                path = ((_a = w.file) === null || _a === void 0 ? void 0 : _a.startsWith('~/')) ? "".concat(dir.replace(/\/\.claude\/claudopus$/, ''), "/").concat(w.file.slice(2)) : w.file;
                                if (!isTimeOnly) return [3 /*break*/, 1];
                                _g = now >= w.until;
                                return [3 /*break*/, 9];
                            case 1:
                                if (!path) return [3 /*break*/, 6];
                                if (!w.text) return [3 /*break*/, 3];
                                return [4 /*yield*/, $.process.run(['grep', '-qF', '--', w.text, path], { timeoutMs: 5000 }).catch(function () { return undefined; })];
                            case 2:
                                _j = ((_b = (_m.sent())) === null || _b === void 0 ? void 0 : _b.exitCode) === 0;
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, $.fs.exists(path).catch(function () { return false; })];
                            case 4:
                                _j = _m.sent();
                                _m.label = 5;
                            case 5:
                                _h = _j;
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, pageAnswers($, (_c = w.url) !== null && _c !== void 0 ? _c : '')];
                            case 7:
                                _h = _m.sent();
                                _m.label = 8;
                            case 8:
                                _g = _h;
                                _m.label = 9;
                            case 9:
                                found = _g;
                                isMissed = !found && now >= w.until;
                                if (!found && !isMissed)
                                    return [2 /*return*/, "continue"];
                                text = isMissed ? WAKE_MISSED(w.what, Math.round((w.until - w.at) / 60000)) : isTimeOnly ? WAKE_TIME(w.what) : WAKE_FOUND(w.what);
                                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                            case 10:
                                isAtStep = ((_d = (_m.sent()).find(function (agent) { return agent.id === one.id; })) === null || _d === void 0 ? void 0 : _d.status) === 'running';
                                if (!isAtStep) return [3 /*break*/, 12];
                                return [4 /*yield*/, tell($, one.id, text).then(function () { return ({ isDelivered: true, reason: '' }); }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                            case 11:
                                _k = _m.sent();
                                return [3 /*break*/, 17];
                            case 12: return [4 /*yield*/, isReplaced($)];
                            case 13:
                                if (!(_m.sent())) return [3 /*break*/, 14];
                                _l = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                                return [3 /*break*/, 16];
                            case 14: return [4 /*yield*/, sendOwn($, { to: { agentId: one.id }, text: text }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })
                                // Not reached: looked at again at the next look, three times at most, before it is let go
                            ];
                            case 15:
                                _l = _m.sent();
                                _m.label = 16;
                            case 16:
                                _k = _l;
                                _m.label = 17;
                            case 17:
                                r = _k;
                                tries = ((_e = wakeTries.get(one.id)) !== null && _e !== void 0 ? _e : 0) + 1;
                                if (!(!r.isDelivered && tries < 3)) return [3 /*break*/, 19];
                                wakeTries.set(one.id, tries);
                                return [4 /*yield*/, log($, "work ".concat(one.id, " not started again for ").concat(w.what, ", tried again next look: ").concat(r.reason))];
                            case 18:
                                (_m.sent());
                                _m.label = 19;
                            case 19:
                                if (!r.isDelivered && tries < 3)
                                    return [2 /*return*/, "continue"];
                                wakeTries.delete(one.id);
                                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { var _a; return (card.id === one.id && ((_a = card.wakeWhen) === null || _a === void 0 ? void 0 : _a.at) === w.at ? __assign(__assign({}, card), { wakeWhen: undefined }) : card); }); })];
                            case 20:
                                _m.sent();
                                isChanged = true;
                                if (!(r.isDelivered && !isAtStep)) return [3 /*break*/, 22];
                                return [4 /*yield*/, wakeCard($, one.id)];
                            case 21:
                                _m.sent();
                                _m.label = 22;
                            case 22: return [4 /*yield*/, log($, "work ".concat(one.id, " ").concat(r.isDelivered ? 'started again' : 'not started again', ": ").concat(isMissed ? 'not there' : 'there', ": ").concat(w.what))];
                            case 23:
                                _m.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, due_1 = due;
                _f.label = 3;
            case 3:
                if (!(_i < due_1.length)) return [3 /*break*/, 6];
                one = due_1[_i];
                return [5 /*yield**/, _loop_3(one)];
            case 4:
                _f.sent();
                _f.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (isChanged)
                    redraw($);
                return [2 /*return*/];
        }
    });
}); };
// What a card that asked to be started again says under its line, in place of a command that would wait
var wakeLine = function (one) { return (one.wakeWhen ? "Claudopus starts Claude again when this is there: ".concat(one.wakeWhen.what) : ''); };
// What a card with helpers running says under its line: only how many have gone quiet, as those at work are rows on its tree
var lookedInLine = function (one, at) {
    var l = one.lookedIn;
    // Helpers at work are rows on its tree already; only one gone quiet is said, as the work was told of it
    if (!l || one.status !== 'working' || !l.running || !l.quiet)
        return '';
    return "".concat(l.quiet === 1 ? '1 helper' : "".concat(l.quiet, " helpers"), " quiet for ").concat(HELPER_QUIET / 60000, "+ min, Claudopus told Claude");
};
var stepHooks = function (on) {
    // After each step of a piece of work or a helper: the patterns its calls show, as lines in its next request
    on('classic.PostToolBatch', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, agent, now, calls, _i, _a, call, card, again, lines;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _c.sent();
                    agent = e.agent_id;
                    if (!agent || !dir || isOff)
                        return [2 /*return*/, r];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    now = _c.sent();
                    calls = e.tool_calls.map(function (call) { var _a; return ({ tool: call.tool_name, input: call.tool_input, tookMs: now - ((_a = callStarts.get(call.tool_use_id)) !== null && _a !== void 0 ? _a : now) }); });
                    for (_i = 0, _a = e.tool_calls; _i < _a.length; _i++) {
                        call = _a[_i];
                        callStarts.delete(call.tool_use_id);
                    }
                    return [4 /*yield*/, read($, todos)];
                case 3:
                    card = (_c.sent()).find(function (one) { return one.id === agent; });
                    return [4 /*yield*/, rulesAgain($, agent).catch(function (err) { return (void log($, "rules not handed again: ".concat(String(err))), ''); })];
                case 4:
                    again = _c.sent();
                    lines = __spreadArray(__spreadArray([], stepLines(agent, calls, !(card === null || card === void 0 ? void 0 : card.parentId)), true), (again ? [again] : []), true);
                    if (!lines.length)
                        return [2 /*return*/, r];
                    return [4 /*yield*/, log($, "work ".concat(agent, " told of its step: ").concat(lines.map(function (line) { return line.slice(0, 40); }).join(' / ')))];
                case 5:
                    _c.sent();
                    return [2 /*return*/, __assign(__assign({}, r), { additionalContext: __spreadArray(__spreadArray([], ((_b = r.additionalContext) !== null && _b !== void 0 ? _b : []), true), lines, true) })];
            }
        });
    }); });
};
// ---- Helpers run in the background, and their work never waits for them ----
// The helpers an agent started that are still at work
var runningHelpers = function (list, id) { return list.filter(function (one) { return one.parentId === id && one.status === 'working' && !one.answeredAt; }); };
var HELD_AT_END = function (n) {
    return "You have ".concat(n === 1 ? 'a helper' : "".concat(n, " helpers"), " still running in the background. Don't hand back your report yet: ").concat(n === 1 ? 'its result' : 'their results', " would reach the chat instead of you. Carry on with what needs nothing from ").concat(n === 1 ? 'it' : 'them', ", or end your step without a report: each result starts you again, and Claudopus tells the chat you wait for ").concat(n === 1 ? 'it' : 'them', ". One you no longer need: tell it with SendMessage to hand back what it has now, as Claude Code does not let you stop it yourself.");
};
var HELPERS_STARTED = 'Your helpers run in the background: each call came back at once, and each result comes to you as a message when it ends, even after you end your step. Continue now with your own part, and when nothing else is left, end your step: never wait for them with a command.';
// What the work that started a helper is told as Claudopus passes on its result
var HELPER_ENDED = function (title, how, report) {
    return "From Claudopus: your helper \"".concat(title, "\" ").concat(how === 'failed' ? 'failed' : how === 'stopped' ? 'was stopped' : 'has finished', " while your step had ended, so Claudopus passes its result on to you here (if you already have it, carry on).").concat(report ? " Its result:\n\n".concat(report) : ' It gave no result.');
};
// What the chat is told, so a helper's result that reached it, or a notice that the task ended without its report, needs nothing
var HELPER_PASSED = function (helper, work) {
    return "From Claudopus: the result of the helper \"".concat(helper, "\" reached this chat because the task \"").concat(work, "\" had ended its step to let it work. Claudopus has passed it on to that task and started it again: there is nothing for you to do with it, and nothing to tell {name}.");
};
// What the chat is told of work that ended its step to wait for its helpers, or to be started again: the engine sees neither, so it
// tells the chat that work ended without its report and to ask it for one, which the work cannot give while its helpers run (16 Nov:
// five tasks asked again and again, each refused at its report). Told once, until the work takes a step again. Work that waits only
// on a command it started detached is not: its card ends as the engine ends it, and the command starts it again
var toldWaitsOn = new Set();
var plural = function (n, one, many) { return (n === 1 ? one : "".concat(n, " ").concat(many)); };
var WAITS_ON = function (work, helpers, wake) {
    return "From Claudopus: the task \"".concat(work, "\" ended its step without its report because it waits ").concat(helpers ? "for ".concat(plural(helpers, 'a helper', 'helpers'), " it started") : "to be started again once this is there: ".concat(wake), ". Claude Code may say it ended without delivering a report, but it is still at work: ").concat(helpers ? "".concat(helpers === 1 ? "the helper's result starts" : "each helper's result starts", " it again") : 'Claudopus starts it again then', ", and its report comes after that. Do not send it a message asking for its report, which it cannot give while it waits, and do not tell {name} it stopped.");
};
var tellWaitsOn = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var list, card, helpers;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!dir || isOff || toldWaitsOn.has(id))
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _c.sent();
                card = list.find(function (one) { return one.id === id; });
                if (!card || card.parentId || card.status !== 'working' || card.handedBackAt !== undefined)
                    return [2 /*return*/];
                helpers = runningHelpers(list, id).length;
                if (!helpers && !card.wakeWhen)
                    return [2 /*return*/];
                toldWaitsOn.add(id);
                return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(WAITS_ON(titleOf(card), helpers, (_b = (_a = card.wakeWhen) === null || _a === void 0 ? void 0 : _a.what) !== null && _b !== void 0 ? _b : '')) }] } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, log($, "chat told work ".concat(id, " waits on ").concat(helpers ? plural(helpers, 'a helper', 'helpers') : 'being woken'))];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A helper that ends while the work that started it has ended its step: the engine hands its result to the chat (seen live on 16
// Nov), so Claudopus passes it on to that work and starts it again with it. The work never holds itself open to wait for helpers
var passOnHelper = function ($_1, helperId_1, report_1, how_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, helperId_1, report_1, how_1], args_1, true), void 0, function ($, helperId, report, how, isUnheard) {
        var list, helper, parent, listed, r, _a;
        var _b;
        if (isUnheard === void 0) { isUnheard = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!dir || isOff)
                        return [2 /*return*/];
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    list = _c.sent();
                    helper = list.find(function (one) { return one.id === helperId; });
                    parent = (helper === null || helper === void 0 ? void 0 : helper.parentId) ? list.find(function (one) { return one.id === helper.parentId; }) : undefined;
                    // (nor work being stopped: a helper stopped with it says nothing worth starting it again for)
                    if (!helper || !parent || isHeld(parent) || pressed.has(parent.id) || stoppedHere.has(parent.id) || parent.status === 'stopped' || parent.status === 'failed' || parent.handedBackAt !== undefined || endedByHandback.has(parent.id))
                        return [2 /*return*/];
                    return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                case 2:
                    listed = (_b = (_c.sent()).find(function (one) { return one.id === parent.id; })) === null || _b === void 0 ? void 0 : _b.status;
                    if (!(listed === 'running' && isUnheard)) return [3 /*break*/, 4];
                    return [4 /*yield*/, tell($, parent.id, HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)))];
                case 3: return [2 /*return*/, void (_c.sent())];
                case 4:
                    if (listed === 'running')
                        return [2 /*return*/];
                    return [4 /*yield*/, isReplaced($)];
                case 5:
                    if (!(_c.sent())) return [3 /*break*/, 6];
                    _a = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, sendOwn($, { to: { agentId: parent.id }, text: HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
                case 7:
                    _a = _c.sent();
                    _c.label = 8;
                case 8:
                    r = _a;
                    if (!!r.isDelivered) return [3 /*break*/, 10];
                    return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result not passed on to ").concat(parent.id, ": ").concat(r.reason))];
                case 9: return [2 /*return*/, void (_c.sent())];
                case 10: return [4 /*yield*/, wakeCard($, parent.id)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result passed on to ").concat(parent.id, ", which had ended its step"))
                        // Told once the result is on its way, so the chat never lets go of a result that did not arrive
                    ];
                case 12:
                    _c.sent();
                    if (!(listed !== 'waiting')) return [3 /*break*/, 14];
                    return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(HELPER_PASSED(titleOf(helper), titleOf(parent))) }] } }).catch(function (err) { return log($, "chat not told of a helper's result passed on: ".concat(String(err))); })];
                case 13:
                    _c.sent();
                    _c.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    });
};
// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
var isHelperSpawn = function (e) { var _a; return Boolean(e.parentAgentId) && !flowAgents.has((_a = e.parentAgentId) !== null && _a !== void 0 ? _a : '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir); };
// Work that hands back its report while its helpers run is held back, so their results come to it and not to the chat; work that
// only ends its step is let go, as Claudopus passes each result on and starts it again (passOnHelper)
var holdAtHandback = function ($, agent) { return __awaiter(_this, void 0, void 0, function () {
    var running, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!dir || isOff || flowAgents.has(agent))
                    return [2 /*return*/, ''];
                _a = runningHelpers;
                return [4 /*yield*/, read($, todos)];
            case 1:
                running = _a.apply(void 0, [_b.sent(), agent]).length;
                if (!running)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, log($, "work ".concat(agent, " held at its report: ").concat(running, " helpers run"))];
            case 2:
                _b.sent();
                return [2 /*return*/, HELD_AT_END(running)];
        }
    });
}); };
// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending, their
// results reaching the chat
var stopHelpers = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var list, _i, _a, one, r;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                list = _b.sent();
                _i = 0, _a = underOf(list, id).filter(function (kid) { return kid.status === 'working'; });
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                one = _a[_i];
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(function (err) { return ({ deny: String(err) }); })];
            case 3:
                r = _b.sent();
                if (!r.deny) return [3 /*break*/, 5];
                return [4 /*yield*/, log($, "helper ".concat(one.id, " of ").concat(id, " not stopped: ").concat(String(r.deny)))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/];
        }
    });
}); };
