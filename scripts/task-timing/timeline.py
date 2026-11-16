#!/usr/bin/env python3
"""Minute-by-minute walk through one Claudopus work: python3 -I timeline.py <agent-id> [full]

Uses timing.py's own attribution, recording each stretch in the order it is counted, and merges
neighbouring stretches of one part. Prints minutes from the work's start (the chat's Agent call).
"""
import sys, os, glob, json, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import timing as T

LOG = []


class Rec(collections.Counter):
    def __setitem__(self, k, v):
        old = self.get(k, 0)
        if v - old and k not in ('helpers-spawn',):
            LOG.append((k, v - old))
        super().__setitem__(k, v)


aid = sys.argv[1]
full = len(sys.argv) > 2
m = glob.glob(T.P + f'/*/*/subagents/{aid}.meta.json')[0]
meta = json.load(open(m))
chat = os.path.dirname(os.path.dirname(m))
ents = [e for e in T.load(chat + '.jsonl') if e.get('timestamp')]
spawn = None
for e in ents:
    mc = (e.get('message') or {}).get('content')
    if e.get('type') == 'assistant' and isinstance(mc, list):
        for x in mc:
            if isinstance(x, dict) and x.get('id') == meta.get('toolUseId'):
                spawn = T.ts(e['timestamp'])
humans = [T.ts(e['timestamp']) for e in ents if T.is_human(e) and spawn and T.ts(e['timestamp']) <= spawn + 1]
T.build_global()
T.collections.Counter = Rec
a = T.analyse_agent(m[:-10] + '.jsonl', meta, spawn, full=full)
print(f"{meta.get('description')}: message to start {spawn - humans[-1]:.0f} s" if humans else meta.get('description'))
segs = []
for k, d in LOG:
    if d <= 0:
        continue
    g = k.replace('model-', '')
    if segs and segs[-1][0] == g:
        segs[-1][1] += d
    else:
        segs.append([g, d])
# blocks: a stretch of 2 minutes or more of one part stands alone; shorter ones are pooled
# into a mixed block named by its biggest parts
blocks = []
for g, d in segs:
    if d >= 120:
        blocks.append([collections.Counter({g: d}), True])
    else:
        if not blocks or blocks[-1][1]:
            blocks.append([collections.Counter(), False])
        blocks[-1][0][g] += d
t = 0
for c, solo in blocks:
    d = sum(c.values())
    if d < 20:
        t += d
        continue
    name = ', '.join(f'{k} {v/60:.1f}' for k, v in c.most_common(3) if v >= 15)
    print(f'{t/60:6.1f} min  +{d/60:5.1f}  {name}')
    t += d
print(f'{t/60:6.1f} min  end ({"last entry" if full else "report handed back"})')
