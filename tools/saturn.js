function rowY(tilt,yaw){const M=tiltM(tilt,yaw);return [M[1],M[4],M[7]]} // local y axis in world
SC={D:30,
 scene(t){
  const B=t<8.5?26:t<13?lerp(26,0.35,eio((t-8.5)/4.5)):t<23?0.35:t<28?lerp(0.35,26,eio((t-23)/5)):26;
  const yaw=90,tilt=-B; // tilt toward camera
  const u=t/30, az=0.25*Math.sin(2*Math.PI*u), d=5.6-0.5*Math.sin(Math.PI*u)**2;
  const eye=[(d+0.2)*Math.sin(az),0.15+0.05*Math.sin(t*1.3),(d+0.2)*Math.cos(az)];
  const sw=[0.02*Math.sin(t*1.1),0.015*Math.sin(t*1.7+1),0];
  return {eye,tgt:[sw[0],0.25+sw[1],0],fov:.9,sun:[-0.75,0.35,0.55],
   p:{c:[0,0,0],r:1,ty:2,tilt,yaw,spin:t*0.05},ring:{n:rowY(tilt,yaw),a:1},expo:1.05};},
 cards:[
  [0,3.6,[["SATURN'S RINGS",'#fff'],["ARE TYPICALLY",'#fff'],['ONLY 10 m THICK','#ffcf6b']],116],
  [3.6,8.4,['Yet they span about',['270,000 km.','#ffcf6b']],100],
  [8.4,13,['Now turn them','edge-on...'],100],
  [13,18,['...and they','almost vanish.'],100],
  [18,23,[['Last edge-on view','#ffcf6b'],'from Earth:','March 2025.'],96],
  [23,27.4,['Twice per','Saturn orbit','(29.4 years).'],96],
  [27.4,30.01,[["SATURN'S RINGS",'#fff'],["ARE TYPICALLY",'#fff'],['ONLY 10 m THICK','#ffcf6b']],116]],
 overlay(t){label('Simulated view',W/2,1480,.75,'#d8d2e8',28)}
};
