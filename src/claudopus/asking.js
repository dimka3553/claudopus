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
// While the person types into a reply box or a key box the panel and every Details tab hold their drawing whole. The app builds a
// pane afresh at each drawing, the box in it too: a pane drawn every few seconds under the person's typing flickered the box's ring,
// put older letters over newer ones, and, as Markdown came or went above, threw the panel to its bottom, out of the person's reach
// (15 Nov, typing an answer while other work ran; measured on the app's own drawing, headless). Each letter typed, or the box taking
// the focus, holds it for TYPING more; sending, any press, or the focus leaving the boxes lets it go
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
var drawAgain = function ($) {
    freshness += 1;
    void drawFresh($);
};
// The text each reply box was last drawn with: while the person types it is drawn with that again, never with the letters as they
// arrive, so a drawing never puts older letters over the newer ones the box already holds
var drawnDrafts = new Map();
var draftShown = function (id, ask) {
    var _a, _b;
    var key = draftOf(id, ask);
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
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _f.sent();
                card = function (one) { var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o; return [one.id, one.status, (_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0, (_e = (_d = (_c = one.ask) === null || _c === void 0 ? void 0 : _c.replied) === null || _d === void 0 ? void 0 : _d.at) !== null && _e !== void 0 ? _e : 0, (_f = one.parentId) !== null && _f !== void 0 ? _f : '', lingers(one, at), ((_g = one.admins) !== null && _g !== void 0 ? _g : []).map(function (gate) { return gate.id; }), (_h = one.leftSince) !== null && _h !== void 0 ? _h : 0, (_j = one.cutAt) !== null && _j !== void 0 ? _j : 0, (_k = one.stuckAt) !== null && _k !== void 0 ? _k : 0, (_l = one.waitsSince) !== null && _l !== void 0 ? _l : 0, (_o = (_m = one.running) === null || _m === void 0 ? void 0 : _m.at) !== null && _o !== void 0 ? _o : 0, jobsOf(one, at).length]; };
                return [4 /*yield*/, read($, todos)];
            case 2:
                own = _f.sent();
                return [4 /*yield*/, read($, others)];
            case 3:
                chats = _f.sent();
                theirs = [cardsOf(chats).map(card), helpersOf(chats).map(card), chats.map(function (c) { var _a, _b, _c, _d; return [c.host, c.chat, (_b = (_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, (_d = (_c = c.answeredPrompts) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0]; })];
                return [4 /*yield*/, read($, flows)];
            case 4:
                flowsNow = (_f.sent()).map(function (f) { return [f.id, f.status, isLingering(f, at), f.agents.length]; });
                mine = paneId === LIST ? null : (_e = own.find(function (other) { return paneId.endsWith(other.id); })) === null || _e === void 0 ? void 0 : _e.items.map(function (item) { return item.state; });
                _b = (_a = JSON).stringify;
                _c = [own.map(card), theirs, flowsNow, __spreadArray([], lastRunning.keys(), true), boxes.map(function (one) { return one.id; }), __spreadArray([], boxSaid.keys(), true), looseGates.map(function (one) { return one.id; }), mine];
                if (!(paneId === LIST)) return [3 /*break*/, 6];
                return [4 /*yield*/, updateShape($)];
            case 5:
                _d = _f.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = '';
                _f.label = 7;
            case 7: return [2 /*return*/, _b.apply(_a, [_c.concat([_d, __spreadArray([], gatePressed.keys(), true), __spreadArray([], askPressed, true)])])];
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
    var made = (typing += 1);
    isTyping = true;
    $.clock.after(TYPING, function () { return void (typing === made && ((isTyping = false), drawAgain($))); });
};
var freeTimes = function ($) {
    var wasHeld = isTyping;
    typing += 1;
    isTyping = false;
    if (wasHeld)
        drawAgain($);
};
// Every pane of the mod's is drawn again, from the values as they are now
var drawFresh = function ($) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, $.ui.invalidate('ui.render')
        // What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
    ];
}); }); };
// What each pane showed when last drawn afresh: its shape, its content and when, so calmLook knows what has moved since
var drawnPanes = new Map();
// What the panel shows from the mod's own memory rather than its values: what the app's prompts, the admin and file gates, the boxes,
// pictures, the update and the presses hold. A change in it draws the panel again within a second
var sideSign = function () {
    return JSON.stringify([
        waiting.map(function (one) { var _a, _b; return [one.agent, one.tool, (_a = one.seen) !== null && _a !== void 0 ? _a : 0, (_b = one.isPressedNo) !== null && _b !== void 0 ? _b : false]; }), asked.length, answeredPrompts.length,
        __spreadArray([], promptSaid, true),
        __spreadArray([], promptHeld, true),
        __spreadArray([], gateHeld, true),
        __spreadArray([], gateSaid.keys(), true),
        looseGates.map(function (one) { return one.id; }),
        __spreadArray([], undoneOffers.keys(), true),
        boxes.map(function (one) { return one.id; }), doneNotes.length,
        __spreadArray([], boxSaid, true),
        __spreadArray([], boxSent, true),
        boxPresses,
        __spreadArray([], pictureIn.keys(), true),
        isUpdating, isReloadRefused,
        updatedMoment !== null && updatedMoment !== void 0 ? updatedMoment : null,
        presses, loadMark, freshness,
    ]);
};
// While the person uses the panel (scrolls it, moves the focus in it, presses in it, or types) its running times stand still: they
// move again ENGAGED after the person's last move
var ENGAGED = 15000;
var engagedAt = 0;
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
    var now, list, side, isNew, _i, _a, _b, path, text, now_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                list = (_c = drawnPanes.get(LIST)) !== null && _c !== void 0 ? _c : { shape: '', content: '', at: 0, side: sideSign() };
                side = sideSign();
                isNew = !isTyping && list.side !== side;
                _i = 0, _a = isTyping ? [] : drawnFiles;
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
                    return [2 /*return*/, void ((list.side = side), drawAgain($), (list.side = sideSign()))
                        // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
                        // every CALM too, not each second
                    ];
                // Counted from the panel's last drawing afresh or the last of these, so a Details tab or the band drawn without the panel moves on
                // every CALM too, not each second
                if (!isMoving || isTyping || now - engagedAt < ENGAGED || now - Math.max(list.at, calmAt) < CALM)
                    return [2 /*return*/];
                calmAt = now;
                return [4 /*yield*/, writeHeldOthers($)];
            case 6:
                _d.sent();
                $.ui.invalidate('ui.render');
                return [2 /*return*/];
        }
    });
}); };
// Whether an element of the mod's is a box the person types into: an ask's reply box or a key box
var isTypedBox = function (element) { return /-reply-|^box-.*-field/.test(element !== null && element !== void 0 ? element : ''); };
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
var lineOf = function (one) { var last = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; }); return last ? "".concat(last.at, ":").concat(last.text) : ''; };
// How long the card says what was answered, unless the work writes a newer line first
var ANSWER_SHOWN = 60000;
// The answers every ask offers when the work gave none of its own
var DEFAULT_ANSWERS = ['Done', 'Not now'];
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
var answerAsk = function ($, one, choice, isReply) {
    if (isReply === void 0) { isReply = false; }
    var run = answerNow($, one, choice, isReply);
    if (one.chat)
        return run;
    answersOnWay.add(run);
    void run.finally(function () { return answersOnWay.delete(run); }).catch(function () { return undefined; });
    return run;
};
// Whether an answer settles its ask: a press does, and so does a reply to an ask that wanted words (it gave no buttons of its own)
// or one that begins with the words of one of its buttons. Any other reply, such as a request first, leaves the ask open while the work acts on it
var plainWords = function (text) { return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); };
var settles = function (ask, said, isReply) { var _a; return !isReply || !((_a = ask.choices) === null || _a === void 0 ? void 0 : _a.length) || ask.choices.some(function (choice) { return plainWords(choice) && "".concat(plainWords(said), " ").startsWith("".concat(plainWords(choice), " ")); }); };
// The asks a press answered, by card, as `${at}:${text}`: the panel draws the card answered from the press itself, its buttons and box
// gone in the press's own drawing, before the answer is written; the mark goes once the card's file no longer carries the ask
var askPressed = new Map();
// A card as the panel draws it: an ask or a gate already pressed is not drawn as still waiting
var asPressed = function (one) {
    var _a, _b;
    var isAnswered = Boolean(one.ask && askPressed.get(one.id) === "".concat(one.ask.at, ":").concat(one.ask.text));
    var admins = (_a = one.admins) === null || _a === void 0 ? void 0 : _a.filter(function (gate) { return !gatePressed.has(gate.id); });
    if (!isAnswered && (admins === null || admins === void 0 ? void 0 : admins.length) === ((_b = one.admins) === null || _b === void 0 ? void 0 : _b.length))
        return one;
    return __assign(__assign({}, one), { ask: isAnswered ? undefined : one.ask, admins: (admins === null || admins === void 0 ? void 0 : admins.length) ? admins : undefined });
};
var answerNow = function ($_1, one_1, choice_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, one_1, choice_1], args_1, true), void 0, function ($, one, choice, isReply) {
        var ask, said, target, asked, mark, line, isCleared, steerAt, at_1, err_1, isBack, _a, _b, _c, _d;
        var _e;
        var _f, _g;
        if (isReply === void 0) { isReply = false; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    // Another chat's ask is answered only in that chat: no file carries an answer to it, from this Mac or another
                    if (one.chat)
                        return [2 /*return*/];
                    ask = one.ask;
                    said = choice.trim();
                    if (!ask || !said)
                        return [2 /*return*/];
                    target = (_f = ask.from) !== null && _f !== void 0 ? _f : one.id;
                    if (!settles(ask, said, isReply))
                        return [2 /*return*/, holdAsk($, one, ask, said, target)
                            // The amber goes and the box clears at once. Only the first answer to the ask it was made for counts: a second press, or a press
                            // on an ask the work has since replaced, sends nothing. Marked before anything is awaited, so two presses at once count once
                        ];
                    asked = "".concat(one.id, ":").concat(ask.at, ":").concat(ask.text);
                    if (answeredAsks.has(asked))
                        return [2 /*return*/];
                    answeredAsks.add(asked);
                    mark = "".concat(ask.at, ":").concat(ask.text);
                    askPressed.set(one.id, mark);
                    line = lineOf(one);
                    sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at: Infinity, line: line, isCard: true, askAt: ask.at });
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
                    return [4 /*yield*/, answerCleared($, one, ask, said, isReply, target, at_1, line)];
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
                    return [4 /*yield*/, update($, todos, function (list) { return list.map(function (card) { return (card.id === one.id && !card.ask ? __assign(__assign({}, card), { ask: ask, entries: card.entries.filter(function (entry) { return !(entry.kind === 'steer' && entry.at === steerAt); }) }) : card); }); }).then(function () { return true; }).catch(function () { return false; })];
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
                        $.ui.log("The answer \u201C".concat(cut(said, 120), "\u201D to \"").concat(titleOf(one), "\" (").concat(ask.text, ") did not reach it, and its ask could not be put back on its card. Type your answer in this chat instead."));
                    redraw($);
                    throw err_1;
                case 9: return [2 /*return*/];
            }
        });
    });
};
// The rest of an answer once its ask is cleared from the card's file: to the work, or to wake it
var answerCleared = function ($, one, ask, said, isReply, target, at, line) { return __awaiter(_this, void 0, void 0, function () {
    var working, to, told, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                answeredAt.set(one.id, ask.at);
                dropDrafts($, one.id);
                replies.set(one.id, ((_b = replies.get(one.id)) !== null && _b !== void 0 ? _b : 0) + 1);
                sentReplies.set(one.id, { text: said, ask: ask.text, to: 'sending', at: at, line: line, isCard: true, askAt: ask.at });
                redraw($);
                // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
                $.clock.after(ANSWER_SHOWN + 50, function () { return drawAgain($); });
                return [4 /*yield*/, read($, todos)];
            case 1:
                working = ((_c = (_d.sent()).find(function (card) { return card.id === one.id; })) === null || _c === void 0 ? void 0 : _c.status) === 'working';
                to = isReply ? "".concat(who(true), " replied to your ask (\"").concat(ask.text, "\"), in their own words: ").concat(said) : "".concat(who(true), " pressed \"").concat(said, "\" in answer to your ask: ").concat(ask.text);
                if (!working) return [3 /*break*/, 3];
                return [4 /*yield*/, tell($, target, to)];
            case 2:
                _a = _d.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = undefined;
                _d.label = 4;
            case 4:
                told = _a;
                if (!(told && !told.deny)) return [3 /*break*/, 5];
                writtenIn(target, one.id);
                sentReplies.set(one.id, { text: said, ask: ask.text, to: 'work', at: at, line: line, isCard: true, askAt: ask.at });
                redraw($);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, toEnded($, one, target, "".concat(to, "\n").concat(RESUMED_BY_ANSWER), { text: said, ask: ask.text, at: at, line: line, isCard: true, askAt: ask.at })
                // Said in the chat only once the answer is on its way
            ];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                // Said in the chat only once the answer is on its way
                void askGone($, one, said);
                return [2 /*return*/];
        }
    });
}); };
// A reply in the person's own words that does not settle the ask: the ask stays on the card, its question with the reply under it,
// and the work is told so; its card stays among the running cards while the work acts on it. The person has answered, so its
// buttons and box go at once, and come back only when the work asks again, or ends with the ask still open
var holdAsk = function ($, one, ask, said, target) { return __awaiter(_this, void 0, void 0, function () {
    var key, at, isHeld, listed, isWaking, line, working, to, told, _a;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                key = "".concat(one.id, ":").concat(ask.at, ":").concat(ask.text, ":reply:").concat((_c = (_b = ask.replied) === null || _b === void 0 ? void 0 : _b.at) !== null && _c !== void 0 ? _c : '', ":").concat(said);
                if (answeredAsks.has(key))
                    return [2 /*return*/];
                answeredAsks.add(key);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _h.sent();
                isHeld = false;
                return [4 /*yield*/, read($, todos)];
            case 2:
                listed = _h.sent();
                isWaking = ((_d = listed.find(function (card) { return card.id === one.id; })) === null || _d === void 0 ? void 0 : _d.status) !== 'working' && ((_e = listed.find(function (card) { return card.id === target; })) === null || _e === void 0 ? void 0 : _e.status) !== 'working';
                return [4 /*yield*/, changeTodos($, function (list) {
                        return ((isHeld = false), list).map(function (card) { var _a; return (card.id === one.id && ((_a = card.ask) === null || _a === void 0 ? void 0 : _a.at) === ask.at && card.ask.text === ask.text ? ((isHeld = true), __assign(__assign({}, card), { ask: __assign(__assign({}, card.ask), { replied: __assign({ text: said, at: at }, (isWaking ? { isWaking: isWaking } : {})) }), entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'steer', text: said }], false).slice(-ENTRIES_KEPT) })) : card); });
                    })];
            case 3:
                _h.sent();
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
                // The card stays where it was while it says the answer (answeredSince), then takes its place among the others
                $.clock.after(ANSWER_SHOWN + 50, function () { return drawAgain($); });
                // Said in the chat once; the ask is then done with there, so the work asking again is sent to the chat afresh
                if (inChat.has(one.id))
                    (inChat.delete(one.id), void sayInChat($, named(ASK_REPLIED(titleOf(one), "\u201C".concat(cut(said, 120), "\u201D")))));
                return [4 /*yield*/, read($, todos)];
            case 4:
                working = ((_g = (_h.sent()).find(function (card) { return card.id === target; })) === null || _g === void 0 ? void 0 : _g.status) === 'working';
                to = "".concat(who(true), " replied to your ask (\"").concat(ask.text, "\"), in their own words: ").concat(said, "\n").concat(named(REPLY_HOLDS));
                if (!working) return [3 /*break*/, 6];
                return [4 /*yield*/, tell($, target, to)];
            case 5:
                _a = _h.sent();
                return [3 /*break*/, 7];
            case 6:
                _a = undefined;
                _h.label = 7;
            case 7:
                told = _a;
                if (told && !told.deny)
                    return [2 /*return*/, void (writtenIn(target, one.id), redraw($))];
                return [4 /*yield*/, toEnded($, one, target, "".concat(to, "\n").concat(RESUMED_BY_ANSWER), { text: said, ask: ask.text, at: at, line: line, isCard: true, askAt: ask.at })];
            case 8:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); };
// An answer to work that has ended starts that work again with it, as a message to it: the chat then gets the work's report as
// it gets any, and nothing goes into the chat in the person's place.
// The engine runs what a mod sends from outside its hooks (a timer, a button's own handler) under the mod's own origin, and work
// started again that way runs with every hook of the mod skipped: each of its panel tools answered "no tool.call hook answered",
// and its ask never reached the card. So the message waits here and is sent from inside a hook (the press's or the reply's own,
// a prompt, the end of a turn, a change in how full the chat is), where the work it wakes keeps its tools. Not from a tool call's
// hook: the engine leaves the calling hook out of what that call raises, and may of what it starts, and work woken there could miss its own tool calls' hook. One no hook takes within WAKE_WAIT, in a chat where
// nothing runs, is sent from the timer all the same: the work does what it was asked, and its rules have it end with any ask as
// its report's first line when the panel does not answer, which the chat puts to the person. One a copy a reload replaced still
// holds goes to the chat instead: a notice the person sees and a row its model reads, with no turn of its own
var WAKE_WAIT = 4000;
// Each wake carries every answer joined into it, so each card's line and the chat's notice are settled for every one
var wakes = [];
var toEnded = function ($, one, target, text, sent) { return __awaiter(_this, void 0, void 0, function () {
    var same, wake;
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
                    return [2 /*return*/, void ((same.text = "".concat(same.text, "\n\n").concat(text)), same.answers.push({ one: one, sent: sent }))];
                wake = { target: target, text: text, answers: [{ one: one, sent: sent }] };
                wakes.push(wake);
                void $.clock.after(WAKE_WAIT, function () {
                    var at = wakes.indexOf(wake);
                    if (at < 0)
                        return;
                    wakes.splice(at, 1);
                    void log($, "work ".concat(target, " started again from a timer: no hook of the mod ran within ").concat(WAKE_WAIT / 1000, " s, so its panel tools will not answer"));
                    void sendWake($, wake);
                });
                return [2 /*return*/];
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
                return [4 /*yield*/, log($, "work ".concat(wake.target, " not started again with an answer: the person stopped it"))];
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
                if (!r.isDelivered)
                    return [2 /*return*/, wakeFailed($, wake, r.reason)
                        // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
                    ];
                // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
                return [4 /*yield*/, wakeCard($, wake.target)
                    // Started by the message, the work reads it in the run it starts: that run's end never sends it a second time, even when no hook
                    // of the mod saw its steps (a wake from the timer)
                ];
            case 8:
                // Only once it is on its way: work at work when the mod's own message reaches it would take that message for the chat's note
                _e.sent();
                // Started by the message, the work reads it in the run it starts: that run's end never sends it a second time, even when no hook
                // of the mod saw its steps (a wake from the timer)
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
var writtenIn = function (target, card) {
    pending.set(target, card);
    for (var _i = 0, startedBy_1 = startedBy; _i < startedBy_1.length; _i++) {
        var key = startedBy_1[_i];
        if (key.startsWith("".concat(card, ":")))
            startedBy.delete(key);
    }
};
// Work an answer or the person's message started again is at work from then: its card is back among the running cards, not under
// Finished, while it acts on it
var wakeCard = function ($, target) { return __awaiter(_this, void 0, void 0, function () {
    var now, isWoken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _a.sent();
                isWoken = false;
                return [4 /*yield*/, changeTodos($, function (list) { return ((isWoken = false), list).map(function (card) { return (card.id !== target || card.status === 'working' ? card : ((isWoken = true), resumed(card, now))); }); })];
            case 2:
                _a.sent();
                if (isWoken)
                    endedByHandback.delete(target);
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
                $.ui.log(said_1);
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
    var ask, answers, notice, surfaces, _i, _a, line;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                ask = one.ask;
                if (!ask || isOff || !dir || inChat.get(one.id) === askKey(ask))
                    return [2 /*return*/];
                inChat.set(one.id, askKey(ask));
                answers = ((_b = ask.choices) === null || _b === void 0 ? void 0 : _b.length) ? ask.choices : DEFAULT_ANSWERS;
                notice = named(ASK_IN_CHAT(titleOf(one), ask, answers));
                return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                surfaces = _c.sent();
                for (_i = 0, _a = surfaces.length && surfaces.every(function (s) { return s === 'terminal'; }) ? notice.split('\n').filter(function (line) { return line.trim(); }) : [notice]; _i < _a.length; _i++) {
                    line = _a[_i];
                    $.ui.log(line);
                }
                return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: named(ASK_RELAY(one.id, titleOf(one), ask, answers)) }] } }).catch(function (err) { return (inChat.get(one.id) === askKey(ask) && inChat.delete(one.id), log($, "chat not told of an ask: ".concat(String(err)))); })];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A line in the chat the person sees (the mod's notice, which the model never reads) and its model reads (a row the person does not
// see), sent with no turn of its own. The notice is the mod's log line: the desktop app leaves out a system row the mod appends
var sayInChat = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                $.ui.log(text);
                return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: text }] } }).catch(function (err) { return log($, "chat not told: ".concat(String(err))); })];
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
                return [4 /*yield*/, sayInChat($, named(said === undefined ? ASK_CLEARED(titleOf(one)) : ASK_ANSWERED(titleOf(one), "\u201C".concat(cut(said, 120), "\u201D"))))];
            case 1:
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
                writtenIn(to, a.card.id);
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
                return [4 /*yield*/, tell($, helper.id, "".concat(who(true), " answered your ask (\"").concat(a.ask.text, "\") in the chat, in their own words: ").concat(a.words))];
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
                return [4 /*yield*/, toEnded($, one, agentId, "".concat(who(true), " ").concat(isHeld ? 'replied to' : 'answered', " your ask (\"").concat(sent.ask, "\"), and you ended before reading it: ").concat(sent.text).concat(isHeld ? "\n".concat(named(REPLY_HOLDS)) : '', "\n").concat(RESUMED_BY_ANSWER), sent)];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// An answer given on the card in the last ANSWER_SHOWN: the card stays where it was meanwhile (answeredSince), and says it
var heldAnswer = function (one, now) {
    var sent = one.chat ? undefined : sentReplies.get(one.id);
    return (sent === null || sent === void 0 ? void 0 : sent.isCard) && sent.to !== 'lost' && now - sent.at < ANSWER_SHOWN ? sent : undefined;
};
// What the card says of the answer last given to its ask, for ANSWER_SHOWN after, until the work writes a newer line or asks again.
// An answer that could not be left for another Mac says so under the ask, which is back
var sentLine = function (one, now) {
    var _a, _b, _c, _d, _e;
    var sent = sentReplies.get(one.id);
    // A held reply this copy did not send (before a reload, or from another chat) is still said under its ask
    var replied = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied;
    if (replied && !(sent && sent.ask === ((_b = one.ask) === null || _b === void 0 ? void 0 : _b.text) && (sent.text === replied.text || sent.isHeld)))
        return "\u2713 You replied \u201C".concat(cut(replied.text, 60), "\u201D").concat(isActingOnReply(one) ? ' · it is acting on it' : '; it still asks this');
    if (!sent)
        return '';
    if (sent.to === 'failed')
        return ((_c = one.ask) === null || _c === void 0 ? void 0 : _c.text) === sent.ask ? "Not sent: \u201C".concat(cut(sent.text, 60), "\u201D did not reach the work. Press it again") : '';
    if (sent.to === 'lost')
        return ((_d = one.ask) === null || _d === void 0 ? void 0 : _d.text) === sent.ask ? "Not sent: \u201C".concat(cut(sent.text, 60), "\u201D. That Mac could not be reached; answer it in its own chat") : '';
    var newer = lineOf(one) !== sent.line;
    var isHeld = Boolean(one.ask && one.ask.text === sent.ask && (sent.isHeld || ((_e = one.ask.replied) === null || _e === void 0 ? void 0 : _e.text) === sent.text));
    if ((one.ask && !isHeld) || (!isHeld && (newer || now - sent.at > ANSWER_SHOWN)))
        return '';
    var how = {
        sending: 'on its way to the work',
        work: 'it reads this at its next step',
        read: 'it has read it',
        chat: 'left in the chat, which carries the work on',
        other: "sent to the chat \"".concat(cut(one.chat ? chatName(one.chat) : 'it runs in', 40), "\", whose work reads it at its next step"),
    }[sent.to];
    if (isHeld)
        return "\u2713 You replied \u201C".concat(cut(sent.text, 60), "\u201D \u00B7 ").concat(sent.to === 'read' ? (one.status === 'working' ? 'it is acting on it' : 'it has read it') : how).concat(isActingOnReply(one) ? '' : '; it still asks this');
    return "\u2713 You answered \u201C".concat(cut(sent.text, 60), "\u201D \u00B7 ").concat(how);
};
