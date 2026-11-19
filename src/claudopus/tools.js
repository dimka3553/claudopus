// The mod's own tools: update, recall, todo, ask and note
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
var toolHooks = function (on) {
    on('tool.call', { tool: 'mcp__claudopus__update' }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var input, saved, path;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    input = e;
                    if (!((_a = input.name) === null || _a === void 0 ? void 0 : _a.trim()))
                        return [2 /*return*/, { result: 'A topic needs a name.' }];
                    return [4 /*yield*/, saveStream($, input.name, { repo: input.repo, state: (_b = input.state) === null || _b === void 0 ? void 0 : _b.slice(0, 60), summary: input.summary })
                        // The subject a piece of work recorded names the subject of its report
                    ];
                case 1:
                    saved = _e.sent();
                    if (!(e.agentId !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, change($, e.agentId, function (one) { return (__assign(__assign({}, one), { subject: saved.name })); })];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    path = "".concat(dir, "/streams/").concat(slug(saved.name), ".md");
                    if (!((_c = input.brief) === null || _c === void 0 ? void 0 : _c.trim())) return [3 /*break*/, 5];
                    return [4 /*yield*/, $.fs.write("".concat(dir, "/streams/").concat(slug(saved.name), ".md"), "".concat(input.brief.trim(), "\n"))];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5: return [2 /*return*/, { result: "- ".concat([saved.name, saved.repo, saved.session, saved.state, saved.summary].join(' | '), "\nNotes: ").concat(path).concat(((_d = input.brief) === null || _d === void 0 ? void 0 : _d.trim()) ? ' (rewritten)' : '') }];
            }
        });
    }); });
    on('tool.call', { tool: 'mcp__claudopus__recall' }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var query, r, archived, _a, lines, more;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    query = (_c = (_b = e.query) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
                    if (!query)
                        return [2 /*return*/, { result: 'Nothing to search for.' }];
                    return [4 /*yield*/, $.process.run(['grep', '-rniF', '--include=*.md', '-e', query, dir])
                        // A result the person put away is still found, marked, so it is answered from only when they name it
                    ];
                case 1:
                    r = _d.sent();
                    _a = Set.bind;
                    return [4 /*yield*/, loadReports($).catch(function () { return []; })];
                case 2:
                    archived = new (_a.apply(Set, [void 0, (_d.sent()).filter(function (one) { return one.archived; }).map(function (one) { return one.id; })]))();
                    lines = r.stdout
                        .split('\n')
                        .filter(Boolean)
                        .map(function (line) { return line.replace("".concat(dir, "/"), ''); })
                        .map(function (line) { var _a, _b; return (archived.has((_b = (_a = line.match(/^reports\/([^/]+)\//)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '') ? "[archived] ".concat(line) : line).slice(0, 240); })
                        // What a chat's helpers and tools brought comes after the chats' own words, notes and results, so it never crowds them out
                        .sort(function (a, b) { return Number(a.startsWith('work/')) - Number(b.startsWith('work/')); });
                    if (!lines.length)
                        return [2 /*return*/, { result: "Nothing in ".concat(dir, " mentions \"").concat(query, "\".") }];
                    more = lines.length > 40 ? "\n(".concat(lines.length - 40, " more lines; narrow the phrase)") : '';
                    return [2 /*return*/, { result: "Files are under ".concat(dir, ".\n").concat(lines.slice(0, 40).join('\n')).concat(more) }];
            }
        });
    }); });
    // The work lists what it sets out to do under its to-do, ticks it, rewords it or marks it dropped. A helper's list is its own,
    // on its own row: never added to the list of the task that started it, whose count is of its own to-dos
    on('tool.call', { tool: 'mcp__claudopus__todo' }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var input, text, state, old, items;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    input = e;
                    text = oneLine((_a = input.item) !== null && _a !== void 0 ? _a : '').slice(0, 200);
                    if (!text)
                        return [2 /*return*/, { result: 'A to-do needs its words.' }];
                    if (e.agentId === undefined)
                        return [2 /*return*/, { result: "Only a background task has a to-do in the panel; the chat has none." }];
                    state = input.state === 'done' || input.state === 'dropped' || input.state === 'open' || input.state === 'doing' ? input.state : undefined;
                    old = slug(((_b = input.was) === null || _b === void 0 ? void 0 : _b.trim()) ? input.was : text);
                    items = [];
                    return [4 /*yield*/, change($, e.agentId, function (one) {
                            var isListed = one.items.some(function (item) { return slug(item.text) === old; });
                            var next = isListed ? one.items.map(function (item) { return (slug(item.text) === old ? { text: text, state: state !== null && state !== void 0 ? state : item.state } : item); }) : __spreadArray(__spreadArray([], one.items, true), [{ text: text, state: state !== null && state !== void 0 ? state : 'open' }], false);
                            // One thing is being done at a time: what was being done before waits again
                            items = state === 'doing' ? next.map(function (item) { return (item.state === 'doing' && item.text !== text ? __assign(__assign({}, item), { state: 'open' }) : item); }) : next;
                            return __assign(__assign({}, one), { items: items });
                        }, true)];
                case 1:
                    _c.sent();
                    return [2 /*return*/, { result: items.map(function (item) { return "".concat(item.state === 'done' ? '[x]' : item.state === 'dropped' ? '[dropped]' : item.state === 'doing' ? '[doing]' : '[ ]', " ").concat(item.text); }).join('\n') }];
            }
        });
    }); });
    // Work that needs the person's hands now: its card stands out with the ask and its Copy, until they answer or the work clears it
    on('tool.call', { tool: 'mcp__claudopus__ask' }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var input, asked, text, given1, whole, details, given0, hasFolder, command, given, isProse, copy, folder, choices, givenPics, pictures, _i, givenPics_1, path, _a, at, before, was, releaseGiven, release, _b, list, card, terminal, shown, lost, long, tooLong, plain, leftOut, released, bare, seen, missing;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    input = e;
                    if (e.agentId === undefined)
                        return [2 /*return*/, { result: "Only a background task asks through the panel; the chat asks ".concat(who(), " in its reply.") }
                            // The question is one line; what it is about goes with it, whole, so the person never answers an ask whose reason has not reached
                            // them yet (a report reaches the chat only after the work ends). A question too long for one line is cut at a word on the card and
                            // kept whole at the top of its details
                        ];
                    asked = oneLine(typeof input.text === 'string' ? input.text : '');
                    text = asked.length > ASK_TEXT ? cut(asked, ASK_TEXT) : asked;
                    given1 = (typeof input.details === 'string' ? input.details : '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
                    whole = [text === asked ? '' : asked, given1].filter(Boolean).join('\n\n');
                    details = whole.length > ASK_DETAILS ? cut(whole, ASK_DETAILS) : whole;
                    // An ask that points at an explanation it does not carry is not shown: the person would see it before that explanation reaches them
                    if (!given1 && POINTS_AWAY.test(asked))
                        return [2 /*return*/, { result: "Not shown: the question points at an explanation it doesn't carry, and ".concat(who(), " sees a question before your report, which reaches them only after you finish. Ask it again with that explanation, in full, in `details`.") }];
                    given0 = oneLine(typeof input.command === 'string' ? input.command : '').slice(0, 1000);
                    hasFolder = typeof input.cwd === 'string' && input.cwd.startsWith('/');
                    // A command is given whole, runnable as it is wherever the person types it: it starts in its folder, and one that starts with a
                    // path relative to a folder never named is refused, since the person types it somewhere else
                    if (given0 && !hasFolder && /^(?:\.{1,2}\/|[\w-][\w.-]*\/)/.test(given0)) {
                        return [2 /*return*/, { result: 'Not shown: the command starts with a path relative to a folder it does not name. Give `cwd`, the full path of the folder it runs in, or a full path, so it runs as it is wherever it is typed.' }];
                    }
                    command = given0 && hasFolder && !/^cd\s/.test(given0) ? "cd ".concat(zshQuoted(String(input.cwd)), " && ").concat(given0) : given0;
                    given = (typeof input.copy === 'string' ? input.copy : '').trim().slice(0, 4000);
                    isProse = given.split(/\s+/).length > 8 && /[a-z]{3,} [a-z]{3,} [a-z]{3,}/i.test(given) && !/[\/=_$`@]|https?:/.test(given);
                    copy = command || (isProse || flat(text).includes(flat(given)) ? '' : given);
                    folder = typeof input.cwd === 'string' && input.cwd.startsWith('/') ? input.cwd : cwd;
                    choices = __spreadArray([], new Set((Array.isArray(input.choices) ? input.choices : []).filter(function (one) { return typeof one === 'string'; }).map(function (one) { return oneLine(one).slice(0, 40); }).filter(Boolean)), true).filter(function (one) { return !LEAVES_OPEN.test(plainWords(one)); }).slice(0, 4);
                    givenPics = __spreadArray([], new Set((Array.isArray(input.pictures) ? input.pictures : []).filter(function (one) { return typeof one === 'string'; }).map(function (one) { return one.trim(); }).filter(function (one) { return IMAGE.test(one); })), true).slice(0, 8);
                    pictures = [];
                    _i = 0, givenPics_1 = givenPics;
                    _g.label = 1;
                case 1:
                    if (!(_i < givenPics_1.length)) return [3 /*break*/, 5];
                    path = givenPics_1[_i];
                    _a = path.startsWith('/');
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
                case 2:
                    _a = ((_c = (_g.sent())) === null || _c === void 0 ? void 0 : _c.kind) === 'file';
                    _g.label = 3;
                case 3:
                    if (_a)
                        pictures.push(path);
                    _g.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [4 /*yield*/, $.clock.now()];
                case 6:
                    at = _g.sent();
                    return [4 /*yield*/, read($, todos)];
                case 7:
                    before = _g.sent();
                    was = (_d = before.find(function (one) { var _a; return one.id === topOf(before, (_a = e.agentId) !== null && _a !== void 0 ? _a : ''); })) === null || _d === void 0 ? void 0 : _d.ask;
                    releaseGiven = typeof input.release === 'string' ? input.release.trim() : '';
                    _b = releaseGiven.startsWith('/') && choices.length && !((_e = before.find(function (one) { return one.id === e.agentId; })) === null || _e === void 0 ? void 0 : _e.parentId);
                    if (!_b) return [3 /*break*/, 9];
                    return [4 /*yield*/, $.fs.stat(releaseGiven).catch(function () { return undefined; })];
                case 8:
                    _b = ((_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.kind) === 'dir';
                    _g.label = 9;
                case 9:
                    release = _b ? releaseGiven : '';
                    return [4 /*yield*/, change($, e.agentId, function (one) { return (__assign(__assign({}, one), { ask: text ? __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ text: text }, (release ? { release: release } : {})), (details ? { details: details } : {})), (copy ? { copy: copy } : {})), (command ? { isCommand: true, cwd: folder } : {})), (choices.length ? { choices: choices } : {})), { from: e.agentId }), (pictures.length ? { pictures: pictures } : {})), { at: at }) : undefined })); })];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, read($, todos)];
                case 11:
                    list = _g.sent();
                    card = list.find(function (one) { var _a; return one.id === topOf(list, (_a = e.agentId) !== null && _a !== void 0 ? _a : ''); });
                    if (!!text) return [3 /*break*/, 14];
                    if (!(card && was)) return [3 /*break*/, 13];
                    return [4 /*yield*/, askGone($, card)];
                case 12:
                    _g.sent();
                    _g.label = 13;
                case 13: return [2 /*return*/, { result: 'Cleared: your card no longer has a question.' }];
                case 14:
                    if (!(card && (was === null || was === void 0 ? void 0 : was.text) !== text)) return [3 /*break*/, 16];
                    return [4 /*yield*/, askAloud($, card, text).catch(function (err) { return log($, "ask not told: ".concat(String(err))); })];
                case 15:
                    _g.sent();
                    _g.label = 16;
                case 16:
                    if (!card) return [3 /*break*/, 18];
                    return [4 /*yield*/, askInChat($, card)
                        // A command for the person opens in a terminal only on their press of the card's button: nothing opens by itself
                    ];
                case 17:
                    _g.sent();
                    _g.label = 18;
                case 18:
                    terminal = command ? (isRunFromAfar ? " ".concat(who(true), " is on another device: they type it in their own session to this Mac, and nothing opens a terminal here.") : isLinux ? " Do not open a terminal for it: on Linux the card gives it with a Copy button, and ".concat(who(), " runs it in a terminal of their own.") : " Do not open a terminal for it: the card's Open in Terminal button opens one with the command typed when ".concat(who(), " presses it.")) : '';
                    shown = [command ? "the whole command".concat(command === given0 ? '' : " (".concat(command, ")"), ", a Copy button").concat(isRunFromAfar ? '' : ' and an Open in Terminal button') : copy ? 'a Copy button for the text' : '', "".concat(choices.length ? "the buttons ".concat(choices.join(', '), " and ") : '', "Answer in words")].filter(Boolean).join(' and ');
                    lost = givenPics.length - pictures.length;
                    long = text === asked ? '' : " The question was longer than one line: the card shows it cut at a word, and it is whole at the top of its details.";
                    tooLong = whole.length > ASK_DETAILS ? " Its details were longer than ".concat(ASK_DETAILS, " letters and were cut at a word: put what matters first.") : '';
                    plain = choices.length ? '' : " It has no buttons, so ".concat(who(), " can only answer in words: give `choices` when a press would answer it.");
                    leftOut = (Array.isArray(input.choices) ? input.choices : []).some(function (one) { return typeof one === 'string' && LEAVES_OPEN.test(plainWords(one)); }) ? ' A choice that only leaves the question open (Not now, Later, Skip, Cancel) was left out: not pressing does that, and every button is an answer.' : '';
                    released = release ? " A press on ".concat(choices[0], " also allows your next run of the release runner for ").concat(release, ", once, with no second question: run it then, in your background.") : releaseGiven ? ' `release` was left out: it needs buttons, and the full path of a folder that is there.' : '';
                    bare = choices.length && !details && !copy ? " It carries no details: if deciding it needs more than this one line (what goes out, what it changes), ask it again with that in `details`; ".concat(who(), " sees the ask before your report.") : '';
                    seen = pictures.length ? " Its ".concat(pictures.length === 1 ? 'picture is' : "".concat(pictures.length, " pictures are"), " drawn small on the card, each opening large on a press, and the chat shows ").concat(pictures.length === 1 ? 'it' : 'them', " in its next reply.") : '';
                    missing = lost ? " ".concat(lost, " of the pictures given ").concat(lost === 1 ? 'is' : 'are', " no picture file found here, by full path, and ").concat(lost === 1 ? 'was' : 'were', " left out.") : '';
                    return [2 /*return*/, { result: "Shown on your card with ".concat(details ? 'what it is about under it, ' : '').concat(shown, ", and shown in the chat as a notice from the panel").concat(details ? ' with what it is about' : '', ", where ").concat(who(), " can answer it too.").concat(seen).concat(missing).concat(long).concat(tooLong).concat(bare).concat(plain).concat(leftOut).concat(released, " It stays until ").concat(who(), " answers; the answer comes back to you as a message the moment it is given, at your next step or to you paused. Never wait for it with a command or a timer: with nothing else to do, end your step. Ask again if the answer leaves something waiting. Clear it with empty text only once you have seen it done.").concat(terminal) }];
            }
        });
    }); });
    // The work writes its own log, on purpose, in plain words: what it starts and what it decides
    on('tool.call', { tool: 'mcp__claudopus__note' }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var input, asked, text, kind, task, list, card, words, handed;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    input = e;
                    asked = Array.isArray(input.questions) ? input.questions.map(function (one) { return oneLine(typeof one === 'string' ? one : '').slice(0, QUESTION_CHARS); }).filter(Boolean).slice(0, QUESTIONS_KEPT) : undefined;
                    text = oneLine((_a = input.text) !== null && _a !== void 0 ? _a : '').slice(0, NOTE_CHARS);
                    if (!text)
                        return [2 /*return*/, { result: 'A note needs its text.' }];
                    if (e.agentId === undefined)
                        return [2 /*return*/, { result: "Only a background task keeps a log in the panel; the chat has none." }];
                    kind = input.decision ? 'decision' : 'note';
                    return [4 /*yield*/, change($, e.agentId, function (one, at) { return (__assign(__assign(__assign({}, one), { entries: __spreadArray(__spreadArray([], one.entries, true), [{ at: at, kind: kind, text: text }], false).slice(-ENTRIES_KEPT) }), (asked && one.id === e.agentId ? { questions: asked.length ? asked : undefined } : {}))); })
                        // A steer the work found to be a new task of its own goes back to the chat, which starts it. The work sends it itself, as a
                        // message to the chat: it arrives as the work's and wakes the chat, where a prompt the mod submitted would show as the person's own.
                        // A session cannot send to itself, so the mod cannot send it for the work
                    ];
                case 1:
                    _f.sent();
                    task = oneLine((_b = input.task) !== null && _b !== void 0 ? _b : '').slice(0, 400);
                    if (!task)
                        return [2 /*return*/, { result: 'Noted.' }];
                    return [4 /*yield*/, read($, todos)];
                case 2:
                    list = _f.sent();
                    card = list.find(function (one) { var _a; return one.id === topOf(list, (_a = e.agentId) !== null && _a !== void 0 ? _a : ''); });
                    words = (_e = (_d = __spreadArray([], ((_c = card === null || card === void 0 ? void 0 : card.entries) !== null && _c !== void 0 ? _c : []), true).reverse().find(function (entry) { return entry.kind === 'steer'; })) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : '';
                    said = words || task;
                    handed = "A message from ".concat(who(), " to the task \"").concat((card === null || card === void 0 ? void 0 : card.title) || 'in the background', "\" is a new task of its own, not part of that task, and that task hasn't done it. Start it as its own background task: ").concat(task).concat(words ? "\n".concat(who(true), "'s words: \u201C").concat(words, "\u201D") : '');
                    return [2 /*return*/, { result: "Noted. Hand the task to the chat now: call SendMessage (load it with ToolSearch if needed) with to \"main\" and this message, exactly:\n".concat(handed, "\nThen continue your own task; don't do that new one here.") }];
            }
        });
    }); });
};
