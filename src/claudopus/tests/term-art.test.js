// The terminal's octopus and marks of work under way: cells (a Raster), repainted in place as they move; and its pictures, which
// are rows that open where the person is
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
// Two drawings in the octopus's own form, squares of one pixel in groups that show and hide in turn: one still, one of two pictures
var STILL_ART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/><rect x="0" y="2" width="4" height="2"/></g></svg>';
var MOVING_ART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><g fill="#8A63F0"><rect x="1" y="0" width="2" height="2"/>' +
    '<g visibility="visible"><animate attributeName="visibility" values="visible;hidden" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="0" y="2" width="1" height="2"/></g>' +
    '<g visibility="hidden"><animate attributeName="visibility" values="hidden;visible" dur="0.6s" calcMode="discrete" repeatCount="indefinite"/><rect x="3" y="2" width="1" height="2"/></g></g></svg>';
test('in the terminal the octopus and the marks of work are cells that move in place, and the app still draws its Svg', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, blits, pane, head, dots, headCells, band, tiny, app, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                clock = world(on, { drawings: function (name) { return (!name ? undefined : name.startsWith('working') ? MOVING_ART : STILL_ART); } }).clock;
                blits = [];
                on('ui.blit', function (_, e) { return (blits.push(e), { value: {} }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose.' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))
                    // The header's octopus at work: three rows tall beside the header's three lines, four pixels to a cell
                ];
            case 4:
                pane = _c.sent();
                return [4 /*yield*/, pane.findAll({ type: 'Raster' })];
            case 5:
                head = (_c.sent()).find(function (one) { return String(one.key).startsWith('head-mark-working-'); });
                expect(head === null || head === void 0 ? void 0 : head.props.columns).toBe(7);
                expect(head === null || head === void 0 ? void 0 : head.props.rows).toBe(3);
                return [4 /*yield*/, pane.findAll({ type: 'Raster' })];
            case 6:
                dots = (_c.sent()).find(function (one) { return String(one.key) === 'live-a1'; });
                expect(dots === null || dots === void 0 ? void 0 : dots.props.columns).toBe(3);
                // Both are repainted in place as they move, each picture once, nothing drawn again
                return [4 /*yield*/, clock.advance(700)];
            case 7:
                // Both are repainted in place as they move, each picture once, nothing drawn again
                _c.sent();
                headCells = blits.filter(function (one) { return one.requestId === 'claudopus' && one.key === (head === null || head === void 0 ? void 0 : head.key); }).map(function (one) { return one.cells; });
                expect(headCells.length).toBeGreaterThan(0);
                expect(headCells.some(function (cells) { return cells !== (head === null || head === void 0 ? void 0 : head.props.cells); })).toBe(true);
                expect(blits.some(function (one) { return one.key === 'live-a1' && one.cells !== (dots === null || dots === void 0 ? void 0 : dots.props.cells); })).toBe(true);
                return [4 /*yield*/, pane.unmount()
                    // Above the prompt: the tiny octopus, one line of three cells
                ];
            case 8:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 9:
                band = _c.sent();
                return [4 /*yield*/, band.findAll({ type: 'Raster' })];
            case 10:
                tiny = (_c.sent()).find(function (one) { return String(one.key).startsWith('band-mark-workingSmall-'); });
                expect([tiny === null || tiny === void 0 ? void 0 : tiny.props.columns, tiny === null || tiny === void 0 ? void 0 : tiny.props.rows]).toEqual([3, 1]);
                return [4 /*yield*/, band.unmount()
                    // The app's drawing is as it was: its Svg, and no cells
                ];
            case 11:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 12:
                app = _c.sent();
                _a = expect;
                return [4 /*yield*/, app.findAll({ type: 'Svg' })];
            case 13:
                _a.apply(void 0, [(_c.sent()).some(function (one) { return one.props.alt === 'Claudopus, working'; })]).toBe(true);
                _b = expect;
                return [4 /*yield*/, app.findAll({ type: 'Raster' })];
            case 14:
                _b.apply(void 0, [_c.sent()]).toEqual([]);
                return [4 /*yield*/, app.unmount()];
            case 15:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
// A piece of work that drew one picture, its Details open in a terminal
var pictured = function ($, on, options) { return __awaiter(_this, void 0, void 0, function () {
    var svg, talk, made, pane, tab;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                svg = '/tmp/work/chart.svg';
                talk = [
                    { role: 'user', text: 'Draw the chart.', toolUses: [] },
                    { role: 'assistant', text: 'Drawing it.', toolUses: [{ tool_use_id: 'u1', tool: 'Write', input: { file_path: svg, content: '<svg/>' } }] },
                ];
                made = world(on, __assign({ talk: talk }, options));
                made.files.set(svg, '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'draw the chart', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Draw the chart.' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 4:
                pane = _a.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _a.sent();
                return [4 /*yield*/, pane.unmount()];
            case 6:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'terminal' }))];
            case 7:
                tab = _a.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(tab, 'pic-open-1-0')];
                    }); }); })];
            case 8:
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, made), { tab: tab, svg: svg })];
        }
    });
}); };
test('in the terminal a picture is not drawn: its row, pressed, opens it in the viewer of the Mac the person is at', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, tab, shown, svg, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, pictured($, on, {})];
            case 1:
                _a = _c.sent(), tab = _a.tab, shown = _a.shown, svg = _a.svg;
                _b = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Raster' }).then(function (all) { return all.filter(function (one) { return String(one.key).startsWith('pic-'); }); })];
            case 2:
                _b.apply(void 0, [_c.sent()]).toEqual([]);
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 3:
                _c.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (shown.some(function (argv) { return argv.includes(svg); }) ? true : undefined)];
                    }); }); })];
            case 4:
                _c.sent();
                return [4 /*yield*/, tab.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in a terminal reached over ssh a picture pressed is sent to the device it is watched from, by Tailscale where both have it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, tab, shown, dropped, svg;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pictured($, on, { env: { SSH_CONNECTION: '100.72.19.2 65204 100.97.255.107 22', USER: 'sam' }, tailscale: '100.72.19.2\tsams-laptop\n100.86.184.91\tphone\toffline; last seen 4h ago\n' })];
            case 1:
                _a = _b.sent(), tab = _a.tab, shown = _a.shown, dropped = _a.dropped, svg = _a.svg;
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 2:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tab.find({ type: 'Text', text: /Sent to sams-laptop by Tailscale/ })];
                    }); }); })];
            case 3:
                _b.sent();
                expect(dropped.map(function (argv) { return argv.slice(1); })).toEqual([['file', 'cp', svg, '100.72.19.2:']]);
                // Nothing opens on this Mac, where nobody looks
                expect(shown.some(function (argv) { return argv.includes(svg); })).toBe(false);
                return [4 /*yield*/, tab.unmount()];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
test('over ssh without Tailscale the row gives the one command that fetches the picture and opens it on the device', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, tab, shown, svg, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, pictured($, on, { env: { SSH_CONNECTION: '192.168.1.20 65204 192.168.1.7 22', USER: 'sam' } })];
            case 1:
                _a = _c.sent(), tab = _a.tab, shown = _a.shown, svg = _a.svg;
                return [4 /*yield*/, pressed(tab, 'pic-open-1-0')];
            case 2:
                _c.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tab.find({ type: 'Text', text: "scp 'sam@192.168.1.7:/tmp/work/chart.svg' ~/Downloads/ && open ~/Downloads/'chart.svg'" })];
                    }); }); })];
            case 3:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 4:
                _b.apply(void 0, [(_c.sent()).some(function (one) { return one.props.label === 'Copy the command'; })]).toBe(true);
                expect(shown.some(function (argv) { return argv.includes(svg); })).toBe(false);
                return [4 /*yield*/, tab.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
