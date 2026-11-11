"""Onboarding, step 1: every old chat's messages and replies into the memory.

Reads the transcripts under ~/.claude/projects. For each chat it writes
~/.claude/claudopus/words/<session>.md (my messages word for word, each followed by
what Claude answered, so `recall` finds both) and adds the chat to a digest for
its project in <out dir>, which the stream analysis reads.

    python3 extract.py <out dir>

A chat is grouped by its repo: the folder under ~/Documents/GitHub, or under the
folder CLAUDOPUS_REPOS names.
"""
import glob
import json
import os
import re
import sys

HOME = os.path.expanduser('~')
PROJECTS = f'{HOME}/.claude/projects'
WORDS = f'{HOME}/.claude/claudopus/words'
MARK = '<!-- from the transcript -->'
# The folder that holds one folder per repo; GitHub Desktop's default unless CLAUDOPUS_REPOS names another
REPOS = os.environ.get('CLAUDOPUS_REPOS', f'{HOME}/Documents/GitHub').rstrip('/')
# Folders that hold no work of mine: test runs and the app's spare sessions
SKIP = ('scratchpad', 'claude-spares')
# What a digest keeps of one message and of the chat's last reply
MESSAGE_CHARS = 500
REPLY_CHARS = 700
DIGEST_BYTES = 230_000


def text_of(content):
    if isinstance(content, str):
        return content
    return '\n'.join(b.get('text', '') for b in content if isinstance(b, dict) and b.get('type') == 'text')


def is_mine(row, text):
    if row.get('isSidechain') or row.get('isMeta') or row.get('isCompactSummary'):
        return False
    kind = (row.get('origin') or {}).get('kind')
    if kind and kind != 'human':
        return False
    # Older transcripts name no origin: leave out what the app wrote for me
    return bool(text.strip()) and not re.match(r'\s*(<|\[Request interrupted|Caveat:|This session is being continued)', text)


def clip(text, limit):
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) <= limit:
        return text
    head = limit * 7 // 10
    return f'{text[:head]} […] {text[-(limit - head):]}'


def read_chat(path):
    # messages: (time, my text, [(time, Claude's answer)]): an answer closes each turn until my next message
    chat = {'id': os.path.basename(path)[:-6], 'path': path, 'title': '', 'cwd': '', 'branch': '', 'messages': [], 'reply': ''}
    # A transcript repeats earlier rows each time the chat is resumed or compacted
    seen = set()
    last = None
    for line in open(path, errors='replace'):
        try:
            row = json.loads(line)
        except ValueError:
            continue
        kind = row.get('type')
        if kind == 'custom-title':
            chat['title'] = row.get('customTitle') or chat['title']
        elif kind == 'summary' and not chat['title']:
            chat['title'] = row.get('summary', '')
        elif kind == 'user':
            text = text_of((row.get('message') or {}).get('content') or '')
            # Any message closes the turn before it: its last words were that turn's answer
            if text.strip() and not row.get('isSidechain') and last and chat['messages']:
                chat['messages'][-1][2].append(last)
                last = None
            key = (row.get('timestamp', ''), text)
            if is_mine(row, text) and key not in seen:
                seen.add(key)
                chat['messages'].append((row.get('timestamp', ''), text.strip(), []))
                chat['cwd'] = row.get('cwd') or chat['cwd']
                chat['branch'] = row.get('gitBranch') or chat['branch']
        elif kind == 'assistant' and not row.get('isSidechain'):
            text = text_of((row.get('message') or {}).get('content') or '')
            key = (row.get('timestamp', ''), text)
            if text.strip() and key not in seen:
                seen.add(key)
                chat['reply'] = text.strip()
                last = (row.get('timestamp', ''), text.strip())
    if last and chat['messages']:
        chat['messages'][-1][2].append(last)
    return chat


def project_of(cwd):
    if '/.claude/worktrees/' in cwd:
        cwd = cwd.split('/.claude/worktrees/')[0]
    if cwd.startswith(f'{REPOS}/'):
        return cwd[len(REPOS) + 1:].split('/')[0] or 'github'
    return 'other'


def main(out):
    os.makedirs(out, exist_ok=True)
    os.makedirs(WORDS, exist_ok=True)
    chats = []
    for path in glob.glob(f'{PROJECTS}/*/*.jsonl'):
        if any(part in path for part in SKIP):
            continue
        chat = read_chat(path)
        if chat['messages']:
            chats.append(chat)
    chats.sort(key=lambda c: c['messages'][0][0])

    digests = {}
    for chat in chats:
        first, last = chat['messages'][0][0][:10], chat['messages'][-1][0][:16]
        head = f"{chat['title'] or '(untitled)'}\nsession {chat['id']} · {chat['cwd']} · branch {chat['branch'] or '?'} · {first} to {last} · {len(chat['messages'])} messages"

        # The transcript holds everything the mod saved as the chat went, so the file is written whole from it
        with open(f"{WORDS}/{chat['id']}.md", 'w') as f:
            f.write(f"{MARK}\n# {head}\ntranscript: {chat['path']}\n\n")
            for at, text, answers in chat['messages']:
                f.write(f'## {at}\n{text}\n\n')
                for answered, answer in answers:
                    f.write(f'### Claude {answered}\n{answer}\n\n')

        lines = [f'### {head}']
        lines += [f'- [{at[:16]}] {clip(text, MESSAGE_CHARS)}' for at, text, _ in chat['messages']]
        lines.append(f"LAST REPLY: {clip(chat['reply'], REPLY_CHARS)}\n")
        digests.setdefault(project_of(chat['cwd']), []).append('\n'.join(lines))

    # Small projects share one digest; a large one is cut into parts a reader can hold
    small = [name for name, parts in digests.items() if sum(map(len, parts)) < 40_000]
    if len(small) > 1:
        digests['misc'] = [part for name in small for part in digests.pop(name)]
    for name, parts in sorted(digests.items()):
        chunk, size, n = [], 0, 1
        for part in parts + [None]:
            if part is None or (chunk and size + len(part) > DIGEST_BYTES):
                with open(f'{out}/{name}-{n}.md', 'w') as f:
                    f.write('\n'.join(chunk))
                print(f'{name}-{n}.md: {len(chunk)} chats, {size // 1000}k chars')
                chunk, size, n = [], 0, n + 1
            if part is not None:
                chunk.append(part)
                size += len(part)
    print(f'{len(chats)} chats, {sum(len(c["messages"]) for c in chats)} messages')


if __name__ == '__main__':
    main(sys.argv[1])
