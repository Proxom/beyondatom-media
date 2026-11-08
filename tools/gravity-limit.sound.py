# hit list for sound-v2.py, timed to p_gravity-limit.html. Hard rule: no shrill sounds -> only low wood/marimba, root 80 Hz.
# Heartbeat (lub-dub, very low wood) gets harder and faster with gravity (FAA: the heart beats harder and faster under +Gz),
# fades out at the blackout on the Sun, then a deep impact for the neutron star.
import json,sys
hits=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,3),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    hits.append(d)
def beats(a,b,period,vel,fade=None):
    t=a
    while t<b-0.25:
        v=vel*(fade(t) if fade else 1)
        if v>0.02: h(t,'wood',v,0,f=58); h(t+0.16,'wood',v*.7,0,f=50)
        t+=period
beats(0.05,2.6,0.55,.55)                                    # hook: the Sun, racing heart
beats(3.0,6.6,0.95,.30)                                     # Earth: calm
beats(7.0,10.8,0.9,.34)                                     # Neptune
beats(11.1,17.0,0.7,.46)                                    # Jupiter: harder, faster
beats(17.2,23.2,0.5,.6,fade=lambda t:max(0,min(1,(22.3-t)/1.6)))   # Sun: racing, fades into the blackout
beats(29.45,30.0,0.55,.55)                                  # loop tail = hook
for t in [2.6,6.6,10.8,17.0]: h(t,'wood',.75,0,f=42); h(t+.02,'marimba',.22,-.2,note=0)   # world cuts: low thud
h(23.2,'wood',1.0,0,f=36); h(23.22,'marimba',.32,0,note=0); h(23.25,'marimba',.22,.2,note=2)  # neutron star impact
for i in range(5): h(23.5+i*.42,'marimba',.18+.03*i,.25,note=2+i)                        # gauge racing up
h(25.7,'marimba',.32,.2,note=7); h(25.86,'marimba',.24,.1,note=5)                         # 100 billion g
for t in [8.7,13.0,15.0,19.0,21.1]: h(t,'wood',.2,0,note=3)                               # card changes
h(26.6,'marimba',.22,-.1,note=4); h(29.4,'wood',.7,0,f=42)
hits.sort(key=lambda q:q['t'])
cfg=dict(dur=30,seed=30,root=80,bed='space',bed_db=10,wet=.22,hits=hits,swells=[[16.2,17.0,.3],[22.4,23.2,.35],[25.0,26.2,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
