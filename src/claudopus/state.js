"use strict";
// ---- One stage for a task's card ----
const stageOf = (_list, card) => {
    if (card.status === 'failed' || card.status === 'stopped')
        return card.status;
    if (needsPerson(card))
        return 'waiting';
    return card.status === 'done' ? (card.up && !card.closedAt ? 'delivered' : 'done') : 'working';
};
// Just marked done by the person: for its two seconds the card stays where it was, green, before it goes under Finished
// (19 Nov, the person: "Done stays exactly where the delivered was when you mark it as done. It should always play the green
// animation")
// Its two seconds count from the first drawing of the panel made that shows it, never from the press: right after an update the
// panel's drawings came seconds late, so a moment counted from the press was over before any drawing showed it, and the card went straight
// under Finished with no green, no octopus and no sound while the next delivered card, alike, slid into its place: the press seemed
// to do nothing (19 Nov, the person: "I clicked Mark as done two times, and the animation didn't play. The sound didn't play")
// Each press of this load's, until its moment is first drawn (shownAt 0), and from when; one never drawn is over DONE_UNSEEN on
const doneMoments = new Map();
const DONE_UNSEEN = 10000;
const isDoneMoment = (one, at) => {
    const moment = doneMoments.get(one.id);
    if (one.status !== 'done' || !one.closedAt || !moment || moment.pressedAt !== one.closedAt)
        return false;
    // (a drawing begun before the first one showing it was made, as that very drawing, is in the moment too)
    return at >= moment.pressedAt && (moment.shownAt ? at - moment.shownAt < LINGER : at - moment.pressedAt < DONE_UNSEEN);
};
// Whether it handed in its result: delivered, or marked done by the person
const hasResult = (stage) => stage === 'delivered' || stage === 'done';
// Each stage in the words a card says it with, and its colour
const STAGE_WORD = { working: 'Working', waiting: 'Waiting for you', delivered: 'Delivered', done: 'Done', stopped: 'Stopped', failed: 'Failed' };
const stageColor = (stage) => ({ working: LIVE, waiting: NEEDS, delivered: DELIVERED, done: DONE, stopped: undefined, failed: 'error' })[stage];
// Why a card failed, where it says so
const WHY_NO_RESULT = 'Ended without its result';
const WHY_APP_CLOSED = 'The app closed while it worked';
const WHY_ERROR = 'Ended with an error';
const WHY_FLAGGED = 'Ended by a safety check';
// A server runs until it is stopped: it never ends by itself, so a task may finish with one left for the person
// (a build by a tool that also serves, as `vite build`, ends)
const isServerRun = (cmd, what) => (SERVER_CMD.test(cmd ?? '') && !/\b(vite|next|nuxt|astro) build\b/.test(cmd ?? '')) || describedOf(what).kind === 'server';
// The commands of its own that end by themselves and still run: every row of its card but a server's
const ownRuns = (card) => (card?.bg ?? []).filter(b => !isServerRun(b.cmd, b.what));
// Its helpers at work
const helpersAtWork = (list, id) => list.filter(one => one.parentId === id && one.status === 'working');
// Whether something of its own runs: a command that ends by itself, or a helper at work
const ownsWork = (list, card) => ownRuns(card).length > 0 || helpersAtWork(list, card.id).length > 0;
// Whether Claude Code pressed it for its report as its run ended, after its last call: the sign that its words reached no one (the
// chat is told only that it "ended without delivering a report"). A run where the engine asks for no report, as headless ones, ends
// with its words as its result
const isPressedAtEnd = (rows) => {
    if (!Array.isArray(rows))
        return false;
    for (const row of [...rows].reverse()) {
        const m = (row && typeof row === 'object' && 'message' in row ? row.message : row);
        const blocks = Array.isArray(m?.content) ? m.content : [m?.content];
        const texts = blocks.map(b => (typeof b === 'string' ? b : b && typeof b === 'object' ? String(b.text ?? '') + (typeof b.content === 'string' ? String(b.content) : '') : ''));
        if (m?.role === 'assistant' && blocks.some(b => b && typeof b === 'object' && b.type === 'tool_use'))
            return false;
        if (m?.role === 'user' && texts.some(text => text.includes(HANDBACK_PRESS)))
            return true;
    }
    return false;
};
// Whether Claude Code took the run's last words as its result: it never pressed it for a hand-back. Its messages unread, it may
// have been pressed, so it has not
const isUnpressed = async ($, id) => {
    const rows = await $.session.messages({ as: 'api', agentId: id }).catch(() => undefined);
    return Array.isArray(rows) && !isPressedAtEnd(rows);
};
// Its result was received: handed in with SubagentHandback, or its run's last words where Claude Code took those as its result
const hasReport = (one) => one?.reportAt !== undefined;
// Every change to the cards goes through here: a task's card cannot be kept as done without its received result, whatever path
// would end it so. It stays as it was before the change
const holdDone = (before, next) => {
    if (isOff)
        return next;
    const was = new Map(before.map(one => [one.id, one]));
    return next.map(one => {
        const old = was.get(one.id);
        const isHeld = !one.parentId && !one.chat && one.status === 'done' && !hasReport(one) && old?.status === 'working';
        // (what the person allowed it under "Ask once per piece of work" ends with it, and only once it really ends)
        if (old?.status === 'working' && one.status !== 'working' && !isHeld)
            (workAllowed.delete(one.id), releaseAllowed.delete(one.id));
        return isHeld && old ? { ...old, answer: one.answer || old.answer } : one;
    });
};
