// Jupiter radius = 1 (69,911 km). Earth radius 0.0911. GRS at lat -22 deg on +z face.
const RJ=69911,RE=6371/RJ,LAT=-22*Math.PI/180,CL=Math.cos(LAT);
const KF=[[0,41000],[8,41000],[12.5,23300],[14,23300],[18,16500],[26.3,16500],[28.6,41000],[30.1,41000]];
function widthAt(t){for(let i=0;i<KF.length-1;i++){const [a,wa]=KF[i],[b,wb]=KF[i+1];if(t>=a&&t<=b)return lerp(wa,wb,eio((t-a)/(b-a)))}return 41000}
function ecount(t){const r=widthAt(t)/12742;return [1,cl((r-1.5)/0.3),cl((r-2.6)/0.4)]} // earths shown: 3 -> 2 -> 1
SC={D:30,
 scene(t){
  const W=widthAt(t),ga=(W/2)/(RJ*CL);
  const nrm=[0,Math.sin(LAT),Math.cos(LAT)],east=[1,0,0];
  const pull=t<18.5?0:t<23?eio((t-18.5)/4.5):t<26.3?1:1-eio((t-26.3)/2.3);
  const push=1-Math.pow(1-cl(t/3.5),3);const dist=lerp(lerp(2.5,1.95,push),4.2,pull);
  const sw=[0.006*Math.sin(t*1.2),0.005*Math.sin(t*1.7+1),0];
  const look=[nrm[0]*lerp(1,0,pull),nrm[1]*lerp(1,0,pull),nrm[2]*lerp(1,0,pull)];
  const eye=[look[0]+nrm[0]*dist*0.0+0.04*Math.sin(t*.4)+sw[0], nrm[1]*(1+dist)*lerp(1,.4,pull)+sw[1]+0.02, nrm[2]*(1+dist)];
  const er0=ecount(t);const n=Math.round(er0[0]+er0[1]+er0[2]);const er=[1,er0[1]>0.001?1:0,er0[2]>0.001?1:0];
  // earths float just in front of the storm, centred row
  const gap=2*RE*1.0;const la=LAT-0.19,h=1+RE*1.02;const c0=[-(Math.min(n,3)-1)/2*gap, Math.sin(la)*h, Math.cos(la)*h];const slide=[0,(1-er0[1])*1.6,(1-er0[2])*1.6];
  return {eye,tgt:[look[0]+sw[0],look[1]-0.09*(1-pull)+sw[1],look[2]],fov:lerp(.62,.9,pull),sun:[-0.9,0.3,0.8],
   p:{c:[0,0,0],r:1,ty:1,tilt:0,yaw:0,spin:0},q:{c:c0,r:RE,ty:0,tilt:23.4,yaw:0,spin:t*.2},off:[gap,0,0],slide,er,ga,expo:1.1};},
 cards:[
  [0,3.6,[['THIS STORM','#fff'],['ONCE FIT','#fff'],['3 EARTHS','#ff9a6b']],124],
  [3.6,8,["Jupiter's",['Great Red Spot','#ff9a6b'],'in the late 1800s'],96],
  [8,13.5,['1979, Voyager:','it had shrunk'],100],
  [13.5,18.5,['2014, Hubble:',['smaller still','#ff9a6b']],100],
  [18.5,23.5,['Still shrinking.','Scientists aren\'t','sure why.'],100],
  [23.5,26.3,['Jupiter itself:','11 Earths wide.'],100],
  [26.3,28.6,['Rewind to','the late 1800s...'],100],
  [28.6,30.01,[['THIS STORM','#fff'],['ONCE FIT','#fff'],['3 EARTHS','#ff9a6b']],124]],
 overlay(t){const SW=widthAt(t);const yr=t<8?'Late 1800s':t<12.5?'Shrinking...':t<14?'1979':t<18?'Shrinking...':t<26.3?'2014':t<28.6?'Rewind...':'Late 1800s';
  const al=t>=18.5&&t<27.5?.0:1;
  if(al>0){x.save();x.fillStyle='rgba(10,8,20,.55)';x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=3;x.beginPath();x.roundRect(190,1300,700,150,30);x.fill();x.stroke();x.restore();
   label(yr,W/2,1355,1,'#ffb38a',38);label((Math.round(SW/100)*100).toLocaleString('en-US')+' km  ≈ '+(SW/12742).toFixed(1)+' Earths',W/2,1415,1,'#fff',44);}
  label('Simulated view. Earth to scale',W/2,1490,.75,'#d8d2e8',28)}
};
