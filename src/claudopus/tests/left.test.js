// What a piece of work leaves running, however it started it, is a run under its card with what it is for, how far it is and the
// memory it holds, and leaves the card as it ends (on 15 Nov a launcher started with nohup but no `echo $!` drew 8 pages at once
// with 56 GB and its card showed no run at all)
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
// A process as `ps -axww -o pid=,ppid=,pgid=,stat=,etime=,rss=,command=` lists it, its memory in KB
var psLine = function (pid, ppid, pgid, command, rssKb, etime) {
    if (rssKb === void 0) { rssKb = 1000000; }
    if (etime === void 0) { etime = '00:01'; }
    return "".concat(pid, " ").concat(ppid, " ").concat(pgid, " S ").concat(etime, " ").concat(rssKb, " ").concat(command);
};
// A world where the work's command is handed process numbers from 5000 to 5100 (the probe before it gets 5000, the one after 5100),
// and the test lays the processes on this Mac, which of them still run, and where each writes
// (`shells`: the shells that run while a command does, gone as it ends)
var leftWorld = function (on, procs) {
    var pid = 4900;
    var now = { at: 1700000000000 };
    // (the work is at a step of its own throughout, as the engine lists it: an ended run's word goes into its run)
    var w = world(on, {
        agents: { a1: 'running' },
        jobs: {
            output: function (file) { var _a, _b; return (_b = (_a = procs.outputs) === null || _a === void 0 ? void 0 : _a[file]) !== null && _b !== void 0 ? _b : ''; },
            wroteAt: function () { return now.at - 2000; },
            ps: function () { return procs.list.join('\n'); },
            shells: function () { var _a; return ((_a = procs.shells) !== null && _a !== void 0 ? _a : []).join('\n'); },
            fd: function () { return Object.entries(procs.logs).map(function (_a) {
                var p = _a[0], f = _a[1];
                return "".concat(p, " ").concat(f);
            }).join('\n'); },
            pid: function () { return String((pid += 100)); },
            alive: function (p) { return procs.list.some(function (line) { return line.trim().startsWith("".concat(p, " ")); }); },
            owner: function (p) { var _a, _b; return (_b = (_a = procs.owners) === null || _a === void 0 ? void 0 : _a[p]) !== null && _b !== void 0 ? _b : 'mine'; },
        },
    });
    on('session.cwd', function () { return ({ value: '/repo' }); });
    var advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (now.at += ms);
                return [4 /*yield*/, w.clock.advance(ms)];
            case 1: return [2 /*return*/, (_a.sent())];
        }
    }); }); };
    return __assign(__assign({}, w), { advance: advance });
};
var leftTexts = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, columns) {
        var list, all, _a, _b;
        if (columns === void 0) { columns = 140; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: columns }), surface: 'terminal' }))];
                case 1:
                    list = _c.sent();
                    _a = [[]];
                    return [4 /*yield*/, list.findAll({ type: 'Text' })];
                case 2:
                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()).map(function (one) { return one.text; }), true]))];
                    return [4 /*yield*/, list.findAll({ type: 'Button' })];
                case 3:
                    all = __spreadArray.apply(void 0, _b.concat([(_c.sent()).map(function (one) { return String(one.props.label); }), true]));
                    return [4 /*yield*/, list.unmount()];
                case 4:
                    _c.sent();
                    return [2 /*return*/, all];
            }
        });
    });
};
// How often the panel is drawn afresh, counted from the test's start (the engine takes hooks only before the session starts)
var countDraws = function (on) {
    var drawn = { count: 0 };
    on('ui.invalidate', function (_, e, next) { return ((drawn.count += 1), next(e)); });
    return drawn;
};
// Whether the panel is drawn afresh no more often over a minute in which the runs' memory moves by 200 MB at each look of the
// processes than over a minute in which it holds still
var panelDrawsWhile = function (drawn, advance, procs) { return __awaiter(_this, void 0, void 0, function () {
    var minute, still, moving;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                minute = function (isMoving) { return __awaiter(_this, void 0, void 0, function () {
                    var from, n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                from = drawn.count;
                                n = 0;
                                _a.label = 1;
                            case 1:
                                if (!(n < 4)) return [3 /*break*/, 4];
                                if (isMoving)
                                    procs.list = procs.list.map(function (line) { return line.replace(/ S (\S+) (\d+) /, function (_, etime, kb) { return " S ".concat(etime, " ").concat(Number(kb) + 200000, " "); }); });
                                return [4 /*yield*/, advance(15000)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                n++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, drawn.count - from];
                        }
                    });
                }); };
                return [4 /*yield*/, minute(false)];
            case 1:
                still = _a.sent();
                return [4 /*yield*/, minute(true)];
            case 2:
                moving = _a.sent();
                return [2 /*return*/, moving <= still];
        }
    });
}); };
var leftStart = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the pages', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Draw the pages', prompt: 'draw the pages' }))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
test('a launcher that starts 8 drawings and exits leaves one run under its card in its own words, with how many programs, their progress and memory added up, and it leaves as they end (17 Nov: "Run Google Chrome ×4" named the program, not what the command was doing)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, leftCalls, advance, k, shown, appended, _a, _b, _c, _d, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                leftCalls = leftWorld(on, procs);
                advance = leftCalls.advance;
                return [4 /*yield*/, leftStart($)
                    // The launcher's shell was 5050: its 8 children run on in its group once it has gone
                ];
            case 1:
                _g.sent();
                // The launcher's shell was 5050: its 8 children run on in its group once it has gone
                for (k = 0; k < 8; k++) {
                    procs.list.push(psLine(5060 + k, 1, 5050, "/u/.venvs/ct/bin/python fig4.py page PMC closed ".concat(k), 7000000));
                    procs.logs[String(5060 + k)] = "/s/figlog/page-".concat(k, ".log");
                    procs.outputs["/s/figlog/page-".concat(k, ".log")] = "progress: ".concat(k, "/16 eyes drawn (PMC closed ").concat(k, ")\n");
                }
                // (held open, so its words give it no time: one said to take minutes is refused, to be sent in the background)
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'cd /w && ~/.venvs/ct/bin/python launch.py 8', description: 'Run the drawing of all 25 pages, eight at a time' })];
            case 2:
                // (held open, so its words give it no time: one said to take minutes is refused, to be sent in the background)
                _g.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _g.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the drawing of all 25 pages'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _g.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.filter(function (text) { return text.startsWith('Run the drawing of all 25 pages, eight at a time'); }).length).toBe(1);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('fig4.py'); })).toBe(false);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /8 programs/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /\b8 commands\b/.test(text); })).toBe(false);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /\d of 16 eyes/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('53.4 GB'); })).toBe(true);
                appended = leftCalls.appended;
                procs.list = procs.list.slice(4);
                return [4 /*yield*/, advance(20000)];
            case 5:
                _g.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /4 programs/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 6:
                _a.apply(void 0, [_g.sent()]).toBe(true);
                _b = expect;
                return [4 /*yield*/, leftTexts($)];
            case 7:
                _b.apply(void 0, [(_g.sent()).some(function (text) { return /has ended|commands? ended/.test(text); })]).toBe(false);
                expect(appended.some(function (one) { return /has ended/.test(one); })).toBe(false);
                // As the rest end, they leave, and the card counts them as the one command they were, its work told once
                procs.list = [];
                return [4 /*yield*/, advance(20000)
                    // (the card's own line may name the command that ended, once, until the work writes again)
                ];
            case 8:
                _g.sent();
                // (the card's own line may name the command that ended, once, until the work writes again)
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).every(function (text) { return !/8 programs/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 9:
                // (the card's own line may name the command that ended, once, until the work writes again)
                _c.apply(void 0, [_g.sent()]).toBe(true);
                _d = expect;
                return [4 /*yield*/, leftTexts($)];
            case 10:
                _d.apply(void 0, [(_g.sent()).some(function (text) { return /1 command ended/.test(text); })]).toBe(true);
                _e = expect;
                return [4 /*yield*/, leftTexts($)];
            case 11:
                _e.apply(void 0, [(_g.sent()).some(function (text) { return /has ended, .* has ended|has ended and/.test(text); })]).toBe(false);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (appended.some(function (one) { return one.startsWith('a1: Your command "Run the drawing of all 25 pages, eight at a time" has ended'); }) || undefined)];
                    }); }); })];
            case 12:
                _f.apply(void 0, [_g.sent()]).toBe(true);
                expect(appended.filter(function (one) { return /has ended/.test(one); }).length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('a shell loop that sends scripts off with & leaves them under the card as one run in its own words, which one Stop ends whole', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, _a, advance, killed, appended, i, shown, list, stop, _b, _c;
    var _this = this;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                _a = leftWorld(on, procs), advance = _a.advance, killed = _a.killed, appended = _a.appended;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _f.sent();
                for (i = 0; i < 4; i++) {
                    procs.list.push(psLine(5060 + i, 1, 5050, "/u/bin/python batch.py ".concat(i, " 12 /s/batch_").concat(i, ".json")));
                    procs.logs[String(5060 + i)] = "/s/batch_".concat(i, ".log");
                    procs.outputs["/s/batch_".concat(i, ".log")] = 'progress: 81/91 eyes\n';
                }
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l2', agentId: 'a1', command: 'for i in 0 1 2 3; do nohup python batch.py $i 12 /s/batch_$i.json > /s/batch_$i.log 2>&1 & done; echo started', description: 'Run the new mesh on a third of the eyes (about 3 min)' })];
            case 2:
                _f.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the new mesh on a third of the eyes'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _f.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /81 of 91 eyes/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /4 programs/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('python batch.py'); })).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
            case 5:
                list = _f.sent();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 6:
                stop = (_f.sent()).filter(function (b) { var _a; return b.props.label === 'Stop' && String((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('stop-list-job-'); });
                expect(stop.length).toBe(1);
                return [4 /*yield*/, list.press({ key: (_e = (_d = stop[0]) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '' })];
            case 7:
                _f.sent();
                return [4 /*yield*/, list.unmount()];
            case 8:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ([0, 1, 2, 3].every(function (i) { return killed.includes(String(5060 + i)); }) || undefined)];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                procs.list = [];
                return [4 /*yield*/, advance(20000)];
            case 10:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /1 command ended/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 11:
                _c.apply(void 0, [_f.sent()]).toBe(true);
                expect(appended.filter(function (one) { return one.startsWith('a1: ') && /Run the new mesh/.test(one); }).length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('a launcher started with nohup but no echo $! is a run under the card in the work\'s own words, read from its log', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, shown;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)
                    // The launcher runs on, with xargs and its drawings under it
                ];
            case 1:
                _a.sent();
                // The launcher runs on, with xargs and its drawings under it
                procs.list.push(psLine(5060, 1, 5050, '/bin/zsh /s/figs.sh /s', 2000), psLine(5061, 5060, 5050, 'xargs -P 8 -L 1 sh -c ...', 1000), psLine(5062, 5061, 5050, '/u/bin/python fig4.py page PMC closed 0', 7000000));
                procs.logs['5060'] = '/s/figs.out';
                procs.outputs['/s/figs.out'] = 'progress: 3/25 pages drawn (page-PMC-closed-2)\n';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l3', agentId: 'a1', command: 'S="/s"; rm -f "$S"/figlog/*.log; nohup "$S/figs.sh" "$S" > "$S/figs.out" 2>&1 &\nsleep 1; echo started', description: 'Run the drawing of all 25 picture pages again in the background, eight at a time (about 35 min, prints pages done of 25)' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _a.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the drawing of all 25 picture pages'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _a.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /3 of 25 pages/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('6.7 GB'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('xargs -P sending its output nowhere is a run that says it runs and gives no progress, with its memory', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, drawn, advance, shown, _a, _b;
    var _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                procs = { list: [], logs: {} };
                drawn = countDraws(on);
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _d.sent();
                (_c = procs.list).push.apply(_c, __spreadArray([psLine(5060, 1, 5050, 'xargs -P 8 -n 1 /u/bin/python draw.py', 1000)], [0, 1, 2].map(function (k) { return psLine(5070 + k, 5060, 5050, "/u/bin/python draw.py ".concat(k), 2000000); }), false));
                procs.logs['5060'] = '/dev/null';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l4', agentId: 'a1', command: 'ls jobs | xargs -P 8 -n 1 python draw.py > /dev/null 2>&1 &', description: 'Run every drawing eight at a time (about 10 min)' })];
            case 2:
                _d.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return /GB memory$/.test(text); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _d.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.startsWith('Run every drawing eight at a time'); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('5.7 GB'); })).toBe(true);
                // Its memory moving at each look of the processes draws the panel afresh no more than when it holds still: it is shown
                // at the next drawing, so the panel keeps still under the pointer
                _a = expect;
                return [4 /*yield*/, panelDrawsWhile(drawn, advance, procs)];
            case 5:
                // Its memory moving at each look of the processes draws the panel afresh no more than when it holds still: it is shown
                // at the next drawing, so the panel keeps still under the pointer
                _a.apply(void 0, [_d.sent()]).toBe(true);
                // and the card shows the new figure once it is drawn again
                return [4 /*yield*/, advance(10000)];
            case 6:
                // and the card shows the new figure once it is drawn again
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text.includes('8.8 GB'); }) || undefined)];
                        }
                    }); }); })];
            case 7:
                _b.apply(void 0, [_d.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a command that only waits is stopped as it runs, whatever its words: when over a minute its processes did nothing but sleeps that come and go, and its work is told what wakes it instead; one that ever did work, as a retry or a script that sleeps between steps, runs on', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, _a, advance, killed, appended, napping, _i, _b, pid, _c, _d, pid, _e, _f, n;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                procs = { list: [], logs: {} };
                _a = leftWorld(on, procs), advance = _a.advance, killed = _a.killed, appended = _a.appended;
                return [4 /*yield*/, leftStart($)
                    // Words the check before it runs reads as work: a function of its own, defined in a script it runs
                ];
            case 1:
                _g.sent();
                // Words the check before it runs reads as work: a function of its own, defined in a script it runs
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w1', agentId: 'a1', command: 'cd /w && nohup bash ./poll.sh > poll.log 2>&1 & echo $!', description: 'Run the poll for the sheets' })];
            case 2:
                // Words the check before it runs reads as work: a function of its own, defined in a script it runs
                _g.sent();
                napping = function (pid) { return [psLine(48213, 1, 48213, 'bash ./poll.sh'), psLine(pid, 48213, 48213, 'sleep 8')]; };
                _i = 0, _b = [48300, 48311];
                _g.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                pid = _b[_i];
                (procs.list = napping(pid));
                return [4 /*yield*/, advance(20000)];
            case 4:
                (_g.sent());
                _g.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                expect(killed).toEqual([]);
                _c = 0, _d = [48322, 48333, 48344];
                _g.label = 7;
            case 7:
                if (!(_c < _d.length)) return [3 /*break*/, 10];
                pid = _d[_c];
                (procs.list = napping(pid));
                return [4 /*yield*/, advance(20000)];
            case 8:
                (_g.sent());
                _g.label = 9;
            case 9:
                _c++;
                return [3 /*break*/, 7];
            case 10:
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, killed.includes('48213') || undefined];
                    }); }); })];
            case 11:
                _e.apply(void 0, [_g.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return /^a1: Claudopus stopped your command "Run the poll for the sheets": all it did was wait/.test(one); })];
                    }); }); })];
            case 12:
                _f.apply(void 0, [_g.sent()]).toBeDefined();
                // A retry of real work, seen once at its work, is never stopped however long it sleeps between its tries
                killed.length = 0;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'a1', command: 'cd /w && nohup bash ./copy.sh > copy.log 2>&1 & echo $!', description: 'Run the copy again until it goes through' })];
            case 13:
                _g.sent();
                procs.list = [psLine(48213, 1, 48213, 'bash ./copy.sh'), psLine(48400, 48213, 48213, 'rclone copy /a remote:')];
                return [4 /*yield*/, advance(20000)];
            case 14:
                _g.sent();
                n = 0;
                _g.label = 15;
            case 15:
                if (!(n < 6)) return [3 /*break*/, 18];
                (procs.list = [psLine(48213, 1, 48213, 'bash ./copy.sh'), psLine(48410 + n, 48213, 48213, 'sleep 30')]);
                return [4 /*yield*/, advance(20000)];
            case 16:
                (_g.sent());
                _g.label = 17;
            case 17:
                n++;
                return [3 /*break*/, 15];
            case 18:
                expect(killed).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('a Python pool left running is one run with its workers\' memory added up', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, shown;
    var _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _b.sent();
                (_a = procs.list).push.apply(_a, __spreadArray([psLine(5060, 1, 5050, '/u/bin/python pool.py', 500000)], [0, 1, 2, 3].map(function (k) { return psLine(5070 + k, 5060, 5050, '/u/bin/python -c from multiprocessing.spawn import spawn_main', 1000000); }), false));
                procs.logs['5060'] = '/w/pool.log';
                procs.outputs['/w/pool.log'] = 'progress: 10/40 tiles\n';
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l5', agentId: 'a1', command: 'cd /w && (python pool.py > pool.log 2>&1 &)', description: 'Run the tiles in a pool of four (about 5 min)' })];
            case 2:
                _b.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the tiles in a pool of four'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _b.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /10 of 40 tiles/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('4.3 GB'); })).toBe(true);
                // one run, not one per worker
                expect(shown === null || shown === void 0 ? void 0 : shown.filter(function (text) { return text.startsWith('Run the tiles in a pool of four'); }).length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('a background command whose shell ends leaving its scripts running hands them to its card as runs, and the card never says commands have ended above them (16 Nov "2 commands have ended" over two still working)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var isLaunched, outputs, procs, _a, advance, appended, _b, _c, _i, _d, k, _e, _f, _g, shown;
    var _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                isLaunched = false;
                outputs = new Proxy({}, { get: function (kept, file) { var _a; return (_a = kept[String(file)]) !== null && _a !== void 0 ? _a : (isLaunched && String(file).includes('l6') ? 'starting the renders\n[exited with code 0]\n' : undefined); } });
                procs = { list: [], logs: {}, outputs: outputs };
                _a = leftWorld(on, procs), advance = _a.advance, appended = _a.appended;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n1', agentId: 'a1', text: 'I am building the scene before the renders.' })
                    // Two commands it left going end after that line, before it starts the renders
                ];
            case 2:
                _j.sent();
                // Two commands it left going end after that line, before it starts the renders
                procs.list.push(psLine(5060, 1, 5050, '/u/bin/python build_scene.py'));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l0', agentId: 'a1', command: 'python build_scene.py &', description: 'Run a build of the scene' })];
            case 3:
                _j.sent();
                return [4 /*yield*/, advance(20000)];
            case 4:
                _j.sent();
                procs.list = [psLine(5260, 1, 5250, '/u/bin/python check_scene.py')];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'python check_scene.py &', description: 'Run a check of the scene' })];
            case 5:
                _j.sent();
                return [4 /*yield*/, advance(20000)];
            case 6:
                _j.sent();
                procs.list = [];
                return [4 /*yield*/, advance(20000)];
            case 7:
                _j.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: Your command "Run a check of the scene" has ended'); })];
                    }); }); })];
            case 8:
                _b.apply(void 0, [_j.sent()]).toBeDefined();
                // While its shell runs, the background command is its own row; nothing is taken from it
                (_h = procs.list).push.apply(_h, __spreadArray([psLine(5450, 900, 5450, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'python launch.py 4' < /dev/null")], [0, 1].map(function (k) { return psLine(5460 + k, 5450, 5450, "/u/bin/python render.py ".concat(k)); }), false));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l6', agentId: 'a1', command: 'python launch.py 4', description: 'Run the renders (about 8 min)', run_in_background: true })];
            case 9:
                _j.sent();
                return [4 /*yield*/, advance(20000)];
            case 10:
                _j.sent();
                _c = expect;
                return [4 /*yield*/, leftTexts($)];
            case 11:
                _c.apply(void 0, [(_j.sent()).some(function (text) { return text.includes('python render.py'); })]).toBe(false);
                // Its shell ends; the renders run on
                procs.list = [0, 1].map(function (k) { return psLine(5460 + k, 1, 5450, "/u/bin/python render.py ".concat(k)); });
                isLaunched = true;
                for (_i = 0, _d = [0, 1]; _i < _d.length; _i++) {
                    k = _d[_i];
                    ((procs.logs[String(5460 + k)] = "/w/r".concat(k, ".log")), (procs.outputs["/w/r".concat(k, ".log")] = 'progress: 2/9 frames\n'));
                }
                return [4 /*yield*/, advance(20000)];
            case 12:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /2 programs/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 13:
                _e.apply(void 0, [_j.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, leftTexts($)];
            case 14:
                _f.apply(void 0, [(_j.sent()).some(function (text) { return text.startsWith('Run the renders'); })]).toBe(true);
                // The launcher ends too (its card counts it with the two), but its renders still work: the card's line names the two that
                // really ended, how each ended, and never counts the launcher among them
                return [4 /*yield*/, advance(80000)];
            case 15:
                // The launcher ends too (its card counts it with the two), but its renders still work: the card's line names the two that
                // really ended, how each ended, and never counts the launcher among them
                _j.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /3 commands ended/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 16:
                _g.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, leftTexts($)];
            case 17:
                shown = _j.sent();
                expect(shown.some(function (text) { return /2 programs/.test(text); })).toBe(true);
                // The card's line stays the task's own note: which commands ended is its tree's count and its Details, never its line (18 Nov)
                expect(shown).toContain('I am building the scene before the renders.');
                expect(shown.some(function (text) { return /: ended\b|commands have ended|Run the renders (has|have) /.test(text); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a script that starts a session of its own while its command runs is still that command\'s run, even where its environment cannot be read, with what its shell\'s group holds under any name; the system\'s own programs, what another chat or app started at that moment, and what a task of this chat out of sight started while the command was held open, never are (17 Nov: a git push and a dig took headless Chrome\'s crash reporters as runs they left, "Run Google Chrome"; 18 Nov: a finished task\'s card showed another task\'s 12 GB run for 47 minutes)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var crashpad, procs, advance, shown;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                crashpad = '/u/.cache/puppeteer/chrome/mac_arm-148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks/Google Chrome for Testing Framework.framework/Helpers/chrome_crashpad_handler --monitor-self';
                procs = { list: [], logs: {}, owners: { '5060': 'hidden', '5080': 'other' }, shells: [] };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _a.sent();
                procs.list.push(psLine(5060, 1, 5060, '/u/bin/python daemon.py --serve-tiles'), psLine(5070, 1, 5070, '/System/Library/CoreServices/mdworker_shared'), psLine(5080, 1, 5077, crashpad));
                // The command's own shell (5050), seen while it runs, and a worker left in its group under a name the command never says
                procs.shells.push(psLine(5050, 900, 5050, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'python daemon.py --serve-tiles' < /dev/null"));
                procs.list.push(psLine(5065, 1, 5050, '/u/bin/node tiles-worker.mjs', 2000));
                // A task of this chat that Claudopus has no command for starts two runs meanwhile, from shells of its own (5076, 5078): their
                // numbers are within the command's, they started in time and carry this chat's session, one even runs the command's own program
                procs.list.push(psLine(5085, 1, 5076, '/u/bin/node tools/confirm.mjs 8', 12000000), psLine(5090, 1, 5078, '/u/bin/python tools/run.py confirm 8', 12000000));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l7', agentId: 'a1', command: 'python daemon.py --serve-tiles', description: 'Run the tile daemon' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _a.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the tile daemon'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _a.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('mdworker'); })).toBe(false);
                // (the daemon and its worker, and nothing of the task out of sight: none of its 12 GB)
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /2 programs/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /Chrome|crashpad|[^2] programs| GB/.test(text); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('what another task of the same chat starts while its command runs in the background is never taken by a short command of another task beside it (17 Nov: a screenshot script sent to the background started headless Chrome while a git push ran, and the push\'s card showed its crash reporters)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var crashpad, procs, advance, browsers, shown;
    var _a;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                crashpad = '/u/.cache/puppeteer/chrome/mac_arm-148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/Frameworks/Google Chrome for Testing Framework.framework/Helpers/chrome_crashpad_handler --monitor-self';
                procs = { list: [], logs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Shoot the pictures', prompt: 'shoot the pictures' }))
                    // The other task's script, sent to the background, is handed 5000 to 5100 as it goes there and runs on
                ];
            case 2:
                _b.sent();
                // The other task's script, sent to the background, is handed 5000 to 5100 as it goes there and runs on
                procs.list.push(psLine(5050, 900, 5050, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval './run.sh old & ./run.sh new; wait; node shoot.mjs' < /dev/null"));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 's1', agentId: 'a2', command: './run.sh old & ./run.sh new; wait; node shoot.mjs', description: 'Run the screenshots of both sides (about 3 min)', run_in_background: true })
                    // Its headless browsers are seen under its shell, each leading a group of its own
                ];
            case 3:
                _b.sent();
                browsers = [5250, 5251].map(function (pid) { return psLine(pid, 5050, pid, '/u/.cache/puppeteer/chrome/mac_arm-148/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing --headless', 300000); });
                (_a = procs.list).push.apply(_a, browsers);
                return [4 /*yield*/, advance(20000)
                    // The browsers end, and their crash reporters fork away while this task's git push is handed its numbers, and carry this chat's session
                ];
            case 4:
                _b.sent();
                // The browsers end, and their crash reporters fork away while this task's git push is handed its numbers, and carry this chat's session
                procs.list = procs.list.filter(function (line) { return !browsers.includes(line); });
                procs.list.push(psLine(5260, 1, 5250, crashpad, 30000), psLine(5262, 1, 5251, crashpad, 30000));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'p1', agentId: 'a1', command: 'git push -q origin fix', description: 'Upload the fix' })];
            case 5:
                _b.sent();
                return [4 /*yield*/, advance(20000)];
            case 6:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.startsWith('Run the screenshots of both sides'); }) ? all : undefined];
                            }
                        });
                    }); })
                    // (they are the other task's, whose command started them, a row named as what it started while it runs; never the push's)
                ];
            case 7:
                shown = _b.sent();
                // (they are the other task's, whose command started them, a row named as what it started while it runs; never the push's)
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /^Upload the fix|Chrome/.test(text); })).toBe(false);
                expect(shown === null || shown === void 0 ? void 0 : shown.filter(function (text) { return text.startsWith('Run the screenshots of both sides'); }).length).toBe(1);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.startsWith('What “Run the screenshots of both sides” started'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a task whose step ends while only a preview server it left going runs, its helper\'s result just passed on and to-dos still to do, is not done: it stays at work and is started again, and it is done only once it hands back its result (18 Nov: a site task\'s card showed done for half an hour, no result ever came)', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, pid, now, agents, kinds, PRESS, QUIET, talk, pressedAfter, w, advance, resumed, notified, stepped, call, ends, card, _i, _a, _b, n, item, _c, _d, _e, _f, _g, _, e_1_1, sent, _h, _j, _k, _, e_2_1, _l, _m, _o;
    var _this = this;
    var _p, e_1, _q, _r, _s, e_2, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                procs = { list: [], logs: {} };
                pid = 4900;
                now = { at: 1700000000000 };
                agents = { a1: 'running' };
                kinds = {};
                PRESS = { role: 'user', content: '[handback-send-enforce] Your report has not been delivered. Call SubagentHandback({message: <your full report>}) now; the call ends your run.' };
                QUIET = { role: 'assistant', content: [{ type: 'text', text: '<system-reminder>Waiting on my own work, which starts me again.</system-reminder>' }] };
                talk = [];
                pressedAfter = function (words) { return talk.splice(0, talk.length, { role: 'assistant', content: [{ type: 'text', text: words }] }, PRESS, QUIET, PRESS, QUIET, PRESS, QUIET); };
                w = world(on, {
                    agents: agents,
                    talk: talk,
                    kinds: kinds,
                    jobs: {
                        output: function () { return ''; },
                        wroteAt: function () { return now.at - 2000; },
                        ps: function () { return procs.list.join('\n'); },
                        fd: function () { return ''; },
                        pid: function () { return String((pid += 100)); },
                        alive: function (p) { return procs.list.some(function (line) { return line.trim().startsWith("".concat(p, " ")); }); },
                        owner: function () { return 'mine'; },
                    },
                });
                on('session.cwd', function () { return ({ value: '/repo' }); });
                advance = function (ms) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (now.at += ms);
                            return [4 /*yield*/, w.clock.advance(ms)];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                }); }); };
                resumed = w.resumed, notified = w.notified, stepped = w.stepped;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'build and deploy the site', wait: false, origin: composer })];
            case 2:
                _v.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Build and deploy the site', prompt: 'build it' }))];
            case 3:
                _v.sent();
                kinds.a1 = 'general-purpose';
                call = function (tool, id, input) {
                    if (input === void 0) { input = {}; }
                    return $.tool.call(__assign({ tool: tool, tool_use_id: id, agentId: 'a1' }, input));
                };
                ends = function (id, answer, turn) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, $.turn.complete({ answer: answer, durationMs: 1, isAborted: false, turnId: turn, reason: 'answer', agentId: id })];
                }); }); };
                card = function () { return __awaiter(_this, void 0, void 0, function () {
                    var pane, texts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                            case 1:
                                pane = _a.sent();
                                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                            case 2:
                                texts = (_a.sent()).map(function (one) { var _a; return (_a = one.text) !== null && _a !== void 0 ? _a : ''; });
                                return [4 /*yield*/, pane.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, texts];
                        }
                    });
                }); };
                _i = 0, _a = ['Find where the site is hosted', 'Say whether its domain takes email', 'Put a first page live', 'Build the full page'].entries();
                _v.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], n = _b[0], item = _b[1];
                return [4 /*yield*/, call('mcp__claudopus__todo', "t".concat(n), { item: item, state: 'done' })];
            case 5:
                _v.sent();
                _v.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, call('mcp__claudopus__todo', 't5', { item: 'Have a second Claude check the page, then put it live', state: 'doing' })
                // Its command builds the page, leaves a preview server going in its group, and takes pictures of it
            ];
            case 8:
                _v.sent();
                // Its command builds the page, leaves a preview server going in its group, and takes pictures of it
                procs.list.push(psLine(5060, 1, 5050, 'node /repo/node_modules/.bin/vite preview --port 4174'));
                return [4 /*yield*/, call('Bash', 'b1', { command: 'npm run build && (npx vite preview --port 4174 >/dev/null 2>&1 &) && node shot.mjs http://localhost:4174 desktop.png', description: 'Run build of the full page and capture desktop and phone pictures' })];
            case 9:
                _v.sent();
                return [4 /*yield*/, advance(20000)];
            case 10:
                _v.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return text.startsWith('Run build of the full page'); }) || undefined)];
                        }
                    }); }); })];
            case 11:
                _c.apply(void 0, [_v.sent()]).toBe(true);
                // It starts a second look and ends its step to wait for it, pressed for its report
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the page', prompt: 'check it', parentAgentId: 'a1' }))];
            case 12:
                // It starts a second look and ends its step to wait for it, pressed for its report
                _v.sent();
                kinds.a2 = 'general-purpose';
                agents.a2 = 'running';
                agents.a1 = 'completed';
                pressedAfter("Waiting for the second Claude's findings.");
                return [4 /*yield*/, ends('a1', "Waiting for the second Claude's findings.", 'w1')];
            case 13:
                _v.sent();
                return [4 /*yield*/, advance(6000)
                    // The helper hands back and ends: Claudopus passes its result on to the task, which takes it in a step of its own, misreads it as
                    // still to come and ends its step again, pressed for its report three times, with only the server running
                ];
            case 14:
                _v.sent();
                // The helper hands back and ends: Claudopus passes its result on to the task, which takes it in a step of its own, misreads it as
                // still to come and ends its step again, pressed for its report three times, with only the server running
                agents.a2 = 'completed';
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb2', agentId: 'a2', message: 'I found 1 serious fault: the 3D covers the headline at tablet width.' })];
            case 15:
                _v.sent();
                return [4 /*yield*/, ends('a2', '', 'h1')];
            case 16:
                _v.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a1: From Claudopus: your helper "Check the page"'); })];
                    }); }); })];
            case 17:
                _d.apply(void 0, [_v.sent()]).toBeDefined();
                agents.a1 = 'running';
                _v.label = 18;
            case 18:
                _v.trys.push([18, 23, 24, 29]);
                _e = true, _f = __asyncValues($.turn.step({ turnId: 'w2', index: 0, model: 'm', messageCount: 1, agentId: 'a1' }));
                _v.label = 19;
            case 19: return [4 /*yield*/, _f.next()];
            case 20:
                if (!(_g = _v.sent(), _p = _g.done, !_p)) return [3 /*break*/, 22];
                _r = _g.value;
                _e = false;
                _ = _r;
                void _;
                _v.label = 21;
            case 21:
                _e = true;
                return [3 /*break*/, 19];
            case 22: return [3 /*break*/, 29];
            case 23:
                e_1_1 = _v.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 29];
            case 24:
                _v.trys.push([24, , 27, 28]);
                if (!(!_e && !_p && (_q = _f.return))) return [3 /*break*/, 26];
                return [4 /*yield*/, _q.call(_f)];
            case 25:
                _v.sent();
                _v.label = 26;
            case 26: return [3 /*break*/, 28];
            case 27:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 28: return [7 /*endfinally*/];
            case 29:
                pressedAfter("Waiting for the checker's report, which is due in the next message.");
                // Claude Code presses it for its report: with only a server of its own running, nothing would start it again, so the press goes
                // to Claude (before, Claudopus answered it itself, telling it to end its step and wait)
                talk.splice(2);
                sent = stepped.length;
                _v.label = 30;
            case 30:
                _v.trys.push([30, 35, 36, 41]);
                _h = true, _j = __asyncValues($.turn.step({ turnId: 'w2', index: 1, model: 'm', messageCount: 3, agentId: 'a1' }));
                _v.label = 31;
            case 31: return [4 /*yield*/, _j.next()];
            case 32:
                if (!(_k = _v.sent(), _s = _k.done, !_s)) return [3 /*break*/, 34];
                _u = _k.value;
                _h = false;
                _ = _u;
                void _;
                _v.label = 33;
            case 33:
                _h = true;
                return [3 /*break*/, 31];
            case 34: return [3 /*break*/, 41];
            case 35:
                e_2_1 = _v.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 41];
            case 36:
                _v.trys.push([36, , 39, 40]);
                if (!(!_h && !_s && (_t = _j.return))) return [3 /*break*/, 38];
                return [4 /*yield*/, _t.call(_j)];
            case 37:
                _v.sent();
                _v.label = 38;
            case 38: return [3 /*break*/, 40];
            case 39:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 40: return [7 /*endfinally*/];
            case 41:
                expect(stepped.length).toBe(sent + 1);
                pressedAfter("Waiting for the checker's report, which is due in the next message.");
                agents.a1 = 'completed';
                return [4 /*yield*/, ends('a1', "Waiting for the checker's report, which is due in the next message.", 'w2')];
            case 42:
                _v.sent();
                return [4 /*yield*/, advance(6000)
                    // Not done, no ready note, no result: its card stays at work, and Claudopus starts it again to carry on
                ];
            case 43:
                _v.sent();
                // Not done, no ready note, no result: its card stays at work, and Claudopus starts it again to carry on
                _l = expect;
                return [4 /*yield*/, card()];
            case 44:
                // Not done, no ready note, no result: its card stays at work, and Claudopus starts it again to carry on
                _l.apply(void 0, [(_v.sent()).some(function (text) { return text === '✓ Done' || /^Done · /.test(text); })]).toBe(false);
                expect(notified).toEqual([]);
                expect(resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'); })).toHaveLength(1);
                // Started again, it runs a command, and its run ends again without its result where Claudopus hears no end of its turn, only the
                // engine listing it as over: still not done, and started again once more
                agents.a1 = 'running';
                return [4 /*yield*/, call('Bash', 'b2', { command: 'git status', description: 'Run a look at what is committed' })];
            case 45:
                _v.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, advance(25000)];
            case 46:
                _v.sent();
                return [4 /*yield*/, advance(6000)];
            case 47:
                _v.sent();
                _m = expect;
                return [4 /*yield*/, card()];
            case 48:
                _m.apply(void 0, [(_v.sent()).some(function (text) { return text === '✓ Done' || /^Done · /.test(text); })]).toBe(false);
                expect(notified).toEqual([]);
                expect(resumed.filter(function (line) { return line.startsWith('a1: From Claudopus, not ') && line.includes('Carry on from where you were'); })).toHaveLength(2);
                // It does the rest and hands back its result: only now is it done
                agents.a1 = 'running';
                return [4 /*yield*/, call('mcp__claudopus__todo', 't6', { item: 'Have a second Claude check the page, then put it live', state: 'done' })];
            case 49:
                _v.sent();
                return [4 /*yield*/, call('SubagentHandback', 'hb1', { message: 'The full page is live, checked by a second Claude.' })];
            case 50:
                _v.sent();
                agents.a1 = 'completed';
                return [4 /*yield*/, ends('a1', '', 'w3')];
            case 51:
                _v.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, card()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('✓ Done') || undefined)];
                        }
                    }); }); })];
            case 52:
                _o.apply(void 0, [_v.sent()]).toBe(true);
                return [4 /*yield*/, advance(2000)];
            case 53:
                _v.sent();
                expect(notified.map(function (line) { return line.split(' | ')[1]; })).toEqual(['The full page is live, checked by a second Claude.']);
                return [2 /*return*/];
        }
    });
}); });
