"use strict";
// What every part shares: the panel's names and limits, the state the panel draws from, the settings in force, small text
// helpers, the log and the chat's saved words
// The panel beside the chat: one small card per piece of work under way; pressed, a card shows all its to-dos and its own chat
const LIST = 'claudopus';
const LIST_TITLE = 'Claudopus';
// How many rows the panel asks for when a narrow terminal seats it above the prompt, where it fits its cards up to what the screen
// spares; left to itself it takes a third of the screen, which the header fills before any card
const PANEL_ROWS = 24;
// The panel that lists the servers on this Mac; it opens when asked for
const PANE = 'servers';
const PANE_TITLE = 'Servers';
// The panel an earlier version opened by itself
const OLD_PANE = 'agents';
// Rarely used tools wait behind ToolSearch instead of loading into every chat
const RARE_TOOLS = ['ReportFindings', 'SuggestPluginInstall', 'SuggestSkills', 'SearchPlugins', 'ScheduleWakeup', 'Workflow'];
const RARE_SERVERS = ['mcp__Claude_Browser__', 'mcp__Claude_Code_iOS_Simulator__', 'mcp__visualize__'];
// What a chat's own thread may call to hand work over: it starts agents and workflows, and talks to them. An agent may call anything
const OWN = ['Agent', 'Workflow', 'SendMessage', 'ListAgents', 'TaskStop', 'ToolSearch', 'AskUserQuestion', 'SendUserFile', 'ReadNotifications', 'Skill'];
// And what it reads with, to answer a question a few files answer: none of them changes a file or runs a command
const READS = ['Read', 'Grep', 'Glob'];
// The mod's own tools, as the chat names them; work recorded before the rename called them by the old name
const TOOLS = 'mcp__claudopus__';
const OLD_TOOLS = 'mcp__progress__';
const isTool = (tool, name) => tool === `${TOOLS}${name}` || tool === `${OLD_TOOLS}${name}`;
const OWN_SERVERS = [TOOLS, 'mcp__ccd_'];
// A message longer than this is a dump: the chat keeps the file's path, not the text
const PASTE_CHARS = 12000;
// Pieces of work kept in the list, ended ones included, and lines kept in the log of each
const KEPT = 40;
const ENTRIES_KEPT = 200;
// How many of the to-dos not yet started an open card lists before "more"
// What else a Details tab can unfold, kept beside its chat's numbers, far from them: the person's words whole, every to-do
// not yet started, and those done or dropped
const OPEN_ASK = -1000001;
const OPEN_DONE = -1000003;
const OPEN_RESULT = -1000004;
// Under a command's row in Details, its last lines sit on a darker ground, as a terminal's
const OUTPUT_FILL = '#0000003D';
// How much of what work reported at its end its Details shows before Show all
const RESULT_SHOWN = 600;
// Past this many done to-dos, Details folds them into one row
const DONE_FOLDED = 8;
// How much of a piece of work's chat the panel draws, the newest: this many lines, and this many characters, which one drawing has room for
const TALK_KEPT = 300;
const TALK_CHARS = 40000;
// The most characters the app draws in one tab: it counts every text and every picture's source, and a drawing of more is thrown
// away whole, so the tab keeps its old drawing, or after a switch away and back says "Nothing to show yet". The pictures a tab draws
// keep well under it (262144), with room for its text
const PICTURES_CHARS = 150000;
// How long one message of that chat may be
const SAID_CHARS = 8000;
// How much of a long message to the work is drawn before it is opened
const TOLD_CHARS = 300;
// How long the line of one tool step may be
const STEP_CHARS = 160;
// What a to-do's box is filled with: a grey so faint it reads on a dark and on a light theme. The app rounds the corners of every
// border it draws, so a box with square corners is a filled one
const FILL = '#80808024';
// A card's edge shows each to-do as a part of its own up to this many; more are one edge filled as far as they are done
const EDGE_PARTS = 14;
// How long a line of the log may be
const NOTE_CHARS = 200;
// How much of an answer the panel keeps
const ANSWER_CHARS = 30000;
// While the servers panel is open it looks again this often
const TICK = 3000;
// Work that has just ended stays in its place among the running cards this long, in its ended look, before it goes to Finished
const LINGER = 2000;
// Work that ended while the mod was reloading, which draws nothing for many seconds, has its pause from the panel's first drawing
// after the load instead (Infinity until then), by `<id>:<endedAt>`: a finish is never over before the panel could show it
const lateFrom = new Map();
// Ended work this long before a load may not have been drawn ended at all
const RELOAD_GRACE = 30000;
// When ended work's pause begins
const pauseFrom = (one) => Math.max(one.endedAt, lateFrom.get(`${one.id}:${one.endedAt}`) ?? 0);
// Whether ended work is still in that pause at a time: a card that ended in the future, as from another clock, is not
const isLingering = (one, at) => one.status !== 'working' && one.endedAt > 0 && at >= pauseFrom(one) && at - pauseFrom(one) < LINGER;
// Work acting on the person's reply in their own words to an ask it keeps open: at work, drawn in the work's purple, its question
// with the reply under it and nothing to press or type, as the person has answered. So from the moment the reply is sent: ended
// work being started again with it (isWaking), and another chat's work until its own chat has taken the reply (actingOn). Only
// once it stops again with the ask open does it wait on the person, with every answer back
const isActingOnReply = (one) => Boolean(one.ask) && ((Boolean(one.ask?.replied) && (one.status === 'working' || Boolean(one.ask?.replied?.isWaking))) || actingOn.has(`${one.id}:${one.ask?.at}`));
// An admin command held for the person's press needs them whatever else the work does
const needsPerson = (one) => Boolean(one.admins?.length) || (Boolean(one.ask) && !isActingOnReply(one));
// The moments a pause ends that a redraw is already set for, so each pause gets one
const lingerSet = new Set();
// The engine's list of agents is read again this often, and the minutes move on
const FOLLOW_EVERY = 20000;
// An agent in one of these states, as the engine names them, is still working
const WORKING = ['pending', 'running', 'waiting'];
// These listen on a port but serve no pages to open
const NO_PAGES = /^(postgres|redis-server|mysqld|mongod)\b/;
const me = atom({ plugin: 'claudopus', key: 'me' }, { id: '', title: '', tokens: 0, isChat: false, needsContext: false, roleSent: '', isListOpened: false, window: 0 }, { shape: 'me-6' });
const todos = atom({ plugin: 'claudopus', key: 'todos' }, [], { shape: 'todos-3' });
const view = atom({ plugin: 'claudopus', key: 'view' }, { openId: '' }, { shape: 'view-5' });
const servers = atom({ plugin: 'claudopus', key: 'servers' }, [], { shape: 'servers-2' });
// Counts the passes that bring the screen up to date: each one redraws what reads it
const tick = atom({ plugin: 'claudopus', key: 'tick' }, 0, { shape: 'tick-1' });
// When the figures above the prompt last changed: the band redraws on that alone, never each second, since each redraw of it closes
// and opens again a hover card the pointer rests on, and can leave one open after the pointer has gone on to the next figure
const figuresAt = atom({ plugin: 'claudopus', key: 'figures' }, 0, { shape: 'figures-1' });
// Whether the panel was open when last looked: a reload of the mod closes it, and it comes back by itself if it was
// When the panel was last drawn, kept through a reload (drawnNow, written by the timer each second, never read while drawing)
const lastDrawn = atom({ plugin: 'claudopus', key: 'drawn' }, 0, { shape: 'drawn-1' });
let drawnNow = 0;
// When the list was last given an older drawing again (held), and last drawn afresh: work that ended between the two was not seen
let listHeldAt = 0;
let listFreshAt = 0;
// The titles of work in its moment at the top, as last drawn: the line above the prompt points at them when the list is scrolled away
let finishedAtTop = [];
// The list of work is written only when it changes. Each write of a value the panel or Details read draws them again, and the app
// builds a pane it is asked to draw whole afresh, even when it shows the same: the element under the pointer loses its hover look,
// and a press on a button of the drawing replaced meanwhile reaches nothing. The list was written over with the same list every
// few seconds while work ran (15 Nov, a minute of running work: seven writes, none of them a change). Should another write land
// between the look and the write, the change is made again on what that write left
const changeTodos = async ($, fn) => {
    const now = await read($, todos);
    const before = JSON.stringify(now);
    const next = fn(now);
    if (JSON.stringify(next) === before)
        return now;
    return update($, todos, list => (JSON.stringify(list) === before ? next : fn(list)));
};
const paneShown = atom({ plugin: 'claudopus', key: 'shown' }, false, { shape: 'shown-1' });
// What the person has typed into an ask's reply box and not sent, by the work, kept through a reload of the mod (drafts, written as
// they type, read back once as the mod loads, never while drawing). A key box's letters are never kept: its surface holds them
const draftsKept = atom({ plugin: 'claudopus', key: 'drafts' }, {}, { shape: 'drafts-1' });
// Each load of this code in a chat, first or a reload, is told by a mark of its own, kept in the session's state as the load now in
// charge. A /reload-plugins starts the new copy but leaves the old copy's timers running in the same chat, and work an old copy wakes
// with $.session.send runs under that copy, whose hooks the engine no longer calls: every panel tool of that work answered "no
// tool.call hook answered". So a copy whose mark is no longer the one in charge stops its timers and does nothing more
// Marks order by when the load began, so a slow start of an older copy never takes charge back from a newer one
const thisLoad = `${String(Date.now()).padStart(15, '0')}-${Math.random().toString(36).slice(2)}`;
const loadNow = { plugin: 'claudopus', key: 'load' };
// A copy whose own mark could not be written never takes another's for its own replacement
let isMarked = false;
// Written only over the mark it read, so of two loads marking at once the newer one's stands
const takeCharge = async ($) => {
    for (let tries = 0; tries < 3; tries += 1) {
        const was = await $.state.get(loadNow).catch(() => undefined);
        if (typeof was?.value === 'string' && was.value > thisLoad)
            return void (isMarked = true);
        const r = await $.state.set(loadNow, thisLoad, was ? { ifVersion: was.version } : undefined).catch(err => (log($, `load not marked: ${String(err)}`), undefined));
        if (!r)
            return void (isMarked = false);
        if (r.isSet)
            return void (isMarked = true);
    }
    isMarked = false;
};
let isLeft = false;
const isReplaced = async ($) => {
    if (isLeft)
        return true;
    if (!isMarked)
        return false;
    const now = (await $.state.get(loadNow).catch(() => undefined))?.value;
    if (typeof now === 'string' && now > thisLoad)
        isLeft = true;
    return isLeft;
};
// A timer of this load: it stops for good the first time it fires after a newer load took charge
const everyLoad = ($, ms, fn) => {
    const timer = $.clock.every(ms, () => void isReplaced($).then(left => (left ? timer.cancel() : fn())));
    return timer;
};
// and one that fires once, unless a newer load took charge before it does
const afterLoad = ($, ms, fn) => $.clock.after(ms, () => void isReplaced($).then(left => (left ? undefined : fn())));
// The chat of the card that is open, as last read: read again only when that work has moved
// Counts presses in the open card; the card's buttons carry it in their keys. On the desktop app the button last pressed holds the
// focus and is kept in view: every redraw (a new line of the work, the person's own scrolling) pulled the view back to it, most often to
// the bottom of the chat. With a new key after each press the app finds no such button, and the view stays where the person put it
let presses = 0;
// An ask's answer buttons keep one key for as long as the ask stands, never the count of presses: a surface that draws late, as a
// phone over the remote connection, still shows the keys of the last drawing, and a press on a key the panel no longer holds ran
// nothing (14 Nov: "Release it" pressed on one card right after another card's went nowhere). Their buttons go with the ask, so none
// is left holding the focus. The admin command's Allow and Deny keep theirs the same way. A new load gives them new keys, as presses
// does for the rest
let loadMark = 0;
// Each work's chat as its Details tab last read it, by the work
const talks = new Map();
// What each Details tab has unfolded, by the work: runs of tool steps and long messages by number, and the parts named by OPEN_ASK and the rest
const folds = new Map();
// The memory folder, ~/.claude/claudopus; set when the session starts
let dir = '';
// The person's last message, for the pass that runs after the reply
let said = '';
// Each message of the person's in the chat's turn under way: only a message that carries one of them is their steer
let heard = [];
// config.json can switch the handing-over off: every chat then does its own work again
let isOff = false;
// config.json can name the person the mod works for; without a name the texts say "the person"
let person = '';
// config.json can say which model does which work; the chat's and the work's rules name them
let models = modelsOf({});
// config.json's choices of how work is handed out and how big it starts (Config's Tasks band)
let lean = leanOf({});
// The settings read again: at a session's start, and after a change in the Config tab
const loadSettings = async ($) => {
    // A change to the person's settings or texts made while no chat watched is put back before anything reads them
    if (dir)
        await personCheck($).catch(err => log($, `files not compared as the mod loads: ${String(err)}`));
    const config = await readConfig($, dir);
    isOff = config.agents === false;
    // Admin passwords an earlier version kept leave the keychain as the mod loads: none is kept any more
    void forgetKeptPasswords($).catch(() => undefined);
    person = typeof config.name === 'string' ? config.name.trim() : '';
    models = modelsOf(config);
    lean = leanOf(config);
    macs = (Array.isArray(config.macs) ? (config.macs) : []).filter(isMac).slice(0, 4);
    return config;
};
const who = (isStart = false) => person || (isStart ? 'The person' : 'the person');
// A text of the mod's with {name} or {Name} where the person is named
const named = (text) => text.replace(/\{name\}/g, who()).replace(/\{Name\}/g, who(true));
// When the servers were last looked up
let scannedAt = 0;
// The Agent calls made inside a piece of work, by call id: what such a call starts is that work's helper
const helperCalls = new Map();
const clip = (text, half) => text.length <= half * 2 ? text : `${text.slice(0, half)}\n[...]\n${text.slice(-half)}`;
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const oneLine = (text) => text.replace(/\s+/g, ' ').replaceAll(' | ', ' / ').trim();
const textOf = (r) => r.content.map(b => ('text' in b && typeof b.text === 'string' ? b.text : '')).join('');
// How long work has run, to the second: "42s", "12m 08s", "1h 04m 31s". In a chat the app runs on another Mac over ssh, to the
// minute: "<1m", "12m", "1h 04m", and tokens to 10k and context to 5%. There every drawing that changes anything gives each button a
// new handle and lets the old ones go, while the app shows a drawing some time after the engine made it: a click on what it shows
// named a handle already let go, and nothing ran (Claude Code: "no Button of claudopus is held under handle"). A drawing that
// changes nothing keeps its handles. With the panel's text moving each second, about every other click was lost so
const took = (ms) => {
    const all = Math.max(0, Math.floor(ms / 1000));
    const [hrs, m, sec] = [Math.floor(all / 3600), Math.floor(all / 60) % 60, all % 60];
    const two = (n) => String(n).padStart(2, '0');
    if (isRunFromAfar)
        return hrs ? `${hrs}h ${two(m)}m` : m ? `${m}m` : '<1m';
    return hrs ? `${hrs}h ${two(m)}m ${two(sec)}s` : m ? `${m}m ${two(sec)}s` : `${sec}s`;
};
// A count of tokens as the app writes it
const thousands = (tokens) => isRunFromAfar ? (tokens < 10000 ? '<10k' : `${Math.round(tokens / 10000) * 10}k`) : `${(tokens / 1000).toFixed(tokens < 100000 ? 1 : 0)}k`;
// How full a context window is: the share when the window is known, and the tokens
const fill = (tokens, window) => (window ? `${percent(tokens, window)}% · ${thousands(tokens)} of ${thousands(window)}` : thousands(tokens));
// The same for a piece of work, short enough for its status line
const percent = (tokens, window) => (isRunFromAfar ? Math.floor((tokens / window) * 20) * 5 : Math.round((tokens / window) * 100));
const share = (tokens, window) => (window ? `context ${percent(tokens, window)}% (${thousands(tokens)})` : `context ${thousands(tokens)}`);
// A model's name as the app writes it, from its id or alias: "Opus 5.5". Nothing for a name it cannot read
const modelName = (id) => {
    const m = /(fable|opus|sonnet|haiku)(?:-(\d+)(?:[-.](\d{1,2}))?(?!\d))?/.exec(id.toLowerCase());
    return m?.[1] ? `${m[1].charAt(0).toUpperCase()}${m[1].slice(1)}${m[2] ? ` ${m[2]}${m[3] ? `.${m[3]}` : ''}` : ''}` : '';
};
// The models the person can move running work to from its card, by the id each step is sent with, the newest of each family. Never
// Haiku. These are the least the mod knows: a newer id the engine starts work on or answers from takes its family's place (seeModel)
const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-fable-5-2'];
// The newest Haiku, for the settings that name Haiku for a kind of work, raised the same way
const HAIKU = ['claude-haiku-5-5'];
// A version as numbers; an id that leads with a date or an old numbering ("claude-3-5-sonnet-20241022") reads as none
const versionOf = (id) => {
    const [major = 0, minor = 0] = (modelName(id).split(' ')[1] ?? '').split('.').map(Number);
    return major && major <= 99 ? [major, minor] : undefined;
};
const isBelow = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
// The newest model of a family, by the id each step is sent with: Haiku's place is Sonnet's
const newestModel = (family) => MODELS.find(one => modelName(one).startsWith(family === 'Haiku' ? 'Sonnet' : family));
// A model the engine resolved or answered from: one newer than its family's newest takes its place, so what counts as older follows
// the newest the engine offers and never goes stale
const seeModel = (id) => {
    const family = modelName(id).split(' ')[0] ?? '';
    const version = versionOf(id);
    const list = family === 'Haiku' ? HAIKU : MODELS;
    const at = list.findIndex(one => modelName(one).startsWith(`${family} `));
    const top = at >= 0 ? versionOf(list[at]) : undefined;
    if (!version || !top || !isBelow(top, version))
        return;
    list[at] = `claude-${family.toLowerCase()}-${version[0]}${version[1] ? `-${version[1]}` : ''}`;
};
// The model a step or start is sent to in place of one no work runs on: an older version than its family's newest goes to that
// newest, and Haiku to the newest Sonnet. Nothing for a model work may run on: the newest or a newer version, a name with no
// version, which the app reads as the newest, and Haiku when the settings name it for a kind of work
const rightModel = (id) => {
    const [family = '', version = ''] = modelName(id).split(' ');
    if (!family)
        return undefined;
    const isHaikuNamed = family === 'Haiku' && Object.values(models).includes('haiku');
    if (family === 'Haiku' && !isHaikuNamed)
        return newestModel('Sonnet');
    if (!version)
        return undefined;
    const newest = isHaikuNamed ? HAIKU[0] : newestModel(family);
    const top = versionOf(newest ?? '');
    const mine = versionOf(id);
    const isOlder = !mine || (top !== undefined && isBelow(mine, top));
    return isOlder ? newest : undefined;
};
// How strong a model is, for a check never weaker than what it checks
const RANK = { Haiku: 0, Sonnet: 1, Opus: 2, Fable: 3 };
// `opusplan` runs on Sonnet outside plan mode, so it counts as Sonnet
const rankOf = (id) => (/opusplan/i.test(id) ? RANK.Sonnet : (RANK[modelName(id).split(' ')[0] ?? ''] ?? -1));
// A helper that looks over what was built, by its few words: a checking word, then what was built ("Review my PR", "Test the fix"),
// or a look that is only ever a check ("Sanity check", "What is wrong with the build"). Legwork that names checking something else
// ("Check the Stripe balance", "Review the docs", "Check the PR status") is not one
const CHECKS = /\b(second look|another look|look(s|ing)? (over|for)|(re-?|double[- ]?|spot[- ]?|sanity[- ]?)?check(s|ing|ed|er)?|(code )?review(s|ing|ed|er)?|audit(s|ing|or)?|verif(y|ies|ying|ication|ied)|validat(e|es|ing|ion)|critique|proofread|inspect(s|ing|ion)?|test(s|ing)?|qa|find|hunt(s|ing)?)\b.*\b(page|fix|fixes|fixed|change|changes|build|built|work|diff|pr|code|branch|commit|result|results|report|output|mod|app|feature|design|claims|draft|holes|bugs|faults|what was built)\b/i;
const ONLY_CHECKS = /\b(second look|sanity check|spot[- ]?check|what is wrong|is wrong with)\b|^(checker|reviewer|auditor|code review)\b/i;
const NOT_CHECKS = /\b(status|comments?|balance|quota|usage|logs?)\b/i;
const isChecker = (description) => ONLY_CHECKS.test(description) || (CHECKS.test(description) && !NOT_CHECKS.test(description));
// Work a safety check flagged whose next steps the app would send to an older model: it is ended with this report instead, so its
// parent starts what is left again on a current model. The steps of it answered so
const FLAGGED = (on) => `Stopped by Claudopus: a safety check flagged this agent's last message, and the app would have continued it on ${modelName(on) || on}, an older model Claudopus doesn't run tasks on, so nothing after the flag was done. Start what is left again on the current model, leaving out what was flagged.`;
const flaggedSteps = new Map();
// Work a safety check flagged once: its steps on an older model are never sent to a newer one, whatever it was started on
const flaggedOnce = new Set();
// The model an agent is started on in place of the one asked, or why it is not started; nothing when it may start as asked
const startModel = (e) => {
    const parentModel = String(e.parentModel ?? '');
    // A copy runs on its parent's model, which no hook changes
    if (e.fork)
        return rightModel(parentModel) ? { deny: WRONG_MODEL(parentModel) } : {};
    const asked = (e.model ?? '').trim();
    const parent = rightModel(parentModel) ?? parentModel;
    // An alias or `inherit` the engine resolves to the newest, or the parent's; an older id or Haiku goes to its family's newest
    let model = asked && asked !== 'inherit' ? (rightModel(asked) ?? '') : rightModel(parentModel) && (!asked || asked === 'inherit') ? parent : '';
    // A check of what was built never runs weaker than what started it, nor below Opus
    if (isChecker(e.description ?? '')) {
        const runs = model || (asked && asked !== 'inherit' ? asked : parent);
        const least = rankOf(parent) >= RANK.Opus ? parent : (newestModel('Opus') ?? 'opus');
        if (rankOf(runs) < rankOf(least))
            model = least;
    }
    return model ? { model } : {};
};
// The model each agent started on, as the engine resolved it: a step on Haiku of one that started there is its own kind's, not the app's move
const startedOn = new Map();
// The work and helpers whose steps the app sent to such a model, each said in the log once
const sentElsewhere = new Set();
// What a fork is answered when the model it would copy is such a model
const WRONG_MODEL = (named) => `Claudopus doesn't run tasks on ${modelName(named) || named}. Start a fresh agent and name the model by its alias: ${modelsShort(models)}. Never an older version${Object.values(models).includes('haiku') ? '' : ', never Haiku'}.`;
// The line written into a piece of work's own chat when the person moves it to another model; the panel draws it as a line of its own
const MODEL_HEAD = 'Model changed to ';
const MODEL_LINE = /^Model changed to (.+?) at (\d{1,2}:\d{2})\./;
const movedTo = (name, at) => {
    const d = new Date(at);
    return `${MODEL_HEAD}${name} at ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}. ${who(true)} chose it in the panel: your next steps run on ${name}.`;
};
const readOr = ($, path) => $.fs.read(path).catch(() => '').then(text => (listDrawing > 0 && isWatched(path, text) && !drawnFiles.has(path) && drawnFiles.set(path, text), text));
// While the panel is drawn, the files its drawing reads, as read then: looked at again each second, so a change in one draws it
// again (calmLook), as nothing else would
let listDrawing = 0;
// Another hook may read while the panel is drawn: what grows as work runs (transcripts, logs, other chats' live files, words, asks,
// keep files) and anything large is never watched, so it cannot draw the panel again each second
const isWatched = (path, text) => text.length < 64000 && !/\.jsonl$|\/log\.md$|\/live\/|\/words\/|\/asks\/|\/keep\/|\/helpers\//.test(path);
const drawnFiles = new Map();
// Every file the mod writes is in its memory folder, ~/.claude/claudopus, each call naming its folder and kind of file
// One line in ~/.claude/claudopus/log.md: each session's start, and anything that failed
// Added to its end, never read and written back whole: every chat on this Mac writes here, and two rewriting it at once left runs of
// empty bytes in it, which make grep take the log for binary and find nothing. Where the shell cannot add it, it is written whole
const log = async ($, line) => {
    const text = `${new Date().toISOString()} ${line.replace(/\s+/g, ' ').slice(0, 400)}\n`;
    const r = await $.process.run(['sh', '-c', 'printf %s "$2" >> "$1"', 'sh', `${dir}/log.md`, text]).catch(() => undefined);
    if (r?.exitCode !== 0)
        await $.fs.write(`${dir}/log.md`, `${await readOr($, `${dir}/log.md`)}${text}`).catch(() => undefined);
};
// The empty bytes earlier versions left in the log are taken out once, as a chat starts
const tidyLog = async ($) => {
    const text = await readOr($, `${dir}/log.md`);
    if (text.includes('\u0000'))
        await $.fs.write(`${dir}/log.md`, text.replaceAll('\u0000', '')).catch(() => undefined);
};
// A chat's saved words, words/<chat id>.md: the person's messages and Claude's answers, added to the end
const appendWords = async ($, chatId, text) => $.fs.write(`${dir}/words/${chatId}.md`, `${await readOr($, `${dir}/words/${chatId}.md`)}${text}`);
// A chat's asks and answers, asks/<chat id>.md, added to the end
const appendAsks = async ($, chatId, text) => $.fs.write(`${dir}/asks/${chatId}.md`, `${await readOr($, `${dir}/asks/${chatId}.md`)}${text}`);
// A colour with a see-through part, #RRGGBBAA, and how much of it shows (0 to 255)
const alphaOf = (color) => (typeof color === 'string' && /^#[0-9a-f]{8}$/i.test(color) ? parseInt(color.slice(7), 16) : 255);
// The terminal has no see-through colour: it paints the app's faint grey tint (FILL) as a solid mid-grey bar that buries dim text,
// darker than the text around it on a light theme. There a faint tint is left out with the padding that only framed it, and a
// stronger one (a picked segment, the edge's part still to do) becomes the theme's own subtle grey, which follows dark and light
const TERM_SOLID = 'subtle';
// The work's purple on a card's edge in the terminal. A terminal of 256 colours (over ssh, where COLORTERM is not sent) rounds a
// Box's colour to its palette, which makes #8A63F0 a lavender (141), while the octopus's cells take the nearest colour, a deep
// purple (99); there the edge is given a purple that rounds to 99 too. Set as the session starts
const DEEP_LIVE = '#6E3CFF';
let termLive = '';
const termBox = (Box) => (props) => {
    const alpha = alphaOf(props.backgroundColor);
    if (props.backgroundColor === LIVE)
        return Box({ ...props, backgroundColor: termLive || LIVE });
    if (alpha === 255)
        return Box(props);
    const { backgroundColor: _tint, paddingY, paddingTop, paddingBottom, ...rest } = props;
    const isFrame = alpha < 0x40;
    const framed = isFrame ? {} : { paddingY, paddingTop, paddingBottom };
    return Box({ ...rest, ...framed, ...(isFrame ? {} : { backgroundColor: TERM_SOLID }) });
};
// The element table a drawing uses: the surface's own, with the terminal's Box taking the app's tints as above and a mark
// (isTerminal) the views in other files read, which are handed the table alone
const uiOf = ($, e) => {
    const ui = $.ui.resolve(e);
    if (e.surface !== 'terminal')
        return ui;
    const marked = { ...ui, Box: termBox(ui.Box), isTerminal: true };
    return marked;
};
// One part of a report's view or of the list: a filled block with a bold heading and, at its right, a dim count
const band = (ui, key, name, side, body) => (<ui.Box key={key} flexDirection="column" gap={1} backgroundColor={FILL} paddingX={2} paddingY={1} flexShrink={0}>
    <ui.Box flexDirection="row" alignItems="flex-start" gap={2}>
      <ui.Box flexGrow={1} flexShrink={1} minWidth={0}>
        <ui.Text bold wrap="wrap">{name}</ui.Text>
      </ui.Box>
      {side ? (<ui.Box flexShrink={0}>
          <ui.Text dimColor>{side}</ui.Text>
        </ui.Box>) : null}
    </ui.Box>
    {body}
  </ui.Box>);
// ---- Which system this chat runs on ----
// Linux, as uname says once at the chat's start (chat.tsx), else a Mac: what only a Mac has (its keychain, Finder and Preview,
// Terminal, sips, its own notifications) takes Linux's own way there, or says plainly that it is not there. `hasDesktop` is a
// Linux desktop session the person sees (DISPLAY or WAYLAND_DISPLAY): without one, as in a terminal over SSH, nothing opens a window
let isLinux = false;
let hasDesktop = true;
// Where bin/keyring keeps its files on Linux, ~/.local/share/claudopus/keyring (never under $XDG_DATA_HOME, which a caller sets),
// and where earlier versions kept them when XDG_DATA_HOME was set, guarded the same (the mod moves them home as it loads)
let keyringRoot = '';
let keyringOldRoot = '';
const knowSystem = async ($) => {
    const r = await $.process.run(['uname', '-s'], { timeoutMs: 5000 }).catch(() => undefined);
    isLinux = r?.exitCode === 0 && r.stdout.trim() === 'Linux';
    hasDesktop = !isLinux || Boolean((await $.env.get('DISPLAY')) || (await $.env.get('WAYLAND_DISPLAY')));
    const data = (await $.env.get('XDG_DATA_HOME')) ?? '';
    keyringRoot = `${(await $.env.get('HOME')) ?? ''}/.local/share/claudopus/keyring`;
    keyringOldRoot = data.startsWith('/') ? `${data}/claudopus/keyring` : '';
};
// How this computer is named in what the person reads
const thisMac = () => (isLinux ? 'this machine' : 'this Mac');
const keptWhere = () => (isLinux ? 'a file on this machine that only you can read' : "this Mac's keychain");
// A file, folder or link opened as the person's own system opens it: `open` on a Mac, xdg-open on a Linux desktop. Linux without
// a desktop has nothing to open it on, and says so as a failed run does
const openOn = async ($, target, isText = false) => {
    if (!isLinux)
        return $.process.run(isText ? ['open', '-t', target] : ['open', target]).catch(err => ({ exitCode: 1, stderr: String(err) }));
    if (!hasDesktop)
        return { exitCode: 1, stderr: 'no desktop on this machine to open it on' };
    return $.process.run(['xdg-open', target]).catch(err => ({ exitCode: 1, stderr: String(err) }));
};
// macOS's sips on a Mac; on Linux bin/sips, which answers the same calls with ImageMagick and fails, drawing no small copy, without it
const sips = ($) => (isLinux ? `${$.plugin.root}/bin/sips` : 'sips');
