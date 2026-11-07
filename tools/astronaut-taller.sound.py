# hit list for sound-v2.py from p_astronaut-taller.html. Hard rule (5 Nov): no shrill sounds -> only marimba/wood, root 80 Hz.
import json,sys
hits=[dict(t=0.04,kind='wood',note=2,vel=.20,pan=-.2)]                     # loop start
for t in [3.3,10.2]:                                                   # card changes: soft low wood tick
    hits.append(dict(t=t,kind='wood',note=3,vel=.24,pan=0))
# growth 171 -> 174.4 cm: one soft rising marimba note as the counter passes 172, 173, 174 (growth = smoothstep over 0-6.4 s)
import math
def tcross(frac,a,d,rising=True):
    lo,hi=0.0,1.0
    for _ in range(40):
        m=(lo+hi)/2; s=m*m*(3-2*m); s=s if rising else 1-s
        if (s<frac)==rising: lo=m
        else: hi=m
    return a+d*(lo+hi)/2
for i,cm in enumerate([172,173,174]):
    hits.append(dict(t=tcross((cm-171)/3.4,0,6.4),kind='marimba',note=3+i,vel=.26,pan=.3))
hits+=[dict(t=6.6,kind='marimba',note=6,vel=.30,pan=.25),dict(t=6.76,kind='marimba',note=4,vel=.22,pan=.15)]   # +3.4 cm reveal
for i,cm in enumerate([174,173,172]):                                       # shrinking back on Earth (falling notes)
    hits.append(dict(t=tcross((cm-171)/3.4,11.2,4.4,rising=False),kind='marimba',note=5-i,vel=.22,pan=.3))
hits.append(dict(t=15.6,kind='wood',note=1,vel=.22,pan=0))                  # settles at 171.0
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=18,seed=18,root=80,bed='space',bed_db=12,wet=.22,hits=hits,swells=[[9.9,11.0,.3],[15.9,17.0,.25]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits',[round(h['t'],2) for h in hits])
