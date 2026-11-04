# hit list for sound-v2.py from the planet-at-moon.js timeline (SEQ swaps; new body becomes visible at u~0.5 of each swap)
import json,sys
SW={'MOON':(2.7,3.5),'MARS':(5.6,6.3),'VENUS':(7.6,8.4),'NEPTUNE':(9.8,10.8),'URANUS':(13.2,14.1),'JUPITER':(16.6,17.8),'SATURN':(21.6,23.0)}
hits=[]
def at(n): a,b=SW[n]; return a+.55*(b-a)   # new body starts fading in at u=0.50
hits.append(dict(t=at('MOON'),kind='glass',note=10,vel=.30,pan=0))
hits.append(dict(t=at('MARS'),kind='glass',note=9,vel=.34,pan=0))
hits.append(dict(t=at('VENUS'),kind='glass',note=8,vel=.36,pan=0))
hits.append(dict(t=at('NEPTUNE'),kind='bell',note=6,vel=.38,pan=0))
hits.append(dict(t=at('URANUS'),kind='bell',note=5,vel=.38,pan=0))
hits+= [dict(t=at('JUPITER'),kind='bell',note=2,vel=.46,pan=0),dict(t=at('JUPITER')+.02,kind='marimba',note=0,vel=.30,pan=0)]
hits+= [dict(t=at('SATURN')+.12*i,kind='bell',note=n,vel=.44-.06*i,pan=(-.15,.15,0)[i]) for i,n in enumerate((0,2,4))]
for t in [5.6,7.6,13.2,16.6,21.0,26.6]:
    hits.append(dict(t=t,kind='wood',note=5,vel=.26,pan=-.1))
hits.append(dict(t=0.05,kind='wood',note=2,vel=.20,pan=0))
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=30.5,seed=77,root=98,bed='space',bed_db=12,wet=.24,hits=hits,swells=[[16.6,17.8,.35],[21.6,23.0,.45]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
