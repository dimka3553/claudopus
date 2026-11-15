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
// How many things wait on the person at the top of the list, as last drawn
var waitsAtTop = 0;
var panelHooks = function (on) {
    // In the terminal a tab holds the keys once it is opened, and nothing of the engine's goes back to the panel from them: every
    // tab of the mod's but the panel has a first row whose Close, pressed or keyed x, closes it and hands the keys back to the panel
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var id, isTab, _a, Box, Button, Text, body;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = (_b = e.requestId) !== null && _b !== void 0 ? _b : '';
                    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                    return [4 /*yield*/, noteTabAsked($, id)];
                case 1:
                    // Every ask for a tab's drawing passes here first, and is noted (watchTabs)
                    _c.sent();
                    isTab = [REPORTS_PANE, STATS_PANE, CONFIG_PANE, ABOUT_PANE, CHANGELOG_PANE, PICTURE_PANE, PANE].includes(id) || [WORK_PANE, FLOW_PANE, MEMORY_PANE, 'report-'].some(function (start) { return id.startsWith(start); });
                    if (e.surface !== 'terminal' || !isTab)
                        return [2 /*return*/, next(e)];
                    _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Text = _a.Text;
                    return [4 /*yield*/, next(__assign(__assign({}, e), { props: __assign(__assign({}, e.props), { scroll: __assign(__assign({}, e.props.scroll), { bodyRows: Math.max(1, e.props.scroll.bodyRows - 2) }) }) }))];
                case 2:
                    body = _c.sent();
                    return [2 /*return*/, (<Box flexDirection="column" gap={1}>
        <Box key="tab-back-row" flexDirection="row" gap={2} height={1} flexShrink={0} paddingX={2}>
          <Button key="tab-back" label="Close" plain hotkey="x" onPress={function () { return void backToPanel($, id).catch(function (err) { return log($, "not back to the panel: ".concat(String(err))); }); }}/>
          {id.startsWith('report-') ? <Button key="tab-results" label="Results" plain hotkey="r" onPress={function () { return void openReports($).catch(function (err) { return log($, "reports not opened: ".concat(String(err))); }); }}/> : null}
          <Text dimColor wrap="truncate-end">{e.props.isFocused ? 'Esc: back to the chat' : 'ctrl+x Tab for keys'}</Text>
        </Box>
        {body}
      </Box>)];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
    // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
    // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var paneId, heldKey, heldAt, shape, content, held, drawing;
        var _this = this;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    paneId = (_a = e.requestId) !== null && _a !== void 0 ? _a : '';
                    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE))
                        return [2 /*return*/, next(e)
                            // While the person types into a box the pane is drawn as it last was, whole, but for a change in its shape; not typing, as it last
                            // was while only its running times moved, for CALM at most (heldDrawings)
                        ];
                    heldKey = "".concat(paneId, "|").concat(e.surface, "|").concat((_b = e.props.placement) !== null && _b !== void 0 ? _b : '', "|").concat(e.props.scroll.bodyRows, "|").concat((_c = e.props.bodyColumns) !== null && _c !== void 0 ? _c : '', "|").concat(e.props.isFocused ? 1 : 0, "|").concat(e.props.scroll.offset > 0 ? 1 : 0);
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    heldAt = _d.sent();
                    if (paneId === LIST)
                        drawnNow = heldAt;
                    return [4 /*yield*/, paneShape($, paneId)];
                case 2:
                    shape = _d.sent();
                    return [4 /*yield*/, paneContent($)];
                case 3:
                    content = _d.sent();
                    held = heldDrawings.get(heldKey);
                    if (held && held.shape === shape && (isTyping || (held.fresh === freshness && held.content === content && heldAt - held.at < CALM)))
                        return [2 /*return*/, held.drawing
                            // Read only for a drawing made afresh, so the running times alone ask for one again only once CALM is over (chatHooks)
                        ];
                    if (!(paneId === LIST)) return [3 /*break*/, 5];
                    return [4 /*yield*/, read($, tick)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, Box, Button, Markdown, Text, large, back, from, _i, lateFrom_1, _b, key, value, _c, isFinishedOpen, all, own, otherChats, _d, _e, one, elsewhere, helpersThere, chat, at, answeredOf, promptsAnswered, working, shownWork, ours, _f, windowOf, stood, offModel, glance, _g, picking, lead, facts, now, table, room, perRow, live, askFocused, askChars, askPictures, askBlock, cardNo, keyed, stepLine, small, edge, twigLines, twigRowOf, twigRow, jobLines, jobRails, jobStand, jobRow, jobBranches, withJobs, rowOf, treeUnder, flowMine, flowList, runningFlows, shownFlows, endedFlows, flowShown, flowTokens, agentsWord, flowGlance, roundsLabel, verdict, squaresRow, stateWord, flowModel, flowFacts, atWork, flowDots, roundRow, flowPassed, flowEnd, flowSmall, flowOpen, workId, open, fold, part, row, opener, askPart, todoPart, underTwig, helpersPart, talk, theirChat, openTheirs, resultPart, big, promptButtons, isHeldHere, promptCard, answerHere, saidOf, answeredCard, chatHead, left, endedElsewhere, shownOf, listedChats, finished, finishedPart, flowBig, picked, lines, _h, alone, talked, kept, ui, isInline, notices, isAsking, isWaitingPress, answeredSince, isUp, upSince, askingHere, askingThere, askCards, restHere, top, waitsCount, runningThere, head, mood, isKeyed, versions, _j, screen, _k, was, count, updated, _l, outCard, _m, _o, _p;
                        var _q, _r, _s, _t, _u, _v, _w;
                        return __generator(this, function (_x) {
                            switch (_x.label) {
                                case 0:
                                    _a = uiOf($, e), Box = _a.Box, Button = _a.Button, Markdown = _a.Markdown, Text = _a.Text;
                                    large = pictureIn.get(paneId);
                                    if (!large) return [3 /*break*/, 2];
                                    back = function (key) { return <Button key={"".concat(key, "-").concat(presses)} label={paneId === LIST ? '← Back to the list' : '← Back to Details'} plain onPress={function () { return ((presses += 1), pictureBack($, paneId)); }}/>; };
                                    return [4 /*yield*/, pictureView($, e, large.path)];
                                case 1: return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {back('pic-back-top')}
          {_x.sent()}
          {back('pic-back-end')}
        </Box>)];
                                case 2:
                                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, read($, tick)];
                                case 3:
                                    _x.sent();
                                    _x.label = 4;
                                case 4:
                                    if (!(paneId === LIST)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, $.clock.now()
                                        // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
                                    ];
                                case 5:
                                    drawnNow = _x.sent();
                                    _x.label = 6;
                                case 6:
                                    if (!(paneId === LIST && __spreadArray([], lateFrom.values(), true).includes(Infinity))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, $.clock.now()
                                        // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    ];
                                case 7:
                                    from = _x.sent();
                                    // Only while the reload is recent: a panel first opened long after shows no finish of then
                                    for (_i = 0, lateFrom_1 = lateFrom; _i < lateFrom_1.length; _i++) {
                                        _b = lateFrom_1[_i], key = _b[0], value = _b[1];
                                        if (value === Infinity)
                                            from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key);
                                    }
                                    $.clock.after(LINGER + 20, function () { return void (drawAgain($), update($, tick, function (n) { return n + 1; })); });
                                    _x.label = 8;
                                case 8: return [4 /*yield*/, read($, view)
                                    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
                                ];
                                case 9:
                                    _c = (_x.sent()).isFinishedOpen, isFinishedOpen = _c === void 0 ? false : _c;
                                    return [4 /*yield*/, read($, todos)];
                                case 10:
                                    all = _x.sent();
                                    own = all.filter(function (one) { return !one.parentId; });
                                    return [4 /*yield*/, read($, others)
                                        // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    ];
                                case 11:
                                    otherChats = _x.sent();
                                    // A reply in words left here holds its ask as acted on until that chat's own file carries it; from then its file says
                                    for (_d = 0, _e = cardsOf(otherChats); _d < _e.length; _d++) {
                                        one = _e[_d];
                                        if (((_q = one.ask) === null || _q === void 0 ? void 0 : _q.replied) && actingOn.get("".concat(one.id, ":").concat(one.ask.at)) === one.ask.replied.text)
                                            actingOn.delete("".concat(one.id, ":").concat(one.ask.at));
                                    }
                                    elsewhere = cardsOf(otherChats).map(function (one) { return (one.ask && answeredHere.has("".concat(one.id, ":").concat(one.ask.at)) ? __assign(__assign({}, one), { ask: undefined }) : one); });
                                    helpersThere = helpersOf(otherChats);
                                    return [4 /*yield*/, read($, me)];
                                case 12:
                                    chat = _x.sent();
                                    return [4 /*yield*/, $.clock.now()
                                        // Prompts answered here and in other chats, for a minute after their call ended
                                    ];
                                case 13:
                                    at = _x.sent();
                                    answeredOf = function (list) { return (list !== null && list !== void 0 ? list : []).filter(function (p) { return !p.endedAt || at - p.endedAt < PROMPT_SHOWN; }); };
                                    promptsAnswered = answeredShown(at);
                                    working = own.filter(function (one) { return one.status === 'working'; }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                                    shownWork = own.filter(function (one) { var _a; return one.status === 'working' || isLingering(one, at) || one.ask || ((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) || one.leftSince || (one.cutAt && !one.backAt && at - one.cutAt < CUT_OLD); });
                                    _f = modelName;
                                    return [4 /*yield*/, $.session.model().catch(function () { return ''; })];
                                case 14:
                                    ours = _f.apply(void 0, [_x.sent()]);
                                    windowOf = function (one) { var _a; return (!one.chat && (one.isFork || (ours && modelName((_a = one.model) !== null && _a !== void 0 ? _a : '') === ours)) ? chat.window : 0); };
                                    stood = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' };
                                    offModel = function (one) { var _a; return (one.flagged ? "ended after a safety flag, not carried on on ".concat(one.flagged) : one.moved ? "moved to ".concat(one.moved, " by the app") : rightModel((_a = one.model) !== null && _a !== void 0 ? _a : '') ? 'not a model work should run on' : ''); };
                                    glance = function (one, count) {
                                        var _a;
                                        if (count === void 0) { count = ''; }
                                        return [one.ask && one.status === 'done' && !isActingOnReply(one) ? 'Waits for your answer' : stood[isActingOnReply(one) ? 'working' : one.status], modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · ');
                                    };
                                    return [4 /*yield*/, read($, view)
                                        // A desktop draws a plain Button's label inside its smallest padding step, so a line a small card starts with text is moved in
                                        // by that same step: the title, the line of facts and the lines under them share one left edge. A terminal draws the label alone
                                    ];
                                case 15:
                                    _g = (_x.sent()).picking, picking = _g === void 0 ? '' : _g;
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
                                        var rest = [offModel(one), one.tokens ? share(one.tokens, windowOf(one)) : '', count, took(at - one.startedAt)].filter(Boolean).join(' · ');
                                        return (<Box flexDirection="row" alignItems="flex-start">
          <Button key={"model-".concat(one.id, "-").concat(presses)} label={name} plain dimColor hover={{ scope: scope, underline: true }} onPress={function () { return ((presses += 1), void update($, view, function (v) { return (__assign(__assign({}, v), { picking: one.id })); })); }}/>
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{" \u00B7 ".concat(rest)}</Text>
          </Box>
        </Box>);
                                    };
                                    now = function (one) { var _a, _b; return (_b = (_a = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''; };
                                    table = uiOf($, e);
                                    room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)));
                                    perRow = Math.max(24, Math.floor(room / 2));
                                    live = function (key) {
                                        var _a;
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Being done now" width={22} height={LINE} isInteractive/>
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
                                            return <Text key={"".concat(key, "-pics")} dimColor wrap="wrap">{"Its ".concat(paths.length === 1 ? 'picture is' : "".concat(paths.length, " pictures are"), " on the Mac that chat runs on, and shown in that chat.")}</Text>;
                                        var drawing = uiOf($, e);
                                        var canDraw = e.surface !== 'terminal' && 'Svg' in drawing;
                                        // The terminal draws no picture: a row each that opens it, with no small copy made
                                        var made = canDraw ? askPicturesOf($, one) : paths.map(function (path) { return ({ name: fileName(path), path: path, thumb: null }); });
                                        if (!made)
                                            return <Text key={"".concat(key, "-pics")} dimColor>Making its pictures small…</Text>;
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
          {/* A command to type: Terminal opens with it typed, not run, only on this press */}
          {canOpenTerminal(one) ? (<Box flexDirection="row">
              <Button key={"".concat(key, "-terminal-").concat(presses)} label={openedKey === "".concat(one.id, ":").concat(ask.at, ":").concat(ask.copy) ? '✓ Opened in Terminal, typed, not run' : 'Open in Terminal'} onPress={function () { return void openTerminal($, one).catch(function (err) { return log($, "terminal not opened: ".concat(String(err))); }); }}/>
            </Box>) : null}
          {/* Another chat's ask is answered only in its own chat: no file carries an answer there */}
          {one.chat ? (<Text key={"".concat(key, "-elsewhere")} dimColor wrap="wrap">{"Answer it in its own chat, \u201C".concat(one.chat.title || 'another chat', "\u201D").concat(one.chat.host ? ", on ".concat(one.chat.host) : '', ".")}</Text>) : null}
          {one.chat ? null : (<Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map(function (choice, n) { return (<Button key={"".concat(key, "-choice-").concat(n, "-").concat(askMark(ask), "-").concat(loadMark)} label={choice} onPress={function () { return void ((presses += 1), answerAsk($, one, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })); }}/>); })}
          </Box>)}
          {'Input' in table && !one.chat ? (<Box width="100%" flexDirection="column">
              <table.Input key={"".concat(key, "-reply-").concat((_b = replies.get(one.id)) !== null && _b !== void 0 ? _b : 0, "-").concat(askMark(ask))} autoFocus={e.surface === 'terminal' && !askFocused && !boxTyped.size && (paneId !== LIST || !keysAsk || keysAsk === one.id) ? ((askFocused = true), (keysAsk = paneId === LIST ? one.id : keysAsk), true) : undefined} placeholder="Or reply in your own words" value={draftShown(one.id, ask)} submitLabel="send" onInput={function (value) { return void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($)); }} onSubmit={function (value) { var _a; return void (dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), value.trim() ? answerAsk($, one, value, true).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); }) : undefined); }}/>
            </Box>) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={"".concat(key, "-sent")} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>);
                                    };
                                    cardNo = 0;
                                    keyed = false;
                                    stepLine = function (one, kept, done) {
                                        if (one.status !== 'working' || one.chat)
                                            return null;
                                        var doing = kept.find(function (item) { return item.state === 'doing'; });
                                        var named = doing !== null && doing !== void 0 ? doing : kept.find(function (item) { return item.state === 'open'; });
                                        if (!kept.length)
                                            return null;
                                        // Every step ticked while it still runs: said in the same row, so the card keeps its height until it ends
                                        if (!named)
                                            return (<Box key={"step-".concat(one.id)} height={1} overflow="hidden" paddingLeft={lead}>
            <Text dimColor wrap="truncate-end">{"All ".concat(kept.length, " steps done")}</Text>
          </Box>);
                                        return (<Box key={"step-".concat(one.id)} flexDirection="row" gap={1} height={1} overflow="hidden" paddingLeft={lead}>
          <Box flexShrink={0}>
            <Text dimColor>{"".concat(doing ? 'Step' : 'Next, step', " ").concat(done + 1, " of ").concat(kept.length, " \u00B7")}</Text>
          </Box>
          <Box flexShrink={1} minWidth={0}>
            <Text wrap="truncate-end" dimColor={!doing}>{named.text}</Text>
          </Box>
        </Box>);
                                    };
                                    small = function (one) {
                                        var _a, _b, _c;
                                        // In the terminal, while the letters are keys, the first nine cards are numbered and the number opens the card's Details
                                        cardNo += 1;
                                        var digit = keyed && cardNo <= 9 ? String(cardNo) : undefined;
                                        var kept = one.items.filter(function (item) { return item.state !== 'dropped'; });
                                        var done = kept.filter(function (item) { return item.state === 'done'; }).length;
                                        var tree = treeUnder(one);
                                        var scope = "card-".concat(one.id);
                                        return (<Box key={"todo-".concat(one.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
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
              </Box>
              {facts(one, false, kept.length > 0 ? "".concat(done, " of ").concat(kept.length, " done") : '')}
            </Box>
            {/* The to-do it is on, numbered by how many are done, as the edge's lighter part is, so the edge, the count and the row agree */}
            {stepLine(one, kept, done)}
            {/* Every part under the title starts at the title's own left edge (lead) */}
            {one.ask ? (<Box key={"ask-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                {askBlock(one, "ask-".concat(one.id))}
              </Box>) : null}
            {((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) || cardNotesOf(one.id, at).length ? (<Box key={"gate-lead-".concat(one.id)} flexDirection="column" paddingLeft={lead}>
                {adminBlock($, table, one, "gates-".concat(one.id), at)}
              </Box>) : null}
            {/* Nothing new has come back under it for a while: said in the colour of what needs the person */}
            {one.stuckAt && one.status === 'working' && !one.chat ? (<Box key={"stuck-".concat(one.id)} paddingLeft={lead}>
                <Text color={NEEDS} bold wrap="wrap">{stuckLine(all, one, at)}</Text>
              </Box>) : null}
            {/* Cut off as the chat's process ended: when, and since when it goes on again; amber when it could not be started again */}
            {cutLine(one) && !one.chat ? (<Box key={"cut-".concat(one.id)} paddingLeft={lead}>
                <Text color={one.backAt ? undefined : NEEDS} dimColor={Boolean(one.backAt)} wrap="wrap">{cutLine(one)}</Text>
              </Box>) : null}
            {/* Still at work, waiting for a command of its own it started in the background: that it waits, the command itself
                                                being a row on its tree */}
            {waitLine(one, at) ? (<Box key={"wait-".concat(one.id)} paddingLeft={lead}>
                <Text dimColor wrap="wrap">{waitLine(one, at, jobsOf(one, at).length > 0)}</Text>
              </Box>) : null}
            {/* Its helpers gone quiet, in amber: those at work are rows on its tree */}
            {lookedInLine(one, at) && !one.chat ? (<Box key={"looked-".concat(one.id)} paddingLeft={lead}>
                <Text dimColor={!((_b = one.lookedIn) === null || _b === void 0 ? void 0 : _b.quiet)} color={((_c = one.lookedIn) === null || _c === void 0 ? void 0 : _c.quiet) ? NEEDS : undefined} wrap="wrap">{lookedInLine(one, at)}</Text>
              </Box>) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden" paddingLeft={lead}>
              {one.status === 'working' ? live("live-".concat(one.id)) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {(!one.ask && lingers(one, at)) || leftLine(one, at) ? (<Text wrap="truncate-end" color={one.status === 'done' ? DONE : undefined} dimColor={one.status !== 'done'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? 'Stopped by an error' : 'Stopped'}
                  </Text>) : (<Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || needsPerson(one)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>)}
              </Box>
            </Box>
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
                                        if (one.status !== 'working' && one.status !== 'done')
                                            return <Box width={1} flexShrink={0}/>;
                                        if (needsPerson(one) || one.status === 'done' || !count || e.surface === 'terminal')
                                            return <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : one.status === 'working' || isActingOnReply(one) ? LIVE : DONE}/>;
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
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')} alt={status ? { working: 'At work', done: 'Finished', failed: 'Stopped by an error', stopped: 'Stopped' }[status] : 'Ended'} width={twigWidth(t)} height={LINE} isInteractive/>
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
                                        var _a, _b, _c;
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
                                        var busy = ((_b = one.running) === null || _b === void 0 ? void 0 : _b.cmd) ? '' : [runningLine(one, at), runningLine(one, at).replace(/^.* running · /, 'running · ')].find(function (text) { return text && width - text.length >= 12; });
                                        var side = busy ? busy : (_c = [[model, one.tokens ? thousands(one.tokens) : '', time], [model, time], [time]].map(function (parts) { return parts.filter(Boolean).join(' · '); }).find(function (text) { return width - text.length >= 12; })) !== null && _c !== void 0 ? _c : time;
                                        return twigRowOf(t, "".concat(scope, "-").concat(one.id), cut(titleOf(one), Math.max(12, width - side.length)), one.status !== 'working', side, function () { return openWork($, one.id); }, one.status);
                                    };
                                    jobLines = function (t, key, job) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, JOB_COLOR[job.kind], !job.isPaused && job.kind !== 'wait' && !(job.isEmpty ? at - job.at >= JOB_QUIET : job.wroteAt && at - job.wroteAt >= JOB_QUIET), JOB_SHAPE[job.kind])} alt={JOB_WORD[job.kind]} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={JOB_COLOR[job.kind]}>{JOB_GLYPH[job.kind]}</Text>
        </Box>);
                                    };
                                    jobRails = function (t, key) {
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={railSvg(t, LINE)} alt={t.isLast ? 'Last on the tree' : 'The tree goes on'} width={twigWidth(t)} height={LINE}/>
        </Box>) : (<Box key={key} flexShrink={0}>
          <Text dimColor>{"".concat(t.rails.map(function (isOn) { return (isOn ? '│ ' : '  '); }).join('')).concat(t.isLast ? '  ' : '│ ', "   ")}</Text>
        </Box>);
                                    };
                                    jobStand = function (job, width) {
                                        var _a;
                                        var pct = job.pct ? [job.pct] : [];
                                        var quiet = job.wroteAt ? at - job.wroteAt : 0;
                                        var ran = at - job.at;
                                        var _b = job.isPaused ? ['paused', 'paused', true]
                                            : job.kind === 'wait' && (job.target || !job.wroteAt || job.isEmpty) ? (job.target ? [job.target, job.target.replace(/^what it waits for (is|has) /, '').replace(/ unchanged /, ' still '), true] : ['waiting', 'waiting', false])
                                                : job.kind === 'watch' ? (job.wroteAt && !job.isEmpty ? ["last event ".concat(shortAgo(quiet), " ago"), "event ".concat(shortAgo(quiet), " ago"), false] : ['no event yet', 'no event', false])
                                                    : job.isEmpty ? (ran >= JOB_QUIET ? ["nothing printed in ".concat(shortAgo(ran)), "silent ".concat(shortAgo(ran)), true] : ['nothing printed yet', 'silent', false])
                                                        // (a server prints only when asked, so its quiet is no warning)
                                                        : job.wroteAt && quiet >= JOB_QUIET && job.kind !== 'server' ? ["quiet for ".concat(shortAgo(quiet)), "quiet ".concat(shortAgo(quiet)), true]
                                                            : job.wroteAt ? ['', '', false]
                                                                // A job whose output cannot be found says so, so a blank row is never taken for one that moves
                                                                : !job.id.startsWith('call-') && at - job.at >= JOB_UNREAD ? ['output not found', 'no output', true]
                                                                    : ['', '', false], state = _b[0], short = _b[1], isWarn = _b[2];
                                        var warn = isWarn && Boolean(state);
                                        // its speed and time left only while it prints: a minute old, they are no longer how it goes
                                        var isFresh = !warn && Boolean(job.wroteAt) && quiet < 60000;
                                        // a run whose own progress line gives its percent but no time left has one worked out from how long it has run, marked as a
                                        // guess: only the work's own line, which counts the whole run (a tool's bar starts again at each epoch, package or phase),
                                        // only while that line is the latest, and never for a wait, whose count is how long it is willing to wait
                                        var share = Number.parseFloat((_a = job.pct) !== null && _a !== void 0 ? _a : '') / 100;
                                        var guess = !job.left && job.isOwn && !job.isEarlier && job.kind !== 'wait' && share >= 0.01 && share < 1 && ran >= 20000 ? timeLeftText((ran / 1000) * ((1 - share) / share)) : undefined;
                                        var left = isFresh ? (job.left ? [job.left] : guess ? ["~".concat(guess)] : []) : [];
                                        var rate = job.rate && isFresh ? [job.rate] : [];
                                        var full = job.done ? [job.total ? "".concat(job.done, " of ").concat(job.total) : job.done] : [];
                                        var compact = job.done ? [job.total ? "".concat(job.done, "/").concat(job.total) : job.done] : [];
                                        // a count without its unit, for the narrowest line, so how far it is stays beside how long is left
                                        var bare = job.done && job.total && /^[\d.,]+$/.test(job.done) ? ["".concat(job.done, "/").concat(job.total.split(' ')[0])] : compact;
                                        var text = firstFit(__spreadArray(__spreadArray([__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), rate, true), left, true), [state], false), __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), rate, true), left, true), [short], false), __spreadArray(__spreadArray(__spreadArray(__spreadArray([], full, true), pct, true), left, true), [short], false), __spreadArray(__spreadArray(__spreadArray(__spreadArray([], compact, true), pct, true), left, true), [short], false)], (left.length ? [__spreadArray(__spreadArray(__spreadArray([], compact, true), left, true), [short], false), __spreadArray(__spreadArray([], bare, true), left, true)] : []), true), [__spreadArray(__spreadArray(__spreadArray([], compact, true), pct, true), [short], false), __spreadArray(__spreadArray([], compact, true), pct, true), __spreadArray(__spreadArray([], bare, true), pct, true), __spreadArray(__spreadArray([], pct, true), [short], false), [short]], false), width);
                                        return { text: text, isWarn: warn };
                                    };
                                    jobRow = function (t, scope) {
                                        var _a;
                                        var job = t.job;
                                        if (!job)
                                            return null;
                                        var key = "".concat(scope, "-job-").concat(job.id);
                                        var width = perRow - 4 - t.depth * 2;
                                        // its time, and how long it said it should take: in amber once well past that
                                        var ran = at - job.at;
                                        var isLong = Boolean(job.expect && ran > ((_a = job.expect) !== null && _a !== void 0 ? _a : 0) * 1.5);
                                        var time = job.expectText ? "".concat(took(ran), " of ~").concat(job.expectText) : took(ran);
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
                                        var _b = jobStand(job, width), stand = _b.text, isWarn = _b.isWarn;
                                        // Its percent, in blue, where the line says it as a part of its own
                                        var pctAt = job.pct && !isWarn ? (stand.startsWith("".concat(job.pct, " \u00B7 ")) || stand === job.pct ? 0 : stand.includes(" \u00B7 ".concat(job.pct)) ? stand.indexOf(" \u00B7 ".concat(job.pct)) + 3 : -1) : -1;
                                        // The latest line, unless it is only a progress bar its percent already says; a wait says the work's own words for it.
                                        // A run read from a progress line above its last still shows the last, such as an error after it
                                        var latest = job.kind === 'wait' && job.waitsFor ? (job.isNamed && !isKindSaid(job.label) ? job.label : '') : job.done && !job.isEarlier ? '' : job.latest && job.latest.replace(/[#=>|\-█▉▊▋▌▍▎▏░▒▓\s\d.%]/g, '').length >= 3 ? job.latest : '';
                                        var rest = width - stand.length - (stand ? 3 : 0);
                                        var detail = latest && rest >= 10 ? cut(latest, rest) : '';
                                        if (!stand && !detail)
                                            return head;
                                        return (<Box key={"job-".concat(key)} flexDirection="column" flexShrink={0}>
          {head}
          <Box key={"stand-".concat(key)} flexDirection="row" gap={1} height={1} overflow="hidden" flexShrink={0}>
            {jobRails(t, "rails-".concat(key))}
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
                                        var rest = { id: "more-".concat(card.id), label: "".concat(jobs.slice(0, more).reduce(function (n, job) { var _a; return n + ((_a = job.count) !== null && _a !== void 0 ? _a : 1); }, 0), " more jobs"), cmd: '', kind: 'watch', at: Math.min.apply(Math, jobs.slice(0, more).map(function (job) { return job.at; })) };
                                        return __spreadArray(__spreadArray([], shown, true), [rest], false).map(function (job) { return ({ one: card, job: job, kids: [] }); });
                                    };
                                    withJobs = function (branches, isAll) {
                                        if (isAll === void 0) { isAll = false; }
                                        return branches.map(function (b) { return (b.job ? b : __assign(__assign({}, b), { kids: __spreadArray(__spreadArray([], jobBranches(b.one, isAll), true), withJobs(b.kids, isAll), true) })); });
                                    };
                                    rowOf = function (t) { return (t.job ? jobRow(t, 'list') : twigRow(t, 'list')); };
                                    treeUnder = function (one) {
                                        var under = underOf(all, one.id);
                                        var own = jobBranches(one);
                                        if (!under.length && !own.length)
                                            return [];
                                        var branches = __spreadArray(__spreadArray([], own, true), withJobs(branchesOf(all, one.id, function (kid) { return kid.status === 'working' || isLingering(kid, at) || jobsOf(kid, at).length > 0; })), true);
                                        var twigs = twigsOf(branches, true);
                                        var rest = under.length - twigs.filter(function (t) { return !t.job; }).length;
                                        if (!rest)
                                            return twigsOf(branches).map(rowOf);
                                        var closing = { depth: 1, rails: [], isLast: true, hasKids: false };
                                        return __spreadArray(__spreadArray([], twigs.map(rowOf), true), [twigRowOf(closing, "rest-".concat(one.id), "".concat(rest, " ").concat(rest === 1 ? 'helper' : 'helpers', " ended"), true, '', function () { return openWork($, one.id); })], false);
                                    };
                                    return [4 /*yield*/, sessionName($)];
                                case 16:
                                    flowMine = _x.sent();
                                    return [4 /*yield*/, read($, flows)];
                                case 17:
                                    flowList = (_x.sent()).filter(function (f) { return isFlowShown(f, flowMine); });
                                    runningFlows = flowList.filter(function (f) { return f.status === 'working'; });
                                    shownFlows = flowList.filter(function (f) { return f.status === 'working' || isLingering(f, at); });
                                    endedFlows = flowList.filter(function (f) { return f.status !== 'working' && !isLingering(f, at); });
                                    flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(function (f) { return flowPaneOf(f.id) === paneId; }) : undefined;
                                    flowTokens = function (f) { return f.agents.reduce(function (sum, one) { var _a; return sum + ((_a = one.tokens) !== null && _a !== void 0 ? _a : 0); }, 0); };
                                    agentsWord = function (n) { return "".concat(n, " ").concat(n === 1 ? 'agent' : 'agents'); };
                                    flowGlance = function (f, most) {
                                        var _a;
                                        if (most === void 0) { most = Infinity; }
                                        var time = took((f.endedAt || at) - f.startedAt);
                                        var tokens = flowTokens(f) ? "".concat(thousands(flowTokens(f)), " tokens") : '';
                                        var agents = agentsWord(f.agents.length);
                                        var head = stood[f.status] ? [stood[f.status], 'Workflow'] : ['Workflow'];
                                        return firstFit([__spreadArray(__spreadArray([], head, true), [agents, tokens, time], false), __spreadArray(__spreadArray([], head, true), [agents, time], false), [(_a = head.at(-1)) !== null && _a !== void 0 ? _a : 'Workflow', agents, time], ['Workflow', time]], most);
                                    };
                                    roundsLabel = function (f, rounds) { return (rounds.length ? "round ".concat(rounds.length).concat(f.cap ? " of ".concat(f.cap) : '') : f.cap ? "0 of ".concat(f.cap, " rounds") : ''); };
                                    verdict = function (r) { return (r.isOpen ? (r.phase ? "".concat(doing(r.phase).toLowerCase(), " now") : 'starting') : r.pass === true ? "passed".concat(r.why ? ": ".concat(r.why) : '') : r.pass === false ? "failed: ".concat(r.why || 'no reason given') : r.why || 'ended'); };
                                    squaresRow = function (f, rounds, key, first) {
                                        if (first === void 0) { first = 1; }
                                        var groups = squaresOf(f, rounds);
                                        if (!groups.length)
                                            groups.push(f.phases.length ? f.phases.map(function () { return 'waiting'; }) : ['waiting']);
                                        var said = groups.map(function (g, i) { return "round ".concat(first + i, ": ").concat(g.join(', ')); }).join('; ');
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={squaresSvg(groups, LINE)} alt={said} width={squaresWidth(groups)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" gap={1} flexShrink={0}>
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
                                            return one ? doing(one.phase || stageOf(f) || 'Working') : round ? 'Between steps' : 'Starting';
                                        }
                                        if (f.status === 'stopped')
                                            return 'Stopped';
                                        if (f.status === 'failed')
                                            return 'Error';
                                        return (round === null || round === void 0 ? void 0 : round.pass) === true ? 'Passed' : (round === null || round === void 0 ? void 0 : round.pass) === false ? 'Not passed' : 'Ended';
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
                                            return 'between steps';
                                        if (phase === 'Make')
                                            return r.n === 1 ? 'Maker building it' : 'Maker fixing what the check found';
                                        if (phase === 'Check')
                                            return 'Checker testing it against the bar';
                                        return doing(phase || 'Working');
                                    };
                                    flowDots = function (key) {
                                        var _a;
                                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={dots(FLOW, LINE)} alt="Being done now" width={22} height={LINE} isInteractive/>
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
                                        var why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : cutShort ? (f.status === 'failed' ? 'stopped by an error' : 'stopped') : 'ended')).replace(/[.。]+$/, '');
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
                                        return (<Box key={"flow-".concat(f.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
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
                  <Text dimColor>Bar ·</Text>
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
                                    workId = paneId === LIST ? '' : flowShown ? "".concat(flowShown.id, ":").concat((_r = flowOpen === null || flowOpen === void 0 ? void 0 : flowOpen.id) !== null && _r !== void 0 ? _r : '') : ((_t = (_s = __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (one) { return workPaneOf(one.id) === paneId; })) === null || _s === void 0 ? void 0 : _s.id) !== null && _t !== void 0 ? _t : '');
                                    open = (_u = folds.get(workId)) !== null && _u !== void 0 ? _u : [];
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
          {done > DONE_FOLDED ? opener(OPEN_DONE, isFolded ? "".concat(done, " done") : 'Fold the done') : null}
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
                                        var pad = t.depth * 2 + 4;
                                        if (t.job) {
                                            // the line its row already says is not said again
                                            var tail = t.job.id.startsWith('more-') ? [] : ((_a = t.job.tail) !== null && _a !== void 0 ? _a : []).filter(function (line) { var _a, _b; return line.trim() !== ((_b = (_a = t.job) === null || _a === void 0 ? void 0 : _a.latest) !== null && _b !== void 0 ? _b : '').trim(); }).slice(-OUTPUT_LINES);
                                            if (!tail.length)
                                                return null;
                                            return (<Box key={"tail-".concat(t.job.id)} flexDirection="row" paddingLeft={pad} flexShrink={0}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={OUTPUT_FILL}>
              {tail.map(function (line, n) {
                                                    var _a;
                                                    return (<Text key={"tail-".concat((_a = t.job) === null || _a === void 0 ? void 0 : _a.id, "-").concat(n)} dimColor wrap="truncate-end">
                  {line}
                </Text>);
                                                })}
            </Box>
          </Box>);
                                        }
                                        var kid = t.one;
                                        if (!kid || kid.status !== 'working')
                                            return null;
                                        var kept = kid.items.filter(function (item) { return item.state !== 'dropped'; });
                                        var doing = kept.findIndex(function (item) { return item.state === 'doing'; });
                                        var lines = [doing >= 0 ? "Step ".concat(doing + 1, " of ").concat(kept.length, " \u00B7 ").concat((_c = (_b = kept[doing]) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : '') : '', now(kid)].filter(Boolean);
                                        if (!lines.length)
                                            return null;
                                        return (<Box key={"under-".concat(kid.id)} flexDirection="column" paddingLeft={pad} flexShrink={0}>
          {lines.map(function (line, n) { return (<Text key={"under-".concat(kid.id, "-").concat(n)} dimColor wrap="truncate-end">
              {line}
            </Text>); })}
        </Box>);
                                    };
                                    helpersPart = function (one) {
                                        // Another chat's work has its helpers from that chat's file
                                        var list = one.chat ? helpersThere : all;
                                        var under = underOf(list, one.id);
                                        var branches = __spreadArray(__spreadArray([], jobBranches(one, true), true), withJobs(branchesOf(list, one.id, function () { return true; }), true), true);
                                        var jobs = __spreadArray([one], under, true).reduce(function (n, kid) { return n + jobsOf(kid, at).reduce(function (sum, job) { var _a; return sum + ((_a = job.count) !== null && _a !== void 0 ? _a : 1); }, 0); }, 0);
                                        if (!under.length && !jobs)
                                            return null;
                                        var running = under.filter(function (kid) { return kid.status === 'working'; }).length;
                                        // Beside the jobs, the helpers are named, so neither count reads as the other's
                                        var helpers = !jobs ? (running ? "".concat(running, " at work \u00B7 ").concat(under.length, " in all") : "".concat(under.length, " in all")) : running === under.length ? "".concat(running, " ").concat(running === 1 ? 'helper' : 'helpers', " at work") : running ? "".concat(running, " of ").concat(under.length, " helpers at work") : "".concat(under.length, " ").concat(under.length === 1 ? 'helper' : 'helpers');
                                        var side = [jobs ? "".concat(jobs, " ").concat(jobs === 1 ? 'job' : 'jobs', " running") : '', under.length ? helpers : ''].filter(Boolean).join(' · ');
                                        return part('part-helpers', !jobs ? 'Helpers' : under.length ? 'Helpers and jobs' : 'Running', side, <Box flexDirection="column">{twigsOf(branches).flatMap(function (t) { return [t.job ? jobRow(t, 'details') : twigRow(t, 'details'), underTwig(t)]; })}</Box>);
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
                {pic.isGone ? (<Text dimColor wrap="wrap">{"Picture: ".concat(pic.name, " \u00B7 no longer kept")}</Text>) : (<Button key={"pic-open-".concat(at, "-").concat(n, "-").concat(presses)} label={"\u2922 ".concat(pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open', ": ").concat(cut(pic.name, Math.max(12, room - 14)))} plain onPress={function (press) { return ((presses += 1), redraw($), void showPicture($, pic.path, paneId, "pic-".concat(at, "-").concat(n), press.surface)); }}/>)}
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
          {lines ? null : <Text dimColor>The app has not kept the chat of this work.</Text>}
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
                  <Button key={"told-".concat(at, "-").concat(presses)} label="▸ The brief it was given" plain dimColor onPress={function () { return fold(-at - 1); }}/>
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
                                    theirChat = function (one, c) { return (<Text dimColor wrap="wrap">{"Its chat is kept by the chat \"".concat(chatName(c), "\"").concat(c.host ? " on ".concat(macName(c.host)) : '', ", which runs it.").concat(one.status === 'working' ? ' Stop it or move it to another model there.' : '')}</Text>); };
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
                                        var _a, _b, _c;
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
              {(one.status === 'working' && !one.chat) || left(one) ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={"stop-".concat(one.id)} label="Stop" onPress={function () { return void stop($, one.id); }}/> : null}
                  {left(one) ? <Button key={"artifact-".concat(one.id, "-").concat(presses)} label="Its result" onPress={function () { var _a, _b; return void openReport($, (_b = (_a = left(one)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''); }}/> : null}
                </Box>) : null}
            </Box>
          </Box>
          {((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) || cardNotesOf(one.id, at).length ? (<Box key="part-gates" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {adminBlock($, table, one, "gates-big-".concat(one.id), at)}
              </Box>
            </Box>) : null}
          {one.ask ? (<Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={needsPerson(one) ? NEEDS : LIVE}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>{needsPerson(one) ? 'Needs you now' : 'Acting on your reply'}</Text>
                {askBlock(one, "ask-big-".concat(one.id), true)}
              </Box>
            </Box>) : sentLine(one, at) ? (<Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>) : null}
          {resultPart(one)}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {one.chat && !lines && (talks.has(one.id) || one.chat.host)
                                                ? part('part-chat', 'Its chat', '', theirChat(one, one.chat))
                                                : part('part-chat', 'Its chat', lines && showing < lines.length ? "last ".concat(showing, " lines") : '', talks.has(one.id) ? talk(one, lines, (_c = (_b = shots.get(one.id)) === null || _b === void 0 ? void 0 : _b.shots) !== null && _c !== void 0 ? _c : new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>);
                                    };
                                    promptButtons = function (p, key) {
                                        var press = function (said) { return function () { return void (answerPrompt($, p.id, said), redraw($)); }; };
                                        return (<Box key={"prompt-buttons-".concat(key)} flexDirection="row" gap={1}>
          <Button key={"prompt-yes-".concat(key, "-").concat(presses)} label="Yes" onPress={press('yes')}/>
          <Button key={"prompt-no-".concat(key, "-").concat(presses)} label="No" onPress={press('no')}/>
        </Box>);
                                    };
                                    isHeldHere = function (p, c) { return Boolean(!c && p.isHeld && promptHeld.has(p.id)); };
                                    promptCard = function (p, key, where, c) { return (<Box key={"prompt-".concat(key)} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
        <Box flexDirection="column">
          <Text dimColor wrap="truncate-end">{"".concat(p.kind === 'question' ? 'Question' : p.kind === 'plan' ? 'Plan' : 'Permission', " \u00B7 ").concat(isHeldHere(p, c) || !c ? 'waits for your answer' : 'asked in another chat')}</Text>
          <Text bold wrap="truncate-end">{p.title || (c ? 'That chat itself' : 'This chat itself')}</Text>
          {/* At the top, away from its chat's name: which chat it is */}
          {c ? <Text key={"prompt-".concat(key, "-chat")} dimColor wrap="truncate-end">{"In the chat \u201C".concat(chatName(c), "\u201D").concat(c.host ? " on ".concat(macName(c.host)) : '')}</Text> : null}
          <Text dimColor wrap="wrap">{p.kind === 'question' ? 'Asks you a question' : p.kind === 'plan' ? 'Asks you to approve its plan' : 'Asks your permission'}</Text>
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
      </Box>); };
                                    answerHere = function (p) { return (p.kind === 'question' ? 'Pick your answer in the box at the bottom of this chat.' : 'Answer Yes or No in the box at the bottom of this chat.'); };
                                    saidOf = function (p) {
                                        var _a;
                                        if (p.answered === 'stopped')
                                            return 'It ended before you answered · nothing happened';
                                        if (p.answered === 'no')
                                            return p.kind === 'question' ? 'You skipped it · no answer went back, and it waits for you' : p.kind === 'plan' ? 'You said no · it keeps planning' : p.title ? 'You said no · it did not happen, and the work was told' : 'You said no · it did not happen, and it waits for what you say next';
                                        if (p.kind === 'question')
                                            return p.isRunning ? 'You answered · it is taking your answer' : 'You answered · it carries on with your answer';
                                        if (p.kind === 'plan')
                                            return 'You approved the plan · it is carrying it out';
                                        if (p.isCut)
                                            return 'You allowed it · it was stopped before it finished';
                                        return p.isRunning ? 'You allowed it · it is running now' : "You allowed it \u00B7 ".concat((_a = p.done) !== null && _a !== void 0 ? _a : 'it ran and is done');
                                    };
                                    answeredCard = function (p, key, c) {
                                        return reportLine(table, "answered-".concat(key), p.answered !== 'no' && p.answered !== 'stopped' && !p.isCut, saidOf(p), [p.title || (c ? 'That chat itself' : 'This chat itself'), p.text]);
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
                                    finished = __spreadArray(__spreadArray([], own.filter(function (one) { return one.status !== 'working' && !isLingering(one, at) && !one.ask; }), true), endedElsewhere, true).sort(function (a, b) { return b.endedAt - a.endedAt; });
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
                                        var current = stageOf(f);
                                        var agentRow = function (one) {
                                            var _a;
                                            var isPicked = (picked === null || picked === void 0 ? void 0 : picked.id) === one.id;
                                            var facts = [modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), one.tokens ? "context ".concat(thousands(one.tokens)) : '', one.status === 'working' ? (f.status === 'working' ? 'at work' : 'stopped') : one.status === 'failed' ? 'failed' : ''].filter(Boolean).join(' · ');
                                            return (<Box key={"flow-agent-".concat(one.id)} flexDirection="row" alignItems="flex-start" gap={1} paddingLeft={2}>
            <Button key={"flow-pick-".concat(one.id, "-").concat(presses)} label={"".concat(isPicked ? '▾' : '▸', " ").concat(one.label || one.phase || 'agent')} plain dimColor={!isPicked} onPress={function () { return ((presses += 1), flowPicked.set(f.id, one.id), void update($, view, function (v) { return (__assign({}, v)); })); }}/>
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
                        {[p.detail, modelName((_a = p.model) !== null && _a !== void 0 ? _a : ''), ran.length ? "".concat(ran.length, " ").concat(ran.length === 1 ? 'agent' : 'agents') : ''].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                  </Box>);
                                                })}
            </Box>)}
          {part('part-rounds', 'Rounds', roundsLabel(f, rounds), <Box flexDirection="column" gap={1}>
              {rounds.length ? null : <Text dimColor>{f.status === 'working' ? 'The first round is starting.' : 'No agent ran.'}</Text>}
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
                                                ? part('part-chat', "Chat of the ".concat(picked.label || picked.phase || 'agent').concat(rounds.length > 1 ? ", round ".concat((_b = (_a = rounds.find(function (r) { return r.agents.some(function (one) { return one.id === picked.id; }); })) === null || _a === void 0 ? void 0 : _a.n) !== null && _b !== void 0 ? _b : '') : ''), modelName((_c = picked.model) !== null && _c !== void 0 ? _c : ''), talk(__assign(__assign({}, started(picked.id, '', picked.label, '', picked.at)), { answer: (_d = picked.result) !== null && _d !== void 0 ? _d : '' }), lines, new Map()))
                                                : null}
          {f.status !== 'working' && f.result ? part('part-result', 'What it returned', '', <Markdown text={f.result}/>) : null}
        </Box>);
                                    };
                                    if (!paneId.startsWith(FLOW_PANE)) return [3 /*break*/, 21];
                                    if (!flowShown)
                                        return [2 /*return*/, <Text dimColor>This workflow is no longer kept.</Text>];
                                    picked = pickedOf(flowShown);
                                    if (!picked) return [3 /*break*/, 19];
                                    return [4 /*yield*/, flowTalkOf($, flowShown, picked).catch(function () { return undefined; })];
                                case 18:
                                    _h = _x.sent();
                                    return [3 /*break*/, 20];
                                case 19:
                                    _h = undefined;
                                    _x.label = 20;
                                case 20:
                                    lines = _h;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>)];
                                case 21:
                                    alone = __spreadArray(__spreadArray(__spreadArray([], all, true), elsewhere, true), helpersThere, true).find(function (one) { return one.id === workId; });
                                    if (paneId !== LIST && !alone)
                                        return [2 /*return*/, <Text dimColor>{paneId.startsWith("".concat(WORK_PANE, "r-")) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
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
                                case 22:
                                    kept = _x.sent();
                                    ui = uiOf($, e);
                                    isInline = e.surface === 'terminal' && e.props.placement === 'inline';
                                    notices = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], boxRows($, ui, e.surface === 'terminal' && Boolean(keysAsk && hasDraft(keysAsk))), true), looseGates.map(function (gate) { return ({ at: gate.at, node: gateRow($, ui, gate, "gate-".concat(gate.id), false) }); }), true), waiting.map(function (p) { return ({ at: p.at, node: promptCard(p, "this-".concat(p.id), answerHere(p)) }); }), true), otherChats.flatMap(function (c) {
                                        var _a;
                                        var url = pressOf(c);
                                        return ((_a = c.prompts) !== null && _a !== void 0 ? _a : []).map(function (p) { return ({ at: p.at, node: promptCard(p, "".concat(c.host, "-").concat(c.chat, "-").concat(p.id), c.host && !url ? "Answer it in that chat, on ".concat(macName(c.host)) : c.host ? "Answer it in that chat, which runs on ".concat(macName(c.host)) : 'Answer it in that chat', c) }); });
                                    }), true);
                                    isAsking = function (one) { return Boolean(one.ask) && !isActingOnReply(one); };
                                    isWaitingPress = function (one) { var _a; return one.status === 'working' && Boolean((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length); };
                                    answeredSince = function (one) {
                                        var sent = one.chat ? undefined : sentReplies.get(one.id);
                                        return (sent === null || sent === void 0 ? void 0 : sent.isCard) && sent.to !== 'lost' && at - sent.at < ANSWER_SHOWN ? sent.at : 0;
                                    };
                                    isUp = function (one) { return isAsking(one) || isWaitingPress(one) || (!one.chat && cardNotesOf(one.id, at).length > 0) || answeredSince(one) > 0; };
                                    upSince = function (one) { var _a, _b, _c; return Math.max.apply(Math, __spreadArray(__spreadArray(__spreadArray([isAsking(one) ? ((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : 0) : 0], (isWaitingPress(one) ? (_c = one.admins) !== null && _c !== void 0 ? _c : [] : []).map(function (gate) { return gate.at; }), false), (one.chat ? [] : cardNotesOf(one.id, at).map(function (note) { return note.at; })), false), [answeredSince(one)], false)); };
                                    askingHere = shownWork.filter(isUp);
                                    askingThere = listedChats.flatMap(function (c) { return shownOf(c).filter(isUp); });
                                    askCards = __spreadArray(__spreadArray([], askingHere, true), askingThere, true).sort(function (a, b) { return upSince(b) - upSince(a); });
                                    restHere = shownWork.filter(function (one) { return !isUp(one); });
                                    top = __spreadArray(__spreadArray([], notices.map(function (one) { return ({ at: one.at, draw: function () { return one.node; } }); }), true), askCards.map(function (one) { return ({ at: upSince(one) - (isAsking(one) || isWaitingPress(one) ? 0 : 1e15), draw: function () { return small(one); } }); }), true).sort(function (a, b) { return b.at - a.at; });
                                    waitsCount = notices.length + askCards.filter(function (one) { return isAsking(one) || isWaitingPress(one); }).length;
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
                                        isDone: isHappy(own, at) || elsewhere.some(function (one) { return one.status === 'done' && lingers(one, at); }) || flowList.some(function (f) { var _a; return f.status === 'done' && isLingering(f, at) && ((_a = roundsOf(f).at(-1)) === null || _a === void 0 ? void 0 : _a.pass) !== false; }),
                                    };
                                    mood = headMood(head);
                                    isKeyed = e.surface === 'terminal' && !boxes.length;
                                    keyed = isKeyed;
                                    if (!alone) return [3 /*break*/, 23];
                                    _j = { version: '', installed: '', isWaiting: false };
                                    return [3 /*break*/, 25];
                                case 23: return [4 /*yield*/, versionsOf($)
                                    // A newer version whose changes the person has not seen: its screen covers the whole panel until it is closed, in place of the header's moment
                                ];
                                case 24:
                                    _j = _x.sent();
                                    _x.label = 25;
                                case 25:
                                    versions = _j;
                                    if (!alone) return [3 /*break*/, 26];
                                    _k = undefined;
                                    return [3 /*break*/, 28];
                                case 26: return [4 /*yield*/, updateScreen($, ui, versions.version, head.asks, e.surface)
                                    // A password or key box stays above it: the runner waits on it
                                ];
                                case 27:
                                    _k = _x.sent();
                                    _x.label = 28;
                                case 28:
                                    screen = _k;
                                    // A password or key box stays above it: the runner waits on it
                                    if (paneId === LIST && !alone) {
                                        was = (_v = listOffsets.get(e.surface)) !== null && _v !== void 0 ? _v : 0;
                                        listOffsets.set(e.surface, Math.max(0, e.props.scroll.offset));
                                        count = waitsCount;
                                        if (count !== waitsAtTop || (was > 0) !== (((_w = listOffsets.get(e.surface)) !== null && _w !== void 0 ? _w : 0) > 0))
                                            ((waitsAtTop = count), drawAgain($));
                                    }
                                    if (screen)
                                        return [2 /*return*/, <Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>{notices.map(function (one) { return one.node; })}{doneNotesPart(ui, at)}{screen}</Box>];
                                    if (!(alone || !versions.version)) return [3 /*break*/, 29];
                                    _l = undefined;
                                    return [3 /*break*/, 31];
                                case 29: return [4 /*yield*/, updatedPieces($, versions.version)
                                    // A newer version the hourly look saw: its card under the header's lines, with Install
                                ];
                                case 30:
                                    _l = _x.sent();
                                    _x.label = 31;
                                case 31:
                                    updated = _l;
                                    if (!alone) return [3 /*break*/, 32];
                                    _m = null;
                                    return [3 /*break*/, 34];
                                case 32:
                                    _o = newOutCard;
                                    _p = [$, ui];
                                    return [4 /*yield*/, newOut($, versions.version, versions.installed).catch(function () { return ''; })];
                                case 33:
                                    _m = _o.apply(void 0, _p.concat([_x.sent()]));
                                    _x.label = 34;
                                case 34:
                                    outCard = _m;
                                    return [2 /*return*/, (<Box flexDirection="column" gap={isInline ? 0 : 1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
                                            // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
                                            // them, which wraps onto a second row in a narrow pane rather than cutting anything off
                                            <Box key="head" flexDirection="column" gap={isInline ? 0 : 1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {/* Just moved to a newer version: the octopus turns blue and jumps for the moment. Above the prompt in a narrow terminal the
                                                    panel is a few rows tall, so it keeps them for the work and leaves the octopus to the line above the prompt */}
              {isInline ? null : updated ? octopus(ui, 'head-mark', 'updated', HEAD_MARK, "Claudopus, updated to ".concat(versions.version), $, { surface: e.surface, requestId: paneId }) : octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, something needs you', happy: 'Claudopus, work finished', working: 'Claudopus at work', mark: 'Claudopus' }[mood], $, { surface: e.surface, requestId: paneId })}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                {/* Just moved to a newer version: "Claudopus updated" in blue, then the new version, for the moment */}
                {updated ? (nameLine(ui, updated)) : (<Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                    <Box flexShrink={0}>
                      <Text bold>Claudopus</Text>
                    </Box>
                    {versions.version ? <Text key="head-version" dimColor wrap="truncate-end">{"v".concat(versions.version).concat(versions.isWaiting ? " \u00B7 v".concat(versions.installed, " installed, type /reload-plugins") : '')}</Text> : null}
                  </Box>)}
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap={e.surface === 'terminal' ? 'wrap' : 'truncate-end'}>{headLine(head)}</Text>
                {isInline ? null : <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? "This chat: ".concat(fill(chat.tokens, chat.window)) : 'This chat: just begun'}</Text>}
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
              {isInline && !e.props.isFocused ? <Text key="head-keys-short" dimColor>ctrl+x Tab for keys</Text> : null}
            </Box>
            {/* The terminal reaches a pane from the keys only after ctrl+x Tab, which nothing else tells; once it holds them each
                                                    button above answers its first letter */}
            {e.surface === 'terminal' && (e.props.isFocused || !isInline) ? (<Text key="head-keys" dimColor wrap="wrap">
                {!e.props.isFocused ? 'ctrl+x Tab for keys' : __spreadArray(__spreadArray([], own, true), elsewhere, true).some(function (one) { return one.ask; }) ? 'What you type goes in the reply box · Tab leaves it for the keys shown · Esc: back to the chat' : 'Esc: back to the chat'}
              </Text>) : null}
          </Box>) : null}
        {!alone ? top.map(function (one) { return one.draw(); }) : null}
        {!alone ? doneNotesPart(ui, at) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
                                                ? big(alone, talked === null || talked === void 0 ? void 0 : talked.lines)
                                                : __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (listedChats.length && (restHere.length || shownFlows.length || promptsAnswered.length) ? [chatHead('this', 'This chat', selfName() ? "on ".concat(selfName()) : '')] : []), true), promptsAnswered.map(function (p) { return answeredCard(p, "this-".concat(p.id)); }), true), __spreadArray(__spreadArray([], restHere.map(function (one) { return ({ at: one.startedAt, card: function () { return small(one); } }); }), true), shownFlows.map(function (f) { return ({ at: f.startedAt, card: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return a.at - b.at; }).map(function (one) { return one.card(); }), true), listedChats.flatMap(function (c) {
                                                    var cards = shownOf(c).filter(function (one) { return !isUp(one); }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                                                    var answered = answeredOf(c.answeredPrompts).map(function (p) { return answeredCard(p, "".concat(c.host, "-").concat(c.chat, "-").concat(p.id), c); });
                                                    return cards.length || answered.length ? __spreadArray(__spreadArray([chatHead("".concat(c.host, "-").concat(c.chat), chatName(c), chatSide(c, selfName()), c)], answered, true), cards.map(function (one) { return small(one); }), true) : [];
                                                }), true)}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1}/> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>)];
                            }
                        });
                    }); })()];
                case 6:
                    drawing = _d.sent();
                    heldDrawings.set(heldKey, { shape: shape, content: content, at: heldAt, fresh: freshness, drawing: drawing });
                    return [2 /*return*/, drawing];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : tabFailed($, e, next.error)); });
};
