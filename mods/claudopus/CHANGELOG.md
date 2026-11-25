# Changelog

What changed in each version of Claudopus, newest first.

## 0.2.273 · 25 November 2026
- Each card of the bar above the prompt now has a small chart of that figure's last 10 minutes, with Claude's part in purple and the highest it went. The charts use the looks the bar already takes, so they cost nothing extra.
- While the Mac charges, the battery card says how many watts go into the battery and what the charger gives of what it can, such as 88 of 94 W. When the battery drains even though the Mac says it's charging, the card says so plainly.
- The battery card's whole-Mac power on the charger no longer counts the charging: it read about 80 W while the Mac itself drew about 19 W.
- A card no longer opens below its figure, over the figures and the prompt: it holds its words from the moment it shows, so the app measures it whole and puts it above.

## 0.2.272 · 24 November 2026
- Typing "allow", "yes", "release it" or a button's own words in the chat now answers the card that waits for you, as a press on it would: the newest one, or the one whose task you name, such as "allow the nose fix". Only your own typing counts, never a task's message, and a message that fits more than one named card answers nothing. A command Claude Code blocked still runs only on your press on its card, which the card and the chat now say.

## 0.2.271 · 23 November 2026
- Each topic now has a short page a task reads first and a history that tasks only add to, so a task no longer reads or resends a whole page of notes. A page that grows past 8,000 characters is moved whole into its history, and a short page is written from it in its place.
- Topics from tests and scratch folders stay out of the topic list every chat is given.
- The results each message lists show one result per task, its newest, instead of every result it handed in.
- Recall gives topic pages first, then their histories, results newest first and your chats' words; the same line from several files once; and, when no line holds your phrase as written, the lines that hold each of its words.
- The same picture in several results of one task now takes its disk space once.

## 0.2.270 · 23 November 2026
- Claudopus keeps a ledger of every task on disk as it changes, so quitting or restarting the Claude app loses nothing: a task that was working is shown as Interrupted, never Done or gone, with Carry on to start it again from where it stopped.
- Carry on starts a fresh task with the cut-off task's instructions, to-dos, last notes, worktree and saved transcript; a question it asked still waits for you, and your answer carries it on. Tasks you stopped stay stopped.
- Tasks of other chats that the app's close cut off show under that chat's name until you open it.

## 0.2.269 · 22 November 2026
- The panel's list no longer goes blank with "Claudopus couldn't show this tab" when you widen it with a lot of work open: it draws with less in it instead, its lines cut to a side panel's length, then each card's helpers and commands counted on one row that opens its Details.

## 0.2.268 · 22 November 2026
- The update message in the panel header is shorter, "v0.2.267 ready: /reload-plugins", and stays on one line instead of wrapping.

## 0.2.267 · 22 November 2026
- claudopus.ai's cookie banner now just asks "Accept cookies?", and shows only in the EU and the EEA, the UK, Switzerland and Turkey, where the law asks first. Elsewhere the site counts visits with Microsoft Clarity without a banner, and the Cookies link at the bottom of each page still turns it off.

## 0.2.266 · 21 November 2026
- However many tasks run, Claude's commands now leave two cores of your Mac free for you, so it stays responsive. Commands run at full speed while they fit in the other cores; newer ones past that wait in the Mac's background mode, using only what you leave idle, and go back to full speed as room comes.

## 0.2.265 · 21 November 2026
- Stats opens at once. It keeps what it has added up, by chat, by day and by month, and reads one of Claude Code's records again only when that record changes. Before, every opening added every response and task up again, and a chat with more than about 600 tasks was never kept at all, so All chats took half a minute each time.
- The figures are the same as before, to the cent and the second.
- All time keeps counting work whose records Claude Code has since cleared.
- The leaderboard is sent only what changed since it was last sent: the figures of the ranges that changed, and of your timeline only its newest tasks. Nothing is sent when nothing changed. Before, everything went every 3 minutes.
- The leaderboard no longer refuses a timeline of more than about 850 tasks, which would have stopped that person's figures from updating.

## 0.2.264 · 21 November 2026
- Claudopus no longer sends the chat a message of its own when a task hands in a part of its result, so no part's notice shows in the chat as your message, even when the chat is busy. The task's own message brings the part, or your next message does

## 0.2.263 · 21 November 2026
- The Leaderboard tab shows the board as a table with headings, the first three places in gold, silver and bronze, and your own row shaded and marked "you".
- Once you have joined, your part of the tab is titled with your username and shows your place, such as "2nd of 4", and before you join the username box comes first.

## 0.2.262 · 21 November 2026
- Join on the leaderboard answers at once: it says "Joining as …" as you press it and you are on the board in a moment, where it showed nothing for half a minute after an update. Your full figures follow straight after.
- A press on the leaderboard made while another is on its way now waits its turn, where it did nothing.

## 0.2.261 · 21 November 2026
- The Leaderboard tab has three switches once you've joined: On the leaderboard (off deletes you from it), Your stats (private or public) and Your timeline (private or public, never with task names).

## 0.2.260 · 21 November 2026
- A link to your own leaderboard page now always previews as your card, with your name, figures and picture, in Telegram and other apps; before, it could show the whole board instead. The picture updates in those apps when your figures change, and a link ending in a slash works too.

## 0.2.259 · 21 November 2026
- Joining the leaderboard now says, one short line each, what the board shows, what is never sent, how often it sends, what public adds and what Leave does.
- Your timeline goes to the leaderboard only while your stats are public; making them private deletes it there.

## 0.2.258 · 21 November 2026
- The panel's Leaderboard button now opens a Leaderboard tab: the board's top 10 for today, 7 days, 30 days or all time, and right under it, joining with a username, or your place with Open my page, public or private, and Leave. Stats no longer holds it.
- Time of work and time on the clock read in days, hours and minutes, such as 9d 0h 18m, in Stats, on the board, on each person's page and in link previews.

## 0.2.257 · 21 November 2026
- A link to someone's leaderboard page now shows a picture of their stats wherever you paste it: hours of work done, hours on the clock, efficiency, favourite model, API cost and tasks, with their timeline when their stats are public. A link to the board shows the top five.
- claudopus.ai's own link picture now shows the 3D octopus with a task on each arm.
- The leaderboard counts only from when you first installed Claudopus.

## 0.2.256 · 21 November 2026
- A leaderboard on claudopus.ai: join it from Stats with a username nobody else has, and Claudopus sends your hours of work, tokens and API cost every few minutes; nothing is sent before you join, and Leave takes you off at once.
- You choose whether your stats are public: then anyone can open your page from the board and see your models, tokens and work.
- The panel has a Leaderboard button beside Stats that opens the board.
- The board leads with hours of work done, hours on the clock and efficiency, then each person's favourite model (the one that used the most tokens), tokens, API cost and tasks done.
- Stats counts over today, the last 7 days, the last 30 days or all time, and shows hours of work done, hours on the clock, your efficiency (hours of work done for each hour on the clock), your favourite model, what share of your tokens were cache reads and cache writes, and what the same use would cost on the API.
- A public person's page shows their timeline as Stats draws it, every task running at once in its model's colour, with no task names.

## 0.2.255 · 21 November 2026
- Release it is the only press a release needs: when a release has to run again because main changed or a check failed, it no longer asks you for a second Allow.
- When Claude Code blocks a task from using a connector, such as confirming a Supabase cost, the card now says so and gives you the one way through: Open in Terminal, press Return to let your tasks do it from now on, then Try again. Before, nothing showed, and your yes on the card or in the chat could never let it through.

## 0.2.254 · 21 November 2026
- The website's home page says the same things in about a third of the words. It opens with the 3D octopus holding a task on each arm, and each part is now a headline, one sentence and one picture
- The example that stepped by itself on the first screen is gone, and the pictures of the panel show the task cards alone
- The proof now says it plainly: 3 weeks of work, done in 1 week

## 0.2.253 · 21 November 2026
- When a task hands you a part of its result, the task itself now tells the chat, so no message appears in the chat as if you had written it. Claudopus's own message is sent only if the task has not told the chat within a minute
- A part the chat has already shown you no longer starts another empty turn, and parts from several tasks that wait together come in one message

## 0.2.252 · 21 November 2026
- The website's home page now opens with what you get: about 3 times as much work going at once with Claude Code, measured over three weeks of real use. Its first screen has the two install lines, the figures, and the real panel stepping through one example
- Every picture of the panel on the home page is drawn by the panel's own code, in place of the hand-made drawings, and the page says what the 3× does and doesn't mean

## 0.2.251 · 21 November 2026
- When a task asks you for a key, the box to paste it into is on its card at once, with the task's question, where to get the key, and whether it replaces a saved key or is a second one beside it. Nothing to run or press first, and no more "Key is in" buttons with nowhere to paste.

## 0.2.250 · 21 November 2026
- The Claudopus tab always stays first in the panel's row of tabs; Stats, a task's Details and the others open after it, in the order you opened them.

## 0.2.249 · 21 November 2026
- A task's Details now shows what it does as it happens, at the end of its conversation, in the words and look of the Claude chat itself: "Thinking…", then "Thought for 12s", which opens on its thinking, its words as they are written, "Running a command · 40s" over the command's name while it runs, and each helper at work over what it does now, so the card no longer stands still between its notes.

## 0.2.248 · 21 November 2026
- A task can now hand you a report on a part that is finished while it goes on with the rest, as many times as it has one: each reaches you in the chat and is kept as a result of its own, and its card keeps working with its to-dos, helpers and commands. Its last report still ends it
- Tasks are told to hand in finished work as soon as you can look at it or act on it, instead of keeping it until the end and filling their card with notes that they wait

## 0.2.247 · 20 November 2026
- When a task's result asks you something, your answer in words, or a message you send the task, now counts as the answer: the card stops being yellow while the task works on it, and the question doesn't come back when it finishes

## 0.2.246 · 20 November 2026
- The button at the right end of the line above the prompt now follows the panel: Open panel while it is closed, Close panel while it is open, and Close panel closes it in every chat as your own close does

## 0.2.245 · 20 November 2026
- An Open panel button now sits at the right end of the memory, processor and graphics line above the prompt: when the Claudopus panel is closed, a press opens it again in every chat, and when it is open, a press does nothing

## 0.2.244 · 20 November 2026
- Each time the Claudopus panel closes, Claudopus's log now says who closed it, and when it closed to follow a close in another chat, which chat that was. Your panel went away by itself on 20 Nov, and nothing then recorded why.

## 0.2.243 · 20 November 2026
- A task that hands in its result but still asks you something, such as whether to release, is no longer blue Delivered: it is a question on its card like any other, yellow at the top, with its buttons (such as Release it and Don't release, or Yes and No) and Answer in words, and your answer starts it again. It turns Delivered only once nothing is left for you to answer

## 0.2.242 · 20 November 2026
- A task's Details lists the messages you sent it above its Message box, numbered in the order you sent them, each saying "Not read yet" or when the task read it, and whether it repeats an earlier one or stopped the task to be sent.
- While a message waits, Details says what the task is doing meanwhile and how long its current step has run, so you can tell when Stop and send is worth it.
- Stop and send gives the task every message it hasn't read yet in the order you sent them, where before the newest one reached it first.
- The card's line says "not read yet" under your message until the task reads it, then "read"; Details no longer shows your message a second time at its top.
- In a task's conversation your words say when you sent them and when the task read them, where "not yet answered" stood even after the task had answered.

## 0.2.241 · 20 November 2026
- Results opens again with many results: Earlier and Archived now unfold 50 at a time, with Show 50 more under them, instead of every result at once, which was more than the app could draw.

## 0.2.240 · 19 November 2026
- When you press Message on a card right after typing in its Details box, the box above the chat now opens at once. Before, it could wait up to half a minute.

## 0.2.239 · 19 November 2026
- On Linux, stopping a command a task runs now ends everything that command started, not only its first shell.
- Claudopus's own tests pass again on GitHub's slower Linux and Mac machines, so a red check there now means something is really broken.

## 0.2.238 · 19 November 2026
- A task's Details tab with a lot in it, such as many helpers and ended commands, no longer stays on "Nothing to show yet": it is drawn with its ended commands folded and fewer lines of its conversation, so the app draws it.
- A tab that still holds more than the app can draw at once, or whose drawing fails, says so in plain words, with Back to the list.

## 0.2.237 · 19 November 2026
- A cloud job that sends nothing back is no longer called idle. Its row says `Nothing back from the cloud yet · started 48m ago · still waiting on the cloud machine`, and its log tab says the same in a sentence.
- A task whose cloud job is silent for a minute is told to bring the job's own output back while it runs: its log from the first line, its state (queued, starting, running), its progress, and about once a minute how busy its machine is. That output then shows in the job's row and in its log tab. Tasks are told to start cloud jobs this way from the outset.

## 0.2.236 · 19 November 2026
- Once you answer a permission in words, its buttons go and the card shows one grey line of your words while the task answers. Allow and Don't allow come back with the task's answer, inside the permission, and the grey line goes then.

## 0.2.235 · 19 November 2026
- A Claude artifact a task or its helpers publish shows first on the task's card, under the title it was published with and with its own icon. Pressing it opens Claude Code's artifact pane beside the chat, or your browser where the app can't.
- A link a result gives only to try something, such as an address with a query or an API address, no longer shows as something the task made.

## 0.2.234 · 19 November 2026
- The claudopus.ai pages now count visits without cookies, and the privacy page says so

## 0.2.233 · 19 November 2026
- claudopus.ai now tells search engines and AI assistants (ChatGPT, Claude, Perplexity, Google and others) plainly that they may read it, and gives them a short plain-text description of Claudopus with its GitHub link at claudopus.ai/llms.txt, so they can find it and name it correctly.

## 0.2.232 · 19 November 2026
- Every permission on a task's card (an admin command, a release, a change to your files, a command Claude Code blocked) has Answer in words. Your words go to the task, which answers inside that permission; the permission stays until you press Allow or Don't allow, and words never allow anything.
- A release permission says what it puts on main: Claude's one line on what it changes and why, the subjects of its commits, and how many commits and files, not only the branch and folder.

## 0.2.231 · 19 November 2026
- When you answer a question on a card, the card closes up at once under the grey line of your answer. No empty space is left under it or under the list, scrolled or not, by a button, Answer in words, Allow or Release it.

## 0.2.230 · 19 November 2026
- Claudopus now cleans up what tasks leave behind, every ten minutes and when a task stops. That covers the copies Chrome makes of itself, browser profiles, leftover temporary folders, task scratch folders untouched for two days, and code copies whose work is merged. Pictures a result shows are moved into the result's folder first. Your CT data, photos, videos and Desktop are never touched.
- When your disk has less than 20 GB left, the panel says so at its top and you get one notification. Free up space cleans up at once and also clears the download caches.
- Below 5 GB, tasks' downloads, installs, builds, renders and browser commands wait, so a task can't fill the disk.
- Tasks no longer start your own Google Chrome without a window. Each start left a copy of the whole app behind, and 205 had piled up.
- Claudopus's catch-up of past chats no longer leaves a scratch folder behind when it's stopped. Those folders had grown to 9.7 GB.

## 0.2.229 · 19 November 2026
- When you answer a question in words, Attach and Paste sit under the box. Attach picks files of any kind, and Paste takes the picture or files you copied. The task gets each one with how to open it.
- What you attach shows as tiles, the same as a task's files in its Details: a preview of a picture, video, PDF or document, else an icon for its kind. A press on a name opens the file, and its ✕ takes it off before you send.
- Paste is under Message and Reply too, and Message on a result can take files as well.

## 0.2.228 · 19 November 2026
- A press on a question right after the cards above it moved does nothing, and the question says "This moved as you pressed, so nothing was sent. Press again." Before, the button that slid under your pointer was pressed instead, so an answer in words could go to another task.

## 0.2.227 · 19 November 2026
- A task's card keeps everything it made for its whole life, however often it starts again: the pages and documents each of its results named, its pictures, and its changed files, even once a worktree they were in is taken away.
- Pull requests, issues, releases and published pages show on the card wherever a result names them, as in a table, each by its repo and number, such as clipify #70, and one a command opened is there even when the result names it only by its number.
- More than eight things on a card end in a "N more" you can press, which opens the task's Details with all of them.

## 0.2.226 · 19 November 2026
- Cards stand by colour: what waits for you (yellow) on top, then what was delivered (blue), then what works (purple). A card you just answered goes at once to its place among the working, under every blue card, instead of staying up with what waits.
- A workflow that finishes stays where it was, green, for its two seconds, instead of jumping to the top.

## 0.2.225 · 19 November 2026
- The empty space under your answer on a card now closes after three seconds, also while you keep using a panel that is scrolled down. Before, it could stay until you left the panel alone.
- That space is never taller than the panel's visible height.

## 0.2.224 · 19 November 2026
- Each command a task runs now has a clear name in plain words, such as "Test · Score smoothed heads against the 47 test films" instead of "Run: score". A small fast model (Haiku 5.5) writes it as the command starts, from the command, the task's own words for it and the end of its log.
- A command's second line says what it is doing now in plain words, from its log, beside how far it is, and a command that runs in the cloud says so.
- A failed command says why under its name in Details and in its log, such as "Ran out of memory while loading the films".
- Keys, tokens, passwords, emails and your name in folders are hidden before anything is sent to the model. Where the model gives no answer, a command keeps the name its task gave it.

## 0.2.223 · 19 November 2026
- The square outline on a card is thinner now, and the question block has room inside it above and below its words.

## 0.2.222 · 19 November 2026
- The line beside a working task's three dots now only says what the task itself is doing. When a command you allowed on its card ends, that line keeps the task's own words: the command's end is a grey line where it ran for a minute, and a row under the card's ended commands.
- Before a task writes its first note, that line says what it is doing right now, such as Reading files, instead of Starting or Working.
- A task whose card hasn't said what it's doing for three minutes is asked to say it at its next step.

## 0.2.221 · 19 November 2026
- A card's outline, such as the green one on Mark as done, now has square corners, so the to-do bar on its left edge sits flush inside it instead of sticking out past a rounded corner.

## 0.2.220 · 19 November 2026
- A card that waits for you is always above every card that only works. A card you just answered goes under all that still waits, instead of keeping its old place above them.

## 0.2.219 · 19 November 2026
- An ended command is named by its own words, whole. In 0.2.216 a command kept from before that version had its words cut to two, such as "Testing the" and "Run the".
- A command that failed no longer keeps a red row on its card among what still runs, and the closing row no longer names it: it says `5 commands ended · 1 failed`. Which one, how and why is in Details and its log.
- A full count on a command that still runs says only `12 of 12 heads · still running`, without the script's last words after it.

## 0.2.218 · 19 November 2026
- Once you answer a question on a card, in words too, the question goes at once. One grey line says what you answered, cut to one row, and pressing it opens the task's Details, where the question and your answer are whole.
- After a press on a card, the space the question took stays empty for three seconds under that line, so nothing below slides up under the pointer.

## 0.2.217 · 19 November 2026
- A task's changed files are now a list you can open: press "3 changed files" on its card, and its Details lists each file by kind (code, then documents) in lined-up columns, with an icon, its folder, its counts and a bar of the lines added and removed
- A press on a file in that list shows it in the app's Files pane beside the chat; in the terminal, or for a file the app can't show, what changed in it opens in a tab of the panel

## 0.2.216 · 19 November 2026
- In Details, the commands a task or helper ran that have ended are a group under the one that started them, headed by a row that says how many ended and how many failed, instead of a flat list under Commands ended. A press on that row folds them away.
- An ended command is named as it was while it ran, never by its shell line.
- A press on any ended command opens its log in a tab of the panel, including commands that ended before this version.
- A watch named by another verb, such as Check, leads with Watch again.

## 0.2.215 · 19 November 2026
- Config is shorter: your name, your principles, when a task ends, the models, the second check and updates are in sight, and what you rarely change is under More.
- Sound and Notifications are one choice, When a task ends: sound and notification, notification only, sound only, or nothing.
- Fable 5.2 tasks is gone: Heavy tasks has Same as most tasks, which keeps Fable 5.2 for when you name it, and Most tasks can be Fable 5.2. Your saved choices still count.
- Admin commands and the commands you always allow are one row, and Open file is beside Cancel once you press Edit.

## 0.2.214 · 19 November 2026
- Mark as done takes the card's buttons away the moment you press it, so you can't press them twice; the card keeps its size through its green moment, so nothing moves under the pointer.

## 0.2.213 · 19 November 2026
- A press on a command's name opens its log in a tab of the panel instead of the Terminal app: what the command is, how it stands, Stop, and the end of what it wrote, drawn again as it writes. It works for a command that has ended too, on its card and under Commands ended in Details.
- A command that has written nothing for a minute says whether its programs still use the processor: `still busy`, or in amber `idle`. Tasks are told the same, and to write logs a person can follow: a line as each stage starts and what came out at the end.
- A count that is full while the command still runs no longer shows 100%, which read as done: its row says `7 of 7 heads · still running`. Tasks are told to count what has finished, never what has started.
- A command that failed keeps a row on its card, in red, with how long it ran and why (the last line it wrote that names a fault), until it is run again and finishes. The closing row names what else did not finish, and a helper that failed, instead of a bare count.
- More kinds of command are told apart: an upload has an up arrow, a command that runs on another computer (ssh, a cloud job, a cluster) a hollow square, and a command named by its own verb says it while it has nothing else to say (Building, Testing, Rendering). The row for commands folded away is a grey square that opens Details.
- Details no longer repeats a command's last lines under its row.

## 0.2.212 · 19 November 2026
- Buttons in the panel, such as Close and Mark as done, answer on the first click again while your Mac is busy: after a scroll the panel no longer starts a new drawing for every change, up to dozens at once, but makes one at a time and keeps the one on screen meanwhile.

## 0.2.211 · 19 November 2026
- Mark as done always shows its green moment, with the happy octopus and the chime, even when the panel is slow to draw, as it is right after an update: its two seconds now start when you first see the card turn green, not at the press.
- Through that moment the card keeps its shape and its presses, which do nothing then, so a second click can't land on another button or link; a second press on Mark as done changes nothing.
- A card marked done during the update's moment shows the happy octopus instead of the update's blue one.

## 0.2.210 · 19 November 2026
- A card no longer flickers between an older and a newer look after you press a button on it, such as Release it: once the panel has shown a card as it is now, it never shows it as it was before.
- The same holds for the tabs and for the bar above the chat box.

## 0.2.209 · 19 November 2026
- Delivered cards now stand at the top of the panel, the newest first, above the tasks still working and under anything that waits for you.
- Mark as done turns the card green where it stands, outlined, with the happy octopus, for two seconds; then it goes under Finished.

## 0.2.208 · 19 November 2026
- A task that hands in its result is now Delivered, in blue, instead of Done: the result is yours to look at, and you may still give feedback. Only your press on Mark as done turns its card green and puts it under Finished.
- A delivered card has its two presses at its bottom, Reply (Give feedback when it asks nothing) and Mark as done, and none at its top right. Reply opens the box above the chat, and what you send puts the same task back to work.
- What a task's result leaves open is listed on its delivered card as numbered lines, and one reply answers them all.
- The panel's top line counts what is delivered, in blue.

## 0.2.207 · 19 November 2026
- A task's Details has a box at its bottom to write to that task, whether it works or has finished: the same message as the box Message opens above the chat.
- Under both boxes: Send, which the task reads at its next step, and, while it works, Stop and send, which stops what it is doing, with its commands and helpers, and starts it again with your message.
- Attach opens the file picker: pictures, videos and any file go with the message, and the task opens each one, taking stills from a video. A file's path typed or dropped into the box in a terminal goes as a file too.

## 0.2.206 · 19 November 2026
- Everything that waits for you is one block, the same on the card, in Details and at the top of the panel: a small label (Permission, Question, Password or Key), the question in amber, what it is about, the command whole, and the buttons.
- The buttons are Allow and Don't allow for a permission, Type it for a password, Paste it and Don't give it for a key, and for a question the task's own buttons with Answer in words. No Done, Yes or No is added.
- After a press the block goes at once and one grey line says what you pressed. No green box follows it.
- Typing happens in one box above the chat: an answer in words, a key, a password, and a change to a finished task or a result. Nothing is put into the chat's own box.
- A result asks nothing. Questions an older result left are shown as plain text.
- Release it is one press: it answers the task and allows that one release, with no second box. A release nobody pressed for is still asked.
- Every button on a question is an answer that carries the task on. There is no Not now: a question you do not press stays open.
- Every card of a task that works or has finished has a quiet Message button: what you write goes straight to that task, not through the chat. A finished card also has Dismiss, which sends nothing. A result has the same Message box.
- An answer reaches its task from your press alone, with no timer behind it.
- A task's card has five stages, each with one colour: Working (purple), Waiting for you (amber), Done (green), Stopped (grey) and Failed (red, saying why). Amber means only that something waits for you.
- A task is Done only when it hands in its result with every to-do ticked or dropped and none of its commands running. A server it leaves for you keeps its row under the Done card, with Stop.
- A task that ends without its result, or whose app closed while it worked, is Failed and says why, with Start again. Nothing starts a task again by itself.
- A task may not stop with to-dos open and nothing running: it carries on, asks you, or hands in its result after dropping what it won't do.
- Every command a task runs has a row with what it does, how long it has run, how far it is and Stop. Commands that would run out of sight are refused, and so are guessed times.
- A task waiting for something far away runs a watch, shown as a row.
- The chat no longer writes "No response requested." when a paused task's notice arrives.
- The header counts tasks by stage: waiting for you, working.
- A card that has ended stays where it is until you press Dismiss: nothing else moves it under Finished. A Done card says `✓ Done` and the task's last note, and offers Message and Dismiss.
- When you carry on from what a task made, your words go to that same task, which works again on the same card. A second task is only for a new job.
- A helper's result goes only to the task that started it, and no longer appears in the chat.
- A helper's to-dos stay on its own row, not on its task's list.
- A row shows a time left only when the command itself prints one.
- A card's line about its model no longer names Claude Code or Claudopus.
- The chat hands every change to a task again. The Short requests setting is gone from Config.
- A change to the rules, the models or the second check reaches new chats and new tasks. A chat or task that is already open keeps what it started with.

## 0.2.205 · 18 November 2026
- A task that finished before the update, or that Claudopus already released for you, no longer comes back to the top as Not done because a to-do was left unticked.
- A card being released stays purple from your Release it until the release has finished, its line saying Claudopus is releasing it. It turns green and Done once, at the end, with the release's to-do ticked. A release that fails starts the task again, and the card never shows Done in between.
- A task that hands back its result while its own command still runs stays purple from that moment. It no longer flashes green before Claudopus sees the command.
- Dismiss moves the card under Finished in the drawing right after your press, even while you scroll the panel. Not now and the answer buttons respond just as fast.
- A card's top row shows only the model, how full it is, its to-dos and its time. How a task ended (Done, Not done, Stopped, Failed) begins the line under it instead.

## 0.2.204 · 18 November 2026
- A find in your Downloads folder no longer shows on the card as a download.

## 0.2.203 · 18 November 2026
- A task's card shows only its stage, the to-do it is on and its own last note: lines such as "Next to-do 6 of 10", "Waiting for a command to finish", "Interrupted at 16:08 when the chat stopped · running again since 16:09" and "Claudopus starts Claude again at 18:02" are gone

## 0.2.202 · 18 November 2026
- A card says Done only when the task finished everything: its result is in, every to-do is ticked or dropped, and no command or helper of its own still runs. Until then it stays purple and says what it waits for, or says Not done in amber with how many to-dos are done.
- A finished task whose result asks you something more is green and Done, at the top with its question, until you answer or dismiss it.
- A task that ended where Claudopus could not see it, with to-dos left, is started again to finish them instead of going green.
- A command that another task started no longer shows up under a task that happened to run a command at the same moment.
- Your answer on a finished task's question goes to that same task, which carries on with it.
- Dismiss on any finished, stopped or waiting card puts it away as done.
- A press on an answer or on Not now shows at once.
- A Done card has Change something beside Dismiss: you type what to change above the chat, and the same task carries on with it and finishes again.

## 0.2.201 · 18 November 2026
- The chat now does a short request itself (a change, a few fixes, a new part, a file to make, a push of its branch) in few steps. It starts a task only for a bigger request or one that runs long. Measured on 245 test chats, this scored higher than plain Claude Code, in less time and at lower cost.
- No second helper checks the work, and Claude makes no picture after picture, unless you ask. Config's **Second check** now starts at **Only when I ask**. If you want every change checked as before, choose it there.
- A task gets your words with nothing added, works in few steps, and fixes what would leave the result unusable instead of only telling you.
- A result is text you read in the chat. A picture is for what you must see, never for a page of text.
- Config has a new choice, **Short requests**: **The chat itself**, or **A task each**, which is how it was before.
- The chat can't push to main, change Claudopus's own code where your chats run it, or run an admin command without your press, the same as a task.
- The principles Claudopus starts with say the same. If you have your own copy, it stays as you wrote it.

## 0.2.200 · 18 November 2026
- A finished task whose result asks you something now shows as Waiting for you: its card stays at the top in amber with the first question and its answers, the header counts each question, and it goes under Finished only once you've answered them all.
- A task that asks you something in its result without recording it as waiting on you is told to record it before its result goes through, so its question shows on its card.

## 0.2.199 · 18 November 2026
- A task's card now shows an icon beside each thing the task made, as designed: the app had been leaving every icon out

## 0.2.198 · 18 November 2026
- A task that Claudopus starts again by itself now stays where Claudopus can see it. This covers a task that stopped partway, one cut off when the chat stopped, one started to look at its helpers or commands, and one started with your answer. Before, a task started again a moment after it stopped could run unseen: its to-dos, notes and questions never reached its card, nothing kept it going, and its card could say Done with nothing built and no result.

## 0.2.197 · 18 November 2026
- A task's card now shows what the task made, right under its title: an icon and a word or two for each file, side by side. Press a file to open it. It shows while the task still works.
- A task's Details and its result start with a Files part: a tile for each thing the task made, with a small preview. Three or more of a kind are one tile, such as "7 pictures", that opens out on a press.
- Code a task changed is one tile: how many files, and how many lines it added and took away. The lines themselves are never shown.
- A result's pictures are now among its Files tiles, in place of the Pictures part that showed one at a time.

## 0.2.196 · 18 November 2026
- Recall now finds every chat: Claudopus saves the words of chats it never saved itself (older chats, chats a program started), 10 to 20 minutes after they go quiet.
- Messages a program, a schedule or a channel sent are saved too, marked with where they came from.
- Recall now also finds what each chat's helpers were asked and reported, what connected tools such as SBOS returned, and the documents a chat wrote.
- Keys and passwords are hidden in the chats, asks and pastes Claudopus saves, including those saved before.

## 0.2.195 · 18 November 2026
- A task's card shows Done only once Claudopus has its result. Commands ending, helpers finishing or Claude Code ending the task's run no longer make it Done, and you no longer get a notification that it's done before its result comes.
- A task that stops with to-dos left while only a server it left running is still going is started again to carry on, instead of sitting there.
- While a task waits for its own commands or helpers, its card says so, for example "Waiting for its helper".

## 0.2.194 · 18 November 2026
- Update works again when your chats run Claudopus from a copy of its code that a task switched to a released version. Update moves that copy to the newest version and back onto main.
- A task or its helper can no longer switch, reset or commit in the copy of Claudopus's code your chats run. Claude reads other versions without switching, and changes the code in a copy of its own.

## 0.2.193 · 18 November 2026
- A task that waits for hours on its own command, or on something that never comes, is no longer just marked stuck. If nothing has started it again, Claudopus starts it to check on what it's waiting for. The first check comes after the command's own expected time (at least half an hour after the task stopped). The next ones come after an hour, after two hours, and then every four hours. A task that finds it's stuck stops or fixes what's stuck, or sends what it has. Its card says "Claudopus asked Claude to check on what it waits for".
- A question or an Allow that waits on a card is no longer forgotten when you don't see the card. Claudopus notifies you again 15 minutes, an hour, four hours and twelve hours after it began waiting. Once an hour at most, the chat ends its next reply with one line naming the card that waits for you.
- When you write in the chat, it now sees what the latest task cards show: working, how many to-dos are done, what each is doing, and what waits for you. It answers how things stand from the cards, not from memory.
- The chat can now look at a topic's repo, or a folder inside its own, with `git -C <folder> log`, `status`, `diff` and the like. Before, these were refused when the repo wasn't the folder the chat was opened in, so the chat guessed. Other folders are still refused, because a repo's own settings can make git run a program.
- A task now does what you send it, as long as it can with what it already has, instead of sending it to the chat as "a new task of its own". It sends the chat only a request that has nothing to do with its work. It also no longer sends back the parts of your message that the chat already gave to another task.
- The chat no longer promises to do something later and then forgets. It starts the task now, set to wait for whatever it needs.

## 0.2.192 · 18 November 2026
- A task's result shows once in the chat, as the chat's own reply: Claudopus hands it to the chat itself, so Claude Code's grey "Report from subagent" box no longer appears above it.
- A task's question, a request to release or to run an admin command, and other news of a task now show only on its card and in the panel's notification, no longer as Claudopus lines in the chat.

## 0.2.191 · 18 November 2026
- A task no longer stops while its to-dos aren't done. When Claude tries to end with nothing of its own running that would start it again, Claudopus keeps it going right away and tells it what is still to do, so it carries on by itself instead of being started again later.
- Claude can't send a task's result while to-dos are left: Claudopus tells it which are left, so it does them or ticks them. What only you can do stays on the list, and Claude names it in the result.
- A task that ends with to-dos not done says which on its card, in amber, adds them to its result under "Not done", and the chat tells you they aren't done.
- A long message from Claude about how far it has got is no longer kept as the task's result while its to-dos aren't done.
- The rules tell Claude that ending a step only pauses a task, and to check that something of its own really runs before it does.

## 0.2.190 · 18 November 2026
- A task that's waiting on its helpers no longer writes "My command is still running…" three times in its chat every time it pauses. Claude Code still asks it for its result at each pause, and Claudopus now answers for it with a line the app doesn't show, without starting Claude.
- A task is no longer started again to check on its helpers while they are still working. Claudopus now also reads each helper's own record to see whether its commands bring back anything new. Helpers that really go quiet are still checked on, and the chat is still told.

## 0.2.189 · 18 November 2026
- After you press Run it, the task's card shows one quiet line, "Running your command" with how long it has run and Stop it, instead of the whole command in a box.
- The card no longer flashes while that command runs.

## 0.2.188 · 17 November 2026
- A task that stops partway, with no result, no question for you and nothing of its own that would start it again, is no longer shown as finished: Claudopus starts it again a moment later with a note to carry on, and its card says so. If it keeps stopping that way with little done in between, Claudopus stops after three tries and its card says so in one line.
- When a command a task left running ends while the task waits on its helpers, Claudopus now starts the task again. Before, the word that the command had ended was lost and the task sat still.
- When the app quits, restarts or drops a chat while tasks are at work, Claudopus starts those tasks and their helpers again when the chat comes back, as it already did for chats run from another Mac. Tasks you stopped stay stopped.

## 0.2.187 · 17 November 2026
- Claude can now put a file from your Mac into a page's upload box in the Claude app's browser, such as a video on TikTok, Instagram, YouTube or X, without you picking it in a file window.

## 0.2.186 · 17 November 2026
- The tree on a task's card no longer breaks under a helper that has a line of what it's doing: the line from the helper down to its own commands and helpers runs unbroken at every depth, in Details too, past a command's last lines

## 0.2.185 · 17 November 2026
- claudopus.ai asks before it counts visits: a small cookie banner offers Accept and Decline, and only Accept loads Microsoft Clarity. The footer's Cookies link changes the choice, and a new Privacy page says what Clarity records.

## 0.2.184 · 17 November 2026
- A helper's result goes to the task that started it, not to your chat: when that task has paused, Claudopus starts it first, so Claude Code hands the result to the task. No "Report from subagent" box in your chat, and no "Nothing needs you here." line.
- Should a helper's result still reach your chat, the chat no longer takes a turn for it.
- A task's question shows in your chat as one line; what it is about, its answers and pictures stay on its card.
- A command waiting for your Allow shows in your chat as one line.
- Your own answers, replies and taken-back answers on a card, a question a task took back, a task Claudopus restarted or asked to check on its helpers, and tasks started again after the chat dropped no longer show in your chat: the cards show them, and the chat still knows.

## 0.2.183 · 17 November 2026
- What waits for you stays at the top of the panel in the order it came: the oldest first, and a new one goes under it, so nothing you're about to press moves down.
- A key to paste or a permission that a task's own command asks for now sits inside that task's card. It no longer floats in a box above the cards.
- Once you allow something, the line saying so stays inside that task's card, not loose between the cards.
- After you answer, the card keeps its place while anything else still waits. Cards go back down once nothing waits.
- The bar above the chat always shows one line while anything waits: how many, and what the first one asks. Show takes the panel back to the top.
- On every question the main answer is the filled button, and Answer in words is the quiet one at the end.

## 0.2.182 · 17 November 2026
- When Claude Code refuses a task's command, its card now shows the command whole, where it would run and for how long at most, and a Run it button. Your press, and only your press, has Claudopus run exactly that command once, as a command you type in your terminal would run (your shell and its start files, without Claude Code's own settings). The card shows it running with what it last printed and a Stop it button; a command is stopped after 10 minutes at most, or an hour for one Claude would have run in the background. The task is told where the output goes and gets its last lines when it ends; a task that had ended is started again with them at the chat's next step, or at once when you press Send it to Claude now. Nothing about the task's own permissions changes, and the task never runs it itself.

## 0.2.181 · 17 November 2026
- Questions, allow boxes, key and password boxes and their notices now use the same plain words everywhere: a card asks "Release claudopus to main?", says "waiting for you", and after a press says who did what, such as "You allowed it. Claudopus is releasing it now."
- Config, Stats, Results, Memory, About, the Changelog and the update box use shorter, plainer words: each setting says what it does in a sentence or two, Stats explains tokens and prices in everyday words, and every update step names the version as v0.2.177.
- The update box and About say the same thing once a new version is in place: type /reload-plugins to use it.
- Every word Claudopus shows follows one short guide (docs/words.md): one word for each thing (task, helper, command, question, to-do, result), who does what in every sentence, one way to say each state (Working, Waiting for you, Done, Failed, Stopped), and the same forms for times and counts everywhere.
- A quiet command never says only "nothing printed for 29m" any more: its line keeps the last thing it said ("Last: 2 of 6 stills · nothing new for 29m"), says "No output yet" when it has shown nothing, and adds "Claude was told to check it" once Claudopus has told Claude.
- Each helper at work has a second line saying what it is doing now, in plain words ("Reading files", "Rendering the song stills · 4m", "Waiting for its commands"), in place of its token count.
- A command's time says "of about 5m", in amber once it runs past that; ended commands say "Done in 1m 05s", "Failed after 2m 05s" or "Stopped after 1m", with no exit codes.
- The panel's header says "2 tasks working" or "1 question waiting for you · 2 working", and how full the chat is as "This chat is 45% full"; cards say "45% full" in place of context and token figures.
- A task's card line says what Claude is doing now ("Reading files", "Rendering the song stills · 4m") instead of "Starting" until it writes a note; a helper quiet for minutes says what it did last and for how long.

## 0.2.180 · 17 November 2026
- The reply box above the chat no longer flashes blue or jumps while you type: it stays four lines tall and scrolls inside, and while you type in it, and for half a minute after your last letter, Claudopus redraws nothing else. A question, key box or admin box that newly needs you still shows at once.
- Send and Close sit a little below the box, so the Send button no longer covers the box's lower edge. The key box's response in the bar works the same way, and the card's own reply box (bar folded) is four lines with the same gap.

## 0.2.179 · 17 November 2026
- A release goes out within a minute of your press: it no longer waits up to 45 minutes for GitHub's tests, which now run after it and never hold it up. Each task runs every test once before it asks you to release.

## 0.2.178 · 17 November 2026
- The chat no longer shows a red "A hook blocked your prompt" card each time Claude Code tells it that a task is still at work or that a report already came. Such a notice now goes into the chat and ends its own turn at once with Claude Code's own "No response requested." line, without asking Claude and at no cost; one that comes while the chat is busy joins the turn already running.

## 0.2.177 · 17 November 2026
- A program a task's command left running is named on its card by what that command does, in the words Claude gave it, never by the program's own name: no more rows of "Run Google Chrome" for a test's hidden browser
- Everything one command left running is one row, with how many programs it is and their memory added up; Stop on it ends them all, and only once the last of them ends does the card say the command has ended, as one line under Commands ended, with its task told once
- A card no longer shows programs that started elsewhere at the moment its command ran: another chat's or another app's (such as a browser's crash reporter or Google's updater appearing during a git push), or what another task's background command in the same chat started

## 0.2.176 · 17 November 2026
- A task whose step ended while all its helpers sit silent (nothing new from them for 12 minutes, and no command of theirs that printed in the last 30 minutes) now follows a fixed schedule: at 12 minutes Claudopus starts it again to check on them, at 24 it asks it to hand back what it has, and at 36 the chat is told plainly that it is stuck and may send it a message. The schedule starts over only when a helper hands back a result or prints something new, and its steps come at least 12 minutes apart. A task waiting on something it asked Claudopus to look for is not nudged while that look runs.
- Once told to hand back, the task's report goes through even while its helpers run: silent helpers are stopped with it, and a helper still at work goes on, its later result reaching the chat with a note that it came late. A helper Claudopus stopped tells the chat nothing.
- Helpers at work, such as a render running in the background or a job printing a moving frame count, are never taken for silent, and the task's card says it waits on its helpers' work rather than that nothing moved.
- A wait for a file or a page now gives up after 15 minutes unless the task names another time, and never waits more than an hour. When it runs out, the task is started again and told to hand back what it has, and Claudopus does not look for the same file or page again.
- A task's card says by when Claudopus starts it again, even if what it waits for never comes.
- If Claudopus cannot start a waiting task again, the chat is told, so it can send the task a message instead of saying it is still in progress.
- When a task has made no progress and Claudopus does nothing about it, the chat may now send it a message asking what it waits on.
- A task flagged as making no progress is now always told to the chat, at the latest 36 minutes after it last moved, even while a helper of its looks busy. From then, Claudopus's word that the task still waits says the chat may send it a message.
- A task waiting on something it asked Claudopus to look for is no longer flagged as stuck while that look runs, as the look has its own end.
- The chat is no longer woken for Claude Code's notices that bring nothing new: a task still waiting on its own command with no report yet, or a task that ended its step to wait for its helpers or for something Claudopus starts it again for. On 16 Nov these were 67 of one chat's 152 turns in an evening, each answered "still in progress".
- A notice that says anything more still reaches the chat: a security warning, a report Claude Code refused, a limit a task stopped at, an agent's own words.
- A task waiting on its helpers no longer reads as ended without a report in one message and still at work in another: when Claude Code's notice reaches the chat, Claudopus's word that the task is still at work is in the same message, and Claudopus no longer sends that word on its own.
- A task whose helpers have really gone, or whose wait has run out, is no longer taken for waiting: Claude Code's word that it ended reaches the chat.
- A helper's result that reaches the chat because its task had ended its step now comes with Claudopus's note before it, so the chat no longer passes it on by hand.
- A helper that the engine still showed as running when it ended now has its result passed on to its task too.
- When Claudopus cannot pass a helper's result on, the chat is told to send it on itself.
- When a helper's result reached the chat and Claudopus then could not pass it on to its task (the task was stopped, held, finished or could not be written to), the chat is now told so, with the task's id, instead of being left thinking it was passed on.
- The chat is told a helper's result is passed on only once its hand-back went through; a refused hand-back no longer leaves that note.
- A helper's result is passed on to its task once, never twice when two looks find the same end, or when the same result ends again as failed or stopped.
- Claudopus's note that it did not pass a helper's result on, or that a result came late, now reaches the chat as Claudopus's own message, so the chat acts on it at once instead of at your next message. When the chat was told a result is passed on and its task had already handed back, the late note corrects that word instead of contradicting it.
- A call Claude Code refused a background task shows on its card only for Claude Code's own refusal, not for a failing command whose output holds the same words, and gives Claude Code's reason alone.
- That card now says what was refused, why, and that the task carries on without it, with one button, "Carry on without it", and room for your own words; the task is told not to reach the refused action by other means, and a task that has ended is not started again by it.
- The card never replaces a question put up on the same card meanwhile.
- Claudopus no longer changes a task's or a helper's call on its way, which auto mode refused ("a hook changed this call's input after auto mode reviewed it": 484 calls on 16 and 17 November). A command known to take minutes (its description says so, or it is a build, render, browser run or download with a long time limit), held open, is now refused with one line saying to send the same call with `run_in_background: true`; any other command, such as a push or a short test with a long time limit, runs as sent.
- The chat's own single command is refused the same way when it is not sent in the background, and each of the chat's refusals of a command's shape says so, so one try is enough. An agent named on an older model or on Haiku still starts on its family's newest, with its call left as written.
- The rules tell tasks and the chat to send such commands in the background from the start, so the refusal is rarely needed.
- When one chat's Claude Code process is only slow (not switched off), the watcher that brings Claudopus back no longer reloads Claudopus in every other chat again and again. It sees that chat's own copy beat again and leaves it alone: it tries only after 5 quiet minutes, until the chat has gone half an hour without a stall. On 16 Nov the old watcher reloaded three other chats eleven times in one night; replayed, the new one makes eight changes, six of them only after 5 quiet minutes.
- After an update, the watcher of the older version gives way to the new one, even where every version runs from the same folder, and the new one keeps the gap after the last change.
- The watcher's log is in UTC, as Claudopus's own log is. A long hold of Claude's helper, and a tab the app did not ask for after a load, now name their chat in the log, and long holds name the load's own reads, so the next switch-off or blank tab can be traced.
- The chat now runs a few more harmless one-liners itself instead of starting a task: opening a page of a server on this Mac, a folder, or a picture, PDF, page, text or video (also in a browser or viewer you name), showing a file in the Finder, and a status check of a server on this Mac with `curl -q` that only asks and saves nothing.
- The chat can show a local server's page in the browser pane itself, instead of a task doing it. Starting a server by its name stays a task's.
- When the chat cannot run one of these as written, its refusal says which form it can run.
- When a task's command is refused for touching your settings files, the refusal now says how to read them instead: the Read tool, cat or jq.
- A task's heavy command (a browser it drives for screenshots, a build, a video or 3D render) now waits its turn while the Mac is busy and another one runs, or while several have just started, so ten tasks no longer load one Mac at once. The task is told at once and stays free to do other work or read your messages; its card says it waits its turn and its place in line, and Claudopus starts the waiting tasks again in the order they came once the load falls, at the latest after 15 minutes, to send the command again.
- A heavy command still starts at once when nothing else heavy of the chat's runs, and Claudopus's own release and tests never wait.
- Config's Tasks band has a new choice, "Heavy commands wait their turn": when the Mac is busy (as shipped), only when it is overloaded, or never.
- Each task a chat starts gets a scratch folder of its own in the chat's scratchpad, so one task's script no longer replaces another's. A task that writes at the scratchpad's top is told to use its own folder instead.
- A task that writes into another running task's own scratch folder, or changes a file another running task changed in the last ten minutes, is stopped once and told whose it is; its next write there goes through.
- A task that starts changing files in the same checkout as another running task is told so, and to make a worktree of its own.
- When a task's own command fails, such as a build, whether held open or run in the background, with an error naming a file another running task changed lately in the same checkout, Claudopus tells that other task its change may have caused it, quoting the error, and tells the first task whose change it may be. A dev server that keeps running is not read for this.
- A command's own writes are seen only through its > redirects and tee; what cp, mv, curl -o or a script writes is not.
- A result's question that repeats the question a task asked on its card now stops waiting once you answer that card, whether you press its button, reply in your own words, or answer in the chat. Before, pressing Release it left the same question "waiting on you" in the results list, and the chat kept bringing it up. Taking the answer back opens the question again.
- When a task lists what still waits, its newer result takes the place of the questions its earlier results were waiting on, so old questions no longer pile up. When it lists nothing, its newer result takes over the questions still open instead of dropping them. A round that failed or was stopped changes nothing.
- When you answer a result's questions in the chat, the chat marks those questions answered by their numbers, so they no longer show as waiting.
- A result's question can have its own answers, such as "By hand" and "Leave them", instead of Yes and No. Every question also has "Answer in words", which puts a line about it in the chat box for you to finish. Sending that line with your words answers it.
- An answered question stays in view on its result with what you answered, or "you said not now".
- A Release it you press while the task is still finishing its turn is no longer lost when Claude Code refuses one of that task's calls in the same turn: the release still goes ahead as the turn ends, and if the turn was stopped or failed, your question comes back on the card to press again.
- When nothing was done on such a Release it (you stopped the task, it asked something else, or its turn failed), the same question in its results shows as waiting on you again, instead of as answered.
- When that question comes back on a card that showed Claude Code's refusal notice, the chat drops the notice and shows the question again, so an answer to the notice is not taken for an answer to the release.

## 0.2.175 · 17 November 2026
- The reply box above the chat is as wide as the bar and grows taller as you type, up to eight lines, like the chat's own box: Enter sends, Shift+Enter starts a new line, and Send and Close sit under it.
- The reply box no longer blinks while you type: it used to be drawn anew each time any task wrote its progress, which put the cursor back into a fresh box and replayed its outline.
- A key box's response and a card's own reply box are boxes of lines that grow the same way; a key is still pasted in one line.

## 0.2.174 · 17 November 2026
- When you press Release it seconds after a task asks, while it is still finishing, Claudopus now releases it after your allow box once the task has ended, as it does when you press later. Before, such a press reached only the task, which left the release to Claudopus, so nothing went out.

## 0.2.173 · 17 November 2026
- The panel and the bar above the prompt redraw themselves far less often with nothing new: when two requests for a drawing came together, each kept asking for another, in chains of up to 27 redraws, and every redraw made the hover under your pointer blink.

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
