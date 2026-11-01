# v2 (40 s) hit list: v1 hits shifted +10 s after 16.6 s, plus the Earth-air beat (16.6-26.6 s)
import json,sys
v1=json.load(open('mars-blue-sunset.sound.json'))
hits=[]
for h in v1['hits']:
    h=dict(h)
    if h['t']>=16.5: h['t']+=10
    hits.append(h)
hits+= [dict(t=16.6,kind='marimba',note=1,vel=.5,pan=0),            # card: On Earth, air does the opposite
        dict(t=17.55,kind='glass',note=6,vel=.32,pan=-.1),dict(t=17.8,kind='glass',note=8,vel=.3,pan=.15),   # blue scatters all around
        dict(t=18.05,kind='glass',note=7,vel=.3,pan=-.2),dict(t=18.3,kind='glass',note=9,vel=.28,pan=.2),
        dict(t=18.9,kind='marimba',note=0,vel=.42,pan=.3),           # red beam carries on
        dict(t=21.4,kind='marimba',note=2,vel=.5,pan=0)]             # card: So our sunsets turn red
hits.sort(key=lambda h:h['t'])
sw=[[a+10 if a>=16.5 else a,b+10 if a>=16.5 else b,g] for a,b,g in v1['swells']]
cfg=dict(v1,dur=40,hits=hits,swells=sw)
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits',sw)
