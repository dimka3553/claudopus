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
var panelHooks = function (on) {
    // Beside the chat: one small card per piece of work under way, as wide as the panel, every card the same height whatever the work
    // writes. Work that has ended leaves the panel. A card's Details is a tab of its own, drawn here too: all its to-dos, then its own chat
    on('ui.render', { component: 'Pane' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var paneId, _a, Box, Button, Markdown, Text, from, _i, lateFrom_1, _b, key, value, _c, isFinishedOpen, all, own, otherChats, elsewhere, chat, at, working, shownWork, ours, _d, windowOf, stood, glance, _e, picking, facts, now, table, room, perRow, live, askBlock, small, twigLines, twigRowOf, twigRow, treeUnder, flowMine, flowList, runningFlows, shownFlows, endedFlows, flowShown, flowTokens, boldRow, agentsWord, flowGlance, roundsLabel, verdict, squaresRow, stateWord, outcomeRow, flowSmall, flowOpen, workId, open, fold, part, row, opener, askPart, todoPart, helpersPart, talk, theirChat, big, promptCard, chatHead, left, endedElsewhere, shownOf, listedChats, finished, finishedPart, flowBig, picked, lines, _f, alone, talked, kept, ui, runningThere, head, mood, versions, _g, updated, _h;
        var _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    paneId = (_j = e.requestId) !== null && _j !== void 0 ? _j : '';
                    if (paneId !== LIST && !paneId.startsWith(WORK_PANE) && !paneId.startsWith(FLOW_PANE))
                        return [2 /*return*/, next(e)];
                    _a = $.ui.resolve(e), Box = _a.Box, Button = _a.Button, Markdown = _a.Markdown, Text = _a.Text;
                    if (!(paneId === LIST)) return [3 /*break*/, 2];
                    return [4 /*yield*/, read($, tick)];
                case 1:
                    _p.sent();
                    _p.label = 2;
                case 2:
                    if (!(paneId === LIST)) return [3 /*break*/, 4];
                    return [4 /*yield*/, $.clock.now()
                        // The first drawing after a load begins the pauses of work that ended while it reloaded, and draws again as they end
                    ];
                case 3:
                    drawnNow = _p.sent();
                    _p.label = 4;
                case 4:
                    if (!(paneId === LIST && __spreadArray([], lateFrom.values(), true).includes(Infinity))) return [3 /*break*/, 6];
                    return [4 /*yield*/, $.clock.now()
                        // Only while the reload is recent: a panel first opened long after shows no finish of then
                    ];
                case 5:
                    from = _p.sent();
                    // Only while the reload is recent: a panel first opened long after shows no finish of then
                    for (_i = 0, lateFrom_1 = lateFrom; _i < lateFrom_1.length; _i++) {
                        _b = lateFrom_1[_i], key = _b[0], value = _b[1];
                        if (value === Infinity)
                            from - Number(key.split(':').at(-1)) < RELOAD_GRACE * 2 ? lateFrom.set(key, from) : lateFrom.delete(key);
                    }
                    $.clock.after(LINGER + 20, function () { return void update($, tick, function (n) { return n + 1; }); });
                    _p.label = 6;
                case 6: return [4 /*yield*/, read($, view)
                    // Every piece of work this chat keeps; its own are the ones the chat's thread started, the rest are their helpers
                ];
                case 7:
                    _c = (_p.sent()).isFinishedOpen, isFinishedOpen = _c === void 0 ? false : _c;
                    return [4 /*yield*/, read($, todos)];
                case 8:
                    all = _p.sent();
                    own = all.filter(function (one) { return !one.parentId; });
                    return [4 /*yield*/, read($, others)];
                case 9:
                    otherChats = _p.sent();
                    elsewhere = cardsOf(otherChats).map(function (one) { return (one.ask && answeredHere.has("".concat(one.id, ":").concat(one.ask.at)) ? __assign(__assign({}, one), { ask: undefined }) : one); });
                    return [4 /*yield*/, read($, me)];
                case 10:
                    chat = _p.sent();
                    return [4 /*yield*/, $.clock.now()];
                case 11:
                    at = _p.sent();
                    working = own.filter(function (one) { return one.status === 'working'; }).sort(function (a, b) { return a.startedAt - b.startedAt; });
                    shownWork = own.filter(function (one) { return one.status === 'working' || isLingering(one, at) || one.ask; });
                    _d = modelName;
                    return [4 /*yield*/, $.session.model().catch(function () { return ''; })];
                case 12:
                    ours = _d.apply(void 0, [_p.sent()]);
                    windowOf = function (one) { var _a; return (!one.chat && (one.isFork || (ours && modelName((_a = one.model) !== null && _a !== void 0 ? _a : '') === ours)) ? chat.window : 0); };
                    stood = { working: '', done: 'Finished', stopped: 'Stopped before it finished', failed: 'An error stopped it before it finished' };
                    glance = function (one) { var _a; return [stood[one.status], modelName((_a = one.model) !== null && _a !== void 0 ? _a : ''), one.tokens ? share(one.tokens, windowOf(one)) : '', took((one.endedAt || at) - one.startedAt)].filter(Boolean).join(' · '); };
                    return [4 /*yield*/, read($, view)];
                case 13:
                    _e = (_p.sent()).picking, picking = _e === void 0 ? '' : _e;
                    facts = function (one, isWhole) {
                        var _a;
                        var name = modelName((_a = one.model) !== null && _a !== void 0 ? _a : '');
                        // Another chat's work is moved to another model in that chat
                        if (one.status !== 'working' || !name || one.chat)
                            return <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{glance(one)}</Text>;
                        var scope = "model-".concat(one.id);
                        if (picking === one.id)
                            return (<Box flexDirection="row" flexWrap="wrap" columnGap={2}>
            {MODELS.map(function (model) { return (<Button key={"pick-".concat(one.id, "-").concat(model, "-").concat(presses)} label={"".concat(modelName(model) === name ? '✓ ' : '').concat(modelName(model))} plain dimColor={modelName(model) !== name} hover={{ scope: "".concat(scope, "-").concat(model), underline: true }} onPress={function () { return ((presses += 1), void choose($, one.id, model)); }}/>); })}
          </Box>);
                        var rest = [one.tokens ? share(one.tokens, windowOf(one)) : '', took(at - one.startedAt)].filter(Boolean).join(' · ');
                        return (<Box flexDirection="row" alignItems="flex-start">
          <Button key={"model-".concat(one.id, "-").concat(presses)} label={name} plain dimColor hover={{ scope: scope, underline: true }} onPress={function () { return ((presses += 1), void update($, view, function (v) { return (__assign(__assign({}, v), { picking: one.id })); })); }}/>
          <Box flexShrink={1} minWidth={0}>
            <Text dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{" \u00B7 ".concat(rest)}</Text>
          </Box>
        </Box>);
                    };
                    now = function (one) { var _a, _b; return (_b = (_a = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : ''; };
                    table = $.ui.resolve(e);
                    room = Math.max(40, Math.floor((e.props.bodyColumns - 9) * (e.surface === 'terminal' ? 1.8 : 2.3)));
                    perRow = Math.max(24, Math.floor(room / 2));
                    live = function (key) {
                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box flexShrink={0}>
          <table.Svg key={key} source={LIVE_DOTS} alt="Being done now" width={22} height={LINE} isInteractive/>
        </Box>) : (<Text color={LIVE}>▸</Text>);
                    };
                    askBlock = function (one, key, isWhole) {
                        var _a, _b, _c;
                        if (isWhole === void 0) { isWhole = false; }
                        var ask = one.ask;
                        if (!ask)
                            return null;
                        var answers = ((_a = ask.choices) === null || _a === void 0 ? void 0 : _a.length) ? ask.choices : DEFAULT_ANSWERS;
                        var lost = sentLine(one, at);
                        return (<Box key={key} flexDirection="column" gap={1}>
          {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
          <Text wrap="wrap" color={NEEDS} bold>{withLinks(table.Link, isWhole ? ask.text : cut(ask.text, Math.round(room * 1.6)), "".concat(key, "-text"), ask.text)}</Text>
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
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {answers.map(function (choice, n) { return (<Button key={"".concat(key, "-choice-").concat(n, "-").concat(presses)} label={choice} onPress={function () { return void ((presses += 1), answerAsk($, one, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })); }}/>); })}
          </Box>
          {'Input' in table ? (<Box width="100%" flexDirection="column">
              <table.Input key={"".concat(key, "-reply-").concat((_b = replies.get(one.id)) !== null && _b !== void 0 ? _b : 0)} placeholder="Or reply in your own words" value={(_c = drafts.get(one.id)) !== null && _c !== void 0 ? _c : ''} submitLabel="send" onInput={function (value) { return void (drafts.set(one.id, value), holdTimes($)); }} onSubmit={function (value) { return void (drafts.delete(one.id), value.trim() ? answerAsk($, one, value, true).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); }) : undefined); }}/>
            </Box>) : null}
          {/* An answer that could not be left for another Mac says so, under the ask that is back */}
          {lost ? <Text key={"".concat(key, "-sent")} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{lost}</Text> : null}
        </Box>);
                    };
                    small = function (one) {
                        var kept = one.items.filter(function (item) { return item.state !== 'dropped'; });
                        var done = kept.filter(function (item) { return item.state === 'done'; }).length;
                        var tree = treeUnder(one);
                        return (<Box key={"todo-".concat(one.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {/* Purple while it works, green once it finished; work stopped or stopped by an error has no mark */}
          {/* Amber while it needs the person's hands */}
          {one.status === 'working' || one.status === 'done' ? <Box width={1} flexShrink={0} backgroundColor={one.ask ? NEEDS : one.status === 'working' ? LIVE : DONE}/> : <Box width={1} flexShrink={0}/>}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Text bold wrap="truncate-end">{titleOf(one)}</Text>
              {facts(one, false)}
            </Box>
            {one.ask ? askBlock(one, "ask-".concat(one.id)) : null}
            <Box flexDirection="row" alignItems="flex-start" gap={1} height={one.ask ? 1 : 2} overflow="hidden">
              {one.status === 'working' ? live("live-".concat(one.id)) : null}
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {/* In its pause after ending, the line says in a word how it ended: green when it finished, plain when it was stopped */}
                {lingers(one, at) ? (<Text wrap="truncate-end" color={one.status === 'done' ? DONE : undefined} dimColor={one.status !== 'done'}>
                    {one.status === 'done' ? '✓ Finished' : one.status === 'failed' ? 'Stopped by an error' : 'Stopped'}
                  </Text>) : (<Text wrap={one.ask ? 'truncate-end' : 'wrap'} dimColor={one.status !== 'working' || Boolean(one.ask)}>{(!one.ask && sentLine(one, at)) || cut(now(one), room) || (one.status === 'working' ? 'Starting' : 'It wrote no line about itself')}</Text>)}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Button key={"open-".concat(one.id, "-").concat(presses)} label="Details" onPress={function () { return openWork($, one.id); }}/>
              {one.status === 'working' && !one.chat ? <Button key={"stop-".concat(one.id)} label="Stop" onPress={function () { return void stop($, one.id); }}/> : null}
              <Box flexGrow={1}/>
              {kept.length > 0 ? (<Box flexShrink={0}>
                  <Text dimColor>{"".concat(done, " of ").concat(kept.length, " done")}</Text>
                </Box>) : null}
            </Box>
            {/* Its helpers, inside the card: its coloured edge runs down beside them */}
            {tree.length ? <Box key={"tree-".concat(one.id)} flexDirection="column">{tree}</Box> : null}
          </Box>
        </Box>);
                    };
                    twigLines = function (t, key, status) {
                        return 'Svg' in table && e.surface !== 'terminal' ? (<Box key={key} flexShrink={0}>
          <table.Svg key={"".concat(key, "-svg")} source={twigSvg(t, LINE, status ? { working: LIVE, done: TWIG_ENDED, failed: TWIG_FAILED, stopped: '#808080' }[status] : '', status === 'working')} alt={status ? { working: 'At work', done: 'Finished', failed: 'Stopped by an error', stopped: 'Stopped' }[status] : 'Ended'} width={twigWidth(t)} height={LINE} isInteractive/>
        </Box>) : (<Box key={key} flexDirection="row" flexShrink={0}>
          <Text dimColor>{twigText(t)}</Text>
          <Text color={status === 'working' ? LIVE : status === 'done' ? DONE : status === 'failed' ? 'error' : undefined} dimColor={!status || status === 'stopped'}>
            {status === 'working' ? '●' : status === 'done' ? '✓' : status === 'failed' ? '✕' : status === 'stopped' ? '■' : '○'}
          </Text>
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
        <Box flexShrink={0}>
          <Button key={"go-".concat(key, "-").concat(presses)} label="›" plain dimColor hover={{ scope: "twig-".concat(key) }} onPress={onPress}/>
        </Box>
      </Box>); };
                    twigRow = function (t, scope) {
                        var one = t.one;
                        if (!one)
                            return null;
                        return twigRowOf(t, "".concat(scope, "-").concat(one.id), cut(titleOf(one), Math.max(12, perRow - 12 - t.depth * 2)), one.status !== 'working', took((one.endedAt || at) - one.startedAt), function () { return openWork($, one.id); }, one.status);
                    };
                    treeUnder = function (one) {
                        var under = underOf(all, one.id);
                        if (!under.length)
                            return [];
                        var branches = branchesOf(all, one.id, function (kid) { return kid.status === 'working' || isLingering(kid, at); });
                        var twigs = twigsOf(branches, true);
                        var rest = under.length - twigs.length;
                        if (!rest)
                            return twigsOf(branches).map(function (t) { return twigRow(t, 'list'); });
                        var closing = { depth: 1, rails: [], isLast: true, hasKids: false };
                        return __spreadArray(__spreadArray([], twigs.map(function (t) { return twigRow(t, 'list'); }), true), [twigRowOf(closing, "rest-".concat(one.id), "".concat(rest, " ").concat(rest === 1 ? 'helper' : 'helpers', " ended"), true, '', function () { return openWork($, one.id); })], false);
                    };
                    return [4 /*yield*/, sessionName($)];
                case 14:
                    flowMine = _p.sent();
                    return [4 /*yield*/, read($, flows)];
                case 15:
                    flowList = (_p.sent()).filter(function (f) { return isFlowShown(f, flowMine); });
                    runningFlows = flowList.filter(function (f) { return f.status === 'working'; });
                    shownFlows = flowList.filter(function (f) { return f.status === 'working' || isLingering(f, at); });
                    endedFlows = flowList.filter(function (f) { return f.status !== 'working' && !isLingering(f, at); });
                    flowShown = paneId.startsWith(FLOW_PANE) ? flowList.find(function (f) { return flowPaneOf(f.id) === paneId; }) : undefined;
                    flowTokens = function (f) { return f.agents.reduce(function (sum, one) { var _a; return sum + ((_a = one.tokens) !== null && _a !== void 0 ? _a : 0); }, 0); };
                    boldRow = Math.max(20, Math.floor(perRow * 0.88));
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
                    outcomeRow = function (f, rounds, most) {
                        var r = rounds.filter(function (one) { return !one.isOpen && (one.pass !== undefined || one.why); }).at(-1);
                        if (!r)
                            return <Text dimColor>{fitWords(f.status === 'working' ? 'No round checked yet' : 'No round was checked', most)}</Text>;
                        // The round's number goes first when the row holds it; the squares above say which round it was when it does not
                        var why = (r.why || (r.pass ? 'passed' : r.pass === false ? 'failed' : 'ended')).replace(/[.。]+$/, '');
                        var whole = "Round ".concat(r.n, ": ").concat(why);
                        return (<Box flexDirection="row" gap={1}>
          <Text color={r.pass ? DONE : r.pass === false ? 'error' : undefined} dimColor={r.pass === undefined}>
            {r.pass ? '✓' : r.pass === false ? '✕' : '·'}
          </Text>
          <Text dimColor>{whole.length <= most - 2 ? whole : fitWords(why, most - 2)}</Text>
        </Box>);
                    };
                    flowSmall = function (f) {
                        var _a;
                        var rounds = roundsOf(f);
                        var word = stateWord(f, rounds);
                        var groups = squaresOf(f, rounds);
                        var squaresLetters = Math.ceil(squaresWidth(groups.length ? groups : [['waiting']]) / 7.5) + 2;
                        return (<Box key={"flow-".concat(f.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
          {/* Blue while it runs, green only when its last round passed */}
          {f.status === 'working' || (f.status === 'done' && ((_a = rounds.at(-1)) === null || _a === void 0 ? void 0 : _a.pass) !== false) ? <Box width={1} flexShrink={0} backgroundColor={f.status === 'working' ? FLOW : DONE}/> : <Box width={1} flexShrink={0}/>}
          <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
            <Box flexDirection="column">
              <Box height={1} overflow="hidden">
                <Text bold>{fitWords(f.title, boldRow)}</Text>
              </Box>
              <Box height={1} overflow="hidden">
                <Text dimColor>{flowGlance(f, perRow)}</Text>
              </Box>
            </Box>
            <Box flexDirection="column">
              <Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
                {squaresRow(f, rounds, "flow-squares-".concat(f.id))}
                <Text color={f.status === 'working' ? FLOW : word === 'Passed' ? DONE : undefined} dimColor={f.status !== 'working' && word !== 'Passed'}>
                  {fitWords(word, Math.max(6, perRow - squaresLetters))}
                </Text>
              </Box>
              <Box height={1} overflow="hidden">
                {outcomeRow(f, rounds, perRow)}
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Button key={"flow-open-".concat(f.id, "-").concat(presses)} label="Details" onPress={function () { return openFlow($, f.id); }}/>
              {f.status === 'working' && f.session === flowMine ? <Button key={"flow-stop-".concat(f.id)} label="Stop" onPress={function () { return void stopFlow($, f.id); }}/> : null}
              <Box flexGrow={1}/>
              {roundsLabel(f, rounds) ? (<Box flexShrink={0}>
                  <Text color={f.status === 'working' ? FLOW : undefined} dimColor={f.status !== 'working'}>
                    {roundsLabel(f, rounds)}
                  </Text>
                </Box>) : null}
            </Box>
          </Box>
        </Box>);
                    };
                    flowOpen = flowShown ? pickedOf(flowShown) : undefined;
                    workId = paneId === LIST ? '' : flowShown ? "".concat(flowShown.id, ":").concat((_k = flowOpen === null || flowOpen === void 0 ? void 0 : flowOpen.id) !== null && _k !== void 0 ? _k : '') : ((_m = (_l = __spreadArray(__spreadArray([], all, true), elsewhere, true).find(function (one) { return workPaneOf(one.id) === paneId; })) === null || _l === void 0 ? void 0 : _l.id) !== null && _m !== void 0 ? _m : '');
                    open = (_o = folds.get(workId)) !== null && _o !== void 0 ? _o : [];
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
          {side ? (<Box flexShrink={0}>
              <Text dimColor>{side}</Text>
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
                        var doing = one.items.filter(function (item) { return item.state === 'doing'; });
                        var waiting = one.items.filter(function (item) { return item.state === 'open'; });
                        var done = one.items.filter(function (item) { return item.state === 'done'; });
                        var dropped = one.items.filter(function (item) { return item.state === 'dropped'; });
                        var kept = one.items.length - dropped.length;
                        var where = isWorking ? now(one) : '';
                        var shownNext = open.includes(OPEN_NEXT) ? waiting : waiting.slice(0, NEXT_SHOWN);
                        var settled = [done.length ? "".concat(done.length, " done") : '', dropped.length ? "".concat(dropped.length, " dropped") : ''].filter(Boolean).join(' · ');
                        if (!one.items.length && !where)
                            return null;
                        return part('part-todos', 'To-dos', kept ? "".concat(done.length, " of ").concat(kept, " done") : '', <Box flexDirection="column" gap={1}>
          {doing.length || where ? (<Box key="doing" flexDirection="column">
              <Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
                {doing.length ? (doing.map(function (item, i) { return row("doing-".concat(i), isWorking ? live("live-doing-".concat(i)) : <Text dimColor>○</Text>, item, i === 0 && where ? cut(where, room) : ''); })) : (<Box flexDirection="row" alignItems="flex-start" gap={1}>
                    {live('live-where')}
                    <Box flexGrow={1} flexShrink={1} minWidth={0}>
                      <Text wrap="wrap">{cut(where, room)}</Text>
                    </Box>
                  </Box>)}
              </Box>
            </Box>) : null}
          {waiting.length ? (<Box key="next" flexDirection="column">
              <Text dimColor>Next</Text>
              {shownNext.map(function (item, i) { return row("next-".concat(i), <Text dimColor>○</Text>, item); })}
              {waiting.length > NEXT_SHOWN ? opener(OPEN_NEXT, open.includes(OPEN_NEXT) ? 'Fewer' : "".concat(waiting.length - NEXT_SHOWN, " more")) : null}
            </Box>) : null}
          {settled ? (<Box key="settled" flexDirection="column">
              {opener(OPEN_DONE, settled)}
              {open.includes(OPEN_DONE)
                                    ? __spreadArray(__spreadArray([], done, true), dropped, true).map(function (item, i) {
                                        return row("settled-".concat(i), <Text color={item.state === 'done' ? 'success' : undefined} dimColor>{item.state === 'done' ? '✓' : '✕'}</Text>, item);
                                    })
                                    : null}
            </Box>) : null}
        </Box>);
                    };
                    helpersPart = function (one) {
                        var under = underOf(all, one.id);
                        if (!under.length)
                            return null;
                        var running = under.filter(function (kid) { return kid.status === 'working'; }).length;
                        return part('part-helpers', 'Helpers', running ? "".concat(running, " at work \u00B7 ").concat(under.length, " in all") : "".concat(under.length, " in all"), <Box flexDirection="column">{twigsOf(branchesOf(all, one.id, function () { return true; })).map(function (t) { return twigRow(t, 'details'); })}</Box>);
                    };
                    talk = function (one, lines, shots) {
                        // The pictures a run of steps made, under its row whether it is open or not: each drawn small where the panel can, with
                        // a row under it that opens it whole in a window of its own, large enough to look at; one that is gone is named
                        var drawing = $.ui.resolve(e);
                        var picturesOfRun = function (block, at) {
                            var made = block.flatMap(function (line) { var _a, _b; return (_b = shots.get((_a = line.at) !== null && _a !== void 0 ? _a : -1)) !== null && _b !== void 0 ? _b : []; });
                            if (!made.length)
                                return null;
                            return (<Box key={"pics-".concat(at)} flexDirection="column" alignItems="flex-start" gap={1} width="100%">
            {made.map(function (pic, n) { return (<Box key={"pic-".concat(at, "-").concat(n)} flexDirection="column" alignItems="flex-start" width="100%">
                {pic.thumb && 'Svg' in drawing ? (<drawing.Svg key={"pic-svg-".concat(at, "-").concat(n)} source={pic.thumb.source} alt={"Picture: ".concat(pic.name)} {...(pic.thumb.height > PIC_TALL && pic.thumb.height > pic.thumb.width ? { height: PIC_TALL, width: Math.round((pic.thumb.width * PIC_TALL) / pic.thumb.height) } : {})}/>) : null}
                {pic.isGone ? (<Text dimColor wrap="wrap">{"Picture: ".concat(pic.name, " \u00B7 no longer kept")}</Text>) : (<Button key={"pic-open-".concat(at, "-").concat(n, "-").concat(presses)} label={"\u2922 ".concat(pic.thumb && e.surface !== 'terminal' ? 'Open large' : 'Open', ": ").concat(cut(pic.name, Math.max(12, room - 14)))} plain onPress={function () { return ((presses += 1), redraw($), void showPicture($, pic.path)); }}/>)}
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
                    theirChat = function (one, c) {
                        var id = one.id;
                        var s = otherChats.find(function (one) { return one.chat === c.id && one.host === c.host; });
                        var canOpen = Boolean(s && pressOf(s));
                        return (<Box flexDirection="column" gap={1}>
          <Text dimColor wrap="wrap">{"Its chat is shown in the panel of the chat \"".concat(chatName(c), "\"").concat(c.host ? " on ".concat(macName(c.host)) : '', ", which runs it.").concat(one.status === 'working' ? ' Stop it or move it to another model there.' : '')}</Text>
          {s && canOpen ? (<Box flexDirection="row">
              <Button key={"their-chat-".concat(id, "-").concat(presses)} label="Open that chat" onPress={function () { return void ((presses += 1), openChat($, s)); }}/>
            </Box>) : null}
        </Box>);
                    };
                    big = function (one, lines) {
                        var _a, _b;
                        var showing = lines ? newest(lines).length : 0;
                        var parent = one.parentId ? all.find(function (card) { return card.id === one.parentId; }) : undefined;
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
              {one.chat ? <Text dimColor wrap="wrap">{"From the chat \"".concat(chatName(one.chat), "\"").concat(chatSide(one.chat, selfName()) ? ", ".concat(chatSide(one.chat, selfName())) : '')}</Text> : null}
              {(one.status === 'working' && !one.chat) || left(one) ? (<Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {one.status === 'working' && !one.chat ? <Button key={"stop-".concat(one.id)} label="Stop" onPress={function () { return void stop($, one.id); }}/> : null}
                  {left(one) ? <Button key={"artifact-".concat(one.id, "-").concat(presses)} label="Its result" onPress={function () { var _a, _b; return void openReport($, (_b = (_a = left(one)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''); }}/> : null}
                </Box>) : null}
            </Box>
          </Box>
          {one.ask ? (<Box key="part-needs" flexDirection="row" backgroundColor={FILL} flexShrink={0}>
              <Box width={1} flexShrink={0} backgroundColor={NEEDS}/>
              <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
                <Text bold dimColor>Needs you now</Text>
                {askBlock(one, "ask-big-".concat(one.id), true)}
              </Box>
            </Box>) : sentLine(one, at) ? (<Box key="part-answered" flexDirection="row" backgroundColor={FILL} flexShrink={0} paddingX={2} paddingY={1}>
              <Text dimColor wrap="wrap">{sentLine(one, at)}</Text>
            </Box>) : null}
          {one.words ? askPart(one) : null}
          {todoPart(one)}
          {helpersPart(one)}
          {one.chat
                                ? part('part-chat', 'Its chat', '', theirChat(one, one.chat))
                                : part('part-chat', 'Its chat', lines && showing < lines.length ? "last ".concat(showing, " lines") : '', talks.has(one.id) ? talk(one, lines, (_b = (_a = shots.get(one.id)) === null || _a === void 0 ? void 0 : _a.shots) !== null && _b !== void 0 ? _b : new Map()) : <Text dimColor>Reading its chat…</Text>)}
        </Box>);
                    };
                    promptCard = function (p, key, where, c) { return (<Box key={"prompt-".concat(key)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
        <Box width={1} flexShrink={0} backgroundColor={NEEDS}/>
        <Box flexDirection="column" gap={1} paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
          <Box flexDirection="column">
            <Text bold wrap="truncate-end">{p.title || 'Needs your input'}</Text>
            <Text dimColor wrap="truncate-end">{where}</Text>
          </Box>
          <Text wrap="wrap" color={NEEDS} bold>{p.text}</Text>
          {c ? (<Box flexDirection="row">
              <Button key={"prompt-open-".concat(key, "-").concat(presses)} label="Open that chat" onPress={function () { return void ((presses += 1), openChat($, c).catch(function (err) { return log($, "chat not opened: ".concat(String(err))); })); }}/>
            </Box>) : null}
        </Box>
      </Box>); };
                    chatHead = function (key, name, side, c) {
                        var url = c ? pressOf(c) : '';
                        var label = <Text bold dimColor wrap="truncate-end">{name}</Text>;
                        return (<Box key={"chat-head-".concat(key)} flexDirection="column" paddingTop={1} flexShrink={0}>
          {/* One line whatever the name's length: cut short, never wrapped */}
          <Box flexDirection="row" alignItems="flex-start" gap={2} paddingX={2} height={1} overflow="hidden">
            <Box flexGrow={1} flexShrink={1} minWidth={0} height={1} overflow="hidden">
              {c && url ? (<Button key={"chat-open-".concat(key)} plain hover={{ underline: true }} onPress={function () { return void openChat($, c); }}>
                  {label}
                </Button>) : (label)}
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
                    listedChats = otherChats.filter(function (c) { var _a; return shownOf(c).length || ((_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length); });
                    finished = __spreadArray(__spreadArray([], own.filter(function (one) { return one.status !== 'working' && !isLingering(one, at); }), true), endedElsewhere, true).sort(function (a, b) { return b.endedAt - a.endedAt; });
                    finishedPart = function (isOpen) {
                        return finished.length || endedFlows.length ? (<Box key="finished" flexDirection="column" gap={1} flexShrink={0}>
          <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={FILL} paddingX={2} paddingY={1}>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-start">
              <Button key={"finished-fold-".concat(presses)} label={"".concat(isOpen ? '▾' : '▸', " Finished ").concat(finished.length + endedFlows.length)} plain onPress={function () { return void ((presses += 1), update($, view, function (v) { return (__assign(__assign({}, v), { isFinishedOpen: !v.isFinishedOpen })); })); }}/>
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
                    if (!paneId.startsWith(FLOW_PANE)) return [3 /*break*/, 19];
                    if (!flowShown)
                        return [2 /*return*/, <Text dimColor>This workflow is no longer kept.</Text>];
                    picked = pickedOf(flowShown);
                    if (!picked) return [3 /*break*/, 17];
                    return [4 /*yield*/, flowTalkOf($, flowShown, picked).catch(function () { return undefined; })];
                case 16:
                    _f = _p.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _f = undefined;
                    _p.label = 18;
                case 18:
                    lines = _f;
                    return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
          {flowBig(flowShown, picked, lines)}
        </Box>)];
                case 19:
                    alone = __spreadArray(__spreadArray([], all, true), elsewhere, true).find(function (one) { return one.id === workId; });
                    if (paneId !== LIST && !alone)
                        return [2 /*return*/, <Text dimColor>{paneId.startsWith("".concat(WORK_PANE, "r-")) ? 'This work has ended, or its chat is closed. Its chat keeps it.' : 'This work is no longer kept.'}</Text>
                            // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
                            // read, and a drawing that waits on it is never shown
                        ];
                    // Its chat and pictures are read outside the drawing, which draws at once from what was read last: a long chat takes seconds to
                    // read, and a drawing that waits on it is never shown
                    if (alone && !alone.chat)
                        void loadWork($, alone.id).catch(function () { return undefined; });
                    talked = alone ? talks.get(alone.id) : undefined;
                    return [4 /*yield*/, read($, reports)];
                case 20:
                    kept = _p.sent();
                    ui = $.ui.resolve(e);
                    runningThere = elsewhere.filter(function (one) { return one.status === 'working' && !one.ask; });
                    head = {
                        here: working.filter(function (one) { return !one.ask; }).length + runningFlows.length,
                        there: runningThere.length,
                        chats: new Set(runningThere.map(function (one) { var _a, _b; return "".concat((_a = one.chat) === null || _a === void 0 ? void 0 : _a.host, "/").concat((_b = one.chat) === null || _b === void 0 ? void 0 : _b.id); })).size,
                        asks: own.filter(function (one) { return one.ask; }).length + waiting.length + elsewhere.filter(function (one) { return one.ask; }).length + listedChats.reduce(function (n, c) { var _a, _b; return n + ((_b = (_a = c.prompts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); }, 0),
                        isDone: isHappy(own, at) || elsewhere.some(function (one) { return one.status === 'done' && lingers(one, at); }) || flowList.some(function (f) { var _a; return f.status === 'done' && isLingering(f, at) && ((_a = roundsOf(f).at(-1)) === null || _a === void 0 ? void 0 : _a.pass) !== false; }),
                    };
                    mood = headMood(head);
                    if (!alone) return [3 /*break*/, 21];
                    _g = { version: '', installed: '', isWaiting: false };
                    return [3 /*break*/, 23];
                case 21: return [4 /*yield*/, versionsOf($)];
                case 22:
                    _g = _p.sent();
                    _p.label = 23;
                case 23:
                    versions = _g;
                    if (!(alone || !versions.version)) return [3 /*break*/, 24];
                    _h = undefined;
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, updatedPieces($, versions.version)];
                case 25:
                    _h = _p.sent();
                    _p.label = 26;
                case 26:
                    updated = _h;
                    return [2 /*return*/, (<Box flexDirection="column" gap={1} minHeight={e.props.scroll.bodyRows}>
        {!alone ? (
                            // The mark and its lines across the whole width, so the chat's size is read whole; the buttons on a row of their own under
                            // them, which wraps onto a second row in a narrow pane rather than cutting anything off
                            <Box key="head" flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              {octopus(ui, 'head-mark', mood, HEAD_MARK, { asking: 'Claudopus, something needs you', happy: 'Claudopus, work finished', working: 'Claudopus at work', mark: 'Claudopus' }[mood])}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                {/* The version this chat loaded beside the name, and a newer one when the Mac has it, so two Macs on different ones are told apart */}
                <Box key="head-name" flexDirection="row" gap={1} minWidth={0}>
                  <Box flexShrink={0}>
                    <Text bold>Claudopus</Text>
                  </Box>
                  {/* Just moved to a newer version: it rolls to the new number and says Updated in blue for a moment */}
                  {updated ? versionLine(ui, updated) : versions.version ? <Text key="head-version" dimColor wrap="truncate-end">{"v".concat(versions.version).concat(versions.isWaiting ? " \u00B7 v".concat(versions.installed, " installed") : '')}</Text> : null}
                </Box>
                <Text dimColor={!head.asks} color={head.asks ? NEEDS : undefined} wrap="truncate-end">{headLine(head)}</Text>
                <Text dimColor wrap="truncate-end">{chat.tokens > 0 ? "This chat: ".concat(fill(chat.tokens, chat.window)) : 'This chat: just begun'}</Text>
              </Box>
            </Box>
            <Box key="head-buttons" flexDirection="row" flexWrap="wrap" gap={1}>
              {reportsButton($, ui, kept)}
              {statsButton($, ui)}
              {memoryButton($, ui)}
              {configButton($, ui)}
              {aboutButton($, ui)}
            </Box>
          </Box>) : null}
        {!alone ? afarPart(ui) : null}
        {!alone && isWelcomeOpen ? welcomeCard($, ui) : null}
        {alone
                                ? big(alone, talked === null || talked === void 0 ? void 0 : talked.lines)
                                : __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (listedChats.length && (shownWork.length || shownFlows.length || waiting.length) ? [chatHead('this', 'This chat', selfName() ? "on ".concat(selfName()) : '')] : []), true), waiting.map(function (p) { return promptCard(p, "this-".concat(p.id), 'Answer it in this chat'); }), true), __spreadArray(__spreadArray([], shownWork.map(function (one) { return ({ at: one.ask ? -1e15 + one.ask.at : one.startedAt, card: function () { return small(one); } }); }), true), shownFlows.map(function (f) { return ({ at: f.startedAt, card: function () { return flowSmall(f); } }); }), true).sort(function (a, b) { return a.at - b.at; }).map(function (one) { return one.card(); }), true), listedChats.flatMap(function (c) {
                                    var _a;
                                    var cards = shownOf(c).sort(function (a, b) { return (a.ask ? -1e15 + a.ask.at : a.startedAt) - (b.ask ? -1e15 + b.ask.at : b.startedAt); });
                                    // Open that chat whenever its link opens here: a chat of this Mac, or one of another Mac with Remote Control on
                                    // In a chat another Mac's app runs here, that Mac opens it
                                    var url = pressOf(c);
                                    var prompts = ((_a = c.prompts) !== null && _a !== void 0 ? _a : []).map(function (p) { return promptCard(p, "".concat(c.host, "-").concat(c.chat, "-").concat(p.id), c.host && !url ? "Answer it in that chat, on ".concat(macName(c.host)) : c.host ? "Answer it in that chat, which runs on ".concat(macName(c.host)) : 'Answer it in that chat', url ? c : undefined); });
                                    return __spreadArray(__spreadArray([chatHead("".concat(c.host, "-").concat(c.chat), chatName(c), chatSide(c, selfName()), c)], prompts, true), cards.map(function (one) { return small(one); }), true);
                                }), true)}
        {/* The Finished row sits at the pane's bottom edge, under everything else */}
        {!alone && (finished.length || endedFlows.length) ? <Box key="finished-gap" flexGrow={1}/> : null}
        {!alone ? finishedPart(isFinishedOpen) : null}
      </Box>)];
            }
        });
    }); });
};
