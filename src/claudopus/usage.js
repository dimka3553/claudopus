// How Claude uses this computer, for the line above the prompt: looked at every few seconds while work runs, shared by every chat
// through one small file, so a computer with many chats open still looks once. The measuring and the drawings are in hooks/usage.ts
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
var usageKept;
var usageBusy = false;
// When this chat last tried a look, whether or not it gave figures: a look that fails waits as long as one that works
var usageTriedAt = 0;
// When this chat last asked top, whether or not the look came back: top costs half a second of the processor
var usageTopTriedAt = 0;
var usageFile = '';
// The shared file, in the person's own temporary folder (on Linux, their cache folder: /tmp is everyone's)
var usagePathOf = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var tmp, _a, home;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (usageFile)
                    return [2 /*return*/, usageFile];
                if (!isLinux) return [3 /*break*/, 1];
                _a = '';
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, $.env.get('TMPDIR')];
            case 2:
                _a = ((_b = (_d.sent())) !== null && _b !== void 0 ? _b : '').replace(/\/+$/, '');
                _d.label = 3;
            case 3:
                tmp = _a;
                return [4 /*yield*/, $.env.get('HOME')];
            case 4:
                home = (_c = (_d.sent())) !== null && _c !== void 0 ? _c : '';
                usageFile = tmp ? "".concat(tmp, "/claudopus-usage.json") : "".concat(home, "/.cache/claudopus-usage.json");
                return [2 /*return*/, usageFile];
        }
    });
}); };
// One look when the last is due: a fresh one another chat left is taken as it is, and a chat that is looking says so first in a
// small file beside it, so chats that fall due together look once
var lookUsage = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var now, isFresh, path, shared, _a, taking, _b, base, topAt, isTop, r, kept;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, $.clock.now()];
            case 1:
                now = _d.sent();
                isFresh = function (at) { return now >= at && now - at < USAGE_EVERY - 500; };
                if (usageBusy || isFresh(usageTriedAt) || (usageKept && isFresh(usageKept.at)))
                    return [2 /*return*/];
                usageBusy = true;
                usageTriedAt = now;
                _d.label = 2;
            case 2:
                _d.trys.push([2, , 9, 10]);
                return [4 /*yield*/, usagePathOf($)];
            case 3:
                path = _d.sent();
                _a = keptOf;
                return [4 /*yield*/, $.fs.read(path).catch(function () { return ''; })];
            case 4:
                shared = _a.apply(void 0, [_d.sent()]);
                if (shared && isFresh(shared.at))
                    return [2 /*return*/, void (usageKept = shared)];
                _b = Number;
                return [4 /*yield*/, $.fs.read("".concat(path, ".taking")).catch(function () { return '0'; })];
            case 5:
                taking = _b.apply(void 0, [_d.sent()]);
                if (taking && now >= taking && now - taking < USAGE_EVERY / 2)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write("".concat(path, ".taking"), String(now)).catch(function () { return undefined; })];
            case 6:
                _d.sent();
                base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept;
                topAt = Math.max((_c = base === null || base === void 0 ? void 0 : base.topAt) !== null && _c !== void 0 ? _c : 0, usageTopTriedAt);
                isTop = !isLinux && (!topAt || now < topAt || now - topAt >= FOOTPRINT_EVERY);
                if (isTop)
                    usageTopTriedAt = now;
                return [4 /*yield*/, $.process.run(['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 7:
                r = _d.sent();
                kept = (r === null || r === void 0 ? void 0 : r.stdout) ? nextKept(base, r.stdout, now, isLinux, isTop) : undefined;
                if (!kept)
                    return [2 /*return*/];
                usageKept = kept;
                return [4 /*yield*/, $.fs.write(path, JSON.stringify(kept)).catch(function () { return undefined; })];
            case 8:
                _d.sent();
                return [3 /*break*/, 10];
            case 9:
                usageBusy = false;
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
// The figures to show, when a look has been had lately
var usageNow = function (now) { return (usageKept && now - usageKept.at < USAGE_EVERY * 6 ? usageKept.figures : undefined); };
// What each figure says in words, for a reader that cannot see the drawings
var usageWords = function (f) {
    var _a;
    return ({
        memory: "Memory: ".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB in use, Claude ").concat(gbText(f.memClaude), " GB"),
        cpu: f.cpu === undefined ? '' : "Processor: ".concat(pctText(f.cpu), "% busy, Claude ").concat(pctText((_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0), "% of the whole"),
        disk: f.disk === undefined ? '' : "Disk: ".concat(rateText(f.disk).join(' '), " read and written"),
        net: f.net === undefined ? '' : "Network: ".concat(rateText(f.net).join(' '), " in and out"),
        gpu: f.gpu === undefined ? '' : "Graphics processor: ".concat(pctText(f.gpu), "% busy"),
        battery: f.battery ? "Battery: ".concat(f.battery.pct, "%, ").concat(batteryWords(f.battery)) : '',
    });
};
// Each takes the battery as the bar shows it, so a charge the system calls full or empty has no time beside it
var batteryWords = function (read, b) {
    if (b === void 0) { b = batteryShown(read); }
    return b.state === 'battery' ? (b.left ? "".concat(leftText(b.left), " left") : 'on battery') : b.state === 'charging' ? (b.left ? "charging, ".concat(leftText(b.left), " to full") : b.finishing ? 'finishing charge' : 'charging') : b.state === 'plugged' ? 'on power' : 'its state not said';
};
// What follows the charge: the time left, the time to full, "finishing" once the system calls it full and still tops it up, or
// nothing on power and while the system still estimates
var batteryAfter = function (read, b) {
    if (b === void 0) { b = batteryShown(read); }
    return b.state === 'plugged' || b.state === 'unknown' ? '' : b.left ? " ".concat(leftText(b.left)).concat(b.state === 'charging' ? ' to full' : ' left') : b.state === 'charging' && b.finishing && b.pct >= 100 ? ' finishing' : '';
};
// The battery's state in full, for the line of more: a time only where the bar shows one, and what the system said in its place
var batteryNote = function (read, b) {
    if (b === void 0) { b = batteryShown(read); }
    return b.state === 'battery'
        ? b.left ? "on battery, ".concat(leftText(b.left), " left as the system estimates it") : read.left ? 'on battery, at 0% as the system gives it' : 'on battery, the system is still estimating the time left'
        : b.state === 'charging'
            ? b.left ? "charging, ".concat(leftText(b.left), " to full") : b.pct >= 100 ? (b.finishing ? 'finishing the charge: the system calls it full and still tops it up' : 'charging: the system calls it full') : 'charging, the time to full still being estimated'
            : b.state === 'unknown' ? 'the system does not say whether it charges' : b.pct >= 100 ? 'fully charged, on power' : 'on power, not charging';
};
// More of each figure, for a pointer resting on it: who uses the most, Claude's part, the parts of a speed, and the battery's state
// in full. Only what the looks gave; a part that is not known is left out
var usageMore = function (f) {
    var _a, _b, _c;
    var most = function (top, text) { return ((top === null || top === void 0 ? void 0 : top.length) ? " \u00B7 most: ".concat(top.map(function (_a) {
        var name = _a[0], n = _a[1];
        return "".concat(name, " ").concat(text(n));
    }).join(', ')) : ''); };
    var b = f.battery;
    return {
        memory: "Memory ".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB in use").concat(most(f.memTop, function (n) { return "".concat(gbText(n), " GB"); }), " \u00B7 Claude with what it started ").concat(gbText(f.memClaude), " GB"),
        cpu: f.cpu === undefined ? '' : "Processor ".concat(pctText(f.cpu), "% busy").concat(f.ncpu && f.ncpu > 1 ? " across ".concat(f.ncpu, " cores") : '').concat(most(f.cpuTop, function (n) { return "".concat(pctText(n), "%"); }), " \u00B7 Claude with what it started ").concat(pctText((_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0), "%"),
        gpu: f.gpu === undefined ? '' : "Graphics processor ".concat(pctText(f.gpu), "% busy").concat(f.gpuMem === undefined ? '' : f.gpuMemTotal ? " \u00B7 ".concat(gbText(f.gpuMem), " of ").concat(gbText(f.gpuMemTotal), " GB of its memory in use") : " \u00B7 ".concat(gbText(f.gpuMem), " GB of memory in use")),
        battery: !b ? '' : "Battery ".concat(b.pct, "% \u00B7 ").concat(batteryNote(b)),
        disk: f.disk === undefined ? '' : "Disk ".concat(rateText(f.disk).join(' '), " read and written").concat(((_b = f.disks) === null || _b === void 0 ? void 0 : _b.length) ? " \u00B7 ".concat(f.disks.join(', ')) : ''),
        net: f.net === undefined ? '' : "Network ".concat(rateText(f.net).join(' ')).concat(f.netIn !== undefined && f.netOut !== undefined ? " \u00B7 in ".concat(rateText(f.netIn).join(' '), ", out ").concat(rateText(f.netOut).join(' ')) : '').concat(((_c = f.ports) === null || _c === void 0 ? void 0 : _c.length) ? " \u00B7 ".concat(f.ports.join(', ')) : ''),
    };
};
// The line of more, in place of nothing above the figures: drawn hidden, shown while the pointer rests on its figure
var usageMoreDrawn = function (ui, f) {
    var Box = ui.Box, Text = ui.Text;
    var more = usageMore(f);
    return Object.entries(more).filter(function (_a) {
        var text = _a[1];
        return text;
    }).map(function (_a) {
        var key = _a[0], text = _a[1];
        return (<Box key={"usage-more-".concat(key)} display="none" hover={{ scope: "usage-".concat(key), display: 'flex' }} height={1} overflow="hidden">
      <Text dimColor wrap="truncate-end">{text}</Text>
    </Box>);
    });
};
// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network
var usageDrawn = function (ui, f) {
    var _a;
    var table = ui;
    var Box = ui.Box, Text = ui.Text;
    if (!table.Svg)
        return null;
    var Svg = table.Svg;
    var isHigh = isMemoryHigh(f);
    var words = usageWords(f);
    var one = function (key, svg, alt, value, unit, color) { return (<Box key={key} flexDirection="row" flexShrink={0} alignItems="center" hover={{ scope: key }}>
      <Svg key={"".concat(key, "-").concat(svg.source.length, "-").concat(hashOf(svg.source))} source={svg.source} alt={alt} width={svg.width} height={svg.height}/>
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
    </Box>); };
    return [
        one('usage-memory', usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh: isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
        f.cpu === undefined ? null : one('usage-cpu', usageSvg('cpu', { claude: (_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
        f.gpu === undefined ? null : one('usage-gpu', usageSvg('gpu', { claude: 0, used: f.gpu }), words.gpu, pctText(f.gpu), '%'),
        f.battery ? one('usage-battery', batterySvg(f.battery), words.battery, "".concat(f.battery.pct), "%".concat(batteryAfter(f.battery)), isBatteryLow(f.battery) ? USAGE_AMBER : undefined) : null,
        f.disk === undefined ? null : one('usage-disk', usageSvg('disk'), words.disk, rateText(f.disk)[0], " ".concat(rateText(f.disk)[1])),
        f.net === undefined ? null : one('usage-net', usageSvg('net'), words.net, rateText(f.net)[0], " ".concat(rateText(f.net)[1])),
    ];
};
// The line as text, for the terminal, in a phone's 50 columns with the octopus: a word for each, units cut to G and M/s, and three-cell meters with Claude's cells purple
var USAGE_CELLS = 3;
// Given the room, a figure that does not fit is left out whole, never cut in the middle: the network first, then the disk, then the
// graphics processor, so memory, the processor and the battery stay
var usageText = function (ui, f, room) {
    var _a;
    if (room === void 0) { room = Infinity; }
    var Text = ui.Text;
    var rate = function (n) { return rateText(n).join('').replace('B/s', '/s'); };
    var widths = {
        gpu: f.gpu === undefined ? 0 : " gpu".concat('▱'.repeat(USAGE_CELLS), " ").concat(pctText(f.gpu), "%").length,
        disk: f.disk === undefined ? 0 : " disk ".concat(rate(f.disk)).length,
        net: f.net === undefined ? 0 : " net ".concat(rate(f.net)).length,
    };
    var width = "mem".concat('▱'.repeat(USAGE_CELLS), " ").concat(gbText(f.memUsed), "G").length + (f.cpu === undefined ? 0 : " cpu".concat('▱'.repeat(USAGE_CELLS), " ").concat(pctText(f.cpu), "%").length) + (f.battery ? batteryAfterText(f.battery).length + " bat ".concat(f.battery.pct, "%").length : 0) + widths.gpu + widths.disk + widths.net;
    var shown = { gpu: true, disk: true, net: true };
    for (var _i = 0, _b = ['net', 'disk', 'gpu']; _i < _b.length; _i++) {
        var one = _b[_i];
        if (width > room && widths[one])
            (shown[one] = false), (width -= widths[one]);
    }
    var isHigh = isMemoryHigh(f);
    var meter = function (claude, used, color) {
        var _a = meterOf(claude, used, USAGE_CELLS), mine = _a.mine, rest = _a.rest;
        return [
            <Text key="mine" color={USAGE_PURPLE}>{'▰'.repeat(mine)}</Text>,
            <Text key="rest" color={color} dimColor={!color}>{'▰'.repeat(rest)}</Text>,
            <Text key="free" dimColor>{'▱'.repeat(USAGE_CELLS - mine - rest)}</Text>,
        ];
    };
    var amber = isHigh ? USAGE_AMBER : undefined;
    return (<Text wrap="truncate-end">
      <Text color={amber} dimColor={!amber}>mem</Text>
      {meter(f.memClaude / f.memTotal, f.memUsed / f.memTotal, amber)}
      <Text color={amber}>{" ".concat(gbText(f.memUsed))}</Text>
      <Text color={amber} dimColor={!amber}>G</Text>
      {f.cpu === undefined ? null : __spreadArray(__spreadArray([<Text key="c" dimColor>{' cpu'}</Text>], meter((_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0, f.cpu), true), [<Text key="cv">{" ".concat(pctText(f.cpu))}</Text>, <Text key="cu" dimColor>%</Text>], false)}
      {f.gpu === undefined || !shown.gpu ? null : __spreadArray(__spreadArray([<Text key="g" dimColor>{' gpu'}</Text>], meter(0, f.gpu), true), [<Text key="gv">{" ".concat(pctText(f.gpu))}</Text>, <Text key="gu" dimColor>%</Text>], false)}
      {f.battery ? batteryText(ui, f.battery) : null}
      {f.disk === undefined || !shown.disk ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1].replace('B/s', '/s')}</Text>]}
      {f.net === undefined || !shown.net ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1].replace('B/s', '/s')}</Text>]}
    </Text>);
};
// The battery in words, short: "bat 85% 4:12" on battery, "bat 62% ↑1:05" charging (↑ and the time to full), "bat 100% finishing"
// while the system calls it full and still tops it up, "bat 100% ac" on power
var batteryText = function (ui, b) {
    var Text = ui.Text;
    var low = isBatteryLow(b) ? USAGE_AMBER : undefined;
    var after = batteryAfterText(b);
    return [
        <Text key="b" color={low} dimColor={!low}>{' bat '}</Text>,
        <Text key="bv" color={low}>{"".concat(b.pct)}</Text>,
        <Text key="bu" color={low} dimColor={!low}>%</Text>,
        after ? <Text key="ba" color={b.state === 'charging' ? USAGE_PURPLE : low} dimColor={!low && b.state !== 'charging'}>{after}</Text> : null,
    ];
};
var batteryAfterText = function (read, b) {
    if (b === void 0) { b = batteryShown(read); }
    return b.state === 'plugged' ? ' ac' : b.state === 'charging' ? (!b.left && b.finishing && b.pct >= 100 ? ' finishing' : " \u2191".concat(b.left ? leftText(b.left) : '')) : b.left ? " ".concat(leftText(b.left)) : '';
};
// A short mark of a drawing, so a new drawing is a new picture to the app
var hashOf = function (text) {
    var h = 0;
    for (var i = 0; i < text.length; i++)
        h = (h * 31 + text.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
};
