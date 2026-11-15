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
var NEXT_SHOWN = 3;
// What else a Details tab can unfold, kept beside its chat's numbers, far from them: the person's words whole, every to-do
// not yet started, and those done or dropped
var OPEN_ASK = -1000001;
var OPEN_NEXT = -1000002;
var OPEN_DONE = -1000003;
// How much of a piece of work's chat the panel draws, the newest: this many lines, and this many characters, which one drawing has room for
var TALK_KEPT = 300;
var TALK_CHARS = 40000;
// The most characters the app draws in one tab: it counts every text and every picture's source, and a drawing of more is thrown
// away whole, so the tab keeps its old drawing, or after a switch away and back says "Nothing to show yet". The pictures a tab draws
// keep well under it (262144), with room for its text
var PICTURES_CHARS = 150000;
// How long one message of that chat may be
var SAID_CHARS = 8000;
// How much of a long message to the work is drawn before it is opened
var TOLD_CHARS = 300;
// How long the line of one tool step may be
var STEP_CHARS = 160;
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
var FILL = '#80808024';
// A card's edge shows each to-do as a part of its own up to this many; more are one edge filled as far as they are done
var EDGE_PARTS = 14;
// How long a line of the log may be
var NOTE_CHARS = 200;
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
// An admin command held for the person's press needs them whatever else the work does
var needsPerson = function (one) { var _a; return Boolean((_a = one.admins) === null || _a === void 0 ? void 0 : _a.length) || (Boolean(one.ask) && !isActingOnReply(one)); };
// The moments a pause ends that a redraw is already set for, so each pause gets one
var lingerSet = new Set();
// The engine's list of agents is read again this often, and the minutes move on
var FOLLOW_EVERY = 20000;
// An agent in one of these states, as the engine names them, is still working
var WORKING = ['pending', 'running', 'waiting'];
// These listen on a port but serve no pages to open
var NO_PAGES = /^(postgres|redis-server|mysqld|mongod)\b/;
var me = atom({ plugin: 'claudopus', key: 'me' }, { id: '', title: '', tokens: 0, isChat: false, needsContext: false, roleSent: '', isListOpened: false, window: 0 }, { shape: 'me-6' });
var todos = atom({ plugin: 'claudopus', key: 'todos' }, [], { shape: 'todos-3' });
var view = atom({ plugin: 'claudopus', key: 'view' }, { openId: '' }, { shape: 'view-5' });
var servers = atom({ plugin: 'claudopus', key: 'servers' }, [], { shape: 'servers-2' });
// Counts the passes that bring the screen up to date: each one redraws what reads it
var tick = atom({ plugin: 'claudopus', key: 'tick' }, 0, { shape: 'tick-1' });
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
// When the panel was last drawn, kept through a reload (drawnNow, written by the timer each second, never read while drawing)
var lastDrawn = atom({ plugin: 'claudopus', key: 'drawn' }, 0, { shape: 'drawn-1' });
var drawnNow = 0;
var paneShown = atom({ plugin: 'claudopus', key: 'shown' }, false, { shape: 'shown-1' });
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
var isReplaced = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (isLeft)
                    return [2 /*return*/, true];
                if (!isMarked)
                    return [2 /*return*/, false];
                return [4 /*yield*/, $.state.get(loadNow).catch(function () { return undefined; })];
            case 1:
                now = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.value;
                if (typeof now === 'string' && now > thisLoad)
                    isLeft = true;
                return [2 /*return*/, isLeft];
        }
    });
}); };
// A timer of this load: it stops for good the first time it fires after a newer load took charge
var everyLoad = function ($, ms, fn) {
    var timer = $.clock.every(ms, function () { return void isReplaced($).then(function (left) { return (left ? timer.cancel() : fn()); }); });
    return timer;
};
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
// The settings read again: at a session's start, and after a change in the Config tab
var loadSettings = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readConfig($, dir)];
            case 1:
                config = _a.sent();
                isOff = config.agents === false;
                person = typeof config.name === 'string' ? config.name.trim() : '';
                models = modelsOf(config);
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
    return hrs ? "".concat(hrs, "h ").concat(two(m), "m ").concat(two(sec), "s") : m ? "".concat(m, "m ").concat(two(sec), "s") : "".concat(sec, "s");
};
// A count of tokens as the app writes it
var thousands = function (tokens) {
    return isRunFromAfar ? (tokens < 10000 ? '<10k' : "".concat(Math.round(tokens / 10000) * 10, "k")) : "".concat((tokens / 1000).toFixed(tokens < 100000 ? 1 : 0), "k");
};
// How full a context window is: the share when the window is known, and the tokens
var fill = function (tokens, window) { return (window ? "".concat(percent(tokens, window), "% \u00B7 ").concat(thousands(tokens), " of ").concat(thousands(window)) : thousands(tokens)); };
// The same for a piece of work, short enough for its status line
var percent = function (tokens, window) { return (isRunFromAfar ? Math.floor((tokens / window) * 20) * 5 : Math.round((tokens / window) * 100)); };
var share = function (tokens, window) { return (window ? "context ".concat(percent(tokens, window), "% (").concat(thousands(tokens), ")") : "context ".concat(thousands(tokens))); };
// A model's name as the app writes it, from its id or alias: "Opus 5.5". Nothing for a name it cannot read
var modelName = function (id) {
    var m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(id.toLowerCase());
    return (m === null || m === void 0 ? void 0 : m[1]) ? "".concat(m[1].charAt(0).toUpperCase()).concat(m[1].slice(1)).concat(m[2] ? " ".concat(m[2]).concat(m[3] ? ".".concat(m[3]) : '') : '') : '';
};
// The models the person can move running work to from its card, by the id each step is sent with. Never Haiku
var MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2'];
// The model a step of work is sent to in place of one no work runs on: an older version than the newest above, which the app moves
// work to after its safeguards flag a message, goes to the newest Fable or Sonnet, and Haiku to Sonnet. Nothing for a model work
// may run on: the three above or a newer version, a name with no version, which the app reads as the newest, and Haiku when the
// settings name it for a kind of work
var INSTEAD = { Opus: 'claude-fable-5-2', Fable: 'claude-fable-5-2', Sonnet: 'claude-sonnet-5-5', Haiku: 'claude-sonnet-5-5' };
var rightModel = function (id) {
    var _a, _b;
    var _c = modelName(id).split(' '), _d = _c[0], family = _d === void 0 ? '' : _d, _e = _c[1], version = _e === void 0 ? '' : _e;
    if (!family)
        return undefined;
    if (family === 'Haiku')
        return Object.values(models).includes('haiku') ? undefined : INSTEAD.Haiku;
    if (!version)
        return undefined;
    var newest = (_b = (_a = MODELS.map(modelName).find(function (one) { return one.startsWith(family); })) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : '';
    var _f = version.split('.').map(Number), _g = _f[0], major = _g === void 0 ? 0 : _g, _h = _f[1], minor = _h === void 0 ? 0 : _h;
    var _j = newest.split('.').map(Number), _k = _j[0], topMajor = _k === void 0 ? 0 : _k, _l = _j[1], topMinor = _l === void 0 ? 0 : _l;
    // An id that leads with a date or an old numbering ("claude-3-5-sonnet-20241022") is an older model too
    var isOlder = major > 99 || major < topMajor || (major === topMajor && minor < topMinor);
    return isOlder ? INSTEAD[family] : undefined;
};
// The work and helpers whose steps the app sent to such a model, each said in the log once
var sentElsewhere = new Set();
// What an Agent call is answered when it names such a model
var WRONG_MODEL = function (named) {
    return "No work runs on ".concat(modelName(named) || named, ". Name the model by its alias: ").concat(modelsShort(models), ". Never an older version").concat(Object.values(models).includes('haiku') ? '' : ', never Haiku', ".");
};
// The line written into a piece of work's own chat when the person moves it to another model; the panel draws it as a line of its own
var MODEL_HEAD = 'Model changed to ';
var MODEL_LINE = /^Model changed to (.+?) at (\d{1,2}:\d{2})\./;
var movedTo = function (name, at) {
    var d = new Date(at);
    return "".concat(MODEL_HEAD).concat(name, " at ").concat(String(d.getHours()).padStart(2, '0'), ":").concat(String(d.getMinutes()).padStart(2, '0'), ". ").concat(who(true), " chose it in the panel: your next steps run on ").concat(name, ".");
};
var readOr = function ($, path) { return $.fs.read(path).catch(function () { return ''; }); };
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
// A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end
var appendWords = function ($, chatId, text) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
    switch (_e.label) {
        case 0:
            _b = (_a = $.fs).write;
            _c = ["".concat(dir, "/words/").concat(chatId, ".md")];
            _d = "".concat;
            return [4 /*yield*/, readOr($, "".concat(dir, "/words/").concat(chatId, ".md"))];
        case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.apply("", [_e.sent()]).concat(text)]))
            // A chat's asks and answers, asks/<chat id>.md, added to the end
        ];
    }
}); }); };
// A chat's asks and answers, asks/<chat id>.md, added to the end
var appendAsks = function ($, chatId, text) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
    switch (_e.label) {
        case 0:
            _b = (_a = $.fs).write;
            _c = ["".concat(dir, "/asks/").concat(chatId, ".md")];
            _d = "".concat;
            return [4 /*yield*/, readOr($, "".concat(dir, "/asks/").concat(chatId, ".md"))];
        case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.apply("", [_e.sent()]).concat(text)]))];
    }
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
// The element table a drawing uses: the surface's own, with the terminal's Box taking the app's tints as above and a mark
// (isTerminal) the views in other files read, which are handed the table alone
var uiOf = function ($, e) {
    var ui = $.ui.resolve(e);
    if (e.surface !== 'terminal')
        return ui;
    var marked = __assign(__assign({}, ui), { Box: termBox(ui.Box), isTerminal: true });
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
// Where bin/keyring keeps its files on Linux, as it finds it: $XDG_DATA_HOME, when it is a full path, else ~/.local/share
var keyringRoot = '';
var knowSystem = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r, _a, _b, _c, data, _d, _e, _f;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, $.process.run(['uname', '-s'], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 1:
                r = _j.sent();
                isLinux = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 && r.stdout.trim() === 'Linux';
                _a = !isLinux;
                if (_a) return [3 /*break*/, 5];
                _b = Boolean;
                return [4 /*yield*/, $.env.get('DISPLAY')];
            case 2:
                _c = (_j.sent());
                if (_c) return [3 /*break*/, 4];
                return [4 /*yield*/, $.env.get('WAYLAND_DISPLAY')];
            case 3:
                _c = (_j.sent());
                _j.label = 4;
            case 4:
                _a = _b.apply(void 0, [_c]);
                _j.label = 5;
            case 5:
                hasDesktop = _a;
                return [4 /*yield*/, $.env.get('XDG_DATA_HOME')];
            case 6:
                data = (_g = (_j.sent())) !== null && _g !== void 0 ? _g : '';
                _d = "".concat;
                if (!data.startsWith('/')) return [3 /*break*/, 7];
                _e = data;
                return [3 /*break*/, 9];
            case 7:
                _f = "".concat;
                return [4 /*yield*/, $.env.get('HOME')];
            case 8:
                _e = _f.apply("", [(_h = (_j.sent())) !== null && _h !== void 0 ? _h : '', "/.local/share"]);
                _j.label = 9;
            case 9:
                keyringRoot = _d.apply("", [_e, "/claudopus/keyring"]);
                return [2 /*return*/];
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
