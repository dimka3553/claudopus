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
// Work the engine still listed as running as its turn ended is looked at again this long after: one whose run was over by then is
// listed as completed, and the look ends its card (sync) and passes on a reply it never read, as the turn's end would have
var HELD_LOOK = 1500;
var heldLook = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var listed, now_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, sync($)
                // Listed as idle, or no longer listed, its run is over too: nothing holds it
            ];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.agent.list().catch(function () { return undefined; })];
            case 2:
                listed = (_b = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.find(function (one) { return one.id === id; })) === null || _b === void 0 ? void 0 : _b.status;
                if (!(listed === 'idle' || listed === undefined)) return [3 /*break*/, 5];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now_1 = _d.sent();
                return [4 /*yield*/, update($, todos, function (list) { return list.map(function (one) { return (one.id === id && one.status === 'working' ? ended(one, 'done', now_1) : one); }); })];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5: return [4 /*yield*/, read($, todos)];
            case 6:
                if (((_c = (_d.sent()).find(function (one) { return one.id === id; })) === null || _c === void 0 ? void 0 : _c.status) === 'working')
                    return [2 /*return*/];
                return [4 /*yield*/, replyUnread($, id)];
            case 7:
                _d.sent();
                if (!wakes.length) return [3 /*break*/, 9];
                return [4 /*yield*/, sendWakes($)];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
var chatHooks = function (on) {
    on('session.start', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var begun, home, _a, _b, _i, _c, _d, art, file, text, _e, id, title, isNew, isRunning, choice, _f, _g, _h, now, last, _j, _k, _l, _m, one, seconds, _o;
        var _p, _q, _r, _s;
        var _this = this;
        var _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, knowSystem($).catch(function () { return undefined; })
                    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
                ];
                case 1:
                    _w.sent();
                    // A load, first or a reload, starts looking afresh: nothing that ended before it is announced
                    lastSeen = undefined;
                    // and reads its own copy's version again
                    loadedVersion = undefined;
                    // and takes nothing it knew of the person's settings and texts as sealed: the kept copy is checked again
                    knownSeen = undefined;
                    return [4 /*yield*/, next(e)];
                case 2:
                    begun = _w.sent();
                    return [4 /*yield*/, $.env.get('HOME')];
                case 3:
                    home = (_t = (_w.sent())) !== null && _t !== void 0 ? _t : '';
                    dir = "".concat(home, "/.claude/claudopus");
                    _b = (_a = /truecolor|24bit/i).test;
                    return [4 /*yield*/, $.env.get('COLORTERM')];
                case 4:
                    termLive = _b.apply(_a, [(_u = (_w.sent())) !== null && _u !== void 0 ? _u : '']) ? LIVE : DEEP_LIVE;
                    return [4 /*yield*/, $.env.get('SSH_CONNECTION')];
                case 5:
                    _p = ((_v = (_w.sent())) !== null && _v !== void 0 ? _v : '').trim().split(/\s+/), _q = _p[0], termFrom = _q === void 0 ? '' : _q, _r = _p[2], termHere = _r === void 0 ? '' : _r, _s = _p[3], termPort = _s === void 0 ? '' : _s;
                    _i = 0, _c = Object.entries(ART_FILES);
                    _w.label = 6;
                case 6:
                    if (!(_i < _c.length)) return [3 /*break*/, 9];
                    _d = _c[_i], art = _d[0], file = _d[1];
                    return [4 /*yield*/, readOr($, "".concat($.plugin.root, "/art/").concat(file))];
                case 7:
                    text = _w.sent();
                    ART[art] = text.slice(Math.max(0, text.indexOf('<svg')));
                    _w.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    ART.asking = ART.wave.replaceAll('#8A63F0', NEEDS);
                    ART.updated = updatedArt(ART.happy, FLOW);
                    // A load that moved this chat to a newer version has the header say so, once its octopus is read
                    return [4 /*yield*/, noteLoaded($).catch(function (err) { return log($, "version moved not looked at: ".concat(String(err))); })
                        // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    ];
                case 10:
                    // A load that moved this chat to a newer version has the header say so, once its octopus is read
                    _w.sent();
                    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    return [4 /*yield*/, noteSeen($).catch(function (err) { return log($, "changes seen not noted: ".concat(String(err))); })];
                case 11:
                    // and a Mac with no record of the changes seen starts one, from the version this chat moved from
                    _w.sent();
                    cwd = e.cwd;
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 12:
                    if (!(_w.sent()).length) return [3 /*break*/, 14];
                    _e = 1;
                    return [4 /*yield*/, $.clock.now()];
                case 13:
                    (loadMark = presses = _e + ((_w.sent()) % 1000000000) * 1000), (freshness += 1);
                    _w.label = 14;
                case 14: return [4 /*yield*/, loadSettings($)];
                case 15:
                    _w.sent();
                    return [4 /*yield*/, clearGates($).catch(function (err) { return log($, "admin holds not cleared: ".concat(String(err))); })
                        // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    ];
                case 16:
                    _w.sent();
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    return [4 /*yield*/, closeUndrawn($)];
                case 17:
                    // An empty tab a press left before this load closes, now and once the surface has had a moment to place the panes
                    _w.sent();
                    $.clock.after(3000, function () { return closeUndrawn($); });
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    return [4 /*yield*/, watchLoaded($).catch(function (err) { return log($, "tabs not watched: ".concat(String(err))); })
                        // The engine's id names this chat's files, as its transcript is named
                    ];
                case 18:
                    // and every tab left open is drawn, though the app asked for it while this code was away (watchTabs)
                    _w.sent();
                    return [4 /*yield*/, $.session.id()];
                case 19:
                    id = _w.sent();
                    return [4 /*yield*/, appTitle($)
                        // The first load of a session sends the role text; a reload keeps what stands
                    ];
                case 20:
                    title = _w.sent();
                    // The first load of a session sends the role text; a reload keeps what stands
                    return [4 /*yield*/, update($, me, function (m) { return (__assign(__assign({}, m), { id: id, title: title !== null && title !== void 0 ? title : m.title, needsContext: m.id ? m.needsContext : true })); })
                        // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    ];
                case 21:
                    // The first load of a session sends the role text; a reload keeps what stands
                    _w.sent();
                    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    return [4 /*yield*/, noteCut($, id).catch(function (err) { return log($, "cut-off work not looked for: ".concat(String(err))); })
                        // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                        // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    ];
                case 22:
                    // What was at work when this chat's process last ended is read before this load writes its own: work no longer at work was cut off
                    _w.sent();
                    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })];
                case 23:
                    // The other chats, on this Mac and the others, are read before the panel is drawn: a chat that starts, or comes back, showed
                    // its panel without them until the rest of its start was done, and they seemed to drop out of it for a while
                    _w.sent();
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
                case 24:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'recall',
                            description: named("Searches the memory for a phrase: {name}'s messages word for word, what they asked, subject briefs, pastes, and the results finished work left for {name} (reports/<id>/report.md, each dated). Returns matching lines with their files."),
                            inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
                            isDeferred: false,
                        })];
                case 25:
                    _w.sent();
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
                case 26:
                    _w.sent();
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
                case 27:
                    _w.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'ask',
                            description: named("For background work: when a step needs {name}'s own hands now (a code to paste, a box to fill, a key or a button to press), says so on your card, which stands out at the top of the panel with the ask in view and a Copy button for the exact text, and shows the ask in the chat as a notice, where {name} can answer it too. `text` says what to do, in one plain line; `details` is what the ask is about, in full, enough to decide on (what changes, what it costs, what is not done), shown with it on the card and in the chat: {name} sees your ask before your report, which reaches them only after you finish, so an ask never points at an explanation it does not carry; `copy` is only for text {name} must paste somewhere else (a one-time code, a token name, a link to open), never the instructions themselves; `choices` are buttons {name} answers with, such as Approve and Not now, for a go-ahead you need (without them the card offers Done and Not now); {name} can always reply in their own words instead; `pictures` are the picture files the ask is about, such as the options to pick from; `command` is a command only {name} can run, never one you can run yourself: given whole, with its folder in `cwd` or full paths, it is shown with a Copy button and, in a chat on this Mac, a button that opens a terminal with it typed when they press it: open none yourself. The ask stays until {name} answers, even after you finish. An answer clears it and arrives as a message at your next step; carry on meanwhile with what does not depend on it, or end saying what you wait for, and the answer comes back through the chat. Ask again if the answer leaves something waiting. Call it again with empty `text` only once you have seen it done."),
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    text: { type: 'string', description: 'What to do, in one plain line, speaking to them as "you"; empty once it is done' },
                                    details: { type: 'string', description: 'What the ask is about, in full: everything needed to decide it, shown with it on the card and in the chat. Short plain lines and "- " lists, no tables or bold, and a blank line after a list: the card is narrow and the chat shows it as plain text. Never "as explained in the chat" or "in my report": they see the ask first' },
                                    copy: { type: 'string', description: 'Only text they must paste somewhere else, such as a one-time code or a link; leave it out when they only read or press something' },
                                    choices: { type: 'array', items: { type: 'string' }, description: 'Answers to press, such as Approve and Not now (Done and Not now when left out); the one pressed comes back to you as a message' },
                                    command: { type: 'string', description: 'A command only they can run, never one you can run yourself, one line, whole: shown with a Copy button, and on this Mac a button that opens a terminal with it typed, never run' },
                                    cwd: { type: 'string', description: 'The folder the command runs in, a full path; the command is shown starting there. Needed when the command has a relative path' },
                                    pictures: { type: 'array', items: { type: 'string' }, description: 'Full paths of the picture files the ask is about, such as the options to pick from; drawn small on the card, each opening large on a press, and shown with the ask in the chat' },
                                },
                                required: ['text'],
                            },
                            isDeferred: false,
                        })];
                case 28:
                    _w.sent();
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
                case 29:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'claudopus', description: 'Show the to-dos of this chat: what I asked for, what was done and decided, and each answer' })];
                case 30:
                    _w.sent();
                    return [4 /*yield*/, $.command.register({ name: 'servers', description: 'Show the servers running on this Mac, with a link to each and which chat started it' })];
                case 31:
                    _w.sent();
                    void $.ui.close({ id: OLD_PANE }).catch(function () { return undefined; });
                    return [4 /*yield*/, $.fs.exists("".concat(dir, "/index.md"))];
                case 32:
                    isNew = !(_w.sent());
                    if (!isNew) return [3 /*break*/, 34];
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/index.md"), INDEX_HEAD)];
                case 33:
                    _w.sent();
                    _w.label = 34;
                case 34: return [4 /*yield*/, settleWelcome($, isNew, id).catch(function (err) { return log($, "welcome not settled: ".concat(String(err))); })];
                case 35:
                    _w.sent();
                    return [4 /*yield*/, measure($).catch(function () { return undefined; })];
                case 36:
                    _w.sent();
                    return [4 /*yield*/, loadFinished($).catch(function (err) { return log($, "finished work not read: ".concat(String(err))); })];
                case 37:
                    _w.sent();
                    void recoverEnded($).catch(function (err) { return log($, "ended work not read back: ".concat(String(err))); });
                    return [4 /*yield*/, sync($).catch(function () { return undefined; })];
                case 38:
                    _w.sent();
                    return [4 /*yield*/, loadReports($).catch(function () { return undefined; })
                        // What the person had typed into a reply box before a reload of the mod is in its box again
                    ];
                case 39:
                    _w.sent();
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    return [4 /*yield*/, readDrafts($).catch(function () { return undefined; })
                        // Work that is running when the chat loads brings the panel up, if it has never opened
                        // and comes back after a reload of the mod (which closes it) if it was open or work is running
                        // Once the person has opened or closed the panel, every chat follows that choice instead, as it loads and every PANEL_EVERY
                    ];
                case 40:
                    // What the person had typed into a reply box before a reload of the mod is in its box again
                    _w.sent();
                    return [4 /*yield*/, read($, todos)];
                case 41:
                    isRunning = (_w.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                    panelSeen = '';
                    return [4 /*yield*/, followPanel($).catch(function () { return undefined; })];
                case 42:
                    choice = _w.sent();
                    if (!(!choice && (isRunning || isWelcomeOpen))) return [3 /*break*/, 44];
                    return [4 /*yield*/, openList($)];
                case 43:
                    _w.sent();
                    _w.label = 44;
                case 44:
                    _g = !choice;
                    if (!_g) return [3 /*break*/, 46];
                    return [4 /*yield*/, read($, paneShown)];
                case 45:
                    _g = ((_w.sent()) || isRunning);
                    _w.label = 46;
                case 46:
                    _f = _g;
                    if (!_f) return [3 /*break*/, 48];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 47:
                    _f = !(_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 48;
                case 48:
                    if (!_f) return [3 /*break*/, 50];
                    return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, rows: PANEL_ROWS }).catch(function (err) { return log($, "panel not opened again: ".concat(String(err))); })
                        // Someone whose panel was open before chats shared it (as when this version is installed, which reloads every chat) has it
                        // open in every chat from now on
                    ];
                case 49:
                    _w.sent();
                    _w.label = 50;
                case 50:
                    _h = !choice;
                    if (!_h) return [3 /*break*/, 52];
                    return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
                case 51:
                    _h = (_w.sent()).some(function (pane) { return pane.id === LIST; });
                    _w.label = 52;
                case 52:
                    if (!_h) return [3 /*break*/, 54];
                    return [4 /*yield*/, choosePanel($, true)];
                case 53:
                    _w.sent();
                    _w.label = 54;
                case 54:
                    everyLoad($, PANEL_EVERY, function () { return followPanel($).catch(function (err) { return log($, "panel not followed: ".concat(String(err))); }); });
                    everyLoad($, FOLLOW_EVERY, function () { return follow($).catch(function (err) { return log($, "work not followed: ".concat(String(err))); }); });
                    // Each second the running times on the small cards move on, while any work runs. A Details tab does not read the tick: it is
                    // drawn again only when its work moves, since its chat is too long to draw every second and a press must not wait behind a drawing.
                    // The redraws set for pauses before this start are forgotten, as their timers went with the session that set them
                    lingerSet.clear();
                    return [4 /*yield*/, $.clock.now()
                        // Only work that ended after the panel was last drawn: what it already showed ended is not shown again
                    ];
                case 55:
                    now = _w.sent();
                    return [4 /*yield*/, read($, lastDrawn)];
                case 56:
                    last = _w.sent();
                    lateFrom.clear();
                    _j = 0;
                    _l = [[]];
                    return [4 /*yield*/, read($, flows)];
                case 57:
                    _m = [__spreadArray.apply(void 0, _l.concat([(_w.sent()), true]))];
                    return [4 /*yield*/, read($, todos)];
                case 58:
                    _k = __spreadArray.apply(void 0, _m.concat([(_w.sent()).filter(function (card) { return !card.parentId; }), true]));
                    _w.label = 59;
                case 59:
                    if (!(_j < _k.length)) return [3 /*break*/, 61];
                    one = _k[_j];
                    if (one.status !== 'working' && one.endedAt > last && one.endedAt <= now && now - one.endedAt < RELOAD_GRACE)
                        lateFrom.set("".concat(one.id, ":").concat(one.endedAt), Infinity);
                    _w.label = 60;
                case 60:
                    _j++;
                    return [3 /*break*/, 59];
                case 61:
                    seconds = 0;
                    everyLoad($, 1000, function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, isFlowing, calmNow, isMoving, _b, _c, isStale, _i, heldDrawings_1, _d, key, held_1, _e, heldDrawings_2, _f, key, held_2, now, _loop_1, _g, _h, _j, _k, one;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    _a = drawnNow;
                                    return [4 /*yield*/, read($, lastDrawn)];
                                case 1:
                                    if (!(_a > (_l.sent()))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, update($, lastDrawn, function () { return drawnNow; })];
                                case 2:
                                    _l.sent();
                                    _l.label = 3;
                                case 3: return [4 /*yield*/, shareMine($).catch(function (err) { return log($, "work not shared: ".concat(String(err))); })
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                ];
                                case 4:
                                    _l.sent();
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                    return [4 /*yield*/, lookBoxes($).catch(function (err) { return log($, "boxes not looked at: ".concat(String(err))); })];
                                case 5:
                                    // The hidden boxes of the admin and secret runners, drawn in the panel in every chat
                                    _l.sent();
                                    return [4 /*yield*/, watchFront($).catch(function (err) { return log($, "tab in front not watched: ".concat(String(err))); })];
                                case 6:
                                    _l.sent();
                                    if (!(seconds % 2 === 0)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, lookForStarted($).catch(function (err) { return log($, "running commands not looked at: ".concat(String(err))); })];
                                case 7:
                                    _l.sent();
                                    _l.label = 8;
                                case 8:
                                    if (!((seconds += 1) % (LOOK_EVERY / 1000) === 0)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, readAnswers($).catch(function (err) { return log($, "answers from other chats not read: ".concat(String(err))); })];
                                case 9:
                                    _l.sent();
                                    return [4 /*yield*/, readOthers($).catch(function (err) { return log($, "other chats not read: ".concat(String(err))); })];
                                case 10:
                                    _l.sent();
                                    _l.label = 11;
                                case 11: return [4 /*yield*/, read($, flows)];
                                case 12:
                                    isFlowing = (_l.sent()).some(function (f) { return f.status === 'working'; });
                                    return [4 /*yield*/, $.clock.now()];
                                case 13:
                                    calmNow = _l.sent();
                                    _c = isFlowing;
                                    if (_c) return [3 /*break*/, 15];
                                    return [4 /*yield*/, read($, todos)];
                                case 14:
                                    _c = (_l.sent()).some(function (one) { return !one.parentId && one.status === 'working'; });
                                    _l.label = 15;
                                case 15:
                                    _b = _c;
                                    if (_b) return [3 /*break*/, 17];
                                    return [4 /*yield*/, read($, others)];
                                case 16:
                                    _b = (_l.sent()).some(function (c) { return c.cards.length; });
                                    _l.label = 17;
                                case 17:
                                    isMoving = _b;
                                    isStale = false;
                                    if (!isTyping && isMoving)
                                        for (_i = 0, heldDrawings_1 = heldDrawings; _i < heldDrawings_1.length; _i++) {
                                            _d = heldDrawings_1[_i], key = _d[0], held_1 = _d[1];
                                            if (calmNow - held_1.at >= CALM)
                                                (heldDrawings.delete(key), (isStale = true));
                                        }
                                    // A drawing of a size or tab no longer drawn is let go after a minute: it would only be drawn afresh
                                    if (!isTyping)
                                        for (_e = 0, heldDrawings_2 = heldDrawings; _e < heldDrawings_2.length; _e++) {
                                            _f = heldDrawings_2[_e], key = _f[0], held_2 = _f[1];
                                            if (calmNow - held_2.at >= 60000)
                                                heldDrawings.delete(key);
                                        }
                                    if (isStale)
                                        $.ui.invalidate('ui.render');
                                    if (!(!isTyping && isMoving)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, update($, tick, function (n) { return n + 1; })
                                        // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
                                    ];
                                case 18:
                                    _l.sent();
                                    _l.label = 19;
                                case 19: return [4 /*yield*/, read($, todos)];
                                case 20:
                                    // While this chat's work runs, the line above the prompt shows how Claude uses the computer: looked at every few seconds
                                    if ((_l.sent()).some(function (one) { return !one.parentId && one.status === 'working'; }))
                                        void lookUsage($).catch(function (err) { return log($, "usage not looked at: ".concat(String(err))); });
                                    return [4 /*yield*/, $.clock.now()];
                                case 21:
                                    now = _l.sent();
                                    _loop_1 = function (one) {
                                        var key = "".concat(one.id, ":").concat(one.endedAt);
                                        if (lingerSet.has(key))
                                            return "continue";
                                        lingerSet.add(key);
                                        $.clock.after(pauseFrom(one) + LINGER - now + 20, function () { return void ((lingerSet.delete(key), drawAgain($), update($, tick, function (n) { return n + 1; }))); });
                                    };
                                    _g = 0;
                                    _j = [[]];
                                    return [4 /*yield*/, read($, flows)];
                                case 22:
                                    _k = [__spreadArray.apply(void 0, _j.concat([(_l.sent()), true]))];
                                    return [4 /*yield*/, read($, todos)];
                                case 23:
                                    _h = __spreadArray.apply(void 0, _k.concat([(_l.sent()), true])).filter(function (card) { return isLingering(card, now); });
                                    _l.label = 24;
                                case 24:
                                    if (!(_g < _h.length)) return [3 /*break*/, 26];
                                    one = _h[_g];
                                    _loop_1(one);
                                    _l.label = 25;
                                case 25:
                                    _g++;
                                    return [3 /*break*/, 24];
                                case 26: return [2 /*return*/];
                            }
                        });
                    }); });
                    everyLoad($, TICK, function () { return refresh($).catch(function (err) { return log($, "servers not looked at again: ".concat(String(err))); }); });
                    // Every chat's work in every panel: this chat's file is kept true each second (written only when it changed or its beat is due),
                    // the other chats' files and the answers left for this one are read every few seconds, the other Macs fetched now and then
                    sharedSign = '';
                    isEnded = false;
                    linkReadAt = 0;
                    // A load starts with no prompt open: one a reload cut off has no call left to end it
                    waiting = [];
                    asked = [];
                    return [4 /*yield*/, unshare($, true).catch(function () { return undefined; })];
                case 62:
                    _w.sent();
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return fetchMacs($).catch(function (err) { return log($, "other Macs not fetched: ".concat(String(err))); }); });
                    _o = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 63:
                    isRunFromAfar = _o.apply(void 0, [_w.sent()]);
                    if (!isRunFromAfar) return [3 /*break*/, 65];
                    return [4 /*yield*/, startKeeper($, id).catch(function (err) { return log($, "keeper not started: ".concat(String(err))); })];
                case 64:
                    _w.sent();
                    _w.label = 65;
                case 65:
                    if (macs.length)
                        everyLoad($, OPEN_EVERY, function () { return takeOpens($).catch(function (err) { return log($, "presses on other Macs not taken: ".concat(String(err))); }); });
                    if (macs.length)
                        everyLoad($, FETCH_EVERY, function () { return syncResults($).catch(function (err) { return log($, "results not made the same: ".concat(String(err))); }); });
                    return [4 /*yield*/, shareMine($).catch(function () { return undefined; })];
                case 66:
                    _w.sent();
                    return [4 /*yield*/, readAnswers($).catch(function () { return undefined; })];
                case 67:
                    _w.sent();
                    return [4 /*yield*/, readOthers($).catch(function () { return undefined; })
                        // The workflows kept, read back, and followed while they run
                    ];
                case 68:
                    _w.sent();
                    // The workflows kept, read back, and followed while they run
                    return [4 /*yield*/, knowSession($)];
                case 69:
                    // The workflows kept, read back, and followed while they run
                    _w.sent();
                    return [4 /*yield*/, loadFlows($).catch(function (err) { return log($, "workflows not read back: ".concat(String(err))); })];
                case 70:
                    _w.sent();
                    everyLoad($, FLOW_EVERY, function () { return followFlows($).catch(function (err) { return log($, "workflows not followed: ".concat(String(err))); }); });
                    // Every hour one chat looks at the version page, and only looks: an update is installed, and a chat reloaded to it, only by a press
                    afterLoad($, UPDATE_AFTER, function () { return void lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    everyLoad($, UPDATE_LOOK, function () { return lookForNew($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); }); });
                    if (!isRunFromAfar) return [3 /*break*/, 72];
                    return [4 /*yield*/, holdOldCopies($).catch(function () { return undefined; })];
                case 71:
                    _w.sent();
                    everyLoad($, HOLD_EVERY, function () { return holdOldCopies($).catch(function (err) { return log($, "old copies not held: ".concat(String(err))); }); });
                    _w.label = 72;
                case 72: return [4 /*yield*/, tidyLog($)];
                case 73:
                    _w.sent();
                    return [4 /*yield*/, log($, "start ".concat(id, " in ").concat(e.cwd).concat(isOff ? ' (handing over is off)' : ''))
                        // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    ];
                case 74:
                    _w.sent();
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    return [4 /*yield*/, takeCharge($)
                        // A move to a newer version has its moment begin now that the load has started whole
                    ];
                case 75:
                    // This load takes charge in this chat once all it runs is started: the copies before it see the mark change and stop
                    _w.sent();
                    // A move to a newer version has its moment begin now that the load has started whole
                    return [4 /*yield*/, readyUpdated($).catch(function () { return undefined; })];
                case 76:
                    // A move to a newer version has its moment begin now that the load has started whole
                    _w.sent();
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
                    if (!dir) return [3 /*break*/, 2];
                    return [4 /*yield*/, personCheck($).catch(function (err) { return log($, "files not compared as a message came: ".concat(String(err))); })];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    if (!wakes.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })
                        // The notice that a workflow ended ends its card
                    ];
                case 3:
                    _h.sent();
                    _h.label = 4;
                case 4:
                    if (!(dir && e.origin.kind === 'task-notification' && e.text.includes('<task-notification'))) return [3 /*break*/, 6];
                    return [4 /*yield*/, flowEnded($, e.text).catch(function (err) { return log($, "workflow end not read: ".concat(String(err))); })];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
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
                case 7:
                    m = _h.sent();
                    if (!!isOff) return [3 /*break*/, 16];
                    _a = named;
                    _b = fillModels;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'roles/chat.md')];
                case 8:
                    role = _a.apply(void 0, [_b.apply(void 0, [(_h.sent()).text, models])]);
                    roleSent_1 = mark(role);
                    if (!(!m.isChat || m.needsContext || roleSent_1 !== m.roleSent)) return [3 /*break*/, 10];
                    return [4 /*yield*/, readIndex($)];
                case 9:
                    subjects = (_h.sent()).map(function (s) { return "- ".concat([s.name, s.repo, s.session, s.state, s.summary, "streams/".concat(slug(s.name), ".md")].join(' | ')); }).join('\n');
                    context.push("".concat(role, "\nThis chat's saved words: ").concat(dir, "/words/").concat(m.id, ".md\nSubjects so far (name | folder | session | state | summary | its brief, under ").concat(dir, "):\n").concat(subjects || '(none yet)'));
                    _h.label = 10;
                case 10: return [4 /*yield*/, read($, todos)];
                case 11:
                    sizes = (_h.sent())
                        .filter(function (one) { return !one.parentId && one.tokens > 0; })
                        .slice(-8)
                        .map(function (one) { return "".concat(one.title || 'work', " (").concat(one.id, ") ").concat(one.isFork && m.window ? "".concat(Math.round((one.tokens / m.window) * 100), "%") : thousands(one.tokens)); });
                    _c = reportsTold;
                    return [4 /*yield*/, read($, reports)];
                case 12:
                    _d = [_h.sent()];
                    return [4 /*yield*/, $.clock.now()];
                case 13:
                    told = _c.apply(void 0, _d.concat([_h.sent()]));
                    context.push("".concat(BRIEF).concat(sizes.length ? "\nContext of each piece of work: ".concat(sizes.join('; '), ".") : '').concat(told ? "\n".concat(told) : ''));
                    return [4 /*yield*/, update($, me, function (one) { return (__assign(__assign({}, one), { isChat: true, needsContext: false, roleSent: roleSent_1 })); })];
                case 14:
                    _h.sent();
                    if (!(text.length > PASTE_CHARS)) return [3 /*break*/, 16];
                    stamp = new Date().toISOString().replaceAll(':', '-');
                    path = "".concat(dir, "/pastes/").concat(stamp, ".md");
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/pastes/").concat(stamp, ".md"), text)];
                case 15:
                    _h.sent();
                    text = "".concat(text.slice(0, 600), "\n\n[").concat(text.length - 1200, " characters pasted here were saved to ").concat(path, " and left out of this chat]\n\n").concat(text.slice(-600));
                    context.push(PASTED);
                    _h.label = 16;
                case 16:
                    said = text;
                    heard = __spreadArray(__spreadArray([], heard, true), [text], false);
                    return [4 /*yield*/, read($, reports)];
                case 17:
                    // A message that names a report starts work from it: that work's own report is kept linked to it
                    fromReport = (_g = (_f = (_h.sent()).find(function (r) { return text.includes("".concat(reportPath(r), "/")) || text.includes("reports/".concat(r.id)); })) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : '';
                    how = "".concat(e.turnId ? ' (sent while Claude was working)' : '').concat(e.origin.kind === 'bridge' ? ' (from the phone)' : '').concat(isPressed ? ' (pressed or replied in the panel)' : '');
                    return [4 /*yield*/, appendWords($, m.id, "## ".concat(new Date().toISOString()).concat(how, "\n").concat(text, "\n\n")).catch(function (err) { return log($, "message not saved: ".concat(String(err))); })];
                case 18:
                    _h.sent();
                    return [2 /*return*/, next(context.length ? __assign(__assign({}, e), { text: text, context: context }) : __assign(__assign({}, e), { text: text }))];
            }
        });
    }); });
    on('turn.complete', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var done, id_1, now_2, answer_1, listed_1, isHeld_1, how_1, isGoingOn, _a, _b, isReport_1, isIdleReport, _c, _d, isHandedBack_1, _e, card_1, report_1, text;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, next(e)
                    // An answer waiting to start ended work again goes from inside this hook, at the end of any turn, the chat's own too (sendWakes)
                ];
                case 1:
                    done = _k.sent();
                    if (!(wakes.length && e.agentId === undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    if (!dir)
                        return [2 /*return*/, done
                            // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                            // One that only waits for its helpers goes on working
                            // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                        ];
                    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                    // One that only waits for its helpers goes on working
                    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                    return [4 /*yield*/, lapsedSignIn($, e).catch(function (err) { return log($, "lapsed sign-in not handed over: ".concat(String(err))); })];
                case 4:
                    // A piece of work ended its turn: it has ended and leaves the panel, since the chat passes its answer on.
                    // One that only waits for its helpers goes on working
                    // A turn the lapsed sign-in of the app ended hands the chat to this Mac's keeper
                    _k.sent();
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 25];
                    id_1 = e.agentId;
                    return [4 /*yield*/, $.clock.now()
                        // A turn that handed back its report with SubagentHandback and says nothing after has that report as its answer
                    ];
                case 5:
                    now_2 = _k.sent();
                    answer_1 = (((_f = e.answer) !== null && _f !== void 0 ? _f : '').trim() || handedBack.get(id_1) || '').slice(0, ANSWER_CHARS);
                    return [4 /*yield*/, $.agent.list().catch(function () { return []; })];
                case 6:
                    listed_1 = (_g = (_k.sent()).find(function (one) { return one.id === id_1; })) === null || _g === void 0 ? void 0 : _g.status;
                    isHeld_1 = listed_1 === 'waiting' || listed_1 === 'running';
                    if (listed_1 === 'running')
                        $.clock.after(HELD_LOOK, function () { return void heldLook($, id_1).catch(function (err) { return log($, "work ".concat(id_1, " not looked at again: ").concat(String(err))); }); });
                    how_1 = e.isAborted ? 'stopped' : e.reason === 'error' || e.reason === 'refusal' ? 'failed' : 'done';
                    _a = how_1 === 'done' && isHeld_1;
                    if (!_a) return [3 /*break*/, 8];
                    _b = goesOn;
                    return [4 /*yield*/, read($, todos)];
                case 7:
                    _a = _b.apply(void 0, [_k.sent(), id_1]);
                    _k.label = 8;
                case 8:
                    isGoingOn = _a;
                    isReport_1 = how_1 === 'done' && isHeld_1 && !isGoingOn && (handedBack.has(id_1) || answer_1.length >= REPORT_LEAST);
                    _c = isReport_1;
                    if (!_c) return [3 /*break*/, 10];
                    _d = ownsNothing;
                    return [4 /*yield*/, read($, todos)];
                case 9:
                    _c = _d.apply(void 0, [_k.sent(), id_1]);
                    _k.label = 10;
                case 10:
                    isIdleReport = _c;
                    isHandedBack_1 = how_1 === 'done' && (handedBack.has(id_1) || isIdleReport) && !isGoingOn;
                    if (!isHandedBack_1) return [3 /*break*/, 12];
                    _e = ownsNothing;
                    return [4 /*yield*/, read($, todos)];
                case 11:
                    (_e.apply(void 0, [_k.sent(), id_1]) ? leftNothing.add(id_1) : leftNothing.delete(id_1));
                    _k.label = 12;
                case 12:
                    handedBack.delete(id_1);
                    if (isHandedBack_1)
                        endedByHandback.add(id_1);
                    if (!!isHeld_1) return [3 /*break*/, 14];
                    return [4 /*yield*/, update($, todos, function (list) { return (list.some(function (one) { return one.id === id_1 && one.bg; }) ? list.map(function (one) { return (one.id === id_1 ? __assign(__assign({}, one), { bg: undefined, waitsSince: undefined }) : one); }) : list); })];
                case 13:
                    _k.sent();
                    _k.label = 14;
                case 14: return [4 /*yield*/, update($, todos, function (list) {
                        var isWaiting = how_1 === 'done' && !isHandedBack_1 && (isHeld_1 || list.some(function (one) { return one.parentId === id_1 && one.status === 'working'; }));
                        // What it waits on of its own, since when: the card says so, and a long wait for it is not taken for being stuck
                        // Work that gave its report waits on nothing it means to finish
                        var waitsSince = function (one) { var _a, _b; return (isHeld_1 && !isReport_1 && ((_a = one.bg) === null || _a === void 0 ? void 0 : _a.some(function (b) { return !b.isWatch; })) ? ((_b = one.waitsSince) !== null && _b !== void 0 ? _b : now_2) : undefined); };
                        // An aborted turn's own text is not kept over the report the work gave before it was stopped
                        return list.map(function (one) {
                            return one.id !== id_1
                                ? one
                                : // Work that had ended, woken by what it left running, that ends a turn of words alone has not worked again: it stays
                                    // as it ended, with its report, and is not announced a second time
                                    one.status !== 'working' && how_1 === 'done' && !isHandedBack_1 && endedByHandback.has(id_1)
                                        ? one
                                        : isWaiting
                                            ? __assign(__assign({}, one), { answer: answer_1 || one.answer, answeredAt: isReport_1 ? now_2 : one.answeredAt, waitsSince: waitsSince(one) }) : how_1 === 'stopped'
                                            ? one.status === 'working'
                                                ? ended(one, stoppedAs(one), now_2)
                                                : one
                                            : __assign(__assign({}, ended(one, how_1, now_2)), { answer: answer_1 || one.answer });
                        });
                    })];
                case 15:
                    _k.sent();
                    if (!(how_1 === 'stopped')) return [3 /*break*/, 17];
                    return [4 /*yield*/, keepStoppedReports($, now_2)];
                case 16:
                    _k.sent();
                    _k.label = 17;
                case 17: return [4 /*yield*/, lookEnds($)
                    // A reply it never read goes to the chat; work that waits for its helpers reads it at its next step
                ];
                case 18:
                    _k.sent();
                    return [4 /*yield*/, read($, todos)];
                case 19:
                    if (!(((_h = (_k.sent()).find(function (one) { return one.id === id_1; })) === null || _h === void 0 ? void 0 : _h.status) !== 'working')) return [3 /*break*/, 21];
                    return [4 /*yield*/, replyUnread($, id_1).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })];
                case 20:
                    _k.sent();
                    _k.label = 21;
                case 21:
                    if (!wakes.length) return [3 /*break*/, 23];
                    return [4 /*yield*/, sendWakes($).catch(function (err) { return log($, "answer not sent: ".concat(String(err))); })
                        // Work a message of the person's started that has finished leaves its report for good; a helper's answer is no report. Work
                        // held on its own background work leaves it once it ends (keepStoppedReports)
                    ];
                case 22:
                    _k.sent();
                    _k.label = 23;
                case 23: return [4 /*yield*/, read($, todos)];
                case 24:
                    card_1 = (_k.sent()).find(function (one) { return one.id === id_1; });
                    report_1 = ((_j = e.answer) !== null && _j !== void 0 ? _j : '').trim() || answer_1;
                    if (card_1 && !card_1.parentId && card_1.status === 'done' && card_1.endedAt === now_2 && how_1 === 'done' && report_1) {
                        $.clock.after(5, function () { return void saveReport($, card_1, report_1).catch(function (err) { return log($, "report of ".concat(id_1, " not kept: ").concat(String(err))); }); });
                    }
                    return [2 /*return*/, done];
                case 25:
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
    // word for word as an instruction file of the person's own, and the same text loaded from elsewhere is not sent twice. In a chat
    // the app runs on another Mac over ssh they end with the rule for what needs the person's hands there
    on('prompt.context', function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var r, files, _a, path, content, others, at, isAfar, _b, ours;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    r = _d.sent();
                    files = (_c = r.instructionFiles) !== null && _c !== void 0 ? _c : e.instructionFiles;
                    return [4 /*yield*/, inForce($, $.plugin.root, dir, 'rules/CLAUDE.md')];
                case 2:
                    _a = _d.sent(), path = _a.path, content = _a.text;
                    if (!files || !content.trim())
                        return [2 /*return*/, r
                            // Another copy of the mod loaded beside this one sends the same principles, with the rule for afar after them or not
                        ];
                    others = files.filter(function (one) { return !one.content.trim().startsWith(content.trim()); });
                    at = others.findIndex(function (one) { return one.kind !== 'managed'; });
                    _b = Boolean;
                    return [4 /*yield*/, $.env.get('CLAUDE_SSH_DAEMON_CHILD')];
                case 3:
                    isAfar = _b.apply(void 0, [_d.sent()]);
                    ours = { path: path, kind: 'user', content: isAfar ? "".concat(content.trimEnd(), "\n\n").concat(named(AFAR_RULE), "\n") : content };
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
