// The mod's other tabs: Results, Stats, Config, About, and a result in a tab of its own
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
var tabHooks = function (on) {
    // The reports, in a pane of their own
    on('ui.render', { component: 'Pane', requestId: REPORTS_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box, kept, line, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Box = $.ui.resolve(e).Box;
                    return [4 /*yield*/, read($, reports)
                        // What one row holds: the pane's cells less the block's padding. The app's letters are narrower than a cell
                    ];
                case 1:
                    kept = _c.sent();
                    line = Math.max(24, Math.floor((e.props.bodyColumns - 8) * (e.surface === 'terminal' ? 1 : 1.25)));
                    _a = reportsView;
                    _b = [$, $.ui.resolve(e), kept];
                    return [4 /*yield*/, $.clock.now()];
                case 2: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([_c.sent(), line]))}
      </Box>)];
            }
        });
    }); });
    // Stats, in a pane of its own: drawn at once from what was read last, while the records are read again at most once a minute
    on('ui.render', { component: 'Pane', requestId: STATS_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Box = $.ui.resolve(e).Box;
                    void statsRead($, statsShown.scope).catch(function () { return undefined; });
                    _a = statsView;
                    _b = [function () { return $.ui.invalidate('ui.render'); }, $.ui.resolve(e)];
                    return [4 /*yield*/, $.clock.now()];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([_c.sent(), function (scope) { return void statsRead($, scope).catch(function () { return undefined; }); }, e.surface, e.props.bodyColumns * 7.4 - 32]))}
      </Box>)];
            }
        });
    }); });
    // About, in a pane of its own
    on('ui.render', { component: 'Pane', requestId: CONFIG_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var ui, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ui = $.ui.resolve(e);
                    _a = configView;
                    _b = [ui];
                    return [4 /*yield*/, configShown($)];
                case 1: return [2 /*return*/, (<ui.Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.apply(void 0, _b.concat([_c.sent(), configActs($), band, presses, dir]))}
      </ui.Box>)];
            }
        });
    }); });
    on('ui.render', { component: 'Pane', requestId: ABOUT_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Box = $.ui.resolve(e).Box;
                    return [4 /*yield*/, aboutView($, $.ui.resolve(e))];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.sent()}
      </Box>)];
            }
        });
    }); });
    // A picture opened large, in a chat the app runs on another Mac over ssh
    on('ui.render', { component: 'Pane', requestId: PICTURE_PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var Box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Box = $.ui.resolve(e).Box;
                    return [4 /*yield*/, pictureView($, e)];
                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_a.sent()}
      </Box>)];
            }
        });
    }); });
    // A report opened as a pane of its own, named after it
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, Box, Text, kept, r, _b, _c, _d, at, file, picture, _e, _f, _g, _h, _j;
        var _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    if (!((_k = e.requestId) === null || _k === void 0 ? void 0 : _k.startsWith('report-')))
                        return [2 /*return*/, next(e)];
                    _a = $.ui.resolve(e), Box = _a.Box, Text = _a.Text;
                    return [4 /*yield*/, read($, reports)];
                case 1:
                    kept = _o.sent();
                    r = kept.find(function (one) { return paneOf(one) === e.requestId; });
                    if (!r)
                        return [2 /*return*/, <Text dimColor>This result is no longer kept.</Text>];
                    if (!!reportText.has(r.id)) return [3 /*break*/, 3];
                    _c = (_b = reportText).set;
                    _d = [r.id];
                    return [4 /*yield*/, readOr($, "".concat(reportPath(r), "/report.md"))];
                case 2:
                    _c.apply(_b, _d.concat([_o.sent()]));
                    _o.label = 3;
                case 3:
                    at = Math.min(Math.max(0, (_l = pictureAt.get(paneOf(r))) !== null && _l !== void 0 ? _l : 0), Math.max(0, r.files.length - 1));
                    file = (_m = r.files[at]) !== null && _m !== void 0 ? _m : '';
                    if (!(e.surface === 'terminal')) return [3 /*break*/, 4];
                    _e = null;
                    return [3 /*break*/, 11];
                case 4:
                    if (!RASTER.test(file)) return [3 /*break*/, 6];
                    return [4 /*yield*/, thumbOf($, thumbPath(r, file))];
                case 5:
                    _f = _o.sent();
                    return [3 /*break*/, 10];
                case 6:
                    if (!/\.svg$/i.test(file)) return [3 /*break*/, 8];
                    return [4 /*yield*/, svgOf($, "".concat(reportPath(r), "/").concat(file))];
                case 7:
                    _g = _o.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _g = null;
                    _o.label = 9;
                case 9:
                    _f = _g;
                    _o.label = 10;
                case 10:
                    _e = _f;
                    _o.label = 11;
                case 11:
                    picture = _e;
                    _h = reportShown;
                    _j = [$, $.ui.resolve(e), r, reportText.get(r.id) || 'This result has no text.', kept];
                    return [4 /*yield*/, $.clock.now()];
                case 12: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {_h.apply(void 0, _j.concat([_o.sent(), at, picture]))}
      </Box>)];
            }
        });
    }); });
};
