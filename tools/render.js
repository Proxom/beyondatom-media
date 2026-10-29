const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///tmp/merc/anim.html');fs.mkdirSync('/tmp/merc/f',{recursive:true});
const FPS=30,T=28;for(let i=0;i<FPS*T;i++){const u=await p.evaluate((t)=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.92)},i/FPS);
fs.writeFileSync('/tmp/merc/f/'+String(i).padStart(4,'0')+'.jpg',Buffer.from(u.split(',')[1],'base64'));}
await b.close();})();
