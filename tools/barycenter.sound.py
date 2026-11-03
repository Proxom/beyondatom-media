# hit list for sound-v2.py, timed to barycenter.js (acts A 0-14.4, B 14.4-27.6, C 27.6-42; zooms A 4.6-7.4, B 17.0-19.6)
import json,sys,math
H=[]
def h(t,kind,note,vel,pan=0): H.append(dict(t=t,kind=kind,note=note,vel=vel,pan=pan))
h(0.10,'marimba',2,.36,-.2)                                         # hook
h(4.60,'wood',4,.24); h(4.65,'marimba',3,.28,.1); h(7.40,'marimba',1,.40,.2)                    # zoom out starts / Charon revealed
h(6.30,'marimba',4,.30); h(10.20,'wood',4,.22); h(11.60,'marimba',1,.38,-.1); h(10.30,'bell',3,.36); h(10.42,'bell',5,.26)   # cards: both circle / outside Pluto
h(14.40,'marimba',0,.46,0); h(14.44,'wood',3,.24)                   # cut to Earth
h(17.00,'wood',4,.22); h(18.80,'marimba',1,.42,-.1)                 # zoom in starts / lands
h(18.70,'bell',2,.34); h(23.00,'marimba',3,.34,.1)                  # inside Earth / wobbles once a month
h(27.60,'marimba',0,.46,0); h(27.64,'wood',2,.24)                   # cut to the Sun
h(31.20,'wood',4,.22); h(31.70,'bell',4,.36); h(35.40,'wood',3,.18); h(35.70,'bell',5,.36); h(35.82,'bell',7,.28); h(35.94,'bell',9,.22)   # outside the Sun / payoff
h(41.55,'marimba',2,.18,0)                                          # loop
# soft glass tick each time the partner passes closest to the viewer (phi = -pi/2)
for t0,t1,phi0,per in [(0,14.4,-.62,6.),(14.4,27.6,.35,7.),(27.6,42.,math.pi/2-2*math.pi*(33.65-27.6)/9.0,9.)]:
    w=2*math.pi/per;k=0
    while True:
        t=t0+(-math.pi/2-phi0+2*math.pi*k)/w;k+=1
        if t<t0+.3: continue
        if t>t1-.3: break
        h(t,'glass',6,.16,0)
H.sort(key=lambda q:q['t'])
cfg=dict(dur=42.0,seed=73,root=110,bed='space',bed_db=13,wet=.22,hits=H,swells=[[4.6,7.4,.25],[17.0,19.6,.25],[35.7,38.5,.2]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits',[round(q['t'],2) for q in H if q['kind']=='glass'])
