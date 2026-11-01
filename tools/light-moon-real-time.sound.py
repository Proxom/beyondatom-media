# hit list for sound-v2.py, from the same timing model as light-moon-real-time.js
import json,sys
C=299792.458; LAP=40075/C
P=[(0,False,384400),(6.4,True,384400),(12.3,True,384400),(18.9,False,363300),(25.0,False,405500),(39.5,False,384400)]
hits=[]
for t0,b,km in P:
    hits.append(dict(t=t0+0.01,kind='glass',note=5,vel=.42,pan=-.35))          # launch at Earth (lower left)
    ta=t0+km/C; hits.append(dict(t=ta,kind='bell',note=7,vel=.5,pan=.35))       # arrival at the Moon (upper right)
    if b: hits.append(dict(t=t0+2*km/C,kind='marimba',note=2,vel=.68,pan=-.35))  # echo back at Earth
for k in range(1,8):                                                            # 7 full equator laps in the 1 s ring
    hits.append(dict(t=32.5+k*LAP,kind='marimba',note=3+k,vel=.36,pan=0))
hits.append(dict(t=33.5,kind='bell',note=9,vel=.35,pan=0))                       # ring ends at exactly 1 s
cfg=dict(dur=43.5,seed=21,root=110,bed='space',bed_db=14,wet=.22,hits=hits,swells=[[16.6,18.4,.3],[23.1,24.9,.3]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
