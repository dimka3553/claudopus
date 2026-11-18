// The welcome for a new person
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
test('a new person gets a welcome once: it opens the panel, names /claudopus, and its button starts indexing their old chats', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, files, submitted, _i, _b, surface, pane_1, _c, _d, _e, pane, _f, asked, _g;
    var _this = this;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on, { isNew: true }), opened = _a.opened, files = _a.files, submitted = _a.submitted;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                expect(opened[0]).toBe('claudopus');
                _i = 0, _b = ['terminal', 'desktop'];
                _k.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                surface = _b[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
            case 3:
                pane_1 = _k.sent();
                _c = expect;
                return [4 /*yield*/, pane_1.find({ type: 'Text', text: 'Welcome to Claudopus' })];
            case 4:
                _c.apply(void 0, [(_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.props.bold]).toBe(true);
                _d = expect;
                return [4 /*yield*/, pane_1.find({ type: 'Text', text: /Type \/claudopus to bring it back/ })];
            case 5:
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, pane_1.findAll({ type: 'Button' })];
            case 6:
                _e.apply(void 0, [(_k.sent()).some(function (b) { return b.props.label === 'Bring in old chats'; })]).toBe(true);
                return [4 /*yield*/, pane_1.unmount()];
            case 7:
                _k.sent();
                _k.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9: 
            // A reload of the same session keeps it
            return [4 /*yield*/, $.session.start(start)];
            case 10:
                // A reload of the same session keeps it
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 11:
                pane = _k.sent();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Welcome to Claudopus' })];
            case 12:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(pane, 'welcome-index')];
            case 13:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.find(function (text) { return text.startsWith('Bring in my old chats'); })];
                    }); }); })];
            case 14:
                asked = _k.sent();
                expect(asked).toContain('/onboard/extract.py" "/home/sam/.claude/claudopus/onboard"');
                expect(asked).toContain('/onboard/reader.md');
                expect(asked).toContain('`update` tool');
                expect(JSON.parse((_j = files.get("".concat(MEMORY, "/welcome.json"))) !== null && _j !== void 0 ? _j : '{}').isOpen).toBe(false);
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: 'Welcome to Claudopus' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 15:
                _g.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, pane.unmount()];
            case 16:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('the welcome is put away by Not now, and by the next session even unpressed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, submitted, pane, _b, later, _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on, { isNew: true }), files = _a.files, submitted = _a.submitted;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                return [4 /*yield*/, pressed(pane, 'welcome-later')];
            case 3:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pane.find({ type: 'Text', text: 'Welcome to Claudopus' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBe(true);
                expect(submitted).toEqual([]);
                return [4 /*yield*/, pane.unmount()
                    // Shown in an earlier session and never pressed: a later session does not show it
                ];
            case 5:
                _e.sent();
                // Shown in an earlier session and never pressed: a later session does not show it
                files.set("".concat(MEMORY, "/welcome.json"), JSON.stringify({ shownIn: 'an-earlier-session', isOpen: true }));
                return [4 /*yield*/, $.session.start(start)];
            case 6:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                later = _e.sent();
                _c = expect;
                return [4 /*yield*/, later.find({ type: 'Text', text: 'Welcome to Claudopus' })];
            case 8:
                _c.apply(void 0, [_e.sent()]).toBeUndefined();
                expect(JSON.parse((_d = files.get("".concat(MEMORY, "/welcome.json"))) !== null && _d !== void 0 ? _d : '{}').isOpen).toBe(false);
                return [4 /*yield*/, later.unmount()];
            case 9:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test('someone already set up never sees the welcome, and the panel does not open by itself', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, opened, files, pane, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on), opened = _a.opened, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                expect(opened).toEqual([]);
                expect(files.has("".concat(MEMORY, "/welcome.json"))).toBe(false);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _c.sent();
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Welcome to Claudopus' })];
            case 3:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 4:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
