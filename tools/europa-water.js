// europa-water: Jupiter's moon Europa may hold about twice as much water as all of Earth's oceans.
// Sources: USGS (oceans 1,338,000,000 km3); NASA Europa facts / Europa Clipper (ice shell 15-25 km, ocean 60-150 km deep,
// about twice the water of Earth's oceans, arrival April 2030); JPL (Europa equatorial diameter 3,122 km); NASA NSSDC (Earth mean radius 6,371 km).
const D=38.0;
const RE=6371.0,REU=1560.8;
const VOC=1.338e9;                                        // km3, USGS: oceans
const RA=Math.cbrt(3*VOC/(4*Math.PI));                    // 683.4 km -> ball 1,367 km wide
const RU=RA*Math.cbrt(2);                                  // "about twice" -> ~861 km radius, ~1,722 km wide
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const eout=t=>{t=cl(t);return 1-Math.pow(1-t,3)},ein=t=>Math.pow(cl(t),2.2);
const lerp=(a,b,k)=>a+(b-a)*k,lg=(a,b,k)=>Math.exp(Math.log(a)*(1-k)+Math.log(b)*k);
// layouts (px)
const S1=340/RE,S2=400/REU,S3=0.16,S4=0.2;
const L1={E:[420,1080],U:[830,690],A:[845,1030]};
const L2={U:[520,1000]};
const L3={U:[330,1020],B:[790,900]};
const L4={B:[540,800],A1:[360,1190],A2:[720,1190]};
// cut frame: three orthonormal axes (view coords, y up, z toward viewer), octant corner up-right
const CUTE=(()=>{const nz=v=>{const l=Math.hypot(...v);return v.map(a=>a/l)},cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const a=nz([1,1,1]),d=nz([.32,.36,1]),k=nz(cr(a,d)),th=Math.acos(dt(a,d));
 const R=v=>{const c=Math.cos(th),s=Math.sin(th),kv=cr(k,v),kd=dt(k,v);return [0,1,2].map(i=>v[i]*c+kv[i]*s+k[i]*kd*(1-c))};
 return [[1,0,0],[0,1,0],[0,0,1]].map(R)})();
// the cut edge with the longest on-screen projection: layers are read along it during the push-in
const EDGE=(()=>{let b=0,bl=0;CUTE.forEach((e,i)=>{const l=Math.hypot(e[0],e[1]);if(l>bl){bl=l;b=i}});const e=CUTE[b];return {i:b,sx:e[0],sy:-e[1]}})();
const FQ=0.955,PUSH=3.0,PT=[560,1010];                     // keep the ocean point on that edge fixed on screen at PT
// timeline
const DR=[4.4,7.2],Z12=[10.0,12.0],CUT_OPEN=[12.3,13.5],PIN=[14.6,16.0],POUT=[19.2,20.4],Z23=[20.4,22.0],UB=[22.0,24.4],
 Z34=[25.4,27.0],AIN=[26.0,27.6],BACK=[31.0,32.8];
const edr=t=>t>=BACK[0]?0:eio((t-DR[0])/(DR[1]-DR[0]));
const odr=t=>t>=BACK[0]?0:eio((t-UB[0])/(UB[1]-UB[0]));
function cutA(t){if(t<CUT_OPEN[0]||t>=Z34[1])return 1;if(t<CUT_OPEN[1])return 1-eio((t-CUT_OPEN[0])/(CUT_OPEN[1]-CUT_OPEN[0]));
 if(t<Z34[0])return 0;return eio((t-Z34[0])/(Z34[1]-Z34[0]))}
function europa(t){ // centre + radius
 if(t<Z12[0])return {x:L1.U[0],y:L1.U[1],r:REU*S1};
 if(t<PIN[0]){const k=eio((t-Z12[0])/(Z12[1]-Z12[0]));return {x:lerp(L1.U[0],L2.U[0],k),y:lerp(L1.U[1],L2.U[1],k),r:REU*lg(S1,S2,k)}}
 if(t<POUT[1]){const k=t<POUT[0]?eio((t-PIN[0])/(PIN[1]-PIN[0])):1-eio((t-POUT[0])/(POUT[1]-POUT[0]));
  const r0=REU*S2,r=lg(r0,r0*PUSH,k);const q0=[L2.U[0]+EDGE.sx*r0*FQ,L2.U[1]+EDGE.sy*r0*FQ];const q=[lerp(q0[0],PT[0],k),lerp(q0[1],PT[1],k)];
  return {x:q[0]-EDGE.sx*r*FQ,y:q[1]-EDGE.sy*r*FQ,r}}
 if(t<Z34[0]){const k=eio((t-Z23[0])/(Z23[1]-Z23[0]));return {x:lerp(L2.U[0],L3.U[0],k),y:lerp(L2.U[1],L3.U[1],k),r:REU*lg(S2,S3,k)}}
 if(t<BACK[0]){const k=ein((t-Z34[0])/(Z34[1]-Z34[0]));return {x:lerp(L3.U[0],-420,k),y:L3.U[1],r:REU*S3}}
 const k=eout((t-BACK[0]-.3)/(BACK[1]-BACK[0]-.3));return {x:lerp(W+200,L1.U[0],k),y:L1.U[1],r:REU*S1}}
function earth(t){
 if(t<Z12[0])return {x:L1.E[0],y:L1.E[1],r:RE*S1,al:1};
 if(t<BACK[0]){const k=ein((t-Z12[0])/(Z12[1]-Z12[0]-.4));return {x:lerp(L1.E[0],-RE*S1-60,k),y:L1.E[1]+120*k,r:RE*S1,al:k>=1?0:1}}
 const k=eout((t-BACK[0]-.7)/(BACK[1]-BACK[0]-.7));return {x:lerp(-RE*S1-60,L1.E[0],k),y:L1.E[1],r:RE*S1,al:1}}
function ballA(t){ // Earth's oceans, act 1
 const r=RA*S1*Math.cbrt(edr(t));if(t<Z12[0])return {x:L1.A[0],y:L1.A[1],r,al:r>0?1:0};
 if(t<BACK[0]){const k=ein((t-Z12[0])/(Z12[1]-Z12[0]-.4));return {x:lerp(L1.A[0],W+80,k),y:L1.A[1],r:RA*S1,al:k>=1?0:1}}
 return {x:0,y:0,r:0,al:0}}
function ballU(t){ // Europa's ocean
 if(t<UB[0]||t>=BACK[0]+.8)return {x:0,y:0,r:0,al:0};
 if(t<Z34[0])return {x:L3.B[0],y:L3.B[1],r:RU*S3*Math.cbrt(odr(t)),al:1};
 if(t<BACK[0]){const k=eio((t-Z34[0])/(Z34[1]-Z34[0]));return {x:lerp(L3.B[0],L4.B[0],k),y:lerp(L3.B[1],L4.B[1],k),r:RU*lg(S3,S4,k),al:1}}
 const k=ein((t-BACK[0])/.8);return {x:L4.B[0],y:L4.B[1],r:RU*S4*(1-k),al:k<1?1:0}}
function ballsE(t){ // two Earth-ocean balls, act 3b
 if(t<AIN[0]||t>=BACK[0]+.8)return [];const k=eout((t-AIN[0])/(AIN[1]-AIN[0]));const s=t<BACK[0]?1:1-ein((t-BACK[0])/.8);
 return [{x:L4.A1[0],y:lerp(H+200,L4.A1[1],k),r:RA*S4*s,al:1},{x:L4.A2[0],y:lerp(H+200+90,L4.A2[1],eout((t-AIN[0]-.15)/(AIN[1]-AIN[0]))),r:RA*S4*s,al:1}]}
function layout(t){const e=earth(t),u=europa(t),a=ballA(t),b=ballU(t),es=ballsE(t);
 // slots: 0 earth, 1 europa, 2 ballA / first earth ball, 3 ballU, 4 second earth ball
 const s2=es.length?es[0]:a,s4=es.length?es[1]:{x:0,y:0,r:0,al:0};
 return [Object.assign({ty:0},e),Object.assign({ty:1,al:1},u),Object.assign({ty:2},s2),Object.assign({ty:2},b),Object.assign({ty:2},s4)]}
const SUN=(()=>{const v=[-.50,.40,.77];const l=Math.hypot(...v);return v.map(a=>a/l)})();
gl.uniform3fv(U('SUN'),SUN);gl.uniform2f(U('R'),W,H);gl.uniform3fv(U('E0'),CUTE[0]);gl.uniform3fv(U('E1'),CUTE[1]);gl.uniform3fv(U('E2'),CUTE[2]);
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=14;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04,a:alpha});}
const LX=60,LW=840;
function fitSize(lines,size,weight){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>LW?Math.floor(size*LW/mw):size}
function win(t,a,b,fi,fo){if(t<a||t>=b)return 0;return Math.min(a<=0?1:ease((t-a)/(fi||.35)),b>=D?1:ease((b-t)/(fo||.3)))}
function card(lines,t,a,b,size){const al=win(t,a,b);if(al<=0)return;const fi=a<=0?1:ease((t-a)/.35);
 const main=fitSize(lines.map(l=>l[0]),size);let y=342+(1-fi)*24;
 for(const l of lines){txt(l[0],LX,y+main*.74,main,'left',l[1]||'#fff',al,900);y+=main*1.18}}
const Y='#ffd98a',BL='#9fd0ff',IC='#e6f2ff';
const HOOK=[['MORE WATER'],['THAN EARTH?',Y]];
const CARDS=[
 [0,3.9,HOOK,96],[D-.6,D,HOOK,96],
 [4.0,9.6,[["PUT ALL OF EARTH'S"],['OCEANS IN ONE BALL',BL]],76],
 [9.7,12.2,[['NOW LOOK'],['INSIDE EUROPA',Y]],84],
 [12.3,19.6,[['UNDER ITS ICE:'],['A HIDDEN OCEAN',BL]],80],
 [19.7,25.3,[["EUROPA'S OCEAN"],['IN ONE BALL',BL]],80],
 [25.4,31.6,[['ABOUT TWICE'],["EARTH'S OCEANS",Y]],84],
 [31.7,34.8,[['ON A MOON ONLY'],["1/4 EARTH'S WIDTH",Y]],80],
 [34.9,D-.65,[["NASA'S EUROPA CLIPPER"],['ARRIVES IN 2030',Y]],72]];
function labels(t,L){
 // act 1 names (also during the loop return)
 const a1=t<Z12[0]?(t<9.5?1:1-ease((t-9.5)/.4)):ease((t-BACK[1]+.2)/.4);
 if(a1>0){txt('EARTH',72,770,40,'left','#fff',a1,900);txt('EUROPA',728,690,40,'right','#fff',a1,900);txt('MOON OF JUPITER',728,728,26,'right','#b9c6e6',a1,800)}
 const aa=win(t,7.0,9.8,.35,.3);if(aa>0)txt('1,370 km',L[2].x,L[2].y+L[2].r+44,30,'center',BL,aa,800);
 // push-in layer labels
 const pl=win(t,16.0,19.2,.35,.3);if(pl>0){const u=L[1];
  const P=f=>[u.x+EDGE.sx*u.r*f,u.y+EDGE.sy*u.r*f];window.LAYERPTS=[P(.9936),P(.955)];
  const pi=P(.9936),po=P(.955);
  leader(pi,[pi[0]-40,pi[1]-150],pl,IC);txt('ICE SHELL',pi[0]-40,pi[1]-200,44,'right',IC,pl,900);txt('15-25 km THICK',pi[0]-40,pi[1]-160,32,'right','#cfd8ea',pl,800);
  leader(po,[po[0]+70,po[1]-140],pl,BL);txt('OCEAN',po[0]+60,po[1]-190,44,'left',BL,pl,900);txt('60-150 km DEEP',po[0]+60,po[1]-150,32,'left','#cfd8ea',pl,800)}
 // act 3a: ball size
 const ab=win(t,23.9,26.2,.35,.3);if(ab>0)txt('≈ 1,720 km',L[3].x,L[3].y+L[3].r+46,32,'center',BL,ab,800);
 // act 3b: equation
 const ae=win(t,27.4,31.1,.4,.3);if(ae>0){const b=L[3];txt("EUROPA'S",b.x+b.r+22,b.y-6,32,'left','#fff',ae,900);txt('OCEAN',b.x+b.r+22,b.y+34,32,'left','#fff',ae,900);
  txt('=',540,1050,56,'center','#fff',ae,900);txt('+',540,1210,56,'center','#fff',ae,900);
  for(const k of [2,4]){const e=L[k];txt("EARTH'S OCEANS",e.x,e.y+e.r+42,28,'center',BL,ae,800)}}}
function leader(p,q,a,col){x.save();x.globalAlpha=a*.9;x.strokeStyle=col;x.lineWidth=3;x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=6;
 x.beginPath();x.moveTo(q[0],q[1]);x.lineTo(p[0],p[1]);x.stroke();x.fillStyle=col;x.beginPath();x.arc(p[0],p[1],5,0,7);x.fill();x.restore()}
const TP=2*Math.PI/D;
function bodiesU(t){const L=layout(t);const sp=new Float32Array(20),spin=new Float32Array(5),al=new Float32Array(5),ty=new Float32Array(5);
 L.forEach((b,k)=>{sp.set([b.x,b.y,0,b.r],4*k);spin[k]=[2.2,1.0,0,.7,1.6][k]+TP*t;al[k]=b.r>0.3?b.al:0;ty[k]=b.ty});return {sp,spin,al,ty,L}}
function shade(t){const b=bodiesU(t);gl.viewport(0,0,W,H);gl.uniform1f(U('T'),t);
 gl.uniform4fv(U('SP'),b.sp);gl.uniform1fv(U('SPIN'),b.spin);gl.uniform1fv(U('AL'),b.al);gl.uniform1fv(U('TY'),b.ty);
 gl.uniform1f(U('EDR'),edr(t));gl.uniform1f(U('ODR'),odr(t));
 const ca=cutA(t);gl.uniform1f(U('CUTA'),ca);gl.uniform1f(U('CUTON'),ca<.999?1:0);gl.drawArrays(gl.TRIANGLES,0,3);}
function speed(t){const a=layout(t),b=layout(t+1/30);let m=0;for(let k=0;k<5;k++){if(a[k].r<=0&&b[k].r<=0)continue;m=Math.max(m,Math.abs(b[k].x-a[k].x)+Math.abs(b[k].y-a[k].y)+Math.abs(b[k].r-a[k].r))}return m}
function scene(t){const n=Math.max(1,Math.min(16,Math.ceil(Math.max(speed(t),speed(t-1/30))/2.5)));
 for(let i=0;i<n;i++){const ts=t+(i-(n-1)/2)/(30*n);shade(ts);x.globalAlpha=1/(i+1);x.drawImage(g,0,0)}x.globalAlpha=1;
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(36px)';x.globalAlpha=.18;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.48,H*.3,W/2,H*.48,H*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
function overlay(t){const L=layout(t);labels(t,L);for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3])}
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t)}
window.draw=frame;window.frameOverlay=t=>{BB=[];overlay(t)};
window.GEOM=t=>layout(t).filter(b=>b.r>0.3&&b.al>0);
window.MODEL={RA,RU,dA:2*RA,dU:2*RU,S1,S2,S3,S4,EDGE,CUTE,europaPx:{a1:REU*S1,a2:REU*S2},ballPx:{a1:RA*S1,a3:RU*S3,a4u:RU*S4,a4e:RA*S4}};
