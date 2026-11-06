// drive-to-moon: "How long to drive to the Moon?" at a steady 100 km/h, non-stop: Moon, then the Sun, then Proxima Centauri.
// Sources: NASA NSSDC Moon fact sheet (semimajor axis 0.3844e6 km; Moon/Earth radius 0.2727), NSSDC Earth fact sheet
// (semimajor axis 149.598e6 km), NASA Science "Voyager 1: What Is a Light-Day" (Proxima Centauri about 4.24 ly = 40.15 trillion km).
// Sizes of Earth and Moon are to scale with each other; distances are NOT to scale (labelled on screen).
const D=27.0,KMH=100,HY=24*365.25;
const T_MOON=384400/KMH/24;                 // 160.17 days
const T_SUN=149.598e6/KMH/HY;               // 170.66 years
const T_PROX=40.15e12/KMH/HY/1e6;           // 45.80 million years
window.MODEL={T_MOON,T_SUN,T_PROX};
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},lerp=(a,b,k)=>a+(b-a)*k;
// key states: [x,y,r,alpha] for Earth, Moon, Sun, Proxima
const SA={E:[430,1390,280,1],M:[800,760,76,1],S:[790,880,130,0],P:[790,880,14,0]};
const SB={E:[240,1330,34,1],M:[298,1302,9.3,1],S:[790,880,130,1],P:[790,880,14,0]};
const SC={E:[240,1330,34,0],M:[298,1302,9.3,0],S:[240,1330,16,1],P:[790,880,14,1]};
const TR=[[9.8,10.8,SA,SB],[18.4,19.4,SB,SC],[26.2,27.0,SC,SA]];
function st(t){let a=SA,b=SA,k=0;
 if(t<TR[0][0]){a=b=SA}else if(t<TR[0][1]){a=SA;b=SB;k=ease((t-TR[0][0])/1)}else if(t<TR[1][0]){a=b=SB}
 else if(t<TR[1][1]){a=SB;b=SC;k=ease((t-TR[1][0])/1)}else if(t<TR[2][0]){a=b=SC}else{a=SC;b=SA;k=ease((t-TR[2][0])/(TR[2][1]-TR[2][0]))}
 const o={};for(const n of 'EMSP'){o[n]=a[n].map((v,i)=>lerp(v,b[n][i],k))}
 if(a===SC&&b===SA){o.E[3]=ease(k*2.2);o.M[3]=ease(k*2.2);o.S=SC.S.slice();o.S[3]=1-ease(k*2.5);o.P=SC.P.slice();o.P[3]=1-ease(k*2.5)}  // home again for the loop
 return o}
// trips (constant speed: marker and counter move linearly)
const TRIPS=[{a:.2,b:7.0,from:'E',to:'M',tot:T_MOON,fmt:v=>{const n=Math.round(v);return n+(n===1?' DAY':' DAYS')},show:[[0,9.8],[26.6,D]]},
 {a:10.9,b:16.1,from:'E',to:'S',tot:T_SUN,fmt:v=>{const n=Math.round(v);return n+(n===1?' YEAR':' YEARS')},show:[[10.5,18.4]]},
 {a:19.5,b:24.6,from:'S',to:'P',tot:T_PROX,fmt:v=>v.toFixed(1)+' MILLION YEARS',show:[[19.1,26.2]]}];
function prog(tr,t){if(tr.from==='E'&&tr.to==='M'&&t>=TR[2][0])return 0;return cl((t-tr.a)/(tr.b-tr.a))}   // loop: back to day 0
function shownA(tr,t){let m=0;for(const s of tr.show){const fi=s[0]<=0?1:ease((t-s[0])/.4),fo=s[1]>=D?1:ease((s[1]-t)/.4);if(t>=s[0]&&t<s[1])m=Math.max(m,Math.min(fi,fo))}return m}
const SUNV=(()=>{const v=[.45,.42,.79];const l=Math.hypot(...v);return v.map(a=>a/l)})();
gl.uniform3fv(U('RN'),[0,1,0]);gl.uniform1f(U('ROUT'),1);gl.uniform3fv(U('SUN'),SUNV);gl.uniform2f(U('R'),W,H);
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.lineJoin='round';x.strokeStyle='rgba(0,0,0,.85)';x.lineWidth=Math.max(4,size*.13);x.strokeText(s,px,py);
 x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=10;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04});}
const LX=60,LWID=860,GOLD='#ffd98a';
function fitSize(lines,size,weight){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>LWID?Math.floor(size*LWID/mw):size}
function cardAlpha(t,a,b){const fi=a<=0?1:ease((t-a)/.35),fo=b>=D?1:ease((b-t)/.3);return t<a||t>=b?0:Math.min(fi,fo)}
function card(lines,t,a,b,size){const al=cardAlpha(t,a,b);if(al<=0)return;const fi=a<=0?1:ease((t-a)/.35);
 const main=fitSize(lines.filter(l=>!l[2]).map(l=>l[0]),size);
 let y=342+(1-fi)*20;for(const l of lines){const sz=l[2]?fitSize([l[0]],l[2]):main;txt(l[0],LX,y+sz*.74,sz,'left',l[1]||'#fff',al,900);y+=sz*1.18}}
const HOOK=[['HOW LONG TO'],['DRIVE TO THE MOON?',GOLD]];
const CARDS=[[0,7.2,HOOK,72],[26.4,D,HOOK,72],
 [7.2,9.8,[['ABOUT 160 DAYS',GOLD],['NON-STOP, DAY AND NIGHT','#ffffff',44]],80],
 [10.2,16.3,[['NOW DRIVE'],['TO THE SUN',GOLD]],72],
 [16.3,18.6,[['ABOUT 171 YEARS',GOLD],["AND THAT'S OUR NEAREST STAR",'#ffffff',44]],80],
 [19.0,24.7,[['THE NEXT'],['NEAREST STAR?',GOLD]],72],
 [24.7,26.4,[['ABOUT 46',GOLD],['MILLION YEARS',GOLD]],80]];
function counter(t){for(const tr of TRIPS){const al=shownA(tr,t);if(al<=0)continue;const v=tr.tot*prog(tr,t);
  txt('DRIVING AT 100 km/h',LX,560,36,'left','#b9c6e6',al,800);const cs=tr.fmt(v),csz=Math.min(76,fitSize([tr.fmt(tr.tot)],76)*780/860|0);txt(cs,LX,646,csz,'left',prog(tr,t)>=1?'#7dffb0':'#ffffff',al,900);
  txt('DISTANCES NOT TO SCALE',LX,706,26,'left','#8f9cc0',al*.9,700)}}
function edge(a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);return [dx/l,dy/l,l]}
function route(t,s){x.save();for(const tr of TRIPS){const al=shownA(tr,t);if(al<=0)continue;const A=s[tr.from],B=s[tr.to];const [ux,uy,l]=edge(A,B);
  const ra=tr.from==='S'?A[2]*1.4+10:A[2]+6,rb=tr.to==='S'?B[2]*1.15+10:tr.to==='P'?B[2]+18:B[2]+6;
  const x0=A[0]+ux*ra,y0=A[1]+uy*ra,x1=B[0]-ux*rb,y1=B[1]-uy*rb,p=prog(tr,t),xm=lerp(x0,x1,p),ym=lerp(y0,y1,p);
  x.globalAlpha=al*.45;x.strokeStyle='#9fb3e0';x.lineWidth=3;x.setLineDash([10,12]);x.beginPath();x.moveTo(xm,ym);x.lineTo(x1,y1);x.stroke();x.setLineDash([]);
  x.globalAlpha=al;x.strokeStyle=GOLD;x.lineWidth=5;x.shadowColor=GOLD;x.shadowBlur=16;x.lineCap='round';x.beginPath();x.moveTo(x0,y0);x.lineTo(xm,ym);x.stroke();
  x.shadowBlur=0;const g2=x.createRadialGradient(xm,ym,0,xm,ym,34);g2.addColorStop(0,'rgba(255,250,230,1)');g2.addColorStop(.25,'rgba(255,220,140,.85)');g2.addColorStop(1,'rgba(255,200,110,0)');
  x.globalCompositeOperation='lighter';x.fillStyle=g2;x.beginPath();x.arc(xm,ym,34,0,7);x.fill();x.globalCompositeOperation='source-over'}
 x.restore()}
function star(px,py,r,a,core,mid,glowK){if(a<=0)return;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=a;
 const R=r*glowK;const g2=x.createRadialGradient(px,py,0,px,py,R);g2.addColorStop(0,core);g2.addColorStop(r/R*.95,core);g2.addColorStop(Math.min(.99,r/R*1.25),mid);g2.addColorStop(1,'rgba(0,0,0,0)');
 x.fillStyle=g2;x.beginPath();x.arc(px,py,R,0,7);x.fill();x.restore()}
function sunDisc(s,t){const S=s.S;if(S[3]<=0)return;
 if(S[2]>40){x.save();x.globalAlpha=S[3];star(S[0],S[1],S[2],S[3]*.9,'rgba(255,214,140,.55)','rgba(255,150,60,.22)',3.2);
  const g2=x.createRadialGradient(S[0]-S[2]*.12,S[1]-S[2]*.12,0,S[0],S[1],S[2]);g2.addColorStop(0,'#fffbe8');g2.addColorStop(.55,'#ffe7a8');g2.addColorStop(.88,'#ffbf5e');g2.addColorStop(1,'#ff9a3c');
  x.fillStyle=g2;x.beginPath();x.arc(S[0],S[1],S[2],0,7);x.fill();
  // slow granulation shimmer
  x.globalCompositeOperation='overlay';for(let i=0;i<26;i++){const an=i*2.399+t*.05,rr=S[2]*Math.sqrt((i+.5)/26)*.92;x.globalAlpha=S[3]*.10;x.fillStyle=i%2?'#fff3c8':'#ff9a40';
   x.beginPath();x.arc(S[0]+Math.cos(an)*rr,S[1]+Math.sin(an)*rr,S[2]*.16,0,7);x.fill()}x.restore()}
 else{star(S[0],S[1],S[2]*.45,S[3],'rgba(255,250,225,1)','rgba(255,210,120,.5)',5)}}
function prox(s){const P=s.P;if(P[3]<=0)return;star(P[0],P[1],P[2]*.5,P[3],'rgba(255,220,200,1)','rgba(255,90,50,.55)',5.5)}
function labels(t,s){const aB=Math.min(ease((t-10.6)/.4),1-ease((t-18.4)/.4));if(aB>0){txt('EARTH',s.E[0],s.E[1]-s.E[2]-22,30,'center','#9fc4ff',aB,800);txt('SUN',s.S[0],s.S[1]+s.S[2]+48,34,'center','#ffd98a',aB,800)}
 const aC=Math.min(ease((t-19.3)/.4),1-ease((t-26.2)/.3));if(aC>0){txt('SUN',s.S[0],s.S[1]-38,30,'center','#ffd98a',aC,800);txt('PROXIMA CENTAURI',s.P[0]+130,s.P[1]-44,32,'right','#ffb59a',aC,800)}}
function bodies(t){const s=st(t);const sp=new Float32Array(36),ty=new Float32Array(9),spin=new Float32Array(9),al=new Float32Array(9);
 sp.set([s.E[0],s.E[1],0,s.E[3]>0?s.E[2]:0],0);ty[0]=0;spin[0]=.9+2*Math.PI*t/D;al[0]=s.E[3];
 sp.set([s.M[0],s.M[1],0,s.M[3]>0?s.M[2]:0],4);ty[1]=4;spin[1]=2.2;al[1]=s.M[3];return {sp,ty,spin,al}}
let SKYC=null;function skyCanvas(){if(SKYC)return SKYC;SKYC=document.createElement('canvas');SKYC.width=W;SKYC.height=H;
 gl.uniform1f(U('SKYON'),1);const z=new Float32Array(36);gl.uniform4fv(U('SP'),z);gl.uniform1fv(U('AL'),new Float32Array(9));gl.uniform1f(U('GUIDE'),0);gl.uniform4fv(U('HL'),[-1,0,0,0]);
 gl.viewport(0,0,W,H);gl.drawArrays(gl.TRIANGLES,0,3);SKYC.getContext('2d').drawImage(g,0,0);gl.uniform1f(U('SKYON'),0);return SKYC}
function shade(t){const b=bodies(t);gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(U('T'),t);
 gl.uniform4fv(U('SP'),b.sp);gl.uniform1fv(U('TY'),b.ty);gl.uniform1fv(U('SPIN'),b.spin);gl.uniform1fv(U('AL'),b.al);gl.uniform1f(U('GUIDE'),0);gl.uniform4fv(U('HL'),[-1,0,0,0]);
 gl.enable(gl.SCISSOR_TEST);for(const k of [0,1]){if(b.al[k]<=0||b.sp[4*k+3]<=0)continue;const bx=b.sp[4*k],by=b.sp[4*k+1],br=b.sp[4*k+3]+4;
  const x0=Math.max(0,Math.floor(bx-br)),x1=Math.min(W,Math.ceil(bx+br)),y0=Math.max(0,Math.floor(H-(by+br))),y1=Math.min(H,Math.ceil(H-(by-br)));if(x1<=x0||y1<=y0)continue;
  gl.scissor(x0,y0,x1-x0,y1-y0);gl.drawArrays(gl.TRIANGLES,0,3)}gl.disable(gl.SCISSOR_TEST)}
function moving(t){const a=st(t).E,b=st(t+1/30).E;return Math.abs(b[2]-a[2])+Math.hypot(b[0]-a[0],b[1]-a[1])}
function scene(t){const n=Math.max(1,Math.min(6,Math.ceil(moving(t)/3)));
 const L=document.createElement('canvas');L.width=W;L.height=H;const lx=L.getContext('2d');
 for(let i=0;i<n;i++){const ts=t+(i-(n-1)/2)/(30*n);shade(ts);lx.globalAlpha=1/n;lx.globalCompositeOperation='lighter';lx.drawImage(g,0,0)}
 x.globalAlpha=1;x.drawImage(skyCanvas(),0,0);const s=st(t);sunDisc(s,t);prox(s);x.drawImage(L,0,0);
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(30px)';x.globalAlpha=.18;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
function overlay(t){const s=st(t);route(t,s);labels(t,s);for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);counter(t)}
function frameOverlay(t){BB=[];overlay(t)}window.frameOverlay=frameOverlay;
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t)}
function draw(t){frame(t)}
window.draw=draw;
