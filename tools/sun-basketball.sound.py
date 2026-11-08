# hit list for sound-v2.py, timed to p_sun-basketball.html. Hard rule: no shrill sounds -> only low wood/marimba (no bell/glass), root 80 Hz.
import json,sys
H=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,4),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    H.append(d)
h(0.05,'marimba',.3,-.2,note=0)                                   # hook
for t,n,p in [(3.9,1,.3),(6.6,2,.45),(7.9,3,.55)]: h(t,'marimba',.32,p,note=n)  # Earth, Jupiter, Neptune pop in
for a in [2.7,5.6,7.9,10.1,13.0,19.4,21.5]: h(a,'wood',.2,0,note=3)            # card changes (soft wood)
h(10.75,'wood',.5,0,f=55)                                          # cut to the globe: low thump
for i in range(6): h(13.0+i*0.7,'marimba',.16,-.4+i*.15,note=i%5)  # the arc keeps going
h(15.6,'marimba',.3,.35,note=4)                                    # London
h(17.1,'wood',.8,.4,f=48); h(17.13,'marimba',.36,.4,note=0)        # the ping-pong ball: deep landing
h(23.22,'marimba',.3,-.2,note=0)                                   # loop
H.sort(key=lambda q:q['t'])
cfg=dict(dur=23.6,seed=52,root=80,bed='space',bed_db=8,wet=.22,hits=H,swells=[[8.5,11.0,.3],[13.0,17.2,.3],[19.0,21.0,.2]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
