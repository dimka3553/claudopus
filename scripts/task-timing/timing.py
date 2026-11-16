#!/usr/bin/env python3
"""Time every task in Claude Code's transcripts: Claudopus work against plain chats.

Reads ~/.claude/projects (read only). Writes, into the folder given as argv[1]:
  works.json   one row per Claudopus piece of work (a background agent the chat started),
               with its wall time and where its time went, by category
  plain.json   one row per typed message in a plain chat (no Claudopus work in it)
  texts.json   message openers for classifying task kinds (private: keep out of the repo)
Prints a `progress:` line as it goes.
"""
import json, glob, os, re, sys, datetime, collections

P = os.path.expanduser('~/.claude/projects')
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
IDLE_LOST = 30 * 60      # an idle stretch longer than this with no reason is time lost
PLAIN_TURN_GAP = 30 * 60  # in a plain chat, a quiet stretch longer than this ends the turn


def ts(s):
    return datetime.datetime.fromisoformat(s.replace('Z', '+00:00')).timestamp()


def load(path):
    out = []
    with open(path, errors='replace') as f:
        for line in f:
            try:
                out.append(json.loads(line))
            except Exception:
                pass
    return out


def text_of(e):
    mc = (e.get('message') or {}).get('content')
    if isinstance(mc, str):
        return mc
    if isinstance(mc, list):
        return '\n'.join(x.get('text', '') for x in mc if isinstance(x, dict) and x.get('type') == 'text')
    return ''


def is_human(e):
    """A message Dima typed (not a tool result, notification, reminder or command echo)."""
    if e.get('type') != 'user' or e.get('isMeta') or e.get('isSidechain'):
        return False
    kind = (e.get('origin') or {}).get('kind')
    if kind == 'human':
        return True
    if kind is not None:
        return False
    mc = (e.get('message') or {}).get('content')
    if isinstance(mc, list) and any(isinstance(x, dict) and x.get('type') == 'tool_result' for x in mc):
        return False
    t = text_of(e).strip()
    if not t or t.startswith('<') or t.startswith('This session is being continued') or t.startswith('[Request interrupted'):
        return False
    return True


CHECK_RE = re.compile(r'second look|second check|check (?:the|that|what|it)|look(?:s)? for what|review|verif|audit|look over|what is wrong|what\'s wrong|wrong with|fresh eyes|cross-?check|double-?check', re.I)
PICT_RE = re.compile(r'screenshot|screen ?shot|captur|render|playwright|puppeteer|chrome|browser|picture|mockup|mock-up|sheet|image|\bpng\b|\.png|\.jpg|magick|sips|montage|screencapture|before.after|contact sheet|thumbnail|draw', re.I)
TEST_RE = re.compile(r'\btest|pytest|vitest|jest|\btsc\b|build|validate|guard\.mjs|lint|xcodebuild|compile|typecheck|type check', re.I)
REL_RE = re.compile(r'bin/release|release|gh run|gh pr|checks?\b.*(github|ci)|github.*checks|git push|deploy|vercel|publish', re.I)
WAIT_RE = re.compile(r'^\s*(wait|watch)\b|\bsleep \d|until .*; do|wait for', re.I)
GIT_RE = re.compile(r'^\s*(cd [^&]*&&\s*)?git (merge|commit|rebase|worktree|fetch|pull|checkout|switch|branch|stash|add|status|log|diff)', re.I)
MEM_PATH = re.compile(r'\.claude/claudopus|NOTES\.md|CLAUDE\.md|AGENTS\.md|/streams/|/words/|/rules/', re.I)


def tool_cat(name, inp, helper_desc):
    """Category of one tool call."""
    inp = inp or {}
    if name in ('mcp__claudopus__note', 'mcp__claudopus__todo', 'mcp__claudopus__waits',
                'mcp__progress__note', 'mcp__progress__todo', 'TodoWrite'):
        return 'card'
    if name == 'mcp__claudopus__ask':
        return 'ask'
    if name in ('mcp__claudopus__update', 'mcp__claudopus__recall'):
        return 'notes'
    if name == 'SubagentHandback':
        return 'report'
    if name == 'Agent':
        d = inp.get('description', '')
        if CHECK_RE.search(d):
            return 'check'
        if PICT_RE.search(d):
            return 'pictures'
        return 'helpers'
    if name in ('SendMessage', 'TaskStop', 'TaskOutput'):
        return 'helpers'
    if name == 'Monitor':
        return 'waitcmd'
    if name.startswith('mcp__Claude_Browser') or name.startswith('mcp__computer'):
        return 'pictures'
    if name in ('Read', 'Edit', 'Write', 'NotebookEdit'):
        p = inp.get('file_path', '')
        if re.search(r'\.(png|jpe?g|gif|webp|svg)$', p, re.I):
            return 'pictures'
        if MEM_PATH.search(p):
            return 'startup' if name == 'Read' else 'notes'
        if re.search(r'mockups?/|\.html$', p) and name != 'Read':
            return 'pictures'
        return 'work'
    if name == 'Bash':
        d = inp.get('description', '') or ''
        c = inp.get('command', '') or ''
        if 'bin/release' in c:
            return 'release'
        if WAIT_RE.search(d) or re.search(r'(^|\s)sleep \d', c):
            if re.search(r'second|checker|check(?!s)|review|look', d, re.I):
                return 'wait-check'
            if re.search(r'github|release|deploy|\bchecks\b|\bci\b|vercel|push', d, re.I):
                return 'release'
            if re.search(r'picture|render|capture|screenshot|mockup|sheet', d, re.I):
                return 'wait-pictures'
            if re.search(r'helper|agent|first|third|fourth|last|final|other|all|both|remaining|round', d, re.I):
                return 'wait-helpers'
            if re.search(r'test|build', d, re.I):
                return 'tests'
            return 'waitcmd'
        if re.search(r'bin/admin|bin/secret', c):
            return 'work'
        if REL_RE.search(d) or re.search(r'gh run (watch|view)|gh pr (checks|create|merge)|git push|vercel', c):
            return 'release'
        if TEST_RE.search(d) or re.search(r'plugin test|pytest|npm (run )?test|guard\.mjs|build\.mjs|tsc -p|plugin validate', c):
            return 'tests'
        if PICT_RE.search(d) or re.search(r'screencapture|playwright|chrome|magick|sips |montage', c):
            return 'pictures'
        if GIT_RE.search(c) and not re.search(r'git (log|diff|status)', c) or 'worktree add' in c:
            return 'git'
        if MEM_PATH.search(c) and re.search(r'\b(cat|head|tail|grep|ls|wc|sed -n)\b', c):
            return 'startup'
        return 'work'
    if name in ('Grep', 'Glob', 'WebFetch', 'WebSearch', 'Skill', 'ToolSearch'):
        return 'work'
    return 'work'


def resume_cat(e, helper_cat_by_desc):
    """Why an idle work agent started again."""
    t = text_of(e)
    kind = (e.get('origin') or {}).get('kind')
    if re.match(r'\s*Your response above was cut of', t):
        return 'lost'
    m = re.search(r'Your helper "([^"]+)"', t) or re.search(r'Agent "([^"]+)"', t)
    if m:
        return 'wait-' + helper_cat_by_desc.get(m.group(1), 'helpers')
    if kind == 'task-notification' or '<task-notification>' in t:
        if re.search(r'Background command|shell|bash', t, re.I):
            return 'wait-cmd'
        return 'wait-helpers'
    if re.search(r'Dima pressed|message from Dima|steer from Dima|A message from Dima|answer to your ask', t):
        return 'wait-dima'
    if kind in ('coordinator', 'peer') or re.match(r'\s*The message (sent to you just now|that started you)', t):
        return 'wait-dima'
    return 'wait-other'


GLOBAL = []


def build_global():
    import bisect
    for f in glob.glob(P + '/**/*.jsonl', recursive=True):
        try:
            if os.path.getmtime(f) < 1794000000:  # before 2026-11-02
                continue
        except OSError:
            continue
        with open(f, errors='replace') as fh:
            for line in fh:
                i = line.find('"timestamp":"')
                if i >= 0:
                    try:
                        GLOBAL.append(ts(line[i + 13:i + 37].split('"')[0]))
                    except Exception:
                        pass
    GLOBAL.sort()


def silence(a, b, least=20 * 60):
    """Seconds inside [a, b] when no transcript anywhere moved for at least `least` (the Mac asleep or the app shut)."""
    import bisect
    if b - a < least:
        return 0.0
    i = bisect.bisect_right(GLOBAL, a)
    j = bisect.bisect_left(GLOBAL, b)
    pts = [a] + GLOBAL[i:j] + [b]
    return sum(y - x for x, y in zip(pts, pts[1:]) if y - x >= least)


def chat_files():
    seen = set()
    for f in sorted(glob.glob(P + '/*/*.jsonl')):
        sid = os.path.basename(f)[:-6]
        if sid in seen:
            continue
        seen.add(sid)
        yield sid, f


def analyse_agent(path, meta, start_t, full=False):
    """Timeline of one work agent: seconds per category, from its start to its first report."""
    ents = [e for e in load(path) if e.get('timestamp')]
    for e in ents:
        e['_t'] = ts(e['timestamp'])
    ents.sort(key=lambda e: e['_t'])
    if not ents:
        return None
    # helpers it started: description -> category
    helper_cat = {}
    for e in ents:
        mc = (e.get('message') or {}).get('content')
        if e.get('type') == 'assistant' and isinstance(mc, list):
            for x in mc:
                if isinstance(x, dict) and x.get('type') == 'tool_use' and x.get('name') == 'Agent':
                    helper_cat[x['input'].get('description', '')] = tool_cat('Agent', x['input'], None)
    # where it hands back
    hand_t = None
    for e in ents:
        mc = (e.get('message') or {}).get('content')
        if e.get('type') == 'assistant' and isinstance(mc, list) and any(
                isinstance(x, dict) and x.get('type') == 'tool_use' and x.get('name') == 'SubagentHandback' for x in mc):
            hand_t = e['_t']
            break
    end_t = hand_t if (hand_t and not full) else ents[-1]['_t']
    # its helpers' own runs: (start, end, category), to tell which one a wait was for
    kids = []
    me = os.path.basename(path)[:-6].replace('agent-', '')
    for km in glob.glob(os.path.join(os.path.dirname(path), '*.meta.json')):
        try:
            kmeta = json.load(open(km))
        except Exception:
            continue
        if kmeta.get('parentAgentId') != me:
            continue
        t0 = t1 = None
        with open(km[:-10] + '.jsonl', errors='replace') as fh:
            for line in fh:
                i = line.find('"timestamp":"')
                if i >= 0:
                    try:
                        tt = ts(line[i + 13:i + 37].split('"')[0])
                    except Exception:
                        continue
                    t0 = tt if t0 is None else t0
                    t1 = tt
        if t0:
            kids.append((t0, t1, tool_cat('Agent', {'description': kmeta.get('description', '')}, None)))

    def by_kids(cat, a, b):
        """A wait on helpers goes to what the helpers running then were doing."""
        if cat not in ('wait-helpers', 'wait-check', 'wait-pictures', 'helpers', 'helpers-spawn', 'check', 'pictures'):
            return {cat: 1.0}
        mid = (a + b) / 2
        run = [c for t0, t1, c in kids if t0 <= mid <= t1]
        if not run:
            return {cat: 1.0}
        out = collections.Counter()
        for c in run:
            out['wait-' + c if c in ('check', 'pictures') else 'wait-helpers'] += 1 / len(run)
        return out
    # message id -> categories of the tools that message calls
    msg_cats = collections.defaultdict(list)
    for e in ents:
        mc = (e.get('message') or {}).get('content')
        if e.get('type') == 'assistant' and isinstance(mc, list):
            mid = (e.get('message') or {}).get('id')
            for x in mc:
                if isinstance(x, dict) and x.get('type') == 'tool_use':
                    msg_cats[mid].append(tool_cat(x['name'], x.get('input'), helper_cat))
    secs = collections.Counter()
    pending = {}      # tool_use_id -> category
    idle = False      # its turn ended (text with no tool call pending)
    prev = start_t
    first_work_t = None
    long_events = []
    counts = collections.Counter()
    first_check_result = None
    for i, e in enumerate(ents):
        t = min(e['_t'], end_t)
        if t < prev:
            t = prev
        gap = t - prev
        typ = e.get('type')
        mc = (e.get('message') or {}).get('content')
        # what this gap was: first take out time the whole Mac was silent
        if gap > 0:
            sl = silence(prev, t)
            if sl:
                secs['asleep'] += sl
                long_events.append(('asleep', prev, sl, []))
                gap -= sl
        if gap > 0:
            if pending:
                cats = list(pending.values())
                # quick calls sent with a slow one return when it does: the stretch belongs to the slow one
                quick = {'card', 'notes', 'ask', 'helpers-spawn', 'startup'}
                slow = [c for c in cats if c not in quick]
                if slow:
                    cats = slow
                if gap > IDLE_LOST and not slow:
                    # only quick calls, sitting for half an hour: a prompt nobody answered, or the Mac asleep
                    secs['lost'] += gap
                    long_events.append(('stuck call', prev, gap, cats))
                else:
                    for c in cats:
                        for c2, f in by_kids(c, prev, t).items():
                            secs[c2] += gap * f / len(cats)
            elif idle:
                rc = resume_cat(e, helper_cat) if typ == 'user' else 'wait-other'
                if rc == 'wait-other' and gap > IDLE_LOST:
                    rc = 'lost'
                for c2, f in by_kids(rc, prev, t).items():
                    secs[c2] += gap * f
                if gap > 120:
                    long_events.append((rc, prev, gap, []))
            elif typ == 'assistant':
                mid = (e.get('message') or {}).get('id')
                cats = msg_cats.get(mid) or ['think']
                if gap > IDLE_LOST:
                    secs['lost'] += gap
                    long_events.append(('slow answer', prev, gap, cats))
                else:
                    for c in cats:
                        secs['model-' + c] += gap / len(cats)
            else:
                is_result = isinstance(mc, list) and any(isinstance(x, dict) and x.get('type') == 'tool_result' for x in mc)
                if typ == 'user' and not is_result and gap > 120:
                    # it had stopped mid-step (ended, killed or cut off) and something started it again
                    rc = resume_cat(e, helper_cat)
                    k = 'restarted' if rc in ('wait-dima', 'wait-other', 'lost') else rc
                    secs[k] += gap
                    long_events.append((k, prev, gap, []))
                elif typ == 'api-request' and gap > 60 and ents[i - 1].get('type') == 'api-request':
                    secs['api-retry'] += gap
                    long_events.append(('api-retry', prev, gap, []))
                else:
                    secs['overhead'] += gap
        prev = t
        if e['_t'] >= end_t and typ != 'assistant':
            break
        # update state
        if typ == 'assistant' and isinstance(mc, list):
            uses = [x for x in mc if isinstance(x, dict) and x.get('type') == 'tool_use']
            for x in uses:
                c = tool_cat(x['name'], x.get('input'), helper_cat)
                counts[c] += 1
                if x['name'] == 'Agent' and x['input'].get('run_in_background', True):
                    c = 'helpers-spawn'
                pending[x['id']] = c
                if first_work_t is None and c not in ('card', 'startup', 'git', 'notes'):
                    first_work_t = e['_t']
            if uses:
                idle = False
            elif any(isinstance(x, dict) and x.get('type') == 'text' for x in mc) and not pending:
                idle = True
            if any(x['name'] == 'SubagentHandback' for x in uses) and not full:
                break
        elif typ == 'user':
            if isinstance(mc, list):
                for x in mc:
                    if isinstance(x, dict) and x.get('type') == 'tool_result':
                        pending.pop(x.get('tool_use_id'), None)
            rc = resume_cat(e, helper_cat)
            if rc == 'wait-check' and first_check_result is None:
                first_check_result = e['_t']
            if e.get('type') == 'user' and not (isinstance(mc, list) and any(isinstance(x, dict) and x.get('type') == 'tool_result' for x in mc)):
                idle = False
        elif typ == 'system' and e.get('subtype') in ('api_error',):
            pass
        # an assistant turn that ends with nothing pending and no tool call: idle
        if typ == 'assistant' and not pending:
            nxt = ents[i + 1] if i + 1 < len(ents) else None
            if nxt is None or nxt.get('type') == 'user':
                idle = True
    secs['helpers'] += secs.pop('helpers-spawn', 0)
    return dict(end=end_t, handed_back=bool(hand_t), secs=dict(secs), first_work=first_work_t,
                long=[(k, round(a), round(g), c) for k, a, g, c in long_events], counts=dict(counts),
                after_check=(end_t - first_check_result) if first_check_result else None)


SEEN_PLAIN = set()


def rounds_of(path):
    """Later rounds: Dima's words sent into a work after its first report, to the report that answers them."""
    ents = [e for e in load(path) if e.get('timestamp')]
    hands, said = [], []
    for e in ents:
        t = ts(e['timestamp'])
        mc = (e.get('message') or {}).get('content')
        if e.get('type') == 'assistant' and isinstance(mc, list) and any(
                isinstance(x, dict) and x.get('type') == 'tool_use' and x.get('name') == 'SubagentHandback' for x in mc):
            hands.append(t)
        elif e.get('type') == 'user' and resume_cat(e, {}) == 'wait-dima':
            said.append(t)
    out = []
    for d in said:
        if not hands or d <= hands[0]:
            continue
        nxt = next((h for h in hands if h > d), None)
        if nxt and (not out or d > out[-1][0] + out[-1][1]):
            out.append((d, nxt - d))
    return out


def main():
    print('progress: 0/1 steps reading every timestamp', flush=True)
    build_global()
    print(f'progress: 1/1 steps reading every timestamp ({len(GLOBAL)})', flush=True)
    files = [x for x in chat_files() if '-private-tmp' not in x[1]]
    works, plain, texts = [], [], {}
    for n, (sid, f) in enumerate(files):
        if n % 50 == 0:
            print(f'progress: {n}/{len(files)} chats reading', flush=True)
        try:
            ents = [e for e in load(f) if e.get('timestamp')]
        except Exception:
            continue
        for e in ents:
            e['_t'] = ts(e['timestamp'])
        ents.sort(key=lambda e: e['_t'])
        humans = [e for e in ents if is_human(e)]
        # messages typed while the chat was busy are queued, not written as user entries
        typed = humans + [e for e in ents if e.get('type') == 'queue-operation' and isinstance(e.get('content'), str)
                          and e['content'].strip() and not e['content'].lstrip().startswith('<')]
        typed.sort(key=lambda e: e['_t'])
        sub = os.path.join(os.path.dirname(f), sid, 'subagents')
        metas = {}
        for m in glob.glob(sub + '/*.meta.json'):
            try:
                metas[os.path.basename(m)[:-10]] = json.load(open(m))
            except Exception:
                pass
        # Claudopus work: depth-1 agents whose brief is the mod's
        top = {}
        for aid, meta in metas.items():
            if meta.get('spawnDepth') not in (1, None):
                continue
            ap = os.path.join(sub, aid + '.jsonl')
            if not os.path.exists(ap):
                continue
            with open(ap, errors='replace') as fh:
                head = fh.read(60000)
            if 'told to every piece of work' not in head and 'Dima follows this work in a panel' not in head:
                continue
            top[aid] = meta
        tool_t = {}
        for e in ents:
            mc = (e.get('message') or {}).get('content')
            if e.get('type') == 'assistant' and isinstance(mc, list):
                for x in mc:
                    if isinstance(x, dict) and x.get('type') == 'tool_use':
                        tool_t[x['id']] = e['_t']
        asst_text_t = [e['_t'] for e in ents if e.get('type') == 'assistant' and text_of(e).strip()]
        for aid, meta in top.items():
            ap = os.path.join(sub, aid + '.jsonl')
            first = None
            with open(ap, errors='replace') as fh:
                for line in fh:
                    try:
                        e = json.loads(line)
                    except Exception:
                        continue
                    if e.get('timestamp'):
                        first = ts(e['timestamp'])
                        break
            spawn = tool_t.get(meta.get('toolUseId'), first)
            if spawn is None:
                continue
            before = [h for h in typed if h['_t'] <= spawn + 1]
            msg = before[-1] if before else None
            start_guess = False
            if msg and spawn - msg['_t'] > 300:
                # started by a notification or after a compaction, not by that message: count from the start
                msg, start_guess = None, True
            a = analyse_agent(ap, meta, spawn)
            if not a:
                continue
            fa = analyse_agent(ap, meta, spawn, full=True)
            relay = next((t for t in asst_text_t if t >= a['end']), None)
            if relay is not None and relay - a['end'] > 3600:
                relay = None
            msg_t = msg['_t'] if msg else (spawn if start_guess else None)
            got = relay or a['end']
            row = dict(id=aid, chat=sid, folder=os.path.basename(os.path.dirname(f)), title=meta.get('description', ''),
                       model=meta.get('model'), msg_t=msg_t, spawn_t=spawn, end_t=a['end'], relay_t=relay,
                       handed_back=a['handed_back'], dispatch=(spawn - msg_t) if msg_t else None,
                       relay_lag=(relay - a['end']) if relay else None, wall=(got - msg_t) if msg_t else None,
                       secs=a['secs'], first_work=(a['first_work'] - spawn) if a['first_work'] else None,
                       full_secs=fa['secs'], full_end=fa['end'], full_long=fa['long'],
                       long=a['long'], counts=a['counts'], after_check=a['after_check'], start_guess=start_guess,
                       rounds=rounds_of(ap))
            works.append(row)
            if msg:
                texts['w:' + aid] = (text_of(msg) or msg.get('content') or '')[:600]
        if top:
            continue
        # plain chat: one row per typed message (a chat forked or resumed copies earlier messages: count each once)
        hidx = [i for i, e in enumerate(ents) if is_human(e)]
        for k, i in enumerate(hidx):
            j_end = hidx[k + 1] if k + 1 < len(hidx) else len(ents)
            seg = ents[i:j_end]
            last = seg[0]['_t']
            end = None
            active = 0.0
            agents = 0
            tools = collections.Counter()
            prev = seg[0]['_t']
            for e in seg[1:]:
                g = e['_t'] - prev
                if g > PLAIN_TURN_GAP:
                    break
                active += g
                prev = e['_t']
                if e.get('type') == 'assistant':
                    end = e['_t']
                    mc = (e.get('message') or {}).get('content')
                    if isinstance(mc, list):
                        for x in mc:
                            if isinstance(x, dict) and x.get('type') == 'tool_use':
                                tools[tool_cat(x['name'], x.get('input'), {})] += 1
                                if x['name'] in ('Agent', 'Task'):
                                    agents += 1
            if end is None:
                continue
            dkey = (round(seg[0]['_t']), text_of(seg[0])[:80])
            if dkey in SEEN_PLAIN:
                continue
            SEEN_PLAIN.add(dkey)
            rid = f'{sid}:{k}'
            plain.append(dict(id=rid, asleep=silence(seg[0]['_t'], end) if seg[0]['_t'] > 1794003600 else 0.0, entry=(seg[0].get('entrypoint') or ''), chat=sid, folder=os.path.basename(os.path.dirname(f)), msg_t=seg[0]['_t'],
                              end_t=end, wall=end - seg[0]['_t'], agents=agents, tools=dict(tools),
                              ntools=sum(tools.values())))
            texts['p:' + rid] = text_of(seg[0])[:600]
    print(f'progress: {len(files)}/{len(files)} chats reading', flush=True)
    json.dump(works, open(os.path.join(OUT, 'works.json'), 'w'), indent=0)
    json.dump(plain, open(os.path.join(OUT, 'plain.json'), 'w'), indent=0)
    json.dump(texts, open(os.path.join(OUT, 'texts.json'), 'w'), indent=0)
    print(f'works {len(works)} plain turns {len(plain)}')


if __name__ == '__main__':
    main()
