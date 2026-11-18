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
    if (isTop && lean.second !== 'asked' && seen.checkerAt === undefined && work.some(function (call) { var _a, _b; return call.tool === 'Bash' && COMMIT.test(String((_b = (_a = call.input) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '')); }))
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
// works in order, is named to the work that started it, once each stretch (its card says nothing of it)
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
var WAKE_LONGEST = 15;
var WAKE_MOST = 60;
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
var WAKE_MISSED = function (what, minutes) {
    return "From Claudopus: ".concat(what, " was still not there after ").concat(minutes, " min of looking, and Claudopus will not look for it again. Hand back your report now with what you have, saying what never came and why; it goes through even while helpers run.");
};
// What was looked for, by its file, line and page: a look that ran out is not taken again for the same
var wakeKey = function (w) { var _a, _b, _c; return JSON.stringify([(_a = w.file) !== null && _a !== void 0 ? _a : '', (_b = w.text) !== null && _b !== void 0 ? _b : '', (_c = w.url) !== null && _c !== void 0 ? _c : '']); };
// What the chat is told of work Claudopus could not start again for what it waited on, which would otherwise wait for good
var WAKE_LOST_IN_CHAT = function (title, what) { return "Claudopus could not start \"".concat(title, "\" again for what it waited on: ").concat(what, "."); };
var WAKE_LOST_ASK = 'Send it a message to carry on, or to hand back what it has.';
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
                    var w, isTimeOnly, path, found, _g, _h, _j, isMissed, text, isAtStep, r, _k, _l, tries, isToldMissed;
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
                                isToldMissed = isMissed && r.isDelivered;
                                return [4 /*yield*/, changeTodos($, function (list) {
                                        return list.map(function (card) { var _a, _b; return card.id === one.id && ((_a = card.wakeWhen) === null || _a === void 0 ? void 0 : _a.at) === w.at ? __assign(__assign(__assign({}, card), { wakeWhen: undefined }), (isToldMissed ? { wakeMissed: { key: wakeKey(w), what: w.what }, mayHandBack: (_b = card.mayHandBack) !== null && _b !== void 0 ? _b : now } : {})) : card; });
                                    })];
                            case 20:
                                _m.sent();
                                isChanged = true;
                                if (!(r.isDelivered && !isAtStep)) return [3 /*break*/, 22];
                                return [4 /*yield*/, wakeCard($, one.id)
                                    // Not reached at all, it would wait for good: the chat is told, and may send it a message
                                ];
                            case 21:
                                _m.sent();
                                _m.label = 22;
                            case 22:
                                if (!!r.isDelivered) return [3 /*break*/, 24];
                                return [4 /*yield*/, lostToPerson($, one, WAKE_LOST_IN_CHAT(titleOf(one), w.what), WAKE_LOST_ASK)];
                            case 23:
                                _m.sent();
                                _m.label = 24;
                            case 24: return [4 /*yield*/, log($, "work ".concat(one.id, " ").concat(r.isDelivered ? 'started again' : 'not started again', ": ").concat(isMissed ? 'not there' : 'there', ": ").concat(w.what))];
                            case 25:
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
// The helpers an agent started that are still at work. One that ended a step with words as long as a result, held on its own work,
// has not handed back while that work is something that ends and starts it again: a run, what it asked to be woken for, or helpers
// of its own (17 Nov: helpers following their runs on Azure were counted as done, and their task was pressed for its report each
// time it paused). One that gave its result and only left a server or a watch going for the person is done
var runningHelpers = function (list, id) {
    return list.filter(function (one) {
        var _a, _b;
        if (one.parentId !== id || one.status !== 'working' || one.handedBackAt !== undefined)
            return false;
        if (!one.answeredAt)
            return true;
        var isServer = function (cmd, what) { return SERVER_CMD.test(cmd !== null && cmd !== void 0 ? cmd : '') || describedOf(what).kind === 'server'; };
        return Boolean(((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch && !isServer(b.cmd, b.what); })) || ((_b = one.detached) === null || _b === void 0 ? void 0 : _b.some(function (d) { return !isServer(d.cmd, d.what); })) || one.wakeWhen || list.some(function (kid) { return kid.parentId === one.id && kid.status === 'working'; }));
    });
};
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
    return "From Claudopus: the result of the helper \"".concat(helper, "\" reached this chat because the task \"").concat(work, "\" had ended its step to let it work. Claudopus passes it on to that task and starts it again: there is nothing for you to do with it, and nothing to tell {name}.");
};
// What the chat is told when that could not be done: the result is in the chat alone, so the chat sends it on, or tells the person
// what it adds when the person stopped or holds that task, as sending it would start that task again
var HELPER_NOT_PASSED = function (helper, work, id, reason, isPersons) {
    if (isPersons === void 0) { isPersons = false; }
    return "From Claudopus: the result of the helper \"".concat(helper, "\" reached this chat, and Claudopus did not pass it on to the task \"").concat(work, "\" (id ").concat(id, "): ").concat(cut(oneLine(reason), 120), ". ").concat(isPersons ? 'Do not start that task again for it: tell {name} what the result adds.' : "Send the result on to that task yourself: SendMessage to ".concat(id, ", with the result as it reached you."));
};
// What the chat is told of work that ended its step to wait for its helpers, or to be started again: the engine sees neither, so it
// tells the chat that work ended without its report and to ask it for one, which the work cannot give while its helpers run (16 Nov:
// five tasks asked again and again, each refused at its report). Told in the same message as that notice, never on its own: added on
// its own it reached the chat beside the notice, or rode into a later turn after the notice was left out (16 Nov evening: 27 turns).
// Work that waits only on a command it started detached is told so too: its card stays at work, and the command's end starts it again
var plural = function (n, one, many) { return (n === 1 ? one : "".concat(n, " ").concat(many)); };
// Once Claudopus told the chat the task is stuck, the chat may write to it
var WAITS_ON = function (work, helpers, wake, stuck) {
    return "From Claudopus: the task \"".concat(work, "\" ended its step without its report because it waits ").concat(helpers ? "for ".concat(plural(helpers, 'a helper', 'helpers'), " it started") : "to be started again once this is there: ".concat(wake), ". Claude Code may say it ended without delivering a report, but it is still at work: ").concat(helpers ? "".concat(helpers === 1 ? "the helper's result starts" : "each helper's result starts", " it again") : 'Claudopus starts it again then', ", and its report comes after that. ").concat(stuck
        ? "Claudopus told you it is stuck, so you may message it (SendMessage to ".concat(stuck, ") to ask what it waits on, and to hand back what it has if nothing is coming.")
        : 'It cannot give its report while it waits, so do not message it for one: Claudopus starts it again if that wait runs out or its helpers go quiet, and tells you if it is stuck.', " Do not tell {name} it stopped.");
};
// The top work at work, its report not given, that waits on what the engine does not count as its own: a helper the engine still
// lists at work, or a wake_me still due. A helper's card left at work after the helper is gone, or a wake long past, is not waiting:
// the engine's word that the work ended then reaches the chat as it is
var waitingNow = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var list, listed, _a, now, waiting, _i, list_2, card, helpers, run, wake;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                list = _c.sent();
                _a = Map.bind;
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 2:
                listed = new (_a.apply(Map, [void 0, (_c.sent()).map(function (one) { return [one.id, one.status]; })]))();
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _c.sent();
                waiting = new Map();
                for (_i = 0, list_2 = list; _i < list_2.length; _i++) {
                    card = list_2[_i];
                    if (card.parentId || card.status !== 'working' || card.handedBackAt !== undefined)
                        continue;
                    // (one left stopped partway that Claudopus starts again to carry on: Claude Code's word that it ended needs nothing of the chat)
                    if (card.carryOn && !card.carryOn.gaveUp && card.endedStepAt === card.carryOn.at && now - card.carryOn.at < CARRY_SHOWN) {
                        waiting.set(card.id, { title: titleOf(card), helpers: 0, wake: '', isCarried: true });
                        continue;
                    }
                    helpers = runningHelpers(list, card.id).filter(function (one) { return listed.get(one.id) === 'running' || listed.get(one.id) === 'waiting'; }).length;
                    run = ((_b = card.detached) !== null && _b !== void 0 ? _b : []).find(function (d) { return !isServerRun(d.cmd, d.what); });
                    wake = card.wakeWhen && card.wakeWhen.until > now ? card.wakeWhen.what : run ? "the end of its command \"".concat(runWords(run.what, run.cmd), "\"") : '';
                    if (helpers || wake)
                        waiting.set(card.id, __assign({ title: titleOf(card), helpers: helpers, wake: wake }, (card.stuckTold !== undefined ? { stuck: card.id } : {})));
                }
                return [2 /*return*/, waiting];
        }
    });
}); };
var waitsText = function (work) { return named(work.isCarried ? CARRIED_IN_CHAT(work.title) : WAITS_ON(work.title, work.helpers, work.wake, work.stuck)); };
// A helper that ends while the work that started it has ended its step: the engine hands its result to the chat (seen live on 16
// Nov), so Claudopus passes it on to that work and starts it again with it. The work never holds itself open to wait for helpers
// The work a helper's result is for, when Claudopus passes it on: none for work held by the person, stopped, or that gave its report
// (nor work being stopped: a helper stopped with it says nothing worth starting it again for)
var passedTo = function (list, helperId) {
    var helper = list.find(function (one) { return one.id === helperId; });
    var parent = (helper === null || helper === void 0 ? void 0 : helper.parentId) ? list.find(function (one) { return one.id === helper.parentId; }) : undefined;
    if (!helper || !parent || notPassedWhy(parent))
        return undefined;
    return { helper: helper, parent: parent };
};
// Why a helper's result is not passed on to its work, and whether that was the person's doing; nothing when it is
var notPassedWhy = function (parent) {
    return isHeld(parent)
        ? { reason: '{name} holds that task', isPersons: true }
        : pressed.has(parent.id) || stoppedHere.has(parent.id) || parent.status === 'stopped'
            ? { reason: 'that task was stopped', isPersons: true }
            : parent.status === 'failed'
                ? { reason: 'that task failed', isPersons: false }
                : parent.handedBackAt !== undefined || endedByHandback.has(parent.id)
                    ? { reason: 'that task had handed back its report', isPersons: false }
                    : undefined;
};
var toChat = function ($, text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(text) }] } }).catch(function (err) { return log($, "chat not told of a helper's result: ".concat(String(err))); })
        // What the chat must act on as a helper's turn ends, after its own turn on that result has ended: sent as the mod's own message,
        // which shows in the chat and gives it a turn (written as a row, it sat unread until the person's next message). A row when that fails
    ];
}); }); };
// What the chat must act on as a helper's turn ends, after its own turn on that result has ended: sent as the mod's own message,
// which shows in the chat and gives it a turn (written as a row, it sat unread until the person's next message). A row when that fails
var toChatNow = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.prompt.submit({ text: named(text) }).then(function () { return true; }).catch(function (err) { return (void log($, "chat not sent a helper's result: ".concat(String(err))), false); })];
            case 1:
                r = _a.sent();
                if (!!r) return [3 /*break*/, 3];
                return [4 /*yield*/, toChat($, text)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// The helpers whose hand-back the chat was told of before it went: the engine hands it to the chat at once, and the chat's turn
// starts with it before the helper's turn ends (16 and 17 Nov: in 61 of 62 hand-backs the chat's request went out before the note
// written as the helper's turn ended, and the chat sent 31 of those results on by hand). So the chat is told as the hand-back is
// given, and its result is passed on to the work as the helper's turn ends
var notedAtHandback = new Set();
// Written once the hand-back went through, before its hook returns: a refused hand-back leaves no note
var noteHandback = function ($, helperId) { return __awaiter(_this, void 0, void 0, function () {
    var to, _a, listed;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!dir || isOff)
                    return [2 /*return*/];
                _a = passedTo;
                return [4 /*yield*/, read($, todos)];
            case 1:
                to = _a.apply(void 0, [_c.sent(), helperId]);
                // Nor for work that already handed back what it had while its helpers ran: the result comes late (passOnHelper)
                if (!to || handedBackLetGo.has(to.parent.id) || wokenFor.has(helperId))
                    return [2 /*return*/];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 2:
                listed = (_b = (_c.sent()).find(function (one) { return one.id === to.parent.id; })) === null || _b === void 0 ? void 0 : _b.status;
                if (listed === 'running' || listed === 'waiting')
                    return [2 /*return*/];
                notedAtHandback.add(helperId);
                return [4 /*yield*/, toChat($, HELPER_PASSED(titleOf(to.helper), titleOf(to.parent)))];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A helper's hand-back the engine gives the chat because the task that started it had ended its step, whose result Claudopus passes
// on to that task (passOnHelper): Claude Code shows it, and the chat need not act on it, so it costs the chat no turn of the model's
// (17 Nov: after a "Report from subagent" box the chat sent the result on a second time and wrote "Nothing needs you here."). Only a
// helper whose hand-back went through here (handingBack), each once; one for work that already handed back what it had, held by the
// person, stopped or failed is the chat's to act on, as before. Claude Code gives a hook no way to keep the box itself from the chat:
// session.receive does not see a message from one of the chat's own agents (seen on 2.1.325), and a prompt dropped is a warning card
var handingBack = new Set();
var HANDBACK_FROM = /^\s*(?:Another Claude session sent a message:\s*)?<agent-message from="([^"]+)">\s*\[Subagent hand-back\]/;
var isQuietHandback = function ($, origin, text) { return __awaiter(_this, void 0, void 0, function () {
    var helperId, to, _a, isWoken, isSkipped, listed, _b;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!dir || isOff || origin.kind !== 'peer')
                    return [2 /*return*/, false];
                helperId = (_c = HANDBACK_FROM.exec(text)) === null || _c === void 0 ? void 0 : _c[1];
                if (!helperId || !handingBack.has(helperId))
                    return [2 /*return*/, false];
                _a = passedTo;
                return [4 /*yield*/, read($, todos)];
            case 1:
                to = _a.apply(void 0, [_f.sent(), helperId]);
                if (!to || handedBackLetGo.has(to.parent.id))
                    return [2 /*return*/, false
                        // A task the engine lists at work may be given the result by the engine, so Claudopus may not pass it on (passOnHelper): the
                        // chat, which has it, is the one to act then, as noteHandback leaves it untold. One Claudopus started for it (wakeForHandback) did
                        // not get it, as the chat did: Claudopus passes it on as before, and the chat is told if it cannot
                    ];
                isWoken = wokenFor.delete(helperId);
                isSkipped = handedOnSkipped.delete(helperId);
                if (!(isWoken || isSkipped)) return [3 /*break*/, 2];
                _b = undefined;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 3:
                _b = (_d = (_f.sent()).find(function (one) { return one.id === to.parent.id; })) === null || _d === void 0 ? void 0 : _d.status;
                _f.label = 4;
            case 4:
                listed = _b;
                if (listed === 'running' || listed === 'waiting')
                    return [2 /*return*/, false];
                handingBack.delete(helperId);
                notedAtHandback.add(helperId);
                if (!isSkipped) return [3 /*break*/, 6];
                passedOn.delete(helperId);
                return [4 /*yield*/, passOnHelper($, helperId, (_e = handedBack.get(helperId)) !== null && _e !== void 0 ? _e : '', 'done')];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6: return [2 /*return*/, true];
        }
    });
}); };
// Claude Code hands a backgrounded helper's report to the chat only when the task that started it is not at a step of its own
// (2.1.325's SubagentHandback: the recipient is the main conversation unless the caller is running), which shows in the chat as a
// "Report from subagent" box no hook can take away (17 Nov: "I want to see only the bits that are needed"). So a task that has ended
// its step is started again first, with a word of what comes, and the engine hands the report to it. Should the chat get it all the
// same (isQuietHandback), Claudopus passes it on as before
var wokenFor = new Set();
// The helpers whose result Claudopus did not pass on at their turn's end, as the engine was to hand it to the task woken for it
var handedOnSkipped = new Set();
var HANDBACK_COMING = function (helper) { return "From Claudopus: your helper \"".concat(helper, "\" is handing you its report now. It comes as a message of its own right after this one: read it there."); };
// A hand-back Claude Code refused after its task was started for it: the task is told nothing comes
var handbackRefused = function ($, helperId) { return __awaiter(_this, void 0, void 0, function () {
    var list, helper, parent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                list = _a.sent();
                helper = list.find(function (one) { return one.id === helperId; });
                parent = list.find(function (one) { return one.id === (helper === null || helper === void 0 ? void 0 : helper.parentId); });
                if (!parent) return [3 /*break*/, 3];
                return [4 /*yield*/, sendOwn($, { to: { agentId: parent.id }, text: "From Claudopus: the report of your helper \"".concat(titleOf(helper !== null && helper !== void 0 ? helper : parent), "\" did not come after all: Claude Code refused it. Carry on without it; the helper carries on too.") }).catch(function () { return undefined; })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var wakeForHandback = function ($, helperId) { return __awaiter(_this, void 0, void 0, function () {
    var to, _a, listed, r;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!dir || isOff)
                    return [2 /*return*/];
                _a = passedTo;
                return [4 /*yield*/, read($, todos)];
            case 1:
                to = _a.apply(void 0, [_c.sent(), helperId]);
                if (!to || handedBackLetGo.has(to.parent.id))
                    return [2 /*return*/];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 2:
                listed = (_b = (_c.sent()).find(function (one) { return one.id === to.parent.id; })) === null || _b === void 0 ? void 0 : _b.status;
                if (listed === 'running' || listed === 'waiting')
                    return [2 /*return*/];
                return [4 /*yield*/, isReplaced($)];
            case 3:
                if (_c.sent())
                    return [2 /*return*/];
                return [4 /*yield*/, sendOwn($, { to: { agentId: to.parent.id }, text: HANDBACK_COMING(titleOf(to.helper)) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
            case 4:
                r = _c.sent();
                if (!!r.isDelivered) return [3 /*break*/, 6];
                return [4 /*yield*/, log($, "task ".concat(to.parent.id, " not started for the hand-back of ").concat(helperId, ": ").concat(r.reason))];
            case 5: return [2 /*return*/, void (_c.sent())];
            case 6:
                wokenFor.add(helperId);
                return [4 /*yield*/, wakeCard($, to.parent.id)];
            case 7:
                _c.sent();
                return [4 /*yield*/, log($, "task ".concat(to.parent.id, " started so its helper ").concat(helperId, "'s hand-back goes to it, not to the chat"))];
            case 8:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// The result each helper's end was last passed on with: its turn's end, the look shortly after it and the look for work that ended
// unheard may each come to the same end, and it is passed on once. A helper started again ends again with a result of its own
// By the helper and its report alone: the same report ended again as failed or stopped is not passed on twice; a step of the helper's
// clears it (work.tsx)
var passedOn = new Map();
var passOnHelper = function ($_1, helperId_1, report_1, how_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, helperId_1, report_1, how_1], args_1, true), void 0, function ($, helperId, report, how, isUnheard) {
        var key, isNoted, all, late, notPassed, to, helper_1, parent_3, why, helper, parent, listed, told, r, _a;
        var _this = this;
        var _b, _c, _d, _e;
        if (isUnheard === void 0) { isUnheard = false; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!dir || isOff)
                        return [2 /*return*/];
                    key = report.trim().slice(0, ANSWER_CHARS);
                    if (passedOn.get(helperId) === key)
                        return [2 /*return*/];
                    passedOn.set(helperId, key);
                    if (!wokenFor.delete(helperId)) return [3 /*break*/, 2];
                    handedOnSkipped.add(helperId);
                    return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result went to its task, started for it"))];
                case 1: return [2 /*return*/, void (_f.sent())];
                case 2:
                    isNoted = notedAtHandback.delete(helperId);
                    return [4 /*yield*/, read($, todos)];
                case 3:
                    all = _f.sent();
                    late = all.find(function (one) { var _a; return one.id === ((_a = all.find(function (kid) { return kid.id === helperId; })) === null || _a === void 0 ? void 0 : _a.parentId); });
                    if (!(late && handedBackLetGo.has(late.id))) return [3 /*break*/, 7];
                    if (!(how === 'stopped' || stoppedByUs.has(helperId) || !key)) return [3 /*break*/, 5];
                    return [4 /*yield*/, log($, "helper ".concat(helperId, " of ").concat(late.id, " ended after its work handed back, with nothing to tell"))];
                case 4: return [2 /*return*/, void (_f.sent())];
                case 5: return [4 /*yield*/, toChatNow($, HELPER_LATE(titleOf((_b = all.find(function (one) { return one.id === helperId; })) !== null && _b !== void 0 ? _b : late), titleOf(late), isNoted))];
                case 6: return [2 /*return*/, void (_f.sent())];
                case 7:
                    notPassed = function (helper_2, parent_4, reason_1) {
                        var args_2 = [];
                        for (var _i = 3; _i < arguments.length; _i++) {
                            args_2[_i - 3] = arguments[_i];
                        }
                        return __awaiter(_this, __spreadArray([helper_2, parent_4, reason_1], args_2, true), void 0, function (helper, parent, reason, isPersons) {
                            if (isPersons === void 0) { isPersons = false; }
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result not passed on to ").concat(parent.id, ": ").concat(reason))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, toChatNow($, HELPER_NOT_PASSED(titleOf(helper !== null && helper !== void 0 ? helper : parent), titleOf(parent), parent.id, reason, isPersons))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    to = passedTo(all, helperId);
                    if (!!to) return [3 /*break*/, 10];
                    helper_1 = all.find(function (one) { return one.id === helperId; });
                    parent_3 = all.find(function (one) { return one.id === (helper_1 === null || helper_1 === void 0 ? void 0 : helper_1.parentId); });
                    why = parent_3 ? notPassedWhy(parent_3) : undefined;
                    if (!(isNoted && parent_3)) return [3 /*break*/, 9];
                    return [4 /*yield*/, notPassed(helper_1, parent_3, (_c = why === null || why === void 0 ? void 0 : why.reason) !== null && _c !== void 0 ? _c : 'that task is gone', why === null || why === void 0 ? void 0 : why.isPersons)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9: return [2 /*return*/];
                case 10:
                    helper = to.helper, parent = to.parent;
                    return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                case 11:
                    listed = (_d = (_f.sent()).find(function (one) { return one.id === parent.id; })) === null || _d === void 0 ? void 0 : _d.status;
                    if (!(listed === 'running' && (isUnheard || isNoted))) return [3 /*break*/, 15];
                    return [4 /*yield*/, tell($, parent.id, HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)))];
                case 12:
                    told = _f.sent();
                    if (!((!told || told.deny) && isNoted)) return [3 /*break*/, 14];
                    return [4 /*yield*/, notPassed(helper, parent, (_e = told === null || told === void 0 ? void 0 : told.deny) !== null && _e !== void 0 ? _e : 'it could not be written to')];
                case 13:
                    _f.sent();
                    _f.label = 14;
                case 14: return [2 /*return*/];
                case 15:
                    if (listed === 'running')
                        return [2 /*return*/];
                    return [4 /*yield*/, isReplaced($)];
                case 16:
                    if (!(_f.sent())) return [3 /*break*/, 17];
                    _a = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, sendOwn($, { to: { agentId: parent.id }, text: HELPER_ENDED(titleOf(helper), how, report.slice(0, ANSWER_CHARS)) }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })
                    // Not passed on, the result is in the chat alone: the chat is told to send it on, so nothing is lost unsaid
                ];
                case 18:
                    _a = _f.sent();
                    _f.label = 19;
                case 19:
                    r = _a;
                    if (!!r.isDelivered) return [3 /*break*/, 24];
                    if (!(listed !== 'waiting' || isNoted)) return [3 /*break*/, 21];
                    return [4 /*yield*/, notPassed(helper, parent, r.reason)];
                case 20:
                    _f.sent();
                    return [3 /*break*/, 23];
                case 21: return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result not passed on to ").concat(parent.id, ": ").concat(r.reason))];
                case 22:
                    _f.sent();
                    _f.label = 23;
                case 23: return [2 /*return*/];
                case 24: return [4 /*yield*/, wakeCard($, parent.id)];
                case 25:
                    _f.sent();
                    return [4 /*yield*/, log($, "helper ".concat(helperId, "'s result passed on to ").concat(parent.id, ", which had ended its step"))
                        // Told once the result is on its way, so the chat never lets go of a result that did not arrive; told already as it was handed back
                    ];
                case 26:
                    _f.sent();
                    if (!(listed !== 'waiting' && !isNoted)) return [3 /*break*/, 28];
                    return [4 /*yield*/, toChat($, HELPER_PASSED(titleOf(helper), titleOf(parent)))];
                case 27:
                    _f.sent();
                    _f.label = 28;
                case 28: return [2 /*return*/];
            }
        });
    });
};
// Work that handed back what it had while helpers ran, as Claudopus let it: a result one of them gives later reaches the chat, which
// is told what it is (HELPER_LATE). Until the work takes a step again
var handedBackLetGo = new Set();
// What the chat is told of a helper's result that came after its task handed back what it had; `isPassedSaid` when it was told
// already, as the helper handed back, that the result is passed on to that task
var HELPER_LATE = function (helper, work, isPassedSaid) {
    if (isPassedSaid === void 0) { isPassedSaid = false; }
    return isPassedSaid
        ? "From Claudopus, in place of its word that it passes on the result of the helper \"".concat(helper, "\": the task \"").concat(work, "\" had already handed back what it had, so Claudopus did not pass it on, and the result stays in this chat. Pass on to {name} what it adds to that task's report.")
        : "From Claudopus: the result of the helper \"".concat(helper, "\" came after the task \"").concat(work, "\" handed back what it had, so it reached this chat. Pass on to {name} what it adds to that task's report.");
};
// The helpers Claudopus stopped itself: their end tells the chat nothing
var stoppedByUs = new Set();
// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
var isHelperSpawn = function (e) { var _a; return Boolean(e.parentAgentId) && !flowAgents.has((_a = e.parentAgentId) !== null && _a !== void 0 ? _a : '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir); };
// Work that hands back its report while its helpers run is held back, so their results come to it and not to the chat; work that
// only ends its step is let go, as Claudopus passes each result on and starts it again (passOnHelper)
var holdAtHandback = function ($, agent) { return __awaiter(_this, void 0, void 0, function () {
    var list, running;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir || isOff || flowAgents.has(agent))
                    return [2 /*return*/, ''];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _a.sent();
                running = runningHelpers(list, agent).length;
                if (!running)
                    return [2 /*return*/, ''
                        // Work Claudopus told to hand back what it has (its helpers sat silent, or its wait ran out) may:
                        // helpers that sit silent are stopped as it does, and a result that comes later from one at work reaches the chat (passOnHelper)
                    ];
                if (!isLetGo(list, agent)) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "work ".concat(agent, " hands back while ").concat(running, " helpers run, as it was told to"))];
            case 2: return [2 /*return*/, (_a.sent(), '')];
            case 3: return [4 /*yield*/, log($, "work ".concat(agent, " held at its report: ").concat(running, " helpers run"))];
            case 4:
                _a.sent();
                return [2 /*return*/, HELD_AT_END(running)];
        }
    });
}); };
// Work Claudopus told to hand back what it has: its report goes through while its helpers run
var isLetGo = function (list, id) { var _a; return ((_a = list.find(function (one) { return one.id === id; })) === null || _a === void 0 ? void 0 : _a.mayHandBack) !== undefined; };
// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending, their
// results reaching the chat
// (`isSilentOnly`: only those that sit silent, at work on nothing; see isSilent)
var stopHelpers = function ($_1, id_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1], args_1, true), void 0, function ($, id, isSilentOnly) {
        var list, now, _a, _b, one, r;
        if (isSilentOnly === void 0) { isSilentOnly = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, read($, todos)];
                case 1:
                    list = _c.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    now = _c.sent();
                    _a = 0, _b = underOf(list, id).filter(function (kid) { return kid.status === 'working' && (!isSilentOnly || isSilent(list, kid, now)); });
                    _c.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    one = _b[_a];
                    stoppedByUs.add(one.id);
                    return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: one.id }).catch(function (err) { return ({ deny: String(err) }); })];
                case 4:
                    r = _c.sent();
                    if (!r.deny) return [3 /*break*/, 6];
                    return [4 /*yield*/, log($, "helper ".concat(one.id, " of ").concat(id, " not stopped: ").concat(String(r.deny)))];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/];
            }
        });
    });
};
