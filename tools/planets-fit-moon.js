// planets-fit-moon: all 7 planets lined up between Earth and the Moon, to scale (NASA mean radii, mean apogee/perigee).
// Sources: NASA NSSDC planetary + Moon fact sheets (mean radii, mean perigee 363,300 km / apogee 405,500 km).
const D=35.0,GX=588,YE=1424;
const KM_APO=405500,KM_PER=363300,S=(YE-420)/KM_APO;           // px per km; Moon centre at y=420 at apogee
const RE=6371.0,RM=1737.4;
// stack from Earth's surface upward (Sun order): name, mean radius km, shader type, slide start, slide dur, from side, label side
const PL=[
 ['MERCURY',2439.7,6, 5.85,.85,-1,'L'],['VENUS',6051.8,7, 5.15,.85,1,'L'],['MARS',3389.5,5, 4.45,.85,-1,'L'],
 ['JUPITER',69911,1, -.40,1.40,-1,'L'],['SATURN',58232,2, .95,1.40,1,'R'],['URANUS',25362,3, 2.25,1.05,1,'R'],['NEPTUNE',24622,8, 3.15,1.05,1,'R']];
let cum=0;const P=PL.map(p=>{const o={name:p[0],rk:p[1],ty:p[2],t0:p[3],dur:p[4],side:p[5],lab:p[6],r:p[1]*S,y:YE-(RE+cum+p[1])*S,
 bottomKm:cum,topKm:cum+2*p[1]};cum+=2*p[1];o.cum=cum;return o});
const SUMKM=cum;                                    // 380,016 km
const CONTACT=SUMKM+RE+RM;                          // Moon centre distance at which the Moon touches Neptune
const NEP=P[6];
// SP slot order in the shader: 0 earth 1 moon 2 mercury 3 venus 4 saturn 5 mars 6 jupiter 7 uranus 8 neptune
const SLOT={MERCURY:2,VENUS:3,SATURN:4,MARS:5,JUPITER:6,URANUS:7,NEPTUNE:8};
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const eout=t=>{t=cl(t);return 1-Math.pow(1-t,3)};
// Moon distance (centre to centre): apogee -> perigee -> apogee (half an anomalistic month each, ~13.8 days)
const M1a=12.6,M1b=16.6,M2a=21.6,M2b=25.6;
const HALF=27.55455/2,MID=(KM_APO+KM_PER)/2,AMP=(KM_APO-KM_PER)/2;   // half an anomalistic month (NASA: 27.55455 d)
function phase(t){if(t>=M1a&&t<M2a)return{leg:1,day:HALF*eio((t-M1a)/(M1b-M1a))};if(t>=M2a)return{leg:2,day:HALF*eio((t-M2a)/(M2b-M2a))};return{leg:0,day:0}}
function moonKm(t){const p=phase(t);const c=Math.cos(Math.PI*p.day/HALF);return p.leg===1?MID+AMP*c:p.leg===2?MID-AMP*c:KM_APO} // r ~ a(1 - e cos M)
function moonDay(t){const p=phase(t);return p.leg?p.day:-1}
function solve(f,a,b){for(let i=0;i<60;i++){const m=(a+b)/2;if(f(a)*f(m)<=0)b=m;else a=m}return (a+b)/2}
// Neptune leaves before the Moon reaches its slot and returns after the Moon has passed back above it
const NOUT0=solve(t=>moonKm(t)-(CONTACT+14000),M1a,M1b),NOUT=.45;
const NIN0=solve(t=>moonKm(t)-(CONTACT+6000),M2a,M2b),NIN=.7;
const TCONT=solve(t=>moonKm(t)-CONTACT,M1a,M1b);
const NX_OUT=850;
function nepX(t){if(t<NOUT0)return GX;if(t<NIN0)return GX+(NX_OUT-GX)*eio((t-NOUT0)/NOUT);return NX_OUT+(GX-NX_OUT)*eio((t-NIN0)/NIN)}
const EX0=33.5,EXD=.9;
function startX(p){return p.side<0?-(p.name==='SATURN'?360:p.r+40):W+(p.name==='SATURN'?360:p.r+40)}
function planetX(p,t){
 if(t>=EX0){if(p.name==='JUPITER'&&t>=D-.4)return planetX(p,t-D);const ex=p.name==='JUPITER'?W+p.r+40:startX(p);return GX+(ex-GX)*Math.pow(cl((t-EX0)/EXD),2.2)}
 if(p===NEP&&t>=NOUT0)return nepX(t);const u=eout((t-p.t0)/p.dur);
 const start=p.side<0?-(p.name==='SATURN'?360:p.r+40):W+(p.name==='SATURN'?360:p.r+40);return start+(GX-start)*u}
const land=p=>p.t0+p.dur;
window.MODEL={S,SUMKM,gapApo:KM_APO-RE-RM,gapPer:KM_PER-RE-RM,spare:KM_APO-RE-RM-SUMKM,short:SUMKM-(KM_PER-RE-RM),
 lands:P.map(p=>[p.name,+land(p).toFixed(2)]),NOUT0:+NOUT0.toFixed(2),NIN0:+NIN0.toFixed(2),TCONT:+TCONT.toFixed(2),
 ys:P.map(p=>[p.name,+p.y.toFixed(1),+p.r.toFixed(1)]),moonApoY:YE-KM_APO*S,moonPerY:YE-KM_PER*S};
const SUN=(()=>{const v=[-.55,.38,.74];const l=Math.hypot(...v);return v.map(a=>a/l)})();
const RA=20*Math.PI/180,RNV=[0,Math.cos(RA),Math.sin(RA)];
gl.uniform3fv(U('RN'),RNV);gl.uniform1f(U('ROUT'),2.27*60268*S);gl.uniform3fv(U('SUN'),SUN);gl.uniform2f(U('R'),W,H);
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=14;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04});}
const LX=60,LW=GX-61-24-LX;                         // left text column 60..503
function fitSize(lines,size,weight){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>LW?Math.floor(size*LW/mw):size}
function card(lines,t,a,b,size){ // lines: [text,color,size?]; main lines share one size
 const fi=a<=0?1:ease((t-a)/.35),fo=b>=D?1:ease((b-t)/.3),al=Math.min(fi,fo);if(t<a||t>=b||al<=0)return;
 const main=fitSize(lines.filter(l=>!l[2]).map(l=>l[0]),size);
 let y=342+(1-fi)*24;for(const l of lines){const sz=l[2]?fitSize([l[0]],l[2]):main;txt(l[0],LX,y+sz*.74,sz,'left',l[1]||'#fff',al,900);y+=sz*1.18}}
const fmt=n=>Math.round(n).toLocaleString('en-US');
function txtFit(s,px,py,size,col,al,wt){x.font=(wt||700)+' '+size+'px '+FNT;const w=x.measureText(s).width;txt(s,px,py,w>LW?Math.floor(size*LW/w):size,'left',col,al,wt||700)}
function counters(t,a,b,status,build){const fi=ease((t-a)/.35),fo=ease((b-t)/.3),al=Math.min(fi,fo);if(t<a||t>=b||al<=0)return;
 let landed=0;for(const p of P)if(t>=land(p))landed+=2*p.rk;const all=t>=land(P[0]);
 const gap=moonKm(t)-RE-RM;const over=gap<SUMKM;
 txtFit(build?(all?'ALL 7, END TO END':'PLANETS SO FAR'):'ALL 7 NEED',LX,372,34,'#b9c6e6',al);
 txt(fmt(build?landed:SUMKM)+' km',LX,426,50,'left','#ffd98a',al,900);
 txtFit('GAP BETWEEN SURFACES',LX,470,34,'#b9c6e6',al);
 txt(fmt(gap)+' km',LX,524,50,'left',over?'#ff7a72':'#ffffff',al,900);
 if(status&&status[0])txtFit(status[0],LX,568,34,status[1],al*(status[2]==null?1:status[2]),800);}
const CARDS=[
 [0,3.45,[['ALL 7'],['PLANETS'],['FIT IN','#ffd98a'],['THIS GAP','#ffd98a']],76],
 [D-.6,D,[['ALL 7'],['PLANETS'],['FIT IN','#ffd98a'],['THIS GAP','#ffd98a']],76],
 [8.2,11.8,[['THEY FIT!'],['17,376 km SPARE','#7dffb0',48]],72],
 [11.8,14.0,[['BUT THE'],["MOON'S"],['ORBIT IS AN','#ffd98a'],['ELLIPSE','#ffd98a']],64],
 [17.2,21.4,[['AT ITS CLOSEST,','#ffffff',48],['NEPTUNE','#ff7a72'],["DOESN'T FIT",'#ff7a72'],['24,824 km SHORT','#ff7a72',46]],66],
 [26.3,32.8,[['THEY FIT'],['ONLY WHEN'],['THE MOON','#ffd98a'],['IS FAR AWAY','#ffd98a']],72]];
function status(t){const d=moonDay(t);
 if(t>=14&&t<18)return dayTxt(d,'FARTHEST');
 if(t>=21.4&&t<26.3){if(t>=NIN0+NIN)return['ALL 7 FIT AGAIN','#7dffb0',ease((t-NIN0-NIN)/.3)];return dayTxt(d,'CLOSEST')}
 return null}
function dayTxt(d,ref){const n=Math.round(d);return[n>=1?n+(n===1?' DAY':' DAYS')+' AFTER '+ref:'','#b9c6e6']}
function bodies(t){ // returns uniform arrays
 const sp=new Float32Array(36),ty=new Float32Array(9),spin=new Float32Array(9),al=new Float32Array(9);
 const set=(k,x0,y0,r,tp,sn,a)=>{sp.set([x0,y0,0,r],4*k);ty[k]=tp;spin[k]=sn;al[k]=a};
 set(0,GX,YE,RE*S,0,.9+2*Math.PI*t/D,1);set(1,GX,YE-moonKm(t)*S,RM*S,4,.0,1);
 for(const p of P){const k=SLOT[p.name];const xx=planetX(p,t);const tl=(p.name==='JUPITER'&&t>=D-.4)?t-D:t;const on=(t>=p.t0-.05&&!(t>=EX0+EXD+.05&&!(p.name==='JUPITER'&&t>=D-.4)))?1:0;set(k,xx,p.y,p.r,p.ty,(p.ty==1?.08:.05)*tl+k,on)}
 return {sp,ty,spin,al}}
function shade(t,hl){const b=bodies(t);gl.viewport(0,0,W,H);gl.uniform1f(U('T'),t>=D-.4?t-D:t);
 gl.uniform4fv(U('SP'),b.sp);gl.uniform1fv(U('TY'),b.ty);gl.uniform1fv(U('SPIN'),b.spin);gl.uniform1fv(U('AL'),b.al);
 const mY=YE-moonKm(t)*S;gl.uniform1f(U('GUIDE'),1);gl.uniform1f(U('GX'),GX);gl.uniform1f(U('GY0'),mY+RM*S+3);gl.uniform1f(U('GY1'),YE-RE*S-3);
 gl.uniform4fv(U('HL'),hl);gl.drawArrays(gl.TRIANGLES,0,3);}
function moving(t){if(t>=EX0)return true;for(const p of P){if(t>p.t0-.05&&t<land(p))return true}return (t>M1a&&t<M1b)||(t>M2a&&t<M2b)||(t>NOUT0&&t<NOUT0+NOUT)||(t>NIN0&&t<NIN0+NIN)}
function hlAt(t){ // Neptune outline: red while out, green flash on return
 if(t>=TCONT&&t<NIN0)return[8,1,.25*ease((t-TCONT)/.3),ease((t-TCONT)/.3)];
 if(t>=NIN0&&t<NIN0+NIN+1.4){const k=t<NIN0+NIN?1-ease((t-NIN0)/NIN):0;const gk=t>=NIN0+NIN?Math.sin(Math.PI*cl((t-NIN0-NIN)/1.4)):0;
  return k>0?[8,1,.25*k,k]:[8,0,0,gk]}
 return[-1,0,0,0]}
function speed(t){let m=Math.abs(YE-moonKm(t+1/30)*S-(YE-moonKm(t)*S));for(const p of P){const a=planetX(p,t),b=planetX(p,t+1/30);if(isFinite(a)&&isFinite(b))m=Math.max(m,Math.abs(b-a))}return m}
function scene(t){
 const n=Math.max(1,Math.min(16,Math.ceil(Math.max(speed(t),speed(t-1/30))/2.5)));
 for(let i=0;i<n;i++){const ts=t+(i-(n-1)/2)/(30*n)*1.0;shade(ts,hlAt(t));x.globalAlpha=1/(i+1);x.drawImage(g,0,0)}x.globalAlpha=1;
 // bloom + vignette
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(36px)';x.globalAlpha=.22;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.48,H*.3,W/2,H*.48,H*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
function rings(t){ // emphasis circles for the tiny Earth and Moon
 const mY=YE-moonKm(t)*S;x.save();x.strokeStyle='rgba(170,200,255,.55)';x.lineWidth=2;
 x.beginPath();x.arc(GX,mY,RM*S+9,0,7);x.stroke();x.beginPath();x.arc(GX,YE,RE*S+8,.12*Math.PI,.88*Math.PI);x.stroke();x.restore()}
function lab(p,t){const lt=p.name==='SATURN'?Math.max(land(p),land(P[5])):land(p);let a=Math.min(ease((t-lt)/.35),1-ease((t-EX0+.35)/.3));if(p===NEP&&t>=NOUT0-.2){const k=t<NIN0+NIN?0:ease((t-NIN0-NIN)/.35);a=Math.min(a,Math.max(1-ease((t-NOUT0+.2)/.25),k))}
 if(a<=0)return;const sz=44;
 if(p.lab==='R'){let ly=p.y+sz*.36;if(p.name==='SATURN')ly=p.y-122;const lx=p.name==='SATURN'?676:GX+p.r+26;txt(p.name,lx,ly,sz,'left','#fff',a);
  if(p.name==='SATURN'){x.save();x.globalAlpha=a*.8;x.strokeStyle='#cfd8ee';x.lineWidth=2;x.beginPath();x.moveTo(lx-8,ly-14);x.lineTo(GX+p.r*.62,p.y-p.r*.72);x.stroke();x.restore()}return}
 if(p.name==='JUPITER'){txt(p.name,GX-p.r-26,p.y+sz*.36,sz,'right','#fff',a);return}
 const row={MARS:1336,VENUS:1386,MERCURY:1436}[p.name];const lx=400;txt(p.name,lx,row,sz,'right','#fff',a);
 x.save();x.globalAlpha=a*.8;x.strokeStyle='#cfd8ee';x.lineWidth=2;x.beginPath();x.moveTo(lx+12,row-15);x.lineTo(GX-p.r-6,p.y);x.stroke();x.restore()}
function overlay(t){
 rings(t);const mY=YE-moonKm(t)*S;
 txt('EARTH',GX+RE*S+22,YE+12,44,'left','#9fc4ff',1);
 const d=moonDay(t);txt('MOON',GX+RM*S+22,mY+15,44,'left','#d9dde6',1);
 for(const p of P)lab(p,t);
 // spare-gap bracket
 const ga=Math.min(ease((t-8.2)/.4),ease((11.8-t)/.4));if(t>8.2&&t<11.8){const y0=mY+RM*S,y1=NEP.y-NEP.r;x.save();x.globalAlpha=ga;x.strokeStyle='#7dffb0';x.lineWidth=3;
  x.shadowColor='#7dffb0';x.shadowBlur=12;x.beginPath();x.moveTo(GX-40,y0);x.lineTo(GX+2,y0);x.moveTo(GX-40,y1);x.lineTo(GX+40,y1);x.moveTo(GX-32,y0+2);x.lineTo(GX-32,y1-2);x.stroke();x.restore()}
 for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);
 counters(t,3.6,8.2,null,true);counters(t,14.0,17.2,status(t));counters(t,21.4,26.3,status(t));}
function frameOverlay(t){BB=[];overlay(t)}window.frameOverlay=frameOverlay;
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t)}
let F0=null;
function draw(t){frame(t)}
window.draw=draw;
window.GEOM=t=>{const b=bodies(t);const d=[];for(let k=0;k<9;k++)if(b.al[k]>0)d.push({k,x:b.sp[4*k],y:b.sp[4*k+1],r:b.sp[4*k+3]});
 const sa=b.al[4]>0?{x:b.sp[16],y:b.sp[17],a:2.27*60268*S,b:2.27*60268*S*Math.sin(RA)}:null;return {d,sa}};
