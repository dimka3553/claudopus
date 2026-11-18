// The panel's drawing: the Claudopus pane, a work's Details and a workflow's, every card in them
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
// Back from a tab to the panel, in the terminal: the tab is closed and the panel, opened again, holds the keys
// Handed to the press's own hook while one is answered (front), so a narrow terminal draws the panel opened again
var backToPanel = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (tabMoves.isPressing())
                    return [2 /*return*/, tabMoves.handOver({ kind: 'back', id: id })];
                return [4 /*yield*/, backAsked($, id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var backAsked = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.ui.close({ id: id }).catch(function () { return undefined; })];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.ui.close({ id: LIST }).catch(function () { return undefined; })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS, focus: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The ask whose reply box holds the terminal's keys in the list: kept on it while it waits, so an ask that comes in above it never
// takes the keys from what the person is typing
var keysAsk = '';
// Where the list's window starts on each surface, as last drawn: above the prompt says what waits at the top once it is out of sight
// (waitMarker). Forgotten when the list is closed
var listOffsets = new Map();
// How many things wait on the person at the top of the list, as last drawn, and what the first of them asks
var waitsAtTop = 0;
var firstAtTop = '';
// Where each card that waits stands at the top of the list: the moment it first came up there, kept while it stays, so what comes
// later goes under it and nothing moves by itself (by chat and card: placeKey)
var topPlaces = new Map();
// When each placed card stopped waiting (answered): kept in its place while something else still waits (only KEPT_MOST while what
// waits is all another chat's); one that asks again after that goes to the end, as anything new does
var topClosed = new Map();
var KEPT_MOST = 10 * 60000;
// When each card's admin commands first came, kept once they are answered, so its answered note stays where the box was
var gatePartAt = new Map();
// How far apart two admin commands of a card come for the second to be a part of its own: more than any batch of one step
var GATE_PART_GAP = 60000;
// The last drawing made of each pane on each surface, what a press under way keeps on screen (isPressHeld)
var lastShown = new Map();
// Each pane's drawings made afresh are numbered as they are asked for: one that finishes after a newer one (the engine dropped its
// reply, as a newer ask overtook it) is never kept as the one on screen. Kept anyway, a press hold or the gap gave that stale
// drawing again, and an answered card came back and went under the pointer (16 Nov recording: 4 drawings late, 5 flips back)
var shownAsked = new Map();
var shownKept = new Map();
// What waited on the person and how often they had pressed, as each pane's drawing on screen was made (personSign), and when the
// drawing held for their use is next drawn afresh
var shownSigns = new Map();
var shownAts = new Map();
// The mod's tabs drawn on the desktop, whose buttons a click holds the drawing for (holdForPress)
var heldTabs = new Set();
var usedUntil = 0;
// The surface the list was last drawn on: the focus says none, and only the desktop's clicks are held for (isPressHeld)
var listSurface = '';
var panelHooks = function (on) {
    // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
    // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id, isTab, key, at, recent, askedNo, madeFrom, made, drawing, _a, Box, Button, Text, body;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    id = (_b = e.requestId) !== null && _b !== void 0 ? _b : '';
                    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                    return [4 /*yield*/, noteTabAsked($, id)];
                case 1:
                    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                    _f.sent();
                    isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(function (start) { return id.startsWith(start); });
                    if (!(e.surface === 'desktop' && isTab && !id.startsWith(WORK_PANE) && !id.startsWith(FLOW_PANE))) return [3 /*break*/, 6];
                    heldTabs.add(id);
                    key = "".concat(id, "|").concat(e.surface, "|").concat(e.props.scroll.bodyRows, "|").concat((_c = e.props.bodyColumns) !== null && _c !== void 0 ? _c : '', "|").concat(e.props.scroll.offset > 0 ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    at = _f.sent();
                    recent = lastShown.get(key);
                    if (recent && isPressHeld(at))
                        return [2 /*return*/, ((isPressMissed = true), recent)
                            // (a tab is often quick to draw on its own: slow or not, it is given again while the panel's drawings are slow, as the bar is)
                        ];
                    // (a tab is often quick to draw on its own: slow or not, it is given again while the panel's drawings are slow, as the bar is)
                    if (recent && !isTyping && isFreshTooSoon($, key, at, isPanelSlow(at)))
                        return [2 /*return*/, recent];
                    freshBegins(key);
                    askedNo = ((_d = shownAsked.get(key)) !== null && _d !== void 0 ? _d : 0) + 1;
                    shownAsked.set(key, askedNo);
                    madeFrom = Date.now();
                    made = void 0;
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, , 5, 6]);
                    return [4 /*yield*/, next(e)];
                case 4:
                    drawing = _f.sent();
                    if (((_e = shownKept.get(key)) !== null && _e !== void 0 ? _e : 0) > askedNo && lastShown.has(key))
                        return [2 /*return*/, lastShown.get(key)];
                    shownKept.set(key, askedNo);
                    lastShown.set(key, drawing);
                    made = { at: at, ms: Date.now() - madeFrom, fresh: freshness };
                    return [2 /*return*/, drawing];
                case 5:
                    freshEnds($, key, made);
                    return [7 /*endfinally*/];
                case 6:
                    if (e.surface !== 'terminal' || !isTab)
                        return [2 /*return*/, next(e)];
                    _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Text = _a.Text;
                    return [4 /*yield*/, next(__assign(__assign({}, e), { props: __assign(__assign({}, e.props), { scroll: __assign(__assign({}, e.props.scroll), { bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) }) }) }))];
                case 7:
                    body = _f.sent();
                    return [2 /*return*/, (<Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Close" plain hotkey="x" onPress={function () { return void backToPanel($, id).catch(function (err) { return log($, "not back to the panel: ".concat(String(err))); }); }}/>
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={function () { return void openReports($).catch(function (err) { return log($, "reports not opened: ".concat(String(err))); }); }}/> : null}
          <Text dimColor wrap="truncate-end">{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x then Tab to use the keys'}</Text>
        </Box>
        {body}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
    // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var paneId, heldKey, heldAt, shownKey, recent, sign, _a, until_1, askedNo, madeFrom, isMade, shape, content, held_1, drawing, _b, _c;
        var _this = this;
        var _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    paneId = (_d = e.requestId) !== null && _d !== void 0 ? _d : '';
                    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE))
                        return [2 /*return*/, next(e)
                            // A message that waits for a hook to start a task again goes from this drawing (sendHeld)
                        ];
                    if (!heldSends.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 1:
                    _k.sent();
                    _k.label = 2;
                case 2:
                    if (paneId === LIST)
                        ((listDrawing += 1), (listSurface = e.surface));
                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                    return [4 /*yield*/, holdTest($)];
                case 3:
                    _k.sent();
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, , 19, 20]);
                    heldKey = "".concat(paneId, "|").concat(e.surface, "|").concat((_e = e.props.placement) !== null && _e !== void 0 ? _e : '', "|").concat(e.props.scroll.bodyRows, "|").concat((_f = e.props.bodyColumns) !== null && _f !== void 0 ? _f : '', "|").concat(e.props.isFocused ? 1 : 0, "|").concat(e.props.scroll.offset > 0 ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 5:
                    heldAt = _k.sent();
                    if (paneId === LIST)
                        drawnNow = heldAt;
                    shownKey = heldKey.replace(/\|[01]\|([01])$/, '|$1');
                    recent = lastShown.get(shownKey);
                    // A press under way: the drawing on screen, the one last made for this pane on this surface, focused or not
                    // (of this size and place: a pane resized or scrolled meanwhile is drawn afresh). Given before anything is read, so it is
                    // answered at once: given after the pane's reads, it came too late under load and a newer ask dropped it
                    if (recent && paneId === LIST && isPressHeld(heldAt))
                        return [2 /*return*/, ((listHeldAt = heldAt), (isPressMissed = true), recent)
                            // In use on the desktop: the drawing on screen, but for the person's own presses and what newly waits on them (isInUse)
                        ];
                    if (!(paneId === LIST && e.surface === 'desktop')) return [3 /*break*/, 7];
                    return [4 /*yield*/, personSign($)];
                case 6:
                    _a = _k.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = '';
                    _k.label = 8;
                case 8:
                    sign = _a;
                    // (only a drawing made during this use: one kept from before, as of a scroll down after minutes at the top, is long out of date)
                    if (recent && sign && !isTyping && isInUse(heldAt, e.props.scroll.offset) && shownSigns.get(shownKey) === sign && heldAt - ((_g = shownAts.get(shownKey)) !== null && _g !== void 0 ? _g : 0) < ENGAGED) {
                        until_1 = engagedAt + ENGAGED;
                        if (usedUntil !== until_1)
                            ((usedUntil = until_1), $.clock.after(until_1 - heldAt + 20, function () { return void (usedUntil === until_1 && drawFresh($)); }));
                        return [2 /*return*/, ((listHeldAt = heldAt), recent)];
                    }
                    if (recent && !isTyping && isFreshTooSoon($, shownKey, heldAt, false, false))
                        return [2 /*return*/, ((paneId === LIST && (listHeldAt = heldAt)), recent)
                            // (counted from the drawing's end: a call for a drawing it made itself, as its own count of what waits at the top, is in it)
                        ];
                    // (counted from the drawing's end: a call for a drawing it made itself, as its own count of what waits at the top, is in it)
                    freshBegins(shownKey);
                    askedNo = ((_h = shownAsked.get(shownKey)) !== null && _h !== void 0 ? _h : 0) + 1;
                    shownAsked.set(shownKey, askedNo);
                    madeFrom = Date.now();
                    isMade = false;
                    _k.label = 9;
                case 9:
                    _k.trys.push([9, , 17, 18]);
                    return [4 /*yield*/, paneShape($, paneId)];
                case 10:
                    shape = _k.sent();
                    return [4 /*yield*/, paneContent($)];
                case 11:
                    content = _k.sent();
                    held_1 = heldDrawings.get(heldKey);
                    // While the mod is behind (lookHold), the pane is given as it was, so the drawing adds nothing to what holds Claude's helper
                    if (held_1 && held_1.shape === shape && (isTyping || (held_1.fresh === freshness && ((isBehind() && heldAt - held_1.at < BEHIND_HELD) || (held_1.content === content && heldAt - held_1.at < CALM)))))
                        return [2 /*return*/, ((paneId === LIST && (listHeldAt = heldAt)), held_1.drawing)];
                    if (paneId === LIST)
                        drawnFiles.clear();
                    during(paneId === LIST ? 'draw the panel' : 'draw a Details tab');
                    if (!(paneId === LIST)) return [3 /*break*/, 13];
                    return [4 /*yield*/, read($, tick)];
                case 12:
                    _k.sent();
                    _k.label = 13;
                case 13: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, Box, Button, Markdown, Text, large, back, from, _i, lateFrom_1, _b, key, value, _c, isFinishedOpen, from, _d, _e, _f, _g, one, key, shownKept, shownAt, all, _h, own, resultsKept, resultWaits, otherChats, _j, _k, one, elsewhere, helpersThere, chat, at, answeredOf, promptsAnswered, working, shownWork, onCards, doneOnCards, promptsLoose, keptUpNow, ours, _l, windowOf, isAbovePrompt, isFinishMoment, isFlowMoment, stood, offModel, glance, _m, picking, lead, facts, now, noteOf, table, room, perRow, live, askFocused, askChars, askPictures, askBlock, resultAskBlock, cardNo, keyed, stepLine, gatesAt, canDismiss, small, edge, twigLines, twigRowOf, twigRow, jobLines, twigRails, twigUnder, guessLeft, jobTime, jobStand, jobRow, jobBranches, withJobs, rowOf, endedRunsOf, treeUnder, flowMine, flowList, runningFlows, shownFlows, endedFlows, flowShown, agentsWord, flowGlance, roundsLabel, verdict, squaresRow, stateWord, flowModel, flowFacts, atWork, flowDots, roundRow, flowPassed, flowEnd, flowSmall, flowOpen, workId, open, fold, part, row, opener, askPart, todoPart, underTwig, helpersPart, endedRunsPart, talk, theirChat, openTheirs, resultPart, big, promptButtons, isHeldHere, promptCard, answerHere, saidOf, answeredCard, chatHead, left, endedElsewhere, shownOf, listedChats, finished, finishedPart, flowBig, picked, lines, _o, alone, talked, kept, ui, isInline, shownIds, cardOfAgent, keysHeld, putOnCard, _p, _q, row_1, startedCard, _r, promptsAnswered_1, p, card, _s, _t, p, notices, isAsking, isWaitingPress, ownCount, waitsOn, isOpen, answeredSince, answeredPlace, placeKey, isAnyOpen, isOpenHere, isKeptPlace, isWaits, isKeptUp, cameAt, placeOf, isFinishing, finishFrom, isLeftUp, isUp, upSince, askingHere, askingThere, askCards, waitingNow_1, _u, askCards_1, one, key, _v, _w, one, _x, _y, key, restHere, restFlows, begun, finishingFlows, whatOf, top, waitsCount, runningThere, head, mood, isKeyed, versions, _z, screen, _0, was, count, finishedNow, first, updated, _1, outCard, _2, _3, _4, heldRows;
                        var _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
                        return __generator(this, function (_18) {
                            switch (_18.label) {
                                case 0:
                                    _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Markdown = _a.Markdown, Text = _a.Text;
                                    large = pictureIn.get(paneId);
                                    if (!large) return [3 /*break*/, 2];
                                    back = function (key) { return <Button key={"".concat(key, "-").concat(presses)} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={function () { return ((presses += 1), pictureBack($, paneId)); }}/>; };
                                    return [4 /*yield*/, pictureView($, e, large.path)];
                                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {_18.sent()}
          {back('pic-back-end')}
        </Box>)];
                                case 2:
                                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, read($, tick)];
                                case 3:
                                    _18.sent();
                                    _18.label = 4;
                                case 4:
                                    if (!(paneId === LIST)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, $.clock.now()
                                        // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
                                    ];
                                case 5:
                                    drawnNow = _18.sent();
                                    _18.label = 6;
                                case 6:
                                    if (!(paneId === LIST && __spreadArray([], lateFrom.values(), true).includes(Infinity))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, $.clock.now()
                                        // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    ];
                                case 7:
                                    from = _18.sent();
                                    // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    for (_i = 0, lateFrom_1 = lateFrom; _i < lateFrom_1.length; _i++) {
                                        _b = lateFrom_1[_i], key = _b[0], value = _b[1];
                                        if (value === Infinity)
                                            from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key);
                                    }
                                    $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); });
                                    _18.label = 8;
                                case 8: return [4 /*yield*/, read($, view)
                                    // Work that ended while the list was held (an older drawing given again) was not seen ended: its moment at the top begins with
                                    // this drawing, the first to show it, never before
                                ];
                                case 9:
                                    _c = (_18.sent()).isFinishedOpen, isFinishedOpen = _c === void 0 ? false : _c;
                                    if (!(paneId === LIST)) return [3 /*break*/, 16];
                                    return [4 /*yield*/, $.clock.now()];
                                case 10:
                                    from = _18.sent();
                                    _d = 0;
                                    _f = [[]];
                                    return [4 /*yield*/, read($, flows)];
                                case 11:
                                    _g = [__spreadArray.apply(void 0, _f.concat([(_18.sent()), true]))];
                                    return [4 /*yield*/, read($, todos)];
                                case 12:
                                    _e = __spreadArray.apply(void 0, _g.concat([(_18.sent()).filter(function (card) { return !card.parentId; }), true]));
                                    _18.label = 13;
                                case 13:
                                    if (!(_d < _e.length)) return [3 /*break*/, 15];
                                    one = _e[_d];
                                    key = "".concat(one.id, ":").concat(one.endedAt);
                                    if (one.status !== 'working' && one.endedAt > listFreshAt && one.endedAt < listHeldAt && !lateFrom.has(key) && from - one.endedAt < RELOAD_GRACE * 2)
                                        (lateFrom.set(key, from), $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); }));
                                    _18.label = 14;
                                case 14:
                                    _d++;
                                    return [3 /*break*/, 13];
                                case 15:
                                    listFreshAt = from;
                                    _18.label = 16;
                                case 16: return [4 /*yield*/, read($, reports)];
                                case 17:
                                    shownKept = _18.sent();
                                    return [4 /*yield*/, $.clock.now()];
                                case 18:
                                    shownAt = _18.sent();
                                    _h = shownAs;
                                    return [4 /*yield*/, read($, todos)];
                                case 19:
                                    all = _h.apply(void 0, [(_18.sent()).map(asPressed), function (one) { return openResultWaits(one, shownKept, shownAt).length > 0; }]);
                                    own = all.filter(function (one) { return !one.parentId; });
                                    return [4 /*yield*/, read($, reports)];
                                case 20:
                                    resultsKept = _18.sent();
                                    resultWaits = function (one) { return openResultWaits(one, resultsKept, at); };
                                    return [4 /*yield*/, read($, others)
                                        // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    ];
                                case 21:
                                    otherChats = _18.sent();
                                    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    for (_j = 0, _k = cardsOf(otherChats); _j < _k.length; _j++) {
                                        one = _k[_j];
                                        if (((_5 = one.ask) === null || _5 === void 0 ? void 0 : _5.replied) && actingOn.get("".concat(one.id, ":").concat(one.ask.at)) === one.ask.replied.text)
                                            actingOn.delete("".concat(one.id, ":").concat(one.ask.at));
                                    }
                                    elsewhere = cardsOf(otherChats).map(function (one) { return (one.ask && answeredHere.has("".concat(one.id, ":").concat(one.ask.at)) ? __assign(__assign({}, one), { ask: undefined }) : one); });
                                    helpersThere = helpersOf(otherChats);
                                    return [4 /*yield*/, read($, me)];
                                case 22:
                                    chat = _18.sent();
                                    return [4 /*yield*/, $.clock.now()
                                        // Prompts answered here and in other chats, for a minute after their call ended
                                    ];
                                case 23:
                                    at = _18.sent();
                                    answeredOf = function (list) { return (list !== null && list !== void 0 ? list : []).filter(function (p) { return !p.endedAt || at - p.endedAt < PROMPT_SHOWN; }); };
                                    promptsAnswered = answeredShown(at);
                                    working = own.filter(function (one) { return one.status === 'working'; }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                                    shownWork = own.filter(function (one) { return !isDismissed(one); }).filter(function (one) { var _a; return one.status === 'working' || isLingering(one, at) || one.ask || resultWaits(one).length > 0 || ((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) || one.leftSince || runningOn(one.id).length || (one.cutAt && !one.backAt && at - one.cutAt < CUT_OLD) || isLeftStopped(one, at) || isLeftOpen(one, at); });
                                    onCards = new Map();
                                    doneOnCards = new Map();
                                    promptsLoose = promptsAnswered;
                                    keptUpNow = new Set();
                                    _l = modelName;
                                    return [4 /*yield*/, $.session.model().catch(function () { return ''; })];
                                case 24:
                                    ours = _l.apply(void 0, [_18.sent()]);
                                    windowOf = function (one) { var _a; return (!one.chat && (one.isFork || (ours && modelName((_a = one.model) !== null && _a !== void 0 ? _a : '') === ours)) ? chat.window : 0); };
                                    isAbovePrompt = e.surface === 'terminal' && e.props.placement === 'inline';
                                    isFinishMoment = function (one) { return one.status === 'done' && !one.leftOpen && !one.ask && !resultWaits(one).length && lingers(one, at); };
                                    isFlowMoment = function (f) { return f.status === 'done' && isLingering(f, at) && flowPassed(f, roundsOf(f)) !== false; };
                                    stood = { working: '', done: 'Done', stopped: 'Stopped', failed: 'Failed' };
                                    offModel = function (one) { var _a; return (one.flagged ? "a safety check stopped it, so it doesn't continue on ".concat(one.flagged) : one.moved ? "Claude Code moved it to ".concat(one.moved) : rightModel((_a = one.model) !== null && _a !== void 0 ? _a : '') ? "Claudopus doesn't run tasks on this model" : ''); };
                                    glance = function (one, count) {
                                        var _a;
                                        if (count === void 0) { count = ''; }
                                        return [one.ask && one.status === 'done' && !isActingOnReply(one) ? 'Waiting for you' : one.leftOpen ? 'Not done' : one.status === 'stopped' && one.byYou ? 'Stopped by you' : stood[isActingOnReply(one) ? 'working' : one.status] || ownWorkWords(all, one), modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ');
                                    };
                                    return [4 /*yield*/, read($, view)
                                        // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
                                        // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
                                    ];
                                case 25:
                                    _m = (_18.sent()).picking, picking = _m === void 0 ? '' : _m;
                                    lead = e.surface === 'terminal' ? 0 : 'xs';
                                    facts = function (one, isWhole, count) {
                                        var _a;
                                        if (count === void 0) { count = ''; }
                                        var name = modelName((_a = one.model) !== null && _a !== void 0 ? _a : '');
                                        // Another chat's work is moved to another model in that chat
                                        if (one.status !== 'working' || !name || one.chat)
                                            return (<Box paddingLeft={isWhole ? 0 : lead}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one, count)}</Text>
          </Box>);
                                        var scope = "model-".concat(one.id);
                                        if (picking === one.id)
                                            return (<Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(function (model) { return (<Button key={"pick-".concat(one.id, "-").concat(model, "-").concat(presses)} label={"".concat(modelName(model) === name ? '✓ ' : '').concat(modelName(model))} plain dimColor={modelName(model) !== name} hover={{ scope: "".concat(scope, "-").concat(model), underline: true }} onPress={function () { return ((presses += 1), void choose($, one.id, model)); }}/>); })}
          </Box>);
                                        var rest = [ownWorkWords(all, one), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ');
                                        return (<Box flexDirection="row" alignItems="flex-start">
          <Button key={"model-".concat(one.id, "-").concat(presses)} label={name} plain dimColor hover={{ scope: scope, underline: true }} onPress={function () { return ((presses += 1), void update($, view, function (v) { return (__assign(__assign({}, v), { picking: one.id })); })); }}/>
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{" \u00B7 ".concat(rest)}</Text>
          </Box>
        </Box>);
                                    };
                                    now = function (one) {
                                        var _a, _b;
                                        var entry = __spreadArray([], one.entries, true).reverse().find(function (one) { return one.kind !== 'steer'; });
                                        // (nor what one command left going while other programs of it still work)
                                        var runs = one.status === 'working' && !one.ask ? ((_a = one.endedRuns) !== null && _a !== void 0 ? _a : []).filter(function (r) { var _a, _b, _c; return r.endedAt > ((_a = entry === null || entry === void 0 ? void 0 : entry.at) !== null && _a !== void 0 ? _a : 0) && r.how !== 'timed out' && String((_b = r.what) !== null && _b !== void 0 ? _b : '').trim() && !((_c = one.detached) === null || _c === void 0 ? void 0 : _c.some(function (d) { return d.from === r.id || (leftCommandOf(r.id) !== '' && leftCommandOf(d.id) === leftCommandOf(r.id)); })); }) : [];
                                        var said = { finished: 'done', failed: 'failed', killed: 'stopped', stopped: 'stopped', ended: 'ended' };
                                        var _c = runs.map(function (r) { var _a; return "".concat(runWords(String(r.what)), ": ").concat((_a = said[r.how]) !== null && _a !== void 0 ? _a : 'ended'); }), _d = _c[0], first = _d === void 0 ? '' : _d, _e = _c[1], second = _e === void 0 ? '' : _e;
                                        return !first ? ((_b = entry === null || entry === void 0 ? void 0 : entry.text) !== null && _b !== void 0 ? _b : '') : !second ? first : runs.length === 2 ? "".concat(first, " \u00B7 ").concat(second) : "".concat(first, " \u00B7 ").concat(second, " \u00B7 ").concat(runs.length - 2, " more ended");
                                    };
                                    noteOf = function (one) { var _a, _b; return (_b = (_a = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''; };
                                    table = uiOf($, e);
                                    room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)));
                                    perRow = Math.max(24, Math.floor(room / 2));
                                    live = function (key) {
                                        var _a;
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Working now" width={22} height={LINE} isInteractive/>
        </Box>) : ((_a = (e.surface === 'terminal' ? termDots(table, $, paneId, key) : null)) !== null && _a !== void 0 ? _a : <Text color={LIVE}>▸</Text>);
                                    };
                                    askFocused = false;
                                    askChars = 0;
                                    askPictures = function (one, key, isWhole) {
                                        var _a, _b, _c, _d, _e;
                                        var paths = (_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.pictures) !== null && _b !== void 0 ? _b : [];
                                        if (!paths.length)
                                            return null;
                                        // An ask of a chat on another Mac names that Mac's files, which are not here: a file at the same path here is another picture
                                        if ((_c = one.chat) === null || _c === void 0 ? void 0 : _c.host)
                                            return <Text key={"".concat(key, "-pics")} dimColor wrap="wrap">{"".concat(paths.length === 1 ? 'Its picture is' : "Its ".concat(paths.length, " pictures are"), " on the Mac that chat runs on. Open that chat to see ").concat(paths.length === 1 ? 'it' : 'them', ".")}</Text>;
                                        var drawing = uiOf($, e);
                                        var canDraw = e.surface !== 'terminal' && 'Svg' in drawing;
                                        // The terminal draws no picture: a row each that opens it, with no small copy made
                                        var made = canDraw ? askPicturesOf($, one) : paths.map(function (path) { return ({ name: fileName(path), path: path, thumb: null }); });
                                        if (!made)
                                            return <Text key={"".concat(key, "-pics")} dimColor>Shrinking its pictures…</Text>;
                                        if (!made.length)
                                            return null;
                                        // In Details the chat's own small pictures are drawn too: all of them together stay near what that tab keeps for pictures
                                        var chatChars = isWhole ? __spreadArray([], ((_e = (_d = shots.get(one.id)) === null || _d === void 0 ? void 0 : _d.shots.values()) !== null && _e !== void 0 ? _e : []), true).flat().reduce(function (sum, pic) { var _a, _b; return sum + ((_b = (_a = pic.thumb) === null || _a === void 0 ? void 0 : _a.source.length) !== null && _b !== void 0 ? _b : 0); }, 0) : 0;
                                        var most = isWhole ? Math.min(ASK_PICS_CHARS, PICTURES_CHARS + 30000 - chatChars) : ASK_PICS_CHARS;
                                        return (<Box key={"".concat(key, "-pics")} flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1} width="100%">
          {made.map(function (pic, n) {
                                                var isDrawn = canDraw && pic.thumb !== null && askChars + pic.thumb.source.length <= most;
                                                if (isDrawn && pic.thumb)
                                                    askChars += pic.thumb.source.length;
                                                var row = "".concat(key, "-pic-").concat(n);
                                                // Drawn at most ASK_PIC_WIDE across, from a copy up to twice as wide, so two sit side by side on a wide sidebar
                                                var size = pic.thumb && pic.thumb.width && pic.thumb.height ? sizedAskPic(pic.thumb.width, pic.thumb.height) : undefined;
                                                return (<Box key={row} flexDirection="column" alignItems="flex-start" flexShrink={1} minWidth={0}>
                {isDrawn && pic.thumb && 'Svg' in drawing ? (<drawing.Svg key={"".concat(row, "-svg")} source={pic.thumb.source} alt={"Picture: ".concat(pic.name)} {...(size !== null && size !== void 0 ? size : {})}/>) : null}
                <Button key={"".concat(row, "-open-").concat(presses)} label={"\u2922 ".concat(isDrawn ? 'Open large' : 'Open', ": ").concat(cut(pic.name, Math.max(12, room - 14)))} plain onPress={function (press) { return ((presses += 1), redraw($), void showPicture($, pic.path, paneId, row, press.surface)); }}/>
                {e.surface === 'terminal' ? pictureSaidRow($, drawing, "".concat(row, "-said"), pic.path) : null}
              </Box>);
                                            })}
        </Box>);
                                    };
                                    askBlock = function (one, key, isWhole) {
                                        var _a, _b;
                                        if (isWhole === void 0) { isWhole = false; }
                                        var ask = one.ask;
                                        if (!ask)
                                            return null;
                                        // The card's own box: how many lines tall it is drawn, and its send
                                        // (the terminal keeps its one line, Enter sending: how a terminal draws a box of rows is not known here)
                                        var rows = e.surface === 'terminal' ? undefined : BOX_ROWS;
                                        var sendCard = function (value) { var _a; return void (value.trim() && (dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), answerAsk($, one, value, true).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); }))); };
                                        var answers = ((_a = ask.choices) === null || _a === void 0 ? void 0 : _a.length) ? ask.choices : DEFAULT_ANSWERS;
                                        var lost = sentLine(one, at);
                                        // Answered in the person's own words and acted on: its question, with their reply under it, and nothing to press or type
                                        if (isActingOnReply(one))
                                            return (<Box key={key} flexDirection="column" gap={1}>
            <Text wrap="wrap" color={LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), "".concat(key, "-text"), ask.text)}</Text>
            {lost ? <Text key={"".concat(key, "-sent")} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
          </Box>);
                                        return (<Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={needsPerson(one) ? NEEDS : LIVE} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), "".concat(key, "-text"), ask.text)}</Text>
          {/* What the ask is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
          {ask.details ? (<Box key={"".concat(key, "-details")} flexDirection="column" minWidth={0}>
              <Markdown text={isWhole || ask.details.length <= DETAILS_ON_CARD ? ask.details : "".concat(cut(ask.details, DETAILS_ON_CARD), "\n\nThe rest is in its Details.")}/>
            </Box>) : null}
          {/* The pictures it is about, each drawn small with a row that opens it large, so it is decided here */}
          {askPictures(one, key, isWhole)}
          {ask.copy ? (<Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingLeft={2}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text mono wrap="wrap">{withLinks(table.Link, ask.copy, "".concat(key, "-copy"))}</Text>
              </Box>
              <Button key={"ask-".concat(one.id, "-copy-").concat(presses)} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={function (press) { var _a; return copyAsk($, one.id, (_a = ask.copy) !== null && _a !== void 0 ? _a : '', press.surface); }}/>
            </Box>) : null}
          {/* A command Claude Code refused, to run on the person's press: where and for how long at most */}
          {runWhere(table, one, key)}
          {/* A command to type: Terminal opens with it typed, not run, only on this press; not beside Run it */}
          {canOpenTerminal(one) && !offeredRun(one) ? (<Box flexDirection="row">
              <Button key={"".concat(key, "-terminal-").concat(presses)} label={openedKey === "".concat(one.id, ":").concat(ask.at, ":").concat(ask.copy) ? '✓ Typed into Terminal, not run yet' : 'Open in Terminal'} onPress={function () { return void openTerminal($, one).catch(function (err) { return log($, "terminal not opened: ".concat(String(err))); }); }}/>
            </Box>) : null}
          {/* Another chat's ask is answered only in its own chat: no file carries an answer there */}
          {one.chat ? (<Text key={"".concat(key, "-elsewhere")} dimColor wrap="wrap">{"Answer it in its own chat, \u201C".concat(one.chat.title || 'another chat', "\u201D").concat(one.chat.host ? ", on ".concat(one.chat.host) : '', ".")}</Text>) : null}
          {one.chat ? null : (<Box flexDirection="row" flexWrap="wrap" gap={1}>
            {runButton($, table, one, key)}
            {answers.map(function (choice, n) { return (<Button key={"".concat(key, "-choice-").concat(n, "-").concat(askMark(ask), "-").concat(loadMark)} label={choice} variant={n === 0 ? 'primary' : undefined} onPress={function () { return void ((presses += 1), answerAsk($, one, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })); }}/>); })}
            {/* Where the bar above the prompt holds the reply box, the last answer opens it there for this card, and closes it again */}
            {'Input' in table && repliesInBar(e.surface) ? (isReplyOpen(one) ? (<Button key={"".concat(key, "-inbar-close-").concat(presses)} label="Close" onPress={function (press) { return openReply($, undefined, press.surface); }}/>) : (<Button key={"".concat(key, "-inbar-").concat(presses)} label="Answer in words" plain onPress={function (press) { return openReply($, one, press.surface); }}/>)) : null}
          </Box>)}
          {/* Where the bar above the prompt holds the reply box, the card has none: a box typed in here is what the app drags the
                                                panel to. Once opened it says where to type: the app puts the cursor there only on the person's own click */}
          {'Input' in table && !one.chat && repliesInBar(e.surface) ? (isReplyOpen(one) ? (<Text key={"".concat(key, "-inbar")} dimColor wrap="wrap">✎ Type it in the box above the chat</Text>) : null) : 'Input' in table && !one.chat ? (
                                            // The card's own box, where the bar takes none (the terminal, a folded bar, a survey): as wide as the card and as tall as
                                            // BOX_ROWS lines whatever it holds; on the desktop with Send under it, a gap between, and no submitLabel, which the app draws
                                            // as a small send button and with which a box of several lines sends only on Cmd+Enter
                                            <Box width="100%" flexDirection="column">
              <table.Input key={"".concat(key, "-reply-").concat((_b = replies.get(one.id)) !== null && _b !== void 0 ? _b : 0, "-").concat(askMark(ask))} autoFocus={e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : undefined} placeholder="Or answer in words" value={draftShown(one.id, ask)} rows={rows} submitLabel={e.surface === 'terminal' ? 'send' : undefined} onInput={function (value) { return void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($)); }} onSubmit={function (value) { return sendCard(value); }}/>
              {e.surface === 'terminal' ? null : (<Box flexDirection="row" alignItems="center" gap={2} marginTop={1}>
                  <Box flexGrow={1} flexShrink={1} minWidth={0}>
                    <Text dimColor wrap="truncate-end">Shift+Enter: new line</Text>
                  </Box>
                  <Button key={"".concat(key, "-send-").concat(presses)} label="Send" variant="primary" onPress={function () { var _a; return sendCard((_a = drafts.get(draftOf(one.id, ask))) !== null && _a !== void 0 ? _a : ''); }}/>
                </Box>)}
            </Box>) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={"".concat(key, "-sent")} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>);
                                    };
                                    resultAskBlock = function (one, key) {
                                        var open = resultWaits(one);
                                        var first = open[0];
                                        if (!first)
                                            return null;
                                        var r = first.r, wait = first.wait, index = first.index;
                                        return (<Box key={key} flexDirection="column" gap={1}>
          <Text wrap="wrap" color={one.leftOpen ? NEEDS : undefined} bold>{"Result ready \u00B7 ".concat(cut(wait.text, Math.round(room * 1.6)))}</Text>
          {r ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
              {answersOf(wait).map(function (said, n) { return (<Button key={"".concat(key, "-say-").concat(r.id, "-").concat(index, "-").concat(n, "-").concat(presses)} label={said} variant={n === 0 ? 'primary' : undefined} {...(said === ANSWER_IN_WORDS ? { plain: true } : {})} onPress={function () { return void ((presses += 1), answerWait($, r, index, said, at).catch(function (err) { return log($, "answer not kept: ".concat(String(err))); })); }}/>); })}
            </Box>) : null}
          {r && open.length > 1 ? (<Box flexDirection="row" alignItems="center" gap={1}>
              <Text dimColor>{"".concat(open.length - 1, " more ").concat(open.length === 2 ? 'question' : 'questions')}</Text>
              <Button key={"".concat(key, "-more-").concat(r.id, "-").concat(presses)} label="Result" plain onPress={function () { return void openReport($, r.id); }}/>
            </Box>) : null}
        </Box>);
                                    };
                                    cardNo = 0;
                                    keyed = false;
                                    stepLine = function (one, kept, done) {
                                        if (one.status !== 'working' || one.chat)
                                            return null;
                                        var doing = kept.find(function (item) { return item.state === 'doing'; });
                                        if (!doing)
                                            return null;
                                        return (<Box key={"step-".concat(one.id)} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          <Box flexShrink={0}>
            <Text dimColor>{"To-do ".concat(done + 1, " of ").concat(kept.length, " \u00B7")}</Text>
          </Box>
          <Box flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end" dimColor={false}>{doing.text}</Text>
          </Box>
        </Box>);
                                    };
                                    gatesAt = function (one) {
                                        var _a, _b, _c, _d;
                                        var open = Math.min.apply(Math, __spreadArray(__spreadArray([], ((_a = one.admins) !== null && _a !== void 0 ? _a : []).filter(function (gate) { return !gatePressed.has(gate.id); }).map(function (gate) { return gate.at; }), false), [Infinity], false));
                                        // a new admin command after the earlier ones were answered: where it came, not where they did
                                        if (Number.isFinite(open) && (!gatePartAt.has(one.id) || ((_b = gatePartAt.get(one.id)) !== null && _b !== void 0 ? _b : 0) < open - GATE_PART_GAP))
                                            gatePartAt.set(one.id, open);
                                        if (!((_c = one.admins) === null || _c === void 0 ? void 0 : _c.length) && !cardNotesOf(one.id, at).length)
                                            gatePartAt.delete(one.id);
                                        return (_d = gatePartAt.get(one.id)) !== null && _d !== void 0 ? _d : open;
                                    };
                                    canDismiss = function (one) { var _a; return !one.chat && !one.parentId && one.status !== 'working' && shownWork.some(function (up) { return up.id === one.id; }) && !isActingOnReply(one) && !((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length); };
                                    small = function (one) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                                        // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
                                        // A card in its moment at the top is not numbered, so the others keep their numbers through it
                                        var isMomentNow = isFinishMoment(one) && !keptUpNow.has(one.id) && !isDismissed(one);
                                        if (!isMomentNow)
                                            cardNo += 1;
                                        var digit = keyed && cardNo <= 9 && !isMomentNow ? String(cardNo) : undefined;
                                        var kept = one.items.filter(function (item) { return item.state !== 'dropped'; });
                                        var done = kept.filter(function (item) { return item.state === 'done'; }).length;
                                        var tree = treeUnder(one);
                                        var scope = "card-".concat(one.id);
                                        // Just finished, in its moment at the top: outlined in the green of what is done, as an allowed notice is
                                        var isMoment = isMomentNow && !isAbovePrompt;
                                        return (<Box key={"todo-".concat(one.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isMoment ? { borderStyle: 'round', borderColor: DONE } : {})}>
          {edge(one, kept.length, done, kept.some(function (item) { return item.state === 'doing'; }))}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={"open-".concat(one.id, "-").concat(presses)} plain hotkey={digit} hover={{ scope: scope, underline: true }} onPress={function () { return openWork($, one.id); }}>
                    <Text bold wrap="truncate-end">{titleOf(one)}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1}/>
                {one.status === 'working' && !one.chat && (!one.wasDone || one.leftSince) ? (<Box flexShrink={0}>
                    <Button key={"stop-".concat(one.id)} label="Stop" plain dimColor hover={{ scope: "stop-".concat(one.id), underline: true }} onPress={function () { return void stop($, one.id); }}/>
                  </Box>) : null}
                {/* Done, at the top or under Finished: a press opens the box above the chat for what to change, where that bar
                                                takes a box; the same task then carries on with what is typed */}
                {(canChange(one) && !resultWaits(one).length) && 'Input' in table && repliesInBar(e.surface) ? (<Box flexShrink={0}>
                    <Button key={"change-".concat(one.id, "-").concat(presses)} label="Change something" plain dimColor hover={{ scope: "change-".concat(one.id), underline: true }} onPress={function (press) { return openChange($, one, press.surface); }}/>
                  </Box>) : null}
                {/* Ended and still up here: a press puts it under Finished, whatever it asks, until its task works again */}
                {canDismiss(one) ? (<Box flexShrink={0}>
                    <Button key={"dismiss-".concat(one.id, "-").concat(presses)} label="Dismiss" plain dimColor hover={{ scope: "dismiss-".concat(one.id), underline: true }} onPress={function () { return void ((presses += 1), dismiss($, one.id).catch(function (err) { return log($, "card not dismissed: ".concat(String(err))); })); }}/>
                  </Box>) : null}
              </Box>
              {facts(one, false, kept.length > 0 ? "".concat(done, " of ").concat(kept.length, " to-dos done") : '')}
            </Box>
            {/* What it made so far, right under its title: side by side, each a press that opens it */}
            {((_a = madeNow($, one)) === null || _a === void 0 ? void 0 : _a.made.length) || ((_b = madeNow($, one)) === null || _b === void 0 ? void 0 : _b.code) ? (<Box key={"made-lead-".concat(one.id)} paddingLeft={lead}>
                {madeChips($, table, one, "made-".concat(one.id), function () { return openWork($, one.id); })}
              </Box>) : null}
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead). What the card waits on, each in the order it
                                                came: its question, its admin commands, the key box and the app's prompt its own commands raised. A newer one goes
                                                under the older, so nothing already on the card moves */}
            {__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (one.ask ? [{ at: one.ask.at, node: (<Box key={"ask-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                  {askBlock(one, "ask-".concat(one.id))}
                </Box>) }] : []), true), (resultWaits(one).length ? [{ at: one.endedAt, node: (<Box key={"result-ask-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                  {resultAskBlock(one, "result-ask-".concat(one.id))}
                </Box>) }] : []), true), (runningOn(one.id).length && !one.chat ? [{ at: Math.min.apply(Math, runningOn(one.id).map(function (run) { var _a; return (_a = run.startedAt) !== null && _a !== void 0 ? _a : 0; })), node: (<Box key={"run-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                  {runBlock($, table, one, "runs-".concat(one.id), at)}
                </Box>) }] : []), true), (((_c = one.admins) === null || _c === void 0 ? void 0 : _c.length) || cardNotesOf(one.id, at).length ? [{ at: gatesAt(one), node: (<Box key={"gate-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                  {adminBlock($, table, one, "gates-".concat(one.id), at)}
                </Box>) }] : []), true), __spreadArray(__spreadArray([], ((_d = onCards.get(one.id)) !== null && _d !== void 0 ? _d : []), true), ((_e = doneOnCards.get(one.id)) !== null && _e !== void 0 ? _e : []), true).map(function (row) { return ({ at: row.at, node: (<Box key={"own-lead-".concat(row.key)} flexDirection="column" paddingLeft={lead}>
                  {row.node}
                </Box>) }); }), true).sort(function (a, b) { return a.at - b.at; }).map(function (part) { return part.node; })}
            {/* A card says its stage, its to-do and what it does now, and in amber what needs the person. What Claudopus did on the
                                                way (started it again after the chat stopped or after it stopped partway, the command it waits for, the time it starts
                                                it again, the helpers it was told to check on) is never on the card (18 Nov) */}
            {/* Nothing new has come back under it for a while, and no helper of its is at work: amber */}
            {stuckLine(all, one, at) && one.status === 'working' && !one.chat ? (<Box key={"stuck-".concat(one.id)} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>) : null}
            {/* Cut off as the chat's process ended, and Claudopus could not start it again: amber, as it needs the person */}
            {cutLine(one) && !one.chat ? (<Box key={"cut-".concat(one.id)} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{cutLine(one)}</Text>
              </Box>) : null}
            {/* Stopped partway without a result, and Claudopus stopped starting it again: amber */}
            {carryLine(one) && !one.chat ? (<Box key={"carry-".concat(one.id)} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{carryLine(one)}</Text>
              </Box>) : null}
            {/* Ended with to-dos not done: which, in the colour of what needs the person, so nobody has to ask what was left */}
            {notDoneLine(one) ? (<Box key={"not-done-".concat(one.id)} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{notDoneLine(one)}</Text>
              </Box>) : null}
            {/* A result's question is all a card waiting for its answer says: no line of what Claude last did */}
            {resultWaits(one).length ? null : (<Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live("live-".concat(one.id)) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (<Text wrap="truncate-end" color={one.leftOpen ? NEEDS : one.status === 'done' ? DONE : one.status === 'failed' ? 'error' : undefined} dimColor={one.status !== 'done' && one.status !== 'failed'}>
                    {one.leftOpen ? 'Not done' : one.status === 'done' ? '✓ Done' : one.status === 'failed' ? '✕ Failed' : one.byYou ? 'Stopped by you' : 'Stopped'}
                  </Text>) : (<Box flexDirection="column" minWidth={0}>
                    <Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || needsPerson(one)}>{(!one.ask && sentLine(one, at)) || cut(noteOf(one), room) || (one.status === 'working' ? (one.ask ? 'Waiting for you' : at - one.startedAt < 60000 ? 'Starting' : 'Working') : "Claude hasn't said what it's doing")}</Text>
                    {/* Held where it was after an answer, once a newer line of the work's took the answer's place: why it is still up there */}
                    {!one.ask && !sentLine(one, at) && heldAnswer(one, at) && ((_f = heldAnswer(one, at)) === null || _f === void 0 ? void 0 : _f.to) !== 'ran' && !((_g = heldAnswer(one, at)) === null || _g === void 0 ? void 0 : _g.isRun) ? <Text key={"held-answer-".concat(one.id)} dimColor wrap="truncate-end">{"\u2713 You answered \u201C".concat(cut((_j = (_h = heldAnswer(one, at)) === null || _h === void 0 ? void 0 : _h.text) !== null && _j !== void 0 ? _j : '', 60), "\u201D")}</Text> : null}
                  </Box>)}
              </Box>
            </Box>)}
            {/* A button's answer, while the card says it: a press to take it back, the question back on the card */}
            {canTakeBack(one, at) ? (<Box key={"take-back-".concat(one.id)} paddingLeft={lead} flexDirection="row">
                <Button key={"take-back-".concat(one.id, "-").concat((_l = (_k = heldAnswer(one, at)) === null || _k === void 0 ? void 0 : _k.at) !== null && _l !== void 0 ? _l : 0)} label={"\u21B6 Take back \u201C".concat(cut((_o = (_m = heldAnswer(one, at)) === null || _m === void 0 ? void 0 : _m.text) !== null && _o !== void 0 ? _o : '', 30), "\u201D")} plain onPress={function () { var _a, _b; return void ((presses += 1), takeBack($, one, (_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0).catch(function (err) { return log($, "answer not taken back: ".concat(String(err))); })); }}/>
              </Box>) : null}
            {/* Finished, with something it started still running: what, how long, and a way to stop it */}
            {leftLine(one, at) && !one.chat ? (<Box key={"left-".concat(one.id)} flexDirection="column" gap={1} paddingLeft={lead}>
                <Text color={NEEDS} wrap="wrap">{leftLine(one, at)}</Text>
                <Box flexDirection="row">
                  <Button key={"left-stop-".concat(one.id, "-").concat(presses)} label="Stop it" onPress={function () { return void stop($, one.id); }}/>
                </Box>
              </Box>) : null}
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={"tree-".concat(one.id)} flexDirection="column" paddingLeft={lead}>{tree}</Box> : null}
          </Box>
        </Box>);
                                    };
                                    edge = function (one, count, done, isDoing) {
                                        var _a, _b;
                                        // An error that stopped it is said in red, on its edge too
                                        if (one.status === 'failed')
                                            return <Box width={1} flexShrink={0} backgroundColor="error"/>;
                                        if (one.status !== 'working' && one.status !== 'done')
                                            return <Box width={1} flexShrink={0}/>;
                                        // (amber for one that waits on the person to go on, or that left to-dos; a done one whose result asks something more is green)
                                        var isNeeded = needsPerson(one) || ((_b = (_a = onCards.get(one.id)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0 || Boolean(one.leftOpen);
                                        if (isNeeded || one.status === 'done' || !count || e.surface === 'terminal')
                                            return <Box width={1} flexShrink={0} backgroundColor={isNeeded ? NEEDS : one.status === 'working' || isActingOnReply(one) ? LIVE : DONE}/>;
                                        var shade = function (n) { return (n < done ? LIVE : n === done && isDoing ? "".concat(LIVE, "AD") : "".concat(LIVE, "5C")); };
                                        return count > EDGE_PARTS ? (<Box key={"edge-".concat(one.id)} width={1} flexShrink={0} flexDirection="column">
          {/* Too many to-dos for a part each: one bar in the same three shades, done, the one being done, and what is left */}
          {done ? <Box key="done" flexGrow={done} backgroundColor={LIVE}/> : null}
          {isDoing && count > done ? <Box key="doing" flexGrow={1} backgroundColor={"".concat(LIVE, "AD")}/> : null}
          {count - done - (isDoing ? 1 : 0) > 0 ? <Box key="left" flexGrow={count - done - (isDoing ? 1 : 0)} backgroundColor={"".concat(LIVE, "5C")}/> : null}
        </Box>) : (<Box key={"edge-".concat(one.id)} width={1} flexShrink={0} flexDirection="column" gap={count > 8 ? 0.2 : 0.3}>
          {Array.from({ length: count }, function (_, n) { return (<Box key={"part-".concat(n)} flexGrow={1} backgroundColor={shade(n)}/>); })}
        </Box>);
                                    };
                                    twigLines = function (t, key, status) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')} alt={status ? { working: 'Working', done: 'Done', failed: 'Failed', stopped: 'Stopped' }[status] : 'Ended'} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          {status === 'working' && e.surface === 'terminal' && 'Raster' in table ? termRing(table, $, paneId, "".concat(key, "-ring")) : <Text color={status === 'working' ? LIVE : status === 'done' ? DONE : status === 'failed' ? 'error' : undefined} dimColor={!status || status === 'stopped'}>
            {status === 'working' ? '●' : status === 'done' ? '✓' : status === 'failed' ? '✕' : status === 'stopped' ? '■' : '○'}
          </Text>}
        </Box>);
                                    };
                                    twigRowOf = function (t, key, label, isDim, time, onPress, status) { return (<Box key={"twig-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigLines(t, "twig-lines-".concat(key), status)}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Button key={"open-".concat(key, "-").concat(presses)} label={label} plain dimColor={isDim} hover={{ scope: "twig-".concat(key), underline: true }} onPress={onPress}/>
        </Box>
        {time ? (<Box flexShrink={0}>
            <Text dimColor>{time}</Text>
          </Box>) : null}
      </Box>); };
                                    twigRow = function (t, scope) {
                                        var _a, _b;
                                        var one = t.one;
                                        if (!one)
                                            return null;
                                        // Beside its name: the model it runs on, how much context it holds, and its time last, so the ticking moves nothing else.
                                        // A narrow panel drops the context, then the model, so the name keeps room to be read
                                        var time = took((one.endedAt || at) - one.startedAt);
                                        var model = modelName((_a = one.model) !== null && _a !== void 0 ? _a : '');
                                        var width = perRow - 4 - t.depth * 2;
                                        // A call it has run for minutes says so in place of the model and context, so a long step does not look like a hang
                                        // (a command it waits on has its own row under it instead)
                                        var side = (_b = [[model, time], [time]].map(function (parts) { return parts.filter(Boolean).join(' · '); }).find(function (text) { return width - text.length >= 12; })) !== null && _b !== void 0 ? _b : time;
                                        var row = twigRowOf(t, "".concat(scope, "-").concat(one.id), cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, function () { return openWork($, one.id); }, one.status);
                                        // Under a helper at work, what it is doing now in plain words, as a command's second line says how it goes (17 Nov: a
                                        // helper's row said only its model, tokens and time, nothing of what it did)
                                        var doing = one.status === 'working' && !one.chat ? helperNow(one, at, jobsOf(one, at).length, Math.max(12, width)) : '';
                                        if (!doing)
                                            return row;
                                        return (<Box key={"twig-pair-".concat(scope, "-").concat(one.id)} flexDirection="column" flexShrink={0}>
          {row}
          <Box key={"twig-now-".concat(scope, "-").concat(one.id)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {twigRails(t, "twig-rails-".concat(scope, "-").concat(one.id))}
            <Box flexGrow={1} flexShrink={1} minWidth={0} paddingLeft={lead}>
              <Text dimColor wrap="truncate-end">{doing}</Text>
            </Box>
          </Box>
        </Box>);
                                    };
                                    jobLines = function (t, key, job) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, JOB_COLOR[job.kind], !job.isPaused && job.kind !== 'wait' && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
        </Box>);
                                    };
                                    twigRails = function (t, key) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={railSvg(t, LINE)} alt={t.isLast ? 'Last row' : 'More rows below'} width={twigWidth(t)} height={LINE}/>
        </Box>) : (<Box key={key} flexShrink={0}>
          <Text dimColor>{railText(t)}</Text>
        </Box>);
                                    };
                                    twigUnder = function (t, key, body, inset) {
                                        if (inset === void 0) { inset = lead; }
                                        return (<Box key={key} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
        {twigRails(t, "".concat(key, "-rails"))}
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={inset}>
          {body}
        </Box>
      </Box>);
                                    };
                                    guessLeft = function (job, ran) {
                                        var _a;
                                        var share = Number.parseFloat((_a = job.pct) !== null && _a !== void 0 ? _a : '') / 100;
                                        return !job.left && job.isOwn && !job.isEarlier && job.kind !== 'wait' && share >= 0.01 && share < 1 && ran >= 20000 ? timeLeftText((ran / 1000) * ((1 - share) / share)) : undefined;
                                    };
                                    jobTime = function (job, ran) {
                                        var _a, _b, _c, _d;
                                        if (!job.expectText || !job.expect)
                                            return { time: took(ran), isPast: false };
                                        if (ran <= job.expect)
                                            return { time: "".concat(took(ran), " of about ").concat(job.expectText), isPast: false };
                                        var isFresh = !job.isPaused && Boolean(job.wroteAt) && at - ((_a = job.wroteAt) !== null && _a !== void 0 ? _a : 0) < 60000;
                                        // the time left is as of when it was printed, so it adds to the time it had run then
                                        var printedAt = Math.min(ran, Math.max(0, ((_b = job.wroteAt) !== null && _b !== void 0 ? _b : 0) - job.at));
                                        var left = isFresh ? leftSeconds((_c = job.left) !== null && _c !== void 0 ? _c : guessLeft(job, printedAt)) : undefined;
                                        var fresh = left ? (_d = timeLeftText(Math.max(ran / 1000, printedAt / 1000 + left))) === null || _d === void 0 ? void 0 : _d.replace(/ left$/, '') : undefined;
                                        return fresh ? { time: "".concat(took(ran), " of about ").concat(fresh), isPast: false } : { time: "".concat(took(ran), " \u00B7 ").concat(shortAgo(ran - job.expect), " over"), isPast: true };
                                    };
                                    jobStand = function (job, width) {
                                        var _a;
                                        var pct = job.pct ? [job.pct] : [];
                                        var quiet = job.wroteAt && !job.isEmpty ? at - job.wroteAt : undefined;
                                        var ran = at - job.at;
                                        // (to ten seconds past a minute, so the line moves at each drawing however long it has been)
                                        var ago = function (ms) {
                                            var all = Math.max(0, Math.floor(ms / 1000));
                                            return all < 60 || all >= 3600 ? shortAgo(ms) : "".concat(Math.floor(all / 60), "m ").concat(String(Math.floor((all % 60) / 10) * 10).padStart(2, '0'), "s");
                                        };
                                        var still = quiet !== null && quiet !== void 0 ? quiet : ran;
                                        // Quiet for three minutes, in amber: a server or a watch speaks only when there is something to say, so its quiet is no
                                        // fault, and one whose output has not been read yet is not known to be silent until a minute has passed. Before three
                                        // minutes nothing is said of when: a count of seconds beside a still percent told nothing (16 Nov)
                                        var isSilent = !job.isPaused && !job.target && job.kind !== 'server' && job.kind !== 'watch' && !(quiet === undefined && !job.isEmpty && ran < SILENT_WARN) && still >= SILENT_AFTER;
                                        // its speed and time left only while it prints: ten seconds old, they are no longer how it goes
                                        var isFresh = quiet !== undefined && quiet < 10000;
                                        var guess = guessLeft(job, ran);
                                        var left = isFresh ? (job.left ? [job.left] : guess ? ["about ".concat(guess)] : []) : [];
                                        var rate = job.rate && isFresh ? [job.rate] : [];
                                        var full = job.done ? [job.total ? "".concat(job.done, " of ").concat(job.total) : job.done] : [];
                                        var compact = job.done ? [job.total ? "".concat(job.done, "/").concat(job.total) : job.done] : [];
                                        // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
                                        var bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? ["".concat(job.done, "/").concat(job.total.split(' ')[0])] : compact;
                                        // The memory it holds only where it is a gigabyte or more, said as memory, as it counts against what this Mac may hold; a few
                                        // megabytes say nothing to a person (16 Nov a row led with "35 MB"), and it goes first when the line has no room
                                        var mem = job.mem && /\b[GT]B\b/.test(job.mem) ? ["".concat(job.mem, " memory")] : [];
                                        // Its own plain words for what it does now; a watch's are its last event
                                        var words = plainOf(job.isOwn && !job.isEarlier ? job.words : job.latest, "".concat(job.label, " ").concat((_a = job.waitsFor) !== null && _a !== void 0 ? _a : ''));
                                        var hasSaid = Boolean(words || full.length || pct.length);
                                        // Quiet never stands alone (17 Nov "nothing printed for 29m 30s" said nothing of what it did): the last thing it said stays,
                                        // marked as the last, or that it has shown no output or no progress at all; and once Claude was told of it, that too
                                        var told = isSilent && silentTold.has(job.id) ? 'Claude was told to check it' : '';
                                        var _b = job.isPaused ? ['Paused', 'Paused']
                                            : job.target ? [job.target, job.target.replace(/^What it waits for hasn't changed for /, 'No change for ').replace(/^What it waits for /, 'Its target ')]
                                                : job.kind === 'server' || job.kind === 'watch' ? ['', '']
                                                    : !isSilent ? ['', '']
                                                        : hasSaid ? ["nothing new for ".concat(ago(still)), "nothing new for ".concat(shortAgo(still))]
                                                            : !job.wroteAt || job.isEmpty ? ["No output yet \u00B7 started ".concat(shortAgo(ran), " ago"), "No output yet \u00B7 ".concat(shortAgo(ran))]
                                                                : ["No progress shown \u00B7 nothing new for ".concat(ago(still)), "No progress for ".concat(shortAgo(still))], state = _b[0], short = _b[1];
                                        var isWarn = job.isPaused || Boolean(job.target) || isSilent;
                                        // A server or a watch leads with what it does, then the last thing it said
                                        var lead = job.kind === 'server' ? (words ? 'Serving · last: ' : 'Serving · ') : job.kind === 'watch' ? (words ? 'Watching · last: ' : 'Watching · ') : isSilent && hasSaid ? 'Last: ' : '';
                                        // (what one command left going, when it is several programs, says how many: its row names the command once)
                                        // (a narrow row drops the "about" of a time left worked out from its percent)
                                        var near = left.map(function (one) { return one.replace(/^about /, ''); });
                                        var programs = leftCommandOf(job.id) && job.count && job.count > 1 ? ["".concat(job.count, " programs")] : [];
                                        var numbers = __spreadArray(__spreadArray(__spreadArray(__spreadArray([__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), rate, true), left, true), programs, true), mem, true), __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), rate, true), left, true), programs, true), __spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), left, true), programs, true), __spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), left, true)], (near.length ? [__spreadArray(__spreadArray([], full, true), near, true)] : []), true), [__spreadArray(__spreadArray(__spreadArray([], compact, true), pct, true), left, true)], false), (left.length ? [__spreadArray(__spreadArray([], compact, true), left, true), __spreadArray(__spreadArray([], compact, true), near, true), __spreadArray(__spreadArray([], bare, true), near, true)] : []), true), [__spreadArray(__spreadArray([], compact, true), pct, true), __spreadArray(__spreadArray([], bare, true), pct, true), __spreadArray([], pct, true), []], false);
                                        var tails = [[state, told], [state], [short, told], [short]].map(function (t) { return t.filter(Boolean); });
                                        // How far it is comes first, then its sign of life, then whether Claude was told: the fullest counts with each tail, then any
                                        var tries = __spreadArray(__spreadArray([], numbers.slice(0, 3).flatMap(function (nums) { return tails.map(function (tail) { return ({ nums: nums, tail: tail }); }); }), true), tails.flatMap(function (tail) { return numbers.map(function (nums) { return ({ nums: nums, tail: tail }); }); }), true);
                                        for (var _i = 0, tries_1 = tries; _i < tries_1.length; _i++) {
                                            var _c = tries_1[_i], nums = _c.nums, tail = _c.tail;
                                            var fixed = __spreadArray(__spreadArray([], nums, true), tail, true).join(' · ');
                                            if (lead.length + fixed.length > width)
                                                continue;
                                            // ("Last:" needs the last thing it said after it: one with room for nothing of that drops the long tail first)
                                            if (lead && !nums.length && !(words && width - lead.length - fixed.length - 3 >= 12) && tail !== tails.at(-1))
                                                continue;
                                            // Its own words go between how far it is and its sign of life, cut to the room left
                                            var room_1 = width - lead.length - fixed.length - (fixed ? 3 : 0);
                                            var said_1 = words && room_1 >= 12 ? (words.length <= room_1 ? words : "".concat(words.slice(0, room_1 - 1).replace(/\s+\S*$/, ''), "\u2026")) : '';
                                            var text = __spreadArray(__spreadArray(__spreadArray([], nums, true), [said_1], false), tail, true).filter(Boolean).join(' · ');
                                            // A run that gives word but says nothing plain of how far it is or what it does: that it is at work, and its kind's word
                                            // (a server's or watch's "last:" only before its own words; "Last:" before how far it got or its words, else the tail alone
                                            // with a capital)
                                            var kindLead = job.kind === 'server' ? 'Serving' : job.kind === 'watch' ? 'Watching' : '';
                                            var shownLead = kindLead ? "".concat(kindLead, " \u00B7 ").concat(said_1 ? 'last: ' : '') : lead && (nums.length || said_1) ? lead : '';
                                            var line = "".concat(shownLead).concat(text);
                                            return { text: text ? line.charAt(0).toUpperCase() + line.slice(1) : kindLead || (job.kind === 'wait' ? 'Waiting' : job.kind === 'download' ? 'Downloading' : 'Working'), isWarn: isWarn };
                                        }
                                        return { text: short, isWarn: isWarn };
                                    };
                                    jobRow = function (t, scope) {
                                        var _a, _b;
                                        var job = t.job;
                                        if (!job)
                                            return null;
                                        var key = "".concat(scope, "-job-").concat(job.id);
                                        var width = perRow - 4 - t.depth * 2;
                                        var ran = at - job.at;
                                        var _c = jobTime(job, ran), time = _c.time, isLong = _c.isPast;
                                        // Stop, at its end, where it can be stopped from here: it ends the run and tells the work it was stuck
                                        var owner = (_b = (_a = t.one) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                                        // (not on a row too narrow to say how far it is beside it; Details, wider, has it)
                                        var isStoppable = Boolean(owner) && canStopJob(job) && !job.id.startsWith('more-') && width >= 44;
                                        var name = cut(jobHead(job), Math.max(12, width - time.length - 1));
                                        var head = (<Box key={"twig-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {jobLines(t, "twig-lines-".concat(key), job)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {/* A press shows its output whole in a Terminal window, where this Mac can open one */}
            {canOpenJob(job) ? (<Button key={"output-".concat(key, "-").concat(presses)} label={name} plain hover={{ scope: "twig-".concat(key), underline: true }} onPress={function () { return void openJobOutput($, job).catch(function (err) { return log($, "output not opened: ".concat(String(err))); }); }}/>) : (<Text wrap="truncate-end">{name}</Text>)}
          </Box>
          <Box flexShrink={0}>
            <Text dimColor={!isLong} color={isLong ? NEEDS : undefined}>{time}</Text>
          </Box>
        </Box>);
                                        if (job.id.startsWith('more-'))
                                            return head;
                                        // (Stop sits at the end of its second line, under its time, so its name keeps its room)
                                        var stopButton = isStoppable ? (<Box key={"stop-box-".concat(key)} flexShrink={0}>
          <Button key={"stop-".concat(key, "-").concat(presses)} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain hover={{ scope: "stop-".concat(key), underline: true }} onPress={function () { return void stopJob($, owner, job).catch(function (err) { return log($, "run not stopped: ".concat(String(err))); }); }}/>
        </Box>) : null;
                                        var _d = jobStand(job, width - (isStoppable ? 10 : 0)), stand = _d.text, isWarn = _d.isWarn;
                                        // Its percent, in blue, where the line says it as a part of its own
                                        var pctAt = job.pct && !isWarn ? (stand.startsWith("".concat(job.pct, " \u00B7 ")) || stand === job.pct ? 0 : stand.includes(" \u00B7 ".concat(job.pct)) ? stand.indexOf(" \u00B7 ".concat(job.pct)) + 3 : -1) : -1;
                                        // (its plain words are in the line itself, which every run has)
                                        var detail = '';
                                        return (<Box key={"job-".concat(key)} flexDirection="column" flexShrink={0}>
          {head}
          <Box key={"stand-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {twigRails(t, "rails-".concat(key))}
            {/* (on a desktop by the step a plain Button pads a run's name with, where its name is one, so the two start in one column) */}
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" overflow="hidden" paddingLeft={canOpenJob(job) ? lead : 0}>
              {pctAt >= 0 && job.pct ? (<Box flexDirection="row" flexShrink={0}>
                  {pctAt > 0 ? <Text dimColor>{stand.slice(0, pctAt)}</Text> : null}
                  <Text color={JOB_COLOR.download}>{job.pct}</Text>
                  <Text dimColor>{stand.slice(pctAt + job.pct.length)}</Text>
                </Box>) : stand ? (<Box flexShrink={0}>
                  <Text color={isWarn ? NEEDS : undefined} dimColor={!isWarn}>{stand}</Text>
                </Box>) : null}
              {detail ? (<Box flexShrink={1000} minWidth={0}>
                  <Text dimColor wrap="truncate-end">{stand ? " \u00B7 ".concat(detail) : detail}</Text>
                </Box>) : null}
            </Box>
            {stopButton}
          </Box>
        </Box>);
                                    };
                                    jobBranches = function (card, isAll) {
                                        if (isAll === void 0) { isAll = false; }
                                        var jobs = jobsOf(card, at);
                                        if (isAll || jobs.length <= JOBS_SHOWN)
                                            return jobs.map(function (job) { return ({ one: card, job: job, kids: [] }); });
                                        var more = jobs.length - JOBS_SHOWN + 1;
                                        var shown = jobs.slice(-(JOBS_SHOWN - 1));
                                        var rest = { id: "more-".concat(card.id), label: "".concat(jobs.slice(0, more).reduce(function (n, job) { var _a; return n + (leftCommandOf(job.id) ? 1 : ((_a = job.count) !== null && _a !== void 0 ? _a : 1)); }, 0), " more commands"), cmd: '', kind: 'watch', at: Math.min.apply(Math, jobs.slice(0, more).map(function (job) { return job.at; })) };
                                        return __spreadArray(__spreadArray([], shown, true), [rest], false).map(function (job) { return ({ one: card, job: job, kids: [] }); });
                                    };
                                    withJobs = function (branches, isAll) {
                                        if (isAll === void 0) { isAll = false; }
                                        return branches.map(function (b) { return (b.job ? b : __assign(__assign({}, b), { kids: __spreadArray(__spreadArray([], jobBranches(b.one, isAll), true), withJobs(b.kids, isAll), true) })); });
                                    };
                                    rowOf = function (t) { return (t.job ? jobRow(t, 'list') : twigRow(t, 'list')); };
                                    endedRunsOf = function (one, list) {
                                        if (list === void 0) { list = all; }
                                        return __spreadArray([one], underOf(list, one.id), true).flatMap(function (kid) { var _a; return ((_a = kid.endedRuns) !== null && _a !== void 0 ? _a : []).filter(function (r) { var _a; return !leftCommandOf(r.id) || !((_a = kid.detached) === null || _a === void 0 ? void 0 : _a.some(function (d) { return leftCommandOf(d.id) === leftCommandOf(r.id); })); }); }).sort(function (a, b) { return a.endedAt - b.endedAt; });
                                    };
                                    treeUnder = function (one) {
                                        var under = underOf(all, one.id);
                                        var own = jobBranches(one);
                                        var runs = endedRunsOf(one, one.chat ? helpersThere : all);
                                        if (!under.length && !own.length && !runs.length)
                                            return [];
                                        var branches = __spreadArray(__spreadArray([], own, true), withJobs(branchesOf(all, one.id, function (kid) { return kid.status === 'working' || isLingering(kid, at) || jobsOf(kid, at).length > 0; })), true);
                                        var twigs = twigsOf(branches, true);
                                        var rest = under.length - twigs.filter(function (t) { return !t.job; }).length;
                                        if (!rest && !runs.length)
                                            return twigsOf(branches).map(rowOf);
                                        var closing = { depth: 1, rails: [], isLast: true, hasKids: false };
                                        return __spreadArray(__spreadArray([], twigs.map(rowOf), true), [twigRowOf(closing, "rest-".concat(one.id), endedSummary(rest, runs), true, '', function () { return openWork($, one.id); })], false);
                                    };
                                    return [4 /*yield*/, sessionName($)];
                                case 26:
                                    flowMine = _18.sent();
                                    return [4 /*yield*/, read($, flows)];
                                case 27:
                                    flowList = (_18.sent()).filter(function (f) { return isFlowShown(f, flowMine); });
                                    runningFlows = flowList.filter(function (f) { return f.status === 'working'; });
                                    shownFlows = flowList.filter(function (f) { return f.status === 'working' || isLingering(f, at); });
                                    endedFlows = flowList.filter(function (f) { return f.status !== 'working' && !isLingering(f, at); });
                                    flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(function (f) { return flowPaneOf(f.id) === paneId; }) : undefined;
                                    agentsWord = function (n) { return "".concat(n, " ").concat(n === 1 ? 'helper' : 'helpers'); };
                                    flowGlance = function (f, most) {
                                        var _a;
                                        if (most === void 0) { most = Infinity; }
                                        var time = took((f.endedAt || at) - f.startedAt);
                                        var agents = agentsWord(f.agents.length);
                                        var head = stood[f.status] ? [stood[f.status], 'Workflow'] : ['Workflow'];
                                        return firstFit([__spreadArray(__spreadArray([], head, true), [agents, time], false), [(_a = head.at(-1)) !== null && _a !== void 0 ? _a : 'Workflow', agents, time], ['Workflow', time]], most);
                                    };
                                    roundsLabel = function (f, rounds) { return (rounds.length ? "round ".concat(rounds.length).concat(f.cap ? " of ".concat(f.cap) : '') : f.cap ? "0 of ".concat(f.cap, " rounds") : ''); };
                                    verdict = function (r) { return (r.isOpen ? (r.phase ? "".concat(doing(r.phase).toLowerCase(), " now") : 'starting') : r.pass === true ? "passed".concat(r.why ? " \u00B7 ".concat(r.why) : '') : r.pass === false ? "failed \u00B7 ".concat(r.why || 'no reason given') : r.why || 'ended'); };
                                    squaresRow = function (f, rounds, key, first) {
                                        if (first === void 0) { first = 1; }
                                        var groups = squaresOf(f, rounds);
                                        if (!groups.length)
                                            groups.push(f.phases.length ? f.phases.map(function () { return 'waiting'; }) : ['waiting']);
                                        if ('Svg' in table && e.surface !== 'terminal') {
                                            // One drawing holds so many squares: a long run draws its last rounds, after how many came before
                                            var kept_1 = squaresKept(groups);
                                            var said_2 = kept_1.groups.map(function (g, i) { return "round ".concat(first + kept_1.earlier + i, ": ").concat(g.join(', ')); }).join('; ');
                                            var source = squaresSvg(kept_1.groups, LINE);
                                            return (<Box key={key} flexDirection="row" gap={1} alignItems="center" flexShrink={0}>
            {squaresBefore(kept_1) ? <Text key={"".concat(key, "-earlier")} dimColor>{"".concat(squaresBefore(kept_1), " \u00B7")}</Text> : null}
            {svgFits(source) ? <table.Svg key={"".concat(key, "-svg")} source={source} alt={said_2} width={squaresWidth(kept_1.groups)} height={LINE} isInteractive/> : <Text key={"".concat(key, "-too-big")} dimColor>{"".concat(groups.length, " rounds")}</Text>}
          </Box>);
                                        }
                                        return (<Box key={key} flexDirection="row" gap={1} flexShrink={0}>
          {groups.map(function (g, i) { return (<Box key={"".concat(key, "-").concat(i)} flexDirection="row">
              {g.map(function (one, j) { return (<Text key={"".concat(key, "-").concat(i, "-").concat(j)} color={one === 'done' || one === 'waiting' ? undefined : SQUARE_COLOR[one]} dimColor={one === 'done' || one === 'waiting'}>
                  {SQUARE_GLYPH[one]}
                </Text>); })}
            </Box>); })}
        </Box>);
                                    };
                                    stateWord = function (f, rounds) {
                                        var round = rounds.at(-1);
                                        if (f.status === 'working') {
                                            var one = round ? __spreadArray([], round.agents, true).reverse().find(function (agent) { return agent.status === 'working'; }) : undefined;
                                            return one ? doing(one.phase || stageOf(f) || 'Working') : round ? 'Between stages' : 'Starting';
                                        }
                                        if (f.status === 'stopped')
                                            return 'Stopped';
                                        if (f.status === 'failed')
                                            return 'Failed';
                                        return (round === null || round === void 0 ? void 0 : round.pass) === true ? 'Passed' : (round === null || round === void 0 ? void 0 : round.pass) === false ? 'Not passed' : 'Done';
                                    };
                                    flowModel = function (f) { var _a, _b, _c, _d; return modelName((_d = (_b = (_a = f.agents.find(function (one) { return one.model; })) === null || _a === void 0 ? void 0 : _a.model) !== null && _b !== void 0 ? _b : (_c = f.phases.find(function (one) { return one.model; })) === null || _c === void 0 ? void 0 : _c.model) !== null && _d !== void 0 ? _d : ''); };
                                    flowFacts = function (f, rounds) {
                                        var time = took((f.endedAt || at) - f.startedAt);
                                        var round = rounds.length && f.cap ? "round ".concat(rounds.length, " of ").concat(f.cap) : rounds.length ? "round ".concat(rounds.length) : '';
                                        return [stood[f.status], flowModel(f), agentsWord(f.agents.length), round, time].filter(Boolean).join(' · ');
                                    };
                                    atWork = function (f, r) {
                                        var one = __spreadArray([], r.agents, true).reverse().find(function (agent) { return agent.status === 'working'; });
                                        var phase = (one === null || one === void 0 ? void 0 : one.phase) || stageOf(f);
                                        if (!one)
                                            return 'between stages';
                                        if (phase === 'Make')
                                            return r.n === 1 ? 'Maker building it' : 'Maker fixing what the check found';
                                        if (phase === 'Check')
                                            return 'Checker testing it';
                                        return doing(phase || 'Working');
                                    };
                                    flowDots = function (key) {
                                        var _a;
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={dots(FLOW, LINE)} alt="Working now" width={22} height={LINE} isInteractive/>
        </Box>) : e.surface === 'terminal' ? (((_a = termDots(table, $, paneId, key, FLOW)) !== null && _a !== void 0 ? _a : <Text key={key} color={FLOW}>▸</Text>)) : (<Text key={key} color={FLOW}>▸</Text>);
                                    };
                                    roundRow = function (f, rounds, n, isPassed) {
                                        var r = rounds[n - 1];
                                        var key = "flow-round-".concat(f.id, "-").concat(n);
                                        var label = function (color, isDim) {
                                            if (isDim === void 0) { isDim = false; }
                                            return (<Box key={"".concat(key, "-label")} flexShrink={0}>
          <Text color={color} dimColor={isDim}>{"Round ".concat(n)}</Text>
        </Box>);
                                        };
                                        var row = function (parts) { return (<Box key={key} flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
          {squaresRow(f, r ? [r] : [], "".concat(key, "-squares"), n)}
          {parts}
        </Box>); };
                                        if (!r && n === 1 && f.status === 'working')
                                            return row([label(FLOW), flowDots("".concat(key, "-dots")), <Text key={"".concat(key, "-why")} color={FLOW} wrap="truncate-end">Starting</Text>]);
                                        if (!r)
                                            return row([label(undefined, true), <Text key={"".concat(key, "-why")} dimColor wrap="truncate-end">{isPassed ? 'not needed' : f.status === 'working' ? 'if needed' : 'not run'}</Text>]);
                                        if (r.isOpen)
                                            return row([
                                                label(FLOW),
                                                f.status === 'working' ? flowDots("".concat(key, "-dots")) : null,
                                                <Box key={"".concat(key, "-what")} flexShrink={1} minWidth={0}>
            <Text color={FLOW} wrap="truncate-end">{atWork(f, r)}</Text>
          </Box>,
                                            ]);
                                        var cutShort = r.pass === undefined && !r.why && r.agents.some(function (one) { return one.status !== 'done'; });
                                        var why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : cutShort ? (f.status === 'failed' ? 'failed with an error' : 'stopped') : 'ended')).replace(/[.。]+$/, '');
                                        var found = r.pass === false && r.findings.length ? "".concat(r.findings.length, " found \u00B7 ") : '';
                                        return row([
                                            label(r.pass ? DONE : undefined),
                                            <Box key={"".concat(key, "-why")} flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{r.pass ? "passed \u00B7 ".concat(why) : "".concat(found).concat(why)}</Text>
        </Box>,
                                        ]);
                                    };
                                    flowPassed = function (f, rounds) {
                                        var _a;
                                        var pass = (_a = rounds.at(-1)) === null || _a === void 0 ? void 0 : _a.pass;
                                        if (pass !== undefined)
                                            return pass;
                                        if (/"passed"\s*:\s*false|\bnot passed\b/i.test(f.result))
                                            return false;
                                        if (/"passed"\s*:\s*true|\bpassed\b/i.test(f.result))
                                            return true;
                                        return undefined;
                                    };
                                    flowEnd = function (f, rounds) {
                                        var _a;
                                        if (f.status !== 'done')
                                            return null;
                                        var n = rounds.length;
                                        var pass = flowPassed(f, rounds);
                                        var of = f.cap ? " of ".concat(f.cap) : '';
                                        var said = pass === true ? "\u2713 Passed in round ".concat(n).concat(of) : pass === false ? "Not passed after ".concat(n).concat(of, " ").concat(((_a = f.cap) !== null && _a !== void 0 ? _a : n) === 1 ? 'round' : 'rounds') : '✓ Finished';
                                        return (<Box key={"flow-end-".concat(f.id)} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          {pass === false ? <Text color="error">✕</Text> : null}
          <Text color={pass === false ? undefined : DONE} wrap="truncate-end">{said}</Text>
        </Box>);
                                    };
                                    flowSmall = function (f) {
                                        var _a;
                                        var rounds = roundsOf(f);
                                        var count = Math.max(rounds.length, (_a = f.cap) !== null && _a !== void 0 ? _a : 0);
                                        var isPassed = f.status === 'done' && flowPassed(f, rounds) === true;
                                        var scope = "flow-".concat(f.id);
                                        return (<Box key={"flow-".concat(f.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0} {...(isFlowMoment(f) && !isAbovePrompt ? { borderStyle: 'round', borderColor: DONE } : {})}>
          {/* Blue while it runs, green only when it finished and its last round did not fail */}
          {f.status === 'working' || (f.status === 'done' && flowPassed(f, rounds) !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE}/> : <Box width={1} flexShrink={0}/>}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box flexDirection="row" gap={1} height={1} overflow="hidden">
                <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
                  <Button key={"flow-open-".concat(f.id, "-").concat(presses)} plain hover={{ scope: scope, underline: true }} onPress={function () { return openFlow($, f.id); }}>
                    <Text bold wrap="truncate-end">{f.title}</Text>
                  </Button>
                </Box>
                <Box flexGrow={1}/>
                {f.status === 'working' && f.session === flowMine ? (<Box flexShrink={0}>
                    <Button key={"flow-stop-".concat(f.id)} label="Stop" plain dimColor hover={{ scope: "flow-stop-".concat(f.id), underline: true }} onPress={function () { return void stopFlow($, f.id); }}/>
                  </Box>) : null}
              </Box>
              <Box paddingLeft={lead}>
                <Text dimColor wrap="truncate-end">{flowFacts(f, rounds)}</Text>
              </Box>
            </Box>
            {f.bar ? (<Box flexDirection="row" gap={1} height={2} overflow="hidden" paddingLeft={lead}>
                <Box flexShrink={0}>
                  <Text dimColor>Test to pass ·</Text>
                </Box>
                <Box flexShrink={1} minWidth={0}>
                  <Text dimColor wrap="wrap">{cut(f.bar, Math.max(20, room - 12))}</Text>
                </Box>
              </Box>) : null}
            <Box flexDirection="column" paddingLeft={lead}>
              {Array.from({ length: Math.max(1, count) }, function (_, i) { return roundRow(f, rounds, i + 1, isPassed); })}
            </Box>
            {flowEnd(f, rounds)}
          </Box>
        </Box>);
                                    };
                                    flowOpen = flowShown ? pickedOf(flowShown) : undefined;
                                    workId = paneId === LIST ? '' : flowShown ? "".concat(flowShown.id, ":").concat((_6 = flowOpen === null || flowOpen === void 0 ? void 0 : flowOpen.id) !== null && _6 !== void 0 ? _6 : '') : ((_8 = (_7 = __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (one) { return workPaneOf(one.id) === paneId; })) === null || _7 === void 0 ? void 0 : _7.id) !== null && _8 !== void 0 ? _8 : '');
                                    open = (_9 = folds.get(workId)) !== null && _9 !== void 0 ? _9 : [];
                                    fold = function (at) {
                                        var _a;
                                        presses += 1;
                                        var was = (_a = folds.get(workId)) !== null && _a !== void 0 ? _a : [];
                                        folds.set(workId, was.includes(at) ? was.filter(function (n) { return n !== at; }) : __spreadArray(__spreadArray([], was, true), [at], false));
                                        void update($, view, function (v) { return (__assign({}, v)); });
                                    };
                                    part = function (key, name, side, body) { return (<Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Box flexDirection="row" alignItems="flex-start" gap={2}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text bold dimColor wrap="wrap">{name}</Text>
          </Box>
          {side ? (<Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="truncate-end">{side}</Text>
            </Box>) : null}
        </Box>
        {body}
      </Box>); };
                                    row = function (key, mark, item, under) {
                                        if (under === void 0) { under = ''; }
                                        return (<Box key={key} flexDirection="row" alignItems="flex-start" gap={1}>
        {mark}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text wrap="wrap" dimColor={item.state !== 'doing'} strikethrough={item.state === 'dropped'}>
            {item.text}
          </Text>
          {under ? <Text wrap="wrap" dimColor>{under}</Text> : null}
        </Box>
      </Box>);
                                    };
                                    opener = function (at, label) { return (<Box key={"fold-".concat(at)} alignItems="flex-start">
        <Button key={"fold-".concat(at, "-").concat(presses)} label={"".concat(open.includes(at) ? '▾' : '▸', " ").concat(label)} plain dimColor onPress={function () { return fold(at); }}/>
      </Box>); };
                                    askPart = function (one) {
                                        var whole = quoted(one.words, 1200);
                                        var short = cut(whole, room);
                                        var isLong = short !== whole;
                                        return part('part-ask', 'Started from', '', <Box flexDirection="column">
          <Text wrap="wrap" dimColor>{"\u201C".concat(isLong && !open.includes(OPEN_ASK) ? short : whole, "\u201D")}</Text>
          {isLong ? opener(OPEN_ASK, open.includes(OPEN_ASK) ? 'Show less' : 'Show all') : null}
        </Box>);
                                    };
                                    todoPart = function (one) {
                                        var isWorking = one.status === 'working';
                                        var done = one.items.filter(function (item) { return item.state === 'done'; }).length;
                                        var kept = one.items.filter(function (item) { return item.state !== 'dropped'; }).length;
                                        var where = isWorking ? now(one) : '';
                                        var hasDoing = one.items.some(function (item) { return item.state === 'doing'; });
                                        var isFolded = done > DONE_FOLDED && !open.includes(OPEN_DONE);
                                        if (!one.items.length && !where)
                                            return null;
                                        var isWhereSaid = false;
                                        return part('part-todos', 'To-dos', kept ? "".concat(done, " of ").concat(kept, " done") : '', <Box flexDirection="column">
          {done > DONE_FOLDED ? opener(OPEN_DONE, isFolded ? "".concat(done, " done") : 'Hide done') : null}
          {one.items.map(function (item, i) {
                                                if (item.state === 'done' && isFolded)
                                                    return null;
                                                if (item.state === 'doing') {
                                                    var under = !isWhereSaid && where ? cut(where, room) : '';
                                                    isWhereSaid = true;
                                                    return row("todo-".concat(i), isWorking ? live("live-doing-".concat(i)) : <Text dimColor>○</Text>, item, under);
                                                }
                                                var mark = item.state === 'done' ? <Text color="success" dimColor>✓</Text> : <Text dimColor>{item.state === 'dropped' ? '✕' : '○'}</Text>;
                                                return row("todo-".concat(i), mark, item);
                                            })}
          {!hasDoing && where ? (<Box key="where" flexDirection="row" alignItems="flex-start" gap={1}>
              {live('live-where')}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="wrap">{cut(where, room)}</Text>
              </Box>
            </Box>) : null}
        </Box>);
                                    };
                                    underTwig = function (t) {
                                        var _a, _b, _c;
                                        if (t.job) {
                                            // (its row says it in plain words, so the last line is here as it was printed too)
                                            var tail = t.job.id.startsWith('more-') ? [] : ((_a = t.job.tail) !== null && _a !== void 0 ? _a : []).slice(-OUTPUT_LINES);
                                            if (!tail.length)
                                                return null;
                                            var inset_1 = canOpenJob(t.job) ? lead : 0;
                                            return (<Box key={"tail-".concat(t.job.id)} flexDirection="column" flexShrink={0}>
            {tail.map(function (line, n) {
                                                    var _a;
                                                    return twigUnder(t, "tail-".concat((_a = t.job) === null || _a === void 0 ? void 0 : _a.id, "-").concat(n), <Box flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={OUTPUT_FILL}>
                  <Text dimColor wrap="truncate-end">
                    {line}
                  </Text>
                </Box>, inset_1);
                                                })}
          </Box>);
                                        }
                                        var kid = t.one;
                                        if (!kid || kid.status !== 'working')
                                            return null;
                                        var kept = kid.items.filter(function (item) { return item.state !== 'dropped'; });
                                        var doing = kept.findIndex(function (item) { return item.state === 'doing'; });
                                        var lines = [doing >= 0 ? "To-do ".concat(doing + 1, " of ").concat(kept.length, " \u00B7 ").concat((_c = (_b = kept[doing]) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '') : '', now(kid)].filter(Boolean);
                                        if (!lines.length)
                                            return null;
                                        return (<Box key={"under-".concat(kid.id)} flexDirection="column" flexShrink={0}>
          {lines.map(function (line, n) {
                                                return twigUnder(t, "under-".concat(kid.id, "-").concat(n), <Text dimColor wrap="truncate-end">
                {line}
              </Text>);
                                            })}
        </Box>);
                                    };
                                    helpersPart = function (one) {
                                        // Another chat's work has its helpers from that chat's file
                                        var list = one.chat ? helpersThere : all;
                                        var under = underOf(list, one.id);
                                        var branches = __spreadArray(__spreadArray([], jobBranches(one, true), true), withJobs(branchesOf(list, one.id, function () { return true; }), true), true);
                                        // (what one command left going counts as that one command, however many programs it is)
                                        var jobs = __spreadArray([one], under, true).reduce(function (n, kid) { return n + jobsOf(kid, at).reduce(function (sum, job) { var _a; return sum + (leftCommandOf(job.id) ? 1 : ((_a = job.count) !== null && _a !== void 0 ? _a : 1)); }, 0); }, 0);
                                        if (!under.length && !jobs)
                                            return null;
                                        var running = under.filter(function (kid) { return kid.status === 'working'; }).length;
                                        // Beside the jobs, the helpers are named, so neither count reads as the other's
                                        var helpers = running === under.length ? "".concat(running, " ").concat(running === 1 ? 'helper' : 'helpers', " working") : running ? "".concat(running, " of ").concat(under.length, " helpers working") : "".concat(under.length, " ").concat(under.length === 1 ? 'helper' : 'helpers');
                                        var side = [jobs ? "".concat(jobs, " ").concat(jobs === 1 ? 'command' : 'commands', " running") : '', under.length ? helpers : ''].filter(Boolean).join(' · ');
                                        return part('part-helpers', !jobs ? 'Helpers' : under.length ? 'Helpers and commands' : 'Commands', side, <Box flexDirection="column">{twigsOf(branches).flatMap(function (t) { return [t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)]; })}</Box>);
                                    };
                                    endedRunsPart = function (one) {
                                        var runs = endedRunsOf(one, one.chat ? helpersThere : all).reverse();
                                        if (!runs.length)
                                            return null;
                                        var isBad = function (run) { return run.how === 'failed' || run.how === 'killed' || run.how === 'timed out'; };
                                        var bad = runs.filter(isBad).length;
                                        return part('part-ended-runs', 'Commands ended', endedSummary(0, runs), <Box flexDirection="column">
          {runs.map(function (run) { return (<Box key={"ended-".concat(run.id)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{describedOf(run.what).text || run.what || 'A command'}</Text>
              </Box>
              <Box flexShrink={0}>
                <Text dimColor={!isBad(run)} color={isBad(run) ? NEEDS : undefined}>{"".concat(endedLine(run, took(run.endedAt - run.at)), " \u00B7 ").concat(shortAgo(at - run.endedAt), " ago")}</Text>
              </Box>
            </Box>); })}
        </Box>);
                                    };
                                    talk = function (one, lines, shots) {
                                        // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
                                        // a row under it that opens it whole in a window of its own, large enough to look at; one that is gone is named
                                        var drawing = uiOf($, e);
                                        var picturesOfRun = function (block, at) {
                                            var made = block.flatMap(function (line) { var _a, _b; return (_b = shots.get((_a = line.at) !== null && _a !== void 0 ? _a : -1)) !== null && _b !== void 0 ? _b : []; });
                                            if (!made.length)
                                                return null;
                                            return (<Box key={"pics-".concat(at)} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map(function (pic, n) { return (<Box key={"pic-".concat(at, "-").concat(n)} flexDirection="column" alignItems="flex-start" width="100%">
                {pic.thumb && e.surface !== 'terminal' && 'Svg' in drawing ? (<drawing.Svg key={"pic-svg-".concat(at, "-").concat(n)} source={pic.thumb.source} alt={"Picture: ".concat(pic.name)} {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}/>) : null}
                {pic.isGone ? (<Text dimColor wrap="wrap">{"Picture: ".concat(pic.name, " \u00B7 no longer available")}</Text>) : (<Button key={"pic-open-".concat(at, "-").concat(n, "-").concat(presses)} label={"\u2922 ".concat(pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open', ": ").concat(cut(pic.name, Math.max(12, room - 14)))} plain onPress={function (press) { return ((presses += 1), redraw($), void showPicture($, pic.path, paneId, "pic-".concat(at, "-").concat(n), press.surface)); }}/>)}
                {e.surface === 'terminal' && !pic.isGone ? pictureSaidRow($, drawing, "pic-said-".concat(at, "-").concat(n), pic.path) : null}
              </Box>); })}
          </Box>);
                                        };
                                        // Each line knows how many tool steps came before it: that names a run of steps whatever is drawn above it
                                        var uses = 0;
                                        var shown = newest((lines !== null && lines !== void 0 ? lines : []).map(function (line) { return (__assign(__assign({}, line), { at: line.isUse ? (uses += 1) : uses })); }));
                                        var blocks = shown.reduce(function (all, line) {
                                            var _a;
                                            var last = all.at(-1);
                                            return line.kind === 'step' && ((_a = last === null || last === void 0 ? void 0 : last[0]) === null || _a === void 0 ? void 0 : _a.kind) === 'step' ? __spreadArray(__spreadArray([], all.slice(0, -1), true), [__spreadArray(__spreadArray([], last, true), [line], false)], false) : __spreadArray(__spreadArray([], all, true), [[line]], false);
                                        }, []);
                                        return (<Box flexDirection="column" gap={1}>
          {lines ? null : <Text dimColor>The app didn't save this task's conversation.</Text>}
          {blocks.map(function (block, i) {
                                                var _a, _b;
                                                var first = block[0];
                                                var at = (_a = first === null || first === void 0 ? void 0 : first.at) !== null && _a !== void 0 ? _a : 0;
                                                if ((first === null || first === void 0 ? void 0 : first.kind) === 'step') {
                                                    var isOpen_1 = open.includes(at);
                                                    return (<Box key={"talk-".concat(i)} flexDirection="column" alignItems="flex-start">
                  <Button key={"run-".concat(at, "-").concat(presses)} label={"".concat(isOpen_1 ? '▾' : '▸', " ").concat(folded(block))} plain dimColor onPress={function () { return fold(at); }}/>
                  {isOpen_1
                                                            ? listed(block).map(function (line, n) { return (<Box key={"step-".concat(i, "-").concat(n)} paddingLeft={2}>
                          <Text wrap="wrap" dimColor={!line.isError} color={line.isError ? 'error' : undefined}>
                            {line.isError ? "".concat(line.text, " (failed)") : line.text}
                          </Text>
                        </Box>); })
                                                            : null}
                  {picturesOfRun(block, at)}
                </Box>);
                                                }
                                                if ((first === null || first === void 0 ? void 0 : first.kind) === 'said')
                                                    return (<Markdown key={"talk-".concat(i)} text={first.text}/>);
                                                // A move to another model is one quiet line where it happened, with its time
                                                if ((first === null || first === void 0 ? void 0 : first.kind) === 'model')
                                                    return (<Box key={"talk-".concat(i)}>
                  <Text dimColor wrap="wrap">{first.text}</Text>
                </Box>);
                                                var text = (_b = first === null || first === void 0 ? void 0 : first.text) !== null && _b !== void 0 ? _b : '';
                                                var isLong = text.length > TOLD_CHARS * 2;
                                                var isOpen = open.includes(-at - 1);
                                                // The long brief the work began with is one quiet row until pressed: "Started from" above already gives the person's words
                                                if (i === 0 && (first === null || first === void 0 ? void 0 : first.kind) === 'told' && isLong && !isOpen)
                                                    return (<Box key={"talk-".concat(i)} alignItems="flex-start">
                  <Button key={"told-".concat(at, "-").concat(presses)} label="▸ The instructions Claude was given" plain dimColor onPress={function () { return fold(-at - 1); }}/>
                </Box>);
                                                return (<Box key={"talk-".concat(i)} flexDirection="column" alignItems="flex-start" backgroundColor={FILL} paddingX={2} paddingY={1}>
                {(first === null || first === void 0 ? void 0 : first.kind) === 'steer' ? <Text dimColor>{first.isWaiting ? 'You · not yet answered' : 'You'}</Text> : null}
                <Markdown text={isLong && !isOpen ? cut(text, TOLD_CHARS) : text}/>
                {isLong ? <Button key={"told-".concat(at, "-").concat(presses)} label={isOpen ? '▾ Show less' : '▸ Show all'} plain dimColor onPress={function () { return fold(-at - 1); }}/> : null}
              </Box>);
                                            })}
          {!lines && one.answer ? (<Markdown text={one.answer}/>) : null}
        </Box>);
                                    };
                                    theirChat = function (one, c) { return (<Text dimColor wrap="wrap">{"This task runs in the chat \"".concat(chatName(c), "\"").concat(c.host ? " on ".concat(macName(c.host)) : '', ".").concat(one.status === 'working' ? ' Stop it or change its model there.' : '')}</Text>); };
                                    openTheirs = function (one, c) {
                                        var s = otherChats.find(function (other) { return other.chat === c.id && other.host === c.host; });
                                        return s && pressOf(s) ? <Button key={"their-chat-".concat(one.id, "-").concat(presses)} label="Open that chat ↗" plain onPress={function () { return void ((presses += 1), openChat($, s)); }}/> : null;
                                    };
                                    resultPart = function (one) {
                                        if (one.status === 'working' || !one.answer.trim())
                                            return null;
                                        var whole = one.answer.trim();
                                        var short = cut(whole, RESULT_SHOWN);
                                        var isLong = short !== whole;
                                        return part('part-result', 'Result', '', <Box flexDirection="column">
          <Markdown text={isLong && !open.includes(OPEN_RESULT) ? short : whole}/>
          {isLong ? opener(OPEN_RESULT, open.includes(OPEN_RESULT) ? 'Show less' : 'Show all') : null}
        </Box>);
                                    };
                                    big = function (one, lines) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                        var showing = lines ? newest(lines).length : 0;
                                        var parent = one.parentId ? __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (card) { return card.id === one.parentId; }) : undefined;
                                        return (<Box key={"todo-".concat(one.id)} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {one.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={LIVE}/> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{titleOf(one)}</Text>
                {facts(one, true)}
              </Box>
              {parent ? (<Box flexDirection="row" alignItems="flex-start">
                  <Button key={"open-parent-".concat(one.id, "-").concat(presses)} label={"\u2191 A helper of: ".concat(cut(titleOf(parent), Math.max(20, room - 16)))} plain dimColor hover={{ scope: "parent-".concat(one.id), underline: true }} onPress={function () { return openWork($, parent.id); }}/>
                </Box>) : null}
              {one.chat ? (<Box flexDirection="row" flexWrap="wrap" alignItems="flex-start" gap={1}>
                  <Text dimColor wrap="wrap">{"From the chat \"".concat(chatName(one.chat), "\"").concat(chatSide(one.chat, selfName()) ? ", ".concat(chatSide(one.chat, selfName())) : '')}</Text>
                  {openTheirs(one, one.chat)}
                </Box>) : null}
              {(one.status === 'working' && !one.chat) || left(one) || (one.status === 'stopped' && one.byYou && !one.chat) ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={"stop-".concat(one.id)} label="Stop" onPress={function () { return void stop($, one.id); }}/> : null}
                  {/* Work the person stopped stays stopped until they start it again from here or ask in a message */}
                  {one.status === 'stopped' && one.byYou && !one.chat ? <Button key={"again-".concat(one.id, "-").concat(presses)} label="Start again" onPress={function () { return ((presses += 1), void startAgain($, one.id)); }}/> : null}
                  {left(one) ? <Button key={"artifact-".concat(one.id, "-").concat(presses)} label="Result" onPress={function () { var _a, _b; return void openReport($, (_b = (_a = left(one)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''); }}/> : null}
                </Box>) : null}
            </Box>
          </Box>
          {/* What it made, right under its title, while it works and once it is done */}
          {((_a = madeNow($, one)) === null || _a === void 0 ? void 0 : _a.made.length) || ((_b = madeNow($, one)) === null || _b === void 0 ? void 0 : _b.code) ? part('part-files', 'Files', '', (_d = madeTiles($, table, (_c = madeNow($, one)) !== null && _c !== void 0 ? _c : { made: [] }, paneId, "files-".concat(one.id), e.surface)) !== null && _d !== void 0 ? _d : <Box />) : null}
          {((_e = one.admins) === null || _e === void 0 ? void 0 : _e.length) || cardNotesOf(one.id, at).length ? (<Box key="part-gates" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Waiting for you</Text>
                {adminBlock($, table, one, "gates-big-".concat(one.id), at)}
              </Box>
            </Box>) : null}
          {runningOn(one.id).length && !one.chat ? (<Box key="part-runs" flexDirection="column" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              {runBlock($, table, one, "runs-big-".concat(one.id), at)}
            </Box>) : null}
          {one.ask ? (<Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>{needsPerson(one) ? 'Waiting for you' : 'Claude is working on your reply'}</Text>
                {askBlock(one, "ask-big-".concat(one.id), true)}
              </Box>
            </Box>) : sentLine(one, at) ? (<Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Box flexDirection="column" gap={1} minWidth={0}>
                <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
                {canTakeBack(one, at) ? <Button key={"take-back-big-".concat(one.id, "-").concat((_g = (_f = heldAnswer(one, at)) === null || _f === void 0 ? void 0 : _f.at) !== null && _g !== void 0 ? _g : 0)} label={"\u21B6 Take back \u201C".concat(cut((_j = (_h = heldAnswer(one, at)) === null || _h === void 0 ? void 0 : _h.text) !== null && _j !== void 0 ? _j : '', 30), "\u201D")} plain onPress={function () { var _a, _b; return void ((presses += 1), takeBack($, one, (_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0).catch(function (err) { return log($, "answer not taken back: ".concat(String(err))); })); }}/> : null}
              </Box>
            </Box>) : null}
          {resultPart(one)}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {endedRunsPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
                                                ? part('part-chat', 'Conversation', '', theirChat(one, one.chat))
                                                : part('part-chat', 'Conversation', lines && showing < lines.length ? "last ".concat(showing, " lines") : '', talks.has(one.id) ? talk(one, lines, (_l = (_k = shots.get(one.id)) === null || _k === void 0 ? void 0 : _k.shots) !== null && _l !== void 0 ? _l : new Map()) : <Text dimColor>Reading the conversation…</Text>)}
        </Box>);
                                    };
                                    promptButtons = function (p, key) {
                                        var press = function (said) { return function () { return void (answerPrompt($, p.id, said), redraw($)); }; };
                                        return (<Box key={"prompt-buttons-".concat(key)} flexDirection="row" gap={1}>
          <Button key={"prompt-yes-".concat(key, "-").concat(presses)} label="Yes" variant="primary" onPress={press('yes')}/>
          <Button key={"prompt-no-".concat(key, "-").concat(presses)} label="No" onPress={press('no')}/>
        </Box>);
                                    };
                                    isHeldHere = function (p, c) { return Boolean(!c && p.isHeld && promptHeld.has(p.id)); };
                                    promptCard = function (p, key, where, c, isOnCard) {
                                        if (isOnCard === void 0) { isOnCard = false; }
                                        return (<Box key={"prompt-".concat(key)} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
        <Box flexDirection="column">
          <Text dimColor wrap="truncate-end">{"".concat(p.kind === 'question' ? 'Question' : p.kind === 'plan' ? 'Plan' : 'Permission', " \u00B7 ").concat(isHeldHere(p, c) || !c ? 'waiting for you' : 'waiting in another chat')}</Text>
          {isOnCard ? null : <Text bold wrap="truncate-end">{p.title || (c ? 'That chat itself' : 'This chat itself')}</Text>}
          {/* At the top, away from its chat's name: which chat it is */}
          {c ? <Text key={"prompt-".concat(key, "-chat")} dimColor wrap="truncate-end">{"In the chat \u201C".concat(chatName(c), "\u201D").concat(c.host ? " on ".concat(macName(c.host)) : '')}</Text> : null}
          <Text dimColor wrap="wrap">{p.kind === 'question' ? 'Has a question for you' : p.kind === 'plan' ? 'Wants you to approve its plan' : 'Needs your permission'}</Text>
        </Box>
        <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
        {p.detail ? (<Box backgroundColor={FILL} paddingLeft={2} paddingRight={1}>
            <Text mono wrap="wrap">{p.detail}</Text>
          </Box>) : null}
        {p.yes || p.no ? (<Box flexDirection="column">
            {p.yes ? <Text wrap="wrap">{p.yes}</Text> : null}
            {p.no ? <Text wrap="wrap">{p.no}</Text> : null}
          </Box>) : null}
        {isHeldHere(p, c) ? promptButtons(p, key) : <Text dimColor wrap="wrap">{where}</Text>}
        {c && pressOf(c) && !isHeldHere(p, c) ? (<Box flexDirection="row">
            <Button key={"prompt-open-".concat(key, "-").concat(presses)} label="Open that chat" onPress={function () { return void ((presses += 1), openChat($, c).catch(function (err) { return log($, "chat not opened: ".concat(String(err))); })); }}/>
          </Box>) : null}
      </Box>);
                                    };
                                    answerHere = function (p) { return (p.kind === 'question' ? 'Pick your answer in the box at the bottom of this chat.' : 'Answer Yes or No in the box at the bottom of this chat.'); };
                                    saidOf = function (p) {
                                        var _a;
                                        if (p.answered === 'stopped')
                                            return 'It ended before you answered · nothing happened';
                                        if (p.answered === 'no')
                                            return p.kind === 'question' ? 'You skipped it · Claude got no answer and is waiting for you' : p.kind === 'plan' ? 'You said no · Claude keeps planning' : p.title ? "You said no · it didn't run, and Claudopus told Claude" : "You said no · it didn't run, and Claude is waiting for what you say next";
                                        if (p.kind === 'question')
                                            return p.isRunning ? 'You answered · Claude has your answer' : 'You answered · Claude is continuing with your answer';
                                        if (p.kind === 'plan')
                                            return 'You approved the plan · Claude is carrying it out';
                                        if (p.isCut)
                                            return 'You allowed it · it stopped before it finished';
                                        return p.isRunning ? 'You allowed it · it is running now' : "You allowed it \u00B7 ".concat((_a = p.done) !== null && _a !== void 0 ? _a : 'it ran and is done');
                                    };
                                    answeredCard = function (p, key, c, isOnCard) {
                                        if (isOnCard === void 0) { isOnCard = false; }
                                        return reportLine(table, "answered-".concat(key), p.answered !== 'no' && p.answered !== 'stopped' && !p.isCut, saidOf(p), isOnCard ? [p.text] : [p.title || (c ? 'That chat itself' : 'This chat itself'), p.text]);
                                    };
                                    chatHead = function (key, name, side, c) {
                                        var url = c ? pressOf(c) : '';
                                        var label = <Text bold dimColor wrap="truncate-end">{name}</Text>;
                                        return (<Box key={"chat-head-".concat(key)} flexDirection="column" paddingTop={1} flexShrink={0}>
          {/* One line whatever the name's length: cut short, never wrapped */}
          <Box flexDirection="row" alignItems="flex-start" gap={2} paddingX={2} height={1} overflow="hidden">
            <Box flexGrow={1} flexShrink={1} minWidth={0} height={1} overflow="hidden">
              {c && url ? (<Button key={"chat-open-".concat(key)} plain hover={{ underline: true }} onPress={function () { return void openChat($, c); }}>
                  {label}
                </Button>) : (<Box flexShrink={1} minWidth={0} paddingLeft={lead}>{label}</Box>)}
            </Box>
            {side ? (<Box flexShrink={0}>
                <Text dimColor wrap="truncate-end">{side}</Text>
              </Box>) : null}
          </Box>
        </Box>);
                                    };
                                    left = function (one) { return kept.filter(function (r) { return r.agent === one.id; }).sort(function (a, b) { return b.at - a.at; })[0]; };
                                    endedElsewhere = elsewhere.filter(function (one) { return one.status !== 'working' && !one.ask && !lingers(one, at) && !isVanished(one.id); });
                                    shownOf = function (c) { return elsewhere.filter(function (one) { var _a; return ((_a = one.chat) === null || _a === void 0 ? void 0 : _a.id) === c.chat && one.chat.host === c.host && (one.status === 'working' || one.ask || lingers(one, at)); }); };
                                    listedChats = otherChats.filter(function (c) { var _a; return shownOf(c).length || ((_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) || answeredOf(c.answeredPrompts).length; });
                                    finished = __spreadArray(__spreadArray([], own.filter(function (one) { return isDismissed(one) || (one.status !== 'working' && !isLingering(one, at) && !one.ask && !resultWaits(one).length && !isLeftStopped(one, at) && !isLeftOpen(one, at)); }), true), endedElsewhere, true).sort(function (a, b) { return b.endedAt - a.endedAt; });
                                    finishedPart = function (isOpen) {
                                        return finished.length || endedFlows.length ? (<Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button key={"finished-fold-".concat(presses)} label={"".concat(isOpen ? '▾' : '▸', " Finished ").concat(finished.length + endedFlows.length)} plain hotkey={keyed ? 'f' : undefined} onPress={function () { return void ((presses += 1), isOpen && (foldPress = presses), update($, view, function (v) { return (__assign(__assign({}, v), { isFinishedOpen: !v.isFinishedOpen })); })); }}/>
            </Box>
            <Text dimColor>{endedElsewhere.length ? 'all chats' : 'this chat'}</Text>
          </Box>
          {isOpen
                                                ? __spreadArray(__spreadArray([], finished.map(function (one) { return ({ at: one.endedAt, card: function () { return small(one); } }); }), true), endedFlows.map(function (f) { return ({ at: f.endedAt, card: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return b.at - a.at; }).map(function (one) { return one.card(); })
                                                : null}
        </Box>) : null;
                                    };
                                    flowBig = function (f, picked, lines) {
                                        var _a, _b, _c, _d;
                                        var rounds = roundsOf(f);
                                        var current = stageOf(f);
                                        var agentRow = function (one) {
                                            var _a;
                                            var isPicked = (picked === null || picked === void 0 ? void 0 : picked.id) === one.id;
                                            var facts = [modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), one.status === 'working' ? (f.status === 'working' ? 'working' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ');
                                            return (<Box key={"flow-agent-".concat(one.id)} flexDirection="row" alignItems="flex-start" gap={1} paddingLeft={2}>
            <Button key={"flow-pick-".concat(one.id, "-").concat(presses)} label={"".concat(isPicked ? '▾' : '▸', " ").concat(one.label || one.phase || 'helper')} plain dimColor={!isPicked} onPress={function () { return ((presses += 1), flowPicked.set(f.id, one.id), void update($, view, function (v) { return (__assign({}, v)); })); }}/>
            <Box flexShrink={1} minWidth={0}>
              <Text dimColor wrap="wrap">{facts}</Text>
            </Box>
          </Box>);
                                        };
                                        return (<Box key={"flow-".concat(f.id)} flexDirection="column" gap={1} flexGrow={1}>
          <Box key="part-head" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
            {f.status === 'working' ? <Box width={1} flexShrink={0} backgroundColor={FLOW}/> : null}
            <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
              <Box flexDirection="column">
                <Text bold wrap="wrap">{f.title}</Text>
                <Text dimColor wrap="wrap">{flowGlance(f)}</Text>
              </Box>
              <Box flexDirection="column">
                <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                  {squaresRow(f, rounds, "flow-big-squares-".concat(f.id))}
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {stateWord(f, rounds)}
                  </Text>
                </Box>
              </Box>
              {f.status === 'working' && f.session === flowMine ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
                  <Button key={"flow-stop-".concat(f.id)} label="Stop" onPress={function () { return void stopFlow($, f.id); }}/>
                </Box>) : null}
            </Box>
          </Box>
          {f.words || f.task ? askPart(__assign({}, started(f.id, '', f.title, f.words || f.task, f.startedAt))) : null}
          {part('part-stages', 'Stages', f.name, <Box flexDirection="column" gap={1}>
              {f.phases.map(function (p, i) {
                                                    var _a;
                                                    var ran = f.agents.filter(function (one) { return one.phase === p.title; });
                                                    var isNow = p.title === current;
                                                    return (<Box key={"flow-phase-".concat(i)} flexDirection="row" alignItems="flex-start" gap={1}>
                    {isNow ? <Text color={FLOW}>■</Text> : <Text dimColor>{ran.length ? '✓' : '○'}</Text>}
                    <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={isNow ? FLOW : undefined} bold={isNow} dimColor={!isNow}>
                        {p.title}
                      </Text>
                      <Text wrap="wrap" dimColor>
                        {[p.detail, modelName((_a = p.model) !== null && _a !== void 0 ? _a : ''), ran.length ? "".concat(ran.length, " ").concat(ran.length === 1 ? 'helper' : 'helpers') : ''].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                  </Box>);
                                                })}
            </Box>)}
          {part('part-rounds', 'Rounds', roundsLabel(f, rounds), <Box flexDirection="column" gap={1}>
              {rounds.length ? null : <Text dimColor>{f.status === 'working' ? 'The first round is starting.' : 'No helper ran.'}</Text>}
              {rounds.map(function (r) { return (<Box key={"flow-round-".concat(r.n)} flexDirection="column">
                  <Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {squaresRow(f, [r], "flow-round-squares-".concat(r.n), r.n)}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap" color={r.isOpen ? FLOW : undefined} bold={r.isOpen} dimColor={!r.isOpen}>{"Round ".concat(r.n, ": ").concat(verdict(r))}</Text>
                    </Box>
                  </Box>
                  {r.agents.map(agentRow)}
                  {r.findings.length && r.pass === false ? (<Box flexDirection="column" paddingLeft={4}>
                      {r.findings.map(function (one, i) { return (<Text key={"flow-finding-".concat(r.n, "-").concat(i)} wrap="wrap" dimColor>{"\u2013 ".concat(one)}</Text>); })}
                    </Box>) : null}
                </Box>); })}
            </Box>)}
          {picked
                                                ? part('part-chat', "Conversation of the ".concat(picked.label || picked.phase || 'helper').concat(rounds.length > 1 ? " \u00B7 round ".concat((_b = (_a = rounds.find(function (r) { return r.agents.some(function (one) { return one.id === picked.id; }); })) === null || _a === void 0 ? void 0 : _a.n) !== null && _b !== void 0 ? _b : '') : ''), modelName((_c = picked.model) !== null && _c !== void 0 ? _c : ''), talk(__assign(__assign({}, started(picked.id, '', picked.label, '', picked.at)), { answer: (_d = picked.result) !== null && _d !== void 0 ? _d : '' }), lines, new Map()))
                                                : null}
          {f.status !== 'working' && f.result ? part('part-result', 'Result', '', <Markdown text={f.result}/>) : null}
        </Box>);
                                    };
                                    if (!paneId.startsWith(FLOW_PANE)) return [3 /*break*/, 31];
                                    if (!flowShown)
                                        return [2 /*return*/, <Text dimColor>This workflow is no longer available.</Text>];
                                    picked = pickedOf(flowShown);
                                    if (!picked) return [3 /*break*/, 29];
                                    return [4 /*yield*/, flowTalkOf($, flowShown, picked).catch(function () { return undefined; })];
                                case 28:
                                    _o = _18.sent();
                                    return [3 /*break*/, 30];
                                case 29:
                                    _o = undefined;
                                    _18.label = 30;
                                case 30:
                                    lines = _o;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>)];
                                case 31:
                                    alone = __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (one) { return one.id === workId; });
                                    if (paneId !== LIST && !alone)
                                        return [2 /*return*/, <Text dimColor>{paneId.startsWith("".concat(WORK_PANE, "r-")) ? 'This task is done, or its chat is closed. Open that chat to see it.' : 'This task is no longer available.'}</Text>
                                            // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
                                            // read, and a drawing that waits on it is never shown
                                            // Another chat's is read from that chat's own file, on this Mac
                                        ];
                                    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
                                    // read, and a drawing that waits on it is never shown
                                    // Another chat's is read from that chat's own file, on this Mac
                                    if (alone)
                                        void (alone.chat ? loadTheirs($, alone) : loadWork($, alone.id)).catch(function () { return undefined; });
                                    talked = alone ? talks.get(alone.id) : undefined;
                                    return [4 /*yield*/, read($, reports)];
                                case 32:
                                    kept = _18.sent();
                                    ui = uiOf($, e);
                                    isInline = e.surface === 'terminal' && e.props.placement === 'inline';
                                    shownIds = new Set(shownWork.map(function (one) { return one.id; }));
                                    cardOfAgent = function (agent) {
                                        var id = agent ? topOf(all, agent) : '';
                                        return id && shownIds.has(id) ? id : '';
                                    };
                                    keysHeld = e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk));
                                    onCards = new Map();
                                    putOnCard = function (card, row) { var _a; return void onCards.set(card, __spreadArray(__spreadArray([], ((_a = onCards.get(card)) !== null && _a !== void 0 ? _a : []), true), [row], false)); };
                                    for (_p = 0, _q = boxRows($, ui, keysHeld, e.surface, function (one) { return Boolean(cardOfAgent(one.agent)); }, true); _p < _q.length; _p++) {
                                        row_1 = _q[_p];
                                        putOnCard(cardOfAgent(row_1.one.agent), { at: row_1.at, key: "box-".concat(row_1.one.id), what: boxHead(row_1.one.text), node: row_1.node });
                                    }
                                    startedCard = function (p) {
                                        var _a, _b, _c, _d;
                                        if (p.agent || (p.tool !== 'Agent' && p.tool !== 'Task') || p.answered === 'no' || p.answered === 'stopped')
                                            return '';
                                        var words = oneLine((_b = (_a = p.input) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : '');
                                        var begun = shownWork.filter(function (one) { return !one.chat && oneLine(titleOf(one)) === words && one.startedAt >= p.at - 5000; }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                                        return (_d = (_c = begun[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '';
                                    };
                                    doneOnCards = new Map();
                                    for (_r = 0, promptsAnswered_1 = promptsAnswered; _r < promptsAnswered_1.length; _r++) {
                                        p = promptsAnswered_1[_r];
                                        card = cardOfAgent(p.agent) || startedCard(p);
                                        if (card)
                                            doneOnCards.set(card, __spreadArray(__spreadArray([], ((_10 = doneOnCards.get(card)) !== null && _10 !== void 0 ? _10 : []), true), [{ at: p.at, key: "answered-".concat(p.id), node: answeredCard(p, "this-".concat(p.id), undefined, true) }], false));
                                    }
                                    promptsLoose = promptsAnswered.filter(function (p) { return !cardOfAgent(p.agent) && !startedCard(p); });
                                    for (_s = 0, _t = waiting.filter(function (p) { return cardOfAgent(p.agent); }); _s < _t.length; _s++) {
                                        p = _t[_s];
                                        putOnCard(cardOfAgent(p.agent), { at: p.at, key: "prompt-".concat(p.id), what: p.text, node: promptCard(p, "this-".concat(p.id), answerHere(p), undefined, true) });
                                    }
                                    notices = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], boxRows($, ui, keysHeld, e.surface, function (one) { return !cardOfAgent(one.agent); }).map(function (row) { return ({ at: row.at, what: boxHead(row.one.text), node: row.node }); }), true), looseGates.map(function (gate) { return ({ at: gate.at, what: gateWhat(gate), node: gateRow($, ui, gate, "gate-".concat(gate.id), false) }); }), true), waiting.filter(function (p) { return !cardOfAgent(p.agent); }).map(function (p) { return ({ at: p.at, what: p.text, node: promptCard(p, "this-".concat(p.id), answerHere(p)) }); }), true), otherChats.flatMap(function (c) {
                                        var _a;
                                        var url = pressOf(c);
                                        return ((_a = c.prompts) !== null && _a !== void 0 ? _a : []).map(function (p) { return ({ at: p.at, what: p.text, node: promptCard(p, "".concat(c.host, "-").concat(c.chat, "-").concat(p.id), c.host && !url ? "Answer it in that chat, on ".concat(macName(c.host)) : c.host ? "Answer it in that chat, which runs on ".concat(macName(c.host)) : 'Answer it in that chat', c) }); });
                                    }), true);
                                    isAsking = function (one) { return Boolean(one.ask) && !isActingOnReply(one); };
                                    isWaitingPress = function (one) { var _a; return one.status === 'working' && Boolean((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length); };
                                    ownCount = function (one) { var _a, _b; return (one.chat ? 0 : ((_b = (_a = onCards.get(one.id)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0)); };
                                    waitsOn = function (one) { var _a; return (isAsking(one) ? 1 : 0) + resultWaits(one).length + (isWaitingPress(one) ? ((_a = one.admins) !== null && _a !== void 0 ? _a : []).filter(function (gate) { return !gatePressed.has(gate.id); }).length : 0) + ownCount(one); };
                                    isOpen = function (one) { return waitsOn(one) > 0; };
                                    answeredSince = function (one) {
                                        var _a, _b;
                                        return (_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0;
                                    };
                                    answeredPlace = function (one) { var _a, _b; return (answeredSince(one) ? ((_b = (_a = sentReplies.get(one.id)) === null || _a === void 0 ? void 0 : _a.askAt) !== null && _b !== void 0 ? _b : answeredSince(one)) : 0); };
                                    placeKey = function (one) { var _a, _b, _c, _d; return "".concat((_b = (_a = one.chat) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : '', "/").concat((_d = (_c = one.chat) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '', "/").concat(one.id); };
                                    isAnyOpen = notices.length > 0 || shownWork.some(isOpen) || listedChats.some(function (c) { return shownOf(c).some(isOpen); });
                                    isOpenHere = notices.length > otherChats.reduce(function (n, c) { var _a, _b; return n + ((_b = (_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); }, 0) || shownWork.some(isOpen);
                                    isKeptPlace = function (one) { var _a; return topPlaces.has(placeKey(one)) && (isOpenHere || at - ((_a = topClosed.get(placeKey(one))) !== null && _a !== void 0 ? _a : at) < KEPT_MOST); };
                                    isWaits = function (one) { return isOpen(one) || answeredSince(one) > 0 || (isAnyOpen && isKeptPlace(one)); };
                                    isKeptUp = function (one) { return isWaits(one) || (!one.chat && cardNotesOf(one.id, at).length > 0 && isKeptPlace(one)); };
                                    cameAt = function (one) { var _a, _b, _c, _d; return Math.min.apply(Math, __spreadArray(__spreadArray([isAsking(one) ? ((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : Infinity) : Infinity, resultWaits(one).length ? one.endedAt : Infinity], (isWaitingPress(one) ? (_c = one.admins) !== null && _c !== void 0 ? _c : [] : []).map(function (gate) { return gate.at; }), false), (one.chat ? [] : ((_d = onCards.get(one.id)) !== null && _d !== void 0 ? _d : []).map(function (row) { return row.at; })), false)); };
                                    placeOf = function (one) { var _a; return (_a = topPlaces.get(placeKey(one))) !== null && _a !== void 0 ? _a : (Number.isFinite(cameAt(one)) ? cameAt(one) : answeredPlace(one) || at); };
                                    isFinishing = function (one) { return !isWaits(one) && isFinishMoment(one); };
                                    finishFrom = function (one) { var _a; return (one.chat ? ((_a = endSeen.get("".concat(one.id, ":").concat(one.endedAt))) !== null && _a !== void 0 ? _a : one.endedAt) : pauseFrom(one)); };
                                    isLeftUp = function (one) { return !one.chat && one.status !== 'working' && Boolean(one.leftSince) && !isWaits(one) && !isFinishing(one); };
                                    isUp = function (one) { return isWaits(one) || isFinishing(one) || isLeftUp(one) || (!one.chat && (cardNotesOf(one.id, at).length > 0 || runningOn(one.id).length > 0)); };
                                    upSince = function (one) { return Math.max.apply(Math, __spreadArray(__spreadArray(__spreadArray([], (one.chat ? [] : runningOn(one.id).map(function (run) { var _a; return (_a = run.startedAt) !== null && _a !== void 0 ? _a : 0; })), false), (one.chat ? [] : cardNotesOf(one.id, at).map(function (note) { return note.at; })), false), [0], false)); };
                                    askingHere = shownWork.filter(isUp);
                                    askingThere = listedChats.flatMap(function (c) { return shownOf(c).filter(isUp); });
                                    askCards = __spreadArray(__spreadArray([], askingHere, true), askingThere, true);
                                    // The places kept: set as a card comes up among what waits, dropped as it leaves
                                    if (paneId === LIST) {
                                        waitingNow_1 = new Set(askCards.filter(isKeptUp).map(placeKey));
                                        for (_u = 0, askCards_1 = askCards; _u < askCards_1.length; _u++) {
                                            one = askCards_1[_u];
                                            key = placeKey(one);
                                            if (!topPlaces.has(key))
                                                continue;
                                            if (!isOpen(one)) {
                                                if (!topClosed.has(key))
                                                    topClosed.set(key, at);
                                            }
                                            else if (topClosed.has(key))
                                                (((_11 = topClosed.get(key)) !== null && _11 !== void 0 ? _11 : 0) <= cameAt(one) ? topPlaces.set(key, cameAt(one)) : undefined, topClosed.delete(key));
                                        }
                                        for (_v = 0, _w = askCards.filter(isWaits); _v < _w.length; _v++) {
                                            one = _w[_v];
                                            if (!topPlaces.has(placeKey(one)))
                                                topPlaces.set(placeKey(one), placeOf(one));
                                        }
                                        for (_x = 0, _y = __spreadArray([], topPlaces.keys(), true); _x < _y.length; _x++) {
                                            key = _y[_x];
                                            if (!waitingNow_1.has(key))
                                                (topPlaces.delete(key), topClosed.delete(key));
                                        }
                                    }
                                    restHere = shownWork.filter(function (one) { return !isUp(one); });
                                    restFlows = shownFlows.filter(function (f) { return !isFlowMoment(f); });
                                    begun = function (one) { var _a; return (_a = one.begunAt) !== null && _a !== void 0 ? _a : one.startedAt; };
                                    finishingFlows = shownFlows.filter(isFlowMoment);
                                    whatOf = function (one) { var _a, _b, _c, _d, _e, _f, _g, _h; return (isAsking(one) ? oneLine((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '') : resultWaits(one)[0] ? oneLine((_d = (_c = resultWaits(one)[0]) === null || _c === void 0 ? void 0 : _c.wait.text) !== null && _d !== void 0 ? _d : '') : ((_g = (_f = (_e = onCards.get(one.id)) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.what) !== null && _g !== void 0 ? _g : (((_h = one.admins) === null || _h === void 0 ? void 0 : _h[0]) ? gateWhat(one.admins[0]) : ''))); };
                                    top = __spreadArray(__spreadArray(__spreadArray([], notices.map(function (one) { return ({ rank: 0, at: one.at, what: one.what, draw: function () { return one.node; } }); }), true), askCards.map(function (one) { return (isKeptUp(one) ? { rank: 0, at: placeOf(one), what: isOpen(one) ? whatOf(one) : '', draw: function () { return small(one); } } : isFinishing(one) ? { rank: 1, at: -finishFrom(one), what: '', draw: function () { return small(one); } } : { rank: 2, at: -Math.max(upSince(one), isLeftUp(one) ? one.endedAt : 0), what: '', draw: function () { return small(one); } }); }), true), finishingFlows.map(function (f) { return ({ rank: 1, at: -pauseFrom(f), what: '', draw: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return a.rank - b.rank || a.at - b.at; });
                                    waitsCount = notices.length + askCards.reduce(function (n, one) { return n + waitsOn(one); }, 0);
                                    keptUpNow = new Set(askCards.filter(isKeptUp).map(function (one) { return one.id; }));
                                    // The terminal's keys stay with the ask they were on while it waits
                                    if (keysAsk && !askingHere.some(function (one) { return one.id === keysAsk && isAsking(one); }))
                                        keysAsk = '';
                                    runningThere = elsewhere.filter(function (one) { return one.status === 'working' && !needsPerson(one); });
                                    head = {
                                        here: working.filter(function (one) { return !needsPerson(one); }).length + runningFlows.length,
                                        there: runningThere.length,
                                        chats: new Set(runningThere.map(function (one) { var _a, _b; return "".concat((_a = one.chat) === null || _a === void 0 ? void 0 : _a.host, "/").concat((_b = one.chat) === null || _b === void 0 ? void 0 : _b.id); })).size,
                                        // Each thing at the top counts once, as the line above the prompt counts them
                                        asks: waitsCount,
                                        isDone: isHappy(own.filter(function (one) { return !one.leftOpen && !resultWaits(one).length; }), at) || elsewhere.some(function (one) { return one.status === 'done' && lingers(one, at); }) || flowList.some(isFlowMoment),
                                    };
                                    mood = headMood(head);
                                    isKeyed = e.surface === 'terminal' && !boxes.length;
                                    keyed = isKeyed;
                                    if (!alone) return [3 /*break*/, 33];
                                    _z = { version: '', installed: '', isWaiting: false };
                                    return [3 /*break*/, 35];
                                case 33: return [4 /*yield*/, versionsOf($)
                                    // Just moved to a newer version whose changes the person has not seen: one quiet line in the header, with What's new, until closed
                                ];
                                case 34:
                                    _z = _18.sent();
                                    _18.label = 35;
                                case 35:
                                    versions = _z;
                                    if (!alone) return [3 /*break*/, 36];
                                    _0 = undefined;
                                    return [3 /*break*/, 38];
                                case 36: return [4 /*yield*/, updateScreen($, ui, versions.version, head.asks, e.surface)
                                    // A password or key box stays above it: the runner waits on it
                                ];
                                case 37:
                                    _0 = _18.sent();
                                    _18.label = 38;
                                case 38:
                                    screen = _0;
                                    // A password or key box stays above it: the runner waits on it
                                    if (paneId === LIST && !alone) {
                                        was = (_12 = listOffsets.get(e.surface)) !== null && _12 !== void 0 ? _12 : 0;
                                        listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset));
                                        count = waitsCount;
                                        finishedNow = __spreadArray(__spreadArray([], askCards.filter(isFinishing).map(titleOf), true), finishingFlows.map(function (f) { return f.title; }), true);
                                        if (finishedNow.join('\n') !== finishedAtTop.join('\n'))
                                            ((finishedAtTop = finishedNow), drawAgain($));
                                        first = (_14 = (_13 = top.find(function (one) { return one.rank === 0 && one.what; })) === null || _13 === void 0 ? void 0 : _13.what) !== null && _14 !== void 0 ? _14 : '';
                                        if (count !== waitsAtTop || first !== firstAtTop || (was > 0) !== (((_15 = listOffsets.get(e.surface)) !== null && _15 !== void 0 ? _15 : 0) > 0))
                                            ((waitsAtTop = count), (firstAtTop = first), drawAgain($));
                                    }
                                    if (!(alone || !versions.version)) return [3 /*break*/, 39];
                                    _1 = undefined;
                                    return [3 /*break*/, 41];
                                case 39: return [4 /*yield*/, updatedPieces($, versions.version)
                                    // Where updating stands for this chat: a small box under the header's lines, its steps each a press
                                ];
                                case 40:
                                    _1 = _18.sent();
                                    _18.label = 41;
                                case 41:
                                    updated = _1;
                                    if (!alone) return [3 /*break*/, 42];
                                    _2 = null;
                                    return [3 /*break*/, 45];
                                case 42:
                                    _3 = noticeCard;
                                    _4 = [$, ui];
                                    return [4 /*yield*/, noticeNow($, versions.version, versions.installed).catch(function () { return undefined; })];
                                case 43: return [4 /*yield*/, _3.apply(void 0, _4.concat([_18.sent(), versions.version])).catch(function () { return null; })];
                                case 44:
                                    _2 = (_17 = (_16 = (_18.sent())) !== null && _16 !== void 0 ? _16 : screen) !== null && _17 !== void 0 ? _17 : null;
                                    _18.label = 45;
                                case 45:
                                    outCard = _2;
                                    heldRows = paneId === LIST && e.surface === 'desktop' && isInUse(at, e.props.scroll.offset) && presses !== foldPress ? e.props.scroll.offset + e.props.scroll.bodyRows : 0;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={Math.max(e.props.scroll.bodyRows, heldRows)}>
        {!alone ? (
                                            // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
                                            // them, which wraps onto a second row in a narrow pane rather than cutting anything off
                                            <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                                                    panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, "Claudopus, updated to ".concat(versions.version), $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, waiting for you', happy: 'Claudopus, a task is done', working: 'Claudopus, Claude is working', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                {/* Just moved to a newer version: "Claudopus updated" in blue, then the new version, for the moment */}
                {updated ? (nameLine(ui, updated)) : (<Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                    <Box flexShrink={0}>
                      <Text bold>Claudopus</Text>
                    </Box>
                    {/* The Mac has a newer copy than this chat runs: said beside the version, with what to type to switch to it */}
                    {versions.version ? (<Text key="head-version" dimColor wrap={versions.isWaiting ? 'wrap' : 'truncate-end'}>{"v".concat(versions.version).concat(versions.isWaiting ? " \u00B7 v".concat(versions.installed, " is ready: type /reload-plugins to use it") : '')}</Text>) : null}
                  </Box>)}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 && chat.window ? "This chat is ".concat(fill(chat.tokens, chat.window)) : chat.tokens > 0 ? 'This chat has started' : 'This chat has just begun'}</Text>}
              </Box>
            </Box>
            {outCard}
            {/* Wrapped rows keep the same gap as the buttons beside each other; a terminal's gap would be a whole blank line, so it has none */}
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" columnGap={isKeyed ? 2 : 1} rowGap={e.surface === 'terminal' ? 0 : 1}>
              {reportsButton($, ui, kept, isKeyed)}
              {statsButton($, ui, isKeyed)}
              {memoryButton($, ui, isKeyed)}
              {configButton($, ui, isKeyed)}
              {aboutButton($, ui, isKeyed)}
              {isInline && !e.props.isFocused ? <Text key="head-keys-short" dimColor>ctrl+x then Tab to use the keys</Text> : null}
            </Box>
            {/* The terminal reaches a pane from the keys only after ctrl+x Tab, which nothing else tells; once it holds them each
                                                    button above answers its first letter */}
            {e.surface === 'terminal' && (e.props.isFocused || !isInline) ? (<Text key="head-keys" dimColor wrap="wrap">
                {!e.props.isFocused ? 'ctrl+x then Tab to use the keys' : __spreadArray(__spreadArray([], own, true), elsewhere, true).some(function (one) { return one.ask; }) ? 'What you type goes in the reply box · Tab leaves it for the keys shown · Esc: back to the chat' : 'Esc: back to the chat'}
              </Text>) : null}
          </Box>) : null}
        {!alone ? top.map(function (one) { return one.draw(); }) : null}
        {!alone ? doneNotesPart(ui, at) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
                                                ? big(alone, talked === null || talked === void 0 ? void 0 : talked.lines)
                                                : __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (listedChats.length && (restHere.length || restFlows.length || promptsLoose.length) ? [chatHead('this', 'This chat', selfName() ? "on ".concat(selfName()) : '')] : []), true), promptsLoose.map(function (p) { return answeredCard(p, "this-".concat(p.id)); }), true), __spreadArray(__spreadArray([], restHere.map(function (one) { return ({ at: begun(one), card: function () { return small(one); } }); }), true), restFlows.map(function (f) { return ({ at: f.startedAt, card: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return a.at - b.at; }).map(function (one) { return one.card(); }), true), listedChats.flatMap(function (c) {
                                                    var cards = shownOf(c).filter(function (one) { return !isUp(one); }).sort(function (a, b) { return begun(a) - begun(b); });
                                                    var answered = answeredOf(c.answeredPrompts).map(function (p) { return answeredCard(p, "".concat(c.host, "-").concat(c.chat, "-").concat(p.id), c); });
                                                    return cards.length || answered.length ? __spreadArray(__spreadArray([chatHead("".concat(c.host, "-").concat(c.chat), chatName(c), chatSide(c, selfName()), c)], answered, true), cards.map(function (one) { return small(one); }), true) : [];
                                                }), true)}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1}/> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>)];
                            }
                        });
                    }); })()
                    // A click begun while this drawing was made: the drawing on screen is given instead, so the buttons under the pointer stay the
                    // ones the engine holds, and this one is made again once the click is over (holdForPress)
                ];
                case 14:
                    drawing = _k.sent();
                    _b = recent && paneId === LIST;
                    if (!_b) return [3 /*break*/, 16];
                    _c = isPressHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 15:
                    _b = _c.apply(void 0, [_k.sent()]);
                    _k.label = 16;
                case 16:
                    // A click begun while this drawing was made: the drawing on screen is given instead, so the buttons under the pointer stay the
                    // ones the engine holds, and this one is made again once the click is over (holdForPress)
                    if (_b)
                        return [2 /*return*/, ((isPressMissed = true), recent)
                            // Overtaken by a newer drawing that is already made: not kept, and the newer one is given in its place
                        ];
                    // Overtaken by a newer drawing that is already made: not kept, and the newer one is given in its place
                    if (((_j = shownKept.get(shownKey)) !== null && _j !== void 0 ? _j : 0) > askedNo && recent !== undefined)
                        return [2 /*return*/, lastShown.get(shownKey)];
                    shownKept.set(shownKey, askedNo);
                    shownSigns.set(shownKey, sign);
                    shownAts.set(shownKey, heldAt);
                    heldDrawings.set(heldKey, { shape: shape, content: content, at: heldAt, fresh: freshness, drawing: drawing });
                    lastShown.set(shownKey, drawing);
                    drawnPanes.set(paneId, { shape: shape, content: content, at: heldAt, side: sideSign() });
                    isMade = true;
                    return [2 /*return*/, drawing];
                case 17:
                    // (a drawing given again from heldDrawings, or one that threw, counts as none made)
                    freshEnds($, shownKey, isMade ? { at: heldAt, ms: Date.now() - madeFrom, fresh: freshness } : undefined);
                    return [7 /*endfinally*/];
                case 18: return [3 /*break*/, 20];
                case 19:
                    if (paneId === LIST)
                        listDrawing -= 1;
                    return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
};
