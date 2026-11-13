// Every chat's work in every chat's panel: this chat's file, the others' read, chats opened and answered from another chat
// (../../mods/claudopus/hooks/shared.ts says how)
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
// ---- The work of every chat, in every chat's panel (shared.ts says how) ----
var others = atom({ plugin: 'claudopus', key: 'others' }, [], { shape: 'others-1' });
var liveDir = function () { return "".concat(dir, "/").concat(LIVE_DIR); };
// What this chat last wrote to its file and when: written again when it changes or its beat is due, with work or without, so the
// panels of other Macs list it as open. It is removed as the chat ends
var sharedSign = '';
var sharedAt = 0;
var ownLive = function (id) { return "".concat(liveDir(), "/").concat(id, ".json"); };
// Set as the session ends, so a beat due after it does not write the file again
var isEnded = false;
// What opens this chat in the Claude app, read off the engine's own file of this session in ~/.claude/sessions (its Remote Control id
// appears there once Remote Control is on) at most once a beat; the file found is read again alone until it no longer names this chat
var myLink;
var linkReadAt = 0;
var linkFile = '';
var readLink = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var folder, _a, entryOf, found, _b, _i, _c, entry, one, host, bridge, app;
    var _this = this;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = "".concat;
                return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                folder = _a.apply("", [(_d = (_h.sent())) !== null && _d !== void 0 ? _d : '', "/.claude/sessions"]);
                entryOf = function (name) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, readOr($, "".concat(folder, "/").concat(name))];
                        case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()) || '{}'])];
                    }
                }); }); };
                if (!linkFile) return [3 /*break*/, 3];
                return [4 /*yield*/, entryOf(linkFile).catch(function () { return ({}); })];
            case 2:
                _b = _h.sent();
                return [3 /*break*/, 4];
            case 3:
                _b = {};
                _h.label = 4;
            case 4:
                found = _b;
                if (!(found.sessionId !== id)) return [3 /*break*/, 9];
                linkFile = '';
                found = {};
                _i = 0;
                return [4 /*yield*/, $.fs.list(folder).catch(function () { return []; })];
            case 5:
                _c = _h.sent();
                _h.label = 6;
            case 6:
                if (!(_i < _c.length)) return [3 /*break*/, 9];
                entry = _c[_i];
                if (entry.kind !== 'file' || !entry.name.endsWith('.json'))
                    return [3 /*break*/, 8];
                return [4 /*yield*/, entryOf(entry.name).catch(function () { return ({}); })];
            case 7:
                one = _h.sent();
                if (one.sessionId === id && ((_e = one.updatedAt) !== null && _e !== void 0 ? _e : 0) >= ((_f = found.updatedAt) !== null && _f !== void 0 ? _f : 0))
                    ((found = one), (linkFile = entry.name));
                _h.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, $.env.get('CLAUDE_CODE_HOST_SESSION_ID')];
            case 10:
                host = (_g = (_h.sent())) !== null && _g !== void 0 ? _g : '';
                bridge = typeof found.bridgeSessionId === 'string' && BRIDGE_ID.test(found.bridgeSessionId) ? found.bridgeSessionId : '';
                app = APP_ID.test(host) ? host : typeof found.hostSessionId === 'string' && APP_ID.test(found.hostSessionId) ? found.hostSessionId : '';
                return [2 /*return*/, bridge || app ? { bridge: bridge, app: app } : undefined];
        }
    });
}); };
var shareMine = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a, id, title, now, cards, _b, prompts, sign, s, isLive, ended;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                _a = _c.sent(), id = _a.id, title = _a.title;
                if (!id || !dir || isOff || isEnded)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _c.sent();
                if (!(now - linkReadAt >= BEAT)) return [3 /*break*/, 4];
                linkReadAt = now;
                return [4 /*yield*/, readLink($, id).catch(function () { return myLink; })];
            case 3:
                myLink = _c.sent();
                _c.label = 4;
            case 4:
                _b = shareable;
                return [4 /*yield*/, read($, todos)];
            case 5:
                cards = _b.apply(void 0, [_c.sent(), now]);
                prompts = waiting.map(function (_a) {
                    var one = _a.id, text = _a.text, from = _a.title, at = _a.at;
                    return (__assign(__assign({ id: one, text: text }, (from ? { title: from } : {})), { at: at }));
                });
                sign = "".concat(title, "\n").concat(JSON.stringify(myLink !== null && myLink !== void 0 ? myLink : null), "\n").concat(signOf(cards), "\n").concat(prompts.map(function (one) { return one.id; }).join(' '));
                if (sign === sharedSign && now - sharedAt < BEAT)
                    return [2 /*return*/];
                s = __assign(__assign({ chat: id, title: title, folder: cwd, host: '', at: now, cards: cards }, (prompts.length ? { prompts: prompts } : {})), (myLink ? { link: myLink } : {}));
                isLive = function (one) { return one.status === 'working' || Boolean(one.ask); };
                ended = cards.filter(function (one) { return !isLive(one); });
                return [4 /*yield*/, $.fs.write(ownLive(id), JSON.stringify(__assign(__assign(__assign({}, s), { cards: cards.filter(isLive) }), (ended.length ? { ended: ended } : {}))))];
            case 6:
                _c.sent();
                sharedSign = sign;
                sharedAt = now;
                return [2 /*return*/];
        }
    });
}); };
// This chat's file goes as its session ends, and when it starts (a file a crash or a reload left behind): the others drop its cards
// at once, not after STALE
var unshare = function ($_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1], args_1, true), void 0, function ($, isSure) {
        var id;
        if (isSure === void 0) { isSure = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read($, me)];
                case 1:
                    id = (_a.sent()).id;
                    if (!id || !dir || (!sharedSign && !isSure))
                        return [2 /*return*/];
                    sharedSign = '';
                    return [4 /*yield*/, $.fs.exists(ownLive(id)).catch(function () { return false; })];
                case 2:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, $.process.run(['rm', '-f', ownLive(id)]).catch(function () { return undefined; })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var pushedYou = '';
var pushedLatest = '';
// Whether this Mac lists other Macs' chats, and what it calls itself beside them
var isMulti = function () { return macs.length > 0 || pushedFrom.size > 0; };
var selfName = function () { return (isMulti() ? pushedYou || localName : ''); };
// When this panel saw each of another chat's pieces of work end, by its id here; 0 for one that had ended well before
var endSeen = new Map();
var SEEN_ENDING = 60000;
// Whether ended work is in its pause after ending: this chat's from its end, another chat's from when this panel saw it end
var lingers = function (one, at) {
    var _a;
    if (!one.chat)
        return isLingering(one, at);
    var seen = (_a = endSeen.get(one.id)) !== null && _a !== void 0 ? _a : 0;
    return one.status !== 'working' && seen > 0 && at >= seen && at - seen < LINGER;
};
// Another chat's running work as last read, by its id here, with its chat: a chat on a version from before ended work was shared
// drops a card from its file as the work ends, saying nothing of how. Such a card, gone while its chat is still there, is shown
// finished for its pause, green with the happy octopus as any other finish, and is then gone: what is not known is not kept
var lastRunning = new Map();
// The cards shown finished that way, by id here, with when they were seen gone; only for their pause
var vanished = new Map();
var isVanished = function (id) { return vanished.has(id); };
// The files of other chats, as last read, by name: a file is read again only when it changed
var liveRead = new Map();
var isWhole = function (text) {
    try {
        return Boolean(JSON.parse(text));
    }
    catch (_a) {
        return false;
    }
};
var readOthers = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, now, wasSelf, pushed, open, from, you, youAt, latest, latestAt, _i, _a, entry, at, text, head, _b, _c, one, _d, from_1, one, found, here, listed, _loop_1, _e, _f, name_1, _g, listed_1, entry, key, was, text, _h, one, fromMacs, _j, macs_1, mac, f, _k, _l, _m, _o, one, _p, _q, one, isOffChanged, _r, pushed_1, one, chatKey, present, _loop_2, _s, _t, _u, key, was, _v, found_1, s, _w, _x, card, _loop_3, _y, _z, _0, key, one, ids, _1, found_2, s, _2, _3, card, key, isNew, _4, _5, key, isAppChanged, _6, next, _7, _8, _9;
    var _10;
    return __generator(this, function (_11) {
        switch (_11.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_11.sent()).id;
                if (!id || !dir)
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 2:
                now = _11.sent();
                wasSelf = "".concat(isMulti(), ":").concat(selfName());
                pushed = [];
                open = new Set();
                from = new Set();
                you = '';
                youAt = 0;
                latest = '';
                latestAt = 0;
                _i = 0;
                return [4 /*yield*/, $.fs.list("".concat(liveDir(), "/").concat(PUSHED)).catch(function () { return []; })];
            case 3:
                _a = (_11.sent()).filter(function (one) { return one.kind === 'file' && one.name.endsWith('.json'); });
                _11.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                entry = _a[_i];
                at = entry.mtimeMs || now;
                if (now - at > STALE)
                    return [3 /*break*/, 6];
                return [4 /*yield*/, readOr($, "".concat(liveDir(), "/").concat(PUSHED, "/").concat(entry.name))];
            case 5:
                text = _11.sent();
                head = pushHead(text);
                if (!head || "".concat(head.from, ".json") !== entry.name)
                    return [3 /*break*/, 6];
                from.add(head.from);
                if (head.you && at >= youAt)
                    (you = head.you, (youAt = at));
                if (at >= latestAt)
                    (latest = head.from, (latestAt = at));
                pushed.push.apply(pushed, fetchedOf(text, head.from, at));
                for (_b = 0, _c = fetchedOpen(text, head.from); _b < _c.length; _b++) {
                    one = _c[_b];
                    open.add(one);
                }
                _11.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                pushedFrom.clear();
                for (_d = 0, from_1 = from; _d < from_1.length; _d++) {
                    one = from_1[_d];
                    pushedFrom.add(one);
                }
                pushedYou = you;
                pushedLatest = latest;
                if (!macs.length) return [3 /*break*/, 9];
                return [4 /*yield*/, knowLocalName($)];
            case 8:
                _11.sent();
                _11.label = 9;
            case 9:
                found = [];
                here = new Set([id]);
                return [4 /*yield*/, $.fs.list(liveDir()).catch(function () { return []; })];
            case 10:
                listed = (_11.sent()).filter(function (entry) { return entry.kind === 'file' && entry.name.endsWith('.json') && entry.name !== "".concat(id, ".json"); });
                _loop_1 = function (name_1) {
                    if (!listed.some(function (entry) { return entry.name === name_1; }))
                        liveRead.delete(name_1);
                };
                for (_e = 0, _f = __spreadArray([], liveRead.keys(), true); _e < _f.length; _e++) {
                    name_1 = _f[_e];
                    _loop_1(name_1);
                }
                _g = 0, listed_1 = listed;
                _11.label = 11;
            case 11:
                if (!(_g < listed_1.length)) return [3 /*break*/, 16];
                entry = listed_1[_g];
                // A file not written for longer than STALE is a chat gone silent: not read at all
                if (entry.mtimeMs && now - entry.mtimeMs > STALE)
                    return [3 /*break*/, 15];
                key = "".concat(entry.mtimeMs, ":").concat(entry.size);
                was = liveRead.get(entry.name);
                if (!(was && entry.mtimeMs && was.key === key)) return [3 /*break*/, 12];
                _h = was.text;
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, readOr($, "".concat(liveDir(), "/").concat(entry.name))];
            case 13:
                _h = _11.sent();
                _11.label = 14;
            case 14:
                text = _h;
                one = sharedOf(text, now);
                // A file caught half-written is read again at the next look, not kept as read; a whole one of a chat with nothing going on is
                // kept as read, so a hundred idle chats are not read again at every look
                if (openChatOf(text, now))
                    open.add(openChatOf(text, now));
                if (one || isWhole(text))
                    liveRead.set(entry.name, { key: key, text: text });
                else
                    liveRead.delete(entry.name);
                if (one)
                    here.add(one.chat);
                // Only a chat with something going on is read as one: work running or ended lately, or a prompt open
                if (one && one.chat !== id)
                    found.push(one);
                _11.label = 15;
            case 15:
                _g++;
                return [3 /*break*/, 11];
            case 16:
                fromMacs = [];
                _j = 0, macs_1 = macs;
                _11.label = 17;
            case 17:
                if (!(_j < macs_1.length)) return [3 /*break*/, 20];
                mac = macs_1[_j];
                _l = (_k = JSON).parse;
                return [4 /*yield*/, readOr($, macPath(mac))];
            case 18:
                f = _l.apply(_k, [(_11.sent()) || '{}']);
                // A copy not fetched again for STALE says nothing of that Mac now
                if (!f.text || now - ((_10 = f.fetchedAt) !== null && _10 !== void 0 ? _10 : 0) > STALE)
                    return [3 /*break*/, 19];
                for (_m = 0, _o = fetchedOpen(f.text, mac); _m < _o.length; _m++) {
                    one = _o[_m];
                    open.add(one);
                }
                // A Mac named that is this one shows its chats once, as this Mac's
                for (_p = 0, _q = fetchedOf(f.text, mac, f.fetchedAt); _p < _q.length; _p++) {
                    one = _q[_p];
                    if (!here.has(one.chat))
                        (here.add(one.chat), found.push(one), fromMacs.push(one));
                }
                _11.label = 19;
            case 19:
                _j++;
                return [3 /*break*/, 17];
            case 20: return [4 /*yield*/, tellAfar($, fromMacs, now).catch(function (err) { return log($, "other Macs' asks not told: ".concat(String(err))); })];
            case 21:
                _11.sent();
                return [4 /*yield*/, lookAfar($, now).catch(function () { return false; })
                    // A chat both fetched and handed over, as when two Macs each name the other, is listed once, as fetched
                ];
            case 22:
                isOffChanged = _11.sent();
                // A chat both fetched and handed over, as when two Macs each name the other, is listed once, as fetched
                for (_r = 0, pushed_1 = pushed; _r < pushed_1.length; _r++) {
                    one = pushed_1[_r];
                    if (!here.has(one.chat))
                        (here.add(one.chat), found.push(one));
                }
                chatKey = function (s) { return "".concat(s.host, "/").concat(s.chat); };
                present = new Map(found.map(function (s) { return [chatKey(s), s]; }));
                _loop_2 = function (key, was) {
                    if (!open.has(was.chat)) {
                        if (now - was.at > STALE)
                            lastRunning.delete(key);
                        return "continue";
                    }
                    lastRunning.delete(key);
                    var s = present.get(was.chat);
                    // A card gone from its chat's list went with that chat, which is closed: nothing reads an answer left for it, so its ask goes too
                    if (!(s === null || s === void 0 ? void 0 : s.cards.some(function (card) { return remoteId(s, card.id) === key; })) && !vanished.has(key))
                        vanished.set(key, { chat: was.chat, card: __assign(__assign({}, was.card), { status: 'done', endedAt: now, ask: undefined }), at: now, of: was.of });
                };
                for (_s = 0, _t = __spreadArray([], lastRunning, true); _s < _t.length; _s++) {
                    _u = _t[_s], key = _u[0], was = _u[1];
                    _loop_2(key, was);
                }
                for (_v = 0, found_1 = found; _v < found_1.length; _v++) {
                    s = found_1[_v];
                    for (_w = 0, _x = s.cards.filter(function (one) { return one.status === 'working'; }); _w < _x.length; _w++) {
                        card = _x[_w];
                        lastRunning.set(remoteId(s, card.id), { chat: chatKey(s), card: card, at: now, of: __assign(__assign({}, s), { cards: [], prompts: undefined }) });
                    }
                }
                _loop_3 = function (key, one) {
                    var s = present.get(one.chat);
                    if (!open.has(one.chat) || now - one.at > LINGER + LOOK_EVERY || (s === null || s === void 0 ? void 0 : s.cards.some(function (card) { return remoteId(s, card.id) === key; })))
                        vanished.delete(key);
                    else if (s)
                        s.cards = __spreadArray(__spreadArray([], s.cards, true), [one.card], false);
                    else {
                        var back = __assign(__assign({}, one.of), { cards: [one.card] });
                        found.push(back);
                        present.set(one.chat, back);
                    }
                };
                for (_y = 0, _z = __spreadArray([], vanished, true); _y < _z.length; _y++) {
                    _0 = _z[_y], key = _0[0], one = _0[1];
                    _loop_3(key, one);
                }
                ids = new Set();
                for (_1 = 0, found_2 = found; _1 < found_2.length; _1++) {
                    s = found_2[_1];
                    for (_2 = 0, _3 = s.cards.filter(function (one) { return one.status !== 'working'; }); _2 < _3.length; _2++) {
                        card = _3[_2];
                        key = remoteId(s, card.id);
                        ids.add(key);
                        if (endSeen.has(key))
                            continue;
                        isNew = now - card.endedAt < SEEN_ENDING;
                        endSeen.set(key, isNew ? now : 0);
                        if (isNew)
                            $.clock.after(LINGER + 20, function () { return void update($, tick, function (n) { return n + 1; }); });
                    }
                }
                for (_4 = 0, _5 = __spreadArray([], endSeen.keys(), true); _4 < _5.length; _4++) {
                    key = _5[_4];
                    if (!ids.has(key))
                        endSeen.delete(key);
                }
                _6 = found.some(function (s) { return s.host; });
                if (!_6) return [3 /*break*/, 24];
                return [4 /*yield*/, readAppIds($, now).catch(function (err) { return (void log($, "app's chats not listed: ".concat(String(err))), false); })];
            case 23:
                _6 = (_11.sent());
                _11.label = 24;
            case 24:
                isAppChanged = _6;
                next = ordered(found);
                _7 = JSON.stringify(next);
                _9 = (_8 = JSON).stringify;
                return [4 /*yield*/, read($, others)];
            case 25:
                if (!(_7 !== _9.apply(_8, [_11.sent()]))) return [3 /*break*/, 27];
                return [4 /*yield*/, update($, others, function () { return next; })];
            case 26:
                _11.sent();
                return [3 /*break*/, 28];
            case 27:
                if ("".concat(isMulti(), ":").concat(selfName()) !== wasSelf || isAppChanged || isOffChanged)
                    redraw($);
                _11.label = 28;
            case 28: return [2 /*return*/];
        }
    });
}); };
// The chats this Mac's Claude app holds: its session files, one per chat, under
// ~/Library/Application Support/Claude/claude-code-sessions/<account>/<org>/local_….json, each naming the engine's id for that chat
// (`cliSessionId`, the id a chat shares as `chat`). They include the chats it runs on another Mac over SSH, which a press then opens
// by the app's own id as its sidebar does, whatever version of the mod runs there. Listed again at most every half minute; a file is
// read once, as the id it names never changes
var appIds = new Set();
var appOfChat = new Map();
var appFiles = new Map();
// The title the app gives each chat it holds, by the chat's id, as read with its file
var appTitles = new Map();
var appIdsAt = 0;
// The app's own id for a chat this Mac's app holds, or ''
var heldApp = function (c) { var _a, _b; return (((_a = c.link) === null || _a === void 0 ? void 0 : _a.app) && appIds.has(c.link.app) ? c.link.app : ((_b = appOfChat.get(c.chat)) !== null && _b !== void 0 ? _b : '')); };
// Answers whether what it holds changed, so the names it opens are drawn again
var readAppIds = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var root, _a, found, _i, _b, account, _c, _d, _e, org, _loop_4, _f, _g, _h, one, isSame, _j, _k, app, _l, found_3, _m, app, chat;
    var _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                if (now - appIdsAt < 30000)
                    return [2 /*return*/, false];
                appIdsAt = now;
                _a = "".concat;
                return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                root = _a.apply("", [(_o = (_r.sent())) !== null && _o !== void 0 ? _o : '', "/Library/Application Support/Claude/claude-code-sessions"]);
                found = new Map();
                _i = 0;
                return [4 /*yield*/, $.fs.list(root).catch(function () { return []; })];
            case 2:
                _b = _r.sent();
                _r.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 16];
                account = _b[_i];
                _c = 0;
                if (!(account.kind === 'dir')) return [3 /*break*/, 5];
                return [4 /*yield*/, $.fs.list("".concat(root, "/").concat(account.name)).catch(function () { return []; })];
            case 4:
                _e = _r.sent();
                return [3 /*break*/, 6];
            case 5:
                _e = [];
                _r.label = 6;
            case 6:
                _d = _e;
                _r.label = 7;
            case 7:
                if (!(_c < _d.length)) return [3 /*break*/, 15];
                org = _d[_c];
                _loop_4 = function (one) {
                    var app, text_1, chat, title;
                    return __generator(this, function (_s) {
                        switch (_s.label) {
                            case 0:
                                app = one.name.replace(/\.json$/, '');
                                if (!one.name.endsWith('.json') || !APP_ID.test(app))
                                    return [2 /*return*/, "continue"];
                                if (!!appFiles.has(app)) return [3 /*break*/, 2];
                                return [4 /*yield*/, readOr($, "".concat(root, "/").concat(account.name, "/").concat(org.name, "/").concat(one.name)).catch(function () { return ''; })];
                            case 1:
                                text_1 = _s.sent();
                                chat = (function () {
                                    var _a;
                                    try {
                                        return String((_a = JSON.parse(text_1).cliSessionId) !== null && _a !== void 0 ? _a : '');
                                    }
                                    catch (_b) {
                                        return '';
                                    }
                                })();
                                if (text_1)
                                    appFiles.set(app, /^[A-Za-z0-9_-]{1,80}$/.test(chat) ? chat : '');
                                title = (function () {
                                    try {
                                        var t = JSON.parse(text_1).title;
                                        return typeof t === 'string' ? t.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').trim().slice(0, 120) : '';
                                    }
                                    catch (_a) {
                                        return '';
                                    }
                                })();
                                if (text_1 && title && appFiles.get(app))
                                    appTitles.set((_p = appFiles.get(app)) !== null && _p !== void 0 ? _p : '', title);
                                _s.label = 2;
                            case 2:
                                found.set(app, (_q = appFiles.get(app)) !== null && _q !== void 0 ? _q : '');
                                return [2 /*return*/];
                        }
                    });
                };
                _f = 0;
                if (!(org.kind === 'dir')) return [3 /*break*/, 9];
                return [4 /*yield*/, $.fs.list("".concat(root, "/").concat(account.name, "/").concat(org.name)).catch(function () { return []; })];
            case 8:
                _h = _r.sent();
                return [3 /*break*/, 10];
            case 9:
                _h = [];
                _r.label = 10;
            case 10:
                _g = _h;
                _r.label = 11;
            case 11:
                if (!(_f < _g.length)) return [3 /*break*/, 14];
                one = _g[_f];
                return [5 /*yield**/, _loop_4(one)];
            case 12:
                _r.sent();
                _r.label = 13;
            case 13:
                _f++;
                return [3 /*break*/, 11];
            case 14:
                _c++;
                return [3 /*break*/, 7];
            case 15:
                _i++;
                return [3 /*break*/, 3];
            case 16:
                isSame = found.size === appIds.size && __spreadArray([], found.keys(), true).every(function (one) { return appIds.has(one); });
                appIds.clear();
                appOfChat.clear();
                for (_j = 0, _k = __spreadArray([], appFiles.keys(), true); _j < _k.length; _j++) {
                    app = _k[_j];
                    if (!found.has(app))
                        appFiles.delete(app);
                }
                for (_l = 0, found_3 = found; _l < found_3.length; _l++) {
                    _m = found_3[_l], app = _m[0], chat = _m[1];
                    (appIds.add(app), chat && appOfChat.set(chat, app));
                }
                return [2 /*return*/, !isSame];
        }
    });
}); };
// A press on another chat's name: that chat in the Claude app, as a notification's click opens this one. Nothing else is run
// In a chat another Mac's Claude app runs here over SSH the app, and the screen it draws on, are that Mac's: a press is left for
// that Mac (the one that hands its chats here, the freshest of them), which opens the chat there
var openChat = function ($, c) { return __awaiter(_this, void 0, void 0, function () {
    var there, at, r, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                there = drawnFrom();
                // Never opened on this Mac, whose screen is not the one the press was made on: with no Mac handing its chats here, nowhere
                if (isRunFromAfar && !there)
                    return [2 /*return*/, void log($, "chat ".concat(c.chat).concat(c.host ? " on ".concat(c.host) : '', " not opened: no Mac hands its chats here to open it"))];
                if (!there) return [3 /*break*/, 3];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                return [4 /*yield*/, leaveHere($, "".concat(OUTBOX, "/").concat(there), "o-".concat(at, "-").concat(Math.random().toString(36).slice(2, 8)), { chat: c.chat, at: at })];
            case 2:
                r = _a.sent();
                return [2 /*return*/, void log($, "chat ".concat(c.chat).concat(c.host ? " on ".concat(c.host) : '', " ").concat(r.exitCode === 0 ? "left for ".concat(there, " to open") : "not left for ".concat(there, ": ").concat(r.stderr.trim().slice(0, 160))))];
            case 3:
                url = openUrl(c, heldApp(c));
                if (!url) return [3 /*break*/, 5];
                return [4 /*yield*/, openHere($, c, url)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var openHere = function ($, c, url) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['open', url]).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 1:
                r = _a.sent();
                return [4 /*yield*/, log($, "chat ".concat(c.chat).concat(c.host ? " on ".concat(c.host) : '', " ").concat(r.exitCode === 0 ? "opened: ".concat(url) : "not opened: ".concat(r.stderr.trim().slice(0, 160))))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Whether this chat runs here for another Mac's Claude app, over SSH: the app's own runner says so, once, at the start
var isRunFromAfar = false;
var drawnFrom = function () { return (isRunFromAfar ? pushedLatest : ''); };
// What a press on a name does in this chat: 'there' for that Mac to open, '' for none, else the link opened here
var pressOf = function (c) { return (isRunFromAfar ? (pushedLatest ? 'there' : '') : openUrl(c, heldApp(c))); };
// The presses left on each Mac named under macs for this one, taken every OPEN_EVERY by whichever chat here comes first, and each
// chat they name opened here as a press here opens it: this chat, another of this Mac's, or one of that Mac's this app holds
var isTaking = false;
var takeOpens = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var from, _i, macs_2, mac, now, stamp, _a, _b, f, _c, _d, r, _e, _f, chat;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (isTaking)
                    return [2 /*return*/];
                isTaking = true;
                _h.label = 1;
            case 1:
                _h.trys.push([1, , 14, 15]);
                return [4 /*yield*/, knowLocalName($)];
            case 2:
                from = _h.sent();
                _i = 0, macs_2 = macs;
                _h.label = 3;
            case 3:
                if (!(_i < macs_2.length)) return [3 /*break*/, 13];
                mac = macs_2[_i];
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _h.sent();
                stamp = "".concat(liveDir(), "/").concat(MACS, "/").concat(mac.replace(/[^A-Za-z0-9_.-]/g, '-'), ".opens");
                _a = now;
                _b = Number;
                return [4 /*yield*/, readOr($, stamp)];
            case 5:
                if (_a - (_b.apply(void 0, [_h.sent()]) || 0) < OPEN_EVERY - 250)
                    return [3 /*break*/, 12];
                _d = (_c = JSON).parse;
                return [4 /*yield*/, readOr($, macPath(mac))];
            case 6:
                f = _d.apply(_c, [(_h.sent()) || '{}']);
                if (now - ((_g = f.fetchedAt) !== null && _g !== void 0 ? _g : 0) > STALE)
                    return [3 /*break*/, 12];
                return [4 /*yield*/, $.fs.write(stamp, String(now))];
            case 7:
                _h.sent();
                return [4 /*yield*/, $.process.run(ssh(mac, openTake(from)), { timeoutMs: 8000 }).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); })];
            case 8:
                r = _h.sent();
                if (r.exitCode !== 0)
                    return [3 /*break*/, 12];
                _e = 0, _f = opensOf(r.stdout);
                _h.label = 9;
            case 9:
                if (!(_e < _f.length)) return [3 /*break*/, 12];
                chat = _f[_e];
                return [4 /*yield*/, openTaken($, chat, mac)];
            case 10:
                _h.sent();
                _h.label = 11;
            case 11:
                _e++;
                return [3 /*break*/, 9];
            case 12:
                _i++;
                return [3 /*break*/, 3];
            case 13: return [3 /*break*/, 15];
            case 14:
                isTaking = false;
                return [7 /*endfinally*/];
            case 15: return [2 /*return*/];
        }
    });
}); };
var openTaken = function ($, chat, mac) { return __awaiter(_this, void 0, void 0, function () {
    var id, session, c, mine, _a, _b, _c, _d, _e, url;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_g.sent()).id;
                if (!(chat === id)) return [3 /*break*/, 3];
                return [4 /*yield*/, $.env.get('CLAUDE_CODE_HOST_SESSION_ID')];
            case 2:
                session = (_f = (_g.sent())) !== null && _f !== void 0 ? _f : '';
                return [2 /*return*/, DESKTOP_SESSION.test(session) ? openHere($, { chat: chat, host: '' }, "claude://code/continue?session=".concat(session)) : log($, "chat ".concat(chat, " pressed on ").concat(mac, ": not in the Claude app here"))];
            case 3: return [4 /*yield*/, read($, others)];
            case 4:
                c = (_g.sent()).find(function (one) { return one.chat === chat; });
                _g.label = 5;
            case 5:
                _g.trys.push([5, 9, , 10]);
                if (!c) return [3 /*break*/, 6];
                _a = undefined;
                return [3 /*break*/, 8];
            case 6:
                _b = linkOf;
                _d = (_c = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(liveDir(), "/").concat(chat, ".json"))];
            case 7:
                _a = _b.apply(void 0, [_d.apply(_c, [(_g.sent()) || '{}']).link]);
                _g.label = 8;
            case 8:
                mine = _a;
                return [3 /*break*/, 10];
            case 9:
                _e = _g.sent();
                mine = undefined;
                return [3 /*break*/, 10];
            case 10:
                url = c ? openUrl(c, heldApp(c)) : mine ? openUrl({ host: '', link: mine }) : '';
                if (!url) return [3 /*break*/, 12];
                return [4 /*yield*/, openHere($, c !== null && c !== void 0 ? c : { chat: chat, host: '' }, url)];
            case 11:
                _g.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, log($, "chat ".concat(chat, " pressed on ").concat(mac, ": nothing here opens it"))];
            case 13:
                _g.sent();
                _g.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
// An answer pressed here for another chat's work, left for that chat: on this Mac in its folder of answers, on a Mac named under
// macs over ssh, for a chat of a Mac that handed it over in this Mac's outbox for that Mac, which its next trip carries back. Each is
// written under another name and then renamed, so it is never read half-written. The ask leaves this panel at once; that chat's own
// file brings it back if the work asks again, and an answer that could not be left says so and brings the ask back
var answeredHere = new Set();
var leaveHere = function ($, folder, name, body) {
    return $.fs
        .write("".concat(liveDir(), "/").concat(folder, "/").concat(name, ".part"), JSON.stringify(body))
        .then(function () { return $.process.run(['mv', '-f', "".concat(liveDir(), "/").concat(folder, "/").concat(name, ".part"), "".concat(liveDir(), "/").concat(folder, "/").concat(name, ".json")]); })
        .catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); });
};
var answerElsewhere = function ($, one, choice, isReply) { return __awaiter(_this, void 0, void 0, function () {
    var ask, said, chat, at, answer, name, mac, folder, r, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                ask = one.ask;
                said = choice.trim();
                chat = one.chat;
                if (!ask || !said || !chat || !/^[A-Za-z0-9_-]+$/.test(chat.id))
                    return [2 /*return*/];
                // A second press on an ask already answered here sends nothing
                if (answeredHere.has("".concat(one.id, ":").concat(ask.at)))
                    return [2 /*return*/];
                drafts.delete(one.id);
                replies.set(one.id, ((_d = replies.get(one.id)) !== null && _d !== void 0 ? _d : 0) + 1);
                if (isReply)
                    freeTimes();
                answeredHere.add("".concat(one.id, ":").concat(ask.at));
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _e.sent();
                sentReplies.set(one.id, { text: said, ask: ask.text, to: 'other', at: at, line: lineOf(one) });
                redraw($);
                answer = { card: chat.agent, choice: said, isReply: isReply, ask: ask.text, askAt: ask.at, at: at };
                name = "".concat(at, "-").concat(Math.random().toString(36).slice(2, 8));
                mac = chat.host ? macs.find(function (m) { return m === chat.host; }) : undefined;
                folder = "".concat(ANSWERS, "/").concat(chat.id);
                if (!!chat.host) return [3 /*break*/, 3];
                return [4 /*yield*/, leaveHere($, folder, name, answer)];
            case 2:
                _a = _e.sent();
                return [3 /*break*/, 10];
            case 3:
                if (!mac) return [3 /*break*/, 5];
                return [4 /*yield*/, $.process
                        .run(ssh(mac, "d=~/.claude/claudopus/".concat(LIVE_DIR, "/").concat(folder, " && mkdir -p $d && cat > $d/").concat(name, ".part && mv $d/").concat(name, ".part $d/").concat(name, ".json")), { stdin: JSON.stringify(answer), timeoutMs: 15000 })
                        .catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 4:
                _b = _e.sent();
                return [3 /*break*/, 9];
            case 5:
                if (!(isKey(chat.host) && pushedFrom.has(chat.host))) return [3 /*break*/, 7];
                return [4 /*yield*/, leaveHere($, "".concat(OUTBOX, "/").concat(chat.host), name, __assign(__assign({}, answer), { chat: chat.id }))];
            case 6:
                _c = _e.sent();
                return [3 /*break*/, 8];
            case 7:
                _c = { exitCode: -1, stderr: 'that Mac is no longer named in config.json' };
                _e.label = 8;
            case 8:
                _b = _c;
                _e.label = 9;
            case 9:
                _a = _b;
                _e.label = 10;
            case 10:
                r = _a;
                if (!(r.exitCode !== 0)) return [3 /*break*/, 12];
                answeredHere.delete("".concat(one.id, ":").concat(ask.at));
                sentReplies.set(one.id, { text: said, ask: ask.text, to: 'lost', at: at, line: lineOf(one) });
                redraw($);
                return [4 /*yield*/, log($, "answer for the chat ".concat(chat.id).concat(chat.host ? " on ".concat(chat.host) : '', " not left: ").concat(r.stderr.trim().slice(0, 160)))];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); };
// Answers other chats left for this one's work: each acted on as if pressed here, once, then put away. A press answers the ask it
// was pressed for and no later one, even in the same words; a reply in words goes to the work whatever it asks now; an answer that
// waited past ANSWER_KEPT is dropped
var takenAnswers = new Set();
var readAnswers = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var id, folder, all, _i, _a, entry, entries, _loop_5, _b, _c, entry;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, read($, me)];
            case 1:
                id = (_d.sent()).id;
                if (!id || !dir)
                    return [2 /*return*/];
                folder = "".concat(liveDir(), "/").concat(ANSWERS, "/").concat(id);
                return [4 /*yield*/, $.fs.list(folder).catch(function () { return []; })];
            case 2:
                all = (_d.sent()).filter(function (entry) { return entry.name.endsWith('.json'); });
                _i = 0, _a = all.filter(function (one) { return takenAnswers.has(one.name); });
                _d.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                entry = _a[_i];
                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(folder, "/").concat(entry.name)]).catch(function () { return undefined; })];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                entries = all.filter(function (entry) { return !takenAnswers.has(entry.name); });
                _loop_5 = function (entry) {
                    var path, answer, _e, now, card, _f, isSame;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                takenAnswers.add(entry.name);
                                path = "".concat(folder, "/").concat(entry.name);
                                _e = answerOf;
                                return [4 /*yield*/, readOr($, path)];
                            case 1:
                                answer = _e.apply(void 0, [_g.sent()]);
                                return [4 /*yield*/, $.process.run(['rm', '-f', path]).catch(function () { return undefined; })];
                            case 2:
                                _g.sent();
                                return [4 /*yield*/, $.clock.now()];
                            case 3:
                                now = _g.sent();
                                if (!answer) return [3 /*break*/, 5];
                                return [4 /*yield*/, read($, todos)];
                            case 4:
                                _f = (_g.sent()).find(function (one) { return one.id === answer.card && !one.parentId; });
                                return [3 /*break*/, 6];
                            case 5:
                                _f = undefined;
                                _g.label = 6;
                            case 6:
                                card = _f;
                                isSame = Boolean(answer && (card === null || card === void 0 ? void 0 : card.ask) && (answer.askAt ? answer.askAt === card.ask.at : answer.ask === card.ask.text));
                                if (!(answer && card && !card.ask && answer.isReply && now - answer.at <= ANSWER_KEPT)) return [3 /*break*/, 8];
                                return [4 /*yield*/, replyAfter($, card, answer.choice, answer.ask)];
                            case 7:
                                _g.sent();
                                return [2 /*return*/, "continue"];
                            case 8:
                                if (!(!answer || !(card === null || card === void 0 ? void 0 : card.ask) || now - answer.at > ANSWER_KEPT || (!answer.isReply && !isSame))) return [3 /*break*/, 10];
                                return [4 /*yield*/, log($, "answer from another chat dropped: ".concat(!answer ? 'unreadable' : now - answer.at > ANSWER_KEPT ? 'it waited too long' : "its ask is gone from ".concat(answer.card)))];
                            case 9:
                                _g.sent();
                                return [2 /*return*/, "continue"];
                            case 10: return [4 /*yield*/, answerAsk($, card, answer.choice, answer.isReply)];
                            case 11:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _b = 0, _c = entries.sort(function (a, b) { return a.name.localeCompare(b.name); });
                _d.label = 7;
            case 7:
                if (!(_b < _c.length)) return [3 /*break*/, 10];
                entry = _c[_b];
                return [5 /*yield**/, _loop_5(entry)];
            case 8:
                _d.sent();
                _d.label = 9;
            case 9:
                _b++;
                return [3 /*break*/, 7];
            case 10: return [2 /*return*/];
        }
    });
}); };
