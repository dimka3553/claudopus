// The terminal's look: no grey bars from the app's see-through tint, a key for each button and a line that says how to reach them,
// Memory as a tab, and the Stats timeline drawn in cells
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
test('in the terminal no Box carries the faint tint the app draws, and the app keeps it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var tinted, seeThrough, terminal, termBoxes, desktop, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose.' }))];
            case 3:
                _c.sent();
                tinted = function (boxes) { return boxes.filter(function (one) { return one.props.backgroundColor === '#80808024'; }); };
                seeThrough = function (color) { return typeof color === 'string' && /^#[0-9a-f]{6}(?!ff)[0-9a-f]{2}$/i.test(color); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 4:
                terminal = _c.sent();
                return [4 /*yield*/, terminal.findAll({ type: 'Box' })];
            case 5:
                termBoxes = _c.sent();
                expect(tinted(termBoxes)).toEqual([]);
                // Nor any other colour a terminal cannot see through
                expect(termBoxes.filter(function (one) { return seeThrough(one.props.backgroundColor); })).toEqual([]);
                return [4 /*yield*/, terminal.unmount()];
            case 6:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                desktop = _c.sent();
                _a = expect;
                _b = tinted;
                return [4 /*yield*/, desktop.findAll({ type: 'Box' })];
            case 8:
                _a.apply(void 0, [_b.apply(void 0, [(_c.sent())]).length]).toBeGreaterThan(0);
                return [4 /*yield*/, desktop.unmount()];
            case 9:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in the terminal each header button has a key, and a line says how to reach them, before and after the panel takes the keys', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var keysOf, textOf, idle, _a, _b, held, _c, app, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                keysOf = function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = Object).fromEntries;
                            return [4 /*yield*/, pane.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).filter(function (one) { return one.props.hotkey; }).map(function (one) { return [String(one.props.label).split(' ')[0], one.props.hotkey]; })])];
                    }
                }); }); };
                textOf = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return one.text; }).join('\n')];
                    }
                }); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 2:
                idle = _e.sent();
                _a = expect;
                return [4 /*yield*/, keysOf(idle)];
            case 3:
                _a.apply(void 0, [_e.sent()]).toMatchObject({ Stats: 's', Memory: 'm', Config: 'c', About: 'a' });
                _b = expect;
                return [4 /*yield*/, textOf(idle)];
            case 4:
                _b.apply(void 0, [_e.sent()]).toContain('ctrl+x then Tab');
                return [4 /*yield*/, idle.unmount()];
            case 5:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { isFocused: true }), surface: 'terminal' }))];
            case 6:
                held = _e.sent();
                _c = expect;
                return [4 /*yield*/, textOf(held)];
            case 7:
                _c.apply(void 0, [_e.sent()]).toContain('Esc: back to the chat');
                return [4 /*yield*/, held.unmount()
                    // The app has its own pointer and keys: no such line there
                ];
            case 8:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 9:
                app = _e.sent();
                _d = expect;
                return [4 /*yield*/, textOf(app)];
            case 10:
                _d.apply(void 0, [_e.sent()]).not.toContain('ctrl+x then Tab');
                return [4 /*yield*/, app.unmount()];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the Stats timeline in cells: a row a lane, each run of cells in its model, the times under it', function () {
    var _a, _b, _c;
    var h = 3600000;
    var at = Date.UTC(2026, 10, 13, 9);
    var piece = function (id, from, to, model) { return ({ id: id, title: id, isFlow: false, isFinished: true, spans: [[from, to]], bars: [{ from: from, to: to, model: model }], calls: [], ended: to }); };
    var _d = timelineRows([piece('a', at, at + 2 * h, 'claude-opus-5-5'), piece('b', at + h, at + 3 * h, 'claude-sonnet-5-5')], 30), rows = _d.rows, from = _d.from, to = _d.to;
    expect(rows.length).toBe(2);
    expect(rows.every(function (row) { return row.length === 30; })).toBe(true);
    expect((_a = rows[0]) === null || _a === void 0 ? void 0 : _a[0]).toBe('claude-opus-5-5');
    expect((_b = rows[1]) === null || _b === void 0 ? void 0 : _b[0]).toBe('');
    expect((_c = rows[1]) === null || _c === void 0 ? void 0 : _c[29]).toBe('claude-sonnet-5-5');
    expect(from).not.toBe('');
    expect(to).not.toBe('');
});
test('in the terminal an ask is above the prompt with its answers numbered, and the number answers it; the app keeps its band', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var band, _a, answers, _b, _c, _d, _e, _f, _g, _h, app, _j;
    var _k, _l;
    var _this = this;
    var _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Release it', prompt: 'release it' }))];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Release it?', choices: ['Approve', 'Refuse'] })];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 4:
                band = _p.sent();
                _a = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Release it?' })];
            case 5:
                _a.apply(void 0, [_p.sent()]).toBeDefined();
                return [4 /*yield*/, band.findAll({ type: 'Button' })];
            case 6:
                answers = (_p.sent()).map(function (one) { return [one.props.label, one.props.hotkey, one.props.plain]; });
                expect(answers).toEqual([['Approve', '1', true], ['Refuse', '2', true]]);
                _c = (_b = band).press;
                _k = {};
                _d = String;
                return [4 /*yield*/, band.findAll({ type: 'Button' })];
            case 7: 
            // A message may begin with a digit: the first press only picks the answer and says so, the same number again sends it
            return [4 /*yield*/, _c.apply(_b, [(_k.key = _d.apply(void 0, [(_m = (_p.sent())[0]) === null || _m === void 0 ? void 0 : _m.key]), _k)])];
            case 8:
                // A message may begin with a digit: the first press only picks the answer and says so, the same number again sends it
                _p.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, band.find({ type: 'Text', text: /Type 1 again to answer “Approve”/ })];
                    }); }); })];
            case 9:
                _p.sent();
                _e = expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Release it?' })];
            case 10:
                _e.apply(void 0, [_p.sent()]).toBeDefined();
                _g = (_f = band).press;
                _l = {};
                _h = String;
                return [4 /*yield*/, band.findAll({ type: 'Button' })];
            case 11: return [4 /*yield*/, _g.apply(_f, [(_l.key = _h.apply(void 0, [(_o = (_p.sent())[0]) === null || _o === void 0 ? void 0 : _o.key]), _l)])];
            case 12:
                _p.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, band.find({ type: 'Text', text: 'Release it?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 13:
                _p.sent();
                return [4 /*yield*/, band.unmount()];
            case 14:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 15:
                app = _p.sent();
                _j = expect;
                return [4 /*yield*/, app.findAll({ type: 'Button' })];
            case 16:
                _j.apply(void 0, [(_p.sent()).filter(function (one) { return one.props.hotkey; })]).toEqual([]);
                return [4 /*yield*/, app.unmount()];
            case 17:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in the terminal each card has a number that opens it, Finished has f, and every tab has Close on x', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var pane, card, tab, back, app, _a, appTab, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose.' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 4:
                pane = _d.sent();
                return [4 /*yield*/, keyed(pane, 'open-a1')];
            case 5:
                card = _d.sent();
                expect([card === null || card === void 0 ? void 0 : card.props.hotkey, card === null || card === void 0 ? void 0 : card.props.plain]).toEqual(['1', true]);
                return [4 /*yield*/, pane.unmount()
                    // A tab of the mod's in the terminal: its first row closes it on x, back to the panel
                ];
            case 6:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'terminal' }))];
            case 7:
                tab = _d.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Button' })];
            case 8:
                back = (_d.sent()).find(function (one) { return one.key === 'tab-back'; });
                expect([back === null || back === void 0 ? void 0 : back.props.label, back === null || back === void 0 ? void 0 : back.props.hotkey]).toEqual(['Close', 'x']);
                return [4 /*yield*/, tab.unmount()
                    // The app has its own pointer: no numbers, no row back
                ];
            case 9:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 10:
                app = _d.sent();
                _a = expect;
                return [4 /*yield*/, keyed(app, 'open-a1')];
            case 11:
                _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.props.hotkey]).toBeUndefined();
                return [4 /*yield*/, app.unmount()];
            case 12:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 13:
                appTab = _d.sent();
                _b = expect;
                return [4 /*yield*/, appTab.findAll({ type: 'Button' })];
            case 14:
                _b.apply(void 0, [(_d.sent()).find(function (one) { return one.key === 'tab-back'; })]).toBeUndefined();
                return [4 /*yield*/, appTab.unmount()];
            case 15:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in a narrow terminal a tab a press opens is drawn, and its Close shuts it and leaves the panel drawn', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, narrow, closed, placed, press, pane, tab, again;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true, isFocused: true }];
                narrow = { isPressing: false };
                closed = world(on, { narrow: narrow, live: live }).closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                placed = function (id) { var _a; return (_a = live.find(function (one) { return one.id === id; })) === null || _a === void 0 ? void 0 : _a.isPlaced; };
                press = function (pane, key) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                narrow.isPressing = true;
                                return [4 /*yield*/, pressed(pane, key)];
                            case 1:
                                _a.sent();
                                narrow.isPressing = false;
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { isFocused: true }), surface: 'terminal' }))];
            case 2:
                pane = _a.sent();
                return [4 /*yield*/, press(pane, 'stats-open')];
            case 3:
                _a.sent();
                expect(placed('stats')).toBe(true);
                expect(placed('claudopus')).toBe(true);
                return [4 /*yield*/, pane.unmount()
                    // Its first row says Close on x; pressed, the tab closes and the panel, opened again to take the keys, is still drawn
                ];
            case 4:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'stats', props: __assign(__assign({}, LIST.props), { isFocused: true }), surface: 'terminal' }))];
            case 5:
                tab = _a.sent();
                return [4 /*yield*/, press(tab, 'tab-back')];
            case 6:
                _a.sent();
                expect(closed).toContain('stats');
                expect(live.map(function (one) { return one.id; })).toEqual(['claudopus']);
                expect(placed('claudopus')).toBe(true);
                return [4 /*yield*/, tab.unmount()
                    // A card's Details reads the card first: it too opens before the press is answered
                ];
            case 7:
                _a.sent();
                // A card's Details reads the card first: it too opens before the press is answered
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 8:
                // A card's Details reads the card first: it too opens before the press is answered
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose.' }))];
            case 9:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { isFocused: true }), surface: 'terminal' }))];
            case 10:
                again = _a.sent();
                return [4 /*yield*/, press(again, 'open-a1')];
            case 11:
                _a.sent();
                expect(placed('work-a1')).toBe(true);
                return [4 /*yield*/, again.unmount()];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
