// The admin gate: an admin command waits for the person's press on its work's card
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
var ADMIN = '/plug/claudopus/bin/admin';
var GRANTS = "".concat(MEMORY, "/admin-grants/");
var ALLOWED = "".concat(MEMORY, "/admin-allowed.json");
// A piece of work under way in a chat of Sam's, and the panel
var gated = function ($_1, on_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, on_1], args_1, true), void 0, function ($, on, config, options) {
        var w, list, bash, labels, held, grants, press;
        var _this = this;
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
                    labels = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.props.label) !== null && _a !== void 0 ? _a : ''); })
                                // The call is held once its buttons are on the card
                            ];
                        }
                    }); }); };
                    held = function (id) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            return [2 /*return*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, keyed(list, "gate-".concat(id, "-0-deny"))];
                                }); }); })];
                        });
                    }); };
                    grants = function () { return __spreadArray([], w.files.keys(), true).filter(function (path) { return path.startsWith(GRANTS); }); };
                    press = function (key) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pressed(list, key)];
                            case 1: return [2 /*return*/, (_a.sent(), w.wake())];
                        }
                    }); }); };
                    return [2 /*return*/, __assign(__assign({}, w), { list: list, bash: bash, labels: labels, held: held, grants: grants, press: press })];
            }
        });
    });
};
test('an admin command is held however the runner is reached, and nothing else is taken for one', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, held, admins, list, n, _i, _b, command, id, call, _c, _d, _e, quoted, _f, _g, slashed, _h, _j, _k, _l, command, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _o.sent(), press = _a.press, bash = _a.bash, held = _a.held, admins = _a.admins, list = _a.list;
                n = 0;
                _i = 0, _b = [
                    "".concat(ADMIN, " here \"id -u\""),
                    "/plug/claudopus/bin/../bin/admin here 'id -u'",
                    "/plug/claudopus//bin/./admin here 'id -u'",
                    "cd /plug/claudopus/bin && ./admin here 'id -u'",
                    "cd /plug/claudopus && bin/admin here 'id -u'",
                    "\"$CLAUDE_PLUGIN_ROOT\"/bin/admin here 'id -u'",
                    "X=1 env Y=2 ".concat(ADMIN, " here 'id -u'"),
                    "nohup ".concat(ADMIN, " here 'id -u' &"),
                    "timeout 600 ".concat(ADMIN, " here 'id -u'"),
                    "command ".concat(ADMIN, " here 'id -u'"),
                    "bash -c \"".concat(ADMIN, " here 'id -u'\""),
                    "sh -lc '".concat(ADMIN, " here \"id -u\"'"),
                    "bash ".concat(ADMIN, " here 'id -u'"),
                    "eval \"".concat(ADMIN, " here 'id -u'\""),
                    "out=$(".concat(ADMIN, " here 'id -u') && echo \"$out\""),
                    "echo start; ".concat(ADMIN, " here 'id -u' | grep 0"),
                    "sudo -u root ".concat(ADMIN, " here 'id -u'"),
                    "if ".concat(ADMIN, " here 'id -u'; then echo yes; fi"),
                    "if true; then ".concat(ADMIN, " here 'id -u'; fi"),
                ];
                _o.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                command = _b[_i];
                id = "d".concat((n += 1));
                call = bash(id, command);
                _c = expect;
                return [4 /*yield*/, held(id)];
            case 3:
                _c.apply(void 0, [_o.sent()]).toBeDefined();
                // Each shows the command as the runner would be handed it
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text', text: 'id -u' })];
            case 4:
                // Each shows the command as the runner would be handed it
                _d.apply(void 0, [(_o.sent()).some(function (one) { return one.props.mono; })]).toBe(true);
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 5:
                _o.sent();
                _e = expect;
                return [4 /*yield*/, call];
            case 6:
                _e.apply(void 0, [(_o.sent()).deny]).toContain('Refused by Sam');
                _o.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8:
                quoted = bash('q1', "".concat(ADMIN, " here 'echo \"a b\" > /etc/x; chmod 644 /etc/x'"));
                _f = expect;
                return [4 /*yield*/, held('q1')];
            case 9:
                _f.apply(void 0, [_o.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'echo "a b" > /etc/x; chmod 644 /etc/x' })];
            case 10:
                _g.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-q1-0-deny')];
            case 11:
                _o.sent();
                return [4 /*yield*/, quoted
                    // Inside double quotes a backslash stays, as the shell leaves it, unless it escapes a quote, a dollar or itself
                ];
            case 12:
                _o.sent();
                slashed = bash('q2', "".concat(ADMIN, " here \"printf 'a\\nb' > \\\"/etc/x y\\\"\""));
                _h = expect;
                return [4 /*yield*/, held('q2')];
            case 13:
                _h.apply(void 0, [_o.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "printf 'a\\nb' > \"/etc/x y\"" })];
            case 14:
                _j.apply(void 0, [_o.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-q2-0-deny')];
            case 15:
                _o.sent();
                return [4 /*yield*/, slashed];
            case 16:
                _o.sent();
                expect(admins).toEqual([]);
                _k = 0, _l = ["git commit -m \"bin/admin here 'id -u' now asks\"", "echo ".concat(ADMIN, " here id"), "".concat(ADMIN, " here --forget"), "".concat(ADMIN), 'django-admin migrate', 'ls bin/admin', "cat ".concat(ADMIN), '/usr/local/bin/admin here now', 'vendor/bin/admin migrate up'];
                _o.label = 17;
            case 17:
                if (!(_k < _l.length)) return [3 /*break*/, 20];
                command = _l[_k];
                _m = expect;
                return [4 /*yield*/, bash("n".concat((n += 1)), command)];
            case 18:
                _m.apply(void 0, [(_o.sent()).result]).toBe('ran');
                _o.label = 19;
            case 19:
                _k++;
                return [3 /*break*/, 17];
            case 20: return [2 /*return*/];
        }
    });
}); });
test('asked each time: the call is held, its card shows the exact command and the Mac with three buttons, and Allow once lets that one command run', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, labels, held, grants, admins, logged, notified, files, done, call, _b, _c, _d, _e, _f, details, _g, _h, grant, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _t.sent(), press = _a.press, list = _a.list, bash = _a.bash, labels = _a.labels, held = _a.held, grants = _a.grants, admins = _a.admins, logged = _a.logged, notified = _a.notified, files = _a.files;
                done = false;
                call = bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'")).then(function (r) { return ((done = true), r); });
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_t.sent()]).toBeDefined();
                // Held: nothing ran, and nothing is granted
                expect(done).toBe(false);
                expect(admins).toEqual([]);
                expect(grants()).toEqual([]);
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })];
            case 3:
                _c.apply(void 0, [(_m = (_t.sent())) === null || _m === void 0 ? void 0 : _m.props.color]).toBe('#E5A50A');
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' })];
            case 4:
                _d.apply(void 0, [(_o = (_t.sent())) === null || _o === void 0 ? void 0 : _o.props.mono]).toBe(true);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Allow: it runs with admin rights. Deny: it does not run, and the work is told.' })];
            case 5:
                _e.apply(void 0, [_t.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, labels()];
            case 6:
                _f.apply(void 0, [(_t.sent()).filter(function (one) { return ['Allow once', 'Always allow this command', 'Deny'].includes(one); })]).toEqual(['Allow once', 'Always allow this command', 'Deny']);
                // Said in the chat and as a notification; its Details tab has it at the top
                expect(logged.some(function (line) { return line.includes('The work "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts') && line.includes('Nothing typed in the chat allows it'); })).toBe(true);
                expect(notified).toContain('Fix the hosts file needs you | Wants to run an admin command on this Mac: chmod 644 /etc/hosts');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 7:
                details = _t.sent();
                _g = expect;
                return [4 /*yield*/, details.find({ type: 'Text', text: 'Needs you now' })];
            case 8:
                _g.apply(void 0, [_t.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 9:
                _t.sent();
                _h = expect;
                return [4 /*yield*/, call];
            case 10:
                _h.apply(void 0, [(_t.sent()).result]).toBe('ran');
                // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
                expect(admins.length).toBe(1);
                grant = ((_q = (_p = admins[0]) === null || _p === void 0 ? void 0 : _p.grants) !== null && _q !== void 0 ? _q : [])[0];
                expect((_r = admins[0]) === null || _r === void 0 ? void 0 : _r.grants.length).toBe(1);
                expect({ host: grant === null || grant === void 0 ? void 0 : grant.host, command: grant === null || grant === void 0 ? void 0 : grant.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' });
                expect(grant === null || grant === void 0 ? void 0 : grant.seal).toBe(fakeSeal((_s = files.get('keychain:gate')) !== null && _s !== void 0 ? _s : '', "grant\n".concat(grant === null || grant === void 0 ? void 0 : grant.id, "\n").concat(grant === null || grant === void 0 ? void 0 : grant.at, "\nhere\nchmod 644 /etc/hosts")));
                expect(grants()).toEqual([]);
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })];
            case 11:
                _j.apply(void 0, [_t.sent()]).toBeUndefined();
                // In its place for a minute: what the person pressed and what happens now
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it once · it runs now' })];
                    }); }); })];
            case 12:
                // In its place for a minute: what the person pressed and what happens now
                _k.apply(void 0, [_t.sent()]).toBeDefined();
                expect(files.has(ALLOWED)).toBe(false);
                // Once is once: the same command again is held again
                void bash('b2', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _l = expect;
                return [4 /*yield*/, held('b2')];
            case 13:
                _l.apply(void 0, [_t.sent()]).toBeDefined();
                expect(admins.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test('Deny refuses the call with a line that says the person refused it, and nothing runs or is granted', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, grants, admins, call, _b, _c, r, _d, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _g.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, grants = _a.grants, admins = _a.admins;
                call = bash('b1', "".concat(ADMIN, " m4 'rm -rf /Library/Caches/x'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })];
            case 3:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-deny')];
            case 4:
                _g.sent();
                return [4 /*yield*/, call];
            case 5:
                r = _g.sent();
                expect(r.deny).toBe('Refused by Sam: Sam pressed Deny on this admin command, so it did not run. Do not try to run it another way. Carry on without it, or say what it is needed for and ask again.');
                expect(admins).toEqual([]);
                expect(grants()).toEqual([]);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on m4' })];
            case 6:
                _d.apply(void 0, [_g.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You denied it · it did not run, and the work was told' })];
                    }); }); })];
            case 7:
                _e.apply(void 0, [_g.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'An admin command on m4' })];
            case 8:
                _f.apply(void 0, [_g.sent()]).toBeDefined();
                return [2 /*return*/];
        }
    });
}); });
test('no way to the runner gets past the press: another spelling, a shell, a helper, and two commands in one call each wait', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, labels, n, _i, _b, command, id, call, _c, _d, both, _e, _f, _g, _h, _j, waiting, _k, _l;
    var _this = this;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, gated($, on)
                // A helper's call shows on the card of the work it helps
            ];
            case 1:
                _a = _m.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, labels = _a.labels;
                // A helper's call shows on the card of the work it helps
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' }))];
            case 2:
                // A helper's call shows on the card of the work it helps
                _m.sent();
                n = 0;
                _i = 0, _b = ["cd /plug/claudopus/bin && ./admin here 'id -u'", "bash -c \"/plug/claudopus/bin/../bin/admin here 'id -u'\"", "X=1 env ".concat(ADMIN, " here 'id -u'"), "eval \"".concat(ADMIN, " here 'id -u'\"")];
                _m.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                command = _b[_i];
                id = "s".concat((n += 1));
                call = bash(id, command, n % 2 ? 'a2' : 'a1');
                _c = expect;
                return [4 /*yield*/, held(id)];
            case 4:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                expect(admins.length).toBe(0);
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 5:
                _m.sent();
                _d = expect;
                return [4 /*yield*/, call];
            case 6:
                _d.apply(void 0, [(_m.sent()).deny]).toContain('Refused by Sam');
                _m.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8:
                both = bash('t1', "".concat(ADMIN, " here 'id -u' && ").concat(ADMIN, " here 'whoami'"));
                _e = expect;
                return [4 /*yield*/, held('t1')];
            case 9:
                _e.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-t1-0-once')];
            case 10:
                _m.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, keyed(list, 'gate-t1-1-deny')];
                    }); }); })];
            case 11:
                _f.apply(void 0, [_m.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'whoami' })];
            case 12:
                _g.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-t1-1-deny')];
            case 13:
                _m.sent();
                _h = expect;
                return [4 /*yield*/, both];
            case 14:
                _h.apply(void 0, [(_m.sent()).deny]).toContain('Refused by Sam');
                expect(admins.length).toBe(0);
                _j = expect;
                return [4 /*yield*/, labels()];
            case 15:
                _j.apply(void 0, [_m.sent()]).not.toContain('Deny');
                waiting = bash('w1', "".concat(ADMIN, " here 'id -u'"));
                _k = expect;
                return [4 /*yield*/, held('w1')];
            case 16:
                _k.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'Allow once', wait: false, origin: composer })];
            case 17:
                _m.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow once' })];
            case 18:
                _m.sent();
                _l = expect;
                return [4 /*yield*/, keyed(list, 'gate-w1-0-once')];
            case 19:
                _l.apply(void 0, [_m.sent()]).toBeDefined();
                expect(admins.length).toBe(0);
                return [4 /*yield*/, press('gate-w1-0-deny')];
            case 20:
                _m.sent();
                return [4 /*yield*/, waiting];
            case 21:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Always allow this command keeps the exact command for its Mac, sealed; Config lists it with Remove, and a list work wrote itself allows nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, files, tabs, first, _b, _c, kept, _d, _i, _e, _f, id, command, call, _g, forged, _h, _j, _k, id, command, call, _l, _m, _o, config, _p, _q, _r, _s, before, stale, _t, _u, again, _v;
    var _this = this;
    var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    return __generator(this, function (_7) {
        switch (_7.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _7.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files, tabs = _a.tabs;
                first = bash('b1', "".concat(ADMIN, " here 'softwareupdate -l'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-always')];
            case 3:
                _7.sent();
                _c = expect;
                return [4 /*yield*/, first];
            case 4:
                _c.apply(void 0, [(_7.sent()).result]).toBe('ran');
                kept = JSON.parse((_w = files.get(ALLOWED)) !== null && _w !== void 0 ? _w : '{}');
                expect((_x = kept.here) === null || _x === void 0 ? void 0 : _x.map(function (one) { return one.command; })).toEqual(['softwareupdate -l']);
                expect((_z = (_y = kept.here) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.seal).toBe(fakeSeal((_0 = files.get('keychain:gate')) !== null && _0 !== void 0 ? _0 : '', 'allow\nhere\nsoftwareupdate -l'));
                // The same command on the same Mac now runs without a press, with its own grant
                _d = expect;
                return [4 /*yield*/, bash('b2', "".concat(ADMIN, " here 'softwareupdate -l'"))];
            case 5:
                // The same command on the same Mac now runs without a press, with its own grant
                _d.apply(void 0, [(_7.sent()).result]).toBe('ran');
                expect(admins.length).toBe(2);
                expect((_1 = admins[1]) === null || _1 === void 0 ? void 0 : _1.grants.map(function (one) { return one.command; })).toEqual(['softwareupdate -l']);
                _i = 0, _e = [['b3', "".concat(ADMIN, " here 'softwareupdate -l -a'")], ['b4', "".concat(ADMIN, " m4 'softwareupdate -l'")]];
                _7.label = 6;
            case 6:
                if (!(_i < _e.length)) return [3 /*break*/, 11];
                _f = _e[_i], id = _f[0], command = _f[1];
                call = bash(id, command);
                _g = expect;
                return [4 /*yield*/, held(id)];
            case 7:
                _g.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 8:
                _7.sent();
                return [4 /*yield*/, call];
            case 9:
                _7.sent();
                _7.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 6];
            case 11:
                forged = { here: __spreadArray(__spreadArray([], ((_2 = kept.here) !== null && _2 !== void 0 ? _2 : []), true), [{ command: 'rm -rf /', seal: (_5 = (_4 = (_3 = kept.here) === null || _3 === void 0 ? void 0 : _3[0]) === null || _4 === void 0 ? void 0 : _4.seal) !== null && _5 !== void 0 ? _5 : '', at: 1 }, { command: 'reboot', seal: '', at: 1 }], false) };
                files.set(ALLOWED, JSON.stringify(forged));
                _h = 0, _j = [['f1', "".concat(ADMIN, " here 'rm -rf /'")], ['f2', "".concat(ADMIN, " here 'reboot'")]];
                _7.label = 12;
            case 12:
                if (!(_h < _j.length)) return [3 /*break*/, 17];
                _k = _j[_h], id = _k[0], command = _k[1];
                call = bash(id, command);
                _l = expect;
                return [4 /*yield*/, held(id)];
            case 13:
                _l.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 14:
                _7.sent();
                _m = expect;
                return [4 /*yield*/, call];
            case 15:
                _m.apply(void 0, [(_7.sent()).deny]).toContain('Refused by Sam');
                _7.label = 16;
            case 16:
                _h++;
                return [3 /*break*/, 12];
            case 17: 
            // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
            return [4 /*yield*/, pressed(list, 'config-open')];
            case 18:
                // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
                _7.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 19:
                _o.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 20:
                config = _7.sent();
                _p = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Always allowed' })];
            case 21:
                _p.apply(void 0, [_7.sent()]).toBeDefined();
                _q = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'softwareupdate -l' })];
            case 22:
                _q.apply(void 0, [(_6 = (_7.sent())) === null || _6 === void 0 ? void 0 : _6.props.mono]).toBe(true);
                _r = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'rm -rf /' })];
            case 23:
                _r.apply(void 0, [_7.sent()]).toBeUndefined();
                _s = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /2 more in the file were not added by your press and allow nothing/ })];
            case 24:
                _s.apply(void 0, [_7.sent()]).toBeDefined();
                before = files.get('keychain:gate');
                stale = JSON.stringify(kept);
                return [4 /*yield*/, pressed(config, 'config-admin-remove-0')];
            case 25:
                _7.sent();
                _t = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get(ALLOWED)) !== null && _a !== void 0 ? _a : '{"here":[1]}').here === undefined ? true : undefined)];
                    }); }); })];
            case 26:
                _t.apply(void 0, [_7.sent()]).toBe(true);
                _u = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /^None yet/ })];
            case 27:
                _u.apply(void 0, [_7.sent()]).toBeDefined();
                // Removing made a new key: the old entry put back, seal and all, allows nothing
                expect(files.get('keychain:gate')).not.toBe(before);
                files.set(ALLOWED, stale);
                again = bash('b5', "".concat(ADMIN, " here 'softwareupdate -l'"));
                _v = expect;
                return [4 /*yield*/, held('b5')];
            case 28:
                _v.apply(void 0, [_7.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b5-0-deny')];
            case 29:
                _7.sent();
                return [4 /*yield*/, again];
            case 30:
                _7.sent();
                return [2 /*return*/];
        }
    });
}); });
test('work never reads or writes the allowed list, the grants or the key that seals them', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, files, _i, _b, command, _c, _d, _e, tool, _f, _g, path, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _k.sent(), press = _a.press, bash = _a.bash, files = _a.files;
                _i = 0, _b = [
                    "echo '{\"here\":[{\"command\":\"reboot\",\"seal\":\"x\"}]}' > ~/.claude/claudopus/admin-allowed.json",
                    "cat ".concat(MEMORY, "/admin-allowed.json"),
                    "cp /tmp/g.json ".concat(MEMORY, "/admin-grants/g.json"),
                    'security add-generic-password -U -s claudopus-admin-gate -a seal -w abc',
                    'security delete-generic-password -s claudopus-admin-gate -a seal',
                ];
                _k.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                command = _b[_i];
                _c = expect;
                return [4 /*yield*/, bash("t".concat(command.length), command)];
            case 3:
                _c.apply(void 0, [(_k.sent()).deny]).toContain('only Sam adds to them');
                _k.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                _d = 0, _e = ['Write', 'Edit'];
                _k.label = 6;
            case 6:
                if (!(_d < _e.length)) return [3 /*break*/, 11];
                tool = _e[_d];
                _f = 0, _g = [ALLOWED, "".concat(GRANTS, "g.json")];
                _k.label = 7;
            case 7:
                if (!(_f < _g.length)) return [3 /*break*/, 10];
                path = _g[_f];
                _h = expect;
                return [4 /*yield*/, $.tool.call({ tool: tool, tool_use_id: "w-".concat(tool, "-").concat(path.length), file_path: path, content: '{}', agentId: 'a1' })];
            case 8:
                _h.apply(void 0, [(_k.sent()).deny]).toContain('only Sam adds to them');
                _k.label = 9;
            case 9:
                _f++;
                return [3 /*break*/, 7];
            case 10:
                _d++;
                return [3 /*break*/, 6];
            case 11:
                expect(files.has(ALLOWED)).toBe(false);
                // The memory folder's other files are work's to write as before
                _j = expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Write', tool_use_id: 'w9', file_path: "".concat(MEMORY, "/streams/x.md"), content: 'x', agentId: 'a1' })];
            case 12:
                // The memory folder's other files are work's to write as before
                _j.apply(void 0, [(_k.sent()).deny]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('asked once per piece of work: one Allow covers that work and its helpers until it ends, and no other work', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, files, labels, tabs, _b, config, _c, sealedAs, first, _d, _e, _f, _g, _h, _j, other, _k, _l, back, _m;
    var _this = this;
    var _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0: return [4 /*yield*/, gated($, on)
                // The setting is chosen in Config, which seals it
            ];
            case 1:
                _a = _q.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files, labels = _a.labels, tabs = _a.tabs;
                // The setting is chosen in Config, which seals it
                return [4 /*yield*/, pressed(list, 'config-open')];
            case 2:
                // The setting is chosen in Config, which seals it
                _q.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                config = _q.sent();
                _c = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Ask before an admin command' })];
            case 5:
                _c.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, config.select({ key: 'config-admin-mode-pick', value: 'work' })];
            case 6:
                _q.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').adminSealed];
                    }); }); })];
            case 7:
                sealedAs = _q.sent();
                expect(JSON.parse((_o = files.get("".concat(MEMORY, "/config.json"))) !== null && _o !== void 0 ? _o : '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal((_p = files.get('keychain:gate')) !== null && _p !== void 0 ? _p : '', 'mode\nwork') });
                expect(sealedAs).toBeDefined();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' }))];
            case 8:
                _q.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer })];
            case 9:
                _q.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Update the other Mac', prompt: 'update the other Mac' }))];
            case 10:
                _q.sent();
                first = bash('b1', "".concat(ADMIN, " here 'id -u'"));
                _d = expect;
                return [4 /*yield*/, held('b1')];
            case 11:
                _d.apply(void 0, [_q.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, labels()];
            case 12:
                _e.apply(void 0, [_q.sent()]).toContain('Allow for this work');
                _f = expect;
                return [4 /*yield*/, labels()];
            case 13:
                _f.apply(void 0, [_q.sent()]).not.toContain('Allow once');
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 14:
                _q.sent();
                _g = expect;
                return [4 /*yield*/, first];
            case 15:
                _g.apply(void 0, [(_q.sent()).result]).toBe('ran');
                // Its later commands, and its helper's, run without another press, each with its own grant
                _h = expect;
                return [4 /*yield*/, bash('b2', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"))];
            case 16:
                // Its later commands, and its helper's, run without another press, each with its own grant
                _h.apply(void 0, [(_q.sent()).result]).toBe('ran');
                _j = expect;
                return [4 /*yield*/, bash('b3', "".concat(ADMIN, " m4 'whoami'"), 'a2')];
            case 17:
                _j.apply(void 0, [(_q.sent()).result]).toBe('ran');
                expect(admins.map(function (one) { return one.grants.map(function (grant) { return grant.command; }); })).toEqual([['id -u'], ['chmod 644 /etc/hosts'], ['whoami']]);
                other = bash('b4', "".concat(ADMIN, " here 'id -u'"), 'a3');
                _k = expect;
                return [4 /*yield*/, held('b4')];
            case 18:
                _k.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b4-0-deny')];
            case 19:
                _q.sent();
                _l = expect;
                return [4 /*yield*/, other];
            case 20:
                _l.apply(void 0, [(_q.sent()).deny]).toContain('Refused by Sam');
                // Ended and started again, it asks again
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 21:
                // Ended and started again, it asks again
                _q.sent();
                back = bash('b5', "".concat(ADMIN, " here 'id -u'"));
                _m = expect;
                return [4 /*yield*/, held('b5')];
            case 22:
                _m.apply(void 0, [_q.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b5-0-deny')];
            case 23:
                _q.sent();
                return [4 /*yield*/, back];
            case 24:
                _q.sent();
                expect(admins.length).toBe(3);
                return [2 /*return*/];
        }
    });
}); });
var _loop_1 = function (admin) {
    test("\"".concat(admin, "\" written into config.json by anything but Config counts for nothing: every command still asks"), function ($, on) { return __awaiter(_this, void 0, void 0, function () {
        var _a, press, bash, held, admins, files, call, _b, config, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, gated($, on, { admin: admin, adminSealed: fakeSeal('kept-key', "mode\n".concat(admin)).replace(/^./, 'z') })];
                case 1:
                    _a = _d.sent(), press = _a.press, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files;
                    files.set('keychain:gate', 'kept-key');
                    call = bash('b1', "".concat(ADMIN, " here 'id -u'"));
                    _b = expect;
                    return [4 /*yield*/, held('b1')];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toBeDefined();
                    expect(admins.length).toBe(0);
                    return [4 /*yield*/, press('gate-b1-0-deny')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, call];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
                case 5:
                    config = _d.sent();
                    _c = expect;
                    return [4 /*yield*/, config.find({ type: 'Text', text: new RegExp("config\\.json says \"".concat(admin, "\", but it was not chosen here, so every command asks")) })];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var _i = 0, _a = ['never', 'work']; _i < _a.length; _i++) {
    var admin = _a[_i];
    _loop_1(admin);
}
test('never asked, as Config sealed it: the call goes through as it was made, with no hold, no grant and nothing on the card', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, admins, files, grants, logged, notified, before, r, _b, config, _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, gated($, on, { admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }, { env: {} })];
            case 1:
                _a = _e.sent(), press = _a.press, list = _a.list, bash = _a.bash, admins = _a.admins, files = _a.files, grants = _a.grants, logged = _a.logged, notified = _a.notified;
                files.set('keychain:gate', 'kept-key');
                before = __spreadArray([], files.keys(), true).filter(function (path) { return !path.endsWith('log.md'); }).sort();
                return [4 /*yield*/, bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"))];
            case 2:
                r = _e.sent();
                expect(r.result).toBe('ran');
                expect(r.deny).toBeUndefined();
                expect(admins).toEqual([{ command: "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"), grants: [] }]);
                expect(grants()).toEqual([]);
                expect(files.has(ALLOWED)).toBe(false);
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return !path.endsWith('log.md') && !path.includes('/live/'); }).sort()).toEqual(before.filter(function (path) { return !path.includes('/live/'); }));
                expect(logged.some(function (line) { return line.includes('admin command'); })).toBe(false);
                expect(notified.some(function (line) { return line.includes('admin command'); })).toBe(false);
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })];
            case 3:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                config = _e.sent();
                return [4 /*yield*/, pressed(config, 'config-admin-mode-back')];
            case 5:
                _e.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').admin === undefined ? true : undefined)];
                    }); }); })];
            case 6:
                _c.apply(void 0, [_e.sent()]).toBe(true);
                expect(JSON.parse((_d = files.get("".concat(MEMORY, "/config.json"))) !== null && _d !== void 0 ? _d : '{}')).toEqual({ name: 'Sam' });
                expect(files.get('keychain:gate')).not.toBe('kept-key');
                return [2 /*return*/];
        }
    });
}); });
test('with no panel to ask on, an admin command is refused, never run unasked', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, admins, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, gated($, on, {}, { headless: true })];
            case 1:
                _a = _c.sent(), press = _a.press, bash = _a.bash, admins = _a.admins;
                _b = expect;
                return [4 /*yield*/, bash('b1', "".concat(ADMIN, " here 'id -u'"))];
            case 2:
                _b.apply(void 0, [(_c.sent()).deny]).toContain('no panel is drawn for this chat');
                expect(admins).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('Let macOS ask, keep nothing: chosen in Config it forgets every kept password, and it runs admin commands on this Mac only', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, files, config, _b, _c, _d, _e, _f, call, _g, _h;
    var _this = this;
    var _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _l.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 2:
                config = _l.sent();
                _b = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin password' })];
            case 3:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /a password can be read by any process running as you/ })];
            case 4:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, config.find({ type: 'Select', key: 'config-admin-password-pick' })];
            case 5:
                _d.apply(void 0, [((_j = (_l.sent())) === null || _j === void 0 ? void 0 : _j.props.options).map(function (one) { return one.label; })]).toEqual(["Keep it in this Mac's keychain", 'Let macOS ask, keep nothing']);
                return [4 /*yield*/, config.select({ key: 'config-admin-password-pick', value: 'macos' })];
            case 6:
                _l.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get('keychain:admin-forgotten')];
                    }); }); })];
            case 7:
                _e.apply(void 0, [_l.sent()]).toBe('yes');
                expect(JSON.parse((_k = files.get("".concat(MEMORY, "/config.json"))) !== null && _k !== void 0 ? _k : '{}')).toEqual({ name: 'Sam', adminPassword: 'macos' });
                // Another Mac has no screen here for macOS to ask on
                _f = expect;
                return [4 /*yield*/, bash('b1', "".concat(ADMIN, " m4 'id -u'"))];
            case 8:
                // Another Mac has no screen here for macOS to ask on
                _f.apply(void 0, [(_l.sent()).deny]).toContain('works only on this Mac');
                call = bash('b2', "".concat(ADMIN, " here 'id -u'"));
                _g = expect;
                return [4 /*yield*/, held('b2')];
            case 9:
                _g.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b2-0-once')];
            case 10:
                _l.sent();
                _h = expect;
                return [4 /*yield*/, call];
            case 11:
                _h.apply(void 0, [(_l.sent()).result]).toBe('ran');
                expect(admins.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, list, _loop_2, _i, _a, id;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                w = world(on);
                w.files.set('keychain:gate', 'kept-key');
                w.files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 3:
                list = _b.sent();
                _loop_2 = function (id) {
                    var call, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: "".concat(ADMIN, " here 'id -u'") });
                                _c = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(list, "gate-".concat(id, "-0-deny"))];
                                    }); }); })];
                            case 1:
                                _c.apply(void 0, [_h.sent()]).toBeDefined();
                                _d = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })];
                            case 2:
                                _d.apply(void 0, [_h.sent()]).toBeDefined();
                                // No piece of work to allow it for: the chat's thread never ends, so it is asked each time
                                _e = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 3:
                                // No piece of work to allow it for: the chat's thread never ends, so it is asked each time
                                _e.apply(void 0, [(_h.sent()).map(function (one) { return one.props.label; })]).toContain('Allow once');
                                _f = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Button' })];
                            case 4:
                                _f.apply(void 0, [(_h.sent()).map(function (one) { return one.props.label; })]).not.toContain('Allow for this work');
                                return [4 /*yield*/, pressed(list, "gate-".concat(id, "-0-once"))];
                            case 5:
                                _h.sent();
                                w.wake();
                                _g = expect;
                                return [4 /*yield*/, call];
                            case 6:
                                _g.apply(void 0, [(_h.sent()).result]).toBe('ran');
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ['c1', 'c2'];
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                id = _a[_i];
                return [5 /*yield**/, _loop_2(id)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                expect(w.admins.length).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, list, _b, _c, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                at = 1700000000000;
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at: at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at: at }], startedAt: at - 60000, endedAt: 0, status: 'working' }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'softwareupdate -i -a' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Wants to run an admin command on this Mac' })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Allow or deny it on its card in its own chat.' })];
            case 6:
                _d.apply(void 0, [_f.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 7:
                _e.apply(void 0, [(_f.sent()).some(function (one) { return ['Allow once', 'Always allow this command', 'Deny'].includes(String(one.props.label)); })]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
