# hit list for sound-v2.py from the phobos-rises-west.js timing model (rise/set times printed by window.MODEL)
import json,sys
RISE=[1.00,15.80,29.49,32.57]; SET=[3.36,25.90,30.67,33.75]; C1=34.87
hits=[]
for t in [3.4,7.6,11.8,15.6,20.4,25.6,35.9,39.6,43.6]:            # card changes: soft marimba
    hits.append(dict(t=t,kind='marimba',note=2 if t<35 else 0,vel=.4,pan=0))
for i,t in enumerate(RISE):                                       # Phobos clears the western horizon: bright glass pair
    hits+= [dict(t=t,kind='glass',note=7+i,vel=.42,pan=.3),dict(t=t+.12,kind='glass',note=9+i,vel=.3,pan=.3)]
for t in SET:                                                     # sets in the east: low soft bell
    hits.append(dict(t=t,kind='bell',note=3,vel=.34,pan=-.3))
hits.append(dict(t=C1,kind='bell',note=5,vel=.45,pan=0))          # one full Mars spin completed
for k,t in enumerate([39.80,39.86,39.93,40.02,40.12]):           # Phobos breaks up into a ring: soft glass cascade
    hits.append(dict(t=t,kind='glass',note=10-k,vel=.26-.03*k,pan=(-1)**k*.25))
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=46,seed=37,root=110,bed='space',bed_db=13,wet=.22,hits=hits,swells=[[13.4,20.0,.25],[28.0,35.0,.3],[36.4,39.8,.35]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
