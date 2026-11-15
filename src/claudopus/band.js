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
var waitMarker = function ($, ui, surface) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = waitsAtTop > 0 && ((_b = listOffsets.get(surface)) !== null && _b !== void 0 ? _b : 0) > 0;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 1:
                _a = (_c.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
                _c.label = 2;
            case 2: return [2 /*return*/, _a ? (<ui.Box key="band-waits" flexDirection="row" flexShrink={0} height={1} overflow="hidden">
      <ui.Button key={"band-waits-".concat(presses)} plain hover={{ scope: 'band-waits', underline: true }} onPress={function () { return ((presses += 1), void $.ui.scroll({ in: LIST, to: 'start', block: 'start' }).catch(function () { return undefined; })); }}>
        <ui.Text color={NEEDS} bold wrap="truncate-end">{"\u2191 ".concat(waitsAtTop === 1 ? '1 waits' : "".concat(waitsAtTop, " wait"), " for you at the top of the panel")}</ui.Text>
      </ui.Button>
    </ui.Box>) : null
                // The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
            ];
        }
    });
}); };
// The cells the small octopus takes in the terminal (six dots wide, three braille cells), before the figures
var BAND_TERM_MARK = 3;
var bandHooks = function (on) {
    // Above the prompt, while work runs: a small mark that it does, and how Claude uses the computer, never what the work is doing
    on('ui.render', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var cards, working, happy, _a, _b, ui, Box, Button, Text, asking, first_1, ask_1, answers, id_1, picked_1, press_1, _c, _d, _e, _f, isPanelAway, _g, figures, _h, marker, drawn, row;
        var _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    if (e.props.hasSurvey)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    cards = _q.sent();
                    working = cards.filter(function (one) { return !one.parentId && one.status === 'working'; });
                    _a = isHappy;
                    _b = [cards];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    happy = _a.apply(void 0, _b.concat([_q.sent()]));
                    if (!happy) return [3 /*break*/, 4];
                    return [4 /*yield*/, read($, tick)];
                case 3:
                    _q.sent();
                    _q.label = 4;
                case 4:
                    ui = uiOf($, e);
                    Box = ui.Box, Button = ui.Button, Text = ui.Text;
                    if (!(e.surface === 'terminal')) return [3 /*break*/, 9];
                    asking = __spreadArray([], cards.filter(function (one) { return !one.parentId && one.ask; }), true).sort(function (a, b) { return Number(needsPerson(b)) - Number(needsPerson(a)); });
                    first_1 = asking[0];
                    ask_1 = first_1 === null || first_1 === void 0 ? void 0 : first_1.ask;
                    if (!(first_1 && ask_1)) return [3 /*break*/, 9];
                    answers = (((_j = ask_1.choices) === null || _j === void 0 ? void 0 : _j.length) ? ask_1.choices : DEFAULT_ANSWERS).slice(0, 9);
                    id_1 = "".concat(first_1.id, ":").concat(ask_1.at);
                    picked_1 = (bandPick === null || bandPick === void 0 ? void 0 : bandPick.id) === id_1 ? bandPick.n : -1;
                    press_1 = function (n, choice) {
                        if (picked_1 === n)
                            return (bandPick = undefined), void answerAsk($, first_1, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); });
                        var pick = (bandPick = { id: id_1, n: n });
                        $.ui.invalidate('ui.render');
                        // Left alone, the pick is let go
                        $.clock.after(BAND_PICK, function () { return void (bandPick === pick && ((bandPick = undefined), $.ui.invalidate('ui.render'))); });
                    };
                    return [4 /*yield*/, waitMarker($, ui, e.surface)];
                case 5:
                    if (!isActingOnReply(first_1)) return [3 /*break*/, 7];
                    _d = "    ".concat;
                    _e = sentLine;
                    _f = [first_1];
                    return [4 /*yield*/, $.clock.now()];
                case 6:
                    _c = (<Text key="band-ask-replied" dimColor wrap="truncate-end">{_d.apply("    ", [_e.apply(void 0, _f.concat([_q.sent()])) || "\u2713 You replied \u201C".concat(cut((_l = (_k = ask_1.replied) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : '', 60), "\u201D")])}</Text>);
                    return [3 /*break*/, 8];
                case 7:
                    _c = (<Box flexDirection="column">
                {/* The chat's notice with what it is about went only to the chat that started the work */}
                {ask_1.details ? <Text key="band-ask-details" dimColor wrap="truncate-end">{cards.includes(first_1) ? '    What it is about is in the chat above and on its card' : '    What it is about is on its card'}</Text> : null}
                {ask_1.copy ? <Text key="band-ask-copy" wrap="truncate-end">{"    ".concat(oneLine(ask_1.copy))}</Text> : null}
                <Box flexDirection="row" flexWrap="wrap" columnGap={3} paddingLeft={4}>
                  {answers.map(function (choice, n) { return (<Button key={"band-ask-".concat(first_1.id, "-").concat(ask_1.at, "-").concat(n)} label={choice} plain hotkey={String(n + 1)} onPress={function () { return press_1(n, choice); }}/>); })}
                  <Text dimColor={picked_1 < 0} color={picked_1 < 0 ? undefined : needsPerson(first_1) ? NEEDS : LIVE}>
                    {picked_1 >= 0 ? "Press ".concat(picked_1 + 1, " again to answer \u201C").concat((_m = answers[picked_1]) !== null && _m !== void 0 ? _m : '', "\u201D") : "press its number twice in the empty prompt".concat(asking.filter(needsPerson).length > Number(needsPerson(first_1)) ? " \u00B7 ".concat(asking.filter(needsPerson).length - Number(needsPerson(first_1)), " more waiting") : '', " \u00B7 /claudopus to reply in words")}
                  </Text>
                </Box>
              </Box>);
                    _q.label = 8;
                case 8: return [2 /*return*/, (<Box flexDirection="column">
            {_q.sent()}
            <Box flexDirection="row" gap={1}>
              {octopus(ui, 'band-mark', needsPerson(first_1) ? 'asking' : 'workingSmall', BAND_MARK, needsPerson(first_1) ? 'Claudopus, something needs you' : 'Claudopus at work on your reply', $, { surface: e.surface, requestId: e.requestId })}
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
                case 9:
                    if (!(!working.length && !happy)) return [3 /*break*/, 11];
                    return [4 /*yield*/, waitMarker($, ui, e.surface)];
                case 10: return [2 /*return*/, (_o = (_q.sent())) !== null && _o !== void 0 ? _o : next(e)
                    // A narrow terminal seats no panel until it is asked for: the band says how
                ];
                case 11:
                    _g = e.surface === 'terminal';
                    if (!_g) return [3 /*break*/, 13];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 12:
                    _g = !(_q.sent()).some(function (pane) { return pane.id === LIST && pane.isPlaced; });
                    _q.label = 13;
                case 13:
                    isPanelAway = _g;
                    // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                    // network's speed, looked at every few seconds while work runs. New figures redraw it
                    return [4 /*yield*/, read($, figuresAt)];
                case 14:
                    // How Claude uses this computer: memory in use and Claude's part, how busy the processor is and Claude's part, the disk's and the
                    // network's speed, looked at every few seconds while work runs. New figures redraw it
                    _q.sent();
                    _h = usageNow;
                    return [4 /*yield*/, $.clock.now()];
                case 15:
                    figures = _h.apply(void 0, [_q.sent()]);
                    if (!figures)
                        void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                    return [4 /*yield*/, waitMarker($, ui, e.surface)];
                case 16:
                    marker = _q.sent();
                    drawn = figures && e.surface !== 'terminal' ? usageDrawn(ui, figures) : null;
                    row = (<Box key="band-row" flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {(_p = octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work', $, { surface: e.surface, requestId: e.requestId })) !== null && _p !== void 0 ? _p : <Text dimColor>•••</Text>}
        {figures ? (drawn !== null && drawn !== void 0 ? drawn : <Box flexShrink={1} minWidth={0}>{usageText(ui, figures, e.surface === 'terminal' ? e.props.bodyColumns - BAND_TERM_MARK - 1 : Infinity)}</Box>) : null}
        {/* The figures fill a phone's terminal: the hint shows until they come */}
        {isPanelAway && !figures ? (<Box flexShrink={0}>
            <Text dimColor>· /claudopus shows the panel</Text>
          </Box>) : null}
      </Box>);
                    // Where the figures are drawn, a pointer resting on one shows its card above them; the bar grows upward, so the figures stay put
                    return [2 /*return*/, (drawn && figures) || marker ? (<Box flexDirection="column">
        {marker}
        {drawn && figures ? usageCardsDrawn(ui, figures) : null}
        {row}
      </Box>) : (row)];
            }
        });
    }); });
};
