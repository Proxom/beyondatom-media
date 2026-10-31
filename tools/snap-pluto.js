const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));p.on('console',m=>console.log(m.text()));
await p.goto('file://'+__dirname+'/p_pluto-no-full-orbit.html');console.log(await p.evaluate("[TIN,TOUT,BBOX()]"));
for(const t of process.argv.slice(2).map(Number)){const u=await p.evaluate(t=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',.9)},t);
fs.writeFileSync('/tmp/claude-0/pl/s_'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'))}await b.close()})();
