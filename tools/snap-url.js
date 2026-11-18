// usage: node snap2.js url W H outprefix t...
const {chromium}=require('playwright');
(async()=>{const [pg,W,H,out,...ts]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+W,height:+H}});p.on('pageerror',e=>console.log('E',e.message));
await p.goto(pg);await p.waitForFunction(()=>window.TEXREADY===true,null,{timeout:30000});
for(const t of ts){const u=await p.evaluate(t=>{draw(+t);return document.getElementById('c').toDataURL('image/png')},t);
require('fs').writeFileSync(out+'_'+t+'.png',Buffer.from(u.split(',')[1],'base64'));}
await b.close();})();
