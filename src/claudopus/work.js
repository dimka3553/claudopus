// Work starting and running: the chat's own thread kept to reading and handing work over, how full the chat is, each step of work, and new
// work's card
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var _this = this;
// A call that writes into the runners' boxes folder or reads their keychain service: a command that names them, a file it runs that
// does, or a file written or edited there. The runners themselves, the mod's own bin/admin and bin/secret, are what may
var isBoxesTouched = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var home, input, path, boxes_1, command, _i, _a, text;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, false];
                home = dir.replace(/\/\.claude\/claudopus$/, '');
                input = e;
                if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool)) {
                    path = pathOf(String((_c = (_b = input.file_path) !== null && _b !== void 0 ? _b : input.notebook_path) !== null && _c !== void 0 ? _c : ''), home, cwd || home).toLowerCase();
                    boxes_1 = boxesDir().toLowerCase();
                    return [2 /*return*/, path === boxes_1 || path.startsWith("".concat(boxes_1, "/")) || path.startsWith("".concat(home.toLowerCase(), "/.claude/plugins/cache/claudopus/"))];
                }
                if (e.tool !== 'Bash')
                    return [2 /*return*/, false];
                command = String((_d = input.command) !== null && _d !== void 0 ? _d : '');
                if (touchesBoxes(command))
                    return [2 /*return*/, true];
                _i = 0;
                return [4 /*yield*/, scriptsRun($, command)];
            case 1:
                _a = _e.sent();
                _e.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                text = _a[_i];
                if (touchesBoxes(text))
                    return [2 /*return*/, true];
                _e.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/, false];
        }
    });
}); };
// The files a command runs, as filesRun finds them, each read (the first megabyte): the mod's own runners (bin/admin, bin/secret,
// bin/release, bin/keyring) are let through unread
var scriptsRun = function ($, command) { return __awaiter(_this, void 0, void 0, function () {
    var home, root, texts, _i, _a, path, runner, text, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                home = dir.replace(/\/\.claude\/claudopus$/, '');
                root = $.plugin.root;
                texts = [];
                _i = 0, _a = filesRun(command, home, cwd || home);
                _e.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                path = _a[_i];
                runner = (_d = /\/bin\/(admin|secret|release|keyring)$/.exec(path)) === null || _d === void 0 ? void 0 : _d[1];
                if (runner && (path === "".concat(root, "/bin/").concat(runner) || new RegExp("^".concat(home.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "/\\.claude/plugins/cache/claudopus/claudopus/[^/]+/bin/(?:admin|secret|release|keyring)$")).test(path)))
                    return [3 /*break*/, 5];
                return [4 /*yield*/, readOr($, path)];
            case 2:
                text = (_e.sent()).slice(0, 1000000);
                _b = runner && text;
                if (!_b) return [3 /*break*/, 4];
                _c = text;
                return [4 /*yield*/, readOr($, "".concat(root, "/bin/").concat(runner))];
            case 3:
                _b = _c === (_e.sent());
                _e.label = 4;
            case 4:
                if (_b)
                    return [3 /*break*/, 5];
                if (text)
                    texts.push(text);
                _e.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, texts];
        }
    });
}); };
// A command, or a script it runs, that would print a kept key or password: read as written and with its quotes taken out
var readsKept = function ($, command) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = [command, unquoted(command)].some(function (one) { return KEYCHAIN_READ.test(one); });
            if (_a) return [3 /*break*/, 2];
            return [4 /*yield*/, scriptsRun($, command)];
        case 1:
            _a = (_b.sent()).some(function (text) { return KEYCHAIN_READ.test(text) || KEYCHAIN_READ.test(unquoted(text)); });
            _b.label = 2;
        case 2: return [2 /*return*/, _a];
    }
}); }); };
// A tool call that writes a file of the memory folder only the mod writes (refused outright), or the person's own settings and texts
// by a command (refused: work changes those with Edit or Write, which wait for the person's press)
var writesOwnFiles = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var input, command, texts, _a, home, path, memory;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, ''];
                input = e;
                if (!(e.tool === 'Bash')) return [3 /*break*/, 2];
                command = String((_b = input.command) !== null && _b !== void 0 ? _b : '');
                _a = [[command]];
                return [4 /*yield*/, scriptsRun($, command)];
            case 1:
                texts = __spreadArray.apply(void 0, _a.concat([(_e.sent()), true])).flatMap(function (one) { return [one, unquoted(one)]; });
                if (texts.some(function (one) { return writesMemory(one, MEMORY_OWN); }))
                    return [2 /*return*/, NO_MEMORY];
                if (texts.some(function (one) { return writesMemory(one, MEMORY_PERSON); }))
                    return [2 /*return*/, NO_MEMORY_BASH()];
                return [2 /*return*/, ''];
            case 2:
                if (!['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool))
                    return [2 /*return*/, ''];
                home = dir.replace(/\/\.claude\/claudopus$/, '');
                path = pathOf(String((_d = (_c = input.file_path) !== null && _c !== void 0 ? _c : input.notebook_path) !== null && _d !== void 0 ? _d : ''), home, cwd || home).toLowerCase();
                memory = dir.toLowerCase();
                return [2 /*return*/, MEMORY_OWN.some(function (name) { return path === "".concat(memory, "/").concat(name) || path.startsWith("".concat(memory, "/").concat(name, "/")); }) ? NO_MEMORY : ''];
        }
    });
}); };
// bin/keyring and its store, the runners' alone: on a Mac a way into the keychain, on Linux files that hold every kept password and
// key, the boxes' answers and the admin gate's key. A command that names the keyring runner or the store's folder (bin/keyring,
// keyring/…, "keyring"), and any tool that reads, searches or writes a path in that folder, or searches a folder of yours it is in,
// is refused. Commands that only name the word, such as `pip install keyring`, are refused with it. This stops slips and common
// tricks, as the boxes' guard does; it is no wall
var KEYRING_WORD = /(?:^|[\s'"=/;&|(`$])keyring(?:$|[\s'"/;&|)`])/i;
var KEYRING_PATH = /claudopus\/keyring(?:\/|\b)|\.local\/share\/claudopus\b/i;
var touchesKeyring = function (e) {
    var _a;
    var input = e;
    if (e.tool === 'Bash') {
        var command = String((_a = input.command) !== null && _a !== void 0 ? _a : '');
        // git and gh alone may name the word, so a commit message or a pull request can; never the store's folder
        return KEYRING_PATH.test(command) || (KEYRING_WORD.test(command) && !/^\s*(?:git|gh)\s[^;&|`$<>]*$/.test(command));
    }
    if (!['Read', 'Grep', 'Glob', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool))
        return false;
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var roots = [keyringRoot, keyringOldRoot, "".concat(home, "/.local/share/claudopus/keyring")].filter(Boolean).map(function (one) { return one.toLowerCase(); });
    var isSearch = e.tool === 'Grep' || e.tool === 'Glob';
    if (isSearch && [input.pattern, input.glob].some(function (one) { return typeof one === 'string' && KEYRING_WORD.test(" ".concat(one, " ")); }))
        return true;
    return [input.file_path, input.notebook_path, input.path, input.pattern, input.glob].some(function (one) {
        if (typeof one !== 'string' || !one)
            return false;
        if (KEYRING_PATH.test(one))
            return true;
        var path = pathOf(one, home, cwd || home).toLowerCase().replace(/\/+$/, '');
        // A search from a folder of yours above the store reaches into it (ripgrep passes over hidden folders only from above your home)
        return roots.some(function (root) { return path === root || path.startsWith("".concat(root, "/")) || (isSearch && path.length > home.length && root.startsWith("".concat(path, "/"))); });
    });
};
var workHooks = function (on) {
    // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
    on('tool.call', function ($, e, raw) { return __awaiter(_this, void 0, void 0, function () {
        var run, grants, _a, keyKept, ownFiles, _b, _c, _d, _e, isRefusedHere, _f, gated, released, _g, _h, _j, fileSaid, woken, next, call, resume, held_1, _k, steered, from, answered, answer, message, woke, words, isWhole, to_1, theirs, now_1, list, target_1, given, isRepeat, asking, asked_1, isSteer_1, sender, title, id_1, now_2, isKeeping_1, nudge_1, sent, line_1, hold, r, askedModel, better, alias, _l, call, r, stopId_1, now_3, readPath, isPaste;
        var _this = this;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        return __generator(this, function (_11) {
            switch (_11.label) {
                case 0:
                    run = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        var isWatched, _a, _b, r, isPersonWatched, writes, before, _c, isPersonEnded, undone, _d, _e;
                        var _f, _g, _h;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    isWatched = e.agentId !== undefined && Boolean(dir);
                                    if (!isWatched) return [3 /*break*/, 2];
                                    return [4 /*yield*/, callBegun($, e.tool_use_id, (_f = e.agentId) !== null && _f !== void 0 ? _f : '', e.tool, e).catch(function (err) { return log($, "call not followed: ".concat(String(err))); })];
                                case 1:
                                    _j.sent();
                                    _j.label = 2;
                                case 2:
                                    if (!isWatched) return [3 /*break*/, 4];
                                    _a = callStarted;
                                    _b = [e.tool_use_id];
                                    return [4 /*yield*/, $.clock.now()];
                                case 3:
                                    _a.apply(void 0, _b.concat([_j.sent()]));
                                    _j.label = 4;
                                case 4:
                                    isPersonWatched = e.tool === 'Bash' && Boolean(dir);
                                    writes = FILE_TOOLS.includes(e.tool) ? personNamed(e) : '';
                                    if (!dir) return [3 /*break*/, 6];
                                    return [4 /*yield*/, personCheck($).catch(function (err) { return log($, "files not compared before a call: ".concat(String(err))); })];
                                case 5:
                                    _j.sent();
                                    _j.label = 6;
                                case 6:
                                    if (!writes) return [3 /*break*/, 8];
                                    return [4 /*yield*/, personRead($, writes).catch(function () { return undefined; })];
                                case 7:
                                    _c = _j.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    _c = undefined;
                                    _j.label = 9;
                                case 9:
                                    before = _c;
                                    if (writes)
                                        personWriting.add(writes);
                                    isPersonEnded = false;
                                    _j.label = 10;
                                case 10:
                                    _j.trys.push([10, , 16, 25]);
                                    return [4 /*yield*/, raw(call)];
                                case 11:
                                    r = _j.sent();
                                    if (!isPersonWatched) return [3 /*break*/, 13];
                                    isPersonEnded = true;
                                    return [4 /*yield*/, personCheck($, e).catch(function () { return []; })];
                                case 12:
                                    undone = _j.sent();
                                    if (undone.length && !r.deny)
                                        r = __assign(__assign({}, r), { context: __spreadArray(__spreadArray([], ((_g = r.context) !== null && _g !== void 0 ? _g : []), true), [PERSON_UNDONE(undone)], false) });
                                    _j.label = 13;
                                case 13:
                                    if (!!r.deny) return [3 /*break*/, 15];
                                    return [4 /*yield*/, personSeen($, e, before).catch(function () { return undefined; })];
                                case 14:
                                    _j.sent();
                                    _j.label = 15;
                                case 15: return [2 /*return*/, r];
                                case 16:
                                    if (writes)
                                        personWriting.delete(writes);
                                    if (!(isPersonWatched && !isPersonEnded)) return [3 /*break*/, 18];
                                    return [4 /*yield*/, personCheck($, e).catch(function () { return undefined; })];
                                case 17:
                                    _j.sent();
                                    _j.label = 18;
                                case 18:
                                    if (!isWatched) return [3 /*break*/, 20];
                                    return [4 /*yield*/, callEnded($, e.tool_use_id, (_h = e.agentId) !== null && _h !== void 0 ? _h : '', e.tool, r).catch(function (err) { return log($, "call end not followed: ".concat(String(err))); })];
                                case 19:
                                    _j.sent();
                                    _j.label = 20;
                                case 20:
                                    asked = asked.filter(function (one) { return one.id !== e.tool_use_id; });
                                    settle($, e.tool_use_id, e.agentId, e.tool, outcomeOf(r), e);
                                    if (!(grants.length && !e.run_in_background)) return [3 /*break*/, 22];
                                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })];
                                case 21:
                                    _j.sent();
                                    _j.label = 22;
                                case 22:
                                    _d = runnerEnded;
                                    _e = [e.tool_use_id, Boolean(e.run_in_background)];
                                    return [4 /*yield*/, $.clock.now()];
                                case 23:
                                    _d.apply(void 0, _e.concat([_j.sent()]));
                                    // A note of what the person allowed for this call goes as it ends
                                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                                case 24:
                                    // A note of what the person allowed for this call goes as it ends
                                    _j.sent();
                                    return [7 /*endfinally*/];
                                case 25: return [2 /*return*/];
                            }
                        });
                    }); };
                    grants = [];
                    return [4 /*yield*/, isBoxesTouched($, e)];
                case 1:
                    if (!_11.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " touching the password and key boxes"))];
                case 2:
                    _11.sent();
                    return [2 /*return*/, { deny: NO_BOXES }];
                case 3:
                    _a = e.tool === 'Bash';
                    if (!_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, readsKept($, String((_m = e.command) !== null && _m !== void 0 ? _m : ''))];
                case 4:
                    _a = (_11.sent());
                    _11.label = 5;
                case 5:
                    if (!((_a) || touchesKeyring(e))) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, 'refused a command that reads the keychain')];
                case 6:
                    _11.sent();
                    return [2 /*return*/, { deny: NO_READ }];
                case 7: return [4 /*yield*/, keyAsked($, e).catch(function () { return ''; })];
                case 8:
                    keyKept = _11.sent();
                    if (!keyKept) return [3 /*break*/, 10];
                    return [4 /*yield*/, log($, "refused an ask for a key the list of keys has (".concat(e.tool, ")"))];
                case 9:
                    _11.sent();
                    return [2 /*return*/, { deny: keyKept }];
                case 10: return [4 /*yield*/, writesOwnFiles($, e)];
                case 11:
                    ownFiles = _11.sent();
                    if (!ownFiles) return [3 /*break*/, 13];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " writing the memory folder's own files"))];
                case 12:
                    _11.sent();
                    return [2 /*return*/, { deny: ownFiles }];
                case 13:
                    if (!(e.tool === 'Bash' && pushesMain(String((_o = e.command) !== null && _o !== void 0 ? _o : '')))) return [3 /*break*/, 15];
                    return [4 /*yield*/, log($, 'refused a command that pushes or merges to main itself')];
                case 14:
                    _11.sent();
                    return [2 /*return*/, { deny: "".concat(NO_PUSH, " It is ").concat($.plugin.root, "/bin/release.") }];
                case 15:
                    _b = touchesGate(e);
                    if (_b) return [3 /*break*/, 18];
                    _c = e.tool === 'Bash';
                    if (!_c) return [3 /*break*/, 17];
                    return [4 /*yield*/, scriptsRun($, String((_p = e.command) !== null && _p !== void 0 ? _p : ''))];
                case 16:
                    _c = (_11.sent()).some(function (text) { return touchesGate(__assign(__assign({}, e), { command: text })); });
                    _11.label = 17;
                case 17:
                    _b = (_c);
                    _11.label = 18;
                case 18:
                    if (!_b) return [3 /*break*/, 20];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " on the admin gate's own files"))];
                case 19:
                    _11.sent();
                    return [2 /*return*/, { deny: NO_GATE_TOUCH() }];
                case 20:
                    _d = e.tool === 'Bash';
                    if (!_d) return [3 /*break*/, 22];
                    _e = [[String((_q = e.command) !== null && _q !== void 0 ? _q : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_r = e.command) !== null && _r !== void 0 ? _r : ''))];
                case 21:
                    _d = __spreadArray.apply(void 0, _e.concat([(_11.sent()), true])).some(movesRunner);
                    _11.label = 22;
                case 22:
                    if (!_d) return [3 /*break*/, 24];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " running a runner of the mod with another home or without Claude Code's mark"))];
                case 23:
                    _11.sent();
                    return [2 /*return*/, { deny: NO_RUNNER_MOVED }];
                case 24:
                    _f = e.agentId === undefined && !isOff && Boolean(dir);
                    if (!_f) return [3 /*break*/, 26];
                    return [4 /*yield*/, read($, me)];
                case 25:
                    _f = (_11.sent()).isChat;
                    _11.label = 26;
                case 26:
                    isRefusedHere = _f && !OWN.includes(e.tool) && !OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }) && !READS.includes(e.tool);
                    if (!(e.tool === 'Bash' && !isRefusedHere)) return [3 /*break*/, 38];
                    return [4 /*yield*/, gateAdmin($, e, raw)
                        // A call refused after a press (another of its commands denied, a grant not sealed) ends here: its note goes with it
                    ];
                case 27:
                    gated = _11.sent();
                    if (!gated.deny) return [3 /*break*/, 30];
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 28:
                    _11.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 29: return [2 /*return*/, (_11.sent(), { deny: gated.deny })];
                case 30:
                    grants = gated.grants;
                    return [4 /*yield*/, gateRelease($, e, raw)];
                case 31:
                    released = _11.sent();
                    if (!released.deny) return [3 /*break*/, 35];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 32:
                    _11.sent();
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 33:
                    _11.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 34:
                    _11.sent();
                    return [2 /*return*/, { deny: released.deny }];
                case 35:
                    grants = __spreadArray(__spreadArray([], grants, true), released.grants, true);
                    _g = [[String((_s = e.command) !== null && _s !== void 0 ? _s : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_t = e.command) !== null && _t !== void 0 ? _t : ''))];
                case 36:
                    if (!__spreadArray.apply(void 0, _g.concat([(_11.sent()), true])).some(function (text) { return /\bbin\/(?:admin|secret)\b/.test(text); })) return [3 /*break*/, 38];
                    _h = runnerBegun;
                    _j = [e.tool_use_id, String((_u = e.command) !== null && _u !== void 0 ? _u : '')];
                    return [4 /*yield*/, $.clock.now()];
                case 37:
                    _h.apply(void 0, _j.concat([_11.sent()]));
                    _11.label = 38;
                case 38:
                    if (!!isRefusedHere) return [3 /*break*/, 43];
                    return [4 /*yield*/, gateOwnFile($, e, raw)];
                case 39:
                    fileSaid = _11.sent();
                    if (!fileSaid) return [3 /*break*/, 43];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 40:
                    _11.sent();
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 41:
                    _11.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 42: return [2 /*return*/, (_11.sent(), { deny: fileSaid })];
                case 43:
                    woken = '';
                    next = function (call) { return __awaiter(_this, void 0, void 0, function () {
                        var r;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, run(call)];
                                case 1:
                                    r = _a.sent();
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === woken && one.answeredAt ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); })
                                        // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
                                    ];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, wakeCard($, woken)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, keepBackground($, e.agentId, call, r.result).catch(function (err) { return log($, "background work not followed: ".concat(String(err))); })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError && !call.run_in_background)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, keepDetached($, e.agentId, call, r.result).catch(function (err) { return log($, "detached work not followed: ".concat(String(err))); })];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9: return [4 /*yield*/, keysLearn($, call, r).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                                case 10:
                                    _a.sent();
                                    return [2 /*return*/, hideKept($, call, r)];
                            }
                        });
                    }); };
                    if (!(dir && !isOff && (e.tool === 'SendMessage' || e.tool === 'Agent'))) return [3 /*break*/, 46];
                    call = e;
                    resume = e.tool === 'SendMessage' ? String((_v = call.to) !== null && _v !== void 0 ? _v : '') : String((_w = call.resume) !== null && _w !== void 0 ? _w : '');
                    _k = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 44:
                    held_1 = _k.apply(void 0, [_11.sent(), (_x = e.agentId) !== null && _x !== void 0 ? _x : '', resume, String((_y = call.description) !== null && _y !== void 0 ? _y : ''), String((_z = call.prompt) !== null && _z !== void 0 ? _z : '')]);
                    if (!held_1) return [3 /*break*/, 46];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " that would set going again ").concat(held_1.id, ", which the person stopped"))];
                case 45:
                    _11.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_1))) }];
                case 46:
                    steered = '';
                    from = '';
                    answered = '';
                    message = '';
                    woke = '';
                    words = '';
                    isWhole = false;
                    if (!(dir && e.tool === 'SendMessage')) return [3 /*break*/, 52];
                    to_1 = String((_0 = e.to) !== null && _0 !== void 0 ? _0 : '');
                    message = String((_1 = e.message) !== null && _1 !== void 0 ? _1 : '');
                    theirs = e.agentId === undefined ? heard.findLast(function (one) { return carries(message, one); }) : undefined;
                    words = theirs ? quoted(theirs, 600) : '';
                    // Their words and nothing more: else only the words quoted are told as theirs, and the rest as the chat's
                    isWhole = Boolean(theirs) && isTheirsWhole(message, theirs !== null && theirs !== void 0 ? theirs : '');
                    return [4 /*yield*/, $.clock.now()];
                case 47:
                    now_1 = _11.sent();
                    return [4 /*yield*/, read($, todos)];
                case 48:
                    list = _11.sent();
                    target_1 = to_1 ? ((_2 = list.find(function (one) { return one.id === to_1; })) !== null && _2 !== void 0 ? _2 : list.find(function (one) { return to_1.startsWith(one.id); })) : undefined;
                    given = target_1 && e.agentId === undefined ? sentReplies.get(target_1.id) : undefined;
                    isRepeat = Boolean((given === null || given === void 0 ? void 0 : given.isCard) && (given.to === 'work' || given.to === 'read') && now_1 - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text));
                    if (!(given && target_1 && isRepeat && !(target_1.ask && target_1.ask.at > given.at))) return [3 /*break*/, 50];
                    return [4 /*yield*/, log($, "refused a second copy of an answer to ".concat(target_1.id))];
                case 49:
                    _11.sent();
                    return [2 /*return*/, { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }];
                case 50:
                    asking = target_1 && words && e.agentId === undefined ? ((_3 = list.find(function (one) { return one.id === target_1.id && one.ask; })) !== null && _3 !== void 0 ? _3 : list.find(function (one) { var _a; return ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.from) === target_1.id; })) : undefined;
                    asked_1 = (asking === null || asking === void 0 ? void 0 : asking.ask) ? "".concat(asking.id, ":").concat(asking.ask.at, ":").concat(asking.ask.text) : '';
                    if ((asking === null || asking === void 0 ? void 0 : asking.ask) && !answeredAsks.has(asked_1)) {
                        answeredAsks.add(asked_1);
                        answered = asking.ask.text;
                        answer = { card: asking, ask: asking.ask, key: asked_1, words: words, at: now_1 };
                    }
                    if (!target_1) return [3 /*break*/, 52];
                    woken = target_1.id;
                    isSteer_1 = target_1.status === 'working' && Boolean(words) && !answered;
                    if (target_1.status !== 'working' && words && !answered)
                        woke = words;
                    if (target_1.status === 'working' && message && !isSteer_1) {
                        sender = list.find(function (one) { return one.id === e.agentId; });
                        title = function (one) { return ((one === null || one === void 0 ? void 0 : one.title) ? " \"".concat(cut(oneLine(one.title), 60), "\"") : ''); };
                        from =
                            e.agentId === undefined
                                ? 'the chat'
                                : (sender === null || sender === void 0 ? void 0 : sender.parentId) === target_1.id
                                    ? "your helper".concat(title(sender))
                                    : target_1.parentId === e.agentId
                                        ? 'the work that started you'
                                        : "the work".concat(title(sender));
                    }
                    return [4 /*yield*/, changeTodos($, function (list) {
                            return list.map(function (one) {
                                var _a;
                                return one.id !== target_1.id
                                    ? one
                                    : __assign(__assign({}, one), { owes: isSteer_1 ? 0 : one.owes, entries: words && ((_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== words ? __spreadArray(__spreadArray([], one.entries, true), [{ at: now_1, kind: 'steer', text: words }], false).slice(-ENTRIES_KEPT) : one.entries });
                            });
                        })];
                case 51:
                    _11.sent();
                    if (isSteer_1 || from || answered || woke)
                        steered = target_1.id;
                    _11.label = 52;
                case 52:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 55];
                    id_1 = e.agentId;
                    // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
                    if (e.tool === 'Agent')
                        helperCalls.set(e.tool_use_id, id_1);
                    endedByHandback.delete(id_1);
                    stoppedHere.delete(id_1);
                    if (!dir) return [3 /*break*/, 55];
                    return [4 /*yield*/, $.clock.now()];
                case 53:
                    now_2 = _11.sent();
                    isKeeping_1 = isTool(e.tool, 'todo') || isTool(e.tool, 'note');
                    nudge_1 = '';
                    return [4 /*yield*/, changeTodos($, function (list) {
                            return list.map(function (one) {
                                var _a, _b;
                                if (one.id !== id_1)
                                    return one;
                                var base = __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now_2))), { steps: ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) + 1, answeredAt: undefined, waitsSince: undefined });
                                if (isKeeping_1)
                                    return __assign(__assign({}, base), { quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes });
                                var owes = one.owes === undefined ? undefined : one.owes + 1;
                                var quiet = ((_b = one.quiet) !== null && _b !== void 0 ? _b : 0) + 1;
                                var isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS;
                                nudge_1 = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : '';
                                return __assign(__assign({}, base), { owes: owes, quiet: isQuiet ? 0 : quiet });
                            });
                        })];
                case 54:
                    _11.sent();
                    if (nudge_1)
                        void tell($, id_1, nudge_1);
                    _11.label = 55;
                case 55:
                    if (!steered) return [3 /*break*/, 59];
                    return [4 /*yield*/, next(e)];
                case 56:
                    sent = _11.sent();
                    if (!answer) return [3 /*break*/, 58];
                    return [4 /*yield*/, answeredInChat($, answer, steered, !sent.deny && !sent.isError)
                        // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
                        // message of its own instead, read once it reaches it
                        // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
                        // chat's own note that landed after the person's words once marked their words as not theirs
                    ];
                case 57:
                    _11.sent();
                    _11.label = 58;
                case 58:
                    line_1 = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole));
                    if (!sent.deny)
                        void tell($, steered, line_1).then(function (r) { return (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line_1 }).catch(function (err) { return log($, "work ".concat(steered, " not told: ").concat(String(err))); }) : undefined); });
                    return [2 /*return*/, sent];
                case 59:
                    if (!(e.agentId !== undefined && String(e.tool) === 'SubagentHandback')) return [3 /*break*/, 62];
                    return [4 /*yield*/, holdAtStop($, e.agentId, 'handback').catch(function () { return ''; })];
                case 60:
                    hold = _11.sent();
                    if (hold)
                        return [2 /*return*/, { deny: hold }];
                    return [4 /*yield*/, next(e)];
                case 61:
                    r = _11.sent();
                    if (!r.deny && !r.isError)
                        handedBack.set(e.agentId, String((_4 = e.message) !== null && _4 !== void 0 ? _4 : '').trim());
                    return [2 /*return*/, r];
                case 62:
                    askedModel = !isOff && e.tool === 'Agent' && e.subagent_type !== 'fork' ? String((_5 = e.model) !== null && _5 !== void 0 ? _5 : '') : '';
                    better = askedModel ? rightModel(askedModel) : undefined;
                    if (!better) return [3 /*break*/, 64];
                    alias = ((_6 = modelName(better).split(' ')[0]) !== null && _6 !== void 0 ? _6 : '').toLowerCase();
                    return [4 /*yield*/, log($, "an Agent call on ".concat(modelName(askedModel), " starts on ").concat(modelName(better)))];
                case 63:
                    _11.sent();
                    return [2 /*return*/, next(__assign(__assign({}, e), { model: alias }))];
                case 64:
                    if (e.agentId !== undefined)
                        return [2 /*return*/, next(e)];
                    _l = isOff;
                    if (_l) return [3 /*break*/, 66];
                    return [4 /*yield*/, read($, me)];
                case 65:
                    _l = !(_11.sent()).isChat;
                    _11.label = 66;
                case 66:
                    if (_l)
                        return [2 /*return*/, next(e)
                            // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
                        ];
                    if (!(e.tool === 'Agent')) return [3 /*break*/, 68];
                    call = e;
                    if (!(call.subagent_type === 'fork' || !String((_7 = call.model) !== null && _7 !== void 0 ? _7 : '').trim())) return [3 /*break*/, 68];
                    return [4 /*yield*/, log($, "refused an Agent call ".concat(call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'))];
                case 67:
                    _11.sent();
                    return [2 /*return*/, { deny: NO_COPY() }];
                case 68:
                    if (!(e.tool === 'TaskStop' && dir)) return [3 /*break*/, 77];
                    return [4 /*yield*/, next(e)];
                case 69:
                    r = _11.sent();
                    stopId_1 = String((_8 = e.task_id) !== null && _8 !== void 0 ? _8 : '');
                    if (!(!r.deny && stopId_1)) return [3 /*break*/, 76];
                    stoppedHere.add(stopId_1);
                    return [4 /*yield*/, stopHelpers($, stopId_1)];
                case 70:
                    _11.sent();
                    return [4 /*yield*/, dropBackground($, [stopId_1], 'stopped')];
                case 71:
                    _11.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 72:
                    now_3 = _11.sent();
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === stopId_1 && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now_3) : one.id === stopId_1 && one.leftSince ? __assign(__assign({}, one), { leftSince: undefined }) : one); }); })];
                case 73:
                    _11.sent();
                    return [4 /*yield*/, keepStoppedReports($, now_3)];
                case 74:
                    _11.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 75:
                    _11.sent();
                    _11.label = 76;
                case 76: return [2 /*return*/, r];
                case 77:
                    if (OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }))
                        return [2 /*return*/, next(e)
                            // The chat reads for itself: a kept report to answer from, or the few files a question needs. A saved paste stays out of it:
                            // the agent that needs it reads it
                        ];
                    readPath = String((_10 = (_9 = e.file_path) !== null && _9 !== void 0 ? _9 : e.path) !== null && _10 !== void 0 ? _10 : '');
                    isPaste = Boolean(dir) && (readPath === "".concat(dir, "/pastes") || readPath.startsWith("".concat(dir, "/pastes/")));
                    if (READS.includes(e.tool) && !isPaste)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " in a chat's own thread"))];
                case 78:
                    _11.sent();
                    if (!grants.length) return [3 /*break*/, 80];
                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })];
                case 79:
                    _11.sent();
                    _11.label = 80;
                case 80: return [2 /*return*/, { deny: REFUSED }];
            }
        });
    }); });
    // How full this chat's context is, as the app counts it, each time it moves
    on('session.measure', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!wakes.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    tokens = e.context.tokens;
                    if (!(tokens !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, update($, me, function (one) { return (one.tokens === tokens && one.window ? one : __assign(__assign({}, one), { tokens: tokens, window: one.window || e.context.window })); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // How full a piece of work's context is, and which model it runs on: what the API reports when a response of its ends.
    // The response itself passes through untouched and unread; only the count and the model's name are kept
    // Work the person moved to another model sends each step from then on to that model; only the model the request names changes
    on('turn.step', function ($, e, next) {
        return __asyncGenerator(this, arguments, function () {
            var id, _a, chosen, _b, card, _c, own, isOwnOlder, isMovedByApp, n, text, call, instead, moved, _d, pick, to, r, tokens, model;
            var _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        id = e.agentId;
                        if (id !== undefined)
                            replyRead($, id);
                        _a = id !== undefined && dir;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 1:
                        _a = (_k.sent()).some(function (one) { return one.id === id && one.answeredAt; });
                        _k.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); }))];
                    case 3:
                        _k.sent();
                        _k.label = 4;
                    case 4:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 5:
                        _b = (_e = (_k.sent()).find(function (one) { return one.id === id; })) === null || _e === void 0 ? void 0 : _e.chosen;
                        return [3 /*break*/, 7];
                    case 6:
                        _b = undefined;
                        _k.label = 7;
                    case 7:
                        chosen = _b;
                        if (!(id !== undefined && dir)) return [3 /*break*/, 9];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 8:
                        _c = (_k.sent()).find(function (one) { return one.id === id; });
                        return [3 /*break*/, 10];
                    case 9:
                        _c = undefined;
                        _k.label = 10;
                    case 10:
                        card = _c;
                        own = id !== undefined ? ((_f = startedOn.get(id)) !== null && _f !== void 0 ? _f : card === null || card === void 0 ? void 0 : card.startedOn) : undefined;
                        isOwnOlder = id !== undefined && !flaggedOnce.has(id) && !(card === null || card === void 0 ? void 0 : card.flagged) && own !== undefined && Boolean(rightModel(own)) && modelName(own) === modelName(e.model);
                        isMovedByApp = id !== undefined && !isOff && Boolean(rightModel(e.model)) && !isOwnOlder;
                        if (!(isMovedByApp && own !== undefined && id !== undefined)) return [3 /*break*/, 29];
                        n = ((_g = flaggedSteps.get(id)) !== null && _g !== void 0 ? _g : 0) + 1;
                        flaggedSteps.set(id, n);
                        flaggedOnce.add(id);
                        if (!(n === 1)) return [3 /*break*/, 12];
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was flagged and the app would send it to ").concat(modelName(e.model), ": it is ended with a report instead")))];
                    case 11:
                        _k.sent();
                        _k.label = 12;
                    case 12:
                        if (!dir) return [3 /*break*/, 15];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { flagged: modelName(e.model), moved: undefined }) : one); }); }))];
                    case 13:
                        _k.sent();
                        return [4 /*yield*/, __await(stopHelpers($, id).catch(function () { return undefined; }))];
                    case 14:
                        _k.sent();
                        _k.label = 15;
                    case 15:
                        // Its report goes back through the handback tool; where that does not end it, a plain last answer, and past a few the work is
                        // stopped as a press on Stop would
                        if (n > 3)
                            void $.tool.call({ tool: 'TaskStop', task_id: id }).catch(function () { return undefined; });
                        text = FLAGGED(e.model);
                        if (!(n === 1)) return [3 /*break*/, 23];
                        call = "toolu_flagged_".concat(id);
                        return [4 /*yield*/, __await({ kind: 'tool', index: 0, id: call, name: 'SubagentHandback' })];
                    case 16: return [4 /*yield*/, _k.sent()];
                    case 17:
                        _k.sent();
                        return [4 /*yield*/, __await({ kind: 'input', index: 0, json: JSON.stringify({ message: text }) })];
                    case 18: return [4 /*yield*/, _k.sent()];
                    case 19:
                        _k.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'tool_use', usage: null })];
                    case 20: return [4 /*yield*/, _k.sent()];
                    case 21:
                        _k.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: '', toolUses: [{ name: 'SubagentHandback', input: { message: text } }], stopReason: 'tool_use', usage: null })];
                    case 22: return [2 /*return*/, _k.sent()];
                    case 23: return [4 /*yield*/, __await({ kind: 'text', index: 0, text: text })];
                    case 24: return [4 /*yield*/, _k.sent()];
                    case 25:
                        _k.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 26: return [4 /*yield*/, _k.sent()];
                    case 27:
                        _k.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: text, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 28: return [2 /*return*/, _k.sent()];
                    case 29:
                        instead = id !== undefined && !isOff && !isMovedByApp && !chosen ? rightModel(e.model) : undefined;
                        if (!(id !== undefined && (isMovedByApp || instead) && !sentElsewhere.has("".concat(id, " ").concat(e.model)))) return [3 /*break*/, 31];
                        sentElsewhere.add("".concat(id, " ").concat(e.model));
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was sent to ").concat(modelName(e.model), " by the app: ").concat(instead ? "its steps go to ".concat(modelName(instead)) : 'its steps stay there')))];
                    case 30:
                        _k.sent();
                        _k.label = 31;
                    case 31:
                        moved = isMovedByApp ? modelName(e.model) : undefined;
                        _d = id !== undefined && dir;
                        if (!_d) return [3 /*break*/, 33];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 32:
                        _d = (_k.sent()).some(function (one) { return one.id === id && one.moved !== moved; });
                        _k.label = 33;
                    case 33:
                        if (!_d) return [3 /*break*/, 35];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { moved: moved }) : one); }); })
                            // A pick the engine has since passed is its family's newest
                            )];
                    case 34:
                        _k.sent();
                        _k.label = 35;
                    case 35:
                        pick = chosen ? ((_h = rightModel(chosen)) !== null && _h !== void 0 ? _h : chosen) : undefined;
                        to = pick && !isMovedByApp && modelName(pick) !== modelName(e.model) ? pick : instead;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(next(to ? __assign(__assign({}, e), { model: to }) : e))))];
                    case 36: return [4 /*yield*/, __await.apply(void 0, [_k.sent()])];
                    case 37:
                        r = _k.sent();
                        tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0;
                        model = (_j = r.usage) === null || _j === void 0 ? void 0 : _j.model;
                        if (model)
                            seeModel(model);
                        if (!(id !== undefined && tokens && flowAgents.has(id))) return [3 /*break*/, 39];
                        return [4 /*yield*/, __await(flowStep($, id, tokens, model).catch(function () { return undefined; }))];
                    case 38:
                        _k.sent();
                        _k.label = 39;
                    case 39:
                        if (!(id !== undefined && tokens && dir)) return [3 /*break*/, 41];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { var _a; return (one.id === id ? __assign(__assign({}, one), { tokens: tokens, model: (_a = one.chosen) !== null && _a !== void 0 ? _a : (modelName(model !== null && model !== void 0 ? model : '') ? model : one.model) }) : one); }); }))];
                    case 40:
                        _k.sent();
                        _k.label = 41;
                    case 41: return [4 /*yield*/, __await(r)];
                    case 42: return [2 /*return*/, _k.sent()];
                }
            });
        });
    });
    // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
    on('classic.SubagentStop', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, hold, _a, live, ids_1, gone;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _d.sent();
                    if (!r.block) return [3 /*break*/, 2];
                    _a = '';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, holdAtStop($, e.agent_id, 'stop').catch(function () { return ''; })];
                case 3:
                    _a = _d.sent();
                    _d.label = 4;
                case 4:
                    hold = _a;
                    if (hold)
                        return [2 /*return*/, __assign(__assign({}, r), { block: hold })];
                    live = e.background_tasks;
                    if (!(dir && Array.isArray(live))) return [3 /*break*/, 7];
                    ids_1 = new Set(live.map(function (one) { return one.id; }));
                    return [4 /*yield*/, read($, todos)];
                case 5:
                    gone = ((_c = (_b = (_d.sent()).find(function (one) { return one.id === e.agent_id; })) === null || _b === void 0 ? void 0 : _b.bg) !== null && _c !== void 0 ? _c : []).filter(function (b) { return !ids_1.has(b.id); }).map(function (b) { return b.id; });
                    if (!gone.length) return [3 /*break*/, 7];
                    return [4 /*yield*/, dropBackground($, gone).catch(function (err) { return log($, "ended background work not let go: ".concat(String(err))); })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [2 /*return*/, r];
            }
        });
    }); });
    on('agent.spawn', function ($, asked, next) { return __awaiter(_this, void 0, void 0, function () {
        var held_2, _a, start, e, r_1, parentId, isOwn, isTold, _b, work, _c, _d, _e, words, _f, _g, _h, isBackground, r, id, now, named1, _j, goesOn, from;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    agentStarted($, asked.tool_use_id);
                    if (!(dir && !isOff && !asked.workflow)) return [3 /*break*/, 3];
                    _a = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    held_2 = _a.apply(void 0, [_y.sent(), (_l = (_k = asked.parentAgentId) !== null && _k !== void 0 ? _k : helperCalls.get(asked.tool_use_id)) !== null && _l !== void 0 ? _l : '', (_o = (_m = asked.resume) === null || _m === void 0 ? void 0 : _m.agentId) !== null && _o !== void 0 ? _o : '', (_p = asked.description) !== null && _p !== void 0 ? _p : '', asked.resume ? '' : ((_q = asked.prompt) !== null && _q !== void 0 ? _q : '')]);
                    if (!held_2) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused to start again ".concat(held_2.id, ", which the person stopped"))];
                case 2:
                    _y.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_2))) }];
                case 3:
                    start = isOff || asked.resume ? undefined : startModel(asked);
                    if (!(start === null || start === void 0 ? void 0 : start.deny)) return [3 /*break*/, 5];
                    return [4 /*yield*/, log($, "refused a copy of an agent on ".concat(modelName(String((_r = asked.parentModel) !== null && _r !== void 0 ? _r : ''))))];
                case 4:
                    _y.sent();
                    return [2 /*return*/, { deny: start.deny }];
                case 5:
                    if (!(start === null || start === void 0 ? void 0 : start.model)) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, "".concat(asked.workflow ? 'a workflow agent' : 'an agent', " asked to run on ").concat(modelName((_s = asked.model) !== null && _s !== void 0 ? _s : '') || "its parent's ".concat(modelName(String((_t = asked.parentModel) !== null && _t !== void 0 ? _t : '')) || 'model'), " starts on ").concat(modelName(start.model)))];
                case 6:
                    _y.sent();
                    _y.label = 7;
                case 7:
                    e = (start === null || start === void 0 ? void 0 : start.model) ? __assign(__assign({}, asked), { model: start.model }) : asked;
                    if (!e.workflow) return [3 /*break*/, 11];
                    return [4 /*yield*/, next(e)];
                case 8:
                    r_1 = _y.sent();
                    if (r_1.model)
                        seeModel(r_1.model);
                    if (r_1.agentId && r_1.model && !e.resume)
                        startedOn.set(r_1.agentId, r_1.model);
                    if (!(r_1.agentId && dir)) return [3 /*break*/, 10];
                    return [4 /*yield*/, flowSpawned($, e.workflow.runId, r_1.agentId, modelName((_u = r_1.model) !== null && _u !== void 0 ? _u : '') ? r_1.model : e.model || r_1.model || '', (_v = e.description) !== null && _v !== void 0 ? _v : '').catch(function (err) { return log($, "workflow agent not kept: ".concat(String(err))); })];
                case 9:
                    _y.sent();
                    _y.label = 10;
                case 10: return [2 /*return*/, r_1];
                case 11:
                    parentId = (_x = (_w = e.parentAgentId) !== null && _w !== void 0 ? _w : helperCalls.get(e.tool_use_id)) !== null && _x !== void 0 ? _x : '';
                    isOwn = !parentId;
                    _b = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow;
                    if (!_b) return [3 /*break*/, 13];
                    return [4 /*yield*/, read($, me)];
                case 12:
                    _b = (_y.sent()).isChat;
                    _y.label = 13;
                case 13:
                    isTold = _b;
                    if (!isTold) return [3 /*break*/, 15];
                    _d = named;
                    _e = fillModels;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/work.md')];
                case 14:
                    _c = _d.apply(void 0, [_e.apply(void 0, [(_y.sent()).text, models])]).replace(/\{admin\}/g, "".concat($.plugin.root, "/bin/admin")).replace(/\{secret\}/g, "".concat($.plugin.root, "/bin/secret")).replace(/\{release\}/g, "".concat($.plugin.root, "/bin/release")).trim();
                    return [3 /*break*/, 16];
                case 15:
                    _c = '';
                    _y.label = 16;
                case 16:
                    work = _c;
                    if (!isTold) return [3 /*break*/, 18];
                    _h = (_g = "- The chat's saved words, ".concat(who(), "'s messages word for word: ").concat(dir, "/words/")).concat;
                    return [4 /*yield*/, read($, me)];
                case 17:
                    _f = _h.apply(_g, [(_y.sent()).id, ".md"]);
                    return [3 /*break*/, 19];
                case 18:
                    _f = '';
                    _y.label = 19;
                case 19:
                    words = _f;
                    isBackground = isHelperSpawn(e);
                    return [4 /*yield*/, next(isTold ? __assign(__assign({}, e), { prompt: "".concat(e.prompt, "\n\n").concat(workHead(), "\n").concat(words, "\n").concat(work, "\n\n").concat(named(PANEL_RULE)) }) : isBackground ? __assign(__assign({}, e), { background: true }) : e)];
                case 20:
                    r = _y.sent();
                    if (!(isBackground && r.agentId)) return [3 /*break*/, 22];
                    return [4 /*yield*/, log($, "helper ".concat(r.agentId, " of ").concat(e.parentAgentId, " runs in the background"))];
                case 21:
                    _y.sent();
                    _y.label = 22;
                case 22:
                    if (r.model)
                        seeModel(r.model);
                    // A resumed agent keeps the model it first started on, or none: the model it resumes on may be one the app moved it to after a flag. A
                    // flagged one goes on to its next report afresh
                    if (r.agentId && r.model && !e.resume)
                        startedOn.set(r.agentId, r.model);
                    if (r.agentId && e.resume)
                        flaggedSteps.delete(r.agentId);
                    if (!dir || !r.agentId)
                        return [2 /*return*/, r];
                    id = r.agentId;
                    endedByHandback.delete(id);
                    return [4 /*yield*/, $.clock.now()
                        // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
                        // several, or one on something else, only reads them
                    ];
                case 23:
                    now = _y.sent();
                    if (!(isOwn && !fromReport && !e.resume)) return [3 /*break*/, 25];
                    return [4 /*yield*/, read($, reports)];
                case 24:
                    _j = (_y.sent()).filter(function (one) { return e.prompt.includes("reports/".concat(one.id, "/")) || e.prompt.endsWith("reports/".concat(one.id)); });
                    return [3 /*break*/, 26];
                case 25:
                    _j = [];
                    _y.label = 26;
                case 26:
                    named1 = _j;
                    goesOn = named1.length === 1 && named1[0] && __spreadArray([], aboutWords(named1[0].title), true).some(function (word) { var _a; return aboutWords((_a = e.description) !== null && _a !== void 0 ? _a : '').has(word); }) ? named1[0].id : '';
                    from = fromReport || goesOn;
                    return [4 /*yield*/, changeTodos($, function (list) {
                            var _a, _b, _c;
                            var old = list.find(function (one) { return one.id === id; });
                            // Its title is the few words the task was given; under it, the person's message as they wrote it
                            var fresh = __assign(__assign({}, started(id, parentId, (_a = e.description) !== null && _a !== void 0 ? _a : '', isOwn ? said : '', now, e.fork)), (isOwn && from ? { from: from } : {}));
                            return capped(__spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== id; }), true), [__assign(__assign({}, (old ? resumed(old, now) : fresh)), { model: (_b = old === null || old === void 0 ? void 0 : old.chosen) !== null && _b !== void 0 ? _b : r.model, startedOn: (_c = old === null || old === void 0 ? void 0 : old.startedOn) !== null && _c !== void 0 ? _c : (e.resume ? undefined : r.model) })], false));
                        })];
                case 27:
                    _y.sent();
                    if (!isOwn) return [3 /*break*/, 29];
                    return [4 /*yield*/, openList($)];
                case 28:
                    _y.sent();
                    _y.label = 29;
                case 29:
                    if (!!isOwn) return [3 /*break*/, 31];
                    return [4 /*yield*/, writeRolls($, true).catch(function (err) { return log($, "helpers not written: ".concat(String(err))); })];
                case 30:
                    _y.sent();
                    _y.label = 31;
                case 31: return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 32:
                    _y.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
