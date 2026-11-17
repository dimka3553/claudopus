# Changelog

What changed in each version of Claudopus, newest first.

## 0.2.172 · 17 November 2026
- The banner at the top of the README shows the octopus in 3D, built from cubes and holding task cards, as on claudopus.ai's home page, and its line says tasks where it said jobs.

## 0.2.171 · 17 November 2026
- The panel no longer lets you scroll far past its cards: while you scrolled it, it kept the length of the longest list it had shown in the chat, so blank space ran down to the Finished row under one card. Now, while you scroll, it is never longer than the bottom of what you see; blank space can still show there for a moment where cards ended while you scrolled, until you leave the panel alone
- Folding Finished while scrolled down brings the view back to what is left, instead of leaving blank space with the cards above it

## 0.2.170 · 17 November 2026
- When you answer a question in your own words in the box above the chat, only the big Send button shows now; the second, small send beside the box is gone, and Enter still sends.

## 0.2.169 · 17 November 2026
- Check now in Config shows a newer version right under the press, with its Update button (Download, then Install, on an installed copy) and how far it has got, then says to type /reload-plugins: you no longer go to the panel to update.
- Check now also brings back a version you had put off with Not now.

## 0.2.168 · 17 November 2026
- claudopus.ai has a new home page: the octopus in 3D with a task on each arm, the problem drawn as three requests taken one by one against three side by side, six ways Claude Code alone gets in your way with what Claudopus does about each, and the panel and Results drawn in depth.
- claudopus.ai/tour.html is new: a new film that shows today's Claudopus, and Results explained step by step, with why it is useful.

## 0.2.167 · 16 November 2026
- A click on a button no longer goes missing because the panel was drawn again around it: a button that looks the same from one drawing to the next is kept as the same button, so a click on the drawing still on your screen reaches it. A button whose words have just changed can still miss a click in that instant
- Every click that reaches its button is one line in Claudopus's log, so the clicks that land can be counted against the ones the app's log shows as dropped
- An answer pressed on a card by mistake can be taken back while the card still says it: "Take back" puts the question back with its buttons, and the task is told not to act on that answer
- The bar above the prompt holds still for clicks too: on the desktop it is drawn afresh at most about once a second, and not at all from the start of a click on one of its buttons until the click lands
- Scrolled down in the panel, the cards above where you point no longer grow or shrink under you while you use it: what work writes waits until you have left the panel alone for 15 seconds, and your own presses and new questions still show at once. At the list's end the view no longer snaps up and swings back
- Buttons in Settings, About and the other tabs hold still for clicks under load as the panel's do, so Reset and the rest take their click

## 0.2.166 · 16 November 2026
- A release now runs its checks on this Mac while GitHub runs its own, instead of one after the other, so each release, and each release queued behind it, takes a few minutes less. Main still moves only once both passed and you allowed it.

## 0.2.165 · 16 November 2026
- Removes a link to a local folder that an earlier release took in by mistake.

## 0.2.164 · 16 November 2026
- A task that ends its step to wait for its helpers, or for something it asked Claudopus to start it again for, is no longer reported to the chat as ended without a report: Claudopus tells the chat it is still at work and is not to be asked for its report, and answers Claude Code's reminders to report without using Claude
- Tasks are no longer told to stop a helper of their own with TaskStop, which Claude Code refuses them: they tell it to hand back what it has instead

## 0.2.163 · 16 November 2026
- A job the chat can state clearly now goes to a fresh task on Sonnet with written instructions, by itself: measured on 108 jobs, it cost least at every chat size and model, and was fastest in 32 of 36 cases and within 9 seconds in the rest. It stays on Sonnet (Fable while every task runs on Fable) even when its title says check or test; a model you name for a job still counts, as a full task on it. Work that needs judgment still goes to a task on Opus.
- The chat never hands a job to a copy of itself any more: a copy cost 1.4 to 5.9 times as much. It still runs a single safe command itself.
- Config's Tasks band keeps only When to use Fable and Second check. Small jobs, Quick task model, What a task starts with, Checker model and Helpers that only read are gone; each now always works the cheapest and fastest measured way.

## 0.2.162 · 16 November 2026
- The watcher that brings Claudopus back names the setting your copy really has when Claudopus is loaded from a folder on your Mac, as its own checkout: before, it changed a setting nothing read, and Claudopus stayed off

## 0.2.161 · 16 November 2026
- Claudopus stays on: Claude's engine switches off an add-on that keeps its shared helper busy for five seconds, and Claudopus now notices when it falls behind and does less (gives the panel as it was, leaves out looks that can wait) until it has caught up
- If Claude switches Claudopus off anyway, it comes back by itself within about half a minute, with its tools, kinds of task, rules and panel, with nothing to type: a small watcher sees the chat go quiet and changes Claudopus's own hidden setting, which makes Claude load it again
- A pane left open across a reload draws again by itself instead of staying empty
- A long hold is written in Claudopus's log with the steps that were under way, so a switch-off can be traced
- A release's log and a command's output are read from their end, so one over 4 MB no longer goes unread (a release over that size was never seen to end)
- The saved words and asks of a long chat are added to, never written again whole: once over 4 MB they would have been replaced by only the newest message

## 0.2.160 · 16 November 2026
- A helper or task that finished while Claudopus was out of the chat is now ended on its card when Claudopus comes back: it is no longer drawn as working, warned about as stuck, or keeps its finished task's card open.

## 0.2.159 · 16 November 2026
- Claudopus no longer makes macOS show "Keychain Not Found" when it runs in a home folder that has no keychain, such as a test's or a trial chat's own: it leaves the keychain alone there and says in the panel that it could not use its key.

## 0.2.158 · 16 November 2026
- Panel buttons answer clicks again with many tasks at work: while the panel is slow to draw, it is drawn afresh at most about once a second (longer when a drawing is slower), and in between the drawing on screen is given again, so the button under the pointer is still there when the click arrives. A press is still drawn at once
- From the moment a click starts until it lands, the panel keeps the drawing on screen, even one finished in that moment
- New lines from running commands show at the panel's next calm drawing, every ten seconds or so, instead of drawing the panel afresh each time one prints

## 0.2.157 · 16 November 2026
- When you answer in your own words above the chat, or paste a key or give a response there, Send is now the big button and Close the small one beside it.

## 0.2.156 · 16 November 2026
- Every background task, small task and helper now has the tool to ask Claudopus to wake it for a file, a page or a time: tasks started as Claudopus's own kinds had been told to use it without having it.
- A task whose own detached command is still at work is no longer pressed again and again to hand back its report: it ends its step and is started again when the command ends.
- A helper told not to wait is told to hand back what it waits for, rather than to use a tool helpers don't have.

## 0.2.155 · 16 November 2026
- A task's card no longer says "2 commands have ended" above commands still working: a command that only started programs which still run is not said to have ended, and the commands that did end are named with how each ended instead of counted.

## 0.2.154 · 16 November 2026
- A run one task leaves going is shown on the card of the task whose command started it, never on another task's command that ran at the same moment: a code search's row no longer shows another task's "0 of 2 heads" and its memory. A run that no command names, started while two tasks' commands ran, is shown on neither.
- The Mac's own file indexer, which ps lists in brackets as it ends, no longer shows up as runs under your tasks.

## 0.2.153 · 16 November 2026
- No task or helper can start a command whose only job is to wait, whatever shape it takes: a loop that keeps checking for a file, a line, a page or a command, a long sleep, a wait on a process, a tool made to wait, a log followed until one line comes, or a short script that only polls. Claudopus refuses it in one sentence that says what wakes Claude instead. This now covers helpers too, which is where the "36 tries · waiting for sheets" rows came from. A waiting command written in a shape the first check misses is caught while it runs: if all its processes do nothing but sleep or follow a log for two looks in a row, Claudopus stops it and tells Claude what wakes it instead.
- A task no longer waits for its helpers ("Wait for the three builders"). It ends its step and carries on when each helper's result comes. Seen live: when a task ends its step, the app hands the helper's result to the chat. Claudopus now passes it on to the task, starts the task again, and tells the chat there is nothing to do.
- For a file, a page or a time that nothing of Claude's own makes, a task asks Claudopus to wake it (`wake_me`). Claudopus looks every 15 seconds and starts Claude again once it is there, or says it never came. Meanwhile the card says what Claude is waiting for, in place of a command row.
- A real retry (a push or a copy tried again), a batch that pauses between items, and every ordinary long command still run.

## 0.2.152 · 16 November 2026
- Tasks, checks and helpers now start with only the tools their work takes, so each starts several times smaller; a task that needs a connector, a skill or the browser is still started with everything.
- The chat runs a single command such as a push itself, always in the background with a 10-minute limit, and gets back only how it ended and its last 3 lines.
- A small job that builds on what you just discussed goes to a copy of the chat for up to about 10 steps; past that, the copy hands what is left to a fresh task.
- On your go-ahead to finish (Release it), the task's last step is done without waking the task: Claudopus releases a repo that has a release file itself, after the same allow box, and a small fresh task does any other last step. The task is woken only if the step fails in a way that needs it.
- The repeated "task finished" notice no longer wakes the chat when the task's report has already come.
- Helpers that only search and read run on Sonnet 5.5; helpers that build parts keep the task's model.
- Checks are their own kind of agent, so a check never runs on a weaker model than what built the thing.
- Seven new settings in Config, under Tasks: Fable 5.2 for, Small jobs, Quick task model, Tasks start with, Second check, Checker model, Helpers that only read.

## 0.2.151 · 16 November 2026
- A command's line no longer counts "nothing printed for 10s, 15s…" while it is quiet for a few seconds. It says "nothing printed for 3m 00s", in amber, only once three minutes have passed with nothing new: of the commands that went quiet for a minute on 16 Nov, none was stuck. Claude is still told to look at a command quiet for a minute.
- A command's percent, size and speed now move up on its line every few seconds as the command prints them. They were read only every 20 seconds, so a download rewriting its percent each second sat still and read as quiet.

## 0.2.150 · 16 November 2026
- The battery card shows what the whole Mac really draws on battery, from the battery's own voltage and current, instead of an impossible figure; a reading below zero or past what a Mac can draw is left out instead of shown in watts.

## 0.2.149 · 16 November 2026
- A box asking for a key has no field of its own in the panel any more, so the panel no longer jumps while you type in it: press Paste the key or Give a response instead, and its field opens in the row above the chat's prompt, as a reply in your own words does.
- Give a response instead tells the task that asked something other than the key, such as where it already is on this Mac: your words go to that task, nothing is saved, and it carries on from them. Words that look like the key itself are held until you say whether to keep them as the key or send them anyway.

## 0.2.148 · 16 November 2026
- When a task's own command ends (finished, failed or stopped), Claudopus wakes the task at once, even if it had ended its step, so it carries on right away instead of waiting.
- A command that only waits for one of the task's own commands to end is refused, with one sentence saying the task will be woken when it ends; so is a `tail -f` that would follow a log forever.
- A task waiting for its helpers is let go the moment one finishes, and its row shows how many helpers are still working.
- A tail or grep left watching commands that have all ended is stopped, and the task is told why.
- Once a command has ended, the card's line says so in place of what the task wrote while it ran, until the task writes again.

## 0.2.147 · 16 November 2026
- Plainer words everywhere: a background job is now called a task, and every line says who does what. "The work is told you stopped it" now reads "Claudopus tells Claude you stopped it".
- The panel, cards, questions, permission prompts, chat notices, README, guide, site and past changelog entries use the same words: question, instructions, topic, command, "nothing printed for 45s".
- Chats and Claude are told to write to you the same way, so their replies and results use these words too.

## 0.2.146 · 16 November 2026
- If a task stops partway through a step without a report (because the app restarted, the Mac slept or a command was interrupted), Claudopus restarts it as soon as it sees it stuck and tells the chat. Before, it sat there until someone noticed.
- A lookup, or a small fix that Claude has proved with a test, no longer waits for a second agent to check it; the report says nobody else checked it. The second check starts as soon as there is something to check, while tests and the release carry on.
- While Claude works on a task, it runs only the tests for the part it changed. Every test runs once, in the release.
- The chat answers what it can from what it already knows or a few reads, and starts a task right away for anything that needs more.

## 0.2.145 · 16 November 2026
- Every command on a card now has a short plain line under it. It says how far the command has got and what it is doing, and it updates as the command goes. If a command prints nothing for 10 seconds, the line says "nothing printed for 45s", in amber from one minute.
- That line no longer shows raw output. Claudopus leaves out paths, file names, web addresses, log times, state codes, settings, small memory sizes and program names. It also leaves out any line that names a password, code, key or login.
- Every command on a card has a Stop button. When you press it, Claudopus ends the command and tells Claude you stopped it, so Claude won't start it again unless you ask. If a command prints nothing for a minute, Claudopus tells Claude to check it and stop it if it's stuck.
- A command that is held open now shows as a row after ten seconds, not two minutes.
- Claudopus won't start a long wait or script that shows no progress. It tells Claude how to add a progress line instead.

## 0.2.144 · 16 November 2026
- The instructions Claudopus gives chats and tasks are about a third shorter, and each rule is said once, where it is needed. Every message and every task uses fewer tokens.
- Chats no longer send a card's answer to its task a second time, and Claudopus doesn't pass on a repeated report again.
- When the same fault keeps coming back, Claudopus starts a task that is told about the earlier attempts, so it questions the approach.
- Claudopus tells Claude plainly never to wait with sleep or a polling loop, and to keep what other tasks wrote in a topic's instructions.
- The shipped principles no longer carry one person's habits.

## 0.2.143 · 16 November 2026
- A button in the panel, such as What's new or Close in the update note, now works on the first click. The panel holds still from the moment you press until the press lands. Before, a redraw in between lost the click.

## 0.2.142 · 16 November 2026
- The README, the guide, the privacy page and claudopus.ai now describe Claudopus as it is today. They cover updating with Download and Install (or one Update) then /reload-plugins, the reply box in the bar above the prompt, Stop that holds, finished tasks coming to the top, the bar of figures, the pages in the panel's header, and admin passwords that are never saved.

## 0.2.141 · 16 November 2026
- Stats no longer fails with "Svg source longer than 131072 characters" once there is a lot of history. The timeline is drawn in fewer characters. When the bars can't each carry their own words, a task's bars light up together, and past that the bars are drawn without the words. The bars themselves stay the same.
- If a timeline is still too big for one drawing, it becomes a short line, and the rest of the Stats tab still draws.
- With weeks of history, the timeline's idle-gap breaks no longer take up nearly all of its width.
- A very long workflow draws its last rounds as squares and says how many came before, so its card never gets too big to draw.

## 0.2.140 · 16 November 2026
- Your reply now reaches a task right away, even while it runs something long. If Claude gives a command a time limit of minutes, or a wait that takes minutes, the command now runs in the background. Claude reads your reply while the command keeps going.
- A task never waits for your answer with a timer. Claudopus refuses a command that waits for you, and the task stops. Its question stays on the card for as long as it takes, and your answer starts the task again the moment you give it.
- When your reply has to wait behind a short command, the card says so right away: "waiting: it reads it when “Run the build” ends (running 1m 10s)".
- A task that is waiting on its helpers now continues as soon as you reply, instead of after up to two minutes.

## 0.2.139 · 16 November 2026
- In the desktop app, a card's answers now end with "Reply in your own words". It opens the reply box in the bar above the chat's prompt, named after the task your reply goes to, so the panel scrolls freely while you type. There is one box and one Send. The card has a box of its own only while that bar is folded or one of the app's surveys is in it.
- Close in the bar, or "Close the reply box" on the card, takes the box away and saves what you typed. Pressing "Reply in your own words" on another card moves the box to that card. If the same task asks a new question, the box stays open with what you typed, and what you send then answers that question.
- Removed: the 0.2.135 change that made the panel bounce while a reply box held the cursor. The box for a password or key is still at the top of the panel, and the panel stays at its top while your cursor is in that box.
- The panel's recorder also notes which button each press reached, where the focus went, and what happens in the bar above the prompt.

## 0.2.138 · 16 November 2026
- Everything Claudopus says about updating now says only three things: which version your chats run, which version is the newest, and that you press Update and then type /reload-plugins.
- Claudopus tells a chat that runs a test build of Claudopus that Update leaves it alone.
- When an update fails, Claudopus says plainly why, and what to ask a chat to do before you press Try again.

## 0.2.137 · 15 November 2026
- claudopus.ai is now built only from main, not from every branch pushed. A busy day no longer uses up Vercel's daily limit and leaves the site on an older version.

## 0.2.136 · 15 November 2026
- The Keys button beside Memory is gone. Claudopus still keeps the list of keys you have given, by name and where each is saved, in keys.md in the memory folder. Claude still reads it before asking you for a key. If Claude asks for a key you already gave, Claudopus still refuses and says where it is.

## 0.2.135 · 15 November 2026
- Typing in a reply box no longer pulls the panel back down. While the box had the focus, the app moved the panel back to the box and undid every scroll up. Claudopus now refuses that move, so the panel stays where you scrolled it.
- The panel can be recorded for a few minutes to find faults that only show in the real app. It is off unless you ask. It saves no letter you type, and nothing typed into a key box.

## 0.2.134 · 15 November 2026
- When you press Allow once, Always allow, Deny or a question's buttons, the answer shows right away. The amber box and its buttons go at the same moment. Before, they stayed up for up to a second until the waiting command noticed the press.
- If what you allowed then doesn't happen (the command had stopped waiting, or could not be secured), the box says so in grey instead of staying green. If an answer to a question could not be written, the box says "Not sent" and brings its buttons back in the place its card had.
- A second press before the first one is taken sends nothing more.
- When a command has two things to allow and you allow one and refuse the other, the box now says in grey that nothing in it ran. Before, the first stayed green.
- A script that a task leaves running now shows under its card however it was started: a launcher's children, a shell loop with &, nohup without its process number, xargs, a pool, or a background command whose shell ended. It shows what the script is for, its progress where it writes to a file (or "running, no progress given"), and the memory it uses. It leaves the card when it ends.
- If a task's context was compacted, or the task started before the task rules changed, Claudopus gives it the current rules again at its next step.
- Claudopus tells Claude to add up the memory of heavy or parallel commands on this Mac and stay within your limit, and to send heavy work where your rules say.
- When a command's memory figure changes, the panel no longer redraws right away. It updates with the next drawing, so the panel holds still under the pointer.

## 0.2.133 · 15 November 2026
- After Update (or Install) there is no Reload button. Beside the version, the header says the new one is ready and that you type /reload-plugins.

## 0.2.132 · 15 November 2026
- In the desktop app, a figure's card above the prompt now floats over the chat, just above its figure. Showing it no longer pushes the chat up or makes it spring back, and the row of figures stays in view, so you can move straight to the next one.
- Only the card under the pointer shows. Moving along the figures, or the bar updating, no longer leaves an earlier card up over the next one.
- The cards show only their rows. The long explanation under the battery card and the graphics card's "Time at work" line are gone.

## 0.2.131 · 15 November 2026
- A chat that runs Claudopus's own code now updates with one press of Update, then Reload. It downloads the new version, checks it against what the release published, and puts it in place only if the check passes. It never overwrites changes of your own.

## 0.2.130 · 15 November 2026
- A task that finishes now comes to the top of the panel right away, just under anything that waits for you. It is outlined in green for two seconds and then goes under Finished as before. When several finish together, they stack there with the newest first, each for its own two seconds.
- If you have scrolled down the panel, the line above the prompt says in green which task just finished at the top, for those two seconds.
- A task that finished but left something running stays at the top after its moment, with its Stop it button. It doesn't go back among the running cards.
- A task you stopped, or one that failed with an error, isn't brought up. It pauses in its place as before. An error now shows in red, on the card's edge too.

## 0.2.129 · 15 November 2026
- Claudopus tells Claude to add a test only when no test already covers what it changes, to show that each new test fails without the change, and to remove tests that a change makes redundant.

## 0.2.128 · 15 November 2026
- The panel and Details are no longer rebuilt every second while tasks run. The app rebuilt the whole panel each time Claudopus wrote anything it shows, even when nothing had changed. Claudopus wrote its running times every second, and the same list of tasks every few seconds. So whatever was under the pointer lost its hover look, and a click could land on a button that had just been replaced.
- Now the panel is drawn again only when something it shows has changed. Running times and command output update every ten seconds, and not at all while you're using the panel (for fifteen seconds after you scroll it, click in it or type in it). A new question, an admin command, a task starting or finishing, and anything you press still show right away.
- With nothing running, the panel isn't drawn again at all, so buttons like "Back to the panel" on the update screen keep working on the first click.
- Tasks in other chats no longer redraw your panel each time those chats report in. Only what you'd see changing does.
- While an update downloads, its figures update every two seconds at most, and not while you're using the panel, so its other buttons stay pressable.

## 0.2.127 · 15 November 2026
- A release now waits for GitHub's own checks on the exact version it is about to put out, and goes out only once they pass. If a check fails or hasn't finished, the release stops and says which one.
- Tests that failed at random on GitHub's slower machines are steady again.

## 0.2.126 · 15 November 2026
- A newer Claudopus now shows as a small grey box in the panel's header, not a big notice. The box shows the version, how many versions it covers since yours, and in one line what is new.
- Updating is three steps, and you press for each one. The box shows how far it has got: Download (with its size and progress as it comes), Install (saying what it replaces), and Reload (saying whether this chat or every chat needs it). Not now keeps the box quiet for a day. Skip this version keeps it quiet until a newer version comes out.
- Claudopus checks a download against the fingerprint the release published before it can be installed, and checks again at Install. It throws away a download that doesn't match. If an installed copy doesn't match, Claudopus restores Claude Code's record. When a step fails, the box says what failed and that what your chat runs is unchanged.
- A chat that runs Claudopus's own code updates the same way, and it never overwrites changes of your own. A test build is told Update leaves it alone, and it is offered no download.
- Config's Updates setting lets you choose how often Claudopus looks: every hour, every 6 hours, once a day, once a week, or only when you ask. Check now only looks. It says which version this chat runs and where it loads from.
- After a chat moves to a newer version, one quiet line says so, with What's new. This replaces the screen that covered the whole panel.

## 0.2.125 · 15 November 2026
- The battery card now shows what the whole Mac draws, what the processors and the graphics processor each draw, and Claude's part of each. Claude's graphics power is marked as estimated. The card says what "Claude" covers, and that the screen, memory and storage count only in the whole.
- Claude's watts, disk and network now count tasks that a chat left running after its command ended. They also count processes that started between two readings, which were missed before.
- The graphics card now says that busy means time spent working at any speed. It shows what the graphics processor draws and lists who uses it most, with macOS drawing the screen named as such.

## 0.2.124 · 15 November 2026
- After you answer a question on its card (with a button such as Release it or Done, or with a reply from its box), the card stays where it was at the top for a minute and says what you answered. Before, it jumped away under your pointer.
- When your answer starts a task again, such as Release it on a task that had ended, the card keeps its place among the cards instead of moving to the very bottom of the panel.

## 0.2.123 · 15 November 2026
- A Stop you press on a card, or on a helper under it, now holds. Claudopus tells the chat you stopped it, and the chat can't start that task again, message it or start the same task afresh until you send a new message asking for it.
- Claudopus's own messages no longer wake a stopped task. It drops answers that were on their way to the task, and doesn't continue the task after an interruption.
- The helpers and background commands of a stopped task stop with it. Claudopus names anything the task started detached to the chat as left running.
- A card you stopped says "Stopped by you", keeps what it had done, and has Start again in its details.

## 0.2.122 · 15 November 2026
- In the desktop app, resting the pointer on a figure above the prompt now really shows its card, one at a time, and the card goes when the pointer leaves. The cards show who uses the most memory and processor, the battery in words, and network download and upload.
- The cards show Claude's own part of the graphics processor, the disk and the network, and the strain on the battery: what the Mac draws and what Claude's processors draw, in watts.
- The bar above the prompt redraws only when new figures come, not every second.

## 0.2.121 · 15 November 2026
- Claudopus now remembers which keys, tokens and logins you have given, by name and where each is saved, and never a value. It covers Claudopus's keychain, keys you saved by hand in this Mac's keychain, SBOS, and the .env files in your topics' folders. A Keys button beside Memory shows the list, and Claude reads it before asking you for a key.
- Claudopus makes the list again from each store's own list of names whenever you open it, a key is given or forgotten, or Claude asks for one. So a key taken out of a store stops being listed.
- If Claude asks for a key that the list already has, Claudopus stops it and tells it where the key is and how to use it.

## 0.2.120 · 15 November 2026
- Under a card, Claudopus lists only commands that are really running. A watch the engine killed or timed out, and a wait or command that ended, leave the list right away, so no clock keeps counting for something that stopped.
- The closing row counts the commands that ended beside the helpers, such as "3 commands ended · 3 timed out". Details lists each one with how it ended, in plain words: finished, failed with its exit code, killed, timed out, or stopped by Claude.
- When a command runs past the time Claude said it would take, the card no longer shows that old figure as if it still held. It shows a fresh estimate from the time left that the command prints (or its percent). If there is none, it says plainly that the command is past its expected time.
- Claudopus tells Claude to give a new expected time when its own estimate turns out wrong, and to stop its waits and watches once it no longer needs them.

## 0.2.119 · 15 November 2026
- While you type into a question's reply box or a key box, the panel and Details hold still. Other cards' lines, times and output wait until you stop, so the box no longer flickers, drops letters or throws the panel to its bottom. A card that starts, finishes or asks a question, and an admin command that is waiting, still show right away.
- When nobody is typing, the panel is drawn again right away for anything new. For running times and command output it redraws only every ten seconds, so a button under the pointer keeps its hover look and takes the first click.
- A reply box is empty after you send from it, and stays empty when it comes back.
- What you typed into a question's reply box stays in it through a reload of Claudopus, and doesn't turn up in the task's next question.
- A key box is drawn without the letters typed in it, so a redraw can never put older letters over newer ones.

## 0.2.118 · 15 November 2026
- The battery above the prompt no longer shows a time to full beside 100%. While macOS calls it 100% and still tops it up, the battery says "finishing". A battery that macOS calls empty shows no time left beside 0%.

## 0.2.117 · 15 November 2026
- Everything that waits for your press is now at the top of the panel, right under its header, with the newest first. A task that waits on an admin command, a release, a change to your files or an undone change comes up whole, with its amber box in its own card, beside the cards of tasks that asked you something. Password and key boxes, the chat's own gates, and Claude Code's own permission prompts from every chat are there too. All other tasks stay below, in the order they began.
- Once you press Allow or Deny, the same card says what was allowed, where the amber box was. The note is outlined in green (grey when you refused). The card goes back to its place when that note goes.
- If you have scrolled down a long panel, the line above the prompt says how many things wait at the top. Pressing it takes the panel back there. Nothing else moves the panel.
- In the terminal, a question or a password box that comes in while you type a reply no longer takes the keys from you.

## 0.2.116 · 15 November 2026
- A command's second line now starts under its name, with the tree's line carried down beside it, in the app and in a terminal. Before, the app left out the line and started it at the card's edge.
- A command shows how much time is left, either its own figure or one worked out from its percent. It no longer shows when it last printed. Claude's scripts print their progress at least every 10 seconds.

## 0.2.115 · 15 November 2026
- The line above the prompt now shows the battery: its charge, a bolt while charging or a plug on power, and the time left (or to full) as the system reports it. It shows nothing while the system is still estimating, and nothing at all on a computer without a battery.
- It also shows how busy the graphics processor is, beside the processor.
- In the desktop app, resting the pointer on a figure shows more about it in a line above. The line shows the programs using the most memory and processor, the graphics processor's memory, the network in and out, which disks and ports are counted, and the battery's state in full.

## 0.2.114 · 15 November 2026
- Tasks and helpers start only on the newest models. If one is asked to run on an older model or on Haiku, it starts on the newest model of its family instead of being refused. The same goes for a helper left to a parent on an older model, a workflow's agent, or an agent whose own kind names an older model.
- A helper that checks what was built runs on a model no weaker than the task that started it, and at least on Opus.
- Sometimes a safety check flags a message and the app would continue the task on an older model (as it continued a second look on Opus 4.8). Then Claudopus ends the task there with a report saying so, and its card says "ended after a safety flag". The task above it starts what is left again on the current model.
- Claudopus decides what counts as the newest from the newest model the engine starts tasks on, not from a version written into Claudopus.

## 0.2.113 · 15 November 2026
- Questions that need your press (a release, an admin command, a change to your settings, an undone change, a password or key, Claude Code's own permission questions) are now outlined boxes that name the kind of question at the top, so you don't mistake them for one more task.
- What you pressed now shows as one quiet line with a tick or a cross, not a card. It goes as soon as what it reports has finished, rather than staying a minute.
- A release names its branch and the repo, with the folder shortened to one line.
- A release whose output went to a log used to ask you twice, the first time for a branch called ">", which the release then refused. It now asks once, for its own branch.

## 0.2.112 · 15 November 2026
- Details now lists every to-do in order, with done ones ticked, in place of the next three and a count.
- In Details, each working helper shows the step it is on and where it says it is, and each running command shows the last lines of its output, under its row.
- Details of a finished task shows what it reported at its end, near the top, as its Result.
- Details of another chat's task opens with the same depth as this chat's own: its helpers, its commands and their last lines, and its chat, read from that chat on this Mac. A press beside the chat's name opens that chat.

## 0.2.111 · 15 November 2026
- Every command on a card is now two lines. The first says what it is and how long it has run. The second says how far it has got. A command that is held open shows its progress too, a watch shows its last event, and a command that has printed nothing says "nothing printed in 9m" instead of "updated 9m ago".
- A command's second line shows how much of how much (in GB, or a count of what it counts), its percent, its speed and the time left, when the command says them. Claudopus never works them out itself. A command that has printed nothing for three minutes says "nothing printed for 4m" in amber.
- Claude names every command in one form that the card reads as it is. It starts with the kind (Download, Upload, Wait for, Watch, Serve, Run), then what it does, then how long it should take, such as "Download the CT scans (about 3 min)". The row shows that time beside its own, in amber once it is well past. Claudopus tells Claude to run such commands in the background or detached, and to print `progress:` lines, and a line for each try of a wait.
- Without that form, a row is named by what it runs (python rc.py), never by the start of a shell line. Only a command that saves what it fetches in a file counts as a download. A wait or check that reads pages with curl no longer reads "Download".
- Pressing a command's name opens a Terminal window showing its output as it is, and following it as it goes on.
- A card no longer says "1 helper running, looked in on just now". Working helpers are rows on its tree. The card says something only when a helper has printed nothing for a while.

## 0.2.110 · 15 November 2026
- When a newer Claudopus is out, the panel now says so at the top with an Install button. Nothing is downloaded or installed until you press it. Install updates Claudopus and reloads the chat you pressed it in. Other open chats keep their version until you type `/reload-plugins` there. Config's Look for new versions turns off the hourly look.
- A release now waits for your press of Release on its task's card, and nothing is released without it. (A release you run yourself in a terminal asks you there.) A branch's own `.release` no longer runs anything.
- When a task writes your settings, the principles, the chat's rules or the task rules, it now waits for your Allow on its card. Claudopus refuses a shell command that writes them.
- The app's prompts are answered only in their own chat. Other chats' panels and other Macs show a prompt without Yes and No.
- A question from a task is answered only in its own chat, too. Other chats' panels and other Macs show it without its buttons and reply box. Claudopus puts away an answer left in a file, or carried from another Mac, without reading it.
- A password or key box shows only in the chat whose command asked for it, and only while that command waits.
- Claudopus no longer saves any admin password, and Config's Admin password setting is gone. Every admin command asks for it. On this Mac, macOS's own box asks (it now names the command). Over SSH, on Linux and from another device, the panel's box asks, and the password is locked to that one command. Claudopus removes passwords that an earlier version saved.
- Admin commands run with the system's own PATH, never one the caller set, and Claudopus hides saved keys in what commands print.
- When the app moves a task to an older model or to Haiku, the task now stays there, and its card says so. Only a helper whose own kind starts it on Haiku (as Explore does) runs on Sonnet.
- Your other Macs no longer get the commands and texts that tasks run or send. That covers the text a question gives you to paste, a prompt's command, a running or background command, and what an admin, file or release press is for.
- Claudopus marks a message passed on to a task as your own words only when the chat passes it on whole.
- Claudopus saves your settings, principles, the chat's rules, the task rules and always-allowed admin commands exactly as Claudopus or you last set them, in a locked copy that tasks can't read or write. A change made any other way is never read. That includes a command, a program a command left running, or you in an editor. Claudopus undoes such a change when it loads, when you send a message, when it reads the file, and as each call starts and ends. A card shows what the change wrote, and Allow makes it again. What the file held is saved beside it as a `.put-back` copy whatever you press. When you edit by hand, Config's Edit in your editor included, the edit takes effect once you press Allow on that card. If the locked copy is ever missing or broken, your own settings and texts move aside to `.put-back` copies, the shipped ones are in force, and each is offered on a card.
- The update card shows only a version number from the version page, never other text.
- If the keychain can't be used (locked, or refusing), the panel says so once, because Claudopus can't then undo changes made outside Claudopus to your settings and texts.
- A report from another Mac shows only pictures inside its own folder. Claudopus never reads or shows a file it names elsewhere on this Mac.
- The admin, secret, release and key runners find their files in your own home folder as your user records name it, whatever HOME a command sets. On Linux, saved keys always stay in your home folder whatever XDG_DATA_HOME says. Claudopus moves keys that an earlier version saved under XDG_DATA_HOME there as it loads.
- The guide now says that releases rely on your repository's own rules on GitHub to stop mistakes. Claudopus's press guards its own way of releasing, but a task running as you can still push main another way.

## 0.2.109 · 15 November 2026
- A task that reports with nothing of its own still running now finishes by itself, even when Claude Code still lists it as waiting. Its card stops its clock and leaves the running cards, and a question it still has stays on the card to answer.
- A finished card no longer says it left something running in the background when nothing it started is still going.
- An answer you give on a card reaches the task once. The chat no longer passes the same answer on a second time, which used to start a finished task again.

## 0.2.108 · 15 November 2026
- A tab that was left saying "Nothing to show yet" (Stats, About, a result or any other Claudopus tab) now fills in on its own a few seconds later. This happens after it opens, when you bring it to the front, and after Claudopus updates or reloads.
- A tab that can't be drawn says what went wrong instead of staying empty, and tries again.

## 0.2.107 · 15 November 2026
- A workflow's card is now built like every other card. Its title opens Details, Stop sits at its right end, and its line of facts names the model, the agents, which round it is on out of how many, and the time.
- Under the card are the test the checker holds the workflow to, and a row for each round up to the most rounds, each led by its own squares. For the round in progress, the row says who is working, beside moving dots. A checked round says what its check found. A round that hasn't run yet says it runs only if needed.
- Once the workflow ends, its last line says how: passed in round 2 of 3, or not passed after 3 of 3 rounds.

## 0.2.106 · 15 November 2026
- While tasks run, the line above the prompt now shows how Claude uses the computer, in place of one task's step. It shows memory in use, how busy the processor is, and the disk's and the network's speed. In the two small meters, Claude's part (the app, its chats and everything they started) is purple and the rest is grey. Memory turns amber past 90%. The terminal shows the same line in words. Claudopus looks every 5 seconds, once for all open chats.

## 0.2.105 · 15 November 2026
- A card now names the step its task is on, as "Step 13 of 16", under its line of facts. With no current step, it names the next one, dimmed.
- Past 14 steps, a card's coloured edge still shows the step being done, in its lighter shade, between what is done and what is left.
- When every step is ticked while the task still runs, that row says "All N steps done", so the card keeps its height.

## 0.2.104 · 15 November 2026
- A download or long command on a card now shows how much is done of how much (such as 460 MB of 1 GB, or 3 of 6 steps), its percent and its speed. Claudopus reads these from the progress that curl, wget, rsync, az and azcopy, aws, pip, git, tqdm and similar tools print. The card shows them beside when the command last wrote, or how long it has printed nothing.
- Claudopus tells Claude to make its long scripts print a `progress:` line that the card reads, and to run tools with their progress shown even when their output goes to a file.
- A command whose output can't be found says "output not found" instead of showing only its time. A detached command is no longer followed by a wrong process or a log named by a shell variable. That bug had kept a long-ended download on its card for hours with nothing to show.

## 0.2.103 · 15 November 2026
- Pressing an answer on one card no longer stops the answer buttons of other cards from working. Before, a press renamed every card's buttons. A second press from a panel that redraws late, as on a phone over the remote connection, then went nowhere and left that card amber with nothing woken. The admin command's Allow and Deny buttons are fixed the same way.
- A finished task's card no longer keeps a command counting for ever when the command it started printed a number that is no process, such as a web address's "000".

## 0.2.102 · 15 November 2026
- Automatic updates now find Claude Code where its installer puts it. A chat started without a login shell (as in tmux over ssh on Linux) updates too, instead of failing to find claude.

## 0.2.101 · 15 November 2026
- Claudopus works on Linux, in Claude Code in a terminal, installed with the same lines as on a Mac. Linux has no keychain, so Claudopus saves passwords and keys in files that only you can read. Notifications use the desktop's own where there is one. Small copies of pictures are made with ImageMagick. What only a Mac can do (Let macOS ask, Open in Terminal, the notification apps) isn't offered on Linux and says so. The guide's On Linux section says what differs.
- The tests run on Linux and on a Mac on every push.

## 0.2.100 · 14 November 2026
- The Claudopus page on GitHub names the newest version as its latest release again, with what changed in it. It had stopped at 0.2.51. Every release now posts itself there, and a release that can't do so says it failed.

## 0.2.99 · 14 November 2026
- Every result in the Results list opens on a click again, and the buttons inside a result work too. When the list changed while it was open (a result arriving, a time moving), the app kept pressing buttons that the list had already replaced, so nothing happened however often you clicked. Now each button takes a new name whenever the list changes, and the app always presses the live one.

## 0.2.98 · 14 November 2026
- Claudopus no longer mistakes a command on a card's tree for a helper. Its row starts with what it is (Command, Server, Download, Wait, Watch), and its mark has its own shape and colour. Purple round dots are for helpers only.
- Each command's row says whether it is moving. It shows when the output last changed, says "no new output for …" in amber when the command has written nothing for ten minutes, and says "paused" when its processes are stopped.
- A percent on a command's row now shows only its progress. A score or coverage figure that a command prints is no longer read as a percent.
- Commands of the same kind show as one row with a count, such as "Wait ×6". A command that only waits says what it waits for, and shows in amber when that has ended, is paused or has not changed for a long time.
- A background command that has ended leaves the card, whether the engine said so in its output or no process runs it any more.

## 0.2.97 · 14 November 2026
- A task's Details shows what the task and its helpers have running. It shows the same command rows as its card, each under the helper that started it. A helper's own Details shows its own.

## 0.2.96 · 14 November 2026
- The panel header's buttons keep a gap between rows when a narrow panel wraps them onto two lines.

## 0.2.95 · 14 November 2026
- What a task has running (a server, a download, a long script) now shows as a row on its card's tree, under whichever helper started it. The row shows what it is, a server's port, the latest line it wrote, and a download's percent and how long it has run, all read live from its output.
- A command started detached with nohup stays on its card until its process ends, even after the task finishes.
- A command that keeps writing now counts as news, so a long server or download no longer makes its card say nothing new has come back.
- Claudopus tells Claude to make its long scripts print a line at each step, so the card shows how far they have got.

## 0.2.94 · 14 November 2026
- Once you have answered a question, by a button or in your own words, its card keeps no buttons, reply box or send. If you reply in words, the card turns purple with the question and your reply under it while Claude works on it. This shows in the panel, in other chats' panels, in Details and in the terminal's band.
- When Claude asks again, or the task ends with the question still open, the question comes back with its answers and an empty box, and the chat is shown it afresh.

## 0.2.93 · 14 November 2026
- The app's prompts in the panel now say in plain words which task asks, what exactly it asks (the command, the message and the task it goes to, the page), and what a yes and a no each do. They never use a tool's own name such as "Allow SendMessage".
- Once you answer a prompt, the card says what you did and what is happening now (running, done, said no, or ended before you answered) for a minute, then goes. Before, it stayed or vanished.
- Claudopus no longer asks you to allow its own messages that pass your reply on to a task, or a Stop you pressed. Those prompts used to pile up in every chat's panel and never clear.
- An admin command's card says what Allow and Deny each do. After you press, or send or cancel a password or key box, the top of the panel says for a minute what you did and what happens now.
- A prompt to allow something has Yes and No on its card, in this chat's panel and in other chats' panels. Pressing one answers Claude Code's prompt for real, with nothing to type. Claude Code's own box still works too, and whichever you answer first counts.
- A question or a plan from Claude Code has no Yes or No on its card, because Claude Code lets only its own box answer those. The card says where that box is.

## 0.2.92 · 14 November 2026
- A card that asks you something now shows its pictures on the card itself, small, each with a row that opens it large. You can decide there without waiting for the chat to send them. In the terminal, each picture is a row that opens it on your device.

## 0.2.91 · 14 November 2026
- If your Claude app runs a chat on another Mac over SSH, its tasks now keep going when your Mac goes away. When the app ends the chat's process there while tasks run, that Mac starts the chat again by itself within about a minute, under its own sign-in, and the interrupted tasks continue. If the chat's process still runs there but the sign-in your app lent it has lapsed, Claudopus ends that process so the same happens right away.
- A task interrupted that way says so on its card ("Cut off at 00:14 … going again since 00:15"), and one notice tells you. The notice also reaches your phone where Claude Code's push notifications and Remote Control are on.
- Claude starts long commands detached and follows their logs, so a training or a build goes on even when the chat's process ends.

## 0.2.90 · 14 November 2026
- A task's helpers now run in the background, as the chat's own tasks do. The task continues with its own steps while they run, and their results come to it as they end. Before, the task was frozen until each helper ended.
- A task waits for its helpers only when it has nothing else to do. It waits with a command that returns within about 20 seconds of one helper ending, or after two minutes with a report on how each helper is doing. Claudopus holds a task back from finishing while a helper still runs (six tries at most), so a helper's result doesn't go to the chat instead. Stopping the task stops its helpers too.
- While a task has helpers running, its card says how many, and when Claudopus last looked in on them. That line turns amber when a helper has shown nothing new for five minutes, and Claudopus tells Claude to check it, nudge it or replace it.
- After each step, Claudopus tells Claude when it could have sent its calls together. Examples: a helper started alone, three single lookups in a row, two long commands of one kind one after the other, a step of only to-dos, or a commit with no second look started yet.
- The to-do reminder now asks Claude to send the to-do and note calls together with its next call for the task, never in a step of their own.

## 0.2.89 · 14 November 2026
- A chat that runs Claudopus's own code now updates too. Check for updates and automatic updates bring it to the newest version, and the box says so. Claudopus never touches changes of your own. If the update would overwrite them, the box says why and nothing changes.

## 0.2.88 · 14 November 2026
- In a narrow terminal, as on a phone over ssh, a button in the panel that opens a tab (Results, Stats, Memory, Config, About, a card's Details, a result) now opens it where you can see it. Before, it opened nothing or made the panel vanish.
- Every tab of the panel in the terminal starts with x: Close. Click it, or press x once the tab has the keys (ctrl+x Tab), and the tab closes and the panel comes back.

## 0.2.87 · 13 November 2026
- Admin commands now ask before they run. When Claude wants to run a command as administrator, the task's card shows the exact command and the Mac, with Allow once, Always allow this command and Deny. Only your press in the panel allows it. Nothing typed in a chat does. Deny tells Claude you refused.
- Config has a new part, Admin commands. You can choose ask each time (as shipped), ask once for a task and its helpers until it ends, or never, as before. It lists the commands you always allow, each with Remove.
- The admin tool itself now refuses a command you didn't allow, so a script or another route to it is refused too. A setting or a list entry that Claude wrote for itself allows nothing.
- There is a new choice for the admin password: Let macOS ask, keep nothing. Each time, macOS asks for the password on this Mac's screen, and nothing is saved. It works on this Mac only. In a chat reached from another device, admin commands are then refused. Any process running as you can read a saved password, so only this choice truly protects it.

## 0.2.86 · 13 November 2026
- A question now carries what it is about right under its text, on the card and in the chat's notice. A "Release it?" shows what goes out with it, instead of pointing at an explanation that only arrived later with the task's report. Above the prompt, such a question says the rest is in the chat and on its card.
- If Claude asks "as explained in the chat" without giving the explanation, Claudopus refuses, and Claude asks again with the explanation.
- A question longer than 300 letters is cut at a word, with the whole of it shown underneath, instead of cut off mid-word.

## 0.2.85 · 13 November 2026
- A card turns purple, as a task under way, while Claude works on your reply to its question. It stays purple from the moment you reply until the task stops again. Its question and answers stay there to press. It turns amber again only once the task stops with the question still open.
- The header counts that card as working rather than as waiting on you. The line above the terminal prompt shows the question in purple with the working octopus while Claude works on it.
- In the terminal, a task whose turn ends while a command it started in the background still runs stays working, in purple, instead of showing Finished or waiting on you. It finishes when it is actually done.

## 0.2.84 · 13 November 2026
- The chat now answers a question that a few file reads can answer, such as what a function does, by reading them itself, with no background task started. Anything that changes a file, runs a command or needs more than a few reads still goes to a background task.

## 0.2.83 · 13 November 2026
- The password and key boxes now say only the panel's own words, made from what the request names (a Mac's admin password or a key, the Mac or the key's name). A request file with made-up text shows that text nowhere, and a request the panel can't put into words isn't shown at all.
- Claudopus refuses Claude's commands that write into the boxes' folder or read their keychain entries, whether typed, redirected, in a script or in another language's code. Only the admin and secret runners use them. This catches mistakes and common tricks, but can't stop code set on getting around it.
- What you type in a box still shows as you type it, because the app's text field has no hidden mode, in the desktop app or the terminal.

## 0.2.82 · 13 November 2026
- A task no longer continues on an older model. Before, when the app moved a task to Opus 4.8 after its safeguards flagged a message, the task stayed there. Now each of its steps goes to Fable 5.2 instead, and while that lasts its card says which model it was kept off.
- Claudopus refuses an agent named with an older model or Haiku, whether the chat or a task starts it, and says which models to name. A helper of a kind the app runs on Haiku runs on Sonnet 5.5.
- A card that still answers from an older model says Claudopus doesn't run tasks on that model.

## 0.2.81 · 13 November 2026
- The shipped principles no longer say that your decisions are deliberate or what done means. Those are yours to add in Config.
- If you already made your own copy of the principles, nothing changes for you. An update leaves it as it is.

## 0.2.80 · 13 November 2026
- GitHub now checks every pull request to Claudopus, and every release on main, by running all of its tests. A broken test shows before it reaches you.

## 0.2.79 · 13 November 2026
- The README and the guide say that tasks running at once each spend their own tokens. On metered billing, five at a time spend about five times as fast.
- Stats says what its reply time measures, and now measures it that way: the average time from your message to the chat's last step before the next message, without the background tasks it started. It used to run on until the next message came in, which counted the wait for background tasks and idle time.
- The two notification apps come with a SHA-256 of each of their files, checked before every release, and the guide says how to rebuild them and compare.

## 0.2.78 · 13 November 2026
- A reply in your own words that isn't one of a question's buttons, such as "Show me images first.", no longer clears the question. The question stays open on the card with your reply under it. The card stays among the running cards while Claude works on your reply, even after the task has handed in its report.
- Only a button, a reply in a button's words, or Claude clearing or replacing its question settles it. A card whose task has ended but still has a question says "Waits for your answer" instead of "Finished", and never shows under Finished.
- A task that your answer or message starts again now shows as working right away, instead of sitting under Finished until its first step.
- A reply that started a finished task again is no longer sent to it a second time when that command ends.

## 0.2.77 · 13 November 2026
- Claudopus now sends the pictures of a background task's question, and of a result, to the chat the way that showed in a remote chat. Sent the other way, they didn't show.

## 0.2.76 · 14 November 2026
- In the Claude app's panel, a card's title, its model line and the line under them now start at one left edge, in every state of the card. A chat's name above its cards no longer sits a little further in or out depending on which Mac the chat is on.

## 0.2.75 · 13 November 2026
- Requests for an admin password or key now ask in the box at the top of the panel in every chat, on this Mac too, not only in a chat run from another Mac. The notice, the wait and Cancel are the same everywhere, and what you type goes straight into this Mac's keychain.
- The chat that asked tells you and brings the panel up with the field ready to type in.
- Only a command with no chat open on this Mac to draw a panel still asks in a dialog on this Mac's screen. Over SSH it says no panel is open instead.

## 0.2.74 · 13 November 2026
- In the terminal, the panel no longer sits on solid grey bars. A terminal can't draw the app's faint tint see-through, so Claudopus leaves it out. Cards, Stats, Config, Results, About and the Changelog now read clearly on dark and light themes and over ssh.
- In the terminal, a question from a task shows above the prompt, under the task's name, with its answers numbered. Pressing an answer's number twice in an empty prompt answers it, with no need to reach the panel first.
- In the terminal, the panel's buttons show their keys: r Results, s Stats, m Memory, c Config, a About, f Finished, a number for each card and each result, p in every tab to go back to the panel, and r in a result to go back to Results. ctrl+x Tab gives the panel the keys, and Esc goes back to the chat. While a question waits, what you type there goes into its reply box until Tab leaves it.
- In the terminal, the octopus is small, three rows beside the header's three lines. It rests, paddles while working, turns amber with a hand up when something waits, cheers in green when a task finishes, waves in About and jumps blue on the update screen. A tiny one sits above the prompt while tasks run.
- In the terminal, a switch such as On and Off marks the one in force with a filled dot instead of a grey box.
- In the terminal, a picture a task made is a row you press, instead of a blur of blocks. On the Mac you are at, it opens in the Mac's own viewer. In a terminal reached over ssh, Claudopus sends it by Tailscale to the device you are at, where both have Tailscale and that device is on (Tailscale saves it in Downloads). Otherwise the row gives the one command that fetches and opens it on a Mac.
- In a narrow terminal, Claude Code shows the panel only once you type /claudopus. Its header is now two lines so the task's cards show, and while this chat's tasks run, the line above the prompt says how to bring the panel up.
- In the terminal, one tab opens beside the panel at a time, and the panel stays first. Before, every press added a tab until their names were cut off.
- In a terminal or a chat run over ssh, Memory opens the memory folder as a tab of the panel, with each file as a button, instead of opening Finder on a Mac you may not be looking at.
- Stats draws its timeline in the terminal as coloured blocks, and its labels are no longer cut short.
- A question's notice in the terminal chat no longer shows a broken character between the question and its answers.
- In the terminal, a running card's three dots and a working helper's dot move, as they do in the app.

## 0.2.73 · 14 November 2026
- A task that answers a question while something it started is still running, such as a long copy, and still has that step to finish, now stays shown as running. Before, it turned green under Finished. Its card says what it is waiting for and how long that has run, and the answer it gave along the way isn't saved as its result.
- A long wait for a task's own background command is no longer flagged as maybe stuck.
- A task that reports with everything done while leaving something of its own running, such as a site it serves for you, still finishes right away and says it left something running.

## 0.2.72 · 13 November 2026
- Check for updates no longer says you're on the newest version when the place Claude Code installs Claudopus from is behind claudopus.ai. It now says which version that place still has.

## 0.2.71 · 13 November 2026
- Config has a Check for updates button under Automatic updates. It looks for a newer release right away and downloads it, also with automatic updates off. Then it tells you one of three things: you're on the newest version; the new version is downloaded and typing /reload-plugins switches this chat to it; or why it couldn't check. Two presses, or presses in two chats, never run two updates at once.

## 0.2.70 · 13 November 2026
- claudopus.ai shows a third command after the two install lines, `/claudopus`, which opens the panel.

## 0.2.69 · 13 November 2026
- The header's update moment now shows in a chat that the app runs on another Mac over ssh. Before, the app dropped each of its drawings because it asked for the next before the last arrived, so you never saw the moment there. Now it changes only twice, so each drawing has time to arrive.
- The moment starts once the chat has finished loading, then runs its full 5 seconds: the blue octopus jumps, and "Claudopus updated" turns into the new version after 2.5 seconds. The light shine across "updated" is gone.

## 0.2.68 · 13 November 2026
- A task that you answer on its card after it finished now keeps its notes, questions and to-dos when it starts again. Before, all of them failed, so a new question from it never reached its card.
- An answer that arrives while nothing else runs in the chat still starts the task again. If its panel doesn't answer, Claude puts its question in its report, and the chat asks you.

## 0.2.67 · 13 November 2026
- About has a Changelog link. It opens what changed in every version, in a tab of the panel. The same list is on claudopus.ai.
- When Claudopus updates, the whole panel greets you with the blue happy octopus, the new version, and what changed in every version you didn't have yet.

## 0.2.66 · 13 November 2026
- When a task is ready, Claudopus now asks you Release it, and runs the release itself when you answer. Before, it asked you to type a command.
- Your words passed on to a task that has ended are labelled as yours, each quoting the message it is about. Your recent words stay yours past the chat's turn.
- A command for you is given whole, from its folder. A chat run from another Mac offers no terminal button.

## 0.2.65 · 13 November 2026
- When Claudopus updates, the octopus in the panel header turns blue and happy and jumps for 5 seconds.
- The header says Claudopus updated, then the new version, and a short sound plays once per version on a Mac.
- While it changes, the moment no longer shows version numbers that don't exist.

## 0.2.64 · 13 November 2026
- In a chat run from another Mac over SSH, requests for an admin password or key now ask in a box at the top of the panel on your own device. Before, they asked in a dialog on a screen nobody sees.
- What you type goes straight into that Mac's keychain. It never reaches the chat, a notice, saved words, a file or the log.
- Claudopus drops stale requests, and doesn't save a value for a task that has stopped.

## 0.2.63 · 13 November 2026
- A fix to Claudopus's own tests, behind the scenes. Nothing changes for you.

## 0.2.62 · 13 November 2026
- Tasks that finish at the same time no longer publish over each other. They take turns, and each one's changes are saved.
- Each task changes your code only in its own copy, never in the folder you work in.

## 0.2.61 · 13 November 2026
- In a chat run from another Mac over SSH, Claudopus tells every conversation that anything needing your hands is done from your own device.
- That means a sign-in by device code or a link opened there, never a browser, window or keychain prompt on the other Mac.
- A local chat is told nothing new, and the principles are no longer sent twice.

## 0.2.60 · 13 November 2026
- Titles, notes, to-dos, questions and results now name what is being done, never the model doing it, because the panel already shows each row's model.
- Which model checks the work is unchanged.

## 0.2.59 · 13 November 2026
- A task that hands back its report now ends as done right away, even though something it started still runs in the background.
- Its card no longer shows it working with the clock counting. Claudopus stops nothing that the task left running, and a later step brings the card back.

## 0.2.58 · 13 November 2026
- In a chat run from another Mac over SSH, an older copy of Claudopus left running after a typed reload no longer sends a reload that the app refuses.
- A copy that a newer load has replaced now does nothing.

## 0.2.57 · 13 November 2026
- A question from a background task shows in its chat as Claudopus's notice, never as a message in your place.
- An answer on the card to a task that has ended starts that task again with it.

## 0.2.56 · 13 November 2026
- In a chat run from another Mac over SSH, a picture opened large is now drawn. Before, it stuck on Making a large copy or went blank after a tab switch.
- There, Claudopus no longer sends a reload command that the app refuses, and the header tells you to type it.

## 0.2.55 · 13 November 2026
- Claudopus tells Claude to use a faster way to search your files.

## 0.2.54 · 13 November 2026
- Removed the arrow beside a task's title and at the end of a helper's row. The title, the helper name and the ended row still open when you press them.

## 0.2.53 · 13 November 2026
- In a chat run from another Mac over SSH, Open large under a picture draws it in the same tab, with Back to Details above and below it.
- Details no longer jump to their end and freeze.

## 0.2.52 · 13 November 2026
- In a chat run from another Mac over SSH, one click on a panel button now works.
- The panel's numbers no longer change every second, so a click lands on a button that is still there.
- The GitHub page, banners and site carry the new pitch, with guides for people who want to contribute.

## 0.2.51 · 13 November 2026
- A task's card has no Details button any more. Its title opens the Details, and Stop is plain text at the end of that row.
- The card's coloured edge shows its to-dos while it works, amber when it needs you and green when finished.
- A helper's row says its model and context before its time, and drops them where the panel is narrow.

## 0.2.50 · 13 November 2026
- For a chat run from another Mac over SSH, Claudopus now writes button presses and the way tabs open to the log, to find why a first press did nothing there.

## 0.2.49 · 13 November 2026
- In a chat run from another Mac over SSH, one press on Stats, Config, About, Memory, Results or Details now opens that tab in front.
- Before, the tab often opened behind, and the press seemed to do nothing.

## 0.2.48 · 13 November 2026
- A check of finished work runs on Opus, or on Fable for work built on Fable, and never on a weaker model than the one that built it.
- The maker-and-checker workflow checks on Opus, and helpers for long searching and reading stay on Sonnet.

## 0.2.47 · 13 November 2026
- When a task asks you something, the question also arrives in its chat as a message, with its answers and the pictures it is about.
- An answer typed in the chat reaches the task like a press on the card, and the chat says an answer pressed on the card.

## 0.2.46 · 13 November 2026
- In a chat run from another Mac over SSH, a picture's Open large opens it in a tab on the screen you are at, not in Preview on the far Mac.
- Claudopus prepares a copy out of sight and draws the picture as wide as the tab. A chat on this Mac still opens Preview.

## 0.2.45 · 13 November 2026
- A working helper has a soft ring that slowly grows out of its dot and fades every 2.4 seconds. Ended helpers keep a still dot.

## 0.2.44 · 13 November 2026
- Helpers sit inside their task's card as a tree of slim rows. Each row has a dot that is purple while the helper works and green when it finishes, the name, and the time.
- Pressing a row opens its Details, and the row of ended helpers is laid out like the rest.

## 0.2.43 · 13 November 2026
- The helpers a task starts now hang under its card as a tree joined by lines. Each is a slim row with its name, model and time.
- Ended helpers fold into one row, each helper has its own Details, and a helper's Details leads back to its task.
- A task under way has its mark in a terminal.

## 0.2.42 · 13 November 2026
- A tab opened by a panel button no longer makes the sidebar slide shut and open again.

## 0.2.41 · 13 November 2026
- Tabs opened from the panel come to the front again. A fix that was lost in the version before is back.
- The panel header shows a short moment when Claudopus has just updated.

## 0.2.40 · 13 November 2026
- A tab opened by a panel button now comes to the front even when the press left the keyboard in the panel.
- This fixes buttons doing nothing visible in a chat run from another Mac over SSH.

## 0.2.39 · 13 November 2026
- Only a message about what a task is already doing goes to that task.
- A fault, question or new request about the same area starts its own helper, and when in doubt the chat starts one.

## 0.2.38 · 13 November 2026
- A task with two or more independent, heavy parts is now split across parallel helpers. Small or tightly linked tasks are done alone.

## 0.2.37 · 13 November 2026
- A command that a question gives you has an Open in Terminal button. It opens Terminal with the command typed in its folder, and never runs it unless you press it.
- Claude no longer opens a terminal tab by itself.
- A question stays amber until you answer it, even after the task that asked has finished.

## 0.2.36 · 13 November 2026
- An open chat moves to a newer installed version by itself once it has no turn running, and background tasks continue through it.
- The header's installed version is now read from Claude Code's own record, which can't go stale.

## 0.2.35 · 13 November 2026
- Pressing a picture's row in a task's Details opens it whole in the Mac's own viewer, large enough to look at and able to go full screen.
- Before, the picture only widened the sidebar.

## 0.2.34 · 13 November 2026
- The chat starts its own helper for a request that can be done on its own, even on a topic whose task is running, so nothing waits behind other tasks.

## 0.2.33 · 13 November 2026
- The website now says which version is current. Every hour one chat checks it, and updates only when it differs from the installed one.
- With Automatic updates off, that check is skipped too.

## 0.2.32 · 13 November 2026
- A new principle in the shipped rules: if tasks can run in parallel they run in parallel, and no question waits behind other tasks.

## 0.2.31 · 13 November 2026
- Config has an Automatic updates switch, on as shipped.
- Turned off, Claudopus stays on the installed version until you update it by hand. Turned back on, it looks for a new version right away if one is due.

## 0.2.30 · 13 November 2026
- Panels say when a chat on the other Mac runs without Claudopus, and when this Mac's Claude app has decided that new chats there will run with it.
- The other Mac's questions, prompts and finishes arrive here as a notification once, and it opens that chat.

## 0.2.29 · 12 November 2026
- The header shows the version this chat loaded, dim beside the name, and the newer one when this Mac has already installed it.
- You can now tell at a glance apart chats on two Macs that run different versions.

## 0.2.28 · 12 November 2026
- Claudopus now updates itself. Every few hours one chat runs Claude Code's own update for it, and chats that start afterwards load the new version.
- About says when a newer version is installed.
- Claudopus never updates a chat that runs its own code.

## 0.2.27 · 12 November 2026
- A reorganisation of Claudopus's code, behind the scenes. Nothing changes in how it behaves or looks.

## 0.2.26 · 12 November 2026
- Buttons keep working after Claudopus reloads in a chat whose panel stayed open.
- A chat that starts reads the other chats before its panel opens, so they no longer drop out of the list while it loads.

## 0.2.25 · 12 November 2026
- A task that ends while Claudopus reloads still turns green with the happy octopus.
- A finish you have already seen isn't shown twice.

## 0.2.24 · 12 November 2026
- The happy octopus now lifts its arms at every finish, in the header and above the prompt, for this chat's tasks and another's.
- Before, the app kept the first drawing, which was already at rest.

## 0.2.23 · 12 November 2026
- When something needs you now, the notification shows the amber octopus, Claudopus Asks, with a short needs-you sound.
- The sound plays once and stays silent when sound is off. A finished task stays purple with its chime.

## 0.2.22 · 12 November 2026
- A finished card always turns green with the happy octopus before it leaves, even if the task was only held open by something in the background.
- Stopping a chat ends its card right away, and the octopus is happy for that moment even while something needs you.

## 0.2.21 · 12 November 2026
- Pressing a chat name in a chat run from another Mac over SSH opens that chat on your own screen, never on the other Mac.
- A dead saved connection now drops within ten seconds, and Details' Open that chat does the same.

## 0.2.20 · 12 November 2026
- Details now opens properly in a chat run from another Mac over SSH.
- Claudopus closes an empty tab left by an older version as it loads, and another chat's Details has an Open that chat button.

## 0.2.19 · 12 November 2026
- Every question is answered on the small card, with its buttons or Done and Not now, and a reply box for your own words.
- Any answer clears the amber right away.

## 0.2.18 · 12 November 2026
- With another Mac set up, both Macs now keep the same results. Each one gets whatever it is missing.
- Archiving, bringing back and answers travel both ways, and nothing is deleted or overwritten.

## 0.2.17 · 12 November 2026
- The header says in one line what every chat's cards say, and the octopus agrees.
- A task that leaves an older chat's list turns green for a pause before going.

## 0.2.16 · 12 November 2026
- A chat that this Mac's app runs on another Mac now opens from its name, even on an app version that shares no link.

## 0.2.15 · 12 November 2026
- The panel lists a chat only while something is going on in it.
- Removed the hover on chat names and the row of other chats. Claudopus shares nothing of what was said in a chat.

## 0.2.14 · 12 November 2026
- An amber card for another Mac's chat opens that chat here when Remote Control is on.

## 0.2.13 · 12 November 2026
- Quiet chats fold into one row, you can hover chat names and open them, and ended tasks show apart from running tasks.
- The app's own prompt also shows amber in every panel.

## 0.2.12 · 12 November 2026
- Every panel on both Macs now lists the same open chats.
- A chat stopped on the app's own prompt, such as allowing a command or approving a plan, shows in amber at the top of every panel.
- A notification comes if the prompt still waits, and an Open that chat button appears. Claudopus never answers a prompt for you.

## 0.2.11 · 12 November 2026
- The panel lists every open chat on another Mac, by chat name and Mac, with Open, and says nothing running when it is idle.
- A chat of this Mac with no tasks is still not listed, and a chat leaves the list as it closes.

## 0.2.10 · 12 November 2026
- The panel lists the running tasks of every open chat on this Mac, grouped by chat with this chat's first.
- You can answer another chat's question from the panel.
- A setting can add chats on other Macs over SSH. The panel opens and closes in every chat together.

## 0.2.9 · 12 November 2026
- Notifications now come from Claudopus with its octopus icon, and a click opens that chat in the Claude app.
- The /claudopus and /servers commands say plainly when the screen has nowhere to draw the panel.

## 0.2.8 · 12 November 2026
- A reply typed in a card's box clears right away and says it was sent. Claude then reads it at its next step.
- A reply that Claude refused, or never read before the task ended, goes to the chat instead.

## 0.2.7 · 12 November 2026
- A new person's panel opens once with a welcome that names /claudopus and offers to index their old chats.
- Anyone already set up never sees the welcome.
- If python3 is missing, the welcome stops and gives the command to install the Command Line Tools.

## 0.2.6 · 12 November 2026
- The website's video shows its play button in the exact middle of the picture, larger, over a light shade, with a focus ring.

## 0.2.5 · 12 November 2026
- The README's Privacy section now says passwords and keys stay in the keychain until you remove them.
- It also says that the texts Claudopus adds to prompts are sent to Claude too.

## 0.2.4 · 12 November 2026
- A new top for the README, with light and dark banners, a redrawn panel clip, a link row, tables and a Privacy section.
- The README, website and dialogs no longer claim more than the code does about passwords and keys, and say macOS only.
- Removed the author's own folder and wording from the shipped rules and the first-run script.

## 0.2.3 · 12 November 2026
- Another fix asked for by the review of the plugin directory.
- Stats keeps turn times as turns, and old totals are worked out again.

## 0.2.2 · 12 November 2026
- Fixes the problems that blocked Claudopus from Anthropic's plugin directory.
- The README now says what Claudopus does, and the question card has a reply box and working links.
- Answers from the panel are now worded as coming from the panel.

## 0.2.1 · 12 November 2026
- A command you must type is shown with a Copy button, and Claude can open a terminal for it.
- Claudopus is now built in its own public repository.

## 0.2.0 · 12 November 2026
- Adds the Stats, Memory, About and Config tabs to the panel.
- Adds a card that shows when a task needs you, a way to store keys and passwords, and a short clip of the panel.
- Adds a website and the details Anthropic's plugin directory asks for.

## 0.1.0 · 11 November 2026
- First public version: every chat does its tasks in the background and says how they are going.
- Saves your words and Claude's answers, keeps topics, and keeps chats small.
