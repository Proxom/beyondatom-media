function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
// yaw 180 = north pole tilted away from Sun (early January), yaw 0 = toward Sun (early July)
function yawAt(t){return t<7.5?180:t<11?lerp(180,0,eio((t-7.5)/3.5)):t<21.5?0:t<24?lerp(0,180,eio((t-21.5)/2.5)):180}
function distAt(t){const y=yawAt(t)*Math.PI/180;return 147.1+5.0*(1+Math.cos(y))/2}
function axA(t){return t>=14.5&&t<27.5?Math.min(ease((t-14.7)/.6),ease((27.5-t)/.5)):0}
SC={D:30,
 scene(t){
  const yaw=yawAt(t);
  const d=t<27.5?lerp(4.4,2.95,eout(t/2.5)):lerp(2.95,4.4,eio((t-27.5)/2.5));
  const az=0.10*Math.sin(2*Math.PI*t/30)+0.05;
  const eye=[d*Math.sin(az)+0.015*Math.sin(2*Math.PI*t/15),0.35+0.015*Math.sin(2*Math.PI*t/10),d*Math.cos(az)];
  return {eye,tgt:[0,0.36,0],fov:.9,sun:[-1,0.08,0.45],
   p:{c:[0,0,0],r:1,ty:0,tilt:23.44,yaw,spin:t*2*Math.PI/30},ring:{n:[0,1,0],a:0},axis:axA(t),expo:1.15};},
 cards:[
  [0,3.5,[["EARTH'S CLOSEST",'#fff'],['TO THE SUN','#fff'],['IN JANUARY','#ffd36b']],124],
  [3.5,7.5,['Early January:',['147 million km','#ffd36b']],100],
  [7.5,11,['Six months later...'],100],
  [11,14.5,['Early July:',['152 million km','#9fd0ff']],100],
  [14.5,19,['Seasons come from',['the 23.4° tilt','#ffd36b']],100],
  [19,21.5,['North tilts toward Sun:',['northern summer','#ffd36b']],92],
  [21.5,24,['Six months later...'],100],
  [24,27.5,['North tilts away:',['northern winter','#9fd0ff']],100],
  [27.5,30.01,[["EARTH'S CLOSEST",'#fff'],['TO THE SUN','#fff'],['IN JANUARY','#ffd36b']],124]],
 overlay(t){
  x.save();x.globalCompositeOperation='lighter';const sy=1040;
  const gr=x.createRadialGradient(-160,sy,10,-160,sy,620);gr.addColorStop(0,'rgba(255,240,200,.95)');gr.addColorStop(.18,'rgba(255,200,110,.55)');gr.addColorStop(.5,'rgba(255,150,60,.12)');gr.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=gr;x.fillRect(0,400,700,1300);x.restore();
  label('SUN',95,sy+14,.9,'#fff0c8',40);
  const aa=axA(t);if(aa>0){const ax=rowY(23.44,yawAt(t));const p=proj([ax[0]*1.36,ax[1]*1.36,ax[2]*1.36]);label('N',p[0],p[1]-10,aa,'#ffd36b',46);}
  // gauge with mini orbit (always on, so the loop is seamless)
  const dd=distAt(t);const yw=yawAt(t);const mo=yw>179?'EARLY JANUARY':yw<1?'EARLY JULY':'ORBITING...';
  x.save();x.fillStyle='rgba(8,10,24,.72)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(110,1290,860,190,30);x.fill();x.stroke();
  const ox=245,oy=1385,rx=105,ry=62,fx=-38; // exaggerated ellipse, Sun at focus
  x.strokeStyle='rgba(255,255,255,.45)';x.setLineDash([6,8]);x.lineWidth=2;x.beginPath();x.ellipse(ox,oy,rx,ry,0,0,7);x.stroke();x.setLineDash([]);
  const sg=x.createRadialGradient(ox+fx,oy,2,ox+fx,oy,26);sg.addColorStop(0,'#fff6d8');sg.addColorStop(.4,'#ffc860');sg.addColorStop(1,'rgba(255,150,40,0)');x.fillStyle=sg;x.beginPath();x.arc(ox+fx,oy,26,0,7);x.fill();
  const ang=Math.PI*(1-yw/180); // Jan at left (near Sun), Jul at right
  const ex=ox-rx*Math.cos(ang),ey=oy-ry*Math.sin(ang)*(t<11||t>=24?1:1);
  x.fillStyle='#5aa8ff';x.shadowColor='#5aa8ff';x.shadowBlur=14;x.beginPath();x.arc(ex,ey,11,0,7);x.fill();x.restore();
  label('JAN',ox-rx-4,oy+ry+30,.8,'#ffd36b',24);label('JUL',ox+rx,oy+ry+30,.8,'#9fd0ff',24);
  label(mo,640,1360,1,'#ffd36b',34);label(dd.toFixed(1)+' million km',640,1418,1,'#fff',46);label('Sun to Earth',640,1458,.75,'#d8d2e8',26);
  label('Simulated view. Orbit shape exaggerated',W/2,1525,.7,'#d8d2e8',26)}
};
