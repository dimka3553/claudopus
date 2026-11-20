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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
// Linux has no Terminal app to type it into, so there the card gives the command to copy only
var canOpenTerminal = function (one) { var _a, _b; return Boolean(((_a = one.ask) === null || _a === void 0 ? void 0 : _a.isCommand) && one.ask.copy) && !((_b = one.chat) === null || _b === void 0 ? void 0 : _b.host) && !isRunFromAfar && !isLinux; };
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
// step; to work that has ended, a message that starts it again. Either way the ask goes at once, and the card
// says briefly what was answered; the work turns amber again only by asking again
var replies = new Map();
// Each ask its own mark, so its reply box is a new one, empty, when the work asks something new, and the same one while it is held
var askMark = function (ask) { return "".concat(ask.at, "-").concat(__spreadArray([], ask.text, true).reduce(function (h, c) { return (h * 31 + c.charCodeAt(0)) >>> 0; }, 7).toString(36)); };
// What the person has typed into a reply box and not sent, by the work and the ask it was typed for (draftOf), so a redraw keeps it
// and a newer ask of the same work starts with an empty box
var drafts = new Map();
var draftOf = function (id, ask) { return "".concat(id, "|").concat(askMark(ask)); };
// Whether the person has typed something not sent into a work's reply box
var hasDraft = function (id) { return __spreadArray([], drafts, true).some(function (_a) {
    var key = _a[0], value = _a[1];
    return key.startsWith("".concat(id, "|")) && Boolean(value);
}); };
// How many lines tall a box for words is drawn: always the same, and the text scrolls within once it is longer. The app draws a
// box of `rows` that tall whatever it holds and never grows one by itself, so a box that grew was a new drawing for each line,
// and each drawing of a site is a new box under the cursor: the app gives it the cursor again and its ring fades in again
// (17 Nov, the person, typing a reply of several lines: "it starts jittering and flashing blue, not blue, blue, not blue"; the bar
// also grew under the chat at each line). Four lines hold a reply of a few sentences; the bar holds them, its title, the gap,
// Send and the panel's marker within its 13 rows
var BOX_ROWS = 4;
// While the person types into a reply box or a key box the panel and every Details tab hold their drawing whole. The app builds a
// pane afresh at each drawing, the box in it too: a pane drawn every few seconds under the person's typing flickered the box's ring,
// put older letters over newer ones, and, as Markdown came or went above, threw the panel to its bottom, out of the person's reach
// (15 Nov, typing an answer while other work ran; measured on the app's own drawing, headless). Each letter typed, or the box taking
// the focus, holds it for TYPING more; sending, any press, or the focus leaving the boxes lets it go. The desktop app's reply box is
// in the bar above the prompt (repliesInBar), which is held the same way while it is typed in
var TYPING = 30000;
var typing = 0;
var isTyping = false;
// Not typing, a pane is drawn again at once for anything new in what it shows, but for its running times alone at most every CALM:
// each drawing is a new pane under the pointer, which lost its hover, and a click whose press and release fell on two drawings did
// nothing (15 Nov: Approve took several clicks)
var CALM = 10000;
// The last drawing of each pane on each surface and size: what it showed in shape (paneShape) and in full (paneContent), when, and
// which call for a drawing of the mod's own it answered (freshness)
var heldDrawings = new Map();
// Counts the mod's own calls for a drawing: a press, a reply, a picture made, a box that came. Each one is drawn at once
var freshness = 0;
var drawAgain = function ($, isThroughTyping) {
    if (isThroughTyping === void 0) { isThroughTyping = false; }
    freshness += 1;
    void drawFresh($, isThroughTyping);
};
// The text each reply box was last drawn with: while the person types it is drawn with that again, never with the letters as they
// arrive, so a drawing never puts older letters over the newer ones the box already holds
var drawnDrafts = new Map();
var draftShown = function (id, ask) { return draftDrawn(draftOf(id, ask)); };
var draftDrawn = function (key) {
    var _a, _b;
    if (isTyping && drawnDrafts.has(key))
        return (_a = drawnDrafts.get(key)) !== null && _a !== void 0 ? _a : '';
    var value = (_b = drafts.get(key)) !== null && _b !== void 0 ? _b : '';
    drawnDrafts.set(key, value);
    return value;
};
// What a pane shows, as far as it moves while the person types: work that starts, finishes, asks, waits on an admin command, is cut
// or stuck, or leaves after its pause, here or in another chat; workflows; boxes, gates and prompts that come or go; a Details
// tab's own to-dos
var paneShape = function ($, paneId) { return __awaiter(_this, void 0, void 0, function () {
    var at, card, own, chats, theirs, flowsNow, mine, _a, _b, _c, _d;
    var _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _j.sent();
                card = function (one) { var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k; return [one.id, one.status, (_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0, (_e = (_d = (_c = one.ask) === null || _c === void 0 ? void 0 : _c.replied) === null || _d === void 0 ? void 0 : _d.at) !== null && _e !== void 0 ? _e : 0, (_f = one.parentId) !== null && _f !== void 0 ? _f : '', lingers(one, at), isDoneMoment(one, at), ((_g = one.admins) !== null && _g !== void 0 ? _g : []).map(function (gate) { var _a, _b; return "".concat(gate.id, ":").concat((_b = (_a = gate.talk) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); }), (_h = one.stuckAt) !== null && _h !== void 0 ? _h : 0, (_k = (_j = one.running) === null || _j === void 0 ? void 0 : _j.at) !== null && _k !== void 0 ? _k : 0, jobsOf(one).length]; };
                return [4 /*yield*/, read($, todos)];
            case 2:
                own = _j.sent();
                return [4 /*yield*/, read($, others)];
            case 3:
                chats = _j.sent();
                theirs = [cardsOf(chats).map(card), helpersOf(chats).map(card), chats.map(function (c) { var _a, _b; return [c.host, c.chat, (_b = (_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0]; })];
                return [4 /*yield*/, read($, flows)];
            case 4:
                flowsNow = (_j.sent()).map(function (f) { return [f.id, f.status, isLingering(f, at), f.agents.length]; });
                mine = paneId === LIST ? null : (_e = own.find(function (other) { return paneId.endsWith(other.id); })) === null || _e === void 0 ? void 0 : _e.items.map(function (item) { return item.state; });
                _b = (_a = JSON).stringify;
                _c = [own.map(card), theirs, flowsNow, __spreadArray([], lastRunning.keys(), true), boxes.map(function (one) { return one.id; }), __spreadArray([], boxSaid.keys(), true), looseGates.map(function (one) { return one.id; }), mine];
                if (!(paneId === LIST)) return [3 /*break*/, 6];
                return [4 /*yield*/, updateShape($)];
            case 5:
                _d = _j.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = '';
                _j.label = 7;
            case 7: return [2 /*return*/, _b.apply(_a, [_c.concat([_d, __spreadArray([], gatePressed.keys(), true), __spreadArray([], askPressed, true), __spreadArray([], barBoxes, true), (_f = barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) !== null && _f !== void 0 ? _f : '', (_g = barOpen === null || barOpen === void 0 ? void 0 : barOpen.id) !== null && _g !== void 0 ? _g : '', (_h = barOpen === null || barOpen === void 0 ? void 0 : barOpen.mark) !== null && _h !== void 0 ? _h : '', __spreadArray([], attached, true), __spreadArray([], attachSaid, true), __spreadArray([], replies, true)])])];
        }
    });
}); };
// and in full, but for what moves on its own as work runs: its running times, its tokens, its commands and their output, which are
// drawn again at most every CALM
var calmCard = function (one) {
    var _a = one, _tokens = _a.tokens, _running = _a.running, _newAt = _a.newAt, _bg = _a.bg, _seen = _a.seenJobs, _detached = _a.detached, _looked = _a.lookedIn, rest = __rest(_a, ["tokens", "running", "newAt", "bg", "seenJobs", "detached", "lookedIn"]);
    return rest;
};
var paneContent = function ($) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
    switch (_e.label) {
        case 0:
            _b = (_a = JSON).stringify;
            return [4 /*yield*/, read($, view)];
        case 1:
            _c = [_e.sent()];
            _d = [{}];
            return [4 /*yield*/, read($, me)];
        case 2:
            _c = _c.concat([__assign.apply(void 0, [__assign.apply(void 0, _d.concat([(_e.sent())])), { tokens: 0 }])]);
            return [4 /*yield*/, read($, reports)];
        case 3:
            _c = _c.concat([(_e.sent()).length]);
            return [4 /*yield*/, read($, todos)];
        case 4:
            _c = _c.concat([(_e.sent()).map(calmCard)]);
            return [4 /*yield*/, read($, others)];
        case 5:
            _c = _c.concat([(_e.sent()).map(function (c) { var _a; return (__assign(__assign({}, c), { at: 0, cards: c.cards.map(calmCard), helpers: (_a = c.helpers) === null || _a === void 0 ? void 0 : _a.map(calmCard) })); })]);
            return [4 /*yield*/, read($, flows)];
        case 6: return [2 /*return*/, _b.apply(_a, [_c.concat([_e.sent(), boxes, __spreadArray([], boxSaid, true), looseGates])])];
    }
}); }); };
var holdTimes = function ($) {
    if (!isTyping)
        recordEvent($, 'hold');
    var made = (typing += 1);
    isTyping = true;
    $.clock.after(TYPING, function () { return void (typing === made && ((isTyping = false), drawAgain($))); });
};
var freeTimes = function ($) {
    var wasHeld = isTyping;
    if (wasHeld)
        recordEvent($, 'let-go');
    typing += 1;
    isTyping = false;
    if (wasHeld)
        drawAgain($);
};
// Every pane of the mod's is drawn again, from the values as they are now
// Not while the person types into the bar's box, or put the cursor in it, within TYPING (isBoxHeld): the app asks again for every
// drawing of the mod's at each redraw, the bar above the prompt too, and builds each one anew, the box with the cursor in it too,
// whose ring then fades in again; holding the drawing does not spare that (17 Nov: the box flashed blue several times a second
// while tasks wrote their cards, each a redraw the app answered with a box built anew; its own renderer, headless, measured).
// Asked for meanwhile, it is made once the hold ends (lookBar, each second). What must show at once goes through
// (isThroughTyping): a box whose card stopped asking, and what newly waits on the person (urgentSign)
var isRedrawOwed = false;
// Only the bar's box: a box in a pane is drawn again with its pane as before. The hold ends TYPING after the last letter or focus,
// as the app may say nothing when the cursor leaves; a letter typed after that holds it again at once
var isBoxHeld = function (at) { return (Boolean(barOpen) && barBoxAt > 0 && at - barBoxAt < TYPING) || (paneBoxAt > 0 && at - paneBoxAt < TYPING); };
var drawFresh = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, isThroughTyping) {
        var _a, _b;
        if (isThroughTyping === void 0) { isThroughTyping = false; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = !isThroughTyping;
                    if (!_a) return [3 /*break*/, 2];
                    _b = isBoxHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    _a = _b.apply(void 0, [_c.sent()]);
                    _c.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/, void ((isRedrawOwed = true), recordEvent($, 'redraw-owed'))];
                    isRedrawOwed = false;
                    recordEvent($, 'redraw-all');
                    $.ui.invalidate('ui.render');
                    return [2 /*return*/];
            }
        });
    });
};
// What newly waits on the person and is drawn from the mod's own memory: the app's prompts, gates without a card, key and admin
// boxes. A change in it is drawn within a second, through any hold
var urgentDrawn = '';
var urgentSign = function () { return JSON.stringify([waiting.map(function (one) { return [one.agent, one.tool]; }), asked.length, looseGates.map(function (one) { return one.id; }), boxes.map(function (one) { return one.id; })]); };
// What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
var drawnPanes = new Map();
// What the panel shows from the mod's own memory rather than its values: what the app's prompts, the admin and file gates, the boxes,
// pictures, the update and the presses hold. A change in it draws the panel again within a second
var sideSign = function () {
    return JSON.stringify([
        waiting.map(function (one) { var _a; return [one.agent, one.tool, (_a = one.seen) !== null && _a !== void 0 ? _a : 0]; }), asked.length,
        __spreadArray([], promptWaits.keys(), true),
        __spreadArray([], promptHeld, true),
        __spreadArray([], gateHeld, true),
        __spreadArray([], gateWaits.keys(), true),
        looseGates.map(function (one) { return one.id; }),
        __spreadArray([], undoneOffers.keys(), true),
        boxes.map(function (one) { return one.id; }), loosePressed.length,
        __spreadArray([], boxSaid, true),
        __spreadArray([], boxSent, true),
        boxPresses,
        __spreadArray([], pictureIn.keys(), true),
        isUpdating,
        updatedMoment !== null && updatedMoment !== void 0 ? updatedMoment : null,
        presses, loadMark, freshness,
    ]);
};
// While the person uses the panel (scrolls it, moves the focus in it, presses in it, or types) its running times stand still: they
// move again ENGAGED after the person's last move
var ENGAGED = 15000;
var engagedAt = 0;
// While the person uses the panel on the desktop, the drawing on screen stays, whole: cards above the pointer that grew or shrank
// as work wrote moved the button under it by up to 184 px, and at the list's end each shrink and regrowth swung the view up and
// back (16 Nov, Dima's recording replayed in the app's own pane). Their own presses and anything new that waits on them (an ask, a
// box, a gate, a prompt) are drawn at once; the rest once they have left it alone for ENGAGED
var isEngaged = function (at) { return engagedAt > 0 && at - engagedAt < ENGAGED; };
// Only while scrolled down: at the top what comes in comes below the header, as the person expects, and every behaviour that shows
// what work did (a card that finishes comes up green, one stopped leaves after its pause) shows as before
var isInUse = function (at, offset) { return isEngaged(at) && offset > 0; };
var personSign = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var chats, cards, asks, momentAt, own, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, read($, others)
                // (only the cards that ask or wait on a gate: a card that merely starts or ends waits)
            ];
            case 1:
                chats = _g.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                cards = _g.sent();
                asks = __spreadArray(__spreadArray(__spreadArray([], cards, true), cardsOf(chats), true), helpersOf(chats), true).filter(function (one) { var _a; return one.ask || ((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length); }).map(function (one) { var _a, _b, _c, _d, _e, _f; return [one.id, (_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0, (_e = (_d = (_c = one.ask) === null || _c === void 0 ? void 0 : _c.replied) === null || _d === void 0 ? void 0 : _d.at) !== null && _e !== void 0 ? _e : 0, ((_f = one.admins) !== null && _f !== void 0 ? _f : []).map(function (gate) { var _a, _b; return "".concat(gate.id, ":").concat((_b = (_a = gate.talk) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); })]; });
                return [4 /*yield*/, $.clock.now()];
            case 3:
                momentAt = _g.sent();
                own = [cards.filter(function (one) { return one.closedAt; }).map(function (one) { return one.id; }), __spreadArray([], dismissedNow.keys(), true), cards.filter(function (one) { return isDoneMoment(one, momentAt); }).map(function (one) { return one.id; })];
                _b = (_a = JSON).stringify;
                _c = [presses, asks, own, chats.map(function (c) { var _a, _b; return [c.host, c.chat, (_b = (_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0]; }), waiting.map(function (one) { return [one.agent, one.tool]; }), asked.length, __spreadArray([], promptWaits.keys(), true), __spreadArray([], promptHeld, true), __spreadArray([], gateHeld, true), __spreadArray([], gateWaits.keys(), true), __spreadArray([], gatePressed.keys(), true), looseGates.map(function (one) { return one.id; }), __spreadArray([], askPressed, true), __spreadArray([], undoneOffers.keys(), true), boxes.map(function (one) { return one.id; }), __spreadArray([], boxSaid, true), __spreadArray([], boxSent, true), boxPresses, __spreadArray([], pictureIn.keys(), true), isUpdating, loadMark];
                _d = [[]];
                return [4 /*yield*/, read($, todos)];
            case 4:
                _e = [__spreadArray.apply(void 0, _d.concat([(_g.sent()), true]))];
                return [4 /*yield*/, read($, flows)];
            case 5:
                _c = _c.concat([
                    // and what their presses change that shows later: a Stop's card, a note a box left, the update's steps, a copy made
                    __spreadArray.apply(void 0, _e.concat([(_g.sent()), true])).filter(function (one) { return one.byYou; }).map(function (one) { return one.id; }),
                    __spreadArray([], stoppingJobs, true),
                    loosePressed.length, __spreadArray([], sentReplies, true).map(function (_a) {
                        var id = _a[0], sent = _a[1];
                        return [id, sent.to, sent.text];
                    }),
                    updatedMoment !== null && updatedMoment !== void 0 ? updatedMoment : null,
                    copiedKey
                ]);
                if (!dir) return [3 /*break*/, 7];
                return [4 /*yield*/, readOr($, stepsPath())];
            case 6:
                _f = _g.sent();
                return [3 /*break*/, 8];
            case 7:
                _f = "";
                _g.label = 8;
            case 8: return [2 /*return*/, _b.apply(_a, [_c.concat([
                        _f
                    ])])];
        }
    });
}); };
// A click is the focus moving onto a button, then the press: a drawing between them is a new button under the pointer, and the
// click did nothing (16 Nov, recorded: the update note's What's new took several clicks while other chats' writes drew the panel
// twice a second). From the person's focus on one of the panel's buttons until its press, or PRESS_HOLD, the panel is drawn as it
// last was, but for the mod's own calls for a drawing (a box, an ask, a press: freshness), which come at once. Only on the desktop
// surface: in the terminal a press is one key, and the arrows moving the focus would hold the panel still. A drawing asked for
// meanwhile is made once the hold ends
var PRESS_HOLD = 2000;
var pressFrom = 0;
var pressFresh = 0;
// The calls for a drawing that came from what other chats and work wrote (calmLook): they do not end a press hold, which only the
// person's own moves and the mod's own calls end. Each such write ended it, as other chats wrote every second under load, and the
// hold lasted only until the next one
var calmBumps = 0;
var isPressMissed = false;
var holdForPress = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var at;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = (pressFrom = _a.sent());
                pressFresh = freshness - calmBumps;
                // A hold that ends with no press reaching the mod while a drawing was held back (a click on a button already gone) gives the buttons new keys: the app keeps a
                // focused button in view and scrolls back to it at every drawing, which threw the panel down and back as the person clicked on
                $.clock.after(PRESS_HOLD + 20, function () { return void (pressFrom === at && ((pressFrom = 0), isPressMissed && ((isPressMissed = false), (presses += 1), drawAgain($)))); });
                return [2 /*return*/];
        }
    });
}); };
var isPressHeld = function (at) { return pressFrom > 0 && at - pressFrom < PRESS_HOLD && pressFresh === freshness - calmBumps; };
// A pane drawn afresh is given again, as it was, until FRESH_GAP has passed (or four times what its drawing took, when longer), and
// then drawn afresh once. The engine retires a drawing's buttons the moment a newer drawing of that pane is made, and a newer ask for
// one drops the reply of the drawing still under way: with seven tasks, their helpers and commands, the panel was asked for about
// five times a second and each drawing took 300 ms, so no drawing reached the app for half a minute while every one retired the
// buttons on screen, and every click named a button already gone (16 Nov, 0.2.153: Close pressed twenty times, all "not handled").
// Given again, a drawing is the same tree, keeps its buttons, and is answered at once. A press of the person's is drawn at once
var FRESH_GAP = 1000;
// (250 ms: the 16 Nov drawings took 300 ms; ordinary ones on a busy Mac take 100-250 ms and are not what drops clicks. At 100 ms
// those set the gap off in the test kit too, whose clock stands still, and two tests hung on a drawing that never came)
var SLOW_DRAW = 250;
var freshDrawn = new Map();
var freshDue = new Set();
// The panes being drawn afresh just now: an ask that comes meanwhile gets the drawing before, and the pane is asked for again the
// moment the fresh one is made, since the engine drops the reply of a drawing a newer ask overtook
// One at a time: an ask that comes while a drawing of the pane is under way gets the drawing before, whatever came meanwhile, and the
// pane is drawn afresh once with all of it the moment that one is made. A new one begun for each change, as each second's write
// from work moved freshness, ran side by side with those before, each slowing the rest, on 19 Nov up to nine at once taking 7-12 s
// each while every click waited behind them. (A drawing the engine never finishes holds none for longer than UNDER_WAY_MOST)
var freshUnderWay = new Map();
var UNDER_WAY_MOST = 15000;
var pressedAt = 0;
// (isLoaded: the bar above the prompt is drawn in 50-200 ms under the same load, under SLOW_DRAW, so it is given again
// whenever the panel's own drawings are slow (isPanelSlow))
var isFreshTooSoon = function ($, key, at, isLoaded, canGiveMade) {
    if (isLoaded === void 0) { isLoaded = false; }
    if (canGiveMade === void 0) { canGiveMade = true; }
    var going = freshUnderWay.get(key);
    if (going && at - going.since < UNDER_WAY_MOST)
        return (going.isOvertaken = true);
    var last = freshDrawn.get(key);
    // The ask for a drawing made while it was overtaken: given that one, once (the panel and a Details tab, which hold a drawing
    // only while what they show is the same, look at that themselves: canGiveMade)
    var again = madeAgain.get(key);
    madeAgain.delete(key);
    if (canGiveMade && again && last && again.fresh === freshness && at - again.at < FRESH_GAP && last.fresh === freshness && pressedAt < last.at)
        return true;
    // The mod's own calls for a drawing (an ask, a box, a press, a picture: freshness) come at once
    if (!last || pressedAt >= last.at || last.fresh !== freshness)
        return false;
    // Only while drawings are slow, as under a load that drops them: a quick one reaches the app before the next is asked for
    if (last.ms < SLOW_DRAW && !isLoaded)
        return false;
    var gap = Math.max(FRESH_GAP, last.ms * 4);
    if (at - last.at >= gap)
        return false;
    // (asked for without counting as a call of the mod's own, which would draw afresh at once and skip the gap)
    if (!freshDue.has(key))
        (freshDue.add(key), $.clock.after(gap - (at - last.at) + 20, function () { return void (freshDue.delete(key), drawFresh($)); }));
    return true;
};
// Whether the panel's last drawings made afresh, in the last ten seconds, were slow: the load that drops drawings is on
var isPanelSlow = function (at) { return __spreadArray([], freshDrawn, true).some(function (_a) {
    var key = _a[0], last = _a[1];
    return key.startsWith("".concat(LIST, "|")) && last.ms >= SLOW_DRAW && at - last.at < 10000;
}); };
// Around each drawing made afresh: one asked for while it was made is made again the moment it is done
var freshBegins = function (key, at) { return (freshUnderWay.set(key, { fresh: freshness, isOvertaken: false, since: at }), freshness); };
// Asked for again only for a drawing made afresh, which the engine dropped: an ask answered with the drawing before (a held one) left
// nothing unseen. And the ask that follows within FRESH_GAP is given the drawing just made, never a new one, while nothing of the
// mod's own came (madeAgain). Asked for again after every overtaken ask, two asks that came together (as two per push) overtook each
// other again and again: in the real panel three quarters of the full redraws began the moment a drawing ended, in chains of up to
// 27, with the panel and the bar drawn about seven times a second and the hover under the pointer going out at each (17 Nov)
var madeAgain = new Map();
var freshEnds = function ($, key, made) {
    var _a, _b;
    var going = freshUnderWay.get(key);
    freshUnderWay.delete(key);
    // (a drawing is as new as what it began with: what came while it was made is not in it, so it is never given as made, and the
    // ask that follows draws the pane afresh with it)
    var fresh = (_b = (_a = going === null || going === void 0 ? void 0 : going.fresh) !== null && _a !== void 0 ? _a : made === null || made === void 0 ? void 0 : made.fresh) !== null && _b !== void 0 ? _b : freshness;
    if (made)
        freshDrawn.set(key, __assign(__assign({}, made), { fresh: fresh }));
    if (!(going === null || going === void 0 ? void 0 : going.isOvertaken))
        return;
    if (fresh !== freshness)
        return void drawFresh($);
    if (made)
        (madeAgain.set(key, { fresh: fresh, at: made.at }), void drawFresh($));
};
var calmAt = 0;
var engage = function ($) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, $.clock.now()];
        case 1: return [2 /*return*/, void (engagedAt = _a.sent())
            // Each second: anything new the panel shows draws it again by itself, as the values it read are written; its running times alone
            // draw it again only every CALM while work moves, and not while the person uses it
        ];
    }
}); }); };
// Each second: anything new the panel shows draws it again by itself, as the values it read are written; its running times alone
// draw it again only every CALM while work moves, and not while the person uses it
var calmLook = function ($, isMoving) { return __awaiter(_this, void 0, void 0, function () {
    var now, urgent, list, side, isHeld, isNew, _i, _a, _b, path, text, now_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                urgent = urgentSign();
                if (urgentDrawn && urgent !== urgentDrawn)
                    drawAgain($, true);
                urgentDrawn = urgent;
                list = (_c = drawnPanes.get(LIST)) !== null && _c !== void 0 ? _c : { shape: '', content: '', at: 0, side: sideSign() };
                side = sideSign();
                isHeld = isBoxHeld(now);
                isNew = !isHeld && list.side !== side;
                _i = 0, _a = isHeld ? [] : drawnFiles;
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], path = _b[0], text = _b[1];
                return [4 /*yield*/, readOr($, path)];
            case 3:
                now_1 = _d.sent();
                if (now_1 !== text)
                    (drawnFiles.set(path, now_1), (isNew = true));
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                // Asked for once: a panel the app does not draw just then is not asked for again each second
                if (isNew)
                    return [2 /*return*/, void ((list.side = side), (calmBumps += 1), drawAgain($), (list.side = sideSign()))
                        // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
                        // every CALM too, not each second
                    ];
                // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
                // every CALM too, not each second
                if (!(isMoving || outputMoved) || isBoxHeld(now) || now - engagedAt < ENGAGED || now - Math.max(list.at, calmAt) < CALM)
                    return [2 /*return*/];
                calmAt = now;
                outputMoved = false;
                return [4 /*yield*/, writeHeldOthers($)];
            case 6:
                _d.sent();
                recordEvent($, 'redraw-calm');
                $.ui.invalidate('ui.render');
                return [2 /*return*/];
        }
    });
}); };
// Whether an element of the mod's is a box the person types into: an ask's reply box or a key box
var isTypedBox = function (element) { return /-reply-|^box-.*-field|^config-.*-input$/.test(element !== null && element !== void 0 ? element : ''); };
// Kept through a reload of the mod, and read back as it loads; drafts for work no longer kept go then
var keepDraft = function ($, key, value) {
    return void update($, draftsKept, function (kept) {
        var next = __assign({}, kept);
        if (value)
            next[key] = value;
        else
            delete next[key];
        return next;
    }).catch(function () { return undefined; });
};
// A work's drafts go once its ask is answered
var dropDrafts = function ($, id) {
    for (var _i = 0, _a = __spreadArray([], drafts.keys(), true); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key.startsWith("".concat(id, "|")))
            drafts.delete(key);
    }
    void update($, draftsKept, function (kept) { return Object.fromEntries(Object.entries(kept).filter(function (_a) {
        var key = _a[0];
        return !key.startsWith("".concat(id, "|"));
    })); }).catch(function () { return undefined; });
};
var readDrafts = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var kept, ids, _a, live, _i, live_1, _b, key, value;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, read($, draftsKept).catch(function () { return ({}); })];
            case 1:
                kept = ((_c = (_d.sent())) !== null && _c !== void 0 ? _c : {});
                _a = Set.bind;
                return [4 /*yield*/, read($, todos)];
            case 2:
                ids = new (_a.apply(Set, [void 0, (_d.sent()).map(function (one) { return one.id; })]))();
                live = Object.entries(kept).filter(function (_a) {
                    var _b;
                    var key = _a[0], value = _a[1];
                    return typeof value === 'string' && ids.has((_b = key.split('|')[0]) !== null && _b !== void 0 ? _b : '');
                });
                for (_i = 0, live_1 = live; _i < live_1.length; _i++) {
                    _b = live_1[_i], key = _b[0], value = _b[1];
                    if (!drafts.has(key))
                        drafts.set(key, value);
                }
                if (!(live.length !== Object.keys(kept).length)) return [3 /*break*/, 4];
                return [4 /*yield*/, update($, draftsKept, function () { return Object.fromEntries(live); })];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// The line the work last wrote about itself, as it stood when the answer was given: a newer one takes the answer's place
var lineOf = function (one) { var last = ownNote(one); return last ? "".concat(last.at, ":").concat(last.text) : ''; };
// How long the card says what was answered, unless the work writes a newer line first
var ANSWER_SHOWN = 60000;
// An ask's question is one line of at most ASK_TEXT letters; what it is about, its details, is kept whole up to ASK_DETAILS
var ASK_TEXT = 300;
var ASK_DETAILS = 12000;
// Words by which an ask points at an explanation somewhere else (the chat, a report, a message still to come), never at something
// shown, such as a code on a page or a picture
var POINTS_AWAY = /\b(?:as (?:i |we )?(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|agreed|said)|(?:explained|described|listed|discussed|mentioned|summari[sz]ed|set out|outlined|noted|said|wrote) (?:in (?:the|my|this) (?:chat|report|message|result|explanation)|above|below|earlier|before)|(?:see|per) (?:my|the) (?:report|last message|explanation|message above)|in my (?:report|last message)|(?:the )?(?:differences|changes) (?:above|below|i listed)|see (?:above|below)\b)|\(see (?:above|below)\)/i;
// How much of what an ask is about the small card shows; Details shows it whole, as does the chat's notice
var DETAILS_ON_CARD = 1500;
// How much of it the row the chat's model reads carries: the person has it whole, and the chat stays small
var DETAILS_IN_RELAY = 2000;
var sentReplies = new Map();
// An answer on its way, by the work it was written into: that work's next step reads it, and the card it belongs to says so
var pending = new Map();
// Asks of another chat's work replied to here in words that hold them, by work and when it asked: acted on from the moment the reply
// is left, until that chat's own file carries the reply
var actingOn = new Map();
// The asks of this chat's work already answered, by work and when it asked
var answeredAsks = new Set();
// When the ask each work last had answered and cleared was asked, so a reply in words left after a press reaches only that ask
var answeredAt = new Map();
// Answers on their way, so a press hook can wait for the one its press started (a button's handler does not await it)
var answersOnWay = new Set();
// `picked`: what was attached under the box, named on the card after the words; `files`: those and the files the words name, each
// listed for the task with how to open it (filesNote)
var answerAsk = function ($, one, choice, isReply, picked, files) {
    if (isReply === void 0) { isReply = false; }
    if (picked === void 0) { picked = []; }
    if (files === void 0) { files = picked; }
    var run = answerNow($, one, choice, isReply, picked, files);
    if (one.chat)
        return run;
    answersOnWay.add(run);
    void run.finally(function () { return answersOnWay.delete(run); }).catch(function () { return undefined; });
    return run;
};
// Whether an answer settles its ask: a press does, and so does a reply to an ask that wanted words (it gave no buttons of its own)
// or one that begins with the words of one of its buttons. Any other reply, such as a request first, leaves the ask open while the work acts on it
var plainWords = function (text) { return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); };
var settles = function (ask, said, isReply) { var _a; return !isReply || (!ask.refused && (!((_a = ask.choices) === null || _a === void 0 ? void 0 : _a.length) || ask.choices.some(function (choice) { return plainWords(choice) && "".concat(plainWords(said), " ").startsWith("".concat(plainWords(choice), " ")); }))); };
// The asks a press answered, by card, as `${at}:${text}`: the panel draws the card answered from the press itself, its block
// gone in the press's own drawing, before the answer is written; the mark goes once the card's file no longer carries the ask
var askPressed = new Map();
// A card as the panel draws it: an ask or a gate already pressed is not drawn as still waiting. A card the person dismissed is
// drawn asking nothing
var asPressed = function (given) {
    var _a, _b, _c;
    var closed = given.status !== 'working' && !given.closedAt && dismissedNow.has(given.id) ? __assign(__assign({}, given), { closedAt: (_a = dismissedNow.get(given.id)) !== null && _a !== void 0 ? _a : (given.endedAt || 1) }) : given;
    var one = closed.closedAt && closed.ask ? __assign(__assign({}, closed), { ask: undefined }) : closed;
    var isAnswered = Boolean(one.ask && askPressed.get(one.id) === "".concat(one.ask.at, ":").concat(one.ask.text));
    var admins = (_b = one.admins) === null || _b === void 0 ? void 0 : _b.filter(function (gate) { return !gatePressed.has(gate.id); });
    if (!isAnswered && (admins === null || admins === void 0 ? void 0 : admins.length) === ((_c = one.admins) === null || _c === void 0 ? void 0 : _c.length))
        return one;
    return __assign(__assign({}, one), { ask: isAnswered ? undefined : one.ask, admins: (admins === null || admins === void 0 ? void 0 : admins.length) ? admins : undefined });
};
// Where anything is typed for the panel: one box in the bar above the prompt (band.tsx), a site of its own that the pane's
// scrolling does not reach. The desktop app keeps moving a pane's window back to a box that holds the cursor inside it, many times a
// second, and reports each move as the person's own scroll (found live, 15 Nov), so nothing is typed inside the panel there. The
// box is there only once the person asks for it, with a press on a block or a card: Answer in words, Type it, Paste it, Change
// something, or Continue on a result; Close takes it away again.
// A bar the person folded shows nothing of the mod's, one of the app's surveys takes its place, and the terminal's bar draws no
// field: there the block keeps one field of its own, so words can always be typed somewhere (repliesInBar)
var barBoxes = new Set();
var repliesInBar = function (surface) { return barBoxes.has(surface); };
// When the bar's box last took the cursor or a letter, 0 once the cursor is known to have left it or its words were sent: the bar
// gives its own drawing again for BAR_BOX_HELD after it (band.tsx, barHeld), and the mod puts off its other redraws for TYPING
// after it (isBoxHeld). The app may say nothing when the cursor leaves for the chat's own box, so both end by themselves
var barBoxAt = 0;
var BAR_BOX_HELD = 300000;
var isBarBox = function (element) { return /^band-.*-reply-/.test(element !== null && element !== void 0 ? element : ''); };
var barOpen;
var isBarOpen = function (kind, id) { return (barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) === kind && barOpen.id === id; };
var isReplyOpen = function (one) { return Boolean(one.ask) && isBarOpen('answer', one.id); };
// Closed for what it was open for, as that is answered or goes; the caller draws again
var closeBarOf = function (id) { return void ((barOpen === null || barOpen === void 0 ? void 0 : barOpen.id) === id && ((barOpen = undefined), (barBoxAt = 0))); };
// The open box's own name, the same through a new question of its task, and a new one after each thing sent from it
var barBoxKey = function () { var _a, _b; return (barOpen ? "band-".concat(barOpen.id, "-reply-").concat(barOpen.kind, "-").concat(isBoxKind(barOpen.kind) ? ((_a = boxTries.get(barOpen.id)) !== null && _a !== void 0 ? _a : 0) : ((_b = replies.get(barOpen.id)) !== null && _b !== void 0 ? _b : 0), "-").concat(barOpen.mark) : ''); };
// What is typed in it and not sent, kept for an answer, a change and a result (never for a key or a password)
var barDraft = function () { return (barOpen ? "".concat(barOpen.id, "|").concat(barOpen.kind === 'answer' ? barOpen.mark : barOpen.kind) : ''); };
// This chat's cards that wait for an answer
var asksForBar = function (cards) { return cards.filter(function (one) { return !one.parentId && !one.chat && Boolean(asPressed(one).ask) && !isActingOnReply(one); }); };
var barTarget = function (cards) { return ((barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) === 'answer' ? asksForBar(cards).find(isReplyOpen) : undefined); };
// A card's blocks moved under the pointer: what the panel draws above them changed a moment before a press on one of them. The press
// was aimed at what stood there before, so it does nothing, and the block says so (19 Nov: an empty space above closed as the person
// reached for Answer in words on one card, and the same button of the card below slid under the pointer: the press, the box and the
// answer went to that other task). Judged on the list as last drawn on the desktop: what stands above each card's first block
// (askAbove), and when that last changed (askMovedAt)
var askAbove = new Map();
var askMovedAt = new Map();
// (a person takes about half a second to see a change and a little more to stop a click already on its way)
var MOVED_HOLD = 1500;
var isMovedUnder = function (card) { var _a; return pressedAt - ((_a = askMovedAt.get(card)) !== null && _a !== void 0 ? _a : -Infinity) < MOVED_HOLD; };
// The blocks a press was held back on, by block, with when the block came: it says so until it is pressed again or goes
var movedPresses = new Map();
var MOVED_SAID = 'This moved as you pressed, so nothing was sent. Press again.';
// The list as just drawn on the desktop: each card whose block moved is marked so from `at`
var markMoved = function (now, at) {
    for (var _i = 0, now_2 = now; _i < now_2.length; _i++) {
        var _a = now_2[_i], card = _a[0], sign = _a[1];
        if (askAbove.has(card) && askAbove.get(card) !== sign)
            askMovedAt.set(card, at);
    }
    askAbove.clear();
    for (var _b = 0, now_3 = now; _b < now_3.length; _b++) {
        var _c = now_3[_b], card = _c[0], sign = _c[1];
        askAbove.set(card, sign);
    }
};
// The bar's own id on each surface, as its drawing is asked for: where the cursor is put when the box opens
var barIds = new Map();
// What was typed in the bar's box is its card's: when the work has since put a new question in place of the one the box was
// opened on, the words are shown under that question too, in the box as it is opened again and in the card's own field when the
// bar folds. Only the words of the box the person last had open for that card (barLeft), never those of an older question
var barLeft = new Map();
var carryDraft = function ($, one, from) {
    if (!one.ask || !from)
        return;
    var to = draftOf(one.id, one.ask);
    var typed = drafts.get(from);
    if (from === to || !typed || drafts.get(to))
        return;
    drafts.set(to, typed);
    keepDraft($, to, typed);
    drafts.delete(from);
    keepDraft($, from, undefined);
};
// Opens the one box for something, or closes it (no `to`). Opening it, the cursor is asked into the box: the app gives it only
// where the bar already holds the keys, so where it does not the person clicks the box
var openBar = function ($, to, surface) {
    var _a, _b;
    var was = barOpen;
    // What was half typed for a question is kept for its card; a box for a change or a result, closed, is a new one, empty, next time
    if ((was === null || was === void 0 ? void 0 : was.kind) === 'answer')
        barLeft.set(was.id, barDraft());
    if (was && (was.kind === 'change' || was.kind === 'continue'))
        (drafts.delete(barDraft()), keepDraft($, barDraft(), undefined), replies.set(was.id, ((_a = replies.get(was.id)) !== null && _a !== void 0 ? _a : 0) + 1));
    var ask = (to === null || to === void 0 ? void 0 : to.kind) === 'answer' ? (_b = to.one) === null || _b === void 0 ? void 0 : _b.ask : undefined;
    var next = to && (to.kind !== 'answer' || ask) ? to : undefined;
    if ((next === null || next === void 0 ? void 0 : next.one) && ask)
        (carryDraft($, next.one, barLeft.get(next.id)), barLeft.delete(next.id));
    barOpen = next ? { kind: next.kind, id: next.id, mark: ask ? askMark(ask) : '' } : undefined;
    barKeyTyped.clear();
    if (next && isBoxKind(next.kind))
        (boxHeldReply.delete(next.id), boxSaid.delete(next.id));
    barBoxAt = 0;
    // (and the box in a Details tab: the press was on a button elsewhere, so the cursor has left it)
    paneBoxAt = 0;
    isBarSettling = false;
    presses += 1;
    boxPresses += 1;
    freeTimes($);
    redraw($);
    var bar = barIds.get(surface);
    if (!next || !bar)
        return;
    void $.ui
        .focus({ requestId: bar, key: barBoxKey() })
        .then(function (r) { var _a; return recordEvent($, 'focus-call', { deny: (_a = r.deny) !== null && _a !== void 0 ? _a : null }); })
        .catch(function (err) { return recordEvent($, 'focus-call', { failed: String(err).slice(0, 80) }); });
};
// A reply sent from the bar's box answers what its card asks as it is sent: the box may have been drawn for an earlier question.
// On its way from the press itself, as an answer from the card is (answersOnWay)
var sendFromBar = function ($, id, value) {
    // The pictures and files attached under the box go with the words, and the box is clear of them at once
    var picked = takeAttached(id);
    var run = (function () { return __awaiter(_this, void 0, void 0, function () {
        var one, files, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, read($, todos)];
                case 1:
                    one = (_d.sent()).find(function (card) { return card.id === id; });
                    _a = [[]];
                    _b = Set.bind;
                    _c = [__spreadArray([], picked, true)];
                    return [4 /*yield*/, pathsIn($, value)];
                case 2:
                    files = __spreadArray.apply(void 0, _a.concat([new (_b.apply(Set, [void 0, __spreadArray.apply(void 0, _c.concat([(_d.sent()), true]))]))(), true]));
                    if (!((one === null || one === void 0 ? void 0 : one.ask) && (value.trim() || files.length))) return [3 /*break*/, 4];
                    return [4 /*yield*/, answerAsk($, one, value, true, picked, files)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); })();
    answersOnWay.add(run);
    void run.finally(function () { return answersOnWay.delete(run); }).catch(function () { return undefined; });
    return run;
};
// Message, on a card of this chat's that works or has finished: the same box, opened for a card that asks nothing. What is sent from it
// goes to that task as the person's own words, which carries it on from the submit's or the press's own hook (answersOnWay,
// toEnded), never from a timer, and the chat is only told, with no turn of its own
// (a finished one with to-dos left open too: the person may write to any task that works or has finished, 19 Nov)
var canChange = function (one) { return !one.chat && !one.parentId && (one.status === 'working' || one.status === 'done' || one.status === 'failed') && !isHeld(one) && !needsPerson(one); };
// A message goes the one way from both places the person writes to a task: the box above the chat that Message opens, and the box
// at the bottom of the task's Details. Send hands it to the task, which reads it at its next step: Claude Code queues a message to a
// task at work until its next tool round, and starts a paused or finished one with it at once. Stop and send, while it works, stops
// it first (interruptStep) and starts it again with the message: Claude Code has no way to cut only the step a task is on, and its
// stop ends the task's own commands and helpers too (engine 2.1.326, read 19 Nov). The files picked with Attach go with it, each by
// its path: a message to a task is text alone
var sendChange = function ($, id, value, isNow) {
    if (isNow === void 0) { isNow = false; }
    var files = takeAttached(id);
    var run = changeTask($, id, value.trim(), files, isNow);
    answersOnWay.add(run);
    void run.finally(function () { return answersOnWay.delete(run); }).catch(function () { return undefined; });
    return run;
};
// The files picked for a message to each task, by its card, until the message goes or the person takes one off
// (also under the box that answers a card's question in words, and under Message on a result: by the result's id)
var attached = new Map();
var ATTACH_MOST = 20;
// Taken for what is sent: the box's files go with it, and its line about the clipboard with them
var takeAttached = function (id) {
    var _a;
    var files = (_a = attached.get(id)) !== null && _a !== void 0 ? _a : [];
    attached.delete(id);
    attachSaid.delete(id);
    return files;
};
// What Paste said, by the box's id, when the clipboard held nothing to attach; it goes with the next file attached or sent
var attachSaid = new Map();
var NOTHING_TO_PASTE = "There's nothing to paste. Copy a picture or a file first, then press Paste.";
// Where pasted pictures are kept: the person's own memory folder, never the repo or a shared place
var attachedDir = function () { return "".concat(dir, "/attached"); };
// A file attached as a tile is drawn: by its kind, as what a task made is (files.tsx)
var attachedMade = function (path) { return ({ path: path, name: fileName(path), kind: madeKind(path).kind }); };
// Each tile's small copy, where one is made, as a task's files have theirs: the picture, a PDF's first page, what Quick Look draws of a
// video or a document; any other file keeps its icon
var attachedFace = function (path) { var _a; return (_a = faces.get(faceKey(attachedMade(path)))) !== null && _a !== void 0 ? _a : undefined; };
// What the drawing of a box's files depends on, for the drawings given again while a box is typed in (barShape, paneBoxShape)
var attachShape = function (id) { var _a, _b, _c; return JSON.stringify([(_a = attached.get(id)) !== null && _a !== void 0 ? _a : [], ((_b = attached.get(id)) !== null && _b !== void 0 ? _b : []).map(function (path) { return Boolean(attachedFace(path)); }), (_c = attachSaid.get(id)) !== null && _c !== void 0 ? _c : '']); };
// The files go under the box at once, each with its icon; the small copies follow, one after another, and the box is drawn again
var addAttached = function ($, id, picked) { return __awaiter(_this, void 0, void 0, function () {
    var missing, _i, missing_1, one, face;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                attached.set(id, __spreadArray([], new Set(__spreadArray(__spreadArray([], ((_a = attached.get(id)) !== null && _a !== void 0 ? _a : []), true), picked, true)), true).slice(0, ATTACH_MOST));
                attachSaid.delete(id);
                ((presses += 1), (boxPresses += 1), drawAgain($, true));
                missing = picked.map(attachedMade).filter(function (one) { return !faces.has(faceKey(one)) && !facesLoading.has(faceKey(one)); });
                if (!missing.length)
                    return [2 /*return*/];
                _i = 0, missing_1 = missing;
                _b.label = 1;
            case 1:
                if (!(_i < missing_1.length)) return [3 /*break*/, 4];
                one = missing_1[_i];
                facesLoading.add(faceKey(one));
                return [4 /*yield*/, makeFace($, one).catch(function (err) { return (log($, "small copy of an attached file not made: ".concat(String(err))), null); })];
            case 2:
                face = _b.sent();
                faces.set(faceKey(one), face);
                facesMade += 1;
                facesLoading.delete(faceKey(one));
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                ;
                ((presses += 1), (boxPresses += 1), drawAgain($, true));
                return [2 /*return*/];
        }
    });
}); };
// Paste: what the computer's clipboard holds goes under the box. Files of any kind copied in the Finder go by their own paths; a picture
// copied (a screenshot taken to the clipboard, an image copied from a page) is saved as a PNG in the memory folder first. The box
// itself takes only words: the app gives a mod's field no pasted picture, nor a dropped file (engine 2.1.326)
var PASTE_MAC = "ObjC.import('AppKit')\nfunction run(argv) {\n  const pb = $.NSPasteboard.generalPasteboard\n  const out = []\n  const urls = pb.readObjectsForClassesOptions($([$.NSURL]), $({ NSPasteboardURLReadingFileURLsOnlyKey: true }))\n  if (!urls.isNil()) for (let i = 0; i < urls.count; i++) out.push(urls.objectAtIndex(i).path.js)\n  if (out.length) return out.join('\\n')\n  let data = pb.dataForType($.NSPasteboardTypePNG)\n  if (data.isNil()) {\n    const tiff = pb.dataForType($.NSPasteboardTypeTIFF)\n    if (!tiff.isNil()) data = $.NSBitmapImageRep.imageRepWithData(tiff).representationUsingTypeProperties(4, $({}))\n  }\n  if (data.isNil()) return ''\n  return data.writeToFileAtomically(argv[0], true) ? argv[0] : ''\n}";
var PASTE_LINUX = 'xclip -selection clipboard -t image/png -o > "$1" 2>/dev/null && [ -s "$1" ] && echo "$1"';
var pastePicture = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var at, _a, to, r, got;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!canAttach())
                    return [2 /*return*/];
                return [4 /*yield*/, $.process.run(['mkdir', '-p', attachedDir()])
                    // Named by when it was pasted, as a person reads it: pasted-19-Nov-14.05.09.png
                ];
            case 1:
                _b.sent();
                _a = Date.bind;
                return [4 /*yield*/, $.clock.now()];
            case 2:
                at = new (_a.apply(Date, [void 0, _b.sent()]))();
                to = "".concat(attachedDir(), "/pasted-").concat(at.getDate(), "-").concat(MONTHS[at.getMonth()], "-").concat([at.getHours(), at.getMinutes(), at.getSeconds()].map(function (n) { return String(n).padStart(2, '0'); }).join('.'), ".png");
                return [4 /*yield*/, $.process.run(isLinux ? ['sh', '-c', PASTE_LINUX, 'sh', to] : ['osascript', '-l', 'JavaScript', '-e', PASTE_MAC, to], { timeoutMs: 15000 }).catch(function (err) { return (log($, "clipboard not read: ".concat(String(err))), undefined); })];
            case 3:
                r = _b.sent();
                got = ((r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout : '').split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line.startsWith('/'); });
                if (got.length)
                    return [2 /*return*/, addAttached($, id, got)];
                attachSaid.set(id, NOTHING_TO_PASTE);
                ((presses += 1), (boxPresses += 1), drawAgain($, true));
                return [2 /*return*/];
        }
    });
}); };
// Attach opens the computer's own file picker, where the engine runs: so not in a chat run on another Mac over ssh, whose picker
// would open on that Mac's screen (isRunFromAfar). macOS through osascript, Linux through zenity
var canAttach = function () { return !isRunFromAfar; };
var PICK_MAC = ['osascript', '-e', 'activate', '-e', 'set picked to choose file with prompt "Attach files" with multiple selections allowed', '-e', 'set out to ""', '-e', 'repeat with f in picked', '-e', 'set out to out & POSIX path of f & linefeed', '-e', 'end repeat', '-e', 'return out'];
var PICK_LINUX = ['zenity', '--file-selection', '--multiple', '--separator=\n', '--title=Attach files'];
var pickFiles = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var r, picked;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!canAttach())
                    return [2 /*return*/];
                return [4 /*yield*/, $.process.run(isLinux ? PICK_LINUX : PICK_MAC, { timeoutMs: 600000 }).catch(function (err) { return (log($, "files not picked: ".concat(String(err))), undefined); })];
            case 1:
                r = _a.sent();
                if (!r || r.exitCode !== 0)
                    return [2 /*return*/];
                picked = r.stdout.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line.startsWith('/'); });
                if (!picked.length)
                    return [2 /*return*/];
                return [4 /*yield*/, addAttached($, id, picked)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var unattach = function ($, id, path) {
    var _a;
    var left = ((_a = attached.get(id)) !== null && _a !== void 0 ? _a : []).filter(function (one) { return one !== path; });
    if (left.length)
        attached.set(id, left);
    else
        attached.delete(id);
    ((presses += 1), (boxPresses += 1), drawAgain($, true));
};
// What is typed for a message to a task, kept under one name wherever it is typed: the box above the chat and the box in Details
// are the same message
var messageDraft = function (id) { return "".concat(id, "|change"); };
// Sent from either box: the words go, the box empties (a new one, by its key), and the box above the chat, open for this task,
// closes
var sendMessageFrom = function ($, id, value, isNow) {
    var _a, _b;
    if (!value.trim() && !((_a = attached.get(id)) === null || _a === void 0 ? void 0 : _a.length))
        return;
    barBoxAt = 0;
    paneBoxAt = 0;
    drafts.delete(messageDraft(id));
    keepDraft($, messageDraft(id), undefined);
    replies.set(id, ((_b = replies.get(id)) !== null && _b !== void 0 ? _b : 0) + 1);
    if (isBarOpen('change', id))
        barOpen = undefined;
    freeTimes($);
    redraw($);
    void sendChange($, id, value, isNow).catch(function (err) { return log($, "message not sent: ".concat(String(err))); });
};
// What is attached under a box: each file as a tile, as a task's files are in its Details, with its small copy or its kind's icon,
// then its name, which opens it, and ✕, which takes it off; and what Paste said when the clipboard held nothing. The terminal
// draws no picture: names alone there, a press taking one off
var ATTACH_COLUMNS = 14;
var attachedRow = function ($, ui, id, key) {
    var _a;
    var files = (_a = attached.get(id)) !== null && _a !== void 0 ? _a : [];
    var said = attachSaid.get(id);
    if (!files.length && !said)
        return null;
    var canDraw = 'Svg' in ui && !('isTerminal' in ui);
    var chars = 0;
    var faceOf = function (path) {
        var face = attachedFace(path);
        if (!face || chars + face.base64.length > TILE_CHARS)
            return undefined;
        chars += face.base64.length;
        return face;
    };
    return (<ui.Box key={"".concat(key, "-files")} flexDirection="column" gap={1} width="100%">
      {files.length ? (<ui.Box flexDirection="row" flexWrap="wrap" columnGap={1} rowGap={1}>
          {files.map(function (path, n) {
                var one = attachedMade(path);
                var remove = function () { return unattach($, id, path); };
                if (!canDraw || !('Svg' in ui))
                    return <ui.Button key={"".concat(key, "-file-").concat(n, "-remove-").concat(presses)} label={"\uD83D\uDCCE ".concat(cut(one.name, 40), " \u2715")} plain dimColor onPress={remove}/>;
                var row = "".concat(key, "-file-").concat(n);
                return (<ui.Box key={row} flexDirection="column" alignItems="flex-start" width={ATTACH_COLUMNS} flexShrink={0}>
                <ui.Svg key={"".concat(row, "-svg")} source={oneTile(one, faceOf(path))} alt={"".concat(madeKindOf(one.kind).one.replace(/^\w/, function (c) { return c.toUpperCase(); }), ": ").concat(one.name)} width={TILE_SHOWN_W} height={TILE_SHOWN_H}/>
                <ui.Box flexDirection="row" alignItems="center" width="100%">
                  <ui.Button key={"".concat(row, "-open-").concat(presses)} label={middleCut(one.name, ATTACH_COLUMNS - 2)} plain onPress={function (press) { return void ((presses += 1), openMade($, one, '', row, press.surface).catch(function (err) { return log($, "attached file not opened: ".concat(String(err))); })); }}/>
                  <ui.Button key={"".concat(row, "-remove-").concat(presses)} label="✕" plain dimColor onPress={remove}/>
                </ui.Box>
              </ui.Box>);
            })}
        </ui.Box>) : null}
      {said ? <ui.Text key={"".concat(key, "-files-said")} color={NEEDS} wrap="wrap">{said}</ui.Text> : null}
    </ui.Box>);
};
// Attach and Paste, where the computer's own picker and clipboard are this one's (canAttach)
var attachButtons = function ($, ui, id, key) {
    return canAttach()
        ? [
            <ui.Button key={"".concat(key, "-attach-").concat(presses, "-").concat(boxPresses)} label="Attach" plain onPress={function () { return void pickFiles($, id).catch(function (err) { return log($, "files not picked: ".concat(String(err))); }); }}/>,
            <ui.Button key={"".concat(key, "-paste-").concat(presses, "-").concat(boxPresses)} label={PASTE} plain onPress={function () { return void pastePicture($, id).catch(function (err) { return log($, "nothing pasted: ".concat(String(err))); }); }}/>,
        ]
        : null;
};
var PASTE = 'Paste';
// The row under a message box, the same in the box above the chat and at the bottom of Details: the files picked, each taken off
// with a press on its name; Attach; then, while the task is in the middle of a step, Send now, and Send, the big one; `close`,
// the box above the chat's own Close
var SEND_NOW = 'Stop and send';
var messageFoot = function ($, ui, one, key, close) {
    if (close === void 0) { close = null; }
    var typed = function () { var _a; return (_a = drafts.get(messageDraft(one.id))) !== null && _a !== void 0 ? _a : ''; };
    var isMidStep = one.status === 'working';
    return (<ui.Box key={"".concat(key, "-foot")} flexDirection="column" flexShrink={0} gap={1} width="100%">
      {attachedRow($, ui, one.id, key)}
      <ui.Box flexDirection="row" alignItems="center" flexWrap="wrap" gap={1}>
        {attachButtons($, ui, one.id, key)}
        {/* The sends keep together at the right, on the next line when the pane is narrow */}
        <ui.Box flexDirection="row" alignItems="center" gap={1} flexGrow={1} justifyContent="flex-end">
          {isMidStep ? <ui.Button key={"".concat(key, "-now-").concat(presses, "-").concat(boxPresses)} label={SEND_NOW} onPress={function () { return sendMessageFrom($, one.id, typed(), true); }}/> : null}
          <ui.Button key={"".concat(key, "-send-").concat(presses, "-").concat(boxPresses)} label="Send" variant="primary" onPress={function () { return sendMessageFrom($, one.id, typed(), false); }}/>
          {close}
        </ui.Box>
      </ui.Box>
    </ui.Box>);
};
// The box at the bottom of a task's Details, for a task of this chat's that works or has finished and asks nothing: what is typed
// in it is the same message as in the box above the chat (messageDraft), and it goes the same way. The desktop app pulls a pane's
// window back to a box that holds the cursor each time the pane is drawn, and draws the box's ring again: so while it holds the
// cursor or is typed in, the tab is given again as it was, reading nothing, and the mod's own redraws wait (paneBoxAt, isBoxHeld),
// as the box above the chat is held. At the bottom, the pull, should one come, is to where the person types
var paneBoxAt = 0;
var paneBoxIn = '';
var isPaneBox = function (element) { return /^details-.*-reply-/.test(element !== null && element !== void 0 ? element : ''); };
var paneBoxKey = function (id) { var _a; return "details-".concat(id, "-reply-change-").concat((_a = replies.get(id)) !== null && _a !== void 0 ? _a : 0); };
var isPaneBoxHeld = function (paneId, at) { return paneBoxIn === paneId && paneBoxAt > 0 && at - paneBoxAt < BAR_BOX_HELD; };
// The Details drawing given again while its box is held, by pane, with what the box was drawn for: its key and its files
var paneBoxHeld = new Map();
var paneBoxShape = function (id) { return JSON.stringify([paneBoxKey(id), attachShape(id), presses, boxPresses]); };
// The person's messages to a task, in the order sent, the newest MESSAGES_SHOWN of them: each numbered, with when it was sent and
// whether the task has read it, a repeat of earlier words and a Stop and send said too. While some wait, one line says what they
// wait behind: the task reads messages only between its steps
var MESSAGES_SHOWN = 5;
var isFollowed = function (entry) { return entry.kind === 'steer' && (entry.isUnread || entry.readAt !== undefined); };
var sentList = function (ui, one, now) {
    var all = one.entries.filter(isFollowed);
    if (!all.length)
        return null;
    var from = Math.max(0, all.length - MESSAGES_SHOWN);
    var unread = all.filter(function (entry) { return entry.isUnread; }).length;
    var step = one.running ? "".concat(one.running.label ? "\u201C".concat(cut(one.running.label, 80), "\u201D") : one.running.what, ", has run ").concat(took(now - one.running.at)) : '';
    var meanwhile = !unread
        ? ''
        : one.status !== 'working'
            ? "The task starts again with ".concat(unread === 1 ? 'your message' : 'your messages', ".")
            : needsPerson(one)
                ? "The task reads ".concat(unread === 1 ? 'your message' : 'your messages', " once you answer it above.")
                : "The task reads messages between its steps.".concat(step ? " Its current step, ".concat(step, ".") : '', " Send adds yours after ").concat(unread === 1 ? 'this one' : 'these', ". Stop and send ends that step, so it reads them all now, in this order.");
    return (<ui.Box key={"sent-".concat(one.id)} flexDirection="column" gap={1} width="100%">
      <ui.Box flexDirection="column" width="100%">
        {all.slice(from).map(function (entry, i) {
            var _a;
            var n = from + i + 1;
            var same = all.slice(0, n - 1).findIndex(function (other) { return plainWords(other.text) === plainWords(entry.text); });
            var state = [entry.isUnread ? 'Not read yet' : "\u2713 Read ".concat(clockAt((_a = entry.readAt) !== null && _a !== void 0 ? _a : 0)), same >= 0 ? "the same words as ".concat(same + 1) : '', entry.isNow ? 'you stopped its step to send it' : ''].filter(Boolean).join(' · ');
            return (<ui.Box key={"sent-".concat(one.id, "-").concat(entry.at)} flexDirection="row" alignItems="flex-start" gap={1} width="100%">
              <ui.Box flexShrink={0} width={String(all.length).length + 7}>
                <ui.Text dimColor wrap="truncate-end">{"".concat(n, "  ").concat(clockAt(entry.at))}</ui.Text>
              </ui.Box>
              <ui.Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                <ui.Text wrap="truncate-end">{oneLine(entry.text)}</ui.Text>
                <ui.Text dimColor wrap="wrap">{state}</ui.Text>
              </ui.Box>
            </ui.Box>);
        })}
      </ui.Box>
      {meanwhile ? <ui.Text wrap="wrap">{meanwhile}</ui.Text> : null}
    </ui.Box>);
};
var messageBox = function ($, ui, one, paneId, now) {
    if (now === void 0) { now = 0; }
    return (<ui.Box key={"message-".concat(one.id)} flexDirection="column" gap={1} flexShrink={0}>
    {sentList(ui, one, now)}
    {'Input' in ui ? (<ui.Input key={paneBoxKey(one.id)} placeholder="Type your message" value={draftDrawn(messageDraft(one.id))} rows={BOX_ROWS} onInput={function (value) {
                drafts.set(messageDraft(one.id), value);
                keepDraft($, messageDraft(one.id), value);
                holdTimes($);
                paneBoxIn = paneId;
                void $.clock.now().then(function (at) { return (paneBoxAt = at); });
            }} onSubmit={function (value) { return sendMessageFrom($, one.id, value, false); }}/>) : null}
    {messageFoot($, ui, one, "details-".concat(one.id))}
  </ui.Box>);
};
// Stop and send: the task is stopped as Claude Code stops one (TaskStop), which ends its step, its commands and its helpers, and its
// card stays at work, as the message starts it again from its saved conversation (interrupting). Once Claude Code no longer lists it
// as running, at most INTERRUPT_WAIT, the message goes
var interrupting = new Set();
var INTERRUPT_WAIT = 10000;
var interruptStep = function ($, card) { return __awaiter(_this, void 0, void 0, function () {
    var r, from, it;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                interrupting.add(card.id);
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', task_id: card.id }).catch(function (err) { return ({ deny: String(err) }); })];
            case 1:
                r = _a.sent();
                if (r.deny)
                    return [2 /*return*/, (interrupting.delete(card.id), log($, "task ".concat(card.id, " not stopped for a message: ").concat(r.deny)), false)];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                from = _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, $.clock.now()];
            case 4:
                if (!((_a.sent()) - from < INTERRUPT_WAIT)) return [3 /*break*/, 7];
                return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
            case 5:
                it = (_a.sent()).find(function (one) { return one.id === card.id; });
                if (!it || it.status !== 'running')
                    return [3 /*break*/, 7];
                return [4 /*yield*/, $.clock.sleep(250)];
            case 6:
                _a.sent();
                return [3 /*break*/, 3];
            case 7:
                $.clock.after(60000, function () { return void interrupting.delete(card.id); });
                return [2 /*return*/, true];
        }
    });
}); };
// What kind of file each is, by its ending, for how the task opens it
var fileKind = function (path) {
    var _a;
    var end = ((_a = path.split('.').pop()) !== null && _a !== void 0 ? _a : '').toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(end))
        return 'picture';
    if (['heic', 'heif', 'tif', 'tiff', 'bmp'].includes(end))
        return 'picture-other';
    if (['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi'].includes(end))
        return 'video';
    if (end === 'pdf')
        return 'pdf';
    return 'file';
};
// The paths a message names: picked with Attach, or typed or dropped into the box as text (a terminal types a dropped file's path,
// its spaces escaped; a file:// address is a path too). Only the ones that are files on this computer
var pathsIn = function ($, said) { return __awaiter(_this, void 0, void 0, function () {
    var found, _loop_1, _i, _a, m;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                found = new Set();
                _loop_1 = function (m) {
                    var raw, path;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                raw = (_d = (_c = (_b = m[1]) !== null && _b !== void 0 ? _b : m[2]) !== null && _c !== void 0 ? _c : m[3]) !== null && _d !== void 0 ? _d : '';
                                path = (function () {
                                    try {
                                        return decodeURIComponent(raw.replace(/\\ /g, ' ').replace(/[.,;:)]+$/, ''));
                                    }
                                    catch (_a) {
                                        return raw.replace(/\\ /g, ' ');
                                    }
                                })();
                                return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
                            case 1:
                                if (((_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.kind) === 'file')
                                    found.add(path);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = said.matchAll(/(?:file:\/\/)?(\/(?:\\ |[^\s'"`<>])+)|'(\/[^'\n]+)'|"(\/[^"\n]+)"/g);
                _f.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                m = _a[_i];
                return [5 /*yield**/, _loop_1(m)];
            case 2:
                _f.sent();
                _f.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, __spreadArray([], found, true)];
        }
    });
}); };
// What the task is told with the files: each path, and how a task opens one of its kind
var filesNote = function (files) {
    return files.length
        ? "\n\nFiles with this message, on this computer: open each one before you act on the message.\n".concat(files
            .map(function (path) {
            var kind = fileKind(path);
            var how = kind === 'picture' || kind === 'pdf'
                ? 'open it with Read'
                : kind === 'picture-other'
                    ? 'turn it into a PNG in your scratch folder (sips -s format png on a Mac, convert on Linux), then open that with Read'
                    : kind === 'video'
                        ? 'take stills from it into your scratch folder with ffmpeg (one a second, or more where it moves fast), then open them with Read; ffprobe gives its length'
                        : 'read it as its kind needs';
            return "- ".concat(path, " (").concat(how, ")");
        })
            .join('\n'))
        : '';
};
var changeTask = function ($_1, id_1, said_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1, said_1], args_1, true), void 0, function ($, id, said, picked, isNow) {
        var card, at, files, _a, _b, _c, shown, earlier, words, _d, text, sent, told, _e;
        var _f;
        if (picked === void 0) { picked = []; }
        if (isNow === void 0) { isNow = false; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, read($, todos)];
                case 1:
                    card = (_g.sent()).find(function (one) { return one.id === id; });
                    if (!card || (!said && !picked.length) || card.chat || card.parentId || isHeld(card))
                        return [2 /*return*/];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    at = _g.sent();
                    _a = [[]];
                    _b = Set.bind;
                    _c = [__spreadArray([], picked, true)];
                    return [4 /*yield*/, pathsIn($, said)];
                case 3:
                    files = __spreadArray.apply(void 0, _a.concat([new (_b.apply(Set, [void 0, __spreadArray.apply(void 0, _c.concat([(_g.sent()), true]))]))(), true]));
                    shown = __spreadArray([said], picked.map(function (path) { var _a; return "\uD83D\uDCCE ".concat((_a = path.split('/').pop()) !== null && _a !== void 0 ? _a : path); }), true).filter(Boolean).join('\n');
                    earlier = card.entries.filter(function (entry) { return entry.kind === 'steer' && entry.isUnread; }).map(function (entry) { return entry.text; });
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { entries: __spreadArray(__spreadArray([], one.entries, true), [{ at: at, kind: 'steer', text: shown, isUnread: true }], false).slice(-ENTRIES_KEPT) }) : one); }); })];
                case 4:
                    _g.sent();
                    words = "".concat(said || '(no words, only the files below)').concat(filesNote(files));
                    _d = isNow && card.status === 'working';
                    if (!_d) return [3 /*break*/, 6];
                    return [4 /*yield*/, interruptStep($, card)];
                case 5:
                    _d = (_g.sent());
                    _g.label = 6;
                case 6:
                    if (!_d) return [3 /*break*/, 10];
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { entries: one.entries.map(function (entry) { return (entry.kind === 'steer' && entry.at === at ? __assign(__assign({}, entry), { isNow: true }) : entry); }) }) : one); }); })];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, toEnded($, card, id, MESSAGE_NOW(words, earlier), { text: shown, ask: CHANGE_WHAT, at: at, line: lineOf(card), isCard: true })];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, tellChat($, named(CHANGE_TOLD(titleOf(card), "\u201C".concat(cut(shown, 120), "\u201D"))))];
                case 9: return [2 /*return*/, void (_g.sent())];
                case 10:
                    text = card.status === 'working' ? MESSAGE_SENT(words) : CHANGE_ASKED(words);
                    sent = { text: shown, ask: CHANGE_WHAT, at: at, line: lineOf(card), isCard: true };
                    return [4 /*yield*/, read($, todos)];
                case 11:
                    if (!(((_f = (_g.sent()).find(function (one) { return one.id === id; })) === null || _f === void 0 ? void 0 : _f.status) === 'working')) return [3 /*break*/, 13];
                    return [4 /*yield*/, tell($, id, text)];
                case 12:
                    _e = _g.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _e = undefined;
                    _g.label = 14;
                case 14:
                    told = _e;
                    if (!(told && !told.deny)) return [3 /*break*/, 15];
                    (writtenIn($, id, id), sentReplies.set(id, __assign(__assign({}, sent), { to: 'work' })), redraw($));
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, toEnded($, card, id, text, sent)];
                case 16:
                    _g.sent();
                    _g.label = 17;
                case 17: return [4 /*yield*/, tellChat($, named(CHANGE_TOLD(titleOf(card), "\u201C".concat(cut(shown, 120), "\u201D"))))];
                case 18:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var answerNow = function ($_1, one_1, choice_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, one_1, choice_1], args_1, true), void 0, function ($, one, choice, isReply, picked, files) {
        var ask, words, said, note, target, asked, mark, line, isCleared, steerAt, at_1, err_1, isBack, _a, _b, _c, _d;
        var _e;
        var _f, _g;
        if (isReply === void 0) { isReply = false; }
        if (picked === void 0) { picked = []; }
        if (files === void 0) { files = picked; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    // Another chat's ask is answered only in that chat: no file carries an answer to it, from this Mac or another
                    if (one.chat)
                        return [2 /*return*/];
                    ask = one.ask;
                    words = choice.trim();
                    said = __spreadArray([words], picked.map(function (path) { var _a; return "\uD83D\uDCCE ".concat((_a = path.split('/').pop()) !== null && _a !== void 0 ? _a : path); }), true).filter(Boolean).join(' ');
                    note = isReply ? filesNote(files) : '';
                    if (!ask || !said)
                        return [2 /*return*/];
                    target = (_f = ask.from) !== null && _f !== void 0 ? _f : one.id;
                    if (!settles(ask, words, isReply))
                        return [2 /*return*/, holdAsk($, one, ask, said, target, note)
                            // The amber goes and the box clears at once. Only the first answer to the ask it was made for counts: a second press, or a press
                            // on an ask the work has since replaced, sends nothing. Marked before anything is awaited, so two presses at once count once
                        ];
                    asked = "".concat(one.id, ":").concat(ask.at, ":").concat(ask.text);
                    if (answeredAsks.has(asked))
                        return [2 /*return*/];
                    answeredAsks.add(asked);
                    mark = "".concat(ask.at, ":").concat(ask.text);
                    askPressed.set(one.id, mark);
                    // Its reply box in the bar goes with the answer, and is closed when the same work asks again
                    if (isBarOpen('answer', one.id))
                        closeBarOf(one.id);
                    line = lineOf(one);
                    sentReplies.set(one.id, __assign(__assign({ text: said, ask: ask.text }, (ask.details ? { details: ask.details } : {})), { to: 'sending', at: Infinity, line: line, isCard: true, askAt: ask.at }));
                    if (isReply)
                        freeTimes($);
                    redraw($);
                    isCleared = false;
                    steerAt = 0;
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 5, , 9]);
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    at_1 = _h.sent();
                    steerAt = at_1;
                    // Set afresh on each run of the change, as it runs again on a list written meanwhile
                    return [4 /*yield*/, changeTodos($, function (list) {
                            return ((isCleared = false), list).map(function (card) { var _a; return (card.id === one.id && ((_a = card.ask) === null || _a === void 0 ? void 0 : _a.at) === ask.at && card.ask.text === ask.text ? ((isCleared = true), __assign(__assign({}, card), { ask: undefined, entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at_1, kind: 'steer', text: isReply ? said : "".concat(said, " \u2014 to: ").concat(ask.text) }], false).slice(-ENTRIES_KEPT) })) : card); });
                        })];
                case 3:
                    // Set afresh on each run of the change, as it runs again on a list written meanwhile
                    _h.sent();
                    if (askPressed.get(one.id) === mark)
                        askPressed.delete(one.id);
                    // The work has since asked something else, or it was answered elsewhere: nothing went, and the card shows what it carries now
                    if (!isCleared)
                        return [2 /*return*/, void (((_g = sentReplies.get(one.id)) === null || _g === void 0 ? void 0 : _g.to) === 'sending' && sentReplies.delete(one.id), redraw($))];
                    return [4 /*yield*/, answerCleared($, one, ask, said, isReply, target, at_1, line, note)];
                case 4:
                    _h.sent();
                    return [3 /*break*/, 9];
                case 5:
                    err_1 = _h.sent();
                    // It did not reach the work: the card says so, and its buttons come back to be pressed again, with nothing of the answer left
                    if (askPressed.get(one.id) === mark)
                        askPressed.delete(one.id);
                    answeredAsks.delete(asked);
                    if (answeredAt.get(one.id) === ask.at)
                        answeredAt.delete(one.id);
                    if (pending.get(target) === one.id)
                        pending.delete(target);
                    _a = !isCleared;
                    if (_a) return [3 /*break*/, 7];
                    return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === one.id && !card.ask ? __assign(__assign({}, card), { ask: ask, entries: card.entries.filter(function (entry) { return !(entry.kind === 'steer' && entry.at === steerAt); }) }) : card); }); }).then(function () { return true; }).catch(function () { return false; })];
                case 6:
                    _a = (_h.sent());
                    _h.label = 7;
                case 7:
                    isBack = _a;
                    _c = (_b = sentReplies).set;
                    _d = [one.id];
                    _e = { text: said, ask: ask.text, to: 'failed' };
                    return [4 /*yield*/, $.clock.now().catch(function () { return 0; })];
                case 8:
                    _c.apply(_b, _d.concat([(_e.at = _h.sent(), _e.line = line, _e.isCard = true, _e.askAt = ask.at, _e)]));
                    // and when even that could not be written, the chat is told, so the ask is not lost unseen
                    if (!isBack)
                        $.ui.log("Your answer \u201C".concat(cut(said, 120), "\u201D to \"").concat(titleOf(one), "\" didn't reach its task, and the question couldn't be put back on its card. Type your answer in this chat instead. The question: ").concat(ask.text));
                    redraw($);
                    throw err_1;
                case 9: return [2 /*return*/];
            }
        });
    });
};
// The rest of an answer once its ask is cleared from the card's file: written into its task at a step, or sent to it paused
var answerCleared = function ($_1, one_1, ask_1, said_1, isReply_1, target_1, at_2, line_1) {
    var args_1 = [];
    for (var _i = 8; _i < arguments.length; _i++) {
        args_1[_i - 8] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, one_1, ask_1, said_1, isReply_1, target_1, at_2, line_1], args_1, true), void 0, function ($, one, ask, said, isReply, target, at, line, note) {
        var isRelease, _a, run, isRun, back, sent, to, _b, _c, working, told, _d;
        var _e, _f, _g, _h, _j, _k;
        if (note === void 0) { note = ''; }
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    answeredAt.set(one.id, ask.at);
                    dropDrafts($, one.id);
                    replies.set(one.id, ((_e = replies.get(one.id)) !== null && _e !== void 0 ? _e : 0) + 1);
                    _a = !isReply && !ask.refused && Boolean(ask.release) && ((_f = ask.choices) === null || _f === void 0 ? void 0 : _f[0]) === said;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, allowRelease($, one.id, (_g = ask.release) !== null && _g !== void 0 ? _g : '').catch(function (err) { return (void log($, "release not allowed by the press: ".concat(String(err))), false); })];
                case 1:
                    _a = (_l.sent());
                    _l.label = 2;
                case 2:
                    isRelease = _a;
                    run = ask.refused && !isReply && said === ALLOW ? runAsked.get(one.id) : undefined;
                    isRun = Boolean(run && run.askAt === ask.at && run.command === ask.copy);
                    back = isReply || isRelease || ask.refused ? {} : { asked: ask, target: target };
                    sent = __assign(__assign(__assign(__assign({ text: said, ask: ask.text }, (ask.details ? { details: ask.details } : {})), { at: at, line: line, isCard: true, askAt: ask.at }), (ask.refused && !isReply ? { isPress: true } : {})), back);
                    sentReplies.set(one.id, __assign(__assign({}, sent), { to: 'sending' }));
                    redraw($);
                    // The card says the answer for ANSWER_SHOWN, and no more after
                    $.clock.after(ANSWER_SHOWN + 50, function () { return drawAgain($); });
                    if (!ask.refused) return [3 /*break*/, 6];
                    if (!(isRun && run)) return [3 /*break*/, 4];
                    return [4 /*yield*/, startRun($, one, run)];
                case 3:
                    _c = _l.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = "".concat(REFUSAL_ANSWERED((_h = ask.copy) !== null && _h !== void 0 ? _h : ask.text, said, isReply)).concat(note);
                    _l.label = 5;
                case 5:
                    _b = _c;
                    return [3 /*break*/, 7];
                case 6:
                    _b = isReply
                        ? "".concat(who(true), " replied to your question (\"").concat(ask.text, "\"), in their own words: ").concat(said).concat(note)
                        : "".concat(who(true), " pressed \"").concat(said, "\" in answer to your question: ").concat(ask.text).concat(isRelease ? "\n".concat(RELEASE_PRESSED((_j = ask.release) !== null && _j !== void 0 ? _j : '')) : '');
                    _l.label = 7;
                case 7:
                    to = _b;
                    return [4 /*yield*/, read($, todos)];
                case 8:
                    working = ((_k = (_l.sent()).find(function (card) { return card.id === one.id; })) === null || _k === void 0 ? void 0 : _k.status) === 'working';
                    if (!working) return [3 /*break*/, 10];
                    return [4 /*yield*/, tell($, target, to)];
                case 9:
                    _d = _l.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _d = undefined;
                    _l.label = 11;
                case 11:
                    told = _d;
                    // A press on a blocked command starts no task again and is never sent twice: a task at a step reads it there, and one that has
                    // ended hears what the command printed when it ends (runit.tsx), or nothing of a command that was not run
                    if (ask.refused && !isReply) {
                        if (told && !told.deny)
                            writtenIn($, target, one.id);
                        else
                            void log($, "".concat(said, " on a blocked command of ").concat(target, ", which is not at a step: it is not started again for it"));
                        sentReplies.set(one.id, __assign(__assign({}, sent), { to: 'pressed' }));
                        redraw($);
                        return [2 /*return*/, void askGone($, one, said)];
                    }
                    if (!(told && !told.deny)) return [3 /*break*/, 12];
                    writtenIn($, target, one.id);
                    sentReplies.set(one.id, __assign(__assign({}, sent), { to: 'work' }));
                    redraw($);
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, toEnded($, one, target, "".concat(to, "\n").concat(RESUMED_BY_ANSWER), sent)
                    // Said in the chat only once the answer is on its way
                ];
                case 13:
                    _l.sent();
                    _l.label = 14;
                case 14:
                    // Said in the chat only once the answer is on its way
                    void askGone($, one, said);
                    return [2 /*return*/];
            }
        });
    });
};
// What a task is told with the press on its go-ahead for a release: the press allows its release run, which it does itself
var RELEASE_PRESSED = function (folder) {
    return "That press is the permission for the release: your next run of the release runner for ".concat(folder, " goes through once, within the hour, with nothing more asked. Run it now as your rules say, in your background, say on your card what you are releasing, and hand in your result once it has finished.");
};
// A button's answer can be taken back while the card says it (heldAnswer, ANSWER_SHOWN), unless the work has asked again since: a press
// meant for something else lands on an answer (16 Nov: "Not now" pressed while reaching for the picture above it, as the panel
// jumped). The ask is put back on the card with its buttons, to be answered again, and the work is told not to act on the answer:
// written in while it runs, dropped from a message still waiting to start it again, and nothing when it has since ended (its
// card then waits on the person again). A permission, and the go-ahead for a release, have no way back
var canTakeBack = function (one, now) {
    var sent = heldAnswer(one, now);
    // Only while the card still says it (sentLine), never for an answer left in the chat, whose model has it already
    return Boolean((sent === null || sent === void 0 ? void 0 : sent.asked) && !sent.isHeld && !['pressed', 'sending', 'chat'].includes(sent.to) && !one.ask && !one.chat && sentLine(one, now));
};
// (at: the answer the button was drawn for: a click on a drawing held from before takes back nothing newer)
var takeBack = function ($, one, at) {
    var run = takeBackNow($, one, at);
    // The press hook sends what waits only once this is done (sendWakes), so the answer taken back is never sent
    answersOnWay.add(run);
    void run.finally(function () { return answersOnWay.delete(run); }).catch(function () { return undefined; });
    return run;
};
var takeBackNow = function ($, one, shownAt) { return __awaiter(_this, void 0, void 0, function () {
    var sent, ask, target, now, _a, _b, _c, waiting, _i, startedBy_1, key, at, isBack;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                sent = sentReplies.get(one.id);
                ask = sent === null || sent === void 0 ? void 0 : sent.asked;
                if (!sent || !ask || sent.at !== shownAt)
                    return [2 /*return*/];
                target = (_d = sent.target) !== null && _d !== void 0 ? _d : one.id;
                return [4 /*yield*/, read($, todos)];
            case 1:
                now = (_e.sent()).find(function (card) { return card.id === one.id; });
                _a = !now || sentReplies.get(one.id) !== sent;
                if (_a) return [3 /*break*/, 3];
                _b = canTakeBack;
                _c = [now];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                _a = !_b.apply(void 0, _c.concat([_e.sent()]));
                _e.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/];
                waiting = wakes.find(function (w) { return w.target === target && w.answers.some(function (a) { return a.one.id === one.id && a.sent.at === sent.at; }); });
                if (waiting) {
                    waiting.answers = waiting.answers.filter(function (a) { return !(a.one.id === one.id && a.sent.at === sent.at); });
                    if (!waiting.answers.length)
                        wakes.splice(wakes.indexOf(waiting), 1);
                    else
                        waiting.text = "".concat(waiting.text, "\n\n").concat(TAKEN_BACK(sent.text, ask.text));
                }
                sentReplies.delete(one.id);
                answeredAsks.delete("".concat(one.id, ":").concat(ask.at, ":").concat(ask.text));
                if (answeredAt.get(one.id) === ask.at)
                    answeredAt.delete(one.id);
                if (pending.get(target) === one.id)
                    pending.delete(target);
                for (_i = 0, startedBy_1 = startedBy; _i < startedBy_1.length; _i++) {
                    key = startedBy_1[_i];
                    if (key === "".concat(one.id, ":").concat(sent.at))
                        startedBy.delete(key);
                }
                return [4 /*yield*/, $.clock.now()];
            case 4:
                at = _e.sent();
                isBack = false;
                return [4 /*yield*/, changeTodos($, function (list) { return ((isBack = false), list).map(function (card) { return (card.id === one.id && !card.ask ? ((isBack = true), __assign(__assign({}, card), { ask: ask, entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'steer', text: "took back \u201C".concat(sent.text, "\u201D") }], false).slice(-ENTRIES_KEPT) })) : card); }); })];
            case 5:
                _e.sent();
                redraw($);
                void log($, "answer \"".concat(cut(sent.text, 40), "\" for ").concat(one.id, " taken back"));
                if (!isBack) return [3 /*break*/, 7];
                return [4 /*yield*/, tellChat($, named("".concat(who(true), " took back their answer \u201C").concat(cut(sent.text, 120), "\u201D to \"").concat(titleOf(one), "\": the question is open again on its card.")))];
            case 6:
                _e.sent();
                inChat.delete(one.id);
                void askInChat($, __assign(__assign({}, one), { ask: ask }));
                _e.label = 7;
            case 7:
                if (!!waiting) return [3 /*break*/, 9];
                return [4 /*yield*/, tell($, target, TAKEN_BACK(sent.text, ask.text)).catch(function (err) { return log($, "work not told of an answer taken back: ".concat(String(err))); })];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
var TAKEN_BACK = function (said, asked) {
    return "".concat(who(true), " took back their answer \"").concat(said, "\" to your question (\"").concat(asked, "\"): it was pressed by mistake. Do not act on it, and undo what you already did on it if you can. The question is on your card again, and their answer comes to you as a message.");
};
// A reply in the person's own words that does not settle the ask: the ask stays on the card, its question with the reply under it,
// and the work is told so; its card stays among the running cards while the work acts on it. The person has answered, so its
// buttons and box go at once, and come back only when the work asks again, or ends with the ask still open
var holdAsk = function ($_1, one_1, ask_1, said_1, target_1) {
    var args_1 = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        args_1[_i - 5] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, one_1, ask_1, said_1, target_1], args_1, true), void 0, function ($, one, ask, said, target, note) {
        var key, at, isHeld, listed, isWaking, line, working, to, told, _a;
        var _b, _c, _d, _e, _f, _g, _h;
        if (note === void 0) { note = ''; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    key = "".concat(one.id, ":").concat(ask.at, ":").concat(ask.text, ":reply:").concat((_c = (_b = ask.replied) === null || _b === void 0 ? void 0 : _b.at) !== null && _c !== void 0 ? _c : '', ":").concat(said);
                    if (answeredAsks.has(key))
                        return [2 /*return*/];
                    answeredAsks.add(key);
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    at = _j.sent();
                    isHeld = false;
                    return [4 /*yield*/, read($, todos)];
                case 2:
                    listed = _j.sent();
                    isWaking = ((_d = listed.find(function (card) { return card.id === one.id; })) === null || _d === void 0 ? void 0 : _d.status) !== 'working' && ((_e = listed.find(function (card) { return card.id === target; })) === null || _e === void 0 ? void 0 : _e.status) !== 'working';
                    return [4 /*yield*/, changeTodos($, function (list) {
                            return ((isHeld = false), list).map(function (card) { var _a, _b; return (card.id === one.id && ((_a = card.ask) === null || _a === void 0 ? void 0 : _a.at) === ask.at && card.ask.text === ask.text ? ((isHeld = true), __assign(__assign({}, card), { ask: __assign(__assign(__assign({}, card.ask), { replied: __assign({ text: said, at: at }, (isWaking ? { isWaking: isWaking } : {})) }), (card.ask.refused ? { talk: __spreadArray(__spreadArray([], ((_b = card.ask.talk) !== null && _b !== void 0 ? _b : []), true), [{ by: 'you', text: cut(said, ASK_DETAILS) }], false).slice(-PERMIT_TALK_KEPT) } : {})), entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'steer', text: said }], false).slice(-ENTRIES_KEPT) })) : card); });
                        })];
                case 3:
                    _j.sent();
                    if (!isHeld)
                        return [2 /*return*/];
                    // The box goes with the buttons, as after a press; what was typed in it is not kept for the next ask
                    dropDrafts($, one.id);
                    // A new box, empty, whenever it comes back: the surface keeps what was typed in a box it finds again by its key
                    replies.set(one.id, ((_f = replies.get(one.id)) !== null && _f !== void 0 ? _f : 0) + 1);
                    freeTimes($);
                    line = lineOf(one);
                    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at: at, line: line, isCard: true, askAt: ask.at });
                    redraw($);
                    // The card says the answer for ANSWER_SHOWN, and no more after
                    $.clock.after(ANSWER_SHOWN + 50, function () { return drawAgain($); });
                    // Said in the chat once; the ask is then done with there, so the work asking again is sent to the chat afresh
                    if (inChat.has(one.id))
                        (inChat.delete(one.id), void tellChat($, named(ASK_REPLIED(titleOf(one), "\u201C".concat(cut(said, 120), "\u201D")))));
                    return [4 /*yield*/, read($, todos)];
                case 4:
                    working = ((_g = (_j.sent()).find(function (card) { return card.id === target; })) === null || _g === void 0 ? void 0 : _g.status) === 'working';
                    to = ask.refused ? "".concat(REFUSAL_WORDS((_h = ask.copy) !== null && _h !== void 0 ? _h : ask.text, said)).concat(note) : "".concat(who(true), " replied to your question (\"").concat(ask.text, "\"), in their own words: ").concat(said).concat(note, "\n").concat(named(REPLY_HOLDS));
                    if (!working) return [3 /*break*/, 6];
                    return [4 /*yield*/, tell($, target, to)];
                case 5:
                    _a = _j.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = undefined;
                    _j.label = 7;
                case 7:
                    told = _a;
                    if (told && !told.deny)
                        return [2 /*return*/, void (writtenIn($, target, one.id), redraw($))];
                    return [4 /*yield*/, toEnded($, one, target, "".concat(to, "\n").concat(RESUMED_BY_ANSWER), { text: said, ask: ask.text, at: at, line: line, isCard: true, askAt: ask.at })];
                case 8:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// An answer to a task that is not at a step (paused, or ended) goes to it as a message, which starts it with it: the chat then
// gets the task's result as it gets any, and nothing goes into the chat in the person's place.
// The engine runs what a mod sends from outside its hooks (a timer, a button's own handler) under the mod's own origin, and a task
// started that way runs with every hook of the mod skipped: each of its panel tools answered "no tool.call hook answered", and its
// question never reached the card. So an answer travels one way: it waits here only until the hook of the press or the submit that
// gave it, which waits for it and sends it from inside itself (sendWakes, tabs.tsx), and one given inside a hook already goes at
// once. Nothing sends one from a timer. One a copy a reload replaced still holds goes to the chat instead: a notice the person
// sees and a row its model reads, with no turn of its own
// Each message carries every answer joined into it, so each card's line and the chat's notice are settled for every one
var wakes = [];
var toEnded = function ($, one, target, text, sent) { return __awaiter(_this, void 0, void 0, function () {
    var same;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Marked on its way before it is sent, so a run that starts before the send resolves counts as reading it
                pending.set(target, one.id);
                // A reply that holds its ask is acted on from now: no answers on the card while its work is started again with it
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { var _a, _b; return (card.id === one.id && ((_b = (_a = card.ask) === null || _a === void 0 ? void 0 : _a.replied) === null || _b === void 0 ? void 0 : _b.text) === sent.text && !card.ask.replied.isWaking && card.status !== 'working' ? __assign(__assign({}, card), { ask: __assign(__assign({}, card.ask), { replied: __assign(__assign({}, card.ask.replied), { isWaking: true }) }) }) : card); }); })];
            case 1:
                // A reply that holds its ask is acted on from now: no answers on the card while its work is started again with it
                _a.sent();
                sentReplies.set(one.id, __assign(__assign({}, sent), { to: 'work' }));
                redraw($);
                same = wakes.find(function (w) { return w.target === target; });
                if (same)
                    ((same.text = "".concat(same.text, "\n\n").concat(text)), same.answers.push({ one: one, sent: sent }));
                else
                    wakes.push({ target: target, text: text, answers: [{ one: one, sent: sent }] });
                return [4 /*yield*/, isInHook($)];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, sendWakes($)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// Sends what waits, from inside the hook that calls it; a press's or a reply's hook first waits for the answer it started
var sendWakes = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, isAnswering) {
        var wake;
        if (isAnswering === void 0) { isAnswering = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(isAnswering && answersOnWay.size)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.allSettled(__spreadArray([], answersOnWay, true))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!wakes.length) return [3 /*break*/, 5];
                    wake = wakes.shift();
                    if (!wake) return [3 /*break*/, 4];
                    return [4 /*yield*/, sendWake($, wake)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
};
var sendWake = function ($, wake) { return __awaiter(_this, void 0, void 0, function () {
    var _a, r, _b, _i, _c, _d, one, sent;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = isHeld;
                return [4 /*yield*/, read($, todos)];
            case 1:
                if (!_a.apply(void 0, [(_e.sent()).find(function (one) { return one.id === wake.target; })])) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "task ".concat(wake.target, " not started with an answer: the person stopped it"))];
            case 2: return [2 /*return*/, void (_e.sent())];
            case 3: return [4 /*yield*/, isReplaced($)];
            case 4:
                if (!(_e.sent())) return [3 /*break*/, 5];
                _b = { isDelivered: false, reason: 'this copy of the mod was replaced by a reload' };
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, sendOwn($, { to: { agentId: wake.target }, text: wake.text }).catch(function (err) { return ({ isDelivered: false, reason: String(err) }); })];
            case 6:
                _b = _e.sent();
                _e.label = 7;
            case 7:
                r = _b;
                if (!!r.isDelivered) return [3 /*break*/, 9];
                return [4 /*yield*/, wakeFailed($, wake, r.reason)];
            case 8: return [2 /*return*/, void (_e.sent())
                // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
            ];
            case 9: 
            // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
            return [4 /*yield*/, wakeCard($, wake.target)
                // Started by the message, the task reads it in the run it starts: that run's end never sends it a second time
            ];
            case 10:
                // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
                _e.sent();
                // Started by the message, the task reads it in the run it starts: that run's end never sends it a second time
                for (_i = 0, _c = wake.answers; _i < _c.length; _i++) {
                    _d = _c[_i], one = _d.one, sent = _d.sent;
                    startedBy.add("".concat(one.id, ":").concat(sent.at));
                }
                return [2 /*return*/];
        }
    });
}); };
// The answers, by card and when given, that started their work again: the run each started reads it
var startedBy = new Set();
// An answer written into work under way, which reads it at a step of its own: an earlier wake's run no longer covers this card
var writtenIn = function ($, target, card) {
    pending.set(target, card);
    for (var _i = 0, startedBy_2 = startedBy; _i < startedBy_2.length; _i++) {
        var key = startedBy_2[_i];
        if (key.startsWith("".concat(card, ":")))
            startedBy.delete(key);
    }
};
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
var wakeCard = function ($, target) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id !== target || card.status === 'working' ? card : resumed(card, now)); }); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var wakeFailed = function ($_1, _a, reason_1) { return __awaiter(_this, [$_1, _a, reason_1], void 0, function ($, _b, reason) {
    var ids, _i, answers_1, _c, one, sent, said_1;
    var target = _b.target, answers = _b.answers;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (answers.some(function (_a) {
                    var one = _a.one;
                    return pending.get(target) === one.id;
                }))
                    pending.delete(target);
                return [4 /*yield*/, log($, "work ".concat(target, " not started again with an answer: ").concat(reason))
                    // An ask its reply held waits on the person again, every answer back
                ];
            case 1:
                _d.sent();
                ids = new Set(answers.map(function (_a) {
                    var one = _a.one;
                    return one.id;
                }));
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { var _a, _b; return (ids.has(card.id) && ((_b = (_a = card.ask) === null || _a === void 0 ? void 0 : _a.replied) === null || _b === void 0 ? void 0 : _b.isWaking) ? __assign(__assign({}, card), { ask: __assign(__assign({}, card.ask), { replied: { text: card.ask.replied.text, at: card.ask.replied.at } }) }) : card); }); })];
            case 2:
                _d.sent();
                _i = 0, answers_1 = answers;
                _d.label = 3;
            case 3:
                if (!(_i < answers_1.length)) return [3 /*break*/, 6];
                _c = answers_1[_i], one = _c.one, sent = _c.sent;
                sentReplies.set(one.id, __assign(__assign({}, sent), { to: 'chat' }));
                said_1 = named(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text));
                $.ui.log(ANSWER_FOR_CHAT(titleOf(one), sent.ask, sent.text, true));
                return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: "".concat(said_1, "\n").concat(named(ANSWER_FOR_CHAT_RELAY)) }] } }).catch(function (err) { return log($, "chat not told of an answer: ".concat(String(err))); })];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// Every ask of this chat's work is also sent into the chat, as a message from the mod, with its answers and pictures: the chat
// shows it to the person, and an answer they type there goes to the work as a press on the card does. Kept by card, so an ask
// answered or withdrawn on the card is said in the chat too, and the same ask is never sent twice
var inChat = new Map();
var askKey = function (ask) { var _a, _b, _c, _d; return JSON.stringify([ask.text, (_a = ask.details) !== null && _a !== void 0 ? _a : '', (_b = ask.choices) !== null && _b !== void 0 ? _b : [], (_c = ask.pictures) !== null && _c !== void 0 ? _c : [], (_d = ask.copy) !== null && _d !== void 0 ? _d : '']); };
var askInChat = function ($, one) { return __awaiter(_this, void 0, void 0, function () {
    var ask, answers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ask = one.ask;
                if (!ask || isOff || !dir || inChat.get(one.id) === askKey(ask))
                    return [2 /*return*/];
                inChat.set(one.id, askKey(ask));
                answers = (_a = ask.choices) !== null && _a !== void 0 ? _a : [];
                // The person sees the ask on its card, and is told by the panel's notification; the chat's model reads it in a row of its own,
                // with how to pass an answer on, which starts no turn and shows nothing in the chat
                return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(function (err) { return (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, "chat not told of an ask: ".concat(String(err)))); })];
            case 1:
                // The person sees the ask on its card, and is told by the panel's notification; the chat's model reads it in a row of its own,
                // with how to pass an answer on, which starts no turn and shows nothing in the chat
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// A row only the chat's model reads, with no turn of its own: what a task's card already shows the person, such as an answer they
// gave there themselves. Nothing of a task's shows in the chat but what the chat itself writes (17 Nov: "✓ You replied to … on its
// card" was among the updates they called pointless; 18 Nov: "What are all of these fucking shits within the chat?"), and the chat
// says it in its next reply only where it matters to what the person asks
var tellChat = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: text }] } }).catch(function (err) { return log($, "chat not told: ".concat(String(err))); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The ask sent into the chat is gone from the card: answered there, or withdrawn by the work
var askGone = function ($, one, said) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!inChat.has(one.id))
                    return [2 /*return*/];
                inChat.delete(one.id);
                // What the person did on the card themselves, or a question the work withdrew, is no news to them: only the chat's model is told
                return [4 /*yield*/, tellChat($, said === undefined ? ASK_CLEARED(titleOf(one)) : named(ASK_ANSWERED(titleOf(one), "\u201C".concat(cut(said, 120), "\u201D"))))];
            case 1:
                // What the person did on the card themselves, or a question the work withdrew, is no news to them: only the chat's model is told
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The person's answer typed in the chat, passed on by the chat to the work: once on its way the card stops asking and says what was
// answered, and a helper that asked is told too when the chat sent it to the work it helps; refused, the ask stays to be answered
var answeredInChat = function ($, a, to, isSent) { return __awaiter(_this, void 0, void 0, function () {
    var isHeld, helper, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!isSent)
                    return [2 /*return*/, void answeredAsks.delete(a.key)
                        // Words that do not settle an ask with buttons of its own leave it open, as a reply on the card does; a later answer still counts
                    ];
                isHeld = !settles(a.ask, a.words, true);
                // Either way the ask is done with in the chat: the work asking again is sent to it afresh
                if (isHeld)
                    answeredAsks.delete(a.key);
                inChat.delete(a.card.id);
                return [4 /*yield*/, changeTodos($, function (all) { return all.map(function (one) { var _a; return (one.id === a.card.id && ((_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) === a.ask.at && one.ask.text === a.ask.text ? __assign(__assign({}, one), { ask: isHeld ? __assign(__assign({}, one.ask), { replied: __assign({ text: a.words, at: a.at }, (one.status === 'working' ? {} : { isWaking: true })) }) : undefined }) : one); }); })];
            case 1:
                _b.sent();
                dropDrafts($, a.card.id);
                sentReplies.set(a.card.id, { text: a.words, ask: a.ask.text, to: 'work', at: a.at, line: lineOf(a.card) });
                writtenIn($, to, a.card.id);
                if (!(a.ask.from && a.ask.from !== to)) return [3 /*break*/, 3];
                return [4 /*yield*/, read($, todos)];
            case 2:
                _a = (_b.sent()).find(function (one) { return one.id === a.ask.from && one.status === 'working'; });
                return [3 /*break*/, 4];
            case 3:
                _a = undefined;
                _b.label = 4;
            case 4:
                helper = _a;
                if (!helper) return [3 /*break*/, 6];
                return [4 /*yield*/, tell($, helper.id, "".concat(who(true), " answered your question (\"").concat(a.ask.text, "\") in the chat, in their own words: ").concat(a.words))];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// A reply in words left by another chat for work whose ask is already answered: to the work while it runs, else to the chat
var replyAfter = function ($, one, said, asked) { return __awaiter(_this, void 0, void 0, function () {
    var told, _a, at;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(one.status === 'working')) return [3 /*break*/, 2];
                return [4 /*yield*/, tell($, one.id, "".concat(who(true), " added, in their own words, to their answer to your question (\"").concat(asked, "\"): ").concat(said))];
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
                return [4 /*yield*/, $.clock.now()];
            case 4:
                at = _b.sent();
                return [4 /*yield*/, toEnded($, one, one.id, "".concat(who(true), " added, in their own words, to their answer to your ask (\"").concat(asked, "\"): ").concat(said, "\n").concat(RESUMED_BY_ANSWER), { text: said, ask: asked, at: at, line: lineOf(one) })];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
// The work an answer was written into starts its next step: that step reads it. What a command the person allowed printed, kept
// for this step, is written in now (runsAtStep)
var replyRead = function ($, agentId) {
    if (runList.some(function (run) { var _a; return ((_a = run.waiting) === null || _a === void 0 ? void 0 : _a.target) === agentId; }))
        void runsAtStep($, agentId).catch(function (err) { return log($, "output of a command not passed on: ".concat(String(err))); });
    var card = pending.get(agentId);
    if (card === undefined)
        return;
    pending.delete(agentId);
    var sent = sentReplies.get(card);
    if ((sent === null || sent === void 0 ? void 0 : sent.to) === 'work')
        (sentReplies.set(card, __assign(__assign({}, sent), { to: 'read' })), redraw($));
};
// The person's messages to a task that a model step of it now holds are read from then: each one sent before the step began
var markRead = function ($, agentId) { return __awaiter(_this, void 0, void 0, function () {
    var now, readNow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                if (!(_a.sent()).some(function (one) { return one.id === agentId && one.entries.some(function (entry) { return entry.isUnread; }); }))
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _a.sent();
                readNow = function (entry) {
                    if (!entry.isUnread || entry.at > now)
                        return entry;
                    var _ = entry.isUnread, rest = __rest(entry, ["isUnread"]);
                    return __assign(__assign({}, rest), { readAt: now });
                };
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === agentId ? __assign(__assign({}, one), { entries: one.entries.map(readNow) }) : one); }); })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Work whose run ended with an answer written in but never read is started again with it
var replyUnread = function ($, agentId) { return __awaiter(_this, void 0, void 0, function () {
    var card, sent, one, isHeld;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                card = pending.get(agentId);
                if (card === undefined || wakes.some(function (w) { return w.target === agentId; }))
                    return [2 /*return*/];
                pending.delete(agentId);
                sent = sentReplies.get(card);
                // The run that ends was started by the answer itself: it read it
                if (sent && startedBy.delete("".concat(card, ":").concat(sent.at)))
                    return [2 /*return*/, void (sent.to === 'work' && (sentReplies.set(card, __assign(__assign({}, sent), { to: 'read' })), redraw($)))];
                return [4 /*yield*/, read($, todos)];
            case 1:
                one = (_c.sent()).find(function (todo) { return todo.id === card; });
                if ((sent === null || sent === void 0 ? void 0 : sent.to) !== 'work' || !one)
                    return [2 /*return*/];
                isHeld = ((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied) === null || _b === void 0 ? void 0 : _b.text) === sent.text;
                return [4 /*yield*/, toEnded($, one, agentId, "".concat(who(true), " ").concat(isHeld ? 'replied to' : 'answered', " your question (\"").concat(sent.ask, "\"), and you ended before reading it: ").concat(sent.text).concat(isHeld ? "\n".concat(named(REPLY_HOLDS)) : '', "\n").concat(RESUMED_BY_ANSWER), sent)];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// An answer or a press given on the card in the last ANSWER_SHOWN: the card says it
var heldAnswer = function (one, now) {
    var sent = one.chat ? undefined : sentReplies.get(one.id);
    return (sent === null || sent === void 0 ? void 0 : sent.isCard) && sent.to !== 'lost' && now - sent.at < ANSWER_SHOWN ? sent : undefined;
};
// The one grey line a card says of what the person last pressed or answered on it, for ANSWER_SHOWN after: what was pressed, and
// nothing of who reads it. A reply that left its question open says so under it; an answer that could not be sent says so too
// A reply that holds its ask is said for as long as the card carries it, as it stands in place of the question there. `most`: how
// many of the person's letters it gives (Details gives them all)
var sentLine = function (one, now, most) {
    var _a, _b, _c, _d, _e;
    if (most === void 0) { most = 60; }
    var sent = sentReplies.get(one.id);
    // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
    var replied = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied;
    var heldLine = replied ? "\u2713 You answered \u201C".concat(cut(replied.text, most), "\u201D").concat(isActingOnReply(one) ? '' : ' · the question is still open') : '';
    if (replied && !(sent && sent.ask === ((_b = one.ask) === null || _b === void 0 ? void 0 : _b.text) && (sent.text === replied.text || sent.isHeld)))
        return heldLine;
    if (!sent)
        return '';
    if (sent.to === 'failed')
        return ((_c = one.ask) === null || _c === void 0 ? void 0 : _c.text) === sent.ask ? "Couldn't send \u201C".concat(cut(sent.text, most), "\u201D \u00B7 press it again") : '';
    if (sent.to === 'lost')
        return ((_d = one.ask) === null || _d === void 0 ? void 0 : _d.text) === sent.ask ? "Couldn't reach that Mac with \u201C".concat(cut(sent.text, most), "\u201D \u00B7 answer in its own chat") : '';
    // A message to the task says whether the task has read it: as long as it has not, while it works, with how long the step it waits
    // behind has run; once read, for ANSWER_SHOWN after
    var message = sent.ask === CHANGE_WHAT && !one.ask ? one.entries.findLast(function (entry) { return entry.kind === 'steer' && entry.at === sent.at && entry.text === sent.text; }) : undefined;
    if ((message === null || message === void 0 ? void 0 : message.isUnread) && one.status === 'working')
        return "\u2713 You wrote \u201C".concat(cut(sent.text, most), "\u201D \u00B7 not read yet").concat(one.running ? " \u00B7 its step has run ".concat(took(now - one.running.at)) : '');
    if ((message === null || message === void 0 ? void 0 : message.readAt) && now - message.readAt < ANSWER_SHOWN)
        return "\u2713 You wrote \u201C".concat(cut(sent.text, most), "\u201D \u00B7 read");
    if (now - sent.at > ANSWER_SHOWN)
        return heldLine;
    if (sent.to === 'pressed')
        return "\u2713 ".concat(sent.whole || "You pressed \u201C".concat(sent.text, "\u201D")).concat(sent.said ? " \u00B7 ".concat(sent.said) : '');
    var isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || ((_e = one.ask.replied) === null || _e === void 0 ? void 0 : _e.text) === sent.text));
    if (one.ask && !isHeld)
        return '';
    if (sent.to === 'chat')
        return "\u2713 You answered \u201C".concat(cut(sent.text, most), "\u201D \u00B7 it couldn't reach the task, so it goes with your next message");
    if (sent.isPress)
        return "\u2713 You pressed \u201C".concat(cut(sent.text, most), "\u201D");
    return "\u2713 You ".concat(sent.ask === CHANGE_WHAT ? 'wrote' : 'answered', " \u201C").concat(cut(sent.text, most), "\u201D").concat(isHeld && !isActingOnReply(one) ? ' · the question is still open' : '');
};
// What was pressed on a block, said in one grey line where the block was: on its task's card (sentLine), or at the top of the
// panel for a block that belonged to no task (loosePressed). Drawn from the press itself, before anything is awaited
var loosePressed = [];
var pressedLine = function ($, card, label, said, whole) {
    if (said === void 0) { said = ''; }
    if (whole === void 0) { whole = ''; }
    var sent = __assign(__assign({ text: label, ask: '', to: 'pressed', at: Infinity, isCard: true }, (said ? { said: said } : {})), (whole ? { whole: whole } : {}));
    var loose = { text: "\u2713 ".concat(whole || "You pressed \u201C".concat(label, "\u201D")).concat(said ? " \u00B7 ".concat(said) : ''), at: Infinity };
    if (card)
        sentReplies.set(card, sent);
    else
        loosePressed = __spreadArray(__spreadArray([], loosePressed, true), [loose], false).slice(-4);
    redraw($);
    void $.clock
        .now()
        .then(function (at) {
        if (card && sentReplies.get(card) === sent)
            sentReplies.set(card, __assign(__assign({}, sent), { at: at }));
        loosePressed = loosePressed.map(function (one) { return (one === loose ? __assign(__assign({}, one), { at: at }) : one); }).filter(function (one) { return at - one.at < ANSWER_SHOWN; });
        // Drawn again as its time ends, so it goes with nothing else to redraw the panel
        $.clock.after(ANSWER_SHOWN + 50, function () { return drawAgain($); });
    })
        .catch(function () { return undefined; });
};
var loosePressedShown = function (now) { return loosePressed.filter(function (one) { return now - one.at < ANSWER_SHOWN; }); };
