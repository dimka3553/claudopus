// Work starting and running: the chat's own thread kept to reading and handing work over, how full the chat is, each step of work, and new
// work's card
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var _this = this;
// A call that writes into the runners' boxes folder or reads their keychain service: a command that names them, a file it runs that
// does, or a file written or edited there. The runners themselves, the mod's own bin/admin and bin/secret, are what may
var isBoxesTouched = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var home, input, path, boxes_1, command, root, _i, _a, path, runner, text, _b, _c;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, false];
                home = dir.replace(/\/\.claude\/claudopus$/, '');
                input = e;
                if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) {
                    path = pathOf(String((_e = (_d = input.file_path) !== null && _d !== void 0 ? _d : input.notebook_path) !== null && _e !== void 0 ? _e : ''), home, cwd || home).toLowerCase();
                    boxes_1 = boxesDir().toLowerCase();
                    return [2 /*return*/, path === boxes_1 || path.startsWith("".concat(boxes_1, "/")) || path.startsWith("".concat(home.toLowerCase(), "/.claude/plugins/cache/claudopus/"))];
                }
                if (e.tool !== 'Bash')
                    return [2 /*return*/, false];
                command = String((_f = input.command) !== null && _f !== void 0 ? _f : '');
                if (touchesBoxes(command))
                    return [2 /*return*/, true];
                root = $.plugin.root;
                _i = 0, _a = filesRun(command, home, cwd || home);
                _h.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                path = _a[_i];
                runner = (_g = /\/bin\/(admin|secret)$/.exec(path)) === null || _g === void 0 ? void 0 : _g[1];
                if (runner && (path === "".concat(root, "/bin/").concat(runner) || new RegExp("^".concat(home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "/\\.claude/plugins/cache/claudopus/claudopus/[^/]+/bin/(?:admin|secret)$")).test(path)))
                    return [3 /*break*/, 5];
                return [4 /*yield*/, readOr($, path)];
            case 2:
                text = (_h.sent()).slice(0, 1000000);
                _b = runner && text;
                if (!_b) return [3 /*break*/, 4];
                _c = text;
                return [4 /*yield*/, readOr($, "".concat(root, "/bin/").concat(runner))];
            case 3:
                _b = _c === (_h.sent());
                _h.label = 4;
            case 4:
                if (_b)
                    return [3 /*break*/, 5];
                if (touchesBoxes(text))
                    return [2 /*return*/, true];
                _h.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, false];
        }
    });
}); };
// bin/keyring and its store, the runners' alone: on a Mac a way into the keychain, on Linux files that hold every kept password and
// key, the boxes' answers and the admin gate's key. A command that names the keyring runner or the store's folder (bin/keyring,
// keyring/…, "keyring"), and any tool that reads, searches or writes a path in that folder, or searches a folder of yours it is in,
// is refused. Commands that only name the word, such as `pip install keyring`, are refused with it. This stops slips and common
// tricks, as the boxes' guard does; it is no wall
var KEYRING_WORD = /(?:^|[\s'"=/;&|(`$])keyring(?:$|[\s'"/;&|)`])/i;
var KEYRING_PATH = /claudopus\/keyring(?:\/|\b)|\.local\/share\/claudopus\b/i;
var touchesKeyring = function (e) {
    var _a;
    var input = e;
    if (e.tool === 'Bash') {
        var command = String((_a = input.command) !== null && _a !== void 0 ? _a : '');
        // git and gh alone may name the word, so a commit message or a pull request can; never the store's folder
        return KEYRING_PATH.test(command) || (KEYRING_WORD.test(command) && !/^\s*(?:git|gh)\s[^;&|`$<>]*$/.test(command));
    }
    if (!['Read', 'Grep', 'Glob', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool))
        return false;
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var roots = [keyringRoot, "".concat(home, "/.local/share/claudopus/keyring")].filter(Boolean).map(function (one) { return one.toLowerCase(); });
    var isSearch = e.tool === 'Grep' || e.tool === 'Glob';
    if (isSearch && [input.pattern, input.glob].some(function (one) { return typeof one === 'string' && KEYRING_WORD.test(" ".concat(one, " ")); }))
        return true;
    return [input.file_path, input.notebook_path, input.path, input.pattern, input.glob].some(function (one) {
        if (typeof one !== 'string' || !one)
            return false;
        if (KEYRING_PATH.test(one))
            return true;
        var path = pathOf(one, home, cwd || home).toLowerCase().replace(/\/+$/, '');
        // A search from a folder of yours above the store reaches into it (ripgrep passes over hidden folders only from above your home)
        return roots.some(function (root) { return path === root || path.startsWith("".concat(root, "/")) || (isSearch && path.length > home.length && root.startsWith("".concat(path, "/"))); });
    });
};
var workHooks = function (on) {
    // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
    on('tool.call', function ($, e, raw) { return __awaiter(_this, void 0, void 0, function () {
        var run, grants, gated, woken, next, steered, from, answered, answer, message, woke, words, to_1, theirs, now_1, list, target_1, given, isRepeat, asking, asked_1, isSteer_1, sender, title, id_1, now_2, isKeeping_1, nudge_1, sent, line_1, hold, r, wrong, _a, call, r, stopId_1, now_3, readPath, isPaste;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    run = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        var isWatched, _a, _b, r;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    isWatched = e.agentId !== undefined && Boolean(dir);
                                    if (!isWatched) return [3 /*break*/, 2];
                                    return [4 /*yield*/, callBegun($, e.tool_use_id, (_c = e.agentId) !== null && _c !== void 0 ? _c : '', e.tool, e).catch(function (err) { return log($, "call not followed: ".concat(String(err))); })];
                                case 1:
                                    _e.sent();
                                    _e.label = 2;
                                case 2:
                                    if (!isWatched) return [3 /*break*/, 4];
                                    _a = callStarted;
                                    _b = [e.tool_use_id];
                                    return [4 /*yield*/, $.clock.now()];
                                case 3:
                                    _a.apply(void 0, _b.concat([_e.sent()]));
                                    _e.label = 4;
                                case 4:
                                    _e.trys.push([4, , 6, 11]);
                                    return [4 /*yield*/, raw(call)];
                                case 5:
                                    r = _e.sent();
                                    return [2 /*return*/, r];
                                case 6:
                                    if (!isWatched) return [3 /*break*/, 8];
                                    return [4 /*yield*/, callEnded($, e.tool_use_id, (_d = e.agentId) !== null && _d !== void 0 ? _d : '', e.tool, r).catch(function (err) { return log($, "call end not followed: ".concat(String(err))); })];
                                case 7:
                                    _e.sent();
                                    _e.label = 8;
                                case 8:
                                    asked = asked.filter(function (one) { return one.id !== e.tool_use_id; });
                                    settle($, e.tool_use_id, e.agentId, e.tool, outcomeOf(r), e);
                                    if (!(grants.length && !e.run_in_background)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })];
                                case 9:
                                    _e.sent();
                                    _e.label = 10;
                                case 10: return [7 /*endfinally*/];
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); };
                    grants = [];
                    return [4 /*yield*/, isBoxesTouched($, e)];
                case 1:
                    if (!_p.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " touching the password and key boxes"))];
                case 2:
                    _p.sent();
                    return [2 /*return*/, { deny: NO_BOXES }];
                case 3:
                    if (!((e.tool === 'Bash' && KEYCHAIN_READ.test(String((_b = e.command) !== null && _b !== void 0 ? _b : ''))) || touchesKeyring(e))) return [3 /*break*/, 5];
                    return [4 /*yield*/, log($, 'refused a command that reads the keychain')];
                case 4:
                    _p.sent();
                    return [2 /*return*/, { deny: NO_READ }];
                case 5:
                    if (!(e.tool === 'Bash' && pushesMain(String((_c = e.command) !== null && _c !== void 0 ? _c : '')))) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, 'refused a command that pushes or merges to main itself')];
                case 6:
                    _p.sent();
                    return [2 /*return*/, { deny: "".concat(NO_PUSH, " It is ").concat($.plugin.root, "/bin/release.") }];
                case 7:
                    if (!touchesGate(e)) return [3 /*break*/, 9];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " on the admin gate's own files"))];
                case 8:
                    _p.sent();
                    return [2 /*return*/, { deny: NO_GATE_TOUCH() }];
                case 9:
                    if (!(e.tool === 'Bash')) return [3 /*break*/, 11];
                    return [4 /*yield*/, gateAdmin($, e, raw)];
                case 10:
                    gated = _p.sent();
                    if (gated.deny)
                        return [2 /*return*/, { deny: gated.deny }];
                    grants = gated.grants;
                    _p.label = 11;
                case 11:
                    woken = '';
                    next = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        var r;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, run(call)];
                                case 1:
                                    r = _a.sent();
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === woken && one.answeredAt ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); })
                                        // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
                                    ];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, wakeCard($, woken)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, keepBackground($, e.agentId, call, r.result).catch(function (err) { return log($, "background work not followed: ".concat(String(err))); })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError && !call.run_in_background)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, keepDetached($, e.agentId, call, r.result).catch(function (err) { return log($, "detached work not followed: ".concat(String(err))); })];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9: return [2 /*return*/, hideKept($, call, r)];
                            }
                        });
                    }); };
                    steered = '';
                    from = '';
                    answered = '';
                    message = '';
                    woke = '';
                    words = '';
                    if (!(dir && e.tool === 'SendMessage')) return [3 /*break*/, 17];
                    to_1 = String((_d = e.to) !== null && _d !== void 0 ? _d : '');
                    message = String((_e = e.message) !== null && _e !== void 0 ? _e : '');
                    theirs = e.agentId === undefined ? heard.findLast(function (one) { return carries(message, one); }) : undefined;
                    words = theirs ? quoted(theirs, 600) : '';
                    return [4 /*yield*/, $.clock.now()];
                case 12:
                    now_1 = _p.sent();
                    return [4 /*yield*/, read($, todos)];
                case 13:
                    list = _p.sent();
                    target_1 = to_1 ? ((_f = list.find(function (one) { return one.id === to_1; })) !== null && _f !== void 0 ? _f : list.find(function (one) { return to_1.startsWith(one.id); })) : undefined;
                    given = target_1 && e.agentId === undefined ? sentReplies.get(target_1.id) : undefined;
                    isRepeat = Boolean((given === null || given === void 0 ? void 0 : given.isCard) && (given.to === 'work' || given.to === 'read') && now_1 - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text));
                    if (!(given && target_1 && isRepeat && !(target_1.ask && target_1.ask.at > given.at))) return [3 /*break*/, 15];
                    return [4 /*yield*/, log($, "refused a second copy of an answer to ".concat(target_1.id))];
                case 14:
                    _p.sent();
                    return [2 /*return*/, { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }];
                case 15:
                    asking = target_1 && words && e.agentId === undefined ? ((_g = list.find(function (one) { return one.id === target_1.id && one.ask; })) !== null && _g !== void 0 ? _g : list.find(function (one) { var _a; return ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.from) === target_1.id; })) : undefined;
                    asked_1 = (asking === null || asking === void 0 ? void 0 : asking.ask) ? "".concat(asking.id, ":").concat(asking.ask.at, ":").concat(asking.ask.text) : '';
                    if ((asking === null || asking === void 0 ? void 0 : asking.ask) && !answeredAsks.has(asked_1)) {
                        answeredAsks.add(asked_1);
                        answered = asking.ask.text;
                        answer = { card: asking, ask: asking.ask, key: asked_1, words: words, at: now_1 };
                    }
                    if (!target_1) return [3 /*break*/, 17];
                    woken = target_1.id;
                    isSteer_1 = target_1.status === 'working' && Boolean(words) && !answered;
                    if (target_1.status !== 'working' && words && !answered)
                        woke = words;
                    if (target_1.status === 'working' && message && !isSteer_1) {
                        sender = list.find(function (one) { return one.id === e.agentId; });
                        title = function (one) { return ((one === null || one === void 0 ? void 0 : one.title) ? " \"".concat(cut(oneLine(one.title), 60), "\"") : ''); };
                        from =
                            e.agentId === undefined
                                ? 'the chat'
                                : (sender === null || sender === void 0 ? void 0 : sender.parentId) === target_1.id
                                    ? "your helper".concat(title(sender))
                                    : target_1.parentId === e.agentId
                                        ? 'the work that started you'
                                        : "the work".concat(title(sender));
                    }
                    return [4 /*yield*/, update($, todos, function (list) {
                            return list.map(function (one) {
                                var _a;
                                return one.id !== target_1.id
                                    ? one
                                    : __assign(__assign({}, one), { owes: isSteer_1 ? 0 : one.owes, entries: words && ((_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== words ? __spreadArray(__spreadArray([], one.entries, true), [{ at: now_1, kind: 'steer', text: words }], false).slice(-ENTRIES_KEPT) : one.entries });
                            });
                        })];
                case 16:
                    _p.sent();
                    if (isSteer_1 || from || answered || woke)
                        steered = target_1.id;
                    _p.label = 17;
                case 17:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 20];
                    id_1 = e.agentId;
                    // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
                    if (e.tool === 'Agent')
                        helperCalls.set(e.tool_use_id, id_1);
                    endedByHandback.delete(id_1);
                    stoppedHere.delete(id_1);
                    if (!dir) return [3 /*break*/, 20];
                    return [4 /*yield*/, $.clock.now()];
                case 18:
                    now_2 = _p.sent();
                    isKeeping_1 = isTool(e.tool, 'todo') || isTool(e.tool, 'note');
                    nudge_1 = '';
                    return [4 /*yield*/, update($, todos, function (list) {
                            return list.map(function (one) {
                                var _a, _b;
                                if (one.id !== id_1)
                                    return one;
                                var base = __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now_2))), { steps: ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) + 1, answeredAt: undefined, waitsSince: undefined });
                                if (isKeeping_1)
                                    return __assign(__assign({}, base), { quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes });
                                var owes = one.owes === undefined ? undefined : one.owes + 1;
                                var quiet = ((_b = one.quiet) !== null && _b !== void 0 ? _b : 0) + 1;
                                var isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS;
                                nudge_1 = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : '';
                                return __assign(__assign({}, base), { owes: owes, quiet: isQuiet ? 0 : quiet });
                            });
                        })];
                case 19:
                    _p.sent();
                    if (nudge_1)
                        void tell($, id_1, nudge_1);
                    _p.label = 20;
                case 20:
                    if (!steered) return [3 /*break*/, 24];
                    return [4 /*yield*/, next(e)];
                case 21:
                    sent = _p.sent();
                    if (!answer) return [3 /*break*/, 23];
                    return [4 /*yield*/, answeredInChat($, answer, steered, !sent.deny && !sent.isError)
                        // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
                        // message of its own instead, read once it reaches it
                        // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
                        // chat's own note that landed after the person's words once marked their words as not theirs
                    ];
                case 22:
                    _p.sent();
                    _p.label = 23;
                case 23:
                    line_1 = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true))) : woke ? WOKE(woke) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words));
                    if (!sent.deny)
                        void tell($, steered, line_1).then(function (r) { return (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line_1 }).catch(function (err) { return log($, "work ".concat(steered, " not told: ").concat(String(err))); }) : undefined); });
                    return [2 /*return*/, sent];
                case 24:
                    if (!(e.agentId !== undefined && String(e.tool) === 'SubagentHandback')) return [3 /*break*/, 27];
                    return [4 /*yield*/, holdAtStop($, e.agentId, 'handback').catch(function () { return ''; })];
                case 25:
                    hold = _p.sent();
                    if (hold)
                        return [2 /*return*/, { deny: hold }];
                    return [4 /*yield*/, next(e)];
                case 26:
                    r = _p.sent();
                    if (!r.deny && !r.isError)
                        handedBack.set(e.agentId, String((_h = e.message) !== null && _h !== void 0 ? _h : '').trim());
                    return [2 /*return*/, r];
                case 27:
                    if (!(!isOff && e.tool === 'Agent' && rightModel(String((_j = e.model) !== null && _j !== void 0 ? _j : '')))) return [3 /*break*/, 29];
                    wrong = String(e.model);
                    return [4 /*yield*/, log($, "refused an Agent call on ".concat(modelName(wrong)))];
                case 28:
                    _p.sent();
                    return [2 /*return*/, { deny: WRONG_MODEL(wrong) }];
                case 29:
                    if (e.agentId !== undefined)
                        return [2 /*return*/, next(e)];
                    _a = isOff;
                    if (_a) return [3 /*break*/, 31];
                    return [4 /*yield*/, read($, me)];
                case 30:
                    _a = !(_p.sent()).isChat;
                    _p.label = 31;
                case 31:
                    if (_a)
                        return [2 /*return*/, next(e)
                            // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
                        ];
                    if (!(e.tool === 'Agent')) return [3 /*break*/, 33];
                    call = e;
                    if (!(call.subagent_type === 'fork' || !String((_k = call.model) !== null && _k !== void 0 ? _k : '').trim())) return [3 /*break*/, 33];
                    return [4 /*yield*/, log($, "refused an Agent call ".concat(call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'))];
                case 32:
                    _p.sent();
                    return [2 /*return*/, { deny: NO_COPY() }];
                case 33:
                    if (!(e.tool === 'TaskStop' && dir)) return [3 /*break*/, 42];
                    return [4 /*yield*/, next(e)];
                case 34:
                    r = _p.sent();
                    stopId_1 = String((_l = e.task_id) !== null && _l !== void 0 ? _l : '');
                    if (!(!r.deny && stopId_1)) return [3 /*break*/, 41];
                    stoppedHere.add(stopId_1);
                    return [4 /*yield*/, stopHelpers($, stopId_1)];
                case 35:
                    _p.sent();
                    return [4 /*yield*/, dropBackground($, [stopId_1])];
                case 36:
                    _p.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 37:
                    now_3 = _p.sent();
                    return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === stopId_1 && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now_3) : one.id === stopId_1 && one.leftSince ? __assign(__assign({}, one), { leftSince: undefined }) : one); }); })];
                case 38:
                    _p.sent();
                    return [4 /*yield*/, keepStoppedReports($, now_3)];
                case 39:
                    _p.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 40:
                    _p.sent();
                    _p.label = 41;
                case 41: return [2 /*return*/, r];
                case 42:
                    if (OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }))
                        return [2 /*return*/, next(e)
                            // The chat reads for itself: a kept report to answer from, or the few files a question needs. A saved paste stays out of it:
                            // the agent that needs it reads it
                        ];
                    readPath = String((_o = (_m = e.file_path) !== null && _m !== void 0 ? _m : e.path) !== null && _o !== void 0 ? _o : '');
                    isPaste = Boolean(dir) && (readPath === "".concat(dir, "/pastes") || readPath.startsWith("".concat(dir, "/pastes/")));
                    if (READS.includes(e.tool) && !isPaste)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " in a chat's own thread"))];
                case 43:
                    _p.sent();
                    return [2 /*return*/, { deny: REFUSED }];
            }
        });
    }); });
    // How full this chat's context is, as the app counts it, each time it moves
    on('session.measure', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!wakes.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    tokens = e.context.tokens;
                    if (!(tokens !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, update($, me, function (one) { return (one.tokens === tokens && one.window ? one : __assign(__assign({}, one), { tokens: tokens, window: one.window || e.context.window })); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // How full a piece of work's context is, and which model it runs on: what the API reports when a response of its ends.
    // The response itself passes through untouched and unread; only the count and the model's name are kept
    // Work the person moved to another model sends each step from then on to that model; only the model the request names changes
    on('turn.step', function ($, e, next) {
        return __asyncGenerator(this, arguments, function () {
            var id, _a, chosen, _b, instead, moved, _c, to, r, tokens, model;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        id = e.agentId;
                        if (id !== undefined)
                            replyRead($, id);
                        _a = id !== undefined && dir;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 1:
                        _a = (_f.sent()).some(function (one) { return one.id === id && one.answeredAt; });
                        _f.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, __await(update($, todos, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); }))];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 5:
                        _b = (_d = (_f.sent()).find(function (one) { return one.id === id; })) === null || _d === void 0 ? void 0 : _d.chosen;
                        return [3 /*break*/, 7];
                    case 6:
                        _b = undefined;
                        _f.label = 7;
                    case 7:
                        chosen = _b;
                        instead = id !== undefined && !chosen && !isOff ? rightModel(e.model) : undefined;
                        if (!(id !== undefined && instead && !sentElsewhere.has("".concat(id, " ").concat(e.model)))) return [3 /*break*/, 9];
                        sentElsewhere.add("".concat(id, " ").concat(e.model));
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was sent to ").concat(modelName(e.model), " by the app: its steps go to ").concat(modelName(instead))))];
                    case 8:
                        _f.sent();
                        _f.label = 9;
                    case 9:
                        moved = instead ? modelName(e.model) : undefined;
                        _c = id !== undefined && dir;
                        if (!_c) return [3 /*break*/, 11];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 10:
                        _c = (_f.sent()).some(function (one) { return one.id === id && one.moved !== moved; });
                        _f.label = 11;
                    case 11:
                        if (!_c) return [3 /*break*/, 13];
                        return [4 /*yield*/, __await(update($, todos, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { moved: moved }) : one); }); }))];
                    case 12:
                        _f.sent();
                        _f.label = 13;
                    case 13:
                        to = chosen && modelName(chosen) !== modelName(e.model) ? chosen : instead;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(next(to ? __assign(__assign({}, e), { model: to }) : e))))];
                    case 14: return [4 /*yield*/, __await.apply(void 0, [_f.sent()])];
                    case 15:
                        r = _f.sent();
                        tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0;
                        model = (_e = r.usage) === null || _e === void 0 ? void 0 : _e.model;
                        if (!(id !== undefined && tokens && flowAgents.has(id))) return [3 /*break*/, 17];
                        return [4 /*yield*/, __await(flowStep($, id, tokens, model).catch(function () { return undefined; }))];
                    case 16:
                        _f.sent();
                        _f.label = 17;
                    case 17:
                        if (!(id !== undefined && tokens && dir)) return [3 /*break*/, 19];
                        return [4 /*yield*/, __await(update($, todos, function (list) { return list.map(function (one) { var _a; return (one.id === id ? __assign(__assign({}, one), { tokens: tokens, model: (_a = one.chosen) !== null && _a !== void 0 ? _a : (modelName(model !== null && model !== void 0 ? model : '') ? model : one.model) }) : one); }); }))];
                    case 18:
                        _f.sent();
                        _f.label = 19;
                    case 19: return [4 /*yield*/, __await(r)];
                    case 20: return [2 /*return*/, _f.sent()];
                }
            });
        });
    });
    // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
    on('classic.SubagentStop', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, hold, _a, live, ids_1, gone;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _d.sent();
                    if (!r.block) return [3 /*break*/, 2];
                    _a = '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, holdAtStop($, e.agent_id, 'stop').catch(function () { return ''; })];
                case 3:
                    _a = _d.sent();
                    _d.label = 4;
                case 4:
                    hold = _a;
                    if (hold)
                        return [2 /*return*/, __assign(__assign({}, r), { block: hold })];
                    live = e.background_tasks;
                    if (!(dir && Array.isArray(live))) return [3 /*break*/, 7];
                    ids_1 = new Set(live.map(function (one) { return one.id; }));
                    return [4 /*yield*/, read($, todos)];
                case 5:
                    gone = ((_c = (_b = (_d.sent()).find(function (one) { return one.id === e.agent_id; })) === null || _b === void 0 ? void 0 : _b.bg) !== null && _c !== void 0 ? _c : []).filter(function (b) { return !ids_1.has(b.id); }).map(function (b) { return b.id; });
                    if (!gone.length) return [3 /*break*/, 7];
                    return [4 /*yield*/, dropBackground($, gone).catch(function (err) { return log($, "ended background work not let go: ".concat(String(err))); })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [2 /*return*/, r];
            }
        });
    }); });
    on('agent.spawn', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r_1, parentId, isOwn, isTold, _a, work, _b, _c, _d, words, _e, _f, _g, isBackground, r, id, now, named1, _h, goesOn, from;
        var _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    agentStarted($, e.tool_use_id);
                    if (!e.workflow) return [3 /*break*/, 4];
                    return [4 /*yield*/, next(e)];
                case 1:
                    r_1 = _o.sent();
                    if (!(r_1.agentId && dir)) return [3 /*break*/, 3];
                    return [4 /*yield*/, flowSpawned($, e.workflow.runId, r_1.agentId, modelName((_j = r_1.model) !== null && _j !== void 0 ? _j : '') ? r_1.model : e.model || r_1.model || '', (_k = e.description) !== null && _k !== void 0 ? _k : '').catch(function (err) { return log($, "workflow agent not kept: ".concat(String(err))); })];
                case 2:
                    _o.sent();
                    _o.label = 3;
                case 3: return [2 /*return*/, r_1];
                case 4:
                    parentId = (_m = (_l = e.parentAgentId) !== null && _l !== void 0 ? _l : helperCalls.get(e.tool_use_id)) !== null && _m !== void 0 ? _m : '';
                    isOwn = !parentId;
                    _a = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, read($, me)];
                case 5:
                    _a = (_o.sent()).isChat;
                    _o.label = 6;
                case 6:
                    isTold = _a;
                    if (!isTold) return [3 /*break*/, 8];
                    _c = named;
                    _d = fillModels;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/work.md')];
                case 7:
                    _b = _c.apply(void 0, [_d.apply(void 0, [(_o.sent()).text, models])]).replace(/\{admin\}/g, "".concat($.plugin.root, "/bin/admin")).replace(/\{secret\}/g, "".concat($.plugin.root, "/bin/secret")).replace(/\{release\}/g, "".concat($.plugin.root, "/bin/release")).trim();
                    return [3 /*break*/, 9];
                case 8:
                    _b = '';
                    _o.label = 9;
                case 9:
                    work = _b;
                    if (!isTold) return [3 /*break*/, 11];
                    _g = (_f = "- The chat's saved words, ".concat(who(), "'s messages word for word: ").concat(dir, "/words/")).concat;
                    return [4 /*yield*/, read($, me)];
                case 10:
                    _e = _g.apply(_f, [(_o.sent()).id, ".md"]);
                    return [3 /*break*/, 12];
                case 11:
                    _e = '';
                    _o.label = 12;
                case 12:
                    words = _e;
                    isBackground = isHelperSpawn(e);
                    return [4 /*yield*/, next(isTold ? __assign(__assign({}, e), { prompt: "".concat(e.prompt, "\n\n").concat(workHead(), "\n").concat(words, "\n").concat(work, "\n\n").concat(named(PANEL_RULE)) }) : isBackground ? __assign(__assign({}, e), { background: true }) : e)];
                case 13:
                    r = _o.sent();
                    if (!(isBackground && r.agentId)) return [3 /*break*/, 15];
                    return [4 /*yield*/, log($, "helper ".concat(r.agentId, " of ").concat(e.parentAgentId, " runs in the background"))];
                case 14:
                    _o.sent();
                    _o.label = 15;
                case 15:
                    if (!dir || !r.agentId)
                        return [2 /*return*/, r];
                    id = r.agentId;
                    endedByHandback.delete(id);
                    return [4 /*yield*/, $.clock.now()
                        // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
                        // several, or one on something else, only reads them
                    ];
                case 16:
                    now = _o.sent();
                    if (!(isOwn && !fromReport && !e.resume)) return [3 /*break*/, 18];
                    return [4 /*yield*/, read($, reports)];
                case 17:
                    _h = (_o.sent()).filter(function (one) { return e.prompt.includes("reports/".concat(one.id, "/")) || e.prompt.endsWith("reports/".concat(one.id)); });
                    return [3 /*break*/, 19];
                case 18:
                    _h = [];
                    _o.label = 19;
                case 19:
                    named1 = _h;
                    goesOn = named1.length === 1 && named1[0] && __spreadArray([], aboutWords(named1[0].title), true).some(function (word) { var _a; return aboutWords((_a = e.description) !== null && _a !== void 0 ? _a : '').has(word); }) ? named1[0].id : '';
                    from = fromReport || goesOn;
                    return [4 /*yield*/, update($, todos, function (list) {
                            var _a, _b;
                            var old = list.find(function (one) { return one.id === id; });
                            // Its title is the few words the task was given; under it, the person's message as they wrote it
                            var fresh = __assign(__assign({}, started(id, parentId, (_a = e.description) !== null && _a !== void 0 ? _a : '', isOwn ? said : '', now, e.fork)), (isOwn && from ? { from: from } : {}));
                            return capped(__spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== id; }), true), [__assign(__assign({}, (old ? resumed(old, now) : fresh)), { model: (_b = old === null || old === void 0 ? void 0 : old.chosen) !== null && _b !== void 0 ? _b : r.model })], false));
                        })];
                case 20:
                    _o.sent();
                    if (!isOwn) return [3 /*break*/, 22];
                    return [4 /*yield*/, openList($)];
                case 21:
                    _o.sent();
                    _o.label = 22;
                case 22:
                    if (!!isOwn) return [3 /*break*/, 24];
                    return [4 /*yield*/, writeRolls($, true).catch(function (err) { return log($, "helpers not written: ".concat(String(err))); })];
                case 23:
                    _o.sent();
                    _o.label = 24;
                case 24: return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 25:
                    _o.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
