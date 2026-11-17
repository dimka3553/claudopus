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
var BRIEF = 'Answer a question that a few reads settle here, with Read, Grep and Glob. For anything that changes a file, runs a command or takes more than a few reads: answer this message in one line and, in the same turn, start a fresh agent: Agent, subagent_type "claudopus:task", the model the rule names, and the task\'s instructions as the prompt, unless the chat\'s rules send it another way (a single command, a small job). Only a message that changes what a listed task is already doing (a change, an answer Claude is waiting for, a stop) goes to that task with SendMessage, in their words. A fault, a question or a new request gets its own agent, even when it is about the same code or card as a running task.';
var REFUSED = 'This chat\'s own thread only reads (Read, Grep, Glob), and runs only a single command its rules allow, if any; it changes no file. Start a fresh agent for this, with the task\'s instructions as the prompt: the Agent tool with subagent_type "claudopus:quick" for a clearly stated job, else "claudopus:task", and the model named.';
var NO_COPY = function () {
    return "Claudopus never starts a task as a copy of this chat. Start a fresh agent instead: subagent_type \"claudopus:quick\" for a clearly stated job, \"claudopus:task\" for the rest, the model named (".concat(modelsShort(models, lean), "), and the task's instructions as the prompt.");
};
// A command that would print a password or key the keychain keeps (on Linux, the files bin/keyring keeps). Work uses a kept key only through `bin/secret`, which reads it itself
// or that would point the runner at another store or another box
var KEYCHAIN_READ = /\bsecurity\s+(?:-\S+\s+)*(?:-i\b|find-(?:generic|internet)-password\b[^;&|]*\s-[a-zA-Z]*[wg][a-zA-Z]*\b|dump-keychain\b[^;&|]*\s-[a-zA-Z]*d[a-zA-Z]*\b|export\b)|\bCLAUDOPUS_(?:SECRET_(?:SERVICE|ASK)|ADMIN_SERVICE)\b|\bkeyring['"]?\s+get\b|claudopus\/keyring\b/;
var NO_READ = 'A saved key or password is never read or printed. Use it as an environment variable through the secret runner the task rules name; it hides the value in anything the command prints.';
// A push or merge to main or master by hand: git's own push naming main or master, a push that skips the repo's hooks, the release
// runner's own pass given by hand, or a pull request merged on GitHub. The command is read as the shell splits it, so words inside
// quotes, a commit message's, never count
var shellWords = function (command) {
    var parts = [[]];
    var word;
    var quote = '';
    var end = function () { return (word !== undefined && parts[parts.length - 1].push(word), (word = undefined)); };
    for (var i = 0; i < command.length; i++) {
        var c = command[i];
        if (quote) {
            if (c === quote)
                quote = '';
            else if (c === '\\' && quote === '"' && i + 1 < command.length && '$`"\\\n'.includes(command[i + 1]))
                word = (word !== null && word !== void 0 ? word : '') + command[++i];
            else
                word += c;
        }
        else if (c === "'" || c === '"')
            (quote = c), (word !== null && word !== void 0 ? word : (word = ''));
        else if (c === '\\' && i + 1 < command.length)
            word = (word !== null && word !== void 0 ? word : '') + command[++i];
        else if (/[;&|\n()`]/.test(c))
            end(), parts.push([]);
        else if (/\s/.test(c))
            end();
        else
            word = (word !== null && word !== void 0 ? word : '') + c;
    }
    end();
    return parts.filter(function (one) { return one.length; });
};
var pushesMain = function (command) {
    return shellWords(command).some(function (words) {
        var _a, _b, _c, _d;
        var i = 0;
        // What runs a command it is handed: env and its settings, command, sudo, nohup, time, exec, and a shell's -c
        for (;;) {
            while (i < words.length && /^\w+=/.test(words[i]))
                if (/^RELEASE_PUSH=/.test(words[i++]))
                    return true;
            var head = (_b = ((_a = words[i]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : '';
            if (['env', 'command', 'sudo', 'nohup', 'time', 'exec'].includes(head)) {
                i++;
                // a flag and, for those that take one, its value: env -u NAME, -C dir, -S text, -P path; sudo -u user and the like
                while (i < words.length && words[i].startsWith('-'))
                    i += (head === 'env' && /^-[uCSP]$/.test(words[i])) || (head === 'sudo' && /^-[ugCchpUrtD]$/.test(words[i])) ? 2 : 1;
                while (head === 'env' && i < words.length && /^\w+=/.test(words[i]))
                    if (/^RELEASE_PUSH=/.test(words[i++]))
                        return true;
            }
            else
                break;
        }
        var tool = ((_c = words[i]) !== null && _c !== void 0 ? _c : '').split('/').pop();
        if ((tool === 'bash' || tool === 'sh' || tool === 'zsh') && words[i + 1] === '-c')
            return pushesMain((_d = words[i + 2]) !== null && _d !== void 0 ? _d : '');
        if (tool === 'gh')
            return (words[i + 1] === 'pr' && words[i + 2] === 'merge') || (words[i + 1] === 'api' && words.slice(i + 2).some(function (one) { return /\/pulls\/\d+\/merge\b/.test(one); }));
        if (tool !== 'git')
            return false;
        i++;
        while (i < words.length && words[i].startsWith('-'))
            i += /^-[Cc]$/.test(words[i]) ? 2 : 1;
        if (words[i] !== 'push')
            return false;
        var args = words.slice(i + 1);
        if (args.includes('--no-verify'))
            return true;
        return args.filter(function (one) { return !one.startsWith('-') || one.startsWith('--repo='); }).map(function (one) { return one.replace(/^--repo=.*/, 'REMOTE'); }).slice(args.some(function (one) { return one.startsWith('--repo='); }) ? 0 : 1).some(function (one) { return /^\+?(?:[^:]*:)?(?:refs\/heads\/)?(?:main|master)$/.test(one); });
    });
};
// The boxes of the password and key runners are theirs alone: work never writes into their folder, ~/.claude/claudopus/boxes, nor
// reads their keychain service, claudopus-box. A command is read as the shell splits it, in small letters (this Mac's files take any),
// with each simple {a,b} tried each way, then as words split at any sign a path or a program joins words with; a word counts when it
// is the name itself or a pattern (*, ?, [...]) that matches it, and a lone * matches nothing, so a folder listed whole is not taken
// for the boxes. The folder is .claude (or the setting that moves it) followed by claudopus (a cd between them aside), then boxes; the
// service is claudopus-box with security (or a program's keychain library). A command that only reads and writes nothing (a search, a
// listing, git and gh, which a commit message naming the folder runs through) counts only for what it sends into a file with >.
// Setting the runners' own folder by hand counts too. This stops slips and common tricks: a name pieced together as the command runs,
// a link made to the folder, or a script run some other way gets past it, so it is no wall
var BOX_READERS = ['rg', 'grep', 'egrep', 'fgrep', 'ls', 'du', 'git', 'gh', 'wc', 'head', 'tail', 'less', 'file', 'stat', 'tree'];
var BOX_WRAPPERS = ['env', 'command', 'sudo', 'nohup', 'time', 'exec', 'nice', 'timeout', 'xargs', 'caffeinate'];
// Where a command's own words start, past settings and what runs a command it is handed
var commandAt = function (words) {
    var _a, _b;
    var i = 0;
    for (;;) {
        while (i < words.length && /^\w+=/.test(words[i]))
            i++;
        var head = (_b = ((_a = words[i]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : '';
        if (!BOX_WRAPPERS.includes(head))
            return i;
        i++;
        // its own flags and numbers (nice's -n 5, timeout's duration), and the value sudo's -u and the like take
        while (i < words.length && (words[i].startsWith('-') || /^\d[\d.]*[smhd]?$/.test(words[i])))
            i += head === 'sudo' && /^-[ugCchpUrt]$/.test(words[i]) ? 2 : 1;
    }
};
var BOX_WORDS = function (text) { return text.replace(/["'\\`]/g, '').split(/[^a-z0-9._*?[\]-]+/).filter(Boolean); };
var wordIs = function (word, name) {
    // A list's brackets around a word, as a program's code writes it, are not part of it
    var bare = word.replace(/^\[+(?=[^\]]*$)/, '').replace(/(?<=^[^[]*)\]+$/, '');
    if (word === name || bare === name)
        return true;
    if (!/[*?[]/.test(bare) || /^[*?]+$/.test(bare))
        return false;
    try {
        return new RegExp("^".concat(bare.replace(/[.+^${}()|\\-]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/\[!/g, '[^'), "$")).test(name);
    }
    catch (_a) {
        return false;
    }
};
var namesBoxes = function (text) {
    var words = BOX_WORDS(text);
    var has = function (name) { return words.some(function (word) { return wordIs(word, name); }); };
    var isFolder = words.some(function (word, i) {
        if (!wordIs(word, '.claude') && word !== 'claude_config_dir')
            return false;
        // claudopus within a few words after it (a cd, or a command started there, between them), then boxes
        var j = words.slice(i + 1, i + 6).findIndex(function (one) { return wordIs(one, 'claudopus'); });
        return j >= 0 && words.slice(i + 2 + j).some(function (one) { return wordIs(one, 'boxes'); });
    });
    return isFolder || (has('claudopus-box') && (has('security') || has('keyring') || has('ksecattrservice')));
};
var touchesBoxes = function (text) {
    if (/\bCLAUDOPUS_BOX(?:ES|_TAKEN)\b/.test(text))
        return true;
    var kept = shellWords(text.toLowerCase())
        .map(function (words) {
        var _a, _b;
        var part = words.join(' ');
        if (!BOX_READERS.includes((_b = ((_a = words[commandAt(words)]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : ''))
            return part;
        return part.includes('>') ? part.slice(part.indexOf('>')) : '';
    })
        .join('\n');
    return [0, 1, 2, 3].some(function (k) { return namesBoxes(k ? kept.replace(/\{([^{}]*,[^{}]*)\}/g, function (_, alts) { var _a; return (_a = alts.split(',')[k - 1]) !== null && _a !== void 0 ? _a : ''; }) : kept); });
};
// A file a command runs, against the folder it runs in (a cd in it moves that): the first word of each of its commands when it is a
// path, what a shell, source or another language's program is handed to run or reads on its stdin, and a file cat pipes into a
// shell. The system's own programs are not read
var RUNNERS = ['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish', 'source', '.', 'python', 'python3', 'node', 'bun', 'deno', 'perl', 'ruby', 'php', 'osascript', 'swift', 'tsx', 'ts-node'];
var filesRun = function (command, home, from) {
    var folder = from;
    var found = [];
    var parts = shellWords(command);
    parts.forEach(function (words, n) {
        var _a, _b, _c, _d, _e;
        var i = commandAt(words);
        var head = (_a = words[i]) !== null && _a !== void 0 ? _a : '';
        var name = (_b = head.split('/').pop()) !== null && _b !== void 0 ? _b : '';
        if ((name === 'cd' || name === 'pushd') && words[i + 1])
            return void (folder = pathOf(words[i + 1], home, folder));
        var take = function (path) { return found.push(pathOf(path, home, folder)); };
        if (RUNNERS.includes(name) || /^python3(?:\.\d+)?$/.test(name)) {
            var rest = words.slice(i + 1).filter(function (word) { return word !== 'run'; });
            var fed = rest.findIndex(function (word) { return word.startsWith('<'); });
            if (fed >= 0)
                take(rest[fed] === '<' ? ((_c = rest[fed + 1]) !== null && _c !== void 0 ? _c : '') : rest[fed].slice(1));
            var at = rest.findIndex(function (word) { return !word.startsWith('-') && !word.startsWith('<'); });
            // A program handed its code inline (-c, -e) is read as part of the command already
            if (at >= 0 && !rest.slice(0, at).some(function (flag) { return /^-[cem]$/.test(flag); }))
                take(rest[at]);
            // a shell's -c is a command of its own, whose files are looked for the same way
            if (['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish'].includes(name) && at >= 0 && rest[at - 1] === '-c')
                found.push.apply(found, filesRun(rest[at], home, folder));
            // Nothing to run named: what it reads is what the command before it gives, such as a file cat prints
            var before = (_d = parts[n - 1]) !== null && _d !== void 0 ? _d : [];
            if (at < 0 && fed < 0 && ((_e = before[commandAt(before)]) !== null && _e !== void 0 ? _e : '').split('/').pop() === 'cat')
                for (var _i = 0, _f = before.slice(commandAt(before) + 1); _i < _f.length; _i++) {
                    var one = _f[_i];
                    if (!one.startsWith('-'))
                        take(one);
                }
            return;
        }
        if (head.includes('/') && !/^\/(?:usr|bin|sbin|System|Library\/Apple)\//.test(head))
            take(head);
    });
    return found;
};
// A path as written, with ~ and $HOME read and . and .. taken out, against the folder given
var pathOf = function (path, home, folder) {
    var full = path.replace(/^(?:~|\$HOME|\$\{HOME\})(?=\/|$)/, home);
    var parts = [];
    for (var _i = 0, _a = (full.startsWith('/') ? full : "".concat(folder, "/").concat(full)).split('/'); _i < _a.length; _i++) {
        var part = _a[_i];
        if (part === '..')
            parts.pop();
        else if (part && part !== '.')
            parts.push(part);
    }
    return "/".concat(parts.join('/'));
};
// Files of the memory folder that only the mod writes: what chats share and answer one another through (live/), the update's lock
// and stamps, the reloads' marks; and the person's own settings and texts there (config.json, rules/, roles/), which work changes only
// with Edit or Write, so its card shows the change and waits for their press. A command is read as the boxes' guard reads it: a
// command that only reads counts only for what it sends into a file with >; this stops slips and common tricks, as that guard does
var MEMORY_READERS = __spreadArray(__spreadArray([], BOX_READERS, true), ['cat', 'jq', 'diff', 'cmp', 'shasum', 'sha256sum', 'md5', 'md5sum'], false);
var MEMORY_OWN = ['live', 'keys.md', 'keys.json', 'update.lock', 'update.json', 'update-folder.json', 'update-seen.json', 'reloads'];
var MEMORY_PERSON = ['config.json', 'rules', 'roles'];
var namesMemory = function (text, names) {
    var words = BOX_WORDS(text);
    return words.some(function (word, i) {
        if (!wordIs(word, '.claude') && word !== 'claude_config_dir')
            return false;
        var j = words.slice(i + 1, i + 6).findIndex(function (one) { return wordIs(one, 'claudopus'); });
        return j >= 0 && words.slice(i + 2 + j, i + 6 + j).some(function (one) { return names.some(function (name) { return wordIs(one, name); }); });
    });
};
var writesMemory = function (text, names) {
    var kept = shellWords(text.toLowerCase())
        .map(function (words) {
        var _a, _b;
        var part = words.join(' ');
        if (!MEMORY_READERS.includes((_b = ((_a = words[commandAt(words)]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : ''))
            return part;
        return part.includes('>') ? part.slice(part.indexOf('>')) : '';
    })
        .join('\n');
    return namesMemory(kept, names) || (names === MEMORY_PERSON && /\brelease\.local\b/.test(kept));
};
// A command that is only Python or Node handed code that reads (`python3 -c "print(json.load(open(p)))"`, `node -e`): nothing joined
// to it, nothing sent into a file, and in its code no open for writing and nothing that writes, moves, removes or runs anything. Read
// as plainly as the guard above, so a trick in the code still counts as a write; a command that changes a file anyway is undone as it ends
var CODE_WRITES = /write|append|dump(?!s)|rename|replace|remove|delete|unlink|\brm\w*\s*\(|\bcp\w*\s*\(|copy|move|mkd|makedirs|link|truncate|chmod|chown|utime|touch|system|popen|spawn|exec|eval|compile|subprocess|child_process|shutil|pathlib|fileutils|__import__|import\s*\(|importlib|getattr|setattr|globals|\bvm\b|\bFunction\s*\(|mmap|ctypes|\bpty\b|\bsocket|`/i;
var CODE_RUNNERS = { python: ['-c'], python3: ['-c'], node: ['-e', '-p', '--eval', '--print'] };
var codeOnlyReads = function (command) {
    var _a, _b, _c;
    if (/\n|\$\(|`/.test(command))
        return false;
    var parts = shellWords(command);
    if (parts.length !== 1)
        return false;
    var words = parts[0];
    var name = (_b = ((_a = words[0]) !== null && _a !== void 0 ? _a : '').split('/').pop()) !== null && _b !== void 0 ? _b : '';
    var flags = CODE_RUNNERS[/^python3\.\d+$/.test(name) ? 'python3' : name];
    // its code straight after the program: nothing set before it, no other flag (a module, an import hook, perl's -i) beside it
    if (!flags || !flags.includes((_c = words[1]) !== null && _c !== void 0 ? _c : '') || words.length < 3)
        return false;
    var code = words[2];
    // what follows the code is its arguments, never a file it is sent into
    if (words.slice(3).some(function (one) { return /[<>]/.test(one); }))
        return false;
    // (printing is not writing)
    if (CODE_WRITES.test(code.replace(/\bstd(?:out|err)\.write\b/g, '')))
        return false;
    // an open whose arguments name no mode that writes ('w', 'a', 'x', '+') and no flag of os.open's or Node's; an open whose
    // arguments cannot be read plainly counts as one that writes
    var opens = code.replace(/\bopen\w*\s*\(((?:[^()]|\([^()]*\))*)\)/gi, function (all, args) { return (/(['"])[rwabxtU+]*[wax+][rwabxtU+]*\1|\bO_|\bflags?\b/.test(args) ? all : ''); });
    return !/\bopen\w*\s*\(/i.test(opens);
};
var NO_MEMORY = "Only Claudopus writes the files chats share and answer one another through, and the update's own files: Claude never writes them with any tool.";
var NO_MEMORY_BASH = function () {
    return named("Claude changes {name}'s own settings and texts (config.json, the rules and roles in the memory folder, a repo's release.local) only with the Edit or Write tool, never with a command, so the change shows on the task's card and waits for {name} to press.");
};
var NO_BOXES = 'Only the password and key runners use their boxes: Claude never writes into their folder or reads their keychain entries. Ask for a password only through the admin runner, and for a key only through the secret runner the task rules name.';
var NO_PUSH = 'Claude never pushes or merges to main itself, so two tasks never release at once: commit on your own branch and run the release runner the task rules name, from your worktree.';
// How long the names of kept keys are trusted before they are asked again
var SECRETS_MS = 60000;
// The first line of what the mod adds to every brief: the work's own rules and where the chat's words are. The panel leaves it out
var workHead = function () { return "What follows is what Claudopus tells Claude in every task started from a chat for ".concat(person ? "".concat(person, ", the person") : 'the person', " you work for."); };
var PASTED = 'The middle of this message is in the file it names. Do not read that file into this chat: the agent that needs it reads it from that path.';
var KEEP = "Keep every request the user made and every decision, in the user's own words where short. Keep the state of each file and what is not committed. Drop tool output.";
var KEEP_AGENTS = 'Keep the name or id of each background agent, with its topic and how far it has got.';
// What every piece of background work is told as it starts: it keeps its own to-do in the panel true
var PANEL_RULE = '{Name} follows this task in a panel beside the chat, as a card with its to-dos. Keep the card up to date as you work: with the `todo` tool (mcp__claudopus__todo), list what you set out to do, mark the one you are on, tick what is done and drop what a change of direction left behind; with the `note` tool (mcp__claudopus__note), say in one short line how far you have got whenever that changes. A message from {name} changes the to-dos first. Write these for someone who does not read code: say what each step is for, speak to {name} as "you", and use no file names, commands or code. When a step needs {name}\'s own hands or go-ahead, say so right away with the `ask` tool (mcp__claudopus__ask). If a panel tool replies that no hook answered it, the panel did not get it: continue without it for notes and to-dos, but for a question, end your turn right away with a report whose first line is the question.';
// What every conversation of a chat the app runs on another Mac over ssh carries after the principles, the chat's, its work's and
// their helpers' alike: the person cannot see this Mac, so nothing waits on their hands here
var AFAR_RULE = "## This chat runs on another Mac\n\n- I work from my own device and can't see this Mac's screen. Anything that needs my hands, I do from my own device: a sign-in by device code, or a link that works when I open it on my device. Never a browser, window, dialog or keychain prompt on this Mac, and nothing I would need to see its screen for. Give me a command only I can run in full, with its folder and full paths, so I can run it as it is in my own SSH session to this Mac; never open a terminal on this Mac for it.";
// What the chat shows when its work asks the person something: the ask as the mod's own notice in the chat, with its answers and
// pictures, never a message in the person's place; its model reads the ask in a row of its own, with how to pass an answer on.
// An answer typed in the chat goes to the work as a press on the card does
var ASK_IN_CHAT = function (title, ask, answers) {
    var _a;
    return [
        "\"".concat(title, "\" has a question for you: ").concat(ask.text),
        // The chat's notice is plain text: Markdown's marks for bold would show as they are
        ask.details ? "What it is about:\n".concat(ask.details.replaceAll('**', '')) : '',
        "Answers: ".concat(answers.join(' · '), ", or reply in your own words, here or on its card."),
        ask.copy ? "".concat(ask.isCommand ? 'The command to type' : 'The text to paste', ": ").concat(ask.copy) : '',
        ((_a = ask.pictures) === null || _a === void 0 ? void 0 : _a.length) ? "Pictures: ".concat(ask.pictures.join(', ')) : '',
    ]
        .filter(Boolean)
        .join('\n');
};
var ASK_RELAY = function (id, title, ask, answers) { var _a, _b; return "In the background task \"".concat(title, "\", Claude asked {name} a question. {Name} sees it on the task's card and in this chat as a Claudopus notice, which you do not see: ").concat(ask.text, " (answers: ").concat(answers.join(' · ')).concat(ask.details ? "; what it is about, which {name} sees in full with it on the card and in the notice: ".concat(ask.details.length > DETAILS_IN_RELAY ? "".concat(cut(ask.details, DETAILS_IN_RELAY), " (the rest is on the card)") : ask.details) : '').concat(ask.copy ? "; ".concat(ask.isCommand ? 'the command to type' : 'the text to paste', ": ").concat(ask.copy) : '').concat(((_a = ask.pictures) === null || _a === void 0 ? void 0 : _a.length) ? "; pictures: ".concat(ask.pictures.join(', ')) : '', "). {Name} already has it: do not pass it on").concat(ask.details ? ' and do not repeat what it is about; at most say in one line that it is on the card' : '', ", do not answer it yourself, and do not start a task for it").concat(((_b = ask.pictures) === null || _b === void 0 ? void 0 : _b.length) ? ', but begin your next reply by showing its pictures in this chat with one SendUserFile call (status "normal", display "render"), where that tool is available' : '', ". When {name} answers it in this chat, send their words to that task with SendMessage to \"").concat(id, "\", in their words; its card then stops showing the question."); };
// What the chat is told when an ask it was sent is answered on the card, or the work no longer needs it. The person sees the
// notice (isYou) and the chat's model reads it with the person named
var ASK_ANSWERED = function (title, said, isYou) {
    if (isYou === void 0) { isYou = false; }
    return isYou ? "\u2713 You answered \"".concat(title, "\" on its card: ").concat(said, ". Claude has your answer.") : "\u2713 {Name} answered \"".concat(title, "\" on its card: ").concat(said, ". Claude already has the answer from the card, so it needs no second copy.");
};
// What the chat is told when it sends work an answer of the person's that reached it from the card a moment ago
var ANSWER_ALREADY_SENT = function (said) { return "Not sent: \"".concat(said, "\" is the answer {name} gave on that task's card. Claude already has it from there and has asked nothing since, so a second copy would only start it again. If {name} means those words for something new, send them with what they are for."); };
// How long an answer given on the card counts as the one the chat would send again
var ANSWER_ECHO = 60 * 60000;
// What the chat is told when the person replies on the card in words that do not settle the ask: it stays open
var ASK_REPLIED = function (title, said, isYou) {
    if (isYou === void 0) { isYou = false; }
    return isYou
        ? "\u2713 You replied to \"".concat(title, "\" on its card: ").concat(said, ". Claude is working on it now, and will ask again if it still needs you.")
        : "\u2713 {Name} replied to \"".concat(title, "\" on its card: ").concat(said, ". Claude is working on it now, and will ask again if it still needs {name}.");
};
// What the work is told with a reply that does not settle its ask: the ask stays open on its card until it clears or replaces it
var REPLY_HOLDS = "That reply does not settle your question by itself: act on it. Their card shows your question with their reply under it, and nothing more to press or type while you work on it. Once it is settled, clear it with the `ask` tool and empty `text`; if it still needs them after you have done what they said, ask it again, which brings back its answers.";
// What work that had ended is told when the person answers its ask on the card: the answer starts it again
var RESUMED_BY_ANSWER = "You had finished; this answer starts you again. Continue the task with it, then end with your report as before.";
// What the chat's model reads, and the person sees as a notice (isYou), when that work could not be started again with the answer
var ANSWER_FOR_CHAT = function (title, asked, said, isYou) {
    if (isYou === void 0) { isYou = false; }
    return isYou
        ? "You answered, on its card, the question Claude asked in \"".concat(title, "\" after it finished (").concat(asked, "): ").concat(said, ". Claudopus couldn't start that task again, so your answer goes with your next message here.")
        : "{Name} answered, on its card, the question Claude asked in \"".concat(title, "\" after it finished (").concat(asked, "): ").concat(said, ". Claudopus couldn't start that task again, so the answer waits here for {name}'s next message.");
};
var ANSWER_FOR_CHAT_RELAY = "With {name}'s next message here, continue that task with this answer, as you would with their own words, alongside whatever that message asks.";
var ASK_CLEARED = function (title) { return "Claude no longer needs an answer for \"".concat(title, "\"."); };
// What the work is told when the chat passes on the person's answer to its ask, typed in the chat
var ANSWERED_IN_CHAT = function (asked, words, isHeld, isWhole) {
    if (isHeld === void 0) { isHeld = false; }
    if (isWhole === void 0) { isWhole = true; }
    return "The message sent to you just now that carries {name}'s words \"".concat(words, "\" is {name}'s own reply, typed by them in the chat, to your question: \"").concat(asked, "\".").concat(isWhole ? '' : ' Only those words are theirs: the chat wrote anything else in that message, not {name}.', " ").concat(isHeld ? REPLY_HOLDS : 'Their card no longer shows the question.', " If it answers your question, take it as their answer and continue, and ask again if it leaves something open. If it asks for something else, decide whether it is more for this task, a new task to hand back with the `note` tool and its `task`, or a change in how you work, and say with the `note` tool what you did with it.");
};
// What the work is told as a steer reaches it: it stops, decides what the steer is, and says so. The mod writes it into the work's
// own chat: the call that sent the steer is left as it was made, since auto mode refuses a call a hook has changed
var STEER = function (words, isWhole) {
    if (isWhole === void 0) { isWhole = true; }
    return "".concat(theirsAre(words, isWhole), " Stop: take no other step until you have thought about it. Decide which of three it is. More for this task: add it to your to-do list. A new task of its own: do not do it; hand it back with the `note` tool, with its `task` set to the request in one line, and the chat starts it. A change in how you are working: change your to-dos to match. Then say with the `note` tool, in one plain line, what you did with their message, such as that you added it to your to-do list, and continue. Call it {name}'s message, by no other name.");
};
// Whose a message is that carries the person's words: the whole of it theirs only when it is their words and nothing more; else only
// the words quoted are theirs, and the rest is the chat's own, which carries none of their say
var theirsAre = function (words, isWhole) {
    return isWhole
        ? "The message sent to you just now that carries {name}'s words \"".concat(words, "\" is from {name}, in their own words, typed by them in the chat.")
        : "The message sent to you just now carries {name}'s words \"".concat(words, "\", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, and none of it is {name}'s.");
};
// What the work is told when it has gone on after a steer without saying what it decided
// What work that had ended is told of the person's words that started it again: whose they are, nothing more
var WOKE = function (words, isWhole) {
    if (isWhole === void 0) { isWhole = true; }
    return isWhole
        ? "The message that started you again, carrying {name}'s words \"".concat(words, "\", is from {name}, in their own words, typed by them in the chat.")
        : "The message that started you again carries {name}'s words \"".concat(words, "\", typed by them in the chat. Only those words are {name}'s: the chat wrote anything else in that message, not {name}.");
};
// What the work is told when a message under way is not the person's: who sent it, and that it is no steer of theirs
var FROM = function (sender, start) {
    return "The message sent to you just now that begins \"".concat(start, "\" is from ").concat(sender, ", not from {name}: that one is not theirs. Take it as ").concat(sender, "'s and continue; a message that carries {name}'s own words stays theirs.");
};
// The chat sends a steer in the person's words: a message carries them when it holds a stretch of what they wrote, word for word
var STRETCH = 40;
// Compared as whole words: letters and digits alone, any quote, apostrophe or dash the chat retyped left out
var wordsOnly = function (text) { return " ".concat(flat(text).toLowerCase().replace(/[’‘']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim(), " "); };
var carries = function (message, words) {
    var m = wordsOnly(message);
    var w = wordsOnly(words);
    if (!w.trim())
        return false;
    if (w.length <= STRETCH)
        return m.includes(w);
    var starts = __spreadArray([0], __spreadArray([], w, true).flatMap(function (c, i) { return (c === ' ' ? [i + 1] : []); }), true).filter(function (i) { return i + STRETCH <= w.length; });
    return starts.some(function (i) { return m.includes(w.slice(i, i + STRETCH)); });
};
// A message that is the person's words and nothing more, word for word: at most their name before them ("Sam: …", "Sam says …")
var isTheirsWhole = function (message, words) {
    var m = wordsOnly(message);
    var w = wordsOnly(words);
    if (!w.trim() || !m.includes(w))
        return false;
    var rest = m.replace(w, ' ').trim();
    var name = wordsOnly(who()).trim();
    return !rest || [name, "".concat(name, " says"), "".concat(name, " said"), "".concat(name, " wrote")].includes(rest);
};
var OWED = 'A message from {name} is waiting for your decision, and you have kept working. Stop now and decide: more for your to-do list, a new task to hand back with the `note` tool and its `task`, or a change in how you work. Change your to-dos to match, then say with the `note` tool, in one plain line, what you did with their message.';
// What the work is told when it has taken many steps without touching its to-dos or saying where it stands
var drifted = function (steps) {
    return "You have taken ".concat(steps, " steps since you last touched your to-dos or said how far you have got. In your next step, send the to-do calls that bring the list up to date (tick what is done, mark the one you are on as doing, add what you took on) and a `note` saying how far you have got, together with your next working call in that same step, never in a step of their own. If all of it is already up to date, continue.");
};
// The chat is told once when nothing new has come back under a piece of work for a while
var STUCK_IN_CHAT = function (title, mins) {
    return "\"".concat(title, "\" hasn't made progress for ").concat(mins, " minutes: nothing new has come back to Claude or its helpers. It may be stuck waiting for something. Its card shows how far it has got.");
};
// A task that had stopped partway through a step without a report, restarted by Claudopus: what Claude is told, and what the chat is told
var RESTARTED_WORK = "From Claudopus, not {name}: you stopped partway through a step without a report (the app restarted, the Mac slept or a command was interrupted). First check what you already have, then continue from where you were; a command or helper you started may still be running, or may need starting again.";
var RESTARTED_IN_CHAT = function (title, mins) {
    return "\"".concat(title, "\" had stopped partway through a step ").concat(mins, " minutes ago without a report, so Claudopus restarted it. Its card shows how far it has got.");
};
// Work the person stopped with their own press on Stop: what the chat, or the work above a helper, is told, as the engine's notice
// of the stop says only that it was stopped "by Claude"; what a call that would start it again is refused with; what their next
// message carries while some is stopped so. `left` lists what it started detached that goes on running
var STOPPED_BY_YOU = function (title, id, left) {
    if (left === void 0) { left = []; }
    return "{Name} stopped \"".concat(title, "\" (").concat(id, ") with Stop on its card. {Name} stopped this, not you: do not restart it, message it or start the same task again unless {name} asks.").concat(left.length ? " Still running, because it was started detached: ".concat(left.join('; '), ".") : '', " Do not mention the stop unless {name} asks.");
};
var STOPPED_REFUSED = function (title) {
    return "Refused by Claudopus: {name} stopped \"".concat(title, "\" with Stop on its card. {Name} stopped this; do not restart it, message it or start the same task again unless {name} asks for that in a new message. Do not try another way.");
};
var STOPPED_EARLIER = function (titles) {
    return "{Name} stopped ".concat(titles.length === 1 ? 'this' : 'these', " earlier with Stop on ").concat(titles.length === 1 ? 'its card' : 'their cards', ": ").concat(titles.join('; '), ". Start ").concat(titles.length === 1 ? 'it' : 'one', " again, message it or start the same task afresh only if this message asks for that.");
};
// The work is reminded after this many steps past a steer with no decision, and after this many without touching its to-dos
var OWED_AFTER = 2;
var QUIET_STEPS = 12;
var ASKS_SYSTEM = "You log one exchange of a chat between a user and an AI coding assistant. The user dictates, so messages ramble. Reply in plain lines and nothing else.\nFirst, one line per distinct thing the user asked for in this message, asides included. Each starts with \"- \", has at most 20 words, and uses the user's words where short. A bare approval (yes, continue, push) is not a request: write no line for it. With no user message there are no such lines.\nThen, when the reply reports a result, a finding or a decision, one line \"did: <what was done or found, in at most 25 words, with the names and numbers that matter>\". A reply that only acknowledges gets no such line.\nLast, one line \"title: <title>\". Repeat the current title if it still names what the chat is working on. Otherwise write a new title of 3 to 6 words. A title names what is being done, never a model.";
