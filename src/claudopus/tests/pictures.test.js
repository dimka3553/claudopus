// Pictures a piece of work made, in its chat
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
test("the pictures a work made are in its chat where it made them: drawn small where the panel can, opened whole in the Mac's own viewer on a press, a gone one named", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var svg, talk, _a, files, logged, shown, _i, _b, surface, pane, tab, labels, svgs, _c, was, _d;
    var _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                svg = '/tmp/work/chart.svg';
                talk = [
                    { role: 'user', text: 'Draw the chart.', toolUses: [] },
                    {
                        role: 'assistant',
                        text: 'Drawing it.',
                        toolUses: [
                            { tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } },
                            { tool_use_id: 'u2', tool: 'Bash', input: { command: 'sips -g pixelWidth /tmp/old/before.png', description: 'Measure the old one' }, text: 'pixelWidth: 10' },
                            { tool_use_id: 'u4', tool: 'Read', input: { file_path: '/tmp/old/before.png' } },
                        ],
                    },
                    { role: 'assistant', text: 'Here it is.', toolUses: [{ tool_use_id: 'u3', tool: 'SendUserFile', input: { files: ['/tmp/work/gone.png'], status: 'normal' } }] },
                ];
                _a = world(on, { talk: talk }), files = _a.files, logged = _a.logged, shown = _a.shown;
                files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
                files.set('/tmp/old/before.png', 'old');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })];
            case 2:
                _h.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Draw the chart.' }))];
            case 3:
                _h.sent();
                _i = 0, _b = ['terminal', 'desktop'];
                _h.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 18];
                surface = _b[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
            case 5:
                pane = _h.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 6:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: surface }))];
            case 7:
                tab = _h.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 8:
                labels = (_h.sent()).map(function (one) { return String(one.props.label); });
                // The picture it wrote, under the run of steps that made it, whether that run is open or not
                expect(labels.filter(function (label) { return label.includes('chart.svg'); })).toEqual([surface === 'terminal' ? '⤢ Open: chart.svg' : '⤢ Open large: chart.svg']);
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 9:
                svgs = (_h.sent()).filter(function (one) { return String(one.props.alt).startsWith('Picture:'); });
                expect(svgs.map(function (one) { return String(one.props.source).slice(0, 4); })).toEqual(surface === 'terminal' ? [] : ['<svg']);
                // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
                _c = expect;
                return [4 /*yield*/, tab.find({ type: 'Text', text: /^Picture: gone\.png/ })];
            case 10:
                // One it sent that is gone is named, with nothing to press; one a command or a read only looked at, made before the work, is no picture of it
                _c.apply(void 0, [(_e = (_h.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Picture: gone.png · no longer available');
                expect(labels.some(function (label) { return label.includes('before.png'); })).toBe(false);
                // Pressed, it opens whole in a window of its own, the panel left as it was; each press opens it again
                shown.length = 0;
                return [4 /*yield*/, keyed(tab, 'pic-open-1-0')];
            case 11:
                was = (_f = (_h.sent())) === null || _f === void 0 ? void 0 : _f.key;
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 12:
                _h.sent();
                expect(shown).toEqual([['open', svg]]);
                // A new key, as every press gives, so the app does not hold the view on the row last pressed
                _d = expect;
                return [4 /*yield*/, keyed(tab, 'pic-open-1-0')];
            case 13:
                // A new key, as every press gives, so the app does not hold the view on the row last pressed
                _d.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.key]).not.toBe(was);
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 14:
                _h.sent();
                expect(shown).toEqual([['open', svg], ['open', svg]]);
                return [4 /*yield*/, tab.unmount()];
            case 15:
                _h.sent();
                return [4 /*yield*/, pane.unmount()];
            case 16:
                _h.sent();
                _h.label = 17;
            case 17:
                _i++;
                return [3 /*break*/, 4];
            case 18:
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("in a chat the app runs on another Mac over ssh, a picture's row in Details draws it large in that tab, no tab opened, closed or opened again, and Back brings the Details again", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var svg, talk, _a, files, logged, shown, opened, closed, pane, tab, openedBefore, closedBefore, svgs, labels, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                svg = '/tmp/work/chart.svg';
                talk = [
                    { role: 'user', text: 'Draw the chart.', toolUses: [] },
                    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
                ];
                _a = world(on, { talk: talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, logged = _a.logged, shown = _a.shown, opened = _a.opened, closed = _a.closed;
                files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"/>');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Draw the chart.' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _d.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                tab = _d.sent();
                shown.length = 0;
                openedBefore = __spreadArray([], opened, true);
                closedBefore = __spreadArray([], closed, true);
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 7:
                _d.sent();
                expect(shown.filter(function (one) { return one[0] === 'open'; })).toEqual([]);
                expect(opened).toEqual(openedBefore);
                expect(closed).toEqual(closedBefore);
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 8:
                svgs = _d.sent();
                expect(svgs.map(function (one) { return String(one.props.alt); })).toEqual(['Picture: chart.svg']);
                expect(String((_c = svgs[0]) === null || _c === void 0 ? void 0 : _c.props.source)).toContain('width="1200"');
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 9:
                labels = (_d.sent()).map(function (one) { return String(one.props.label); });
                expect(labels).toEqual(['← Back to Details', '← Back to Details']);
                return [4 /*yield*/, pressed(tab, 'pic-back-top')];
            case 10:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 11:
                _b.apply(void 0, [(_d.sent()).map(function (one) { return String(one.props.label); })]).toContain('⤢ Open large: chart.svg');
                expect(opened).toEqual(openedBefore);
                expect(closed).toEqual(closedBefore);
                return [4 /*yield*/, tab.unmount()];
            case 12:
                _d.sent();
                return [4 /*yield*/, pane.unmount()];
            case 13:
                _d.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
// The most characters the app draws in one tab (its renderer throws a larger drawing away whole)
var APP_DRAWING_CHARS = 262144;
// How many characters a tab's drawing holds, as the app counts them before it draws one: its texts, labels and pictures' sources
var drawnChars = function (tab) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 1:
                _a = (_c.sent()).reduce(function (sum, one) { var _a; return sum + String(one.props.source).length + String((_a = one.props.alt) !== null && _a !== void 0 ? _a : '').length; }, 0);
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 2:
                _b = _a +
                    (_c.sent()).reduce(function (sum, one) { var _a; return sum + String((_a = one.text) !== null && _a !== void 0 ? _a : '').length; }, 0);
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 3: return [2 /*return*/, _b +
                    (_c.sent()).reduce(function (sum, one) { var _a; return sum + String((_a = one.props.label) !== null && _a !== void 0 ? _a : '').length; }, 0)];
        }
    });
}); };
test("in a chat the app runs on another Mac over ssh, a large screenshot opened large fits in one drawing the app accepts: smaller or narrower until it does, drawn whole", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var png, talk, wide, cut, sips, bytes, _a, files, logged, pane, tab, svgs, widths, width, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                png = '/tmp/work/shot.png';
                talk = [
                    { role: 'user', text: 'Shoot.', toolUses: [] },
                    { role: 'assistant', text: 'Shot.', toolUses: [{ tool_use_id: 'u1', tool: 'SendUserFile', input: { files: [png], status: 'normal' } }] },
                ];
                wide = 2300;
                cut = { rows: 0, quality: 70 };
                sips = function (argv) {
                    var line = argv.join(' ');
                    if (line.includes('hasAlpha'))
                        return 'pixelWidth: 2300\npixelHeight: 2300\nhasAlpha: no';
                    if (line.startsWith('sips --resampleWidth '))
                        wide = Number(argv[2]);
                    if (line.startsWith('sips -c '))
                        cut = { rows: Number(argv[2]), quality: Number(argv[argv.indexOf('formatOptions') + 1]) };
                    if (line.startsWith('sips -g pixelHeight') && line.includes('-band.'))
                        return "pixelHeight: ".concat(cut.rows);
                    if (line.startsWith('sips -g pixelHeight'))
                        return "pixelHeight: ".concat(wide);
                    return line.startsWith('sips -g') ? undefined : '';
                };
                bytes = function (path) { return (path.includes('-band.') ? 'A'.repeat(Math.round(wide * cut.rows * (cut.quality >= 70 ? 0.156 : 0.12))) : undefined); };
                _a = world(on, { talk: talk, env: { CLAUDE_SSH_DAEMON_CHILD: '1' }, sips: sips, bytes: bytes }), files = _a.files, logged = _a.logged;
                files.set(png, 'png');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'shoot', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Shoot.' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _d.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                tab = _d.sent();
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')
                    // The copy is made out of the drawing, which is drawn again once it is ready
                ];
            case 7:
                _d.sent();
                // The copy is made out of the drawing, which is drawn again once it is ready
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
                            case 1: return [2 /*return*/, (_a.sent()).length || undefined];
                        }
                    }); }); })];
            case 8:
                // The copy is made out of the drawing, which is drawn again once it is ready
                _d.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 9:
                svgs = _d.sent();
                expect(svgs.length).toBeGreaterThan(0);
                widths = new Set(svgs.map(function (one) { var _a; return Number((_a = /width="(\d+)"/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]); }));
                expect(widths.size).toBe(1);
                width = (_c = __spreadArray([], widths, true)[0]) !== null && _c !== void 0 ? _c : 0;
                expect(svgs.reduce(function (sum, one) { var _a, _b; return sum + Number((_b = (_a = /height="(\d+)"/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0); }, 0)).toBe(width);
                // 2000 wide would be about 620000 characters, which the app throws away whole; this is the widest that fits
                expect(width).toBe(1000);
                _b = expect;
                return [4 /*yield*/, drawnChars(tab)];
            case 10:
                _b.apply(void 0, [_d.sent()]).toBeLessThan(APP_DRAWING_CHARS);
                return [4 /*yield*/, tab.unmount()];
            case 11:
                _d.sent();
                return [4 /*yield*/, pane.unmount()];
            case 12:
                _d.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("a Details tab's small pictures together stay under what the app draws in one tab; one past that is a row that opens it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var shots, talk, sips, bytes, _a, files, logged, _i, shots_1, path, pane, tab, small, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                shots = [1, 2, 3, 4, 5, 6].map(function (n) { return "/tmp/work/shot-".concat(n, ".png"); });
                talk = __spreadArray([
                    { role: 'user', text: 'Shoot.', toolUses: [] }
                ], shots.map(function (path, n) { return ({ role: 'assistant', text: "Shot ".concat(n + 1, "."), toolUses: [{ tool_use_id: "u".concat(n), tool: 'SendUserFile', input: { files: [path], status: 'normal' } }] }); }), true);
                sips = function (argv) { return (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 360\npixelHeight: 240' : ''); };
                bytes = function (path) { return (path.includes('/thumbs/') ? 'A'.repeat(48000) : undefined); };
                _a = world(on, { talk: talk, sips: sips, bytes: bytes }), files = _a.files, logged = _a.logged;
                for (_i = 0, shots_1 = shots; _i < shots_1.length; _i++) {
                    path = shots_1[_i];
                    files.set(path, 'png');
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'shoot', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Shoot.' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _d.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 6:
                tab = _d.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
            case 7:
                small = (_d.sent()).filter(function (one) { return String(one.props.alt).startsWith('Picture:'); });
                // Three fit; the other three are rows that open them
                expect(small.length).toBe(3);
                _b = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 8:
                _b.apply(void 0, [(_d.sent()).filter(function (one) { return String(one.props.label).startsWith('⤢'); }).length]).toBe(6);
                _c = expect;
                return [4 /*yield*/, drawnChars(tab)];
            case 9:
                _c.apply(void 0, [_d.sent()]).toBeLessThan(APP_DRAWING_CHARS);
                return [4 /*yield*/, tab.unmount()];
            case 10:
                _d.sent();
                return [4 /*yield*/, pane.unmount()];
            case 11:
                _d.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("an ask's pictures are drawn small on its card, in the list and in Details, each with a row that opens it large; together they stay under what the app draws in one drawing; the terminal has the rows alone", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var shots, sips, bytes, talk, _a, files, logged, shown, _i, shots_2, path, list, small, rows, _b, _c, _d, tab, drawnIn, _e, _f, term, _g, _h, _j;
    var _k;
    var _this = this;
    var _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                shots = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(function (n) { return "/w/designs/".concat(n, ".png"); });
                sips = function (argv) { return (argv.join(' ').startsWith('sips -g') ? 'pixelWidth: 600\npixelHeight: 375' : ''); };
                bytes = function (path) { return (path.includes('/thumbs/ask-') ? 'A'.repeat(33400) : path.includes('/thumbs/') ? 'A'.repeat(48000) : undefined); };
                talk = [
                    { role: 'user', text: 'Draw the designs.', toolUses: [] },
                    { role: 'assistant', text: 'Here they are.', toolUses: [{ tool_use_id: 'u1', tool: 'SendUserFile', input: { files: shots, status: 'normal' } }] },
                ];
                _a = world(on, { sips: sips, bytes: bytes, talk: talk }), files = _a.files, logged = _a.logged, shown = _a.shown;
                for (_i = 0, shots_2 = shots; _i < shots_2.length; _i++) {
                    path = shots_2[_i];
                    files.set(path, 'png');
                }
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'pick a design', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Pick a design', prompt: 'Draw the designs.' }))];
            case 3:
                _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Pick one of the designs', details: 'Each picture is one design.', choices: ['A', 'B'], pictures: shots })];
            case 4:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Made out of the drawing, which is drawn again once they are
                ];
            case 5:
                list = _o.sent();
                // Made out of the drawing, which is drawn again once they are
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Svg' })];
                            case 1: return [2 /*return*/, (_a.sent()).some(function (one) { return String(one.props.alt).startsWith('Picture:'); }) || undefined];
                        }
                    }); }); })];
            case 6:
                // Made out of the drawing, which is drawn again once they are
                _o.sent();
                return [4 /*yield*/, list.findAll({ type: 'Svg' })];
            case 7:
                small = (_o.sent()).filter(function (one) { return String(one.props.alt).startsWith('Picture:'); });
                // Four fit in what every ask's pictures may take; the rest are rows that open them
                expect(small.map(function (one) { return String(one.props.alt); })).toEqual(['Picture: a.png', 'Picture: b.png', 'Picture: c.png', 'Picture: d.png']);
                // Each drawn at most 300 across, from a copy twice as wide
                expect(small.map(function (one) { return [one.props.width, one.props.height]; })).toEqual(Array(4).fill([300, 188]));
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                rows = (_o.sent()).map(function (one) { return String(one.props.label); }).filter(function (label) { return label.startsWith('⤢'); });
                expect(rows).toEqual(['⤢ Open large: a.png', '⤢ Open large: b.png', '⤢ Open large: c.png', '⤢ Open large: d.png', '⤢ Open: e.png', '⤢ Open: f.png', '⤢ Open: g.png']);
                _b = expect;
                return [4 /*yield*/, drawnChars(list)];
            case 9:
                _b.apply(void 0, [_o.sent()]).toBeLessThan(APP_DRAWING_CHARS);
                // Pressed, one opens whole in the Mac's own viewer
                shown.length = 0;
                _d = (_c = list).press;
                _k = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 10: return [4 /*yield*/, _d.apply(_c, [(_k.key = (_m = (_l = (_o.sent()).find(function (one) { return one.props.label === '⤢ Open large: b.png'; })) === null || _l === void 0 ? void 0 : _l.key) !== null && _m !== void 0 ? _m : '', _k)])];
            case 11:
                _o.sent();
                expect(shown).toEqual([['open', '/w/designs/b.png']]);
                // In Details too, under what it is about
                return [4 /*yield*/, pressed(list, 'open-a1')];
            case 12:
                // In Details too, under what it is about
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 13:
                tab = _o.sent();
                drawnIn = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return String(one.props.alt); }).filter(function (alt) { return alt.startsWith('Picture:'); })
                            // Once the chat's own small copies are read: its newest three fill what the tab keeps for pictures, and of the ask's the first
                            // alone still fits; the rest are rows that open them
                        ];
                    }
                }); }); };
                // Once the chat's own small copies are read: its newest three fill what the tab keeps for pictures, and of the ask's the first
                // alone still fits; the rest are rows that open them
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, drawnIn()];
                            case 1: return [2 /*return*/, (_a.sent()).includes('Picture: g.png') || undefined];
                        }
                    }); }); })];
            case 14:
                // Once the chat's own small copies are read: its newest three fill what the tab keeps for pictures, and of the ask's the first
                // alone still fits; the rest are rows that open them
                _o.sent();
                _e = expect;
                return [4 /*yield*/, drawnIn()];
            case 15:
                _e.apply(void 0, [(_o.sent()).sort()]).toEqual(['Picture: a.png', 'Picture: e.png', 'Picture: f.png', 'Picture: g.png']);
                _f = expect;
                return [4 /*yield*/, drawnChars(tab)];
            case 16:
                _f.apply(void 0, [_o.sent()]).toBeLessThan(APP_DRAWING_CHARS);
                return [4 /*yield*/, tab.unmount()];
            case 17:
                _o.sent();
                return [4 /*yield*/, list.unmount()
                    // The terminal draws no pictures: a row each that opens it
                ];
            case 18:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 19:
                term = _o.sent();
                _g = expect;
                return [4 /*yield*/, term.findAll({ type: 'Svg' })];
            case 20:
                _g.apply(void 0, [(_o.sent()).filter(function (one) { return String(one.props.alt).startsWith('Picture:'); })]).toEqual([]);
                _h = expect;
                return [4 /*yield*/, term.findAll({ type: 'Button' })];
            case 21:
                _h.apply(void 0, [(_o.sent()).map(function (one) { return String(one.props.label); }).filter(function (label) { return label.startsWith('⤢'); }).length]).toBe(7);
                _j = expect;
                return [4 /*yield*/, term.find({ type: 'Text', text: /Making its pictures small/ })];
            case 22:
                _j.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, term.unmount()
                    // Only the ask's notice in the chat is logged: nothing failed
                ];
            case 23:
                _o.sent();
                // Only the ask's notice in the chat is logged: nothing failed
                expect(logged.filter(function (line) { return !line.startsWith('"Pick a design" has a question for you'); })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("what a task made is on its card under its title, side by side, and as tiles under the title in its Details: a file opens on a press, three of a kind are one stack that opens out, its code is a count of files and lines, and no folder or path is shown", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, shown, logged, NEW, pdf, shots, _i, _b, path, pane, chips, icons, _c, _d, tab, bold, tiles, _e, _f, _g, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on, {}), files = _a.files, shown = _a.shown, logged = _a.logged;
                NEW = '9999999999999';
                pdf = '/Users/me/out/vat-report.pdf';
                shots = ['/Users/me/out/a.png', '/Users/me/out/b.png', '/Users/me/out/c.png'];
                for (_i = 0, _b = __spreadArray(__spreadArray([pdf], shots, true), ['/repo/src/app.ts', '/tmp/work/scratch.png'], false); _i < _b.length; _i++) {
                    path = _b[_i];
                    (files.set(path, 'x'), files.set("mtime:".concat(path), NEW));
                }
                // One that was there before the task began is not of its making
                files.set('/Users/me/out/old.pdf', 'x');
                files.set('git:top', '/repo');
                files.set('git:numstat', '12\t3\tsrc/app.ts\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'make the report', wait: false, origin: composer })];
            case 2:
                _k.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Make the report.' }))];
            case 3:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Write', tool_use_id: 'w1', agentId: 'a1', file_path: '/repo/src/app.ts', content: 'x' })];
            case 4:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Write', tool_use_id: 'w2', agentId: 'a1', file_path: '/tmp/work/scratch.png', content: 'x' })];
            case 5:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'a1', command: "render ".concat(__spreadArray(__spreadArray([pdf], shots, true), ['/Users/me/out/old.pdf'], false).join(' ')), description: 'Run the render of the report' })];
            case 6:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))
                    // While it still works: its files right under its title, each an icon and a word or two
                ];
            case 7:
                pane = _k.sent();
                // While it still works: its files right under its title, each an icon and a word or two
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, keyed(pane, 'made-a1-pdf-0-open')];
                            case 1: return [2 /*return*/, (_a.sent()) || undefined];
                        }
                    }); }); })];
            case 8:
                // While it still works: its files right under its title, each an icon and a word or two
                _k.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 9:
                chips = (_k.sent()).filter(function (one) { return String(one.key).startsWith('made-a1-'); }).map(function (one) { return String(one.props.label); });
                expect(chips).toEqual(['3 pictures', 'vat-report']);
                return [4 /*yield*/, pane.findAll({ type: 'Svg' })];
            case 10:
                icons = (_k.sent()).filter(function (svg) { return svg.props.width === 18; });
                expect(icons.map(function (svg) { return String(svg.props.alt).trim(); })).toEqual(['Picture', 'PDF', 'Code']);
                _c = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 11:
                _c.apply(void 0, [(_k.sent()).map(function (one) { return one.text; }).filter(function (text) { return /code file|^[+−]\d/.test(String(text)); })]).toEqual(['1 code file', '+12', '−3']);
                _d = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 12:
                _d.apply(void 0, [(_k.sent()).some(function (one) { return /\/Users\/me|\/repo\/src|scratch|old/.test(String(one.text)); })]).toBe(false);
                // A file opens on a press, as the system opens it
                return [4 /*yield*/, pressed(pane, 'made-a1-pdf-0-open')];
            case 13:
                // A file opens on a press, as the system opens it
                _k.sent();
                expect(shown).toEqual([['open', pdf]]);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 14:
                tab = _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, keyed(tab, 'files-a1-pile-picture-open')];
                            case 1: return [2 /*return*/, (_a.sent()) || undefined];
                        }
                    }); }); })];
            case 15:
                _k.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 16:
                bold = (_k.sent()).filter(function (text) { return text.props.bold; }).map(function (text) { return text.text; });
                expect(bold[1]).toBe('Files');
                tiles = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tab.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (svg) { return svg.props.width === 96; }).map(function (svg) { return String(svg.props.alt); })];
                    }
                }); }); };
                _e = expect;
                return [4 /*yield*/, tiles()];
            case 17:
                _e.apply(void 0, [_k.sent()]).toEqual(['3 pictures', 'vat-report', '1 code file']);
                // A stack opens out into a tile for each of its files, and folds again
                return [4 /*yield*/, pressed(tab, 'files-a1-pile-picture-open')];
            case 18:
                // A stack opens out into a tile for each of its files, and folds again
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tiles()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('a') ? true : undefined)];
                        }
                    }); }); })];
            case 19:
                _k.sent();
                _f = expect;
                return [4 /*yield*/, tiles()];
            case 20:
                _f.apply(void 0, [_k.sent()]).toEqual(['a', 'b', 'c', 'vat-report', '1 code file']);
                return [4 /*yield*/, pressed(tab, 'files-a1-fewer')];
            case 21:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tiles()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('3 pictures') ? true : undefined)];
                        }
                    }); }); })];
            case 22:
                _k.sent();
                _g = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 23:
                _g.apply(void 0, [(_k.sent()).some(function (one) { return /\/Users\/me|\/repo\/src/.test(String(one.text)); })]).toBe(false);
                return [4 /*yield*/, tab.unmount()
                    // Done: what its result names joins in, but a code file it names stays in the count, and only a link it says it made is a thing
                ];
            case 24:
                _k.sent();
                // Done: what its result names joins in, but a code file it names stays in the count, and only a link it says it made is a thing
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'hb', agentId: 'a1', message: "The report is made: ".concat(pdf, ". The fix is in /repo/src/app.ts.\n\nReport added: https://os.example.com/reports/9\nSee the guide at https://docs.example.com/guide") })];
            case 25:
                // Done: what its result names joins in, but a code file it names stays in the count, and only a link it says it made is a thing
                _k.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 't2', reason: 'answer', agentId: 'a1' })];
            case 26:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, keyed(pane, 'made-a1-link-0-open')];
                            case 1: return [2 /*return*/, (_a.sent()) || undefined];
                        }
                    }); }); })];
            case 27:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Button' })];
            case 28:
                _h.apply(void 0, [(_k.sent()).filter(function (one) { return String(one.key).startsWith('made-a1-'); }).map(function (one) { return String(one.props.label); })]).toEqual(['3 pictures', 'vat-report', 'os report 9 ↗']);
                _j = expect;
                return [4 /*yield*/, pane.findAll({ type: 'Text' })];
            case 29:
                _j.apply(void 0, [(_k.sent()).map(function (one) { return one.text; }).filter(function (text) { return /code file/.test(String(text)); })]).toEqual(['1 code file']);
                return [4 /*yield*/, pane.unmount()];
            case 30:
                _k.sent();
                expect(logged).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
