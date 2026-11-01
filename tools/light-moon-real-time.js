// Light from Earth to the Moon in real time, 43.5 s cut (v5).
// v4 -> v5: panel box sizes itself to its text (v4 'AROUND THE EQUATOR' overflowed the border);
// new beat 16.3-30 s: the Moon's distance changes (mean perigee 363,300 km = 1.21 s, mean apogee 405,500 km = 1.35 s, NASA Moon Fact Sheet; real range ~357,000-407,000 km).
// Units: Earth radius = 1 (6,371 km). Earth and Moon sizes and the distances are to scale.
const RE=6371,C=299792.458/RE;          // light speed in Earth radii per second (47.06)
const DM=384400/RE,MR=1737/RE;          // mean distance 60.34, Moon radius 0.2727
const DP=363300/RE,DA=405500/RE;        // perigee, apogee
const DV=norm([0.640,0.768,0]);          // Earth -> Moon direction (diagonal on screen in the side view)
let MP=DV.map(v=>v*DM);
const SUNV=[-0.55,0.4,0.75];
const LAP=40075/299792.458;             // seconds for one lap of the equator (0.1337 s -> 7.48 laps per second)
const S=13.5;                            // shift of every v4 event after 16.5 s
// pulses: [launch time, bounce back?, distance (Earth radii), km]
const PULSES=[[0,false,DM,384400],[6.4,true,DM,384400],[12.3,true,DM,384400],[18.9,false,DP,363300],[25.0,false,DA,405500],[26.0+S,false,DM,384400]];
const RING0=19.0+S;                      // equator pulse runs exactly 1 s, real time
// Moon distance over time: mean -> perigee (16.6-18.4) -> apogee (23.1-24.9) -> back to mean while behind the camera (32.0-34.0)
function dMoon(t){if(t<16.6)return DM;if(t<18.4)return lerp(DM,DP,eio((t-16.6)/1.8));if(t<23.1)return DP;if(t<24.9)return lerp(DP,DA,eio((t-23.1)/1.8));
 if(t<32.0)return DA;if(t<34.0)return lerp(DA,DM,eio((t-32.0)/2.0));return DM}
// views
const V1={eye:[-6,-2.5,2.2],tgt:[7.73,9.27,0],fov:0.7};            // hook: low beside Earth, beam rising to the Moon
const V2={eye:[19.96,28.33,139.1],tgt:[19.96,28.33,0],fov:0.5};    // side view, to scale, straight-on
const V3={eye:[0.9,1.55,3.55],tgt:[0,-0.25,0],fov:0.9};            // Earth close-up, equator
function mix(a,b,u,arc){const k=eio(u);const e=a.eye.map((v,i)=>lerp(v,b.eye[i],k));const bp=Math.sin(Math.PI*k)*(arc||0);e[2]+=bp;
 return {eye:e,tgt:a.tgt.map((v,i)=>lerp(v,b.tgt[i],k)),fov:Math.exp(lerp(Math.log(a.fov),Math.log(b.fov),k))}}
function sway(v,t,a){return {eye:v.eye.map((e,i)=>e+a*Math.sin(2*Math.PI*t/(10+i*5)+i)),tgt:v.tgt,fov:v.fov}}
function cam(t){
 if(t<4.2)return sway(push(V1,t),t,.05);
 if(t<6.0)return mix(push(V1,4.2),V2,(t-4.2)/1.8,20);
 if(t<16.5+S)return V2;
 if(t<18.3+S)return mix(V2,V3,(t-16.5-S)/1.8,10);
 if(t<23.4+S)return sway(V3,t,.03);
 if(t<25.6+S)return mix(V3,push(V1,0),(t-23.4-S)/2.2,6);
 return sway(push(V1,0),t,.05);}
function push(v,t){const k=t<4.2?0.08*ease(t/4.2):0;return {eye:v.eye.map((e,i)=>lerp(e,v.tgt[i],k)),tgt:v.tgt,fov:v.fov}}
// pulse state: distance from Earth centre (in Earth radii) for a pulse launched at t0
function pulseD(t,p){const tau=t-p[0];if(tau<0)return null;const D=p[2];const d=C*tau;
 if(d<=D)return {d,dir:1,tau};if(!p[1])return d<D+C*0.5?{d:D,dir:0,tau}:null;const d2=2*D-d;return d2>=0?{d:d2,dir:-1,tau}:(d2>-C*0.5?{d:0,dir:0,tau}:null)}
let EYE=[0,0,1];
function hidden(p){const eye=EYE;const dv=p.map((v,i)=>v-eye[i]);const L=Math.hypot(...dv);const u=dv.map(v=>v/L);
 for(const [c,r] of [[[0,0,0],1],[MP,MR]]){const oc=eye.map((v,i)=>v-c[i]);const b=oc[0]*u[0]+oc[1]*u[1]+oc[2]*u[2];const cc=oc[0]**2+oc[1]**2+oc[2]**2-r*r;const h=b*b-cc;
  if(h<0)continue;const t0=-b-Math.sqrt(h);if(t0>0&&t0<L-1e-3)return true;}return false}
function glow(px,py,r,col,a){if(a<=0)return;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=a;const g=x.createRadialGradient(px,py,0,px,py,r);
 g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill();x.restore()}
const BEAM='rgba(140,210,255,.9)';
function drawBeam(t,p){
 const N=90;let prev=null;const TL=0.55;const D=p[2];
 x.save();x.globalCompositeOperation='lighter';x.lineCap='round';
 for(let i=0;i<=N;i++){const tt=t-TL*(1-i/N);const s=pulseD(tt,p);if(!s||s.d<1.0||(s.dir===0)){prev=null;continue;}
  const P=DV.map(v=>v*s.d);if(s.d>D-MR&&s.dir===1){prev=null;continue;}
  if(hidden(P)){prev=null;continue;}const q=proj(P);
  if(prev){const a=i/N;x.strokeStyle='rgba(150,215,255,'+(0.08+0.85*a*a*a)+')';x.lineWidth=2+8*a*a;x.shadowColor='#7fd0ff';x.shadowBlur=16;x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(q[0],q[1]);x.stroke();}
  prev=q;}
 x.restore();
 const s=pulseD(t,p);if(s&&s.dir!==0&&s.d>=1&&!(s.dir===1&&s.d>D-MR)){const P=DV.map(v=>v*s.d);if(!hidden(P)){const q=proj(P);glow(q[0],q[1],46,BEAM,1);glow(q[0],q[1],16,'rgba(255,255,255,1)',1);}}
 const ta=p[0]+D/C;const fa=t-ta;if(fa>=0&&fa<0.9){const q=proj(DV.map(v=>v*D));const k=Math.exp(-fa*4.5);glow(q[0],q[1],40+170*(1-k),'rgba(255,230,170,.9)',k);}
 if(p[1]){const fb=t-(p[0]+2*D/C);if(fb>=0&&fb<0.9){const q=proj([0,0,0]);const k=Math.exp(-fb*4.5);glow(q[0],q[1],60+200*(1-k),'rgba(140,255,190,.8)',k*.8);}}
 const f0=t-p[0];if(f0>=0&&f0<0.6){const q=proj(DV);const k=Math.exp(-f0*6);glow(q[0],q[1],50+160*(1-k),BEAM,k)}
}
const PANEL_R=910;
const FOOTX=690;                         // footnote centre: right of the hook beam's path (beam crosses y=1196 near x=390)
function panelState(t){
 let tm=null,km=null,sub='';
 for(const p of PULSES){const tau=t-p[0];const tot=p[1]?2*p[2]/C:p[2]/C;const hold=p[0]>=39?4.1:p[0]===18.9?2.85:p[0]===25.0?3.4:1.6;
  if(tau>=0&&tau<tot+hold){tm=Math.min(tau,tot);km=Math.min(tau*299792.458,p[1]?2*p[3]:p[3]);sub=p[1]&&tau>p[2]/C?'THERE AND BACK':'EARTH → MOON';}}
 const r=t-RING0;let laps=null;if(r>=-0.3&&r<3.6){tm=cl(r,0,1);laps=cl(r,0,1)/LAP;sub='AROUND THE EQUATOR'}
 if(tm===null)return null;return {tm,km,sub,laps};}
function panel(t){
 const st=panelState(t);if(!st)return;const {tm,km,sub,laps}=st;
 const l3=laps!==null?'LAPS: '+laps.toFixed(1):Math.round(km).toLocaleString('en-US')+' km';
 x.save();x.globalAlpha=t<0.25?ease(t/.25):t>SC.D-0.4?ease((SC.D-t)/.4):1; // loop point: panel hidden on first and last frame
 x.font='800 26px '+F;const w1=x.measureText(sub).width;x.font='900 74px "DejaVu Sans Mono",monospace';const w2=x.measureText('0.00 s').width;x.font='800 30px '+F;const w3=x.measureText(l3).width;
 const bw=Math.max(350,Math.max(w1,w2,w3)+60),x0=PANEL_R-bw;
 x.fillStyle='rgba(8,10,24,.72)';x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=3;x.beginPath();x.roundRect(x0,1222,bw,196,28);x.fill();x.stroke();
 x.textAlign='left';x.font='800 26px '+F;x.fillStyle='#bcd2ff';x.fillText(sub,x0+28,1264);
 x.font='900 74px "DejaVu Sans Mono",monospace';x.fillStyle='#ffffff';x.shadowColor='#7fd0ff';x.shadowBlur=18;x.fillText(tm.toFixed(2)+' s',x0+26,1340);x.shadowBlur=0;
 x.font='800 30px '+F;x.fillStyle='#ffd36b';x.fillText(l3,x0+28,1392);x.restore();
 window.PANELBOX=[x0,1222,PANEL_R,1418];
}
SC={D:30+S,
 scene(t){MP=DV.map(v=>v*dMoon(t));const c=cam(t);EYE=c.eye;
  return {eye:c.eye,tgt:c.tgt,fov:c.fov,sun:SUNV,
   p:{c:[0,0,0],r:1,ty:0,tilt:0,yaw:200,spin:-t*0.004},
   q:{c:MP,r:MR,ty:4,tilt:0,yaw:0,spin:Math.atan2(-MP[2],-MP[0])+Math.PI},ring:{n:[0,1,0],a:0},axis:0,expo:1.0};},
 cards:[
  [0,1.5,[['LIGHT TO THE MOON','#fff'],['REAL TIME','#7fd4ff']],112],
  [1.5,6.0,['It takes',['1.28 SECONDS','#ffd36b']],116],
  [6.0,9.0,['To scale:',['384,400 km','#7fd4ff']],112],
  [9.0,12.2,['There and back:',['2.56 SECONDS','#ffd36b']],108],
  [12.2,16.3,['Apollo mirrors',['still bounce it back','#7dffb0']],104],
  [16.3,20.2,['But the distance',['CHANGES','#7fd4ff']],112],
  [20.2,23.0,['Average closest:',['1.21 SECONDS','#ffd36b']],108],
  [23.0,26.4,['And at its',['farthest point?','#7fd4ff']],108],
  [26.4,29.8,['Average farthest:',['1.35 SECONDS','#ffd36b']],108],
  [18.3+S,20.2+S,['Around Earth',['in 1 second?','#7fd4ff']],112],
  [20.2+S,23.6+S,['7.5 TIMES',['around the equator','#ffd36b']],112],
  [24.0+S,27.6+S,['Nothing travels faster.',['Still 1.28 s','#7fd4ff']],108],
  [27.6+S,30.01+S,[['LIGHT TO THE MOON','#fff'],['REAL TIME','#7fd4ff']],112]],
 overlay(t){
  const s=SC.scene(t);
  const sv=t<5.4?0:t<6?ease((t-5.4)/.6):t<16.3+S?1:t<16.8+S?1-ease((t-16.3-S)/.5):0;
  if(sv>0){const qe=proj([0,0,0]),qm=proj(MP);
   // faint marker of the average distance while the Moon is off it
   const off=Math.abs(dMoon(t)-DM)/(DM-DP);if(off>0.02){const q0=proj(DV.map(v=>v*DM));x.save();x.globalAlpha=sv*.45*Math.min(1,off*2);x.strokeStyle='#e8e2d0';x.lineWidth=2;x.setLineDash([5,7]);x.beginPath();x.arc(q0[0],q0[1],22,0,7);x.stroke();x.restore();}
   x.save();x.globalAlpha=sv*.6;x.lineWidth=2.5;x.strokeStyle='#cfe3ff';x.beginPath();x.arc(qe[0],qe[1],34,0,7);x.stroke();x.strokeStyle='#e8e2d0';x.beginPath();x.arc(qm[0],qm[1],22,0,7);x.stroke();x.restore();label('EARTH',qe[0]+40,qe[1]-62,sv*.9,'#cfe3ff',30);label('MOON',qm[0]-6,qm[1]+62,sv*.9,'#e8e2d0',30);
   x.save();x.globalAlpha=sv*.35;x.strokeStyle='#bcd2ff';x.setLineDash([6,12]);x.lineWidth=2;x.beginPath();x.moveTo(qe[0],qe[1]);x.lineTo(qm[0],qm[1]);x.stroke();x.restore();}
  {const qm=proj(MP);const rr=Math.max(10,MR/Math.hypot(...MP.map((v,i)=>v-EYE[i]))/CAM.fov*W);glow(qm[0],qm[1],rr*4,'rgba(255,240,215,.35)',.55);
   const ma=(t<4.6||t>25.6+S)?1:0;if(ma){x.save();x.globalAlpha=.55;x.strokeStyle='#e8e2d0';x.lineWidth=2;x.beginPath();x.arc(qm[0],qm[1],rr+16,0,7);x.stroke();x.restore();label('MOON',qm[0],qm[1]-rr-30,.8,'#e8e2d0',30);}}
  for(const p of PULSES)drawBeam(t,p);
  const r=t-RING0;if(r>=0&&r<3.4){const R=1.035;
   x.save();x.globalCompositeOperation='lighter';x.lineCap='round';
   const tr=cl(r/LAP,0,1)*(r<1.2?1:Math.exp(-(r-1.2)*1.4));
   if(tr>0){x.strokeStyle='rgba(120,200,255,'+(.28*tr)+')';x.lineWidth=4;let pv=null;for(let i=0;i<=180;i++){const a=i/180*2*Math.PI;const P=[R*Math.cos(a),0,R*Math.sin(a)];if(hidden(P)){pv=null;continue;}const q=proj(P);if(pv){x.beginPath();x.moveTo(pv[0],pv[1]);x.lineTo(q[0],q[1]);x.stroke();}pv=q;}}
   if(r<=1.0){const N=60;let pv=null;for(let i=0;i<=N;i++){const tt=r-0.035*(1-i/N);if(tt<0){pv=null;continue;}const a=-2*Math.PI*tt/LAP+2.2;const P=[R*Math.cos(a),0,R*Math.sin(a)];
     if(hidden(P)){pv=null;continue;}const q=proj(P);if(pv){const k=i/N;x.strokeStyle='rgba(160,220,255,'+(.9*k)+')';x.lineWidth=3+8*k;x.shadowColor='#7fd0ff';x.shadowBlur=18;x.beginPath();x.moveTo(pv[0],pv[1]);x.lineTo(q[0],q[1]);x.stroke();}pv=q;}
    const a=-2*Math.PI*r/LAP+2.2;const P=[R*Math.cos(a),0,R*Math.sin(a)];if(!hidden(P)){const q=proj(P);glow(q[0],q[1],40,BEAM,1);}}
   x.restore();}
  window.PANELBOX=null;panel(t);
  const da=t<5.6?0:t<6.2?ease((t-5.6)/.6):t<16.3+S?1:t<16.8+S?1-ease((t-16.3-S)/.5):0;
  label('Sizes + distance to scale',735,1196,.7*da,'#d8d2e8',25);
  const ra=t<5.0?1:t<5.5?1-ease((t-5.0)/.5):t<16.8+S?0:t<17.3+S?ease((t-16.8-S)/.5):1;
  label('Real-time light speed. Simulation',FOOTX,1196,.62*ra,'#d8d2e8',25);}
};
