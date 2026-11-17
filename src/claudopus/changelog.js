// The changelog: a tab About opens with every version's changes, and the screen a newer version shows over the whole panel with
// the changes the person did not have yet (the pure parts are in hooks/changelog.ts)
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
var CHANGELOG_PANE = 'changelog';
var CHANGELOG_TITLE = 'Changelog';
var CHANGELOG_PAGE = 'https://claudopus.ai/changelog.html';
// The mod's own copy of CHANGELOG.md, read once a load: it changes only with the mod
var changelogRead;
var versionsLogged = function ($) {
    changelogRead !== null && changelogRead !== void 0 ? changelogRead : (changelogRead = readOr($, "".concat($.plugin.root, "/CHANGELOG.md")).then(changelogOf));
    return changelogRead;
};
var openChangelog = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                return [4 /*yield*/, front($, CHANGELOG_PANE, CHANGELOG_TITLE)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// One version: its number, its date, and a line for each change
var versionBand = function (ui, key, v, side) {
    return band(ui, key, "v".concat(v.version), side, <ui.Box flexDirection="column">
      {v.changes.map(function (one, i) { return (<ui.Box key={"".concat(key, "-").concat(i)} flexDirection="row" gap={1}>
          <ui.Box flexShrink={0}>
            <ui.Text dimColor>•</ui.Text>
          </ui.Box>
          <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
            <ui.Text wrap="wrap">{one}</ui.Text>
          </ui.Box>
        </ui.Box>); })}
    </ui.Box>);
};
// Older versions a tab left out, with where to read them
var olderLine = function (ui, key, left, onPress) {
    return left ? (<ui.Box key={key} flexDirection="row" flexWrap="wrap" gap={1} paddingX={2} flexShrink={0}>
      <ui.Text dimColor>{"".concat(left, " earlier ").concat(left === 1 ? 'version' : 'versions', ":")}</ui.Text>
      {onPress ? <ui.Button key={"".concat(key, "-open-").concat(presses)} label="Open the changelog" plain onPress={onPress}/> : <ui.Text><ui.Link href={CHANGELOG_PAGE} label="claudopus.ai/changelog"/></ui.Text>}
    </ui.Box>) : null;
};
// The Changelog tab: every version, newest first, the one this chat runs marked; a very long one ends where the app's limit
// would, the rest on the site
var changelogView = function ($, ui, surface) { return __awaiter(_this, void 0, void 0, function () {
    var versions, version, _a, shown, left;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, versionsLogged($)];
            case 1:
                versions = _b.sent();
                return [4 /*yield*/, versionsOf($)];
            case 2:
                version = (_b.sent()).version;
                _a = fitted(versions, TAB_BUDGET), shown = _a.shown, left = _a.left;
                return [2 /*return*/, (<ui.Box key="changelog" flexDirection="column" gap={1} flexGrow={1}>
      <ui.Box key="changelog-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, 'changelog-mark', 'mark', HEAD_MARK, 'Claudopus', $, { surface: surface })}
        <ui.Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <ui.Text bold>Changelog</ui.Text>
          <ui.Text dimColor wrap="wrap">What changed in each version, newest first.</ui.Text>
        </ui.Box>
      </ui.Box>
      {shown.length ? null : <ui.Text dimColor>This copy of Claudopus has no changelog.</ui.Text>}
      {shown.map(function (v) { return versionBand(ui, "changelog-".concat(v.version), v, [v.date, v.version === version ? 'this chat' : ''].filter(Boolean).join(' · ')); })}
      {olderLine(ui, 'changelog-older', left)}
    </ui.Box>)];
        }
    });
}); };
// ---- The update screen ----
// seen.json: the newest version whose changes the person has seen on this Mac. A chat that runs a newer one shows them over its
// whole panel until the person closes it there, which writes this version; then no chat on the Mac shows it again
var seenPath = function () { return "".concat(dir, "/seen.json"); };
var writeSeen = function ($, version) { return $.fs.write(seenPath(), JSON.stringify({ version: version })); };
// At a load: a Mac with no record yet starts it from the version it ran before, so the first update to a version with this screen
// shows it too: the version this chat just moved from, else the newest older copy Claude Code keeps installed beside this one (a
// chat started fresh on the new version); else from the version loaded, so a first install shows nothing
var noteSeen = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, loaded, root, copies, _c, start;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = !dir;
                if (_a) return [3 /*break*/, 2];
                _b = seenIn;
                return [4 /*yield*/, readOr($, seenPath())];
            case 1:
                _a = _b.apply(void 0, [_d.sent()]);
                _d.label = 2;
            case 2:
                if (_a)
                    return [2 /*return*/];
                return [4 /*yield*/, versionsOf($)];
            case 3:
                loaded = (_d.sent()).version;
                if (!loaded)
                    return [2 /*return*/];
                root = $.plugin.root.replace(/\/+$/, '');
                if (!installedFrom(root)) return [3 /*break*/, 5];
                return [4 /*yield*/, $.fs.list(root.slice(0, root.lastIndexOf('/'))).catch(function () { return []; })];
            case 4:
                _c = (_d.sent()).map(function (one) { return one.name; });
                return [3 /*break*/, 6];
            case 5:
                _c = [];
                _d.label = 6;
            case 6:
                copies = _c;
                start = ((updatedMoment === null || updatedMoment === void 0 ? void 0 : updatedMoment.to) === loaded && updatedMoment.from) || previousOf(copies, loaded) || loaded;
                return [4 /*yield*/, writeSeen($, start)
                    // A panel drawn before the record was written is drawn again, with the screen if it is due
                ];
            case 7:
                _d.sent();
                if (!(start !== loaded)) return [3 /*break*/, 9];
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
// Closing the screen, at its version or a newer one another chat closed meanwhile
var screenSounded = '';
var closeScreen = function ($, version) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                presses += 1;
                _a = isNewer;
                _b = seenIn;
                return [4 /*yield*/, readOr($, seenPath())];
            case 1:
                if (!!_a.apply(void 0, [_b.apply(void 0, [_c.sent()]), version])) return [3 /*break*/, 3];
                return [4 /*yield*/, writeSeen($, version)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                drawAgain($);
                return [2 /*return*/];
        }
    });
}); };
// The first sentence of a change, short: up to its first full stop, colon or semicolon, cut at a word near 110 characters
var firstClause = function (text) {
    var _a, _b;
    var plain = text.replace(/`/g, '').replace(/\s+/g, ' ').trim();
    var first = (_b = (_a = /^(.{20,}?[.;:])(\s|$)/.exec(plain)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : plain;
    if (first.length <= 110)
        return first.replace(/[.;:]$/, '');
    // Too long: up to its last comma that fits, else the words that fit
    var comma = first.slice(0, 110).lastIndexOf(',');
    return comma > 40 ? first.slice(0, comma) : "".concat(first.slice(0, 107).replace(/\s+\S*$/, ''), "\u2026");
};
// The note a chat shows once it moved to a newer version whose changes the person has not seen on this Mac: one quiet box in the
// header, where the update's steps were, saying what it moved from and how many versions that covers, with What's new (the
// Changelog tab) and Close, which marks it seen for every chat. Nothing in a copy a newer load of this chat replaced
var updateScreen = function ($, ui, loaded, _asks, _surface) { return __awaiter(_this, void 0, void 0, function () {
    var seen, _a, _b, _c, shown, left, _d, count;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!dir || !loaded)
                    return [2 /*return*/, undefined];
                _a = seenIn;
                return [4 /*yield*/, readOr($, seenPath())];
            case 1:
                seen = _a.apply(void 0, [_f.sent()]);
                _b = !isScreenDue(loaded, seen);
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, read($, ranVersion)];
            case 2:
                _b = (_f.sent()) !== loaded;
                _f.label = 3;
            case 3:
                if (_b)
                    return [2 /*return*/, undefined];
                _d = missedOf;
                return [4 /*yield*/, versionsLogged($)];
            case 4:
                _c = _d.apply(void 0, [_f.sent(), seen, loaded]), shown = _c.shown, left = _c.left;
                // The sound plays once for the version on this Mac
                if (screenSounded !== loaded)
                    void playUpdated($, (screenSounded = loaded));
                count = shown.length + left;
                return [2 /*return*/, (<ui.Box key="update-notice" flexDirection="column" borderStyle="round" borderColor={NOTICE_EDGE} paddingX={1} flexShrink={0}>
      <ui.Box key="update-title" flexDirection="row" gap={1} minWidth={0}>
        <ui.Box flexShrink={0}>
          <ui.Text color={FLOW}>{"Updated to Claudopus ".concat(loaded)}</ui.Text>
        </ui.Box>
        <ui.Text dimColor wrap="truncate-end">{"\u00B7 from v".concat(seen).concat(count > 1 ? ", ".concat(count, " versions") : '')}</ui.Text>
      </ui.Box>
      {((_e = shown[0]) === null || _e === void 0 ? void 0 : _e.changes[0]) ? <ui.Text key="update-what" dimColor wrap="wrap">{firstClause(shown[0].changes[0])}</ui.Text> : null}
      <ui.Box key="update-done-buttons" flexDirection="row" flexWrap="wrap" columnGap={2}>
        <ui.Button key={"update-new-".concat(presses)} label="What's new" onPress={function () { return void ((presses += 1), closeScreen($, loaded).then(function () { return openChangelog($); })).catch(function (err) { return log($, "changelog not opened: ".concat(String(err))); }); }}/>
        <ui.Button key={"update-close-".concat(presses)} label="Close" plain dimColor onPress={function () { return void closeScreen($, loaded).catch(function (err) { return log($, "update note not closed: ".concat(String(err))); }); }}/>
      </ui.Box>
    </ui.Box>)];
        }
    });
}); };
