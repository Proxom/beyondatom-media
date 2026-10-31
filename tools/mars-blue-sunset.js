// Mars blue sunset. Sun angular radius 0.00305 rad (0.35 deg diameter, ~2/3 of Earth's 0.53 deg).
const D2R=Math.PI/180,SC0=0.9/1080,HOR=1250;           // default: 0.9 tan-units across the width, horizon at y=1250
const SE_LOW=4.4*D2R,SE_DAY=24*D2R;
function sunEl(t){if(t<1.7)return SE_LOW;if(t<3.8)return lerp(SE_LOW,SE_DAY,eio((t-1.7)/2.1));if(t<4.6)return SE_DAY;if(t<7.6)return lerp(SE_DAY,SE_LOW,eio((t-4.6)/3.0));return SE_LOW;}
function zoom(t){ // 1 = wide, 15 = telephoto on the Sun
 if(t<20.4||t>29.4)return 1;if(t<23.2)return Math.exp(Math.log(15)*eio((t-20.4)/2.8));if(t<26.7)return 15;return Math.exp(Math.log(15)*(1-eio((t-26.7)/2.7)));}
SC={D:30,
 subs(t){return (t>1.6&&t<3.9)?3:(t>20.4&&t<23.2)||(t>26.7&&t<29.4)?4:1},
 view(t){const se=sunEl(t);const day=ease((se-5*D2R)/(15*D2R));const z=zoom(t);const zk=Math.log(z)/Math.log(15);
  const ph=2*Math.PI*t/30;
  const cp=[1.2*Math.sin(ph),1.7+0.08*Math.sin(2*ph),-4*Math.sin(ph)];          // slow periodic dolly (loops at 30 s)
  const sc=SC0/z;
  // anchor: the Sun stays at a fixed pixel; it moves from its natural place toward the frame centre while zoomed
  const sy0=HOR-Math.tan(SE_LOW)/SC0;
  const sway=[3*Math.sin(2*Math.PI*t/10),2*Math.sin(2*Math.PI*t/7.5+1)];
  let anc,ant;
  if(z>1.0001){anc=[540+sway[0]*(1-zk),lerp(sy0,930,zk)+sway[1]*(1-zk)];ant=[0,Math.tan(se)];}
  else{anc=[540+sway[0],HOR+sway[1]];ant=[0,0];}
  const fl=Math.exp(-t*5)*0.9+Math.exp(-(30-t)*5)*0.9;   // glow pulse peaks at the loop seam
  const expo=lerp(1,0.22,zk);return {se,day,sc,anc,ant,cp,fl,expo};},
 cards:[
  [0,2.6,[['MARS SUNSETS','#fff'],['ARE BLUE','#7fc4ff']],124],
  [2.6,6.4,['By day, the sky is',['BUTTERSCOTCH','#ffc46b']],112],
  [6.4,9.0,['At sunset, its glow',['TURNS BLUE','#7fc4ff']],116],
  [9.0,12.8,['Why? Fine dust',['scatters blue forward','#7fc4ff']],104],
  [12.8,16.6,['Blue light stays',['close to the Sun','#7fc4ff']],108],
  [16.6,20.4,['NASA Curiosity saw it',['April 15, 2015','#ffd36b']],100],
  [20.4,23.4,['And the Sun',['looks smaller','#ffd36b']],100],
  [23.4,26.8,['Only 2/3 the size',['seen from Earth','#ffd36b']],108],
  [27.4,30.01,[['MARS SUNSETS','#fff'],['ARE BLUE','#7fc4ff']],124]],
 overlay(t){
  // dust-scattering diagram 9.2-16.6 s
  const da=t<9.2?0:t<9.8?ease((t-9.2)/.6):t<16.0?1:t<16.6?1-ease((t-16.0)/.6):0;
  if(da>0)diagram(t,da);
  // sun-size comparison while zoomed
  const za=t<22.6?0:t<23.4?ease((t-22.6)/.8):t<26.5?1:t<27.0?1-ease((t-26.5)/.5):0;
  if(za>0){const [sx,sy]=sunPx();const rm=0.00305/VIEW.sc,re=rm*1.5;   // Earth view: 0.53 deg vs 0.35 deg
   x.save();x.globalAlpha=za*.9;x.strokeStyle='#ffd36b';x.lineWidth=4;x.setLineDash([14,12]);x.lineDashOffset=-t*20;x.beginPath();x.arc(sx,sy,re,0,7);x.stroke();x.restore();
   label('SUN FROM EARTH',sx,sy-re-34,za,'#ffd36b',34);label('SUN FROM MARS',sx,sy+re+62,za,'#bfe0ff',34);}
  // disclaimer pill
  const pa=.85;x.save();x.globalAlpha=pa;x.fillStyle='rgba(10,8,12,.55)';x.beginPath();x.roundRect(300,1366,480,46,23);x.fill();x.restore();
  label('Simulation, not real footage',540,1398,.8,'#e6dccf',25);
 }
};
// light hits a dust grain: blue leaves in a narrow forward cone, red/orange spreads wide
function diagram(t,a){
 const cx=470,cy=880,tt=t-9.2;
 x.save();x.globalAlpha=a*.55;const gsc=x.createRadialGradient(cx,cy,40,cx,cy,520);gsc.addColorStop(0,'rgba(5,6,12,.75)');gsc.addColorStop(1,'rgba(5,6,12,0)');x.fillStyle=gsc;x.fillRect(0,cy-520,W,1040);x.restore();
 x.save();x.globalCompositeOperation='lighter';
 // incoming sunlight from the left
 const inc=cl(tt/0.9);x.globalAlpha=a;x.lineCap='round';
 for(let k=-1;k<=1;k++){const y=cy+k*10;x.strokeStyle='rgba(255,250,235,.85)';x.lineWidth=5;x.shadowColor='#fff';x.shadowBlur=14;x.beginPath();x.moveTo(80,y);x.lineTo(lerp(90,cx-38,inc),y);x.stroke();}
 // scattered rays
 const out=cl((tt-0.9)/1.6);
 if(out>0){const N=26;for(let i=0;i<N;i++){const r=(i+.5)/N;let ang,col,len;
   if(i%2===0){ang=(r-.5)*0.42;col='rgba(110,175,255,';len=360;} else {ang=(r-.5)*5.6;col='rgba(255,140,80,';len=230;}
   const L=38+len*ease(out);const pulse=.55+.45*Math.sin(t*6-i);x.strokeStyle=col+(.75*pulse)+')';x.lineWidth=i%2===0?5:3.5;x.shadowColor=i%2===0?'#6fb0ff':'#ff8a50';x.shadowBlur=16;
   x.beginPath();x.moveTo(cx+38*Math.cos(ang),cy+38*Math.sin(ang));x.lineTo(cx+L*Math.cos(ang),cy+L*Math.sin(ang));x.stroke();}}
 x.restore();
 // the grain itself: a lit, rough dust particle
 x.save();x.globalAlpha=a;const gr=x.createRadialGradient(cx-12,cy-12,4,cx,cy,40);gr.addColorStop(0,'#e7b48a');gr.addColorStop(.6,'#9a5a36');gr.addColorStop(1,'#3a2016');
 x.fillStyle=gr;x.beginPath();for(let i=0;i<=40;i++){const q=i/40*2*Math.PI;const rr=34+4*Math.sin(q*5+1)+3*Math.sin(q*3);x.lineTo(cx+rr*Math.cos(q),cy+rr*Math.sin(q));}x.fill();x.restore();
 label('SUNLIGHT',180,cy-34,a*cl(tt/0.6),'#fff3dc',32);
 label('DUST GRAIN',cx,cy+92,a*cl(tt/0.6),'#e7c9a8',30);
 label('BLUE: NARROW, FORWARD',640,cy-150,a*cl((tt-1.8)/.6),'#9fcbff',30);
 label('RED: SPREADS WIDE',470,cy+250,a*cl((tt-2.3)/.6),'#ffb08a',30);
}
