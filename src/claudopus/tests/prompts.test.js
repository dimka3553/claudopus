// Claude Code's own prompts and the commands it blocked, each asked as one Permission block
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
var AMBER = '#E5A50A';
var BLOCKED = 'Claude Code blocked this command. Run it anyway?';
// Allow or Don't allow on this chat's own prompt: its key is prompt-this-<the prompt's id>-yes|no-<the count of presses>
var promptButton = function (pane, said) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return new RegExp("^prompt-this-.+-".concat(said, "-\\d+$")).test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
    }
}); }); };
var textsOf = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
    }
}); }); };
var labelsOf = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.props.label) !== null && _a !== void 0 ? _a : ''); })
            // The grey lines that say what was pressed, each with how it is drawn
        ];
    }
}); }); };
// The grey lines that say what was pressed, each with how it is drawn
var pressedLines = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : '').startsWith('✓ You pressed'); })
            // A held call's answer, which must come with the press alone: no second let go by wake(), no move of the clock
        ];
    }
}); }); };
// A held call's answer, which must come with the press alone: no second let go by wake(), no move of the clock
var answered = function (call) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, Promise.race([call, new Promise(function (resolve) { return setTimeout(function () { return resolve('still held'); }, 10000); })])];
}); }); };
test("this chat waiting on Claude Code's own prompt is listed with its prompt, and idle chats beside it are not", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, idle, list, _b, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] });
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(idle, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } });
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this command?' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: 'Clear the build folder' })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Quiet one' })];
            case 6:
                _d.apply(void 0, [_f.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, keyed(list, 'quiet-fold')];
            case 7:
                _e.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder' })];
            case 8:
                _f.sent();
                return [4 /*yield*/, list.unmount()];
            case 9:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a prompt for a task's call is a Permission block on that task's card, amber and counted once, in its file with only what the others may read, said aloud once, and gone as the call ends; the chat's own question is at the top as this chat's", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, notified, asked, list, question, _b, _c, _d, _e, _f, _g, _h, texts, _j, _k, shared, _l, _m, _o, _p, _q, _r, _s, _t;
    var _this = this;
    var _u, _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, notified = _a.notified;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _x.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })];
            case 2:
                _x.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Clean the build', prompt: 'clean up the build' }))
                    // The task's call raises Claude Code's prompt: the mod holds it for a press, and answered in Claude Code's own box it passes on untouched
                ];
            case 3:
                _x.sent();
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // The one block: its kind, the question in amber and bold, what it is for, the command whole, Allow and Don't allow
                ];
            case 4:
                list = _x.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this command?' })];
                    }); }); })];
            case 5:
                question = _x.sent();
                expect([question === null || question === void 0 ? void 0 : question.props.color, question === null || question === void 0 ? void 0 : question.props.bold]).toEqual([AMBER, true]);
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 6:
                _b.apply(void 0, [_x.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: 'Clear the build folder' })];
            case 7:
                _c.apply(void 0, [_x.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'rm -rf build' })];
            case 8:
                _d.apply(void 0, [_x.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'yes')];
                    }); }); })];
            case 9:
                _f = [(_u = (_x.sent())) === null || _u === void 0 ? void 0 : _u.props.label];
                return [4 /*yield*/, promptButton(list, 'no')];
            case 10:
                _e.apply(void 0, [_f.concat([(_v = (_x.sent())) === null || _v === void 0 ? void 0 : _v.props.label])]).toEqual(['Allow', "Don't allow"]);
                // Nothing sends the person elsewhere to answer it, and none of the old words is left
                _g = expect;
                return [4 /*yield*/, textsOf(list)];
            case 11:
                // Nothing sends the person elsewhere to answer it, and none of the old words is left
                _g.apply(void 0, [(_x.sent()).filter(function (one) { return /box at the bottom of this chat|^Needs your permission$|^Yes: |^No: /.test(one); })]).toEqual([]);
                _h = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 12:
                _h.apply(void 0, [(_x.sent()).filter(function (one) { return /^(Yes|No|Allow once|Deny|Run it)$/.test(one); })]).toEqual([]);
                return [4 /*yield*/, textsOf(list)];
            case 13:
                texts = _x.sent();
                expect(texts.indexOf('Clean the build')).toBeGreaterThan(-1);
                expect(texts.indexOf('Clean the build')).toBeLessThan(texts.indexOf('Run this command?'));
                expect(texts.filter(function (one) { return one === 'Clean the build'; })).toHaveLength(1);
                expect(texts.filter(function (one) { return one === 'Run this command?'; })).toHaveLength(1);
                expect(texts.filter(function (one) { return one.startsWith('Permission ·'); })).toEqual([]);
                // That card waits for the person: its edge is amber, and the head line counts it once
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^1 waiting for you/ })];
                    }); }); })];
            case 14:
                // That card waits for the person: its edge is amber, and the head line counts it once
                _j.apply(void 0, [_x.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 15:
                _k.apply(void 0, [(_x.sent()).filter(function (one) { var _a; return !((_a = one.key) === null || _a === void 0 ? void 0 : _a.startsWith('outline-')) && one.props.backgroundColor === AMBER; })]).toHaveLength(1);
                // The others see it in this chat's file, with the task it came from and nothing of the call beyond what the block shows
                return [4 /*yield*/, clock.advance(1000)];
            case 16:
                // The others see it in this chat's file, with the task it came from and nothing of the call beyond what the block shows
                _x.sent();
                shared = function () { var _a; return JSON.parse((_a = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _a !== void 0 ? _a : '{}'); };
                expect(shared().prompts).toEqual([{ id: expect.any(String), text: 'Run this command?', title: 'Clean the build', at: expect.any(Number), kind: 'allow', about: 'Clear the build folder', detail: 'rm -rf build', isHeld: true }]);
                // Not told before the app itself says the prompt is still waiting; then told once, as a question is
                return [4 /*yield*/, clock.advance(5000)];
            case 17:
                // Not told before the app itself says the prompt is still waiting; then told once, as a question is
                _x.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toEqual([]);
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 18:
                _x.sent();
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 19:
                _x.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toEqual(['Clean the build has a question for you | Run this command?']);
                // Answered in Claude Code's own box, the call runs and ends: the held request gives no answer of the mod's, and the block goes,
                // here and in the file, with nothing said of a press nobody made
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' })];
            case 20:
                // Answered in Claude Code's own box, the call runs and ends: the held request gives no answer of the mod's, and the block goes,
                // here and in the file, with nothing said of a press nobody made
                _x.sent();
                _l = expect;
                return [4 /*yield*/, answered(asked)];
            case 21:
                _l.apply(void 0, [(_w = ((_x.sent()))) === null || _w === void 0 ? void 0 : _w.decision]).toBeUndefined();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this command?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 22:
                _m.apply(void 0, [_x.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, promptButton(list, 'yes')];
            case 23:
                _o.apply(void 0, [_x.sent()]).toBeUndefined();
                _p = expect;
                return [4 /*yield*/, textsOf(list)];
            case 24:
                _p.apply(void 0, [(_x.sent()).filter(function (one) { return /^✓ You pressed|You allowed it|You said no/.test(one); })]).toEqual([]);
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /waiting for you/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 25:
                _q.apply(void 0, [_x.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(1000)];
            case 26:
                _x.sent();
                expect([shared().prompts, shared().answeredPrompts]).toEqual([undefined, undefined]);
                // The chat's own question is answered in Claude Code's box: at the top as this chat's, with where to answer and nothing to press;
                // answered at once, it is not told
                return [4 /*yield*/, $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } })];
            case 27:
                // The chat's own question is answered in Claude Code's box: at the top as this chat's, with where to answer and nothing to press;
                // answered at once, it is not told
                _x.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which colour for the nose?' })];
                    }); }); })];
            case 28:
                _r.apply(void 0, [_x.sent()]).toBeDefined();
                _s = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Question · This chat' })];
            case 29:
                _s.apply(void 0, [_x.sent()]).toBeDefined();
                _t = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })];
            case 30:
                _t.apply(void 0, [_x.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] })];
            case 31:
                _x.sent();
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 32:
                _x.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toHaveLength(1);
                return [4 /*yield*/, list.unmount()];
            case 33:
                _x.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, asked, list, _b, _c, _d, _e, _f, _g, _h;
    var _this = this;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)
                    // The same command already running elsewhere, as in a terminal, says nothing of this call
                ];
            case 1:
                _k.sent();
                // The same command already running elsewhere, as in a terminal, says nothing of this call
                files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n");
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _k.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this command?' })];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission · This chat' })];
            case 4:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(2000)];
            case 5:
                _k.sent();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this command?' })];
            case 6:
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n");
                return [4 /*yield*/, clock.advance(2000)
                    // Seen running, it was allowed in Claude Code's own box: the block goes, the held request gives no answer of the mod's, and
                    // nothing says a press was made here
                ];
            case 7:
                _k.sent();
                // Seen running, it was allowed in Claude Code's own box: the block goes, the held request gives no answer of the mod's, and
                // nothing says a press was made here
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this command?' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 8:
                // Seen running, it was allowed in Claude Code's own box: the block goes, the held request gives no answer of the mod's, and
                // nothing says a press was made here
                _e.apply(void 0, [_k.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, answered(asked)];
            case 9:
                _f.apply(void 0, [(_j = ((_k.sent()))) === null || _j === void 0 ? void 0 : _j.decision]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, textsOf(list)];
            case 10:
                _g.apply(void 0, [(_k.sent()).filter(function (one) { return /^✓ You pressed|You allowed it/.test(one); })]).toEqual([]);
                // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
                files.set('settings:allow', '1');
                return [4 /*yield*/, $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } })];
            case 11:
                _k.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 12:
                _k.sent();
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Write the file notes.md?' })];
            case 13:
                _h.apply(void 0, [_k.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 14:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's open prompt shows amber with that chat's name and nothing to allow it with, before the chats that only work; on this Mac a press opens that chat, on another Mac it says where", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, asks, waiting, remote, list, _b, _c, _d, _e, _f, bold, questions, _g, _h, opens, _j, _k, _l, _m, _o, _p;
    var _q;
    var _this = this;
    var _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, shown = _a.shown;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                asks = 'Run this command?';
                waiting = function (at, chat, title, link) { return JSON.stringify({ chat: chat, title: title, folder: '/Users/sam/GitHub', host: '', at: at, cards: [], prompts: [{ id: 'toolu_1', text: asks, title: 'Interesting facts', kind: 'allow', about: 'Cross-repo duplicate files', at: at, isHeld: true }], link: link }); };
                remote = JSON.stringify(__assign(__assign({}, JSON.parse(waiting(NOW, 'chat-rc', 'M4 Remote', ''))), { link: { bridge: 'session_01M4Remote', app: 'local_m4-rc' } }));
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(waiting(NOW, 'chat-m4', 'M4 GitHub', 'claude://code/continue?session=local_m4'), "\n---claudopus-live---\n").concat(remote, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                // A chat of this Mac with no work but an open prompt is listed; a link that is not the app's own is dropped
                files.set("".concat(MEMORY, "/live/chat-w.json"), waiting(NOW, 'chat-w', 'Web chat', 'claude://code/continue?session=local_ab-12'));
                files.set("".concat(MEMORY, "/live/chat-x.json"), waiting(NOW, 'chat-x', 'Odd chat', 'https://example.com'));
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _v.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // Each says whose it is and where it is answered: in that chat, named, on its Mac
                ];
            case 3:
                list = _v.sent();
                // Each says whose it is and where it is answered: in that chat, named, on its Mac
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Answer it in the chat “M4 GitHub”, on m4.' })];
                    }); }); })];
            case 4:
                // Each says whose it is and where it is answered: in that chat, named, on its Mac
                _b.apply(void 0, [_v.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in the chat “M4 Remote”, which runs on m4.' })];
            case 5:
                _c.apply(void 0, [_v.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in the chat “Web chat”.' })];
            case 6:
                _d.apply(void 0, [_v.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in the chat “Odd chat”.' })];
            case 7:
                _e.apply(void 0, [_v.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, textsOf(list)];
            case 8:
                _f.apply(void 0, [(_v.sent()).filter(function (one) { return one === 'Permission · Interesting facts'; })]).toHaveLength(4);
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 9:
                bold = (_v.sent()).filter(function (one) { return one.props.bold; });
                questions = bold.filter(function (one) { return one.text === asks; });
                expect(questions.map(function (one) { return one.props.color; })).toEqual([AMBER, AMBER, AMBER, AMBER]);
                expect(bold.map(function (one) { return one.text; }).lastIndexOf(asks)).toBeLessThan(bold.map(function (one) { return one.text; }).indexOf('Billing page'));
                // No press here answers another chat's prompt: no Allow, no Don't allow
                _g = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 10:
                // No press here answers another chat's prompt: no Allow, no Don't allow
                _g.apply(void 0, [(_v.sent()).filter(function (one) { return /^(Allow|Don't allow|Yes|No)$/.test(one); })]).toEqual([]);
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 11:
                _h.apply(void 0, [(_v.sent()).filter(function (one) { var _a; return /^prompt-.*-(yes|no)-\d+$/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })]).toEqual([]);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 12:
                opens = (_v.sent()).filter(function (one) { return one.props.label === 'Open chat'; });
                expect(opens).toHaveLength(2);
                return [4 /*yield*/, list.press({ key: (_s = (_r = opens.find(function (one) { return String(one.key).includes('chat-rc'); })) === null || _r === void 0 ? void 0 : _r.key) !== null && _s !== void 0 ? _s : '' })];
            case 13:
                _v.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { var _a; return (_a = argv[1]) === null || _a === void 0 ? void 0 : _a.startsWith('claude://'); })];
                    }); }); })];
            case 14:
                _j.apply(void 0, [_v.sent()]).toEqual(['open', 'claude://code/session_01M4Remote']);
                _l = (_k = list).press;
                _q = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 15: return [4 /*yield*/, _l.apply(_k, [(_q.key = (_u = (_t = (_v.sent()).find(function (one) { return one.props.label === 'Open chat' && String(one.key).includes('chat-w'); })) === null || _t === void 0 ? void 0 : _t.key) !== null && _u !== void 0 ? _u : '', _q)])];
            case 16:
                _v.sent();
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { var _a; return (_a = argv[1]) === null || _a === void 0 ? void 0 : _a.includes('local_ab-12'); })];
                    }); }); })];
            case 17:
                _m.apply(void 0, [_v.sent()]).toEqual(['open', 'claude://code/continue?session=local_ab-12']);
                // Answered there, its file no longer carries it, and its block leaves; with nothing going on, its chat is named no more
                files.set("".concat(MEMORY, "/live/chat-w.json"), JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11000, cards: [] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 18:
                _v.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one.props.label === 'Open chat' && String(one.key).includes('chat-w'); }) ? undefined : true)];
                        }
                    }); }); })];
            case 19:
                _o.apply(void 0, [_v.sent()]).toBe(true);
                _p = expect;
                return [4 /*yield*/, textsOf(list)];
            case 20:
                _p.apply(void 0, [(_v.sent()).filter(function (one) { return one.includes('Web chat'); })]).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 21:
                _v.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a message the chat passes to a task is asked with that task's name and the message whole, never a tool's own name; answered in Claude Code's own box, refused, allowed or interrupted, its block goes as the call ends with nothing said of a press", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, list, message, gone, first, _a, _b, _c, _d, _e, _f, _loop_1, _i, _g, _h, tool, input, laid, asks, agent;
    var _this = this;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the cards', wait: false, origin: composer })];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the panel cards', prompt: 'fix the cards' }))];
            case 3:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _m.sent();
                message = 'Send this message to the task “Fix the panel cards”?';
                gone = function (text) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, list.find({ type: 'Text', text: text })];
                                    case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                                }
                            }); }); })];
                    });
                }); };
                first = $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'Make the buttons bigger too' } });
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: message })];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_m.sent()]).toBeDefined();
                // The chat's own call: at the top as this chat's, the message whole in the block
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission · This chat' })];
            case 6:
                // The chat's own call: at the top as this chat's, the message whole in the block
                _b.apply(void 0, [_m.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Make the buttons bigger too' })];
            case 7:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, promptButton(list, 'yes')];
            case 8:
                _e = [(_j = (_m.sent())) === null || _j === void 0 ? void 0 : _j.props.label];
                return [4 /*yield*/, promptButton(list, 'no')];
            case 9:
                _d.apply(void 0, [_e.concat([(_k = (_m.sent())) === null || _k === void 0 ? void 0 : _k.props.label])]).toEqual(['Allow', "Don't allow"]);
                // No tool's own name anywhere on it
                _f = expect;
                return [4 /*yield*/, textsOf(list)];
            case 10:
                // No tool's own name anywhere on it
                _f.apply(void 0, [(_m.sent()).some(function (one) { return one.includes('SendMessage'); })]).toBe(false);
                _loop_1 = function (tool, input, laid, asks, agent) {
                    var held, _o, _p, _q, _r, _s;
                    return __generator(this, function (_t) {
                        switch (_t.label) {
                            case 0:
                                held = tool === 'SendMessage' && laid === 'refuse' ? first : $.classic.PermissionRequest(__assign({ tool_name: tool, tool_input: input }, (agent ? { agent_id: agent } : {})));
                                _o = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: asks })];
                                    }); }); })];
                            case 1:
                                _o.apply(void 0, [_t.sent()]).toBeDefined();
                                if (laid)
                                    files.set(laid, tool);
                                return [4 /*yield*/, $.tool.call(__assign(__assign({ tool: tool }, input), (agent ? { agentId: agent } : {})))];
                            case 2:
                                _t.sent();
                                if (laid)
                                    files.delete(laid);
                                _p = expect;
                                _q = [tool, laid];
                                return [4 /*yield*/, answered(held)];
                            case 3:
                                _p.apply(void 0, [_q.concat([(_l = ((_t.sent()))) === null || _l === void 0 ? void 0 : _l.decision])]).toEqual([tool, laid, undefined]);
                                _r = expect;
                                return [4 /*yield*/, gone(asks)];
                            case 4:
                                _r.apply(void 0, [_t.sent()]).toBe(true);
                                _s = expect;
                                return [4 /*yield*/, textsOf(list)];
                            case 5:
                                _s.apply(void 0, [(_t.sent()).filter(function (one) { return /^✓ You pressed|You allowed it|You said no|It ended before you answered/.test(one); })]).toEqual([]);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _g = [
                    ['SendMessage', { to: 'a1', message: 'Make the buttons bigger too' }, 'refuse', message, undefined],
                    ['SendMessage', { to: 'a1', message: 'One more thing' }, '', message, undefined],
                    ['Bash', { command: 'make clean', description: 'Clean up' }, 'interrupt', 'Run this command?', 'a1'],
                ];
                _m.label = 11;
            case 11:
                if (!(_i < _g.length)) return [3 /*break*/, 14];
                _h = _g[_i], tool = _h[0], input = _h[1], laid = _h[2], asks = _h[3], agent = _h[4];
                return [5 /*yield**/, _loop_1(tool, input, laid, asks, agent)];
            case 12:
                _m.sent();
                _m.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 11];
            case 14: return [4 /*yield*/, list.unmount()];
            case 15:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's prompt shows with its task's name, or with none as that chat's own, never as this chat's; an answer an older version's file still lists is not shown", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, list, _b, _c, _d, texts;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                files.set("".concat(MEMORY, "/live/chat-o.json"), JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW }, { id: 'toolu_7', text: 'Open a web page on example.com?', title: 'Tidy', kind: 'allow', at: NOW + 1 }], answeredPrompts: [{ id: 'toolu_8', text: 'Send this message to the task “Tidy”?', title: 'Tidy', kind: 'allow', answered: 'yes', done: 'it was sent', at: NOW, endedAt: NOW }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run this command?' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Markdown', text: 'Count files' })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Open a web page on example.com?' })];
            case 6:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, textsOf(list)];
            case 7:
                texts = _e.sent();
                expect(texts.filter(function (one) { return /^Permission/.test(one); })).toEqual(['Permission', 'Permission · Tidy']);
                expect(texts.filter(function (one) { return one === 'Answer it in the chat “Other chat”.'; })).toHaveLength(2);
                expect(texts.filter(function (one) { return /Send this message|You allowed it|it was sent/.test(one); })).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Allow on a prompt's block allows the call as Claude Code's own box would, on the press alone: the block goes at once and one grey line says what was pressed", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, asked, key, _a, _b, _c, _d, lines, _e, _f, _g, input, started, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var _s;
    var _this = this;
    var _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _v.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _v.sent();
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } });
                _a = String;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'yes')];
                    }); }); })];
            case 3:
                key = _a.apply(void 0, [(_t = (_v.sent())) === null || _t === void 0 ? void 0 : _t.key]);
                // Pressed twice at once, as a double click: one answer. The held request ends with the press, with no second gone by
                return [4 /*yield*/, Promise.all([list.press({ key: key }), list.press({ key: key }).catch(function () { return undefined; })])];
            case 4:
                // Pressed twice at once, as a double click: one answer. The held request ends with the press, with no second gone by
                _v.sent();
                _b = expect;
                return [4 /*yield*/, answered(asked)];
            case 5:
                _b.apply(void 0, [(_v.sent()).decision]).toEqual({ behavior: 'allow' });
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, promptButton(list, 'yes')];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 6:
                _c.apply(void 0, [_v.sent()]).toBe(true);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this command?' })];
            case 7:
                _d.apply(void 0, [_v.sent()]).toBeUndefined();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pressedLines(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? pressedLines(list) : undefined)];
                        }
                    }); }); })];
            case 8:
                lines = _v.sent();
                expect(lines === null || lines === void 0 ? void 0 : lines.map(function (one) { return [one.text, one.props.dimColor, one.props.color]; })).toEqual([['✓ You pressed “Allow”', true, undefined]]);
                // The call runs and ends: nothing more is said of it
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'npm test', description: 'Run the tests' })];
            case 9:
                // The call runs and ends: nothing more is said of it
                _v.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 10:
                _v.sent();
                _e = expect;
                return [4 /*yield*/, pressedLines(list)];
            case 11:
                _e.apply(void 0, [(_v.sent()).map(function (one) { return one.text; })]).toEqual(['✓ You pressed “Allow”']);
                _f = expect;
                return [4 /*yield*/, textsOf(list)];
            case 12:
                _f.apply(void 0, [(_v.sent()).filter(function (one) { return /You allowed it|it ran|running now/.test(one); })]).toEqual([]);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 13:
                _g.apply(void 0, [(_v.sent()).filter(function (one) { return one.props.color === '#26A269' || one.props.color === AMBER; }).map(function (one) { return one.text; })]).toEqual([]);
                input = { description: 'Show scan numbers', prompt: 'show the scan numbers', run_in_background: true };
                started = $.classic.PermissionRequest({ tool_name: 'Agent', tool_input: input });
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' })];
                    }); }); })];
            case 14:
                _h.apply(void 0, [_v.sent()]).toBeDefined();
                _k = (_j = list).press;
                _s = {};
                _l = String;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'yes')];
                    }); }); })];
            case 15: return [4 /*yield*/, _k.apply(_j, [(_s.key = _l.apply(void 0, [(_u = (_v.sent())) === null || _u === void 0 ? void 0 : _u.key]), _s)])];
            case 16:
                _v.sent();
                _m = expect;
                return [4 /*yield*/, answered(started)];
            case 17:
                _m.apply(void 0, [(_v.sent()).decision]).toEqual({ behavior: 'allow' });
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Agent' }, input))];
            case 18:
                _v.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Show scan numbers', prompt: 'show the scan numbers' }))];
            case 19:
                _v.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 20:
                _v.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Show scan numbers' })];
                    }); }); })];
            case 21:
                _o.apply(void 0, [_v.sent()]).toBeDefined();
                _p = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Start the task “Show scan numbers”?' })];
            case 22:
                _p.apply(void 0, [_v.sent()]).toBeUndefined();
                _q = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /waiting for you/ })];
            case 23:
                _q.apply(void 0, [_v.sent()]).toBeUndefined();
                _r = expect;
                return [4 /*yield*/, promptButton(list, 'yes')];
            case 24:
                _r.apply(void 0, [_v.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 25:
                _v.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Don't allow on a prompt's block refuses the call on the press alone: the chat's own turn stops, and a task is told and carries on; one grey line says it, at the top for the chat's and on the task's card for its own", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var list, said, own, _a, _b, _c, _d, _e, _f, before, work, _g, _h, _j, _k, decision, _l, after, _m;
    var _o, _p;
    var _this = this;
    var _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _t.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'tidy up', wait: false, origin: composer })];
            case 2:
                _t.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Tidy the repo', prompt: 'tidy up' }))];
            case 3:
                _t.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _t.sent();
                said = "✓ You pressed “Don't allow”";
                own = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf dist', description: 'Delete the build' } });
                _b = (_a = list).press;
                _o = {};
                _c = String;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'no')];
                    }); }); })];
            case 5: return [4 /*yield*/, _b.apply(_a, [(_o.key = _c.apply(void 0, [(_q = (_t.sent())) === null || _q === void 0 ? void 0 : _q.key]), _o)])];
            case 6:
                _t.sent();
                _d = expect;
                return [4 /*yield*/, answered(own)];
            case 7:
                _d.apply(void 0, [(_t.sent()).decision]).toEqual({ behavior: 'deny', message: expect.stringContaining("pressed Don't allow"), interrupt: true });
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, promptButton(list, 'no')];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 8:
                _e.apply(void 0, [_t.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pressedLines(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? pressedLines(list) : undefined)];
                        }
                    }); }); })];
            case 9:
                _f.apply(void 0, [(_r = (_t.sent())) === null || _r === void 0 ? void 0 : _r.map(function (one) { return [one.text, one.props.dimColor]; })]).toEqual([[said, true]]);
                return [4 /*yield*/, textsOf(list)];
            case 10:
                before = _t.sent();
                expect(before.indexOf(said)).toBeLessThan(before.indexOf('Tidy the repo'));
                work = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'git clean -fd', description: 'Clean the tree' }, agent_id: 'a1' });
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Markdown', text: 'Clean the tree' })];
                    }); }); })];
            case 11:
                _g.apply(void 0, [_t.sent()]).toBeDefined();
                _j = (_h = list).press;
                _p = {};
                _k = String;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'no')];
                    }); }); })];
            case 12: return [4 /*yield*/, _j.apply(_h, [(_p.key = _k.apply(void 0, [(_s = (_t.sent())) === null || _s === void 0 ? void 0 : _s.key]), _p)])];
            case 13:
                _t.sent();
                return [4 /*yield*/, answered(work)];
            case 14:
                decision = (_t.sent()).decision;
                expect([decision === null || decision === void 0 ? void 0 : decision.behavior, decision === null || decision === void 0 ? void 0 : decision.interrupt]).toEqual(['deny', undefined]);
                expect(decision === null || decision === void 0 ? void 0 : decision.message).toContain('continue without it');
                _l = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pressedLines(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).length === 2 ? true : undefined)];
                        }
                    }); }); })];
            case 15:
                _l.apply(void 0, [_t.sent()]).toBe(true);
                return [4 /*yield*/, textsOf(list)];
            case 16:
                after = _t.sent();
                expect(after.lastIndexOf(said)).toBeGreaterThan(after.indexOf('Tidy the repo'));
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this command?' })];
            case 17:
                _m.apply(void 0, [_t.sent()]).toBeUndefined();
                expect(after.filter(function (one) { return /You said no|told Claude|waiting for what you say next/.test(one); })).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 18:
                _t.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Claude Code's own question or plan has nothing to press on its block: it says where to answer it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var list, _loop_2, _i, _a, _b, tool, input, asks, where;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _c.sent();
                _loop_2 = function (tool, input, asks, where) {
                    var r, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, answered($.classic.PermissionRequest({ tool_name: tool, tool_input: input }))];
                            case 1:
                                r = _j.sent();
                                expect([tool, r === null || r === void 0 ? void 0 : r.decision]).toEqual([tool, undefined]);
                                _d = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: asks })];
                                    }); }); })];
                            case 2:
                                _d.apply(void 0, [_j.sent()]).toBeDefined();
                                _e = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Question · This chat' })];
                            case 3:
                                _e.apply(void 0, [_j.sent()]).toBeDefined();
                                _f = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: where })];
                            case 4:
                                _f.apply(void 0, [_j.sent()]).toBeDefined();
                                _g = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 5:
                                _g.apply(void 0, [(_j.sent()).filter(function (one) { var _a; return String((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('prompt-'); })]).toEqual([]);
                                return [4 /*yield*/, $.tool.call(__assign({ tool: tool }, input))];
                            case 6:
                                _j.sent();
                                _h = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: asks })];
                                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                                        }
                                    }); }); })];
                            case 7:
                                _h.apply(void 0, [_j.sent()]).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = [
                    ['AskUserQuestion', { questions: [{ question: 'Which colour?' }] }, 'Which colour?', 'Pick your answer in the box at the bottom of this chat.'],
                    ['ExitPlanMode', { plan: 'First the nose, then the ears.' }, 'Approve this plan?', 'Answer it in the box at the bottom of this chat.'],
                ];
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                _b = _a[_i], tool = _b[0], input = _b[1], asks = _b[2], where = _b[3];
                return [5 /*yield**/, _loop_2(tool, input, asks, where)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, list.unmount()];
            case 7:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's held prompt has no Allow or Don't allow here, only where to answer it; an answer a file leaves for this chat's own prompt answers nothing", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, wake, list, _b, _c, _d, settled, asked, allow, id, _i, _e, _f, n, choice, _g, _h, _j, _k;
    var _l;
    var _this = this;
    var _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, wake = _a.wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _q.sent();
                files.set("".concat(MEMORY, "/live/chat-o.json"), JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run this command?', kind: 'allow', about: 'Count files', at: NOW, isHeld: true }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _q.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _q.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Markdown', text: 'Count files' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_q.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 5:
                _c.apply(void 0, [(_q.sent()).filter(function (one) { var _a; return String((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('prompt-'); })]).toEqual([]);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in the chat “Other chat”.' })];
            case 6:
                _d.apply(void 0, [_q.sent()]).toBeDefined();
                settled = false;
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make', description: 'Build it' } }).then(function (r) { return ((settled = true), r); });
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, promptButton(list, 'yes')];
                    }); }); })];
            case 7:
                allow = _q.sent();
                id = String((_m = allow === null || allow === void 0 ? void 0 : allow.key) !== null && _m !== void 0 ? _m : '').replace(/^prompt-this-/, '').replace(/-yes-\d+$/, '');
                expect(id).not.toBe('');
                for (_i = 0, _e = ['yes', 'Allow', 'allow'].entries(); _i < _e.length; _i++) {
                    _f = _e[_i], n = _f[0], choice = _f[1];
                    files.set("".concat(MEMORY, "/live/answers/engine-id/").concat(n, "-a.json"), JSON.stringify({ card: "prompt:".concat(id), choice: choice, isReply: false, ask: 'Run this command?', askAt: NOW, at: NOW + 6000 }));
                }
                return [4 /*yield*/, clock.advance(5000)];
            case 8:
                _q.sent();
                wake();
                return [4 /*yield*/, clock.advance(1000)];
            case 9:
                _q.sent();
                wake();
                expect(settled).toBe(false);
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.includes('/live/answers/engine-id/'); })).toEqual([]);
                expect(((_o = files.get("".concat(MEMORY, "/log.md"))) !== null && _o !== void 0 ? _o : '')).toContain('left in a file put away unread');
                _h = (_g = list).press;
                _l = {};
                _j = String;
                return [4 /*yield*/, promptButton(list, 'yes')];
            case 10: 
            // Its own Allow, pressed in this chat's panel, still answers it
            return [4 /*yield*/, _h.apply(_g, [(_l.key = _j.apply(void 0, [(_p = (_q.sent())) === null || _p === void 0 ? void 0 : _p.key]), _l)])];
            case 11:
                // Its own Allow, pressed in this chat's panel, still answers it
                _q.sent();
                _k = expect;
                return [4 /*yield*/, answered(asked)];
            case 12:
                _k.apply(void 0, [(_q.sent()).decision]).toEqual({ behavior: 'allow' });
                return [4 /*yield*/, list.unmount()];
            case 13:
                _q.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a call Claude Code refuses a background task with no prompt, as auto mode does, asks nothing when it is no command the person could run: nothing waits on the card and the task is told nothing more; a failing call whose output only holds those words is no refusal; a blocked command never replaces a question already on the card; Don't allow tells the task to carry on without it and never to reach it by other means, and pressed once the task has ended it does not start it again; and Claudopus never lets the call through itself", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, ended, _a, files, clock, resumed, appended, pressRuns, logLines, list, mine, call, _b, _c, _d, _e, texts, _f, _g, check, _h, _j, _k, _l, deny, _m, _o, _p, told, _q, _r, _s, _t, _u, before, _v;
    var _this = this;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                agents = { a1: 'running' };
                ended = new Set();
                _a = world(on, { agents: agents, ended: ended }), files = _a.files, clock = _a.clock, resumed = _a.resumed, appended = _a.appended, pressRuns = _a.pressRuns;
                // Beneath the mod the engine would put each of the checks below to its mode, which settles the ask; the refused calls are Claude
                // Code's own to refuse, with no prompt
                on('tool.check', function (_, e, next) { return (String(e.tool_use_id).startsWith('chk') ? { decision: 'ask' } : next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _w.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'write the notes', wait: false, origin: composer })];
            case 2:
                _w.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Write the notes', prompt: 'write the notes' }))];
            case 3:
                _w.sent();
                logLines = function (words) { var _a; return ((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').split('\n').filter(function (line) { return line.includes(words); }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _w.sent();
                mine = function () { return __spreadArray(__spreadArray([], appended, true), resumed, true).filter(function (one) { return one.startsWith('a1: '); }); };
                // A search that fails, whose output holds Claude Code's words, is no refusal
                files.set('fails', "notes.md: Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access].");
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'grep -r denied notes.md # fails', tool_use_id: 'g1' })];
            case 5:
                _w.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 6:
                _w.sent();
                expect(logLines('refusal of ')).toEqual([]);
                call = { tool: 'Edit', agentId: 'a1', file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' };
                files.set('auto-refuse', 'Edit');
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, call), { tool_use_id: 'e1' }))];
            case 7:
                _w.sent();
                files.delete('auto-refuse');
                return [4 /*yield*/, clock.advance(1000)];
            case 8:
                _w.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (logLines('refusal of Edit for a1: nothing the person could run, so nothing is asked').length ? true : undefined)];
                    }); }); })];
            case 9:
                _b.apply(void 0, [_w.sent()]).toBe(true);
                _c = expect;
                _d = ['its card is shown'];
                _e = Boolean;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.key === 'stop-a1'; })];
                        }
                    }); }); })];
            case 10:
                _c.apply(void 0, [_d.concat([_e.apply(void 0, [_w.sent()])])]).toEqual(['its card is shown', true]);
                return [4 /*yield*/, textsOf(list)];
            case 11:
                texts = _w.sent();
                expect(texts.filter(function (one) { return /Claude Code blocked|waiting for you|^Permission|^Question/.test(one); })).toEqual([]);
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 12:
                _f.apply(void 0, [(_w.sent()).filter(function (one) { return one.props.backgroundColor === AMBER; })]).toEqual([]);
                _g = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 13:
                _g.apply(void 0, [(_w.sent()).filter(function (one) { return /^(Allow|Don't allow)$|without it|another way|Leave it out/.test(one); })]).toEqual([]);
                expect(logLines('put to the person on its card')).toEqual([]);
                expect(mine()).toEqual([]);
                check = function (id) { return $.tool.check({ tool: 'Edit', input: { file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }, agentId: 'a1', tool_use_id: id }); };
                _h = expect;
                return [4 /*yield*/, check('chk-2')];
            case 14:
                _h.apply(void 0, [(_w.sent()).decision]).toBe('ask');
                // A command it blocked while the card asks the task's own question never replaces that question
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Which notes first?', choices: ['The old ones'] })];
            case 15:
                // A command it blocked while the card asks the task's own question never replaces that question
                _w.sent();
                files.set('auto-refuse', 'Bash');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b0', command: 'wc -l notes.md', description: 'Count the lines' })];
            case 16:
                _w.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _w.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (logLines('not put on its card: its card asks something already').length ? true : undefined)];
                    }); }); })];
            case 18:
                _j.apply(void 0, [_w.sent()]).toBe(true);
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Which notes first?' })];
            case 19:
                _k.apply(void 0, [_w.sent()]).toBeDefined();
                _l = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: BLOCKED })];
            case 20:
                _l.apply(void 0, [_w.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })
                    // A command it blocked with nothing asked on the card is asked; Don't allow tells the task, still at work, to carry on without
                    // it, never to get there another way, and runs nothing
                ];
            case 21:
                _w.sent();
                deny = function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _this = this;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = list).press;
                                _c = {};
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /^ask-a1-deny-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b1', command: 'wc -l notes.md', description: 'Count the lines' })];
            case 22:
                _w.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                _w.sent();
                _m = expect;
                _o = ['asked for the command'];
                _p = Boolean;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: BLOCKED })];
                    }); }); })];
            case 24:
                _m.apply(void 0, [_o.concat([_p.apply(void 0, [_w.sent()])])]).toEqual(['asked for the command', true]);
                expect(logLines('put to the person on its card')).toHaveLength(1);
                return [4 /*yield*/, deny()];
            case 25:
                _w.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means'); })];
                    }); }); })];
            case 26:
                told = _w.sent();
                expect(told).toContain("pressed \"Don't allow\" when asked whether to run the command Claude Code refused you (wc -l notes.md)");
                expect(told).toContain('Carry on without it, and say in your report what was left out.');
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: BLOCKED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 27:
                _q.apply(void 0, [_w.sent()]).toBe(true);
                _r = expect;
                return [4 /*yield*/, pressedLines(list)];
            case 28:
                _r.apply(void 0, [(_w.sent()).map(function (one) { return [one.text, one.props.dimColor]; })]).toEqual([["✓ You pressed “Don't allow”", true]]);
                // (its next step reads that, so nothing of the press is left to send it when it ends)
                return [4 /*yield*/, steps($, 1, 'm', 'a1')];
            case 29:
                // (its next step reads that, so nothing of the press is left to send it when it ends)
                _w.sent();
                return [4 /*yield*/, clock.advance(1000)
                    // Pressed once the task has ended, nothing starts it again
                ];
            case 30:
                _w.sent();
                // Pressed once the task has ended, nothing starts it again
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', agentId: 'a1', tool_use_id: 'b2', command: 'wc -c notes.md', description: 'Count the letters' })];
            case 31:
                // Pressed once the task has ended, nothing starts it again
                _w.sent();
                files.delete('auto-refuse');
                return [4 /*yield*/, clock.advance(1000)];
            case 32:
                _w.sent();
                _s = expect;
                _t = ['asked again for the next command'];
                _u = Boolean;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: BLOCKED })];
                    }); }); })];
            case 33:
                _s.apply(void 0, [_t.concat([_u.apply(void 0, [_w.sent()])])]).toEqual(['asked again for the next command', true]);
                // Pressed once the task has ended, having handed in its result, nothing starts it again
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-end', agentId: 'a1', message: 'The notes are written, without the files Claude Code refused.' })];
            case 34:
                // Pressed once the task has ended, having handed in its result, nothing starts it again
                _w.sent();
                agents.a1 = 'completed';
                ended.add('a1');
                return [4 /*yield*/, $.turn.complete({ answer: 'The notes are written, without the files Claude Code refused.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 35:
                _w.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 36:
                _w.sent();
                before = appended.filter(function (one) { return one.startsWith('a1: '); }).length;
                return [4 /*yield*/, deny()];
            case 37:
                _w.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 38:
                _w.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: BLOCKED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 39:
                _v.apply(void 0, [_w.sent()]).toBe(true);
                expect([resumed.filter(function (one) { return one.startsWith('a1: '); }), appended.filter(function (one) { return one.startsWith('a1: '); }).length]).toEqual([[], before]);
                expect(pressRuns).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 40:
                _w.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a command Claude Code blocked a task from running is asked on its card as a Permission block, the command whole with why and where it would run, Allow and Don't allow; nothing runs but on that Allow (not Don't allow, not a task's own question with a button of that name, not waiting), and the press changes no permission; the press runs exactly that command once, as the person's, shows one grey line of the press and one quiet line while it runs, never the command again nor a drawing of the whole panel at each look at it (17 Nov, the box that flashed); its output is told to a task at a step, and kept for the next step of one that ended, with a grey line and nothing to press, never sent from a timer; a long one is stopped at its limit, and Stop stops it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, files, clock, resumed, appended, pressRuns, redraws, refuse, list, mine, buttons, pressOn, stops, details, _b, _c, _d, _e, command, question, _f, _g, _h, _j, _k, _l, _m, check, _o, key, _p, _q, runner, how, ran, out, folder, _r, _s, _t, _u, runTime, running, _v, _w, _x, _y, i, ranThen, _z, kept, _0, _1, _2, woke, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
    var _this = this;
    var _18, _19, _20, _21;
    return __generator(this, function (_22) {
        switch (_22.label) {
            case 0:
                agents = { a1: 'running' };
                _a = world(on, { agents: agents, unseen: [] }), files = _a.files, clock = _a.clock, resumed = _a.resumed, appended = _a.appended, pressRuns = _a.pressRuns;
                on('tool.check', function (_, e, next) { return (String(e.tool_use_id).startsWith('chk') ? { decision: 'ask' } : next(e)); });
                redraws = { count: 0 };
                on('ui.invalidate', function (_, e, next) { return ((redraws.count += 1), next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _22.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'find the name servers', wait: false, origin: composer })];
            case 2:
                _22.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Find the name servers', prompt: 'find the name servers' }))];
            case 3:
                _22.sent();
                refuse = function (id, more) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                files.delete('run:gone');
                                files.set('auto-refuse', 'Bash');
                                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', agentId: 'a1', tool_use_id: id }, more))];
                            case 1:
                                _a.sent();
                                files.delete('auto-refuse');
                                return [4 /*yield*/, clock.advance(1000)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))
                    // The buttons of the block and of the running command's line, by their keys (the card's own Stop is the task's)
                ];
            case 4:
                list = _22.sent();
                mine = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return /^ask-a1-|^runs-a1-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                    }
                }); }); };
                buttons = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, mine()];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { return String(one.props.label); })];
                    }
                }); }); };
                pressOn = function (part) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _this = this;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = list).press;
                                _c = {};
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, mine()];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').includes(part); })];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                stops = function () { return pressRuns.filter(function (argv) { return argv[1] === 'stop'; }).length; };
                details = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.props.text) !== null && _a !== void 0 ? _a : ''); })
                            // Don't allow runs nothing, and tells the task to carry on without it
                        ];
                    }
                }); }); };
                // Don't allow runs nothing, and tells the task to carry on without it
                return [4 /*yield*/, refuse('b00', { command: 'dig +short NS example.net', description: 'Look up the name servers' })];
            case 5:
                // Don't allow runs nothing, and tells the task to carry on without it
                _22.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: BLOCKED })];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_22.sent()]).toBeDefined();
                // (nothing is typed on it: only its two buttons answer it)
                _c = expect;
                return [4 /*yield*/, buttons()];
            case 7:
                // (nothing is typed on it: only its two buttons answer it)
                _c.apply(void 0, [_22.sent()]).toEqual(['Allow', "Don't allow"]);
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 8:
                _d.apply(void 0, [(_22.sent()).length]).toBe(0);
                return [4 /*yield*/, pressOn('-deny-')];
            case 9:
                _22.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means'); })];
                    }); }); })];
            case 10:
                _e.apply(void 0, [_22.sent()]).toBeDefined();
                expect(pressRuns).toEqual([]);
                // Nor does a task's own question with a button of that name, over the same command
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Shall I go on?', choices: ['Allow', 'Leave it'], copy: 'dig +short NS example.org' })];
            case 11:
                // Nor does a task's own question with a button of that name, over the same command
                _22.sent();
                return [4 /*yield*/, pressOn('-choice-0-')];
            case 12:
                _22.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 13:
                _22.sent();
                expect(pressRuns).toEqual([]);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })];
            case 14:
                _22.sent();
                command = "dig +short NS example.com @ns1.example.net | sort # it's the person's own";
                return [4 /*yield*/, refuse('b1', { command: command, description: 'Look up the name servers' })
                    // The block: a permission on the task's own card, amber, counted once; the command whole; one line under it of where and how
                    // long Allow would run it and why Claude Code blocked it (its reason alone, none of its words for the model); and the two buttons
                ];
            case 15:
                _22.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: BLOCKED })];
                    }); }); })];
            case 16:
                question = _22.sent();
                expect([question === null || question === void 0 ? void 0 : question.props.color, question === null || question === void 0 ? void 0 : question.props.bold]).toEqual([AMBER, true]);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 17:
                _f.apply(void 0, [_22.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: command })];
            case 18:
                _g.apply(void 0, [_22.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^1 waiting for you/ })];
            case 19:
                _h.apply(void 0, [_22.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, details()];
            case 20:
                _j.apply(void 0, [(_22.sent()).filter(function (one) { return one.startsWith('Runs once in '); })]).toEqual([expect.stringMatching(/^Runs once in \S+, for at most 10 min · blocked as “Unauthorized Access”\.$/)]);
                _k = expect;
                return [4 /*yield*/, details()];
            case 21:
                _k.apply(void 0, [(_22.sent()).filter(function (one) { return /If you have other tasks|settings|Do it another way|Leave it out|it was Permission|Why: /.test(one); })]).toEqual([]);
                _l = expect;
                return [4 /*yield*/, buttons()];
            case 22:
                _l.apply(void 0, [_22.sent()]).toEqual(['Allow', "Don't allow"]);
                _m = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 23:
                _m.apply(void 0, [(_22.sent()).filter(function (one) { return /^(Run it|Carry on without it|Send now|Copy|Open in Terminal|Allow once|Deny)$/.test(one); })]).toEqual([]);
                // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
                return [4 /*yield*/, clock.advance(60000)];
            case 24:
                // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
                _22.sent();
                expect(pressRuns).toEqual([]);
                check = function (id) { return $.tool.check({ tool: 'Bash', input: { command: command, description: 'Look up the name servers' }, agentId: 'a1', tool_use_id: id }); };
                _o = expect;
                return [4 /*yield*/, check('chk-1')];
            case 25:
                _o.apply(void 0, [(_22.sent()).decision]).toBe('ask');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mine()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').includes('-allow-'); })];
                        }
                    }); }); })];
            case 26:
                key = (_19 = (_18 = (_22.sent())) === null || _18 === void 0 ? void 0 : _18.key) !== null && _19 !== void 0 ? _19 : '';
                return [4 /*yield*/, Promise.all([list.press({ key: key }), list.press({ key: key }).catch(function () { return undefined; })])];
            case 27:
                _22.sent();
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.length ? pressRuns : undefined)];
                    }); }); })];
            case 28:
                _p.apply(void 0, [_22.sent()]).toHaveLength(1);
                _q = (_20 = pressRuns[0]) !== null && _20 !== void 0 ? _20 : [], runner = _q[0], how = _q[1], ran = _q[2], out = _q[3], folder = _q[4];
                expect([String(runner).endsWith('/bin/run-it'), how, ran, folder]).toEqual([true, 'start', command, '/repo']);
                expect(String(out)).toMatch(/\/runs\/.+\.log$/);
                // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('pressed "Allow" on your card') && one.includes('it is running for them now') && one.includes("What it prints goes to ".concat(out)); })];
                    }); }); })];
            case 29:
                // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
                _r.apply(void 0, [_22.sent()]).toBeDefined();
                _s = expect;
                return [4 /*yield*/, check('chk-2')];
            case 30:
                _s.apply(void 0, [(_22.sent()).decision]).toBe('ask');
                // (its next step reads that, so nothing of the press is left to send it when it ends)
                return [4 /*yield*/, steps($, 1, 'm', 'a1')
                    // The block went with the press: one grey line says what was pressed
                ];
            case 31:
                // (its next step reads that, so nothing of the press is left to send it when it ends)
                _22.sent();
                // The block went with the press: one grey line says what was pressed
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: BLOCKED })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 32:
                // The block went with the press: one grey line says what was pressed
                _t.apply(void 0, [_22.sent()]).toBe(true);
                _u = expect;
                return [4 /*yield*/, pressedLines(list)];
            case 33:
                _u.apply(void 0, [(_22.sent()).map(function (one) { return [one.text, one.props.dimColor]; })]).toEqual([['✓ You pressed “Allow”', true]]);
                // Running: one quiet line with how long it has run, and Stop; the command is not shown again
                files.set(String(out), 'ns1.example.net.\n');
                return [4 /*yield*/, clock.advance(5000)];
            case 34:
                _22.sent();
                runTime = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (t) { return /^ · \d+[hms]/.test(String(t.text)); })) === null || _a === void 0 ? void 0 : _a.text];
                    }
                }); }); };
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Running your command' })];
                    }); }); })];
            case 35:
                running = _22.sent();
                expect(running === null || running === void 0 ? void 0 : running.props.dimColor).toBe(true);
                _v = expect;
                return [4 /*yield*/, runTime()];
            case 36:
                _v.apply(void 0, [_22.sent()]).toBeDefined();
                _w = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: command })];
            case 37:
                _w.apply(void 0, [_22.sent()]).toBeUndefined();
                _x = expect;
                return [4 /*yield*/, textsOf(list)];
            case 38:
                _x.apply(void 0, [(_22.sent()).filter(function (t) { return /Claudopus is running it|You allowed it/.test(t); })]).toEqual([]);
                _y = expect;
                return [4 /*yield*/, buttons()];
            case 39:
                _y.apply(void 0, [_22.sent()]).toEqual(['Stop']);
                // While it prints, each look at it every 5 s draws nothing: the whole panel is drawn again only as calmly as for any running
                // work, every ten seconds at most
                redraws.count = 0;
                i = 0;
                _22.label = 40;
            case 40:
                if (!(i < 12)) return [3 /*break*/, 43];
                files.set(String(out), "ns1.example.net.\nline ".concat(i, "\n"));
                return [4 /*yield*/, clock.advance(5000)];
            case 41:
                (_22.sent());
                _22.label = 42;
            case 42:
                i++;
                return [3 /*break*/, 40];
            case 43:
                expect(redraws.count).toBeLessThanOrEqual(8);
                // The task ends meanwhile. The command's end starts nothing: what it printed is kept for the task's next step, its card says
                // so in one grey line, and there is nothing to press
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on the name servers.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })
                    // Its running time still moves, calmly, with the task ended
                ];
            case 44:
                _22.sent();
                // Its running time still moves, calmly, with the task ended
                return [4 /*yield*/, clock.advance(15000)];
            case 45:
                // Its running time still moves, calmly, with the task ended
                _22.sent();
                return [4 /*yield*/, runTime()];
            case 46:
                ranThen = _22.sent();
                expect(ranThen).toBeDefined();
                return [4 /*yield*/, clock.advance(15000)];
            case 47:
                _22.sent();
                _z = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, runTime()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== ranThen ? true : undefined)];
                        }
                    }); }); })];
            case 48:
                _z.apply(void 0, [_22.sent()]).toBe(true);
                files.set(String(out), 'ns1.example.net.\nns2.example.net.\nclaudopus-exit 0\n');
                return [4 /*yield*/, clock.advance(5000)];
            case 49:
                _22.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })];
                    }); }); })];
            case 50:
                kept = _22.sent();
                expect(kept === null || kept === void 0 ? void 0 : kept.props.dimColor).toBe(true);
                _0 = expect;
                return [4 /*yield*/, buttons()];
            case 51:
                _0.apply(void 0, [_22.sent()]).toEqual([]);
                _1 = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 52:
                _1.apply(void 0, [(_22.sent()).includes('Send now')]).toBe(false);
                return [4 /*yield*/, clock.advance(90000)];
            case 53:
                _22.sent();
                _2 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })];
            case 54:
                _2.apply(void 0, [_22.sent()]).toBeDefined();
                expect(resumed.filter(function (one) { return one.startsWith('a1: '); })).toEqual([]);
                expect(appended.filter(function (one) { return one.startsWith('a1: ') && one.includes('ns2.example.net.'); })).toEqual([]);
                // Its next step, started by whatever starts it, reads it there: what ran, how it ended, where the whole is, and that it is no permission
                agents.a1 = 'running';
                return [4 /*yield*/, steps($, 2, 'm', 'a1')];
            case 55:
                _22.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('ns2.example.net.'); })];
                    }); }); })];
            case 56:
                woke = _22.sent();
                expect(woke).toContain("ran for them, exactly as shown, once, as their own, in /repo:\n".concat(command, "\nIt ended well after"));
                expect(woke).toContain("Its whole output is in ".concat(out));
                expect(woke).toContain('it is no permission');
                expect(pressRuns).toHaveLength(1);
                expect(resumed.filter(function (one) { return one.startsWith('a1: '); })).toEqual([]);
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 57:
                _3.apply(void 0, [_22.sent()]).toBe(true);
                // One sent to the background runs an hour at most; Stop on its line stops it, and the task, at a step, is told at once
                return [4 /*yield*/, $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/notes.md', tool_use_id: 'r1' })];
            case 58:
                // One sent to the background runs an hour at most; Stop on its line stops it, and the task, at a step, is told at once
                _22.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', agentId: 'a1', tool_use_id: 'n1', text: 'Checking the name servers answer' })];
            case 59:
                _22.sent();
                return [4 /*yield*/, refuse('b2', { command: 'npm run soak', description: 'Run the soak test', run_in_background: true })];
            case 60:
                _22.sent();
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, details()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return /^Runs once in \S+, for at most 1 hour · blocked as /.test(one); })];
                        }
                    }); }); })];
            case 61:
                _4.apply(void 0, [_22.sent()]).toBeDefined();
                return [4 /*yield*/, pressOn('-allow-')];
            case 62:
                _22.sent();
                _5 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.length === 2 ? true : undefined)];
                    }); }); })];
            case 63:
                _5.apply(void 0, [_22.sent()]).toBe(true);
                return [4 /*yield*/, pressOn('-stop-')];
            case 64:
                _22.sent();
                _6 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (stops() === 1 ? true : undefined)];
                    }); }); })];
            case 65:
                _6.apply(void 0, [_22.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(5000)];
            case 66:
                _22.sent();
                _7 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('npm run soak') && one.includes('was stopped by the person'); })];
                    }); }); })];
            case 67:
                _7.apply(void 0, [_22.sent()]).toBeDefined();
                _8 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "Your command's output is kept for the task's next step" })];
            case 68:
                _8.apply(void 0, [_22.sent()]).toBeUndefined();
                // Its end is never the card's line beside the dots, which keeps the task's own words (19 Nov, "Your command ended after 20s"
                // stood there until the task wrote again): it is a row of the card's ended commands, and a grey line for a minute where it ran
                _9 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^You stopped your command after / })];
                    }); }); })];
            case 69:
                // Its end is never the card's line beside the dots, which keeps the task's own words (19 Nov, "Your command ended after 20s"
                // stood there until the task wrote again): it is a row of the card's ended commands, and a grey line for a minute where it ran
                _9.apply(void 0, [(_21 = (_22.sent())) === null || _21 === void 0 ? void 0 : _21.props.dimColor]).toBe(true);
                _10 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Checking the name servers answer' })];
            case 70:
                _10.apply(void 0, [_22.sent()]).toBeDefined();
                _11 = expect;
                return [4 /*yield*/, textsOf(list)];
            case 71:
                _11.apply(void 0, [(_22.sent()).filter(function (t) { return /^(Your command (ended|failed|stopped|didn't)|You stopped)/.test(t) && !/^You stopped your command after \d/.test(t); })]).toEqual([]);
                _12 = expect;
                return [4 /*yield*/, labelsOf(list)];
            case 72:
                _12.apply(void 0, [(_22.sent()).filter(function (one) { return /commands? ended/.test(one); })]).toEqual(['2 commands ended']);
                // (a minute on, the next drawing has it no more)
                return [4 /*yield*/, clock.advance(61000)];
            case 73:
                // (a minute on, the next drawing has it no more)
                _22.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/soak.log', tool_use_id: 'r2' })];
            case 74:
                _22.sent();
                _13 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /^You stopped your command/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 75:
                _13.apply(void 0, [_22.sent()]).toBe(true);
                _14 = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Checking the name servers answer' })];
            case 76:
                _14.apply(void 0, [_22.sent()]).toBeDefined();
                // One held open with its own timeout of a minute is stopped by Claudopus at that limit
                return [4 /*yield*/, refuse('b3', { command: 'npm run slow', description: 'Run the slow check', timeout: 60000 })];
            case 77:
                // One held open with its own timeout of a minute is stopped by Claudopus at that limit
                _22.sent();
                return [4 /*yield*/, pressOn('-allow-')];
            case 78:
                _22.sent();
                _15 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.filter(function (argv) { return argv[2] === 'npm run slow'; }).length === 1 ? true : undefined)];
                    }); }); })];
            case 79:
                _15.apply(void 0, [_22.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(30000)];
            case 80:
                _22.sent();
                expect(stops()).toBe(1);
                return [4 /*yield*/, clock.advance(35000)];
            case 81:
                _22.sent();
                _16 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (stops() === 2 ? true : undefined)];
                    }); }); })];
            case 82:
                _16.apply(void 0, [_22.sent()]).toBe(true);
                _17 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('npm run slow') && one.includes('was stopped at its limit of 1 min'); })];
                    }); }); })];
            case 83:
                _17.apply(void 0, [_22.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 84:
                _22.sent();
                return [2 /*return*/];
        }
    });
}); });
