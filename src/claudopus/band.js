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
// Above the prompt, which never scrolls: once the list is scrolled away from its top, how many things wait there for the person.
// Pressed, it takes the list back to its top; nothing else moves the list
// Work that just finished, in its moment at the top, is pointed at the same way, in green, under what waits
var isMarkerShown = function ($, surface) { return __awaiter(_this, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = (waitsAtTop > 0 || finishedAtTop.length > 0) && ((_b = listOffsets.get(surface)) !== null && _b !== void 0 ? _b : 0) > 0;
            if (!_a) return [3 /*break*/, 2];
            return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
        case 1:
            _a = (_c.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
            _c.label = 2;
        case 2: return [2 /*return*/, _a];
    }
}); }); };
// What the marker says, empty when it is not drawn: a bar held with a box in it is drawn again when this moves, but not while the
// box is typed in or holds the cursor
var markerSign = function ($, surface) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, isMarkerShown($, surface)];
        case 1: return [2 /*return*/, ((_a.sent()) ? "".concat(waitsAtTop, "|").concat(finishedAtTop.join('|')) : '')];
    }
}); }); };
var waitMarker = function ($, ui, surface) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, isMarkerShown($, surface)];
            case 1: return [2 /*return*/, (_a.sent()) ? (<ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden">
      <ui.Button key={"band-waits-".concat(presses)} plain hover={{ scope: 'band-waits', underline: true }} onPress={function () { return ((presses += 1), void (recordEvent($, 'scroll-call', { to: 'start' }), $.ui.scroll({ in: LIST, to: 'start', block: 'start' })).catch(function () { return undefined; })); }}>
        {waitsAtTop > 0 ? (<ui.Text color={NEEDS} bold wrap="truncate-end">{"\u2191 ".concat(waitsAtTop === 1 ? '1 thing is' : "".concat(waitsAtTop, " things are"), " waiting for you at the top of the panel").concat(finishedAtTop.length ? " \u00B7 ".concat(finishedAtTop.length, " just finished") : '')}</ui.Text>) : (<ui.Text color={DONE} bold wrap="truncate-end">{"\u2191 ".concat(finishedAtTop.length === 1 ? "".concat(finishedAtTop[0], " finished") : "".concat(finishedAtTop.length, " just finished"), ", at the top of the panel")}</ui.Text>)}
      </ui.Button>
    </ui.Box>) : null
                // The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: the work the reply goes to on a
                // line of its own, the box under it as wide as the bar and as tall as its text, as the chat's own box is (boxRows), and under it
                // what Enter does beside Send, the big one, and Close, small, which takes the box away again with what was typed kept for its card
                // (17 Nov, the person: the box was "very small" and "doesn't extend taller"; one row of a field drawn as narrow as the app makes
                // one, beside the title and buttons). The box names no submitLabel: the desktop app draws one as a second, small send button
                // beside it, and with one a box of several lines sends only on Cmd+Enter; without it Enter sends and Shift+Enter makes a new line.
                // Nothing in it follows the panel's scrolling. The box is the card's own: the same answer, and the same box through a new question
                // of its work, until the person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
            ];
        }
    });
}); };
// The reply box the person opened from a card (asking.tsx, openReply), in the bar above the prompt: the work the reply goes to on a
// line of its own, the box under it as wide as the bar and as tall as its text, as the chat's own box is (boxRows), and under it
// what Enter does beside Send, the big one, and Close, small, which takes the box away again with what was typed kept for its card
// (17 Nov, the person: the box was "very small" and "doesn't extend taller"; one row of a field drawn as narrow as the app makes
// one, beside the title and buttons). The box names no submitLabel: the desktop app draws one as a second, small send button
// beside it, and with one a box of several lines sends only on Cmd+Enter; without it Enter sends and Shift+Enter makes a new line.
// Nothing in it follows the panel's scrolling. The box is the card's own: the same answer, and the same box through a new question
// of its work, until the person closes or moves it. It takes the cursor when the person clicks anywhere in the bar (autoFocus)
var barReply = function ($, ui, one, columns) {
    var _a;
    var draft = barDraft(one.id);
    var rows = boxRows((_a = drafts.get(draft)) !== null && _a !== void 0 ? _a : '', columns);
    var send = function (value) { var _a; return void ((barBoxAt = 0), dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), sendFromBar($, one.id, value).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); })); };
    return (<ui.Box key="band-reply" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={NEEDS} bold wrap="truncate-end">{"\u21B3 Your reply to \u201C".concat(cut(titleOf(one), 60), "\u201D")}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (<ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input key={barBoxKey(one.id)} placeholder="Type your reply" value={draftDrawn(draft)} rows={rows} autoFocus onInput={function (value) { return void (drafts.set(draft, value), keepDraft($, draft, value), holdTimes($), $.clock.now().then(function (at) { return (barBoxAt = at); }), growBox($, barBoxKey(one.id), rows, boxRows(value, columns))); }} onSubmit={send}/>
        </ui.Box>) : null}
      {barFoot($, ui, 'band-reply', presses, function () { var _a, _b; return void (((_a = drafts.get(draft)) !== null && _a !== void 0 ? _a : '').trim() && send((_b = drafts.get(draft)) !== null && _b !== void 0 ? _b : '')); }, function (press) { return openReply($, undefined, press.surface); })}
    </ui.Box>);
};
// Under a box in the bar: what Enter does, and Send, the big one, then Close, small
var BOX_KEYS = 'Enter sends · Shift+Enter for a new line';
var barFoot = function ($, ui, where, mark, onSend, onClose, isLines) {
    if (isLines === void 0) { isLines = true; }
    return (<ui.Box key={"".concat(where, "-foot")} flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
    <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
      <ui.Text dimColor wrap="truncate-end">{isLines ? BOX_KEYS : 'Enter sends'}</ui.Text>
    </ui.Box>
    <ui.Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
      <ui.Button key={"".concat(where, "-send-").concat(mark)} label="Send" variant="primary" onPress={onSend}/>
      <ui.Button key={"".concat(where, "-close-").concat(mark)} label="Close" plain dimColor onPress={onClose}/>
    </ui.Box>
  </ui.Box>);
};
// A box whose text now needs another number of lines is drawn again at that height, once for each height asked: a box of `rows`
// stays that tall whatever it holds. Drawn with the text it was last drawn with, the box keeps what is typed in it (draftDrawn)
var rowsAsked = new Map();
var growBox = function ($, key, drawn, wanted) {
    if (wanted === drawn || rowsAsked.get(key) === wanted)
        return;
    rowsAsked.set(key, wanted);
    drawAgain($);
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
// The width the bar was last drawn at on each surface, in columns: what a box in it wraps at (boxRows)
var barColumns = new Map();
// What a bar with a box open is drawn for, from the mod's own memory alone: which box, and how many lines tall
var barShape = function (surface) {
    var _a, _b, _c, _d;
    var columns = (_a = barColumns.get(surface)) !== null && _a !== void 0 ? _a : 80;
    var keyBox = barKeyTarget();
    if (boxOpen && keyBox)
        return "key|".concat(barKeyBoxKey(keyBox.id, boxOpen.mode), "|").concat((_b = boxSaid.get(keyBox.id)) !== null && _b !== void 0 ? _b : '', "|").concat(boxHeldReply.has(keyBox.id), "|").concat((_c = barKeyRows(keyBox.id, boxOpen.mode, columns)) !== null && _c !== void 0 ? _c : 1);
    return replyTo ? "reply|".concat(barBoxKey(replyTo), "|").concat(boxRows((_d = drafts.get(barDraft(replyTo))) !== null && _d !== void 0 ? _d : '', columns)) : '';
};
// What the cards say of the box open in the bar as it was drawn: its card, still asking, under its title
var barCardsDrawn = '';
var barCardsSign = function (cards) {
    var target = barTarget(cards);
    return (target === null || target === void 0 ? void 0 : target.ask) ? "".concat(target.id, "|").concat(titleOf(target)) : '';
};
// Once a second while a bar holds a box (chat.tsx): the cards it shows moved, so it is drawn again, once for each change
var lookBar = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var sign, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!barHeld.size || !replyTo)
                    return [2 /*return*/];
                _a = barCardsSign;
                return [4 /*yield*/, read($, todos)];
            case 1:
                sign = _a.apply(void 0, [_b.sent()]);
                if (sign === barCardsDrawn)
                    return [2 /*return*/];
                barCardsDrawn = sign;
                drawAgain($);
                return [2 /*return*/];
        }
    });
}); };
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
                var canBox, flipAt, kept, isHeldNow, _a, _b, cards, open_1, working, happy, _c, _d, ui, Box, Button, Text, asking, first_1, ask_1, answers, id_1, picked_1, press_1, _e, _f, _g, _h, keyBox, shape, marker_1, row, drawing_1, _j, _k, _l, target, shape, marker_2, reply, drawing_2, _m, _o, _p, isPanelAway, _q, figures, _r, marker, drawn, drawing;
                var _s, _t;
                var _u, _v, _w, _x, _y;
                return __generator(this, function (_z) {
                    switch (_z.label) {
                        case 0:
                            canBox = e.surface === 'desktop' && 'Input' in uiOf($, e) && !e.props.hasSurvey && !e.props.isCollapsed;
                            if (e.requestId)
                                barIds.set(e.surface, e.requestId);
                            return [4 /*yield*/, $.clock.now()];
                        case 1:
                            flipAt = _z.sent();
                            if (canBox)
                                barColumns.set(e.surface, e.props.bodyColumns);
                            kept = barHeld.get(e.surface);
                            if (!(kept && canBox && barBoxes.has(e.surface) && (replyTo || boxOpen) && kept.shape === barShape(e.surface))) return [3 /*break*/, 4];
                            isHeldNow = isTyping || (barBoxAt > 0 && flipAt - barBoxAt < BAR_BOX_HELD);
                            _a = isHeldNow;
                            if (_a) return [3 /*break*/, 3];
                            _b = kept.mark;
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 2:
                            _a = _b === (_z.sent());
                            _z.label = 3;
                        case 3:
                            if (_a)
                                return [2 /*return*/, kept.drawing];
                            _z.label = 4;
                        case 4: return [4 /*yield*/, read($, todos)];
                        case 5:
                            cards = _z.sent();
                            if (canBox !== barBoxes.has(e.surface)) {
                                if (canBox)
                                    barBoxes.add(e.surface);
                                else
                                    barBoxes.delete(e.surface);
                                open_1 = canBox ? undefined : cards.find(function (one) { return one.id === replyTo; });
                                if (open_1)
                                    (carryDraft($, open_1, barDraft(open_1.id)), freeTimes($));
                                if (!canBox)
                                    ((replyTo = ''), (replyMark = ''), (boxOpen = undefined), barHeld.delete(e.surface));
                                barBoxAt = 0;
                                // Only a card that asks is drawn differently for it
                                // and a key box, whose buttons or field are drawn by it too
                                if ((asksForBar(cards).length || boxes.some(function (one) { return !one.key; })) && flipAt - barFlipAt >= 1000)
                                    ((barFlipAt = flipAt), drawAgain($));
                            }
                            if (e.props.hasSurvey)
                                return [2 /*return*/, next(e)];
                            working = cards.filter(function (one) { return !one.parentId && one.status === 'working'; });
                            _c = isHappy;
                            _d = [cards];
                            return [4 /*yield*/, $.clock.now()];
                        case 6:
                            happy = _c.apply(void 0, _d.concat([_z.sent()]));
                            if (!happy) return [3 /*break*/, 8];
                            return [4 /*yield*/, read($, tick)];
                        case 7:
                            _z.sent();
                            _z.label = 8;
                        case 8:
                            ui = uiOf($, e);
                            Box = ui.Box, Button = ui.Button, Text = ui.Text;
                            if (!(e.surface === 'terminal')) return [3 /*break*/, 13];
                            asking = __spreadArray([], cards.filter(function (one) { return !one.parentId && one.ask; }), true).sort(function (a, b) { return Number(needsPerson(b)) - Number(needsPerson(a)); });
                            first_1 = asking[0];
                            ask_1 = first_1 === null || first_1 === void 0 ? void 0 : first_1.ask;
                            if (!(first_1 && ask_1)) return [3 /*break*/, 13];
                            answers = (((_u = ask_1.choices) === null || _u === void 0 ? void 0 : _u.length) ? ask_1.choices : DEFAULT_ANSWERS).slice(0, 9);
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
                        case 9:
                            if (!isActingOnReply(first_1)) return [3 /*break*/, 11];
                            _f = "    ".concat;
                            _g = sentLine;
                            _h = [first_1];
                            return [4 /*yield*/, $.clock.now()];
                        case 10:
                            _e = (<Text key="band-ask-replied" dimColor wrap="truncate-end">{_f.apply("    ", [_g.apply(void 0, _h.concat([_z.sent()])) || "\u2713 You replied \u201C".concat(cut((_w = (_v = ask_1.replied) === null || _v === void 0 ? void 0 : _v.text) !== null && _w !== void 0 ? _w : '', 60), "\u201D")])}</Text>);
                            return [3 /*break*/, 12];
                        case 11:
                            _e = (<Box flexDirection="column">
                {/* The chat's notice with what it is about went only to the chat that started the work */}
                {ask_1.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first_1) ? '    The details are in the chat above and on its card' : '    The details are on its card'}</Text> : null}
                {ask_1.copy ? <Text key="band-ask-copy" wrap="truncate-end">{"    ".concat(oneLine(ask_1.copy))}</Text> : null}
                <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                  {answers.map(function (choice, n) { return (<Button key={"band-ask-".concat(first_1.id, "-").concat(ask_1.at, "-").concat(n)} label={choice} plain hotkey={String(n + 1)} onPress={function () { return press_1(n, choice); }}/>); })}
                  <Text dimColor={picked_1 < 0} color={picked_1 < 0 ? undefined : needsPerson(first_1) ? NEEDS : LIVE}>
                    {picked_1 >= 0 ? "Press ".concat(picked_1 + 1, " again to answer \u201C").concat((_x = answers[picked_1]) !== null && _x !== void 0 ? _x : '', "\u201D") : "press its number twice in the empty prompt".concat(asking.filter(needsPerson).length > Number(needsPerson(first_1)) ? " \u00B7 ".concat(asking.filter(needsPerson).length - Number(needsPerson(first_1)), " more waiting") : '', " \u00B7 /claudopus to reply in words")}
                  </Text>
                </Box>
              </Box>);
                            _z.label = 12;
                        case 12: return [2 /*return*/, (<Box flexDirection="column">
            {_z.sent()}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first_1) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first_1) ? 'Claudopus, something needs you' : 'Claudopus is working on your reply', $, { surface: e.surface, requestId: e.requestId })}
              <Box flexShrink={1} minWidth={0}>
                <Text wrap="wrap">
                  <Text dimColor>{"".concat(titleOf(first_1), ": ")}</Text>
                  <Text color={needsPerson(first_1) ? NEEDS : LIVE} bold>{cut(oneLine(ask_1.text), Math.max(80, e.props.bodyColumns * 3))}</Text>
                </Text>
              </Box>
            </Box>
            {/* Acted on after the person's reply in words: that reply, and nothing to press */}
            {_e}
          </Box>)];
                        case 13:
                            keyBox = canBox ? barKeyTarget() : undefined;
                            if (boxOpen && canBox && !keyBox)
                                boxOpen = undefined;
                            if (!(keyBox && boxOpen)) return [3 /*break*/, 16];
                            shape = barShape(e.surface);
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 14:
                            marker_1 = _z.sent();
                            row = barKeyRow($, ui, keyBox, boxOpen.mode, e.props.bodyColumns);
                            drawing_1 = marker_1 ? (<Box flexDirection="column">
          {marker_1}
          {row}
        </Box>) : (row);
                            _k = (_j = barHeld).set;
                            _l = [e.surface];
                            _s = { shape: shape };
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 15:
                            _k.apply(_j, _l.concat([(_s.mark = _z.sent(), _s.drawing = drawing_1, _s)]));
                            return [2 /*return*/, drawing_1];
                        case 16:
                            target = canBox ? barTarget(cards) : undefined;
                            if (replyTo && canBox && !target)
                                ((replyTo = ''), (replyMark = ''));
                            if (!(target === null || target === void 0 ? void 0 : target.ask)) return [3 /*break*/, 19];
                            shape = barShape(e.surface);
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 17:
                            marker_2 = _z.sent();
                            reply = barReply($, ui, target, e.props.bodyColumns);
                            drawing_2 = marker_2 ? (<Box flexDirection="column">
          {marker_2}
          {reply}
        </Box>) : (reply);
                            _o = (_m = barHeld).set;
                            _p = [e.surface];
                            _t = { shape: shape };
                            return [4 /*yield*/, markerSign($, e.surface)];
                        case 18:
                            _o.apply(_m, _p.concat([(_t.mark = _z.sent(), _t.drawing = drawing_2, _t)]));
                            barCardsDrawn = barCardsSign(cards);
                            return [2 /*return*/, drawing_2];
                        case 19:
                            barHeld.delete(e.surface);
                            if (!(!working.length && !happy)) return [3 /*break*/, 21];
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 20: return [2 /*return*/, (_y = (_z.sent())) !== null && _y !== void 0 ? _y : next(e)
                            // A narrow terminal seats no panel until it is asked for: the band says how
                        ];
                        case 21:
                            _q = e.surface === 'terminal';
                            if (!_q) return [3 /*break*/, 23];
                            return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                        case 22:
                            _q = !(_z.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
                            _z.label = 23;
                        case 23:
                            isPanelAway = _q;
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            return [4 /*yield*/, read($, figuresAt)];
                        case 24:
                            // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                            // network's speed, looked at every few seconds while work runs. New figures redraw it
                            _z.sent();
                            _r = usageNow;
                            return [4 /*yield*/, $.clock.now()];
                        case 25:
                            figures = _r.apply(void 0, [_z.sent()]);
                            if (!figures)
                                void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                            return [4 /*yield*/, waitMarker($, ui, e.surface)];
                        case 26:
                            marker = _z.sent();
                            drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null;
                            drawing = function (spacers) {
                                var _a;
                                var row = (<Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {(_a = octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, task finished' : 'Claudopus, working', $, { surface: e.surface, requestId: e.requestId })) !== null && _a !== void 0 ? _a : <Text dimColor>•••</Text>}
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
        var drawBar, key, at, recent, isBoxHeld, madeFrom, made, drawing, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    drawBar = function () { return drawBarNow(); };
                    if (e.surface !== 'desktop' || e.props.hasSurvey)
                        return [2 /*return*/, drawBar()];
                    key = "bar|".concat((_c = e.requestId) !== null && _c !== void 0 ? _c : '', "|").concat(e.surface, "|").concat(e.props.bodyColumns, "|").concat(e.props.isCollapsed ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    at = _d.sent();
                    recent = lastShown.get(key);
                    isBoxHeld = isTyping || (barBoxAt > 0 && at - barBoxAt < BAR_BOX_HELD);
                    if (recent && !isBoxHeld && isPressHeld(at))
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    if (recent && !isBoxHeld && isFreshTooSoon($, key, at, isPanelSlow(at)))
                        return [2 /*return*/, recent];
                    freshBegins(key);
                    madeFrom = Date.now();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 6, 7]);
                    return [4 /*yield*/, drawBar()
                        // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    ];
                case 3:
                    drawing = _d.sent();
                    _a = recent && !isBoxHeld;
                    if (!_a) return [3 /*break*/, 5];
                    _b = isPressHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 4:
                    _a = _b.apply(void 0, [_d.sent()]);
                    _d.label = 5;
                case 5:
                    // A click begun while it was made: the bar on screen is given instead, and this one made again once the click is over
                    if (_a)
                        return [2 /*return*/, ((isPressMissed = true), recent)];
                    lastShown.set(key, drawing);
                    made = { at: at, ms: Date.now() - madeFrom, fresh: freshness };
                    return [2 /*return*/, drawing];
                case 6:
                    freshEnds($, key, made);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
};
