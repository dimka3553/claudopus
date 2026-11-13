// The asking card: an ask's text to copy, its buttons and reply box, and the answer reaching the work
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
// An ask's text put on the clipboard; its button says so for two seconds, and a later copy starts its own two seconds
var copiedKey = '';
var copies = 0;
var copyAsk = function ($, id, text, surface) {
    return void $.ui
        .copy({ text: text, surface: surface })
        .then(function (r) {
        presses += 1;
        var made = (copies += 1);
        copiedKey = r.isCopied ? id : '';
        if (!r.isCopied)
            void log($, "copy not made: ".concat(r.reason));
        redraw($);
        $.clock.after(2000, function () { return void (copies === made && ((copiedKey = ''), redraw($))); });
    })
        .catch(function (err) { return log($, "copy not made: ".concat(String(err))); });
};
// A command to type opens in Terminal only when the person presses its button, typed at the prompt in the folder it is for and never
// run: Return runs it. The app opens its own terminal tabs only for Claude, never for a plugin's own code, so it is the Mac's Terminal.
// A small zsh start folder of its own reads the person's own start files, then types the command with `print -z`; folders an hour
// old are cleared as the next one is made. A chat drawn on another Mac, or work on another Mac, has no button: this Mac is not theirs
var openedKey = '';
var opens = 0;
var zshQuoted = function (text) { return "'".concat(text.replaceAll("'", "'\\''"), "'"); };
var canOpenTerminal = function (one) { var _a, _b; return Boolean(((_a = one.ask) === null || _a === void 0 ? void 0 : _a.isCommand) && one.ask.copy) && !((_b = one.chat) === null || _b === void 0 ? void 0 : _b.host) && !isRunFromAfar; };
var terminalFiles = function (folder, home) { return ({
    // Their own .zshenv runs first; one that moves ZDOTDIR to their own folder is followed there afterwards, not before ours runs
    '.zshenv': [
        '[[ -f "${_CLAUDOPUS_DOT:-$HOME}/.zshenv" ]] && source "${_CLAUDOPUS_DOT:-$HOME}/.zshenv"',
        "if [[ \"$ZDOTDIR\" != ".concat(zshQuoted(home), " ]]; then _CLAUDOPUS_DOT=\"$ZDOTDIR\"; ZDOTDIR=").concat(zshQuoted(home), "; fi"),
        '',
    ].join('\n'),
    // Then their own .zshrc, from their own folder, with the history file theirs again (the Mac's /etc/zshrc set it from ours)
    '.zshrc': [
        "_claudopus_here=".concat(zshQuoted(home)),
        'if [[ -n "$_CLAUDOPUS_DOT" ]]; then ZDOTDIR="$_CLAUDOPUS_DOT"; else unset ZDOTDIR; fi',
        'unset _CLAUDOPUS_DOT',
        '[[ "$HISTFILE" == "$_claudopus_here"/* ]] && HISTFILE="${ZDOTDIR:-$HOME}/.zsh_history"',
        '[[ -f "${ZDOTDIR:-$HOME}/.zshrc" ]] && source "${ZDOTDIR:-$HOME}/.zshrc"',
        "if cd ".concat(zshQuoted(folder), " 2>/dev/null; then"),
        "  print -P '%F{3}Claudopus typed the command below. Press Return to run it.%f'",
        'else',
        "  print -r -- $'\\e[33mClaudopus typed the command below, but its folder was not found:\\e[0m '".concat(zshQuoted(folder)),
        'fi',
        'print -rz -- "$(<"$_claudopus_here/command.txt")"',
        'unset _claudopus_here',
        '',
    ].join('\n'),
    // Terminal's own saved sessions are left out of this one window, so its history stays the person's own file
    'open.command': ['#!/bin/zsh', "cd ".concat(zshQuoted(folder), " 2>/dev/null"), 'export _CLAUDOPUS_DOT="${ZDOTDIR-}" SHELL_SESSIONS_DISABLE=1', "ZDOTDIR=".concat(zshQuoted(home), " exec /bin/zsh -i"), ''].join('\n'),
}); };
var openTerminal = function ($, one) { return __awaiter(_this, void 0, void 0, function () {
    var ask, at, made, base, home, _i, _a, _b, name_1, text, ready, r, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                ask = one.ask;
                if (!(ask === null || ask === void 0 ? void 0 : ask.copy) || !canOpenTerminal(one))
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _d.sent();
                made = (opens += 1);
                base = "".concat(dir, "/terminal");
                home = "".concat(base, "/").concat(slug(one.id) || 'work', "-").concat(at);
                return [4 /*yield*/, $.fs.write("".concat(home, "/command.txt"), ask.copy)];
            case 2:
                _d.sent();
                _i = 0, _a = Object.entries(terminalFiles(ask.cwd || cwd, home));
                _d.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                _b = _a[_i], name_1 = _b[0], text = _b[1];
                return [4 /*yield*/, $.fs.write("".concat(home, "/").concat(name_1), text)];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, $.process.run(['sh', '-c', 'find "$1" -mindepth 1 -maxdepth 1 -mmin +60 -exec rm -rf {} +; chmod 755 "$2"', 'sh', base, "".concat(home, "/open.command")]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 7:
                ready = _d.sent();
                if (!(ready.exitCode === 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['open', "".concat(home, "/open.command")]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 8:
                _c = _d.sent();
                return [3 /*break*/, 10];
            case 9:
                _c = ready;
                _d.label = 10;
            case 10:
                r = _c;
                presses += 1;
                openedKey = r.exitCode === 0 ? "".concat(one.id, ":").concat(ask.at, ":").concat(ask.copy) : '';
                if (r.exitCode !== 0)
                    void log($, "terminal not opened: ".concat(r.stderr.trim().slice(0, 160)));
                redraw($);
                $.clock.after(3000, function () { return void (opens === made && ((openedKey = ''), redraw($))); });
                return [2 /*return*/];
        }
    });
}); };
// The person's answer to an ask, a button pressed or a reply in their own words: to work under way, a message it reads at its next
// step; to work that has ended, a message to the chat, which carries the work on. Either way the ask goes at once, and the card
// says briefly what was answered; the work turns amber again only by asking again
var replies = new Map();
// What the person has typed into a reply box and not sent, by the work, so a redraw keeps it
var drafts = new Map();
// While the person types into a reply box the list's running times stand still: the list is drawn again each second, and a box in
// a list drawn that often lost its place and threw the panel to the bottom. Each letter typed, or the box taking the focus, holds
// the times for TYPING more; sending lets them go
var TYPING = 30000;
var typing = 0;
var isTyping = false;
var holdTimes = function ($) {
    var made = (typing += 1);
    isTyping = true;
    $.clock.after(TYPING, function () { return void (typing === made && (isTyping = false)); });
};
var freeTimes = function () { return void ((typing += 1), (isTyping = false)); };
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
var lineOf = function (one) { var last = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; }); return last ? "".concat(last.at, ":").concat(last.text) : ''; };
// How long the card says what was answered, unless the work writes a newer line first
var ANSWER_SHOWN = 60000;
// The answers every ask offers when the work gave none of its own
var DEFAULT_ANSWERS = ['Done', 'Not now'];
var sentReplies = new Map();
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
var pending = new Map();
// The asks of this chat's work already answered, by work and when it asked
var answeredAsks = new Set();
var answerAsk = function ($_1, one_1, choice_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, one_1, choice_1], args_1, true), void 0, function ($, one, choice, isReply) {
        var ask, said, target, asked, at, isCleared, line, working, to, told, _a;
        var _b, _c, _d;
        if (isReply === void 0) { isReply = false; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (one.chat)
                        return [2 /*return*/, answerElsewhere($, one, choice, isReply)];
                    ask = one.ask;
                    said = choice.trim();
                    if (!ask || !said)
                        return [2 /*return*/];
                    target = (_b = ask.from) !== null && _b !== void 0 ? _b : one.id;
                    asked = "".concat(one.id, ":").concat(ask.at, ":").concat(ask.text);
                    if (answeredAsks.has(asked))
                        return [2 /*return*/];
                    answeredAsks.add(asked);
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    at = _e.sent();
                    isCleared = false;
                    return [4 /*yield*/, update($, todos, function (list) {
                            return list.map(function (card) { var _a; return (card.id === one.id && ((_a = card.ask) === null || _a === void 0 ? void 0 : _a.at) === ask.at && card.ask.text === ask.text ? ((isCleared = true), __assign(__assign({}, card), { ask: undefined, entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'steer', text: isReply ? said : "".concat(said, " \u2014 to: ").concat(ask.text) }], false).slice(-ENTRIES_KEPT) })) : card); });
                        })];
                case 2:
                    _e.sent();
                    if (!isCleared)
                        return [2 /*return*/];
                    drafts.delete(one.id);
                    replies.set(one.id, ((_c = replies.get(one.id)) !== null && _c !== void 0 ? _c : 0) + 1);
                    if (isReply)
                        freeTimes();
                    line = lineOf(one);
                    sentReplies.set(one.id, { text: said, ask: ask.text, to: one.status === 'working' ? 'work' : 'chat', at: at, line: line });
                    redraw($);
                    return [4 /*yield*/, read($, todos)];
                case 3:
                    working = ((_d = (_e.sent()).find(function (card) { return card.id === one.id; })) === null || _d === void 0 ? void 0 : _d.status) === 'working';
                    to = isReply ? "".concat(who(true), " replied to your ask (\"").concat(ask.text, "\"), in their own words: ").concat(said) : "".concat(who(true), " pressed \"").concat(said, "\" in answer to your ask: ").concat(ask.text);
                    if (!working) return [3 /*break*/, 5];
                    return [4 /*yield*/, tell($, target, to)];
                case 4:
                    _a = _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = undefined;
                    _e.label = 6;
                case 6:
                    told = _a;
                    if (told && !told.deny)
                        return [2 /*return*/, void (pending.set(target, one.id), sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at: at, line: line }), redraw($))];
                    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'chat', at: at, line: line });
                    redraw($);
                    return [4 /*yield*/, sendForPerson($, isReply ? "From the Claudopus panel: ".concat(who(true), " replied to what the work \"").concat(titleOf(one), "\" asked before it ended (").concat(ask.text, "):\n").concat(said) : "From the Claudopus panel: ".concat(who(true), " pressed \"").concat(said, "\" in answer to what the work \"").concat(titleOf(one), "\" asked before it ended: ").concat(ask.text))];
                case 7:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
var replyAfter = function ($, one, said, asked) { return __awaiter(_this, void 0, void 0, function () {
    var told, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(one.status === 'working')) return [3 /*break*/, 2];
                return [4 /*yield*/, tell($, one.id, "".concat(who(true), " added, in their own words, to their answer to your ask (\"").concat(asked, "\"): ").concat(said))];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = undefined;
                _b.label = 3;
            case 3:
                told = _a;
                if (told && !told.deny)
                    return [2 /*return*/];
                return [4 /*yield*/, sendForPerson($, "From the Claudopus panel: ".concat(who(true), " added, in their own words, to their answer to what the work \"").concat(titleOf(one), "\" asked (").concat(asked, "):\n").concat(said))];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// The work an answer was written into starts its next step: that step reads it
var replyRead = function ($, agentId) {
    var card = pending.get(agentId);
    if (card === undefined)
        return;
    pending.delete(agentId);
    var sent = sentReplies.get(card);
    if ((sent === null || sent === void 0 ? void 0 : sent.to) === 'work')
        (sentReplies.set(card, __assign(__assign({}, sent), { to: 'read' })), redraw($));
};
// Work whose run ended with an answer written in but never read leaves it to the chat, which carries the work on
var replyUnread = function ($, agentId) { return __awaiter(_this, void 0, void 0, function () {
    var card, sent, one;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                card = pending.get(agentId);
                if (card === undefined)
                    return [2 /*return*/];
                pending.delete(agentId);
                sent = sentReplies.get(card);
                return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_a.sent()).find(function (todo) { return todo.id === card; });
                if ((sent === null || sent === void 0 ? void 0 : sent.to) !== 'work' || !one)
                    return [2 /*return*/];
                sentReplies.set(card, __assign(__assign({}, sent), { to: 'chat' }));
                redraw($);
                return [4 /*yield*/, sendForPerson($, "From the Claudopus panel: ".concat(who(true), " answered what the work \"").concat(titleOf(one), "\" asked, and it ended before reading the answer (").concat(sent.ask, "):\n").concat(sent.text))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
var sentLine = function (one, now) {
    var _a;
    var sent = sentReplies.get(one.id);
    if (!sent)
        return '';
    if (sent.to === 'lost')
        return ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.text) === sent.ask ? "Not sent: \u201C".concat(cut(sent.text, 60), "\u201D. That Mac could not be reached; answer it in its own chat") : '';
    var newer = lineOf(one) !== sent.line;
    if (one.ask || newer || now - sent.at > ANSWER_SHOWN)
        return '';
    var how = {
        work: 'it reads this at its next step',
        read: 'it has read it',
        chat: 'sent to the chat, which carries the work on',
        other: "sent to the chat \"".concat(cut(one.chat ? chatName(one.chat) : 'it runs in', 40), "\", whose work reads it at its next step"),
    }[sent.to];
    return "\u2713 You answered \u201C".concat(cut(sent.text, 60), "\u201D \u00B7 ").concat(how);
};
