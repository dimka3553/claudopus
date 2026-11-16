// A Stop the person presses holds: the chat is told it was theirs, and nothing starts the work again until they ask
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
var _this = this;
// The case of 15 Nov: a message sent by mistake started work, the person pressed Stop on its card, the engine's notice said it was
// "stopped by Claude", and the chat sent it a message that started it again, twice
test('work the person stopped on its card is not started again by the chat, a message, an answer or the mod until they ask', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, stopped, resumed, sent, pane, notice, told, message, again, resume, fresh, _b, other, next, asked;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), stopped = _a.stopped, resumed = _a.resumed, sent = _a.sent;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'The bar above the input box just disappeared completely now.', wait: false, origin: composer })];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: 'Their words: "The bar above the input box just disappeared completely now."' }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _e.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })];
            case 5:
                _e.sent();
                expect(stopped).toContain('a1');
                notice = '<task-notification>\n<task-id>a1</task-id>\n<status>killed</status>\n<summary>Agent "Bar above the input box disappeared" was stopped by Claude</summary>\n</task-notification>';
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 6:
                told = (_e.sent());
                expect(((_c = told.context) !== null && _c !== void 0 ? _c : []).join('\n')).toContain('The person stopped this, not you: do not restart it, message it or start the same task again unless the person asks');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Carry on from where you stood.' })];
            case 7:
                message = _e.sent();
                expect(String(message.deny)).toContain('the person stopped');
                expect(sent).toHaveLength(0);
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm2', subagent_type: 'general-purpose', model: 'opus', description: 'Find why the prompt bar vanished', prompt: 'Their words: "The bar above the input box just disappeared completely now."' })];
            case 8:
                again = _e.sent();
                expect(String(again.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { resume: { agentId: 'a1' }, prompt: 'go on' }))];
            case 9:
                resume = (_e.sent());
                expect(String(resume.deny)).toContain('the person stopped');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: 'again' }))];
            case 10:
                fresh = (_e.sent());
                expect(String(fresh.deny)).toContain('the person stopped');
                expect(resumed.filter(function (line) { return line.startsWith('a1: '); })).toHaveLength(0);
                // Its card says so and keeps where it stood, with a way to start it again
                _b = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Stopped by you/ })];
            case 11:
                // Its card says so and keeps where it stood, with a way to start it again
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm3', subagent_type: 'general-purpose', model: 'opus', description: 'Check the ears', prompt: 'check the ears' })];
            case 12:
                other = _e.sent();
                expect(other.deny).toBeUndefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'Carry on with the bar work.', wait: false, origin: composer })];
            case 13:
                next = (_e.sent());
                expect(((_d = next.context) !== null && _d !== void 0 ? _d : []).join('\n')).toContain('only if this message asks for that');
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm4', to: 'a1', message: 'Carry on with the bar work.' })];
            case 14:
                asked = _e.sent();
                expect(asked.deny).toBeUndefined();
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
    var sent, BAR, pane, _a, _b, _c, _d, _e, _f, _g, _h, _j, notice, told, _k;
    var _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                sent = world(on).sent;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _m.sent();
                BAR = 'The bar above the input box just disappeared completely now.';
                return [4 /*yield*/, $.prompt.submit({ text: BAR, wait: false, origin: composer })];
            case 2:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Bar above the input box disappeared', prompt: "Their words: \"".concat(BAR, "\"") }))];
            case 3:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Read the bar code', prompt: 'read', parentAgentId: 'a1' }))];
            case 4:
                _m.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 5:
                pane = _m.sent();
                return [4 /*yield*/, pane.press({ key: 'stop-a1' })
                    // Their own words passed on in the same turn are no way round it
                ];
            case 6:
                _m.sent();
                // Their own words passed on in the same turn are no way round it
                _a = expect;
                _b = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: BAR })];
            case 7:
                // Their own words passed on in the same turn are no way round it
                _a.apply(void 0, [_b.apply(void 0, [(_m.sent()).deny])]).toContain('the person stopped');
                // nor its name instead of its id
                _c = expect;
                _d = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm2', to: 'Bar above the input box disappeared', message: 'carry on' })];
            case 8:
                // nor its name instead of its id
                _c.apply(void 0, [_d.apply(void 0, [(_m.sent()).deny])]).toContain('the person stopped');
                // nor its helper, by a message or a resume
                _e = expect;
                _f = String;
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm3', to: 'a2', message: 'go on' })];
            case 9:
                // nor its helper, by a message or a resume
                _e.apply(void 0, [_f.apply(void 0, [(_m.sent()).deny])]).toContain('the person stopped');
                _g = expect;
                _h = String;
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: '', resume: { agentId: 'a2' }, prompt: 'go on' }))];
            case 10:
                _g.apply(void 0, [_h.apply(void 0, [(_m.sent()).deny])]).toContain('the person stopped');
                expect(sent).toHaveLength(0);
                // Other work whose title shares most of its words is not held
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'm4', subagent_type: 'general-purpose', model: 'opus', description: 'Move the input box above the bar', prompt: 'move it' })];
            case 11:
                // Other work whose title shares most of its words is not held
                _j.apply(void 0, [(_m.sent()).deny]).toBeUndefined();
                // Once their message lifts it and the work goes on, a later stop by the chat is not theirs
                return [4 /*yield*/, $.prompt.submit({ text: 'Go on with the bar.', wait: false, origin: composer })];
            case 12:
                // Once their message lifts it and the work goes on, a later stop by the chat is not theirs
                _m.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm5', to: 'a1', message: 'Go on with the bar.' })];
            case 13:
                _m.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { resume: { agentId: 'a1' }, prompt: 'Go on with the bar.' }))];
            case 14:
                _m.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 15:
                _m.sent();
                notice = '<task-notification><task-id>a1</task-id><status>killed</status></task-notification>';
                return [4 /*yield*/, $.prompt.submit({ text: notice, wait: false, origin: { kind: 'task-notification' } })];
            case 16:
                told = (_m.sent());
                expect(((_l = told.context) !== null && _l !== void 0 ? _l : []).join('\n')).not.toContain('stopped this');
                _k = expect;
                return [4 /*yield*/, pane.find({ type: 'Text', text: /Stopped by you/ })];
            case 17:
                _k.apply(void 0, [_m.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
