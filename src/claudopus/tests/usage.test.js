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
var _this = this;
// A Mac's look as its commands print it, with Claude's app and chat, another app, and how much has moved by the nth look
var psTime = function (seconds) { return "".concat(Math.floor(seconds / 60), ":").concat(String(seconds % 60).padStart(2, '0'), ".00"); };
var lookAt = function (n, anon) {
    if (anon === void 0) { anon = 1583261; }
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
                expect(memory === null || memory === void 0 ? void 0 : memory.props.alt).toBe('Memory: 29 of 64 GB in use, Claude 3.3 GB');
                expect(String(memory === null || memory === void 0 ? void 0 : memory.props.source)).toContain('#8A63F0');
                expect((_h = drawings.find(function (d) { return String(d.props.alt).startsWith('Processor'); })) === null || _h === void 0 ? void 0 : _h.props.alt).toBe('Processor: 50% busy, Claude 20% of the whole');
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
