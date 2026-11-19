// Steps that could have gone out together: after each step of work, a line in its next request when the step shows a pattern that
// costs time (a helper started alone, a run of single lookups, long runs of one kind one after another, a step of only to-dos, a
// commit with no second look started)
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
var BOOK = ['todo', 'note', 'update', 'recall', 'ask'];
var isBook = function (tool) { return BOOK.some(function (name) { return isTool(tool, name); }) || tool === 'ToolSearch' || tool === 'TodoWrite'; };
// A lookup: a read of one file or one search, which a step can send several of at once
var LOOKUP_TOOLS = ['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];
var LOOKUP_COMMAND = /^\s*(?:cd \S+ && )?(?:cat|head|tail|less|wc|ls|rg|grep|find|sed -n|jq|git (?:-C \S+ )?(?:log|show|diff|status|blame|grep))\b/;
var isLookup = function (tool, input) { var _a; return LOOKUP_TOOLS.includes(tool) || (tool === 'Bash' && !(input === null || input === void 0 ? void 0 : input.run_in_background) && LOOKUP_COMMAND.test(String((_a = input === null || input === void 0 ? void 0 : input.command) !== null && _a !== void 0 ? _a : ''))); };
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
    var kind = one && command && one.tookMs >= LONG_RUN && !isLookup(one.tool, one.input) ? kindOf(command) : '';
    if (kind && seen.lastRun === kind)
        say('serial', SERIAL_RUNS(kind));
    seen.lastRun = kind || (one ? undefined : seen.lastRun);
    // A commit with no second look started
    if (isTop && lean.second !== 'asked' && seen.checkerAt === undefined && work.some(function (call) { var _a, _b; return call.tool === 'Bash' && COMMIT.test(String((_b = (_a = call.input) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '')); }))
        say('look', LOOK_NOW);
    return lines;
};
var stepHooks = function (on) {
    // After each step of a piece of work or a helper: the patterns its calls show, as lines in its next request
    on('classic.PostToolBatch', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, agent, now, calls, _i, _a, call, card, lines;
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
                    lines = stepLines(agent, calls, !(card === null || card === void 0 ? void 0 : card.parentId));
                    if (!lines.length)
                        return [2 /*return*/, r];
                    return [4 /*yield*/, log($, "work ".concat(agent, " told of its step: ").concat(lines.map(function (line) { return line.slice(0, 40); }).join(' / ')))];
                case 4:
                    _c.sent();
                    return [2 /*return*/, __assign(__assign({}, r), { additionalContext: __spreadArray(__spreadArray([], ((_b = r.additionalContext) !== null && _b !== void 0 ? _b : []), true), lines, true) })];
            }
        });
    }); });
};
// ---- Helpers run in the background, and their task never waits for them with a command ----
var HELPERS_STARTED = 'Your helpers run in the background: each call came back at once, and each result comes to you as a message when it ends, even after you end your step. Continue now with your own part, and when nothing else is left, end your step: never wait for them with a command.';
// The helpers Claudopus stopped itself, with the task above them
var stoppedByUs = new Set();
// What a piece of work, or a helper, starts with the Agent tool runs in the background: the call comes back at once and the
// helper's result comes as a message when it ends, as the chat's own work does
var isHelperSpawn = function (e) { var _a; return Boolean(e.parentAgentId) && !flowAgents.has((_a = e.parentAgentId) !== null && _a !== void 0 ? _a : '') && !e.workflow && !e.resume && !e.fork && !e.isTeammate && !e.background && !isOff && Boolean(dir); };
// Work that is stopped takes the helpers it has running with it: they run in the background, and would go on spending
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
                stoppedByUs.add(one.id);
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
