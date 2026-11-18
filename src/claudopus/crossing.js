// Tasks of one chat crossing each other's files. They share the chat's one scratchpad and often one checkout: on 16 Nov one task's
// script replaced another's in the scratchpad, and a task's half-done change to a shared checkout broke the build for the others,
// who waited until someone noticed. Each task the chat starts is told a scratch folder of its own, and its write at the scratchpad's
// top is refused. A write into another running task's own folder, or onto a repo file another running task changed minutes ago, is
// refused once, its next write there going through. A task that starts changing a checkout another running task is changing is told
// so. A command of a task's that fails with an error naming, from that command's own folder, the very file another running task
// changed lately in that checkout tells that task, and tells the task that met it whose change it may be. Claudopus sees every tool
// call of the chat's tasks, which is all this uses: a command's writes are seen only by its own redirects and tee, never a script's
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
// How long a change of another task's counts as under way: its file refused once, its checkout named
var CROSS_RECENT = 10 * 60000;
// How long an error naming a file another task changed may be put down to that change
var CROSS_BROKE = 30 * 60000;
// What an error says, on a line at or beside the file it names
var ERROR_WORDS = /\berror\b|\bfailed\b|\bcannot\b|can't resolve|\bnot found\b|\bunexpected\b|\bis not pure\b|\bENOENT\b|\bexception\b/i;
// Commands that only read or search: what they print names files, never a failure of the folder's build
var READ_ONLY = /^(?:grep|rg|ag|ack|cat|head|tail|less|more|sed|awk|jq|ls|find|fd|wc|echo|printf|diff|stat|file|tree|git\s+(?:log|diff|show|status|grep|blame|ls-files|ls-tree|cat-file|rev-parse|branch))\b/;
// Each repo file a task changed, by path: which task (its top), when, and its checkout
var crossWrites = new Map();
// Folder names handed out and not yet on a card, so two tasks started in one message never get one name: when each was handed
var scratchHanded = new Map();
// What was refused or told once, with the tasks it was about: so a task's next write there goes through, nothing is told twice,
// and each is let go once a task it names has ended
var crossWarned = new Map();
// A task's own scratch folder: its few words as a name, made unique among the cards and the names just handed out
var scratchName = function (list, title, now) {
    var _loop_1 = function (name_1, at) {
        if (now - at > CROSS_RECENT || list.some(function (one) { return one.scratch === name_1; }))
            scratchHanded.delete(name_1);
    };
    for (var _i = 0, scratchHanded_1 = scratchHanded; _i < scratchHanded_1.length; _i++) {
        var _a = scratchHanded_1[_i], name_1 = _a[0], at = _a[1];
        _loop_1(name_1, at);
    }
    var base = oneLine(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 5).join('-') || 'task';
    var taken = new Set(__spreadArray(__spreadArray([], list.map(function (one) { var _a; return (_a = one.scratch) !== null && _a !== void 0 ? _a : ''; }), true), scratchHanded.keys(), true));
    var name = base;
    for (var n = 2; taken.has(name); n += 1)
        name = "".concat(base, "-").concat(n);
    scratchHanded.set(name, now);
    return name;
};
var SCRATCH_LINE = function (name) {
    return "- Your own folder for scratch files is `".concat(name, "` in the scratchpad directory you were given: make it, and give your helpers folders inside it. Every task of this chat shares that scratchpad, so never write at its top or into another task's folder.");
};
var SCRATCH_TOP = function (name) {
    return "Not written: the scratchpad's top is shared by every task of this chat, and a file of one task's there replaced another's. Put it in your own folder in the scratchpad, `".concat(name, "`, and run it from there.");
};
var SCRATCH_THEIRS = function (title, name) {
    return "Not written: this folder in the scratchpad is the task \"".concat(title, "\"'s own, and that task is still working, so a file of yours there can replace one of its. Use your own folder, `").concat(name, "`. Claudopus refuses this once: your next write into that folder goes through.");
};
var SAME_FILE = function (title, when) {
    return "Not written: the task \"".concat(title, "\", still working, changed this file ").concat(when, ", and a change of yours now can undo or break its half-done work. Work in a worktree or copy of your own. Claudopus refuses this once: your next write to this same file goes through.");
};
var SAME_FOLDER = function (title, root) {
    return "Claudopus: the task \"".concat(title, "\" is changing files in this same checkout (").concat(root, ") right now. Its half-done changes can break your build and yours its: make a worktree of your own (git worktree add) and work there.");
};
var BROKE_TOLD = function (title, file, when, line) {
    return "From Claudopus: a command of the task \"".concat(title, "\" failed in the checkout you share, with an error naming ").concat(file, ", which you changed ").concat(when, ": \"").concat(line, "\". Your change may have caused it: if so, finish it or put it back, so the checkout builds for both tasks.");
};
var BROKE_HERE = function (title, file, when) {
    return "Claudopus: this error names ".concat(file, ", which the task \"").concat(title, "\" changed ").concat(when, " in this same checkout and is still working on, so its change may be the cause; Claudopus has told it. Rather than wait for it or change its file, carry on in a worktree of your own.");
};
var crossAgo = function (at, now) {
    var minutes = Math.round(Math.max(0, now - at) / 60000);
    return minutes < 1 ? 'less than a minute ago' : minutes === 1 ? 'a minute ago' : "".concat(minutes, " minutes ago");
};
// A command as the shell reads it at its top: its heredocs' text left out, and what is quoted kept apart, so a `>` in quotes
// (node -e "a > 1", awk '$3 > 100', a commit message) is no redirect. Each piece is a word's text and whether it was quoted
var shellPieces = function (command) {
    var _a, _b, _c, _d;
    var lines = command.split('\n');
    var kept = [];
    for (var i = 0; i < lines.length; i += 1) {
        var line = (_a = lines[i]) !== null && _a !== void 0 ? _a : '';
        kept.push(line);
        var tag = (_b = /<<-?\s*['"]?([A-Za-z_]\w*)['"]?/.exec(line)) === null || _b === void 0 ? void 0 : _b[1];
        if (tag)
            while (i + 1 < lines.length && ((_c = lines[i + 1]) !== null && _c !== void 0 ? _c : '').trim() !== tag)
                i += 1;
    }
    var text = kept.join('\n');
    // The text with every quoted stretch replaced by a mark of the same length, so places in it still line up with the command
    var open = '';
    var plain = '';
    for (var i = 0; i < text.length; i += 1) {
        var c = (_d = text[i]) !== null && _d !== void 0 ? _d : '';
        if (open) {
            if (c === '\\' && open === '"')
                (plain += '__'), (i += 1);
            else if (c === open)
                (open = ''), (plain += c);
            else
                plain += '_';
        }
        else if (c === '\\')
            (plain += '__'), (i += 1);
        else if (c === '"' || c === "'")
            (open = c), (plain += c);
        else
            plain += c;
    }
    return { text: text, plain: open ? '' : plain };
};
// The folder a command runs in: the chat's, or the one a cd at its very start moves it to; '' when a cd or pushd elsewhere in it, or
// a subshell, leaves that unsure
var commandFolder = function (command, home, from) {
    var _a;
    var _b = shellPieces(command), text = _b.text, plain = _b.plain;
    if (!plain)
        return '';
    var lead = /^\s*cd\s+("[^"]*"|'[^']*'|[^\s;&|()]+)\s*(?:&&|;)/.exec(text);
    var rest = plain.slice(lead ? lead[0].length : 0);
    if (/(?:^|[\s;&|(])(?:cd|pushd|popd)\b|\(/.test(rest))
        return '';
    var word = ((_a = lead === null || lead === void 0 ? void 0 : lead[1]) !== null && _a !== void 0 ? _a : '').replace(/^(["'])(.*)\1$/, '$2');
    return lead ? (word.includes('$') ? '' : pathOf(word, home, from)) : from;
};
// The files a command writes by its own redirects and tee, outside quotes, with the variables set in it read; a relative one only
// where the folder it runs in is sure
var writtenBy = function (command, home, from) {
    var _a, _b, _c;
    var _d = shellPieces(command), text = _d.text, plain = _d.plain;
    if (!plain)
        return [];
    var at = commandFolder(command, home, from);
    var vars = new Map([['HOME', home]]);
    var bare = function (word) { return word.replace(/^(["'])(.*)\1$/, '$2'); };
    for (var _i = 0, _e = plain.matchAll(/(?:^|[\s;&|(])([A-Za-z_]\w*)=(\S*)/g); _i < _e.length; _i++) {
        var m = _e[_i];
        var start = ((_a = m.index) !== null && _a !== void 0 ? _a : 0) + m[0].indexOf('=') + 1;
        vars.set((_b = m[1]) !== null && _b !== void 0 ? _b : '', bare(text.slice(start, start + ((_c = m[2]) !== null && _c !== void 0 ? _c : '').length).replace(/[;&|)]+$/, '')));
    }
    var expand = function (word) { return bare(word).replace(/\$\{?([A-Za-z_]\w*)\}?/g, function (all, name) { var _a; return (_a = vars.get(name)) !== null && _a !== void 0 ? _a : all; }); };
    var words = [];
    // Each target found in the unquoted text, read from the command itself, quotes and all
    var target = function (m) {
        var _a, _b, _c;
        var start = ((_a = m.index) !== null && _a !== void 0 ? _a : 0) + m[0].length - ((_b = m[1]) !== null && _b !== void 0 ? _b : '').length;
        return text.slice(start, start + ((_c = m[1]) !== null && _c !== void 0 ? _c : '').length);
    };
    for (var _f = 0, _g = plain.matchAll(/(?<![<>=&\d-])\d?>>?\|?\s*("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g); _f < _g.length; _f++) {
        var m = _g[_f];
        words.push(target(m));
    }
    for (var _h = 0, _j = plain.matchAll(/(?:^|[\s;&|(])tee\s+(?:-a\s+)?("[^"]*"|'[^']*'|[^\s;&|<>()]+)/g); _h < _j.length; _h++) {
        var m = _j[_h];
        words.push(target(m));
    }
    return words
        .map(expand)
        .filter(function (word) { return word && !word.startsWith('&') && !word.startsWith('/dev/') && !word.includes('$') && !word.includes('`') && (word.startsWith('/') || word.startsWith('~') || Boolean(at)); })
        .map(function (word) { return pathOf(word, home, at || from); });
};
// The paths a call writes: a file tool's own, or a command's
var crossPaths = function (e) {
    var _a, _b, _c;
    var home = dir.replace(/\/\.claude\/claudopus$/, '');
    var input = e;
    if (FILE_TOOLS.includes(e.tool)) {
        var path = String((_b = (_a = input.file_path) !== null && _a !== void 0 ? _a : input.notebook_path) !== null && _b !== void 0 ? _b : '');
        return path ? [pathOf(path, home, cwd || home)] : [];
    }
    return e.tool === 'Bash' ? writtenBy(String((_c = input.command) !== null && _c !== void 0 ? _c : ''), home, cwd || home) : [];
};
// The checkout a file is in, a main one or a worktree, by the nearest folder above it with a .git; '' outside git. Kept a while: a
// folder found outside git a minute, as it may become a repo
var rootCache = new Map();
var rootOf = function ($, path, now) { return __awaiter(_this, void 0, void 0, function () {
    var folder, kept, at, root, hops, _i, rootCache_1, _a, one, was;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                folder = path.slice(0, path.lastIndexOf('/')) || '/';
                kept = rootCache.get(folder);
                if (kept && now - kept.at < (kept.root ? CROSS_RECENT : 60000))
                    return [2 /*return*/, kept.root];
                at = folder;
                root = '';
                hops = 0;
                _b.label = 1;
            case 1:
                if (!(at.length > 1 && hops < 12)) return [3 /*break*/, 4];
                return [4 /*yield*/, $.fs.exists("".concat(at, "/.git")).catch(function () { return false; })];
            case 2:
                if (_b.sent()) {
                    root = at;
                    return [3 /*break*/, 4];
                }
                at = at.slice(0, at.lastIndexOf('/')) || '/';
                _b.label = 3;
            case 3:
                hops += 1;
                return [3 /*break*/, 1];
            case 4:
                for (_i = 0, rootCache_1 = rootCache; _i < rootCache_1.length; _i++) {
                    _a = rootCache_1[_i], one = _a[0], was = _a[1];
                    if (now - was.at > CROSS_RECENT)
                        rootCache.delete(one);
                }
                rootCache.set(folder, { root: root, at: now });
                return [2 /*return*/, root];
        }
    });
}); };
// The chat's own scratchpad, and where a path is in it: <tmp>/claude-<uid>/<project>/<this chat's session>/scratchpad/<rest>
var scratchRest = function (path, session) {
    var _a;
    var m = /^\/.*\/claude-\d+\/[^/]+\/([^/]+)\/scratchpad(?:\/(.*))?$/.exec(path);
    return m && m[1] === session ? ((_a = m[2]) !== null && _a !== void 0 ? _a : '') : undefined;
};
// Let go what was told about tasks that have ended
var crossForget = function (list) {
    var working = new Set(list.filter(function (one) { return one.status === 'working'; }).map(function (one) { return one.id; }));
    for (var _i = 0, crossWarned_1 = crossWarned; _i < crossWarned_1.length; _i++) {
        var _a = crossWarned_1[_i], key = _a[0], ids = _a[1];
        if (ids.some(function (id) { return !working.has(id); }))
            crossWarned.delete(key);
    }
    for (var _b = 0, crossWrites_1 = crossWrites; _b < crossWrites_1.length; _b++) {
        var _c = crossWrites_1[_b], path = _c[0], one = _c[1];
        if (!working.has(one.top))
            crossWrites.delete(path);
    }
};
var crossingOf = function ($, e) { return __awaiter(_this, void 0, void 0, function () {
    var paths, list, top, card, now, session, running, title, own, note, _loop_2, _i, paths_1, path, state_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!dir || isOff || e.agentId === undefined || !(e.tool === 'Bash' || FILE_TOOLS.includes(e.tool)))
                    return [2 /*return*/, {}];
                paths = crossPaths(e);
                if (!paths.length)
                    return [2 /*return*/, {}];
                return [4 /*yield*/, read($, todos)];
            case 1:
                list = _c.sent();
                top = topOf(list, e.agentId);
                card = list.find(function (one) { return one.id === top; });
                if (!card)
                    return [2 /*return*/, {}];
                crossForget(list);
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _c.sent();
                return [4 /*yield*/, read($, me)];
            case 3:
                session = (_c.sent()).id;
                running = function (id) { return id !== top && list.some(function (one) { return one.id === id && one.status === 'working'; }); };
                title = function (id) { var _a; return titleOf((_a = list.find(function (one) { return one.id === id; })) !== null && _a !== void 0 ? _a : card); };
                own = (_a = card.scratch) !== null && _a !== void 0 ? _a : '';
                note = {};
                _loop_2 = function (path) {
                    var rest, name_2, owner, key_1, root, last, key_2, other, key;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                rest = scratchRest(path, session);
                                if (rest !== undefined) {
                                    // Only work the chat started and told a folder of its own, and its helpers, are held to it
                                    if (!own || !rest)
                                        return [2 /*return*/, "continue"];
                                    if (!rest.includes('/'))
                                        return [2 /*return*/, { value: { deny: SCRATCH_TOP(own) } }];
                                    name_2 = (_b = rest.split('/')[0]) !== null && _b !== void 0 ? _b : '';
                                    owner = name_2 === own ? undefined : list.find(function (one) { return one.scratch === name_2 && running(one.id); });
                                    key_1 = owner ? "scratch ".concat(top, " ").concat(name_2) : '';
                                    if (owner && !crossWarned.has(key_1))
                                        return [2 /*return*/, { value: (crossWarned.set(key_1, [top, owner.id]), { deny: SCRATCH_THEIRS(titleOf(owner), own) }) }];
                                    return [2 /*return*/, "continue"];
                                }
                                // Only a repo's files: the memory folder's notes and a folder outside git are each task's to add to
                                if (path.startsWith("".concat(dir, "/")))
                                    return [2 /*return*/, "continue"];
                                return [4 /*yield*/, rootOf($, path, now)];
                            case 1:
                                root = _d.sent();
                                if (!root)
                                    return [2 /*return*/, "continue"];
                                last = crossWrites.get(path);
                                if (last && running(last.top) && now - last.at < CROSS_RECENT) {
                                    key_2 = "file ".concat(top, " ").concat(path);
                                    if (!crossWarned.has(key_2))
                                        return [2 /*return*/, { value: (crossWarned.set(key_2, [top, last.top]), { deny: SAME_FILE(title(last.top), crossAgo(last.at, now)) }) }];
                                }
                                other = __spreadArray([], crossWrites.values(), true).find(function (one) { return one.root === root && running(one.top) && now - one.at < CROSS_RECENT; });
                                key = other ? "checkout ".concat(top, " ").concat(root, " ").concat(other.top) : '';
                                if (other && !crossWarned.has(key) && !note.noteKey)
                                    note = { context: SAME_FOLDER(title(other.top), root), noteKey: key, noteIds: [top, other.top] };
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, paths_1 = paths;
                _c.label = 4;
            case 4:
                if (!(_i < paths_1.length)) return [3 /*break*/, 7];
                path = paths_1[_i];
                return [5 /*yield**/, _loop_2(path)];
            case 5:
                state_1 = _c.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/, __assign({ top: top, paths: paths }, note)];
        }
    });
}); };
// Whether a command's result is a failure: the engine's error result, an exit code other than 0, or its "Exit code" line
var failedOf = function (result, isError) {
    if (isError)
        return true;
    if (typeof result === 'string')
        return /^Exit code [1-9]/.test(result);
    var r = result;
    return [r === null || r === void 0 ? void 0 : r.exitCode, r === null || r === void 0 ? void 0 : r.code, r === null || r === void 0 ? void 0 : r.returnCode].some(function (code) { return typeof code === 'number' && code !== 0; });
};
var outputOf = function (result) {
    var _a, _b;
    if (typeof result === 'string')
        return result;
    var r = result;
    if (Array.isArray(r === null || r === void 0 ? void 0 : r.content))
        return r.content.map(function (b) { var _a; return String((_a = b.text) !== null && _a !== void 0 ? _a : ''); }).join('\n');
    return "".concat(String((_a = r === null || r === void 0 ? void 0 : r.stdout) !== null && _a !== void 0 ? _a : ''), "\n").concat(String((_b = r === null || r === void 0 ? void 0 : r.stderr) !== null && _b !== void 0 ? _b : ''));
};
// As a task's call goes through: what it wrote is kept, a note it was given is marked told, and a failed command whose error names,
// from that command's own folder, a file another running task changed lately in that checkout is told to that task, and the task
// that met it is told whose change it may be
var crossEnded = function ($, e, crossed, result, isError) { return __awaiter(_this, void 0, void 0, function () {
    var now, list, top, isThrough, _i, crossWrites_2, _a, path, one, _b, _c, path, root, home, command, at, first, lines, _d, _e, _f, i, line, _loop_3, _g, _h, m, state_2;
    var _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                if (!dir || isOff || e.agentId === undefined)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _p.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                list = _p.sent();
                top = (_j = crossed.top) !== null && _j !== void 0 ? _j : topOf(list, e.agentId);
                isThrough = !(isError && e.tool !== 'Bash');
                if (crossed.noteKey && isThrough)
                    crossWarned.set(crossed.noteKey, (_k = crossed.noteIds) !== null && _k !== void 0 ? _k : [top]);
                for (_i = 0, crossWrites_2 = crossWrites; _i < crossWrites_2.length; _i++) {
                    _a = crossWrites_2[_i], path = _a[0], one = _a[1];
                    if (now - one.at > CROSS_BROKE)
                        crossWrites.delete(path);
                }
                if (!isThrough) return [3 /*break*/, 6];
                _b = 0, _c = (_l = crossed.paths) !== null && _l !== void 0 ? _l : [];
                _p.label = 3;
            case 3:
                if (!(_b < _c.length)) return [3 /*break*/, 6];
                path = _c[_b];
                if (path.startsWith("".concat(dir, "/")))
                    return [3 /*break*/, 5];
                return [4 /*yield*/, rootOf($, path, now)];
            case 4:
                root = _p.sent();
                if (root)
                    crossWrites.set(path, { top: top, at: now, root: root });
                _p.label = 5;
            case 5:
                _b++;
                return [3 /*break*/, 3];
            case 6:
                if (e.tool !== 'Bash' || !crossWrites.size || !failedOf(result, isError))
                    return [2 /*return*/, ''];
                home = dir.replace(/\/\.claude\/claudopus$/, '');
                command = String((_m = e.command) !== null && _m !== void 0 ? _m : '');
                at = commandFolder(command, home, cwd || home);
                first = command.replace(/^\s*cd\s+("[^"]*"|'[^']*'|[^\s;&|()]+)\s*(?:&&|;)\s*/, '').replace(/^(?:[A-Za-z_]\w*=\S*\s+)+/, '');
                if (!at || READ_ONLY.test(first))
                    return [2 /*return*/, ''];
                lines = outputOf(result).split('\n');
                _d = 0, _e = lines.entries();
                _p.label = 7;
            case 7:
                if (!(_d < _e.length)) return [3 /*break*/, 12];
                _f = _e[_d], i = _f[0], line = _f[1];
                if (!lines.slice(Math.max(0, i - 2), i + 3).some(function (near) { return ERROR_WORDS.test(near); }))
                    return [3 /*break*/, 11];
                _loop_3 = function (m) {
                    var path, one, key, writer, met, file, said_1;
                    return __generator(this, function (_q) {
                        switch (_q.label) {
                            case 0:
                                path = pathOf((_o = m[1]) !== null && _o !== void 0 ? _o : '', home, at);
                                one = crossWrites.get(path);
                                if (!one || one.top === top || !list.some(function (card) { return card.id === one.top && card.status === 'working'; }))
                                    return [2 /*return*/, "continue"];
                                key = "broke ".concat(one.top, " ").concat(path, " ").concat(top);
                                if (crossWarned.has(key))
                                    return [2 /*return*/, "continue"];
                                crossWarned.set(key, [top, one.top]);
                                writer = list.find(function (card) { return card.id === one.top; });
                                met = list.find(function (card) { return card.id === top; });
                                file = path.slice(one.root.length + 1);
                                said_1 = cut(oneLine(lines.slice(i, i + 3).join(' ')), 160);
                                return [4 /*yield*/, log($, "work ".concat(top, "'s command failed on ").concat(file, ", which work ").concat(one.top, " changed: told it"))];
                            case 1:
                                _q.sent();
                                void tell($, one.top, BROKE_TOLD(met ? titleOf(met) : 'another task', file, crossAgo(one.at, now), said_1));
                                return [2 /*return*/, { value: BROKE_HERE(writer ? titleOf(writer) : 'another task', file, crossAgo(one.at, now)) }];
                        }
                    });
                };
                _g = 0, _h = line.matchAll(/(?:^|[\s'"(`])((?:~|\.{1,2})?\/?[\w@.+-]+(?:\/[\w@.+-]+)+)(?::\d+)*/g);
                _p.label = 8;
            case 8:
                if (!(_g < _h.length)) return [3 /*break*/, 11];
                m = _h[_g];
                return [5 /*yield**/, _loop_3(m)];
            case 9:
                state_2 = _p.sent();
                if (typeof state_2 === "object")
                    return [2 /*return*/, state_2.value];
                _p.label = 10;
            case 10:
                _g++;
                return [3 /*break*/, 8];
            case 11:
                _d++;
                return [3 /*break*/, 7];
            case 12: return [2 /*return*/, ''];
        }
    });
}); };
