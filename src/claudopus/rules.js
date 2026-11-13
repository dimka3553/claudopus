// What chats and work are told: the brief rule, refusals, the work's panel rule, steers and reminders
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Work always starts as a fresh agent from a brief, never as a copy of the chat: it needs no more of the chat than the brief and
// the saved words, and a copy would carry the whole chat on the chat's own, dearest model
var BRIEF = 'Answer this message in one line and start a fresh agent for it in the same turn: Agent, subagent_type "general-purpose", the model the rule names, and a brief as the prompt (their words as they said them, what it is about in two or three lines, the folder, the subject by name with its brief and any result by path, what done looks like). Only a message that steers what listed work is already doing (a change to what it builds, an answer it waits for, a stop) goes to that work instead, with SendMessage, in their words. A fault, a question or a new ask gets its own agent even when it is about the same area, code or card as running work, so it never waits behind it; when in doubt, its own agent.';
var REFUSED = 'This chat\'s own thread does no work itself. Start a fresh agent for this: the Agent tool with subagent_type "general-purpose", the model named, and a brief as the prompt.';
var NO_COPY = function () {
    return "Work is never started as a copy of this chat. Start a fresh agent instead: subagent_type \"general-purpose\", the model named (".concat(modelsShort(models), "), and a brief as the prompt.");
};
// A command that would print a password or key the keychain keeps. Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
var KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_SECRET_(?:SERVICE|ASK)\b/;
var NO_READ = 'A kept key or password is never read or printed. Use it as an environment variable through the secret runner the work rules name; it hides the value from what the command prints.';
// How long the names of kept keys are trusted before they are asked again
var SECRETS_MS = 60000;
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
var workHead = function () { return "What follows is told to every piece of work started from a chat for ".concat(person ? "".concat(person, ", the person") : 'the person', " you work for."); };
var PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.';
var KEEP = "Keep every ask the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output.";
var KEEP_AGENTS = 'Keep the name or id of each background agent with its subject and where it stands.';
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
var PANEL_RULE = '{Name} follows this work in a panel beside the chat, as a card with its to-dos. Keep it true as you work. With the `todo` tool (mcp__claudopus__todo), list each thing you set out to do, mark the one you are on as doing, tick it when it is done, and mark it dropped when the direction changes. With the `note` tool (mcp__claudopus__note), say in one short line where the work stands now, and say it again whenever that has changed. A message from {name} changes the to-dos first. These lines are shown to {name}, so speak to them as "you", in the first person, and write for someone who does not read code: the purpose, with no file names, commands or code. When a step needs {name}\'s own hands or go-ahead now (a code to paste, a box to fill, a key to press, an approval), say so at once with the `ask` tool (mcp__claudopus__ask): what to do in `text`, the exact text to copy in `copy`, buttons to answer with in `choices`, a command for {name} to type in `command` (the card opens a terminal for it on their press, so open none yourself); clear it with empty `text` once you have seen it done.';
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
var STEER = 'The message sent to you just now is from {name}, in their words, sent while you work. Stop: take no other step until you have thought about it. Decide which of three it is. More for this work: add it to your to-do list. A new task of its own: do not do it; hand it back with the `note` tool, its `task` set to the ask in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the `note` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and carry on. Call it {name}\'s message, by no other name.';
// What the work is told when it has gone on after a steer without saying what it decided
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
var FROM = function (sender) {
    return "The message sent to you just now is from ".concat(sender, ", not from {name}: it is not theirs. Take it as ").concat(sender, "'s and carry on.");
};
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
var STRETCH = 40;
var carries = function (message, words) {
    // Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
    var plain = function (text) { return " ".concat(flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim(), " "); };
    var m = plain(message);
    var w = plain(words);
    if (!w.trim())
        return false;
    if (w.length <= STRETCH)
        return m.includes(w);
    var starts = __spreadArray([0], __spreadArray([], w, true).flatMap(function (c, i) { return (c === ' ' ? [i + 1] : []); }), true).filter(function (i) { return i + STRETCH <= w.length; });
    return starts.some(function (i) { return m.includes(w.slice(i, i + STRETCH)); });
};
var OWED = 'A message from {name} is waiting for your decision, and you have gone on working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.';
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
var drifted = function (steps) {
    return "You have taken ".concat(steps, " steps since you last touched your to-dos or said where the work stands. Look at your to-do list now: tick what is done, mark the one you are on as doing, add what you took on, and say where the work stands with the `note` tool. If all of it is already true, carry on.");
};
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
var OWED_AFTER = 2;
var QUIET_STEPS = 12;
var ASKS_SYSTEM = "You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.\nFirst, one line per distinct thing the user asked for in this message, asides included. Each starts with \"- \", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not an ask: write no line for it. With no user message there are no such lines.\nThen, when the reply reports a result, a finding or a decision, one line \"did: <what was done or found, in at most 25 words, with the names and numbers that matter>\". A reply that only acknowledges gets no such line.\nLast, one line \"title: <title>\". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words.";
