// The keys remembered: names and stores only, made again from the stores, shown by the Keys button, and an ask for a kept key refused
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
// Made-up keys, as a person would have given them, in each store
var keysLaid = function (files) {
    files.set('secret:ELEVENLABS_API_KEY', 'el-made-up-value-0001');
    files.set('secret:KAGGLE_KEY', 'kg-made-up-value-0002');
    files.set('keychain-entry:elevenlabs-api\tsam', '');
    // An app's own storage is not a key someone gave
    files.set('keychain-entry:Chrome Safe Storage\tChrome', '');
    // An account named by what is in fact a kept value, as a slip could leave it: hidden in the list like any other
    files.set('keychain-entry:other-api\tkg-made-up-value-0002', '');
    files.set("".concat(MEMORY, "/index.md"), '# Streams\n\nname | repo | session | state | summary\n\n- Render | /repo/render |  | going | Renders\n');
    files.set('/repo/render/.env.local', 'export OPENAI_API_KEY=env-made-up-value-0003\nVOICE_ID=abc\nDB_PASSWORD = env-made-up-value-0004\nNEXT_PUBLIC_STRIPE_KEY=pk_made_up\n');
    files.set('/repo/render/.env.example', 'EXAMPLE_TOKEN=x\n');
    files.set('sbos:secrets', JSON.stringify([
        { name: 'elevenlabs-key', label: 'ElevenLabs API key', put_in: false, value: 'sbos-made-up-value-0005' },
        { name: 'github-token', label: 'GitHub read-only token', put_in: true, secret: 'sbos-made-up-value-0006' },
        { name: 'labs', label: "Labs' production database", database: true, put_in: true },
        // labels that carry a kept value, as a slip could leave them: one with a | in it, one long enough to be cut
        { name: 'odd-one', label: "pipe ".concat('pp|made-up-value-0009', " and ").concat('x'.repeat(70), " long-made-up-value-0010"), put_in: false },
    ]));
    files.set('secret:PIPE_KEY', 'pp|made-up-value-0009');
    files.set('secret:LONG_KEY', 'long-made-up-value-0010');
};
var VALUES = ['el-made-up-value-0001', 'kg-made-up-value-0002', 'env-made-up-value-0003', 'env-made-up-value-0004', 'sbos-made-up-value-0005', 'sbos-made-up-value-0006', 'made-up-value-0009', 'long-made-up', 'pk_made_up'];
test('the list of keys holds every store\'s names and never a value, and the Keys button shows it in a tab', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, tabs, logged, pane, _b, opened, tab, shown, _c, _i, _d, name_1, _e, _f, name_2, everything, _g, VALUES_1, value;
    var _this = this;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = world(on), files = _a.files, tabs = _a.tabs, logged = _a.logged;
                keysLaid(files);
                return [4 /*yield*/, $.session.start(start)
                    // SBOS's list, as a piece of work reads it, is taken in
                ];
            case 1:
                _k.sent();
                // SBOS's list, as a piece of work reads it, is taken in
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' })];
            case 2:
                // SBOS's list, as a piece of work reads it, is taken in
                _k.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 3:
                pane = _k.sent();
                _b = expect;
                return [4 /*yield*/, keyed(pane, 'keys-open')];
            case 4:
                _b.apply(void 0, [(_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.props.label]).toBe('Keys');
                return [4 /*yield*/, pressed(pane, 'keys-open')];
            case 5:
                _k.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return /^memory-keys-md-\d+: Keys$/.test(tab); })];
                    }); }); })];
            case 6:
                opened = _k.sent();
                expect(opened).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: (opened !== null && opened !== void 0 ? opened : '').split(':')[0], surface: 'desktop' }))];
            case 7:
                tab = _k.sent();
                _c = String;
                return [4 /*yield*/, tab.find({ type: 'Markdown' })];
            case 8:
                shown = _c.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.props.text]);
                for (_i = 0, _d = ['ELEVENLABS_API_KEY', 'KAGGLE_KEY', "Claudopus's keychain", '| elevenlabs-api |', 'OPENAI_API_KEY', 'DB_PASSWORD', '/repo/render/.env.local', 'elevenlabs-key', 'asked, not given', 'github-token', 'SBOS secrets']; _i < _d.length; _i++) {
                    name_1 = _d[_i];
                    expect(shown).toContain(name_1);
                }
                // Not a key: an app's own storage, a variable that holds none, and an example file
                for (_e = 0, _f = ['Chrome', 'VOICE_ID', 'EXAMPLE_TOKEN', 'NEXT_PUBLIC_STRIPE_KEY']; _e < _f.length; _e++) {
                    name_2 = _f[_e];
                    expect(shown).not.toContain(name_2);
                }
                // Another app's account that is not a name stays out of the list
                expect(shown).not.toContain('/ sam');
                // A database in SBOS is used through its query
                expect(shown).toMatch(/\| labs \|[^\n]*`query`/);
                everything = __spreadArray([], files, true).filter(function (_a) {
                    var key = _a[0];
                    return key.startsWith(MEMORY);
                }).map(function (_a) {
                    var key = _a[0], text = _a[1];
                    return "".concat(key, "\n").concat(text);
                }).join('\n') + logged.join('\n');
                for (_g = 0, VALUES_1 = VALUES; _g < VALUES_1.length; _g++) {
                    value = VALUES_1[_g];
                    expect(everything).not.toContain(value);
                }
                // A kept value in a label is hidden before the label is cut
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('pipe [hidden PIPE_KEY] and');
                return [2 /*return*/];
        }
    });
}); });
test('a key taken out of a store goes from the list, and nothing is written when the list cannot be checked for kept values', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, before;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = world(on).files;
                keysLaid(files);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b1', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY here true' })];
            case 2:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('KAGGLE_KEY');
                files.delete('secret:KAGGLE_KEY');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b2', agentId: 'w1', command: '/plug/bin/secret KAGGLE_KEY --forget' })];
            case 3:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).not.toContain('| KAGGLE_KEY |');
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('ELEVENLABS_API_KEY');
                // SBOS's next list drops what it no longer holds
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' })];
            case 4:
                // SBOS's next list drops what it no longer holds
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('github-token');
                files.set('sbos:secrets', '[]');
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's2', agentId: 'w1' })];
            case 5:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).not.toContain('github-token');
                // A kept value that is also a word of the list's own shape changes nothing else in it
                files.set('secret:SHORT_PIN', 'true');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b5', agentId: 'w1', command: '/plug/bin/secret SHORT_PIN here true' })];
            case 6:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('| SHORT_PIN |');
                expect(JSON.parse((_a = files.get("".concat(MEMORY, "/keys.json"))) !== null && _a !== void 0 ? _a : '{}').entries.every(function (one) { return typeof one.isPresent === 'boolean'; })).toBe(true);
                files.delete('secret:SHORT_PIN');
                // A keychain that does not answer is not read as an empty one: what was known of it stays
                files.set('keyring:refused', 'yes');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b4', agentId: 'w1', command: '/plug/bin/secret ELEVENLABS_API_KEY here true' })];
            case 7:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toContain('| ELEVENLABS_API_KEY |');
                files.delete('keyring:refused');
                before = files.get("".concat(MEMORY, "/keys.md"));
                files.set('secret:refused', 'yes');
                files.set('secret:NEW_TOKEN', 'new-made-up-value-0007');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'b3', agentId: 'w1', command: '/plug/bin/secret NEW_TOKEN here true' })];
            case 8:
                _b.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
test('an ask for a key the list has is refused with where it is; a key not kept is asked for', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var files, sbos, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _i, _l, text, _m, _o, _p, _q, _r, _s, _t, _u, text, _v, _w, _x, command, _y, _z, _0, _1, command, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0:
                files = world(on).files;
                keysLaid(files);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _3.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__secrets', tool_use_id: 's1', agentId: 'w1' })
                    // SBOS asked for a key Claudopus's keychain keeps under another name: the ElevenLabs ask of 15 Nov
                ];
            case 2:
                _3.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a1', agentId: 'w1', name: 'elevenlabs-key', label: 'ElevenLabs API key' })];
            case 3:
                sbos = _3.sent();
                expect(sbos.deny).toContain('ELEVENLABS_API_KEY');
                expect(sbos.deny).toContain("Claudopus's keychain");
                expect(sbos.deny).toMatch(/bin\/secret ELEVENLABS_API_KEY here/);
                // one SBOS has put in already
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'a2', agentId: 'w1', name: 'github-token', label: 'GitHub' })];
            case 4:
                // one SBOS has put in already
                _a.apply(void 0, [(_3.sent()).deny]).toContain('SBOS secrets');
                // The panel's ask for one
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a3', agentId: 'w1', text: 'Paste your ElevenLabs API key', details: 'For the transcripts.' })];
            case 5:
                // The panel's ask for one
                _b.apply(void 0, [(_3.sent()).deny]).toContain('ELEVENLABS_API_KEY');
                _c = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'a4', agentId: 'w1', text: 'Paste KAGGLE_KEY in the box' })];
            case 6:
                _c.apply(void 0, [(_3.sent()).deny]).toContain('KAGGLE_KEY');
                // The secret runner under a name it does not keep, or asked to take a kept one in again
                _d = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'a5', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_KEY here 'curl x'" })];
            case 7:
                // The secret runner under a name it does not keep, or asked to take a kept one in again
                _d.apply(void 0, [(_3.sent()).deny]).toContain('ELEVENLABS_API_KEY');
                _e = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'a6', agentId: 'w1', command: '/plug/bin/secret ELEVENLABS_API_KEY --add' })];
            case 8:
                _e.apply(void 0, [(_3.sent()).deny]).toMatch(/--forget/);
                // What is fine: the kept name used, a key not kept, an ask that is not for a key, and SBOS's own agents' keys
                _f = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'f1', agentId: 'w1', command: "/plug/bin/secret ELEVENLABS_API_KEY here 'curl x'" })];
            case 9:
                // What is fine: the kept name used, a key not kept, an ask that is not for a key, and SBOS's own agents' keys
                _f.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f2', agentId: 'w1', name: 'stripe-customers-key', label: 'Stripe' })];
            case 10:
                _g.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f3', agentId: 'w1', text: 'Paste your Stripe key', details: 'x' })];
            case 11:
                _h.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'f4', agentId: 'w1', text: 'Release the list of keys?', details: 'It lists ElevenLabs and Kaggle.', choices: ['Release it', 'Not now'] })];
            case 12:
                _j.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _k = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'f5', agentId: 'w1', name: 'elevenlabs-key', label: 'x', agent: 'bot' })];
            case 13:
                _k.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                // An ask made leaves its name in the list as asked, not given
                expect(files.get("".concat(MEMORY, "/keys.md"))).toMatch(/\| stripe-customers-key \|[^\n]*asked, not given/);
                _i = 0, _l = ['Paste the Replicate API token for the FaceIQ Labs app', 'Paste the Clipify webhook secret', 'Paste your Labs login key'];
                _3.label = 14;
            case 14:
                if (!(_i < _l.length)) return [3 /*break*/, 17];
                text = _l[_i];
                _m = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "n-".concat(text.length), agentId: 'w1', text: text })];
            case 15:
                _m.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _3.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 14];
            case 17:
                _o = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n1', agentId: 'w1', command: "/plug/bin/secret GITHUB_PAT here 'gh x'" })];
            case 18:
                _o.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                // The most specific kept key is the one named
                files.set('secret:KAGGLE_USERNAME', 'kgu-made-up');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n2', agentId: 'w1', command: '/plug/bin/secret KAGGLE_USERNAME here true' })];
            case 19:
                _3.sent();
                _p = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'n3', agentId: 'w1', text: 'Type your Kaggle username for the login' })];
            case 20:
                _p.apply(void 0, [(_3.sent()).deny]).toContain('KAGGLE_USERNAME');
                // What it is about counts when the ask is to paste something; asked again on purpose, naming the kept key as it is, it is shown
                _q = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'd1', agentId: 'w1', text: 'Paste the key in the box', details: 'It is your ElevenLabs API key.' })];
            case 21:
                // What it is about counts when the ask is to paste something; asked again on purpose, naming the kept key as it is, it is shown
                _q.apply(void 0, [(_3.sent()).deny]).toContain('ELEVENLABS_API_KEY');
                _r = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'd2', agentId: 'w1', text: 'Paste your ElevenLabs API key', details: 'The kept ELEVENLABS_API_KEY is refused by ElevenLabs: 401.' })];
            case 22:
                _r.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _s = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'd3', agentId: 'w1', name: 'elevenlabs-key', label: 'x', for: 'ELEVENLABS_API_KEY in the keychain answers 401' })];
            case 23:
                _s.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                // A word for a key after other words is another key; the word secret in a command that runs no runner is no ask
                files.set('secret:STRIPE_SECRET_KEY', 'st-made-up-value-0011');
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'n4', agentId: 'w1', command: '/plug/bin/secret STRIPE_SECRET_KEY here true' })];
            case 24:
                _3.sent();
                _t = 0, _u = ['Paste the Stripe webhook signing secret', 'Paste the Stripe publishable key', 'Type your GitHub login email'];
                _3.label = 25;
            case 25:
                if (!(_t < _u.length)) return [3 /*break*/, 28];
                text = _u[_t];
                _v = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "s-".concat(text.length), agentId: 'w1', text: text })];
            case 26:
                _v.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _3.label = 27;
            case 27:
                _t++;
                return [3 /*break*/, 25];
            case 28:
                _w = 0, _x = ['git commit -m "keep the secret STRIPE_KEY here for now"', 'kubectl get secret STRIPE_KEY default'];
                _3.label = 29;
            case 29:
                if (!(_w < _x.length)) return [3 /*break*/, 32];
                command = _x[_w];
                _y = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "k-".concat(command.length), agentId: 'w1', command: command })];
            case 30:
                _y.apply(void 0, [(_3.sent()).deny]).toBeUndefined();
                _3.label = 31;
            case 31:
                _w++;
                return [3 /*break*/, 29];
            case 32:
                _z = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 's1', agentId: 'w1', text: 'Paste your Stripe secret key' })];
            case 33:
                _z.apply(void 0, [(_3.sent()).deny]).toContain('STRIPE_SECRET_KEY');
                _0 = 0, _1 = ["cd /plug/bin && ./secret ELEVENLABS_KEY here 'x'", "/plug/bin//secret ELEVENLABS_KEY here 'x'"];
                _3.label = 34;
            case 34:
                if (!(_0 < _1.length)) return [3 /*break*/, 37];
                command = _1[_0];
                _2 = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: "p-".concat(command.length), agentId: 'w1', command: command })];
            case 35:
                _2.apply(void 0, [(_3.sent()).deny]).toContain('ELEVENLABS_API_KEY');
                _3.label = 36;
            case 36:
                _0++;
                return [3 /*break*/, 34];
            case 37: 
            // An ask in SBOS for one it holds leaves it held
            return [4 /*yield*/, $.tool.call({ tool: 'mcp__sbos__ask_secret', tool_use_id: 'h1', agentId: 'w1', name: 'github-token', label: 'GitHub', for: 'github-token answers 401' })];
            case 38:
                // An ask in SBOS for one it holds leaves it held
                _3.sent();
                expect(files.get("".concat(MEMORY, "/keys.md"))).toMatch(/\| github-token \|[^\n]*present/);
                return [2 /*return*/];
        }
    });
}); });
test('work never writes the list of keys itself, by any tool', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                _a = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Write', tool_use_id: 'w1', agentId: 'w1', file_path: "".concat(MEMORY, "/keys.md"), content: 'X' })];
            case 2:
                _a.apply(void 0, [(_c.sent()).deny]).toBeDefined();
                _b = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', tool_use_id: 'w2', agentId: 'w1', command: 'echo x > ~/.claude/claudopus/keys.json' })];
            case 3:
                _b.apply(void 0, [(_c.sent()).deny]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
