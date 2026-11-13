// The servers on this Mac: what listens on which port, from which folder, started by which chat, and the Servers tab
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
// ---- The servers on this Mac: what listens on which port, from which folder, started by which chat ----
var rows = function (text) { return text.split('\n').filter(Boolean); };
// The engine process of a chat, as `ps` names it; the app itself is `Claude`
var isEngine = function (path) { return path.endsWith('/MacOS/claude'); };
// "node /long/path/.bin/next dev" reads as "node next dev"
var short = function (args) {
    return args
        .split(' ')
        .map(function (part) { var _a; return (part.startsWith('/') ? ((_a = part.split('/').pop()) !== null && _a !== void 0 ? _a : part) : part); })
        .join(' ')
        .slice(0, 50);
};
var scanServers = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var home, run, ports, pid, _i, _a, _b, row, port, pids, folders, _c, _d, _e, row, commands, _f, _g, _h, row, m, table, _j, _k, _l, row, m, above, chats, _m, _o, entry, one, _p, _q, name_1, seen, _r, _s, kept, found, _t, ports_1, _u, id, list, folder, isScratch, port, chat, command, hasPages, place;
    var _this = this;
    var _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    return __generator(this, function (_13) {
        switch (_13.label) {
            case 0:
                scannedAt = Date.now();
                return [4 /*yield*/, $.env.get('HOME')];
            case 1:
                home = (_v = (_13.sent())) !== null && _v !== void 0 ? _v : '';
                run = function (argv) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, $.process.run(argv).catch(function () { return undefined; })];
                        case 1: return [2 /*return*/, (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.stdout) !== null && _b !== void 0 ? _b : ''
                            // lsof -F prints one field a line: p<pid>, then n<address:port> for each socket of that process
                        ];
                    }
                }); }); };
                ports = new Map();
                pid = 0;
                _i = 0;
                _b = rows;
                return [4 /*yield*/, run(['lsof', '-nP', '-iTCP', '-sTCP:LISTEN', '-Fpn'])];
            case 2:
                _a = _b.apply(void 0, [_13.sent()]);
                _13.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                row = _a[_i];
                if (row.startsWith('p'))
                    pid = Number(row.slice(1));
                port = row.startsWith('n') ? row.slice(row.lastIndexOf(':') + 1) : '';
                if (port && !((_w = ports.get(pid)) === null || _w === void 0 ? void 0 : _w.includes(port)))
                    ports.set(pid, __spreadArray(__spreadArray([], ((_x = ports.get(pid)) !== null && _x !== void 0 ? _x : []), true), [port], false));
                _13.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 3];
            case 5:
                if (!ports.size)
                    return [2 /*return*/, update($, servers, function () { return []; })];
                pids = __spreadArray([], ports.keys(), true).join(',');
                folders = new Map();
                _c = 0;
                _e = rows;
                return [4 /*yield*/, run(['lsof', '-a', '-d', 'cwd', '-Fpn', '-p', pids])];
            case 6:
                _d = _e.apply(void 0, [_13.sent()]);
                _13.label = 7;
            case 7:
                if (!(_c < _d.length)) return [3 /*break*/, 9];
                row = _d[_c];
                if (row.startsWith('p'))
                    pid = Number(row.slice(1));
                else if (row.startsWith('n'))
                    folders.set(pid, row.slice(1));
                _13.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 7];
            case 9:
                commands = new Map();
                _f = 0;
                _h = rows;
                return [4 /*yield*/, run(['ps', '-o', 'pid=,args=', '-p', pids])];
            case 10:
                _g = _h.apply(void 0, [_13.sent()]);
                _13.label = 11;
            case 11:
                if (!(_f < _g.length)) return [3 /*break*/, 13];
                row = _g[_f];
                m = /^\s*(\d+)\s+(.*)$/.exec(row);
                if (m)
                    commands.set(Number(m[1]), (_y = m[2]) !== null && _y !== void 0 ? _y : '');
                _13.label = 12;
            case 12:
                _f++;
                return [3 /*break*/, 11];
            case 13:
                table = new Map();
                _j = 0;
                _l = rows;
                return [4 /*yield*/, run(['ps', '-A', '-o', 'pid=,ppid=,comm='])];
            case 14:
                _k = _l.apply(void 0, [_13.sent()]);
                _13.label = 15;
            case 15:
                if (!(_j < _k.length)) return [3 /*break*/, 17];
                row = _k[_j];
                m = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(row);
                if (m)
                    table.set(Number(m[1]), { parent: Number(m[2]), path: (_z = m[3]) !== null && _z !== void 0 ? _z : '' });
                _13.label = 16;
            case 16:
                _j++;
                return [3 /*break*/, 15];
            case 17:
                above = function (from, test) {
                    var _a, _b;
                    var at = (_b = (_a = table.get(from)) === null || _a === void 0 ? void 0 : _a.parent) !== null && _b !== void 0 ? _b : 0;
                    for (var hops = 0; at > 1 && hops < 15; hops += 1) {
                        var one = table.get(at);
                        if (!one)
                            return 0;
                        if (test(one.path))
                            return at;
                        at = one.parent;
                    }
                    return 0;
                };
                chats = new Map();
                _m = 0;
                return [4 /*yield*/, $.fs.list("".concat(home, "/.claude/sessions")).catch(function () { return []; })];
            case 18:
                _o = _13.sent();
                _13.label = 19;
            case 19:
                if (!(_m < _o.length)) return [3 /*break*/, 22];
                entry = _o[_m];
                if (!entry.name.endsWith('.json'))
                    return [3 /*break*/, 21];
                _q = (_p = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(home, "/.claude/sessions/").concat(entry.name))];
            case 20:
                one = _q.apply(_p, [(_13.sent()) || '{}']);
                name_1 = one.name || ((_0 = one.cwd) !== null && _0 !== void 0 ? _0 : '').split('/').pop() || 'unnamed';
                if (one.pid)
                    chats.set(String(one.pid), name_1);
                if (one.sessionId)
                    chats.set(one.sessionId, name_1);
                _13.label = 21;
            case 21:
                _m++;
                return [3 /*break*/, 19];
            case 22:
                _s = (_r = JSON).parse;
                return [4 /*yield*/, readOr($, "".concat(dir, "/servers.json"))];
            case 23:
                seen = _s.apply(_r, [(_13.sent()) || '{}']);
                kept = {};
                found = [];
                for (_t = 0, ports_1 = ports; _t < ports_1.length; _t++) {
                    _u = ports_1[_t], id = _u[0], list = _u[1];
                    folder = (_1 = folders.get(id)) !== null && _1 !== void 0 ? _1 : '';
                    isScratch = folder.startsWith('/private/tmp/') || folder.startsWith('/tmp/');
                    // A server of mine runs from one of my folders or a chat's scratch folder; the apps and the chats themselves listen too
                    if (!(folder.startsWith("".concat(home, "/")) || isScratch) || folder.startsWith("".concat(home, "/Library")) || isEngine((_3 = (_2 = table.get(id)) === null || _2 === void 0 ? void 0 : _2.path) !== null && _3 !== void 0 ? _3 : ''))
                        continue;
                    port = (_4 = list[0]) !== null && _4 !== void 0 ? _4 : '';
                    chat = (_8 = (_5 = chats.get(String(above(id, isEngine)))) !== null && _5 !== void 0 ? _5 : chats.get((_7 = (_6 = /[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.exec(folder)) === null || _6 === void 0 ? void 0 : _6[0]) !== null && _7 !== void 0 ? _7 : '')) !== null && _8 !== void 0 ? _8 : seen["".concat(id, ":").concat(port)];
                    if (chat)
                        kept["".concat(id, ":").concat(port)] = chat;
                    command = short((_11 = (_9 = commands.get(id)) !== null && _9 !== void 0 ? _9 : (_10 = table.get(id)) === null || _10 === void 0 ? void 0 : _10.path) !== null && _11 !== void 0 ? _11 : '');
                    hasPages = !NO_PAGES.test(command);
                    place = isScratch ? ((_12 = folder.split('/').pop()) !== null && _12 !== void 0 ? _12 : '') : folder.replace("".concat(home, "/Documents/GitHub/"), '').replace("".concat(home, "/"), '~/');
                    found.push({
                        pid: id,
                        port: port,
                        url: hasPages ? "http://localhost:".concat(port) : '',
                        about: [hasPages ? '' : command.split(' ')[0], place, chat].filter(Boolean).join(' · '),
                    });
                }
                found.sort(function (a, b) { return Number(a.port) - Number(b.port); });
                if (!(JSON.stringify(kept) !== JSON.stringify(seen))) return [3 /*break*/, 25];
                return [4 /*yield*/, $.fs.write("".concat(dir, "/servers.json"), JSON.stringify(kept))];
            case 24:
                _13.sent();
                _13.label = 25;
            case 25: return [4 /*yield*/, update($, servers, function () { return found; })];
            case 26:
                _13.sent();
                return [2 /*return*/];
        }
    });
}); };
// Looks at the servers again while their panel is open; each pass redraws it
var refresh = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.ui.panes().catch(function () { return []; })];
            case 1:
                open = _a.sent();
                if (!open.some(function (one) { return one.id === PANE && one.isShown; }))
                    return [2 /*return*/];
                return [4 /*yield*/, scanServers($)];
            case 2:
                _a.sent();
                return [4 /*yield*/, update($, tick, function (n) { return n + 1; })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var stopServer = function ($, pid) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.process.run(['kill', String(pid)]).catch(function (err) { return log($, "server ".concat(pid, " not stopped: ").concat(String(err))); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.clock.sleep(700)];
            case 2:
                _a.sent();
                return [4 /*yield*/, scanServers($)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var serversTabHooks = function (on) {
    // The servers panel: one block per server with its link, where it runs and which chat started it; nothing is cut off
    on('ui.render', { component: 'Pane', requestId: PANE }, function ($, e) { return __awaiter(_this, void 0, void 0, function () {
        var _a, Box, Button, Link, Text, found;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = $.ui.resolve(e), Box = _a.Box, Button = _a.Button, Link = _a.Link, Text = _a.Text;
                    if (!!scannedAt) return [3 /*break*/, 2];
                    return [4 /*yield*/, scanServers($).catch(function (err) { return log($, "servers not read: ".concat(String(err))); })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, read($, tick)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, read($, servers)];
                case 4:
                    found = _b.sent();
                    return [2 /*return*/, (<Box flexDirection="column" gap={1}>
        {found.length === 0 && <Text dimColor>Nothing is listening from your folders.</Text>}
        {found.map(function (one) { return (<Box key={"server-".concat(one.pid)} flexDirection="row" alignItems="flex-start" gap={1}>
            <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text wrap="wrap">{one.url ? <Link href={one.url} label={"localhost:".concat(one.port)}/> : "Port ".concat(one.port)}</Text>
              <Text dimColor wrap="wrap">{one.about}</Text>
            </Box>
            <Box flexShrink={0}>
              <Button key={"kill-".concat(one.pid)} label="■" onPress={function () { return void stopServer($, one.pid); }}/>
            </Box>
          </Box>); })}
      </Box>)];
            }
        });
    }); });
};
