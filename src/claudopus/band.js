// Above the prompt: the small octopus while work runs, and how Claude uses this computer
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
        ? "\u25CF ".concat(waitsAtTop, " ").concat(waitsAtTop === 1 ? 'question' : 'questions', " waiting for you").concat(firstAtTop ? " \u00B7 first: ".concat(firstAtTop) : '').concat(isScrolled(surface) && finishedAtTop.length ? " \u00B7 ".concat(finishedAtTop.length, " done") : '')
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
                // The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: the work the reply goes to on a
                // line of its own, the box under it as wide as the bar and BOX_ROWS lines tall whatever it holds, and under it, a gap below it
                // what Enter does beside Send, the big one, and Close, small, which takes the box away again with what was typed kept for its card
                // (17 Nov, the person: the box was "very small" and "doesn't extend taller"; one row of a field drawn as narrow as the app makes
                // one, beside the title and buttons). The box names no submitLabel: the desktop app draws one as a second, small send button
                // beside it, and with one a box of several lines sends only on Cmd+Enter; without it Enter sends and Shift+Enter makes a new line.
                // Nothing in it follows the panel's scrolling. The box is the card's own: the same answer, and the same box through a new question
                // of its work, until the person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
                // Opened by Change something on a Done card (isChange), it is the same box for a card that asks nothing: what to change, sent to
                // that task, and Cancel in place of Close
            ];
        }
    });
}); };
// The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: the work the reply goes to on a
// line of its own, the box under it as wide as the bar and BOX_ROWS lines tall whatever it holds, and under it, a gap below it
// what Enter does beside Send, the big one, and Close, small, which takes the box away again with what was typed kept for its card
// (17 Nov, the person: the box was "very small" and "doesn't extend taller"; one row of a field drawn as narrow as the app makes
// one, beside the title and buttons). The box names no submitLabel: the desktop app draws one as a second, small send button
// beside it, and with one a box of several lines sends only on Cmd+Enter; without it Enter sends and Shift+Enter makes a new line.
// Nothing in it follows the panel's scrolling. The box is the card's own: the same answer, and the same box through a new question
// of its work, until the person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
// Opened by Change something on a Done card (isChange), it is the same box for a card that asks nothing: what to change, sent to
// that task, and Cancel in place of Close
var barReply = function ($, ui, one, isChange) {
    if (isChange === void 0) { isChange = false; }
    var draft = isChange ? changeDraft(one.id) : barDraft(one.id);
    var send = isChange ? function (value) { var _a; return void (value.trim() && ((barBoxAt = 0), (changeTo = ''), dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), sendChange($, one.id, value).catch(function (err) { return log($, "change not sent: ".concat(String(err))); }))); } : function (value) { var _a; return void ((barBoxAt = 0), dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), sendFromBar($, one.id, value).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); })); };
    return (<ui.Box key="band-reply" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={isChange ? undefined : NEEDS} bold wrap="truncate-end">{isChange ? "".concat(cut(titleOf(one), 60), " \u00B7 ").concat(CHANGE_WHAT) : "\u21B3 Your answer to \u201C".concat(cut(titleOf(one), 60), "\u201D")}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (<ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input key={isChange ? changeBoxKey(one.id) : barBoxKey(one.id)} placeholder={isChange ? 'Type what to change' : 'Type your reply'} value={draftDrawn(draft)} rows={BOX_ROWS} autoFocus onInput={function (value) { return void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($), $.clock.now().then(function (at) { return (barBoxAt = at); })); }} onSubmit={send}/>
        </ui.Box>) : null}
      {barFoot($, ui, isChange ? 'band-change' : 'band-reply', presses, function () { var _a, _b; return void (((_a = drafts.get(draft)) !== null && _a !== void 0 ? _a : '').trim() && send((_b = drafts.get(draft)) !== null && _b !== void 0 ? _b : '')); }, function (press) { return (isChange ? openChange($, undefined, press.surface) : openReply($, undefined, press.surface)); }, true, isChange ? 'Cancel' : 'Close')}
    </ui.Box>);
};
// Under a box in the bar: what Enter does, and Send, the big one, then Close, small
var BOX_KEYS = 'Enter sends · Shift+Enter for a new line';
var barFoot = function ($, ui, where, mark, onSend, onClose, isLines, close) {
    if (isLines === void 0) { isLines = true; }
    if (close === void 0) { close = 'Close'; }
    return (<ui.Box key={"".concat(where, "-foot")} flexDirection="row" alignItems="center" gap={2} flexShrink={0} marginTop={1}>
    <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
      <ui.Text dimColor wrap="truncate-end">{isLines ? BOX_KEYS : 'Enter sends'}</ui.Text>
    </ui.Box>
    <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <ui.Button key={"".concat(where, "-send-").concat(mark)} label="Send" variant="primary" onPress={onSend}/>
      <ui.Button key={"".concat(where, "-close-").concat(mark)} label={close} plain dimColor onPress={onClose}/>
    </ui.Box>
  </ui.Box>);
};
// The bar as last drawn on each surface while a reply box was in it: while the person types, and for as long as the box holds the
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
var barShape = function () {
    var _a;
    var keyBox = barKeyTarget();
    if (boxOpen && keyBox)
        return "key|".concat(barKeyBoxKey(keyBox.id, boxOpen.mode), "|").concat((_a = boxSaid.get(keyBox.id)) !== null && _a !== void 0 ? _a : '', "|").concat(boxHeldReply.has(keyBox.id));
    if (changeTo)
        return "change|".concat(changeBoxKey(changeTo), "|").concat(barCardsDrawn);
    return replyTo ? "reply|".concat(barBoxKey(replyTo), "|").concat(barCardsDrawn) : '';
};
// What the cards say of the box open in the bar as last looked at: its card, still asking, under its title. Part of the held shape,
// so a card that stops asking (answered elsewhere, its question withdrawn, the work stopped) takes its box away within a second
var barCardsDrawn = '';
// The Done card the box was opened on by Change something, while it is still done: at work again, or asking, its box goes
var changeTarget = function (cards) { return (changeTo ? cards.find(function (one) { return one.id === changeTo && canChange(asPressed(one)); }) : undefined); };
var barCardsSign = function (cards) {
    var changing = changeTarget(cards);
    if (changing)
        return "".concat(changing.id, "|").concat(titleOf(changing));
    var target = barTarget(cards);
    return (target === null || target === void 0 ? void 0 : target.ask) ? "".concat(target.id, "|").concat(titleOf(target)) : '';
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
                if (!barHeld.size || !(replyTo || changeTo))
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
                var canBox, flipAt, kept, isHeldNow, _a, _b, cards, open_1, bandAt, bandKept, shown, working, happy, ui, Box, Button, Text, asking, first_1, ask_1, answers, id_1, picked_1, press_1, _c, _d, _e, _f, keyBox, shape, marker_1, row, drawing_1, _g, _h, _j, changing, target, shape, marker_2, reply, drawing_2, _k, _l, _m, isPanelAway, _o, figures, _p, marker, drawn, drawing;
                var _q, _r;
                var _s, _t, _u, _v, _w;
                return __generator(this, function (_x) {
                    switch (_x.label) {
                        case 0:
                            canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed;
                            if (e.requestId)
                                barIds.set(e.surface, e.requestId);
                            return [4 /*yield*/, $.clock.now()
                                // A box open and drawn as it is: given again as it was, reading no cards (barHeld)
                            ];
                        case 1:
                            flipAt = _x.sent();
                            kept = barHeld.get(e.surface);
                            if (!(kept && canBox && barBoxes.has(e.surface) && (replyTo || boxOpen || changeTo) && kept.shape === barShape())) return [3 /*break*/, 4];
                            isHeldNow = isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD);
                            _a = isHeldNow;
                            if (_a) return [3 /*break*/, 3];
                            _b = kept.mark;
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 2:
                            _a = _b === (_x.sent());
                            _x.label = 3;
                        case 3:
                            if (_a)
                                return [2 /*return*/, ((isBarSettling = false), kept.drawing)];
                            _x.label = 4;
                        case 4: return [4 /*yield*/, read($, todos)];
                        case 5:
                            cards = _x.sent();
                            if (canBox !== barBoxes.has(e.surface)) {
                                if (canBox)
                                    barBoxes.add(e.surface);
                                else
                                    barBoxes.delete(e.surface);
                                open_1 = canBox ? undefined : cards.find(function (one) { return one.id === replyTo; });
                                if (open_1)
                                    (carryDraft($, open_1, barDraft(open_1.id)), freeTimes($));
                                if (!canBox)
                                    ((replyTo = ''), (replyMark = ''), (changeTo = ''), (boxOpen = undefined), barHeld.delete(e.surface));
                                barBoxAt = 0;
                                // Only a card that asks is drawn differently for it
                                // and a key box, whose buttons or field are drawn by it too
                                // and a Done card, whose Change something is there only with the box
                                if ((asksForBar(cards).length || boxes.some(function (one) { return !one.key; }) || cards.some(function (one) { return canChange(asPressed(one)); })) && flipAt - barFlipAt >= 1000)
                                    ((barFlipAt = flipAt), drawAgain($));
                            }
                            if (e.props.hasSurvey)
                                return [2 /*return*/, next(e)];
                            return [4 /*yield*/, $.clock.now()];
                        case 6:
                            bandAt = _x.sent();
                            return [4 /*yield*/, read($, reports)
                                // (each card as it is shown: never done while something of its own runs or to-dos are left)
                            ];
                        case 7:
                            bandKept = _x.sent();
                            shown = shownAs(cards, function (one) { return openResultWaits(one, bandKept, bandAt).length > 0; });
                            working = shown.filter(function (one) { return !one.parentId && one.status === 'working'; });
                            happy = isHappy(shown.filter(function (one) { return !one.leftOpen && !openResultWaits(one, bandKept, bandAt).length; }), bandAt);
                            if (!happy) return [3 /*break*/, 9];
                            return [4 /*yield*/, read($, tick)];
                        case 8:
                            _x.sent();
                            _x.label = 9;
                        case 9:
                            ui = uiOf($, e);
                            Box = ui.Box, Button = ui.Button, Text = ui.Text;
                            if (!(e.surface === 'terminal')) return [3 /*break*/, 14];
                            asking = __spreadArray([], cards.filter(function (one) { return !one.parentId && one.ask; }), true).sort(function (a, b) { var _a, _b, _c, _d, _e, _f; return Number(needsPerson(b)) - Number(needsPerson(a)) || ((_c = (_a = topPlaces.get("//".concat(a.id))) !== null && _a !== void 0 ? _a : (_b = a.ask) === null || _b === void 0 ? void 0 : _b.at) !== null && _c !== void 0 ? _c : 0) - ((_f = (_d = topPlaces.get("//".concat(b.id))) !== null && _d !== void 0 ? _d : (_e = b.ask) === null || _e === void 0 ? void 0 : _e.at) !== null && _f !== void 0 ? _f : 0); });
                            first_1 = asking[0];
                            ask_1 = first_1 === null || first_1 === void 0 ? void 0 : first_1.ask;
                            if (!(first_1 && ask_1)) return [3 /*break*/, 14];
                            answers = (((_s = ask_1.choices) === null || _s === void 0 ? void 0 : _s.length) ? ask_1.choices : DEFAULT_ANSWERS).slice(0, 9);
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
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 10:
                            if (!isActingOnReply(first_1)) return [3 /*break*/, 12];
                            _d = "    ".concat;
                            _e = sentLine;
                            _f = [first_1];
                            return [4 /*yield*/, $.clock.now()];
                        case 11:
                            _c = (<Text key="band-ask-replied" dimColor wrap="truncate-end">{_d.apply("    ", [_e.apply(void 0, _f.concat([_x.sent()])) || "\u2713 You replied \u201C".concat(cut((_u = (_t = ask_1.replied) === null || _t === void 0 ? void 0 : _t.text) !== null && _u !== void 0 ? _u : '', 60), "\u201D")])}</Text>);
                            return [3 /*break*/, 13];
                        case 12:
                            _c = (<Box flexDirection="column">
                {/* The chat's notice is the question alone: what it is about is on its card */}
                {ask_1.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{'    The details are on its card'}</Text> : null}
                {ask_1.copy ? <Text key="band-ask-copy" wrap="truncate-end">{"    ".concat(oneLine(ask_1.copy))}</Text> : null}
                <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                  {answers.map(function (choice, n) { return (<Button key={"band-ask-".concat(first_1.id, "-").concat(ask_1.at, "-").concat(n)} label={choice} plain hotkey={String(n + 1)} onPress={function () { return press_1(n, choice); }}/>); })}
                  <Text dimColor={picked_1 < 0} color={picked_1 < 0 ? undefined : needsPerson(first_1) ? NEEDS : LIVE}>
                    {picked_1 >= 0 ? "Type ".concat(picked_1 + 1, " again to answer \u201C").concat((_v = answers[picked_1]) !== null && _v !== void 0 ? _v : '', "\u201D") : "Type its number twice in an empty box".concat(asking.filter(needsPerson).length > Number(needsPerson(first_1)) ? " \u00B7 ".concat(asking.filter(needsPerson).length - Number(needsPerson(first_1)), " more waiting") : '', " \u00B7 /claudopus to answer in words")}
                  </Text>
                </Box>
              </Box>);
                            _x.label = 13;
                        case 13: return [2 /*return*/, (<Box flexDirection="column">
            {_x.sent()}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first_1) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first_1) ? 'Claudopus, waiting for you' : 'Claudopus, Claude is working on your reply', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{"".concat(titleOf(first_1), ": ")}</Text>
                  <Text color={needsPerson(first_1) ? NEEDS : LIVE} bold>{cut(oneLine(ask_1.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {/* Acted on after the person's reply in words: that reply, and nothing to press */}
            {_c}
          </Box>)];
                        case 14:
                            keyBox = canBox ? barKeyTarget() : undefined;
                            if (boxOpen && canBox && !keyBox)
                                boxOpen = undefined;
                            if (!(keyBox && boxOpen)) return [3 /*break*/, 17];
                            shape = barShape();
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 15:
                            marker_1 = _x.sent();
                            row = barKeyRow($, ui, keyBox, boxOpen.mode);
                            drawing_1 = marker_1 ? (<Box flexDirection="column">
          {marker_1}
          {row}
        </Box>) : (row);
                            _h = (_g = barHeld).set;
                            _j = [e.surface];
                            _q = { shape: shape };
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 16:
                            _h.apply(_g, _j.concat([(_q.mark = _x.sent(), _q.drawing = drawing_1, _q)]));
                            settleBar($);
                            return [2 /*return*/, drawing_1];
                        case 17:
                            changing = canBox ? changeTarget(cards) : undefined;
                            if (changeTo && canBox && !changing)
                                changeTo = '';
                            target = changing !== null && changing !== void 0 ? changing : (canBox ? barTarget(cards) : undefined);
                            if (replyTo && canBox && !target)
                                ((replyTo = ''), (replyMark = ''));
                            if (!(changing || (target === null || target === void 0 ? void 0 : target.ask))) return [3 /*break*/, 20];
                            // Drawn as it was while the box is typed in or holds the cursor: only the card it is for draws it anew, so neither the panel
                            // scrolled under the cursor nor work starting or ending puts a new box under it. The row takes the place of the figures
                            // while it is open: figures drawn under a held box would stand still, and a row that came and went would move the box
                            barCardsDrawn = barCardsSign(cards);
                            shape = barShape();
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 18:
                            marker_2 = _x.sent();
                            reply = barReply($, ui, target, Boolean(changing));
                            drawing_2 = marker_2 ? (<Box flexDirection="column">
          {marker_2}
          {reply}
        </Box>) : (reply);
                            _l = (_k = barHeld).set;
                            _m = [e.surface];
                            _r = { shape: shape };
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 19:
                            _l.apply(_k, _m.concat([(_r.mark = _x.sent(), _r.drawing = drawing_2, _r)]));
                            settleBar($);
                            return [2 /*return*/, drawing_2];
                        case 20:
                            barHeld.delete(e.surface);
                            if (!(!working.length && !happy)) return [3 /*break*/, 22];
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 21: return [2 /*return*/, (_w = (_x.sent())) !== null && _w !== void 0 ? _w : next(e)
                            // A narrow terminal seats no panel until it is asked for: the band says how
                        ];
                        case 22:
                            _o = e.surface === 'terminal';
                            if (!_o) return [3 /*break*/, 24];
                            return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                        case 23:
                            _o = !(_x.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
                            _x.label = 24;
                        case 24:
                            isPanelAway = _o;
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            return [4 /*yield*/, read($, figuresAt)];
                        case 25:
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            _x.sent();
                            _p = usageNow;
                            return [4 /*yield*/, $.clock.now()];
                        case 26:
                            figures = _p.apply(void 0, [_x.sent()]);
                            if (!figures)
                                void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 27:
                            marker = _x.sent();
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
        var drawBar, key, at, recent, isBarHeld, madeFrom, made, drawing, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!heldSends.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    drawBar = function () { return drawBarNow(); };
                    if (e.surface !== 'desktop' || e.props.hasSurvey)
                        return [2 /*return*/, drawBar()];
                    key = "bar|".concat((_c = e.requestId) !== null && _c !== void 0 ? _c : '', "|").concat(e.surface, "|").concat(e.props.bodyColumns, "|").concat(e.props.isCollapsed ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 3:
                    at = _d.sent();
                    recent = lastShown.get(key);
                    isBarHeld = isTyping || (barBoxAt > 0 && at - barBoxAt < BAR_BOX_HELD);
                    if (recent && !isBarHeld && isPressHeld(at))
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    if (recent && !isBarHeld && isFreshTooSoon($, key, at, isPanelSlow(at)))
                        return [2 /*return*/, recent];
                    freshBegins(key);
                    madeFrom = Date.now();
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, , 8, 9]);
                    return [4 /*yield*/, drawBar()
                        // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    ];
                case 5:
                    drawing = _d.sent();
                    _a = recent && !isBarHeld;
                    if (!_a) return [3 /*break*/, 7];
                    _b = isPressHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 6:
                    _a = _b.apply(void 0, [_d.sent()]);
                    _d.label = 7;
                case 7:
                    // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    if (_a)
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    lastShown.set(key, drawing);
                    made = { at: at, ms: Date.now() - madeFrom, fresh: freshness };
                    return [2 /*return*/, drawing];
                case 8:
                    freshEnds($, key, made);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
