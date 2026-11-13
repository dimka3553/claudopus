// The other Macs over ssh: their chats fetched, and the same results on every Mac
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
// The other Macs config.json names under `macs`, as ssh reaches them; none for a person with one Mac. Each is known by the name
// config.json gives it, and shown by the first part of its host name
var macs = [];
var macPath = function (mac) { return "".concat(liveDir(), "/").concat(MACS, "/").concat(mac.replace(/[^A-Za-z0-9_.-]/g, '-'), ".json"); };
// One connection to each Mac is kept open a minute after its last use and shared by every chat here, so a trip costs a fraction
// of a second rather than a new login each time, and a name pressed on that Mac opens here within moments. A connection gone dead,
// as after sleep, is dropped within ten seconds and the next call logs in afresh
var ssh = function (mac, command) { return ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=5', '-o', 'ControlMaster=auto', '-o', 'ControlPath=/tmp/claudopus-%i-%C', '-o', 'ControlPersist=60', '-o', 'ServerAliveInterval=5', '-o', 'ServerAliveCountMax=2', '--', mac, command]; };
// This Mac's own name, as its Sharing settings give it, read once: what it is called on the Macs it hands its chats to
var localName = '';
var knowLocalName = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (localName)
                    return [2 /*return*/, localName];
                return [4 /*yield*/, $.process.run(['scutil', '--get', 'LocalHostName'], { timeoutMs: 5000 }).catch(function () { return ({ exitCode: -1, stdout: '' }); })];
            case 1:
                r = _a.sent();
                localName = keyOf(r.exitCode === 0 ? r.stdout.trim() : '') || 'mac';
                return [2 /*return*/, localName];
        }
    });
}); };
// This Mac's own chats' files, as handed to the other Macs: those written in the last three minutes, never another Mac's copies
var ownFiles = function ($, now) { return __awaiter(_this, void 0, void 0, function () {
    var listed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.fs.list(liveDir()).catch(function () { return []; })];
            case 1:
                listed = (_a.sent()).filter(function (entry) { return entry.kind === 'file' && entry.name.endsWith('.json') && !(entry.mtimeMs && now - entry.mtimeMs > 180000); });
                return [4 /*yield*/, Promise.all(listed.map(function (entry) { return readOr($, "".concat(liveDir(), "/").concat(entry.name)); }))];
            case 2: return [2 /*return*/, (_a.sent()).filter(function (text) { return text.trim().startsWith('{'); })];
        }
    });
}); };
// Each other Mac is reached by whichever chat here finds its copy older than FETCH_EVERY: one trip for every chat on this Mac. A trip
// hands that Mac this Mac's chats, brings back its chats and the answers pressed there for this Mac's chats. What a trip that failed
// leaves is the copy before it, which goes stale on its own
var isFetching = false;
var fetchMacs = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var from, _i, macs_1, mac, now, was, _a, _b, kept, push, _c, _d, r, fetchedAt, _e, text, carried, shift, names, _loop_1, _f, carried_1, one;
    var _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                if (isFetching)
                    return [2 /*return*/];
                isFetching = true;
                _q.label = 1;
            case 1:
                _q.trys.push([1, , 20, 21]);
                return [4 /*yield*/, knowLocalName($)];
            case 2:
                from = _q.sent();
                _i = 0, macs_1 = macs;
                _q.label = 3;
            case 3:
                if (!(_i < macs_1.length)) return [3 /*break*/, 19];
                mac = macs_1[_i];
                return [4 /*yield*/, $.clock.now()];
            case 4:
                now = _q.sent();
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, macPath(mac))];
            case 5:
                was = _b.apply(_a, [(_q.sent()) || '{}']);
                if (now - Math.max((_g = was.fetchedAt) !== null && _g !== void 0 ? _g : 0, (_h = was.triedAt) !== null && _h !== void 0 ? _h : 0) < FETCH_EVERY)
                    return [3 /*break*/, 18];
                kept = { mac: mac, text: (_j = was.text) !== null && _j !== void 0 ? _j : '', fetchedAt: (_k = was.fetchedAt) !== null && _k !== void 0 ? _k : 0, acks: (_l = was.acks) !== null && _l !== void 0 ? _l : [], seen: (_m = was.seen) !== null && _m !== void 0 ? _m : [] };
                return [4 /*yield*/, $.fs.write(macPath(mac), JSON.stringify(__assign(__assign({}, kept), { triedAt: now })))];
            case 6:
                _q.sent();
                _c = pushOf;
                _d = [from, keyOf(macName(mac)), now];
                return [4 /*yield*/, ownFiles($, now)];
            case 7:
                push = _c.apply(void 0, _d.concat([_q.sent()]));
                return [4 /*yield*/, $.process.run(ssh(mac, trip(from, kept.acks)), { stdin: push, timeoutMs: 15000 }).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err) }); })];
            case 8:
                r = _q.sent();
                if (!(r.exitCode !== 0 || !r.stdout.includes('\n'))) return [3 /*break*/, 11];
                if (!(((_o = was.fetchedAt) !== null && _o !== void 0 ? _o : 0) >= ((_p = was.triedAt) !== null && _p !== void 0 ? _p : 0))) return [3 /*break*/, 10];
                return [4 /*yield*/, log($, "chats on ".concat(mac, " not fetched: ").concat(r.stderr.trim().slice(0, 160)))];
            case 9:
                _q.sent();
                _q.label = 10;
            case 10: return [3 /*break*/, 18];
            case 11: return [4 /*yield*/, $.clock.now()];
            case 12:
                fetchedAt = _q.sent();
                _e = tripOf(r.stdout), text = _e.text, carried = _e.carried;
                shift = clockOf(text) ? fetchedAt - clockOf(text) : 0;
                names = [];
                _loop_1 = function (one) {
                    var path, r_1;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0:
                                if (kept.seen.includes(one.name)) {
                                    names.push(one.name);
                                    return [2 /*return*/, "continue"];
                                }
                                path = "".concat(liveDir(), "/").concat(ANSWERS, "/").concat(one.chat, "/").concat(one.name);
                                return [4 /*yield*/, $.fs
                                        .write("".concat(path, ".part"), JSON.stringify(__assign(__assign({}, one.answer), { at: one.answer.at + shift })))
                                        .then(function () { return $.process.run(['mv', '-f', "".concat(path, ".part"), path]); })
                                        .catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
                            case 1:
                                r_1 = _r.sent();
                                if (!(r_1.exitCode === 0)) return [3 /*break*/, 2];
                                names.push(one.name);
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, log($, "answer from ".concat(mac, " not left: ").concat(r_1.stderr.trim().slice(0, 160)))];
                            case 3:
                                _r.sent();
                                _r.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _f = 0, carried_1 = carried;
                _q.label = 13;
            case 13:
                if (!(_f < carried_1.length)) return [3 /*break*/, 16];
                one = carried_1[_f];
                return [5 /*yield**/, _loop_1(one)];
            case 14:
                _q.sent();
                _q.label = 15;
            case 15:
                _f++;
                return [3 /*break*/, 13];
            case 16: return [4 /*yield*/, $.fs.write(macPath(mac), JSON.stringify({ mac: mac, text: text, fetchedAt: fetchedAt, triedAt: now, acks: names, seen: __spreadArray([], new Set(__spreadArray(__spreadArray([], kept.seen, true), names, true)), true).slice(-200) }))];
            case 17:
                _q.sent();
                _q.label = 18;
            case 18:
                _i++;
                return [3 /*break*/, 3];
            case 19: return [3 /*break*/, 21];
            case 20:
                isFetching = false;
                return [7 /*endfinally*/];
            case 21: return [2 /*return*/];
        }
    });
}); };
// The results of each other Mac made the same as this one's, at most every RESULTS_EVERY, by whichever chat here comes first: what
// that Mac lacks is handed to it, what this one lacks is brought here, and the marks of a result both have are made the same on both.
// A result is moved into place only whole and only where none has its name; nothing is deleted
var resultsPath = function (mac) { return "".concat(liveDir(), "/").concat(MACS, "/").concat(mac.replace(/[^A-Za-z0-9_.-]/g, '-'), ".results.json"); };
var isSyncing = false;
var syncResults = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var isTried, _i, macs_2, mac, now, was, _a, _b, staging;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (isSyncing)
                    return [2 /*return*/];
                isSyncing = true;
                _e.label = 1;
            case 1:
                _e.trys.push([1, , 14, 15]);
                isTried = false;
                _i = 0, macs_2 = macs;
                _e.label = 2;
            case 2:
                if (!(_i < macs_2.length)) return [3 /*break*/, 11];
                mac = macs_2[_i];
                return [4 /*yield*/, $.clock.now()];
            case 3:
                now = _e.sent();
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readOr($, resultsPath(mac))];
            case 4:
                was = _b.apply(_a, [(_e.sent()) || '{}']);
                if (now - Math.max((_c = was.syncedAt) !== null && _c !== void 0 ? _c : 0, (_d = was.triedAt) !== null && _d !== void 0 ? _d : 0) < RESULTS_EVERY)
                    return [3 /*break*/, 10];
                isTried = true;
                return [4 /*yield*/, $.fs.write(resultsPath(mac), JSON.stringify(__assign(__assign({}, was), { triedAt: now })))];
            case 5:
                _e.sent();
                staging = "".concat(reportsDir(), "/_sync/").concat(now, "-").concat(Math.random().toString(36).slice(2, 8));
                _e.label = 6;
            case 6:
                _e.trys.push([6, , 8, 10]);
                return [4 /*yield*/, syncWith($, mac, was, now, staging)];
            case 7:
                _e.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, $.process.run(['rm', '-rf', staging, "".concat(staging, "-out")]).catch(function () { return undefined; })];
            case 9:
                _e.sent();
                return [7 /*endfinally*/];
            case 10:
                _i++;
                return [3 /*break*/, 2];
            case 11:
                if (!isTried) return [3 /*break*/, 13];
                return [4 /*yield*/, $.process.run(['find', "".concat(reportsDir(), "/_sync"), '-mindepth', '1', '-maxdepth', '1', '-mmin', '+60', '-exec', 'rm', '-rf', '{}', '+']).catch(function () { return undefined; })];
            case 12:
                _e.sent();
                _e.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                isSyncing = false;
                return [7 /*endfinally*/];
            case 15: return [2 /*return*/];
        }
    });
}); };
// The results missing on one side that one trip takes: those tried longest ago first, never tried before all, so results that keep
// failing, or that the other Mac keeps leaving out, take turns with the rest and never hold them back
var aTrip = function (ids, tried) {
    if (tried === void 0) { tried = {}; }
    return ids.map(function (id, i) { var _a; return ({ id: id, i: i, at: (_a = tried[id]) !== null && _a !== void 0 ? _a : 0 }); }).sort(function (a, b) { return a.at - b.at || a.i - b.i; }).slice(0, RESULTS_A_TRIP).map(function (one) { return one.id; });
};
var syncWith = function ($, mac, was, now, staging) { return __awaiter(_this, void 0, void 0, function () {
    var home, looked, theirs, mine, _i, _a, entry, text, changed, missingHere, missingThere, wanted, _b, wanted_1, id, into, r, isWhole_1, _c, _d, _e, _f, _g, file, text, moved, handed, out, ready_1, _h, handed_1, id, _j, _k, file, text, r, _l, marked, archived, _loop_2, _m, _o, _p, id, there, tried, _q, _r, id, _s, _t, id, _u, _v, _w, _x, _y;
    var _z;
    var _0, _1, _2, _3, _4, _5;
    return __generator(this, function (_6) {
        switch (_6.label) {
            case 0:
                home = dir.slice(0, -'/.claude/claudopus'.length);
                return [4 /*yield*/, $.process.run(ssh(mac, RESULTS_LOOK), { timeoutMs: 60000 }).catch(function (err) { return ({ exitCode: -1, stdout: '', stderr: String(err), isStdoutTruncated: false }); })
                    // A list cut short is no list: what it leaves out would look missing there
                ];
            case 1:
                looked = _6.sent();
                theirs = looked.exitCode === 0 && !looked.isStdoutTruncated ? resultsOf(looked.stdout) : undefined;
                if (!!theirs) return [3 /*break*/, 4];
                if (!(((_0 = was.syncedAt) !== null && _0 !== void 0 ? _0 : 0) >= ((_1 = was.triedAt) !== null && _1 !== void 0 ? _1 : 0))) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "results on ".concat(mac, " not looked at: ").concat(looked.isStdoutTruncated ? 'its list was cut short' : looked.stderr.trim().slice(0, 160)))];
            case 2:
                _6.sent();
                _6.label = 3;
            case 3: return [2 /*return*/];
            case 4:
                mine = new Map();
                _i = 0;
                return [4 /*yield*/, $.fs.list(reportsDir()).catch(function () { return []; })];
            case 5:
                _a = _6.sent();
                _6.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                entry = _a[_i];
                if (entry.kind !== 'dir' || !isResultId(entry.name))
                    return [3 /*break*/, 8];
                return [4 /*yield*/, readOr($, "".concat(reportsDir(), "/").concat(entry.name, "/meta.json"))];
            case 7:
                text = _6.sent();
                if (text.trim().startsWith('{'))
                    mine.set(entry.name, text);
                _6.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                changed = 0;
                missingHere = __spreadArray([], theirs.results.keys(), true).filter(function (id) { return !mine.has(id); });
                missingThere = __spreadArray([], mine.keys(), true).filter(function (id) { return !theirs.results.has(id); });
                wanted = aTrip(missingHere, was.tried);
                _b = 0, wanted_1 = wanted;
                _6.label = 10;
            case 10:
                if (!(_b < wanted_1.length)) return [3 /*break*/, 26];
                id = wanted_1[_b];
                into = "".concat(staging, "/").concat(id);
                return [4 /*yield*/, $.process.run(['mkdir', '-p', into])];
            case 11:
                _6.sent();
                return [4 /*yield*/, $.process.run(['bash', '-c', PULL, 'bash', into, mac, pullThere([id])], { timeoutMs: 300000 }).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })
                    // Its stream ends with an empty _end, so one cut between two files is known as cut
                ];
            case 12:
                r = _6.sent();
                _c = r.exitCode === 0;
                if (!_c) return [3 /*break*/, 14];
                return [4 /*yield*/, $.fs.exists("".concat(into, "/_end")).catch(function () { return false; })];
            case 13:
                _c = (_6.sent());
                _6.label = 14;
            case 14:
                isWhole_1 = _c;
                _d = !isWhole_1;
                if (_d) return [3 /*break*/, 16];
                _e = parsedMeta;
                return [4 /*yield*/, readOr($, "".concat(into, "/").concat(id, "/meta.json"))];
            case 15:
                _d = _e.apply(void 0, [_6.sent()]).id !== id;
                _6.label = 16;
            case 16:
                if (!_d) return [3 /*break*/, 18];
                return [4 /*yield*/, log($, "result ".concat(id, " from ").concat(mac, " not brought: ").concat(r.exitCode !== 0 ? r.stderr.trim().slice(0, 160) : 'it came cut short'))];
            case 17:
                _6.sent();
                return [3 /*break*/, 25];
            case 18:
                _f = 0, _g = ['meta.json', 'report.md'];
                _6.label = 19;
            case 19:
                if (!(_f < _g.length)) return [3 /*break*/, 23];
                file = _g[_f];
                return [4 /*yield*/, readOr($, "".concat(into, "/").concat(id, "/").concat(file))];
            case 20:
                text = _6.sent();
                if (!text) return [3 /*break*/, 22];
                return [4 /*yield*/, $.fs.write("".concat(into, "/").concat(id, "/").concat(file), rehome(text, theirs.home, home))];
            case 21:
                _6.sent();
                _6.label = 22;
            case 22:
                _f++;
                return [3 /*break*/, 19];
            case 23: return [4 /*yield*/, $.process.run(['sh', '-c', PLACE, 'sh', "".concat(into, "/").concat(id), "".concat(reportsDir(), "/").concat(id), "".concat(reportsDir(), "/_sync/claim-").concat(id)]).catch(function () { return ({ exitCode: -1 }); })];
            case 24:
                moved = _6.sent();
                if (moved.exitCode === 0)
                    changed += 1;
                _6.label = 25;
            case 25:
                _b++;
                return [3 /*break*/, 10];
            case 26:
                handed = aTrip(missingThere, was.tried);
                if (!handed.length) return [3 /*break*/, 41];
                out = "".concat(staging, "-out");
                return [4 /*yield*/, $.process.run(['mkdir', '-p', out])];
            case 27:
                _6.sent();
                ready_1 = [];
                _h = 0, handed_1 = handed;
                _6.label = 28;
            case 28:
                if (!(_h < handed_1.length)) return [3 /*break*/, 36];
                id = handed_1[_h];
                return [4 /*yield*/, $.process.run(['cp', '-Rp', "".concat(reportsDir(), "/").concat(id), "".concat(out, "/").concat(id)]).catch(function () { return ({ exitCode: -1 }); })];
            case 29:
                if ((_6.sent()).exitCode !== 0)
                    return [3 /*break*/, 35];
                _j = 0, _k = ['meta.json', 'report.md'];
                _6.label = 30;
            case 30:
                if (!(_j < _k.length)) return [3 /*break*/, 34];
                file = _k[_j];
                return [4 /*yield*/, readOr($, "".concat(out, "/").concat(id, "/").concat(file))];
            case 31:
                text = _6.sent();
                if (!text) return [3 /*break*/, 33];
                return [4 /*yield*/, $.fs.write("".concat(out, "/").concat(id, "/").concat(file), rehome(text, home, theirs.home))];
            case 32:
                _6.sent();
                _6.label = 33;
            case 33:
                _j++;
                return [3 /*break*/, 30];
            case 34:
                ready_1.push(id);
                _6.label = 35;
            case 35:
                _h++;
                return [3 /*break*/, 28];
            case 36:
                if (!ready_1.length) return [3 /*break*/, 38];
                return [4 /*yield*/, $.process.run(__spreadArray(['bash', '-c', PUSH, 'bash', out, mac, PUSH_THERE], ready_1, true), { timeoutMs: 300000 }).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
            case 37:
                _l = _6.sent();
                return [3 /*break*/, 39];
            case 38:
                _l = { exitCode: 0, stderr: '' };
                _6.label = 39;
            case 39:
                r = _l;
                if (!(r.exitCode !== 0)) return [3 /*break*/, 41];
                return [4 /*yield*/, log($, "results not handed to ".concat(mac, ": ").concat(r.stderr.trim().slice(0, 160)))];
            case 40:
                _6.sent();
                _6.label = 41;
            case 41:
                marked = 0;
                archived = {};
                _loop_2 = function (id, there) {
                    var here, wasArchived, theirsNow, mineNow, target, isSame, ok, theirsNext, r, kept;
                    return __generator(this, function (_7) {
                        switch (_7.label) {
                            case 0:
                                here = mine.get(id);
                                if (!here)
                                    return [2 /*return*/, "continue"];
                                wasArchived = (_3 = (_2 = was.archived) === null || _2 === void 0 ? void 0 : _2[id]) !== null && _3 !== void 0 ? _3 : 0;
                                theirsNow = broughtBackBy(parsedMeta(there.text), wasArchived);
                                mineNow = broughtBackBy(parsedMeta(here), wasArchived);
                                target = marksOf(mineNow, theirsNow);
                                isSame = marked < RESULTS_A_TRIP;
                                if (!(marked < RESULTS_A_TRIP)) return [3 /*break*/, 6];
                                if (!merged(here, theirsNow, wasArchived)) return [3 /*break*/, 2];
                                return [4 /*yield*/, markReport($, { id: id }, function (stored) { return marksOf(broughtBackBy(stored, wasArchived), theirsNow); }).then(function () { return true; }, function (err) { return (void log($, "result ".concat(id, " not marked from ").concat(mac, ": ").concat(String(err))), false); })];
                            case 1:
                                ok = _7.sent();
                                (isSame && (isSame = ok)), (changed += 1), (marked += 1);
                                _7.label = 2;
                            case 2:
                                theirsNext = merged(there.text, mineNow, wasArchived);
                                if (!theirsNext) return [3 /*break*/, 6];
                                return [4 /*yield*/, $.process.run(ssh(mac, markThere(id, there.sum)), { stdin: theirsNext, timeoutMs: 15000 }).catch(function (err) { return ({ exitCode: -1, stderr: String(err) }); })];
                            case 3:
                                r = _7.sent();
                                if (!(r.exitCode !== 0)) return [3 /*break*/, 5];
                                return [4 /*yield*/, log($, "result ".concat(id, " not marked on ").concat(mac, ": ").concat(r.exitCode === 3 ? 'changed there since' : r.stderr.trim().slice(0, 160)))];
                            case 4:
                                _7.sent();
                                _7.label = 5;
                            case 5:
                                (isSame && (isSame = r.exitCode === 0)), (marked += 1);
                                _7.label = 6;
                            case 6:
                                kept = isSame ? ((_4 = target.archived) !== null && _4 !== void 0 ? _4 : 0) : wasArchived;
                                if (kept)
                                    archived[id] = kept;
                                return [2 /*return*/];
                        }
                    });
                };
                _m = 0, _o = theirs.results;
                _6.label = 42;
            case 42:
                if (!(_m < _o.length)) return [3 /*break*/, 45];
                _p = _o[_m], id = _p[0], there = _p[1];
                return [5 /*yield**/, _loop_2(id, there)];
            case 43:
                _6.sent();
                _6.label = 44;
            case 44:
                _m++;
                return [3 /*break*/, 42];
            case 45:
                if (!changed) return [3 /*break*/, 47];
                return [4 /*yield*/, loadReports($)
                    // When each result still missing on either side was last tried; one that has come across is dropped from it the next trip
                ];
            case 46:
                _6.sent();
                _6.label = 47;
            case 47:
                tried = {};
                for (_q = 0, _r = __spreadArray(__spreadArray([], missingHere, true), missingThere, true); _q < _r.length; _q++) {
                    id = _r[_q];
                    if ((_5 = was.tried) === null || _5 === void 0 ? void 0 : _5[id])
                        tried[id] = was.tried[id];
                }
                for (_s = 0, _t = __spreadArray(__spreadArray([], wanted, true), handed, true); _s < _t.length; _s++) {
                    id = _t[_s];
                    tried[id] = now;
                }
                _v = (_u = $.fs).write;
                _w = [resultsPath(mac)];
                _y = (_x = JSON).stringify;
                _z = {};
                return [4 /*yield*/, $.clock.now()];
            case 48: return [4 /*yield*/, _v.apply(_u, _w.concat([_y.apply(_x, [(_z.syncedAt = _6.sent(), _z.triedAt = now, _z.brought = wanted.length, _z.handed = handed.length, _z.marked = marked, _z.archived = archived, _z.tried = tried, _z)])]))];
            case 49:
                _6.sent();
                if (!(wanted.length || handed.length || marked)) return [3 /*break*/, 51];
                return [4 /*yield*/, log($, "results with ".concat(mac, ": ").concat(wanted.length, " brought, ").concat(handed.length, " handed, ").concat(marked, " marked"))];
            case 50:
                _6.sent();
                _6.label = 51;
            case 51: return [2 /*return*/];
        }
    });
}); };
// The Macs that handed this one their chats lately, by the name each gave, and what the freshest called this Mac: its name here once
// other Macs' chats are listed beside its own
var pushedFrom = new Set();
