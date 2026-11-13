// The chat's own life: its start and end, each message and reply, compaction, and what it is told
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
// How full this chat's context is, against the window the app's own panel measures it by
var measure = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var context, window;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.session.usage({ breakdown: 'summary' }).catch(function () { return undefined; })];
            case 1:
                context = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.context;
                window = (_c = (_b = context === null || context === void 0 ? void 0 : context.breakdown) === null || _b === void 0 ? void 0 : _b.rawMaxTokens) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.window;
                return [2 /*return*/, update($, me, function (one) { var _a; return (__assign(__assign({}, one), { tokens: (_a = context === null || context === void 0 ? void 0 : context.tokens) !== null && _a !== void 0 ? _a : one.tokens, window: window !== null && window !== void 0 ? window : one.window })); })];
        }
    });
}); };
// ---- After each reply: the size, the answer, the asks and the title ----
var afterReply = function ($, text, answer) { return __awaiter(_this, void 0, void 0, function () {
    var title, m, isRelay, r, lines, asks, named;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, measure($)];
            case 1:
                _c.sent();
                return [4 /*yield*/, appTitle($)];
            case 2:
                title = _c.sent();
                return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { title: title || one.title })); })
                    // A server is looked for while the chat that started it is still above it
                ];
            case 3:
                m = _c.sent();
                // A server is looked for while the chat that started it is still above it
                return [4 /*yield*/, scanServers($).catch(function (err) { return log($, "servers not read: ".concat(String(err))); })
                    // What Claude answered is kept beside what the person said, so a search finds what happened as well as what was asked
                ];
            case 4:
                // A server is looked for while the chat that started it is still above it
                _c.sent();
                if (!answer.trim()) return [3 /*break*/, 6];
                return [4 /*yield*/, appendWords($, m.id, "### Claude ".concat(new Date().toISOString(), "\n").concat(answer.trim(), "\n\n")).catch(function (err) { return log($, "answer not saved: ".concat(String(err))); })];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                isRelay = !text.trim();
                if (isRelay && answer.trim().length < 200)
                    return [2 /*return*/];
                return [4 /*yield*/, $.model.complete({
                        model: 'sonnet',
                        system: ASKS_SYSTEM,
                        prompt: "Current title: ".concat(m.title || '(none)', "\n\nUser message:\n\"\"\"\n").concat(isRelay ? '(none: this reply relays the result of a background agent)' : clip(text, 3000), "\n\"\"\"\n\nAssistant reply (shortened):\n\"\"\"\n").concat(clip(answer, isRelay ? 1500 : 600), "\n\"\"\""),
                        maxTokens: 500,
                    })];
            case 7:
                r = _c.sent();
                if (!r.isAnswered)
                    return [2 /*return*/];
                lines = r.text.split('\n').map(function (line) { return line.trim(); });
                asks = lines.filter(function (line) { return line.startsWith('- ') || /^did:/i.test(line); });
                if (!asks.length) return [3 /*break*/, 9];
                return [4 /*yield*/, appendAsks($, m.id, "## ".concat(new Date().toISOString(), "\n").concat(asks.join('\n'), "\n\n"))];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                named = (_b = (_a = lines.find(function (line) { return /^title:/i.test(line); })) === null || _a === void 0 ? void 0 : _a.replace(/^title:\s*/i, '').trim()) !== null && _b !== void 0 ? _b : '';
                if (!(named && named !== m.title && named.length <= 80)) return [3 /*break*/, 11];
                return [4 /*yield*/, $.mcp
                        .call('ccd_session_mgmt', 'set_session_title', { session_id: 'self', title: named })
                        .then(function () { return update($, me, function (one) { return (__assign(__assign({}, one), { title: named })); }); })
                        .catch(function () { return undefined; })];
            case 10:
                _c.sent();
                _c.label = 11;
            case 11: return [2 /*return*/];
        }
    });
}); };
var chatHooks = function (on) {
    on('session.start', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var begun, home, _i, _a, _b, art, file, text, _c, id, title, isNew, isRunning, choice, _d, _e, _f, now, last, _g, _h, _j, _k, one, seconds, _l;
        var _this = this;
        var _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
                    lastSeen = undefined;
                    // and reads its own copy's version again
                    loadedVersion = undefined;
                    return [4 /*yield*/, next(e)];
                case 1:
                    begun = _o.sent();
                    return [4 /*yield*/, $.env.get('HOME')];
                case 2:
                    home = (_m = (_o.sent())) !== null && _m !== void 0 ? _m : '';
                    dir = "".concat(home, "/.claude/claudopus");
                    // A load that moved this chat to a newer version has the header say so
                    return [4 /*yield*/, noteLoaded($).catch(function (err) { return log($, "version moved not looked at: ".concat(String(err))); })];
                case 3:
                    // A load that moved this chat to a newer version has the header say so
                    _o.sent();
                    _i = 0, _a = Object.entries(ART_FILES);
                    _o.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    _b = _a[_i], art = _b[0], file = _b[1];
                    return [4 /*yield*/, readOr($, "".concat($.plugin.root, "/art/").concat(file))];
                case 5:
                    text = _o.sent();
                    ART[art] = text.slice(Math.max(0, text.indexOf('<svg')));
                    _o.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    ART.asking = ART.wave.replaceAll('#8A63F0', NEEDS);
                    cwd = e.cwd;
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 8:
                    if (!(_o.sent()).length) return [3 /*break*/, 10];
                    _c = 1;
                    return [4 /*yield*/, $.clock.now()];
                case 9:
                    presses = _c + ((_o.sent()) % 1000000000) * 1000;
                    _o.label = 10;
                case 10: return [4 /*yield*/, loadSettings($)
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                ];
                case 11:
                    _o.sent();
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    return [4 /*yield*/, closeUndrawn($)];
                case 12:
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    _o.sent();
                    $.clock.after(3000, function () { return closeUndrawn($); });
                    return [4 /*yield*/, $.session.id()];
                case 13:
                    id = _o.sent();
                    return [4 /*yield*/, appTitle($)
                        // The first load of a session sends the role text; a reload keeps what stands
                    ];
                case 14:
                    title = _o.sent();
                    // The first load of a session sends the role text; a reload keeps what stands
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { id: id, title: title !== null && title !== void 0 ? title : m.title, needsContext: m.id ? m.needsContext : true })); })
                        // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                        // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    ];
                case 15:
                    // The first load of a session sends the role text; a reload keeps what stands
                    _o.sent();
                    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })];
                case 16:
                    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'update',
                            description: 'Records a subject of work in the memory index: creates it, or changes the fields given. `brief` rewrites its one-page brief.',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    repo: { type: 'string', description: 'The folder the work happens in' },
                                    state: { type: 'string', description: 'Where it stands, in at most six words; start with "done" once it is pushed or deployed. Detail goes in the brief' },
                                    summary: { type: 'string', description: 'One line on what the subject is for' },
                                    brief: { type: 'string' },
                                },
                                required: ['name'],
                            },
                            isDeferred: false,
                        })];
                case 17:
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'recall',
                            description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, subject briefs, pastes, and the results finished work left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
                            inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
                            isDeferred: false,
                        })];
                case 18:
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'todo',
                            description: named('For background work: keeps the to-dos under your piece of work in the panel {name} reads beside the chat. Adds `item`, or changes one already listed: `state` marks it as the one you are doing now, ticks it done or marks it dropped; `was` gives its earlier wording when you reword it. List each thing you set out to do, mark the one you are on as doing, and change the list first when {name} steers.'),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    item: { type: 'string', description: named('The to-do in a few plain words, as {name} would say it') },
                                    state: { type: 'string', enum: ['open', 'doing', 'done', 'dropped'] },
                                    was: { type: 'string', description: 'The earlier wording of an item that is being reworded' },
                                },
                                required: ['item'],
                            },
                            isDeferred: false,
                        })];
                case 19:
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'note',
                            description: named('For background work: says where your work stands now, on its card in the panel {name} reads beside the chat. It replaces the line before it. Write it when you start, and again whenever what is true has changed: what is done so far and what you are doing, in one short plain sentence of at most 20 words, in the first person, speaking to {name} as "you", with no file names, commands or code.'),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string' },
                                    task: { type: 'string', description: named('Only after a message from {name} that is a new task of its own, which you do not do: the ask in one line. The chat starts it as its own piece of work') },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 20:
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'ask',
                            description: named("For background work: when a step needs {name}'s own hands now (a code to paste, a box to fill, a key or a button to press), says so on your card, which stands out at the top of the panel with the ask in view and a Copy button for the exact text, and tells {name}. `text` says what to do, in one plain line; `copy` is only for text {name} must paste somewhere else (a one-time code, a token name, a link to open), never the instructions themselves; `choices` are buttons {name} answers with, such as Approve and Not now, for a go-ahead you need (without them the card offers Done and Not now); {name} can always reply in their own words instead; `command` is a command {name} types themselves, shown with a button that opens a terminal with it typed when they press it: open none yourself. The ask stays until {name} answers, even after you finish. An answer clears it and arrives as a message at your next step; carry on meanwhile with what does not depend on it, or end saying what you wait for, and the answer comes back through the chat. Ask again if the answer leaves something waiting. Call it again with empty `text` only once you have seen it done."),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
                                    copy: { type: 'string', description: 'Only text they must paste somewhere else, such as a one-time code or a link; leave it out when they only read or press something' },
                                    choices: { type: 'array', items: { type: 'string' }, description: 'Answers to press, such as Approve and Not now (Done and Not now when left out); the one pressed comes back to you as a message' },
                                    command: { type: 'string', description: 'A command for them to type themselves, one line, shown with a Copy button and a button that opens a terminal with it typed, never run' },
                                    cwd: { type: 'string', description: 'The folder the command runs in, a full path; the chat\'s folder when left out' },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 21:
                    _o.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'waits',
                            description: named("For background work, before it finishes: records what in its report waits on {name}, each one short line {name} can answer yes or no. The panel shows each with Yes / No / Not now. Only what needs {name}'s own decision or hands; not what you could do yourself, and not what you did not check. It replaces what was recorded before; leave it uncalled when nothing waits."),
                            inputSchema: {
                                type: 'object',
                                properties: { items: { type: 'array', items: { type: 'string' }, description: 'Each a question of at most 140 characters, in plain words, speaking to them as "you"' } },
                                required: ['items'],
                            },
                            isDeferred: false,
                        })];
                case 22:
                    _o.sent();
                    return [4 /*yield*/, $.command.register({ name: 'claudopus', description: 'Show the to-dos of this chat: what I asked for, what was done and decided, and each answer' })];
                case 23:
                    _o.sent();
                    return [4 /*yield*/, $.command.register({ name: 'servers', description: 'Show the servers running on this Mac, with a link to each and which chat started it' })];
                case 24:
                    _o.sent();
                    void $.ui.close({ id: OLD_PANE }).catch(function () { return undefined; });
                    return [4 /*yield*/, $.fs.exists("".concat(dir, "/index.md"))];
                case 25:
                    isNew = !(_o.sent());
                    if (!isNew) return [3 /*break*/, 27];
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/index.md"), INDEX_HEAD)];
                case 26:
                    _o.sent();
                    _o.label = 27;
                case 27: return [4 /*yield*/, settleWelcome($, isNew, id).catch(function (err) { return log($, "welcome not settled: ".concat(String(err))); })];
                case 28:
                    _o.sent();
                    return [4 /*yield*/, measure($).catch(function () { return undefined; })];
                case 29:
                    _o.sent();
                    return [4 /*yield*/, loadFinished($).catch(function (err) { return log($, "finished work not read: ".concat(String(err))); })];
                case 30:
                    _o.sent();
                    void recoverEnded($).catch(function (err) { return log($, "ended work not read back: ".concat(String(err))); });
                    return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 31:
                    _o.sent();
                    return [4 /*yield*/, loadReports($).catch(function () { return undefined; })
                        // Work that is running when the chat loads brings the panel up, if it has never opened
                        // and comes back after a reload of the mod (which closes it) if it was open or work is running
                        // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
                    ];
                case 32:
                    _o.sent();
                    return [4 /*yield*/, read($, todos)];
                case 33:
                    isRunning = (_o.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                    panelSeen = '';
                    return [4 /*yield*/, followPanel($).catch(function () { return undefined; })];
                case 34:
                    choice = _o.sent();
                    if (!(!choice && (isRunning || isWelcomeOpen))) return [3 /*break*/, 36];
                    return [4 /*yield*/, openList($)];
                case 35:
                    _o.sent();
                    _o.label = 36;
                case 36:
                    _e = !choice;
                    if (!_e) return [3 /*break*/, 38];
                    return [4 /*yield*/, read($, paneShown)];
                case 37:
                    _e = ((_o.sent()) || isRunning);
                    _o.label = 38;
                case 38:
                    _d = _e;
                    if (!_d) return [3 /*break*/, 40];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 39:
                    _d = !(_o.sent()).some(function (pane) { return pane.id === LIST; });
                    _o.label = 40;
                case 40:
                    if (!_d) return [3 /*break*/, 42];
                    return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE }).catch(function (err) { return log($, "panel not opened again: ".concat(String(err))); })
                        // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
                        // open in every chat from now on
                    ];
                case 41:
                    _o.sent();
                    _o.label = 42;
                case 42:
                    _f = !choice;
                    if (!_f) return [3 /*break*/, 44];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 43:
                    _f = (_o.sent()).some(function (pane) { return pane.id === LIST; });
                    _o.label = 44;
                case 44:
                    if (!_f) return [3 /*break*/, 46];
                    return [4 /*yield*/, choosePanel($, true)];
                case 45:
                    _o.sent();
                    _o.label = 46;
                case 46:
                    $.clock.every(PANEL_EVERY, function () { return followPanel($).catch(function (err) { return log($, "panel not followed: ".concat(String(err))); }); });
                    $.clock.every(FOLLOW_EVERY, function () { return follow($).catch(function (err) { return log($, "work not followed: ".concat(String(err))); }); });
                    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
                    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
                    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
                    lingerSet.clear();
                    return [4 /*yield*/, $.clock.now()
                        // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
                    ];
                case 47:
                    now = _o.sent();
                    return [4 /*yield*/, read($, lastDrawn)];
                case 48:
                    last = _o.sent();
                    lateFrom.clear();
                    _g = 0;
                    _j = [[]];
                    return [4 /*yield*/, read($, flows)];
                case 49:
                    _k = [__spreadArray.apply(void 0, _j.concat([(_o.sent()), true]))];
                    return [4 /*yield*/, read($, todos)];
                case 50:
                    _h = __spreadArray.apply(void 0, _k.concat([(_o.sent()).filter(function (card) { return !card.parentId; }), true]));
                    _o.label = 51;
                case 51:
                    if (!(_g < _h.length)) return [3 /*break*/, 53];
                    one = _h[_g];
                    if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE)
                        lateFrom.set("".concat(one.id, ":").concat(one.endedAt), Infinity);
                    _o.label = 52;
                case 52:
                    _g++;
                    return [3 /*break*/, 51];
                case 53:
                    seconds = 0;
                    $.clock.every(1000, function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, isFlowing, _b, _c, _d, now, _loop_1, _i, _e, _f, _g, one;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    _a = drawnNow;
                                    return [4 /*yield*/, read($, lastDrawn)];
                                case 1:
                                    if (!(_a > (_h.sent()))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, update($, lastDrawn, function () { return drawnNow; })];
                                case 2:
                                    _h.sent();
                                    _h.label = 3;
                                case 3: return [4 /*yield*/, shareMine($).catch(function (err) { return log($, "work not shared: ".concat(String(err))); })];
                                case 4:
                                    _h.sent();
                                    if (!(seconds % 2 === 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, lookForStarted($).catch(function (err) { return log($, "running commands not looked at: ".concat(String(err))); })];
                                case 5:
                                    _h.sent();
                                    _h.label = 6;
                                case 6:
                                    if (!((seconds += 1) % (LOOK_EVERY / 1000) === 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, readAnswers($).catch(function (err) { return log($, "answers from other chats not read: ".concat(String(err))); })];
                                case 7:
                                    _h.sent();
                                    return [4 /*yield*/, readOthers($).catch(function (err) { return log($, "other chats not read: ".concat(String(err))); })];
                                case 8:
                                    _h.sent();
                                    _h.label = 9;
                                case 9: return [4 /*yield*/, read($, flows)];
                                case 10:
                                    isFlowing = (_h.sent()).some(function (f) { return f.status === 'working'; });
                                    _b = !isTyping;
                                    if (!_b) return [3 /*break*/, 15];
                                    _d = isFlowing;
                                    if (_d) return [3 /*break*/, 12];
                                    return [4 /*yield*/, read($, todos)];
                                case 11:
                                    _d = (_h.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                                    _h.label = 12;
                                case 12:
                                    _c = _d;
                                    if (_c) return [3 /*break*/, 14];
                                    return [4 /*yield*/, read($, others)];
                                case 13:
                                    _c = (_h.sent()).some(function (c) { return c.cards.length; });
                                    _h.label = 14;
                                case 14:
                                    _b = (_c);
                                    _h.label = 15;
                                case 15:
                                    if (!_b) return [3 /*break*/, 17];
                                    return [4 /*yield*/, update($, tick, function (n) { return n + 1; })
                                        // Work in its pause after ending is drawn again the moment the pause is over, when it leaves for Finished
                                    ];
                                case 16:
                                    _h.sent();
                                    _h.label = 17;
                                case 17: return [4 /*yield*/, $.clock.now()];
                                case 18:
                                    now = _h.sent();
                                    _loop_1 = function (one) {
                                        var key = "".concat(one.id, ":").concat(one.endedAt);
                                        if (lingerSet.has(key))
                                            return "continue";
                                        lingerSet.add(key);
                                        $.clock.after(pauseFrom(one) + LINGER - now + 20, function () { return void ((lingerSet.delete(key), update($, tick, function (n) { return n + 1; }))); });
                                    };
                                    _i = 0;
                                    _f = [[]];
                                    return [4 /*yield*/, read($, flows)];
                                case 19:
                                    _g = [__spreadArray.apply(void 0, _f.concat([(_h.sent()), true]))];
                                    return [4 /*yield*/, read($, todos)];
                                case 20:
                                    _e = __spreadArray.apply(void 0, _g.concat([(_h.sent()).filter(function (card) { return !card.parentId; }), true])).filter(function (card) { return isLingering(card, now); });
                                    _h.label = 21;
                                case 21:
                                    if (!(_i < _e.length)) return [3 /*break*/, 23];
                                    one = _e[_i];
                                    _loop_1(one);
                                    _h.label = 22;
                                case 22:
                                    _i++;
                                    return [3 /*break*/, 21];
                                case 23: return [2 /*return*/];
                            }
                        });
                    }); });
                    $.clock.every(TICK, function () { return refresh($).catch(function (err) { return log($, "servers not looked at again: ".concat(String(err))); }); });
                    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
                    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
                    sharedSign = '';
                    isEnded = false;
                    linkReadAt = 0;
                    // A load starts with no prompt open: one a reload cut off has no call left to end it
                    waiting = [];
                    asked = [];
                    return [4 /*yield*/, unshare($, true).catch(function () { return undefined; })];
                case 54:
                    _o.sent();
                    if (macs.length)
                        $.clock.every(FETCH_EVERY, function () { return fetchMacs($).catch(function (err) { return log($, "other Macs not fetched: ".concat(String(err))); }); });
                    _l = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 55:
                    isRunFromAfar = _l.apply(void 0, [_o.sent()]);
                    if (macs.length)
                        $.clock.every(OPEN_EVERY, function () { return takeOpens($).catch(function (err) { return log($, "presses on other Macs not taken: ".concat(String(err))); }); });
                    if (macs.length)
                        $.clock.every(FETCH_EVERY, function () { return syncResults($).catch(function (err) { return log($, "results not made the same: ".concat(String(err))); }); });
                    return [4 /*yield*/, shareMine($).catch(function () { return undefined; })];
                case 56:
                    _o.sent();
                    return [4 /*yield*/, readAnswers($).catch(function () { return undefined; })];
                case 57:
                    _o.sent();
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })
                        // The workflows kept, read back, and followed while they run
                    ];
                case 58:
                    _o.sent();
                    // The workflows kept, read back, and followed while they run
                    return [4 /*yield*/, knowSession($)];
                case 59:
                    // The workflows kept, read back, and followed while they run
                    _o.sent();
                    return [4 /*yield*/, loadFlows($).catch(function (err) { return log($, "workflows not read back: ".concat(String(err))); })];
                case 60:
                    _o.sent();
                    $.clock.every(FLOW_EVERY, function () { return followFlows($).catch(function (err) { return log($, "workflows not followed: ".concat(String(err))); }); });
                    // Claudopus updates itself: a look a little after the chat starts, then whenever one is due
                    $.clock.after(UPDATE_AFTER, function () { return void selfUpdate($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    $.clock.every(UPDATE_LOOK, function () { return selfUpdate($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    // and an open chat moves to a newer copy installed while it runs, by itself, once it is idle
                    reloadAsked = '';
                    $.clock.every(RELOAD_EVERY, function () { return reloadToInstalled($).catch(function (err) { return log($, "reload not looked for: ".concat(String(err))); }); });
                    return [4 /*yield*/, log($, "start ".concat(id, " in ").concat(e.cwd).concat(isOff ? ' (handing over is off)' : ''))];
                case 61:
                    _o.sent();
                    return [2 /*return*/, begun];
            }
        });
    }); });
    // A chat that ends removes its file, so the other panels drop its work at once
    on('session.end', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isEnded = true;
                    return [4 /*yield*/, unshare($).catch(function () { return undefined; })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('prompt.submit', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var isPressed, isPerson, context, text, m, role, _a, _b, roleSent_1, subjects, sizes, told, _c, _d, stamp, path, how;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, flowEnded($, e.text).catch(function (err) { return log($, "workflow end not read: ".concat(String(err))); })];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    if (e.isMeta || e.command || !dir)
                        return [2 /*return*/, next(e)
                            // A message the mod sent from a press or reply in the panel starts work as a message of the person's does
                        ];
                    isPressed = e.origin.kind === 'plugin' && sentForPerson.delete(e.text);
                    isPerson = e.origin.kind === 'composer' || e.origin.kind === 'bridge' || isPressed;
                    if (!isPerson)
                        return [2 /*return*/, next(e)];
                    context = __spreadArray([], ((_e = e.context) !== null && _e !== void 0 ? _e : []), true);
                    text = e.text;
                    return [4 /*yield*/, read($, me)];
                case 3:
                    m = _h.sent();
                    if (!!isOff) return [3 /*break*/, 12];
                    _a = named;
                    _b = fillModels;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/chat.md')];
                case 4:
                    role = _a.apply(void 0, [_b.apply(void 0, [(_h.sent()).text, models])]);
                    roleSent_1 = mark(role);
                    if (!(!m.isChat || m.needsContext || roleSent_1 !== m.roleSent)) return [3 /*break*/, 6];
                    return [4 /*yield*/, readIndex($)];
                case 5:
                    subjects = (_h.sent()).map(function (s) { return "- ".concat([s.name, s.repo, s.session, s.state, s.summary, "streams/".concat(slug(s.name), ".md")].join(' | ')); }).join('\n');
                    context.push("".concat(role, "\nThis chat's saved words: ").concat(dir, "/words/").concat(m.id, ".md\nSubjects so far (name | folder | session | state | summary | its brief, under ").concat(dir, "):\n").concat(subjects || '(none yet)'));
                    _h.label = 6;
                case 6: return [4 /*yield*/, read($, todos)];
                case 7:
                    sizes = (_h.sent())
                        .filter(function (one) { return !one.parentId && one.tokens > 0; })
                        .slice(-8)
                        .map(function (one) { return "".concat(one.title || 'work', " (").concat(one.id, ") ").concat(one.isFork && m.window ? "".concat(Math.round((one.tokens / m.window) * 100), "%") : thousands(one.tokens)); });
                    _c = reportsTold;
                    return [4 /*yield*/, read($, reports)];
                case 8:
                    _d = [_h.sent()];
                    return [4 /*yield*/, $.clock.now()];
                case 9:
                    told = _c.apply(void 0, _d.concat([_h.sent()]));
                    context.push("".concat(BRIEF).concat(sizes.length ? "\nContext of each piece of work: ".concat(sizes.join('; '), ".") : '').concat(told ? "\n".concat(told) : ''));
                    return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isChat: true, needsContext: false, roleSent: roleSent_1 })); })];
                case 10:
                    _h.sent();
                    if (!(text.length > PASTE_CHARS)) return [3 /*break*/, 12];
                    stamp = new Date().toISOString().replaceAll(':', '-');
                    path = "".concat(dir, "/pastes/").concat(stamp, ".md");
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/pastes/").concat(stamp, ".md"), text)];
                case 11:
                    _h.sent();
                    text = "".concat(text.slice(0, 600), "\n\n[").concat(text.length - 1200, " characters pasted here were saved to ").concat(path, " and left out of this chat]\n\n").concat(text.slice(-600));
                    context.push(PASTED);
                    _h.label = 12;
                case 12:
                    said = text;
                    heard = __spreadArray(__spreadArray([], heard, true), [text], false);
                    return [4 /*yield*/, read($, reports)];
                case 13:
                    // A message that names a report starts work from it: that work's own report is kept linked to it
                    fromReport = (_g = (_f = (_h.sent()).find(function (r) { return text.includes("".concat(reportPath(r), "/")) || text.includes("reports/".concat(r.id)); })) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : '';
                    how = "".concat(e.turnId ? ' (sent while Claude was working)' : '').concat(e.origin.kind === 'bridge' ? ' (from the phone)' : '').concat(isPressed ? ' (pressed or replied in the panel)' : '');
                    return [4 /*yield*/, appendWords($, m.id, "## ".concat(new Date().toISOString()).concat(how, "\n").concat(text, "\n\n")).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 14:
                    _h.sent();
                    return [2 /*return*/, next(context.length ? __assign(__assign({}, e), { text: text, context: context }) : __assign(__assign({}, e), { text: text }))];
            }
        });
    }); });
    on('turn.complete', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var done, id_1, now_1, answer_1, isHeld_1, how_1, isReport_1, card_1, report_1, text;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    done = _d.sent();
                    if (!dir)
                        return [2 /*return*/, done
                            // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                            // One that only waits for its helpers goes on working
                        ];
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 12];
                    id_1 = e.agentId;
                    return [4 /*yield*/, $.clock.now()
                        // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer
                    ];
                case 2:
                    now_1 = _d.sent();
                    answer_1 = (((_a = e.answer) !== null && _a !== void 0 ? _a : '').trim() || handedBack.get(id_1) || '').slice(0, ANSWER_CHARS);
                    return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                case 3:
                    isHeld_1 = (_d.sent()).some(function (one) { return one.id === id_1 && one.status === 'waiting'; });
                    how_1 = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done';
                    isReport_1 = how_1 === 'done' && isHeld_1 && (handedBack.has(id_1) || answer_1.length >= REPORT_LEAST);
                    handedBack.delete(id_1);
                    return [4 /*yield*/, update($, todos, function (list) {
                            var isWaiting = how_1 === 'done' && (isHeld_1 || list.some(function (one) { return one.parentId === id_1 && one.status === 'working'; }));
                            // An aborted turn's own text is not kept over the report the work gave before it was stopped
                            return list.map(function (one) {
                                return one.id !== id_1
                                    ? one
                                    : isWaiting
                                        ? __assign(__assign({}, one), { answer: answer_1 || one.answer, answeredAt: isReport_1 ? now_1 : one.answeredAt }) : how_1 === 'stopped'
                                        ? one.status === 'working'
                                            ? ended(one, stoppedAs(one), now_1)
                                            : one
                                        : __assign(__assign({}, ended(one, how_1, now_1)), { answer: answer_1 || one.answer });
                            });
                        })];
                case 4:
                    _d.sent();
                    if (!(how_1 === 'stopped')) return [3 /*break*/, 6];
                    return [4 /*yield*/, keepStoppedReports($, now_1)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, lookEnds($)
                    // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
                ];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, read($, todos)];
                case 8:
                    if (!(((_b = (_d.sent()).find(function (one) { return one.id === id_1; })) === null || _b === void 0 ? void 0 : _b.status) !== 'working')) return [3 /*break*/, 10];
                    return [4 /*yield*/, replyUnread($, id_1).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })
                        // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
                        // held on its own background work leaves it once it ends (keepStoppedReports)
                    ];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10: return [4 /*yield*/, read($, todos)];
                case 11:
                    card_1 = (_d.sent()).find(function (one) { return one.id === id_1; });
                    report_1 = ((_c = e.answer) !== null && _c !== void 0 ? _c : '').trim() || answer_1;
                    if (card_1 && !card_1.parentId && card_1.status === 'done' && how_1 === 'done' && report_1) {
                        $.clock.after(5, function () { return void saveReport($, card_1, report_1).catch(function (err) { return log($, "report of ".concat(id_1, " not kept: ").concat(String(err))); }); });
                    }
                    return [2 /*return*/, done];
                case 12:
                    text = said;
                    said = '';
                    heard = [];
                    // Off the turn's clock, so the reply is never held up
                    $.clock.after(5, function () { var _a; return void afterReply($, text, (_a = e.answer) !== null && _a !== void 0 ? _a : '').catch(function (err) { return log($, "pass after reply failed: ".concat(String(err))); }); });
                    return [2 /*return*/, done];
            }
        });
    }); });
    // A compaction keeps what the person asked for, and the role text goes out again after it
    on('session.compact', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var isChat, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read($, me)];
                case 1:
                    isChat = (_a.sent()).isChat && !isOff;
                    return [4 /*yield*/, next(__assign(__assign({}, e), { instructions: [e.instructions, KEEP, isChat ? KEEP_AGENTS : ''].filter(Boolean).join('\n') }))];
                case 2:
                    r = _a.sent();
                    if (!(e.agentId === undefined && e.trigger !== 'precompute')) return [3 /*break*/, 4];
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { needsContext: true })); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, r];
            }
        });
    }); });
    // The person's principles and working rules ship with the mod: every conversation, a chat's and each piece of work's, carries them
    // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice
    on('prompt.context', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, files, _a, path, content, others, at, ours;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _c.sent();
                    files = (_b = r.instructionFiles) !== null && _b !== void 0 ? _b : e.instructionFiles;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')];
                case 2:
                    _a = _c.sent(), path = _a.path, content = _a.text;
                    if (!files || !content.trim())
                        return [2 /*return*/, r];
                    others = files.filter(function (one) { return one.content.trim() !== content.trim(); });
                    at = others.findIndex(function (one) { return one.kind !== 'managed'; });
                    ours = { path: path, kind: 'user', content: content };
                    return [2 /*return*/, __assign(__assign({}, r), { instructionFiles: at < 0 ? __spreadArray(__spreadArray([], others, true), [ours], false) : __spreadArray(__spreadArray(__spreadArray([], others.slice(0, at), true), [ours], false), others.slice(at), true) })];
            }
        });
    }); });
    on('tool.describe', function (_, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, isRare;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _a.sent();
                    isRare = RARE_TOOLS.includes(e.tool) || RARE_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); });
                    return [2 /*return*/, isRare ? __assign(__assign({}, r), { isDeferred: true }) : r];
            }
        });
    }); });
};
