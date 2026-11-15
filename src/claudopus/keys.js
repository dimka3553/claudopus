// The keys remembered: which keys, tokens and logins the person has given, and where each is kept, by name only, never a value.
// It is made again from each store's own list of names (Claudopus's keychain, the rest of this Mac's keychain, the .env files in each
// subject's folder) and from what SBOS last said it holds, so a key taken out of a store stops being listed. Work reads it in
// keys.md in the memory folder, the Keys button shows it, and work that asks for a key it lists is told where that key is
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
var KEYS_FILE = 'keys.md';
var KEYS_STATE = 'keys.json';
// How long the local stores' names are trusted before they are read again, for an ask checked against them
var KEYS_MS = 60000;
var STORE_NAMES = {
    claudopus: "Claudopus's keychain",
    keychain: "this Mac's keychain",
    sbos: 'SBOS secrets',
    env: 'a .env file',
};
// A name as it is kept: plain marks only, and short, so no text that is not a name can pass for one
var plainName = function (text) { return (/^[\w .:@/+|-]{1,80}$/.test(text) ? text : ''); };
// The words a key's name is made of, less those every key's name has: ELEVENLABS_API_KEY and elevenlabs-key are both "elevenlabs"
var KEY_WORDS = new Set(['api', 'key', 'keys', 'token', 'tokens', 'secret', 'secrets', 'access', 'password', 'passwd', 'pat', 'auth', 'the']);
var coreOf = function (name) {
    return name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(function (word) { return word && !KEY_WORDS.has(word); });
};
var sameKey = function (a, b) {
    var x = coreOf(a);
    var y = coreOf(b);
    return x.length > 0 && x.length === y.length && x.every(function (word) { return y.includes(word); });
};
// A keychain entry that is a key someone gave by hand, not an app's own storage: its service names an API, a token or a key, or its
// account is a name such as ELEVENLABS_API_KEY. The mod's own services are read as Claudopus's keychain or not at all
var isKeyEntry = function (service, account) {
    return !service.startsWith('claudopus') &&
        !/safe storage|^com\.apple\.|^apple/i.test(service) &&
        ((/(?:^|[-_ .])(?:api|token|key)s?(?:$|[-_ .])/i.test(service)) || /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/.test(account));
};
// A variable in a .env file that holds a key, by its name
var isKeyVariable = function (name) { return /(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|_PAT|CREDENTIALS?)(?:_|$)/.test(name); };
var keys = { at: 0, entries: [] };
var keysRead = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var kept, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/").concat(KEYS_STATE))];
            case 1:
                kept = _b.apply(_a, [(_d.sent()) || '{}']);
                return [2 /*return*/, { at: Number(kept.at) || 0, sbosAt: kept.sbosAt, entries: Array.isArray(kept.entries) ? kept.entries : [] }];
            case 2:
                _c = _d.sent();
                return [2 /*return*/, { at: 0, entries: [] }];
            case 3: return [2 /*return*/];
        }
    });
}); };
// The names each local store lists now; undefined for a store that could not be read, so what was known of it stays
var localNames = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var mod, all, claudopus, keychain, env, folders, _a, _b, _i, folders_1, folder, files, _c, files_1, file, r, _d, _e, line, name_1;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, $.process.run(["".concat($.plugin.root, "/bin/secret"), '--list']).catch(function () { return undefined; })];
            case 1:
                mod = _g.sent();
                return [4 /*yield*/, $.process.run(["".concat($.plugin.root, "/bin/keyring"), 'entries']).catch(function () { return undefined; })];
            case 2:
                all = _g.sent();
                claudopus = (mod === null || mod === void 0 ? void 0 : mod.exitCode) === 0 ? mod.stdout.split('\n').map(function (one) { return plainName(one.trim()); }).filter(Boolean) : undefined;
                keychain = (all === null || all === void 0 ? void 0 : all.exitCode) === 0
                    ? all.stdout
                        .split('\n')
                        .map(function (line) { return line.split('\t'); })
                        .filter(function (_a) {
                        var _b = _a[0], service = _b === void 0 ? '' : _b, _c = _a[1], account = _c === void 0 ? '' : _c;
                        return isKeyEntry(service, account);
                    })
                        .map(function (_a) {
                        var _b = _a[0], service = _b === void 0 ? '' : _b, _c = _a[1], account = _c === void 0 ? '' : _c;
                        return ({ name: plainName(/^[A-Z][A-Z0-9_]+$/.test(account) ? account : service), where: plainName("".concat(service).concat(account ? " / ".concat(account) : '')) });
                    })
                        .filter(function (one) { return one.name; })
                    : undefined;
                env = [];
                _a = [[]];
                _b = Set.bind;
                return [4 /*yield*/, readIndex($).catch(function () { return []; })];
            case 3:
                folders = __spreadArray.apply(void 0, _a.concat([new (_b.apply(Set, [void 0, (_g.sent()).map(function (one) { return one.repo; }).filter(function (one) { return one.startsWith('/'); })]))(), true]));
                _i = 0, folders_1 = folders;
                _g.label = 4;
            case 4:
                if (!(_i < folders_1.length)) return [3 /*break*/, 10];
                folder = folders_1[_i];
                return [4 /*yield*/, $.fs.list(folder).catch(function () { return []; })];
            case 5:
                files = (_g.sent()).map(function (one) { return one.name; }).filter(function (name) { return /^\.env(?:\.[\w-]+)?$/.test(name) && !/\.(?:example|sample|template|dist)$/.test(name); });
                _c = 0, files_1 = files;
                _g.label = 6;
            case 6:
                if (!(_c < files_1.length)) return [3 /*break*/, 9];
                file = files_1[_c];
                return [4 /*yield*/, $.process.run(['/usr/bin/grep', '-ohE', '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=', "".concat(folder, "/").concat(file)]).catch(function () { return undefined; })];
            case 7:
                r = _g.sent();
                for (_d = 0, _e = ((_f = r === null || r === void 0 ? void 0 : r.stdout) !== null && _f !== void 0 ? _f : '').split('\n'); _d < _e.length; _d++) {
                    line = _e[_d];
                    name_1 = line.replace(/^\s*(?:export\s+)?/, '').replace(/\s*=$/, '');
                    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name_1) && isKeyVariable(name_1))
                        env.push({ name: name_1, where: "".concat(folder, "/").concat(file) });
                }
                _g.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9:
                _i++;
                return [3 /*break*/, 4];
            case 10: return [2 /*return*/, { claudopus: claudopus, keychain: keychain, env: env }];
        }
    });
}); };
// The list made again: each local store as it lists its names now, SBOS as it last said; what a store no longer lists goes
var refreshKeys = function ($_1, sbos_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, sbos_1], args_1, true), void 0, function ($, sbos, isListed) {
        var now, before, _a, claudopus, keychain, env, old, made, kept, entries, text, state;
        if (isListed === void 0) { isListed = true; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!dir)
                        return [2 /*return*/, keys];
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    now = _b.sent();
                    return [4 /*yield*/, keysRead($)];
                case 2:
                    before = _b.sent();
                    return [4 /*yield*/, localNames($)];
                case 3:
                    _a = _b.sent(), claudopus = _a.claudopus, keychain = _a.keychain, env = _a.env;
                    old = function (store, name, where) { return before.entries.find(function (one) { return one.store === store && one.name === name && one.where === where; }); };
                    made = function (store, name, extra) {
                        var _a, _b, _c, _d, _e;
                        if (extra === void 0) { extra = {}; }
                        return (__assign(__assign({ name: name, store: store }, extra), { isPresent: (_a = extra.isPresent) !== null && _a !== void 0 ? _a : true, added: (_c = (_b = old(store, name, extra.where)) === null || _b === void 0 ? void 0 : _b.added) !== null && _c !== void 0 ? _c : now, seen: extra.isPresent === false ? ((_e = (_d = old(store, name, extra.where)) === null || _d === void 0 ? void 0 : _d.seen) !== null && _e !== void 0 ? _e : 0) : now }));
                    };
                    kept = function (store, fresh) { return fresh !== null && fresh !== void 0 ? fresh : before.entries.filter(function (one) { return one.store === store; }); };
                    entries = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], kept('claudopus', claudopus === null || claudopus === void 0 ? void 0 : claudopus.map(function (name) { return made('claudopus', name); })), true), kept('keychain', keychain === null || keychain === void 0 ? void 0 : keychain.map(function (one) { return made('keychain', one.name, { where: one.where }); })), true), env.map(function (one) { return made('env', one.name, { where: one.where }); }), true), kept('sbos', sbos === null || sbos === void 0 ? void 0 : sbos.map(function (one) { return made('sbos', one.name, { label: one.label, isPresent: one.isPresent }); })), true);
                    keys = { at: now, sbosAt: sbos && isListed ? now : before.sbosAt, entries: entries };
                    return [4 /*yield*/, keysHidden($, keysText($.plugin.root, keys))];
                case 4:
                    text = _b.sent();
                    return [4 /*yield*/, keysHidden($, "".concat(JSON.stringify(keys, null, 2), "\n"))];
                case 5:
                    state = _b.sent();
                    if (!(text === undefined || state === undefined)) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, 'the list of keys was not written: it could not be checked for kept values')];
                case 6: return [2 /*return*/, (_b.sent(), keys)];
                case 7: return [4 /*yield*/, $.fs.write("".concat(dir, "/").concat(KEYS_STATE), state)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/").concat(KEYS_FILE), text)];
                case 9:
                    _b.sent();
                    return [2 /*return*/, keys];
            }
        });
    });
};
// The text with every kept value hidden, as bin/secret hides a command's output; undefined when it could not be checked
var keysHidden = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(["".concat($.plugin.root, "/bin/secret"), '--hide'], { stdin: text }).catch(function () { return undefined; })];
            case 1:
                r = _a.sent();
                return [2 /*return*/, r && r.exitCode === 0 && !r.isStdoutTruncated && r.stdout.trim() ? r.stdout : undefined];
        }
    });
}); };
var keysFresh = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                if (!!keys.at) return [3 /*break*/, 3];
                return [4 /*yield*/, keysRead($)];
            case 2:
                keys = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, now - keys.at < KEYS_MS ? keys : refreshKeys($)];
        }
    });
}); };
var dayOf = function (at) { return (at ? new Date(at).toISOString().slice(0, 10) : ''); };
// How work uses a key, by its store's own route; the value never passes through the work
var routeOf = function (root, one) {
    return one.store === 'claudopus'
        ? "`".concat(root, "/bin/secret ").concat(one.name, " here '<command using $").concat(one.name, ">'`")
        : one.store === 'sbos'
            ? one.isPresent
                ? "SBOS by its name: `send_with_secret` with {{secret:".concat(one.name, "}}, or `secret_link` for a command")
                : "asked in SBOS but never put in: ask for it in the secret runner instead"
            : one.store === 'keychain'
                ? "kept by another app (".concat(one.where, "): work cannot use it; {name} can paste it into Claudopus's keychain once")
                : "in ".concat(one.where, ", which that project's own scripts load");
};
var keysText = function (root, state) {
    var rows = __spreadArray([], state.entries, true).sort(function (a, b) { return Number(b.isPresent) - Number(a.isPresent) || a.store.localeCompare(b.store) || a.name.localeCompare(b.name); })
        .map(function (one) { return "| ".concat(one.name, " | ").concat(one.label ? oneLine(one.label).replace(/\|/g, '/').slice(0, 80) : '', " | ").concat(STORE_NAMES[one.store], " | ").concat(one.isPresent ? 'present' : 'asked, not given', " | ").concat(dayOf(one.added), " | ").concat(dayOf(one.seen), " | ").concat(named(routeOf(root, one)).replace(/\|/g, '/'), " |"); });
    return __spreadArray(__spreadArray([
        '# Keys',
        '',
        "The keys, tokens and logins ".concat(who(), " has given, by name and where each is kept: never a value. Made again from each store's own list of names on ").concat(dayOf(state.at), "; SBOS's as it last listed them").concat(state.sbosAt ? " on ".concat(dayOf(state.sbosAt)) : ' (not yet listed: call its `secrets`)', ". A key taken out of a store goes from here."),
        '',
        '| Name | For | Store | State | Added | Last seen | How work uses it |',
        '| --- | --- | --- | --- | --- | --- | --- |'
    ], rows, true), [
        '',
    ], false).join('\n');
};
// SBOS's answer to `secrets`: its list of names, whose state says whether each was put in. Only the names, what each is for and that
// state are taken; anything else in it is left
var sbosListed = function (result) {
    var texts = [];
    var walk = function (x) { return (typeof x === 'string' ? texts.push(x) : Array.isArray(x) ? x.forEach(walk) : x && typeof x === 'object' ? Object.values(x).forEach(walk) : undefined); };
    walk(result);
    for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
        var text = texts_1[_i];
        try {
            var list = JSON.parse(text);
            if (!Array.isArray(list))
                continue;
            return list
                .filter(function (one) { return Boolean(one) && typeof one === 'object' && typeof one.name === 'string'; })
                .map(function (one) { return ({ name: plainName(one.name), label: typeof one.label === 'string' ? oneLine(one.label).slice(0, 120) : undefined, isPresent: one.put_in === true }); })
                .filter(function (one) { return one.name; });
        }
        catch (_a) { }
    }
    return undefined;
};
// The key an ask is for, when the list says it is kept where work can use it: what the ask is told back, or ''
var usable = function (one) { return one.isPresent && (one.store === 'claudopus' || one.store === 'sbos'); };
var KEY_KEPT = function (root, one, asked) {
    return named("Not asked: {name} gave this key already. ".concat(asked === one.name ? one.name : "\"".concat(asked, "\" is ").concat(one.name), ", kept in ").concat(STORE_NAMES[one.store]).concat(one.seen ? " and last seen there ".concat(dayOf(one.seen)) : '', ". Use it through ").concat(routeOf(root, one), ". If it no longer works, take it out first (").concat(one.store === 'claudopus' ? "`".concat(root, "/bin/secret ").concat(one.name, " --forget`") : "SBOS's `forget_secret`", "), then ask. The list of keys is ").concat(dir, "/").concat(KEYS_FILE, "."));
};
var keyAsked = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var input, root, listed, name_2, one, said_1, words_1, flatSaid_1, one, _i, _a, run, names, fresh, mod, _loop_1, _b, names_1, name_3, state_1;
    var _this = this;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/, ''];
                input = e;
                root = $.plugin.root;
                listed = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, keysFresh($)];
                        case 1: return [2 /*return*/, (_a.sent()).entries.filter(usable)];
                    }
                }); }); };
                if (!(e.tool === 'mcp__sbos__ask_secret')) return [3 /*break*/, 2];
                // One asked for an autonomous agent of SBOS's is its own: the list holds Dima's
                if (typeof input.agent === 'string' && input.agent)
                    return [2 /*return*/, ''];
                name_2 = String((_c = input.name) !== null && _c !== void 0 ? _c : '');
                return [4 /*yield*/, listed()];
            case 1:
                one = (_h.sent()).find(function (entry) { return entry.name === name_2 || sameKey(entry.name, name_2); });
                return [2 /*return*/, one ? KEY_KEPT(root, one, name_2) : ''];
            case 2:
                if (!(e.tool === "".concat(TOOLS, "ask"))) return [3 /*break*/, 4];
                said_1 = "".concat(String((_d = input.text) !== null && _d !== void 0 ? _d : ''), " ").concat(String((_e = input.copy) !== null && _e !== void 0 ? _e : ''));
                if (!/\b(?:key|token|password|secret|credentials?|login)s?\b/i.test(said_1) && !/[A-Z0-9]_[A-Z0-9]/.test(said_1))
                    return [2 /*return*/, ''];
                words_1 = new Set(said_1.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
                flatSaid_1 = said_1.toLowerCase().replace(/[-_]/g, ' ');
                return [4 /*yield*/, listed()];
            case 3:
                one = (_h.sent()).find(function (entry) { return flatSaid_1.includes(entry.name.toLowerCase().replace(/[-_]/g, ' ')) || (coreOf(entry.name).length > 0 && coreOf(entry.name).every(function (word) { return words_1.has(word); })); });
                return [2 /*return*/, one ? KEY_KEPT(root, one, one.name) : ''];
            case 4:
                if (e.tool !== 'Bash')
                    return [2 /*return*/, ''
                        // The secret runner asked for a key under a name it does not keep, while the list has it under another, or asked to take a kept
                        // one in again
                    ];
                _i = 0, _a = String((_f = input.command) !== null && _f !== void 0 ? _f : '').matchAll(/\bbin\/secret['"]?\s+['"]?([A-Za-z_][A-Za-z0-9_,]*)['"]?\s+['"]?(--add|[^\s'"-][^\s'"]*)/g);
                _h.label = 5;
            case 5:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                run = _a[_i];
                names = ((_g = run[1]) !== null && _g !== void 0 ? _g : '').split(',').filter(Boolean);
                return [4 /*yield*/, listed()];
            case 6:
                fresh = _h.sent();
                mod = fresh.filter(function (entry) { return entry.store === 'claudopus'; }).map(function (entry) { return entry.name; });
                _loop_1 = function (name_3) {
                    if (run[2] === '--add' && mod.includes(name_3))
                        return { value: KEY_KEPT(root, fresh.find(function (entry) { return entry.store === 'claudopus' && entry.name === name_3; }), name_3) };
                    if (mod.includes(name_3))
                        return "continue";
                    var one = fresh.find(function (entry) { return sameKey(entry.name, name_3); });
                    if (one)
                        return { value: KEY_KEPT(root, one, name_3) };
                };
                for (_b = 0, names_1 = names; _b < names_1.length; _b++) {
                    name_3 = names_1[_b];
                    state_1 = _loop_1(name_3);
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                }
                _h.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/, ''];
        }
    });
}); };
var openKeys = function ($) {
    presses += 1;
    void refreshKeys($)
        .then(function () { return openMemory($, "".concat(dir, "/").concat(KEYS_FILE)); })
        .catch(function (err) { return log($, "keys not opened: ".concat(String(err))); });
};
var keysButton = function ($, ui, isKeyed) {
    if (isKeyed === void 0) { isKeyed = false; }
    return (<ui.Box key="keys-button" flexShrink={0}>
    <ui.Button key={"keys-open-".concat(presses)} label="Keys" hotkey={isKeyed ? 'k' : undefined} plain={isKeyed ? true : undefined} onPress={function () { return openKeys($); }}/>
  </ui.Box>);
};
var keysHooks = function (on) {
    // Made again a while after each chat starts, so work that reads it finds the stores as they are
    on('session.start', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var begun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    begun = _a.sent();
                    $.clock.after(10000, function () { return void refreshKeys($).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); }); });
                    return [2 /*return*/, begun];
            }
        });
    }); });
    // What a call changed in a store: a key given or forgotten through the secret runner, or SBOS's list of names, makes the list again
    on('tool.call', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var asked, r, command, isOwnAgent, listed_1, name_4, before, sbos;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, keyAsked($, e).catch(function () { return ''; })];
                case 1:
                    asked = _c.sent();
                    if (!asked) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused an ask for a key the list of keys has (".concat(e.tool, ")"))];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { deny: asked }];
                case 3: return [4 /*yield*/, next(e)];
                case 4:
                    r = _c.sent();
                    if (!dir || r.deny)
                        return [2 /*return*/, r];
                    command = e.tool === 'Bash' ? String((_a = e.command) !== null && _a !== void 0 ? _a : '') : '';
                    isOwnAgent = !e.agent;
                    if (!(e.tool === 'mcp__sbos__secrets' && isOwnAgent && !r.isError)) return [3 /*break*/, 7];
                    listed_1 = sbosListed(r.result);
                    if (!listed_1) return [3 /*break*/, 6];
                    return [4 /*yield*/, refreshKeys($, listed_1).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [3 /*break*/, 12];
                case 7:
                    if (!(/^mcp__sbos__(?:ask_secret|forget_secret)$/.test(e.tool) && isOwnAgent && !r.isError)) return [3 /*break*/, 10];
                    name_4 = plainName(String((_b = e.name) !== null && _b !== void 0 ? _b : ''));
                    return [4 /*yield*/, keysRead($)];
                case 8:
                    before = (_c.sent()).entries.filter(function (one) { return one.store === 'sbos' && one.name !== name_4; });
                    sbos = __spreadArray(__spreadArray([], before.map(function (one) { return ({ name: one.name, label: one.label, isPresent: one.isPresent }); }), true), (e.tool.endsWith('ask_secret') && name_4 ? [{ name: name_4, label: typeof e.label === 'string' ? String(e.label).slice(0, 120) : undefined, isPresent: false }] : []), true);
                    return [4 /*yield*/, refreshKeys($, sbos, false).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 10:
                    if (!/\bbin\/secret\b/.test(command)) return [3 /*break*/, 12];
                    return [4 /*yield*/, refreshKeys($).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [2 /*return*/, r];
            }
        });
    }); });
};
