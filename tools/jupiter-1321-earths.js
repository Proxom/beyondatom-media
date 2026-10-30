const RE=6371/69911;const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
const HEX=[];{const st=2*RE;for(let j=-14;j<=14;j++)for(let i=-14;i<=14;i++){const px=(i+(j&1)*0.5)*st,py=j*st*0.866;if(Math.hypot(px,py)<1-RE*1.02)HEX.push([px,py])}HEX.sort((a,b)=>(a[1]-b[1])||(a[0]-b[0]));}
const NS=HEX.length;
const IMG=new Image();IMG.src=TEXA;
function earthSprite(X,Y,r,seed,a){x.save();x.globalAlpha=a;x.beginPath();x.arc(X,Y,r,0,7);x.clip();
 const sx=(seed*373)%1500+200,sy=330+(seed*97)%260;x.filter='brightness(1.5) saturate(1.2)';x.drawImage(IMG,sx,sy,420,420,X-r,Y-r,2*r,2*r);x.filter='none';
 const g=x.createRadialGradient(X-r*.5,Y-r*.3,r*.1,X-r*.2,Y,r*1.25);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,10,.55)');
 x.fillStyle=g;x.fillRect(X-r,Y-r,2*r,2*r);x.restore();
 x.save();x.globalAlpha=a*.6;x.strokeStyle='rgba(140,190,255,.7)';x.lineWidth=1.2;x.beginPath();x.arc(X,Y,r,0,7);x.stroke();x.restore();}
function expoAt(t){return t<18?1.1:t<26.6?lerp(1.1,0.38,ease((t-18)/.8)):lerp(0.38,1.1,ease((t-26.6)/.6))}
SC={D:30,
 scene(t){
  const d=4.0-0.25*Math.sin(Math.PI*t/30)**2;const az=0.10*Math.sin(2*Math.PI*t/30);
  const eye=[d*Math.sin(az)+0.012*Math.sin(2*Math.PI*t/10),0.12+0.012*Math.sin(2*Math.PI*t/7.5),d*Math.cos(az)];
  return {eye,tgt:[0.28,0.3,0],fov:.9,sun:[-0.85,0.3,0.75],
   p:{c:[0,0,0],r:1,ty:1,tilt:3.1,yaw:0,spin:0},q:{c:[1.34,-0.42,0],r:RE,ty:0,tilt:23.4,yaw:0,spin:t*2*Math.PI/30},er:[1,0,0],ring:{n:[0,1,0],a:0},expo:expoAt(t)};},
 cards:[
  [0,3.5,[['JUPITER HAS','#fff'],['THE VOLUME OF','#fff'],['1,321 EARTHS','#ffb27a']],120],
  [3.5,8,['This is Earth,',['to scale.','#9fd0ff']],104],
  [8,11.5,[['11 Earths','#9fd0ff'],'fit across.'],104],
  [11.5,15,['Volume grows as',['width cubed:','#9fd0ff']],100],
  [15,18,['About',['1,321 Earths.','#ffb27a']],104],
  [18,22.5,['But its mass?',['Only 318 Earths.','#ffb27a']],100],
  [22.5,26.6,['Mostly hydrogen','and helium.'],100],
  [26.6,30.01,[['JUPITER HAS','#fff'],['THE VOLUME OF','#fff'],['1,321 EARTHS','#ffb27a']],120]],
 overlay(t){
  const s=SC.scene(t);const c=proj([0,0,0]);const L=Math.hypot(...s.eye);const R=W/CAM.fov/Math.sqrt(L*L-1);const er=R*RE;
  const qe=proj(s.q.c);
  const la=t<8?1:t<8.5?1-ease((t-8)/.5):t<26.6?0:ease((t-26.6)/.5);label('EARTH',qe[0],qe[1]+er+48,la,'#9fd0ff',36);
  const box=(txt,col,a)=>{x.save();x.globalAlpha=a;x.fillStyle='rgba(8,10,24,.72)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(220,1330,640,130,30);x.fill();x.stroke();x.restore();label(txt,W/2,1418,a,col,58);};
  if(t>=8&&t<11.6){const n=Math.min(11,Math.floor((t-8.2)/0.25)+1);const a=t<11.3?1:0;
   for(let i=0;i<n;i++){const px=-1+RE+i*2*RE*0.9993;const pp=ease((t-8.2-i*.25)/.18);earthSprite(c[0]+px*R,c[1],er*(.6+.4*pp),i+3,a*pp);}
   if(n>0)box('ACROSS: '+Math.max(0,n),'#fff',a);}
  if(t>=11.3&&t<18.6){const fade=t<18?1:1-ease((t-18)/.6);
   for(let i=0;i<11;i++){const px=-1+RE+i*2*RE*0.9993;earthSprite(c[0]+px*R,c[1],er,i+3,fade);}
   const nc=t<12.4?0:Math.min(11,Math.floor((t-12.4)/0.09)+1);
   for(let i=0;i<nc;i++){if(i===5)continue;const py=-1+RE+i*2*RE*0.9993;earthSprite(c[0],c[1]-py*R,er,i+20,fade);}
   const txt=t<12.4?'11':t<13.6?'11 × 11':t<15?'11 × 11 × 11':'≈ '+Math.round(lerp(121,1321,eio((t-15)/1.6))).toLocaleString('en-US');
   x.save();x.globalAlpha=fade;x.fillStyle='rgba(8,10,24,.75)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(170,1290,740,180,30);x.fill();x.stroke();x.restore();
   label(txt,W/2,1385,fade,t<15?'#fff':'#ffb27a',64);label('Exact width ratio 10.97 → 10.97³ = 1,321',W/2,1442,fade*.85,'#d8d2e8',28);}
  if(t>=18&&t<26.6){const a=Math.min(ease((t-18.3)/.5),ease((26.6-t)/.4));
   x.save();x.globalAlpha=a*.8;x.fillStyle='rgba(6,8,20,.75)';x.beginPath();x.roundRect(110,1060,860,440,30);x.fill();x.restore();
   const bars=[['VOLUME',1321,'#ffb27a',1150],['MASS',318,'#9fd0ff',1290]];
   bars.forEach(([nm,v,col,y],i)=>{const ap=Math.min(a,ease((t-18.3-i*1.2)/.6));if(ap<=0)return;const w=600*(v/1321)*eout((t-18.3-i*1.2)/1.2);
    x.save();x.globalAlpha=ap;x.fillStyle='rgba(255,255,255,.12)';x.fillRect(170,y,600,60);x.fillStyle=col;x.fillRect(170,y,w,60);x.restore();
    x.save();x.globalAlpha=ap;x.font='800 34px '+F;x.fillStyle='#fff';x.textAlign='left';x.shadowColor='#000';x.shadowBlur=10;x.fillText(nm,170,y-16);
    x.font='900 42px '+F;x.fillStyle=col;x.fillText('× '+Math.round(v*cl((t-18.3-i*1.2)/1.2)),170+w+18,y+45);x.restore();});
   if(t>=22.5){const a2=Math.min(ease((t-22.6)/.5),ease((26.6-t)/.4));label('Density: about ¼ of Earth’s',W/2,1440,a2,'#fff',42);}}
  label('Simulated view. Earths drawn to scale',W/2,1515,.7,'#d8d2e8',28)}
};
