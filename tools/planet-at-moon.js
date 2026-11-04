// planet-at-moon: each planet placed at the Moon's average distance (384,400 km), drawn at its true angular size over a night horizon.
// Sources: NASA NSSDC fact sheets (equatorial radii: Moon 1,738.1, Mars 3,396.2, Venus 6,051.8, Neptune 24,764, Uranus 25,559,
// Jupiter 71,492, Saturn 60,268 km; Moon semimajor axis 384,400 km) and the Saturnian Rings Fact Sheet (A ring outer edge 136,780 km).
const D=30.5,CX=540,CY=1010,HZY=1345;
const DIST=384400,FPX=1404;                        // focal length in px: rings (39.2 deg) span ~1,000 px of the 1,080 frame
const pxR=R=>FPX*R/Math.sqrt(DIST*DIST-R*R);       // projected radius of a sphere (angular radius = asin(R/d))
const angD=R=>2*Math.asin(R/DIST)*180/Math.PI;
const B={MOON:{R:1738.1,ty:4,fl:0},MARS:{R:3396.2,ty:5,fl:0},VENUS:{R:6051.8,ty:7,fl:0},NEPTUNE:{R:24764,ty:8,fl:.017},
 URANUS:{R:25559,ty:3,fl:0},JUPITER:{R:71492,ty:1,fl:.065},SATURN:{R:60268,ty:2,fl:.084}};
for(const k in B){B[k].px=pxR(B[k].R);B[k].deg=angD(B[k].R)}
const RINGKM=136780,RINGDEG=2*Math.atan(RINGKM/DIST)*180/Math.PI,RINGK=(FPX*RINGKM/DIST)/(2.27*B.SATURN.px); // ring drawn at its true 39.2 deg
// timeline: [body, arrive start, arrive end]; each body holds until the next one starts
const SEQ=[['SATURN',-9,-8],['MOON',2.7,3.5],['MARS',5.6,6.3],['VENUS',7.6,8.4],['NEPTUNE',9.8,10.8],['URANUS',13.2,14.1],
 ['JUPITER',16.6,17.8],['SATURN',21.6,23.0]];
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
function state(t){ // returns list of [name, radiusPx, alpha] passes, bottom first
 let i=0;for(let j=0;j<SEQ.length;j++)if(t>=SEQ[j][1])i=j;
 const cur=SEQ[i],prev=SEQ[i-1];
 if(!prev||t>=cur[2])return[[cur[0],B[cur[0]].px,1]];
 const u=(t-cur[1])/(cur[2]-cur[1]),k=eio(u);
 const r=Math.exp(Math.log(B[prev[0]].px)*(1-k)+Math.log(B[cur[0]].px)*k);
 // sequential swap (no double exposure): the old body fades out first, then the new one fades in; Saturn always enters at its true size
 return[[prev[0],r,1-ease(u/.42)],[cur[0],cur[0]==='SATURN'?B.SATURN.px:r,ease((u-.50)/.35)]]}
const SUN=(()=>{const v=[-.42,.30,.86];const l=Math.hypot(...v);return v.map(a=>a/l)})();
const RA=22*Math.PI/180,RNV=[Math.sin(-6*Math.PI/180)*Math.cos(RA),Math.cos(RA),Math.sin(RA)];
gl.uniform3fv(U('RN'),RNV);gl.uniform3fv(U('SUN'),SUN);gl.uniform2f(U('R'),W,H);gl.uniform1f(U('HZ'),HZY);
// reference Moon (for scale) at the side
const REFX=884,REFY=672;
function refAlpha(t){ if(t<2.6)return 1-ease((t-2.35)/.25); if(t<5.6)return 0; return ease((t-5.7)/.5)}
function shade(t,name,r,ra,br){
 const sp=new Float32Array(36),ty=new Float32Array(9),spin=new Float32Array(9),al=new Float32Array(9),fl=new Float32Array(9);
 const b=B[name];const k=name==='SATURN'?4:0;const tl=t,TP=2*Math.PI/D;
 sp.set([CX,CY,0,r],4*k);ty[k]=b.ty;spin[k]=name==="MOON"?0:TP*t+1.3;al[k]=1;fl[k]=b.fl; // spin: one turn per loop (seamless)
 if(ra>0){sp.set([REFX,REFY,0,B.MOON.px],4);ty[1]=4;al[1]=ra;sp.set([REFX,REFY,0,B.MOON.px],4*1)}
 gl.uniform1f(U('ROUT'),2.27*r*RINGK);gl.uniform1f(U('BR'),br==null?1:br);gl.uniform1f(U('T'),tl);
 gl.uniform4fv(U('SP'),sp);gl.uniform1fv(U('TY'),ty);gl.uniform1fv(U('SPIN'),spin);gl.uniform1fv(U('AL'),al);gl.uniform1fv(U('FL'),fl);
 gl.uniform4fv(U('HL'),[-1,0,0,0]);gl.viewport(0,0,W,H);gl.drawArrays(gl.TRIANGLES,0,3);}
// ---- landscape (drawn on the 2D canvas over the sky) ----
function hsh(n){const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)}
function vn(x){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return hsh(i)*(1-u)+hsh(i+1)*u}
function ridge(x,base,amp,sc,seed){return base-amp*(vn(x/sc+seed)*.65+vn(x/(sc*.37)+seed*3)*.25+vn(x/(sc*.11)+seed*7)*.10)}
const TREES=[];for(let i=0;i<46;i++){const x=-80+i*27+hsh(i*3.1)*22;TREES.push({x,h:38+hsh(i*7.7)*70,w:.30+hsh(i*5.3)*.12,on:hsh(i*9.1)>.35})}
function pl(p){const alb={MOON:.12,MARS:.17,VENUS:.69,NEPTUNE:.44,URANUS:.49,JUPITER:.54,SATURN:.5}[p[0]];let a=p[1]*p[1]*alb;if(p[0]==='SATURN')a*=1.6;return a}
function shine(t){ // planet-shine on the land: apparent disc area x brightness, crossfaded like the sky
 let s=0;for(const p of state(t)){const b=B[p[0]];const alb={MOON:.12,MARS:.17,VENUS:.69,NEPTUNE:.44,URANUS:.49,JUPITER:.54,SATURN:.5}[p[0]];
  let a=p[1]*p[1]*alb;if(p[0]==='SATURN')a*=1.6;p.sh=a}
 // land light crossfades between the two bodies' values (normalised weights), so it never dips in the swap gap
 {const ps2=state(t);if(ps2.length>1){const w0=ps2[0][2],w1=ps2[1][2],a0=pl(ps2[0]),a1=pl(ps2[1]);const m=w1>0?.5+.5*w1:.5-.5*w0;s=a0*(1-m)+a1*m}else s=pl(ps2[0])}
 return cl(Math.log10(1+s/40)/3.1)}
const SHORE=1478,NR=px=>ridge(px,HZY+112,55,300,8.2);
const rC=document.createElement('canvas');rC.width=1080;rC.height=1920;const rx=rC.getContext('2d');
const skyC=document.createElement('canvas');skyC.width=W;skyC.height=H;const sx=skyC.getContext('2d');
function treePath(tr,dx2,flip){const tx=tr.x+dx2,base=NR(tr.x)+6,h=tr.h,w=h*tr.w;const Yf=y=>flip?2*SHORE-y:y;
 x.moveTo(tx,Yf(base-h));for(let j=1;j<=5;j++){const yy=base-h+h*j/5.4,ww=w*(.35+.65*j/5);x.lineTo(tx+ww,Yf(yy));x.lineTo(tx+ww*.45,Yf(yy))}
 x.lineTo(tx+w*.12,Yf(base));x.lineTo(tx-w*.12,Yf(base));for(let j=5;j>=1;j--){const yy=base-h+h*j/5.4,ww=w*(.35+.65*j/5);x.lineTo(tx-ww*.45,Yf(yy));x.lineTo(tx-ww,Yf(yy))}x.closePath()}
function lake(t,sh,dx2){ // still water: distant sky and planet mirrored about the horizon, near shore mirrored about the waterline
 rx.clearRect(0,0,W,H);for(let y=SHORE;y<H;y+=2){const k=(y-SHORE)/(H-SHORE);const dx=(.8+2.6*k)*Math.sin(y*.085+t*2*Math.PI*8/D)+(.5+1.2*k)*Math.sin(y*.031-t*2*Math.PI*5/D);
  const src=2*HZY-y-2;if(src<0)continue;rx.drawImage(skyC,0,src,W,2,dx,y,W,2)}
 x.save();x.filter='blur(1.6px)';x.globalAlpha=.85;x.drawImage(rC,0,SHORE,W,H-SHORE,0,SHORE,W,H-SHORE);x.restore();
 const gd=x.createLinearGradient(0,SHORE,0,H);gd.addColorStop(0,'rgba(2,4,12,.50)');gd.addColorStop(1,'rgba(1,2,6,.80)');x.fillStyle=gd;x.fillRect(0,SHORE,W,H-SHORE);
 const c2=`rgba(${Math.round(4+8*sh)},${Math.round(6+10*sh)},${Math.round(11+15*sh)},.92)`;x.save();x.fillStyle=c2;x.beginPath();x.moveTo(-20,SHORE);
 for(let px=-20;px<=W+20;px+=6)x.lineTo(px,2*SHORE-NR(px-dx2));x.lineTo(W+20,SHORE);x.closePath();x.fill();
 x.beginPath();for(const tr of TREES)if(tr.on)treePath(tr,dx2,true);x.fill();x.restore();
 x.save();x.strokeStyle=`rgba(170,190,230,${.10+.18*sh})`;x.lineWidth=1.5;x.beginPath();x.moveTo(0,SHORE+.5);x.lineTo(W,SHORE+.5);x.stroke();x.restore()}
function land(t){
 const sh=shine(t),dx1=6*Math.sin(2*Math.PI*t/D),dx2=14*Math.sin(2*Math.PI*t/D);
 // far ridge with haze
 const c1=[Math.round(16+34*sh),Math.round(22+42*sh),Math.round(40+56*sh)];
 x.save();x.beginPath();x.moveTo(-20,H);for(let px=-20;px<=W+20;px+=6)x.lineTo(px,ridge(px-dx1,HZY+30,95,420,3.7));x.lineTo(W+20,H);x.closePath();
 const g1=x.createLinearGradient(0,HZY-70,0,H);g1.addColorStop(0,`rgb(${c1})`);g1.addColorStop(.35,`rgb(${c1.map(v=>Math.round(v*.45))})`);g1.addColorStop(1,'#020308');
 x.fillStyle=g1;x.fill();
 // rim light along the far ridge from the planet
 x.strokeStyle=`rgba(${150+60*sh},${170+50*sh},${220},${.10+.25*sh})`;x.lineWidth=2;x.beginPath();
 for(let px=-20;px<=W+20;px+=6){const y=ridge(px-dx1,HZY+30,95,420,3.7);px<=-20?x.moveTo(px,y):x.lineTo(px,y)}x.stroke();x.restore();
 // near ridge with pine silhouettes
 const c2=`rgb(${Math.round(5+10*sh)},${Math.round(7+12*sh)},${Math.round(13+18*sh)})`;
 lake(t,sh,dx2);
 x.save();x.fillStyle=c2;x.beginPath();x.moveTo(-20,SHORE);for(let px=-20;px<=W+20;px+=6)x.lineTo(px,NR(px-dx2));x.lineTo(W+20,SHORE);x.closePath();x.fill();
 x.beginPath();for(const tr of TREES)if(tr.on)treePath(tr,dx2,false);x.fill();
 x.restore();}
function scene(t){
 const ps=state(t),ra=refAlpha(t);
 // one opaque pass: the visible body fades by brightness (never see-through); old and new bodies are never visible together
 const vis=ps.filter(p=>p[2]>0.002);const pv=vis.length?vis[vis.length-1]:null;
 if(pv)shade(t,pv[0],pv[1],ra,pv[2]);else shade(t,ps[0][0],0,ra,0);x.drawImage(g,0,0);
 // bloom
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(30px)';x.globalAlpha=.20;x.drawImage(c,0,0);x.restore();
 sx.clearRect(0,0,W,H);sx.drawImage(c,0,0);
 land(t);
 const vg=x.createRadialGradient(W/2,H*.45,H*.32,W/2,H*.45,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
// ---- text ----
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=14;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04});}
const LX=60,LW=820;
function fitSize(lines,size,weight){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>LW?Math.floor(size*LW/mw):size}
function win(t,a,b){if(t<a||t>=b)return 0;return Math.min(a<=0?1:ease((t-a)/.35),b>=D?1:ease((b-t)/.3))}
function card(lines,t,a,b,size){const al=win(t,a,b);if(al<=0)return;const fi=a<=0?1:ease((t-a)/.35);
 const main=fitSize(lines.filter(l=>!l[2]).map(l=>l[0]),size);
 let y=342+(1-fi)*24;for(const l of lines){const sz=l[2]?fitSize([l[0]],l[2]):main;txt(l[0],LX,y+sz*.74,sz,'left',l[1]||'#fff',al,900);y+=sz*1.18}}
const Y='#ffd98a';
const HOOK=[['IF SATURN'],['WERE AS CLOSE',Y],['AS THE MOON',Y]];
const CARDS=[
 [0,2.6,HOOK,80],[D-.55,D,HOOK,80],
 [2.95,5.5,[['THIS IS'],['OUR MOON',Y]],80],
 [5.6,7.5,[['NOW SWAP IN'],['EACH PLANET',Y]],76],
 [7.6,9.7,[['SAME DISTANCE:'],['384,400 km',Y]],76],
 [13.65,17.2,[['TIPPED'],['ON ITS SIDE',Y]],76],
 [17.2,21.85,[['THE BIGGEST'],['PLANET',Y]],80],
 [22.3,26.6,[["BUT SATURN'S"],['RINGS ARE',Y],['EVEN WIDER',Y]],80],
 [26.6,D-.55,[['ALL TO SCALE,'],['AT THE MOON\'S',Y],['DISTANCE',Y]],76]];
const fmtDeg=d=>d<1.5?d.toFixed(1)+'°':d<10?d.toFixed(1)+'°':Math.round(d)+'°';
const READ={MOON:['0.5° WIDE','ABOUT HALF A DEGREE OF SKY'],MARS:['MARS','1.0° WIDE · 2× THE MOON'],VENUS:['VENUS','1.8° WIDE · 3.5× THE MOON'],
 NEPTUNE:['NEPTUNE','7.4° WIDE · 14× THE MOON'],URANUS:['URANUS','7.6° WIDE · 15× THE MOON'],JUPITER:['JUPITER','21° WIDE · 41× THE MOON'],
 SATURN:['SATURN','RINGS: 39° OF SKY']};
function readout(t){ // planet name + size, below the card; follows the body on screen
 const ps=state(t);const last=ps[ps.length-1];let name=last[0],al=1;
 if(ps.length>1){if(ps[1][2]>0){name=ps[1][0];al=ps[1][2]}else{name=ps[0][0];al=ps[0][2]}}   // label = the body that is visible, same alpha
 if(t<2.95||t>=D-.55)return; // hook card shows alone
 if(al<=0.01||(name==='SATURN'&&t<10))return;   // the opening Saturn is introduced by the hook card only
 const rd=READ[name];const y0=name==='SATURN'?640:560;
 txt(rd[0],LX,y0+44,60,'left','#ffffff',al,900);txt(rd[1],LX,y0+98,40,'left','#b9c6e6',al,800)}
function marks(t){ // emphasis ring around tiny discs, label on the reference Moon
 const ps=state(t);const vb=ps.filter(p=>p[2]>0);const pv=vb.length?vb[vb.length-1]:ps[0];const r=pv[1];const a=(1-ease((r-26)/20))*(vb.length?pv[2]:0);
 if(a>0.01){x.save();x.globalAlpha=a*.6;x.strokeStyle='#b9d0ff';x.lineWidth=2.5;x.beginPath();x.arc(CX,CY,r+16,0,7);x.stroke();x.restore()}
 const ra=refAlpha(t);if(ra>0.01){x.save();x.globalAlpha=ra*.55;x.strokeStyle='#b9d0ff';x.lineWidth=2;x.beginPath();x.arc(REFX,REFY,B.MOON.px+12,0,7);x.stroke();x.restore();
  txt('MOON',925,REFY+68,34,'right','#d9dde6',ra,800);txt('FOR SCALE',925,REFY+106,30,'right','#9fb0d0',ra,700)}}
function axis(t){ // Uranus spin axis (98 deg tilt): dashed line through the poles
 const ps=state(t);let a=0;for(const p of ps)if(p[0]==='URANUS')a=p[2];if(a<=0.01)return;
 const r=B.URANUS.px,ux=.97,uy=-.20,l=Math.hypot(ux,uy),L=r*2.3;x.save();x.globalAlpha=a*.75;x.strokeStyle='#cfe8ff';x.lineWidth=3;x.setLineDash([12,9]);
 x.beginPath();x.moveTo(CX-ux/l*L,CY-uy/l*L);x.lineTo(CX-ux/l*r*1.02,CY-uy/l*r*1.02);x.moveTo(CX+ux/l*r*1.02,CY+uy/l*r*1.02);x.lineTo(CX+ux/l*L,CY+uy/l*L);x.stroke();
 x.setLineDash([]);x.restore();txt('SPIN AXIS',CX+ux/l*L+14,CY+uy/l*L+10,28,'left','#cfe8ff',a,800)}
function overlay(t){marks(t);axis(t);for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);readout(t)}
function frameOverlay(t){BB=[];overlay(t)}window.frameOverlay=frameOverlay;
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t)}
window.draw=frame;
window.MODEL={px:Object.fromEntries(Object.entries(B).map(([k,v])=>[k,+v.px.toFixed(1)])),deg:Object.fromEntries(Object.entries(B).map(([k,v])=>[k,+v.deg.toFixed(3)])),
 ringPx:+(2.27*B.SATURN.px).toFixed(1),ringDeg:+RINGDEG.toFixed(2),ratio:Object.fromEntries(Object.entries(B).map(([k,v])=>[k,+(v.deg/B.MOON.deg).toFixed(2)]))};
window.GEOM=t=>{const ps=state(t);return {r:ps[ps.length-1][1],name:ps[ps.length-1][0],ref:refAlpha(t)}};
