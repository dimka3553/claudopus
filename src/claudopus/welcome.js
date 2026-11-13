// First run: the welcome at the top of the panel, and indexing old chats
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
var isWelcomeOpen = false;
// Decided at a session's start: a new person (no index.md yet) gets the welcome, which stays through reloads of that session
// and is put away when the next session starts or a button on it is pressed; anyone already set up never sees it
var welcomeAt = function (isNew, stored, sessionId) {
    if (isNew)
        return { shownIn: sessionId, isOpen: true };
    if (!(stored === null || stored === void 0 ? void 0 : stored.isOpen))
        return stored;
    return stored.shownIn === sessionId ? stored : __assign(__assign({}, stored), { isOpen: false });
};
var readWelcome = function ($) {
    return readOr($, "".concat(dir, "/welcome.json"))
        .then(function (text) { return (text ? JSON.parse(text) : undefined); })
        .catch(function () { return undefined; });
};
var settleWelcome = function ($, isNew, sessionId) { return __awaiter(_this, void 0, void 0, function () {
    var stored, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readWelcome($)];
            case 1:
                stored = _a.sent();
                next = welcomeAt(isNew, stored, sessionId);
                if (!(next && JSON.stringify(next) !== JSON.stringify(stored))) return [3 /*break*/, 3];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/welcome.json"), "".concat(JSON.stringify(next), "\n"))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                isWelcomeOpen = Boolean(next === null || next === void 0 ? void 0 : next.isOpen);
                return [2 /*return*/];
        }
    });
}); };
var closeWelcome = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var stored;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                isWelcomeOpen = false;
                presses += 1;
                return [4 /*yield*/, readWelcome($)];
            case 1:
                stored = _b.sent();
                return [4 /*yield*/, $.fs.write("".concat(dir, "/welcome.json"), "".concat(JSON.stringify({ shownIn: (_a = stored === null || stored === void 0 ? void 0 : stored.shownIn) !== null && _a !== void 0 ? _a : '', isOpen: false }), "\n"))];
            case 2:
                _b.sent();
                return [4 /*yield*/, redraw($)];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// What the chat is sent when the person presses Index my old chats: the two onboarding steps the mod ships, then the subjects recorded
var indexAsk = function (root) {
    return [
        'Index my old chats (pressed in the Claudopus panel).',
        "Run python3 \"".concat(root, "/onboard/extract.py\" \"").concat(dir, "/onboard\": it saves each past chat's messages under ").concat(dir, "/words and writes digests of them, one or more per project, into ").concat(dir, "/onboard."),
        'If python3 is missing (macOS asks to install the Command Line Tools), say so with the command xcode-select --install and stop.',
        "Then for each digest file it wrote, have a helper follow ".concat(root, "/onboard/reader.md on it, writing its streams to ").concat(dir, "/onboard/streams/<the digest's file name>."),
        'Last, record each stream found as a subject with the `update` tool (its name, folder, state and summary, and its section as the brief), and report the subjects found in a few lines.',
    ].join(' ');
};
var indexOldChats = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, closeWelcome($)];
            case 1:
                _a.sent();
                return [4 /*yield*/, sendForPerson($, indexAsk($.plugin.root))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var welcomeCard = function ($, ui) { return (<ui.Box key="welcome" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Text bold wrap="wrap">Welcome to Claudopus</ui.Text>
    <ui.Text wrap="wrap">Each message you send in a chat goes to background work, and its card shows here while it runs.</ui.Text>
    <ui.Text wrap="wrap">Closed this panel? Type /claudopus to bring it back.</ui.Text>
    <ui.Text bold wrap="wrap">Bring in your old chats</ui.Text>
    <ui.Text wrap="wrap">Claudopus can read your past Claude Code chats on this Mac into its memory, so it knows what you were working on. It runs as background work and takes a few minutes.</ui.Text>
    <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
      <ui.Button key={"welcome-index-".concat(presses)} label="Index my old chats" onPress={function () { return void indexOldChats($).catch(function (err) { return log($, "old chats not indexed: ".concat(String(err))); }); }}/>
      <ui.Button key={"welcome-later-".concat(presses)} label="Not now" plain dimColor onPress={function () { return void closeWelcome($).catch(function (err) { return log($, "welcome not put away: ".concat(String(err))); }); }}/>
    </ui.Box>
  </ui.Box>); };
