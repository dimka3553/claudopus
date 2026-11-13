// Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds
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
// ---- Workflows: a run of the Workflow tool, a blue card with its stages, who is in it and its rounds ----
// Each run is kept by the session that runs it in ~/.claude/claudopus/flows/<run id>.json; the chat that started that session
// reads it from there, so a workflow run in a session of its own shows in the chat's panel too
var flows = atom({ plugin: 'claudopus', key: 'flows' }, [], { shape: 'flows-1' });
// The app's ids of this session and of the session that started it. Outside the app there are none, and a run is named by the
// engine's id of this session
var ccd = { id: '', parent: '' };
// A model named by its alias, as a script names it, is the version the panel offers
var fullModel = function (id) { var _a; return (/^(opus|sonnet|fable)$/i.test(id.trim()) ? ((_a = MODELS.find(function (one) { return one.includes(id.trim().toLowerCase()); })) !== null && _a !== void 0 ? _a : id) : id); };
var sessionName = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = ccd.id;
            if (_a) return [3 /*break*/, 2];
            _b = "engine:".concat;
            return [4 /*yield*/, read($, me)];
        case 1:
            _a = _b.apply("engine:", [(_c.sent()).id]);
            _c.label = 2;
        case 2: return [2 /*return*/, _a];
    }
}); }); };
// The agents of each run, by agent id: what their responses report goes to their run
var flowAgents = new Map();
// What each run this session runs was when its file was last written
var flowSaved = new Map();
var flowsDir = function () { return "".concat(dir, "/flows"); };
var flowPath = function (id) { return "".concat(flowsDir(), "/").concat(id.replace(/[^A-Za-z0-9_-]/g, '-'), ".json"); };
// A running workflow's journal is read this often, and its card's time moves each second
var FLOW_EVERY = 2000;
// How many runs the panel keeps, ended ones included; and how many looks pass between two reads of this chat for a run's end
var FLOWS_KEPT = 20;
var END_LOOK = 5;
// A run of another session whose file has not changed for this long has lost its session; one older than a day is not looked at again
var FLOW_STALE = 30 * 60000;
var FLOW_OLD = 24 * 3600000;
// The agent of each workflow's Details tab whose chat it shows, by the run
var flowPicked = new Map();
// Each workflow agent's chat as last read from its transcript, by the agent
var flowTalks = new Map();
var knowSession = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var one, _a, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                _b = (_a = JSON).parse;
                _c = textOf;
                return [4 /*yield*/, $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' })];
            case 1:
                one = _b.apply(_a, [_c.apply(void 0, [_g.sent()])]);
                ccd = { id: (_e = one.sessionId) !== null && _e !== void 0 ? _e : '', parent: (_f = one.parentSessionId) !== null && _f !== void 0 ? _f : '' };
                return [3 /*break*/, 3];
            case 2:
                _d = _g.sent();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var isFlowMine = function ($, f) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = f.session;
            return [4 /*yield*/, sessionName($)];
        case 1: return [2 /*return*/, _a === (_b.sent())
            // A run this panel shows: one this session runs, or one a session this chat started runs
        ];
    }
}); }); };
// A run this panel shows: one this session runs, or one a session this chat started runs
var isFlowShown = function (f, mine) { return f.session === mine || Boolean(ccd.id && f.parent === ccd.id); };
// Writes a run this session runs to its file when it changed
var saveFlow = function ($, f) { return __awaiter(_this, void 0, void 0, function () {
    var _a, text;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = !dir;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, isFlowMine($, f)];
            case 1:
                _a = !(_b.sent());
                _b.label = 2;
            case 2:
                if (_a)
                    return [2 /*return*/];
                text = JSON.stringify(f);
                if (flowSaved.get(f.id) === text)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/flows/").concat(f.id.replace(/[^A-Za-z0-9_-]/g, '-'), ".json"), "".concat(text, "\n"))];
            case 3:
                _b.sent();
                flowSaved.set(f.id, text);
                return [2 /*return*/];
        }
    });
}); };
var changeFlow = function ($, id, fn) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, f;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                return [4 /*yield*/, update($, flows, function (all) { return all.map(function (f) { return (f.id === id ? fn(f, now) : f); }); })];
            case 2:
                list = _a.sent();
                f = list.find(function (one) { return one.id === id; });
                if (!f) return [3 /*break*/, 4];
                return [4 /*yield*/, saveFlow($, f).catch(function (err) { return log($, "workflow ".concat(id, " not kept: ").concat(String(err))); })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, lookEnds($)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var keptFlows = function (list) {
    var over = list.length - FLOWS_KEPT;
    return over > 0 ? __spreadArray([], list, true).sort(function (a, b) { return (a.status === 'working' ? Infinity : a.endedAt) - (b.status === 'working' ? Infinity : b.endedAt); }).filter(function (f) { return f.status === 'working' || (over -= 1) < 0; }) : list;
};
// The Workflow tool started a run: its card comes up, from the call's own script and args and what the tool answered
var flowStarted = function ($, input, answer) { return __awaiter(_this, void 0, void 0, function () {
    var path, script, _a, _b, meta, now, args, task, f, _c;
    var _d;
    var _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                if (!dir || !answer.runId || !answer.taskId)
                    return [2 /*return*/];
                path = typeof input.scriptPath === 'string' ? input.scriptPath : (_e = answer.scriptPath) !== null && _e !== void 0 ? _e : '';
                if (!(typeof input.script === 'string')) return [3 /*break*/, 1];
                _a = input.script;
                return [3 /*break*/, 5];
            case 1:
                if (!path) return [3 /*break*/, 3];
                return [4 /*yield*/, readOr($, path)];
            case 2:
                _b = _m.sent();
                return [3 /*break*/, 4];
            case 3:
                _b = '';
                _m.label = 4;
            case 4:
                _a = _b;
                _m.label = 5;
            case 5:
                script = _a;
                meta = metaOf(script);
                return [4 /*yield*/, $.clock.now()];
            case 6:
                now = _m.sent();
                args = input.args;
                task = args && typeof args === 'object' && typeof args.task === 'string' ? String(args.task) : typeof args === 'string' ? args : '';
                _c = [__assign({ id: answer.runId, taskId: answer.taskId, title: titleOfFlow(args, { name: meta.name || answer.workflowName || String((_f = input.name) !== null && _f !== void 0 ? _f : ''), description: meta.description }), name: meta.name || answer.workflowName || String((_g = input.name) !== null && _g !== void 0 ? _g : ''), description: meta.description, phases: meta.phases.map(function (p) { return (p.model ? __assign(__assign({}, p), { model: fullModel(p.model) }) : p); }) }, (((_h = capOf(args)) !== null && _h !== void 0 ? _h : (meta.name === 'rounds' ? 3 : undefined)) ? { cap: meta.name === 'rounds' ? Math.min((_j = capOf(args)) !== null && _j !== void 0 ? _j : 3, 5) : capOf(args) } : {}))];
                _d = { task: task.trim().slice(0, 4000), words: said.trim().slice(0, 4000) };
                return [4 /*yield*/, sessionName($)];
            case 7:
                f = __assign.apply(void 0, _c.concat([(_d.session = _m.sent(), _d.parent = ccd.parent, _d.transcriptDir = (_k = answer.transcriptDir) !== null && _k !== void 0 ? _k : '', _d.startedAt = now, _d.endedAt = 0, _d.status = 'working', _d.agents = (_l = flowEarly.get(answer.runId)) !== null && _l !== void 0 ? _l : [], _d.result = '', _d)]));
                flowEarly.delete(answer.runId);
                return [4 /*yield*/, update($, flows, function (list) { return keptFlows(__spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== f.id; }), true), [f], false)); })];
            case 8:
                _m.sent();
                return [4 /*yield*/, saveFlow($, f).catch(function (err) { return log($, "workflow ".concat(f.id, " not kept: ").concat(String(err))); })];
            case 9:
                _m.sent();
                return [4 /*yield*/, openList($)];
            case 10:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); };
// The agents that started before their run's card existed, by the run
var flowEarly = new Map();
// An agent the script started: its model now, its label and stage once the journal names them
var flowSpawned = function ($, runId, agentId, model, label) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                flowAgents.set(agentId, runId);
                return [4 /*yield*/, read($, flows)];
            case 1:
                if (!!(_b.sent()).some(function (f) { return f.id === runId; })) return [3 /*break*/, 3];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _b.sent();
                flowEarly.set(runId, __spreadArray(__spreadArray([], ((_a = flowEarly.get(runId)) !== null && _a !== void 0 ? _a : []).filter(function (one) { return one.id !== agentId; }), true), [{ id: agentId, label: label.trim(), phase: '', status: 'working', at: now, model: fullModel(model) || undefined }], false));
                return [2 /*return*/];
            case 3: return [4 /*yield*/, changeFlow($, runId, function (f, at) {
                    var was = f.agents.find(function (one) { return one.id === agentId; });
                    var agent = __assign(__assign({}, (was !== null && was !== void 0 ? was : { id: agentId, label: label.trim(), phase: '', status: 'working', at: at })), { model: fullModel(model) || (was === null || was === void 0 ? void 0 : was.model) });
                    return __assign(__assign({}, f), { agents: was ? f.agents.map(function (one) { return (one.id === agentId ? agent : one); }) : __spreadArray(__spreadArray([], f.agents, true), [agent], false) });
                })];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// A response of a workflow's agent ended: how full its context is, and its model
var flowStep = function ($, agentId, tokens, model) { return __awaiter(_this, void 0, void 0, function () {
    var runId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                runId = flowAgents.get(agentId);
                if (!runId)
                    return [2 /*return*/];
                return [4 /*yield*/, changeFlow($, runId, function (f) { return (__assign(__assign({}, f), { agents: f.agents.map(function (one) { return (one.id === agentId ? __assign(__assign({}, one), { tokens: tokens, model: modelName(model !== null && model !== void 0 ? model : '') ? model : one.model }) : one); }) })); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The run ended: how, and what it returned
var flowEnded = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, _a, f;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _loop_1 = function (f) {
                    var end, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                end = endOf(text, f.taskId);
                                _c = !end;
                                if (_c) return [3 /*break*/, 2];
                                return [4 /*yield*/, isFlowMine($, f)];
                            case 1:
                                _c = !(_d.sent());
                                _d.label = 2;
                            case 2:
                                if (_c)
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, readJournal($, f.id)];
                            case 3:
                                _d.sent();
                                return [4 /*yield*/, changeFlow($, f.id, function (one, at) { return (__assign(__assign({}, one), { status: end.status, result: end.result || one.result, endedAt: at })); })];
                            case 4:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0;
                return [4 /*yield*/, read($, flows)];
            case 1:
                _a = (_b.sent()).filter(function (one) { return one.status === 'working'; });
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                f = _a[_i];
                return [5 /*yield**/, _loop_1(f)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
var stopFlow = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var f, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, flows)];
            case 1:
                f = (_a.sent()).find(function (one) { return one.id === id; });
                if (!f || f.status !== 'working')
                    return [2 /*return*/];
                pressed.add("flow:".concat(id));
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: f.taskId }).catch(function (err) { return ({ deny: String(err) }); })];
            case 2:
                r = _a.sent();
                if (r.deny)
                    return [2 /*return*/, (pressed.delete("flow:".concat(id)), log($, "workflow ".concat(id, " not stopped: ").concat(r.deny)))];
                return [4 /*yield*/, changeFlow($, id, function (one, at) { return (__assign(__assign({}, one), { status: 'stopped', endedAt: at })); })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var readJournal = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var f, text, now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, flows)];
            case 1:
                f = (_a.sent()).find(function (one) { return one.id === id; });
                if (!(f === null || f === void 0 ? void 0 : f.transcriptDir))
                    return [2 /*return*/];
                return [4 /*yield*/, readOr($, "".concat(f.transcriptDir, "/journal.jsonl"))];
            case 2:
                text = _a.sent();
                if (!text)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _a.sent();
                return [4 /*yield*/, changeFlow($, id, function (one) { return withJournal(one, journalOf(text), now); })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Keeps the runs true: each running one of this session's is read from its journal, its end looked for in this chat's own record
// (a reload misses the notice as it arrives), and the runs of the sessions this chat started are read from their files
var flowLooks = 0;
var followFlows = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, mine, running, _loop_2, _i, running_1, f, rows_1, _c, _d, row, _e, _f, found_1, now, _loop_3, _g, _h, entry;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = !dir;
                if (_a) return [3 /*break*/, 3];
                _b = !ccd.id;
                if (!_b) return [3 /*break*/, 2];
                return [4 /*yield*/, read($, flows)];
            case 1:
                _b = !(_j.sent()).length;
                _j.label = 2;
            case 2:
                _a = (_b);
                _j.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/];
                flowLooks += 1;
                return [4 /*yield*/, sessionName($)];
            case 4:
                mine = _j.sent();
                return [4 /*yield*/, read($, flows)];
            case 5:
                running = (_j.sent()).filter(function (f) { return f.status === 'working' && f.session === mine; });
                _loop_2 = function (f) {
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, readJournal($, f.id).catch(function (err) { return log($, "journal of ".concat(f.id, " not read: ").concat(String(err))); })];
                            case 1:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, running_1 = running;
                _j.label = 6;
            case 6:
                if (!(_i < running_1.length)) return [3 /*break*/, 9];
                f = running_1[_i];
                return [5 /*yield**/, _loop_2(f)];
            case 7:
                _j.sent();
                _j.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                if (!(running.length && flowLooks % END_LOOK === 0)) return [3 /*break*/, 14];
                return [4 /*yield*/, $.session.messages().catch(function () { return []; })];
            case 10:
                rows_1 = _j.sent();
                _c = 0, _d = Array.isArray(rows_1) ? rows_1 : [];
                _j.label = 11;
            case 11:
                if (!(_c < _d.length)) return [3 /*break*/, 14];
                row = _d[_c];
                if (!(row.role === 'user' && row.text.includes('<task-notification'))) return [3 /*break*/, 13];
                return [4 /*yield*/, flowEnded($, row.text)];
            case 12:
                _j.sent();
                _j.label = 13;
            case 13:
                _c++;
                return [3 /*break*/, 11];
            case 14:
                _e = ccd.id;
                if (!_e) return [3 /*break*/, 17];
                _f = flowLooks % END_LOOK === 1;
                if (_f) return [3 /*break*/, 16];
                return [4 /*yield*/, read($, flows)];
            case 15:
                _f = (_j.sent()).some(function (f) { return f.status === 'working' && f.session !== mine; });
                _j.label = 16;
            case 16:
                _e = (_f);
                _j.label = 17;
            case 17:
                if (!_e) return [3 /*break*/, 25];
                found_1 = [];
                return [4 /*yield*/, $.clock.now()];
            case 18:
                now = _j.sent();
                _loop_3 = function (entry) {
                    var known, stat, read1, _l, _m, one, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                if (!entry.name.endsWith('.json'))
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, read($, flows)];
                            case 1:
                                known = (_p.sent()).find(function (f) { return flowPath(f.id).endsWith("/".concat(entry.name)); });
                                if (known && (known.status !== 'working' || known.session === mine))
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, $.fs.stat("".concat(flowsDir(), "/").concat(entry.name)).catch(function () { return undefined; })];
                            case 2:
                                stat = _p.sent();
                                if (!known && stat && now - stat.mtimeMs > FLOW_OLD)
                                    return [2 /*return*/, "continue"];
                                _p.label = 3;
                            case 3:
                                _p.trys.push([3, 5, , 6]);
                                _m = (_l = JSON).parse;
                                return [4 /*yield*/, readOr($, "".concat(flowsDir(), "/").concat(entry.name))];
                            case 4:
                                read1 = _m.apply(_l, [_p.sent()]);
                                one = read1.status === 'working' && stat && now - stat.mtimeMs > FLOW_STALE ? __assign(__assign({}, read1), { status: 'stopped', endedAt: stat.mtimeMs }) : read1;
                                if (one.id && one.parent === ccd.id && one.session !== mine)
                                    found_1.push(one);
                                return [3 /*break*/, 6];
                            case 5:
                                _o = _p.sent();
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                };
                _g = 0;
                return [4 /*yield*/, $.fs.list(flowsDir()).catch(function () { return []; })];
            case 19:
                _h = _j.sent();
                _j.label = 20;
            case 20:
                if (!(_g < _h.length)) return [3 /*break*/, 23];
                entry = _h[_g];
                return [5 /*yield**/, _loop_3(entry)];
            case 21:
                _j.sent();
                _j.label = 22;
            case 22:
                _g++;
                return [3 /*break*/, 20];
            case 23:
                if (!found_1.length) return [3 /*break*/, 25];
                return [4 /*yield*/, update($, flows, function (list) { return keptFlows(__spreadArray(__spreadArray([], list.filter(function (f) { return !found_1.some(function (one) { return one.id === f.id; }); }), true), found_1, true)); })];
            case 24:
                _j.sent();
                _j.label = 25;
            case 25: return [2 /*return*/];
        }
    });
}); };
// The runs this session ran before a reload or a restart come back from their files
var loadFlows = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var mine, found, _i, _a, entry, one, _b, _c, _d, _e, found_2, f, _f, found_3, f, _g, _h, one;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, sessionName($)];
            case 1:
                mine = _j.sent();
                found = [];
                _i = 0;
                return [4 /*yield*/, $.fs.list(flowsDir()).catch(function () { return []; })];
            case 2:
                _a = _j.sent();
                _j.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                entry = _a[_i];
                if (!entry.name.endsWith('.json'))
                    return [3 /*break*/, 7];
                _j.label = 4;
            case 4:
                _j.trys.push([4, 6, , 7]);
                _c = (_b = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(flowsDir(), "/").concat(entry.name))];
            case 5:
                one = _c.apply(_b, [_j.sent()]);
                if (one.id && isFlowShown(one, mine))
                    found.push(one);
                return [3 /*break*/, 7];
            case 6:
                _d = _j.sent();
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8:
                for (_e = 0, found_2 = found; _e < found_2.length; _e++) {
                    f = found_2[_e];
                    flowSaved.set(f.id, JSON.stringify(f));
                }
                // The agents of the runs still going: their responses go on reaching their card
                for (_f = 0, found_3 = found; _f < found_3.length; _f++) {
                    f = found_3[_f];
                    if (f.status === 'working')
                        for (_g = 0, _h = f.agents; _g < _h.length; _g++) {
                            one = _h[_g];
                            flowAgents.set(one.id, f.id);
                        }
                }
                if (!found.length) return [3 /*break*/, 10];
                return [4 /*yield*/, update($, flows, function (list) { return keptFlows(__spreadArray(__spreadArray([], found.filter(function (one) { return !list.some(function (f) { return f.id === one.id; }); }), true), list, true)); })];
            case 9:
                _j.sent();
                _j.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
var openFlow = function ($, id) {
    presses += 1;
    void (function () { return __awaiter(_this, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read($, flows)];
                case 1:
                    f = (_a.sent()).find(function (one) { return one.id === id; });
                    if (!f)
                        return [2 /*return*/];
                    return [4 /*yield*/, $.ui.panes()];
                case 2:
                    if (!(_a.sent()).some(function (pane) { return pane.id === flowPaneOf(id); }))
                        flowPicked.delete(id);
                    return [4 /*yield*/, front($, flowPaneOf(id), cut(f.title, 30))];
                case 3:
                    _a.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })().catch(function (err) { return log($, "workflow ".concat(id, " not opened: ").concat(String(err))); });
};
// The agent whose chat a workflow's Details tab shows: the one pressed, else the one at work, else the last
var pickedOf = function (f) { var _a, _b; return (_b = (_a = f.agents.find(function (one) { return one.id === flowPicked.get(f.id); })) !== null && _a !== void 0 ? _a : __spreadArray([], f.agents, true).reverse().find(function (one) { return one.status === 'working'; })) !== null && _b !== void 0 ? _b : f.agents.at(-1); };
// A workflow agent's chat, read from its transcript in the run's folder when it has moved
var flowTalkOf = function ($, f, agent) { return __awaiter(_this, void 0, void 0, function () {
    var key, text, _a;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                key = [agent.id, agent.status, (_b = agent.tokens) !== null && _b !== void 0 ? _b : 0].join(':');
                if (!(((_c = flowTalks.get(agent.id)) === null || _c === void 0 ? void 0 : _c.key) !== key)) return [3 /*break*/, 4];
                if (!f.transcriptDir) return [3 /*break*/, 2];
                return [4 /*yield*/, readOr($, "".concat(f.transcriptDir, "/agent-").concat(agent.id, ".jsonl"))];
            case 1:
                _a = _e.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = '';
                _e.label = 3;
            case 3:
                text = _a;
                flowTalks.set(agent.id, { key: key, lines: text ? talkOf(rowsOf(text)) : undefined });
                _e.label = 4;
            case 4: return [2 /*return*/, (_d = flowTalks.get(agent.id)) === null || _d === void 0 ? void 0 : _d.lines];
        }
    });
}); };
var workflowHooks = function (on) {
    // A run of the Workflow tool: its card comes up from the call and what the tool answered. The call goes on as made
    on('tool.call', { tool: 'Workflow' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, answer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _b.sent();
                    answer = ((_a = r.result) !== null && _a !== void 0 ? _a : undefined);
                    if (!(!r.deny && !r.isError && answer && !answer.error && answer.status === 'async_launched')) return [3 /*break*/, 3];
                    return [4 /*yield*/, flowStarted($, e, answer).catch(function (err) { return log($, "workflow not followed: ".concat(String(err))); })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, r];
            }
        });
    }); });
};
