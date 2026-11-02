# hit list for sound-v2.py from the planets-fit-moon.js timing model (window.MODEL: lands, NOUT0, NIN0)
import json,sys
LANDS={'JUPITER':1.0,'SATURN':2.35,'URANUS':3.3,'NEPTUNE':4.2,'MARS':5.3,'VENUS':6.0,'MERCURY':6.7}
NOTE={'JUPITER':0,'SATURN':1,'URANUS':3,'NEPTUNE':4,'MARS':7,'VENUS':6,'MERCURY':8}   # bigger planet = lower note
PAN={'JUPITER':-.25,'SATURN':.25,'URANUS':.25,'NEPTUNE':.25,'MARS':-.2,'VENUS':-.2,'MERCURY':-.2}
NOUT0,NIN0,NIN=13.69,23.84,.7
hits=[]
for n,t in LANDS.items():
    hits.append(dict(t=t,kind='marimba',note=NOTE[n],vel=.55 if NOTE[n]<3 else .45,pan=PAN[n]))
for t in [3.6,11.8,14.0,21.4]:                        # card / counter changes: soft wood tick
    hits.append(dict(t=t,kind='wood',note=5,vel=.32,pan=0))
hits+= [dict(t=8.2,kind='bell',note=5,vel=.42,pan=0),dict(t=8.32,kind='bell',note=7,vel=.32,pan=0)]   # THEY FIT
hits.append(dict(t=NOUT0,kind='bell',note=1,vel=.36,pan=.35))          # Neptune pushed out: low soft bell
hits.append(dict(t=17.2,kind='bell',note=0,vel=.34,pan=0))             # AT ITS CLOSEST card
hits+= [dict(t=NIN0+NIN,kind='glass',note=7,vel=.40,pan=.1),dict(t=NIN0+NIN+.12,kind='glass',note=9,vel=.30,pan=.1)]  # fits again
hits+= [dict(t=26.3,kind='bell',note=5,vel=.40,pan=0),dict(t=26.42,kind='bell',note=7,vel=.30,pan=0),dict(t=26.54,kind='bell',note=9,vel=.24,pan=0)]
hits+= [dict(t=33.5+.2*i,kind='marimba',note=6-2*i,vel=.30-.04*i,pan=(-.2,.2,-.2)[i]) for i in range(3)]   # planets slide out (loop reset)
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=35,seed=41,root=110,bed='space',bed_db=13,wet=.22,hits=hits,swells=[[12.6,16.6,.3],[21.6,25.6,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
