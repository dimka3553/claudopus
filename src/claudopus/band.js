// Above the prompt: the small octopus while work runs, and how Claude uses this computer
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
// The answer picked above the prompt by its number, and how long the pick waits for the same number again
var bandPick;
var BAND_PICK = 6000;
// Above the prompt, which never scrolls: on the desktop, one steady line for as long as anything waits for the person, however the
// list is scrolled: how many, and what the first asks (17 Nov: the line came only once the list was scrolled, so what waited was
// told nowhere near where the person types). Scrolled away from the top, Show takes the list back there; nothing else moves it.
// In the terminal the band itself holds the first ask, so the line comes only once the list is scrolled.
// Work that just finished, in its moment at the top, is pointed at the same way, in green, once the list is scrolled
var isListPlaced = function ($) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
        case 1: return [2 /*return*/, (_a.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; })];
    }
}); }); };
var isScrolled = function (surface) { var _a; return ((_a = listOffsets.get(surface)) !== null && _a !== void 0 ? _a : 0) > 0; };
var isMarkerShown = function ($, surface) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = ((waitsAtTop > 0 && (surface !== 'terminal' || isScrolled(surface))) || (finishedAtTop.length > 0 && isScrolled(surface)));
            if (!_a) return [3 /*break*/, 2];
            return [4 /*yield*/, isListPlaced($)];
        case 1:
            _a = (_b.sent());
            _b.label = 2;
        case 2: return [2 /*return*/, _a];
    }
}); }); };
// What the marker says, empty when it is not drawn: a bar held with a box in it is drawn again when this moves, but not while the
// box is typed in or holds the cursor
var markerSign = function ($, surface) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, isMarkerShown($, surface)];
        case 1: return [2 /*return*/, ((_a.sent()) ? "".concat(waitsAtTop, "|").concat(firstAtTop, "|").concat(isScrolled(surface), "|").concat(finishedAtTop.join('|')) : '')];
    }
}); }); };
var markerWords = function (surface) {
    return waitsAtTop > 0
        ? "\u25CF ".concat(waitsAtTop, " waiting for you").concat(firstAtTop ? " \u00B7 ".concat(firstAtTop) : '').concat(isScrolled(surface) && finishedAtTop.length ? " \u00B7 ".concat(finishedAtTop.length, " done") : '')
        : "\u2191 ".concat(finishedAtTop.length === 1 ? "".concat(finishedAtTop[0], " is done") : "".concat(finishedAtTop.length, " tasks are done"), ", at the top of the panel");
};
var waitMarker = function ($, ui, surface) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, isMarkerShown($, surface)];
            case 1: return [2 /*return*/, (_a.sent()) ? (<ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden" gap={1}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text color={waitsAtTop > 0 ? NEEDS : DONE} bold wrap="truncate-end">{markerWords(surface)}</ui.Text>
      </ui.Box>
      {isScrolled(surface) ? (<ui.Box flexShrink={0}>
          <ui.Button key={"band-waits-".concat(presses)} label="Show" plain onPress={function () { return ((presses += 1), void (recordEvent($, 'scroll-call', { to: 'start' }), $.ui.scroll({ in: LIST, to: 'start', block: 'start' })).catch(function () { return undefined; })); }}/>
        </ui.Box>) : null}
    </ui.Box>) : null
                // The one box above the chat, for everything that is typed for the panel (asking.tsx, barOpen): an answer in words, a key, a
                // password, a change to a done task, what to do next from a result. One heading line says what it is for; the field under it is as
                // wide as the bar and BOX_ROWS lines tall whatever it holds; under it, a gap between, what Enter does beside Send, the big one,
                // and Close, small, which takes the box away again (17 Nov, the person: the box was "very small" and "doesn't extend taller").
                // The field names no submitLabel: the desktop app draws one as a second, small send button beside it, and with one a box of
                // several lines sends only on Cmd+Enter; without it Enter sends. Nothing in it follows the panel's scrolling. It takes the cursor
                // when the person clicks anywhere in the bar (autoFocus)
                // `draft`: where what is typed and not sent is kept (an answer, a change, a result); a key or a password is kept nowhere but in
                // barKeyTyped while the box is open, for its Send button. `said`: what went wrong with what was last sent from it
                // `message`: the task a message goes to, whose box has the message's own row under it (messageFoot): its files, Attach, Send now
                // and Send, as at the bottom of its Details
            ];
        }
    });
}); };
// The card the box was opened on by Message, while it works or has finished and asks nothing: asking, its box goes
var changeTarget = function (cards) { return ((barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) === 'change' ? cards.find(function (one) { return one.id === (barOpen === null || barOpen === void 0 ? void 0 : barOpen.id) && canChange(asPressed(one)); }) : undefined); };
// What the open box is for, as it stands now; none once that is answered, gone or no longer open to it, and the box goes with it
var barBoxOf = function ($, ui, cards, kept) {
    var _a;
    var open = barOpen;
    if (!open)
        return undefined;
    var sent = function (id) { var _a; return void ((barBoxAt = 0), dropDrafts($, id), replies.set(id, ((_a = replies.get(id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($)); };
    var forTask = function (card) {
        var one = card ? cards.find(function (other) { return other.id === card; }) : undefined;
        return one ? " for \u201C".concat(cut(titleOf(one), 50), "\u201D") : '';
    };
    if (open.kind === 'answer') {
        var one_1 = barTarget(cards);
        return one_1 && { head: "\u21B3 Your answer to \u201C".concat(cut(titleOf(one_1), 60), "\u201D"), placeholder: 'Type your answer', draft: barDraft(), attachTo: one_1.id, send: function (value) { return void (sent(one_1.id), sendFromBar($, one_1.id, value).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); })); } };
    }
    if (open.kind === 'change') {
        var one_2 = changeTarget(cards);
        return one_2 && { head: "\u21B3 ".concat(asksOnResult(one_2) ? 'Reply' : 'Message', " to \u201C").concat(cut(titleOf(one_2), 50), "\u201D"), placeholder: 'Type your message', draft: messageDraft(one_2.id), message: one_2, send: function (value) { return sendMessageFrom($, one_2.id, value, false); } };
    }
    // Words on a permission of a task's card: they go to that task, and the block keeps Allow and Don't allow (gate.tsx, wordsOnGate)
    if (open.kind === 'permission') {
        var one_3 = gatePressed.has(open.id) || !(gateHeld.has(open.id) || gateParked.has(open.id)) ? undefined : cards.find(function (card) { var _a; return !card.chat && ((_a = card.admins) === null || _a === void 0 ? void 0 : _a.some(function (gate) { return gate.id === open.id; })); });
        // (its files go with the words, as from the box that answers a question)
        var sendWords = function (value) {
            var _a;
            if (!one_3)
                return;
            var files = takeAttached(open.id);
            var shown = __spreadArray([value.trim()], files.map(function (path) { var _a; return "\uD83D\uDCCE ".concat((_a = path.split('/').pop()) !== null && _a !== void 0 ? _a : path); }), true).filter(Boolean).join(' ');
            if (!shown)
                return;
            ((barBoxAt = 0), drafts.delete(barDraft()), keepDraft($, barDraft(), undefined), replies.set(open.id, ((_a = replies.get(open.id)) !== null && _a !== void 0 ? _a : 0) + 1), (barOpen = undefined), freeTimes($), redraw($));
            void wordsOnGate($, one_3.id, open.id, shown, filesNote(files));
        };
        return one_3 && { head: "\u21B3 Your answer to \u201C".concat(cut(titleOf(one_3), 60), "\u201D"), placeholder: 'Type your answer', draft: barDraft(), attachTo: open.id, send: sendWords };
    }
    if (open.kind === 'continue') {
        var r_1 = kept.find(function (one) { return one.id === open.id; });
        return r_1 && { head: "\u21B3 Message to \u201C".concat(cut(r_1.title, 50), "\u201D"), placeholder: 'Type your message', draft: barDraft(), attachTo: r_1.id, send: function (value) { return void (sent(r_1.id), (barOpen = undefined), redraw($), continueFrom($, r_1.id, value, takeAttached(r_1.id)).catch(function (err) { return log($, "message from a result not sent: ".concat(String(err))); })); } };
    }
    var box = boxes.find(function (one) { return one.id === open.id; });
    if (!box)
        return undefined;
    var mode = open.kind === 'words' ? 'reply' : 'key';
    var head = open.kind === 'words'
        ? "\u21B3 Your answer in place of ".concat((_a = box.name) !== null && _a !== void 0 ? _a : (isNameBox(box) ? 'the name' : 'the key'))
        : open.kind === 'password'
            ? "\u21B3 ".concat(box.host === 'here' || !box.host ? "".concat(thisMac().replace(/^t/, 'T'), "'s password") : "The password of ".concat(box.host)).concat(forTask(box.card))
            : box.name
                ? "\u21B3 ".concat(box.name).concat(forTask(box.card))
                : "\u21B3 The key's name";
    return __assign(__assign({ head: head, placeholder: open.kind === 'words' ? 'Type your answer' : open.kind === 'password' || !box.name ? 'Type it here' : 'Paste it here', secret: box.id }, (boxSaid.get(box.id) ? { said: boxSaid.get(box.id) } : {})), { extra: heldReplyButtons($, ui, box.id, 'band-key'), 
        // (a pasted key often ends in a line break, which is no part of it)
        send: function (value) { return submitBox($, box.id, mode, mode === 'reply' ? value : value.replace(/[\r\n]+$/, '')); } });
};
var barBox = function ($, ui, box) {
    var _a;
    var typed = function () { var _a, _b; return (box.draft ? ((_a = drafts.get(box.draft)) !== null && _a !== void 0 ? _a : '') : box.secret ? ((_b = barKeyTyped.get(box.secret)) !== null && _b !== void 0 ? _b : '') : ''); };
    // (pictures or files attached are an answer by themselves, with no words)
    var send = function (value) { var _a; return void ((value.trim() || (box.attachTo && ((_a = attached.get(box.attachTo)) === null || _a === void 0 ? void 0 : _a.length))) && box.send(value)); };
    return (<ui.Box key="band-box" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={NEEDS} bold wrap="truncate-end">{box.head}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (<ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input key={barBoxKey()} placeholder={box.placeholder} {...(box.draft ? { value: draftDrawn(box.draft) } : {})} rows={BOX_ROWS} autoFocus onInput={function (value) {
                var draft = box.draft, secret = box.secret;
                if (draft)
                    (drafts.set(draft, value), keepDraft($, draft, value));
                else if (secret)
                    ((value ? boxTyped.add(secret) : boxTyped.delete(secret)), barKeyTyped.set(secret, value));
                holdTimes($);
                void $.clock.now().then(function (at) { return (barBoxAt = at); });
            }} onSubmit={send}/>
        </ui.Box>) : null}
      {box.said ? <ui.Text key="band-box-said" color={NEEDS} wrap="wrap">{box.said}</ui.Text> : null}
      {(_a = box.extra) !== null && _a !== void 0 ? _a : null}
      {box.message ? (<ui.Box key="band-box-message" flexShrink={0} marginTop={1} width="100%">
          {messageFoot($, ui, box.message, 'band-box', <ui.Button key={"band-box-close-".concat(presses, "-").concat(boxPresses)} label="Close" plain dimColor onPress={function (press) { return openBar($, undefined, press.surface); }}/>)}
        </ui.Box>) : null}
      {box.attachTo && !box.message ? <ui.Box key="band-box-attached" flexShrink={0} marginTop={1} width="100%">{attachedRow($, ui, box.attachTo, 'band-box')}</ui.Box> : null}
      {box.message ? null : <ui.Box key="band-box-foot" flexDirection="row" alignItems="center" gap={2} flexShrink={0} marginTop={1}>
        {box.attachTo ? <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>{attachButtons($, ui, box.attachTo, 'band-box')}</ui.Box> : null}
        <ui.Box flexGrow={1} flexShrink={1} minWidth={0}/>
        <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
          <ui.Button key={"band-box-send-".concat(presses, "-").concat(boxPresses)} label="Send" variant="primary" onPress={function () { return send(typed()); }}/>
          <ui.Button key={"band-box-close-".concat(presses, "-").concat(boxPresses)} label="Close" plain dimColor onPress={function (press) { return openBar($, undefined, press.surface); }}/>
        </ui.Box>
      </ui.Box>}
    </ui.Box>);
};
// The bar as last drawn on each surface while its box was in it: while the person types, and for as long as the box holds the
// cursor (barBoxAt), it is drawn as it was, whole, but for a change in what it holds, as a pane is (heldDrawings): each drawing is
// a new box under the cursor, its ring drawn again and a selection or a half-composed letter lost
// (17 Nov: the bar was drawn anew, and the box with it, each time any work wrote its cards, several times a second, as the bar
// read them while drawing; each drawing is a new box, and the app gives it the cursor again, its ring fading in again: the box
// blinked as the person typed). So a bar with a box open is given again as it was drawn, from the moment the box opens, for as
// long as what the box is and how tall it is drawn stay the same (barShape) and, while the box is not typed in and has no cursor,
// what the marker says (markerSign), reading none of the cards: a drawing that reads nothing is not drawn again as they are
// written. The cards are looked at once a second instead (lookBar), and the bar is drawn again when what it shows of them moved
var barHeld = new Map();
// What a bar with a box open is drawn for, from the mod's own memory alone: which box, and what is said beside it
var barShape = function () { var _a; return (barOpen ? "".concat(barOpen.kind, "|").concat(barBoxKey(), "|").concat(attachShape(barOpen.id), "|").concat(isBoxKind(barOpen.kind) ? "".concat((_a = boxSaid.get(barOpen.id)) !== null && _a !== void 0 ? _a : '', "|").concat(boxHeldReply.has(barOpen.id)) : barCardsDrawn) : ''); };
// What the cards say of the box open in the bar as last looked at: its card, still asking or still done, under its title. Part
// of the held shape, so a card that stops asking (answered elsewhere, its question withdrawn, the task stopped) takes its box
// away within a second
var barCardsDrawn = '';
var barCardsSign = function (cards) {
    var _a;
    var one = (_a = changeTarget(cards)) !== null && _a !== void 0 ? _a : barTarget(cards);
    return one ? "".concat(one.id, "|").concat(titleOf(one)) : (barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) === 'continue' ? "result|".concat(barOpen.id) : '';
};
// Once a second while a bar holds a box (chat.tsx): the cards it shows moved, so it is drawn again, once for each change
var lookBar = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b, sign, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = isRedrawOwed;
                if (!_a) return [3 /*break*/, 2];
                _b = isBoxHeld;
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _a = !_b.apply(void 0, [_d.sent()]);
                _d.label = 2;
            case 2:
                // A redraw put off while the box held the cursor is made once it no longer does (drawFresh)
                if (_a)
                    drawAgain($);
                if (!barHeld.size || !barOpen || isBoxKind(barOpen.kind))
                    return [2 /*return*/];
                _c = barCardsSign;
                return [4 /*yield*/, read($, todos)];
            case 3:
                sign = _c.apply(void 0, [_d.sent()]);
                if (sign === barCardsDrawn)
                    return [2 /*return*/];
                barCardsDrawn = sign;
                drawAgain($, true);
                return [2 /*return*/];
        }
    });
}); };
// A bar drawn afresh with a box in it read the cards to draw it, and the engine draws a drawing again at the first write of what
// it read: the app then built the box anew under the cursor, its ring fading in again, at the first card any work wrote after the
// box opened or the marker moved. So it is asked for once more at once, and given then as held, reading nothing; once only, so a
// bar drawn afresh again in reply asks for nothing more
var isBarSettling = false;
var settleBar = function ($) {
    if (isBarSettling)
        return void (isBarSettling = false);
    isBarSettling = true;
    // (the panes' own drawings are still good: they are given again as they were)
    void drawFresh($, true);
};
// When this surface's bar last asked for the cards to be drawn again as its box came or went: at most once a second, so two
// windows of one chat that differ never ask in turn without end
var barFlipAt = 0;
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
var BAND_TERM_MARK = 3;
var bandHooks = function (on) {
    // The bar on the desktop is redrawn as often as the panel and has buttons too, so it is given again as it was while its drawings or
    // the panel's are slow (isFreshTooSoon) and from the start of a click on one of its buttons until the click lands (isPressHeld), as the panel is:
    // a newer drawing retires the buttons on screen, and a click on one already gone runs nothing. Never while its reply box is typed
    // into or holds the cursor: a bar with a box open keeps a drawing of its own (barHeld)
    on('ui.render', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
        function drawBarNow() {
            return __awaiter(this, void 0, void 0, function () {
                var canBox, flipAt, kept, isHeldNow, _a, _b, cards, open_1, bandAt, bandKept, working, happy, ui, Box, Button, Text, asking, first_1, ask_1, answers, id_1, picked_1, press_1, more, need, _c, _d, _e, _f, box, shape, marker_1, row, drawing_1, _g, _h, _j, isPanelAway, _k, figures, _l, marker, drawn, drawing;
                var _m, _o;
                var _p, _q, _r, _s, _t;
                return __generator(this, function (_u) {
                    switch (_u.label) {
                        case 0:
                            canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed;
                            if (e.requestId)
                                barIds.set(e.surface, e.requestId);
                            return [4 /*yield*/, $.clock.now()
                                // A box open and drawn as it is: given again as it was, reading no cards (barHeld)
                            ];
                        case 1:
                            flipAt = _u.sent();
                            kept = barHeld.get(e.surface);
                            if (!(kept && canBox && barBoxes.has(e.surface) && barOpen && kept.shape === barShape())) return [3 /*break*/, 4];
                            isHeldNow = isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD);
                            _a = isHeldNow;
                            if (_a) return [3 /*break*/, 3];
                            _b = kept.mark;
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 2:
                            _a = _b === (_u.sent());
                            _u.label = 3;
                        case 3:
                            if (_a)
                                return [2 /*return*/, ((isBarSettling = false), kept.drawing)];
                            _u.label = 4;
                        case 4: return [4 /*yield*/, read($, todos)];
                        case 5:
                            cards = _u.sent();
                            if (canBox !== barBoxes.has(e.surface)) {
                                if (canBox)
                                    barBoxes.add(e.surface);
                                else
                                    barBoxes.delete(e.surface);
                                open_1 = canBox || (barOpen === null || barOpen === void 0 ? void 0 : barOpen.kind) !== 'answer' ? undefined : cards.find(function (one) { return one.id === (barOpen === null || barOpen === void 0 ? void 0 : barOpen.id); });
                                if (open_1)
                                    (carryDraft($, open_1, barDraft()), freeTimes($));
                                if (!canBox)
                                    ((barOpen = undefined), barHeld.delete(e.surface));
                                barBoxAt = 0;
                                // Only a card that asks is drawn differently for it
                                // and a key box, whose buttons or field are drawn by it too
                                // and a Done card, whose Message is there only with the box (a working card's comes with its own next drawing)
                                if ((asksForBar(cards).length || boxes.length || barOpen || cards.some(function (one) { return one.status !== 'working' && canChange(asPressed(one)); })) && flipAt - barFlipAt >= 1000)
                                    ((barFlipAt = flipAt), drawAgain($));
                            }
                            if (e.props.hasSurvey)
                                return [2 /*return*/, next(e)];
                            return [4 /*yield*/, $.clock.now()];
                        case 6:
                            bandAt = _u.sent();
                            return [4 /*yield*/, read($, reports)
                                // (each card by its stage: at work from its start until its result, waiting only while something of its own waits for the person;
                                // a result that still asks the person something is not at work)
                            ];
                        case 7:
                            bandKept = _u.sent();
                            working = cards.filter(function (one) { return !one.parentId && (stageOf(cards, one) === 'working' || (stageOf(cards, one) === 'waiting' && !asksOnResult(one))); });
                            happy = isHappy(cards, bandAt);
                            if (!happy) return [3 /*break*/, 9];
                            return [4 /*yield*/, read($, tick)];
                        case 8:
                            _u.sent();
                            _u.label = 9;
                        case 9:
                            ui = uiOf($, e);
                            Box = ui.Box, Button = ui.Button, Text = ui.Text;
                            if (!(e.surface === 'terminal')) return [3 /*break*/, 14];
                            asking = __spreadArray([], cards.filter(function (one) { return !one.parentId && one.ask; }), true).sort(function (a, b) { var _a, _b, _c, _d, _e, _f; return Number(needsPerson(b)) - Number(needsPerson(a)) || ((_c = (_a = topPlaces.get("//".concat(a.id))) !== null && _a !== void 0 ? _a : (_b = a.ask) === null || _b === void 0 ? void 0 : _b.at) !== null && _c !== void 0 ? _c : 0) - ((_f = (_d = topPlaces.get("//".concat(b.id))) !== null && _d !== void 0 ? _d : (_e = b.ask) === null || _e === void 0 ? void 0 : _e.at) !== null && _f !== void 0 ? _f : 0); });
                            first_1 = asking[0];
                            ask_1 = first_1 === null || first_1 === void 0 ? void 0 : first_1.ask;
                            if (!(first_1 && ask_1)) return [3 /*break*/, 14];
                            answers = ((_p = ask_1.choices) !== null && _p !== void 0 ? _p : []).slice(0, 9);
                            id_1 = "".concat(first_1.id, ":").concat(ask_1.at);
                            picked_1 = (bandPick === null || bandPick === void 0 ? void 0 : bandPick.id) === id_1 ? bandPick.n : -1;
                            press_1 = function (n, choice) {
                                if (picked_1 === n)
                                    return (bandPick = undefined), void answerAsk($, first_1, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); });
                                var pick = (bandPick = { id: id_1, n: n });
                                (recordEvent($, 'redraw-band'), $.ui.invalidate('ui.render'));
                                // Left alone, the pick is let go
                                $.clock.after(BAND_PICK, function () { return void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))); });
                            };
                            more = asking.filter(needsPerson).length - Number(needsPerson(first_1));
                            _c = [__assign(__assign({ id: "band-ask-".concat(first_1.id), kind: ask_1.refused ? 'permission' : 'question', at: ask_1.at, from: titleOf(first_1), text: cut(oneLine(ask_1.text), Math.max(80, e.props.bodyColumns * 3)) }, (ask_1.copy ? { command: oneLine(ask_1.copy) } : {})), { isActing: isActingOnReply(first_1) })];
                            if (!isActingOnReply(first_1)) return [3 /*break*/, 11];
                            _m = {};
                            _e = sentLine;
                            _f = [first_1];
                            return [4 /*yield*/, $.clock.now()];
                        case 10:
                            _d = (_m.line = _e.apply(void 0, _f.concat([_u.sent()])) || "\u2713 You answered \u201C".concat(cut((_r = (_q = ask_1.replied) === null || _q === void 0 ? void 0 : _q.text) !== null && _r !== void 0 ? _r : '', 60), "\u201D"), _m);
                            return [3 /*break*/, 12];
                        case 11:
                            _d = { where: "".concat(ask_1.details ? 'The details are on its card · ' : '').concat(picked_1 >= 0 ? "Type ".concat(picked_1 + 1, " again to answer \u201C").concat((_s = answers[picked_1]) !== null && _s !== void 0 ? _s : '', "\u201D") : "".concat(answers.length ? 'Type its number twice in an empty box · ' : '').concat(more > 0 ? "".concat(more, " more waiting \u00B7 ") : '', "/claudopus to answer in words")) };
                            _u.label = 12;
                        case 12:
                            need = __assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_d)])), { buttons: isActingOnReply(first_1) || ask_1.refused ? [] : answers.map(function (choice, n) { return ({ key: "band-ask-".concat(first_1.id, "-").concat(ask_1.at, "-").concat(n), label: choice, hotkey: String(n + 1), isPlain: true, onPress: function () { return press_1(n, choice); } }); }) }]);
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 13: return [2 /*return*/, (<Box flexDirection="column">
            {_u.sent()}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first_1) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first_1) ? 'Claudopus, waiting for you' : 'Claudopus, working on your answer', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0} flexDirection="column">
                {needBlock($, ui, need, { isCompact: true, surface: e.surface })}
              </Box>
            </Box>
          </Box>)];
                        case 14:
                            box = canBox ? barBoxOf($, ui, cards, bandKept) : undefined;
                            if (barOpen && canBox && !box)
                                barOpen = undefined;
                            if (!box) return [3 /*break*/, 17];
                            // Drawn as it was while the box is typed in or holds the cursor: only what it is for draws it anew, so neither the panel
                            // scrolled under the cursor nor work starting or ending puts a new box under it. The box takes the place of the figures
                            // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
                            barCardsDrawn = barCardsSign(cards);
                            shape = barShape();
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 15:
                            marker_1 = _u.sent();
                            row = barBox($, ui, box);
                            drawing_1 = marker_1 ? (<Box flexDirection="column">
          {marker_1}
          {row}
        </Box>) : (row);
                            _h = (_g = barHeld).set;
                            _j = [e.surface];
                            _o = { shape: shape };
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 16:
                            _h.apply(_g, _j.concat([(_o.mark = _u.sent(), _o.drawing = drawing_1, _o)]));
                            settleBar($);
                            return [2 /*return*/, drawing_1];
                        case 17:
                            barHeld.delete(e.surface);
                            if (!(!working.length && !happy)) return [3 /*break*/, 19];
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 18: return [2 /*return*/, (_t = (_u.sent())) !== null && _t !== void 0 ? _t : next(e)
                            // A narrow terminal seats no panel until it is asked for: the band says how
                        ];
                        case 19:
                            _k = e.surface === 'terminal';
                            if (!_k) return [3 /*break*/, 21];
                            return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                        case 20:
                            _k = !(_u.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
                            _u.label = 21;
                        case 21:
                            isPanelAway = _k;
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            return [4 /*yield*/, read($, figuresAt)];
                        case 22:
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            _u.sent();
                            _l = usageNow;
                            return [4 /*yield*/, $.clock.now()];
                        case 23:
                            figures = _l.apply(void 0, [_u.sent()]);
                            if (!figures)
                                void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 24:
                            marker = _u.sent();
                            drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null;
                            drawing = function (spacers) {
                                var _a;
                                var row = (<Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {(_a = octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, a task is done' : 'Claudopus, Claude is working', $, { surface: e.surface, requestId: e.requestId })) !== null && _a !== void 0 ? _a : <Text dimColor>•••</Text>}
          {spacers}
          {figures ? (drawn !== null && drawn !== void 0 ? drawn : <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
          {/* The figures fill a phone's terminal: the hint shows until they come */}
          {isPanelAway && !figures ? (<Box flexShrink={0}>
              <Text dimColor>· /claudopus shows the panel</Text>
            </Box>) : null}
        </Box>);
                                // Where the figures are drawn, a pointer resting on one shows its card floating over the chat above them, taking no room
                                return marker ? (<Box flexDirection="column">
          {marker}
          {row}
        </Box>) : (row);
                            };
                            // Where the app lifts the figures' cards, each drawing moves them past the places they had in the last
                            return [2 /*return*/, drawing(drawn ? usageSpacersDrawn(ui) : null)];
                    }
                });
            });
        }
        var drawBar, key, at, line, recent, isBarHeld, madeFrom, made, drawing, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!heldSends.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 1:
                    _e.sent();
                    _e.label = 2;
                case 2:
                    drawBar = function () { return drawBarNow(); };
                    if (e.surface !== 'desktop' || e.props.hasSurvey)
                        return [2 /*return*/, drawBar()];
                    key = "bar|".concat((_c = e.requestId) !== null && _c !== void 0 ? _c : '', "|").concat(e.surface, "|").concat(e.props.bodyColumns, "|").concat(e.props.isCollapsed ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 3:
                    at = _e.sent();
                    line = "bar|".concat((_d = e.requestId) !== null && _d !== void 0 ? _d : '', "|").concat(e.surface);
                    recent = newestFor(line, key);
                    isBarHeld = isTyping || (barBoxAt > 0 && at - barBoxAt < BAR_BOX_HELD);
                    if (recent && !isBarHeld && isPressHeld(at))
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    if (recent && !isBarHeld && isFreshTooSoon($, key, at, isPanelSlow(at)))
                        return [2 /*return*/, recent];
                    freshBegins(key, at);
                    madeFrom = Date.now();
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, , 8, 9]);
                    return [4 /*yield*/, drawBar()
                        // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    ];
                case 5:
                    drawing = _e.sent();
                    _a = recent && !isBarHeld;
                    if (!_a) return [3 /*break*/, 7];
                    _b = isPressHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 6:
                    _a = _b.apply(void 0, [_e.sent()]);
                    _e.label = 7;
                case 7:
                    // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    if (_a)
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    paneNewest.set(line, { key: key, drawing: drawing });
                    made = { at: at, ms: drawnFor(madeFrom), fresh: freshness };
                    return [2 /*return*/, drawing];
                case 8:
                    freshEnds($, key, made);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
