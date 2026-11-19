// The line above the prompt while work runs: how Claude uses the computer, drawn on the desktop and written in the terminal
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
// A Mac's look as its commands print it, with Claude's app and chat, another app, and how much has moved by the nth look
var psTime = function (seconds) { return "".concat(Math.floor(seconds / 60), ":").concat(String(seconds % 60).padStart(2, '0'), ".00"); };
var lookAt = function (n, anon, extra) {
    if (anon === void 0) { anon = 1583261; }
    if (extra === void 0) { extra = ''; }
    return [
        '@@SELF@@ 1423',
        '@@PS@@',
        "  852     1 686704   ".concat(psTime(10 + n * 10), " /Applications/Claude.app/Contents/MacOS/Claude"),
        ' 1423   852 1745264   1:00.00 /Users/sam/Library/Application Support/Claude/claude-code/2.1.325/x/claude.app/Contents/MacOS/claude',
        "  700     1 400000   ".concat(psTime(10 + n * 15), " /Applications/Safari.app/Contents/MacOS/Safari"),
        '@@VM@@',
        'Mach Virtual Memory Statistics: (page size of 16384 bytes)',
        'Pages wired down:                             207303.',
        'Pages purgeable:                               42324.',
        "Anonymous pages:                             ".concat(anon, "."),
        'Pages occupied by compressor:                 125152.',
        '@@SYS@@',
        '68719476736',
        '10',
        '@@IO@@',
        '              disk0 ',
        '    KB/t xfrs   MB ',
        "   19.03 42547108 ".concat(1000 + n * 300, " "),
        '@@NET@@',
        "en0        1500  <Link#15>   02:00:00:00:00:01 1     0 ".concat(n * 5000000, " 2     0 0     0"),
        extra,
        '@@TOP@@',
        'PID    MEM',
        '852    3000M',
        '1423   400M',
        '',
    ].join('\n');
};
test('while work runs, the line above the prompt shows memory, the processor, the disk and the network, and nothing of what the work does', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, anon, clock, desk, shown, _a, _b, _c, drawings, memory, _d, term, line, high, amber;
    var _this = this;
    var _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                n = 0;
                anon = 1583261;
                clock = world(on, { usage: function () { return lookAt((n += 1), anon); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))
                    // Two looks five seconds apart give the speeds
                ];
            case 2:
                _j.sent();
                // Two looks five seconds apart give the speeds
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                // Two looks five seconds apart give the speeds
                _j.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                desk = _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 7:
                shown = _j.sent();
                expect(shown).toBe(true);
                // Memory used of the Mac's whole, the processor busy, the disk's and the network's speed, each beside its drawing
                _a = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^29 GB$/ })];
            case 8:
                // Memory used of the Mac's whole, the processor busy, the disk's and the network's speed, each beside its drawing
                _a.apply(void 0, [(_e = (_j.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('29 GB');
                _b = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^50%$/ })];
            case 9:
                _b.apply(void 0, [(_f = (_j.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('50%');
                _c = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^1 MB\/s$/ })];
            case 10:
                _c.apply(void 0, [(_g = (_j.sent())) === null || _g === void 0 ? void 0 : _g.text]).toBe('1 MB/s');
                return [4 /*yield*/, desk.findAll({ type: 'Svg' })
                    // The octopus, then memory and the processor with Claude's part in purple, the disk and the network
                ];
            case 11:
                drawings = _j.sent();
                // The octopus, then memory and the processor with Claude's part in purple, the disk and the network
                expect(drawings.length).toBeGreaterThanOrEqual(4);
                memory = drawings.find(function (d) { return String(d.props.alt).startsWith('Memory'); });
                expect(memory === null || memory === void 0 ? void 0 : memory.props.alt).toBe('Memory: 29 of 64 GB in use, 3.3 GB by Claude and what it started');
                expect(String(memory === null || memory === void 0 ? void 0 : memory.props.source)).toContain('#8A63F0');
                expect((_h = drawings.find(function (d) { return String(d.props.alt).startsWith('Processor'); })) === null || _h === void 0 ? void 0 : _h.props.alt).toBe('Processor: 50% busy, 20% by Claude and what it started');
                _d = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /fix the nose|Fix the nose/ })];
            case 12:
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                return [4 /*yield*/, desk.unmount()
                    // The terminal draws no pictures: the same line in words, with small meters of cells
                ];
            case 13:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 14:
                term = _j.sent();
                return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
            case 15:
                line = _j.sent();
                expect(line === null || line === void 0 ? void 0 : line.text).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% disk 63M\/s net 1M\/s$/);
                expect(line === null || line === void 0 ? void 0 : line.props.wrap).toBe('truncate-end');
                return [4 /*yield*/, term.unmount()
                    // Memory past nine tenths of the whole turns amber
                ];
            case 16:
                _j.sent();
                // Memory past nine tenths of the whole turns amber
                anon = 3600000;
                return [4 /*yield*/, clock.advance(6000)];
            case 17:
                _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 18:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 19:
                high = _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, high.find({ type: 'Text', text: /^59 GB$/ })];
                            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : undefined];
                        }
                    }); }); })];
            case 20:
                amber = _j.sent();
                expect(amber === null || amber === void 0 ? void 0 : amber.props.color).toBe('#E5A50A');
                return [4 /*yield*/, high.unmount()];
            case 21:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a look that gives nothing waits as long as one that works, so a broken look is not tried each second', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var asked, isBroken, clock, s, s;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                asked = [];
                isBroken = true;
                clock = world(on, { usage: function (script) { return (asked.push(script), isBroken ? '' : lookAt(asked.length)); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _b.sent();
                s = 0;
                _b.label = 3;
            case 3:
                if (!(s < 9)) return [3 /*break*/, 6];
                return [4 /*yield*/, clock.advance(1000)
                    // Nine seconds of a broken look: tried twice, five seconds apart, not each second, and top asked only the first time
                ];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                s++;
                return [3 /*break*/, 3];
            case 6:
                // Nine seconds of a broken look: tried twice, five seconds apart, not each second, and top asked only the first time
                expect(asked.length).toBe(2);
                expect(asked.map(function (script) { return script.includes('top -l'); })).toEqual([true, false]);
                isBroken = false;
                s = 0;
                _b.label = 7;
            case 7:
                if (!(s < 6)) return [3 /*break*/, 10];
                return [4 /*yield*/, clock.advance(1000)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                s++;
                return [3 /*break*/, 7];
            case 10:
                expect(asked.length).toBe(3);
                expect((_a = asked[2]) === null || _a === void 0 ? void 0 : _a.includes('top -l')).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
// What the Mac's own commands print for the graphics processor and the battery, in each case the bar must tell apart
var gpuAt = function (pct) { return "@@GPU@@\n\"Device Utilization %\"=".concat(pct); };
var batt = function (line) { return "@@BATT@@\nNow drawing from 'Battery Power'\n -InternalBattery-0 (id=22872163)\t".concat(line, " present: true"); };
var ac = function (line) { return "@@BATT@@\nNow drawing from 'AC Power'\n -InternalBattery-0 (id=22872163)\t".concat(line, " present: true"); };
var BATTERIES = [
    { name: 'on battery with a time left', extra: "".concat(gpuAt(37), "\n").concat(batt('85%; discharging; 4:12 remaining')), desk: ['37%', '85% 4h 12m left'], term: / gpu[▰▱]{3} 37% bat 85% 4h12m disk/, alt: 'Battery: 85%, 4h 12m left' },
    { name: 'on battery while the system still estimates', extra: batt('64%; discharging; (no estimate)'), desk: ['64%'], term: / bat 64% disk/, alt: 'Battery: 64%, on battery' },
    { name: 'charging', extra: batt('62%; charging; 1:05 remaining'), desk: ['62% 1h 05m to full'], term: / bat 62% ↑1h05m disk/, alt: 'Battery: 62%, charging, 1h 05m to full' },
    { name: 'fully charged on power', extra: "@@BATT@@\nNow drawing from 'AC Power'\n -InternalBattery-0 (id=22872163)\t100%; charged; 0:00 remaining present: true", desk: ['100%'], term: / bat 100% on power disk/, alt: 'Battery: 100%, on power' },
    { name: 'low on battery', extra: batt('12%; discharging; 0:41 remaining'), desk: ['12% 41m left'], term: / bat 12% 41m disk/, alt: 'Battery: 12%, 41m left' },
    // macOS calls the charge 100% while it still tops the cells up, and still gives a time to full: the time beside 100% is dropped
    { name: 'called full while it finishes the charge', extra: ac('100%; finishing charge; 0:36 remaining'), desk: ['100% finishing'], term: / bat 100% finishing disk/, alt: 'Battery: 100%, finishing the charge' },
    { name: 'called full while it still says charging', extra: ac('100%; charging; 0:12 remaining'), desk: ['100%'], term: / bat 100% ↑ disk/, alt: 'Battery: 100%, charging' },
    { name: 'nearly full, finishing the charge', extra: ac('99%; finishing charge; 0:05 remaining'), desk: ['99% 5m to full'], term: / bat 99% ↑5m disk/, alt: 'Battery: 99%, charging, 5m to full' },
    { name: 'held at 80% by optimised charging, or on a charger too weak to charge', extra: ac('80%; AC attached; not charging'), desk: ['80%'], term: / bat 80% on power disk/, alt: 'Battery: 80%, on power' },
    { name: 'charging while the system still estimates', extra: ac('45%; charging; (no estimate)'), desk: ['45%'], term: / bat 45% ↑ disk/, alt: 'Battery: 45%, charging' },
    // The low end the same way: a charge the system calls 0% has no time left beside it
    { name: 'called empty with a time left', extra: batt('0%; discharging; 0:09 remaining'), desk: ['0%'], term: / bat 0% disk/, alt: 'Battery: 0%, on battery' },
];
var _loop_1 = function (one) {
    test("the bar shows the battery as the system reports it: ".concat(one.name), function ($, on) { return __awaiter(_this, void 0, void 0, function () {
        var n, clock, desk, _i, _a, text, _b, drawings, _c, _d, term, _e;
        var _this = this;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    n = 0;
                    clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, one.extra); } }).clock;
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, clock.advance(1000)];
                case 3:
                    _k.sent();
                    return [4 /*yield*/, clock.advance(6000)];
                case 4:
                    _k.sent();
                    return [4 /*yield*/, clock.advance(1000)];
                case 5:
                    _k.sent();
                    return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
                case 6:
                    desk = _k.sent();
                    return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                                case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                            }
                        }); }); })];
                case 7:
                    _k.sent();
                    _i = 0, _a = one.desk;
                    _k.label = 8;
                case 8:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    text = _a[_i];
                    _b = expect;
                    return [4 /*yield*/, desk.find({ type: 'Text', text: new RegExp("^".concat(text, "$")) })];
                case 9:
                    _b.apply(void 0, [(_f = (_k.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe(text);
                    _k.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11: return [4 /*yield*/, desk.findAll({ type: 'Svg' })];
                case 12:
                    drawings = _k.sent();
                    expect((_g = drawings.find(function (d) { return String(d.props.alt).startsWith('Battery'); })) === null || _g === void 0 ? void 0 : _g.props.alt).toBe(one.alt);
                    if (!/no estimate|charged|\t(100|0)%|not charging/.test(one.extra)) return [3 /*break*/, 14];
                    _c = expect;
                    return [4 /*yield*/, desk.find({ type: 'Text', text: /\dm (left|to full)/ })];
                case 13:
                    _c.apply(void 0, [_k.sent()]).toBeUndefined();
                    _k.label = 14;
                case 14:
                    if (!(one.name === 'low on battery')) return [3 /*break*/, 16];
                    _d = expect;
                    return [4 /*yield*/, desk.find({ type: 'Text', text: /^12% 41m left$/ })];
                case 15:
                    _d.apply(void 0, [(_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.props.color]).toBe('#E5A50A');
                    _k.label = 16;
                case 16: return [4 /*yield*/, desk.unmount()];
                case 17:
                    _k.sent();
                    return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
                case 18:
                    term = _k.sent();
                    _e = expect;
                    return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
                case 19:
                    _e.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.text]).toMatch(one.term);
                    return [4 /*yield*/, term.unmount()];
                case 20:
                    _k.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var _i = 0, BATTERIES_1 = BATTERIES; _i < BATTERIES_1.length; _i++) {
    var one = BATTERIES_1[_i];
    _loop_1(one);
}
test('a computer with no battery shows none, and a desktop plugged into a UPS does not take it for its own', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, ups, clock, desk, _a, _b, _c, term, _d;
    var _this = this;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                n = 0;
                ups = "@@BATT@@\nNow drawing from 'AC Power'\n -CP1500PFCLCDa (id=1234)\t100%; charged; 0:00 remaining present: true";
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, ups); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _f.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _f.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _f.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                desk = _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 7:
                _f.sent();
                _a = expect;
                return [4 /*yield*/, desk.findAll({ type: 'Svg' })];
            case 8:
                _a.apply(void 0, [(_f.sent()).find(function (d) { return String(d.props.alt).startsWith('Battery'); })]).toBeUndefined();
                _b = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /%/ })];
            case 9:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /100%/ })];
            case 10:
                _c.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, desk.unmount()];
            case 11:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 12:
                term = _f.sent();
                _d = expect;
                return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
            case 13:
                _d.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.text]).not.toMatch(/bat|gpu/);
                return [4 /*yield*/, term.unmount()];
            case 14:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a pointer resting on a figure shows its card: who uses the most, the parts of a speed, the battery in full', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, extra, clock, desk, cards, drawn, kids, find, textOf, parentOf, _i, _a, _b, key, parts, figure, card, _c, parts_1, part, lifted, inFlow;
    var _this = this;
    var _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                n = 0;
                extra = "".concat(gpuAt(37), "\n\"In use system memory\"=1288490188\n").concat(batt('85%; discharging; 4:12 remaining'));
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, extra); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _k.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _k.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _k.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                desk = _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 7:
                _k.sent();
                cards = {
                    memory: ['Memory', '29 of 64 GB', 'Claude and what it started', '3.3 GB', 'Using the most', 'Safari', '0.4 GB'],
                    cpu: ['Processor', '50% busy', 'Cores', '10', 'Claude and what it started', '20%', 'Using the most', 'Safari', '30%'],
                    gpu: ['Graphics processor', '37% busy', 'Graphics memory in use', '1.2 GB'],
                    battery: ['Battery', '85%', 'On battery · about 4h 12m left'],
                    disk: ['Disk, read and written', '63 MB/s'],
                    net: ['Network', '1 MB/s', 'Download', 'Upload'],
                };
                return [4 /*yield*/, desk.drawn()];
            case 8:
                drawn = _k.sent();
                kids = function (el) { var _a; return [el.children, (_a = el.props) === null || _a === void 0 ? void 0 : _a.children].flatMap(function (c) { return (Array.isArray(c) ? c : c && typeof c === 'object' ? [c] : []); }); };
                find = function (node, key) {
                    var _a;
                    if (!node || typeof node !== 'object')
                        return undefined;
                    if (Array.isArray(node))
                        return node.map(function (n) { return find(n, key); }).find(Boolean);
                    var el = node;
                    return ((_a = el.props) === null || _a === void 0 ? void 0 : _a.key) === key ? el : kids(el).map(function (k) { return find(k, key); }).find(Boolean);
                };
                textOf = function (node) { return (typeof node === 'string' ? [node] : !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(textOf) : kids(node).flatMap(textOf)); };
                parentOf = function (node, key) {
                    if (!node || typeof node !== 'object')
                        return undefined;
                    if (Array.isArray(node))
                        return node.map(function (n) { return parentOf(n, key); }).find(Boolean);
                    var el = node;
                    return kids(el).some(function (k) { var _a; return ((_a = k.props) === null || _a === void 0 ? void 0 : _a.key) === key; }) ? el : kids(el).map(function (k) { return parentOf(k, key); }).find(Boolean);
                };
                for (_i = 0, _a = Object.entries(cards); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], parts = _b[1];
                    figure = find(drawn, "usage-".concat(key));
                    // The figure lights its group and a faint fill under a resting pointer: a group member whose hover changes nothing is never wired
                    // to the pointer by the desktop app
                    expect((_d = figure === null || figure === void 0 ? void 0 : figure.hover) === null || _d === void 0 ? void 0 : _d.scope).toBe("usage-".concat(key));
                    expect(Object.keys((_e = figure === null || figure === void 0 ? void 0 : figure.hover) !== null && _e !== void 0 ? _e : {}).sort()).toEqual(['backgroundColor', 'scope']);
                    card = find(drawn, "usage-".concat(key, "-card"));
                    expect((_f = card === null || card === void 0 ? void 0 : card.props) === null || _f === void 0 ? void 0 : _f.display).toBe('none');
                    expect(card === null || card === void 0 ? void 0 : card.hover).toEqual({ scope: "usage-".concat(key), display: 'flex' });
                    for (_c = 0, parts_1 = parts; _c < parts_1.length; _c++) {
                        part = parts_1[_c];
                        expect(textOf(card)).toContain(part);
                    }
                    lifted = parentOf(drawn, "usage-".concat(key, "-card"));
                    expect((_g = lifted === null || lifted === void 0 ? void 0 : lifted.props) === null || _g === void 0 ? void 0 : _g.position).toBe('absolute');
                    expect((_h = lifted === null || lifted === void 0 ? void 0 : lifted.props) === null || _h === void 0 ? void 0 : _h.display).toBe('none');
                    expect((_j = lifted === null || lifted === void 0 ? void 0 : lifted.props) === null || _j === void 0 ? void 0 : _j.key).toBeUndefined();
                    expect(lifted === null || lifted === void 0 ? void 0 : lifted.hover).toEqual({ display: 'flex' });
                    expect(kids(figure !== null && figure !== void 0 ? figure : {})).toContain(lifted);
                }
                inFlow = function (node) { var _a; return !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(inFlow) : ((_a = node.props) === null || _a === void 0 ? void 0 : _a.position) === 'absolute' ? [] : __spreadArray([node], kids(node).flatMap(inFlow), true); };
                expect(inFlow(drawn).filter(function (k) { var _a, _b; return (_b = (_a = k.props) === null || _a === void 0 ? void 0 : _a.key) === null || _b === void 0 ? void 0 : _b.endsWith('-card'); })).toEqual([]);
                return [4 /*yield*/, desk.unmount()];
            case 9:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('each drawing of the bar moves the figures past the places they had, so the app shows again no card the pointer has left', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, clock, desk, spacers, keyed, first, _a, _b, _c, _d, before, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                n = 0;
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, "".concat(gpuAt(37), "\n").concat(batt('85%; discharging; 4:12 remaining'))); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _f.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _f.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _f.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                desk = _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })
                    // The hidden keyed Boxes before the figures, there in every other drawing: more than the figures and their cards hold, so no
                    // figure's card takes a place a card had in the drawing before
                ];
            case 7:
                _f.sent();
                spacers = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c; return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = (_a = JSON).stringify;
                            return [4 /*yield*/, desk.drawn()];
                        case 1: return [2 /*return*/, ((_c = _b.apply(_a, [_d.sent()]).match(/"key":"usage-spacer-\d+"/g)) !== null && _c !== void 0 ? _c : []).length];
                    }
                }); }); };
                keyed = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c; return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = (_a = JSON).stringify;
                            return [4 /*yield*/, desk.drawn()];
                        case 1: return [2 /*return*/, ((_c = _b.apply(_a, [_d.sent()]).match(/"key":"usage-(?!spacer)[^"]*"/g)) !== null && _c !== void 0 ? _c : []).length];
                    }
                }); }); };
                return [4 /*yield*/, spacers()];
            case 8:
                first = _f.sent();
                _a = expect;
                return [4 /*yield*/, keyed()];
            case 9:
                _a.apply(void 0, [_f.sent()]).toBeLessThan(120);
                return [4 /*yield*/, clock.advance(6000)];
            case 10:
                _f.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 11:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, spacers()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== first ? true : undefined)];
                        }
                    }); }); })];
            case 12:
                _b.apply(void 0, [_f.sent()]).toBe(true);
                _c = expect;
                _d = [first];
                return [4 /*yield*/, spacers()];
            case 13:
                _c.apply(void 0, [_d.concat([_f.sent()]).sort(function (a, b) { return a - b; })]).toEqual([0, 120]);
                return [4 /*yield*/, spacers()];
            case 14:
                before = _f.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the ears' }))];
            case 15:
                _f.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, spacers()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== before ? true : undefined)];
                        }
                    }); }); })];
            case 16:
                _e.apply(void 0, [_f.sent()]).toBe(true);
                return [4 /*yield*/, desk.unmount()];
            case 17:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in a narrow terminal a figure that does not fit is left out whole, the network and the disk first, never the battery cut', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, clock, line, _a, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                n = 0;
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, "".concat(gpuAt(37), "\n").concat(batt('85%; discharging; 4:12 remaining'))); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _d.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _d.sent();
                line = function (bodyColumns) { return __awaiter(_this, void 0, void 0, function () {
                    var term, text;
                    var _this = this;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { bodyColumns: bodyColumns }), surface: 'terminal' }))];
                            case 1:
                                term = _c.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
                                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                                        }
                                    }); }); })];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
                            case 3:
                                text = (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
                                return [4 /*yield*/, term.unmount()];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, text];
                        }
                    });
                }); };
                // A phone's 50 columns: memory, the processor and the battery whole; a little more room, the graphics processor too
                _a = expect;
                return [4 /*yield*/, line(44)];
            case 6:
                // A phone's 50 columns: memory, the processor and the battery whole; a little more room, the graphics processor too
                _a.apply(void 0, [_d.sent()]).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% bat 85% 4h12m$/);
                _b = expect;
                return [4 /*yield*/, line(50)];
            case 7:
                _b.apply(void 0, [_d.sent()]).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% gpu[▰▱]{3} 37% bat 85% 4h12m$/);
                _c = expect;
                return [4 /*yield*/, line(80)];
            case 8:
                _c.apply(void 0, [_d.sent()]).toMatch(/bat 85% 4h12m disk 63M\/s net 1M\/s$/);
                return [2 /*return*/];
        }
    });
}); });
test('in a phone-narrow terminal the word for a charge the system calls full while it finishes is shown whole', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, clock, term, _a, desk, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                n = 0;
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, "".concat(gpuAt(37), "\n").concat(ac('100%; finishing charge; 0:00 remaining'))); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _d.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _d.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { props: __assign(__assign({}, BAND.props), { bodyColumns: 44 }), surface: 'terminal' }))];
            case 6:
                term = _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 7:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, term.find({ type: 'Text', text: /^mem/ })];
            case 8:
                _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toMatch(/^mem[▰▱]{3} 29G cpu[▰▱]{3} 50% bat 100% finishing$/);
                return [4 /*yield*/, term.unmount()
                    // and the line of more says what the system said, with no estimate it did not give
                ];
            case 9:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 10:
                desk = _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: /^63 MB\/s$/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })
                    // Its card says it in full
                ];
            case 11:
                _d.sent();
                // Its card says it in full
                _b = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: 'Finishing the charge · the system calls it full and still tops it up' })];
            case 12:
                // Its card says it in full
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, desk.unmount()];
            case 13:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the battery card says what the Mac draws, the processors and graphics each, and Claude\'s part of each, with no paragraph under them', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, power, clock, desk, _i, _a, text, _b, _c, _d, _e, _f, _g, text, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                n = 0;
                power = function (k) {
                    return [
                        gpuAt(60),
                        ac('94%; charging; (no estimate)'),
                        '@@POWER@@',
                        '"SystemLoad"=80000',
                        '@@GPUP@@',
                        "      \"AppUsage\" = ({\"API\"=\"Metal\",\"accumulatedGPUTime\"=".concat(k * 1e9, "})"),
                        '      "IOUserClientCreator" = "pid 852, Claude"',
                        "      \"AppUsage\" = ({\"API\"=\"Metal\",\"accumulatedGPUTime\"=".concat(k * 3e9, "})"),
                        '      "IOUserClientCreator" = "pid 700, Safari"',
                        '@@RU@@',
                        "1423 0 0 ".concat(k * 20e9),
                        "E ".concat(k * 40e9, " ").concat(k * 5e9),
                    ].join('\n');
                };
                clock = world(on, { usage: function () { return lookAt((n += 1), 1583261, power(n)); } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 2:
                _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 3:
                _j.sent();
                return [4 /*yield*/, clock.advance(6000)];
            case 4:
                _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 5:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                desk = _j.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, desk.find({ type: 'Text', text: 'Power use, whole Mac' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? true : undefined)];
                        }
                    }); }); })];
            case 7:
                _j.sent();
                _i = 0, _a = ['Power use, whole Mac', '80 W', 'Power use, processors', 'Claude, processors', 'Power use, graphics', 'Claude, graphics', /^about [\d.]+ W$/];
                _j.label = 8;
            case 8:
                if (!(_i < _a.length)) return [3 /*break*/, 11];
                text = _a[_i];
                _b = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: text })];
            case 9:
                _b.apply(void 0, [_j.sent()]).toBeDefined();
                _j.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                _c = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: "Claude's processors draw" })];
            case 12:
                _c.apply(void 0, [_j.sent()]).toBeUndefined();
                // The cards are their rows alone: no paragraph under them on what the figures cover, and no line on what busy means
                _d = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: /^Claude: the app/ })];
            case 13:
                // The cards are their rows alone: no paragraph under them on what the figures cover, and no line on what busy means
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: 'Time at work, at any speed' })];
            case 14:
                _e.apply(void 0, [_j.sent()]).toBeUndefined();
                _f = 0, _g = ['Power use', 'Safari', '45%', '15%'];
                _j.label = 15;
            case 15:
                if (!(_f < _g.length)) return [3 /*break*/, 18];
                text = _g[_f];
                _h = expect;
                return [4 /*yield*/, desk.find({ type: 'Text', text: text })];
            case 16:
                _h.apply(void 0, [_j.sent()]).toBeDefined();
                _j.label = 17;
            case 17:
                _f++;
                return [3 /*break*/, 15];
            case 18: return [4 /*yield*/, desk.unmount()];
            case 19:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a task's heavy command that must wait, while the Mac is busy and another of the chat's runs, is refused at once with why and what it waits for, a helper's as a task's: no place is kept for it, its card says nothing of a turn, however long it waits it is never let through for that, and nothing starts its work again or sends it later, so it runs when its task sends it again once there is room; a watch in the background for that room is allowed; one with nothing else heavy running, or with the setting at Never, runs at once (16 Nov: ten tasks drove headless browsers on one Mac at once)", SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var n, load, _a, clock, files, appended, resumed, _i, _b, description, shoot, _c, HELD, second, _d, _e, _f, texts, QUEUE, held, watch, _g, _h, _j, sent, k, _k, k, _l, _m, _o, _p;
    var _this = this;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                n = 0;
                load = 60;
                _a = world(on, { usage: function () { return lookAt((n += 1), 1583261, "@@LOAD@@\n{ ".concat(load, ".00 50.00 40.00 }")); } }), clock = _a.clock, files = _a.files, appended = _a.appended, resumed = _a.resumed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _q.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'shoot every page', wait: false, origin: composer })];
            case 2:
                _q.sent();
                _i = 0, _b = ['Shoot the pages', 'Shoot the cards', 'Shoot the menus'];
                _q.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                description = _b[_i];
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: description, prompt: description }))];
            case 4:
                _q.sent();
                _q.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                shoot = function (id, agentId, description, isBackground) {
                    if (isBackground === void 0) { isBackground = false; }
                    return $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: "cd /w && npx playwright screenshot http://localhost:3000/".concat(agentId, " ").concat(agentId, ".png"), description: description }, (isBackground ? { run_in_background: true } : {})));
                };
                // Load 60 on 10 cores: the first heavy command still starts at once, as nothing else heavy of the chat's runs
                _c = expect;
                return [4 /*yield*/, shoot('s1', 'a1', 'Take the page shots', true)];
            case 7:
                // Load 60 on 10 cores: the first heavy command still starts at once, as nothing else heavy of the chat's runs
                _c.apply(void 0, [(_q.sent()).deny]).toBeUndefined();
                HELD = function (what) { return new RegExp("^Not run: the Mac is busy \\(load 60 on 10 cores, .* GB memory in use\\), and \"".concat(what, "\" is a heavy command, so it waits for \"Take the page shots\" to end\\. Do what does not need it, and send the same command again once one of those has ended, or the Mac has room\\.$")); };
                return [4 /*yield*/, shoot('s2', 'a2', 'Take the card shots')];
            case 8:
                second = (_q.sent()).deny;
                expect(second).toMatch(HELD('Take the card shots'));
                _d = expect;
                return [4 /*yield*/, shoot('s3', 'a3', 'Take the menu shots')];
            case 9:
                _d.apply(void 0, [(_q.sent()).deny]).toMatch(HELD('Take the menu shots'));
                // The same command sent again while the Mac is busy is refused in the same words: it has no place to keep
                _e = expect;
                return [4 /*yield*/, shoot('s2b', 'a2', 'Take the card shots')];
            case 10:
                // The same command sent again while the Mac is busy is refused in the same words: it has no place to keep
                _e.apply(void 0, [(_q.sent()).deny]).toBe(second);
                // A helper's is refused as a task's is
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Shoot the footer', prompt: 'footer', parentAgentId: 'a1' }))];
            case 11:
                // A helper's is refused as a task's is
                _q.sent();
                _f = expect;
                return [4 /*yield*/, shoot('s9', 'a4', 'Take the footer shots')];
            case 12:
                _f.apply(void 0, [(_q.sent()).deny]).toMatch(HELD('Take the footer shots'));
                texts = function () { return __awaiter(_this, void 0, void 0, function () {
                    var list, all;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 140 }), surface: 'terminal' }))];
                            case 1:
                                list = _a.sent();
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 2:
                                all = (_a.sent()).map(function (one) { return one.text; });
                                return [4 /*yield*/, list.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, all];
                        }
                    });
                }); };
                QUEUE = /less busy|in line|its turn|room on the Mac|starts Claude again/;
                return [4 /*yield*/, texts()];
            case 13:
                held = _q.sent();
                expect(held.filter(function (text) { return QUEUE.test(text); })).toEqual([]);
                expect(held.some(function (text) { return /Take the (card|menu|footer) shots/.test(text); })).toBe(false);
                expect(held.some(function (text) { return /^Shoot the cards$/.test(text); })).toBe(true);
                watch = { tool: 'Bash', agentId: 'a2', command: 'until [ -f /w/a1.png ]; do sleep 10; done', description: 'Watch for the page shots to end' };
                _g = expect;
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, watch), { tool_use_id: 'w0' }))];
            case 14:
                _g.apply(void 0, [(_q.sent()).deny]).toContain('this command only waits, and held open it keeps you from everything else');
                _h = expect;
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, watch), { tool_use_id: 'w1', run_in_background: true }))];
            case 15:
                _h.apply(void 0, [(_q.sent()).deny]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, texts()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (text) { return /^Watch for the page shots to end/.test(text); }) || undefined)];
                        }
                    }); }); })];
            case 16:
                _j.apply(void 0, [_q.sent()]).toBe(true);
                // A step that ends starts nothing, and however long the Mac stays busy the command is never let through for having waited
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting for room.', durationMs: 1, isAborted: false, turnId: 't-a3', reason: 'answer', agentId: 'a3' })];
            case 17:
                // A step that ends starts nothing, and however long the Mac stays busy the command is never let through for having waited
                _q.sent();
                sent = function () { return __spreadArray(__spreadArray([], appended, true), resumed, true).filter(function (line) { return /turn|the Mac has room|has waited|[Ss]end it again/.test(line); }); };
                k = 0;
                _q.label = 18;
            case 18:
                if (!(k < 16)) return [3 /*break*/, 21];
                return [4 /*yield*/, clock.advance(60000)];
            case 19:
                _q.sent();
                _q.label = 20;
            case 20:
                k++;
                return [3 /*break*/, 18];
            case 21:
                _k = expect;
                return [4 /*yield*/, shoot('s3b', 'a3', 'Take the menu shots')];
            case 22:
                _k.apply(void 0, [(_q.sent()).deny]).toMatch(HELD('Take the menu shots'));
                // The load falls: nobody is started again or told, and the command runs when its task sends it again
                load = 3;
                k = 0;
                _q.label = 23;
            case 23:
                if (!(k < 10)) return [3 /*break*/, 26];
                return [4 /*yield*/, clock.advance(6000)];
            case 24:
                _q.sent();
                _q.label = 25;
            case 25:
                k++;
                return [3 /*break*/, 23];
            case 26:
                expect(sent()).toEqual([]);
                _l = expect;
                return [4 /*yield*/, texts()];
            case 27:
                _l.apply(void 0, [(_q.sent()).filter(function (text) { return QUEUE.test(text); })]).toEqual([]);
                _m = expect;
                return [4 /*yield*/, shoot('s2c', 'a2', 'Take the card shots')];
            case 28:
                _m.apply(void 0, [(_q.sent()).deny]).toBeUndefined();
                // Busy again, it is refused again; with the setting at Never, a heavy command runs at once however busy the Mac is
                load = 60;
                return [4 /*yield*/, clock.advance(6000)];
            case 29:
                _q.sent();
                _o = expect;
                return [4 /*yield*/, shoot('s4', 'a3', 'Take the header shots')];
            case 30:
                _o.apply(void 0, [(_q.sent()).deny]).toMatch(/^Not run: the Mac is busy \(load 60 on 10 cores, .*, and "Take the header shots" is a heavy command, so it waits for /);
                ownSet(files, 'config.json', JSON.stringify({ heavy: 'never' }));
                _p = expect;
                return [4 /*yield*/, shoot('s5', 'a3', 'Take the header shots')];
            case 31:
                _p.apply(void 0, [(_q.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
