# Test/build and release time by repo, and the slowest test commands
import json,glob,os,collections,sys,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import timing as T
W={x['id'] for x in json.load(open(sys.argv[1]))}
by=collections.Counter(); n=collections.Counter(); cmd=collections.Counter(); cn=collections.Counter()
for m in glob.glob(T.P+'/*/*/subagents/*.meta.json'):
    aid=os.path.basename(m)[:-10]
    if aid not in W: continue
    pend={}
    for e in T.load(m[:-10]+'.jsonl'):
        if not e.get('timestamp'): continue
        t=T.ts(e['timestamp']); mc=(e.get('message') or {}).get('content')
        if e.get('type')=='assistant' and isinstance(mc,list):
            for x in mc:
                if x.get('type')=='tool_use' and x['name']=='Bash':
                    c=T.tool_cat('Bash',x['input'],{})
                    if c in('tests','release'):
                        c2=x['input'].get('command','')
                        repo='claudopus' if 'claudopus' in c2 or 'claudopus' in (e.get('cwd') or '') else 'other'
                        key=re.sub(r'\s+',' ',re.sub(r'/[^ ]*/','',c2))[:60]
                        pend[x['id']]=(t,c,repo,key)
        if e.get('type')=='user' and isinstance(mc,list):
            for x in mc:
                if x.get('type')=='tool_result' and x.get('tool_use_id') in pend:
                    t0,c,repo,key=pend.pop(x['tool_use_id']); d=t-t0
                    by[(c,repo)]+=d; n[(c,repo)]+=1
                    if c=='tests': cmd[key]+=d; cn[key]+=1
for k,v in by.most_common(): print(f'{v/3600:5.1f}h n={n[k]} median-ish mean={v/n[k]/60:.1f}min {k}')
for k,v in cmd.most_common(10): print(f'{v/3600:5.1f}h n={cn[k]} mean={v/cn[k]/60:.1f}min')
