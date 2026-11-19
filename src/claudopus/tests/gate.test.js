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
// The waits the engine was asked to run for a held call (`/bin/sleep`, which the world ends only on wake()): a press must end the
// hold with no more than the one that was in flight, and with no wake()
var countingSleeps = function (on) {
    var seen = { sleeps: 0 };
    var counted = new Proxy(on, {
        apply: function (to, self, args) {
            var _a = args, name = _a[0], handle = _a[1];
            var run = name !== 'process.run' ? handle : function (c, e) { var _a; return (((_a = e.argv) === null || _a === void 0 ? void 0 : _a[0]) === '/bin/sleep' && (seen.sleeps += 1), handle(c, e)); };
            return Reflect.apply(to, self, [name, run]);
        },
    });
    return { on: counted, seen: seen };
};
// Everything drawn in the colour of what is done: no press leaves a green box or line
var gateGreens = function (pane) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = [[]];
            return [4 /*yield*/, pane.findAll({ type: 'Box' })];
        case 1:
            _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()), true]))];
            return [4 /*yield*/, pane.findAll({ type: 'Text' })];
        case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()), true])).filter(function (one) { var _a; return (!((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('outline-') || one.key === 'outline-top') && ['color', 'borderColor', 'backgroundColor'].some(function (prop) { return one.props[prop] === 'success'; }); }).length];
    }
}); }); };
var gateTexts = function (pane) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return String((_a = one.text) !== null && _a !== void 0 ? _a : ''); })
            // The labels of one gate's own buttons, in the order drawn
        ];
    }
}); }); };
// The labels of one gate's own buttons, in the order drawn
var gateButtons = function (pane, id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, pane.findAll({ type: 'Button' })];
        case 1: return [2 /*return*/, (_a.sent()).filter(function (one) { var _a; return ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith("gate-".concat(id, "-")); }).map(function (one) { var _a; return String((_a = one.props.label) !== null && _a !== void 0 ? _a : ''); })];
    }
}); }); };
var ALLOWED_LINE = '✓ You pressed “Allow”';
var REFUSED_LINE = "✓ You pressed “Don't allow”";
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
test("asked each time: the call is held and its card has one block (Permission, the question in amber, the command whole, Allow, Don't allow and Always allow this command); Allow lets that one command run at once, and one grey line says what was pressed", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var counted, _a, list, bash, labels, held, grants, admins, logged, appended, notified, files, clock, wake, done, call, _b, boxes, drawn, _c, question, _d, _e, _f, _g, _h, details, _j, _k, _l, grant, _m, _o, _p, _q, _r, _s, again, _t, _u;
    var _this = this;
    var _v, _w, _x, _y, _z, _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
            case 0:
                counted = countingSleeps(on);
                return [4 /*yield*/, gated($, counted.on)];
            case 1:
                _a = _2.sent(), list = _a.list, bash = _a.bash, labels = _a.labels, held = _a.held, grants = _a.grants, admins = _a.admins, logged = _a.logged, appended = _a.appended, notified = _a.notified, files = _a.files, clock = _a.clock, wake = _a.wake;
                done = false;
                call = bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'")).then(function (r) { return ((done = true), r); });
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_2.sent()]).toBeDefined();
                // Held: nothing ran, and nothing is granted
                expect(done).toBe(false);
                expect(admins).toEqual([]);
                expect(grants()).toEqual([]);
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 3:
                boxes = (_2.sent());
                expect(boxes.filter(function (one) { return one.key === 'outline-top' && one.props.backgroundColor === '#E5A50A'; }).length).toBe(1);
                return [4 /*yield*/, gateTexts(list)];
            case 4:
                drawn = _2.sent();
                expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 3)).toEqual(['Permission', 'Run this as admin on this Mac?', 'chmod 644 /etc/hosts']);
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 5:
                _c.apply(void 0, [(_v = (_2.sent())) === null || _v === void 0 ? void 0 : _v.props.dimColor]).toBe(true);
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
            case 6:
                question = _2.sent();
                expect([question === null || question === void 0 ? void 0 : question.props.color, question === null || question === void 0 ? void 0 : question.props.bold]).toEqual(['#E5A50A', true]);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'chmod 644 /etc/hosts' })];
            case 7:
                _d.apply(void 0, [(_w = (_2.sent())) === null || _w === void 0 ? void 0 : _w.props.mono]).toBe(true);
                _e = expect;
                return [4 /*yield*/, gateButtons(list, 'b1-0')];
            case 8:
                _e.apply(void 0, [_2.sent()]).toEqual(['Allow', "Don't allow", 'Always allow this command']);
                // Nothing under the question when there is nothing more to say, and none of the words the block had before
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
            case 9:
                // Nothing under the question when there is nothing more to say, and none of the words the block had before
                _f.apply(void 0, [(_2.sent()).map(function (one) { var _a; return String((_a = one.props.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (text) { return /Allow|admin/.test(text); })]).toEqual([]);
                _g = expect;
                return [4 /*yield*/, labels()];
            case 10:
                _g.apply(void 0, [(_2.sent()).filter(function (one) { return ['Allow once', 'Allow for this task', 'Deny'].includes(one); })]).toEqual([]);
                // Its card is amber and counted once as what waits
                expect(boxes.some(function (one) { return one.props.width === 1 && one.props.backgroundColor === '#E5A50A'; })).toBe(true);
                _h = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 11:
                _h.apply(void 0, [(_2.sent()).filter(function (one) { var _a; return /waiting for you/.test(String((_a = one.text) !== null && _a !== void 0 ? _a : '')); }).map(function (one) { return [one.text, one.props.color]; })]).toEqual([['1 waiting for you', '#E5A50A']]);
                // Said as a notification, and to the chat's model alone: the chat shows nothing of it (18 Nov: "garbage I don't need to read");
                // its Details tab has the same block
                expect(logged.some(function (line) { return line.includes('chmod 644 /etc/hosts'); })).toBe(false);
                expect(appended.some(function (line) { return line.startsWith('undefined: From Claudopus: the task "Fix the hosts file" wants to run an admin command on this Mac: chmod 644 /etc/hosts.'); })).toBe(true);
                expect(notified).toContain('Fix the hosts file has a question for you | Run an admin command on this Mac: chmod 644 /etc/hosts');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'work-a1', surface: 'desktop' }))];
            case 12:
                details = _2.sent();
                _j = expect;
                return [4 /*yield*/, details.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
            case 13:
                _j.apply(void 0, [_2.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, gateButtons(details, 'b1-0')];
            case 14:
                _k.apply(void 0, [_2.sent()]).toEqual(['Allow', "Don't allow", 'Always allow this command']);
                return [4 /*yield*/, details.unmount()
                    // The press itself ends the hold: the call returns with no second let pass (no wake, no move of the clock), and no wait was
                    // started but the one in flight
                ];
            case 15:
                _2.sent();
                // The press itself ends the hold: the call returns with no second let pass (no wake, no move of the clock), and no wait was
                // started but the one in flight
                return [4 /*yield*/, pressed(list, 'gate-b1-0-once')];
            case 16:
                // The press itself ends the hold: the call returns with no second let pass (no wake, no move of the clock), and no wait was
                // started but the one in flight
                _2.sent();
                _l = expect;
                return [4 /*yield*/, call];
            case 17:
                _l.apply(void 0, [(_2.sent()).result]).toBe('ran');
                expect(counted.seen.sleeps).toBe(1);
                // It ran with one grant, for this Mac and this exact command, sealed with the keychain's key; the grant goes with the call
                expect(admins.length).toBe(1);
                grant = ((_y = (_x = admins[0]) === null || _x === void 0 ? void 0 : _x.grants) !== null && _y !== void 0 ? _y : [])[0];
                expect((_z = admins[0]) === null || _z === void 0 ? void 0 : _z.grants.length).toBe(1);
                expect({ host: grant === null || grant === void 0 ? void 0 : grant.host, command: grant === null || grant === void 0 ? void 0 : grant.command }).toEqual({ host: 'here', command: 'chmod 644 /etc/hosts' });
                expect(grant === null || grant === void 0 ? void 0 : grant.seal).toBe(fakeSeal((_0 = files.get('keychain:gate')) !== null && _0 !== void 0 ? _0 : '', "grant\n".concat(grant === null || grant === void 0 ? void 0 : grant.id, "\n").concat(grant === null || grant === void 0 ? void 0 : grant.at, "\nhere\nchmod 644 /etc/hosts")));
                expect(grants()).toEqual([]);
                expect(files.has(ALLOWED)).toBe(false);
                // In the block's place: one grey line of what was pressed, and nothing green
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
            case 18:
                // In the block's place: one grey line of what was pressed, and nothing green
                _m.apply(void 0, [_2.sent()]).toBeUndefined();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                    }); }); })];
            case 19:
                _o.apply(void 0, [(_1 = (_2.sent())) === null || _1 === void 0 ? void 0 : _1.props.dimColor]).toBe(true);
                _p = expect;
                return [4 /*yield*/, gateTexts(list)];
            case 20:
                _p.apply(void 0, [(_2.sent()).filter(function (one) { return one.startsWith('✓ '); })]).toEqual([ALLOWED_LINE]);
                _q = expect;
                return [4 /*yield*/, gateGreens(list)];
            case 21:
                _q.apply(void 0, [_2.sent()]).toBe(0);
                _r = expect;
                return [4 /*yield*/, gateButtons(list, 'b1-0')];
            case 22:
                _r.apply(void 0, [_2.sent()]).toEqual([]);
                // The line goes by itself a minute on
                return [4 /*yield*/, clock.advance(61000)];
            case 23:
                // The line goes by itself a minute on
                _2.sent();
                _s = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 24:
                _s.apply(void 0, [_2.sent()]).toBe(true);
                again = bash('b2', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _t = expect;
                return [4 /*yield*/, held('b2')];
            case 25:
                _t.apply(void 0, [_2.sent()]).toBeDefined();
                expect(admins.length).toBe(1);
                return [4 /*yield*/, pressed(list, 'gate-b2-0-deny')];
            case 26:
                _2.sent();
                _u = expect;
                return [4 /*yield*/, again];
            case 27:
                _u.apply(void 0, [(_2.sent()).deny]).toContain('Refused by Sam');
                wake();
                return [2 /*return*/];
        }
    });
}); });
test("Don't allow refuses the call with a line that says the person refused it, and nothing runs or is granted", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, bash, held, grants, admins, wake, call, _b, _c, r, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _h.sent(), list = _a.list, bash = _a.bash, held = _a.held, grants = _a.grants, admins = _a.admins, wake = _a.wake;
                call = bash('b1', "".concat(ADMIN, " m4 'rm -rf /Library/Caches/x'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on m4?' })];
            case 3:
                _c.apply(void 0, [_h.sent()]).toBeDefined();
                return [4 /*yield*/, pressed(list, 'gate-b1-0-deny')];
            case 4:
                _h.sent();
                return [4 /*yield*/, call];
            case 5:
                r = _h.sent();
                expect(r.deny).toBe("Refused by Sam: Sam pressed Don't allow on this admin command, so it didn't run. Don't try to run it another way. Continue without it, or say what it is needed for and ask again.");
                expect(admins).toEqual([]);
                expect(grants()).toEqual([]);
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on m4?' })];
            case 6:
                _d.apply(void 0, [_h.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: REFUSED_LINE })];
                    }); }); })];
            case 7:
                _e.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.dimColor]).toBe(true);
                _f = expect;
                return [4 /*yield*/, gateGreens(list)];
            case 8:
                _f.apply(void 0, [_h.sent()]).toBe(0);
                wake();
                return [2 /*return*/];
        }
    });
}); });
test('no way to the runner gets past the press: another spelling, a shell, a helper, and two things to allow in one call each wait', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, labels, grants, files, n, _i, _b, command, id, call, _c, _d, _loop_2, _e, _f, _g, id, command, second, shown, waiting, _h, _j;
    var _this = this;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, gated($, on)
                // A helper's call shows on the card of the work it helps
            ];
            case 1:
                _a = _k.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, labels = _a.labels, grants = _a.grants, files = _a.files;
                // A helper's call shows on the card of the work it helps
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' }))];
            case 2:
                // A helper's call shows on the card of the work it helps
                _k.sent();
                n = 0;
                _i = 0, _b = ["cd /plug/claudopus/bin && ./admin here 'id -u'", "bash -c \"/plug/claudopus/bin/../bin/admin here 'id -u'\"", "X=1 env ".concat(ADMIN, " here 'id -u'"), "eval \"".concat(ADMIN, " here 'id -u'\"")];
                _k.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                command = _b[_i];
                id = "s".concat((n += 1));
                call = bash(id, command, n % 2 ? 'a2' : 'a1');
                _c = expect;
                return [4 /*yield*/, held(id)];
            case 4:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                expect(admins.length).toBe(0);
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 5:
                _k.sent();
                _d = expect;
                return [4 /*yield*/, call];
            case 6:
                _d.apply(void 0, [(_k.sent()).deny]).toContain('Refused by Sam');
                _k.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8:
                // Two in one call, an admin command and then another or a release: the first allowed, the second asked in its turn; refused,
                // neither runs, the first grant is taken back, and the card says the refusal, never that anything was allowed
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-it');
                _loop_2 = function (id, command, second, shown) {
                    var both, _l, _m, _o, _p, _q, _r, _s;
                    return __generator(this, function (_t) {
                        switch (_t.label) {
                            case 0:
                                both = bash(id, command);
                                _l = expect;
                                return [4 /*yield*/, held(id)];
                            case 1:
                                _l.apply(void 0, [_t.sent()]).toBeDefined();
                                return [4 /*yield*/, press("gate-".concat(id, "-0-once"))];
                            case 2:
                                _t.sent();
                                _m = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(list, second)];
                                    }); }); })];
                            case 3:
                                _m.apply(void 0, [_t.sent()]).toBeDefined();
                                _o = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: shown })];
                            case 4:
                                _o.apply(void 0, [_t.sent()]).toBeDefined();
                                return [4 /*yield*/, press(second)];
                            case 5:
                                _t.sent();
                                _p = expect;
                                return [4 /*yield*/, both];
                            case 6:
                                _p.apply(void 0, [(_t.sent()).deny]).toContain('Refused by Sam');
                                expect(admins.length).toBe(0);
                                expect(grants()).toEqual([]);
                                _q = expect;
                                return [4 /*yield*/, labels()];
                            case 7:
                                _q.apply(void 0, [_t.sent()]).not.toContain("Don't allow");
                                _r = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: REFUSED_LINE })];
                                    }); }); })];
                            case 8:
                                _r.apply(void 0, [_t.sent()]).toBeDefined();
                                _s = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                            case 9:
                                _s.apply(void 0, [_t.sent()]).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                };
                _e = 0, _f = [
                    ['t1', "".concat(ADMIN, " here 'id -u' && ").concat(ADMIN, " here 'whoami'"), 'gate-t1-1-deny', 'whoami'],
                    ['t2', "".concat(ADMIN, " here 'id -u'; /plug/claudopus/bin/release"), 'gate-t2-r0-deny', 'Release fix-it to main?'],
                ];
                _k.label = 9;
            case 9:
                if (!(_e < _f.length)) return [3 /*break*/, 12];
                _g = _f[_e], id = _g[0], command = _g[1], second = _g[2], shown = _g[3];
                return [5 /*yield**/, _loop_2(id, command, second, shown)];
            case 10:
                _k.sent();
                _k.label = 11;
            case 11:
                _e++;
                return [3 /*break*/, 9];
            case 12:
                waiting = bash('w1', "".concat(ADMIN, " here 'id -u'"));
                _h = expect;
                return [4 /*yield*/, held('w1')];
            case 13:
                _h.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, $.prompt.submit({ text: 'Allow', wait: false, origin: composer })];
            case 14:
                _k.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'SendMessage', tool_use_id: 'm1', to: 'a1', message: 'Allow' })];
            case 15:
                _k.sent();
                _j = expect;
                return [4 /*yield*/, keyed(list, 'gate-w1-0-once')];
            case 16:
                _j.apply(void 0, [_k.sent()]).toBeDefined();
                expect(admins.length).toBe(0);
                return [4 /*yield*/, press('gate-w1-0-deny')];
            case 17:
                _k.sent();
                return [4 /*yield*/, waiting];
            case 18:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Always allow this command keeps the exact command for its Mac, sealed; Config lists it with Remove, and a list work wrote itself allows nothing', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, list, bash, held, admins, files, tabs, first, _b, _c, kept, _d, _i, _e, _f, id, command, call, _g, forged, _h, _j, _k, id, command, call, _l, _m, _o, config, _p, _q, _r, _s, _t, before, stale, _u, _v, again, _w;
    var _this = this;
    var _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
    return __generator(this, function (_8) {
        switch (_8.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _8.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files, tabs = _a.tabs;
                first = bash('b1', "".concat(ADMIN, " here 'softwareupdate -l'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_8.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-always')];
            case 3:
                _8.sent();
                _c = expect;
                return [4 /*yield*/, first];
            case 4:
                _c.apply(void 0, [(_8.sent()).result]).toBe('ran');
                kept = JSON.parse((_x = files.get(ALLOWED)) !== null && _x !== void 0 ? _x : '{}');
                expect((_y = kept.here) === null || _y === void 0 ? void 0 : _y.map(function (one) { return one.command; })).toEqual(['softwareupdate -l']);
                expect((_0 = (_z = kept.here) === null || _z === void 0 ? void 0 : _z[0]) === null || _0 === void 0 ? void 0 : _0.seal).toBe(fakeSeal((_1 = files.get('keychain:gate')) !== null && _1 !== void 0 ? _1 : '', 'allow\nhere\nsoftwareupdate -l'));
                // The same command on the same Mac now runs without a press, with its own grant
                _d = expect;
                return [4 /*yield*/, bash('b2', "".concat(ADMIN, " here 'softwareupdate -l'"))];
            case 5:
                // The same command on the same Mac now runs without a press, with its own grant
                _d.apply(void 0, [(_8.sent()).result]).toBe('ran');
                expect(admins.length).toBe(2);
                expect((_2 = admins[1]) === null || _2 === void 0 ? void 0 : _2.grants.map(function (one) { return one.command; })).toEqual(['softwareupdate -l']);
                _i = 0, _e = [['b3', "".concat(ADMIN, " here 'softwareupdate -l -a'")], ['b4', "".concat(ADMIN, " m4 'softwareupdate -l'")]];
                _8.label = 6;
            case 6:
                if (!(_i < _e.length)) return [3 /*break*/, 11];
                _f = _e[_i], id = _f[0], command = _f[1];
                call = bash(id, command);
                _g = expect;
                return [4 /*yield*/, held(id)];
            case 7:
                _g.apply(void 0, [_8.sent()]).toBeDefined();
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 8:
                _8.sent();
                return [4 /*yield*/, call];
            case 9:
                _8.sent();
                _8.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 6];
            case 11:
                forged = { here: __spreadArray(__spreadArray([], ((_3 = kept.here) !== null && _3 !== void 0 ? _3 : []), true), [{ command: 'rm -rf /', seal: (_6 = (_5 = (_4 = kept.here) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.seal) !== null && _6 !== void 0 ? _6 : '', at: 1 }, { command: 'reboot', seal: '', at: 1 }], false) };
                // As if it got past the guards with the kept copy (a key F-007's way): the seals still allow nothing
                ownSet(files, 'admin-allowed.json', JSON.stringify(forged));
                _h = 0, _j = [['f1', "".concat(ADMIN, " here 'rm -rf /'")], ['f2', "".concat(ADMIN, " here 'reboot'")]];
                _8.label = 12;
            case 12:
                if (!(_h < _j.length)) return [3 /*break*/, 17];
                _k = _j[_h], id = _k[0], command = _k[1];
                call = bash(id, command);
                _l = expect;
                return [4 /*yield*/, held(id)];
            case 13:
                _l.apply(void 0, [_8.sent()]).toBeDefined();
                return [4 /*yield*/, press("gate-".concat(id, "-0-deny"))];
            case 14:
                _8.sent();
                _m = expect;
                return [4 /*yield*/, call];
            case 15:
                _m.apply(void 0, [(_8.sent()).deny]).toContain('Refused by Sam');
                _8.label = 16;
            case 16:
                _h++;
                return [3 /*break*/, 12];
            case 17: 
            // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
            return [4 /*yield*/, pressed(list, 'config-open')];
            case 18:
                // Config lists what the person allowed, says how many entries are not theirs, and Remove takes one out
                _8.sent();
                _o = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 19:
                _o.apply(void 0, [_8.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 20:
                config = _8.sent();
                _p = expect;
                return [4 /*yield*/, moreShown(config)];
            case 21:
                _p.apply(void 0, [_8.sent()]).toBe(true);
                _q = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /These run without asking, exactly as written and only on their Mac\./ })];
            case 22:
                _q.apply(void 0, [_8.sent()]).toBeDefined();
                _r = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'softwareupdate -l' })];
            case 23:
                _r.apply(void 0, [(_7 = (_8.sent())) === null || _7 === void 0 ? void 0 : _7.props.mono]).toBe(true);
                _s = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'rm -rf /' })];
            case 24:
                _s.apply(void 0, [_8.sent()]).toBeUndefined();
                _t = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /2 more in the file weren't added here, so they allow nothing/ })];
            case 25:
                _t.apply(void 0, [_8.sent()]).toBeDefined();
                before = files.get('keychain:gate');
                stale = JSON.stringify(kept);
                return [4 /*yield*/, pressed(config, 'config-admin-remove-0')];
            case 26:
                _8.sent();
                _u = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get(ALLOWED)) !== null && _a !== void 0 ? _a : '{"here":[1]}').here === undefined ? true : undefined)];
                    }); }); })];
            case 27:
                _u.apply(void 0, [_8.sent()]).toBe(true);
                _v = expect;
                return [4 /*yield*/, until(function () { return config.find({ type: 'Text', text: /None is always allowed yet\./ }); })];
            case 28:
                _v.apply(void 0, [_8.sent()]).toBeDefined();
                // Removing made a new key: the old entry put back, seal and all, allows nothing
                expect(files.get('keychain:gate')).not.toBe(before);
                files.set(ALLOWED, stale);
                again = bash('b5', "".concat(ADMIN, " here 'softwareupdate -l'"));
                _w = expect;
                return [4 /*yield*/, held('b5')];
            case 29:
                _w.apply(void 0, [_8.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b5-0-deny')];
            case 30:
                _8.sent();
                return [4 /*yield*/, again];
            case 31:
                _8.sent();
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
    var _a, press, list, bash, held, admins, files, tabs, _b, config, _c, _d, sealedAs, first, _e, _f, _g, _h, _j, _k, other, _l, _m, back, _o;
    var _this = this;
    var _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0: return [4 /*yield*/, gated($, on)
                // The setting is chosen in Config, which seals it
            ];
            case 1:
                _a = _r.sent(), press = _a.press, list = _a.list, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files, tabs = _a.tabs;
                // The setting is chosen in Config, which seals it
                return [4 /*yield*/, pressed(list, 'config-open')];
            case 2:
                // The setting is chosen in Config, which seals it
                _r.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, tabs.find(function (tab) { return tab === 'config: Config'; })];
                    }); }); })];
            case 3:
                _b.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                config = _r.sent();
                _c = expect;
                return [4 /*yield*/, moreShown(config)];
            case 5:
                _c.apply(void 0, [_r.sent()]).toBe(true);
                _d = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin commands' })];
            case 6:
                _d.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, config.select({ key: 'config-admin-mode-pick', value: 'work' })];
            case 7:
                _r.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').adminSealed];
                    }); }); })];
            case 8:
                sealedAs = _r.sent();
                expect(JSON.parse((_p = files.get("".concat(MEMORY, "/config.json"))) !== null && _p !== void 0 ? _p : '{}')).toEqual({ name: 'Sam', admin: 'work', adminSealed: fakeSeal((_q = files.get('keychain:gate')) !== null && _q !== void 0 ? _q : '', 'mode\nwork') });
                expect(sealedAs).toBeDefined();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Look at the file', prompt: 'look', parentAgentId: 'a1' }))];
            case 9:
                _r.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'update the other Mac', wait: false, origin: composer })];
            case 10:
                _r.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Update the other Mac', prompt: 'update the other Mac' }))];
            case 11:
                _r.sent();
                first = bash('b1', "".concat(ADMIN, " here 'id -u'"));
                _e = expect;
                return [4 /*yield*/, held('b1')];
            case 12:
                _e.apply(void 0, [_r.sent()]).toBeDefined();
                // The same three buttons, and under the question what this Allow covers
                _f = expect;
                return [4 /*yield*/, gateButtons(list, 'b1-0')];
            case 13:
                // The same three buttons, and under the question what this Allow covers
                _f.apply(void 0, [_r.sent()]).toEqual(['Allow', "Don't allow", 'Always allow this command']);
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
            case 14:
                _g.apply(void 0, [(_r.sent()).map(function (one) { return one.props.text; })]).toContain("Allow also covers this task's next admin commands.");
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 15:
                _r.sent();
                _h = expect;
                return [4 /*yield*/, first];
            case 16:
                _h.apply(void 0, [(_r.sent()).result]).toBe('ran');
                // Its later commands, and its helper's, run without another press, each with its own grant
                _j = expect;
                return [4 /*yield*/, bash('b2', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"))];
            case 17:
                // Its later commands, and its helper's, run without another press, each with its own grant
                _j.apply(void 0, [(_r.sent()).result]).toBe('ran');
                _k = expect;
                return [4 /*yield*/, bash('b3', "".concat(ADMIN, " m4 'whoami'"), 'a2')];
            case 18:
                _k.apply(void 0, [(_r.sent()).result]).toBe('ran');
                expect(admins.map(function (one) { return one.grants.map(function (grant) { return grant.command; }); })).toEqual([['id -u'], ['chmod 644 /etc/hosts'], ['whoami']]);
                other = bash('b4', "".concat(ADMIN, " here 'id -u'"), 'a3');
                _l = expect;
                return [4 /*yield*/, held('b4')];
            case 19:
                _l.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b4-0-deny')];
            case 20:
                _r.sent();
                _m = expect;
                return [4 /*yield*/, other];
            case 21:
                _m.apply(void 0, [(_r.sent()).deny]).toContain('Refused by Sam');
                // Ended and started again, it asks again
                return [4 /*yield*/, $.tool.call({ tool: 'TaskStop', tool_use_id: 's1', task_id: 'a1' })];
            case 22:
                // Ended and started again, it asks again
                _r.sent();
                back = bash('b5', "".concat(ADMIN, " here 'id -u'"));
                _o = expect;
                return [4 /*yield*/, held('b5')];
            case 23:
                _o.apply(void 0, [_r.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b5-0-deny')];
            case 24:
                _r.sent();
                return [4 /*yield*/, back];
            case 25:
                _r.sent();
                expect(admins.length).toBe(3);
                return [2 /*return*/];
        }
    });
}); });
var _loop_1 = function (admin) {
    test("\"".concat(admin, "\" written into config.json by anything but Config counts for nothing: every command still asks"), function ($, on) { return __awaiter(_this, void 0, void 0, function () {
        var _a, press, bash, held, admins, files, call, _b, config, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, gated($, on, { admin: admin, adminSealed: fakeSeal('kept-key', "mode\n".concat(admin)).replace(/^./, 'z') })];
                case 1:
                    _a = _e.sent(), press = _a.press, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files;
                    files.set('keychain:gate', 'kept-key');
                    call = bash('b1', "".concat(ADMIN, " here 'id -u'"));
                    _b = expect;
                    return [4 /*yield*/, held('b1')];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toBeDefined();
                    expect(admins.length).toBe(0);
                    return [4 /*yield*/, press('gate-b1-0-deny')];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, call];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
                case 5:
                    config = _e.sent();
                    _c = expect;
                    return [4 /*yield*/, moreShown(config)];
                case 6:
                    _c.apply(void 0, [_e.sent()]).toBe(true);
                    _d = expect;
                    return [4 /*yield*/, config.find({ type: 'Text', text: new RegExp("Your settings file says \"".concat(admin, "\", but you didn't choose it here, so every command asks")) })];
                case 7:
                    _d.apply(void 0, [_e.sent()]).toBeDefined();
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
    var _a, press, list, bash, admins, files, grants, logged, notified, before, r, _b, _c, config, _d;
    var _this = this;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, gated($, on, { admin: 'never', adminSealed: fakeSeal('kept-key', 'mode\nnever') }, { env: {} })];
            case 1:
                _a = _f.sent(), press = _a.press, list = _a.list, bash = _a.bash, admins = _a.admins, files = _a.files, grants = _a.grants, logged = _a.logged, notified = _a.notified;
                files.set('keychain:gate', 'kept-key');
                before = __spreadArray([], files.keys(), true).filter(function (path) { return !path.endsWith('log.md'); }).sort();
                return [4 /*yield*/, bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"))];
            case 2:
                r = _f.sent();
                expect(r.result).toBe('ran');
                expect(r.deny).toBeUndefined();
                expect(admins).toEqual([{ command: "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"), grants: [] }]);
                expect(grants()).toEqual([]);
                expect(files.has(ALLOWED)).toBe(false);
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return !path.endsWith('log.md') && !path.includes('/live/'); }).sort()).toEqual(before.filter(function (path) { return !path.includes('/live/'); }));
                expect(logged.some(function (line) { return line.includes('admin command'); })).toBe(false);
                expect(notified.some(function (line) { return line.includes('admin command'); })).toBe(false);
                _b = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 3:
                _b.apply(void 0, [_f.sent()]).toBeUndefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
            case 4:
                _c.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 5:
                config = _f.sent();
                return [4 /*yield*/, moreShown(config)];
            case 6:
                _f.sent();
                return [4 /*yield*/, pressed(config, 'config-admin-mode-back')];
            case 7:
                _f.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').admin === undefined ? true : undefined)];
                    }); }); })];
            case 8:
                _d.apply(void 0, [_f.sent()]).toBe(true);
                expect(JSON.parse((_e = files.get("".concat(MEMORY, "/config.json"))) !== null && _e !== void 0 ? _e : '{}')).toEqual({ name: 'Sam' });
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
    var _a, press, bash, held, admins, files, _b, _c, config, _d, _e, _f, call, _g, _h;
    var _this = this;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, gated($, on, { adminPassword: 'keep' })];
            case 1:
                _a = _j.sent(), press = _a.press, bash = _a.bash, held = _a.held, admins = _a.admins, files = _a.files;
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get('keychain:admin-forgotten')];
                    }); }); })];
            case 2:
                _b.apply(void 0, [_j.sent()]).toBe('yes');
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        return [2 /*return*/, (JSON.parse((_a = files.get("".concat(MEMORY, "/config.json"))) !== null && _a !== void 0 ? _a : '{}').adminPassword === undefined ? true : undefined)];
                    }); }); })];
            case 3:
                _c.apply(void 0, [_j.sent()]).toBe(true);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: 'config', props: __assign(__assign({}, LIST.props), { title: 'Config', bodyColumns: 70 }), surface: 'desktop' }))];
            case 4:
                config = _j.sent();
                _d = expect;
                return [4 /*yield*/, moreShown(config)];
            case 5:
                _d.apply(void 0, [_j.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: 'Admin password' })];
            case 6:
                _e.apply(void 0, [_j.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, config.find({ type: 'Text', text: /each asks for your Mac password, which Claudopus never saves/ })];
            case 7:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                call = bash('b2', "".concat(ADMIN, " m4 'id -u'"));
                _g = expect;
                return [4 /*yield*/, held('b2')];
            case 8:
                _g.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b2-0-once')];
            case 9:
                _j.sent();
                _h = expect;
                return [4 /*yield*/, call];
            case 10:
                _h.apply(void 0, [(_j.sent()).result]).toBe('ran');
                expect(admins.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
test("the chat's own thread, doing its own work, is asked at the top of the panel, each time even under once per piece of work, and its press is said there in one grey line", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, list, _loop_3, _i, _a, id;
    var _this = this;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                w = world(on);
                w.files.set('keychain:gate', 'kept-key');
                w.files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ name: 'Sam', agents: false, admin: 'work', adminSealed: fakeSeal('kept-key', 'mode\nwork') }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the hosts file', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { props: __assign(__assign({}, LIST.props), { bodyColumns: 80 }), surface: 'desktop' }))];
            case 3:
                list = _d.sent();
                _loop_3 = function (id) {
                    var call, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                call = $.tool.call({ tool: 'Bash', tool_use_id: id, command: "".concat(ADMIN, " here 'id -u'") });
                                _e = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(list, "gate-".concat(id, "-0-deny"))];
                                    }); }); })];
                            case 1:
                                _e.apply(void 0, [_p.sent()]).toBeDefined();
                                // Whose it is stands beside its kind, as it is on no task's card
                                _f = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission · This chat' })];
                            case 2:
                                // Whose it is stands beside its kind, as it is on no task's card
                                _f.apply(void 0, [(_b = (_p.sent())) === null || _b === void 0 ? void 0 : _b.props.dimColor]).toBe(true);
                                _g = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
                            case 3:
                                _g.apply(void 0, [_p.sent()]).toBeDefined();
                                // No piece of work to allow it for: the chat's thread never ends, so it is asked each time, and Allow covers this one alone
                                _h = expect;
                                return [4 /*yield*/, gateButtons(list, "".concat(id, "-0"))];
                            case 4:
                                // No piece of work to allow it for: the chat's thread never ends, so it is asked each time, and Allow covers this one alone
                                _h.apply(void 0, [_p.sent()]).toEqual(['Allow', "Don't allow", 'Always allow this command']);
                                _j = expect;
                                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
                            case 5:
                                _j.apply(void 0, [(_p.sent()).map(function (one) { var _a; return String((_a = one.props.text) !== null && _a !== void 0 ? _a : ''); }).filter(function (text) { return text.includes('also covers'); })]).toEqual([]);
                                // The press ends the hold by itself
                                return [4 /*yield*/, pressed(list, "gate-".concat(id, "-0-once"))];
                            case 6:
                                // The press ends the hold by itself
                                _p.sent();
                                _k = expect;
                                return [4 /*yield*/, call];
                            case 7:
                                _k.apply(void 0, [(_p.sent()).result]).toBe('ran');
                                _l = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission · This chat' })];
                            case 8:
                                _l.apply(void 0, [_p.sent()]).toBeUndefined();
                                _m = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                                    }); }); })];
                            case 9:
                                _m.apply(void 0, [(_c = (_p.sent())) === null || _c === void 0 ? void 0 : _c.props.dimColor]).toBe(true);
                                _o = expect;
                                return [4 /*yield*/, gateGreens(list)];
                            case 10:
                                _o.apply(void 0, [_p.sent()]).toBe(0);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ['c1', 'c2'];
                _d.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                id = _a[_i];
                return [5 /*yield**/, _loop_3(id)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                expect(w.admins.length).toBe(2);
                w.wake();
                return [2 /*return*/];
        }
    });
}); });
test("another chat's panel shows an admin command that waits, with no button: only the chat that holds the call allows it", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, list, _b, _c, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _h.sent();
                at = 1700000000000;
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify({ chat: 'chat-b', title: 'Billing page', folder: '/repo/billing', host: '', at: at, cards: [{ id: 'b1', parentId: '', isFork: false, tokens: 0, title: 'Update the server', words: 'update it', items: [], entries: [], answer: '', admins: [{ id: 'x-0', host: 'here', command: 'softwareupdate -i -a', at: at }], startedAt: at - 60000, endedAt: 0, status: 'working' }] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _h.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _h.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'softwareupdate -i -a' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Permission' })];
            case 5:
                _c.apply(void 0, [_h.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Run this as admin on this Mac?' })];
            case 6:
                _d.apply(void 0, [_h.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Allow it on its card in its own chat.' })];
            case 7:
                _e.apply(void 0, [(_g = (_h.sent())) === null || _g === void 0 ? void 0 : _g.props.dimColor]).toBe(true);
                _f = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 8:
                _f.apply(void 0, [(_h.sent()).some(function (one) { var _a; return ['Allow', 'Always allow this command', "Don't allow"].includes(String(one.props.label)) || ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('gate-'); })]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a release nobody pressed for is asked, once, for its own branch, with Allow and Don\'t allow alone: the 15 Nov run-progress-rows release, its output sent to a log, asked twice, first for a branch called ">"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, files, grants, holding, wake, _loop_4, _i, _b, _c, id, tail;
    var _this = this;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _f.sent(), list = _a.list, files = _a.files, grants = _a.grants, holding = _a.holding, wake = _a.wake;
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-it');
                _loop_4 = function (id, tail) {
                    var call, _g, drawn, _h, under, _j, granted, _k, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0:
                                call = $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: 'a1', command: "hold x".concat(id, "; /plug/claudopus/bin/release").concat(tail) });
                                _g = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(list, "gate-".concat(id, "-r0-once"))];
                                    }); }); })];
                            case 1:
                                _g.apply(void 0, [_m.sent()]).toBeDefined();
                                return [4 /*yield*/, gateTexts(list)];
                            case 2:
                                drawn = _m.sent();
                                expect(drawn.slice(drawn.indexOf('Permission'), drawn.indexOf('Permission') + 2)).toEqual(['Permission', 'Release fix-it to main?']);
                                _h = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Release fix-it to main?' })];
                            case 3:
                                _h.apply(void 0, [(_d = (_m.sent())) === null || _d === void 0 ? void 0 : _d.props.color]).toBe('#E5A50A');
                                return [4 /*yield*/, list.findAll({ type: 'Markdown' })];
                            case 4:
                                under = (_m.sent()).map(function (one) { var _a; return String((_a = one.props.text) !== null && _a !== void 0 ? _a : ''); });
                                expect(under).toContain('Branch fix-it · from /repo/wt');
                                expect(__spreadArray(__spreadArray([], drawn, true), under, true).some(function (one) { return /^>|> from/.test(one); })).toBe(false);
                                expect(drawn.some(function (one) { return one === 'fix-it from /repo/wt'; })).toBe(false);
                                // A release is asked each time: nothing to always allow
                                _j = expect;
                                return [4 /*yield*/, gateButtons(list, "".concat(id, "-r0"))];
                            case 5:
                                // A release is asked each time: nothing to always allow
                                _j.apply(void 0, [_m.sent()]).toEqual(['Allow', "Don't allow"]);
                                return [4 /*yield*/, pressed(list, "gate-".concat(id, "-r0-once"))];
                            case 6:
                                _m.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, (grants().length ? grants() : undefined)];
                                    }); }); })];
                            case 7:
                                granted = _m.sent();
                                expect(granted === null || granted === void 0 ? void 0 : granted.map(function (path) { var _a; return (function (_a) {
                                    var host = _a.host, command = _a.command;
                                    return [host, command];
                                })(JSON.parse((_a = files.get(path)) !== null && _a !== void 0 ? _a : '{}')); })).toEqual([['release', '/repo/wt\nfix-it']]);
                                _k = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                                    }); }); })];
                            case 8:
                                _k.apply(void 0, [_m.sent()]).toBeDefined();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, holding.get("x".concat(id, "; /plug/claudopus/bin/release").concat(tail))];
                                    }); }); })];
                            case 9:
                                (_e = (_m.sent())) === null || _e === void 0 ? void 0 : _e('released');
                                _l = expect;
                                return [4 /*yield*/, call];
                            case 10:
                                _l.apply(void 0, [(_m.sent()).deny]).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = [['rl1', ' > /tmp/release.log 2>&1'], ['rl2', ' 2>/tmp/release.log'], ['rl3', '>/tmp/release.log']];
                _f.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                _c = _b[_i], id = _c[0], tail = _c[1];
                return [5 /*yield**/, _loop_4(id, tail)];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                wake();
                return [2 /*return*/];
        }
    });
}); });
test("the press on a task's go-ahead for a release lets that task's next release of that folder through with no block, once: a second run, another folder and another task are asked", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, files, grants, holding, appended, resumed, wake, press, asks, goAhead, release, through, asked;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _b.sent(), list = _a.list, files = _a.files, grants = _a.grants, holding = _a.holding, appended = _a.appended, resumed = _a.resumed, wake = _a.wake, press = _a.press;
                files.set('git:top', '/repo/wt');
                files.set('git:branch', 'fix-it');
                files.set('/repo/wt/.release', 'main\n');
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Tidy the logs', prompt: 'tidy the logs' }))];
            case 2:
                _b.sent();
                asks = 0;
                goAhead = function () { return __awaiter(_this, void 0, void 0, function () {
                    var text, button, _a;
                    var _this = this;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                text = "Release the hosts fix, round ".concat((asks += 1), "?");
                                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: "k".concat(asks), agentId: 'a1', text: text, details: 'It changes one line.', choices: ['Release it'], release: '/repo/wt' })];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                                            case 1: return [2 /*return*/, (_a.sent()).find(function (one) { return one.props.label === 'Release it'; })];
                                        }
                                    }); }); })];
                            case 2:
                                button = _c.sent();
                                return [4 /*yield*/, list.press({ key: (_b = button === null || button === void 0 ? void 0 : button.key) !== null && _b !== void 0 ? _b : '' })];
                            case 3:
                                _c.sent();
                                _a = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, __spreadArray(__spreadArray([], appended, true), resumed, true).find(function (line) { return line.includes('pressed "Release it"') && line.includes(text); })];
                                    }); }); })];
                            case 4:
                                _a.apply(void 0, [_c.sent()]).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); };
                release = function (id, agentId) { return $.tool.call({ tool: 'Bash', tool_use_id: id, agentId: agentId, command: "hold x".concat(id, "; /plug/claudopus/bin/release") }); };
                through = function (id) { return __awaiter(_this, void 0, void 0, function () {
                    var call, run, _a, _b, _c;
                    var _this = this;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                call = release(id, 'a1');
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, holding.get("x".concat(id, "; /plug/claudopus/bin/release"))];
                                    }); }); })];
                            case 1:
                                run = _d.sent();
                                expect(run).toBeDefined();
                                expect(grants().map(function (path) { var _a; return (function (_a) {
                                    var host = _a.host, command = _a.command;
                                    return [host, command];
                                })(JSON.parse((_a = files.get(path)) !== null && _a !== void 0 ? _a : '{}')); })).toEqual([['release', '/repo/wt\nfix-it']]);
                                _a = expect;
                                return [4 /*yield*/, keyed(list, "gate-".concat(id, "-r0-once"))];
                            case 2:
                                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                                _b = expect;
                                return [4 /*yield*/, list.find({ type: 'Text', text: 'Release fix-it to main?' })];
                            case 3:
                                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                                run === null || run === void 0 ? void 0 : run('released');
                                _c = expect;
                                return [4 /*yield*/, call];
                            case 4:
                                _c.apply(void 0, [(_d.sent()).deny]).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); };
                asked = function (id_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(_this, __spreadArray([id_1], args_1, true), void 0, function (id, agentId) {
                        var call, _a, _b, _c;
                        var _this = this;
                        if (agentId === void 0) { agentId = 'a1'; }
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    call = release(id, agentId);
                                    _a = expect;
                                    return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, keyed(list, "gate-".concat(id, "-r0-deny"))];
                                        }); }); })];
                                case 1:
                                    _a.apply(void 0, [_d.sent()]).toBeDefined();
                                    _b = expect;
                                    return [4 /*yield*/, gateButtons(list, "".concat(id, "-r0"))];
                                case 2:
                                    _b.apply(void 0, [_d.sent()]).toEqual(['Allow', "Don't allow"]);
                                    expect(grants()).toEqual([]);
                                    return [4 /*yield*/, press("gate-".concat(id, "-r0-deny"))];
                                case 3:
                                    _d.sent();
                                    _c = expect;
                                    return [4 /*yield*/, call];
                                case 4:
                                    _c.apply(void 0, [(_d.sent()).deny]).toBe("Refused by Sam: Sam pressed Don't allow on this release, so nothing was released. Don't try to release it another way. Continue without it, or say what it is needed for and ask again.");
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return [4 /*yield*/, goAhead()];
            case 3:
                _b.sent();
                return [4 /*yield*/, through('r1')
                    // Once: the press allowed one run
                ];
            case 4:
                _b.sent();
                // Once: the press allowed one run
                return [4 /*yield*/, asked('r2')
                    // A new press, and still only that folder's release by that task: another worktree's and another task's are asked, and neither
                    // uses the press up
                ];
            case 5:
                // Once: the press allowed one run
                _b.sent();
                // A new press, and still only that folder's release by that task: another worktree's and another task's are asked, and neither
                // uses the press up
                return [4 /*yield*/, goAhead()];
            case 6:
                // A new press, and still only that folder's release by that task: another worktree's and another task's are asked, and neither
                // uses the press up
                _b.sent();
                files.set('git:top', '/repo/other');
                return [4 /*yield*/, asked('r3')];
            case 7:
                _b.sent();
                files.set('git:top', '/repo/wt');
                return [4 /*yield*/, asked('r4', 'a2')];
            case 8:
                _b.sent();
                return [4 /*yield*/, through('r5')];
            case 9:
                _b.sent();
                return [4 /*yield*/, asked('r6')];
            case 10:
                _b.sent();
                wake();
                return [2 /*return*/];
        }
    });
}); });
// A long list of another chat's running work, two of whose cards wait on a gate and one on an ask: what the 15 Nov panel drew below
// the fold, where the person had to scroll to find its Allow
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
test('a work that waits for a press comes to the top whole, its amber block in it, the oldest first with the cards that asked; answered, it goes at once to the place it began in, under all that still waits', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
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
                // The older gate is answered (in its own chat) while the others still wait: its card goes at once to the place it began in among
                // the working, never above what waits
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
                expect(after.indexOf('Card four')).toBeLessThan(after.indexOf('Card six'));
                expect(after.indexOf('Card six')).toBeLessThan(after.indexOf('Card one'));
                expect(after.filter(function (one) { return /^Card (one|two|three|five)$/.test(one); })).toEqual(['Card one', 'Card two', 'Card three', 'Card five']);
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
test('a gate answered on its card says what was pressed in that same card, in one grey line with no box of its own, while the card stays at the top', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, press, bash, held, list, call, _b, _c, _d, drawn, call2, _e, now;
    var _this = this;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _f.sent(), press = _a.press, bash = _a.bash, held = _a.held, list = _a.list;
                call = bash('b1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _b = expect;
                return [4 /*yield*/, held('b1')];
            case 2:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, press('gate-b1-0-once')];
            case 3:
                _f.sent();
                return [4 /*yield*/, call];
            case 4:
                _f.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
                    }); }); })];
            case 5:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.findAll({ type: 'Box' })];
            case 6:
                _d.apply(void 0, [(_f.sent()).filter(function (one) { var _a; return one.key === 'outline-top' || ((_a = one.key) !== null && _a !== void 0 ? _a : '').startsWith('done-gate-'); })]).toEqual([]);
                return [4 /*yield*/, textOrder(list)
                    // In its card, under the work's title, not a line of its own at the top
                ];
            case 7:
                drawn = _f.sent();
                // In its card, under the work's title, not a line of its own at the top
                expect(drawn.indexOf('Fix the hosts file')).toBeLessThan(drawn.indexOf(ALLOWED_LINE));
                expect(drawn.filter(function (one) { return one === ALLOWED_LINE; }).length).toBe(1);
                // Another work's gate comes in while the grey line is still said: its card, which waits, is drawn above the answered one
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { description: 'Tidy the logs', prompt: 'tidy the logs' }))];
            case 8:
                // Another work's gate comes in while the grey line is still said: its card, which waits, is drawn above the answered one
                _f.sent();
                call2 = bash('b2', "".concat(ADMIN, " here 'id -u'"), 'a2');
                _e = expect;
                return [4 /*yield*/, held('b2')];
            case 9:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, textOrder(list)];
            case 10:
                now = _f.sent();
                expect(now.indexOf('Tidy the logs')).toBeGreaterThan(-1);
                expect(now.indexOf('Tidy the logs')).toBeLessThan(now.indexOf('Fix the hosts file'));
                expect(now.indexOf(ALLOWED_LINE)).toBeGreaterThan(now.indexOf('Tidy the logs'));
                return [4 /*yield*/, press('gate-b2-0-deny')];
            case 11:
                _f.sent();
                return [4 /*yield*/, call2];
            case 12:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
test('on the desktop the line above the prompt says how many wait and what the first asks, scrolled or not, and Show takes a scrolled list to the top; in the terminal it comes only once scrolled', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, at, MARK, show, _loop_5, _i, _b, surface;
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
                MARK = /^● 2 waiting for you · /;
                show = function (band) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, band.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_a.sent()).some(function (one) { return one.props.label === 'Show'; })];
                    }
                }); }); };
                _loop_5 = function (surface) {
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
                return [5 /*yield**/, _loop_5(surface)];
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] })];
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] })];
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
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k1', agentId: 'a1', text: 'May I delete the old repo?', choices: ['Approve'] })];
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
                    return [4 /*yield*/, $.tool.call(__assign({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4', agentId: 'a4', text: 'Release piece four?' }, (choices ? { choices: choices } : {})))
                        // (ended: it hands in its result with the question still open, which is what ends a task)
                    ];
                case 8:
                    _d.sent();
                    if (!ended) return [3 /*break*/, 10];
                    return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a4', agentId: 'a4', message: 'Waits for your Release it.' })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    if (!ended) return [3 /*break*/, 12];
                    return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a4', reason: 'answer', agentId: 'a4' })];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12: return [4 /*yield*/, w.clock.advance(5000)];
                case 13:
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
                case 14:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/, __assign(__assign({}, w), { list: list, order: order })];
            }
        });
    });
};
test('Release it on an ended ask takes its card at once to the place its work began in, saying the answer, never the end', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, clock, resumed, release, _b, _c, _d, _e, _f;
    var _this = this;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, askingFourth($, on, ['Release it'], true)];
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
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 1' ? true : undefined)];
                        }
                    }); }); })];
            case 6:
                _d.apply(void 0, [_h.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, order()];
            case 7:
                _e.apply(void 0, [_h.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                // and so a minute on
                return [4 /*yield*/, clock.advance(65000)];
            case 8:
                // and so a minute on
                _h.sent();
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
    var _l, _m;
    var _this = this;
    var _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0: return [4 /*yield*/, askingFourth($, on, ['Go on'])];
            case 1:
                _a = _s.sent(), list = _a.list, order = _a.order, clock = _a.clock;
                if (!(how === 'press')) return [3 /*break*/, 4];
                _c = (_b = list).press;
                _l = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 2: return [4 /*yield*/, _c.apply(_b, [(_l.key = (_p = (_o = (_s.sent()).find(function (one) { return one.props.label === 'Go on'; })) === null || _o === void 0 ? void 0 : _o.key) !== null && _p !== void 0 ? _p : '', _l)])];
            case 3:
                _s.sent();
                return [3 /*break*/, 7];
            case 4:
                _e = (_d = list).input;
                _m = {};
                return [4 /*yield*/, list.findAll({ type: 'Input' })];
            case 5: return [4 /*yield*/, _e.apply(_d, [(_m.key = (_r = (_q = (_s.sent()).find(function (one) { var _a; return /-reply-/.test((_a = one.key) !== null && _a !== void 0 ? _a : ''); })) === null || _q === void 0 ? void 0 : _q.key) !== null && _r !== void 0 ? _r : '', _m.text = 'It is pasted', _m)])];
            case 6:
                _s.sent();
                _s.label = 7;
            case 7:
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /You answered/ })];
                    }); }); })];
            case 8:
                _f.apply(void 0, [_s.sent()]).toBeDefined();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 1' ? true : undefined)];
                        }
                    }); }); })];
            case 9:
                _g.apply(void 0, [_s.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, order()];
            case 10:
                _h.apply(void 0, [_s.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                // It says the answer there for a minute
                return [4 /*yield*/, clock.advance(30000)];
            case 11:
                // It says the answer there for a minute
                _s.sent();
                _j = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /You answered/ })];
            case 12:
                _j.apply(void 0, [_s.sent()]).toBeDefined();
                _k = expect;
                return [4 /*yield*/, order()];
            case 13:
                _k.apply(void 0, [_s.sent()]).toEqual(['Piece 1', 'Piece 2', 'Piece 3', 'Piece 4', 'Piece 5']);
                return [2 /*return*/];
        }
    });
}); };
test("a press on an ask's own button takes the card at once to its own place among the working, saying the answer", function ($, on) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, answeredStays($, on, 'press')];
}); }); });
test('an answer sent from an ask\'s box takes the card at once to its own place among the working, saying the answer', function ($, on) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, answeredStays($, on, 'reply')];
}); }); });
test('answering one of two asks at the top takes the answered card at once to its own place among the working, under the one still waiting and under what was delivered; asked again, it goes under what already waits', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, order, clock, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, labelled, _r, _s, _t, _u, _v, _w;
    var _x, _y, _z;
    var _this = this;
    var _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
            case 0: return [4 /*yield*/, askingFourth($, on, ['Go on'])];
            case 1:
                _a = _2.sent(), list = _a.list, order = _a.order, clock = _a.clock;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k2', agentId: 'a2', text: 'Release piece two?', choices: ['Release it'] })];
            case 2:
                _2.sent();
                return [4 /*yield*/, clock.advance(5000)
                    // The newer ask goes under the older one, never above it
                ];
            case 3:
                _2.sent();
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
                _b.apply(void 0, [_2.sent()]).toBe(true);
                _c = expect;
                return [4 /*yield*/, order()];
            case 5:
                _c.apply(void 0, [_2.sent()]).toEqual(['Piece 4', 'Piece 2', 'Piece 1', 'Piece 3', 'Piece 5']);
                // Piece 5 hands in its result: delivered, blue, it is under what waits and over what works
                return [4 /*yield*/, $.tool.call({ tool: 'SubagentHandback', tool_use_id: 'h-a5', agentId: 'a5', message: 'Done.' })];
            case 6:
                // Piece 5 hands in its result: delivered, blue, it is under what waits and over what works
                _2.sent();
                return [4 /*yield*/, $.turn.complete({ answer: '', durationMs: 1, isAborted: false, turnId: 'turn-a5', reason: 'answer', agentId: 'a5' })];
            case 7:
                _2.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 8:
                _2.sent();
                _d = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[2] === 'Piece 5' ? true : undefined)];
                        }
                    }); }); })];
            case 9:
                _d.apply(void 0, [_2.sent()]).toBe(true);
                _e = expect;
                return [4 /*yield*/, order()];
            case 10:
                _e.apply(void 0, [_2.sent()]).toEqual(['Piece 4', 'Piece 2', 'Piece 5', 'Piece 1', 'Piece 3']);
                _g = (_f = list).press;
                _x = {};
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 11: 
            // The older ask, first at the top, is answered: at once the one still waiting is first and the answered card is in its own place
            // among the working, saying the answer while it holds the space its question took, and under the line its work then writes
            return [4 /*yield*/, _g.apply(_f, [(_x.key = (_1 = (_0 = (_2.sent()).find(function (one) { return one.props.label === 'Go on'; })) === null || _0 === void 0 ? void 0 : _0.key) !== null && _1 !== void 0 ? _1 : '', _x)])];
            case 12:
                // The older ask, first at the top, is answered: at once the one still waiting is first and the answered card is in its own place
                // among the working, saying the answer while it holds the space its question took, and under the line its work then writes
                _2.sent();
                _h = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: /You answered “Go on”/ })];
                    }); }); })];
            case 13:
                _h.apply(void 0, [_2.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 2' ? true : undefined)];
                        }
                    }); }); })];
            case 14:
                _j.apply(void 0, [_2.sent()]).toBe(true);
                _k = expect;
                return [4 /*yield*/, order()];
            case 15:
                _k.apply(void 0, [_2.sent()]).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__note', tool_use_id: 'n4', agentId: 'a4', text: 'Now doing the next part' })];
            case 16:
                _2.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 17:
                _2.sent();
                _l = expect;
                return [4 /*yield*/, order()];
            case 18:
                _l.apply(void 0, [_2.sent()]).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /You answered “Go on”/ })];
            case 19:
                _m.apply(void 0, [_2.sent()]).toBeDefined();
                return [4 /*yield*/, clock.advance(65000)];
            case 20:
                _2.sent();
                _o = expect;
                return [4 /*yield*/, order()];
            case 21:
                _o.apply(void 0, [_2.sent()]).toEqual(['Piece 2', 'Piece 5', 'Piece 1', 'Piece 3', 'Piece 4']);
                // It asks again: new, it goes under what already waits
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__claudopus__ask', tool_use_id: 'k4b', agentId: 'a4', text: 'And the next part?', choices: ['Yes', 'No'] })];
            case 22:
                // It asks again: new, it goes under what already waits
                _2.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 23:
                _2.sent();
                _p = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[1] === 'Piece 4' ? true : undefined)];
                        }
                    }); }); })];
            case 24:
                _p.apply(void 0, [_2.sent()]).toBe(true);
                _q = expect;
                return [4 /*yield*/, order()];
            case 25:
                _q.apply(void 0, [_2.sent()]).toEqual(['Piece 2', 'Piece 4', 'Piece 5', 'Piece 1', 'Piece 3']);
                labelled = function (label) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, list.findAll({ type: 'Button' })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent()).find(function (one) { return one.props.label === label; })) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : ''];
                    }
                }); }); };
                _s = (_r = list).press;
                _y = {};
                return [4 /*yield*/, labelled('Release it')];
            case 26: return [4 /*yield*/, _s.apply(_r, [(_y.key = _2.sent(), _y)])];
            case 27:
                _2.sent();
                _u = (_t = list).press;
                _z = {};
                return [4 /*yield*/, labelled('Yes')];
            case 28: return [4 /*yield*/, _u.apply(_t, [(_z.key = _2.sent(), _z)])];
            case 29:
                _2.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 30:
                _2.sent();
                _v = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, order()];
                            case 1: return [2 /*return*/, ((_a.sent())[0] === 'Piece 5' ? true : undefined)];
                        }
                    }); }); })];
            case 31:
                _v.apply(void 0, [_2.sent()]).toBe(true);
                _w = expect;
                return [4 /*yield*/, order()];
            case 32:
                _w.apply(void 0, [_2.sent()]).toEqual(['Piece 5', 'Piece 1', 'Piece 2', 'Piece 3', 'Piece 4']);
                return [2 /*return*/];
        }
    });
}); });
// 15 Nov: Allow was pressed and the amber block with its buttons stayed up to a second, until the gate's wait (a one-second
// sleep the engine ran) read the press. Now the block goes in the press's own drawing, and the press itself ends the wait
test("a press on a gate takes its block away in the press's own drawing and leaves one grey line of what was pressed, with no buttons left and nothing green; the held call then ends with no second let pass", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var counted, w, _loop_6, _i, _a, _b, id, command, button, question, said, ends;
    var _this = this;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                counted = countingSleeps(on);
                return [4 /*yield*/, gated($, counted.on)];
            case 1:
                w = _e.sent();
                w.files.set('git:top', '/repo/wt');
                w.files.set('git:branch', 'fix-it');
                _loop_6 = function (id, command, button, question, said, ends) {
                    var before, call, base, _f, _g, _h, _j, _k, _l, _m, r, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                before = counted.seen.sleeps;
                                call = w.bash(id, command);
                                base = "gate-".concat(id, "-").concat(button);
                                _f = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(w.list, base)];
                                    }); }); })];
                            case 1:
                                _f.apply(void 0, [_p.sent()]).toBeDefined();
                                _g = expect;
                                return [4 /*yield*/, w.list.find({ type: 'Text', text: question })];
                            case 2:
                                _g.apply(void 0, [_p.sent()]).toBeDefined();
                                // Pressed: the very next look at the panel has the line, with nothing left to press and nothing that still asks
                                return [4 /*yield*/, pressed(w.list, base)];
                            case 3:
                                // Pressed: the very next look at the panel has the line, with nothing left to press and nothing that still asks
                                _p.sent();
                                _h = expect;
                                return [4 /*yield*/, w.list.find({ type: 'Text', text: said })];
                            case 4:
                                _h.apply(void 0, [(_c = (_p.sent())) === null || _c === void 0 ? void 0 : _c.props.dimColor]).toBe(true);
                                _j = expect;
                                return [4 /*yield*/, w.list.findAll({ type: 'Button' })];
                            case 5:
                                _j.apply(void 0, [(_p.sent()).some(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith("gate-".concat(id, "-")); })]).toBe(false);
                                _k = expect;
                                return [4 /*yield*/, w.list.find({ type: 'Text', text: question })];
                            case 6:
                                _k.apply(void 0, [_p.sent()]).toBeUndefined();
                                _l = expect;
                                return [4 /*yield*/, w.list.find({ type: 'Text', text: 'Permission' })];
                            case 7:
                                _l.apply(void 0, [_p.sent()]).toBeUndefined();
                                _m = expect;
                                return [4 /*yield*/, gateGreens(w.list)];
                            case 8:
                                _m.apply(void 0, [_p.sent()]).toBe(0);
                                if (!(ends === 'held')) return [3 /*break*/, 10];
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, w.holding.get("x".concat(id, "; /plug/claudopus/bin/release"))];
                                    }); }); })];
                            case 9:
                                (_d = (_p.sent())) === null || _d === void 0 ? void 0 : _d('released');
                                _p.label = 10;
                            case 10: return [4 /*yield*/, call];
                            case 11:
                                r = (_p.sent());
                                if (ends === 'refused')
                                    expect(r.deny).toContain('Refused by Sam');
                                else
                                    expect(r.deny).toBeUndefined();
                                // One wait was in flight while it was held, and the press started no other
                                expect(counted.seen.sleeps - before).toBe(1);
                                // The one line of the card is of the last press alone
                                _o = expect;
                                return [4 /*yield*/, gateTexts(w.list)];
                            case 12:
                                // The one line of the card is of the last press alone
                                _o.apply(void 0, [(_p.sent()).filter(function (one) { return one.startsWith('✓ '); })]).toEqual([said]);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = [
                    ['p1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"), '0-once', 'Run this as admin on this Mac?', ALLOWED_LINE, 'ran'],
                    ['p2', "".concat(ADMIN, " here 'chmod 600 /etc/hosts'"), '0-always', 'Run this as admin on this Mac?', '✓ You pressed “Always allow this command”', 'ran'],
                    ['p3', "".concat(ADMIN, " here 'chmod 755 /etc/hosts'"), '0-deny', 'Run this as admin on this Mac?', REFUSED_LINE, 'refused'],
                    ['p4', 'hold xp4; /plug/claudopus/bin/release', 'r0-once', 'Release fix-it to main?', ALLOWED_LINE, 'held'],
                    ['p5', 'hold xp5; /plug/claudopus/bin/release', 'r0-deny', 'Release fix-it to main?', REFUSED_LINE, 'refused'],
                ];
                _e.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], id = _b[0], command = _b[1], button = _b[2], question = _b[3], said = _b[4], ends = _b[5];
                return [5 /*yield**/, _loop_6(id, command, button, question, said, ends)];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                w.wake();
                return [2 /*return*/];
        }
    });
}); });
test('two presses on a gate send one answer: the first, as drawn', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, list, bash, held, wake, admins, call, _b, once, deny, _c, _d, r, _e;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                _a = _k.sent(), list = _a.list, bash = _a.bash, held = _a.held, wake = _a.wake, admins = _a.admins;
                call = bash('d1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"));
                _b = expect;
                return [4 /*yield*/, held('d1')];
            case 2:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, keyed(list, 'gate-d1-0-once')];
            case 3:
                once = (_g = (_f = (_k.sent())) === null || _f === void 0 ? void 0 : _f.key) !== null && _g !== void 0 ? _g : '';
                return [4 /*yield*/, keyed(list, 'gate-d1-0-deny')];
            case 4:
                deny = (_j = (_h = (_k.sent())) === null || _h === void 0 ? void 0 : _h.key) !== null && _j !== void 0 ? _j : '';
                return [4 /*yield*/, list.press({ key: once })];
            case 5:
                _k.sent();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
            case 6:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: deny }).catch(function () { return undefined; })
                    // The second press changed nothing: the card still says what the first one did
                ];
            case 7:
                _k.sent();
                // The second press changed nothing: the card still says what the first one did
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: ALLOWED_LINE })];
            case 8:
                // The second press changed nothing: the card still says what the first one did
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: once }).catch(function () { return undefined; })];
            case 9:
                _k.sent();
                return [4 /*yield*/, call];
            case 10:
                r = (_k.sent());
                expect(r.deny).toBeUndefined();
                expect(admins.length).toBe(1);
                _e = expect;
                return [4 /*yield*/, gateTexts(list)];
            case 11:
                _e.apply(void 0, [(_k.sent()).filter(function (one) { return one.startsWith('✓ '); })]).toEqual([ALLOWED_LINE]);
                wake();
                return [2 /*return*/];
        }
    });
}); });
test('a gate allowed but not let through says so in its grey line, never a bare "Allow"', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var w, _loop_7, _i, _a, _b, id, command, button, said;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, gated($, on)];
            case 1:
                w = _d.sent();
                w.files.set('git:top', '/repo/wt');
                w.files.set('git:branch', 'fix-it');
                _loop_7 = function (id, command, button, said) {
                    var call, _e, r, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                w.files.delete('keychain:refused');
                                call = w.bash(id, command);
                                _e = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, keyed(w.list, button)];
                                    }); }); })];
                            case 1:
                                _e.apply(void 0, [_j.sent()]).toBeDefined();
                                w.files.set('keychain:refused', '1');
                                return [4 /*yield*/, w.press(button)];
                            case 2:
                                _j.sent();
                                return [4 /*yield*/, call];
                            case 3:
                                r = (_j.sent());
                                expect(r.deny).toContain('could not secure what was allowed');
                                expect(w.grants()).toEqual([]);
                                expect(w.admins).toEqual([]);
                                _f = expect;
                                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, w.list.find({ type: 'Text', text: said })];
                                    }); }); })];
                            case 4:
                                _f.apply(void 0, [(_c = (_j.sent())) === null || _c === void 0 ? void 0 : _c.props.dimColor]).toBe(true);
                                // (the line whole: nothing on the card says only that it was allowed)
                                _g = expect;
                                return [4 /*yield*/, gateTexts(w.list)];
                            case 5:
                                // (the line whole: nothing on the card says only that it was allowed)
                                _g.apply(void 0, [(_j.sent()).filter(function (one) { return one.startsWith('✓ '); })]).toEqual([said]);
                                _h = expect;
                                return [4 /*yield*/, gateGreens(w.list)];
                            case 6:
                                _h.apply(void 0, [_j.sent()]).toBe(0);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = [
                    ['f1', "".concat(ADMIN, " here 'chmod 644 /etc/hosts'"), 'gate-f1-0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so it didn't run"],
                    ['f2', '/plug/claudopus/bin/release', 'gate-f2-r0-once', "✓ You pressed “Allow” · the keychain key couldn't be used, so nothing was released"],
                ];
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], id = _b[0], command = _b[1], button = _b[2], said = _b[3];
                return [5 /*yield**/, _loop_7(id, command, button, said)];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); });
