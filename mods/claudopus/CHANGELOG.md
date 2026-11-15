# Changelog

What changed in each version of Claudopus, newest first.

## 0.2.121 · 15 November 2026
- Claudopus now remembers which keys, tokens and logins you have given, by name and where each is kept, never a value: Claudopus's keychain, keys you saved by hand in this Mac's keychain, SBOS, and the .env files in your subjects' folders. A Keys button beside Memory shows the list, and work reads it before asking.
- The list is made again from each store's own list of names whenever you open it, a key is given or forgotten, or work asks for one, so a key taken out of a store stops being listed.
- Work that asks for a key the list already has is stopped and told where it is and how to use it.

## 0.2.120 · 15 November 2026
- Under a card, only runs that are really running are listed: a watch the engine killed or timed out, and a wait or command that ended, leave the list at once, so no clock counts on for something that stopped.
- The closing row counts the runs that ended beside the helpers, such as "3 runs ended · 3 timed out", and Details lists each with how it ended in plain words: finished, failed with its exit code, killed, timed out or stopped by the work.
- A run past the time the work said it would take no longer shows that old figure as if it held: it shows a fresh expectation from the time left the run prints (or its percent), or else says plainly that it is past its expected time.
- Work is told to give a new expected time when its own estimate turns out wrong, and to stop its waits and watches once it no longer needs them.

## 0.2.119 · 15 November 2026
- While you type into an ask's reply box or a key box, the panel and Details hold still: other cards' lines, times and output wait until you stop, so the box no longer flickers, drops letters or throws the panel to its bottom; a card that starts, finishes or asks, and an admin command waiting, still show at once.
- With nobody typing, the panel is drawn again at once for anything new, but for running times and command output only every ten seconds, so a button under the pointer keeps its hover and takes the first click.
- A reply box is empty after you send from it, and stays empty when it comes back.
- What you typed into an ask's reply box stays in it through a reload of Claudopus, and does not turn up in the work's next ask.
- A key box is drawn without the letters typed in it, so a redraw can never put older letters over newer ones.

## 0.2.118 · 15 November 2026
- The battery above the prompt no longer shows a time to full beside 100%: while macOS calls it 100% and still tops it up, it says "finishing", and a battery macOS calls empty shows no time left beside 0%.

## 0.2.117 · 15 November 2026
- Everything that waits for your press is at the top of the panel, right under its header, the newest first: a work that waits on an admin command, a release, a change to your files or a put-back change comes up whole, with its amber box in its own card, beside the cards of work that asked you something; password and key boxes, the chat's own gates and Claude Code's own permission prompts, every chat's, are there too. All other work stays below in the order it began.
- Once you press Allow or Deny, the same card says what was allowed where the amber box was, outlined green (grey when refused), and the card goes back to its place when that note goes.
- Scrolled down a long panel, the line above the prompt says how many things wait at the top; pressing it takes the panel back there. Nothing else moves the panel.
- In the terminal, an ask or a password box that comes in while you type a reply no longer takes the keys from it.

## 0.2.116 · 15 November 2026
- A run's second line starts under its name, with the tree's line carried down beside it, in the app and in a terminal: the app had left out the line and started it at the card's edge
- A run shows how long is left, its own or worked out from its percent, and no longer when it last printed; work's scripts print their progress at least every 10 seconds

## 0.2.115 · 15 November 2026
- The line above the prompt now shows the battery: its charge, a bolt while charging or a plug on power, and the time left (or to full) as the system reports it; nothing while it is still estimating, and nothing at all on a computer without a battery.
- It also shows how busy the graphics processor is, beside the processor.
- In the desktop app, resting the pointer on a figure shows more of it in a line above: the programs using the most memory and processor, the graphics processor's memory, the network in and out, which disks and ports are counted, and the battery's state in full.

## 0.2.114 · 15 November 2026
- Work and helpers start only on the newest models: one asked to run on an older model or on Haiku starts on its family's newest instead of being refused, and so does a helper left to a parent on an older model, a workflow's agent, or an agent whose own kind names an older model.
- A helper that checks what was built runs on a model no weaker than the work that started it, and at least on Opus.
- When a safety check flags a message and the app would carry the work on on an older model (as it carried a second look on Opus 4.8), the work is ended there with a report saying so, and its card says "ended after a safety flag"; the work above it starts what is left again on the current model.
- What counts as the newest follows the newest model the engine starts work on, not a version written into the mod.

## 0.2.113 · 15 November 2026
- Asks for your press (a release, an admin command, a change to your settings, a change put back, a password or key, Claude Code's own permission asks) are outlined boxes that name the kind of ask at the top, so they are no longer taken for one more piece of work.
- What you pressed is now one quiet line with a tick or a cross, not a card, and it goes as soon as what it reports has finished, rather than staying a minute.
- A release names its branch and the repo, with the folder shortened to one line.
- A release whose output went to a log asked you twice, the first time for a branch called ">", which the release then refused: it now asks once, for its own branch.

## 0.2.112 · 15 November 2026
- Details lists every to-do in its order, done ones ticked, in place of the next three and a count.
- In Details, each helper at work shows the step it is on and where it says it is, and each running command shows the last lines of its output, under its row.
- Finished work's Details shows what it reported at its end near the top, as its Result.
- Work of another chat opens its Details with the same depth as this chat's own: its helpers, its commands and their last lines, and its chat, read from that chat on this Mac. A press beside the chat's name opens that chat.

## 0.2.111 · 15 November 2026
- Every run on a card is two lines: what it is and its time, then how it stands. A command held open shows its progress too, a watch its last event, and one that has printed nothing says "nothing printed in 9m" instead of "updated 9m ago".
- A run's second line shows how much of how much (in GB, or a count of what it counts), its percent, its speed and the time left when the run says them, never worked out by Claudopus. A run quiet for three minutes says "quiet for 4m" in amber.
- Work names every command in one form the card reads as it is: its kind first (Download, Upload, Wait for, Watch, Serve, Run), what it does, and how long it should take, such as "Download the CT scans (about 3 min)". The row shows that time beside its own, in amber once well past it. Work is told to run such commands in the background or detached and to print `progress:` lines, a wait each try.
- Without that form, a row is named by what it runs (python rc.py), never by the head of a shell line, and only a command that keeps what it fetches in a file is a download: a wait or check that reads pages with curl no longer reads "Download".
- Pressing a run's name opens a Terminal window with its output as it is, following it as it goes on.
- A card no longer says "1 helper running, looked in on just now": helpers at work are rows on its tree; only one gone quiet is said.

## 0.2.110 · 15 November 2026
- When a newer Claudopus is out, the panel now says so at the top with an Install button, and nothing is downloaded or installed until you press it; Install updates it and reloads the chat you pressed it in, and other open chats keep their version until you type `/reload-plugins` there. Config's Look for new versions turns off the hourly look.
- A release now waits for your press of Release on its work's card, and nothing is released without it (a release you run yourself in a terminal asks you there); a branch's own `.release` no longer runs anything.
- Work that writes your settings, the principles, the chat's rules or the work rules now waits for your Allow on its card; a shell command that writes them is refused.
- A prompt from the app is answered only in its own chat: other chats' panels and other Macs show it without Yes and No.
- A question from work is answered only in its own chat, too: other chats' panels and other Macs show it without its buttons and reply box, and an answer left in a file, or carried from another Mac, is put away unread.
- A password or key box shows only in the chat whose command asked for it, and only while that command waits.
- No admin password is kept any more, and Config's Admin password setting is gone: every admin command asks for it, in macOS's own box (which now names the command) on this Mac, or in the panel's box over SSH, on Linux and from another device, sealed there for that one command. Passwords an earlier version kept are removed.
- Admin commands run with the system's own PATH, never the one the caller set, and kept keys are hidden in what commands print.
- Work the app moves to an older model or to Haiku now stays there, and its card says so; only a helper whose own kind starts it on Haiku (as Explore does) runs on Sonnet.
- Your other Macs no longer get the commands and texts work runs or sends: the text an ask gives you to paste, a prompt's command, a running or background command, or what an admin, file or release press is for.
- A message passed on to work is marked as your own words only when the chat passes it on whole.
- Your settings, principles, chat's rules, work rules and always-allowed admin commands are kept as Claudopus or you last set them, in a sealed copy work cannot read or write: a change made any other way (a command, a program a command left running, or you in an editor) is never read, and is put back as the mod loads, as you send a message, when Claudopus reads the file and as each call starts and ends. A card shows what it wrote, where Allow makes it again, and what the file held is kept beside it as a `.put-back` copy whatever you press. An edit of yours by hand, Config's Edit in your editor included, takes effect once you press Allow on that card. If that sealed copy is ever missing or broken, your own settings and texts move aside to `.put-back` copies, the shipped ones are in force, and each is offered on a card.
- The update card shows only a version number from the version page, never other text.
- If the keychain cannot be used (locked, or refusing), the panel says so once, as changes made outside Claudopus to your settings and texts are then not put back.
- A report from another Mac shows only pictures inside its own folder; a file it names elsewhere on this Mac is never read or shown.
- The admin, secret, release and key runners find their files in your own home folder as your user records name it, whatever HOME a command sets; on Linux kept keys always stay in your home folder whatever XDG_DATA_HOME says, and ones an earlier version kept under XDG_DATA_HOME are moved there as Claudopus loads.
- The guide now says releases rely on your repository's own rules on GitHub as the wall: Claudopus's press guards its own way of releasing, and work running as you can still push main another way.

## 0.2.109 · 15 November 2026
- Work that reports with nothing of its own still running now finishes by itself, even when Claude Code still lists it as waiting: its card stops its clock and leaves the running cards, and a question it still asks stays on the card to answer
- A finished card no longer says it left something running in the background when nothing it started is still going
- An answer you give on a card reaches the work once: the chat no longer passes the same answer on a second time, which used to start finished work again

## 0.2.108 · 15 November 2026
- A tab left saying "Nothing to show yet" (Stats, About, a result or any other Claudopus tab) now fills in on its own a few seconds later: after it opens, when you bring it to the front, and after Claudopus updates or reloads.
- A tab that cannot be drawn says what went wrong instead of staying empty, and tries again.

## 0.2.107 · 15 November 2026
- A workflow's card is built like every other card now: its title opens Details, Stop sits at its right end, and its facts line names the model, the agents, which round it is on of how many, and the time.
- Under it are the bar the checker holds it to, and a row per round up to the cap, each led by its own squares: the round at work says who is at work beside moving dots, a checked round what its check found, and a round not run yet that it runs only if needed.
- Once it ends, its last line says how: passed in round 2 of 3, or not passed after 3 of 3 rounds.

## 0.2.106 · 15 November 2026
- The line above the prompt shows how Claude uses the computer while work runs, in place of one piece of work's step: memory in use, how busy the processor is, and the disk's and the network's speed. In the two small meters Claude's part (the app, its chats and everything they started) is purple and the rest grey; memory turns amber past 90%. The terminal shows the same line in words. It is looked at every 5 seconds, once for all open chats.

## 0.2.105 · 15 November 2026
- A card now names the step its work is on, as "Step 13 of 16", under its line of facts; with no step in hand it names the next one, dim
- Past 14 steps, a card's coloured edge still shows the step being done in its lighter shade, between what is done and what is left
- When every step is ticked while the work still runs, that row says "All N steps done", so the card keeps its height

## 0.2.104 · 15 November 2026
- A download or long run on a card now shows how much is done of how much (such as 460 MB of 1 GB, or 3 of 6 steps), its percent and its speed, read by itself from the progress curl, wget, rsync, az and azcopy, aws, pip, git, tqdm and the like print, beside when it last wrote or how long it has been quiet.
- Work is told to make its long scripts print a `progress:` line the card reads, and to run tools with their progress shown even when their output goes to a file.
- A run whose output cannot be found says "output not found" instead of showing only its time; a detached run is no longer followed by a wrong process or a log named by a shell variable, which had kept a long-ended download on its card for hours with nothing to show.

## 0.2.103 · 15 November 2026
- Pressing an answer on one card no longer stops the answer buttons of other cards from working: before, a press renamed every card's buttons, so a second press from a panel that redraws late, as on a phone over the remote connection, went nowhere and left that card amber with nothing woken. The admin command's Allow and Deny buttons are fixed the same way.
- A finished work's card no longer keeps a run counting for ever when the command it started printed a number that is no process, such as a web address's "000".

## 0.2.102 · 15 November 2026
- Automatic updates find Claude Code where its installer puts it, so a chat started without a login shell (as in tmux over ssh on Linux) updates too, instead of failing to find claude.

## 0.2.101 · 15 November 2026
- Claudopus works on Linux, in Claude Code in a terminal, installed with the same lines as on a Mac. Passwords and keys are kept there in files only you can read, as Linux has no keychain to use; notifications use the desktop's own where there is one; small copies of pictures are made with ImageMagick; what only a Mac can do (Let macOS ask, Open in Terminal, the notification apps) is not offered there and says so. The guide's On Linux says what differs.
- The tests run on Linux and on a Mac on every push.

## 0.2.100 · 14 November 2026
- The Claudopus page on GitHub names the newest version as its latest release again, with what changed in it; it had stopped at 0.2.51. Every release now posts itself there, and a release that cannot do so says it failed.

## 0.2.99 · 14 November 2026
- Every result in the Results list opens on a click again, and the buttons inside a result work too. When the list changed while it was open (a result arriving, a time moving), the app kept pressing buttons the list had already replaced, so nothing happened however often you clicked; now each button takes a new name whenever the list changes, and the app always presses the live one.

## 0.2.98 · 14 November 2026
- A job on a card's tree is never taken for a helper: its row starts with what it is (Command, Server, Download, Wait, Watch), and its mark is its own shape and colour; purple round dots are helpers only.
- Each job row says whether it moves: when its output last changed, "no new output for …" in amber when it has written nothing for ten minutes, and "paused" when its processes are stopped.
- A percent on a job row is its progress only: a score or coverage figure a command prints is no longer read as one.
- Alike jobs are one row with a count, such as "Wait ×6"; a command that only waits says what it waits for, and in amber when that has ended, is paused or has not changed for long.
- A background command that has ended leaves the card, whether the engine said so in its output or no process runs it any more.

## 0.2.97 · 14 November 2026
- A piece of work's Details shows what it and its helpers have running, the same job rows as its card, every one of them under the one that started it; a helper's own Details shows its own

## 0.2.96 · 14 November 2026
- The panel header's buttons keep a gap between rows when a narrow panel wraps them onto two lines.

## 0.2.95 · 14 November 2026
- What work has running (a server, a download, a long script) shows as a row on its card's tree, under whichever helper started it: what it is, a server's port, the latest line it wrote, a download's percent and how long it has run, read live from its output.
- A command started detached with nohup stays on its card until its process ends, even after the work finishes.
- A job that keeps writing counts as news, so a long server or download no longer makes its card say nothing new has come back.
- Work is told to make its long scripts print a line at each step, so its card shows how far they are.

## 0.2.94 · 14 November 2026
- Once you have answered an ask, by a button or in your own words, its card keeps no buttons, reply box or send: a reply in words turns it purple with the question and your reply under it while the work acts on it, in the panel, in other chats' panels, in Details and in the terminal's band
- When the work asks again, or ends with the ask still open, the ask comes back with its answers and an empty box, and the chat is shown it afresh

## 0.2.93 · 14 November 2026
- The app's prompts in the panel say in plain words which work asks, what exactly (the command, the message and the work it goes to, the page), and what a yes and a no each do; no tool's own name such as "Allow SendMessage"
- Once you answer one, the card says what you did and what is happening now (running, done, said no, or ended before you answered) for a minute, then goes, instead of staying or vanishing
- Claudopus no longer asks you to allow its own messages that pass your reply on to work, or a Stop you pressed; those prompts used to pile up in every chat's panel and never clear
- An admin command's card says what Allow and Deny each do, and after you press, or send or cancel a password or key box, the top of the panel says what you did and what happens now for a minute
- A prompt to allow something has Yes and No on its card, in this chat's panel and in other chats' panels: pressing one answers Claude Code's prompt for real, with nothing to type. Claude Code's own box still works too, and whichever you answer first counts
- A question or a plan from Claude Code has no Yes or No on its card, as Claude Code lets only its own box answer those: the card says where that box is

## 0.2.92 · 14 November 2026
- A card that asks you something now shows its pictures on the card itself, small, each with a row that opens it large, so you can decide there without waiting for the chat to send them. In the terminal each picture is a row that opens it on your device.

## 0.2.91 · 14 November 2026
- A chat your Claude app runs on another Mac over SSH keeps its work going when your Mac goes away: if the app ends the chat's process there while work runs, that Mac starts the chat again by itself within about a minute, under its own sign-in, and the cut-off work carries on. When the chat's process still runs there but the sign-in your app lent it has lapsed, Claudopus ends that process so the same happens at once.
- Work cut off that way says so on its card ("Cut off at 00:14 … going again since 00:15"), and one notice tells you, on your phone too where Claude Code's push notifications and Remote Control are on.
- Work starts long commands detached and follows their logs, so a training or a build goes on even when the chat's process ends.

## 0.2.90 · 14 November 2026
- A piece of work's helpers now run in the background, as the chat's own work does: the work carries on with its own steps while they run, and their results come to it as they end. Before, the work was frozen until each helper ended.
- Work waits for its helpers only when it has nothing else to do, with a command that comes back within about 20 seconds of one ending, or after two minutes with how each is doing. It is held back from finishing while one still runs (six tries at most), so a helper's result does not go to the chat instead, and stopping the work stops its helpers too.
- While a piece of work has helpers running, its card says how many and when they were last looked in on, and that line turns amber when one has shown nothing new for five minutes; the work is told, to check it, nudge it or replace it.
- After each step, work is told when it could have sent its calls together: a helper started alone, three single lookups in a row, two long runs of one kind one after the other, a step of only to-dos, or a commit with no second look started yet.
- The to-do reminder now asks for the to-do and note calls to go with the next work call, never in a step of their own.

## 0.2.89 · 14 November 2026
- A copy run from a folder of its code now updates itself: Check for updates and automatic updates bring that folder up to the newest release with git, and the box says so. Work in the folder that isn't committed is never touched; if the update would overwrite it, the box says why and nothing changes.

## 0.2.88 · 14 November 2026
- In a narrow terminal, as on a phone over ssh, a button in the panel that opens a tab (Results, Stats, Memory, Config, About, a card's Details, a result) now opens it where you can see it, instead of opening nothing or making the panel vanish.
- Every tab of the panel in the terminal starts with x: Close: click it, or press x once the tab has the keys (ctrl+x Tab), and the tab closes and the panel comes back.

## 0.2.87 · 13 November 2026
- Admin commands ask before they run: when work wants to run a command as administrator, its card shows the exact command and the Mac, with Allow once, Always allow this command and Deny. Only your press in the panel allows it; nothing typed in a chat does, and Deny tells the work you refused it.
- Config has a new part, Admin commands: ask each time (as shipped), once for a piece of work and its helpers until it ends, or never, as before. It lists the commands you always allow, each with Remove.
- The admin tool itself now refuses a command you did not allow, so a script or another route to it is refused too. A setting or a list entry that work wrote for itself allows nothing.
- New choice for the admin password: Let macOS ask, keep nothing. macOS asks for the password on this Mac's screen each time and none is kept; it works on this Mac only, and in a chat reached from another device admin commands are then refused. A kept password can be read by any process running as you, so only this choice is a wall.

## 0.2.86 · 13 November 2026
- An ask now carries what it is about right under its question, on the card and in the chat's notice: a "Release it?" shows what goes out with it, instead of pointing at an explanation that only arrived with the work's report after it. Above the prompt, such an ask says the rest is in the chat and on its card.
- Work that asks "as explained in the chat" without the explanation is refused and asks again with it.
- A question longer than 300 letters is cut at a word, with the whole of it shown underneath, instead of cut off mid-word.

## 0.2.85 · 13 November 2026
- A card whose work is acting on your reply to its ask turns purple, as work under way, from the moment you reply until it stops again; its ask and answers stay there to press, and it turns amber again only once the work stops with the ask still open.
- The header counts that card as at work rather than as waiting on you, and the line above the terminal prompt shows the ask in purple with the working octopus while it acts.
- In the terminal, work whose turn ends while a command it started in the background still runs stays at work, purple, instead of showing Finished or waiting on you; it finishes when it is actually done.

## 0.2.84 · 13 November 2026
- The chat answers a question that reading a few files answers, such as what a function does, by reading them itself, with no background work started. Anything that changes a file, runs a command or needs more than a few reads still goes to background work.

## 0.2.83 · 13 November 2026
- The password and key boxes now say only the panel's own words, made from what the request names (a Mac's admin password or a key, the Mac or the key's name), so a request file with made-up text shows that text nowhere, and one the panel cannot word is not shown at all.
- Work is refused commands that write into the boxes' folder or read their keychain entries, typed, redirected, in a script or in another language's code; only the admin and secret runners use them. This stops slips and common tricks, and is no wall.
- What you type in a box still shows as you type it: the app's text field has no hidden mode, in the desktop app or the terminal.

## 0.2.82 · 13 November 2026
- Work no longer carries on on an older model. When the app moved a piece of work to Opus 4.8 after its safeguards flagged a message, the work stayed there; now each of its steps goes to Fable 5.2 instead, and while that lasts its card says which model it was kept off.
- An agent named an older model or Haiku is refused, whether the chat or a piece of work starts it, with the models to name. A helper of a kind the app runs on Haiku runs on Sonnet 5.5.
- A card that still answers from an older model says it is not a model work should run on.

## 0.2.81 · 13 November 2026
- The shipped principles no longer say that your decisions are deliberate or what done means: those are yours to add in Config.
- If you already made your own copy of the principles, nothing changes for you: an update leaves it as it is.

## 0.2.80 · 13 November 2026
- Every pull request to Claudopus, and every release on main, is now checked on GitHub by running all of its tests, so a broken test shows before it reaches you.

## 0.2.79 · 13 November 2026
- The README and the guide say that jobs running at once each spend their own tokens, so on metered billing five at a time spend about five times as fast.
- Stats says what its reply time measures, and measures it: from your message to the chat's last step before the next message, on average, without the background work it started. It used to run on until the next message came in, which counted the wait for background work and idle time.
- The two notification apps come with a SHA-256 of each of their files, checked before every release, and the guide says how to rebuild them and compare.

## 0.2.78 · 13 November 2026
- A reply in your own words that isn't one of an ask's buttons, such as "Show me images first.", no longer clears the ask: it stays open on the card with your reply under it, and the card stays among the running cards while the work acts on it, even after the work has handed in its report.
- Only a button, a reply in a button's words, or the work clearing or replacing its ask settles it. A card whose work has ended but still asks says "Waits for your answer" instead of "Finished", and never shows under Finished.
- Work your answer or message starts again shows as working at once, instead of sitting under Finished until its first step.
- A reply that started finished work again is no longer sent to it a second time when that run ends.

## 0.2.77 · 13 November 2026
- The pictures of a question from background work, and of a result, are sent to the chat the way that showed in a remote chat; sent the other way, they did not show.

## 0.2.76 · 14 November 2026
- In the Claude app's panel a card's title, its model line and the line under them now start at one left edge, in every state of the card; a chat's name above its cards no longer sits a little further in or out depending on which Mac the chat is on.

## 0.2.75 · 13 November 2026
- Requests for an admin password or key now ask in the box at the top of the panel in every chat, on this Mac too, not only in a chat run from another Mac: the same notice, wait and Cancel everywhere, and what you type goes straight into this Mac's keychain.
- The chat that asked tells you and brings the panel up with the field ready to type in.
- Only a run with no chat open on this Mac to draw a panel still asks in a dialog on this Mac's screen; over SSH it says no panel is open instead.

## 0.2.74 · 13 November 2026
- In the terminal the panel no longer sits on solid grey bars: the app's faint tint, which a terminal cannot draw see-through, is left out, so cards, Stats, Config, Results, About and the Changelog read clearly on dark and light themes and over ssh.
- In the terminal a question from work is shown above the prompt, under the work's name, with its answers numbered: pressing an answer's number twice in an empty prompt answers it, with no need to reach the panel first.
- In the terminal the panel's buttons show their keys: r Results, s Stats, m Memory, c Config, a About, f Finished, a number for each card and each result, p in every tab to go back to the panel and r in a result to go back to Results. ctrl+x Tab gives the panel the keys, Esc goes back to the chat; while a question waits, what you type there goes into its reply box until Tab leaves it.
- In the terminal the octopus is small, three rows beside the header's three lines: at rest, paddling at work, amber with a hand up when something waits, cheering green when work finishes, waving in About and jumping blue on the update screen; a tiny one sits above the prompt while work runs.
- In the terminal a switch such as On and Off marks the one in force with a filled dot instead of a grey box.
- In the terminal a picture work made is a row you press instead of a blur of blocks: on the Mac you are at it opens in the Mac's own viewer; in a terminal reached over ssh it is sent to the device you are at by Tailscale where both have it and that device is on (Tailscale keeps it in Downloads), and otherwise the row gives the one command that fetches and opens it on a Mac.
- In a narrow terminal, where Claude Code shows the panel only once you type /claudopus, its header is two lines so the work's cards show, and while this chat's work runs the line above the prompt says how to bring the panel up.
- In the terminal one tab opens beside the panel at a time and the panel stays first, instead of every press adding a tab until their names were cut off.
- In a terminal or a chat run over ssh, Memory opens the memory folder as a tab of the panel, each file a button, instead of Finder on a Mac you may not be looking at.
- Stats draws its timeline in the terminal, as coloured blocks, and its labels are no longer cut short.
- An ask's notice in the terminal chat no longer shows a broken character between the question and its answers.
- In the terminal a running card's three dots and a working helper's dot move, as they do in the app.

## 0.2.73 · 14 November 2026
- Work that answers a question while something it started is still running, such as a long copy, and still has that step to finish, now stays shown as running instead of turning green under Finished. Its card says what it is waiting for and how long that has run, and the answer it gave along the way is not kept as its result.
- A long wait for work's own background command is no longer flagged as maybe stuck.
- Work that reports with everything done while leaving something of its own running, such as a site it serves for you, still finishes at once and says it left something running.

## 0.2.72 · 13 November 2026
- Check for updates no longer says you're on the newest version when the place Claude Code installs Claudopus from is behind claudopus.ai: it says which version that place still has.

## 0.2.71 · 13 November 2026
- Config has a Check for updates button under Automatic updates: it looks for a newer release at once and downloads it, also with automatic updates off. Then it says you're on the newest version, that the new version is downloaded and typing /reload-plugins switches this chat to it, or why it could not check. Two presses, or presses in two chats, never run two updates at once.

## 0.2.70 · 13 November 2026
- claudopus.ai shows a third command after the two install lines, `/claudopus`, which opens the panel.

## 0.2.69 · 13 November 2026
- The header's update moment now shows in a chat the app runs on another Mac over ssh: before, the app dropped each of its drawings because the next was asked for before it arrived, so the moment was never seen there. It now changes only twice, so each drawing has time to arrive.
- The moment starts once the chat has finished loading, then runs its full 5 seconds: the blue octopus jumps, "Claudopus updated" turns into the new version after 2.5 seconds. The light shine across "updated" is gone.

## 0.2.68 · 13 November 2026
- Work you answer on its card after it finished now keeps its notes, asks and to-dos when it starts again. Before, all of them failed, so a new question from it never reached its card.
- An answer that arrives while nothing else runs in the chat still starts the work again; if its panel does not answer, the work puts its question in its report, and the chat asks you.

## 0.2.67 · 13 November 2026
- About has a Changelog link: it opens what changed in every version in a tab of the panel. The same list is on claudopus.ai.
- When Claudopus updates, the whole panel greets you with the blue happy octopus, the new version and what changed in every version you did not have yet.

## 0.2.66 · 13 November 2026
- Work that is ready now asks you Release it and runs the release itself on your answer, instead of asking you to type a command.
- Your words passed on to work that has ended are labelled as yours, each quoting the message it is about, and your recent words stay yours past the chat's turn.
- A command for you is given whole from its folder, and a chat run from another Mac offers no terminal button.

## 0.2.65 · 13 November 2026
- When Claudopus updates, the octopus in the panel header turns blue and happy and jumps for 5 seconds.
- The header says Claudopus updated, then the new version, and a short sound plays once per version on a Mac.
- The moment no longer shows version numbers that do not exist while it changes.

## 0.2.64 · 13 November 2026
- In a chat run from another Mac over SSH, requests for an admin password or key now ask in a box at the top of the panel on your own device, not in a dialog on a screen nobody sees.
- What you type goes straight into that Mac's keychain and never reaches the chat, a notice, saved words, a file or the log.
- Stale requests are dropped, and a value for work that has stopped is not kept.

## 0.2.63 · 13 November 2026
- Behind-the-scenes fix to the mod's own tests; nothing changes for you.

## 0.2.62 · 13 November 2026
- Pieces of work that finish at the same time no longer publish over each other: they take turns, and each one's changes are kept.
- Each piece of work changes your code only in its own copy, never in the folder you work in.

## 0.2.61 · 13 November 2026
- In a chat run from another Mac over SSH, every conversation is told that anything needing your hands is done from your own device.
- That means a sign-in by device code or a link opened there, never a browser, window or keychain prompt on the other Mac.
- A local chat is told nothing new, and the principles are no longer sent twice.

## 0.2.60 · 13 November 2026
- Titles, notes, to-dos, questions and results now name what is being done, never the model doing it, since the panel already shows each row's model.
- Which model checks the work is unchanged.

## 0.2.59 · 13 November 2026
- Work that hands back its report now ends as done at once, though something it started still runs in the background.
- Its card no longer shows it working with the clock counting; nothing it left running is stopped, and a later step brings the card back.

## 0.2.58 · 13 November 2026
- In a chat run from another Mac over SSH, an older copy of the mod left running after a typed reload no longer sends a reload the app refuses.
- A copy replaced by a newer load now does nothing.

## 0.2.57 · 13 November 2026
- A question from background work shows in its chat as the mod's notice, never as a message in your place.
- An answer on the card to work that has ended starts that work again with it.

## 0.2.56 · 13 November 2026
- In a chat run from another Mac over SSH, a picture opened large is now drawn instead of sticking on Making a large copy or going blank after a tab switch.
- There, the mod no longer sends a reload command the app refuses, and the header tells you to type it.

## 0.2.55 · 13 November 2026
- Work is told to use a faster way to search your files.

## 0.2.54 · 13 November 2026
- Removed the arrow beside a work's title and at the end of a helper's row; the title, helper name and ended row still open on a press.

## 0.2.53 · 13 November 2026
- In a chat run from another Mac over SSH, Open large under a picture draws it in the same tab, with Back to Details above and below it.
- The Details no longer jump to their end and freeze.

## 0.2.52 · 13 November 2026
- In a chat run from another Mac over SSH, one click on a panel button now works.
- The panel's numbers no longer change every second, so a click lands on a button that is still there.
- The GitHub page, banners and site carry the new pitch, with guides for people who want to contribute.

## 0.2.51 · 13 November 2026
- A work's card has no Details button any more: its title opens the Details, and Stop is plain text at the end of that row.
- The card's coloured edge shows its to-dos while it works, amber when it needs you and green when finished.
- A helper's row says its model and context before its time, dropping them where the panel is narrow.

## 0.2.50 · 13 November 2026
- For a chat run from another Mac over SSH, button presses and the way tabs open are now written to the log, to find why a first press did nothing there.

## 0.2.49 · 13 November 2026
- In a chat run from another Mac over SSH, one press on Stats, Config, About, Memory, Results or Details now opens that tab in front.
- Before, the tab often opened behind and the press seemed to do nothing.

## 0.2.48 · 13 November 2026
- A check of finished work runs on Opus, or on Fable for work built on Fable, never on a weaker model than what built it.
- The maker-and-checker workflow checks on Opus, and helpers for legwork stay on Sonnet.

## 0.2.47 · 13 November 2026
- When work asks you something, the question also arrives in its chat as a message, with its answers and the pictures it is about.
- An answer typed in the chat reaches the work like a press on the card, and an answer pressed on the card is said in the chat.

## 0.2.46 · 13 November 2026
- In a chat run from another Mac over SSH, a picture's Open large opens it in a tab on the screen you are at, not in Preview on the far Mac.
- The picture is drawn as wide as the tab from a copy prepared out of sight; a chat on this Mac still opens Preview.

## 0.2.45 · 13 November 2026
- A helper at work has a soft ring that slowly grows out of its dot and fades every 2.4 seconds; ended helpers keep a still dot.

## 0.2.44 · 13 November 2026
- Helpers sit inside their work's card as a tree of slim rows: a dot that is purple at work and green when finished, the name and the time.
- Pressing a row opens its Details, and the row of ended helpers is laid out like the rest.

## 0.2.43 · 13 November 2026
- Helpers a piece of work starts now hang under its card as a tree joined by lines, each a slim row with its name, model and time.
- Ended helpers fold into one row, each helper has its own Details, and a helper's Details leads back to its work.
- Work under way has its mark in a terminal.

## 0.2.42 · 13 November 2026
- A tab opened by a panel button no longer makes the sidebar slide shut and open again.

## 0.2.41 · 13 November 2026
- Tabs opened from the panel come to the front again; a fix lost in the version before is back.
- The panel header shows a short moment when Claudopus has just updated.

## 0.2.40 · 13 November 2026
- A tab opened by a panel button now comes to the front even when the press left the keyboard in the panel.
- This fixes buttons doing nothing visible in a chat run from another Mac over SSH.

## 0.2.39 · 13 November 2026
- Only a steer of what work is already doing goes to that work.
- A fault, question or new request about the same area starts its own helper, and when in doubt the chat starts one.

## 0.2.38 · 13 November 2026
- Work with two or more independent, heavy parts is now split across parallel helpers, and small or tightly linked work is done alone.

## 0.2.37 · 13 November 2026
- A command a question gives has an Open in Terminal button that opens Terminal with the command typed in its folder, never run, only when you press it.
- Work no longer opens a terminal tab by itself.
- A question stays amber until you answer it, even after the work that asked has finished.

## 0.2.36 · 13 November 2026
- An open chat moves to a newer installed version by itself once it has no turn running, and background work carries on through it.
- The header's installed version is now read from Claude Code's own record, which cannot go stale.

## 0.2.35 · 13 November 2026
- Pressing a picture's row in a work's Details opens it whole in the Mac's own viewer, large enough to look at and able to go full screen.
- Before, the picture only widened the sidebar.

## 0.2.34 · 13 November 2026
- The chat starts its own helper for a request that can be done on its own, even on a subject whose work is running, so nothing waits behind other work.

## 0.2.33 · 13 November 2026
- The website now says which version is current, and every hour one chat checks it, updating only when it differs from the installed one.
- With Automatic updates off, that check is skipped too.

## 0.2.32 · 13 November 2026
- A new principle in the shipped rules: if work can run in parallel it runs in parallel, and no question waits behind other work.

## 0.2.31 · 13 November 2026
- Config has an Automatic updates switch, on as shipped.
- Turned off, Claudopus stays on the installed version until updated by hand; turned back on, it looks for a new version at once if one is due.

## 0.2.30 · 13 November 2026
- Panels say when a chat on the other Mac runs without Claudopus, and when this Mac's Claude app has decided new chats there will.
- The other Mac's questions, prompts and finishes arrive here as a notification once, and it opens that chat.

## 0.2.29 · 12 November 2026
- The header shows the version this chat loaded, dim beside the name, and the newer one when this Mac has already installed it.
- Chats on two Macs running different versions can now be told apart at a glance.

## 0.2.28 · 12 November 2026
- Claudopus now updates itself: every few hours one chat runs Claude Code's own update for it, and chats that start afterwards load the new version.
- About says when a newer version is installed.
- A copy loaded straight from a folder of code is never updated.

## 0.2.27 · 12 November 2026
- Behind-the-scenes reorganisation of the mod's code; nothing changes in how it behaves or looks.

## 0.2.26 · 12 November 2026
- Buttons keep working after the mod reloads in a chat whose panel stayed open.
- A chat that starts reads the other chats before its panel opens, so they no longer drop out of the list while it loads.

## 0.2.25 · 12 November 2026
- Work that ends while the mod reloads still turns green with the happy octopus.
- A finish you have already seen is not shown twice.

## 0.2.24 · 12 November 2026
- The happy octopus now lifts its arms at every finish, in the header and above the prompt, for this chat's work and another's.
- Before, the app kept the first drawing, which was already at rest.

## 0.2.23 · 12 November 2026
- What needs you now comes as the amber octopus, Claudopus Asks, with a short needs-you sound in the notification.
- The sound plays once and is silent when sound is off; finished work stays purple with its chime.

## 0.2.22 · 12 November 2026
- A finished card always turns green with the happy octopus before it leaves, even if work was only held open by something in the background.
- Stopping a chat ends its card at once, and the octopus is happy for that moment even while something needs you.

## 0.2.21 · 12 November 2026
- Pressing a chat name in a chat run from another Mac over SSH opens that chat on your own screen, never on the other Mac.
- A dead kept connection now drops within ten seconds, and Details' Open that chat does the same.

## 0.2.20 · 12 November 2026
- Details now opens properly in a chat run from another Mac over SSH.
- An empty tab left by an older version closes as the mod loads, and another chat's Details has an Open that chat button.

## 0.2.19 · 12 November 2026
- Every question answers on the small card, with its buttons or Done and Not now, and a reply box for your own words.
- Any answer clears the amber at once.

## 0.2.18 · 12 November 2026
- With another Mac set up, both Macs now keep the same results: each one gets whatever it is missing.
- Archiving, bringing back and answers travel both ways, and nothing is deleted or overwritten.

## 0.2.17 · 12 November 2026
- The header says in one line what every chat's cards say, and the octopus agrees.
- Work that leaves an older chat's list turns green for a pause before going.

## 0.2.16 · 12 November 2026
- A chat that this Mac's app runs on another Mac now opens from its name, even on an app version that shares no link.

## 0.2.15 · 12 November 2026
- The panel lists a chat only while something is going on in it.
- Removed the hover on chat names and the row of other chats, and nothing of what was said in a chat is shared.

## 0.2.14 · 12 November 2026
- An amber card for another Mac's chat opens that chat here when Remote Control is on.

## 0.2.13 · 12 November 2026
- Quiet chats fold into one row, chat names can be hovered and opened, and ended work is shown apart from running work.
- The app's own prompt also shows amber in every panel.

## 0.2.12 · 12 November 2026
- Every panel on both Macs now lists the same open chats.
- A chat stopped on the app's own prompt, such as allowing a command or approving a plan, shows in amber at the top of every panel.
- A notification comes if the prompt still waits, and an Open that chat button appears; the mod never answers a prompt for you.

## 0.2.11 · 12 November 2026
- The panel lists every open chat on another Mac, by chat name and Mac, with Open and nothing running when it is idle.
- A chat of this Mac with no work is still not listed, and a chat leaves the list as it closes.

## 0.2.10 · 12 November 2026
- The panel lists the running work of every open chat on this Mac, grouped by chat with this chat's first.
- You can answer another chat's question from the panel.
- A setting can add chats on other Macs over SSH; the panel opens and closes in every chat together.

## 0.2.9 · 12 November 2026
- Notifications now come from Claudopus with its octopus icon, and a click opens that chat in the Claude app.
- The /claudopus and /servers commands say plainly when the screen has nowhere to draw the panel.

## 0.2.8 · 12 November 2026
- A reply typed in a card's box clears at once and says it was sent, then the work reads it at its next step.
- A reply the work refused, or never read before it ended, goes to the chat instead.

## 0.2.7 · 12 November 2026
- A new person's panel opens once with a welcome that names /claudopus and offers to index their old chats.
- Anyone already set up never sees the welcome.
- If python3 is missing, the welcome stops and gives the command to install the Command Line Tools.

## 0.2.6 · 12 November 2026
- The website's video shows its play button in the exact middle of the picture, larger, over a light shade, with a focus ring.

## 0.2.5 · 12 November 2026
- The README's Privacy section now says passwords and keys stay in the keychain until you remove them.
- It also says the texts the mod adds to prompts are sent to Claude too.

## 0.2.4 · 12 November 2026
- A new top for the README, with light and dark banners, a redrawn panel clip, a link row, tables and a Privacy section.
- The README, website and dialogs no longer claim more than the code does about passwords and keys, and say macOS only.
- Removed the author's own folder and wording from the shipped rules and the first-run script.

## 0.2.3 · 12 November 2026
- Another fix asked for by the review of the plugin directory.
- Stats keeps turn times as turns, and old totals are worked out again.

## 0.2.2 · 12 November 2026
- Fixes the problems that blocked the mod from Anthropic's plugin directory.
- The README now says what the mod does, and the question card has a reply box and working links.
- Answers from the panel are now worded as coming from the panel.

## 0.2.1 · 12 November 2026
- A command you must type is shown with a Copy button, and the work can open a terminal for it.
- Claudopus is now built in its own public repository.

## 0.2.0 · 12 November 2026
- Adds the Stats, Memory, About and Config tabs to the panel.
- Adds a card that shows when work needs you, a way to store keys and passwords, and a short clip of the panel.
- Adds a website and the details Anthropic's plugin directory asks for.

## 0.1.0 · 11 November 2026
- First public version: every chat does its work in the background and says how it is going.
- Saves your words and Claude's answers, keeps subjects, and keeps chats small.
