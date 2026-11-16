#!/usr/bin/env python3
"""Make the classification inputs from timing.py's output (argv[1]).

claudopus.jsonl: every Claudopus work, its title and the opener of the message that started it.
plain.jsonl: every typed message of a sample of plain chats, in chat order, with its time and tool count,
             so a reader can group messages into tasks.
Private: written next to the data, never into the repo.
"""
import json, os, sys, random, collections

D = sys.argv[1]
works = json.load(open(os.path.join(D, 'works.json')))
plain = json.load(open(os.path.join(D, 'plain.json')))
texts = json.load(open(os.path.join(D, 'texts.json')))
with open(os.path.join(D, 'claudopus.jsonl'), 'w') as f:
    for w in works:
        f.write(json.dumps(dict(key='w:' + w['id'], title=w['title'], message=texts.get('w:' + w['id'], '')[:400],
                                minutes=round((w['wall'] or 0) / 60))) + '\n')
by_chat = collections.defaultdict(list)
for p in plain:
    by_chat[p['chat']].append(p)
# plain chats from before the mod, with real work in them (at least one tool call)
cands = [c for c, ps in by_chat.items() if sum(p['ntools'] for p in ps) >= 3 and min(p['msg_t'] for p in ps) < 1794326400]
random.seed(7)
random.shuffle(cands)
pick, n = [], 0
for c in cands:
    if n > 700:
        break
    pick.append(c)
    n += len(by_chat[c])
with open(os.path.join(D, 'plain.jsonl'), 'w') as f:
    for c in pick:
        for p in sorted(by_chat[c], key=lambda p: p['msg_t']):
            f.write(json.dumps(dict(key='p:' + p['id'], chat=c[:8], folder=p['folder'][-30:], minutes=round(p['wall'] / 60, 1),
                                    tools=p['ntools'], message=texts.get('p:' + p['id'], '')[:300])) + '\n')
print(len(works), 'works;', len(pick), 'plain chats,', n, 'plain messages')
