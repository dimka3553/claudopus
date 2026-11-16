// The servers panel
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
test('the servers panel opens when asked, lists the servers running from my folders with a link, names the chat that started each, and stops one', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, killed, opened, closed, clock, _i, _b, surface, pane_1, link, _c, _d, pane, press, _e, _f;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on, { panes: ['servers'] }), files = _a.files, killed = _a.killed, opened = _a.opened, closed = _a.closed, clock = _a.clock;
                files.set("".concat(HOME, "/.claude/sessions/500.json"), '{"pid":500,"sessionId":"s-1","name":"Photo to 3D","cwd":"/Users/sam/x"}');
                return [4 /*yield*/, $.session.start(start)
                    // The panel an earlier version opened by itself is put away
                ];
            case 1:
                _j.sent();
                // The panel an earlier version opened by itself is put away
                expect(closed).toEqual(['agents']);
                return [4 /*yield*/, $.command.run({ command: 'servers', args: '' })];
            case 2:
                _j.sent();
                expect(opened).toEqual(['servers']);
                _i = 0, _b = ['terminal', 'desktop', 'vscode', 'mobile'];
                _j.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 10];
                surface = _b[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: surface }))];
            case 4:
                pane_1 = _j.sent();
                return [4 /*yield*/, pane_1.find({ type: 'Link' })];
            case 5:
                link = _j.sent();
                expect(link === null || link === void 0 ? void 0 : link.props.href).toBe('http://localhost:3100');
                expect(link === null || link === void 0 ? void 0 : link.props.label).toBe('localhost:3100');
                _c = expect;
                return [4 /*yield*/, pane_1.find({ type: 'Text', text: /Photo to 3D/ })];
            case 6:
                _c.apply(void 0, [(_g = (_j.sent())) === null || _g === void 0 ? void 0 : _g.text]).toBe('3d-sandbox · Photo to 3D');
                // The system's own listener is not one of mine
                _d = expect;
                return [4 /*yield*/, pane_1.find({ type: 'Text', text: /7000/ })];
            case 7:
                // The system's own listener is not one of mine
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                return [4 /*yield*/, pane_1.unmount()];
            case 8:
                _j.sent();
                _j.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10:
                // Kept for when the chat's process has gone and the server has no parent left
                expect(files.get("".concat(MEMORY, "/servers.json"))).toContain('Photo to 3D');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'desktop' }))];
            case 11:
                pane = _j.sent();
                press = pane.press({ key: 'kill-700' });
                return [4 /*yield*/, clock.advance(1000)];
            case 12:
                _j.sent();
                return [4 /*yield*/, press];
            case 13:
                _j.sent();
                expect(killed).toEqual(['700']);
                _e = expect;
                return [4 /*yield*/, pane.find({ type: 'Link' })];
            case 14:
                _e.apply(void 0, [_j.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text' })];
            case 15:
                _f.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.text]).toBe('Nothing is listening from your folders.');
                return [4 /*yield*/, pane.unmount()];
            case 16:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
