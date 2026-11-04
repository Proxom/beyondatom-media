const {chromium}=require('playwright');const fs=require('fs');const [v,out,...ts]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));p.on('console',m=>console.log('C',m.text()));
await p.goto('file:///home/user/beyondatom-media/tools/p_'+v+'.html');await p.waitForFunction('window.TEXREADY===true');
for(const t of ts){const u=await p.evaluate((t)=>{draw(+t);return document.getElementById('c').toDataURL('image/jpeg',0.9)},t);fs.writeFileSync(out+'/'+v+'_'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'));}
await b.close();})();
