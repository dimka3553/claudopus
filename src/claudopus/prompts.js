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
const promptOf = (tool, input, list) => {
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
    const allow = (text, detail = '', about = '') => ({ text: `${text}?`, kind: 'allow', ...(about ? { about } : {}), ...(detail ? { detail } : {}) });
    if (tool === 'Bash' || tool === 'PowerShell')
        return allow('Run this command', whole('command', 400), cut(field('description'), 160));
    if (tool === 'Write')
        return allow(`Write the file ${file(field('file_path')) || 'a file'}`, field('file_path'));
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return allow(`Change the file ${file(field('file_path') || field('notebook_path')) || 'a file'}`, field('file_path') || field('notebook_path'));
    if (tool === 'Read')
        return allow(`Read the file ${file(field('file_path')) || 'a file'}`, field('file_path'));
    if (tool === 'Glob' || tool === 'Grep')
        return allow(`Search files for ${cut(field('pattern'), 80) || 'a pattern'}`, field('path'));
    if (tool === 'WebFetch')
        return allow(`Open a web page on ${field('url').match(/^https?:\/\/([^/?#]+)/)?.[1] ?? 'the web'}`, field('url'));
    if (tool === 'WebSearch')
        return allow(`Search the web for “${cut(field('query'), 80)}”`);
    if (tool === 'SendMessage') {
        const to = workNamed(field('to'));
        return allow(to === 'its chat' ? 'Send this message to its chat' : `Send this message to ${to}`, whole('message', 400) || field('summary'));
    }
    if (tool === 'Agent' || tool === 'Task')
        return allow(`Start the task “${cut(field('description'), 90) || 'with no title'}”`, whole('prompt', 300));
    if (tool === 'TaskStop')
        return allow(`Stop ${workNamed(field('task_id') || field('id'))}`);
    if (tool === 'Skill')
        return allow(`Use the skill “${field('skill') || field('name')}”`);
    if (tool === 'AskUserQuestion') {
        const first = Array.isArray(given.questions) ? given.questions[0]?.question : undefined;
        return { text: typeof first === 'string' && first.trim() ? cut(oneLine(first), 160) : 'It has a question for you', kind: 'question' };
    }
    if (tool === 'ExitPlanMode')
        return { text: 'Approve this plan?', kind: 'plan', detail: whole('plan', 400) };
    const mcp = tool.match(/^mcp__(.+?)__(.+)$/);
    const words = field('description') || field('text') || field('query') || field('title') || field('name') || field('url');
    if (mcp)
        return allow(`Use “${(mcp[2] ?? '').replace(/_/g, ' ')}” from ${(mcp[1] ?? '').replace(/^plugin_[^_]+_/, '').replace(/[_-]/g, ' ')}`, '', cut(words, 300));
    return allow('Use one of its tools', '', cut(words, 160));
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
    const one = { id, ...promptOf(tool, input, list), ...(card ? { title: titleOf(card), card: card.id } : {}), at, tool, agent: agent ?? '', snippet: snippetOf(tool, input), input: strings };
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
// The prompt of a call goes as its call ends or is seen running: by its id, else the oldest one of the same loop and tool whose id
// was not known. A wait for its press ends with it (promptWaits)
const settle = ($, id, agent, tool, args) => {
    const byTool = (one) => one.id.startsWith('pr-') && one.tool === tool && one.agent === (agent ?? '');
    // The same call as the prompt asked about: every word it asked with is the call's own
    const isSameCall = (one) => Boolean(args) && Object.keys(one.input ?? {}).length > 0 && Object.entries(one.input ?? {}).every(([key, value]) => args?.[key] === value);
    const gone = waiting.find(one => one.id === id) ?? (tool ? (waiting.find(one => byTool(one) && isSameCall(one)) ?? waiting.find(byTool)) : undefined);
    if (!gone)
        return;
    waiting = waiting.filter(one => one !== gone);
    promptWaits.get(gone.id)?.(undefined);
    redraw($);
    void shareMine($).catch(() => undefined);
};
const IN_HOOK = 'CLAUDOPUS_IN_HOOK';
// Asked of the engine itself: the mod's own hook answers this name (promptHooks), and the engine leaves that hook out exactly
// where it would leave the mod's hooks out of a task started from here
const isInHook = async ($) => (await $.env.get('CLAUDOPUS_IN_HOOK').catch(() => undefined)) === 'hook';
const heldSends = [];
const sendOwnNow = async ($, message) => {
    const since = await $.clock.now();
    try {
        return await $.session.send(message);
    }
    finally {
        ownSent($, since);
    }
};
// `isLater`: asked from a hook the task it starts must keep (a tool call's), it waits for the next hook that may send it, as one
// asked from no hook does
const sendOwn = async ($, message, isStill, isLater = false) => {
    if (!isLater && (await isInHook($)))
        return sendOwnNow($, message);
    // (the same words for the same task wait once: a look that comes round again while they wait joins them)
    const same = heldSends.find(one => one.message.to.agentId === message.to.agentId && one.message.text === message.text);
    if (same?.result)
        return same.result;
    const one = { message, isStill, resolve: () => undefined, reject: () => undefined };
    one.result = new Promise((resolve, reject) => ((one.resolve = resolve), (one.reject = reject)));
    heldSends.push(one);
    redraw($);
    void log($, `a message for ${message.to.agentId} waits for a hook of the mod: sent from here, the task would run unseen by Claudopus`);
    return one.result;
};
// (never to a task the person stopped while it waited, nor one no longer wanted)
const sendOne = async ($, { message, isStill, resolve, reject }, text = message.text) => {
    const id = message.to.agentId;
    if (stoppedHere.has(id) || isHeld((await read($, todos)).find(card => card.id === id)))
        return resolve({ isDelivered: false, reason: 'the person stopped it meanwhile' });
    if (isStill && !(await isStill().catch(() => false)))
        return resolve({ isDelivered: false, reason: 'no longer wanted by the time it could be sent' });
    await sendOwnNow($, { ...message, text }).then(resolve, reject);
};
// Sends what waits, from inside the hook that calls it: a drawing of the bar or the panel, a press, a reply, a change in how full
// the chat is, and a hook kept only for this before each tool call (promptHooks). Never from a tool call's hook, nor from the hooks that hear a turn end or a message come:
// the engine leaves the hook a message is sent from out of the run it starts, and a task must keep those
let isSendingHeld = false;
const sendHeld = async ($) => {
    if (!heldSends.length || isSendingHeld)
        return;
    isSendingHeld = true;
    try {
        if (!(await isInHook($)) || (await isReplaced($)))
            return;
        // (a sender told how its message went may send its next, as a row of tasks started again one after another: that goes from
        // this hook too, so the hook stays a moment for it)
        for (let idle = 0; idle < 4; idle += 1) {
            for (let one = heldSends.shift(); one; one = heldSends.shift()) {
                idle = 0;
                await sendOne($, one);
                await log($, `the message that waited for ${one.message.to.agentId} went from a hook: its task runs where Claudopus sees it`);
            }
            await $.clock.now().catch(() => undefined);
        }
    }
    finally {
        isSendingHeld = false;
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
                settle($, one.id);
    }
    finally {
        isLooking = false;
    }
};
// What each held prompt's wait ends with: Allow or Don't allow pressed on its block, or nothing as its call ended first
const promptWaits = new Map();
const promptHeld = new Set();
// The longest a prompt waits for a press: past it the hook hands the prompt back to whatever else answers it
const HOLD_LONGEST = 10 * 60000;
const PRESSED_NO = "The person pressed Don't allow on this in the Claudopus panel. It didn't run. Wait for what they say next.";
const PRESSED_NO_WORK = "The person pressed Don't allow on this in the Claudopus panel. It didn't run: don't try it another way; continue without it.";
const markHeld = ($, id, isHeld) => {
    waiting = waiting.map(one => (one.id !== id ? one : isHeld ? { ...one, isHeld: true } : (({ isHeld: _held, ...rest }) => rest)(one)));
    redraw($);
    void shareMine($).catch(() => undefined);
};
// Holds the prompt until a press on its block, its call ends (Claude Code's own box was answered), the engine gives up on the hook,
// or this copy of the mod is replaced. The wait is a promise the press resolves, as the admin gate's is (heldStep keeps the hook's
// own clock stopped meanwhile). Its buttons show only while it is held
const holdPrompt = async ($, next, id) => {
    promptHeld.add(id);
    markHeld($, id, true);
    let isOver = false;
    let said;
    let end = () => undefined;
    const pressed = new Promise(resolve => (end = one => ((isOver = true), (said = one), resolve(one))));
    promptWaits.set(id, end);
    const stop = () => end(undefined);
    next.signal?.addEventListener('abort', stop, { once: true });
    whenLeft.add(stop);
    $.clock.after(HOLD_LONGEST, stop);
    try {
        while (!isOver) {
            if (!waiting.some(one => one.id === id) || next.signal?.aborted || (next.budget?.remainingMs ?? Infinity) < 1500 || (await isReplaced($)))
                break;
            await Promise.race([pressed, heldStep($)]);
        }
    }
    finally {
        whenLeft.delete(stop);
        promptHeld.delete(id);
        if (promptWaits.get(id) === end)
            promptWaits.delete(id);
        if (waiting.some(one => one.id === id))
            markHeld($, id, false);
    }
    return said;
};
// A press on Allow or Don't allow on its block in this chat's own panel, the only answer the mod gives: the block goes in the
// press's own drawing, one grey line says what was pressed, and the wait for it ends at once. Only the first press counts
const answerPrompt = ($, id, said) => {
    presses += 1;
    const end = promptWaits.get(id);
    const one = waiting.find(other => other.id === id);
    if (!promptHeld.has(id) || !end || !one)
        return false;
    promptWaits.delete(id);
    waiting = waiting.filter(other => other !== one);
    pressedLine($, one.card ?? '', said === 'yes' ? ALLOW : DONT_ALLOW);
    end(said);
    redraw($);
    void shareMine($).catch(() => undefined);
    return true;
};
// Work an allowed Agent call started: its prompt was answered, so it leaves the amber and its buttons go
const agentStarted = ($, toolUseId) => {
    if (toolUseId && waiting.some(one => one.id === toolUseId))
        settle($, toolUseId);
};
// ---- A command Claude Code blocked a background task from running, with no prompt for the person ----
// A background task or helper has no box of the app's own: Claude Code's auto mode, its safety checks, or a call that needs a person
// in a run nobody can be asked in refuse the call outright, and no PermissionRequest is raised for it (16 Nov: 47 refusals that
// way, none put to the person). A command so blocked is asked on its task's card as any permission is: Allow runs that very
// command once, as the person's own (runit.tsx), and Don't allow leaves it. Claudopus never lets the refused call itself through.
// A blocked call that is no command the person could run leaves nothing to decide, so nothing waits for them: the task was told
// by Claude Code and carries on without it
const BLOCKED_ASK = 'Claude Code blocked this command. Run it anyway?';
// A release Claude Code blocked comes after the person's press that allowed it (the go-ahead's Release it, or the release's own
// permission): Claude Code decides each command after that, and lets one it blocked run only on a press on that very command, so
// the card says plainly why a second press is asked (25 Nov, Dima: "Why doesn't it just ask me to approve?"). The two are not made
// one: a Release it press that ran the release itself would take every release out of Claude Code's own check
const BLOCKED_RELEASE_ASK = 'Claude Code blocked the release you allowed. Run it anyway?';
const RELEASE_SECOND_PRESS = "Your press allowed this release, then Claude Code's own safety check stopped it. Claude Code lets a command it blocked run only on a press on that command, so it needs this second press.";
// Said on its card: a typed allow in the chat answers other blocks, never this one (typed.tsx)
const PRESS_ONLY = "Only your press on Allow runs it. Typing allow in the chat doesn't.";
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
    // Only a command, short enough to read, shown whole: what the person's press would run (runit.tsx)
    const runnable = runnableOf(tool, call);
    if (!runnable && connectorRuleOf(tool))
        return void (await refusedConnector($, agent, top.id, own, tool, call, refusal.reason));
    if (!runnable)
        return void (await log($, `refusal of ${tool} for ${agent}: nothing the person could run, so nothing is asked`));
    const isRelease = releaseCalls(runnable.command, $.plugin.root, runnable.cwd).length > 0;
    const details = [runDetails(runnable, refusal.reason), isRelease ? RELEASE_SECOND_PRESS : '', own?.parentId ? `A helper of this task wanted it: “${titleOf(own)}”.` : '', PRESS_ONLY].filter(Boolean).join('\n\n');
    const asked = isRelease ? BLOCKED_RELEASE_ASK : BLOCKED_ASK;
    const at = await $.clock.now();
    // Beside any question waiting on the person, which it never replaces; only the same command already waiting for its Allow is not
    // put up twice
    let isPut = false;
    await change($, agent, one => ((isPut = !asksOf(one).some(ask => ask.refused && ask.copy === runnable.command && !ask.replied)), isPut ? withAsks(one, [...asksOf(one), { text: asked, details, copy: runnable.command, isCommand: true, cwd: runnable.cwd, from: agent, at, refused: true }]) : one));
    if (!isPut)
        return void (await log($, `refusal of ${tool} for ${agent} not put on its card: the same command waits on it already`));
    await offerRun($, top.id, agent, at, runnable);
    await log($, `refusal of ${tool} for ${agent} put to the person on its card`);
    const card = (await read($, todos)).find(one => one.id === top.id);
    if (card)
        await askAloud($, card, asked).catch(err => log($, `ask not told: ${String(err)}`));
    if (card)
        await askInChat($, card).catch(err => log($, `ask not shown in the chat: ${String(err)}`));
};
// A connector's tool Claude Code refused, such as a cost to confirm (21 Nov: Supabase's confirm_cost, refused six times after Dima's
// yes on the card and once after his yes in the chat). Claude Code counts no yes that reaches a task through the panel or the chat
// as the person's, and Claudopus does not call the tool in the task's place: only a rule in the person's own Claude Code settings,
// which Claude Code reads before its classifier, lets it through. So the card asks once with the one command that adds that rule
// (bin/allow-tool, which runs only at their terminal), Open in Terminal, and Try again, which tells the task to call it once more
const CONNECTOR_ASK = 'Claude Code blocked this action. Let your tasks do it?';
const TRY_AGAIN = 'Try again';
const connectorRuleOf = (tool) => (/^mcp__[A-Za-z0-9_-]+__[A-Za-z0-9_-]+$/.test(tool) && !tool.startsWith('mcp__claudopus__') ? tool : '');
// What the call was, in short: its own input, without the engine's own fields
const connectorInput = (call) => {
    const { tool: _tool, tool_use_id: _id, agentId: _agent, ...input } = call;
    const text = Object.keys(input).length ? JSON.stringify(input) : '';
    return text ? cut(oneLine(text), 300) : '';
};
const refusedConnector = async ($, agent, top, own, tool, call, reason) => {
    const rule = connectorRuleOf(tool);
    const name = rule.split('__').slice(2).join('__').replace(/_/g, ' ');
    const input = connectorInput(call);
    const home = dir.replace(/\/\.claude\/claudopus$/, '');
    const command = `${zshQuoted(`${$.plugin.root}/bin/allow-tool`)} ${rule}`;
    const details = [
        `It wanted to ${name}${input ? `: ${input}` : '.'}`,
        `${reason ? `Blocked as “${reason}”. ` : ''}Claude Code never counts a yes on this card or in the chat as yours for this: only your own Claude Code settings let it through.`,
        `Open in Terminal and press Return: it adds ${rule} to your Claude Code settings, so your tasks may do this from now on, and nothing else. Then press ${TRY_AGAIN}.`,
        own?.parentId ? `A helper of this task wanted it: “${titleOf(own)}”.` : '',
    ].filter(Boolean).join('\n\n');
    const at = await $.clock.now();
    let isPut = false;
    await change($, agent, one => ((isPut = !asksOf(one).some(ask => ask.rule === rule)), isPut ? withAsks(one, [...asksOf(one), { text: CONNECTOR_ASK, details, copy: command, isCommand: true, cwd: home, choices: [TRY_AGAIN, DONT_ALLOW], from: agent, at, rule }]) : one));
    if (!isPut)
        return void (await log($, `refusal of ${tool} for ${agent} not put on its card: the same action waits on it already`));
    await log($, `refusal of ${tool} for ${agent} put to the person on its card, with the rule that lets it through`);
    const card = (await read($, todos)).find(one => one.id === top);
    if (card)
        await askAloud($, card, CONNECTOR_ASK).catch(err => log($, `ask not told: ${String(err)}`));
    if (card)
        await askInChat($, card).catch(err => log($, `ask not shown in the chat: ${String(err)}`));
};
// What the task is told of the person's answer to it
const CONNECTOR_ANSWERED = (rule, said, isReply) => isReply
    ? `${who(true)} replied, in their own words, when asked to let your tasks use ${rule}, which Claude Code refused you: ${said}\nTheir words do not let it through: only the rule in their own Claude Code settings does, which the command on your card adds. If they say they have added it, call it once more exactly as before; otherwise answer them with the \`ask\` tool, or carry on without it.`
    : said === TRY_AGAIN
        ? `${who(true)} pressed "${TRY_AGAIN}" after being shown the command that adds ${rule} to their Claude Code settings. Call it once more now, exactly as before. If Claude Code refuses it again, the rule is not in yet and your card asks again: do not ask in words, and do not reach its result another way.`
        : `${who(true)} pressed "${DONT_ALLOW}" when asked to let your tasks use ${rule}, which Claude Code refused you. Do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.`;
// What the task is told of the person's answer to that card: what was refused stays refused
const REFUSAL_ANSWERED = (command, said, isReply) => `${isReply ? `${who(true)} replied, in their own words, when asked whether to run the command Claude Code refused you (${cut(oneLine(command), 200)}): ${said}` : `${who(true)} pressed "${DONT_ALLOW}" when asked whether to run the command Claude Code refused you (${cut(oneLine(command), 200)}).`} What Claude Code refused stays refused: do not do it, nor reach its result by other means. Carry on without it, and say in your report what was left out.`;
// What the task is told of the person's words on that card: the command waits there for their press, and words run nothing
const REFUSAL_WORDS = (command, said) => `${who(true)} wrote to you, in their own words, about the command Claude Code refused you (${cut(oneLine(command), 200)}), which waits on your card for their Allow: “${said}”\nAnswer them with the \`ask\` tool: your answer in \`text\` (one plain line) and \`details\` (what it does and why, in everyday words), with no \`choices\`. Claudopus shows it inside that permission, which keeps Allow and Don't allow: only their press runs the command, once, as theirs. Do not run it, or another way to the same end, yourself. With nothing else to do, end your step.`;
const OWN_CALLS = ['SendMessage', 'TaskStop'];
const isOwnCall = (next) => next.origin?.plugin === 'claudopus';
const promptHooks = (on) => {
    // Answers only where the mod's hooks run for what its code starts here (isInHook)
    on('env.get', ($, e, next) => (e.name === IN_HOOK ? { value: 'hook' } : next(e)));
    // A hook that does nothing else, before each tool call of the chat's or of any task's: what waits to start a task again goes from
    // here while anything is at work, and the task it starts loses no hook it needs, as the engine leaves out of its run only the
    // hook the message was sent from (sendHeld)
    on('classic.PreToolUse', async ($, e, next) => {
        if (heldSends.length)
            await sendHeld($).catch(err => log($, `message not sent: ${String(err)}`));
        return next(e);
    });
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
            void Promise.resolve().then(() => settle($, id));
        return next(e);
    });
};
