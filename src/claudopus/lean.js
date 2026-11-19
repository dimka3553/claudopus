// Smaller starts and the chat's quicker ways: the mod's own kinds of agent, each with only the tools its work takes, the models they
// run on, the single command the chat runs itself, and the repeated notice left out
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
// What every kind of the mod's agents is told before its task, in place of the engine's own agent prompt
var AGENT_HEAD = 'You are an agent of Claude Code, working in the background on a task you are given. Use the tools you have to do it fully: no more than it asks, and not half done. Read files you know you need yourself; send calls that need nothing from each other together. Paths you give are absolute. When you are done, give your report: what was done, what you found, and what is not done or not checked, short, with the file paths that matter. Use no emojis.';
// The panel's tools, which work keeps its card with, and the handback its report goes through
var PANEL_TOOLS = ['mcp__claudopus__todo', 'mcp__claudopus__note', 'mcp__claudopus__ask', 'mcp__claudopus__update', 'mcp__claudopus__recall'];
var READ_TOOLS = ['Read', 'Grep', 'Glob', 'Bash', 'WebFetch', 'WebSearch', 'ToolSearch', 'SubagentHandback'];
// ToolSearch loads the ones among these the engine holds back until asked (Monitor, SendMessage, TaskStop and the like)
var WORK_TOOLS = __spreadArray(['Bash', 'Read', 'Edit', 'Write', 'Grep', 'Glob', 'NotebookEdit', 'Agent', 'SendMessage', 'TaskStop', 'Monitor', 'WebFetch', 'WebSearch', 'ToolSearch', 'SubagentHandback'], PANEL_TOOLS, true);
// The kinds, by their short name: the engine names each `claudopus:<name>`
var KINDS = {
    task: { description: 'A background task the chat starts: builds, fixes, researches, releases. Starts with only its working tools.', tools: WORK_TOOLS, prompt: AGENT_HEAD },
    quick: {
        description: 'A fresh task for a clearly stated job: a change described exactly, a push and a look at the build, a merge, a look-up. Starts small, on the model for clearly stated jobs.',
        tools: WORK_TOOLS,
        prompt: "".concat(AGENT_HEAD, "\nThis is a clearly stated job: do what the instructions say, in as few steps as it takes."),
    },
    helper: { description: "A task's helper that builds a part beside others, on the task's own model.", tools: WORK_TOOLS.filter(function (one) { return one !== 'mcp__claudopus__update'; }), prompt: AGENT_HEAD },
    reader: {
        description: "A task's helper that only searches and reads, and reports what it concluded.",
        tools: READ_TOOLS,
        prompt: "".concat(AGENT_HEAD, "\nYou only search and read: you change no file. Run only commands that read (git log, ls, a search). Report what you concluded and where, not the files themselves."),
    },
    check: {
        description: 'A second agent that did not build the work, and looks for what is wrong with it before the person sees it.',
        tools: __spreadArray(__spreadArray([], READ_TOOLS.filter(function (one) { return one !== 'SubagentHandback'; }), true), ['Agent', 'SendMessage', 'TaskStop', 'Monitor', 'mcp__claudopus__todo', 'mcp__claudopus__note', 'mcp__claudopus__ask', 'SubagentHandback'], false),
        prompt: "".concat(AGENT_HEAD, "\nYou check work someone else built: look for what is wrong with it, from the change itself (the diff) and the pictures you are given, which you look at. You fix nothing. Report each fault you find with where it is and why it is wrong, most serious first, and say plainly what you did not check."),
    },
};
var KIND_OF = function (type) {
    var _a;
    var name = (_a = /^claudopus:(\w+)$/.exec(type)) === null || _a === void 0 ? void 0 : _a[1];
    return name && name in KINDS ? name : undefined;
};
// Registered as the session starts; a failure is logged, and the chat's rules still name `general-purpose` for what needs everything
var registerKinds = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, _i, _a, _b, name_1, kind;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _loop_1 = function (name_1, kind) {
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, $.agent
                                    .register({ name: name_1, description: kind.description, prompt: kind.prompt, tools: kind.tools })
                                    .then(function (r) { var _a; return log($, "agent kind ".concat((_a = r.agent) !== null && _a !== void 0 ? _a : name_1, " registered")); })
                                    .catch(function (err) { return log($, "agent kind ".concat(name_1, " not registered: ").concat(String(err))); })];
                            case 1:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = Object.entries(KINDS);
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                _b = _a[_i], name_1 = _b[0], kind = _b[1];
                return [5 /*yield**/, _loop_1(name_1, kind)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// What a start of one of the mod's kinds becomes: a reader on the legwork model (Sonnet as shipped); a check on a model never weaker than
// what built it, nor below Opus; a quick task always on the model for clearly stated jobs, whatever the chat named
var kindStart = function (e) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (e.fork || e.workflow || e.resume)
        return {};
    var kind = KIND_OF((_a = e.subagentType) !== null && _a !== void 0 ? _a : '');
    if (!kind)
        return {};
    var parent = (_c = rightModel(String((_b = e.parentModel) !== null && _b !== void 0 ? _b : ''))) !== null && _c !== void 0 ? _c : String((_d = e.parentModel) !== null && _d !== void 0 ? _d : '');
    var asked = ((_e = e.model) !== null && _e !== void 0 ? _e : '').trim();
    if (kind === 'reader')
        return { model: modelsIn(models, lean).legwork };
    if (kind === 'check') {
        var least = rankOf(parent) >= RANK.Opus ? parent : ((_f = newestModel('Opus')) !== null && _f !== void 0 ? _f : 'opus');
        return { model: asked && asked !== 'inherit' && rankOf((_g = rightModel(asked)) !== null && _g !== void 0 ? _g : asked) >= rankOf(least) ? asked : least };
    }
    // never the chat's own model or another it names: a quick task on Fable in a Fable chat costs four times as much (judgment work is a
    // claudopus:task, on the model the chat names)
    if (kind === 'quick')
        return { model: clearModel(models, lean) };
    return {};
};
// ---- The single command the chat runs itself ----
// The longest a command the chat runs may take: it is stopped then
var CHAT_COMMAND_MS = 10 * 60000;
// How many of its last lines come back with its end
var CHAT_TAIL = 3;
// A command the chat may run itself: one command, with nothing joined to it or sent into a file
var isOneCommand = function (command) {
    var text = command.trim();
    if (!text || /\n/.test(text))
        return false;
    // anywhere, quoted or not: no command run inside it (a shell runs $( ) and backticks in double quotes too); outside quotes: no
    // joining, piping or sending into a file
    if (/`|\$\(|<\(|>\(/.test(text))
        return false;
    var bare = text.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, '""');
    return shellWords(text).length === 1 && !/[;&|<>]/.test(bare);
};
// What the chat's own command may not be: a file read or search, which the chat does with Read, Grep and Glob, one that names a saved
// paste (the agent that needs it reads it), and a runner of the mod's (an admin command, a key, a release), which a task runs
// It changes no file: only git's and gh's looks and a push or fetch, and a few that only say how things stand. Anything else (a
// script, a deploy, a file moved or removed, a merge, a pull) goes to a task
var CHAT_GIT = ['push', 'fetch', 'status', 'log', 'diff', 'show', 'branch', 'remote', 'rev-parse', 'ls-remote', 'describe', 'shortlog', 'blame'];
var CHAT_GH = ['view', 'list', 'status', 'checks', 'diff'];
var CHAT_LOOKS = ['ls', 'pwd', 'date', 'uptime', 'whoami', 'hostname', 'df', 'sw_vers', 'uname', 'which'];
// It shows a file or a page: macOS's open of a page of a local server, a folder, or a file of a kind that is only looked at (a picture,
// a PDF, a page, a text, a video), in its own app or one named from a short list of browsers and viewers (never a code editor, which may run a folder's own tasks as it opens); -R only shows a
// file in the Finder. A path may start at the home folder (~ or $HOME)
var OPEN_VIEWS = /\.(?:png|jpe?g|gif|webp|avif|heic|tiff?|bmp|svg|ico|pdf|html?|txt|md|markdown|csv|tsv|json|log|mp4|mov|m4v|webm)$/i;
// a folder: the current one, the home folder, or a path ending in / whose last name has no dot (Foo.app/ is an app)
var OPEN_FOLDER = /^(?:\.|~|\$HOME|(?:.*\/)?[^/.]+\/)$/;
var OPEN_APPS = ['safari', 'google chrome', 'chrome', 'chromium', 'vivaldi', 'firefox', 'arc', 'brave browser', 'microsoft edge', 'opera', 'orion', 'preview', 'quicktime player', 'photos', 'textedit', 'iina', 'vlc'];
var isChatOpen = function (args) {
    var _a;
    var shown = 0;
    var isReveal = args.some(function (one) { return /^-[gnR]*R[gnR]*$/.test(one); });
    for (var i = 0; i < args.length; i++) {
        var one = args[i];
        if (one === '-a') {
            if (!OPEN_APPS.includes(((_a = args[++i]) !== null && _a !== void 0 ? _a : '').toLowerCase()))
                return false;
        }
        else if (/^-[gnRet]+$/.test(one))
            continue;
        else if (one.startsWith('-'))
            return false;
        else if (/^https?:\/\//i.test(one) && CURL_LOCAL.test(one))
            shown++;
        // a path: never a link of another kind or a page elsewhere, and for anything but -R a folder or one of the kinds above
        else if (/^[a-z][\w+.-]*:/i.test(one) || !(isReveal || OPEN_FOLDER.test(one) || OPEN_VIEWS.test(one)))
            return false;
        else
            shown++;
    }
    return shown > 0;
};
// It asks how a server on this Mac stands: curl's plain GET or HEAD of a local address, -q first so it reads no curlrc (which could
// send its output into a file), its body printed or sent to /dev/null; none of curl's ways to send data, change the method or
// headers, follow a redirect elsewhere, write a file or read settings from one
var CURL_LOCAL = /^(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|[\w-]+\.localhost)(?::\d+)?(?:[/?#]|$)/i;
var CURL_FLAGS = ['--silent', '--show-error', '--fail', '--fail-with-body', '--head', '--include', '--insecure', '--compressed', '--verbose', '-4', '-6'];
var isChatCurl = function (args) {
    var asked = 0;
    if (args[0] !== '-q')
        return false;
    var _loop_2 = function (i) {
        var _a, _b;
        var flag = args[i];
        var joined;
        // --name=value, and a value joined to a short flag or to a run of them (-so /dev/null, -m5)
        if (flag.startsWith('--') && flag.includes('='))
            _a = [flag.slice(0, flag.indexOf('=')), flag.slice(flag.indexOf('=') + 1)], flag = _a[0], joined = _a[1];
        else if (/^-[sSfIikv]*[omw]/.test(flag)) {
            var m = /^-[sSfIikv]*([omw])(.*)$/.exec(flag);
            _b = ["-".concat(m[1]), m[2] || undefined], flag = _b[0], joined = _b[1];
        }
        var value = function () { var _a; return (_a = joined !== null && joined !== void 0 ? joined : args[++i]) !== null && _a !== void 0 ? _a : ''; };
        if (/^-[sSfIikv]+$/.test(flag) || CURL_FLAGS.includes(flag))
            return out_i_1 = i, "continue";
        if (flag === '-o' || flag === '--output') {
            if (value() !== '/dev/null')
                return { value: false };
        }
        else if (flag === '-w' || flag === '--write-out') {
            var format = value();
            if (/output\{/i.test(format) || format.startsWith('@'))
                return { value: false };
        }
        else if (['-m', '--max-time', '--connect-timeout'].includes(flag)) {
            if (!/^\d+(?:\.\d+)?$/.test(value()))
                return { value: false };
        }
        else if (flag === '--url') {
            if (!CURL_LOCAL.test(value()))
                return { value: false };
            asked++;
        }
        else if (flag.startsWith('-') || !CURL_LOCAL.test(flag))
            return { value: false };
        else
            asked++;
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 1; i < args.length; i++) {
        var state_1 = _loop_2(i);
        i = out_i_1;
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return asked > 0;
};
// The shape each of these passes in, told with a refusal of one that does not
var CHAT_SHAPES = {
    open: 'An `open` the chat runs itself shows a page of a local server (http://localhost:3000), a folder, or a file that is only looked at (a picture, a PDF, a page, a text, a video), optionally in a named browser or viewer (`-a Vivaldi`), or shows a file in the Finder with `-R`; sent with `run_in_background: true`.',
    curl: 'A `curl` the chat runs itself starts with -q (so it reads no curlrc) and is a plain GET or HEAD of a local address (localhost, 127.0.0.1, [::1]), its body printed or sent to /dev/null, never to a file: flags -s -S -f -I -i -k -v, -o /dev/null, -w with a format, -m; no -L, -X, -H, -d, -F, -T or -O; sent with `run_in_background: true`.',
    preview_start: "The browser pane's `preview_start` runs in the chat only with a `url` of a local address (http://localhost:3000); one that starts a server by its name is a task's.",
};
// The browser pane's preview of a page of a local server, its list, its server's log and its tabs: shown, never a server started
var isPaneShow = function (e) {
    var m = /^mcp__(?:remote-devices__)?Claude_Browser__(\w+)$/.exec(e.tool);
    if (!m)
        return false;
    if (['preview_list', 'preview_logs', 'tabs_context'].includes(m[1]))
        return true;
    var call = e;
    return m[1] === 'preview_start' && call.name === undefined && typeof call.url === 'string' && /^https?:\/\//i.test(call.url) && CURL_LOCAL.test(call.url);
};
// The folders a chat's `git -C` may look into: its own folder and the topics' repos, each with what is below it. Never another
// path: a repo's own settings can make git run a program (core.fsmonitor on status, diff.external, a textconv or gpg.program on log),
// so a look into an unpacked download would run what it holds. A path with .. in it is no place of these
var isPlaceOf = function (path, places) {
    return !path.split('/').includes('..') && places.some(function (place) { return place && (path === place || path.startsWith("".concat(place.replace(/\/+$/, ''), "/")) || (!path.startsWith('/') && place === cwd)); });
};
var isChatRunnable = function (command, branch, places) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (branch === void 0) { branch = ''; }
    if (places === void 0) { places = []; }
    if (!isOneCommand(command) || RUNNER_NAMED.test(command) || /claudopus\/p\W?stes|\bpastes\b/.test(command))
        return false;
    // nothing the shell fills in or spreads out: no variables, braces, globs, escapes, home or history, outside quotes; inside double
    // quotes no variable or escape (single quotes hold anything as written)
    // (a backslash there that the shell keeps as written, as in "%{http_code}\n", is as written; the address [::1] is curl's own)
    // (and an open's path may start at the home folder: ~ or $HOME, alone or before a /)
    var said = (_a = shellWords(command)[0]) !== null && _a !== void 0 ? _a : [];
    // A look into a topic's repo or a folder in the chat's own (isPlaceOf): git -C and a plain path first, for a look only, never a push or fetch (whose
    // branch is read in the chat's folder). 17 Nov: a chat opened above its repos had every git log refused, and guessed at status
    var isElsewhere = said[0] === 'git' && said[1] === '-C' && /^[^-]/.test((_b = said[2]) !== null && _b !== void 0 ? _b : '') && !['push', 'fetch'].includes((_c = said[3]) !== null && _c !== void 0 ? _c : '');
    if (said[0] === 'git' && said[1] === '-C' && !(isElsewhere && isPlaceOf((_d = said[2]) !== null && _d !== void 0 ? _d : '', places)))
        return false;
    var words = isElsewhere ? __spreadArray(['git'], said.slice(3), true) : said;
    var head = (_e = words[0]) !== null && _e !== void 0 ? _e : '';
    var homed = head === 'open' ? command.replace(/(^|\s)~(?=\/|\s|$)/g, '$1').replace(/\$HOME(?=[/\s"]|$)/g, '') : command;
    if (/[$\\{}*?[\]~!]/.test(homed.replace(/'[^']*'|"(?:[^"$`\\]|\\[^$`"\\\n])*"/g, '""').replace(/\[::1\]/g, '')))
        return false;
    var rest = words.slice(2);
    if (head === 'open')
        return isChatOpen(words.slice(1));
    if (head === 'curl')
        return isChatCurl(words.slice(1));
    if (head === 'git') {
        // the verb straight after git: no -c, -C or --config-env before it, which set what git runs
        var verb = (_f = words[1]) !== null && _f !== void 0 ? _f : '';
        if (!CHAT_GIT.includes(verb) || rest.some(function (one) { return /^--(?:output|exec|upload-pack|receive-pack|config-env|push-option|ext-diff|textconv)\b|^-o$/.test(one); }))
            return false;
        // git branch only lists; git remote only shows
        if (verb === 'branch' && rest.some(function (one) { return !/^(?:-a|-r|-v|-vv|--all|--remotes|--list|--show-current|--merged|--no-merged|--contains)$/.test(one); }))
            return false;
        if (verb === 'remote' && !(rest.length === 0 || (rest.length === 1 && rest[0] === '-v') || (['get-url', 'show'].includes((_g = rest[0]) !== null && _g !== void 0 ? _g : '') && rest.length === 2)))
            return false;
        // a push or fetch of plain names only: no refspec, no force, delete, all or mirror, and never from main itself
        if (verb === 'push' || verb === 'fetch') {
            if (rest.some(function (one) { return one.includes(':') || /^\+/.test(one) || /^-/.test(one) && !/^(?:-u|--set-upstream|-q|--quiet|--prune|-p|--tags)$/.test(one); }))
                return false;
            if (verb === 'push' && (!branch || /^(?:main|master|HEAD)$/.test(branch) || rest.some(function (one) { return /^(?:main|master|HEAD|@)$/.test(one) || /^--tags$/.test(one); })))
                return false;
        }
        return true;
    }
    if (head === 'gh')
        return ['pr', 'run', 'issue', 'release', 'repo', 'workflow'].includes((_h = words[1]) !== null && _h !== void 0 ? _h : '') && CHAT_GH.includes((_j = words[2]) !== null && _j !== void 0 ? _j : '') && !words.some(function (one) { return /^--(?:web|output)\b|^-w$/.test(one); });
    return CHAT_LOOKS.includes(head);
};
var NOT_ONE_COMMAND = 'Not run: the chat runs only a single command with nothing joined to it (no `&&`, `;`, `|`, `>`, `$( )` or backticks), and only one that changes no file: a push, a fetch, a look with git or gh (`git -C <folder> log` for a topic\'s repo or a folder in the chat\'s), an `open` of a file or page, or a `curl` status check of a local server, sent with `run_in_background: true`. Start a task for anything else.';
// The chat's own commands under way, by their background id: when each started and what it was
var chatCommands = new Map();
// The background id a command sent to the background answers with, as the engine writes it
var backgroundIdOf = function (result) {
    var _a, _b;
    var r = result;
    if (typeof (r === null || r === void 0 ? void 0 : r.backgroundTaskId) === 'string')
        return r.backgroundTaskId;
    return (_b = (_a = /\bID:\s*([\w-]+)/.exec(typeof result === 'string' ? result : JSON.stringify(result !== null && result !== void 0 ? result : ''))) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
};
// Started by the chat: in the background, stopped by Claudopus at its limit
var chatCommandStarted = function ($, call, result) { return __awaiter(_this, void 0, void 0, function () {
    var id, _a, _b, _c;
    var _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                id = backgroundIdOf(result);
                if (!id)
                    return [2 /*return*/];
                _b = (_a = chatCommands).set;
                _c = [id];
                _d = {};
                return [4 /*yield*/, $.clock.now()];
            case 1:
                _b.apply(_a, _c.concat([(_d.at = _g.sent(), _d.command = String((_e = call.command) !== null && _e !== void 0 ? _e : ''), _d.description = String((_f = call.description) !== null && _f !== void 0 ? _f : ''), _d)]));
                return [4 /*yield*/, log($, "the chat's own command started in the background (".concat(id, ")"))];
            case 2:
                _g.sent();
                afterLoad($, CHAT_COMMAND_MS, function () {
                    if (!chatCommands.has(id))
                        return;
                    void $.tool
                        .call({ tool: 'TaskStop', task_id: id })
                        .then(function () { return log($, "the chat's own command ".concat(id, " stopped at its 10-minute limit")); })
                        .catch(function () { return undefined; });
                });
                return [2 /*return*/];
        }
    });
}); };
// What the chat is told as its command ends: how it ended and its last lines, so it reads no output file
var chatCommandEnded = function ($, text) { return __awaiter(_this, void 0, void 0, function () {
    var told, _i, _a, m, body, id, run, file, status_1, summary, raw, _b, hidden, _c, lines, isLate;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                told = [];
                _i = 0, _a = text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g);
                _o.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 12];
                m = _a[_i];
                body = (_d = m[1]) !== null && _d !== void 0 ? _d : '';
                id = (_f = (_e = /<task-id>([^<]+)<\/task-id>/.exec(body)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : '';
                run = chatCommands.get(id);
                if (!run)
                    return [3 /*break*/, 11];
                chatCommands.delete(id);
                file = (_h = (_g = /<output-file>([^<]+)<\/output-file>/.exec(body)) === null || _g === void 0 ? void 0 : _g[1]) !== null && _h !== void 0 ? _h : '';
                status_1 = (_k = (_j = /<status>([^<]+)<\/status>/.exec(body)) === null || _j === void 0 ? void 0 : _j[1]) !== null && _k !== void 0 ? _k : '';
                summary = (_m = (_l = /<summary>([^<]+)<\/summary>/.exec(body)) === null || _l === void 0 ? void 0 : _l[1]) !== null && _m !== void 0 ? _m : '';
                if (!file) return [3 /*break*/, 3];
                return [4 /*yield*/, fileEnd($, file, 64000)];
            case 2:
                _b = (_o.sent()).replace(/\s+$/, '').split('\n').slice(-CHAT_TAIL).join('\n');
                return [3 /*break*/, 4];
            case 3:
                _b = '';
                _o.label = 4;
            case 4:
                raw = _b;
                if (!raw) return [3 /*break*/, 6];
                return [4 /*yield*/, knowKept($, true)];
            case 5:
                _o.sent();
                _o.label = 6;
            case 6:
                if (!raw) return [3 /*break*/, 8];
                return [4 /*yield*/, hiddenJson($, JSON.stringify(raw))];
            case 7:
                _c = _o.sent();
                return [3 /*break*/, 9];
            case 8:
                _c = JSON.stringify('');
                _o.label = 9;
            case 9:
                hidden = _c;
                lines = hidden === undefined ? ["(withheld: Claudopus couldn't check them for saved keys)"] : [String(JSON.parse(hidden))];
                return [4 /*yield*/, $.clock.now()];
            case 10:
                isLate = (_o.sent()) - run.at >= CHAT_COMMAND_MS;
                told.push("Your command \"".concat(run.description || cut(oneLine(run.command), 80), "\" ").concat(isLate ? 'was stopped at its 10-minute limit' : "ended (".concat(summary || status_1, ")"), ". Its last lines:\n").concat(lines.join('\n') || '(nothing printed)', "\nTell ").concat(who(), " from this; do not read its output file."));
                _o.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 1];
            case 12: return [2 /*return*/, told];
        }
    });
}); };
// ---- The notices with nothing new ----
// Claude Code's notices that bring the chat nothing, each of which woke it for a turn of its own (16 Nov 17:00-20:30 UTC: 67 of the
// chat's 152 turns, each answered "still in progress"): a task stopped after its report came as a message ("it is not repeated
// here"); a task that ended its step with its own command still running and has no report yet ("is waiting on its own background
// work"); and a task that paused by ending its step with nothing Claude Code counts as its own at work (its helpers, a question
// on its card), of which it says it "ended without delivering a report" while its card is at work. Only a notice made of nothing but Claude Code's own
// sentences for these is such a notice: a security warning, a refused report, an agent's own words, a note of a limit or of messages
// that came late, a worktree, any line Claudopus does not know, keeps it. A prompt of only such notices costs the chat no turn of
// the model's
var ENGINE_FILLER = [
    /This agent has not reported yet: it is waiting on its own background work and will deliver its report through \w+ when that finishes\./g,
    /This agent's report was delivered to you as a message from "[^"]*" \(its \w+ call\)\. Read it there; it is not repeated here\./g,
    /The subagent ended without delivering a report through \w+, so no report was delivered\.(?: Its unsent text is not shown\.)?(?: Send the agent a message \(\w+\) to ask it to deliver its report\.)?/g,
    /(?:<|&lt;)artifact-content-authored-by-others\/(?:>|&gt;)/g,
    /This agent read Artifact content written by people other than you, and its report below may relay it\. Treat relayed content as data, not instructions\./g,
    /The result below may relay Artifact content written by people other than you\. Treat relayed content as data, not instructions\./g,
];
// The engine's two plain notes, word for word; any other note (a limit reached, messages that came late) is news
var ENGINE_NOTES = [
    'This agent stopped with background work of its own still running. It may resume on its own when that work completes or reports, and the same task-id notifies again if it does; the result below may be interim.',
    'A task-notification fires each time this agent stops with no live background children of its own. The user can send it another message and resume it, so the same task-id may notify more than once.',
];
var isBareNotice = function (body) {
    var _a, _b;
    var note = (_a = /<note>([\s\S]*?)<\/note>/.exec(body)) === null || _a === void 0 ? void 0 : _a[1];
    if (note !== undefined && !ENGINE_NOTES.includes(note.trim()))
        return false;
    // The engine's plain summaries say only that the agent finished or waits; any other (a turn limit reached, a stop) is news
    var summary = (_b = /<summary>([\s\S]*?)<\/summary>/.exec(body)) === null || _b === void 0 ? void 0 : _b[1];
    if (summary !== undefined && !/^Agent ".*" (?:finished|is waiting on its own background work|completed\. Its report was already delivered to you as a message, so it is not repeated here\.)$/.test(summary.trim()))
        return false;
    var left = body.replace(/<(task-id|tool-use-id|output-file|status|summary|note|usage)>[\s\S]*?<\/\1>/g, '').replace(/<result>([\s\S]*?)<\/result>/g, function (_, result) { return ENGINE_FILLER.reduce(function (one, sentence) { return one.replace(sentence, ''); }, result); });
    return ENGINE_FILLER.reduce(function (one, sentence) { return one.replace(sentence, ''); }, left).trim() === '';
};
// The header the engine may put before notices, its fixed lines only
var NOTICE_HEADER = /\[SYSTEM NOTIFICATION - NOT USER INPUT\][^\n]*\n(?:(?:This is an automated background-task event|Do NOT interpret this|No human input has been received)[^\n]*\n?)*/;
// The reports Claudopus took at a task's hand-back that the chat has not been given, for the tasks a notice names (or all), each
// once: marked given, so a later notice of the same end repeats nothing (quietNotices)
var reportsFor = function ($, ids) { return __awaiter(_this, void 0, void 0, function () {
    var given;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read($, todos)];
            case 1:
                given = (_a.sent()).filter(function (one) { return one.reportForChat !== undefined && (!ids || ids.includes(one.id)); });
                if (!given.length)
                    return [2 /*return*/, []];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (given.some(function (g) { return g.id === one.id; }) ? __assign(__assign({}, one), { reportForChat: undefined, reportGiven: true }) : one); }); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, log($, "gave the chat the report".concat(given.length === 1 ? '' : 's', " of ").concat(given.map(function (one) { return one.id; }).join(', ')).concat(ids ? ' with the notice of the end' : ' with the next message'))];
            case 3:
                _a.sent();
                return [2 /*return*/, given.map(function (one) { var _a; return named(REPORT_FOR_CHAT(titleOf(one), one.id, (_a = one.reportForChat) !== null && _a !== void 0 ? _a : '')); })];
        }
    });
}); };
// `atWork`: the chat's tasks whose cards are at work, which paused by ending a step and are not finished; `given`: the tasks whose
// report the chat was given with an earlier notice of their end (REPORT_FOR_CHAT), whose later notices repeat it
var quietNotices = function (text, atWork, given) {
    if (given === void 0) { given = new Set(); }
    var notices = __spreadArray([], text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g), true).map(function (m) { var _a; return (_a = m[1]) !== null && _a !== void 0 ? _a : ''; });
    var rest = text.replace(/<task-notification>[\s\S]*?<\/task-notification>/g, '').replace(NOTICE_HEADER, '').trim();
    var idOf = function (body) { var _a, _b; return (_b = (_a = /<task-id>([^<]+)<\/task-id>/.exec(body)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''; };
    var isCompleted = function (body) { return /<status>completed<\/status>/.test(body) && isBareNotice(body); };
    var isRepeat = function (body) { return isCompleted(body) && (/not repeated here/.test(body) || (given.has(idOf(body)) && /ended without delivering a report|has not reported yet/.test(body))); };
    var isWaitingOwn = function (body) { return isCompleted(body) && /is waiting on its own background work<\/summary>/.test(body); };
    var isPaused = function (body) { return /<status>completed<\/status>/.test(body) && /ended without delivering a report/.test(body) && atWork.has(idOf(body)); };
    var isQuiet = notices.length > 0 && !rest && notices.every(function (body) { return isRepeat(body) || isWaitingOwn(body) || (isCompleted(body) && isPaused(body)); });
    return { isQuiet: isQuiet, isRepeat: isQuiet && notices.every(isRepeat) };
};
// Such a prompt is let in and its turn answered with no model (workHooks' turn.step): Claude Code shows every prompt a hook drops
// as a warning card, "Prompt dropped by a hook" (2.1.325), and asks the model again after an answer with no visible text ("Your
// previous response had no visible output"). Its own line for a turn with nothing to say ends the turn; it counts that line as no
// answer (the turn's result is empty)
var NO_ANSWER = 'No response requested.';
// The notices a prompt is made of, each whole, and the helpers' results let in as quiet whole: a turn is quiet when it is made of
// nothing but those (Claude Code may put its header before them, or join several in one turn)
var noticesOf = function (text) { return __spreadArray([], text.matchAll(/<task-notification>[\s\S]*?<\/task-notification>/g), true).map(function (m) { return m[0]; }); };
var isQuietTurn = function (text, quiet) {
    var rest = text;
    for (var _i = 0, quiet_1 = quiet; _i < quiet_1.length; _i++) {
        var one = quiet_1[_i];
        rest = rest.split(one).join('');
    }
    return rest !== text && !rest.replace(NOTICE_HEADER, '').trim();
};
// A line Claudopus writes in a card's log: what became of something the person pressed there. It is Claudopus's, never the task's
// own: the card's line beside the dots says only what the task wrote itself (19 Nov: "Your command ended after 20s" stood there
// in place of what the task was doing)
var stepLine = function ($, id, text) { return __awaiter(_this, void 0, void 0, function () {
    var at;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === id ? __assign(__assign({}, card), { entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'event', text: text }], false).slice(-ENTRIES_KEPT) }) : card); }); })];
            case 2:
                _a.sent();
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
// A line the task wrote itself, with its note tool: where it stands, or what it decided
var isOwnEntry = function (entry) { return entry.kind === 'note' || entry.kind === 'decision'; };
var ownNote = function (one) { return __spreadArray([], one.entries, true).reverse().find(function (entry) { return isOwnEntry(entry) && entry.text; }); };
