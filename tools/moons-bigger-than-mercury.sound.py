# hit list for sound-v2.py, timed to moons-bigger-than-mercury.js (entry lands ~1.0 s, ghost 8.0, Titan 12.9, bars 18.0-21.4, cut 25.2-26.6)
import json,sys
H=[]
def h(t,kind,note,vel,pan=0): H.append(dict(t=t,kind=kind,note=note,vel=vel,pan=pan))
h(0.30,'marimba',3,.40,-.35); h(0.42,'marimba',1,.46,.35)          # Mercury / Ganymede arrive (bigger = lower)
h(4.30,'wood',5,.30); h(6.00,'marimba',5,.36,-.3); h(6.10,'marimba',4,.36,.3)   # measure, counters settle
h(7.00,'wood',4,.22,-.2); h(8.00,'bell',5,.34,.3); h(8.15,'glass',7,.36,.3); h(8.27,'glass',9,.28,.3)   # ghost lands, 8% wider
h(10.80,'wood',3,.24); h(12.90,'marimba',2,.44,0); h(12.98,'wood',5,.26)       # zoom out, Titan arrives
h(16.30,'marimba',4,.26,0); h(16.45,'marimba',2,.22,0)                         # Titan leaves
h(17.60,'wood',5,.28); h(18.00,'marimba',0,.46,-.1)                             # mass bars: Mercury
h(19.20,'marimba',4,.38,-.1); h(20.00,'marimba',5,.38,0); h(20.80,'glass',7,.30,.1)   # Ganymede x1, x2, 0.2
h(21.45,'bell',3,.40); h(21.57,'bell',5,.30)                                    # 2.2x the mass
h(25.20,'bell',0,.30); h(26.60,'marimba',0,.48,-.2); h(26.70,'wood',5,.26)     # cutaway opens, core revealed
h(31.20,'bell',5,.38); h(31.32,'bell',7,.30); h(31.44,'bell',9,.24)            # payoff
h(33.65,'wood',4,.20,-.2)                                                       # cut closes (payoff hold shortened by 2.6 s)
h(35.45,'marimba',6,.18,-.3); h(35.60,'marimba',4,.16,.3)                       # bodies leave (loop reset)
H.sort(key=lambda q:q['t'])
cfg=dict(dur=37.0,seed=57,root=110,bed='space',bed_db=13,wet=.22,hits=H,swells=[[25.2,26.6,.3],[10.8,12.9,.2]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(H),'hits')
