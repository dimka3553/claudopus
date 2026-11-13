// The /claudopus and /servers commands, and the panel's focus and close
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
var commandHooks = function (on) {
    on('command.run', { command: 'claudopus' }, function ($) { return __awaiter(_this, void 0, void 0, function () {
        var opened;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isListOpened: true })); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, update($, paneShown, function () { return true; })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE })
                        // Asked for where it can be drawn, it is open in every chat from now on
                    ];
                case 3:
                    opened = _a.sent();
                    if (!opened.isPlaced) return [3 /*break*/, 5];
                    return [4 /*yield*/, choosePanel($, true)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, { text: opened.isPlaced ? 'Claudopus panel opened.' : nowhere('Claudopus') }];
            }
        });
    }); });
    // A reply box the person moves the focus into holds the list's times, so the list is not drawn under them as they start typing
    on('ui.focus', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            if (e.origin.kind === 'person' && e.plugin === 'claudopus' && /-reply-/.test((_a = e.element) !== null && _a !== void 0 ? _a : ''))
                holdTimes($);
            return [2 /*return*/, next(e)];
        });
    }); });
    // Closed by the person's own hand, it closes in every chat and stays closed until asked for; a close of the mod's own is no choice
    on('ui.close', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _a.sent();
                    if (!(e.id === LIST && e.origin.kind === 'person' && dir)) return [3 /*break*/, 3];
                    return [4 /*yield*/, choosePanel($, false)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, r];
            }
        });
    }); });
    on('command.run', { command: 'servers' }, function ($) { return __awaiter(_this, void 0, void 0, function () {
        var opened;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scanServers($).catch(function (err) { return log($, "servers not read: ".concat(String(err))); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, $.ui.open({ id: PANE, title: PANE_TITLE })];
                case 2:
                    opened = _a.sent();
                    return [2 /*return*/, { text: opened.isPlaced ? 'Servers panel opened.' : nowhere('Servers') }];
            }
        });
    }); });
};
