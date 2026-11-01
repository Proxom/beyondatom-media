// Phobos rises in the west: top view over Mars' north pole, orbit radius to scale (9,378 km = 2.761 equatorial Mars radii), Phobos enlarged.
// Sources: NASA PIA06339 (7 h 39 min orbit, rises in the west), NASA Mars Moons (1.8 m per 100 years, 50 million years),
// NSSDC Mars/Phobos fact sheets (rotation 24.6229 h, Phobos period 0.31891 d, a = 9,378 km; ESA: 9,375 km).
const PM=24.6229,PP=0.31891*24,A=9378/3396.2,PR=0.14;      // hours, hours, orbit radius in equatorial Mars radii (NSSDC), Phobos display radius
const PSYN=1/(1/PP-1/PM);                                   // 11.11 h between rises for a fixed spot on the equator
const HZ=Math.acos(1/A);                                    // 68.8 deg: Phobos is above an equator horizon while |psi| < HZ
const S=-1;                                                 // angles decrease = counterclockwise seen from above the north pole (+y)
const DUR=46;
function rate(t){ // simulated hours per second of video
 if(t<11.8)return 1.6;if(t<13.4)return lerp(1.6,.42,eio((t-11.8)/1.6));if(t<27.0)return .42;
 if(t<28.6)return lerp(.42,3.6,eio((t-27)/1.6));if(t<35.6)return 3.6;if(t<37.0)return lerp(3.6,1.2,eio((t-35.6)/1.4));return 1.2;}
const HT=[0];(function(){for(let i=1;i<=DUR*300;i++)HT.push(HT[i-1]+rate((i-.5)/300)/300);})();
const hrs=t=>{const f=cl(t,0,DUR)*300,i=Math.floor(f);return i>=DUR*300?HT[DUR*300]:lerp(HT[i],HT[i+1],f-i)};
const T_RISE=15.8,T_MID=20.8;                               // first rise on screen; pin straight below Mars at T_MID
const PSI0=-HZ-2*Math.PI*hrs(T_RISE)/PSYN;                  // psi = Phobos angle ahead of the observer (east +)
const psi=t=>PSI0+2*Math.PI*hrs(t)/PSYN;
const SP0=Math.PI/2*S-S*2*Math.PI*hrs(T_MID)/PM;            // ground angle (world) of the observer: pi/2 (screen down) at T_MID
const pinA=t=>SP0*1+S*2*Math.PI*hrs(t)/PM;                  // world angle of the observer (rotates with Mars)
const phA=t=>pinA(t)+S*psi(t);                              // world angle of Phobos
const up=t=>Math.cos(psi(t))>1/A;                           // above the observer's horizon
// rise events (psi crossing -HZ) for the counter, from the model itself
const RISES=[];(function(){let prev=psi(0);for(let i=1;i<=DUR*300;i++){const t=i/300,p=psi(t);const k0=Math.floor((prev+HZ)/(2*Math.PI)),k1=Math.floor((p+HZ)/(2*Math.PI));if(k1>k0)RISES.push(t);prev=p;}})();
const SETS=[];(function(){let prev=psi(0);for(let i=1;i<=DUR*300;i++){const t=i/300,p=psi(t);const k0=Math.floor((prev-HZ)/(2*Math.PI)),k1=Math.floor((p-HZ)/(2*Math.PI));if(k1>k0)SETS.push(t);prev=p;}})();
const C0=28.0;const C1=(function(){const h0=hrs(C0);let t=C0;while(hrs(t)<h0+PM)t+=1/300;return t})(); // one full Mars spin
const pos=(ang,r)=>[r*Math.cos(ang),0,r*Math.sin(ang)];
const EYE=[0.39,10,0.37],TGT=[0.39,0,-0.23],FOV=0.711;
const fa=(t,a,b,fi=.4,fo=.4)=>t<a?0:t<a+fi?ease((t-a)/fi):t<b-fo?1:t<b?1-ease((t-(b-fo))/fo):0;
function cardY(lines,size,alpha,dy){if(alpha<=0)return;x.save();x.globalAlpha=alpha;x.textAlign='center';
 let mw=0;x.font='900 '+size+'px '+F;lines.forEach(l=>{mw=Math.max(mw,x.measureText(typeof l==='string'?l:l[0]).width)});
 if(mw>800){size=Math.floor(size*800/mw);x.font='900 '+size+'px '+F}x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=24;
 lines.forEach((l,i)=>{x.fillStyle=typeof l==='string'?'#fff':l[1];x.fillText(typeof l==='string'?l:l[0],W/2,400+i*size*1.18+(dy||0))});x.restore()}
function arrowArc(r,a0,a1,col,al,w){ // arc in the equatorial plane from angle a0 to a1 with an arrow head at a1
 if(al<=0)return;x.save();x.globalAlpha=al;x.strokeStyle=col;x.fillStyle=col;x.lineWidth=w||7;x.lineCap='round';x.shadowColor=col;x.shadowBlur=14;x.beginPath();
 const n=48;for(let i=0;i<=n;i++){const q=proj(pos(lerp(a0,a1,i/n),r));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();
 const e=proj(pos(a1,r)),e2=proj(pos(a1-(a1-a0)*.02,r));const g=Math.atan2(e[1]-e2[1],e[0]-e2[0]);
 x.beginPath();x.moveTo(e[0]+Math.cos(g)*22,e[1]+Math.sin(g)*22);x.lineTo(e[0]+Math.cos(g+2.5)*20,e[1]+Math.sin(g+2.5)*20);x.lineTo(e[0]+Math.cos(g-2.5)*20,e[1]+Math.sin(g-2.5)*20);x.fill();x.restore();}
SC={D:DUR,
 scene(t){const sw=[.012*Math.sin(2*Math.PI*t/11.5),0,.01*Math.sin(2*Math.PI*t/9.2)];
  return {eye:EYE.map((v,i)=>v+sw[i]),tgt:TGT.map((v,i)=>v+sw[i]),fov:FOV,sun:[-.55,.32,-.78],
   p:{c:[0,0,0],r:1,ty:5,tilt:0,yaw:0,spin:pinA(t)},
   q:{c:pos(phA(t),A),r:PR,ty:6,tilt:0,yaw:0,spin:phA(t)+Math.PI},ring:{n:[0,1,0],a:0},axis:0,expo:1.05};},
 cards:[],
 overlay(t){
  const O=proj([0,0,0]);const pa=pinA(t),ph=phA(t),pp=proj(pos(ph,A));const isUp=up(t);
  // orbit path (to scale)
  x.save();x.globalAlpha=.42;x.strokeStyle='#cfd8ff';x.lineWidth=3;x.setLineDash([12,14]);x.lineDashOffset=-t*8;x.beginPath();
  for(let i=0;i<=240;i++){const q=proj(pos(i/240*2*Math.PI,A));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();x.restore();
  // Phobos trail (beat 2-3) - drawn behind it along the orbit
  const ta=fa(t,7.6,11.8,.5,.5)+fa(t,0,3.4,0,.4)*.6;
  if(ta>0){x.save();x.lineCap='round';for(let k=0;k<30;k++){const a0=ph-S*(k/30)*1.6,a1=ph-S*((k+1)/30)*1.6;const q0=proj(pos(a0,A)),q1=proj(pos(a1,A));
   x.globalAlpha=ta*(1-k/30)*.8;x.strokeStyle='#ffd9a8';x.lineWidth=8*(1-k/30)+2;x.beginPath();x.moveTo(q0[0],q0[1]);x.lineTo(q1[0],q1[1]);x.stroke();}x.restore();}
  // Mars spin arrow (beat 1)
  arrowArc(1.13,pa-S*0.2,pa+S*1.5,'#ffb38a',fa(t,3.4,7.6,.5,.5),7);
  // observer, horizon and sky side
  const pinA_=fa(t,11.8,36.4,.6,.6);const P=pos(pa,1),Pp=proj(P);const tg=[-Math.sin(pa),0,Math.cos(pa)];   // tangent direction (toward increasing angle)
  const east=tg.map(v=>v*S);                                // east = direction of rotation
  if(pinA_>0){
   // sky side tint (beyond the tangent line)
   x.save();x.beginPath();x.arc(O[0],O[1],(proj(pos(0,A+.12))[0]-O[0]),0,7);x.clip();x.globalAlpha=pinA_*.22;const nrm=[Math.cos(pa),0,Math.sin(pa)];
   const L=2.9,q1=proj(P.map((v,i)=>v+east[i]*L)),q2=proj(P.map((v,i)=>v-east[i]*L)),q3=proj(P.map((v,i)=>v-east[i]*L+nrm[i]*2.2)),q4=proj(P.map((v,i)=>v+east[i]*L+nrm[i]*2.2));
   const gq=proj(P.map((v,i)=>v+nrm[i]*2.0));const gr=x.createLinearGradient(Pp[0],Pp[1],gq[0],gq[1]);gr.addColorStop(0,'rgba(120,170,255,.9)');gr.addColorStop(1,'rgba(120,170,255,0)');
   x.fillStyle=gr;x.beginPath();x.moveTo(q1[0],q1[1]);x.lineTo(q2[0],q2[1]);x.lineTo(q3[0],q3[1]);x.lineTo(q4[0],q4[1]);x.closePath();x.fill();x.restore();
   // horizon line
   const Lh=2.75,h1=proj(P.map((v,i)=>v+east[i]*Lh)),h2=proj(P.map((v,i)=>v-east[i]*Lh));
   x.save();x.globalAlpha=pinA_*.9;x.strokeStyle='#e9f0ff';x.lineWidth=4;x.shadowColor='#9cc0ff';x.shadowBlur=10;x.beginPath();x.moveTo(h2[0],h2[1]);x.lineTo(h1[0],h1[1]);x.stroke();x.restore();
   // compass letters at the line ends, nudged to the sky side
   const off=proj(P.map((v,i)=>v+east[i]*1.7+nrm[i]*0.3)),offW=proj(P.map((v,i)=>v-east[i]*1.7+nrm[i]*0.3));
   const la=fa(t,11.8,28.6,.6,.6);
   const cx_=v=>Math.max(95,Math.min(890,v));
   label('E',cx_(off[0]),off[1]+18,la,'#ffd36b',54);label('W',cx_(offW[0]),offW[1]+18,la,'#ffd36b',54);
   // the observer pin
   x.save();x.globalAlpha=pinA_;x.fillStyle='#7dffb0';x.shadowColor='#7dffb0';x.shadowBlur=16;x.beginPath();x.arc(Pp[0],Pp[1],11,0,7);x.fill();
   const tip=proj(P.map((v,i)=>v+nrm[i]*0.17));x.strokeStyle='#7dffb0';x.lineWidth=5;x.beginPath();x.moveTo(Pp[0],Pp[1]);x.lineTo(tip[0],tip[1]);x.stroke();x.restore();
   const ya=fa(t,11.8,28.6,.6,.6);const yl=proj(P.map((v,i)=>v+nrm[i]*0.62));label('YOU',yl[0],yl[1]+16,ya,'#7dffb0',44);
   // sight line while Phobos is up
   const sa=isUp?Math.min(1,(Math.cos(psi(t))-1/A)*6):0;
   if(sa>0){x.save();x.globalAlpha=pinA_*sa*.85;x.strokeStyle='#7dffb0';x.lineWidth=3;x.setLineDash([8,10]);x.beginPath();x.moveTo(Pp[0],Pp[1]);x.lineTo(pp[0],pp[1]);x.stroke();x.restore();}
  }
  // Phobos highlight ring
  const rr=PR*151.8*1.0;x.save();x.globalAlpha=isUp&&pinA_>0?.95:.55;x.strokeStyle=isUp&&pinA_>0?'#7dffb0':'#ffd9a8';x.lineWidth=4;x.shadowColor=x.strokeStyle;x.shadowBlur=14;
  x.beginPath();x.arc(pp[0],pp[1],rr+8,0,7);x.stroke();x.restore();
  // names (overview only)
  const na=fa(t,0,11.8,0,.5);const nd=[pp[0]-O[0],pp[1]-O[1]];const nl=Math.hypot(...nd);
  const px_=Math.max(140,Math.min(850,pp[0]+nd[0]/nl*80)),py_=pp[1]+nd[1]/nl*80+14;label('PHOBOS',px_,py_,na,'#ffd9a8',44);
  label('MARS',O[0],O[1]+16,na*.9,'#fff',44);
  // spin counter beat
  if(t>C0-.3&&t<35.9){const ca=fa(t,C0-.3,35.9,.3,.3);const fr=cl((hrs(t)-hrs(C0))/PM,0,1);
   arrowArc(1.13,pa-S*fr*2*Math.PI,pa,'#ffb38a',ca*(fr>0.01?1:0),6);
   const n=RISES.filter(r=>r>=C0&&r<=Math.min(t,C1)).length;
   cardY(['IN ONE MARS SPIN',['IT RISES: '+n,'#7dffb0']],96,ca,0);}
  // falling beat: exaggerated inward spiral
  const fa2=fa(t,35.6,43.6,.6,.6);
  if(fa2>0){x.save();x.globalAlpha=fa2*.8;x.strokeStyle='#ff9a7a';x.lineWidth=4;x.setLineDash([10,12]);x.lineDashOffset=t*30;x.beginPath();
   const gr=cl((t-35.6)/3,0,1);const n=200;for(let i=0;i<=n*gr;i++){const u=i/n;const a=ph+S*u*2*Math.PI*1.4,r=lerp(A,1.02,u);const q=proj(pos(a,r));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();x.restore();}
  // cards
  const CARDS=[[0,3.4,[['ON MARS, THIS MOON','#fff'],['RISES IN THE WEST','#ffd36b']]],
   [3.4,7.6,['Mars turns once in',['24 h 37 min','#ffb38a']]],
   [7.6,11.8,['Phobos orbits in',['7 h 39 min','#ffd9a8']]],
   [11.8,15.6,['Stand on the equator',['and watch the sky','#7dffb0']]],
   [15.6,20.4,['Phobos rises',['in the WEST','#ffd36b']]],
   [20.4,25.6,['It outruns',["Mars's spin",'#ffb38a']]],
   [25.6,C0-.3,['...and sets',['in the EAST','#ffd36b']]],
   [35.9,39.6,['Tides pull it in:',['1.8 m per century','#ff9a7a']]],
   [39.6,43.6,['Crash or ring in',['~50 million years','#ff9a7a']]],
   [43.6,DUR+.01,[['ON MARS, THIS MOON','#fff'],['RISES IN THE WEST','#ffd36b']]]];
  for(const [a,b,l] of CARDS){if(t>=a&&t<b){const fi=a===0?1:ease((t-a)/.35),fo=b>=DUR?1:ease((b-t)/.3);cardY(l,96,Math.min(fi,fo),(1-fi)*24)}}
  // footnote (bottom-right corner, outside the orbit)
  x.save();x.globalAlpha=.8;x.font='700 26px '+F;x.textAlign='right';x.fillStyle='#d8d2e8';x.shadowColor='#000';x.shadowBlur=8;
  x.fillText('Simulation',912,1396);x.fillText(t>35.6&&t<43.6?'spiral exaggerated':'Phobos enlarged',912,1430);x.restore();
 }
};
window.MODEL={RISES,SETS,C0,C1,PSYN,HZ:HZ*180/Math.PI};
