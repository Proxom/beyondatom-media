// Mars blue sunset, 40 s cut (v2): labels moved clear of the rays (v1 rays crossed them); new 16.6-26.6 s beat: Earth air does the opposite.
// Sun angular radius 0.00305 rad (0.35 deg diameter, ~2/3 of Earth's 0.53 deg).
const D2R=Math.PI/180,SC0=0.9/1080,HOR=1250;           // default: 0.9 tan-units across the width, horizon at y=1250
const SE_LOW=4.4*D2R,SE_DAY=24*D2R;
function sunEl(t){if(t<1.7)return SE_LOW;if(t<3.8)return lerp(SE_LOW,SE_DAY,eio((t-1.7)/2.1));if(t<4.6)return SE_DAY;if(t<7.6)return lerp(SE_DAY,SE_LOW,eio((t-4.6)/3.0));return SE_LOW;}
function zoom(t){ // 1 = wide, 15 = telephoto on the Sun
 if(t<30.4||t>39.4)return 1;if(t<33.2)return Math.exp(Math.log(15)*eio((t-30.4)/2.8));if(t<36.7)return 15;return Math.exp(Math.log(15)*(1-eio((t-36.7)/2.7)));}
SC={D:40,
 subs(t){return (t>1.6&&t<3.9)?3:(t>30.4&&t<33.2)||(t>36.7&&t<39.4)?4:1},
 view(t){const se=sunEl(t);const day=ease((se-5*D2R)/(15*D2R));const z=zoom(t);const zk=Math.log(z)/Math.log(15);
  const ph=2*Math.PI*t/40;
  const cp=[1.2*Math.sin(ph),1.7+0.08*Math.sin(2*ph),-4*Math.sin(ph)];          // slow periodic dolly (loops at 40 s)
  const sc=SC0/z;
  // anchor: the Sun stays at a fixed pixel; it moves from its natural place toward the frame centre while zoomed
  const sy0=HOR-Math.tan(SE_LOW)/SC0;
  const sway=[3*Math.sin(2*Math.PI*t/10),2*Math.sin(2*Math.PI*t/7.5+1)];
  let anc,ant;
  if(z>1.0001){anc=[540+sway[0]*(1-zk),lerp(sy0,930,zk)+sway[1]*(1-zk)];ant=[0,Math.tan(se)];}
  else{anc=[540+sway[0],HOR+sway[1]];ant=[0,0];}
  const fl=Math.exp(-t*5)*0.9+Math.exp(-(40-t)*5)*0.9;   // glow pulse peaks at the loop seam
  const expo=lerp(1,0.22,zk);return {se,day,sc,anc,ant,cp,fl,expo};},
 cards:[
  [0,2.6,[['MARS SUNSETS','#fff'],['ARE BLUE','#7fc4ff']],124],
  [2.6,6.4,['By day, the sky is',['BUTTERSCOTCH','#ffc46b']],112],
  [6.4,9.0,['At sunset, its glow',['TURNS BLUE','#7fc4ff']],116],
  [9.0,12.8,['Why? Fine dust',['scatters blue forward','#7fc4ff']],104],
  [12.8,16.6,['Blue light stays',['close to the Sun','#7fc4ff']],108],
  [16.6,21.4,['On Earth, air does',['the opposite','#ffb08a']],108],
  [21.4,26.6,['So our sunsets',['turn red','#ff9a6b']],116],
  [26.6,30.4,['NASA Curiosity saw it',['April 15, 2015','#ffd36b']],100],
  [30.4,33.4,['And the Sun',['looks smaller','#ffd36b']],100],
  [33.4,36.8,['Only 2/3 the size',['seen from Earth','#ffd36b']],108],
  [37.4,40.01,[['MARS SUNSETS','#fff'],['ARE BLUE','#7fc4ff']],124]],
 under(t){ // dim the Mars scene while the Earth diagram is on (drawn before the cards)
  const ea=t<16.6?0:t<17.2?ease((t-16.6)/.6):t<26.0?1:t<26.6?1-ease((t-26.0)/.6):0;
  if(ea>0){x.save();x.globalAlpha=ea*.62;x.fillStyle='#05060c';x.fillRect(0,0,W,H);x.restore();}},
 overlay(t){
  // dust-scattering diagram 9.2-16.6 s
  const da=t<9.2?0:t<9.8?ease((t-9.2)/.6):t<16.0?1:t<16.6?1-ease((t-16.0)/.6):0;
  if(da>0)diagram(t,da);
  // Earth air molecule diagram 16.6-26.6 s
  const ea=t<16.6?0:t<17.2?ease((t-16.6)/.6):t<26.0?1:t<26.6?1-ease((t-26.0)/.6):0;
  if(ea>0)diagramEarth(t,ea);
  // sun-size comparison while zoomed
  const za=t<32.6?0:t<33.4?ease((t-32.6)/.8):t<36.5?1:t<37.0?1-ease((t-36.5)/.5):0;
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
 const cx=470,cy=DCY,tt=t-9.2;
 x.save();x.globalAlpha=a*.55;const gsc=x.createRadialGradient(cx,cy,40,cx,cy,520);gsc.addColorStop(0,'rgba(5,6,12,.75)');gsc.addColorStop(1,'rgba(5,6,12,0)');x.fillStyle=gsc;x.fillRect(0,cy-520,W,1040);x.restore();
 x.save();x.globalCompositeOperation='lighter';
 // incoming sunlight from the left
 const inc=cl(tt/0.9);x.globalAlpha=a;x.lineCap='round';
 for(let k=-1;k<=1;k++){const y=cy+k*10;x.strokeStyle='rgba(255,250,235,.85)';x.lineWidth=5;x.shadowColor='#fff';x.shadowBlur=14;x.beginPath();x.moveTo(80,y);x.lineTo(lerp(90,cx-38,inc),y);x.stroke();}
 // scattered rays
 const out=cl((tt-0.9)/1.6);
 if(out>0){const N=26;for(let i=0;i<N;i++){const r=(i+.5)/N;let ang,col,len;
   if(i%2===0){ang=(r-.5)*0.42;col='rgba(110,175,255,';len=360;} else {ang=(r-.5)*5.6;col='rgba(255,140,80,';len=230;}
   const L=38+(i%2===0?len:200)*ease(out);const pulse=.55+.45*Math.sin(t*6-i);x.strokeStyle=col+(.75*pulse)+')';x.lineWidth=i%2===0?5:3.5;x.shadowColor=i%2===0?'#6fb0ff':'#ff8a50';x.shadowBlur=16;
   x.beginPath();x.moveTo(cx+38*Math.cos(ang),cy+38*Math.sin(ang));x.lineTo(cx+L*Math.cos(ang),cy+L*Math.sin(ang));x.stroke();}}
 x.restore();
 // the grain itself: a lit, rough dust particle
 x.save();x.globalAlpha=a;const gr=x.createRadialGradient(cx-12,cy-12,4,cx,cy,40);gr.addColorStop(0,'#e7b48a');gr.addColorStop(.6,'#9a5a36');gr.addColorStop(1,'#3a2016');
 x.fillStyle=gr;x.beginPath();for(let i=0;i<=40;i++){const q=i/40*2*Math.PI;const rr=34+4*Math.sin(q*5+1)+3*Math.sin(q*3);x.lineTo(cx+rr*Math.cos(q),cy+rr*Math.sin(q));}x.fill();x.restore();
 label('SUNLIGHT',160,cy-34,a*cl(tt/0.6),'#fff3dc',32);
 label('DUST GRAIN',160,cy+64,a*cl(tt/0.6),'#e7c9a8',30);
 label('BLUE: NARROW, FORWARD',600,cy-LBL,a*cl((tt-1.8)/.6),'#9fcbff',30);
 label('RED: SPREADS WIDE',470,cy+LBL+24,a*cl((tt-2.3)/.6),'#ffb08a',30);
}

// labels sit outside the longest ray (blue 398 px to the right, red <= 238 px + glow) so no ray ever crosses text
const DCY=920,LBL=300;
// Earth: an air molecule scatters blue strongly in all directions; red passes almost straight through
function diagramEarth(t,a){
 const cx=470,cy=DCY,tt=t-16.6;
 x.save();x.globalAlpha=a*.55;const gsc=x.createRadialGradient(cx,cy,40,cx,cy,520);gsc.addColorStop(0,'rgba(5,6,12,.8)');gsc.addColorStop(1,'rgba(5,6,12,0)');x.fillStyle=gsc;x.fillRect(0,cy-520,W,1040);x.restore();
 x.save();x.globalCompositeOperation='lighter';x.globalAlpha=a;x.lineCap='round';
 const inc=cl(tt/0.9);
 for(let k=-1;k<=1;k++){const y=cy+k*10;x.strokeStyle='rgba(255,250,235,.85)';x.lineWidth=5;x.shadowColor='#fff';x.shadowBlur=14;x.beginPath();x.moveTo(80,y);x.lineTo(lerp(90,cx-22,inc),y);x.stroke();}
 const out=cl((tt-0.9)/1.6);
 if(out>0){
  // blue: many rays all around (Rayleigh: 1+cos^2 pattern, forward and backward stronger than sideways)
  const N=22;for(let i=0;i<N;i++){const ang=(i+.5)/N*2*Math.PI;const w=(1+Math.cos(ang)**2)/2;const L=26+(110+80*w)*ease(out);const pulse=.55+.45*Math.sin(t*6-i);
   x.strokeStyle='rgba(110,175,255,'+(.8*pulse)+')';x.lineWidth=4;x.shadowColor='#6fb0ff';x.shadowBlur=16;x.beginPath();x.moveTo(cx+26*Math.cos(ang),cy+26*Math.sin(ang));x.lineTo(cx+L*Math.cos(ang),cy+L*Math.sin(ang));x.stroke();}
  // red/orange: the beam carries on almost straight
  for(let k=-1;k<=1;k++){const y=cy+k*9;x.strokeStyle='rgba(255,140,80,.9)';x.lineWidth=5;x.shadowColor='#ff8a50';x.shadowBlur=16;x.beginPath();x.moveTo(cx+26,y);x.lineTo(cx+26+372*ease(out),y+k*6*ease(out));x.stroke();}}
 x.restore();
 // the molecule: two small bonded spheres (N2), much smaller than a dust grain
 x.save();x.globalAlpha=a;for(const dx of [-9,9]){const gr=x.createRadialGradient(cx+dx-4,cy-4,2,cx+dx,cy,13);gr.addColorStop(0,'#e8f0ff');gr.addColorStop(1,'#5a6a90');x.fillStyle=gr;x.beginPath();x.arc(cx+dx,cy,12,0,7);x.fill();}x.restore();
 label('SUNLIGHT',150,cy-34,a*cl(tt/0.6),'#fff3dc',32);
 label('AIR MOLECULE',cx,cy+LBL+24,a*cl(tt/0.6),'#d6e2ff',30);
 label('BLUE: SCATTERED ALL AROUND',540,cy-LBL,a*cl((tt-1.8)/.6),'#9fcbff',30);
 label('RED: GOES STRAIGHT ON',cx,cy+LBL+64,a*cl((tt-2.3)/.6),'#ffb08a',30);
}
