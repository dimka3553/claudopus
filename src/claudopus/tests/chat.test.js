// The chat: its role, handing work over, keys and pastes, names, the mod's tools, compaction, after a reply, the principles
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
var _this = this;
test('a chat gets its role once, is told to start a fresh agent from a brief for every message, and every message is saved', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, first, second, words;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _k.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the upload page', wait: false, origin: composer })];
            case 2:
                first = _k.sent();
                expect((_a = first.context) === null || _a === void 0 ? void 0 : _a.join('\n')).toContain('CHAT ROLE');
                expect((_b = first.context) === null || _b === void 0 ? void 0 : _b.join('\n')).toContain('Subjects so far');
                expect((_c = first.context) === null || _c === void 0 ? void 0 : _c.join('\n')).toContain("This chat's saved words: ".concat(MEMORY, "/words/engine-id.md"));
                expect((_d = first.context) === null || _d === void 0 ? void 0 : _d.join('\n')).toContain('start a fresh agent');
                expect((_e = first.context) === null || _e === void 0 ? void 0 : _e.join('\n')).toContain('Only a message that steers what listed work is already doing');
                expect((_f = first.context) === null || _f === void 0 ? void 0 : _f.join('\n')).toContain('A fault, a question or a new ask gets its own agent');
                return [4 /*yield*/, $.prompt.submit({ text: 'and the nose', wait: false, origin: composer, turnId: 'turn-1' })];
            case 3:
                second = _k.sent();
                expect((_g = second.context) === null || _g === void 0 ? void 0 : _g.length).toBe(1);
                expect((_h = second.context) === null || _h === void 0 ? void 0 : _h[0]).toContain('start a fresh agent');
                words = (_j = files.get("".concat(MEMORY, "/words/engine-id.md"))) !== null && _j !== void 0 ? _j : '';
                expect(words).toContain('fix the upload page');
                expect(words).toContain('and the nose');
                return [2 /*return*/];
        }
    });
}); });
test('work never starts as a copy of the chat: a fork or an agent with no model is refused, and a brief gets the rules for the work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, r, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                files = world(on, { tokens: 400000 }).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                r = _f.sent();
                expect((_d = r.context) === null || _d === void 0 ? void 0 : _d.join('\n')).not.toContain('fork');
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'a1', prompt: 'fix the nose', subagent_type: 'fork' })];
            case 3:
                _a.apply(void 0, [(_f.sent()).deny]).toContain('never started as a copy');
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'a2', prompt: 'fix the nose', subagent_type: 'general-purpose' })];
            case 4:
                _b.apply(void 0, [(_f.sent()).deny]).toContain('the model named');
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'a3', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' })];
            case 5:
                _c.apply(void 0, [(_f.sent()).deny]).toBeUndefined();
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('refused an Agent call that copies the chat');
                // The brief reaches the work with the rules for every piece of work and the path of the chat's saved words after it
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', prompt: 'BRIEF' }))];
            case 6:
                // The brief reaches the work with the rules for every piece of work and the path of the chat's saved words after it
                _f.sent();
                expect((_e = prompts[0]) === null || _e === void 0 ? void 0 : _e.startsWith('BRIEF')).toBe(true);
                expect(prompts[0]).toContain('WORK ROLE');
                expect(prompts[0]).toContain("".concat(MEMORY, "/words/engine-id.md"));
                return [2 /*return*/];
        }
    });
}); });
test('no agent is started on an older model or on Haiku, by the chat or by a piece of work; the three aliases and their newest versions pass', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, call, _i, _a, model, _b, _c, _d, model, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _l.sent();
                call = function (model, agentId) { return $.tool.call(__assign({ tool: 'Agent', tool_use_id: "m-".concat(model, "-").concat(agentId !== null && agentId !== void 0 ? agentId : ''), prompt: 'fix the nose', subagent_type: 'general-purpose', model: model }, (agentId ? { agentId: agentId } : {}))); };
                _i = 0, _a = ['opus', 'sonnet', 'fable', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2', 'claude-opus-5.5', 'claude-opus-5-6', 'claude-opus-6', 'claude-fable-5-3', 'claude-sonnet-6', 'claude-opus-5-5-20261001', 'opus[1m]', 'us.anthropic.claude-opus-5-5-v1:0', 'inherit'];
                _l.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                model = _a[_i];
                _b = expect;
                return [4 /*yield*/, call(model)];
            case 4:
                _b.apply(void 0, [(_l.sent()).deny]).toBeUndefined();
                _l.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                _c = 0, _d = ['haiku', 'claude-haiku-5-5', 'claude-opus-4-8', 'claude-opus-5', 'claude-sonnet-5', 'claude-fable-5-1', 'claude-3-5-sonnet-20241022', 'claude-sonnet-4-5-20250929'];
                _l.label = 7;
            case 7:
                if (!(_c < _d.length)) return [3 /*break*/, 10];
                model = _d[_c];
                _e = expect;
                return [4 /*yield*/, call(model)];
            case 8:
                _e.apply(void 0, [(_l.sent()).deny]).toContain('No work runs on');
                _l.label = 9;
            case 9:
                _c++;
                return [3 /*break*/, 7];
            case 10:
                _f = expect;
                return [4 /*yield*/, call('claude-opus-4-8')];
            case 11:
                _f.apply(void 0, [(_l.sent()).deny]).toBe('No work runs on Opus 4.8. Name the model by its alias: "opus" for most work, "sonnet" for long legwork, "fable" only for heavy or really complicated work, "opus" or "fable" for checking what was built, never weaker than what built it. Never an older version, never Haiku.');
                // A helper a piece of work starts is held to the same, and one that names no model keeps its work's
                _g = expect;
                return [4 /*yield*/, call('haiku', 'a1')];
            case 12:
                // A helper a piece of work starts is held to the same, and one that names no model keeps its work's
                _g.apply(void 0, [(_l.sent()).deny]).toContain('No work runs on Haiku');
                _h = expect;
                return [4 /*yield*/, call('claude-opus-4-8', 'a1')];
            case 13:
                _h.apply(void 0, [(_l.sent()).deny]).toContain('No work runs on Opus 4.8');
                _j = expect;
                return [4 /*yield*/, call('sonnet', 'a1')];
            case 14:
                _j.apply(void 0, [(_l.sent()).deny]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'h0', prompt: 'look it up', subagent_type: 'general-purpose', agentId: 'a1' })];
            case 15:
                _k.apply(void 0, [(_l.sent()).deny]).toBeUndefined();
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('refused an Agent call on Opus 4.8');
                return [2 /*return*/];
        }
    });
}); });
test('with Haiku named in the settings for a kind of work, an agent on Haiku is let through; an older model still is not', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = world(on).files;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ models: { legwork: 'haiku' } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'index the photos', wait: false, origin: composer })];
            case 2:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'c1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' })];
            case 3:
                _a.apply(void 0, [(_c.sent()).deny]).toBeUndefined();
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'c2', prompt: 'index', subagent_type: 'general-purpose', model: 'claude-opus-4-8' })];
            case 4:
                _b.apply(void 0, [(_c.sent()).deny]).toContain('No work runs on Opus 4.8');
                return [2 /*return*/];
        }
    });
}); });
test('with the handing-over switched off the mod refuses no model and moves no step', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, stepped, _b, _c, _d, _e, _, e_1_1;
    var _f, e_1, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = world(on), files = _a.files, stepped = _a.stepped;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ agents: false }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 'o1', prompt: 'index', subagent_type: 'general-purpose', model: 'haiku' })];
            case 2:
                _b.apply(void 0, [(_j.sent()).deny]).toBeUndefined();
                _j.label = 3;
            case 3:
                _j.trys.push([3, 8, 9, 14]);
                _c = true, _d = __asyncValues($.turn.step({ turnId: 't', index: 0, model: 'claude-opus-4-8', messageCount: 2, agentId: 'a1' }));
                _j.label = 4;
            case 4: return [4 /*yield*/, _d.next()];
            case 5:
                if (!(_e = _j.sent(), _f = _e.done, !_f)) return [3 /*break*/, 7];
                _h = _e.value;
                _c = false;
                _ = _h;
                void _;
                _j.label = 6;
            case 6:
                _c = true;
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 14];
            case 8:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 14];
            case 9:
                _j.trys.push([9, , 12, 13]);
                if (!(!_c && !_f && (_g = _d.return))) return [3 /*break*/, 11];
                return [4 /*yield*/, _g.call(_d)];
            case 10:
                _j.sent();
                _j.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 13: return [7 /*endfinally*/];
            case 14:
                expect(stepped).toEqual(['claude-opus-4-8']);
                return [2 /*return*/];
        }
    });
}); });
test("the work's rules name where the admin runner is, the one way work uses a Mac's password", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'clear the disk', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', prompt: 'BRIEF' }))];
            case 3:
                _a.sent();
                expect(prompts[0]).toMatch(/an admin command runs through `\/\S*mods\/claudopus\/bin\/admin`/);
                expect(prompts[0]).not.toContain('{admin}');
                return [2 /*return*/];
        }
    });
}); });
test('work uses a kept key without reading it: the keychain is not read, and what a tool answers comes back with the key hidden', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, read, _a, _b, _c, _d, _i, _e, command, _f, _g, _h, _j, tool, field, _k, _l, _m, _o, _p, _q, _r, _s, shown, read2;
    var _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _u.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })];
            case 2:
                _u.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', prompt: 'BRIEF' }))];
            case 3:
                _u.sent();
                expect(prompts[0]).toMatch(/\/\S*mods\/claudopus\/bin\/secret NAME/);
                expect(prompts[0]).not.toContain('{secret}');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k1', command: 'security find-generic-password -s claudopus-secret -a API_KEY -w', agentId: 'w1' })];
            case 4:
                read = _u.sent();
                expect(read.deny).toContain('never read or printed');
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k2', command: 'security dump-keychain -d', agentId: 'w1' })];
            case 5:
                _a.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k5', command: 'security find-generic-password -wa API_KEY', agentId: 'w1' })];
            case 6:
                _b.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k6', command: 'CLAUDOPUS_SECRET_SERVICE=other bin/secret API_KEY here "env"', agentId: 'w1' })];
            case 7:
                _c.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                // A command that only lists what the keychain holds, with no value, runs
                _d = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k7', command: 'security find-generic-password -s claudopus-secret -a API_KEY', agentId: 'w1' })];
            case 8:
                // A command that only lists what the keychain holds, with no value, runs
                _d.apply(void 0, [(_u.sent()).deny]).toBeUndefined();
                _i = 0, _e = ['mods/claudopus/bin/keyring get claudopus-admin here', '"$HOME/x/bin/keyring" "get" claudopus-secret API_KEY', 'cd ~/.local/share/claudopus && cat keyring/claudopus-admin/here', 'keyring set claudopus-admin-gate seal'];
                _u.label = 9;
            case 9:
                if (!(_i < _e.length)) return [3 /*break*/, 12];
                command = _e[_i];
                _f = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "kr-".concat(command.length), command: command, agentId: 'w1' })];
            case 10:
                _f.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _u.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12:
                _g = 0, _h = [['Read', 'file_path'], ['Write', 'file_path'], ['Grep', 'path'], ['Glob', 'path']];
                _u.label = 13;
            case 13:
                if (!(_g < _h.length)) return [3 /*break*/, 16];
                _j = _h[_g], tool = _j[0], field = _j[1];
                _k = expect;
                return [4 /*yield*/, $.tool.call(__assign(__assign((_t = { tool: tool, tool_use_id: "kf-".concat(tool) }, _t[field] = '~/.local/share/claudopus/keyring/claudopus-admin/here', _t), (tool === 'Write' ? { content: 'x' } : { pattern: '.' })), { agentId: 'w1' }))];
            case 14:
                _k.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _u.label = 15;
            case 15:
                _g++;
                return [3 /*break*/, 13];
            case 16:
                _l = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'kg', command: 'git commit -m "keyring for Linux"', agentId: 'w1' })];
            case 17:
                _l.apply(void 0, [(_u.sent()).deny]).toBeUndefined();
                _m = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'kd', command: 'git diff --no-index /dev/null ~/.local/share/claudopus/keyring/claudopus-admin/here', agentId: 'w1' })];
            case 18:
                _m.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _o = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Grep', tool_use_id: 'ku', path: '~/.local/share', pattern: '.', agentId: 'w1' })];
            case 19:
                _o.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                _p = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Grep', tool_use_id: 'kb', path: '~/GitHub', pattern: '.', glob: 'keyring/**', agentId: 'w1' })];
            case 20:
                _p.apply(void 0, [(_u.sent()).deny]).toContain('never read');
                // Nothing kept: what the tool answers passes as it was
                _q = expect;
                _s = (_r = JSON).stringify;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k3', command: 'echo $API_KEY', agentId: 'w1' })];
            case 21:
                // Nothing kept: what the tool answers passes as it was
                _q.apply(void 0, [_s.apply(_r, [(_u.sent()).result])]).toContain('token is none');
                files.set('keychain:API_KEY', 'sk-live-123456');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'k4', command: 'bin/secret API_KEY here "echo $API_KEY"', agentId: 'w1' })];
            case 22:
                shown = _u.sent();
                expect(JSON.stringify(shown.result)).toContain('token is [hidden API_KEY]');
                expect(JSON.stringify(shown.result)).not.toContain('sk-live-123456');
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'k8', file_path: '/repo/.env' })];
            case 23:
                read2 = _u.sent();
                expect(read2.deny).toBeUndefined();
                expect(JSON.stringify(read2.result)).toContain('API_KEY=[hidden API_KEY]');
                expect(JSON.stringify(read2.result)).not.toContain('sk-live-123456');
                return [2 /*return*/];
        }
    });
}); });
test('work never writes into the boxes folder or reads the boxes\' keychain service, by any common way, while the admin and secret runners still run', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, bin, n, call, refused, runs, _i, _a, _b, tool, path, _c, _d, _e;
    var _this = this;
    var _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'deploy it', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', prompt: 'BRIEF' }))];
            case 3:
                _j.sent();
                bin = (_h = (_g = /(\/\S*mods\/claudopus\/bin)\/secret NAME/.exec((_f = prompts[0]) !== null && _f !== void 0 ? _f : '')) === null || _g === void 0 ? void 0 : _g[1]) !== null && _h !== void 0 ? _h : '';
                expect(bin).not.toBe('');
                n = 0;
                call = function (input_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([input_1], args_1, true), void 0, function (input, agentId) {
                        if (agentId === void 0) { agentId = 'w1'; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', tool_use_id: "b".concat(n++), agentId: agentId }, input))];
                                case 1: return [2 /*return*/, (_a.sent()).deny];
                            }
                        });
                    });
                };
                refused = function (command, agentId) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            _b = [command];
                            return [4 /*yield*/, call({ command: command }, agentId)];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.concat([_c.sent()])]).toEqual([command, expect.stringContaining('theirs alone')])];
                    }
                }); }); };
                runs = function (command) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            _b = [command];
                            return [4 /*yield*/, call({ command: command })];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.concat([_c.sent()])]).toEqual([command, undefined])
                            // A direct command and redirections, in every spelling of the folder
                        ];
                    }
                }); }); };
                // A direct command and redirections, in every spelling of the folder
                return [4 /*yield*/, refused("echo '{\"id\":\"x\",\"kind\":\"admin\",\"host\":\"here\"}' > ~/.claude/claudopus/boxes/x.json")];
            case 4:
                // A direct command and redirections, in every spelling of the folder
                _j.sent();
                return [4 /*yield*/, refused('cat req.json >> "$HOME/.claude/claudopus/boxes/$(uuidgen).json"')];
            case 5:
                _j.sent();
                return [4 /*yield*/, refused('cp req.json ${HOME}/.claude//claudopus/./boxes/')];
            case 6:
                _j.sent();
                return [4 /*yield*/, refused('tee /home/sam/.claude/claudopus/../claudopus/boxes/a.json < req.json')];
            case 7:
                _j.sent();
                return [4 /*yield*/, refused('cp req.json ~/.cl*/claudo*/box?s/')];
            case 8:
                _j.sent();
                return [4 /*yield*/, refused("cp req.json ~/.claude/\"claud\"'opus'/bo\\xes/")];
            case 9:
                _j.sent();
                return [4 /*yield*/, refused('cd ~/.claude && cd claudopus && cp /tmp/req.json boxes/a.json')];
            case 10:
                _j.sent();
                return [4 /*yield*/, refused('cp req.json "$CLAUDE_CONFIG_DIR/claudopus/boxes/"')
                    // Pointing the runners at a folder of one's own
                ];
            case 11:
                _j.sent();
                // Pointing the runners at a folder of one's own
                return [4 /*yield*/, refused("CLAUDOPUS_BOXES=/tmp/mine ".concat(bin, "/secret API_KEY here 'true'"))
                    // Reading the service, with or without the value
                ];
            case 12:
                // Pointing the runners at a folder of one's own
                _j.sent();
                // Reading the service, with or without the value
                return [4 /*yield*/, refused('security find-generic-password -s claudopus-box -a 0f1e2d3c-4b5a-4987-a654-3210fedcba98')];
            case 13:
                // Reading the service, with or without the value
                _j.sent();
                return [4 /*yield*/, refused("/usr/bin/security find-generic-password -s 'claudopus-box' -a x -w")];
            case 14:
                _j.sent();
                return [4 /*yield*/, refused('security find-generic-password -s claudopus-b* -a x')
                    // Another language's program handed the code inline: a helper's call
                ];
            case 15:
                _j.sent();
                // Another language's program handed the code inline: a helper's call
                return [4 /*yield*/, refused("python3 -c \"import subprocess; subprocess.run(['security','find-generic-password','-s','claudopus-box','-a','x'])\"")];
            case 16:
                // Another language's program handed the code inline: a helper's call
                _j.sent();
                return [4 /*yield*/, refused("node -e \"require('fs').writeFileSync(require('os').homedir() + '/.claude/claudopus/boxes/a.json', '{}')\"")
                    // A script that does it, run every usual way, and a planted copy named like a runner
                ];
            case 17:
                _j.sent();
                // A script that does it, run every usual way, and a planted copy named like a runner
                files.set('/repo/plant.sh', 'cat > ~/.claude/claudopus/boxes/a.json <<EOF\n{"kind":"admin","host":"here"}\nEOF\n');
                files.set('/tmp/peek.py', "import subprocess\nsubprocess.run(['/usr/bin/security', 'find-generic-password', '-s', 'claudopus-box', '-a', 'x', '-w'])\n");
                files.set('/tmp/bin/secret', '#!/bin/bash\nmkdir -p "$HOME/.claude/claudopus/boxes"\n');
                return [4 /*yield*/, refused('bash plant.sh')];
            case 18:
                _j.sent();
                return [4 /*yield*/, refused('./plant.sh')];
            case 19:
                _j.sent();
                return [4 /*yield*/, refused('cd /tmp && sh /repo/plant.sh')];
            case 20:
                _j.sent();
                return [4 /*yield*/, refused('env FOO=1 python3 /tmp/peek.py')];
            case 21:
                _j.sent();
                return [4 /*yield*/, refused('source /repo/plant.sh')];
            case 22:
                _j.sent();
                return [4 /*yield*/, refused("/tmp/bin/secret API_KEY here 'true'")];
            case 23:
                _j.sent();
                files.set('/work/tree/p.sh', 'cp /tmp/req.json ~/.claude/claudopus/boxes/\n');
                return [4 /*yield*/, refused('cd /work/tree && ./p.sh')];
            case 24:
                _j.sent();
                return [4 /*yield*/, refused('cd ~/.claude && cp req.json claudopus/boxes/')];
            case 25:
                _j.sent();
                return [4 /*yield*/, refused('cd ~/.claude; cp req.json ./claudopus/boxes/a.json')];
            case 26:
                _j.sent();
                return [4 /*yield*/, refused("zsh -c 'cd /work/tree && ./p.sh'")];
            case 27:
                _j.sent();
                return [4 /*yield*/, refused('sudo -u sam /work/tree/p.sh')];
            case 28:
                _j.sent();
                return [4 /*yield*/, refused('cat plant.sh | bash')];
            case 29:
                _j.sent();
                return [4 /*yield*/, refused('bash < /repo/plant.sh')];
            case 30:
                _j.sent();
                return [4 /*yield*/, refused('timeout 5 ./plant.sh')];
            case 31:
                _j.sent();
                return [4 /*yield*/, refused('nice -n 5 bash plant.sh')];
            case 32:
                _j.sent();
                files.set('/repo/plant.ts', "Bun.write(`${process.env.HOME}/.claude/claudopus/boxes/a.json`, '{}')\n");
                return [4 /*yield*/, refused('bun run plant.ts')
                    // Capitals, which this Mac's files take as the same, brace expansion, and another language's keychain library
                ];
            case 33:
                _j.sent();
                // Capitals, which this Mac's files take as the same, brace expansion, and another language's keychain library
                return [4 /*yield*/, refused('cp req.json ~/.Claude/Claudopus/Boxes/')];
            case 34:
                // Capitals, which this Mac's files take as the same, brace expansion, and another language's keychain library
                _j.sent();
                return [4 /*yield*/, refused('cp req.json ~/.claude/claudopus/box{e,}s/')];
            case 35:
                _j.sent();
                files.set('/repo/peek.swift', 'import Security\nlet q = [kSecAttrService: "claudopus-box", kSecReturnData: true] as CFDictionary\n');
                return [4 /*yield*/, refused('swift peek.swift')];
            case 36:
                _j.sent();
                return [4 /*yield*/, refused("python3 -c \"import keyring; print(keyring.get_password('claudopus-box', 'x'))\"")
                    // A helper work starts is held to it as the work is
                ];
            case 37:
                _j.sent();
                // A helper work starts is held to it as the work is
                return [4 /*yield*/, refused('bash /repo/plant.sh', 'helper-1')
                    // A file written or edited into the folder
                ];
            case 38:
                // A helper work starts is held to it as the work is
                _j.sent();
                _i = 0, _a = [['Write', '/home/sam/.claude/claudopus/boxes/a.json'], ['Edit', '~/.claude/claudopus/boxes/b.json'], ['Write', '/home/sam/.claude/claudopus/./boxes'], ['Write', '/home/sam/.Claude/claudopus/Boxes/a.json'], ['Write', '/home/sam/.claude/plugins/cache/claudopus/claudopus/9.9.9/bin/secret']];
                _j.label = 39;
            case 39:
                if (!(_i < _a.length)) return [3 /*break*/, 42];
                _b = _a[_i], tool = _b[0], path = _b[1];
                _c = expect;
                _d = [tool, path];
                return [4 /*yield*/, $.tool.call({ tool: tool, tool_use_id: "b".concat(n++), agentId: 'w1', file_path: path, content: '{}', old_string: 'a', new_string: 'b' })];
            case 40:
                _c.apply(void 0, [_d.concat([(_j.sent()).deny])]).toEqual([tool, path, expect.stringContaining('theirs alone')]);
                _j.label = 41;
            case 41:
                _i++;
                return [3 /*break*/, 39];
            case 42:
                // The runners themselves, and what only looks near the folder or the service, still run
                files.set('keychain:API_KEY', 'sk-live-123456');
                return [4 /*yield*/, runs("".concat(bin, "/secret API_KEY here 'curl -H \"Authorization: Bearer $API_KEY\" https://api.example.com'"))
                    // The admin runner past its own gate, here set never to ask as Config seals it (gate.test.tsx holds the asking)
                ];
            case 43:
                _j.sent();
                // The admin runner past its own gate, here set never to ask as Config seals it (gate.test.tsx holds the asking)
                files.set('keychain:gate', 'kept-key');
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }));
                return [4 /*yield*/, runs("".concat(bin, "/admin here 'whoami'"))];
            case 44:
                _j.sent();
                return [4 /*yield*/, runs("bash ".concat(bin, "/secret API_KEY here 'true'"))];
            case 45:
                _j.sent();
                return [4 /*yield*/, runs('cat src/claudopus/boxes.tsx && rg -n boxes src/claudopus')];
            case 46:
                _j.sent();
                return [4 /*yield*/, runs('ls ~/.claude/claudopus/*')
                    // Looks that only read, a commit message naming the folder, and work in a worktree kept under a .claude folder of the repo
                ];
            case 47:
                _j.sent();
                // Looks that only read, a commit message naming the folder, and work in a worktree kept under a .claude folder of the repo
                return [4 /*yield*/, runs('ls ~/.claude/claudopus/boxes && rg -n boxes ~/.claude/claudopus/rules')];
            case 48:
                // Looks that only read, a commit message naming the folder, and work in a worktree kept under a .claude folder of the repo
                _j.sent();
                return [4 /*yield*/, runs('git commit -qm "Refuse writes into ~/.claude/claudopus/boxes" && gh pr create --body "claudopus-box via security"')];
            case 49:
                _j.sent();
                return [4 /*yield*/, runs("rg -n 'security|claudopus-box' mods/claudopus")];
            case 50:
                _j.sent();
                return [4 /*yield*/, runs('cd /code/claudopus/.claude/worktrees/agent-1 && rg -n boxes src && cat src/claudopus/boxes.tsx')];
            case 51:
                _j.sent();
                return [4 /*yield*/, runs("".concat(bin, "/secret --list"))];
            case 52:
                _j.sent();
                return [4 /*yield*/, runs('security find-generic-password -s claudopus-secret -a API_KEY')];
            case 53:
                _j.sent();
                files.set('/repo/build.sh', 'node src/claudopus/build.mjs\n');
                return [4 /*yield*/, runs('bash build.sh')];
            case 54:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Write', tool_use_id: "b".concat(n++), agentId: 'w1', file_path: '/home/sam/.claude/claudopus/streams/x.md', content: 'boxes' })];
            case 55:
                _e.apply(void 0, [(_j.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('work reaches main only through the release runner: its rules name it, and a push or merge to main by hand is refused', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var refused, _i, _a, _b, i, command, r, allowed, _c, _d, _e, i, command, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'ship it', wait: false, origin: composer })];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { model: 'opus', prompt: 'BRIEF' }))];
            case 3:
                _g.sent();
                expect(prompts[0]).toMatch(/main is reached through `\/\S*mods\/claudopus\/bin\/release`/);
                expect(prompts[0]).not.toContain('{release}');
                refused = [
                    'git push origin main',
                    'cd /repo && git push -q origin HEAD:main',
                    'git -C /repo push origin +main',
                    'git push origin work:refs/heads/master',
                    'git push --force origin main; echo done',
                    'gh pr merge 12 --squash',
                    'git push origin "main"',
                    "git push -u origin HEAD:'main'",
                    'git push --no-verify origin work/one',
                    'RELEASE_PUSH=1 git push origin HEAD',
                    'gh api -X PUT repos/me/it/pulls/3/merge',
                    'echo hi && git -c user.name=x push origin main',
                    'sudo git push origin main',
                    'env FOO=1 git push origin main',
                    "bash -c 'git push origin main'",
                    'git push --repo=origin main',
                ];
                _i = 0, _a = refused.entries();
                _g.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                _b = _a[_i], i = _b[0], command = _b[1];
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "p".concat(i), command: command, agentId: 'w1' })];
            case 5:
                r = _g.sent();
                expect(r.deny).toContain('never pushes or merges to main itself');
                expect(r.deny).toMatch(/bin\/release\.$/);
                _g.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                allowed = ['git push origin work/one', 'git push -u origin main-menu-fix', 'git pull origin main', 'git merge origin/main', 'git log origin/main', 'git checkout main', 'git commit -qam "git push of main across Macs, merges onto main"', 'echo "never git push origin main"', 'git push', 'grep -n RELEASE_PUSH= bin/release'];
                _c = 0, _d = allowed.entries();
                _g.label = 8;
            case 8:
                if (!(_c < _d.length)) return [3 /*break*/, 11];
                _e = _d[_c], i = _e[0], command = _e[1];
                _f = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "a".concat(i), command: command, agentId: 'w1' })];
            case 9:
                _f.apply(void 0, [(_g.sent()).deny]).toBeUndefined();
                _g.label = 10;
            case 10:
                _c++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/];
        }
    });
}); });
test('a large paste is saved to a file and left out of the chat', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, paste, r, saved, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                paste = "start ".concat('x'.repeat(20000), " end");
                return [4 /*yield*/, $.prompt.submit({ text: paste, wait: false, origin: composer })];
            case 2:
                r = _f.sent();
                expect((_e = (_d = r.text) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0).toBeLessThan(2000);
                expect(r.text).toContain('were saved to');
                saved = __spreadArray([], files.entries(), true).find(function (_a) {
                    var path = _a[0];
                    return path.startsWith("".concat(MEMORY, "/pastes/"));
                });
                expect(saved === null || saved === void 0 ? void 0 : saved[1]).toBe(paste);
                // and the chat does not read it back in: the agent that needs it reads it
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'p1', file_path: saved === null || saved === void 0 ? void 0 : saved[0] })];
            case 3:
                // and the chat does not read it back in: the agent that needs it reads it
                _a.apply(void 0, [(_f.sent()).deny]).toContain('Start a fresh agent');
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Grep', tool_use_id: 'p2', pattern: 'end', path: "".concat(MEMORY, "/pastes") })];
            case 4:
                _b.apply(void 0, [(_f.sent()).deny]).toContain('Start a fresh agent');
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'p3', file_path: saved === null || saved === void 0 ? void 0 : saved[0], agentId: 'w1' })];
            case 5:
                _c.apply(void 0, [(_f.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test("a chat's own thread may only read, start agents and talk to them; an agent may do the work", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, told, refused, _a, _b, _c, _i, _d, _e, i, call, _f, _g, _h, _j, _k, _l, _m, i, call, _o, _p, agentId, _q;
    var _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _t.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'what does this function do', wait: false, origin: composer })];
            case 2:
                told = _t.sent();
                expect((_r = told.context) === null || _r === void 0 ? void 0 : _r.join('\n')).toContain('A question answered by reading a few files is answered directly');
                expect((_s = told.context) === null || _s === void 0 ? void 0 : _s.join('\n')).toContain('Anything that changes a file, runs a command or takes more than a few reads');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' })];
            case 3:
                refused = _t.sent();
                expect(refused.deny).toContain('Start a fresh agent');
                expect(refused.deny).toContain('changes no file and runs no command');
                expect(files.get("".concat(MEMORY, "/log.md"))).toContain('refused Bash');
                // It reads for itself: any file, a search, a list of names
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Read', tool_use_id: 'r1', file_path: '/repo/src/nose.ts' })];
            case 4:
                // It reads for itself: any file, a search, a list of names
                _a.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Grep', tool_use_id: 'r2', pattern: 'function nose', path: '/repo' })];
            case 5:
                _b.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Glob', tool_use_id: 'r3', pattern: '**/*.ts', path: '/repo' })];
            case 6:
                _c.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _i = 0, _d = [
                    { tool: 'Edit', file_path: '/repo/src/nose.ts', old_string: 'a', new_string: 'b' },
                    { tool: 'Write', file_path: '/repo/src/new.ts', content: 'x' },
                    { tool: 'MultiEdit', file_path: '/repo/src/nose.ts', edits: [] },
                    { tool: 'NotebookEdit', notebook_path: '/repo/n.ipynb', new_source: 'x' },
                    { tool: 'Bash', command: 'cat /repo/src/nose.ts' },
                    { tool: 'WebFetch', url: 'https://example.com', prompt: 'p' },
                    { tool: 'mcp__other__write_file', path: '/repo/x' },
                ].entries();
                _t.label = 7;
            case 7:
                if (!(_i < _d.length)) return [3 /*break*/, 10];
                _e = _d[_i], i = _e[0], call = _e[1];
                _f = expect;
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, call), { tool_use_id: "n".concat(i) }))];
            case 8:
                _f.apply(void 0, [(_t.sent()).deny]).toContain('Start a fresh agent');
                _t.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                _g = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', tool_use_id: 't2', prompt: 'fix the nose', subagent_type: 'general-purpose', model: 'opus' })];
            case 11:
                _g.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', tool_use_id: 't3', recap: 'r' })];
            case 12:
                _h.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 't4', command: 'ls', agentId: 'fork-1' })];
            case 13:
                _j.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _k = 0, _l = [{ tool: 'Edit', file_path: '/repo/src/nose.ts', old_string: 'a', new_string: 'b' }, { tool: 'Write', file_path: '/repo/x', content: 'x' }, { tool: 'Grep', pattern: 'nose' }, { tool: 'Bash', command: 'npm test' }].entries();
                _t.label = 14;
            case 14:
                if (!(_k < _l.length)) return [3 /*break*/, 19];
                _m = _l[_k], i = _m[0], call = _m[1];
                _o = 0, _p = ['w1', 'helper-1'];
                _t.label = 15;
            case 15:
                if (!(_o < _p.length)) return [3 /*break*/, 18];
                agentId = _p[_o];
                _q = expect;
                return [4 /*yield*/, $.tool.call(__assign(__assign({}, call), { tool_use_id: "w".concat(i).concat(agentId), agentId: agentId }))];
            case 16:
                _q.apply(void 0, [(_t.sent()).deny]).toBeUndefined();
                _t.label = 17;
            case 17:
                _o++;
                return [3 /*break*/, 15];
            case 18:
                _k++;
                return [3 /*break*/, 14];
            case 19: return [2 /*return*/];
        }
    });
}); });
test('a session the person has not typed into does its own work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'Run the nightly check.', wait: false, origin: { kind: 'peer' } })];
            case 2:
                _b.sent();
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' })];
            case 3:
                _a.apply(void 0, [(_b.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('config.json can switch the handing-over off', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, r, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = world(on).files;
                files.set("".concat(MEMORY, "/config.json"), '{"agents": false}');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                r = _c.sent();
                expect((_b = r.context) !== null && _b !== void 0 ? _b : []).toEqual([]);
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'ls' })];
            case 3:
                _a.apply(void 0, [(_c.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('config.json names the person the work is for; without a name the texts say the person', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = world(on).files;
                files.set("".concat(MEMORY, "/config.json"), '{"name": "Sam"}');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _a.sent();
                expect(prompts[0]).toContain('started from a chat for Sam, the person you work for.');
                expect(prompts[0]).toContain('Sam follows this work in a panel');
                expect(prompts[0]).toContain("Sam's messages word for word");
                expect(prompts[0]).not.toMatch(/the person(?! you work for)/i);
                return [2 /*return*/];
        }
    });
}); });
test('without a name in config.json the work is told of the person', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _a.sent();
                expect(prompts[0]).toContain('started from a chat for the person you work for.');
                expect(prompts[0]).toContain('The person follows this work in a panel');
                return [2 /*return*/];
        }
    });
}); });
test('the update tool records a subject and rewrites its brief', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = world(on).files;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't1', name: '3D heads', repo: '/sandbox', summary: 'Fix the nose' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__update', tool_use_id: 't2', name: '3d heads', state: 'done: pushed', brief: 'Nose fixed.' })];
            case 3:
                _a.sent();
                expect(files.get("".concat(MEMORY, "/index.md"))).toContain('- 3D heads | /sandbox |  | done: pushed | Fix the nose');
                expect(files.get("".concat(MEMORY, "/streams/3d-heads.md"))).toBe('Nose fixed.\n');
                return [2 /*return*/];
        }
    });
}); });
test('recall returns matching lines without the folder prefix', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__recall', tool_use_id: 't1', query: 'nose' })];
            case 2:
                r = _a.sent();
                expect(String(r.result)).toContain('words/local_1.md:2:the nose is flawed');
                return [2 /*return*/];
        }
    });
}); });
test('rarely used tools wait behind tool search', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var provider, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                world(on);
                provider = { plugin: 'engine', tier: 'core' };
                _a = expect;
                return [4 /*yield*/, $.tool.describe({ tool: 'Workflow', description: 'd', provider: provider })];
            case 1:
                _a.apply(void 0, [(_d.sent()).isDeferred]).toBe(true);
                _b = expect;
                return [4 /*yield*/, $.tool.describe({ tool: 'mcp__visualize__show_widget', description: 'd', provider: provider })];
            case 2:
                _b.apply(void 0, [(_d.sent()).isDeferred]).toBe(true);
                _c = expect;
                return [4 /*yield*/, $.tool.describe({ tool: 'Read', description: 'd', provider: provider })];
            case 3:
                _c.apply(void 0, [(_d.sent()).isDeferred]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('a compaction is told what to keep, and the chat gets its role again after it', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var compacts, after;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                compacts = world(on).compacts;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'one', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'one', toolUses: [] }] })];
            case 3:
                _b.sent();
                expect(compacts[0]).toContain('Keep every ask');
                expect(compacts[0]).toContain('each background agent');
                return [4 /*yield*/, $.prompt.submit({ text: 'two', wait: false, origin: composer })];
            case 4:
                after = _b.sent();
                expect((_a = after.context) === null || _a === void 0 ? void 0 : _a.join('\n')).toContain('CHAT ROLE');
                return [2 /*return*/];
        }
    });
}); });
test('after a reply the answer is saved, the asks and what was done are logged, and the chat is renamed when its work changed', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, titles, clock, asks;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { reply: '- fix the upload page\n- also look at the nose\ndid: moved the upload button above the fold\ntitle: Upload page fix' }), files = _a.files, titles = _a.titles, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the upload page, also look at the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.turn.complete({ answer: 'Done.', durationMs: 1, isAborted: false, turnId: 'turn-1', reason: 'answer' })];
            case 3:
                _c.sent();
                return [4 /*yield*/, clock.advance(10)];
            case 4:
                _c.sent();
                asks = (_b = files.get("".concat(MEMORY, "/asks/engine-id.md"))) !== null && _b !== void 0 ? _b : '';
                expect(asks).toContain('- fix the upload page');
                expect(asks).toContain('- also look at the nose');
                expect(asks).toContain('did: moved the upload button above the fold');
                expect(files.get("".concat(MEMORY, "/words/engine-id.md"))).toContain('### Claude ');
                expect(files.get("".concat(MEMORY, "/words/engine-id.md"))).toContain('Done.');
                expect(titles).toEqual(['Upload page fix']);
                return [2 /*return*/];
        }
    });
}); });
test('every conversation carries the principles the mod ships, word for word and once, even where the same text was loaded from elsewhere', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var home, repo, managed, told, fresh;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                world(on);
                // The engine beneath answers what it was handed
                on('prompt.context', function (_, e) { return ({ blocks: e.blocks, instructionFiles: e.instructionFiles }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                home = { path: "".concat(HOME, "/.claude/CLAUDE.md"), kind: 'user', content: PRINCIPLES };
                repo = { path: '/repo/CLAUDE.md', kind: 'project', content: 'REPO RULES' };
                managed = { path: '/etc/claude/CLAUDE.md', kind: 'managed', content: 'ORG RULES' };
                return [4 /*yield*/, $.prompt.context({ blocks: [{ name: 'claudeMd', text: 'files' }], instructionFiles: [managed, home, repo] })];
            case 2:
                told = _f.sent();
                expect((_a = told.instructionFiles) === null || _a === void 0 ? void 0 : _a.map(function (one) { return [one.kind, one.path.endsWith('/rules/CLAUDE.md') ? 'mod' : one.path]; })).toEqual([['managed', managed.path], ['user', 'mod'], ['project', repo.path]]);
                expect((_c = (_b = told.instructionFiles) === null || _b === void 0 ? void 0 : _b.find(function (one) { return one.kind === 'user'; })) === null || _c === void 0 ? void 0 : _c.content).toBe(PRINCIPLES);
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [] })];
            case 3:
                fresh = _f.sent();
                expect((_d = fresh.instructionFiles) === null || _d === void 0 ? void 0 : _d.map(function (one) { return [one.kind, one.content]; })).toEqual([['user', PRINCIPLES]]);
                expect((_e = told.instructionFiles) === null || _e === void 0 ? void 0 : _e.some(function (one) { return one.content.includes('device code'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a chat the app runs on another Mac over ssh tells every conversation that what needs the person is done from their own device', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var home, told, ours, twice;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } });
                on('prompt.context', function (_, e) { return ({ blocks: e.blocks, instructionFiles: e.instructionFiles }); });
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                home = { path: "".concat(HOME, "/.claude/CLAUDE.md"), kind: 'user', content: PRINCIPLES };
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [home] })
                    // The same principles loaded from elsewhere are still sent once, now ending with the rule for working from afar
                ];
            case 2:
                told = _f.sent();
                // The same principles loaded from elsewhere are still sent once, now ending with the rule for working from afar
                expect((_a = told.instructionFiles) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
                ours = (_d = (_c = (_b = told.instructionFiles) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '';
                expect(ours.startsWith(PRINCIPLES.trimEnd())).toBe(true);
                expect(ours).toContain('## This chat runs on another Mac');
                expect(ours).toContain('a sign-in by device code or a link that works opened on my device, never a browser, window, dialog or keychain prompt on this Mac');
                expect(ours).not.toContain('{name}');
                return [4 /*yield*/, $.prompt.context({ blocks: [], instructionFiles: [{ path: '/other/copy/rules/CLAUDE.md', kind: 'user', content: ours }] })];
            case 3:
                twice = _f.sent();
                expect((_e = twice.instructionFiles) === null || _e === void 0 ? void 0 : _e.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
