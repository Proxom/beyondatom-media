# hit list for tools/sound-v2.py (soft wood/marimba only, root 80 Hz; no shrill sounds)
import json,sys
cuts=[2.0,4.55,7.0,10.05,12.4,14.4,17.5]
hits=[dict(t=0.04,kind='wood',note=2,vel=.20,pan=-.2)]
hits+=[dict(t=t,kind='wood',note=3,vel=.22,pan=(-1)**i*.2) for i,t in enumerate(cuts)]
# counter 0 -> 3,100 over 17.6-19.5: four rising marimba notes, then the reveal
hits+=[dict(t=17.6+i*0.45,kind='marimba',note=2+i,vel=.22+.02*i,pan=.25) for i in range(4)]
hits+=[dict(t=19.5,kind='marimba',note=6,vel=.32,pan=.2),dict(t=19.66,kind='marimba',note=4,vel=.24,pan=.1)]
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=21,seed=21,root=80,bed='space',bed_db=12,wet=.22,hits=hits,swells=[[16.8,17.6,.3],[19.4,20.6,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
