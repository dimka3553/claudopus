"use strict";
// The app's own prompts: a chat stopped on "Allow Claude to run this command?" shows amber in every panel
let waiting = [];
let asked = [];
const inputKey = (input) => JSON.stringify(input ?? null).slice(0, 2000);
const askedFor = (agent, tool, input) => {
    const same = asked.filter(one => one.agent === (agent ?? '') && one.tool === tool);
    const one = same.find(other => other.input === inputKey(input)) ?? same.at(-1);
    if (one)
        asked = asked.filter(other => other !== one);
    return one?.id;
};
const NO_SKIPS = "No: it doesn't run, and the chat waits for what you say next.";
const NO_TOLD = "No: it doesn't run, and Claudopus tells Claude you said no.";
const promptOf = (tool, input, list, isWork = false) => {
    const given = (input && typeof input === 'object' ? input : {});
    const field = (key) => (typeof given[key] === 'string' ? oneLine(given[key]) : '');
    const whole = (key, max) => (typeof given[key] === 'string' ? cut(given[key].trim(), max) : '');
    const file = (path) => path.split('/').filter(Boolean).pop() ?? '';
    const workNamed = (id) => {
        if (!id)
            return 'another task';
        if (id === 'main' || id === 'parent')
            return 'its chat';
        const card = list.find(one => one.id === id) ?? list.find(one => id.startsWith(one.id));
        return card ? `the task “${titleOf(card)}”` : 'another task';
    };
    const allow = (text, yes, detail = '', no = isWork ? NO_TOLD : NO_SKIPS) => ({ text, kind: 'allow', ...(detail ? { detail } : {}), yes: `Yes: ${yes}`, no });
    if (tool === 'Bash' || tool === 'PowerShell')
        return allow(`Run a command: ${cut(field('description'), 90) || cut(field('command'), 90) || 'no description'}`, 'the command runs on its Mac.', whole('command', 400));
    if (tool === 'Write')
        return allow(`Write the file ${file(field('file_path')) || 'a file'}`, 'Claude saves the file, replacing any file of that name.', field('file_path'));
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return allow(`Change the file ${file(field('file_path') || field('notebook_path')) || 'a file'}`, 'Claude changes the file.', field('file_path') || field('notebook_path'));
    if (tool === 'Read')
        return allow(`Read the file ${file(field('file_path')) || 'a file'}`, 'Claude reads the file and changes nothing.', field('file_path'));
    if (tool === 'Glob' || tool === 'Grep')
        return allow(`Search files for ${cut(field('pattern'), 80) || 'a pattern'}`, 'Claude searches and changes nothing.', field('path'));
    if (tool === 'WebFetch')
        return allow(`Open a web page on ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'the web'}`, 'Claude reads the page and sends nothing but its address.', field('url'));
    if (tool === 'WebSearch')
        return allow(`Search the web for “${cut(field('query'), 80)}”`, 'Claude searches the web and reads the results.');
    if (tool === 'SendMessage') {
        const to = workNamed(field('to'));
        return {
            ...allow(to === 'its chat' ? 'Send a message to its chat' : `Send a message to ${to}`, to === 'its chat' ? 'its chat gets the message.' : 'that task gets the message and acts on it.', whole('message', 400) || field('summary'), isWork ? "No: it isn't sent, and Claudopus tells Claude you said no." : "No: it isn't sent, and the chat waits for what you say next."),
            done: 'Claude sent it',
        };
    }
    if (tool === 'Agent' || tool === 'Task')
        return { ...allow(`Start a task: ${cut(field('description'), 90) || 'with no title'}`, 'the task starts in the background and gets a card here.', whole('prompt', 300), isWork ? NO_TOLD : "No: it doesn't start, and the chat waits for what you say next."), done: 'Claude started it' };
    if (tool === 'TaskStop')
        return { ...allow(`Stop ${workNamed(field('task_id') || field('id'))}`, 'that task stops where it is.', '', isWork ? 'No: that task keeps running, and Claudopus tells Claude you said no.' : 'No: that task keeps running, and the chat waits for what you say next.'), done: 'Claude stopped it' };
    if (tool === 'Skill')
        return allow(`Use the skill “${field('skill') || field('name')}”`, 'Claude loads those instructions and follows them.');
    if (tool === 'AskUserQuestion') {
        const first = Array.isArray(given.questions) ? given.questions[0]?.question : undefined;
        return {
            text: typeof first === 'string' && first.trim() ? `Answer a question: ${cut(oneLine(first), 120)}` : 'Answer a question',
            kind: 'question',
            yes: 'Pick an answer: Claude gets it and carries on.',
            no: 'Skip it: Claude gets no answer and waits for what you say next.',
        };
    }
    if (tool === 'ExitPlanMode')
        return { text: 'Approve a plan', kind: 'plan', detail: whole('plan', 400), yes: 'Yes: Claude starts doing what the plan says.', no: 'No: Claude keeps planning. Say what to change.' };
    const mcp = tool.match(/^mcp__(.+?)__(.+)$/);
    const words = field('description') || field('text') || field('query') || field('title') || field('name') || field('url');
    if (mcp)
        return allow(`Use “${(mcp[2] ?? '').replace(/_/g, ' ')}” from ${(mcp[1] ?? '').replace(/^plugin_[^_]+_/, '').replace(/[_-]/g, ' ')}`, 'that action runs.', cut(words, 300));
    return allow(words ? `Use a tool: ${cut(words, 90)}` : 'Use one of its tools', 'that tool runs.', '');
};
// The start of a command up to its first quote, `$` or line break, as a running shell shows it whatever the quoting
const snippetOf = (tool, input) => {
    if (tool !== 'Bash')
        return '';
    const head = (String(input?.command ?? '').split(/['"\\\n$`]/)[0] ?? '').trimEnd();
    return head.trim().length >= 4 ? head.slice(0, 80) : '';
};
// How many of Claude's shells on this Mac run a command that starts so (the Bash tool runs it as `eval '<command>'`): counted as its
// prompt opens, so only one more than then is this call's
const running = async ($) => {
    const r = await $.process.run(['ps', '-ww', '-x', '-o', 'args='], { timeoutMs: 5000 });
    return r.exitCode === 0 ? r.stdout.split('\n') : undefined;
};
const countOf = (lines, snippet) => lines.filter(line => line.includes(`eval '${snippet}`)).length;
const opened = async ($, agent, tool, input) => {
    const at = await $.clock.now();
    const id = askedFor(agent, tool, input) ?? `pr-${at}-${Math.random().toString(36).slice(2, 8)}`;
    const list = await read($, todos);
    const card = agent !== undefined ? list.find(one => one.id === topOf(list, agent)) : undefined;
    const strings = Object.fromEntries(Object.entries(input && typeof input === 'object' ? input : {}).filter(([, value]) => typeof value === 'string'));
    const one = { id, ...promptOf(tool, input, list, Boolean(agent)), ...(card ? { title: titleOf(card) } : {}), at, tool, agent: agent ?? '', snippet: snippetOf(tool, input), input: strings };
    waiting = [...waiting.filter(other => other.id !== id), one];
    redraw($);
    void shareMine($).catch(() => undefined);
    // The count to start from is taken beside the prompt, never in its way
    if (one.snippet)
        void running($)
            .then(lines => void (lines && (waiting = waiting.map(other => (other.id === id ? { ...other, seen: countOf(lines, one.snippet) } : other)))))
            .catch(() => undefined);
    return id;
};
// The app says a prompt is still waiting (its own "needs your permission", a few seconds on): it is told aloud once, as an ask is.
// A prompt answered before that is never told
const tellWaiting = async ($) => {
    const due = waiting.filter(one => !one.isTold);
    if (!due.length)
        return;
    waiting = waiting.map(one => ({ ...one, isTold: true }));
    const { title } = await read($, me);
    const chat = title.trim() || cwd.split('/').filter(Boolean).pop() || 'A chat';
    for (const one of due)
        await aloud($, 'prompt', `${one.title ?? chat} has a question for you`, one.text, `prompt-${one.id}`).catch(err => log($, `prompt not told: ${String(err)}`));
};
let answeredPrompts = [];
const PROMPT_SHOWN = 15000;
// An allowed call whose end is never seen is taken as over this long after it was seen running, so nothing stays purple for good
const RUNNING_LONGEST = 15 * 60000;
const answeredShown = (at) => answeredPrompts.filter(one => (one.endedAt ? at - one.endedAt < PROMPT_SHOWN : at - one.at < RUNNING_LONGEST));
const settle = ($, id, agent, tool, outcome, args) => {
    const byTool = (one) => one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent ?? '');
    // The same call as the prompt asked about: every word it asked with is the call's own
    const isSameCall = (one) => Boolean(args) && Object.keys(one.input ?? {}).length > 0 && Object.entries(one.input ?? {}).every(([key, value]) => args?.[key] === value);
    // Its own id first, open or answered; only then the oldest open one of the same loop and tool whose id was not known. That one says
    // what came of it only when the call asked with the very same words; else it may be another call's, and it goes with no word
    const exact = waiting.find(one => one.id === id);
    const isOpen = (one) => !one.endedAt || one.isPressedNo;
    let was = exact ? undefined : answeredPrompts.find(one => one.id === id && isOpen(one));
    const sameOpen = exact || was || !tool ? undefined : waiting.find(one => byTool(one) && isSameCall(one));
    // One answered on its card, whose id was not known, is the same call only when it asked with the very same words, and only when no
    // open prompt did
    if (!exact && !was && !sameOpen && tool)
        was = answeredPrompts.find(one => isOpen(one) && (one.isRunning || one.isPressedNo) && byTool(one) && isSameCall(one));
    const guessed = exact || was || !tool ? undefined : (sameOpen ?? waiting.find(byTool));
    const gone = exact ?? guessed;
    if (!gone && !was)
        return;
    if (gone)
        waiting = waiting.filter(one => one !== gone);
    const before = exact ?? was ?? (guessed && isSameCall(guessed) ? guessed : undefined);
    if (outcome && before) {
        void $.clock.now().then(now => {
            const isEnd = outcome !== 'running';
            // A no pressed on the card stands unless the call went on: then Claude Code's own box had said yes first
            if (before.isPressedNo && outcome !== 'running' && outcome !== 'ran')
                return;
            const wasAllowed = before.answered === 'yes';
            const answered = outcome === 'no' ? 'no' : outcome === 'stopped' && !wasAllowed ? 'stopped' : 'yes';
            const { isHeld: _held, isPressedNo: _pressed, ...base } = before;
            const after = { ...base, ...(outcome === 'no' && pressedNo.has(before.id) ? { isPressedNo: true } : {}), answered, isRunning: !isEnd, ...(isEnd ? { endedAt: now } : { at: now }), ...(outcome === 'stopped' && wasAllowed ? { isCut: true } : {}) };
            answeredPrompts = [...answeredShown(now).filter(one => one.id !== before.id), after].slice(-10);
            redraw($);
            void shareMine($).catch(() => undefined);
            $.clock.after((isEnd ? PROMPT_SHOWN : RUNNING_LONGEST) + 100, () => (redraw($), void shareMine($).catch(() => undefined)));
        });
    }
    redraw($);
    void shareMine($).catch(() => undefined);
};
// What came of a call, as it ended: the person said no, it ended before it ran (interrupted, timed out, the turn or session ended), or
// it ran. The engine says most endings in words, in the result or its text, often with isError
const REFUSED_WORDS = /doesn't want to proceed|tool use was rejected|user (denied|rejected)|permission to use .{1,80} (has been|was) denied/i;
const NOT_RUN_WORDS = /\[(tool call (not|did not) complete|request interrupted)|interrupted by user|the (turn|session) (was )?ended|approval request expired/i;
const outcomeOf = (r) => {
    if (!r)
        return 'stopped';
    // Only a call that did not end well is read for words: a command that ran may print anything
    if (!r.deny && !r.isError && typeof r.result !== 'string')
        return 'ran';
    const words = [typeof r.deny === 'string' ? r.deny : '', typeof r.text === 'string' ? r.text : '', typeof r.result === 'string' ? r.result : JSON.stringify(r.result ?? '').slice(0, 2000)].join('\n');
    if (REFUSED_WORDS.test(words))
        return 'no';
    if (NOT_RUN_WORDS.test(words))
        return 'stopped';
    if (r.deny)
        return 'no';
    return r.isError ? 'stopped' : 'ran';
};
// The mod's own message, once on its way: a prompt it raised that no hook of the mod saw (one of its own tools, by a plugin's call
// id) is over with it
// The mod's own message to work: a prompt it raises is over once it is on its way
const sendOwn = async ($, message) => {
    const since = await $.clock.now();
    try {
        return await $.session.send(message);
    }
    finally {
        ownSent($, since);
    }
};
const ownSent = ($, since) => {
    const own = waiting.filter(one => one.id.startsWith('toolu_plugin_') && OWN_CALLS.includes(one.tool) && one.at >= since);
    if (!own.length)
        return;
    waiting = waiting.filter(one => !own.includes(one));
    redraw($);
    void shareMine($).catch(() => undefined);
};
// A command allowed starts at once: a process on this Mac running it ends its prompt before the command itself ends
let isLooking = false;
const lookForStarted = async ($) => {
    const sought = waiting.filter(one => one.snippet && one.seen !== undefined);
    if (!sought.length || isLooking)
        return;
    isLooking = true;
    try {
        const lines = await running($);
        if (!lines)
            return;
        for (const one of sought)
            if (countOf(lines, one.snippet) > (one.seen ?? 0))
                settle($, one.id, undefined, undefined, 'running');
    }
    finally {
        isLooking = false;
    }
};
// A press on a prompt's card, by the prompt's id, read by its hold between two looks; the prompts held now
const promptSaid = new Map();
const promptHeld = new Set();
const pressedNo = new Set();
// The longest a prompt waits for a press: past it the hook hands the prompt back to whatever else answers it
const HOLD_LONGEST = 10 * 60000;
const PRESSED_NO = "The person said no to this on its card in the Claudopus panel. It didn't run. Wait for what they say next.";
const PRESSED_NO_WORK = "The person said no to this on its card in the Claudopus panel. It didn't run: don't try it another way; continue without it.";
const markHeld = ($, id, isHeld) => {
    waiting = waiting.map(one => (one.id !== id ? one : isHeld ? { ...one, isHeld: true } : (({ isHeld: _held, ...rest }) => rest)(one)));
    redraw($);
    void shareMine($).catch(() => undefined);
};
// Holds the prompt until a press on its card, its call ends (the box was answered), the engine gives up on the hook, or this copy of
// the mod is replaced. As the admin gate does, the wait is a one-second sleep run by the engine, whose time the hook's own budget
// does not count. Its buttons show only while it is held. Claude Code's box answers beside it, and that answer is seen only as the
// call runs or ends; a press after it changes nothing, and the card then says what the call did
const holdPrompt = async ($, next, id) => {
    const since = await $.clock.now();
    promptHeld.add(id);
    markHeld($, id, true);
    let said;
    try {
        for (;;) {
            said = promptSaid.get(id);
            if (said)
                break;
            if (!waiting.some(one => one.id === id) || next.signal?.aborted || (next.budget?.remainingMs ?? Infinity) < 1500 || (await isReplaced($)))
                break;
            if ((await $.clock.now()) - since > HOLD_LONGEST)
                break;
            await $.process.run(['/bin/sleep', '1'], { timeoutMs: 10000 }).catch(() => undefined);
        }
    }
    finally {
        promptHeld.delete(id);
        promptSaid.delete(id);
        if (waiting.some(one => one.id === id))
            markHeld($, id, false);
    }
    return said;
};
// A press on Yes or No on its card in this chat's own panel, the only answer the mod gives: the prompt is answered at once and its card says so, as one answered in the box
const answerPrompt = ($, id, said) => {
    presses += 1;
    if (!promptHeld.has(id) || promptSaid.has(id))
        return false;
    const one = waiting.find(other => other.id === id);
    if (!one)
        return false;
    promptSaid.set(id, said);
    if (said === 'no')
        pressedNo.add(id);
    settle($, id, one.agent || undefined, one.tool, said === 'yes' ? 'running' : 'no');
    return true;
};
// Work an allowed Agent call started: its prompt was answered, so it leaves the amber and its buttons go
const agentStarted = ($, toolUseId) => {
    if (toolUseId && waiting.some(one => one.id === toolUseId))
        settle($, toolUseId, undefined, undefined, 'running');
};
// ---- A call Claude Code refused a background task with no prompt for the person: a notice on the task's card ----
// A background task or helper has no box of the app's own: Claude Code's auto mode, its safety checks, or a call that needs a person
// in a run nobody can be asked in refuse the call outright, and no PermissionRequest is raised for it (16 Nov: 47 refusals that
// way, none put to the person). Its task's card says what was refused and why, and that the task carries on without it. Claudopus
// never lets a refused call through, and nothing it says invites the task to reach what was refused another way
const CARRY_ON = 'Carry on without it';
// Claude Code's own refusals, as its result or its deny begins (its texts in 2.1.325), and who refused, for the card
const CC_REFUSALS = [
    ['Permission for this action was denied by the Claude Code auto mode classifier', "Claude Code's auto mode blocked it"],
    ['Permission for this command was denied by a built-in Claude Code safety check', 'a built-in Claude Code safety check blocked it'],
    ['Permission for this tool use was denied. It requires approval, and this session has no approval surface', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['Permission for this tool use was denied: it requires interactive approval', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['no approval surface in this session', "it needs your OK, and Claude Code can't ask you in a background task"],
    ['nobody can be asked in this headless run', "it needs your OK, and Claude Code can't ask you in a background task"],
];
// A check that gave no verdict is no refusal: Claude may try again as it is
const NO_VERDICT = /gave no verdict|transient failure/i;
// Only Claude Code's own refusal counts, never a failing call whose output holds the same words (a search, a test); the reason kept
// is only what Claude Code gave in its "Reason: [...]", never the rest of its words, which are for the model
const refusalOf = (r) => {
    if (!r)
        return undefined;
    const said = [r.deny, ...(r.isError ? [r.result, r.text] : [])].map(one => (typeof one === 'string' ? one.trim() : '')).filter(Boolean);
    for (const words of said) {
        const found = CC_REFUSALS.find(([start]) => words.startsWith(start));
        if (!found || NO_VERDICT.test(words))
            continue;
        const reason = /^[^\n]*?Reason: \[([^\]\n]{1,200})\]/.exec(words)?.[1] ?? '';
        return { who: found[1], reason: cut(oneLine(reason), 120) };
    }
    return undefined;
};
const refusedByClaudeCode = async ($, agent, tool, call, r) => {
    const refusal = refusalOf(r);
    if (!refusal || !dir || isOff)
        return;
    const list = await read($, todos);
    const top = list.find(one => one.id === topOf(list, agent));
    const own = list.find(one => one.id === agent);
    if (!top || top.chat)
        return;
    const what = promptOf(tool, call, list, true);
    const who = own?.parentId ? `a helper of this task ("${titleOf(own)}")` : 'this task';
    const text = cut(`Claude Code blocked ${who}: ${what.text}.`, ASK_TEXT);
    // A command is shown whole, to copy or for the person to run on their own press (runit.tsx)
    const runnable = runnableOf(tool, call);
    const details = [
        what.detail && !runnable ? `What it is: ${what.detail}` : '',
        `Why: ${refusal.who}${refusal.reason ? ` (${refusal.reason})` : ''}.`,
        runnable ? runDetails() : "Claude carries on without it and won't try another way.",
    ]
        .filter(Boolean)
        .join('\n\n');
    const at = await $.clock.now();
    // A question waiting on the person, there already or put up meanwhile, is never replaced: the refusal is in the task's own result
    let isPut = false;
    const command = runnable ? { copy: runnable.command, isCommand: true, cwd: runnable.cwd } : {};
    await change($, agent, one => ((isPut = !one.ask), one.ask ? one : { ...one, ask: { text, details, ...command, choices: [CARRY_ON], from: agent, at, refused: true } }));
    if (!isPut)
        return void (await log($, `refusal of ${tool} for ${agent} not put on its card: its card asks something already`));
    if (runnable)
        await offerRun($, top.id, agent, at, runnable);
    await log($, `refusal of ${tool} for ${agent} put to the person on its card`);
    const card = (await read($, todos)).find(one => one.id === top.id);
    if (card)
        await askAloud($, card, text).catch(err => log($, `ask not told: ${String(err)}`));
    if (card)
        await askInChat($, card).catch(err => log($, `ask not shown in the chat: ${String(err)}`));
};
// What the task is told of the person's answer to that card: what was refused stays refused
const REFUSAL_ANSWERED = (asked, said, isReply) => `${isReply ? `${who(true)} replied, in their own words, to the notice that Claude Code refused your call ("${asked}"): ${said}` : `${who(true)} saw the notice that Claude Code refused your call ("${asked}").`} What Claude Code refused stays refused: do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.`;
const OWN_CALLS = ['SendMessage', 'TaskStop'];
const isOwnCall = (next) => next.origin?.plugin === 'claudopus';
const promptHooks = (on) => {
    // A prompt the app is about to put to the person shows amber in every panel. The mod answers only two kinds itself: its own messages
    // and Stops below, and a prompt the person answers with Yes or No on its card in this chat's own panel (PermissionRequest). A
    // settings hook that answered it put nothing to the person
    on('tool.check', async ($, e, next) => {
        // The mod's own calls carry out what the person already chose: their reply passed on to work, a Stop they pressed. The engine
        // would put each to them again as "Allow SendMessage", a prompt that says nothing of what it is, and no hook of the mod sees that
        // call end, so it never left the panel. Only these two tools, and only the mod's own calls of them, are allowed here
        const r = await next(e);
        // Only an ask becomes an allow: a rule or hook of the person's that refuses it still does
        if (r.decision === 'ask' && OWN_CALLS.includes(e.tool) && e.tool_use_id && isOwnCall(next))
            return { ...r, decision: 'allow' };
        if (r.decision === 'ask' && e.tool_use_id && e.approver) {
            asked = [...asked.filter(one => one.id !== e.tool_use_id), { agent: e.agentId ?? '', tool: e.tool, input: inputKey(e.input), id: e.tool_use_id }].slice(-50);
        }
        return r;
    });
    on('classic.PermissionRequest', async ($, e, next) => {
        const id = dir && !isEnded ? await opened($, e.agent_id, e.tool_name, e.tool_input).catch(err => (void log($, `prompt not shown: ${String(err)}`), '')) : '';
        const r = await next(e);
        if (id && r?.decision) {
            settle($, id);
            return r;
        }
        // A call to allow waits for a press on its card while the person can see one; a question or a plan is the person's own box's
        const one = waiting.find(other => other.id === id);
        if (!one || one.kind !== 'allow' || !(await $.session.surfaces().catch(() => [])).length)
            return r;
        const said = await holdPrompt($, next, id);
        if (!said)
            return r;
        if (said === 'yes')
            return { ...r, decision: { behavior: 'allow' } };
        // No from the chat's own thread stops its turn, as the box's No does; Claude is told, and continues without it
        return { ...r, decision: { behavior: 'deny', message: one.agent ? PRESSED_NO_WORK : PRESSED_NO, ...(one.agent ? {} : { interrupt: true }) } };
    });
    on('classic.Notification', async ($, e, next) => {
        if (e.notification_type === 'permission_prompt' && waiting.length)
            await tellWaiting($).catch(err => log($, `prompt not told: ${String(err)}`));
        return next(e);
    });
    // It goes as its call ends (refused, interrupted, or allowed and run: the main tool.call hook below), or as the terminal draws its
    // running pill
    on('ui.render', { component: 'ToolProgress' }, async ($, e, next) => {
        const id = e.props.tool_use_id;
        if (waiting.some(one => one.id === id))
            void Promise.resolve().then(() => settle($, id, undefined, undefined, 'running'));
        return next(e);
    });
};
