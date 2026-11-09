# hit list for sound-v2.py, timed to p_iss-orbit-twist.html (D=23.0 s). Hard rule: no shrill sounds -> only low wood/marimba, root 80 Hz.
# Hook pulse -> soft marimba as the bulge appears -> a steady ticking "day" pulse through the twist beat that
# rises as the orbit swings round -> a warm resolve on the Sun-synchronous payoff, then a loop tail back to the hook.
import json,sys
H=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,3),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    H.append(d)
h(0.05,'marimba',.32,-.15,note=0)                                  # hook
for t in [3.3,7.2,12.2,16.4,19.6]: h(t,'wood',.5,0,f=46); h(t+.02,'marimba',.2,0,note=2)  # card changes: low thud
h(3.7,'marimba',.28,.25,note=1); h(4.6,'marimba',.3,-.2,note=2)    # bulge arrows pop
# twist beat 6.6-16.2: a soft "day" tick that climbs in pitch as the orbit swings a full turn
import math
for i in range(13):
    t=7.0+i*0.72
    if t>15.9: break
    h(t,'wood',.30+.012*i,(-.35+ .06*i),note=i%5)
h(13.0,'marimba',.26,.3,note=4)
# payoff resolve
for i,n in enumerate([0,2,4,7]): h(16.8+i*.3,'marimba',.22+.03*i,-.2+.12*i,note=n)
h(19.8,'marimba',.3,0,note=7); h(20.1,'marimba',.24,.2,note=9)
h(22.2,'marimba',.2,-.2,note=2)                                     # loop tail -> back to the hook note
H.sort(key=lambda q:q['t'])
cfg=dict(dur=23.0,seed=72,root=80,bed='space',bed_db=9,wet=.22,hits=H,
         swells=[[6.6,12.0,.28],[12.0,16.2,.22],[16.6,20.4,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
