// What a task made, as things the person presses to open: on its card a row of small items, in its Details and in its result
// tiles side by side
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
// ---- What a task made ----
// Each kind of file a tile is drawn for: how it is told by its name, its word for one and for several, and its badge
var MADE_KINDS = [
    { kind: 'picture', test: /\.(png|jpe?g|gif|webp|svg|heic)$/i, one: 'picture', many: 'pictures', badge: 'IMG', color: '#3A78C9' },
    { kind: 'video', test: /\.(mp4|mov|webm|m4v)$/i, one: 'video', many: 'videos', badge: 'VID', color: '#8B5CF6' },
    { kind: 'pdf', test: /\.pdf$/i, one: 'PDF', many: 'PDFs', badge: 'PDF', color: '#D0473E' },
    { kind: 'sheet', test: /\.(xlsx?|csv|numbers)$/i, one: 'spreadsheet', many: 'spreadsheets', badge: 'XLS', color: '#23955A' },
    { kind: 'doc', test: /\.(docx?|pages|pptx?|key|md|txt|html?)$/i, one: 'document', many: 'documents', badge: 'DOC', color: '#6B6A65' },
    { kind: 'file', test: /^/, one: 'file', many: 'files', badge: '', color: '#6B6A65' },
];
var madeKind = function (path) { var _a; return (_a = MADE_KINDS.find(function (one) { return one.test.test(path); })) !== null && _a !== void 0 ? _a : MADE_KINDS[MADE_KINDS.length - 1]; };
var madeKindOf = function (kind) { var _a; return (_a = MADE_KINDS.find(function (one) { return one.kind === kind; })) !== null && _a !== void 0 ? _a : MADE_KINDS[MADE_KINDS.length - 1]; };
// A document that is plain text is code when it sits in a repo and the result does not name it
var TEXT_DOC = /\.(md|txt|html?|csv)$/i;
// The most paths a task's card keeps of what its steps wrote or named, and the most looked at when its files are listed
var WROTE_KEPT = 300;
var MADE_LOOKED = 300;
// The most things a card's row names before "and N more", and the most tiles a Files part draws before the same
var CHIPS_MOST = 6;
var TILES_MOST = 24;
// The most small copies one Files part has made: the first tiles only, the rest keep their icon
var FACES_MOST = 12;
// A tile's picture in the panel's pixels, and the most characters every tile's small copy together takes in one drawing
var TILE_W = 112;
var TILE_H = 84;
// How a tile is laid in the pane: its box in columns, and its picture drawn a little smaller than it is made, so three sit side by
// side in a narrow pane with a gap between
var TILE_COLUMNS = 11;
var TILE_SHOWN_W = 96;
var TILE_SHOWN_H = 72;
var TILE_CHARS = 90000;
var TILE_THUMB_BYTES = 7000;
// A small copy's own size: one and a half times the tile's
var FACE_W = 168;
var FACE_H = 126;
// The paths one tool call writes or names: the file a file tool is given, and in a command the files of a kind a tile is drawn for
var wroteBy = function (e) {
    var _a, _b, _c;
    var input = e;
    if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(e.tool))
        return [String((_b = (_a = input.file_path) !== null && _a !== void 0 ? _a : input.notebook_path) !== null && _b !== void 0 ? _b : '')].filter(function (path) { return path.startsWith('/'); });
    if (e.tool === 'Bash')
        return namedPaths(String((_c = input.command) !== null && _c !== void 0 ? _c : '')).filter(function (path) { return madeKind(path).kind !== 'file' && !TEXT_DOC.test(path); });
    return [];
};
// A task's card with what this call writes added to what it has written, each path once, the newest kept
var withWrote = function (one, e) {
    var _a;
    var paths = wroteBy(e).filter(function (path) { var _a; return !((_a = one.wrote) !== null && _a !== void 0 ? _a : []).includes(path); });
    return paths.length ? __assign(__assign({}, one), { wrote: __spreadArray(__spreadArray([], ((_a = one.wrote) !== null && _a !== void 0 ? _a : []), true), paths, true).slice(-WROTE_KEPT) }) : one;
};
// The repo a folder is in, by the folder: looked up once
var repoOf = new Map();
var repoTop = function ($, folder) { return __awaiter(_this, void 0, void 0, function () {
    var r, top;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (repoOf.has(folder))
                    return [2 /*return*/, (_a = repoOf.get(folder)) !== null && _a !== void 0 ? _a : ''];
                return [4 /*yield*/, $.process.run(['git', '-C', folder, 'rev-parse', '--show-toplevel'], { timeoutMs: 4000 }).catch(function () { return undefined; })];
            case 1:
                r = _b.sent();
                top = (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout.trim() : '';
                if (repoOf.size > 200)
                    repoOf.clear();
                repoOf.set(folder, top);
                return [2 /*return*/, top];
        }
    });
}); };
// How many lines a task added to and took from the files it changed in one repo, against the repo as it stood when the task began:
// only the files it wrote itself are counted, so what a merge brought in is left out. A file new since then counts every line, as
// does every file of a repo with no commit from before the task (one it made); a file it deleted is no longer there to count
var COUNT_LINES = 'cd "$1" || exit 1; since=$2; shift 2; base=$(git rev-list -1 --before="$since" HEAD 2>/dev/null); [ -n "$base" ] || base=4b825dc642cb6eb9a060e54bf8d69288fbee4904; for f in "$@"; do if git cat-file -e "$base:$f" 2>/dev/null; then git diff --numstat "$base" -- "$f"; elif [ -f "$f" ]; then printf \'%s\\t0\\t%s\\n\' "$(grep -c \'\' "$f")" "$f"; fi; done';
var codeOf = function ($, byTop, since) { return __awaiter(_this, void 0, void 0, function () {
    var count, plus, minus, _loop_1, _i, byTop_1, _a, top_1, paths;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                count = 0;
                plus = 0;
                minus = 0;
                _loop_1 = function (top_1, paths) {
                    var r, _c, _d, line, _e, _f, added, _g, taken;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', COUNT_LINES, 'sh', top_1, String(Math.floor(since / 1000))], paths.map(function (path) { return path.slice(top_1.length + 1); }), true), { timeoutMs: 8000 }).catch(function () { return undefined; })];
                            case 1:
                                r = _h.sent();
                                if ((r === null || r === void 0 ? void 0 : r.exitCode) !== 0)
                                    return [2 /*return*/, "continue"];
                                for (_c = 0, _d = rows(r.stdout); _c < _d.length; _c++) {
                                    line = _d[_c];
                                    _e = line.split('\t'), _f = _e[0], added = _f === void 0 ? '' : _f, _g = _e[1], taken = _g === void 0 ? '' : _g;
                                    if (!/^(\d+|-)$/.test(added))
                                        continue;
                                    count += 1;
                                    plus += Number(added) || 0;
                                    minus += Number(taken) || 0;
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, byTop_1 = byTop;
                _b.label = 1;
            case 1:
                if (!(_i < byTop_1.length)) return [3 /*break*/, 4];
                _a = byTop_1[_i], top_1 = _a[0], paths = _a[1];
                return [5 /*yield**/, _loop_1(top_1, paths)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, count ? { count: count, plus: plus, minus: minus } : undefined];
        }
    });
}); };
// Links a result names on a line that says it made or put them up, the first few: a page it put online, a report it added. A page
// it only cites is no thing it made
var MADE_LINK_LINE = /\b(made|added|created|published|deployed|live|online|posted|uploaded|opened|pushed|report|pull request|PR|release[sd]?)\b/i;
var linksIn = function (text) {
    return __spreadArray([], new Set(text.split('\n').filter(function (line) { return MADE_LINK_LINE.test(line); }).flatMap(function (line) { var _a; return ((_a = line.match(/https?:\/\/[^\s`'"()<>[\]{}|,;*]+/g)) !== null && _a !== void 0 ? _a : []).map(function (link) { return link.replace(/[.:!?]+$/, ''); }); })), true).slice(0, 3);
};
var linkName = function (link) {
    var _a, _b;
    var _c = link.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/'), _d = _c[0], host = _d === void 0 ? '' : _d, rest = _c.slice(1);
    var last = (_a = rest.at(-1)) !== null && _a !== void 0 ? _a : '';
    // "os.example.com/reports/362" is "os report 362": the site's first word, the kind of page in the singular, and the page
    var kind = rest.length > 1 ? ((_b = rest.at(-2)) !== null && _b !== void 0 ? _b : '').replace(/(?<=\w{3})s$/, '') : '';
    return last ? "".concat(host.replace(/^www\./, '').split('.')[0], " ").concat(kind ? "".concat(kind, " ") : '').concat(last).slice(0, 40) : host.replace(/^www\./, '');
};
// What a task made: the files its steps wrote or its commands named, and the files and links its result names, that are there and
// were made since it began. A picture, video, PDF, spreadsheet or document is a thing of its own, as is any file the result names;
// the other files it wrote inside a repo are its code, counted and never listed
var madeBy = function ($_1, wrote_1, answer_1, since_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, wrote_1, answer_1, since_1], args_1, true), void 0, function ($, wrote, answer, since, isDated) {
        var named, made, byTop, seen, isThing, newest, _a, _b, given, path, isNamed, stat, kind, top_2, _c, order, _d, _e, _f, n, given, _g, _h, link, code, _j;
        var _k;
        if (isDated === void 0) { isDated = true; }
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    named = namedPaths(answer);
                    made = [];
                    byTop = new Map();
                    seen = new Set();
                    isThing = function (path) { return madeKind(path).kind !== 'file' && !TEXT_DOC.test(path); };
                    newest = __spreadArray([], wrote, true).reverse();
                    _a = 0, _b = __spreadArray(__spreadArray(__spreadArray([], named, true), newest.filter(isThing), true), newest.filter(function (path) { return !isThing(path); }), true).slice(0, MADE_LOOKED);
                    _l.label = 1;
                case 1:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    given = _b[_a];
                    path = given.replace(/^\/private(?=\/(tmp|var)\/)/, '');
                    if (seen.has(path))
                        return [3 /*break*/, 6];
                    seen.add(path);
                    isNamed = named.includes(given);
                    return [4 /*yield*/, $.fs.stat(path).catch(function () { return undefined; })];
                case 2:
                    stat = _l.sent();
                    if (!stat || stat.kind !== 'file' || (isDated && stat.mtimeMs < since - 5000))
                        return [3 /*break*/, 6];
                    kind = madeKind(path).kind;
                    if (!(kind === 'file' || (TEXT_DOC.test(path) && !isNamed))) return [3 /*break*/, 4];
                    return [4 /*yield*/, repoTop($, path.slice(0, path.lastIndexOf('/')))];
                case 3:
                    _c = _l.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = '';
                    _l.label = 5;
                case 5:
                    top_2 = _c;
                    if (top_2 && path.startsWith("".concat(top_2, "/"))) {
                        byTop.set(top_2, __spreadArray(__spreadArray([], ((_k = byTop.get(top_2)) !== null && _k !== void 0 ? _k : []), true), [path], false));
                        return [3 /*break*/, 6];
                    }
                    if ((kind !== 'file' && !TEXT_DOC.test(path)) || isNamed) {
                        // What a step only wrote into a temporary folder or Claudopus's own memory is its scratch, not what it made
                        if (!isNamed && (TEMP.test(path) || (dir && path.startsWith("".concat(dir, "/")))))
                            return [3 /*break*/, 6];
                        made.push({ path: path, name: fileName(path), kind: kind, at: Math.round(stat.mtimeMs) });
                    }
                    _l.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 1];
                case 7:
                    order = new Map();
                    for (_d = 0, _e = __spreadArray(__spreadArray([], named, true), wrote, true).entries(); _d < _e.length; _d++) {
                        _f = _e[_d], n = _f[0], given = _f[1];
                        if (!order.has(given.replace(/^\/private(?=\/(tmp|var)\/)/, '')))
                            order.set(given.replace(/^\/private(?=\/(tmp|var)\/)/, ''), n);
                    }
                    made.sort(function (a, b) { var _a, _b; return ((_a = order.get(a.path)) !== null && _a !== void 0 ? _a : 0) - ((_b = order.get(b.path)) !== null && _b !== void 0 ? _b : 0); });
                    for (_g = 0, _h = linksIn(answer); _g < _h.length; _g++) {
                        link = _h[_g];
                        made.push({ path: link, name: linkName(link), kind: 'link' });
                    }
                    if (!byTop.size) return [3 /*break*/, 9];
                    return [4 /*yield*/, codeOf($, byTop, since).catch(function () { return undefined; })];
                case 8:
                    _j = _l.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _j = undefined;
                    _l.label = 10;
                case 10:
                    code = _j;
                    return [2 /*return*/, __assign({ made: made }, (code ? { code: code } : {}))];
            }
        });
    });
};
// What a card draws: its task's files as last listed, and listed again, out of the drawing, once it has made a step since (a file a
// step writes is there only after the step), at most every MADE_AGAIN while it works, and once it ends. The listings take turns, so a
// panel opened on many cards lists them one after another
var MADE_AGAIN = 20000;
var MADE_HOLD = 15000;
// What a listing shows: nothing at all is the same as not listed yet
var shownOf = function (files) { return (files && (files.made.length || files.code) ? JSON.stringify(files) : ''); };
var madeOf = new Map();
var madeLoading = new Set();
var madeTurn = Promise.resolve();
var madeNow = function ($, one) {
    var _a, _b, _c;
    if (one.chat)
        return undefined;
    // While it works a helper's edits change no count of the task's own, so time is part of what is listed
    var key = "".concat((_a = one.steps) !== null && _a !== void 0 ? _a : 0, ":").concat(((_b = one.wrote) !== null && _b !== void 0 ? _b : []).length, ":").concat(one.answer.length, ":").concat(one.status, ":").concat(one.status === 'working' ? Math.floor(Date.now() / MADE_AGAIN) : '');
    var was = madeOf.get(one.id);
    var isDue = !was || (was.key !== key && (one.status !== 'working' || Date.now() - was.at >= MADE_AGAIN));
    if (isDue && !madeLoading.has(one.id) && (((_c = one.wrote) !== null && _c !== void 0 ? _c : []).length || one.answer)) {
        madeLoading.add(one.id);
        var run = madeTurn.then(function () { var _a, _b; return madeBy($, (_a = one.wrote) !== null && _a !== void 0 ? _a : [], one.status === 'working' ? '' : one.answer, (_b = one.begunAt) !== null && _b !== void 0 ? _b : one.startedAt); });
        // A listing that never ends (a file on a volume that does not answer) holds the others up no longer than MADE_HOLD
        madeTurn = Promise.race([run.catch(function () { return undefined; }), $.clock.sleep(MADE_HOLD)]);
        var isNew_1 = false;
        void run
            .then(function (files) {
            var _a, _b;
            if (madeOf.size > 200)
                madeOf.delete((_a = madeOf.keys().next().value) !== null && _a !== void 0 ? _a : '');
            isNew_1 = shownOf(files) !== shownOf((_b = madeOf.get(one.id)) === null || _b === void 0 ? void 0 : _b.files);
            madeOf.set(one.id, { key: key, at: Date.now(), files: files });
        })
            .catch(function (err) { return log($, "files of ".concat(one.id, " not listed: ").concat(String(err))); })
            // The panel is drawn again only when what it shows changed
            .finally(function () { return (madeLoading.delete(one.id), isNew_1 ? redraw($) : undefined); });
    }
    return was === null || was === void 0 ? void 0 : was.files;
};
// What a result's pane draws: what its task made, kept with the result when it was saved. One saved before that is listed once, out
// of the drawing (which writes nothing), from its task's card while that is kept and else from the paths its text names. A picture
// the result kept a copy of stands in for one that is no longer where it was
var madeOfOld = new Map();
var madeOfReport = function ($, r, text) {
    var _a, _b;
    var files = (_a = r.made) !== null && _a !== void 0 ? _a : madeOfOld.get(r.id);
    if (!files && !madeLoading.has(r.id)) {
        madeLoading.add(r.id);
        void (function () { return __awaiter(_this, void 0, void 0, function () {
            var one, listed;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, read($, todos)];
                    case 1:
                        one = (_d.sent()).find(function (card) { return card.id === r.agent; });
                        return [4 /*yield*/, madeBy($, (_a = one === null || one === void 0 ? void 0 : one.wrote) !== null && _a !== void 0 ? _a : [], text, one ? ((_b = one.begunAt) !== null && _b !== void 0 ? _b : one.startedAt) : 0, Boolean(one)).catch(function () { return ({ made: [] }); })];
                    case 2:
                        listed = _d.sent();
                        if (madeOfOld.size > 200)
                            madeOfOld.delete((_c = madeOfOld.keys().next().value) !== null && _c !== void 0 ? _c : '');
                        madeOfOld.set(r.id, listed);
                        return [2 /*return*/];
                }
            });
        }); })()
            .catch(function (err) { return log($, "files of result ".concat(r.id, " not listed: ").concat(String(err))); })
            .finally(function () { return (madeLoading.delete(r.id), redraw($)); });
    }
    var made = (_b = files === null || files === void 0 ? void 0 : files.made) !== null && _b !== void 0 ? _b : [];
    var names = new Set(made.map(function (one) { return one.name; }));
    var copies = r.files.filter(function (file) { return isInside(file) && !names.has(fileName(file)); }).map(function (file) { return ({ path: "".concat(reportPath(r), "/").concat(file), name: fileName(file), kind: madeKind(file).kind }); });
    return __assign(__assign({}, (files !== null && files !== void 0 ? files : {})), { made: __spreadArray(__spreadArray([], made, true), copies, true) });
};
var faces = new Map();
var facesLoading = new Set();
// A file's small copy is known by the file as it stands: written again, it is made again
var faceKey = function (one) { var _a; return "".concat(one.path, ":").concat((_a = one.at) !== null && _a !== void 0 ? _a : 0); };
// How many small copies have been made, which a drawing's keys carry
var facesMade = 0;
var qlMade = 0;
var makeFace = function ($, one) { return __awaiter(_this, void 0, void 0, function () {
    var stat, to, from, scratch, _a, _b, _c, _d, said_1, _e, _f, width, _g, height, isTall, mid, _i, _h, quality, read;
    var _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                if (one.kind === 'link' || one.kind === 'file' || /\.svg$/i.test(one.path))
                    return [2 /*return*/, null];
                return [4 /*yield*/, $.fs.stat(one.path).catch(function () { return undefined; })];
            case 1:
                stat = _o.sent();
                if (!stat || stat.kind !== 'file')
                    return [2 /*return*/, null];
                to = "".concat(dir, "/thumbs/tile-").concat(slug(one.path).slice(-60), "-").concat(mark(one.path).replace(':', '-'), "-").concat(Math.round(stat.mtimeMs), ".jpg");
                return [4 /*yield*/, $.fs.exists(to)];
            case 2:
                if (!!(_o.sent())) return [3 /*break*/, 19];
                return [4 /*yield*/, $.process.run(['mkdir', '-p', "".concat(dir, "/thumbs")])];
            case 3:
                _o.sent();
                from = one.path;
                scratch = '';
                // Plain text has no picture worth a tile (Quick Look draws its lines too small to read): it keeps its icon
                if (TEXT_DOC.test(one.path) && !/\.html?$/i.test(one.path))
                    return [2 /*return*/, null];
                if (!(one.kind !== 'picture' && one.kind !== 'pdf')) return [3 /*break*/, 9];
                // Quick Look is the Mac's own: elsewhere the tile keeps its icon
                if (isLinux)
                    return [2 /*return*/, null];
                _b = (_a = "".concat(dir, "/thumbs/ql-")).concat;
                _d = (_c = Math).round;
                return [4 /*yield*/, $.clock.now()];
            case 4:
                scratch = _b.apply(_a, [_d.apply(_c, [_o.sent()]), "-"]).concat((qlMade += 1));
                return [4 /*yield*/, $.process.run(['mkdir', '-p', scratch])];
            case 5:
                _o.sent();
                return [4 /*yield*/, $.process.run(['qlmanage', '-t', '-s', '320', '-o', scratch, one.path], { timeoutMs: 15000 }).catch(function () { return undefined; })];
            case 6:
                _o.sent();
                from = "".concat(scratch, "/").concat(fileName(one.path), ".png");
                return [4 /*yield*/, $.fs.exists(from)];
            case 7:
                if (!!(_o.sent())) return [3 /*break*/, 9];
                return [4 /*yield*/, $.process.run(['rm', '-rf', scratch]).catch(function () { return undefined; })];
            case 8: return [2 /*return*/, (_o.sent(), null)];
            case 9: return [4 /*yield*/, $.process.run([sips($), '-g', 'pixelWidth', '-g', 'pixelHeight', from], { timeoutMs: 15000 }).catch(function () { return undefined; })];
            case 10:
                said_1 = (_k = (_j = (_o.sent())) === null || _j === void 0 ? void 0 : _j.stdout) !== null && _k !== void 0 ? _k : '';
                _e = [/pixelWidth: (\d+)/, /pixelHeight: (\d+)/].map(function (re) { var _a, _b; return Number((_b = (_a = re.exec(said_1)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0); }), _f = _e[0], width = _f === void 0 ? 0 : _f, _g = _e[1], height = _g === void 0 ? 0 : _g;
                isTall = width > 0 && height / width > FACE_H / FACE_W;
                mid = "".concat(to, ".png");
                if (!isTall) return [3 /*break*/, 12];
                return [4 /*yield*/, $.process.run([sips($), '--resampleWidth', String(FACE_W), '-s', 'format', 'png', from, '--out', mid], { timeoutMs: 15000 }).catch(function () { return undefined; })];
            case 11:
                _o.sent();
                _o.label = 12;
            case 12:
                _i = 0, _h = ['50', '35', '20'];
                _o.label = 13;
            case 13:
                if (!(_i < _h.length)) return [3 /*break*/, 17];
                quality = _h[_i];
                return [4 /*yield*/, $.process
                        .run(isTall ? [sips($), '-c', String(FACE_H), String(FACE_W), '--cropOffset', '0', '0', '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, mid, '--out', to] : [sips($), '-Z', String(FACE_W), '-s', 'format', 'jpeg', '-s', 'formatOptions', quality, from, '--out', to], { timeoutMs: 15000 })
                        .catch(function () { return undefined; })];
            case 14:
                _o.sent();
                return [4 /*yield*/, $.fs.stat(to).catch(function () { return undefined; })];
            case 15:
                if (((_m = (_l = (_o.sent())) === null || _l === void 0 ? void 0 : _l.size) !== null && _m !== void 0 ? _m : Infinity) <= TILE_THUMB_BYTES)
                    return [3 /*break*/, 17];
                _o.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 13];
            case 17: return [4 /*yield*/, $.process.run(__spreadArray(['rm', '-rf', mid], (scratch ? [scratch] : []), true)).catch(function () { return undefined; })];
            case 18:
                _o.sent();
                _o.label = 19;
            case 19: return [4 /*yield*/, $.fs.read(to, { as: 'bytes' }).catch(function () { return undefined; })];
            case 20:
                read = (_o.sent());
                return [2 /*return*/, (read === null || read === void 0 ? void 0 : read.base64) && read.base64.length < TILE_THUMB_BYTES * 2 ? { base64: read.base64 } : null];
        }
    });
}); };
// The small copies as made so far; the missing ones are made out of the drawing, one after another, and the drawing drawn again
var facesNow = function ($, list) {
    var missing = list.filter(function (one) { return !faces.has(faceKey(one)) && !facesLoading.has(faceKey(one)); });
    if (missing.length) {
        for (var _i = 0, missing_1 = missing; _i < missing_1.length; _i++) {
            var one = missing_1[_i];
            facesLoading.add(faceKey(one));
        }
        void (function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, missing_2, one, face;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, missing_2 = missing;
                        _b.label = 1;
                    case 1:
                        if (!(_i < missing_2.length)) return [3 /*break*/, 4];
                        one = missing_2[_i];
                        return [4 /*yield*/, makeFace($, one).catch(function () { return null; })];
                    case 2:
                        face = _b.sent();
                        if (faces.size > 300)
                            faces.delete((_a = faces.keys().next().value) !== null && _a !== void 0 ? _a : '');
                        faces.set(faceKey(one), face);
                        facesMade += 1;
                        facesLoading.delete(faceKey(one));
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); })()
            .catch(function (err) { return log($, "small copies of files not made: ".concat(String(err))); })
            .finally(function () { return (missing.forEach(function (one) { return facesLoading.delete(faceKey(one)); }), redraw($)); });
    }
    return faces;
};
// ---- How they are drawn ----
var SVG_FONT = 'font-family="-apple-system,Helvetica,sans-serif"';
// A page with its kind on it, a link, a branch: what a file is, drawn small
var pageIcon = function (badge, color) {
    return "<path d=\"M4.5 1.5h13l7 7v21a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1v-27a1 1 0 0 1 1-1z\" fill=\"#3b3b39\" stroke=\"#9a9890\" stroke-width=\"1.2\"/><path d=\"M17.5 1.5v7h7\" fill=\"none\" stroke=\"#9a9890\" stroke-width=\"1.2\"/>".concat(badge ? "<rect x=\"1\" y=\"15\" width=\"".concat(badge.length > 3 ? 22 : 19, "\" height=\"10\" rx=\"2\" fill=\"").concat(color, "\"/><text x=\"").concat(badge.length > 3 ? 12 : 10.5, "\" y=\"22.6\" font-size=\"7\" ").concat(SVG_FONT, " font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">").concat(badge, "</text>") : '');
};
var LINK_ICON = '<rect x="2.5" y="4.5" width="23" height="23" rx="5" fill="#3b3b39" stroke="#9a9890" stroke-width="1.2"/><path d="M11 13.5h-1.5a3.5 3.5 0 0 0 0 7H11M17 13.5h1.5a3.5 3.5 0 0 1 0 7H17M11.5 17h5" fill="none" stroke="#C9A7FF" stroke-width="1.6" stroke-linecap="round"/>';
var CODE_ICON = '<circle cx="9" cy="8" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="9" cy="24" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><circle cx="19" cy="12" r="2.6" fill="none" stroke="#9a9890" stroke-width="1.5"/><path d="M9 10.6v10.8M19 14.6c0 4-10 3-10 6.8" fill="none" stroke="#9a9890" stroke-width="1.5"/>';
// A file of no kind of its own shows its ending on its page, such as JSON
var endingOf = function (path) {
    var _a, _b;
    if (path === void 0) { path = ''; }
    return ((_b = (_a = /\.([a-z0-9]{1,4})$/i.exec(path)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '').toUpperCase();
};
var iconOf = function (kind, path) {
    return kind === 'code' ? CODE_ICON : kind === 'link' ? LINK_ICON : pageIcon(kind === 'file' ? endingOf(path) : madeKindOf(kind).badge, madeKindOf(kind).color);
};
var svgOfIcon = function (kind, width, height, path) { return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(height, "\" viewBox=\"0 0 28 32\">").concat(iconOf(kind, path), "</svg>"); };
var tileSvg = function (inner) { return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(TILE_W, "\" height=\"").concat(TILE_H, "\" viewBox=\"0 0 ").concat(TILE_W, " ").concat(TILE_H, "\">").concat(inner, "</svg>"); };
// A small copy cut to its place from its top, with rounded corners; each tile's cut has a name of its own, should the app draw them
// in one page
var clipId = function (one) { return "t".concat(mark(one.path).replace(':', '-')); };
var tilePicture = function (face, x, y, w, h, id) {
    return "<clipPath id=\"".concat(id, "\"><rect x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(w, "\" height=\"").concat(h, "\" rx=\"4\"/></clipPath><g clip-path=\"url(#").concat(id, ")\"><rect x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(w, "\" height=\"").concat(h, "\" fill=\"#fff\"/><image href=\"data:image/jpeg;base64,").concat(face.base64, "\" x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(w, "\" height=\"").concat(h, "\" preserveAspectRatio=\"xMidYMin slice\"/></g><rect x=\"").concat(x + 0.5, "\" y=\"").concat(y + 0.5, "\" width=\"").concat(w - 1, "\" height=\"").concat(h - 1, "\" rx=\"4\" fill=\"none\" stroke=\"#ffffff30\"/>");
};
var tilePlay = function (cx, cy) { return "<circle cx=\"".concat(cx, "\" cy=\"").concat(cy, "\" r=\"12\" fill=\"#000a\"/><path d=\"M").concat(cx - 4, " ").concat(cy - 6, "l10 6-10 6z\" fill=\"#fff\"/>"); };
var tileBadge = function (kind) {
    var _a = madeKindOf(kind), badge = _a.badge, color = _a.color;
    return kind === 'pdf' || kind === 'sheet' || kind === 'doc' ? "<rect x=\"4\" y=\"".concat(TILE_H - 17, "\" width=\"").concat(badge.length * 6 + 8, "\" height=\"13\" rx=\"3\" fill=\"").concat(color, "\"/><text x=\"8\" y=\"").concat(TILE_H - 7.5, "\" font-size=\"8.5\" ").concat(SVG_FONT, " font-weight=\"700\" fill=\"#fff\">").concat(badge, "</text>") : '';
};
var tileIcon = function (kind, path) { return "<rect width=\"".concat(TILE_W, "\" height=\"").concat(TILE_H, "\" rx=\"4\" fill=\"#ffffff12\"/><g transform=\"translate(").concat(TILE_W / 2 - 17.5, " ").concat(TILE_H / 2 - 20, ") scale(1.25)\">").concat(iconOf(kind, path), "</g>"); };
// One file: its small copy filling the tile, with its kind in the corner where the picture alone does not say it; else its icon
var oneTile = function (one, face) { return tileSvg(face ? tilePicture(face, 0, 0, TILE_W, TILE_H, clipId(one)) + (one.kind === 'video' ? tilePlay(TILE_W / 2, TILE_H / 2) : '') + tileBadge(one.kind) : tileIcon(one.kind, one.path)); };
// Several of a kind: the first one's small copy on two more sheets
var pileTile = function (first, face) {
    return tileSvg("<rect x=\"8\" y=\"0\" width=\"".concat(TILE_W - 8, "\" height=\"").concat(TILE_H - 8, "\" rx=\"4\" fill=\"#55554f\"/><rect x=\"4\" y=\"4\" width=\"").concat(TILE_W - 8, "\" height=\"").concat(TILE_H - 8, "\" rx=\"4\" fill=\"#77766f\"/>") +
        (face ? tilePicture(face, 0, 8, TILE_W - 8, TILE_H - 8, clipId(first)) + (first.kind === 'video' ? tilePlay((TILE_W - 8) / 2, 8 + (TILE_H - 8) / 2) : '') : "<rect x=\"0\" y=\"8\" width=\"".concat(TILE_W - 8, "\" height=\"").concat(TILE_H - 8, "\" rx=\"4\" fill=\"#3b3b39\" stroke=\"#ffffff30\"/><g transform=\"translate(").concat((TILE_W - 8) / 2 - 17.5, " ").concat(8 + (TILE_H - 8) / 2 - 20, ") scale(1.25)\">").concat(iconOf(first.kind, first.path), "</g>")));
};
// Code: how many lines were added and taken away
var codeTile = function (code) {
    return tileSvg("<rect width=\"".concat(TILE_W, "\" height=\"").concat(TILE_H, "\" rx=\"4\" fill=\"#ffffff12\"/><text x=\"").concat(TILE_W / 2, "\" y=\"").concat(TILE_H / 2 - 3, "\" font-size=\"15\" ").concat(SVG_FONT, " font-weight=\"600\" fill=\"#57AB5A\" text-anchor=\"middle\">+").concat(code.plus.toLocaleString('en-US'), "</text><text x=\"").concat(TILE_W / 2, "\" y=\"").concat(TILE_H / 2 + 16, "\" font-size=\"15\" ").concat(SVG_FONT, " font-weight=\"600\" fill=\"#E5534B\" text-anchor=\"middle\">\u2212").concat(code.minus.toLocaleString('en-US'), "</text>"));
};
// A file's name as a tile says it: without its ending, and without the start that the task's file names share, which says nothing
var sharedStart = function (names) {
    var _a;
    if (names.length < 2)
        return 0;
    var n = 0;
    while (names.every(function (name) { var _a; return name[n] !== undefined && name[n] === ((_a = names[0]) === null || _a === void 0 ? void 0 : _a[n]); }))
        n += 1;
    var cut = ((_a = names[0]) !== null && _a !== void 0 ? _a : '').slice(0, n).search(/[-_ ][^-_ ]*$/);
    return cut < 0 ? 0 : cut + 1;
};
var bareName = function (name) { return name.replace(/\.[a-z0-9]+$/i, ''); };
var thingsOf = function (files, opened) {
    var skip = sharedStart(files.made.filter(function (one) { return one.kind !== 'link'; }).map(function (one) { return bareName(one.name); }));
    var nameOf = function (one) { return (one.kind === 'link' ? one.name : bareName(one.name).slice(skip) || bareName(one.name)); };
    var kinds = __spreadArray(__spreadArray([], MADE_KINDS.map(function (one) { return one.kind; }), true), ['link'], false);
    return kinds.flatMap(function (kind) {
        var list = files.made.filter(function (one) { return one.kind === kind; });
        if (kind !== 'link' && list.length >= 3 && !opened(kind))
            return [{ key: "pile-".concat(kind), label: "".concat(list.length, " ").concat(madeKindOf(kind).many), kind: kind, files: list }];
        return list.map(function (one, n) { return ({ key: "".concat(kind, "-").concat(n), label: nameOf(one), kind: kind, files: [one] }); });
    });
};
// A name too long for its place keeps its start and its end, which is what tells two apart: "vat-li…country", "os re…t 362"
var middleCut = function (text, most) { return (text.length <= most ? text : "".concat(text.slice(0, Math.ceil((most - 1) / 2)), "\u2026").concat(text.slice(text.length - Math.floor((most - 1) / 2)))); };
var countWord = function (code) { return "".concat(code.count.toLocaleString('en-US'), " code ").concat(code.count === 1 ? 'file' : 'files'); };
// Opens what was pressed where the person is: a picture as the chat's pictures open, any other file or a link as the system opens it
var openMade = function ($, one, pane, row, surface) { return __awaiter(_this, void 0, void 0, function () {
    var opened;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (one.kind === 'picture')
                    return [2 /*return*/, showPicture($, one.path, pane, row, surface)];
                return [4 /*yield*/, openOn($, one.path)];
            case 1:
                opened = _a.sent();
                if (!(opened.exitCode !== 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, log($, "".concat(one.path, " not opened: ").concat(opened.stderr))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// The stacks opened out, by the pane and the kind
var openPiles = new Set();
// On a task's card, under its title: what it made side by side, an icon and a word or two each. A file opens on a press; several
// of a kind open the task. No small copy is made for a card
var madeChips = function ($, ui, one, key, onOpenWork) {
    var files = madeNow($, one);
    if (!files || (!files.made.length && !files.code))
        return null;
    var Box = ui.Box, Button = ui.Button, Text = ui.Text;
    var table = ui;
    var things = thingsOf(files, function () { return false; });
    var shown = things.slice(0, CHIPS_MOST);
    // The app draws no picture whose alt is blank, so each icon says its kind
    var icon = function (kind, at, path) {
        return table.Svg && !('isTerminal' in ui) ? <table.Svg key={"".concat(at, "-icon")} source={svgOfIcon(kind, 18, 20, path)} alt={kind === 'code' ? 'Code' : kind === 'link' ? 'Link' : madeKindOf(kind).one.replace(/^\w/, function (c) { return c.toUpperCase(); })} width={18} height={20}/> : null;
    };
    return (<Box key={key} flexDirection="row" flexWrap="wrap" columnGap={2} rowGap={0}>
      {shown.map(function (thing) {
            var _a;
            return (<Box key={"".concat(key, "-").concat(thing.key)} flexDirection="row" alignItems="center" flexShrink={0} height={1} overflow="hidden">
          {icon(thing.kind, "".concat(key, "-").concat(thing.key), (_a = thing.files[0]) === null || _a === void 0 ? void 0 : _a.path)}
          <Button key={"".concat(key, "-").concat(thing.key, "-open-").concat(presses)} label={"".concat(middleCut(thing.label, 18)).concat(thing.kind === 'link' ? ' ↗' : '')} plain onPress={function (press) { return void ((presses += 1), thing.files.length > 1 ? onOpenWork() : thing.files[0] ? openMade($, thing.files[0], '', '', press.surface) : undefined); }}/>
        </Box>);
        })}
      {things.length > shown.length ? <Text key={"".concat(key, "-more")} dimColor>{"".concat(things.length - shown.length, " more")}</Text> : null}
      {files.code ? (<Box key={"".concat(key, "-code")} flexDirection="row" alignItems="center" gap={1} flexShrink={0} height={1} overflow="hidden">
          {icon('code', "".concat(key, "-code"))}
          <Text>{countWord(files.code)}</Text>
          <Text color="success">{"+".concat(files.code.plus.toLocaleString('en-US'))}</Text>
          {files.code.minus ? <Text color="error">{"\u2212".concat(files.code.minus.toLocaleString('en-US'))}</Text> : null}
        </Box>) : null}
    </Box>);
};
// In a task's Details and in its result: the same things as tiles side by side, a small copy and a name each, each a press. A
// stack opens out into a tile for each of its files. Where no picture can be drawn, a row each
// `gen`, where the pane has one, is the mark of what its drawing shows, which every key carries
var madeTiles = function ($, ui, files, pane, key, surface, gen) {
    if (gen === void 0) { gen = ''; }
    if (!files.made.length && !files.code)
        return null;
    var Box = ui.Box, Button = ui.Button, Text = ui.Text;
    var table = ui;
    var canDraw = Boolean(table.Svg) && surface !== 'terminal' && !('isTerminal' in ui);
    var things = thingsOf(files, function (kind) { return openPiles.has("".concat(pane, ":").concat(kind)); });
    var shown = things.slice(0, TILES_MOST);
    var made = canDraw ? facesNow($, shown.slice(0, FACES_MOST).flatMap(function (thing) { return thing.files.slice(0, 1); })) : faces;
    var chars = 0;
    var faceOf = function (one) {
        var face = one ? made.get(faceKey(one)) : undefined;
        if (!face || chars + face.base64.length > TILE_CHARS)
            return undefined;
        chars += face.base64.length;
        return face;
    };
    var press = function (thing, row) { return function (e) {
        presses += 1;
        if (thing.files.length > 1)
            return void (openPiles.add("".concat(pane, ":").concat(thing.kind)), redraw($));
        if (thing.files[0])
            void openMade($, thing.files[0], pane, row, e.surface);
    }; };
    var fewer = __spreadArray([], new Set(files.made.map(function (one) { return one.kind; })), true).filter(function (kind) { return openPiles.has("".concat(pane, ":").concat(kind)) && files.made.filter(function (one) { return one.kind === kind; }).length >= 3; });
    return (<Box key={key} flexDirection="column" gap={1}>
      <Box flexDirection="row" flexWrap="wrap" columnGap={1} rowGap={1}>
        {shown.map(function (thing) {
            var row = "".concat(key, "-").concat(thing.key);
            return (<Box key={row} flexDirection="column" alignItems="flex-start" width={canDraw ? TILE_COLUMNS : undefined} flexShrink={0}>
              {canDraw && table.Svg ? <table.Svg key={"".concat(row, "-svg")} source={thing.files.length > 1 ? pileTile(thing.files[0], faceOf(thing.files[0])) : oneTile(thing.files[0], faceOf(thing.files[0]))} alt={thing.label} width={TILE_SHOWN_W} height={TILE_SHOWN_H}/> : null}
              <Button key={"".concat(row, "-open-").concat(presses).concat(gen)} label={canDraw ? middleCut(thing.label, TILE_COLUMNS) : cut(thing.label, 60)} plain onPress={press(thing, row)}/>
            </Box>);
        })}
        {files.code ? (<Box key={"".concat(key, "-code")} flexDirection="column" alignItems="flex-start" width={canDraw ? TILE_COLUMNS : undefined} flexShrink={0}>
            {canDraw && table.Svg ? <table.Svg key={"".concat(key, "-code-svg")} source={codeTile(files.code)} alt={countWord(files.code)} width={TILE_SHOWN_W} height={TILE_SHOWN_H}/> : null}
            <Text dimColor wrap="truncate-end">{canDraw ? countWord(files.code) : "".concat(countWord(files.code), " \u00B7 +").concat(files.code.plus.toLocaleString('en-US'), " \u2212").concat(files.code.minus.toLocaleString('en-US'))}</Text>
          </Box>) : null}
      </Box>
      {things.length > shown.length ? <Text dimColor>{"".concat(things.length - shown.length, " more")}</Text> : null}
      {fewer.length ? (<Box alignItems="flex-start">
          <Button key={"".concat(key, "-fewer-").concat(presses).concat(gen)} label="Show less" plain dimColor onPress={function () { return void ((presses += 1), fewer.forEach(function (kind) { return openPiles.delete("".concat(pane, ":").concat(kind)); }), redraw($)); }}/>
        </Box>) : null}
    </Box>);
};
