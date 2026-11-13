// The header's art: the octopus at rest, working, happy and asking, and the dots of a card's state
// The height of one line of the app's text, in its pixels: a mark drawn this tall with its shape in the middle sits on the first line of the text beside it
var LINE = 20;
// Three dots that pulse while work runs, for a surface that can draw them
var dots = function (color, height) {
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"".concat(height, "\" viewBox=\"0 0 22 ").concat(height, "\">").concat([0, 1, 2]
        .map(function (i) {
        return "<circle cx=\"".concat(3 + i * 8, "\" cy=\"").concat(height / 2, "\" r=\"2.5\" fill=\"").concat(color, "\"><animate attributeName=\"opacity\" values=\"0.25;1;0.25\" dur=\"1.2s\" begin=\"").concat(i * 0.2, "s\" repeatCount=\"indefinite\"/></circle>");
    })
        .join(''), "</svg>");
};
// Claudopus purple, the colour of work that is under way: Claude is orange, its opposite purple
var LIVE = '#8A63F0';
// Work that needs the person's hands now: its card's bar and its ask
var NEEDS = '#E5A50A';
var LIVE_DOTS = dots(LIVE, LINE);
// The mark of work that finished
var DONE = 'success';
// The octopus: resting, working at its computers (drawn from 32 px up), and lifting its arms (for 16 to 24 px). Each is an SVG
// file of the mod's, art/<name>.svg, read when the session starts: a drawing is swapped by replacing its file. Happy is the
// octopus in the finished green, bouncing with its arms up once over the two seconds finished work pauses, then still
// Asking is the wave in the amber of work that needs the person: it waves once as something starts to wait, then rests amber
var ART = { mark: '', working: '', workingSmall: '', happy: '', happySmall: '', wave: '', asking: '' };
var ART_FILES = { mark: 'mark.svg', working: 'working.svg', workingSmall: 'working-small.svg', happy: 'happy.svg', happySmall: 'happy-small.svg', wave: 'wave.svg' };
// Whether the octopus is happy at a time: work of this chat's that finished, not stopped or failed, is in its pause. A new drawing
// starts its animation, so it plays from the first finish and holds its last picture through any finish that follows in the pause
var isHappy = function (cards, at) {
    return cards.some(function (one) { return !one.parentId && one.status === 'done' && isLingering(one, at); });
};
// How big the octopus is drawn in the panel's header and in the line above the prompt, in the app's pixels
var HEAD_MARK = 48;
var BAND_MARK = 16;
// The app draws an Svg as a picture and keeps a picture it drew before, animation and all: the same drawing shown again starts
// where its last showing ended, at rest, so a second finish would stay still. Each time a place turns to a drawing, that drawing
// is marked with the moment and so is new to the app, and plays from its start; it keeps that mark while it stays, so a redraw
// does not restart it; a happy octopus not drawn for a while, as in a closed panel, starts a new moment. The mark holds this run's own
// letters, so a drawing of another chat's panel is never the same either
var moments = new Map();
var MOMENT_GAP = 5000;
// The happy drawings last only a finish's short pause, so one drawn again after a gap is a new finish and plays anew; the wave
// rests on its last picture for as long as something waits, and plays again only when the octopus turns to it anew
var ONCE = new Set(['happy', 'happySmall']);
var RUN_MARK = Math.random().toString(36).slice(2, 8);
var momentCount = 0;
var momentOf = function (key, art) {
    var was = moments.get(key);
    var at = Date.now();
    if ((was === null || was === void 0 ? void 0 : was.art) === art && (at - was.at < MOMENT_GAP || !ONCE.has(art)))
        return (was.at = at), was.mark;
    momentCount += 1;
    var mark = "".concat(RUN_MARK, "-").concat(momentCount);
    // Each opening of About is a place of its own; the openings before it are gone
    if (key.startsWith('about-mark-'))
        for (var _i = 0, _a = moments.keys(); _i < _a.length; _i++) {
            var one = _a[_i];
            if (one.startsWith('about-mark-'))
                moments.delete(one);
        }
    moments.set(key, { art: art, mark: mark, at: at });
    return mark;
};
var octopus = function (ui, key, art, size, alt) {
    var table = ui;
    var Box = ui.Box;
    var source = ART[art];
    if (!source || !table.Svg)
        return null;
    var mark = momentOf(key, art);
    return (<Box key={key} flexShrink={0}>
      <table.Svg key={"".concat(key, "-").concat(art, "-").concat(mark)} source={source.replace('<svg', "<svg data-moment=\"".concat(mark, "\""))} alt={alt} width={size} height={size} isInteractive={art !== 'mark'}/>
    </Box>);
};
