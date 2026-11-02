// moons-bigger-than-mercury: Ganymede (and Titan) are wider than Mercury, but Mercury has 2.2x Ganymede's mass (huge metal core).
// Sources: NASA NSSDC Mercury fact sheet (mean radius 2439.7 km, mass 0.33010e24 kg, density 5429 kg/m3);
// JPL SSD planetary satellite physical parameters (Ganymede R 2631.2 km, GM 9887.83 km3/s2, rho 1.9416; Titan R 2574.76 km, GM 8978.14);
// NASA Mercury facts (metallic core radius ~2,074 km, about 85% of the planet's radius); NASA Ganymede facts (iron core, rock shell, mostly-ice shell).
const D=39.6;
const RKM=[2439.7,2631.2,2574.76];            // 0 Mercury 1 Ganymede 2 Titan
const MASS_RATIO=0.33010e24/(9887.83275e9/6.6743e-11);   // 2.228
const S1=0.0795,S2=786/(2*(RKM[0]+RKM[1]+RKM[2]));        // px per km: 2-body and 3-body layouts
const CY=940,GAP1=40,GAP2=30,LEFT=70;
const A={m:LEFT+RKM[0]*S1,g:LEFT+2*RKM[0]*S1+GAP1+RKM[1]*S1};
const C={m:LEFT+RKM[0]*S2};C.t=C.m+RKM[0]*S2+GAP2+RKM[2]*S2;C.g=C.t+RKM[2]*S2+GAP2+RKM[1]*S2;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const eout=t=>{t=cl(t);return 1-Math.pow(1-t,3)},ein=t=>Math.pow(cl(t),2.2);
// timeline
const T_IN0=-0.6,T_IN1=1.0,T_EX0=37.8,T_EX1=D-0.6;
const Z_OUT=[10.8,12.0],TI_IN=[11.7,12.9],TI_OUT=[16.2,16.9],Z_BACK=[16.8,17.9];
const CUT_OPEN=[25.2,26.6],CUT_CLOSE=[35.6,36.8];
const GHOST=[6.8,7.0,8.0,10.4,10.8];          // fade in, slide start, slide end, fade start, fade end
function zk(t){return t<Z_BACK[0]?eio((t-Z_OUT[0])/(Z_OUT[1]-Z_OUT[0])):1-eio((t-Z_BACK[0])/(Z_BACK[1]-Z_BACK[0]))}
function tl(t){return t>=D+T_IN0?t-D:t}        // the last 0.6 s already runs the opening entry (loop)
function enter(t,x0,x1){t=tl(t);if(t<T_IN1)return x0+(x1-x0)*eout((t-T_IN0)/(T_IN1-T_IN0));if(t>=T_EX0)return x1+(x0-x1)*ein((t-T_EX0)/(T_EX1-T_EX0));return x1}
function layout(t){const k=zk(t),S=S1+(S2-S1)*k;
 const rm=RKM[0]*S,rg=RKM[1]*S,rt=RKM[2]*S;
 let xm=A.m+(C.m-A.m)*k,xg=A.g+(C.g-A.g)*k;
 xm=enter(t,-RKM[0]*S1-40,xm);xg=enter(t,W+RKM[1]*S1+40,xg);
 let yt=H+RKM[2]*S2+40,at=0;
 if(t>=TI_IN[0]&&t<TI_OUT[1]){at=1;yt=t<TI_IN[1]?yt+(CY-yt)*eout((t-TI_IN[0])/(TI_IN[1]-TI_IN[0])):t<TI_OUT[0]?CY:CY+(yt-CY)*ein((t-TI_OUT[0])/(TI_OUT[1]-TI_OUT[0]))}
 return [{x:xm,y:CY,r:rm,al:1},{x:xg,y:CY,r:rg,al:1},{x:C.t,y:yt,r:rt,al:at}]}
function cutA(t){if(t<CUT_OPEN[0]||t>=CUT_CLOSE[1])return 1;if(t<CUT_OPEN[1])return 1-eio((t-CUT_OPEN[0])/(CUT_OPEN[1]-CUT_OPEN[0]));if(t<CUT_CLOSE[0])return 0;return eio((t-CUT_CLOSE[0])/(CUT_CLOSE[1]-CUT_CLOSE[0]))}
// cut frame: three orthonormal axes (view coords, y up, z toward viewer), all facing the viewer, octant corner up-right
const CUTE=(()=>{ // Rodrigues rotation taking the octant diagonal (1,1,1)/sqrt3 to d (toward the viewer, a little up-right)
 const nz=v=>{const l=Math.hypot(...v);return v.map(a=>a/l)},cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const a=nz([1,1,1]),d=nz([.32,.36,1]),k=nz(cr(a,d)),th=Math.acos(dt(a,d));
 const R=v=>{const c=Math.cos(th),s=Math.sin(th),kv=cr(k,v),kd=dt(k,v);return [0,1,2].map(i=>v[i]*c+kv[i]*s+k[i]*kd*(1-c))};
 return [[1,0,0],[0,1,0],[0,0,1]].map(R)})();
const SUN=(()=>{const v=[-.55,.38,.74];const l=Math.hypot(...v);return v.map(a=>a/l)})();
gl.uniform3fv(U('SUN'),SUN);gl.uniform2f(U('R'),W,H);gl.uniform3fv(U('E0'),CUTE[0]);gl.uniform3fv(U('E1'),CUTE[1]);gl.uniform3fv(U('E2'),CUTE[2]);
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=14;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04,a:alpha});}
const CX=495,CW=850;
function fitSize(lines,size,weight,maxw){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>(maxw||CW)?Math.floor(size*(maxw||CW)/mw):size}
function card(lines,t,a,b,size){const fi=a<=0?1:ease((t-a)/.35),fo=b>=D?1:ease((b-t)/.3),al=Math.min(fi,fo);if(t<a||t>=b||al<=0)return;
 const main=fitSize(lines.filter(l=>!l[2]).map(l=>l[0]),size);let y=342+(1-fi)*24;
 for(const l of lines){const sz=l[2]?fitSize([l[0]],l[2]):main;txt(l[0],CX,y+sz*.74,sz,'center',l[1]||'#fff',al,900);y+=sz*1.18}}
const Y='#ffd98a',GR='#7dffb0',OR='#ffb070',BL='#9fd0ff';
const CARDS=[
 [0,4.2,[['THIS MOON IS'],['BIGGER THAN'],['A PLANET',Y]],84],
 [D-.6,D,[['THIS MOON IS'],['BIGGER THAN'],['A PLANET',Y]],84],
 [4.3,8.0,[['MEASURE'],['THEM ACROSS']],80],
 [8.1,10.7,[['GANYMEDE IS'],['8% WIDER',GR]],84],
 [12.95,16.3,[["SATURN'S TITAN"],['IS WIDER TOO',Y]],80],
 [17.6,21.35,[['NOW COMPARE'],['THEIR MASS']],80],
 [21.45,25.0,[['MERCURY HAS'],['2.2× THE MASS',OR]],80],
 [26.7,31.1,[['WHY? MERCURY'],['HAS A HUGE'],['METAL CORE',OR]],80],
 [31.2,37.9,[['BIGGER'],["DOESN'T MEAN"],['HEAVIER',Y]],88]];
const fmt=n=>Math.round(n).toLocaleString('en-US');
const NAMES=['MERCURY','GANYMEDE','TITAN'],TYPES=['PLANET','MOON OF JUPITER','MOON OF SATURN'];
const DIAM=RKM.map(r=>2*r);   // 4879, 5262, 5150 km
const ROW1=1238,ROW2=1286,ROW3=1328;
function win(t,a,b,fi,fo){return Math.min(ease((t-a)/(fi||.35)),ease((b-t)/(fo||.3)))*(t>=a&&t<b?1:0)}
function labels(t,L){const exitA=1-ease((t-T_EX0+.1)/.3),inA=ease((tl(t)-T_IN1)/.35);const base=t>=D+T_IN0?0:Math.min(exitA,inA);
 for(let k=0;k<3;k++){const b=L[k];let a=k===2?win(t,TI_IN[1],TI_OUT[0]+.15,.35,.3):base;if(a<=0)continue;
  txt(NAMES[k],b.x,ROW1,44,'center','#fff',a,900);
  // row 2: type (hook/payoff), diameter (measure + Titan), descriptor (cutaway)
  const ty=Math.max(win(t,-1,4.3,.35,.3),win(t,31.2,40,.35,.3));if(k<2&&ty>0)txt(TYPES[k],b.x,ROW2,30,'center','#b9c6e6',a*ty,700);
  if(k===2)txt(fmt(DIAM[2])+' km',b.x,ROW2,36,'center',Y,a,800);
  else{const dm=win(t,4.4,17.4,.3,.3);if(dm>0){const v=DIAM[k]*eio((t-4.4)/1.6);txt(fmt(v)+' km',b.x,ROW2,36,'center',Y,a*dm,800)}}
  const ds=win(t,26.7,31.1,.35,.3);if(k<2&&ds>0){txt(k===0?'METAL CORE':'ROCK + ICE',b.x,ROW2,36,'center',k===0?OR:BL,a*ds,800);
   txt(k===0?'85% OF ITS RADIUS':'ICY OUTER SHELL',b.x,ROW3,30,'center','#b9c6e6',a*ds,700)}}}
function dims(t,L){const a=win(t,4.3,10.6,.3,.3);if(a<=0)return;x.save();x.globalAlpha=a;x.strokeStyle=Y;x.lineWidth=3;x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=6;
 for(let k=0;k<2;k++){const b=L[k],y=b.y+b.r+26,h=b.r*eout((t-4.3)/.8);x.beginPath();x.moveTo(b.x-h,y);x.lineTo(b.x+h,y);
  x.moveTo(b.x-h,y-12);x.lineTo(b.x-h,y+12);x.moveTo(b.x+h,y-12);x.lineTo(b.x+h,y+12);x.stroke()}x.restore()}
function ghost(t,L){if(t<GHOST[0]||t>=GHOST[4])return;const a=Math.min(ease((t-GHOST[0])/.2),1-ease((t-GHOST[3])/(GHOST[4]-GHOST[3])));
 const m=L[0],g2=L[1],u=eio((t-GHOST[1])/(GHOST[2]-GHOST[1]));const gx=m.x+(g2.x-m.x)*u;
 x.save();x.globalAlpha=a;x.setLineDash([14,10]);x.lineWidth=3;x.strokeStyle='#ffffff';x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=6;x.beginPath();x.arc(gx,m.y,m.r,0,7);x.stroke();x.restore();
 const ra=Math.min(ease((t-8.1)/.4),1-ease((t-GHOST[3])/(GHOST[4]-GHOST[3])));if(t>=8.1&&ra>0){ // the extra 8% band
  x.save();x.globalAlpha=ra*.85;x.strokeStyle=GR;x.lineWidth=g2.r-m.r;x.shadowColor=GR;x.shadowBlur=16;x.beginPath();x.arc(g2.x,g2.y,(g2.r+m.r)/2,0,7);x.stroke();x.restore()}}
const BAR={x0:90,x1:900,y1:1310,y2:1376,h:46};
function bars(t){const a=win(t,17.9,24.9,.3,.3);if(a<=0)return;const Wd=BAR.x1-BAR.x0,seg=Wd/MASS_RATIO;
 x.save();x.globalAlpha=a;x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=10;
 const mw=Wd*eout((t-18.0)/.8);x.fillStyle='#c79a6e';x.fillRect(BAR.x0,BAR.y1,mw,BAR.h);
 const segs=[[19.2,seg],[20.0,seg],[20.8,Wd-2*seg]];let xx=BAR.x0;
 for(let i=0;i<3;i++){const [t0,w]=segs[i];const u=eout((t-t0)/.6);if(u>0){x.fillStyle=i<2?'#7fa6cf':'#9dbbe0';x.fillRect(xx+(i?3:0),BAR.y2,(w-(i?3:0))*u,BAR.h)}xx+=w}
 x.restore();
 txt("MERCURY'S MASS",BAR.x0+14,BAR.y1+33,30,'left','#fff',a*ease((t-18.5)/.3),800);
 for(let i=0;i<2;i++)txt('GANYMEDE',BAR.x0+seg*i+seg/2,BAR.y2+33,30,'center','#fff',a*ease((t-segs[i][0]-.35)/.3),800);}
function coreLeader(t,L){const a=win(t,26.7,31.1,.35,.3);if(a<=0)return;const m=L[0];
 // a point on the most viewer-facing cut face, inside the core (radius 0.5 R)
 let i=0;for(let k=1;k<3;k++)if(CUTE[k][2]>CUTE[i][2])i=k;const j=(i+1)%3,k2=(i+2)%3;
 const v=[0,1,2].map(n=>CUTE[j][n]+CUTE[k2][n]),l=Math.hypot(...v);const px=m.x+v[0]/l*m.r*.5,py=m.y-v[1]/l*m.r*.5;
 window.COREPT=[px,py];
 const ty=m.y+m.r+10;x.save();x.globalAlpha=a*.85;x.strokeStyle='#ffd2a8';x.lineWidth=2.5;x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=6;
 x.beginPath();x.moveTo(m.x,ty);x.lineTo(px,py+8);x.stroke();x.fillStyle='#ffd2a8';x.beginPath();x.arc(px,py,6,0,7);x.fill();x.restore()}
function bodiesU(t,tr){const L=layout(t);const sp=new Float32Array(12),spin=new Float32Array(3),al=new Float32Array(3);
 L.forEach((b,k)=>{sp.set([b.x,b.y,0,b.r],4*k);spin[k]=[1.1,2.3,0.4][k]+0.035*(tr==null?t:tr);al[k]=b.al});return {sp,spin,al,L}}
function shade(t,tr){const b=bodiesU(t,tr);gl.viewport(0,0,W,H);gl.uniform1f(U('T'),t);
 gl.uniform4fv(U('SP'),b.sp);gl.uniform1fv(U('SPIN'),b.spin);gl.uniform1fv(U('AL'),b.al);
 const ca=cutA(t);gl.uniform1f(U('CUTA'),ca);gl.uniform1f(U('CUTON'),ca<.999?1:0);gl.drawArrays(gl.TRIANGLES,0,3);}
function speed(t){const a=layout(t),b=layout(t+1/30);let m=0;for(let k=0;k<3;k++){m=Math.max(m,Math.abs(b[k].x-a[k].x)+Math.abs(b[k].y-a[k].y)+Math.abs(b[k].r-a[k].r))}return m}
function scene(t,tr){const n=Math.max(1,Math.min(16,Math.ceil(Math.max(speed(t),speed(t-1/30))/2.5)));
 for(let i=0;i<n;i++){const ts=t+(i-(n-1)/2)/(30*n);shade(ts,tr+(i-(n-1)/2)/(30*n));x.globalAlpha=1/(i+1);x.drawImage(g,0,0)}x.globalAlpha=1;
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(36px)';x.globalAlpha=.20;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.48,H*.3,W/2,H*.48,H*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
function overlay(t){const L=layout(t);dims(t,L);ghost(t,L);bars(t);coreLeader(t,L);labels(t,L);for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);}
const SKIP0=33.0,SKIP=2.6,DN=D-SKIP;const remap=t=>t<SKIP0?t:t+SKIP;   // new duration 37.0 s
function frame(tn){BB=[];const t=remap(tn);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t,tn);overlay(t)}
window.draw=frame;window.frameOverlay=tn=>{BB=[];overlay(remap(tn))};
window.GEOM=tn=>layout(remap(tn)).filter(b=>b.al>0);
window.MODEL={S1,S2,A,C,MASS_RATIO,DIAM,CUTE,ratioGM:RKM[1]/RKM[0],D:DN,Dold:D};
