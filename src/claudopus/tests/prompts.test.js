// The app's own prompts shown amber in every panel
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
test("this chat waiting on the app's own prompt is listed with its prompt, and idle chats beside it are not", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, wake, idle, list, _b, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, wake = _a.wake;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                idle = JSON.stringify({ chat: 'chat-q', title: 'Quiet one', folder: '/x', host: '', at: NOW, cards: [] });
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(idle, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' } });
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Clear the build folder' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Quiet one' })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, keyed(list, 'quiet-fold')];
            case 6:
                _d.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder' })];
            case 7:
                _e.sent();
                wake();
                return [4 /*yield*/, list.unmount()];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a chat stopped on the app's own prompt shows it amber at the top of its panel and in its file, says so aloud once, and clears as the call ends", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, notified, wake, asked, list, _b, _c, _d, _e, _f, _g, _h, _j, texts, _k, _l, amber, _m, _o, _p, shared, _q, _r, _s, _t;
    var _this = this;
    var _u, _v, _w, _x;
    return __generator(this, function (_y) {
        switch (_y.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, notified = _a.notified, wake = _a.wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _y.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'clean up the build', wait: false, origin: composer })];
            case 2:
                _y.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Clean the build', prompt: 'clean up the build' }))
                    // The work's call raises the app's prompt: the mod holds it for a press, and answered in the box it passes it on untouched
                ];
            case 3:
                _y.sent();
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf build', description: 'Clear the build folder' }, agent_id: 'a1' });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _y.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Clear the build folder' })];
                    }); }); })];
            case 5:
                _b.apply(void 0, [_y.sent()]).toBeDefined();
                // Yes and No on the card answer it; nothing tells the person to go and answer elsewhere
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-yes-this-')];
                    }); }); })];
            case 6:
                // Yes and No on the card answer it; nothing tells the person to go and answer elsewhere
                _c.apply(void 0, [_y.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, button(list, 'prompt-no-this-')];
            case 7:
                _d.apply(void 0, [_y.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer Yes or No in the box at the bottom of this chat.' })];
            case 8:
                _e.apply(void 0, [_y.sent()]).toBeUndefined();
                // It says which work asks, that it asks permission, the command whole, and what a yes and a no each do
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Needs your permission' })];
            case 9:
                // It says which work asks, that it asks permission, the command whole, and what a yes and a no each do
                _f.apply(void 0, [_y.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'rm -rf build' })];
            case 10:
                _g.apply(void 0, [_y.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Yes: the command runs on its Mac.' })];
            case 11:
                _h.apply(void 0, [_y.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "No: it doesn't run, and Claudopus tells Claude you said no." })];
            case 12:
                _j.apply(void 0, [_y.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 13:
                texts = (_y.sent()).map(function (one) { return one.text; });
                expect(texts.indexOf('Clean the build')).toBeLessThan(texts.indexOf('Run a command: Clear the build folder'));
                expect(texts.filter(function (one) { return one === 'Clean the build'; })).toHaveLength(1);
                _k = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run a command: Clear the build folder' })];
            case 14:
                _k.apply(void 0, [(_u = (_y.sent())) === null || _u === void 0 ? void 0 : _u.props.color]).toBe('#E5A50A');
                // The others see it in this chat's file, with the work it came from
                return [4 /*yield*/, clock.advance(1000)];
            case 15:
                // The others see it in this chat's file, with the work it came from
                _y.sent();
                expect(JSON.parse((_v = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _v !== void 0 ? _v : '{}').prompts).toEqual([expect.objectContaining({ text: 'Run a command: Clear the build folder', title: 'Clean the build' })]);
                // Not told before the app itself says the prompt is still waiting; then told once, as an ask is
                return [4 /*yield*/, clock.advance(5000)];
            case 16:
                // Not told before the app itself says the prompt is still waiting; then told once, as an ask is
                _y.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toEqual([]);
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 17:
                _y.sent();
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 18:
                _y.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toEqual(['Clean the build has a question for you | Run a command: Clear the build folder']);
                // The call ends, allowed and run: the amber prompt goes, here and in the file, and the card says what was answered and that it ran,
                // for a minute, in this panel and in the file the others read
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'rm -rf build', description: 'Clear the build folder', agentId: 'a1' })];
            case 19:
                // The call ends, allowed and run: the amber prompt goes, here and in the file, and the card says what was answered and that it ran,
                // for a minute, in this panel and in the file the others read
                _y.sent();
                wake();
                _l = expect;
                return [4 /*yield*/, asked];
            case 20:
                _l.apply(void 0, [(_w = ((_y.sent()))) === null || _w === void 0 ? void 0 : _w.decision]).toBeUndefined();
                amber = function (text) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text', text: text })];
                        case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.props.color === '#E5A50A'; })];
                    }
                }); }); };
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, amber('Run a command: Clear the build folder')];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 21:
                _m.apply(void 0, [_y.sent()]).toBe(true);
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · it ran and is done' })];
                    }); }); })];
            case 22:
                _o.apply(void 0, [_y.sent()]).toBeDefined();
                _p = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run a command: Clear the build folder' })];
            case 23:
                _p.apply(void 0, [_y.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(1000)];
            case 24:
                _y.sent();
                shared = JSON.parse((_x = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _x !== void 0 ? _x : '{}');
                expect(shared.prompts).toBeUndefined();
                expect(shared.answeredPrompts).toEqual([expect.objectContaining({ text: 'Run a command: Clear the build folder', answered: 'yes', isRunning: false })]);
                return [4 /*yield*/, clock.advance(61000)];
            case 25:
                _y.sent();
                _q = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'You allowed it · it ran and is done' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 26:
                _q.apply(void 0, [_y.sent()]).toBe(true);
                // A prompt answered at once is not told
                return [4 /*yield*/, $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour for the nose?' }] } })];
            case 27:
                // A prompt answered at once is not told
                _y.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Answer a question: Which colour for the nose?' })];
                    }); }); })];
            case 28:
                _r.apply(void 0, [_y.sent()]).toBeDefined();
                _s = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'This chat itself' })];
            case 29:
                _s.apply(void 0, [_y.sent()]).toBeDefined();
                _t = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })];
            case 30:
                _t.apply(void 0, [_y.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'AskUserQuestion', questions: [{ question: 'Which colour for the nose?' }] })];
            case 31:
                _y.sent();
                return [4 /*yield*/, $.classic.Notification({ message: 'Claude needs your permission', notification_type: 'permission_prompt' })];
            case 32:
                _y.sent();
                expect(notified.filter(function (line) { return line.includes('has a question for you'); })).toHaveLength(1);
                return [4 /*yield*/, list.unmount()];
            case 33:
                _y.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a command allowed leaves the panel as soon as it is seen running, before it ends; a prompt a settings hook answered never shows', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, wake, list, _b, _c, _d, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, wake = _a.wake;
                return [4 /*yield*/, $.session.start(start)
                    // The same command already running elsewhere, as in a terminal, says nothing of this call
                ];
            case 1:
                _g.sent();
                // The same command already running elsewhere, as in a terminal, says nothing of this call
                files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n");
                void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'python3 scripts/count_lines.py --all', description: 'Count the lines' } });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Count the lines' })];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(2000)];
            case 4:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run a command: Count the lines' })];
            case 5:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                files.set('ps:running', "python3 scripts/count_lines.py --all\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n/bin/zsh -c source snap && eval 'python3 scripts/count_lines.py --all' < /dev/null\n");
                return [4 /*yield*/, clock.advance(2000)
                    // Seen running: no longer amber, and the card says it was allowed and runs now
                ];
            case 6:
                _g.sent();
                // Seen running: no longer amber, and the card says it was allowed and runs now
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · it is running now' })];
                    }); }); })];
            case 7:
                // Seen running: no longer amber, and the card says it was allowed and runs now
                _d.apply(void 0, [_g.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text', text: 'Run a command: Count the lines' })];
            case 8:
                _e.apply(void 0, [(_g.sent()).some(function (one) { return one.props.color === '#E5A50A'; })]).toBe(false);
                wake();
                // Beneath the mod, a settings hook answers the request: no prompt is put to the person, and none shows
                files.set('settings:allow', '1');
                return [4 /*yield*/, $.classic.PermissionRequest({ tool_name: 'Write', tool_input: { file_path: '/repo/notes.md', content: 'x' } })];
            case 9:
                _g.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 10:
                _g.sent();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Write the file notes.md' })];
            case 11:
                _f.apply(void 0, [_g.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 12:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's open prompt shows amber under its name, first; on this Mac a press opens that chat, on another Mac it says where", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, waiting, remote, list, _b, _c, bold, opens, _d, _e, _f, _g, _h;
    var _this = this;
    var _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, shown = _a.shown;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                waiting = function (at, chat, title, link) { return JSON.stringify({ chat: chat, title: title, folder: '/Users/sam/GitHub', host: '', at: at, cards: [], prompts: [{ id: 'toolu_1', text: 'Allow a command: Cross-repo duplicate files', title: 'Interesting facts', at: at }], link: link }); };
                remote = JSON.stringify(__assign(__assign({}, JSON.parse(waiting(NOW, 'chat-rc', 'M4 Remote', ''))), { link: { bridge: 'session_01M4Remote', app: 'local_m4-rc' } }));
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(waiting(NOW, 'chat-m4', 'M4 GitHub', 'claude://code/continue?session=local_m4'), "\n---claudopus-live---\n").concat(remote, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                // A chat of this Mac with no work but an open prompt is listed; a link that is not the app's own is dropped
                files.set("".concat(MEMORY, "/live/chat-w.json"), waiting(NOW, 'chat-w', 'Web chat', 'claude://code/continue?session=local_ab-12'));
                files.set("".concat(MEMORY, "/live/chat-x.json"), waiting(NOW, 'chat-x', 'Odd chat', 'https://example.com'));
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _o.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'M4 GitHub' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_o.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in that chat, on m4' })];
            case 5:
                _c.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 6:
                bold = (_o.sent()).filter(function (one) { return one.props.bold; }).map(function (one) { return one.text; });
                // Chats that wait on the person come before the one that only works
                expect(bold.indexOf('Web chat')).toBeLessThan(bold.indexOf('Billing page'));
                expect(bold.indexOf('M4 GitHub')).toBeLessThan(bold.indexOf('Billing page'));
                expect(bold.filter(function (one) { return one === 'Allow a command: Cross-repo duplicate files'; })).toHaveLength(4);
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 7:
                opens = (_o.sent()).filter(function (one) { return one.props.label === 'Open that chat'; });
                expect(opens).toHaveLength(2);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in that chat, which runs on m4' })];
            case 8:
                _d.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: (_k = (_j = opens.find(function (one) { return String(one.key).includes('chat-rc'); })) === null || _j === void 0 ? void 0 : _j.key) !== null && _k !== void 0 ? _k : '' })];
            case 9:
                _o.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { var _a; return (_a = argv[1]) === null || _a === void 0 ? void 0 : _a.startsWith('claude://'); })];
                    }); }); })];
            case 10:
                _e.apply(void 0, [_o.sent()]).toEqual(['open', 'claude://code/session_01M4Remote']);
                return [4 /*yield*/, list.press({ key: (_m = (_l = opens.find(function (one) { return String(one.key).includes('chat-w'); })) === null || _l === void 0 ? void 0 : _l.key) !== null && _m !== void 0 ? _m : '' })];
            case 11:
                _o.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { var _a; return (_a = argv[1]) === null || _a === void 0 ? void 0 : _a.includes('local_ab-12'); })];
                    }); }); })];
            case 12:
                _f.apply(void 0, [_o.sent()]).toEqual(['open', 'claude://code/continue?session=local_ab-12']);
                // Answered there, its file no longer carries it, and its amber card leaves; with nothing going on, its chat is listed no more
                files.set("".concat(MEMORY, "/live/chat-w.json"), JSON.stringify({ chat: 'chat-w', title: 'Web chat', folder: '/Users/sam/GitHub', host: '', at: NOW + 11000, cards: [] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 13:
                _o.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one.props.label === 'Open that chat' && String(one.key).includes('chat-w'); }) ? undefined : true)];
                        }
                    }); }); })];
            case 14:
                _g.apply(void 0, [_o.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Web chat' })];
            case 15:
                _h.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 16:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a message the chat passes to running work names that work and the message; a no is said plainly, a minute, then it goes', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, wake, list, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _this = this;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, wake = _a.wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the cards', wait: false, origin: composer })];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Fix the panel cards', prompt: 'fix the cards' }))];
            case 3:
                _o.sent();
                void $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'Make the buttons bigger too' } });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _o.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Send a message to the task “Fix the panel cards”' })];
                    }); }); })];
            case 5:
                _o.sent();
                _b = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 6:
                _b.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('Send a message to the task “Fix the panel cards”');
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 7:
                _c.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('Make the buttons bigger too');
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 8:
                _d.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('Yes: that task gets the message and acts on it.');
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 9:
                _e.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain("No: it isn't sent, and the chat waits for what you say next.");
                // No tool's own name anywhere on it
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 10:
                // No tool's own name anywhere on it
                _f.apply(void 0, [(_o.sent()).some(function (one) { return String(one.text).includes('SendMessage'); })]).toBe(false);
                // The person says no
                files.set('refuse', 'SendMessage');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', to: 'a1', message: 'Make the buttons bigger too' })];
            case 11:
                _o.sent();
                wake();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })];
                    }); }); })];
            case 12:
                _o.sent();
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 13:
                _g.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain("You said no · it didn't run, and Claude is waiting for what you say next");
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 14:
                _h.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('Send a message to the task “Fix the panel cards”');
                return [4 /*yield*/, clock.advance(61000)];
            case 15:
                _o.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 16:
                _j.apply(void 0, [_o.sent()]).toBe(true);
                // Allowed, a message says it was sent
                files.delete('refuse');
                void $.classic.PermissionRequest({ tool_name: 'SendMessage', tool_input: { to: 'a1', message: 'One more thing' } });
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Send a message to the task “Fix the panel cards”' })];
                    }); }); })];
            case 17:
                _o.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', to: 'a1', message: 'One more thing' })];
            case 18:
                _o.sent();
                wake();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · Claude sent it' })];
                    }); }); })];
            case 19:
                _o.sent();
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 20:
                _k.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('You allowed it · Claude sent it');
                // Interrupted before an answer: nothing happened
                files.set('interrupt', 'Bash');
                void $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make clean', description: 'Clean up' }, agent_id: 'a1' });
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Clean up' })];
                    }); }); })];
            case 21:
                _o.sent();
                _l = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 22:
                _l.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('Run a command: Clean up');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'make clean', description: 'Clean up', agentId: 'a1' })];
            case 23:
                _o.sent();
                wake();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'It ended before you answered · nothing happened' })];
                    }); }); })];
            case 24:
                _o.sent();
                _m = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 25:
                _m.apply(void 0, [(_o.sent()).map(function (t) { return t.text; })]).toContain('It ended before you answered · nothing happened');
                return [4 /*yield*/, list.unmount()];
            case 26:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's prompt and its answer show under that chat's name, titled by its work or as that chat's own", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, list, _b, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                files.set("".concat(MEMORY, "/live/chat-o.json"), JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run a command: Count files', kind: 'allow', at: NOW }], answeredPrompts: [{ id: 'toolu_8', text: 'Pass a message to the work “Tidy”', title: 'Tidy', kind: 'allow', answered: 'yes', done: 'it was sent', at: NOW, endedAt: NOW }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Count files' })];
                    }); }); })];
            case 4:
                _f.sent();
                _b = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 5:
                _b.apply(void 0, [(_f.sent()).map(function (t) { return t.text; })]).toContain('Run a command: Count files');
                _c = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 6:
                _c.apply(void 0, [(_f.sent()).map(function (t) { return t.text; })]).toContain('That chat itself');
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'This chat itself' })];
            case 7:
                _d.apply(void 0, [_f.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 8:
                _e.apply(void 0, [(_f.sent()).map(function (t) { return t.text; })]).toContain('You allowed it · it was sent');
                return [4 /*yield*/, list.unmount()];
            case 9:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Yes on a prompt's card allows the call as Claude Code's own box would, and the card says it runs", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, clock, wake, list, asked, _b, _c, _d, _e, _f, _g, _h, _j, input, started, _k, _l, _m, _o, _p, said, texts;
    var _q, _r;
    var _this = this;
    var _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                _a = world(on), clock = _a.clock, wake = _a.wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _u.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _u.sent();
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } });
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-yes-this-')];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_u.sent()]).toBeDefined();
                _d = (_c = list).press;
                _q = {};
                _e = String;
                return [4 /*yield*/, button(list, 'prompt-yes-this-')];
            case 4: return [4 /*yield*/, _d.apply(_c, [(_q.key = _e.apply(void 0, [(_s = (_u.sent())) === null || _s === void 0 ? void 0 : _s.key]), _q)])];
            case 5:
                _u.sent();
                wake();
                _f = expect;
                return [4 /*yield*/, asked];
            case 6:
                _f.apply(void 0, [(_u.sent()).decision]).toEqual({ behavior: 'allow' });
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · it is running now' })];
                    }); }); })];
            case 7:
                _g.apply(void 0, [_u.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, button(list, 'prompt-yes-this-')];
            case 8:
                _h.apply(void 0, [_u.sent()]).toBeUndefined();
                // The call runs and ends: the card says it is done
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'npm test', description: 'Run the tests' })];
            case 9:
                // The call runs and ends: the card says it is done
                _u.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · it ran and is done' })];
                    }); }); })];
            case 10:
                _j.apply(void 0, [_u.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(1000)
                    // The chat's own prompt to start a task, allowed: once the task is on its card, what came of it is said inside that card, never as
                    // a row of the chat itself between the cards (17 Nov, the person's screenshot)
                ];
            case 11:
                _u.sent();
                input = { description: 'Show scan numbers', prompt: 'show the scan numbers', run_in_background: true };
                started = $.classic.PermissionRequest({ tool_name: 'Agent', tool_input: input });
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-yes-this-')];
                    }); }); })];
            case 12:
                _k.apply(void 0, [_u.sent()]).toBeDefined();
                _m = (_l = list).press;
                _r = {};
                _o = String;
                return [4 /*yield*/, button(list, 'prompt-yes-this-')];
            case 13: return [4 /*yield*/, _m.apply(_l, [(_r.key = _o.apply(void 0, [(_t = (_u.sent())) === null || _t === void 0 ? void 0 : _t.key]), _r)])];
            case 14:
                _u.sent();
                wake();
                _p = expect;
                return [4 /*yield*/, started];
            case 15:
                _p.apply(void 0, [(_u.sent()).decision]).toEqual({ behavior: 'allow' });
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Agent' }, input))];
            case 16:
                _u.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Show scan numbers', prompt: 'show the scan numbers' }))];
            case 17:
                _u.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 18:
                _u.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /^You allowed it · (Claude started it|it is running now)$/ })];
                    }); }); })];
            case 19:
                said = _u.sent();
                expect(said).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 20:
                texts = (_u.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); });
                expect(texts.indexOf('Show scan numbers')).toBeGreaterThan(-1);
                expect(texts.indexOf('Show scan numbers')).toBeLessThan(texts.indexOf(String(said === null || said === void 0 ? void 0 : said.text)));
                // Only its own words under what came of it: no "This chat itself" naming it as the chat's
                expect(texts[texts.indexOf(String(said === null || said === void 0 ? void 0 : said.text)) + 1]).toBe('Start a task: Show scan numbers');
                return [4 /*yield*/, list.unmount()];
            case 21:
                _u.sent();
                return [2 /*return*/];
        }
    });
}); });
test("No on a prompt's card refuses the call: the chat's own turn stops, and work is told and carries on", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var wake, list, own, _a, _b, _c, _d, _e, _f, work, _g, _h, _j, _k, _l, decision, _m;
    var _o, _p;
    var _this = this;
    var _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                wake = world(on).wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _s.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'tidy up', wait: false, origin: composer })];
            case 2:
                _s.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Tidy the repo', prompt: 'tidy up' }))];
            case 3:
                _s.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _s.sent();
                own = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'rm -rf dist', description: 'Delete the build' } });
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-no-this-')];
                    }); }); })];
            case 5:
                _a.apply(void 0, [_s.sent()]).toBeDefined();
                _c = (_b = list).press;
                _o = {};
                _d = String;
                return [4 /*yield*/, button(list, 'prompt-no-this-')];
            case 6: return [4 /*yield*/, _c.apply(_b, [(_o.key = _d.apply(void 0, [(_q = (_s.sent())) === null || _q === void 0 ? void 0 : _q.key]), _o)])];
            case 7:
                _s.sent();
                wake();
                _e = expect;
                return [4 /*yield*/, own];
            case 8:
                _e.apply(void 0, [(_s.sent()).decision]).toEqual({ behavior: 'deny', message: expect.stringContaining('said no'), interrupt: true });
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })];
                    }); }); })];
            case 9:
                _f.apply(void 0, [_s.sent()]).toBeDefined();
                work = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'git clean -fd', description: 'Clean the tree' }, agent_id: 'a1' });
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Clean the tree' })];
                    }); }); })];
            case 10:
                _g.apply(void 0, [_s.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-no-this-')];
                    }); }); })];
            case 11:
                _h.apply(void 0, [_s.sent()]).toBeDefined();
                _k = (_j = list).press;
                _p = {};
                _l = String;
                return [4 /*yield*/, button(list, 'prompt-no-this-')];
            case 12: return [4 /*yield*/, _k.apply(_j, [(_p.key = _l.apply(void 0, [(_r = (_s.sent())) === null || _r === void 0 ? void 0 : _r.key]), _p)])];
            case 13:
                _s.sent();
                wake();
                return [4 /*yield*/, work];
            case 14:
                decision = (_s.sent()).decision;
                expect(decision === null || decision === void 0 ? void 0 : decision.interrupt).toBeUndefined();
                expect(decision === null || decision === void 0 ? void 0 : decision.message).toContain('continue without it');
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claudopus told Claude" })];
                    }); }); })];
            case 15:
                _m.apply(void 0, [_s.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 16:
                _s.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a question or a plan has no Yes or No on its card: it says where to answer it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var wake, list, r, _a, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                wake = world(on).wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _c.sent();
                return [4 /*yield*/, $.classic.PermissionRequest({ tool_name: 'AskUserQuestion', tool_input: { questions: [{ question: 'Which colour?' }] } })];
            case 3:
                r = _c.sent();
                expect(r === null || r === void 0 ? void 0 : r.decision).toBeUndefined();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Pick your answer in the box at the bottom of this chat.' })];
                    }); }); })];
            case 4:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, button(list, 'prompt-yes-')];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                wake();
                return [4 /*yield*/, list.unmount()];
            case 6:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's held prompt has no Yes or No here, only where to answer it; an answer a file leaves for this chat's own prompt answers nothing", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, wake, logged, list, _b, _c, _d, settled, asked, _e, id, _f, _g, _h, _j, _k;
    var _l;
    var _this = this;
    var _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, wake = _a.wake, logged = _a.logged;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _r.sent();
                files.set("".concat(MEMORY, "/live/chat-o.json"), JSON.stringify({ chat: 'chat-o', title: 'Other chat', folder: '/x', host: '', at: NOW, cards: [], prompts: [{ id: 'toolu_9', text: 'Run a command: Count files', kind: 'allow', at: NOW, isHeld: true }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _r.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _r.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Run a command: Count files' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_r.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, button(list, 'prompt-yes--chat-o-toolu_9')];
            case 5:
                _c.apply(void 0, [_r.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Answer it in that chat' })];
            case 6:
                _d.apply(void 0, [_r.sent()]).toBeDefined();
                settled = false;
                asked = $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'make', description: 'Build it' } }).then(function (r) { return ((settled = true), r); });
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-yes-this-')];
                    }); }); })];
            case 7:
                _e.apply(void 0, [_r.sent()]).toBeDefined();
                _f = String;
                return [4 /*yield*/, button(list, 'prompt-yes-this-')];
            case 8:
                id = _f.apply(void 0, [(_o = (_m = (_r.sent())) === null || _m === void 0 ? void 0 : _m.key) !== null && _o !== void 0 ? _o : '']).replace(/^prompt-yes-this-/, '').replace(/-\d+$/, '');
                files.set("".concat(MEMORY, "/live/answers/engine-id/1-a.json"), JSON.stringify({ card: "prompt:".concat(id), choice: 'yes', isReply: false, ask: 'Run a command: Build it', askAt: NOW, at: NOW + 6000 }));
                return [4 /*yield*/, clock.advance(5000)];
            case 9:
                _r.sent();
                wake();
                return [4 /*yield*/, clock.advance(1000)];
            case 10:
                _r.sent();
                wake();
                expect(settled).toBe(false);
                expect(files.has("".concat(MEMORY, "/live/answers/engine-id/1-a.json"))).toBe(false);
                expect(((_p = files.get("".concat(MEMORY, "/log.md"))) !== null && _p !== void 0 ? _p : '')).toContain('left in a file put away unread');
                _h = (_g = list).press;
                _l = {};
                _j = String;
                return [4 /*yield*/, button(list, 'prompt-yes-this-')];
            case 11: 
            // Its own Yes, pressed in this chat's panel, still answers it
            return [4 /*yield*/, _h.apply(_g, [(_l.key = _j.apply(void 0, [(_q = (_r.sent())) === null || _q === void 0 ? void 0 : _q.key]), _l)])];
            case 12:
                // Its own Yes, pressed in this chat's panel, still answers it
                _r.sent();
                wake();
                _k = expect;
                return [4 /*yield*/, asked];
            case 13:
                _k.apply(void 0, [(_r.sent()).decision]).toEqual({ behavior: 'allow' });
                void logged;
                return [4 /*yield*/, list.unmount()];
            case 14:
                _r.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a No pressed after Claude Code's box said yes does not stand: the card says what the call did once it ends", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var wake, list, _a, _b, _c, _d, _e, _f, _g;
    var _h;
    var _this = this;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                wake = world(on).wake;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                list = _k.sent();
                void $.classic.PermissionRequest({ tool_name: 'WebFetch', tool_input: { url: 'https://example.com/a' } });
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, button(list, 'prompt-no-this-')];
                    }); }); })];
            case 3:
                _a.apply(void 0, [_k.sent()]).toBeDefined();
                _c = (_b = list).press;
                _h = {};
                _d = String;
                return [4 /*yield*/, button(list, 'prompt-no-this-')];
            case 4: return [4 /*yield*/, _c.apply(_b, [(_h.key = _d.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.key]), _h)])];
            case 5:
                _k.sent();
                wake();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })];
                    }); }); })];
            case 6:
                _e.apply(void 0, [_k.sent()]).toBeDefined();
                // The box had allowed it first: the call runs and ends well
                return [4 /*yield*/, $.tool.call({ tool: 'WebFetch', url: 'https://example.com/a' })];
            case 7:
                // The box had allowed it first: the call runs and ends well
                _k.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it · it ran and is done' })];
                    }); }); })];
            case 8:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "You said no · it didn't run, and Claude is waiting for what you say next" })];
            case 9:
                _g.apply(void 0, [_k.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 10:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a call Claude Code refuses a background task with no prompt, as auto mode does, is shown on the task's card with Claude Code's own reason alone, and its answer tells the task to carry on without it and never to reach it by other means; a failing call whose output only holds those words shows nothing; an ask put up meanwhile is never replaced; pressed once the task has ended it is not started again; and Claudopus never lets the call through itself", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, files, clock, resumed, appended, logged, put, call, list, asks, _b, told, labels, _c, check, _d, press, _e, _f, _g, before, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                agents = { a1: 'running' };
                _a = world(on, { agents: agents }), files = _a.files, clock = _a.clock, resumed = _a.resumed, appended = _a.appended, logged = _a.logged;
                // Beneath the mod the engine would put each of the checks below to its mode, which settles the ask; the refused calls are Claude
                // Code's own to refuse, with no prompt
                on('tool.check', function (_, e, next) { return (String(e.tool_use_id).startsWith('chk') ? { decision: 'ask' } : next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'write the notes', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Write the notes', prompt: 'write the notes' }))];
            case 3:
                _j.sent();
                put = function () { var _a; return ((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').split('\n').filter(function (line) { return line.includes('put to the person on its card'); }); };
                // A search that fails, whose output holds Claude Code's words, is no refusal
                files.set('fails', "notes.md: Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Unauthorized Access].");
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', agentId: 'a1', command: 'grep -r denied notes.md # fails', tool_use_id: 'g1' })];
            case 4:
                _j.sent();
                call = { tool: 'Edit', agentId: 'a1', file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' };
                files.set('auto-refuse', 'Edit');
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, call), { tool_use_id: 'e1' }))];
            case 5:
                _j.sent();
                files.delete('auto-refuse');
                return [4 /*yield*/, clock.advance(1000)];
            case 6:
                _j.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                list = _j.sent();
                asks = 'Claude Code blocked this task: Change the file notes.md.';
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: asks })];
                    }); }); })];
            case 8:
                _b.apply(void 0, [_j.sent()]).toBeDefined();
                expect(put()).toHaveLength(1);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, __spreadArray(__spreadArray([], logged, true), appended, true).find(function (one) { return one.includes('Why: '); })];
                    }); }); })];
            case 9:
                told = _j.sent();
                expect(told).toContain("Why: Claude Code's auto mode blocked it (Unauthorized Access).");
                expect(told).toContain("Claude carries on without it and won't try another way.");
                expect(told).not.toMatch(/If you have other tasks|settings|Do it another way|Leave it out|it was Permission/);
                labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return /without it|another way|Leave it out/.test(label); })];
                    }
                }); }); };
                _c = expect;
                return [4 /*yield*/, labels()];
            case 10:
                _c.apply(void 0, [_j.sent()]).toEqual(['Carry on without it']);
                check = function (id) { return $.tool.check({ tool: 'Edit', input: { file_path: '/repo/notes.md', old_string: 'old line', new_string: 'new line' }, agentId: 'a1', tool_use_id: id }); };
                _d = expect;
                return [4 /*yield*/, check('chk-2')];
            case 11:
                _d.apply(void 0, [(_j.sent()).decision]).toBe('ask');
                press = function () { return __awaiter(_this, void 0, void 0, function () {
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
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === 'Carry on without it'; })];
                                        }
                                    }); }); })];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                return [4 /*yield*/, press()];
            case 12:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means'); })];
                    }); }); })];
            case 13:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(1000)];
            case 14:
                _j.sent();
                _f = expect;
                return [4 /*yield*/, check('chk-3')];
            case 15:
                _f.apply(void 0, [(_j.sent()).decision]).toBe('ask');
                // Two refused at once: the first on the card stays, the second never replaces it
                files.set('auto-refuse', 'Edit');
                return [4 /*yield*/, Promise.all([$.tool.call(__assign(__assign({}, call), { file_path: '/repo/a.md', tool_use_id: 'e2' })), $.tool.call(__assign(__assign({}, call), { file_path: '/repo/b.md', tool_use_id: 'e3' }))])];
            case 16:
                _j.sent();
                files.delete('auto-refuse');
                return [4 /*yield*/, clock.advance(1000)];
            case 17:
                _j.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (((_a = files.get("".concat(MEMORY, "/log.md"))) !== null && _a !== void 0 ? _a : '').includes('not put on its card: its card asks something already') ? true : undefined)];
                    }); }); })];
            case 18:
                _g.apply(void 0, [_j.sent()]).toBe(true);
                expect(put()).toHaveLength(2);
                // Pressed once the task has ended, nothing starts it again
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'The notes are written, without the files Claude Code refused.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })];
            case 19:
                _j.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 20:
                _j.sent();
                before = appended.filter(function (one) { return one.startsWith('a1: '); }).length;
                return [4 /*yield*/, press()];
            case 21:
                _j.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 22:
                _j.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, labels()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 23:
                _h.apply(void 0, [_j.sent()]).toBe(true);
                expect([resumed.filter(function (one) { return one.startsWith('a1: '); }), appended.filter(function (one) { return one.startsWith('a1: '); }).length]).toEqual([[], before]);
                return [4 /*yield*/, list.unmount()];
            case 24:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a command Claude Code refuses a task is shown whole on its card with where it runs and a Run it button; nothing runs but on that press (not words, not a task's own ask, not waiting), and the press changes no permission; the press runs exactly that command once, as the person's, shows only one quiet line while it runs, never the command again nor a drawing of the whole panel at each look at it (17 Nov, the box that flashed), and sends the task its output, an ended task started again only from a hook or the person's press, never a timer; a long one is stopped at its limit, and Stop stops it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, _a, files, clock, resumed, appended, pressRuns, redraws, refuse, list, button, pressed, buttons, stops, _b, _c, box, _d, command, _e, _f, _g, _h, check, _j, key, _k, _l, runner, how, ran, out, folder, _m, _o, runTime, _p, _q, _r, _s, _t, i, ranThen, _u, _v, _w, _x, woke, _y, _z, _0, _1, _2, _3, _4, _5;
    var _this = this;
    var _6, _7, _8, _9;
    return __generator(this, function (_10) {
        switch (_10.label) {
            case 0:
                agents = { a1: 'running' };
                _a = world(on, { agents: agents, unseen: [] }), files = _a.files, clock = _a.clock, resumed = _a.resumed, appended = _a.appended, pressRuns = _a.pressRuns;
                on('tool.check', function (_, e, next) { return (String(e.tool_use_id).startsWith('chk') ? { decision: 'ask' } : next(e)); });
                redraws = { count: 0 };
                on('ui.invalidate', function (_, e, next) { return ((redraws.count += 1), next(e)); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _10.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'find the name servers', wait: false, origin: composer })];
            case 2:
                _10.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Find the name servers', prompt: 'find the name servers' }))];
            case 3:
                _10.sent();
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
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                list = _10.sent();
                button = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                    case 1: return [2 /*return*/, (_a.sent()).find(function (b) { return b.props.label === label; })];
                                }
                            }); }); })];
                    });
                }); };
                pressed = function (label) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    var _c;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _b = (_a = list).press;
                                _c = {};
                                return [4 /*yield*/, button(label)];
                            case 1: return [2 /*return*/, _b.apply(_a, [(_c.key = (_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.key) !== null && _e !== void 0 ? _e : '', _c)])];
                        }
                    });
                }); };
                buttons = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (b) { return String(b.props.label); }).filter(function (label) { return /without it|Run it|Stop it|Open in Terminal|^Send now$/.test(label); })];
                    }
                }); }); };
                stops = function () { return pressRuns.filter(function (argv) { return argv[1] === 'stop'; }).length; };
                // Carry on without it runs nothing, and says nothing of words
                return [4 /*yield*/, refuse('b00', { command: 'dig +short NS example.net', description: 'Look up the name servers' })];
            case 5:
                // Carry on without it runs nothing, and says nothing of words
                _10.sent();
                return [4 /*yield*/, pressed('Carry on without it')];
            case 6:
                _10.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('do not do it, nor reach its result by other means'); })];
                    }); }); })];
            case 7:
                _b.apply(void 0, [_10.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "Your answer didn't run the command: only its Run it button runs it" })];
            case 8:
                _c.apply(void 0, [_10.sent()]).toBeUndefined();
                // Words never run it, even "Run it" typed in its reply box: the card says only the button does
                return [4 /*yield*/, refuse('b0', { command: 'dig +short NS example.org', description: 'Look up the name servers' })];
            case 9:
                // Words never run it, even "Run it" typed in its reply box: the card says only the button does
                _10.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })];
                        }
                    }); }); })];
            case 10:
                box = _10.sent();
                return [4 /*yield*/, list.input({ key: (_6 = box === null || box === void 0 ? void 0 : box.key) !== null && _6 !== void 0 ? _6 : '', text: 'Run it' })];
            case 11:
                _10.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "Your answer didn't run the command: only its Run it button runs it" })];
                    }); }); })];
            case 12:
                _d.apply(void 0, [_10.sent()]).toBeDefined();
                // Nor a task's own question with a button of that name
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'Shall I go on?', choices: ['Run it', 'Not now'], copy: 'dig +short NS example.org' })];
            case 13:
                // Nor a task's own question with a button of that name
                _10.sent();
                return [4 /*yield*/, pressed('Run it')];
            case 14:
                _10.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 15:
                _10.sent();
                expect(pressRuns).toEqual([]);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a1', text: '' })];
            case 16:
                _10.sent();
                command = "dig +short NS example.com @ns1.example.net | sort # it's the person's own";
                return [4 /*yield*/, refuse('b1', { command: command, description: 'Look up the name servers' })];
            case 17:
                _10.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Claude Code blocked this task: Run a command: Look up the name servers.' })];
                    }); }); })];
            case 18:
                _e.apply(void 0, [_10.sent()]).toBeDefined();
                // The command whole, where it runs and for how long at most, and the two buttons
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: command })];
            case 19:
                // The command whole, where it runs and for how long at most, and the two buttons
                _f.apply(void 0, [_10.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (t) { return /^Runs in .+, as a command you type would, for at most 10 min$/.test(t.text); })];
                        }
                    }); }); })];
            case 20:
                _g.apply(void 0, [_10.sent()]).toBeDefined();
                _h = expect;
                return [4 /*yield*/, buttons()];
            case 21:
                _h.apply(void 0, [_10.sent()]).toEqual(['Run it', 'Carry on without it']);
                // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
                return [4 /*yield*/, clock.advance(60000)];
            case 22:
                // Nothing runs without the press, however long it waits, and the task's own call is still Claude Code's to decide
                _10.sent();
                expect(pressRuns).toEqual([]);
                check = function (id) { return $.tool.check({ tool: 'Bash', input: { command: command, description: 'Look up the name servers' }, agentId: 'a1', tool_use_id: id }); };
                _j = expect;
                return [4 /*yield*/, check('chk-1')];
            case 23:
                _j.apply(void 0, [(_10.sent()).decision]).toBe('ask');
                return [4 /*yield*/, button('Run it')];
            case 24:
                key = (_8 = (_7 = (_10.sent())) === null || _7 === void 0 ? void 0 : _7.key) !== null && _8 !== void 0 ? _8 : '';
                return [4 /*yield*/, Promise.all([list.press({ key: key }), list.press({ key: key }).catch(function () { return undefined; })])];
            case 25:
                _10.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.length ? pressRuns : undefined)];
                    }); }); })];
            case 26:
                _k.apply(void 0, [_10.sent()]).toHaveLength(1);
                _l = (_9 = pressRuns[0]) !== null && _9 !== void 0 ? _9 : [], runner = _l[0], how = _l[1], ran = _l[2], out = _l[3], folder = _l[4];
                expect([String(runner).endsWith('/bin/run-it'), how, ran, folder]).toEqual([true, 'start', command, '/repo']);
                expect(String(out)).toMatch(/\/runs\/.+\.log$/);
                // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
                _m = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('Claudopus is running it for them now') && one.includes("What it prints goes to ".concat(out)); })];
                    }); }); })];
            case 27:
                // The task, still at work, is told it runs, where its output goes, and that its end comes as a message
                _m.apply(void 0, [_10.sent()]).toBeDefined();
                _o = expect;
                return [4 /*yield*/, check('chk-2')];
            case 28:
                _o.apply(void 0, [(_10.sent()).decision]).toBe('ask');
                // Running: one quiet line with how long it has run, and Stop it; the command is not shown again
                files.set(String(out), 'ns1.example.net.\n');
                return [4 /*yield*/, clock.advance(5000)];
            case 29:
                _10.sent();
                runTime = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent()).find(function (t) { return /^ · \d+[hms]/.test(t.text); })) === null || _a === void 0 ? void 0 : _a.text];
                    }
                }); }); };
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Running your command' })];
                    }); }); })];
            case 30:
                _p.apply(void 0, [_10.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, runTime()];
            case 31:
                _q.apply(void 0, [_10.sent()]).toBeDefined();
                // and nothing else about it: not the command, nor the answer said again on the card's line
                _r = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: command })];
            case 32:
                // and nothing else about it: not the command, nor the answer said again on the card's line
                _r.apply(void 0, [_10.sent()]).toBeUndefined();
                _s = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 33:
                _s.apply(void 0, [(_10.sent()).filter(function (t) { return /Run it”|Claudopus is running it/.test(t.text); }).map(function (t) { return t.text; })]).toEqual([]);
                _t = expect;
                return [4 /*yield*/, buttons()];
            case 34:
                _t.apply(void 0, [_10.sent()]).toEqual(['Stop it']);
                // While it prints, each look at it every 5 s draws nothing: the whole panel is drawn again only as calmly as for any running
                // work, every ten seconds at most
                redraws.count = 0;
                i = 0;
                _10.label = 35;
            case 35:
                if (!(i < 12)) return [3 /*break*/, 38];
                files.set(String(out), "ns1.example.net.\nline ".concat(i, "\n"));
                return [4 /*yield*/, clock.advance(5000)];
            case 36:
                (_10.sent());
                _10.label = 37;
            case 37:
                i++;
                return [3 /*break*/, 35];
            case 38:
                expect(redraws.count).toBeLessThanOrEqual(8);
                // The task ends meanwhile. The command's end starts it again with what it printed and where the whole is, from no timer: its card
                // says the output waits, and the person's press sends it
                agents.a1 = 'completed';
                return [4 /*yield*/, $.turn.complete({ answer: 'Waiting on the name servers.', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer', agentId: 'a1' })
                    // Its running time still moves, calmly, with the task ended
                ];
            case 39:
                _10.sent();
                // Its running time still moves, calmly, with the task ended
                return [4 /*yield*/, clock.advance(15000)];
            case 40:
                // Its running time still moves, calmly, with the task ended
                _10.sent();
                return [4 /*yield*/, runTime()];
            case 41:
                ranThen = _10.sent();
                expect(ranThen).toBeDefined();
                return [4 /*yield*/, clock.advance(15000)];
            case 42:
                _10.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, runTime()];
                            case 1: return [2 /*return*/, ((_a.sent()) !== ranThen ? true : undefined)];
                        }
                    }); }); })];
            case 43:
                _u.apply(void 0, [_10.sent()]).toBe(true);
                files.set(String(out), 'ns1.example.net.\nns2.example.net.\nclaudopus-exit 0\n');
                return [4 /*yield*/, clock.advance(5000)];
            case 44:
                _10.sent();
                return [4 /*yield*/, clock.advance(30000)];
            case 45:
                _10.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, buttons()];
                            case 1: return [2 /*return*/, ((_a.sent()).includes('Send now') ? true : undefined)];
                        }
                    }); }); })];
            case 46:
                _v.apply(void 0, [_10.sent()]).toBe(true);
                // with that one quiet line alone: the answer is not said again on the card
                _w = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Its output waits for Claude' })];
            case 47:
                // with that one quiet line alone: the answer is not said again on the card
                _w.apply(void 0, [_10.sent()]).toBeDefined();
                _x = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 48:
                _x.apply(void 0, [(_10.sent()).filter(function (t) { return /Run it”/.test(t.text); }).map(function (t) { return t.text; })]).toEqual([]);
                expect(resumed.filter(function (one) { return one.startsWith('a1: '); })).toEqual([]);
                return [4 /*yield*/, pressed('Send now')];
            case 49:
                _10.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (one) { return one.startsWith('a1: ') && one.includes('ns2.example.net.'); })];
                    }); }); })];
            case 50:
                woke = _10.sent();
                expect(woke).toContain("ran it for them, exactly as shown, once, in /repo:\n".concat(command, "\nIt ended well after"));
                expect(woke).toContain("Its whole output is in ".concat(out));
                expect(woke).toContain('it is no permission');
                expect(pressRuns).toHaveLength(1);
                _y = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, buttons()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? undefined : true)];
                        }
                    }); }); })];
            case 51:
                _y.apply(void 0, [_10.sent()]).toBe(true);
                // One sent to the background runs an hour at most; Stop it on its row stops it, and the task, at work, is told
                agents.a1 = 'running';
                return [4 /*yield*/, $.tool.call({ tool: 'Read', agentId: 'a1', file_path: '/repo/notes.md', tool_use_id: 'r1' })];
            case 52:
                _10.sent();
                return [4 /*yield*/, refuse('b2', { command: 'npm run soak', description: 'Run the soak test', run_in_background: true })];
            case 53:
                _10.sent();
                _z = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (t) { return /for at most 1 hour$/.test(t.text); })];
                        }
                    }); }); })];
            case 54:
                _z.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, pressed('Run it')];
            case 55:
                _10.sent();
                _0 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.length === 2 ? true : undefined)];
                    }); }); })];
            case 56:
                _0.apply(void 0, [_10.sent()]).toBe(true);
                return [4 /*yield*/, pressed('Stop it')];
            case 57:
                _10.sent();
                _1 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (stops() === 1 ? true : undefined)];
                    }); }); })];
            case 58:
                _1.apply(void 0, [_10.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(5000)];
            case 59:
                _10.sent();
                _2 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('npm run soak') && one.includes('was stopped by the person'); })];
                    }); }); })];
            case 60:
                _2.apply(void 0, [_10.sent()]).toBeDefined();
                // One held open with its own timeout of a minute is stopped by Claudopus at that limit
                return [4 /*yield*/, refuse('b3', { command: 'npm run slow', description: 'Run the slow check', timeout: 60000 })];
            case 61:
                // One held open with its own timeout of a minute is stopped by Claudopus at that limit
                _10.sent();
                return [4 /*yield*/, pressed('Run it')];
            case 62:
                _10.sent();
                _3 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (pressRuns.filter(function (argv) { return argv[2] === 'npm run slow'; }).length === 1 ? true : undefined)];
                    }); }); })];
            case 63:
                _3.apply(void 0, [_10.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(30000)];
            case 64:
                _10.sent();
                expect(stops()).toBe(1);
                return [4 /*yield*/, clock.advance(35000)];
            case 65:
                _10.sent();
                _4 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (stops() === 2 ? true : undefined)];
                    }); }); })];
            case 66:
                _4.apply(void 0, [_10.sent()]).toBe(true);
                _5 = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, appended.find(function (one) { return one.startsWith('a1: ') && one.includes('npm run slow') && one.includes('was stopped by Claudopus at its limit of 1 min'); })];
                    }); }); })];
            case 67:
                _5.apply(void 0, [_10.sent()]).toBeDefined();
                return [4 /*yield*/, list.unmount()];
            case 68:
                _10.sent();
                return [2 /*return*/];
        }
    });
}); });
