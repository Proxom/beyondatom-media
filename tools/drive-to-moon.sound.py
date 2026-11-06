# hit list for sound-v2.py from drive-to-moon.js. Hard rule (5 Nov): no shrill sounds -> only marimba/wood, root 80 Hz.
import json,sys
hits=[dict(t=0.04,kind='wood',note=2,vel=.20,pan=-.2)]                     # loop start
for t in [7.2,10.2,16.3,19.0,24.7]:                                         # card changes: soft low wood tick
    hits.append(dict(t=t,kind='wood',note=3,vel=.26,pan=0))
for i,t in enumerate([7.0,16.1,24.6]):                                      # arrivals: Moon, Sun, Proxima (lower each time = farther)
    hits+=[dict(t=t,kind='marimba',note=5-i,vel=.32,pan=.25),dict(t=t+.16,kind='marimba',note=3-i,vel=.24,pan=.15)]
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=27,seed=27,root=80,bed='space',bed_db=12,wet=.22,hits=hits,swells=[[9.8,10.8,.3],[18.4,19.4,.35]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
