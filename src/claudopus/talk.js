// A piece of work's own chat, read for its Details tab: what it was told, what it wrote, each tool step; and opening that tab
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
// A picture a step can make, by its name
var IMAGE = /\.(png|jpe?g|gif|webp|svg)$/i;
// The most picture files one command may name and still be taken to have made them
var SEEN_MOST = 4;
// The pictures one tool step made: a file it wrote or sent, and the picture files its command or output names or that it looked
// at, which count when made since the work began (a work looks at what it rendered)
var picturesOf = function (use) {
    var _a, _b;
    var input = (_a = use.input) !== null && _a !== void 0 ? _a : {};
    var given = function (key) { return (typeof input[key] === 'string' ? String(input[key]) : ''); };
    if (use.isError)
        return { pictures: [], seen: [] };
    // One file as /tmp and /private/tmp alike
    var same = function (path) { return path.replace(/^\/private(?=\/(tmp|var)\/)/, ''); };
    var sent = use.tool === 'SendUserFile' && Array.isArray(input.files) ? input.files.filter(function (one) { return typeof one === 'string'; }) : [];
    var written = ['Write', 'Edit'].includes(use.tool) ? [given('file_path')] : [];
    var named = use.tool === 'Bash' ? namedPaths("".concat(given('command'), "\n").concat((_b = use.text) !== null && _b !== void 0 ? _b : '')) : use.tool === 'Read' ? [given('file_path')] : [];
    // A command that lists a folder of pictures made none of them: past a few, it names none
    var seen = __spreadArray([], new Set(named.filter(function (one) { return IMAGE.test(one); }).map(same)), true);
    return { pictures: __spreadArray([], new Set(__spreadArray(__spreadArray([], written, true), sent, true).filter(function (one) { return IMAGE.test(one); }).map(same)), true), seen: seen.length > SEEN_MOST ? [] : seen };
};
// A tool's name as a person reads it: the last part of a connector's tool, in words
var toolName = function (tool) { var _a; return (tool.startsWith('mcp__') ? ((_a = tool.split('__').pop()) !== null && _a !== void 0 ? _a : tool).replaceAll('_', ' ') : tool); };
var fileName = function (path) { var _a; return (_a = path.split('/').pop()) !== null && _a !== void 0 ? _a : path; };
// What a tool step was for: the call's own description where it has one, else what it was pointed at
var aim = function (input) {
    var given = function (key) { return (typeof input[key] === 'string' ? String(input[key]) : ''); };
    var path = given('file_path') || given('path') || given('notebook_path');
    return given('description') || (path && fileName(path)) || given('pattern') || given('query') || given('url') || given('skill') || given('command') || given('prompt') || given('message') || '';
};
// One tool step as one short line. What the work wrote for the person through a tool is its own words, not a step
var stepOf = function (use) {
    var _a, _b;
    var input = (_a = use.input) !== null && _a !== void 0 ? _a : {};
    var given = function (key) { return (typeof input[key] === 'string' ? String(input[key]) : ''); };
    if (isTool(use.tool, 'note'))
        return { kind: 'said', text: given('text'), isUse: true };
    if (use.tool === 'SubagentHandback')
        return { kind: 'said', text: whole(given('message')), isUse: true };
    if (use.tool === 'Agent')
        return { kind: 'step', text: "Started a helper: ".concat(given('description') || 'no name'), isError: use.isError, isUse: true, tool: use.tool, name: given('description') };
    var file = given('file_path') || given('notebook_path');
    var text = isTool(use.tool, 'todo')
        ? "".concat((_b = { doing: 'Started on', done: 'Ticked', dropped: 'Dropped' }[given('state')]) !== null && _b !== void 0 ? _b : 'To-do', ": ").concat(given('item'))
        : given('description')
            ? oneLine(given('description'))
            : file
                ? "".concat(toolName(use.tool), " ").concat(fileName(file))
                : [toolName(use.tool), oneLine(aim(input))].filter(Boolean).join(': ');
    var _c = picturesOf(use), pictures = _c.pictures, seen = _c.seen;
    return __assign(__assign({ kind: 'step', text: text.length > STEP_CHARS ? "".concat(text.slice(0, STEP_CHARS), " \u2026") : text, isError: use.isError, isUse: true, tool: use.tool }, (pictures.length ? { pictures: pictures } : {})), (seen.length ? { seen: seen } : {}));
};
// The steps of an opened run as it lists them: helpers started one after another are one line, named by what their names share
var listed = function (steps) {
    return steps.reduce(function (all, line) {
        var _a, _b, _c, _d;
        var last = all.at(-1);
        if (line.tool !== 'Agent' || (last === null || last === void 0 ? void 0 : last.tool) !== 'Agent' || line.isError || last.isError)
            return __spreadArray(__spreadArray([], all, true), [__assign(__assign({}, line), { covers: line.name })], false);
        var names = __spreadArray(__spreadArray([], ((_a = last.covers) !== null && _a !== void 0 ? _a : '').split('\n'), true), [(_b = line.name) !== null && _b !== void 0 ? _b : ''], false);
        var first = (_c = names[0]) !== null && _c !== void 0 ? _c : '';
        var end = (_d = names.at(-1)) !== null && _d !== void 0 ? _d : '';
        var same = 0;
        while (same < first.length && names.every(function (name) { return name[same] === first[same]; }))
            same += 1;
        var text = same >= 6 ? "Started ".concat(names.length, " helpers: ").concat(first, " to ").concat(end.slice(same) || end) : "Started ".concat(names.length, " helpers: ").concat(names.slice(0, 3).join(', ')).concat(names.length > 3 ? " and ".concat(names.length - 3, " more") : '');
        return __spreadArray(__spreadArray([], all.slice(0, -1), true), [__assign(__assign({}, last), { text: text, covers: names.join('\n') })], false);
    }, []);
};
// A message as the chat draws it: whole, unless it is too long for one drawing
var whole = function (text) { return (text.length > SAID_CHARS ? "".concat(text.slice(0, SAID_CHARS), "\n\n\u2026") : text); };
// What the app adds around a message for the model alone is no part of the chat
var bare = function (text) {
    var _a;
    return whole(((_a = text.replace(/<system-reminder[^>]*>[\s\S]*?<\/system-reminder[^>]*>/g, '').split(workHead())[0]) !== null && _a !== void 0 ? _a : '')
        .replace(PANEL_RULE, '')
        .trim());
};
// The chat of a piece of work as lines. The rows the engine gives hold each message's text and its tool calls, and no thinking
var talkOf = function (rows) {
    return rows.flatMap(function (row) {
        var text = bare(row.text);
        var moved = row.role === 'user' ? MODEL_LINE.exec(text) : null;
        if (moved)
            return [{ kind: 'model', text: "".concat(MODEL_HEAD).concat(moved[1], " \u00B7 ").concat(moved[2]) }];
        if (row.role === 'user')
            return text ? [{ kind: 'told', text: text }] : [];
        return __spreadArray(__spreadArray([], (text ? [{ kind: 'said', text: text }] : []), true), row.toolUses.map(stepOf), true);
    });
};
// A run of tool steps in a few words, as the app's own chat folds one: "Ran 3 commands, read 2 files"
var folded = function (steps) {
    var count = function (tools) { return steps.filter(function (line) { var _a; return tools.includes((_a = line.tool) !== null && _a !== void 0 ? _a : ''); }).length; };
    var some = function (n, did, thing) { return (n ? "".concat(did, " ").concat(n, " ").concat(thing).concat(n === 1 ? '' : 's') : ''); };
    var known = ['Bash', 'Read', 'Edit', 'Write', 'NotebookEdit', 'Grep', 'Glob', 'Agent', "".concat(TOOLS, "todo"), "".concat(OLD_TOOLS, "todo")];
    var parts = [
        some(count(['Bash']), 'ran', 'command'),
        some(count(['Read']), 'read', 'file'),
        some(count(['Edit', 'Write', 'NotebookEdit']), 'edited', 'file'),
        some(count(['Grep', 'Glob']), 'made', 'search'),
        some(count(['Agent']), 'started', 'helper'),
        count(["".concat(TOOLS, "todo"), "".concat(OLD_TOOLS, "todo")]) ? 'updated its to-dos' : '',
        some(steps.filter(function (line) { var _a; return !known.includes((_a = line.tool) !== null && _a !== void 0 ? _a : ''); }).length, 'took', 'other step'),
        steps.some(function (line) { return line.isError; }) ? "".concat(steps.filter(function (line) { return line.isError; }).length, " failed") : '',
    ]
        .filter(Boolean)
        .join(', ');
    return "".concat(parts.charAt(0).toUpperCase()).concat(parts.slice(1));
};
// A message as it is compared: on one line, without quote marks or the app's own tags
var flat = function (text) { return oneLine(text.replace(/<\/?pasted_content[^>]*>/g, ' ')).replace(/["“”]/g, ''); };
// Each steer of the person's is shown once, in their words, where it arrived. One sent to work that had stopped is a message in the rows
// the engine gives: it takes that message's place. One sent to work under way is in no row: it goes before what the work did
// about it, its to-dos and the line it then wrote. One the work has written nothing since is last, and is waiting
var withSteers = function (lines, entries) {
    var all = __spreadArray([], lines, true);
    var from = 1;
    entries.forEach(function (entry, i) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (entry.kind !== 'steer')
            return;
        var text = oneLine(entry.text.replace(/<\/?pasted_content[^>]*>/g, ' '));
        var head = flat(text).slice(0, 40);
        var sent = all.findIndex(function (line, n) { var _a; return n > 0 && flat((_a = line.covers) !== null && _a !== void 0 ? _a : (line.kind === 'told' ? line.text : '')).includes(head); });
        if (sent >= 0) {
            var covers = (_d = (_b = (_a = all[sent]) === null || _a === void 0 ? void 0 : _a.covers) !== null && _b !== void 0 ? _b : (_c = all[sent]) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : '';
            var isFirst = ((_e = all[sent]) === null || _e === void 0 ? void 0 : _e.kind) === 'told';
            var at_1 = sent;
            while (!isFirst && ((_f = all[at_1 + 1]) === null || _f === void 0 ? void 0 : _f.covers) === covers)
                at_1 += 1;
            all.splice(isFirst ? sent : at_1 + 1, isFirst ? 1 : 0, { kind: 'steer', text: text, covers: covers });
            from = Math.max(from, at_1 + 1);
            return;
        }
        var later = entries.slice(i + 1).filter(function (one) { return one.kind !== 'steer'; }).map(function (one) { return one.text; });
        var at = all.findIndex(function (line, n) { return n >= from && line.kind === 'said' && later.includes(oneLine(line.text).slice(0, NOTE_CHARS)); });
        while (at > from && isTool((_g = all[at - 1]) === null || _g === void 0 ? void 0 : _g.tool, 'todo'))
            at -= 1;
        all.splice(at < 0 ? all.length : at, 0, { kind: 'steer', text: text, isWaiting: later.length === 0 });
        from = at < 0 ? all.length : at + 1;
    });
    return all;
};
// The newest lines of a chat that one drawing has room for
var newest = function (lines) {
    var room = TALK_CHARS;
    var from = lines.findLastIndex(function (line, i) { return i < lines.length - TALK_KEPT || (room -= line.text.length) < 0; });
    return lines.slice(from + 1);
};
// A piece of work's Details is a tab of its own, named after the work, beside the list, as a result is: closing it leaves the
// list as it was. A press on Details for work whose tab is open brings that tab to the front
var WORK_PANE = 'work-';
var workPaneOf = function (id) { return "".concat(WORK_PANE).concat(id.replace(/[^A-Za-z0-9_-]/g, '-')).slice(0, 64); };
var titleOf = function (one) { return one.title || quoted(one.words, 60) || 'Background work'; };
var openWork = function ($, id) {
    presses += 1;
    void (function () { return __awaiter(_this, void 0, void 0, function () {
        var one, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = [[]];
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    _b = [__spreadArray.apply(void 0, _a.concat([(_d.sent()), true]))];
                    _c = cardsOf;
                    return [4 /*yield*/, read($, others)];
                case 2:
                    one = __spreadArray.apply(void 0, _b.concat([_c.apply(void 0, [_d.sent()]), true])).find(function (card) { return card.id === id; });
                    if (!one)
                        return [2 /*return*/];
                    return [4 /*yield*/, $.ui.panes()];
                case 3:
                    // A tab opened afresh starts folded; one already open keeps what was unfolded in it
                    if (!(_d.sent()).some(function (pane) { return pane.id === workPaneOf(id); }))
                        folds.delete(id);
                    return [4 /*yield*/, front($, workPaneOf(id), cut(titleOf(one), 30))
                        // The pressed card's button gets a new name, so the app does not hold the list where that button was
                    ];
                case 4:
                    _d.sent();
                    // The pressed card's button gets a new name, so the app does not hold the list where that button was
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })().catch(function (err) { return log($, "details of ".concat(id, " not opened: ").concat(String(err))); });
};
