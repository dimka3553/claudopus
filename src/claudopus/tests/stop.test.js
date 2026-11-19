// A Stop the person presses holds: the task stays stopped, grey, with its helpers and commands; the chat is told it was theirs, and
// nothing starts the task again but their word or their press on Start again
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
// The case of 15 Nov: a message sent by mistake started work, the person pressed Stop on its card, the engine's notice said it was
// "stopped by Claude", and the chat sent it a message that started it again, twice
test('a task the person stopped on its card stays stopped, grey, its helpers and commands stopped with it: the chat, a message, an answer and the mod start it again by no way, and only their word or their press on Start again does', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, stopped, resumed, sent, submitted, clock, files, pane, notice, told, message, again, resume, fresh, line, _b, _c, _d, _e, mine, _f, other, next, asked, _g, _h, _j, _k;
    var _this = this;
    var _l, _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                _a = world(on), stopped = _a.stopped, resumed = _a.resumed, sent = _a.sent, submitted = _a.submitted, clock = _a.clock, files = _a.files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _t.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'The bar above the input box just disappeared completely now.', wait: false, origin: composer })];
            case 2:
                _t.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: 'Their words: "The bar above the input box just disappeared completely now."' }))
                    // A helper of its own at work, and a command each of them runs in the background
                ];
            case 3:
                _t.sent();
                // A helper of its own at work, and a command each of them runs in the background
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the bar code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                // A helper of its own at work, and a command each of them runs in the background
                _t.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'c1', agentId: 'a1', command: 'npm run build', description: 'Build the app', run_in_background: true })];
            case 5:
                _t.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'c2', agentId: 'a2', command: 'npm test', description: 'Run the tests', run_in_background: true })];
            case 6:
                _t.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 7:
                pane = _t.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })
                    // The task, its helper and the commands of both are stopped
                ];
            case 8:
                _t.sent();
                // The task, its helper and the commands of both are stopped
                expect(__spreadArray([], stopped, true).sort()).toEqual(['a1', 'a2', 'bg-c1', 'bg-c2']);
                notice = '<task-notification>\n<task-id>a1</task-id>\n<status>killed</status>\n<summary>Agent "Bar above the input box disappeared" was stopped by Claude</summary>\n</task-notification>';
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 9:
                told = (_t.sent());
                expect(((_l = told.context) !== null && _l !== void 0 ? _l : []).join('\n')).toContain('The person stopped this, not you: do not restart it, message it or start the same task again unless the person asks');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Carry on from where you stood.' })];
            case 10:
                message = _t.sent();
                expect(String(message.deny)).toContain('the person stopped');
                expect(sent).toHaveLength(0);
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm2', subagent_type: 'general-purpose', model: 'opus', description: 'Find why the prompt bar vanished', prompt: 'Their words: "The bar above the input box just disappeared completely now."' })];
            case 11:
                again = _t.sent();
                expect(String(again.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { resume: { agentId: 'a1' }, prompt: 'go on' }))];
            case 12:
                resume = (_t.sent());
                expect(String(resume.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: 'again' }))];
            case 13:
                fresh = (_t.sent());
                expect(String(fresh.deny)).toContain('the person stopped');
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toHaveLength(0);
                line = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, pane.find({ type: 'Text', text: 'Stopped' })];
                }); }); };
                _b = expect;
                return [4 /*yield*/, line()];
            case 14:
                _c = [(_m = (_t.sent())) === null || _m === void 0 ? void 0 : _m.props.color];
                return [4 /*yield*/, line()];
            case 15:
                _b.apply(void 0, [_c.concat([(_o = (_t.sent())) === null || _o === void 0 ? void 0 : _o.props.dimColor])]).toEqual([undefined, true]);
                _d = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Build the app|Run the tests|Building the app|Running the tests/ })];
            case 16:
                _d.apply(void 0, [_t.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, keyed(pane, 'again-small-a1')];
            case 17:
                _e.apply(void 0, [_t.sent()]).toBeDefined();
                // and stays so: twenty minutes on it is still stopped, as the other chats read it too, nothing is at work, and nothing of
                // Claudopus has started it or its helper, written to the chat about it or stopped anything more
                return [4 /*yield*/, pane.unmount()];
            case 18:
                // and stays so: twenty minutes on it is still stopped, as the other chats read it too, nothing is at work, and nothing of
                // Claudopus has started it or its helper, written to the chat about it or stopped anything more
                _t.sent();
                return [4 /*yield*/, clock.advance(20 * 60000)];
            case 19:
                _t.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 20:
                pane = _t.sent();
                mine = JSON.parse((_p = files.get("".concat(MEMORY, "/live/engine-id.json"))) !== null && _p !== void 0 ? _p : '{}');
                expect([mine.cards, (_q = mine.ended) === null || _q === void 0 ? void 0 : _q.map(function (one) { return [one.id, one.status]; }), (_r = mine.helpers) === null || _r === void 0 ? void 0 : _r.map(function (one) { return [one.id, one.status]; })]).toEqual([[], [['a1', 'stopped']], [['a2', 'stopped']]]);
                _f = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: 'Nothing waits for you' })];
            case 21:
                _f.apply(void 0, [_t.sent()]).toBeDefined();
                expect([resumed, submitted.filter(function (one) { return !one.startsWith('<task-notification>'); }), sent, stopped.length]).toEqual([[], [], [], 4]);
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm3', subagent_type: 'general-purpose', model: 'opus', description: 'Check the ears', prompt: 'check the ears' })];
            case 22:
                other = _t.sent();
                expect(other.deny).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'Carry on with the bar work.', wait: false, origin: composer })];
            case 23:
                next = (_t.sent());
                expect(((_s = next.context) !== null && _s !== void 0 ? _s : []).join('\n')).toContain('only if this message asks for that');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm4', to: 'a1', message: 'Carry on with the bar work.' })];
            case 24:
                asked = _t.sent();
                expect(asked.deny).toBeUndefined();
                // Stopped again, it is held again; their press on Start again asks the chat in their name to send it a message
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { resume: { agentId: 'a1' }, prompt: 'Carry on with the bar work.' }))];
            case 25:
                // Stopped again, it is held again; their press on Start again asks the chat in their name to send it a message
                _t.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ key: 'stop-a1' })];
                    }); }); })];
            case 26:
                _g.apply(void 0, [_t.sent()]).toBeDefined();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })];
            case 27:
                _t.sent();
                _h = expect;
                _j = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a1', message: 'And once more.' })];
            case 28:
                _h.apply(void 0, [_j.apply(void 0, [(_t.sent()).deny])]).toContain('the person stopped');
                return [4 /*yield*/, pressed(pane, 'again-small-a1')];
            case 29:
                _t.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, submitted.find(function (one) { return one.includes('pressed "Start again" on "Bar above the input box disappeared" (a1), which they had stopped') && one.includes('SendMessage'); })];
                    }); }); })];
            case 30:
                _k.apply(void 0, [_t.sent()]).toBeDefined();
                return [4 /*yield*/, pane.unmount()];
            case 31:
                _t.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a stop that was not the person\'s, by the chat or the engine, is not held', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var agents, notice, told, message;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                agents = { agents: {} }.agents;
                world(on, { agents: agents });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 4:
                _b.sent();
                notice = '<task-notification><task-id>a1</task-id><status>killed</status></task-notification>';
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 5:
                told = (_b.sent());
                expect(((_a = told.context) !== null && _a !== void 0 ? _a : []).join('\n')).not.toContain('stopped this');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'go on' })];
            case 6:
                message = _b.sent();
                expect(message.deny).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('a helper the person stopped stays stopped: the work above it is told, and may not start it again', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var appended, pane, held, message, own;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appended = world(on).appended;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Measure the nostrils', prompt: 'measure', parentAgentId: 'a1' }))
                    // Its Stop is in its own Details, as the person presses it there
                ];
            case 4:
                _a.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a2', surface: 'desktop' }))];
            case 5:
                pane = _a.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a2' })];
            case 6:
                _a.sent();
                expect(appended.some(function (line) { return line.includes('stopped "Measure the nostrils"') && line.includes('do not restart it'); })).toBe(true);
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Measure the nostrils', prompt: 'measure again', parentAgentId: 'a1' }))];
            case 7:
                held = (_a.sent());
                expect(String(held.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'h1', agentId: 'a1', to: 'a2', message: 'go on' })];
            case 8:
                message = _a.sent();
                expect(String(message.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'h2', to: 'a1', message: 'how is it going?' })];
            case 9:
                own = _a.sent();
                expect(own.deny).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('a stop holds while the chat\'s turn for that message is still open, by name, for its helpers, and lets other work by alike titles go', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var sent, BAR, pane, _a, _b, _c, _d, _e, _f, _g, _h, _j, notice, told, _k, _l;
    var _this = this;
    var _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                sent = world(on).sent;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _p.sent();
                BAR = 'The bar above the input box just disappeared completely now.';
                return [4 /*yield*/, $.prompt.submit({ text: BAR, wait: false, origin: composer })];
            case 2:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: "Their words: \"".concat(BAR, "\"") }))];
            case 3:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the bar code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _p.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                pane = _p.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })
                    // Their own words passed on in the same turn are no way round it
                ];
            case 6:
                _p.sent();
                // Their own words passed on in the same turn are no way round it
                _a = expect;
                _b = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: BAR })];
            case 7:
                // Their own words passed on in the same turn are no way round it
                _a.apply(void 0, [_b.apply(void 0, [(_p.sent()).deny])]).toContain('the person stopped');
                // nor its name instead of its id
                _c = expect;
                _d = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm2', to: 'Bar above the input box disappeared', message: 'carry on' })];
            case 8:
                // nor its name instead of its id
                _c.apply(void 0, [_d.apply(void 0, [(_p.sent()).deny])]).toContain('the person stopped');
                // nor its helper, by a message or a resume
                _e = expect;
                _f = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm3', to: 'a2', message: 'go on' })];
            case 9:
                // nor its helper, by a message or a resume
                _e.apply(void 0, [_f.apply(void 0, [(_p.sent()).deny])]).toContain('the person stopped');
                _g = expect;
                _h = String;
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: '', resume: { agentId: 'a2' }, prompt: 'go on' }))];
            case 10:
                _g.apply(void 0, [_h.apply(void 0, [(_p.sent()).deny])]).toContain('the person stopped');
                expect(sent).toHaveLength(0);
                // Other work whose title shares most of its words is not held
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm4', subagent_type: 'general-purpose', model: 'opus', description: 'Move the input box above the bar', prompt: 'move it' })];
            case 11:
                // Other work whose title shares most of its words is not held
                _j.apply(void 0, [(_p.sent()).deny]).toBeUndefined();
                // Once their message lifts it and the work goes on, a later stop by the chat is not theirs
                return [4 /*yield*/, $.prompt.submit({ text: 'Go on with the bar.', wait: false, origin: composer })];
            case 12:
                // Once their message lifts it and the work goes on, a later stop by the chat is not theirs
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a1', message: 'Go on with the bar.' })];
            case 13:
                _p.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { resume: { agentId: 'a1' }, prompt: 'Go on with the bar.' }))];
            case 14:
                _p.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 15:
                _p.sent();
                notice = '<task-notification><task-id>a1</task-id><status>killed</status></task-notification>';
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 16:
                told = (_p.sent());
                expect(((_m = told.context) !== null && _m !== void 0 ? _m : []).join('\n')).not.toContain('stopped this');
                // Its card is stopped all the same, grey, but with no Start again: that is for a stop of the person's own
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, pane.find({ type: 'Text', text: 'Stopped' })];
                    }); }); })];
            case 17:
                // Its card is stopped all the same, grey, but with no Start again: that is for a stop of the person's own
                _k.apply(void 0, [(_o = (_p.sent())) === null || _o === void 0 ? void 0 : _o.props.dimColor]).toBe(true);
                _l = expect;
                return [4 /*yield*/, keyed(pane, 'again-small-a1')];
            case 18:
                _l.apply(void 0, [_p.sent()]).toBeUndefined();
                return [4 /*yield*/, pane.unmount()];
            case 19:
                _p.sent();
                return [2 /*return*/];
        }
    });
}); });
