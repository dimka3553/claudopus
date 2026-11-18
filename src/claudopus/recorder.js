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
// The panel's recorder: what happens in the real panel, written to a file, for finding faults only the app shows (the panel
// thrown to its end while the person types, 15 Nov). Off unless the file record-panel.on is in the memory folder; then each chat
// that loads the mod writes, for RECORD_FOR, one line per event to panel-record/<chat>-<start>.jsonl and removes the switch:
// every drawing of the panel and what asked for it, where its window stood, which element holds the focus, the cards in their
// order, scrolls and who asked for them, presses, and the person's typing as a count by box. Never a value typed into a box:
// an input's text, a reply's, a key's, is not read, and an element's key is kept only in the mod's own shape of keys
var RECORD_FOR = 180000;
var RECORD_SWITCH = 'record-panel.on';
var RECORD_FRESH = 60000;
var recording;
var recordLooked = 0;
var typedCount = new Map();
// Only the shape of a key the mod draws (letters, digits and - _ : . |, at most 96): anything else is kept as its length
var keyShown = function (key) { return (typeof key === 'string' && /^[\w\-:.|]{1,96}$/.test(key) ? key : typeof key === 'string' ? "<".concat(key.length, ">") : undefined); };
// Whether to record now: the switch is looked for at most every 2 s; found, recording starts and the switch goes
var isRecording = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var at, on, stat, chat, manifest, flushing;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _c.sent();
                if (!recording) return [3 /*break*/, 3];
                if (at < recording.until)
                    return [2 /*return*/, true];
                return [4 /*yield*/, recordFlush($)];
            case 2:
                _c.sent();
                recording = undefined;
                return [2 /*return*/, false];
            case 3:
                if (!dir || at - recordLooked < 2000)
                    return [2 /*return*/, false];
                recordLooked = at;
                on = "".concat(dir, "/").concat(RECORD_SWITCH);
                return [4 /*yield*/, $.fs.stat(on).catch(function () { return undefined; })];
            case 4:
                stat = _c.sent();
                if (!stat)
                    return [2 /*return*/, false
                        // A switch left from long ago, its removal failed or its chat gone, starts nothing: it goes
                    ];
                if (!(at - stat.mtimeMs > RECORD_FRESH)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.process.run(['rm', '-f', on]).catch(function () { return undefined; })];
            case 5: return [2 /*return*/, (void (_c.sent()), false)];
            case 6: return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 7:
                chat = (_c.sent()).slice(0, 8) || 'chat';
                recording = { path: "".concat(dir, "/panel-record/").concat(chat, "-").concat(new Date(at).toISOString().replace(/[:.]/g, '-'), ".jsonl"), until: at + RECORD_FOR, lines: [], written: 0, started: at };
                typedCount = new Map();
                // The switch stays for the other chats to see for a few seconds, then goes, so a recording never runs on by itself
                $.clock.after(6000, function () { return void $.process.run(['rm', '-f', on]).catch(function () { return undefined; }); });
                return [4 /*yield*/, readOr($, "".concat($.plugin.root, "/.claude-plugin/plugin.json"))];
            case 8:
                manifest = _c.sent();
                flushing = function () { return $.clock.after(2000, function () { return void (recording ? recordFlush($).then(function () { return (recording && ((void isRecording($)), flushing())); }) : undefined); }); };
                flushing();
                return [4 /*yield*/, recordLine($, { ev: 'start', version: (_b = (_a = /"version": *"([^"]+)"/.exec(manifest)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '', root: $.plugin.root.split('/').slice(-3).join('/') })];
            case 9:
                _c.sent();
                return [2 /*return*/, true];
        }
    });
}); };
// One event, with its time from the start
var recordLine = function ($, event) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!recording)
                    return [2 /*return*/];
                _b = (_a = recording.lines).push;
                _d = (_c = JSON).stringify;
                _e = {};
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _b.apply(_a, [_d.apply(_c, [__assign.apply(void 0, [(_e.t = (_f.sent()) - recording.started, _e), event])])]);
                if (!(recording.lines.length - recording.written > 40)) return [3 /*break*/, 3];
                return [4 /*yield*/, recordFlush($)];
            case 2:
                _f.sent();
                _f.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var recordFlush = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!recording || recording.written === recording.lines.length)
                    return [2 /*return*/];
                recording.written = recording.lines.length;
                return [4 /*yield*/, $.fs.write(recording.path, "".concat(recording.lines.join('\n'), "\n")).catch(function () { return undefined; })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// An event, when recording: called from the mod's own redraws and scrolls with what asked for it
var recordEvent = function ($, ev, extra) {
    if (extra === void 0) { extra = {}; }
    if (!recording)
        return;
    void $.clock.now().then(function (at) { return void (recording && at < recording.until && recordLine($, __assign(__assign({ ev: ev }, extra), { from: callerOf() }))); });
};
// Where in the mod a call came from: the function names on the way, from the stack, without paths
var callerOf = function () {
    var _a;
    return ((_a = new Error().stack) !== null && _a !== void 0 ? _a : '')
        .split('\n')
        .slice(3, 7)
        .map(function (line) { return line.trim().replace(/^at /, '').replace(/\(.*[/\\]([^/\\]+)\)$/, '($1)').replace(/ \(.*\)$/, function (m) { return (m.length > 40 ? '' : m); }); })
        .filter(function (line) { return line && !line.startsWith('async') && !line.includes('node:'); })
        .join(' < ')
        .slice(0, 200);
};
// What a drawing holds, as far as scroll and focus go: its keyed elements in order (keys only), inputs and where they sit
var drawingShape = function (drawing) {
    var keys = [];
    var nodes = 0;
    var inputs = [];
    var walk = function (node, depth) {
        var _a, _b, _c, _d, _e;
        if (!node || typeof node !== 'object' || nodes > 5000)
            return;
        if (Array.isArray(node))
            return void node.forEach(function (child) { return walk(child, depth); });
        var el = node;
        if (!el.props && el.key === undefined)
            return;
        nodes += 1;
        var type = typeof el.type === 'string' ? el.type : typeof el.type === 'function' ? (_a = el.type.name) !== null && _a !== void 0 ? _a : '' : '';
        var key = keyShown((_b = el.key) !== null && _b !== void 0 ? _b : (_c = el.props) === null || _c === void 0 ? void 0 : _c.key);
        if (/Input/i.test(type) || /-reply-|-field/.test(key !== null && key !== void 0 ? key : ''))
            inputs.push({ key: key, before: nodes });
        if (key && depth <= 6)
            keys.push(key);
        walk((_d = el.children) !== null && _d !== void 0 ? _d : (_e = el.props) === null || _e === void 0 ? void 0 : _e.children, depth + 1);
    };
    walk(drawing, 0);
    return { nodes: nodes, inputs: inputs, keys: keys.slice(0, 120), sign: __spreadArray([], keys.join(','), true).reduce(function (h, c) { return (h * 31 + c.charCodeAt(0)) >>> 0; }, 7).toString(36) };
};
var recordDrawn = new Map();
var lastSign = new Map();
var recorderHooks = function (on) {
    // The bar above the prompt, where the reply box is drawn: each drawing, whether it was the one held, and the boxes in it
    on('ui.render', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var began, r, isSame, shape, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_d.sent()))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    began = _d.sent();
                    return [4 /*yield*/, next(e)];
                case 3:
                    r = _d.sent();
                    isSame = recordDrawn.get('bar') === r;
                    recordDrawn.set('bar', r);
                    shape = drawingShape(r);
                    _a = recordLine;
                    _b = [$];
                    _c = { ev: 'render', component: e.component, id: e.requestId, surface: e.surface, offset: e.props.scroll.offset, rows: e.props.scroll.bodyRows, collapsed: e.props.isCollapsed };
                    return [4 /*yield*/, $.clock.now()];
                case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.ms = (_d.sent()) - began, _c.held = isSame, _c.typing = isTyping, _c.nodes = shape.nodes, _c.inputs = shape.inputs, _c.sign = shape.sign, _c)]))];
                case 5:
                    _d.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('ui.scroll', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, recordLine($, { ev: 'scroll', id: e.requestId, site: 'bar', origin: e.origin.kind === 'plugin' ? "plugin:".concat(e.origin.name) : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('ui.input', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var key;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!_c.sent()) return [3 /*break*/, 3];
                    key = (_a = keyShown(e.element)) !== null && _a !== void 0 ? _a : '';
                    typedCount.set(key, ((_b = typedCount.get(key)) !== null && _b !== void 0 ? _b : 0) + 1);
                    return [4 /*yield*/, recordLine($, { ev: 'input', id: e.requestId, site: 'bar', element: key, kind: e.kind, count: typedCount.get(key) })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('ui.press', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, recordLine($, { ev: 'press', id: e.requestId, site: 'bar', element: keyShown(e.element) })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, next(e)];
                case 3:
                    r = _a.sent();
                    return [4 /*yield*/, recordLine($, { ev: 'pressed', site: 'bar', element: keyShown(r.element) })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('ui.render', { component: 'Pane', requestId: LIST }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id, began, r, props, isSame, shape, moved, _a, _b;
        var _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_g.sent()))
                        return [2 /*return*/, next(e)];
                    id = (_d = e.requestId) !== null && _d !== void 0 ? _d : '';
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    began = _g.sent();
                    return [4 /*yield*/, next(e)];
                case 3:
                    r = _g.sent();
                    props = e.props;
                    isSame = recordDrawn.get(id) === r;
                    recordDrawn.set(id, r);
                    shape = e.component === 'Pane' ? drawingShape(r) : undefined;
                    moved = shape && lastSign.get(id) !== shape.sign;
                    if (shape)
                        lastSign.set(id, shape.sign);
                    _a = recordLine;
                    _b = [$];
                    _c = {
                        ev: 'render', component: e.component,
                        id: id,
                        surface: e.surface, offset: (_e = props.scroll) === null || _e === void 0 ? void 0 : _e.offset, rows: (_f = props.scroll) === null || _f === void 0 ? void 0 : _f.bodyRows, cols: props.bodyColumns, focused: props.isFocused,
                        placement: props.placement
                    };
                    return [4 /*yield*/, $.clock.now()];
                case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_c.ms = (_g.sent()) - began,
                            _c.held = isSame,
                            _c.typing = isTyping,
                            _c.nodes = shape === null || shape === void 0 ? void 0 : shape.nodes,
                            _c.inputs = shape === null || shape === void 0 ? void 0 : shape.inputs,
                            _c.sign = shape === null || shape === void 0 ? void 0 : shape.sign,
                            _c.keys = moved ? shape === null || shape === void 0 ? void 0 : shape.keys : undefined,
                            _c)]))];
                case 5:
                    _g.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('ui.scroll', { requestId: LIST }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, recordLine($, { ev: 'scroll', id: e.requestId, origin: e.origin.kind === 'plugin' ? "plugin:".concat(e.origin.name) : e.origin.kind, by: e.by, to: e.offset, rows: e.bodyRows, content: e.contentRows })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // Every site's focus moves, the panel's and the rest (a press that takes the focus out of the panel), and what came of each
    // (by site kind: the panel's own hook in commands.tsx is the one without a matcher, and the engine allows one)
    on('ui.focus', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, next(e)];
                case 2:
                    r = _a.sent();
                    return [4 /*yield*/, recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
    on('ui.focus', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, next(e)];
                case 2:
                    r = _a.sent();
                    return [4 /*yield*/, recordLine($, { ev: 'focus', id: e.requestId, origin: e.origin.kind, plugin: e.plugin, element: keyShown(e.element), deny: r.deny !== undefined })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
    // Typing as a count by box: the value is never read
    on('ui.input', { requestId: LIST }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, key;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = !/^box-.*-field/.test(e.element);
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, isRecording($)];
                case 1:
                    _a = (_d.sent());
                    _d.label = 2;
                case 2:
                    if (!_a) return [3 /*break*/, 4];
                    key = (_b = keyShown(e.element)) !== null && _b !== void 0 ? _b : '';
                    typedCount.set(key, ((_c = typedCount.get(key)) !== null && _c !== void 0 ? _c : 0) + 1);
                    return [4 /*yield*/, recordLine($, { ev: 'input', id: e.requestId, element: key, kind: e.kind, count: typedCount.get(key) })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A press, and whether it reached its button: an element the drawing no longer holds runs nothing
    on('ui.press', { requestId: LIST }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isRecording($)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, recordLine($, { ev: 'press', id: e.requestId, element: keyShown(e.element) })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, next(e)];
                case 3:
                    r = _a.sent();
                    return [4 /*yield*/, recordLine($, { ev: 'pressed', element: keyShown(r.element) })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
