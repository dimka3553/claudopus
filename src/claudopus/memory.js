// Memory files in tabs of the mod's own, links to them in the chat's replies, and the Memory button
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
// ---- Memory files in tabs of the mod's own: the app's file pane opens only the session's folders, and it never lets ~/.claude
// in (the app's list of protected places), so a memory path in a reply is the mod's link to answer ----
var MEMORY_PANE = 'memory-';
var MEMORY_PANES = 3;
// What a memory path is in a reply: the folder spelled in full or from ~, up to a space, a quote, a bracket, a backtick or markup
var memoryPathIn = function () { return new RegExp("(?:".concat(dir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "|~/\\.claude/claudopus)/[^\\s`()\\[\\]<>\"'*|~]+"), 'g'); };
var memoryHref = function (path) { return "file://".concat(encodeURI(path.replace(/^~\/\.claude\/claudopus/, dir))); };
// A reply's memory paths made links of the mod's: a link to one, a code span that is one path and a bare path. Other code stays as
// it is, a fence still open to the end too
var memoryLinked = function (text) {
    var hrefs = [];
    // A path's line and column (a.md:12) are not the file's
    var at = function (path) {
        var href = memoryHref(path.replace(/(?::\d+){1,2}$/, ''));
        if (!hrefs.includes(href) && href.length <= 2048)
            hrefs.push(href);
        return href;
    };
    var path = memoryPathIn().source;
    var whole = new RegExp("^".concat(path, "$"));
    var one = new RegExp("\\[([^\\]]*)\\]\\((".concat(path, ")\\)|(^|[^\\w/(\\[])(").concat(path, ")"), 'g');
    var linked = text
        .split(/(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`[^`\n]*`)/)
        .map(function (part, i) {
        if (i % 2)
            return part.length > 2 && part.startsWith('`') && !part.startsWith('``') && whole.test(part.slice(1, -1)) ? "[".concat(part, "](").concat(at(part.slice(1, -1)), ")") : part;
        return part.replace(one, function (all, label, linkTo, lead, bare) {
            var _a, _b;
            if (linkTo)
                return "[".concat(label, "](").concat(at(linkTo), ")");
            if (!bare)
                return all;
            // A sentence's last mark is not the path's
            var tail = (_b = (_a = bare.match(/[.,;:!?_]+$/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '';
            var clean = bare.slice(0, bare.length - tail.length);
            return "".concat(lead, "[").concat(clean, "](").concat(at(clean), ")").concat(tail);
        });
    })
        .join('');
    return { text: linked, hrefs: hrefs };
};
// Which memory file a pressed link is, or '' for any other link
var memoryPressed = function (href) {
    var path = href.replace(/^file:\/\//, '');
    try {
        path = decodeURI(path);
    }
    catch (_a) { }
    path = path.replace(/^~\/\.claude\/claudopus/, dir);
    return dir && path.startsWith("".concat(dir, "/")) && !path.split('/').includes('..') ? path : '';
};
var memoryPaneOf = function (path) {
    // Two paths that spell alike once cleaned are told apart by a mark of the whole path
    var id = "".concat(MEMORY_PANE).concat(path.slice(dir.length + 1).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 44));
    return "".concat(id, "-").concat(mark(path).replace(/\D/g, '').slice(-12));
};
// The file each memory tab shows, by its tab, and what it held when it was opened
var memoryPanes = new Map();
var memoryText = new Map();
// What a memory path holds: a file's text, or a folder's entries as links; '' when it is not there
var memoryRead = function ($, path) { return __awaiter(_this, void 0, void 0, function () {
    var text, entries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.fs.read(path).catch(function () { return undefined; })];
            case 1:
                text = _a.sent();
                if (text !== undefined)
                    return [2 /*return*/, text];
                return [4 /*yield*/, $.fs.list(path).catch(function () { return []; })];
            case 2:
                entries = _a.sent();
                return [2 /*return*/, entries.length ? "# ".concat(fileName(path), "\n\n").concat(entries.map(function (one) { return "- [".concat(one.name, "](").concat(memoryHref("".concat(path, "/").concat(one.name)), ")"); }).join('\n'), "\n") : ''];
        }
    });
}); };
// A memory link pressed: a result's own path opens that result's tab, any other file a tab of its own, named after its heading
var openMemory = function ($, path) {
    presses += 1;
    void (function () { return __awaiter(_this, void 0, void 0, function () {
        var report, _a, id, text, open, _i, _b, pane, heading;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    report = (_c = path.slice(dir.length + 1).match(/^reports\/([^/]+)/)) === null || _c === void 0 ? void 0 : _c[1];
                    _a = report;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, read($, reports)];
                case 1:
                    _a = (_f.sent()).some(function (one) { return one.id === report; });
                    _f.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/, openReport($, report)];
                    id = memoryPaneOf(path);
                    return [4 /*yield*/, memoryRead($, path)];
                case 3:
                    text = _f.sent();
                    memoryPanes.set(id, path);
                    memoryText.set(id, text);
                    return [4 /*yield*/, $.ui.panes()];
                case 4:
                    open = (_f.sent()).filter(function (pane) { return pane.id.startsWith(MEMORY_PANE) && pane.id !== id; });
                    _i = 0, _b = open.slice(0, Math.max(0, open.length - (MEMORY_PANES - 1)));
                    _f.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    pane = _b[_i];
                    return [4 /*yield*/, $.ui.close({ id: pane.id }).catch(function () { return undefined; })];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    heading = (_e = (_d = text.match(/^#\s+(.+)$/m)) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.trim();
                    return [4 /*yield*/, front($, id, cut(heading || fileName(path), 30))];
                case 9:
                    _f.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })().catch(function (err) { return log($, "memory file ".concat(path, " not opened: ").concat(String(err))); });
};
// Memory: the folder the mod keeps everything in (index, briefs, words, results), opened in Finder on the Mac the chat runs on
var showMemory = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var opened;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['open', dir]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 1:
                opened = _a.sent();
                if (!(opened.exitCode !== 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "memory folder not opened: ".concat(opened.stderr))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var memoryButton = function ($, ui) { return (<ui.Box key="memory-button" flexShrink={0}>
    <ui.Button key={"memory-open-".concat(presses)} label="Memory" onPress={function () { return void showMemory($).catch(function (err) { return log($, "memory folder not opened: ".concat(String(err))); }); }}/>
  </ui.Box>); };
var memoryHooks = function (on) {
    // A reply that names a memory file: its links to memory open the mod's tab, since the app's file pane refuses ~/.claude. The
    // terminal opens such a path itself, so it keeps its own drawing
    on('ui.render', { component: 'AssistantMessage' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, text, hrefs, Markdown;
        return __generator(this, function (_b) {
            if (e.surface === 'terminal' || !dir || e.props.isSummary || !memoryPathIn().test(e.props.text))
                return [2 /*return*/, next(e)];
            _a = memoryLinked(e.props.text), text = _a.text, hrefs = _a.hrefs;
            if (!hrefs.length)
                return [2 /*return*/, next(e)];
            Markdown = $.ui.resolve(e).Markdown;
            return [2 /*return*/, (<Markdown key={"memory-reply-".concat(mark(e.requestId))} text={text} pressableLinks={hrefs.slice(0, 256)} onLinkPress={function (link) {
                        var path = memoryPressed(link.href);
                        if (path)
                            openMemory($, path);
                    }}/>)];
        });
    }); });
    // A memory file opened as a tab of its own; the links in it to other memory files open there too
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, Box, Markdown, Text, path, held, _b, text, hrefs;
        var _c, _d;
        return __generator(this, function (_e) {
            if (!((_c = e.requestId) === null || _c === void 0 ? void 0 : _c.startsWith(MEMORY_PANE)))
                return [2 /*return*/, next(e)];
            _a = $.ui.resolve(e), Box = _a.Box, Markdown = _a.Markdown, Text = _a.Text;
            path = memoryPanes.get(e.requestId);
            if (!path)
                return [2 /*return*/, <Text dimColor>Press the link in the chat again to open this file.</Text>];
            held = (_d = memoryText.get(e.requestId)) !== null && _d !== void 0 ? _d : '';
            _b = memoryLinked(held.length > REPORT_CHARS ? "".concat(held.slice(0, REPORT_CHARS), "\n\n\u2026") : held), text = _b.text, hrefs = _b.hrefs;
            return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        <Text dimColor wrap="wrap">{path}</Text>
        {held ? (<Markdown key={"memory-text-".concat(e.requestId)} text={text} pressableLinks={hrefs.slice(0, 256)} onLinkPress={function (link) {
                            var to = memoryPressed(link.href);
                            if (to)
                                openMemory($, to);
                        }}/>) : (<Text dimColor>This file is not there any more.</Text>)}
      </Box>)];
        });
    }); });
};
