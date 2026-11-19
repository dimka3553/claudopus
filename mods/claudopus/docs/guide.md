# Claudopus guide

Everything Claudopus does, in full. The short version is the [README](../README.md).

- [Updates](#updates)
- [What you see](#what-you-see)
- [Needs](#needs)
- [Settings](#settings)
- [Turn it off](#turn-it-off)
- [Memory](#memory)
- Privacy, and every file, hook and program: [What Claudopus does on your Mac](privacy.md)

## Updates

Claudopus never installs an update by itself. Claude Code leaves automatic updates off for any marketplace other than Anthropic's own, and Claudopus does too.

A check reads the version page on claudopus.ai (`https://www.claudopus.ai/version.json`) and nothing more. It runs every hour as shipped, or as often as Config's Look for new versions says (every 6 hours, once a day, once a week, or only when you press Check now). The page names the version, git's fingerprint of Claudopus's folder as released (`tree`), its size, and the first line of each recent version's changes.

When the page names a newer version, a small grey box in the panel's header says "Claudopus <version> is out". It also says how many versions that covers since yours, and gives a line on what's new. Then there are two steps, and you press each one. (A folder of the code has just one, Update.) The box shows how far along you are:

- **Download** fetches the release's tag from GitHub into Claude Code's own copy of the marketplace, under a ref of its own, with git's progress as it comes. For a folder of the code, it fetches into that folder's git instead. Nothing you run changes. Claudopus then checks what came down against the page it read at that moment. Claudopus's folder in the download must be the exact tree the release published, and its manifest must name that version. If not, Claudopus throws the download away and the box says so.
- **Install** reads the page again and checks the download once more. For an installed copy, it runs Claude Code's own two steps (`plugin marketplace update`, `plugin update`), but only while GitHub's newest version is still that release. Then it checks the copy those steps installed, file for file, against the fingerprint. If the copy isn't the release, Claudopus restores Claude Code's record to what it was. For a folder of the code, Install moves the folder's main forward to the download. It's a fast-forward only, and git refuses it before changing anything if your own changes would be lost. Uncommitted changes stay.
- There is no Reload button. The header says, beside the version, that the new one is ready and to type `/reload-plugins`. That switches the chat you type it in. New chats start on the new version.

**Not now** hides a version for a day. **Skip this version** hides it and every older one until a newer one comes out (`"skipVersion"` in `config.json`; Config shows it, with Show it again). If a step fails, the box says what failed and that the chat still runs what it ran before.

If a chat runs from a worktree of the code, from a branch other than main, or from a folder that isn't Claudopus's checkout, Claudopus tells it that it gets a release only when main is merged into it. It offers no download.

Config's Updates section says which version the chat runs, where it loads from, and when the last check was. It has Check now, which only checks.

When a chat moves to a newer version, the octopus in the panel's header turns blue and jumps for five seconds. A short sound plays (once for each version on a Mac; the Config sound setting turns it off). The same small box then says "Updated to Claudopus <version>", with What's new (the changelog) and Close.

## What you see

- Claudopus is on in every chat you open from then on, in every folder.
- You send a message. The chat answers in one line and starts a background task for it, then is free for your next message. If a few files can answer your question, such as what a function does, the chat reads them itself in its own thread (Read, Grep, Glob) and starts no task. If a request changes a file, runs a command or needs more than a few reads, the chat starts a task for it.
- Each task uses its own tokens, so five tasks at once use tokens about five times as fast as one. On a subscription, that uses up your limits sooner. If you pay per token (an API key or other pay-per-use billing), it multiplies what you pay in that time.
- If your message is about a task that's already running, the chat sends it to that task instead of starting a new one.

### The panel and its cards

- The panel opens beside the chat by itself the first time a task starts in that chat.
- Each task is a card with a line saying how far it has got. Press its title to open its Details. The coloured edge shows its to-dos, one part each, brighter as they are done.
- When Claude starts helpers for a task, they hang inside its card as a tree joined by lines. Each helper is one slim row. The row shows a dot (purple while the helper works, green once it's done), its name, its model, its context and its time. Press a row to open that helper's own Details. Helpers that have ended fold into one row, and the task's Details lists every one.
- A task's helpers run in the background, like the chat's own tasks. Claude keeps going while they run. It waits for them only when it has nothing else to do. It waits with a command that comes back within about 20 seconds of a helper ending (or starting), or after two minutes. Claudopus holds Claude back from finishing while a helper still runs, with at most six tries so it can never get stuck. If you stop a task, its helpers stop too.
- While a task has helpers running, its card says how many, and when Claudopus last looked in on them. That line turns amber when a helper has shown nothing new for five minutes, and Claudopus tells Claude.
- After each step, Claudopus tells Claude when it could have sent its calls together. That happens when Claude started a helper alone, made three single lookups in a row, ran two long commands of one kind one after the other, took a step of only to-dos, or, when Config's Second check is set to check changes, made a commit with no second look started yet.
- Once the panel is open in one chat, it opens in every chat on this Mac, including chats that start later. If you close it in one chat, it closes in all of them, and new tasks don't bring it back until you type `/claudopus`.
- Right after you install, the panel opens once by itself with a welcome that offers to index your old chats.

### Other chats

- The panel lists the running tasks of every open chat on this Mac. Each chat's cards sit under that chat's name, with this chat first.
- Another chat's question shows here too, but without its buttons or box. You answer it only in its own chat. A file left for it could have been written by anything running as you, so Claudopus deletes such a file without reading it.
- Stop, the model choice and the full record stay in the chat that runs the task.
- A task that ends in another chat turns green there for a moment, then folds into Finished, as in its own chat.
- If a task leaves a chat's file open without saying how it ended (a chat on an older version), the task turns green for that moment too, then disappears.
- With `macs` set, every panel on each of your Macs lists the same chats from all of them. Each is marked with the Mac it runs on.
- A chat is listed only while something is going on in it: a running task, a question or a prompt. Chats with nothing going on are not listed, however many are open, because the app's own list has them.
- Press a listed chat's name to open that chat in the Claude app, as its sidebar does. If this Mac's app holds the chat (one of this Mac's, or one it runs on another Mac over SSH), it opens by the app's own link. Any other chat opens by its Remote Control link when Remote Control is on in it. A chat of another Mac's own app with Remote Control off opens only there.
- If your Mac's app runs the chat on another Mac over SSH, a press on its name is left for your Mac. Your Mac then opens that chat on your screen within about two seconds.
- Beside the name, the header shows the version this chat loaded (dim). For the few seconds before the chat reloads, it also shows the newer version your Mac has already installed (read from Claude Code's own record). That way you can tell chats on two Macs with different versions apart at a glance.
- The header's line counts every chat the panel lists, so it says what the cards under it say. First it shows what needs you (in amber, and the octopus turns amber too, though it's happy for the moment any task finishes). Then it shows what runs here and in other chats, then "Just finished" for a moment, and otherwise "Nothing is running".

### When a task needs you

- When Claude needs you, the task's card turns amber and rises to the top with what to do. Right under that, it says what the question is about (what a release changes, what a choice costs). Details shows all of it, and the small card shows up to about a screen.
- That way a question never points at an explanation still on its way in Claude's report. If Claude asks "as explained in the chat" without that explanation, Claudopus refuses the question and tells Claude to ask again with it. If Claude asks for a go-ahead with nothing under it, Claudopus says so back to Claude.
- Claudopus cuts a question longer than 300 letters at a word, and shows the whole of it under the question.
- Above the prompt, a question that has more says the rest is in the chat and on its card.
- Next comes any text to paste, beside a Copy button. Claude asks you to type only a command it can't run itself, and gives it whole, with its folder. On the Mac you sit at, the card also has Open in Terminal. It opens Terminal with the command typed at the prompt, in its folder. It never runs the command, and only opens when you press it. In a chat on another Mac there's no such button. You type the command in your own session to that Mac.
- You answer with the buttons Claude gave, or with Answer in words. No button is added to Claude's own, and every button is an answer that carries the task on. To leave a question open, press nothing.
- In the desktop app, Answer in words opens one box in the bar above the chat's prompt, named after the task it goes to, with Send and Close. A key, a password, a change to a finished task and continuing from a result are typed in that same box. Nothing is typed on the card, because the app keeps moving the panel back to a box that holds the cursor.
- Close takes the box away and saves what you typed for the next time you open it. If the same task asks a new question, the box stays open with what you typed.
- If the bar is folded, one of the app's surveys is in it, or the chat runs in a terminal, the block on the card has its own field instead.
- Any answer takes the block away at once, and one grey line on the card says what you pressed or answered. Claude continues from your answer at its next step. The card turns amber again only if Claude asks again.
- A question stays until you answer it, even after the task that asked it has finished. Then your answer starts that task again.
- The chat that started the task also shows the question, as a notice from Claudopus. The notice says what the question is about, lists its answers, and gives the paths of any pictures it is about. The chat shows the pictures in its next reply. The notice is never a message in your place. If you answer there in your own words, the chat passes it to Claude, and that counts as an answer on the card. An answer you press on the card is noted in the chat too.
- A question also raises a notification with the amber octopus, from a second small app of Claudopus's, Claudopus Asks. A short "needs you" sound plays with it (two quick notes, then a higher one). The sound is part of the notification, so macOS plays it as you set Claudopus Asks in System Settings, Notifications. It stays silent under a Focus that holds notifications back.
- You hear one question once. Questions that arrive within five seconds of each other on one Mac are heard as one.
- The first question makes macOS ask you once to allow Claudopus Asks. Claudopus's own chime plays while macOS asks.

### Claude Code's own prompts

- Sometimes a chat stops on the app's own prompt: allow a command or a tool, answer its question, or approve its plan. The panel in every chat then shows it in amber at the top, under that chat's name. It uses plain words and never a tool's own name.
- The card says which task is asking (or that the chat itself is), what it asks, and exactly what (the command, the message and the task it goes to, or the page). It also says what a yes and a no each do, and where to answer.
- Once you answer, the card is no longer amber. For a minute after the call ends, the card says what you did and what is happening now (allowed and running, run and done, said no, or ended before you answered). Then it goes.
- Claudopus's own calls that carry out what you already chose (your reply passed on to Claude, a Stop you pressed) never ask you again.
- If a prompt is still open when the app itself says it's waiting, a few seconds later, Claudopus raises a notification, as it does for a question from Claude.
- Wherever a press on a chat's name opens that chat, Open that chat takes you there to answer the prompt. You answer a prompt only in its own chat, and no panel or file answers it for you.
- Panels on your other Macs show which chat is waiting and on what, without the full command.

### The bar above the prompt

- While tasks run, a bar above the prompt shows memory in use, how busy the processor and graphics processor are, the battery and its time left, and the disk and network speed. Claude's own share is in purple. Memory turns amber past nine tenths, and the battery turns amber at a fifth when it's on its own power.
- In the desktop app, rest the pointer on a figure to see its card.
- When the panel is scrolled down, the bar says what's waiting or what just finished at the top. Press it to scroll the panel back up.

### When a task is done

- When a task finishes, its card turns blue with the happy octopus for a moment. Then the chat passes on its result. The card stays where it is, saying `◐ Delivered` and the task's last note, with anything its result leaves open listed under it, until you press Mark as done: it turns green where it stands, with the happy octopus and the chime, and two seconds after it first shows green goes under Finished. Its buttons go the moment you press, and through those two seconds it keeps its shape, so a second click lands on nothing. Delivered cards stand above the ones still working, the newest on top, and under anything that waits for you. To change or continue what it made, or to answer what it asks, say so in the chat or press Reply (Give feedback when it asks nothing): one message answers everything, and the same task carries on, on the same card. A working card has Message too, so you can write to a task at any time. The same box sits at the bottom of a task's Details. **Send** reaches the task at its next step; **Stop and send**, while it works, stops what it is doing, with its commands and helpers, and starts it again with your message. **Attach** opens the file picker: pictures, videos and any file go with the message by their paths, and the task opens each one (stills from a video). A file dropped on the desktop panel goes to the chat's own box instead, as the app takes every dropped file there; in a terminal, a file dropped into the box types its path, which goes as a file too.
- A task can't finish while a command it started still runs, except a server it leaves for you: that keeps its row under the Delivered card, with Stop.
- If a task ends while Claudopus reloads, it gets its green moment once the panel draws again.
- What a task left for you to read is listed under Results.
- A finish plays a short quiet chime. A notification, with the purple octopus, names the task and the first words of its result, so you hear and see it when you're elsewhere. It comes from Claudopus with its octopus icon. Click it to open that chat in the Claude app (in a terminal, it brings the terminal forward). The first one makes macOS ask you once to allow Claudopus notifications.

### The pages

- Stats, beside Results, adds up what the tasks came to, for this chat or for every chat with saved tasks, today or all time. It shows:
  - tokens by model, tasks finished, and to-dos done;
  - your messages and, on average, how long the chat took over one, from when it took the message up to its last response or tool result before the next message (its own turn, without the background tasks it started);
  - the time saved by running tasks side by side, and a timeline;
  - what the tokens would cost at API prices, and what the memory holds.
- Memory, at the top of the panel, opens Finder at the folder where Claudopus saves what it remembers.
- About, beside Memory, waves hello once. It says what Claudopus is and shows its version and Claude Code's, the website, the licence and the GitHub repo.
- `/servers` shows the local servers running on your machine and which chat started each.

### Admin passwords and commands

- Claudopus never saves an admin password. Each admin command asks for it.
- On this Mac, from a chat at its screen, macOS asks in its own box, which names the command, and runs it. The password goes to macOS alone.
- Over SSH on another Mac, on Linux, or in a chat you reach from another device, a box at the top of the panel of the chat that asked asks for it. The box appears only while that chat's own `bin/admin` is waiting for it. It never answers another chat's request, a request dated ahead, or a request without the key that run made.
- What you type in that box shows as you type it. The panel locks it to a key that one run of `bin/admin` made and holds only in its memory. Claudopus uses it for that one command and drops it. It is never put in a chat, a command line, a file or a log.
- Claudopus removes a password an earlier version saved as it loads.
- Each command still waits for your Allow first, as the next points say.
- The chat that asked shows a notice naming only what's needed, and brings the panel up. Don't allow ends the wait, and Claude waits up to about 10 minutes for you.
- Only a command with no chat open on this Mac to draw a panel (a `claude -p` command) asks in a macOS dialog on this Mac's screen instead. Over SSH it says that no panel is open.
- Before an admin command runs, the task's card asks you. It shows the exact command and the Mac, with Allow, Don't allow and Always allow this command. Only your press allows it, in the panel of the chat the task runs in. Nothing typed in a chat does, and other chats' panels show it without buttons.
- Don't allow tells Claude you refused the command. Always allow saves that exact command for that Mac in `~/.claude/claudopus/admin-allowed.json`, and Config lists them, each with Remove.
- Config's "Ask before an admin command" (`admin`) chooses when you're asked. The options are: each time, as shipped; once for a task and its helpers, until it ends; or never, which is how it was before this setting existed.
- The hook holds the command, and the admin tool itself runs nothing you didn't allow. So a script, another spelling of its path, or a command the shell builds is refused too.
- What runs as root has the system's own `PATH`, never the one the caller set, so a program planted earlier on that path isn't the one run.
- What you allowed, the always-allowed list, and a "work" or "never" setting each count only with a seal your press made. The seal uses a key in this Mac's keychain. An entry or setting written into those files by anything else allows nothing. Removing one makes a new key, so an old seal put back counts for nothing.
- Claudopus refuses commands from Claude that name the list, the grants or that key. That catches mistakes, but it doesn't catch every way around it.
- A process that reads the keychain can make a seal, so a seal protects only the card's press. Nothing runs as admin until you type the password for that very command, and there's no saved password for such a process to read.

### Keys, tokens and passwords

- When Claude needs a key, token or password, a box at the top of the panel of the chat that asked asks you once for it by name, while its `bin/secret` is waiting. The key stays in this Mac's keychain. Claude uses it as an environment variable, and the value is hidden where a command prints it by accident.
- A command that changes the value before printing it isn't stopped. The hook that refuses keychain reads catches the usual commands, not every way around it.
- The words in a password or key box are the panel's own, made from what the request names: a Mac's admin password or a key, the Mac or the key's name, and why it asks again. Any other text in a request is shown nowhere, and Claudopus doesn't draw a request it can't word. So if Claude plants a request, it shows only what the runners themselves would ask.
- Claudopus refuses commands from Claude that write into `~/.claude/claudopus/boxes` or read the boxes' keychain entries (`claudopus-box`). That covers commands typed, redirected, run in a script, or written in another language's code, and files written there. Only `bin/admin` and `bin/secret` use them.
- The field shows what you type because the app's text field, in the desktop app and the terminal, has no hidden mode.
- These boxes catch mistakes and common tricks, but they can't stop code set on getting around them.

### Releases

- Claude changes a repo only in its own git worktree, on a branch of its own. It never pushes or merges to main itself. Claude Code refuses it (`git push` naming main or master, `gh pr merge`), and the repo's `pre-push` hook refuses a plain push of main from inside Claude Code.
- The one way is `bin/release`, run from the task's worktree. When the task is built and checked, Claude asks you whether to release it, with a Release it button. That one press answers Claude and allows the release, which Claude then runs itself: you never type it, and no second box asks. A release you did not press for is still asked on the card, with Allow and Don't allow.
- Claudopus then holds that call on the task's card until you press Release there. `bin/release` releases nothing without that press, which counts once, for that worktree and branch, within two minutes. It reads that press from your own home folder as your user records name it, whatever `HOME` a command sets.
- These are guards on the way Claudopus releases, not a wall. Claude runs as you, with your git and GitHub sign-in, so a program set on it could push main by itself, as you could. What stops that is the repository's own rules on GitHub (a ruleset on main that only a pull request, or a sign-in Claude doesn't hold, can pass).
- A release you run yourself in a terminal outside Claude Code asks you there instead.
- On one Mac, one release per repo runs at a time, and the rest wait their turn (`release --status` says who is releasing). Across Macs, a release whose push git refuses takes main again.
- `bin/release` merges the task's branch onto main as it is now, and numbers the version from main. It makes the build's files again rather than merging them, refuses files the build left that the repo doesn't track, runs the repo's checks, then pushes main and the version's tag.
- If main and the branch changed the same lines, it pushes nothing and names what landed on main, so Claude can merge it and run the release again.
- If the remote refuses a push for another reason, such as a main that takes only pull requests, it says why and pushes nothing.
- A repo says how in a `.release` file:
  - `NAME`;
  - `VERSION_FILE` (a JSON file with `"version"`, or one holding only the number: main's number plus one, with the rest of the file merged like any file);
  - `DERIVED` (files the build makes);
  - `BUILD`;
  - `CHECK`;
  - `AFTER` (runs once pushed);
  - `GITHUB_RELEASE` (a command that prints a version's release notes: with it, every version is also made a GitHub release marked latest, `gh` must be signed in before anything is pushed, and a release whose tag or GitHub release fails after the push exits 4 with the one command that finishes it);
  - `MAIN` (otherwise the remote's own default branch).
- Main's own `.release` is the one used. It's read in a shell of its own, as values only, so a branch can't drop its checks or run code of its own. `release.local` in the repo's git folder sets the same for one Mac.
- A repo without a `.release` releases with no version or checks. A repo with no main yet gets the branch as its first main.

### A chat run on another Mac over SSH

- When your Mac's Claude app runs a chat on another Mac over SSH, the app owns that chat's process there. A task and its commands last only while that process does.
- If the app ends the process (you quit the app or archive the chat, or a closed laptop comes back for a moment), a task that was working ends with it. Its card says `Failed · The app closed while it worked` and has **Start again**. Nothing starts it again by itself.
- So work that must outlive the app runs in the cloud, and the task watches for its end.
- `keep/` records which tasks were working, so the card can say why.

### In a terminal

- In the terminal, the panel opens one other tab beside it at a time (Results, a result, Stats, Memory, Config, About, the Changelog, a card's Details).
- The tab's first row is `x: Close`. Click it, or press `x` while the tab holds the keys, and the tab closes and the panel comes back. (`ctrl+x Tab` gives the keys to the panel's frame, and `Esc` gives them back to the chat.)
- Claude Code's own row of tab names above it switches between the panel and the tab by a click. Its `✕` at the frame's top right closes the tab shown.
- Clicks work in a terminal reached over SSH and inside tmux, as long as Claude Code runs full screen (`"tui": "fullscreen"`).
- In a narrow terminal (under 144 columns, as on a phone), the panel sits above the prompt. A tab a button opens is drawn there too, and closing it leaves the panel in place.

### Rules and models

Claudopus also adds a short set of working principles ([rules/CLAUDE.md](../rules/CLAUDE.md)) to every chat. They shape how Claude answers. They leave out what is one person's own call, such as when Claude may raise a concern or what counts as done. Add yours, or change any of them, in the Config tab, and your new chats carry your copy.

A chat keeps the rules it started with, and so does a task: the principles, the chat's rules and the models they name are fixed when the chat gets its first message, and a task's rules when it starts. A change you make in Config, or one an update brings, reaches new chats and new tasks. Claudopus keeps what each chat was told in `live/rules/` in its memory folder, and removes it once the chat has not been opened for a month.

The chat picks a model for each task it starts: Opus for most, Sonnet for requests it can state exactly and for long searching and reading, Fable only for heavy tasks. A check of finished work runs on Opus, or on Fable for work built on Fable, never on Sonnet. Your account needs access to the model it picks.

No task runs on an older model or on Haiku (unless you name Haiku in `models`). Claudopus refuses an agent started on one, whether the chat or a task starts it.

Sometimes the app itself moves a running task to an older model. It does that after its safeguards flag a message (its setting "Switch models when a message is flagged"). Those steps stay on the model the app chose, even for a task you moved to a model of your own. While that lasts, the task's card says which model the app moved it to. A helper's card says so once opened, and `log.md` has a line for each. A step sent to Haiku goes to Sonnet 5.5, or to the model you picked for that task.

A card's model is the one that really answered its last step. If that is still an older model, the card says Claudopus doesn't run tasks on it. The chat's own thread stays on the model you picked for it, and with `agents` off none of this applies.

## Needs

- Claude Code in the terminal or the desktop app. It's tested with 2.1.325, and older versions may not draw everything.
- It doesn't work on Windows under WSL (plugins don't load there) or where your organization's admins block mods. In `claude -p` print mode and cloud sessions there's no panel.
- On a Mac (12 or newer), the password and key boxes, the keychain, thumbnails and notifications use `osascript`, `security`, `sips`, `open` and two small apps of Claudopus's, `notifier/Claudopus.app` and `notifier/ClaudopusAsks.app`. Claudopus copies them to `~/Library/Application Support/Claudopus` on its first notification.
- If you turn Claudopus Asks off in System Settings, Notifications, what needs you comes as Claudopus, purple, with Claudopus's own chime instead of the notification's sound. If you turn Claudopus off there, macOS's plain notification is used instead, which can't show the icon or open the chat.
- Stats reads Claude's records with `jq`, which macOS 15 and later include.
- The two notification apps come built, so you need no Xcode. How to rebuild them and compare with what's committed is in [What Claudopus does on your Mac](privacy.md#files-that-will-be-held-for-a-reviewer-and-why-they-stay).
- Seen working in the macOS desktop app and in a terminal on Linux (Ubuntu 24.04). VS Code hasn't been tried yet.

## On Linux

Claude Code runs on Linux in a terminal (there is no Claude desktop app for Linux), and Claudopus installs there with the same lines as on a Mac. The panel, background tasks, results, memory, updates, admin commands and keys all work. Where a Mac has something of its own, Linux does this instead:

- **Passwords and keys.** Linux has no keychain a terminal program can use without a desktop signed in. So `bin/keyring` saves each one in a file of its own under `~/.local/share/claudopus/keyring`. The folders are readable only by you (700) and so are the files (600). The path is always there, whatever `XDG_DATA_HOME` says: Claudopus moves one saved there by an earlier version as it loads. As on a Mac, any program running as you can read them. Claudopus refuses commands from Claude that name `bin/keyring` or that folder, and refuses reading, searching or writing a file in it, or searching a folder of yours it's in. That catches mistakes and common tricks, but it isn't a wall. On both systems, it also refuses a command that only names the word, such as `pip install keyring`: run that yourself. The runners need perl with its JSON::PP and Digest::SHA, which Ubuntu, Debian and Fedora include with `perl`.
- **An admin password** is asked for in the panel's box each time, as a Mac does over SSH, since Linux has no box of its own like macOS's. Claudopus saves none. Admin commands use `sudo` as on a Mac.
- **A password or key with no panel open** (a `claude -p` command): a Mac asks in a box on its screen. Linux has none, so the runner says to open the panel with `/claudopus` and run it again.
- **Notifications** use the desktop's own (`notify-send`) when Claude Code runs in a desktop session. In a terminal with no desktop, as over SSH, there's no pop-up: you get the panel, its sound and the terminal's own notice.
- **Opening things.** Memory opens as a tab of the panel, as in any terminal. A picture or a settings file opens with `xdg-open` on a desktop. With none, a picture's row says where it is, or sends it to your device as it does over SSH from a Mac. A card's Open in Terminal button isn't there: copy the command instead.
- **Small copies of pictures** are made with ImageMagick (`sudo apt install imagemagick`, or your system's own) by `bin/sips`, which answers the calls Claudopus makes of macOS's `sips`. Without it, pictures are listed without their small copies.
- **Your other Macs** (`macs`) and the keeper of a chat the app runs over SSH work the same. This machine is named by `hostname`.
- **Not on Linux:** the two notification apps (`notifier/`), which are Mac apps, and anything that reads the desktop app's own folders and logs, which Linux doesn't have. Nothing is shown for them.

## Settings

The panel's Config tab lists everything you can set, shows what's in force, and puts each back to what shipped.

When you edit the principles, the chat's rules or the task rules, Claudopus makes your own copy at the same path under `~/.claude/claudopus` (`rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md`). Claudopus uses your copy when there is one, and an update never touches it.

When Claude writes one of these, `config.json`, or a repo's `release.local`, a card waits for your Allow first. Claudopus refuses a shell command from Claude that writes them. Claudopus saves what each one last held, as it or you set it, in `admin-known.json`. That file is locked with a key of its own beside the gate's (account `known`), which Claude never reads or writes.

If the files change any other way, by any path and at any time (a command, a program a command left running, or you in an editor), Claudopus never reads the change. Instead it reads the saved text. It puts the file back as Claudopus loads, as you send a message, as it reads one, and as each call starts and ends. It saves what the file held beside it as `<file>.<time>.put-back`, and shows the change on a card, on its task's card when a command of that task made it. Allow makes the change again. An edit of yours by hand takes effect once you press Allow there.

If a saved copy is missing or not locked right, where its key exists, it counts for nothing. Your own files move aside to `.put-back` copies and are offered on cards.

A program running as you that reads that key from the keychain and locks a copy of its own gets past this, as it could forge the gate's own seals (F-007). Claudopus also refuses anything that writes the files the panels share (`live/`) or the update's own files.

The settings are in `~/.claude/claudopus/config.json`. Every key is optional:

```json
{
  "name": "Sam",
  "agents": true,
  "sound": true,
  "notifications": true,
  "admin": "each",
  "models": { "work": "opus", "legwork": "sonnet", "heavy": "fable" },
  "macs": ["sam@other-mac.local"]
}
```

| Key | What it does |
| --- | --- |
| `name` | What the agents call you. Left out, they say "the person". |
| `agents` | `false` turns off background tasks; every chat then does its own work again. |
| `sound` | `false` silences the short chime played when a task is done, and the "needs you" sound of a notification that a task needs you. |
| `notifications` | `false` stops the notification that names a task when it's done, stopped or failed. |
| `admin` | When you're asked before an admin command runs: `each` time, once for a task (`work`) and its helpers until it ends, or `never`. `work` and `never` count only when chosen in Config, which seals them (`adminSealed`). Written by hand, every command still asks. |
| `models` | Which model runs most tasks, long searching and reading and helpers, and heavy tasks (`opus`, `sonnet`, `fable` or `haiku`). Checks of finished work run on the most-tasks or heavy-tasks model, never on the long-searching one. |
| `lean` | Which tasks run on Fable (`fable`: `heavy`, `all` or `named`) and when a second helper checks (`second`: `asked`, `beyond` or `every`). Only what you changed is kept. |
| `macs` | Up to four other Macs, as `user@host` or a `Host` of `~/.ssh/config`, that this Mac's panel lists the chats of. It uses your own SSH, which must log in without asking. Each Mac needs Claudopus of this version or newer. That Mac's panels list this Mac's chats in turn, with nothing to set there: each visit hands it this Mac's chats, without the commands and texts their tasks run or send. Their questions are answered in their own chats. Results are saved the same on both, about every two minutes: each Mac gets the results it lacks, with paths moved onto its own home, and what you did to a result (archived, brought back, answered) reaches the other. Nothing is deleted or overwritten. Saved chats stay on the Mac they ran on. |

`name`, `agents` and `macs` are read when a chat starts. `models`, `lean` and your own copies of the rules reach new chats and new tasks. `sound` and `notifications` are read each time a task ends or needs you.

## Turn it off

```
/plugin disable claudopus@claudopus
```

`/plugin enable claudopus@claudopus` turns it back on. `/plugin uninstall claudopus@claudopus` removes it. Your memory folder is left in place.

## Memory

Everything Claudopus saves is in `~/.claude/claudopus`, as plain files:

| Path | What it holds |
| --- | --- |
| `index.md` | The topics of your tasks, one line each |
| `streams/` | One set of instructions per topic |
| `words/` | Your messages, word for word, and Claude's answers, one file per chat. Messages a program, a schedule or Slack sent are saved too, marked. Chats Claudopus wasn't running in are saved 10 to 20 minutes after they go quiet, and the start of a chat it joined partway goes in `<chat>.before.md`. Keys and passwords are hidden here, in `work/`, `asks/` and `pastes/` |
| `work/` | For each chat, what its helpers were asked and reported, what connected tools such as SBOS returned, the pages it fetched and the documents it wrote, keys hidden. `recall` lists these after everything else |
| `caught/` | How far Claudopus has read each chat's record, and its log |
| `asks/` | What you asked in each chat and what was done, one file per chat |
| `reports/` | What finished tasks left for you, one dated folder each, with copies of the pictures it named and small thumbnails |
| `finished/` | The Finished list of each chat |
| `flows/` | Each workflow the panel follows |
| `pastes/` | A message over 12,000 characters, saved here while the chat gets its start, its end and this path |
| `stats/`, `thumbs/` | Sums Stats made of Claude Code's records, and small copies of pictures shown in the panel |
| `servers.json` | The servers `/servers` last saw |
| `config.json` | Your settings, written by the Config tab |
| `admin-allowed.json` | The admin commands you chose Always allow for, by Mac, each locked to that command. Config lists them |
| `admin-grants/` | What you just allowed, for the admin tool to take once. It's gone as the command starts or its call ends. One that a call sent to the background never took stops counting after two minutes and is cleared later |
| `welcome.json` | Whether the first-run welcome still shows |
| `panel.json` | Whether you last opened or closed the panel, which every chat follows |
| `live/` | Each open chat's running tasks and its Remote Control and app ids, rewritten at least every 20 seconds, for the other chats' panels and the panels of other Macs. With `macs`, it also holds what was last fetched from each of those Macs. On a Mac named by another, it holds the chats that Mac handed over (`live/pushed/`) and requests to open a chat waiting for it (`live/outbox/`). A chat removes its own file when it closes |
| `rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md` | Your own copies of the three texts, written only when you edit or save one in the Config tab. Reset moves your copy aside as `.old` |
| `update-seen.json`, `update-steps.json`, `update-later.json`, `reloads/` | The version the last check saw on claudopus.ai (a number only), where Download and Install stand (a version, a stage, a commit and a fingerprint, never a text to show), a version put off with Not now, and marks that tell a reloaded chat what it moved from and keep a chat run over SSH from being reloaded by an older copy |
| `keep/` | Which tasks were working in each chat (`<chat>.json`), so a card can say the app closed while it worked; and the beat `bin/revive` reads |
| `log.md` | Claudopus's own log |

Delete the folder to start over. Claudopus writes nowhere else: no build, start-up or settings file of Claude Code or your projects.
