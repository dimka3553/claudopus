// ---- One state for a task's card: done only once its report is in ----
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
// A server runs until it is stopped: it never ends by itself, so it never starts the work that left it again
// (a build by a tool that also serves, as `vite build`, ends)
var isServerRun = function (cmd, what) { return (SERVER_CMD.test(cmd !== null && cmd !== void 0 ? cmd : '') && !/\b(vite|next|nuxt|astro) build\b/.test(cmd !== null && cmd !== void 0 ? cmd : '')) || describedOf(what).kind === 'server'; };
// What of its own starts the work again by itself once its step has ended: its commands in the background or detached that end
// (a watch counts, as its lines reach it; a server does not), its helpers at work, and what it asked Claudopus to wake it for or a
// heavy command held for its turn
var wakesOf = function (list, card) {
    var _a, _b;
    var runs = __spreadArray(__spreadArray([], ((_a = card.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !isServerRun(b.cmd, b.what); }), true), ((_b = card.detached) !== null && _b !== void 0 ? _b : []).filter(function (d) { return !isServerRun(d.cmd, d.what); }), true);
    var helpers = runningHelpers(list, card.id).length;
    var isWoken = card.wakeWhen !== undefined || isTurnWaited(list, card.id);
    return { runs: runs, helpers: helpers, isWoken: isWoken, isAny: runs.length > 0 || helpers > 0 || isWoken };
};
// Whether Claude Code took the run's last words as its result: it never pressed it for a hand-back. Its messages unread, it may
// have been pressed, so it has not
var isUnpressed = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var rows, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, $.session.messages({ as: 'api', agentId: id }).catch(function () { return undefined; })];
            case 1:
                rows = _c.sent();
                _a = Array.isArray(rows) && !isPressedAtEnd(rows);
                if (!_a) return [3 /*break*/, 3];
                _b = isLetEnd;
                return [4 /*yield*/, read($, todos)];
            case 2:
                _a = !_b.apply(void 0, [(_c.sent()).find(function (one) { return one.id === id; })]);
                _c.label = 3;
            case 3: return [2 /*return*/, _a];
        }
    });
}); };
// Claudopus received its report: it handed it back with SubagentHandback (or its unpressed run ended with it), and its turn ended
// with that report as its result
var hasReport = function (one) { return (one === null || one === void 0 ? void 0 : one.reportAt) !== undefined; };
// The one place a task's state is read from
var stateOf = function (list, one) {
    if (one.status === 'done' || one.status === 'stopped' || one.status === 'failed')
        return one.status;
    if (needsPerson(one))
        return 'waiting-you';
    return one.endedStepAt !== undefined && wakesOf(list, one).isAny ? 'waiting-own' : 'working';
};
// ---- Done is shown only for a task that finished everything ----
// A card kept as done is drawn, counted and announced as Done only when nothing stands between it and Done. Whatever path kept it
// as done (a hand-back, the engine's word, a run Claudopus could not see, a card read back after a reload), the card is read
// through here before anyone sees it:
// - a command of its own that ends by itself still runs, or a helper of its is at work: it waits for its own work, in purple
//   (a command it sent to the background, which Claude Code still holds its run for after its report, counts by `leftOwn`, kept as
//   the card ended, its rows being gone by then; a server never ends by itself, so a card that left only a server is done)
// - to-dos it never ticked or dropped: it is not done, in amber, and says how many are done
// (18 Nov, the person: "Why is it done after four to-dos? Why does it have a command running when it's finished?" A task that
// ran where Claudopus could not see it handed back past every check, its to-dos and its line left as they were; another card
// kept a command for 47 minutes after its report)
// - a release under way for it, Claudopus's on the person's press or its own runner in its background: Releasing, in purple, and
//   Done once only, when that has finished (18 Nov, the person: "Until it's done releasing, it's not done. Why does it turn from
//   purple to green to purple to green to purple?")
// A command left in its background counts from the moment it hands back (`leftOwn`), not only once the engine's list says it holds
// the run for it (`leftSince`), which came seconds later: green came in between
// (`_asks` is no longer read: a result's question changes nothing of this)
var shownAs = function (list, _asks) {
    return list.map(function (one) {
        var _a;
        if (isOff || one.parentId || one.chat || one.status !== 'done')
            return one;
        // (one the person dismissed is under Finished and waits for nothing more, but with to-dos left it still never reads Done)
        if (one.closedAt)
            return isLeftUndone(one) ? __assign(__assign({}, one), { leftOpen: openItems(one).length }) : one;
        var atWork = __assign(__assign({}, one), { status: 'working', wasDone: one.endedAt, endedAt: 0, endedStepAt: (_a = one.endedStepAt) !== null && _a !== void 0 ? _a : one.endedAt });
        if (one.releasing)
            return atWork;
        // (a question of its own on its card comes first: it is Waiting for you, its command's row under it)
        if (one.ask)
            return one;
        var _b = wakesOf(list, one), runs = _b.runs, helpers = _b.helpers;
        if (runs.length || helpers || one.leftOwn)
            return atWork;
        // (to-dos left: not done, in amber, whatever its result asks; with every to-do done it is Done and green, though its result
        // still asks the person something: the person, 18 Nov, "the ones that are not done should be yellow, the ones that are done
        // should be green")
        if (isLeftUndone(one))
            return __assign(__assign({}, one), { leftOpen: openItems(one).length });
        return one;
    });
};
// Released on the person's press: whatever to-do it left was that release, and it is done (a card from before `released` was
// kept says so on its line)
var isReleased = function (one) { return one.released !== undefined || one.entries.some(function (entry) { return entry.kind === 'note' && entry.text.startsWith('Released · '); }); };
// To-dos left on a card Claudopus saw end done under that rule, never released: it is not done. A card that ended before it, or
// long ago, reads as it did then, and never comes back up as not done (18 Nov, the person: two tasks of the morning, one of them
// released, came back to the top in amber after the update)
var isLeftUndone = function (one) { return one.doneSeen !== undefined && !isReleased(one) && openItems(one).length > 0; };
// The release runner, run by a task's own command (its status look asks nothing and releases nothing)
var isReleaseRun = function (cmd) { return /\bbin\/release\b/.test(cmd !== null && cmd !== void 0 ? cmd : '') && !/\s--status\b/.test(cmd !== null && cmd !== void 0 ? cmd : ''); };
// One card read so
var shownOne = function (list, id, asks) { return shownAs(list, asks).find(function (one) { return one.id === id; }); };
// What a task's card says while it waits on its own work, by what it waits for; '' in any other state
var ownWorkWords = function (list, one) {
    // (a card that handed back its result while a release or a command of its own still runs waits for it too: shownAs)
    if (one.releasing && one.wasDone !== undefined)
        return ['Releasing', one.releasing.branch].filter(Boolean).join(' ');
    if ((stateOf(list, one) !== 'waiting-own' && one.wasDone === undefined))
        return '';
    var _a = wakesOf(list, one), runs = _a.runs, helpers = _a.helpers;
    if (runs.some(function (run) { return isReleaseRun(run.cmd); }) && !helpers)
        return 'Releasing';
    if (one.wasDone !== undefined && !runs.length && !helpers)
        return 'Waiting for its command';
    var what = [runs.length ? (runs.length === 1 ? 'its command' : 'its commands') : '', helpers ? (helpers === 1 ? 'its helper' : 'its helpers') : ''].filter(Boolean).join(' and ');
    return what ? "Waiting for ".concat(what) : 'Waiting to be started again';
};
// Every change to the cards goes through here: a task's card that would end done without its report stays at work, as it was before
// the change, its step ended. Any path that ends a card (the end of its turn, the engine's list, a look after a reload) is held to it
// The ids held so, for Claudopus to start each again that nothing of its own starts (doneHeld)
var holdDone = function (before, next, now) {
    var held = [];
    if (isOff)
        return { list: next, held: held };
    var was = new Map(before.map(function (one) { return [one.id, one]; }));
    var list = next.map(function (one) {
        var _a;
        var old = was.get(one.id);
        // (what the person allowed it under "Ask once per piece of work" ends with it, and only once it really ends)
        if ((old === null || old === void 0 ? void 0 : old.status) === 'working' && one.status !== 'working' && !(one.status === 'done' && !one.parentId && !one.chat && !hasReport(one)))
            workAllowed.delete(one.id);
        if (one.parentId || one.chat || one.status !== 'done' || hasReport(one))
            return one;
        // (only a card at work: one read back from the chat's records ended before Claudopus kept it, as its records say)
        if ((old === null || old === void 0 ? void 0 : old.status) !== 'working')
            return one;
        held.push(one.id);
        var base = old;
        return __assign(__assign({}, base), { status: 'working', endedAt: 0, answer: one.answer || base.answer, answeredAt: undefined, endedStepAt: (_a = base.endedStepAt) !== null && _a !== void 0 ? _a : now });
    });
    // A task's card Claudopus sees end done is kept so (isLeftUndone): one done already, or only now read back, is not
    var seen = list.map(function (one) { var _a; return (one.status === 'done' && !one.parentId && !one.chat && one.doneSeen === undefined && was.has(one.id) && ((_a = was.get(one.id)) === null || _a === void 0 ? void 0 : _a.status) !== 'done' ? __assign(__assign({}, one), { doneSeen: now }) : one); });
    return { list: seen, held: held };
};
// Cards held from ending done without their report, each taken up once per stop (by its steps and the times it was carried on): one
// whose run Claude Code never pressed ends done with its last words as its result, as at a heard end; one that waits on its own work
// waits, and is taken up again if that work goes without starting it; one waiting for the person waits for them; one the person
// stopped or held, or flagged, or given up on, ends stopped; any other is started again to carry on, as a task stopped partway is,
// until it hands back its report or Claudopus gives up and ends it stopped
var heldTaken = new Set();
var doneHeld = function ($, ids) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, ids_1, id;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _loop_1 = function (id) {
                    var list, one, _f, now_1, card_1, key, now_2;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, read($, todos)];
                            case 1:
                                list = _g.sent();
                                one = list.find(function (card) { return card.id === id; });
                                if (!one || one.status !== 'working')
                                    return [2 /*return*/, "continue"];
                                _f = !(openItems(one).length && (!one.kind || WAITS_KINDS.has(one.kind)) && isStoppedShort(one, ''));
                                if (!_f) return [3 /*break*/, 3];
                                return [4 /*yield*/, isUnpressed($, id)];
                            case 2:
                                _f = (_g.sent());
                                _g.label = 3;
                            case 3:
                                if (!_f) return [3 /*break*/, 9];
                                return [4 /*yield*/, $.clock.now()];
                            case 4:
                                now_1 = _g.sent();
                                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (card) { return (card.id === id && card.status === 'working' ? __assign(__assign({}, ended(card, 'done', now_1)), { reportAt: now_1 }) : card); }); })];
                            case 5:
                                _g.sent();
                                return [4 /*yield*/, lookEnds($)];
                            case 6:
                                _g.sent();
                                return [4 /*yield*/, replyUnread($, id).catch(function (err) { return log($, "reply not passed on: ".concat(String(err))); })];
                            case 7:
                                _g.sent();
                                return [4 /*yield*/, read($, todos)];
                            case 8:
                                card_1 = (_g.sent()).find(function (c) { return c.id === id; });
                                if ((card_1 === null || card_1 === void 0 ? void 0 : card_1.status) === 'done' && card_1.answer.trim())
                                    $.clock.after(5, function () { return void saveReport($, card_1, card_1.answer).catch(function (err) { return log($, "report of ".concat(id, " not kept: ").concat(String(err))); }); });
                                return [2 /*return*/, "continue"];
                            case 9:
                                if (wakesOf(list, one).isAny)
                                    return [2 /*return*/, "continue"];
                                key = "".concat(id, ":").concat((_a = one.steps) !== null && _a !== void 0 ? _a : 0, ":").concat((_c = (_b = one.carryOn) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0);
                                if (heldTaken.has(key))
                                    return [2 /*return*/, "continue"];
                                heldTaken.add(key);
                                if (!needsPerson(one)) return [3 /*break*/, 11];
                                return [4 /*yield*/, log($, "work ".concat(id, " would have ended done without its report: it waits for the person"))];
                            case 10:
                                _g.sent();
                                return [2 /*return*/, "continue"];
                            case 11:
                                if (!(isHeld(one) || stoppedHere.has(id) || pressed.has(id) || one.flagged || ((_d = one.carryOn) === null || _d === void 0 ? void 0 : _d.gaveUp))) return [3 /*break*/, 16];
                                return [4 /*yield*/, $.clock.now()];
                            case 12:
                                now_2 = _g.sent();
                                return [4 /*yield*/, changeTodos($, function (cards) { return cards.map(function (card) { return (card.id === id && card.status === 'working' ? ended(card, 'stopped', now_2) : card); }); })];
                            case 13:
                                _g.sent();
                                return [4 /*yield*/, log($, "work ".concat(id, " would have ended done without its report: ended stopped"))];
                            case 14:
                                _g.sent();
                                return [4 /*yield*/, lookEnds($)];
                            case 15:
                                _g.sent();
                                return [2 /*return*/, "continue"];
                            case 16: return [4 /*yield*/, log($, "work ".concat(id, " would have ended done without its report: started again to carry on"))];
                            case 17:
                                _g.sent();
                                return [4 /*yield*/, goOn($, id, 'its card would have ended done without its report', true)];
                            case 18:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, ids_1 = ids;
                _e.label = 1;
            case 1:
                if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                id = ids_1[_i];
                return [5 /*yield**/, _loop_1(id)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
