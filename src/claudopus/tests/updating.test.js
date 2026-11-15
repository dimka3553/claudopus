// F-019 and F-020 of the security review, for the hourly look: it only reads the version page and shows a newer version with Install;
// nothing is downloaded, installed or reloaded until that press, and a lock dated ahead of the clock holds none of it
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
var UPD_NOW = 1700000000000;
var reloadsOf = function (on) {
    var reloads = [];
    on('command.run', { command: 'reload-plugins' }, function () { return (reloads.push('reload-plugins'), { value: { text: 'Reloaded' } }); });
    return reloads;
};
test('F-019 · the hourly look only reads the version page: a newer version is shown with Install, and nothing is downloaded, installed or reloaded', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, fetches, _b, panel, _c, _d, _e;
    var _this = this;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                fetches = 0;
                on('http.fetch', function () { return ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: '{"version":"9.9.9"}' } }); });
                // Even with a branch online that a look would bring the folder up to
                files.set('git:online', '9.9.9');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fetches || undefined];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_g.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                panel = _g.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 9.9.9 is out' }); })];
            case 5:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, keyed(panel, 'update-install')];
            case 6:
                _d.apply(void 0, [_g.sent()]).toBeDefined();
                // Within the hour no second look, and through all of it nothing ran: no git, no update step, no reload
                return [4 /*yield*/, clock.advance(20 * 60000)];
            case 7:
                // Within the hour no second look, and through all of it nothing ran: no git, no update step, no reload
                _g.sent();
                expect(fetches).toBe(1);
                expect(gitRan).toEqual([]);
                expect(files.get('manifest')).toBeUndefined();
                expect(reloads).toEqual([]);
                expect((_f = files.get("".concat(MEMORY, "/log.md"))) !== null && _f !== void 0 ? _f : '').not.toContain('reloading it');
                // Turned off in Config, the look reads nothing more, and the card is gone
                ownSet(files, 'config.json', JSON.stringify({ updates: false }));
                return [4 /*yield*/, clock.advance(61 * 60000)];
            case 8:
                _g.sent();
                expect(fetches).toBe(1);
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, panel.find({ type: 'Text', text: 'Claudopus 9.9.9 is out' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 9:
                _e.apply(void 0, [_g.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('F-019 · Install installs through the same steps as Check for updates, then reloads this chat alone', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, gitRan, reloads, panel, _b, mark;
    var _this = this;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, gitRan = _a.gitRan;
                reloads = reloadsOf(on);
                on('http.fetch', function () { return ({ value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.2"}' } }); });
                files.set('git:online', '0.1.2');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 70 }), surface: 'desktop' }))];
            case 3:
                panel = _e.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _e.sent();
                expect(gitRan).toEqual([]);
                return [4 /*yield*/, pressed(panel, 'update-install')];
            case 5:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, reloads.length || undefined];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_e.sent()]).toBe(1);
                // The folder moved forward to it (Claude Code's own steps for an installed copy), and the next load knows what it moved from
                expect(gitRan).toContain('merge --ff-only --quiet @{u}');
                expect(JSON.parse((_c = files.get('manifest')) !== null && _c !== void 0 ? _c : '{}').version).toBe('0.1.2');
                mark = (_d = __spreadArray([], files.entries(), true).find(function (_a) {
                    var path = _a[0];
                    return path.startsWith("".concat(MEMORY, "/reloads/"));
                })) === null || _d === void 0 ? void 0 : _d[1];
                expect(JSON.parse(mark !== null && mark !== void 0 ? mark : '{}')).toMatchObject({ version: '0.1.2', from: '0.1.0' });
                return [2 /*return*/];
        }
    });
}); });
test('F-019 · a chat run from another Mac installs at the press but is not sent a reload: it says to type /reload-plugins', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, reloads, panel, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock;
                reloads = reloadsOf(on);
                on('http.fetch', function () { return ({ value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.2"}' } }); });
                files.set('git:online', '0.1.2');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 70 }), surface: 'desktop' }))];
            case 3:
                panel = _c.sent();
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'Claudopus 0.1.2 is out' }); })];
            case 4:
                _c.sent();
                return [4 /*yield*/, pressed(panel, 'update-install')];
            case 5:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return panel.find({ type: 'Text', text: 'v0.1.2 is in its folder now. Type /reload-plugins to switch this chat to it.' }); })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                expect(reloads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('F-020 · a lock on the update dated ahead of this clock holds nothing: the hourly look reads the page all the same', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, fetches, _b, panel, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                fetches = 0;
                on('http.fetch', function () { return ((fetches += 1), { value: { status: 200, ok: true, headers: {}, text: '{"version":"0.1.0"}' } }); });
                files.set("".concat(MEMORY, "/update.lock"), "".concat(UPD_NOW + 365 * 24 * 3600000, " planted"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(3 * 60000)];
            case 2:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fetches || undefined];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_d.sent()]).toBe(1);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                panel = _d.sent();
                _c = expect;
                return [4 /*yield*/, panel.find({ type: 'Text', text: /is out$/ })];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
