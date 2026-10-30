function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
// yaw 180 = north pole tilted away from Sun (early January), yaw 0 = tilted toward Sun (early July)
function yawAt(t){return t<8?180:t<12.5?lerp(180,0,eio((t-8)/4.5)):t<22?0:t<26.5?lerp(0,180,eio((t-22)/4.5)):180}
function distAt(t){const y=yawAt(t)*Math.PI/180;return 147.1+5.0*(1+Math.cos(y))/2}
SC={D:30,
 scene(t){
  const yaw=yawAt(t);const push=eout(t/4);const u=t/30;
  const d=lerp(3.6,2.95,push)+0.2*Math.sin(Math.PI*u)**2;const az=0.10*Math.sin(2*Math.PI*u)+0.05;
  const eye=[d*Math.sin(az)+0.015*Math.sin(t*1.1),0.35+0.015*Math.sin(t*1.6),d*Math.cos(az)];
  const ax=t>=16.5&&t<26.5?Math.min(ease((t-16.7)/.6),ease((26.5-t)/.5)):0;
  return {eye,tgt:[0,0.36,0],fov:.9,sun:[-1,0.08,0.45],
   p:{c:[0,0,0],r:1,ty:0,tilt:23.44,yaw,spin:t*0.45},ring:{n:[0,1,0],a:0},axis:ax,expo:1.2};},
 cards:[
  [0,3.5,[['EARTH IS','#fff'],['CLOSEST TO THE SUN','#fff'],['IN JANUARY','#ffd36b']],120],
  [3.5,8,['Early January:',['147 million km','#ffd36b']],100],
  [8,12.5,['Then, six months',' later...'],100],
  [12.5,16.5,['Early July:',['152 million km','#9fd0ff']],100],
  [16.5,22,['Seasons come from',['the 23.4° tilt','#ffd36b']],100],
  [22,26.5,['Tilt away from the Sun:','northern winter.'],92],
  [26.5,30.01,[['EARTH IS','#fff'],['CLOSEST TO THE SUN','#fff'],['IN JANUARY','#ffd36b']],120]],
 overlay(t){
  // Sun glow off the left edge
  x.save();x.globalCompositeOperation='lighter';const sy=1040;
  const gr=x.createRadialGradient(-160,sy,10,-160,sy,620);gr.addColorStop(0,'rgba(255,240,200,.95)');gr.addColorStop(.18,'rgba(255,200,110,.55)');gr.addColorStop(.5,'rgba(255,150,60,.12)');gr.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=gr;x.fillRect(0,400,700,1300);x.restore();
  label('SUN',95,sy+14,.9,'#fff0c8',40);
  // north pole marker while axis shown
  const s=SC.scene(t);if(s.axis>0){const ax=rowY(23.44,yawAt(t));const p=proj([ax[0]*1.36,ax[1]*1.36,ax[2]*1.36]);label('N',p[0],p[1]-10,s.axis,'#ffd36b',46);}
  // distance gauge
  if(t>=3.5){const a=t<3.9?ease((t-3.5)/.4):1;const dd=distAt(t);const yw=yawAt(t);
   const mo=yw>179?'EARLY JANUARY':yw<1?'EARLY JULY':'ORBITING...';
   x.save();x.globalAlpha=a;x.fillStyle='rgba(8,10,24,.6)';x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.beginPath();x.roundRect(170,1310,740,150,30);x.fill();x.stroke();x.restore();
   label(mo,W/2,1365,a,'#ffd36b',36);label('Sun to Earth: '+dd.toFixed(1)+' million km',W/2,1422,a,'#fff',42);}
  label('Simulated view. Not to scale',W/2,1500,.7,'#d8d2e8',28)}
};
