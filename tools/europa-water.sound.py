# hit list for sound-v2.py from the europa-water.js timeline
import json,sys
hits=[dict(t=0.05,kind='wood',note=2,vel=.20,pan=0)]
for t in [4.0,9.7,12.3,19.7,25.4,31.7,34.9]: hits.append(dict(t=t,kind='wood',note=5,vel=.24,pan=-.1))
hits+=[dict(t=7.15,kind='bell',note=4,vel=.36,pan=.45),            # Earth's ocean ball complete (right side)
       dict(t=12.4,kind='marimba',note=3,vel=.26,pan=0),dict(t=13.45,kind='glass',note=7,vel=.28,pan=.1),
       dict(t=16.0,kind='glass',note=9,vel=.22,pan=-.1),
       dict(t=24.35,kind='bell',note=2,vel=.40,pan=.4),             # Europa's ocean ball complete
       dict(t=27.45,kind='glass',note=6,vel=.30,pan=-.35),dict(t=27.62,kind='glass',note=8,vel=.30,pan=.35)]
hits+=[dict(t=28.0+.12*i,kind='bell',note=n,vel=.40-.06*i,pan=(-.15,.15,0)[i]) for i,n in enumerate((0,2,4))]
hits.append(dict(t=32.75,kind='marimba',note=2,vel=.18,pan=0))
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=38,seed=91,root=98,bed='space',bed_db=12,wet=.24,hits=hits,swells=[[4.4,7.2,.30],[10.0,12.0,.30],[22.0,24.4,.35],[31.0,32.8,.25]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
