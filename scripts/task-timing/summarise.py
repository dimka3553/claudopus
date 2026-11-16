#!/usr/bin/env python3
"""Summarise works.json / plain.json (and kinds.json when present) from timing.py into tables and a chart.

argv[1]: the folder timing.py wrote into. Writes summary.md and chart.png there.
"""
import json, os, sys, statistics, collections

D = sys.argv[1]
works = json.load(open(os.path.join(D, 'works.json')))
plain = json.load(open(os.path.join(D, 'plain.json')))
kinds = {}
for kp in ('kinds-claudopus.json', 'kinds-plain.json'):
    kp = os.path.join(D, kp)
    if os.path.exists(kp):
        kinds.update(json.load(open(kp)))
# only the plain messages that were sorted into kinds (the sample) take part
plain = [p for p in plain if 'p:' + p['id'] in kinds]
# plain tasks: a message that starts a task plus the follow-ups that continue it, in chat order
ptasks = []
for p in sorted(plain, key=lambda p: (p['chat'], p['msg_t'])):
    k = kinds['p:' + p['id']]
    busy = p['wall'] - p.get('asleep', 0)
    if k.get('starts', True) or not ptasks or ptasks[-1]['chat'] != p['chat']:
        ptasks.append(dict(chat=p['chat'], kind=k.get('kind'), task=k.get('task', True), busy=busy, msgs=1,
                           span=p['end_t'] - p['msg_t'], t0=p['msg_t']))
    else:
        ptasks[-1]['busy'] += busy
        ptasks[-1]['msgs'] += 1
        ptasks[-1]['span'] = p['end_t'] - ptasks[-1]['t0']


def q(xs, p):
    xs = sorted(xs)
    if not xs:
        return float('nan')
    k = (len(xs) - 1) * p
    lo = int(k)
    hi = min(lo + 1, len(xs) - 1)
    return xs[lo] + (xs[hi] - xs[lo]) * (k - lo)


def m(x):
    return x / 60


def waits_dima(w):
    return w['secs'].get('wait-dima', 0) + w['secs'].get('ask', 0)


def lost(w):
    return sum(w['secs'].get(k, 0) for k in ('lost', 'asleep', 'wait-other', 'restarted', 'api-retry'))


out = []
ws = [w for w in works if w.get('wall') and w['wall'] > 0 and w.get('handed_back')]
for w in ws:
    w['own'] = w['wall'] - waits_dima(w)               # minus waiting on him
    w['own_nolost'] = w['own'] - lost(w)               # and minus time lost to sleep or stuck calls
    w['kind'] = kinds.get('w:' + w['id'], {}).get('kind', '?')
for p in plain:
    p['kind'] = kinds.get('p:' + p['id'], {}).get('kind', '?')
    p['task'] = kinds.get('p:' + p['id'], {}).get('task', True)

ORDER = ['lookup', 'small-fix', 'feature', 'investigation', 'release', 'other', '?']
out.append('## Message to result, minutes (median, 25th-75th, 90th)\n')
out.append('| kind | Claudopus n | Claudopus median | IQR | p90 | minus waits on Dima: median | plain n | plain median | IQR | p90 | ratio of medians |')
out.append('|---|---|---|---|---|---|---|---|---|---|---|')
rows = []
TASKROWS = ['| kind | plain tasks | Claude busy, median | IQR | p90 | first message to last answer, median | messages per task, median |', '|---|---|---|---|---|---|---|']
for k in ORDER + ['all']:
    a = [m(w['own_nolost']) for w in ws if (w['kind'] == k or k == 'all')]
    a_wall = [m(w['wall']) for w in ws if (w['kind'] == k or k == 'all')]
    b = [m(p['wall'] - p.get('asleep', 0)) for p in plain if (p['kind'] == k or k == 'all') and p['task'] and p['kind'] != 'chat']
    bt = [m(t['busy']) for t in ptasks if (t['kind'] == k or k == 'all') and t['task'] and t['kind'] != 'chat']
    bs = [m(t['span']) for t in ptasks if (t['kind'] == k or k == 'all') and t['task'] and t['kind'] != 'chat']
    TASKROWS.append(f'| {k} | {len(bt)} | {q(bt,.5):.1f} | {q(bt,.25):.1f}-{q(bt,.75):.1f} | {q(bt,.9):.0f} | {q(bs,.5):.0f} | {q([t["msgs"] for t in ptasks if t["kind"]==k or k=="all"],.5):.0f} |')
    if not a and not b:
        continue
    r = (q(a, .5) / q(b, .5)) if a and b and q(b, .5) > 0 else float('nan')
    out.append(f'| {k} | {len(a)} | {q(a_wall,.5):.0f} | {q(a_wall,.25):.0f}-{q(a_wall,.75):.0f} | {q(a_wall,.9):.0f} | {q(a,.5):.0f} | {len(b)} | {q(b,.5):.1f} | {q(b,.25):.1f}-{q(b,.75):.1f} | {q(b,.9):.0f} | {r:.1f}x |')
    rows.append((k, a, b, bt))

# every round: first rounds plus later rounds (his words sent into a running work, to the report answering them)
later = [m(r[1]) for w in ws for r in (w.get('rounds') or [])]
allr = [m(w['own_nolost']) for w in ws] + later
plain_all = json.load(open(os.path.join(D, 'plain.json')))
wk = [m(p['wall'] - p.get('asleep', 0)) for p in plain_all if p['msg_t'] >= 1794355200]
wk5 = [m(p['wall'] - p.get('asleep', 0)) for p in plain_all if p['msg_t'] >= 1794355200 and p['ntools'] >= 5]
old5 = [m(p['wall'] - p.get('asleep', 0)) for p in plain_all if p['msg_t'] < 1794355200 and p['ntools'] >= 5]
out.append('\n## Other cuts, minutes (median, 25th-75th, n)\n')
out.append(f'- Claudopus later rounds: median {q(later,.5):.1f} ({q(later,.25):.1f}-{q(later,.75):.1f}), n={len(later)}')
out.append(f'- Claudopus every round together: median {q(allr,.5):.1f} ({q(allr,.25):.1f}-{q(allr,.75):.1f}), n={len(allr)}')
out.append(f'- Claudopus first rounds where the start was a guess (counted from the work starting): {sum(1 for w in ws if w.get("start_guess"))}')
out.append(f'- Plain, same week as Claudopus (from 11 Nov), every message: median {q(wk,.5):.1f} ({q(wk,.25):.1f}-{q(wk,.75):.1f}), n={len(wk)}')
out.append(f'- Plain, same week, messages with 5+ tool calls: median {q(wk5,.5):.1f} ({q(wk5,.25):.1f}-{q(wk5,.75):.1f}), n={len(wk5)}')
out.append(f'- Plain, before 11 Nov, messages with 5+ tool calls: median {q(old5,.5):.1f} ({q(old5,.25):.1f}-{q(old5,.75):.1f}), n={len(old5)}')
out.append('\n## Plain tasks (a starting message plus its follow-ups), minutes\n')
out += TASKROWS
after = [m(w['full_end'] - w['end_t']) for w in ws if w.get('full_end') and w['full_end'] - w['end_t'] > 30]
out.append(f'\nWork that went on after its report reached him (mostly a later round or a release): {len(after)} of {len(ws)}, median {q(after,.5):.0f} min, p90 {q(after,.9):.0f} min')
CATS = ['startup', 'work', 'model-work', 'model-think', 'check', 'wait-check', 'model-check', 'helpers', 'wait-helpers',
        'model-helpers', 'pictures', 'wait-pictures', 'model-pictures', 'report', 'model-report', 'notes', 'model-notes',
        'card', 'model-card', 'ask', 'model-ask', 'wait-dima', 'waitcmd', 'model-waitcmd', 'wait-cmd', 'tests',
        'model-tests', 'release', 'model-release', 'git', 'model-git', 'model-startup', 'lost', 'wait-other', 'overhead']
GROUP = {
    'startup': 'starting up', 'model-startup': 'starting up', 'git': 'starting up', 'model-git': 'starting up',
    'work': 'the work itself', 'model-work': 'the work itself', 'model-think': 'the work itself',
    'helpers': 'helpers (legwork)', 'wait-helpers': 'helpers (legwork)', 'model-helpers': 'helpers (legwork)',
    'check': 'second check', 'wait-check': 'second check', 'model-check': 'second check',
    'pictures': 'pictures', 'wait-pictures': 'pictures', 'model-pictures': 'pictures',
    'report': 'report', 'model-report': 'report',
    'notes': 'notes and brief', 'model-notes': 'notes and brief',
    'card': 'card and to-dos', 'model-card': 'card and to-dos',
    'ask': 'waiting on Dima', 'model-ask': 'card and to-dos', 'wait-dima': 'waiting on Dima',
    'waitcmd': 'wait commands', 'model-waitcmd': 'wait commands', 'wait-cmd': 'wait commands',
    'tests': 'tests and builds', 'model-tests': 'tests and builds',
    'release': 'releases and GitHub checks', 'model-release': 'releases and GitHub checks',
    'asleep': 'Mac asleep or app shut', 'wait-pictures': 'pictures', 'model-wait-check': 'second check', 'model-wait-helpers': 'helpers (legwork)', 'model-wait-pictures': 'pictures',
    'restarted': 'stopped mid-step, restarted later', 'api-retry': 'lost (sleep, stuck, cut off)',
    'lost': 'lost (sleep, stuck, cut off)', 'wait-other': 'lost (sleep, stuck, cut off)', 'overhead': 'between steps (hooks, sending)',
}
tot = collections.Counter()
per_work_share = collections.defaultdict(list)
for w in ws:
    g = collections.Counter()
    for c, s in w['secs'].items():
        g[GROUP.get(c, c)] += max(s, 0)
    tot.update(g)
    whole = sum(g.values()) or 1
    for c in set(GROUP.values()):
        per_work_share[c].append(g.get(c, 0) / whole)
whole = sum(tot.values())
out.append('\n## Where the time goes inside Claudopus work (all works pooled; median share per work)\n')
out.append('| part | hours | share of all time | median share in one work | works with any |')
out.append('|---|---|---|---|---|')
for c, s in tot.most_common():
    out.append(f'| {c} | {s/3600:.1f} | {100*s/whole:.0f}% | {100*q(per_work_share[c], .5):.0f}% | {sum(1 for x in per_work_share[c] if x > 0)} |')
out.append(f'\nworks: {len(ws)}; pooled hours {whole/3600:.1f}; median dispatch {q([w["dispatch"] for w in ws if w["dispatch"] is not None], .5):.0f} s; '
           f'median relay lag {q([w["relay_lag"] for w in ws if w["relay_lag"] is not None], .5):.0f} s; '
           f'median time to first real work call {q([w["first_work"] for w in ws if w["first_work"]], .5)/60:.1f} min; '
           f'handed back {sum(w["handed_back"] for w in ws)}')
open(os.path.join(D, 'summary.md'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    ks = [r for r in rows if r[0] not in ('all', '?', 'release') and r[1] and r[2]]
    fig, ax = plt.subplots(figsize=(11, 5.8), dpi=150)
    pos, data, labels, cols = [], [], [], []
    for i, (k, a, b, bt) in enumerate(ks):
        for j, (d, c) in enumerate(((b, '#9bb7d4'), (bt, '#a8c99a'), (a, '#e8a87c'))):
            if d:
                data.append(d); pos.append(i * 4 + 1 + j); cols.append(c)
        labels.append((i * 4 + 2, f'{k}\nplain {len(b)} msgs / {len(bt)} tasks\nClaudopus {len(a)}'))
    bp = ax.boxplot(data, positions=pos, widths=0.8, whis=(10, 90), showfliers=False, patch_artist=True)
    for patch, c in zip(bp['boxes'], cols):
        patch.set_facecolor(c)
    for med in bp['medians']:
        med.set_color('black')
    ax.set_yscale('log')
    ax.set_yticks([0.25, 0.5, 1, 2, 5, 10, 20, 60, 120, 240])
    ax.set_yticklabels(['15s', '30s', '1', '2', '5', '10', '20', '60', '120', '240'])
    ax.set_ylabel('minutes from your message to the result (log scale)')
    ax.set_xticks([x for x, _ in labels])
    ax.set_xticklabels([l for _, l in labels], fontsize=8)
    from matplotlib.patches import Patch
    ax.legend(handles=[Patch(color='#9bb7d4', label='plain: one message'), Patch(color='#a8c99a', label='plain: one task (message + follow-ups, Claude busy)'),
                       Patch(color='#e8a87c', label='Claudopus: one piece of work')], fontsize=8, loc='upper left')
    ax.set_title('Time from your message to the result. Box = middle half, line = median, whiskers 10th-90th.\n'
                 'Leaves out waiting on your answers, the Mac asleep, and work stopped mid-step until restarted', fontsize=9)
    ax.grid(axis='y', alpha=.3)
    fig.tight_layout()
    fig.savefig(os.path.join(D, 'chart.png'))
    print('chart written')
except Exception as ex:
    print('no chart:', ex)
