# hit list for sound-v2.py from planet-speed-race.js (window.MODEL.SHOW = time each launched planet becomes half visible)
# Hard rule (5 Nov): no shrill sounds -> only marimba/wood, root 80 Hz (all fundamentals 160-720 Hz), no bell/glass.
import json,sys
KPX=10.67286225110268
R={"MERCURY":24,"VENUS":34,"MARS":29,"JUPITER":46,"SATURN":2.27*36,"URANUS":38,"NEPTUNE":37}
V={"MERCURY":47.4,"VENUS":35.0,"MARS":24.1,"JUPITER":13.1,"SATURN":9.7,"URANUS":6.8,"NEPTUNE":5.4}
SHOW=[[n,8.0+(R[n]+35)/(V[n]*KPX),V[n]] for n in R]
hits=[dict(t=0.04,kind='wood',note=2,vel=.20,pan=-.3)]                       # loop start
for t in [3.6,7.4,10.6,14.6,18.8,22.4,26.0,30.6,35.3]:                        # card changes: soft low wood tick
    hits.append(dict(t=t,kind='wood',note=3,vel=.26,pan=0))
rank=sorted(SHOW,key=lambda s:-s[2])
for i,(n,t,v) in enumerate(rank):                                           # launches: faster planet = higher (still mid) note
    hits.append(dict(t=t-.02,kind='marimba',note=6-i,vel=.30,pan=-.35+.1*i))
hits+=[dict(t=1000/29.78,kind='marimba',note=3,vel=.30,pan=0),dict(t=1000/29.78+.14,kind='marimba',note=5,vel=.24,pan=0)]  # 1,000 km
hits+=[dict(t=34.4+.2*i,kind='marimba',note=4-2*i,vel=.18-.03*i,pan=(-.2,.2,0)[i]) for i in range(3)]   # others fade out
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=36,seed=36,root=80,bed='space',bed_db=12,wet=.22,hits=hits,swells=[[22.4,30.6,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
