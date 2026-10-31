// builds the hit list for sound-v2.py from the same light-time model as the picture
require('./voyager-model.js');const fs=require('fs');const {Lof,LM,LS,LN,LV,TICKS}=VM;
const out=process.argv[2];const pan=-0.45;const hits=[{t:0.02,kind:'bell',note:5,vel:.5,pan}];
// tick crossings: rising marimba notes, found numerically on the picture's own timeline
let prev=Lof(0);let k=0;
for(let i=1;i<=900;i++){const t=i/30,L=Lof(t);for(const [Lt] of TICKS.slice(0,6)){if(prev<Lt&&L>=Lt){hits.push({t,kind:'marimba',note:2+k,vel:.4,pan});k++}}prev=L}
hits.push({t:3.6,kind:'glass',note:8,vel:.5,pan},{t:10.4,kind:'bell',note:7,vel:.5,pan},{t:17.4,kind:'bell',note:9,vel:.5,pan},
 {t:24.0,kind:'bell',note:5,vel:.6,pan},{t:24.0,kind:'bell',note:7,vel:.45,pan},{t:24.02,kind:'bell',note:10,vel:.35,pan});
fs.writeFileSync(out,JSON.stringify({dur:30,seed:9,root:110,bed:'space',bed_db:14,wet:.22,hits,swells:[[19.6,24.0,.35]]}));
console.log(hits.length,hits.map(h=>h.t.toFixed(2)).join(' '));
