"use strict";
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
exports.capOf = exports.titleOfFlow = exports.rowsOf = exports.endOf = exports.castOf = exports.firstFit = exports.fitWords = exports.doing = exports.SQUARE_GLYPH = exports.squaresSvg = exports.squaresWidth = exports.SQUARE_COLOR = exports.squaresOf = exports.stageOf = exports.roundsOf = exports.withJournal = exports.outcomeOf = exports.journalOf = exports.metaOf = exports.flowPaneOf = exports.FLOW_PANE = exports.FLOW = void 0;
// The panel's blue, for work that runs as a workflow: the purple of other work moved round to blue, as light and as strong
exports.FLOW = '#4E93EF';
// A workflow's Details is a tab of its own, as a piece of work's is
exports.FLOW_PANE = 'flow-';
var flowPaneOf = function (id) { return "".concat(exports.FLOW_PANE).concat(id.replace(/[^A-Za-z0-9_-]/g, '-')).slice(0, 64); };
exports.flowPaneOf = flowPaneOf;
var oneLine = function (text) { return text.replace(/\s+/g, ' ').trim(); };
var short = function (text, most) { return (text.length <= most ? text : "".concat(text.slice(0, most - 1).trimEnd(), "\u2026")); };
// A string field of the script's meta, as written: meta is a pure literal, so its fields are read as text
var field = function (text, name) {
    var _a, _b;
    var m = new RegExp("\\b".concat(name, "\\s*:\\s*(['\"`])((?:\\\\.|(?!\\1).)*)\\1")).exec(text);
    return (_b = (_a = m === null || m === void 0 ? void 0 : m[2]) === null || _a === void 0 ? void 0 : _a.replace(/\\(.)/g, '$1')) !== null && _b !== void 0 ? _b : '';
};
// The meta at the head of a workflow script: its name, what it does, and its stages in order
var metaOf = function (script) {
    var _a, _b, _c, _d;
    var head = (_b = (_a = /export\s+const\s+meta\s*=\s*\{([\s\S]*?)\n\}/.exec(script)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : script.slice(0, 4000);
    var list = (_d = (_c = /phases\s*:\s*\[([\s\S]*?)\]/.exec(head)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '';
    var phases = __spreadArray([], list.matchAll(/\{([^{}]*)\}/g), true).map(function (one) { var _a; return (_a = one[1]) !== null && _a !== void 0 ? _a : ''; })
        .map(function (body) { return (__assign(__assign({ title: field(body, 'title') }, (field(body, 'detail') ? { detail: field(body, 'detail') } : {})), (field(body, 'model') ? { model: field(body, 'model') } : {}))); })
        .filter(function (one) { return one.title; });
    var outside = head.replace(/phases\s*:\s*\[[\s\S]*?\]/, '');
    return { name: field(outside, 'name'), description: field(outside, 'description'), phases: phases };
};
exports.metaOf = metaOf;
var journalOf = function (text) {
    return text.split('\n').flatMap(function (row) {
        try {
            return row.trim() ? [JSON.parse(row)] : [];
        }
        catch (_a) {
            return [];
        }
    });
};
exports.journalOf = journalOf;
// What an agent returned, in a few words: a verdict's pass and why, else its text's first line
var outcomeOf = function (value) {
    var _a, _b;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        var o_1 = value;
        var pass = typeof o_1.pass === 'boolean' ? o_1.pass : typeof o_1.passed === 'boolean' ? o_1.passed : undefined;
        var why = (_a = ['why', 'summary', 'reason', 'verdict'].map(function (key) { return o_1[key]; }).find(function (one) { return typeof one === 'string'; })) !== null && _a !== void 0 ? _a : '';
        var findings = Array.isArray(o_1.findings) ? o_1.findings.filter(function (one) { return typeof one === 'string' && Boolean(one.trim()); }).slice(0, 20).map(function (one) { return short(oneLine(one), 300); }) : [];
        return __assign(__assign(__assign(__assign({}, (pass === undefined ? {} : { pass: pass })), { why: short(oneLine(why), 160) }), (findings.length ? { findings: findings } : {})), { result: short(oneLine(JSON.stringify(value)), 600) });
    }
    var text = typeof value === 'string' ? value : value === undefined || value === null ? '' : JSON.stringify(value);
    return { why: short(oneLine((_b = text.split('\n').find(function (line) { return line.trim(); })) !== null && _b !== void 0 ? _b : ''), 160), result: short(text.trim(), 600) };
};
exports.outcomeOf = outcomeOf;
// The journal laid over what the panel knew: each agent's label and stage, and how it ended
var withJournal = function (flow, lines, now) {
    var agents = __spreadArray([], flow.agents, true);
    var _loop_1 = function (line) {
        if (!line.agentId)
            return "continue";
        var at = agents.findIndex(function (one) { return one.id === line.agentId; });
        var was = at >= 0 ? agents[at] : { id: line.agentId, label: '', phase: '', status: 'working', at: now };
        var next = line.type === 'started'
            ? __assign(__assign({}, was), { label: line.label || was.label, phase: line.phase || was.phase }) : line.type === 'result'
            ? __assign(__assign(__assign({}, was), { status: 'done', endedAt: was.endedAt || now }), (0, exports.outcomeOf)(line.result)) : line.type === 'failed'
            ? __assign(__assign({}, was), { status: 'failed', endedAt: was.endedAt || now }) : was;
        if (at >= 0)
            agents[at] = next;
        else
            agents.push(next);
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        _loop_1(line);
    }
    return __assign(__assign({}, flow), { agents: agents });
};
exports.withJournal = withJournal;
// An agent's stage: the journal's, else, before the journal names it, the stage of an earlier agent with the same label
var phaseOf = function (flow, agent) { var _a; return agent.phase || ((_a = flow.agents.find(function (one) { return one.phase && one.label && one.label === agent.label; })) === null || _a === void 0 ? void 0 : _a.phase) || ''; };
var roundsOf = function (flow) {
    var _a, _b, _c;
    var first = (_a = flow.phases[0]) === null || _a === void 0 ? void 0 : _a.title;
    var last = (_b = flow.phases.at(-1)) === null || _b === void 0 ? void 0 : _b.title;
    var rounds = [];
    for (var _i = 0, _d = flow.agents; _i < _d.length; _i++) {
        var was = _d[_i];
        var agent = __assign(__assign({}, was), { phase: phaseOf(flow, was) });
        var open_1 = rounds.at(-1);
        // A new round begins when the first stage starts again; and, before the journal names an agent's stage, when the round so far
        // has been judged by its last stage
        var isNew = !open_1 ||
            (first !== undefined && agent.phase === first && open_1.agents.some(function (one) { return one.phase !== first; })) ||
            (!agent.phase && last !== undefined && open_1.agents.some(function (one) { return one.phase === last && one.status !== 'working'; }));
        if (isNew)
            rounds.push({ n: rounds.length + 1, agents: [], phase: '', isOpen: true, why: '', findings: [] });
        (_c = rounds.at(-1)) === null || _c === void 0 ? void 0 : _c.agents.push(agent);
    }
    return rounds.map(function (round) {
        var _a, _b, _c, _d;
        var judge = __spreadArray([], round.agents, true).reverse().find(function (one) { return (last ? one.phase === last : true) && one.status !== 'working'; });
        var running = round.agents.find(function (one) { return one.status === 'working'; });
        var isOpen = flow.status === 'working' && (Boolean(running) || !judge);
        return __assign(__assign(__assign(__assign({}, round), { phase: (_b = (_a = (running !== null && running !== void 0 ? running : round.agents.at(-1))) === null || _a === void 0 ? void 0 : _a.phase) !== null && _b !== void 0 ? _b : '', isOpen: isOpen }), ((judge === null || judge === void 0 ? void 0 : judge.pass) === undefined ? {} : { pass: judge.pass })), { why: (_c = judge === null || judge === void 0 ? void 0 : judge.why) !== null && _c !== void 0 ? _c : '', findings: (_d = judge === null || judge === void 0 ? void 0 : judge.findings) !== null && _d !== void 0 ? _d : [] });
    });
};
exports.roundsOf = roundsOf;
// The stage being run now: the stage of the agent started last that has not ended, else of the last one started
var stageOf = function (flow) {
    var _a, _b;
    if (flow.status !== 'working')
        return '';
    var one = (_a = __spreadArray([], flow.agents, true).reverse().find(function (agent) { return agent.status === 'working'; })) !== null && _a !== void 0 ? _a : flow.agents.at(-1);
    return (one ? phaseOf(flow, one) : '') || ((_b = flow.phases[0]) === null || _b === void 0 ? void 0 : _b.title) || '';
};
exports.stageOf = stageOf;
// The run as squares, one per stage of each round started, grouped by round. A round's stages not yet started are open squares
var squaresOf = function (flow, rounds) {
    if (rounds === void 0) { rounds = (0, exports.roundsOf)(flow); }
    var stages = flow.phases.map(function (p) { return p.title; });
    var last = stages.at(-1);
    var of = function (one) {
        return !one
            ? 'waiting'
            : one.status === 'failed'
                ? 'broke'
                : one.status === 'working'
                    ? flow.status === 'working'
                        ? 'running'
                        : 'broke'
                    : one.phase === last && one.pass !== undefined
                        ? one.pass
                            ? 'passed'
                            : 'failed'
                        : 'done';
    };
    return rounds.map(function (round) {
        if (!stages.length)
            return round.agents.map(of);
        var slots = stages.map(function (stage) { return __spreadArray([], round.agents, true).reverse().find(function (one) { return one.phase === stage; }); });
        // Agents the journal has not yet named take the first slots still empty
        for (var _i = 0, _a = round.agents.filter(function (agent) { return !agent.phase; }); _i < _a.length; _i++) {
            var one = _a[_i];
            var at = slots.findIndex(function (slot) { return !slot; });
            if (at >= 0)
                slots[at] = one;
        }
        return slots.map(of);
    });
};
exports.squaresOf = squaresOf;
var SQUARE = 11;
var STEP_GAP = 3;
var ROUND_GAP = 10;
// The colours of the squares: grey for a step done, the panel's blue for one running, green and red for a check's verdict
exports.SQUARE_COLOR = { done: '#9A9A9A', running: '#4E93EF', waiting: '#8C8C8C', passed: '#3FB950', failed: '#E5534B', broke: '#E5534B' };
// How wide the squares are, in the app's pixels
var squaresWidth = function (groups) { return Math.max(SQUARE, groups.reduce(function (w, g, i) { return w + (i ? ROUND_GAP : 0) + g.length * SQUARE + Math.max(0, g.length - 1) * STEP_GAP; }, 0)); };
exports.squaresWidth = squaresWidth;
// The squares drawn, as Claude's own view of a workflow draws its agents: filled when done, blue and breathing while running, an
// outline when not started; a check filled green or red by its verdict, a step that broke outlined red
var squaresSvg = function (groups, height) {
    var width = (0, exports.squaresWidth)(groups);
    var y = (height - SQUARE) / 2;
    var x = 0;
    var shapes = [];
    groups.forEach(function (group, i) {
        if (i)
            x += ROUND_GAP;
        group.forEach(function (one, j) {
            if (j)
                x += STEP_GAP;
            var color = exports.SQUARE_COLOR[one];
            var isOpen = one === 'waiting' || one === 'broke';
            var pulse = one === 'running' ? '<animate attributeName="opacity" values="1;0.7;1" dur="1.6s" repeatCount="indefinite"/>' : '';
            shapes.push(isOpen
                ? "<rect x=\"".concat(x + 0.75, "\" y=\"").concat(y + 0.75, "\" width=\"").concat(SQUARE - 1.5, "\" height=\"").concat(SQUARE - 1.5, "\" rx=\"2.5\" fill=\"none\" stroke=\"").concat(color, "\" stroke-width=\"1.5\" opacity=\"").concat(one === 'waiting' ? 0.7 : 1, "\"/>")
                : "<rect x=\"".concat(x, "\" y=\"").concat(y, "\" width=\"").concat(SQUARE, "\" height=\"").concat(SQUARE, "\" rx=\"2.5\" fill=\"").concat(color, "\">").concat(pulse, "</rect>"));
            x += SQUARE;
        });
    });
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(height, "\" viewBox=\"0 0 ").concat(width, " ").concat(height, "\">").concat(shapes.join(''), "</svg>");
};
exports.squaresSvg = squaresSvg;
// The squares for a surface that draws no pictures: one letter each, grouped by round
exports.SQUARE_GLYPH = { done: '■', running: '■', waiting: '□', passed: '■', failed: '■', broke: '□' };
// A stage's name as what is being done: Make is Making, Check is Checking
var doing = function (stage) {
    var word = stage.trim();
    if (!word || /ing$/i.test(word) || /\s/.test(word))
        return word;
    if (/[^e]e$/i.test(word))
        return "".concat(word.slice(0, -1), "ing");
    if (/^[^aeiou]*[aeiou][^aeiouwxy]$/i.test(word))
        return "".concat(word).concat(word.slice(-1), "ing");
    return "".concat(word, "ing");
};
exports.doing = doing;
// Text made to fit a number of letters by leaving out its last whole words, never cut inside a word and never marked with an ellipsis
var fitWords = function (text, most) {
    var _a;
    var words = oneLine(text).split(' ');
    var kept = '';
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var next = kept ? "".concat(kept, " ").concat(word) : word;
        if (next.length > most)
            break;
        kept = next;
    }
    // Shortened, it does not end on a small word that leans on the next
    if (kept.length < oneLine(text).length)
        kept = kept.replace(/(\s+(?:a|an|the|is|are|was|not|no|of|to|in|on|at|for|with|and|or|but|by|from|as|its|it|·|:|-))+$/i, '');
    return kept || ((_a = words[0]) !== null && _a !== void 0 ? _a : '').slice(0, Math.max(1, most));
};
exports.fitWords = fitWords;
// The first of several wordings, fullest first, that fits a number of letters; the last when none does
var firstFit = function (wordings, most) {
    var _a, _b;
    var lines = wordings.map(function (parts) { return parts.filter(Boolean).join(' · '); });
    return (_b = (_a = lines.find(function (line) { return line.length <= most; })) !== null && _a !== void 0 ? _a : lines.at(-1)) !== null && _b !== void 0 ? _b : '';
};
exports.firstFit = firstFit;
// Who is in it: each role once, by its label, with the model it ran on
var castOf = function (flow) {
    var _a;
    var seen = new Map();
    for (var _i = 0, _b = flow.agents; _i < _b.length; _i++) {
        var one = _b[_i];
        var role = one.label.replace(/[-\s#]*\d+$/, '') || one.phase || 'agent';
        if (!seen.has(role) || (!seen.get(role) && one.model))
            seen.set(role, (_a = one.model) !== null && _a !== void 0 ? _a : '');
    }
    return __spreadArray([], seen.entries(), true).map(function (_a) {
        var role = _a[0], model = _a[1];
        return ({ role: role, model: model });
    });
};
exports.castOf = castOf;
// The end of a run as the notice that it ended says it: its status, and the value it returned. Nothing when the text is no such notice
var endOf = function (text, taskId) {
    if (!taskId || !text.includes('<task-notification') || !text.includes(taskId))
        return undefined;
    var tag = function (name) { var _a, _b, _c; return (_c = (_b = (_a = new RegExp("<".concat(name, ">([\\s\\S]*?)</").concat(name, ">")).exec(text)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''; };
    if (tag('task-id') && tag('task-id') !== taskId)
        return undefined;
    var status = tag('status');
    // Only a notice of how it ended ends it
    if (!['completed', 'failed', 'killed', 'stopped'].includes(status))
        return undefined;
    return {
        status: status === 'failed' ? 'failed' : status === 'killed' || status === 'stopped' ? 'stopped' : 'done',
        result: short(tag('result') || tag('summary'), 4000),
    };
};
exports.endOf = endOf;
// An agent's saved transcript as the rows a chat is drawn from: what it was told, what it wrote and each tool call, never its thinking
var rowsOf = function (text) {
    var rows = [];
    var uses = new Map();
    for (var _i = 0, _a = text.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        var o = void 0;
        try {
            o = line.trim() ? JSON.parse(line) : undefined;
        }
        catch (_b) {
            o = undefined;
        }
        if (!o || (o.type !== 'user' && o.type !== 'assistant') || !o.message)
            continue;
        var content = o.message.content;
        var blocks = typeof content === 'string' ? [{ type: 'text', text: content }] : Array.isArray(content) ? content : [];
        var said_1 = blocks.filter(function (b) { return b.type === 'text' && typeof b.text === 'string'; }).map(function (b) { var _a; return (_a = b.text) !== null && _a !== void 0 ? _a : ''; }).join('\n');
        var toolUses = [];
        for (var _c = 0, blocks_1 = blocks; _c < blocks_1.length; _c++) {
            var b = blocks_1[_c];
            if (b.type === 'tool_use' && b.id && b.name) {
                var use = { tool_use_id: b.id, tool: b.name, input: (b.input && typeof b.input === 'object' ? b.input : {}) };
                uses.set(b.id, use);
                toolUses.push(use);
            }
            if (b.type === 'tool_result' && b.tool_use_id && b.is_error) {
                var use = uses.get(b.tool_use_id);
                if (use)
                    use.isError = true;
            }
        }
        // A row that only carries tool results is no message of the chat
        if (o.type === 'user' && !said_1.trim())
            continue;
        rows.push({ role: o.type, text: said_1, toolUses: toolUses });
    }
    return rows;
};
exports.rowsOf = rowsOf;
// What a run is called on its card: the title its args give, else its task's first words, else what its script says it does
var titleOfFlow = function (args, meta) {
    var a = args && typeof args === 'object' ? args : {};
    var given = typeof a.title === 'string' ? a.title : '';
    var task = typeof a.task === 'string' ? a.task : typeof args === 'string' ? args : '';
    return short(oneLine(given || task.split(/(?<=[.!?])\s/)[0] || meta.description || meta.name || 'Workflow'), 90);
};
exports.titleOfFlow = titleOfFlow;
// The cap on rounds the args give; none when they give none
var capOf = function (args) {
    var _a;
    var a = args && typeof args === 'object' ? args : {};
    var cap = Number((_a = a.cap) !== null && _a !== void 0 ? _a : a.rounds);
    return Number.isFinite(cap) && cap > 0 ? Math.min(Math.round(cap), 99) : undefined;
};
exports.capOf = capOf;
