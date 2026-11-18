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
                _d.trys.push([2, , 12, 13]);
                return [4 /*yield*/, usagePathOf($)];
            case 3:
                path = _d.sent();
                _a = keptOf;
                return [4 /*yield*/, $.fs.read(path).catch(function () { return ''; })];
            case 4:
                shared = _a.apply(void 0, [_d.sent()]);
                if (!(shared && isFresh(shared.at))) return [3 /*break*/, 6];
                return [4 /*yield*/, keepUsage($, shared)];
            case 5: return [2 /*return*/, void (_d.sent())];
            case 6:
                _b = Number;
                return [4 /*yield*/, $.fs.read("".concat(path, ".taking")).catch(function () { return '0'; })];
            case 7:
                taking = _b.apply(void 0, [_d.sent()]);
                if (taking && now >= taking && now - taking < USAGE_EVERY / 2)
                    return [2 /*return*/];
                return [4 /*yield*/, $.fs.write("".concat(path, ".taking"), String(now)).catch(function () { return undefined; })];
            case 8:
                _d.sent();
                base = shared && shared.at <= now && (!usageKept || shared.at > usageKept.at) ? shared : usageKept;
                topAt = Math.max((_c = base === null || base === void 0 ? void 0 : base.topAt) !== null && _c !== void 0 ? _c : 0, usageTopTriedAt);
                isTop = !isLinux && (!topAt || now < topAt || now - topAt >= FOOTPRINT_EVERY);
                if (isTop)
                    usageTopTriedAt = now;
                return [4 /*yield*/, $.process.run(['sh', '-c', isLinux ? USAGE_LINUX : usageMac(isTop)], { timeoutMs: 5000 }).catch(function () { return undefined; })];
            case 9:
                r = _d.sent();
                kept = (r === null || r === void 0 ? void 0 : r.stdout) ? nextKept(base, r.stdout, now, isLinux, isTop) : undefined;
                if (!kept)
                    return [2 /*return*/];
                return [4 /*yield*/, keepUsage($, kept)];
            case 10:
                _d.sent();
                return [4 /*yield*/, $.fs.write(path, JSON.stringify(kept)).catch(function () { return undefined; })];
            case 11:
                _d.sent();
                return [3 /*break*/, 13];
            case 12:
                usageBusy = false;
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}); };
// New figures are kept, and the band that shows them redraws
var keepUsage = function ($, kept) { return __awaiter(_this, void 0, void 0, function () {
    var isNew;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isNew = kept.at !== (usageKept === null || usageKept === void 0 ? void 0 : usageKept.at);
                usageKept = kept;
                if (!isNew) return [3 /*break*/, 2];
                return [4 /*yield*/, update($, figuresAt, function () { return kept.at; })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// The figures to show, when a look has been had lately
var usageNow = function (now) { return (usageKept && now - usageKept.at < USAGE_EVERY * 6 ? usageKept.figures : undefined); };
// Claude's own part of each figure, named the same in every place: Claude and every command it started
var CLAUDE_ALL = 'Claude and what it started';
// What each figure says in words, for a reader that cannot see the drawings
var usageWords = function (f) {
    var _a;
    return ({
        memory: "Memory: ".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB in use, ").concat(gbText(f.memClaude), " GB by ").concat(CLAUDE_ALL),
        cpu: f.cpu === undefined ? '' : "Processor: ".concat(pctText(f.cpu), "% busy, ").concat(pctText((_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0), "% by ").concat(CLAUDE_ALL),
        disk: f.disk === undefined ? '' : "Disk: ".concat(rateText(f.disk).join(' '), " read and written"),
        net: f.net === undefined ? '' : "Network: ".concat(rateText(f.net).join(' '), " downloaded and uploaded"),
        gpu: f.gpu === undefined ? '' : "Graphics processor: ".concat(pctText(f.gpu), "% busy").concat(f.gpuClaude !== undefined ? ", ".concat(pctText(f.gpuClaude), "% by ").concat(CLAUDE_ALL) : ''),
        battery: f.battery ? "Battery: ".concat(f.battery.pct, "%, ").concat(batteryWords(f.battery)) : '',
    });
};
// Each takes the battery as the bar shows it, so a charge the system calls full or empty has no time beside it
var batteryWords = function (read, b) {
    if (b === void 0) { b = batteryShown(read); }
    return b.state === 'battery' ? (b.left ? "".concat(leftText(b.left), " left") : 'on battery') : b.state === 'charging' ? (b.left ? "charging, ".concat(leftText(b.left), " to full") : b.finishing ? 'finishing the charge' : 'charging') : b.state === 'plugged' ? 'on power' : "the system doesn't say if it's charging";
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
        ? b.left ? "on battery \u00B7 about ".concat(leftText(b.left), " left") : read.left ? 'on battery · the system calls it empty' : 'on battery · the system is still working out the time left'
        : b.state === 'charging'
            ? b.left ? "charging \u00B7 about ".concat(leftText(b.left), " to full") : b.pct >= 100 ? (b.finishing ? 'finishing the charge · the system calls it full and still tops it up' : 'charging · the system calls it full') : 'charging · the system is still working out the time to full'
            : b.state === 'unknown' ? "the system doesn't say if it's charging" : b.pct >= 100 ? 'full · on power' : 'on power · not charging';
};
var usageCards = function (f) {
    var _a, _b;
    var most = function (top, text) { return ((top === null || top === void 0 ? void 0 : top.length) ? top.map(function (_a) {
        var name = _a[0], n = _a[1];
        return [name, text(n)];
    }) : undefined); };
    var b = f.battery;
    return {
        memory: { title: 'Memory', value: "".concat(gbText(f.memUsed), " of ").concat(gbText(f.memTotal), " GB"), rows: [[CLAUDE_ALL, "".concat(gbText(f.memClaude), " GB")]], most: most(f.memTop, function (n) { return "".concat(gbText(n), " GB"); }) },
        cpu: f.cpu === undefined ? undefined : {
            title: 'Processor',
            value: "".concat(pctText(f.cpu), "% busy"),
            rows: __spreadArray(__spreadArray([], (f.ncpu && f.ncpu > 1 ? [['Cores', "".concat(f.ncpu)]] : []), true), [[CLAUDE_ALL, "".concat(pctText((_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0), "%")]], false),
            most: most(f.cpuTop, function (n) { return "".concat(pctText(n), "%"); }),
        },
        // Busy is time at work at any speed, so a busy graphics processor can draw little; drawing the screen is macOS's own
        // (WindowServer), for every app's window, Claude's too, so it is no one's part. The card is its rows alone, with no words under
        // them on what they cover
        gpu: f.gpu === undefined ? undefined : {
            title: 'Graphics processor',
            value: "".concat(pctText(f.gpu), "% busy"),
            rows: __spreadArray(__spreadArray(__spreadArray([], (f.gpuClaude !== undefined ? [[CLAUDE_ALL, "".concat(pctText(f.gpuClaude), "%")]] : []), true), (f.wattsGpu !== undefined ? [['Power use', "".concat(wattText(f.wattsGpu), " W")]] : []), true), (f.gpuMem !== undefined ? [['Graphics memory in use', f.gpuMemTotal ? "".concat(gbText(f.gpuMem), " of ").concat(gbText(f.gpuMemTotal), " GB") : "".concat(gbText(f.gpuMem), " GB")]] : []), true),
            most: most((_b = f.gpuTop) === null || _b === void 0 ? void 0 : _b.map(function (_a) {
                var name = _a[0], n = _a[1];
                return [name === 'WindowServer' ? 'macOS drawing the screen' : name, n];
            }), function (n) { return "".concat(pctText(n), "%"); }),
        },
        battery: !b ? undefined : {
            title: 'Battery',
            value: "".concat(batteryShown(b).pct, "%"),
            note: upperFirst(batteryNote(b)),
            // The strain on it: what the whole Mac draws, the processors and the graphics processor each, and Claude's part of each. The
            // Mac counts each process's own processor energy, not its graphics power: Claude's graphics is its share of the graphics
            // processor's time times what that draws, and says it is estimated. The screen, memory and storage are no one's part
            rows: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (f.watts !== undefined ? [['Power use, whole Mac', "".concat(wattText(f.watts), " W")]] : []), true), (f.wattsCpu !== undefined ? [['Power use, processors', "".concat(wattText(f.wattsCpu), " W")]] : []), true), (f.wattsClaude !== undefined ? [['Claude, processors', "".concat(wattText(f.wattsClaude), " W")]] : []), true), (f.wattsGpu !== undefined ? [['Power use, graphics', "".concat(wattText(f.wattsGpu), " W")]] : []), true), (f.wattsGpuClaude !== undefined ? [['Claude, graphics', "about ".concat(wattText(f.wattsGpuClaude), " W")]] : []), true),
        },
        disk: f.disk === undefined ? undefined : {
            title: 'Disk, read and written',
            value: rateText(f.disk).join(' '),
            rows: f.diskClaude !== undefined ? [[CLAUDE_ALL, rateFine(Math.min(f.diskClaude, f.disk))]] : [],
        },
        net: f.net === undefined ? undefined : {
            title: 'Network',
            value: rateText(f.net).join(' '),
            rows: __spreadArray(__spreadArray([], (f.netIn !== undefined && f.netOut !== undefined ? [['Download', rateFine(f.netIn)], ['Upload', rateFine(f.netOut)]] : []), true), (f.netInClaude !== undefined && f.netOutClaude !== undefined ? [[CLAUDE_ALL, "".concat(rateFine(f.netIn !== undefined ? Math.min(f.netInClaude, f.netIn) : f.netInClaude), " down \u00B7 ").concat(rateFine(f.netOut !== undefined ? Math.min(f.netOutClaude, f.netOut) : f.netOutClaude), " up")]] : []), true),
        },
    };
};
// A speed in a card, where there is room for small ones: KB/s below a megabyte a second, so an API's trickle does not read 0
var rateFine = function (perSecond) { return (perSecond < 1024 * 1024 ? "".concat(Math.round(perSecond / 1024), " KB/s") : rateText(perSecond).join(' ')); };
var upperFirst = function (text) { return text.charAt(0).toUpperCase() + text.slice(1); };
// Watts, whole from ten up, a tenth below
var wattText = function (w) { return (w >= 10 ? "".concat(Math.round(w)) : "".concat(Math.round(w * 10) / 10)); };
// A figure's card: one Box placed absolutely and drawn hidden inside the figure's keyed Box, which the desktop app lifts over the
// chat as its own floating card above the figure, kept in the window and shifted sideways at its edges, so showing it moves nothing
// in the chat or the bar (in the bar's column it took room: the chat was pushed up and sprang back, and a tall card hid the figures).
// What it says is shown by the figure's hover group, which the pointer lights and puts out at once, so as the pointer goes on to
// the next figure this card's words are gone before the next card shows, though the app keeps the lifted card itself a moment for
// a pointer on its way into it
var usageCardDrawn = function (ui, key, card) {
    var _a;
    var Box = ui.Box, Text = ui.Text;
    var row = function (name, value, n, kind) { return (<Box key={"".concat(key, "-").concat(kind, "-").concat(n)} flexDirection="row" justifyContent="space-between" gap={3}>
      <Text dimColor wrap="truncate-end">{name}</Text>
      <Text wrap="truncate-end">{value}</Text>
    </Box>); };
    return (
    // No key and no hover group of its own: the app lifts only a hidden absolute Box shown by the hover of its keyed Box
    <Box position="absolute" top={-1} left={0} display="none" hover={{ display: 'flex' }} flexDirection="column">
      <Box key={"".concat(key, "-card")} display="none" hover={{ scope: key, display: 'flex' }} flexDirection="column" gap={1}>
        <Box key={"".concat(key, "-card-head")} flexDirection="row" justifyContent="space-between" gap={3}>
          <Text bold>{card.title}</Text>
          <Text bold>{card.value}</Text>
        </Box>
        {card.note ? <Text key={"".concat(key, "-card-note")} dimColor>{card.note}</Text> : null}
        {card.rows.length ? <Box key={"".concat(key, "-card-rows")} flexDirection="column">{card.rows.map(function (_a, n) {
        var name = _a[0], value = _a[1];
        return row(name, value, n, 'row');
    })}</Box> : null}
        {((_a = card.most) === null || _a === void 0 ? void 0 : _a.length) ? (<Box key={"".concat(key, "-card-most")} flexDirection="column">
            <Text dimColor>Using the most</Text>
            {card.most.map(function (_a, n) {
            var name = _a[0], value = _a[1];
            return row(name, value, n, 'most');
        })}
          </Box>) : null}
      </Box>
    </Box>);
};
// The desktop app draws the bar anew whenever anything in it changes (new figures, the work under it, the octopus), and shows again
// each lifted card whose figure's place (its count among the keyed Boxes drawn) held a card that was up as the old drawing went: so
// a card the pointer had just left stayed up with nothing under the pointer to put it away, and one shown again before its words
// were lit was placed too low, over the figures. A run of hidden keyed Boxes before the figures, there in every other drawing, moves every figure past the places the last drawing had, more than all the keyed Boxes of the figures and
// their cards, so no card is shown again but the one under the pointer, which the app measures whole
var USAGE_SPACERS = 120;
var usageSpaced = false;
var usageSpacersDrawn = function (ui) {
    var Box = ui.Box, Text = ui.Text;
    usageSpaced = !usageSpaced;
    return usageSpaced ? (<Box display="none">
      {Array.from({ length: USAGE_SPACERS }, function (_, n) { return (<Box key={"usage-spacer-".concat(n)}>
          <Text> </Text>
        </Box>); })}
    </Box>) : null;
};
// The line on a surface that draws SVG: an icon and its meter, then the figure, for memory and the processor; an icon and the speed
// for the disk and the network. The pointer resting on a figure lights its group: a faint fill under it, and its card above
var usageDrawn = function (ui, f) {
    var _a, _b;
    var table = ui;
    var Box = ui.Box, Text = ui.Text;
    if (!table.Svg)
        return null;
    var Svg = table.Svg;
    var isHigh = isMemoryHigh(f);
    var words = usageWords(f);
    var cards = usageCards(f);
    var one = function (key, card, svg, alt, value, unit, color) { return (
    // A member of a group must change how it looks, or the desktop app never wires it to the pointer: hence the fill
    <Box key={"usage-".concat(key)} flexDirection="row" flexShrink={0} alignItems="center" hover={{ scope: "usage-".concat(key), backgroundColor: FILL }}>
      <Svg key={"usage-".concat(key, "-").concat(svg.source.length, "-").concat(hashOf(svg.source))} source={svg.source} alt={alt} width={svg.width} height={svg.height}/>
      <Text color={color} wrap="truncate-end">
        {value}
        <Text dimColor={!color} color={color}>{unit}</Text>
      </Text>
      {card ? usageCardDrawn(ui, "usage-".concat(key), card) : null}
    </Box>); };
    return [
        one('memory', cards.memory, usageSvg('memory', { claude: f.memClaude / f.memTotal, used: f.memUsed / f.memTotal, isHigh: isHigh }), words.memory, gbText(f.memUsed), ' GB', isHigh ? USAGE_AMBER : undefined),
        f.cpu === undefined ? null : one('cpu', cards.cpu, usageSvg('cpu', { claude: (_a = f.cpuClaude) !== null && _a !== void 0 ? _a : 0, used: f.cpu }), words.cpu, pctText(f.cpu), '%'),
        f.gpu === undefined ? null : one('gpu', cards.gpu, usageSvg('gpu', { claude: (_b = f.gpuClaude) !== null && _b !== void 0 ? _b : 0, used: f.gpu }), words.gpu, pctText(f.gpu), '%'),
        f.battery ? one('battery', cards.battery, batterySvg(f.battery), words.battery, "".concat(f.battery.pct), "%".concat(batteryAfter(f.battery)), isBatteryLow(f.battery) ? USAGE_AMBER : undefined) : null,
        f.disk === undefined ? null : one('disk', cards.disk, usageSvg('disk'), words.disk, rateText(f.disk)[0], " ".concat(rateText(f.disk)[1])),
        f.net === undefined ? null : one('net', cards.net, usageSvg('net'), words.net, rateText(f.net)[0], " ".concat(rateText(f.net)[1])),
    ];
};
// The line as text, for the terminal, in a phone's 50 columns with the octopus: a word for each, units cut to G and M/s, and three-cell meters with Claude's cells purple
var USAGE_CELLS = 3;
// Given the room, a figure that does not fit is left out whole, never cut in the middle: the network first, then the disk, then the
// graphics processor, so memory, the processor and the battery stay
var usageText = function (ui, f, room) {
    var _a, _b;
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
    for (var _i = 0, _c = ['net', 'disk', 'gpu']; _i < _c.length; _i++) {
        var one = _c[_i];
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
      {f.gpu === undefined || !shown.gpu ? null : __spreadArray(__spreadArray([<Text key="g" dimColor>{' gpu'}</Text>], meter((_b = f.gpuClaude) !== null && _b !== void 0 ? _b : 0, f.gpu), true), [<Text key="gv">{" ".concat(pctText(f.gpu))}</Text>, <Text key="gu" dimColor>%</Text>], false)}
      {f.battery ? batteryText(ui, f.battery) : null}
      {f.disk === undefined || !shown.disk ? null : [<Text key="d" dimColor>{' disk '}</Text>, <Text key="dv">{rateText(f.disk)[0]}</Text>, <Text key="du" dimColor>{rateText(f.disk)[1].replace('B/s', '/s')}</Text>]}
      {f.net === undefined || !shown.net ? null : [<Text key="n" dimColor>{' net '}</Text>, <Text key="nv">{rateText(f.net)[0]}</Text>, <Text key="nu" dimColor>{rateText(f.net)[1].replace('B/s', '/s')}</Text>]}
    </Text>);
};
// The battery in words, short: "bat 85% 4h12m" on battery, "bat 62% ↑1h05m" charging (↑ and the time to full), "bat 100% finishing"
// while the system calls it full and still tops it up, "bat 100% on power" on power. Times lose their space, so a phone's line fits
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
    return b.state === 'plugged' ? ' on power' : b.state === 'charging' ? (!b.left && b.finishing && b.pct >= 100 ? ' finishing' : " \u2191".concat(b.left ? leftText(b.left).replace(' ', '') : '')) : b.left ? " ".concat(leftText(b.left).replace(' ', '')) : '';
};
// A short mark of a drawing, so a new drawing is a new picture to the app
var hashOf = function (text) {
    var h = 0;
    for (var i = 0; i < text.length; i++)
        h = (h * 31 + text.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
};
