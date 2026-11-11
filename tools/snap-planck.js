// usage: node snap-planck.js <scale> t1 t2 ... -> /tmp/claude-0/pl/snap/t.jpg
const {chromium}=require('playwright');const fs=require('fs');const sc=+process.argv[2];const ts=process.argv.slice(3).map(Number);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});p.on('pageerror',e=>console.log('E',e.message));p.on('console',m=>console.log('C',m.text()));
await p.goto('file://'+__dirname+'/p_planck-length.html');await p.waitForFunction('window.TEXREADY===true');fs.mkdirSync('/tmp/claude-0/pl/snap',{recursive:true});
for(const t of ts){const t0=Date.now();const u=await p.evaluate(([t,sc])=>{draw(t);const c=document.createElement('canvas');c.width=1080*sc;c.height=1920*sc;c.getContext('2d').drawImage(document.getElementById('c'),0,0,c.width,c.height);return c.toDataURL('image/jpeg',.85)},[t,sc]);
fs.writeFileSync('/tmp/claude-0/pl/snap/'+t+'.jpg',Buffer.from(u.split(',')[1],'base64'));console.log(t,Date.now()-t0,'ms')}await b.close()})();
