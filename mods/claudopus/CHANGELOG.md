# Changelog

What changed in each version of Claudopus, newest first.

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
