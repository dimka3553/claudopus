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
// ---- A command Claude Code refused a task, run on the person's own press ----
// Claude Code's auto mode refuses some of a background task's commands outright (an unpack of an app, a Claude Code session driven
// for a test, a look at a site's name servers: three on 17 Nov), and the person then pasted the command into their own terminal
// and told the chat. The card that says so shows the command whole, where it runs and for how long at most, and a Run it button:
// the person's press, and only that press, has Claudopus run that very command once, as a command they type would run (bin/run-it),
// and sends the task what it printed. Nothing about the task's own calls changes: the refused call stays refused, no permission or
// setting is touched, and the task is never let run anything itself. (A "Run it once" button that let the refused call through on a
// press was dropped on 17 Nov for exactly that: it moved Claude Code's decision.)
// What may be run is kept in the mod's own state by the hook that saw Claude Code's refusal, never taken from the card: the button
// shows only for that command, on the notice it was put up with, and goes with the press
var RUN_IT = 'Run it';
// A command longer than this is not offered: it could not be read on the card before pressing
var RUN_TEXT_MOST = 4000;
// Nor one holding a character that is drawn otherwise than the shell reads it, or not at all: a control character but a line break
// or tab, a direction mark or override, a zero-width or invisible one, a tag character
var RUN_UNSEEN = new RegExp('[\\u0000-\\u0008\\u000B-\\u001F\\u007F-\\u009F\\u00AD\\u034F\\u115F\\u1160\\u180E\\u200B-\\u200F\\u2028-\\u202E\\u2060-\\u206F\\u2800\\u3164\\uFEFF\\uFFA0\\uFFF9-\\uFFFB\\u{1D173}-\\u{1D17A}\\u{E0000}-\\u{E007F}]', 'u');
// The longest a command runs once pressed: one Claude would have held open, at most its own timeout or ten minutes; one it would
// have sent to the background, an hour. Then Claudopus stops it, and the task gets what it printed by then
var RUN_LIMIT = 10 * 60000;
var RUN_LIMIT_BACKGROUND = 60 * 60000;
// How often a running one is looked at, and how much of its output the task is sent in the message (the whole is in its file)
var RUN_LOOK = 5000;
var RUN_TAIL_LINES = 30;
var RUN_TAIL_CHARS = 4000;
// Offers never pressed, ended runs, and their output files are let go after a day; a run under way is always kept
var RUN_KEPT = 24 * 60 * 60000;
var RUNS_KEPT = 40;
var RUN_END = /claudopus-exit (\d+)( stopped)?\s*$/;
// Every offer and run, kept across reloads in the mod's state; drawn from `runList`, its copy as last written or read
var runs = atom({ plugin: 'claudopus', key: 'runs' }, [], { shape: 'runs-1' });
var runList = [];
var saveRuns = function ($, fn) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                return [4 /*yield*/, update($, runs, function (list) {
                        var next = fn(list);
                        var live = function (one) { return Boolean(one.startedAt && !one.endedAt); };
                        var kept = next.filter(function (one) { var _a, _b; return !live(one) && now - ((_b = (_a = one.endedAt) !== null && _a !== void 0 ? _a : one.startedAt) !== null && _b !== void 0 ? _b : one.askAt) < RUN_KEPT; }).slice(-RUNS_KEPT);
                        return next.filter(function (one) { return live(one) || kept.includes(one); });
                    })];
            case 2:
                runList = _a.sent();
                redraw($);
                return [2 /*return*/, runList];
        }
    });
}); };
var isSameRun = function (one, other) { return one.card === other.card && one.askAt === other.askAt; };
// The command its card's notice offers, not yet pressed: only the one Claudopus kept as Claude Code refused it, on that same notice
var offeredRun = function (one) {
    var ask = one.ask;
    if (!(ask === null || ask === void 0 ? void 0 : ask.refused) || one.chat || !ask.copy)
        return undefined;
    return runList.find(function (run) { return isSameRun(run, { card: one.id, askAt: ask.at }) && run.command === ask.copy && !run.startedAt; });
};
// The runs on a card under way, and those ended whose output waits to start their ended task again
var runningOn = function (card) { return runList.filter(function (run) { return run.card === card && run.startedAt && (!run.endedAt || isRunWaking(run)); }); };
// The ones the person stopped, for this load (the stop is also written in its output)
var runStopped = new Set();
var runKey = function (run) { return "".concat(run.card, ":").concat(run.askAt); };
// The presses this load took, so two at once run it once, and the ask a press cleared that starts its run (answerCleared)
var runPressed = new Set();
var runAsked = new Map();
// Ended runs whose output waits to start their ended task again, at the next hook of this chat (or the person's press of Send it
// now): kept with the run (`waiting`) until the wake that carries it is sent (runsSent), and queued by this load in `runWaking`
var runWaking = new Set();
var isRunWaking = function (run) { return Boolean(run.waiting); };
// Queues what waits, for a run this load has not queued yet (after a reload too)
var queueWaiting = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, _a, run;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _loop_1 = function (run) {
                    var key, card, target, wake;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                key = runKey(run);
                                if (runWaking.has(key) || !run.waiting)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, read($, todos)];
                            case 1:
                                card = (_f.sent()).find(function (one) { return one.id === run.card; });
                                if (!(!card || isHeld(card))) return [3 /*break*/, 5];
                                return [4 /*yield*/, saveRuns($, function (list) { return list.map(function (one) { return (isSameRun(one, run) ? __assign(__assign({}, one), { waiting: undefined }) : one); }); })];
                            case 2:
                                _f.sent();
                                if (!card) return [3 /*break*/, 4];
                                return [4 /*yield*/, stepLine($, run.card, "Claude didn't get your command's output as you stopped the task \u00B7 it's in ".concat((_b = run.log) !== null && _b !== void 0 ? _b : 'its output file'))];
                            case 3:
                                _f.sent();
                                _f.label = 4;
                            case 4: return [2 /*return*/, "continue"];
                            case 5:
                                runWaking.add(key);
                                target = run.waiting.target;
                                return [4 /*yield*/, toEnded($, card, target, "".concat(run.waiting.text, "\n").concat(RESUMED_BY_ANSWER), { text: RUN_IT, ask: "the command Claude Code refused (".concat(cut(run.description || run.command, 60), ")"), at: (_c = run.endedAt) !== null && _c !== void 0 ? _c : 0, line: lineOf(card), isCard: true, isRun: true, askAt: run.askAt }, true)];
                            case 6:
                                _f.sent();
                                wake = wakes.find(function (w) { return w.target === target && w.isHookOnly; });
                                if (wake)
                                    wake.runs = __spreadArray(__spreadArray([], ((_d = wake.runs) !== null && _d !== void 0 ? _d : []), true), [key], false);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = runList.filter(function (one) { return one.waiting; });
                _e.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                run = _a[_i];
                return [5 /*yield**/, _loop_1(run)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// The wake that carried what runs printed has gone: sent, not sent as the person stopped the task, or not delivered (the chat is
// then given it, wakeFailed). Each run stops waiting, and its card says what became of it
var runsSent = function ($, wake, how) { return __awaiter(_this, void 0, void 0, function () {
    var keys, done, _i, done_1, run;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                keys = (_a = wake.runs) !== null && _a !== void 0 ? _a : [];
                if (!keys.length)
                    return [2 /*return*/];
                done = runList.filter(function (run) { return keys.includes(runKey(run)) && run.waiting; });
                return [4 /*yield*/, saveRuns($, function (list) { return list.map(function (one) { return (keys.includes(runKey(one)) ? __assign(__assign({}, one), { waiting: undefined }) : one); }); })];
            case 1:
                _d.sent();
                _i = 0, done_1 = done;
                _d.label = 2;
            case 2:
                if (!(_i < done_1.length)) return [3 /*break*/, 9];
                run = done_1[_i];
                runWaking.delete(runKey(run));
                if (!(how === 'sent')) return [3 /*break*/, 4];
                return [4 /*yield*/, stepLine($, run.card, "Claude got your command's output")];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                if (!(how === 'held')) return [3 /*break*/, 6];
                return [4 /*yield*/, stepLine($, run.card, "Claude didn't get your command's output as you stopped the task \u00B7 it's in ".concat((_b = run.log) !== null && _b !== void 0 ? _b : 'its output file'))];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                if (!(how === 'failed')) return [3 /*break*/, 8];
                return [4 /*yield*/, stepLine($, run.card, "Your command's output couldn't start Claude again, so it went to the chat \u00B7 it's in ".concat((_c = run.log) !== null && _c !== void 0 ? _c : 'its output file'))];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9: return [2 /*return*/];
        }
    });
}); };
var limitText = function (ms) { return (ms >= 60 * 60000 ? "".concat(Math.round(ms / 3600000), " hour").concat(ms >= 2 * 3600000 ? 's' : '') : "".concat(Math.max(1, Math.round(ms / 60000)), " min")); };
// What a refused call may be offered as: a command of the Bash tool, short enough to read and drawn as it runs, with the folder it
// runs in (the chat's, where a task's commands start) and its limit
var runnableOf = function (tool, call) {
    var command = typeof call.command === 'string' ? call.command.trim() : '';
    if (tool !== 'Bash' || !command || command.length > RUN_TEXT_MOST || RUN_UNSEEN.test(command))
        return undefined;
    var asked = typeof call.timeout === 'number' && call.timeout > 0 ? Math.min(call.timeout, RUN_LIMIT) : RUN_LIMIT;
    var limitMs = call.run_in_background === true ? RUN_LIMIT_BACKGROUND : asked;
    return { command: command, cwd: cwd || dir.replace(/\/\.claude\/claudopus$/, ''), limitMs: limitMs, description: typeof call.description === 'string' ? oneLine(call.description) : '' };
};
// Kept as its notice goes up on the card, by the hook that saw Claude Code refuse it; output files over a day old go meanwhile
var offerRun = function ($, card, from, askAt, runnable) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, saveRuns($, function (list) { return __spreadArray(__spreadArray([], list.filter(function (one) { return !isSameRun(one, { card: card, askAt: askAt }); }), true), [__assign({ card: card, from: from, askAt: askAt }, runnable)], false); })];
            case 1:
                _a.sent();
                if (dir)
                    void $.process.run(['find', "".concat(dir, "/runs"), '-type', 'f', '-name', '*.log', '-mtime', '+1', '-delete'], { timeoutMs: 15000 }).catch(function () { return undefined; });
                return [2 /*return*/];
        }
    });
}); };
// What the card and the chat say of it before the press (where and for how long are said under the command: runWhere)
var runDetails = function () {
    return "".concat(RUN_IT, ": Claudopus runs exactly the command below, once, as yours, and sends the task what it printed. Nothing else changes: Claude Code still decides each of the task's own calls. ").concat(CARRY_ON, ": it doesn't run, and the task goes on without it.");
};
// The Run it press on the card in this chat's own panel: the one way a run starts. The notice is answered first, as any press
// answers it; only once it has been cleared does the command start (answerCleared calls startRun). A press whose answer could not
// be written leaves the button to be pressed again
var runIt = function ($, one) { return __awaiter(_this, void 0, void 0, function () {
    var run;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                presses += 1;
                run = offeredRun(one);
                if (!run || runPressed.has(runKey(run)))
                    return [2 /*return*/];
                runPressed.add(runKey(run));
                runAsked.set(one.id, run);
                _b.label = 1;
            case 1:
                _b.trys.push([1, , 3, 4]);
                return [4 /*yield*/, answerAsk($, one, RUN_IT)];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                runAsked.delete(one.id);
                if (!((_a = runList.find(function (other) { return isSameRun(other, run); })) === null || _a === void 0 ? void 0 : _a.startedAt))
                    runPressed.delete(runKey(run));
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Started once its notice is cleared, on that press; whatever goes wrong is said on the card, and the task is told
var startRun = function ($, one, run) { return __awaiter(_this, void 0, void 0, function () {
    var at, logFile, target, isLogged, r, _a, pid, why, card, stops;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _c.sent();
                logFile = "".concat(dir, "/runs/").concat(slug(one.id) || 'work', "-").concat(at, ".log");
                target = run.from || one.id;
                return [4 /*yield*/, $.fs.write(logFile, '').then(function () { return true; }).catch(function () { return false; })];
            case 2:
                isLogged = _c.sent();
                if (!isLogged) return [3 /*break*/, 4];
                return [4 /*yield*/, $.process.run(["".concat($.plugin.root, "/bin/run-it"), 'start', run.command, logFile, run.cwd], { cwd: run.cwd, timeoutMs: 15000 }).catch(function (err) { return ({ exitCode: 1, stdout: '', stderr: String(err) }); })];
            case 3:
                _a = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = { exitCode: 1, stdout: '', stderr: 'its output file could not be made' };
                _c.label = 5;
            case 5:
                r = _a;
                pid = r.exitCode === 0 ? (_b = /^(\d+)\s*$/.exec(r.stdout.trim())) === null || _b === void 0 ? void 0 : _b[1] : undefined;
                if (!!pid) return [3 /*break*/, 10];
                why = cut(oneLine(r.stderr), 100) || 'no reason given';
                return [4 /*yield*/, log($, "run of the refused command for ".concat(one.id, " not started: ").concat(why))];
            case 6:
                _c.sent();
                return [4 /*yield*/, saveRuns($, function (list) { return list.map(function (other) { return (isSameRun(other, run) ? __assign(__assign({}, other), { startedAt: at, endedAt: at, end: 'lost' }) : other); }); })];
            case 7:
                _c.sent();
                return [4 /*yield*/, stepLine($, one.id, "Your command didn't start: Claudopus could not start it (".concat(why, ")"))];
            case 8:
                _c.sent();
                return [4 /*yield*/, deliverRun($, one.id, target, run, named("{Name} pressed \"".concat(RUN_IT, "\" on your card for the command Claude Code refused, but Claudopus could not start it (").concat(why, "), so it did not run. What Claude Code refused stays refused: do not do it yourself. Carry on without it, and say in your report what was left out.")), at)];
            case 9:
                _c.sent();
                return [2 /*return*/];
            case 10: return [4 /*yield*/, saveRuns($, function (list) { return list.map(function (other) { return (isSameRun(other, run) ? __assign(__assign({}, other), { startedAt: at, log: logFile, pid: pid }) : other); }); })];
            case 11:
                _c.sent();
                return [4 /*yield*/, log($, "refused command for ".concat(one.id, " run on ").concat(who(), "'s press, in ").concat(run.cwd))];
            case 12:
                _c.sent();
                return [4 /*yield*/, read($, todos)];
            case 13:
                card = (_c.sent()).find(function (other) { return other.id === target; });
                stops = run.limitMs >= RUN_LIMIT_BACKGROUND ? "It is stopped after ".concat(limitText(run.limitMs), " if it is still running then.") : "It is stopped after ".concat(limitText(run.limitMs), " at most.");
                if (!((card === null || card === void 0 ? void 0 : card.status) === 'working')) return [3 /*break*/, 15];
                return [4 /*yield*/, tell($, target, named("{Name} pressed \"".concat(RUN_IT, "\" on your card for the command Claude Code refused, and Claudopus is running it for them now, exactly as shown, in ").concat(run.cwd, ". What it prints goes to ").concat(logFile, ", which you can read as it runs; when it ends, its last lines come to you as a message. ").concat(stops, " Do not run it yourself; carry on with what does not need it, or end your step.")))];
            case 14:
                _c.sent();
                _c.label = 15;
            case 15:
                followRun($, __assign(__assign({}, run), { startedAt: at, log: logFile, pid: pid }));
                return [2 /*return*/];
        }
    });
}); };
// Each run under way is looked at every RUN_LOOK by this load, a reload's own load taking over the ones it finds (followRuns)
var followed = new Set();
var followRuns = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _i, runList_1, run;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, runs)];
            case 1:
                runList = _a.sent();
                for (_i = 0, runList_1 = runList; _i < runList_1.length; _i++) {
                    run = runList_1[_i];
                    if (run.startedAt && !run.endedAt && run.log && run.pid)
                        followRun($, run);
                }
                return [4 /*yield*/, queueWaiting($)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var followRun = function ($, run) {
    var key = runKey(run);
    if (followed.has(key))
        return;
    followed.add(key);
    var isLooking = false;
    var timer = everyLoad($, RUN_LOOK, function () {
        if (isLooking)
            return;
        isLooking = true;
        void lookRun($, run)
            .then(function (isEnded) { return isEnded && (timer.cancel(), followed.delete(key)); })
            .catch(function (err) { return log($, "run of ".concat(run.card, " not followed: ").concat(String(err))); })
            .finally(function () { return (isLooking = false); });
    });
};
// Its output's end: what it printed, and how it ended once it has (stopped, when the stop wrote so)
var runOutputOf = function (text) {
    var end = RUN_END.exec(text);
    var lines = text.replace(RUN_END, '').replace(/\s+$/, '').split('\n');
    return { exit: end ? Number(end[1]) : undefined, isStopped: Boolean(end === null || end === void 0 ? void 0 : end[2]), lines: lines };
};
var lookRun = function ($, run) { return __awaiter(_this, void 0, void 0, function () {
    var now, out, _a, at, stopped, _b, _c, _d, alive, late, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                now = (_f = runList.find(function (one) { return isSameRun(one, run); })) !== null && _f !== void 0 ? _f : run;
                if (now.endedAt || !run.log || !run.pid || !run.startedAt)
                    return [2 /*return*/, true];
                during('look at a command run on a press');
                _a = runOutputOf;
                return [4 /*yield*/, fileEnd($, run.log, 64000)];
            case 1:
                out = _a.apply(void 0, [_g.sent()]);
                return [4 /*yield*/, $.clock.now()];
            case 2:
                at = _g.sent();
                stopped = function (isStopped) { return (isStopped || runStopped.has(runKey(run)) ? 'stopped' : 'exited'); };
                if (!(out.exit !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, endRun($, run, stopped(out.isStopped), out.exit, out.lines)];
            case 3: return [2 /*return*/, (void (_g.sent()), true)];
            case 4:
                if (!(at - run.startedAt > run.limitMs)) return [3 /*break*/, 8];
                return [4 /*yield*/, stopProcess($, run)];
            case 5:
                _g.sent();
                _b = endRun;
                _c = [$, run, 'limit', undefined];
                _d = runOutputOf;
                return [4 /*yield*/, fileEnd($, run.log, 64000)];
            case 6: return [4 /*yield*/, _b.apply(void 0, _c.concat([_d.apply(void 0, [_g.sent()]).lines]))];
            case 7: return [2 /*return*/, (void (_g.sent()), true)];
            case 8: return [4 /*yield*/, $.process.run(["".concat($.plugin.root, "/bin/run-it"), 'alive', run.pid, run.log], { timeoutMs: 10000 }).catch(function () { return undefined; })];
            case 9:
                alive = _g.sent();
                if (!(alive && alive.exitCode !== 0)) return [3 /*break*/, 12];
                _e = runOutputOf;
                return [4 /*yield*/, fileEnd($, run.log, 64000)];
            case 10:
                late = _e.apply(void 0, [_g.sent()]);
                return [4 /*yield*/, endRun($, run, late.exit !== undefined ? stopped(late.isStopped) : runStopped.has(runKey(run)) ? 'stopped' : 'lost', late.exit, late.lines)];
            case 11: return [2 /*return*/, (void (_g.sent()), true)];
            case 12: return [2 /*return*/, false];
        }
    });
}); };
var stopProcess = function ($, run) {
    return run.pid && run.log ? $.process.run(["".concat($.plugin.root, "/bin/run-it"), 'stop', run.pid, run.log], { timeoutMs: 15000 }).catch(function (err) { return log($, "run of ".concat(run.card, " not stopped: ").concat(String(err))); }) : Promise.resolve();
};
// The person's Stop on its row
var stopRun = function ($, run) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                if (runStopped.has(runKey(run)))
                    return [2 /*return*/];
                runStopped.add(runKey(run));
                redraw($);
                return [4 /*yield*/, stopProcess($, run)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// What the task is sent: written in while it runs; else it is started again with it from the next hook of this chat (a prompt, a
// turn's end, a press), never from a timer, where work started again runs with the mod's hooks skipped. Its card shows meanwhile
// that the output waits, with a press that sends it at once. Says whether it was sent now, waits, or is not sent (a stopped task)
var deliverRun = function ($, cardId, target, run, text, at) { return __awaiter(_this, void 0, void 0, function () {
    var card, isWorking, told, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                card = (_c.sent()).find(function (one) { return one.id === cardId; });
                if (!card)
                    return [2 /*return*/, 'held'];
                return [4 /*yield*/, read($, todos)];
            case 2:
                isWorking = ((_b = (_c.sent()).find(function (one) { return one.id === target; })) === null || _b === void 0 ? void 0 : _b.status) === 'working';
                if (!isWorking) return [3 /*break*/, 4];
                return [4 /*yield*/, tell($, target, text)];
            case 3:
                _a = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = undefined;
                _c.label = 5;
            case 5:
                told = _a;
                if (told && !told.deny)
                    return [2 /*return*/, 'sent'
                        // A task the person stopped is not started again: what it printed stays in its file
                    ];
                // A task the person stopped is not started again: what it printed stays in its file
                if (isHeld(card))
                    return [2 /*return*/, 'held'];
                return [4 /*yield*/, saveRuns($, function (list) { return list.map(function (one) { return (isSameRun(one, run) ? __assign(__assign({}, one), { waiting: { target: target, text: text } }) : one); }); })];
            case 6:
                _c.sent();
                return [4 /*yield*/, queueWaiting($)];
            case 7:
                _c.sent();
                return [2 /*return*/, 'waits'];
        }
    });
}); };
// Its end: kept, sent to the task, and said on the card
var endRun = function ($, run, end, exit, lines) { return __awaiter(_this, void 0, void 0, function () {
    var at, isFirst, last, ran, how, tail, text, sent, ended, said;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _c.sent();
                isFirst = false;
                last = oneLine((_a = lines.filter(function (line) { return line.trim(); }).at(-1)) !== null && _a !== void 0 ? _a : '').slice(0, 300);
                return [4 /*yield*/, saveRuns($, function (list) { return ((isFirst = false), list).map(function (one) { return (isSameRun(one, run) && !one.endedAt ? ((isFirst = true), __assign(__assign(__assign(__assign({}, one), { endedAt: at, end: end }), (exit === undefined ? {} : { exit: exit })), (last ? { last: last } : {}))) : one); }); })];
            case 2:
                _c.sent();
                if (!isFirst)
                    return [2 /*return*/];
                runStopped.delete(runKey(run));
                ran = took(at - ((_b = run.startedAt) !== null && _b !== void 0 ? _b : at));
                how = {
                    exited: exit === 0 ? "ended well after ".concat(ran) : "ended with exit ".concat(exit, " after ").concat(ran),
                    limit: "was stopped by Claudopus at its limit of ".concat(limitText(run.limitMs)),
                    stopped: "was stopped by {name} after ".concat(ran),
                    lost: "stopped after ".concat(ran, " without saying how it ended"),
                }[end];
                tail = cut(lines.slice(-RUN_TAIL_LINES).join('\n'), RUN_TAIL_CHARS);
                return [4 /*yield*/, log($, "refused command for ".concat(run.card, " run on ").concat(who(), "'s press ").concat(named(how)))];
            case 3:
                _c.sent();
                text = named("{Name} pressed \"".concat(RUN_IT, "\" on your card for the command Claude Code refused, and Claudopus ran it for them, exactly as shown, once, in ").concat(run.cwd, ":\n").concat(run.command, "\nIt ").concat(how, ". Its whole output is in ").concat(run.log, "; ").concat(tail ? "its last lines:\n".concat(tail) : 'it printed nothing.', "\nThat ran on {name}'s own press, as theirs: it is no permission. Claude Code still decides each call of yours, so do not run it, or another way to the same end, yourself. Use what it printed; if you need it run again, ask {name} with the command."));
                return [4 /*yield*/, deliverRun($, run.card, run.from || run.card, run, text, at)
                    // (said to the person in the card's own words: the task is told the exit code above)
                ];
            case 4:
                sent = _c.sent();
                ended = { exited: exit === 0 ? "Your command ended after ".concat(ran) : "Your command failed after ".concat(ran), limit: "Claudopus stopped your command at its limit of ".concat(limitText(run.limitMs)), stopped: "You stopped your command after ".concat(ran), lost: "Your command stopped after ".concat(ran) }[end];
                said = { sent: ' · Claude got its output', waits: '', held: " \u00B7 you stopped the task, so Claude didn't get its output" }[sent];
                return [4 /*yield*/, stepLine($, run.card, "".concat(ended).concat(said))];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// On the card, before the press: where it runs and for how long at most, under the command; then the button
var runWhere = function (ui, one, key) {
    var run = offeredRun(one);
    return run ? <ui.Text key={"".concat(key, "-where")} dimColor wrap="wrap">{"Runs in ".concat(shortPath(run.cwd, 60), ", as a command you type would, for at most ").concat(limitText(run.limitMs))}</ui.Text> : null;
};
var runButton = function ($, ui, one, key) { var _a, _b; return offeredRun(one) ? <ui.Button key={"".concat(key, "-run-").concat((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0, "-").concat(loadMark)} label={RUN_IT} onPress={function () { return void runIt($, one).catch(function (err) { return log($, "refused command not run: ".concat(String(err))); }); }}/> : null; };
// While it runs: one quiet line, how long it has run, and Stop it; the command itself is not shown again, the person saw it before
// pressing (17 Nov). Once it has ended with its output waiting for its ended task: that, and a press that sends it now (its own hook
// sends what waits: tabs.tsx)
var runBlock = function ($, ui, one, key, at) {
    var list = one.chat ? [] : runningOn(one.id);
    if (!list.length)
        return null;
    return (<ui.Box key={key} flexDirection="column">
      {list.map(function (run) {
            var _a;
            var isStopping = runStopped.has(runKey(run));
            var isEnded = Boolean(run.endedAt);
            var what = list.length > 1 && run.description ? "\u201C".concat(cut(run.description, 60), "\u201D") : 'your command';
            var said = isEnded ? (what === 'your command' ? 'Its output waits for Claude' : "".concat(what, " \u00B7 its output waits for Claude")) : isStopping ? "Stopping ".concat(what) : "Running ".concat(what);
            return (<ui.Box key={"".concat(key, "-").concat(run.askAt)} flexDirection="row" gap={1} height={1} overflow="hidden">
            <ui.Box flexDirection="row" flexShrink={1} minWidth={0} height={1} overflow="hidden">
              <ui.Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                <ui.Text dimColor wrap="truncate-end">{said}</ui.Text>
              </ui.Box>
              {isEnded || isStopping ? null : (<ui.Box flexShrink={0}>
                  <ui.Text dimColor>{" \u00B7 ".concat(took(at - ((_a = run.startedAt) !== null && _a !== void 0 ? _a : at)))}</ui.Text>
                </ui.Box>)}
            </ui.Box>
            {isEnded ? (<ui.Box flexShrink={0}>
                <ui.Button key={"".concat(key, "-").concat(run.askAt, "-send-").concat(loadMark)} label="Send now" plain hover={{ scope: "".concat(key, "-").concat(run.askAt, "-send"), underline: true }} onPress={function () { return ((presses += 1), redraw($)); }}/>
              </ui.Box>) : isStopping ? null : (<ui.Box flexShrink={0}>
                <ui.Button key={"".concat(key, "-").concat(run.askAt, "-stop-").concat(loadMark)} label="Stop it" plain dimColor hover={{ scope: "".concat(key, "-").concat(run.askAt, "-stop"), underline: true }} onPress={function () { return void stopRun($, run).catch(function (err) { return log($, "run not stopped: ".concat(String(err))); }); }}/>
              </ui.Box>)}
          </ui.Box>);
        })}
    </ui.Box>);
};
