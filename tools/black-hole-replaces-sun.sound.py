# hit list for sound-v2.py, timed to p_black-hole-replaces-sun.html (D=22.0 s). No shrill sounds: low wood/marimba only, root 55 Hz.
# Hook -> deep thud as the Sun becomes a black hole -> soft marimba on "inside Mercury's orbit" -> a slow rising wood pulse as
# M87* grows and swallows each planet orbit (one hit per orbit crossed) -> warm resolve on Voyager -> loop tail.
import json,sys,math
H=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,3),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    H.append(d)
h(0.03,'marimba',.34,0,note=0)
h(2.6,'wood',.85,0,f=42); h(2.62,'marimba',.3,0,note=-3)           # Sun -> black hole
h(5.6,'marimba',.26,-.2,note=2); h(6.4,'marimba',.28,.2,note=4)    # inside Mercury's orbit
h(8.8,'wood',.9,0,f=38); h(8.82,'marimba',.32,0,note=-5)            # M87*
# orbit crossings: bhR grows log-linearly (eio) from 12.5 to 19200 over 9.0-15.2 s
PL=[57.9,108.2,149.6,228.0,778.5,1432.0,2867.0,4515.0,5906.4]
def bh(s):
    u=min(max((s-9.0)/6.2,0),1); u=4*u**3 if u<.5 else 1-(-2*u+2)**3/2
    return math.exp(math.log(12.5)+(math.log(19200)-math.log(12.5))*u)
for i,r in enumerate(PL):
    s=9.0
    while bh(s)<r and s<15.2: s+=0.01
    h(s,'wood',.38+.04*i,(-.4+.1*i),f=58+3*i)
h(15.6,'marimba',.3,0,note=2); h(16.2,'marimba',.26,.2,note=4)
for i,n in enumerate([0,2,4,7]): h(18.6+i*.3,'marimba',.22+.03*i,-.2+.12*i,note=n)
h(21.1,'marimba',.26,0,note=0)
H.sort(key=lambda q:q['t'])
cfg=dict(dur=22.0,seed=40,root=55,bed='space',bed_db=8,wet=.24,hits=H,swells=[[8.8,15.2,.4],[15.2,18.6,.25]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
