const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
const TILT=23.44,YAW=150,LON=Math.PI; // texture longitude 0 (Greenwich): London at 51.5 N
// sidereal day mapped to 10 s on screen: 3 whole turns in 30 s, so the loop is seamless
// constant spin: exactly 2 turns in 30 s (seamless loop); phase chosen so London is on the lit, visible side during the London beat
const PH0=0.55; // phase (turns)
const SPIN=t=>-(2*t/30+PH0)*2*Math.PI; // negative = west-to-east as seen with north up
function distAt(t){return t<20.5?3.05:t<22.5?lerp(3.05,7.2,eio((t-20.5)/2)):t<26.6?7.2:lerp(7.2,3.05,eio((t-26.6)/2.2))}
function speedAt(t){
 if(t<15.8)return 1674;if(t<16.3)return lerp(1674,1042,eio((t-15.8)/.5));if(t<20.6)return 1042;
 if(t<22.5)return lerp(1042,107000,Math.pow(cl((t-20.6)/1.9),2.2));if(t<26.6)return 107000;
 return lerp(107000,1674,eio((t-26.6)/1.2));}
function wv(M,v){return [M[0]*v[0]+M[1]*v[1]+M[2]*v[2],M[3]*v[0]+M[4]*v[1]+M[5]*v[2],M[6]*v[0]+M[7]*v[1]+M[8]*v[2]]}
const SUNN=(()=>{const v=[-1,0.15,0.55];const L=Math.hypot(...v);return v.map(a=>a/L)})();
function lf(p,eye){const L=Math.hypot(...p);const n=p.map(v=>v/L);const e=[eye[0]-p[0],eye[1]-p[1],eye[2]-p[2]];const le=Math.hypot(...e);
 const mu=(n[0]*e[0]+n[1]*e[1]+n[2]*e[2])/le;const sl=n[0]*SUNN[0]+n[1]*SUNN[1]+n[2]*SUNN[2];
 return cl((mu-0.12)/0.2)*cl((sl-0.05)/0.2);}
const st0=t=>t<20.8?0:t<22.6?ease((t-20.8)/1.8):t<26.4?1:1-ease((t-26.4)/.8);
SC={D:30,
 scene(t){
  const d=distAt(t);const az=0.08*Math.sin(2*Math.PI*t/30);
  const eye=[d*Math.sin(az)+0.012*Math.sin(2*Math.PI*t/15),0.25+0.012*Math.sin(2*Math.PI*t/10),d*Math.cos(az)];
  return {eye,tgt:[0,0.22*d/3.05,0],fov:.9,sun:[-1,0.15,0.55],
   p:{c:[0,0,0],r:1,ty:0,tilt:TILT,yaw:YAW,spin:SPIN(t)},ring:{n:[0,1,0],a:0},axis:0,expo:1.15};},
 cards:[
  [0,3.5,[["EARTH'S EQUATOR",'#fff'],['SPINS AT','#fff'],['1,674 km/h','#7fd4ff']],116],
  [3.5,8,['One full turn:',['23 h 56 min','#7fd4ff']],104],
  [8,12,['Around the equator:',['40,075 km','#7fd4ff']],100],
  [12,16,['40,075 km ÷ 23.934 h',['≈ 1,674 km/h','#7fd4ff']],96],
  [16,20.0,['London, 51.5° N:',['1,042 km/h','#ffd36b']],96],
  [20.0,22.6,['And around','the Sun?'],104],
  [22.6,26.6,['Around the Sun:',['107,000 km/h','#ff9d6b']],100],
  [26.6,30.01,[["EARTH'S EQUATOR",'#fff'],['SPINS AT','#fff'],['1,674 km/h','#7fd4ff']],116]],
 overlay(t){
  const s=SC.scene(t);const M=tiltM(TILT,YAW);const sp=SPIN(t),ca=Math.cos(sp),sa=Math.sin(sp);
  const toW=l=>wv(M,l);const eye=s.eye;
  const vis=p=>{const n=p;const e=[eye[0]-p[0],eye[1]-p[1],eye[2]-p[2]];return n[0]*e[0]+n[1]*e[1]+n[2]*e[2]>0.02};
  // equator ring (front half) during the equator beats
  const ea=t<7.6?0:t<8.2?ease((t-7.6)/.6):t<16?1:t<16.6?1-ease((t-16)/.6):0;
  if(ea>0){x.save();x.globalAlpha=ea;x.strokeStyle='rgba(127,212,255,.9)';x.lineWidth=5;x.shadowColor='#7fd4ff';x.shadowBlur=16;x.beginPath();let on=false;
   for(let i=0;i<=240;i++){const a=i/240*2*Math.PI;const p=toW([Math.cos(a)*1.004,0,Math.sin(a)*1.004]);if(vis(p)){const q=proj(p);on?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);on=true}else on=false;}
   x.stroke();x.restore();}
  // a point fixed on the ground at the equator (or at 51.5 N) that rides the spin
  const lat=t<15.8?0:t<16.3?lerp(0,51.5,eio((t-15.8)/.5)):51.5;const la=lat*Math.PI/180;
  const da=t<3.5?ease((t-0.2)/.5):t<20.0?1:t<20.6?1-ease((t-20.0)/.6):0;
  if(da>0){for(let k=0;k<14;k++){const sk=SPIN(t-k*0.035);const c2=Math.cos(sk),s2=Math.sin(sk);const q0=[Math.cos(la)*Math.cos(LON),Math.sin(la),Math.cos(la)*Math.sin(LON)];
    // texture point q0 -> local l = R(-spin) q0
    const l=[c2*q0[0]-s2*q0[2],q0[1],s2*q0[0]+c2*q0[2]].map(v=>v*1.006);const p=toW(l);if(!vis(p))continue;const q=proj(p);
    const fv=lf(p,eye);if(fv<=0)continue;
    x.save();x.globalAlpha=fv*da*(k===0?1:.5*(1-k/14));x.fillStyle=lat>1?'#ffd36b':'#7fd4ff';x.shadowColor=x.fillStyle;x.shadowBlur=k===0?26:8;x.beginPath();x.arc(q[0],q[1],k===0?15:10-k*.5,0,7);x.fill();x.restore();if(k===0&&t>=16.6&&t<20.3)label('LONDON',Math.min(q[0]+20,840),q[1]-26,fv*da*ease((t-16.6)/.4),'#ffd36b',30);}}
  if(st0(t)>0){x.save();x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(-220,900,10,-220,900,700);gr.addColorStop(0,'rgba(255,240,200,'+.9*st0(t)+')');gr.addColorStop(.2,'rgba(255,200,110,'+.45*st0(t)+')');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,W,H);x.restore();label('SUN',115,915,.85*st0(t),'#fff0c8',36);}
  // orbit streaks in the twist beat
  const st=t<20.8?0:t<22.6?ease((t-20.8)/1.8):t<26.4?1:1-ease((t-26.4)/.8);
  if(st>0){x.save();x.globalCompositeOperation='lighter';for(let i=0;i<70;i++){const r1=Math.sin(i*12.9898)*43758.5453,r2=Math.sin(i*78.233)*12543.12;const fy=r1-Math.floor(r1),fs=r2-Math.floor(r2);
    const len=120+260*fs;const xx=((fs*1900+t*(1400+900*fy)*st)%(W+600))-300;const yy=260+fy*1400;
    const gr=x.createLinearGradient(xx-len,yy,xx,yy);gr.addColorStop(0,'rgba(180,210,255,0)');gr.addColorStop(1,'rgba(200,225,255,'+(.35*st*(.4+.6*fs))+')');
    x.strokeStyle=gr;x.lineWidth=1.5+2*fs;x.beginPath();x.moveTo(xx-len,yy);x.lineTo(xx,yy);x.stroke();}x.restore();}
  // speed gauge (always on, loop-safe)
  const v=speedAt(t);const ga=t<3.3?0:t<3.7?ease((t-3.3)/.4):t<26.4?1:1-ease((t-26.4)/.4);if(ga>0){x.save();x.globalAlpha=ga;x.fillStyle='rgba(8,10,24,.72)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(200,1232,680,160,30);x.fill();x.stroke();x.restore();
  const lab=t<16?'SPIN SPEED AT THE EQUATOR':t<20.6?'SPIN SPEED IN LONDON':t<26.8?'ORBIT SPEED AROUND THE SUN':'SPIN SPEED AT THE EQUATOR';
  const col=t<16?'#7fd4ff':t<20.6?'#ffd36b':t<26.8?'#ff9d6b':'#7fd4ff';
  const n=v>5000?Math.round(v/1000)*1000:Math.round(v);label(lab,W/2,1282,.85*ga,'#d8d2e8',30);label(n.toLocaleString('en-US')+' km/h',W/2,1360,ga,col,68);}
  label('Simulated view. Spin sped up',W/2,1428,.7,'#d8d2e8',26)}
};
