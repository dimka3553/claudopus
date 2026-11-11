Goal: work out which streams of work the person has in progress, from the record of their past chats, so each can be continued without rereading old chats.

Read the digest file you were given, whole. Each `###` block is one chat: title, session id, folder, branch, dates, then the person's own messages in order (clipped) and the chat's last reply. The full text of the person's messages for a chat is in `~/.claude/claudopus/words/<session id>.md`. Do not open the raw transcripts.

A stream is one subject of work the person would want to pick up again. It is not a chat. A long chat that drifted is split across streams; several chats on one subject are one stream. A finished one-off chat needs no stream. Prefer few, real streams. A subject that belongs to another repo is still listed, marked with that repo.

Look hardest for what got lost: what the person asked for that was never done, done only locally, never committed or pushed, or dropped when the subject changed. Record the person's verdicts on results.

Then check each repo, read-only (`git status`, `git branch -vv`, `git worktree list`, `git log`, `git stash list`; change nothing). What the repo says beats what a chat claimed.

Write one section per stream to the file you were told, at most 250 words each:

## <name, 2 to 4 words>
- repo: <folder the work belongs in>
- for: <one line>
- chats: <session id (title, dates)>, and for a drifting chat, which part
- last active: <date>
- state: <what is shipped, per the repo; "per the chat" where it could not be checked>
- left: <unfinished and lost items, each with its date and a short quote of the person's words>
- decisions: <the person's decisions, verdicts and standards a worker must know, quoted briefly>
- branches: <branches, worktrees and uncommitted files that belong to it>

End with "## No stream needed" (finished one-off chats, title only) and "## Unsure".

Reply with only the stream names, one line each with its last-active date, and anything surprising in the repo.
