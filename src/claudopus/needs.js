// Everything that waits for the person: one record, one list of them for a card, and one drawing
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var NEED_LABEL = { permission: 'Permission', question: 'Question', password: 'Password', key: 'Key', disk: 'Disk space' };
// A task's own question, or the command Claude Code blocked it from running
var askNeed = function ($, one, surface, now) {
    var _a, _b;
    var ask = one.ask;
    if (!ask)
        return undefined;
    var id = "ask-".concat(one.id);
    var line = sentLine(one, now);
    var base = __assign(__assign(__assign(__assign({ id: id, at: ask.at, text: ask.text }, (ask.details ? { details: ask.details } : {})), (ask.copy ? { command: ask.copy } : {})), { card: one }), (line ? { line: line, wholeLine: sentLine(one, now, Infinity) } : {}));
    // Another chat's is answered only in its own chat: no file carries an answer there
    var elsewhere = one.chat ? "Answer it in its own chat, \u201C".concat(one.chat.title || 'another chat', "\u201D").concat(one.chat.host ? ", on ".concat(one.chat.host) : '', ".") : '';
    var inBar = repliesInBar(surface);
    if (ask.refused) {
        var run = offeredRun(one);
        var talk = talkText(ask.talk);
        // Words go to the task, which answers inside this block; only Allow runs the command
        var words = wordsOn($, "".concat(id, "-words"), one.id, inBar, isReplyOpen(one), { kind: 'answer', id: one.id, one: one }, function (value) { return void sendFromBar($, one.id, value).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); }); });
        // Answered in words: nothing to press while the task answers; Allow and Don't allow come back with its answer
        if (isActingOnReply(one))
            return __assign(__assign(__assign({}, base), (talk ? { details: [ask.details, talk].filter(Boolean).join('\n\n') } : {})), { kind: 'permission', isActing: true, buttons: [] });
        return __assign(__assign(__assign(__assign(__assign(__assign({}, base), (talk ? { details: [ask.details, talk].filter(Boolean).join('\n\n') } : {})), { kind: 'permission' }), (elsewhere ? { where: elsewhere } : {})), { buttons: elsewhere
                ? []
                : __spreadArray(__spreadArray(__spreadArray([], (run ? [{ key: "".concat(id, "-allow-").concat(ask.at, "-").concat(loadMark), label: ALLOW, onPress: function () { return void runIt($, one).catch(function (err) { return log($, "refused command not run: ".concat(String(err))); }); } }] : []), true), [
                    { key: "".concat(id, "-deny-").concat(ask.at, "-").concat(loadMark), label: DONT_ALLOW, onPress: function () { return void ((presses += 1), answerAsk($, one, DONT_ALLOW).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })); } }
                ], false), words.buttons, true) }), (elsewhere || !words.field ? {} : { field: words.field }));
    }
    if (isActingOnReply(one))
        return __assign(__assign({}, base), { kind: 'question', isActing: true, buttons: [] });
    if (elsewhere)
        return __assign(__assign({}, base), { kind: 'question', where: elsewhere, buttons: [] });
    var mark = askMark(ask);
    var send = function (value) { var _a; return void (value.trim() && (dropDrafts($, one.id), replies.set(one.id, ((_a = replies.get(one.id)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), answerAsk($, one, value, true).catch(function (err) { return log($, "reply not sent: ".concat(String(err))); }))); };
    return __assign(__assign(__assign({}, base), { kind: 'question', buttons: __spreadArray(__spreadArray([], ((_a = ask.choices) !== null && _a !== void 0 ? _a : []).map(function (choice, n) { return ({ key: "".concat(id, "-choice-").concat(n, "-").concat(mark, "-").concat(loadMark), label: choice, onPress: function () { return void ((presses += 1), answerAsk($, one, choice).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })); } }); }), true), (inBar ? [isReplyOpen(one) ? { key: "".concat(id, "-inbar-close-").concat(presses), label: 'Close', isPlain: true, isOpener: true, onPress: function (press) { return openBar($, undefined, press.surface); } } : { key: "".concat(id, "-inbar-").concat(presses), label: ANSWER_IN_WORDS, isPlain: true, isOpener: true, onPress: function (press) { return openBar($, { kind: 'answer', id: one.id, one: one }, press.surface); } }] : []), true) }), (inBar
        ? {}
        : {
            field: {
                key: "".concat(id, "-reply-").concat((_b = replies.get(one.id)) !== null && _b !== void 0 ? _b : 0, "-").concat(mark),
                placeholder: ANSWER_IN_WORDS,
                value: draftShown(one.id, ask),
                onInput: function (value) { return void (drafts.set(draftOf(one.id, ask), value), keepDraft($, draftOf(one.id, ask), value), holdTimes($)); },
                onSubmit: send,
            },
        }));
};
// What the person and the task said on a permission, under what it is about: the person's words, then the task's answer to them
var talkText = function (talk) {
    return (talk !== null && talk !== void 0 ? talk : []).map(function (one) { return (one.by === 'you' ? "**You asked:** ".concat(one.text) : "**The answer:** ".concat(one.text)); }).join('\n\n');
};
// Answer in words on a permission: the button that opens the box above the chat for it, or, where that bar draws no field (the
// terminal), the block's own field. What is typed goes to the task and allows nothing
var wordsOn = function ($, key, draft, inBar, isOpen, to, send) {
    var _a;
    return inBar
        ? { buttons: [isOpen ? { key: "".concat(key, "-close-").concat(presses), label: 'Close', isPlain: true, isOpener: true, onPress: function (press) { return openBar($, undefined, press.surface); } } : { key: "".concat(key, "-open-").concat(presses), label: ANSWER_IN_WORDS, isPlain: true, isOpener: true, onPress: function (press) { return openBar($, to, press.surface); } }] }
        : {
            buttons: [],
            field: {
                key: "".concat(key, "-field-").concat((_a = replies.get(draft)) !== null && _a !== void 0 ? _a : 0),
                placeholder: ANSWER_IN_WORDS,
                onInput: function () { return void holdTimes($); },
                onSubmit: function (value) { var _a; return void (value.trim() && (replies.set(draft, ((_a = replies.get(draft)) !== null && _a !== void 0 ? _a : 0) + 1), freeTimes($), send(value))); },
            },
        };
};
// What a release puts on main, in plain words: the task's own line for it, else that it gave none; the subjects of its commits; then
// how many commits and files, its branch and where from
var releaseAbout = function (gate) {
    var _a, _b, _c, _d, _e, _f;
    var count = ((_b = (_a = gate.commits) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + ((_c = gate.more) !== null && _c !== void 0 ? _c : 0);
    var commits = ((_d = gate.commits) === null || _d === void 0 ? void 0 : _d.length) ? __spreadArray(__spreadArray([], gate.commits.map(function (one) { return "- ".concat(one); }), true), (gate.more ? ["- and ".concat(gate.more, " more")] : []), true).join('\n') : '';
    var facts = [count ? "".concat(count, " ").concat(count === 1 ? 'commit' : 'commits') : '', gate.files ? "".concat(gate.files, " changed ").concat(gate.files === 1 ? 'file' : 'files') : '', "branch ".concat((_e = gate.branch) !== null && _e !== void 0 ? _e : ''), gate.folder ? "from ".concat(shortPath(gate.folder)) : '']
        .filter(Boolean)
        .join(' · ');
    return [(_f = gate.reason) !== null && _f !== void 0 ? _f : (commits ? 'Claude gave no reason for it. Its commits say:' : ''), commits, "".concat(facts.charAt(0).toUpperCase()).concat(facts.slice(1))].filter(Boolean).join('\n\n');
};
// A permission the admin gate holds: an admin command, a release, a change to a file of the person's, or one it undid
var gateNeed = function ($, gate, card, elsewhere, from, surface) {
    var _a;
    if (from === void 0) { from = ''; }
    if (surface === void 0) { surface = ''; }
    var id = "gate-".concat(gate.id);
    var isHeld = (gateHeld.has(gate.id) || gateParked.has(gate.id)) && !elsewhere;
    // Answered in words: in the task's purple with nothing to press while it answers, as an answered question is; its answer brings the buttons back
    var isActing = isHeld && isGateActing(gate);
    var about = gate.isUndone
        ? "".concat(gate.isOutside ? 'Something outside the panel changed this file, maybe you in an editor' : 'A command wrote to this file', ", so the change was undone. ").concat(ALLOW, " makes it again. Either way the changed text is kept beside the file as a .put-back copy.")
        : gate.kind === 'release'
            ? releaseAbout(gate)
            : gate.isWork
                ? "".concat(ALLOW, " also covers this task's next admin commands.")
                : !gate.command
                    ? 'Its details show only on its own Mac.'
                    : '';
    var details = [about, talkText(gate.talk)].filter(Boolean).join('\n\n');
    // Words on a task's own gate go to that task; the chat's own thread, and one Claudopus undid, have none to answer them
    var words = isHeld && card && !gate.isUndone ? wordsOn($, "".concat(id, "-words"), "gate:".concat(gate.id), repliesInBar(surface), isBarOpen('permission', gate.id), { kind: 'permission', id: gate.id }, function (value) { return void wordsOnGate($, card, gate.id, value); }) : undefined;
    return __assign(__assign(__assign(__assign(__assign(__assign(__assign({ id: id, kind: 'permission', at: gate.at, text: gateWhat(gate) }, (from ? { from: from } : {})), (details ? { details: details } : {})), (gate.kind !== 'release' && gate.command ? { command: gate.command } : {})), (isHeld ? {} : { where: elsewhere ? 'Allow it on its card in its own chat.' : "It's no longer waiting for you." })), (isActing ? { isActing: true } : {})), { buttons: isHeld && !isActing
            ? __spreadArray(__spreadArray([
                { key: "".concat(id, "-once-").concat(loadMark), label: ALLOW, onPress: function () { return answerGate($, gate, 'once', card); } },
                { key: "".concat(id, "-deny-").concat(loadMark), label: DONT_ALLOW, onPress: function () { return answerGate($, gate, 'deny', card); } }
            ], (gate.kind ? [] : [{ key: "".concat(id, "-always-").concat(loadMark), label: ALWAYS_ALLOW, isPlain: true, onPress: function () { return answerGate($, gate, 'always', card); } }]), true), ((_a = words === null || words === void 0 ? void 0 : words.buttons) !== null && _a !== void 0 ? _a : []), true) : [] }), ((words === null || words === void 0 ? void 0 : words.field) && !isActing ? { field: words.field } : {}));
};
// Claude Code's own prompt: a call to allow, answered here while this chat holds it; its question or its plan, answered in its own box
var promptNeed = function ($, p, c, isOnCard) {
    if (isOnCard === void 0) { isOnCard = false; }
    var id = "prompt-".concat(c ? "".concat(c.host, "-").concat(c.chat, "-") : 'this-').concat(p.id);
    var isHeld = !c && Boolean(p.isHeld) && promptHeld.has(p.id) && p.kind !== 'question' && p.kind !== 'plan';
    var url = c ? pressOf(c) : '';
    var where = c
        ? "Answer it in the chat \u201C".concat(chatName(c), "\u201D").concat(c.host ? (url ? ", which runs on ".concat(macName(c.host)) : ", on ".concat(macName(c.host))) : '', ".")
        : p.kind === 'question'
            ? 'Pick your answer in the box at the bottom of this chat.'
            : 'Answer it in the box at the bottom of this chat.';
    var press = function (said) { return function () { return void (answerPrompt($, p.id, said), redraw($)); }; };
    return __assign(__assign(__assign(__assign(__assign({ id: id, kind: p.kind === 'allow' || !p.kind ? 'permission' : 'question', at: p.at, text: p.text }, (isOnCard ? {} : { from: p.title || (c ? '' : 'This chat') })), (p.about ? { details: p.about } : {})), (p.detail ? { command: p.detail } : {})), (isHeld ? {} : { where: where })), { buttons: isHeld
            ? [
                { key: "".concat(id, "-yes-").concat(presses), label: ALLOW, onPress: press('yes') },
                { key: "".concat(id, "-no-").concat(presses), label: DONT_ALLOW, onPress: press('no') },
            ]
            : c && url
                ? [{ key: "".concat(id, "-open-").concat(presses), label: 'Open chat', isOpener: true, onPress: function () { return void ((presses += 1), openChat($, c).catch(function (err) { return log($, "chat not opened: ".concat(String(err))); })); } }]
                : [] });
};
// A password or key a command waits for: typed in the box above the chat, never in the panel, where that bar draws a field
var boxNeed = function ($, one, surface, canFocus) {
    var _a, _b, _c, _d, _e;
    if (canFocus === void 0) { canFocus = false; }
    var id = "box-".concat(one.id);
    var inBar = repliesInBar(surface);
    var isKey = one.kind === 'key';
    var mode = (_a = (inBar ? undefined : boxModes.get(one.id))) !== null && _a !== void 0 ? _a : 'key';
    var isOpen = Boolean(barOpen && isBoxKind(barOpen.kind) && barOpen.id === one.id);
    var close = { key: "".concat(id, "-close-").concat(boxPresses), label: 'Close', isPlain: true, isOpener: true, onPress: function (press) { return openBar($, undefined, press.surface); } };
    var refuse = { key: "".concat(id, "-cancel-").concat(boxPresses), label: isKey ? DONT_GIVE : DONT_ALLOW, onPress: function () { return void cancelBox($, one.id); } };
    // The admin command it is for, as the person allowed it; a key's command is the task's own and is not shown again
    var command = isKey ? '' : ((_d = (_c = adminCalls((_b = one.command) !== null && _b !== void 0 ? _b : '', $.plugin.root)[0]) === null || _c === void 0 ? void 0 : _c.command) !== null && _d !== void 0 ? _d : '');
    return __assign(__assign(__assign(__assign(__assign({ id: id, kind: one.kind, at: one.at, text: one.text, details: one.details }, (command ? { command: command } : {})), (boxSaid.get(one.id) && !isOpen ? { said: boxSaid.get(one.id) } : {})), (isOpen || !boxHeldReply.has(one.id) ? {} : { extra: function (ui) { return heldReplyButtons($, ui, one.id, 'box'); } })), { buttons: inBar
            ? isOpen
                ? [close, refuse]
                : __spreadArray([
                    { key: "".concat(id, "-paste-").concat(boxPresses), label: isKey && one.name ? PASTE_IT : TYPE_IT, isOpener: true, onPress: function (press) { return openBar($, { kind: barKindOf(one, 'key'), id: one.id }, press.surface); } },
                    refuse
                ], (isKey ? [{ key: "".concat(id, "-respond-").concat(boxPresses), label: ANSWER_IN_WORDS, isPlain: true, isOpener: true, onPress: function (press) { return openBar($, { kind: 'words', id: one.id }, press.surface); } }] : []), true)
            : __spreadArray([
                refuse
            ], (isKey ? [{ key: "".concat(id, "-mode-").concat(boxPresses), label: mode === 'reply' ? (one.name ? PASTE_IT : TYPE_IT) : ANSWER_IN_WORDS, isPlain: true, isOpener: true, onPress: function () { return void (boxModes.set(one.id, mode === 'reply' ? 'key' : 'reply'), boxHeldReply.delete(one.id), boxSaid.delete(one.id), (boxPresses += 1), drawAgain($)); } }] : []), true) }), (inBar
        ? {}
        : {
            field: __assign(__assign({ key: "".concat(id, "-field-").concat(mode === 'reply' ? 'reply-' : '').concat((_e = boxTries.get(one.id)) !== null && _e !== void 0 ? _e : 0), placeholder: mode === 'reply' ? 'Type your answer' : isKey && one.name ? 'Paste it here' : 'Type it here' }, (canFocus ? { isFocused: true } : {})), { onInput: function (value) { return void ((value ? boxTyped.add(one.id) : boxTyped.delete(one.id)), holdTimes($)); }, onSubmit: function (value) { return submitBox($, one.id, mode, value); } }),
        }));
};
// The needs of one card, in the order they came: its own question, the permissions held for its commands, and, for this chat's
// own cards, Claude Code's prompts for its calls and the password and key boxes of its commands
// The box whose field takes the keys where a block has its own (the terminal): this chat's own first request
var firstBox = function () { return __spreadArray(__spreadArray([], boxes.filter(function (box) { return box.chat === boxChat; }), true), boxes.filter(function (box) { return box.chat !== boxChat; }), true)[0]; };
var needsOf = function ($, one, surface, now, canFocus) {
    var _a;
    if (canFocus === void 0) { canFocus = false; }
    var ask = askNeed($, one, surface, now);
    var own = one.chat ? [] : __spreadArray(__spreadArray([], waiting.filter(function (p) { return p.card === one.id; }).map(function (p) { return promptNeed($, p, undefined, true); }), true), boxes.filter(function (box) { return box.card === one.id; }).map(function (box) { return boxNeed($, box, surface, canFocus && box === firstBox()); }), true);
    var gates = ((_a = one.admins) !== null && _a !== void 0 ? _a : []).filter(function (gate) { return !gatePressed.has(gate.id); }).map(function (gate) { return gateNeed($, gate, one.chat ? '' : one.id, Boolean(one.chat), '', surface); });
    return __spreadArray(__spreadArray(__spreadArray([], (ask ? [ask] : []), true), gates, true), own, true).sort(function (a, b) { return a.at - b.at; });
};
// The needs that belong to no card drawn here: the chat's own thread's, a task's whose card is not shown, and other chats' prompts
var looseNeeds = function ($, surface, shown, chats, canFocus) {
    if (canFocus === void 0) { canFocus = false; }
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], boxes.filter(function (box) { return !shown(box.card); }).map(function (box) { return boxNeed($, box, surface, canFocus && box === firstBox()); }), true), looseGates.filter(function (gate) { return !gatePressed.has(gate.id); }).map(function (gate) { return gateNeed($, gate, '', false, 'This chat'); }), true), waiting.filter(function (p) { return !shown(p.card); }).map(function (p) { return promptNeed($, p); }), true), chats.flatMap(function (c) { var _a; return ((_a = c.prompts) !== null && _a !== void 0 ? _a : []).map(function (p) { return promptNeed($, p, c); }); }), true), diskNeeds($), true).sort(function (a, b) { return a.at - b.at; });
};
// How many rows a block takes on a small card of `room` letters, reckoned high: what stands above a card's blocks is judged by it
// (panel.tsx, blocksSign), so a block above that grows, shrinks or goes marks the cards under it as moved under the pointer
var blockRowsOf = function (need, room) {
    var _a, _b, _c, _d;
    // (the letters of a row reckoned fewer than the card's own perRow, so a long line is never thought to take fewer rows than it does)
    var per = Math.max(20, Math.floor(room / 2.4));
    var lines = function (text, each) {
        if (each === void 0) { each = per; }
        return text.split('\n').reduce(function (n, line) { return n + Math.max(1, Math.ceil(line.length / each)); }, 0);
    };
    // In the desktop app's pixels, measured on its own renderer (19 Nov): a line of text BLOCK_LINE, a gap between parts BLOCK_GAP, a
    // row of buttons BLOCK_BUTTONS, the outline and its padding BLOCK_EDGE; a row of the card is BLOCK_ROW
    var details = need.details ? lines(need.details.length <= DETAILS_ON_CARD ? need.details : "".concat(cut(need.details, DETAILS_ON_CARD), "\n\nThe rest is in its Details.")) * BLOCK_LINE : 0;
    var pictures = Math.ceil(((_d = (_c = (_b = (_a = need.card) === null || _a === void 0 ? void 0 : _a.ask) === null || _b === void 0 ? void 0 : _b.pictures) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) / 2) * (ASK_PIC_TALL + BLOCK_LINE + 8);
    var command = need.command ? lines(need.command) * BLOCK_LINE + 16 : 0;
    var buttons = need.buttons.length ? Math.ceil(need.buttons.reduce(function (n, button) { return n + button.label.length + 6; }, 0) / (per * 1.4)) * BLOCK_BUTTONS : 0;
    var parts = [BLOCK_LINE, lines(cut(need.text, Math.round(room * 1.6)), Math.floor(per * 0.9)) * BLOCK_LINE, details, pictures, command, need.where ? lines(need.where) * BLOCK_LINE : 0, need.said ? lines(need.said) * BLOCK_LINE : 0, buttons, need.line ? BLOCK_LINE : 0].filter(Boolean);
    return Math.ceil((parts.reduce(function (n, part) { return n + part; }, 0) + (parts.length - 1) * BLOCK_GAP + BLOCK_EDGE) / BLOCK_ROW);
};
var BLOCK_LINE = 24;
var BLOCK_GAP = 12;
var BLOCK_BUTTONS = 44;
var BLOCK_EDGE = 26;
var BLOCK_ROW = 24;
// The one drawing: an outlined amber block; a small dim label of its kind; the question in amber; what it is about; the command
// in a row of its own, whole; then its buttons. `isWhole`: in Details, where nothing is cut. `pictures`: the question's own
// pictures, drawn by the pane (it keeps how much of them one drawing holds)
var needBlock = function ($, ui, need, opts) {
    var _a, _b, _c, _d;
    if (opts === void 0) { opts = {}; }
    var _e = opts.isWhole, isWhole = _e === void 0 ? false : _e, _f = opts.room, room = _f === void 0 ? 80 : _f;
    var one = need.card;
    var ask = one === null || one === void 0 ? void 0 : one.ask;
    var Link = ui.Link;
    var copyButton = one && (ask === null || ask === void 0 ? void 0 : ask.copy) && !ask.refused ? <ui.Button key={"ask-".concat(one.id, "-copy-").concat(presses)} label={copiedKey === one.id ? '✓ Copied' : 'Copy'} plain onPress={function (press) { var _a; return copyAsk($, one.id, (_a = ask.copy) !== null && _a !== void 0 ? _a : '', press.surface); }}/> : null;
    var terminalButton = one && ask && !ask.refused && canOpenTerminal(one) ? <ui.Button key={"".concat(need.id, "-terminal-").concat(presses)} label={openedKey === "".concat(one.id, ":").concat(ask.at, ":").concat(ask.copy) ? '✓ Typed, not run yet' : 'Open in Terminal'} plain onPress={function () { return void openTerminal($, one).catch(function (err) { return log($, "terminal not opened: ".concat(String(err))); }); }}/> : null;
    return squareOutline(ui.Box, opts.isCompact ? undefined : need.isActing ? LIVE : NEEDS, "need-outline-".concat(need.id), (
    // (compact, in the terminal's bar above the prompt, which has a few rows: no outline and no gaps)
    <ui.Box key={"need-".concat(need.id)} flexDirection="column" flexShrink={0} {...(opts.isCompact ? {} : { gap: 1, paddingX: 1, paddingY: 1 })}>
      <ui.Text dimColor wrap="truncate-end">{"".concat(NEED_LABEL[need.kind]).concat(need.from ? " \u00B7 ".concat(need.from) : '')}</ui.Text>
      {/* Whole in Details; on the small card cut at a word, with a mark, where the card has no room for it */}
      <ui.Text wrap="wrap" color={need.isActing ? LIVE : NEEDS} bold>{withLinks(Link, isWhole ? need.text : cut(need.text, Math.round(room * 1.6)), "".concat(need.id, "-text"), need.text)}</ui.Text>
      {/* What it is about, under its question: whole in Details, and on the small card up to DETAILS_ON_CARD */}
      {need.details ? (<ui.Box key={"".concat(need.id, "-details")} flexDirection="column" minWidth={0}>
          <ui.Markdown text={isWhole || need.details.length <= DETAILS_ON_CARD ? need.details : "".concat(cut(need.details, DETAILS_ON_CARD), "\n\nThe rest is in its Details.")}/>
        </ui.Box>) : null}
      {(_a = opts.pictures) !== null && _a !== void 0 ? _a : null}
      {need.command ? (<ui.Box flexDirection="column" backgroundColor={FILL} paddingLeft={2}>
          <ui.Box flexDirection="row" alignItems="center" gap={1}>
            <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
              <ui.Text mono wrap="wrap">{withLinks(Link, need.command, "".concat(need.id, "-copy"))}</ui.Text>
            </ui.Box>
            {/* A question's code or command is copied with one press */}
            {copyButton && !terminalButton ? copyButton : null}
          </ui.Box>
          {/* A command to type also opens in Terminal, typed and not run: with it, the two are under the command, which keeps its width */}
          {terminalButton ? (<ui.Box flexDirection="row" gap={1}>
              {copyButton}
              {terminalButton}
            </ui.Box>) : null}
        </ui.Box>) : null}
      {need.where ? <ui.Text key={"".concat(need.id, "-where")} dimColor wrap="wrap">{need.where}</ui.Text> : null}
      {need.said ? <ui.Text key={"".concat(need.id, "-said")} color={NEEDS} wrap="wrap">{need.said}</ui.Text> : null}
      {(_c = (_b = need.extra) === null || _b === void 0 ? void 0 : _b.call(need, ui)) !== null && _c !== void 0 ? _c : null}
      {/* The one field a block keeps where the bar above the chat draws none */}
      {need.field && 'Input' in ui ? (<ui.Box width="100%" flexDirection="column">
          <ui.Input key={need.field.key} placeholder={need.field.placeholder} {...(need.field.value === undefined ? {} : { value: need.field.value })} {...(opts.surface === 'terminal' ? {} : { rows: BOX_ROWS })} submitLabel="Send" autoFocus={opts.autoFocus || need.field.isFocused ? true : undefined} onInput={need.field.onInput} onSubmit={need.field.onSubmit}/>
        </ui.Box>) : null}
      {need.buttons.length ? (<ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
          {need.buttons.map(function (button, n) { return (<ui.Button key={button.key} label={button.label} {...(button.isPlain ? { plain: true } : n === 0 ? { variant: 'primary' } : {})} {...(button.hotkey ? { hotkey: button.hotkey } : {})} 
            // A press on the list's small card just after the card moved under the pointer does nothing, and says so (isMovedUnder)
            onPress={opts.isMoving && one
                    ? function (press) {
                        if (isMovedUnder(one.id))
                            return void (movedPresses.set(need.id, need.at), drawAgain($));
                        movedPresses.delete(need.id);
                        button.onPress(press);
                    }
                    : button.onPress}/>); })}
        </ui.Box>) : null}
      {/* Under its buttons, so the one pressed stays where it is: a press held back as the block moved under the pointer */}
      {opts.isMoving && movedPresses.get(need.id) === need.at ? <ui.Text key={"".concat(need.id, "-moved")} color={NEEDS} wrap="wrap">{MOVED_SAID}</ui.Text> : null}
      {/* What was last pressed or typed for it, while it is still there: a reply that left it open, an answer that did not go */}
      {need.line ? <ui.Text key={"".concat(need.id, "-sent")} dimColor wrap={isWhole ? 'wrap' : 'truncate-end'}>{isWhole ? ((_d = need.wholeLine) !== null && _d !== void 0 ? _d : need.line) : need.line}</ui.Text> : null}
    </ui.Box>));
};
