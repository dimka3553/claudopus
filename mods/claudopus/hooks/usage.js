"use strict";
// How Claude uses this computer, for the line above the prompt: memory in use and Claude's part of it, how busy the processor is
// and Claude's part of that, and how fast the disk and the network move. One cheap shell look every few seconds, shared by every
// chat on the computer through a small file; the figures come from two looks in a row. Nothing here touches the engine
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageSvg = exports.USAGE_GREY = exports.USAGE_AMBER = exports.USAGE_PURPLE = exports.meterOf = exports.isMemoryHigh = exports.pctText = exports.rateText = exports.gbText = exports.keptOf = exports.nextKept = exports.figuresOf = exports.rawOfLinux = exports.rawOfMac = exports.footprintOf = exports.claudeOf = exports.secondsOfTime = exports.USAGE_LINUX = exports.usageMac = exports.MEMORY_WARN = exports.FOOTPRINT_EVERY = exports.USAGE_EVERY = void 0;
// How often the computer is looked at, and how often (on a Mac) top is asked for each process's own memory, which costs about half
// a second of the processor where ps costs a hundredth
exports.USAGE_EVERY = 5000;
exports.FOOTPRINT_EVERY = 60000;
// Two looks further apart than this give no rates
var USAGE_GAP = 120000;
// Memory past this part of the whole turns amber
exports.MEMORY_WARN = 0.9;
// One look on a Mac: the engine's own process, every process with its parent, memory and processor time, the memory as Activity
// Monitor counts it, the disks' and the network's running totals, and now and then top's own memory of each process
var usageMac = function (isTop) {
    return "echo \"@@SELF@@ $PPID\"; echo @@PS@@; ps -axo pid=,ppid=,rss=,time=,comm=; echo @@VM@@; vm_stat; echo @@SYS@@; sysctl -n hw.memsize hw.ncpu; echo @@IO@@; iostat -Id -c 1; echo @@NET@@; netstat -ibn".concat(isTop ? '; echo @@TOP@@; top -l 1 -stats pid,mem' : '');
};
exports.usageMac = usageMac;
// One look on Linux, all from /proc
exports.USAGE_LINUX = "echo \"@@SELF@@ $PPID\"; echo @@STAT@@; grep -H '' /proc/[0-9]*/stat 2>/dev/null; echo @@STATM@@; grep -H '' /proc/[0-9]*/statm 2>/dev/null; echo @@SYS@@; getconf PAGESIZE; getconf CLK_TCK; head -n 1 /proc/stat; echo @@MEM@@; cat /proc/meminfo; echo @@DISK@@; cat /proc/diskstats; echo @@NET@@; cat /proc/net/dev";
var sectionsOf = function (text) {
    var _a, _b, _c, _d;
    var out = {};
    for (var _i = 0, _e = text.split(/^@@(?=[A-Z]+@@)/m).slice(1); _i < _e.length; _i++) {
        var part = _e[_i];
        var m = /^([A-Z]+)@@ ?([^\n]*)\n?([\s\S]*)$/.exec(part);
        if (m)
            out[(_a = m[1]) !== null && _a !== void 0 ? _a : ''] = m[1] === 'SELF' ? ((_b = m[2]) !== null && _b !== void 0 ? _b : '') : "".concat((_c = m[2]) !== null && _c !== void 0 ? _c : '').concat(m[2] ? '\n' : '').concat((_d = m[3]) !== null && _d !== void 0 ? _d : '');
    }
    return out;
};
// ps's processor time, [days-][hours:]minutes:seconds.hundredths
var secondsOfTime = function (time) {
    var _a = time.includes('-') ? time.split('-') : ['0', time], days = _a[0], _b = _a[1], rest = _b === void 0 ? '' : _b;
    return Number(days) * 86400 + rest.split(':').reduce(function (sum, part) { return sum * 60 + Number(part); }, 0);
};
exports.secondsOfTime = secondsOfTime;
// Claude: the app, every claude chat, the engine this runs in, and everything they started
var isClaudeName = function (name) { var _a; return /^claude$/i.test((_a = name.split('/').pop()) !== null && _a !== void 0 ? _a : ''); };
var claudeOf = function (procs, self) {
    var _a, _b, _c;
    var found = new Set(procs.filter(function (p) { return p.pid === self || isClaudeName(p.name); }).map(function (p) { return p.pid; }));
    var children = new Map();
    for (var _i = 0, procs_1 = procs; _i < procs_1.length; _i++) {
        var p = procs_1[_i];
        children.set(p.ppid, __spreadArray(__spreadArray([], ((_a = children.get(p.ppid)) !== null && _a !== void 0 ? _a : []), true), [p.pid], false));
    }
    var queue = __spreadArray([], found, true);
    for (var n = 0; n < queue.length; n++)
        for (var _d = 0, _e = (_c = children.get((_b = queue[n]) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : []; _d < _e.length; _d++) {
            var child = _e[_d];
            if (!found.has(child))
                (found.add(child), queue.push(child));
        }
    return found;
};
exports.claudeOf = claudeOf;
var sizeOf = function (amount, unit) { var _a; return Number(amount) * ((_a = { B: 1, K: 1024, M: Math.pow(1024, 2), G: Math.pow(1024, 3), T: Math.pow(1024, 4) }[unit]) !== null && _a !== void 0 ? _a : 1); };
// top's memory column: 1097M, 625M+, 12K-
var footprintOf = function (text) {
    var _a, _b, _c;
    var byPid = {};
    for (var _i = 0, _d = text.matchAll(/^\s*(\d+)\s+([\d.]+)([BKMGT])[+-]?\s*$/gm); _i < _d.length; _i++) {
        var m = _d[_i];
        byPid[(_a = m[1]) !== null && _a !== void 0 ? _a : ''] = sizeOf((_b = m[2]) !== null && _b !== void 0 ? _b : '0', (_c = m[3]) !== null && _c !== void 0 ? _c : 'B');
    }
    return byPid;
};
exports.footprintOf = footprintOf;
// A Mac's look as running totals; Claude's memory is top's where it has the process, else its resident memory
var rawOfMac = function (text, at, footprint) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var s = sectionsOf(text);
    var procs = ((_a = s.PS) !== null && _a !== void 0 ? _a : '').split('\n').flatMap(function (line) {
        var _a, _b, _c, _d;
        var m = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+([\d:.-]+)\s+(.*)$/.exec(line);
        return m ? [{ pid: (_a = m[1]) !== null && _a !== void 0 ? _a : '', ppid: (_b = m[2]) !== null && _b !== void 0 ? _b : '', mem: Number(m[3]) * 1024, cpu: (0, exports.secondsOfTime)((_c = m[4]) !== null && _c !== void 0 ? _c : '0'), name: ((_d = m[5]) !== null && _d !== void 0 ? _d : '').trim() }] : [];
    });
    var vm = (_b = s.VM) !== null && _b !== void 0 ? _b : '';
    var page = Number((_d = (_c = /page size of (\d+) bytes/.exec(vm)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 4096);
    var pages = function (label) { var _a, _b; return Number((_b = (_a = new RegExp("^".concat(label, ":\\s+(\\d+)"), 'm').exec(vm)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0); };
    var _r = ((_e = s.SYS) !== null && _e !== void 0 ? _e : '').trim().split(/\s+/).map(Number), _s = _r[0], memTotal = _s === void 0 ? 0 : _s, _t = _r[1], ncpu = _t === void 0 ? 1 : _t;
    if (!procs.length || !memTotal)
        return undefined;
    // As Activity Monitor's Memory Used: app memory, wired and compressed
    var memUsed = Math.max(0, pages('Anonymous pages') - pages('Pages purgeable') + pages('Pages wired down') + pages('Pages occupied by compressor')) * page;
    // iostat -I: the disks by name, then each one's KB/t, transfers and megabytes since it started
    var ioLines = ((_f = s.IO) !== null && _f !== void 0 ? _f : '').split('\n').map(function (line) { return line.trim(); });
    var names = ((_g = ioLines.find(function (line) { return /^disk\d/.test(line); })) !== null && _g !== void 0 ? _g : '').split(/\s+/);
    var ioRow = (_h = ioLines.filter(function (line) { return /^[\d.\s]+$/.test(line) && line; }).pop()) !== null && _h !== void 0 ? _h : '';
    var disk = {};
    ioRow.split(/\s+/).map(Number).forEach(function (mb, i) { var _a; return void (i % 3 === 2 && (disk[(_a = names[(i - 2) / 3]) !== null && _a !== void 0 ? _a : "disk-".concat(i)] = mb * 1024 * 1024)); });
    // The Mac's own network ports (en*), not the tunnels that carry the same bytes again
    var net = {};
    for (var _i = 0, _u = ((_j = s.NET) !== null && _j !== void 0 ? _j : '').split('\n'); _i < _u.length; _i++) {
        var line = _u[_i];
        var t = line.trim().split(/\s+/);
        if (!/^en\d+$/.test((_k = t[0]) !== null && _k !== void 0 ? _k : '') || !((_l = t[2]) !== null && _l !== void 0 ? _l : '').startsWith('<Link'))
            continue;
        var _v = t.length >= 11 ? [6, 9] : [5, 8], inAt = _v[0], outAt = _v[1];
        net[(_m = t[0]) !== null && _m !== void 0 ? _m : ''] = Number((_o = t[inAt]) !== null && _o !== void 0 ? _o : 0) + Number((_p = t[outAt]) !== null && _p !== void 0 ? _p : 0);
    }
    var claude = (0, exports.claudeOf)(procs, ((_q = s.SELF) !== null && _q !== void 0 ? _q : '').trim());
    var claudeMem = procs.filter(function (p) { return claude.has(p.pid); }).reduce(function (sum, p) { var _a; return sum + ((_a = footprint === null || footprint === void 0 ? void 0 : footprint[p.pid]) !== null && _a !== void 0 ? _a : p.mem); }, 0);
    return { at: at, cpu: Object.fromEntries(procs.map(function (p) { return [p.pid, p.cpu]; })), claude: __spreadArray([], claude, true), claudeMem: claudeMem, memUsed: memUsed, memTotal: memTotal, ncpu: ncpu || 1, disk: disk, net: net };
};
exports.rawOfMac = rawOfMac;
// A Linux look: processes from /proc/<pid>/stat (Claude's memory is each process's resident memory less what it shares)
var rawOfLinux = function (text, at) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var s = sectionsOf(text);
    var _u = ((_a = s.SYS) !== null && _a !== void 0 ? _a : '').split('\n').slice(0, 2).map(Number), _v = _u[0], page = _v === void 0 ? 4096 : _v, _w = _u[1], tck = _w === void 0 ? 100 : _w;
    var cpuLine = (_c = ((_b = s.SYS) !== null && _b !== void 0 ? _b : '').split('\n').find(function (line) { return line.startsWith('cpu '); })) !== null && _c !== void 0 ? _c : '';
    var ticks = cpuLine.trim().split(/\s+/).slice(1).map(Number);
    var all = ticks.slice(0, 8).reduce(function (a, b) { return a + b; }, 0) / tck;
    var busy = all - (((_d = ticks[3]) !== null && _d !== void 0 ? _d : 0) + ((_e = ticks[4]) !== null && _e !== void 0 ? _e : 0)) / tck;
    var statm = new Map();
    for (var _i = 0, _x = ((_f = s.STATM) !== null && _f !== void 0 ? _f : '').matchAll(/^\/proc\/(\d+)\/statm:\d+\s+(\d+)\s+(\d+)/gm); _i < _x.length; _i++) {
        var m = _x[_i];
        statm.set((_g = m[1]) !== null && _g !== void 0 ? _g : '', Math.max(0, Number(m[2]) - Number(m[3])) * page);
    }
    var procs = ((_h = s.STAT) !== null && _h !== void 0 ? _h : '').split('\n').flatMap(function (line) {
        var _a, _b, _c, _d, _e, _f, _g;
        var m = /^\/proc\/(\d+)\/stat:\d+ \((.*)\) (.*)$/.exec(line);
        if (!m)
            return [];
        var f = ((_a = m[3]) !== null && _a !== void 0 ? _a : '').split(' ');
        return [{ pid: (_b = m[1]) !== null && _b !== void 0 ? _b : '', ppid: (_c = f[1]) !== null && _c !== void 0 ? _c : '', cpu: (Number(f[11]) + Number(f[12])) / tck, mem: (_e = statm.get((_d = m[1]) !== null && _d !== void 0 ? _d : '')) !== null && _e !== void 0 ? _e : Number((_f = f[21]) !== null && _f !== void 0 ? _f : 0) * page, name: (_g = m[2]) !== null && _g !== void 0 ? _g : '' }];
    });
    var kb = function (label) { var _a, _b, _c; return Number((_c = (_b = new RegExp("^".concat(label, ":\\s+(\\d+)"), 'm').exec((_a = s.MEM) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 0) * 1024; };
    var memTotal = kb('MemTotal');
    if (!procs.length || !memTotal)
        return undefined;
    // Whole disks only, not their partitions: 512-byte sectors read and written
    var disk = {};
    for (var _y = 0, _z = ((_j = s.DISK) !== null && _j !== void 0 ? _j : '').split('\n'); _y < _z.length; _y++) {
        var line = _z[_y];
        var f = line.trim().split(/\s+/);
        if (/^(sd[a-z]+|vd[a-z]+|xvd[a-z]+|hd[a-z]+|nvme\d+n\d+|mmcblk\d+)$/.test((_k = f[2]) !== null && _k !== void 0 ? _k : ''))
            disk[(_l = f[2]) !== null && _l !== void 0 ? _l : ''] = (Number(f[5]) + Number(f[9])) * 512;
    }
    // The machine's own ports, not loopback, tunnels or containers' bridges
    var net = {};
    for (var _0 = 0, _1 = ((_m = s.NET) !== null && _m !== void 0 ? _m : '').split('\n'); _0 < _1.length; _0++) {
        var line = _1[_0];
        var m = /^\s*([^:\s]+):\s*(.*)$/.exec(line);
        if (!m || /^(lo|tailscale|docker|veth|br-|virbr|vnet|vmnet|lxc|podman|wg|tun|tap|ip6tnl|cni|flannel|cali|zt)/.test((_o = m[1]) !== null && _o !== void 0 ? _o : ''))
            continue;
        var f = ((_p = m[2]) !== null && _p !== void 0 ? _p : '').trim().split(/\s+/).map(Number);
        net[(_q = m[1]) !== null && _q !== void 0 ? _q : ''] = ((_r = f[0]) !== null && _r !== void 0 ? _r : 0) + ((_s = f[8]) !== null && _s !== void 0 ? _s : 0);
    }
    var claude = (0, exports.claudeOf)(procs, ((_t = s.SELF) !== null && _t !== void 0 ? _t : '').trim());
    var claudeMem = procs.filter(function (p) { return claude.has(p.pid); }).reduce(function (sum, p) { return sum + p.mem; }, 0);
    return { at: at, cpu: Object.fromEntries(procs.map(function (p) { return [p.pid, p.cpu]; })), claude: __spreadArray([], claude, true), claudeMem: claudeMem, memUsed: Math.max(0, memTotal - kb('MemAvailable')), memTotal: memTotal, ncpu: 1, disk: disk, net: net, busy: busy, all: all };
};
exports.rawOfLinux = rawOfLinux;
var clamp = function (n) { return Math.min(1, Math.max(0, n)); };
// Bytes moved between two looks by the disks or ports that were in both
var movedOf = function (prev, cur) {
    return Object.entries(cur).reduce(function (sum, _a) {
        var _b;
        var name = _a[0], n = _a[1];
        return sum + (typeof prev[name] === 'number' ? Math.max(0, n - ((_b = prev[name]) !== null && _b !== void 0 ? _b : 0)) : 0);
    }, 0);
};
// The figures from two looks: memory from the newer alone, the rest from what moved between them
var figuresOf = function (prev, cur) {
    var _a, _b;
    var memory = { memUsed: cur.memUsed, memTotal: cur.memTotal, memClaude: Math.min(cur.claudeMem, cur.memUsed || cur.claudeMem) };
    var span = prev ? (cur.at - prev.at) / 1000 : 0;
    if (!prev || span < 1 || span * 1000 > USAGE_GAP)
        return memory;
    // Each process's time since the last look; one not there then started since, so all its time is new
    var claude = new Set(cur.claude);
    var used = 0;
    var mine = 0;
    for (var _i = 0, _c = Object.entries(cur.cpu); _i < _c.length; _i++) {
        var _d = _c[_i], pid = _d[0], t = _d[1];
        var was = prev.cpu[pid];
        var d = was === undefined || was > t ? t : t - was;
        used += d;
        if (claude.has(pid))
            mine += d;
    }
    var whole = cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? cur.all - prev.all : span * cur.ncpu;
    var cpu = cur.busy !== undefined && prev.busy !== undefined && cur.all !== undefined && prev.all !== undefined && cur.all > prev.all ? clamp((cur.busy - prev.busy) / whole) : clamp(used / whole);
    return __assign(__assign({}, memory), { cpu: cpu, cpuClaude: Math.min(cpu, clamp(mine / whole)), disk: movedOf((_a = prev.disk) !== null && _a !== void 0 ? _a : {}, cur.disk) / span, net: movedOf((_b = prev.net) !== null && _b !== void 0 ? _b : {}, cur.net) / span });
};
exports.figuresOf = figuresOf;
// The next kept state from a look: top's memory kept for a minute, the figures against the look before
var nextKept = function (was, text, at, isLinux, isTop) {
    var _a;
    if (isTop === void 0) { isTop = false; }
    var top = isLinux ? {} : (0, exports.footprintOf)((_a = sectionsOf(text).TOP) !== null && _a !== void 0 ? _a : '');
    var footprint = Object.keys(top).length ? { at: at, byPid: top } : (was === null || was === void 0 ? void 0 : was.footprint) && at - was.footprint.at < exports.FOOTPRINT_EVERY * 3 ? was.footprint : undefined;
    var raw = isLinux ? (0, exports.rawOfLinux)(text, at) : (0, exports.rawOfMac)(text, at, footprint === null || footprint === void 0 ? void 0 : footprint.byPid);
    if (!raw)
        return undefined;
    var topAt = isTop ? at : was === null || was === void 0 ? void 0 : was.topAt;
    return __assign(__assign({ at: at, raw: raw, figures: (0, exports.figuresOf)(was === null || was === void 0 ? void 0 : was.raw, raw) }, (footprint ? { footprint: footprint } : {})), (topAt !== undefined ? { topAt: topAt } : {}));
};
exports.nextKept = nextKept;
// The shared file's state, when it reads as one
var keptOf = function (text) {
    try {
        var kept = JSON.parse(text);
        return typeof (kept === null || kept === void 0 ? void 0 : kept.at) === 'number' && kept.raw && typeof kept.raw.disk === 'object' && kept.figures ? kept : undefined;
    }
    catch (_a) {
        return undefined;
    }
};
exports.keptOf = keptOf;
// ---- How the figures read ----
var GB = Math.pow(1024, 3);
var gbText = function (bytes) {
    var gb = bytes / GB;
    return gb < 10 ? "".concat(gb.toFixed(1).replace(/\.0$/, '')) : "".concat(Math.round(gb));
};
exports.gbText = gbText;
// A speed in the fewest characters, so the line fits a phone: whole MB/s, a tenth under one, GB/s past a thousand megabytes
var rateText = function (perSecond) {
    var mb = perSecond / 1e6;
    if (mb >= 999.5)
        return [(mb / 1000).toFixed(1).replace(/\.0$/, ''), 'GB/s'];
    if (mb >= 0.95)
        return [String(Math.round(mb)), 'MB/s'];
    return [mb.toFixed(1).replace(/\.0$/, '').replace(/^0\.0$/, '0'), 'MB/s'];
};
exports.rateText = rateText;
var pctText = function (part) { return "".concat(Math.round(part * 100)); };
exports.pctText = pctText;
var isMemoryHigh = function (f) { return f.memTotal > 0 && f.memUsed / f.memTotal > exports.MEMORY_WARN; };
exports.isMemoryHigh = isMemoryHigh;
// A meter's parts in whole steps: Claude's first, then the rest in use; a part that is there is never drawn as none
var meterOf = function (claude, used, steps) {
    var mine = claude > 0.005 ? Math.max(1, Math.round(clamp(claude) * steps)) : 0;
    var all = Math.max(mine, used > 0.005 ? Math.max(1, Math.round(clamp(used) * steps)) : 0);
    return { mine: Math.min(mine, steps), rest: Math.min(all, steps) - Math.min(mine, steps) };
};
exports.meterOf = meterOf;
// ---- The small drawings, for a surface that draws SVG ----
exports.USAGE_PURPLE = '#8A63F0';
exports.USAGE_AMBER = '#E5A50A';
exports.USAGE_GREY = '#9A9A9A';
// The icons a little lighter than the meters' grey, as the numbers beside them are
var ICON_GREY = '#BDBDBD';
var TRACK = 'rgba(154,154,154,0.28)';
var ICON = 15;
var METER_W = 18;
var METER_H = 8;
var H = 16;
var icons = {
    // A memory stick: its board with chips and the pins beneath
    memory: function (c) {
        return "<rect x=\"1\" y=\"4\" width=\"12\" height=\"6\" rx=\"1\" fill=\"none\" stroke=\"".concat(c, "\" stroke-width=\"1.3\"/><rect x=\"3\" y=\"6\" width=\"2\" height=\"2\" fill=\"").concat(c, "\"/><rect x=\"6\" y=\"6\" width=\"2\" height=\"2\" fill=\"").concat(c, "\"/><rect x=\"9\" y=\"6\" width=\"2\" height=\"2\" fill=\"").concat(c, "\"/><path d=\"M3 10v2M5.5 10v2M8.5 10v2M11 10v2\" stroke=\"").concat(c, "\" stroke-width=\"1.2\"/>");
    },
    // A chip with pins on each side
    cpu: function (c) {
        return "<rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"".concat(c, "\" stroke-width=\"1.3\"/><rect x=\"5.5\" y=\"5.5\" width=\"3\" height=\"3\" fill=\"").concat(c, "\"/><path d=\"M5.5 1.5v2M8.5 1.5v2M5.5 10.5v2M8.5 10.5v2M1.5 5.5h2M1.5 8.5h2M10.5 5.5h2M10.5 8.5h2\" stroke=\"").concat(c, "\" stroke-width=\"1.2\"/>");
    },
    // A disk drive's stacked platters
    disk: function (c) {
        return "<ellipse cx=\"7\" cy=\"3.5\" rx=\"5\" ry=\"2\" fill=\"none\" stroke=\"".concat(c, "\" stroke-width=\"1.3\"/><path d=\"M2 3.5v7c0 1.1 2.2 2 5 2s5-.9 5-2v-7M2 7c0 1.1 2.2 2 5 2s5-.9 5-2\" fill=\"none\" stroke=\"").concat(c, "\" stroke-width=\"1.3\"/>");
    },
    // Up and down arrows
    net: function (c) { return "<path d=\"M4.5 12V2M2 4.5L4.5 2L7 4.5M9.5 2v10M7 9.5L9.5 12L12 9.5\" fill=\"none\" stroke=\"".concat(c, "\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"); },
};
// An icon alone, or with its meter: Claude's part purple, the rest in use grey (amber when memory is near full), the room left faint
var usageSvg = function (icon, meter) {
    var color = (meter === null || meter === void 0 ? void 0 : meter.isHigh) ? exports.USAGE_AMBER : exports.USAGE_GREY;
    var iconColor = (meter === null || meter === void 0 ? void 0 : meter.isHigh) ? exports.USAGE_AMBER : ICON_GREY;
    var width = (meter ? ICON + 3 + METER_W : ICON) + 3;
    var top = (H - ICON) / 2;
    var parts = ["<g transform=\"translate(0 ".concat(top, ") scale(").concat(ICON / 14, ")\">").concat(icons[icon](iconColor), "</g>")];
    if (meter) {
        // Claude's part at least two pixels, so a small one is still seen beside amber
        var parts18 = (0, exports.meterOf)(meter.claude, meter.used, METER_W);
        var mine = parts18.mine ? Math.max(2, parts18.mine) : 0;
        var rest = Math.max(0, Math.min(METER_W, parts18.mine + parts18.rest, METER_W) - mine);
        var clip_1 = "meter-".concat(icon);
        var x = ICON + 3;
        var y = (H - METER_H) / 2;
        parts.push("<clipPath id=\"".concat(clip_1, "\"><rect x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(METER_W, "\" height=\"").concat(METER_H, "\" rx=\"2\"/></clipPath><g clip-path=\"url(#").concat(clip_1, ")\"><rect x=\"").concat(x, "\" y=\"").concat(y, "\" width=\"").concat(METER_W, "\" height=\"").concat(METER_H, "\" fill=\"").concat(TRACK, "\"/>").concat(mine ? "<rect x=\"".concat(x, "\" y=\"").concat(y, "\" width=\"").concat(mine, "\" height=\"").concat(METER_H, "\" fill=\"").concat(exports.USAGE_PURPLE, "\"/>") : '').concat(rest ? "<rect x=\"".concat(x + mine, "\" y=\"").concat(y, "\" width=\"").concat(rest, "\" height=\"").concat(METER_H, "\" fill=\"").concat(color, "\"/>") : '', "</g>"));
    }
    return { source: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(H, "\" viewBox=\"0 0 ").concat(width, " ").concat(H, "\">").concat(parts.join(''), "</svg>"), width: width, height: H };
};
exports.usageSvg = usageSvg;
