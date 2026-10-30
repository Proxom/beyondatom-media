const RE=6371/69911;const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
// Earth (to scale) sits at lower right of Jupiter; dots fill Jupiter's disk 8-15 s
const N=1321;function cnt(t){return t<8?0:t<15?Math.round(N*Math.pow(eio((t-8)/7),1.3)):N}
let HEX=null;
SC={D:30,
 scene(t){
  const push=eout(t/4);const u=t/30;const d=lerp(3.9,3.3,push)+0.2*Math.sin(Math.PI*u)**2;const az=0.12*Math.sin(2*Math.PI*u);
  const eye=[d*Math.sin(az)+0.012*Math.sin(t*1.1),0.12+0.012*Math.sin(t*1.7),d*Math.cos(az)];
  const es=t<1.2?0:ease((t-1.2)/1.2);
  return {eye,tgt:[0.0,0.28,0],fov:.9,sun:[-0.85,0.3,0.75],
   p:{c:[0,0,0],r:1,ty:1,tilt:3.1,yaw:0,spin:t*0.06},q:{c:[1.05,-0.95,0.9],r:RE*es,ty:0,tilt:23.4,yaw:0,spin:t*0.3},er:[1,0,0],ring:{n:[0,1,0],a:0},expo:t>=18?lerp(1.1,0.55,ease((t-18)/.8))*(t>=26.6?1:1)+ (t>=26.6?lerp(0,0.55,ease((t-26.6)/.6)):0):1.1};},
 cards:[
  [0,3.5,[['JUPITER HAS','#fff'],['THE VOLUME OF','#fff'],['1,321 EARTHS','#ffb27a']],120],
  [3.5,8,['This is Earth,',['to scale.','#9fd0ff']],104],
  [8,15,['Jupiter is 11× wider.','By volume:'],96],
  [15,18,[['1,321 Earths.','#ffb27a']],110],
  [18,22.5,['But its mass?',['Only 318 Earths.','#ffb27a']],100],
  [22.5,26.6,['It is mostly','hydrogen and helium.'],96],
  [26.6,30.01,[['JUPITER HAS','#fff'],['THE VOLUME OF','#fff'],['1,321 EARTHS','#ffb27a']],120]],
 overlay(t){
  const s=SC.scene(t);const c=proj([0,0,0]);const e=proj([1,0,0]);
  // projected radius from silhouette: use point on sphere perpendicular to view
  const ey=s.eye,L=Math.hypot(...ey);const r=Math.hypot(...[0,0,0].map((v,i)=>0))||0;
  const R=W/CAM.fov/Math.sqrt(L*L-1);
  const qe=proj(s.q.c);const er=R*RE*1.02;
  if(t>=1.2&&t<8.4){const a=Math.min(ease((t-2)/.5),ease((8.4-t)/.4));label('EARTH',qe[0],qe[1]+er+50,a,'#9fd0ff',38);}
  const n=cnt(t);
  if(t>=8&&t<18.6){const fade=t<18?1:1-ease((t-18)/.6);
   if(!HEX){HEX=[];const st=2*RE*1.0;for(let j=-12;j<=12;j++)for(let i=-13;i<=13;i++){const px=(i+(j&1)*0.5)*st,py=j*st*0.866;if(px*px+py*py<(1-RE)*(1-RE))HEX.push([px,py,Math.hypot(px,py)])}HEX.sort((a,b)=>(a[1]-b[1])||(a[0]-b[0]));}
   const k=Math.round(HEX.length*n/N);x.save();x.globalAlpha=fade;
   for(let i=0;i<k;i++){const [px,py]=HEX[i];const X=c[0]+px*R,Y=c[1]-py*R;const rr=er*.98;
    const g=x.createRadialGradient(X-rr*.35,Y-rr*.35,rr*.1,X,Y,rr);g.addColorStop(0,'#cfe6ff');g.addColorStop(.45,'#3a78c8');g.addColorStop(1,'#0b1c3a');
    x.fillStyle=g;x.beginPath();x.arc(X,Y,rr,0,7);x.fill();}
   x.restore();
   x.save();x.globalAlpha=fade;x.fillStyle='rgba(8,10,24,.6)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(240,1310,600,140,30);x.fill();x.stroke();x.restore();
   label(n.toLocaleString('en-US')+' Earths',W/2,1400,fade,'#fff',64);}
  if(t>=18&&t<26.6){const a=Math.min(ease((t-18.3)/.5),ease((26.6-t)/.4));
   const bars=[['VOLUME',1321,'#ffb27a',1150],['MASS',318,'#9fd0ff',1290]];
   bars.forEach(([nm,v,col,y],i)=>{const ap=Math.min(a,ease((t-18.3-i*1.2)/.6));if(ap<=0)return;const w=760*(v/1321)*eout((t-18.3-i*1.2)/1.2);
    x.save();x.globalAlpha=ap;x.fillStyle='rgba(255,255,255,.12)';x.fillRect(160,y,760,60);x.fillStyle=col;x.fillRect(160,y,w,60);x.restore();
    label(nm,160+70,y-18,ap,'#fff',34);label('× '+Math.round(v*cl((t-18.3-i*1.2)/1.2)),Math.max(160+w+90,330),y+44,ap,col,40);});
   if(t>=22.5){const a2=Math.min(ease((t-22.6)/.5),ease((26.6-t)/.4));label('Density: about ¼ of Earth’s',W/2,1470,a2,'#fff',40);}}
  label(t>=8&&t<18?'Simulated. Earths drawn to scale; count is by volume':'Simulated view. Sizes to scale',W/2,1515,.7,'#d8d2e8',28)}
};
