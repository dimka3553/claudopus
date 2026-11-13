// Work starting and running: the chat's own thread kept to handing work over, how full the chat is, each step of work, and new
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
var workHooks = function (on) {
    // A chat's own thread starts agents and talks to them; the work runs in the agents, which carry an agent id
    on('tool.call', function ($, e, raw) { return __awaiter(_this, void 0, void 0, function () {
        var run, woken, next, steered, from, to_1, message_1, theirs, words_1, now_1, list, target_1, isSteer_1, sender, title, id_1, now_2, isKeeping_1, nudge_1, sent, _a, call, r, stopId_1, now_3, readPath;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    run = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, , 2, 3]);
                                    return [4 /*yield*/, raw(call)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    asked = asked.filter(function (one) { return one.id !== e.tool_use_id; });
                                    settle($, e.tool_use_id, e.agentId, e.tool);
                                    return [7 /*endfinally*/];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!(e.tool === 'Bash' && KEYCHAIN_READ.test(String((_b = e.command) !== null && _b !== void 0 ? _b : '')))) return [3 /*break*/, 2];
                    return [4 /*yield*/, log($, 'refused a command that reads the keychain')];
                case 1:
                    _k.sent();
                    return [2 /*return*/, { deny: NO_READ }];
                case 2:
                    woken = '';
                    next = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        var r;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, run(call)];
                                case 1:
                                    r = _a.sent();
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === woken && one.answeredAt ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, hideKept($, call, r)];
                            }
                        });
                    }); };
                    steered = '';
                    from = '';
                    if (!(dir && e.tool === 'SendMessage')) return [3 /*break*/, 6];
                    to_1 = String((_c = e.to) !== null && _c !== void 0 ? _c : '');
                    message_1 = String((_d = e.message) !== null && _d !== void 0 ? _d : '');
                    theirs = e.agentId === undefined ? heard.findLast(function (one) { return carries(message_1, one); }) : undefined;
                    words_1 = theirs ? quoted(theirs, 600) : '';
                    return [4 /*yield*/, $.clock.now()];
                case 3:
                    now_1 = _k.sent();
                    return [4 /*yield*/, read($, todos)];
                case 4:
                    list = _k.sent();
                    target_1 = to_1 ? ((_e = list.find(function (one) { return one.id === to_1; })) !== null && _e !== void 0 ? _e : list.find(function (one) { return to_1.startsWith(one.id); })) : undefined;
                    if (!target_1) return [3 /*break*/, 6];
                    woken = target_1.id;
                    isSteer_1 = target_1.status === 'working' && Boolean(words_1);
                    if (target_1.status === 'working' && message_1 && !isSteer_1) {
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
                                    : __assign(__assign({}, one), { owes: isSteer_1 ? 0 : one.owes, entries: words_1 && ((_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== words_1 ? __spreadArray(__spreadArray([], one.entries, true), [{ at: now_1, kind: 'steer', text: words_1 }], false).slice(-ENTRIES_KEPT) : one.entries });
                            });
                        })];
                case 5:
                    _k.sent();
                    if (isSteer_1 || from)
                        steered = target_1.id;
                    _k.label = 6;
                case 6:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 9];
                    id_1 = e.agentId;
                    // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
                    if (e.tool === 'Agent')
                        helperCalls.set(e.tool_use_id, id_1);
                    if (String(e.tool) === 'SubagentHandback')
                        handedBack.set(id_1, String((_f = e.message) !== null && _f !== void 0 ? _f : '').trim());
                    if (!dir) return [3 /*break*/, 9];
                    return [4 /*yield*/, $.clock.now()];
                case 7:
                    now_2 = _k.sent();
                    isKeeping_1 = isTool(e.tool, 'todo') || isTool(e.tool, 'note');
                    nudge_1 = '';
                    return [4 /*yield*/, update($, todos, function (list) {
                            return list.map(function (one) {
                                var _a, _b;
                                if (one.id !== id_1)
                                    return one;
                                var base = __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now_2))), { steps: ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) + 1, answeredAt: undefined });
                                if (isKeeping_1)
                                    return __assign(__assign({}, base), { quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes });
                                var owes = one.owes === undefined ? undefined : one.owes + 1;
                                var quiet = ((_b = one.quiet) !== null && _b !== void 0 ? _b : 0) + 1;
                                var isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS;
                                nudge_1 = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : '';
                                return __assign(__assign({}, base), { owes: owes, quiet: isQuiet ? 0 : quiet });
                            });
                        })];
                case 8:
                    _k.sent();
                    if (nudge_1)
                        void tell($, id_1, nudge_1);
                    _k.label = 9;
                case 9:
                    if (!steered) return [3 /*break*/, 11];
                    return [4 /*yield*/, next(e)];
                case 10:
                    sent = _k.sent();
                    if (!sent.deny)
                        void tell($, steered, named(from ? FROM(from) : STEER));
                    return [2 /*return*/, sent];
                case 11:
                    if (e.agentId !== undefined)
                        return [2 /*return*/, next(e)];
                    _a = isOff;
                    if (_a) return [3 /*break*/, 13];
                    return [4 /*yield*/, read($, me)];
                case 12:
                    _a = !(_k.sent()).isChat;
                    _k.label = 13;
                case 13:
                    if (_a)
                        return [2 /*return*/, next(e)
                            // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
                        ];
                    if (!(e.tool === 'Agent')) return [3 /*break*/, 15];
                    call = e;
                    if (!(call.subagent_type === 'fork' || !String((_g = call.model) !== null && _g !== void 0 ? _g : '').trim())) return [3 /*break*/, 15];
                    return [4 /*yield*/, log($, "refused an Agent call ".concat(call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'))];
                case 14:
                    _k.sent();
                    return [2 /*return*/, { deny: NO_COPY() }];
                case 15:
                    if (!(e.tool === 'TaskStop' && dir)) return [3 /*break*/, 22];
                    return [4 /*yield*/, next(e)];
                case 16:
                    r = _k.sent();
                    stopId_1 = String((_h = e.task_id) !== null && _h !== void 0 ? _h : '');
                    if (!(!r.deny && stopId_1)) return [3 /*break*/, 21];
                    return [4 /*yield*/, $.clock.now()];
                case 17:
                    now_3 = _k.sent();
                    return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === stopId_1 && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now_3) : one); }); })];
                case 18:
                    _k.sent();
                    return [4 /*yield*/, keepStoppedReports($, now_3)];
                case 19:
                    _k.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 20:
                    _k.sent();
                    _k.label = 21;
                case 21: return [2 /*return*/, r];
                case 22:
                    if (OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }))
                        return [2 /*return*/, next(e)
                            // The chat reads a kept report itself, to answer from it
                        ];
                    readPath = String((_j = e.file_path) !== null && _j !== void 0 ? _j : '');
                    if (e.tool === 'Read' && readPath.startsWith("".concat(reportsDir(), "/")) && !readPath.split('/').includes('..'))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " in a chat's own thread"))];
                case 23:
                    _k.sent();
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
                    tokens = e.context.tokens;
                    if (!(tokens !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, update($, me, function (one) { return (one.tokens === tokens && one.window ? one : __assign(__assign({}, one), { tokens: tokens, window: one.window || e.context.window })); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // How full a piece of work's context is, and which model it runs on: what the API reports when a response of its ends.
    // The response itself passes through untouched and unread; only the count and the model's name are kept
    // Work the person moved to another model sends each step from then on to that model; only the model the request names changes
    on('turn.step', function ($, e, next) {
        return __asyncGenerator(this, arguments, function () {
            var id, _a, chosen, _b, r, tokens, model;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        id = e.agentId;
                        if (id !== undefined)
                            replyRead($, id);
                        _a = id !== undefined && dir;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 1:
                        _a = (_e.sent()).some(function (one) { return one.id === id && one.answeredAt; });
                        _e.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, __await(update($, todos, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); }))];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 5:
                        _b = (_c = (_e.sent()).find(function (one) { return one.id === id; })) === null || _c === void 0 ? void 0 : _c.chosen;
                        return [3 /*break*/, 7];
                    case 6:
                        _b = undefined;
                        _e.label = 7;
                    case 7:
                        chosen = _b;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(next(chosen && modelName(chosen) !== modelName(e.model) ? __assign(__assign({}, e), { model: chosen }) : e))))];
                    case 8: return [4 /*yield*/, __await.apply(void 0, [_e.sent()])];
                    case 9:
                        r = _e.sent();
                        tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0;
                        model = (_d = r.usage) === null || _d === void 0 ? void 0 : _d.model;
                        if (!(id !== undefined && tokens && flowAgents.has(id))) return [3 /*break*/, 11];
                        return [4 /*yield*/, __await(flowStep($, id, tokens, model).catch(function () { return undefined; }))];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11:
                        if (!(id !== undefined && tokens && dir)) return [3 /*break*/, 13];
                        return [4 /*yield*/, __await(update($, todos, function (list) { return list.map(function (one) { var _a; return (one.id === id ? __assign(__assign({}, one), { tokens: tokens, model: (_a = one.chosen) !== null && _a !== void 0 ? _a : (modelName(model !== null && model !== void 0 ? model : '') ? model : one.model) }) : one); }); }))];
                    case 12:
                        _e.sent();
                        _e.label = 13;
                    case 13: return [4 /*yield*/, __await(r)];
                    case 14: return [2 /*return*/, _e.sent()];
                }
            });
        });
    });
    on('agent.spawn', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r_1, parentId, isOwn, isTold, _a, work, _b, _c, _d, words, _e, _f, _g, r, id, now, named1, _h, goesOn, from;
        var _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
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
                    _b = _c.apply(void 0, [_d.apply(void 0, [(_o.sent()).text, models])]).replace(/\{admin\}/g, "".concat($.plugin.root, "/bin/admin")).replace(/\{secret\}/g, "".concat($.plugin.root, "/bin/secret")).trim();
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
                    return [4 /*yield*/, next(isTold ? __assign(__assign({}, e), { prompt: "".concat(e.prompt, "\n\n").concat(workHead(), "\n").concat(words, "\n").concat(work, "\n\n").concat(named(PANEL_RULE)) }) : e)];
                case 13:
                    r = _o.sent();
                    if (!dir || !r.agentId)
                        return [2 /*return*/, r];
                    id = r.agentId;
                    return [4 /*yield*/, $.clock.now()
                        // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
                        // several, or one on something else, only reads them
                    ];
                case 14:
                    now = _o.sent();
                    if (!(isOwn && !fromReport && !e.resume)) return [3 /*break*/, 16];
                    return [4 /*yield*/, read($, reports)];
                case 15:
                    _h = (_o.sent()).filter(function (one) { return e.prompt.includes("reports/".concat(one.id, "/")) || e.prompt.endsWith("reports/".concat(one.id)); });
                    return [3 /*break*/, 17];
                case 16:
                    _h = [];
                    _o.label = 17;
                case 17:
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
                case 18:
                    _o.sent();
                    if (!isOwn) return [3 /*break*/, 20];
                    return [4 /*yield*/, openList($)];
                case 19:
                    _o.sent();
                    _o.label = 20;
                case 20: return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 21:
                    _o.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
