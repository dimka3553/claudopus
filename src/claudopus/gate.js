// The admin gate: an admin command (bin/admin) waits for the person's press on its work's card before it runs
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
var GATE_SERVICE = 'claudopus-admin-gate';
// The gates this copy of the mod holds a call for, and what was pressed for each: both only in memory
var gateHeld = new Set();
// What each held gate's wait ends with: the press on its block, or 'gone' as its call was aborted or this copy replaced
var gateWaits = new Map();
// A hook has ten seconds of its own time, and only time spent in a call on the engine is not counted: so while a hook waits for a
// press, one sleep run by the engine is in flight, and the wait itself is the promise the press resolves, raced with it. The press
// ends the wait at once; the sleep only keeps the clock stopped, and is started again each HELD_STEP while nothing is pressed
var HELD_STEP = 60;
var heldStep = function ($) { return $.process.run(['/bin/sleep', String(HELD_STEP)], { timeoutMs: (HELD_STEP + 10) * 1000 }).then(function () { return undefined; }, function () { return undefined; }); };
// A gate of the chat's own thread, which has no card (a chat that does its own work): drawn at the top of the panel
var looseGates = [];
// The pieces of work allowed under "work", by card: taken out as the work ends (ended, in cards), so one that comes back asks again
var workAllowed = new Set();
var GATE_DENIED = function (gate) {
    return named("Refused by {name}: {name} pressed Don't allow on this ".concat((gate === null || gate === void 0 ? void 0 : gate.kind) === 'release' ? "release, so nothing was released. Don't try to release it another way" : (gate === null || gate === void 0 ? void 0 : gate.kind) === 'file' ? "change, so the file was not changed. Don't try to change it another way" : "admin command, so it didn't run. Don't try to run it another way", ". Continue without it, or say what it is needed for and ask again."));
};
var gateThing = function (gate) { return ((gate === null || gate === void 0 ? void 0 : gate.kind) === 'release' ? 'This release did not run' : (gate === null || gate === void 0 ? void 0 : gate.kind) === 'file' ? 'This change was not made' : 'This admin command did not run'); };
var GATE_GONE = function (gate) { return named("".concat(gateThing(gate), ": the wait for {name} to allow it was interrupted. Run it again if it is still needed.")); };
var GATE_LATE = function (gate) { return named("".concat(gateThing(gate), ": {name} didn't answer in time. Run it again when it is needed, and Claudopus will ask {name} again.")); };
var GATE_BLIND = function (gate) { return named("".concat(gateThing(gate), ": Claudopus asks {name} first, on a card in its panel, and this chat has no panel open.")); };
var GATE_UNSEALED = function () { return "This admin command did not run: Claudopus could not secure what was allowed in ".concat(keptWhere(), ". Run it again."); };
var NO_GATE_TOUCH = function () {
    return named('Claude never reads or writes the list of admin commands {name} always allows, what {name} allowed, or the key that locks them. Only {name} adds to them, with a press on a card or in Config.');
};
// What a gate asks, in words, by its kind: the act, for a notification, and the one amber line of its block
var gateAct = function (gate) {
    return gate.isUndone ? "Make the change to ".concat(gate.host, " again") : gate.kind === 'release' ? "Release ".concat(gate.host, " to main") : gate.kind === 'file' ? "Change ".concat(gate.host) : "Run an admin command on ".concat(gate.host === 'here' ? thisMac() : gate.host);
};
var gateWhat = function (gate) {
    return gate.isUndone ? "Make the change to ".concat(gate.host, " again?") : gate.kind === 'release' ? "Release ".concat(gate.branch || gate.host, " to main?") : gate.kind === 'file' ? "Change ".concat(gate.host, "?") : "Run this as admin on ".concat(gate.host === 'here' ? 'this Mac' : gate.host, "?");
};
// The admin commands a Bash command runs, as the shell splits it: bin/admin by any spelling of its path, after what runs a
// command it is handed, and inside a shell's -c or an eval. What the shell would build (a variable, a substitution) is read as
// written, so the grant names what was shown and bin/admin refuses what differs
var isAdminPath = function (word, root, name) {
    if (name === void 0) { name = 'admin'; }
    var parts = [];
    for (var _i = 0, _a = word.split('/'); _i < _a.length; _i++) {
        var part = _a[_i];
        if (part === '..' && parts.length && parts.at(-1) !== '..' && parts.at(-1) !== '')
            parts.pop();
        else if (part !== '.' && (part !== '' || !parts.length))
            parts.push(part);
    }
    var path = parts.join('/');
    // Reached from its own folder, by the mod's own path, or by a path that names the mod or is filled in by the shell: another
    // tool that happens to be called admin is none of this
    return path === name || path === "bin/".concat(name) || (path.endsWith("/bin/".concat(name)) && (path === "".concat(root, "/bin/").concat(name) || /claudopus/i.test(path) || path.includes('$')));
};
var adminCalls = function (command, root, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth > 4)
        return [];
    return shellWords(command).flatMap(function (words) {
        var _a, _b, _c, _d, _e, _f;
        var i = 0;
        for (;;) {
            while (i < words.length && /^\w+=/.test(words[i]))
                i++;
            var head = (_b = ((_a = words[i]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : '';
            if (!['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'builtin', 'timeout', 'caffeinate', 'nice', 'if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{'].includes(head))
                break;
            i++;
            while (i < words.length && (words[i].startsWith('-') || (head === 'sudo' && words[i - 1] === '-u') || /^\d+[smhd]?$/.test(words[i]) || (head === 'env' && /^\w+=/.test(words[i]))))
                i++;
        }
        var tool = (_d = ((_c = words[i]) !== null && _c !== void 0 ? _c : '').split('/').pop()) !== null && _d !== void 0 ? _d : '';
        if (tool === 'eval')
            return adminCalls(words.slice(i + 1).join(' '), root, depth + 1);
        if (tool === 'bash' || tool === 'sh' || tool === 'zsh') {
            var c = words.findIndex(function (one, n) { return n > i && /^-[a-z]*c$/.test(one); });
            if (c > 0)
                return adminCalls((_e = words[c + 1]) !== null && _e !== void 0 ? _e : '', root, depth + 1);
            // A shell handed the runner as a script
            i++;
            while (i < words.length && words[i].startsWith('-'))
                i++;
        }
        if (!isAdminPath((_f = words[i]) !== null && _f !== void 0 ? _f : '', root))
            return [];
        var _g = [words[i + 1], words[i + 2]], _h = _g[0], host = _h === void 0 ? '' : _h, _j = _g[1], run = _j === void 0 ? '' : _j;
        return !host || !run || host.startsWith('-') || run === '--forget' ? [] : [{ host: host, command: run }];
    });
};
// One seal for each message: its HMAC under the key in this Mac's keychain, which never leaves that shell. "make" makes the key when
// there is none, "new" makes a new one, so every seal of the old one is void
var SEAL = "set -u\nPATH=/usr/bin:/bin\nmode=$1\nshift\n# The kept copy of the person's settings and texts has a key of its own (\"known\"), so its being there says a copy was made here\nacct=seal\ncase $mode in known-*) acct=known; mode=${mode#known-} ;; esac\nif [ -x /usr/bin/security ]; then\n  key() { /usr/bin/security find-generic-password -s ".concat(GATE_SERVICE, " -a \"$acct\" -w 2>/dev/null; }\n  keep() { printf 'add-generic-password -U -s \"").concat(GATE_SERVICE, "\" -a \"%s\" -l \"Claudopus admin gate\" -w \"%s\"\\n' \"$acct\" \"$1\" | /usr/bin/security -i >/dev/null 2>&1; }\nelse\n  # Linux: where bin/keyring keeps it, a file only this user reads, under the home folder (never XDG_DATA_HOME)\n  d=$HOME/.local/share\n  f=$d/claudopus/keyring/").concat(GATE_SERVICE, "\n  key() { [ -f \"$f/$acct\" ] && cat \"$f/$acct\" 2>/dev/null; }\n  keep() { (umask 077; mkdir -p \"$f\" && chmod 700 \"$d/claudopus\" \"$d/claudopus/keyring\" \"$f\" && printf '%s' \"$1\" >\"$f/.$acct.new\" && mv -f \"$f/.$acct.new\" \"$f/$acct\"); }\nfi\nk=$(key)\nif [ \"$mode\" = has ]; then [ -n \"$k\" ] && exit 0; exit 3; fi\nif [ \"$mode\" = new ] || { [ -z \"$k\" ] && [ \"$mode\" = make ]; }; then\n  k=$(/usr/bin/openssl rand -hex 32 2>/dev/null || od -An -tx1 -N32 /dev/urandom | tr -d ' \\n') || exit 1\n  [ ${#k} = 64 ] || exit 1\n  keep \"$k\"\n  [ \"$(key)\" = \"$k\" ] || exit 1\nfi\n[ -n \"$k\" ] || exit 3\nfor m in \"$@\"; do\n  printf '%s\\n%s' \"$k\" \"$m\" | /usr/bin/perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m // \"\", $k), \"\\n\"' || exit 1\ndone");
var sealed = function ($, mode, messages) { return __awaiter(_this, void 0, void 0, function () {
    var r, lines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hasKeychain($)];
            case 1:
                if (!(_a.sent()))
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, $.process.run(__spreadArray(['/bin/sh', '-c', SEAL, 'sh', mode], messages, true), { timeoutMs: 20000 }).catch(function () { return undefined; })];
            case 2:
                r = _a.sent();
                lines = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout.split('\n').filter(Boolean) : undefined;
                return [2 /*return*/, lines && lines.length === messages.length && lines.every(function (line) { return /^[0-9a-f]{64}$/.test(line); }) ? lines : undefined];
        }
    });
}); };
// What is in force: "work" or "never" only as Config sealed it, every command asked otherwise
var gateOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var config, said, seal, isSealed;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, readConfig($, dir)];
            case 1:
                config = _b.sent();
                said = config.admin === 'work' || config.admin === 'never' ? config.admin : 'each';
                if (said === 'each')
                    return [2 /*return*/, { mode: 'each', unsealed: '' }];
                return [4 /*yield*/, sealed($, 'read', ["mode\n".concat(said)])];
            case 2:
                seal = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[0];
                isSealed = Boolean(seal) && seal === config.adminSealed;
                return [2 /*return*/, { mode: isSealed ? said : 'each', unsealed: isSealed ? '' : said }];
        }
    });
}); };
var allowedPath = function () { return "".concat(dir, "/admin-allowed.json"); };
var allowMessage = function (one) { return "allow\n".concat(one.host, "\n").concat(one.command); };
var readAllowed = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var kept, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, personText($, dir, 'admin-allowed.json')];
            case 1:
                kept = _b.apply(_a, [(_d.sent()) || '{}']);
                return [2 /*return*/, Object.entries(kept).flatMap(function (_a) {
                        var host = _a[0], list = _a[1];
                        return (Array.isArray(list) ? list : []).flatMap(function (one) {
                            var _a = (one !== null && one !== void 0 ? one : {}), command = _a.command, seal = _a.seal, at = _a.at;
                            return typeof command === 'string' && typeof seal === 'string' ? [{ host: host, command: command, seal: seal, at: typeof at === 'number' ? at : 0 }] : [];
                        });
                    })];
            case 2:
                _c = _d.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var writeAllowed = function ($, list) {
    var _a;
    var kept = {};
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var _b = list_1[_i], host = _b.host, command = _b.command, seal = _b.seal, at = _b.at;
        ((_a = kept[host]) !== null && _a !== void 0 ? _a : (kept[host] = [])).push({ command: command, seal: seal, at: at });
    }
    var text = "".concat(JSON.stringify(kept, null, 2), "\n");
    return personWrote($, dir, 'admin-allowed.json', text).then(function () { return $.fs.write(allowedPath(), text); });
};
// Read once for each state of the file: the Config tab draws the list often
var allowedRead = { key: '', valid: [], unsealed: 0 };
var validAllowed = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var all, key, seals, valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readAllowed($)];
            case 1:
                all = _a.sent();
                if (!all.length)
                    return [2 /*return*/, { valid: [], unsealed: 0 }];
                key = JSON.stringify(all);
                if (allowedRead.key === key)
                    return [2 /*return*/, allowedRead];
                return [4 /*yield*/, sealed($, 'read', all.map(allowMessage))];
            case 2:
                seals = _a.sent();
                valid = all.filter(function (one, n) { return (seals === null || seals === void 0 ? void 0 : seals[n]) === one.seal; });
                allowedRead = { key: key, valid: valid, unsealed: all.length - valid.length };
                return [2 /*return*/, allowedRead];
        }
    });
}); };
var isAllowed = function ($, call) { return __awaiter(_this, void 0, void 0, function () {
    var entry, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, readAllowed($)];
            case 1:
                entry = (_c.sent()).find(function (one) { return one.host === call.host && one.command === call.command; });
                _a = Boolean(entry);
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, sealed($, 'read', [allowMessage(call)])];
            case 2:
                _a = ((_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b[0]) === (entry === null || entry === void 0 ? void 0 : entry.seal);
                _c.label = 3;
            case 3: return [2 /*return*/, _a];
        }
    });
}); };
var allowAlways = function ($, call) { return __awaiter(_this, void 0, void 0, function () {
    var seal, at, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, sealed($, 'make', [allowMessage(call)])];
            case 1:
                seal = (_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d[0];
                if (!seal)
                    throw new Error("the seal could not be made in ".concat(keptWhere()));
                return [4 /*yield*/, $.clock.now()];
            case 2:
                at = _e.sent();
                allowedRead = { key: '', valid: [], unsealed: 0 };
                _a = writeAllowed;
                _b = [$];
                _c = [[]];
                return [4 /*yield*/, readAllowed($)];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([__spreadArray.apply(void 0, [__spreadArray.apply(void 0, _c.concat([(_e.sent()).filter(function (one) { return one.host !== call.host || one.command !== call.command; }), true])), [__assign(__assign({}, call), { seal: seal, at: at })], false])]))];
            case 4:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); };
// A change that takes something back (another setting, a command removed): what stays is sealed again under a new key, so no seal
// made before counts, whoever kept a copy of it
var regate = function ($, change) { return __awaiter(_this, void 0, void 0, function () {
    var valid, kept, mode, _a, seals;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, validAllowed($)];
            case 1:
                valid = (_c.sent()).valid;
                kept = change.remove ? valid.filter(function (one) { var _a; return one.host !== ((_a = change.remove) === null || _a === void 0 ? void 0 : _a.host) || one.command !== change.remove.command; }) : valid;
                if (!((_b = change.mode) !== null && _b !== void 0)) return [3 /*break*/, 2];
                _a = _b;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, gateOf($)];
            case 3:
                _a = (_c.sent()).mode;
                _c.label = 4;
            case 4:
                mode = _a;
                return [4 /*yield*/, sealed($, 'new', __spreadArray(__spreadArray([], kept.map(allowMessage), true), (mode === 'each' ? [] : ["mode\n".concat(mode)]), true))];
            case 5:
                seals = _c.sent();
                if (!seals)
                    throw new Error("the seal could not be made in ".concat(keptWhere()));
                allowedRead = { key: '', valid: [], unsealed: 0 };
                return [4 /*yield*/, writeAllowed($, kept.map(function (one, n) { var _a; return (__assign(__assign({}, one), { seal: (_a = seals[n]) !== null && _a !== void 0 ? _a : '' })); }))];
            case 6:
                _c.sent();
                return [4 /*yield*/, setConfig($, dir, 'admin', mode === 'each' ? undefined : mode)];
            case 7:
                _c.sent();
                return [4 /*yield*/, setConfig($, dir, 'adminSealed', mode === 'each' ? undefined : seals[kept.length])];
            case 8:
                _c.sent();
                if (change.mode)
                    workAllowed.clear();
                return [2 /*return*/];
        }
    });
}); };
// No admin password is kept: every one an earlier version kept leaves the keychain (on Linux, bin/keyring's folder) as the mod
// loads, with the "Let macOS ask" mark kept beside the gate's key and config.json's adminPassword, which no longer choose anything
var FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; /usr/bin/security delete-generic-password -s claudopus-admin-gate -a password >/dev/null 2>&1; else d=$HOME/.local/share; o=${XDG_DATA_HOME:-}; case $o in /*) [ "$o" != "$d" ] && [ -d "$o/claudopus/keyring" ] && [ ! -e "$d/claudopus/keyring" ] && mkdir -p "$d/claudopus" && chmod 700 "$d/claudopus" && mv "$o/claudopus/keyring" "$d/claudopus/keyring" ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; rm -f "$d/claudopus/keyring/claudopus-admin-gate/password"; fi; exit 0';
var isKeptForgotten = false;
var forgetKeptPasswords = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isKeptForgotten || !dir)
                    return [2 /*return*/];
                isKeptForgotten = true;
                return [4 /*yield*/, hasKeychain($)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30000 }).catch(function (err) { return log($, "kept admin passwords not forgotten: ".concat(String(err))); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, readConfig($, dir)];
            case 4:
                if (!((_a.sent()).adminPassword !== undefined)) return [3 /*break*/, 6];
                return [4 /*yield*/, setConfig($, dir, 'adminPassword', undefined).catch(function () { return undefined; })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
// What a press allowed, for bin/admin to take once: the Mac and the exact command, sealed. One nothing took goes as its call ends
var grantsDir = function () { return "".concat(dir, "/admin-grants"); };
// A release's grant is sealed under a word of its own, so neither runner ever takes the other's
var issueGrant = function ($_1, id_1, call_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1, call_1], args_1, true), void 0, function ($, id, call, word) {
        var at, name, seal;
        var _a;
        if (word === void 0) { word = 'grant'; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, $.clock.now()];
                case 1:
                    at = _b.sent();
                    name = "".concat(id.replace(/[^A-Za-z0-9_-]/g, ''), "-").concat(at);
                    return [4 /*yield*/, sealed($, 'make', ["".concat(word, "\n").concat(name, "\n").concat(at, "\n").concat(call.host, "\n").concat(call.command)])];
                case 2:
                    seal = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[0];
                    if (!seal)
                        return [2 /*return*/, ''
                            // Grants a call sent to the background never took are cleared as the next one is made
                        ];
                    // Grants a call sent to the background never took are cleared as the next one is made
                    return [4 /*yield*/, $.process.run(['/usr/bin/find', grantsDir(), '-type', 'f', '-mmin', '+10', '-delete'], { timeoutMs: 10000 }).catch(function () { return undefined; })];
                case 3:
                    // Grants a call sent to the background never took are cleared as the next one is made
                    _b.sent();
                    return [4 /*yield*/, $.fs.write("".concat(grantsDir(), "/").concat(name, ".json"), JSON.stringify({ id: name, host: call.host, command: call.command, at: at, seal: seal }))];
                case 4:
                    _b.sent();
                    return [2 /*return*/, name];
            }
        });
    });
};
var dropGrants = function ($, names) { return __awaiter(_this, void 0, void 0, function () {
    var _i, names_1, name_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, names_1 = names;
                _a.label = 1;
            case 1:
                if (!(_i < names_1.length)) return [3 /*break*/, 4];
                name_1 = names_1[_i];
                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(grantsDir(), "/").concat(name_1, ".json")]).catch(function () { return undefined; })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// A tool call that would read or write the list, the grants or the key itself
// A command is read as written and again with its quotes and backslashes taken out, so `-"w"` or `claudopus-admin-"gate"` is read as
// the shell reads it. Any command that names the keychain's admin services (the gate's key and what Config chose, and the kept admin
// passwords) with security or the keyring runner counts, whatever it does with them
var unquoted = function (command) { return command.replace(/["'\\]/g, ''); };
// The runners find their key, grants and settings under the home folder, and release asks for a press only inside Claude Code: a
// command that names one and sets another home or data folder, or takes Claude Code's mark away, would have it read the caller's own
// (its comment lines left out, so a test script that makes a home of its own and only names a runner in a comment is not refused)
var RUNNER_NAMED = /\bbin\/(?:admin|secret|release|keyring)(?![\w.-])/;
var RUNNER_MOVED = /(?:^|[\s;&|(`'"])(?:HOME|XDG_DATA_HOME|CLAUDECODE)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:HOME|XDG_DATA_HOME|CLAUDECODE)\b|\benv\b[^;&|\n]*\s(?:-u\s*|--unset[= ])CLAUDECODE\b|\benv\b[^;&|\n]*\s-i\b|\benv(?:\s+-\w+)*\s+-(?=\s|$)|\bexec\s+-\w*c/;
// The release runs as itself (#!/bin/bash -p: no startup file, no functions from the environment), so what its shell runs, the
// GitHub checks' verdict among it, is its own: a command that names it and sets what a shell or git reads first (a startup file,
// functions, options, the PATH, git's settings), sources a script first, or starts it through a shell of its own choosing, is refused
var RELEASE_NAMED = /\bbin\/release(?![\w.-])/;
var RELEASE_MOVED = /(?:^|[\s;&|(`'"])(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+|BASH_FUNC_\S+)=|\b(?:export|unset|declare|typeset|readonly|local)\s+(?:-\w+\s+)*(?:BASH_ENV|ENV|SHELLOPTS|BASHOPTS|PS4|PATH|GIT_\w+)\b|\b(?:export|declare|typeset)\s+(?:-\w+\s+)*-\w*f|(?:^|[;&|(]\s*)(?:source|\.)\s|\b(?:ba|z|da|k|c|tc|fi)?sh\s+(?:-\S+\s+)*\S*bin\/release(?![\w.-])/;
var movesRunner = function (command) {
    return [command, unquoted(command)].map(function (one) { return one.replace(/^\s*#.*$/gm, ''); }).some(function (one) { return (RUNNER_NAMED.test(one) && RUNNER_MOVED.test(one)) || (RELEASE_NAMED.test(one) && RELEASE_MOVED.test(one)); });
};
var NO_RUNNER_MOVED = "This command didn't run: Claudopus's runners (bin/admin, bin/secret, bin/release, bin/keyring) run with the home folder and the environment variables Claude Code gave the shell, so a command that sets HOME or XDG_DATA_HOME for one, or removes CLAUDECODE, is refused, and so is one that sets the PATH, BASH_ENV, shell options or git's settings for bin/release, sources a script before it, or starts it through a shell. Run the runner as it is.";
var touchesGate = function (e) {
    var _a, _b, _c;
    if (e.tool === 'Bash') {
        var command = String((_a = e.command) !== null && _a !== void 0 ? _a : '');
        return [command, unquoted(command)].some(function (one) { return /claudopus\/admin-(?:allowed\.json|grants|known\.json)\b/.test(one) || (/\b(?:security|keyring)\b/.test(one) && /claudopus-admin\b/.test(one)); });
    }
    var path = String((_c = (_b = e.file_path) !== null && _b !== void 0 ? _b : e.notebook_path) !== null && _c !== void 0 ? _c : '');
    return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && /\/claudopus\/admin-(?:allowed\.json$|known\.json$|grants(?:\/|$))/.test(path);
};
var setGates = function ($, top, fn) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!top) return [3 /*break*/, 1];
                looseGates = fn(looseGates);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { var _a, _b; return (one.id !== top ? one : __assign(__assign({}, one), { admins: fn((_a = one.admins) !== null && _a !== void 0 ? _a : []).length ? fn((_b = one.admins) !== null && _b !== void 0 ? _b : []) : undefined })); }); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// No hold outlives the copy of the mod that made it: a card that still shows one as a chat starts is cleared
var clearGates = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                looseGates = looseGates.filter(function (one) { return gateHeld.has(one.id); });
                return [4 /*yield*/, read($, todos)];
            case 1:
                if (!(_a.sent()).some(function (one) { var _a; return (_a = one.admins) === null || _a === void 0 ? void 0 : _a.some(function (gate) { return !gateHeld.has(gate.id); }); })) return [3 /*break*/, 3];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.admins ? __assign(__assign({}, one), { admins: one.admins.filter(function (gate) { return gateHeld.has(gate.id); }).length ? one.admins.filter(function (gate) { return gateHeld.has(gate.id); }) : undefined }) : one); }); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Holds the call until the person presses: the wait is a promise the press resolves (answerGate), ended also by the call's
// abort and by this copy of the mod being replaced, with no loop that looks for the press (heldStep)
var holdGate = function ($, next, gate, top) { return __awaiter(_this, void 0, void 0, function () {
    var wait, end, pressed, stop, card, _a, text, act, _b, said, press;
    var _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                if (!(_k.sent()).length)
                    return [2 /*return*/, 'blind'];
                wait = {};
                end = function () { return undefined; };
                pressed = new Promise(function (resolve) { return (end = function (said) { return void (wait.said === undefined && ((wait.said = said), resolve())); }); });
                stop = function () { return end('gone'); };
                gateHeld.add(gate.id);
                gateWaits.set(gate.id, end);
                // A gate held afresh waits for a press of its own: a mark an earlier one of the same id left never hides it
                gatePressed.delete(gate.id);
                (_c = next.signal) === null || _c === void 0 ? void 0 : _c.addEventListener('abort', stop, { once: true });
                whenLeft.add(stop);
                _k.label = 2;
            case 2:
                _k.trys.push([2, , 18, 20]);
                return [4 /*yield*/, setGates($, top, function (list) { return __spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== gate.id; }), true), [gate], false); })];
            case 3:
                _k.sent();
                return [4 /*yield*/, openList($).catch(function () { return undefined; })];
            case 4:
                _k.sent();
                if (!top) return [3 /*break*/, 6];
                return [4 /*yield*/, read($, todos)];
            case 5:
                _a = (_k.sent()).find(function (one) { return one.id === top; });
                return [3 /*break*/, 7];
            case 6:
                _a = undefined;
                _k.label = 7;
            case 7:
                card = _a;
                text = "".concat(gateAct(gate), ": ").concat(cut(oneLine(gate.command), 200));
                return [4 /*yield*/, (card ? askAloud($, card, text) : aloud($, 'ask', 'This chat has a question for you', text, "gate-".concat(gate.id))).catch(function (err) { return log($, "admin command not told: ".concat(String(err))); })];
            case 8:
                _k.sent();
                act = gateAct(gate);
                // The press is on the card or at the top of the panel, which the notification above points to: the chat shows nothing of it, and
                // its model is told only so it knows, should the person ask (18 Nov: a line in the chat for each release was "garbage I don't need")
                return [4 /*yield*/, tellChat($, named(GATE_IN_CHAT(card ? titleOf(card) : '', "".concat(act.charAt(0).toLowerCase()).concat(act.slice(1)), cut(oneLine(gate.command), 120))))];
            case 9:
                // The press is on the card or at the top of the panel, which the notification above points to: the chat shows nothing of it, and
                // its model is told only so it knows, should the person ask (18 Nov: a line in the chat for each release was "garbage I don't need")
                _k.sent();
                _k.label = 10;
            case 10:
                if (!(wait.said === undefined)) return [3 /*break*/, 17];
                _b = ((_d = next.signal) === null || _d === void 0 ? void 0 : _d.aborted);
                if (_b) return [3 /*break*/, 12];
                return [4 /*yield*/, isReplaced($)];
            case 11:
                _b = (_k.sent());
                _k.label = 12;
            case 12:
                if (!_b) return [3 /*break*/, 13];
                (_e = wait.said) !== null && _e !== void 0 ? _e : (wait.said = 'gone');
                return [3 /*break*/, 16];
            case 13:
                if (!(((_g = (_f = next.budget) === null || _f === void 0 ? void 0 : _f.remainingMs) !== null && _g !== void 0 ? _g : Infinity) < 1500)) return [3 /*break*/, 14];
                (_h = wait.said) !== null && _h !== void 0 ? _h : (wait.said = 'late');
                return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, Promise.race([pressed, heldStep($)])];
            case 15:
                _k.sent();
                _k.label = 16;
            case 16: return [3 /*break*/, 10];
            case 17: return [3 /*break*/, 20];
            case 18:
                whenLeft.delete(stop);
                gateHeld.delete(gate.id);
                if (gateWaits.get(gate.id) === end)
                    gateWaits.delete(gate.id);
                return [4 /*yield*/, setGates($, top, function (list) { return list.filter(function (one) { return one.id !== gate.id; }); }).catch(function () { return undefined; })];
            case 19:
                _k.sent();
                return [7 /*endfinally*/];
            case 20:
                said = (_j = wait.said) !== null && _j !== void 0 ? _j : 'gone';
                press = gatePressed.get(gate.id);
                gatePressed.delete(gate.id);
                if (press && press !== said)
                    pressedLine($, top, gateLabel(press), "it had stopped waiting, so ".concat(gateNothing(gate)));
                return [4 /*yield*/, log($, "".concat(gate.kind === 'release' ? 'release of' : gate.kind === 'file' ? 'change to' : 'admin command on', " ").concat(gate.host, ": ").concat(said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'not allowed' : 'not answered'))];
            case 21:
                _k.sent();
                return [2 /*return*/, said];
        }
    });
}); };
// The words of each press on a gate's block, and what did not happen when one came to nothing
var gateLabel = function (said) { return (said === 'deny' ? DONT_ALLOW : said === 'always' ? ALWAYS_ALLOW : ALLOW); };
var gateNothing = function (gate) { return (gate.kind === 'release' ? 'nothing was released' : gate.kind === 'file' ? 'nothing changed' : "it didn't run"); };
// The gates pressed and not yet let go by their wait, with what was pressed: the panel draws each answered from the press itself.
// Only the first press counts: a second, on a drawing a moment old, sends nothing
var gatePressed = new Map();
// `card` names the work whose card the gate is on: one grey line there says what was pressed, where the block was
var answerGate = function ($, gate, said, card) {
    if (card === void 0) { card = ''; }
    presses += 1;
    var id = gate.id;
    // A put-back goes from the panel in the press's own drawing too, and comes back only if it could not be answered
    if (gate.isUndone) {
        if (gatePressed.has(id))
            return;
        gatePressed.set(id, said);
        pressedLine($, card, gateLabel(said));
        redraw($);
        return void answerUndone($, gate, said)
            .catch(function (err) { return log($, "undone change not answered: ".concat(String(err))); })
            .finally(function () { return (gatePressed.delete(id), redraw($)); });
    }
    var end = gateWaits.get(id);
    if (gateHeld.has(id) && !gatePressed.has(id) && end) {
        gatePressed.set(id, said);
        pressedLine($, card, gateLabel(said));
        end(said);
    }
    redraw($);
};
// Before a Bash call runs: each admin command in it is allowed already (never asked, this work allowed, the command always
// allowed) or waits for the press; allowed, it gets its grant. Refused, the call does not run
var gateAdmin = function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
    var calls, gate, list, top, card, grants, _i, _a, _b, n, call, isWork, isCovered, _c, said_1, _d, _e, grant;
    var _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                calls = adminCalls(String((_g = e.command) !== null && _g !== void 0 ? _g : ''), $.plugin.root);
                if (!calls.length || !dir)
                    return [2 /*return*/, { grants: [] }];
                return [4 /*yield*/, gateOf($)];
            case 1:
                gate = _h.sent();
                if (gate.mode === 'never')
                    return [2 /*return*/, { grants: [] }];
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _h.sent();
                top = e.agentId === undefined ? '' : topOf(list, e.agentId);
                card = list.find(function (one) { return one.id === top; });
                grants = [];
                _i = 0, _a = calls.entries();
                _h.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 17];
                _b = _a[_i], n = _b[0], call = _b[1];
                isWork = gate.mode === 'work' && Boolean(card);
                _c = (isWork && workAllowed.has(top));
                if (_c) return [3 /*break*/, 5];
                return [4 /*yield*/, isAllowed($, call)];
            case 4:
                _c = (_h.sent());
                _h.label = 5;
            case 5:
                isCovered = _c;
                if (!!isCovered) return [3 /*break*/, 12];
                _d = holdGate;
                _e = [$, next];
                _f = { id: "".concat(e.tool_use_id, "-").concat(n), call: e.tool_use_id, host: call.host, command: call.command };
                return [4 /*yield*/, $.clock.now()];
            case 6: return [4 /*yield*/, _d.apply(void 0, _e.concat([__assign.apply(void 0, [__assign.apply(void 0, [(_f.at = _h.sent(), _f), (e.agentId ? { from: e.agentId } : {})]), (isWork ? { isWork: true } : {})]), card ? top : '']))];
            case 7:
                said_1 = _h.sent();
                if (!(said_1 !== 'once' && said_1 !== 'always')) return [3 /*break*/, 9];
                return [4 /*yield*/, dropGrants($, grants)];
            case 8:
                _h.sent();
                return [2 /*return*/, { deny: said_1 === 'deny' ? GATE_DENIED() : said_1 === 'late' ? GATE_LATE() : said_1 === 'blind' ? GATE_BLIND() : GATE_GONE(), grants: [] }];
            case 9:
                if (!(said_1 === 'always')) return [3 /*break*/, 11];
                return [4 /*yield*/, allowAlways($, call).catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, log($, "admin command not always allowed: ".concat(String(err)))];
                                case 1:
                                    _a.sent();
                                    pressedLine($, card ? top : '', ALWAYS_ALLOW, "it runs now, but it couldn't be saved as always allowed");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 10:
                _h.sent();
                _h.label = 11;
            case 11:
                if (isWork)
                    workAllowed.add(top);
                _h.label = 12;
            case 12: return [4 /*yield*/, issueGrant($, "".concat(e.tool_use_id, "-").concat(n), call)];
            case 13:
                grant = _h.sent();
                if (!!grant) return [3 /*break*/, 15];
                pressedLine($, card ? top : '', ALLOW, "the keychain key couldn't be used, so it didn't run");
                return [4 /*yield*/, dropGrants($, grants)];
            case 14:
                _h.sent();
                return [2 /*return*/, { deny: GATE_UNSEALED(), grants: [] }];
            case 15:
                grants.push(grant);
                _h.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 3];
            case 17: return [2 /*return*/, { grants: grants }];
        }
    });
}); };
// The runner's own arguments, as the shell hands them: a redirection (`> log`, `2>log`, `>>log`, `<in`) and what it names are the
// shell's, never a branch. Read otherwise, `release > log` asked to release a branch called ">", whose grant the runner (on its
// own branch) refused, so the work ran it again and the person was asked twice
var releaseArgs = function (words) {
    var args = [];
    for (var n = 0; n < words.length; n++) {
        var word = words[n];
        if (/^\d*(?:>>?|<<?|>\||<>)$/.test(word)) {
            n++;
            continue;
        }
        if (/^\d*[<>]/.test(word))
            continue;
        var cut_1 = word.search(/[<>]/);
        if (cut_1 >= 0) {
            if (cut_1 > 0)
                args.push(word.slice(0, cut_1));
            // `branch>log` hands the branch and sends what it prints to log; `branch> log` names the log in the next word
            if (/[<>]$/.test(word))
                n++;
            continue;
        }
        args.push(word);
    }
    return args;
};
var releaseCalls = function (command, root, from) {
    var _a, _b, _c, _d;
    var folder = from;
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var found = [];
    for (var _i = 0, _e = shellWords(command); _i < _e.length; _i++) {
        var said_2 = _e[_i];
        // `release>log` is the runner and a redirection, as the shell reads it: the runner's own word alone is split
        var words = said_2.flatMap(function (word) {
            var cut = word.search(/[<>]/);
            return cut > 0 && isAdminPath(word.slice(0, cut), root, 'release') ? [word.slice(0, cut), word.slice(cut)] : [word];
        });
        var i = commandAt(words);
        var name_2 = (_b = ((_a = words[i]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : '';
        if ((name_2 === 'cd' || name_2 === 'pushd') && words[i + 1]) {
            folder = pathOf(words[i + 1], home, folder);
            continue;
        }
        // Run by a shell handed it as a script, or by itself
        var at = ['bash', 'sh', 'zsh'].includes(name_2) ? i + 1 + words.slice(i + 1).findIndex(function (one) { return !one.startsWith('-'); }) : i;
        if (at < i || !isAdminPath((_c = words[at]) !== null && _c !== void 0 ? _c : '', root, 'release'))
            continue;
        var args = releaseArgs(words.slice(at + 1));
        if (args[0] === '--status')
            continue;
        var rest = args[0] === '-m' ? args.slice(2) : args;
        found.push({ folder: folder, branch: (_d = rest[0]) !== null && _d !== void 0 ? _d : '' });
    }
    return found;
};
// What a press on a task's own go-ahead allows (asking.tsx, answerCleared): that card's next run of the release runner for that
// worktree and its branch, once, within RELEASE_ALLOWED of the press and only until the card ends (state.tsx). Kept only in this
// code's memory, as every press is: no file, message or typed reply allows a release
var RELEASE_ALLOWED = 60 * 60000;
var RELEASE_IT = 'Release it';
var releaseAllowed = new Map();
var allowRelease = function ($, card, folder) { return __awaiter(_this, void 0, void 0, function () {
    var git, repo, branch, _a, _b, _c, _d;
    var _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                git = function (args) { return $.process.run(__spreadArray(['git', '-C', folder], args, true), { timeoutMs: 15000 }).then(function (r) { return (r.exitCode === 0 ? r.stdout.trim() : ''); }).catch(function () { return ''; }); };
                return [4 /*yield*/, git(['rev-parse', '--show-toplevel'])];
            case 1:
                repo = _g.sent();
                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', 'HEAD'])
                    // Only a worktree on a branch, of a repo that says how it is released
                ];
            case 2:
                branch = _g.sent();
                _a = !repo || !branch || branch === 'HEAD';
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, $.fs.stat("".concat(repo, "/.release")).catch(function () { return undefined; })];
            case 3:
                _a = ((_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.kind) !== 'file';
                _g.label = 4;
            case 4:
                // Only a worktree on a branch, of a repo that says how it is released
                if (_a)
                    return [2 /*return*/, false];
                _c = (_b = releaseAllowed).set;
                _d = [card];
                _e = { folder: repo, branch: branch };
                return [4 /*yield*/, $.clock.now()];
            case 5:
                _c.apply(_b, _d.concat([(_e.at = _g.sent(), _e)]));
                return [4 /*yield*/, log($, "release of ".concat(branch, " from ").concat(repo, " allowed once for ").concat(card, " by ").concat(who(), "'s press on its go-ahead"))];
            case 6:
                _g.sent();
                return [2 /*return*/, true];
        }
    });
}); };
var gateRelease = function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
    var calls, list, top, card, grants, _loop_1, _i, _a, _b, n, call, state_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                calls = releaseCalls(String((_c = e.command) !== null && _c !== void 0 ? _c : ''), $.plugin.root, cwd || dir.replace(/\/\.claude\/claudopus$/, ''));
                if (!calls.length || !dir)
                    return [2 /*return*/, { grants: [] }];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _d.sent();
                top = e.agentId === undefined ? '' : topOf(list, e.agentId);
                card = list.find(function (one) { return one.id === top; });
                grants = [];
                _loop_1 = function (n, call) {
                    var git, repo, branch, _e, id, common, name_3, now, allowed, isPressed, said_3, _f, gate, grant;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                git = function (args) { return $.process.run(__spreadArray(['git', '-C', call.folder], args, true), { timeoutMs: 15000 }).then(function (r) { return (r.exitCode === 0 ? r.stdout.trim() : ''); }).catch(function () { return ''; }); };
                                return [4 /*yield*/, git(['rev-parse', '--show-toplevel'])];
                            case 1:
                                repo = _g.sent();
                                _e = call.branch;
                                if (_e) return [3 /*break*/, 3];
                                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', 'HEAD'])];
                            case 2:
                                _e = (_g.sent());
                                _g.label = 3;
                            case 3:
                                branch = _e;
                                // Not a repo, or no branch: the runner itself says what is wrong, and it releases nothing without a grant
                                if (!repo || !branch || branch === 'HEAD')
                                    return [2 /*return*/, "continue"];
                                id = "".concat(e.tool_use_id, "-r").concat(n);
                                return [4 /*yield*/, git(['rev-parse', '--path-format=absolute', '--git-common-dir'])];
                            case 4:
                                common = _g.sent();
                                name_3 = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo;
                                return [4 /*yield*/, $.clock.now()];
                            case 5:
                                now = _g.sent();
                                allowed = card ? releaseAllowed.get(top) : undefined;
                                isPressed = Boolean(allowed && allowed.folder === repo && allowed.branch === branch && now - allowed.at < RELEASE_ALLOWED);
                                if (allowed && (isPressed || now - allowed.at >= RELEASE_ALLOWED))
                                    releaseAllowed.delete(top);
                                if (!isPressed) return [3 /*break*/, 7];
                                return [4 /*yield*/, log($, "release of ".concat(branch, " in ").concat(name_3, ": allowed by the press on its task's go-ahead"))];
                            case 6:
                                _g.sent();
                                _g.label = 7;
                            case 7:
                                if (!isPressed) return [3 /*break*/, 8];
                                _f = 'once';
                                return [3 /*break*/, 10];
                            case 8: return [4 /*yield*/, holdGate($, next, __assign({ id: id, call: e.tool_use_id, kind: 'release', host: name_3, command: "".concat(branch, " from ").concat(repo), folder: repo, branch: branch, at: now }, (e.agentId ? { from: e.agentId } : {})), card ? top : '')];
                            case 9:
                                _f = _g.sent();
                                _g.label = 10;
                            case 10:
                                said_3 = _f;
                                if (!(said_3 !== 'once')) return [3 /*break*/, 12];
                                return [4 /*yield*/, dropGrants($, grants)];
                            case 11:
                                _g.sent();
                                gate = { kind: 'release' };
                                return [2 /*return*/, { value: { deny: said_3 === 'deny' ? GATE_DENIED(gate) : said_3 === 'late' ? GATE_LATE(gate) : said_3 === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate), grants: [] } }];
                            case 12: return [4 /*yield*/, issueGrant($, id, { host: 'release', command: "".concat(repo, "\n").concat(branch) }, 'release-grant')];
                            case 13:
                                grant = _g.sent();
                                if (!!grant) return [3 /*break*/, 15];
                                pressedLine($, card ? top : '', isPressed ? RELEASE_IT : ALLOW, "the keychain key couldn't be used, so nothing was released");
                                return [4 /*yield*/, dropGrants($, grants)];
                            case 14:
                                _g.sent();
                                return [2 /*return*/, { value: { deny: GATE_UNSEALED(), grants: [] } }];
                            case 15:
                                grants.push(grant);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = calls.entries();
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], n = _b[0], call = _b[1];
                return [5 /*yield**/, _loop_1(n, call)];
            case 3:
                state_1 = _d.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, { grants: grants }];
        }
    });
}); };
// The person's own settings and texts in the memory folder: config.json (the admin gate's mode, the Macs reached, the name every
// text uses) and their copies of the rules and roles every chat and work runs on. Config's own acts write them without a tool call;
// work's Write or Edit there waits for the person's press on its card, showing the file and the change
var ownFileOf = function (path) {
    if (!dir)
        return '';
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var full = pathOf(path, home, cwd || home);
    var memory = dir.toLowerCase();
    var lower = full.toLowerCase();
    if (lower === "".concat(memory, "/config.json"))
        return 'your Claudopus settings (config.json)';
    if (lower === "".concat(memory, "/rules") || lower.startsWith("".concat(memory, "/rules/")))
        return "your rules (".concat(full.slice(dir.length + 1), ")");
    if (lower === "".concat(memory, "/roles") || lower.startsWith("".concat(memory, "/roles/")))
        return "your role file (".concat(full.slice(dir.length + 1), ")");
    // A repo's release.local, which its release runner reads as this Mac's own settings
    if (/\/\.git\/release\.local$/.test(full))
        return "this Mac's release settings (".concat(full, ")");
    return '';
};
var FILE_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'];
var gateOwnFile = function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
    var input, file, change, list, top, card, said, _a, _b, gate;
    var _c;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!FILE_TOOLS.includes(e.tool))
                    return [2 /*return*/, ''];
                input = e;
                file = ownFileOf(String((_e = (_d = input.file_path) !== null && _d !== void 0 ? _d : input.notebook_path) !== null && _e !== void 0 ? _e : ''));
                if (!file)
                    return [2 /*return*/, ''];
                change = typeof input.content === 'string'
                    ? input.content
                    : typeof input.new_string === 'string'
                        ? "".concat(typeof input.old_string === 'string' && input.old_string ? "In place of:\n".concat(input.old_string, "\n\nIt writes:\n") : '').concat(input.new_string)
                        : Array.isArray(input.edits)
                            ? input.edits.map(function (one) { var _a; return String((_a = one === null || one === void 0 ? void 0 : one.new_string) !== null && _a !== void 0 ? _a : ''); }).join('\n…\n')
                            : String((_f = input.new_source) !== null && _f !== void 0 ? _f : '');
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _g.sent();
                top = e.agentId === undefined ? '' : topOf(list, e.agentId);
                card = list.find(function (one) { return one.id === top; });
                _a = holdGate;
                _b = [$, next];
                _c = { id: "".concat(e.tool_use_id, "-f"), call: e.tool_use_id, kind: 'file', host: file, command: cut(change, 2000) };
                return [4 /*yield*/, $.clock.now()];
            case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([__assign.apply(void 0, [(_c.at = _g.sent(), _c), (e.agentId ? { from: e.agentId } : {})]), card ? top : '']))];
            case 3:
                said = _g.sent();
                gate = { kind: 'file' };
                return [2 /*return*/, said === 'once' ? '' : said === 'deny' ? GATE_DENIED(gate) : said === 'late' ? GATE_LATE(gate) : said === 'blind' ? GATE_BLIND(gate) : GATE_GONE(gate)];
        }
    });
}); };
// What a command did to them: a command can write the person's own settings and texts, and the commands always allowed, in ways no
// reading of its text finds (a path built from variables, a program's own code, a process left running that writes later), so they
// are judged by what is in them. What each one last held as the mod or the person put it there is kept in admin-known.json, sealed
// with the gate's key as the always-allowed list is, which work never reads or writes. Every chat compares the files with it as the
// mod loads, as a message of the person's comes, as each tool call begins, as each command ends, and before the mod reads one of
// them (the texts a chat or work is told, the settings the gate and Config read). One that differs is put back as it was, whatever
// changed it and whenever, what it held is kept beside it as <file>.<time>.put-back, and a change to the settings or texts is
// shown on a card, the work's when a command of its made it, where Allow makes it again. A kept copy that is missing, or whose seal
// is not right, is never taken as what they hold: each of them there is moves aside to its .put-back copy, and is offered on a card.
// What this does not stop: a program running as the person that reads the gate's key (F-007) and seals a copy of its own
var PERSON_FILES = ['config.json', 'rules/CLAUDE.md', 'roles/chat.md', 'roles/work.md', 'admin-allowed.json'];
var knownPath = function () { return "".concat(dir, "/admin-known.json"); };
var knownMessage = function (files, count) { return "known\n".concat(count, "\n").concat(JSON.stringify(files)); };
// A file's text, null when there is none, undefined when it could not be read (then it is left alone)
var personRead = function ($, name) { return __awaiter(_this, void 0, void 0, function () {
    var path, isThere;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = "".concat(dir, "/").concat(name);
                return [4 /*yield*/, $.fs.exists(path).catch(function () { return undefined; })];
            case 1:
                isThere = _a.sent();
                if (isThere === undefined)
                    return [2 /*return*/, undefined];
                return [2 /*return*/, isThere ? $.fs.read(path).catch(function () { return undefined; }) : null];
        }
    });
}); };
var personNow = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, _i, PERSON_FILES_1, name_4, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = new Map();
                _i = 0, PERSON_FILES_1 = PERSON_FILES;
                _a.label = 1;
            case 1:
                if (!(_i < PERSON_FILES_1.length)) return [3 /*break*/, 4];
                name_4 = PERSON_FILES_1[_i];
                return [4 /*yield*/, personRead($, name_4)];
            case 2:
                text = _a.sent();
                if (text !== undefined)
                    now.set(name_4, text);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, now];
        }
    });
}); };
// What this chat last found sealed, or sealed itself: the kept copy is checked again only when its text changed. A copy this chat
// took before and that was replaced since (an older copy put back) is not taken again; each carries a count one past the one before
var knownSeen;
var knownPast = new Set();
// The last read could not be checked (the keychain did not answer): not the same as a seal that is wrong
var isKnownUnsure = false;
// What each file is known to hold: undefined when no sealed copy is there (missing, changed by hand, or never made)
var knownRead = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var text, kept, files, count, seal, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                isKnownUnsure = false;
                return [4 /*yield*/, $.fs.read(knownPath()).catch(function () { return ''; })];
            case 1:
                text = _d.sent();
                if (knownSeen && knownSeen.text === text)
                    return [2 /*return*/, new Map(knownSeen.files)];
                if (knownPast.has(text))
                    return [2 /*return*/, undefined];
                _d.label = 2;
            case 2:
                _d.trys.push([2, 4, , 5]);
                kept = JSON.parse(text);
                files = Object.fromEntries(Object.entries((_b = kept.files) !== null && _b !== void 0 ? _b : {}).filter(function (_a) {
                    var name = _a[0], one = _a[1];
                    return PERSON_FILES.includes(name) && (one === null || typeof one === 'string');
                }));
                count = typeof kept.count === 'number' && Number.isSafeInteger(kept.count) ? kept.count : -1;
                if (typeof kept.seal !== 'string')
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, sealed($, 'known-read', [knownMessage(files, count)])];
            case 3:
                seal = (_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c[0];
                if (seal === undefined)
                    isKnownUnsure = true;
                if (seal !== kept.seal)
                    return [2 /*return*/, undefined];
                if (knownSeen)
                    knownPast.add(knownSeen.text);
                knownSeen = { text: text, files: new Map(Object.entries(files)), count: count };
                return [2 /*return*/, new Map(knownSeen.files)];
            case 4:
                _a = _d.sent();
                return [2 /*return*/, undefined];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Whether the kept copy's own key is there: 'no' only when the keychain answered that it is not, 'error' when it did not answer
var knownKey = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hasKeychain($)];
            case 1:
                if (!(_a.sent()))
                    return [2 /*return*/, 'error'];
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', SEAL, 'sh', 'known-has'], { timeoutMs: 20000 }).catch(function () { return undefined; })];
            case 2:
                r = _a.sent();
                return [2 /*return*/, (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? 'yes' : (r === null || r === void 0 ? void 0 : r.exitCode) === 3 ? 'no' : 'error'];
        }
    });
}); };
// Said once in a chat, at the top of the panel: while the key cannot be made or read, a change made outside Claudopus is not caught
var isKnownWarned = false;
var knownWarn = function ($, why) {
    void log($, "the kept copy of the settings and texts is not in force: ".concat(why));
    if (isKnownWarned)
        return;
    isKnownWarned = true;
    $.ui.log("Claudopus couldn't use its key in ".concat(keptWhere(), ": ").concat(why, ". Until it can, Claudopus won't undo changes made outside it to your settings or rules in this chat. Unlock the keychain, or start a new chat once it's unlocked."));
};
var knownWrite = function ($, known, after) { return __awaiter(_this, void 0, void 0, function () {
    var files, count, seal, text, aside, moved;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = Object.fromEntries(known);
                count = after + 1;
                return [4 /*yield*/, sealed($, 'known-make', [knownMessage(files, count)])];
            case 1:
                seal = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[0];
                if (!seal) {
                    knownWarn($, "it couldn't make a seal");
                    throw new Error("the kept copy could not be sealed in ".concat(keptWhere()));
                }
                text = "".concat(JSON.stringify({ files: files, count: count, seal: seal }, null, 2), "\n");
                aside = "".concat(knownPath(), ".").concat(count, "-").concat(Math.random().toString(36).slice(2), ".new");
                return [4 /*yield*/, $.fs.write(aside, text)];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.process.run(['mv', '-f', aside, knownPath()], { timeoutMs: 10000 }).catch(function () { return undefined; })];
            case 3:
                moved = _b.sent();
                if (!((moved === null || moved === void 0 ? void 0 : moved.exitCode) !== 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, $.fs.write(knownPath(), text)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                if (knownSeen)
                    knownPast.add(knownSeen.text);
                knownSeen = { text: text, files: new Map(known), count: count };
                return [2 /*return*/];
        }
    });
}); };
// One chat's changes to it at a time, so two never lose each other's
var knownQueue = Promise.resolve();
var knownSet = function ($, change) {
    var step = knownQueue.then(function () { return __awaiter(_this, void 0, void 0, function () {
        var known;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, knownRead($)];
                case 1:
                    known = (_a = (_d.sent())) !== null && _a !== void 0 ? _a : new Map((_b = knownSeen === null || knownSeen === void 0 ? void 0 : knownSeen.files) !== null && _b !== void 0 ? _b : []);
                    change(known);
                    return [4 /*yield*/, knownWrite($, known, (_c = knownSeen === null || knownSeen === void 0 ? void 0 : knownSeen.count) !== null && _c !== void 0 ? _c : 0)];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    knownQueue = step.catch(function () { return undefined; });
    return step;
};
// The mod wrote one of them itself: that is what it holds now. Kept before the file is written, so no chat takes the write for
// someone else's
var personWrote = function ($, memory, name, text) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir || memory !== dir || !PERSON_FILES.includes(name))
                    return [2 /*return*/];
                return [4 /*yield*/, knownSet($, function (known) { return void known.set(name, text); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Put back as it was; what it held is kept beside it, so nothing the person wrote is ever lost, whatever is pressed
var personPut = function ($, name, text, is) { return __awaiter(_this, void 0, void 0, function () {
    var at, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(is !== null)) return [3 /*break*/, 3];
                _a = Date.bind;
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = new (_a.apply(Date, [void 0, _b.sent()]))().toISOString().slice(0, 23).replace(/[-:]/g, '').replace('T', '-').replace('.', '');
                return [4 /*yield*/, $.fs.write("".concat(dir, "/").concat(name, ".").concat(at).concat(Math.random().toString(36).slice(2, 6), ".put-back"), is).catch(function () { return undefined; })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: 
            // Taken away first, so a link put in its place is replaced, never written through
            return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(dir, "/").concat(name)], { timeoutMs: 10000 }).catch(function () { return undefined; })];
            case 4:
                // Taken away first, so a link put in its place is replaced, never written through
                _b.sent();
                if (!(text !== null)) return [3 /*break*/, 6];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/").concat(name), text)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
// The files compared with what they are known to hold: what differs is put back and offered on a card. `by` is the call whose
// command just ended, when one did; a change found as a call begins, or as the mod loads, is offered at the top of the panel
var personChecking;
var personCheck = function ($, by) { return __awaiter(_this, void 0, void 0, function () {
    var look;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, []
                        // One look at a time in a chat: one asked for while another runs waits for it, then looks again
                    ];
                _a.label = 1;
            case 1:
                if (!personChecking) return [3 /*break*/, 3];
                return [4 /*yield*/, personChecking.catch(function () { return undefined; })];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3:
                look = personLook($, by);
                personChecking = look;
                _a.label = 4;
            case 4:
                _a.trys.push([4, , 6, 7]);
                return [4 /*yield*/, look];
            case 5: return [2 /*return*/, _a.sent()];
            case 6:
                personChecking = undefined;
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
var personLook = function ($, by) { return __awaiter(_this, void 0, void 0, function () {
    var sealedKnown, key, _a, now, known, undone, _loop_2, _i, now_1, _b, name_5, is, _c, PERSON_FILES_2, name_6, _d, undone_1, name_7;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, knownQueue];
            case 1:
                _g.sent();
                return [4 /*yield*/, knownRead($)
                    // Not checked, as the keychain did not answer: a chat that knows what they hold leaves them for the next look, and reads what it
                    // knows meanwhile; one that knows nothing yet says so below
                ];
            case 2:
                sealedKnown = _g.sent();
                // Not checked, as the keychain did not answer: a chat that knows what they hold leaves them for the next look, and reads what it
                // knows meanwhile; one that knows nothing yet says so below
                if (!sealedKnown && isKnownUnsure && knownSeen) {
                    knownWarn($, 'the keychain did not answer');
                    return [2 /*return*/, []];
                }
                if (!(!sealedKnown && !knownSeen)) return [3 /*break*/, 4];
                return [4 /*yield*/, knownKey($)];
            case 3:
                _a = _g.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = 'yes';
                _g.label = 5;
            case 5:
                key = _a;
                if (!(!sealedKnown && !knownSeen && key === 'yes')) return [3 /*break*/, 8];
                return [4 /*yield*/, $.clock.sleep(300)];
            case 6:
                _g.sent();
                return [4 /*yield*/, knownRead($)];
            case 7:
                sealedKnown = _g.sent();
                _g.label = 8;
            case 8: return [4 /*yield*/, personNow($)
                // The keychain did not answer (locked, or refusing): nothing can be told apart, so the files are left as they are, and said
            ];
            case 9:
                now = _g.sent();
                // The keychain did not answer (locked, or refusing): nothing can be told apart, so the files are left as they are, and said
                if (key === 'error') {
                    knownWarn($, 'the keychain did not answer');
                    return [2 /*return*/, []];
                }
                if (!(key === 'no')) return [3 /*break*/, 12];
                return [4 /*yield*/, knownSet($, function (kept) {
                        var _a;
                        kept.clear();
                        for (var _i = 0, PERSON_FILES_3 = PERSON_FILES; _i < PERSON_FILES_3.length; _i++) {
                            var name_8 = PERSON_FILES_3[_i];
                            if (now.has(name_8))
                                kept.set(name_8, (_a = now.get(name_8)) !== null && _a !== void 0 ? _a : null);
                        }
                    })];
            case 10:
                _g.sent();
                return [4 /*yield*/, log($, 'what the settings and texts hold is kept from now on')];
            case 11:
                _g.sent();
                return [2 /*return*/, []];
            case 12:
                known = sealedKnown !== null && sealedKnown !== void 0 ? sealedKnown : (knownSeen ? new Map(knownSeen.files) : new Map());
                if (!!sealedKnown) return [3 /*break*/, 14];
                return [4 /*yield*/, log($, knownSeen ? 'the kept copy of the settings and texts was changed or taken away: made again from what this chat knew' : 'the kept copy of the settings and texts is not sealed right: each own one is offered on a card')];
            case 13:
                _g.sent();
                _g.label = 14;
            case 14:
                undone = [];
                _loop_2 = function (name_5, is) {
                    var was;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                if (personWriting.has(name_5))
                                    return [2 /*return*/, "continue"];
                                was = known.has(name_5) ? ((_e = known.get(name_5)) !== null && _e !== void 0 ? _e : null) : null;
                                if (is === was)
                                    return [2 /*return*/, "continue"];
                                // The always-allowed list holds nothing its seals do not allow: one there as the copy is first made is kept
                                if (name_5 === 'admin-allowed.json' && !known.has(name_5)) {
                                    known.set(name_5, is);
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, personPut($, name_5, was, is)];
                            case 1:
                                _h.sent();
                                undone.push(name_5);
                                return [4 /*yield*/, log($, "".concat(name_5, " was changed outside Claudopus").concat(by ? ' by a command' : '', ", and put back"))
                                    // Offered before the look ends, so the card is there once the call or the load that found it goes on (left to run on its own, a
                                    // slow Mac drew it late, and one begun under an earlier load could land after the next load's and take its card away)
                                ];
                            case 2:
                                _h.sent();
                                if (!(name_5 !== 'admin-allowed.json')) return [3 /*break*/, 4];
                                return [4 /*yield*/, offerUndone($, by, name_5, is).catch(function (err) { return log($, "change to ".concat(name_5, " not offered: ").concat(String(err))); })];
                            case 3:
                                _h.sent();
                                _h.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, now_1 = now;
                _g.label = 15;
            case 15:
                if (!(_i < now_1.length)) return [3 /*break*/, 18];
                _b = now_1[_i], name_5 = _b[0], is = _b[1];
                return [5 /*yield**/, _loop_2(name_5, is)];
            case 16:
                _g.sent();
                _g.label = 17;
            case 17:
                _i++;
                return [3 /*break*/, 15];
            case 18:
                for (_c = 0, PERSON_FILES_2 = PERSON_FILES; _c < PERSON_FILES_2.length; _c++) {
                    name_6 = PERSON_FILES_2[_c];
                    if (now.has(name_6) && !known.has(name_6))
                        known.set(name_6, null);
                }
                if (!!sealedKnown) return [3 /*break*/, 20];
                for (_d = 0, undone_1 = undone; _d < undone_1.length; _d++) {
                    name_7 = undone_1[_d];
                    known.set(name_7, (_f = known.get(name_7)) !== null && _f !== void 0 ? _f : null);
                }
                return [4 /*yield*/, knownSet($, function (kept) {
                        kept.clear();
                        for (var _i = 0, known_1 = known; _i < known_1.length; _i++) {
                            var _a = known_1[_i], name_9 = _a[0], text = _a[1];
                            kept.set(name_9, text);
                        }
                    }).catch(function (err) { return log($, "the kept copy not sealed: ".concat(String(err))); })];
            case 19:
                _g.sent();
                _g.label = 20;
            case 20: return [2 /*return*/, undone];
        }
    });
}); };
// One of them as the mod reads it: what it is known to hold, never a change made since, which a look puts back. A file that is not
// one of them, or a memory folder other than this chat's, is read as it is
var personText = function ($, memory, name) { return __awaiter(_this, void 0, void 0, function () {
    var is, known, was;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, readOr($, "".concat(memory, "/").concat(name))];
            case 1:
                is = _c.sent();
                if (!dir || memory !== dir || !PERSON_FILES.includes(name) || personWriting.has(name))
                    return [2 /*return*/, is
                        // A kept copy changed since this chat last looked (another chat's press, or anyone's write) has its seal checked first; one not
                        // sealed right counts for nothing, and what this chat last knew is read
                    ];
                return [4 /*yield*/, knownRead($).catch(function () { return undefined; })];
            case 2:
                known = (_a = (_c.sent())) !== null && _a !== void 0 ? _a : knownSeen === null || knownSeen === void 0 ? void 0 : knownSeen.files;
                if (!known) {
                    void personCheck($).catch(function () { return undefined; });
                    return [2 /*return*/, is];
                }
                if (!known.has(name))
                    return [2 /*return*/, is];
                was = (_b = known.get(name)) !== null && _b !== void 0 ? _b : '';
                if (was === is)
                    return [2 /*return*/, is];
                void personCheck($).catch(function () { return undefined; });
                return [2 /*return*/, was];
        }
    });
}); };
// The one of these an Edit or Write call names, if any
var personNamed = function (e) {
    var _a, _b, _c;
    if (!dir)
        return '';
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var full = pathOf(String((_b = (_a = e.file_path) !== null && _a !== void 0 ? _a : e.notebook_path) !== null && _b !== void 0 ? _b : ''), home, cwd || home);
    return (_c = PERSON_FILES.find(function (one) { return full.toLowerCase() === "".concat(dir, "/").concat(one).toLowerCase(); })) !== null && _c !== void 0 ? _c : '';
};
// The ones an Edit or Write the person allowed is writing now, in this chat: not compared until it is done
var personWriting = new Set();
// What an allowed Write or Edit leaves in a file that held `before`: undefined when that cannot be worked out
var personMeant = function (e, before) {
    var input = e;
    if (e.tool === 'Write')
        return typeof input.content === 'string' ? input.content : undefined;
    var edit = function (text, one) {
        if (text === undefined || typeof one.old_string !== 'string' || typeof one.new_string !== 'string')
            return undefined;
        if (one.old_string === '')
            return text === '' ? one.new_string : undefined;
        if (!text.includes(one.old_string))
            return undefined;
        return one.replace_all ? text.split(one.old_string).join(one.new_string) : text.replace(one.old_string, function () { return String(one.new_string); });
    };
    if (e.tool === 'Edit')
        return edit(before !== null && before !== void 0 ? before : undefined, input);
    if (e.tool === 'MultiEdit' && Array.isArray(input.edits))
        return input.edits.reduce(function (text, one) { return edit(text, (one !== null && one !== void 0 ? one : {})); }, before !== null && before !== void 0 ? before : undefined);
    return undefined;
};
// A file of these that Edit or Write changed, as the person allowed: what it holds now is the person's, when it is what the call
// meant to write. Anything else (a program writing in the same moment) is left for the next look to put back and offer
var personSeen = function ($, e, before) { return __awaiter(_this, void 0, void 0, function () {
    var name, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir || !FILE_TOOLS.includes(e.tool))
                    return [2 /*return*/];
                name = personNamed(e);
                if (!name)
                    return [2 /*return*/];
                return [4 /*yield*/, personRead($, name)];
            case 1:
                text = _a.sent();
                if (text === undefined)
                    return [2 /*return*/];
                if (text !== personMeant(e, before))
                    return [2 /*return*/, void log($, "".concat(name, " after an allowed ").concat(e.tool, " is not what it wrote: left for the look to put back"))];
                return [4 /*yield*/, personWrote($, dir, name, text)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var PERSON_UNDONE = function (names) {
    return named("This command changed ".concat(names.join(', '), " in {name}'s memory folder, and the change was undone: {name}'s own settings and texts are changed only with the Edit or Write tool, which waits for {name}'s press on the task's card. Don't try to change them another way."));
};
// The change undone, on the card of the work whose command made it, else at the top: Allow makes it again. One card for each file:
// a later change to it replaces the one shown
var offerUndone = function ($, by, name, text) { return __awaiter(_this, void 0, void 0, function () {
    var list, top, card, what, at, id, _loop_3, _i, undoneOffers_1, _a, other, offer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                list = _b.sent();
                top = (by === null || by === void 0 ? void 0 : by.agentId) === undefined ? '' : topOf(list, by.agentId);
                card = list.find(function (one) { return one.id === top; });
                what = name === 'config.json' ? 'your Claudopus settings (config.json)' : name.startsWith('rules/') ? "your rules (".concat(name, ")") : "your role file (".concat(name, ")");
                return [4 /*yield*/, $.clock.now()];
            case 2:
                at = _b.sent();
                id = "".concat(by ? by.tool_use_id : "seen".concat(at.toString(36)), "-u-").concat(name.replace(/[^A-Za-z0-9]/g, ''));
                _loop_3 = function (other, offer) {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (offer.name !== name)
                                    return [2 /*return*/, "continue"];
                                undoneOffers.delete(other);
                                gateHeld.delete(other);
                                return [4 /*yield*/, setGates($, offer.top, function (gates) { return gates.filter(function (one) { return one.id !== other; }); })];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, undoneOffers_1 = undoneOffers;
                _b.label = 3;
            case 3:
                if (!(_i < undoneOffers_1.length)) return [3 /*break*/, 6];
                _a = undoneOffers_1[_i], other = _a[0], offer = _a[1];
                return [5 /*yield**/, _loop_3(other, offer)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                // Nothing waits on it: the card offers it until pressed, and the press itself makes the change again
                undoneOffers.set(id, { name: name, text: text, top: card ? top : '' });
                gateHeld.add(id);
                gatePressed.delete(id);
                return [4 /*yield*/, setGates($, card ? top : '', function (gates) { return __spreadArray(__spreadArray([], gates.filter(function (one) { return one.id !== id; }), true), [__assign(__assign(__assign({ id: id, kind: 'file', isUndone: true }, (by ? {} : { isOutside: true })), { host: what, command: cut(text !== null && text !== void 0 ? text : '(the file was removed)', 2000), at: at }), ((by === null || by === void 0 ? void 0 : by.agentId) ? { from: by.agentId } : {}))], false); })];
            case 7:
                _b.sent();
                return [4 /*yield*/, openList($).catch(function () { return undefined; })];
            case 8:
                _b.sent();
                $.ui.log("".concat(card ? "A command of \"".concat(titleOf(card), "\" changed") : by ? 'A command changed' : 'Something outside Claudopus changed', " ").concat(what, ", so Claudopus undid it. To make the change again, press Allow ").concat(card ? 'on its card in' : 'at the top of', " the Claudopus panel. Don't allow keeps it undone."));
                return [2 /*return*/];
        }
    });
}); };
var undoneOffers = new Map();
var answerUndone = function ($, gate, said) { return __awaiter(_this, void 0, void 0, function () {
    var offer, list;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                offer = undoneOffers.get(gate.id);
                undoneOffers.delete(gate.id);
                gateHeld.delete(gate.id);
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _c.sent();
                return [4 /*yield*/, setGates($, list.some(function (one) { var _a; return (_a = one.admins) === null || _a === void 0 ? void 0 : _a.some(function (g) { return g.id === gate.id; }); }) ? ((_b = (_a = list.find(function (one) { var _a; return (_a = one.admins) === null || _a === void 0 ? void 0 : _a.some(function (g) { return g.id === gate.id; }); })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '') : '', function (gates) { return gates.filter(function (one) { return one.id !== gate.id; }); })];
            case 2:
                _c.sent();
                if (said !== 'once' || !offer || !dir)
                    return [2 /*return*/, log($, "change to ".concat(gate.host, ": left undone"))];
                return [4 /*yield*/, personWrote($, dir, offer.name, offer.text)];
            case 3:
                _c.sent();
                return [4 /*yield*/, personPut($, offer.name, offer.text, null)];
            case 4:
                _c.sent();
                return [4 /*yield*/, log($, "change to ".concat(gate.host, ": made again, as allowed"))];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A path in one line: the home folder as ~, and the middle left out past `room` characters, keeping its last folders
var shortPath = function (path, room) {
    var _a;
    if (room === void 0) { room = 44; }
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var p = home && (path === home || path.startsWith("".concat(home, "/"))) ? "~".concat(path.slice(home.length)) : path;
    if (p.length <= room)
        return p;
    var parts = p.split('/');
    for (var keep = parts.length - 2; keep >= 1; keep--) {
        var short_1 = "".concat(parts[0], "/\u2026/").concat(parts.slice(-keep).join('/'));
        if (short_1.length <= room)
            return short_1;
    }
    return "\u2026/".concat((_a = parts.at(-1)) !== null && _a !== void 0 ? _a : '');
};
