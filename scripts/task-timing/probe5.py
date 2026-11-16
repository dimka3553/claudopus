# What fills "overhead" gaps (nothing running, model not writing) and long Agent calls
import json,glob,os,collections,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import timing as T
W=json.load(open(sys.argv[1]))
ids={x['id'] for x in W}
ov=collections.Counter(); ovn=collections.Counter(); hist=collections.Counter(); ag=[]
for m in glob.glob(T.P+'/*/*/subagents/*.meta.json'):
    aid=os.path.basename(m)[:-10]
    if aid not in ids: continue
    ents=[e for e in T.load(m[:-10]+'.jsonl') if e.get('timestamp')]
    for e in ents: e['_t']=T.ts(e['timestamp'])
    ents.sort(key=lambda e:e['_t'])
    pend={}
    for a,b in zip(ents,ents[1:]):
        g=b['_t']-a['_t']
        def lab(e):
            mc=(e.get('message') or {}).get('content'); k=(e.get('origin') or {}).get('kind')
            if isinstance(mc,list) and mc: 
                x=mc[0]; return e['type']+':'+(x.get('type','') if x.get('type')!='tool_use' else 'tool_use')+(':'+k if k else '')
            return e['type']+(':'+k if k else '')+(':'+e.get('subtype','') if e.get('subtype') else '')
        if b['type'] not in ('assistant',) :
            key=(lab(a),lab(b))
            ov[key]+=g; ovn[key]+=1
        mc=(a.get('message') or {}).get('content')
        if a['type']=='assistant' and isinstance(mc,list):
            for x in mc:
                if x.get('type')=='tool_use' and x['name']=='Agent': pend[x['id']]=(a['_t'],x['input'].get('run_in_background'))
        mc=(b.get('message') or {}).get('content')
        if b['type']=='user' and isinstance(mc,list):
            for x in mc:
                if x.get('type')=='tool_result' and x.get('tool_use_id') in pend:
                    t0,bg=pend.pop(x['tool_use_id']); ag.append((b['_t']-t0,bg))
for k,v in ov.most_common(14): print(f'{v/3600:5.1f}h n={ovn[k]:6d} mean={v/ovn[k]:6.1f}s {k}')
ag.sort(); print('Agent calls',len(ag),'median s',ag[len(ag)//2][0],'p90',ag[int(len(ag)*.9)][0],'>60s',sum(1 for a in ag if a[0]>60), 'bg flags', collections.Counter(str(b) for _,b in ag))
