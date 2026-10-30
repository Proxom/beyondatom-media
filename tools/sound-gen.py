# usage: python3 gen.py out.wav '{"booms":[0,13.6],"whoosh":[3.6,8],"risers":[[9,13]],"clicks":[],"chimes":[18],"root":55,"seed":3}'
import numpy as np,wave,sys,json
from itertools import accumulate
cfg=json.loads(sys.argv[2]);SR=48000;D=cfg.get('dur',30.0);N=int(SR*D);t=np.arange(N)/SR;rng=np.random.default_rng(cfg.get('seed',1))
def lp(x,a):return np.array(list(accumulate(x,lambda s,v:s+a*(v-s))))
def env(t0,att,dec):
    e=np.zeros(N);i0=int(t0*SR);n=int((att+dec*6)*SR);tt=np.arange(max(0,min(n,N-i0)))/SR
    e[i0:i0+len(tt)]=np.where(tt<att,tt/max(att,1e-4),np.exp(-(tt-att)/dec));return e
L=np.zeros(N);R=np.zeros(N);f0=cfg.get('root',55.0)
room=lp(rng.standard_normal(N),0.02);room/=np.abs(room).max();L+=room*0.05;R+=np.roll(room,977)*0.05
dr=(np.sin(2*np.pi*f0*.7*t)+.5*np.sin(2*np.pi*f0*1.05*t+1)+.25*np.sin(2*np.pi*f0*1.4*t))*(0.85+0.15*np.sin(2*np.pi*0.13*t))
pad=sum(np.sin(2*np.pi*f*t+ph)*a*(0.8+0.2*np.sin(2*np.pi*0.07*t+ph)) for f,ph,a in [(f0*2,0,.12),(f0*3,1,.08),(f0*4.01,2,.05),(f0*6,.5,.03),(f0*5,1.3,.03)])
L+=dr*0.22+pad*0.25;R+=dr*0.22+np.roll(pad,240)*0.25
def boom(t0,g=1.0):
    e=env(t0,0.004,0.45);ph=2*np.pi*np.cumsum(30+70*np.exp(-np.maximum(t-t0,0)/0.12))/SR
    return (np.sin(ph)*e*0.9+lp(rng.standard_normal(N),0.15)*env(t0,0.002,0.06)*0.5)*g
def sweep(t0,t1,f0_,f1_,g,up):
    y=np.zeros(N);i0,i1=int(t0*SR),min(N,int((t1+.3)*SR));n=rng.standard_normal(i1-i0);acc=0.0
    u=np.clip((t[i0:i1]-t0)/(t1-t0),0,1);a=0.005+0.25*(f0_+(f1_-f0_)*u)/6000
    out=np.empty(i1-i0)
    for k in range(i1-i0):
        acc+=a[k]*(n[k]-acc);out[k]=acc
    tt=t[i0:i1];shp=np.sin(np.pi*u)**1.5 if not up else np.where(tt<=t1,u**2,np.exp(-(tt-t1)/0.08))
    y[i0:i1]=out*shp*g;return y
for b in cfg.get('booms',[]):x=boom(b);L+=x;R+=x
for c in cfg.get('clicks',[]):
    x=np.sin(2*np.pi*2400*t)*env(c,0.0005,0.008)+np.sin(2*np.pi*900*t)*env(c+0.03,0.0005,0.012);L+=x*.35;R+=x*.35
for w in cfg.get('whoosh',[]):x=sweep(w-0.25,w+0.1,800,3000,0.35,False);L+=x;R+=np.roll(x,500)
for a,b in cfg.get('risers',[]):
    x=sweep(a,b,300,6000,1.0,True);u=np.clip((t-a)/(b-a),0,1);ton=np.sin(2*np.pi*np.cumsum(f0+300*u**2)/SR)*u**2*(t<b)*0.15;L+=x+ton;R+=np.roll(x,300)+ton
for a,b in cfg.get('falls',[]):x=sweep(a,b,5000,300,0.9,False);L+=x;R+=np.roll(x,400)
for c in cfg.get('chimes',[]):
    x=sum(np.sin(2*np.pi*f*t)*a for f,a in [(f0*16,.5),(f0*24.02,.3),(f0*32.1,.2)])*env(c,0.01,1.2);L+=x*.13;R+=np.roll(x,600)*.13
st=np.stack([L,R],1);st/=np.abs(st).max()*1.05
with wave.open(sys.argv[1],'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((st*32767).astype('<i2').tobytes())
