// Pictures a piece of work made, drawn in its chat where it made them
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
// ---- Pictures a piece of work made, drawn in its chat where it made them ----
// How many of a chat's newest pictures are drawn small; older ones are a row that opens them. The small copy's widest side
var CHAT_THUMBS = 6;
// The most pictures one chat shows
var PICS_LISTED = 40;
var CHAT_THUMB_SIZES = ['360', '280'];
// How tall an upright small copy is drawn at most, in the panel's pixels: a tall screenshot is drawn narrower, not longer
var PIC_TALL = 200;
// The most characters a picture drawn as it is, an SVG of the work's own, may have
var SVG_CHARS = 100000;
// A press opens the picture whole in the Mac's own viewer (Preview for a photo or screenshot), a window of its own as large as the
// screen allows, which can go full screen and closes as any window does: the panel is only a sidebar wide. A chat the app runs on
// another Mac over ssh has its engine, and so `open`, on this Mac, where nobody looks: Preview opened on its screen (seen on the
// M4). There the picture opens in a tab of the app's own instead, which the app draws on the screen the person is at
var showPicture = function ($, path) { return __awaiter(_this, void 0, void 0, function () {
    var opened;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isRunFromAfar)
                    return [2 /*return*/, showPictureTab($, path)];
                return [4 /*yield*/, $.process.run(['open', path]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 1:
                opened = _a.sent();
                if (!(opened.exitCode !== 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "picture ".concat(path, " not opened: ").concat(opened.stderr))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// The picture tab: one at a time, the newest picture pressed
var PICTURE_PANE = 'picture';
var pictureShown = '';
var showPictureTab = function ($, path) { return __awaiter(_this, void 0, void 0, function () {
    var _i, larges_1, _a, id, one;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pictureShown = path;
                // One that could not be made is tried again on a new press
                for (_i = 0, larges_1 = larges; _i < larges_1.length; _i++) {
                    _a = larges_1[_i], id = _a[0], one = _a[1];
                    if (!one && id.startsWith("".concat(path, ":")))
                        larges.delete(id);
                }
                return [4 /*yield*/, front($, PICTURE_PANE, cut(fileName(path), 30))];
            case 1:
                _b.sent();
                $.ui.invalidate('ui.render');
                return [2 /*return*/];
        }
    });
}); };
// The large copy the tab draws, as wide as a wide sidebar on a sharp screen. An Svg carries at most 131072 characters, too few for
// a large screenshot to stay readable, so the copy is cut into bands across, each an Svg of its own drawn under the one before.
// A width that needs too many bands gives way to a narrower one. A picture with see-through parts keeps them as PNG, else JPEG
var LARGE_WIDTHS = [2000, 1400, 1000];
var LARGE_CHARS = 130000;
var LARGE_TOTAL = 1000000;
var larges = new Map();
var making = new Map();
var largeMade = 0;
var makeLarge = function ($, path, size) { return __awaiter(_this, void 0, void 0, function () {
    var text, from, got, width, height, formats, base, _a, _b, _c, _d, _i, formats_1, format, _e, _f, most, wide, sized, tall, _g, _h, _j, padded, bands, band_1, isTooMany, y, rows_1, out, cutTo, _k, _l, _m, read_1, _o, source, whole_1;
    var _p, _q, _r, _s, _t, _u, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                if (!/\.svg$/i.test(path)) return [3 /*break*/, 2];
                if (size > LARGE_CHARS * 2)
                    return [2 /*return*/, null];
                return [4 /*yield*/, readOr($, path)];
            case 1:
                text = _x.sent();
                from = text.indexOf('<svg');
                return [2 /*return*/, from >= 0 && text.length - from <= LARGE_CHARS ? { bands: [text.slice(from)], width: 0, height: 0 } : null];
            case 2:
                if (!RASTER.test(path))
                    return [2 /*return*/, null];
                return [4 /*yield*/, $.process.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'hasAlpha', path]).catch(function () { return ({ exitCode: 1, stdout: '' }); })];
            case 3:
                got = _x.sent();
                width = Number((_q = (_p = /pixelWidth:\s*(\d+)/.exec(got.stdout)) === null || _p === void 0 ? void 0 : _p[1]) !== null && _q !== void 0 ? _q : 0);
                height = Number((_s = (_r = /pixelHeight:\s*(\d+)/.exec(got.stdout)) === null || _r === void 0 ? void 0 : _r[1]) !== null && _s !== void 0 ? _s : 0);
                if (!width || !height)
                    return [2 /*return*/, null
                        // A picture with see-through parts is tried as PNG first, which keeps them, then as JPEG, which a window screenshot's shadow
                        // edges need to fit
                    ];
                formats = /hasAlpha:\s*yes/.test(got.stdout) ? ['png', 'jpeg'] : ['jpeg'];
                largeMade += 1;
                _b = (_a = "".concat(dir, "/thumbs/large-")).concat;
                _d = (_c = Math).round;
                return [4 /*yield*/, $.clock.now()];
            case 4:
                base = _b.apply(_a, [_d.apply(_c, [_x.sent()]), "-"]).concat(largeMade);
                return [4 /*yield*/, $.process.run(['mkdir', '-p', "".concat(dir, "/thumbs")])];
            case 5:
                _x.sent();
                _x.label = 6;
            case 6:
                _x.trys.push([6, , 23, 25]);
                _i = 0, formats_1 = formats;
                _x.label = 7;
            case 7:
                if (!(_i < formats_1.length)) return [3 /*break*/, 22];
                format = formats_1[_i];
                _e = 0, _f = __spreadArray([], new Set(LARGE_WIDTHS.map(function (w) { return Math.min(w, width); })), true);
                _x.label = 8;
            case 8:
                if (!(_e < _f.length)) return [3 /*break*/, 21];
                most = _f[_e];
                wide = "".concat(base, "-").concat(most, ".png");
                return [4 /*yield*/, $.process.run(['sips', '--resampleWidth', String(most), '-s', 'format', 'png', path, '--out', wide]).catch(function () { return ({ exitCode: 1 }); })];
            case 9:
                sized = _x.sent();
                if (sized.exitCode !== 0)
                    return [3 /*break*/, 20];
                _g = Number;
                _j = (_h = /pixelHeight:\s*(\d+)/).exec;
                return [4 /*yield*/, $.process.run(['sips', '-g', 'pixelHeight', wide]).catch(function () { return ({ stdout: '' }); })];
            case 10:
                tall = _g.apply(void 0, [(_u = (_t = _j.apply(_h, [(_x.sent()).stdout])) === null || _t === void 0 ? void 0 : _t[1]) !== null && _u !== void 0 ? _u : 0]);
                if (!tall)
                    return [3 /*break*/, 20];
                return [4 /*yield*/, $.process.run(['sips', '--padToHeightWidth', String(tall + 2), String(most), wide]).catch(function () { return ({ exitCode: 1 }); })];
            case 11:
                padded = _x.sent();
                if (padded.exitCode !== 0)
                    return [3 /*break*/, 20];
                bands = [];
                band_1 = Math.min(tall, 400);
                isTooMany = false;
                y = 0;
                _x.label = 12;
            case 12:
                if (!(y < tall)) return [3 /*break*/, 19];
                rows_1 = Math.min(band_1, tall - y);
                out = "".concat(base, "-band.").concat(format === 'png' ? 'png' : 'jpg');
                return [4 /*yield*/, $.process.run(__spreadArray(__spreadArray(['sips', '-c', String(rows_1), String(most), '--cropOffset', String(y + 1), '0', '-s', 'format', format], (format === 'jpeg' ? ['-s', 'formatOptions', '70'] : []), true), [wide, '--out', out], false))];
            case 13:
                _x.sent();
                _k = Number;
                _m = (_l = /pixelHeight:\s*(\d+)/).exec;
                return [4 /*yield*/, $.process.run(['sips', '-g', 'pixelHeight', out]).catch(function () { return ({ stdout: '' }); })];
            case 14:
                cutTo = _k.apply(void 0, [(_w = (_v = _m.apply(_l, [(_x.sent()).stdout])) === null || _v === void 0 ? void 0 : _v[1]) !== null && _w !== void 0 ? _w : 0]);
                if (!(cutTo === rows_1)) return [3 /*break*/, 16];
                return [4 /*yield*/, $.fs.read(out, { as: 'bytes' }).catch(function () { return undefined; })];
            case 15:
                _o = (_x.sent());
                return [3 /*break*/, 17];
            case 16:
                _o = undefined;
                _x.label = 17;
            case 17:
                read_1 = _o;
                source = read_1 ? "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(most, "\" height=\"").concat(rows_1, "\" viewBox=\"0 0 ").concat(most, " ").concat(rows_1, "\"><image href=\"data:image/").concat(format, ";base64,").concat(read_1.base64, "\" width=\"").concat(most, "\" height=\"").concat(rows_1, "\"/></svg>") : '';
                if (!source)
                    return [3 /*break*/, 19];
                if (source.length > LARGE_CHARS) {
                    if (rows_1 <= 16)
                        return [3 /*break*/, 19];
                    band_1 = Math.max(16, Math.floor((rows_1 * LARGE_CHARS * 0.9) / source.length));
                    return [3 /*break*/, 18];
                }
                bands.push(source);
                y += rows_1;
                if (bands.reduce(function (sum, one) { return sum + one.length; }, 0) > LARGE_TOTAL && y < tall) {
                    isTooMany = true;
                    return [3 /*break*/, 19];
                }
                _x.label = 18;
            case 18: return [3 /*break*/, 12];
            case 19:
                if (!isTooMany && bands.length) {
                    whole_1 = bands.reduce(function (sum, one) { var _a, _b; return sum + Number((_b = (_a = /height="(\d+)"/.exec(one)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0); }, 0);
                    if (whole_1 >= tall)
                        return [2 /*return*/, { bands: bands, width: width, height: height }];
                }
                _x.label = 20;
            case 20:
                _e++;
                return [3 /*break*/, 8];
            case 21:
                _i++;
                return [3 /*break*/, 7];
            case 22: return [2 /*return*/, null];
            case 23: return [4 /*yield*/, $.process.run(['sh', '-c', 'rm -f "$1"-*', 'sh', base]).catch(function () { return undefined; })];
            case 24:
                _x.sent();
                return [7 /*endfinally*/];
            case 25: return [2 /*return*/];
        }
    });
}); };
// The large copy as made, else nothing yet: it is made once, out of the drawing, which is drawn again when it is ready. One that
// cannot be made is kept as such, so it is not tried again at every drawing, only at the next press of its row
var largeOf = function ($, path, id) {
    var _a;
    if (larges.has(id))
        return (_a = larges.get(id)) !== null && _a !== void 0 ? _a : null;
    if (!making.has(id))
        making.set(id, makeLarge($, path, Number(id.split(':').pop()) || 0)
            .catch(function (err) { return (void log($, "large copy of ".concat(path, " not made: ").concat(String(err))), null); })
            .then(function (one) {
            var _a;
            if (larges.size >= 6)
                larges.delete((_a = larges.keys().next().value) !== null && _a !== void 0 ? _a : '');
            larges.set(id, one);
            making.delete(id);
            $.ui.invalidate('ui.render');
            return one;
        }));
    return undefined;
};
// What the tab draws: the picture as wide as the tab, its name and size, and how to see it larger
var pictureView = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var ui, path, name, stat, said, large;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ui = $.ui.resolve(e);
                path = pictureShown;
                if (!path)
                    return [2 /*return*/, <ui.Text dimColor>No picture is open. Press a picture's row in a work's Details.</ui.Text>];
                name = fileName(path);
                return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
            case 1:
                stat = _a.sent();
                said = function (text) { return (<ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Text dimColor wrap="wrap">{text}</ui.Text>
    </ui.Box>); };
                if (!stat || stat.kind !== 'file')
                    return [2 /*return*/, said('This picture is no longer kept.')];
                if (!('Svg' in ui))
                    return [2 /*return*/, said("This screen cannot draw pictures. It is at ".concat(path))];
                large = largeOf($, path, "".concat(path, ":").concat(stat.mtimeMs, ":").concat(stat.size));
                if (large === undefined)
                    return [2 /*return*/, said('Making a large copy…')];
                if (!large)
                    return [2 /*return*/, said("This picture could not be drawn here. Press its row again to try again. It is at ".concat(path))];
                return [2 /*return*/, (<ui.Box flexDirection="column" gap={1} width="100%">
      <ui.Text bold wrap="wrap">{name}</ui.Text>
      <ui.Box flexDirection="column" width="100%">
        {large.bands.map(function (band, n) { return (<ui.Svg key={"large-".concat(n)} source={band} alt={"Picture: ".concat(name).concat(large.bands.length > 1 ? ", part ".concat(n + 1, " of ").concat(large.bands.length) : '')}/>); })}
      </ui.Box>
      <ui.Text dimColor wrap="wrap">{"".concat(large.width ? "".concat(large.width, " \u00D7 ").concat(large.height, " \u00B7 ") : '', "drag the sidebar's edge to make it wider")}</ui.Text>
    </ui.Box>)];
        }
    });
}); };
var pics = new Map();
var PICS_HELD = 60;
var isThumbsCleared = false;
// Each Details tab's pictures by step number, as last looked for, by the work
var shots = new Map();
// One picture as the chat shows it: where it is now (the copy a report kept, once the temporary file is gone) and its small copy.
// Nothing for a file a command only named that was there before the work began
var picOf = function ($, given, one, isSeen, kept, isDrawn) { return __awaiter(_this, void 0, void 0, function () {
    var asked, stat, copy, id, thumb, text, from, to, _i, CHAT_THUMB_SIZES_1, size, pic;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                asked = given.startsWith('/') ? given : "".concat(cwd, "/").concat(given);
                return [4 /*yield*/, $.fs.stat(asked).catch(function () { return undefined; })];
            case 1:
                stat = _e.sent();
                copy = kept.filter(function (r) { return r.agent === one.id; }).flatMap(function (r) { return r.files.filter(function (file) { return fileName(file) === fileName(asked); }).map(function (file) { return "".concat(reportPath(r), "/").concat(file); }); })[0];
                if (!stat || stat.kind !== 'file')
                    return [2 /*return*/, copy && !isSeen ? picOf($, copy, one, false, [], isDrawn) : isSeen ? null : { name: fileName(asked), path: '', thumb: null, isGone: true }];
                if (isSeen && stat.mtimeMs < one.startedAt - 5000)
                    return [2 /*return*/, null];
                id = "".concat(asked, ":").concat(stat.mtimeMs, ":").concat(isDrawn);
                if (pics.has(id))
                    return [2 /*return*/, (_a = pics.get(id)) !== null && _a !== void 0 ? _a : null];
                thumb = null;
                if (!(isDrawn && /\.svg$/i.test(asked) && stat.size <= SVG_CHARS)) return [3 /*break*/, 3];
                return [4 /*yield*/, readOr($, asked)];
            case 2:
                text = _e.sent();
                from = text.indexOf('<svg');
                if (from >= 0)
                    thumb = { source: text.slice(from), width: 0, height: 0 };
                return [3 /*break*/, 12];
            case 3:
                if (!(isDrawn && RASTER.test(asked))) return [3 /*break*/, 12];
                to = "".concat(dir, "/thumbs/").concat(slug(asked).slice(-60), "-").concat(mark(asked).replace(':', '-'), "-").concat(Math.round(stat.mtimeMs), ".jpg");
                return [4 /*yield*/, $.fs.exists(to)];
            case 4:
                if (!!(_e.sent())) return [3 /*break*/, 10];
                return [4 /*yield*/, $.process.run(['mkdir', '-p', "".concat(dir, "/thumbs")])];
            case 5:
                _e.sent();
                _i = 0, CHAT_THUMB_SIZES_1 = CHAT_THUMB_SIZES;
                _e.label = 6;
            case 6:
                if (!(_i < CHAT_THUMB_SIZES_1.length)) return [3 /*break*/, 10];
                size = CHAT_THUMB_SIZES_1[_i];
                return [4 /*yield*/, $.process.run(['sips', '-Z', size, '-s', 'format', 'jpeg', '-s', 'formatOptions', '60', asked, '--out', to])];
            case 7:
                _e.sent();
                return [4 /*yield*/, $.fs.stat(to).catch(function () { return undefined; })];
            case 8:
                if (((_c = (_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : Infinity) <= THUMB_BYTES)
                    return [3 /*break*/, 10];
                _e.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 6];
            case 10: return [4 /*yield*/, thumbOf($, to)];
            case 11:
                thumb = _e.sent();
                _e.label = 12;
            case 12:
                pic = { name: fileName(asked), path: asked, thumb: thumb };
                // Only the pictures looked at lately are held
                if (pics.size >= PICS_HELD)
                    pics.delete((_d = pics.keys().next().value) !== null && _d !== void 0 ? _d : '');
                pics.set(id, pic);
                return [2 /*return*/, pic];
        }
    });
}); };
// The pictures of a chat's shown lines, each at the last step that made it, by that step's number; the newest few drawn small
var picturesIn = function ($, lines, one, kept, canDraw) { return __awaiter(_this, void 0, void 0, function () {
    var last, uses, _i, _a, line, _b, _c, _d, list, isSeen, _e, list_1, path, was, order, byStep, drawnCount, _f, _g, _h, path, _j, at, isSeen, pic;
    var _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                if (!!isThumbsCleared) return [3 /*break*/, 2];
                isThumbsCleared = true;
                return [4 /*yield*/, $.process.run(['find', "".concat(dir, "/thumbs"), '-name', '*.jpg', '-mtime', '+14', '-delete']).catch(function () { return undefined; })];
            case 1:
                _p.sent();
                _p.label = 2;
            case 2:
                last = new Map();
                uses = 0;
                for (_i = 0, _a = newest(lines.map(function (one) { return (__assign(__assign({}, one), { at: one.isUse ? (uses += 1) : uses })); })); _i < _a.length; _i++) {
                    line = _a[_i];
                    for (_b = 0, _c = [
                        [(_k = line.pictures) !== null && _k !== void 0 ? _k : [], false],
                        [(_l = line.seen) !== null && _l !== void 0 ? _l : [], true],
                    ]; _b < _c.length; _b++) {
                        _d = _c[_b], list = _d[0], isSeen = _d[1];
                        for (_e = 0, list_1 = list; _e < list_1.length; _e++) {
                            path = list_1[_e];
                            was = last.get(path);
                            last.delete(path);
                            last.set(path, { at: (_m = line.at) !== null && _m !== void 0 ? _m : 0, isSeen: isSeen && (was === null || was === void 0 ? void 0 : was.isSeen) !== false });
                        }
                    }
                }
                order = __spreadArray([], last.entries(), true).slice(-PICS_LISTED);
                byStep = new Map();
                drawnCount = 0;
                _f = 0, _g = order.reverse();
                _p.label = 3;
            case 3:
                if (!(_f < _g.length)) return [3 /*break*/, 6];
                _h = _g[_f], path = _h[0], _j = _h[1], at = _j.at, isSeen = _j.isSeen;
                return [4 /*yield*/, picOf($, path, one, isSeen, kept, canDraw && drawnCount < CHAT_THUMBS).catch(function () { return null; })];
            case 4:
                pic = _p.sent();
                if (!pic)
                    return [3 /*break*/, 5];
                if (pic.thumb)
                    drawnCount += 1;
                byStep.set(at, __spreadArray([pic], ((_o = byStep.get(at)) !== null && _o !== void 0 ? _o : []), true));
                _p.label = 5;
            case 5:
                _f++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, byStep];
        }
    });
}); };
// Reads a work's chat, and finds the pictures it made, for its Details tab, then draws the tab again. Called from the drawing, it
// runs after it: the chat is read again when the work has made a step, ended a response, been steered or ended, and its pictures
// looked for again when its chat or the reports change. One read of a work runs at a time; the next drawing reads what came since
var loading = new Set();
// A chat the app would not give is asked for again after this long, at the tab's next drawing, never sooner
var RETRY_READ = 15000;
var loadWork = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var isChanged, one, key, kept, shotsKey, now, was, rows_2, lines, _a, _b, _c, err_1, _d, _e, _f;
    var _g, _h;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                if (loading.has(id))
                    return [2 /*return*/];
                loading.add(id);
                isChanged = false;
                _m.label = 1;
            case 1:
                _m.trys.push([1, 9, 13, 14]);
                return [4 /*yield*/, read($, todos)];
            case 2:
                one = (_m.sent()).find(function (card) { return card.id === id; });
                if (!one)
                    return [2 /*return*/];
                key = [one.id, one.steps, one.tokens, one.entries.length, one.status].join(':');
                return [4 /*yield*/, read($, reports)];
            case 3:
                kept = _m.sent();
                shotsKey = "".concat(key, ":").concat(kept.length);
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _m.sent();
                was = talks.get(id);
                if (!((was === null || was === void 0 ? void 0 : was.key) !== key || (!was.lines && now - ((_j = was.at) !== null && _j !== void 0 ? _j : 0) >= RETRY_READ))) return [3 /*break*/, 6];
                return [4 /*yield*/, $.session.messages({ agentId: id }).catch(function () { return undefined; })];
            case 5:
                rows_2 = _m.sent();
                talks.set(id, { key: key, lines: Array.isArray(rows_2) ? withSteers(talkOf(rows_2), one.entries) : undefined, at: now });
                isChanged = true;
                _m.label = 6;
            case 6:
                lines = (_k = talks.get(id)) === null || _k === void 0 ? void 0 : _k.lines;
                if (!(lines && ((_l = shots.get(id)) === null || _l === void 0 ? void 0 : _l.key) !== shotsKey)) return [3 /*break*/, 8];
                _b = (_a = shots).set;
                _c = [id];
                _g = { key: shotsKey };
                return [4 /*yield*/, picturesIn($, lines, one, kept, true).catch(function () { return new Map(); })];
            case 7:
                _b.apply(_a, _c.concat([(_g.shots = _m.sent(), _g)]));
                isChanged = true;
                _m.label = 8;
            case 8: return [3 /*break*/, 14];
            case 9:
                err_1 = _m.sent();
                if (!!talks.has(id)) return [3 /*break*/, 11];
                _e = (_d = talks).set;
                _f = [id];
                _h = { key: '', lines: undefined };
                return [4 /*yield*/, $.clock.now().catch(function () { return 0; })];
            case 10:
                _e.apply(_d, _f.concat([(_h.at = _m.sent(), _h)]));
                _m.label = 11;
            case 11:
                isChanged = true;
                return [4 /*yield*/, log($, "chat of ".concat(id, " not read: ").concat(String(err_1))).catch(function () { return undefined; })];
            case 12:
                _m.sent();
                return [3 /*break*/, 14];
            case 13:
                loading.delete(id);
                return [7 /*endfinally*/];
            case 14:
                // Drawn again only when something new was read, so a drawing that finds nothing new ends there
                if (isChanged)
                    redraw($);
                return [2 /*return*/];
        }
    });
}); };
