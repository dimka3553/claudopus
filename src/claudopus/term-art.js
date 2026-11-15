// The octopus and the marks of work under way where the terminal draws them: it has no Svg, so each is a Raster, a box of cells,
// each a glyph in one colour. Its moving ones are repainted in place a few times a second ($.ui.blit), so nothing else is drawn
// again; the app's own drawing never comes here. Pictures are not drawn in a terminal: a press opens them (pictures)
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// The terminal's own colour, for a see-through pixel: the octopus sits on a dark terminal as on a light one
var TERM_DEFAULT = 0x01000000;
// ---- Cells, packed as the Raster takes them ----
var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var toBase64 = function (bytes) {
    var _a, _b, _c;
    var out = '';
    for (var i = 0; i < bytes.length; i += 3) {
        var n = (((_a = bytes[i]) !== null && _a !== void 0 ? _a : 0) << 16) | (((_b = bytes[i + 1]) !== null && _b !== void 0 ? _b : 0) << 8) | ((_c = bytes[i + 2]) !== null && _c !== void 0 ? _c : 0);
        out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63) + (i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : '=') + (i + 2 < bytes.length ? B64.charAt(n & 63) : '=');
    }
    return out;
};
// Cells, row by row, each [glyph, foreground, background] as little-endian 32-bit words
var packed = function (words) {
    var bytes = new Uint8Array(words.length * 4);
    words.forEach(function (word, i) {
        bytes[i * 4] = word & 255;
        bytes[i * 4 + 1] = (word >>> 8) & 255;
        bytes[i * 4 + 2] = (word >>> 16) & 255;
        bytes[i * 4 + 3] = (word >>> 24) & 255;
    });
    return toBase64(bytes);
};
// One glyph per cell in one colour, on the terminal's own
var glyphCells = function (glyphs, color) { return ({
    columns: __spreadArray([], glyphs, true).length,
    rows: 1,
    cells: packed(__spreadArray([], glyphs, true).flatMap(function (ch) { var _a; return [ch === ' ' ? 0x20 : ((_a = ch.codePointAt(0)) !== null && _a !== void 0 ? _a : 0x20), ch === ' ' ? TERM_DEFAULT : color, TERM_DEFAULT]; })),
}); };
var colorOf = function (hex) {
    var h = hex.replace('#', '');
    var full = h.length === 3 ? __spreadArray([], h, true).map(function (ch) { return ch + ch; }).join('') : h.slice(0, 6);
    var n = Number.parseInt(full, 16);
    return Number.isFinite(n) ? n : -1;
};
var lives = new Map();
// How often the moving ones are looked at; each is repainted only when its picture changes, a few times a second at most
var LIVE_TICK = 100;
var stopLives;
var frameOf = function (one) {
    if (one.frames.length < 2 || !one.frameMs)
        return 0;
    var i = Math.floor(one.elapsed / one.frameMs);
    return i >= one.frames.length * one.loops ? one.frames.length - 1 : i % one.frames.length;
};
var isOver = function (one) {
    return one.frames.length < 2 || !one.frameMs || one.elapsed >= one.frames.length * one.loops * one.frameMs;
};
var tickLives = function ($) {
    var _a;
    var _loop_1 = function (id, one) {
        one.elapsed += LIVE_TICK;
        var frame = frameOf(one);
        var over = isOver(one);
        if (frame === one.shown) {
            if (over)
                lives.delete(id);
            return "continue";
        }
        one.shown = frame;
        void $.ui
            .blit({ requestId: one.requestId, key: one.key, cells: (_a = one.frames[frame]) !== null && _a !== void 0 ? _a : '' })
            .then(function (said) {
            var denied = Boolean(said && 'deny' in said && said.deny);
            one.misses = denied ? one.misses + 1 : 0;
            if ((denied && one.misses >= 3) || over)
                lives.get(id) === one && lives.delete(id);
        })
            .catch(function () { return lives.get(id) === one && lives.delete(id); });
    };
    for (var _i = 0, lives_1 = lives; _i < lives_1.length; _i++) {
        var _b = lives_1[_i], id = _b[0], one = _b[1];
        _loop_1(id, one);
    }
    if (!lives.size && stopLives)
        stopLives = (stopLives.cancel(), undefined);
};
// A Raster that plays its pictures from the moment given: drawn at the picture of now, then repainted in place as it moves on
var liveRaster = function (ui, $, requestId, key, frames, frameMs, loops, elapsed) {
    var _a;
    var table = ui;
    if (!table.Raster || !frames.length)
        return null;
    var one = { frames: frames, frameMs: frameMs, loops: loops, elapsed: Math.max(0, elapsed) };
    var frame = frameOf(one);
    var id = "".concat(requestId, "\n").concat(key);
    // A site is given only with the engine that repaints it
    if (requestId && !isOver(one)) {
        lives.set(id, { requestId: requestId, key: key, frames: frames.map(function (f) { return f.cells; }), frameMs: frameMs, loops: loops, elapsed: one.elapsed, shown: frame, misses: 0 });
        if (!stopLives)
            stopLives = $.clock.every(LIVE_TICK, function () { return tickLives($); });
    }
    else
        lives.delete(id);
    var cells = (_a = frames[frame]) !== null && _a !== void 0 ? _a : frames[0];
    if (!cells)
        return null;
    return <table.Raster key={key} columns={cells.columns} rows={cells.rows} cells={cells.cells}/>;
};
// ---- The octopus in the terminal ----
// Where each moment of the octopus began, by its mark, so a redraw draws the picture of now and the animation goes on from there
var momentStarts = new Map();
// The band's octopus, one line tall: three cells of braille dots, each 2 by 4, a tiny octopus of 6 by 4 dots. At work its arms
// paddle; happy, it lifts them, then rests
var TINY = {
    working: [
        ['.####.', '#.##.#', '######', '#.#.#.'],
        ['.####.', '#.##.#', '######', '.#.#.#'],
    ],
    happy: [
        ['#.##.#', '##..##', '.####.', '.#..#.'],
        ['.####.', '#.##.#', '######', '#.#.#.'],
    ],
};
var brailleOf = function (rows) {
    var _a, _b, _c, _d, _e;
    var out = '';
    var bits = [
        [0x01, 0x08],
        [0x02, 0x10],
        [0x04, 0x20],
        [0x40, 0x80],
    ];
    for (var c = 0; c < ((_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); c += 2) {
        var n = 0;
        for (var y = 0; y < 4; y += 1)
            for (var x = 0; x < 2; x += 1)
                if (((_c = rows[y]) === null || _c === void 0 ? void 0 : _c[c + x]) === '#')
                    n |= (_e = (_d = bits[y]) === null || _d === void 0 ? void 0 : _d[x]) !== null && _e !== void 0 ? _e : 0;
        out += String.fromCodePoint(0x2800 + n);
    }
    return out;
};
// The terminal's octopus: 14 by 6 pixels, each cell four of them (▘▝▖▗ and their joins) in one colour on the terminal's own, so it
// is three rows tall, the size of Claude Code's own mark beside its three lines. Each picture of it, and how each state plays them
var TERM_OCTO_HEAD = ['...########...', '..##########..', '..##..##..##..', '..##########..'];
var TERM_OCTO = {
    rest: __spreadArray(__spreadArray([], TERM_OCTO_HEAD, true), ['..#.#.##.#.#..', '.#..#....#..#.'], false),
    paddle: __spreadArray(__spreadArray([], TERM_OCTO_HEAD, true), ['..#.#.##.#.#..', '..#.#....#.#..'], false),
    hand: ['...########.#.', '..##########.#', '..##..##..###.', '..##########..', '..#.#.##.#....', '.#..#....#....'],
    cheer: __spreadArray(__spreadArray([], TERM_OCTO_HEAD, true), ['.#.#..##..#.#.', '#..#......#..#'], false),
    wave: ['...########...', '..##########.#', '..##..##..####', '..##########..', '..#.#.##.#....', '.#..#....#....'],
    jump: ['..............', '...########...', '..##########..', '..##..##..##..', '..##########..', '.#.#.#..#.#.#.'],
};
// At work it paddles on; something waiting raises a hand in amber; finished, it cheers in green four times; About waves; just
// updated, it jumps in blue
var TERM_PLAYS = {
    mark: { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 },
    working: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
    workingSmall: { frames: ['rest', 'paddle'], color: 'live', frameMs: 400, loops: Infinity },
    asking: { frames: ['hand', 'rest'], color: NEEDS, frameMs: 600, loops: Infinity },
    happy: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
    happySmall: { frames: ['cheer', 'rest'], color: '#4EBA65', frameMs: 250, loops: 4 },
    wave: { frames: ['wave', 'rest'], color: 'live', frameMs: 400, loops: 4 },
    updated: { frames: ['jump', 'rest'], color: '#4E93EF', frameMs: 300, loops: 6 },
};
var QUADS = ' ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█';
var quadCells = function (rows, color) {
    var _a, _b, _c;
    var width = Math.ceil(((_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) / 2);
    var height = Math.ceil(rows.length / 2);
    var on = function (x, y) { var _a; return (((_a = rows[y]) === null || _a === void 0 ? void 0 : _a[x]) === '#' ? 1 : 0); };
    var words = [];
    for (var r = 0; r < height; r += 1)
        for (var c = 0; c < width; c += 1) {
            var n = on(2 * c, 2 * r) | (on(2 * c + 1, 2 * r) << 1) | (on(2 * c, 2 * r + 1) << 2) | (on(2 * c + 1, 2 * r + 1) << 3);
            words.push(n ? ((_c = QUADS.codePointAt(n)) !== null && _c !== void 0 ? _c : 0x20) : 0x20, n ? color : TERM_DEFAULT, TERM_DEFAULT);
        }
    return { columns: width, rows: height, cells: packed(words) };
};
// Twice as large: each pixel two cells wide and one tall, which is square on a terminal
var doubledCells = function (rows, color) {
    var _a, _b;
    var width = ((_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) * 2;
    var words = [];
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        for (var _c = 0, row_1 = row; _c < row_1.length; _c++) {
            var ch = row_1[_c];
            for (var i = 0; i < 2; i += 1)
                words.push(ch === '#' ? 0x2588 : 0x20, ch === '#' ? color : TERM_DEFAULT, TERM_DEFAULT);
        }
    }
    return { columns: width, rows: rows.length, cells: packed(words) };
};
// Which drawing the terminal draws in a place: the band's is the tiny one, every other the small one above
var termOctopus = function (ui, key, art, size, alt, $, requestId) {
    var _a, _b;
    if (!('Raster' in ui))
        return null;
    var Box = ui.Box;
    var mark = momentOf(key, art);
    var now = Date.now();
    if (!momentStarts.has(mark)) {
        if (momentStarts.size > 200)
            momentStarts.clear();
        momentStarts.set(mark, now);
    }
    var elapsed = now - ((_a = momentStarts.get(mark)) !== null && _a !== void 0 ? _a : now);
    if (size <= BAND_MARK) {
        var tiny = art === 'happySmall' || art === 'happy' ? TINY.happy : TINY.working;
        var color_1 = art === 'happySmall' || art === 'happy' ? colorOf('#4EBA65') : colorOf(art === 'asking' ? NEEDS : LIVE);
        var frames_1 = tiny.map(function (rows) { return glyphCells(brailleOf(rows), color_1); });
        // Happy lifts its arms four times over the finish's two seconds, then rests; at work it paddles on
        var loops = tiny === TINY.happy ? 4 : Infinity;
        return (<Box key={key} flexShrink={0}>
        {liveRaster(ui, $, requestId, "".concat(key, "-").concat(art, "-").concat(mark), frames_1, tiny === TINY.happy ? 250 : 300, loops, elapsed)}
      </Box>);
    }
    // Everywhere else the small octopus, three rows tall beside the header's three lines, as big as Claude Code's own mark; on the
    // update screen the same drawing twice as large
    var play = (_b = TERM_PLAYS[art]) !== null && _b !== void 0 ? _b : { frames: ['rest'], color: 'live', frameMs: 0, loops: 1 };
    var color = colorOf(play.color === 'live' ? LIVE : play.color);
    var frames = play.frames.map(function (name) { var _a; return (size > HEAD_MARK ? doubledCells : quadCells)((_a = TERM_OCTO[name]) !== null && _a !== void 0 ? _a : TERM_OCTO_HEAD, color); });
    return (<Box key={key} flexShrink={0}>
      {liveRaster(ui, $, requestId, "".concat(key, "-").concat(art, "-").concat(mark), frames, play.frameMs, play.loops, elapsed)}
    </Box>);
};
// ---- The marks of work under way, in the terminal ----
// A card's three dots, a brighter one passing along them as the app's pulse does; still once the work is not at work
var DOT_FRAMES = ['●•·', '•●•', '·•●', '•·•'];
var termDots = function (ui, $, requestId, key, color) {
    if (color === void 0) { color = LIVE; }
    return liveRaster(ui, $, requestId, key, DOT_FRAMES.map(function (one) { return glyphCells(one, colorOf(color)); }), 300, Infinity, Date.now() % 1200);
};
// A helper at work: its dot with a ring that grows out of it and fades
var RING_FRAMES = ['●', '◉', '◎', '○'];
var termRing = function (ui, $, requestId, key) {
    return liveRaster(ui, $, requestId, key, RING_FRAMES.map(function (one) { return glyphCells(one, colorOf(LIVE)); }), 350, Infinity, Date.now() % 1400);
};
