// "Could You Survive a Jump From 39 km?" — our own version of the 1M+ "Felix Baumgartner jump from the edge of space" topic.
// Original animation: Earth rendered from NASA Blue Marble textures (tex.js) at the real altitudes, stylized pressure-suit figure.
// Facts (FAI ratified records 22 Feb 2013; Red Bull Stratos final mission data 2012):
//   exit altitude 38,969.4 m above Roswell NM, 14 Oct 2012; Mach 1 34 s into freefall; max 1,357.6 km/h (Mach 1.25) at 50 s;
//   flat spin about 13 s; freefall 4 min 20 s; chute at 2,566.8 m MSL. Eustace 2014: 41,422 m (FAI).
const W=1080,H=1920,END=39.6;
const g=document.getElementById('g'),gl=g.getContext('webgl',{preserveDrawingBuffer:true});
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o}
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}'));
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,document.getElementById('fs').text));gl.linkProgram(pr);gl.useProgram(pr);
const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);const U=n=>gl.getUniformLocation(pr,n);
function mkTex(src,unit,cb){const im=new Image();im.onload=()=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);cb()};im.src=src;}
let _tl=0;const ready=()=>{_tl++;if(_tl==3)window.TEXREADY=true};
mkTex(TEXA,0,ready);mkTex(TEXC,1,ready);
Promise.all([document.fonts.load('110px Anton'),document.fonts.load('50px MontX')]).then(ready);
gl.uniform1i(U('TEX'),0);gl.uniform1i(U('CLD'),1);
const c=document.getElementById('c'),x=c.getContext('2d');
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=cl(t);return t*t*(3-2*t)},eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const lerp=(a,b,t)=>a+(b-a)*t,DEG=Math.PI/180,seg=(t,a,b)=>cl((t-a)/(b-a));
const norm=v=>{const l=Math.hypot(...v);return v.map(a=>a/l)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add3=(a,b,s=1)=>a.map((v,i)=>v+b[i]*s),mul3=(a,s)=>a.map(v=>v*s);
// local frame above Roswell, New Mexico (33.4 N, 104.5 W); texture convention: lon=atan(x,z)
const LAT=33.4*DEG,LON=-104.5*DEG;
const UP=[Math.cos(LAT)*Math.sin(LON),Math.sin(LAT),Math.cos(LAT)*Math.cos(LON)];
const EAST=norm(cross([0,1,0],UP)),NORTH=cross(UP,EAST);
const dirLocal=(yaw,pitch)=>add3(add3(mul3(NORTH,Math.cos(pitch)*Math.cos(yaw)),EAST,Math.cos(pitch)*Math.sin(yaw)),UP,Math.sin(pitch));
const SUNV=dirLocal(165*DEG,42*DEG);
function camMat(yaw,pitch,roll){const f=dirLocal(yaw,pitch);let r=add3(mul3(EAST,Math.cos(yaw)),NORTH,-Math.sin(yaw));
 const u0=cross(r,f);const cr=Math.cos(roll),sr=Math.sin(roll);const r2=add3(mul3(r,cr),u0,sr),u2=add3(mul3(r,-sr),u0,cr);
 return [...r2,...u2,...mul3(f,-1)];}
function sky(s){gl.viewport(0,0,W,H);gl.uniform2f(U('R'),W,H);gl.uniform3fv(U('SUN'),SUNV);gl.uniform3fv(U('UP'),UP);gl.uniform3fv(U('EAST'),EAST);
 gl.uniform3fv(U('NORTH'),NORTH);gl.uniform3fv(U('OFF'),[0,0,0]);gl.uniformMatrix3fv(U('CM'),false,camMat(s.yaw,s.pitch,s.roll||0));
 gl.uniform1f(U('FOV'),s.fov);gl.uniform1f(U('HB'),s.alt);gl.uniform1f(U('RE'),6371.0);gl.uniform1f(U('BLUR'),s.blur||0);gl.uniform1f(U('EXPO'),s.expo||1);gl.uniform1f(U('FISH'),s.fish===undefined?.55:s.fish);
 gl.drawArrays(gl.TRIANGLES,0,3);x.save();x.globalAlpha=1;x.filter='none';x.drawImage(g,0,0);
 x.globalCompositeOperation='lighter';x.filter='blur(30px)';x.globalAlpha=.18;x.drawImage(g,0,0);x.restore();}
// ---------- deterministic random
let _s=7;const rnd=()=>{_s=(_s*16807)%2147483647;return _s/2147483647};const STREAK=[];for(let i=0;i<70;i++)STREAK.push([rnd(),rnd(),rnd(),rnd()]);
// ---------- text
const TX=495;
function txt(s,y,size,a,font='Anton',col='#fff'){if(a<=0.01)return;x.save();x.globalAlpha=cl(a);x.font=size+'px '+font;x.textAlign='center';x.textBaseline='alphabetic';
 let w=x.measureText(s).width;if(w>840){size=Math.floor(size*840/w);x.font=size+'px '+font;}
 x.shadowColor='rgba(0,0,0,.75)';x.shadowBlur=22;x.shadowOffsetY=4;x.fillStyle=col;x.fillText(s,TX,y);x.shadowBlur=6;x.fillText(s,TX,y);x.restore();}
const fadeIO=(t,a,b,f=.25)=>Math.min(seg(t,a,a+f),1-seg(t,b-f,b));
// ---------- figure: stylized pressure suit (white), parachute container (slate), seen from behind
const SUIT='#e4e7eb',SUITD='#9aa3ae',SUITL='#fbfcfd',PACK='#46505c',PACKL='#66717e',BOOT='#2f343b';
function limb(pts,w){x.lineCap='round';x.lineJoin='round';const path=()=>{x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);};
 x.save();x.translate(-w*.10,w*.06);path();x.strokeStyle=SUITD;x.lineWidth=w;x.stroke();x.restore();
 path();x.strokeStyle=SUIT;x.lineWidth=w*.9;x.stroke();x.save();x.translate(w*.16,-w*.05);path();x.strokeStyle=SUITL;x.globalAlpha=.75;x.lineWidth=w*.35;x.stroke();x.restore();}
function glove(px,py,r){x.beginPath();x.arc(px,py,r,0,7);x.fillStyle=BOOT;x.fill();}
function visor(cx,cy,r,side=1){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.clip();
 const vg=x.createLinearGradient(cx+side*r*.3,cy-r,cx+side*r,cy+r*.4);vg.addColorStop(0,'#1b2433');vg.addColorStop(.45,'#3b5a85');vg.addColorStop(.6,'#c99a3b');vg.addColorStop(1,'#20283a');
 x.beginPath();x.ellipse(cx+side*r*.95,cy+r*.05,r*.55,r*.72,side*.25,0,7);x.fillStyle=vg;x.fill();
 x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=r*.07;x.beginPath();x.ellipse(cx+side*r*.95,cy+r*.05,r*.45,r*.6,side*.25,-2.4,-1.6);x.stroke();x.restore();}
function helmetBack(cx,cy,r){const gr=x.createRadialGradient(cx+r*.35,cy-r*.4,r*.1,cx,cy,r*1.05);gr.addColorStop(0,'#ffffff');gr.addColorStop(.6,'#dfe3e8');gr.addColorStop(1,'#8d96a1');
 x.beginPath();x.arc(cx,cy,r,0,7);x.fillStyle=gr;x.fill();visor(cx,cy,r,1);
 x.strokeStyle='rgba(90,98,110,.6)';x.lineWidth=r*.05;x.beginPath();x.arc(cx,cy,r*.97,-2.3,-.9);x.stroke();
 x.beginPath();x.ellipse(cx,cy+r*.92,r*.8,r*.24,0,0,7);x.fillStyle='#5f6873';x.fill();x.beginPath();x.ellipse(cx,cy+r*.88,r*.8,r*.12,0,0,7);x.fillStyle='#aab2bb';x.fill();}
function torso(w1,w2,y1,y2){const gr=x.createLinearGradient(-w1/2,0,w1/2,0);gr.addColorStop(0,SUITD);gr.addColorStop(.35,SUIT);gr.addColorStop(.8,SUITL);gr.addColorStop(1,'#c9ced5');
 x.beginPath();x.moveTo(-w1/2,y1+30);x.quadraticCurveTo(-w1/2,y1,-w1/2+30,y1);x.lineTo(w1/2-30,y1);x.quadraticCurveTo(w1/2,y1,w1/2,y1+30);x.lineTo(w2/2,y2);x.lineTo(-w2/2,y2);x.closePath();x.fillStyle=gr;x.fill();}
function hose(w,y1){x.save();x.strokeStyle='#3a3f47';x.lineWidth=16;x.lineCap='round';x.beginPath();x.moveTo(w*.42,y1+30);x.bezierCurveTo(w*.75,y1-20,w*.6,y1-90,w*.28,y1-110);x.stroke();
 x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=4;x.stroke();x.restore();}
function pack(w,y1,y2){const gr=x.createLinearGradient(-w/2,0,w/2,0);gr.addColorStop(0,'#323a44');gr.addColorStop(.7,PACKL);gr.addColorStop(1,'#4b5561');
 x.beginPath();x.roundRect(-w/2,y1,w,y2-y1,22);x.fillStyle=gr;x.fill();x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=3;x.stroke();
 x.fillStyle='#2a3038';x.fillRect(-w/2-14,y1+18,14,(y2-y1)*.7);x.fillRect(w/2,y1+18,14,(y2-y1)*.7);
 x.fillStyle='#c9a227';x.globalAlpha=.85;x.fillRect(-w*.32,y1+(y2-y1)*.42,w*.64,10);x.globalAlpha=1;}
// standing, back view; origin at feet; k = scale (1 => 640 px tall); lean squashes it (tipping forward, away from camera)
function standing(fx,fy,k,lean=0,dangle=0){x.save();x.translate(fx,fy);x.scale(k,k*Math.cos(lean));
 const lg=dangle;limb([[-46,-300],[-50-lg*10,-150],[-48-lg*16,-40]],78);limb([[46,-300],[50+lg*8,-150],[48+lg*20,-40]],78);
 x.fillStyle=BOOT;x.beginPath();x.roundRect(-92-lg*16,-62,82,66,18);x.fill();x.beginPath();x.roundRect(10+lg*20,-62,82,66,18);x.fill();
 const arm=lg>0?-1:0;limb([[-98,-500],[-128,-410+arm*120],[-120,-330+arm*230]],60);limb([[98,-500],[128,-410+arm*120],[120,-330+arm*230]],60);
 glove(-120,-318+arm*235,30);glove(120,-318+arm*235,30);
 torso(210,170,-530,-290);x.strokeStyle='rgba(120,128,140,.5)';x.lineWidth=4;x.beginPath();x.moveTo(-95,-420);x.lineTo(95,-420);x.moveTo(-80,-300);x.lineTo(80,-300);x.stroke();pack(160,-505,-318);hose(160,-505);helmetBack(0,-590,80);x.restore();}
// freefall, seen from above/behind (back up): origin at body center, rot in radians, k scale (1 => ~600 px long)
function boxPose(cx,cy,k,rot,flail=0){x.save();x.translate(cx,cy);x.rotate(rot);x.scale(k,k);
 const f=flail;limb([[-50,90],[-130,190+f*20],[-120,300]],76);limb([[50,90],[130,190-f*20],[120,300]],76);
 x.fillStyle=BOOT;x.beginPath();x.roundRect(-160,290,80,60,18);x.fill();x.beginPath();x.roundRect(80,290,80,60,18);x.fill();
 limb([[-95,-110],[-210,-80+f*30],[-235,-200+f*20]],60);limb([[95,-110],[210,-80-f*30],[235,-200-f*20]],60);glove(-238,-215+f*20,30);glove(238,-215-f*20,30);
 torso(210,175,-140,110);pack(160,-115,85);hose(160,-115);helmetBack(0,-200,82);x.restore();}
// ram-air canopy above the jumper (back view); open 0..1
function canopy(cx,cy,w,open,lineTo){if(open<=0)return;const ww=w*(.25+.75*ease(open)),hh=95*(.5+.5*ease(open));
 x.save();x.globalAlpha=cl(open*3);x.strokeStyle='rgba(230,230,230,.55)';x.lineWidth=2.5;
 for(let i=0;i<=8;i++){const px=cx-ww/2+ww*i/8;x.beginPath();x.moveTo(px,cy+hh*.7);x.lineTo(lineTo[0]+(i<4?-40:40),lineTo[1]);x.stroke();}
 const gr=x.createLinearGradient(0,cy-hh,0,cy+hh);gr.addColorStop(0,'#ff8a3d');gr.addColorStop(1,'#c2410c');
 x.beginPath();x.moveTo(cx-ww/2,cy+hh*.6);x.quadraticCurveTo(cx,cy-hh*1.25,cx+ww/2,cy+hh*.6);x.quadraticCurveTo(cx,cy+hh*.05,cx-ww/2,cy+hh*.6);x.fillStyle=gr;x.fill();
 x.strokeStyle='rgba(120,40,10,.55)';x.lineWidth=3;for(let i=1;i<8;i++){const px=cx-ww/2+ww*i/8;const yy=cy+hh*.6-(1-Math.pow(2*i/8-1,2))*hh*1.05;x.beginPath();x.moveTo(px,yy);x.lineTo(px,yy+hh*.55);x.stroke();}
 x.fillStyle='rgba(255,255,255,.85)';for(const i of [3,4]){const px=cx-ww/2+ww*i/8;const yy=cy+hh*.6-(1-Math.pow(2*(i+.5)/8-1,2))*hh*1.05;x.beginPath();x.moveTo(px,yy+4);x.lineTo(px+ww/8,yy+4);x.lineTo(px+ww/8,yy+hh*.5);x.lineTo(px,yy+hh*.5);x.fill();}
 x.restore();}
// capsule interior around the open door; s = push-in scale about (540,1000)
function door(s){x.save();x.translate(540,1000);x.scale(s,s);x.translate(-540,-1000);
 x.beginPath();x.rect(-400,-400,W+800,H+800);x.roundRect(95,200,890,1380,60);
 const gr=x.createRadialGradient(540,900,300,540,900,1100);gr.addColorStop(0,'#5b636d');gr.addColorStop(.5,'#2c3239');gr.addColorStop(1,'#121519');x.fillStyle=gr;x.fill('evenodd');
 // door frame rim
 x.lineWidth=30;x.strokeStyle='#8d959e';x.beginPath();x.roundRect(95,200,890,1380,60);x.stroke();x.lineWidth=5;x.strokeStyle='rgba(255,255,255,.55)';x.beginPath();x.roundRect(111,216,858,1348,48);x.stroke();
 // panel seams and rivets on the walls
 x.strokeStyle='rgba(255,255,255,.07)';x.lineWidth=3;for(const yy of [180,700,1250,1700]){x.beginPath();x.moveTo(-200,yy);x.lineTo(140,yy+40);x.stroke();x.beginPath();x.moveTo(940,yy+40);x.lineTo(1300,yy);x.stroke();}
 x.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<14;i++){x.beginPath();x.arc(55,320+i*90,5,0,7);x.fill();x.beginPath();x.arc(1025,320+i*90,5,0,7);x.fill();}
 // handrails
 x.lineCap='round';x.strokeStyle='#b9c0c8';x.lineWidth=20;x.beginPath();x.moveTo(40,700);x.lineTo(40,1150);x.stroke();x.beginPath();x.moveTo(1040,700);x.lineTo(1040,1150);x.stroke();
 // step (exterior platform) seen from behind/above
 x.beginPath();x.moveTo(250,1560);x.lineTo(830,1560);x.lineTo(760,1395);x.lineTo(320,1395);x.closePath();const sg=x.createLinearGradient(0,1395,0,1560);sg.addColorStop(0,'#b5bcc4');sg.addColorStop(1,'#6e767f');x.fillStyle=sg;x.fill();
 x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=3;for(let i=1;i<7;i++){const yy=1395+i*24;const k=(yy-1395)/165;x.beginPath();x.moveTo(320-70*k,yy);x.lineTo(760+70*k,yy);x.stroke();}
 x.fillStyle='#d4a72c';x.fillRect(320,1388,440,10);
 x.restore();}
function vignette(a=.55,col='0,0,0'){const vg=x.createRadialGradient(W/2,H*.52,H*.28,W/2,H*.52,H*.8);vg.addColorStop(0,`rgba(${col},0)`);vg.addColorStop(1,`rgba(${col},${a})`);x.fillStyle=vg;x.fillRect(0,0,W,H);}
function streaks(t,speed,a){if(a<=0)return;x.save();x.globalCompositeOperation='lighter';x.lineCap='round';
 for(const s of STREAK){const yy=((s[1]*H*1.4-t*speed*(400+s[2]*500))%(H*1.4)+H*1.4)%(H*1.4)-H*.2;const len=40+speed*(60+s[3]*120);
  x.strokeStyle=`rgba(225,235,255,${a*(.10+s[3]*.22)})`;x.lineWidth=1.5+s[2]*2.5;x.beginPath();x.moveTo(s[0]*W,yy);x.lineTo(s[0]*W,yy+len);x.stroke();}
 x.restore();}
const fmt=n=>Math.round(n).toLocaleString('en-US');
// ---------- timeline (voice line starts: 0.2 hook, 3.6 2012, 8.8 suit, 13.45 stepped off, 15.0 Mach, 18.6 top speed, 23.3 spin, 27.55 fought, 29.3 chute, 33.8 twist)
const T={door2:3.5,boots:3.5,door3:8.7,lean:13.45,dive:14.6,mach:17.9,top:21.6,spin:23.2,fight:27.55,steady:28.9,chute:32.6,twist:34.5,rise1:37.1,fol:38.2,loop:39.3};
function speedAt(t){if(t<T.dive)return 0;const tau=t<T.mach?34*seg(t,T.dive,T.mach):lerp(34,50,seg(t,T.mach+.9,T.mach+1.7));return tau<=34?1115*Math.pow(tau/34,.9):lerp(1115,1357.6,(tau-34)/16);}
window.draw=t=>{if(t>=T.loop)t=0;x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.filter='none';
 const shake=(a)=>[(Math.sin(t*53.1)+Math.sin(t*31.7))*a,(Math.sin(t*47.3)+Math.cos(t*29.9))*a];
 if(t<T.boots){ // S1 door, push-in, figure on the step
  const p=seg(t,0,T.boots);const s=1.06+.12*p;sky({alt:38.97,yaw:62*DEG,pitch:(-7+2*p)*DEG,fov:Math.tan(42*DEG)/(1+.08*p),fish:.7});
  door(s);x.save();x.translate(540,1000);x.scale(s,s);x.translate(-540,-1000);standing(540,1405,1.18);x.restore();vignette(.35);
  txt('JUMP FROM 39 KM UP?',520,118,fadeIO(t,-1,T.boots+.1,.2));
 } else if(t<T.door3){ // S2 his view: boots at the edge, looking straight down 39 km
  const p=seg(t,T.boots,T.door3);sky({alt:38.97,yaw:(62+8*p)*DEG,pitch:(-58-14*ease(p))*DEG,fov:Math.tan(34*DEG)*(1-.08*p)});
  x.save();const k2=1+.06*p;x.translate(540,1250);x.scale(k2,k2);
  x.beginPath();x.moveTo(-330,60);x.lineTo(330,60);x.lineTo(420,760);x.lineTo(-420,760);x.closePath();const sg=x.createLinearGradient(0,60,0,760);sg.addColorStop(0,'#c3c9d0');sg.addColorStop(1,'#59616a');x.fillStyle=sg;x.fill();
  x.strokeStyle='rgba(0,0,0,.22)';x.lineWidth=3;for(let i=1;i<9;i++){const yy=60+i*70;const w=330+90*i/10;x.beginPath();x.moveTo(-w,yy);x.lineTo(w,yy);x.stroke();}
  x.fillStyle='#d4a72c';x.fillRect(-330,48,660,14);
  x.fillStyle=BOOT;x.beginPath();x.roundRect(-130,20,95,150,40);x.fill();x.beginPath();x.roundRect(35,20,95,150,40);x.fill();
  x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.roundRect(-118,32,26,110,13);x.fill();x.beginPath();x.roundRect(47,32,26,110,13);x.fill();
  x.beginPath();x.ellipse(0,170,250,150,0,0,7);const sh2=x.createLinearGradient(-250,0,250,0);sh2.addColorStop(0,SUITD);sh2.addColorStop(.6,SUIT);sh2.addColorStop(1,SUITL);x.fillStyle=sh2;x.fill();
  limb([[-215,190],[-250,80]],80);limb([[215,190],[250,80]],80);glove(-252,66,34);glove(252,66,34);
  x.fillStyle=PACK;x.beginPath();x.roundRect(-140,215,280,170,30);x.fill();x.fillStyle='#c9a227';x.fillRect(-85,290,170,12);
  helmetBack(0,95,112);x.restore();vignette(.45);
  txt('39 KM UP',500,150,fadeIO(t,T.boots,T.door3));txt('ROSWELL, NEW MEXICO · 2012',590,50,fadeIO(t,T.boots+.3,T.door3)*.95,'MontX');
 } else if(t<T.dive){ // S3 back at the door, closer; lean and step off at 13.45
  const p=seg(t,T.door3,T.lean);const s=1.14+.10*p;sky({alt:38.97,yaw:58*DEG,pitch:(-8-10*seg(t,T.lean,T.dive))*DEG,fov:Math.tan(34*DEG),fish:.7});
  door(s);const lean=ease(seg(t,T.lean,T.lean+.55))*1.15;const fall=seg(t,T.lean+.45,T.dive);
  x.save();x.translate(540,1000);x.scale(s,s);x.translate(-540,-1000);
  if(fall<=0)standing(540,1400,1.0,lean);else{const k=1-.75*ease(fall);boxPose(540,1400+fall*120-260*k,.85*k,0);}
  x.restore();vignette(.35);
  txt('NO SUIT? BODY WATER BOILS',520,104,fadeIO(t,T.door3,T.lean-.05));txt('HE STEPPED OFF',520,118,fadeIO(t,T.lean,T.dive+.1,.15));
 } else if(t<T.spin){ // S4 follow cam above/behind, accelerating
  const p=seg(t,T.dive,T.spin);const alt=lerp(38.6,25.5,ease(p));const v=speedAt(t);const vn=v/1357.6;
  const intro=seg(t,T.dive,T.dive+.7);const [sx,sy]=shake(1.5+6*vn);
  x.save();x.translate(sx,sy);sky({alt,yaw:62*DEG,pitch:(-52-10*p)*DEG,fov:Math.tan(32*DEG)*(1.5-.5*ease(intro))});x.restore();
  streaks(t,.4+vn*1.6,.5+vn*.6);
  const k=lerp(.5,1.08,ease(intro));boxPose(540+sx,1030+sy,k,Math.sin(t*1.3)*.06,Math.sin(t*7)*.3*vn);
  const mf=seg(t,T.mach,T.mach+.7);if(mf>0&&mf<1){x.save();x.globalCompositeOperation='lighter';x.filter='blur(14px)';x.strokeStyle=`rgba(255,255,255,${.55*(1-mf)})`;x.lineWidth=40*(1-mf)+6;x.beginPath();x.ellipse(540,1030,120+700*mf,80+460*mf,0,0,7);x.stroke();
   x.filter='none';x.fillStyle=`rgba(255,255,255,${.22*(1-mf)})`;x.fillRect(0,0,W,H);x.restore();}
  vignette(.5);
  const inMach=fadeIO(t,T.mach-.1,T.mach+.95,.15);
  txt(fmt(v),560,170,fadeIO(t,T.dive+.3,T.mach-.05,.15));txt('KM/H',630,56,fadeIO(t,T.dive+.3,T.mach-.05,.15),'MontX');
  txt('MACH 1',560,190,inMach);txt('SPEED OF SOUND · 34 s IN',630,48,inMach,'MontX');
  const tp=fadeIO(t,T.mach+.85,T.spin+.1,.15);txt(fmt(v),560,170,tp);txt(t>T.mach+1.65?'KM/H · TOP SPEED':'KM/H',630,56,tp,'MontX');
 } else if(t<T.twist){ // S5 spin (23.2-28.9), then calm free fall + chute
  if(t<T.steady+.4){const p=seg(t,T.spin,T.steady);
   const rate=(t<T.fight?lerp(.3,1.0,ease(seg(t,T.spin,T.spin+2.2))):lerp(1.0,0,ease(seg(t,T.fight,T.steady))));
   const ang=(()=>{let a=0;const n=60;for(let i=0;i<n;i++){const tt=T.spin+(t-T.spin)*i/n;const r=(tt<T.fight?lerp(.3,1.0,ease(seg(tt,T.spin,T.spin+2.2))):lerp(1.0,0,ease(seg(tt,T.fight,T.steady))));a+=r*(t-T.spin)/n;}return a*2*Math.PI;})();
   const alt=lerp(25.5,18,p);sky({alt,yaw:62*DEG,pitch:-86*DEG,roll:-ang*.55,fov:Math.tan(36*DEG),blur:rate*2*Math.PI*.55/30*2.2});
   streaks(t,.6+rate,.35);boxPose(540,1020,1.0,ang*.45+Math.PI*.02,rate*.8);
   vignette(.45+.35*rate,'90,0,0');vignette(.4);
   txt('FLAT SPIN',540,170,fadeIO(t,T.spin+.1,T.fight-.05,.2));txt('ABOUT 13 SECONDS',610,56,fadeIO(t,T.spin+.4,T.fight-.05,.2),'MontX');
   txt('HE FIGHTS OUT',540,140,fadeIO(t,T.fight,T.steady+.4,.2));}
  else{ // calm free fall, altitude counter, chute opens at T.chute
   const p=seg(t,T.steady+.4,T.chute);const alt=t<T.chute?lerp(18,2.57,Math.pow(p,1.35)):lerp(2.57,2.2,seg(t,T.chute,T.twist));
   const op=seg(t,T.chute,T.chute+.55);const tilt=ease(seg(t,T.chute+.1,T.chute+1.0));
   sky({alt,yaw:62*DEG,pitch:lerp(-80,-10,tilt)*DEG,fov:Math.tan(34*DEG),fish:lerp(.55,.12,tilt),expo:1+.15*tilt});
   if(t<T.chute+.1){streaks(t,1.0,.35);boxPose(540,1030,1.0,Math.sin(t)*.04,.1);}
   else{const jerk=Math.exp(-(t-T.chute)*4)*80;const fy=lerp(1420,1560,tilt)-jerk;canopy(540,lerp(980,800,tilt),820,op*1.1,[540,fy-360]);standing(540,fy,.7,0,1);}
   vignette(.4);
   txt(alt.toFixed(1)+' KM',560,160,fadeIO(t,T.steady+.5,T.chute,.2));txt('ALTITUDE',625,52,fadeIO(t,T.steady+.5,T.chute,.2),'MontX');
   txt('CHUTE OPEN · 4:20',560,120,fadeIO(t,T.chute+.05,T.chute+1.25,.2));txt('OF FREE FALL',625,52,fadeIO(t,T.chute+.2,T.chute+1.25,.2),'MontX');txt('HE LANDED SAFELY',560,120,fadeIO(t,T.chute+1.25,T.twist+.05,.2),'Anton','#9be59b');}
 } else { // S7 the camera rises back to the stratosphere: twist + guess, then follow line, then loop cut
  const p=eio(seg(t,T.twist,T.rise1));const alt=lerp(2.2,41.4,Math.pow(p,1.6));
  sky({alt,yaw:(62+10*p)*DEG,pitch:lerp(-10,-4,p)*DEG,fov:Math.tan(32*DEG),fish:lerp(.12,.6,p)});vignette(.4);
  {const d=1400*Math.pow(seg(t,T.twist,T.twist+1.0),1.6);if(d<1400){canopy(540,800+d,820,1,[540,1200+d]);standing(540,1560+d,.7,0,1);}}
  txt('2 YEARS LATER…',500,92,fadeIO(t,T.twist,T.fol,.2));txt('SOMEONE JUMPED HIGHER',610,104,fadeIO(t,T.twist+.3,T.fol,.2));
  txt('HOW HIGH? GUESS!',760,96,fadeIO(t,T.rise1+.3,T.loop,.2),'Anton','#ffd166');
  txt('Follow for more space',1400,50,fadeIO(t,T.fol,T.loop,.15),'MontX');}
};
