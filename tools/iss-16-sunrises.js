const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
const TILT=23.44,YAW=150;const OR=(6371+420)/6371; // ISS orbit radius in Earth radii (about 420 km up)
const PER=92; // minutes per orbit
// simulated minutes per real second
function rate(t){if(t<3.5)return 30;if(t<12)return 21.6;if(t<21.6)return lerp(21.6,PK,ease((t-12)/9.6));if(t<22.6)return lerp(PK,21.6,ease(t-21.6));if(t<26.6)return 21.6;return lerp(21.6,30,ease((t-26.6)/1));}
let PK=200,TAU=[];function build(){TAU=[0];for(let i=1;i<=9000;i++){const t=(i-.5)/300;TAU.push(TAU[i-1]+rate(t)/300);}
 // loop: make the whole 30 s span a whole number of orbits so the last frame matches the first
 const dl=TAU[9000]%PER;for(let i=0;i<=9000;i++)TAU[i]-=dl*i/9000;}
// peak speed chosen so the 24-hour clock completes at t = 21.9 s
(function(){let lo=50,hi=1000;for(let k=0;k<40;k++){PK=(lo+hi)/2;build();(TAU[Math.round(21.9*300)]>1440)?hi=PK:lo=PK;}})();
const tau=t=>{const f=cl(t,0,30)*300,i=Math.floor(f);return i>=9000?TAU[9000]:lerp(TAU[i],TAU[i+1],f-i)};
const DFR=TAU[9000]/1440-Math.round(TAU[9000]/1440);const T0=0; // the 24-hour clock starts at the first frame
const SUN=norm([0.9,0.25,0.35]);
// orbit plane: Earth's spin axis tilted by 51.6 deg (the ISS inclination), opened toward the camera
function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
const AX=norm(rowY(TILT,YAW));const Wv=norm(cross(AX,[0,0,1]));const INC=51.6*Math.PI/180;
const N=norm(AX.map((a,i)=>a*Math.cos(INC)-Wv[i]*Math.sin(INC)));
const E1=norm(cross(N,[0,1,0].map((v,i)=>v+0.001*i)));const E2=cross(N,E1);
let PH0=0;const isP=(m)=>{const a=PH0+2*Math.PI*m/PER;return [0,1,2].map(i=>OR*(E1[i]*Math.cos(a)+E2[i]*Math.sin(a)))};
const lit=m=>{const p=isP(m);return p[0]*SUN[0]+p[1]*SUN[1]+p[2]*SUN[2]};
// choose the start phase so the first sunrise comes ~4.5 simulated minutes (0.15 s) after the first frame, on the camera side
(function(){let best=0,bs=1e9;for(let k=0;k<720;k++){PH0=k/720*2*Math.PI;const m=4.5;if(lit(m-0.5)<0&&lit(m+0.5)>0){const z=isP(m)[2];if(z>0&&Math.abs(lit(m))<bs){bs=Math.abs(lit(m));best=PH0;}}}PH0=best;})();
// sunrise times in real seconds (for counter, flashes and sound)
const SR=[];for(let i=1;i<=9000;i++){const a=lit(TAU[i-1]),b=lit(TAU[i]);if(a<0&&b>=0)SR.push(i/300);}
window.SUNRISES=SR;
const cnt=t=>{let n=0;for(const s of SR){if(s<=t&&TAU[Math.round(s*300)]>=T0&&TAU[Math.round(s*300)]<=T0+1440)n++;}return n};
function visible(p,eye){const d=norm(p.map((v,i)=>v-eye[i]));const L=Math.hypot(...p.map((v,i)=>v-eye[i]));const b=eye[0]*d[0]+eye[1]*d[1]+eye[2]*d[2];const c=eye[0]**2+eye[1]**2+eye[2]**2-1;const h=b*b-c;if(h<0)return true;const t0=-b-Math.sqrt(h);return !(t0>0&&t0<L);}
SC={D:30,
 scene(t){
  const az=0.10*Math.sin(2*Math.PI*t/30);const d=2.95-0.1*Math.sin(Math.PI*t/30)**2;
  const eye=[d*Math.sin(az)+0.012*Math.sin(2*Math.PI*t/15),-0.02+0.012*Math.sin(2*Math.PI*t/10),d*Math.cos(az)];
  return {eye,tgt:[0,-0.06,0],fov:.9,sun:SUN,
   p:{c:[0,0,0],r:1,ty:0,tilt:TILT,yaw:YAW,spin:-2*Math.PI*(tau(t)/1440-DFR*t/30)},ring:{n:[0,1,0],a:0},expo:1.38};},
 cards:[
  [0,3.5,[['ASTRONAUTS SEE','#fff'],['16 SUNRISES','#ffcf6b'],['EVERY DAY','#fff']],104],
  [3.5,8,['The space station',['circles Earth','#7fd4ff'],'every ~90 minutes'],92],
  [8,12,['Speed: about',['28,000 km/h','#7fd4ff']],104],
  [12,22.6,['24 hours in orbit:',['count the sunrises','#ffcf6b']],92],
  [22.6,26.6,['But they sleep on',['a 24-hour clock','#7fd4ff']],100],
  [26.6,30.01,[['ASTRONAUTS SEE','#fff'],['16 SUNRISES','#ffcf6b'],['EVERY DAY','#fff']],104]],
 overlay(t){
  const s=SC.scene(t);const eye=s.eye;const m=tau(t);
  // orbit path (faint), front parts only
  x.save();x.strokeStyle='rgba(160,210,255,.28)';x.lineWidth=2.5;x.beginPath();let on=false;
  for(let i=0;i<=360;i++){const p=isP(i/360*PER);if(visible(p,eye)){const q=proj(p);on?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);on=true}else on=false;}x.stroke();x.restore();
  // trail
  x.save();x.globalCompositeOperation='lighter';x.lineCap='round';const tl=Math.min(30,6+rate(t)*0.12);
  for(let k=0;k<40;k++){const m1=m-k*tl/40,m2=m-(k+1)*tl/40;const p1=isP(m1),p2=isP(m2);if(!visible(p1,eye)||!visible(p2,eye))continue;const q1=proj(p1),q2=proj(p2);
   x.strokeStyle='rgba(255,236,190,'+(.8*(1-k/40))+')';x.lineWidth=7*(1-k/40)+1;x.beginPath();x.moveTo(q1[0],q1[1]);x.lineTo(q2[0],q2[1]);x.stroke();}x.restore();
  const p=isP(m);if(visible(p,eye)){const q=proj(p);const day=lit(m)>0;x.save();x.globalCompositeOperation='lighter';
   const g=x.createRadialGradient(q[0],q[1],0,q[0],q[1],46);g.addColorStop(0,day?'rgba(255,250,235,1)':'rgba(200,220,255,.9)');g.addColorStop(.25,day?'rgba(255,220,150,.6)':'rgba(140,170,255,.35)');g.addColorStop(1,'rgba(0,0,0,0)');
   x.fillStyle=g;x.beginPath();x.arc(q[0],q[1],46,0,7);x.fill();x.restore();
   if(t<12)label('ISS',q[0],q[1]-40,ease((t-3.6)/.4)*(1-ease((t-11.5)/.5)),'#ffffff',34);}
  // sunrise flashes: horizontal anamorphic streak + glow at the ISS position
  for(const sr of SR){const dt=t-sr;if(dt<0||dt>0.9)continue;const pp=isP(tau(sr));if(!visible(pp,eye))continue;const q=proj(pp);const a=Math.exp(-dt*4.5);
   x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(q[0],q[1],0,q[0],q[1],260*(0.5+dt));g.addColorStop(0,'rgba(255,230,170,'+.9*a+')');g.addColorStop(.3,'rgba(255,170,80,'+.35*a+')');g.addColorStop(1,'rgba(0,0,0,0)');
   x.fillStyle=g;x.fillRect(q[0]-400,q[1]-400,800,800);const sg=x.createLinearGradient(q[0]-520,0,q[0]+520,0);sg.addColorStop(0,'rgba(255,200,120,0)');sg.addColorStop(.5,'rgba(255,240,210,'+.8*a+')');sg.addColorStop(1,'rgba(255,200,120,0)');
   x.fillStyle=sg;x.fillRect(q[0]-520,q[1]-3,1040,6);x.restore();}
  // counter box: clock + sunrise count
  const ga=t<3.4?0:t<3.8?ease((t-3.4)/.4):t<26.4?1:1-ease((t-26.4)/.4);
  if(ga>0){x.save();x.globalAlpha=ga;x.fillStyle='rgba(8,10,24,.72)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(170,1190,740,180,30);x.fill();x.stroke();x.restore();
   const el=cl(m-T0,0,1440);const hh=Math.floor(el/60),mm=Math.floor(el%60);
   label('TIME IN ORBIT',350,1240,.85*ga,'#d8d2e8',28);label(hh+' h '+String(mm).padStart(2,'0')+' min',350,1318,ga,'#7fd4ff',54);
   const n=cnt(t);let pop=0;for(const sr of SR){const dt=t-sr;if(dt>=0&&dt<.35)pop=1-dt/.35;}
   label('SUNRISES',730,1240,.85*ga,'#d8d2e8',28);label(String(n),730,1320+0,ga,'#ffcf6b',62+18*pop);}
  x.save();x.globalAlpha=.75;x.fillStyle='rgba(0,0,0,.55)';x.beginPath();x.roundRect(W/2-230,1384,460,40,20);x.fill();x.restore();label('Simulated view. Time sped up',W/2,1413,.8,'#d8d2e8',26);
 }
};
