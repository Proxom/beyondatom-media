# hit list for sound-v2.py, timed to jump-four-moons.js. Hard rule: no shrill sounds -> only low wood/marimba (no bell/glass), root 80 Hz.
import json,sys,math
GE=9.82;V0=math.sqrt(2*GE*0.5);TL=0.55;LOOP=22.45;G=6.674e-11
W=[('EARTH',9.82,147),('MOON',1.62,321),('EUROPA',G*480.0e20/1560.8e3**2,495),('TRITON',G*214e20/1353.4e3**2,669),('TITANIA',G*34.2e20/788.9e3**2,843)]
H=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,4),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    H.append(d)
h(0.05,'marimba',.28,0,note=0)                                        # hook
for i,(n,g,cx) in enumerate(W):
    pan=(cx-540)/540*.7; T=2*V0/g
    h(TL,'marimba',.24,pan,note=i)                                     # take-off, one note per world
    h(TL+T,'wood',.75 if i==0 else (.6 if i==4 else .45),pan,f=60)     # landing thump
    if i==4: h(TL+T+.01,'wood',.8,pan,f=44); h(TL+T+.03,'marimba',.3,pan,note=0)   # last landing: deeper
for a in [3.1,5.3,8.6,11.7,14.7,17.7,19.5,21.0]: h(a,'wood',.18,0,note=3)          # card changes (soft wood)
for i,(n,g,cx) in enumerate(W): h(19.0+i*.3,'marimba',.22,(cx-540)/540*.7,note=4-i)  # recap chips, falling pitch with gravity
h(LOOP+0.02,'marimba',.2,0,note=0)                                   # loop
H.sort(key=lambda q:q['t'])
cfg=dict(dur=22.9,seed=41,root=80,bed='space',bed_db=8,wet=.22,hits=H,swells=[[4.5,8.6,.25],[12.0,17.6,.25],[18.0,19.4,.2]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
