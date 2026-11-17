// Memory files in the mod's tabs, and the Memory button
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
test('a memory path in a reply opens in a tab of the mod on the desktop, never the app file pane; the terminal keeps its own', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, tabs, MSG, said, plain, _b, reply, drawn, words, coded, _c, other, _d, opened, tab, text, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, tabs = _a.tabs;
                files.set("".concat(MEMORY, "/words/chat-1.md"), "# Launch video\n\nSee also ".concat(MEMORY, "/streams/launch.md.\n"));
                files.set("".concat(MEMORY, "/streams/launch.md"), '# Launch\n\nThe brief.\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                MSG = { plugin: 'claudopus', component: 'AssistantMessage', requestId: 'm1' };
                said = "Its account is in `".concat(MEMORY, "/words/chat-1.md`, and [the brief](").concat(MEMORY, "/streams/launch.md); the repo is /repo/x.md. **").concat(MEMORY, "/index.md** at ").concat(MEMORY, "/log.md:12, run `cat ").concat(MEMORY, "/log.md`.\n\n```\ncat ").concat(MEMORY, "/log.md\n```");
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, MSG), { props: { text: said, isFirstOfReply: true }, surface: 'terminal' }))];
            case 2:
                plain = _f.sent();
                _b = expect;
                return [4 /*yield*/, plain.find({ type: 'Text', text: "the engine's own" })];
            case 3:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, MSG), { props: { text: said, isFirstOfReply: true }, surface: 'desktop' }))];
            case 4:
                reply = _f.sent();
                return [4 /*yield*/, reply.find({ type: 'Markdown' })];
            case 5:
                drawn = _f.sent();
                words = "file://".concat(MEMORY, "/words/chat-1.md");
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("[`".concat(MEMORY, "/words/chat-1.md`](").concat(words, ")"));
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("[the brief](file://".concat(MEMORY, "/streams/launch.md)"));
                // Other paths and a fenced block stay as written
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain('the repo is /repo/x.md.');
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("cat ".concat(MEMORY, "/log.md\n"));
                // Bold keeps its marks, a line number is not the file's, and code holding more than a path stays code
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("**[".concat(MEMORY, "/index.md](file://").concat(MEMORY, "/index.md)**"));
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("[".concat(MEMORY, "/log.md:12](file://").concat(MEMORY, "/log.md),"));
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.text).toContain("run `cat ".concat(MEMORY, "/log.md`."));
                expect(drawn === null || drawn === void 0 ? void 0 : drawn.props.pressableLinks).toEqual([words, "file://".concat(MEMORY, "/streams/launch.md"), "file://".concat(MEMORY, "/index.md"), "file://".concat(MEMORY, "/log.md")]);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, MSG), { requestId: 'm3', props: { text: "```\ncat ".concat(MEMORY, "/log.md\n```"), isFirstOfReply: true }, surface: 'desktop' }))];
            case 6:
                coded = _f.sent();
                _c = expect;
                return [4 /*yield*/, coded.find({ type: 'Text', text: "the engine's own" })];
            case 7:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, MSG), { requestId: 'm2', props: { text: 'See /repo/x.md', isFirstOfReply: true }, surface: 'desktop' }))];
            case 8:
                other = _f.sent();
                _d = expect;
                return [4 /*yield*/, other.find({ type: 'Text', text: "the engine's own" })];
            case 9:
                _d.apply(void 0, [_f.sent()]).toBeDefined();
                // Pressed, the file opens in a tab of its own named after its heading, and a memory link in it opens there too
                return [4 /*yield*/, reply.press({ key: String(drawn === null || drawn === void 0 ? void 0 : drawn.key), link: { href: words } })];
            case 10:
                // Pressed, the file opens in a tab of its own named after its heading, and a memory link in it opens there too
                _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab.startsWith('memory-words-chat-1-md-'); })];
                    }); }); })];
            case 11:
                opened = _f.sent();
                expect(opened).toMatch(/^memory-words-chat-1-md-\d+: Launch video$/);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: (opened !== null && opened !== void 0 ? opened : '').split(':')[0], surface: 'desktop' }))];
            case 12:
                tab = _f.sent();
                return [4 /*yield*/, tab.find({ type: 'Markdown' })];
            case 13:
                text = _f.sent();
                expect(text === null || text === void 0 ? void 0 : text.props.text).toContain('# Launch video');
                expect(text === null || text === void 0 ? void 0 : text.props.text).toContain("[".concat(MEMORY, "/streams/launch.md](file://").concat(MEMORY, "/streams/launch.md)."));
                return [4 /*yield*/, tab.press({ key: String(text === null || text === void 0 ? void 0 : text.key), link: { href: "file://".concat(MEMORY, "/streams/launch.md") } })];
            case 14:
                _f.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (one) { return /^memory-streams-launch-md-\d+: Launch$/.test(one); })];
                    }); }); })];
            case 15:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('Memory, beside Stats, opens the memory folder in Finder', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var shown, pane, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                shown = world(on).shown;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 2:
                pane = _d.sent();
                _a = expect;
                return [4 /*yield*/, keyed(pane, 'memory-open')];
            case 3:
                _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.props.label]).toBe('Memory');
                return [4 /*yield*/, pressed(pane, 'memory-open')];
            case 4:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { return argv[1] === MEMORY; })];
                    }); }); })];
            case 5:
                _b.apply(void 0, [_d.sent()]).toEqual(['open', MEMORY]);
                return [2 /*return*/];
        }
    });
}); });
