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
// ---- What tasks leave behind, and the disk it fills ----
// On 19 Nov the person's Mac had under 1 GB of disk free: 205 copies Google Chrome made of itself each time a task started it
// without a window and it was stopped, 88 scratch folders of catch-up runs that were stopped (9.7 GB), browser profiles, task
// scratch folders untouched for days (36 GB) and worktrees merged long ago (19 GB). bin/tidy removes what is left of each and
// keeps what may matter (it says what); every chat starts it as it starts the catch-up, and again as a task ends, and it runs at
// most every ten minutes, one at a time. The disk is looked at every half minute: under DISK_WARN the panel says so at its top,
// with Free up space, and a notification says it once every few hours; under DISK_STOP a task's download, install, build,
// render or browser command is refused at once with why
var TIDY_AFTER = 2 * 60000;
var TIDY_EVERY = 10 * 60000;
var DISK_EVERY = 30000;
var DISK_WARN = 20 * Math.pow(1024, 3);
var DISK_STOP = 5 * Math.pow(1024, 3);
var DISK_TOLD_EVERY = 6 * 3600000;
var diskKept;
var diskTriedAt = -Infinity;
var diskLowSince = 0;
var diskToldAt = -Infinity;
// The person's press on Free up space, and what the last run of bin/tidy freed (its tidy/last.json)
var tidyPressedAt = 0;
var tidyLast;
// In a session of its own, at a low priority, as the catch-up: it outlives the chat, and its log is set aside past a megabyte
var TIDY_START = "d=$1; shift; l=\"$d/tidy/log.txt\"; mkdir -p \"$d/tidy\" || exit 1; [ -f \"$l\" ] && [ \"$(wc -c < \"$l\")\" -gt 1000000 ] && mv -f \"$l\" \"$l.old\"; nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' nice -n 10 \"$@\" >> \"$l\" 2>&1 < /dev/null &";
var startTidy = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, flags) {
        var r;
        if (flags === void 0) { flags = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dir || isOff)
                        return [2 /*return*/];
                    return [4 /*yield*/, $.process.run(__spreadArray(__spreadArray(['/bin/sh', '-c', TIDY_START, 'sh', dir, "".concat($.plugin.root, "/bin/tidy")], flags, true), [dir], false))];
                case 1:
                    r = _a.sent();
                    if (!(r.exitCode !== 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "leftovers not tidied: ".concat(r.stderr.slice(0, 200)))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
};
// The disk the person's files are on, as df gives it in kilobytes: its size, what is used, what is left
var DISK_LOOK = '# disk left\ndf -Pk "$HOME" 2>/dev/null | tail -n 1';
var diskOf = function (text, at) {
    var m = /(\d+)\s+(\d+)\s+(\d+)\s+\d+%/.exec(text);
    return m ? { at: at, total: Number(m[1]) * 1024, free: Number(m[3]) * 1024 } : undefined;
};
var lastOf = function (text) {
    try {
        var j = JSON.parse(text);
        return typeof j.at === 'number' ? { at: j.at, freed: typeof j.freed === 'number' ? j.freed : 0 } : undefined;
    }
    catch (_a) {
        return undefined;
    }
};
var isDiskLow = function (d) { return Boolean(d && d.free < DISK_WARN); };
var isDiskFull = function (d) { return Boolean(d && d.free < DISK_STOP); };
// One look when the last is due: the panel redraws when what it says changes, and a disk that runs low is told once in a while
var lookDisk = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, r, was, wasLast, _a, said;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _e.sent();
                if (now >= diskTriedAt && now - diskTriedAt < DISK_EVERY / 2)
                    return [2 /*return*/, diskKept];
                diskTriedAt = now;
                return [4 /*yield*/, $.process.run(['sh', '-c', DISK_LOOK], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 2:
                r = _e.sent();
                was = diskKept;
                wasLast = tidyLast;
                diskKept = (_c = diskOf((_b = r === null || r === void 0 ? void 0 : r.stdout) !== null && _b !== void 0 ? _b : '', now)) !== null && _c !== void 0 ? _c : diskKept;
                if (!dir) return [3 /*break*/, 4];
                _a = lastOf;
                return [4 /*yield*/, $.fs.read("".concat(dir, "/tidy/last.json")).catch(function () { return ''; })];
            case 3:
                tidyLast = (_d = _a.apply(void 0, [_e.sent()])) !== null && _d !== void 0 ? _d : tidyLast;
                _e.label = 4;
            case 4:
                if (!isDiskLow(diskKept))
                    diskLowSince = 0;
                else if (!diskLowSince)
                    diskLowSince = now;
                said = function (d) { var _a; return (isDiskLow(d) ? "".concat(gbText((_a = d === null || d === void 0 ? void 0 : d.free) !== null && _a !== void 0 ? _a : 0), ":").concat(isDiskFull(d)) : ''); };
                if (said(was) !== said(diskKept) || (wasLast === null || wasLast === void 0 ? void 0 : wasLast.at) !== (tidyLast === null || tidyLast === void 0 ? void 0 : tidyLast.at))
                    drawAgain($);
                if (!(diskKept && isDiskLow(diskKept) && !isOff)) return [3 /*break*/, 6];
                return [4 /*yield*/, tellDisk($, diskKept, now)];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6: return [2 /*return*/, diskKept];
        }
    });
}); };
// A notification, once in DISK_TOLD_EVERY, whichever chat looks first
var tellDisk = function ($, d, now) { return __awaiter(_this, void 0, void 0, function () {
    var told, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (now >= diskToldAt && now - diskToldAt < DISK_TOLD_EVERY)
                    return [2 /*return*/];
                diskToldAt = now;
                if (!dir) return [3 /*break*/, 2];
                _b = Number;
                return [4 /*yield*/, $.fs.read("".concat(dir, "/tidy/told")).catch(function () { return '0'; })];
            case 1:
                _a = _b.apply(void 0, [_c.sent()]) || 0;
                return [3 /*break*/, 3];
            case 2:
                _a = 0;
                _c.label = 3;
            case 3:
                told = _a;
                if (now >= told && now - told < DISK_TOLD_EVERY)
                    return [2 /*return*/];
                if (!dir) return [3 /*break*/, 5];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/tidy/told"), String(now)).catch(function () { return undefined; })];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5: return [4 /*yield*/, alertPerson($, 'disk', 'Your Mac is almost out of disk space', "".concat(gbText(d.free), " GB left. Free up space from the Claudopus panel."), 'disk-low')];
            case 6:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// The person's press: bin/tidy at once, with the download caches too; the block says it frees space until its run ends
var freeSpace = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                tidyPressedAt = _a.sent();
                presses += 1;
                diskTriedAt = -Infinity;
                drawAgain($);
                return [4 /*yield*/, log($, 'the person asked to free up disk space')];
            case 2:
                _a.sent();
                return [4 /*yield*/, startTidy($, ['--now', '--deep'])];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The block at the top of the panel while the disk is low
var diskNeeds = function ($) {
    var d = diskKept;
    if (!dir || isOff || !d || !isDiskLow(d))
        return [];
    var isDone = Boolean(tidyPressedAt && tidyLast && tidyLast.at >= tidyPressedAt);
    var isFreeing = Boolean(tidyPressedAt) && !isDone;
    var stop = gbText(DISK_STOP);
    return [
        __assign({ id: 'disk-low', kind: 'disk', at: diskLowSince || d.at, text: "Your Mac has ".concat(gbText(d.free), " GB of disk space left. Free up space?"), details: [
                isDiskFull(d) ? "Tasks' downloads, installs, builds, renders and browser commands wait until more than ".concat(stop, " GB is free.") : "Below ".concat(stop, " GB, tasks' downloads, installs, builds, renders and browser commands wait."),
                'Free up space removes what tasks left behind: temporary files, copies Chrome made of itself, browser profiles, scratch folders untouched for 2 days, code copies whose work is merged, and download caches. Pictures a result shows move into its folder first. Your CT data, photos, videos and Desktop are never touched.',
            ].join('\n\n'), buttons: isFreeing ? [] : [{ key: "disk-free-".concat(tidyPressedAt, "-").concat(presses), label: 'Free up space', onPress: function () { return void freeSpace($).catch(function (err) { return log($, "space not freed: ".concat(String(err))); }); } }] }, (isFreeing ? { line: 'Freeing up space' } : isDone && tidyLast ? { line: "Freed ".concat(gbText(tidyLast.freed), " GB") } : {})),
    ];
};
// Whether a task's command may run: refused at once with why, else '' (the disk running out, or Chrome copied for nothing)
var CHROME_APP = /\/Google Chrome\.app\/Contents\/MacOS\/Google Chrome(?![\w ]*(?:Helper|for Testing))/;
var CHROME_IN_SCRIPT = /executablePath\s*[:=]\s*[^\n]*\/Google Chrome\.app\b|\bchannel\s*[:=]\s*['"]chrome(?:-beta|-dev|-canary)?['"]/;
var CHROME_COPIED = "Not run: this starts your own Google Chrome app without a window. Each start makes a copy of the whole app on the disk, and a start that is stopped leaves it there. Use Playwright's own Chromium instead (chromium.launch() with no channel or executablePath, after npx playwright install chromium), start it once for every page the script needs, and close it in a finally block.";
var DISK_FULL = function (what, d) {
    return named("Not run: the Mac has ".concat(gbText(d.free), " GB of disk space left, and \"").concat(what, "\" can fill it. Remove what you made that is no longer needed (your scratch folder, temporary files), run heavy work in the cloud, and send the same command again once more than ").concat(gbText(DISK_STOP), " GB is free. {Name} can free up space from the Claudopus panel."));
};
var turnLeftovers = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var input, command, agent, _a, scripts, plain, d;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                input = e;
                command = String((_b = input.command) !== null && _b !== void 0 ? _b : '');
                agent = (_c = e.agentId) !== null && _c !== void 0 ? _c : '';
                _a = !command;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, read($, todos)];
            case 1:
                _a = !(_e.sent()).some(function (one) { return one.id === agent && !one.chat; });
                _e.label = 2;
            case 2:
                if (_a)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, scriptsRun($, command)];
            case 3:
                scripts = _e.sent();
                plain = command.replace(/\\ /g, ' ').replace(/["']/g, '');
                if (!((CHROME_APP.test(plain) && /--headless\b/.test(plain)) || scripts.some(function (text) { return CHROME_IN_SCRIPT.test(text) || (CHROME_APP.test(text) && /--headless\b/.test(text)); }))) return [3 /*break*/, 5];
                return [4 /*yield*/, log($, "refused work ".concat(agent, "'s command that starts the person's own Chrome without a window"))];
            case 4:
                _e.sent();
                return [2 /*return*/, CHROME_COPIED];
            case 5:
                if (!heavyOf(command, scripts) && jobKindOf(command, '') !== 'download')
                    return [2 /*return*/, ''];
                return [4 /*yield*/, lookDisk($).catch(function () { return diskKept; })];
            case 6:
                d = _e.sent();
                if (!d || !isDiskFull(d))
                    return [2 /*return*/, ''];
                return [4 /*yield*/, log($, "refused work ".concat(agent, "'s command while the disk has ").concat(gbText(d.free), " GB left"))];
            case 7:
                _e.sent();
                return [2 /*return*/, DISK_FULL(cut(oneLine(String((_d = input.description) !== null && _d !== void 0 ? _d : '')) || labelOf('', command), 120), d)];
        }
    });
}); };
