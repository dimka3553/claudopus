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
// What the runners take as a Mac (an ssh host or alias, perhaps with a user) and as a key's name
var BOX_HOST = /^(?:here|[A-Za-z0-9_][A-Za-z0-9._:@-]{0,199})$/;
var BOX_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,199}$/;
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
        if (typeof one.host !== 'string' || !BOX_HOST.test(one.host) || one.name !== undefined)
            return undefined;
        var mac = one.host === 'here' ? thisMac() : one.host;
        return "".concat(again, "Claudopus needs the admin password of ").concat(mac, " to run an admin command. It is kept only in ").concat(keptWhere(), ", and later admin commands on ").concat(mac, " run without asking again until it is forgotten.");
    }
    if (one.kind === 'secret') {
        if (one.host !== undefined)
            return undefined;
        // No name: the first box of a key saved by hand asks its name
        if (one.name === undefined)
            return 'Name of the key to save, such as GITHUB_TOKEN. Work will use it by this name.';
        if (typeof one.name !== 'string' || !BOX_NAME.test(one.name))
            return undefined;
        return "".concat(again, "Claudopus needs ").concat(one.name, ". It is kept only in ").concat(keptWhere(), ", and work uses it by name, hidden in what its commands print.");
    }
    return undefined;
};
var boxes = [];
var doneNotes = [];
var DONE_SHOWN = 60000;
var noteDone = function ($, note) { return __awaiter(_this, void 0, void 0, function () {
    var at;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                doneNotes = __spreadArray(__spreadArray([], doneNotes.filter(function (one) { return one.id !== note.id && at - one.at < DONE_SHOWN; }), true), [__assign(__assign({}, note), { at: at })], false).slice(-6);
                $.ui.invalidate('ui.render');
                // Drawn again as its minute ends, so it goes with nothing else to redraw the panel
                $.clock.after(DONE_SHOWN + 100, function () { return $.ui.invalidate('ui.render'); });
                return [2 /*return*/];
        }
    });
}); };
var doneNotesPart = function (ui, at) {
    return doneNotes
        .filter(function (one) { return at - one.at < DONE_SHOWN; })
        .map(function (one) { return (<ui.Box key={"done-".concat(one.id)} flexDirection="row" backgroundColor={FILL} flexShrink={0}>
        <ui.Box width={1} flexShrink={0} backgroundColor={one.isOn ? LIVE : FILL}/>
        <ui.Box flexDirection="column" paddingX={2} paddingY={1} minWidth={0} flexGrow={1} flexShrink={1}>
          <ui.Text bold wrap="truncate-end">{one.head}</ui.Text>
          <ui.Text wrap="wrap" color={one.isOn ? LIVE : undefined} bold={one.isOn}>{one.said}</ui.Text>
          {one.what ? <ui.Text dimColor wrap="wrap">{one.what}</ui.Text> : null}
        </ui.Box>
      </ui.Box>); });
};
// What a box asks for, in a few words, for its note once answered
var boxHead = function (text) {
    var _a, _b;
    var name = (_a = text.match(/Claudopus needs ([A-Za-z_][A-Za-z0-9_]*)\./)) === null || _a === void 0 ? void 0 : _a[1];
    var mac = (_b = text.match(/admin password of (.+?) to run/)) === null || _b === void 0 ? void 0 : _b[1];
    return mac ? "The admin password of ".concat(mac) : name ? "The key ".concat(name) : 'A key to save';
};
// What is being typed in each box, only in this code's memory, so a redraw keeps it; gone once it is sent
var boxDrafts = new Map();
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
var BOX_TOLD = function (text) { return "".concat(text, " Click in the box at the top of the Claudopus panel and type it there, never in this chat's prompt (/claudopus opens the panel). What is typed in the box goes only into ").concat(keptWhere(), "."); };
// This chat's own id, as the runner reads it from CLAUDE_CODE_SESSION_ID, read at each look (a /clear can change it)
var boxChat = '';
// Requests this chat has told or seen told
var boxTold = new Set();
var lookBoxes = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, found, entries, _loop_1, _i, entries_1, entry, _a, found_1, one, mark_1, opened_1, _loop_2, _b, boxTold_1, id, _loop_3, _c, _d, id;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!dir)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.surfaces().catch(function () { return []; })];
            case 1:
                // A chat with nothing to draw on (a -p run) takes no request: one it took would wait on a panel nobody sees
                if (!(_e.sent()).length)
                    return [2 /*return*/];
                return [4 /*yield*/, $.session.id().catch(function () { return ''; })];
            case 2:
                boxChat = _e.sent();
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _e.sent();
                found = [];
                return [4 /*yield*/, $.fs.list(boxesDir()).catch(function () { return []; })];
            case 4:
                entries = _e.sent();
                _loop_1 = function (entry) {
                    var marked, id, one, _f, _g, text, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                marked = entry.name.replace(/\.told$/, '');
                                if (!(entry.name.endsWith('.told') && BOX_ID.test(marked) && !entries.some(function (other) { return other.name === "".concat(marked, ".json"); }))) return [3 /*break*/, 2];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(entry.name)]).catch(function () { return undefined; })];
                            case 1:
                                _j.sent();
                                _j.label = 2;
                            case 2:
                                id = entry.name.replace(/\.json$/, '');
                                if (!entry.name.endsWith('.json') || !BOX_ID.test(id) || boxSent.has(id))
                                    return [2 /*return*/, "continue"];
                                _j.label = 3;
                            case 3:
                                _j.trys.push([3, 9, , 10]);
                                _g = (_f = JSON).parse;
                                return [4 /*yield*/, readOr($, "".concat(boxesDir(), "/").concat(entry.name))];
                            case 4:
                                one = _g.apply(_f, [_j.sent()]);
                                text = one && typeof one === 'object' ? boxWording(one) : undefined;
                                if (!(one.id === id && text && typeof one.at === 'number' && now - one.at < BOX_OLD)) return [3 /*break*/, 5];
                                found.push({ id: id, text: text, at: one.at, chat: typeof one.chat === 'string' && one.chat ? one.chat : undefined });
                                return [3 /*break*/, 8];
                            case 5:
                                if (!(typeof one.at === 'number' && now - one.at >= BOX_OLD)) return [3 /*break*/, 8];
                                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json"), "".concat(boxesDir(), "/").concat(id, ".told")]).catch(function () { return undefined; })];
                            case 6:
                                _j.sent();
                                return [4 /*yield*/, boxKeyring($, 'delete', id)];
                            case 7:
                                _j.sent();
                                _j.label = 8;
                            case 8: return [3 /*break*/, 10];
                            case 9:
                                _h = _j.sent();
                                return [3 /*break*/, 10];
                            case 10: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, entries_1 = entries;
                _e.label = 5;
            case 5:
                if (!(_i < entries_1.length)) return [3 /*break*/, 8];
                entry = entries_1[_i];
                return [5 /*yield**/, _loop_1(entry)];
            case 6:
                _e.sent();
                _e.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                found.sort(function (a, b) { return a.at - b.at; });
                _a = 0, found_1 = found;
                _e.label = 9;
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
                mark_1 = _e.sent();
                if (mark_1.exitCode !== 0)
                    return [3 /*break*/, 15];
                return [4 /*yield*/, $.ui.open({ id: LIST, title: LIST_TITLE, focus: true }).catch(function (err) { return (log($, "panel not opened for a box: ".concat(String(err))), undefined); })];
            case 11:
                opened_1 = _e.sent();
                if (!!(opened_1 === null || opened_1 === void 0 ? void 0 : opened_1.isPlaced)) return [3 /*break*/, 14];
                return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(one.id, ".told")]).catch(function () { return undefined; })];
            case 12:
                _e.sent();
                return [4 /*yield*/, log($, "box ".concat(one.id, " given back: the panel is not drawn here").concat(opened_1 && !opened_1.isPlaced ? " (".concat(opened_1.reason, ")") : ''))];
            case 13:
                _e.sent();
                return [3 /*break*/, 15];
            case 14:
                $.ui.log(BOX_TOLD(one.text));
                _e.label = 15;
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
                    if (!found.some(function (one) { return one.id === id; }))
                        (boxDrafts.delete(id), boxSaid.delete(id));
                };
                for (_c = 0, _d = __spreadArray(__spreadArray([], boxDrafts.keys(), true), boxSaid.keys(), true); _c < _d.length; _c++) {
                    id = _d[_c];
                    _loop_3(id);
                }
                if (JSON.stringify(found) === JSON.stringify(boxes))
                    return [2 /*return*/];
                boxes = found;
                $.ui.invalidate('ui.render');
                return [2 /*return*/];
        }
    });
}); };
// A box's entry in the keychain: on Linux bin/keyring, which keeps it in a file only this user reads; on a Mac security itself,
// which sendBox calls as before for set and has, so only delete goes through here
var boxKeyring = function ($, what, id, stdin) {
    return isLinux
        ? $.process.run(__spreadArray(["".concat($.plugin.root, "/bin/keyring"), what, BOX_SERVICE, id], (what === 'set' ? ['Claudopus box'] : []), true), { stdin: stdin, timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })
        : what === 'delete'
            ? $.process.run(['/usr/bin/security', 'delete-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })
            : Promise.resolve({ exitCode: -1 });
};
// Into the keychain under the box's id, on security's stdin as bin/secret keeps a value, so it is never in a command line
var sendBox = function ($, id, value) { return __awaiter(_this, void 0, void 0, function () {
    var refused, request, escaped, r, _a, isKept, _b, _c, _d, one;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                boxDrafts.delete(id);
                if (!value)
                    return [2 /*return*/];
                refused = value.replace(/[\\"]/g, '\\$&').length > BOX_LONGEST ? "That was longer than ".concat(BOX_LONGEST, " characters, so it was not sent.") : /[^\x20-\x7E]/.test(value) ? 'That held a line break, a curly quote or another character outside plain letters, digits and signs, so it was not sent. Type it again.' : '';
                if (refused) {
                    boxSaid.set(id, refused);
                    boxPresses += 1;
                    return [2 /*return*/, void $.ui.invalidate('ui.render')];
                }
                request = "".concat(boxesDir(), "/").concat(id, ".json");
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 1:
                if (!!(_e.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, cancelBox($, id, 'It was no longer waiting · nothing was saved')];
            case 2: return [2 /*return*/, void (_e.sent())];
            case 3:
                escaped = value.replace(/[\\"]/g, '\\$&');
                if (!isLinux) return [3 /*break*/, 5];
                return [4 /*yield*/, boxKeyring($, 'set', id, "".concat(value, "\n"))];
            case 4:
                _a = _e.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, $.process
                    .run(['/usr/bin/security', '-i'], { stdin: "add-generic-password -U -s \"".concat(BOX_SERVICE, "\" -a \"").concat(id, "\" -l \"Claudopus box\" -w \"").concat(escaped, "\"\n"), timeoutMs: 15000 })
                    .catch(function () { return ({ exitCode: -1 }); })
                // security -i can end well when the add failed: the entry is looked for by its attributes, never its value
            ];
            case 6:
                _a = _e.sent();
                _e.label = 7;
            case 7:
                r = _a;
                _b = r.exitCode === 0;
                if (!_b) return [3 /*break*/, 12];
                if (!isLinux) return [3 /*break*/, 9];
                return [4 /*yield*/, boxKeyring($, 'has', id)];
            case 8:
                _c = _e.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, $.process.run(['/usr/bin/security', 'find-generic-password', '-s', BOX_SERVICE, '-a', id], { timeoutMs: 15000 }).catch(function () { return ({ exitCode: -1 }); })];
            case 10:
                _c = _e.sent();
                _e.label = 11;
            case 11:
                _b = (_c).exitCode === 0;
                _e.label = 12;
            case 12:
                isKept = _b;
                _d = isKept;
                if (!_d) return [3 /*break*/, 14];
                return [4 /*yield*/, $.fs.exists(request).catch(function () { return false; })];
            case 13:
                _d = !(_e.sent());
                _e.label = 14;
            case 14:
                if (!_d) return [3 /*break*/, 16];
                return [4 /*yield*/, boxKeyring($, 'delete', id)];
            case 15:
                _e.sent();
                _e.label = 16;
            case 16:
                boxPresses += 1;
                if (!!isKept) return [3 /*break*/, 18];
                boxSaid.set(id, "It could not be put in ".concat(keptWhere(), ". Try again."));
                return [4 /*yield*/, log($, "box ".concat(id, " not kept: security ended ").concat(r.exitCode))];
            case 17:
                _e.sent();
                return [3 /*break*/, 22];
            case 18:
                boxSent.add(id);
                boxSaid.delete(id);
                one = boxes.find(function (other) { return other.id === id; });
                boxes = boxes.filter(function (other) { return other.id !== id; });
                if (!one) return [3 /*break*/, 20];
                return [4 /*yield*/, noteDone($, { id: "box-".concat(id), head: boxHead(one.text), said: "You gave it \u00B7 it is in ".concat(keptWhere(), ", and what asked for it goes on now"), what: '', isOn: true })];
            case 19:
                _e.sent();
                _e.label = 20;
            case 20: return [4 /*yield*/, log($, "box ".concat(id, " sent to the keychain"))];
            case 21:
                _e.sent();
                _e.label = 22;
            case 22:
                $.ui.invalidate('ui.render');
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
                    boxDrafts.delete(id);
                    boxSent.add(id);
                    one = boxes.find(function (other) { return other.id === id; });
                    boxes = boxes.filter(function (other) { return other.id !== id; });
                    return [4 /*yield*/, $.process.run(['rm', '-f', "".concat(boxesDir(), "/").concat(id, ".json")]).catch(function () { return undefined; })];
                case 1:
                    _a.sent();
                    if (!one) return [3 /*break*/, 3];
                    return [4 /*yield*/, noteDone($, { id: "box-".concat(id), head: boxHead(one.text), said: said, what: '' })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    $.ui.invalidate('ui.render');
                    return [2 /*return*/];
            }
        });
    });
};
var boxesPart = function ($, ui) {
    if (!boxes.length || !('Input' in ui))
        return null;
    // This chat's own requests first, the first of them with the keys, so a value typed for the notice it told goes to its own box
    var shown = __spreadArray(__spreadArray([], boxes.filter(function (one) { return one.chat === boxChat; }), true), boxes.filter(function (one) { return one.chat !== boxChat; }), true);
    return shown.map(function (one, n) {
        var _a;
        return (<ui.Box key={"box-".concat(one.id)} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
      <ui.Text bold color={NEEDS} wrap="wrap">{one.text}</ui.Text>
      <ui.Text dimColor wrap="wrap">What you type here shows as you type it. It goes only into {keptWhere()}, never into a chat.</ui.Text>
      <ui.Box width="100%" flexDirection="column">
        <ui.Input key={"box-".concat(one.id, "-field-").concat(boxPresses)} placeholder="Type or paste it here" value={(_a = boxDrafts.get(one.id)) !== null && _a !== void 0 ? _a : ''} submitLabel="send" autoFocus={n === 0 ? true : undefined} onInput={function (value) { return void boxDrafts.set(one.id, value); }} onSubmit={function (value) { return void sendBox($, one.id, value).catch(function () { return log($, "box ".concat(one.id, " not sent")); }); }}/>
      </ui.Box>
      {boxSaid.get(one.id) ? <ui.Text key={"box-".concat(one.id, "-said")} color={NEEDS} wrap="wrap">{boxSaid.get(one.id)}</ui.Text> : null}
      <ui.Box flexDirection="row">
        <ui.Button key={"box-".concat(one.id, "-cancel-").concat(boxPresses)} label="Cancel" plain onPress={function () { return void cancelBox($, one.id); }}/>
      </ui.Box>
    </ui.Box>);
    });
};
