// usage: node snap.js page.html[?query] W H outprefix t1 t2 ...
const {chromium}=require('playwright');
(async()=>{const [pg,W,H,out,...ts]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+W,height:+H}});
await p.goto('file://'+pg);await p.waitForFunction(()=>window.TEXREADY===true);
for(const t of ts){const u=await p.evaluate(t=>{draw(+t);return document.getElementById('c').toDataURL('image/png')},t);
require('fs').writeFileSync(out+'_'+t+'.png',Buffer.from(u.split(',')[1],'base64'));}
await b.close();})();
