"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkOf = exports.APP_ID = exports.BRIDGE_ID = exports.macName = exports.isMac = exports.clockOf = exports.opensOf = exports.openTake = exports.OPEN_MARK = exports.OPEN_KEPT = exports.OPEN_EVERY = exports.tripOf = exports.stuckOf = exports.APP_LOG_LOOK = exports.offOf = exports.OFF_LOOK = exports.trip = exports.pushHead = exports.pushOf = exports.isAnswerName = exports.keyOf = exports.isKey = exports.ANSWER_MARK = exports.OUTBOX = exports.PUSHED = exports.fetchedOf = exports.MARK = exports.answerOf = exports.ANSWER_KEPT = exports.chatSide = exports.chatName = exports.ordered = exports.cardsOf = exports.remoteId = exports.REMOTE = exports.fetchedOpen = exports.openChatOf = exports.sharedOf = exports.promptsOf = exports.signOf = exports.shareable = exports.ENDED_FOR = exports.ENDED_SHARED = exports.FETCH_EVERY = exports.LOOK_EVERY = exports.STALE = exports.BEAT = exports.MACS = exports.ANSWERS = exports.LIVE_DIR = void 0;
exports.headMood = exports.headLine = exports.openUrl = void 0;
// ---- Every chat's work in every panel: each chat keeps its running work in a small file of its own, the others read it ----
// ~/.claude/claudopus/live/<chat id>.json, written only by that chat; an answer to one of its asks from another chat's panel is
// left for it in live/answers/<chat id>/, which it reads and acts on as if pressed in its own panel
exports.LIVE_DIR = 'live';
exports.ANSWERS = 'answers';
// The other Macs' files, as last fetched, one per Mac: live/macs/<host>.json, shared by every chat on this Mac
exports.MACS = 'macs';
// Every open chat writes its file again at least this often, work or none, so a file not written for STALE has lost its chat: it
// was closed, it crashed, or its Mac is asleep or gone. It then shows nowhere, and its work never as running for ever
exports.BEAT = 20000;
exports.STALE = 90000;
// Other chats' files are read this often; the other Macs' fetched this often, by whichever chat on this Mac comes first
exports.LOOK_EVERY = 5000;
exports.FETCH_EVERY = 10000;
// What one card carries to other chats: enough for its small card and its Details, not its whole log
var ITEMS_SHARED = 30;
var WORDS_SHARED = 1200;
// Work that ended is shown in other chats' panels too, where it turns happy and folds into Finished as in its own: the newest few
// that ended in the last hours, while its chat is open
exports.ENDED_SHARED = 10;
exports.ENDED_FOR = 12 * 3600000;
// The work of this chat that other chats show: running work, ended work that still waits on an answer from its buttons, and the
// work that ended lately
var shareable = function (list, now) {
    if (now === void 0) { now = 0; }
    return list
        .filter(function (one) { return !one.parentId && !one.chat; })
        .filter(function (one, _, all) { var _a, _b; return one.status === 'working' || Boolean((_b = (_a = one.ask) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b.length) || (one.endedAt > now - exports.ENDED_FOR && all.filter(function (other) { return other.status !== 'working' && other.endedAt > one.endedAt; }).length < exports.ENDED_SHARED); })
        .map(function (one) { return (__assign(__assign({}, one), { words: one.words.slice(0, WORDS_SHARED), items: one.items.slice(-ITEMS_SHARED), entries: __spreadArray([], one.entries, true).reverse().filter(function (entry) { return entry.kind !== 'steer'; }).slice(0, 1), answer: '' })); });
};
exports.shareable = shareable;
// What tells one shared state from another, the running times aside: a file is written again when it changes or its beat is due
var signOf = function (cards) {
    return JSON.stringify(cards.map(function (one) { var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k; return [one.id, one.status, one.title, one.model, one.tokens, one.items, (_b = (_a = one.entries.at(-1)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '', (_d = (_c = one.ask) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : '', (_f = (_e = one.ask) === null || _e === void 0 ? void 0 : _e.at) !== null && _f !== void 0 ? _f : 0, (_h = (_g = one.ask) === null || _g === void 0 ? void 0 : _g.copy) !== null && _h !== void 0 ? _h : '', (_k = (_j = one.ask) === null || _j === void 0 ? void 0 : _j.choices) !== null && _k !== void 0 ? _k : []]; }));
};
exports.signOf = signOf;
// The prompts a chat's file carries, as far as they are whole: at most a few, each cut short
var PROMPTS_SHARED = 6;
var promptsOf = function (list) {
    return (Array.isArray(list) ? list : [])
        .filter(function (one) { return Boolean(one && typeof one.id === 'string' && one.id && typeof one.text === 'string' && one.text && typeof one.at === 'number'); })
        .filter(function (one, i, all) { return all.findIndex(function (other) { return other.id === one.id; }) === i; })
        .slice(0, PROMPTS_SHARED)
        .map(function (one) { return (__assign(__assign({ id: one.id.slice(0, 80), text: plain(one.text).slice(0, 200) }, (typeof one.title === 'string' && plain(one.title) ? { title: plain(one.title).slice(0, 120) } : {})), { at: one.at })); });
};
exports.promptsOf = promptsOf;
// Text from another chat's file with no control characters, so nothing in it can move or colour the terminal
var plain = function (text) { return text.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim(); };
// A chat's file as read, or nothing when it is no such file, has not been written for too long, or has nothing going on: no work,
// running or ended lately, and no prompt (an open chat with nothing going on is not listed, on any Mac). `now` is the clock of the
// Mac that wrote it, so a Mac whose clock runs apart from this one's is judged by its own
var sharedOf = function (text, now, host) {
    if (host === void 0) { host = ''; }
    try {
        var one = JSON.parse(text);
        if (typeof one.chat !== 'string' || !one.chat || typeof one.at !== 'number' || !Array.isArray(one.cards))
            return undefined;
        if (now - one.at > exports.STALE)
            return undefined;
        // Running work under `cards`, ended work apart under `ended`, so a version that reads `cards` alone never shows ended work as running
        var cards = __spreadArray(__spreadArray([], one.cards, true), (Array.isArray(one.ended) ? one.ended : []), true).filter(function (card) { return Boolean(card && typeof card.id === 'string' && card.id && Array.isArray(card.items) && Array.isArray(card.entries)); });
        // A chat waiting on its own prompt is listed whether or not it has work
        var prompts = (0, exports.promptsOf)(one.prompts);
        if (!cards.length && !prompts.length)
            return undefined;
        var link = (0, exports.linkOf)(one.link);
        return __assign(__assign({ chat: one.chat, title: typeof one.title === 'string' ? one.title : '', folder: typeof one.folder === 'string' ? one.folder : '', host: host || (typeof one.host === 'string' ? one.host : ''), at: one.at, cards: cards }, (prompts.length ? { prompts: prompts } : {})), (link ? { link: link } : {}));
    }
    catch (_a) {
        return undefined;
    }
};
exports.sharedOf = sharedOf;
// The chat a file is of, as `host/chat`, while it is open (written within STALE), whether or not it has anything going on
var openChatOf = function (text, now, host) {
    if (host === void 0) { host = ''; }
    try {
        var one = JSON.parse(text);
        return typeof one.chat === 'string' && one.chat && typeof one.at === 'number' && now - one.at <= exports.STALE ? "".concat(host || (typeof one.host === 'string' ? one.host : ''), "/").concat(one.chat) : '';
    }
    catch (_a) {
        return '';
    }
};
exports.openChatOf = openChatOf;
// The same for each chat of a fetch from another Mac, judged by that Mac's clock
var fetchedOpen = function (text, host) {
    var _a = text.split("".concat(exports.MARK, "\n")), files = _a.slice(1);
    var now = (0, exports.clockOf)(text);
    return now ? files.map(function (one) { return (0, exports.openChatOf)(one, now, host); }).filter(Boolean) : [];
};
exports.fetchedOpen = fetchedOpen;
// The cards of other chats as this panel lists them: each names its chat, and its id is kept apart from this chat's own
exports.REMOTE = 'r-';
// The chat and its Mac in a few letters, so the id stays short enough to name a Details tab whole
var short = function (text) { return __spreadArray([], text, true).reduce(function (sum, ch) { return (sum * 31 + ch.charCodeAt(0)) % 2147483647; }, 7).toString(36); };
var remoteId = function (s, id) { return "".concat(exports.REMOTE).concat(short("".concat(s.host, "/").concat(s.chat)), "-").concat(id); };
exports.remoteId = remoteId;
var cardsOf = function (list) {
    return list.flatMap(function (s) { return s.cards.map(function (one) { return (__assign(__assign({}, one), { id: (0, exports.remoteId)(s, one.id), chat: { id: s.chat, title: s.title, folder: s.folder, host: s.host, agent: one.id } })); }); });
};
exports.cardsOf = cardsOf;
// The other chats in the order the panel shows them: those that wait on the person first (an open prompt, which holds its chat up,
// before an ask), then the one whose running work began first, then the open chats with none running, by name
var firstStart = function (s) {
    var running = s.cards.filter(function (one) { return one.status === 'working' || one.ask; });
    return running.length ? Math.min.apply(Math, running.map(function (one) { return one.startedAt; })) : Number.MAX_SAFE_INTEGER;
};
var waits = function (s) { var _a; return (((_a = s.prompts) === null || _a === void 0 ? void 0 : _a.length) ? 2 : s.cards.some(function (one) { return one.ask; }) ? 1 : 0); };
var ordered = function (list) {
    return __spreadArray([], list, true).sort(function (a, b) { return waits(b) - waits(a) || firstStart(a) - firstStart(b) || (0, exports.chatName)(a).localeCompare((0, exports.chatName)(b)); });
};
exports.ordered = ordered;
// What a chat is called above its cards: its title, else its folder's name, and the Mac it runs on when that is another
var chatName = function (c) { return c.title.trim() || c.folder.split('/').filter(Boolean).pop() || 'Another chat'; };
exports.chatName = chatName;
// Its folder, unless the name already is the folder, and the Mac it runs on when another
// (`self` names this Mac, for a chat of this Mac once other Macs' chats are listed beside it)
var chatSide = function (c, self) {
    var _a;
    if (self === void 0) { self = ''; }
    var folder = (_a = c.folder.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : '';
    return [folder === (0, exports.chatName)(c) ? '' : folder, c.host ? "on ".concat((0, exports.macName)(c.host)) : self ? "on ".concat(self) : ''].filter(Boolean).join(' · ');
};
exports.chatSide = chatSide;
// An answer that waited longer than this, as for a chat that was closed and opened again much later, is dropped, not acted on
exports.ANSWER_KEPT = 10 * 60000;
var answerOf = function (text) {
    try {
        var one = JSON.parse(text);
        return typeof one.card === 'string' && typeof one.choice === 'string' && one.choice.trim() ? { card: one.card, choice: one.choice, isReply: Boolean(one.isReply), ask: typeof one.ask === 'string' ? one.ask : '', askAt: Number(one.askAt) || 0, at: Number(one.at) || 0 } : undefined;
    }
    catch (_a) {
        return undefined;
    }
};
exports.answerOf = answerOf;
// What one fetch of another Mac answers: its clock, then each chat's file, each on one line. Lines that are not a file are left out
exports.MARK = '---claudopus-live---';
// That Mac's times are moved onto this one's clock by how far apart the two were at the fetch, so running times and order hold
var fetchedOf = function (text, host, fetchedAt) {
    var _a, _b;
    if (fetchedAt === void 0) { fetchedAt = 0; }
    var _c = text.split("".concat(exports.MARK, "\n")), _d = _c[0], head = _d === void 0 ? '' : _d, files = _c.slice(1);
    // Its clock is the last line of digits before the first file: a login banner above it is passed over
    var now = Number((_b = (_a = __spreadArray([], head.split('\n'), true).reverse().find(function (line) { return /^\d{9,}$/.test(line.trim()); })) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : 0) * 1000;
    if (!now)
        return [];
    var shift = fetchedAt ? fetchedAt - now : 0;
    var moved = function (at) { return (at ? at + shift : at); };
    return files
        .map(function (one) { return (0, exports.sharedOf)(one, now, host); })
        .filter(function (one) { return one !== undefined; })
        .map(function (one) { return (__assign(__assign(__assign({}, one), { at: moved(one.at), cards: one.cards.map(function (card) { return (__assign(__assign({}, card), { startedAt: moved(card.startedAt), endedAt: moved(card.endedAt) })); }) }), (one.prompts ? { prompts: one.prompts.map(function (p) { return (__assign(__assign({}, p), { at: moved(p.at) })); }) } : {}))); });
};
exports.fetchedOf = fetchedOf;
// ---- The same trip the other way: a Mac that reaches another over ssh hands it its own chats, so that Mac's panels list them with
// no ssh back and no setting there. It lands there as live/pushed/<this Mac>.json, in the fetch's own form under one line saying who
// handed it and what it calls the Mac it handed it to; an answer pressed there for one of these chats waits in
// live/outbox/<this Mac>/ until the next trip carries it here, and is put away there on the trip after ----
exports.PUSHED = 'pushed';
exports.OUTBOX = 'outbox';
exports.ANSWER_MARK = '---claudopus-answer---';
// A Mac's name as it is handed over and shown: small letters, digits and dashes
var isKey = function (one) { return typeof one === 'string' && /^[a-z0-9][a-z0-9-]{0,62}$/.test(one); };
exports.isKey = isKey;
var keyOf = function (name) { return name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 63); };
exports.keyOf = keyOf;
// An answer's file name, as answerElsewhere makes it
var isAnswerName = function (one) { return /^\d+-[a-z0-9]+\.json$/.test(one); };
exports.isAnswerName = isAnswerName;
// What this Mac hands over: who it is and what it calls that Mac, its clock in seconds, then each of its chats' files on one line
var pushOf = function (from, you, now, files) {
    return "".concat(JSON.stringify({ from: from, you: you }), "\n").concat(Math.floor(now / 1000), "\n").concat(files.map(function (one) { return "".concat(exports.MARK, "\n").concat(one.replace(/\n/g, ''), "\n"); }).join(''));
};
exports.pushOf = pushOf;
var pushHead = function (text) {
    try {
        var one = JSON.parse(text.slice(0, Math.max(0, text.indexOf('\n'))));
        return (0, exports.isKey)(one.from) ? { from: one.from, you: (0, exports.isKey)(one.you) ? one.you : '' } : undefined;
    }
    catch (_a) {
        return undefined;
    }
};
exports.pushHead = pushHead;
// The command of one trip, run there by sh: leave what this Mac hands over, put away the answers the last trip carried and any
// older than an hour, then its clock in seconds and the chats there running without Claudopus, then every chat file there written
// in the last three minutes, followed by the answers waiting for this Mac
var trip = function (from, acks) {
    var out = "$L/".concat(exports.OUTBOX, "/").concat(from);
    var put = acks.filter(exports.isAnswerName);
    return "sh -c 'L=$HOME/.claude/claudopus/".concat(exports.LIVE_DIR, "; mkdir -p $L/").concat(exports.PUSHED, " ").concat(out, "; cat > $L/").concat(exports.PUSHED, "/").concat(from, ".$$.part && mv -f $L/").concat(exports.PUSHED, "/").concat(from, ".$$.part $L/").concat(exports.PUSHED, "/").concat(from, ".json; cd ").concat(out, " && { ").concat(put.length ? "rm -f ".concat(put.join(' '), "; ") : '', "find . -name \"*.json\" -mmin +60 -exec rm -f {} +; }; cd; date +%s; ").concat(exports.OFF_LOOK, " for f in $(find $L -maxdepth 1 -name \"*.json\" -mmin -3 2>/dev/null); do echo ").concat(exports.MARK, "; tr -d \"\\n\" < \"$f\"; echo; done; for f in $(find ").concat(out, " -maxdepth 1 -name \"*.json\" 2>/dev/null); do echo ").concat(exports.ANSWER_MARK, "; basename \"$f\"; tr -d \"\\n\" < \"$f\"; echo; done'");
};
exports.trip = trip;
// ---- Chats running without Claudopus. The Claude app runs a chat on another Mac over SSH with that Mac's own install, unless it
// decided once that the install "didn't load there": from then until the app quits it hands every new chat there its own copy,
// which leaves out the hooks folder, so in that chat no Claudopus code runs at all (no panel, tools, rules or shared file) ----
// The look, run by sh, with no single quote so a trip can carry it: each engine on this Mac started with a --plugin-dir that is a
// Claudopus with no hooks/hooks.json, as `off <chat id> <its title file>`; `new` for an engine that names no chat
exports.OFF_LOOK = "set -f; ps -axww -o args= 2>/dev/null | grep -e \"--plugin-dir\" | sed \"s/--plugin-dir /--plugin-dir=/g\" | while read -r a; do for w in $a; do case $w in --plugin-dir=/*) d=${w#--plugin-dir=}; if grep -qs \"\\\"name\\\": *\\\"claudopus\\\"\" \"$d/.claude-plugin/plugin.json\" && [ ! -e \"$d/hooks/hooks.json\" ]; then s=new; for v in $a; do case $v in --resume=*) s=${v#--resume=};; --session-id=*) s=${v#--session-id=};; esac; done; set +f; t=$(cat $HOME/.claude/projects/*/\"$s\"/custom-title.json 2>/dev/null | head -c 400 | tr -d \"\\n\"); set -f; echo \"off $s $t\"; fi;; esac; done; done; set +f;";
var offOf = function (text) {
    var _a = text.split("".concat(exports.MARK, "\n"))[0], head = _a === void 0 ? '' : _a;
    var found = head.split('\n').flatMap(function (line) {
        var _a;
        var m = /^off ([A-Za-z0-9_-]{1,80}) ?(.*)$/.exec(line.trim());
        if (!m)
            return [];
        var title = '';
        try {
            var t = JSON.parse(m[2] || '{}').customTitle;
            title = typeof t === 'string' ? plain(t).slice(0, 120) : '';
        }
        catch (_b) {
            title = '';
        }
        return [{ chat: (_a = m[1]) !== null && _a !== void 0 ? _a : '', title: title }];
    });
    return found.filter(function (one, i) { return found.findIndex(function (other) { return other.chat === one.chat; }) === i; });
};
exports.offOf = offOf;
// The app's own log on this Mac: the last time it started, or decided a Mac's own install didn't load there. The decision holds,
// in the app's memory only, until the app is quit, so the last of the two says whether it holds now
exports.APP_LOG_LOOK = "cd \"$HOME/Library/Logs/Claude\" 2>/dev/null && cat main1.log main.log 2>/dev/null | grep -a -E \"\\[info\\] Starting app|own install did not load there\" | tail -1";
// When the app decided it, by its log's own clock, or '' while it does not hold
var stuckOf = function (text) {
    var _a, _b, _c;
    var line = (_a = text.trim().split('\n').at(-1)) !== null && _a !== void 0 ? _a : '';
    return /did not load there/.test(line) ? ((_c = (_b = /^(\d{4}-\d\d-\d\d \d\d:\d\d)/.exec(line)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 'earlier') : '';
};
exports.stuckOf = stuckOf;
// What a trip answers: the fetch, as fetchedOf reads it, and the answers it carried back
var tripOf = function (text) {
    var _a = text.split("".concat(exports.ANSWER_MARK, "\n")), _b = _a[0], fetched = _b === void 0 ? '' : _b, rest = _a.slice(1);
    var carried = rest.flatMap(function (part) {
        var _a;
        var _b = part.split('\n'), _c = _b[0], name = _c === void 0 ? '' : _c, _d = _b[1], body = _d === void 0 ? '' : _d;
        var answer = (0, exports.answerOf)(body);
        var chat = '';
        try {
            chat = String((_a = JSON.parse(body).chat) !== null && _a !== void 0 ? _a : '');
        }
        catch (_e) {
            chat = '';
        }
        return (0, exports.isAnswerName)(name) && answer && /^[A-Za-z0-9_-]+$/.test(chat) ? [{ name: name, chat: chat, answer: answer }] : [];
    });
    return { text: fetched, carried: carried };
};
exports.tripOf = tripOf;
// ---- A press on a chat's name in a chat another Mac's Claude app runs here over SSH: that app, and the screen the person looks
// at, are on the other Mac, so the press is left in live/outbox/<that Mac>/ as o-<time>-<id>.json, which that Mac takes within
// OPEN_EVERY and opens there with what its own app holds. One pressed more than OPEN_KEPT before it is taken is dropped, not opened late ----
exports.OPEN_EVERY = 2000;
exports.OPEN_KEPT = 30000;
exports.OPEN_MARK = '---claudopus-open---';
// The command that takes them there, run by sh: its clock in seconds, then each press, every file moved aside before it is read so
// two chats taking at once never take one twice
var openTake = function (from) {
    return "sh -c 'cd $HOME/.claude/claudopus/".concat(exports.LIVE_DIR, "/").concat(exports.OUTBOX, "/").concat(from, " 2>/dev/null || exit 0; find . -name \"o-*\" -mmin +60 -exec rm -f {} + 2>/dev/null; date +%s; for f in o-*.json; do [ -f \"$f\" ] && mv \"$f\" \"$f.$$\" 2>/dev/null && { echo ").concat(exports.OPEN_MARK, "; tr -d \"\\n\" < \"$f.$$\"; echo; rm -f \"$f.$$\"; }; done'");
};
exports.openTake = openTake;
// The chats those presses name, each once, as far as they were pressed within OPEN_KEPT by that Mac's clock
var opensOf = function (text) {
    var _a, _b;
    var _c = text.split("".concat(exports.OPEN_MARK, "\n")), _d = _c[0], head = _d === void 0 ? '' : _d, parts = _c.slice(1);
    var now = Number((_b = (_a = __spreadArray([], head.split('\n'), true).reverse().find(function (line) { return /^\d{9,}$/.test(line.trim()); })) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : 0) * 1000;
    if (!now)
        return [];
    var chats = parts.flatMap(function (part) {
        var _a;
        try {
            var one = JSON.parse((_a = part.split('\n')[0]) !== null && _a !== void 0 ? _a : '');
            var at = Number(one.at) || 0;
            return typeof one.chat === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(one.chat) && Math.abs(now - at) <= exports.OPEN_KEPT ? [one.chat] : [];
        }
        catch (_b) {
            return [];
        }
    });
    return __spreadArray([], new Set(chats), true);
};
exports.opensOf = opensOf;
// That Mac's clock as the head of a fetch gives it, in ms
var clockOf = function (text) {
    var _a, _b;
    var _c = text.split("".concat(exports.MARK, "\n"))[0], head = _c === void 0 ? '' : _c;
    return Number((_b = (_a = __spreadArray([], head.split('\n'), true).reverse().find(function (line) { return /^\d{9,}$/.test(line.trim()); })) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : 0) * 1000;
};
exports.clockOf = clockOf;
// A Mac named in config.json `macs`, as ssh takes it: user@host, or a Host line of ~/.ssh/config. Nothing else is run
var isMac = function (one) { return typeof one === 'string' && /^[A-Za-z0-9_][A-Za-z0-9_.-]*(@[A-Za-z0-9_][A-Za-z0-9_.-]*)?$/.test(one); };
exports.isMac = isMac;
var macName = function (one) { var _a, _b; return (_b = ((_a = one.split('@').pop()) !== null && _a !== void 0 ? _a : one).split('.')[0]) !== null && _b !== void 0 ? _b : one; };
exports.macName = macName;
// ---- The link a press on a chat's name opens ----
// The ids the Claude app takes, as it checks them: a Remote Control or cloud session, and its own session on this Mac
exports.BRIDGE_ID = /^(cse|session)_[A-Za-z0-9_-]{1,80}$/;
exports.APP_ID = /^local_[A-Za-z0-9-]{1,64}$/;
var linkOf = function (one) {
    var _a, _b;
    // A chat on a version before names were pressed gives the app's own link whole
    if (typeof one === 'string') {
        var app = (_b = (_a = /^claude:\/\/code\/continue\?session=(local_[A-Za-z0-9-]{1,64})$/.exec(one)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
        return app ? { bridge: '', app: app } : undefined;
    }
    if (!one || typeof one !== 'object')
        return undefined;
    var l = one;
    var link = { bridge: typeof l.bridge === 'string' && exports.BRIDGE_ID.test(l.bridge) ? l.bridge : '', app: typeof l.app === 'string' && exports.APP_ID.test(l.app) ? l.app : '' };
    return link.bridge || link.app ? link : undefined;
};
exports.linkOf = linkOf;
// What a press on a chat's name opens in the Claude app. The app's own id first whenever this Mac's app holds that chat (`held`): one
// of this Mac's, or one it runs on another Mac over SSH, which it lists in its own sidebar. Else its Remote Control session, which the
// app opens from any Mac; else, for a chat of this Mac, the app's id it shares. A chat of another Mac's own app with Remote Control off
// has nothing this Mac can open
var openUrl = function (c, held) {
    var _a, _b, _c;
    if (held === void 0) { held = ''; }
    var app = exports.APP_ID.test(held) ? held : !c.host ? ((_b = (_a = c.link) === null || _a === void 0 ? void 0 : _a.app) !== null && _b !== void 0 ? _b : '') : '';
    return app ? "claude://code/continue?session=".concat(app) : ((_c = c.link) === null || _c === void 0 ? void 0 : _c.bridge) ? "claude://code/".concat(c.link.bridge) : '';
};
exports.openUrl = openUrl;
var things = function (n) { return (n === 1 ? '1 thing' : "".concat(n, " things")); };
var headLine = function (_a) {
    var here = _a.here, there = _a.there, chats = _a.chats, asks = _a.asks, isDone = _a.isDone;
    var running = here + there;
    if (asks)
        return "".concat(things(asks), " ").concat(asks === 1 ? 'needs' : 'need', " you").concat(running ? ", ".concat(running, " running") : '');
    var others = chats === 1 ? '1 other chat' : "".concat(chats, " other chats");
    if (here && there)
        return "Working on ".concat(things(running), " here and in ").concat(others);
    if (there)
        return "Working on ".concat(things(there), " in ").concat(chats === 1 ? 'another chat' : others);
    if (here)
        return "Working on ".concat(things(here));
    return isDone ? 'Just finished' : 'Nothing is running';
};
exports.headLine = headLine;
// The octopus beside it: happy for the moment work finishes, whatever else goes on, so no finish passes unseen; else amber while
// anything needs the person, at work while anything runs, resting only when nothing goes on anywhere
var headMood = function (_a) {
    var here = _a.here, there = _a.there, asks = _a.asks, isDone = _a.isDone;
    return (isDone ? 'happy' : asks ? 'asking' : here + there ? 'working' : 'mark');
};
exports.headMood = headMood;
