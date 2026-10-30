const RE=6371/25559;function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
SC={D:30,
 scene(t){
  const yaw=t<13.5?55:t<18?lerp(55,0,eio((t-13.5)/4.5)):t<27?0:lerp(0,55,eio((t-27)/2.6));
  const ep=t<8?0:t<10?eio((t-8)/2):t<13.5?1:t<15?1-eio((t-13.5)/1.5):0; // earth slide-in amount
  const push=t<3?1-Math.pow(1-t/3,3):t<27.5?1:1-eio((t-27.5)/2.5);
  const u=t/30,az=0.18*Math.sin(2*Math.PI*u);const d=lerp(6.4,5.4,push)-0.4*Math.sin(Math.PI*u)**2;
  const eye=[d*Math.sin(az)+0.02*Math.sin(t*1.1),0.25+0.02*Math.sin(t*1.6),d*Math.cos(az)];
  return {eye,tgt:[lerp(0,0.45,ep),0.38,0],fov:.9,sun:[-1,0.15,0.75],
   p:{c:[0,0,0],r:1,ty:3,tilt:97.77,yaw,spin:t*0.9},
   q:{c:[lerp(4.2,1.55,ep),-1.05,0],r:RE,ty:0,tilt:23.4,yaw:0,spin:t*0.9},ring:{n:rowY(97.77,yaw),a:1,ty:1},er:[1,0,0],axis:1,expo:1.15};},
 cards:[
  [0,3.6,[['URANUS','#fff'],['SPINS ON','#fff'],['ITS SIDE','#7fe6ff']],128],
  [3.6,8,['Its axis is',['tipped about 98°','#7fe6ff']],100],
  [8,13.5,['Earth, to scale:',['tilted just 23°','#9fd0ff']],100],
  [13.5,19,['One pole faces','the Sun:',['21-year winter','#7fe6ff']],100],
  [19,23.5,['One Uranus year:','84 Earth years.'],100],
  [23.5,27.5,['Maybe knocked over','by a giant impact.'],96],
  [27.5,30.01,[['URANUS','#fff'],['SPINS ON','#fff'],['ITS SIDE','#7fe6ff']],128]],
 overlay(t){
  if(t>=13.5&&t<23.5){const a=Math.min(ease((t-13.8)/.5),ease((23.5-t)/.4));label('← SUNLIGHT',190,1330,a,'#ffe08a',40)}
  label('Simulated view. Not to scale for distance',W/2,1480,.75,'#d8d2e8',28)}
};
