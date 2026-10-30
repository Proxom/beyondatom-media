function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
const TILT=-24,YAW=90;
// water level: 0 = off-screen below, 1 = waterline at 0.26 R above centre (a sphere with 0.69 of its volume submerged)
function wAt(t){return t<20.6?0:t<22.8?eio((t-20.6)/2.2):t<25.6?1:t<26.6?1-eio((t-25.6)/1.0):0}
SC={D:30,
 scene(t){
  const u=t/30,az=0.28*Math.sin(2*Math.PI*u),d=5.9-0.5*Math.sin(Math.PI*u)**2;
  const eye=[d*Math.sin(az),0.15+0.04*Math.sin(2*Math.PI*t/10),d*Math.cos(az)];
  const sw=[0.02*Math.sin(2*Math.PI*t/15),0.015*Math.sin(2*Math.PI*t/7.5),0];
  return {eye,tgt:[sw[0],0.12+sw[1],0],fov:.9,sun:[-0.75,0.35,0.55],
   p:{c:[0,0,0],r:1,ty:2,tilt:TILT,yaw:YAW,spin:t*2*Math.PI/30},ring:{n:rowY(TILT,YAW),a:1},expo:1.05};},
 cards:[
  [0,3.5,[['SATURN IS','#fff'],['LESS DENSE','#fff'],['THAN WATER','#7fd4ff']],116],
  [3.5,7.5,['Mass:',['95 Earths','#ffcf6b']],104],
  [7.5,11.5,['Volume:',['764 Earths','#ffcf6b']],104],
  [11.5,16,['Average density:',['0.69 g/cm³','#ffcf6b']],100],
  [16,20.5,['Earth: 5.51 g/cm³,',['the densest planet','#9fd0ff']],92],
  [20.5,23.6,['In theory,','it would float.'],104],
  [23.6,26.6,['But no ocean is',['that big.','#7fd4ff']],104],
  [26.6,30.01,[['SATURN IS','#fff'],['LESS DENSE','#fff'],['THAN WATER','#7fd4ff']],116]],
 overlay(t){
  const s=SC.scene(t);const c=proj([0,0,0]);const L=Math.hypot(...s.eye);const R=W/CAM.fov/Math.sqrt(L*L-1);
  // water
  const wl=wAt(t);if(wl>0){const yl=lerp(H+60,c[1]-0.26*R,wl)+7*Math.sin(2*Math.PI*t/2.5)*wl;
   x.save();x.beginPath();x.moveTo(0,H);for(let px=0;px<=W;px+=12){const yy=yl+6*Math.sin(px/70+t*2.2)+4*Math.sin(px/31-t*3.1);x.lineTo(px,yy)}x.lineTo(W,H);x.closePath();
   const g=x.createLinearGradient(0,yl,0,H);g.addColorStop(0,'rgba(60,150,220,.55)');g.addColorStop(.35,'rgba(20,80,150,.75)');g.addColorStop(1,'rgba(4,20,50,.92)');x.fillStyle=g;x.fill();
   x.strokeStyle='rgba(190,235,255,.85)';x.lineWidth=4;x.shadowColor='#bfe8ff';x.shadowBlur=14;x.beginPath();
   for(let px=0;px<=W;px+=12){const yy=yl+6*Math.sin(px/70+t*2.2)+4*Math.sin(px/31-t*3.1);px?x.lineTo(px,yy):x.moveTo(px,yy)}x.stroke();x.restore();
   // caustic shimmer
   x.save();x.globalCompositeOperation='lighter';for(let i=0;i<26;i++){const r=Math.sin(i*91.7)*4373.1,fx=r-Math.floor(r);const xx=(fx*W+t*40*(i%3-1))%W,yy=yl+30+((i*53)%300);
    x.globalAlpha=.10*wl*(.5+.5*Math.sin(t*3+i));x.fillStyle='#bfe8ff';x.beginPath();x.ellipse(xx,yy,60,6,0,0,7);x.fill();}x.restore();
   const la=Math.min(ease((t-22.2)/.5),1-ease((t-25.4)/.4));label('69% of its volume',W/2,1250,la,'#ffffff',52);label('below the waterline',W/2,1316,la,'#ffffff',52);}
  // stat box
  const box=(a)=>{x.save();x.globalAlpha=a;x.fillStyle='rgba(8,10,24,.74)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(130,1200,820,210,30);x.fill();x.stroke();x.restore();};
  const bar=(nm,txt,frac,col,y,a)=>{if(a<=0)return;x.save();x.globalAlpha=a;x.fillStyle='rgba(255,255,255,.12)';x.fillRect(330,y,420,36);x.fillStyle=col;x.fillRect(330,y,420*cl(frac),36);
   x.font='800 32px '+F;x.textAlign='right';x.fillStyle='#fff';x.shadowColor='#000';x.shadowBlur=10;x.fillText(nm,310,y+29);
   x.font='900 34px '+F;x.textAlign='left';const tx=330+420*cl(frac)+14;x.fillStyle=col;x.fillText(txt,tx,y+30);x.restore();};
  if(t>=3.5&&t<11.6){const a=Math.min(ease((t-3.6)/.4),1-ease((t-11.2)/.4));box(a);
   const m=eout((t-3.8)/1.2),v=eout((t-7.7)/1.6);
   bar('MASS','× '+Math.round(95*m),95/764*m,'#9fd0ff',1240,a);bar('VOLUME','× '+Math.round(764*v),v,'#ffcf6b',1305,a*(t>=7.5?ease((t-7.5)/.3):0));
   label('Saturn compared with Earth',W/2,1390,a*.8,'#d8d2e8',26);}
  if(t>=11.5&&t<20.7){const a=Math.min(ease((t-11.6)/.4),1-ease((t-20.3)/.4));box(a);
   const sc=t<16?1/1.25:lerp(1/1.25,1/5.6,eio((t-16)/1.2));// bar length per g/cm3, as a fraction of the full track
   const sa=eout((t-11.9)/1.0);
   bar('WATER','1.00',1*sc,'#7fd4ff',1225,a);bar('SATURN',(0.69*sa).toFixed(2),0.69*sc*sa,'#ffcf6b',1278,a);
   const ea=t<16?0:ease((t-16.1)/.4);bar('EARTH',(5.51*eout((t-16.1)/1.2)).toFixed(2),5.51*sc*eout((t-16.1)/1.2),'#9fd0ff',1331,a*ea);
   label('Average density, g/cm³',W/2,1395,a*.8,'#d8d2e8',24);}
  label('Simulated view',W/2,1436,.7,'#d8d2e8',22);
 }
};
