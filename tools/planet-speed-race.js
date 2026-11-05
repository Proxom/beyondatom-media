// planet-speed-race: the 8 planets in lanes, each moving at its true MEAN ORBITAL SPEED (to scale); planet sizes NOT to scale.
// Source: NASA NSSDC Planetary Fact Sheet (orbital velocity km/s: 47.4 35.0 29.8 24.1 13.1 9.7 6.8 5.4); Earth fact sheet 29.78 km/s.
const D=36.0;
const VE=29.78;                                   // Earth mean orbital velocity, km/s (NSSDC Earth fact sheet)
const XG=250,LW_=980;                             // track gate x and wrap length (x runs XG .. XG+LW_)
const TJ0=7.75,TJ1=35.5;                         // hook Earth joins its lane at TJ0 and leaves it again at TJ1
const KPX=9*LW_/(VE*(TJ1-TJ0));                  // px per second per (km/s): Earth's lane x is the same at TJ0 and TJ1 (9 wraps) -> seamless loop
const Y0=640,DY=100;
const HOOKY=1010,HOOKR=82,TSH=7.4,TSHD=.7;              // Earth starts big in the middle, then shrinks into its lane
// name, km/s, shader type, slot, radius px (not to scale), label colour
const PL=[['MERCURY',47.4,6,2,24,'#d8cfc6'],['VENUS',35.0,7,3,34,'#f3dca8'],['EARTH',VE,0,0,35,'#9fc4ff'],['MARS',24.1,5,5,29,'#ffab84'],
 ['JUPITER',13.1,1,6,46,'#f0d6b4'],['SATURN',9.7,2,4,36,'#f2e0b0'],['URANUS',6.8,3,7,38,'#a8eef2'],['NEPTUNE',5.4,8,8,37,'#8fb4ff']];
const P=PL.map((p,i)=>({name:p[0],v:p[1],ty:p[2],slot:p[3],r:p[4],col:p[5],y:Y0+i*DY,i,rOut:p[3]===4?2.27*p[4]:p[4]}));
const EARTH=P[2];
const TGO=8.0,TOUT0=34.3,TOUT=.7;               // the other 7 leave the gate together at TGO; fade out for the loop
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)};
const SE0=((350-VE*KPX*TJ0)%LW_+LW_)%LW_;       // lane x = XG+350 = 600 at TJ0 (and TJ1)
const HX=t=>t<20?520+120*cl(t/TSH):520;          // hook Earth drifts slowly; the camera tracks it (speed shown by passing dust)
function shk(t){const u=ease((t-TSH)/TSHD);const v=ease((t-D+.9)/.8);return Math.max(0,u-v)}   // 0 = big hook Earth, 1 = lane Earth
function rOf(p,t){return p===EARTH?HOOKR+(p.r-HOOKR)*shk(t):p.r}
function yOf(p,t){return p===EARTH?HOOKY+(p.y-HOOKY)*shk(t):p.y}
function sOf(p,t){return p===EARTH?SE0+p.v*KPX*t:(t<TGO?-1:p.v*KPX*(t-TGO))}
function laneX(p,t){const s=sOf(p,t);if(s<0)return -999;return XG+(((s%LW_)+LW_)%LW_)}
function xOf(p,t){const lx=laneX(p,t);if(p!==EARTH)return lx;const k=shk(t);return k>=1?lx:HX(t)+(lx-HX(t))*k}
function lapOf(p,t){const s=sOf(p,t);return s<0?-1:Math.floor(s/LW_)}
function gateA(p,x,t){return ease((x-(XG+(p===EARTH?rOf(p,t):p.rOut)))/70)}
function presence(p,t){if(p===EARTH)return 1;if(t<TGO)return 0;return 1-ease((t-TOUT0)/TOUT)}
function alphaOf(p,t){const x=xOf(p,t);if(x<-100)return 0;if(p===EARTH&&shk(t)<1)return 1;return gateA(p,x,t)*presence(p,t)}
// time each launched planet becomes half visible (for sound)
window.MODEL={KPX,SHOW:P.filter(p=>p!==EARTH).map(p=>[p.name,+(TGO+(p.rOut+55)/(p.v*KPX)).toFixed(3),p.v]),
 earthKmAt1000:+(1000/VE).toFixed(3),earthWraps:VE*KPX*D/LW_,mercuryPxPerFrame:+(47.4*KPX/30).toFixed(2)};
const SUN=(()=>{const v=[-.22,.32,.92];const l=Math.hypot(...v);return v.map(a=>a/l)})();
const RA=20*Math.PI/180,RNV=[0,Math.cos(RA),Math.sin(RA)];
gl.uniform3fv(U('RN'),RNV);gl.uniform1f(U('ROUT'),P[5].rOut);gl.uniform3fv(U('SUN'),SUN);gl.uniform2f(U('R'),W,H);
const FNT='"DejaVu Sans",Arial,sans-serif';
let BB=[];window.BBOX=()=>BB;
function txt(s,px,py,size,align,col,alpha,weight){if(alpha<=0.01)return;x.save();x.globalAlpha=cl(alpha);x.font=(weight||800)+' '+size+'px '+FNT;x.textAlign=align||'left';
 const w=x.measureText(s).width;x.lineJoin='round';x.strokeStyle='rgba(0,0,0,.85)';x.lineWidth=Math.max(4,size*.13);x.strokeText(s,px,py);
 x.fillStyle=col||'#fff';x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=10;x.fillText(s,px,py);x.restore();
 const x0=align==='right'?px-w:align==='center'?px-w/2:px;BB.push({s,x0,x1:x0+w,y0:py-size*.74,y1:py+size*.04});}
const LX=60,LWID=860;
function fitSize(lines,size,weight){x.font=(weight||900)+' '+size+'px '+FNT;let mw=0;lines.forEach(l=>mw=Math.max(mw,x.measureText(l).width));return mw>LWID?Math.floor(size*LWID/mw):size}
function cardAlpha(t,a,b){const fi=a<=0?1:ease((t-a)/.35),fo=b>=D?1:ease((b-t)/.3);return t<a||t>=b?0:Math.min(fi,fo)}
function card(lines,t,a,b,size){const al=cardAlpha(t,a,b);if(al<=0)return;const fi=a<=0?1:ease((t-a)/.35);
 const main=fitSize(lines.filter(l=>!l[2]).map(l=>l[0]),size);
 let y=342+(1-fi)*20;for(const l of lines){const sz=l[2]?fitSize([l[0]],l[2]):main;txt(l[0],LX,y+sz*.74,sz,'left',l[1]||'#fff',al,900);y+=sz*1.18}}
const fmt=n=>Math.floor(n).toLocaleString('en-US');
const GOLD='#ffd98a';
const CARDS=[
 [0,3.6,[['EARTH CARRIES YOU'],['AROUND THE SUN AT'],['30 km PER SECOND',GOLD]],64],
 [35.3,D,[['EARTH CARRIES YOU'],['AROUND THE SUN AT'],['30 km PER SECOND',GOLD]],64],
 [7.4,10.6,[["BUT EARTH ISN'T"],['THE FASTEST',GOLD]],72],
 [10.6,14.6,[['MERCURY','#ffcf9e'],['47.4 km/s',GOLD],['OVER 170,000 km/h','#ffffff',46]],64],
 [14.6,18.8,[['NEPTUNE','#9fc0ff'],['ONLY 5.4 km/s',GOLD],['ALMOST 9 TIMES SLOWER THAN MERCURY','#ffffff',40]],64],
 [18.8,22.4,[['BUT EVEN NEPTUNE'],['DOES OVER',GOLD],['19,000 km/h',GOLD]],64],
 [22.4,26.0,[['WHY?'],["THE SUN'S PULL",GOLD],['IS STRONGER UP CLOSE',GOLD]],64],
 [26.0,30.6,[['SO INNER PLANETS'],['MUST MOVE FASTER',GOLD],['TO STAY IN ORBIT',GOLD]],64]];
function odo(t,a,b){const al=cardAlpha(t,a,b);if(al<=0)return;const fi=a<=0?1:ease((t-a)/.35);let y=342+(1-fi)*20;
 const km=VE*t;txt('SINCE THIS VIDEO STARTED,',LX,y+36*.74,36,'left','#b9c6e6',al,800);y+=36*1.25;
 txt('EARTH HAS MOVED',LX,y+64*.74,64,'left','#ffffff',al,900);y+=64*1.18;
 const big=km>=1000;txt(fmt(km)+' km',LX,y+76*.74,76,'left',big?'#7dffb0':GOLD,al,900);}
function hlLane(t){ // [lane index, colour, alpha]
 const L=[[0,10.6,14.6,'#ffcf9e'],[7,14.6,22.4,'#9fc0ff'],[2,30.6,35.1,'#9fc4ff']];
 const out=[];for(const l of L){const a=cardAlpha(t,l[1],l[2]);if(a>0)out.push([l[0],l[3],a])}return out}
function bodies(t){
 const sp=new Float32Array(36),ty=new Float32Array(9),spin=new Float32Array(9),al=new Float32Array(9);
 for(const p of P){const xx=xOf(p,t),a=alphaOf(p,t);sp.set([xx,yOf(p,t),0,a>0?rOf(p,t):0],4*p.slot);ty[p.slot]=p.ty;
  spin[p.slot]=p===EARTH?.9+2*Math.PI*2*t/D:(p.ty==1?.08:.05)*t+p.slot;al[p.slot]=a}
 return {sp,ty,spin,al}}
let SKYC=null;function skyCanvas(){if(SKYC)return SKYC;SKYC=document.createElement('canvas');SKYC.width=W;SKYC.height=H;
 gl.uniform1f(U('SKYON'),1);const z=new Float32Array(36);gl.uniform4fv(U('SP'),z);gl.uniform1fv(U('AL'),new Float32Array(9));gl.uniform1f(U('GUIDE'),0);gl.uniform4fv(U('HL'),[-1,0,0,0]);
 gl.viewport(0,0,W,H);gl.drawArrays(gl.TRIANGLES,0,3);SKYC.getContext('2d').drawImage(g,0,0);gl.uniform1f(U('SKYON'),0);return SKYC}
function shade(t){const b=bodies(t);gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(U('T'),t);
 gl.uniform4fv(U('SP'),b.sp);gl.uniform1fv(U('TY'),b.ty);gl.uniform1fv(U('SPIN'),b.spin);gl.uniform1fv(U('AL'),b.al);
 gl.uniform1f(U('GUIDE'),0);gl.uniform4fv(U('HL'),[-1,0,0,0]);
 gl.enable(gl.SCISSOR_TEST);for(const p of P){const k=p.slot;if(b.al[k]<=0)continue;const bx=b.sp[4*k],by=b.sp[4*k+1],br=(k===4?2.3*b.sp[4*k+3]:b.sp[4*k+3])+4;
  const x0=Math.max(0,Math.floor(bx-br)),x1=Math.min(W,Math.ceil(bx+br)),y0=Math.max(0,Math.floor(H-(by+br))),y1=Math.min(H,Math.ceil(H-(by-br)));if(x1<=x0||y1<=y0)continue;
  gl.scissor(x0,y0,x1-x0,y1-y0);gl.drawArrays(gl.TRIANGLES,0,3)}gl.disable(gl.SCISSOR_TEST);}
function speed(t){let m=0;for(const p of P){if(alphaOf(p,t)<=0&&alphaOf(p,t+1/30)<=0)continue;m=Math.max(m,p===EARTH&&shk(t)<1?Math.abs(xOf(p,t+1/30)-xOf(p,t)):p.v*KPX/30)}return m}
function scene(t){
 const n=Math.max(1,Math.min(8,Math.ceil(speed(t)/2.5)));
 const L=document.createElement('canvas');L.width=W;L.height=H;const lx=L.getContext('2d');
 for(let i=0;i<n;i++){const ts=t+(i-(n-1)/2)/(30*n)*1.0;shade(ts);lx.globalAlpha=1/n;lx.globalCompositeOperation='lighter';lx.drawImage(g,0,0)}
 x.globalAlpha=1;x.drawImage(skyCanvas(),0,0);x.drawImage(L,0,0);
 x.save();x.globalCompositeOperation='lighter';x.filter='blur(30px)';x.globalAlpha=.20;x.drawImage(c,0,0);x.restore();
 const vg=x.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=vg;x.fillRect(0,0,W,H);}
function sunGlow(t){const a=Math.min(ease((t-22.4)/.8),1-ease((t-29.8)/.8));if(a<=0)return;
 x.save();x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(W/2,-420,100,W/2,-420,1250);
 gr.addColorStop(0,'rgba(255,200,120,'+(.55*a)+')');gr.addColorStop(.45,'rgba(255,160,70,'+(.16*a)+')');gr.addColorStop(1,'rgba(255,140,60,0)');
 x.fillStyle=gr;x.fillRect(0,0,W,H);x.restore()}
function lanes(t){const hl=hlLane(t);x.save();
 for(let i=0;i<=8;i++){const y=Y0-DY/2+i*DY;const on=presence(P[0],t)*ease((t-TSH)/TSHD);
  if(on<=0)continue;x.globalAlpha=.16*on;x.strokeStyle='#9fb3e0';x.lineWidth=1.5;x.beginPath();x.moveTo(LX-12,y);x.lineTo(W,y);x.stroke()}
 // gate line
 x.globalAlpha=.25*presence(P[0],t)*ease((t-TSH)/TSHD);x.setLineDash([6,8]);x.beginPath();x.moveTo(XG,Y0-DY/2);x.lineTo(XG,Y0+7.5*DY);x.stroke();x.setLineDash([]);
 for(const h of hl){const y=Y0+h[0]*DY;x.globalAlpha=h[2]*.85;x.strokeStyle=h[1];x.lineWidth=3;x.shadowColor=h[1];x.shadowBlur=14;
  x.beginPath();x.roundRect(LX-14,y-DY/2+4,W-LX+40,DY-8,14);x.stroke()}
 x.restore()}
function trails(t){x.save();x.globalCompositeOperation='lighter';
 for(const p of P){let a=alphaOf(p,t);if(p===EARTH)a*=ease((shk(t)-.6)/.4);if(a<=0)continue;const xx=xOf(p,t);const pr=rOf(p,t),py=yOf(p,t);
  const len=Math.min(p.v*KPX*.30,2.2*pr);const x1=xx-pr*.92,x0=Math.max(XG+6,x1-len);if(x1-x0<4)continue;
  const gr=x.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,p.col+'00');gr.addColorStop(.75,p.col+'40');gr.addColorStop(1,p.col+'70');x.fillStyle=gr;
  const N=11;for(let k=0;k<N;k++){const u=(k/(N-1))*2-1;const hh=pr*.42;const wgt=Math.exp(-u*u*2.2);x.globalAlpha=a*.11*wgt;
   const yy=py+u*hh;const tail=x0+(x1-x0)*(.35*u*u);x.fillRect(tail,yy-hh/N,x1-tail,2*hh/N+.6)}}
 x.restore()}
// passing space dust while the camera tracks the big hook Earth (speeds chosen so the pattern repeats exactly at D)
const DUST=(()=>{const r=[];let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let i=0;i<140;i++){const k=5+Math.floor(rnd()*6);r.push({x0:rnd()*1120,y:330+rnd()*1100,v:k*1120/D,sz:.7+rnd()*1.3,a:.25+.5*rnd()})}return r})();
function dust(t){const f=1-shk(t);if(f<=0)return;x.save();x.globalCompositeOperation='lighter';x.strokeStyle='#cfe0ff';x.lineCap='round';
 for(const d of DUST){const xx=((d.x0-d.v*t)%1120+1120)%1120-20;const len=d.v/30*1.6;x.globalAlpha=f*d.a;x.lineWidth=d.sz;x.beginPath();x.moveTo(xx,d.y);x.lineTo(xx+len,d.y);x.stroke()}
 x.restore()}
function labels(t){for(const p of P){const a=p===EARTH?1:Math.min(ease((t-TGO)/.4),presence(p,t));if(a<=0)continue;
  const k=p===EARTH?1-shk(t):0,ly=yOf(p,t),s1=32+12*k,s2=28+10*k;txt(p.name,LX,ly-6-6*k,s1,'left',p.col,a,900);txt(p.v.toFixed(1)+' km/s',LX,ly+28+10*k,s2,'left',GOLD,a,800)}
 const fa=Math.min(ease((t-TGO-.4)/.4),presence(P[0],t));txt('SPEEDS TO SCALE · SIZES NOT TO SCALE',LX,1428,28,'left','#b9c6e6',fa*.9,700)}
function gatePanel(t){const a=presence(P[0],t)*ease((t-TSH)/TSHD);if(a<=0)return;x.save();const gr=x.createLinearGradient(0,0,XG+170,0);
 gr.addColorStop(0,'rgba(2,4,10,.82)');gr.addColorStop(.62,'rgba(2,4,10,.78)');gr.addColorStop(1,'rgba(2,4,10,0)');x.globalAlpha=a;x.fillStyle=gr;x.fillRect(0,Y0-DY/2,XG+170,8*DY);x.restore()}
function overlay(t){dust(t);trails(t);gatePanel(t);lanes(t);sunGlow(t);labels(t);
 for(const cd of CARDS)card(cd[2],t,cd[0],cd[1],cd[3]);odo(t,3.6,7.4);odo(t,30.6,35.1);}
function frameOverlay(t){BB=[];overlay(t)}window.frameOverlay=frameOverlay;
function frame(t){BB=[];x.globalCompositeOperation='source-over';x.globalAlpha=1;x.fillStyle='#000';x.fillRect(0,0,W,H);scene(t);overlay(t)}
function draw(t){frame(t)}
window.draw=draw;
window.GEOM=t=>P.filter(p=>alphaOf(p,t)>0).map(p=>({n:p.name,x:xOf(p,t),y:p.y,r:p.rOut}));
