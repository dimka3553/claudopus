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
// Heavy commands wait their turn: a task's browser, build or render that would start while the Mac is busy and another of the
// chat's heavy commands runs is refused, with why and what it waits for. On 16 Nov ten tasks each drove headless browsers for screenshots on one Mac at once: captures timed out and
// a dev server took 13 s a request; on 15 Nov this Mac's load average reached 204 on 18 cores. What counts as heavy is heavyOf in
// hooks/jobs.ts; the marks are the person's setting (`heavy` in config.json, HEAVY_MODES in hooks/config.tsx)
//
// Nothing waits in a hook, with a sleep or on a timer: a command that must wait is refused at once with why and what it waits
// for, and its task decides what to do meanwhile and when to send it again
// After one is let go, the next waits this long unless few run, so the load of the last shows before another starts
var HEAVY_RAMP = 20000;
// The heavy calls let through whose call has not ended, by tool_use_id
var heavyOpen = new Map();
// The commands judged heavy, as cards keep a background or detached run's command, so one that goes on past its call still counts
var heavySeen = new Set();
var heavyLetAt = 0;
var keptCmd = function (command) { return oneLine(command).slice(0, 400); };
// The heavy commands of this chat's work that run now: calls held open, and those in the background that go on (never another
// chat's card, which this chat's memory of what is heavy does not cover), each in its own words
var heavyRuns = function (list) { return list.filter(function (one) { return !one.chat; }).flatMap(function (one) { var _a; return ((_a = one.bg) !== null && _a !== void 0 ? _a : []).filter(function (run) { return run.cmd && heavySeen.has(run.cmd); }).map(function (run) { return runWords(run.what, run.cmd); }); }); };
var heavyRunning = function (list) { return heavyOpen.size + heavyRuns(list).length; };
// Whether the Mac is past the setting's marks: its load average for each core, or its memory in use
var isMacBusy = function (f, mode) {
    return Boolean(f && ((f.load !== undefined && f.loadCores && f.load >= mode.load * f.loadCores) || (f.memTotal > 0 && f.memUsed / f.memTotal >= mode.memory)));
};
// Whether a heavy command may start now: always when none of the chat's runs, so it never waits on load the work does not make;
// never while the Mac is busy; else when few run, or none was let go just now, so the load of the last shows before the next
var heavyRoom = function (list, f, mode, now) {
    var _a;
    if (mode.value === 'never')
        return true;
    var running = heavyRunning(list);
    if (!running)
        return true;
    if (isMacBusy(f, mode))
        return false;
    return running < Math.max(2, Math.round(((_a = f === null || f === void 0 ? void 0 : f.loadCores) !== null && _a !== void 0 ? _a : 8) / 4)) || now - heavyLetAt >= HEAVY_RAMP;
};
// How busy the Mac is, in words
var busyWords = function (f) {
    return !f ? 'busy' : [f.load !== undefined && f.loadCores ? "load ".concat(Math.round(f.load), " on ").concat(f.loadCores, " cores") : '', f.memTotal ? "".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB memory in use") : ''].filter(Boolean).join(', ');
};
var HEAVY_HELD = function (what, f, running, open) {
    return "Not run: the Mac is busy (".concat(busyWords(f), "), and \"").concat(what, "\" is a heavy command, so it waits for ").concat(__spreadArray(__spreadArray([], running.map(function (one) { return "\"".concat(one, "\""); }), true), (open ? [open === 1 ? 'a heavy command now running' : "".concat(open, " heavy commands now running")] : []), true).join(', ') || 'the Mac to have room', " to end. Do what does not need it, and send the same command again once one of those has ended, or the Mac has room.");
};
// Whether a piece of work's Bash call runs now or must wait its turn: a deny that says why and what it waits for, else the
// call's id, to take out of heavyOpen as the call ends. Nothing waits here: the answer is given at once, and nothing sends it later
var turnHeavy = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var input, command, _a, _b, agent, list, mode, _c, id, now;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                input = e;
                command = String((_d = input.command) !== null && _d !== void 0 ? _d : '');
                _a = heavyOf;
                _b = [command];
                return [4 /*yield*/, scriptsRun($, command)];
            case 1:
                if (!_a.apply(void 0, _b.concat([_h.sent()])))
                    return [2 /*return*/, {}];
                agent = (_e = e.agentId) !== null && _e !== void 0 ? _e : '';
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _h.sent();
                if (!list.some(function (one) { return one.id === agent && !one.chat; }))
                    return [2 /*return*/, {}];
                _c = heavyModeOf;
                return [4 /*yield*/, readConfig($, dir)];
            case 3:
                mode = _c.apply(void 0, [_h.sent()]);
                if (mode.value === 'never')
                    return [2 /*return*/, {}];
                id = String((_f = input.tool_use_id) !== null && _f !== void 0 ? _f : '');
                heavySeen.add(keptCmd(command));
                return [4 /*yield*/, lookUsage($).catch(function () { return undefined; })];
            case 4:
                _h.sent();
                return [4 /*yield*/, $.clock.now()];
            case 5:
                now = _h.sent();
                if (heavyRoom(list, usageNow(now), mode, now))
                    return [2 /*return*/, (heavyOpen.set(id, agent), (heavyLetAt = now), { id: id })];
                return [4 /*yield*/, log($, "work ".concat(agent, "'s heavy command refused while the Mac is busy (").concat(busyWords(usageNow(now)), ")"))];
            case 6:
                _h.sent();
                return [2 /*return*/, { deny: HEAVY_HELD(cut(oneLine(String((_g = input.description) !== null && _g !== void 0 ? _g : '')) || labelOf('', command), 120), usageNow(now), heavyRuns(list), heavyOpen.size) }];
        }
    });
}); };
