# hit list for sound-v2.py, timed to p_no-suit-space.html (D=24 s). Hard rule: no shrill sounds -> only low wood/marimba, root 80 Hz.
# Heartbeat races while awake, slows and fades as consciousness goes (~14 s), near silence in the fast-forward,
# then a warm rising marimba figure when the person is pulled back in ("you could survive").
import json,sys
hits=[]
def h(t,kind,vel,pan=0,note=None,f=None):
    d=dict(t=round(t,3),kind=kind,vel=vel,pan=pan)
    if f: d['f']=f
    else: d['note']=note
    hits.append(d)
def beats(a,b,period,vel,fade=None,per=None):
    t=a
    while t<b-0.2:
        v=vel*(fade(t) if fade else 1)
        if v>0.02: h(t,'wood',v,0,f=58); h(t+0.16,'wood',v*.7,0,f=50)
        t+=per(t) if per else period
beats(0.05,2.4,0.48,.5)                                                   # hook: racing heart
beats(2.6,17.0,0,.55,fade=lambda t:max(0,min(1,(17.2-t)/3.5)),per=lambda t:0.45+max(0,t-10)*0.09)  # awake -> slowing, fading
for t in [2.4,5.4,8.2,11.0,15.0,17.6]: h(t,'wood',.6,0,f=42); h(t+.02,'marimba',.18,-.2,note=0)          # card changes: low thud
for i in range(4): h(17.7+i*.58,'marimba',.10+.02*i,.2,note=i)            # fast-forward ticks, very soft
h(20.0,'wood',.8,0,f=40); h(20.02,'marimba',.3,0,note=0)                  # pulled back in
for i,n in enumerate([2,4,5,7]): h(20.3+i*.3,'marimba',.22+.03*i,-.2+.13*i,note=n)
h(22.6,'marimba',.26,.1,note=4); h(22.8,'marimba',.2,-.1,note=2)
beats(23.0,24.0,0.48,.35)                                                  # loop tail leads back into the hook heartbeat
hits.sort(key=lambda q:q['t'])
cfg=dict(dur=24,seed=24,root=80,bed='space',bed_db=10,wet=.22,hits=hits,swells=[[13.5,16.5,.3],[19.4,20.6,.35]])
json.dump(cfg,open(sys.argv[1],'w'));print(len(hits),'hits')
