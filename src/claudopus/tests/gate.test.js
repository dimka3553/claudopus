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
    var _a, press, list, bash, labels, held, grants, admins, logged, appended, notified, files, done, call, _b, _c, _d, _e, _f, details, _g, _h, grant, _j, _k, _l;
    var _this = this;
    var _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _t.sent(), press = _a.press, list = _a.list, bash = _a.bash, labels = _a.labels, held = _a.held, grants = _a.grants, admins = _a.admins, logged = _a.logged, appended = _a.appended, notified = _a.notified, files = _a.files;
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on this Mac?' })];
            case 3:
                _c.apply(void 0, [(_m = (_t.sent())) === null || _m === void 0 ? void 0 : _m.props.color]).toBe('#E5A50A');
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' })];
            case 4:
                _d.apply(void 0, [(_o = (_t.sent())) === null || _o === void 0 ? void 0 : _o.props.mono]).toBe(true);
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: "Allow once: it runs as admin. Deny: it doesn't run, and Claudopus tells Claude." })];
            case 5:
                _e.apply(void 0, [_t.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, labels()];
            case 6:
                _f.apply(void 0, [(_t.sent()).filter(function (one) { return ['Allow once', 'Always allow this command', 'Deny'].includes(one); })]).toEqual(['Allow once', 'Always allow this command', 'Deny']);
                // Said as a notification, and to the chat's model alone: the chat shows nothing of it (18 Nov: "garbage I don't need to read");
                // its Details tab has it at the top
                expect(logged.some(function (line) { return line.includes('chmod 644 /etc/hosts'); })).toBe(false);
                expect(appended.some(function (line) { return line.startsWith('undefined: From Claudopus: the task "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts.'); })).toBe(true);
                expect(notified).toContain('Fix the hosts file has a question for you | Run an admin command on this Mac: chmod 644 /etc/hosts');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 7:
                details = _t.sent();
                _g = expect;
                return [4 /*yield*/, details.find({ type: 'Text', text: 'Waiting for you' })];
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on this Mac?' })];
            case 11:
                _j.apply(void 0, [_t.sent()]).toBeUndefined();
                // In its place for a minute: what the person pressed and what happens now
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on m4?' })];
            case 3:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-deny')];
            case 4:
                _g.sent();
                return [4 /*yield*/, call];
            case 5:
                r = _g.sent();
                expect(r.deny).toBe("Refused by Sam: Sam pressed Deny on this admin command, so it didn't run. Don't try to run it another way. Continue without it, or say what it is needed for and ask again.");
                expect(admins).toEqual([]);
                expect(grants()).toEqual([]);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on m4?' })];
            case 6:
                _d.apply(void 0, [_g.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: "You denied it. It didn't run, and Claudopus told Claude." })];
                    }); }); })];
            case 7:
                _e.apply(void 0, [_g.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Admin command on m4' })];
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
                // As if it got past the guards with the kept copy (a key F-007's way): the seals still allow nothing
                ownSet(files, 'admin-allowed.json', JSON.stringify(forged));
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
                return [4 /*yield*/, config.find({ type: 'Text', text: /2 more in the file weren't added here, so they allow nothing/ })];
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
                _c.apply(void 0, [(_k.sent()).deny]).toContain('Only Sam adds to them');
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
                _h.apply(void 0, [(_k.sent()).deny]).toContain('Only Sam adds to them');
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
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin commands' })];
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
                _e.apply(void 0, [_q.sent()]).toContain('Allow for this task');
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
                    return [4 /*yield*/, config.find({ type: 'Text', text: new RegExp("Your settings file says \"".concat(admin, "\", but you didn't choose it here, so every command asks")) })];
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on this Mac?' })];
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
                _b.apply(void 0, [(_c.sent()).deny]).toContain('this chat has no panel open');
                expect(admins).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test('F-008 F-009 · no admin password is kept: Config has no setting to keep one, every one an earlier version kept is forgotten as the mod loads, and admin commands on another Mac still ask on their card', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, held, admins, files, _b, _c, config, _d, _e, call, _f, _g;
    var _this = this;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, gated($, on, { adminPassword: 'keep' })];
            case 1:
                _a = _h.sent(), press = _a.press, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files;
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get('keychain:admin-forgotten')];
                    }); }); })];
            case 2:
                _b.apply(void 0, [_h.sent()]).toBe('yes');
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').adminPassword === undefined ? true : undefined)];
                    }); }); })];
            case 3:
                _c.apply(void 0, [_h.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                config = _h.sent();
                _d = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin password' })];
            case 5:
                _d.apply(void 0, [_h.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /Each one still asks for the admin password, which Claudopus never saves/ })];
            case 6:
                _e.apply(void 0, [_h.sent()]).toBeDefined();
                call = bash('b2', "".concat(ADMIN, " m4 'id -u'"));
                _f = expect;
                return [4 /*yield*/, held('b2')];
            case 7:
                _f.apply(void 0, [_h.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b2-0-once')];
            case 8:
                _h.sent();
                _g = expect;
                return [4 /*yield*/, call];
            case 9:
                _g.apply(void 0, [(_h.sent()).result]).toBe('ran');
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
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on this Mac?' })];
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
                                _f.apply(void 0, [(_h.sent()).map(function (one) { return one.props.label; })]).not.toContain('Allow for this task');
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
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run an admin command on this Mac?' })];
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
test('a release whose output goes to a log asks once, for its own branch: the 15 Nov run-progress-rows release asked twice, first for a branch called ">"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, press, files, grants, holding, _loop_3, _i, _b, _c, id, tail;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _e.sent(), list = _a.list, press = _a.press, files = _a.files, grants = _a.grants, holding = _a.holding;
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-it');
                _loop_3 = function (id, tail) {
                    var call, _f, _g, _h, granted, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: "hold x".concat(id, "; /plug/claudopus/bin/release").concat(tail) });
                                _f = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(list, "gate-".concat(id, "-r0-once"))];
                                    }); }); })];
                            case 1:
                                _f.apply(void 0, [_k.sent()]).toBeDefined();
                                // Said in plain words: what is released, its branch, and where from in one line
                                _g = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Branch fix-it' })];
                            case 2:
                                // Said in plain words: what is released, its branch, and where from in one line
                                _g.apply(void 0, [_k.sent()]).toBeDefined();
                                _h = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Text' })];
                            case 3:
                                _h.apply(void 0, [(_k.sent()).some(function (one) { var _a; return /^>|> from/.test(String((_a = one.text) !== null && _a !== void 0 ? _a : '')); })]).toBe(false);
                                return [4 /*yield*/, press("gate-".concat(id, "-r0-once"))];
                            case 4:
                                _k.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, (grants().length ? grants() : undefined)];
                                    }); }); })];
                            case 5:
                                granted = _k.sent();
                                expect(granted === null || granted === void 0 ? void 0 : granted.map(function (path) { var _a; return (function (_a) {
                                    var host = _a.host, command = _a.command;
                                    return [host, command];
                                })(JSON.parse((_a = files.get(path)) !== null && _a !== void 0 ? _a : '{}')); })).toEqual([['release', '/repo/wt\nfix-it']]);
                                (_d = holding.get("x".concat(id, "; /plug/claudopus/bin/release").concat(tail))) === null || _d === void 0 ? void 0 : _d('released');
                                _j = expect;
                                return [4 /*yield*/, call];
                            case 6:
                                _j.apply(void 0, [(_k.sent()).deny]).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = [['rl1', ' > /tmp/release.log 2>&1'], ['rl2', ' 2>/tmp/release.log'], ['rl3', '>/tmp/release.log']];
                _e.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                _c = _b[_i], id = _c[0], tail = _c[1];
                return [5 /*yield**/, _loop_3(id, tail)];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
test('a press is answered by a line, not a card: an ask is an outlined box, what was done a line with no fill or edge that goes once its call ends', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, held, list, clock, call, _b, boxes, _c, _d, _e, edges, withNote, _f, _g;
    var _this = this;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _h.sent(), press = _a.press, bash = _a.bash, held = _a.held, list = _a.list, clock = _a.clock;
                call = bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                boxes = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Box' })];
                        case 1: return [2 /*return*/, (_a.sent())
                            // The ask: an outlined box in the colour of what needs the person, the kind of ask at its top
                        ];
                    }
                }); }); };
                // The ask: an outlined box in the colour of what needs the person, the kind of ask at its top
                _c = expect;
                return [4 /*yield*/, boxes()];
            case 3:
                // The ask: an outlined box in the colour of what needs the person, the kind of ask at its top
                _c.apply(void 0, [(_h.sent()).some(function (one) { return one.props.borderStyle === 'round' && one.props.borderColor === '#E5A50A'; })]).toBe(true);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Admin command · waiting for you' })];
            case 4:
                _d.apply(void 0, [_h.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 5:
                _h.sent();
                return [4 /*yield*/, call];
            case 6:
                _h.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
                    }); }); })];
            case 7:
                _e.apply(void 0, [_h.sent()]).toBeDefined();
                edges = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, boxes()];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.backgroundColor === '#8A63F0' || one.props.backgroundColor === '#80808024'; }).length];
                    }
                }); }); };
                return [4 /*yield*/, edges()
                    // Its call has ended: once it could be read, it goes, well before a minute
                ];
            case 8:
                withNote = _h.sent();
                // Its call has ended: once it could be read, it goes, well before a minute
                return [4 /*yield*/, clock.advance(16000)];
            case 9:
                // Its call has ended: once it could be read, it goes, well before a minute
                _h.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 10:
                _f.apply(void 0, [_h.sent()]).toBe(true);
                // It had no fill or purple edge of its own, as a piece of work has
                _g = expect;
                return [4 /*yield*/, edges()];
            case 11:
                // It had no fill or purple edge of its own, as a piece of work has
                _g.apply(void 0, [_h.sent()]).toBe(withNote);
                return [2 /*return*/];
        }
    });
}); });
// A long list of another chat's running work, two of whose cards wait on a gate and one on an ask: what the 15 Nov panel drew below
// the fold, where the person had to scroll to find Allow once
var longList = function (at, gates, asks) {
    if (asks === void 0) { asks = {}; }
    return JSON.stringify({
        chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '',
        at: at,
        cards: ['one', 'two', 'three', 'four', 'five', 'six'].map(function (name, n) { return (__assign(__assign({ id: "w".concat(n + 1), parentId: '', isFork: false, tokens: 0, title: "Card ".concat(name), words: name, items: [], entries: [], answer: '', startedAt: at - 600000 + n * 60000, endedAt: 0, status: 'working' }, (gates["w".concat(n + 1)] ? { admins: [{ id: "g".concat(n + 1), host: 'here', command: "run step ".concat(name), at: gates["w".concat(n + 1)] }] } : {})), (asks["w".concat(n + 1)] ? { ask: { text: "Which way for ".concat(name, "?"), at: asks["w".concat(n + 1)], choices: ['Left', 'Right'] } } : {}))); }),
    });
};
var textOrder = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); })];
    }
}); }); };
test('a work that waits for a press comes to the top whole, its amber box in it, the oldest first with the cards that asked; answered, it keeps its place while anything else waits, and goes back once nothing does', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, list, _b, texts, first, rest, _c, after, _d, _e;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _f.sent();
                at = 1700000000000;
                files.set("".concat(MEMORY, "/live/chat-b.json"), longList(at, { w5: at - 2000, w6: at - 1000 }, { w4: at - 1500 }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _f.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'run step six' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, textOrder(list)];
            case 5:
                texts = _f.sent();
                first = function (text) { return texts.indexOf(text); };
                // Oldest first, as they came: the older gate's card, the card that asked, the card whose gate came last; then the rest in the
                // order they began, so what comes later goes under what is already there
                expect(first('Card five')).toBeLessThan(first('Card four'));
                expect(first('Card four')).toBeLessThan(first('Card six'));
                expect(first('Card six')).toBeLessThan(first('Card one'));
                // Each gate is in its own card, right under its title, never apart from it
                expect(first('Card five')).toBeLessThan(first('run step five'));
                expect(first('run step five')).toBeLessThan(first('Card four'));
                expect(first('Card six')).toBeLessThan(first('run step six'));
                expect(first('run step six')).toBeLessThan(first('Card one'));
                rest = function (all) { return all.filter(function (one) { return /^Card (one|two|three)$/.test(one); }); };
                expect(rest(texts)).toEqual(['Card one', 'Card two', 'Card three']);
                // The older gate is answered (in its own chat) while the others still wait: its card stays where it was, and nothing moves
                files.set("".concat(MEMORY, "/live/chat-b.json"), longList(at + 6000, { w6: at - 1000 }, { w4: at - 1500 }));
                return [4 /*yield*/, clock.advance(5000)];
            case 6:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'run step five' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 7:
                _c.apply(void 0, [_f.sent()]).toBe(true);
                return [4 /*yield*/, textOrder(list)];
            case 8:
                after = _f.sent();
                expect(after.indexOf('Card five')).toBeLessThan(after.indexOf('Card four'));
                expect(after.indexOf('Card four')).toBeLessThan(after.indexOf('Card six'));
                expect(after.filter(function (one) { return /^Card (one|two|three)$/.test(one); })).toEqual(['Card one', 'Card two', 'Card three']);
                expect(after.indexOf('Card six')).toBeLessThan(after.indexOf('Card one'));
                // Once nothing waits, the cards go back to where they began
                files.set("".concat(MEMORY, "/live/chat-b.json"), longList(at + 12000, {}, {}));
                return [4 /*yield*/, clock.advance(5000)];
            case 9:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'run step six' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 10:
                _d.apply(void 0, [_f.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, textOrder(list)];
                            case 1: return [2 /*return*/, ((_a.sent()).filter(function (one) { return /^Card /.test(one); }).join('|') === 'Card one|Card two|Card three|Card four|Card five|Card six' ? true : undefined)];
                        }
                    }); }); })];
            case 11:
                _e.apply(void 0, [_f.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test('a gate answered on its card says what was allowed in that same card, outlined green, while the card stays at the top', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, held, list, call, _b, green, texts, call2, _c, now;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _d.sent(), press = _a.press, bash = _a.bash, held = _a.held, list = _a.list;
                call = bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 3:
                _d.sent();
                return [4 /*yield*/, call];
            case 4:
                _d.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.findAll({ type: 'Box' })];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.props.borderStyle === 'round' && one.props.borderColor === 'success'; })];
                        }
                    }); }); })];
            case 5:
                green = _d.sent();
                expect(green === null || green === void 0 ? void 0 : green.key).toBe('done-gate-b1-0');
                return [4 /*yield*/, textOrder(list)
                    // In its card, under the work's title, not a line of its own at the top
                ];
            case 6:
                texts = _d.sent();
                // In its card, under the work's title, not a line of its own at the top
                expect(texts.indexOf('Fix the hosts file')).toBeLessThan(texts.indexOf('You allowed it. It runs now.'));
                expect(texts.filter(function (one) { return one === 'You allowed it. It runs now.'; }).length).toBe(1);
                // Another work's gate comes in: its card is drawn under the answered one, which keeps its place while anything waits
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Tidy the logs', prompt: 'tidy the logs' }))];
            case 7:
                // Another work's gate comes in: its card is drawn under the answered one, which keeps its place while anything waits
                _d.sent();
                call2 = bash('b2', "".concat(ADMIN, " here 'id -u'"), 'a2');
                _c = expect;
                return [4 /*yield*/, held('b2')];
            case 8:
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, textOrder(list)];
            case 9:
                now = _d.sent();
                expect(now.indexOf('Tidy the logs')).toBeGreaterThan(-1);
                expect(now.indexOf('Fix the hosts file')).toBeLessThan(now.indexOf('Tidy the logs'));
                void call2.catch(function () { return undefined; });
                return [2 /*return*/];
        }
    });
}); });
test('on the desktop the line above the prompt says how many wait and what the first asks, scrolled or not, and Show takes a scrolled list to the top; in the terminal it comes only once scrolled', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, MARK, show, _loop_4, _i, _b, surface;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { panes: ['claudopus'] }), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                at = 1700000000000;
                files.set("".concat(MEMORY, "/live/chat-b.json"), longList(at, { w5: at - 2000, w6: at - 1000 }));
                return [4 /*yield*/, clock.advance(5000)
                    // The first is the card whose gate came first: w5's
                ];
            case 2:
                _c.sent();
                MARK = /^● 2 questions waiting for you · first: /;
                show = function (band) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, band.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (one) { return one.props.label === 'Show'; })];
                    }
                }); }); };
                _loop_4 = function (surface) {
                    var down, _d, band, mark, _e, top_1, _f, still, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 40, bodyRows: 20 } }), surface: surface }))];
                            case 1:
                                down = _k.sent();
                                _d = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, down.find({ type: 'Text', text: 'run step six' })];
                                    }); }); })];
                            case 2:
                                _d.apply(void 0, [_k.sent()]).toBeDefined();
                                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
                            case 3:
                                band = _k.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, band.find({ type: 'Text', text: MARK })];
                                    }); }); })];
                            case 4:
                                mark = _k.sent();
                                expect(mark === null || mark === void 0 ? void 0 : mark.props.color).toBe('#E5A50A');
                                _e = expect;
                                return [4 /*yield*/, show(band)];
                            case 5:
                                _e.apply(void 0, [_k.sent()]).toBe(true);
                                return [4 /*yield*/, band.unmount()];
                            case 6:
                                _k.sent();
                                return [4 /*yield*/, down.unmount()];
                            case 7:
                                _k.sent();
                                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: surface }))];
                            case 8:
                                top_1 = _k.sent();
                                _f = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, top_1.find({ type: 'Text', text: 'run step six' })];
                                    }); }); })];
                            case 9:
                                _f.apply(void 0, [_k.sent()]).toBeDefined();
                                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
                            case 10:
                                still = _k.sent();
                                if (!(surface === 'desktop')) return [3 /*break*/, 12];
                                _g = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, still.find({ type: 'Text', text: MARK })];
                                    }); }); })];
                            case 11:
                                _g.apply(void 0, [_k.sent()]).toBeDefined();
                                return [3 /*break*/, 14];
                            case 12:
                                _h = expect;
                                return [4 /*yield*/, still.find({ type: 'Text', text: MARK })];
                            case 13:
                                _h.apply(void 0, [_k.sent()]).toBeUndefined();
                                _k.label = 14;
                            case 14:
                                _j = expect;
                                return [4 /*yield*/, show(still)];
                            case 15:
                                _j.apply(void 0, [_k.sent()]).toBe(false);
                                return [4 /*yield*/, still.unmount()];
                            case 16:
                                _k.sent();
                                return [4 /*yield*/, top_1.unmount()];
                            case 17:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = ['desktop', 'terminal'];
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                surface = _b[_i];
                return [5 /*yield**/, _loop_4(surface)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); });
test("in the terminal, an ask that comes in while one is typed in never takes the keys from it; the oldest ask is drawn first", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, list, focused, _a, _b, texts, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                clock = world(on).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two things', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Check the ears', prompt: 'check the ears' }))];
            case 4:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 6:
                list = _d.sent();
                focused = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return one.props.autoFocus; }).map(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').split('-reply')[0]; })];
                    }
                }); }); };
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, focused()];
                            case 1: return [2 /*return*/, ((_a.sent()).length ? focused() : undefined)];
                        }
                    }); }); })];
            case 7:
                _a.apply(void 0, [_d.sent()]).toEqual([expect.stringContaining('a1')]);
                return [4 /*yield*/, clock.advance(2000)];
            case 8:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Which ear first?', choices: ['Left', 'Right'] })];
            case 9:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Which ear first?' })];
                    }); }); })];
            case 10:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, textOrder(list)];
            case 11:
                texts = _d.sent();
                expect(texts.indexOf('May I delete the old repo?')).toBeLessThan(texts.indexOf('Which ear first?'));
                _c = expect;
                return [4 /*yield*/, focused()];
            case 12:
                _c.apply(void 0, [_d.sent()]).toEqual([expect.stringContaining('a1')]);
                return [2 /*return*/];
        }
    });
}); });
test('the line above the prompt never points into a list that is not open', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, down, _b, band, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                at = 1700000000000;
                files.set("".concat(MEMORY, "/live/chat-b.json"), longList(at, { w5: at - 2000, w6: at - 1000 }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { scroll: { offset: 40, bodyRows: 20 } }), surface: 'desktop' }))];
            case 3:
                down = _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, down.find({ type: 'Text', text: 'run step six' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, down.unmount()];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'desktop' }))];
            case 6:
                band = _d.sent();
                _c = expect;
                return [4 /*yield*/, textOrder(band)];
            case 7:
                _c.apply(void 0, [(_d.sent()).some(function (one) { return one.includes('waiting for you'); })]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('in the terminal, a password box that comes while a reply is being typed leaves the keys with the reply', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, list, inputs, reply, id, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                w = world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two things', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
            case 4:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 5:
                list = _d.sent();
                inputs = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return ({ key: (_a = one.key) !== null && _a !== void 0 ? _a : '', focus: Boolean(one.props.autoFocus) }); })];
                    }
                }); }); };
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.focus; })];
                        }
                    }); }); })];
            case 6:
                reply = _d.sent();
                return [4 /*yield*/, list.input({ key: (_c = reply === null || reply === void 0 ? void 0 : reply.key) !== null && _c !== void 0 ? _c : '', text: 'Not y', kind: 'change' })];
            case 7:
                _d.sent();
                void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: "hold /plug/claudopus/bin/admin m4 'id -u'" }));
                id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98';
                w.files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, w.clock.advance(1000)];
            case 8:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one.key.startsWith('box-'); }) ? true : undefined)];
                        }
                    }); }); })];
            case 9:
                _a.apply(void 0, [_d.sent()]).toBe(true);
                _b = expect;
                return [4 /*yield*/, inputs()];
            case 10:
                _b.apply(void 0, [(_d.sent()).filter(function (one) { return one.focus; }).map(function (one) { return one.key; })]).toEqual([reply === null || reply === void 0 ? void 0 : reply.key]);
                return [4 /*yield*/, w.settle()];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('in the terminal, an ask that comes while a password is being typed leaves the keys with the password box', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, list, id, inputs, box, _a, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                w = world(on);
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'two things', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Hide the repo', prompt: 'make the repo private' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'terminal' }))];
            case 4:
                list = _d.sent();
                void w.keep($.tool.call({ tool: 'Bash', tool_use_id: 'run-1', agentId: 'a1', command: "hold /plug/claudopus/bin/admin m4 'id -u'" }));
                id = '9f1e2d3c-4b5a-4987-a654-3210fedcba98';
                w.files.set("".concat(MEMORY, "/boxes/").concat(id, ".json"), JSON.stringify({ id: id, kind: 'admin', host: 'm4', key: BOX_PUBLIC, chat: 'engine-id', at: 1700000000000 }));
                return [4 /*yield*/, w.clock.advance(1000)];
            case 5:
                _d.sent();
                inputs = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Input' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return ({ key: (_a = one.key) !== null && _a !== void 0 ? _a : '', focus: Boolean(one.props.autoFocus) }); })];
                    }
                }); }); };
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.key.startsWith('box-'); })];
                        }
                    }); }); })];
            case 6:
                box = _d.sent();
                return [4 /*yield*/, list.input({ key: (_c = box === null || box === void 0 ? void 0 : box.key) !== null && _c !== void 0 ? _c : '', text: 'hunt', kind: 'change' })];
            case 7:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve', 'Not now'] })];
            case 8:
                _d.sent();
                _a = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inputs()];
                            case 1: return [2 /*return*/, ((_a.sent()).some(function (one) { return one.key.startsWith('ask-'); }) ? true : undefined)];
                        }
                    }); }); })];
            case 9:
                _a.apply(void 0, [_d.sent()]).toBe(true);
                _b = expect;
                return [4 /*yield*/, inputs()];
            case 10:
                _b.apply(void 0, [(_d.sent()).filter(function (one) { return one.focus; }).map(function (one) { return one.key; })]).toEqual([box === null || box === void 0 ? void 0 : box.key]);
                return [4 /*yield*/, w.settle()];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
// Five pieces of work, the fourth asking: the 15 Nov "Release it" on an ended ask took the card from the top to the very end of a long
// panel, which read as the panel jumping to the bottom
var askingFourth = function ($_1, on_1, choices_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, on_1, choices_1], args_1, true), void 0, function ($, on, choices, ended) {
        var w, _a, _b, n, list, order, _c;
        var _this = this;
        if (ended === void 0) { ended = false; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    w = world(on);
                    return [4 /*yield*/, $.session.start(start)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, $.prompt.submit({ text: 'five things', wait: false, origin: composer })];
                case 2:
                    _d.sent();
                    _a = 0, _b = [1, 2, 3, 4, 5];
                    _d.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 6];
                    n = _b[_a];
                    return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: "Piece ".concat(n), prompt: "piece ".concat(n) }))];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
                case 7:
                    list = _d.sent();
                    return [4 /*yield*/, $.tool.call(__assign({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release piece four?' }, (choices ? { choices: choices } : {})))];
                case 8:
                    _d.sent();
                    if (!ended) return [3 /*break*/, 10];
                    return [4 /*yield*/, $.turn.complete({ answer: 'Waits for your Release it.', durationMs: 1, isAborted: false, turnId: 'turn-a4', reason: 'answer', agentId: 'a4' })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10: return [4 /*yield*/, w.clock.advance(5000)];
                case 11:
                    _d.sent();
                    order = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, textOrder(list)];
                            case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { return /^Piece \d$/.test(one); }).filter(function (one, n, all) { return all.indexOf(one) === n; })];
                        }
                    }); }); };
                    _c = expect;
                    return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, order()];
                                case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 4' ? true : undefined)];
                            }
                        }); }); })];
                case 12:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/, __assign(__assign({}, w), { list: list, order: order })];
            }
        });
    });
};
test('Release it on an ended ask leaves its card where it was, saying the answer, and the work started again keeps its place, never the end', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, clock, resumed, release, _b, _c, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, askingFourth($, on, ['Release it', 'Not now'], true)];
            case 1:
                _a = _h.sent(), list = _a.list, order = _a.order, clock = _a.clock, resumed = _a.resumed;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 2:
                release = (_h.sent()).find(function (one) { return one.props.label === 'Release it'; });
                return [4 /*yield*/, list.press({ key: (_g = release === null || release === void 0 ? void 0 : release.key) !== null && _g !== void 0 ? _g : '' })];
            case 3:
                _h.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, resumed.find(function (line) { return line.startsWith('a4: ') && line.includes('pressed "Release it"'); })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /You answered “Release it”/ })];
                    }); }); })];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, order()];
            case 6:
                _d.apply(void 0, [_h.sent()]).toEqual(['Piece 4', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 5']);
                // A minute on, it takes its own place among the others: where it began, not after them
                return [4 /*yield*/, clock.advance(65000)];
            case 7:
                // A minute on, it takes its own place among the others: where it began, not after them
                _h.sent();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 1' ? true : undefined)];
                        }
                    }); }); })];
            case 8:
                _e.apply(void 0, [_h.sent()]).toBe(true);
                _f = expect;
                return [4 /*yield*/, order()];
            case 9:
                _f.apply(void 0, [_h.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                return [2 /*return*/];
        }
    });
}); });
var answeredStays = function ($, on, how) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, clock, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l;
    var _this = this;
    var _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0: return [4 /*yield*/, askingFourth($, on)];
            case 1:
                _a = _r.sent(), list = _a.list, order = _a.order, clock = _a.clock;
                if (!(how === 'press')) return [3 /*break*/, 4];
                _b = pressed;
                _c = [list];
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([(_o = (_m = (_r.sent()).find(function (one) { return one.props.label === 'Done'; })) === null || _m === void 0 ? void 0 : _m.key) !== null && _o !== void 0 ? _o : '']))];
            case 3:
                _r.sent();
                return [3 /*break*/, 7];
            case 4:
                _e = (_d = list).input;
                _l = {};
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 5: return [4 /*yield*/, _e.apply(_d, [(_l.key = (_q = (_p = (_r.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _p === void 0 ? void 0 : _p.key) !== null && _q !== void 0 ? _q : '', _l.text = 'It is pasted', _l)])];
            case 6:
                _r.sent();
                _r.label = 7;
            case 7:
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /You answered/ })];
                    }); }); })];
            case 8:
                _f.apply(void 0, [_r.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, order()];
            case 9:
                _g.apply(void 0, [_r.sent()]).toEqual(['Piece 4', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 5']);
                return [4 /*yield*/, clock.advance(30000)];
            case 10:
                _r.sent();
                _h = expect;
                return [4 /*yield*/, order()];
            case 11:
                _h.apply(void 0, [(_r.sent())[0]]).toBe('Piece 4');
                // A minute on, it takes its own place among the others
                return [4 /*yield*/, clock.advance(35000)];
            case 12:
                // A minute on, it takes its own place among the others
                _r.sent();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 1' ? true : undefined)];
                        }
                    }); }); })];
            case 13:
                _j.apply(void 0, [_r.sent()]).toBe(true);
                _k = expect;
                return [4 /*yield*/, order()];
            case 14:
                _k.apply(void 0, [_r.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                return [2 /*return*/];
        }
    });
}); };
test('Done on an ask leaves the card at the top saying the answer for a minute, then in its own place', function ($, on) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, answeredStays($, on, 'press')];
}); }); });
test('an answer sent from an ask\'s box leaves the card at the top saying the answer for a minute, then in its own place', function ($, on) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, answeredStays($, on, 'reply')];
}); }); });
test('answering one of two asks at the top leaves both cards where they were, the oldest first, for as long as the other still waits; once nothing waits they go back to their places', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, clock, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, labelled, _m, _o, _p, _q, _r, _s;
    var _this = this;
    var _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0: return [4 /*yield*/, askingFourth($, on)];
            case 1:
                _a = _v.sent(), list = _a.list, order = _a.order, clock = _a.clock;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release piece two?', choices: ['Release it', 'Not now'] })];
            case 2:
                _v.sent();
                return [4 /*yield*/, clock.advance(5000)
                    // The newer ask goes under the older one, never above it
                ];
            case 3:
                _v.sent();
                // The newer ask goes under the older one, never above it
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[1] === 'Piece 2' ? true : undefined)];
                        }
                    }); }); })];
            case 4:
                // The newer ask goes under the older one, never above it
                _b.apply(void 0, [_v.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, order()];
            case 5:
                _c.apply(void 0, [_v.sent()]).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5']);
                _d = pressed;
                _e = [list];
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 6: 
            // The older ask, first at the top, is answered: it stays first, and it still says the answer under the line its work then writes
            return [4 /*yield*/, _d.apply(void 0, _e.concat([(_u = (_t = (_v.sent()).find(function (one) { return one.props.label === 'Done'; })) === null || _t === void 0 ? void 0 : _t.key) !== null && _u !== void 0 ? _u : '']))];
            case 7:
                // The older ask, first at the top, is answered: it stays first, and it still says the answer under the line its work then writes
                _v.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /You answered “Done”/ })];
                    }); }); })];
            case 8:
                _f.apply(void 0, [_v.sent()]).toBeDefined();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n4', agentId: 'a4', text: 'Now doing the next part' })];
            case 9:
                _v.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 10:
                _v.sent();
                _g = expect;
                return [4 /*yield*/, order()];
            case 11:
                _g.apply(void 0, [_v.sent()]).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5']);
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /You answered “Done”/ })];
            case 12:
                _h.apply(void 0, [_v.sent()]).toBeDefined();
                // Past its minute, with the other ask still waiting, it keeps its place: nothing moves by itself
                return [4 /*yield*/, clock.advance(65000)];
            case 13:
                // Past its minute, with the other ask still waiting, it keeps its place: nothing moves by itself
                _v.sent();
                _j = expect;
                return [4 /*yield*/, order()];
            case 14:
                _j.apply(void 0, [_v.sent()]).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5']);
                // It asks again: new, it goes under what already waits
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a4', text: 'And the next part?', choices: ['Yes', 'No'] })];
            case 15:
                // It asks again: new, it goes under what already waits
                _v.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 16:
                _v.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 2' ? true : undefined)];
                        }
                    }); }); })];
            case 17:
                _k.apply(void 0, [_v.sent()]).toBe(true);
                _l = expect;
                return [4 /*yield*/, order()];
            case 18:
                _l.apply(void 0, [_v.sent()]).toEqual(['Piece 2', 'Piece 4', 'Piece 1', 'Piece 3', 'Piece 5']);
                labelled = function (label) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).find(function (one) { return one.props.label === label; })) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                _m = pressed;
                _o = [list];
                return [4 /*yield*/, labelled('Not now')];
            case 19: return [4 /*yield*/, _m.apply(void 0, _o.concat([_v.sent()]))];
            case 20:
                _v.sent();
                _p = pressed;
                _q = [list];
                return [4 /*yield*/, labelled('Yes')];
            case 21: return [4 /*yield*/, _p.apply(void 0, _q.concat([_v.sent()]))];
            case 22:
                _v.sent();
                return [4 /*yield*/, clock.advance(65000)];
            case 23:
                _v.sent();
                _r = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 1' ? true : undefined)];
                        }
                    }); }); })];
            case 24:
                _r.apply(void 0, [_v.sent()]).toBe(true);
                _s = expect;
                return [4 /*yield*/, order()];
            case 25:
                _s.apply(void 0, [_v.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                return [2 /*return*/];
        }
    });
}); });
// 15 Nov: Allow once was pressed and the amber box with its buttons stayed up to a second, until the gate's wait (a one-second
// sleep the engine runs) read the press; only then did the green box come
var pressedFirst = function ($_1, on_1, button_1, said_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, on_1, button_1, said_1], args_1, true), void 0, function ($, on, button, said, isRelease) {
        var w, call, base, _a, _b, _c, _d;
        var _this = this;
        var _e;
        if (isRelease === void 0) { isRelease = false; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, gated($, on)];
                case 1:
                    w = _f.sent();
                    if (isRelease)
                        (w.files.set('git:top', '/repo/wt'), w.files.set('git:branch', 'fix-it'));
                    call = w.bash('p1', isRelease ? 'hold xp1; /plug/claudopus/bin/release' : "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                    base = "gate-p1-".concat(isRelease ? 'r' : '', "0-").concat(button);
                    _a = expect;
                    return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, keyed(w.list, base)];
                        }); }); })];
                case 2:
                    _a.apply(void 0, [_f.sent()]).toBeDefined();
                    // Pressed, and the wait not yet let go: the drawing that follows the press shows the answer, with nothing left to press
                    return [4 /*yield*/, pressed(w.list, base)];
                case 3:
                    // Pressed, and the wait not yet let go: the drawing that follows the press shows the answer, with nothing left to press
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, w.list.find({ type: 'Text', text: said })];
                case 4:
                    _b.apply(void 0, [_f.sent()]).toBeDefined();
                    _c = expect;
                    return [4 /*yield*/, w.list.findAll({ type: 'Button' })];
                case 5:
                    _c.apply(void 0, [(_f.sent()).some(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('gate-p1-'); })]).toBe(false);
                    _d = expect;
                    return [4 /*yield*/, w.list.find({ type: 'Text', text: /· waiting for you$/ })];
                case 6:
                    _d.apply(void 0, [_f.sent()]).toBeUndefined();
                    w.wake();
                    if (!isRelease) return [3 /*break*/, 8];
                    return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, w.holding.get('xp1; /plug/claudopus/bin/release')];
                        }); }); })];
                case 7:
                    (_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e('released');
                    _f.label = 8;
                case 8: return [4 /*yield*/, call];
                case 9:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
};
test("Allow once on a gate draws it answered in the press's own drawing, before the wait reads it: green, with no buttons left", function ($, on) { return pressedFirst($, on, 'once', 'You allowed it. It runs now.'); });
test("Always allow on a gate draws it answered in the press's own drawing", function ($, on) { return pressedFirst($, on, 'always', "You always allow this command. It runs now, and Claudopus won't ask again."); });
test("Deny on a gate draws it answered in the press's own drawing", function ($, on) { return pressedFirst($, on, 'deny', "You denied it. It didn't run, and Claudopus told Claude."); });
test("Allow once on a release draws it answered in the press's own drawing", function ($, on) { return pressedFirst($, on, 'once', 'You allowed it. Claude is releasing it now.', true); });
test('two presses on a gate before its wait reads them send one answer: the first, as drawn', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, bash, held, wake, call, _b, once, deny, _c, _d, r, _e, _f, _g;
    var _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _m.sent(), list = _a.list, bash = _a.bash, held = _a.held, wake = _a.wake;
                call = bash('d1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _b = expect;
                return [4 /*yield*/, held('d1')];
            case 2:
                _b.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, keyed(list, 'gate-d1-0-once')];
            case 3:
                once = (_j = (_h = (_m.sent())) === null || _h === void 0 ? void 0 : _h.key) !== null && _j !== void 0 ? _j : '';
                return [4 /*yield*/, keyed(list, 'gate-d1-0-deny')];
            case 4:
                deny = (_l = (_k = (_m.sent())) === null || _k === void 0 ? void 0 : _k.key) !== null && _l !== void 0 ? _l : '';
                return [4 /*yield*/, list.press({ key: once })];
            case 5:
                _m.sent();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
            case 6:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: deny }).catch(function () { return undefined; })
                    // The second press changed nothing: the card still says what the first one did
                ];
            case 7:
                _m.sent();
                // The second press changed nothing: the card still says what the first one did
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
            case 8:
                // The second press changed nothing: the card still says what the first one did
                _d.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: once }).catch(function () { return undefined; })];
            case 9:
                _m.sent();
                wake();
                return [4 /*yield*/, call];
            case 10:
                r = (_m.sent());
                expect(r.deny).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 11:
                _e.apply(void 0, [(_m.sent()).filter(function (t) { var _a; return /^You (allowed|denied|always)/.test(String((_a = t.text) !== null && _a !== void 0 ? _a : '')); }).length]).toBe(1);
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
            case 12:
                _f.apply(void 0, [_m.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^You denied it/ })];
            case 13:
                _g.apply(void 0, [_m.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test('a gate allowed but not let through says so where its green box was, never a false "allowed"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, call, _a, r, _b, _c, _d;
    var _this = this;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                w = _e.sent();
                call = w.bash('f1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _a = expect;
                return [4 /*yield*/, w.held('f1')];
            case 2:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                // The seal for the grant cannot be made, as a keychain that refuses: the command does not run
                w.files.set('keychain:refused', '1');
                return [4 /*yield*/, w.press('gate-f1-0-once')];
            case 3:
                _e.sent();
                return [4 /*yield*/, call];
            case 4:
                r = (_e.sent());
                expect(r.deny).toBeDefined();
                expect(w.grants()).toEqual([]);
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, w.list.find({ type: 'Text', text: "Claudopus couldn't use its keychain key. It didn't run, and Claudopus told Claude." })];
                    }); }); })];
            case 5:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, w.list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
            case 6:
                _c.apply(void 0, [_e.sent()]).toBeUndefined();
                _d = expect;
                return [4 /*yield*/, w.list.find({ type: 'Text', text: /^You allowed it/ })];
            case 7:
                _d.apply(void 0, [_e.sent()]).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
// Found on a second look: one Bash call with two commands to allow, the first allowed and the second refused, ran nothing yet left
// "You allowed it once" green for the first
test('a call refused after one of its commands was allowed says in grey that nothing in it ran, never green', SLOW, function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, _loop_5, _i, _a, _b, id, command, second;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                w = _c.sent();
                w.files.set('git:top', '/repo/wt');
                w.files.set('git:branch', 'fix-it');
                _loop_5 = function (id, command, second) {
                    var call, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                call = w.bash(id, command);
                                _d = expect;
                                return [4 /*yield*/, w.held(id)];
                            case 1:
                                _d.apply(void 0, [_j.sent()]).toBeDefined();
                                return [4 /*yield*/, w.press("gate-".concat(id, "-0-once"))];
                            case 2:
                                _j.sent();
                                _e = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(w.list, second)];
                                    }); }); })];
                            case 3:
                                _e.apply(void 0, [_j.sent()]).toBeDefined();
                                return [4 /*yield*/, w.press(second)];
                            case 4:
                                _j.sent();
                                _f = expect;
                                return [4 /*yield*/, call];
                            case 5:
                                _f.apply(void 0, [(_j.sent()).deny]).toBeDefined();
                                expect(w.admins).toEqual([]);
                                _g = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, w.list.find({ type: 'Text', text: "It didn't run: another part of the same command was denied, so none of it ran." })];
                                    }); }); })];
                            case 6:
                                _g.apply(void 0, [_j.sent()]).toBeDefined();
                                _h = expect;
                                return [4 /*yield*/, w.list.find({ type: 'Text', text: 'You allowed it. It runs now.' })];
                            case 7:
                                _h.apply(void 0, [_j.sent()]).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = [
                    ['m1', "".concat(ADMIN, " here 'id -u'; ").concat(ADMIN, " here 'id -g'"), 'gate-m1-1-deny'],
                    ['m2', "".concat(ADMIN, " here 'id -u'; /plug/claudopus/bin/release"), 'gate-m2-r0-deny'],
                ];
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], id = _b[0], command = _b[1], second = _b[2];
                return [5 /*yield**/, _loop_5(id, command, second)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
