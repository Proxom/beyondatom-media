// usage: node render.js <from> <to> ; frames -> scratchpad/vy/f/NNNN.jpg
const {chromium}=require('playwright');const fs=require('fs');const a=+process.argv[2],z=+process.argv[3];
const OUT='/tmp/claude-0/-home-user-beyondatom-media/3009f738-314a-57b2-a770-ce8e0f760bad/scratchpad/vy/f';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));p.on('console',m=>console.log('C',m.text()));
await p.goto('file:///home/user/beyondatom-media/tools/p_voyager-light-day.html');await p.waitForFunction('window.TEXREADY===true');
for(let i=a;i<z;i++){const fn=OUT+'/'+String(i).padStart(4,'0')+'.jpg';if(require('fs').existsSync(fn))continue;
const u=await p.evaluate((t)=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.95)},i/30);
fs.writeFileSync(fn,Buffer.from(u.split(',')[1],'base64'));}
await b.close();console.log('DONE',a,z);})();
