// The chat's process: what is at work is kept beside it, so a card found at work after the process was replaced says that the app
// closed while it worked; and the watcher that brings Claudopus back should Claude switch it off
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
// keep/<chat>.json: the chat's process and what is at work in it, kept true as the cards change
var keepFile = function (id, kind) {
    if (kind === void 0) { kind = 'json'; }
    return "".concat(dir, "/keep/").concat(id, ".").concat(kind);
};
var keepSign = '';
// The chat's own process, which runs the mod's commands: a load in the same process is a reload of the mod, which ends nothing
var enginePid = '';
var pidOfEngine = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, $.process.run(['/bin/sh', '-c', 'echo $PPID']).catch(function () { return undefined; })];
        case 1: return [2 /*return*/, ((_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.stdout) !== null && _b !== void 0 ? _b : '').trim()];
    }
}); }); };
var saveKeep = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, list, atWork, titles, sign, _a, _b, _c, _d, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_g.sent()).id;
                if (!id || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _g.sent();
                atWork = list.filter(function (one) { return !one.chat && one.status === 'working'; });
                titles = Object.fromEntries(atWork.filter(function (one) { return !one.parentId; }).map(function (one) { return [one.id, oneLine(one.title).slice(0, 200)]; }));
                sign = "".concat(atWork.map(function (one) { return one.id; }).join(','), "|").concat(Object.values(titles).join('|'));
                if (sign === keepSign)
                    return [2 /*return*/];
                keepSign = sign;
                _b = (_a = $.fs).write;
                _c = [keepFile(id)];
                _e = (_d = JSON).stringify;
                _f = { ids: atWork.map(function (one) { return one.id; }), titles: titles, pid: enginePid };
                return [4 /*yield*/, $.clock.now()];
            case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([_e.apply(_d, [(_f.at = _g.sent(), _f)])]))];
            case 4:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
var parsedOr = function (text, or) {
    try {
        return text ? JSON.parse(text) : or;
    }
    catch (_a) {
        return or;
    }
};
// As the chat starts: a command lasts only while the app is open, so what was at work when the chat's process was replaced (the app
// quit, restarted or dropped the chat) ended with it. Its card says so, Failed with why, and nothing starts it again by itself:
// the person's Start again does. What Claude Code itself runs again in the new process is at work
var noteClosed = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var was, _a, wasPid, isId, titles, live, isLive, now, closed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                keepSign = '';
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, pidOfEngine($)];
            case 1:
                enginePid = _b.sent();
                _a = parsedOr;
                return [4 /*yield*/, readOr($, keepFile(id))];
            case 2:
                was = _a.apply(void 0, [_b.sent(), {}]);
                wasPid = typeof was.pid === 'string' ? was.pid : '';
                if (!/^\d+$/.test(wasPid) || !/^\d+$/.test(enginePid) || wasPid === enginePid)
                    return [2 /*return*/];
                isId = function (one) { return typeof one === 'string' && /^[\w-]{1,80}$/.test(one); };
                titles = Object.fromEntries(Object.entries(was.titles && typeof was.titles === 'object' ? was.titles : {}).filter(function (pair) { return isId(pair[0]) && typeof pair[1] === 'string'; }));
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 3:
                live = _b.sent();
                isLive = function (one) { return live.some(function (agent) { return agent.id === one && WORKING.includes(agent.status); }); };
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _b.sent();
                closed = [];
                return [4 /*yield*/, changeTodos($, function (list) {
                        closed.length = 0;
                        var known = new Set(list.map(function (one) { return one.id; }));
                        var added = Object.keys(titles).filter(function (one) { return !known.has(one) && !isLive(one); }).map(function (one) { var _a; return started(one, '', (_a = titles[one]) !== null && _a !== void 0 ? _a : '', '', now); });
                        return __spreadArray(__spreadArray([], list, true), added, true).map(function (one) { return (one.chat || one.status !== 'working' || isLive(one.id) ? one : (closed.push(one.id), __assign(__assign({}, ended(one, 'failed', now)), { why: WHY_APP_CLOSED, bg: undefined }))); });
                    })];
            case 5:
                _b.sent();
                if (!closed.length) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "the chat's process was replaced (".concat(wasPid, " to ").concat(enginePid, ") while work was at work: ").concat(closed.join(', '), " ended with it"))];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
// ---- Back by itself after Claude switches it off ----
// Claude's engine switches off an add-on that held its shared helper for five seconds, and that chat has no Claudopus until the
// person types /reload-plugins. The engine loads an add-on again by itself when one of its own settings changes, so each chat's
// load writes its beat, keep/<chat>.beat naming the chat's process, every BEAT_EVERY, and starts bin/revive, one on the Mac at a
// time, which changes the setting "revived" (plugin.json's userConfig) when a beat goes quiet while its process still runs.
// Changed, it loads Claudopus again in every chat, as an update does
var BEAT_EVERY = 3000;
var beatFile = function (id) { return "".concat(dir, "/keep/").concat(id, ".beat"); };
var configDir = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; var _c; return __generator(this, function (_d) {
    switch (_d.label) {
        case 0: return [4 /*yield*/, $.env.get('CLAUDE_CONFIG_DIR')];
        case 1:
            _a = (_d.sent());
            if (_a) return [3 /*break*/, 3];
            _b = "".concat;
            return [4 /*yield*/, $.env.get('HOME')];
        case 2:
            _a = _b.apply("", [(_c = (_d.sent())) !== null && _c !== void 0 ? _c : '', "/.claude"]);
            _d.label = 3;
        case 3: return [2 /*return*/, _a];
    }
}); }); };
// The key this copy has in the settings: claudopus@<marketplace> for an installed one, whether Claude Code keeps it in its cache or
// loads it from the marketplace's own folder (a marketplace of a folder on this Mac, as Claudopus's own checkout); claudopus@inline
// for one loaded with --plugin-dir. On 16 Nov this Mac's chats ran from the checkout, and claudopus@inline would have changed nothing
var ownKey = function ($, configDir) { return __awaiter(_this, void 0, void 0, function () {
    var market, known, _a, name;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                market = (_b = /\/plugins\/cache\/([^/]+)\/claudopus\//.exec($.plugin.root)) === null || _b === void 0 ? void 0 : _b[1];
                if (market && /^[\w.-]+$/.test(market))
                    return [2 /*return*/, "claudopus@".concat(market)];
                _a = parsedOr;
                return [4 /*yield*/, readOr($, "".concat(configDir, "/plugins/known_marketplaces.json"))];
            case 1:
                known = _a.apply(void 0, [_d.sent(), {}]);
                name = (_c = Object.entries(known).find(function (_a) {
                    var one = _a[1];
                    return typeof (one === null || one === void 0 ? void 0 : one.installLocation) === 'string' && one.installLocation && ($.plugin.root === one.installLocation || $.plugin.root.startsWith("".concat(one.installLocation.replace(/\/$/, ''), "/")));
                })) === null || _c === void 0 ? void 0 : _c[0];
                return [2 /*return*/, name && /^[\w.-]+$/.test(name) ? "claudopus@".concat(name) : 'claudopus@inline'];
        }
    });
}); };
var beatLine = '';
var beat = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var proof, _a, said_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!dir || !beatLine || isEnded)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write(beatFile(id), beatLine)
                    // The proof that it comes back, for someone who wants to see it: keep/<chat>.hold-test holding this chat's process number, written
                    // by hand, makes this chat's Claudopus hold Claude's helper long enough to be switched off, once, in the next drawing of its panel
                    // or the next message: the engine switches off only an add-on that holds the helper while one of its hooks is answering, not in a
                    // timer of its own (16 Nov trial). It is taken away whatever it holds
                ];
            case 1:
                _b.sent();
                proof = "".concat(dir, "/keep/").concat(id, ".hold-test");
                _a = !isHoldTestDue;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, $.fs.exists(proof)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                if (!_a) return [3 /*break*/, 6];
                return [4 /*yield*/, readOr($, proof)];
            case 4:
                said_1 = (_b.sent()).trim();
                return [4 /*yield*/, $.process.run(['rm', '-f', proof])];
            case 5:
                _b.sent();
                if (said_1 !== enginePid)
                    return [2 /*return*/, void log($, "a hold-test file that did not name this chat's process was taken away")];
                isHoldTestDue = true;
                $.ui.invalidate('ui.render');
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var isHoldTestDue = false;
var holdTest = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isHoldTestDue)
                    return [2 /*return*/];
                isHoldTestDue = false;
                return [4 /*yield*/, log($, "holding Claude's helper on purpose, as keep/<chat>.hold-test asked")];
            case 1:
                _a.sent();
                end = Date.now() + 10000;
                while (Date.now() < end)
                    Math.sqrt(Date.now());
                return [2 /*return*/];
        }
    });
}); };
var startReviver = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var back, backAt, _a, config, settings, _b, _c, script, r;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir || !SAFE_CHAT.test(id))
                    return [2 /*return*/];
                if (!!enginePid) return [3 /*break*/, 2];
                return [4 /*yield*/, pidOfEngine($)];
            case 1:
                enginePid = _h.sent();
                _h.label = 2;
            case 2:
                if (!/^\d+$/.test(enginePid))
                    return [2 /*return*/];
                return [4 /*yield*/, readOr($, "".concat(dir, "/keep/").concat(id, ".revived"))];
            case 3:
                back = (_e = (_d = (_h.sent()).trim().split('\n').at(-1)) === null || _d === void 0 ? void 0 : _d.split(' ')) !== null && _e !== void 0 ? _e : [];
                backAt = Number((_f = back[0]) !== null && _f !== void 0 ? _f : 0) * 1000;
                _a = backAt;
                if (!_a) return [3 /*break*/, 5];
                return [4 /*yield*/, $.clock.now()];
            case 4:
                _a = (_h.sent()) - backAt < 120000;
                _h.label = 5;
            case 5:
                if (!_a) return [3 /*break*/, 7];
                return [4 /*yield*/, log($, "back after Claude switched Claudopus off in this chat (its beat was quiet ".concat((_g = back[1]) !== null && _g !== void 0 ? _g : '?', " s)"))];
            case 6:
                _h.sent();
                _h.label = 7;
            case 7: return [4 /*yield*/, configDir($)];
            case 8:
                config = _h.sent();
                settings = "".concat(config, "/settings.json");
                if (/[\t\n]/.test(settings))
                    return [2 /*return*/];
                _c = (_b = "".concat(enginePid, "\t")).concat;
                return [4 /*yield*/, ownKey($, config)];
            case 9:
                // and, on a line of its own, the load that writes it: one that beats again after the watcher's change was never off, only slow
                // (bin/revive; a watcher of an older version reads the first line as before)
                beatLine = _c.apply(_b, [_h.sent(), "\t"]).concat(settings, "\n").concat(thisLoad, "\n");
                return [4 /*yield*/, beat($, id)];
            case 10:
                _h.sent();
                everyLoad($, BEAT_EVERY, function () { return beat($, id).catch(function () { return undefined; }); });
                script = "nohup /usr/bin/perl -MPOSIX -e 'POSIX::setsid(); exec @ARGV' \"$1\" \"$2\" >/dev/null 2>&1 </dev/null &";
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', script, 'sh', "".concat($.plugin.root, "/bin/revive"), dir]).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 11:
                r = _h.sent();
                if (!(r.exitCode !== 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, log($, "the watcher that brings Claudopus back was not started: ".concat(r.stderr.slice(0, 200)))];
            case 12:
                _h.sent();
                _h.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
// A chat that ends leaves no beat behind
var endBeat = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                beatLine = '';
                if (!(dir && SAFE_CHAT.test(id) && enginePid)) return [3 /*break*/, 3];
                _b = (_a = $.fs).write;
                _c = ["".concat(dir, "/keep/").concat(id, ".ended")];
                _e = (_d = "".concat(enginePid, "\t")).concat;
                _g = (_f = Math).round;
                return [4 /*yield*/, $.clock.now()];
            case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_e.apply(_d, [_g.apply(_f, [_h.sent()]), "\n"])])).catch(function () { return undefined; })];
            case 2:
                _h.sent();
                _h.label = 3;
            case 3:
                if (!(dir && SAFE_CHAT.test(id))) return [3 /*break*/, 5];
                return [4 /*yield*/, $.process.run(['rm', '-f', beatFile(id)]).catch(function () { return undefined; })];
            case 4:
                _h.sent();
                _h.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var SAFE_CHAT = /^[A-Za-z0-9-]{1,80}$/;
var REVIVED_KEY = 'claudopus.revived';
