// jump-five-worlds: the same jump (same push-off speed as a 50 cm jump on Earth) on Earth, Mars, the Moon, Pluto and Ceres, in real time.
// Physics: no air, constant gravity, same take-off speed v = sqrt(2 g_E h_E). Height h = v^2/(2g), air time T = 2v/g.
// Sources: NASA NSSDC fact sheets (surface gravity, mean: Earth 9.82, Mars 3.73, Moon 1.62, Pluto 0.62 m/s^2);
//   Ceres: Park et al. 2016 (JPL, Dawn gravity science) GM = 62.6285 km^3/s^2, mean radius ~470 km (JPL SSD: 469.7 km) -> g = GM/R^2 = 0.284 m/s^2.
//   Planet spin ignored.
const D=30.5,FPS=30,W=1080,H=1920;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const lerp=(a,b,k)=>a+(b-a)*k;
const GE=9.82,HE=0.5,V0=Math.sqrt(2*GE*HE),TL=0.55;
const CERES_G=62.6285e9/(469.7e3*469.7e3);
const WORLDS=[
 {name:'EARTH',g:9.82,x0:0,x1:234,cx:147},
 {name:'MARS',g:3.73,x0:234,x1:408,cx:321},
 {name:'MOON',g:1.62,x0:408,x1:582,cx:495},
 {name:'PLUTO',g:0.62,x0:582,x1:756,cx:669},
 {name:'CERES',g:CERES_G,x0:756,x1:1080,cx:843}];
for(const w of WORLDS){w.T=2*V0/w.g;w.h=V0*V0/(2*w.g);w.tA=TL+w.T/2;w.tD=TL+w.T;}
const GY=1400,TOPY=745,S0=170;
// body (m)
const B={thigh:.45,shin:.45,ank:.07,torso:.56,neck:.08,head:.125,ua:.30,fa:.28,foot:.2};
const HIPEXT=B.thigh+B.shin+B.ank; // hip height with straight legs
// poses: [torso lean, thigh, shin, upper arm, elbow, back-limb offset]  (angles in rad, + = forward)
const P={stand:[.04,0,0,.08,.15],crouch:[.62,1.25,-.78,-1.0,.35],ext:[.0,.05,-.12,2.55,.12],air:[.02,.32,-.55,2.35,.4],land:[.05,.28,-.2,1.3,.5],absorb:[.5,1.05,-.68,.9,.6]};
function mix(a,b,k){return a.map((v,i)=>lerp(v,b[i],k))}
function legH(p){return B.thigh*Math.cos(p[1])+B.shin*Math.cos(p[2])+B.ank}
// state of one jumper at time t: {hip (m above ground), pose, air}
function jumper(w,t){
 let pose,hip,air=false;
 if(t<0.30){pose=mix(P.stand,P.crouch,eio(t/0.30));hip=legH(pose)}
 else if(t<TL){pose=mix(P.crouch,P.ext,eio((t-0.30)/(TL-0.30)));hip=legH(pose)}
 else if(t<w.tD){air=true;const u=t-TL;hip=HIPEXT+V0*u-0.5*w.g*u*u;
  const kin=ease(u/0.18),kout=ease((w.tD-t)/Math.min(0.22,w.T/3));
  let a=mix(P.ext,P.air,kin);
  // slow idle motion of arms and legs during long hangs (internal motion, does not change the flight)
  const idle=cl((u-0.6)/1.2)*cl((w.tD-t-0.6)/1.2);
  if(idle>0){const s=Math.sin(2*Math.PI*u/3.2),c=Math.sin(2*Math.PI*u/2.3+1);a=a.slice();a[3]+=-0.55*idle*(0.6+0.4*s);a[1]+=0.18*idle*c;a[2]+=-0.15*idle*c;a[4]+=0.2*idle*s}
  pose=mix(P.land,a,kout)}
 else {const u=t-w.tD;
  if(u<0.13){pose=mix(P.land,P.absorb,eio(u/0.13))}else pose=mix(P.absorb,P.stand,eio((u-0.13)/0.55));
  hip=legH(pose)}
 return {hip,pose,air};}
const HEADTOP=B.torso+B.neck+2*B.head; // above hip (upright)
// camera scale: fit the highest head (looking 0.8 s ahead) between GY and TOPY, critically damped smoothing; precomputed
const SC=[];(function(){const N=Math.ceil(D*FPS)+2,sub=8,dt=1/FPS/sub;let s=S0,vs=0;const wn=5.0;
 const tgt=t=>{let m=0;for(const w of WORLDS){for(let k=0;k<=8;k++){const tt=t+k*0.1;const j=jumper(w,tt);m=Math.max(m,j.hip+HEADTOP+0.25)}}return Math.min(S0,(GY-TOPY)/m)};
 for(let i=0;i<N;i++){SC.push(s);for(let k=0;k<sub;k++){const t=i/FPS+k*dt;const g=tgt(t);const ac=wn*wn*(g-s)-2*wn*vs;vs+=ac*dt;s+=vs*dt;if(s>S0){s=S0;vs=Math.min(vs,0)}}}})();
function scaleJ(t){const f=Math.max(0,t)*FPS,i=Math.floor(f),k=f-i;return lerp(SC[Math.min(i,SC.length-1)],SC[Math.min(i+1,SC.length-1)],k)}
// recap tail: pull back to show every jump height at once, then push back in for the loop
const S1=(GY-TOPY)/(17.3+2.3),Z_OUT=[24.4,25.7],Z_IN=[28.3,29.4];
function zk(t){return eio((t-Z_OUT[0])/(Z_OUT[1]-Z_OUT[0]))*(1-eio((t-Z_IN[0])/(Z_IN[1]-Z_IN[0])))}
function scale(t){const b=scaleJ(t),k=zk(t);return k<=0?b:Math.exp(lerp(Math.log(b),Math.log(S1),k))}
// height beams rise one column at a time during the pull-back
const BEAM_T0=24.7,BEAM_DT=0.3,BEAM_RISE=0.7;
function beamK(i,t){return eio((t-(BEAM_T0+i*BEAM_DT))/BEAM_RISE)*(1-ease((t-27.9)/0.4))}
// joints in metres (x forward, y up) relative to feet point under the hip
function joints(j){const p=j.pose,hy=j.hip;const hip=[0,hy];
 const knee=[hip[0]+B.thigh*Math.sin(p[1]),hip[1]-B.thigh*Math.cos(p[1])];
 const ank=[knee[0]+B.shin*Math.sin(p[2]),knee[1]-B.shin*Math.cos(p[2])];
 const heel=[ank[0]-0.05,ank[1]-B.ank],toe=[ank[0]+B.foot*0.85,ank[1]-B.ank];
 const sh=[hip[0]+B.torso*Math.sin(p[0]),hip[1]+B.torso*Math.cos(p[0])];
 const hd=[sh[0]+(B.neck+B.head)*Math.sin(p[0]*0.8),sh[1]+(B.neck+B.head)*Math.cos(p[0]*0.8)];
 const el=[sh[0]+B.ua*Math.sin(p[3]),sh[1]-B.ua*Math.cos(p[3])];
 const ea=p[3]+p[4];const hand=[el[0]+B.fa*Math.sin(ea),el[1]-B.fa*Math.cos(ea)];
 return {hip,knee,ank,heel,toe,sh,hd,el,hand};}
// cards
const CARDS=[
 {a:0,b:3.0,l:['SAME JUMP, 5 WORLDS','WHO LANDS LAST?'],c:[0,1],foot:'same push-off speed · no air · no spacesuit'},
 {a:3.1,b:6.2,l:['THE MOON: 6× HIGHER','AND 6× LONGER'],c:[0,1]},
 {a:6.3,b:9.6,l:['CERES IS STILL','GOING UP'],c:[0,1]},
 {a:10.75,b:13.9,l:['PLUTO: 10 SECONDS','IN THE AIR'],c:[0,1]},
 {a:14.0,b:17.6,l:['CERES: ABOUT 3%','OF EARTH’S GRAVITY'],c:[0,1]},
 {a:17.7,b:21.6,l:['17 METERS UP','FROM A 50 cm JUMP'],c:[0,1]},
 {a:22.75,b:24.9,l:['22 SECONDS','IN THE AIR'],c:[0,1]},
 {a:25.0,b:28.2,l:['GRAVITY VS EARTH','LESS PULL, MORE AIR'],c:[0,1]},
 {a:28.3,b:29.95,l:['WHERE WOULD','YOU JUMP?'],c:[0,1]},
 {a:30.05,b:D,l:['SAME JUMP, 5 WORLDS','WHO LANDS LAST?'],c:[0,1],foot:'same push-off speed \u00b7 no air \u00b7 no spacesuit'}];
// recap chips: gravity as % of Earth's, popping in one column at a time
const CHIP_T0=24.7+0.7,CHIP_DT=0.3,CHIP_OUT=27.9;
for(const [i,w] of WORLDS.entries()){w.pct=Math.round(w.g/WORLDS[0].g*100)+'%';w.chipT=CHIP_T0+i*CHIP_DT;}
function fmtT(s){return s<9.995?s.toFixed(2)+' s':s.toFixed(1)+' s'}
function fmtH(h){return '↑ '+h.toFixed(1)+' m'}
// HUD readout state per world at time t
function hud(w,t){const fin=1-ease((t-29.8)/0.6);  // reset at the loop seam
 const el=cl(t-TL,0,w.T);const run=t>=TL&&t<w.tD;const done=t>=w.tD;
 return {timer:fmtT(fin<1&&t>29.8?el*fin:el),timerOn:run?1:(done?0.75:0.45),hAl:(t>=w.tA?ease((t-w.tA)/0.3):0)*fin,hTxt:fmtH(w.h)};}
if(typeof module!=='undefined')module.exports={beamK,zk,S1,CHIP_T0,CHIP_DT,CHIP_OUT,D,FPS,WORLDS,V0,TL,GY,TOPY,S0,CARDS,jumper,joints,scale,HEADTOP,hud,B};
