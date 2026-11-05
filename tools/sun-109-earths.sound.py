# hit list for sound-v2.py from the sun-109-earths.js timing model (window.MODEL.earthT = time each Earth is counted)
import json,sys
ET=json.load(open(sys.argv[2]))['earthT']
hits=[dict(t=0.05,kind='wood',note=2,vel=.20,pan=-.3)]                 # loop start, Earth drifting in
for k in range(1,11):                                                   # first ten Earths: rising marimba notes
    hits.append(dict(t=ET[k]-.03,kind='marimba',note=k-1,vel=.34-.012*k,pan=-.35+.06*k))
for k in range(20,101,10):                                              # then a soft tick every 10th Earth
    hits.append(dict(t=ET[k]-.03,kind='wood',note=4+k//20,vel=.16+k/1000,pan=-.4+k/140))
hits+=[dict(t=8.1,kind='bell',note=4,vel=.30,pan=0)]                    # HALFWAY
hits+=[dict(t=ET[108]+.05+.12*i,kind='bell',note=n,vel=.40-.06*i,pan=(-.15,.15,0)[i]) for i,n in enumerate((5,7,9))]  # 109
hits+=[dict(t=11.65,kind='wood',note=5,vel=.22,pan=0),dict(t=12.15,kind='wood',note=6,vel=.20,pan=0)]
hits+=[dict(t=15.05,kind='wood',note=5,vel=.24,pan=0),dict(t=15.25,kind='glass',note=6,vel=.24,pan=0),
       dict(t=16.25,kind='glass',note=8,vel=.26,pan=0),dict(t=17.45,kind='glass',note=9,vel=.24,pan=0)]   # column grows
hits+=[dict(t=18.05,kind='wood',note=5,vel=.24,pan=0)]
hits+=[dict(t=20.45+.12*i,kind='bell',note=n,vel=.42-.06*i,pan=(-.15,.15,0)[i]) for i,n in enumerate((2,4,7))]  # 1.3 million
hits+=[dict(t=21.5+.36*i,kind='glass',note=4+i,vel=.16+.015*i,pan=(-.3,.3,-.15,.15,0,-.1,.1)[i]) for i in range(7)]  # Earths spread across the Sun (21.4-23.6)
hits+=[dict(t=23.45,kind='marimba',note=3,vel=.22,pan=-.45)]            # 1 EARTH marker
hits+=[dict(t=27.0+.2*i,kind='marimba',note=6-2*i,vel=.18-.03*i,pan=(-.2,.2,-.2)[i]) for i in range(3)]  # row fades, zoom back
hits+=[dict(t=29.65,kind='wood',note=3,vel=.18,pan=0)]                  # hook returns
hits.sort(key=lambda h:h['t'])
cfg=dict(dur=31.5,seed=109,root=104,bed='space',bed_db=12,wet=.24,hits=hits,swells=[[4.6,11.2,.32],[15.2,17.5,.28],[20.5,23.6,.32]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
