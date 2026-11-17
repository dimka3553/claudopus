// The panel's blue, for work that runs as a workflow: the purple of other work moved round to blue, as light and as strong
export const FLOW = '#4E93EF';
// A workflow's Details is a tab of its own, as a piece of work's is
export const FLOW_PANE = 'flow-';
export const flowPaneOf = (id) => `${FLOW_PANE}${id.replace(/[^A-Za-z0-9_-]/g, '-')}`.slice(0, 64);
const oneLine = (text) => text.replace(/\s+/g, ' ').trim();
const short = (text, most) => (text.length <= most ? text : `${text.slice(0, most - 1).trimEnd()}…`);
// A string field of the script's meta, as written: meta is a pure literal, so its fields are read as text
const field = (text, name) => {
    const m = new RegExp(`\\b${name}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`).exec(text);
    return m?.[2]?.replace(/\\(.)/g, '$1') ?? '';
};
// The meta at the head of a workflow script: its name, what it does, and its stages in order
export const metaOf = (script) => {
    const head = /export\s+const\s+meta\s*=\s*\{([\s\S]*?)\n\}/.exec(script)?.[1] ?? script.slice(0, 4000);
    const list = /phases\s*:\s*\[([\s\S]*?)\]/.exec(head)?.[1] ?? '';
    const phases = [...list.matchAll(/\{([^{}]*)\}/g)]
        .map(one => one[1] ?? '')
        .map(body => ({ title: field(body, 'title'), ...(field(body, 'detail') ? { detail: field(body, 'detail') } : {}), ...(field(body, 'model') ? { model: field(body, 'model') } : {}) }))
        .filter(one => one.title);
    const outside = head.replace(/phases\s*:\s*\[[\s\S]*?\]/, '');
    return { name: field(outside, 'name'), description: field(outside, 'description'), phases };
};
export const journalOf = (text) => text.split('\n').flatMap(row => {
    try {
        return row.trim() ? [JSON.parse(row)] : [];
    }
    catch {
        return [];
    }
});
// What an agent returned, in a few words: a verdict's pass and why, else its text's first line
export const outcomeOf = (value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const o = value;
        const pass = typeof o.pass === 'boolean' ? o.pass : typeof o.passed === 'boolean' ? o.passed : undefined;
        const why = ['why', 'summary', 'reason', 'verdict'].map(key => o[key]).find((one) => typeof one === 'string') ?? '';
        const findings = Array.isArray(o.findings) ? o.findings.filter((one) => typeof one === 'string' && Boolean(one.trim())).slice(0, 20).map(one => short(oneLine(one), 300)) : [];
        return { ...(pass === undefined ? {} : { pass }), why: short(oneLine(why), 160), ...(findings.length ? { findings } : {}), result: short(oneLine(JSON.stringify(value)), 600) };
    }
    const text = typeof value === 'string' ? value : value === undefined || value === null ? '' : JSON.stringify(value);
    return { why: short(oneLine(text.split('\n').find(line => line.trim()) ?? ''), 160), result: short(text.trim(), 600) };
};
// The journal laid over what the panel knew: each agent's label and stage, and how it ended
export const withJournal = (flow, lines, now) => {
    const agents = [...flow.agents];
    for (const line of lines) {
        if (!line.agentId)
            continue;
        const at = agents.findIndex(one => one.id === line.agentId);
        const was = at >= 0 ? agents[at] : { id: line.agentId, label: '', phase: '', status: 'working', at: now };
        const next = line.type === 'started'
            ? { ...was, label: line.label || was.label, phase: line.phase || was.phase }
            : line.type === 'result'
                ? { ...was, status: 'done', endedAt: was.endedAt || now, ...outcomeOf(line.result) }
                : line.type === 'failed'
                    ? { ...was, status: 'failed', endedAt: was.endedAt || now }
                    : was;
        if (at >= 0)
            agents[at] = next;
        else
            agents.push(next);
    }
    return { ...flow, agents };
};
// An agent's stage: the journal's, else, before the journal names it, the stage of an earlier agent with the same label
const phaseOf = (flow, agent) => agent.phase || flow.agents.find(one => one.phase && one.label && one.label === agent.label)?.phase || '';
export const roundsOf = (flow) => {
    const first = flow.phases[0]?.title;
    const last = flow.phases.at(-1)?.title;
    const rounds = [];
    for (const was of flow.agents) {
        const agent = { ...was, phase: phaseOf(flow, was) };
        const open = rounds.at(-1);
        // A new round begins when the first stage starts again; and, before the journal names an agent's stage, when the round so far
        // has been judged by its last stage
        const isNew = !open ||
            (first !== undefined && agent.phase === first && open.agents.some(one => one.phase !== first)) ||
            (!agent.phase && last !== undefined && open.agents.some(one => one.phase === last && one.status !== 'working'));
        if (isNew)
            rounds.push({ n: rounds.length + 1, agents: [], phase: '', isOpen: true, why: '', findings: [] });
        rounds.at(-1)?.agents.push(agent);
    }
    return rounds.map(round => {
        const judge = [...round.agents].reverse().find(one => (last ? one.phase === last : true) && one.status !== 'working');
        const running = round.agents.find(one => one.status === 'working');
        const isOpen = flow.status === 'working' && (Boolean(running) || !judge);
        return { ...round, phase: (running ?? round.agents.at(-1))?.phase ?? '', isOpen, ...(judge?.pass === undefined ? {} : { pass: judge.pass }), why: judge?.why ?? '', findings: judge?.findings ?? [] };
    });
};
// The stage being run now: the stage of the agent started last that has not ended, else of the last one started
export const stageOf = (flow) => {
    if (flow.status !== 'working')
        return '';
    const one = [...flow.agents].reverse().find(agent => agent.status === 'working') ?? flow.agents.at(-1);
    return (one ? phaseOf(flow, one) : '') || flow.phases[0]?.title || '';
};
// The run as squares, one per stage of each round started, grouped by round. A round's stages not yet started are open squares
export const squaresOf = (flow, rounds = roundsOf(flow)) => {
    const stages = flow.phases.map(p => p.title);
    const last = stages.at(-1);
    const of = (one) => !one
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
    return rounds.map(round => {
        if (!stages.length)
            return round.agents.map(of);
        const slots = stages.map(stage => [...round.agents].reverse().find(one => one.phase === stage));
        // Agents the journal has not yet named take the first slots still empty
        for (const one of round.agents.filter(agent => !agent.phase)) {
            const at = slots.findIndex(slot => !slot);
            if (at >= 0)
                slots[at] = one;
        }
        return slots.map(of);
    });
};
const SQUARE = 11;
const STEP_GAP = 3;
const ROUND_GAP = 10;
// The colours of the squares: grey for a step done, the panel's blue for one running, green and red for a check's verdict
export const SQUARE_COLOR = { done: '#9A9A9A', running: '#4E93EF', waiting: '#8C8C8C', passed: '#3FB950', failed: '#E5534B', broke: '#E5534B' };
// How wide the squares are, in the app's pixels
export const squaresWidth = (groups) => Math.max(SQUARE, groups.reduce((w, g, i) => w + (i ? ROUND_GAP : 0) + g.length * SQUARE + Math.max(0, g.length - 1) * STEP_GAP, 0));
// The squares drawn, as Claude's own view of a workflow draws its agents: filled when done, blue and breathing while running, an
// outline when not started; a check filled green or red by its verdict, a step that broke outlined red
export const squaresSvg = (groups, height) => {
    const width = squaresWidth(groups);
    const y = (height - SQUARE) / 2;
    let x = 0;
    const shapes = [];
    groups.forEach((group, i) => {
        if (i)
            x += ROUND_GAP;
        group.forEach((one, j) => {
            if (j)
                x += STEP_GAP;
            const color = SQUARE_COLOR[one];
            const isOpen = one === 'waiting' || one === 'broke';
            const pulse = one === 'running' ? '<animate attributeName="opacity" values="1;0.7;1" dur="1.6s" repeatCount="indefinite"/>' : '';
            shapes.push(isOpen
                ? `<rect x="${x + 0.75}" y="${y + 0.75}" width="${SQUARE - 1.5}" height="${SQUARE - 1.5}" rx="2.5" fill="none" stroke="${color}" stroke-width="1.5" opacity="${one === 'waiting' ? 0.7 : 1}"/>`
                : `<rect x="${x}" y="${y}" width="${SQUARE}" height="${SQUARE}" rx="2.5" fill="${color}">${pulse}</rect>`);
            x += SQUARE;
        });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${shapes.join('')}</svg>`;
};
// The most squares one drawing holds: the app refuses an Svg over 131,072 characters, and a running square, the longest, takes
// about 165, so 600 stay under it with room. A longer run draws its last rounds that fit, and says how many came before
export const SQUARES_MOST = 600;
export const squaresKept = (groups) => {
    let [n, from] = [0, groups.length];
    while (from > 0 && n + (groups[from - 1]?.length ?? 0) <= SQUARES_MOST)
        n += groups[--from]?.length ?? 0;
    // One round alone with more steps than that still draws its last steps, and says how many of its steps came before
    const last = groups.at(-1) ?? [];
    if (from === groups.length && groups.length)
        return { groups: [last.slice(-SQUARES_MOST)], earlier: groups.length - 1, steps: last.length - SQUARES_MOST };
    return { groups: groups.slice(from), earlier: from, steps: 0 };
};
// What came before the squares drawn, in words: '' when nothing did
export const squaresBefore = (kept) => [kept.earlier ? `${kept.earlier} earlier round${kept.earlier === 1 ? '' : 's'}` : '', kept.steps ? `${kept.steps} earlier stage${kept.steps === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ');
// The squares for a surface that draws no pictures: one letter each, grouped by round
export const SQUARE_GLYPH = { done: '■', running: '■', waiting: '□', passed: '■', failed: '■', broke: '□' };
// A stage's name as what is being done: Make is Making, Check is Checking
export const doing = (stage) => {
    const word = stage.trim();
    if (!word || /ing$/i.test(word) || /\s/.test(word))
        return word;
    if (/[^e]e$/i.test(word))
        return `${word.slice(0, -1)}ing`;
    if (/^[^aeiou]*[aeiou][^aeiouwxy]$/i.test(word))
        return `${word}${word.slice(-1)}ing`;
    return `${word}ing`;
};
// Text made to fit a number of letters by leaving out its last whole words, never cut inside a word and never marked with an ellipsis
export const fitWords = (text, most) => {
    const words = oneLine(text).split(' ');
    let kept = '';
    for (const word of words) {
        const next = kept ? `${kept} ${word}` : word;
        if (next.length > most)
            break;
        kept = next;
    }
    // Shortened, it does not end on a small word that leans on the next
    if (kept.length < oneLine(text).length)
        kept = kept.replace(/(\s+(?:a|an|the|is|are|was|not|no|of|to|in|on|at|for|with|and|or|but|by|from|as|its|it|·|:|-))+$/i, '');
    return kept || (words[0] ?? '').slice(0, Math.max(1, most));
};
// The first of several wordings, fullest first, that fits a number of letters; the last when none does
export const firstFit = (wordings, most) => {
    const lines = wordings.map(parts => parts.filter(Boolean).join(' · '));
    return lines.find(line => line.length <= most) ?? lines.at(-1) ?? '';
};
// Who is in it: each role once, by its label, with the model it ran on
export const castOf = (flow) => {
    const seen = new Map();
    for (const one of flow.agents) {
        const role = one.label.replace(/[-\s#]*\d+$/, '') || one.phase || 'helper';
        if (!seen.has(role) || (!seen.get(role) && one.model))
            seen.set(role, one.model ?? '');
    }
    return [...seen.entries()].map(([role, model]) => ({ role, model }));
};
// The end of a run as the notice that it ended says it: its status, and the value it returned. Nothing when the text is no such notice
export const endOf = (text, taskId) => {
    if (!taskId || !text.includes('<task-notification') || !text.includes(taskId))
        return undefined;
    const tag = (name) => new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(text)?.[1]?.trim() ?? '';
    if (tag('task-id') && tag('task-id') !== taskId)
        return undefined;
    const status = tag('status');
    // Only a notice of how it ended ends it
    if (!['completed', 'failed', 'killed', 'stopped'].includes(status))
        return undefined;
    return {
        status: status === 'failed' ? 'failed' : status === 'killed' || status === 'stopped' ? 'stopped' : 'done',
        result: short(tag('result') || tag('summary'), 4000),
    };
};
// An agent's saved transcript as the rows a chat is drawn from: what it was told, what it wrote and each tool call, never its thinking
export const rowsOf = (text) => {
    const rows = [];
    const uses = new Map();
    for (const line of text.split('\n')) {
        let o;
        try {
            o = line.trim() ? JSON.parse(line) : undefined;
        }
        catch {
            o = undefined;
        }
        if (!o || (o.type !== 'user' && o.type !== 'assistant') || !o.message)
            continue;
        const content = o.message.content;
        const blocks = typeof content === 'string' ? [{ type: 'text', text: content }] : Array.isArray(content) ? content : [];
        const said = blocks.filter(b => b.type === 'text' && typeof b.text === 'string').map(b => b.text ?? '').join('\n');
        const toolUses = [];
        for (const b of blocks) {
            if (b.type === 'tool_use' && b.id && b.name) {
                const use = { tool_use_id: b.id, tool: b.name, input: (b.input && typeof b.input === 'object' ? b.input : {}) };
                uses.set(b.id, use);
                toolUses.push(use);
            }
            if (b.type === 'tool_result' && b.tool_use_id && b.is_error) {
                const use = uses.get(b.tool_use_id);
                if (use)
                    use.isError = true;
            }
        }
        // A row that only carries tool results is no message of the chat
        if (o.type === 'user' && !said.trim())
            continue;
        rows.push({ role: o.type, text: said, toolUses });
    }
    return rows;
};
// What a run is called on its card: the title its args give, else its task's first words, else what its script says it does
export const titleOfFlow = (args, meta) => {
    const a = args && typeof args === 'object' ? args : {};
    const given = typeof a.title === 'string' ? a.title : '';
    const task = typeof a.task === 'string' ? a.task : typeof args === 'string' ? args : '';
    return short(oneLine(given || task.split(/(?<=[.!?])\s/)[0] || meta.description || meta.name || 'Workflow'), 90);
};
// The cap on rounds the args give; none when they give none
export const capOf = (args) => {
    const a = args && typeof args === 'object' ? args : {};
    const cap = Number(a.cap ?? a.rounds);
    return Number.isFinite(cap) && cap > 0 ? Math.min(Math.round(cap), 99) : undefined;
};
