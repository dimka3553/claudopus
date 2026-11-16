"use strict";
// The world beneath the mod in every test: files in memory, the app's session tools, a cheap model; and small helpers
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var HOME = '/home/sam';
// The mod's own folder on this machine: each area's tests are built into mods/claudopus/hooks/tests/
var PLUGIN = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
// Every test may take a minute, not the kit's 5 seconds: the areas' files run side by side, and on a busy machine or GitHub's runner
// (about twice as slow as a Mac) the longest scenarios, 4 to 8 seconds alone, passed or failed by the machine's load, not by the mod.
// SLOW is that limit, kept for the tests that name it
var SLOW = { timeoutMs: 60000 };
function test(name, options, body) {
    if (typeof options === 'function')
        kitTest(name, SLOW, options);
    else
        kitTest(name, __assign(__assign({}, SLOW), options), body);
}
var MEMORY = "".concat(HOME, "/.claude/claudopus");
var composer = { kind: 'composer' };
var start = { cwd: '/repo', surface: 'desktop', isInteractive: true };
var PANE = {
    plugin: 'claudopus',
    component: 'Pane',
    requestId: 'servers',
    props: { title: 'Servers', isFocused: false, bodyColumns: 40, placement: 'dock', scroll: { offset: 0, bodyRows: 20 }, view: {} },
};
var BAND = {
    plugin: 'claudopus',
    component: 'AbovePrompt',
    props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
};
var LIST = {
    plugin: 'claudopus',
    component: 'Pane',
    requestId: 'claudopus',
    props: { title: 'Claudopus', isFocused: false, bodyColumns: 40, placement: 'dock', scroll: { offset: 0, bodyRows: 20 }, view: {} },
};
// The principles and working rules the mod ships
var PRINCIPLES = '# How I work with Claude\n\n## Principles\n\n1. My words are the spec.\n';
// The principles exactly as the mod ships them: the build puts the file's text in place of this line's string
var SHIPPED_PRINCIPLES = '<shipped: rules/CLAUDE.md>';
// The prompt each piece of work started with, as the mod left it
var prompts = [];
// The world beneath the mod: files in memory, the app's session tools, a cheap model
var world = function (on, options) {
    if (options === void 0) { options = {}; }
    var files = new Map();
    // Someone already set up has an index.md; a new person has no memory folder at all
    if (!options.isNew)
        files.set("".concat(MEMORY, "/index.md"), '# Streams\n\nname | repo | session | state | summary\n\n');
    var titles = [];
    var compacts = [];
    var opened = [];
    // Folders listed and panes opened, in the order they happened
    var events = [];
    // Each pane opened, with its tab's title
    var tabs = [];
    var stopped = [];
    var killed = [];
    var gitRan = [];
    var closed = [];
    var logged = [];
    var copied = [];
    // The terminal tabs opened beside the chat, by what they were opened with
    var terminals = [];
    // What was sent on to an agent, what the mod wrote into an agent's chat, and what it submitted to this one
    var sent = [];
    var appended = [];
    var submitted = [];
    // What the mod sent to an agent with $.session.send, which starts again one that has ended, as "<agent>: <text>"
    var resumed = [];
    // The model each step of a piece of work was sent to
    var stepped = [];
    // The model each Agent call reached the engine with, and each spawn was asked to start on (none: left to the agent's kind or parent)
    var agentModels = [];
    var asked = [];
    var played = [];
    var notified = [];
    // What was handed to osascript
    var osa = [];
    var keychain = [];
    // What was handed to Claudopus.app, the mod's own notifier
    var own = [];
    // What was handed to open: a folder shown in Finder
    var shown = [];
    // What was handed to Tailscale to send to another device
    var dropped = [];
    // What was run over ssh, with what it was handed
    var sshed = [];
    prompts.length = 0;
    var spawned = 0;
    var gateKeys = 0;
    var sleepers = [];
    // Whether each agent started ran in the background, as the engine was asked
    var backgrounds = [];
    var wake = function () { return void sleepers.splice(0).forEach(function (one) { return one(); }); };
    // What each Bash call that ran the admin runner found waiting for it: the grants, as bin/admin would read them
    var admins = [];
    mock.env(on, __assign({ HOME: HOME }, options.env));
    var clock = mock.clock(on, { now: 1700000000000 });
    // What the engine draws where the mod draws nothing
    on('ui.render', function ($, e) {
        var Text = $.ui.resolve(e).Text;
        return <Text>the engine's own</Text>;
    });
    on('fs.read', function (_, e) {
        var _a, _b, _c, _d, _e, _f, _g;
        // A picture's bytes, as base64, where the test gives them
        var bytes = (_a = options.bytes) === null || _a === void 0 ? void 0 : _a.call(options, e.path);
        if (bytes !== undefined)
            return { value: { base64: bytes } };
        // The octopus drawings, each an SVG naming its file, when a test asks for them
        var drawing = options.art ? (_b = /\/art\/([\w-]+)\.svg$/.exec(e.path)) === null || _b === void 0 ? void 0 : _b[1] : undefined;
        if (drawing)
            return { value: "<svg xmlns=\"http://www.w3.org/2000/svg\"><title>".concat(drawing, "</title></svg>") };
        // Or drawn as the mod's own are, where the test gives them
        var drawn = (_c = options.drawings) === null || _c === void 0 ? void 0 : _c.call(options, (_e = (_d = /\/art\/([\w-]+)\.svg$/.exec(e.path)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : '');
        if (drawn !== undefined)
            return { value: drawn };
        // The texts the mod ships; a copy of one in the memory folder is the person's own, kept in files
        var isShipped = !e.path.startsWith(MEMORY);
        if (isShipped && e.path.endsWith('roles/chat.md'))
            return { value: (_f = options.chatRole) !== null && _f !== void 0 ? _f : 'CHAT ROLE' };
        if (isShipped && e.path.endsWith('roles/work.md'))
            return { value: 'WORK ROLE; an admin command runs through `{admin}`; a key runs as `{secret} NAME`; main is reached through `{release}`' };
        if (isShipped && e.path.endsWith('rules/CLAUDE.md'))
            return { value: options.shipped ? SHIPPED_PRINCIPLES : PRINCIPLES };
        if (isShipped && options.changelog !== undefined && e.path.endsWith('/CHANGELOG.md'))
            return { value: options.changelog };
        // A release on GitHub, where the test gives one: the mod's folder is a main checkout, whose version a reload loads
        if (options.release && e.path.endsWith('/.git/HEAD'))
            return { value: 'ref: refs/heads/main\n' };
        if (e.path.endsWith('.claude-plugin/plugin.json'))
            return { value: (_g = files.get('manifest')) !== null && _g !== void 0 ? _g : '{ "name": "claudopus", "version": "0.1.0" }' };
        var text = files.get(e.path);
        if (text === undefined)
            throw new Error("ENOENT ".concat(e.path));
        return { value: text };
    });
    on('fs.write', function (_, e) {
        files.set(e.path, e.text);
        return { value: undefined };
    });
    on('fs.exists', function (_, e) { return ({ value: files.has(e.path) }); });
    // What a folder holds: its files, and the folders its deeper files are in
    on('fs.list', function (_, e) { return (events.push("list ".concat(e.path)), {
        value: __spreadArray([], new Set(__spreadArray([], files.keys(), true).filter(function (path) { return path.startsWith("".concat(e.path, "/")); }).map(function (path) { return path.slice(e.path.length + 1); })), true).map(function (rest) { var _a, _b; return ({ name: (_a = rest.split('/')[0]) !== null && _a !== void 0 ? _a : rest, kind: rest.includes('/') ? 'dir' : 'file', size: 1, mtimeMs: Number((_b = files.get("mtime:".concat(e.path, "/").concat(rest))) !== null && _b !== void 0 ? _b : 0), isLink: false }); })
            .filter(function (one, i, all) { return all.findIndex(function (other) { return other.name === one.name; }) === i; }),
    }); });
    on('fs.stat', function (_, e) {
        var _a;
        var kind = files.has(e.path) ? 'file' : __spreadArray([], files.keys(), true).some(function (path) { return path.startsWith("".concat(e.path, "/")); }) ? 'dir' : '';
        if (!kind)
            throw new Error("ENOENT ".concat(e.path));
        return { value: { kind: kind, size: 1, mtimeMs: Number((_a = files.get("mtime:".concat(e.path))) !== null && _a !== void 0 ? _a : 0), isLink: false } };
    });
    on('mcp.call', function (_, e) {
        if (e.server === 'terminal')
            terminals.push(e.args);
        if (e.tool === 'set_session_title')
            titles.push(String(e.args.title));
        var text = e.tool === 'get_session' ? JSON.stringify({ sessionId: 'local_1', title: 'Old title' }) : '[]';
        return { value: { content: [{ type: 'text', text: text }], isError: false } };
    });
    on('session.id', function () { return ({ value: 'engine-id' }); });
    // A chat drawn on the desktop app, as most are; `headless` none, as a -p run
    // `narrow`: a terminal under 144 columns, as a phone over ssh, which draws only a tab opened as the person asked: here, one opened
    // while the test's press is still being answered (isPressing). The engine counts only what the press's own hook opens, which the kit
    // cannot tell from what a button's closure opens in that time; tabmoves.test.tsx holds the hand-over to the hook itself
    on('session.surfaces', function () { return ({ value: options.headless ? [] : options.narrow ? ['terminal'] : ['desktop'] }); });
    on('session.version', function () { return ({ value: { version: '2.1.321', base: '2.1.321' } }); });
    // The chat of a piece of work as the engine keeps it, or its refusal to read one
    // A promise given as the chat is one the app is slow to give
    on('session.messages', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, ((_b = options.talk) !== null && _b !== void 0 ? _b : [])];
                case 1: return [2 /*return*/, (_a.value = (_c.sent()), _a)];
            }
        });
    }); });
    on('session.measure', function (_, e) { return ({ changed: e.changed }); });
    on('session.usage', function () { var _a; return ({ value: { startedAt: 0, context: { tokens: (_a = options.tokens) !== null && _a !== void 0 ? _a : 1000, window: 500000 }, rateLimits: [] } }); });
    on('model.complete', function () {
        var _a;
        return ({
            value: {
                isAnswered: true,
                text: (_a = options.reply) !== null && _a !== void 0 ? _a : 'title: Old title',
                usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
            },
        });
    });
    // One response of a model: its text, then what the API says it was answered over
    on('turn.step', function (_, e) {
        return __asyncGenerator(this, arguments, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stepped.push(e.model);
                        return [4 /*yield*/, __await({ kind: 'text', index: 0, text: 'Looking at the nose.' })];
                    case 1: return [4 /*yield*/, _c.sent()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, __await({
                                turnId: e.turnId,
                                index: e.index,
                                answer: '',
                                toolUses: [],
                                stopReason: 'tool_use',
                                usage: { model: (_b = (_a = options.answered) === null || _a === void 0 ? void 0 : _a.by) !== null && _b !== void 0 ? _b : e.model, input_tokens: 5000, output_tokens: 10, cache_read_input_tokens: 290000, cache_creation_input_tokens: 10000 },
                            })];
                    case 3: return [2 /*return*/, _c.sent()];
                }
            });
        });
    });
    on('ui.log', function (_, e) {
        logged.push(e.text);
        return { value: undefined };
    });
    // `live`: panes as a surface keeps them, opened and closed as asked; a surface that never says one is shown (a chat the app runs on
    // another Mac over ssh) is told by isShown false on every open
    on('ui.panes', function () { var _a; return ({ value: options.live ? options.live.map(function (one) { return ({ id: one.id, title: one.id, isShown: one.isShown, isFocused: Boolean(one.isFocused), isPlaced: one.isPlaced }); }) : ((_a = options.panes) !== null && _a !== void 0 ? _a : []).map(function (id) { return ({ id: id, title: id, isShown: true, isFocused: false, isPlaced: true }); }) }); });
    on('ui.close', function (_, e) {
        var _a;
        closed.push(e.id);
        if (options.live)
            (_a = options.live).splice.apply(_a, __spreadArray([0, options.live.length], options.live.filter(function (one) { return one.id !== e.id; }), false));
        return { value: undefined };
    });
    // What the Mac answers: a dev server on 3100 started by a chat, and the system's own listener, which is not the person's
    on('process.run', function (_, e) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        var _14 = e.argv, tool = _14[0], rest = _14.slice(1);
        var ok = function (stdout, exitCode) {
            if (stdout === void 0) { stdout = ''; }
            if (exitCode === void 0) { exitCode = 0; }
            return ({ value: { exitCode: exitCode, stdout: stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } });
        };
        // The admin gate's wait between two looks at what was pressed: it lasts until the test lets it go with wake(), as a second passing
        if (tool === '/bin/sleep')
            return new Promise(function (done) { return sleepers.push(function () { return done(ok()); }); });
        // Every admin password an earlier version kept, taken out of the keychain as the mod loads
        if (tool === '/bin/sh' && String(rest[1]).includes('delete-generic-password -s claudopus-admin'))
            return (files.set('keychain:admin-forgotten', 'yes'), ok());
        // What a password box sends, sealed by openssl to the key of the runner that asked: the test's own stand-in for it
        if (tool === '/bin/bash' && String(rest[1]).includes('pkeyutl -encrypt'))
            return ok("".concat(boxSealed(String(rest[3]), String((_b = (_a = e.init) === null || _a === void 0 ? void 0 : _a.stdin) !== null && _b !== void 0 ? _b : '')), "\n"));
        // The admin gate's seals: one for each message, under the key the keychain holds as keychain:gate; "make" makes a key where
        // there is none and "new" always, as the Mac's own shell does
        if (tool === '/bin/sh' && String(rest[1]).includes('claudopus-admin-gate')) {
            var said = rest[3], messages = rest.slice(4);
            // The kept copy of the settings and texts has its key apart, as keychain:known
            var item = String(said).startsWith('known-') ? 'keychain:known' : 'keychain:gate';
            // A keychain that does not answer (locked over ssh, or refusing)
            if (files.has('keychain:refused'))
                return ok('', 1);
            var mode = String(said).replace(/^known-/, '');
            if (mode === 'new' || (mode === 'make' && !files.has(item)))
                files.set(item, "key-".concat((gateKeys += 1)));
            var key_1 = files.get(item);
            if (mode === 'has')
                return ok('', key_1 ? 0 : 3);
            return key_1 ? ok(messages.map(function (one) { return "".concat(fakeSeal(key_1, String(one)), "\n"); }).join('')) : ok('', 3);
        }
        // A line added to the end of a file, as the log is written
        if (tool === 'sh' && rest[1] === 'printf %s "$2" >> "$1"' && rest[3] !== undefined) {
            files.set(rest[3], "".concat((_c = files.get(rest[3])) !== null && _c !== void 0 ? _c : '').concat((_d = rest[4]) !== null && _d !== void 0 ? _d : ''));
            return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        // How the computer is used, as the line above the prompt looks at it: what the test gives, else nothing to read
        if (tool === 'sh' && String(rest[1]).startsWith('echo "@@SELF@@'))
            return ok((_f = (_e = options.usage) === null || _e === void 0 ? void 0 : _e.call(options, String(rest[1]))) !== null && _f !== void 0 ? _f : '');
        // The jobs' outputs as the panel reads them in one go, where the test gives them: each output it asks for ends in what the test
        // says, last written when it says, and every detached process it names still runs
        // (and, where the test gives them, the processes and the file each held-open command's shell writes to)
        if (options.jobs && tool === 'sh' && String(rest[1]).includes('@@JOB@@')) {
            var n = Number((_g = rest[3]) !== null && _g !== void 0 ? _g : 0);
            var asked_1 = rest.slice(4, 4 + n).map(String);
            var pids = __spreadArray([], String(rest[1]).matchAll(/for p in ([\d ]*); do kill/g), true).flatMap(function (m) { var _a; return ((_a = m[1]) !== null && _a !== void 0 ? _a : '').trim().split(/\s+/).filter(Boolean); });
            var ps = String(rest[1]).includes('@@PS@@') && options.jobs.ps ? "@@PS@@\n".concat(options.jobs.ps(), "\n") : '';
            return ok("".concat(asked_1.map(function (file) { var _a, _b, _c, _d; return "\n@@JOB@@ ".concat(Math.floor(((_b = (_a = options.jobs) === null || _a === void 0 ? void 0 : _a.wroteAt(file)) !== null && _b !== void 0 ? _b : 0) / 1000), " ").concat(file, "\n").concat((_d = (_c = options.jobs) === null || _c === void 0 ? void 0 : _c.output(file)) !== null && _d !== void 0 ? _d : ''); }).join(''), "\n@@ALIVE@@").concat(pids.filter(function (p) { var _a, _b, _c; return (_c = (_b = (_a = options.jobs) === null || _a === void 0 ? void 0 : _a.alive) === null || _b === void 0 ? void 0 : _b.call(_a, p)) !== null && _c !== void 0 ? _c : true; }).map(function (p) { return " ".concat(p); }).join(''), "\n").concat(ps));
        }
        // The newest process number, as a shell started now gets it, and the processes as a command that has just ended leaves them
        if (((_h = options.jobs) === null || _h === void 0 ? void 0 : _h.pid) && tool === 'sh' && String(rest[1]).includes('# pid now'))
            return ok("".concat(options.jobs.pid(), "\n"));
        if (((_j = options.jobs) === null || _j === void 0 ? void 0 : _j.ps) && tool === 'sh' && String(rest[1]).includes('@@LEFT@@'))
            return ok("@@LEFT@@\n".concat(options.jobs.ps(), "\n"));
        if (((_k = options.jobs) === null || _k === void 0 ? void 0 : _k.fd) && tool === 'sh' && String(rest[1]).includes('/proc/$p/fd/1'))
            return ok(options.jobs.fd());
        // The engine's tasks folder, where the test reads jobs
        if (options.jobs && tool === 'sh' && String(rest[1]).includes('"$1"/tasks'))
            return ok('/tmp/claude-501/x/s1/tasks\n');
        // What sips says of a picture, where the test gives it
        var sipsSaid = tool === 'sips' ? (_l = options.sips) === null || _l === void 0 ? void 0 : _l.call(options, __spreadArray([], e.argv, true)) : undefined;
        if (sipsSaid !== undefined)
            return { value: { exitCode: 0, stdout: sipsSaid, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        if (tool === 'osascript')
            osa.push(__spreadArray([], e.argv, true));
        // What was handed to this Mac's keychain on security's stdin
        if (tool === '/usr/bin/security')
            return (keychain.push(String((_o = (_m = e.init) === null || _m === void 0 ? void 0 : _m.stdin) !== null && _o !== void 0 ? _o : '')), { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } });
        // Claudopus.app, and Claudopus Asks for --asks, answer as the apps on this Mac are set: 0 shown, 2 turned off in System Settings
        if (tool === null || tool === void 0 ? void 0 : tool.endsWith('bin/notify')) {
            own.push(__spreadArray([], e.argv, true));
            return { value: { exitCode: (_r = (rest[0] === '--asks' ? (_p = options.app) === null || _p === void 0 ? void 0 : _p.asks : (_q = options.app) === null || _q === void 0 ? void 0 : _q.claudopus)) !== null && _r !== void 0 ? _r : 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        if (tool === 'open')
            shown.push(__spreadArray([], e.argv, true));
        // Tailscale's file sending, where the test says this Mac has it: the devices it reaches, and what was sent
        if (tool === 'tailscale' || (tool === null || tool === void 0 ? void 0 : tool.endsWith('/Tailscale'))) {
            if (options.tailscale === undefined)
                return { value: { exitCode: 127, stdout: '', stderr: 'not found', isStdoutTruncated: false, isStderrTruncated: false } };
            if (!rest.includes('--targets'))
                dropped.push(__spreadArray([], e.argv, true));
            return { value: { exitCode: 0, stdout: rest.includes('--targets') ? options.tailscale : '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        if (tool === 'kill')
            killed.push.apply(killed, rest.map(String));
        // A run stopped from the panel: its processes asked to end, then made to, all of them gone
        if (tool === 'sh' && String(rest[1]).startsWith('kill -TERM "$@"'))
            return (killed.push.apply(killed, rest.slice(3).map(String)), ok(''));
        // A release on GitHub, where the test gives one: the mod's folder is Claudopus's main checkout on main, a fetch of the release's
        // tag lays its commit under the download ref (and git's progress where the step reads it), and the folder's tree in that commit
        // is the one the release published unless the test says what came down instead
        var release = options.release;
        if (release && tool === 'sh' && rest[1] === '"$@" 2>"$0"') {
            var argv = rest.slice(3).map(String);
            gitRan.push(argv.slice(argv.indexOf('-C') + 2).join(' '));
            if (release.fetchFails)
                return (files.set(String(rest[2]), 'fatal: unable to access GitHub: Could not resolve host'), ok('', 128));
            files.set(String(rest[2]), 'Receiving objects:  50% (10/20), 1.00 MiB | 2.00 MiB/s\rReceiving objects: 100% (20/20), 2.00 MiB | 2.00 MiB/s, done.\nResolving deltas: 100% (5/5), done.\n');
            files.set('git:ref', release.commit);
            return ok();
        }
        if (release && tool === 'git' && rest.includes('--show-toplevel'))
            return ok('/plugins-src\n');
        if (release && tool === 'sh' && String(rest[1]).includes('write-tree'))
            return ok("".concat((_s = files.get('tree:installed')) !== null && _s !== void 0 ? _s : release.tree, "\n"));
        if (release && tool === 'env' && rest.includes('git')) {
            var args = rest.slice(rest.indexOf('-C') + 2).map(String);
            gitRan.push(args.join(' '));
            var at = function (arg) { return (arg !== null && arg !== void 0 ? arg : '').replace(/\^\{commit\}$/, ''); };
            if (args[0] === 'rev-parse' && args.includes('--show-toplevel'))
                return ok('/plugins-src\n');
            if (args[0] === 'ls-files')
                return ok('mods/claudopus/.claude-plugin/plugin.json\n');
            if (args[0] === 'rev-parse' && args.includes('--git-dir'))
                return ok(release.worktree ? '/plugins-src/.git/worktrees/fix\n/plugins-src/.git\n' : '/plugins-src/.git\n/plugins-src/.git\n');
            if (args[0] === 'symbolic-ref')
                return release.noBranch ? ok('', 1) : ok(release.worktree ? 'fix-bar\n' : 'main\n');
            if (args.includes('--symbolic-full-name'))
                return ok('origin/main\n');
            if (args[0] === 'rev-parse' && args.includes('--verify')) {
                var what = (_t = args.at(-1)) !== null && _t !== void 0 ? _t : '';
                if (what.startsWith('refs/claudopus/update'))
                    return files.has('git:ref') ? ok("".concat(files.get('git:ref'), "\n")) : ok('', 1);
                if (what.includes(':'))
                    return what.startsWith("".concat(release.commit, ":")) && files.has('git:ref') ? ok("".concat((_u = release.got) !== null && _u !== void 0 ? _u : release.tree, "\n")) : ok('', 1);
                return ok("".concat(at(what), "\n"));
            }
            if (args[0] === 'show')
                return ok(JSON.stringify({ name: 'claudopus', version: (_v = release.manifest) !== null && _v !== void 0 ? _v : release.version }));
            if (args[0] === 'update-ref' && args[1] === '-d')
                return (files.delete('git:ref'), ok());
            if (args[0] === 'merge-base')
                return ok('', release.ownCommits ? 1 : 0);
            if (args[0] === 'merge') {
                if (release.overwrite)
                    return { value: { exitCode: 1, stdout: '', stderr: 'error: Your local changes to the following files would be overwritten by merge', isStdoutTruncated: false, isStderrTruncated: false } };
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: release.version }));
                return ok();
            }
            if (args[0] === 'ls-remote')
                return ok("".concat((_w = release.online) !== null && _w !== void 0 ? _w : release.commit, "\tHEAD\n"));
            return ok();
        }
        // git in the mod's folder: no checkout unless the test lays git:online, the version its branch online has; then the folder is on
        // main following origin/main, behind it, and a fast-forward (refused with what git:merge says, where laid) moves the manifest there
        if (tool === 'env' && rest.includes('git')) {
            var args = rest.slice(rest.indexOf('-C') + 2);
            var online = files.get('git:online');
            if (online === undefined)
                return ok('', 128);
            gitRan.push(args.join(' '));
            if (args[0] === 'merge' && args[1] !== undefined && args[1].startsWith('--ff')) {
                if (files.has('git:merge'))
                    return { value: { exitCode: 1, stdout: '', stderr: (_x = files.get('git:merge')) !== null && _x !== void 0 ? _x : '', isStdoutTruncated: false, isStderrTruncated: false } };
                files.set('manifest', JSON.stringify({ name: 'claudopus', version: online }));
                return ok();
            }
            if (args.includes('--symbolic-full-name'))
                return ok('origin/main\n');
            if (args[0] === 'symbolic-ref')
                return ok('main\n');
            if (args[0] === 'rev-parse' && args.at(-1) === 'HEAD')
                return ok('aaa\n');
            if (args[0] === 'rev-parse' && args.at(-1) === '@{u}')
                return ok('bbb\n');
            return ok();
        }
        // Another Mac over ssh: what it answers is laid by the test as ssh:<what>; an answer sent there is kept as it was handed over
        if (tool === 'ssh') {
            sshed.push([String(e.argv.at(-1)), String((_z = (_y = e.init) === null || _y === void 0 ? void 0 : _y.stdin) !== null && _z !== void 0 ? _z : '')]);
            var command = String(e.argv.at(-1));
            // Presses left there for this Mac are taken once, as moving each aside there takes it
            var opens = (_0 = files.get('ssh:opens')) !== null && _0 !== void 0 ? _0 : '';
            if (command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/"))
                files.delete('ssh:opens');
            var said = command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/") ? opens : command.startsWith("sh -c 'L=") ? files.get('ssh:fetch') : command.startsWith("sh -c 'echo $HOME;") ? files.get('ssh:results') : files.has('ssh:down') ? undefined : '';
            return { value: { exitCode: said === undefined ? 255 : 0, stdout: said !== null && said !== void 0 ? said : '', stderr: said === undefined ? 'ssh: connect to host m4: timed out' : '', isStdoutTruncated: command.startsWith("sh -c 'echo $HOME;") && files.has('ssh:cut'), isStderrTruncated: false } };
        }
        // The looks for chats running without Claudopus here and for what the app's log says: what the test lays as sh:off and sh:applog.
        // A notification told once makes its folder under live/macs/told, which a second try finds there
        if (tool === 'sh' && (String(rest[1]).includes('custom-title.json') || String(rest[1]).includes('Starting app'))) {
            var said = (_1 = files.get(String(rest[1]).includes('Starting app') ? 'sh:applog' : 'sh:off')) !== null && _1 !== void 0 ? _1 : '';
            return { value: { exitCode: 0, stdout: said, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        if (tool === 'sh' && String(rest[1]).startsWith('mkdir -p "$1" && mkdir "$2"')) {
            var told = "told:".concat(String(rest[4]));
            var isNew = !files.has(told);
            files.set(told, '');
            return { value: { exitCode: isNew ? 0 : 1, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        // A file made only where none is, as the update's lock is taken with the shell's noclobber
        if (tool === 'sh' && rest[1] === 'set -C; printf %s "$2" > "$1"' && rest[3] !== undefined) {
            if (files.has(String(rest[3])))
                return ok('', 1);
            files.set(String(rest[3]), String((_2 = rest[4]) !== null && _2 !== void 0 ? _2 : ''));
            return ok();
        }
        // A shell run here: bringing results from another Mac lays there what the test laid as remote:<folder>/<file>, and a folder moved
        // into place goes only where none has its name
        // Another chat's transcript, read for its work's Details: the file under the projects folder named by its folder, if kept
        if (tool === 'sh' && String(rest[1]).startsWith('for f in "$1/$2/$3"')) {
            var path = "".concat(rest[3], "/").concat(rest[4], "/").concat(rest[5]);
            return files.has(path) ? ok(files.get(path)) : ok('', 1);
        }
        if (tool === 'sh' || tool === 'bash') {
            sshed.push([String(rest[1]), String(rest.slice(3).join(' '))]);
            // A stream cut short lays half of what it carried and fails
            if (String(rest[1]).includes('tar xf - -C "$S"')) {
                for (var _i = 0, _15 = __spreadArray([], files, true); _i < _15.length; _i++) {
                    var _16 = _15[_i], key = _16[0], text = _16[1];
                    if (key.startsWith('remote:') && !(files.has('pull:cut') && key.endsWith('report.md')))
                        files.set("".concat(rest[3], "/").concat(key.slice(7)), text);
                }
                // Cut between two files, tar may end well: only the _end it closes with is missing
                if (files.get('pull:cut') === 'between')
                    return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
                if (files.has('pull:cut'))
                    return { value: { exitCode: 1, stdout: '', stderr: 'tar: Truncated input file', isStdoutTruncated: false, isStderrTruncated: false } };
                files.set("".concat(rest[3], "/_end"), '');
            }
            if (String(rest[1]).startsWith('mkdir "$3"')) {
                var _17 = [String(rest[3]), String(rest[4])], _18 = _17[0], from = _18 === void 0 ? '' : _18, _19 = _17[1], to_1 = _19 === void 0 ? '' : _19;
                if (!__spreadArray([], files.keys(), true).some(function (key) { return key.startsWith("".concat(to_1, "/")); }))
                    for (var _20 = 0, _21 = __spreadArray([], files, true); _20 < _21.length; _20++) {
                        var _22 = _21[_20], key = _22[0], text = _22[1];
                        if (key.startsWith("".concat(from, "/")))
                            (files.set("".concat(to_1).concat(key.slice(from.length)), text), files.delete(key));
                    }
            }
            return { value: { exitCode: 0, stdout: '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        // This Mac's own name, as its Sharing settings give it
        if (tool === 'scutil')
            return { value: { exitCode: 0, stdout: 'Sams-MacBook-Air\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        if (tool === 'rm')
            files.delete(String(rest.at(-1)));
        // A file moved aside
        if (tool === 'mv')
            (files.set(String(rest.at(-1)), (_3 = files.get(String(rest.at(-2)))) !== null && _3 !== void 0 ? _3 : ''), files.delete(String(rest.at(-2))));
        // A copy the mod makes of a file
        if (tool === 'cp')
            (copied.push(String(rest[2])), files.set(String(rest[2]), (_4 = files.get(String(rest[1]))) !== null && _4 !== void 0 ? _4 : ''));
        var isGone = killed.includes('700');
        // bin/keyring, as the runners keep a value: laid by the test as keyring:<service>/<account>
        if (tool === null || tool === void 0 ? void 0 : tool.endsWith('bin/keyring')) {
            var key = "keyring:".concat(rest[1], "/").concat(rest[2]);
            if (rest[0] === 'get')
                return files.has(key) ? ok(files.get(key)) : ok('', 1);
            if (rest[0] === 'set')
                return (files.set(key, String((_6 = (_5 = e.init) === null || _5 === void 0 ? void 0 : _5.stdin) !== null && _6 !== void 0 ? _6 : '').replace(/\n$/, '')), ok());
            if (rest[0] === 'delete')
                return files.has(key) ? (files.delete(key), ok()) : ok('', 1);
            if (rest[0] === 'list')
                return ok(__spreadArray([], files.keys(), true).filter(function (one) { return one.startsWith("keyring:".concat(rest[1], "/")); }).map(function (one) { return "".concat(one.split('/').pop(), "\n"); }).join(''));
            // Every service and account a value is kept under, never a value: the keys laid as secret:<name> and keychain-entry:<service>\t<account>
            // (a keychain that does not answer, where the test lays keyring:refused, fails it)
            if (rest[0] === 'entries' && files.has('keyring:refused'))
                return ok('', 1);
            if (rest[0] === 'entries')
                return ok(__spreadArray([], files.keys(), true).flatMap(function (one) { return (one.startsWith('secret:') && one !== 'secret:refused' ? ["claudopus-secret\t".concat(one.slice(7), "\n")] : one.startsWith('keychain-entry:') ? ["".concat(one.slice(15), "\n")] : []); }).join(''));
            return ok('', 2);
        }
        // git, asked where a worktree is and which branch it is on, as the test lays git:top and git:branch
        if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--show-toplevel'))
            return ok(files.has('git:top') ? "".concat(files.get('git:top'), "\n") : '', files.has('git:top') ? 0 : 128);
        // and where the repo a worktree belongs to keeps its git folder, as git:common lays it
        if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--git-common-dir'))
            return ok(files.has('git:common') ? "".concat(files.get('git:common'), "\n") : '', files.has('git:common') ? 0 : 128);
        if (tool === 'git' && rest.includes('rev-parse') && rest.includes('--abbrev-ref'))
            return ok(files.has('git:branch') ? "".concat(files.get('git:branch'), "\n") : '', files.has('git:branch') ? 0 : 128);
        // The secret runner: one key kept when the test lays its value, swapped for its name in what it is handed
        var kept = files.get('keychain:API_KEY');
        if (tool === null || tool === void 0 ? void 0 : tool.endsWith('bin/secret')) {
            // and the keys a test lays as secret:<name>, each listed by its name and hidden in what passes through
            var more = __spreadArray([], files, true).filter(function (_a) {
                var key = _a[0];
                return key.startsWith('secret:');
            }).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [key.slice(7), value];
            });
            if (rest[0] === '--hide' && files.has('secret:refused'))
                return ok('', 1);
            var hidden = more.reduce(function (text, _a) {
                var name = _a[0], value = _a[1];
                return text.replaceAll(value, "[hidden ".concat(name, "]"));
            }, kept ? String((_8 = (_7 = e.init) === null || _7 === void 0 ? void 0 : _7.stdin) !== null && _8 !== void 0 ? _8 : '').replaceAll(kept, '[hidden API_KEY]') : String((_10 = (_9 = e.init) === null || _9 === void 0 ? void 0 : _9.stdin) !== null && _10 !== void 0 ? _10 : ''));
            var said = rest[0] === '--list' ? "".concat(kept ? 'API_KEY\n' : '').concat(more.map(function (_a) {
                var name = _a[0];
                return "".concat(name, "\n");
            }).join('')) : hidden;
            return { value: { exitCode: 0, stdout: said, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
        }
        // grep handed a .env file for the names before each =, as the list of keys reads one: only what -o matches comes back
        if (tool === '/usr/bin/grep' && rest[0] === '-ohE')
            return ok(((_11 = files.get(String(rest[2]))) !== null && _11 !== void 0 ? _11 : '').split('\n').flatMap(function (line) { var _a, _b; return (_b = (_a = line.match(/^\s*(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=/)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : []; }).map(function (one) { return "".concat(one, "\n"); }).join(''));
        var stdout = (tool === null || tool === void 0 ? void 0 : tool.endsWith('jq'))
            ? // What jq makes of a transcript: the test lays it beside it
                ((_12 = files.get("".concat(String(e.argv.at(-1)), ".sum"))) !== null && _12 !== void 0 ? _12 : '{"s":[],"u":[],"d":[]}')
            : tool === 'grep'
                ? "".concat(MEMORY, "/words/local_1.md:2:the nose is flawed\n")
                : tool === 'lsof' && rest.includes('-iTCP')
                    ? "p635\nn*:7000\n".concat(isGone ? '' : 'p700\nn127.0.0.1:3100\nn[::1]:3100\n')
                    : tool === 'lsof'
                        ? "p635\nfcwd\nn/\np700\nfcwd\nn".concat(HOME, "/Documents/GitHub/3d-sandbox\n")
                        : tool === 'ps' && rest.includes('-ww')
                            ? // The commands running on this Mac, as a test lays them
                                ((_13 = files.get('ps:running')) !== null && _13 !== void 0 ? _13 : '')
                            : tool === 'ps' && rest.includes('-A')
                                ? '  1 0 /sbin/launchd\n500 1 /Users/sam/Library/claude.app/Contents/MacOS/claude\n600 500 /bin/zsh\n700 600 /usr/local/bin/node\n635 1 /System/ControlCenter\n'
                                : tool === 'ps'
                                    ? '700 node /repo/node_modules/.bin/next dev -p 3100\n635 /System/ControlCenter\n'
                                    : '';
        return { value: { exitCode: 0, stdout: stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } };
    });
    on('tool.register', function (_, e) { return ({ value: { tool: "mcp__claudopus__".concat(e.name) } }); });
    on('command.register', function (_, e) { return ({ value: { command: e.name } }); });
    on('ui.open', function (_, e) {
        events.push("open ".concat(e.id));
        opened.push(e.id);
        tabs.push("".concat(e.id, ": ").concat(e.title));
        // A screen with nowhere to draw a pane, as a Remote Control chat seen from another device
        if (options.unplaced)
            return { value: { isPlaced: false, reason: 'no-surface' } };
        if (options.narrow && !options.narrow.isPressing) {
            if (options.live && !options.live.some(function (one) { return one.id === e.id; }))
                options.live.push({ id: e.id, isShown: false, isPlaced: false });
            return { value: { isPlaced: false, reason: 'unasked below 144 columns (42 now)' } };
        }
        // `blind`: an engine with no surface to ask (a chat the app runs on another Mac over ssh) says nothing of any tab, drawn or not
        if (options.live && !options.live.some(function (one) { return one.id === e.id; }))
            options.live.push({ id: e.id, isShown: false, isPlaced: !options.blind });
        return { value: { isPlaced: true } };
    });
    on('session.append', function (_, e, next) {
        var _a, _b;
        if (e.agentId !== undefined && ((_a = options.ended) === null || _a === void 0 ? void 0 : _a.has(e.agentId)))
            return { deny: 'no running loop' };
        appended.push("".concat(e.agentId, ": ").concat((_b = e.message.content[0].text) !== null && _b !== void 0 ? _b : ''));
        return next(e);
    });
    on('session.send', function (_, e) {
        var _a;
        if ((_a = options.unresumable) === null || _a === void 0 ? void 0 : _a.has(e.to))
            return { isDelivered: false, reason: 'no such agent' };
        resumed.push("".concat(e.to, ": ").concat(e.text));
        return { isDelivered: true };
    });
    // A command a test holds running until it lets it go, with what it then prints: `held.get(id)?.(text)`
    var held = new Map();
    // A call a test starts and leaves running, kept so its test can end it: `keep(call)`, then `await settle()` as the test ends.
    // Left running, the call ends after its test, and the look the mod takes as a call ends runs against a later test's files
    var kept = [];
    var keep = function (call) { return (kept.push(call.catch(function () { return undefined; })), call); };
    // Lets every held command go and every wait for a second end, until each kept call has ended
    var settle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isDone, all, n, _i, _a, _b, id, go;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    isDone = false;
                    all = Promise.all(kept.splice(0)).then(function () { return (isDone = true); });
                    n = 0;
                    _c.label = 1;
                case 1:
                    if (!(n < 2000 && !isDone)) return [3 /*break*/, 4];
                    for (_i = 0, _a = __spreadArray([], held, true); _i < _a.length; _i++) {
                        _b = _a[_i], id = _b[0], go = _b[1];
                        (held.delete(id), go(''));
                    }
                    wake();
                    return [4 /*yield*/, Promise.race([all, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 5); })])];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    n++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!isDone)
                        throw new Error('a call the test kept did not end');
                    return [2 /*return*/];
            }
        });
    }); };
    on('tool.call', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var command, _a, _b, name_1, text_1, w, forGood;
        var _c, _d, _e, _f;
        var _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    if (e.tool === 'Agent')
                        agentModels.push(e.model);
                    command = String((_g = e.command) !== null && _g !== void 0 ? _g : '');
                    // The person says no to the app's prompt for this tool
                    // as the engine says it: an error result in words, the same for an approval cut short
                    if (files.get('refuse') === e.tool)
                        return [2 /*return*/, { result: "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.", isError: true }];
                    if (files.get('interrupt') === e.tool)
                        return [2 /*return*/, { result: '[Request interrupted by user for tool use]', isError: true }
                            // A command started detached prints its process, as `echo $!` does
                        ];
                    // A command started detached prints its process, as `echo $!` does
                    if (e.tool === 'Bash' && /\bnohup\b/.test(command) && command.includes('$!'))
                        return [2 /*return*/, { result: { stdout: '48213\n', stderr: '', interrupted: false } }
                            // A command that writes a file of the memory folder, by a path the hook cannot read in it: `effect <name> <text>` writes it,
                            // `effect <name>` takes it away, and `effect <name> hold <key>` writes it once the test lets the call end
                            // Write to the person's rules and roles writes them, as the tool does
                        ];
                    // A command that writes a file of the memory folder, by a path the hook cannot read in it: `effect <name> <text>` writes it,
                    // `effect <name>` takes it away, and `effect <name> hold <key>` writes it once the test lets the call end
                    // Write to the person's rules and roles writes them, as the tool does
                    if (e.tool === 'Write' && /\/\.claude\/claudopus\/(?:rules|roles)\//.test(String(e.file_path)))
                        files.set(String(e.file_path), String((_h = e.content) !== null && _h !== void 0 ? _h : ''));
                    if (!(e.tool === 'Bash' && command.startsWith('effect '))) return [3 /*break*/, 3];
                    _a = command.split(' '), _b = _a[1], name_1 = _b === void 0 ? '' : _b, text_1 = _a.slice(2);
                    if (!(text_1[0] === 'hold')) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (done) { var _a; return held.set((_a = text_1[1]) !== null && _a !== void 0 ? _a : '', done); })];
                case 1:
                    _o.sent();
                    _o.label = 2;
                case 2:
                    if (text_1.length)
                        files.set("".concat(MEMORY, "/").concat(name_1), text_1[0] === 'hold' ? text_1.slice(2).join(' ') : text_1.join(' '));
                    else
                        files.delete("".concat(MEMORY, "/").concat(name_1));
                    return [2 /*return*/, { result: { stdout: '', stderr: '', interrupted: false } }];
                case 3:
                    if (!(e.tool === 'Bash' && / # hold (\S+)$/.test(command))) return [3 /*break*/, 5];
                    _c = {};
                    _d = {};
                    return [4 /*yield*/, new Promise(function (done) { var _a, _b; return held.set((_b = (_a = command.match(/ # hold (\S+)$/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '', done); })];
                case 4: return [2 /*return*/, (_c.result = (_d.stdout = _o.sent(), _d.stderr = '', _d.interrupted = false, _d), _c)
                    // One sent to the background comes back at once, as the engine's does, and ends with the test
                ];
                case 5:
                    // One sent to the background comes back at once, as the engine's does, and ends with the test
                    if (e.tool === 'Bash' && e.run_in_background && command.startsWith('hold ')) {
                        void new Promise(function (done) { return held.set(command.slice(5), done); });
                        return [2 /*return*/, { result: { stdout: '', stderr: '', interrupted: false, backgroundTaskId: "bg-".concat(e.tool_use_id) } }];
                    }
                    if (!(e.tool === 'Bash' && command.startsWith('hold '))) return [3 /*break*/, 7];
                    _e = {};
                    _f = {};
                    return [4 /*yield*/, new Promise(function (done) { return held.set(command.slice(5), done); })];
                case 6: return [2 /*return*/, (_e.result = (_f.stdout = _o.sent(), _f.stderr = '', _f.interrupted = false, _f), _e)];
                case 7:
                    if (e.tool === 'Bash' && command.includes('admin'))
                        admins.push({ command: command, grants: __spreadArray([], files, true).filter(function (_a) {
                                var path = _a[0];
                                return path.startsWith("".concat(MEMORY, "/admin-grants/"));
                            }).map(function (_a) {
                                var text = _a[1];
                                return JSON.parse(text);
                            }) });
                    if (e.tool === 'TaskStop')
                        stopped.push(String(e.task_id));
                    if (e.tool === 'SendMessage')
                        sent.push(String(e.message));
                    // A command that prints the key, as one could print it by mistake
                    if (e.tool === 'Bash' && String(e.command).includes('echo $API_KEY'))
                        return [2 /*return*/, { result: { stdout: "token is ".concat((_j = files.get('keychain:API_KEY')) !== null && _j !== void 0 ? _j : 'none'), stderr: '', interrupted: false } }
                            // A file that holds the key, as a .env does
                        ];
                    // A file that holds the key, as a .env does
                    if (e.tool === 'Read' && String(e.file_path).endsWith('/.env'))
                        return [2 /*return*/, { result: { type: 'text', file: { content: "API_KEY=".concat((_k = files.get('keychain:API_KEY')) !== null && _k !== void 0 ? _k : 'none') } } }
                            // A workflow runs in the background: the tool answers with its run, its task and where its transcripts go
                            // A command sent to the background answers at once with its task, as a real one did on 13 Nov; a watch the same
                        ];
                    // A workflow runs in the background: the tool answers with its run, its task and where its transcripts go
                    // A command sent to the background answers at once with its task, as a real one did on 13 Nov; a watch the same
                    if (e.tool === 'Bash' && e.run_in_background)
                        return [2 /*return*/, { result: { stdout: '', stderr: '', interrupted: false, isImage: false, noOutputExpected: false, backgroundTaskId: "bg-".concat(e.tool_use_id) } }
                            // SBOS's list of names, as the test lays it
                        ];
                    // SBOS's list of names, as the test lays it
                    if (e.tool === 'mcp__sbos__secrets')
                        return [2 /*return*/, { result: { content: [{ type: 'text', text: (_l = files.get('sbos:secrets')) !== null && _l !== void 0 ? _l : '[]' }] } }];
                    if (e.tool === 'Monitor') {
                        w = e;
                        forGood = w.persistent === undefined || w.persistent === true || w.persistent === 'true';
                        return [2 /*return*/, { result: { taskId: "mon-".concat(e.tool_use_id), timeoutMs: forGood ? 0 : Math.min((_m = w.timeout_ms) !== null && _m !== void 0 ? _m : 300000, 1800000), persistent: forGood } }];
                    }
                    if (e.tool === 'Workflow')
                        return [2 /*return*/, { result: { status: 'async_launched', taskId: 'wt1', runId: 'wf_1', taskType: 'local_workflow', workflowName: 'rounds', transcriptDir: '/t/wf_1', scriptPath: '/t/wf_1.js' } }];
                    return [2 /*return*/, { result: 'ran' }];
            }
        });
    }); });
    on('agent.spawn', function (_, e) {
        var _a, _b, _c, _d, _e;
        prompts.push(e.prompt);
        backgrounds.push(e.background);
        asked.push(e.model);
        var resume = e.resume;
        // The model an agent's own type starts it on, by its task's few words, as Explore starts on Haiku
        return { model: (_d = (_c = (_a = options.startedOn) === null || _a === void 0 ? void 0 : _a[(_b = e.description) !== null && _b !== void 0 ? _b : '']) !== null && _c !== void 0 ? _c : options.model) !== null && _d !== void 0 ? _d : 'm', agentId: (_e = resume === null || resume === void 0 ? void 0 : resume.agentId) !== null && _e !== void 0 ? _e : "a".concat((spawned += 1)) };
    });
    on('agent.list', function () { var _a; return ({ value: Object.entries((_a = options.agents) !== null && _a !== void 0 ? _a : {}).map(function (_a) {
            var _b, _c, _d;
            var id = _a[0], status = _a[1];
            return (__assign({ id: id, description: 'Listed by the engine', type: (_c = (_b = options.kinds) === null || _b === void 0 ? void 0 : _b[id]) !== null && _c !== void 0 ? _c : 'fork', status: status }, (((_d = options.parents) === null || _d === void 0 ? void 0 : _d[id]) ? { parentId: options.parents[id] } : {})));
        }) }); });
    on('session.start', function (_, e) { return ({ cwd: e.cwd }); });
    on('prompt.submit', function (_, e) {
        if (e.origin.kind !== 'composer')
            submitted.push(e.text);
        return { text: e.text, context: e.context };
    });
    on('turn.complete', function (_, e) { return ({ text: e.answer }); });
    // The sounds played and the notifications raised, each as "title | text"
    on('audio.play', function (_, e) {
        played.push(String(e.clip.asset));
        return { value: undefined };
    });
    // The app takes it, or, as the desktop app does today, takes none from a mod
    on('ui.notify', function (_, e) {
        var _a, _b;
        if ((_a = options.app) === null || _a === void 0 ? void 0 : _a.noSurface)
            return { value: { isSent: false, reason: 'no-surface' } };
        notified.push("".concat((_b = e.title) !== null && _b !== void 0 ? _b : '', " | ").concat(e.text));
        return { value: { isSent: true, channel: 'client' } };
    });
    on('tool.describe', function (_, e) { return ({ description: e.description }); });
    // The settings hooks beneath: none answers a permission request, unless a test lays one that allows
    on('classic.Notification', function () { return ({}); });
    on('classic.PostToolBatch', function () { return ({}); });
    on('classic.PermissionRequest', function () { return (files.has('settings:allow') ? { decision: { behavior: 'allow' } } : {}); });
    on('session.compact', function (_, e) {
        compacts.push(e.instructions);
        return { messages: e.messages };
    });
    return { files: files, titles: titles, compacts: compacts, opened: opened, tabs: tabs, stopped: stopped, killed: killed, closed: closed, logged: logged, sent: sent, appended: appended, submitted: submitted, resumed: resumed, clock: clock, copied: copied, stepped: stepped, played: played, notified: notified, osa: osa, own: own, shown: shown, dropped: dropped, terminals: terminals, sshed: sshed, events: events, held: held, keep: keep, settle: settle, keychain: keychain, admins: admins, wake: wake, gitRan: gitRan, backgrounds: backgrounds, agentModels: agentModels, asked: asked };
};
// A seal as the test world makes it: 64 hex digits from the key and the message, the same for the same two
var fakeSeal = function (key, message) {
    return Array.from({ length: 8 }, function (_, n) { return __spreadArray([], "".concat(n).concat(key, "\n").concat(message), true).reduce(function (h, c) { return Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; }, 2166136261 + n).toString(16).padStart(8, '0'); }).join('');
};
// A box's value as the test world seals it to a runner's key: hex of the key's start and the value, long as a real one, never the
// value itself as typed
var boxSealed = function (key, value) { return "".concat(__spreadArray([], "".concat(key.slice(0, 12), "|").concat(value), true).map(function (c) { return c.charCodeAt(0).toString(16).padStart(2, '0'); }).join('')).padEnd(344, 'A'); };
// The public half of a runner's key, as bin/admin puts it in a request
var BOX_PUBLIC = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA".concat('x'.repeat(300), "IDAQAB");
// One of the person's settings or texts as Config writes it: the file, and what Claudopus knows it holds, so no check puts it back
var ownSet = function (files, name, text) {
    var _a;
    var _b;
    var kept = (function () {
        var _a, _b;
        try {
            return (_b = JSON.parse((_a = files.get("".concat(MEMORY, "/admin-known.json"))) !== null && _a !== void 0 ? _a : '{}').files) !== null && _b !== void 0 ? _b : {};
        }
        catch (_c) {
            return {};
        }
    })();
    var known = __assign(__assign({}, kept), (_a = {}, _a[name] = text, _a));
    if (!files.has('keychain:known'))
        files.set('keychain:known', 'key-known');
    var count = (function () {
        var _a, _b;
        try {
            return Number((_b = JSON.parse((_a = files.get("".concat(MEMORY, "/admin-known.json"))) !== null && _a !== void 0 ? _a : '{}').count) !== null && _b !== void 0 ? _b : 0) + 1;
        }
        catch (_c) {
            return 1;
        }
    })();
    files.set("".concat(MEMORY, "/admin-known.json"), JSON.stringify({ files: known, count: count, seal: fakeSeal((_b = files.get('keychain:known')) !== null && _b !== void 0 ? _b : '', "known\n".concat(count, "\n").concat(JSON.stringify(known))) }));
    files.set("".concat(MEMORY, "/").concat(name), text);
};
// A button of the open card by its key less the count of presses the card adds to it
var keyed = function (pane, base) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return new RegExp("^".concat(base, "-\\d+$")).test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
    }
}); }); };
var pressed = function (pane, base) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _b = (_a = pane).press;
                _c = {};
                return [4 /*yield*/, keyed(pane, base)];
            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : base, _c)])];
        }
    });
}); };
var spawn = { subagentType: 'general-purpose', fork: false, background: true, description: 'Fix the nose' };
var until = function (look) { return __awaiter(void 0, void 0, void 0, function () {
    var end, got;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                end = Date.now() + 40000;
                _a.label = 1;
            case 1: return [4 /*yield*/, look()];
            case 2:
                got = _a.sent();
                if (got)
                    return [2 /*return*/, got];
                if (Date.now() > end)
                    return [2 /*return*/, undefined];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 5); })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
// ---- Set-ups more than one area uses ----
var steps = function ($, index, model, agentId) { return __awaiter(void 0, void 0, void 0, function () {
    var chunks, _a, _b, _c, c, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                chunks = [];
                _g.label = 1;
            case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues($.turn.step(__assign({ turnId: 't', index: index, model: model, messageCount: 2 }, (agentId ? { agentId: agentId } : {}))));
                _g.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                c = _f;
                chunks.push(c);
                _g.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _g.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _g.sent();
                _g.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12: return [2 /*return*/, chunks];
        }
    });
}); };
var ADMIN = '/plug/claudopus/bin/admin';
var GRANTS = "".concat(MEMORY, "/admin-grants/");
var ALLOWED = "".concat(MEMORY, "/admin-allowed.json");
// A piece of work under way in a chat of Sam's, and the panel
var gated = function ($_1, on_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([$_1, on_1], args_1, true), void 0, function ($, on, config, options) {
        var w, list, bash, labels, held, grants, press;
        if (config === void 0) { config = {}; }
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = world(on, options);
                    w.files.set("".concat(MEMORY, "/config.json"), JSON.stringify(__assign({ name: 'Sam' }, config)));
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the hosts file', prompt: 'fix the hosts file' }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
                case 4:
                    list = _a.sent();
                    bash = function (id, command, agentId, more) {
                        if (agentId === void 0) { agentId = 'a1'; }
                        if (more === void 0) { more = {}; }
                        return $.tool.call(__assign({ tool: 'Bash', tool_use_id: id, command: command, agentId: agentId }, more));
                    };
                    labels = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.props.label) !== null && _a !== void 0 ? _a : ''); })
                                // The call is held once its buttons are on the card
                            ];
                        }
                    }); }); };
                    held = function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, until(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, keyed(list, "gate-".concat(id, "-0-deny"))];
                            }); }); })];
                    }); }); };
                    grants = function () { return __spreadArray([], w.files.keys(), true).filter(function (path) { return path.startsWith(GRANTS); }); };
                    press = function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pressed(list, key)];
                            case 1: return [2 /*return*/, (_a.sent(), w.wake())];
                        }
                    }); }); };
                    return [2 /*return*/, __assign(__assign({}, w), { holding: w.held, list: list, bash: bash, labels: labels, held: held, grants: grants, press: press })];
            }
        });
    });
};
// A prompt's Yes or No, by the start of its key: the prompt's id and the count of presses follow
var button = function (pane, start) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return String((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith(start); })];
    }
}); }); };
var NOW = 1700000000000;
// This chat's own work as its file shares it with the other chats
var read$todos = function (files) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
    return [2 /*return*/, ((_c = (_b = JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}').cards) === null || _b === void 0 ? void 0 : _b.find(function (one) { return one.id === 'a1'; })) !== null && _c !== void 0 ? _c : {})
        // Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
    ];
}); }); };
// Another chat's file as that chat writes it: one piece of work that asks for a go-ahead, and one that runs
var otherChat = function (at, chat, title) {
    if (chat === void 0) { chat = 'chat-b'; }
    if (title === void 0) { title = 'Billing page'; }
    return JSON.stringify({
        chat: chat,
        title: title,
        folder: '/repo/billing',
        host: '',
        at: at,
        cards: [
            { id: 'b1', parentId: '', isFork: false, tokens: 0, model: 'claude-opus-5-5', title: 'Send the invoices', words: 'send them', items: [{ text: 'Draft the mail', state: 'done' }], entries: [{ at: at, kind: 'note', text: 'I drafted the mail.' }], answer: '', ask: { text: 'May I send 12 invoices?', choices: ['Send', 'Not now'], from: 'b1', at: at }, startedAt: at - 60000, endedAt: 0, status: 'working' },
            { id: 'b2', parentId: '', isFork: false, tokens: 0, title: 'Check the totals', words: 'check', items: [], entries: [{ at: at, kind: 'note', text: 'Adding up March.' }], answer: '', startedAt: at - 30000, endedAt: 0, status: 'working' },
        ],
    });
};
