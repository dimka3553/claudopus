// What every part shares: the panel's names and limits, the state the panel draws from, the settings in force, small text
// helpers, the log and the chat's saved words
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
// The panel beside the chat: one small card per piece of work under way; pressed, a card shows all its to-dos and its own chat
var LIST = 'claudopus';
var LIST_TITLE = 'Claudopus';
// How many rows the panel asks for when a narrow terminal seats it above the prompt, where it fits its cards up to what the screen
// spares; left to itself it takes a third of the screen, which the header fills before any card
var PANEL_ROWS = 24;
// The panel that lists the servers on this Mac; it opens when asked for
var PANE = 'servers';
var PANE_TITLE = 'Servers';
// The panel an earlier version opened by itself
var OLD_PANE = 'agents';
// Rarely used tools wait behind ToolSearch instead of loading into every chat
var RARE_TOOLS = ['ReportFindings', 'SuggestPluginInstall', 'SuggestSkills', 'SearchPlugins', 'ScheduleWakeup', 'Workflow'];
var RARE_SERVERS = ['mcp__Claude_Browser__', 'mcp__Claude_Code_iOS_Simulator__', 'mcp__visualize__'];
// What a chat's own thread may call to hand work over: it starts agents and workflows, and talks to them. An agent may call anything
var OWN = ['Agent', 'Workflow', 'SendMessage', 'ListAgents', 'TaskStop', 'ToolSearch', 'AskUserQuestion', 'SendUserFile', 'ReadNotifications', 'Skill'];
// And what it reads with, to answer a question a few files answer: none of them changes a file or runs a command
var READS = ['Read', 'Grep', 'Glob'];
// The mod's own tools, as the chat names them; work recorded before the rename called them by the old name
var TOOLS = 'mcp__claudopus__';
var OLD_TOOLS = 'mcp__progress__';
var isTool = function (tool, name) { return tool === "".concat(TOOLS).concat(name) || tool === "".concat(OLD_TOOLS).concat(name); };
var OWN_SERVERS = [TOOLS, 'mcp__ccd_'];
// A message longer than this is a dump: the chat keeps the file's path, not the text
var PASTE_CHARS = 12000;
// Pieces of work kept in the list, ended ones included, and lines kept in the log of each
var KEPT = 40;
var ENTRIES_KEPT = 200;
// How many of the to-dos not yet started an open card lists before "more"
// What else a Details tab can unfold, kept beside its chat's numbers, far from them: the person's words whole, every to-do
// not yet started, and those done or dropped
var OPEN_ASK = -1000001;
var OPEN_DONE = -1000003;
var OPEN_RESULT = -1000004;
// Under a command's row in Details, its last lines sit on a darker ground, as a terminal's
var OUTPUT_FILL = '#0000003D';
// How much of what work reported at its end its Details shows before Show all
var RESULT_SHOWN = 600;
// Past this many done to-dos, Details folds them into one row
var DONE_FOLDED = 8;
// How much of a piece of work's chat the panel draws, the newest: this many lines, and this many characters, which one drawing has room for
var TALK_KEPT = 300;
var TALK_CHARS = 40000;
// The most characters the app draws in one tab: it counts every text and every picture's source, and a drawing of more is thrown
// away whole, so the tab keeps its old drawing, or after a switch away and back says "Nothing to show yet". The pictures a tab draws
// keep well under it (262144), with room for its text
var PICTURES_CHARS = 150000;
// The app's check of a tab's drawing before it draws it: at most 2000 parts (each element and each text in it), 32 elements deep
// and 262144 characters as sent. Past any of them it throws the drawing away whole, says nothing, and the tab shows "Nothing to
// show yet" until a drawing that fits comes (19 Nov: a task with 22 helpers and 206 ended commands). Claudopus keeps every
// drawing under these, with room for what the engine adds as it sends one
var FIT_PARTS = 1800;
var FIT_DEEP = 30;
var FIT_CHARS = 230000;
var fitsSeen = new WeakMap();
var drawingFits = function (drawing) {
    if (!drawing || typeof drawing !== 'object')
        return true;
    var known = fitsSeen.get(drawing);
    if (known !== undefined)
        return known;
    var parts = 0;
    var deepest = 0;
    var chars = 0;
    var walk = function (node, depth) {
        var _a, _b, _c;
        if (parts > FIT_PARTS || chars > FIT_CHARS || deepest > FIT_DEEP)
            return;
        if (typeof node === 'string' || typeof node === 'number')
            return void ((parts += 1), (chars += String(node).length + 2));
        if (!node || typeof node !== 'object')
            return;
        if (Array.isArray(node))
            return void node.forEach(function (child) { return walk(child, depth); });
        var el = node;
        if (!el.props && el.type === undefined)
            return;
        parts += 1;
        deepest = Math.max(deepest, depth + 1);
        var props = {};
        for (var _i = 0, _d = Object.entries((_a = el.props) !== null && _a !== void 0 ? _a : {}); _i < _d.length; _i++) {
            var _e = _d[_i], key = _e[0], value = _e[1];
            if (key !== 'children' && typeof value !== 'function' && value !== undefined)
                props[key] = value;
        }
        chars += JSON.stringify({ type: typeof el.type === 'string' ? el.type : '', props: props }).length + 14;
        walk((_b = el.children) !== null && _b !== void 0 ? _b : (_c = el.props) === null || _c === void 0 ? void 0 : _c.children, depth + 1);
    };
    walk(drawing, 0);
    var fits = parts <= FIT_PARTS && chars <= FIT_CHARS && deepest <= FIT_DEEP;
    fitsSeen.set(drawing, fits);
    return fits;
};
// How long one message of that chat may be
var SAID_CHARS = 8000;
// How much of a long message to the work is drawn before it is opened
var TOLD_CHARS = 300;
// How long the line of one tool step may be
var STEP_CHARS = 160;
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
var FILL = '#80808024';
// A card's outline. The app rounds the corners of every border it draws, and a card's edge of to-dos is square and stuck out past
// them, so the outline is four thin filled strips round the card instead, whose corners are square. It takes no room of the card's
// own beyond the strips; with no colour the card is drawn as it is
var OUTLINE = 0.1;
var squareOutline = function (Box, color, key, card) {
    return color ? (<Box key={"outline-".concat(key)} flexDirection="column" flexShrink={0}>
      <Box key="outline-top" height={OUTLINE} flexShrink={0} backgroundColor={color}/>
      <Box key="outline-row" flexDirection="row" flexShrink={0}>
        <Box key="outline-left" width={OUTLINE} flexShrink={0} backgroundColor={color}/>
        <Box key="outline-card" flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>{card}</Box>
        <Box key="outline-right" width={OUTLINE} flexShrink={0} backgroundColor={color}/>
      </Box>
      <Box key="outline-bottom" height={OUTLINE} flexShrink={0} backgroundColor={color}/>
    </Box>) : (card);
};
// A card's edge shows each to-do as a part of its own up to this many; more are one edge filled as far as they are done
var EDGE_PARTS = 14;
// How long a line of the log may be
var NOTE_CHARS = 200;
// What a delivered card lists of what its result leaves open: so many questions, each so long
var QUESTIONS_KEPT = 6;
var QUESTION_CHARS = 200;
// How much of an answer the panel keeps
var ANSWER_CHARS = 30000;
// While the servers panel is open it looks again this often
var TICK = 3000;
// Work that has just ended stays in its place among the running cards this long, in its ended look, before it goes to Finished
var LINGER = 2000;
// Work that ended while the mod was reloading, which draws nothing for many seconds, has its pause from the panel's first drawing
// after the load instead (Infinity until then), by `<id>:<endedAt>`: a finish is never over before the panel could show it
var lateFrom = new Map();
// Ended work this long before a load may not have been drawn ended at all
var RELOAD_GRACE = 30000;
// When ended work's pause begins
var pauseFrom = function (one) { var _a; return Math.max(one.endedAt, (_a = lateFrom.get("".concat(one.id, ":").concat(one.endedAt))) !== null && _a !== void 0 ? _a : 0); };
// Whether ended work is still in that pause at a time: a card that ended in the future, as from another clock, is not
var isLingering = function (one, at) { return one.status !== 'working' && one.endedAt > 0 && at >= pauseFrom(one) && at - pauseFrom(one) < LINGER; };
// Work acting on the person's reply in their own words to an ask it keeps open: at work, drawn in the work's purple, its question
// with the reply under it and nothing to press or type, as the person has answered. So from the moment the reply is sent: ended
// work being started again with it (isWaking), and another chat's work until its own chat has taken the reply (actingOn). Only
// once it stops again with the ask open does it wait on the person, with every answer back
var isActingOnReply = function (one) { var _a, _b, _c, _d; return Boolean(one.ask) && ((Boolean((_a = one.ask) === null || _a === void 0 ? void 0 : _a.replied) && (one.status === 'working' || Boolean((_c = (_b = one.ask) === null || _b === void 0 ? void 0 : _b.replied) === null || _c === void 0 ? void 0 : _c.isWaking))) || actingOn.has("".concat(one.id, ":").concat((_d = one.ask) === null || _d === void 0 ? void 0 : _d.at))); };
// The words of the buttons every block of the panel answers with (docs/words.md)
var ALLOW = 'Allow';
var DONT_ALLOW = "Don't allow";
var ALWAYS_ALLOW = 'Always allow this command';
var TYPE_IT = 'Type it';
var PASTE_IT = 'Paste it';
var DONT_GIVE = "Don't give it";
// A choice a task gives that would answer nothing: left out of its question's buttons (tools.tsx)
var LEAVES_OPEN = /^(?:no,? )?(?:not (?:now|yet)|later|maybe later|skip|skip it|cancel|dismiss|close)$/;
var ANSWER_IN_WORDS = 'Answer in words';
// The one test of "something waits for the person on this card": its own question, a permission held for their press (an admin
// command, a release, a change to a file of theirs), and what is drawn on it from the mod's own memory: Claude Code's prompt for a
// call of its own, and the password or key box of a command of its own (needs.tsx). Another chat's card is read from its file
// A permission the person answered in words, whose task is answering them: nothing to press until it has (gate.tsx, wordsOnGate)
var isGateActing = function (gate) { var _a, _b; return ((_b = (_a = gate.talk) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.by) === 'you'; };
var needsPerson = function (one) { var _a; return Boolean((_a = one.admins) === null || _a === void 0 ? void 0 : _a.some(function (gate) { return !isGateActing(gate); })) || (Boolean(one.ask) && !isActingOnReply(one)) || (!one.chat && Boolean(one.id) && (waiting.some(function (p) { return p.card === one.id; }) || boxes.some(function (box) { return box.card === one.id; }))); };
// The moments a pause ends that a redraw is already set for, so each pause gets one
var lingerSet = new Set();
// The engine's list of agents is read again this often, and the minutes move on
var FOLLOW_EVERY = 20000;
// An agent in one of these states, as the engine names them, is still working
var WORKING = ['pending', 'running', 'waiting'];
// These listen on a port but serve no pages to open
var NO_PAGES = /^(postgres|redis-server|mysqld|mongod)\b/;
var me = atom({ plugin: 'claudopus', key: 'me' }, { id: '', title: '', tokens: 0, isChat: false, needsContext: false, isListOpened: false, window: 0 }, { shape: 'me-6' });
var todos = atom({ plugin: 'claudopus', key: 'todos' }, [], { shape: 'todos-3' });
var view = atom({ plugin: 'claudopus', key: 'view' }, { openId: '' }, { shape: 'view-5' });
var servers = atom({ plugin: 'claudopus', key: 'servers' }, [], { shape: 'servers-2' });
// Counts the passes that bring the screen up to date: each one redraws what reads it
var tick = atom({ plugin: 'claudopus', key: 'tick' }, 0, { shape: 'tick-1' });
// When the figures above the prompt last changed: the band redraws on that alone, never each second, since each redraw of it closes
// and opens again a hover card the pointer rests on, and can leave one open after the pointer has gone on to the next figure
var figuresAt = atom({ plugin: 'claudopus', key: 'figures' }, 0, { shape: 'figures-1' });
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
// When the panel was last drawn, kept through a reload (drawnNow, written by the timer each second, never read while drawing)
var lastDrawn = atom({ plugin: 'claudopus', key: 'drawn' }, 0, { shape: 'drawn-1' });
var drawnNow = 0;
// When the list was last given an older drawing again (held), and last drawn afresh: work that ended between the two was not seen
var listHeldAt = 0;
var listFreshAt = 0;
// The titles of work in its moment at the top, as last drawn: the line above the prompt points at them when the list is scrolled away
var finishedAtTop = [];
// The list of work is written only when it changes. Each write of a value the panel or Details read draws them again, and the app
// builds a pane it is asked to draw whole afresh, even when it shows the same: the element under the pointer loses its hover look,
// and a press on a button of the drawing replaced meanwhile reaches nothing. The list was written over with the same list every
// few seconds while work ran (15 Nov, a minute of running work: seven writes, none of them a change). Should another write land
// between the look and the write, the change is made again on what that write left
var changeTodos = function ($, fn) { return __awaiter(_this, void 0, void 0, function () {
    var now, before, hold, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                now = _a.sent();
                before = JSON.stringify(now);
                hold = function (list) { return saidKept(list, holdDone(list, fn(list))); };
                next = hold(now);
                if (JSON.stringify(next) === before)
                    return [2 /*return*/, now];
                return [2 /*return*/, update($, todos, function (list) { return (JSON.stringify(list) === before ? next : hold(list)); })];
        }
    });
}); };
var paneShown = atom({ plugin: 'claudopus', key: 'shown' }, false, { shape: 'shown-1' });
// What the person has typed into an ask's reply box and not sent, by the work, kept through a reload of the mod (drafts, written as
// they type, read back once as the mod loads, never while drawing). A key box's letters are never kept: its surface holds them
var draftsKept = atom({ plugin: 'claudopus', key: 'drafts' }, {}, { shape: 'drafts-1' });
// Each load of this code in a chat, first or a reload, is told by a mark of its own, kept in the session's state as the load now in
// charge. A /reload-plugins starts the new copy but leaves the old copy's timers running in the same chat, and work an old copy wakes
// with $.session.send runs under that copy, whose hooks the engine no longer calls: every panel tool of that work answered "no
// tool.call hook answered". So a copy whose mark is no longer the one in charge stops its timers and does nothing more
// Marks order by when the load began, so a slow start of an older copy never takes charge back from a newer one
var thisLoad = "".concat(String(Date.now()).padStart(15, '0'), "-").concat(Math.random().toString(36).slice(2));
var loadNow = { plugin: 'claudopus', key: 'load' };
// A copy whose own mark could not be written never takes another's for its own replacement
var isMarked = false;
// Written only over the mark it read, so of two loads marking at once the newer one's stands
var takeCharge = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var tries, was, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tries = 0;
                _a.label = 1;
            case 1:
                if (!(tries < 3)) return [3 /*break*/, 5];
                return [4 /*yield*/, $.state.get(loadNow).catch(function () { return undefined; })];
            case 2:
                was = _a.sent();
                if (typeof (was === null || was === void 0 ? void 0 : was.value) === 'string' && was.value > thisLoad)
                    return [2 /*return*/, void (isMarked = true)];
                return [4 /*yield*/, $.state.set(loadNow, thisLoad, was ? { ifVersion: was.version } : undefined).catch(function (err) { return (log($, "load not marked: ".concat(String(err))), undefined); })];
            case 3:
                r = _a.sent();
                if (!r)
                    return [2 /*return*/, void (isMarked = false)];
                if (r.isSet)
                    return [2 /*return*/, void (isMarked = true)];
                _a.label = 4;
            case 4:
                tries += 1;
                return [3 /*break*/, 1];
            case 5:
                isMarked = false;
                return [2 /*return*/];
        }
    });
}); };
var isLeft = false;
// What a copy that was replaced lets go of the moment it finds out: its waits for a press (holdGate, holdPrompt)
var whenLeft = new Set();
var isReplaced = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, _i, _a, stop_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (isLeft)
                    return [2 /*return*/, true];
                if (!isMarked)
                    return [2 /*return*/, false];
                return [4 /*yield*/, $.state.get(loadNow).catch(function () { return undefined; })];
            case 1:
                now = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.value;
                if (typeof now === 'string' && now > thisLoad && !isLeft) {
                    isLeft = true;
                    // What this copy holds for a press is let go at once: its drawings are no longer the ones shown
                    for (_i = 0, _a = __spreadArray([], whenLeft, true); _i < _a.length; _i++) {
                        stop_1 = _a[_i];
                        stop_1();
                    }
                }
                return [2 /*return*/, isLeft];
        }
    });
}); };
// A timer of this load: it stops for good the first time it fires after a newer load took charge
var everyLoad = function ($, ms, fn) {
    var timer = $.clock.every(ms, function () { return void isReplaced($).then(function (left) { return (left ? timer.cancel() : fn()); }); });
    return timer;
};
// ---- Never holding Claude's helper ----
// Claude's engine runs every add-on's hooks on one shared helper and asks it each second whether it is there. With no answer for five
// seconds it starts the helper again and switches off the add-on whose code was running, until /reload-plugins: Claudopus went off
// three times in one afternoon (16 Nov). The helper answers between two of the mod's steps, so the mod keeps each step short and,
// when it falls behind, does less until it has caught up
// How often the mod looks at how late its own timer comes, and how late counts as behind: then fresh drawings and the looks that can
// wait are left out for BEHIND_FOR
var HOLD_LOOK = 250;
var LATE = 400;
var BEHIND_FOR = 10000;
// and a drawing is given as it was for this long at most, however long the mod stays behind
var BEHIND_HELD = 30000;
// A hold this long is written in the log with the steps begun meanwhile, so a switch-off can be traced to the step that caused it
var HOLD_SAID = 1500;
var holdAt = 0;
// The chat whose helper it is: on a Mac with many chats a long hold in the shared log names its own
var heldChat = '';
// Looks left while behind: each late one starts the count again
var behindLooks = 0;
var longestHold = 0;
var isBehind = function () { return behindLooks > 0; };
// The heavier steps the mod began lately, by name, so a long hold names them: those begun from a second before the last look on time
var begun = [];
var during = function (name) { return void (begun.push({ at: Date.now(), name: name }), begun.length > 40 && begun.splice(0, begun.length - 40)); };
// The test kit's clock moves only when a test moves it, so there the gaps in real time are the test's own: its world says so
var isTimed = true;
// and how long a drawing takes by the wall clock is the test machine's speed, not the mod's: a drawing there takes no time, unless
// its test asks for drawings to be timed (CLAUDOPUS_TIMING "test draws"). Timed, GitHub's slower runners drew the panel in 250 ms or
// more, the mod held the next drawing behind a timer of the clock no test moved, and tests failed or their file never finished
var isDrawTimed = true;
var drawnFor = function (from) { return (isDrawTimed ? Date.now() - from : 0); };
// Each look: the helper was held for as long as the timer came late
var lookHold = function ($) {
    var now = Date.now();
    var late = holdAt && isTimed ? now - holdAt - HOLD_LOOK : 0;
    holdAt = now;
    if (late < LATE) {
        // Caught up: drawn again, with what was left out meanwhile
        if (behindLooks > 0 && (behindLooks -= 1) === 0)
            drawAgain($);
        return;
    }
    behindLooks = BEHIND_FOR / HOLD_LOOK;
    longestHold = Math.max(longestHold, late);
    if (late < HOLD_SAID)
        return;
    var steps = __spreadArray([], new Set(begun.filter(function (one) { return one.at >= now - late - HOLD_LOOK - 1000; }).map(function (one) { return one.name; })), true);
    void log($, "Claude's helper was held ".concat(late, " ms").concat(heldChat ? " in chat ".concat(heldChat) : '').concat(steps.length ? "; steps begun then: ".concat(steps.join(', ')) : ''));
};
// A step that goes through much at once hands the helper back every BREATH ms, so the engine's question is answered meanwhile
var BREATH = 40;
var breathAt = 0;
var breathe = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (Date.now() - breathAt < BREATH)
                    return [2 /*return*/];
                // Any call to the engine will do: it is answered from outside the helper, which answers the engine's question meanwhile (one the
                // mod makes nowhere else, so the test world can answer it as late as the engine does)
                return [4 /*yield*/, $.session.turns()];
            case 1:
                // Any call to the engine will do: it is answered from outside the helper, which answers the engine's question meanwhile (one the
                // mod makes nowhere else, so the test world can answer it as late as the engine does)
                _a.sent();
                breathAt = Date.now();
                return [2 /*return*/];
        }
    });
}); };
// The engine gives no file over 4 MB whole (fs.read refuses it), and a whole one is worked through at once: what grows without end
// (a log, a command's output) is read from its end
var TAIL_BYTES = 200000;
var fileEnd = function ($_1, path_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, path_1], args_1, true), void 0, function ($, path, bytes) {
        var r;
        if (bytes === void 0) { bytes = TAIL_BYTES; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.process.run(['tail', '-c', String(bytes), path], { timeoutMs: 10000 }).catch(function () { return undefined; })];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout : ''];
            }
        });
    });
};
// and is added to at its end, never read and written back whole: a file over 4 MB read as nothing would be written back as only the
// new text
var appendTo = function ($, path, text) { return __awaiter(_this, void 0, void 0, function () {
    var r, was;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['sh', '-c', 'printf %s "$2" >> "$1"', 'sh', path, text]).catch(function () { return undefined; })];
            case 1:
                r = _a.sent();
                if ((r === null || r === void 0 ? void 0 : r.exitCode) === 0)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.read(path).then(String, function (err) { return (/ENOENT|no such file/i.test(String(err)) ? '' : undefined); })];
            case 2:
                was = _a.sent();
                if (was === undefined)
                    throw new Error("".concat(path, " not added to: it could not be read"));
                return [4 /*yield*/, $.fs.write(path, "".concat(was).concat(text))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// and one that fires once, unless a newer load took charge before it does
var afterLoad = function ($, ms, fn) { return $.clock.after(ms, function () { return void isReplaced($).then(function (left) { return (left ? undefined : fn()); }); }); };
// The chat of the card that is open, as last read: read again only when that work has moved
// Counts presses in the open card; the card's buttons carry it in their keys. On the desktop app the button last pressed holds the
// focus and is kept in view: every redraw (a new line of the work, the person's own scrolling) pulled the view back to it, most often to
// the bottom of the chat. With a new key after each press the app finds no such button, and the view stays where the person put it
var presses = 0;
// An ask's answer buttons keep one key for as long as the ask stands, never the count of presses: a surface that draws late, as a
// phone over the remote connection, still shows the keys of the last drawing, and a press on a key the panel no longer holds ran
// nothing (14 Nov: "Release it" pressed on one card right after another card's went nowhere). Their buttons go with the ask, so none
// is left holding the focus. The admin command's Allow and Deny keep theirs the same way. A new load gives them new keys, as presses
// does for the rest
var loadMark = 0;
// Each work's chat as its Details tab last read it, by the work
var talks = new Map();
// What each Details tab has unfolded, by the work: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
var folds = new Map();
// The memory folder, ~/.claude/claudopus; set when the session starts
var dir = '';
// The person's last message, for the pass that runs after the reply
var said = '';
// Each message of the person's in the chat's turn under way: only a message that carries one of them is their steer
var heard = [];
// config.json can switch the handing-over off: every chat then does its own work again
var isOff = false;
// config.json can name the person the mod works for; without a name the texts say "the person"
var person = '';
// config.json can say which model does which work; the chat's and the work's rules name them
var models = modelsOf({});
// config.json's choices of how work is handed out and how big it starts (Config's Tasks band)
var lean = leanOf({});
// The settings read again: at a session's start, and after a change in the Config tab
var loadSettings = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dir) return [3 /*break*/, 2];
                return [4 /*yield*/, personCheck($).catch(function (err) { return log($, "files not compared as the mod loads: ".concat(String(err))); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, readConfig($, dir)];
            case 3:
                config = _a.sent();
                isOff = config.agents === false;
                // Admin passwords an earlier version kept leave the keychain as the mod loads: none is kept any more
                void forgetKeptPasswords($).catch(function () { return undefined; });
                person = typeof config.name === 'string' ? config.name.trim() : '';
                models = modelsOf(config);
                lean = leanOf(config);
                macs = (Array.isArray(config.macs) ? (config.macs) : []).filter(isMac).slice(0, 4);
                return [2 /*return*/, config];
        }
    });
}); };
var who = function (isStart) {
    if (isStart === void 0) { isStart = false; }
    return person || (isStart ? 'The person' : 'the person');
};
// A text of the mod's with {name} or {Name} where the person is named
var named = function (text) { return text.replace(/\{name\}/g, who()).replace(/\{Name\}/g, who(true)); };
// When the servers were last looked up
var scannedAt = 0;
// The Agent calls made inside a piece of work, by call id: what such a call starts is that work's helper
var helperCalls = new Map();
var clip = function (text, half) {
    return text.length <= half * 2 ? text : "".concat(text.slice(0, half), "\n[...]\n").concat(text.slice(-half));
};
var slug = function (name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
var oneLine = function (text) { return text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim(); };
var textOf = function (r) { return r.content.map(function (b) { return ('text' in b && typeof b.text === 'string' ? b.text : ''); }).join(''); };
// How long work has run, to the second: "42s", "12m 08s", "1h 04m 31s". In a chat the app runs on another Mac over ssh, to the
// minute: "<1m", "12m", "1h 04m", and tokens to 10k and context to 5%. There every drawing that changes anything gives each button a
// new handle and lets the old ones go, while the app shows a drawing some time after the engine made it: a click on what it shows
// named a handle already let go, and nothing ran (Claude Code: "no Button of claudopus is held under handle"). A drawing that
// changes nothing keeps its handles. With the panel's text moving each second, about every other click was lost so
var took = function (ms) {
    var all = Math.max(0, Math.floor(ms / 1000));
    var _a = [Math.floor(all / 3600), Math.floor(all / 60) % 60, all % 60], hrs = _a[0], m = _a[1], sec = _a[2];
    var two = function (n) { return String(n).padStart(2, '0'); };
    if (isRunFromAfar)
        return hrs ? "".concat(hrs, "h ").concat(two(m), "m") : m ? "".concat(m, "m") : '<1m';
    return hrs ? "".concat(hrs, "h ").concat(two(m), "m") : m ? "".concat(m, "m ").concat(two(sec), "s") : "".concat(sec, "s");
};
// A time of day on this computer's clock, as the app writes it: "14:20"
var clockAt = function (ms) {
    var d = new Date(ms);
    return "".concat(String(d.getHours()).padStart(2, '0'), ":").concat(String(d.getMinutes()).padStart(2, '0'));
};
// A count of tokens as the app writes it
var thousands = function (tokens) {
    return isRunFromAfar ? (tokens < 10000 ? '<10k' : "".concat(Math.round(tokens / 10000) * 10, "k")) : "".concat((tokens / 1000).toFixed(tokens < 100000 ? 1 : 0), "k");
};
// How full a chat's memory is, in words: the share when the window is known; the bare token count says nothing to a person
var fill = function (tokens, window) { return (window ? "".concat(percent(tokens, window), "% full") : ''); };
// The same for a piece of work, short enough for its status line
var percent = function (tokens, window) { return (isRunFromAfar ? Math.floor((tokens / window) * 20) * 5 : Math.round((tokens / window) * 100)); };
var share = function (tokens, window) { return (window ? "".concat(percent(tokens, window), "% full") : ''); };
// A model's name as the app writes it, from its id or alias: "Opus 5.5". Nothing for a name it cannot read
var modelName = function (id) {
    var m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(id.toLowerCase());
    return (m === null || m === void 0 ? void 0 : m[1]) ? "".concat(m[1].charAt(0).toUpperCase()).concat(m[1].slice(1)).concat(m[2] ? " ".concat(m[2]).concat(m[3] ? ".".concat(m[3]) : '') : '') : '';
};
// The models the person can move running work to from its card, by the id each step is sent with, the newest of each family. Never
// Haiku. These are the least the mod knows: a newer id the engine starts work on or answers from takes its family's place (seeModel)
var MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2'];
// The newest Haiku, for the settings that name Haiku for a kind of work, raised the same way
var HAIKU = ['claude-haiku-5-5'];
// A version as numbers; an id that leads with a date or an old numbering ("claude-3-5-sonnet-20241022") reads as none
var versionOf = function (id) {
    var _a;
    var _b = ((_a = modelName(id).split(' ')[1]) !== null && _a !== void 0 ? _a : '').split('.').map(Number), _c = _b[0], major = _c === void 0 ? 0 : _c, _d = _b[1], minor = _d === void 0 ? 0 : _d;
    return major && major <= 99 ? [major, minor] : undefined;
};
var isBelow = function (a, b) { return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]); };
// The newest model of a family, by the id each step is sent with: Haiku's place is Sonnet's
var newestModel = function (family) { return MODELS.find(function (one) { return modelName(one).startsWith(family === 'Haiku' ? 'Sonnet' : family); }); };
// A model the engine resolved or answered from: one newer than its family's newest takes its place, so what counts as older follows
// the newest the engine offers and never goes stale
var seeModel = function (id) {
    var _a;
    var family = (_a = modelName(id).split(' ')[0]) !== null && _a !== void 0 ? _a : '';
    var version = versionOf(id);
    var list = family === 'Haiku' ? HAIKU : MODELS;
    var at = list.findIndex(function (one) { return modelName(one).startsWith("".concat(family, " ")); });
    var top = at >= 0 ? versionOf(list[at]) : undefined;
    if (!version || !top || !isBelow(top, version))
        return;
    list[at] = "claude-".concat(family.toLowerCase(), "-").concat(version[0]).concat(version[1] ? "-".concat(version[1]) : '');
};
// The model a step or start is sent to in place of one no work runs on: an older version than its family's newest goes to that
// newest, and Haiku to the newest Sonnet. Nothing for a model work may run on: the newest or a newer version, a name with no
// version, which the app reads as the newest, and Haiku when the settings name it for a kind of work
var rightModel = function (id) {
    var _a = modelName(id).split(' '), _b = _a[0], family = _b === void 0 ? '' : _b, _c = _a[1], version = _c === void 0 ? '' : _c;
    if (!family)
        return undefined;
    var isHaikuNamed = family === 'Haiku' && Object.values(models).includes('haiku');
    if (family === 'Haiku' && !isHaikuNamed)
        return newestModel('Sonnet');
    if (!version)
        return undefined;
    var newest = isHaikuNamed ? HAIKU[0] : newestModel(family);
    var top = versionOf(newest !== null && newest !== void 0 ? newest : '');
    var mine = versionOf(id);
    var isOlder = !mine || (top !== undefined && isBelow(mine, top));
    return isOlder ? newest : undefined;
};
// How strong a model is, for a check never weaker than what it checks
var RANK = { Haiku: 0, Sonnet: 1, Opus: 2, Fable: 3 };
// `opusplan` runs on Sonnet outside plan mode, so it counts as Sonnet
var rankOf = function (id) { var _a, _b; return (/opusplan/i.test(id) ? RANK.Sonnet : ((_b = RANK[(_a = modelName(id).split(' ')[0]) !== null && _a !== void 0 ? _a : '']) !== null && _b !== void 0 ? _b : -1)); };
// A helper that looks over what was built, by its few words: a checking word, then what was built ("Review my PR", "Test the fix"),
// or a look that is only ever a check ("Sanity check", "What is wrong with the build"). Legwork that names checking something else
// ("Check the Stripe balance", "Review the docs", "Check the PR status") is not one
var CHECKS = /\b(second look|another look|look(s|ing)? (over|for)|(re-?|double[- ]?|spot[- ]?|sanity[- ]?)?check(s|ing|ed|er)?|(code )?review(s|ing|ed|er)?|audit(s|ing|or)?|verif(y|ies|ying|ication|ied)|validat(e|es|ing|ion)|critique|proofread|inspect(s|ing|ion)?|test(s|ing)?|qa|find|hunt(s|ing)?)\b.*\b(page|fix|fixes|fixed|change|changes|build|built|work|diff|pr|code|branch|commit|result|results|report|output|mod|app|feature|design|claims|draft|holes|bugs|faults|what was built)\b/i;
var ONLY_CHECKS = /\b(second look|sanity check|spot[- ]?check|what is wrong|is wrong with)\b|^(checker|reviewer|auditor|code review)\b/i;
var NOT_CHECKS = /\b(status|comments?|balance|quota|usage|logs?)\b/i;
var isChecker = function (description) { return ONLY_CHECKS.test(description) || (CHECKS.test(description) && !NOT_CHECKS.test(description)); };
// Work a safety check flagged whose next steps the app would send to an older model: it is ended with this report instead, so its
// parent starts what is left again on a current model. The steps of it answered so
var FLAGGED = function (on) {
    return "Stopped by Claudopus: a safety check flagged this agent's last message, and the app would have continued it on ".concat(modelName(on) || on, ", an older model Claudopus doesn't run tasks on, so nothing after the flag was done. Start what is left again on the current model, leaving out what was flagged.");
};
var flaggedSteps = new Map();
// Work a safety check flagged once: its steps on an older model are never sent to a newer one, whatever it was started on
var flaggedOnce = new Set();
// The model an agent is started on in place of the one asked, or why it is not started; nothing when it may start as asked
var startModel = function (e) {
    var _a, _b, _c, _d, _e, _f;
    var parentModel = String((_a = e.parentModel) !== null && _a !== void 0 ? _a : '');
    // A copy runs on its parent's model, which no hook changes
    if (e.fork)
        return rightModel(parentModel) ? { deny: WRONG_MODEL(parentModel) } : {};
    var asked = ((_b = e.model) !== null && _b !== void 0 ? _b : '').trim();
    var parent = (_c = rightModel(parentModel)) !== null && _c !== void 0 ? _c : parentModel;
    // An alias or `inherit` the engine resolves to the newest, or the parent's; an older id or Haiku goes to its family's newest
    var model = asked && asked !== 'inherit' ? ((_d = rightModel(asked)) !== null && _d !== void 0 ? _d : '') : rightModel(parentModel) && (!asked || asked === 'inherit') ? parent : '';
    // A check of what was built never runs weaker than what started it, nor below Opus. A quick task the chat starts is a clearly stated
    // job, however its title reads ("Push and check the build"), and keeps its kind's model; one a task starts is held to the check rule
    if (!(e.subagentType === 'claudopus:quick' && !e.parentAgentId) && isChecker((_e = e.description) !== null && _e !== void 0 ? _e : '')) {
        var runs_1 = model || (asked && asked !== 'inherit' ? asked : parent);
        var least = rankOf(parent) >= RANK.Opus ? parent : ((_f = newestModel('Opus')) !== null && _f !== void 0 ? _f : 'opus');
        if (rankOf(runs_1) < rankOf(least))
            model = least;
    }
    return model ? { model: model } : {};
};
// The model each agent started on, as the engine resolved it: a step on Haiku of one that started there is its own kind's, not the app's move
var startedOn = new Map();
// The work and helpers whose steps the app sent to such a model, each said in the log once
var sentElsewhere = new Set();
// What a fork is answered when the model it would copy is such a model
var WRONG_MODEL = function (named) {
    return "Claudopus doesn't run tasks on ".concat(modelName(named) || named, ". Start a fresh agent and name the model by its alias: ").concat(modelsShort(models, lean), ". Never an older version").concat(Object.values(models).includes('haiku') ? '' : ', never Haiku', ".");
};
// The line written into a piece of work's own chat when the person moves it to another model; the panel draws it as a line of its own
var MODEL_HEAD = 'Model changed to ';
var MODEL_LINE = /^Model changed to (.+?) at (\d{1,2}:\d{2})\./;
var movedTo = function (name, at) {
    var d = new Date(at);
    return "".concat(MODEL_HEAD).concat(name, " at ").concat(String(d.getHours()).padStart(2, '0'), ":").concat(String(d.getMinutes()).padStart(2, '0'), ". ").concat(who(true), " chose it in the panel: your next steps run on ").concat(name, ".");
};
var readOr = function ($, path) {
    return $.fs.read(path).catch(function () { return ''; }).then(function (text) { return (listDrawing > 0 && isWatched(path, text) && !drawnFiles.has(path) && drawnFiles.set(path, text), text); });
};
// While the panel is drawn, the files its drawing reads, as read then: looked at again each second, so a change in one draws it
// again (calmLook), as nothing else would
var listDrawing = 0;
// Another hook may read while the panel is drawn: what grows as work runs (transcripts, logs, other chats' live files, words, asks,
// keep files) and anything large is never watched, so it cannot draw the panel again each second
var isWatched = function (path, text) { return text.length < 64000 && !/\.jsonl$|\/log\.md$|\/live\/|\/words\/|\/asks\/|\/keep\/|\/helpers\//.test(path); };
var drawnFiles = new Map();
// Every file the mod writes is in its memory folder, ~/.claude/claudopus, each call naming its folder and kind of file
// One line in ~/.claude/claudopus/log.md: each session's start, and anything that failed
// Added to its end, never read and written back whole: every chat on this Mac writes here, and two rewriting it at once left runs of
// empty bytes in it, which make grep take the log for binary and find nothing. Where the shell cannot add it, it is written whole
var log = function ($, line) { return __awaiter(_this, void 0, void 0, function () {
    var text, r, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                text = "".concat(new Date().toISOString(), " ").concat(line.replace(/\s+/g, ' ').slice(0, 400), "\n");
                return [4 /*yield*/, $.process.run(['sh', '-c', 'printf %s "$2" >> "$1"', 'sh', "".concat(dir, "/log.md"), text]).catch(function () { return undefined; })];
            case 1:
                r = _e.sent();
                if (!((r === null || r === void 0 ? void 0 : r.exitCode) !== 0)) return [3 /*break*/, 4];
                _b = (_a = $.fs).write;
                _c = ["".concat(dir, "/log.md")];
                _d = "".concat;
                return [4 /*yield*/, readOr($, "".concat(dir, "/log.md"))];
            case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.apply("", [_e.sent()]).concat(text)])).catch(function () { return undefined; })];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// The empty bytes earlier versions left in the log are taken out once, as a chat starts
var tidyLog = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readOr($, "".concat(dir, "/log.md"))];
            case 1:
                text = _a.sent();
                if (!text.includes('\u0000')) return [3 /*break*/, 3];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/log.md"), text.replaceAll('\u0000', '')).catch(function () { return undefined; })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Keys and passwords in what memory keeps, hidden as bin/catch-up hides them: the distinctive shapes keys and tokens take, a private
// key whole, a password inside an address, a value given to a name that says it is a key, a signed address's signature, and a
// bearer token. Ordinary words,
// paths, ids and hashes pass
var hideKeys = function (text) {
    return text
        .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '[key hidden]')
        .replace(/\b(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_|glpat-|xox[abprs]-|AIza|ya29\.)[A-Za-z0-9_.-]{10,}/g, '[key hidden]')
        .replace(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, '[key hidden]')
        .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, '[key hidden]')
        .replace(/\b(?:GOCSPX-|ntn_|sbp_|lin_api_|r8_|glsa_|dop_v1_|shpat_|shpss_|xapp-)[A-Za-z0-9_-]{16,}/g, '[key hidden]')
        .replace(/\bsecret_(?=[A-Za-z]*\d)[A-Za-z0-9]{32,}/g, '[key hidden]')
        .replace(/\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}/g, '[key hidden]')
        .replace(/\b\d{8,10}:AA[A-Za-z0-9_-]{30,}/g, '[key hidden]')
        .replace(/\bsk-(?:ant|proj|svcacct|admin)-[A-Za-z0-9_-]{16,}/g, '[key hidden]')
        .replace(/\b(?:sk|pk|rk|hf|npm|vck|whsec)[-_](?:(?:live|test)_)?(?=[A-Za-z0-9]*\d[A-Za-z0-9]*\d)[A-Za-z0-9]{16,}/g, '[key hidden]')
        .replace(/(\\?"(?:key|name)\\?"[ \t]*:[ \t]*\\?"[A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASSWD|PWD|CREDENTIALS?)\\?"[ \t]*,[ \t]*\\?"value\\?"[ \t]*:[ \t]*\\?")(?:[^"\\]|\\[^"])+(?=\\?")/g, '$1[hidden]')
        .replace(/(\bAuthorization\\?["']?[ \t]*[:=][ \t]*\\?["']?[ \t]*(?:Basic|Bearer|token)[ \t]+)[^\s"'\\]{8,}/gi, '$1[hidden]')
        .replace(/(\{[^{}]*\\*"(?:key|name)\\*"[ \t]*:[ \t]*\\*"[A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASSWD|PASS|PWD|CREDENTIALS?)\\*"[^{}]*\})/g, function (o) { return o.replace(/(\\*"value\\*"[ \t]*:[ \t]*\\*")(?:[^"\\]|\\[^"])+/g, '$1[hidden]'); })
        .replace(/(--password[ =]|\bcurl\b[^\n]*?\s-u[ \t]*[^\s:]+:)(?!\[(?:key )?hidden\])[^\s"'`]{4,}/g, '$1[hidden]')
        .replace(/(\bhooks\.slack\.com\/(?:services|workflows|triggers)\/)[A-Za-z0-9/_-]+/g, '$1[hidden]')
        .replace(/(\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:)[^/\s@]+@/gi, '$1[hidden]@')
        .replace(/(\b[A-Za-z0-9_]*(?:[Aa][Pp][Ii][_-]?[Kk][Ee][Yy]|[Aa][Cc][Cc][Oo][Uu][Nn][Tt][_-]?[Kk][Ee][Yy]|[Aa][Cc][Cc][Ee][Ss][Ss][_-]?[Kk][Ee][Yy]|[Ss][Ee][Cc][Rr][Ee][Tt]|[Tt][Oo][Kk][Ee][Nn]|[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]|[Pp][Aa][Ss][Ss][Ww][Dd]|[Pp][Rr][Ii][Vv][Aa][Tt][Ee][_-]?[Kk][Ee][Yy])\\*["']?[ \t]*[=:][ \t]*\\*["']?)(?!\[(?:key )?hidden\])(?!(?:[Tt]rue|[Ff]alse|[Nn]ull|NULL|[Nn]one|undefined|TRUE|FALSE|NONE)\b)(?!\d{1,7}\b)[^\s"'`,;\\]{4,}/g, '$1[hidden]')
        .replace(/(\b[A-Z0-9_]*(?:_KEY|_PWD|_PASS)\\*["']?[ \t]*[=:][ \t]*\\*["']?)(?!\[(?:key )?hidden\])(?![/~.])[^\s"'`,;\\]{4,}/g, '$1[hidden]')
        .replace(/([?&](?:Policy|Signature|X-Amz-Signature|X-Amz-Credential|X-Amz-Security-Token|sig|token|access_token|api_key|apikey|key)=)(?!\[(?:key )?hidden\])[^&\s"'<>),]+/gi, '$1[hidden]')
        .replace(/(\bBearer[ \t]+)[A-Za-z0-9._~+/=-]{16,}/g, '$1[hidden]');
};
// A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end, with any key hidden
var appendWords = function ($, chatId, text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, appendTo($, "".concat(dir, "/words/").concat(chatId, ".md"), hideKeys(text))
        // Where a message no person typed came from, as its saved words say it; none for a notice or the mod's own message
    ];
}); }); };
// Where a message no person typed came from, as its saved words say it; none for a notice or the mod's own message
var programFrom = function (origin) {
    return origin.kind === 'sdk' ? 'sent by a program'
        : origin.kind === 'scheduled-trigger' ? 'scheduled'
            : origin.kind === 'channel' ? "from ".concat(origin.server || 'a channel')
                : origin.kind === 'slack-ping' ? 'from Slack'
                    : origin.kind === 'coordinator' || origin.kind === 'projects-relay' ? 'sent by the chat that runs this one'
                        : '';
};
// A chat's asks and answers, asks/<chat id>.md, added to the end
var appendAsks = function ($, chatId, text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, appendTo($, "".concat(dir, "/asks/").concat(chatId, ".md"), hideKeys(text))];
}); }); };
// A colour with a see-through part, #RRGGBBAA, and how much of it shows (0 to 255)
var alphaOf = function (color) { return (typeof color === 'string' && /^#[0-9a-f]{8}$/i.test(color) ? parseInt(color.slice(7), 16) : 255); };
// The terminal has no see-through colour: it paints the app's faint grey tint (FILL) as a solid mid-grey bar that buries dim text,
// darker than the text around it on a light theme. There a faint tint is left out with the padding that only framed it, and a
// stronger one (a picked segment, the edge's part still to do) becomes the theme's own subtle grey, which follows dark and light
var TERM_SOLID = 'subtle';
// The work's purple on a card's edge in the terminal. A terminal of 256 colours (over ssh, where COLORTERM is not sent) rounds a
// Box's colour to its palette, which makes #8A63F0 a lavender (141), while the octopus's cells take the nearest colour, a deep
// purple (99); there the edge is given a purple that rounds to 99 too. Set as the session starts
var DEEP_LIVE = '#6E3CFF';
var termLive = '';
var termBox = function (Box) { return function (props) {
    var alpha = alphaOf(props.backgroundColor);
    if (props.backgroundColor === LIVE)
        return Box(__assign(__assign({}, props), { backgroundColor: termLive || LIVE }));
    if (alpha === 255)
        return Box(props);
    var _tint = props.backgroundColor, paddingY = props.paddingY, paddingTop = props.paddingTop, paddingBottom = props.paddingBottom, rest = __rest(props, ["backgroundColor", "paddingY", "paddingTop", "paddingBottom"]);
    var isFrame = alpha < 0x40;
    var framed = isFrame ? {} : { paddingY: paddingY, paddingTop: paddingTop, paddingBottom: paddingBottom };
    return Box(__assign(__assign(__assign({}, rest), framed), (isFrame ? {} : { backgroundColor: TERM_SOLID })));
}; };
var keptButtons = new Map();
// How many times each key has been drawn so far in one drawing, by the drawing's own event: the same key drawn twice in a pane
// (a card shown both among the asks and under Finished) is two buttons, each kept apart
var keptSeen = new WeakMap();
// A kept button not drawn for this long goes; drawn again later, it is a new one
var KEPT_FOR = 10 * 60000;
var keptSwept = 0;
// What a button shows, without its handler. Anything in it that cannot be compared (a function inside, as a button within a
// button would hold) says so, and that button is made anew each time
var lookOf = function (shown) {
    var isPlain = true;
    var look = JSON.stringify(shown, function (_name, value) { return (typeof value === 'function' ? ((isPlain = false), undefined) : value); });
    return isPlain ? look : undefined;
};
var keptButton = function (Button, e) { return function (props) {
    var _a, _b, _c;
    var _d = props, onPress = _d.onPress, shown = __rest(_d, ["onPress"]);
    var look = typeof shown.key === 'string' && typeof onPress === 'function' ? lookOf(shown) : undefined;
    if (look === undefined)
        return Button(props);
    var seen = (_a = keptSeen.get(e)) !== null && _a !== void 0 ? _a : new Map();
    keptSeen.set(e, seen);
    var nth = (_b = seen.get(shown.key)) !== null && _b !== void 0 ? _b : 0;
    seen.set(shown.key, nth + 1);
    var place = "".concat(String(e.component), "\0").concat(String((_c = e.requestId) !== null && _c !== void 0 ? _c : ''), "\0").concat(String(e.surface), "\0").concat(shown.key, "\0").concat(nth);
    var now = Date.now();
    if (now - keptSwept > 60000) {
        keptSwept = now;
        for (var _i = 0, keptButtons_1 = keptButtons; _i < keptButtons_1.length; _i++) {
            var _e = keptButtons_1[_i], where = _e[0], one = _e[1];
            if (now - one.at > KEPT_FOR)
                keptButtons.delete(where);
        }
    }
    var was = keptButtons.get(place);
    if (was && was.look === look)
        return ((was.latest = onPress), (was.at = now), was.element);
    var kept = { element: undefined, look: look, latest: onPress, at: now };
    kept.element = Button(__assign(__assign({}, shown), { onPress: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return kept.latest.apply(kept, args);
        } }));
    keptButtons.set(place, kept);
    return kept.element;
}; };
// The element table a drawing uses: the surface's own, with its buttons kept as above, and on the terminal its Box taking the
// app's tints as above and a mark (isTerminal) the views in other files read, which are handed the table alone
var uiOf = function ($, e) {
    var ui = $.ui.resolve(e);
    var Button = keptButton(ui.Button, e);
    if (e.surface !== 'terminal')
        return __assign(__assign({}, ui), { Button: Button });
    var marked = __assign(__assign({}, ui), { Button: Button, Box: termBox(ui.Box), isTerminal: true });
    return marked;
};
// One part of a report's view or of the list: a filled block with a bold heading and, at its right, a dim count
var band = function (ui, key, name, side, body) { return (<ui.Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Box flexDirection="row" alignItems="flex-start" gap={2}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text bold wrap="wrap">{name}</ui.Text>
      </ui.Box>
      {side ? (<ui.Box flexShrink={0}>
          <ui.Text dimColor>{side}</ui.Text>
        </ui.Box>) : null}
    </ui.Box>
    {body}
  </ui.Box>); };
// ---- Which system this chat runs on ----
// Linux, as uname says once at the chat's start (chat.tsx), else a Mac: what only a Mac has (its keychain, Finder and Preview,
// Terminal, sips, its own notifications) takes Linux's own way there, or says plainly that it is not there. `hasDesktop` is a
// Linux desktop session the person sees (DISPLAY or WAYLAND_DISPLAY): without one, as in a terminal over SSH, nothing opens a window
var isLinux = false;
var hasDesktop = true;
// Where bin/keyring keeps its files on Linux, ~/.local/share/claudopus/keyring (never under $XDG_DATA_HOME, which a caller sets),
// and where earlier versions kept them when XDG_DATA_HOME was set, guarded the same (the mod moves them home as it loads)
var keyringRoot = '';
var keyringOldRoot = '';
var knowSystem = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r, _a, _b, _c, data, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, $.process.run(['uname', '-s'], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 1:
                r = _g.sent();
                isLinux = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 && r.stdout.trim() === 'Linux';
                _a = !isLinux;
                if (_a) return [3 /*break*/, 5];
                _b = Boolean;
                return [4 /*yield*/, $.env.get('DISPLAY')];
            case 2:
                _c = (_g.sent());
                if (_c) return [3 /*break*/, 4];
                return [4 /*yield*/, $.env.get('WAYLAND_DISPLAY')];
            case 3:
                _c = (_g.sent());
                _g.label = 4;
            case 4:
                _a = _b.apply(void 0, [_c]);
                _g.label = 5;
            case 5:
                hasDesktop = _a;
                return [4 /*yield*/, $.env.get('XDG_DATA_HOME')];
            case 6:
                data = (_e = (_g.sent())) !== null && _e !== void 0 ? _e : '';
                _d = "".concat;
                return [4 /*yield*/, $.env.get('HOME')];
            case 7:
                keyringRoot = _d.apply("", [(_f = (_g.sent())) !== null && _f !== void 0 ? _f : '', "/.local/share/claudopus/keyring"]);
                keyringOldRoot = data.startsWith('/') ? "".concat(data, "/claudopus/keyring") : '';
                return [2 /*return*/];
        }
    });
}); };
// Whether this Mac's home folder holds a keychain. One without (a test's or a trial chat's home of its own) makes security ask on
// the person's screen for a keychain to keep an item in ("Keychain Not Found"), so nothing is asked of the keychain there: what
// would use it fails as a keychain that does not answer. Looked at each time, so one made later is used. Linux keeps files instead
var hasKeychain = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var home, where, found;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (isLinux)
                    return [2 /*return*/, true];
                return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                home = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : '';
                if (!home.startsWith('/'))
                    return [2 /*return*/, false
                        // No folder of keychains at all is a home of its own; a folder that cannot be listed is left to security as before. A keychain
                        // there may be a link (one moved and linked back); metadata.keychain-db alone is no keychain
                    ];
                where = "".concat(home, "/Library/Keychains");
                return [4 /*yield*/, $.fs.stat(where).then(function () { return true; }, function (err) { return !/ENOENT|ENOTDIR/.test(String(err)); })];
            case 2:
                if (!(_b.sent()))
                    return [2 /*return*/, false];
                return [4 /*yield*/, $.fs.list(where).catch(function () { return undefined; })];
            case 3:
                found = _b.sent();
                return [2 /*return*/, !found || found.some(function (one) { return one.name !== 'metadata.keychain-db' && /\.keychain(?:-db)?$/.test(one.name); })];
        }
    });
}); };
// How this computer is named in what the person reads
var thisMac = function () { return (isLinux ? 'this machine' : 'this Mac'); };
var keptWhere = function () { return (isLinux ? 'a file on this machine that only you can read' : "this Mac's keychain"); };
// A file, folder or link opened as the person's own system opens it: `open` on a Mac, xdg-open on a Linux desktop. Linux without
// a desktop has nothing to open it on, and says so as a failed run does
var openOn = function ($_1, target_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, target_1], args_1, true), void 0, function ($, target, isText) {
        if (isText === void 0) { isText = false; }
        return __generator(this, function (_a) {
            if (!isLinux)
                return [2 /*return*/, $.process.run(isText ? ['open', '-t', target] : ['open', target]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            if (!hasDesktop)
                return [2 /*return*/, { exitCode: 1, stderr: 'no desktop on this machine to open it on' }];
            return [2 /*return*/, $.process.run(['xdg-open', target]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
        });
    });
};
// macOS's sips on a Mac; on Linux bin/sips, which answers the same calls with ImageMagick and fails, drawing no small copy, without it
var sips = function ($) { return (isLinux ? "".concat($.plugin.root, "/bin/sips") : 'sips'); };
