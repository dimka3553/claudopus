# Claudopus

A mod for Claude Code. Each chat hands its work to background agents, so you keep talking while the work runs.
A panel beside the chat shows each piece of work with its to-dos, and an octopus moves while anything runs.
Your messages, the results and a brief per subject are kept in a memory folder, so chats can stay small.

<!-- CLIP: a short GIF of the panel while work runs goes here, saved as mods/claudopus/art/panel.gif and shown with ![The Claudopus panel](mods/claudopus/art/panel.gif) -->

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
- When work finishes, the chat passes on its result, and the panel lists it under Finished. What the work left for you to read is listed under Artifacts.
- `/servers` shows the local servers running on your machine and which chat started each.

The mod also adds its author's working principles ([mods/claudopus/rules/CLAUDE.md](mods/claudopus/rules/CLAUDE.md)) to every chat. Read them before installing; they shape how Claude answers.

The chat picks a model for each piece of work: Opus for most, Sonnet for long legwork, Fable only for heavy work. Your account needs access to the model it picks.

## Needs

- Claude Code 2.1.287 or newer in the terminal, or the desktop app 2.1.286 or newer. The panel draws in VS Code from 2.1.299.
- Does not work on Windows under WSL (plugins do not load there) or where your organization's admins block mods. In `claude -p` print mode and cloud sessions there is no panel.
- Seen working in the macOS desktop app. The terminal and VS Code have not been tried yet.

## Settings

The mod reads `~/.claude/claudopus/config.json` when a chat starts. Both keys are optional:

```json
{ "name": "Sam", "agents": true }
```

- `name`: what the agents call you. Left out, they say "the person".
- `agents`: `false` stops the handing over; every chat then does its own work again.

## Turn it off

```
/plugin disable claudopus@claudopus
```

`/plugin enable claudopus@claudopus` turns it back on; `/plugin uninstall claudopus@claudopus` removes it. Your memory folder is left in place.

## Memory

Everything the mod keeps is in `~/.claude/claudopus`, as plain files:

- `index.md`: the subjects of your work, one line each
- `streams/`: one brief per subject
- `words/`: your messages, word for word, one file per chat
- `reports/`: what finished work left for you, one dated folder each
- `asks/`: what you asked in each chat and what was done, one file per chat
- `finished/`: the Finished list of each chat
- `servers.json`: the servers `/servers` last saw
- `log.md`: the mod's own log

Delete the folder to start over.
