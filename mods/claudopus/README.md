<picture>
  <source media="(prefers-color-scheme: dark)" srcset="art/banner-dark.png">
  <img alt="Claudopus: ask Claude for many things at once. A mod for Claude Code." src="art/banner-light.png" width="880">
</picture>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#what-you-see">What you see</a> ·
  <a href="#settings">Settings</a> ·
  <a href="#memory">Memory</a> ·
  <a href="#privacy">Privacy</a> ·
  <a href="https://www.claudopus.ai">claudopus.ai</a>
</p>

A mod for Claude Code. Each chat hands its work to background agents, so you keep talking while the work runs.
A panel beside the chat shows each piece of work with its to-dos, and an octopus moves while anything runs.
Your messages, the results and a brief per subject are kept in a memory folder, so chats can stay small.

![A chat beside the Claudopus panel: three asks become three cards, one stops to ask a question, one finishes green and the octopus cheers](art/panel.gif)

<p align="center"><em>The panel, redrawn. The jobs are made up.</em></p>

## Install

**In a terminal**, at the Claude Code prompt:

```
/plugin marketplace add dimka3553/claudopus
/plugin install claudopus@claudopus
```

- Answer `y` to add the marketplace, then pick the user scope (the first one, Enter).
- If the short form fails over SSH, use `https://github.com/dimka3553/claudopus.git` in its place.
- From a shell, the same two steps are `claude plugin marketplace add dimka3553/claudopus` and `claude plugin install claudopus@claudopus`.

**In the Claude desktop app**: click + next to the prompt box, then Plugins, Add marketplace with `dimka3553/claudopus`, then add the plugin `claudopus`.

That is all. Nothing has to be typed in each chat.

## What you see

- The mod is on in every chat you open from then on, in every folder.
- You send a message. The chat answers in one line and starts a background agent for it, then is free for your next message.
- The panel opens beside the chat by itself the first time work starts in that chat. Each piece of work is a card with its to-dos and a line saying where it stands. Once it is open in one chat it opens in every chat on this Mac, including chats that start later. Close it in one chat and it closes in all of them, and new work does not bring it back until `/claudopus` opens it again. Right after you install, it opens once by itself with a welcome that offers to index your old chats.
- The panel lists the running work of every open chat on this Mac, each chat's cards under that chat's name, this chat's first. You can answer another chat's question from here, and the answer reaches that chat's work. Stop, the model choice and the full record stay in the chat that runs the work. Work that ends in another chat turns green there for a moment and then folds into Finished, as in its own chat. With `macs` set, every panel on each of your Macs lists the same chats, from all of them, each marked with the Mac it runs on. A chat is listed only while it has something going on (running work, a question or a prompt); chats with nothing going on are not listed at all, however many are open, since the app's own list of chats has them. Press a listed chat's name to open that chat in the Claude app: by its Remote Control link when Remote Control is on in it, which works for a chat on another Mac too, else, for a chat on this Mac, by the app's own link. A chat on another Mac with Remote Control off opens only there.
- When a chat stops on the app's own prompt (allow a command or a tool, answer its question, approve its plan), the panel in every chat shows it in amber at the top, under that chat's name, in the prompt's own few words. It goes once the call it asked about ends or, for a command, as soon as the command is seen running. A prompt still open when the app itself says it is waiting, a few seconds on, raises a notification, as a question from work does. For a chat on this Mac, or on another Mac with Remote Control on in it, Open that chat takes you there to answer it; the panel never answers a prompt itself.
- A short band above the prompt says what is being done right now.
- A message about work that is already running goes to that work as a steer instead of starting new work.
- When work finishes, the chat passes on its result, and the panel lists it under Finished. What the work left for you to read is listed under Results.
- Stats, beside Results, adds up what the work came to, for this chat or every chat with kept work, today or all time: tokens by model, work finished, to-dos done, your messages, the time saved by running work side by side, a timeline, what the tokens would cost at API prices, and what the memory holds.
- Memory, at the top of the panel, opens Finder at the folder where Claudopus keeps what it remembers.
- About, beside Memory, waves hello once, says what Claudopus is and shows its version and Claude Code's, the website, the licence and the GitHub repo.
- A finish plays a short quiet chime, and a notification names the work and the first words of its result, so you hear and see it when you are elsewhere. It comes from Claudopus with its octopus icon, and clicking it opens that chat in the Claude app (in a terminal, it brings the terminal forward). The first one makes macOS ask you once to allow Claudopus notifications.
- When work needs an admin command, a box asks you once for that Mac's password, hiding what you type; it stays in this Mac's keychain and is never put in a chat, a command line, a file or a log. Once it is kept, every later admin command any agent runs on that Mac goes through without asking you again, until you remove it with `bin/admin <mac> --forget`.
- When work needs a key, token or password, a box asks you once for it by name, hiding what you type; it stays in this Mac's keychain, work uses it as an environment variable, and the value is hidden where a command prints it by accident. A command that changes the value before printing it is not stopped, and the hook that refuses keychain reads catches the usual commands, not every way there is.
- `/servers` shows the local servers running on your machine and which chat started each.

The mod also adds a short set of working principles ([rules/CLAUDE.md](rules/CLAUDE.md)) to every chat. They shape how Claude answers; change them to fit you in the Config tab.

The chat picks a model for each piece of work: Opus for most, Sonnet for long legwork, Fable only for heavy work. Your account needs access to the model it picks.

## Needs

- Claude Code 2.1.287 or newer in the terminal, or the desktop app 2.1.286 or newer. The panel draws in VS Code from 2.1.299.
- Does not work on Windows under WSL (plugins do not load there) or where your organization's admins block mods. In `claude -p` print mode and cloud sessions there is no panel.
- macOS only (12 or newer): the password and key boxes, the keychain, thumbnails and notifications use `osascript`, `security`, `sips`, `open` and a small app of the mod's, `notifier/Claudopus.app`, which is copied to `~/Library/Application Support/Claudopus` on its first notification. If you turn Claudopus off in System Settings, Notifications, macOS's plain notification is used instead, which cannot show the icon or open the chat.
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
  "models": { "work": "opus", "legwork": "sonnet", "heavy": "fable" },
  "macs": ["sam@other-mac.local"]
}
```

| Key | What it does |
| --- | --- |
| `name` | What the agents call you. Left out, they say "the person". |
| `agents` | `false` stops the handing over; every chat then does its own work again. |
| `sound` | `false` silences the short chime played when work is ready. |
| `notifications` | `false` stops the notification that names work when it is ready, stopped or failed. |
| `models` | Which model runs most work, long legwork and helpers, and heavy work (`opus`, `sonnet`, `fable` or `haiku`). |
| `macs` | Up to four other Macs, as `user@host` or a `Host` of `~/.ssh/config`, that this Mac's panel lists the chats of. It uses your own SSH, which must log in without asking; each Mac needs Claudopus of this version or newer. That Mac's panels list this Mac's chats in turn, with nothing to set there: each visit hands it this Mac's chats and brings back the answers pressed there for them. |

`name`, `agents` and `macs` are read when a chat starts; `sound` and `notifications` each time work ends.

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
| `log.md` | The mod's own log |

Delete the folder to start over. The mod writes nowhere else: no build, start-up or settings file of Claude Code or your projects.

## Privacy

- **What it keeps.** The files listed under [Memory](#memory), in `~/.claude/claudopus` on your own machine; delete the folder and they are gone. Passwords and keys you type in its boxes are kept in this Mac's keychain instead, and stay there until you remove them.
- **What it sends.** Only to Claude, through Claude Code: the texts it adds to prompts (its rules, your subjects, briefs and results not yet passed on), and after each reply one short call with the start of your message and of the reply, to title the chat and note what was asked and done. With `macs` set, to those Macs only, over your own SSH: it reads their open chats and their work, hands them this Mac's, and leaves your answers there. No telemetry, no other network calls of its own.
- **Keys and passwords.** What you type in its password and key boxes stays in this Mac's keychain and is used only for the commands work runs, on this Mac or over SSH to the host named. [What you see](#what-you-see) says what that allows and where the hiding stops.

The full account is below.

## What it does, for the plugin directory

Everything stays on your machine, apart from what Claude Code itself sends to Claude.

### What it sends, and where

After each reply, one short call through Claude Code (`$.model.complete`, Sonnet) sends the start of your message and of the reply to Claude, to title the chat and note what was asked and done. It sets that title, and reads the chat's own id, through the Claude desktop app's built-in session server (`ccd_session_mgmt`: `get_session`, `set_session_title`). With Macs named under `macs`, it runs `ssh` to each (key login only, never asking for a password): every 10 seconds one chat on this Mac reads the files under `~/.claude/claudopus/live` there that changed in the last three minutes, leaves there this Mac's own such files (`live/pushed/`), and brings back the answers pressed there for this Mac's chats (`live/outbox/`); an answer you press for one of their chats is written into that Mac's `live/answers`. Each chat reads its own entry in `~/.claude/sessions` every 20 seconds for its Remote Control and app ids, which a press on its name in another panel opens. No telemetry, no other network calls.

### What it puts in prompts

Into every chat: the working principles (`rules/CLAUDE.md`, or your copy), as one more instruction file. With your first message in a chat, after a compaction and when the text changes: the chat's rules (`roles/chat.md`), the list of your subjects with the path of each brief, how full each running piece of work is, and the results not yet passed on. Into each agent the chat starts, after its brief: the work rules (`roles/work.md`), the path of the chat's saved words and the panel's to-do rule. Into a compaction: a line asking it to keep what you asked for and the work under way. Into a running agent's chat: your steer or answer from the panel, and a short reminder when it has gone many steps without updating its card. A message over 12,000 characters is sent as its start, its end and the path where it was kept.

### The prompts it submits

When you press an answer or send a reply on a card whose work has already ended, the panel submits it to the chat as a message from the mod, saying what you pressed and what it answers, so the chat carries the work on.

### What its hooks do

- `prompt.submit`, `prompt.context`, `session.compact`, `agent.spawn`: add the texts above. `agent.spawn` adds only to the prompt of an agent the chat itself starts; it changes no permission mode, model or tools.
- `tool.call` (every tool): in a chat's own thread, while the handing-over is on, it lets through only the tools that start and talk to agents and workflows (`Agent`, `Workflow`, `SendMessage`, `ListAgents`, `TaskStop`, `ToolSearch`, `AskUserQuestion`, `SendUserFile`, `ReadNotifications`, `Skill`, the mod's own tools, the app's `mcp__ccd_` tools, and `Read` of a kept result), and refuses the rest with a line saying to hand the work to an agent. An `Agent` call from the chat that copies the chat (`fork`) or names no model is refused the same way. A `Bash` command in one of the usual forms that read a password from the keychain is refused everywhere; it is a guard against slips, not a wall. Once you have kept a key, what any other tool returns has every kept value replaced by its name. Agents' calls are otherwise passed on unchanged; the hook counts their steps for the cards.
- `tool.call` on `Workflow`: passed on unchanged; a run it started is followed on a card.
- `tool.call` on the mod's own tools (`mcp__claudopus__note`, `todo`, `ask`, `waits`, `update`, `recall`): answers them itself; it stands in for no other tool.
- `tool.check` and `classic.PermissionRequest`: read which call the app is about to put to you as a prompt, to show it in the panels; the verdict and the request are passed on unchanged, and the mod never answers a prompt.
- `tool.describe`: rarely used tools (`ReportFindings`, `SuggestPluginInstall`, `SuggestSkills`, `SearchPlugins`, `ScheduleWakeup`, `Workflow`, and the browser, iOS simulator and visualize servers) wait behind ToolSearch instead of loading into every chat.
- `turn.step`: when you pick another model for a piece of work in its card, its next steps ask for that model; the request and response are otherwise untouched, and only the token count and model name are read.
- `turn.complete`, `session.measure`, `session.start`, `command.run` (`/claudopus`, `/servers`), `ui.render`: keep the cards, the band above the prompt and the panel's tabs.
- From any of them it may show a notification through the app (`$.ui.notify`), play its own `sounds/ready.wav`, or put text you pressed Copy on onto the clipboard (`$.ui.copy`).

### Tools it runs itself

`TaskStop`, when you press Stop on a card or a workflow.

### Programs it runs, and why

Each by name with its arguments in the call: `lsof` and `ps` to list servers for `/servers`, and `ps` as a command waits on your OK and every two seconds after, to see that it started; `kill` when you stop one there; `jq` (looked for in `/usr/bin`, `/opt/homebrew/bin`, `/usr/local/bin`, then the path) and `du` for Stats; `head` and `tail` to read the ends of a work's record; `sips` for thumbnails; `mkdir`, `cp` and `find` to copy a result's pictures into its folder and drop old thumbnails; `mv` to set aside your copy of a text on Reset and to put an answer for another chat in place whole; `rm` to remove a chat's own file in `live/` as it closes and the answers it has read; `scutil --get LocalHostName` for this Mac's name on the other Macs; `ssh` to the Macs named under `macs`, with `sh`, `date`, `find`, `tr`, `mkdir`, `cat`, `mv`, `rm` and `basename` run there to read their chats' files, leave this Mac's, and leave and collect answers; `open` (or `xdg-open`) to show the memory folder, a picture or a text in your editor, and to open another chat in the Claude app (`claude://code/` with its Remote Control id, or `claude://code/continue?session=` with the app's id for a chat on this Mac); `grep` to search the memory for `recall`; its own `bin/secret` with `--list` and `--hide` to hide kept keys; and its own `bin/notify` with the notification's title, text and what a click opens (`claude://code/continue?session=` with this chat's id in the Claude app, else the app it runs in), which starts `notifier/Claudopus.app`, then `osascript` if that one may not notify.

### What it does not run by itself

`bin/admin` and `bin/secret` are shell scripts the work rules point agents to: an agent runs one with Bash when a step needs an admin command or a key, and it asks you in a macOS dialog (`osascript`), keeps the value in this Mac's keychain (`security`), and runs only the command it is handed, on this Mac or over SSH to the host named. No box asks about each command: once a Mac's password is kept, `bin/admin` runs whatever command an agent hands it as root on that Mac. The key itself is asked for at that moment and never read from a file. `workflows/rounds.js` is a workflow script the chat starts through the Workflow tool as `claudopus:rounds`. `onboard/` (a Python script and a brief) loads old chats into the memory: it runs only when you press Index my old chats on the welcome a new install shows once, which asks the chat to run it as background work.

### Files that will be held for a reviewer, and why they stay

- The hooks module itself: the panel, the cards and every behaviour above are this code.
- `bin/admin` and `bin/secret`: the only way work gets an admin command or a key without the value passing through a chat.
- `bin/notify` and `notifier/`: the notifications' own app, built from `notifier/main.swift` by `notifier/build.sh` and signed ad hoc; macOS shows a notification's icon and opens what a click names only for an app.
- `workflows/rounds.js`: the maker-and-checker workflow the chat starts.
- `onboard/extract.py`: reads your past chats under `~/.claude/projects` into the memory; it runs only after you press Index my old chats.
- `sounds/ready.wav`, `art/panel.gif` and the icon: the chime, the README's picture and the listing icon.

## Licence

MIT, in [LICENSE](LICENSE). Claudopus is an independent mod for Claude Code and is not affiliated with or endorsed by Anthropic.
