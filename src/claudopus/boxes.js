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
var runnerBegun = function (id, command, at, agent) { return void runnerCalls.set(id, __assign({ command: command, at: at, until: Infinity }, (agent ? { agent: agent } : {}))); };
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
// The runner that made a request, for the card its box goes on: of those that could have, the ones whose command names the same
// runner (and, for a key, the same key); only when exactly one does is its task known, else the box is no card's (17 Nov, second
// look: the latest runner was taken, and a box went on another task's card)
// Once known, a box's task is kept by its id, so a runner begun later never takes the box off its card (boxAgents). A runner whose
// command names neither runner reached it through a script, and could have made either kind
var boxAgents = new Map();
var runnerFor = function (one, at, now) {
    var runner = runnerOf(at, now);
    if (!runner)
        return undefined;
    var kept = typeof one.id === 'string' ? boxAgents.get(one.id) : undefined;
    if (kept)
        return { call: runner.call, command: runner.command, agent: kept };
    var live = __spreadArray([], runnerCalls, true).map(function (_a) {
        var call = _a[0], other = _a[1];
        return (__assign(__assign({}, other), { call: call }));
    }).filter(function (other) { return other.until >= now && other.at <= at + BOX_SKEW; });
    var isScript = function (command) { return !/\bbin\/(?:admin|secret)\b/.test(command); };
    var same = live.filter(function (other) { return isScript(other.command) || (one.kind === 'admin' ? /\bbin\/admin\b/.test(other.command) : /\bbin\/secret\b/.test(other.command) && (typeof one.name !== 'string' || other.command.includes(one.name))); });
    var only = same[0];
    if (same.length === 1 && only) {
        if (only.agent && typeof one.id === 'string')
            boxAgents.set(one.id, only.agent);
        return only;
    }
    return { call: runner.call, command: runner.command };
};
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
    refused: 'That password was wrong. ',
    short: 'That was shorter than 4 characters. ',
    control: 'That had a line break or another special character. ',
};
// The wording for a request, or undefined for one the panel does not draw
var boxWording = function (one) {
    // A reason it does not know is left out
    var again = typeof one.again === 'string' && Object.hasOwn(BOX_AGAIN, one.again) ? BOX_AGAIN[one.again] : '';
    if (one.kind === 'admin') {
        // A password is sent only sealed to the key the runner made for this one request: a request with none is drawn nowhere
        if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined || typeof one.key !== 'string' || !BOX_KEY.test(one.key))
            return undefined;
        var mac = one.host === 'here' ? "This Mac's password" : "The password of ".concat(one.host);
        return { kind: 'password', host: one.host, text: "".concat(again).concat(mac, " is needed to run this as admin."), details: 'It goes only to this command and is never saved.' };
    }
    if (one.kind === 'secret') {
        if (one.host !== undefined)
            return undefined;
        // No name: the first box of a key saved by hand asks its name
        if (one.name === undefined)
            return { kind: 'key', text: 'Which name should the key be saved under, such as GITHUB_TOKEN?', details: 'Commands use the key by this name.' };
        if (typeof one.name !== 'string' || !BOX_NAME.test(one.name))
            return undefined;
        return { kind: 'key', name: one.name, text: "".concat(again).concat(one.name, " is needed to run this task's command."), details: "It goes only into ".concat(keptWhere(), ".") };
    }
    return undefined;
};
var boxes = [];
// What is typed in a box is kept by the surface alone, never here or drawn back: a drawing that carried it put older letters over
// newer ones. Each try that left the box to be typed again gives its field a new key, so the field starts empty
var boxTries = new Map();
// The boxes something is typed in, unsent, so an ask's reply box does not take the keys from them
var boxTyped = new Set();
// What is typed for a box in the box above the chat while it is open, only so its Send button can send it: never written
// anywhere, and gone once it is sent, closed or the box moves
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
var BOX_TOLD = function (one) { return "".concat(one.text, " Press ").concat(one.kind === 'password' ? TYPE_IT : PASTE_IT, " on it in the Claudopus panel (/claudopus opens it) and type it in the box above the chat, never in the chat itself").concat(one.kind === 'password' ? '' : ". Or answer in words, such as where it already is", "."); };
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID, read at each look (a /clear can change it)
var boxChat = '';
// Requests this chat has told or seen told
var boxTold = new Set();
var lookBoxes = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, found, entries, cards, _a, _loop_1, _i, entries_1, entry, _b, found_1, one, mark_1, opened_1, _loop_2, _c, boxTold_1, id, _loop_3, _d, _e, id, _loop_4, _f, _g, id;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
                if (!(_k.sent()).length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 2:
                boxChat = _k.sent();
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _k.sent();
                found = [];
                return [4 /*yield*/, $.fs.list(boxesDir()).catch(function () { return []; })];
            case 4:
                entries = _k.sent();
                if (!entries.length) return [3 /*break*/, 6];
                return [4 /*yield*/, read($, todos)];
            case 5:
                _a = _k.sent();
                return [3 /*break*/, 7];
            case 6:
                _a = [];
                _k.label = 7;
            case 7:
                cards = _a;
                _loop_1 = function (entry) {
                    var marked, answered, id, one, _l, _m, words, runner_1, key, isKeySame, card, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                marked = entry.name.replace(/\.told$/, '');
                                answered = entry.name.replace(/\.reply$/, '');
                                if (!(entry.name.endsWith('.reply') && BOX_ID.test(answered) && !entries.some(function (other) { return other.name === "".concat(answered, ".json"); }) && now - ((_h = boxRepliedAt.get(answered)) !== null && _h !== void 0 ? _h : 0) > BOX_REPLY_TAKEN)) return [3 /*break*/, 2];
                                boxRepliedAt.delete(answered);
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(entry.name)]).catch(function () { return undefined; })];
                            case 1:
                                (_p.sent());
                                _p.label = 2;
                            case 2:
                                if (!(entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(function (other) { return other.name === "".concat(marked, ".json"); }))) return [3 /*break*/, 4];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(entry.name)]).catch(function () { return undefined; })];
                            case 3:
                                _p.sent();
                                _p.label = 4;
                            case 4:
                                id = entry.name.replace(/\.json$/, '');
                                if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id))
                                    return [2 /*return*/, "continue"];
                                _p.label = 5;
                            case 5:
                                _p.trys.push([5, 11, , 12]);
                                _m = (_l = JSON).parse;
                                return [4 /*yield*/, readOr($, "".concat(boxesDir(), "/").concat(entry.name))];
                            case 6:
                                one = _m.apply(_l, [_p.sent()]);
                                words = one && typeof one === 'object' ? boxWording(one) : undefined;
                                runner_1 = typeof one.at === 'number' ? runnerFor(one, one.at, now) : undefined;
                                key = typeof one.key === 'string' ? one.key : undefined;
                                if (key && !boxKeys.has(id))
                                    boxKeys.set(id, key);
                                isKeySame = !key || boxKeys.get(id) === key;
                                card = (runner_1 === null || runner_1 === void 0 ? void 0 : runner_1.agent) ? (_j = cards.find(function (other) { var _a; return other.id === topOf(cards, (_a = runner_1.agent) !== null && _a !== void 0 ? _a : ''); })) === null || _j === void 0 ? void 0 : _j.id : undefined;
                                if (!(one.id === id && words && isKeySame && typeof one.at === 'number' && now - one.at < BOX_OLD && one.at - now <= BOX_SKEW && one.chat === boxChat && boxChat && runner_1)) return [3 /*break*/, 7];
                                found.push(__assign(__assign(__assign(__assign(__assign({ id: id }, words), { at: one.at, chat: one.chat, command: runner_1.command, call: runner_1.call }), (runner_1.agent ? { agent: runner_1.agent } : {})), (card ? { card: card } : {})), (one.kind === 'admin' && key ? { key: key } : {})));
                                return [3 /*break*/, 10];
                            case 7:
                                if (!(typeof one.at === 'number' && (now - one.at >= BOX_OLD || one.at - now > BOX_SKEW))) return [3 /*break*/, 10];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json"), "".concat(boxesDir(), "/").concat(id, ".told"), "".concat(boxesDir(), "/").concat(id, ".reply")]).catch(function () { return undefined; })];
                            case 8:
                                _p.sent();
                                return [4 /*yield*/, boxKeyring($, 'delete', id)];
                            case 9:
                                _p.sent();
                                _p.label = 10;
                            case 10: return [3 /*break*/, 12];
                            case 11:
                                _o = _p.sent();
                                return [3 /*break*/, 12];
                            case 12: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, entries_1 = entries;
                _k.label = 8;
            case 8:
                if (!(_i < entries_1.length)) return [3 /*break*/, 11];
                entry = entries_1[_i];
                return [5 /*yield**/, _loop_1(entry)];
            case 9:
                _k.sent();
                _k.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 8];
            case 11:
                found.sort(function (a, b) { return a.at - b.at; });
                _b = 0, found_1 = found;
                _k.label = 12;
            case 12:
                if (!(_b < found_1.length)) return [3 /*break*/, 19];
                one = found_1[_b];
                if (boxTold.has(one.id))
                    return [3 /*break*/, 18];
                // Another chat's request waits for that chat a moment (and every request does, in a chat that cannot read its own id)
                if (one.chat !== undefined && one.chat !== boxChat && now - one.at < BOX_GRACE)
                    return [3 /*break*/, 18];
                boxTold.add(one.id);
                return [4 /*yield*/, $.process.run(['sh', '-c', 'set -C; : > "$1"', 'sh', "".concat(boxesDir(), "/").concat(one.id, ".told")]).catch(function () { return ({ exitCode: 1 }); })];
            case 13:
                mark_1 = _k.sent();
                if (mark_1.exitCode !== 0)
                    return [3 /*break*/, 18];
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(function (err) { return (log($, "panel not opened for a box: ".concat(String(err))), undefined); })];
            case 14:
                opened_1 = _k.sent();
                if (!!(opened_1 === null || opened_1 === void 0 ? void 0 : opened_1.isPlaced)) return [3 /*break*/, 17];
                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(one.id, ".told")]).catch(function () { return undefined; })];
            case 15:
                _k.sent();
                return [4 /*yield*/, log($, "box ".concat(one.id, " given back: the panel is not drawn here").concat(opened_1 && !opened_1.isPlaced ? " (".concat(opened_1.reason, ")") : ''))];
            case 16:
                _k.sent();
                return [3 /*break*/, 18];
            case 17:
                $.ui.log(BOX_TOLD(one));
                _k.label = 18;
            case 18:
                _b++;
                return [3 /*break*/, 12];
            case 19:
                _loop_2 = function (id) {
                    if (!found.some(function (one) { return one.id === id; }))
                        boxTold.delete(id);
                };
                for (_c = 0, boxTold_1 = boxTold; _c < boxTold_1.length; _c++) {
                    id = boxTold_1[_c];
                    _loop_2(id);
                }
                _loop_3 = function (id) {
                    if (!entries.some(function (entry) { return entry.name === "".concat(id, ".json"); }))
                        boxKeys.delete(id);
                };
                for (_d = 0, _e = boxKeys.keys(); _d < _e.length; _d++) {
                    id = _e[_d];
                    _loop_3(id);
                }
                _loop_4 = function (id) {
                    if (!found.some(function (one) { return one.id === id; }))
                        (boxTries.delete(id), boxSaid.delete(id), boxTyped.delete(id), barKeyTyped.delete(id), boxModes.delete(id), boxHeldReply.delete(id));
                };
                for (_f = 0, _g = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], boxTries.keys(), true), boxSaid.keys(), true), boxTyped, true), boxModes.keys(), true), boxHeldReply.keys(), true); _f < _g.length; _f++) {
                    id = _g[_f];
                    _loop_4(id);
                }
                if (barOpen && isBoxKind(barOpen.kind) && !found.some(function (one) { return one.id === (barOpen === null || barOpen === void 0 ? void 0 : barOpen.id); }))
                    closeBarOf(barOpen.id);
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
    var _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                if (!value)
                    return [2 /*return*/];
                refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? "That's longer than ".concat(BOX_LONGEST, " characters, so it wasn't sent.") : /[^\x20-\x7E]/.test(value) ? "That has a line break, a curly quote or another special character, so it wasn't sent. Type it again." : '';
                if (refused) {
                    boxSaid.set(id, refused);
                    boxPresses += 1;
                    boxTries.set(id, ((_g = boxTries.get(id)) !== null && _g !== void 0 ? _g : 0) + 1);
                    return [2 /*return*/, void drawAgain($)];
                }
                request = "".concat(boxesDir(), "/").concat(id, ".json");
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 1:
                if (!!(_l.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, cancelBox($, id, 'the command had stopped waiting, so nothing was saved')];
            case 2: return [2 /*return*/, void (_l.sent())
                // An admin password goes only sealed to its runner's key: what sits in the keychain a moment is of no use to anything else
            ];
            case 3:
                asked = boxes.find(function (other) { return other.id === id; });
                if (!(asked === null || asked === void 0 ? void 0 : asked.key)) return [3 /*break*/, 5];
                return [4 /*yield*/, sealedFor($, asked.key, value)];
            case 4:
                _a = _l.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = value;
                _l.label = 6;
            case 6:
                sent = _a;
                if (!sent) {
                    boxSaid.set(id, "It couldn't be encrypted for the command that asked, so it wasn't sent.");
                    boxPresses += 1;
                    boxTries.set(id, ((_h = boxTries.get(id)) !== null && _h !== void 0 ? _h : 0) + 1);
                    return [2 /*return*/, void drawAgain($)];
                }
                escaped = sent.replace(/[\\"]/g, '\\$&');
                return [4 /*yield*/, hasKeychain($)];
            case 7:
                if (!!(_l.sent())) return [3 /*break*/, 8];
                _b = { exitCode: -1 };
                return [3 /*break*/, 13];
            case 8:
                if (!isLinux) return [3 /*break*/, 10];
                return [4 /*yield*/, boxKeyring($, 'set', id, "".concat(sent, "\n"))];
            case 9:
                _c = _l.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, $.process
                    .run(['/usr/bin/security', '-i'], { stdin: "add-generic-password -U -s \"".concat(BOX_SERVICE, "\" -a \"").concat(id, "\" -l \"Claudopus box\" -w \"").concat(escaped, "\"\n"), timeoutMs: 15000 })
                    .catch(function () { return ({ exitCode: -1 }); })
                // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
            ];
            case 11:
                _c = _l.sent();
                _l.label = 12;
            case 12:
                _b = _c;
                _l.label = 13;
            case 13:
                r = _b;
                _d = r.exitCode === 0;
                if (!_d) return [3 /*break*/, 18];
                if (!isLinux) return [3 /*break*/, 15];
                return [4 /*yield*/, boxKeyring($, 'has', id)];
            case 14:
                _e = _l.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })];
            case 16:
                _e = _l.sent();
                _l.label = 17;
            case 17:
                _d = (_e).exitCode === 0;
                _l.label = 18;
            case 18:
                isKept = _d;
                _f = isKept;
                if (!_f) return [3 /*break*/, 20];
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 19:
                _f = !(_l.sent());
                _l.label = 20;
            case 20:
                if (!_f) return [3 /*break*/, 22];
                return [4 /*yield*/, boxKeyring($, 'delete', id)];
            case 21:
                _l.sent();
                _l.label = 22;
            case 22:
                boxPresses += 1;
                boxTries.set(id, ((_j = boxTries.get(id)) !== null && _j !== void 0 ? _j : 0) + 1);
                if (!!isKept) return [3 /*break*/, 24];
                boxSaid.set(id, "It couldn't be saved in ".concat(keptWhere(), ". Try again."));
                return [4 /*yield*/, log($, "box ".concat(id, " not kept: security ended ").concat(r.exitCode))];
            case 23:
                _l.sent();
                return [3 /*break*/, 26];
            case 24:
                boxSent.add(id);
                boxSaid.delete(id);
                boxHeldReply.delete(id);
                closeBarOf(id);
                one = boxes.find(function (other) { return other.id === id; });
                boxes = boxes.filter(function (other) { return other.id !== id; });
                if (one)
                    pressedLine($, (_k = one.card) !== null && _k !== void 0 ? _k : '', '', '', one.kind === 'password' ? 'You gave the password' : one.name ? "You gave ".concat(one.name) : 'You named the key');
                return [4 /*yield*/, log($, "box ".concat(id, " sent to the keychain"))];
            case 25:
                _l.sent();
                _l.label = 26;
            case 26:
                drawAgain($);
                return [2 /*return*/];
        }
    });
}); };
// Don't allow, or Don't give it: the request goes, and the runner, finding it gone, ends as when a box is cancelled
var cancelBox = function ($_1, id_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1], args_1, true), void 0, function ($, id, said) {
        var one;
        var _a;
        if (said === void 0) { said = ''; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    boxSent.add(id);
                    barKeyTyped.delete(id);
                    one = boxes.find(function (other) { return other.id === id; });
                    boxes = boxes.filter(function (other) { return other.id !== id; });
                    closeBarOf(id);
                    boxHeldReply.delete(id);
                    // The block goes in the press's own drawing, before its request is removed, and one grey line says what was pressed
                    if (one)
                        pressedLine($, (_a = one.card) !== null && _a !== void 0 ? _a : '', one.kind === 'password' ? DONT_ALLOW : DONT_GIVE, said);
                    drawAgain($);
                    return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json")]).catch(function () { return undefined; })];
                case 1:
                    _b.sent();
                    drawAgain($);
                    return [2 /*return*/];
            }
        });
    });
};
// The mode of a box drawn with its own field, where it differs from the key
var boxModes = new Map();
// A response that looked like a key itself, held a moment so the person decides: sent anyway, kept as the key, or neither
var boxHeldReply = new Map();
// When a response was left for its runner, which takes it within a second or two: until BOX_REPLY_TAKEN after, it is never removed
var boxRepliedAt = new Map();
var BOX_REPLY_TAKEN = 60000;
// The name a key box asks for, none for the box that asks a key's name
var boxNameOf = function (one) { return one.name; };
var isNameBox = function (one) { return one.kind === 'key' && !one.name; };
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
var BOX_LOOKS_KEY = function (where) { return "That looks like the key itself. An answer in words is read by the task that asked. Save it as the key to keep it only in ".concat(where, ", or send it as an answer anyway."); };
// The kinds of the box above the chat that are a password or key box's (asking.tsx, barOpen)
var isBoxKind = function (kind) { return kind === 'key' || kind === 'words' || kind === 'password'; };
// The box above the chat as a password or key block opens it: for the key or password itself, or for words in place of a key
var barKindOf = function (one, mode) { return (one.kind === 'password' ? 'password' : mode === 'reply' ? 'words' : 'key'); };
// The person's words in place of the key: left beside the request for its runner, which finds the request gone, prints them and
// ends without the key. Nothing goes to the keychain. Words that look like the key itself are held until the person says which
var sendBoxReply = function ($_1, id_1, text_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, id_1, text_1], args_1, true), void 0, function ($, id, text, isSure) {
        var said, one, request, name, asked, isWritten, _a, _b, _c;
        var _d;
        if (isSure === void 0) { isSure = false; }
        return __generator(this, function (_e) {
            switch (_e.label) {
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
                    if (!!(_e.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, cancelBox($, id, "the command had stopped waiting, so your answer wasn't sent")];
                case 2: return [2 /*return*/, void (_e.sent())];
                case 3:
                    name = boxNameOf(one);
                    asked = name ? "giving ".concat(name) : isNameBox(one) ? 'naming a key to save' : 'giving the key';
                    return [4 /*yield*/, $.fs
                            .write("".concat(boxesDir(), "/").concat(id, ".reply"), "".concat(who(true), " answered in the Claudopus panel instead of ").concat(asked, ", in their own words: ").concat(said, "\n"))
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                case 4:
                    isWritten = _e.sent();
                    if (!isWritten) return [3 /*break*/, 6];
                    _b = (_a = boxRepliedAt).set;
                    _c = [id];
                    return [4 /*yield*/, $.clock.now()];
                case 5:
                    _b.apply(_a, _c.concat([_e.sent()]));
                    _e.label = 6;
                case 6:
                    if (!isWritten) {
                        boxSaid.set(id, "Your answer couldn't be passed to the command that asked. Try again.");
                        boxPresses += 1;
                        return [2 /*return*/, void drawAgain($)];
                    }
                    boxSent.add(id);
                    boxSaid.delete(id);
                    boxes = boxes.filter(function (other) { return other.id !== id; });
                    closeBarOf(id);
                    pressedLine($, (_d = one.card) !== null && _d !== void 0 ? _d : '', '', '', "You answered \u201C".concat(cut(oneLine(said), 60), "\u201D"));
                    drawAgain($);
                    return [4 /*yield*/, $.process.run(['rm', '-f', request]).catch(function () { return undefined; })];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, log($, "box ".concat(id, " answered in words"))];
                case 8:
                    _e.sent();
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
        openBar($, { kind: 'key', id: id }, surface);
    else
        (boxModes.set(id, 'key'), (boxPresses += 1));
    boxSaid.set(id, 'More than one word looks like a key. Paste only the key.');
    drawAgain($);
};
// Under a response held for looking like a key: keep it as the key, or send it as words anyway
var heldReplyButtons = function ($, ui, id, where) {
    return boxHeldReply.has(id) ? (<ui.Box key={"".concat(where, "-").concat(id, "-held")} flexDirection="row" gap={1} flexWrap="wrap">
      <ui.Button key={"".concat(where, "-").concat(id, "-askey-").concat(boxPresses)} label="Save as the key" onPress={function (press) { return keepHeldAsKey($, id, press.surface); }}/>
      <ui.Button key={"".concat(where, "-").concat(id, "-anyway-").concat(boxPresses)} label="Send as answer" plain onPress={function () { var _a; return void sendBoxReply($, id, (_a = boxHeldReply.get(id)) !== null && _a !== void 0 ? _a : '', true); }}/>
    </ui.Box>) : null;
};
