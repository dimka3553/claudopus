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
var gateSaid = new Map();
// A gate of the chat's own thread, which has no card (a chat that does its own work): drawn at the top of the panel
var looseGates = [];
// The pieces of work allowed under "work", by card: taken out as the work ends (ended, in cards), so one that comes back asks again
var workAllowed = new Set();
var GATE_DENIED = function () {
    return named('Refused by {name}: {name} pressed Deny on this admin command, so it did not run. Do not try to run it another way. Carry on without it, or say what it is needed for and ask again.');
};
var GATE_GONE = function () { return named('This admin command did not run: the wait for {name} to allow it was cut short. Run it again if it is still needed.'); };
var GATE_LATE = function () { return named('This admin command did not run: {name} did not answer in the time a call can be held. Run it again when it is needed, and {name} is asked again.'); };
var GATE_BLIND = function () { return named('This admin command did not run: {name} is asked before every admin command, on a card in the Claudopus panel, and no panel is drawn for this chat.'); };
var GATE_UNSEALED = function () { return "This admin command did not run: what was allowed could not be sealed in ".concat(keptWhere(), ". Run it again."); };
var NO_GATE_TOUCH = function () {
    return named('The list of admin commands {name} always allows, what {name} allowed and the key that seals them are never read or written by work: only {name} adds to them, with a press on a card or in Config.');
};
var MACOS_ONLY_HERE = function () {
    return named("This admin command did not run: {name} set admin commands to let macOS ask for the password and keep none, which works only on this Mac's own screen, never over SSH on another Mac.");
};
var MACOS_AFAR = function () {
    return named("This admin command did not run: {name} set admin commands to let macOS ask for the password and keep none. macOS asks on this Mac's own screen, which {name} cannot see from this chat, so nothing runs as admin here until {name} is at this Mac or changes that in Config.");
};
// The admin commands a Bash command runs, as the shell splits it: bin/admin by any spelling of its path, after what runs a
// command it is handed, and inside a shell's -c or an eval. What the shell would build (a variable, a substitution) is read as
// written, so the grant names what was shown and bin/admin refuses what differs
var isAdminPath = function (word, root) {
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
    return path === 'admin' || path === 'bin/admin' || (path.endsWith('/bin/admin') && (path === "".concat(root, "/bin/admin") || /claudopus/i.test(path) || path.includes('$')));
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
var SEAL = "set -u\nPATH=/usr/bin:/bin\nmode=$1\nshift\nif [ -x /usr/bin/security ]; then\n  key() { /usr/bin/security find-generic-password -s ".concat(GATE_SERVICE, " -a seal -w 2>/dev/null; }\n  keep() { printf 'add-generic-password -U -s \"").concat(GATE_SERVICE, "\" -a \"seal\" -l \"Claudopus admin gate\" -w \"%s\"\\n' \"$1\" | /usr/bin/security -i >/dev/null 2>&1; }\nelse\n  # Linux: where bin/keyring keeps it, a file only this user reads\n  d=${XDG_DATA_HOME:-$HOME/.local/share}\n  case $d in /*) ;; *) d=$HOME/.local/share ;; esac\n  f=$d/claudopus/keyring/").concat(GATE_SERVICE, "\n  key() { [ -f \"$f/seal\" ] && cat \"$f/seal\" 2>/dev/null; }\n  keep() { (umask 077; mkdir -p \"$f\" && chmod 700 \"$d/claudopus\" \"$d/claudopus/keyring\" \"$f\" && printf '%s' \"$1\" >\"$f/.seal.new\" && mv -f \"$f/.seal.new\" \"$f/seal\"); }\nfi\nk=$(key)\nif [ \"$mode\" = new ] || { [ -z \"$k\" ] && [ \"$mode\" = make ]; }; then\n  k=$(/usr/bin/openssl rand -hex 32 2>/dev/null || od -An -tx1 -N32 /dev/urandom | tr -d ' \\n') || exit 1\n  [ ${#k} = 64 ] || exit 1\n  keep \"$k\"\n  [ \"$(key)\" = \"$k\" ] || exit 1\nfi\n[ -n \"$k\" ] || exit 3\nfor m in \"$@\"; do\n  printf '%s\\n%s' \"$k\" \"$m\" | /usr/bin/perl -MDigest::SHA=hmac_sha256_hex -e '$k = <STDIN>; chomp $k; local $/; $m = <STDIN>; print hmac_sha256_hex($m // \"\", $k), \"\\n\"' || exit 1\ndone");
var sealed = function ($, mode, messages) { return __awaiter(_this, void 0, void 0, function () {
    var r, lines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(__spreadArray(['/bin/sh', '-c', SEAL, 'sh', mode], messages, true), { timeoutMs: 20000 }).catch(function () { return undefined; })];
            case 1:
                r = _a.sent();
                lines = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout.split('\n').filter(Boolean) : undefined;
                return [2 /*return*/, lines && lines.length === messages.length && lines.every(function (line) { return /^[0-9a-f]{64}$/.test(line); }) ? lines : undefined];
        }
    });
}); };
// What is in force: "work" or "never" only as Config sealed it, every command asked otherwise; and where the password comes from
var gateOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var config, said, password, seal, isSealed;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, readConfig($, dir)];
            case 1:
                config = _b.sent();
                said = config.admin === 'work' || config.admin === 'never' ? config.admin : 'each';
                password = config.adminPassword === 'macos' ? 'macos' : 'keep';
                if (said === 'each')
                    return [2 /*return*/, { mode: 'each', unsealed: '', password: password }];
                return [4 /*yield*/, sealed($, 'read', ["mode\n".concat(said)])];
            case 2:
                seal = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[0];
                isSealed = Boolean(seal) && seal === config.adminSealed;
                return [2 /*return*/, { mode: isSealed ? said : 'each', unsealed: isSealed ? '' : said, password: password }];
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
                return [4 /*yield*/, readOr($, allowedPath())];
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
    return $.fs.write(allowedPath(), "".concat(JSON.stringify(kept, null, 2), "\n"));
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
// "Let macOS ask, keep nothing": every password kept for an admin command leaves the keychain
var FORGET_KEPT = 'if [ -x /usr/bin/security ]; then n=0; while [ $n -lt 50 ] && /usr/bin/security delete-generic-password -s claudopus-admin >/dev/null 2>&1; do n=$((n + 1)); done; else d=${XDG_DATA_HOME:-$HOME/.local/share}; case $d in /*) ;; *) d=$HOME/.local/share ;; esac; rm -rf "$d/claudopus/keyring/claudopus-admin"; fi';
var setAdminPassword = function ($, value) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setConfig($, dir, 'adminPassword', value === 'macos' ? 'macos' : undefined)];
            case 1:
                _a.sent();
                if (!(value === 'macos')) return [3 /*break*/, 3];
                return [4 /*yield*/, $.process.run(['/bin/sh', '-c', FORGET_KEPT], { timeoutMs: 30000 }).catch(function (err) { return log($, "kept admin passwords not forgotten: ".concat(String(err))); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// What a press allowed, for bin/admin to take once: the Mac and the exact command, sealed. One nothing took goes as its call ends
var grantsDir = function () { return "".concat(dir, "/admin-grants"); };
var issueGrant = function ($, id, call) { return __awaiter(_this, void 0, void 0, function () {
    var at, name, seal;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _b.sent();
                name = "".concat(id.replace(/[^A-Za-z0-9_-]/g, ''), "-").concat(at);
                return [4 /*yield*/, sealed($, 'make', ["grant\n".concat(name, "\n").concat(at, "\n").concat(call.host, "\n").concat(call.command)])];
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
}); };
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
var touchesGate = function (e) {
    var _a, _b, _c;
    if (e.tool === 'Bash') {
        var command = String((_a = e.command) !== null && _a !== void 0 ? _a : '');
        return /claudopus\/admin-(?:allowed\.json|grants)\b/.test(command) || (/\bsecurity\b/.test(command) && command.includes(GATE_SERVICE));
    }
    var path = String((_c = (_b = e.file_path) !== null && _b !== void 0 ? _b : e.notebook_path) !== null && _c !== void 0 ? _c : '');
    return ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool) && /\/claudopus\/admin-(?:allowed\.json$|grants(?:\/|$))/.test(path);
};
var setGates = function ($, top, fn) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!top) return [3 /*break*/, 1];
                looseGates = fn(looseGates);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { var _a, _b; return (one.id !== top ? one : __assign(__assign({}, one), { admins: fn((_a = one.admins) !== null && _a !== void 0 ? _a : []).length ? fn((_b = one.admins) !== null && _b !== void 0 ? _b : []) : undefined })); }); })];
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
                return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.admins ? __assign(__assign({}, one), { admins: one.admins.filter(function (gate) { return gateHeld.has(gate.id); }).length ? one.admins.filter(function (gate) { return gateHeld.has(gate.id); }) : undefined }) : one); }); })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Holds the call until the person presses. A hook's own time is bounded, and time spent in a call on the engine is not counted:
// the wait is a one-second sleep run by the engine, again and again, the press read from memory between them
var holdGate = function ($, next, gate, top) { return __awaiter(_this, void 0, void 0, function () {
    var card, _a, where, text, said, _b;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                if (!(_f.sent()).length)
                    return [2 /*return*/, 'blind'];
                gateHeld.add(gate.id);
                return [4 /*yield*/, setGates($, top, function (list) { return __spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== gate.id; }), true), [gate], false); })];
            case 2:
                _f.sent();
                return [4 /*yield*/, openList($).catch(function () { return undefined; })];
            case 3:
                _f.sent();
                if (!top) return [3 /*break*/, 5];
                return [4 /*yield*/, read($, todos)];
            case 4:
                _a = (_f.sent()).find(function (one) { return one.id === top; });
                return [3 /*break*/, 6];
            case 5:
                _a = undefined;
                _f.label = 6;
            case 6:
                card = _a;
                where = gate.host === 'here' ? thisMac() : gate.host;
                text = "Wants to run an admin command on ".concat(where, ": ").concat(cut(oneLine(gate.command), 200));
                return [4 /*yield*/, (card ? askAloud($, card, text) : aloud($, 'ask', 'An admin command needs you', text, "gate-".concat(gate.id))).catch(function (err) { return log($, "admin command not told: ".concat(String(err))); })];
            case 7:
                _f.sent();
                $.ui.log("".concat(card ? "The work \"".concat(titleOf(card), "\"") : 'This chat', " wants to run an admin command on ").concat(where, ": ").concat(cut(oneLine(gate.command), 300), " \u00B7 Press ").concat(gate.isWork ? 'Allow for this work' : 'Allow once', ", Always allow this command or Deny ").concat(card ? 'on its card' : 'at the top', " in the Claudopus panel (/claudopus opens it). Nothing typed in the chat allows it."));
                _f.label = 8;
            case 8:
                _f.trys.push([8, , 15, 17]);
                _f.label = 9;
            case 9:
                said = gateSaid.get(gate.id);
                if (said)
                    return [3 /*break*/, 14];
                _b = ((_c = next.signal) === null || _c === void 0 ? void 0 : _c.aborted);
                if (_b) return [3 /*break*/, 11];
                return [4 /*yield*/, isReplaced($)];
            case 10:
                _b = (_f.sent());
                _f.label = 11;
            case 11:
                if (_b)
                    said = 'gone';
                else if (((_e = (_d = next.budget) === null || _d === void 0 ? void 0 : _d.remainingMs) !== null && _e !== void 0 ? _e : Infinity) < 1500)
                    said = 'late';
                if (said)
                    return [3 /*break*/, 14];
                return [4 /*yield*/, $.process.run(['/bin/sleep', '1'], { timeoutMs: 10000 }).catch(function () { return undefined; })];
            case 12:
                _f.sent();
                _f.label = 13;
            case 13: return [3 /*break*/, 9];
            case 14: return [3 /*break*/, 17];
            case 15:
                gateHeld.delete(gate.id);
                gateSaid.delete(gate.id);
                return [4 /*yield*/, setGates($, top, function (list) { return list.filter(function (one) { return one.id !== gate.id; }); }).catch(function () { return undefined; })];
            case 16:
                _f.sent();
                return [7 /*endfinally*/];
            case 17: return [4 /*yield*/, log($, "admin command on ".concat(gate.host, ": ").concat(said === 'once' ? 'allowed once' : said === 'always' ? 'always allowed' : said === 'deny' ? 'denied' : 'not answered'))];
            case 18:
                _f.sent();
                return [2 /*return*/, said];
        }
    });
}); };
var answerGate = function ($, gate, said) {
    presses += 1;
    var id = gate.id;
    if (gateHeld.has(id)) {
        gateSaid.set(id, said);
        void noteDone($, {
            id: "gate-".concat(id),
            head: "An admin command on ".concat(gate.host === 'here' ? thisMac() : gate.host),
            said: said === 'deny'
                ? 'You denied it · it did not run, and the work was told'
                : said === 'always'
                    ? 'You always allow this command · it runs now, and will not ask again'
                    : gate.isWork
                        ? "You allowed this work's admin commands · it runs now"
                        : 'You allowed it once · it runs now',
            what: cut(oneLine(gate.command), 200),
            isOn: said !== 'deny',
        }).catch(function () { return undefined; });
    }
    redraw($);
};
// Before a Bash call runs: each admin command in it is allowed already (never asked, this work allowed, the command always
// allowed) or waits for the press; allowed, it gets its grant. Refused, the call does not run
var gateAdmin = function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
    var calls, gate, list, top, card, grants, _i, _a, _b, n, call, isWork, isCovered, _c, said_1, _d, _e, grant;
    var _f;
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
                if (gate.password === 'macos' && calls.some(function (one) { return one.host !== 'here'; }))
                    return [2 /*return*/, { deny: MACOS_ONLY_HERE(), grants: [] }];
                if (gate.password === 'macos' && isRunFromAfar)
                    return [2 /*return*/, { deny: MACOS_AFAR(), grants: [] }];
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
                _f = { id: "".concat(e.tool_use_id, "-").concat(n), host: call.host, command: call.command };
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
                return [4 /*yield*/, allowAlways($, call).catch(function (err) { return log($, "admin command not always allowed: ".concat(String(err))); })];
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
// On the card: what it wants to run, whole, and the three presses. Another chat's panel shows it with no buttons: only the chat
// that holds the call allows it
var gateRow = function ($, ui, gate, key, isElsewhere) { return (<ui.Box key={key} flexDirection="column" gap={1}>
    <ui.Text wrap="wrap" color={NEEDS} bold>{"Wants to run an admin command on ".concat(gate.host === 'here' ? thisMac() : gate.host)}</ui.Text>
    <ui.Box backgroundColor={FILL} paddingLeft={2}>
      <ui.Text mono wrap="wrap">{gate.command}</ui.Text>
    </ui.Box>
    <ui.Text wrap="wrap">{"Allow: it runs with admin rights".concat(gate.isWork ? ', and this work runs its next admin commands without asking' : '', ". Deny: it does not run, and the work is told.")}</ui.Text>
    {gateHeld.has(gate.id) && !isElsewhere ? (<ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
        <ui.Button key={"".concat(key, "-once-").concat(loadMark)} label={gate.isWork ? 'Allow for this work' : 'Allow once'} onPress={function () { return answerGate($, gate, 'once'); }}/>
        <ui.Button key={"".concat(key, "-always-").concat(loadMark)} label="Always allow this command" onPress={function () { return answerGate($, gate, 'always'); }}/>
        <ui.Button key={"".concat(key, "-deny-").concat(loadMark)} label="Deny" onPress={function () { return answerGate($, gate, 'deny'); }}/>
      </ui.Box>) : (<ui.Text dimColor wrap="wrap">{isElsewhere ? 'Allow or deny it on its card in its own chat.' : 'It no longer waits.'}</ui.Text>)}
  </ui.Box>); };
var adminBlock = function ($, ui, one, key) {
    var _a;
    return ((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) ? (<ui.Box key={key} flexDirection="column" gap={1}>
      {one.admins.map(function (gate) { return gateRow($, ui, gate, "gate-".concat(gate.id), Boolean(one.chat)); })}
    </ui.Box>) : null;
};
// A gate with no card, at the top of the panel
var gatesPart = function ($, ui) {
    return looseGates.map(function (gate) { return (<ui.Box key={"gate-top-".concat(gate.id)} flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      {gateRow($, ui, gate, "gate-".concat(gate.id), false)}
    </ui.Box>); });
};
