// What every part shares: the panel's names and limits, the state the panel draws from, the settings in force, small text
// helpers, the log and the chat's saved words
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
var _this = this;
// The panel beside the chat: one small card per piece of work under way; pressed, a card shows all its to-dos and its own chat
var LIST = 'claudopus';
var LIST_TITLE = 'Claudopus';
// The panel that lists the servers on this Mac; it opens when asked for
var PANE = 'servers';
var PANE_TITLE = 'Servers';
// The panel an earlier version opened by itself
var OLD_PANE = 'agents';
// Rarely used tools wait behind ToolSearch instead of loading into every chat
var RARE_TOOLS = ['ReportFindings', 'SuggestPluginInstall', 'SuggestSkills', 'SearchPlugins', 'ScheduleWakeup', 'Workflow'];
var RARE_SERVERS = ['mcp__Claude_Browser__', 'mcp__Claude_Code_iOS_Simulator__', 'mcp__visualize__'];
// What a chat's own thread may call: it starts agents and workflows, and talks to them. An agent may call anything
var OWN = ['Agent', 'Workflow', 'SendMessage', 'ListAgents', 'TaskStop', 'ToolSearch', 'AskUserQuestion', 'SendUserFile', 'ReadNotifications', 'Skill'];
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
// How long one message of that chat may be
var SAID_CHARS = 8000;
// How much of a long message to the work is drawn before it is opened
var TOLD_CHARS = 300;
// How long the line of one tool step may be
var STEP_CHARS = 160;
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
var FILL = '#80808024';
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
// The chat of the card that is open, as last read: read again only when that work has moved
// Counts presses in the open card; the card's buttons carry it in their keys. On the desktop app the button last pressed holds the
// focus and is kept in view: every redraw (a new line of the work, the person's own scrolling) pulled the view back to it, most often to
// the bottom of the chat. With a new key after each press the app finds no such button, and the view stays where the person put it
var presses = 0;
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
// How long work has run, to the second: "42s", "12m 08s", "1h 04m 31s"
var took = function (ms) {
    var all = Math.max(0, Math.floor(ms / 1000));
    var _a = [Math.floor(all / 3600), Math.floor(all / 60) % 60, all % 60], hrs = _a[0], m = _a[1], sec = _a[2];
    var two = function (n) { return String(n).padStart(2, '0'); };
    return hrs ? "".concat(hrs, "h ").concat(two(m), "m ").concat(two(sec), "s") : m ? "".concat(m, "m ").concat(two(sec), "s") : "".concat(sec, "s");
};
// A count of tokens as the app writes it
var thousands = function (tokens) { return "".concat((tokens / 1000).toFixed(tokens < 100000 ? 1 : 0), "k"); };
// How full a context window is: the share when the window is known, and the tokens
var fill = function (tokens, window) { return (window ? "".concat(Math.round((tokens / window) * 100), "% \u00B7 ").concat(thousands(tokens), " of ").concat(thousands(window)) : thousands(tokens)); };
// The same for a piece of work, short enough for its status line
var share = function (tokens, window) { return (window ? "context ".concat(Math.round((tokens / window) * 100), "% (").concat(thousands(tokens), ")") : "context ".concat(thousands(tokens))); };
// A model's name as the app writes it, from its id or alias: "Opus 5.5". Nothing for a name it cannot read
var modelName = function (id) {
    var m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:-(\d{1,2}))?(?!\d))?/.exec(id.toLowerCase());
    return (m === null || m === void 0 ? void 0 : m[1]) ? "".concat(m[1].charAt(0).toUpperCase()).concat(m[1].slice(1)).concat(m[2] ? " ".concat(m[2]).concat(m[3] ? ".".concat(m[3]) : '') : '') : '';
};
// The models the person can move running work to from its card, by the id each step is sent with. Never Haiku
var MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2'];
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
var log = function ($, line) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
    switch (_e.label) {
        case 0:
            _b = (_a = $.fs).write;
            _c = ["".concat(dir, "/log.md")];
            _d = "".concat;
            return [4 /*yield*/, readOr($, "".concat(dir, "/log.md"))];
        case 1: return [2 /*return*/, _b.apply(_a, _c.concat([_d.apply("", [_e.sent()]).concat(new Date().toISOString(), " ").concat(line.replace(/\s+/g, ' ').slice(0, 400), "\n")])).catch(function () { return undefined; })
            // A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end
        ];
    }
}); }); };
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
