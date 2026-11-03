// barycenter: Pluto and Charon circle a point in empty space; Earth wobbles around a point inside it; Jupiter pulls the Sun's point outside the Sun.
// Sources: JPL SSD planetary satellite physical parameters (GM Pluto 869.3, Charon 106.1, Earth 398600.436, Moon 4902.800, Jupiter 126686531.9 km3/s2;
//   Charon R 606.0 km, Moon R 1737.4 km); NASA Charon page (Pluto-Charon distance 19,640 km, orbit 6.4 days); NASA Space Place 'What is a barycenter?'
//   (Earth-Moon point inside Earth; Sun-Jupiter point just outside the Sun's surface; star wobble reveals exoplanets);
//   NASA fact sheets (Pluto R 1188.3 km, Earth R 6371 km, Moon a = 384,400 km, sidereal month 27.3217 d, Sun R 695,700 km, GM Sun 132,712,440,041,
//   Jupiter a = 778.57e6 km, period 11.86 yr).
const D=42.0;
const CX=540,CY=1000;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const eout=t=>{t=cl(t);return 1-Math.pow(1-t,3)};
const GM={pluto:869.3,charon:106.1,earth:398600.436,moon:4902.8,sun:132712440041.9,jup:126686531.9};
const ACTS=[
 {name:'A',t0:0,t1:14.4,H:{ty:0,R:1188.3,name:'PLUTO'},L:{ty:1,R:606.0,name:'CHARON'},d:19640,q:GM.charon/(GM.pluto+GM.charon),per:6.0,days:6.387,unit:'days',phi0:-0.62,inc:35,
  zoom:[[4.6,7.4]],sClose:150/1188.3,sWide:0},
 {name:'B',t0:14.4,t1:27.6,H:{ty:2,R:6371,name:'EARTH'},L:{ty:3,R:1737.4,name:'MOON'},d:384400,q:GM.moon/(GM.earth+GM.moon),per:7.0,days:27.32,unit:'days',phi0:0.35,inc:40,
  zoom:[[17.0,18.8]],sClose:230/6371,sWide:0,zoomIn:true},
 {name:'C',t0:27.6,t1:D,H:{ty:4,R:695700,name:'SUN'},L:{ty:-1,R:69911,name:'JUPITER'},d:778.57e6,q:GM.jup/(GM.sun+GM.jup),per:9.0,days:11.86,unit:'years',phi0:Math.PI/2-2*Math.PI*(33.65-27.6)/9.0,inc:0,
  zoom:[],sClose:170/695700,sWide:0}];
for(const a of ACTS){a.rH=a.d*a.q;a.rL=a.d*(1-a.q);a.sWide=360/a.rL;a.CI=Math.cos(a.inc*Math.PI/180);a.SI=Math.sin(a.inc*Math.PI/180);}
const RW=400;  // wide view: partner orbit radius on screen (px)
function act(t){for(const a of ACTS)if(t<a.t1)return a;return ACTS[2]}
// zoom amount k: 1 = close, 0 = wide
function kz(a,t){if(a.name==='A'){return t<10.2?1-eio((t-a.zoom[0][0])/(a.zoom[0][1]-a.zoom[0][0])):eio((t-10.2)/1.4)}
 if(a.name==='B'){return eio((t-a.zoom[0][0])/(a.zoom[0][1]-a.zoom[0][0]))}return 1}
function kC(t){return t<35.4?eio((t-31.2)/1.0):1-eio((t-35.4)/1.0)}
function scl(a,t){if(a.name==='C')return a.sClose*Math.exp(Math.log(2.4)*kC(t));const k=kz(a,t);return Math.exp(Math.log(a.sWide)+(Math.log(a.sClose)-Math.log(a.sWide))*k)}
function phi(a,t){return a.phi0+2*Math.PI*(t-a.t0)/a.per}
const P2S=(X,Y,s,a)=>({x:CX+X*s,y:CY-Y*s*a.CI,z:-Y*s*a.SI});
function layout(t){const a=act(t),s=scl(a,t),f=phi(a,t),ux=Math.cos(f),uy=Math.sin(f);
 const h=P2S(-ux*a.rH,-uy*a.rH,s,a),l=P2S(ux*a.rL,uy*a.rL,s,a);
 // screen direction toward the partner
 const dx=l.x-h.x,dy=l.y-h.y,dl=Math.hypot(dx,dy);
 return {a,s,f,k:kz(a,t),H:{...h,r:a.H.R*s,ty:a.H.ty},L:{...l,r:a.L.R*s,ty:a.L.ty},u:[dx/dl,dy/dl]}}
const SUNV=(()=>{const v=[-.38,.36,.85];const l=Math.hypot(...v);return v.map(a=>a/l)})();
gl.uniform3fv(U('SUN'),SUNV);gl.uniform2f(U('R'),W,H);gl.uniform2f(U('CEN'),CX,CY);
const EARTHSPIN=2.2;
function shade(t){const Lt=layout(t),a=Lt.a;gl.viewport(0,0,W,H);gl.uniform1f(U('T'),t);gl.uniform3f(U('NRM'),0,a.SI,a.CI);gl.uniform1f(U('CI'),a.CI);gl.uniform1f(U('SI'),a.SI);
 const B=[Lt.H,Lt.L];const sp=new Float32Array(8),ty=new Float32Array(2),spin=new Float32Array(2),al=new Float32Array(2);
 B.forEach((b,i)=>{sp.set([b.x,b.y,b.z,b.ty<0?0:b.r],4*i);ty[i]=b.ty;al[i]=b.ty<0?0:1;
  spin[i]=b.ty<=1?-Lt.f+(i===1?Math.PI:0):b.ty===2?EARTHSPIN:b.ty===3?-Lt.f+Math.PI:0});
 gl.uniform4fv(U('SP'),sp);gl.uniform1fv(U('TY'),ty);gl.uniform1fv(U('SPIN'),spin);gl.uniform1fv(U('AL'),al);
 const oa=orbA(t);gl.uniform4f(U('ORB'),a.rH*Lt.s,a.rL*Lt.s,oa[0],oa[1]);
 gl.drawArrays(gl.TRIANGLES,0,3);}
function orbA(t){const a=act(t);const fi=a.t0===0?1:ease((t-a.t0)/.4);
 if(a.name==='A')return [fi*.6,ease((t-5.4)/1.2)*.45];
 if(a.name==='B')return [fi*.6*ease((t-17.9)/.9),fi*.45];
 return [fi*.6*(1-kC(t)),0]}
function speed(t){const A=layout(t),B=layout(t+1/30);if(A.a!==B.a)return 0;
 const m=(p,q)=>Math.abs(p.x-q.x)+Math.abs(p.y-q.y)+Math.abs(p.r-q.r);
 let v=m(A.H,B.H);if(A.L.ty>=0&&A.L.x>-200&&A.L.x<W+200&&A.L.y>-200&&A.L.y<H+200)v=Math.max(v,m(A.L,B.L));return v}
// brief dip at the act cuts (never at the first or last frame)
function dip(t){let k=1;for(const tc of [ACTS[0].t1,ACTS[1].t1])k=Math.min(k,cl(Math.abs(t-tc)/.14));return .15+.85*k}
function scene(t){const a=act(t);const n=Math.max(1,Math.min(16,Math.ceil(Math.max(speed(t),speed(t-1/30))/2.5)));
 for(let i=0;i<n;i++){let ts=t+(i-(n-1)/2)/(30*n);if(act(ts)!==a)ts=Math.min(Math.max(ts,a.t0),a.t1-1e-4);shade(ts);x.globalAlpha=1/(i+1);x.drawImage(g,0,0)}x.globalAlpha=1;
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(36px)';x.globalAlpha=.20;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
// ---------- overlay ----------
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight,kind){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=14;x.fillText(s,px,py);x.shadowBlur=4;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04,a:alpha,kind:kind||''});}
const CW=850;
function fitSize(lines,size,weight,maxw){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>(maxw||CW)?Math.floor(size*(maxw||CW)/mw):size}
function card(lines,t,a,b,size){const fi=a<=0?1:ease((t-a)/.35),fo=b>=D?1:ease((b-t)/.3),al=Math.min(fi,fo);if(t<a||t>=b||al<=0)return;
 const main=fitSize(lines.map(l=>l[0]),size);let y=342+(1-fi)*24;
 for(const l of lines){txt(l[0],495,y+main*.74,main,'center',l[1]||'#fff',al,900,'card');y+=main*1.18}}
const Y='#ffd98a',BL='#9fd0ff';
const CARDS=[
 [0,4.5,[['PLUTO IS CIRCLING'],['EMPTY SPACE',Y]],84],
 [4.6,6.2,[['SO WHAT IS IT'],['CIRCLING?',Y]],86],
 [6.3,10.2,[['PLUTO AND CHARON'],['BOTH CIRCLE THEIR'],['BALANCE POINT',Y]],80],
 [10.3,14.25,[['CHARON IS SO HEAVY'],['THE POINT IS'],['OUTSIDE PLUTO',Y]],80],
 [14.5,18.6,[['EARTH AND THE MOON'],['DO IT TOO',Y]],82],
 [18.7,22.9,[['THEIR BALANCE POINT'],['IS INSIDE EARTH',Y]],80],
 [23.0,27.45,[['SO EARTH WOBBLES'],['ONCE A MONTH',Y]],82],
 [27.7,31.6,[['EVEN THE SUN'],['WOBBLES',Y]],86],
 [31.7,35.6,[["JUPITER'S PULL"],['PUTS THE POINT'],['OUTSIDE THE SUN',Y]],80],
 [35.7,D,[['THAT WOBBLE IS ONE'],['WAY WE FIND PLANETS'],['AROUND OTHER STARS',Y]],78]];
const FOOT=[
 [0,9.95,'To scale. Sped up: 1 orbit = 6.4 days'],
 [11.2,14.25,'Charon has about 1/8 of Pluto’s mass'],
 [14.5,22.9,'To scale. Sped up: 1 orbit = 27.3 days'],
 [23.0,27.45,'1,700 km below the surface. Earth’s spin not shown'],
 [27.7,31.2,'Sun to scale. Sped up: 1 loop = 11.9 years'],
 [31.7,35.4,'The point: on average 47,000 km above the surface',700,34],
 [35.7,D,'Only Jupiter shown; other planets add smaller wobbles']];
function win(t,a,b,fi,fo){return Math.min(ease((t-a)/(fi||.35)),ease((b-t)/(fo||.3)))*(t>=a&&t<b?1:0)}
function foot(t){for(const f of FOOT){const a=f[0]===0?Math.min(1,ease((f[1]-t)/.3)):win(t,f[0],f[1],.35,.3);if(a<=0)continue;const s=fitSize([f[2]],f[4]||30,700,820);txt(f[2],495,f[3]||1428,s,'center',f[3]?Y:'#b9c6e6',a,f[3]?800:700,'foot')}}
// barycentre marker (always on top), pulses while a card names it
function marker(t,Lt){const a=Lt.a;let al=a.t0===0?1:ease((t-a.t0)/.3);if(a.name==='B')al*=ease((t-17.9)/.5);if(al<=0)return;
 const pulse=[[6.3,10.2],[10.3,14.25],[18.7,22.9],[31.7,35.6]].some(w=>t>=w[0]&&t<w[1])?.5+.5*Math.sin((t)*2*Math.PI*1.1):0;
 const kk=a.name==='A'?Lt.k:1,A=a.name==='C'?10:7+6*kk,rr=a.name==='C'?17:12+10*kk;
 x.save();x.globalAlpha=al;x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=8;
 x.strokeStyle='rgba(0,0,0,.85)';x.lineWidth=8;x.lineCap='round';x.beginPath();x.moveTo(CX-A,CY);x.lineTo(CX+A,CY);x.moveTo(CX,CY-A);x.lineTo(CX,CY+A);x.stroke();
 x.strokeStyle=Y;x.lineWidth=4;x.shadowColor=Y;x.shadowBlur=12;x.beginPath();x.moveTo(CX-A,CY);x.lineTo(CX+A,CY);x.moveTo(CX,CY-A);x.lineTo(CX,CY+A);x.stroke();
 x.globalAlpha=al*(.55+.45*pulse)*kk*(a.name==='C'?0:1);x.lineWidth=2.5;x.beginPath();x.ellipse(CX,CY,rr+6*pulse,(rr+6*pulse)*a.CI,0,0,7);x.stroke();x.restore();
 window.MARK=[CX,CY,24];}
// partner pointer for close views (partner off screen)
function pointer(t,Lt){const a=Lt.a;let al;
 if(a.name==='A')al=Math.max(1-ease((t-4.6)/.5),ease((t-11.5)/.4));else if(a.name==='B')al=ease((t-18.5)/.4);else al=ease((t-a.t0)/.3);
 al*=Math.min(1,ease((a.t1-t)/.15));if(al<=0)return;
 const [ux,uy]=Lt.u,h=Lt.H;const dh=Math.hypot(h.x-CX,h.y-CY);const s0=a.name==='B'?26:Math.max(34,h.r-dh+20);   // Earth: the point is inside the planet, so the arrow may start on the disc
 const nm={CHARON:'TO CHARON',MOON:'TO THE MOON',JUPITER:'TO JUPITER'}[a.L.name];x.font='800 36px '+FNT;const tw=x.measureText(nm).width;const ext=Math.abs(ux)*tw/2+Math.abs(uy)*18+22;
 // shorten the arrow so its label fits the text safe area instead of being clamped back onto the arrow
 let Lr=120;for(;Lr>28;Lr-=2){const cx=CX+ux*(s0+Lr+16+ext);if(cx-tw/2>=60&&cx+tw/2<=930)break;}
 window.PTRCLAMP=Lr<120;const s1=s0+Lr;
 const x0=CX+ux*s0,y0=CY+uy*s0,x1=CX+ux*s1,y1=CY+uy*s1;
 x.save();x.globalAlpha=al;x.lineCap='round';
 for(const [w,cc] of [[7,'rgba(0,0,0,.8)'],[3.5,BL]]){x.strokeStyle=cc;x.fillStyle=cc;x.lineWidth=w;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();
  const px=-uy,py=ux,hx=x1+ux*16,hy=y1+uy*16;x.beginPath();x.moveTo(hx,hy);x.lineTo(x1-ux*6+px*13,y1-uy*6+py*13);x.lineTo(x1-ux*6-px*13,y1-uy*6-py*13);x.closePath();
  if(w>5){x.lineWidth=5;x.stroke()}else x.fill()}
 x.restore();
 let lx=x1+ux*(16+ext),ly=y1+uy*(16+ext)+14;
 if(lx-tw/2<60||lx+tw/2>930){lx=cl(x1+ux*16,60+tw/2,930-tw/2);ly=uy>-.35?y1+uy*16-46:y1+uy*16+60;}  // no room beyond the tip: label above/below the arrowhead
 window.ARROW=[x0,y0,x1+ux*16,y1+uy*16];txt(nm,lx,ly,36,'center',BL,al,800,'ptr');}
function labels(t,Lt){const a=Lt.a;const k=Lt.k;
 // close views: name on the body; wide views: name below the body
 const close=a.name==='A'?Math.max(1-ease((t-4.6)/.35),ease((t-11.5)/.35)):a.name==='B'?ease((t-18.5)/.4):0;
 const wide=a.name==='A'?Math.min(ease((t-7.1)/.35),1-ease((t-9.7)/.3)):a.name==='B'?Math.min(ease((t-a.t0)/.3),1-ease((t-17.0)/.35)):0;
 const out=Math.min(1,ease((a.t1-t)/.15));
 if(close>0)txt(a.H.name,Lt.H.x,Lt.H.y+16,48,'center','#fff',close*out,900,'body:H');
 if(wide>0){for(const [b,nm] of [[Lt.H,a.H.name],[Lt.L,a.L.name]]){const yy=b.y+Math.max(b.r,8)+66;x.font='800 38px '+FNT;const hw=x.measureText(nm).width/2+2;txt(nm,cl(b.x,60+hw,930-hw),yy,38,'center','#fff',wide*out,800,'wide')}
  // highlight rings around bodies that are only a few px wide
  x.save();x.globalAlpha=wide*out*.8;x.strokeStyle='#cfe3ff';x.lineWidth=2;for(const b of [Lt.H,Lt.L])if(b.r<12){x.beginPath();x.arc(b.x,b.y,b.r+9,0,7);x.stroke()}x.restore()}}
function overlay(t){const Lt=layout(t);labels(t,Lt);pointer(t,Lt);marker(t,Lt);for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);foot(t);}
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t);
 const dk=dip(t);if(dk<1){x.fillStyle='rgba(0,0,0,'+(1-dk)+')';x.fillRect(0,0,W,H)}}
window.draw=frame;window.frameOverlay=t=>{BB=[];x.clearRect(0,0,W,H);overlay(t)};
window.GEOM=t=>{const L=layout(t);return [L.H,L.L].filter(b=>b.ty>=0)};
window.MODEL={D,acts:ACTS.map(a=>({n:a.name,rH:a.rH,rL:a.rL,q:a.q,Hpx_close:a.sClose*a.rH,Rclose:a.sClose*a.H.R,ratio_out:a.rH/a.H.R}))};
