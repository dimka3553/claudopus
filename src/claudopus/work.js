// Work starting and running: the chat's own thread kept to reading and handing work over, how full the chat is, each step of work, and new
// work's card
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
// A piece of work reads a message only between its calls, so a command it holds open keeps the person's reply from it until the
// command ends (16 Nov: a reply waited 8 minutes behind a 9-minute wait for the person). One that may run past this long, by the
// time limit it asks for or the time its words give it, goes to the background instead: the work is told when it ends, and reads a
// reply at once meanwhile. Not the mod's own waits on helpers (which come back when a reply waits), a password or a key
var HELD_LONGEST = 2 * 60000;
var isLongHeld = function (call) {
    var _a, _b, _c, _d, _e, _f;
    return call.tool === 'Bash' &&
        !call.run_in_background &&
        !/\bbin\/(?:helpers|admin|secret)\b|(?:^|[\s;&|(])\.\/(?:helpers|admin|secret)\b/.test(String((_a = call.command) !== null && _a !== void 0 ? _a : '')) &&
        // A launcher that leaves its runs going and comes back is followed by what it started while it ran, so it is left as it is
        !/\b(?:nohup|setsid|disown)\b|(?<![&>|])&(?![&>])/.test(String((_b = call.command) !== null && _b !== void 0 ? _b : '')) &&
        (Number((_c = call.timeout) !== null && _c !== void 0 ? _c : 0) > HELD_LONGEST || (/^\s*(?:wait|watch|poll)(?:ing)?\b/i.test(String((_d = call.description) !== null && _d !== void 0 ? _d : '')) && ((_f = describedOf(String((_e = call.description) !== null && _e !== void 0 ? _e : '')).expect) !== null && _f !== void 0 ? _f : 0) >= HELD_LONGEST));
};
// A wait for the person themselves, by the words the work gives its command: there is no time to give them. Their answer to an ask
// comes as a message the moment they give it and starts the work then, however long it takes, so the work ends its step instead
var isPersonWait = function (call, name) {
    var _a, _b;
    var them = "you".concat(name ? "|".concat(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : '');
    return (call.tool === 'Bash' &&
        !/\bbin\/(?:helpers|admin|secret|release)\b/.test(String((_a = call.command) !== null && _a !== void 0 ? _a : '')) &&
        new RegExp(String.raw(__makeTemplateObject(["^s*(?:wait|watch|poll)(?:ing)?s+(?:for|until|on)s+(?:(?:", ")\b(?!')|(?:your|(?:", ")'s)s+(?:answer|reply|response|press|go-ahead|yes|try|decision|word)s?(?=s*(?:$|[(.,;:]|(?:to|on|about|before)\b)))"], ["^\\s*(?:wait|watch|poll)(?:ing)?\\s+(?:for|until|on)\\s+(?:(?:", ")\\b(?!')|(?:your|(?:", ")'s)\\s+(?:answer|reply|response|press|go-ahead|yes|try|decision|word)s?(?=\\s*(?:$|[(.,;:]|(?:to|on|about|before)\\b)))"]), them, them), 'i').test(String((_b = call.description) !== null && _b !== void 0 ? _b : '')));
};
var asksNow = function (list, agent) {
    var top = topOf(list, agent);
    return list.some(function (one) { var _a; return (one.id === agent || one.id === top) && Boolean(one.ask) && !((_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied); });
};
var NO_PERSON_WAIT = function (name) {
    return "Not run: this command waits for ".concat(name, ", and a wait with a time limit gives them one. Don't wait for ").concat(name, " with a command at all. End your step now: your question stays on the card for as long as it takes, and ").concat(name, "'s answer starts you again the moment they give it. Anything you need to see of what they did (a recording, a file, a page), look at once their answer has come.");
};
var NO_PROGRESS_WAIT = 'Not run: this wait would print nothing to show how it is going. Make it print a plain line at each try and at least every 10 seconds, such as `n=$((n+1)); echo "progress: $n/40 tries waiting for the deploy"` inside its loop, then start it again.';
var NO_PROGRESS_SCRIPT = 'Not run: this long command would print nothing to show how far it has got. Make its script print, flushed right away, a plain line `progress: <done>/<total> <unit> <what>` at each step and at least every 10 seconds, such as `print(f"progress: {i}/{n} scans sorting", flush=True)` in Python or `echo "progress: $i/$n scans sorting"` in a shell, with no paths, file names or codes in it, then start it again.';
// The note the engine adds when work ends its step without its report, and what such a step says instead while the work's own
// detached command runs or it waits to be woken: what it said before was no report (a report goes on to the engine's press)
var HANDBACK_PRESS = '[handback-send-enforce]';
var LEFT_AT_WORK = 'My own work is still going; I am started again when it is done, and give my report then.';
var isPressedForReport = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var talk, textOf, last, said;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.messages({ as: 'api', agentId: id }).catch(function () { return []; })];
            case 1:
                talk = _a.sent();
                if (!Array.isArray(talk))
                    return [2 /*return*/, false];
                textOf = function (m) {
                    var content = m === null || m === void 0 ? void 0 : m.content;
                    return typeof content === 'string' ? content : Array.isArray(content) ? content.map(function (b) { var _a; return (b && typeof b === 'object' && b.type === 'text' ? String((_a = b.text) !== null && _a !== void 0 ? _a : '') : ''); }).join('\n') : '';
                };
                last = talk.at(-1);
                if ((last === null || last === void 0 ? void 0 : last.role) !== 'user' || !textOf(last).includes(HANDBACK_PRESS))
                    return [2 /*return*/, false];
                said = __spreadArray([], talk, true).reverse().find(function (m) { return m.role === 'assistant'; });
                return [2 /*return*/, textOf(said).trim().length < REPORT_LEAST];
        }
    });
}); };
// What a command that only waits is told instead, by what it waits for
var NO_WAIT = function (kind, isHelper) {
    if (isHelper === void 0) { isHelper = false; }
    return "Not run: this command only waits".concat(kind === 'helpers' ? ' for your helpers' : kind === 'time' ? ' for time to pass' : '', ", and nothing you start may only wait. ").concat(kind === 'helpers'
        ? 'Each helper\'s result comes to you as a message, even after you end your step: carry on with what needs nothing from them, or end your step now.'
        : 'Your own commands, in the background or detached, wake you the moment they end, and each helper\'s result comes to you as a message: carry on with what needs nothing from them, or end your step now. ' + (isHelper ? 'For a file, a page or a time that nothing of yours makes, hand back what you found and what you wait for: the task that started you asks Claudopus to wake it.' : 'For a file, a page or a time that nothing of yours makes, call the `wake_me` tool and end your step: Claudopus wakes you when it is there.') + ' To try something again that failed, run it again yourself.');
};
var NO_FOLLOW = 'Not run: this only follows a log and would never end, so read the log once when you need it (tail -n 20); you are woken the moment your command ends.';
var MOVED_BACK = function (name) {
    return "Claudopus started this command in the background instead of holding it open, because it may run for minutes. ".concat(name, "'s replies reach you while it runs. Claudopus will tell you when it ends; its output is in the file named above. Continue with what needs nothing from it, or end your step. Never wait for ").concat(name, "'s own answer with a command: it comes to you as a message.");
};
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
// The rules every piece of work a chat starts is handed after its brief, as they stand now: where the chat's words are, the work's
// own rules, and its panel's
var workRules = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var work, _a, _b, words, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = named;
                _b = fillModels;
                return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/work.md')];
            case 1:
                work = _a.apply(void 0, [_b.apply(void 0, [(_e.sent()).text, models, lean])]).replace(/\{admin\}/g, "".concat($.plugin.root, "/bin/admin")).replace(/\{secret\}/g, "".concat($.plugin.root, "/bin/secret")).replace(/\{release\}/g, "".concat($.plugin.root, "/bin/release")).trim();
                _d = (_c = "- The chat's saved words, ".concat(who(), "'s messages word for word: ").concat(dir, "/words/")).concat;
                return [4 /*yield*/, read($, me)];
            case 2:
                words = _d.apply(_c, [(_e.sent()).id, ".md"]);
                return [2 /*return*/, "".concat(workHead(), "\n").concat(words, "\n").concat(work, "\n\n").concat(named(PANEL_RULE))];
        }
    });
}); };
// Work its rules no longer reach is handed them again at its next step: work started before they changed, and work whose context
// was compacted, which keeps only a summary of its brief (on 15 Nov work compacted after two hours kept "long ones detached with
// nohup" and lost the rest, then started 8 drawings at once on this Mac that its card never showed)
var rulesAgain = function ($, agent) { return __awaiter(_this, void 0, void 0, function () {
    var card, _a, rules;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                card = (_b.sent()).find(function (one) { return one.id === agent; });
                _a = !card || card.parentId;
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, read($, me)];
            case 2:
                _a = !(_b.sent()).isChat;
                _b.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, workRules($)];
            case 4:
                rules = _b.sent();
                if (!card.rulesDue && card.rulesSent === hashOf(rules))
                    return [2 /*return*/, ''];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === agent ? __assign(__assign({}, one), { rulesSent: hashOf(rules), rulesDue: undefined }) : one); }); })];
            case 5:
                _b.sent();
                return [4 /*yield*/, log($, "work ".concat(agent, " handed its rules again").concat(card.rulesDue ? ' after a compaction' : ' as they changed'))];
            case 6:
                _b.sent();
                return [2 /*return*/, "".concat(card.rulesDue ? 'Your context was compacted, and the rules you were handed at the start are no longer in it.' : 'The rules every task follows have changed since you started.', " These are the rules now; they replace any earlier copy.\n\n").concat(rules)];
        }
    });
}); };
var workHooks = function (on) {
    // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
    on('tool.call', function ($, e, raw) { return __awaiter(_this, void 0, void 0, function () {
        var run, grants, _a, keyKept, ownFiles, _b, _c, command, card, waits, _d, _e, command, silent, _f, _g, _h, _j, _k, _l, isChatHere, _m, chatCommand, pushFrom, _o, isChatCommand, _p, isRefusedHere, gated, released, _q, _r, _s, fileSaid, woken, next, call, resume, held_1, _t, steered, from, answered, answer, message, woke, words, isWhole, to_1, theirs, now_1, list, target_1, given, isRepeat, asking, asked_1, isSteer_1, sender, title, id_1, now_2, isKeeping_1, nudge_1, sent, line_1, hold, r, askedModel, better, alias, _u, call, r, stopId_1, now_3, r, readPath, isPaste;
        var _this = this;
        var _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
        return __generator(this, function (_26) {
            switch (_26.label) {
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
                                    if (!(grants.length && !call.run_in_background)) return [3 /*break*/, 22];
                                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })];
                                case 21:
                                    _j.sent();
                                    _j.label = 22;
                                case 22:
                                    _d = runnerEnded;
                                    _e = [e.tool_use_id, Boolean(call.run_in_background)];
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
                    if (!_26.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " touching the password and key boxes"))];
                case 2:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_BOXES }];
                case 3:
                    _a = e.tool === 'Bash';
                    if (!_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, readsKept($, String((_v = e.command) !== null && _v !== void 0 ? _v : ''))];
                case 4:
                    _a = (_26.sent());
                    _26.label = 5;
                case 5:
                    if (!((_a) || touchesKeyring(e))) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, 'refused a command that reads the keychain')];
                case 6:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_READ }];
                case 7: return [4 /*yield*/, keyAsked($, e).catch(function () { return ''; })];
                case 8:
                    keyKept = _26.sent();
                    if (!keyKept) return [3 /*break*/, 10];
                    return [4 /*yield*/, log($, "refused an ask for a key the list of keys has (".concat(e.tool, ")"))];
                case 9:
                    _26.sent();
                    return [2 /*return*/, { deny: keyKept }];
                case 10: return [4 /*yield*/, writesOwnFiles($, e)];
                case 11:
                    ownFiles = _26.sent();
                    if (!ownFiles) return [3 /*break*/, 13];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " writing the memory folder's own files"))];
                case 12:
                    _26.sent();
                    return [2 /*return*/, { deny: ownFiles }];
                case 13:
                    _b = dir && !isOff && e.agentId !== undefined && isPersonWait(e, who());
                    if (!_b) return [3 /*break*/, 15];
                    _c = asksNow;
                    return [4 /*yield*/, read($, todos)];
                case 14:
                    _b = _c.apply(void 0, [_26.sent(), e.agentId]);
                    _26.label = 15;
                case 15:
                    if (!_b) return [3 /*break*/, 17];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s wait for the person: ").concat(oneLine(String((_w = e.description) !== null && _w !== void 0 ? _w : '')).slice(0, 80)))];
                case 16:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_PERSON_WAIT(who()) }];
                case 17:
                    if (!(dir && !isOff && e.agentId !== undefined && (e.tool === 'Bash' || e.tool === 'Monitor'))) return [3 /*break*/, 24];
                    command = String((_x = e.command) !== null && _x !== void 0 ? _x : '');
                    return [4 /*yield*/, read($, todos)];
                case 18:
                    card = (_26.sent()).find(function (one) { return one.id === e.agentId; });
                    _d = waitingOf;
                    _e = [command];
                    return [4 /*yield*/, scriptsRun($, command)];
                case 19:
                    waits = _d.apply(void 0, _e.concat([_26.sent(), { isWatch: e.tool === 'Monitor' }]));
                    if (!waits) return [3 /*break*/, 21];
                    return [4 /*yield*/, log($, "refused ".concat((card === null || card === void 0 ? void 0 : card.parentId) ? 'helper' : 'work', " ").concat(e.agentId, "'s command that only waits (").concat(waits, ")"))];
                case 20:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_WAIT(waits, Boolean(card === null || card === void 0 ? void 0 : card.parentId)) }];
                case 21:
                    if (!(e.tool === 'Bash' && ((_y = watcherOf(command)) === null || _y === void 0 ? void 0 : _y.isFollow))) return [3 /*break*/, 23];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s command that only follows a log"))];
                case 22:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_FOLLOW }];
                case 23:
                    noteKills(card, command);
                    _26.label = 24;
                case 24:
                    if (!(dir && !isOff && e.agentId !== undefined && e.tool === 'Bash')) return [3 /*break*/, 27];
                    command = String((_z = e.command) !== null && _z !== void 0 ? _z : '');
                    _f = reportsOf;
                    _g = [command, String((_0 = e.description) !== null && _0 !== void 0 ? _0 : ''), Boolean(e.run_in_background)];
                    return [4 /*yield*/, scriptsRun($, command)];
                case 25:
                    silent = _f.apply(void 0, _g.concat([_26.sent(), Number((_1 = e.timeout) !== null && _1 !== void 0 ? _1 : 0)]));
                    if (!silent) return [3 /*break*/, 27];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s ").concat(silent === 'wait' ? 'wait' : 'long script', " that gives no progress"))];
                case 26:
                    _26.sent();
                    return [2 /*return*/, { deny: silent === 'wait' ? NO_PROGRESS_WAIT : NO_PROGRESS_SCRIPT }];
                case 27:
                    if (!(e.tool === 'Bash' && pushesMain(String((_2 = e.command) !== null && _2 !== void 0 ? _2 : '')))) return [3 /*break*/, 29];
                    return [4 /*yield*/, log($, 'refused a command that pushes or merges to main itself')];
                case 28:
                    _26.sent();
                    return [2 /*return*/, { deny: "".concat(NO_PUSH, " It is ").concat($.plugin.root, "/bin/release.") }];
                case 29:
                    _h = touchesGate(e);
                    if (_h) return [3 /*break*/, 32];
                    _j = e.tool === 'Bash';
                    if (!_j) return [3 /*break*/, 31];
                    return [4 /*yield*/, scriptsRun($, String((_3 = e.command) !== null && _3 !== void 0 ? _3 : ''))];
                case 30:
                    _j = (_26.sent()).some(function (text) { return touchesGate(__assign(__assign({}, e), { command: text })); });
                    _26.label = 31;
                case 31:
                    _h = (_j);
                    _26.label = 32;
                case 32:
                    if (!_h) return [3 /*break*/, 34];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " on the admin gate's own files"))];
                case 33:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_GATE_TOUCH() }];
                case 34:
                    _k = e.tool === 'Bash';
                    if (!_k) return [3 /*break*/, 36];
                    _l = [[String((_4 = e.command) !== null && _4 !== void 0 ? _4 : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_5 = e.command) !== null && _5 !== void 0 ? _5 : ''))];
                case 35:
                    _k = __spreadArray.apply(void 0, _l.concat([(_26.sent()), true])).some(movesRunner);
                    _26.label = 36;
                case 36:
                    if (!_k) return [3 /*break*/, 38];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " running a runner of the mod with another home or without Claude Code's mark"))];
                case 37:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_RUNNER_MOVED }];
                case 38:
                    _m = e.agentId === undefined && !isOff && Boolean(dir);
                    if (!_m) return [3 /*break*/, 40];
                    return [4 /*yield*/, read($, me)];
                case 39:
                    _m = (_26.sent()).isChat;
                    _26.label = 40;
                case 40:
                    isChatHere = _m;
                    chatCommand = isChatHere && e.tool === 'Bash' ? String((_6 = e.command) !== null && _6 !== void 0 ? _6 : '') : '';
                    if (!(chatCommand && !isOneCommand(chatCommand) && !RUNNER_NAMED.test(chatCommand))) return [3 /*break*/, 42];
                    return [4 /*yield*/, log($, "refused a chat's own command that is more than one command")];
                case 41:
                    _26.sent();
                    return [2 /*return*/, { deny: NOT_ONE_COMMAND }];
                case 42:
                    if (!/^\s*git\s+push\b/.test(chatCommand)) return [3 /*break*/, 44];
                    return [4 /*yield*/, $.process.run(['git', '-C', cwd || '.', 'rev-parse', '--abbrev-ref', 'HEAD'], { timeoutMs: 10000 }).then(function (r) { return (r.exitCode === 0 ? r.stdout.trim() : ''); }).catch(function () { return ''; })];
                case 43:
                    _o = _26.sent();
                    return [3 /*break*/, 45];
                case 44:
                    _o = '';
                    _26.label = 45;
                case 45:
                    pushFrom = _o;
                    _p = Boolean(chatCommand) && isChatRunnable(chatCommand, pushFrom);
                    if (!_p) return [3 /*break*/, 47];
                    return [4 /*yield*/, scriptsRun($, chatCommand)];
                case 46:
                    _p = !(_26.sent()).some(function (text) { return RUNNER_NAMED.test(text); });
                    _26.label = 47;
                case 47:
                    isChatCommand = _p;
                    isRefusedHere = isChatHere && !isChatCommand && !OWN.includes(e.tool) && !OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }) && !READS.includes(e.tool);
                    if (!(e.tool === 'Bash' && !isRefusedHere)) return [3 /*break*/, 59];
                    return [4 /*yield*/, gateAdmin($, e, raw)
                        // A call refused after a press (another of its commands denied, a grant not sealed) ends here: its note goes with it
                    ];
                case 48:
                    gated = _26.sent();
                    if (!gated.deny) return [3 /*break*/, 51];
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 49:
                    _26.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 50: return [2 /*return*/, (_26.sent(), { deny: gated.deny })];
                case 51:
                    grants = gated.grants;
                    return [4 /*yield*/, gateRelease($, e, raw)];
                case 52:
                    released = _26.sent();
                    if (!released.deny) return [3 /*break*/, 56];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 53:
                    _26.sent();
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 54:
                    _26.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 55:
                    _26.sent();
                    return [2 /*return*/, { deny: released.deny }];
                case 56:
                    grants = __spreadArray(__spreadArray([], grants, true), released.grants, true);
                    _q = [[String((_7 = e.command) !== null && _7 !== void 0 ? _7 : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_8 = e.command) !== null && _8 !== void 0 ? _8 : ''))];
                case 57:
                    if (!__spreadArray.apply(void 0, _q.concat([(_26.sent()), true])).some(function (text) { return /\bbin\/(?:admin|secret)\b/.test(text); })) return [3 /*break*/, 59];
                    _r = runnerBegun;
                    _s = [e.tool_use_id, String((_9 = e.command) !== null && _9 !== void 0 ? _9 : '')];
                    return [4 /*yield*/, $.clock.now()];
                case 58:
                    _r.apply(void 0, _s.concat([_26.sent()]));
                    _26.label = 59;
                case 59:
                    if (!!isRefusedHere) return [3 /*break*/, 64];
                    return [4 /*yield*/, gateOwnFile($, e, raw)];
                case 60:
                    fileSaid = _26.sent();
                    if (!fileSaid) return [3 /*break*/, 64];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 61:
                    _26.sent();
                    return [4 /*yield*/, callRefused($, e.tool_use_id)];
                case 62:
                    _26.sent();
                    return [4 /*yield*/, noteCallEnded($, e.tool_use_id).catch(function () { return undefined; })];
                case 63: return [2 /*return*/, (_26.sent(), { deny: fileSaid })];
                case 64:
                    woken = '';
                    next = function (asked) { return __awaiter(_this, void 0, void 0, function () {
                        var isMovedBack, call, isSpanned, spanAt, _a, from, _b, r, shown;
                        var _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    isMovedBack = Boolean(dir) && !isOff && e.agentId !== undefined && isLongHeld(asked);
                                    call = isMovedBack ? __assign(__assign({}, asked), { run_in_background: true }) : asked;
                                    if (!isMovedBack) return [3 /*break*/, 2];
                                    return [4 /*yield*/, log($, "work ".concat(e.agentId, "'s long command started in the background: ").concat(oneLine(String((_c = asked.description) !== null && _c !== void 0 ? _c : '')).slice(0, 80)))
                                        // A piece of work's command is known by the process numbers handed out while it runs, so what it leaves going is found
                                    ];
                                case 1:
                                    _f.sent();
                                    _f.label = 2;
                                case 2:
                                    isSpanned = Boolean(dir) && !isOff && e.agentId !== undefined && call.tool === 'Bash';
                                    if (!isSpanned) return [3 /*break*/, 4];
                                    return [4 /*yield*/, $.clock.now()];
                                case 3:
                                    _a = _f.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    _a = 0;
                                    _f.label = 5;
                                case 5:
                                    spanAt = _a;
                                    if (!isSpanned) return [3 /*break*/, 7];
                                    return [4 /*yield*/, pidNow($)];
                                case 6:
                                    _b = _f.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    _b = 0;
                                    _f.label = 8;
                                case 8:
                                    from = _b;
                                    if (from)
                                        openCalls.set(String((_d = call.tool_use_id) !== null && _d !== void 0 ? _d : ''), { from: from, at: spanAt });
                                    return [4 /*yield*/, run(call).finally(function () { var _a; return openCalls.delete(String((_a = call.tool_use_id) !== null && _a !== void 0 ? _a : '')); })];
                                case 9:
                                    r = _f.sent();
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === woken && one.answeredAt ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); })
                                        // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
                                    ];
                                case 10:
                                    _f.sent();
                                    _f.label = 11;
                                case 11:
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 13];
                                    return [4 /*yield*/, wakeCard($, woken)];
                                case 12:
                                    _f.sent();
                                    _f.label = 13;
                                case 13:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, keepBackground($, e.agentId, call, r.result).catch(function (err) { return log($, "background work not followed: ".concat(String(err))); })];
                                case 14:
                                    _f.sent();
                                    _f.label = 15;
                                case 15:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError && !call.run_in_background)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, keepDetached($, e.agentId, call, r.result).catch(function (err) { return log($, "detached work not followed: ".concat(String(err))); })
                                        // (one that failed may still have left something going)
                                    ];
                                case 16:
                                    _f.sent();
                                    _f.label = 17;
                                case 17:
                                    if (!(from && e.agentId !== undefined && !r.deny)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, keepSpan($, e.agentId, call, from, spanAt, r.result).catch(function (err) { return log($, "left runs not looked for: ".concat(String(err))); })];
                                case 18:
                                    _f.sent();
                                    _f.label = 19;
                                case 19: return [4 /*yield*/, keysLearn($, call, r).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                                case 20:
                                    _f.sent();
                                    return [4 /*yield*/, hideKept($, call, r)];
                                case 21:
                                    shown = _f.sent();
                                    return [2 /*return*/, isMovedBack && !shown.deny && !shown.isError ? __assign(__assign({}, shown), { context: __spreadArray(__spreadArray([], ((_e = shown.context) !== null && _e !== void 0 ? _e : []), true), [MOVED_BACK(who())], false) }) : shown];
                            }
                        });
                    }); };
                    if (!(dir && !isOff && (e.tool === 'SendMessage' || e.tool === 'Agent'))) return [3 /*break*/, 67];
                    call = e;
                    resume = e.tool === 'SendMessage' ? String((_10 = call.to) !== null && _10 !== void 0 ? _10 : '') : String((_11 = call.resume) !== null && _11 !== void 0 ? _11 : '');
                    _t = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 65:
                    held_1 = _t.apply(void 0, [_26.sent(), (_12 = e.agentId) !== null && _12 !== void 0 ? _12 : '', resume, String((_13 = call.description) !== null && _13 !== void 0 ? _13 : ''), String((_14 = call.prompt) !== null && _14 !== void 0 ? _14 : '')]);
                    if (!held_1) return [3 /*break*/, 67];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " that would set going again ").concat(held_1.id, ", which the person stopped"))];
                case 66:
                    _26.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_1))) }];
                case 67:
                    steered = '';
                    from = '';
                    answered = '';
                    message = '';
                    woke = '';
                    words = '';
                    isWhole = false;
                    if (!(dir && e.tool === 'SendMessage')) return [3 /*break*/, 73];
                    to_1 = String((_15 = e.to) !== null && _15 !== void 0 ? _15 : '');
                    message = String((_16 = e.message) !== null && _16 !== void 0 ? _16 : '');
                    theirs = e.agentId === undefined ? heard.findLast(function (one) { return carries(message, one); }) : undefined;
                    words = theirs ? quoted(theirs, 600) : '';
                    // Their words and nothing more: else only the words quoted are told as theirs, and the rest as the chat's
                    isWhole = Boolean(theirs) && isTheirsWhole(message, theirs !== null && theirs !== void 0 ? theirs : '');
                    return [4 /*yield*/, $.clock.now()];
                case 68:
                    now_1 = _26.sent();
                    return [4 /*yield*/, read($, todos)];
                case 69:
                    list = _26.sent();
                    target_1 = to_1 ? ((_17 = list.find(function (one) { return one.id === to_1; })) !== null && _17 !== void 0 ? _17 : list.find(function (one) { return to_1.startsWith(one.id); })) : undefined;
                    given = target_1 && e.agentId === undefined ? sentReplies.get(target_1.id) : undefined;
                    isRepeat = Boolean((given === null || given === void 0 ? void 0 : given.isCard) && (given.to === 'work' || given.to === 'read') && now_1 - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text));
                    if (!(given && target_1 && isRepeat && !(target_1.ask && target_1.ask.at > given.at))) return [3 /*break*/, 71];
                    return [4 /*yield*/, log($, "refused a second copy of an answer to ".concat(target_1.id))];
                case 70:
                    _26.sent();
                    return [2 /*return*/, { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }];
                case 71:
                    asking = target_1 && words && e.agentId === undefined ? ((_18 = list.find(function (one) { return one.id === target_1.id && one.ask; })) !== null && _18 !== void 0 ? _18 : list.find(function (one) { var _a; return ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.from) === target_1.id; })) : undefined;
                    asked_1 = (asking === null || asking === void 0 ? void 0 : asking.ask) ? "".concat(asking.id, ":").concat(asking.ask.at, ":").concat(asking.ask.text) : '';
                    if ((asking === null || asking === void 0 ? void 0 : asking.ask) && !answeredAsks.has(asked_1)) {
                        answeredAsks.add(asked_1);
                        answered = asking.ask.text;
                        answer = { card: asking, ask: asking.ask, key: asked_1, words: words, at: now_1 };
                    }
                    if (!target_1) return [3 /*break*/, 73];
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
                                        ? 'the task that started you'
                                        : "the task".concat(title(sender));
                    }
                    return [4 /*yield*/, changeTodos($, function (list) {
                            return list.map(function (one) {
                                var _a;
                                return one.id !== target_1.id
                                    ? one
                                    : __assign(__assign({}, one), { owes: isSteer_1 ? 0 : one.owes, entries: words && ((_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== words ? __spreadArray(__spreadArray([], one.entries, true), [{ at: now_1, kind: 'steer', text: words }], false).slice(-ENTRIES_KEPT) : one.entries });
                            });
                        })];
                case 72:
                    _26.sent();
                    if (isSteer_1 || from || answered || woke)
                        steered = target_1.id;
                    _26.label = 73;
                case 73:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 76];
                    id_1 = e.agentId;
                    // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
                    if (e.tool === 'Agent')
                        helperCalls.set(e.tool_use_id, id_1);
                    endedByHandback.delete(id_1);
                    stoppedHere.delete(id_1);
                    if (!dir) return [3 /*break*/, 76];
                    return [4 /*yield*/, $.clock.now()];
                case 74:
                    now_2 = _26.sent();
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
                case 75:
                    _26.sent();
                    if (nudge_1)
                        void tell($, id_1, nudge_1);
                    _26.label = 76;
                case 76:
                    if (!steered) return [3 /*break*/, 80];
                    return [4 /*yield*/, next(e)];
                case 77:
                    sent = _26.sent();
                    if (!answer) return [3 /*break*/, 79];
                    return [4 /*yield*/, answeredInChat($, answer, steered, !sent.deny && !sent.isError)
                        // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
                        // message of its own instead, read once it reaches it
                        // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
                        // chat's own note that landed after the person's words once marked their words as not theirs
                    ];
                case 78:
                    _26.sent();
                    _26.label = 79;
                case 79:
                    line_1 = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole));
                    if (!sent.deny)
                        void tell($, steered, line_1).then(function (r) { return (!r || r.deny ? sendOwn($, { to: { agentId: steered }, text: line_1 }).catch(function (err) { return log($, "work ".concat(steered, " not told: ").concat(String(err))); }) : undefined); });
                    return [2 /*return*/, sent];
                case 80:
                    if (!(e.agentId !== undefined && String(e.tool) === 'SubagentHandback')) return [3 /*break*/, 83];
                    return [4 /*yield*/, holdAtHandback($, e.agentId).catch(function () { return ''; })];
                case 81:
                    hold = _26.sent();
                    if (hold)
                        return [2 /*return*/, { deny: hold }];
                    return [4 /*yield*/, next(e)];
                case 82:
                    r = _26.sent();
                    if (!r.deny && !r.isError)
                        handedBack.set(e.agentId, String((_19 = e.message) !== null && _19 !== void 0 ? _19 : '').trim());
                    return [2 /*return*/, r];
                case 83:
                    askedModel = !isOff && e.tool === 'Agent' && e.subagent_type !== 'fork' ? String((_20 = e.model) !== null && _20 !== void 0 ? _20 : '') : '';
                    better = askedModel ? rightModel(askedModel) : undefined;
                    if (!better) return [3 /*break*/, 85];
                    alias = ((_21 = modelName(better).split(' ')[0]) !== null && _21 !== void 0 ? _21 : '').toLowerCase();
                    return [4 /*yield*/, log($, "an Agent call on ".concat(modelName(askedModel), " starts on ").concat(modelName(better)))];
                case 84:
                    _26.sent();
                    return [2 /*return*/, next(__assign(__assign({}, e), { model: alias }))];
                case 85:
                    if (e.agentId !== undefined)
                        return [2 /*return*/, next(e)];
                    _u = isOff;
                    if (_u) return [3 /*break*/, 87];
                    return [4 /*yield*/, read($, me)];
                case 86:
                    _u = !(_26.sent()).isChat;
                    _26.label = 87;
                case 87:
                    if (_u)
                        return [2 /*return*/, next(e)
                            // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
                        ];
                    if (!(e.tool === 'Agent')) return [3 /*break*/, 89];
                    call = e;
                    if (!(call.subagent_type === 'fork' || !String((_22 = call.model) !== null && _22 !== void 0 ? _22 : '').trim())) return [3 /*break*/, 89];
                    return [4 /*yield*/, log($, "refused an Agent call ".concat(call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'))];
                case 88:
                    _26.sent();
                    return [2 /*return*/, { deny: NO_COPY() }];
                case 89:
                    if (!(e.tool === 'TaskStop' && dir)) return [3 /*break*/, 98];
                    return [4 /*yield*/, next(e)];
                case 90:
                    r = _26.sent();
                    stopId_1 = String((_23 = e.task_id) !== null && _23 !== void 0 ? _23 : '');
                    if (!(!r.deny && stopId_1)) return [3 /*break*/, 97];
                    stoppedHere.add(stopId_1);
                    return [4 /*yield*/, stopHelpers($, stopId_1)];
                case 91:
                    _26.sent();
                    return [4 /*yield*/, dropBackground($, [stopId_1], 'stopped')];
                case 92:
                    _26.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 93:
                    now_3 = _26.sent();
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === stopId_1 && !one.parentId && one.status === 'working' ? ended(one, stoppedAs(one), now_3) : one.id === stopId_1 && one.leftSince ? __assign(__assign({}, one), { leftSince: undefined }) : one); }); })];
                case 94:
                    _26.sent();
                    return [4 /*yield*/, keepStoppedReports($, now_3)];
                case 95:
                    _26.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 96:
                    _26.sent();
                    _26.label = 97;
                case 97: return [2 /*return*/, r];
                case 98:
                    if (OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }))
                        return [2 /*return*/, next(e)
                            // The chat's single command always runs in the background, so no command holds the chat; Claudopus stops it at its limit
                        ];
                    if (!isChatCommand) return [3 /*break*/, 102];
                    return [4 /*yield*/, next(__assign(__assign({}, e), { run_in_background: true }))];
                case 99:
                    r = _26.sent();
                    if (!(!r.deny && !r.isError)) return [3 /*break*/, 101];
                    return [4 /*yield*/, chatCommandStarted($, e, r.result).catch(function (err) { return log($, "the chat's command not followed: ".concat(String(err))); })];
                case 100:
                    _26.sent();
                    _26.label = 101;
                case 101: return [2 /*return*/, r];
                case 102:
                    readPath = String((_25 = (_24 = e.file_path) !== null && _24 !== void 0 ? _24 : e.path) !== null && _25 !== void 0 ? _25 : '');
                    isPaste = Boolean(dir) && (readPath === "".concat(dir, "/pastes") || readPath.startsWith("".concat(dir, "/pastes/")));
                    if (READS.includes(e.tool) && !isPaste)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " in a chat's own thread"))];
                case 103:
                    _26.sent();
                    if (!grants.length) return [3 /*break*/, 105];
                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })];
                case 104:
                    _26.sent();
                    _26.label = 105;
                case 105: return [2 /*return*/, { deny: REFUSED }];
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
            var id, _a, chosen, _b, card, _c, helpers, _d, _e, _f, own, isOwnOlder, isMovedByApp, n, text, call, instead, moved, _g, pick, to, r, tokens, model;
            var _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        id = e.agentId;
                        if (id !== undefined)
                            replyRead($, id);
                        _a = id !== undefined && dir;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 1:
                        _a = (_q.sent()).some(function (one) { return one.id === id && one.answeredAt; });
                        _q.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { answeredAt: undefined }) : one); }); }))];
                    case 3:
                        _q.sent();
                        _q.label = 4;
                    case 4:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 5:
                        _b = (_h = (_q.sent()).find(function (one) { return one.id === id; })) === null || _h === void 0 ? void 0 : _h.chosen;
                        return [3 /*break*/, 7];
                    case 6:
                        _b = undefined;
                        _q.label = 7;
                    case 7:
                        chosen = _b;
                        if (!(id !== undefined && dir)) return [3 /*break*/, 9];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 8:
                        _c = (_q.sent()).find(function (one) { return one.id === id; });
                        return [3 /*break*/, 10];
                    case 9:
                        _c = undefined;
                        _q.label = 10;
                    case 10:
                        card = _c;
                        if (!(id !== undefined && card && !isOff && card.handedBackAt === undefined)) return [3 /*break*/, 12];
                        _e = runningHelpers;
                        return [4 /*yield*/, __await(read($, todos))];
                    case 11:
                        _d = _e.apply(void 0, [_q.sent(), id]).length;
                        return [3 /*break*/, 13];
                    case 12:
                        _d = 0;
                        _q.label = 13;
                    case 13:
                        helpers = _d;
                        _f = id !== undefined && card && !isOff && card.handedBackAt === undefined && (((_j = card.detached) === null || _j === void 0 ? void 0 : _j.length) || card.wakeWhen || helpers);
                        if (!_f) return [3 /*break*/, 15];
                        return [4 /*yield*/, __await(isPressedForReport($, id))];
                    case 14:
                        _f = (_q.sent());
                        _q.label = 15;
                    case 15:
                        if (!_f) return [3 /*break*/, 22];
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " pressed by the engine for its report while ").concat(((_k = card.detached) === null || _k === void 0 ? void 0 : _k.length) ? 'its own detached command runs' : helpers ? "".concat(plural(helpers, 'a helper', 'helpers'), " of its own ").concat(helpers === 1 ? 'runs' : 'run') : 'it waits to be woken', ": let it end its step")))];
                    case 16:
                        _q.sent();
                        return [4 /*yield*/, __await({ kind: 'text', index: 0, text: LEFT_AT_WORK })];
                    case 17: return [4 /*yield*/, _q.sent()];
                    case 18:
                        _q.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 19: return [4 /*yield*/, _q.sent()];
                    case 20:
                        _q.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: LEFT_AT_WORK, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 21: return [2 /*return*/, _q.sent()];
                    case 22:
                        // A step of its own: the chat is told again the next time it ends its step to wait
                        if (id !== undefined)
                            toldWaitsOn.delete(id);
                        own = id !== undefined ? ((_l = startedOn.get(id)) !== null && _l !== void 0 ? _l : card === null || card === void 0 ? void 0 : card.startedOn) : undefined;
                        isOwnOlder = id !== undefined && !flaggedOnce.has(id) && !(card === null || card === void 0 ? void 0 : card.flagged) && own !== undefined && Boolean(rightModel(own)) && modelName(own) === modelName(e.model);
                        isMovedByApp = id !== undefined && !isOff && Boolean(rightModel(e.model)) && !isOwnOlder;
                        if (!(isMovedByApp && own !== undefined && id !== undefined)) return [3 /*break*/, 41];
                        n = ((_m = flaggedSteps.get(id)) !== null && _m !== void 0 ? _m : 0) + 1;
                        flaggedSteps.set(id, n);
                        flaggedOnce.add(id);
                        if (!(n === 1)) return [3 /*break*/, 24];
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was flagged and the app would send it to ").concat(modelName(e.model), ": it is ended with a report instead")))];
                    case 23:
                        _q.sent();
                        _q.label = 24;
                    case 24:
                        if (!dir) return [3 /*break*/, 27];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { flagged: modelName(e.model), moved: undefined }) : one); }); }))];
                    case 25:
                        _q.sent();
                        return [4 /*yield*/, __await(stopHelpers($, id).catch(function () { return undefined; }))];
                    case 26:
                        _q.sent();
                        _q.label = 27;
                    case 27:
                        // Its report goes back through the handback tool; where that does not end it, a plain last answer, and past a few the work is
                        // stopped as a press on Stop would
                        if (n > 3)
                            void $.tool.call({ tool: 'TaskStop', task_id: id }).catch(function () { return undefined; });
                        text = FLAGGED(e.model);
                        if (!(n === 1)) return [3 /*break*/, 35];
                        call = "toolu_flagged_".concat(id);
                        return [4 /*yield*/, __await({ kind: 'tool', index: 0, id: call, name: 'SubagentHandback' })];
                    case 28: return [4 /*yield*/, _q.sent()];
                    case 29:
                        _q.sent();
                        return [4 /*yield*/, __await({ kind: 'input', index: 0, json: JSON.stringify({ message: text }) })];
                    case 30: return [4 /*yield*/, _q.sent()];
                    case 31:
                        _q.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'tool_use', usage: null })];
                    case 32: return [4 /*yield*/, _q.sent()];
                    case 33:
                        _q.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: '', toolUses: [{ name: 'SubagentHandback', input: { message: text } }], stopReason: 'tool_use', usage: null })];
                    case 34: return [2 /*return*/, _q.sent()];
                    case 35: return [4 /*yield*/, __await({ kind: 'text', index: 0, text: text })];
                    case 36: return [4 /*yield*/, _q.sent()];
                    case 37:
                        _q.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 38: return [4 /*yield*/, _q.sent()];
                    case 39:
                        _q.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: text, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 40: return [2 /*return*/, _q.sent()];
                    case 41:
                        instead = id !== undefined && !isOff && !isMovedByApp && !chosen ? rightModel(e.model) : undefined;
                        if (!(id !== undefined && (isMovedByApp || instead) && !sentElsewhere.has("".concat(id, " ").concat(e.model)))) return [3 /*break*/, 43];
                        sentElsewhere.add("".concat(id, " ").concat(e.model));
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was sent to ").concat(modelName(e.model), " by the app: ").concat(instead ? "its steps go to ".concat(modelName(instead)) : 'its steps stay there')))];
                    case 42:
                        _q.sent();
                        _q.label = 43;
                    case 43:
                        moved = isMovedByApp ? modelName(e.model) : undefined;
                        _g = id !== undefined && dir;
                        if (!_g) return [3 /*break*/, 45];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 44:
                        _g = (_q.sent()).some(function (one) { return one.id === id && one.moved !== moved; });
                        _q.label = 45;
                    case 45:
                        if (!_g) return [3 /*break*/, 47];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { moved: moved }) : one); }); })
                            // A pick the engine has since passed is its family's newest
                            )];
                    case 46:
                        _q.sent();
                        _q.label = 47;
                    case 47:
                        pick = chosen ? ((_o = rightModel(chosen)) !== null && _o !== void 0 ? _o : chosen) : undefined;
                        to = pick && !isMovedByApp && modelName(pick) !== modelName(e.model) ? pick : instead;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(next(to ? __assign(__assign({}, e), { model: to }) : e))))];
                    case 48: return [4 /*yield*/, __await.apply(void 0, [_q.sent()])];
                    case 49:
                        r = _q.sent();
                        tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0;
                        model = (_p = r.usage) === null || _p === void 0 ? void 0 : _p.model;
                        if (model)
                            seeModel(model);
                        if (!(id !== undefined && tokens && flowAgents.has(id))) return [3 /*break*/, 51];
                        return [4 /*yield*/, __await(flowStep($, id, tokens, model).catch(function () { return undefined; }))];
                    case 50:
                        _q.sent();
                        _q.label = 51;
                    case 51:
                        if (!(id !== undefined && tokens && dir)) return [3 /*break*/, 53];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { var _a; return (one.id === id ? __assign(__assign({}, one), { tokens: tokens, model: (_a = one.chosen) !== null && _a !== void 0 ? _a : (modelName(model !== null && model !== void 0 ? model : '') ? model : one.model) }) : one); }); }))];
                    case 52:
                        _q.sent();
                        _q.label = 53;
                    case 53: return [4 /*yield*/, __await(r)];
                    case 54: return [2 /*return*/, _q.sent()];
                }
            });
        });
    });
    // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
    on('classic.SubagentStop', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, live, ids_1, gone;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _c.sent();
                    live = e.background_tasks;
                    if (!(dir && Array.isArray(live))) return [3 /*break*/, 4];
                    ids_1 = new Set(live.map(function (one) { return one.id; }));
                    return [4 /*yield*/, read($, todos)];
                case 2:
                    gone = ((_b = (_a = (_c.sent()).find(function (one) { return one.id === e.agent_id; })) === null || _a === void 0 ? void 0 : _a.bg) !== null && _b !== void 0 ? _b : []).filter(function (b) { return !ids_1.has(b.id); }).map(function (b) { return b.id; });
                    if (!gone.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, dropBackground($, gone).catch(function (err) { return log($, "ended background work not let go: ".concat(String(err))); })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, r];
            }
        });
    }); });
    on('agent.spawn', function ($, asked, next) { return __awaiter(_this, void 0, void 0, function () {
        var held_2, _a, kinded, start, e, r_1, parentId, isOwn, isTold, _b, rules, _c, isBackground, r, id, now, named1, _d, goesOn, from;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    agentStarted($, asked.tool_use_id);
                    if (!(dir && !isOff && !asked.workflow)) return [3 /*break*/, 3];
                    _a = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    held_2 = _a.apply(void 0, [_t.sent(), (_f = (_e = asked.parentAgentId) !== null && _e !== void 0 ? _e : helperCalls.get(asked.tool_use_id)) !== null && _f !== void 0 ? _f : '', (_h = (_g = asked.resume) === null || _g === void 0 ? void 0 : _g.agentId) !== null && _h !== void 0 ? _h : '', (_j = asked.description) !== null && _j !== void 0 ? _j : '', asked.resume ? '' : ((_k = asked.prompt) !== null && _k !== void 0 ? _k : '')]);
                    if (!held_2) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused to start again ".concat(held_2.id, ", which the person stopped"))];
                case 2:
                    _t.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_2))) }];
                case 3:
                    kinded = isOff ? {} : kindStart(asked);
                    if (!(kinded.subagentType || kinded.model)) return [3 /*break*/, 5];
                    return [4 /*yield*/, log($, "an agent of kind ".concat(asked.subagentType, " starts").concat(kinded.subagentType ? " as ".concat(kinded.subagentType) : '').concat(kinded.model ? " on ".concat(modelName(kinded.model) || kinded.model) : ''))];
                case 4:
                    _t.sent();
                    _t.label = 5;
                case 5:
                    start = isOff || asked.resume ? undefined : startModel(__assign(__assign({}, asked), kinded));
                    if (!(start === null || start === void 0 ? void 0 : start.deny)) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, "refused a copy of an agent on ".concat(modelName(String((_l = asked.parentModel) !== null && _l !== void 0 ? _l : ''))))];
                case 6:
                    _t.sent();
                    return [2 /*return*/, { deny: start.deny }];
                case 7:
                    if (!(start === null || start === void 0 ? void 0 : start.model)) return [3 /*break*/, 9];
                    return [4 /*yield*/, log($, "".concat(asked.workflow ? 'a workflow agent' : 'an agent', " asked to run on ").concat(modelName((_m = asked.model) !== null && _m !== void 0 ? _m : '') || "its parent's ".concat(modelName(String((_o = asked.parentModel) !== null && _o !== void 0 ? _o : '')) || 'model'), " starts on ").concat(modelName(start.model)))];
                case 8:
                    _t.sent();
                    _t.label = 9;
                case 9:
                    e = __assign(__assign(__assign({}, asked), kinded), ((start === null || start === void 0 ? void 0 : start.model) ? { model: start.model } : {}));
                    if (!e.workflow) return [3 /*break*/, 13];
                    return [4 /*yield*/, next(e)];
                case 10:
                    r_1 = _t.sent();
                    if (r_1.model)
                        seeModel(r_1.model);
                    if (r_1.agentId && r_1.model && !e.resume)
                        startedOn.set(r_1.agentId, r_1.model);
                    if (!(r_1.agentId && dir)) return [3 /*break*/, 12];
                    return [4 /*yield*/, flowSpawned($, e.workflow.runId, r_1.agentId, modelName((_p = r_1.model) !== null && _p !== void 0 ? _p : '') ? r_1.model : e.model || r_1.model || '', (_q = e.description) !== null && _q !== void 0 ? _q : '').catch(function (err) { return log($, "workflow agent not kept: ".concat(String(err))); })];
                case 11:
                    _t.sent();
                    _t.label = 12;
                case 12: return [2 /*return*/, r_1];
                case 13:
                    parentId = (_s = (_r = e.parentAgentId) !== null && _r !== void 0 ? _r : helperCalls.get(e.tool_use_id)) !== null && _s !== void 0 ? _s : '';
                    isOwn = !parentId;
                    _b = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow;
                    if (!_b) return [3 /*break*/, 15];
                    return [4 /*yield*/, read($, me)];
                case 14:
                    _b = (_t.sent()).isChat;
                    _t.label = 15;
                case 15:
                    isTold = _b;
                    if (!isTold) return [3 /*break*/, 17];
                    return [4 /*yield*/, workRules($)];
                case 16:
                    _c = _t.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _c = '';
                    _t.label = 18;
                case 18:
                    rules = _c;
                    isBackground = isHelperSpawn(e);
                    return [4 /*yield*/, next(isTold ? __assign(__assign({}, e), { prompt: "".concat(e.prompt, "\n\n").concat(rules) }) : isBackground ? __assign(__assign({}, e), { background: true }) : e)];
                case 19:
                    r = _t.sent();
                    if (!(isBackground && r.agentId)) return [3 /*break*/, 21];
                    return [4 /*yield*/, log($, "helper ".concat(r.agentId, " of ").concat(e.parentAgentId, " runs in the background"))];
                case 20:
                    _t.sent();
                    _t.label = 21;
                case 21:
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
                case 22:
                    now = _t.sent();
                    if (!(isOwn && !fromReport && !e.resume)) return [3 /*break*/, 24];
                    return [4 /*yield*/, read($, reports)];
                case 23:
                    _d = (_t.sent()).filter(function (one) { return e.prompt.includes("reports/".concat(one.id, "/")) || e.prompt.endsWith("reports/".concat(one.id)); });
                    return [3 /*break*/, 25];
                case 24:
                    _d = [];
                    _t.label = 25;
                case 25:
                    named1 = _d;
                    goesOn = named1.length === 1 && named1[0] && __spreadArray([], aboutWords(named1[0].title), true).some(function (word) { var _a; return aboutWords((_a = e.description) !== null && _a !== void 0 ? _a : '').has(word); }) ? named1[0].id : '';
                    from = fromReport || goesOn;
                    return [4 /*yield*/, changeTodos($, function (list) {
                            var _a, _b, _c;
                            var old = list.find(function (one) { return one.id === id; });
                            // Its title is the few words the task was given; under it, the person's message as they wrote it
                            var fresh = __assign(__assign({}, started(id, parentId, (_a = e.description) !== null && _a !== void 0 ? _a : '', isOwn ? said : '', now, e.fork)), (isOwn && from ? { from: from } : {}));
                            return capped(__spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== id; }), true), [__assign(__assign(__assign({}, (old ? resumed(old, now) : fresh)), { model: (_b = old === null || old === void 0 ? void 0 : old.chosen) !== null && _b !== void 0 ? _b : r.model, startedOn: (_c = old === null || old === void 0 ? void 0 : old.startedOn) !== null && _c !== void 0 ? _c : (e.resume ? undefined : r.model) }), (rules ? { rulesSent: hashOf(rules) } : {}))], false));
                        })];
                case 26:
                    _t.sent();
                    if (!isOwn) return [3 /*break*/, 28];
                    return [4 /*yield*/, openList($)];
                case 27:
                    _t.sent();
                    _t.label = 28;
                case 28: return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 29:
                    _t.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
