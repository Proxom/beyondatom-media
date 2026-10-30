const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
const eback=u=>{u=cl(u);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)};
// Saturn spins west to east (counterclockwise seen from above the north pole): one turn per 30 s loop
const SPIN=t=>-t*2*Math.PI/30;
const EA=6371/60268; // Earth radius in Saturn equatorial radii
// camera keys: [t, target height, distance, elevation deg]
const KEYS=[[0,1.0,1.25,58],[11.6,1.0,1.12,62],[12.6,1.0,1.75,72],[17.2,1.0,1.7,72],[21.2,.05,5.7,27],[23.4,.05,5.7,27],[27.6,1.0,1.25,58],[30,1.0,1.25,58]];
function cam(t){let i=0;while(i<KEYS.length-2&&t>=KEYS[i+1][0])i++;const a=KEYS[i],b=KEYS[i+1];const u=eio((t-a[0])/(b[0]-a[0]));
 return [lerp(a[1],b[1],u),Math.exp(lerp(Math.log(a[2]),Math.log(b[2]),u)),lerp(a[3],b[3],u)]}
function hexPt(s,sp){ // s in [0,6): perimeter parameter -> world point on the hexagon (local apothem .225, vertices on local x)
 const k=Math.floor(s)%6,f=s-Math.floor(s);const R=.225/Math.cos(Math.PI/6);
 const a0=k*Math.PI/3,a1=(k+1)*Math.PI/3;const lx=lerp(R*Math.cos(a0),R*Math.cos(a1),f),lz=lerp(R*Math.sin(a0),R*Math.sin(a1),f);
 const ly=Math.sqrt(Math.max(0,1-lx*lx-lz*lz))*1.003;const ca=Math.cos(sp),sa=Math.sin(sp);return [ca*lx-sa*lz,ly,sa*lx+ca*lz]}
const eS=t=>t<12.2?0:t<13.2?eback((t-12.2)/1):t<16.8?1:t<17.4?1-ease((t-16.8)/.6):0;
SC={D:30,
 scene(t){
  const [ty,d,el]=cam(t);const az=0.18*Math.sin(2*Math.PI*t/30);const e=el*Math.PI/180;
  const sw=[0.006*Math.sin(2*Math.PI*t/15),0.005*Math.sin(2*Math.PI*t/7.5)];
  const tgt=[sw[0],ty+sw[1],0];const eye=[tgt[0]+d*Math.cos(e)*Math.sin(az),tgt[1]+d*Math.sin(e),d*Math.cos(e)*Math.cos(az)];
  const sp=SPIN(t),ca=Math.cos(sp),sa=Math.sin(sp),k=eS(t);const y=1+.3*EA;
  return {eye,tgt,fov:.9,sun:[0.55,0.75,0.45],
   p:{c:[0,0,0],r:1,ty:2,tilt:0,yaw:0,spin:sp},ring:{n:[0,1,0],a:1},expo:1.05,hex:1,
   q:{c:[-EA,y,0],r:k>0?EA:0,ty:0,tilt:23.44,yaw:150,spin:-t*2*Math.PI/8},off:[2*EA,0,0],er:[k,k,0]};},
 cards:[
  [0,3.5,[['A HEXAGON','#fff'],['ON SATURN','#ffcf6b']],128],
  [3.5,8,['A jet stream with',['six straight sides','#ffcf6b']],100],
  [8,12.2,['Winds: about',['360 km/h','#7fd4ff']],108],
  [12.2,17.2,['Wider than',['two Earths','#7fd4ff']],116],
  [17.2,21.4,['First seen by Voyager,',['early 1980s','#ffcf6b']],92],
  [21.4,24,['Cassini, decades later:',['still there','#7fd4ff']],92],
  [24,27,['Why six sides?',['Still a mystery','#ffcf6b']],104],
  [27,30.01,[['A HEXAGON','#fff'],['ON SATURN','#ffcf6b']],128]],
 overlay(t){
  const sp=SPIN(t);
  // outline the six sides one by one
  const oa=t<3.6?0:t<8?1:t<8.5?1-ease((t-8)/.5):0;
  if(oa>0){const n=cl((t-3.8)/2.4)*6;x.save();x.globalAlpha=oa;x.strokeStyle='#ffe2a0';x.lineWidth=6;x.shadowColor='#ffcf6b';x.shadowBlur=22;x.lineCap='round';x.beginPath();
   for(let i=0;i<=Math.ceil(n*24);i++){const s=Math.min(i/24,n);const q=proj(hexPt(s,sp));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();
   for(let k=0;k<Math.floor(n+1e-6)&&k<6;k++){const q=proj(hexPt(k+.5,sp));const c=proj([0,1,0]);const dx=q[0]-c[0],dy=q[1]-c[1],L=Math.hypot(dx,dy);
    label(String(k+1),q[0]+dx/L*44,q[1]+dy/L*44+14,oa,'#ffe2a0',44);}x.restore();}
  // jet stream flow: streaks running along the hexagon
  const ja=t<8?0:t<8.5?ease((t-8)/.5):t<12?1:t<12.5?1-ease((t-12)/.5):0;
  if(ja>0){x.save();x.globalCompositeOperation='lighter';for(let i=0;i<30;i++){const s0=(i/5+t*0.9)%6;
    x.strokeStyle='rgba(170,225,255,'+(.75*ja)+')';x.lineWidth=5;x.shadowColor='#9fe0ff';x.shadowBlur=16;x.lineCap='round';x.beginPath();
    for(let j=0;j<=8;j++){const q=proj(hexPt((s0-j*0.03+6)%6,sp));j?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();}x.restore();}
  const la=eS(t);if(la>0.05&&t<17.4)label('Earths to scale',W/2,1300,Math.min(1,la),'#d8d2e8',34);
  label('Simulated view. Colours artistic',W/2,1428,.7,'#d8d2e8',26);
 }
};
