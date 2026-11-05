// sun-109-earths: how many Earths fit across the Sun? One km scale (NSSDC: Sun 695,700 km, Earth 6,371 km mean radius -> 109.2).
// World units = Earth radii (y up, Sun centre at 0,0). Earth k of the row sits at X0+2k (k=0..108), 20 R_E in front of the Sun.
const D=31.5,RS=109.2,X0=-108.2,ZE=8,AY=1040;            // AY = screen y of the row / Sun centre
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const eout=t=>{t=cl(t);return 1-Math.pow(1-t,3)};
// row count CR(t): keyframes (monotone cubic) - slow first Earths, then faster; halfway at 8.0 s, all 109 at 11.2 s
const KF=[[1.2,0],[1.7,1],[2.3,2],[2.85,3],[3.4,4.6],[4.2,8.4],[5.2,16.5],[6.5,31],[8.0,54.6],[9.6,81],[10.6,98],[11.2,108.8]];
function mono(kf,t){if(t<=kf[0][0])return kf[0][1];const n=kf.length;if(t>=kf[n-1][0])return kf[n-1][1];
 const d=[];for(let i=0;i<n-1;i++)d.push((kf[i+1][1]-kf[i][1])/(kf[i+1][0]-kf[i][0]));
 const m=[d[0]];for(let i=1;i<n-1;i++)m.push(d[i-1]*d[i]<=0?0:2/(1/d[i-1]+1/d[i]));m.push(0);m[0]=0;   // start and end at rest (no camera jolt)
 let i=0;while(t>kf[i+1][0])i++;const h=kf[i+1][0]-kf[i][0],s=(t-kf[i][0])/h,s2=s*s,s3=s2*s;
 return (2*s3-3*s2+1)*kf[i][1]+(s3-2*s2+s)*h*m[i]+(-2*s3+3*s2)*kf[i+1][1]+(s3-s2)*h*m[i+1];}
const CRf=t=>t<27?mono(KF,t):108.8;
const T_ALL=11.2,T_HALF=8.1,F0=21.4,F1=23.6;   // fill spreads 21.4-23.6 s (after the push-in starts)
// column: grows from the centre outward (both ways) 15.2 -> 17.4 s
const C0=15.2,C1=17.4;const CCf=t=>t<C0?0:t<27?108*ease((t-C0)/(C1-C0))+.8*cl((t-C1)/.3):108.8;
// loop exit: row k>=1 and column fade 27.0-27.6, camera zooms back 27.4-30.8, Earth 0 slides out 30.5-31.5
const RAf=t=>t<27?1:1-ease((t-27)/.6);
const E0_OUT=-110.5,E0_IN=X0;
const E0Xf=t=>t<1.0?E0_OUT+(E0_IN-E0_OUT)*eio(t/1.0):t<30.5?E0_IN:E0_IN+(E0_OUT-E0_IN)*eio((t-30.5)/1.0);
// camera: fit [Sun left limb - margin, newest Earth + margin] into 940 px; same function for the zoom back
function camFor(cr){const left=-RS-2.6,right=X0+2*Math.max(cr,0)+1+2.6;const s=Math.min(150,940/(right-left));return{cx:(left+right)/2,s}}
function camCR(t){return t<27.4?CRf(t):108.8*(1-eio((t-27.4)/3.4))}
const ZM=t=>t<11.2?1:t<27.4?1+.04*ease((t-11.2)/15.8):1+.04*(1-eio((t-27.4)/3.4));
function camA(t){const c=camFor(camCR(t));const z=ZM(t);return{cx:c.cx/z,cy:0,s:c.s*z}} // push-in about the Sun centre once the whole Sun is in view
const P0=20.5,P1=22.6,BK=2.7,BCX=-70;          // push-in onto the left half for the fill (Earths ~24 px wide)
const lerpCam=(a,b,e)=>({cx:a.cx+(b.cx-a.cx)*e,cy:a.cy+(b.cy-a.cy)*e,s:Math.exp(Math.log(a.s)+(Math.log(b.s)-Math.log(a.s))*e)});
function camB(t){const a=camA(P0);return{cx:BCX,cy:0,s:a.s*BK*(1+.025*cl((t-P1)/(27.4-P1)))}}
function cam(t){if(t<P0)return camA(t);if(t<P1)return lerpCam(camA(P0),camB(P1),eio((t-P0)/(P1-P0)));if(t<27.4)return camB(t);
 // return to the opening: zoom about Earth 0 so it stays on screen the whole way (its screen x moves smoothly to the opening spot)
 const o=camFor(0),b=camB(27.4),e=eio((t-27.4)/3.4);const s=Math.exp(Math.log(b.s)+(Math.log(o.s)-Math.log(b.s))*e);
 const sxB=540+(X0-b.cx)*b.s,sxO=540+(X0-o.cx)*o.s;const sx=sxB+(sxO-sxB)*e;return{cx:X0-(sx-540)/s,cy:0,s}}
const CX=495;const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.fillStyle=col||'#fff';x.lineJoin='round';x.lineWidth=Math.max(5,size*.13);x.strokeStyle='rgba(8,5,3,.88)';x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=14;x.strokeText(s,px,py);x.shadowBlur=0;x.fillText(s,px,py);x.shadowBlur=6;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04});}
function pill(s,px,py,size,col,al){if(al<=.01)return;x.save();x.font='800 '+size+'px '+FNT;const w=x.measureText(s).width;const pw=w+size*.9,ph=size*1.45;
 x.globalAlpha=cl(al)*.72;x.fillStyle='#05060b';x.beginPath();x.roundRect(px-pw/2,py-ph*.72,pw,ph,ph/2);x.fill();x.restore();txt(s,px,py,size,'center',col,al,800);
 BB.push({s:'pill:'+s,x0:px-pw/2,x1:px+pw/2,y0:py-ph*.72,y1:py+ph*.28,pill:1});}
const win=(t,a,b,fi=.3,fo=.3)=>t<a||t>=b?0:Math.min(fi<=0?1:ease((t-a)/fi),fo<=0?1:ease((b-t)/fo));
const fmt=n=>Math.round(n).toLocaleString('en-US');
function scrim(a){if(a<=.01)return;x.save();x.translate(CX,415);x.scale(1,.42);const gr=x.createRadialGradient(0,0,0,0,0,560);
 gr.addColorStop(0,'rgba(0,0,0,'+(.55*a)+')');gr.addColorStop(.6,'rgba(0,0,0,'+(.38*a)+')');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(-600,-600,1200,1200);x.restore();}
const w2s=(c,wx,wy)=>[540+(wx-c.cx)*c.s,AY-(wy-c.cy)*c.s];
function shown(t){return t<1.2?1:1+cl(Math.floor(CRf(t)-.4),0,108)}  // Earths fully placed (Earth 0 included)
window.MODEL={T_ALL,T_HALF,C0,C1,D,ratio:695700/6371,vol:Math.pow(695700/6371,3),
 earthT:Array.from({length:109},(_,k)=>{if(k==0)return 1.0;let a=1.2,b=11.2;for(let i=0;i<50;i++){const m=(a+b)/2;if(CRf(m)-.4>=k)b=m;else a=m}return +b.toFixed(3)})};
function frame(t){BB=[];const c=cam(t);
 gl.uniform3f(U('CAM'),c.cx,c.cy,c.s);gl.uniform1f(U('CR'),CRf(t));gl.uniform1f(U('CC'),CCf(t));gl.uniform1f(U('E0X'),E0Xf(t));
 gl.uniform1f(U('RA'),RAf(t));gl.uniform1f(U('CA'),RAf(t));gl.uniform1f(U('ZE'),ZE);gl.uniform1f(U('LOD'),1);gl.uniform1f(U('GLOW'),cl((24-c.s)/16));gl.uniform1f(U('FR'),t<F0?0:(RS+10)*eio((t-F0)/(F1-F0)));gl.uniform1f(U('FA'),RAf(t));gl.uniform1f(U('SOFT'),1+.7*ease((t-20.4)/1.0)*(1-ease((t-27.0)/.6)));
 gl.uniform1f(U('SRR'),2*Math.PI*t/D);gl.uniform1f(U('T'),4*Math.sin(2*Math.PI*t/D));
 gl.drawArrays(gl.TRIANGLES,0,3);x.clearRect(0,0,W,H);x.drawImage(g,0,0);
 // the camera anchor is y=AY: shader uses 1000 -> shift the GL image so world y=0 lands on AY
 const [ex,ey]=w2s(c,E0Xf(t),0);const er=c.s;
 // hook (0-2.9 s, and again at the loop end)
 const hk=Math.max(win(t,-1,2.1,0,.25),win(t,29.6,D+1,.5,0));
 txt('HOW MANY EARTHS',CX,382,68,'center','#fff',hk,900);txt('FIT ACROSS THE SUN?',CX,468,68,'center','#ffd27a',hk,900);
 // labels from frame 0 (Earth, Sun) while the Earth is big
 const lab=Math.max(win(t,-1,2.6,0,.4),win(t,29.4,D+1,.6,0));
 if(lab>0){const ly=ey+er+70;pill('EARTH',Math.max(ex,180),ly,46,'#bfe0ff',lab);
  const [sx]=w2s(c,-RS,0);pill('SUN',Math.min(860,sx+(W-sx)/2+40),ey-er-120,46,'#ffd27a',lab*cl((W-sx-200)/200));}
 // counter
 const ca=win(t,2.1,15.0,.25,.35);if(ca>0){const n=shown(t);
  txt('EARTHS ACROSS',CX,360,46,'center','#bfe0ff',ca,800);txt(String(n),CX,488,118,'center',n>=109?'#ffd27a':'#fff',ca,900);}
 // halfway tag at the row centre
 const hw=win(t,T_HALF,10.3,.25,.3);if(hw>0){const [hx,hy]=w2s(c,X0+108,0);const px2=Math.min(hx,770);pill('HALFWAY',px2,hy-100,44,'#fff',hw);
  x.save();x.globalAlpha=hw;x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=3;x.beginPath();x.moveTo(px2,hy-72);x.lineTo(hx,hy-10);x.stroke();x.restore();}
 // full width facts
 const fw=win(t,11.6,15.0,.35,.35);if(fw>0){const [lx]=w2s(c,-RS,0),[rx]=w2s(c,RS,0);
  x.save();x.globalAlpha=fw;x.strokeStyle='rgba(255,230,170,.95)';x.lineWidth=3;x.setLineDash([10,9]);
  for(const xx of [lx,rx]){x.beginPath();x.moveTo(xx,AY+18);x.lineTo(xx,AY+175);x.stroke();}x.setLineDash([]);
  x.beginPath();x.moveTo(lx,AY+150);x.lineTo(rx,AY+150);x.stroke();x.restore();
  pill('SUN: 1,391,400 KM WIDE',CX,AY+228,40,'#ffd27a',fw);pill('EARTH: 12,742 KM',CX,AY+300,40,'#bfe0ff',ease((t-12.1)/.35)*fw);}
 // volume beat
 const v1=win(t,15.0,18.0,.3,.3);txt("IT'S A BALL, SO IT'S",CX,370,58,'center','#fff',v1,900);txt('ALSO 109 TALL',CX,452,58,'center','#ffd27a',v1*ease((t-16.2)/.3),900);
 const v2=win(t,18.0,20.4,.3,.3);txt('VOLUME GROWS WITH',CX,370,56,'center','#fff',v2,900);txt('109 × 109 × 109',CX,456,66,'center','#ffd27a',v2,900);
 const v3=win(t,20.4,27.2,.35,.4);if(v3>.01){x.save();x.globalAlpha=v3*.62;x.fillStyle='#07070c';x.beginPath();x.roundRect(CX-410,312,820,184,34);x.fill();x.restore();}txt('ITS VOLUME: ABOUT',CX,380,58,'center','#fff',v3,900);txt('1.3 MILLION EARTHS',CX,466,66,'center','#ffd27a',v3*ease((t-20.7)/.35),900);
 pill('ONE LAYER: ABOUT 9,200 EARTHS',CX,1372,36,'#fff',win(t,23.9,27.0,.35,.35));
 // "1 Earth" marker on Earth 0 (scale reference) during the volume card
 const m1=win(t,23.4,27.0,.35,.35);if(m1>0){const rr=Math.max(er*1.9,15);x.save();x.globalAlpha=m1;x.strokeStyle='#bfe0ff';x.lineWidth=3;
  x.beginPath();x.arc(ex,ey,rr,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(ex-rr*.7,ey-rr*.7);x.lineTo(Math.max(ex-46,185),ey-96);x.stroke();x.restore();
  pill('1 EARTH',Math.max(ex-46,185),ey-122,40,'#bfe0ff',m1);}
}
function draw(t){frame(t)}
