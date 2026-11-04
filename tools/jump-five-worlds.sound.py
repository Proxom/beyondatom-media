# hit list for sound-v2.py, timed to jump-five-worlds.js (take-off 0.55 s; landings/apexes from the same physics)
import json,sys,math
GE=9.82;V0=math.sqrt(2*GE*0.5);TL=0.55
W=[('EARTH',9.82,147),('MARS',3.73,321),('MOON',1.62,495),('PLUTO',0.62,669),('CERES',62.6285e9/(469.7e3**2),843)]
H=[]
def h(t,kind,note,vel,pan=0): H.append(dict(t=round(t,4),kind=kind,note=note,vel=vel,pan=pan))
h(0.05,'marimba',2,.30,0)                                            # hook
for i,(n,g,cx) in enumerate(W):
    pan=(cx-540)/540*.7; T=2*V0/g
    h(TL,'marimba',i*1,.30,pan)                                      # take-off chord, one note per world
    h(TL+T/2,'glass',5+i,.14,pan)                                    # apex
    h(TL+T,'wood',3,.42 if i<4 else .55,pan)                         # landing thump
    if i==4: h(TL+T+.01,'marimba',0,.44,pan)
for a in [3.1,6.3,10.75,14.0,17.7,22.75,25.7,28.7]: h(a,'bell',4 if a<22 else 6,.22,0)   # card changes
for i,(n,g,cx) in enumerate(W): h(25.9+i*.38+.05,'marimba',8-i*2,.26,(cx-540)/540*.7)   # recap chips, falling pitch with gravity
h(31.25,'marimba',2,.16,0)                                           # loop
H.sort(key=lambda q:q['t'])
cfg=dict(dur=31.5,seed=29,root=110,bed='space',bed_db=6,wet=.22,hits=H,swells=[[6.0,11.6,.25],[19.0,22.6,.2]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits',[(q['t'],q['kind']) for q in H])
