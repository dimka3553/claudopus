# How Claudopus says things

Every word Claudopus shows you (panel, cards, the bar, questions, notices, results, Config, Stats, Memory, About) follows this page.

## Who does what
- Four can act: **you**, **the chat** (where you type), **Claude** (doing a task in the background) and **Claudopus**. A sentence in a notice or a page names who does what: "Claudopus told Claude", never "the work was told". A card's line, a row and a to-do name neither Claude nor Claudopus: they say what is being done.
- One word for each thing, the same everywhere:

| Say | For | Never |
|---|---|---|
| task | a job the chat started, shown as a card | work, job, piece of work |
| helper | a Claude that a task starts | agent, subagent |
| command | anything run on the computer: a script, download, server, watch | run, process, shell, job |
| question | what Claude asks you | ask (as a noun) |
| to-do | a line on a task's list | step |
| result | what a finished task leaves you | report, finding |
| topic | a line in Memory with its notes | subject, stream |
| full | how much of its memory a chat or task has used | context, tokens, k (Stats alone counts tokens, and says what they are) |

- Never: brief, steer, turn, hand back, printed, killed, exit code, flag, shipped, mod, legwork.

## Sentences
- Everyday words, the fewest that are exact. Present tense, active voice, contractions (don't, isn't, can't).
- Sentence case everywhere. A card line is a fragment with no full stop; a sentence ends with one.
- Join parts of a status line with " · ". No semicolons, brackets or "~" in a status line: say "about".
- One idea per line. Say what happens next or what you can do, never why the code did it.

## Standard forms
- **States**, one word each, one colour each, and no others: Working (purple), Waiting for you (amber), Done (green), Stopped (grey), Failed (red). Working is from a task's start until its result, whether it takes steps or a command or helper of its own runs. Waiting for you is only while a question, a permission, or a key or password box of its own waits for you; amber means nothing else. Done means one thing only: the task handed in its result, every to-do is ticked or dropped, and no command or helper of its own still runs (a server it left for you keeps its row under the card, with Stop). Stopped is only your Stop, or the chat's on your word. Failed says why: `Failed · Ended without its result`, `Failed · The app closed while it worked`, with Start again.
- A card's top row is its facts alone: model, how full, to-dos and time. Its stage is its colour, and once it has ended the line under the top row begins with it: `✓ Done`, `Stopped`, `✕ Failed · <why>`. Details begins its top row with the stage.
- The panel's header counts by stage: `1 waiting for you · 2 working`, `2 working…`, `Just finished`, `Nothing waits for you`.
- **Time running** `29m 40s`, over an hour `1h 05m`. Never a guessed time: no "of about", no "over". **Ago** `2m ago`. **Left**, only from what the command itself counts or prints: `1m left`. **Dates** `11 Nov, 14:20`.
- **Counts** `<n> of <total> <what>`: `2 of 6 stills`, `2 of 5 to-dos`.
- **Buttons** are a verb of one to three words, the same word for the same act: Stop, Details, Result, Release it, Not now, Send, Open chat, Answer in words, Allow once, Deny.
- **Headings** are a noun: To-dos, Helpers and commands, Commands ended, Finished, Result.

## Every running thing has a progress line
A running command or helper is two lines:
1. **What it does**, in the task's words, with how long it has run: `Render the song stills · 4m 10s`
2. **Now**: how far in things · how fast · what it is doing now: `2 of 6 · 33% · rendering still 3`. It counts things, never time; a time left shows only when the command itself prints one.

- After three minutes with nothing new, line 2 keeps the last thing it said and adds how long: `Last: 2 of 6 stills rendered · nothing new for 29m`. With nothing ever said: `No output yet · started 29m ago`. Never "nothing new" alone. A narrow row keeps the time: `No output yet · 29m`, `No progress for 29m`.
- Every row has Stop. Only commands the app itself tracks have rows: nothing runs out of its sight.
- A server: `Serving`, and its row stays under a Done card until you stop it. A watch for something far away: `Watching · last: series arrived`.
- A helper's line 2 is what it is doing now, in plain words: `Reading files`, `Rendering the song stills · 4m`, `Searching the web`, `Waiting for its commands`, or its own last note. Quiet for three minutes, it is `Last: Reading files · nothing new for 29m`.
- A task's card says only its stage, the to-do marked doing (`To-do 5 of 7 · Mend the nose`), and its own last note as its line, plus in amber what needs you. A paused task is Working, and its card says nothing of the pause; a command that ended never takes the place of the task's own line.
- Ended: `Done in 2m 05s`, `Failed after 2m 05s`, `Stopped after 1m`.

## Questions, notices, errors
- **A question**: the question first, ending in "?"; then what happens, in short lines; then buttons that answer it, and Answer in words.
- **A notice**: who did what, then what happens next. `You allowed it. Claude is releasing it now.`
- **An error**: what failed, then what happens next or what you can do. `Couldn't save the setting. Your old value stays.`
