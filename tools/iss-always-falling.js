// The ISS is always falling: Newton's cannon at ISS height (400 km), trajectories integrated with inverse-square gravity
// (GM = 398,600.4418 km^3/s^2, R = 6,371 km; Earth's rotation and air drag left out), then the circular orbit = the ISS.
// Sources: NASA "What is Microgravity?" (Newton's cannon, 88.8% gravity at ~250 mi, 28,000 km/h), NASA NTRS 20130011559
// (ISS altitude 400 km), NASA "Why do research on the ISS" (orbits every 90 minutes).
const GM=398600.4418,RE=6371,H0=400,R0=(RE+H0)/RE;          // R0 in Earth radii
const DUR=49;
// ---------- physics: RK4 trajectories, sampled every simulated second ----------
function integ(v){let x=0,y=R0*RE,vx=v,vy=0;const P=[[x/RE,y/RE]];const dt=.25;
 const a=(x,y)=>{const r=Math.hypot(x,y),k=-GM/(r*r*r);return [k*x,k*y]};
 for(let i=0;i<4*6000;i++){
  const v1=a(x,y),p1=[vx,vy];
  const p2=[vx+v1[0]*dt/2,vy+v1[1]*dt/2],v2=a(x+p1[0]*dt/2,y+p1[1]*dt/2);
  const p3=[vx+v2[0]*dt/2,vy+v2[1]*dt/2],v3=a(x+p2[0]*dt/2,y+p2[1]*dt/2);
  const p4=[vx+v3[0]*dt,vy+v3[1]*dt],v4=a(x+p3[0]*dt,y+p3[1]*dt);
  x+=dt/6*(p1[0]+2*p2[0]+2*p3[0]+p4[0]);y+=dt/6*(p1[1]+2*p2[1]+2*p3[1]+p4[1]);
  vx+=dt/6*(v1[0]+2*v2[0]+2*v3[0]+v4[0]);vy+=dt/6*(v1[1]+2*v2[1]+2*v3[1]+v4[1]);
  const r=Math.hypot(x,y);if(r<=RE){P.push([x/r,y/r]);break;}
  if(i%4==3)P.push([x/RE,y/RE]);}
 const e=P[P.length-1];let ang=Math.atan2(e[0],e[1]);if(ang<0)ang+=2*Math.PI;
 return {P,T:P.length-1,ang,km:RE*ang};}
const VC=Math.sqrt(GM/(RE+H0));                              // 7.6726 km/s circular speed at 400 km
const SHOTS=[{v:3,t0:5.8,d:2.4,col:'#ff8a3d'},{v:6,t0:10.0,d:2.8,col:'#ffb23d'},{v:7,t0:14.4,d:3.2,col:'#ffd84a'},{v:7.5,t0:19.4,d:4.2,col:'#d8f05a'}];
SHOTS.forEach(s=>{const r=integ(s.v);Object.assign(s,r);s.t1=s.t0+s.d;s.txt=Math.round(s.km/10)*10;});
const fmt=n=>n.toLocaleString('en-US');
// shot 5: circular orbit, angle from the top, clockwise; angular rate keyframed (screen time only):
// steady start, faster lap, back over the cannon at TRET, then the ISS crawls past the top for the tangent beat, then cruises
const T5=24.6,TRET0=34.0,TSLOW=42.2;let WP=1,WF=.9;
const wk=()=>[[T5,.45],[27.6,.45],[29.6,WP],[32.4,WP],[TRET0,.16],[TSLOW,.16],[44.2,WF],[DUR,WF]];
let THT=null;const NS=600;
function build(){const K=wk();THT=[0];let a=0;for(let i=1;i<=(DUR-T5)*NS;i++){const t=T5+(i-.5)/NS;let j=0;while(j<K.length-2&&t>K[j+1][0])j++;
 const w=lerp(K[j][1],K[j+1][1],cl((t-K[j][0])/(K[j+1][0]-K[j][0])));a+=w/NS;THT.push(a);}}
function th5raw(t){if(t<=T5)return 0;const f=Math.min((t-T5)*NS,THT.length-1.0001),i=Math.floor(f);return lerp(THT[i],THT[i+1],f-i)}
(function(){ // WP: back over the cannon exactly at TRET0; WF: at t=DUR the ISS sits at 300 deg (+2 laps) so the hook continues from there
 let lo=.5,hi=2;for(let k=0;k<50;k++){WP=(lo+hi)/2;build();if(th5raw(TRET0)>2*Math.PI)hi=WP;else lo=WP;}
 lo=.4;hi=1.6;const tgt=2*Math.PI*(1+300/360);for(let k=0;k<50;k++){WF=(lo+hi)/2;build();if(th5raw(DUR)>tgt)hi=WF;else lo=WF;}})();
const TRET=TRET0;
const TPASS=(function(){let t=T5;while(th5raw(t)<SHOTS[3].ang)t+=1/600;return t})();// passes where the 7.5 km/s ball landed
const PHI=40*Math.PI/180;const TARR=(function(){let t=TRET;while(th5raw(t)<2*Math.PI+PHI)t+=1/600;return t})(); // ISS under the fall arrow
const issTh=t=>t>=T5?th5raw(t):th5raw(DUR)+WF*t;               // hook (t < T5) continues the end of the loop
window.MODEL={VC,WP,WF,TRET,TPASS,TARR,shots:SHOTS.map(s=>({v:s.v,min:(s.T/60).toFixed(1),km:Math.round(s.km),txt:s.txt,t1:s.t1})),g:GM/(RE+H0)**2*1000,lapMin:2*Math.PI*(RE+H0)/VC/60};
// ---------- camera: Earth radius in px + launch point on screen ----------
const KF=[ // [t, Rpx, launch x, launch y]
 [0,400,495,575],[3.0,400,495,575],[5.0,1800,340,840],[8.9,1800,340,840],[9.9,1000,330,800],[13.4,1000,330,800],[14.2,620,380,700],[18.2,620,380,700],[19.2,400,495,575],[33.8,400,495,575],[35.4,540,330,640],[42.2,540,330,640],[43.8,400,495,575],[DUR,400,495,575]];
function camAt(t){let i=0;while(i<KF.length-2&&t>KF[i+1][0])i++;const a=KF[i],b=KF[i+1];const u=eio((t-a[0])/(b[0]-a[0]));
 const R=Math.exp(lerp(Math.log(a[1]),Math.log(b[1]),u));const lx=lerp(a[2],b[2],u),ly=lerp(a[3],b[3],u);return {R,cx:lx,cy:ly+R*R0}}
let CM2={R:400,cx:495,cy:1000};
const w2s=p=>[CM2.cx+CM2.R*p[0],CM2.cy-CM2.R*p[1]];
const pol=(th,r)=>[r*Math.sin(th),r*Math.cos(th)];
const fa=(t,a,b,fi=.35,fo=.35)=>t<a?0:t<a+fi?ease((t-a)/fi):t<b-fo?1:t<b?1-ease((t-(b-fo))/fo):0;
// ---------- text ----------
const BOX=[];                                                   // text boxes of this frame (collision test)
function tline(s,px,py,size,alpha,col,align,weight){if(alpha<=0)return;x.save();x.globalAlpha=alpha;x.font=(weight||900)+' '+size+'px '+F;x.textAlign=align||'center';
 const w=x.measureText(s).width;x.shadowColor='rgba(0,0,0,.92)';x.shadowBlur=20;x.fillStyle=col||'#fff';x.fillText(s,px,py);x.fillText(s,px,py);x.restore();
 const l=align==='left'?px:align==='right'?px-w:px-w/2;if(alpha>.05)BOX.push({s,l,r:l+w,t:py-size*.78,b:py+size*.22});}
// card: lines [[text, t_in, color]] shown from t_in; whole card [a,b]
const CARDS=[
 {a:-1,b:3.0,L:[['THE ISS IS FALLING',-1],['RIGHT NOW',-1,'#7dffc4']],sz:76},
 {a:3.2,b:5.6,L:[["SO WHY DOESN'T IT",3.2],['HIT THE GROUND?',3.2]],sz:76},
 ...SHOTS.map((s,i)=>({a:s.t0,b:i<3?[9.6,14.0,18.6,0][i]:24.3,L:[[s.v+' km/s',s.t0,s.col],['LANDS '+fmt(s.txt)+' km AWAY',s.t1]],sz:i==0?86:80})),
 {a:T5,b:31.4,L:[[(Math.round(VC*10)/10)+' km/s',T5,'#7dffc4'],['IT KEEPS MISSING EARTH',TPASS]],sz:80},
 {a:31.6,b:35.4,L:[["THAT'S AN ORBIT.",31.6],["THAT'S THE ISS.",TRET,'#7dffc4']],sz:76},
 {a:35.6,b:38.8,L:[['EACH SECOND IT FALLS 4.3 m',35.6]],sz:64,y:400},
 {a:39.0,b:42.2,L:[['AND EARTH CURVES AWAY',39.0],['JUST AS MUCH',39.0,'#7dffc4']],sz:64,y:395},
 {a:42.4,b:45.4,L:[['GRAVITY UP THERE IS',42.4],['STILL 89% AS STRONG',42.4,'#ffd84a']],sz:72},
 {a:45.6,b:48.3,L:[['ASTRONAUTS FLOAT',45.6],['BECAUSE THEY FALL TOO',45.6,'#7dffc4']],sz:72},
 {a:48.3,b:99,L:[['THE ISS IS FALLING',48.3],['RIGHT NOW',48.3,'#7dffc4']],sz:76}];
function drawCards(t){for(const C of CARDS){const al=C.a<0?(t<C.b?1-ease((t-(C.b-.3))/.3):0):(t>=C.a&&t<C.b?Math.min(ease((t-C.a)/.35),C.b>DUR?1:ease((C.b-t)/.3)):0);
  if(al<=0)continue;let sz=C.sz;x.font='900 '+sz+'px '+F;let mw=0;C.L.forEach(l=>mw=Math.max(mw,x.measureText(l[0]).width));if(mw>760)sz=Math.floor(sz*760/mw);
  C.L.forEach((l,i)=>{const la=l[1]<=C.a?1:ease((t-l[1])/.3);const dy=-(1-(C.a<0?1:ease((t-C.a)/.35)))*22;tline(l[0],W/2,(C.y||430)+i*sz*1.16+dy,sz,al*la,l[2]||'#fff')});}}
// ---------- drawing helpers ----------
function pathW(pts,col,w,al,glow){if(al<=0||pts.length<2)return;x.save();x.globalAlpha=al;x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';
 if(glow){x.shadowColor=col;x.shadowBlur=glow;}x.beginPath();pts.forEach((p,i)=>{const q=w2s(p);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.stroke();x.restore();}
function ball(p,col,rad,al){if(al<=0)return;const q=w2s(p);x.save();x.globalAlpha=al;const g=x.createRadialGradient(q[0],q[1],0,q[0],q[1],rad*3.2);
 g.addColorStop(0,col);g.addColorStop(.3,col+'88');g.addColorStop(1,col+'00');x.fillStyle=g;x.beginPath();x.arc(q[0],q[1],rad*3.2,0,7);x.fill();
 const g2=x.createRadialGradient(q[0]-rad*.35,q[1]-rad*.35,0,q[0],q[1],rad);g2.addColorStop(0,'#fff');g2.addColorStop(.5,col);g2.addColorStop(1,'#552200');
 x.fillStyle=g2;x.beginPath();x.arc(q[0],q[1],rad,0,7);x.fill();x.restore();}
function mountain(al){if(al<=0)return;const hw=.026;x.save();x.globalAlpha=al;const P=[];
 for(let i=0;i<=24;i++){const a=-hw+2*hw*i/24;P.push(pol(a,1-.004))}
 const top=pol(0,R0);const L=w2s(pol(-hw,1)),Rr=w2s(pol(hw,1)),T=w2s(top);
 const g=x.createLinearGradient(T[0],T[1],T[0],L[1]+10);g.addColorStop(0,'#cfc7bd');g.addColorStop(.18,'#8f8274');g.addColorStop(1,'#3e352d');x.fillStyle=g;
 x.beginPath();const pk=[[-hw,1],[-hw*.55,1.018],[-hw*.3,1.04],[-hw*.06,R0],[hw*.06,R0],[hw*.32,1.038],[hw*.6,1.016],[hw,1]];
 pk.forEach((p,i)=>{const q=w2s(pol(p[0],p[1]));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});for(let i=24;i>=0;i--){const q=w2s(P[i]);x.lineTo(q[0],q[1])}x.closePath();x.fill();
 // snow cap highlight
 x.fillStyle='rgba(255,255,255,.55)';x.beginPath();[[-hw*.3,1.04],[-hw*.06,R0],[hw*.06,R0],[hw*.32,1.038],[hw*.12,1.05],[-hw*.1,1.048]].forEach((p,i)=>{const q=w2s(pol(p[0],p[1]));i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.closePath();x.fill();
 // cannon on the summit, barrel pointing along +x (tangent)
 const s=cl(CM2.R/1800*1,.42,1);x.translate(T[0],T[1]);x.scale(s,s);
 x.fillStyle='#222';x.strokeStyle='#999';x.lineWidth=2;x.beginPath();x.arc(-6,-9,9,0,7);x.fill();x.stroke();
 const gb=x.createLinearGradient(0,-26,0,-6);gb.addColorStop(0,'#7a7f88');gb.addColorStop(.5,'#2c3038');gb.addColorStop(1,'#15171b');x.fillStyle=gb;
 x.beginPath();x.moveTo(-22,-24);x.lineTo(30,-20);x.lineTo(30,-8);x.lineTo(-22,-6);x.closePath();x.fill();x.fillStyle='#111';x.fillRect(28,-21,5,14);x.restore();}
function puff(p,col,u){if(u<=0||u>=1)return;const q=w2s(p);x.save();x.globalAlpha=(1-u)*.85;x.strokeStyle=col;x.lineWidth=5*(1-u)+1;x.shadowColor=col;x.shadowBlur=16;
 x.beginPath();x.arc(q[0],q[1],8+46*Math.sqrt(u),0,7);x.stroke();x.restore();}
function iss(th,al,lab,rate){if(al<=0)return;const p=pol(th,R0),q=w2s(p);
 const tl=cl(rate*.55,0,.6)*400/CM2.R;if(tl>.005){x.save();x.lineCap='round';for(let k=0;k<16;k++){const a0=w2s(pol(th-tl*k/16,R0)),a1=w2s(pol(th-tl*(k+1)/16,R0));x.globalAlpha=al*(1-k/16)*.75;x.strokeStyle='#cfefff';x.lineWidth=9*(1-k/16)+2;x.beginPath();x.moveTo(a0[0],a0[1]);x.lineTo(a1[0],a1[1]);x.stroke();}x.restore();}
 x.save();x.globalAlpha=al;x.translate(q[0],q[1]);x.rotate(th);x.scale(1.35,1.35);
 x.shadowColor='#bfe8ff';x.shadowBlur=14;x.fillStyle='#e8edf2';x.fillRect(-26,-2,52,4);              // truss (tangent)
 for(const sx of [-21,-12,12,21]){const g=x.createLinearGradient(sx-3,0,sx+3,0);g.addColorStop(0,'#c99a2e');g.addColorStop(1,'#f3d27a');x.fillStyle=g;x.fillRect(sx-3,-17,6,13);x.fillRect(sx-3,4,6,13);}
 x.fillStyle='#f4f6f8';x.fillRect(-4,-7,8,14);x.fillRect(-11,-3,22,6);x.restore();
 if(lab>0){x.font='900 44px '+F;const hw=x.measureText('ISS').width/2;const off=60+hw*Math.abs(Math.sin(th))+22*Math.abs(Math.cos(th));const lp=w2s(pol(th,R0-off/CM2.R));tline('ISS',lp[0],lp[1]+15,44,al*lab,'#7dffc4');}}
// ---------- scene ----------
SC={D:DUR,cards:[],
 scene(t){CM2=camAt(t);const D=40;const ex=(W/2-CM2.cx)/CM2.R,ey=(CM2.cy-H/2)/CM2.R;
  return {eye:[ex,ey,D],tgt:[ex,ey,0],fov:W/(CM2.R*D),sun:[-.42,.36,.83],p:{c:[0,0,0],r:1,ty:0,tilt:23.4,yaw:0,spin:window.SPIN??2.2},ring:{n:[0,1,0],a:0},axis:0,expo:1.08};},
 overlay(t){BOX.length=0;
  const trailA=1-ease((t-32.5)/2.0);
  // ISS orbit line (from shot 5 on, and in the hook)
  const th=issTh(t);
  if(t<T5){const al=1-ease((t-3.0)/.6);if(al>0){const pts=[];for(let i=0;i<=360;i++)pts.push(pol(i/360*2*Math.PI,R0));pathW(pts,'#7dffc4',3,al*.55,10);}}
  else{const full=Math.min(th,2*Math.PI);const pts=[];for(let i=0;i<=Math.ceil(full/.01);i++)pts.push(pol(Math.min(i*.01,full),R0));pathW(pts,'#7dffc4',th<2*Math.PI?5:3,th<2*Math.PI?.95:.55,12);}
  // tangent line: straight path without gravity, from the top of the orbit
  const ta=fa(t,34.6,42.2,.5,.5);
  if(ta>0){const xa=R0*Math.sin(PHI),xe=xa*1.22;const A0=w2s([0,R0]),E=w2s([xe,R0]);const len=(E[0]-A0[0])*ease((t-34.6)/.8);
   x.save();x.globalAlpha=ta;x.strokeStyle='#fff';x.lineWidth=4;x.setLineDash([16,12]);x.beginPath();x.moveTo(A0[0],A0[1]);x.lineTo(A0[0]+len,A0[1]);x.stroke();x.setLineDash([]);
   const T0=w2s([xa,R0]),B0=w2s([xa,R0*Math.cos(PHI)]);const fu=ease((t-36.2)/.6);
   if(fu>0){const ax=T0[0],y0=T0[1],yo=B0[1];x.globalAlpha=ta*fu;x.strokeStyle='#ffb23d';x.fillStyle='#ffb23d';x.lineWidth=6;x.beginPath();x.moveTo(ax,y0+8);x.lineTo(ax,yo-58);x.stroke();
    x.beginPath();x.moveTo(ax,yo-44);x.lineTo(ax-13,yo-66);x.lineTo(ax+13,yo-66);x.closePath();x.fill();}x.restore();
   tline('WITHOUT GRAVITY',E[0],E[1]-22,44,ta*ease((t-36.3)/.5),'#ffffff','right',800);}
  // cannon shots
  const mA=fa(t,4.0,33.4,.8,1.0);
  for(const s of SHOTS){if(t<s.t0)continue;const u=cl((t-s.t0)/s.d);const n=Math.max(1,Math.round(u*s.T));const pts=s.P.slice(0,n+1);
   const fly=t<s.t1;pathW(pts,s.col,fly?5:3.5,(fly?.95:.6)*trailA,fly?12:0);
   const rad=cl(CM2.R/1800*13,6,13);if(fly){const f=u*s.T,i=Math.min(Math.floor(f),s.T-1),k=f-i;const p=[lerp(s.P[i][0],s.P[i+1][0],k),lerp(s.P[i][1],s.P[i+1][1],k)];ball(p,s.col,rad,1);}
   else puff(s.P[s.T],s.col,(t-s.t1)/.8);}
  if(t>=T5&&t<TRET+.5){const al=t<TRET?1:1-ease((t-TRET)/.5);ball(pol(th,R0),'#7dffc4',cl(CM2.R/1800*13,6,13)*(t<TRET?1:1),al);}
  mountain(mA);
  // muzzle flash (soft)
  for(const s of [...SHOTS.map(s=>s.t0),T5]){const u=(t-s)/.35;if(u>0&&u<1){const q=w2s(pol(0,R0));const sc=cl(CM2.R/1800,.42,1);x.save();x.globalAlpha=(1-u)*.8;
   const g=x.createRadialGradient(q[0]+34*sc,q[1]-14*sc,0,q[0]+34*sc,q[1]-14*sc,40*sc);g.addColorStop(0,'#fff6d8');g.addColorStop(1,'rgba(255,190,90,0)');x.fillStyle=g;x.beginPath();x.arc(q[0]+34*sc,q[1]-14*sc,40*sc,0,7);x.fill();x.restore();}}
  // mountain label (zoomed views only)
  const lA=fa(t,4.6,17.5,.4,.5);if(lA>0){const q=w2s(pol(0,R0));tline("NEWTON'S CANNON",q[0],q[1]-92,44,lA,'#ffffff','center',800);tline('400 km UP',q[0],q[1]-42,44,lA,'#ffd84a','center',800);}
  // ISS: hook and after the morph
  const iA=t<T5?1-ease((t-3.0)/.5):ease((t-TRET+.2)/.5);const lab=t<T5?1-ease((t-2.6)/.4):fa(t,TRET,TRET+2.4,.4,.5)+ease((t-48.0)/.5);
  iss(th,iA,lab,(issTh(t)-issTh(t-.05))/.05);
  drawCards(t);
 }};
