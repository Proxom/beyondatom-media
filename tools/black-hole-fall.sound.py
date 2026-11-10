# hit list for sound-v2.py, timed to p_black-hole-fall.html (D=24.0 s). Hard rule: no shrill sounds -> low wood/marimba only, root 55 Hz.
# A clock "tick" (low wood) every real second, ticks that speed up through the 3-hour fast-forward, a slow heavy pulse
# while the friend sees you freeze, then one tick per second for the 12.8 s countdown inside, a deep thud at zero, loop tail.
import json,sys
H=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,3),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    H.append(d)
h(0.03,'marimba',.34,0,note=0)                                      # hook
for s in range(1,6): h(float(s),'wood',.42,-.25,f=70)               # real-time clock ticks 1..5 s
t=5.4;dt=.42
while t<9.5:                                                         # fast-forward: ticks accelerate
    h(t,'wood',.30,.2*(1 if int(t*10)%2 else -1),f=74); t+=dt; dt=max(.11,dt*.86)
for t,n in [(2.6,0),(5.4,2),(7.6,1)]: h(t,'marimba',.26,0,note=n)  # card changes
h(9.8,'wood',.9,0,f=40); h(9.82,'marimba',.32,0,note=-3)            # crossing: deep hit
for i in range(13):                                                  # countdown ticks, one per second, slowly louder
    tt=9.8+0.8+i*1.0
    if tt>22.5: break
    h(tt,'wood',.36+.03*i,(-.3 if i%2 else .3),f=62)
h(12.6,'marimba',.24,-.2,note=1); h(15.6,'marimba',.24,.2,note=0); h(18.8,'marimba',.3,0,note=2)
h(22.6,'wood',1.0,0,f=36); h(22.62,'marimba',.36,0,note=-5)          # zero
h(23.05,'marimba',.28,-.1,note=0)                                    # loop back to the hook
H.sort(key=lambda q:q['t'])
cfg=dict(dur=24.0,seed=128,root=55,bed='space',bed_db=8,wet=.24,hits=H,
         swells=[[7.6,9.8,.35],[9.8,16.0,.25],[16.0,22.6,.45]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
