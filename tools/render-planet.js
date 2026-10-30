const {chromium}=require('playwright');const fs=require('fs');const v=process.argv[2];
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));
await p.goto('file://'+__dirname+'/p_'+v+'.html');await p.waitForFunction('window.TEXREADY===true');const dir=__dirname+'/f_'+v;fs.mkdirSync(dir,{recursive:true});
for(let i=0;i<900;i++){const fn=dir+'/'+String(i).padStart(4,'0')+'.jpg';if(fs.existsSync(fn))continue;
const u=await p.evaluate((t)=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.95)},i/30);
fs.writeFileSync(fn,Buffer.from(u.split(',')[1],'base64'));if(i%150==0)console.log(v,i,new Date().toISOString());}
await b.close();console.log('DONE',v);})();
