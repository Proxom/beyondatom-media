// jump-four-moons (style A, sequel to jump-five-worlds): the same jump (same push-off speed as a 50 cm jump on Earth) on Earth, the Moon, Europa, Triton and Titania, in real time.
// Physics: no air, constant gravity, same take-off speed v = sqrt(2 g_E h_E). Height h = v^2/(2g), air time T = 2v/g.
// Sources: NASA NSSDC Earth (9.82) and Moon (1.62 m/s^2) fact sheets; g = G M / R^2 from NSSDC satellite fact sheets:
//   Europa 480.0e20 kg, 1560.8 km -> 1.315; Triton 214e20 kg, 1353.4 km -> 0.780; Titania 34.2e20 kg, 788.9 km -> 0.367 m/s^2.
//   Planet spin ignored.
const D=22.9,LOOP=22.45,FPS=30,W=1080,H=1920;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const lerp=(a,b,k)=>a+(b-a)*k;
const GE=9.82,HE=0.5,V0=Math.sqrt(2*GE*HE),TL=0.55;
const GG=6.674e-11,gm=(m,r)=>GG*m/(r*r);
const WORLDS=[
 {name:'EARTH',g:9.82,x0:0,x1:234,cx:147},
 {name:'MOON',g:1.62,x0:234,x1:408,cx:321},
 {name:'EUROPA',g:gm(480.0e20,1560.8e3),x0:408,x1:582,cx:495},
 {name:'TRITON',g:gm(214e20,1353.4e3),x0:582,x1:756,cx:669},
 {name:'TITANIA',g:gm(34.2e20,788.9e3),x0:756,x1:1080,cx:843}];
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
const HMAX=Math.max(...WORLDS.map(w=>w.h)),S1=(GY-TOPY)/(HMAX+3.3),Z_OUT=[18.0,19.2],Z_IN=[21.0,22.0];
function zk(t){return eio((t-Z_OUT[0])/(Z_OUT[1]-Z_OUT[0]))*(1-eio((t-Z_IN[0])/(Z_IN[1]-Z_IN[0])))}
function scale(t){const b=scaleJ(t),k=zk(t);return k<=0?b:Math.exp(lerp(Math.log(b),Math.log(S1),k))}
// height beams rise one column at a time during the pull-back
const BEAM_T0=18.3,BEAM_DT=0.3,BEAM_RISE=0.7;
function beamK(i,t){return eio((t-(BEAM_T0+i*BEAM_DT))/BEAM_RISE)*(1-ease((t-20.9)/0.4))}
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
 {a:0,b:3.0,l:['SAME JUMP, 4 MOONS','WHO LANDS LAST?'],c:[0,1],foot:'Earth for comparison \u00b7 same push-off \u00b7 no air'},
 {a:3.1,b:5.2,l:['THE MOON: 6\u00d7 HIGHER','AND 6\u00d7 LONGER'],c:[0,1]},
 {a:5.3,b:8.5,l:['TITANIA IS STILL','GOING UP'],c:[0,1]},
 {a:8.6,b:11.6,l:['TRITON: 8 SECONDS','IN THE AIR'],c:[0,1]},
 {a:11.7,b:14.6,l:['13 METERS UP','FROM A 50 cm JUMP'],c:[0,1]},
 {a:14.7,b:17.6,l:['TITANIA: ABOUT 4%','OF EARTH\u2019S GRAVITY'],c:[0,1]},
 {a:17.7,b:18.95,l:['17 SECONDS','IN THE AIR'],c:[0,1]},
 {a:19.0,b:20.95,l:['GRAVITY VS EARTH','LESS PULL, MORE AIR'],c:[0,1]},
 {a:21.0,b:22.4,l:['WHICH MOON','WOULD YOU PICK?'],c:[0,1]},
 {a:LOOP,b:D,l:['SAME JUMP, 4 MOONS','WHO LANDS LAST?'],c:[0,1],foot:'Earth for comparison \u00b7 same push-off \u00b7 no air'}];
const FOLLOW={a:21.1,b:22.4,txt:'FOLLOW \u2192 MORE EVERY DAY'};
// recap chips: gravity as % of Earth's, popping in one column at a time
const CHIP_T0=18.3+0.7,CHIP_DT=0.3,CHIP_OUT=20.9;
for(const [i,w] of WORLDS.entries()){w.pct=Math.round(w.g/WORLDS[0].g*100)+'%';w.chipT=CHIP_T0+i*CHIP_DT;}
function fmtT(s){return s<9.995?s.toFixed(2)+' s':s.toFixed(1)+' s'}
function fmtH(h){return '↑ '+h.toFixed(1)+' m'}
// HUD readout state per world at time t
function hud(w,t){const fin=1-ease((t-(LOOP-0.65))/0.6);  // reset at the loop seam
 const el=cl(t-TL,0,w.T);const run=t>=TL&&t<w.tD;const done=t>=w.tD;
 return {timer:fmtT(fin<1&&t>LOOP-0.65?el*fin:el),timerOn:run?1:(done?0.75:0.45),hAl:(t>=w.tA?ease((t-w.tA)/0.3):0)*fin,hTxt:fmtH(w.h)};}
if(typeof module!=='undefined')module.exports={LOOP,FOLLOW,HMAX,beamK,zk,S1,CHIP_T0,CHIP_DT,CHIP_OUT,D,FPS,WORLDS,V0,TL,GY,TOPY,S0,CARDS,jumper,joints,scale,HEADTOP,hud,B};
