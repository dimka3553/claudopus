// The other Mac: its chats over ssh, the same results on both, and chats the app runs over ssh
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
test("F-014 · a Mac that reaches another hands it this Mac's chats in the same trip; answers carried back from there answer nothing here and are put away there", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, sshed, pressed, first, _b, _c, head, rest, second;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                files.set("".concat(MEMORY, "/live/chat-b.json"), otherChat(NOW));
                pressed = JSON.stringify({ card: 'b1', choice: 'Send', isReply: false, ask: 'May I send 12 invoices?', askAt: NOW, at: NOW, chat: 'chat-b' });
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-answer---\n").concat(NOW, "-abc.json\n").concat(pressed, "\n---claudopus-answer---\nbad name\n").concat(pressed, "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _e.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.find(function (_a) {
                                var command = _a[0];
                                return command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'L=");
                            })];
                    }); }); })
                    // What it hands over says who this Mac is, what it calls the M4, and carries this Mac's chats only
                ];
            case 3:
                first = _e.sent();
                _b = ((_d = first === null || first === void 0 ? void 0 : first[1]) !== null && _d !== void 0 ? _d : '').split('\n'), _c = _b[0], head = _c === void 0 ? '' : _c, rest = _b.slice(1);
                expect(JSON.parse(head)).toEqual({ from: 'sams-macbook-air', you: 'm4' });
                expect(rest.join('\n')).toContain('"chat":"chat-b"');
                expect(first === null || first === void 0 ? void 0 : first[0]).toContain('$L/pushed/sams-macbook-air.$$.part');
                expect(first === null || first === void 0 ? void 0 : first[0]).not.toContain('rm -f 1');
                // The answer is left for no chat here, though it names the ask that stands
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.includes('/live/answers/chat-b/'); })).toEqual([]);
                // The next trip puts it away there, and carried again it is not left either
                return [4 /*yield*/, clock.advance(10000)];
            case 4:
                // The next trip puts it away there, and carried again it is not left either
                _e.sent();
                second = sshed.filter(function (_a) {
                    var command = _a[0];
                    return command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'L=");
                }).at(-1);
                expect(second === null || second === void 0 ? void 0 : second[0]).toContain("rm -f ".concat(NOW, "-abc.json"));
                expect(files.has("".concat(MEMORY, "/live/answers/chat-b/").concat(NOW, "-abc.json"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test("with another Mac named, the results become the same on both: what each lacks is copied over with its paths moved home, and what was done to one both have goes both ways", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, sshed, result, there, theirs, handed, marked, here;
    var _this = this;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                result = function (id, more) {
                    if (more === void 0) { more = {}; }
                    return (__assign({ id: id, title: "Result ".concat(id), subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: "".concat(HOME, "/repo"), gist: '', files: [], agent: '' }, more));
                };
                // Here: "both", put away here, and "mine" only here. There: "both", with an answer given there, and "theirs" only there
                files.set("".concat(MEMORY, "/reports/both/meta.json"), JSON.stringify(result('both', { archived: NOW, waiting: [{ text: 'Ship it?' }] })));
                files.set("".concat(MEMORY, "/reports/both/report.md"), 'Both.\n');
                files.set("".concat(MEMORY, "/reports/mine/meta.json"), JSON.stringify(result('mine')));
                files.set("".concat(MEMORY, "/reports/mine/report.md"), 'Mine.\n');
                there = JSON.stringify(__assign(__assign({}, result('both', { waiting: [{ text: 'Ship it?', answer: 'Yes' }] })), { folder: '/Users/sam/repo' }));
                theirs = JSON.stringify(__assign(__assign({}, result('theirs')), { folder: '/Users/sam/repo' }));
                files.set('ssh:results', "/Users/sam\n---claudopus-result---\nboth\n111 222\n".concat(there, "\n---claudopus-result---\ntheirs\n3 4\n").concat(theirs, "\n"));
                files.set('remote:theirs/meta.json', theirs);
                files.set('remote:theirs/report.md', 'See /Users/sam/repo/a.png\n');
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, clock.advance(10000)
                    // "theirs" is brought, whole, its paths on this Mac's home
                ];
            case 2:
                _e.sent();
                // "theirs" is brought, whole, its paths on this Mac's home
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, files.get("".concat(MEMORY, "/reports/theirs/meta.json"))];
                    }); }); })];
            case 3:
                // "theirs" is brought, whole, its paths on this Mac's home
                _e.sent();
                expect(files.get("".concat(MEMORY, "/reports/theirs/meta.json"))).toContain("\"folder\":\"".concat(HOME, "/repo\""));
                expect(files.get("".concat(MEMORY, "/reports/theirs/report.md"))).toBe("See ".concat(HOME, "/repo/a.png\n"));
                expect((_b = sshed.find(function (_a) {
                    var script = _a[0];
                    return script === null || script === void 0 ? void 0 : script.includes('tar xf - -C "$S"');
                })) === null || _b === void 0 ? void 0 : _b[1]).toContain('tar cf - theirs -C _sync _end');
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.find(function (_a) {
                                var script = _a[0];
                                return script === null || script === void 0 ? void 0 : script.includes(': > _end && COPYFILE_DISABLE=1 tar cf');
                            })];
                    }); }); })];
            case 4:
                handed = _e.sent();
                expect(handed === null || handed === void 0 ? void 0 : handed[1]).toMatch(/ mine$/);
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.find(function (_a) {
                                var command = _a[0];
                                return command === null || command === void 0 ? void 0 : command.includes('/reports/both/meta.json');
                            })];
                    }); }); })];
            case 5:
                marked = _e.sent();
                here = JSON.parse((_c = files.get("".concat(MEMORY, "/reports/both/meta.json"))) !== null && _c !== void 0 ? _c : '{}');
                expect(here.waiting).toEqual([{ text: 'Ship it?', answer: 'Yes' }]);
                expect(here.archived).toBe(NOW);
                expect(marked === null || marked === void 0 ? void 0 : marked[0]).toContain('= "111 222" ] || exit 3');
                expect(JSON.parse((_d = marked === null || marked === void 0 ? void 0 : marked[1]) !== null && _d !== void 0 ? _d : '{}')).toMatchObject({ archived: NOW, folder: '/Users/sam/repo', waiting: [{ text: 'Ship it?', answer: 'Yes' }] });
                // Within the next two minutes it is not looked at again; nothing here was deleted
                return [4 /*yield*/, clock.advance(60000)];
            case 6:
                // Within the next two minutes it is not looked at again; nothing here was deleted
                _e.sent();
                expect(sshed.filter(function (_a) {
                    var command = _a[0];
                    return command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'echo $HOME;");
                }).length).toBe(1);
                expect(files.get("".concat(MEMORY, "/reports/mine/report.md"))).toBe('Mine.\n');
                return [2 /*return*/];
        }
    });
}); });
test("a result cut short on its way is never put in place, and a list cut short sends nothing either way", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, sshed, theirs, pulls, before;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                theirs = JSON.stringify({ id: 'theirs', title: 'T', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' });
                files.set('ssh:results', "/Users/sam\n---claudopus-result---\ntheirs\n3 4\n".concat(theirs, "\n"));
                files.set('remote:theirs/meta.json', theirs);
                files.set('remote:theirs/report.md', 'All of it.\n');
                files.set('pull:cut', '1');
                files.set("".concat(MEMORY, "/reports/mine/meta.json"), JSON.stringify(__assign(__assign({}, JSON.parse(theirs)), { id: 'mine' })));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.find(function (_a) {
                                var script = _a[0];
                                return script === null || script === void 0 ? void 0 : script.includes('tar xf - -C "$S"');
                            })];
                    }); }); })];
            case 3:
                _b.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 4:
                _b.sent();
                expect(files.has("".concat(MEMORY, "/reports/theirs/meta.json"))).toBe(false);
                // Cut between its two files with tar ending well: no _end came, so it is not put in place either
                files.set('pull:cut', 'between');
                pulls = sshed.filter(function (_a) {
                    var script = _a[0];
                    return script === null || script === void 0 ? void 0 : script.includes('tar xf - -C "$S"');
                }).length;
                return [4 /*yield*/, clock.advance(120000)];
            case 5:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, sshed.filter(function (_a) {
                                var script = _a[0];
                                return script === null || script === void 0 ? void 0 : script.includes('tar xf - -C "$S"');
                            }).length > pulls];
                    }); }); })];
            case 6:
                _b.sent();
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _b.sent();
                expect(files.has("".concat(MEMORY, "/reports/theirs/meta.json"))).toBe(false);
                // Two minutes on, with the list cut short: nothing is brought, handed or marked
                files.delete('pull:cut');
                files.set('ssh:cut', '1');
                before = sshed.length;
                return [4 /*yield*/, clock.advance(120000)];
            case 8:
                _b.sent();
                expect(sshed.slice(before).filter(function (_a) {
                    var script = _a[0];
                    return !(script === null || script === void 0 ? void 0 : script.startsWith("sh -c 'L=")) && !(script === null || script === void 0 ? void 0 : script.startsWith("sh -c 'echo $HOME;")) && !(script === null || script === void 0 ? void 0 : script.startsWith('find'));
                })).toEqual([]);
                expect(files.has("".concat(MEMORY, "/reports/theirs/meta.json"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a result put away here and brought back on the other Mac by an older version stays brought back on both', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, sshed, r, here;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' };
                files.set("".concat(MEMORY, "/reports/r/meta.json"), JSON.stringify(__assign(__assign({}, r), { archived: NOW - 1000 })));
                // The last sync left it put away on both; there it is now neither put away nor brought back with a time
                files.set("".concat(MEMORY, "/live/macs/sam-m4.local.results.json"), JSON.stringify({ syncedAt: 1, triedAt: 1, archived: { r: NOW - 1000 } }));
                files.set('ssh:results', "/Users/sam\n---claudopus-result---\nr\n1 2\n".concat(JSON.stringify(r), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var one;
                        var _a;
                        return __generator(this, function (_b) {
                            one = JSON.parse((_a = files.get("".concat(MEMORY, "/reports/r/meta.json"))) !== null && _a !== void 0 ? _a : '{}');
                            return [2 /*return*/, one.broughtBack ? one : undefined];
                        });
                    }); })];
            case 3:
                here = _b.sent();
                expect(here.archived).toBeUndefined();
                // Nothing puts it away there again
                expect(sshed.some(function (_a) {
                    var command = _a[0], stdin = _a[1];
                    return (command === null || command === void 0 ? void 0 : command.includes('/reports/r/meta.json')) && JSON.parse(stdin || '{}').archived;
                })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
test('a result brought back after it was put away on the other Mac stays out of the archive, as the later of the two', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, r, here;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                r = { id: 'r', title: 'R', subject: 'S', at: NOW, chat: 'c', chatId: 'c', folder: '/x', gist: '', files: [], agent: '' };
                files.set("".concat(MEMORY, "/reports/r/meta.json"), JSON.stringify(__assign(__assign({}, r), { archived: NOW - 1000 })));
                files.set('ssh:results', "/Users/sam\n---claudopus-result---\nr\n1 2\n".concat(JSON.stringify(__assign(__assign({}, r), { broughtBack: NOW })), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _b.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var one;
                        var _a;
                        return __generator(this, function (_b) {
                            one = JSON.parse((_a = files.get("".concat(MEMORY, "/reports/r/meta.json"))) !== null && _a !== void 0 ? _a : '{}');
                            return [2 /*return*/, one.broughtBack ? one : undefined];
                        });
                    }); })];
            case 3:
                here = _b.sent();
                expect(here.archived).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
test("a Mac handed another Mac's chats lists them by name and Mac with its own, with their asks answered only there, and drops them once that Mac stops handing them over", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, ahead, push, list, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _this = this;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                ahead = NOW + 3600000;
                push = "".concat(JSON.stringify({ from: 'sams-m5', you: 'sams-m4' }), "\n").concat(ahead / 1000, "\n---claudopus-live---\n").concat(otherChat(ahead, 'chat-m5', 'Robot arm'), "\n---claudopus-live---\n").concat(JSON.stringify({ chat: 'chat-idle', title: 'Quiet one', folder: '/x', host: '', at: ahead, cards: [] }), "\n");
                files.set("".concat(MEMORY, "/live/pushed/sams-m5.json"), push);
                files.set("mtime:".concat(MEMORY, "/live/pushed/sams-m5.json"), String(NOW));
                // A copy laid under a name that is not the Mac it says handed it is passed over
                files.set("".concat(MEMORY, "/live/pushed/other.json"), push);
                // This Mac's own chat with nothing running
                files.set("".concat(MEMORY, "/live/chat-own.json"), JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW, cards: [] }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _l.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _l.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Robot arm' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_l.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'billing · on sams-m5' })];
            case 5:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                // The chats with nothing going on, of either Mac, are not listed, and this chat with nothing going on gets no heading
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Quiet one' })];
            case 6:
                // The chats with nothing going on, of either Mac, are not listed, and this chat with nothing going on gets no heading
                _d.apply(void 0, [_l.sent()]).toBeUndefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Own quiet' })];
            case 7:
                _e.apply(void 0, [_l.sent()]).toBeUndefined();
                _f = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^This chat$/ })];
            case 8:
                _f.apply(void 0, [_l.sent()]).toBeUndefined();
                _g = expect;
                return [4 /*yield*/, list.findAll({ type: 'Text' })];
            case 9:
                _g.apply(void 0, [(_l.sent()).filter(function (one) { return one.text === 'Robot arm'; })]).toHaveLength(1);
                // Its running time is told on this Mac's clock
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^Opus 5\.5 · (\d+ of \d+ done · )?(\d+s|1m \d\ds)$/ })];
            case 10:
                // Its running time is told on this Mac's clock
                _h.apply(void 0, [_l.sent()]).toBeDefined();
                // Its ask has nothing to press here, and nothing waits in the outbox for that Mac
                _j = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 11:
                // Its ask has nothing to press here, and nothing waits in the outbox for that Mac
                _j.apply(void 0, [(_l.sent()).some(function (b) { return b.props.label === 'Send'; })]).toBe(false);
                expect(__spreadArray([], files.keys(), true).filter(function (path) { return path.startsWith("".concat(MEMORY, "/live/outbox/sams-m5/")) && path.endsWith('.json'); })).toEqual([]);
                // That Mac goes to sleep: its copy is not handed over again and goes stale, and its chats leave, as does the naming of this one
                return [4 /*yield*/, clock.advance(100000)];
            case 12:
                // That Mac goes to sleep: its copy is not handed over again and goes stale, and its chats leave, as does the naming of this one
                _l.sent();
                files.set("".concat(MEMORY, "/live/chat-own.json"), JSON.stringify({ chat: 'chat-own', title: 'Own quiet', folder: '/y', host: '', at: NOW + 100000, cards: [] }));
                return [4 /*yield*/, clock.advance(5000)];
            case 13:
                _l.sent();
                _k = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Robot arm' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 14:
                _k.apply(void 0, [_l.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 15:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
test("work on another Mac whose chat runs a version that drops a card as it ends, saying nothing of its end, turns happy here for its pause, then is gone", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, drawn, running, list, _b, _c, quiet, seen, n, _d, _e, _f, _g, _h, _j, _k, back, n, finished, n, _l, _m;
    var _this = this;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _a = world(on, { art: true }), files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                drawn = function (view) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.findAll({ type: 'Svg' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (one) { var _a; return (_a = /<title>([\w-]+)<\/title>/.exec(String(one.props.source))) === null || _a === void 0 ? void 0 : _a[1]; }).filter(Boolean)];
                    }
                }); }); };
                running = function (at) { return JSON.stringify(__assign(__assign({}, JSON.parse(otherChat(at, 'chat-old', 'Remote connector'))), { cards: [JSON.parse(otherChat(at)).cards[1]] })); };
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(running(NOW), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _o.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _o.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _o.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Check the totals' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_o.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Working on 1 thing in another chat' })];
            case 5:
                _c.apply(void 0, [_o.sent()]).toBeDefined();
                quiet = JSON.stringify({ chat: 'chat-old', title: 'Remote connector', folder: '/repo/billing', host: '', at: NOW + 11000, cards: [] });
                files.set('ssh:fetch', "".concat((NOW + 11000) / 1000, "\n---claudopus-live---\n").concat(quiet, "\n"));
                n = 0;
                _o.label = 6;
            case 6:
                if (!(n < 20 && !seen)) return [3 /*break*/, 10];
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _o.sent();
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Finished' })];
            case 8:
                ((seen = _o.sent()));
                _o.label = 9;
            case 9:
                n += 1;
                return [3 /*break*/, 6];
            case 10:
                expect(seen).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Check the totals' })];
            case 11:
                _d.apply(void 0, [_o.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Just finished' })];
            case 12:
                _e.apply(void 0, [_o.sent()]).toBeDefined();
                _f = expect;
                return [4 /*yield*/, drawn(list)];
            case 13:
                _f.apply(void 0, [_o.sent()]).toEqual(['happy']);
                // After its pause it is gone, and not kept under Finished, since its chat said nothing of how it ended
                return [4 /*yield*/, clock.advance(3000)];
            case 14:
                // After its pause it is gone, and not kept under Finished, since its chat said nothing of how it ended
                _o.sent();
                _g = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: 'Check the totals' })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 15:
                _g.apply(void 0, [_o.sent()]).toBe(true);
                _h = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Nothing is running' })];
            case 16:
                _h.apply(void 0, [_o.sent()]).toBeDefined();
                _j = expect;
                return [4 /*yield*/, drawn(list)];
            case 17:
                _j.apply(void 0, [_o.sent()]).toEqual(['mark']);
                _k = expect;
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 18:
                _k.apply(void 0, [(_o.sent()).some(function (b) { return /Finished/.test(String(b.props.label)); })]).toBe(false);
                // A chat that closes with its work running shows nothing finished: its work just leaves
                files.set('ssh:fetch', "".concat((NOW + 40000) / 1000, "\n---claudopus-live---\n").concat(running(NOW + 40000), "\n"));
                n = 0;
                _o.label = 19;
            case 19:
                if (!(n < 20 && !back)) return [3 /*break*/, 23];
                return [4 /*yield*/, clock.advance(1000)];
            case 20:
                _o.sent();
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Check the totals' })];
            case 21:
                ((back = _o.sent()));
                _o.label = 22;
            case 22:
                n += 1;
                return [3 /*break*/, 19];
            case 23:
                expect(back).toBeDefined();
                files.set('ssh:fetch', "".concat((NOW + 60000) / 1000, "\n"));
                n = 0;
                _o.label = 24;
            case 24:
                if (!(n < 20)) return [3 /*break*/, 29];
                return [4 /*yield*/, clock.advance(1000)];
            case 25:
                _o.sent();
                _l = finished;
                if (_l) return [3 /*break*/, 27];
                return [4 /*yield*/, list.find({ type: 'Text', text: '✓ Finished' })];
            case 26:
                _l = (finished = _o.sent());
                _o.label = 27;
            case 27:
                ((_l));
                _o.label = 28;
            case 28:
                n += 1;
                return [3 /*break*/, 24];
            case 29:
                expect(finished).toBeUndefined();
                _m = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: 'Check the totals' })];
            case 30:
                _m.apply(void 0, [_o.sent()]).toBeUndefined();
                return [4 /*yield*/, list.unmount()];
            case 31:
                _o.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Details of work in a chat the app runs on another Mac shows what that chat shares, and one press opens that chat", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, chat, list, _b, id, tab, texts, _c;
    var _this = this;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, shown = _a.shown;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                chat = { chat: 'chat-m4', title: 'Video', folder: '/Users/sam/GitHub', host: '', at: NOW, link: { bridge: 'session_01Video', app: '' }, cards: [{ id: 'v1', parentId: '', isFork: false, tokens: 242001, title: 'Improve the video', words: 'Can you improve the video?', items: [{ text: 'Find the cuts', state: 'done' }, { text: 'Have it checked', state: 'doing' }, { text: 'Show you', state: 'open' }], entries: [{ at: NOW - 1000, kind: 'note', text: 'Rendering again for a second look.' }], answer: '', startedAt: NOW - 60000, endedAt: 0, status: 'working', model: 'claude-fable-5-2' }] };
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(JSON.stringify(chat), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, clock.advance(10000)];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Improve the video' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, list.findAll({ type: 'Button' })];
            case 5:
                id = (_f = (_e = (_d = (_g.sent()).find(function (b) { var _a; return ((_a = b.key) !== null && _a !== void 0 ? _a : '').startsWith('open-r-'); })) === null || _d === void 0 ? void 0 : _d.key) === null || _e === void 0 ? void 0 : _e.replace(/^open-/, '').replace(/-\d+$/, '')) !== null && _f !== void 0 ? _f : '';
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { requestId: "work-".concat(id), surface: 'desktop' }))];
            case 6:
                tab = _g.sent();
                return [4 /*yield*/, tab.findAll({ type: 'Text' })];
            case 7:
                texts = (_g.sent()).map(function (t) { return t.text; });
                expect(texts).toContain('From the chat "Video", GitHub · on m4');
                expect(texts).toContain('“Can you improve the video?”');
                expect(texts).toContain('Have it checked');
                expect(texts).toContain('Rendering again for a second look.');
                expect(texts).toContain('Its chat is kept by the chat "Video" on m4, which runs it. Stop it or move it to another model there.');
                return [4 /*yield*/, pressed(tab, "their-chat-".concat(id))];
            case 8:
                _g.sent();
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, shown.find(function (argv) { var _a; return (_a = argv[1]) === null || _a === void 0 ? void 0 : _a.startsWith('claude://'); })];
                    }); }); })];
            case 9:
                _c.apply(void 0, [_g.sent()]).toEqual(['open', 'claude://code/session_01Video']);
                return [4 /*yield*/, tab.unmount()];
            case 10:
                _g.sent();
                return [4 /*yield*/, list.unmount()];
            case 11:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test("in a chat whose screen never says which tab it shows, as one the app runs over ssh, Details opens its tab once and leaves it drawn", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, clock, pane, _b;
    var _this = this;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: false, isPlaced: true }];
                _a = world(on, { live: live }), opened = _a.opened, closed = _a.closed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _d.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_d.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _d.sent();
                expect(opened.filter(function (id) { return id === 'work-a1'; })).toHaveLength(1);
                expect(closed).not.toContain('work-a1');
                expect((_c = live.find(function (one) { return one.id === 'work-a1'; })) === null || _c === void 0 ? void 0 : _c.isPlaced).toBe(true);
                return [4 /*yield*/, pane.unmount()];
            case 8:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test("where the screen says which tab it shows, a Details tab left behind the list is brought forward once the press has run", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, clock, pane, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }];
                _a = world(on, { live: live }), opened = _a.opened, closed = _a.closed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the nose', wait: false, origin: composer })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'fix the nose' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 4:
                pane = _c.sent();
                return [4 /*yield*/, pressed(pane, 'open-a1')];
            case 5:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('work-a1') || undefined];
                    }); }); })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(1000)];
            case 7:
                _c.sent();
                expect(opened.filter(function (id) { return id === 'work-a1'; })).toHaveLength(2);
                expect(closed.filter(function (id) { return id === 'work-a1'; })).toHaveLength(1);
                return [4 /*yield*/, pane.unmount()];
            case 8:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a press inside the list gives it the keyboard, and the engine shows no new tab over one holding it: the list lets go first, then Stats opens in front", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, pane, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true, isFocused: true }];
                _a = world(on, { live: live }), opened = _a.opened, closed = _a.closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _c.sent();
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 3:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('stats') || undefined];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                // The list was closed and opened again before Stats, and is open still
                expect(closed).toContain('claudopus');
                expect(opened.lastIndexOf('claudopus')).toBeLessThan(opened.lastIndexOf('stats'));
                // Stats opened behind before the list closed, so the sidebar never stood empty
                expect(opened.indexOf('stats')).toBeLessThan(opened.lastIndexOf('claudopus'));
                expect(live.map(function (one) { return one.id; })).toEqual(['claudopus', 'stats']);
                return [4 /*yield*/, pane.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("where the engine says of no tab that it is shown or holds the keyboard (a chat over ssh), every other tab lets go first, in its place, then Stats opens in front", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, pane, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                live = [
                    { id: 'claudopus', isShown: false, isPlaced: false },
                    { id: 'reports', isShown: false, isPlaced: false },
                ];
                _a = world(on, { live: live, blind: true, env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), opened = _a.opened, closed = _a.closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _c.sent();
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 3:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('stats') || undefined];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                expect(closed).toEqual(expect.arrayContaining(['claudopus', 'reports']));
                // Stats opened behind first, so the sidebar never stood empty, and last with the keyboard
                expect(opened.indexOf('stats')).toBeLessThan(opened.lastIndexOf('claudopus'));
                expect(opened.lastIndexOf('claudopus')).toBeLessThan(opened.lastIndexOf('stats'));
                expect(opened.lastIndexOf('reports')).toBeLessThan(opened.lastIndexOf('stats'));
                // The tabs stand as they stood, Stats after them
                expect(live.map(function (one) { return one.id; })).toEqual(['claudopus', 'reports', 'stats']);
                expect(closed.filter(function (id) { return id !== 'agents'; }).sort()).toEqual(['claudopus', 'reports', 'stats']);
                return [4 /*yield*/, pane.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a roster that says nothing in a chat on this Mac (nothing drawn) leaves the other tabs alone on a press", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, pane, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: false, isPlaced: false }];
                _a = world(on, { live: live, blind: true }), opened = _a.opened, closed = _a.closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _c.sent();
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 3:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('stats') || undefined];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                expect(closed).not.toContain('claudopus');
                return [4 /*yield*/, pane.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("with no tab holding the keyboard, a press opens its tab and leaves the list alone", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, closed, pane, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }];
                _a = world(on, { live: live }), opened = _a.opened, closed = _a.closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _c.sent();
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 3:
                _c.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, opened.includes('stats') || undefined];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                expect(closed).not.toContain('claudopus');
                return [4 /*yield*/, pane.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
test("an empty tab an earlier version left open, not drawn, closes as the mod loads; the list and drawn tabs stay", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, closed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                live = [
                    { id: 'claudopus', isShown: true, isPlaced: true },
                    { id: 'work-a9', isShown: false, isPlaced: false },
                    { id: 'reports', isShown: false, isPlaced: true },
                ];
                closed = world(on, { live: live }).closed;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _a.sent();
                expect(closed.filter(function (id) { return id !== 'agents'; })).toEqual(['work-a9']);
                expect(live.map(function (one) { return one.id; })).toEqual(['claudopus', 'reports']);
                return [2 /*return*/];
        }
    });
}); });
test("a reload while the panel stayed up gives every button a key no load before used, so the app takes each afresh and a press works", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, opened, clock, pane, before, after, again, _b;
    var _this = this;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                live = [{ id: 'claudopus', isShown: true, isPlaced: true }];
                _a = world(on, { live: live }), opened = _a.opened, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 2:
                pane = _e.sent();
                return [4 /*yield*/, keyed(pane, 'stats-open')];
            case 3:
                before = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.key;
                expect(before).toBeDefined();
                // The code reloads from the folder it is watched in: the panel is still up, and the load runs again
                return [4 /*yield*/, clock.advance(7000)];
            case 4:
                // The code reloads from the folder it is watched in: the panel is still up, and the load runs again
                _e.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 5:
                _e.sent();
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () {
                        var key;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, keyed(pane, 'stats-open')];
                                case 1:
                                    key = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.key;
                                    return [2 /*return*/, key && key !== before ? key : undefined];
                            }
                        });
                    }); })];
            case 6:
                after = _e.sent();
                expect(after).toBeDefined();
                return [4 /*yield*/, pressed(pane, 'stats-open')];
            case 7:
                _e.sent();
                expect(opened).toContain('stats');
                return [4 /*yield*/, keyed(pane, 'stats-open')];
            case 8:
                again = (_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.key;
                return [4 /*yield*/, clock.advance(1)];
            case 9:
                _e.sent();
                return [4 /*yield*/, $.session.start(start)];
            case 10:
                _e.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, keyed(pane, 'stats-open')];
                            case 1: return [2 /*return*/, (((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.key) !== again ? true : undefined)];
                        }
                    }); }); })];
            case 11:
                _b.apply(void 0, [_e.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
test("with no screen attached every tab waits undrawn, and none is closed as the mod loads", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var live, _a, closed, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                live = [
                    { id: 'claudopus', isShown: false, isPlaced: false },
                    { id: 'work-a9', isShown: false, isPlaced: false },
                ];
                _a = world(on, { live: live }), closed = _a.closed, clock = _a.clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _b.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _b.sent();
                expect(closed.filter(function (id) { return id !== 'agents'; })).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
test("in a chat another Mac's app runs here over SSH, a chat's name is left for that Mac to open, never opened on this Mac", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, push, list, _b, left, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock, shown = _a.shown;
                push = "".concat(JSON.stringify({ from: 'sams-m5', you: 'sams-m4' }), "\n").concat(NOW / 1000, "\n---claudopus-live---\n").concat(otherChat(NOW, 'chat-m5', 'Robot arm'), "\n");
                files.set("".concat(MEMORY, "/live/pushed/sams-m5.json"), push);
                files.set("mtime:".concat(MEMORY, "/live/pushed/sams-m5.json"), String(NOW));
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, JSON.parse(otherChat(NOW))), { link: { bridge: '', app: 'local_here-1' } })));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ key: 'chat-open-sams-m5-chat-m5' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, list.press({ key: 'chat-open-sams-m5-chat-m5' })];
            case 5:
                _d.sent();
                return [4 /*yield*/, list.press({ key: 'chat-open--chat-b' })];
            case 6:
                _d.sent();
                left = function () { return __spreadArray([], files.keys(), true).filter(function (path) { return /\/live\/outbox\/sams-m5\/o-\d+-[a-z0-9]+\.json$/.test(path); }); };
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (left().length === 2 ? true : undefined)];
                    }); }); })];
            case 7:
                _c.apply(void 0, [_d.sent()]).toBe(true);
                expect(left().map(function (path) { var _a; return JSON.parse((_a = files.get(path)) !== null && _a !== void 0 ? _a : '{}').chat; }).sort()).toEqual(['chat-b', 'chat-m5']);
                expect(shown.filter(function (one) { return one[0] === 'open' && String(one[1]).startsWith('claude:'); })).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 8:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test('a name pressed on another Mac for this Mac is opened here, by what this Mac holds, once, and not when it waited too long', function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, sshed, now, press, opened, _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_self-1' } }), files = _a.files, clock = _a.clock, shown = _a.shown, sshed = _a.sshed;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(otherChat(NOW, 'chat-m4', 'Robot arm'), "\n"));
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, JSON.parse(otherChat(NOW))), { link: { bridge: '', app: 'local_here-1' } })));
                // A chat of this Mac with nothing going on still opens by the link its file shares
                files.set("".concat(MEMORY, "/live/chat-idle.json"), JSON.stringify({ chat: 'chat-idle', title: 'Quiet', folder: '/q', host: '', at: NOW, cards: [], link: { bridge: '', app: 'local_idle-1' } }));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _c.sent();
                return [4 /*yield*/, clock.advance(12000)];
            case 2:
                _c.sent();
                now = NOW + 12000;
                press = function (chat, at) { return "---claudopus-open---\n".concat(JSON.stringify({ chat: chat, at: at }), "\n"); };
                files.set('ssh:opens', "".concat(now / 1000, "\n").concat(press('chat-b', now - 1000)).concat(press('engine-id', now - 1000)).concat(press('chat-idle', now)).concat(press('chat-old', now - 60000)).concat(press('bad id; rm', now)));
                return [4 /*yield*/, clock.advance(4000)];
            case 3:
                _c.sent();
                opened = function () { return shown.filter(function (one) { return one[0] === 'open'; }).map(function (one) { return one[1]; }); };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (opened().length >= 3 ? true : undefined)];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                expect(opened().sort()).toEqual(['claude://code/continue?session=local_here-1', 'claude://code/continue?session=local_idle-1', 'claude://code/continue?session=local_self-1']);
                // Taken over the kept connection, from this Mac's own folder there
                expect(sshed.some(function (_a) {
                    var command = _a[0];
                    return command === null || command === void 0 ? void 0 : command.startsWith("sh -c 'cd $HOME/.claude/claudopus/live/outbox/sams-macbook-air");
                })).toBe(true);
                return [4 /*yield*/, clock.advance(10000)];
            case 5:
                _c.sent();
                expect(opened()).toHaveLength(3);
                return [2 /*return*/];
        }
    });
}); });
test('presses left on another Mac are read with their clock, each chat once, the stale and malformed dropped', function () {
    var now = 1700000000;
    var text = "banner\n".concat(now, "\n---claudopus-open---\n{\"chat\":\"a\",\"at\":").concat(now * 1000 - 5000, "}\n---claudopus-open---\n{\"chat\":\"a\",\"at\":").concat(now * 1000, "}\n---claudopus-open---\n{\"chat\":\"b\",\"at\":").concat(now * 1000 - 31000, "}\n---claudopus-open---\nnot json\n---claudopus-open---\n{\"chat\":\"$(x)\",\"at\":").concat(now * 1000, "}\n");
    expect(opensOf(text)).toEqual(['a']);
    expect(opensOf('')).toEqual([]);
    expect(openTake('sams-m5')).toContain('live/outbox/sams-m5 ');
});
test("in a chat another Mac's app runs here, with no Mac handing its chats here, a name opens nothing on this Mac", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, shown, list, _b, _c;
    var _this = this;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }), files = _a.files, clock = _a.clock, shown = _a.shown;
                files.set("".concat(MEMORY, "/live/chat-b.json"), JSON.stringify(__assign(__assign({}, JSON.parse(otherChat(NOW))), { link: { bridge: '', app: 'local_here-1' } })));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _d.sent();
                return [4 /*yield*/, clock.advance(5000)];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _d.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Billing page' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ key: 'chat-open--chat-b' })];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                expect(shown.filter(function (one) { return one[0] === 'open'; })).toEqual([]);
                return [4 /*yield*/, list.unmount()];
            case 6:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
test("a chat on the other Mac running without Claudopus, and this Mac's app having decided new ones will, show as a warning under the header until neither holds", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, list, _b, _c, _d, _e, _f;
    var _this = this;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                files.set('ssh:fetch', "".concat(NOW / 1000, "\noff 0bcc28d2-aaaa {\"customTitle\":\"FaceIQ email plan\"}\noff bad;id\n"));
                files.set('sh:applog', "2026-11-12 13:57:59 [warn] [CCD] SSH local_x: 1 plugin(s) left to the host's own install did not load there; their copies are handed over from the next start on\n");
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _g.sent();
                return [4 /*yield*/, clock.advance(40000)];
            case 2:
                _g.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 3:
                list = _g.sent();
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, list.find({ type: 'Text', text: 'Claudopus is off in some chats' })];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                _c = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^New chats on m4 start without Claudopus\. .* at 2026-11-12 13:57 .*quit and opened again\.$/ })];
            case 5:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                _d = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /^“FaceIQ email plan” on m4 runs without Claudopus/ })];
            case 6:
                _d.apply(void 0, [_g.sent()]).toBeDefined();
                _e = expect;
                return [4 /*yield*/, list.find({ type: 'Text', text: /bad;id/ })];
            case 7:
                _e.apply(void 0, [_g.sent()]).toBeUndefined();
                // The app is quit and opened again, and the chat there has gone: the warning goes
                files.set('sh:applog', '2026-11-13 09:00:00 [info] Starting app {\n');
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n"));
                return [4 /*yield*/, clock.advance(40000)];
            case 8:
                _g.sent();
                _f = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, list.find({ type: 'Text', text: /^Claudopus is off/ })];
                            case 1: return [2 /*return*/, ((_a.sent()) ? undefined : true)];
                        }
                    }); }); })];
            case 9:
                _f.apply(void 0, [_g.sent()]).toBe(true);
                return [4 /*yield*/, list.unmount()];
            case 10:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
test("the other Mac's asks and finishes are told here as a notification once, opening that chat; old ones are not", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var _a, files, clock, own, chat, later, asked, _b, one, ended, done, readyOnes, _c;
    var _this = this;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = world(on), files = _a.files, clock = _a.clock, own = _a.own;
                files.set("".concat(MEMORY, "/config.json"), JSON.stringify({ macs: ['sam@m4.local'] }));
                chat = function (at, more) {
                    if (more === void 0) { more = {}; }
                    return JSON.stringify(__assign(__assign(__assign({}, JSON.parse(otherChat(at, 'chat-m4', 'Robot arm'))), { link: { bridge: 'cse_robot1', app: '' } }), more));
                };
                // An ask from long ago is not told
                files.set('ssh:fetch', "".concat(NOW / 1000, "\n---claudopus-live---\n").concat(chat(NOW - 3600000, { at: NOW }), "\n"));
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _e.sent();
                return [4 /*yield*/, clock.advance(15000)];
            case 2:
                _e.sent();
                expect(own.filter(function (one) { return one.includes('--asks'); })).toEqual([]);
                later = NOW + 15000;
                files.set('ssh:fetch', "".concat(later / 1000, "\n---claudopus-live---\n").concat(chat(later), "\n"));
                return [4 /*yield*/, clock.advance(30000)];
            case 3:
                _e.sent();
                asked = function () { return own.filter(function (one) { return one.includes('--asks') && one.includes('Send the invoices needs you'); }); };
                _b = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (asked().length ? true : undefined)];
                    }); }); })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(20000)];
            case 5:
                _e.sent();
                expect(asked()).toHaveLength(1);
                one = (_d = asked()[0]) !== null && _d !== void 0 ? _d : [];
                expect(one[one.indexOf('--text') + 1]).toBe('May I send 12 invoices? · Robot arm on m4');
                expect(one[one.indexOf('--open') + 1]).toBe('claude://code/cse_robot1');
                ended = later + 50000;
                done = JSON.parse(chat(later));
                done.cards = done.cards.map(function (c) { return (__assign(__assign({}, c), { status: 'done', endedAt: ended, ask: undefined })); });
                files.set('ssh:fetch', "".concat(ended / 1000, "\n---claudopus-live---\n").concat(JSON.stringify(__assign(__assign({}, done), { at: ended })), "\n"));
                return [4 /*yield*/, clock.advance(30000)];
            case 6:
                _e.sent();
                readyOnes = function () { return own.filter(function (one) { return !one.includes('--asks') && one.includes('Check the totals'); }); };
                _c = expect;
                return [4 /*yield*/, until(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, (readyOnes().length ? true : undefined)];
                    }); }); })];
            case 7:
                _c.apply(void 0, [_e.sent()]).toBe(true);
                return [4 /*yield*/, clock.advance(20000)];
            case 8:
                _e.sent();
                expect(readyOnes()).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
test('the look for chats without Claudopus is read whole, each chat once, and what the app last logged says whether its decision holds', function () {
    expect(offOf("banner\n1700000000\noff abc-1 {\"customTitle\":\"Plan\"}\noff abc-1 {\"customTitle\":\"Plan\"}\noff new \noff $(rm) x\n---claudopus-live---\noff later-1\n")).toEqual([
        { chat: 'abc-1', title: 'Plan' },
        { chat: 'new', title: '' },
    ]);
    expect(stuckOf("2026-11-12 13:57:59 [warn] [CCD] SSH local_x: 1 plugin(s) left to the host's own install did not load there; their copies are handed over\n")).toBe('2026-11-12 13:57');
    expect(stuckOf('2026-11-13 09:00:00 [info] Starting app {\n')).toBe('');
    expect(stuckOf('')).toBe('');
    // A trip carries the look, with nothing in it that ends its single quotes
    expect(OFF_LOOK).not.toContain("'");
    expect(trip('sams-m5', [])).toContain(OFF_LOOK);
});
test("in a chat over ssh the panel's text stays the same from second to second while work runs, so a click does not name a button a redraw let go: times to the minute, tokens to 10k, context to 5%", function ($, on) { return __awaiter(_this, void 0, void 0, function () {
    var clock, _a, _b, _c, _, e_1_1, pane, texts, first, _d, _e;
    var _this = this;
    var _f, e_1, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                clock = world(on, { env: { CLAUDE_SSH_DAEMON_CHILD: '1' } }).clock;
                return [4 /*yield*/, $.session.start(start)];
            case 1:
                _j.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'Fix the nose', wait: false, origin: composer })];
            case 2:
                _j.sent();
                return [4 /*yield*/, $.agent.spawn(__assign(__assign({}, spawn), { prompt: 'Fix the nose' }))];
            case 3:
                _j.sent();
                _j.label = 4;
            case 4:
                _j.trys.push([4, 9, 10, 15]);
                _a = true, _b = __asyncValues($.turn.step({ turnId: 'turn-2', index: 0, model: 'claude-opus-5-5', messageCount: 2, agentId: 'a1' }));
                _j.label = 5;
            case 5: return [4 /*yield*/, _b.next()];
            case 6:
                if (!(_c = _j.sent(), _f = _c.done, !_f)) return [3 /*break*/, 8];
                _h = _c.value;
                _a = false;
                _ = _h;
                void _;
                _j.label = 7;
            case 7:
                _a = true;
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 15];
            case 10:
                _j.trys.push([10, , 13, 14]);
                if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _g.call(_b)];
            case 11:
                _j.sent();
                _j.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, LIST), { surface: 'desktop' }))];
            case 16:
                pane = _j.sent();
                texts = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pane.findAll({ type: 'Text' })];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (t) { return t.text; }).join('|')];
                    }
                }); }); };
                return [4 /*yield*/, texts()];
            case 17:
                first = _j.sent();
                expect(first).toContain('<1m');
                expect(first).toMatch(/context \d*[05]% \(310k\)|context 310k/);
                return [4 /*yield*/, clock.advance(20000)];
            case 18:
                _j.sent();
                _d = expect;
                return [4 /*yield*/, texts()];
            case 19:
                _d.apply(void 0, [_j.sent()]).toBe(first);
                return [4 /*yield*/, clock.advance(41000)];
            case 20:
                _j.sent();
                _e = expect;
                return [4 /*yield*/, texts()];
            case 21:
                _e.apply(void 0, [_j.sent()]).toContain('1m');
                return [4 /*yield*/, pane.unmount()];
            case 22:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
