// Work that is ready or needs the person: a short sound and a notification
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
// ---- Work that is ready: a short sound and a notification ----
// The sound, a file of the mod's: two soft rising notes, 0.75 s, made by mockups/claudopus-sound/ready.py
var READY_SOUND = 'sounds/ready.wav';
// Ends this close together are one sound and one notification
var SETTLE = 800;
// Work that ends again this soon after it was announced is not announced again
var AGAIN = 10000;
// An end the mod learns of this long after it happened, as work read back after a restart, is not announced
var STALE_END = 60000;
// How each card and workflow of this chat's stood when last looked at, by id. Unset until the first look after the mod loads,
// which only takes note, so a reload announces nothing
var lastSeen;
// Ends waiting to be announced together, with what waited on the person as the end was seen (its report takes that over soon
// after), and when each was last announced, by id
var ready = [];
var isSettling = false;
var announced = new Map();
// Work the person stopped with its Stop button: they saw it end, so it is not announced
var pressed = new Set();
var standing = function (status, endedAt) { return (status === 'working' ? 'working' : "".concat(status, ":").concat(endedAt)); };
// Looks for work of this chat's that has ended since the last look; helpers are never listed, so never announced
var lookEnds = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var mine, cards, runs, now, all, was, _i, all_1, one, before;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, sessionName($)];
            case 1:
                mine = _b.sent();
                return [4 /*yield*/, read($, todos)];
            case 2:
                cards = (_b.sent()).filter(function (one) { return !one.parentId; });
                return [4 /*yield*/, read($, flows)];
            case 3:
                runs = (_b.sent()).filter(function (f) { return f.session === mine; });
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _b.sent();
                all = __spreadArray(__spreadArray([], cards.map(function (one) { return ({ id: one.id, status: one.status, endedAt: one.endedAt, waits: one.waits }); }), true), runs.map(function (f) { return ({ id: "flow:".concat(f.id), status: f.status, endedAt: f.endedAt, waits: undefined }); }), true);
                was = lastSeen;
                lastSeen = new Map(all.map(function (one) { return [one.id, standing(one.status, one.endedAt)]; }));
                if (!was)
                    return [2 /*return*/];
                for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                    one = all_1[_i];
                    before = was.get(one.id);
                    if (one.status === 'working' || before === undefined || before === standing(one.status, one.endedAt))
                        continue;
                    if (now - one.endedAt > STALE_END || now - ((_a = announced.get(one.id)) !== null && _a !== void 0 ? _a : -Infinity) < AGAIN)
                        continue;
                    announced.set(one.id, now);
                    if (pressed.delete(one.id))
                        continue;
                    ready.push({ id: one.id, waits: one.waits });
                }
                if (ready.length && !isSettling) {
                    isSettling = true;
                    $.clock.after(SETTLE, function () { return void announce($).catch(function (err) { return log($, "ready not announced: ".concat(String(err))); }); });
                }
                return [2 /*return*/];
        }
    });
}); };
// A few words of what work left: the first sentence of what it found, cut short
var fewWords = function (text) {
    var _a, _b;
    var found = gistOf(text) || oneLine(text.replace(/[*_`#>]/g, ''));
    var sentence = (_b = (_a = /^.{12,}?[.!?](?=\s|$)/.exec(found)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : found;
    return sentence.length > 140 ? "".concat(sentence.slice(0, 139).trimEnd(), "\u2026") : sentence;
};
// What one ended piece of work or workflow says in a notification
var readyOf = function (_a, cards, runs) {
    var _b, _c, _d, _e, _f;
    var id = _a.id, seen = _a.waits;
    if (id.startsWith('flow:')) {
        var f = runs.find(function (one) { return "flow:".concat(one.id) === id; });
        if (!f)
            return undefined;
        var what_1 = f.status === 'done' ? fewWords(f.result) || 'Finished.' : f.status === 'failed' ? 'Stopped by an error.' : 'Stopped.';
        return { title: f.title || f.name || 'Workflow', isDone: f.status === 'done', what: what_1 };
    }
    var one = cards.find(function (card) { return card.id === id; });
    if (!one)
        return undefined;
    var waits = (_c = (_b = one.waits) !== null && _b !== void 0 ? _b : seen) !== null && _c !== void 0 ? _c : [];
    var said = (_e = (_d = __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind === 'note'; })) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : '';
    var what = one.status === 'done'
        ? waits.length
            ? "Waits on ".concat(who(), ": ").concat(fewWords((_f = waits[0]) !== null && _f !== void 0 ? _f : '')).concat(waits.length > 1 ? " (and ".concat(waits.length - 1, " more)") : '')
            : fewWords(one.answer) || fewWords(said) || 'Finished.'
        : one.status === 'failed'
            ? 'Stopped by an error.'
            : 'Stopped.';
    return { title: one.title || 'Work', isDone: one.status === 'done', what: what };
};
// One sound for all that ended together, only when some finished; one notification naming them. config.json switches each off
var announce = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var ids, config, _a, _b, _c, cards, runs, items, first, done, title, text;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                isSettling = false;
                ids = ready;
                ready = [];
                config = {};
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/config.json"))];
            case 2:
                config = _b.apply(_a, [(_d.sent()) || '{}']);
                return [3 /*break*/, 4];
            case 3:
                _c = _d.sent();
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, read($, todos)];
            case 5:
                cards = _d.sent();
                return [4 /*yield*/, read($, flows)];
            case 6:
                runs = _d.sent();
                items = ids.map(function (one) { return readyOf(one, cards, runs); }).filter(function (one) { return one !== undefined; });
                if (!items.length)
                    return [2 /*return*/];
                if (config.sound !== false && items.some(function (one) { return one.isDone; }))
                    void $.audio.play({ asset: READY_SOUND }).catch(function (err) { return log($, "ready sound not played: ".concat(String(err))); });
                if (config.notifications === false)
                    return [2 /*return*/];
                first = items[0];
                done = items.filter(function (one) { return one.isDone; }).length;
                title = items.length === 1 && first ? first.title : done === items.length ? "".concat(items.length, " pieces of work are ready") : "".concat(items.length, " pieces of work ended");
                text = items.length === 1 && first ? first.what : items.map(function (one) { return "".concat(one.title, ": ").concat(one.isDone ? 'ready' : one.what.replace(/\.$/, '').toLowerCase()); }).join(' · ').slice(0, 300);
                return [4 /*yield*/, alertPerson($, 'ready', title, text, "ready-".concat(ids.map(function (one) { return one.id; }).join('-')))];
            case 7:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
// What /claudopus and /servers answer where the screen has nowhere to draw a panel, as a Remote Control chat seen from another device
var nowhere = function (panel) { return "The ".concat(panel, " panel can't be shown on this screen. It shows in the Claude app on the Mac this chat runs on."); };
// The desktop app's own id for the chat this engine runs, which its link `claude://code/continue?session=` opens (read off the
// app: it takes `last` or an id of this shape). Unset in a terminal
var DESKTOP_SESSION = /^local_[A-Za-z0-9-]{1,64}$/;
// What a click on a notification opens: this chat in the Claude app, else the app this chat runs in, such as its terminal
var clickOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var session, app;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.env.get('CLAUDE_CODE_HOST_SESSION_ID')];
            case 1:
                session = (_a = (_c.sent())) !== null && _a !== void 0 ? _a : '';
                if (DESKTOP_SESSION.test(session))
                    return [2 /*return*/, ['--open', "claude://code/continue?session=".concat(session)]];
                return [4 /*yield*/, $.env.get('__CFBundleIdentifier')];
            case 2:
                app = (_b = (_c.sent())) !== null && _b !== void 0 ? _b : '';
                return [2 /*return*/, /^[A-Za-z0-9.-]{1,200}$/.test(app) ? ['--activate', app] : []];
        }
    });
}); };
// One notification, through the app, else as Claudopus in this Mac's Notification Centre, with its icon, a click opening the
// chat; else, where Claudopus may not notify, macOS's plain one. `what` names it in the log. Work that needs the person (`asks`)
// goes as Claudopus Asks, the amber octopus, and with `chime` its notification carries the "needs you" sound, which macOS plays
// as the person set it for that app and as a Focus allows. Says whether the sound went with the notification. `opens`, a link to
// another chat, is what a click opens instead of this chat; the app's own notification, which opens this chat, is then passed over
var alertPerson = function ($, what, title, text, key, asks, opens) { return __awaiter(_this, void 0, void 0, function () {
    var sent, _a, click, _b, _c, _d, run, amber, _e, own, tried, mac;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!(opens !== undefined)) return [3 /*break*/, 1];
                _a = { isSent: false, reason: 'another chat' };
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, $.ui.notify(text, { title: title, key: key.slice(0, 200) }).catch(function (err) { return ({ isSent: false, reason: String(err) }); })];
            case 2:
                _a = _f.sent();
                _f.label = 3;
            case 3:
                sent = _a;
                if (sent.isSent || sent.reason === 'disabled' || sent.reason === 'refused') {
                    void log($, "".concat(what, ": ").concat(title, " \u2014 ").concat(sent.isSent ? "notified through ".concat(sent.channel) : "not notified (".concat(sent.reason, ")")));
                    return [2 /*return*/, false];
                }
                _b = [[]];
                if (!opens) return [3 /*break*/, 4];
                _c = ['--open', opens];
                return [3 /*break*/, 8];
            case 4:
                if (!(opens === undefined)) return [3 /*break*/, 6];
                return [4 /*yield*/, clickOf($)];
            case 5:
                _d = _f.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = [];
                _f.label = 7;
            case 7:
                _c = _d;
                _f.label = 8;
            case 8:
                click = __spreadArray.apply(void 0, [__spreadArray.apply(void 0, _b.concat([(_c), true])), ['--key', key.slice(0, 200)], false]);
                run = function (lead) { return $.process.run(__spreadArray(__spreadArray(__spreadArray(["".concat($.plugin.root, "/bin/notify")], lead, true), ['--title', title, '--text', text], false), click, true)).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); }); };
                if (!asks) return [3 /*break*/, 10];
                return [4 /*yield*/, run(__spreadArray(['--asks'], (asks.chime ? ['--chime'] : []), true))];
            case 9:
                _e = _f.sent();
                return [3 /*break*/, 11];
            case 10:
                _e = undefined;
                _f.label = 11;
            case 11:
                amber = _e;
                if (amber && (amber.exitCode === 0 || amber.exitCode === 5)) {
                    void log($, "".concat(what, ": ").concat(title, " \u2014 app said ").concat(sent.reason, "; ").concat(amber.exitCode === 0 ? 'notified through Claudopus Asks' : 'macOS asked to allow Claudopus Asks'));
                    // Shown now with its sound; one waiting on macOS's question goes without it, so the mod's chime is heard instead
                    return [2 /*return*/, amber.exitCode === 0 && (asks === null || asks === void 0 ? void 0 : asks.chime) === true];
                }
                return [4 /*yield*/, run([])];
            case 12:
                own = _f.sent();
                tried = amber ? "Claudopus Asks said ".concat(amber.exitCode, "; ") : '';
                if (own.exitCode === 0 || own.exitCode === 5) {
                    void log($, "".concat(what, ": ").concat(title, " \u2014 app said ").concat(sent.reason, "; ").concat(tried).concat(own.exitCode === 0 ? 'notified through Claudopus' : 'macOS asked to allow Claudopus'));
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, $.process
                        .run(['osascript', '-e', 'on run argv', '-e', 'display notification (item 2 of argv) with title (item 1 of argv)', '-e', 'end run', title, text])
                        .catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 13:
                mac = _f.sent();
                void log($, "".concat(what, ": ").concat(title, " \u2014 app said ").concat(sent.reason, "; ").concat(tried, "Claudopus said ").concat(own.exitCode, "; ").concat(mac.exitCode === 0 ? 'notified through macOS' : "macOS notification failed: ".concat(mac.stderr.slice(0, 120))));
                return [2 /*return*/, false];
        }
    });
}); };
// The mod's own chime for what needs the person, as bin/notify's for the notification: asks within this long of it are not heard again
var QUIET_CHIME = 5000;
var lastChime = -Infinity;
// Work that needs the person's hands says so at once: the panel comes up with its card standing out, and a notification with the
// "needs you" sound. config.json's sound off makes it silent; its notifications off leaves only the mod's own chime. The chime
// plays apart from the notification only where the notification could not carry the sound, so one ask is heard once
var aloud = function ($, what, title, text, key, opens) { return __awaiter(_this, void 0, void 0, function () {
    var config, _a, _b, _c, chime, isHeard, _d, now;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                config = {};
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/config.json"))];
            case 2:
                config = _b.apply(_a, [(_e.sent()) || '{}']);
                return [3 /*break*/, 4];
            case 3:
                _c = _e.sent();
                return [3 /*break*/, 4];
            case 4:
                chime = config.sound !== false;
                _d = config.notifications !== false;
                if (!_d) return [3 /*break*/, 6];
                return [4 /*yield*/, alertPerson($, what, title, text, key, { chime: chime }, opens)];
            case 5:
                _d = (_e.sent());
                _e.label = 6;
            case 6:
                isHeard = _d;
                return [4 /*yield*/, $.clock.now()];
            case 7:
                now = _e.sent();
                if (!chime || isHeard || now - lastChime < QUIET_CHIME)
                    return [2 /*return*/];
                lastChime = now;
                void $.audio.play({ asset: READY_SOUND }).catch(function (err) { return log($, "ask sound not played: ".concat(String(err))); });
                return [2 /*return*/];
        }
    });
}); };
var askAloud = function ($, one, text) { return aloud($, 'ask', "".concat(titleOf(one), " needs you"), text, "ask-".concat(one.id)); };
