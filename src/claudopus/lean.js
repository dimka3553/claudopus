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
// The panel's tools, which work keeps its card with, and the handback its report goes through. Each kind told to call `wake_me`
// rather than wait has it: a task and a quick task to be started again, a helper to be told to hand back what it waits for instead
var PANEL_TOOLS = ['mcp__claudopus__todo', 'mcp__claudopus__note', 'mcp__claudopus__ask', 'mcp__claudopus__waits', 'mcp__claudopus__update', 'mcp__claudopus__recall', 'mcp__claudopus__wake_me'];
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
    helper: { description: "A task's helper that builds a part beside others, on the task's own model.", tools: WORK_TOOLS.filter(function (one) { return one !== 'mcp__claudopus__update' && one !== 'mcp__claudopus__waits'; }), prompt: AGENT_HEAD },
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
var isChatRunnable = function (command, branch) {
    var _a, _b, _c, _d, _e, _f;
    if (branch === void 0) { branch = ''; }
    if (!isOneCommand(command) || RUNNER_NAMED.test(command) || /claudopus\/p\W?stes|\bpastes\b/.test(command))
        return false;
    // nothing the shell fills in or spreads out: no variables, braces, globs, escapes, home or history
    if (/[$\\{}*?[\]~!]/.test(command))
        return false;
    var words = (_a = shellWords(command)[0]) !== null && _a !== void 0 ? _a : [];
    var head = (_b = words[0]) !== null && _b !== void 0 ? _b : '';
    var rest = words.slice(2);
    if (head === 'git') {
        // the verb straight after git: no -c, -C or --config-env before it, which set what git runs
        var verb = (_c = words[1]) !== null && _c !== void 0 ? _c : '';
        if (!CHAT_GIT.includes(verb) || rest.some(function (one) { return /^--(?:output|exec|upload-pack|receive-pack|config-env|push-option|ext-diff|textconv)\b|^-o$/.test(one); }))
            return false;
        // git branch only lists; git remote only shows
        if (verb === 'branch' && rest.some(function (one) { return !/^(?:-a|-r|-v|-vv|--all|--remotes|--list|--show-current|--merged|--no-merged|--contains)$/.test(one); }))
            return false;
        if (verb === 'remote' && !(rest.length === 0 || (rest.length === 1 && rest[0] === '-v') || (['get-url', 'show'].includes((_d = rest[0]) !== null && _d !== void 0 ? _d : '') && rest.length === 2)))
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
        return ['pr', 'run', 'issue', 'release', 'repo', 'workflow'].includes((_e = words[1]) !== null && _e !== void 0 ? _e : '') && CHAT_GH.includes((_f = words[2]) !== null && _f !== void 0 ? _f : '') && !words.some(function (one) { return /^--(?:web|output)\b|^-w$/.test(one); });
    return CHAT_LOOKS.includes(head);
};
var NOT_ONE_COMMAND = 'Not run: the chat runs only a single command with nothing joined to it (no `&&`, `;`, `|`, `>`, `$( )` or backticks), and only one that changes no file: a push, a fetch, or a look with git or gh. Start a task for anything else.';
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
// ---- The repeated notice ----
// The engine's notice that a task stopped after its report came as a message: "it is not repeated here". It woke the chat for a turn
// with nothing new (359 turns over 13-16 Nov), so a notice that says only that, for tasks whose report came, is left out
var isRepeatOnly = function (text) {
    var notices = __spreadArray([], text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g), true);
    if (!notices.length)
        return false;
    var rest = text.replace(/<task-notification>[\s\S]*?<\/task-notification>/g, '').replace(/\[SYSTEM NOTIFICATION[\s\S]*$/, '').trim();
    return !rest && notices.every(function (m) { var _a, _b; return /<status>completed<\/status>/.test((_a = m[1]) !== null && _a !== void 0 ? _a : '') && /not repeated here/.test((_b = m[1]) !== null && _b !== void 0 ? _b : ''); });
};
// ---- The last step on a go-ahead ----
// A go-ahead to finish (Release it) on work that has ended: its last step is done without starting the work again. A repo with a
// `.release` released by Claudopus itself, with no model, after the same allow box on the card a release always waits for; any other
// step by a small fresh task given the folder, the branch and the step. The work is started again only when the step fails in a way
// that needs what it knows
var RELEASE_STEP = /^\s*(?:release|run (?:the )?release(?: runner)?|(?:cd \S+ && )?\S*bin\/release)\s*\.?\s*$/i;
// How often a release Claudopus runs is looked at, and the longest it is waited for
var STEP_LOOK = 10000;
var STEP_LONGEST = 90 * 60000;
var stepLine = function ($, id, text) { return __awaiter(_this, void 0, void 0, function () {
    var at;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === id ? __assign(__assign({}, card), { entries: __spreadArray(__spreadArray([], card.entries, true), [{ at: at, kind: 'note', text: text }], false).slice(-ENTRIES_KEPT) }) : card); }); })];
            case 2:
                _a.sent();
                redraw($);
                return [2 /*return*/];
        }
    });
}); };
var lastStep = function ($, one, ask, said) { return __awaiter(_this, void 0, void 0, function () {
    var folder, step, git, repo, branch, wakeText, isFixed, _a, _b, prompt, wake;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                folder = (_c = ask.folder) !== null && _c !== void 0 ? _c : '';
                step = (_d = ask.lastStep) !== null && _d !== void 0 ? _d : '';
                git = function (args) { return $.process.run(__spreadArray(['git', '-C', folder], args, true), { timeoutMs: 15000 }).then(function (r) { return (r.exitCode === 0 ? r.stdout.trim() : ''); }).catch(function () { return ''; }); };
                return [4 /*yield*/, git(['rev-parse', '--show-toplevel'])];
            case 1:
                repo = _f.sent();
                return [4 /*yield*/, git(['rev-parse', '--abbrev-ref', 'HEAD'])];
            case 2:
                branch = _f.sent();
                wakeText = "".concat(who(true), " pressed \"").concat(said, "\" in answer to your question: ").concat(ask.text, "\n").concat(RESUMED_BY_ANSWER);
                _a = Boolean;
                _b = repo && branch && branch !== 'HEAD' && RELEASE_STEP.test(step);
                if (!_b) return [3 /*break*/, 4];
                return [4 /*yield*/, $.fs.stat("".concat(repo, "/.release")).catch(function () { return undefined; })];
            case 3:
                _b = ((_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.kind) === 'file';
                _f.label = 4;
            case 4:
                isFixed = _a.apply(void 0, [_b]);
                return [4 /*yield*/, log($, "last step of ".concat(one.id, " on ").concat(who(), "'s go-ahead: ").concat(isFixed ? 'the release, run by Claudopus' : 'a small fresh task'))
                    // held for the person's allow, so never awaited in the press's own hook
                ];
            case 5:
                _f.sent();
                // held for the person's allow, so never awaited in the press's own hook
                if (isFixed)
                    return [2 /*return*/, void releaseItself($, one, ask, said, repo, branch, wakeText).catch(function (err) { return log($, "release of ".concat(one.id, " not done: ").concat(String(err))); })];
                prompt = named("Do the last step of the task \"".concat(titleOf(one), "\", which {name} just gave the go-ahead for by pressing \"").concat(said, "\" (to: ").concat(ask.text, "): ").concat(step, "\nWork in ").concat(folder).concat(branch && branch !== 'HEAD' ? ", on its branch ".concat(branch) : '', ". It is this one step: do only that, then report in one or two lines what happened. If it fails in a way that needs what the task that built it knows (a merge conflict, a failing check, a question only it can answer), send that task, \"").concat(one.id, "\", a message with SendMessage saying what failed and the last lines of the output, and end; do not fix it yourself."));
                return [4 /*yield*/, stepLine($, one.id, "On your \"".concat(said, "\", a small fresh task does the last step: ").concat(cut(step, 160)))];
            case 6:
                _f.sent();
                wake = { target: one.id, text: wakeText, answers: [], spawn: { prompt: prompt, description: "".concat(cut(titleOf(one), 50), ": last step"), subagentType: 'claudopus:quick', model: clearModel(models, lean), cwd: folder } };
                wakes.push(wake);
                void $.clock.after(WAKE_WAIT, function () {
                    var at = wakes.indexOf(wake);
                    if (at < 0)
                        return;
                    wakes.splice(at, 1);
                    void sendWake($, wake, false);
                });
                return [2 /*return*/];
        }
    });
}); };
// The release with no model: the card's allow box first, as for any release, then the runner on its own, followed by the mod
var releaseItself = function ($, one, ask, said, repo, branch, wakeText) { return __awaiter(_this, void 0, void 0, function () {
    var at, common, name, id, gate, allowed, logFile, isLogged, grant, run, timer;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                at = _a.sent();
                return [4 /*yield*/, $.process.run(['git', '-C', repo, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { timeoutMs: 15000 }).then(function (r) { return r.stdout.trim(); }).catch(function () { return ''; })];
            case 2:
                common = _a.sent();
                name = (/\/\.git$/.test(common) ? common.replace(/\/\.git$/, '') : repo).split('/').pop() || repo;
                id = "step-".concat(one.id, "-").concat(at);
                gate = { id: id, call: id, kind: 'release', host: name, command: "".concat(branch, " from ").concat(repo), folder: repo, branch: branch, at: at, from: one.id };
                return [4 /*yield*/, stepLine($, one.id, "On your \"".concat(said, "\", Claudopus releases ").concat(branch, " itself once you allow it below"))];
            case 3:
                _a.sent();
                return [4 /*yield*/, holdGate($, {}, gate, one.id)];
            case 4:
                allowed = _a.sent();
                if (allowed !== 'once')
                    return [2 /*return*/, stepLine($, one.id, "Nothing was released: the release was ".concat(allowed === 'deny' ? 'denied' : 'not allowed'))];
                logFile = "".concat(dir, "/releases/").concat(id, ".log");
                return [4 /*yield*/, $.fs.write(logFile, '').then(function () { return true; }).catch(function () { return false; })];
            case 5:
                isLogged = _a.sent();
                if (!isLogged)
                    return [2 /*return*/, stepLine($, one.id, 'Nothing was released: Claudopus could not start the release')];
                return [4 /*yield*/, issueGrant($, id, { host: 'release', command: "".concat(repo, "\n").concat(branch) }, 'release-grant')];
            case 6:
                grant = _a.sent();
                if (!grant)
                    return [2 /*return*/, stepLine($, one.id, 'Nothing was released: the allow could not be secured')
                        // Detached, so it outlives the ten minutes a call of the mod may take; its exit is written as its last line
                    ];
                return [4 /*yield*/, $.process
                        .run(['/bin/sh', '-c', 'nohup /bin/sh -c \'"$1" > "$2" 2>&1; echo "claudopus-exit $?" >> "$2"\' sh "$1" "$2" > /dev/null 2>&1 &', 'sh', "".concat($.plugin.root, "/bin/release"), logFile], { cwd: repo, env: { CLAUDECODE: '1' }, timeoutMs: 15000 })
                        .catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
            case 7:
                run = _a.sent();
                if (!(run.exitCode !== 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, dropGrants($, [grant])];
            case 8:
                _a.sent();
                return [2 /*return*/, stepLine($, one.id, 'Nothing was released: Claudopus could not start the release')];
            case 9: return [4 /*yield*/, log($, "release of ".concat(branch, " in ").concat(name, " started by Claudopus for ").concat(one.id))];
            case 10:
                _a.sent();
                timer = everyLoad($, STEP_LOOK, function () {
                    void (function () { return __awaiter(_this, void 0, void 0, function () {
                        var text, exit, isLate, tail;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    // Its end only: a release's whole log can be over the 4 MB the engine gives whole, and then its last line was never seen
                                    during('look at a release');
                                    return [4 /*yield*/, fileEnd($, logFile, 64000)];
                                case 1:
                                    text = _c.sent();
                                    exit = (_a = /claudopus-exit (\d+)\s*$/.exec(text)) === null || _a === void 0 ? void 0 : _a[1];
                                    return [4 /*yield*/, $.clock.now()];
                                case 2:
                                    isLate = (_c.sent()) - at > STEP_LONGEST;
                                    if (exit === undefined && !isLate)
                                        return [2 /*return*/];
                                    timer.cancel();
                                    tail = text.replace(/claudopus-exit \d+\s*$/, '').replace(/\s+$/, '').split('\n').slice(-CHAT_TAIL).join('\n');
                                    if (!(exit === '0')) return [3 /*break*/, 5];
                                    return [4 /*yield*/, stepLine($, one.id, "Released: ".concat(cut(oneLine((_b = tail.split('\n').at(-1)) !== null && _b !== void 0 ? _b : ''), 160)))];
                                case 3:
                                    _c.sent();
                                    return [4 /*yield*/, sayInChat($, named("Claudopus released \"".concat(titleOf(one), "\" on {name}'s go-ahead. Its last lines:\n").concat(tail)), "Released \"".concat(titleOf(one), "\"."))];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/];
                                case 5: return [4 /*yield*/, stepLine($, one.id, "The release ".concat(isLate ? 'has run 90 minutes' : "stopped (exit ".concat(exit, ")"), ": Claude is started again to look at it"))];
                                case 6:
                                    _c.sent();
                                    return [4 /*yield*/, toEnded($, one, one.id, isLate ? "".concat(wakeText, "\nClaudopus started the release itself after the go-ahead, and it has run 90 minutes without ending. It may still be running: look at its log, ").concat(logFile, ", and at what is running, before anything else; do not start a second release while it runs. Its last lines:\n").concat(tail) : "".concat(wakeText, "\nClaudopus ran the release itself after the go-ahead, and it failed with exit ").concat(exit, ". Its log is ").concat(logFile, "; its last lines:\n").concat(tail, "\nSort out what it needs (exit 2: merge main and keep what both sides meant; exit 3: a build or check failed), then run the release as your rules say."), { text: said, ask: ask.text, at: at, line: '', isCard: true, askAt: ask.at })];
                                case 7:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })().catch(function (err) { return log($, "release of ".concat(one.id, " not followed: ").concat(String(err))); });
                });
                return [2 /*return*/];
        }
    });
}); };
