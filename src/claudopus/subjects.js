// The index: one line per subject, and the subject's brief
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
// ---- The index: one line per subject, "- name | repo | session | state | summary" ----
var INDEX_HEAD = '# Streams\n\nname | repo | session | state | summary\n\n';
var parseIndex = function (text) {
    return text
        .split('\n')
        .filter(function (line) { return line.startsWith('- '); })
        .map(function (line) {
        var _a = line.slice(2).split(' | '), _b = _a[0], name = _b === void 0 ? '' : _b, _c = _a[1], repo = _c === void 0 ? '' : _c, _d = _a[2], session = _d === void 0 ? '' : _d, _e = _a[3], state = _e === void 0 ? '' : _e, rest = _a.slice(4);
        return { name: name.trim(), repo: repo.trim(), session: session.trim(), state: state.trim(), summary: rest.join(' | ').trim() };
    });
};
var indexLines = function (list) { return list.map(function (s) { return "- ".concat([s.name, s.repo, s.session, s.state, s.summary].join(' | ')); }).join('\n'); };
var readIndex = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = parseIndex;
            return [4 /*yield*/, readOr($, "".concat(dir, "/index.md"))];
        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])
            // Creates the subject or changes the fields given
        ];
    }
}); }); };
// Creates the subject or changes the fields given
var saveStream = function ($, name, patch) { return __awaiter(_this, void 0, void 0, function () {
    var list, old, given, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readIndex($)];
            case 1:
                list = _a.sent();
                old = list.find(function (s) { return slug(s.name) === slug(name); });
                given = Object.fromEntries(Object.entries(patch).filter(function (_a) {
                    var value = _a[1];
                    return typeof value === 'string';
                }).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return [key, oneLine(String(value))];
                }));
                next = __assign(__assign({ name: oneLine(name), repo: '', session: '', state: '', summary: '' }, old), given);
                return [4 /*yield*/, $.fs.write("".concat(dir, "/index.md"), "".concat(INDEX_HEAD).concat(indexLines(old ? list.map(function (s) { return (s === old ? next : s); }) : __spreadArray(__spreadArray([], list, true), [next], false)), "\n"))];
            case 2:
                _a.sent();
                return [2 /*return*/, next];
        }
    });
}); };
// This session's title as the app knows it; nothing outside the desktop app, or before the app's tools connect
var appTitle = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _b = (_a = JSON).parse;
                _c = textOf;
                return [4 /*yield*/, $.mcp.call('ccd_session_mgmt', 'get_session', { session_id: 'self' })];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.apply(void 0, [_e.sent()])]).title];
            case 2:
                _d = _e.sent();
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Tells one version of the role text from another
var mark = function (text) { return "".concat(text.length, ":").concat(__spreadArray([], text, true).reduce(function (sum, ch) { return (sum * 31 + ch.charCodeAt(0)) % 1000003; }, 7)); };
