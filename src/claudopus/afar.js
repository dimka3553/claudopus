// What happens in chats this panel cannot see into: chats running without Claudopus, and the asks and finishes of another Mac's chats
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
// ---- Chats running without Claudopus, on this Mac or a Mac it reaches, and the Claude app's decision that starts new ones so ----
// What was found: the chats by Mac ('' for this one), and when this Mac's app decided a Mac's own install didn't load there ('' when
// it holds no such decision). Looked at every AFAR_EVERY by each chat, as the look is a ps and a grep of one log
var offChats = [];
var stuckAt = '';
var afarAt = -Infinity;
var AFAR_EVERY = 30000;
// Says whether what was found changed, so the panel is drawn again
var lookAfar = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var failed, here, app, found, _loop_1, _i, macs_1, mac, stuck, isChanged;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (now - afarAt < AFAR_EVERY)
                    return [2 /*return*/, false];
                afarAt = now;
                failed = { exitCode: -1, stdout: '' };
                return [4 /*yield*/, $.process.run(['sh', '-c', OFF_LOOK], { timeoutMs: 10000 }).catch(function () { return failed; })];
            case 1:
                here = _b.sent();
                return [4 /*yield*/, $.process.run(['sh', '-c', APP_LOG_LOOK], { timeoutMs: 10000 }).catch(function () { return failed; })];
            case 2:
                app = _b.sent();
                found = here.exitCode === 0 ? offOf(here.stdout).map(function (one) { return (__assign(__assign({}, one), { host: '' })); }) : [];
                _loop_1 = function (mac) {
                    var f, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _d = (_c = JSON).parse;
                                return [4 /*yield*/, readOr($, macPath(mac))];
                            case 1:
                                f = _d.apply(_c, [(_e.sent()) || '{}']);
                                if (f.text && now - ((_a = f.fetchedAt) !== null && _a !== void 0 ? _a : 0) <= STALE)
                                    found.push.apply(found, offOf(f.text).map(function (one) { return (__assign(__assign({}, one), { host: mac })); }));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, macs_1 = macs;
                _b.label = 3;
            case 3:
                if (!(_i < macs_1.length)) return [3 /*break*/, 6];
                mac = macs_1[_i];
                return [5 /*yield**/, _loop_1(mac)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                if (!found.some(function (one) { return one.host; })) return [3 /*break*/, 8];
                return [4 /*yield*/, readAppIds($, now).catch(function () { return false; })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                stuck = stuckOf(app.stdout);
                isChanged = JSON.stringify([found, stuck]) !== JSON.stringify([offChats, stuckAt]);
                offChats = found;
                stuckAt = stuck;
                return [2 /*return*/, isChanged];
        }
    });
}); };
// A chat's name for the panel: its own title, else the one this Mac's app gives it, else a word
var offName = function (one) { return one.title || appTitles.get(one.chat) || (one.chat === 'new' ? 'A chat just started' : 'A chat'); };
// The warning the panel shows under its header while any of it holds: in those chats nothing of Claudopus runs, so this is the only
// place they are seen, and what cures it
var afarPart = function (ui) {
    var _a;
    if (!stuckAt && !offChats.length)
        return null;
    var there = macs.length === 1 ? macName((_a = macs[0]) !== null && _a !== void 0 ? _a : '') : 'the Mac it runs chats on over SSH';
    var lines = __spreadArray(__spreadArray([], (stuckAt ? ["New chats on ".concat(there, " start without Claudopus. This Mac's Claude app decided at ").concat(stuckAt, " that Claudopus didn't load there, and since then it gives every new chat there its own copy, which has no Claudopus code: no panel, tools or rules. The app forgets this only when it is quit and opened again.")] : []), true), offChats.map(function (one) { return "\u201C".concat(offName(one), "\u201D").concat(one.host ? " on ".concat(macName(one.host)) : ' on this Mac', " runs without Claudopus: its work, asks and results do not reach any panel. A chat started after the app is reopened has it."); }), true);
    return (<ui.Box key="afar" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{offChats.length === 1 && !stuckAt ? 'Claudopus is off in a chat' : 'Claudopus is off in some chats'}</ui.Text>
      {lines.map(function (line, i) { return (<ui.Text key={"afar-".concat(i)} wrap="wrap">
          {line}
        </ui.Text>); })}
    </ui.Box>);
};
// ---- Another Mac's chats, told here: their asks, prompts and finishes as a notification on this Mac, where the person is, as that
// Mac's own notifications show only on its own screen. Only for the Macs this one reaches (config.json `macs`); each once, whichever
// chat here sees it first, and only when it is fresh, so a chat that starts tells nothing old ----
var AFAR_FRESH = 3 * 60000;
var toldDir = function () { return "".concat(liveDir(), "/").concat(MACS, "/told"); };
var tellOnce = function ($, key, tell) { return __awaiter(_this, void 0, void 0, function () {
    var path, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = "".concat(toldDir(), "/").concat(key.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 150));
                return [4 /*yield*/, $.process.run(['sh', '-c', 'mkdir -p "$1" && mkdir "$2" 2>/dev/null', 'sh', toldDir(), path]).catch(function () { return ({ exitCode: -1 }); })];
            case 1:
                r = _a.sent();
                if (!(r.exitCode === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, tell().catch(function (err) { return log($, "".concat(key, " not told: ").concat(String(err))); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var toldSwept = -Infinity;
var tellAfar = function ($, list, now) { return __awaiter(_this, void 0, void 0, function () {
    var config, _a, _b, _c, _loop_2, _i, list_1, s;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!list.length)
                    return [2 /*return*/];
                if (!(now - toldSwept > 3600000)) return [3 /*break*/, 2];
                toldSwept = now;
                return [4 /*yield*/, $.process.run(['find', toldDir(), '-mindepth', '1', '-maxdepth', '1', '-mmin', '+120', '-exec', 'rmdir', '{}', '+']).catch(function () { return undefined; })];
            case 1:
                _e.sent();
                _e.label = 2;
            case 2:
                config = {};
                _e.label = 3;
            case 3:
                _e.trys.push([3, 5, , 6]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/config.json"))];
            case 4:
                config = _b.apply(_a, [(_e.sent()) || '{}']);
                return [3 /*break*/, 6];
            case 5:
                _c = _e.sent();
                return [3 /*break*/, 6];
            case 6:
                _loop_2 = function (s) {
                    var opens_1, where, _loop_3, _f, _g, card, _loop_4, _h, _j, p;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                opens_1 = openUrl(s, heldApp(s));
                                where = "".concat(chatName(s), " on ").concat(macName(s.host));
                                _loop_3 = function (card) {
                                    var id, item_1;
                                    return __generator(this, function (_l) {
                                        switch (_l.label) {
                                            case 0:
                                                id = remoteId(s, card.id);
                                                if (!(card.ask && Math.abs(now - card.ask.at) < AFAR_FRESH)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, tellOnce($, "ask-".concat(id, "-").concat(card.ask.at), function () { var _a, _b; return aloud($, 'ask', "".concat(titleOf(card), " needs you"), "".concat((_b = (_a = card.ask) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '', " \u00B7 ").concat(where), "ask-".concat(id), opens_1); })];
                                            case 1:
                                                _l.sent();
                                                _l.label = 2;
                                            case 2:
                                                if (!(card.status !== 'working' && card.endedAt && now - card.endedAt < AFAR_FRESH && config.notifications !== false)) return [3 /*break*/, 4];
                                                item_1 = readyOf({ id: card.id }, [card], []);
                                                if (!item_1) return [3 /*break*/, 4];
                                                return [4 /*yield*/, tellOnce($, "end-".concat(id), function () { return alertPerson($, 'ready', item_1.title, "".concat(item_1.what, " \u00B7 ").concat(where), "ready-".concat(id), undefined, opens_1); })];
                                            case 3:
                                                _l.sent();
                                                _l.label = 4;
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                };
                                _f = 0, _g = s.cards;
                                _k.label = 1;
                            case 1:
                                if (!(_f < _g.length)) return [3 /*break*/, 4];
                                card = _g[_f];
                                return [5 /*yield**/, _loop_3(card)];
                            case 2:
                                _k.sent();
                                _k.label = 3;
                            case 3:
                                _f++;
                                return [3 /*break*/, 1];
                            case 4:
                                _loop_4 = function (p) {
                                    return __generator(this, function (_m) {
                                        switch (_m.label) {
                                            case 0:
                                                if (!(Math.abs(now - p.at) < AFAR_FRESH)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, tellOnce($, "prompt-".concat(s.host, "-").concat(s.chat, "-").concat(p.id), function () { var _a; return aloud($, 'prompt', "".concat((_a = p.title) !== null && _a !== void 0 ? _a : chatName(s), " needs your OK"), "".concat(p.text, " \u00B7 ").concat(where), "prompt-".concat(s.chat, "-").concat(p.id), opens_1); })];
                                            case 1:
                                                _m.sent();
                                                _m.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                };
                                _h = 0, _j = (_d = s.prompts) !== null && _d !== void 0 ? _d : [];
                                _k.label = 5;
                            case 5:
                                if (!(_h < _j.length)) return [3 /*break*/, 8];
                                p = _j[_h];
                                return [5 /*yield**/, _loop_4(p)];
                            case 6:
                                _k.sent();
                                _k.label = 7;
                            case 7:
                                _h++;
                                return [3 /*break*/, 5];
                            case 8: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, list_1 = list;
                _e.label = 7;
            case 7:
                if (!(_i < list_1.length)) return [3 /*break*/, 10];
                s = list_1[_i];
                return [5 /*yield**/, _loop_2(s)];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10: return [2 /*return*/];
        }
    });
}); };
