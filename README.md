# Claudopus

A mod for Claude Code. Each chat hands its work to background agents, so you keep talking while the work runs.
A panel beside the chat shows each piece of work with its to-dos, and an octopus moves while anything runs.
Your messages, the results and a brief per subject are kept in a memory folder, so chats can stay small.

![The Claudopus panel during a real session: cards with their to-dos, two finishing green, the octopus turning green with them](mods/claudopus/art/panel.gif)

*The panel during a real session, sped up.*

## Install

In a terminal, at the Claude Code prompt:

```
/plugin marketplace add dimka3553/claudopus
/plugin install claudopus@claudopus
```

Answer `y` to add the marketplace, then pick the user scope (the first one, Enter). If the short form fails over SSH, use `https://github.com/dimka3553/claudopus.git` in its place. From a shell, the same two steps are `claude plugin marketplace add dimka3553/claudopus` and `claude plugin install claudopus@claudopus`.

In the Claude desktop app: click + next to the prompt box, then Plugins, Add marketplace with `dimka3553/claudopus`, then add the plugin `claudopus`.

That is all. Nothing has to be typed in each chat.

## What you see

- The mod is on in every chat you open from then on, in every folder.
- You send a message. The chat answers in one line and starts a background agent for it, then is free for your next message.
- The panel opens beside the chat by itself the first time work starts in that chat. Each piece of work is a card with its to-dos and a line saying where it stands. If you close the panel it stays closed for that chat; `/claudopus` opens it again.
- A short band above the prompt says what is being done right now.
- A message about work that is already running goes to that work as a steer instead of starting new work.
- When work finishes, the chat passes on its result, and the panel lists it under Finished. What the work left for you to read is listed under Results.
- Stats, beside Results, adds up what the work came to, for this chat or every chat with kept work, today or all time: tokens by model, work finished, to-dos done, your messages, the time saved by running work side by side, a timeline, what the tokens would cost at API prices, and what the memory holds.
- Memory, at the top of the panel, opens Finder at the folder where Claudopus keeps what it remembers.
- About, beside Memory, waves hello once, says what Claudopus is and shows its version and Claude Code's, the website, the licence and the GitHub repo.
- A finish plays a short quiet chime, and a notification names the work and the first words of its result, so you hear and see it when you are elsewhere.
- When work needs an admin command, a box asks you once for that Mac's password, hiding what you type; it stays in this Mac's keychain and work never sees it.
- When work needs a key, token or password, a box asks you once for it by name, hiding what you type; it stays in this Mac's keychain, work uses it as an environment variable, and it is hidden from every output.
- `/servers` shows the local servers running on your machine and which chat started each.

The mod also adds a short set of working principles ([mods/claudopus/rules/CLAUDE.md](mods/claudopus/rules/CLAUDE.md)) to every chat. They shape how Claude answers; change them to fit you in the Config tab.

The chat picks a model for each piece of work: Opus for most, Sonnet for long legwork, Fable only for heavy work. Your account needs access to the model it picks.

## Needs

- Claude Code 2.1.287 or newer in the terminal, or the desktop app 2.1.286 or newer. The panel draws in VS Code from 2.1.299.
- Does not work on Windows under WSL (plugins do not load there) or where your organization's admins block mods. In `claude -p` print mode and cloud sessions there is no panel.
- Stats reads Claude's records with `jq`, which macOS 15 and later include.
- Seen working in the macOS desktop app. The terminal and VS Code have not been tried yet.

## Settings

The panel's Config tab lists everything you can set, shows what is in force, and puts each back to what shipped. Edit on the principles, the chat's rules or the work rules makes your own copy at the same path under `~/.claude/claudopus` (`rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md`); the mod uses your copy when there is one, and an update never touches it.

The settings are `~/.claude/claudopus/config.json`. Every key is optional:

```json
{ "name": "Sam", "agents": true, "sound": true, "notifications": true, "models": { "work": "opus", "legwork": "sonnet", "heavy": "fable" } }
```

- `name`: what the agents call you. Left out, they say "the person".
- `agents`: `false` stops the handing over; every chat then does its own work again.
- `sound`: `false` silences the short chime played when work is ready.
- `notifications`: `false` stops the notification that names work when it is ready, stopped or failed.
- `models`: which model runs most work, long legwork and helpers, and heavy work (`opus`, `sonnet`, `fable` or `haiku`).

`name` and `agents` are read when a chat starts; `sound` and `notifications` each time work ends.

## Turn it off

```
/plugin disable claudopus@claudopus
```

`/plugin enable claudopus@claudopus` turns it back on; `/plugin uninstall claudopus@claudopus` removes it. Your memory folder is left in place.

## Memory

Everything the mod keeps is in `~/.claude/claudopus`, as plain files:

- `index.md`: the subjects of your work, one line each
- `streams/`: one brief per subject
- `words/`: your messages, word for word, and Claude's answers, one file per chat
- `asks/`: what you asked in each chat and what was done, one file per chat
- `reports/`: what finished work left for you, one dated folder each, with copies of the pictures it named and small thumbnails
- `finished/`: the Finished list of each chat
- `flows/`: each workflow run the panel follows
- `pastes/`: a message over 12,000 characters, kept here while the chat gets its start, its end and this path
- `stats/` and `thumbs/`: sums Stats made of Claude Code's records, and small copies of pictures shown in the panel
- `servers.json`: the servers `/servers` last saw
- `config.json`: your settings, written by the Config tab
- `rules/CLAUDE.md`, `roles/chat.md`, `roles/work.md`: your own copies of the three texts, written only when you edit or save one in the Config tab; Reset moves your copy aside as `.old`
- `log.md`: the mod's own log

Delete the folder to start over. The mod writes nowhere else: no build, start-up or settings file of Claude Code or your projects.

## What it does, for the plugin directory

Everything stays on your machine, apart from what Claude Code itself sends to Claude.

**What it sends, and where.** After each reply, one short call through Claude Code (`$.model.complete`, Sonnet) sends the start of your message and of the reply to Claude, to title the chat and note what was asked and done. It sets that title, and reads the chat's own id, through the Claude desktop app's built-in session server (`ccd_session_mgmt`: `get_session`, `set_session_title`). No telemetry, no other network calls.

**What it puts in prompts.** Into every chat: the working principles (`rules/CLAUDE.md`, or your copy), as one more instruction file. With your first message in a chat, after a compaction and when the text changes: the chat's rules (`roles/chat.md`), the list of your subjects with the path of each brief, how full each running piece of work is, and the results not yet passed on. Into each agent the chat starts, after its brief: the work rules (`roles/work.md`), the path of the chat's saved words and the panel's to-do rule. Into a compaction: a line asking it to keep what you asked for and the work under way. Into a running agent's chat: your steer or answer from the panel, and a short reminder when it has gone many steps without updating its card. A message over 12,000 characters is sent as its start, its end and the path where it was kept.

**The prompts it submits.** When you press an answer or send a reply on a card whose work has already ended, the panel submits it to the chat as a message from the mod, saying what you pressed and what it answers, so the chat carries the work on.

**What its hooks do.**
- `prompt.submit`, `prompt.context`, `session.compact`, `agent.spawn`: add the texts above. `agent.spawn` adds only to the prompt of an agent the chat itself starts; it changes no permission mode, model or tools.
- `tool.call` (every tool): in a chat's own thread, while the handing-over is on, it lets through only the tools that start and talk to agents and workflows (`Agent`, `Workflow`, `SendMessage`, `ListAgents`, `TaskStop`, `ToolSearch`, `AskUserQuestion`, `SendUserFile`, `ReadNotifications`, `Skill`, the mod's own tools, the app's `mcp__ccd_` tools, and `Read` of a kept result), and refuses the rest with a line saying to hand the work to an agent. An `Agent` call from the chat that copies the chat (`fork`) or names no model is refused the same way. A `Bash` command that reads a password from the keychain is refused everywhere. Once you have kept a key, what any other tool returns has every kept value replaced by its name. Agents' calls are otherwise passed on unchanged; the hook counts their steps for the cards.
- `tool.call` on `Workflow`: passed on unchanged; a run it started is followed on a card.
- `tool.call` on the mod's own tools (`mcp__claudopus__note`, `todo`, `ask`, `waits`, `update`, `recall`): answers them itself; it stands in for no other tool.
- `tool.describe`: rarely used tools (`ReportFindings`, `SuggestPluginInstall`, `SuggestSkills`, `SearchPlugins`, `ScheduleWakeup`, `Workflow`, and the browser, iOS simulator and visualize servers) wait behind ToolSearch instead of loading into every chat.
- `turn.step`: when you pick another model for a piece of work in its card, its next steps ask for that model; the request and response are otherwise untouched, and only the token count and model name are read.
- `turn.complete`, `session.measure`, `session.start`, `command.run` (`/claudopus`, `/servers`), `ui.render`: keep the cards, the band above the prompt and the panel's tabs.
- From any of them it may show a notification through the app (`$.ui.notify`), play its own `sounds/ready.wav`, or put text you pressed Copy on onto the clipboard (`$.ui.copy`).

**Tools it runs itself.** `TaskStop`, when you press Stop on a card or a workflow.

**Programs it runs, and why.** Each by name with its arguments in the call: `lsof` and `ps` to list servers for `/servers`, `kill` when you stop one there; `jq` (looked for in `/usr/bin`, `/opt/homebrew/bin`, `/usr/local/bin`, then the path) and `du` for Stats; `head` and `tail` to read the ends of a work's record; `sips` for thumbnails; `mkdir`, `cp` and `find` to copy a result's pictures into its folder and drop old thumbnails; `mv` to set aside your copy of a text on Reset; `open` (or `xdg-open`) to show the memory folder, a picture or a text in your editor; `grep` to search the memory for `recall`; and its own `bin/secret` with `--list` and `--hide` to hide kept keys.

**What it does not run by itself.** `bin/admin` and `bin/secret` are shell scripts the work rules point agents to: an agent runs one with Bash when a step needs an admin command or a key, and it asks you in a macOS dialog (`osascript`), keeps the value in this Mac's keychain (`security`), and runs only the command it is handed, on this Mac or over SSH to the host named. The key itself is asked for at that moment and never read from a file. `workflows/rounds.js` is a workflow script the chat starts through the Workflow tool as `claudopus:rounds`. `onboard/` (a Python script and a brief) is a by-hand way to load old chats into the memory; nothing in the mod runs it.

**Files that will be held for a reviewer, and why they stay.**
- The hooks module itself: the panel, the cards and every behaviour above are this code.
- `bin/admin` and `bin/secret`: the only way work gets an admin command or a key without the value passing through a chat.
- `workflows/rounds.js`: the maker-and-checker workflow the chat starts.
- `onboard/extract.py`: kept for people who want their old chats in the memory; it runs only by hand.
- `sounds/ready.wav`, `art/panel.gif` and the icon: the chime, the README's picture and the listing icon.

## Licence

MIT, in [LICENSE](LICENSE). Claudopus is an independent mod for Claude Code and is not affiliated with or endorsed by Anthropic.
