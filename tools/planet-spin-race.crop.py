# detect bright disk bbox and crop square, output 900x900 to ../<id>.jpg
import subprocess, numpy as np, sys, json
def load(f):
    w,h=map(int,subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=width,height','-of','csv=p=0',f]).decode().strip().split(','))
    a=np.frombuffer(subprocess.check_output(['ffmpeg','-loglevel','error','-i',f,'-f','rawvideo','-pix_fmt','gray','-']),np.uint8).reshape(h,w); return a
OV={'PIA04866':dict(c=(1295,1200),r=1100),'PIA23791':dict(xmin=1175),'PIA21046':dict(c=(1006,503),r=800)}
for id in sys.argv[1:]:
    f=f'raw/{id}.jpg'; a=load(f).astype(float); h,w=a.shape; o=OV.get(id,{})
    if 'c' in o: cx,cy=o['c']; r=o['r']
    else:
        m=a>(12 if id in ('PIA01492','PIA15162','PIA00407','PIA04866') else 40)
        if 'xmin' in o: m[:,:o['xmin']]=False
        ys,xs=np.nonzero(m); x0,x1=np.percentile(xs,[0.2,99.8]); y0,y1=np.percentile(ys,[0.2,99.8])
        cx,cy=(x0+x1)/2,(y0+y1)/2; r=max(x1-x0,y1-y0)/2*1.01
    s=int(2*r); x0=int(cx-r); y0=int(cy-r)
    # pad if needed
    vf=f"pad={w+2*s}:{h+2*s}:{s}:{s}:black,crop={s}:{s}:{x0+s}:{y0+s},scale=900:900"
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f,'-vf',vf,'-q:v','2',f'{id}.jpg'],check=True)
    print(id,w,h,round(cx),round(cy),round(r))
