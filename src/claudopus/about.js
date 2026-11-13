// The About tab: what Claudopus is, its version and the app's, the site and the code
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
// About: what Claudopus is, its version and the app's, the site, the code and its licence
var ABOUT_PANE = 'about';
var ABOUT_TITLE = 'About';
var SITE = 'https://claudopus.ai';
var REPO = 'https://github.com/dimka3553/claudopus';
// Each opening of About is a new drawing of the octopus, so it waves once each time and then rests
var aboutOpens = 0;
var openAbout = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                aboutOpens += 1;
                return [4 /*yield*/, front($, ABOUT_PANE, ABOUT_TITLE)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var aboutButton = function ($, ui) { return (<ui.Box key="about-button" flexShrink={0}>
    <ui.Button key={"about-open-".concat(presses)} label="About" onPress={function () { return void openAbout($).catch(function (err) { return log($, "about not opened: ".concat(String(err))); }); }}/>
  </ui.Box>); };
// The version this chat loaded, read once from its own copy, so a chat on an older copy shows its own number; and a newer one the
// Mac updated itself to while this chat runs the one it loaded
var loadedVersion;
var versionsOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var version, installed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loadedVersion !== null && loadedVersion !== void 0 ? loadedVersion : (loadedVersion = readOr($, "".concat($.plugin.root, "/.claude-plugin/plugin.json")).then(function (manifest) {
                    var _a;
                    try {
                        return String((_a = JSON.parse(manifest).version) !== null && _a !== void 0 ? _a : '');
                    }
                    catch (_b) {
                        return '';
                    }
                }));
                return [4 /*yield*/, loadedVersion
                    // A read that failed is tried again on the next drawing
                ];
            case 1:
                version = _a.sent();
                // A read that failed is tried again on the next drawing
                if (!version)
                    loadedVersion = undefined;
                return [4 /*yield*/, installedNow($).catch(function () { return ''; })];
            case 2:
                installed = _a.sent();
                return [2 /*return*/, { version: version, installed: installed, isWaiting: Boolean(version && installed && isNewer(installed, version)) }];
        }
    });
}); };
var aboutView = function ($, ui) { return __awaiter(_this, void 0, void 0, function () {
    var Box, Link, Text, app, _a, version, installed, isWaiting, line;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                Box = ui.Box, Link = ui.Link, Text = ui.Text;
                return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.session.version()];
                            case 1: return [2 /*return*/, (_a.sent()).version];
                        }
                    }); }); })().catch(function () { return ''; })];
            case 1:
                app = _b.sent();
                return [4 /*yield*/, versionsOf($)];
            case 2:
                _a = _b.sent(), version = _a.version, installed = _a.installed, isWaiting = _a.isWaiting;
                line = function (key, name, body) { return (<Box key={key} flexDirection="row" alignItems="flex-start" gap={2} flexShrink={0}>
      <Box width={9} flexShrink={0}>
        <Text dimColor>{name}</Text>
      </Box>
      <Box flexGrow={1} flexShrink={1} minWidth={0}>
        {body}
      </Box>
    </Box>); };
                return [2 /*return*/, (<Box key="about" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="about-head" flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        {octopus(ui, "about-mark-".concat(aboutOpens), 'wave', HEAD_MARK, 'Claudopus waving')}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text bold>Claudopus</Text>
          <Text dimColor wrap="wrap">{[version ? "Version ".concat(version) : '', isWaiting ? "".concat(installed, " is installed, new chats use it") : '', app ? "Claude Code ".concat(app) : ''].filter(Boolean).join(' · ') || 'A mod for Claude Code'}</Text>
        </Box>
      </Box>
      {band(ui, 'about-what', 'What it does', '', <Box flexDirection="column" gap={1}>
          <Text wrap="wrap">Every chat hands each of your messages to an agent that works in the background, so the chat stays small and free to talk.</Text>
          <Text wrap="wrap">This panel shows each piece of work as a card with its to-dos. What finished work leaves is kept under Results.</Text>
          <Text wrap="wrap">Your words, the subjects you work on and every result are kept as plain files under Memory. Stats adds up what the work cost and the time it saved.</Text>
        </Box>)}
      {band(ui, 'about-links', 'Links', '', <Box flexDirection="column" gap={1}>
          {line('about-site', 'Website', <Text><Link href={SITE} label="claudopus.ai"/></Text>)}
          {line('about-repo', 'GitHub', <Box flexDirection="column">
              <Text><Link href={REPO} label="dimka3553/claudopus"/></Text>
              <Text dimColor wrap="wrap">If Claudopus helps you, a star on GitHub helps others find it.</Text>
            </Box>)}
          {line('about-licence', 'Licence', <Text><Link href={"".concat(REPO, "/blob/main/LICENSE")} label="MIT"/></Text>)}
        </Box>)}
    </Box>)];
        }
    });
}); };
