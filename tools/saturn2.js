function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]}
const eout=u=>{u=cl(u);return 1-Math.pow(1-u,3)};
SC={D:30,
 scene(t){
  // tilt starts closing on frame 0, edge-on by ~6 s, reopens 10.5-14.5, stays open, small breathing at the end
  const B=t<6?lerp(26,0.35,eout(t/6)*0.15+eio(t/6)*0.85):t<10.5?0.35:t<14.5?lerp(0.35,26,eio((t-10.5)/4)):26;
  const yaw=90,tilt=-B;
  const u=t/30, az=0.32*Math.sin(2*Math.PI*u), d=5.9-0.7*Math.sin(Math.PI*u)**2;
  const eye=[d*Math.sin(az),0.15+0.05*Math.sin(t*1.3),d*Math.cos(az)];
  const sw=[0.02*Math.sin(t*1.1),0.015*Math.sin(t*1.7+1),0];
  return {eye,tgt:[sw[0],0.25+sw[1],0],fov:.9,sun:[-0.75,0.35,0.55],
   p:{c:[0,0,0],r:1,ty:2,tilt,yaw,spin:t*0.05},ring:{n:rowY(tilt,yaw),a:1},expo:1.05};},
 cards:[
  [0,3.2,[["SATURN'S RINGS:",'#fff'],["TYPICALLY ONLY",'#fff'],['10 m THICK','#ffcf6b']],116],
  [3.2,6.5,['Turn them','edge-on...'],104],
  [6.5,10.5,['...and they','almost vanish.'],104],
  [10.5,15,['Yet they span about',['270,000 km.','#ffcf6b']],100],
  [15,20,['Earth last lined up:',['March 2025.','#ffcf6b']],100],
  [20,25,['Twice per','Saturn orbit',['(29.4 years).','#ffcf6b']],100],
  [25,30.01,[["SATURN'S RINGS:",'#fff'],["TYPICALLY ONLY",'#fff'],['10 m THICK','#ffcf6b']],116]],
 overlay(t){label('Simulated view',W/2,1480,.75,'#d8d2e8',28)}
};
