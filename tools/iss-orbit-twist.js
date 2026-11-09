// Earth's equatorial bulge twists the ISS orbit (nodal precession). Facts:
// Equatorial radius 6378.137 km, polar 6356.752 km -> equatorial DIAMETER ~43 km larger (NASA Earth Fact Sheet).
// The bulge (J2) precesses the orbit's line of nodes westward: for the ISS (~400 km, 51.6 deg) about 5 deg/day,
// a full turn in about 72 days (NASA GDC Orbit Primer formula dOmega/dt = -1.5 n J2 (Re/a)^2 cos i).
// Payoff: when that precession equals the Sun's apparent 0.9856 deg/day, the orbit is Sun-synchronous:
// it crosses the equator at the same local time every day (NASA Earth Observatory, Catalog of Satellite Orbits).
const D=23.0, INC=51.6*Math.PI/180, POLAR=94*Math.PI/180, Ro=1.46;
const FYEXAG=0.80;                                    // exaggerated pole-squash (real flattening is only 0.0034)
// ----- orbit ring geometry: circle tilted by INC about X, then its node rotated about Y (spin axis) by om -----
function ringPt(a,om,inc){let p=[Ro*Math.cos(a),0,Ro*Math.sin(a)];               // circle in equator plane
 let y=p[1]*Math.cos(inc)-p[2]*Math.sin(inc),z=p[1]*Math.sin(inc)+p[2]*Math.cos(inc);p=[p[0],y,z]; // tilt about X
 return [p[0]*Math.cos(om)+p[2]*Math.sin(om),p[1],-p[0]*Math.sin(om)+p[2]*Math.cos(om)];}          // node rotate about Y
function incAt(t){return lerp(INC,POLAR,eio(cl((t-16.4)/2.4)));}                   // payoff: orbit tilts near-polar (Sun-synchronous)
const BOX=[];
function tline(s,px,py,size,alpha,col,align,weight){if(alpha<=0)return;x.save();x.globalAlpha=alpha;x.font=(weight||900)+' '+size+'px '+F;x.textAlign=align||'center';
 x.shadowColor='rgba(0,0,0,.92)';x.shadowBlur=20;x.fillStyle=col||'#fff';x.fillText(s,px,py);x.fillText(s,px,py);x.restore();}
const CARDS=[
 {a:-1,b:3.1,L:[["EARTH ISN'T ROUND",-1],['AND IT TWISTS THE ISS',-1,'#7dffc4']],sz:78},
 {a:3.3,b:7.0,L:[['THE EQUATOR BULGES OUT',3.3],['43 km WIDER THAN POLE-TO-POLE',4.2,'#ffd84a']],sz:66},
 {a:7.2,b:12.0,L:[['THAT BULGE DRAGS THE ORBIT',7.2],['ABOUT 5° EVERY DAY ➡',8.0,'#7dffc4']],sz:66},
 {a:12.2,b:16.2,L:[['A FULL TURN IN ABOUT 72 DAYS',12.2],['SO IT FLIES OVER NEW GROUND',13.2,'#ffd84a']],sz:62,y:480},
 {a:16.4,b:19.4,L:[['SATELLITES USE THIS ON PURPOSE',16.4]],sz:60,y:400},
 {a:19.6,b:D,L:[['SUN-SYNCHRONOUS ORBIT',19.6,'#7dffc4'],['SAME PLACE, SAME TIME, EVERY DAY',20.2]],sz:58},
 {a:D,b:99,L:[["EARTH ISN'T ROUND",D],['AND IT TWISTS THE ISS',D,'#7dffc4']],sz:78}];
function drawCards(t){for(const C of CARDS){const al=C.a<0?(t<C.b?1-ease((t-(C.b-.3))/.3):0):(t>=C.a&&t<C.b?Math.min(ease((t-C.a)/.35),C.b>D?1:ease((C.b-t)/.3)):0);
  if(al<=0)continue;let sz=C.sz;x.font='900 '+sz+'px '+F;let mw=0;C.L.forEach(l=>mw=Math.max(mw,x.measureText(l[0]).width));if(mw>800)sz=Math.floor(sz*800/mw);
  C.L.forEach((l,i)=>{const la=l[1]<=C.a?1:ease((t-l[1])/.3);const dy=-(1-(C.a<0?1:ease((t-C.a)/.35)))*22;tline(l[0],W/2,(C.y||410)+i*sz*1.18+dy,sz,al*la,l[2]||'#fff')});}}
// node angle Omega(t): grows during the twist beat; a clean day counter runs with it
function nodeAng(t){ if(t<6.6)return 0; const u=cl((t-6.6)/9.6); return eio(u)*2*Math.PI; }        // one full turn across the beat
function dayCount(t){ return Math.round(nodeAng(t)/(2*Math.PI)*72); }
// ISS travels fast around the ring
function issAng(t){ return t*3.4; }
// camera: slow push/raise so the pole axis stays vertical and the node rotation reads
function camAt(t){ const u=eio(cl((t-16.2)/3.0)); const el=lerp(0.78,0.62,u); const dist=lerp(3.5,3.7,u);
  const fov=lerp(lerp(0.82,0.78,ease(cl(t/3))),0.95,u);               // zoom out in the payoff so the near-polar ring clears the title
  return {eye:[0,el,dist],tgt:[0,0.02,0],fov};}
SC={D,
 scene(t){const c=camAt(t);const sunom=0.5;return {eye:c.eye,tgt:c.tgt,fov:c.fov,fy:FYEXAG,sun:[Math.cos(sunom),0.28,Math.sin(sunom)],spin:0.35+t*0.12,band:ease(cl((t-3.1)/1.0))*(1-ease(cl((t-16.2)/2)))};},
 overlay(t){BOX.length=0;const c=camAt(t);CAM={m:(function(){const f=SC._look;return f;})(),e:c.eye};
  // rebuild CAM via draw's projection matrix already set; recompute here:
  const norm=v=>{const l=Math.hypot(...v);return v.map(a=>a/l)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const f=norm([c.tgt[0]-c.eye[0],c.tgt[1]-c.eye[1],c.tgt[2]-c.eye[2]]),r=norm(cross(f,[0,1,0])),u=cross(r,f);
  CAM={m:[r[0],r[1],r[2],u[0],u[1],u[2],-f[0],-f[1],-f[2]],e:c.eye,fov:c.fov};
  const om=nodeAng(t);
  // pole axis (spin axis) tick marks: faint
  // starting ghost ring (where the orbit began) to show the twist, fades in during the twist beat
  const ghostA=fa=>{};
  function drawRing(omv,col,wid,al,glow,inc){if(al<=0)return;const N=160;let prev=null,prevHid=null;x.save();x.lineCap='round';
   for(let i=0;i<=N;i++){const a=i/N*2*Math.PI;const P=ringPt(a,omv,inc);const q=proj(P);const hid=hidden(P,FYEXAG);
    if(prev){x.globalAlpha=al*(hid||prevHid?0.26:1);x.strokeStyle=col;x.lineWidth=wid;if(glow){x.shadowColor=col;x.shadowBlur=glow}else x.shadowBlur=0;
     x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(q[0],q[1]);x.stroke();}prev=q;prevHid=hid;}x.restore();}
  const endF=1-ease(cl((t-22.4)/.5));                                     // fade ring+sat out at the end so it loops to the ringless hook
  const inc=incAt(t);
  // ghost of the original plane (the twist beat only)
  const gA=ease(cl((t-7.0)/1.2))*(1-ease(cl((t-16.0)/1.5)));
  if(gA>0&&om>0.15)drawRing(0,'#5a6f8a',4,gA*0.55,0,INC);
  // sun glyph in the payoff: the orbit plane stays square to the Sun
  const sA=ease(cl((t-16.6)/.8))*endF;
  if(sA>0){const sx=140,sy=640;x.save();x.globalAlpha=sA;const sg=x.createRadialGradient(sx,sy,0,sx,sy,60);sg.addColorStop(0,'#fff7d8');sg.addColorStop(.4,'#ffd34a');sg.addColorStop(1,'#ffd34a00');
   x.fillStyle=sg;x.beginPath();x.arc(sx,sy,60,0,7);x.fill();x.fillStyle='#fff3c4';x.beginPath();x.arc(sx,sy,24,0,7);x.fill();x.restore();tline('SUN',sx,sy+96,34,sA,'#ffd84a',null,800);}
  // live orbit ring
  drawRing(om,'#7dffc4',6,ease(cl((t-1.0)/1.0))*endF,12,inc);
  // satellite marker on the ring
  const ia=issAng(t),P=ringPt(ia,om,inc),q=proj(P),ihid=hidden(P,FYEXAG);const satA=ease(cl((t-1.0)/1.0))*endF;
  if(!ihid&&satA>0){x.save();x.globalAlpha=satA;const rad=13;const gg=x.createRadialGradient(q[0],q[1],0,q[0],q[1],rad*2.6);gg.addColorStop(0,'#fff');gg.addColorStop(.3,'#cfefff');gg.addColorStop(1,'#cfefff00');
   x.fillStyle=gg;x.beginPath();x.arc(q[0],q[1],rad*2.6,0,7);x.fill();
   x.translate(q[0],q[1]);x.rotate(Math.atan2(proj(ringPt(ia+.05,om,inc))[1]-q[1],proj(ringPt(ia+.05,om,inc))[0]-q[0]));x.shadowColor='#bfe8ff';x.shadowBlur=14;
   x.fillStyle='#e8edf2';x.fillRect(-20,-2,40,4);for(const sx of [-15,15]){x.fillStyle='#f3d27a';x.fillRect(sx-3,-13,6,10);x.fillRect(sx-3,3,6,10);}x.fillStyle='#f8fafc';x.fillRect(-4,-6,8,12);x.restore();
   tline('ISS',cl(q[0],110,880),q[1]-46,40,ease(cl((t-1.4)/.5))*(1-ease((t-15.8)/1.2)),'#7dffc4');}
  // equator bulge callout (beat 1): arrows out at the equator
  const bA=ease(cl((t-3.6)/.8))*(1-ease(cl((t-6.8)/1.0)));
  if(bA>0){const eL=proj([-1.001/1,0,0]);const eR=proj([1.001,0,0]);x.save();x.globalAlpha=bA;x.strokeStyle='#ffd84a';x.fillStyle='#ffd84a';x.lineWidth=5;x.shadowColor='#000';x.shadowBlur=8;
   for(const [pt,dir] of [[eR,1],[eL,-1]]){x.beginPath();x.moveTo(pt[0],pt[1]);x.lineTo(pt[0]+dir*54,pt[1]);x.stroke();x.beginPath();x.moveTo(pt[0]+dir*54,pt[1]);x.lineTo(pt[0]+dir*34,pt[1]-12);x.lineTo(pt[0]+dir*34,pt[1]+12);x.closePath();x.fill();}
   tline('EQUATOR',W/2,proj([0,0,1.001])[1]-14,34,bA,'#ffd84a',null,800);x.restore();}
  // honest note: the squashed shape is exaggerated (real flattening is only 1/300)
  const xA=(ease(cl((t-3.4)/.8))*(1-ease(cl((t-15.8)/1.2))))*endF;
  if(xA>0)tline('(shape exaggerated — real flattening is tiny)',W/2,1402,32,xA*.9,'#9fb0c4',null,700);
  // day counter during the twist beat
  const dA=ease(cl((t-7.4)/.6))*(1-ease(cl((t-16.2)/1.2)));
  if(dA>0){tline('DAY '+dayCount(t),W/2,378,60,dA,'#ffffff',null,900);}
  // follow line (last ~1.2 s) in the lower safe area, then loop
  const fA=ease(cl((t-21.6)/.4))*(1-ease(cl((t-22.9)/.1)));
  if(fA>0)tline('Follow → new one tomorrow',W/2,1520,44,fA,'#cfe6ff',null,800);
  drawCards(t);
 }};
