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

Claudopus keeps itself up to date. Every hour one chat reads the version page on claudopus.ai (`https://www.claudopus.ai/version.json`), and when it names a version other than the one installed, asks Claude Code to fetch the newest release, as `/plugin` would. Every open chat then moves to the new version by itself, with Claude Code's own `/reload-plugins`, as soon as it has no turn of its own running; background work carries on through it. When a chat moves to a newer version, the octopus in the panel's header turns blue and jumps for five seconds, the header says "Claudopus updated" in blue and then the new version, and a short sound plays (once for each version on a Mac, however many chats move to it; the Config sound setting turns it off); then the header is as before. A chat looks for a newer installed copy every 20 seconds, reading Claude Code's own record of what is installed. To stay on the version you have, turn Automatic updates off in the Config tab. A copy loaded from a folder of its code (`--plugin-dir`) is never updated.

## What you see

- The mod is on in every chat you open from then on, in every folder.
- You send a message. The chat answers in one line and starts a background agent for it, then is free for your next message.
- The panel opens beside the chat by itself the first time work starts in that chat. Each piece of work is a card with a line saying where it stands; its title opens its Details, and its coloured edge is its to-dos, one part each, brighter as they are done. When a piece of work starts helpers of its own, they hang inside its card as a tree joined by lines: each is one slim row with a dot that is purple while it works and green once it finished, its name, its model, its context and its time, and a click on a row opens that helper's own Details. Helpers that have ended fold into one row, and the work's Details lists every one. Once it is open in one chat it opens in every chat on this Mac, including chats that start later. Close it in one chat and it closes in all of them, and new work does not bring it back until `/claudopus` opens it again. Right after you install, it opens once by itself with a welcome that offers to index your old chats.
- The panel lists the running work of every open chat on this Mac, each chat's cards under that chat's name, this chat's first. You can answer another chat's question from here, and the answer reaches that chat's work. Stop, the model choice and the full record stay in the chat that runs the work. Work that ends in another chat turns green there for a moment and then folds into Finished, as in its own chat. Work that leaves the file of a chat still open without a word of how it ended (a chat on an older version) turns green for that moment too, then is gone. With `macs` set, every panel on each of your Macs lists the same chats, from all of them, each marked with the Mac it runs on. A chat is listed only while it has something going on (running work, a question or a prompt); chats with nothing going on are not listed at all, however many are open, since the app's own list of chats has them. Press a listed chat's name to open that chat in the Claude app, as its sidebar does: a chat this Mac's app holds (one of this Mac's, or one it runs on another Mac over SSH) opens by the app's own link, any other by its Remote Control link when Remote Control is on in it. A chat of another Mac's own app with Remote Control off opens only there. In a chat your Mac's app runs on another Mac over SSH, a press on a name is left for your Mac, which opens that chat on your screen within about two seconds. Beside the name, the header shows the version this chat loaded (dim), and for the few seconds before the chat reloads, the newer one your Mac has already installed (read from Claude Code's own record), so chats on two Macs on different versions are told apart at a glance. The header's line counts every chat the panel lists, so it says what the cards under it say: what needs you first (in amber, the octopus amber too, though happy for the moment any work finishes), then what runs here and in other chats, then "Just finished" for a moment, else "Nothing is running".
- When work needs your hands, its card turns amber and rises to the top with what to do, any text to paste beside a Copy button (work asks you to type only a command it cannot run itself, given whole with its folder; on the Mac you sit at it also has Open in Terminal, which opens Terminal with it typed at the prompt in its folder, never run, and only when you press it; in a chat on another Mac there is no such button, and you type it in your own session to that Mac), and three ways to answer right there: the work's own buttons (or Done and Not now when it gave none), and a box to reply in your own words. Any answer clears the amber at once, the card says what you answered, and the work carries on from it at its next step; it turns amber again only if it asks again. An ask stays until you answer it, even after the work that made it has finished; then your answer starts that work again. The ask is also shown in the chat that started the work, as a notice from Claudopus with its answers and the paths of any pictures it is about (the chat shows the pictures in its next reply), never as a message in your place; answer there in your own words and the chat passes it to the work, which counts as an answer on the card. An answer pressed on the card is noted in the chat too. It also raises a notification with the amber octopus, from a second small app of the mod's, Claudopus Asks, and a short "needs you" sound (two quick notes, then a higher one) that is part of the notification, so macOS plays it as you set Claudopus Asks in System Settings, Notifications, and stays silent under a Focus that holds it back. One ask is heard once, and asks that arrive within five seconds of each other on one Mac are heard as one; the first one makes macOS ask you once to allow Claudopus Asks, and is heard by the mod's own chime while macOS asks.
- When a chat stops on the app's own prompt (allow a command or a tool, answer its question, approve its plan), the panel in every chat shows it in amber at the top, under that chat's name, in the prompt's own few words. It goes once the call it asked about ends or, for a command, as soon as the command is seen running. A prompt still open when the app itself says it is waiting, a few seconds on, raises a notification, as a question from work does. Wherever a press on its name opens that chat, Open that chat takes you there to answer it; the panel never answers a prompt itself.
- A short band above the prompt says what is being done right now.
- A message about work that is already running goes to that work as a steer instead of starting new work.
- When work finishes, its card turns green with the happy octopus for a moment, then the chat passes on its result and the panel lists it under Finished. Work that gave its report while something it started in the background still ran counts as finished when it is stopped after; work stopped or failed before that does not turn green. Work that ends while the mod reloads gets its green moment once the panel draws again. What the work left for you to read is listed under Results.
- Stats, beside Results, adds up what the work came to, for this chat or every chat with kept work, today or all time: tokens by model, work finished, to-dos done, your messages, the time saved by running work side by side, a timeline, what the tokens would cost at API prices, and what the memory holds.
- Memory, at the top of the panel, opens Finder at the folder where Claudopus keeps what it remembers.
- About, beside Memory, waves hello once, says what Claudopus is and shows its version and Claude Code's, the website, the licence and the GitHub repo.
- A finish plays a short quiet chime, and a notification, with the purple octopus, names the work and the first words of its result, so you hear and see it when you are elsewhere. It comes from Claudopus with its octopus icon, and clicking it opens that chat in the Claude app (in a terminal, it brings the terminal forward). The first one makes macOS ask you once to allow Claudopus notifications.
- When work needs an admin command, a box at the top of the panel asks you once for that Mac's password, the same in a chat on this Mac and one run from another Mac over SSH (what you type shows as you type it); it stays in this Mac's keychain and is never put in a chat, a command line, a file or a log. Once it is kept, every later admin command any agent runs on that Mac goes through without asking you again, until you remove it with `bin/admin <mac> --forget`. The chat that asked shows a notice naming only what is needed and brings the panel up; Cancel in the box ends the wait, and the work waits up to about 10 minutes for you. Only a run with no chat open on this Mac to draw a panel (a `claude -p` run) asks in a macOS dialog on this Mac's screen instead, and over SSH says that no panel is open.
- When work needs a key, token or password, a box at the top of the panel asks you once for it by name, in every chat; it stays in this Mac's keychain, work uses it as an environment variable, and the value is hidden where a command prints it by accident. A command that changes the value before printing it is not stopped, and the hook that refuses keychain reads catches the usual commands, not every way there is.
- Work changes a repo only in its own git worktree, on a branch of its own, and never pushes or merges to main itself: Claude Code refuses it (`git push` naming main or master, `gh pr merge`), and the repo's `pre-push` hook refuses a plain push of main from inside Claude Code. The one way there is `bin/release`, run from the work's worktree. When the work is built and checked it asks you whether to release it, with a Release it button; on your answer, on the card or typed in the chat, the work runs the release itself, and you never type it. On one Mac one release per repo runs at a time and the rest wait their turn (`release --status` says who is releasing); across Macs, a release whose push git refuses takes main again. It merges the work's branch onto main as it is now, numbers the version from main, makes the build's files again rather than merging them, refuses files the build left that the repo does not track, runs the repo's checks, then pushes main and the version's tag. When main and the branch changed the same lines it pushes nothing and names what landed on main, for the work to merge and run it again. A repo says how in a `.release` file: `NAME`, `VERSION_FILE` (a JSON file with `"version"`, or one holding only the number: main's number plus one, the rest of the file merged as any file), `DERIVED` (files the build makes), `BUILD`, `CHECK`, `AFTER` (run once pushed) and `MAIN` (else the remote's own default branch); main's own `.release` is the one used, so a branch cannot drop its checks, and `release.local` in the repo's git folder sets the same for one Mac. A repo without one releases with no version or checks, and a repo with no main yet gets the branch as its first main. When the remote refuses a push for another reason, such as a main that takes only pull requests, it says why and pushes nothing.
- `/servers` shows the local servers running on your machine and which chat started each.

The mod also adds a short set of working principles ([rules/CLAUDE.md](../rules/CLAUDE.md)) to every chat. They shape how Claude answers. They leave out what is one person's own call, such as when Claude may raise a concern or what counts as done; add yours, or change any of them, in the Config tab, and your copy is the one your chats carry.

The chat picks a model for each piece of work: Opus for most, Sonnet for long legwork, Fable only for heavy work. A check of finished work runs on Opus, or on Fable for work built on Fable, never on Sonnet. Your account needs access to the model it picks.

## Needs

- Claude Code 2.1.287 or newer in the terminal, or the desktop app 2.1.286 or newer. The panel draws in VS Code from 2.1.299.
- Does not work on Windows under WSL (plugins do not load there) or where your organization's admins block mods. In `claude -p` print mode and cloud sessions there is no panel.
- macOS only (12 or newer): the password and key boxes, the keychain, thumbnails and notifications use `osascript`, `security`, `sips`, `open` and two small apps of the mod's, `notifier/Claudopus.app` and `notifier/ClaudopusAsks.app`, which are copied to `~/Library/Application Support/Claudopus` on its first notification. If you turn Claudopus Asks off in System Settings, Notifications, what needs you comes as Claudopus, purple, with the mod's own chime instead of the notification's sound; if you turn Claudopus off, macOS's plain notification is used instead, which cannot show the icon or open the chat.
- Stats reads Claude's records with `jq`, which macOS 15 and later include.
- Seen working in the macOS desktop app. The terminal and VS Code have not been tried yet.

## Settings

The panel's Config tab lists everything you can set, shows what is in force, and puts each back to what shipped. Edit on the principles, the chat's rules or the work rules makes your own copy at the same path under `~/.claude/claudopus` (`rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md`); the mod uses your copy when there is one, and an update never touches it.

The settings are `~/.claude/claudopus/config.json`. Every key is optional:

```json
{
  "name": "Sam",
  "agents": true,
  "sound": true,
  "notifications": true,
  "updates": true,
  "models": { "work": "opus", "legwork": "sonnet", "heavy": "fable" },
  "macs": ["sam@other-mac.local"]
}
```

| Key | What it does |
| --- | --- |
| `name` | What the agents call you. Left out, they say "the person". |
| `agents` | `false` stops the handing over; every chat then does its own work again. |
| `sound` | `false` silences the short chime played when work is ready, and the "needs you" sound of a notification that work needs you. |
| `notifications` | `false` stops the notification that names work when it is ready, stopped or failed. |
| `updates` | `false` stops Claudopus updating itself; it stays on the version you have until you update it with `/plugin`. |
| `models` | Which model runs most work, long legwork and helpers, and heavy work (`opus`, `sonnet`, `fable` or `haiku`). Checks of finished work run on the most-work or heavy-work model, never on legwork's. |
| `macs` | Up to four other Macs, as `user@host` or a `Host` of `~/.ssh/config`, that this Mac's panel lists the chats of. It uses your own SSH, which must log in without asking; each Mac needs Claudopus of this version or newer. That Mac's panels list this Mac's chats in turn, with nothing to set there: each visit hands it this Mac's chats and brings back the answers pressed there for them. Results are kept the same on both, about every two minutes: each Mac gets the results it lacks, with paths moved onto its own home, and what you did to a result (archived, brought back, answered) reaches the other; nothing is deleted or overwritten. |

`name`, `agents` and `macs` are read when a chat starts; `sound` and `notifications` each time work ends or needs you; `updates` before each look for a new version.

## Turn it off

```
/plugin disable claudopus@claudopus
```

`/plugin enable claudopus@claudopus` turns it back on; `/plugin uninstall claudopus@claudopus` removes it. Your memory folder is left in place.

## Memory

Everything the mod keeps is in `~/.claude/claudopus`, as plain files:

| Path | What it holds |
| --- | --- |
| `index.md` | The subjects of your work, one line each |
| `streams/` | One brief per subject |
| `words/` | Your messages, word for word, and Claude's answers, one file per chat |
| `asks/` | What you asked in each chat and what was done, one file per chat |
| `reports/` | What finished work left for you, one dated folder each, with copies of the pictures it named and small thumbnails |
| `finished/` | The Finished list of each chat |
| `flows/` | Each workflow run the panel follows |
| `pastes/` | A message over 12,000 characters, kept here while the chat gets its start, its end and this path |
| `stats/`, `thumbs/` | Sums Stats made of Claude Code's records, and small copies of pictures shown in the panel |
| `servers.json` | The servers `/servers` last saw |
| `config.json` | Your settings, written by the Config tab |
| `welcome.json` | Whether the first-run welcome still shows |
| `panel.json` | Whether you last opened or closed the panel, which every chat follows |
| `live/` | Each open chat's running work and its Remote Control and app ids, rewritten at least every 20 seconds, for the other chats' panels and the panels of other Macs; answers left for a chat from another panel; and, with `macs`, what was last fetched from each of those Macs; on a Mac named by another, the chats that Mac handed over (`live/pushed/`) and the answers waiting for it (`live/outbox/`). A chat removes its own file when it closes |
| `rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md` | Your own copies of the three texts, written only when you edit or save one in the Config tab; Reset moves your copy aside as `.old` |
| `update.json`, `reloads/` | What the last look for a new version found, and each chat's last reload to a newer installed version, so none reloads twice for the same one within ten minutes |
| `log.md` | The mod's own log |

Delete the folder to start over. The mod writes nowhere else: no build, start-up or settings file of Claude Code or your projects.
