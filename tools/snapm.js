const {chromium}=require('playwright');const v=process.argv[2];const ts=process.argv.slice(3).map(Number);
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));p.on('console',m=>console.log('C',m.text()));
await p.goto('file://'+__dirname+'/p_'+v+'.html');await p.waitForFunction('window.TEXREADY===true');
for(const t of ts){const t0=Date.now();const u=await p.evaluate((t)=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.9)},t);
require('fs').writeFileSync('/tmp/mars/s_'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'));console.log(t,Date.now()-t0,'ms');}
await b.close();})();
