require('./pluto-model.js');const fs=require('fs');
const rot=(-90-224.06676)*Math.PI/180;const pan=y=>{const p=PLUTO(y);return Math.max(-.6,Math.min(.6,p.r*Math.cos(p.lon+rot)/45))};
const hits=[{t:0.02,kind:'bell',note:5,vel:.55,pan:pan(Y0)}];
let prev=YEAR(0);let k=0;
for(let i=1;i<=900;i++){const t=i/30;const y=YEAR(t);
 for(let d=Math.floor(prev/10)*10+10;d<=y;d+=10){ if(t<14){hits.push({t:t,kind:'marimba',note:3+(k%5),vel:.42,pan:pan(y)});k++}
   else if(d%20===0){hits.push({t:t,kind:'marimba',note:4+((d/20)%5),vel:.38,pan:pan(y)})}}
 prev=y;}
const TIN=7.0333,TOUT=10.6;
hits.push({t:TIN,kind:'glass',note:8,vel:.5,pan:pan(YEAR(TIN))},{t:TOUT,kind:'glass',note:6,vel:.45,pan:pan(YEAR(TOUT))});
hits.push({t:13.0,kind:'bell',note:7,vel:.5,pan:pan(YNOW)});
hits.push({t:23.5,kind:'bell',note:5,vel:.6,pan:pan(Y1)},{t:23.5,kind:'bell',note:7,vel:.45,pan:pan(Y1)},{t:23.52,kind:'bell',note:10,vel:.35,pan:pan(Y1)});
fs.writeFileSync('/tmp/claude-0/aud/pluto.json',JSON.stringify({dur:30,seed:4,root:110,bed:'space',bed_db:14,wet:.22,hits,swells:[[16.5,23.5,.35]]}));
console.log(hits.length,hits.map(h=>h.t.toFixed(2)).join(' '));
