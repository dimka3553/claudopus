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
var leftWorld = function (on, procs) {
    var pid = 4900;
    var now = { at: 1700000000000 };
    var w = world(on, {
        jobs: {
            output: function (file) { var _a, _b; return (_b = (_a = procs.outputs) === null || _a === void 0 ? void 0 : _a[file]) !== null && _b !== void 0 ? _b : ''; },
            wroteAt: function () { return now.at - 2000; },
            ps: function () { return procs.list.join('\n'); },
            fd: function () { return Object.entries(procs.logs).map(function (_a) {
                var p = _a[0], f = _a[1];
                return "".concat(p, " ").concat(f);
            }).join('\n'); },
            pid: function () { return String((pid += 100)); },
            alive: function (p) { return procs.list.some(function (line) { return line.trim().startsWith("".concat(p, " ")); }); },
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
test('a launcher that starts 8 drawings and exits leaves 8 runs under its card, each with its progress and memory, and each leaves as it ends', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, k, shown, _a, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)
                    // The launcher's shell was 5050: its 8 children run on in its group once it has gone
                ];
            case 1:
                _c.sent();
                // The launcher's shell was 5050: its 8 children run on in its group once it has gone
                for (k = 0; k < 8; k++) {
                    procs.list.push(psLine(5060 + k, 1, 5050, "/u/.venvs/ct/bin/python fig4.py page PMC closed ".concat(k), 7000000));
                    procs.logs[String(5060 + k)] = "/s/figlog/page-".concat(k, ".log");
                    procs.outputs["/s/figlog/page-".concat(k, ".log")] = "progress: ".concat(k, "/16 eyes drawn (PMC closed ").concat(k, ")\n");
                }
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l1', agentId: 'a1', command: 'cd /w && ~/.venvs/ct/bin/python launch.py 8', description: 'Run the drawing of all 25 pages, eight at a time (about 20 min)' })];
            case 2:
                _c.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _c.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var all;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, leftTexts($)];
                                case 1:
                                    all = _a.sent();
                                    return [2 /*return*/, all.some(function (text) { return text.includes('python fig4.py page PMC'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _c.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /^Run python fig4\.py page PMC closed \d/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /\d of 16 eyes/.test(text); })).toBe(true);
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return text.includes('6.7 GB'); })).toBe(true);
                // As they end, they leave, and the card counts them as ended
                procs.list = [];
                return [4 /*yield*/, advance(20000)
                    // (the card's own line may say a command of it has ended, until the work writes again)
                ];
            case 5:
                _c.sent();
                // (the card's own line may say a command of it has ended, until the work writes again)
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).every(function (text) { return !text.includes('fig4.py page') || / has ended$/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 6:
                // (the card's own line may say a command of it has ended, until the work writes again)
                _a.apply(void 0, [_c.sent()]).toBe(true);
                _b = expect;
                return [4 /*yield*/, leftTexts($)];
            case 7:
                _b.apply(void 0, [(_c.sent()).some(function (text) { return /8 commands ended/.test(text); })]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a shell loop that sends scripts off with & leaves its runs under the card', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, i, shown;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _a.sent();
                for (i = 0; i < 4; i++) {
                    procs.list.push(psLine(5060 + i, 1, 5050, "/u/bin/python batch.py ".concat(i, " 12 /s/batch_").concat(i, ".json")));
                    procs.logs[String(5060 + i)] = "/s/batch_".concat(i, ".log");
                    procs.outputs["/s/batch_".concat(i, ".log")] = 'progress: 81/91 eyes\n';
                }
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l2', agentId: 'a1', command: 'for i in 0 1 2 3; do nohup python batch.py $i 12 /s/batch_$i.json > /s/batch_$i.log 2>&1 & done; echo started', description: 'Run the new mesh on a third of the eyes (about 3 min)' })];
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
                                    return [2 /*return*/, all.some(function (text) { return text.includes('python batch.py'); }) ? all : undefined];
                            }
                        });
                    }); })];
            case 4:
                shown = _a.sent();
                expect(shown === null || shown === void 0 ? void 0 : shown.some(function (text) { return /81 of 91 eyes/.test(text); })).toBe(true);
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
test('a background command whose shell ends leaving its scripts running hands them to its card as runs', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, _a, _i, _b, k, _c;
    var _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                procs = { list: [], logs: {}, outputs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)
                    // While its shell runs, the background command is its own row; nothing is taken from it
                ];
            case 1:
                _e.sent();
                // While its shell runs, the background command is its own row; nothing is taken from it
                (_d = procs.list).push.apply(_d, __spreadArray([psLine(5050, 900, 5050, "/bin/zsh -c source /h/.claude/shell-snapshots/snapshot-zsh-1.sh && eval 'python launch.py 4' < /dev/null")], [0, 1].map(function (k) { return psLine(5060 + k, 5050, 5050, "/u/bin/python render.py ".concat(k)); }), false));
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'l6', agentId: 'a1', command: 'python launch.py 4', description: 'Run the renders (about 8 min)', run_in_background: true })];
            case 2:
                _e.sent();
                return [4 /*yield*/, advance(20000)];
            case 3:
                _e.sent();
                _a = expect;
                return [4 /*yield*/, leftTexts($)];
            case 4:
                _a.apply(void 0, [(_e.sent()).some(function (text) { return text.includes('python render.py'); })]).toBe(false);
                // Its shell ends; the renders run on
                procs.list = [0, 1].map(function (k) { return psLine(5060 + k, 1, 5050, "/u/bin/python render.py ".concat(k)); });
                for (_i = 0, _b = [0, 1]; _i < _b.length; _i++) {
                    k = _b[_i];
                    ((procs.logs[String(5060 + k)] = "/w/r".concat(k, ".log")), (procs.outputs["/w/r".concat(k, ".log")] = 'progress: 2/9 frames\n'));
                }
                return [4 /*yield*/, advance(20000)];
            case 5:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, leftTexts($)];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /^Run python render\.py [01]/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 6:
                _c.apply(void 0, [_e.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a script that starts a session of its own while its command runs is still that command\'s run; the system\'s own programs never are', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var procs, advance, shown;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                procs = { list: [], logs: {} };
                advance = leftWorld(on, procs).advance;
                return [4 /*yield*/, leftStart($)];
            case 1:
                _a.sent();
                procs.list.push(psLine(5060, 1, 5060, '/u/bin/python daemon.py --serve-tiles'), psLine(5070, 1, 5070, '/System/Library/CoreServices/mdworker_shared'));
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
                return [2 /*return*/];
        }
    });
}); });
