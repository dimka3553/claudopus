// Stats: reading Claude's records for the Stats tab (the sums and drawing are in ../../mods/claudopus/hooks/stats.tsx)
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
// ---- Stats: reading Claude's records (the sums and drawing are in ./stats) ----
var jqPath = '';
function sumOf($, path) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, jq, r;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = jqPath ? [jqPath] : ['/usr/bin/jq', '/opt/homebrew/bin/jq', '/usr/local/bin/jq', 'jq'];
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    jq = _a[_i];
                    return [4 /*yield*/, $.process.run([jq, '-cnR', '--argjson', 'gap', String(GAP), SUM_JQ, path]).catch(function () { return undefined; })];
                case 2:
                    r = _b.sent();
                    if (!r || r.exitCode !== 0)
                        return [3 /*break*/, 3];
                    jqPath = jq;
                    return [2 /*return*/, parsed(r.stdout.trim(), { s: [], u: [], d: [] })];
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: throw new Error('jq');
            }
        });
    });
}
// Where a chat's records are: its own folder under ~/.claude/projects, found by its id
function chatFolderOf($, home, chatId, known) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, root, _i, _b, entry;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = known;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, $.fs.stat("".concat(known, "/").concat(chatId, ".jsonl")).catch(function () { return undefined; })];
                case 1:
                    _a = (_c.sent());
                    _c.label = 2;
                case 2:
                    if (_a)
                        return [2 /*return*/, known];
                    root = "".concat(home, "/.claude/projects");
                    _i = 0;
                    return [4 /*yield*/, $.fs.list(root).catch(function () { return []; })];
                case 3:
                    _b = _c.sent();
                    _c.label = 4;
                case 4:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    entry = _b[_i];
                    if (entry.kind !== 'dir')
                        return [3 /*break*/, 6];
                    return [4 /*yield*/, $.fs.stat("".concat(root, "/").concat(entry.name, "/").concat(chatId, ".jsonl")).catch(function () { return undefined; })];
                case 5:
                    if (_c.sent())
                        return [2 /*return*/, "".concat(root, "/").concat(entry.name)];
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, ''];
            }
        });
    });
}
// Every transcript of one chat, summed, with what each was
function runsOf($_1, home_1, memory_1, chatId_1) {
    return __awaiter(this, arguments, void 0, function ($, home, memory, chatId, hint) {
        var cachePath, read, _a, cache, folder, subs, flowDirs, listed, _b, _c, chatFile, files, next, isChanged, at, flowTitle, _i, flowDirs_1, name_1, _d, _e, _f, _g;
        var _this = this;
        if (hint === void 0) { hint = ''; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    cachePath = "".concat(memory, "/stats/").concat(chatId, ".json");
                    _a = parsed;
                    return [4 /*yield*/, readOr($, cachePath)];
                case 1:
                    read = _a.apply(void 0, [_h.sent(), { files: {} }]);
                    cache = read.v === CACHE_V ? read : { files: {} };
                    return [4 /*yield*/, chatFolderOf($, home, chatId, hint || cache.folder)];
                case 2:
                    folder = _h.sent();
                    if (!folder)
                        return [2 /*return*/, []];
                    subs = "".concat(folder, "/").concat(chatId, "/subagents");
                    return [4 /*yield*/, $.fs.list("".concat(subs, "/workflows")).catch(function () { return []; })];
                case 3:
                    flowDirs = (_h.sent()).filter(function (e) { return e.kind === 'dir'; }).map(function (e) { return e.name; });
                    _b = [[]];
                    return [4 /*yield*/, $.fs.list(subs).catch(function () { return []; })];
                case 4:
                    _c = [__spreadArray.apply(void 0, _b.concat([(_h.sent()).map(function (e) { return (__assign(__assign({}, e), { dir: subs, flow: '' })); }), true]))];
                    return [4 /*yield*/, Promise.all(flowDirs.map(function (name) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, $.fs.list("".concat(subs, "/workflows/").concat(name)).catch(function () { return []; })];
                                case 1: return [2 /*return*/, (_a.sent()).map(function (e) { return (__assign(__assign({}, e), { dir: "".concat(subs, "/workflows/").concat(name), flow: name })); })];
                            }
                        }); }); }))];
                case 5:
                    listed = __spreadArray.apply(void 0, _c.concat([(_h.sent()).flat(), true])).filter(function (e) { return /^agent-\w+\.jsonl$/.test(e.name); });
                    return [4 /*yield*/, $.fs.list(folder).catch(function () { return []; })];
                case 6:
                    chatFile = (_h.sent()).find(function (e) { return e.name === "".concat(chatId, ".jsonl"); });
                    files = __spreadArray(__spreadArray([], listed.map(function (e) { return ({ path: "".concat(e.dir, "/").concat(e.name), size: e.size, mtime: e.mtimeMs, flow: e.flow, id: e.name.slice(6, -6) }); }), true), (chatFile ? [{ path: "".concat(folder, "/").concat(chatFile.name), size: chatFile.size, mtime: chatFile.mtimeMs, flow: '', id: '' }] : []), true);
                    next = { v: CACHE_V, folder: folder, files: {} };
                    isChanged = folder !== cache.folder;
                    at = 0;
                    _h.label = 7;
                case 7:
                    if (!(at < files.length)) return [3 /*break*/, 10];
                    return [4 /*yield*/, Promise.all(files.slice(at, at + 6).map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                            var was, _a, _b;
                            var _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        was = cache.files[f.path];
                                        if (!(was && was.size === f.size && was.mtime === f.mtime)) return [3 /*break*/, 1];
                                        next.files[f.path] = was;
                                        return [3 /*break*/, 3];
                                    case 1:
                                        _a = next.files;
                                        _b = f.path;
                                        _c = { size: f.size, mtime: f.mtime };
                                        return [4 /*yield*/, sumOf($, f.path)];
                                    case 2:
                                        _a[_b] = (_c.sum = _d.sent(), _c);
                                        isChanged = true;
                                        _d.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 8:
                    _h.sent();
                    _h.label = 9;
                case 9:
                    at += 6;
                    return [3 /*break*/, 7];
                case 10:
                    if (!(isChanged || Object.keys(cache.files).length !== files.length)) return [3 /*break*/, 12];
                    return [4 /*yield*/, $.fs.write("".concat(memory, "/stats/").concat(chatId, ".json"), JSON.stringify(next)).catch(function () { return undefined; })];
                case 11:
                    _h.sent();
                    _h.label = 12;
                case 12:
                    flowTitle = new Map();
                    _i = 0, flowDirs_1 = flowDirs;
                    _h.label = 13;
                case 13:
                    if (!(_i < flowDirs_1.length)) return [3 /*break*/, 16];
                    name_1 = flowDirs_1[_i];
                    _e = (_d = flowTitle).set;
                    _f = [name_1];
                    _g = parsed;
                    return [4 /*yield*/, readOr($, "".concat(memory, "/flows/").concat(name_1, ".json"))];
                case 14:
                    _e.apply(_d, _f.concat([_g.apply(void 0, [_h.sent(), {}]).title || 'Workflow']));
                    _h.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 13];
                case 16: return [2 /*return*/, Promise.all(files.map(function (f) { return __awaiter(_this, void 0, void 0, function () {
                        var sum, meta, _a;
                        var _b, _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    sum = (_c = (_b = next.files[f.path]) === null || _b === void 0 ? void 0 : _b.sum) !== null && _c !== void 0 ? _c : { s: [], u: [], d: [] };
                                    if (!f.id)
                                        return [2 /*return*/, { id: chatId, kind: 'chat', parent: '', title: 'This chat', isFinished: false, sum: sum }];
                                    _a = parsed;
                                    return [4 /*yield*/, readOr($, f.path.replace(/\.jsonl$/, '.meta.json'))];
                                case 1:
                                    meta = _a.apply(void 0, [_k.sent(), {}]);
                                    if (f.flow)
                                        return [2 /*return*/, { id: f.id, kind: 'flow', parent: f.flow, title: (_d = flowTitle.get(f.flow)) !== null && _d !== void 0 ? _d : 'Workflow', isFinished: Boolean(meta.finished) || ((_f = (_e = sum.s.at(-1)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : 0) < Date.now() - GAP, sum: sum }];
                                    return [2 /*return*/, { id: f.id, kind: ((_g = meta.spawnDepth) !== null && _g !== void 0 ? _g : 1) > 1 ? 'helper' : 'work', parent: (_h = meta.parentAgentId) !== null && _h !== void 0 ? _h : '', title: (_j = meta.description) !== null && _j !== void 0 ? _j : 'Background work', isFinished: Boolean(meta.finished), sum: sum }];
                            }
                        });
                    }); }))];
            }
        });
    });
}
// The chats the mod has kept work for (finished/<chat id>.json), and this one
function chatsKept($, memory, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var kept;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.fs.list("".concat(memory, "/finished")).catch(function () { return []; })];
                case 1:
                    kept = (_a.sent()).map(function (e) { var _a, _b; return (_b = (_a = /^(.+)\.json$/.exec(e.name)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''; }).filter(Boolean);
                    return [2 /*return*/, __spreadArray([], new Set(__spreadArray([chatId], kept, true)), true)];
            }
        });
    });
}
function loadStats($, scope, home, memory, chatId, hint, now) {
    return __awaiter(this, void 0, void 0, function () {
        var was, ids, _a, runs, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (reading.has(scope) || !chatId)
                        return [2 /*return*/];
                    was = held.get(scope);
                    if (was && now - was.at < READ_EVERY)
                        return [2 /*return*/];
                    reading.add(scope);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, loadMemorySizes($, memory).catch(function () { return undefined; })];
                case 2:
                    _c.sent();
                    if (!(scope === 'chat')) return [3 /*break*/, 3];
                    _a = [chatId];
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, chatsKept($, memory, chatId)];
                case 4:
                    _a = _c.sent();
                    _c.label = 5;
                case 5:
                    ids = _a;
                    return [4 /*yield*/, Promise.all(ids.map(function (id) { return runsOf($, home, memory, id, id === chatId ? hint : ''); }))];
                case 6:
                    runs = (_c.sent()).flat();
                    held.set(scope, { runs: runs, at: now });
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _c.sent();
                    held.set(scope, { runs: (_b = was === null || was === void 0 ? void 0 : was.runs) !== null && _b !== void 0 ? _b : [], at: now, error: String(err_1).includes('jq') ? 'Stats reads Claude’s records with jq, and jq was not found on this Mac.' : "The records could not be read: ".concat(String(err_1)) });
                    return [3 /*break*/, 9];
                case 8:
                    reading.delete(scope);
                    $.ui.invalidate('ui.render');
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function loadMemorySizes($, memory) {
    return __awaiter(this, void 0, void 0, function () {
        var names, du, kb, index, subjects, reports, parts, _a, _b, bytes;
        var _c, _d, _e, _f, _g, _h;
        var _this = this;
        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    names = function (folder) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, $.fs.list("".concat(memory, "/").concat(folder)).catch(function () { return []; })];
                            case 1: return [2 /*return*/, (_a.sent()).filter(function (e) { return !e.name.startsWith('.'); })
                                // Sizes as the disk counts them, the whole of each folder
                            ];
                        }
                    }); }); };
                    return [4 /*yield*/, $.process.run(__spreadArray(['du', '-skL'], ['index.md', 'streams', 'words', 'asks', 'reports', 'finished', 'flows', 'stats', 'thumbs'].map(function (one) { return "".concat(memory, "/").concat(one); }), true)).catch(function () { return undefined; })];
                case 1:
                    du = _u.sent();
                    kb = new Map(((_j = du === null || du === void 0 ? void 0 : du.stdout) !== null && _j !== void 0 ? _j : '').split('\n').map(function (row) { return row.split('\t'); }).filter(function (_a) {
                        var n = _a[0], path = _a[1];
                        return n && path;
                    }).map(function (_a) {
                        var n = _a[0], path = _a[1];
                        return [String(path).slice(memory.length + 1), Number(n) * 1024];
                    }));
                    return [4 /*yield*/, $.fs.read("".concat(memory, "/index.md")).catch(function () { return ''; })];
                case 2:
                    index = _u.sent();
                    subjects = index.split('\n').filter(function (row) { return row.startsWith('- '); }).length;
                    return [4 /*yield*/, names('reports')];
                case 3:
                    reports = _u.sent();
                    _a = [{ name: 'Subjects', count: subjects, bytes: (_k = kb.get('index.md')) !== null && _k !== void 0 ? _k : 0 }];
                    _c = { name: 'Briefs' };
                    return [4 /*yield*/, names('streams')];
                case 4:
                    _a = _a.concat([
                        (_c.count = (_u.sent()).length, _c.bytes = (_l = kb.get('streams')) !== null && _l !== void 0 ? _l : 0, _c)
                    ]);
                    _d = { name: 'Your words, by chat' };
                    return [4 /*yield*/, names('words')];
                case 5:
                    _a = _a.concat([
                        (_d.count = (_u.sent()).length, _d.bytes = (_m = kb.get('words')) !== null && _m !== void 0 ? _m : 0, _d)
                    ]);
                    _e = { name: 'Asks and answers, by chat' };
                    return [4 /*yield*/, names('asks')];
                case 6:
                    _a = _a.concat([
                        (_e.count = (_u.sent()).length, _e.bytes = (_o = kb.get('asks')) !== null && _o !== void 0 ? _o : 0, _e),
                        { name: 'Results', count: reports.filter(function (e) { return e.kind === 'dir'; }).length, bytes: (_p = kb.get('reports')) !== null && _p !== void 0 ? _p : 0 }
                    ]);
                    _f = { name: 'Finished work, by chat' };
                    return [4 /*yield*/, names('finished')];
                case 7:
                    _a = _a.concat([
                        (_f.count = (_u.sent()).length, _f.bytes = (_q = kb.get('finished')) !== null && _q !== void 0 ? _q : 0, _f)
                    ]);
                    _g = { name: 'Workflow runs' };
                    return [4 /*yield*/, names('flows')];
                case 8:
                    _a = _a.concat([
                        (_g.count = (_u.sent()).length, _g.bytes = (_r = kb.get('flows')) !== null && _r !== void 0 ? _r : 0, _g)
                    ]);
                    _h = { name: 'Thumbnails and sums' };
                    return [4 /*yield*/, names('thumbs')];
                case 9:
                    _b = (_u.sent()).length;
                    return [4 /*yield*/, names('stats')];
                case 10:
                    parts = _a.concat([
                        (_h.count = _b + (_u.sent()).length, _h.bytes = ((_s = kb.get('thumbs')) !== null && _s !== void 0 ? _s : 0) + ((_t = kb.get('stats')) !== null && _t !== void 0 ? _t : 0), _h)
                    ]);
                    bytes = __spreadArray([], kb.values(), true).reduce(function (sum, n) { return sum + n; }, 0);
                    memoryHeld.now = { parts: parts, bytes: bytes };
                    return [2 /*return*/];
            }
        });
    });
}
// Stats: what the work added up to, in a tab of its own, opened in front like Results
var STATS_PANE = 'stats';
var STATS_TITLE = 'Stats';
var statsRead = function ($, scope) { return __awaiter(_this, void 0, void 0, function () {
    var home, id, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                home = (_c = (_d.sent())) !== null && _c !== void 0 ? _c : '';
                return [4 /*yield*/, read($, me)];
            case 2:
                id = (_d.sent()).id;
                _a = loadStats;
                _b = [$, scope, home, dir, id, "".concat(home, "/.claude/projects/").concat(cwd.replace(/[^a-zA-Z0-9]/g, '-'))];
                return [4 /*yield*/, $.clock.now()];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.sent()]))];
            case 4:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var openStats = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                void statsRead($, statsShown.scope).catch(function (err) { return log($, "stats not read: ".concat(String(err))); });
                return [4 /*yield*/, front($, STATS_PANE, STATS_TITLE)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var statsButton = function ($, ui) { return (<ui.Box key="stats-button" flexShrink={0}>
    <ui.Button key={"stats-open-".concat(presses)} label="Stats" onPress={function () { return void openStats($).catch(function (err) { return log($, "stats not opened: ".concat(String(err))); }); }}/>
  </ui.Box>); };
