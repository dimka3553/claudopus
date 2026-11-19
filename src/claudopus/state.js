// ---- One stage for a task's card ----
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
var stageOf = function (_list, card) {
    if (card.status === 'failed' || card.status === 'stopped')
        return card.status;
    if (needsPerson(card))
        return 'waiting';
    return card.status === 'done' ? (card.up && !card.closedAt ? 'delivered' : 'done') : 'working';
};
// Just marked done by the person: for its two seconds the card stays where it was, green, before it goes under Finished
// (19 Nov, the person: "Done stays exactly where the delivered was when you mark it as done. It should always play the green
// animation")
// Its two seconds count from the first drawing of the panel made that shows it, never from the press: right after an update the
// panel's drawings came seconds late, so a moment counted from the press was over before any drawing showed it, and the card went straight
// under Finished with no green, no octopus and no sound while the next delivered card, alike, slid into its place: the press seemed
// to do nothing (19 Nov, the person: "I clicked Mark as done two times, and the animation didn't play. The sound didn't play")
// Each press of this load's, until its moment is first drawn (shownAt 0), and from when; one never drawn is over DONE_UNSEEN on
var doneMoments = new Map();
var DONE_UNSEEN = 10000;
var isDoneMoment = function (one, at) {
    var moment = doneMoments.get(one.id);
    if (one.status !== 'done' || !one.closedAt || !moment || moment.pressedAt !== one.closedAt)
        return false;
    // (a drawing begun before the first one showing it was made, as that very drawing, is in the moment too)
    return at >= moment.pressedAt && (moment.shownAt ? at - moment.shownAt < LINGER : at - moment.pressedAt < DONE_UNSEEN);
};
// Whether it handed in its result: delivered, or marked done by the person
var hasResult = function (stage) { return stage === 'delivered' || stage === 'done'; };
// Each stage in the words a card says it with, and its colour
var STAGE_WORD = { working: 'Working', waiting: 'Waiting for you', delivered: 'Delivered', done: 'Done', stopped: 'Stopped', failed: 'Failed' };
var stageColor = function (stage) { return ({ working: LIVE, waiting: NEEDS, delivered: DELIVERED, done: DONE, stopped: undefined, failed: 'error' })[stage]; };
// Why a card failed, where it says so
var WHY_NO_RESULT = 'Ended without its result';
var WHY_APP_CLOSED = 'The app closed while it worked';
var WHY_ERROR = 'Ended with an error';
var WHY_FLAGGED = 'Ended by a safety check';
// A server runs until it is stopped: it never ends by itself, so a task may finish with one left for the person
// (a build by a tool that also serves, as `vite build`, ends)
var isServerRun = function (cmd, what) { return (SERVER_CMD.test(cmd !== null && cmd !== void 0 ? cmd : '') && !/\b(vite|next|nuxt|astro) build\b/.test(cmd !== null && cmd !== void 0 ? cmd : '')) || describedOf(what).kind === 'server'; };
// The commands of its own that end by themselves and still run: every row of its card but a server's
var ownRuns = function (card) { var _a; return ((_a = card === null || card === void 0 ? void 0 : card.bg) !== null && _a !== void 0 ? _a : []).filter(function (b) { return !isServerRun(b.cmd, b.what); }); };
// Its helpers at work
var helpersAtWork = function (list, id) { return list.filter(function (one) { return one.parentId === id && one.status === 'working'; }); };
// Whether something of its own runs: a command that ends by itself, or a helper at work
var ownsWork = function (list, card) { return ownRuns(card).length > 0 || helpersAtWork(list, card.id).length > 0; };
// Whether Claude Code pressed it for its report as its run ended, after its last call: the sign that its words reached no one (the
// chat is told only that it "ended without delivering a report"). A run where the engine asks for no report, as headless ones, ends
// with its words as its result
var isPressedAtEnd = function (rows) {
    if (!Array.isArray(rows))
        return false;
    for (var _i = 0, _a = __spreadArray([], rows, true).reverse(); _i < _a.length; _i++) {
        var row = _a[_i];
        var m = (row && typeof row === 'object' && 'message' in row ? row.message : row);
        var blocks = Array.isArray(m === null || m === void 0 ? void 0 : m.content) ? m.content : [m === null || m === void 0 ? void 0 : m.content];
        var texts = blocks.map(function (b) { var _a; return (typeof b === 'string' ? b : b && typeof b === 'object' ? String((_a = b.text) !== null && _a !== void 0 ? _a : '') + (typeof b.content === 'string' ? String(b.content) : '') : ''); });
        if ((m === null || m === void 0 ? void 0 : m.role) === 'assistant' && blocks.some(function (b) { return b && typeof b === 'object' && b.type === 'tool_use'; }))
            return false;
        if ((m === null || m === void 0 ? void 0 : m.role) === 'user' && texts.some(function (text) { return text.includes(HANDBACK_PRESS); }))
            return true;
    }
    return false;
};
// Whether Claude Code took the run's last words as its result: it never pressed it for a hand-back. Its messages unread, it may
// have been pressed, so it has not
var isUnpressed = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.session.messages({ as: 'api', agentId: id }).catch(function () { return undefined; })];
            case 1:
                rows = _a.sent();
                return [2 /*return*/, Array.isArray(rows) && !isPressedAtEnd(rows)];
        }
    });
}); };
// Its result was received: handed in with SubagentHandback, or its run's last words where Claude Code took those as its result
var hasReport = function (one) { return (one === null || one === void 0 ? void 0 : one.reportAt) !== undefined; };
// Every change to the cards goes through here: a task's card cannot be kept as done without its received result, whatever path
// would end it so. It stays as it was before the change
var holdDone = function (before, next) {
    if (isOff)
        return next;
    var was = new Map(before.map(function (one) { return [one.id, one]; }));
    return next.map(function (one) {
        var old = was.get(one.id);
        var isHeld = !one.parentId && !one.chat && one.status === 'done' && !hasReport(one) && (old === null || old === void 0 ? void 0 : old.status) === 'working';
        // (what the person allowed it under "Ask once per piece of work" ends with it, and only once it really ends)
        if ((old === null || old === void 0 ? void 0 : old.status) === 'working' && one.status !== 'working' && !isHeld)
            (workAllowed.delete(one.id), releaseAllowed.delete(one.id));
        return isHeld && old ? __assign(__assign({}, old), { answer: one.answer || old.answer }) : one;
    });
};
