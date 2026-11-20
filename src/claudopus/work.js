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
// command ends (16 Nov: a reply waited 8 minutes behind a 9-minute wait for the person). A build, render, browser run or download
// that asks for a longer time limit is refused with the same call to send in the background: its end starts the task's next step,
// and it reads a reply at once meanwhile. A long time limit alone says nothing (16-17 Nov: most were a push, a short test or a
// look), so any other runs as sent. Never turned to the background by the mod: auto mode reviews a call as the model writes it, and
// refuses one a hook has changed since (16-17 Nov: 484 calls). Not the mod's own runners: a release, a password or a key
var HELD_LONGEST = 2 * 60000;
var isLongHeld = function (call) {
    var _a, _b, _c;
    var command = String((_a = call.command) !== null && _a !== void 0 ? _a : '');
    var description = String((_b = call.description) !== null && _b !== void 0 ? _b : '');
    return call.tool === 'Bash' && !call.run_in_background && !/\bbin\/(?:admin|secret|release)\b|(?:^|[\s;&|(])\.\/(?:admin|secret|release)\b/.test(command) && Number((_c = call.timeout) !== null && _c !== void 0 ? _c : 0) > HELD_LONGEST && (Boolean(heavyOf(command)) || jobKindOf(command, description) === 'download');
};
// A command that detaches what it starts from Claude Code's sight: under nohup or setsid, disowned, or sent off with a trailing &
// (with `echo $!` or not). Nothing is detached: a command Claude Code does not track has no row on its card, and its end starts
// nothing. Not one that goes to another Mac over ssh, where what it starts is that Mac's
var isDetaching = function (call) {
    var _a;
    var command = String((_a = call.command) !== null && _a !== void 0 ? _a : '');
    if (call.tool !== 'Bash' || /\bbin\/(?:admin|secret|release)\b/.test(command) || /^\s*(?:\S*\/)?ssh\b/.test(command))
        return false;
    // (as the shell reads it: what is quoted, or written into a here-document, is not run)
    var shell = command.replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\2\b/g, ' ').replace(/"(?:\\.|[^"\\])*"|'[^']*'/g, '""');
    return /(?:^|[\s;&|(])(?:nohup|setsid|disown)(?:\s|$|;)/.test(shell) || /(?<![&>|<])&(?![&>])\s*(?:$|[;)\n]|echo\s+\$!|\S)/.test(shell.replace(/\d?>&\d?|&>>?/g, ' '));
};
var NO_DETACH = 'Not run: this command detaches what it starts (nohup, setsid, disown or a trailing &), so nothing would show it on your card or tell you when it ends. Send the command itself, without those, with `run_in_background: true`.';
// A wait for the person themselves, by the words the work gives its command: there is no time to give them. Their answer to a
// question comes as a message the moment they give it, however long it takes, so the work ends its step instead
var isPersonWait = function (call, name) {
    var _a, _b;
    var them = "you".concat(name ? "|".concat(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : '');
    return (call.tool === 'Bash' &&
        !/\bbin\/(?:admin|secret|release)\b/.test(String((_a = call.command) !== null && _a !== void 0 ? _a : '')) &&
        new RegExp(String.raw(__makeTemplateObject(["^s*(?:wait|watch|poll)(?:ing)?s+(?:for|until|on)s+(?:(?:", ")\b(?!')|(?:your|(?:", ")'s)s+(?:answer|reply|response|press|go-ahead|yes|try|decision|word)s?(?=s*(?:$|[(.,;:]|(?:to|on|about|before)\b)))"], ["^\\s*(?:wait|watch|poll)(?:ing)?\\s+(?:for|until|on)\\s+(?:(?:", ")\\b(?!')|(?:your|(?:", ")'s)\\s+(?:answer|reply|response|press|go-ahead|yes|try|decision|word)s?(?=\\s*(?:$|[(.,;:]|(?:to|on|about|before)\\b)))"]), them, them), 'i').test(String((_b = call.description) !== null && _b !== void 0 ? _b : '')));
};
var asksNow = function (list, agent) {
    var top = topOf(list, agent);
    return list.some(function (one) { var _a; return (one.id === agent || one.id === top) && Boolean(one.ask) && !((_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied); });
};
var NO_PERSON_WAIT = function (name) {
    return "Not run: this command waits for ".concat(name, ", and a wait with a time limit gives them one. Don't wait for ").concat(name, " with a command at all. End your step now: your question stays on the card for as long as it takes, and ").concat(name, "'s answer comes to you as a message the moment they give it. Anything you need to see of what they did (a recording, a file, a page), look at once their answer has come.");
};
// The note Claude Code adds when a task ends its step without its report. Where the press can bring nothing (its report was taken
// already, or it ended its step with a question or a permission open for the person), it is answered with no model, by a line the
// app draws as nothing in a task's chat (it takes system reminders out of an agent's text, and leaves out a block left empty)
var HANDBACK_PRESS = '[handback-send-enforce]';
var PRESS_ANSWER = '<system-reminder>Waiting for an answer.</system-reminder>';
// (`isAnyWords`: whatever it said before; else only words shorter than a report, as a report in words goes on to the press)
var isPressedForReport = function ($_1, id_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1], args_1, true), void 0, function ($, id, isAnyWords) {
        var talk, textOf, last, said;
        if (isAnyWords === void 0) { isAnyWords = false; }
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
                    return [2 /*return*/, isAnyWords || textOf(said).trim().length < REPORT_LEAST];
            }
        });
    });
};
// A task whose report Claudopus took at its hand-back (its card's `tookReport`, the hand-back's call): what comes to it next is that
// call's own result, or Claude Code's press for a report it did not see delivered. Anything else, a message among them, is a step of
// its own
var isAfterTaken = function ($, id, call) { return __awaiter(_this, void 0, void 0, function () {
    var talk, last, blocks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.messages({ as: 'api', agentId: id }).catch(function () { return []; })];
            case 1:
                talk = _a.sent();
                last = (Array.isArray(talk) ? talk.at(-1) : undefined);
                if ((last === null || last === void 0 ? void 0 : last.role) !== 'user')
                    return [2 /*return*/, false];
                blocks = Array.isArray(last.content) ? last.content : [{ type: 'text', text: last.content }];
                return [2 /*return*/, blocks.length > 0 && blocks.every(function (b) { var _a; return ((b === null || b === void 0 ? void 0 : b.type) === 'tool_result' && b.tool_use_id === call) || ((b === null || b === void 0 ? void 0 : b.type) === 'text' && String((_a = b.text) !== null && _a !== void 0 ? _a : '').includes(HANDBACK_PRESS)); })];
        }
    });
}); };
// What a command that only waits is told instead, by what it waits for. A wait for something far away (a cloud job, a page, a
// file) is a watch: the same command in the background, which ends when the thing is there, with a row on the card
var NO_WAIT = function (kind) {
    return kind === 'helpers'
        ? 'Not run: this command only waits for your helpers. Each helper\'s result comes to you as a message, even after you end your step: carry on with what needs nothing from them, or end your step now.'
        : kind === 'time'
            ? 'Not run: this command only passes time, and nothing you start may wait by the clock. To wait for something far away (a cloud job, a page, a file), run a watch in the background that looks for it and ends when it is there: its end starts your next step. With nothing else to do, end your step.'
            : 'Not run: this command only waits, and held open it keeps you from everything else. Send the same call again with `run_in_background: true`, its description beginning with Watch: it is a watch on your card that ends when the thing is there, and its end starts your next step. Carry on meanwhile with what needs nothing from it, or end your step.';
};
var NO_FOLLOW = 'Not run: this only follows a log and would never end, so read the log once when you need it (tail -n 20): the end of your command starts your next step by itself.';
var SEND_BACKGROUND = function (name) {
    return "Not run: this command may run for minutes, and held open it keeps ".concat(name, "'s replies from you until it ends. Send the same call again with `run_in_background: true` and nothing else changed: its end starts your next step, and ").concat(name, "'s replies reach you while it runs. Never wait for ").concat(name, "'s own answer with a command: it comes to you as a message.");
};
// The chat's own command, which runs only in the background
var CHAT_SEND_BACKGROUND = 'Not run: the chat runs its own command only in the background. Send the same call again with `run_in_background: true` and nothing else changed.';
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
// The rules every piece of work a chat starts is handed after its brief, as they stand when it starts: where the chat's words are, the
// work's own rules, and its panel's. They are its rules for as long as it runs: a change made since reaches the next task
var workRules = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var work, _a, _b, words, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = named;
                _b = fillModels;
                return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/work.md')];
            case 1:
                work = _a.apply(void 0, [_b.apply(void 0, [(_e.sent()).text, models, lean])]).replace(/\{admin\}/g, "".concat($.plugin.root, "/bin/admin")).replace(/\{secret\}/g, "".concat($.plugin.root, "/bin/secret")).replace(/\{release\}/g, "".concat($.plugin.root, "/bin/release")).replace(/\{pane-file\}/g, "".concat($.plugin.root, "/bin/pane-file")).trim();
                _d = (_c = "- The chat's saved words, ".concat(who(), "'s messages word for word: ").concat(dir, "/words/")).concat;
                return [4 /*yield*/, read($, me)];
            case 2:
                words = _d.apply(_c, [(_e.sent()).id, ".md"]);
                return [2 /*return*/, "".concat(workHead(), "\n").concat(words, "\n").concat(work, "\n\n").concat(named(PANEL_RULE))];
        }
    });
}); };
// Claudopus's own checkout, when a command would change what is checked out there (changesOf), or nothing. Its own checkout is the
// main checkout of the repo this chat's copy is made from or run from (knowSource, as this load first learnt it): every other repo,
// a worktree of this one, and what a script it runs does are left to run
var ownCheckoutChanged = function ($, texts, start) { return __awaiter(_this, void 0, void 0, function () {
    var home, folders, known, own, _i, folders_1, folder, said_1, _a, _b, gitDir, _c, common, _d, top_1;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                home = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : '';
                folders = texts.flatMap(function (text) { return changesOf(text, start, home); });
                if (!folders.length)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, knowSource($).catch(function () { return undefined; })];
            case 2:
                known = _f.sent();
                own = (known === null || known === void 0 ? void 0 : known.src.kind) === 'folder' ? known.src.repo.replace(/\/+$/, '') : '';
                if (!own)
                    return [2 /*return*/, ''];
                _i = 0, folders_1 = folders;
                _f.label = 3;
            case 3:
                if (!(_i < folders_1.length)) return [3 /*break*/, 6];
                folder = folders_1[_i];
                return [4 /*yield*/, $.process.run(['git', '-C', folder, 'rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir', '--show-toplevel'], { timeoutMs: 10000 }).catch(function () { return ({ exitCode: 1, stdout: '' }); })];
            case 4:
                said_1 = _f.sent();
                _a = said_1.stdout.trim().split('\n').map(function (line) { return line.trim(); }), _b = _a[0], gitDir = _b === void 0 ? '' : _b, _c = _a[1], common = _c === void 0 ? '' : _c, _d = _a[2], top_1 = _d === void 0 ? '' : _d;
                if (said_1.exitCode === 0 && gitDir && gitDir === common && top_1.replace(/\/+$/, '') === own)
                    return [2 /*return*/, own];
                _f.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, ''];
        }
    });
}); };
var workHooks = function (on) {
    // A chat's own thread reads, starts agents and talks to them; the work runs in the agents, which carry an agent id
    on('tool.call', function ($, e, raw) { return __awaiter(_this, void 0, void 0, function () {
        var run, grants, _a, keyKept, ownFiles, crossed, _b, _c, command, card, waits, _d, _e, isWatch, command, _f, _g, command, changed, _h, _j, _k, _l, _m, isChatHere, _o, chatCommand, pushFrom, _p, places, _q, _r, isChatCommand, _s, isRefusedHere, gated, released, _t, _u, _v, fileSaid, woken, next, nextHere, call, resume, held_1, _w, steered, from, answered, answer, message, woke, words, isWhole, to_1, theirs, now_1, list, target_1, given, isRepeat, asking, asked_1, isSteer_1, sender, title, id_1, now_2, isKeeping_1, nudge_1, sent, line, agent_1, refused, _x, report_1, taken_1, now_3, card_1, above, _y, now_4, text_1, parent_1, written_1, r, r, _z, call, r, stopId_1, now_5, r, readPath, isPaste, kind, shape;
        var _this = this;
        var _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34;
        return __generator(this, function (_35) {
            switch (_35.label) {
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
                                    _j.trys.push([10, , 16, 24]);
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
                                    settle($, e.tool_use_id, e.agentId, e.tool, e);
                                    // A call Claude Code refused a task with no prompt is put to the person on its card
                                    if (e.agentId !== undefined)
                                        void refusedByClaudeCode($, e.agentId, e.tool, e, r).catch(function (err) { return log($, "refusal not put to the person: ".concat(String(err))); });
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
                                    return [7 /*endfinally*/];
                                case 24: return [2 /*return*/];
                            }
                        });
                    }); };
                    grants = [];
                    return [4 /*yield*/, isBoxesTouched($, e)];
                case 1:
                    if (!_35.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " touching the password and key boxes"))];
                case 2:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_BOXES }];
                case 3:
                    _a = e.tool === 'Bash';
                    if (!_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, readsKept($, String((_0 = e.command) !== null && _0 !== void 0 ? _0 : ''))];
                case 4:
                    _a = (_35.sent());
                    _35.label = 5;
                case 5:
                    if (!((_a) || touchesKeyring(e))) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, 'refused a command that reads the keychain')];
                case 6:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_READ }];
                case 7: return [4 /*yield*/, keyAsked($, e).catch(function () { return ''; })];
                case 8:
                    keyKept = _35.sent();
                    if (!keyKept) return [3 /*break*/, 10];
                    return [4 /*yield*/, log($, "refused an ask for a key the list of keys has (".concat(e.tool, ")"))];
                case 9:
                    _35.sent();
                    return [2 /*return*/, { deny: keyKept }];
                case 10: return [4 /*yield*/, writesOwnFiles($, e)];
                case 11:
                    ownFiles = _35.sent();
                    if (!ownFiles) return [3 /*break*/, 13];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " writing the memory folder's own files"))];
                case 12:
                    _35.sent();
                    return [2 /*return*/, { deny: ownFiles }];
                case 13: return [4 /*yield*/, crossingOf($, e).catch(function (err) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, log($, "crossing not looked at: ".concat(String(err)))];
                            case 1: return [2 /*return*/, (_a.sent(), {})];
                        }
                    }); }); })];
                case 14:
                    crossed = _35.sent();
                    if (!crossed.deny) return [3 /*break*/, 16];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s ").concat(e.tool, " that crosses another task's files"))];
                case 15:
                    _35.sent();
                    return [2 /*return*/, { deny: crossed.deny }];
                case 16:
                    _b = dir && !isOff && e.agentId !== undefined && isPersonWait(e, who());
                    if (!_b) return [3 /*break*/, 18];
                    _c = asksNow;
                    return [4 /*yield*/, read($, todos)];
                case 17:
                    _b = _c.apply(void 0, [_35.sent(), e.agentId]);
                    _35.label = 18;
                case 18:
                    if (!_b) return [3 /*break*/, 20];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s wait for the person: ").concat(oneLine(String((_1 = e.description) !== null && _1 !== void 0 ? _1 : '')).slice(0, 80)))];
                case 19:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_PERSON_WAIT(who()) }];
                case 20:
                    if (!(dir && !isOff && e.agentId !== undefined && (e.tool === 'Bash' || e.tool === 'Monitor'))) return [3 /*break*/, 28];
                    command = String((_2 = e.command) !== null && _2 !== void 0 ? _2 : '');
                    return [4 /*yield*/, read($, todos)];
                case 21:
                    card = (_35.sent()).find(function (one) { return one.id === e.agentId; });
                    if (!isDetaching(e)) return [3 /*break*/, 23];
                    return [4 /*yield*/, log($, "refused ".concat((card === null || card === void 0 ? void 0 : card.parentId) ? 'helper' : 'work', " ").concat(e.agentId, "'s command that detaches what it starts"))];
                case 22:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_DETACH }];
                case 23:
                    _d = waitingOf;
                    _e = [command];
                    return [4 /*yield*/, scriptsRun($, command)];
                case 24:
                    waits = _d.apply(void 0, _e.concat([_35.sent(), { isWatch: e.tool === 'Monitor' }]));
                    isWatch = e.tool === 'Monitor' || Boolean(e.run_in_background);
                    if (!(waits && (waits === 'helpers' || waits === 'time' || !isWatch))) return [3 /*break*/, 26];
                    return [4 /*yield*/, log($, "refused ".concat((card === null || card === void 0 ? void 0 : card.parentId) ? 'helper' : 'work', " ").concat(e.agentId, "'s command that only waits (").concat(waits, ")"))];
                case 25:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_WAIT(waits) }];
                case 26:
                    if (!(e.tool === 'Bash' && ((_3 = watcherOf(command)) === null || _3 === void 0 ? void 0 : _3.isFollow))) return [3 /*break*/, 28];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s command that only follows a log"))];
                case 27:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_FOLLOW }];
                case 28:
                    if (!(dir && !isOff && e.agentId !== undefined && e.tool === 'Bash' && !e.run_in_background)) return [3 /*break*/, 31];
                    command = String((_4 = e.command) !== null && _4 !== void 0 ? _4 : '');
                    _f = isOwnLongScript;
                    _g = [command, String((_5 = e.description) !== null && _5 !== void 0 ? _5 : '')];
                    return [4 /*yield*/, scriptsRun($, command)];
                case 29:
                    if (!_f.apply(void 0, _g.concat([_35.sent(), Number((_6 = e.timeout) !== null && _6 !== void 0 ? _6 : 0)]))) return [3 /*break*/, 31];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s long script held open"))];
                case 30:
                    _35.sent();
                    return [2 /*return*/, { deny: SEND_BACKGROUND(who()) }];
                case 31:
                    if (!(e.tool === 'Bash' && pushesMain(String((_7 = e.command) !== null && _7 !== void 0 ? _7 : '')))) return [3 /*break*/, 33];
                    return [4 /*yield*/, log($, 'refused a command that pushes or merges to main itself')];
                case 32:
                    _35.sent();
                    return [2 /*return*/, { deny: "".concat(NO_PUSH, " It is ").concat($.plugin.root, "/bin/release.") }];
                case 33:
                    if (!(dir && !isOff && e.agentId !== undefined && e.tool === 'Bash')) return [3 /*break*/, 38];
                    command = String((_8 = e.command) !== null && _8 !== void 0 ? _8 : '');
                    if (!/\bgit\b/.test(command)) return [3 /*break*/, 35];
                    return [4 /*yield*/, ownCheckoutChanged($, [command], cwd || '.')];
                case 34:
                    _h = _35.sent();
                    return [3 /*break*/, 36];
                case 35:
                    _h = '';
                    _35.label = 36;
                case 36:
                    changed = _h;
                    if (!changed) return [3 /*break*/, 38];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s command that changes Claudopus's own checkout"))];
                case 37:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_SWITCH(changed) }];
                case 38:
                    _j = touchesGate(e);
                    if (_j) return [3 /*break*/, 41];
                    _k = e.tool === 'Bash';
                    if (!_k) return [3 /*break*/, 40];
                    return [4 /*yield*/, scriptsRun($, String((_9 = e.command) !== null && _9 !== void 0 ? _9 : ''))];
                case 39:
                    _k = (_35.sent()).some(function (text) { return touchesGate(__assign(__assign({}, e), { command: text })); });
                    _35.label = 40;
                case 40:
                    _j = (_k);
                    _35.label = 41;
                case 41:
                    if (!_j) return [3 /*break*/, 43];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " on the admin gate's own files"))];
                case 42:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_GATE_TOUCH() }];
                case 43:
                    _l = e.tool === 'Bash';
                    if (!_l) return [3 /*break*/, 45];
                    _m = [[String((_10 = e.command) !== null && _10 !== void 0 ? _10 : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_11 = e.command) !== null && _11 !== void 0 ? _11 : ''))];
                case 44:
                    _l = __spreadArray.apply(void 0, _m.concat([(_35.sent()), true])).some(movesRunner);
                    _35.label = 45;
                case 45:
                    if (!_l) return [3 /*break*/, 47];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " running a runner of the mod with another home or without Claude Code's mark"))];
                case 46:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_RUNNER_MOVED }];
                case 47:
                    _o = e.agentId === undefined && !isOff && Boolean(dir);
                    if (!_o) return [3 /*break*/, 49];
                    return [4 /*yield*/, read($, me)];
                case 48:
                    _o = (_35.sent()).isChat;
                    _35.label = 49;
                case 49:
                    isChatHere = _o;
                    chatCommand = isChatHere && e.tool === 'Bash' ? String((_12 = e.command) !== null && _12 !== void 0 ? _12 : '') : '';
                    if (!(chatCommand && !isOneCommand(chatCommand) && !RUNNER_NAMED.test(chatCommand))) return [3 /*break*/, 51];
                    return [4 /*yield*/, log($, "refused a chat's own command that is more than one command")];
                case 50:
                    _35.sent();
                    return [2 /*return*/, { deny: NOT_ONE_COMMAND }];
                case 51:
                    if (!/^\s*git\s+push\b/.test(chatCommand)) return [3 /*break*/, 53];
                    return [4 /*yield*/, $.process.run(['git', '-C', cwd || '.', 'rev-parse', '--abbrev-ref', 'HEAD'], { timeoutMs: 10000 }).then(function (r) { return (r.exitCode === 0 ? r.stdout.trim() : ''); }).catch(function () { return ''; })];
                case 52:
                    _p = _35.sent();
                    return [3 /*break*/, 54];
                case 53:
                    _p = '';
                    _35.label = 54;
                case 54:
                    pushFrom = _p;
                    if (!/^\s*git\s+-C\s/.test(chatCommand)) return [3 /*break*/, 56];
                    _r = [[cwd]];
                    return [4 /*yield*/, readIndex($).catch(function () { return []; })];
                case 55:
                    _q = __spreadArray.apply(void 0, _r.concat([(_35.sent()).map(function (s) { return s.repo; }).filter(function (repo) { return repo.startsWith('/'); }), true]));
                    return [3 /*break*/, 57];
                case 56:
                    _q = [];
                    _35.label = 57;
                case 57:
                    places = _q;
                    _s = Boolean(chatCommand) && isChatRunnable(chatCommand, pushFrom, places);
                    if (!_s) return [3 /*break*/, 59];
                    return [4 /*yield*/, scriptsRun($, chatCommand)];
                case 58:
                    _s = !(_35.sent()).some(function (text) { return RUNNER_NAMED.test(text); });
                    _35.label = 59;
                case 59:
                    isChatCommand = _s;
                    isRefusedHere = isChatHere && !isChatCommand && !OWN.includes(e.tool) && !OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }) && !READS.includes(e.tool) && !isPaneShow(e);
                    if (!(dir && !isOff && e.agentId !== undefined && isLongHeld(e))) return [3 /*break*/, 61];
                    return [4 /*yield*/, log($, "refused work ".concat(e.agentId, "'s long command held open: ").concat(oneLine(String((_13 = e.description) !== null && _13 !== void 0 ? _13 : '')).slice(0, 80)))];
                case 60:
                    _35.sent();
                    return [2 /*return*/, { deny: SEND_BACKGROUND(who()) }];
                case 61:
                    if (!(isChatCommand && !e.run_in_background)) return [3 /*break*/, 63];
                    return [4 /*yield*/, log($, "refused the chat's own command held open")];
                case 62:
                    _35.sent();
                    return [2 /*return*/, { deny: CHAT_SEND_BACKGROUND }];
                case 63:
                    if (!(e.tool === 'Bash' && !isRefusedHere)) return [3 /*break*/, 70];
                    return [4 /*yield*/, gateAdmin($, e, raw)];
                case 64:
                    gated = _35.sent();
                    if (gated.deny)
                        return [2 /*return*/, { deny: gated.deny }];
                    grants = gated.grants;
                    return [4 /*yield*/, gateRelease($, e, raw)];
                case 65:
                    released = _35.sent();
                    if (!released.deny) return [3 /*break*/, 67];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 66:
                    _35.sent();
                    return [2 /*return*/, { deny: released.deny }];
                case 67:
                    grants = __spreadArray(__spreadArray([], grants, true), released.grants, true);
                    _t = [[String((_14 = e.command) !== null && _14 !== void 0 ? _14 : '')]];
                    return [4 /*yield*/, scriptsRun($, String((_15 = e.command) !== null && _15 !== void 0 ? _15 : ''))];
                case 68:
                    if (!__spreadArray.apply(void 0, _t.concat([(_35.sent()), true])).some(function (text) { return /\bbin\/(?:admin|secret)\b/.test(text); })) return [3 /*break*/, 70];
                    _u = runnerBegun;
                    _v = [e.tool_use_id, String((_16 = e.command) !== null && _16 !== void 0 ? _16 : '')];
                    return [4 /*yield*/, $.clock.now()];
                case 69:
                    _u.apply(void 0, _v.concat([_35.sent(), e.agentId]));
                    _35.label = 70;
                case 70:
                    if (!!isRefusedHere) return [3 /*break*/, 73];
                    return [4 /*yield*/, gateOwnFile($, e, raw)];
                case 71:
                    fileSaid = _35.sent();
                    if (!fileSaid) return [3 /*break*/, 73];
                    return [4 /*yield*/, dropGrants($, grants)];
                case 72: return [2 /*return*/, (_35.sent(), { deny: fileSaid })];
                case 73:
                    woken = '';
                    next = function (asked) { return __awaiter(_this, void 0, void 0, function () {
                        var refused, _a, held, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(dir && !isOff && e.agentId !== undefined && asked.tool === 'Bash' && !grants.length)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, turnLeftovers($, asked)];
                                case 1:
                                    _a = _c.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = '';
                                    _c.label = 3;
                                case 3:
                                    refused = _a;
                                    if (refused)
                                        return [2 /*return*/, { deny: refused }];
                                    if (!(dir && !isOff && e.agentId !== undefined && asked.tool === 'Bash' && !grants.length)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, turnHeavy($, asked)];
                                case 4:
                                    _b = _c.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    _b = {};
                                    _c.label = 6;
                                case 6:
                                    held = _b;
                                    if (held.deny)
                                        return [2 /*return*/, { deny: held.deny }];
                                    _c.label = 7;
                                case 7:
                                    _c.trys.push([7, , 9, 10]);
                                    return [4 /*yield*/, nextHere(asked)];
                                case 8: return [2 /*return*/, _c.sent()];
                                case 9:
                                    if (held.id)
                                        heavyOpen.delete(held.id);
                                    return [7 /*endfinally*/];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); };
                    nextHere = function (asked) { return __awaiter(_this, void 0, void 0, function () {
                        var call, r, shown, broke, _a, crossing, told;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    call = asked;
                                    return [4 /*yield*/, run(call)
                                        // Ended work a message starts again is at work from now: its card leaves Finished while it acts on the message
                                    ];
                                case 1:
                                    r = _d.sent();
                                    if (!(woken && !r.deny && !r.isError)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, wakeCard($, woken)];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3:
                                    if (!(dir && e.agentId !== undefined && !r.deny && !r.isError)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, keepBackground($, e.agentId, call, r.result).catch(function (err) { return log($, "background work not followed: ".concat(String(err))); })];
                                case 4:
                                    _d.sent();
                                    _d.label = 5;
                                case 5: return [4 /*yield*/, keysLearn($, call, r).catch(function (err) { return log($, "keys not made again: ".concat(String(err))); })];
                                case 6:
                                    _d.sent();
                                    return [4 /*yield*/, hideKept($, call, r)
                                        // What it wrote is kept as it ends, and what crossed another task's is told then
                                    ];
                                case 7:
                                    shown = _d.sent();
                                    if (!r.deny) return [3 /*break*/, 8];
                                    _a = '';
                                    return [3 /*break*/, 10];
                                case 8: return [4 /*yield*/, crossEnded($, e, crossed, r.result, Boolean(r.isError)).catch(function () { return ''; })];
                                case 9:
                                    _a = _d.sent();
                                    _d.label = 10;
                                case 10:
                                    broke = _a;
                                    crossing = r.deny ? [] : [r.isError && e.tool !== 'Bash' ? '' : ((_b = crossed.context) !== null && _b !== void 0 ? _b : ''), broke].filter(Boolean);
                                    told = crossing.length && !shown.deny ? __assign(__assign({}, shown), { context: __spreadArray(__spreadArray([], ((_c = shown.context) !== null && _c !== void 0 ? _c : []), true), crossing, true) }) : shown;
                                    return [2 /*return*/, told];
                            }
                        });
                    }); };
                    if (!(dir && !isOff && (e.tool === 'SendMessage' || e.tool === 'Agent'))) return [3 /*break*/, 76];
                    call = e;
                    resume = e.tool === 'SendMessage' ? String((_17 = call.to) !== null && _17 !== void 0 ? _17 : '') : String((_18 = call.resume) !== null && _18 !== void 0 ? _18 : '');
                    _w = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 74:
                    held_1 = _w.apply(void 0, [_35.sent(), (_19 = e.agentId) !== null && _19 !== void 0 ? _19 : '', resume, String((_20 = call.description) !== null && _20 !== void 0 ? _20 : ''), String((_21 = call.prompt) !== null && _21 !== void 0 ? _21 : '')]);
                    if (!held_1) return [3 /*break*/, 76];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " that would set going again ").concat(held_1.id, ", which the person stopped"))];
                case 75:
                    _35.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_1))) }];
                case 76:
                    steered = '';
                    from = '';
                    answered = '';
                    message = '';
                    woke = '';
                    words = '';
                    isWhole = false;
                    if (!(dir && e.tool === 'SendMessage')) return [3 /*break*/, 82];
                    to_1 = String((_22 = e.to) !== null && _22 !== void 0 ? _22 : '');
                    message = String((_23 = e.message) !== null && _23 !== void 0 ? _23 : '');
                    theirs = e.agentId === undefined ? heard.findLast(function (one) { return carries(message, one); }) : undefined;
                    words = theirs ? quoted(theirs, 600) : '';
                    // Their words and nothing more: else only the words quoted are told as theirs, and the rest as the chat's
                    isWhole = Boolean(theirs) && isTheirsWhole(message, theirs !== null && theirs !== void 0 ? theirs : '');
                    return [4 /*yield*/, $.clock.now()];
                case 77:
                    now_1 = _35.sent();
                    return [4 /*yield*/, read($, todos)];
                case 78:
                    list = _35.sent();
                    target_1 = to_1 ? ((_24 = list.find(function (one) { return one.id === to_1; })) !== null && _24 !== void 0 ? _24 : list.find(function (one) { return to_1.startsWith(one.id); })) : undefined;
                    given = target_1 && e.agentId === undefined ? sentReplies.get(target_1.id) : undefined;
                    isRepeat = Boolean((given === null || given === void 0 ? void 0 : given.isCard) && (given.to === 'work' || given.to === 'read') && now_1 - given.at < ANSWER_ECHO && plainWords(message) === plainWords(given.text));
                    if (!(given && target_1 && isRepeat && !(target_1.ask && target_1.ask.at > given.at))) return [3 /*break*/, 80];
                    return [4 /*yield*/, log($, "refused a second copy of an answer to ".concat(target_1.id))];
                case 79:
                    _35.sent();
                    return [2 /*return*/, { deny: named(ANSWER_ALREADY_SENT(cut(given.text, 120))) }];
                case 80:
                    asking = target_1 && words && e.agentId === undefined ? ((_25 = list.find(function (one) { return one.id === target_1.id && one.ask; })) !== null && _25 !== void 0 ? _25 : list.find(function (one) { var _a; return ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.from) === target_1.id; })) : undefined;
                    asked_1 = (asking === null || asking === void 0 ? void 0 : asking.ask) ? "".concat(asking.id, ":").concat(asking.ask.at, ":").concat(asking.ask.text) : '';
                    if ((asking === null || asking === void 0 ? void 0 : asking.ask) && !answeredAsks.has(asked_1)) {
                        answeredAsks.add(asked_1);
                        answered = asking.ask.text;
                        answer = { card: asking, ask: asking.ask, key: asked_1, words: words, at: now_1 };
                    }
                    if (!target_1) return [3 /*break*/, 82];
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
                                    : __assign(__assign({}, one), { owes: isSteer_1 ? 0 : one.owes, entries: words && ((_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== words ? __spreadArray(__spreadArray([], one.entries, true), [__assign({ at: now_1, kind: 'steer', text: words }, (isSteer_1 || woke ? { isUnread: true } : {}))], false).slice(-ENTRIES_KEPT) : one.entries });
                            });
                        })];
                case 81:
                    _35.sent();
                    if (isSteer_1 || from || answered || woke)
                        steered = target_1.id;
                    _35.label = 82;
                case 82:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 85];
                    id_1 = e.agentId;
                    // What this work starts with the Agent tool is its helper, which the engine's own record does not always say
                    if (e.tool === 'Agent')
                        helperCalls.set(e.tool_use_id, id_1);
                    stoppedHere.delete(id_1);
                    if (!dir) return [3 /*break*/, 85];
                    return [4 /*yield*/, $.clock.now()];
                case 83:
                    now_2 = _35.sent();
                    isKeeping_1 = isTool(e.tool, 'todo') || isTool(e.tool, 'note');
                    nudge_1 = '';
                    return [4 /*yield*/, changeTodos($, function (list) {
                            // What a helper writes is what its task made too: the task it belongs to keeps it as well as the helper's own card
                            var top = topOf(list, id_1);
                            return list.map(function (one) {
                                var _a, _b, _c, _d, _e;
                                if (one.id !== id_1)
                                    return one.id === top ? withWrote(one, e) : one;
                                // (a call beside its hand-in, in the turn that handed its result in, leaves its card as it ended)
                                if (one.status !== 'working' && handedBack.has(id_1))
                                    return one;
                                var own = __assign(__assign({}, (one.status === 'working' ? one : resumed(one, now_2))), { steps: ((_a = one.steps) !== null && _a !== void 0 ? _a : 0) + 1, reportAt: undefined });
                                var base = withWrote(own, e);
                                if (isKeeping_1)
                                    return __assign(__assign({}, base), { quiet: 0, owes: isTool(e.tool, 'note') ? undefined : one.owes });
                                var owes = one.owes === undefined ? undefined : one.owes + 1;
                                var quiet = ((_b = one.quiet) !== null && _b !== void 0 ? _b : 0) + 1;
                                var isQuiet = !one.parentId && owes === undefined && quiet >= QUIET_STEPS;
                                // (its own line, gone stale by the clock, however it keeps its to-dos)
                                var note = ownNote(one);
                                var since = now_2 - ((_c = note === null || note === void 0 ? void 0 : note.at) !== null && _c !== void 0 ? _c : one.startedAt);
                                var isStale = !one.parentId && owes === undefined && since >= NOTE_STALE && now_2 - ((_d = noteAsked.get(id_1)) !== null && _d !== void 0 ? _d : -Infinity) >= NOTE_STALE;
                                nudge_1 = owes === OWED_AFTER ? named(OWED) : isQuiet ? drifted(quiet) : isStale ? named(unnoted(Math.floor(since / 60000), (_e = note === null || note === void 0 ? void 0 : note.text) !== null && _e !== void 0 ? _e : '')) : '';
                                if (isQuiet || isStale)
                                    noteAsked.set(id_1, now_2);
                                return __assign(__assign({}, base), { owes: owes, quiet: isQuiet ? 0 : quiet });
                            });
                        })];
                case 84:
                    _35.sent();
                    if (nudge_1)
                        void tell($, id_1, nudge_1);
                    _35.label = 85;
                case 85:
                    if (!steered) return [3 /*break*/, 89];
                    return [4 /*yield*/, next(e)];
                case 86:
                    sent = _35.sent();
                    if (!answer) return [3 /*break*/, 88];
                    return [4 /*yield*/, answeredInChat($, answer, steered, !sent.deny && !sent.isError)
                        // Work that had ended is started again by the message, and may not be running yet to take a row: it gets the line as a
                        // message of its own instead, read once it reaches it
                        // Each line names the message it is about: a message queued behind another is read later than its line, and a line about the
                        // chat's own note that landed after the person's words once marked their words as not theirs
                    ];
                case 87:
                    _35.sent();
                    _35.label = 88;
                case 88:
                    line = named(answered ? ANSWERED_IN_CHAT(answered, words, Boolean(answer && !settles(answer.ask, words, true)), isWhole) : woke ? WOKE(woke, isWhole) : from ? FROM(from, cut(oneLine(message), 80)) : STEER(words, isWhole));
                    if (!sent.deny)
                        void tell($, steered, line);
                    return [2 /*return*/, sent];
                case 89:
                    if (!(e.agentId !== undefined && String(e.tool) === 'SubagentHandback')) return [3 /*break*/, 112];
                    agent_1 = e.agentId;
                    _x = handbackRefused;
                    return [4 /*yield*/, read($, todos)];
                case 90:
                    refused = _x.apply(void 0, [_35.sent(), agent_1]);
                    if (!refused) return [3 /*break*/, 92];
                    return [4 /*yield*/, log($, "work ".concat(agent_1, "'s hand-back refused: ").concat(refused.slice(0, 60)))];
                case 91: return [2 /*return*/, (_35.sent(), { deny: refused })];
                case 92:
                    report_1 = String((_26 = e.message) !== null && _26 !== void 0 ? _26 : '').trim();
                    return [4 /*yield*/, read($, todos)];
                case 93:
                    taken_1 = (_35.sent()).find(function (one) { return one.id === agent_1; });
                    if (!(dir && !isOff && taken_1 && !taken_1.parentId && !flowAgents.has(agent_1))) return [3 /*break*/, 99];
                    handedBack.set(agent_1, report_1);
                    return [4 /*yield*/, $.clock.now()
                        // (one a safety check ended hands in only word of that: it failed, and says so)
                    ];
                case 94:
                    now_3 = _35.sent();
                    // (one a safety check ended hands in only word of that: it failed, and says so)
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id !== agent_1 ? one : __assign(__assign({}, (one.flagged ? __assign(__assign({}, ended(one, 'failed', now_3)), { why: WHY_FLAGGED }) : __assign(__assign({}, ended(one, 'done', now_3)), { reportAt: now_3 }))), { answer: report_1.slice(0, ANSWER_CHARS) || one.answer, reportForChat: report_1, reportGiven: undefined, tookReport: String(e.tool_use_id) })); }); })];
                case 95:
                    // (one a safety check ended hands in only word of that: it failed, and says so)
                    _35.sent();
                    return [4 /*yield*/, read($, todos)];
                case 96:
                    card_1 = (_35.sent()).find(function (one) { return one.id === agent_1; });
                    if ((card_1 === null || card_1 === void 0 ? void 0 : card_1.status) === 'done' && report_1)
                        $.clock.after(5, function () { return void saveReport($, card_1, report_1).catch(function (err) { return log($, "report of ".concat(agent_1, " not kept: ").concat(String(err))); }); });
                    return [4 /*yield*/, lookEnds($)];
                case 97:
                    _35.sent();
                    return [4 /*yield*/, log($, "report of ".concat(agent_1, " taken at its hand-back, for the chat to give with the notice of its end"))];
                case 98:
                    _35.sent();
                    return [2 /*return*/, { result: { success: true, message: named(REPORT_TAKEN) } }];
                case 99:
                    if (!(taken_1 === null || taken_1 === void 0 ? void 0 : taken_1.parentId)) return [3 /*break*/, 101];
                    return [4 /*yield*/, read($, todos)];
                case 100:
                    _y = (_35.sent()).find(function (one) { return one.id === taken_1.parentId; });
                    return [3 /*break*/, 102];
                case 101:
                    _y = undefined;
                    _35.label = 102;
                case 102:
                    above = _y;
                    if (!(dir && !isOff && taken_1 && above && !above.chat && !flowAgents.has(agent_1) && !flowAgents.has(above.id))) return [3 /*break*/, 110];
                    handedBack.set(agent_1, report_1);
                    return [4 /*yield*/, $.clock.now()];
                case 103:
                    now_4 = _35.sent();
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id !== agent_1 ? one : __assign(__assign(__assign({}, ended(one, one.flagged ? 'failed' : 'done', now_4)), (one.flagged ? { why: WHY_FLAGGED } : {})), { answer: report_1.slice(0, ANSWER_CHARS) || one.answer, tookReport: String(e.tool_use_id) })); }); })];
                case 104:
                    _35.sent();
                    text_1 = named(HELPER_RESULT(titleOf(taken_1), agent_1, report_1));
                    parent_1 = above.id;
                    written_1 = function (why) { return tell($, parent_1, text_1).then(function () { return log($, "result of helper ".concat(agent_1, " written to its task ").concat(parent_1, " (").concat(why, ")")); }); };
                    if (!(above.status !== 'working')) return [3 /*break*/, 106];
                    return [4 /*yield*/, written_1("its task is ".concat(above.status))];
                case 105:
                    _35.sent();
                    return [3 /*break*/, 107];
                case 106:
                    void sendOwn($, { to: { agentId: parent_1 }, text: text_1 }, undefined, true)
                        .then(function (r) { var _a; return (r.isDelivered ? log($, "result of helper ".concat(agent_1, " sent to its task ").concat(parent_1, " from a later hook")) : written_1((_a = r.reason) !== null && _a !== void 0 ? _a : 'not delivered')); })
                        .catch(function (err) { return written_1(String(err)).catch(function () { return undefined; }); });
                    _35.label = 107;
                case 107: return [4 /*yield*/, log($, "result of helper ".concat(agent_1, " taken at its hand-back, for its task ").concat(parent_1))];
                case 108:
                    _35.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 109:
                    _35.sent();
                    return [2 /*return*/, { result: { success: true, message: named(HELPER_REPORT_TAKEN) } }];
                case 110: return [4 /*yield*/, next(e)];
                case 111:
                    r = _35.sent();
                    if (!r.deny && !r.isError)
                        handedBack.set(agent_1, report_1);
                    return [2 /*return*/, r];
                case 112:
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 116];
                    return [4 /*yield*/, next(e)
                        // (the pull request, release or page a command of its put up is what it made: linksPutUp)
                    ];
                case 113:
                    r = _35.sent();
                    if (!(dir && !isOff)) return [3 /*break*/, 115];
                    return [4 /*yield*/, keepPutUp($, e.agentId, linksPutUp(e, r)).catch(function (err) { return log($, "links a command put up not kept: ".concat(String(err))); })];
                case 114:
                    _35.sent();
                    _35.label = 115;
                case 115: return [2 /*return*/, r];
                case 116:
                    _z = isOff;
                    if (_z) return [3 /*break*/, 118];
                    return [4 /*yield*/, read($, me)];
                case 117:
                    _z = !(_35.sent()).isChat;
                    _35.label = 118;
                case 118:
                    if (_z)
                        return [2 /*return*/, next(e)
                            // Work the chat starts is a fresh agent on a model it names: a copy of the chat, or an agent left to the chat's own model, is refused
                        ];
                    if (!(e.tool === 'Agent')) return [3 /*break*/, 120];
                    call = e;
                    if (!(call.subagent_type === 'fork' || !String((_27 = call.model) !== null && _27 !== void 0 ? _27 : '').trim())) return [3 /*break*/, 120];
                    return [4 /*yield*/, log($, "refused an Agent call ".concat(call.subagent_type === 'fork' ? 'that copies the chat' : 'with no model'))];
                case 119:
                    _35.sent();
                    return [2 /*return*/, { deny: NO_COPY() }];
                case 120:
                    if (!(e.tool === 'TaskStop' && dir)) return [3 /*break*/, 128];
                    return [4 /*yield*/, next(e)];
                case 121:
                    r = _35.sent();
                    stopId_1 = String((_28 = e.task_id) !== null && _28 !== void 0 ? _28 : '');
                    if (!(!r.deny && stopId_1)) return [3 /*break*/, 127];
                    stoppedHere.add(stopId_1);
                    return [4 /*yield*/, stopHelpers($, stopId_1)];
                case 122:
                    _35.sent();
                    return [4 /*yield*/, dropBackground($, [stopId_1], 'stopped')];
                case 123:
                    _35.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 124:
                    now_5 = _35.sent();
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === stopId_1 && !one.parentId && one.status === 'working' && !interrupting.has(stopId_1) ? ended(one, stoppedAs(one), now_5) : one); }); })];
                case 125:
                    _35.sent();
                    return [4 /*yield*/, lookEnds($)];
                case 126:
                    _35.sent();
                    _35.label = 127;
                case 127: return [2 /*return*/, r];
                case 128:
                    if (OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }) || isPaneShow(e))
                        return [2 /*return*/, next(e)
                            // The chat's single command always runs in the background, so no command holds the chat; Claudopus stops it at its limit
                        ];
                    if (!isChatCommand) return [3 /*break*/, 132];
                    return [4 /*yield*/, next(e)];
                case 129:
                    r = _35.sent();
                    if (!(!r.deny && !r.isError)) return [3 /*break*/, 131];
                    return [4 /*yield*/, chatCommandStarted($, e, r.result).catch(function (err) { return log($, "the chat's command not followed: ".concat(String(err))); })];
                case 130:
                    _35.sent();
                    _35.label = 131;
                case 131: return [2 /*return*/, r];
                case 132:
                    readPath = String((_30 = (_29 = e.file_path) !== null && _29 !== void 0 ? _29 : e.path) !== null && _30 !== void 0 ? _30 : '');
                    isPaste = Boolean(dir) && (readPath === "".concat(dir, "/pastes") || readPath.startsWith("".concat(dir, "/pastes/")));
                    if (READS.includes(e.tool) && !isPaste)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, log($, "refused ".concat(e.tool, " in a chat's own thread"))];
                case 133:
                    _35.sent();
                    if (!grants.length) return [3 /*break*/, 135];
                    return [4 /*yield*/, dropGrants($, grants).catch(function () { return undefined; })
                        // An open, a curl or a preview not in the shape the chat runs is told that shape, so it can be run that way or go to a task
                    ];
                case 134:
                    _35.sent();
                    _35.label = 135;
                case 135:
                    kind = e.tool === 'Bash' ? ((_32 = (_31 = shellWords(chatCommand)[0]) === null || _31 === void 0 ? void 0 : _31[0]) !== null && _32 !== void 0 ? _32 : '') : ((_34 = (_33 = /__(preview_start)$/.exec(e.tool)) === null || _33 === void 0 ? void 0 : _33[1]) !== null && _34 !== void 0 ? _34 : '');
                    shape = Object.hasOwn(CHAT_SHAPES, kind) ? CHAT_SHAPES[kind] : '';
                    return [2 /*return*/, { deny: shape ? "".concat(REFUSED, " ").concat(shape) : REFUSED }];
            }
        });
    }); });
    // How full this chat's context is, as the app counts it, each time it moves
    on('session.measure', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokens = e.context.tokens;
                    if (!(tokens !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, update($, me, function (one) { return (one.tokens === tokens && one.window ? one : __assign(__assign({}, one), { tokens: tokens, window: one.window || e.context.window })); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!heldSends.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
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
            var id, took, _a, chosen, _b, card, _c, _d, own, isOwnOlder, isMovedByApp, n, text, call, instead, moved, _e, pick, to, r, tokens, model;
            var _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        if (!(e.agentId === undefined && e.index === 0 && quietTurns.has(e.turnId))) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await({ kind: 'text', index: 0, text: NO_ANSWER })];
                    case 1: return [4 /*yield*/, _m.sent()];
                    case 2:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 3: return [4 /*yield*/, _m.sent()];
                    case 4:
                        _m.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: NO_ANSWER, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 5: return [2 /*return*/, _m.sent()];
                    case 6:
                        id = e.agentId;
                        if (id !== undefined)
                            replyRead($, id);
                        if (!(id !== undefined && dir)) return [3 /*break*/, 8];
                        return [4 /*yield*/, __await(markRead($, id).catch(function (err) { return log($, "messages not marked read: ".concat(String(err))); })
                            // A task whose report Claudopus took ends there: its step after the hand-back, and Claude Code's presses for a report that it
                            // does not see delivered, are answered with no model and draw nothing (PRESS_ANSWER). A message that starts it again is a step
                            // of its own, and its next report is taken afresh
                            )];
                    case 7:
                        _m.sent();
                        _m.label = 8;
                    case 8:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 10];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 9:
                        _a = (_f = (_m.sent()).find(function (one) { return one.id === id; })) === null || _f === void 0 ? void 0 : _f.tookReport;
                        return [3 /*break*/, 11];
                    case 10:
                        _a = undefined;
                        _m.label = 11;
                    case 11:
                        took = _a;
                        if (!(id !== undefined && took)) return [3 /*break*/, 20];
                        return [4 /*yield*/, __await(isAfterTaken($, id, took))];
                    case 12:
                        if (!_m.sent()) return [3 /*break*/, 18];
                        return [4 /*yield*/, __await({ kind: 'text', index: 0, text: PRESS_ANSWER })];
                    case 13: return [4 /*yield*/, _m.sent()];
                    case 14:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 15: return [4 /*yield*/, _m.sent()];
                    case 16:
                        _m.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: PRESS_ANSWER, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 17: return [2 /*return*/, _m.sent()];
                    case 18: return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { tookReport: undefined }) : one); }); }))];
                    case 19:
                        _m.sent();
                        _m.label = 20;
                    case 20:
                        if (!(id !== undefined && dir)) return [3 /*break*/, 22];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 21:
                        _b = (_g = (_m.sent()).find(function (one) { return one.id === id; })) === null || _g === void 0 ? void 0 : _g.chosen;
                        return [3 /*break*/, 23];
                    case 22:
                        _b = undefined;
                        _m.label = 23;
                    case 23:
                        chosen = _b;
                        if (!(id !== undefined && dir)) return [3 /*break*/, 25];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 24:
                        _c = (_m.sent()).find(function (one) { return one.id === id; });
                        return [3 /*break*/, 26];
                    case 25:
                        _c = undefined;
                        _m.label = 26;
                    case 26:
                        card = _c;
                        _d = id !== undefined && card && !isOff && card.status === 'working' && (needsPerson(card) || waiting.some(function (p) { return p.agent === id; }));
                        if (!_d) return [3 /*break*/, 28];
                        return [4 /*yield*/, __await(isPressedForReport($, id, true))];
                    case 27:
                        _d = (_m.sent());
                        _m.label = 28;
                    case 28:
                        if (!_d) return [3 /*break*/, 35];
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " pressed for its report while it waits for the person: let it end its step, saying nothing")))];
                    case 29:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'text', index: 0, text: PRESS_ANSWER })];
                    case 30: return [4 /*yield*/, _m.sent()];
                    case 31:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 32: return [4 /*yield*/, _m.sent()];
                    case 33:
                        _m.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: PRESS_ANSWER, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 34: return [2 /*return*/, _m.sent()];
                    case 35:
                        own = id !== undefined ? ((_h = startedOn.get(id)) !== null && _h !== void 0 ? _h : card === null || card === void 0 ? void 0 : card.startedOn) : undefined;
                        isOwnOlder = id !== undefined && !flaggedOnce.has(id) && !(card === null || card === void 0 ? void 0 : card.flagged) && own !== undefined && Boolean(rightModel(own)) && modelName(own) === modelName(e.model);
                        isMovedByApp = id !== undefined && !isOff && Boolean(rightModel(e.model)) && !isOwnOlder;
                        if (!(isMovedByApp && own !== undefined && id !== undefined)) return [3 /*break*/, 54];
                        n = ((_j = flaggedSteps.get(id)) !== null && _j !== void 0 ? _j : 0) + 1;
                        flaggedSteps.set(id, n);
                        flaggedOnce.add(id);
                        if (!(n === 1)) return [3 /*break*/, 37];
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was flagged and the app would send it to ").concat(modelName(e.model), ": it is ended with a report instead")))];
                    case 36:
                        _m.sent();
                        _m.label = 37;
                    case 37:
                        if (!dir) return [3 /*break*/, 40];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { flagged: modelName(e.model), moved: undefined }) : one); }); }))];
                    case 38:
                        _m.sent();
                        return [4 /*yield*/, __await(stopHelpers($, id).catch(function () { return undefined; }))];
                    case 39:
                        _m.sent();
                        _m.label = 40;
                    case 40:
                        // Its report goes back through the handback tool; where that does not end it, a plain last answer, and past a few the work is
                        // stopped as a press on Stop would
                        if (n > 3)
                            void $.tool.call({ tool: 'TaskStop', task_id: id }).catch(function () { return undefined; });
                        text = FLAGGED(e.model);
                        if (!(n === 1)) return [3 /*break*/, 48];
                        call = "toolu_flagged_".concat(id);
                        return [4 /*yield*/, __await({ kind: 'tool', index: 0, id: call, name: 'SubagentHandback' })];
                    case 41: return [4 /*yield*/, _m.sent()];
                    case 42:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'input', index: 0, json: JSON.stringify({ message: text }) })];
                    case 43: return [4 /*yield*/, _m.sent()];
                    case 44:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'tool_use', usage: null })];
                    case 45: return [4 /*yield*/, _m.sent()];
                    case 46:
                        _m.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: '', toolUses: [{ name: 'SubagentHandback', input: { message: text } }], stopReason: 'tool_use', usage: null })];
                    case 47: return [2 /*return*/, _m.sent()];
                    case 48: return [4 /*yield*/, __await({ kind: 'text', index: 0, text: text })];
                    case 49: return [4 /*yield*/, _m.sent()];
                    case 50:
                        _m.sent();
                        return [4 /*yield*/, __await({ kind: 'stop', stopReason: 'end_turn', usage: null })];
                    case 51: return [4 /*yield*/, _m.sent()];
                    case 52:
                        _m.sent();
                        return [4 /*yield*/, __await({ turnId: e.turnId, index: e.index, answer: text, toolUses: [], stopReason: 'end_turn', usage: null })];
                    case 53: return [2 /*return*/, _m.sent()];
                    case 54:
                        instead = id !== undefined && !isOff && !isMovedByApp && !chosen ? rightModel(e.model) : undefined;
                        if (!(id !== undefined && (isMovedByApp || instead) && !sentElsewhere.has("".concat(id, " ").concat(e.model)))) return [3 /*break*/, 56];
                        sentElsewhere.add("".concat(id, " ").concat(e.model));
                        return [4 /*yield*/, __await(log($, "work ".concat(id, " was sent to ").concat(modelName(e.model), " by the app: ").concat(instead ? "its steps go to ".concat(modelName(instead)) : 'its steps stay there')))];
                    case 55:
                        _m.sent();
                        _m.label = 56;
                    case 56:
                        moved = isMovedByApp ? modelName(e.model) : undefined;
                        _e = id !== undefined && dir;
                        if (!_e) return [3 /*break*/, 58];
                        return [4 /*yield*/, __await(read($, todos))];
                    case 57:
                        _e = (_m.sent()).some(function (one) { return one.id === id && one.moved !== moved; });
                        _m.label = 58;
                    case 58:
                        if (!_e) return [3 /*break*/, 60];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { moved: moved }) : one); }); })
                            // A pick the engine has since passed is its family's newest
                            )];
                    case 59:
                        _m.sent();
                        _m.label = 60;
                    case 60:
                        pick = chosen ? ((_k = rightModel(chosen)) !== null && _k !== void 0 ? _k : chosen) : undefined;
                        to = pick && !isMovedByApp && modelName(pick) !== modelName(e.model) ? pick : instead;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(next(to ? __assign(__assign({}, e), { model: to }) : e))))];
                    case 61: return [4 /*yield*/, __await.apply(void 0, [_m.sent()])];
                    case 62:
                        r = _m.sent();
                        tokens = r.usage ? r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens : 0;
                        model = (_l = r.usage) === null || _l === void 0 ? void 0 : _l.model;
                        if (model)
                            seeModel(model);
                        if (!(id !== undefined && tokens && flowAgents.has(id))) return [3 /*break*/, 64];
                        return [4 /*yield*/, __await(flowStep($, id, tokens, model).catch(function () { return undefined; }))];
                    case 63:
                        _m.sent();
                        _m.label = 64;
                    case 64:
                        if (!(id !== undefined && tokens && dir)) return [3 /*break*/, 66];
                        return [4 /*yield*/, __await(changeTodos($, function (list) { return list.map(function (one) { var _a; return (one.id === id ? __assign(__assign({}, one), { tokens: tokens, model: (_a = one.chosen) !== null && _a !== void 0 ? _a : (modelName(model !== null && model !== void 0 ? model : '') ? model : one.model) }) : one); }); }))];
                    case 65:
                        _m.sent();
                        _m.label = 66;
                    case 66: return [4 /*yield*/, __await(r)];
                    case 67: return [2 /*return*/, _m.sent()];
                }
            });
        });
    });
    // As a piece of work stops, the engine says what background work is still in flight: what its card kept that is not, has ended
    on('classic.SubagentStop', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, live, ids_1, gone, _a, why, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _e.sent();
                    live = e.background_tasks;
                    if (!(dir && Array.isArray(live))) return [3 /*break*/, 4];
                    ids_1 = new Set(live.map(function (one) { return one.id; }));
                    return [4 /*yield*/, read($, todos)];
                case 2:
                    gone = ((_d = (_c = (_e.sent()).find(function (one) { return one.id === e.agent_id; })) === null || _c === void 0 ? void 0 : _c.bg) !== null && _d !== void 0 ? _d : []).filter(function (b) { return !ids_1.has(b.id); }).map(function (b) { return b.id; });
                    if (!gone.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, dropBackground($, gone).catch(function (err) { return log($, "ended background work not let go: ".concat(String(err))); })];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    _a = dir && !isOff && !r.block;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, read($, todos)];
                case 5:
                    _a = (_e.sent()).some(function (one) { return one.id === e.agent_id && !one.parentId && !one.chat; });
                    _e.label = 6;
                case 6:
                    if (!_a) return [3 /*break*/, 8];
                    return [4 /*yield*/, startTidy($).catch(function (err) { return log($, "leftovers not tidied: ".concat(String(err))); })
                        // One rule against stopping early: a task with to-dos open, nothing of its own running and nothing waiting for the person may
                        // not stop here (stopRefused). Claude Code's own word that this stop follows a refused one keeps it from being asked twice
                    ];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    // One rule against stopping early: a task with to-dos open, nothing of its own running and nothing waiting for the person may
                    // not stop here (stopRefused). Claude Code's own word that this stop follows a refused one keeps it from being asked twice
                    if (!dir || r.block || e.stop_hook_active)
                        return [2 /*return*/, r];
                    _b = stopRefused;
                    return [4 /*yield*/, read($, todos)];
                case 9:
                    why = _b.apply(void 0, [_e.sent(), e.agent_id]);
                    if (!why) return [3 /*break*/, 11];
                    return [4 /*yield*/, log($, "work ".concat(e.agent_id, " may not stop: to-dos are open and nothing of its own runs"))];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [2 /*return*/, why ? __assign(__assign({}, r), { block: why }) : r];
            }
        });
    }); });
    on('agent.spawn', function ($, asked, next) { return __awaiter(_this, void 0, void 0, function () {
        var held_2, _a, kinded, start, e, r_1, parentId, isOwn, isTold, _b, rules, _c, scratch, _d, _e, _f, isBackground, r, id, now, named1, _g, goesOn, from;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    agentStarted($, asked.tool_use_id);
                    if (!(dir && !isOff && !asked.workflow)) return [3 /*break*/, 3];
                    _a = heldFor;
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    held_2 = _a.apply(void 0, [_x.sent(), (_j = (_h = asked.parentAgentId) !== null && _h !== void 0 ? _h : helperCalls.get(asked.tool_use_id)) !== null && _j !== void 0 ? _j : '', (_l = (_k = asked.resume) === null || _k === void 0 ? void 0 : _k.agentId) !== null && _l !== void 0 ? _l : '', (_m = asked.description) !== null && _m !== void 0 ? _m : '', asked.resume ? '' : ((_o = asked.prompt) !== null && _o !== void 0 ? _o : '')]);
                    if (!held_2) return [3 /*break*/, 3];
                    return [4 /*yield*/, log($, "refused to start again ".concat(held_2.id, ", which the person stopped"))];
                case 2:
                    _x.sent();
                    return [2 /*return*/, { deny: named(STOPPED_REFUSED(titleOf(held_2))) }];
                case 3:
                    kinded = isOff ? {} : kindStart(asked);
                    if (!(kinded.subagentType || kinded.model)) return [3 /*break*/, 5];
                    return [4 /*yield*/, log($, "an agent of kind ".concat(asked.subagentType, " starts").concat(kinded.subagentType ? " as ".concat(kinded.subagentType) : '').concat(kinded.model ? " on ".concat(modelName(kinded.model) || kinded.model) : ''))];
                case 4:
                    _x.sent();
                    _x.label = 5;
                case 5:
                    start = isOff || asked.resume ? undefined : startModel(__assign(__assign({}, asked), kinded));
                    if (!(start === null || start === void 0 ? void 0 : start.deny)) return [3 /*break*/, 7];
                    return [4 /*yield*/, log($, "refused a copy of an agent on ".concat(modelName(String((_p = asked.parentModel) !== null && _p !== void 0 ? _p : ''))))];
                case 6:
                    _x.sent();
                    return [2 /*return*/, { deny: start.deny }];
                case 7:
                    if (!(start === null || start === void 0 ? void 0 : start.model)) return [3 /*break*/, 9];
                    return [4 /*yield*/, log($, "".concat(asked.workflow ? 'a workflow agent' : 'an agent', " asked to run on ").concat(modelName((_q = asked.model) !== null && _q !== void 0 ? _q : '') || "its parent's ".concat(modelName(String((_r = asked.parentModel) !== null && _r !== void 0 ? _r : '')) || 'model'), " starts on ").concat(modelName(start.model)))];
                case 8:
                    _x.sent();
                    _x.label = 9;
                case 9:
                    e = __assign(__assign(__assign({}, asked), kinded), ((start === null || start === void 0 ? void 0 : start.model) ? { model: start.model } : {}));
                    if (!e.workflow) return [3 /*break*/, 13];
                    return [4 /*yield*/, next(e)];
                case 10:
                    r_1 = _x.sent();
                    if (r_1.model)
                        seeModel(r_1.model);
                    if (r_1.agentId && r_1.model && !e.resume)
                        startedOn.set(r_1.agentId, r_1.model);
                    if (!(r_1.agentId && dir)) return [3 /*break*/, 12];
                    return [4 /*yield*/, flowSpawned($, e.workflow.runId, r_1.agentId, modelName((_s = r_1.model) !== null && _s !== void 0 ? _s : '') ? r_1.model : e.model || r_1.model || '', (_t = e.description) !== null && _t !== void 0 ? _t : '').catch(function (err) { return log($, "workflow agent not kept: ".concat(String(err))); })];
                case 11:
                    _x.sent();
                    _x.label = 12;
                case 12: return [2 /*return*/, r_1];
                case 13:
                    parentId = (_v = (_u = e.parentAgentId) !== null && _u !== void 0 ? _u : helperCalls.get(e.tool_use_id)) !== null && _v !== void 0 ? _v : '';
                    isOwn = !parentId;
                    _b = isOwn && Boolean(dir) && !isOff && !e.resume && !e.workflow;
                    if (!_b) return [3 /*break*/, 15];
                    return [4 /*yield*/, read($, me)];
                case 14:
                    _b = (_x.sent()).isChat;
                    _x.label = 15;
                case 15:
                    isTold = _b;
                    if (!isTold) return [3 /*break*/, 17];
                    return [4 /*yield*/, workRules($)];
                case 16:
                    _c = _x.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _c = '';
                    _x.label = 18;
                case 18:
                    rules = _c;
                    if (!isTold) return [3 /*break*/, 21];
                    _e = scratchName;
                    return [4 /*yield*/, read($, todos)];
                case 19:
                    _f = [_x.sent(), (_w = e.description) !== null && _w !== void 0 ? _w : ''];
                    return [4 /*yield*/, $.clock.now()];
                case 20:
                    _d = _e.apply(void 0, _f.concat([_x.sent()]));
                    return [3 /*break*/, 22];
                case 21:
                    _d = '';
                    _x.label = 22;
                case 22:
                    scratch = _d;
                    isBackground = isHelperSpawn(e);
                    return [4 /*yield*/, next(isTold ? __assign(__assign({}, e), { prompt: "".concat(e.prompt, "\n\n").concat(rules, "\n").concat(SCRATCH_LINE(scratch)) }) : isBackground ? __assign(__assign({}, e), { background: true }) : e)];
                case 23:
                    r = _x.sent();
                    if (!(isBackground && r.agentId)) return [3 /*break*/, 25];
                    return [4 /*yield*/, log($, "helper ".concat(r.agentId, " of ").concat(e.parentAgentId, " runs in the background"))];
                case 24:
                    _x.sent();
                    _x.label = 25;
                case 25:
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
                    return [4 /*yield*/, $.clock.now()
                        // A brief that names one result, on what that result's title is about, goes on with its work: a round of it. One that names
                        // several, or one on something else, only reads them
                    ];
                case 26:
                    now = _x.sent();
                    if (!(isOwn && !fromReport && !e.resume)) return [3 /*break*/, 28];
                    return [4 /*yield*/, read($, reports)];
                case 27:
                    _g = (_x.sent()).filter(function (one) { return e.prompt.includes("reports/".concat(one.id, "/")) || e.prompt.endsWith("reports/".concat(one.id)); });
                    return [3 /*break*/, 29];
                case 28:
                    _g = [];
                    _x.label = 29;
                case 29:
                    named1 = _g;
                    goesOn = named1.length === 1 && named1[0] && __spreadArray([], aboutWords(named1[0].title), true).some(function (word) { var _a; return aboutWords((_a = e.description) !== null && _a !== void 0 ? _a : '').has(word); }) ? named1[0].id : '';
                    from = fromReport || goesOn;
                    return [4 /*yield*/, changeTodos($, function (list) {
                            var _a, _b, _c, _d;
                            var old = list.find(function (one) { return one.id === id; });
                            // Its title is the few words the task was given; under it, the person's message as they wrote it
                            var fresh = __assign(__assign(__assign({}, started(id, parentId, (_a = e.description) !== null && _a !== void 0 ? _a : '', isOwn ? said : '', now, e.fork)), (isOwn && from ? { from: from } : {})), { kind: e.fork ? 'fork' : ((_b = e.subagentType) !== null && _b !== void 0 ? _b : '') });
                            return capped(__spreadArray(__spreadArray([], list.filter(function (one) { return one.id !== id; }), true), [__assign(__assign(__assign({}, (old ? resumed(old, now) : fresh)), { model: (_c = old === null || old === void 0 ? void 0 : old.chosen) !== null && _c !== void 0 ? _c : r.model, startedOn: (_d = old === null || old === void 0 ? void 0 : old.startedOn) !== null && _d !== void 0 ? _d : (e.resume ? undefined : r.model) }), ((old === null || old === void 0 ? void 0 : old.scratch) || scratch ? { scratch: (old === null || old === void 0 ? void 0 : old.scratch) || scratch } : {}))], false));
                        })];
                case 30:
                    _x.sent();
                    if (!isOwn) return [3 /*break*/, 32];
                    return [4 /*yield*/, openList($)];
                case 31:
                    _x.sent();
                    _x.label = 32;
                case 32: return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 33:
                    _x.sent();
                    return [2 /*return*/, r];
            }
        });
    }); });
};
