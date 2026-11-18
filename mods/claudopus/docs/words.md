# How Claudopus says things

Every word Claudopus shows you (panel, cards, the bar, questions, notices, results, Config, Stats, Memory, About) follows this page.

## Who does what
- Four can act: **you**, **the chat** (where you type), **Claude** (doing a task in the background) and **Claudopus**. Every sentence names who does what: "Claudopus told Claude", never "the work was told".
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
- **States**, one word each, one colour each: Starting, Working (purple), Waiting for you (amber), Done (green), Failed (amber), Stopped, Stopped by you (grey). Done means one thing only: the task handed back its result, every to-do is ticked or dropped, and no command or helper of its own still runs. With a command or helper of its own running it is still purple; with to-dos left it is Not done, in amber. A Done card whose result asks something more stays green, at the top with the question, until it is answered or dismissed.
- A card's top row is its facts alone: model, how full, to-dos and time. Its stage is its colour, and once it has ended the line under the top row begins with it: `✓ Done`, `Not done`, `Stopped`, `✕ Failed`. Details begins its top row with the stage.
- A task being released stays in Working's purple, its line saying `Claudopus is releasing <branch>`, from the press on Release it until the release has finished; only then is it Done.
- **Time running** `29m 40s`, over an hour `1h 05m`. **Expected** `of about 5m`. **Past it** `29m 40s · 24m over` (amber). **Ago** `2m ago`. **Left** `1m left`. **Dates** `11 Nov, 14:20`.
- **Counts** `<n> of <total> <what>`: `2 of 6 stills`, `2 of 5 to-dos`.
- **Buttons** are a verb of one to three words, the same word for the same act: Stop, Details, Result, Release it, Not now, Send, Open chat, Answer in words, Allow once, Deny.
- **Headings** are a noun: To-dos, Helpers and commands, Commands ended, Finished, Result.

## Every running thing has a progress line
A running command or helper is two lines:
1. **What it does**, in Claude's words, with its time: `Render the song stills · 4m 10s of about 5m`
2. **Now**: how far · how fast · time left · what it is doing now: `2 of 6 · 33% · 2m left · rendering still 3`

- After three minutes with nothing new, line 2 keeps the last thing it said and adds how long: `Last: 2 of 6 stills rendered · nothing new for 29m`. With nothing ever said: `No output yet · started 29m ago`. Never "nothing new" alone. A narrow row keeps the time: `No output yet · 29m`, `No progress for 29m`.
- Once Claudopus has told Claude about the quiet, the line says so: `· Claude was told to check it`.
- A server: `Serving`. A watch: `Watching · last: series arrived`.
- A helper's line 2 is what it is doing now, in plain words: `Reading files`, `Rendering the song stills · 4m`, `Searching the web`, `Waiting for its commands`, or its own last note. Quiet for three minutes, it is `Last: Reading files · nothing new for 29m`.
- A task's card says only its stage, the to-do marked doing (`To-do 5 of 7 · Mend the nose`), and its own last note as its line, plus in amber what needs you. What Claudopus did on the way (started it again after the chat stopped or partway, the command it waits for, when it starts it again, which helpers it was told to check on) is never on the card, and a command that ended never takes the place of the task's own line.
- Ended: `Done in 2m 05s`, `Failed after 2m 05s`, `Stopped after 1m`.

## Questions, notices, errors
- **A question**: the question first, ending in "?"; then what happens, in short lines; then buttons that answer it, and Answer in words.
- **A notice**: who did what, then what happens next. `You allowed it. Claude is releasing it now.`
- **An error**: what failed, then what happens next or what you can do. `Couldn't save the setting. Your old value stays.`
