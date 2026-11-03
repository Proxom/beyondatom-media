# hit list for sound-v2.py from the iss-always-falling.js timing model (window.MODEL)
import json,sys
SHOT0=[5.8,10.0,14.4,19.4]; SHOT1=[8.2,12.8,17.6,23.6]; T5=24.6; TPASS=28.60; TRET=34.0
LANDPAN=[.25,.35,.45,.45]
hits=[]
for t in [3.2,31.6,35.6,39.0,42.4,45.6,48.3]:                     # card changes: soft marimba
    hits.append(dict(t=t,kind='marimba',note=2 if t<45 else 0,vel=.36,pan=0))
for i,t in enumerate(SHOT0+[T5]):                                  # cannon: soft low wood thump + small marimba
    hits.append(dict(t=t,kind='wood',note=0,vel=.5,pan=-.2))
    hits.append(dict(t=t+.03,kind='marimba',note=4+i,vel=.28,pan=-.15))
for i,t in enumerate(SHOT1):                                       # landing: wood + low bell
    hits.append(dict(t=t,kind='wood',note=1,vel=.42,pan=LANDPAN[i]))
    hits.append(dict(t=t+.02,kind='bell',note=1,vel=.22,pan=LANDPAN[i]))
hits+= [dict(t=TPASS,kind='glass',note=8,vel=.34,pan=.2),dict(t=TPASS+.12,kind='glass',note=10,vel=.26,pan=.2)]
hits+= [dict(t=TRET,kind='bell',note=5,vel=.44,pan=0),dict(t=TRET+.15,kind='glass',note=9,vel=.3,pan=0),dict(t=TRET+.3,kind='glass',note=11,vel=.24,pan=0)]
hits.append(dict(t=36.2,kind='glass',note=6,vel=.24,pan=.3))      # fall arrow appears
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=49,seed=41,root=110,bed='space',bed_db=13,wet=.22,hits=hits,swells=[[24.6,34.0,.3],[34.6,42.2,.15]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
