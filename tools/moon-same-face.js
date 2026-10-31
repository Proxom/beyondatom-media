// Moon tidal locking: spin period = orbit period, so the near side always faces Earth.
const D=1.85,MR=0.30; // orbit radius / Moon radius in Earth radii (not to scale)
const SUNV=[1,0.32,0.45];
// orbit angle: integrate a speed profile, scaled so 30 s = exactly 3 orbits (seamless loop)
function rate(t){if(t<3)return .12;if(t<5.5)return lerp(.12,1,ease((t-3)/2.5));if(t<26.5)return 1;if(t<28.5)return lerp(1,.12,ease((t-26.5)/2));return .12;}
const TH=[0];(function(){for(let i=1;i<=9000;i++)TH.push(TH[i-1]+rate((i-.5)/300)/300);const k=6*Math.PI/TH[9000];for(let i=0;i<=9000;i++)TH[i]*=k;})();
const TH0=Math.atan2(-SUNV[2],-SUNV[0])+0.55; // start at full Moon: near side lit in the hook shot
// S=-1: the Moon orbits (and spins) counterclockwise seen from above Earth's north pole (+y)
const S=-1;
const th=t=>{const f=cl(t,0,30)*300,i=Math.floor(f);return TH0+S*(i>=9000?TH[9000]:lerp(TH[i],TH[i+1],f-i))};
// spin offset: during 14-20 s the "what if" Moon stops spinning, then catches up
const GA=14.2,GB=18.4;
function off(t){if(t<GA)return 0;if(t<GB)return th(t)-th(GA);return (th(GB)-th(GA))*(1-eio((t-GB)/1.1));}
const spin=t=>th(t)+Math.PI-off(t);
// bar start time chosen so ORBIT and SPIN reach exactly 27.3 d (one full turn) at 14.05 s
const B0=(function(){let lo=4,hi=8;for(let i=0;i<50;i++){const m=(lo+hi)/2;(S*(th(13.7)-th(m))>2*Math.PI)?lo=m:hi=m;}return (lo+hi)/2})();
const mpos=t=>{const a=th(t);return [D*Math.cos(a),0,D*Math.sin(a)]};
function nearDir(t){const s=spin(t);return [Math.cos(s),0,Math.sin(s)]} // world dir of the near-side centre
// camera: hook = over Earth's limb looking at the Moon; overview = high 3/4 view
function camHook(t){const m=mpos(t);const d=norm(m);return {eye:[d[0]*1.05,0.1,d[2]*1.05],tgt:[m[0],m[1]+0.03,m[2]],fov:t<15?1.45-0.1*ease(t/3.2):1.45}}
function camOver(t){const sw=0.03*Math.sin(2*Math.PI*t/10);return {eye:[sw,3.3,6.2],tgt:[0.2,-0.5,0.1],fov:.98}}
function cam(t){const a=t<3?0:t<5.8?eio((t-3)/2.8):t<27?1:t<29.6?1-eio((t-27)/2.6):0;
 const h=camHook(t),o=camOver(t);if(a<=0)return h;if(a>=1)return o;
 // interpolate eye/target and fov in log space so the move feels like one dolly
 const dm=norm(mpos(t)),bp=Math.sin(Math.PI*a);const bump=[dm[0]*1.4*bp,1.5*bp,dm[2]*1.4*bp]; // arc away from Earth during the move
 return {eye:h.eye.map((v,i)=>lerp(v,o.eye[i],a)+bump[i]),tgt:h.tgt.map((v,i)=>lerp(v,o.tgt[i],a)),fov:Math.exp(lerp(Math.log(h.fov),Math.log(o.fov),a))}}
const ovA=t=>t<4.6?0:t<5.8?ease((t-4.6)/1.2):t<26.6?1:t<27.4?1-ease((t-26.6)/.8):0;
// labels clamped so text stays inside the safe area (x 60..930)
function labelS(s,px,py,a,col,size){x.save();x.font='800 '+(size||40)+'px '+F;const w=x.measureText(s).width;x.restore();label(s,Math.max(70+w/2,Math.min(px,920-w/2)),py,a,col,size)}
SC={D:30,
 scene(t){const c=cam(t);const m=mpos(t);
  return {eye:c.eye,tgt:c.tgt,fov:c.fov,sun:SUNV,
   p:{c:[0,0,0],r:1,ty:0,tilt:23.44,yaw:150,spin:-t*0.35},
   q:{c:m,r:MR,ty:4,tilt:0,yaw:0,spin:spin(t)},ring:{n:[0,1,0],a:0},axis:0,expo:1.0};},
 cards:[
  [0,3.2,[["YOU'VE ONLY SEEN",'#fff'],['HALF THE MOON','#ffd36b']],116],
  [3.2,6.5,['The Moon',['does spin','#7fd4ff']],112],
  [6.5,10.4,['1 spin =',['27.3 days','#7fd4ff']],112],
  [10.4,14.2,['1 orbit =',['27.3 days','#7fd4ff']],112],
  [14.2,18.4,['No spin?',["We'd see every side",'#ff8a7a']],104],
  [18.4,24.4,['Spin = orbit:',['TIDAL LOCKING','#ffd36b']],108],
  [24.4,27.5,['Far side first seen:',['1959','#7fd4ff']],104],
  [27.5,30.01,[["YOU'VE ONLY SEEN",'#fff'],['HALF THE MOON','#ffd36b']],116]],
 overlay(t){
  const s=SC.scene(t);const m=mpos(t),nd=nearDir(t),eye=s.eye;const A=ovA(t);
  const toE=norm(m.map(v=>-v));const face=nd[0]*toE[0]+nd[2]*toE[2]; // 1 = near side faces Earth
  if(A>0){
   // orbit path
   x.save();x.globalAlpha=.35*A;x.strokeStyle='#bcd2ff';x.lineWidth=2.5;x.setLineDash([10,14]);x.beginPath();
   for(let i=0;i<=200;i++){const a=i/200*2*Math.PI;const q=proj([D*Math.cos(a),0,D*Math.sin(a)]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();x.restore();
   // near-side marker + sight line to Earth
   const pm=m.map((v,i)=>v+nd[i]*MR*1.02);const e=[eye[0]-pm[0],eye[1]-pm[1],eye[2]-pm[2]];const vis=nd[0]*e[0]+nd[1]*e[1]+nd[2]*e[2]>0;
   const col=face>0.9?'#7dffb0':'#ff7a6a';
   const hid=(p)=>{const dv=p.map((v,i)=>v-eye[i]);const L=Math.hypot(...dv);const u=dv.map(v=>v/L);const b=eye[0]*u[0]+eye[1]*u[1]+eye[2]*u[2];const cc=eye[0]**2+eye[1]**2+eye[2]**2-1;const h=b*b-cc;if(h<0)return false;const t0=-b-Math.sqrt(h);return t0>0&&t0<L;};
   const occ=hid(m)?0:1;const q=proj(pm),qm=proj(m);
   const tip=proj(m.map((v,i)=>v+nd[i]*MR*1.85));
   x.save();x.globalAlpha=A*occ;x.strokeStyle=col;x.lineWidth=6;x.shadowColor=col;x.shadowBlur=14;x.beginPath();x.moveTo(q[0],q[1]);x.lineTo(tip[0],tip[1]);x.stroke();
   const ang=Math.atan2(tip[1]-q[1],tip[0]-q[0]);x.fillStyle=col;x.beginPath();x.moveTo(tip[0]+Math.cos(ang)*18,tip[1]+Math.sin(ang)*18);
   x.lineTo(tip[0]+Math.cos(ang+2.4)*16,tip[1]+Math.sin(ang+2.4)*16);x.lineTo(tip[0]+Math.cos(ang-2.4)*16,tip[1]+Math.sin(ang-2.4)*16);x.fill();
   if(vis){x.beginPath();x.arc(q[0],q[1],10,0,7);x.fill();}x.restore();
   // label
   const la=t<6.6?0:t<7.1?ease((t-6.6)/.5):t<13.9?1:t<14.3?1-ease((t-13.9)/.4):0;
   labelS('NEAR SIDE',qm[0],qm[1]-95,la*A*occ,'#7dffb0',32);
   const ga=t<GA+.6?0:t<GA+1?ease((t-GA-.6)/.4):t<GB?1:t<GB+.4?1-ease((t-GB)/.4):0;
   labelS(face>0.9?'FACING EARTH':face>0?'TURNING AWAY':'FACING AWAY',qm[0],qm[1]+(qm[1]>proj([0,0,0])[1]?110:-95),ga*A*occ,col,32);
   const ea=t<5.4?0:t<6?ease((t-5.4)/.6):t<26.6?1:1-ease((t-26.6)/.6);const qe=proj([0,0,0]);labelS('EARTH',qe[0],qe[1]+proj([0,0,1])[1]-qe[1]+70,.85*ea*A,'#cfe3ff',34);
   // progress panel: orbit vs spin
   const pa=t<6.4?0:t<6.9?ease((t-6.4)/.5):t<GA-.2?1:t<GA+.2?1-ease((t-GA+.2)/.4):0;
   if(pa>0){const o=cl(S*(th(t)-th(B0))/(2*Math.PI),0,1);const sp=cl(S*(spin(t)-spin(B0))/(2*Math.PI),0,1);
    const stopped=t>=GA&&t<GB;
    x.save();x.globalAlpha=pa;x.fillStyle='rgba(8,10,24,.74)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(170,1196,740,212,30);x.fill();x.stroke();
    [['ORBIT',t<GA?o:cl(S*(th(t)-th(B0))/(2*Math.PI)%1,0,1),'#7fd4ff',1246],['SPIN',t<GA?sp:(stopped?0:cl(1-off(t)/(th(GB)-th(GA)),0,1)),stopped?'#ff7a6a':'#7dffb0',1336]].forEach(([n,v,c,y])=>{
     x.font='800 34px '+F;x.textAlign='left';x.fillStyle='#d8d2e8';x.fillText(n,205,y+12);
     x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.roundRect(345,y-14,420,30,15);x.fill();
     x.fillStyle=c;x.shadowColor=c;x.shadowBlur=12;x.beginPath();x.roundRect(345,y-14,Math.max(30,420*v),30,15);x.fill();x.shadowBlur=0;
     x.textAlign='right';x.fillStyle=c;x.font='800 32px '+F;
     const txt=n==='SPIN'&&stopped?'STOP':(v*27.32).toFixed(1)+' d';x.fillText(txt,890,y+12);});
    x.restore();}
  }
  label('Simulation. Sizes, distances, speeds not to scale',W/2,1432,.62,'#d8d2e8',25);}
};
