// black-hole-fall: first-person fall into a supermassive black hole with TWO live clocks side by side
// (you vs a friend watching from far away). Sprint style A (side-by-side comparison with live counters),
// our own version of the 1M+ "falling into a black hole" topic. Every fact is from ONE NASA page:
// NASA Science, "New NASA Black Hole Visualization Takes Viewers Beyond the Brink" (6 May 2024):
//  - 4.3 million solar masses (like the Milky Way's central black hole)
//  - event horizon spans about 25 million km
//  - in real time the camera takes about 3 hours to fall to the event horizon
//  - to anyone observing from afar it would never quite get there: the image slows and seems to freeze just shy of it
//  - once across the horizon, destruction by spaghettification is 12.8 s away; 128,000 km to the singularity
// Visual: our own GPU ray-traced Schwarzschild black hole (tools/blackhole-anim.html shader), illustrative.
const D=24.0, TCROSS=9.8, TEND=TCROSS+12.8;           // horizon crossing, end of the 12.8 s countdown (22.6)
const F='"DejaVu Sans",Arial,sans-serif';
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t), cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,u)=>a+(b-a)*u;
const eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
// loop: the last second shows the t=0 view again
function tv(t){return t>=TEND+0.4?0:t;}
function camAt(t){const s=tv(t);
 // log-distance schedule: 30 rs -> ~10 rs (5.4 s) -> ~5 rs (7.6 s) -> 2.6 rs at the crossing beat, then 2.0 rs (illustration:
 // a static ray-traced camera cannot go through the horizon, so the inside part is shown with a tidal-stretch effect)
 const u=cl(s/TCROSS);let dist=s<TCROSS?1+Math.exp(3.37-2.5*Math.pow(u,1.6)):lerp(3.4,2.5,cl((s-TCROSS)/12.8));
 const A=(4+34*Math.pow(u,1.4)+14*cl((s-TCROSS)/12.8))*Math.PI/180;     // black hole sits a bit below the view centre
 const fl=lerp(1.15,0.62,Math.pow(u,1.3))-0.04*cl((s-TCROSS)/12.8);      // lens widens as you get close
 const el=(8.5-2.5*u)*Math.PI/180, az=0.35+s*0.16;
 const sw=.08*cl(1-s/12);
 return {dist,el,az,ly:dist*Math.tan(A),fl,swx:sw*Math.sin(s*1.3),swy:sw*Math.sin(s*1.7+2)};}
// ---------- clocks ----------
function hms(h){const s=Math.round(h*3600);const H=Math.floor(s/3600),M=Math.floor(s%3600/60),S=s%60;return H+':'+String(M).padStart(2,'0')+':'+String(S).padStart(2,'0');}
function youHours(t){ if(t<5.4)return t/3600; return lerp(5.4/3600,3,eio((t-5.4)/(TCROSS-5.4-0.4))); }
function friendHours(t){ if(t<7.6)return youHours(t); return youHours(7.6)*Math.exp(1.98*(t-7.6)); }
function fmtFriend(h){ if(h<48)return hms(h); const d=h/24; if(d<730)return Math.round(d).toLocaleString('en-US')+' DAYS';
 const y=d/365.25; return Math.round(y).toLocaleString('en-US')+' YEARS'; }
function tline(s,px,py,size,alpha,col,align,weight){if(alpha<=0)return;x.save();x.globalAlpha=alpha;x.font=(weight||900)+' '+size+'px '+F;x.textAlign=align||'center';
 x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=22;x.fillStyle=col||'#fff';x.fillText(s,px,py);x.fillText(s,px,py);x.restore();}
const CARDS=[
 {a:-1,b:2.6,L:[['FALL INTO A',0],['BLACK HOLE',0,'#ffb347'],['WHO SEES YOU CROSS?',0,'#cfe6ff',58]],sz:108},
 {a:2.6,b:5.4,L:[['4.3 MILLION SUNS',2.6,'#ffb347'],['EDGE: 25 MILLION km WIDE',3.3]],sz:66},
 {a:5.4,b:7.6,L:[['ABOUT 3 HOURS',5.4],['TO THE EDGE',5.4,'#ffb347']],sz:84},
 {a:7.6,b:TCROSS,L:[['YOUR FRIEND SEES YOU',7.6],['SLOW DOWN... AND FREEZE',8.3,'#7fd8ff']],sz:66},
 {a:TCROSS,b:12.6,L:[['YOU CROSS THE EDGE',TCROSS],['NO WAY BACK',10.4,'#ff6a4a']],sz:76},
 {a:12.6,b:15.6,L:[['128,000 km',12.6,'#ffb347'],['TO THE CENTER',12.6]],sz:84},
 {a:15.6,b:18.8,L:[['YOUR FRIEND STILL',15.6],['SEES YOU FROZEN',15.6,'#7fd8ff'],['AT THE EDGE',15.6]],sz:74},
 {a:18.8,b:TEND,L:[['STRETCHED',18.8],['LIKE A NOODLE',19.3,'#ffb347']],sz:88},
 {a:TEND+0.4,b:99,L:[['FALL INTO A',0],['BLACK HOLE',0,'#ffb347'],['WHO SEES YOU CROSS?',0,'#cfe6ff',58]],sz:108}];
function drawCards(t){for(const C of CARDS){let al;
  if(C.a<0)al=t<C.b?1-ease((t-(C.b-.3))/.3):0;
  else if(C.b>D)al=t>=C.a?ease((t-C.a)/.35):0;
  else al=(t>=C.a&&t<C.b)?Math.min(ease((t-C.a)/.35),ease((C.b-t)/.3)):0;
  if(al<=0)continue;let sz=C.sz;x.font='900 '+sz+'px '+F;let mw=0;C.L.forEach(l=>{if(!l[3])mw=Math.max(mw,x.measureText(l[0]).width)});if(mw>800)sz=Math.floor(sz*800/mw);
  let y=430;const dy=-(1-((C.a<0||C.b>D)?1:ease((t-C.a)/.35)))*22;
  C.L.forEach((l,i)=>{const s2=l[3]||sz;const la=l[1]<=C.a||C.b>D||C.a<0?1:ease((t-l[1])/.3);tline(l[0],495,y+dy,s2,al*la,l[2]||'#fff');y+=s2*1.18;});}}
// ---------- small astronaut glyph ----------
function astro(px,py,s,rot,tint,al){x.save();x.globalAlpha=al;x.translate(px,py);x.rotate(rot);x.scale(s,s);
 x.fillStyle=tint;x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=2;
 x.beginPath();x.roundRect(-11,-6,22,30,8);x.fill();                 // torso
 x.beginPath();x.arc(0,-16,12,0,7);x.fill();                          // helmet
 x.fillStyle='rgba(40,60,90,.9)';x.beginPath();x.ellipse(2,-16,7,5.5,0,0,7);x.fill();
 x.fillStyle=tint;x.lineCap='round';x.strokeStyle=tint;x.lineWidth=7;
 x.beginPath();x.moveTo(-10,0);x.lineTo(-22,12);x.moveTo(10,0);x.lineTo(22,-8);x.moveTo(-6,22);x.lineTo(-10,40);x.moveTo(6,22);x.lineTo(13,38);x.stroke();
 x.restore();}
function panel(x0,y0,w,h,al,border){x.save();x.globalAlpha=al;x.fillStyle='rgba(6,8,16,.72)';x.strokeStyle=border;x.lineWidth=3;x.beginPath();x.roundRect(x0,y0,w,h,26);x.fill();x.stroke();x.restore();}
function clocks(t){
 const fa=ease(cl((t-0.0)/0.01))*(t>=TEND+0.4?ease(cl((t-(TEND+0.4))/.3)):1)*(t>TEND&&t<TEND+0.4?1-ease((t-TEND)/.3):1);
 if(fa<=0)return;const Y=1100,PH=330;
 // YOU (left)
 panel(66,Y,420,PH,fa,'rgba(255,179,71,.85)');
 tline('YOU',276,Y+60,42,fa,'#ffb347',null,900);
 const inside=t>=TCROSS&&t<TEND+0.4;
 if(!inside){tline(hms(t>=TEND+0.4?0:youHours(t)),276,Y+170,70,fa,'#fff',null,800);
   const ff=t>=5.4&&t<TCROSS-.2;tline(ff?'▶▶ FAST-FORWARD':'your clock',276,Y+240,30,fa*(ff?1:.8),ff?'#ffd27a':'#b9c4d6',null,800);}
 else{const left=Math.max(0,12.8-(t-TCROSS));tline(left.toFixed(1)+' s',276,Y+170,84,fa,left<4?'#ff6a4a':'#fff',null,900);
   tline('LEFT',276,Y+240,34,fa,'#ff9a7a',null,900);}
 // FRIEND (right)
 panel(506,Y,420,PH,fa,'rgba(127,216,255,.85)');
 tline('YOUR FRIEND',716,Y+52,36,fa,'#7fd8ff',null,900);tline('(far away)',716,Y+90,26,fa*.85,'#b9c4d6',null,700);
 const fh=t>=TEND+0.4?0:friendHours(t);const forever=t>=18.8&&t<TEND+0.4;
 tline(forever?'FOREVER':fmtFriend(fh),716,Y+180,forever?66:fmtFriend(fh).length>11?44:fmtFriend(fh).length>9?54:66,fa,forever?'#7fd8ff':'#fff',null,800);
 // friend's view of you: approaches the edge, then slows and freezes just shy of it
 const fr=t>=TEND+0.4?0:t;const ex=830,ey=Y+262;
 x.save();x.globalAlpha=fa;x.beginPath();x.roundRect(560,Y+214,312,96,16);x.clip();x.fillStyle='#04050a';x.fillRect(560,Y+214,312,96);
 x.fillStyle='#000';x.strokeStyle='rgba(255,170,80,.9)';x.lineWidth=3;x.shadowColor='#ff9a40';x.shadowBlur=10;x.beginPath();x.arc(ex+130,ey,150,0,7);x.fill();x.stroke();x.restore();
 const prog=fr<7.6?fr/7.6*0.75:0.75+0.25*(1-Math.exp(-(fr-7.6)*1.2));      // never quite reaches the edge
 const ax=lerp(600,ex-36,prog);const fade=fr<7.6?1:lerp(1,.45,1-Math.exp(-(fr-7.6)*.6));
 x.save();x.beginPath();x.roundRect(560,Y+214,312,96,16);x.clip();
 astro(ax,ey+2,0.8,0.5+(fr<7.6?fr*0.25:1.9+0.6*(1-Math.exp(-(fr-7.6)*1.2))),fr<7.6?'#eef3f8':'#f0b09a',fa*fade);x.restore();
}
SC={D,TCROSS,TEND,camAt,
 post(t){ // tidal stretch after crossing (illustration)
   if(t<TCROSS||t>=TEND+0.4)return {sy:1,sx:1,dark:0};
   const u=cl((t-TCROSS)/12.8);const st=Math.pow(cl((t-17.5)/(TEND-17.5)),2);
   return {sy:1+st*2.6,sx:1-st*0.55,dark:.12*u+.25*st};},
 overlay(t){
   // honest label
   const fA=ease(cl((t-(TEND+0.5))/.3));
   x.save();x.globalAlpha=.8*(1-fA);x.font='600 26px '+F;x.textAlign='center';x.fillStyle='#d8d2e8';x.shadowColor='#000';x.shadowBlur=10;
   x.fillText('Illustrative simulation (a Milky Way-type black hole)',495,1080-24);x.restore();
   clocks(t);drawCards(t);
   if(fA>0)tline('Follow → new one tomorrow',495,1062,40,fA*.95,'#cfe6ff',null,800);
 }};
