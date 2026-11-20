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
// Each pane's drawings made afresh are numbered as they are asked for: one that finishes after a newer one (the engine dropped its
// reply, as a newer ask overtook it) is never kept as the one on screen. Kept anyway, a press hold or the gap gave that stale
// drawing again, and an answered card came back and went under the pointer (16 Nov recording: 4 drawings late, 5 flips back)
var shownAsked = new Map();
var shownKept = new Map();
// What waited on the person and how often they had pressed, as each pane's drawing on screen was made (personSign), and when the
// drawing held for their use is next drawn afresh
var shownSigns = new Map();
var shownAts = new Map();
// One line of pictures for each pane on each surface: the newest picture made for it, with the size, place and scroll it was made
// for. A picture kept from before is given again only when it is that newest one. The app asks for the same pane with the view at
// the top and scrolled down in turn as a card under the pointer changes its height, and each of those once kept a picture of its
// own, of its own age: a card just answered was drawn as it is now, then as it was, then as it is now (17 Nov, recorded: three
// pictures of 317, 264 and 301 parts in turn within 200 ms; 19 Nov, the person after Release it: "it first went big, then it went
// small, then it went big again"). An ask the newest picture was not made for is drawn afresh, so a card only ever moves on. It is also what a press under way keeps on screen
// (isPressHeld), and the tabs and the bar above the prompt keep theirs the same way
// (the newest picture serves the view at the top and scrolled down alike: kept for one of them only, every ask for the other was drawn
// afresh, and none of the holds below gave it, through a press or while a drawing was under way. On 19 Nov, a scroll to the top on a
// loaded Mac started a fresh drawing at each ask for 8 s, up to nine at once, each taking 7-12 s, and Mark as done and Close
// pressed meanwhile showed nothing for as long; recorded)
var paneNewest = new Map();
var newestFor = function (line, key) { var _a, _b; return (((_a = paneNewest.get(line)) === null || _a === void 0 ? void 0 : _a.key) === key ? (_b = paneNewest.get(line)) === null || _b === void 0 ? void 0 : _b.drawing : undefined); };
// A pane's size and place, the key without its last part, whether the view is scrolled
var withoutScroll = function (key) { return key.replace(/\|[01]$/, ''); };
// The mod's tabs drawn on the desktop, whose buttons a click holds the drawing for (holdForPress)
var heldTabs = new Set();
var usedUntil = 0;
// How many times less a Details tab too big for the app may be drawn with (drawFor), and how much less each was last drawn with
var SQUEEZE_MOST = 3;
var paneSqueezed = new Map();
// A drawing the app would throw away is never given: the tab says so in plain words instead, with the way back to the list, so it
// never stays on "Nothing to show yet" (drawingFits). Said in the log once a minute at most for each tab
var tooBigLogged = new Map();
var givenIfDrawn = function ($, e, drawing) { return __awaiter(_this, void 0, void 0, function () {
    var id, now, _a, Box, Button, Text;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (drawingFits(drawing))
                    return [2 /*return*/, drawing];
                id = (_b = e.requestId) !== null && _b !== void 0 ? _b : '';
                return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                if (!(now - ((_c = tooBigLogged.get(id)) !== null && _c !== void 0 ? _c : -Infinity) >= 60000)) return [3 /*break*/, 3];
                tooBigLogged.set(id, now);
                return [4 /*yield*/, log($, "tab ".concat(id, " not given: its drawing is past what the app draws"))];
            case 2:
                (_d.sent());
                _d.label = 3;
            case 3:
                _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Text = _a.Text;
                return [2 /*return*/, (<Box flexDirection="column" gap={1} paddingX={2} paddingY={1}>
      <Text bold>Claudopus couldn't show this tab</Text>
      <Text dimColor wrap="wrap">It holds more than the app can draw at once.</Text>
      {id !== LIST ? (<Box alignItems="flex-start">
          <Button key={"too-big-back-".concat(presses)} label="Back to the list" plain onPress={function () { return ((presses += 1), void front($, LIST, LIST_TITLE).catch(function (err) { return log($, "list not shown: ".concat(String(err))); })); }}/>
        </Box>) : null}
    </Box>)];
        }
    });
}); };
// The surface the list was last drawn on: the focus says none, and only the desktop's clicks are held for (isPressHeld)
var listSurface = '';
var panelHooks = function (on) {
    // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
    // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
    // Every drawing of every tab passes here last, on its way out, and is given only if the app will draw it (givenIfDrawn)
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = givenIfDrawn;
                    _b = [$, e];
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var id, isTab, key, at, line, place, recent, askedNo, madeFrom, made, drawing, _a, Box, Button, Text, body;
                            var _b, _c, _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        id = (_b = e.requestId) !== null && _b !== void 0 ? _b : '';
                                        // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                                        return [4 /*yield*/, noteTabAsked($, id)];
                                    case 1:
                                        // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                                        _g.sent();
                                        isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, LOG_PANE, DIFF_PANE, 'report-'].some(function (start) { return id.startsWith(start); });
                                        if (!(e.surface === 'desktop' && isTab && !id.startsWith(WORK_PANE) && !id.startsWith(FLOW_PANE))) return [3 /*break*/, 6];
                                        heldTabs.add(id);
                                        key = "".concat(id, "|").concat(e.surface, "|").concat(e.props.scroll.bodyRows, "|").concat((_c = e.props.bodyColumns) !== null && _c !== void 0 ? _c : '', "|").concat(e.props.scroll.offset > 0 ? 1 : 0);
                                        return [4 /*yield*/, $.clock.now()];
                                    case 2:
                                        at = _g.sent();
                                        line = "".concat(id, "|").concat(e.surface);
                                        place = withoutScroll(key);
                                        recent = newestFor(line, place);
                                        if (recent && isPressHeld(at))
                                            return [2 /*return*/, ((isPressMissed = true), recent)
                                                // (a tab is often quick to draw on its own: slow or not, it is given again while the panel's drawings are slow, as the bar is)
                                            ];
                                        // (a tab is often quick to draw on its own: slow or not, it is given again while the panel's drawings are slow, as the bar is)
                                        if (recent && !isTyping && isFreshTooSoon($, place, at, isPanelSlow(at)))
                                            return [2 /*return*/, recent];
                                        freshBegins(place, at);
                                        askedNo = ((_d = shownAsked.get(line)) !== null && _d !== void 0 ? _d : 0) + 1;
                                        shownAsked.set(line, askedNo);
                                        madeFrom = Date.now();
                                        made = void 0;
                                        _g.label = 3;
                                    case 3:
                                        _g.trys.push([3, , 5, 6]);
                                        return [4 /*yield*/, next(e)];
                                    case 4:
                                        drawing = _g.sent();
                                        if (((_e = shownKept.get(line)) !== null && _e !== void 0 ? _e : 0) > askedNo && paneNewest.has(line))
                                            return [2 /*return*/, (_f = paneNewest.get(line)) === null || _f === void 0 ? void 0 : _f.drawing];
                                        shownKept.set(line, askedNo);
                                        paneNewest.set(line, { key: place, drawing: drawing });
                                        made = { at: at, ms: drawnFor(madeFrom), fresh: freshness };
                                        return [2 /*return*/, drawing];
                                    case 5:
                                        freshEnds($, place, made);
                                        return [7 /*endfinally*/];
                                    case 6:
                                        if (e.surface !== 'terminal' || !isTab)
                                            return [2 /*return*/, next(e)];
                                        _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Text = _a.Text;
                                        return [4 /*yield*/, next(__assign(__assign({}, e), { props: __assign(__assign({}, e.props), { scroll: __assign(__assign({}, e.props.scroll), { bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) }) }) }))];
                                    case 7:
                                        body = _g.sent();
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
                        }); })()];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 2: return [2 /*return*/, (_c.sent())];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
    // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var paneId, heldKey, heldAt, boxHeld, shownKey, paneLine, place, recent, sign, _a, until_1, askedNo, madeFrom, isMade, doneDrawn_2, shape, content, held_1, drawFor, squeeze, drawing, newestMade, _b, _c, id, madeAt, _i, doneDrawn_1, one;
        var _this = this;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    paneId = (_d = e.requestId) !== null && _d !== void 0 ? _d : '';
                    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE))
                        return [2 /*return*/, next(e)
                            // A message that waits for a hook to start a task again goes from this drawing (sendHeld)
                        ];
                    if (!heldSends.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendHeld($).catch(function (err) { return log($, "message not sent: ".concat(String(err))); })];
                case 1:
                    _o.sent();
                    _o.label = 2;
                case 2:
                    if (paneId === LIST)
                        ((listDrawing += 1), (listSurface = e.surface));
                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                    return [4 /*yield*/, holdTest($)];
                case 3:
                    _o.sent();
                    _o.label = 4;
                case 4:
                    _o.trys.push([4, , 26, 27]);
                    heldKey = "".concat(paneId, "|").concat(e.surface, "|").concat((_e = e.props.placement) !== null && _e !== void 0 ? _e : '', "|").concat(e.props.scroll.bodyRows, "|").concat((_f = e.props.bodyColumns) !== null && _f !== void 0 ? _f : '', "|").concat(e.props.isFocused ? 1 : 0, "|").concat(e.props.scroll.offset > 0 ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 5:
                    heldAt = _o.sent();
                    if (paneId === LIST)
                        drawnNow = heldAt;
                    boxHeld = paneId.startsWith(WORK_PANE) ? paneBoxHeld.get("".concat(paneId, "|").concat(e.surface)) : undefined;
                    if (boxHeld && isPaneBoxHeld(paneId, heldAt) && boxHeld.shape === paneBoxShape(boxHeld.id))
                        return [2 /*return*/, boxHeld.drawing
                            // Drawn afresh moments ago: given again as it was, at once, and drawn afresh when the gap is over (FRESH_GAP). Never while the
                            // person types, whose box keeps its own drawing below
                        ];
                    shownKey = heldKey.replace(/\|[01]\|([01])$/, '|$1');
                    paneLine = "".concat(paneId, "|").concat(e.surface);
                    place = withoutScroll(shownKey);
                    recent = newestFor(paneLine, place);
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
                    _a = _o.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = '';
                    _o.label = 8;
                case 8:
                    sign = _a;
                    // (only a drawing made during this use: one kept from before, as of a scroll down after minutes at the top, is long out of date)
                    if (recent && sign && !isTyping && isInUse(heldAt, e.props.scroll.offset) && shownSigns.get(shownKey) === sign && heldAt - ((_g = shownAts.get(shownKey)) !== null && _g !== void 0 ? _g : 0) < ENGAGED) {
                        until_1 = engagedAt + ENGAGED;
                        if (usedUntil !== until_1)
                            ((usedUntil = until_1), $.clock.after(until_1 - heldAt + 20, function () { return void (usedUntil === until_1 && drawFresh($)); }));
                        return [2 /*return*/, ((listHeldAt = heldAt), recent)];
                    }
                    if (recent && !isTyping && isFreshTooSoon($, place, heldAt, false, false))
                        return [2 /*return*/, ((paneId === LIST && (listHeldAt = heldAt)), recent)
                            // (counted from the drawing's end: a call for a drawing it made itself, as its own count of what waits at the top, is in it)
                        ];
                    // (counted from the drawing's end: a call for a drawing it made itself, as its own count of what waits at the top, is in it)
                    freshBegins(place, heldAt);
                    askedNo = ((_h = shownAsked.get(paneLine)) !== null && _h !== void 0 ? _h : 0) + 1;
                    shownAsked.set(paneLine, askedNo);
                    madeFrom = Date.now();
                    isMade = false;
                    doneDrawn_2 = [];
                    _o.label = 9;
                case 9:
                    _o.trys.push([9, , 24, 25]);
                    return [4 /*yield*/, paneShape($, paneId)];
                case 10:
                    shape = _o.sent();
                    return [4 /*yield*/, paneContent($)];
                case 11:
                    content = _o.sent();
                    held_1 = heldDrawings.get(heldKey);
                    // While the mod is behind (lookHold), the pane is given as it was, so the drawing adds nothing to what holds Claude's helper
                    if (held_1 && held_1.drawing === recent && held_1.shape === shape && (isTyping || (held_1.fresh === freshness && ((isBehind() && heldAt - held_1.at < BEHIND_HELD) || (held_1.content === content && heldAt - held_1.at < CALM)))))
                        return [2 /*return*/, ((paneId === LIST && (listHeldAt = heldAt)), held_1.drawing)];
                    if (paneId === LIST)
                        drawnFiles.clear();
                    during(paneId === LIST ? 'draw the panel' : 'draw a Details tab');
                    if (!(paneId === LIST)) return [3 /*break*/, 13];
                    return [4 /*yield*/, read($, tick)
                        // `squeeze`: how much less a Details tab too big for the app holds (drawingFits): 0 for all of it
                    ];
                case 12:
                    _o.sent();
                    _o.label = 13;
                case 13:
                    drawFor = function (squeeze) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, Box, Button, Markdown, Text, large, back, from, _i, lateFrom_1, _b, key, value, _c, isFinishedOpen, from, _d, _e, _f, _g, one, key, all, own, stage, otherChats, _h, _j, one, elsewhere, helpersThere, chat, at, working, shownWork, keysHeldNow, shownIds, needsFor, keptUpNow, ours, _k, windowOf, isAbovePrompt, isFinishMoment, isFlowMoment, stood, offModel, glance, _l, picking, lead, facts, now, noteOf, stepNow, table, room, perRow, live, askFocused, askChars, isListed, picsShown, treeRows, blockRows, askPictures, cardNeeds, needBlocks, answeredRow, cardNo, keyed, stepLine, canDismiss, questionLines, looksDelivered, small, edge, twigLines, twigRowOf, twigRow, isMore, MORE_COLOR, jobLines, twigRails, twigUnder, nowWord, jobStand, jobRow, endedMark, endedLines, canOpenEnded, openEnded, endedRow, endedBranches, isEndedFolded, endedGroupRow, withAll, jobBranches, withJobs, rowOf, endedRunsOf, treeUnder, flowMine, flowList, runningFlows, shownFlows, endedFlows, flowShown, agentsWord, flowGlance, roundsLabel, verdict, squaresRow, stateWord, flowModel, flowFacts, atWork, flowDots, roundRow, flowPassed, flowEnd, flowSmall, flowOpen, workId, open, fold, part, row, opener, askPart, todoPart, underTwig, helpersPart, talk, theirChat, openTheirs, resultPart, big, chatHead, left, endedElsewhere, shownOf, listedChats, finished, finishedPart, flowBig, picked, lines, _m, alone, talked, kept, ui, isInline, notices, isAsking, waiting2, waitsOn, isOpen, placeKey, isWaits, isKeptUp, cameAt, placeOf, isFinishing, finishFrom, isLeftUp, isUp, upSince, askingHere, askingThere, askCards, waitingNow, _o, _p, one, _q, _r, key, restHere, isHandedIn, restFlows, begun, whatOf, top, waitsCount, blocksSign, cardSign, drawTop, runningThere, head, mood, isKeyed, versions, _s, screen, _t, was, count, finishedNow, first, updated, _u, outCard, _v, _w, _x;
                        var _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
                        return __generator(this, function (_9) {
                            switch (_9.label) {
                                case 0:
                                    _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Markdown = _a.Markdown, Text = _a.Text;
                                    large = pictureIn.get(paneId);
                                    if (!large) return [3 /*break*/, 2];
                                    back = function (key) { return <Button key={"".concat(key, "-").concat(presses)} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={function () { return ((presses += 1), pictureBack($, paneId)); }}/>; };
                                    return [4 /*yield*/, pictureView($, e, large.path)];
                                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {_9.sent()}
          {back('pic-back-end')}
        </Box>)];
                                case 2:
                                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, read($, tick)];
                                case 3:
                                    _9.sent();
                                    _9.label = 4;
                                case 4:
                                    if (!(paneId === LIST)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, $.clock.now()
                                        // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
                                    ];
                                case 5:
                                    drawnNow = _9.sent();
                                    _9.label = 6;
                                case 6:
                                    if (!(paneId === LIST && __spreadArray([], lateFrom.values(), true).includes(Infinity))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, $.clock.now()
                                        // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    ];
                                case 7:
                                    from = _9.sent();
                                    // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    for (_i = 0, lateFrom_1 = lateFrom; _i < lateFrom_1.length; _i++) {
                                        _b = lateFrom_1[_i], key = _b[0], value = _b[1];
                                        if (value === Infinity)
                                            from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key);
                                    }
                                    $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); });
                                    _9.label = 8;
                                case 8: return [4 /*yield*/, read($, view)
                                    // Work that ended while the list was held (an older drawing given again) was not seen ended: its moment at the top begins with
                                    // this drawing, the first to show it, never before
                                ];
                                case 9:
                                    _c = (_9.sent()).isFinishedOpen, isFinishedOpen = _c === void 0 ? false : _c;
                                    if (!(paneId === LIST)) return [3 /*break*/, 16];
                                    return [4 /*yield*/, $.clock.now()];
                                case 10:
                                    from = _9.sent();
                                    _d = 0;
                                    _f = [[]];
                                    return [4 /*yield*/, read($, flows)];
                                case 11:
                                    _g = [__spreadArray.apply(void 0, _f.concat([(_9.sent()), true]))];
                                    return [4 /*yield*/, read($, todos)];
                                case 12:
                                    _e = __spreadArray.apply(void 0, _g.concat([(_9.sent()).filter(function (card) { return !card.parentId; }), true]));
                                    _9.label = 13;
                                case 13:
                                    if (!(_d < _e.length)) return [3 /*break*/, 15];
                                    one = _e[_d];
                                    key = "".concat(one.id, ":").concat(one.endedAt);
                                    if (one.status !== 'working' && one.endedAt > listFreshAt && one.endedAt < listHeldAt && !lateFrom.has(key) && from - one.endedAt < RELOAD_GRACE * 2)
                                        (lateFrom.set(key, from), $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); }));
                                    _9.label = 14;
                                case 14:
                                    _d++;
                                    return [3 /*break*/, 13];
                                case 15:
                                    listFreshAt = from;
                                    _9.label = 16;
                                case 16: return [4 /*yield*/, read($, todos)];
                                case 17:
                                    all = (_9.sent()).map(asPressed);
                                    own = all.filter(function (one) { return !one.parentId; });
                                    stage = function (one) { return stageOf(all, one); };
                                    return [4 /*yield*/, read($, others)
                                        // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    ];
                                case 18:
                                    otherChats = _9.sent();
                                    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    for (_h = 0, _j = cardsOf(otherChats); _h < _j.length; _h++) {
                                        one = _j[_h];
                                        if (((_y = one.ask) === null || _y === void 0 ? void 0 : _y.replied) && actingOn.get("".concat(one.id, ":").concat(one.ask.at)) === one.ask.replied.text)
                                            actingOn.delete("".concat(one.id, ":").concat(one.ask.at));
                                    }
                                    elsewhere = cardsOf(otherChats).map(function (one) { return (one.ask && answeredHere.has("".concat(one.id, ":").concat(one.ask.at)) ? __assign(__assign({}, one), { ask: undefined }) : one); });
                                    helpersThere = helpersOf(otherChats);
                                    return [4 /*yield*/, read($, me)];
                                case 19:
                                    chat = _9.sent();
                                    return [4 /*yield*/, $.clock.now()
                                        // A card marked done begins its green moment once this drawing, the first to show it, is made (beginDoneMoment)
                                    ];
                                case 20:
                                    at = _9.sent();
                                    // A card marked done begins its green moment once this drawing, the first to show it, is made (beginDoneMoment)
                                    if (paneId === LIST)
                                        doneDrawn_2.push.apply(doneDrawn_2, own.filter(function (one) { return isDoneMoment(one, at); }));
                                    working = own.filter(function (one) { return one.status === 'working'; }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                                    shownWork = own.filter(function (one) { return !isDismissed(one) || isDoneMoment(one, at); }).filter(function (one) { return stage(one) === 'working' || stage(one) === 'waiting' || staysUp(one) || isLingering(one, at) || isDoneMoment(one, at) || runningOn(one.id).length > 0; });
                                    keysHeldNow = function () { return e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk)); };
                                    shownIds = new Set(shownWork.map(function (one) { return one.id; }));
                                    needsFor = function (one) { return needsOf($, one, e.surface, at, !keysHeldNow()).filter(function (need) { return one.chat || shownIds.has(one.id) || !/^(?:box|prompt)-/.test(need.id); }); };
                                    keptUpNow = new Set();
                                    _k = modelName;
                                    return [4 /*yield*/, $.session.model().catch(function () { return ''; })];
                                case 21:
                                    ours = _k.apply(void 0, [_9.sent()]);
                                    windowOf = function (one) { var _a; return (!one.chat && (one.isFork || (ours && modelName((_a = one.model) !== null && _a !== void 0 ? _a : '') === ours)) ? chat.window : 0); };
                                    isAbovePrompt = e.surface === 'terminal' && e.props.placement === 'inline';
                                    isFinishMoment = function (one) { return hasResult(stage(one)) && lingers(one, at); };
                                    isFlowMoment = function (f) { return f.status === 'done' && isLingering(f, at) && flowPassed(f, roundsOf(f)) !== false; };
                                    stood = { working: '', done: 'Done', stopped: 'Stopped', failed: 'Failed' };
                                    offModel = function (one) { var _a; return (one.flagged ? "a safety check stopped it, so it doesn't continue on ".concat(one.flagged) : one.moved ? "It was moved to ".concat(one.moved) : rightModel((_a = one.model) !== null && _a !== void 0 ? _a : '') ? "Tasks don't run on this model" : ''); };
                                    glance = function (one, count, isWhole) {
                                        var _a;
                                        if (count === void 0) { count = ''; }
                                        if (isWhole === void 0) { isWhole = false; }
                                        return [isWhole && stage(one) !== 'working' ? "".concat(STAGE_WORD[stage(one)]).concat(stage(one) === 'failed' && one.why ? " \u00B7 ".concat(one.why) : '') : '', modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ');
                                    };
                                    return [4 /*yield*/, read($, view)
                                        // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
                                        // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
                                    ];
                                case 22:
                                    _l = (_9.sent()).picking, picking = _l === void 0 ? '' : _l;
                                    lead = e.surface === 'terminal' ? 0 : 'xs';
                                    facts = function (one, isWhole, count) {
                                        var _a;
                                        if (count === void 0) { count = ''; }
                                        var name = modelName((_a = one.model) !== null && _a !== void 0 ? _a : '');
                                        // Another chat's work is moved to another model in that chat
                                        if (one.status !== 'working' || !name || one.chat)
                                            return (<Box paddingLeft={isWhole ? 0 : lead}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one, count, isWhole)}</Text>
          </Box>);
                                        var scope = "model-".concat(one.id);
                                        if (picking === one.id)
                                            return (<Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(function (model) { return (<Button key={"pick-".concat(one.id, "-").concat(model, "-").concat(presses)} label={"".concat(modelName(model) === name ? '✓ ' : '').concat(modelName(model))} plain dimColor={modelName(model) !== name} hover={{ scope: "".concat(scope, "-").concat(model), underline: true }} onPress={function () { return ((presses += 1), void choose($, one.id, model)); }}/>); })}
          </Box>);
                                        var rest = [offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ');
                                        return (<Box flexDirection="row" alignItems="flex-start">
          <Button key={"model-".concat(one.id, "-").concat(presses)} label={name} plain dimColor hover={{ scope: scope, underline: true }} onPress={function () { return ((presses += 1), void update($, view, function (v) { return (__assign(__assign({}, v), { picking: one.id })); })); }}/>
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{" \u00B7 ".concat(rest)}</Text>
          </Box>
        </Box>);
                                    };
                                    now = function (one) { var _a, _b; return (_b = (_a = ownNote(one)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''; };
                                    noteOf = function (one) { var _a, _b; return (_b = (_a = ownNote(one)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''; };
                                    stepNow = function (one) {
                                        var call = one.status === 'working' ? lastCall.get(one.id) : undefined;
                                        return !call ? '' : !call.endedAt ? cut(call.what, room) : at - call.endedAt < 60000 ? 'Thinking' : '';
                                    };
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
                                    isListed = paneId === LIST && e.surface === 'desktop';
                                    picsShown = new Map();
                                    treeRows = new Map();
                                    blockRows = function (need) { return Math.min(blockRowsOf(need, room), Math.max(4, e.props.scroll.bodyRows)); };
                                    askPictures = function (one, key, isWhole) {
                                        var _a, _b, _c, _d, _e;
                                        var paths = (_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.pictures) !== null && _b !== void 0 ? _b : [];
                                        if (!paths.length)
                                            return null;
                                        // An ask of a chat on another Mac names that Mac's files, which are not here: a file at the same path here is another picture
                                        if ((_c = one.chat) === null || _c === void 0 ? void 0 : _c.host)
                                            return <Text key={"".concat(key, "-pics")} dimColor wrap="wrap">{"".concat(paths.length === 1 ? 'Its picture is' : "Its ".concat(paths.length, " pictures are"), " on the Mac that chat runs on. Open that chat to see ").concat(paths.length === 1 ? 'it' : 'them', ".")}</Text>;
                                        var drawing = uiOf($, e);
                                        // (nor a Details tab drawn with the least in it: a row each, as in the terminal, while the small card draws them)
                                        var canDraw = e.surface !== 'terminal' && 'Svg' in drawing && squeeze < 3;
                                        // The terminal draws no picture: a row each that opens it, with no small copy made
                                        var made = canDraw ? askPicturesOf($, one) : paths.map(function (path) { return ({ name: fileName(path), path: path, thumb: null }); });
                                        // (what of them the small card draws, for what stands above its buttons and the cards under it: markMoved)
                                        var shownPics = made ? [] : ['wait'];
                                        if (!isWhole)
                                            picsShown.set(one.id, shownPics);
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
                                                shownPics.push(isDrawn ? 'p' : 'o');
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
                                    cardNeeds = function (one, isWhole) {
                                        if (isWhole === void 0) { isWhole = false; }
                                        return needsFor(one).filter(function (need) { return isWhole || !need.isActing; });
                                    };
                                    needBlocks = function (one, isWhole) {
                                        if (isWhole === void 0) { isWhole = false; }
                                        var blocks = cardNeeds(one, isWhole).map(function (need) {
                                            var isOwnField = Boolean(need.field && need.card);
                                            var autoFocus = isOwnField && e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : false;
                                            var node = needBlock($, table, need, { isWhole: isWhole, room: room, surface: e.surface, pictures: need.card ? askPictures(one, need.id, isWhole) : null, autoFocus: autoFocus, isMoving: isListed && !isWhole });
                                            // (on the small card each block starts at the title's left edge; the grey line is a press, which the app moves in itself)
                                            return isWhole ? node : <Box key={"lead-".concat(need.id)} flexDirection="column" paddingLeft={lead}>{node}</Box>;
                                        });
                                        return blocks;
                                    };
                                    answeredRow = function (one) {
                                        var _a, _b;
                                        return (!one.ask || isActingOnReply(one)) && sentLine(one, at) ? (<Box key={"pressed-".concat(one.id)} flexDirection="row" gap={2} height={1} overflow="hidden">
          <Box flexShrink={1} minWidth={0} height={1} overflow="hidden">
            <Button key={"answered-".concat(one.id, "-").concat(presses)} plain dimColor hover={{ scope: "answered-".concat(one.id), underline: true }} onPress={function () { return openWork($, one.id); }}>
              <Text dimColor wrap="truncate-end">{sentLine(one, at)}</Text>
            </Button>
          </Box>
          {canTakeBack(one, at) ? (<Box flexShrink={0}>
              <Button key={"take-back-".concat(one.id, "-").concat((_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0)} label="Take back" plain onPress={function () { var _a, _b; return void ((presses += 1), takeBack($, one, (_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0).catch(function (err) { return log($, "answer not taken back: ".concat(String(err))); })); }}/>
            </Box>) : null}
        </Box>) : null;
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
                                    canDismiss = function (one) { var _a; return !one.chat && !one.parentId && one.status !== 'working' && !isDismissed(one) && shownWork.some(function (up) { return up.id === one.id; }) && !isActingOnReply(one) && !((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) && !needsFor(one).some(function (need) { return need.kind !== 'question'; }); };
                                    questionLines = function (one, key, left) {
                                        var _a;
                                        var asked = (_a = one.questions) !== null && _a !== void 0 ? _a : [];
                                        if (!asked.length)
                                            return null;
                                        return (<Box key={key} flexDirection="column" paddingLeft={left}>
          <Text dimColor>{asked.length === 1 ? 'It asks' : "It asks ".concat(asked.length, " things")}</Text>
          {asked.map(function (text, n) { return (<Box key={"".concat(key, "-").concat(n)} flexDirection="row" gap={1} alignItems="flex-start">
              {asked.length > 1 ? <Box flexShrink={0}><Text dimColor>{"".concat(n + 1, ".")}</Text></Box> : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}><Text wrap="wrap">{text}</Text></Box>
            </Box>); })}
        </Box>);
                                    };
                                    looksDelivered = function (one) { return stage(one) === 'delivered' || asksOnResult(one) || isDoneMoment(one, at); };
                                    small = function (one) {
                                        var _a, _b, _c, _d;
                                        // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
                                        // A card in its moment at the top is not numbered, so the others keep their numbers through it
                                        var isMomentNow = (isFinishMoment(one) && !keptUpNow.has(one.id) && !isDismissed(one)) || isDoneMoment(one, at);
                                        if (!isMomentNow)
                                            cardNo += 1;
                                        var digit = keyed && cardNo <= 9 && !isMomentNow ? String(cardNo) : undefined;
                                        var kept = one.items.filter(function (item) { return item.state !== 'dropped'; });
                                        var done = kept.filter(function (item) { return item.state === 'done'; }).length;
                                        var tree = treeUnder(one);
                                        treeRows.set(one.id, tree.length);
                                        var scope = "card-".concat(one.id);
                                        // Just finished, in its moment at the top: outlined in the green of what is done, as an allowed notice is. The outline takes
                                        // none of the card's room (the app pads a box with a border by 12 by 16 px of its own), so nothing in it moves under the pointer
                                        var isMoment = isMomentNow && !isAbovePrompt;
                                        // (read as it is drawn)
                                        var isMarkedNow = isDoneMoment(one, at);
                                        return squareOutline(Box, isMoment ? (_a = stageColor(stage(one))) !== null && _a !== void 0 ? _a : DONE : undefined, "todo-".concat(one.id), (<Box key={"todo-".concat(one.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
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
                {one.status === 'working' && !one.chat ? (<Box flexShrink={0}>
                    <Button key={"stop-".concat(one.id)} label="Stop" plain dimColor hover={{ scope: "stop-".concat(one.id), underline: true }} onPress={function () { return void stop($, one.id); }}/>
                  </Box>) : null}
                {/* Done, at the top or under Finished: a press opens the box above the chat for what to change, where that bar
                                                takes a box; the same task then carries on with what is typed */}
                {canChange(one) && !looksDelivered(one) && 'Input' in table && repliesInBar(e.surface) ? (<Box flexShrink={0}>
                    <Button key={"change-".concat(one.id, "-").concat(presses)} label={isBarOpen('change', one.id) ? 'Close' : 'Message'} plain dimColor hover={{ scope: "change-".concat(one.id), underline: true }} onPress={function (press) { return openBar($, isBarOpen('change', one.id) ? undefined : { kind: 'change', id: one.id }, press.surface); }}/>
                  </Box>) : null}
                {/* Failed, or stopped by the person: only their press starts it again */}
                {!one.chat && (stage(one) === 'failed' || (stage(one) === 'stopped' && one.byYou)) ? (<Box flexShrink={0}>
                    <Button key={"again-small-".concat(one.id, "-").concat(presses)} label="Start again" plain dimColor hover={{ scope: "again-".concat(one.id), underline: true }} onPress={function () { return ((presses += 1), void startAgain($, one.id)); }}/>
                  </Box>) : null}
                {/* Ended and still up here: a press puts it under Finished, whatever it asks, until its task works again. A
                                                delivered card has its two presses at its bottom instead, and none up here */}
                {canDismiss(one) && !looksDelivered(one) ? (<Box flexShrink={0}>
                    <Button key={"dismiss-".concat(one.id, "-").concat(presses)} label="Dismiss" plain dimColor hover={{ scope: "dismiss-".concat(one.id), underline: true }} onPress={function () { return void ((presses += 1), dismiss($, one.id).catch(function (err) { return log($, "card not dismissed: ".concat(String(err))); })); }}/>
                  </Box>) : null}
              </Box>
              {facts(one, false, kept.length > 0 ? "".concat(done, " of ").concat(kept.length, " to-dos done") : '')}
            </Box>
            {/* What it made so far, right under its title: side by side, each a press that opens it */}
            {((_b = madeNow($, one)) === null || _b === void 0 ? void 0 : _b.made.length) || ((_c = madeNow($, one)) === null || _c === void 0 ? void 0 : _c.code) ? (<Box key={"made-lead-".concat(one.id)} paddingLeft={lead}>
                {madeChips($, table, one, "made-".concat(one.id), function () { return openWork($, one.id); })}
              </Box>) : null}
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead). What the card waits on, each a block, in
                                                the order it came */}
            {cardNeeds(one).length ? (<Box key={"needs-lead-".concat(one.id)} flexDirection="column" gap={1}>
                {needBlocks(one)}
              </Box>) : null}
            {/* A command the person allowed, while it runs or its output is kept for the task's next step */}
            {runsShownOn(one, at).length && !one.chat ? (<Box key={"run-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                {runBlock($, table, one, "runs-".concat(one.id), at)}
              </Box>) : null}
            {/* A card says its stage, its to-do and what it does now, and in amber only what waits for the person */}
            {/* What the person last pressed or answered here, in one grey line */}
            {answeredRow(one)}
            {/* A card that waits says so with its block alone: no line of what the task last did under it. A delivered card's line is
                                                one row: what it asks and its presses come right under it */}
            {needsPerson(one) ? null : (<Box flexDirection="row" alignItems="flex-start" gap={1} height={looksDelivered(one) ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live("live-".concat(one.id)) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* Ended, the line begins with its stage, in its colour: green done, grey stopped, red failed with why; then what
                                                    it last said */}
                {hasResult(stage(one)) || asksOnResult(one) || stage(one) === 'stopped' || stage(one) === 'failed' ? (<Box flexDirection="row" minWidth={0}>
                    {/* (the stage's own word is never the part cut short: on a narrow panel a long note beside it left "✓ …") */}
                    <Box flexShrink={stage(one) === 'failed' ? 1 : 0} minWidth={0}>
                      <Text wrap="truncate-end" color={stageColor(stage(one))} dimColor={stage(one) === 'stopped'}>
                        {stage(one) === 'waiting' ? "\u25CF ".concat(STAGE_WORD.waiting) : stage(one) === 'delivered' ? '◐ Delivered' : stage(one) === 'done' ? '✓ Done' : stage(one) === 'failed' ? "\u2715 Failed".concat(one.why ? " \u00B7 ".concat(one.why) : '') : 'Stopped'}
                      </Text>
                    </Box>
                    {noteOf(one) ? <Box flexShrink={1} minWidth={0}><Text dimColor wrap="truncate-end">{" \u00B7 ".concat(cut(noteOf(one), room))}</Text></Box> : null}
                  </Box>) : (<Text wrap="wrap">{cut(noteOf(one), room) || stepNow(one) || (at - one.startedAt < 60000 ? 'Starting' : 'Working')}</Text>)}
              </Box>
            </Box>)}
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={"tree-".concat(one.id)} flexDirection="column" paddingLeft={lead}>{tree}</Box> : null}
            {/* Delivered: what its result leaves open, numbered, with no press of their own, and at the card's bottom its only two
                                                presses (19 Nov, the person: "buttons at the bottom to mark as done, provide feedback", "it makes the most sense
                                                to just send one message for both the questions"). The reply is typed in the box above the chat, as every
                                                message is, and puts the task back to work; Mark as done puts the card under Finished */}
            {looksDelivered(one) ? questionLines(one, "asks-".concat(one.id), lead) : null}
            {/* Marked done, its presses go at once, the choice made: an empty row of their height holds the card's shape through its
                                                green moment (19 Nov, the person: "As soon as I click a button, the buttons should immediately disappear") */}
            {isMarkedNow ? <Box key={"delivered-".concat(one.id)} height={1}/> : null}
            {!isMarkedNow && looksDelivered(one) && (canDismiss(one) || (canChange(one) && 'Input' in table && repliesInBar(e.surface))) ? (<Box key={"delivered-".concat(one.id)} flexDirection="row" flexWrap="wrap" gap={1} paddingLeft={lead}>
                {canChange(one) && 'Input' in table && repliesInBar(e.surface) ? (<Button key={"change-".concat(one.id, "-").concat(presses)} label={isBarOpen('change', one.id) ? 'Close' : ((_d = one.questions) === null || _d === void 0 ? void 0 : _d.length) ? 'Reply' : 'Give feedback'} variant={isBarOpen('change', one.id) ? undefined : 'primary'} onPress={function (press) { return openBar($, isBarOpen('change', one.id) ? undefined : { kind: 'change', id: one.id }, press.surface); }}/>) : null}
                {canDismiss(one) ? <Button key={"dismiss-".concat(one.id, "-").concat(presses)} label="Mark as done" onPress={function () { return void ((presses += 1), dismiss($, one.id).catch(function (err) { return log($, "card not marked done: ".concat(String(err))); })); }}/> : null}
              </Box>) : null}
          </Box>
        </Box>));
                                    };
                                    edge = function (one, count, done, isDoing) {
                                        // (what waits for the person on its card, a question, a permission, a key box or a prompt its command raised, is amber)
                                        var now = stage(one);
                                        if (now === 'stopped')
                                            return <Box width={1} flexShrink={0}/>;
                                        if (now !== 'working' || !count || e.surface === 'terminal')
                                            return <Box width={1} flexShrink={0} backgroundColor={isActingOnReply(one) ? LIVE : stageColor(now)}/>;
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
                                        var doing = one.status === 'working' && !one.chat ? helperNow(one, at, jobsOf(one).length, Math.max(12, width)) : '';
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
                                    isMore = function (job) { return job.id.startsWith('more-'); };
                                    MORE_COLOR = '#9A9A9A';
                                    jobLines = function (t, key, job) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, isMore(job) ? MORE_COLOR : JOB_COLOR[job.kind], !isMore(job) && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={isMore(job) ? 'More commands running' : JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={isMore(job) ? MORE_COLOR : JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
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
                                    nowWord = function (label) {
                                        var _a, _b;
                                        var first = (_a = doingOf(label).split(/\s+/)[0]) !== null && _a !== void 0 ? _a : '';
                                        return /ing$/.test(first) && first.toLowerCase() !== ((_b = label.trim().split(/\s+/)[0]) !== null && _b !== void 0 ? _b : '').toLowerCase() ? first : '';
                                    };
                                    jobStand = function (job, width) {
                                        var _a;
                                        // A count that is full while the command still runs says so in place of its percent: 100% beside a running row read as
                                        // done (19 Nov "7 of 7 heads · 100% · started, finishing", from a script that counted what it had started)
                                        var isFull = job.pct === '100%' || Boolean(job.done && job.total && job.done === job.total);
                                        var pct = isFull ? ['still running'] : job.pct ? [job.pct] : [];
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
                                        var isSilent = job.kind !== 'server' && job.kind !== 'watch' && !(quiet === undefined && !job.isEmpty && ran < SILENT_WARN) && still >= SILENT_AFTER;
                                        // its speed and time left only while it prints: ten seconds old, they are no longer how it goes
                                        var isFresh = quiet !== undefined && quiet < 10000;
                                        // (a time left only where the command's own line says one, its `eta`: none is worked out here)
                                        var left = isFresh && job.left ? [job.left] : [];
                                        var rate = job.rate && isFresh ? [job.rate] : [];
                                        var full = job.done ? [job.total ? "".concat(job.done, " of ").concat(job.total) : job.done] : [];
                                        var compact = job.done ? [job.total ? "".concat(job.done, "/").concat(job.total) : job.done] : [];
                                        // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
                                        var bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? ["".concat(job.done, "/").concat(job.total.split(' ')[0])] : compact;
                                        // Its own plain words for what it does now; a watch's are its last event
                                        // (none beside a full count: what a script said as it counted its last thing, "command finished", read against "still running")
                                        // (the script's own fresh words first, then what the small model said it does now, then its last line made plain)
                                        var isOwnNow = job.isOwn && !job.isEarlier;
                                        var nowSaid = job.now ? (/^[A-Z][a-z]/.test(job.now) ? job.now.charAt(0).toLowerCase() + job.now.slice(1) : job.now) : '';
                                        var words = isFull ? '' : (isOwnNow ? plainOf(job.words, job.label) : '') || nowSaid || (isOwnNow ? '' : plainOf(job.latest, job.label));
                                        var hasSaid = Boolean(words || full.length || pct.length);
                                        // Silent, whether its programs still use the processor: still busy, or idle (stuck, or waiting on something far away)
                                        // (a cloud job's work is on another computer: what its command here uses says nothing of it, so it is never called idle or
                                        // busy, only that the command still waits on that machine; 19 Nov four cloud jobs at work read "idle" for 48 minutes)
                                        var live = job.kind === 'remote' ? (job.live ? ' · still waiting on the cloud machine' : '') : job.live === 'busy' ? ' · still busy' : job.live === 'idle' ? ' · idle' : '';
                                        var nothing = job.kind === 'remote' ? 'Nothing back from the cloud yet' : 'No output yet';
                                        // Quiet never stands alone (17 Nov "nothing printed for 29m 30s" said nothing of what it did): the last thing it said stays,
                                        // marked as the last, or that it has shown no output or no progress at all
                                        var _b = job.kind === 'server' || job.kind === 'watch' ? ['', '']
                                            : !isSilent ? ['', '']
                                                : hasSaid ? ["nothing new for ".concat(ago(still)).concat(live), "nothing new for ".concat(shortAgo(still)).concat(live)]
                                                    : !job.wroteAt || job.isEmpty ? ["".concat(nothing, " \u00B7 started ").concat(shortAgo(ran), " ago").concat(live), "".concat(job.kind === 'remote' ? 'Nothing back yet' : nothing, " \u00B7 ").concat(shortAgo(ran))]
                                                        : ["No progress shown \u00B7 nothing new for ".concat(ago(still)).concat(live), "No progress for ".concat(shortAgo(still)).concat(live)], state = _b[0], short = _b[1];
                                        // (in amber only where nothing says it still works)
                                        var isWarn = isSilent && (job.kind === 'remote' || job.live !== 'busy');
                                        // A server or a watch leads with what it does, then the last thing it said
                                        var lead = job.kind === 'server' ? (words ? 'Serving · last: ' : 'Serving · ') : job.kind === 'watch' ? (words ? 'Watching · last: ' : 'Watching · ') : isSilent && hasSaid ? 'Last: ' : '';
                                        var near = left;
                                        var numbers = __spreadArray(__spreadArray(__spreadArray(__spreadArray([__spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), rate, true), left, true), __spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), left, true)], (near.length ? [__spreadArray(__spreadArray([], full, true), near, true)] : []), true), [__spreadArray(__spreadArray(__spreadArray([], compact, true), pct, true), left, true)], false), (left.length ? [__spreadArray(__spreadArray([], compact, true), left, true), __spreadArray(__spreadArray([], compact, true), near, true), __spreadArray(__spreadArray([], bare, true), near, true)] : []), true), [__spreadArray(__spreadArray([], compact, true), pct, true), __spreadArray(__spreadArray([], bare, true), pct, true), __spreadArray([], pct, true), []], false);
                                        var tails = [[state], [short]].map(function (t) { return t.filter(Boolean); });
                                        // How far it is comes first, then its sign of life: the fullest counts with each tail, then any
                                        var tries = __spreadArray(__spreadArray([], numbers.slice(0, 2).flatMap(function (nums) { return tails.map(function (tail) { return ({ nums: nums, tail: tail }); }); }), true), tails.flatMap(function (tail) { return numbers.map(function (nums) { return ({ nums: nums, tail: tail }); }); }), true);
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
                                            return { text: text ? line.charAt(0).toUpperCase() + line.slice(1) : (job.kind === 'script' && (job.title || job.isNamed) ? nowWord((_a = job.title) !== null && _a !== void 0 ? _a : job.label) : '') || JOB_NOW[job.kind], isWarn: isWarn };
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
                                        var time = took(ran);
                                        // Stop, at its end, where it can be stopped from here: it ends the run and tells the work it was stuck
                                        var owner = (_b = (_a = t.one) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                                        // (every row has it, down to the narrowest that still has room for a word of how far it is beside it)
                                        var isStoppable = Boolean(owner) && canStopJob(job) && !job.id.startsWith('more-') && width >= 24;
                                        var name = cut(jobHead(job), Math.max(12, width - time.length - 1));
                                        var head = (<Box key={"twig-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {jobLines(t, "twig-lines-".concat(key), job)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {/* A press shows its output whole in a Terminal window, where this Mac can open one */}
            {isMore(job) && owner ? (<Button key={"more-".concat(key, "-").concat(presses)} label={name} plain hover={{ scope: "twig-".concat(key), underline: true }} onPress={function () { return openWork($, owner); }}/>) : canOpenJob(job) ? (<Button key={"output-".concat(key, "-").concat(presses)} label={name} plain hover={{ scope: "twig-".concat(key), underline: true }} onPress={function () { var _a; return openLog($, job.id, (_a = job.title) !== null && _a !== void 0 ? _a : job.label); }}/>) : (<Text wrap="truncate-end">{name}</Text>)}
          </Box>
          <Box flexShrink={0}>
            <Text dimColor>{time}</Text>
          </Box>
        </Box>);
                                        if (job.id.startsWith('more-'))
                                            return head;
                                        // (Stop sits at the end of its second line, under its time, so its name keeps its room)
                                        var stopButton = isStoppable ? (<Box key={"stop-box-".concat(key)} flexShrink={0}>
          <Button key={"stop-".concat(key, "-").concat(presses)} label={stoppingJobs.has(job.id) ? 'Stopping' : 'Stop'} plain hover={{ scope: "stop-".concat(key), underline: true }} onPress={function () { return void stopJob($, owner, job).catch(function (err) { return log($, "run not stopped: ".concat(String(err))); }); }}/>
        </Box>) : null;
                                        var _c = jobStand(job, width - (isStoppable ? 10 : 0)), stand = _c.text, isWarn = _c.isWarn;
                                        // Its percent, in blue, where the line says it as a part of its own
                                        var pctAt = job.pct && !isWarn && !/still running/i.test(stand) ? (stand.startsWith("".concat(job.pct, " \u00B7 ")) || stand === job.pct ? 0 : stand.includes(" \u00B7 ".concat(job.pct)) ? stand.indexOf(" \u00B7 ".concat(job.pct)) + 3 : -1) : -1;
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
                                    endedMark = function (run) {
                                        var _a;
                                        return (<Text color={run.how === 'failed' ? 'error' : run.how === 'finished' ? DONE : undefined} dimColor={run.how !== 'failed' && run.how !== 'finished'}>
        {JOB_GLYPH[(_a = run.kind) !== null && _a !== void 0 ? _a : 'script']}
      </Text>);
                                    };
                                    endedLines = function (t, key, run) {
                                        var _a;
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, run.how === 'failed' ? TWIG_FAILED : '#808080', false, JOB_SHAPE[(_a = run.kind) !== null && _a !== void 0 ? _a : 'script'])} alt={endedWord(run)} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          {endedMark(run)}
        </Box>);
                                    };
                                    canOpenEnded = function (run, owner) { return !isRunFromAfar && (Boolean(run.file) || !(owner === null || owner === void 0 ? void 0 : owner.chat)); };
                                    openEnded = function (run, owner) { return (canOpenEnded(run, all.find(function (one) { return one.id === owner; })) ? openLog($, run.id, runLabel(run)) : openWork($, owner)); };
                                    endedRow = function (t) {
                                        var _a;
                                        var run = t.run;
                                        if (!run)
                                            return null;
                                        var key = "ended-".concat(run.id);
                                        // (one that finished says only how long it ran, as a running row does, so its name keeps the room: the row over them says
                                        // they ended, and its mark that it went well; one that did not says how it ended too. When is in its log's tab)
                                        var side = run.how === 'finished' ? took(run.endedAt - run.at) : endedLine(run, took(run.endedAt - run.at));
                                        var name = cut(runLabel(run), Math.max(12, perRow - 4 - t.depth * 2 - side.length - 1));
                                        var head = (<Box key={"twig-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
          {endedLines(t, "twig-lines-".concat(key), run)}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Button key={"ended-open-".concat(run.id, "-").concat(presses)} label={name} plain dimColor hover={{ scope: "twig-".concat(key), underline: true }} onPress={function () { var _a, _b; return openEnded(run, (_b = (_a = t.one) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''); }}/>
          </Box>
          <Box flexShrink={0}>
            <Text dimColor={run.how !== 'failed'} color={run.how === 'failed' ? 'error' : undefined}>{side}</Text>
          </Box>
        </Box>);
                                        // One that failed says why under its name, in plain words, where the small model said
                                        var why = run.how === 'failed' ? (_a = run.named) === null || _a === void 0 ? void 0 : _a.why : undefined;
                                        if (!why)
                                            return head;
                                        return (<Box key={"ended-box-".concat(key)} flexDirection="column" flexShrink={0}>
          {head}
          {twigUnder(t, "why-".concat(key), <Text color="error" wrap="truncate-end">{why}</Text>)}
        </Box>);
                                    };
                                    endedBranches = function (card) {
                                        var _a;
                                        var runs = __spreadArray([], ((_a = card.endedRuns) !== null && _a !== void 0 ? _a : []), true).sort(function (a, b) { return b.endedAt - a.endedAt; });
                                        return runs.length ? [{ one: card, ended: runs, kids: isEndedFolded(card.id) ? [] : runs.map(function (run) { return ({ one: card, run: run, kids: [] }); }) }] : [];
                                    };
                                    isEndedFolded = function (id) { return endedFolded.has(id) || squeeze >= 2 || (squeeze >= 1 && !endedOpened.has(id)); };
                                    endedGroupRow = function (t) {
                                        var _a, _b, _c;
                                        var id = (_b = (_a = t.one) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
                                        var text = "".concat(endedSummary(0, (_c = t.ended) !== null && _c !== void 0 ? _c : [])).concat(isEndedFolded(id) ? ' · show' : '');
                                        return twigRowOf(t, "ended-group-".concat(id), text, true, '', function () { return ((isEndedFolded(id) ? (endedFolded.delete(id), endedOpened.add(id)) : (endedOpened.delete(id), endedFolded.add(id))), (presses += 1), redraw($)); });
                                    };
                                    withAll = function (branches) { return branches.map(function (b) { return (b.job || b.run || b.ended ? b : __assign(__assign({}, b), { kids: __spreadArray(__spreadArray(__spreadArray([], jobBranches(b.one, true), true), withAll(b.kids), true), endedBranches(b.one), true) })); }); };
                                    jobBranches = function (card, isAll) {
                                        if (isAll === void 0) { isAll = false; }
                                        var jobs = jobsOf(card);
                                        if (isAll || jobs.length <= JOBS_SHOWN)
                                            return jobs.map(function (job) { return ({ one: card, job: job, kids: [] }); });
                                        var more = jobs.length - JOBS_SHOWN + 1;
                                        var shown = jobs.slice(-(JOBS_SHOWN - 1));
                                        var rest = { id: "more-".concat(card.id), label: "".concat(jobs.slice(0, more).reduce(function (n, job) { var _a; return n + ((_a = job.count) !== null && _a !== void 0 ? _a : 1); }, 0), " more commands"), cmd: '', kind: 'script', at: Math.min.apply(Math, jobs.slice(0, more).map(function (job) { return job.at; })) };
                                        return __spreadArray(__spreadArray([], shown, true), [rest], false).map(function (job) { return ({ one: card, job: job, kids: [] }); });
                                    };
                                    withJobs = function (branches, isAll) {
                                        if (isAll === void 0) { isAll = false; }
                                        return branches.map(function (b) { return (b.job ? b : __assign(__assign({}, b), { kids: __spreadArray(__spreadArray([], jobBranches(b.one, isAll), true), withJobs(b.kids, isAll), true) })); });
                                    };
                                    rowOf = function (t) { return (t.job ? jobRow(t, 'list') : twigRow(t, 'list')); };
                                    endedRunsOf = function (one, list) {
                                        if (list === void 0) { list = all; }
                                        return __spreadArray([one], underOf(list, one.id), true).flatMap(function (kid) { var _a; return (_a = kid.endedRuns) !== null && _a !== void 0 ? _a : []; }).sort(function (a, b) { return a.endedAt - b.endedAt; });
                                    };
                                    treeUnder = function (one) {
                                        var under = underOf(all, one.id);
                                        var own = jobBranches(one);
                                        var runs = endedRunsOf(one, one.chat ? helpersThere : all);
                                        if (!under.length && !own.length && !runs.length)
                                            return [];
                                        var branches = __spreadArray(__spreadArray([], own, true), withJobs(branchesOf(all, one.id, function (kid) { return kid.status === 'working' || isLingering(kid, at) || jobsOf(kid).length > 0; })), true);
                                        var twigs = twigsOf(branches, true);
                                        var rest = under.length - twigs.filter(function (t) { return !t.job; }).length;
                                        if (!rest && !runs.length)
                                            return twigsOf(branches).map(rowOf);
                                        var closing = { depth: 1, rails: [], isLast: true, hasKids: false };
                                        // A command that failed is counted on the closing row with the others that ended, never a row of its own (one stood among
                                        // what still ran long after it failed) and never by name: which one, how and why is in Details and its log (19 Nov)
                                        // (and the helpers that failed and have left the tree, counted too)
                                        var onTree = new Set(twigs.flatMap(function (t) { return (!t.job && t.one ? [t.one.id] : []); }));
                                        var lost = under.filter(function (kid) { return kid.status === 'failed' && !onTree.has(kid.id); }).map(function (kid) { return titleOf(kid); });
                                        return __spreadArray(__spreadArray([], twigs.map(rowOf), true), [twigRowOf(closing, "rest-".concat(one.id), endedSummary(rest, runs, lost.length), true, '', function () { return openWork($, one.id); })], false);
                                    };
                                    return [4 /*yield*/, sessionName($)];
                                case 23:
                                    flowMine = _9.sent();
                                    return [4 /*yield*/, read($, flows)];
                                case 24:
                                    flowList = (_9.sent()).filter(function (f) { return isFlowShown(f, flowMine); });
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
                                            return one ? doing(one.phase || flowStageOf(f) || 'Working') : round ? 'Between stages' : 'Starting';
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
                                        var phase = (one === null || one === void 0 ? void 0 : one.phase) || flowStageOf(f);
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
                                        return squareOutline(Box, isFlowMoment(f) && !isAbovePrompt ? DONE : undefined, "flow-".concat(f.id), (<Box key={"flow-".concat(f.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
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
        </Box>));
                                    };
                                    flowOpen = flowShown ? pickedOf(flowShown) : undefined;
                                    workId = paneId === LIST ? '' : flowShown ? "".concat(flowShown.id, ":").concat((_z = flowOpen === null || flowOpen === void 0 ? void 0 : flowOpen.id) !== null && _z !== void 0 ? _z : '') : ((_1 = (_0 = __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (one) { return workPaneOf(one.id) === paneId; })) === null || _0 === void 0 ? void 0 : _0.id) !== null && _1 !== void 0 ? _1 : '');
                                    open = (_2 = folds.get(workId)) !== null && _2 !== void 0 ? _2 : [];
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
                                        var _a, _b;
                                        if (t.run || t.ended)
                                            return null;
                                        if (t.job) {
                                            // (its row says it in plain words, so the last line is here as it was printed too)
                                            // (a command's row says how it stands, and its log is a press on its name away: its last lines under it said the same
                                            // thing twice, 19 Nov)
                                            var tail = [];
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
                                        var lines = [doing >= 0 ? "To-do ".concat(doing + 1, " of ").concat(kept.length, " \u00B7 ").concat((_b = (_a = kept[doing]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '') : '', now(kid)].filter(Boolean);
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
                                        var branches = __spreadArray(__spreadArray(__spreadArray([], jobBranches(one, true), true), withAll(branchesOf(list, one.id, function () { return true; })), true), endedBranches(one), true);
                                        // (what one command left going counts as that one command, however many programs it is)
                                        var jobs = __spreadArray([one], under, true).reduce(function (n, kid) { return n + jobsOf(kid).reduce(function (sum, job) { var _a; return sum + ((_a = job.count) !== null && _a !== void 0 ? _a : 1); }, 0); }, 0);
                                        var runs = endedRunsOf(one, list);
                                        if (!under.length && !jobs && !runs.length)
                                            return null;
                                        var running = under.filter(function (kid) { return kid.status === 'working'; }).length;
                                        // Beside the jobs, the helpers are named, so neither count reads as the other's
                                        var helpers = running === under.length ? "".concat(running, " ").concat(running === 1 ? 'helper' : 'helpers', " working") : running ? "".concat(running, " of ").concat(under.length, " helpers working") : "".concat(under.length, " ").concat(under.length === 1 ? 'helper' : 'helpers');
                                        // (and the commands that ended, with how many of them failed: each is a row under the one that started it)
                                        var failed = runs.filter(function (run) { return run.how === 'failed'; }).length;
                                        var side = [jobs ? "".concat(jobs, " ").concat(jobs === 1 ? 'command' : 'commands', " running") : '', failed ? "".concat(failed, " failed") : '', under.length ? helpers : ''].filter(Boolean).join(' · ');
                                        return part('part-helpers', !jobs && !runs.length ? 'Helpers' : under.length ? 'Helpers and commands' : 'Commands', side, <Box flexDirection="column">{twigsOf(branches).flatMap(function (t) { return [t.ended ? endedGroupRow(t) : t.run ? endedRow(t) : t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)]; })}</Box>);
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
                {pic.thumb && e.surface !== 'terminal' && 'Svg' in drawing && squeeze < 1 ? (<drawing.Svg key={"pic-svg-".concat(at, "-").concat(n)} source={pic.thumb.source} alt={"Picture: ".concat(pic.name)} {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}/>) : null}
                {pic.isGone ? (<Text dimColor wrap="wrap">{"Picture: ".concat(pic.name, " \u00B7 no longer available")}</Text>) : (<Button key={"pic-open-".concat(at, "-").concat(n, "-").concat(presses)} label={"\u2922 ".concat(pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open', ": ").concat(cut(pic.name, Math.max(12, room - 14)))} plain onPress={function (press) { return ((presses += 1), redraw($), void showPicture($, pic.path, paneId, "pic-".concat(at, "-").concat(n), press.surface)); }}/>)}
                {e.surface === 'terminal' && !pic.isGone ? pictureSaidRow($, drawing, "pic-said-".concat(at, "-").concat(n), pic.path) : null}
              </Box>); })}
          </Box>);
                                        };
                                        // Each line knows how many tool steps came before it: that names a run of steps whatever is drawn above it
                                        var uses = 0;
                                        var shown = newest((lines !== null && lines !== void 0 ? lines : []).map(function (line) { return (__assign(__assign({}, line), { at: line.isUse ? (uses += 1) : uses })); }), squeeze);
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
                  <Button key={"told-".concat(at, "-").concat(presses)} label="▸ The task's instructions" plain dimColor onPress={function () { return fold(-at - 1); }}/>
                </Box>);
                                                return (<Box key={"talk-".concat(i)} flexDirection="column" alignItems="flex-start" backgroundColor={FILL} paddingX={2} paddingY={1}>
                {(first === null || first === void 0 ? void 0 : first.kind) === 'steer' ? <Text dimColor>{first.sentAt ? "You \u00B7 sent ".concat(clockAt(first.sentAt), " \u00B7 ").concat(first.readAt ? "read ".concat(clockAt(first.readAt)) : 'not read yet') : 'You'}</Text> : null}
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
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                                        var showing = lines ? newest(lines, squeeze).length : 0;
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
              {(one.status === 'working' && !one.chat) || left(one) || ((one.status === 'failed' || (one.status === 'stopped' && one.byYou)) && !one.chat) ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={"stop-".concat(one.id)} label="Stop" onPress={function () { return void stop($, one.id); }}/> : null}
                  {/* Work the person stopped, or that failed, stays so until they start it again from here or ask in a message */}
                  {(one.status === 'failed' || (one.status === 'stopped' && one.byYou)) && !one.chat ? <Button key={"again-".concat(one.id, "-").concat(presses)} label="Start again" onPress={function () { return ((presses += 1), void startAgain($, one.id)); }}/> : null}
                  {left(one) ? <Button key={"artifact-".concat(one.id, "-").concat(presses)} label="Result" onPress={function () { var _a, _b; return void openReport($, (_b = (_a = left(one)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''); }}/> : null}
                </Box>) : null}
            </Box>
          </Box>
          {/* What it made, right under its title, while it works and once it is done */}
          {((_a = madeNow($, one)) === null || _a === void 0 ? void 0 : _a.made.length) || ((_b = madeNow($, one)) === null || _b === void 0 ? void 0 : _b.code) ? part('part-files', 'Files', '', (_d = madeTiles($, table, (_c = madeNow($, one)) !== null && _c !== void 0 ? _c : { made: [] }, paneId, "files-".concat(one.id), one.id, e.surface, '', squeeze >= 2)) !== null && _d !== void 0 ? _d : <Box />) : null}
          {needsFor(one).length ? (<Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                {needBlocks(one, true)}
              </Box>
            </Box>) : null}
          {runsShownOn(one, at).length && !one.chat ? (<Box key="part-runs" flexDirection="column" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              {runBlock($, table, one, "runs-big-".concat(one.id), at)}
            </Box>) : null}
          {/* The question just answered, whole, and the answer whole under it (what the small card's grey line opens) */}
          {/* (a message to the task is in its list under Message, never here as well) */}
          {!one.ask && sentLine(one, at) && ((_e = sentReplies.get(one.id)) === null || _e === void 0 ? void 0 : _e.ask) !== CHANGE_WHAT ? (<Box key="part-answered" flexDirection="column" gap={1} backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              {((_f = sentReplies.get(one.id)) === null || _f === void 0 ? void 0 : _f.ask) && ((_g = sentReplies.get(one.id)) === null || _g === void 0 ? void 0 : _g.ask) !== CHANGE_WHAT ? (<Box key="answered-question" flexDirection="column" gap={1} minWidth={0}>
                  <Text dimColor>Question</Text>
                  <Text wrap="wrap" bold>{(_j = (_h = sentReplies.get(one.id)) === null || _h === void 0 ? void 0 : _h.ask) !== null && _j !== void 0 ? _j : ''}</Text>
                  {((_k = sentReplies.get(one.id)) === null || _k === void 0 ? void 0 : _k.details) ? <Markdown text={(_m = (_l = sentReplies.get(one.id)) === null || _l === void 0 ? void 0 : _l.details) !== null && _m !== void 0 ? _m : ''}/> : null}
                </Box>) : null}
              <Box flexDirection="row" gap={2} minWidth={0}>
                <Text dimColor wrap="wrap">{sentLine(one, at, Infinity)}</Text>
                {canTakeBack(one, at) ? <Button key={"take-back-big-".concat(one.id, "-").concat((_p = (_o = heldAnswer(one, at)) === null || _o === void 0 ? void 0 : _o.at) !== null && _p !== void 0 ? _p : 0)} label="Take back" plain onPress={function () { var _a, _b; return void ((presses += 1), takeBack($, one, (_b = (_a = heldAnswer(one, at)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0).catch(function (err) { return log($, "answer not taken back: ".concat(String(err))); })); }}/> : null}
              </Box>
            </Box>) : null}
          {resultPart(one)}
          {asksOnResult(one) ? part('part-questions', 'Questions', '', (_q = questionLines(one, 'asks-whole', 0)) !== null && _q !== void 0 ? _q : <Box />) : null}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
                                                ? part('part-chat', 'Conversation', '', theirChat(one, one.chat))
                                                : part('part-chat', 'Conversation', lines && showing < lines.length ? "last ".concat(showing, " lines") : '', talks.has(one.id) ? talk(one, lines, (_s = (_r = shots.get(one.id)) === null || _r === void 0 ? void 0 : _r.shots) !== null && _s !== void 0 ? _s : new Map()) : <Text dimColor>Reading the conversation…</Text>)}
          {/* At the bottom, under its conversation, a box to write to it, for a task of this chat's that works or has finished and
                                                asks nothing (one that asks is answered in its block above): the same message as the box Message opens above the chat */}
          {canChange(one) && 'Input' in table ? <Box key="message-gap" flexGrow={1}/> : null}
          {canChange(one) && 'Input' in table ? part('part-message', 'Message', '', messageBox($, table, one, paneId, at)) : null}
          {!(canChange(one) && 'Input' in table) && one.entries.some(function (entry) { return entry.isUnread; }) && !one.chat ? part('part-sent', 'Your messages', '', (_t = sentList(table, one, at)) !== null && _t !== void 0 ? _t : <Box />) : null}
        </Box>);
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
                                    endedElsewhere = elsewhere.filter(function (one) { return stageOf(elsewhere, one) !== 'working' && stageOf(elsewhere, one) !== 'waiting' && !lingers(one, at) && !isVanished(one.id); });
                                    shownOf = function (c) { return elsewhere.filter(function (one) { var _a; return ((_a = one.chat) === null || _a === void 0 ? void 0 : _a.id) === c.chat && one.chat.host === c.host && (stageOf(elsewhere, one) === 'working' || stageOf(elsewhere, one) === 'waiting' || lingers(one, at)); }); };
                                    listedChats = otherChats.filter(function (c) { var _a; return shownOf(c).length || ((_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length); });
                                    finished = __spreadArray(__spreadArray([], own.filter(function (one) { return one.status !== 'working' && !shownWork.some(function (up) { return up.id === one.id; }); }), true), endedElsewhere, true).sort(function (a, b) { return b.endedAt - a.endedAt; });
                                    finishedPart = function (isOpen) {
                                        return finished.length || endedFlows.length ? (<Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button key={"finished-fold-".concat(presses)} label={"".concat(isOpen ? '▾' : '▸', " Finished ").concat(finished.length + endedFlows.length)} plain hotkey={keyed ? 'f' : undefined} onPress={function () { return void ((presses += 1), update($, view, function (v) { return (__assign(__assign({}, v), { isFinishedOpen: !v.isFinishedOpen })); })); }}/>
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
                                        var current = flowStageOf(f);
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
                                    if (!paneId.startsWith(FLOW_PANE)) return [3 /*break*/, 28];
                                    if (!flowShown)
                                        return [2 /*return*/, <Text dimColor>This workflow is no longer available.</Text>];
                                    picked = pickedOf(flowShown);
                                    if (!picked) return [3 /*break*/, 26];
                                    return [4 /*yield*/, flowTalkOf($, flowShown, picked).catch(function () { return undefined; })];
                                case 25:
                                    _m = _9.sent();
                                    return [3 /*break*/, 27];
                                case 26:
                                    _m = undefined;
                                    _9.label = 27;
                                case 27:
                                    lines = _m;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>)];
                                case 28:
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
                                case 29:
                                    kept = _9.sent();
                                    ui = uiOf($, e);
                                    isInline = e.surface === 'terminal' && e.props.placement === 'inline';
                                    notices = looseNeeds($, e.surface, function (card) { return Boolean(card && shownIds.has(card)); }, otherChats, !keysHeldNow()).map(function (need) { return ({ at: need.at, what: need.text, sign: "".concat(need.id, ":").concat(blockRows(need)), node: needBlock($, ui, need, { room: room, surface: e.surface }) }); });
                                    isAsking = function (one) { return Boolean(one.ask) && !isActingOnReply(one); };
                                    waiting2 = function (one) { return needsFor(one).filter(function (need) { return !need.isActing; }); };
                                    waitsOn = function (one) { return waiting2(one).length + Number(asksOnResult(one)); };
                                    isOpen = function (one) { return waitsOn(one) > 0; };
                                    placeKey = function (one) { var _a, _b, _c, _d; return "".concat((_b = (_a = one.chat) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : '', "/").concat((_d = (_c = one.chat) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '', "/").concat(one.id); };
                                    isWaits = function (one) { return isOpen(one); };
                                    isKeptUp = function (one) { return isWaits(one); };
                                    cameAt = function (one) { return Math.min.apply(Math, __spreadArray(__spreadArray([], waiting2(one).map(function (need) { return need.at; }), false), [asksOnResult(one) ? one.endedAt : Infinity], false)); };
                                    placeOf = function (one) { var _a; return (_a = topPlaces.get(placeKey(one))) !== null && _a !== void 0 ? _a : (Number.isFinite(cameAt(one)) ? cameAt(one) : at); };
                                    isFinishing = function (one) { return !isWaits(one) && isFinishMoment(one); };
                                    finishFrom = function (one) { var _a; return (one.chat ? ((_a = endSeen.get("".concat(one.id, ":").concat(one.endedAt))) !== null && _a !== void 0 ? _a : one.endedAt) : pauseFrom(one)); };
                                    isLeftUp = function (one) { var _a; return !one.chat && hasResult(stage(one)) && Boolean((_a = one.bg) === null || _a === void 0 ? void 0 : _a.length) && !isWaits(one) && !isFinishing(one); };
                                    isUp = function (one) { return isWaits(one) || isFinishing(one) || isLeftUp(one) || (!one.chat && runningOn(one.id).length > 0); };
                                    upSince = function (one) { return Math.max.apply(Math, __spreadArray(__spreadArray([], (one.chat ? [] : runningOn(one.id).map(function (run) { var _a; return (_a = run.startedAt) !== null && _a !== void 0 ? _a : 0; })), false), [0], false)); };
                                    askingHere = shownWork.filter(isUp);
                                    askingThere = listedChats.flatMap(function (c) { return shownOf(c).filter(isUp); });
                                    askCards = __spreadArray(__spreadArray([], askingHere, true), askingThere, true);
                                    // The places kept: set as a card comes up among what waits, dropped as it leaves
                                    if (paneId === LIST) {
                                        waitingNow = new Set(askCards.filter(isKeptUp).map(placeKey));
                                        for (_o = 0, _p = askCards.filter(isWaits); _o < _p.length; _o++) {
                                            one = _p[_o];
                                            if (!topPlaces.has(placeKey(one)))
                                                topPlaces.set(placeKey(one), placeOf(one));
                                        }
                                        for (_q = 0, _r = __spreadArray([], topPlaces.keys(), true); _q < _r.length; _q++) {
                                            key = _r[_q];
                                            if (!waitingNow.has(key))
                                                topPlaces.delete(key);
                                        }
                                    }
                                    restHere = shownWork.filter(function (one) { return !isUp(one); });
                                    isHandedIn = function (one) { return stage(one) === 'delivered' || isDoneMoment(one, at); };
                                    restFlows = shownFlows;
                                    begun = function (one) { var _a; return (_a = one.begunAt) !== null && _a !== void 0 ? _a : one.startedAt; };
                                    whatOf = function (one) { var _a, _b, _c, _d; return (waiting2(one)[0] ? "".concat(cut(titleOf(one), 40), ": ").concat(oneLine((_b = (_a = waiting2(one)[0]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '')) : asksOnResult(one) ? "".concat(cut(titleOf(one), 40), ": ").concat(oneLine((_d = (_c = one.questions) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '')) : ''); };
                                    top = __spreadArray(__spreadArray([], notices.map(function (one) { return ({ rank: 0, at: one.at, what: one.what, draw: function () { return one.node; }, sign: function () { return one.sign; }, card: undefined }); }), true), askCards.map(function (one) { return (__assign(__assign({}, (isKeptUp(one) ? { rank: 0, at: placeOf(one), what: whatOf(one) } : isFinishing(one) ? { rank: 1, at: -finishFrom(one), what: '' } : { rank: 2, at: -Math.max(upSince(one), isLeftUp(one) ? one.endedAt : 0), what: '' })), { draw: function () { return small(one); }, sign: function () { return cardSign(one); }, card: one })); }), true).sort(function (a, b) { return a.rank - b.rank || a.at - b.at; });
                                    waitsCount = notices.length + askCards.reduce(function (n, one) { return n + waitsOn(one); }, 0);
                                    blocksSign = function (one, isOwn) {
                                        var _a;
                                        if (isOwn === void 0) { isOwn = false; }
                                        var isKept = function (need) { return !isOwn || need !== "ask-".concat(one.id); };
                                        var rows = cardNeeds(one).filter(function (need) { return isKept(need.id); }).map(function (need) { return ({ at: need.at, rows: blockRows(need) }); });
                                        var made = madeNow($, one);
                                        return [one.id, (made === null || made === void 0 ? void 0 : made.made.length) || (made === null || made === void 0 ? void 0 : made.code) ? 'made' : '', one.items.some(function (item) { return item.state === 'doing'; }) ? 'doing' : '', rows.sort(function (a, b) { return a.at - b.at; }).map(function (block) { return block.rows; }).join(','), isOwn ? '' : ((_a = picsShown.get(one.id)) !== null && _a !== void 0 ? _a : []).join('')].join(':');
                                    };
                                    cardSign = function (one) {
                                        var _a, _b, _c;
                                        return [
                                            blocksSign(one),
                                            runsShownOn(one, at).length,
                                            (!one.ask || isActingOnReply(one)) && sentLine(one, at) ? 'answered' : '',
                                            needsPerson(one) ? 0 : looksDelivered(one) ? 1 : 2,
                                            (_a = treeRows.get(one.id)) !== null && _a !== void 0 ? _a : 0,
                                            looksDelivered(one) ? "asks ".concat((_c = (_b = one.questions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) : '',
                                            cardNeeds(one).filter(function (need) { return movedPresses.get(need.id) === need.at; }).length,
                                        ].join(':');
                                    };
                                    drawTop = function () {
                                        var now = new Map();
                                        // (with the notice of an update above them all, or none)
                                        var above = outCard ? 'notice' : '';
                                        var nodes = top.map(function (item) {
                                            var node = item.draw();
                                            if (item.card && cardNeeds(item.card).length)
                                                now.set(item.card.id, "".concat(above, "|").concat(blocksSign(item.card, true)));
                                            above += "|".concat(item.sign());
                                            return node;
                                        });
                                        if (isListed)
                                            markMoved(now, at);
                                        return nodes;
                                    };
                                    keptUpNow = new Set(askCards.filter(isKeptUp).map(function (one) { return one.id; }));
                                    // The terminal's keys stay with the ask they were on while it waits
                                    if (keysAsk && !askingHere.some(function (one) { return one.id === keysAsk && isAsking(one); }))
                                        keysAsk = '';
                                    runningThere = elsewhere.filter(function (one) { return stageOf(elsewhere, one) === 'working'; });
                                    head = {
                                        here: own.filter(function (one) { return stage(one) === 'working'; }).length + runningFlows.length,
                                        // (what was handed in and waits for the person's look, counted after what works)
                                        delivered: shownWork.filter(function (one) { return stage(one) === 'delivered'; }).length,
                                        there: runningThere.length,
                                        chats: new Set(runningThere.map(function (one) { var _a, _b; return "".concat((_a = one.chat) === null || _a === void 0 ? void 0 : _a.host, "/").concat((_b = one.chat) === null || _b === void 0 ? void 0 : _b.id); })).size,
                                        // Each thing at the top counts once, as the line above the prompt counts them
                                        asks: waitsCount,
                                        isDone: isHappy(own, at) || elsewhere.some(function (one) { return hasResult(stageOf(elsewhere, one)) && lingers(one, at); }) || flowList.some(isFlowMoment),
                                    };
                                    mood = headMood(head);
                                    isKeyed = e.surface === 'terminal' && !boxes.length;
                                    keyed = isKeyed;
                                    if (!alone) return [3 /*break*/, 30];
                                    _s = { version: '', installed: '', isWaiting: false };
                                    return [3 /*break*/, 32];
                                case 30: return [4 /*yield*/, versionsOf($)
                                    // Just moved to a newer version whose changes the person has not seen: one quiet line in the header, with What's new, until closed
                                ];
                                case 31:
                                    _s = _9.sent();
                                    _9.label = 32;
                                case 32:
                                    versions = _s;
                                    if (!alone) return [3 /*break*/, 33];
                                    _t = undefined;
                                    return [3 /*break*/, 35];
                                case 33: return [4 /*yield*/, updateScreen($, ui, versions.version, head.asks, e.surface)
                                    // A password or key box stays above it: the runner waits on it
                                ];
                                case 34:
                                    _t = _9.sent();
                                    _9.label = 35;
                                case 35:
                                    screen = _t;
                                    // A password or key box stays above it: the runner waits on it
                                    if (paneId === LIST && !alone) {
                                        was = (_3 = listOffsets.get(e.surface)) !== null && _3 !== void 0 ? _3 : 0;
                                        listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset));
                                        count = waitsCount;
                                        finishedNow = askCards.filter(isFinishing).map(titleOf);
                                        if (finishedNow.join('\n') !== finishedAtTop.join('\n'))
                                            ((finishedAtTop = finishedNow), drawAgain($));
                                        first = (_5 = (_4 = top.find(function (one) { return one.rank === 0 && one.what; })) === null || _4 === void 0 ? void 0 : _4.what) !== null && _5 !== void 0 ? _5 : '';
                                        if (count !== waitsAtTop || first !== firstAtTop || (was > 0) !== (((_6 = listOffsets.get(e.surface)) !== null && _6 !== void 0 ? _6 : 0) > 0))
                                            ((waitsAtTop = count), (firstAtTop = first), drawAgain($));
                                    }
                                    if (!(alone || !versions.version)) return [3 /*break*/, 36];
                                    _u = undefined;
                                    return [3 /*break*/, 38];
                                case 36: return [4 /*yield*/, updatedPieces($, versions.version)
                                    // Where updating stands for this chat: a small box under the header's lines, its steps each a press
                                ];
                                case 37:
                                    _u = _9.sent();
                                    _9.label = 38;
                                case 38:
                                    updated = _u;
                                    if (!alone) return [3 /*break*/, 39];
                                    _v = null;
                                    return [3 /*break*/, 42];
                                case 39:
                                    _w = noticeCard;
                                    _x = [$, ui];
                                    return [4 /*yield*/, noticeNow($, versions.version, versions.installed).catch(function () { return undefined; })];
                                case 40: return [4 /*yield*/, _w.apply(void 0, _x.concat([_9.sent(), versions.version])).catch(function () { return null; })];
                                case 41:
                                    _v = (_8 = (_7 = (_9.sent())) !== null && _7 !== void 0 ? _7 : screen) !== null && _8 !== void 0 ? _8 : null;
                                    _9.label = 42;
                                case 42:
                                    outCard = _v;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
                                            // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
                                            // them, which wraps onto a second row in a narrow pane rather than cutting anything off
                                            <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                                                    panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated && !own.some(function (one) { return isDoneMoment(one, at); }) ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, "Claudopus, updated to ".concat(versions.version), $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, waiting for you', happy: 'Claudopus, a task is done', working: 'Claudopus, Claude is working', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
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
                {/* (what waits is amber, what was delivered is its own blue, on the one line) */}
                <Box flexDirection="row" minWidth={0}>
                  {headLine(head).length > deliveredSaid(head).length ? (<Box flexShrink={1} minWidth={0}>
                      <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head).slice(0, headLine(head).length - deliveredSaid(head).length)}</Text>
                    </Box>) : null}
                  {head.delivered ? <Box flexShrink={0}><Text color={DELIVERED} dimColor={false}>{deliveredSaid(head)}</Text></Box> : null}
                </Box>
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
        {!alone ? drawTop() : null}
        {/* What was pressed on a block that belonged to no task, in one grey line where it was */}
        {!alone ? loosePressedShown(at).map(function (one, n) { return (<Box key={"pressed-loose-".concat(n)} paddingX={2} flexShrink={0}>
            <Text dimColor wrap="wrap">{one.text}</Text>
          </Box>); }) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
                                                ? big(alone, talked === null || talked === void 0 ? void 0 : talked.lines)
                                                : __spreadArray(__spreadArray(__spreadArray([], (listedChats.length && (restHere.length || restFlows.length) ? [chatHead('this', 'This chat', selfName() ? "on ".concat(selfName()) : '')] : []), true), __spreadArray(__spreadArray([], restHere.map(function (one) { return (isHandedIn(one) ? { rank: 0, at: -one.endedAt, card: function () { return small(one); } } : { rank: 1, at: begun(one), card: function () { return small(one); } }); }), true), restFlows.map(function (f) { return ({ rank: 1, at: f.startedAt, card: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return a.rank - b.rank || a.at - b.at; }).map(function (one) { return one.card(); }), true), listedChats.flatMap(function (c) {
                                                    // (what was delivered first there too, the newest on top)
                                                    var handedIn = function (one) { return stageOf(shownOf(c), one) === 'delivered'; };
                                                    var cards = shownOf(c).filter(function (one) { return !isUp(one); }).sort(function (a, b) { return Number(handedIn(b)) - Number(handedIn(a)) || (handedIn(a) ? b.endedAt - a.endedAt : begun(a) - begun(b)); });
                                                    return cards.length ? __spreadArray([chatHead("".concat(c.host, "-").concat(c.chat), chatName(c), chatSide(c, selfName()), c)], cards.map(function (one) { return small(one); }), true) : [];
                                                }), true)}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1}/> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>)];
                            }
                        });
                    }); };
                    squeeze = Math.max(0, ((_j = paneSqueezed.get(paneId)) !== null && _j !== void 0 ? _j : 0) - 1);
                    return [4 /*yield*/, drawFor(squeeze)];
                case 14:
                    drawing = _o.sent();
                    _o.label = 15;
                case 15:
                    if (!(paneId.startsWith(WORK_PANE) && !drawingFits(drawing) && squeeze < SQUEEZE_MOST)) return [3 /*break*/, 17];
                    (doneDrawn_2.length = 0);
                    return [4 /*yield*/, drawFor((squeeze += 1))];
                case 16:
                    ((drawing = _o.sent()));
                    return [3 /*break*/, 15];
                case 17:
                    if (((_k = paneSqueezed.get(paneId)) !== null && _k !== void 0 ? _k : 0) !== squeeze)
                        (paneSqueezed.set(paneId, squeeze), void log($, "tab ".concat(paneId, " drawn with less in it (").concat(squeeze, " of ").concat(SQUEEZE_MOST, ") to fit what the app draws")));
                    newestMade = paneNewest.get(paneLine);
                    _b = (newestMade === null || newestMade === void 0 ? void 0 : newestMade.key) === place && paneId === LIST;
                    if (!_b) return [3 /*break*/, 19];
                    _c = isPressHeld;
                    return [4 /*yield*/, $.clock.now()];
                case 18:
                    _b = _c.apply(void 0, [_o.sent()]);
                    _o.label = 19;
                case 19:
                    if (_b)
                        return [2 /*return*/, ((isPressMissed = true), newestMade.drawing)
                            // Overtaken by a newer drawing that is already made: not kept, and the newer one is given in its place
                        ];
                    // Overtaken by a newer drawing that is already made: not kept, and the newer one is given in its place
                    if (((_l = shownKept.get(paneLine)) !== null && _l !== void 0 ? _l : 0) > askedNo && newestMade)
                        return [2 /*return*/, newestMade.drawing];
                    shownKept.set(paneLine, askedNo);
                    shownSigns.set(shownKey, sign);
                    shownAts.set(shownKey, heldAt);
                    heldDrawings.set(heldKey, { shape: shape, content: content, at: heldAt, fresh: freshness, drawing: drawing });
                    if (!paneId.startsWith(WORK_PANE)) return [3 /*break*/, 21];
                    return [4 /*yield*/, read($, todos)];
                case 20:
                    id = (_m = (_o.sent()).find(function (one) { return workPaneOf(one.id) === paneId && canChange(asPressed(one)); })) === null || _m === void 0 ? void 0 : _m.id;
                    if (id)
                        paneBoxHeld.set("".concat(paneId, "|").concat(e.surface), { id: id, shape: paneBoxShape(id), drawing: drawing });
                    else
                        paneBoxHeld.delete("".concat(paneId, "|").concat(e.surface));
                    _o.label = 21;
                case 21:
                    paneNewest.set(paneLine, { key: place, drawing: drawing });
                    drawnPanes.set(paneId, { shape: shape, content: content, at: heldAt, side: sideSign() });
                    isMade = true;
                    if (!doneDrawn_2.length) return [3 /*break*/, 23];
                    return [4 /*yield*/, $.clock.now()];
                case 22:
                    madeAt = _o.sent();
                    for (_i = 0, doneDrawn_1 = doneDrawn_2; _i < doneDrawn_1.length; _i++) {
                        one = doneDrawn_1[_i];
                        beginDoneMoment($, one, madeAt);
                    }
                    _o.label = 23;
                case 23: return [2 /*return*/, drawing];
                case 24:
                    // (a drawing given again from heldDrawings, or one that threw, counts as none made)
                    freshEnds($, place, isMade ? { at: heldAt, ms: drawnFor(madeFrom), fresh: freshness } : undefined);
                    return [7 /*endfinally*/];
                case 25: return [3 /*break*/, 27];
                case 26:
                    if (paneId === LIST)
                        listDrawing -= 1;
                    return [7 /*endfinally*/];
                case 27: return [2 /*return*/];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
};
