// The hidden boxes of bin/secret and bin/admin, in every chat: on this Mac's own screen and from another Mac over ssh alike
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
// The Bash calls of this chat that run bin/admin or bin/secret, by call id, with their command: a box is drawn only for a request of
// this chat's own while one of them runs (one sent to the background for BOX_OLD after it began), and says which command asked. A
// request no runner of this chat could have made, however it is worded, is drawn nowhere
var runnerCalls = new Map();
var runnerBegun = function (id, command, at) { return void runnerCalls.set(id, { command: command, at: at, until: Infinity }); };
var runnerEnded = function (id, isBackground, at) {
    var one = runnerCalls.get(id);
    if (!one)
        return;
    if (isBackground)
        runnerCalls.set(id, __assign(__assign({}, one), { until: one.at + BOX_OLD }));
    else
        runnerCalls.delete(id);
    for (var _i = 0, _a = __spreadArray([], runnerCalls, true); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], other = _b[1];
        if (other.until < at)
            runnerCalls.delete(key);
    }
};
// The command that asked: the one of this chat's running runners begun last before the request
var runnerOf = function (at, now) { return __spreadArray([], runnerCalls, true).map(function (_a) {
    var call = _a[0], one = _a[1];
    return (__assign(__assign({}, one), { call: call }));
}).filter(function (one) { return one.until >= now && one.at <= at + BOX_SKEW; }).sort(function (a, b) { return b.at - a.at; })[0]; };
var BOX_SKEW = 60000;
// What the runners take as a Mac (an ssh host or alias, perhaps with a user) and as a key's name
var BOX_HOST = /^(?:here|[A-Za-z0-9_][A-Za-z0-9._:@-]{0,199})$/;
var BOX_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,199}$/;
// The public half of the key bin/admin made for one request, as DER in base64: an RSA key of 2048 bits or more
var BOX_KEY = /^MII[A-Za-z0-9+/]{280,1400}={0,2}$/;
// The key each request was first seen with: a request whose key changed after that is drawn nowhere, so a key put in its place by
// something else gets nothing typed for the runner
var boxKeys = new Map();
// What was typed, sealed to the runner's key (RSA-OAEP, SHA-256) by openssl, which only the runner that asked can open: the value
// on openssl's stdin, the key on a pipe of its own, so neither is ever in a file or a command line but the key, which is public
var SEAL_FOR = 'PATH=/usr/bin:/bin; openssl pkeyutl -encrypt -pubin -keyform DER -inkey <(printf %s "$1" | openssl base64 -d -A) -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 | openssl base64 -A';
var sealedFor = function ($, key, value) { return __awaiter(_this, void 0, void 0, function () {
    var r, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['/bin/bash', '-c', SEAL_FOR, 'sh', key], { stdin: value, timeoutMs: 15000 }).catch(function () { return undefined; })];
            case 1:
                r = _a.sent();
                out = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout.trim() : '';
                return [2 /*return*/, /^[A-Za-z0-9+/]{300,}={0,2}$/.test(out) ? out : ''];
        }
    });
}); };
var BOX_AGAIN = {
    refused: 'That password was refused. ',
    short: 'That was shorter than 4 characters. ',
    control: 'That held a line break or another control character. ',
};
// The wording for a request, or undefined for one the panel does not draw
var boxWording = function (one) {
    // A reason it does not know is left out
    var again = typeof one.again === 'string' && Object.hasOwn(BOX_AGAIN, one.again) ? BOX_AGAIN[one.again] : '';
    if (one.kind === 'admin') {
        // A password is sent only sealed to the key the runner made for this one request: a request with none is drawn nowhere
        if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined || typeof one.key !== 'string' || !BOX_KEY.test(one.key))
            return undefined;
        var mac = one.host === 'here' ? thisMac() : one.host;
        return "".concat(again, "Claudopus needs the admin password of ").concat(mac, " to run the admin command below. Nothing is saved: it goes only to that command, and the next one asks again.");
    }
    if (one.kind === 'secret') {
        if (one.host !== undefined)
            return undefined;
        // No name: the first box of a key saved by hand asks its name
        if (one.name === undefined)
            return 'Name of the key to save, such as GITHUB_TOKEN. Claude will use it by this name.';
        if (typeof one.name !== 'string' || !BOX_NAME.test(one.name))
            return undefined;
        return "".concat(again, "Claudopus needs ").concat(one.name, ". It is saved only in ").concat(keptWhere(), ". Claude uses it by name, and it is hidden in anything a command prints.");
    }
    return undefined;
};
var boxes = [];
var doneNotes = [];
var DONE_SHOWN = 60000;
var DONE_LEAST = 15000;
var DONE_LONGEST = 30 * 60000;
var isNoteShown = function (one, at) {
    return !one.call ? at - one.at < DONE_SHOWN : one.endedAt === undefined ? at - one.at < DONE_LONGEST : at < Math.max(one.endedAt, one.at + DONE_LEAST);
};
// The calls that have ended, so a note made after its call ended (a runner sent to the background) is over from the start
var callsEnded = new Set();
var noteDone = function ($, note) { return __awaiter(_this, void 0, void 0, function () {
    var at, made;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Drawn from the press itself: in the list before anything is awaited, shown until the clock dates it a moment later
                doneNotes = __spreadArray(__spreadArray([], doneNotes.filter(function (one) { return one.id !== note.id; }), true), [__assign(__assign({}, note), { at: Infinity })], false);
                drawAgain($);
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                made = __assign(__assign(__assign({}, note), { at: at }), (note.call && note.endedAt === undefined && callsEnded.has(note.call) ? { endedAt: at } : {}));
                doneNotes = __spreadArray(__spreadArray([], doneNotes.filter(function (one) { return one.id !== note.id && isNoteShown(one, at); }), true), [made], false).slice(-6);
                drawAgain($);
                // Drawn again as its time ends, so it goes with nothing else to redraw the panel
                $.clock.after((!made.call ? DONE_SHOWN : made.endedAt !== undefined ? DONE_LEAST : DONE_LONGEST) + 100, function () { return drawAgain($); });
                return [2 /*return*/];
        }
    });
}); };
// The call a note tells of has ended: what it said is over, so the note goes (after DONE_LEAST from its press)
var noteCallEnded = function ($, call) { return __awaiter(_this, void 0, void 0, function () {
    var at, last;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                callsEnded.add(call);
                if (callsEnded.size > 200)
                    callsEnded.delete((_a = callsEnded.values().next().value) !== null && _a !== void 0 ? _a : '');
                if (!doneNotes.some(function (one) { return one.call === call && one.endedAt === undefined; }))
                    return [2 /*return*/];
                return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _b.sent();
                doneNotes = doneNotes.map(function (one) { return (one.call === call && one.endedAt === undefined ? __assign(__assign({}, one), { endedAt: at }) : one); });
                drawAgain($);
                last = Math.max.apply(Math, doneNotes.filter(function (one) { return one.call === call; }).map(function (one) { return one.at + DONE_LEAST; }));
                $.clock.after(Math.max(0, last - at) + 100, function () { return drawAgain($); });
                return [2 /*return*/];
        }
    });
}); };
// What was done is a line, as Claude Code reports a call's result under it: a mark and the words, with no box, fill or edge, so it is
// never taken for a card of work. Green once allowed or given, grey once refused or cancelled
var reportLine = function (ui, key, isOn, said, lines) { return (<ui.Box key={key} flexDirection="row" gap={1} paddingX={2} flexShrink={0}>
    <ui.Text color={isOn ? DONE : undefined} dimColor={!isOn}>{isOn ? '✓' : '✕'}</ui.Text>
    <ui.Box flexDirection="column" minWidth={0} flexGrow={1} flexShrink={1}>
      <ui.Text wrap="wrap">{said}</ui.Text>
      {lines.filter(Boolean).map(function (line, n) { return <ui.Text key={"".concat(key, "-").concat(n)} dimColor wrap="truncate-end">{line}</ui.Text>; })}
    </ui.Box>
  </ui.Box>); };
var doneNotesPart = function (ui, at) {
    return doneNotes.filter(function (one) { return !one.card && isNoteShown(one, at); }).map(function (one) { return reportLine(ui, "done-".concat(one.id), Boolean(one.isOn), one.said, [one.head, one.what]); });
};
// What was done with a gate on a work's card, in that card where the amber box was: the same outlined box, green once allowed, grey
// once refused, saying what was allowed, until its note goes
var cardNotesOf = function (card, at) { return doneNotes.filter(function (one) { return one.card === card && isNoteShown(one, at); }); };
var cardNotesPart = function (ui, card, at) {
    return cardNotesOf(card, at).map(function (one) { return (<ui.Box key={"done-".concat(one.id)} flexDirection="column" borderStyle="round" borderColor={one.isOn ? DONE : '#808080'} paddingX={1} flexShrink={0}>
      <ui.Text wrap="truncate-end" dimColor>{"".concat(one.head, " \u00B7 ").concat(one.isOn ? 'allowed' : 'refused')}</ui.Text>
      <ui.Box flexDirection="row" gap={1}>
        <ui.Text color={one.isOn ? DONE : undefined} dimColor={!one.isOn}>{one.isOn ? '✓' : '✕'}</ui.Text>
        <ui.Box flexShrink={1} minWidth={0}>
          <ui.Text wrap="wrap" color={one.isOn ? DONE : undefined} bold={one.isOn}>{one.said}</ui.Text>
        </ui.Box>
      </ui.Box>
      {one.what ? <ui.Text key={"done-".concat(one.id, "-what")} dimColor wrap="truncate-end">{one.what}</ui.Text> : null}
    </ui.Box>); });
};
// What a box asks for, in a few words, for its note once answered
var boxHead = function (text) {
    var _a, _b;
    var name = (_a = text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)) === null || _a === void 0 ? void 0 : _a[1];
    var mac = (_b = text.match(/admin password of (.+?) to run/)) === null || _b === void 0 ? void 0 : _b[1];
    return mac ? "The admin password of ".concat(mac) : name ? "The key ".concat(name) : 'A key to save';
};
// What is typed in a box is kept by the surface alone, never here or drawn back: a drawing that carried it put older letters over
// newer ones. Each try that left the box to be typed again gives its field a new key, so the field starts empty
var boxTries = new Map();
// The boxes something is typed in, unsent, so an ask's reply box does not take the keys from them
var boxTyped = new Set();
// What is typed in the bar's key box while it is open, only so its Send button can send it: never written anywhere, and gone once
// it is sent, closed or the box moves
var barKeyTyped = new Map();
// A line under a box: what went wrong with what was sent
var boxSaid = new Map();
// Sent from here: the box goes at once, before the runner removes its request
var boxSent = new Set();
var boxPresses = 0;
// A request older than the runner's own wait there (590 s, under the longest a Bash call may run) is one whose runner is gone
var BOX_OLD = 11 * 60000;
// What security reads as one line (it cuts a line at about 4095, seen), and gives back as typed: plain printable characters (others it
// prints as hex). The longest value, escaped, leaves room for the rest of the line
var BOX_LONGEST = 3800;
var BOX_SERVICE = 'claudopus-box';
var BOX_ID = /^[0-9a-f-]{36}$/;
var boxesDir = function () { return "".concat(dir, "/boxes"); };
// Another chat's request is left to it this long, so its own chat tells it, when that chat is open
var BOX_GRACE = 5000;
// In the chat only the name of what is asked, once per box, in the chat that asked or else whichever chat sees it first
var BOX_TOLD = function (text) { return "".concat(text, " Answer it in the box at the top of the Claudopus panel, never in this chat's prompt (/claudopus opens the panel): what is typed there for it goes only into ").concat(keptWhere()).concat(text.includes('admin password') ? '' : ", or give a response instead, such as where it already is", "."); };
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID, read at each look (a /clear can change it)
var boxChat = '';
// Requests this chat has told or seen told
var boxTold = new Set();
var lookBoxes = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, found, entries, _loop_1, _i, entries_1, entry, _a, found_1, one, mark_1, opened_1, _loop_2, _b, boxTold_1, id, _loop_3, _c, _d, id, _loop_4, _e, _f, id;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
                if (!(_h.sent()).length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 2:
                boxChat = _h.sent();
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _h.sent();
                found = [];
                return [4 /*yield*/, $.fs.list(boxesDir()).catch(function () { return []; })];
            case 4:
                entries = _h.sent();
                _loop_1 = function (entry) {
                    var marked, answered, id, one, _j, _k, text, runner, key, isKeySame, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0:
                                marked = entry.name.replace(/\.told$/, '');
                                answered = entry.name.replace(/\.reply$/, '');
                                if (!(entry.name.endsWith('.reply') && BOX_ID.test(answered) && !entries.some(function (other) { return other.name === "".concat(answered, ".json"); }) && now - ((_g = boxRepliedAt.get(answered)) !== null && _g !== void 0 ? _g : 0) > BOX_REPLY_TAKEN)) return [3 /*break*/, 2];
                                boxRepliedAt.delete(answered);
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(entry.name)]).catch(function () { return undefined; })];
                            case 1:
                                (_m.sent());
                                _m.label = 2;
                            case 2:
                                if (!(entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(function (other) { return other.name === "".concat(marked, ".json"); }))) return [3 /*break*/, 4];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(entry.name)]).catch(function () { return undefined; })];
                            case 3:
                                _m.sent();
                                _m.label = 4;
                            case 4:
                                id = entry.name.replace(/\.json$/, '');
                                if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id))
                                    return [2 /*return*/, "continue"];
                                _m.label = 5;
                            case 5:
                                _m.trys.push([5, 11, , 12]);
                                _k = (_j = JSON).parse;
                                return [4 /*yield*/, readOr($, "".concat(boxesDir(), "/").concat(entry.name))];
                            case 6:
                                one = _k.apply(_j, [_m.sent()]);
                                text = one && typeof one === 'object' ? boxWording(one) : undefined;
                                runner = typeof one.at === 'number' ? runnerOf(one.at, now) : undefined;
                                key = typeof one.key === 'string' ? one.key : undefined;
                                if (key && !boxKeys.has(id))
                                    boxKeys.set(id, key);
                                isKeySame = !key || boxKeys.get(id) === key;
                                if (!(one.id === id && text && isKeySame && typeof one.at === 'number' && now - one.at < BOX_OLD && one.at - now <= BOX_SKEW && one.chat === boxChat && boxChat && runner)) return [3 /*break*/, 7];
                                found.push(__assign({ id: id, text: text, at: one.at, chat: one.chat, command: runner.command, call: runner.call }, (one.kind === 'admin' && key ? { key: key } : {})));
                                return [3 /*break*/, 10];
                            case 7:
                                if (!(typeof one.at === 'number' && (now - one.at >= BOX_OLD || one.at - now > BOX_SKEW))) return [3 /*break*/, 10];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json"), "".concat(boxesDir(), "/").concat(id, ".told"), "".concat(boxesDir(), "/").concat(id, ".reply")]).catch(function () { return undefined; })];
                            case 8:
                                _m.sent();
                                return [4 /*yield*/, boxKeyring($, 'delete', id)];
                            case 9:
                                _m.sent();
                                _m.label = 10;
                            case 10: return [3 /*break*/, 12];
                            case 11:
                                _l = _m.sent();
                                return [3 /*break*/, 12];
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, entries_1 = entries;
                _h.label = 5;
            case 5:
                if (!(_i < entries_1.length)) return [3 /*break*/, 8];
                entry = entries_1[_i];
                return [5 /*yield**/, _loop_1(entry)];
            case 6:
                _h.sent();
                _h.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                found.sort(function (a, b) { return a.at - b.at; });
                _a = 0, found_1 = found;
                _h.label = 9;
            case 9:
                if (!(_a < found_1.length)) return [3 /*break*/, 16];
                one = found_1[_a];
                if (boxTold.has(one.id))
                    return [3 /*break*/, 15];
                // Another chat's request waits for that chat a moment (and every request does, in a chat that cannot read its own id)
                if (one.chat !== undefined && one.chat !== boxChat && now - one.at < BOX_GRACE)
                    return [3 /*break*/, 15];
                boxTold.add(one.id);
                return [4 /*yield*/, $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', "".concat(boxesDir(), "/").concat(one.id, ".told")]).catch(function () { return ({ exitCode: 1 }); })];
            case 10:
                mark_1 = _h.sent();
                if (mark_1.exitCode !== 0)
                    return [3 /*break*/, 15];
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(function (err) { return (log($, "panel not opened for a box: ".concat(String(err))), undefined); })];
            case 11:
                opened_1 = _h.sent();
                if (!!(opened_1 === null || opened_1 === void 0 ? void 0 : opened_1.isPlaced)) return [3 /*break*/, 14];
                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(one.id, ".told")]).catch(function () { return undefined; })];
            case 12:
                _h.sent();
                return [4 /*yield*/, log($, "box ".concat(one.id, " given back: the panel is not drawn here").concat(opened_1 && !opened_1.isPlaced ? " (".concat(opened_1.reason, ")") : ''))];
            case 13:
                _h.sent();
                return [3 /*break*/, 15];
            case 14:
                $.ui.log(BOX_TOLD(one.text));
                _h.label = 15;
            case 15:
                _a++;
                return [3 /*break*/, 9];
            case 16:
                _loop_2 = function (id) {
                    if (!found.some(function (one) { return one.id === id; }))
                        boxTold.delete(id);
                };
                for (_b = 0, boxTold_1 = boxTold; _b < boxTold_1.length; _b++) {
                    id = boxTold_1[_b];
                    _loop_2(id);
                }
                _loop_3 = function (id) {
                    if (!entries.some(function (entry) { return entry.name === "".concat(id, ".json"); }))
                        boxKeys.delete(id);
                };
                for (_c = 0, _d = boxKeys.keys(); _c < _d.length; _c++) {
                    id = _d[_c];
                    _loop_3(id);
                }
                _loop_4 = function (id) {
                    if (!found.some(function (one) { return one.id === id; }))
                        (boxTries.delete(id), boxSaid.delete(id), boxTyped.delete(id), barKeyTyped.delete(id), boxModes.delete(id), boxHeldReply.delete(id));
                };
                for (_e = 0, _f = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], boxTries.keys(), true), boxSaid.keys(), true), boxTyped, true), boxModes.keys(), true), boxHeldReply.keys(), true); _e < _f.length; _e++) {
                    id = _f[_e];
                    _loop_4(id);
                }
                if (JSON.stringify(found) === JSON.stringify(boxes))
                    return [2 /*return*/];
                boxes = found;
                drawAgain($);
                return [2 /*return*/];
        }
    });
}); };
// A box's entry in the keychain: on Linux bin/keyring, which keeps it in a file only this user reads; on a Mac security itself,
// which sendBox calls as before for set and has, so only delete goes through here
var boxKeyring = function ($, what, id, stdin) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hasKeychain($)];
            case 1: return [2 /*return*/, !(_a.sent())
                    ? { exitCode: -1 }
                    : isLinux
                        ? $.process.run(__spreadArray(["".concat($.plugin.root, "/bin/keyring"), what, BOX_SERVICE, id], (what === 'set' ? ['Claudopus box'] : []), true), { stdin: stdin, timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })
                        : what === 'delete'
                            ? $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })
                            : Promise.resolve({ exitCode: -1 })
                // Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
            ];
        }
    });
}); };
// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
var sendBox = function ($, id, value) { return __awaiter(_this, void 0, void 0, function () {
    var refused, request, asked, sent, _a, escaped, r, _b, _c, isKept, _d, _e, _f, one;
    var _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                if (!value)
                    return [2 /*return*/];
                refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? "That was longer than ".concat(BOX_LONGEST, " characters, so it wasn't sent.") : /[^\x20-\x7E]/.test(value) ? "That held a line break, a curly quote or another character outside plain letters, digits and signs, so it wasn't sent. Type it again." : '';
                if (refused) {
                    boxSaid.set(id, refused);
                    boxPresses += 1;
                    boxTries.set(id, ((_g = boxTries.get(id)) !== null && _g !== void 0 ? _g : 0) + 1);
                    return [2 /*return*/, void drawAgain($)];
                }
                request = "".concat(boxesDir(), "/").concat(id, ".json");
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 1:
                if (!!(_k.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, cancelBox($, id, 'It was no longer waiting · nothing was saved')];
            case 2: return [2 /*return*/, void (_k.sent())
                // An admin password goes only sealed to its runner's key: what sits in the keychain a moment is of no use to anything else
            ];
            case 3:
                asked = boxes.find(function (other) { return other.id === id; });
                if (!(asked === null || asked === void 0 ? void 0 : asked.key)) return [3 /*break*/, 5];
                return [4 /*yield*/, sealedFor($, asked.key, value)];
            case 4:
                _a = _k.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = value;
                _k.label = 6;
            case 6:
                sent = _a;
                if (!sent) {
                    boxSaid.set(id, "It could not be secured for the command that asked, so it wasn't sent.");
                    boxPresses += 1;
                    boxTries.set(id, ((_h = boxTries.get(id)) !== null && _h !== void 0 ? _h : 0) + 1);
                    return [2 /*return*/, void drawAgain($)];
                }
                escaped = sent.replace(/[\\"]/g, '\\$&');
                return [4 /*yield*/, hasKeychain($)];
            case 7:
                if (!!(_k.sent())) return [3 /*break*/, 8];
                _b = { exitCode: -1 };
                return [3 /*break*/, 13];
            case 8:
                if (!isLinux) return [3 /*break*/, 10];
                return [4 /*yield*/, boxKeyring($, 'set', id, "".concat(sent, "\n"))];
            case 9:
                _c = _k.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, $.process
                    .run(['/usr/bin/security', '-i'], { stdin: "add-generic-password -U -s \"".concat(BOX_SERVICE, "\" -a \"").concat(id, "\" -l \"Claudopus box\" -w \"").concat(escaped, "\"\n"), timeoutMs: 15000 })
                    .catch(function () { return ({ exitCode: -1 }); })
                // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
            ];
            case 11:
                _c = _k.sent();
                _k.label = 12;
            case 12:
                _b = _c;
                _k.label = 13;
            case 13:
                r = _b;
                _d = r.exitCode === 0;
                if (!_d) return [3 /*break*/, 18];
                if (!isLinux) return [3 /*break*/, 15];
                return [4 /*yield*/, boxKeyring($, 'has', id)];
            case 14:
                _e = _k.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })];
            case 16:
                _e = _k.sent();
                _k.label = 17;
            case 17:
                _d = (_e).exitCode === 0;
                _k.label = 18;
            case 18:
                isKept = _d;
                _f = isKept;
                if (!_f) return [3 /*break*/, 20];
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 19:
                _f = !(_k.sent());
                _k.label = 20;
            case 20:
                if (!_f) return [3 /*break*/, 22];
                return [4 /*yield*/, boxKeyring($, 'delete', id)];
            case 21:
                _k.sent();
                _k.label = 22;
            case 22:
                boxPresses += 1;
                boxTries.set(id, ((_j = boxTries.get(id)) !== null && _j !== void 0 ? _j : 0) + 1);
                if (!!isKept) return [3 /*break*/, 24];
                boxSaid.set(id, "It could not be put in ".concat(keptWhere(), ". Try again."));
                return [4 /*yield*/, log($, "box ".concat(id, " not kept: security ended ").concat(r.exitCode))];
            case 23:
                _k.sent();
                return [3 /*break*/, 28];
            case 24:
                boxSent.add(id);
                boxSaid.delete(id);
                boxHeldReply.delete(id);
                if ((boxOpen === null || boxOpen === void 0 ? void 0 : boxOpen.id) === id)
                    ((boxOpen = undefined), (barBoxAt = 0));
                one = boxes.find(function (other) { return other.id === id; });
                boxes = boxes.filter(function (other) { return other.id !== id; });
                if (!one) return [3 /*break*/, 26];
                return [4 /*yield*/, noteDone($, __assign(__assign({ id: "box-".concat(id) }, (one.call ? { call: one.call } : {})), { head: boxHead(one.text), said: one.key ? 'You gave it · it went only to the command that asked, which continues now' : "You gave it \u00B7 it is in ".concat(keptWhere(), ", and the command that asked for it continues now"), what: '', isOn: true }))];
            case 25:
                _k.sent();
                _k.label = 26;
            case 26: return [4 /*yield*/, log($, "box ".concat(id, " sent to the keychain"))];
            case 27:
                _k.sent();
                _k.label = 28;
            case 28:
                drawAgain($);
                return [2 /*return*/];
        }
    });
}); };
// Cancel: the request goes, and the runner, finding it gone, ends as when a box is cancelled
var cancelBox = function ($_1, id_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1], args_1, true), void 0, function ($, id, said) {
        var one;
        if (said === void 0) { said = 'You cancelled · nothing was saved, and what asked for it stops without it'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    boxSent.add(id);
                    barKeyTyped.delete(id);
                    one = boxes.find(function (other) { return other.id === id; });
                    boxes = boxes.filter(function (other) { return other.id !== id; });
                    if ((boxOpen === null || boxOpen === void 0 ? void 0 : boxOpen.id) === id)
                        ((boxOpen = undefined), (barBoxAt = 0));
                    boxHeldReply.delete(id);
                    // The box goes in the press's own drawing, before its request is removed
                    drawAgain($);
                    return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json")]).catch(function () { return undefined; })
                        // Cancelled, nothing more comes of it: it is over at once
                    ];
                case 1:
                    _a.sent();
                    if (!one) return [3 /*break*/, 3];
                    return [4 /*yield*/, noteDone($, __assign(__assign({ id: "box-".concat(id) }, (one.call ? { call: one.call, endedAt: 0 } : {})), { head: boxHead(one.text), said: said, what: '' }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    drawAgain($);
                    return [2 /*return*/];
            }
        });
    });
};
var boxOpen;
// The mode of a box drawn with its own field, where it differs from the key
var boxModes = new Map();
// A response that looked like a key itself, held a moment so the person decides: sent anyway, kept as the key, or neither
var boxHeldReply = new Map();
// When a response was left for its runner, which takes it within a second or two: until BOX_REPLY_TAKEN after, it is never removed
var boxRepliedAt = new Map();
var BOX_REPLY_TAKEN = 60000;
// The name a key box asks for, none for the box that asks a key's name
var boxNameOf = function (one) { var _a; return (_a = one.text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)) === null || _a === void 0 ? void 0 : _a[1]; };
var isNameBox = function (one) { return one.text.startsWith('Name of the key to save'); };
// The words of a response that look like a key rather than about one: a word that starts as the distinctive keys and tokens do, a
// short prefix (sk-, npm_) with digits after it, a key shaped as a UUID, a password inside an address, or a long run of letters and
// digits that is no path, address or hyphenated name. Ordinary words, paths and names of settings pass
var KEY_DISTINCT = /^(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_|glpat-|xox[abprs]-|AKIA|ASIA|AIza|ya29\.|eyJ)[A-Za-z0-9_.-]{10,}/;
var KEY_SHORT = /^(?:sk|pk|rk|hf|npm|vck)[-_](?=(?:[^\d]*\d){2})[A-Za-z0-9_-]{12,}$/;
var KEY_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var KEY_IN_ADDRESS = /^[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s@]+@/i;
var keyWords = function (text) {
    return text
        .split(/\s+/)
        .map(function (word) { return word.replace(/^["'`(<]+|["'`)>.,;:!?]+$/g, ''); })
        .filter(function (bare) {
        var _a, _b;
        if (KEY_DISTINCT.test(bare) || KEY_SHORT.test(bare) || KEY_UUID.test(bare) || KEY_IN_ADDRESS.test(bare))
            return true;
        if (bare.length < 20 || /^(?:\/|~|\.\.?\/)/.test(bare) || /\.[A-Za-z]{1,8}$/.test(bare) || /:\/\/|@/.test(bare) || /^[a-z0-9]+(?:[-_][a-z0-9]+){2,}$/i.test(bare))
            return false;
        return (/[A-Za-z]/.test(bare) && ((_b = (_a = bare.match(/\d/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) >= 3) || (bare.length >= 32 && /[a-z]/.test(bare) && /[A-Z]/.test(bare));
    });
};
var looksLikeKey = function (text) { return keyWords(text).length > 0; };
var BOX_LOOKS_KEY = function (where) { return "That looks like the key itself. A response goes to Claude as words, into the chat. Keep it as the key to put it only in ".concat(where, ", or send it as a response anyway."); };
// Opens a key box's field in the bar above the prompt, for the key or a response, or closes it. One box in the bar at a time:
// an ask's reply box open there closes (openReply does the same the other way). The cursor is asked into the field
var openBox = function ($, id, mode, surface) {
    if (id && replyTo)
        (barLeft.set(replyTo, barDraft(replyTo)), (replyTo = ''), (replyMark = ''));
    boxOpen = id ? { id: id, mode: mode } : undefined;
    barKeyTyped.clear();
    if (id)
        (boxHeldReply.delete(id), boxSaid.delete(id));
    barBoxAt = 0;
    boxPresses += 1;
    drawAgain($);
    var bar = barIds.get(surface);
    if (!id || !bar)
        return;
    void $.ui
        .focus({ requestId: bar, key: barKeyBoxKey(id, mode) })
        .then(function (r) { var _a; return recordEvent($, 'focus-call', { deny: (_a = r.deny) !== null && _a !== void 0 ? _a : null }); })
        .catch(function (err) { return recordEvent($, 'focus-call', { failed: String(err).slice(0, 80) }); });
};
// The bar's field for a key box: named as the bar's reply boxes are (isBarBox), so a click in it holds the bar as drawn
var barKeyBoxKey = function (id, mode) { var _a; return "band-box-".concat(id, "-reply-").concat(mode, "-").concat((_a = boxTries.get(id)) !== null && _a !== void 0 ? _a : 0); };
// The person's words in place of the key: left beside the request for its runner, which finds the request gone, prints them and
// ends without the key. Nothing goes to the keychain. Words that look like the key itself are held until the person says which
var sendBoxReply = function ($_1, id_1, text_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1, text_1], args_1, true), void 0, function ($, id, text, isSure) {
        var said, one, request, name, asked, isWritten, _a, _b, _c;
        if (isSure === void 0) { isSure = false; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    said = text.trim();
                    one = boxes.find(function (other) { return other.id === id; });
                    if (!said || !one)
                        return [2 /*return*/];
                    if (!isSure && looksLikeKey(said)) {
                        boxHeldReply.set(id, said);
                        boxSaid.set(id, BOX_LOOKS_KEY(keptWhere()));
                        boxPresses += 1;
                        return [2 /*return*/, void drawAgain($)];
                    }
                    boxHeldReply.delete(id);
                    request = "".concat(boxesDir(), "/").concat(id, ".json");
                    return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
                case 1:
                    if (!!(_d.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, cancelBox($, id, 'It was no longer waiting · your response was not sent')];
                case 2: return [2 /*return*/, void (_d.sent())];
                case 3:
                    name = boxNameOf(one);
                    asked = name ? "giving ".concat(name) : isNameBox(one) ? 'naming a key to save' : 'giving the key';
                    return [4 /*yield*/, $.fs
                            .write("".concat(boxesDir(), "/").concat(id, ".reply"), "".concat(who(true), " answered in the Claudopus panel instead of ").concat(asked, ", in their own words: ").concat(said, "\n"))
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 4:
                    isWritten = _d.sent();
                    if (!isWritten) return [3 /*break*/, 6];
                    _b = (_a = boxRepliedAt).set;
                    _c = [id];
                    return [4 /*yield*/, $.clock.now()];
                case 5:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    _d.label = 6;
                case 6:
                    if (!isWritten) {
                        boxSaid.set(id, "Your response couldn't be left for the command that asked. Try again.");
                        boxPresses += 1;
                        return [2 /*return*/, void drawAgain($)];
                    }
                    boxSent.add(id);
                    boxSaid.delete(id);
                    boxes = boxes.filter(function (other) { return other.id !== id; });
                    if ((boxOpen === null || boxOpen === void 0 ? void 0 : boxOpen.id) === id)
                        ((boxOpen = undefined), (barBoxAt = 0));
                    drawAgain($);
                    return [4 /*yield*/, $.process.run(['rm', '-f', request]).catch(function () { return undefined; })];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, noteDone($, __assign(__assign({ id: "box-".concat(id) }, (one.call ? { call: one.call } : {})), { head: boxHead(one.text), said: 'You gave a response instead · it went to the command that asked, and nothing was saved', what: "\u201C".concat(cut(oneLine(said), 160), "\u201D"), isOn: true }))];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, log($, "box ".concat(id, " answered in words"))];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// What is typed in a key's field goes by its mode: the key to the keychain, a response to the command that asked
var submitBox = function ($, id, mode, value) {
    boxTyped.delete(id);
    barKeyTyped.delete(id);
    freeTimes($);
    barBoxAt = 0;
    var run = mode === 'reply' ? sendBoxReply($, id, value) : sendBox($, id, value);
    void run.catch(function () { return log($, "box ".concat(id, " not sent")); });
};
// The word of a held response that looked like the key goes to the keychain, never the words around it; with more than one such
// word nobody can tell which is the key, so the key's field opens for it to be pasted alone
var keepHeldAsKey = function ($, id, surface) {
    var _a, _b;
    var words = keyWords((_a = boxHeldReply.get(id)) !== null && _a !== void 0 ? _a : '');
    boxHeldReply.delete(id);
    if (words.length === 1)
        return void sendBox($, id, (_b = words[0]) !== null && _b !== void 0 ? _b : '').catch(function () { return log($, "box ".concat(id, " not sent")); });
    if (repliesInBar(surface))
        openBox($, id, 'key', surface);
    else
        (boxModes.set(id, 'key'), (boxPresses += 1));
    boxSaid.set(id, 'More than one word looked like a key: paste just the key.');
    drawAgain($);
};
// Under a response held for looking like a key: keep it as the key, or send it as words anyway
var heldReplyButtons = function ($, ui, id, where) {
    return boxHeldReply.has(id) ? (<ui.Box key={"".concat(where, "-").concat(id, "-held")} flexDirection="row" gap={1} flexWrap="wrap">
      <ui.Button key={"".concat(where, "-").concat(id, "-askey-").concat(boxPresses)} label="Keep it as the key" onPress={function (press) { return keepHeldAsKey($, id, press.surface); }}/>
      <ui.Button key={"".concat(where, "-").concat(id, "-anyway-").concat(boxPresses)} label="Send it as a response" plain onPress={function () { var _a; return void sendBoxReply($, id, (_a = boxHeldReply.get(id)) !== null && _a !== void 0 ? _a : '', true); }}/>
    </ui.Box>) : null;
};
// The box in the bar above the prompt for the key box opened there: what goes where on a line of its own, the field under it as wide
// as the bar, and Send, the big one, and Close, small, under that, as the reply box is (band.tsx, barReply). A key is one line; a
// response grows with its text as the chat's own box does. No submitLabel: the app draws one as a second, small send button, and
// with one a box of several lines sends only on Cmd+Enter
var barKeyRow = function ($, ui, one, mode, columns) {
    var name = boxNameOf(one);
    var head = mode === 'reply' ? "\u21B3 Instead of ".concat(name !== null && name !== void 0 ? name : (isNameBox(one) ? 'the name' : 'the key')) : name ? "\u21B3 ".concat(name) : "\u21B3 The key's name";
    var key = barKeyBoxKey(one.id, mode);
    var rows = barKeyRows(one.id, mode, columns);
    return (<ui.Box key="band-key" flexDirection="column" flexShrink={0} width="100%">
      <ui.Box flexDirection="row" height={1} overflow="hidden">
        <ui.Text color={NEEDS} bold wrap="truncate-end">{head}</ui.Text>
      </ui.Box>
      {'Input' in ui ? (<ui.Box flexDirection="column" width="100%" flexShrink={0}>
          <ui.Input key={key} placeholder={mode === 'reply' ? 'Type your response' : isNameBox(one) ? 'Type the name' : 'Paste the key'} rows={rows} autoFocus onInput={function (value) { return void ((value ? boxTyped.add(one.id) : boxTyped.delete(one.id)), barKeyTyped.set(one.id, value), holdTimes($), $.clock.now().then(function (at) { return (barBoxAt = at); }), mode === 'reply' ? growBox($, key, rows !== null && rows !== void 0 ? rows : 1, boxRows(value, columns)) : undefined); }} onSubmit={function (value) { return submitBox($, one.id, mode, value); }}/>
        </ui.Box>) : null}
      {boxSaid.get(one.id) ? <ui.Text key="band-key-said" color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      {heldReplyButtons($, ui, one.id, 'band-key')}
      {barFoot($, ui, 'band-key', boxPresses, function () { var _a; return void (barKeyTyped.get(one.id) && submitBox($, one.id, mode, (_a = barKeyTyped.get(one.id)) !== null && _a !== void 0 ? _a : '')); }, function (press) { return openBox($, undefined, mode, press.surface); }, mode === 'reply')}
    </ui.Box>);
};
// How many lines the bar's key box is drawn: a key or a name one, a response as many as its text needs
var barKeyRows = function (id, mode, columns) { var _a; return (mode === 'reply' ? boxRows((_a = barKeyTyped.get(id)) !== null && _a !== void 0 ? _a : '', columns) : undefined); };
// The key box open in the bar on a surface that takes one, none once it is answered, cancelled or gone
var barKeyTarget = function () { return (boxOpen ? boxes.find(function (one) { return one.id === (boxOpen === null || boxOpen === void 0 ? void 0 : boxOpen.id) && !one.key; }) : undefined); };
// Each box with when it was asked, so the panel puts it among what waits on the person, the newest first
var boxRows = function ($, ui, isKeysHeld, surface) {
    if (isKeysHeld === void 0) { isKeysHeld = false; }
    if (surface === void 0) { surface = ''; }
    if (!boxes.length || !('Input' in ui))
        return [];
    // This chat's own first request holds the keys, so a value typed for the notice it told goes to its own box, wherever it is drawn
    var shown = __spreadArray(__spreadArray([], boxes.filter(function (one) { return one.chat === boxChat; }), true), boxes.filter(function (one) { return one.chat !== boxChat; }), true);
    var isBar = repliesInBar(surface);
    return shown.map(function (one, n) {
        var _a, _b;
        var isKey = !one.key;
        var name = boxNameOf(one);
        var inBar = isKey && isBar;
        var mode = (_a = (inBar ? undefined : boxModes.get(one.id))) !== null && _a !== void 0 ? _a : 'key';
        var isOpen = inBar && (boxOpen === null || boxOpen === void 0 ? void 0 : boxOpen.id) === one.id;
        var what = isNameBox(one) ? 'the name' : 'the key';
        return { at: one.at, node: (<ui.Box key={"box-".concat(one.id)} flexDirection="column" gap={1} borderStyle="round" borderColor={NEEDS} paddingX={1} flexShrink={0}>
      <ui.Text dimColor wrap="truncate-end">{isKey ? 'Key · waits for you' : 'Admin password · waits for you to type it'}</ui.Text>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      {one.command ? <ui.Text dimColor wrap="wrap">{"Asked by this chat's command: ".concat(cut(oneLine(one.command), 200))}</ui.Text> : null}
      <ui.Text dimColor wrap="wrap">{!isKey ? 'What you type here shows as you type it. It goes only to the command that asked, locked to that command, never into a chat, and is not saved.'
                    : inBar ? "Paste ".concat(what, " in the box above the chat: it goes only into ").concat(keptWhere(), ", never into a chat. Or give a response instead, such as where ").concat(name !== null && name !== void 0 ? name : 'the key', " already is, and the command that asked gets your words.")
                        : mode === 'reply' ? 'Your response goes to the command that asked, in place of the key, and nothing is saved.'
                            : "What you type here shows as you type it. It goes only into ".concat(keptWhere(), ", never into a chat.")}</ui.Text>
      {inBar ? null : (<ui.Box width="100%" flexDirection="column">
        <ui.Input key={"box-".concat(one.id, "-field-").concat(mode === 'reply' ? 'reply-' : '').concat((_b = boxTries.get(one.id)) !== null && _b !== void 0 ? _b : 0)} placeholder={mode === 'reply' ? 'Type your response' : 'Type or paste it here'} submitLabel="send" autoFocus={n === 0 && !isKeysHeld ? true : undefined} onInput={function (value) { return void ((value ? boxTyped.add(one.id) : boxTyped.delete(one.id)), holdTimes($)); }} onSubmit={function (value) { return submitBox($, one.id, mode, value); }}/>
      </ui.Box>)}
      {isOpen ? <ui.Text key={"box-".concat(one.id, "-inbar")} dimColor wrap="wrap">✎ Type it in the box above the chat</ui.Text> : null}
      {boxSaid.get(one.id) && !isOpen ? <ui.Text key={"box-".concat(one.id, "-said")} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      {isOpen ? null : heldReplyButtons($, ui, one.id, 'box')}
      <ui.Box flexDirection="row" flexWrap="wrap" gap={1}>
        {inBar && isOpen ? <ui.Button key={"box-".concat(one.id, "-close-").concat(boxPresses)} label="Close the box" onPress={function (press) { return openBox($, undefined, 'key', press.surface); }}/> : null}
        {inBar && !isOpen ? <ui.Button key={"box-".concat(one.id, "-paste-").concat(boxPresses)} label={isNameBox(one) ? 'Type the name' : 'Paste the key'} onPress={function (press) { return openBox($, one.id, 'key', press.surface); }}/> : null}
        {inBar && !isOpen ? <ui.Button key={"box-".concat(one.id, "-respond-").concat(boxPresses)} label="Give a response instead" onPress={function (press) { return openBox($, one.id, 'reply', press.surface); }}/> : null}
        {isKey && !inBar ? (<ui.Button key={"box-".concat(one.id, "-mode-").concat(boxPresses)} label={mode === 'reply' ? "Type ".concat(what, " instead") : 'Give a response instead'} onPress={function () { return void (boxModes.set(one.id, mode === 'reply' ? 'key' : 'reply'), boxHeldReply.delete(one.id), boxSaid.delete(one.id), (boxPresses += 1), drawAgain($)); }}/>) : null}
        <ui.Button key={"box-".concat(one.id, "-cancel-").concat(boxPresses)} label="Cancel" plain onPress={function () { return void cancelBox($, one.id); }}/>
      </ui.Box>
    </ui.Box>) };
    });
};
