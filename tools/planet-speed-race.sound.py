# hit list for sound-v2.py from planet-speed-race.js (window.MODEL.SHOW = time each launched planet becomes half visible)
# Hard rule (5 Nov): no shrill sounds -> only marimba/wood, root 80 Hz (all fundamentals 160-720 Hz), no bell/glass.
import json,sys
SHOW=[["MERCURY",8.166,47.4],["VENUS",8.253,35],["MARS",8.347,24.1],["JUPITER",8.767,13.1],["SATURN",9.402,9.7],["URANUS",9.36,6.8],["NEPTUNE",9.694,5.4]]
hits=[dict(t=0.04,kind='wood',note=2,vel=.20,pan=-.3)]                       # loop start
for t in [3.6,7.4,10.6,14.6,18.8,22.2,26.6,30.6,35.0]:                        # card changes: soft low wood tick
    hits.append(dict(t=t,kind='wood',note=3,vel=.26,pan=0))
rank=sorted(SHOW,key=lambda s:-s[2])
for i,(n,t,v) in enumerate(rank):                                           # launches: faster planet = higher (still mid) note
    hits.append(dict(t=t-.02,kind='marimba',note=6-i,vel=.30,pan=-.35+.1*i))
hits+=[dict(t=1000/29.78,kind='marimba',note=3,vel=.30,pan=0),dict(t=1000/29.78+.14,kind='marimba',note=5,vel=.24,pan=0)]  # 1,000 km
hits+=[dict(t=34.2+.2*i,kind='marimba',note=4-2*i,vel=.18-.03*i,pan=(-.2,.2,0)[i]) for i in range(3)]   # others fade out
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=36,seed=36,root=80,bed='space',bed_db=12,wet=.22,hits=hits,swells=[[18.8,26.6,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
