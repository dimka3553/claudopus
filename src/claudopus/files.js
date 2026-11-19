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
var CHIPS_MOST = 8;
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
var COUNT_LINES = 'cd "$1" || exit 1; since=$2; shift 2; base=$(git rev-list -1 --before="$since" HEAD 2>/dev/null); [ -n "$base" ] || base=4b825dc642cb6eb9a060e54bf8d69288fbee4904; for f in "$@"; do if git cat-file -e "$base:$f" 2>/dev/null; then git diff --numstat "$base" -- "$f"; elif [ -f "$f" ]; then printf \'%s\\t0\\t%s\\tnew\\n\' "$(grep -c \'\' "$f")" "$f"; fi; done';
// Each file listed, the most changed first, its counts kept with the whole
var codeOf = function ($, byTop, since) { return __awaiter(_this, void 0, void 0, function () {
    var files, _loop_1, _i, byTop_1, _a, top_1, paths;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = [];
                _loop_1 = function (top_1, paths) {
                    var r, _c, _d, line, _e, _f, added, _g, taken, _h, inRepo, _j, isNew;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, $.process.run(__spreadArray(['sh', '-c', COUNT_LINES, 'sh', top_1, String(Math.floor(since / 1000))], paths.map(function (path) { return path.slice(top_1.length + 1); }), true), { timeoutMs: 8000 }).catch(function () { return undefined; })];
                            case 1:
                                r = _k.sent();
                                if ((r === null || r === void 0 ? void 0 : r.exitCode) !== 0)
                                    return [2 /*return*/, "continue"];
                                for (_c = 0, _d = rows(r.stdout); _c < _d.length; _c++) {
                                    line = _d[_c];
                                    _e = line.split('\t'), _f = _e[0], added = _f === void 0 ? '' : _f, _g = _e[1], taken = _g === void 0 ? '' : _g, _h = _e[2], inRepo = _h === void 0 ? '' : _h, _j = _e[3], isNew = _j === void 0 ? '' : _j;
                                    if (!/^(\d+|-)$/.test(added) || !inRepo)
                                        continue;
                                    files.push(__assign({ path: "".concat(top_1, "/").concat(inRepo), inRepo: inRepo, plus: Number(added) || 0, minus: Number(taken) || 0 }, (isNew === 'new' ? { isNew: true } : {})));
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
            case 4:
                if (!files.length)
                    return [2 /*return*/, undefined];
                files.sort(function (a, b) { return b.plus + b.minus - (a.plus + a.minus); });
                return [2 /*return*/, { count: files.length, plus: files.reduce(function (sum, one) { return sum + one.plus; }, 0), minus: files.reduce(function (sum, one) { return sum + one.minus; }, 0), files: files, since: Math.floor(since / 1000) }];
        }
    });
}); };
// Links a result names on a line that says it made or put them up, and those whose shape says something was put up (a pull request,
// an issue, a release, a published page) wherever they stand. A page it only cites is no thing it made
var MADE_LINK_LINE = /\b(made|added|created|published|deployed|live|online|posted|uploaded|opened|pushed|report|pull request|PR|release[sd]?)\b/i;
var MADE_LINK = /^https?:\/\/(www\.)?(github\.com\/[^/\s]+\/[^/\s]+\/(pull|issues|releases)\/|gitlab\.com\/\S+\/-\/(merge_requests|issues)\/|claude\.ai\/(public\/)?artifacts?\/)/i;
var LINK = /https?:\/\/[^\s`'"()<>[\]{}|,;*\\]+/g;
var LINKS_MOST = 30;
var linksOf = function (text) { var _a; return ((_a = text.match(LINK)) !== null && _a !== void 0 ? _a : []).map(function (link) { return link.replace(/[.:!?]+$/, ''); }); };
var linksIn = function (text) { return __spreadArray([], new Set(text.split('\n').flatMap(function (line) { return linksOf(line).filter(function (link) { return MADE_LINK_LINE.test(line) || MADE_LINK.test(link); }); })), true).slice(0, LINKS_MOST); };
var isLink = function (said) { return /^https?:\/\//.test(said); };
var linkName = function (link) {
    var _a, _b, _c, _d, _e;
    var _f = link.replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/\/$/, '').split('/'), _g = _f[0], host = _g === void 0 ? '' : _g, rest = _f.slice(1);
    // A pull request or an issue by its repo and number, "clipify #70", as it is spoken of; a published page as one
    if (/^(www\.)?(github|gitlab)\.com$/.test(host) && /^(pull|issues|merge_requests)$/.test((_a = rest.at(-2)) !== null && _a !== void 0 ? _a : '') && /^\d+$/.test((_b = rest.at(-1)) !== null && _b !== void 0 ? _b : ''))
        return "".concat(rest.at(-3) === '-' ? rest.at(-4) : rest[1], " #").concat(rest.at(-1));
    if (/^claude\.ai$/.test(host) && /^artifacts?$/.test((_c = rest.at(-2)) !== null && _c !== void 0 ? _c : ''))
        return 'claude.ai page';
    var last = (_d = rest.at(-1)) !== null && _d !== void 0 ? _d : '';
    // "os.example.com/reports/362" is "os report 362": the site's first word, the kind of page in the singular, and the page
    var kind = rest.length > 1 ? ((_e = rest.at(-2)) !== null && _e !== void 0 ? _e : '').replace(/(?<=\w{3})s$/, '') : '';
    return last ? "".concat(host.replace(/^www\./, '').split('.')[0], " ").concat(kind ? "".concat(kind, " ") : '').concat(last).slice(0, 40) : host.replace(/^www\./, '');
};
// What a task's words name as made: a result's files and links, and of the words a step ends with only its links
var saidIn = function (text, isResult) { return __spreadArray(__spreadArray([], (isResult ? namedPaths(text) : []), true), linksIn(text), true); };
var SAID_KEPT = 300;
var withSaid = function (one, found) {
    var _a, _b;
    var said = __spreadArray([], new Set(__spreadArray(__spreadArray([], ((_a = one.said) !== null && _a !== void 0 ? _a : []), true), found, true)), true).slice(-SAID_KEPT);
    return said.length === ((_b = one.said) !== null && _b !== void 0 ? _b : []).length && said.every(function (item, n) { var _a; return item === ((_a = one.said) === null || _a === void 0 ? void 0 : _a[n]); }) ? one : __assign(__assign({}, one), { said: said });
};
// Every change to the cards keeps what each new answer of a task's names, on its card and its task's (a helper's result is what its
// task made too): the answer is replaced at each step's end and each result, so what an earlier one named is never lost
var saidKept = function (before, next) {
    var _a, _b;
    var was = new Map(before.map(function (one) { return [one.id, one]; }));
    var found = new Map();
    for (var _i = 0, next_1 = next; _i < next_1.length; _i++) {
        var one = next_1[_i];
        if (one.chat || !one.answer.trim() || one.answer === ((_a = was.get(one.id)) === null || _a === void 0 ? void 0 : _a.answer))
            continue;
        var named_1 = saidIn(one.answer, one.status !== 'working');
        if (named_1.length)
            for (var _c = 0, _d = new Set([one.id, topOf(next, one.id)]); _c < _d.length; _c++) {
                var id = _d[_c];
                found.set(id, __spreadArray(__spreadArray([], ((_b = found.get(id)) !== null && _b !== void 0 ? _b : []), true), named_1, true));
            }
    }
    return found.size ? next.map(function (one) { var _a; return (found.has(one.id) ? withSaid(one, (_a = found.get(one.id)) !== null && _a !== void 0 ? _a : []) : one); }) : next;
};
// A command that opens a pull request, a release or a page prints where it is: kept as what its task made, which a result that names
// it only by its number ("pull request #284") would leave out
var PUTS_UP = /\b(gh\s+(pr|release|gist)\s+create|glab\s+mr\s+create)\b/;
var linksPutUp = function (e, r) {
    var _a, _b;
    if (r.deny || r.isError)
        return [];
    var isPutting = (e.tool === 'Bash' && PUTS_UP.test(String((_a = e.command) !== null && _a !== void 0 ? _a : ''))) || /artifact/i.test(e.tool);
    return isPutting ? __spreadArray([], new Set(linksOf(JSON.stringify((_b = r.result) !== null && _b !== void 0 ? _b : '')).filter(function (link) { return MADE_LINK.test(link); })), true) : [];
};
var keepPutUp = function ($, id, links) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!links.length) return [3 /*break*/, 2];
                return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (one) { return (one.id === id || one.id === topOf(list, id) ? withSaid(one, links) : one); }); })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// What a task made: the files its steps wrote or its commands named, and the files and links its results name (`said`, from every
// one it gave, and `answer`), that are there and were made since it began. A picture, video, PDF, spreadsheet or document is a
// thing of its own, as is any file a result names; the other files it wrote inside a repo are its code, counted and never listed
var madeBy = function ($_1, wrote_1, answer_1, since_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(_this, __spreadArray([$_1, wrote_1, answer_1, since_1], args_1, true), void 0, function ($, wrote, answer, since, isDated, said) {
        var named, made, byTop, seen, isThing, newest, _a, _b, given, path, isNamed, stat, kind, top_2, _c, order, _d, _e, _f, n, given, _g, _h, link, code, _j;
        var _k;
        if (isDated === void 0) { isDated = true; }
        if (said === void 0) { said = []; }
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    named = __spreadArray([], new Set(__spreadArray(__spreadArray([], said.filter(function (one) { return !isLink(one); }), true), namedPaths(answer), true)), true);
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
                    for (_g = 0, _h = __spreadArray([], new Set(__spreadArray(__spreadArray([], said.filter(isLink), true), linksIn(answer), true)), true); _g < _h.length; _g++) {
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
// What a task made in its whole life: listed now, with what it was listed with before (kept on its card and with each result it
// gave) that the listing no longer finds. A thing of its own or a link stays; a changed file stays only once it is gone (its
// worktree taken away once merged), with the lines it was counted with, as one still there that is no longer changed is not
var listMade = function ($, one, answer) { return __awaiter(_this, void 0, void 0, function () {
    var now, earlier, _a, paths, kept, counted, gone, _i, _b, file, files, since, code, all;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, madeBy($, (_c = one.wrote) !== null && _c !== void 0 ? _c : [], answer, (_d = one.begunAt) !== null && _d !== void 0 ? _d : one.startedAt, true, (_e = one.said) !== null && _e !== void 0 ? _e : [])];
            case 1:
                now = _p.sent();
                _a = [[one.made]];
                return [4 /*yield*/, read($, reports)];
            case 2:
                earlier = __spreadArray.apply(void 0, _a.concat([(_p.sent()).filter(function (r) { return r.agent === one.id && r.made; }).map(function (r) { return r.made; }), true])).filter(function (files) { return Boolean(files); });
                if (!earlier.length)
                    return [2 /*return*/, now];
                paths = new Set(now.made.map(function (made) { return made.path; }));
                kept = earlier.flatMap(function (files) { return files.made; }).filter(function (made) { return !paths.has(made.path) && (paths.add(made.path), true); });
                counted = new Set(((_g = (_f = now.code) === null || _f === void 0 ? void 0 : _f.files) !== null && _g !== void 0 ? _g : []).map(function (file) { return file.path; }));
                gone = [];
                _i = 0, _b = earlier.flatMap(function (files) { var _a, _b; return (_b = (_a = files.code) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []; });
                _p.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                file = _b[_i];
                if (counted.has(file.path))
                    return [3 /*break*/, 5];
                counted.add(file.path);
                return [4 /*yield*/, $.fs.exists(file.path).catch(function () { return true; })];
            case 4:
                if (!(_p.sent()))
                    gone.push(file);
                _p.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                files = __spreadArray(__spreadArray([], ((_j = (_h = now.code) === null || _h === void 0 ? void 0 : _h.files) !== null && _j !== void 0 ? _j : []), true), gone, true).sort(function (a, b) { return b.plus + b.minus - (a.plus + a.minus); });
                since = (_l = (_k = now.code) === null || _k === void 0 ? void 0 : _k.since) !== null && _l !== void 0 ? _l : (_o = (_m = earlier.find(function (files) { var _a; return (_a = files.code) === null || _a === void 0 ? void 0 : _a.since; })) === null || _m === void 0 ? void 0 : _m.code) === null || _o === void 0 ? void 0 : _o.since;
                code = files.length ? __assign({ count: files.length, plus: files.reduce(function (sum, file) { return sum + file.plus; }, 0), minus: files.reduce(function (sum, file) { return sum + file.minus; }, 0), files: files }, (since ? { since: since } : {})) : now.code;
                all = __spreadArray(__spreadArray([], now.made, true), kept, true);
                return [2 /*return*/, __assign({ made: __spreadArray(__spreadArray([], all.filter(function (made) { return made.kind !== 'link'; }), true), all.filter(function (made) { return made.kind === 'link'; }), true) }, (code ? { code: code } : {}))];
        }
    });
}); };
// What a card draws: its task's files as last listed, and listed again, out of the drawing, once it has made a step since (a file a
// step writes is there only after the step), at most every MADE_AGAIN while it works, and once it ends. The listings take turns, so a
// panel opened on many cards lists them one after another. What a listing found is kept on the card, so it is drawn at once after a
// reload and nothing it once listed is lost
var MADE_AGAIN = 20000;
var MADE_HOLD = 15000;
// What a listing shows: nothing at all is the same as not listed yet
var shownOf = function (files) { return (files && (files.made.length || files.code) ? JSON.stringify(files) : ''); };
var madeOf = new Map();
var madeLoading = new Set();
var madeTurn = Promise.resolve();
var madeNow = function ($, one) {
    var _a, _b, _c, _d, _e, _f;
    if (one.chat)
        return undefined;
    // While it works a helper's edits change no count of the task's own, so time is part of what is listed
    var key = "".concat((_a = one.steps) !== null && _a !== void 0 ? _a : 0, ":").concat(((_b = one.wrote) !== null && _b !== void 0 ? _b : []).length, ":").concat(((_c = one.said) !== null && _c !== void 0 ? _c : []).length, ":").concat(one.answer.length, ":").concat(one.status, ":").concat(one.status === 'working' ? Math.floor(Date.now() / MADE_AGAIN) : '');
    var was = madeOf.get(one.id);
    var isDue = !was || (was.key !== key && (one.status !== 'working' || Date.now() - was.at >= MADE_AGAIN));
    if (isDue && !madeLoading.has(one.id) && (((_d = one.wrote) !== null && _d !== void 0 ? _d : []).length || ((_e = one.said) !== null && _e !== void 0 ? _e : []).length || one.made || one.answer)) {
        madeLoading.add(one.id);
        // (the words a step ends with name no file as made: only a result does, and each one's is in `said`)
        var run = madeTurn.then(function () { return listMade($, one, one.status === 'working' ? '' : one.answer); });
        // A listing that never ends (a file on a volume that does not answer) holds the others up no longer than MADE_HOLD
        madeTurn = Promise.race([run.catch(function () { return undefined; }), $.clock.sleep(MADE_HOLD)]);
        var isNew_1 = false;
        void run
            .then(function (files) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (madeOf.size > 200)
                            madeOf.delete((_a = madeOf.keys().next().value) !== null && _a !== void 0 ? _a : '');
                        isNew_1 = shownOf(files) !== shownOf((_c = (_b = madeOf.get(one.id)) === null || _b === void 0 ? void 0 : _b.files) !== null && _c !== void 0 ? _c : one.made);
                        madeOf.set(one.id, { key: key, at: Date.now(), files: files });
                        if (!(shownOf(files) && shownOf(files) !== shownOf(one.made))) return [3 /*break*/, 2];
                        return [4 /*yield*/, changeTodos($, function (list) { return list.map(function (card) { return (card.id === one.id ? __assign(__assign({}, card), { made: files }) : card); }); })];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); })
            .catch(function (err) { return log($, "files of ".concat(one.id, " not listed: ").concat(String(err))); })
            // The panel is drawn again only when what it shows changed
            .finally(function () { return (madeLoading.delete(one.id), isNew_1 ? redraw($) : undefined); });
    }
    return (_f = was === null || was === void 0 ? void 0 : was.files) !== null && _f !== void 0 ? _f : one.made;
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
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, read($, todos)];
                    case 1:
                        one = (_e.sent()).find(function (card) { return card.id === r.agent; });
                        return [4 /*yield*/, madeBy($, (_a = one === null || one === void 0 ? void 0 : one.wrote) !== null && _a !== void 0 ? _a : [], text, one ? ((_b = one.begunAt) !== null && _b !== void 0 ? _b : one.startedAt) : 0, Boolean(one), (_c = one === null || one === void 0 ? void 0 : one.said) !== null && _c !== void 0 ? _c : []).catch(function () { return ({ made: [] }); })];
                    case 2:
                        listed = _e.sent();
                        if (madeOfOld.size > 200)
                            madeOfOld.delete((_d = madeOfOld.keys().next().value) !== null && _d !== void 0 ? _d : '');
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
// A file of code shows its ending in its language's colour
var ENDING_COLORS = { TS: '#3178C6', TSX: '#3178C6', JS: '#B8A11E', JSX: '#B8A11E', MJS: '#B8A11E', PY: '#3572A5', SH: '#4E9A2A', JSON: '#8A7A2E', CSS: '#663399', HTML: '#D24E2B', MD: '#6B6A65', SWIFT: '#E0583A', GO: '#00879A', RS: '#B7410E', RB: '#B22222', C: '#555BA8', H: '#555BA8', CPP: '#555BA8' };
var iconOf = function (kind, path) { var _a; return kind === 'code' ? CODE_ICON : kind === 'link' ? LINK_ICON : pageIcon(kind === 'file' ? endingOf(path) : madeKindOf(kind).badge, kind === 'file' ? ((_a = ENDING_COLORS[endingOf(path)]) !== null && _a !== void 0 ? _a : madeKindOf(kind).color) : madeKindOf(kind).color); };
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
// A changed file's size of change: a bar as long as its lines changed against the most changed file listed with it (by the square
// root, so a small edit beside a large one still shows), green for the lines added and red for those removed, on a faint track
var BAR_W = 64;
var BAR_H = 8;
var BAR_CELLS = 6;
var ADDED = '#57AB5A';
var REMOVED = '#E5534B';
var barShare = function (one, most) { return (most > 0 ? Math.sqrt((one.plus + one.minus) / most) : 0); };
var barSvg = function (one, most) {
    var long = one.plus + one.minus ? Math.max(4, Math.round(BAR_W * barShare(one, most))) : 0;
    var green = one.plus + one.minus ? Math.round((long * one.plus) / (one.plus + one.minus)) : 0;
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(BAR_W, "\" height=\"").concat(BAR_H, "\" viewBox=\"0 0 ").concat(BAR_W, " ").concat(BAR_H, "\"><rect width=\"").concat(BAR_W, "\" height=\"").concat(BAR_H, "\" rx=\"2\" fill=\"#ffffff14\"/>").concat(green ? "<rect width=\"".concat(green, "\" height=\"").concat(BAR_H, "\" rx=\"2\" fill=\"").concat(ADDED, "\"/>") : '').concat(long - green ? "<rect x=\"".concat(green, "\" width=\"").concat(long - green, "\" height=\"").concat(BAR_H, "\" rx=\"2\" fill=\"").concat(REMOVED, "\"/>") : '', "</svg>");
};
// The same in a terminal, as cells: added, removed, then the track
var barCells = function (one, most) {
    var long = one.plus + one.minus ? Math.max(1, Math.round(BAR_CELLS * barShare(one, most))) : 0;
    var green = one.plus + one.minus ? Math.round((long * one.plus) / (one.plus + one.minus)) : 0;
    return { green: '■'.repeat(green), red: '■'.repeat(long - green), rest: '·'.repeat(BAR_CELLS - long) };
};
var linesWord = function (one) { return "".concat(one.plus.toLocaleString('en-US'), " added, ").concat(one.minus.toLocaleString('en-US'), " removed"); };
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
var countWord = function (code) { return "".concat(code.count.toLocaleString('en-US'), " changed ").concat(code.count === 1 ? 'file' : 'files'); };
// The files a task changed in a repo, by kind: its code, then its documents (plain text such as Markdown), each the most changed first
var CODE_KINDS = [
    { kind: 'code', title: 'Code', test: function (one) { return !TEXT_DOC.test(one.path); } },
    { kind: 'docs', title: 'Documents', test: function (one) { return TEXT_DOC.test(one.path); } },
];
// The most files listed before "Show all"
var CHANGED_MOST = 8;
// Files by the folder they are in inside the repo, the folder of the most changed first, as they stand in the list; one at the
// repo's top is under the repo's own name
var foldersOf = function (list) {
    var _a;
    var by = new Map();
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var one = list_1[_i];
        var folder = one.inRepo.includes('/') ? one.inRepo.slice(0, one.inRepo.lastIndexOf('/')) : fileName(one.path.slice(0, one.path.length - one.inRepo.length - 1));
        by.set(folder, __spreadArray(__spreadArray([], ((_a = by.get(folder)) !== null && _a !== void 0 ? _a : []), true), [one], false));
    }
    return __spreadArray([], by.entries(), true);
};
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
      {/* (the rest are in its Details, which the press opens) */}
      {things.length > shown.length ? <Button key={"".concat(key, "-more-").concat(presses)} label={"".concat(things.length - shown.length, " more")} plain dimColor hover={{ underline: true }} onPress={function () { return void ((presses += 1), onOpenWork()); }}/> : null}
      {files.code ? (<Box key={"".concat(key, "-code")} flexDirection="row" alignItems="center" gap={1} flexShrink={0} height={1} overflow="hidden">
          {icon('code', "".concat(key, "-code"))}
          <Button key={"".concat(key, "-code-open-").concat(presses)} label={countWord(files.code)} plain hover={{ underline: true }} onPress={function () { return void ((presses += 1), onOpenWork()); }}/>
          {/* (the counts drawn at the button's size, as in Details) */}
          {table.Svg && !('isTerminal' in ui) ? (<table.Svg key={"".concat(key, "-code-counts")} source={chipCountsSvg(files.code)} alt={linesWord(files.code)} width={chipCountsW(files.code)} height={LIST_H}/>) : ([
                <Text key={"".concat(key, "-code-plus")} color="success">{"+".concat(files.code.plus.toLocaleString('en-US'))}</Text>,
                files.code.minus ? <Text key={"".concat(key, "-code-minus")} color="error">{"\u2212".concat(files.code.minus.toLocaleString('en-US'))}</Text> : null,
            ])}
        </Box>) : null}
    </Box>);
};
// In a task's Details and in its result: the same things as tiles side by side, a small copy and a name each, each a press. A
// stack opens out into a tile for each of its files. Where no picture can be drawn, a row each
// `gen`, where the pane has one, is the mark of what its drawing shows, which every key carries
// `owner`: the task or the result the files are of, which a file's tab goes back to
var madeTiles = function ($, ui, files, pane, key, owner, surface, gen) {
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
      </Box>
      {things.length > shown.length ? <Text dimColor>{"".concat(things.length - shown.length, " more")}</Text> : null}
      {fewer.length ? (<Box alignItems="flex-start">
          <Button key={"".concat(key, "-fewer-").concat(presses).concat(gen)} label="Show less" plain dimColor onPress={function () { return void ((presses += 1), fewer.forEach(function (kind) { return openPiles.delete("".concat(pane, ":").concat(kind)); }), redraw($)); }}/>
        </Box>) : null}
      {files.code ? changedList($, ui, files.code, pane, key, canDraw, owner, gen) : null}
    </Box>);
};
// Under the tiles, the files the task changed in a repo, by kind: each kind's heading with its counts, then under a line for each
// folder inside the repo a row a file: its icon, its name, then its counts and its bar at the right, which line up down the list.
// The app draws a button's words at 14 pixels and other words at 16, so where it draws pictures every word but a file's name (a
// button) is drawn in a picture at 14, and the list reads at one size. A press on a name shows the file in the app's Files pane. A
// task counted before files were kept has only its counts
var LIST_FONT = 14;
var LIST_H = 20;
// The counts' picture: `new` for a file the task made, the lines added and removed, each right-aligned in a column of its own, then
// the bar
var COUNTS_W = 200;
var countsSvg = function (one, bar, isNew, isDim) {
    var _a;
    if (isNew === void 0) { isNew = false; }
    if (isDim === void 0) { isDim = false; }
    var y = LIST_H / 2 + LIST_FONT * 0.36;
    var text = function (x, color, words, anchor) {
        if (anchor === void 0) { anchor = 'end'; }
        return "<text x=\"".concat(x, "\" y=\"").concat(y, "\" font-size=\"").concat(LIST_FONT, "\" ").concat(SVG_FONT, " fill=\"").concat(color, "\" text-anchor=\"").concat(anchor, "\">").concat(words, "</text>");
    };
    var shown = barSvg(__assign({ path: '', inRepo: '' }, one), (_a = bar === null || bar === void 0 ? void 0 : bar.most) !== null && _a !== void 0 ? _a : 0);
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(COUNTS_W, "\" height=\"").concat(LIST_H, "\" viewBox=\"0 0 ").concat(COUNTS_W, " ").concat(LIST_H, "\">").concat(isNew ? text(0, '#9a9890', 'new', 'start') : '').concat(text(70, isDim ? '#57AB5A99' : ADDED, "+".concat(one.plus.toLocaleString('en-US')))).concat(text(118, one.minus && !isDim ? REMOVED : '#E5534B80', "\u2212".concat(one.minus.toLocaleString('en-US')))).concat(bar ? "<g transform=\"translate(".concat(COUNTS_W - BAR_W, " ").concat((LIST_H - BAR_H) / 2, ")\">").concat(shown.replace(/^<svg[^>]*>|<\/svg>$/g, ''), "</g>") : '', "</svg>");
};
// The same counts on a card, side by side from the left, as wide as they are (a figure is about 8.5 pixels at the list's size)
var FIGURE_W = 8.5;
var chipCountsW = function (one) { return Math.ceil(("+".concat(one.plus.toLocaleString('en-US')).length + 1 + "\u2212".concat(one.minus.toLocaleString('en-US')).length) * FIGURE_W) + 4; };
var chipCountsSvg = function (one) {
    var plus = "+".concat(one.plus.toLocaleString('en-US'));
    var y = LIST_H / 2 + LIST_FONT * 0.36;
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(chipCountsW(one), "\" height=\"").concat(LIST_H, "\" viewBox=\"0 0 ").concat(chipCountsW(one), " ").concat(LIST_H, "\"><text x=\"0\" y=\"").concat(y, "\" font-size=\"").concat(LIST_FONT, "\" ").concat(SVG_FONT, "><tspan fill=\"").concat(ADDED, "\">").concat(plus, "</tspan><tspan fill=\"").concat(one.minus ? REMOVED : '#E5534B80', "\" x=\"").concat(Math.ceil((plus.length + 1) * FIGURE_W), "\">\u2212").concat(one.minus.toLocaleString('en-US'), "</tspan></text></svg>");
};
// A line of words drawn at the list's size: a kind's heading (its name in white, its count in grey) or a folder (grey)
var wordsSvg = function (parts, width) {
    var y = LIST_H / 2 + LIST_FONT * 0.36;
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(LIST_H, "\" viewBox=\"0 0 ").concat(width, " ").concat(LIST_H, "\"><text x=\"0\" y=\"").concat(y, "\" font-size=\"").concat(LIST_FONT, "\" ").concat(SVG_FONT, ">").concat(parts.map(function (part) { return "<tspan fill=\"".concat(part.color, "\"").concat(part.bold ? ' font-weight="600"' : '', ">").concat(escapeXml(part.words), " </tspan>"); }).join(''), "</text></svg>");
};
var escapeXml = function (text) { return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
// The widths of a folder's line and a kind's heading, in pixels: a folder's 44 characters at most, a heading's few words
var LINE_W = 320;
var HEAD_W = 160;
var changedList = function ($, ui, code, pane, key, canDraw, owner, gen) {
    var _a;
    var Box = ui.Box, Button = ui.Button, Text = ui.Text;
    var table = ui;
    var Svg = canDraw ? table.Svg : undefined;
    var list = (_a = code.files) !== null && _a !== void 0 ? _a : [];
    var isAll = openPiles.has("".concat(pane, ":code"));
    var most = Math.max.apply(Math, __spreadArray([0], list.map(function (one) { return one.plus + one.minus; }), false));
    var groups = CODE_KINDS.map(function (group) {
        var all = list.filter(group.test);
        return __assign(__assign({}, group), { all: all, sum: { plus: all.reduce(function (n, one) { return n + one.plus; }, 0), minus: all.reduce(function (n, one) { return n + one.minus; }, 0) } });
    }).filter(function (group) { return group.all.length; });
    var filesWord = function (n) { return "".concat(n.toLocaleString('en-US'), " ").concat(n === 1 ? 'file' : 'files'); };
    // The counts at a row's right: a picture where the app draws them, else words and cells
    var countsOf = function (one, at, bar, isNew, isDim) {
        if (isNew === void 0) { isNew = false; }
        if (isDim === void 0) { isDim = false; }
        if (Svg)
            return <Svg key={"".concat(at, "-counts")} source={countsSvg(one, bar, isNew, isDim)} alt={"".concat(isNew ? 'new, ' : '').concat(linesWord(one))} width={COUNTS_W} height={LIST_H}/>;
        var cells = bar ? barCells(__assign({ path: '', inRepo: '' }, one), bar.most) : undefined;
        return (<Box key={"".concat(at, "-counts")} flexDirection="row" gap={1}>
        {isNew ? <Text dimColor>new</Text> : null}
        <Text color="success" dimColor={isDim}>{"+".concat(one.plus.toLocaleString('en-US'))}</Text>
        <Text color="error" dimColor={isDim || !one.minus}>{"\u2212".concat(one.minus.toLocaleString('en-US'))}</Text>
        {cells ? (<Box flexDirection="row">
            <Text color="success">{cells.green}</Text>
            <Text color="error">{cells.red}</Text>
            <Text dimColor>{cells.rest}</Text>
          </Box>) : null}
      </Box>);
    };
    if (!list.length)
        return (<Box key={"".concat(key, "-code")} flexDirection="row" alignItems="center" gap={1}>
        {Svg ? <Svg key={"".concat(key, "-code-word")} source={wordsSvg([{ words: countWord(code), color: '#9a9890' }], HEAD_W)} alt={countWord(code)} width={HEAD_W} height={LIST_H}/> : <Text dimColor>{countWord(code)}</Text>}
        {countsOf(code, "".concat(key, "-code"))}
      </Box>);
    var left = isAll ? Infinity : CHANGED_MOST;
    return (<Box key={"".concat(key, "-code")} flexDirection="column" gap={1}>
      {groups.map(function (group) {
            var rows = group.all.slice(0, Math.max(0, left));
            left -= rows.length;
            var heading = "".concat(group.title, " \u00B7 ").concat(filesWord(group.all.length));
            return (<Box key={"".concat(key, "-").concat(group.kind)} flexDirection="column">
            <Box flexDirection="row" alignItems="center" gap={1} minWidth={0}>
              <Box flexGrow={1} flexShrink={1} minWidth={0} overflow="hidden">
                {Svg ? (<Svg key={"".concat(key, "-").concat(group.kind, "-head")} source={wordsSvg([{ words: group.title, color: '#ECEAE3', bold: true }, { words: filesWord(group.all.length), color: '#9a9890' }], HEAD_W)} alt={heading} width={HEAD_W} height={LIST_H}/>) : (<Text bold>{heading}</Text>)}
              </Box>
              <Box flexShrink={0}>{countsOf(group.sum, "".concat(key, "-").concat(group.kind, "-sum"), undefined, false, true)}</Box>
            </Box>
            {foldersOf(rows).map(function (_a) {
                    var folder = _a[0], inFolder = _a[1];
                    return (<Box key={"".concat(key, "-").concat(group.kind, "-in-").concat(mark(folder).replace(':', '-'))} flexDirection="column">
                {Svg ? (<Box minWidth={0} overflow="hidden">
                    <Svg key={"".concat(key, "-").concat(group.kind, "-folder-").concat(mark(folder).replace(':', '-'))} source={wordsSvg([{ words: middleCut(folder, 44), color: '#9a9890' }], LINE_W)} alt={folder} width={LINE_W} height={LIST_H}/>
                  </Box>) : (<Text dimColor wrap="truncate-end">{folder}</Text>)}
                {inFolder.map(function (one) {
                            var row = "".concat(key, "-").concat(group.kind, "-").concat(mark(one.path).replace(':', '-'));
                            return (<Box key={row} flexDirection="row" alignItems="center" gap={1} minWidth={0}>
                      {Svg ? (<Box flexShrink={0}>
                          <Svg key={"".concat(row, "-icon")} source={svgOfIcon('file', 16, 18, one.path)} alt={"".concat(endingOf(one.path) || 'Text', " file")} width={16} height={18}/>
                        </Box>) : null}
                      <Box flexGrow={1} flexShrink={1} minWidth={0} overflow="hidden">
                        <Button key={"".concat(row, "-open-").concat(presses).concat(gen)} label={fileName(one.path)} plain hover={{ underline: true }} onPress={function (press) { var _a; return void showFile($, one, (_a = code.since) !== null && _a !== void 0 ? _a : 0, owner, press.surface); }}/>
                      </Box>
                      <Box flexShrink={0}>{countsOf(one, row, { most: most }, Boolean(one.isNew))}</Box>
                    </Box>);
                        })}
              </Box>);
                })}
          </Box>);
        })}
      {list.length > CHANGED_MOST ? (<Box alignItems="flex-start">
          <Button key={"".concat(key, "-code-all-").concat(presses).concat(gen)} label={isAll ? 'Show less' : "Show all ".concat(list.length)} plain dimColor onPress={function () { return void ((presses += 1), isAll ? openPiles.delete("".concat(pane, ":code")) : openPiles.add("".concat(pane, ":code")), redraw($)); }}/>
        </Box>) : null}
    </Box>);
};
// A press on a changed file shows it in the desktop app's own Files pane, beside the chat, through the app's view tool. Where the
// app has no Files pane (the terminal, an app without the tool) or will not show it (a file outside the chat's folders), what changed
// in it opens in a tab of the panel instead
var showFile = function ($, file, since, owner, surface) { return __awaiter(_this, void 0, void 0, function () {
    var shown, said_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                if (!(surface !== 'terminal')) return [3 /*break*/, 3];
                return [4 /*yield*/, $.mcp.call('ccd_view', 'show_pane', { pane: 'file', path: file.path }).catch(function (err) { return ({ isError: true, content: [{ type: 'text', text: String(err) }] }); })];
            case 1:
                shown = _a.sent();
                said_2 = shown.content.map(function (one) { return ('text' in one ? String(one.text) : ''); }).join(' ');
                if (!shown.isError)
                    return [2 /*return*/];
                return [4 /*yield*/, log($, "".concat(file.path, " not shown in the Files pane, its changes open in a tab: ").concat(cut(said_2, 160)))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                openDiff($, file, since, owner);
                return [2 /*return*/];
        }
    });
}); };
// ---- What changed in one file, in a tab of the panel ----
// The tab is named after the file: the file's name over its folder and counts, Details (or Result) to go back, Whole file or
// Changes, then what changed, drawn by Claude Code itself as a diff, or the whole file. A file new since the task began is drawn
// whole. The tab finds its file again after a reload in the paths its task wrote, or its result kept
var DIFF_PANE = 'diff-';
// The most characters of a diff or a file one drawing takes (the engine's Code takes 100000 in one drawing)
var DIFF_CHARS = 90000;
var diffPaneOf = function (path) { return "".concat(DIFF_PANE).concat(mark(path).replace(':', '-')); };
var diffs = new Map();
// The tabs showing their whole file rather than what changed
var diffWhole = new Set();
var openDiff = function ($, file, since, owner) {
    var _a;
    var id = diffPaneOf(file.path);
    if (diffs.size > 100)
        diffs.delete((_a = diffs.keys().next().value) !== null && _a !== void 0 ? _a : '');
    diffs.set(id, { file: file, since: since, owner: owner });
    void comingTab((function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, front($, id, cut(fileName(file.path), 30))];
                case 1:
                    _a.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); })()).catch(function (err) { return log($, "changes of ".concat(file.path, " not opened: ").concat(String(err))); });
};
// After a reload: the card or the result whose listing holds the file
var diffOf = function ($, id) { return __awaiter(_this, void 0, void 0, function () {
    var known, _i, _a, _b, owner, kept, file, _c, _d, r, file, _e, _f, one, path;
    var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                known = diffs.get(id);
                if (known)
                    return [2 /*return*/, known];
                for (_i = 0, _a = __spreadArray([], madeOf.entries(), true).map(function (_a) {
                    var one = _a[0], made = _a[1];
                    return [one, made.files];
                }).concat(__spreadArray([], madeOfOld.entries(), true)); _i < _a.length; _i++) {
                    _b = _a[_i], owner = _b[0], kept = _b[1];
                    file = (_h = (_g = kept.code) === null || _g === void 0 ? void 0 : _g.files) === null || _h === void 0 ? void 0 : _h.find(function (one) { return diffPaneOf(one.path) === id; });
                    if (file)
                        return [2 /*return*/, { file: file, since: (_k = (_j = kept.code) === null || _j === void 0 ? void 0 : _j.since) !== null && _k !== void 0 ? _k : 0, owner: owner }];
                }
                _c = 0;
                return [4 /*yield*/, read($, reports)];
            case 1:
                _d = _u.sent();
                _u.label = 2;
            case 2:
                if (!(_c < _d.length)) return [3 /*break*/, 4];
                r = _d[_c];
                file = (_o = (_m = (_l = r.made) === null || _l === void 0 ? void 0 : _l.code) === null || _m === void 0 ? void 0 : _m.files) === null || _o === void 0 ? void 0 : _o.find(function (one) { return diffPaneOf(one.path) === id; });
                if (file)
                    return [2 /*return*/, { file: file, since: (_r = (_q = (_p = r.made) === null || _p === void 0 ? void 0 : _p.code) === null || _q === void 0 ? void 0 : _q.since) !== null && _r !== void 0 ? _r : 0, owner: r.id }];
                _u.label = 3;
            case 3:
                _c++;
                return [3 /*break*/, 2];
            case 4:
                _e = 0;
                return [4 /*yield*/, read($, todos)];
            case 5:
                _f = _u.sent();
                _u.label = 6;
            case 6:
                if (!(_e < _f.length)) return [3 /*break*/, 8];
                one = _f[_e];
                path = ((_s = one.wrote) !== null && _s !== void 0 ? _s : []).find(function (path) { return diffPaneOf(path) === id; });
                if (path)
                    return [2 /*return*/, { file: { path: path, inRepo: '', plus: 0, minus: 0 }, since: Math.floor(((_t = one.begunAt) !== null && _t !== void 0 ? _t : one.startedAt) / 1000), owner: one.id }];
                _u.label = 7;
            case 7:
                _e++;
                return [3 /*break*/, 6];
            case 8: return [2 /*return*/, undefined];
        }
    });
}); };
// What changed in the file since the task began, against the repo as it stood then, as unified-diff hunks; a file that was not
// there then, the file itself
var DIFF_OF = 'cd "$1" || exit 1; f=$3; base=$(git rev-list -1 --before="$2" HEAD 2>/dev/null); [ -n "$base" ] || base=4b825dc642cb6eb9a060e54bf8d69288fbee4904; if git cat-file -e "$base:$f" 2>/dev/null; then git diff --no-color --no-ext-diff -U3 "$base" -- "$f"; else echo NEW; fi; exit 0 # the changes tab';
// A diff cut to fit: whole hunks while they fit, then the part of the next that fits, its header counted again so it still parses
var diffCut = function (text, most) {
    var _a, _b;
    var lines = text.split('\n');
    var from = lines.findIndex(function (line) { return line.startsWith('@@'); });
    if (from < 0)
        return { source: '', isCut: false };
    var out = [];
    var size = 0;
    var hunk;
    var close = function () {
        if (hunk)
            out[hunk.at] = "@@ -".concat(hunk.oldFrom, ",").concat(hunk.old, " +").concat(hunk.nowFrom, ",").concat(hunk.now, " @@");
    };
    for (var _i = 0, _c = lines.slice(from); _i < _c.length; _i++) {
        var line = _c[_i];
        if (size + line.length + 1 > most)
            return (close(), { source: out.join('\n'), isCut: true });
        size += line.length + 1;
        var head = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
        if (head) {
            close();
            hunk = { at: out.length, old: 0, now: 0, oldFrom: (_a = head[1]) !== null && _a !== void 0 ? _a : '1', nowFrom: (_b = head[2]) !== null && _b !== void 0 ? _b : '1' };
        }
        else if (hunk && line.startsWith(' '))
            ((hunk.old += 1), (hunk.now += 1));
        else if (hunk && line.startsWith('-'))
            hunk.old += 1;
        else if (hunk && line.startsWith('+'))
            hunk.now += 1;
        out.push(line);
    }
    close();
    return { source: out.join('\n').replace(/\n+$/, ''), isCut: false };
};
// What a tab last read, by the tab and the file as it stood, so a redraw reads nothing again
var diffRead = new Map();
var diffView = function ($, ui, paneId) { return __awaiter(_this, void 0, void 0, function () {
    var Box, Button, Text, found, file, since, owner, stat, isWhole, got, readKey, top_3, r, _a, whole_1, isNew, diff, showsWhole, wholeText, wholeCut, card, result, _b, folder, table, lines, body;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                Box = ui.Box, Button = ui.Button, Text = ui.Text;
                return [4 /*yield*/, diffOf($, paneId)];
            case 1:
                found = _h.sent();
                if (!found)
                    return [2 /*return*/, <Text dimColor>This file is no longer listed.</Text>];
                file = found.file, since = found.since, owner = found.owner;
                return [4 /*yield*/, $.fs.stat(file.path).catch(function () { return undefined; })];
            case 2:
                stat = _h.sent();
                isWhole = diffWhole.has(paneId);
                got = diffRead.get(paneId);
                readKey = "".concat(file.path, ":").concat(since, ":").concat((_c = stat === null || stat === void 0 ? void 0 : stat.mtimeMs) !== null && _c !== void 0 ? _c : 0);
                if (!(stat && (!got || got.key !== readKey))) return [3 /*break*/, 8];
                return [4 /*yield*/, repoTop($, file.path.slice(0, file.path.lastIndexOf('/')))];
            case 3:
                top_3 = _h.sent();
                if (!top_3) return [3 /*break*/, 5];
                return [4 /*yield*/, $.process.run(['sh', '-c', DIFF_OF, 'sh', top_3, String(since), file.path.slice(top_3.length + 1)], { timeoutMs: 8000 }).catch(function () { return undefined; })];
            case 4:
                _a = _h.sent();
                return [3 /*break*/, 6];
            case 5:
                _a = undefined;
                _h.label = 6;
            case 6:
                r = _a;
                return [4 /*yield*/, $.fs.read(file.path).then(function (text) { return String(text); }, function () { return ''; })];
            case 7:
                whole_1 = _h.sent();
                got = { key: readKey, text: (r === null || r === void 0 ? void 0 : r.exitCode) === 0 ? r.stdout : '', whole: whole_1 };
                if (diffRead.size > 20)
                    diffRead.delete((_d = diffRead.keys().next().value) !== null && _d !== void 0 ? _d : '');
                diffRead.set(paneId, got);
                _h.label = 8;
            case 8:
                isNew = (got === null || got === void 0 ? void 0 : got.text.trim()) === 'NEW';
                diff = diffCut((_e = got === null || got === void 0 ? void 0 : got.text) !== null && _e !== void 0 ? _e : '', DIFF_CHARS);
                showsWhole = isWhole || isNew;
                wholeText = (_f = got === null || got === void 0 ? void 0 : got.whole) !== null && _f !== void 0 ? _f : '';
                wholeCut = wholeText.length > DIFF_CHARS ? wholeText.slice(0, wholeText.lastIndexOf('\n', DIFF_CHARS)) : wholeText;
                return [4 /*yield*/, read($, todos)];
            case 9:
                card = (_h.sent()).find(function (one) { return one.id === owner; });
                if (!card) return [3 /*break*/, 10];
                _b = undefined;
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, read($, reports)];
            case 11:
                _b = (_h.sent()).find(function (r) { return r.id === owner; });
                _h.label = 12;
            case 12:
                result = _b;
                folder = file.inRepo.includes('/') ? file.inRepo.slice(0, file.inRepo.lastIndexOf('/')) : file.path.slice(0, file.path.lastIndexOf('/'));
                table = ui;
                lines = (showsWhole ? wholeCut : diff.source).split('\n');
                body = !stat ? (<Text dimColor wrap="wrap">{"This file isn't here anymore."}</Text>) : showsWhole ? (table.Code ? <table.Code key="diff-whole" source={wholeCut} path={file.path} startLine={1}/> : lines.map(function (line, n) { return <Text key={"diff-line-".concat(n)} wrap="wrap">{line || ' '}</Text>; })) : !diff.source ? (<Text dimColor wrap="wrap">Nothing in it differs from when the task began.</Text>) : table.Code ? (<table.Code key="diff-changes" source={diff.source} path={file.path} format="diff"/>) : (lines.map(function (line, n) { return <Text key={"diff-line-".concat(n)} color={line.startsWith('+') ? 'success' : line.startsWith('-') ? 'error' : undefined} dimColor={line.startsWith('@@')} wrap="wrap">{line || ' '}</Text>; }));
                return [2 /*return*/, (<Box key="diff" flexDirection="column" gap={1} flexGrow={1}>
      <Box key="diff-head" flexDirection="column" backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
        <Text bold wrap="wrap">{fileName(file.path)}</Text>
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {folder ? <Text dimColor>{"".concat(folder, " \u00B7")}</Text> : null}
          {isNew || file.isNew ? <Text dimColor>new ·</Text> : null}
          {file.inRepo ? <Text color="success">{"+".concat(file.plus.toLocaleString('en-US'))}</Text> : null}
          {file.inRepo ? <Text color="error" dimColor={!file.minus}>{"\u2212".concat(file.minus.toLocaleString('en-US'))}</Text> : null}
        </Box>
        {card || result ? <Text dimColor wrap="wrap">{"of the task \u201C".concat(cut(card ? titleOf(card) : ((_g = result === null || result === void 0 ? void 0 : result.title) !== null && _g !== void 0 ? _g : ''), 40), "\u201D")}</Text> : null}
        <Box flexDirection="row" gap={2} flexShrink={0}>
          {card ? <Button key={"diff-details-".concat(presses)} label="Details" plain onPress={function () { return openWork($, card.id); }}/> : null}
          {result ? <Button key={"diff-result-".concat(presses)} label="Result" plain onPress={function () { return openReport($, result.id); }}/> : null}
          {stat && !isNew ? <Button key={"diff-whole-".concat(presses)} label={isWhole ? 'Changes' : 'Whole file'} plain onPress={function () { return void ((presses += 1), isWhole ? diffWhole.delete(paneId) : diffWhole.add(paneId), redraw($)); }}/> : null}
        </Box>
      </Box>
      <Box key="diff-body" flexDirection="column" backgroundColor={OUTPUT_FILL} paddingX={1} paddingY={1} flexShrink={0}>
        {(showsWhole ? wholeCut.length < wholeText.length : diff.isCut) ? <Text dimColor>{"The first ".concat(lines.length.toLocaleString('en-US'), " lines")}</Text> : null}
        {body}
      </Box>
    </Box>)];
        }
    });
}); };
